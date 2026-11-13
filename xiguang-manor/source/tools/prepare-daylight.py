"""Technical alpha cleanup/cell crops and lossless export of original artwork.
No geometry drawing, material synthesis, or reconstruction of the supplied art.
"""
from pathlib import Path
from PIL import Image
import numpy as np
import hashlib,json
from collections import deque

ROOT=Path(__file__).resolve().parents[1]/'src/assets/daylight'
def save(im,name):
 im.save(ROOT/(name+'.png'),optimize=True)
 im.save(ROOT/(name+'.webp'),lossless=True,method=6,exact=True)
 assert np.array_equal(np.array(im),np.array(Image.open(ROOT/(name+'.webp'))))
def clean(im,minimum=90):
 a=np.array(im.convert('RGBA'));a[:,:,3]=np.clip((a[:,:,3].astype(float)-minimum)*255/(253-minimum),0,255).astype('uint8');a[a[:,:,3]==0]=0
 return Image.fromarray(a)
def bbox(im):return im.getchannel('A').point(lambda a:255 if a>65 else 0).getbbox()
sources=[]
for f in ['terrain-source.png','woodland-source.png','xiaoxi-source.png','cat-source.png']:
 p=ROOT/f;im=Image.open(p);sources.append(dict(file=f,width=im.width,height=im.height,sha256=hashlib.sha256(p.read_bytes()).hexdigest(),origin='Original built-in image-generation output, 2026-11-13; not CC0 or third-party game art'))
save(Image.open(ROOT/'terrain-source.png').convert('RGB'),'terrain')
wood=clean(Image.open(ROOT/'woodland-source.png'),100);frames={}
for i,name in enumerate(['oak-canopy','oak-trunk','birch-canopy','birch-trunk','fern','rose-border']):
 x=i%2*512;y=i//2*512;cell=wood.crop((x,y,x+512,y+512));box=bbox(cell);cell=cell.crop(box);save(cell,name);frames[name]=dict(source='woodland-source.png',cell=[x,y,512,512],crop=list(box),width=cell.width,height=cell.height)

# Keep each real walking pose; equal physical scale, common foot baseline.
# Largest connected component rejects detached generation-matte specks.
sheet=Image.open(ROOT/'xiaoxi-source.png');poses=[];bounds=[]
for row in range(4):
 for col in range(4):
  rect=(round(col*sheet.width/4),round(row*sheet.height/4),round((col+1)*sheet.width/4),round((row+1)*sheet.height/4));cell=clean(sheet.crop(rect),100);a=np.array(cell);mask=a[:,:,3]>80;seen=np.zeros(mask.shape,bool);best=[]
  for yy,xx in zip(*np.where(mask)):
   if seen[yy,xx]:continue
   part=[];q=deque([(yy,xx)]);seen[yy,xx]=True
   while q:
    y,x=q.popleft();part.append((y,x))
    for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
     ny,nx=y+dy,x+dx
     if 0<=ny<mask.shape[0] and 0<=nx<mask.shape[1] and mask[ny,nx] and not seen[ny,nx]:seen[ny,nx]=True;q.append((ny,nx))
   if len(part)>len(best):best=part
  ys,xs=zip(*best);box=tuple(map(int,(max(0,min(xs)-2),max(0,min(ys)-2),min(cell.width,max(xs)+3),min(cell.height,max(ys)+3))));cell=cell.crop(box);poses.append(cell);bounds.append(dict(cell=list(rect),crop=list(box)))
scale=min(62/max(im.height for im in poses),50/max(im.width for im in poses));out=Image.new('RGBA',(256,320))
for i,im in enumerate(poses):
 im=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.NEAREST);out.alpha_composite(im,(i%4*64+(64-im.width)//2,i//4*80+68-im.height))
save(out,'xiaoxi-walk');frames['xiaoxi-walk']=dict(source='xiaoxi-source.png',frameWidth=64,frameHeight=80,columns=4,rows=4,order=['front','left','right','back'],foot=[32,68],poses=bounds)
cat=Image.open(ROOT/'cat-source.png');cats=[]
for row in range(3):
 for col in range(4):
  rect=(round(col*cat.width/4),round(row*cat.height/3),round((col+1)*cat.width/4),round((row+1)*cat.height/3));cell=clean(cat.crop(rect),110);cell=cell.crop(bbox(cell));cats.append(cell)
scale=min(35/max(im.height for im in cats),41/max(im.width for im in cats));out=Image.new('RGBA',(192,144))
for i,im in enumerate(cats):
 im=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.NEAREST);out.alpha_composite(im,(i%4*48+(48-im.width)//2,i//4*48+41-im.height))
save(out,'cat');frames['cat']=dict(source='cat-source.png',frameWidth=48,frameHeight=48,columns=4,rows=3,order=['front','left','right','back'],states=['sit','walk-a','walk-b'],foot=[24,41])
(ROOT/'atlas.json').write_text(json.dumps(dict(sources=sources,frames=frames,preparation='Original pixels retained; alpha matte cleanup, native cell crops, nearest-neighbour character normalization, lossless RGBA-verified WebP. No primitive scenery drawing.'),ensure_ascii=False,indent=2)+'\n')
print('Prepared original terrain, six layered plants and sixteen walking poses.')
