"""Prepare the supplied Skill PNG without painting or replacing any RGB pixels.

The existing traced contours use the prior mobile attachment's reference grid.
Only mask coordinates are transformed. The new original is never resampled.
Pillow decodes/crops/encodes; numpy writes alpha, not scenery or floor pixels.
"""
from pathlib import Path
import hashlib
import json
import numpy as np
from PIL import Image

project = Path(__file__).resolve().parents[1]
root = project / 'src/assets/scenes/florist'
source_path = root / 'florist_original_concept.png'
source = Image.open(source_path).convert('RGBA')
assert source.size == (1199, 1312)
reference = json.loads((project / 'src/assets/florist-original/regions.json').read_text())
sx, sy = source.width / reference['width'], source.height / reference['height']
world_scale = reference['height'] / source.height

def inside(xs, ys, points):
    mask = np.zeros(xs.shape, dtype=bool)
    for a, b in zip(points, points[1:] + points[:1]):
        if a[1] == b[1]:
            continue
        mask ^= ((a[1] > ys) != (b[1] > ys)) & (xs < (b[0]-a[0])*(ys-a[1])/(b[1]-a[1])+a[0])
    return mask

regions, frames = [], []
for old in reference['layers']:
    layer = {'id': old['id'], 'outline': [[round(x*sx), round(y*sy)] for x,y in old['outline']],
             'foot': [[x*sx, y*sy] for x,y in old['foot']]}
    regions.append(layer)
    pts = layer['outline']
    x, y = max(0, min(p[0] for p in pts)-1), max(0, min(p[1] for p in pts)-1)
    right, bottom = min(source.width, max(p[0] for p in pts)+2), min(source.height, max(p[1] for p in pts)+2)
    original_crop = np.array(source.crop((x, y, right, bottom)))
    rgba = original_crop.copy()
    yy, xx = np.mgrid[y:bottom, x:right]
    rgba[:, :, 3] = inside(xx+.5, yy+.5, pts).astype(np.uint8)*255
    assert np.array_equal(rgba[:, :, :3], original_crop[:, :, :3])
    filename = layer['id'] + '.png'
    Image.fromarray(rgba).save(root / filename, optimize=True)
    frames.append({'id': layer['id'], 'file': filename,
                   'sourceRect': [x, y, right-x, bottom-y],
                   'x': x*world_scale, 'y': y*world_scale,
                   'w': (right-x)*world_scale, 'h': (bottom-y)*world_scale,
                   'foot': [[px*world_scale, py*world_scale] for px,py in layer['foot']]})

composite = source.copy()
for f in frames:
    composite.alpha_composite(Image.open(root / f['file']), tuple(f['sourceRect'][:2]))
assert composite.tobytes() == source.tobytes(), 'Foreground composition must reproduce every original pixel'
sha = hashlib.sha256(source_path.read_bytes()).hexdigest()
(root / 'layers.json').write_text(json.dumps({'width': source.width, 'height': source.height,
    'worldScale': world_scale, 'frames': frames, 'sourceSha256': sha,
    'pixelIdentityVerified': True}, indent=2) + '\n')
(root / 'regions.json').write_text(json.dumps({'width': source.width, 'height': source.height, 'layers': regions}, indent=2) + '\n')
(root / 'SOURCE.json').write_text(json.dumps({'name': '晚风花铺高清原画',
    'source': 'User-uploaded ZIP: .agents/skills/xiguang-scene-art/assets/florist_original_concept.png',
    'author': 'User-provided concept art; no named artist supplied',
    'permission': 'User explicitly authorized integration, modification and public preview in this project; no third-party CC0 claim',
    'format': 'PNG RGB', 'width': source.width, 'height': source.height, 'sha256': sha,
    'changes': 'Original bytes unchanged. Six cropped PNGs change alpha only; no generated furniture, tiles or painted RGB.'}, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'originalSha256': sha, 'originalBytes': source_path.stat().st_size,
    'occluderBytes': sum((root / f['file']).stat().st_size for f in frames),
    'layers': len(frames), 'pixelIdentityVerified': True}))
