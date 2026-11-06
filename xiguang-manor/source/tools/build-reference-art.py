"""Compose licensed, hand-pixelled LPC subjects into the existing manor footprints.
Artwork remains offline/local; originals, full credits and selected licenses ship in source.
No commercial-game screenshots are sampled.
"""
from PIL import Image,ImageDraw
from pathlib import Path
import json,math,colorsys
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'src/assets/reference';SRC=OUT/'originals';ART={}
W=Image.open(SRC/'white-wood.png').convert('RGBA');U=Image.open(SRC/'upholstery.png').convert('RGBA');F=Image.open(SRC/'floors.png').convert('RGBA');S=Image.open(SRC/'walls.png').convert('RGBA')
K=Image.open(SRC/'container.png').convert('RGBA')
v5=Image.open(ROOT/'src/assets/v5/atelier.png').convert('RGBA');v5m=json.loads((ROOT/'src/assets/v5/atlas.json').read_text())['frames']
play=Image.open(ROOT/'src/assets/play/atelier.png').convert('RGBA');playm=json.loads((ROOT/'src/assets/play/atlas.json').read_text())['frames']
v6=Image.open(ROOT/'src/assets/v6/atelier.png').convert('RGBA');v6m=json.loads((ROOT/'src/assets/v6/atlas.json').read_text())['frames']
FAB=['#78576f','#ac718e','#d798ae','#efbfd0','#ffe1d7']
def crop(im,x,y,w,h):return im.crop((x,y,x+w,y+h))
def frame(im,m,n):r=m[n];return crop(im,r['x'],r['y'],r['w'],r['h'])
def rgb(c):return tuple(int(c[i:i+2],16)for i in (1,3,5))
def recolor(im,ramp,cloth=False):
 out=im.copy();mapping={};p=out.load();cs=list(map(rgb,ramp))
 for y in range(out.height):
  for x in range(out.width):
   r,g,b,a=p[x,y]
   if not a:continue
   if cloth and not(r>g*1.02 and g>r*.52 and b<r*.8):continue
   key=(r,g,b)
   if key not in mapping:
    lum=(r*.28+g*.61+b*.11)/255;level=min(len(cs)-1,max(0,round((lum-.10)/.78*(len(cs)-1))));mapping[key]=cs[level]
   p[x,y]=(*mapping[key],a)
 return out
def tone(im,ramp):
 # Preserve the actual light-to-dark span of each hand-pixelled material.
 # The source stone uses a narrow grey range; absolute quantization erased its joints.
 out=im.copy();ps=out.load();lum=lambda p:p[0]*.28+p[1]*.61+p[2]*.11
 values=[lum(p)for p in im.getdata()if p[3]>0];lo,hi=min(values),max(values);cs=list(map(rgb,ramp));cache={}
 for y in range(out.height):
  for x in range(out.width):
   px=ps[x,y]
   if not px[3]:continue
   if px[:3]not in cache:
    z=(lum(px)-lo)/max(1,hi-lo)*(len(cs)-1);i=min(len(cs)-2,int(z));f=z-i;cache[px[:3]]=tuple(round(cs[i][k]*(1-f)+cs[i+1][k]*f)for k in range(3))
   ps[x,y]=(*cache[px[:3]],px[3])
 return out
def fabric(im):return recolor(im,FAB,True)
def open_curtain():
 im=fabric(crop(U,0,0,96,64))
 # The source sheet contains a detached spare rail in its transparent opening.
 # Keep the gathered cloth, but do not composite the spare rail across the glass.
 im.paste((0,0,0,0),(24,20,72,48))
 return im
def canvas(w,h):return Image.new('RGBA',(w,h))
def paste(out,im,x,y,w=None,h=None):
 if w is not None:im=im.resize((round(w),round(h)),Image.Resampling.NEAREST)
 out.alpha_composite(im,(round(x),round(y)))
def tile(out,im,rect):
 x,y,w,h=rect;piece=canvas(w,h)
 for yy in range(0,h,im.height):
  for xx in range(0,w,im.width):paste(piece,im,xx,yy)
 paste(out,piece,x,y)
def shadow(out,x,y,w):
 lay=canvas(out.width,out.height);d=ImageDraw.Draw(lay);d.ellipse((x-w/2,y-2,x+w/2,y+2),fill=(29,30,47,35));out.alpha_composite(lay)
