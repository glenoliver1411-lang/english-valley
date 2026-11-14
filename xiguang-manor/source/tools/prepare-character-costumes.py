"""Crop original costume illustrations; no generated geometry or recolouring.
Keep native sources, clean their alpha matte, normalize feet, export losslessly.
"""
from pathlib import Path
from collections import deque
from PIL import Image
import numpy as np
import hashlib,json,shutil
ROOT=Path(__file__).resolve().parents[1]/'src/assets/daylight'
ART={
'cocoa':'exec-5abd8400-edd9-45d8-aefe-071e7937165f.png',
'rose':'exec-036d8c2a-88b9-492e-b062-0ae2c49c7500.png',
'wild':'exec-215bae40-8ba8-4e90-a18d-3b934dd41d20.png',
'berry':'exec-86b6bd9a-0b89-4509-85d9-dd1151b70952.png',
'pearl':'exec-873881cb-e560-4cd2-957f-0b729efd5d93.png',
'mist':'exec-3b2307ea-6072-48f5-aa6b-1a0b7e12b737.png',
'seated':'exec-35a8be7b-3a93-4800-b9b7-1946d510d2f1.png'}
for id,file in ART.items():
 target=ROOT/f'xiaoxi-{id}-source.png'
 if not target.exists():shutil.copyfile(Path('/workspace/generated_images')/file,target)

def cellcrop(sheet,row,col,cols,rows):
 rect=[round(col*sheet.width/cols),round(row*sheet.height/rows),round((col+1)*sheet.width/cols),round((row+1)*sheet.height/rows)]
 a=np.array(sheet.crop(rect).convert('RGBA'));a[:,:,3]=np.clip((a[:,:,3].astype(float)-100)*255/153,0,255).astype('uint8');a[a[:,:,3]==0]=0
 mask=a[:,:,3]>80;seen=np.zeros(mask.shape,bool);best=[]
 for yy,xx in zip(*np.where(mask)):
  if seen[yy,xx]:continue
  part=[];q=deque([(yy,xx)]);seen[yy,xx]=True
  while q:
   y,x=q.popleft();part.append((y,x))
   for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
    ny,nx=y+dy,x+dx
    if 0<=ny<mask.shape[0] and 0<=nx<mask.shape[1] and mask[ny,nx] and not seen[ny,nx]:seen[ny,nx]=True;q.append((ny,nx))
  if len(part)>len(best):best=part
 ys,xs=zip(*best);box=tuple(map(int,(max(0,min(xs)-2),max(0,min(ys)-2),min(a.shape[1],max(xs)+3),min(a.shape[0],max(ys)+3))))
 return Image.fromarray(a).crop(box),{'cell':rect,'crop':box}
def save(im,name):
 im.save(ROOT/(name+'.png'),optimize=True);im.save(ROOT/(name+'.webp'),lossless=True,exact=True,method=6)
 assert np.array_equal(np.array(im),np.array(Image.open(ROOT/(name+'.webp'))))
manifest={'frameWidth':64,'frameHeight':80,'foot':[32,68],'outfits':{},'seated':{},'sources':[],'preparation':'Original art only; connected-component alpha cleanup, cell crop, common scale per sheet, nearest-neighbour resize, common feet, RGBA-verified lossless WebP. No geometric substitute.'}
for id in ART:
 f=ROOT/f'xiaoxi-{id}-source.png';im=Image.open(f);manifest['sources'].append({'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'size':[im.width,im.height],'origin':'Original built-in image-generation edit of the approved Xiaoxi sheet, 2026-11-13; no external game assets; not declared CC0'})
 if id=='seated':continue
 poses=[];bounds=[]
 for r in range(4):
  for c in range(4):
   pose,bound=cellcrop(im,r,c,4,4);poses.append(pose);bounds.append(bound)
 scale=min(62/max(p.height for p in poses),50/max(p.width for p in poses));out=Image.new('RGBA',(256,320))
 for i,p in enumerate(poses):
  p=p.resize((round(p.width*scale),round(p.height*scale)),Image.Resampling.NEAREST);out.alpha_composite(p,(i%4*64+(64-p.width)//2,i//4*80+68-p.height))
 save(out,f'xiaoxi-{id}-walk');manifest['outfits'][id]={'source':f.name,'poses':bounds}
im=Image.open(ROOT/'xiaoxi-seated-source.png');poses=[];bounds=[]
for r in range(2):
 for c in range(7):
  p,b=cellcrop(im,r,c,7,2);poses.append(p);bounds.append(b)
scale=min(58/max(p.height for p in poses),50/max(p.width for p in poses));out=Image.new('RGBA',(448,160));ids=['original','cocoa','rose','wild','berry','pearl','mist']
for i,p in enumerate(poses):
 p=p.resize((round(p.width*scale),round(p.height*scale)),Image.Resampling.NEAREST);out.alpha_composite(p,(i%7*64+(64-p.width)//2,i//7*80+68-p.height));manifest['seated'][ids[i%7]+('-front' if i<7 else '-back')]={'x':i%7*64,'y':i//7*80,'artBounds':[(64-p.width)//2,68-p.height,p.width,p.height],**bounds[i]}
save(out,'xiaoxi-seated');(ROOT/'character-atlas.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');print({f.name:f.stat().st_size for f in ROOT.glob('xiaoxi-*.webp')})
