"""Prepare a clean night plate, using a local illustrated sky repair only.
The uploaded aurora picture is untouched and returns at full brightness.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import numpy as np,json,hashlib
from collections import deque
P=Path(__file__).resolve().parents[1]/'src/assets/aurora-original'
original=Image.open(P/'user-original.jpg').convert('RGB');w,h=original.size
repair=Image.open(P/'night-repair-source.png').convert('RGB').resize((w,h),Image.Resampling.LANCZOS)
mask=Image.new('L',(w,h));ImageDraw.Draw(mask).polygon([(0,250),(65,250),(120,185),(180,135),(260,160),(340,160),(420,135),(520,65),(630,0),(720,0),(720,310),(610,380),(520,435),(390,480),(270,515),(210,565),(120,575),(0,575)],fill=255)
mask=mask.filter(ImageFilter.GaussianBlur(22));m=np.array(mask).astype(float)/255;a=np.array(original);yy,xx=np.indices((h,w));
# Keep the actual original moon, original bright stars and the entire landscape.
moon=((xx-601)**2+(yy-339)**2)**.5;m*=np.clip((moon-42)/12,0,1)
bright=np.min(a,axis=2).astype(float);peak=np.max(a,axis=2).astype(float);points=(bright>175)&(bright/np.maximum(1,peak)>.84)&(yy<610);seen=np.zeros((h,w),bool)
for y,x in zip(*np.where(points)):
 if seen[y,x]:continue
 q=deque([(y,x)]);seen[y,x]=True;part=[]
 while q:
  py,px=q.popleft();part.append((py,px))
  for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
   ny,nx=py+dy,px+dx
   if 0<=ny<h and 0<=nx<w and points[ny,nx] and not seen[ny,nx]:seen[ny,nx]=True;q.append((ny,nx))
 ys,xs=zip(*part)
 # Compact white stellar cores only; aurora's long pale filaments must vanish.
 if len(part)<=16 and max(xs)-min(xs)<6 and max(ys)-min(ys)<6:
  for sy,sx in part:m[sy,sx]=0
m[610:]=0
out=np.clip(a*(1-m[:,:,None])+np.array(repair)*m[:,:,None],0,255).round().astype('uint8')
assert np.array_equal(out[610:],a[610:]);night=Image.fromarray(out);night.save(P/'night-scene.webp',lossless=True,exact=True,method=6)
assert np.array_equal(np.array(Image.open(P/'night-scene.webp')),out)
record={'source':'night-repair-source.png','sha256':hashlib.sha256((P/'night-repair-source.png').read_bytes()).hexdigest(),'file':'night-scene.webp','width':w,'height':h,'landscapeUnchangedBelowY':610,'preparation':'Only soft aurora-region sky mask from original local image-generation clean plate. Original moon/bright stellar cores protected. All rows y>=610 exactly equal uploaded decoded pixels. Full original picture remains separate and unmodified for the peak.'}
(P/'night-atlas.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n');print({'nightBytes':(P/'night-scene.webp').stat().st_size,'landscapeExactlyRetained':True})