def flower(n='flower-pot-lily'):return frame(v5,v5m,n)
def add(n,im):ART[n]=im
def fit(im,w,h):
 s=min(w/im.width,h/im.height);return im.resize((round(im.width*s),round(im.height*s)),Image.Resampling.NEAREST)
def furniture():
 # Proper carved bed frame and the original project's recolorable fabric ramp.
 bed=crop(W,0,416,64,96);paste(bed,fabric(crop(U,128,480,64,96)),0,0)
 p=canvas(124,219);shadow(p,62,214,102);paste(p,bed,6,42,112,168);add('fixed-bed',p)
 p=canvas(67,116);shadow(p,34,112,50);paste(p,fabric(crop(U,64,320,32,64)),7,10,52,104);add('fixed-sofa',p)
 p=canvas(78,123);shadow(p,39,119,66);paste(p,crop(W,0,608,64,96),3,6,72,108);add('fixed-wardrobe',p)
 p=canvas(73,125);shadow(p,36,122,62);paste(p,crop(W,352,128,32,40),4,5,64,80);paste(p,crop(W,288,192,32,16),4,85,64,32);paste(p,flower('flower-pot-fern'),9,-3,22,27);add('fixed-bookcase',p)
 p=canvas(136,89);shadow(p,68,83,118);paste(p,crop(W,128,288,64,64),5,19,126,62);paste(p,crop(W,384,32,32,24),45,6,28,21);paste(p,frame(v5,v5m,'gift-box-closed') if 'gift-box-closed' in v5m else crop(W,384,0,32,32),91,4,29,31);add('fixed-desk',p)
 p=canvas(87,153);tile(p,recolor(crop(S,160,640,32,64),['#7d758a','#a59aac','#d1c1cc','#ecdbd2']), (13,7,61,94));paste(p,crop(W,384,752,96,80),0,76,87,73);add('fixed-fireplace',p)
 p=canvas(175,195);rug=recolor(crop(F,288,224,96,96),['#8f7698','#b59bb6','#dbc4d6','#f2e0df','#fff1e0']);paste(p,rug,5,15,165,165);add('room-rug',p)
 items={
  'chair':(44,57,fabric(crop(U,128,160,32,32))),
  'tea':(54,43,crop(W,224,224,64,64)),
  'lamp':(34,77,fabric(crop(U,0,64,32,32))),
  'piano':(66,58,crop(W,0,832,80,80)),
  'screen':(57,83,fabric(crop(U,128,64,32,64))),
  'catBed':(49,29,fabric(crop(U,128,288,32,32))),
  'cushion':(38,22,fabric(crop(U,160,288,32,32)))
 }
 for n,(w,h,im)in items.items():
  p=canvas(w,h);shadow(p,w/2,h-3,w*.75);q=fit(im,w-2,h-5);paste(p,q,(w-q.width)/2,h-q.height-3)
  if n=='lamp':
   d=ImageDraw.Draw(p);d.line((17,35,17,70),fill='#a88e6c',width=2);d.ellipse((9,68,25,73),fill='#bea383')
  add('furniture-'+n,p)
 # Plants come from the already licensed V5 plant originals, not repeated symbols.
 for n,fl in [('plant','flower-pot-fern'),('vase','flower-pot-lily')]:
  w,h=(42,60)if n=='plant'else(38,54);p=canvas(w,h);q=fit(flower(fl),w,h-3);shadow(p,w/2,h-3,w*.7);paste(p,q,(w-q.width)/2,h-q.height-2);add('furniture-'+n,p)
 for on in [False,True]:
  suffix='-on'if on else'-off'
  p=canvas(68,57);shadow(p,34,54,61);paste(p,fabric(crop(U,128,224,64,32)),1,16,66,33);add('furniture-vintageSofa'+suffix,p)
  p=canvas(54,91);paste(p,crop(W,192,416,64,112),0,0,54,91);curtain=open_curtain()if not on else fabric(crop(U,96,0,64,64));paste(p,curtain,3,1,48,76);add('furniture-laceDrape'+suffix,p)
  p=canvas(54,83);shadow(p,27,80,46);paste(p,crop(W,352,64,32,64),6,4,42,76)
  for x,y,n in [(11,20,'flower-pot-lily'),(29,39,'flower-pot-fern'),(10,54,'flower-pot-lily')]:paste(p,flower(n),x,y,15,21)
  if on:
   d=ImageDraw.Draw(p);d.line((10,11,10,63),fill='#ebe6cc');d.line((27,42,31,38),fill='#c4ddcf')
  add('furniture-glassCabinet'+suffix,p)
  p=frame(play,playm,'furniture-berryLamp'+suffix);q=fabric(crop(U,0,64,32,32));paste(p,q,3,3,28,29);d=ImageDraw.Draw(p);d.polygon([(9,8),(16,2),(24,7),(21,12),(14,10)],fill='#7a9b81');add('furniture-berryLamp'+suffix,p)
 # Keep projector and swing identities; enrich their structure with the same frame vocabulary.
 for n in ['starProjector','flowerSwing']:
  for state in ['off','on']:
   p=frame(play,playm,'furniture-'+n+'-'+state)
   if n=='flowerSwing':paste(p,fabric(crop(U,128,160,32,32)),17,46,34,28);paste(p,flower('flower-pot-fern'),-3,74,22,26)
   add('furniture-'+n+'-'+state,p)
