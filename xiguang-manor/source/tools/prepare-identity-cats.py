"""Crop original cat animation paintings and an inpainted, replaceable aurora actor area.
Technical alpha cleanup/alignment only; preserve the authored pixels and originals.
"""
from pathlib import Path
from PIL import Image
import numpy as np,json,hashlib,shutil
from collections import deque
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'src/assets/identity';SRC=OUT/'originals/cats';CAT=OUT/'cats';SRC.mkdir(parents=True,exist_ok=True);CAT.mkdir(exist_ok=True)
files={'white':'exec-def0af38-bb70-4976-b29b-6d3a7a0da6a1.png','orange':'exec-26371dd3-7e36-4eb7-b0f9-8f36d42ab9a2.png','tuxedo':'exec-ee4135ee-4f12-4033-9b0d-2acbac157d5e.png','calico':'exec-8c6e4b91-a1b6-47c5-a062-34e99281fd23.png','black':'exec-6fa42bf1-ffc4-4e50-bc42-3c9824495f00.png','gray':'exec-c24041aa-68de-454b-8c40-be23d0ba5a9b.png','tabby':'exec-5df6c8a1-da26-4ccc-9fff-4818c82e276b.png'}
manifest={'width':64,'height':64,'foot':[32,54],'columns':4,'frames':20,'sources':[],'preparation':'Original painting cell crops, largest connected alpha component, common scale and foot anchor, nearest-neighbour resampling, lossless WebP. No generated geometric cat bodies.'}
def extract(im):
 a=np.array(im.convert('RGBA'));a[:,:,3]=np.clip((a[:,:,3].astype(float)-155)*255/100,0,255).astype('uint8');mask=a[:,:,3]>65
 try:
  from scipy.ndimage import label
  labels,count=label(mask);sizes=np.bincount(labels.ravel());sizes[0]=0;selected=labels==sizes.argmax()
 except ImportError:
  seen=np.zeros(mask.shape,bool);best=[]
  for y,x in zip(*np.where(mask)):
   if seen[y,x]:continue
   seen[y,x]=True;part=[];q=deque([(y,x)])
   while q:
    yy,xx=q.popleft();part.append((yy,xx))
    for dy,dx in [(-1,0),(1,0),(0,-1),(0,1)]:
     ny,nx=yy+dy,xx+dx
     if 0<=ny<mask.shape[0]and 0<=nx<mask.shape[1]and mask[ny,nx]and not seen[ny,nx]:seen[ny,nx]=True;q.append((ny,nx))
   if len(part)>len(best):best=part
  selected=np.zeros(mask.shape,bool);ys,xs=zip(*best);selected[ys,xs]=True
 a[~selected]=0;ys,xs=np.where(selected);box=(int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1);return Image.fromarray(a).crop(box),box
for coat,name in files.items():
 target=SRC/(coat+'.png');source=target if target.exists() else Path('/workspace/generated_images')/name
 if source.resolve()!=target.resolve():shutil.copy2(source,target)
 im=Image.open(source);poses=[]
 for row in range(5):
  for col in range(4):
   rect=[round(col*im.width/4),round(row*im.height/5),round((col+1)*im.width/4),round((row+1)*im.height/5)];pose,b=extract(im.crop(rect));poses.append(pose)
 scale=min(52/max(p.height for p in poses),58/max(p.width for p in poses));out=Image.new('RGBA',(256,320))
 for i,p in enumerate(poses):
  p=p.resize((max(1,round(p.width*scale)),max(1,round(p.height*scale))),Image.Resampling.NEAREST);out.alpha_composite(p,(i%4*64+(64-p.width)//2,i//4*64+54-p.height))
 out.save(CAT/(coat+'.webp'),lossless=True,exact=True,method=6);manifest['sources'].append({'coat':coat,'file':'originals/cats/'+coat+'.png','sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'origin':'Original image-generation animation painting for Xiguang Manor, 2026-11-15. Not third-party game art; not declared CC0.'})
(CAT/'atlas.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
# Preserve the supplied aurora and all surroundings; use the generated repair only
# where the old painted person was. Original wooden slats stay in front.
repair=OUT/'originals/aurora-person-repair.png'
if not repair.exists():shutil.copy2(Path('/workspace/generated_images/exec-12901007-7448-4c17-9ed3-2d85069c8293.png'),repair)
patch=Image.open(repair).convert('RGB').resize((720,1280),Image.Resampling.NEAREST)
rectangles=[(375,919,439,973),(375,983,439,991),(375,1001,439,1009)]
for name in ['scene','night-scene']:
 original=Image.open(ROOT/'src/assets/aurora-original'/(name+'.webp')).convert('RGB');out=original.copy()
 for box in rectangles:out.paste(patch.crop(box),box[:2])
 out.save(OUT/('aurora-clean-'+name+'.webp'),lossless=True,exact=True,method=6)
 diff=np.any(np.array(out)!=np.array(original),axis=2);assert not diff[:919].any()and not diff[1010:].any()
front=Image.new('RGBA',(720,1280));original=Image.open(OUT/'aurora-clean-scene.webp').convert('RGBA')
for box in [(274,973,530,983),(275,991,530,1001),(274,1009,532,1051)]:front.alpha_composite(original.crop(box),box[:2])
front.save(OUT/'aurora-bench-front.webp',lossless=True,exact=True,method=6)
(OUT/'aurora-repair.json').write_text(json.dumps({'source':'Original user-supplied aurora scene, unchanged outside the listed person repair rectangles','rectangles':rectangles,'repairSource':'originals/aurora-person-repair.png','generatedRepairSHA256':hashlib.sha256(repair.read_bytes()).hexdigest(),'purpose':'Remove embedded person, draw the current saved avatar once and restore original bench slats in front'},indent=2))
print('Prepared seven original animated cats and image-native empty aurora bench layers')
