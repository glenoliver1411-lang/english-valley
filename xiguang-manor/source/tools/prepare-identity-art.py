"""Prepare attributed modular sprite art and native original cat animations.
Only crop, re-palette, align and composite licensed/authored pixels. No geometric
substitute for a character or environment. Source PNGs and exact provenance remain.
"""
from pathlib import Path
from PIL import Image
import numpy as np,json,shutil,hashlib,colorsys
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'src/assets/identity';PARTS=OUT/'parts';ORIGINAL=OUT/'originals';PARTS.mkdir(parents=True,exist_ok=True);ORIGINAL.mkdir(exist_ok=True)
INPUT=ROOT/'verification/identity' if (ROOT/'verification/identity/selected-definitions.json').exists() else ORIGINAL
def copy_original(source,target):
 if source.resolve()!=target.resolve():shutil.copy2(source,target)
spec=json.loads((INPUT/'selected-definitions.json').read_text());directions=[2,1,3,0]
manifest={'frameWidth':64,'frameHeight':80,'columns':9,'frames':54,'walk':[[d*9+i for i in range(1,9)] for d in range(4)],'idle':[d*9 for d in range(4)],'sit':[36+d for d in range(4)],'gather':[[40+d,44+d] for d in range(4)],'parts':{},'sources':[],'limitations':['Long-skirt seated folds are a pixel-preserving squash of the licensed skirt, not separately hand-painted seated pleats.','Backpack seated/interaction alignment follows head/shoulder anchors from the licensed walk artwork.','The modular LPC base has a different face/proportion from the seven retained original illustrated outfits; no claim that their component layers are interchangeable.']}
credit=[]
def source_image(key,layer,action):
 info=spec['downloads'].get(key+'-'+layer+'-'+action,{})
 if info.get('error')or not info.get('file'):return None
 f=INPUT/info['file'];return Image.open(f).convert('RGBA')
def cell(im,row,col):
 return im.crop((col*64,row*64,col*64+64,row*64+64))
def normalize(im):
 out=Image.new('RGBA',(64,80));out.alpha_composite(im.resize((77,77),Image.Resampling.NEAREST),(-6,-7));return out