def surfaces():
 board=recolor(crop(F,192,1152,64,32),['#8c7d9f','#a99ab8','#c6b5d0','#decde0','#ede0e6'])
 for n,ramp in [('wood',None),('pale',['#9d92a2','#c2b3bc','#ddd0ce','#f1e4da']),('herringbone',['#8d7381','#b7989d','#d6b9b4','#f3dad0'])]:
  p=canvas(432,570);im=board if ramp is None else recolor(crop(F,192,1152,64,32),ramp);tile(p,im,(0,0,432,570));add('floor-'+n,p)
 # The exact existing arched aperture is preserved for weather and camera compatibility.
 base=frame(v6,v6m,'cabin-walls-original');mask=base.getchannel('A')
 for n in ['original','floral','gingham']:
  p=base.copy();surface=recolor(crop(S,512,1408,64,96),['#a8a0b4','#c6bfd1','#e4d8df','#f6e9dd'])
  if n=='floral':surface=recolor(crop(S,0,1408,64,96),['#aa9fb9','#c5bad3','#e6d9e5','#f3e8e1'])
  tile(p,surface,(35,40,361,205));d=ImageDraw.Draw(p)
  # Carved panelling below the sill, using real native tile joinery.
  tile(p,recolor(crop(S,0,2528,64,64),['#82728b','#aa94ac','#ceb8c9','#efdfdb']),(34,246,364,49))
  # Retain the transparent arch and replace the thin old drapes with LPC gathered cloth.
  p.putalpha(mask)
  # Restore frame/glass area from the original before adding detailed drapery.
  original=frame(v6,v6m,'cabin-walls-original');paste(p,crop(original,98,42,238,201),98,42)
  paste(p,open_curtain(),96,44,242,171)
  # Open the fabric over the glass; only the ties and valance remain in front.
  # Source open curtains have native alpha so the mountain window stays visible.
  add('cabin-walls-'+n,p)
def plant(p,x,y,w=26,n='flower-pot-lily'):
 im=flower(n);paste(p,im,x,y,w,im.height*w/im.width)
