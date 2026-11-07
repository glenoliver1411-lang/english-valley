"""Crop original botanical source pixels and normalize alpha; no replacement drawing."""
from pathlib import Path
from PIL import Image
import numpy as np
import json,hashlib
root=Path(__file__).resolve().parents[1]/'src/assets/flowers';frames={};sources=[]
for filename,cols,rows,names in [('source.png',3,2,['tulip','daisy','hydrangea','peony','iris','cosmos']),('soft-flowers-source.png',3,1,['lily','aster','glow'])]:
 source=root/filename;im=Image.open(source).convert('RGBA');sources.append({'file':filename,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'pixels':list(im.size)});a=np.array(im);a[:,:,3]=np.clip((a[:,:,3].astype(float)-75)/178,0,1)*255;a[a[:,:,3]==0,:3]=0;im=Image.fromarray(a)
 for i,name in enumerate(names):
  x,y=round(i%cols*im.width/cols),round(i//cols*im.height/rows);cell=im.crop((x,y,round((i%cols+1)*im.width/cols),round((i//cols+1)*im.height/rows)));box=cell.getbbox();assert box;out=cell.crop(box);out.save(root/(name+'.png'),optimize=True);out.save(root/(name+'.webp'),lossless=True,method=6,exact=True);assert np.array_equal(np.array(out),np.array(Image.open(root/(name+'.webp')).convert('RGBA')));frames[name]={'file':name+'.webp','width':out.width,'height':out.height,'source':filename,'crop':[x+box[0],y+box[1],x+box[2],y+box[3]]}
(root/'atlas.json').write_text(json.dumps({'sources':sources,'origin':'Original botanical pixel artwork created for this project using the built-in image tool; no third-party download; not represented as CC0.','preparation':'Cell cropping and alpha normalization only. Visible RGB source pixels retained. Lossless WebP verified pixel-for-pixel.','frames':frames},indent=2)+'\n')
print('Prepared nine distinct botanical sprites; original sources retained.')
