"""Only prepare PNG source pixels: alpha, crops and lossless runtime files."""
from pathlib import Path
import json,hashlib
from PIL import Image
import numpy as np
from scipy import ndimage
r=Path(__file__).resolve().parents[1]/'src/assets/candy-atelier';frames={};sources=[]
for group,cols,rows,names in [('stations',4,2,['mixing','oven','display','packing','desk','cabinet','ingredients','bookstand']),('items',3,4,[f'{f}-{s}'for f in ['strawberry','pumpkin','lavender']for s in ['moon','star','cat']]+['bowl','box-open','box-closed'])]:
 im=Image.open(r/(group+'-source.png')).convert('RGBA');a=np.array(im);a[:,:,3]=np.clip((a[:,:,3].astype(float)-75)/177,0,1)*255;a[a[:,:,3]==0,:3]=0;im=Image.fromarray(a)
 for i,name in enumerate(names):
  x,y=round(i%cols*im.width/cols),round(i//cols*im.height/rows);cell=im.crop((x,y,round((i%cols+1)*im.width/cols),round((i//cols+1)*im.height/rows)));
  # Remove only disconnected spill from adjacent source-sheet cells.
  if group=='items':
   pixels=np.array(cell);labels,count=ndimage.label(pixels[:,:,3]>0);sizes=np.bincount(labels.ravel());sizes[0]=0
   keep=sizes>=max(16,sizes.max()*.02);keep[0]=False;pixels[~keep[labels]]=0;cell=Image.fromarray(pixels)
  b=cell.getbbox();assert b,name;out=cell.crop(b)
  out.save(r/(name+'.png'),optimize=True);out.save(r/(name+'.webp'),lossless=True,method=6,exact=True);assert np.array_equal(np.array(out),np.array(Image.open(r/(name+'.webp')).convert('RGBA')))
  frames[name]={'file':name+'.webp','width':out.width,'height':out.height,'source':group+'-source.png','crop':[x+b[0],y+b[1],x+b[2],y+b[3]]}
# Color variants preserve source structure/texture; they are not redrawn boxes.
for state in ['open','closed']:
 original=np.array(Image.open(r/('box-'+state+'.png')).convert('RGBA'))
 for wrap,target in [('violet',(178,161,201)),('cream',(223,188,149))]:
  a=original.copy();rgb=a[:,:,:3].astype(float);mask=(rgb[:,:,0]>rgb[:,:,1]*1.10)&(rgb[:,:,2]>rgb[:,:,1]*1.03)&(a[:,:,3]>0)
  # Retain each pixel's luminance while changing the pink paper/ribbon hue.
  luminance=rgb.mean(axis=2);source=np.array([219,164,184]);ratio=np.array(target)/source
  changed=rgb*ratio;changed*=np.divide(luminance,changed.mean(axis=2),out=np.ones_like(luminance),where=changed.mean(axis=2)>0)[:,:,None]
  a[:,:,:3][mask]=np.clip(changed[mask],0,255).astype('uint8');out=Image.fromarray(a);name='box-'+state+'-'+wrap;out.save(r/(name+'.png'),optimize=True);out.save(r/(name+'.webp'),lossless=True,method=6,exact=True)
  assert np.array_equal(np.array(out),np.array(Image.open(r/(name+'.webp')).convert('RGBA')))
  frames[name]={'file':name+'.webp','width':out.width,'height':out.height,'source':'box-'+state+'.png','modification':'Only pink paper/ribbon color; original per-pixel lightness retained.'}
room=Image.open(r/'room-source.png').convert('RGB');room.save(r/'room.webp',lossless=True,method=6,exact=True);assert np.array_equal(np.array(room),np.array(Image.open(r/'room.webp').convert('RGB')))
for name in ['room-source.png','stations-source.png','items-source.png']:
 p=r/name;sources.append({'file':name,'pixels':list(Image.open(p).size),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'source':'Original generation for this project with the built-in image tool; no third-party commercial game content.','permission':'Project generated artwork, not declared CC0.'})
(r/'atlas.json').write_text(json.dumps({'frames':frames,'sources':sources,'preparation':'Original sources retained. Alpha and source crops only. Runtime WebP exact RGBA/RGB verified.'},indent=2)+'\n')
print('Prepared',len(frames),'real candy props/items and one room, no replacement drawing.')