def florist():
 p=canvas(432,850);d=ImageDraw.Draw(p);d.rectangle((0,0,431,849),fill='#3d3b51')
 floor=recolor(crop(F,192,1216,64,32),['#806b77','#aa8c8d','#c8aaa1','#e5c7b3','#f5ddc7']);tile(p,floor,(24,286,384,541))
 wall=recolor(crop(S,512,1408,64,96),['#657f80','#9cb4a5','#bfd0b6','#e0dfc8']);tile(p,wall,(28,25,376,253));d=ImageDraw.Draw(p);d.rectangle((28,273,403,286),fill='#ddd1b4');d.rectangle((28,286,403,290),fill='#8a7784')
 # Tall greenhouse window: timber frames and hanging baskets give the upper wall depth.
 d.rectangle((153,48,282,248),fill='#76687d');d.rectangle((159,53,276,241),fill='#c8d5c5')
 d.polygon([(160,168),(186,150),(215,161),(245,138),(275,168),(275,240),(160,240)],fill='#9bb7a3');d.polygon([(160,194),(210,182),(275,191),(275,240),(160,240)],fill='#c0c4a1')
 for i in range(25):d.rectangle((164+i*31%106,202+i*13%32,165+i*31%106,203+i*13%32),fill=['#ddb4cf','#f4e2b9','#b7b4d6'][i%3])
 for x in [157,214,274]:d.rectangle((x,53,x+3,244),fill='#a58b84')
 for y in [105,168,241]:d.rectangle((157,y,278,y+3),fill='#b69d8d')
 # Native carved cabinets arranged at distinct heights rather than identical vase rows.
 for x,y,h in [(39,103,137),(299,137,128)]:
  paste(p,crop(W,320,128,32,64),x,y,91,h)
  for row in range(2):
   for j in range(3):plant(p,x+5+j*28,y+8+row*61,24,['flower-pot-lily','flower-pot-fern','flower-rose'][j])
 # 4 professional kitchen cabinet modules form a coherent low counter.
 for i in range(4):paste(p,crop(W,96+i%2*32,0,32,64),26+i*43,337,43,88)
 paste(p,crop(W,0,224,96,32),23,311,180,36)
 plant(p,45,266,29);plant(p,85,266,26,'flower-pot-fern');plant(p,139,275,32,'flower-rose')
 # Packaging desk from the same timber set; paper, ribbon and tools remain at the real hotspot.
 paste(p,crop(W,128,288,64,64),277,471,119,105)
 paste(p,crop(W,0,224,96,32),273,450,126,31)
 d=ImageDraw.Draw(p)
 for i,col in enumerate(['#ecdbbd','#dcb4c8','#aaa3cc']):d.rounded_rectangle((284+i*22,433,300+i*22,453),radius=3,fill=col,outline='#87738a')
 d.polygon([(351,457),(373,451),(382,455),(360,463)],fill='#f5e7cb');d.line((361,450,377,461),fill='#87939f',width=2);d.line((360,460,377,449),fill='#d4d3c6',width=2);d.ellipse((355,447,362,453),outline='#9a779e',width=2);d.ellipse((354,458,362,464),outline='#9a779e',width=2)
 paste(p,crop(K,0,1408,32,32),327,473,20,26)
 # Florist rugs, small stand, glass cabinet and terracotta group stay outside the aisle.
 paste(p,recolor(crop(F,288,224,96,96),['#8f7698','#b59bb6','#dbc4d6','#f2e0df','#fff1e0']),158,494,116,170)
 paste(p,ART['furniture-glassCabinet-on'],300,615,78,118)
 paste(p,crop(W,320,128,32,64),40,514,63,99)
 for x,y in [(43,497),(73,552)]:plant(p,x,y,27,'flower-pot-fern')
 for x,y in [(51,715),(346,740)]:plant(p,x,y,40)
 # Hanging baskets, outlined sign and a narrow genuine picture frame.
 for x,y in [(129,75),(284,89)]:
  d.line((x,27,x,y),fill='#8b7c84');plant(p,x-13,y,26,'flower-pot-fern')
 d.rounded_rectangle((162,22,271,42),radius=3,fill='#f0d9be',outline='#806e85',width=2)
 for x in [173,190,211,232,249]:d.line((x,29,x+9,29),fill='#8e758b');d.line((x,34,x+6,34),fill='#b399a4')
 d.rectangle((180,784,252,821),fill='#9d7e8b');d.rectangle((185,789,246,816),fill='#e4cbb5');add('florist-room',p)
