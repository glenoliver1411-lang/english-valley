"""Cut alpha-only foreground layers from the user's actual uploaded artwork.

No painting, tiles, resampling, synthesized furniture or replacement RGB pixels.
The received mobile attachment is JPEG; it is copied byte-for-byte as original.jpg.
Pillow only decodes/crops/encodes; numpy writes the alpha masks from traced contours.
"""
from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]/'src/assets/florist-original'
regions=json.loads((ROOT/'regions.json').read_text())
source=Image.open(ROOT/'original.jpg').convert('RGBA')
assert source.size==(regions['width'],regions['height'])
def inside(xs,ys,points):
    mask=np.zeros(xs.shape,dtype=bool)
    for a,b in zip(points,points[1:]+points[:1]):
        if a[1]==b[1]:continue
        mask^=((a[1]>ys)!=(b[1]>ys)) & (xs<(b[0]-a[0])*(ys-a[1])/(b[1]-a[1])+a[0])
    return mask
frames=[]
for layer in regions['layers']:
    pts=layer['outline'];x=max(0,min(p[0]for p in pts)-1);y=max(0,min(p[1]for p in pts)-1)
    right=min(source.width,max(p[0]for p in pts)+2);bottom=min(source.height,max(p[1]for p in pts)+2)
    rgba=np.array(source.crop((x,y,right,bottom)))
    yy,xx=np.mgrid[y:bottom,x:right];mask=inside(xx+.5,yy+.5,pts)
    for hole in layer.get('holes',[]):mask&=~inside(xx+.5,yy+.5,hole)
    rgba[:,:,3]=mask.astype(np.uint8)*255
    output=Image.fromarray(rgba)
    # Every pixel colour, including transparent pixels, must match the source.
    assert np.array_equal(np.array(output)[:,:,:3],np.array(source.crop((x,y,right,bottom)))[:,:,:3])
    name=layer['id']+'.png';output.save(ROOT/name,optimize=True)
    frames.append({'id':layer['id'],'file':name,'x':x,'y':y,'w':right-x,'h':bottom-y,'foot':layer['foot']})
composite=source.copy()
for f in frames:composite.alpha_composite(Image.open(ROOT/f['file']),(f['x'],f['y']))
assert composite.tobytes()==source.tobytes(),'Layered art must be pixel-identical to the received image'
meta={'width':source.width,'height':source.height,'frames':frames,'sourceSha256':hashlib.sha256((ROOT/'original.jpg').read_bytes()).hexdigest(),'pixelIdentityVerified':True}
(ROOT/'layers.json').write_text(json.dumps(meta,indent=2)+'\n')
print('Original retained. Alpha-only layers:',len(frames),'bytes:',sum((ROOT/f['file']).stat().st_size for f in frames),'Composite RGB identity: PASS')
