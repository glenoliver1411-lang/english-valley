"""Technical alpha preparation and atlas slicing, never replacement painting.

Generated source sheets are kept intact. Only alpha is normalized to remove
the source sheets' translucent mattes; no furniture, road or RGB is painted.
"""
from pathlib import Path
import json, hashlib
import numpy as np
from PIL import Image

root=Path(__file__).resolve().parents[1]/'src/assets/world'
groups={
 'architecture':(3,2,['cottage','greenhouse','workshop','bench','arch','fountain'],16,220),
 'botanical':(4,3,['oak','birch','cherry','fir','rose','hydrangea','daisies','sunflower','lavender','rock','planter','clover'],180,50)
}
frames={}
for group,(cols,rows,names,low,span) in groups.items():
 source=Image.open(root/(group+'-source.png')).convert('RGBA');rgba=np.array(source)
 before=rgba[:,:,:3].copy()
 rgba[:,:,3]=np.clip((rgba[:,:,3].astype(float)-low)/span,0,1)*255
 if group=='botanical':
  # Remove the neutral white matte in canopy holes. Retain ivory daisies and
  # the birch's pale trunk; these are alpha selections, not repainted pixels.
  rgb=rgba[:,:,:3].astype(int);neutral=(rgb.min(2)>215)&(np.ptp(rgb,axis=2)<22)
  cw,ch=source.width//cols,source.height//rows
  neutral[ch:2*ch,2*cw:3*cw]=False
  neutral[55:ch, cw+140:cw+225]=False
  rgba[:,:,3][neutral]=0
 assert np.array_equal(before,rgba[:,:,:3])
 packed=rgba.copy();packed[packed[:,:,3]==0,:3]=0
 out=Image.fromarray(packed)
 out.save(root/(group+'.png'),optimize=True)
 cw,ch=source.width//cols,source.height//rows
 for i,name in enumerate(names):
  x,y=(i%cols)*cw,(i//cols)*ch
  cell=out.crop((x,y,x+cw,y+ch));box=cell.getbbox();assert box,name
  a,b,c,d=box
  frames[name]={'sheet':group,'x':x+a,'y':y+b,'w':c-a,'h':d-b,'anchor':[.5,1]}
 if group=='architecture':
  lights=np.array(out);original_alpha=lights[:,:,3].copy();lights[:,:,3]=0
  windows={'cottage':[(171,100,245,180),(65,265,120,335),(164,260,235,335),(390,255,435,330)],
           'greenhouse':[(38,168,475,375)],
           'workshop':[(270,90,340,155),(85,245,150,315),(174,235,355,370)]}
  for name,boxes in windows.items():
   f=frames[name]
   for ax,ay,bx,by in boxes:
    x,y=f['x']+ax,f['y']+ay;right,bottom=min(f['x']+bx,out.width),min(f['y']+by,out.height)
    rgb=lights[y:bottom,x:right,:3].astype(int);mask=(rgb[:,:,0]>160)&(rgb[:,:,1]>115)&(rgb[:,:,2]<rgb[:,:,0]*.83)
    lights[y:bottom,x:right,3]=np.maximum(lights[y:bottom,x:right,3],original_alpha[y:bottom,x:right]*mask)
  lights[lights[:,:,3]==0,:3]=0
  Image.fromarray(lights).save(root/'architecture-light.png',optimize=True)
 # A reused small petal crop is original art, not a drawn particle.

# Original character pixels, arranged into a front-facing bent-leg seated pose.
# The lakeside back-facing pose does not fit the new front-facing bench.
v6root=root.parent/'v6'
v6meta=json.loads((v6root/'atlas.json').read_text())
v6image=Image.open(v6root/'atelier.png').convert('RGBA')
actors=[(name[6:],f) for name,f in v6meta['frames'].items() if name.startswith('actor-')]
seated=Image.new('RGBA',(32*len(actors),40));seated_frames={}
for i,(name,f) in enumerate(actors):
 standing=v6image.crop((f['x'],f['y'],f['x']+32,f['y']+40))
 pose=Image.new('RGBA',(32,40))
 pose.alpha_composite(standing.crop((0,0,32,30)),(0,0))
 pose.alpha_composite(standing.crop((10,30,17,39)),(9,28))
 pose.alpha_composite(standing.crop((17,30,25,39)),(18,28))
 seated.alpha_composite(pose,(i*32,0))
 seated_frames[name]={'x':i*32,'y':0,'w':32,'h':40}
seated.save(root/'seated.png',optimize=True)
sources=[]
for file in ['architecture-source.png','botanical-source.png','terrain-source.png']:
 p=root/file;im=Image.open(p)
 sources.append({'file':file,'width':im.width,'height':im.height,'bytes':p.stat().st_size,
                 'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),
                 'source':'Original generation for this project using the built-in image tool',
                 'permission':'Generated project artwork; not claimed to be CC0 or copied from third-party screenshots'})
(root/'atlas.json').write_text(json.dumps({'frames':frames,'seatedFrames':seated_frames,'sources':sources,'preparation':'Visible source RGB intact; alpha matte normalization, zeroing invisible RGB and cell crops only. Seated actor uses original V6 frame pixels. No primitive scenery reconstruction.'},indent=2)+'\n')
print('Prepared',len(frames),'original sprite frames; RGB identity verified.')
