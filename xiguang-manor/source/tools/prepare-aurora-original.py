"""Technical extraction of supplied pixels, not a procedural scene recreation."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import numpy as np,json,hashlib
P=Path(__file__).resolve().parents[1]/'src/assets/aurora-original';im=Image.open(P/'user-original.jpg').convert('RGB');w,h=im.size
im.save(P/'user-original.png',optimize=True);im.save(P/'scene.webp',lossless=True,exact=True,method=6)
assert np.array_equal(np.array(im),np.array(Image.open(P/'scene.webp')))
a=np.array(im);r,g,b=[a[:,:,i].astype(float) for i in range(3)];poly=Image.new('L',(w,h));ImageDraw.Draw(poly).polygon([(0,300),(90,320),(180,205),(270,250),(410,240),(540,130),(720,0),(720,245),(590,330),(470,405),(320,447),(225,446),(194,512),(130,552),(0,555)],fill=255)
inside=np.array(poly.filter(ImageFilter.GaussianBlur(12)))/255
chroma=np.maximum(np.clip((g-r*1.3)/70,0,1),np.clip((b-r*.9)/110,0,1)*np.clip((g-45)/75,0,1))
mask=inside*chroma*np.clip((np.maximum(g,b)-45)/100,0,1)
meta={'width':w,'height':h,'source':'user-original.jpg','sha256':hashlib.sha256((P/'user-original.jpg').read_bytes()).hexdigest(),'sourceFormat':'JPEG','sourceSuppliedByUser':True,'preparation':'Decoded source kept pixel-identical in lossless WebP. Only transparent original-pixel masks and native crops; no repainted aurora/mountains/flowers/actor.','lights':[],'stars':[],'flowers':[]}
xx=np.arange(w)[None,:]
for i,c in enumerate([40,170,300,430,560,690]):
 weight=np.maximum(0,1-np.abs(xx-c)/150);alpha=(mask*weight*255).astype('uint8');rgba=np.dstack((a,alpha));rgba[alpha==0]=0;layer=Image.fromarray(rgba);box=layer.getchannel('A').getbbox();layer=layer.crop(box);name=f'light-{i}.webp';layer.save(P/name,lossless=True,exact=True,method=6);meta['lights'].append({'key':f'light-{i}','file':name,'x':box[0],'y':box[1],'w':layer.width,'h':layer.height,'phase':i*.731})
# Select existing tiny bright stars; never invent or relocate a star.
ys,xs=np.where((r>185)&(g>185)&(b>195)&(np.indices((h,w))[0]<575)&(inside<.1));points=[]
for idx in np.argsort(-(r[ys,xs]+g[ys,xs]+b[ys,xs])):
 x,y=int(xs[idx]),int(ys[idx]);
 if (x-601)**2+(y-339)**2<45**2 or any((x-px)**2+(y-py)**2<48**2 for px,py in points):continue
 points.append((x,y))
 if len(points)>=14:break
atlas=Image.new('RGBA',(14*12,12))
for i,(x,y) in enumerate(points):
 cell=im.crop((x-6,y-6,x+6,y+6)).convert('RGBA');arr=np.array(cell);v=np.min(arr[:,:,:3],axis=2).astype(float);arr[:,:,3]=np.clip((v-100)*255/130,0,255).astype('uint8');arr[arr[:,:,3]==0]=0;atlas.alpha_composite(Image.fromarray(arr),(i*12,0));meta['stars'].append({'x':x-6,'y':y-6,'frame':i,'w':12,'h':12})
atlas.save(P/'stars.webp',lossless=True,exact=True,method=6)
(P/'atlas.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n');print({'source':im.size,'losslessBytes':(P/'scene.webp').stat().st_size,'lightMasks':len(meta['lights']),'existingStars':len(points)})
# Background repair is used ONLY underneath two moving cutout silhouettes.
# The rest of the generated edit is never used in the game; the painting stays
# the supplied photograph's exact decoded pixels, including its seated girl.
repair=P/'foreground-repair-source.png'
if repair.exists():
 clean=Image.open(repair).convert('RGB').resize((w,h),Image.Resampling.LANCZOS)
 selections=[('left',[(85,1278),(80,1220),(66,1207),(64,1190),(70,1181),(73,1169),(87,1167),(99,1170),(111,1173),(117,1189),(112,1208),(96,1219),(96,1278)],(90,1277)),('right',[(657,1278),(652,1211),(636,1195),(635,1176),(643,1164),(650,1151),(666,1155),(680,1165),(691,1176),(688,1193),(674,1209),(667,1278)],(662,1277))]
 for id,points,anchor in selections:
  m=Image.new('L',(w,h));ImageDraw.Draw(m).polygon(points,fill=255);box=m.getbbox();cut=im.convert('RGBA');cut.putalpha(m);back=clean.convert('RGBA');back.putalpha(m);key='flower-'+id;cut.crop(box).save(P/(key+'.webp'),lossless=True,exact=True,method=6);back.crop(box).save(P/(key+'-clean.webp'),lossless=True,exact=True,method=6);meta['flowers'].append({'key':key,'cleanKey':key+'-clean','file':key+'.webp','cleanFile':key+'-clean.webp','x':box[0],'y':box[1],'w':box[2]-box[0],'h':box[3]-box[1],'anchorX':anchor[0]-box[0],'anchorY':anchor[1]-box[1]})
 meta['foregroundRepair']={'source':repair.name,'sha256':hashlib.sha256(repair.read_bytes()).hexdigest(),'origin':'Original local image-generation edit; only two tiny underpaint masks used; not a replacement scene'}
 (P/'atlas.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