def ruins():
 # Use native artisanal stone and masonry, with a dark ink/blue palette and warm focal lights.
 rock=crop(F,448,1824,64,32)
 for i in range(12):
  p=canvas(64,64);piece=tone(crop(F,480,1824,32,32),['#1c2a3d','#26354a','#304158','#394b61','#485b70']);piece=piece.transpose(Image.Transpose.FLIP_LEFT_RIGHT) if i%3==0 else piece;piece=piece.transpose(Image.Transpose.FLIP_TOP_BOTTOM) if i%4==0 else piece;paste(p,piece,0,0,64,64)
  add('ruins-floor-'+str(i),p)
 for i in range(3):
  p=canvas(96,72);wall=recolor(crop(S,160+i*32,640,64,64),['#141d30','#24314a','#35445e','#4e607b','#7c8c9c']);paste(p,wall,0,10,96,62);d=ImageDraw.Draw(p);d.polygon([(0,10),(12,0),(95,0),(84,10)],fill='#52657e');d.line((1,11,84,11),fill='#8795a4');d.polygon([(84,12),(96,0),(96,61),(84,71)],fill='#1b2b40');add('ruins-wall-'+str(i),p)

 for state in range(4):
  old=frame(v6,v6m,'ruins-chest-'+str(state));p=canvas(*old.size)
  q=crop(K,352,320 if state>=2 else 256,32,32)
  # A softened wood/gold palette keeps amber treasure readable in cool stone.
  q=Image.blend(q,Image.new('RGBA',q.size,'#957b76'),.12);q.putalpha(crop(K,352,320 if state>=2 else 256,32,32).getchannel('A'))
  paste(p,q,3,p.height-40,38,38)
  if state==1:
   d=ImageDraw.Draw(p);d.rectangle((18,p.height-17,21,p.height-14),fill='#f5d590')
  if state>=2:
   d=ImageDraw.Draw(p)
   for x,y in [(12,33),(20,31),(26,34),(16,36)]:
    yy=p.height-48+y;d.ellipse((x,yy,x+5,yy+3),fill='#b68045',outline='#f1cb75');d.point((x+2,yy+1),fill='#fff0b5')
  add('ruins-chest-'+str(state),p)
 # Small glass vessels are genuine glassware with highlight and transparent necks.
 for name,col in [('amber',(240,174,82)),('cyan',(88,191,201))]:
  p=canvas(144,100);px=p.load()
  for y in range(0,100,2):
   for x in range(0,144,2):
    r=((x-72)/72)**2+((y-50)/50)**2;a=round(38*max(0,1-r)**2)
    if a:
     for yy in range(y,min(100,y+2)):
      for xx in range(x,min(144,x+2)):px[xx,yy]=(*col,a)
  add('ruins-light-'+name,p)
 for name in ['ruins-pillar','ruins-statue','ruins-mural']:
  p=frame(v6,v6m,name);p=recolor(p,['#18253b','#293c53','#43566b','#61758a','#899b9f']);add(name,p)

def pack():
 width,height=1024,2048;free=[(1,1,width-2,height-2)];pos={}
 for name,im in sorted(ART.items(),key=lambda a:-max(a[1].size)):
  w,h=im.width+2,im.height+2;fits=[(min(r[2]-w,r[3]-h),r[2]*r[3]-w*h,r)for r in free if r[2]>=w and r[3]>=h];assert fits,('atlas full',name);_,_,(x,y,_,_)=min(fits);pos[name]={'x':x+1,'y':y+1,'w':im.width,'h':im.height};nextfree=[]
  for fx,fy,fw,fh in free:
   if x>=fx+fw or x+w<=fx or y>=fy+fh or y+h<=fy:nextfree.append((fx,fy,fw,fh));continue
   if x>fx:nextfree.append((fx,fy,x-fx,fh))
   if x+w<fx+fw:nextfree.append((x+w,fy,fx+fw-x-w,fh))
   if y>fy:nextfree.append((fx,fy,fw,y-fy))
   if y+h<fy+fh:nextfree.append((fx,y+h,fw,fy+fh-y-h))
  free=[r for i,r in enumerate(nextfree)if not any(i!=j and r[0]>=q[0] and r[1]>=q[1] and r[0]+r[2]<=q[0]+q[2] and r[1]+r[3]<=q[1]+q[3]for j,q in enumerate(nextfree))]
 atlas=canvas(width,height)
 for n,im in ART.items():paste(atlas,im,pos[n]['x'],pos[n]['y'])
 atlas.save(OUT/'atelier.png',optimize=True);(OUT/'atlas.json').write_text(json.dumps({'width':width,'height':height,'frames':pos},indent=2));print(len(ART),'licensed subject frames',atlas.size,(OUT/'atelier.png').stat().st_size,'bytes')
if __name__=='__main__':furniture();surfaces();florist();ruins();pack()