for key,v in spec['parts'].items():
 if 'error'in v:continue
 definition=INPUT/v['definition'];target=ORIGINAL/v['definition'];target.parent.mkdir(parents=True,exist_ok=True);copy_original(definition,target)
 for layer,folder in v.get('layers',{}).items():
  if not folder:continue
  walk=source_image(key,layer,'walk')
  if walk is None:raise RuntimeError('No real walk art for '+key)
  sit=source_image(key,layer,'sit');slash=source_image(key,layer,'slash');out=Image.new('RGBA',(576,480));layername=key+('-rear' if v['data'][layer]['zPos']<10 else '')
  for frame in range(48):
   if frame<36:d=frame//9;pose=cell(walk,directions[d],min(frame%9,walk.width//64-1))
   else:
    d=(frame-36)%4;action='sit'if frame<40 else'slash';src=sit if action=='sit'else slash;col=2 if frame<44 else 3
    if src is not None:pose=cell(src,directions[d],min(col,src.width//64-1))
    else:
     pose=cell(walk,directions[d],0)
     a=source_image('head','layer_1','walk');b=source_image('head','layer_1',action);ab=cell(a,directions[d],0).getbbox();bb=cell(b,directions[d],min(col,b.width//64-1)).getbbox();dx=round((bb[0]+bb[2]-ab[0]-ab[2])/2);dy=bb[1]-ab[1]
     shifted=Image.new('RGBA',(64,64))
     if key=='longskirt'and action=='sit':
      box=pose.getbbox();crop=pose.crop(box);crop=crop.resize((crop.width, max(1,round(crop.height*.66))),Image.Resampling.NEAREST);shifted.alpha_composite(crop,(box[0]+dx,box[1]+dy));pose=shifted
     else:shifted.alpha_composite(pose,(dx,dy));pose=shifted
   # Continue long trouser hems over the original shin pixels. This retains
   # the base's exact walking leg silhouette and shading, rather than painting
   # an arbitrary rectangular lower leg or leaving calf-height white socks.
   if key in ['jeans','casual','cargo']:
    action='walk'if frame<36 else'sit'if frame<40 else'slash';body=source_image('body','layer_1',action);bc=cell(body,directions[d],min(frame%9 if frame<36 else 2 if frame<44 else 3,body.width//64-1));b=np.array(bc);a=np.array(pose);skin=(b[:,:,3]>0)&(np.indices(b.shape[:2])[0]>=52);ys=np.where(b[:,:,3]>0)[0];foot=int(ys.max())if len(ys)else 62
    for yy,xx in zip(*np.where(skin)):
     if yy>=foot-1 or a[yy,xx,3]or not np.any(a[max(0,yy-8):yy,xx,3]):continue
     lit=float(np.max(b[yy,xx,:3]))/255;a[yy,xx]=[int(115+110*lit)]*3+[255]
    pose=Image.fromarray(a)
   out.alpha_composite(normalize(pose),(frame%9*64,frame//9*80))
  filename=layername+'.webp';out.save(PARTS/filename,lossless=True,exact=True,method=6);manifest['parts'][layername]={'file':filename,'layer':v['data'][layer]['zPos'],'definition':v['definition']}
  for action in ['walk','sit','slash']:
   info=spec['downloads'].get(key+'-'+layer+'-'+action,{})
   if info.get('file')and not info.get('error'):
    f=INPUT/info['file'];t=ORIGINAL/info['file'];t.parent.mkdir(parents=True,exist_ok=True);copy_original(f,t);manifest['sources'].append({'file':str(t.relative_to(OUT)),'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'url':'https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator/blob/'+spec['commit']+'/'+info['file']})
  credits=[c for c in v['data']['credits']if folder.startswith(c['file'].rstrip('/')+'/')or c['file'].startswith(folder.rstrip('/'))]
  if not credits:credits=v['data']['credits']
  for c in credits:
   license=next((v for v in ['CC0','OGA-BY 3.0','OGA-BY 3.0+','CC-BY 3.0+','CC-BY-SA 3.0'] if v in c['licenses']),None)
   if not license:raise RuntimeError('No chosen redistribution license '+key)
   credit.append({'part':layername,'file':c['file'],'authors':c['authors'],'license':license,'upstreamOfferedLicenses':c['licenses'],'urls':c['urls'],'notes':c.get('notes',''),'modifications':'Selected original animation frames; common pixel grid and foot anchor; lossless WebP. Runtime palette remapping. Additional local cloth-pattern variants and anchored props as described in atlas.json.'})
# Material variants preserve the source garment's silhouette, seams and shading.
def material(im,color,pattern=None):
 a=np.array(im);rgb=a[:,:,:3].astype(float);light=(rgb.max(2)*.65+rgb.mean(2)*.35)/255;target=np.array(tuple(bytes.fromhex(color.lstrip('#'))),float);factor=.28+light*.91;t=np.clip(target[None,None,:]*factor[:,:,None],0,255);t+=np.maximum(0,light-.8)[:,:,None]*80
 if pattern:
  yy,xx=np.indices(light.shape);localx=xx%64;localy=yy%80;grain=((localx//pattern+localy//pattern)%2)*.10; t*=1-grain[:,:,None]
 a[:,:,:3]=np.clip(t,0,255).astype('uint8');return Image.fromarray(a)
for name,base,color,pattern in [('plaid','shirt','#8f9a77',3),('hoodie','sweater','#829aa5',None)]:
 im=material(Image.open(PARTS/(base+'.webp')).convert('RGBA'),color,pattern)
 if name=='hoodie':
  hood=Image.open(PARTS/'hood.webp').convert('RGBA');arr=np.array(hood);yy=np.indices(arr.shape[:2])[0]%80;arr[(yy<34)|(yy>43),3]=0;im.alpha_composite(material(Image.fromarray(arr),'#829aa5'))
 im.save(PARTS/(name+'.webp'),lossless=True,exact=True,method=6);manifest['parts'][name]={'file':name+'.webp','layer':35,'derivedFrom':base,'modification':'Original cloth pixels with plaid weave'if name=='plaid'else'Original broad-sleeve shirt and separate draped hood collar pixels'}
# Hand-sized facial edits on the existing illustrated head, not replacement bodies.
head=Image.open(PARTS/'head.webp').convert('RGBA')
for shape in ['round','soft','narrow','bright']:
 for expression in ['calm','smile','focused']:
  a=np.array(head)
  for frame in range(48):
   if(frame<36 and frame//9==3)or(frame>=36 and(frame-36)%4==3):continue
   y0=frame//9*80;x0=frame%9*64;b=a[y0:y0+80,x0:x0+64];rgb=b[:,:,:3].astype(int);blue=(rgb[:,:,2]>rgb[:,:,0]*1.18)&(rgb[:,:,1]>rgb[:,:,0]*1.15)&(b[:,:,3]>0)&(rgb[:,:,0]<185);ys,xs=np.where(blue)
   if not len(xs):continue
   lo,hi=int(ys.min()),int(ys.max())
   if shape=='narrow':
    for y,x in zip(ys,xs):
     if y==lo:b[y,x]=[228,164,124,255]
   if shape=='soft':
    for y,x in zip(ys,xs):
     if y==lo:b[y,x,:3]=(np.array([153,66,60])*.45+b[y,x,:3]*.55).astype('uint8')
   if shape=='bright':
    for x in [int(xs.min()),int(xs.max())]:b[max(0,lo-1),x]=[250,246,230,255]
   if expression=='smile':
    x=int(round(xs.mean()));y=min(79,hi+4);b[y,x]=[153,89,74,255];b[y,max(0,x-1)]=[204,134,101,255]
   elif expression=='focused':
    for x in [int(xs.min()),int(xs.max())]:b[max(0,lo-2),x]=[90,67,59,255]
  name='head-'+shape+'-'+expression;Image.fromarray(a).save(PARTS/(name+'.webp'),lossless=True,exact=True,method=6);manifest['parts'][name]={'file':name+'.webp','layer':100,'derivedFrom':'head','modification':'Small eyebrow/eyelid/mouth pixel edits; same head and all animation poses.'}
(OUT/'atlas.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
(OUT/'CREDITS.json').write_text(json.dumps({'repository':'https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator','commit':spec['commit'],'derivativeLicense':'CC-BY-SA 4.0','assets':credit,'licenseLinks':{'OGA-BY 3.0':'https://opengameart.org/content/oga-by-30-faq','CC-BY-SA 3.0':'https://creativecommons.org/licenses/by-sa/3.0/'}},ensure_ascii=False,indent=2))
print('Prepared',len(manifest['parts']),'actual modular parts;',len(manifest['sources']),'original animation sources')
