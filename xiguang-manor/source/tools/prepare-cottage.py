"""Prepare real illustrated sprites. Alpha/crops only; no replacement painting."""
from pathlib import Path
import json,hashlib
import numpy as np
from PIL import Image,ImageOps
root=Path(__file__).resolve().parents[1]/'src/assets/cottage'
groups={'furniture':(3,3,['bed','sofa','wardrobe','bookcase','fireplace','desk','chair','tea','catBed']),
        'decor':(4,4,['piano','lamp','plant','vase','candles','record','screen','cushion','easel','berryLamp','starProjector','laceDrape','vintageSofa','flowerSwing','glassCabinet','planter']),
        'surfaces':(4,2,['rug','giftClosed','giftOpen','planterEmpty','herringbone','pale','floral','gingham'])}
frames={};sources=[]
for group,(cols,rows,names) in groups.items():
 p=root/(group+'-source.png');im=Image.open(p).convert('RGBA');a=np.array(im);before=a[:,:,:3].copy()
 a[:,:,3]=np.clip((a[:,:,3].astype(float)-75)/177,0,1)*255
 assert np.array_equal(before,a[:,:,:3]);a[a[:,:,3]==0,:3]=0;im=Image.fromarray(a)
 for i,name in enumerate(names):
  x,y=round(i%cols*im.width/cols),round(i//cols*im.height/rows)
  bounds=(x,y,round((i%cols+1)*im.width/cols),round((i//cols+1)*im.height/rows))
  if group=='surfaces':
   bounds=[(0,0,540,430),(560,60,866,425),(930,20,1234,425),(1280,70,1774,405),(12,452,439,876),(455,452,880,876),(899,452,1323,876),(1337,452,1760,876)][i];x,y=bounds[:2]
  cell=im.crop(bounds);b=cell.getbbox();assert b,name
  out=cell.crop(b);out.save(root/(name+'.png'),optimize=True);out.save(root/(name+'.webp'),lossless=True,method=6,exact=True)
  assert np.array_equal(np.array(out),np.array(Image.open(root/(name+'.webp')).convert('RGBA')))
  frames[name]={'file':name+'.png','width':out.width,'height':out.height,'source':p.name,'sourceCrop':[x+b[0],y+b[1],x+b[2],y+b[3]]}
def variant(name,im,origin):
 im.save(root/(name+'.png'),optimize=True);im.save(root/(name+'.webp'),lossless=True,method=6,exact=True)
 assert np.array_equal(np.array(im.convert('RGBA')),np.array(Image.open(root/(name+'.webp')).convert('RGBA')))
 frames[name]={'file':name+'.png','width':im.width,'height':im.height,'source':origin,'operation':'Source pixel crop, alpha mask or spatial rearrangement only; no primitive redraw.'}
vase=Image.open(root/'vase.png').convert('RGBA');a=np.array(vase);a[:round(vase.height*.24),:,3]=0;a[a[:,:,3]==0,:3]=0;variant('vaseEmpty',Image.fromarray(a),'vase.png')
curtain=Image.open(root/'laceDrape.png').convert('RGBA');w,h=curtain.size;top=round(h*.12);middle=w//2;shift=round(w*.13);closed=Image.new('RGBA',curtain.size)
closed.alpha_composite(curtain.crop((0,0,w,top)),(0,0));closed.alpha_composite(curtain.crop((0,top,middle,h)),(shift,top));closed.alpha_composite(curtain.crop((middle,top,w,h)),(middle-shift,top))
# A free-standing paid curtain needs real supports. Reuse the illustrated
# swing's carved upright columns/cornice, without its seat. No drawn poles.
swing=Image.open(root/'flowerSwing.png').convert('RGBA');a=np.array(swing);yy,xx=np.indices(a.shape[:2]);keep=(xx<swing.width*.21)|(xx>swing.width*.79)|(yy<swing.height*.24);a[:,:,3]=a[:,:,3]*keep;a[a[:,:,3]==0,:3]=0
scale=(w+24)/swing.width;frame=Image.fromarray(a).resize((w+24,round(swing.height*scale)),Image.Resampling.NEAREST)
for name,cloth in [('laceDrape',curtain),('laceDrapeClosed',closed)]:
 out=Image.new('RGBA',(frame.width,max(frame.height,h+20)));out.alpha_composite(cloth,(12,14));out.alpha_composite(frame,(0,out.height-frame.height));variant(name,out,'laceDrape.png + flowerSwing.png source-pixel layers')
# Mirror the real painted material, making both outer edges continuous.
# This is texture preparation, never a generated geometric plank pattern.
for name in ['herringbone','pale']:
 tile=Image.open(root/(name+'.png')).convert('RGBA');out=Image.new('RGBA',(tile.width*2,tile.height*2));out.alpha_composite(tile,(0,0));out.alpha_composite(ImageOps.mirror(tile),(tile.width,0));out.alpha_composite(ImageOps.flip(tile),(0,tile.height));out.alpha_composite(ImageOps.flip(ImageOps.mirror(tile)),(tile.width,tile.height));variant(name,out,'surfaces-source.png mirrored painted texture')
candles=Image.open(root/'candles.png').convert('RGBA');a=np.array(candles);w,h=candles.size
for left,right,cut in [(0,.34,.31),(.34,.66,.18),(.66,1,.31)]:a[:round(h*cut),round(w*left):round(w*right),3]=0
a[a[:,:,3]==0,:3]=0;variant('candlesOff',Image.fromarray(a),'candles.png')
worldmeta=json.loads((root.parent/'world/atlas.json').read_text());botanical=Image.open(root.parent/'world/botanical.png').convert('RGBA')
for name,frame in {'rose':'rose','lily':'daisies','aster':'hydrangea','glow':'lavender','lavender':'lavender','sunflower':'sunflower'}.items():
 f=worldmeta['frames'][frame];im=botanical.crop((f['x'],f['y'],f['x']+f['w'],f['y']+round(f['h']*.68)));variant('flower-'+name,im,'../world/botanical.png / '+frame)
for name in ['furniture-source.png','decor-source.png','room-source.png','surfaces-source.png']:
 p=root/name;im=Image.open(p);sources.append({'file':name,'pixels':list(im.size),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'source':'Original output from built-in image tool, 2026-11-07. No commercial screenshot or downloaded third-party asset.','permission':'Project-generated art; not declared CC0.'})
room=Image.open(root/'room-source.png').convert('RGB');room.save(root/'room.webp',lossless=True,method=6,exact=True)
assert np.array_equal(np.array(room),np.array(Image.open(root/'room.webp').convert('RGB')))
(root/'atlas.json').write_text(json.dumps({'frames':frames,'sources':sources,'preparation':'Only alpha normalization and source crops, source files unchanged; visible RGB not repainted. Runtime WebP is lossless, verified pixel-for-pixel against PNG crops.','roomScale':432/887,'roomWorld':[432,850]},indent=2)+'\n')
print('Prepared',len(frames),'independent PNG props without replacement drawing.')
