"""V5 local pixel atelier. Rebuild original subjects into a packed PNG atlas.
No remote runtime, paid model, diffusion image or photo conversion. Pillow only.
The selected karsiori flower originals are CC0; provenance is in SOURCE.json.
"""
from PIL import Image, ImageDraw, ImageOps
from pathlib import Path
import math, json, hashlib, colorsys, random, shutil
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'src/assets/v5'; OUT.mkdir(parents=True,exist_ok=True)
PREVIOUS=json.loads((OUT/'SOURCE.json').read_text()) if (OUT/'SOURCE.json').exists() else {}; PRIOR={r['file']:r for r in PREVIOUS.get('local_originals',[])}
ART={}; META={}; SRC=[]
INK='#443f59'; WOOD='#916675'; GOLD='#c79a64'; CREAM='#f6dec1'; ROSE='#d79daf'
FAB=['#78576f','#ac718e','#d798ae','#efbfd0','#ffe1d7']
def rgb(v):return tuple(int(v[i:i+2],16) for i in (1,3,5)) if isinstance(v,str) else tuple(v[:3])
def mix(a,b,t):a=rgb(a);b=rgb(b);return tuple(round(x*(1-t)+y*t) for x,y in zip(a,b))
def curve(points,steps=30):
 a,b,c,d=points;return [((1-t)**3*a[0]+3*(1-t)**2*t*b[0]+3*(1-t)*t*t*c[0]+t**3*d[0],(1-t)**3*a[1]+3*(1-t)**2*t*b[1]+3*(1-t)*t*t*c[1]+t**3*d[1]) for t in [i/steps for i in range(steps+1)]]
class P:
 def __init__(self,w,h):self.im=Image.new('RGBA',(w,h));self.d=ImageDraw.Draw(self.im)
 def r(self,x,y,w,h,c):
  if w>0 and h>0:self.d.rectangle((round(x),round(y),round(x+w-1),round(y+h-1)),fill=c)
 def poly(self,pts,c):self.d.polygon([(round(x),round(y)) for x,y in pts],fill=c)
 def line(self,pts,c,w=1):self.d.line([(round(x),round(y)) for x,y in pts],fill=c,width=w)
 def el(self,box,c):self.d.ellipse(tuple(round(v) for v in box),fill=c)
 def bez(self,pts,c,w=1):self.line(curve(pts),c,w)
 def paste(self,im,x,y,scale=1,flip=False):
  if flip:im=ImageOps.mirror(im)
  if scale!=1:im=im.resize((max(1,round(im.width*scale)),max(1,round(im.height*scale))),Image.Resampling.NEAREST)
  self.im.alpha_composite(im,(round(x),round(y)))
 def shade(self,mask,color,depth=.35,cloth=False,grain=False):
  # A compact, deliberately banded material ramp paints the volume, not an outline.
  b=mask.getbbox()
  if not b:return
  x0,y0,x1,y1=b; px=self.im.load();mp=mask.load();cx=(x0+x1)/2;cy=(y0+y1)/2
  ramp=FAB if cloth else [mix(color,INK,.53),mix(color,INK,.32),rgb(color),mix(color,CREAM,.23),mix(color,CREAM,.49)]
  for y in range(y0,y1):
   for x in range(x0,x1):
    if not mp[x,y]:continue
    nx=(x-cx)/max(1,(x1-x0)/2);ny=(y-cy)/max(1,(y1-y0)/2)
    bulge=max(0,1-nx*nx*.55-ny*ny*.40)
    light=(.52+nx*.045-ny*.06+bulge*.13) if cloth else (.55+nx*.17-ny*.19+bulge*.12)
    if grain:light+=.035*math.sin(x*.9+math.sin(y*.13)*2)+.022*math.sin(y*.8)
    level=max(0,min(4,round(light*4)))
    # Slim dark terminator on the lower/left contour; highlights are broken.
    if x==x0 or y==y1-1 or (x>0 and not mp[x-1,y] and nx<0):level=max(0,level-1)
    col=rgb(ramp[level]);px[x,y]=(*col,255)
 def cushion(self,box,color=ROSE,radius=9,cloth=True):
  mask=Image.new('L',self.im.size);d=ImageDraw.Draw(mask);d.rounded_rectangle(box,radius=radius,fill=255);self.shade(mask,color,cloth=cloth)
 def bowl(self,cx,cy,rx,ry,color):
  mask=Image.new('L',self.im.size);ImageDraw.Draw(mask).ellipse((cx-rx,cy-ry,cx+rx,cy+ry),fill=255);self.shade(mask,color)
 def box(self,x,y,w,h,color,top=5,side=4):
  self.poly([(x,y+top),(x+w-side,y+top),(x+w-side,y+h),(x,y+h)],mix(color,INK,.08))
  self.poly([(x+w-side,y+top),(x+w,y),(x+w,y+h-top),(x+w-side,y+h)],mix(color,INK,.32))
  self.poly([(x,y+top),(x+side,y),(x+w,y),(x+w-side,y+top)],mix(color,CREAM,.30))
  self.line([(x,y+top),(x,y+h),(x+w-side,y+h),(x+w,y+h-top)],mix(color,INK,.46))
 def book(self,x,y,w,h,col):
  self.box(x,y,w,h,col,2,2);self.r(x+2,y+3,1,h-5,mix(col,CREAM,.6));self.r(x+4,y+h-3,w-8,1,'#ead6b8')
 def stem(self,x,y,dx,h):self.bez([(x,y),(x-2,y-h*.3),(x+dx,y-h*.6),(x+dx,y-h)],'#547567')
 def leaf(self,x,y,dx,dy,col='#74957b'):
  self.poly([(x,y),(x+dx*.3-dy*.15,y+dy*.3+dx*.15),(x+dx,y+dy),(x+dx*.6+dy*.15,y+dy*.6-dx*.15)],col)
  self.line([(x,y),(x+dx*.8,y+dy*.8)],mix(col,CREAM,.25))
 def flower(self,x,y,s=4,color=ROSE,kind=0):
  # Different silhouettes: layered rose, loose cosmos, bell, daisy.
  if kind%4==0:
   self.bowl(x,y,s,s*.65,mix(color,INK,.22));self.bowl(x+1,y-1,s*.75,s*.5,color);self.bez([(x-s*.4,y),(x-s*.5,y-3),(x+3,y-3),(x+2,y)],mix(color,CREAM,.7));self.r(x,y-1,2,1,mix(color,INK,.23))
  elif kind%4==1:
   for k in range(5):a=k*math.tau/5;self.bowl(x+math.cos(a)*s*.55,y+math.sin(a)*s*.35,s*.55,s*.35,color)
   self.bowl(x,y,1.3,1,'#e9bc74')
  elif kind%4==2:
   self.poly([(x-s,y-3),(x+s,y-3),(x+s*.7,y+3),(x+1,y+4),(x,y+2),(x-1,y+4),(x-s*.7,y+3)],color);self.line([(x-s+1,y-3),(x-s*.6,y+1)],mix(color,CREAM,.6))
  else:
   for k in range(8):a=k*math.tau/8;self.line([(x+math.cos(a)*1.5,y+math.sin(a)),(x+math.cos(a)*s,y+math.sin(a)*s*.6)],color,2)
   self.bowl(x,y,1.7,1.3,'#edc989')
 def pot(self,x,y,w,h,color='#b99195'):
  self.poly([(x,y+3),(x+w,y+3),(x+w-3,y+h),(x+4,y+h)],mix(color,INK,.2));self.poly([(x+2,y+3),(x+w-2,y+3),(x+w-5,y+h-1),(x+5,y+h-1)],color);self.bowl(x+w/2,y+2,w/2,3,mix(color,CREAM,.4));self.bowl(x+w/2,y+1,w/2-2,1.5,'#605564');self.r(x+5,y+6,2,max(1,h-9),mix(color,CREAM,.5))
def add(name,p,kind='interior'):
 ART[name]=p.im if isinstance(p,P) else p;META[name]={'kind':kind}
def shadow(p,cx,cy,rx,ry):
 p.el((cx-rx-2,cy-ry-1,cx+rx+2,cy+ry+1),(48,47,66,24));p.el((cx-rx,cy-ry,cx+rx,cy+ry),(48,47,66,55))
def tuft(p,x,y):p.r(x,y,1,2,FAB[0]);p.r(x+1,y,1,1,FAB[4])
def arch(p,box,color,border=INK,thick=2):
 x,y,w,h=box;mask=Image.new('L',p.im.size);d=ImageDraw.Draw(mask);d.ellipse((x,y,x+w,y+w),fill=255);d.rectangle((x,y+w/2,x+w,y+h),fill=255);p.shade(mask,border)
 if thick:
  arch(p,(x+thick,y+thick,w-thick*2,h-thick*2),color,border,0)
 else:p.shade(mask,color)

def furniture():
 sizes={'chair':(44,57),'tea':(54,43),'lamp':(34,77),'plant':(42,60),'vase':(38,54),'piano':(66,58),'candles':(30,43),'record':(43,49),'screen':(57,83),'cushion':(38,22),'easel':(42,65),'catBed':(49,29)}
 for kind,(w,h) in sizes.items():
  p=P(w,h);shadow(p,w/2,h-3,w*.43,2)
  if kind=='chair':
   for x in [8,33]:p.bez([(x,43),(x-2,48),(x+1,51),(x-2,55)],'#62495d',3);p.r(x-2,54,4,1,GOLD)
   p.cushion((4,7,39,41),radius=15);p.cushion((8,5,35,35),radius=13)
   for x,y in [(11,9),(20,6),(29,9)]:p.bez([(22,35),(x,29),(x-1,20),(x,y)],FAB[1]);p.bez([(23,34),(x+1,28),(x,18),(x+1,y)],FAB[3])
   p.cushion((5,34,39,49),radius=6);p.cushion((1,27,9,48),radius=4);p.cushion((35,27,42,48),radius=4)
   p.cushion((13,28,31,40),'#f0d1be',radius=4,cloth=False);p.bez([(15,29),(20,36),(23,33),(29,38)],'#cfadbc');tuft(p,21,33)
  elif kind=='tea':
   p.bowl(27,36,13,4,'#83606c');p.box(24,23,6,14,WOOD,2,2);p.bowl(27,21,25,10,'#7b5968');p.bowl(27,18,25,9,'#e9cfb2');p.bowl(27,16,23,7,'#f4e0c6');p.bez([(8,17),(19,12),(29,22),(44,16)],'#c2b6b9')
   p.bowl(28,13,9,6,'#a8c4bd');p.bowl(28,8,8,4,'#d0e0cf');p.bowl(28,7,6,2,'#789aa4');p.r(26,3,3,3,GOLD);p.bez([(35,10),(39,8),(40,6),(42,7)],'#cfe0cf',3);p.bez([(20,10),(13,7),(13,18),(21,16)],'#789c9d',2)
   p.bowl(13,24,6,2,CREAM);p.bowl(13,21,4,3,'#d9c2b9');p.bowl(13,19,3,1,'#986f68');p.bowl(39,23,5,2,'#eee0be');p.flower(39,21,3,'#ce91a7')
  elif kind=='lamp':
   p.bowl(17,71,13,4,'#7f665b');p.bowl(17,69,10,3,GOLD);p.bez([(17,67),(16,49),(17,30),(22,21)],GOLD,2);p.bez([(18,67),(17,48),(18,32),(23,22)],'#f8dca7')
   mask=Image.new('L',(w,h));d=ImageDraw.Draw(mask);d.ellipse((6,1,30,29),fill=255);d.ellipse((14,-2,33,22),fill=0);p.shade(mask,'#e5c385');p.bez([(9,7),(7,16),(9,23),(16,25)],'#fbe8b6');p.line([(25,26),(25,38)],'#b18a74');p.flower(25,40,3,'#efdaab',1)
  elif kind=='plant':
   p.pot(10,41,25,16,'#aebdc1');p.r(16,45,13,1,'#d9e0cc');p.r(18,49,9,1,'#7697a1')
   for i,(x,y) in enumerate([(9,27),(18,22),(31,28),(19,13),(29,15),(11,13)]):
    p.stem(23,43,x-23,43-y);p.leaf(x,y+13,-8,-5);p.leaf(x,y+8,9,-3)
    for j in range(7):a=j*2.4;p.flower(x+math.cos(a)*4,y+math.sin(a)*3,2.5,'#bba2ce' if j%2 else '#d2c2df',1)
  elif kind=='vase':
   for x in [7,29]:p.line([(x,31),(x-2,51)],WOOD,2)
   p.line([(7,36),(29,48)],'#bd9c85',2);p.line([(30,36),(7,48)],'#bd9c85',2);p.box(3,29,32,6,'#d2b08e',3,3)
   p.bowl(19,24,8,8,'#91afbb');p.box(15,13,8,12,'#b6ccd0',2,2);p.bowl(19,13,5,2,'#8da2b4');p.line([(14,22),(15,28)],'#e6e3d0',2)
   for i,(x,y) in enumerate([(6,7),(15,3),(26,5),(32,10),(20,12)]):p.stem(19,16,x-19,16-y);p.flower(x,y,3.5,ROSE,i)
  elif kind=='piano':
   p.box(4,9,57,36,'#c6b5a4',5,5);p.cushion((8,3,57,27),'#eadbc0',radius=10,cloth=False);p.poly([(10,21),(56,21),(56,31),(10,31)],'#a68c93')
   for x in [8,53]:p.bez([(x,39),(x-1,45),(x+2,50),(x,55)],'#8e6974',4);p.r(x-1,53,5,2,GOLD)
   p.box(1,32,63,13,'#dbc7ad',4,4);p.r(7,35,49,7,'#f8ebd1')
   for i in range(12):x=7+i*4;p.r(x,35,1,7,'#baa5a0');p.r(x+1,35,2,4,'#4c4359') if i%7 not in [2,6] else None
   p.book(20,14,25,16,'#e0ccd3');p.line([(31,16),(31,27)],'#b69aa7');p.line([(23,20),(28,20)],'#9b819c');p.line([(35,20),(41,20)],'#9b819c');p.r(30,47,3,6,GOLD);p.r(39,47,3,6,GOLD);p.bowl(54,26,3,4,'#96aeb1');p.flower(54,22,3,ROSE)
  elif kind=='candles':
   p.bowl(15,38,10,3,'#806373');p.bowl(15,36,8,2,GOLD);p.line([(15,14),(15,36)],GOLD,3)
   for x,y in [(6,12),(15,6),(24,12)]:
    p.bez([(15,29),(x,29),(x,y+10),(x,y+8)],GOLD,2);p.bowl(x,y+11,4,2,GOLD);p.cushion((x-2,y-3,x+2,y+10),'#f2dfc2',2,False);p.r(x-1,y-1,1,7,'#fff0d9');p.r(x,y-6,1,3,'#775965')
  elif kind=='record':
   p.box(4,31,34,14,'#956b70',4,4);p.r(10,37,20,2,'#c29488');p.r(25,40,3,1,GOLD);p.bowl(19,31,12,4,'#413e55');p.bowl(19,31,8,2,'#676779');p.bowl(19,31,2,1,GOLD);p.bez([(32,31),(33,25),(27,26),(26,29)],GOLD,2)
   p.bez([(23,28),(17,27),(24,22),(25,18)],GOLD,4);p.poly([(24,21),(11,11),(10,7),(23,2),(38,8),(34,19)],'#b68a60');p.bowl(24,8,14,6,'#caa472');p.bowl(24,7,11,4,'#8b7274');p.bowl(24,7,7,2,'#52495a');p.line([(11,8),(17,16),(24,21)],'#f1d3a1',2);p.bez([(36,38),(43,33),(40,41),(36,41)],GOLD)
  elif kind=='screen':
   for i in range(3):
    x=2+i*18;y=6 if i%2==0 else 1;arch(p,(x,y,17,74),'#eadbcf','#8c6c7a',2);p.r(x+3,76,3,6,WOOD);p.r(x+12,76,3,6,WOOD);p.bez([(x+7,68),(x+13,50),(x+2,38),(x+9,21)],'#6e8a76')
    for j in range(4):p.leaf(x+8,53-j*8,(-1)**j*5,-3);p.flower(x+8,29+j*9,2,ROSE,j)
  elif kind=='cushion':
   p.cushion((2,3,35,19),radius=9);p.bez([(4,14),(14,23),(26,19),(35,14)],FAB[0]);p.bez([(5,12),(14,20),(27,18),(34,12)],FAB[3]);tuft(p,18,9);p.line([(4,17),(2,20)],GOLD,2);p.line([(33,17),(35,20)],GOLD,2)
  elif kind=='easel':
   p.line([(19,5),(6,63)],'#765561',3);p.line([(23,7),(35,63)],'#9c776e',3);p.line([(23,17),(30,63)],'#b6957a',2);p.box(3,5,36,41,'#c9a87e',3,3);p.r(7,10,26,28,'#526d89');p.poly([(7,31),(15,19),(21,26),(26,21),(32,36),(7,36)],'#8d9ba7');p.bowl(27,16,3,3,CREAM)
   for i in range(7):p.flower(8+i*4,35+i%2,2,ROSE,i)
   p.box(1,44,40,5,WOOD,2,2)
  elif kind=='catBed':
   p.bez([(4,20),(3,-1),(42,-1),(45,20)],'#b69779',4);p.bez([(6,18),(8,3),(38,3),(43,19)],'#efd2a5',2);p.bowl(24,19,23,8,'#9d7a71');p.bowl(24,16,22,8,'#d4b58f');p.bowl(24,15,18,6,ROSE);p.bowl(24,14,14,4,'#f0c6d2')
   for j in range(3):
    for i in range(10):x=3+i*4+j%2*2;p.line([(x,21+j*2),(x+2,21+j*2)],'#8e6d6c');p.r(x+1,19+j*2,1,2,'#e6c99f')
  add('furniture-'+kind,p)

def building(name,w,h,shop=False):
 p=P(w,h);base=h-13;front=round(w*(.88 if shop else .70));left=round(w*.06);right=round(w*.94);roofY=round(h*.39);ridge=round(w*.36)
 shadow(p,w/2,base+5,w*.47,7)
 p.poly([(left,roofY+3),(front,roofY+3),(front,base),(left,base)],'#c6a493');p.poly([(front,roofY+3),(right,roofY-15),(right,base-12),(front,base)],'#80677d')
 for y in range(roofY+8,base,8):p.line([(left+3,y),(front-1,y)],'#ad8490');p.line([(front+1,y),(right-2,y-12)],'#644f68')
 for x in [left+6,front-6]:p.box(x,roofY+4,4,base-roofY-3,'#755469',2,1)
 # Tall curved gable and the deep mansard eave are major silhouettes, not trim.
 roof=[(left-7,roofY+4),(left+2,roofY-8),(ridge-7,12),(ridge+1,7),(ridge+8,12),(front+12,roofY-5),(right+7,roofY-16),(right+10,roofY-8),(front+11,roofY+11),(left-7,roofY+13)]
 p.poly(roof,'#4a435f');p.poly([(left-5,roofY+3),(ridge,13),(front+5,roofY+4),(front+5,roofY+8),(left-5,roofY+8)],'#a57596')
 p.poly([(ridge,12),(ridge+round(w*.34),14),(right+7,roofY-17),(front+7,roofY+3)],'#685c83')
 roofBase=p.im.copy()
 # Irregular hand-clustered curved tiles follow the slope and change overlap.
 for row,y in enumerate(range(22,roofY+4,6)):
  extent=(y-14)/(roofY-11);xl=ridge-(ridge-left+5)*extent;xr=ridge+(front-ridge+6)*extent
  for i,x in enumerate(range(round(xl),round(xr-4),9)):
   p.poly([(x,y),(x+7,y-1),(x+8,y+3),(x+6,y+5),(x+1,y+5)],['#98728f','#b38aa3','#a67c9a'][(i+row)%3]);p.line([(x+1,y),(x+6,y)],'#d6a3b3');p.line([(x+1,y+5),(x+6,y+5)],'#735772')
  for x in range(round(ridge+10+extent*23),right-1,10):p.line([(x,y-3),(x+8,y-5)],'#8d7c9d');p.line([(x+2,y-1),(x+8,y-3)],'#534963')
 roofMask=Image.new('L',(w,h));ImageDraw.Draw(roofMask).polygon(roof,fill=255);p.im=Image.composite(p.im,roofBase,roofMask);p.d=ImageDraw.Draw(p.im)
 p.line([(ridge,10),(front+7,roofY+3)],'#ecc8bd',2);p.line([(left-6,roofY+8),(front+6,roofY+8),(right+9,roofY-10)],'#d2a6a6',2)
 # Timbered gable sits above the front wall; dark recessed attic glass.
 p.poly([(left+16,roofY-1),(ridge,27),(front-12,roofY-1)],'#dfb9a2');p.line([(ridge,29),(ridge,roofY)],'#7f6074',3)
 for sign in [-1,1]:p.line([(ridge,roofY-4),(ridge+sign*24,roofY-28)],'#9a7485',2)
 arch(p,(ridge-10,roofY-37,21,28),'#f3d79f','#685167',2);p.line([(ridge,roofY-34),(ridge,roofY-12)],'#936c7c');p.line([(ridge-8,roofY-23),(ridge+8,roofY-23)],'#936c7c')
 # Stone chimney, with a real cap and exposed back face.
 cx=round(w*.76);p.box(cx,12,18,42,'#a58b8b',4,5);p.box(cx-3,8,24,8,'#c9b6a3',3,4)
 for j in range(4):p.r(cx+2,20+j*7,10,1,'#7d6e7e');p.r(cx+5+(j%2)*4,17+j*7,1,4,'#827182')
 # Recessed arched windows and carved shutters, each with a flower box.
 for wx in ([30,108] if shop else [left+9,front-36]):
  wy=roofY+20;arch(p,(wx,wy,27,38),'#ffd59a','#775268',3);p.line([(wx+13,wy+4),(wx+13,wy+34)],'#ac7a78',2);p.line([(wx+4,wy+21),(wx+22,wy+21)],'#b88c7e');p.line([(wx+5,wy+11),(wx+5,wy+28)],'#fff0c4',2)
  for xx in [wx-4,wx+28]:p.box(xx,wy+8,4,30,'#8e718d',2,1)
  p.box(wx-2,wy+37,31,10,'#9f807a',3,3)
  for i in range(7):p.stem(wx+2+i*4,wy+40,(-1)**i*2,5+i%3*2);p.flower(wx+1+i*4,wy+35-i%3*2,2.5,['#de9fb5','#c5b4d5','#f0d6b4'][i%3],i)
 dx=round((left+front)/2-10);arch(p,(dx,base-47,25,47),'#956d7d','#6a5066',3);arch(p,(dx+5,base-41,15,25),'#d5be9a','#d9b49b',1);p.r(dx+16,base-14,3,3,GOLD)
 p.box(dx-6,base,38,6,'#cab29e',3,3);p.box(dx-10,base+5,46,6,'#a7938e',3,3)
 for x,y in [(left+1,roofY+14),(front-1,roofY+15)]:
  p.bez([(x,y),(x-7,y+20),(x+8,y+40),(x-3,base)],'#527669',2)
  for i in range(13):p.leaf(x+math.sin(i*.8)*4,y+i*6,5*(-1)**i,-3);p.flower(x+math.sin(i*.8)*4+3,y+i*6,2,'#d6a5bc',i) if i%3==0 else None
 if shop:
  yy=roofY+11;p.poly([(left+2,yy),(front-2,yy),(front+3,yy+16),(left-3,yy+16)],'#f0dcc0')
  for i in range(0,front-left-2,12):p.poly([(left+2+i,yy),(left+8+i,yy),(left+9+i,yy+14),(left+i,yy+14)],'#cb829b')
  for x in range(left,front,10):p.bowl(x+4,yy+15,5,3,'#ecd2b7' if (x-left)//10%2 else '#d394aa')
 add(name,p,'exterior')

def furniture_fixed():
 # Bed: a shaped upholstered headboard, two folded pillows, inset mattress,
 # wide turned posts and a scalloped draping quilt replace the flat rectangle.
 p=P(124,219);shadow(p,63,209,58,6)
 for x in [10,109]:p.box(x,172,5,38,'#836071',4,2);p.bowl(x+2,207,4,3,GOLD)
 p.box(6,48,113,151,'#98717b',9,11);p.cushion((7,8,116,65),'#b18e89',15,False);p.cushion((15,16,107,60),radius=13)
 for x,y in [(34,29),(59,23),(84,29),(45,44),(73,44)]:tuft(p,x,y)
 p.box(13,59,96,132,'#f0d7c0',7,9);p.cushion((17,58,102,186),'#e9d3bd',10,False)
 for x in [21,63]:
  p.cushion((x,63,x+36,88),'#fbecd5',7,False);p.bez([(x+3,82),(x+13,77),(x+23,88),(x+32,82)],'#dbc6ba');p.line([(x+4,66),(x+30,66)],'#fff3dc')
 p.cushion((17,90,103,186),radius=4);p.poly([(103,94),(111,98),(111,184),(105,195),(100,188)],FAB[1]);p.bez([(20,94),(39,102),(79,99),(101,94)],FAB[4],3)
 for yy in range(110,178,21):
  for xx in [31,59,85]:p.stem(xx,yy+10,2,9);p.leaf(xx,yy+7,-3,-3);p.flower(xx+2,yy,3,'#e9d1ba',1)
 for xx in range(20,100,9):p.bowl(xx,185,5,4,FAB[2]);p.line([(xx-3,185),(xx+2,186)],FAB[3])
 p.box(1,195,121,11,'#b28a8c',5,8);p.line([(8,198),(111,198)],'#ecd0b3',2);add('fixed-bed',p)
 p=P(87,153);p.box(7,11,73,122,'#ad958a',5,9);p.box(1,3,85,13,'#dfc6ac',5,9);p.box(1,134,85,12,'#c8ad96',5,5)
 for y in range(22,70,9):
  for x in range(10,76,18):p.box(x+(y//9%2)*4,y,15,8,'#b49d90',2,2)
 arch(p,(18,69,49,65),'#322d40','#796a75',5)
 for x in range(23,63,7):p.line([(x,126),(x,133)],'#826f7b')
 p.box(14,142,59,7,'#947a79',3,4);p.bowl(23,0,4,3,GOLD);p.bowl(67,0,5,4,'#9cb3ba');add('fixed-fireplace',p)
 p=P(73,125);shadow(p,37,119,32,5);p.box(5,17,64,93,'#83616f',7,8);arch(p,(6,1,60,107),'#cebaaa','#926d79',4)
 for i in range(3):
  y=28+i*25;p.r(12,y,47,19,'#55495b')
  for j in range(8):x=14+j*5;hh=11+(i*3+j*7)%7;p.book(x,y+18-hh,4,hh,['#a9bcc0','#be8d9c','#d8c1a1','#9b9eba'][j%4])
  p.box(10,y+18,51,5,'#bd9d91',2,3)
 p.box(9,106,52,12,'#a17b81',3,4);p.r(32,112,8,1,GOLD);add('fixed-bookcase',p)
 p=P(78,123);shadow(p,40,116,34,5);p.box(5,15,68,101,'#8d6d7a',6,8);arch(p,(6,1,65,109),'#ccbbb2','#765a70',3)
 for x in [12,39]:
  arch(p,(x,15,26,88),'#a9bfc8','#dfcdb7',2);p.poly([(x+4,29),(x+8,22),(x+21,55),(x+20,72)],'#d2d7d3');p.r(x+20,69,2,4,GOLD)
 p.box(3,110,72,7,'#d2b8a1',3,4);p.box(9,117,5,5,WOOD,2,1);p.box(61,117,5,5,WOOD,2,1);add('fixed-wardrobe',p)
 # Velvet chaise with rolled arms and an embroidered loose cushion.
 p=P(67,116);shadow(p,34,108,29,4);p.cushion((8,11,60,94),radius=20);p.cushion((13,19,55,71),radius=16)
 for x,y in [(24,33),(43,33),(34,51)]:tuft(p,x,y)
 p.cushion((6,70,60,100),radius=9);p.cushion((1,52,13,97),radius=6);p.cushion((54,52,65,97),radius=6);p.cushion((21,62,49,83),'#e6c8b6',5,False)
 p.bez([(23,65),(29,77),(40,68),(47,80)],'#be9baf');p.box(10,99,5,11,WOOD,3,1);p.box(53,99,5,11,WOOD,3,1);add('fixed-sofa',p)
 # Writing desk has actual drawers, a blotter, a letter and the existing gift.
 p=P(136,89);shadow(p,69,80,63,5);p.box(7,26,123,16,'#ab7c7b',7,9)
 for x in [17,109]:p.box(x,39,8,43,'#9a7072',3,3);p.r(x+2,43,2,28,'#c89d89')
 for x in [14,67]:p.box(x,34,49,14,'#c29288',3,4);p.r(x+20,40,9,1,GOLD)
 p.book(34,17,37,17,'#9aaeb1');p.r(39,20,25,9,'#e8dcc4');p.line([(43,23),(60,23)],'#b7a19b');p.box(89,10,27,24,'#d69ab0',5,5);p.r(101,12,4,20,'#f0d6b2');p.bez([(102,11),(88,-1),(89,10),(102,11)],'#f0d6b2',2);p.bez([(104,11),(119,0),(120,12),(104,11)],'#f0d6b2',2);add('fixed-desk',p)
 # The rug is a hand-motif oval, with alternating woven borders and leaf medallion.
 p=P(175,195);p.el((0,0,174,194),'#806774');p.el((3,2,170,190),'#c7a5b0');p.el((7,7,166,184),'#e8c9bb');p.el((11,11,162,180),'#b27e98');p.el((17,17,156,174),'#d3a5ba');p.el((30,36,143,157),'#c391ac')
 for i in range(28):a=i*math.tau/28;x=87+math.cos(a)*69;y=97+math.sin(a)*78;p.flower(x,y,3,'#e8c8bc',i)
 for i in range(8):a=i*math.tau/8;x=87+math.cos(a)*27;y=96+math.sin(a)*36;p.leaf(87,96,x-87,y-96,'#e5bcb9')
 p.flower(87,96,11,'#f0d6be');add('room-rug',p)
def glassjar(p,x,y,w,h,color):
 p.bowl(x+w/2,y+h-2,w/2,3,'#8b8297');p.cushion((x,y+3,x+w,y+h-2),'#b9cdd2',max(2,w//4),False)
 p.cushion((x+2,y+8,x+w-2,y+h-4),color,max(2,w//4),False)
 for i in range(5):p.bowl(x+4+(i*7)%(max(1,w-7)),y+h-5-(i*9)%(max(1,h-13)),2,2,mix(color,CREAM,.35))
 p.bowl(x+w/2,y+3,w/2,3,'#f0dbc3');p.bowl(x+w/2,y+1,w/2-1,2,'#b8a3a8');p.line([(x+3,y+8),(x+3,y+h-7)],'#edf0df');p.line([(x+w-3,y+10),(x+w-3,y+h-10)],'#8296a6')

def walls():
 for variant in ['original','floral','gingham']:
  p=P(432,300);p.r(0,0,432,300,'#463e53');p.poly([(17,26),(413,26),(404,275),(28,275)],'#e0c6ac');p.poly([(17,26),(35,39),(35,275),(17,295)],'#ad8791');p.poly([(396,39),(413,26),(413,295),(396,275)],'#8a6a81')
  if variant=='floral':
   p.r(36,40,360,203,'#b5abc3')
   for y in range(51,243,39):
    for x in range(48,390,35):p.bez([(x,y+28),(x+8,y+20),(x-6,y+7),(x+4,y)],'#8c9e96');p.leaf(x,y+17,6,-4,'#d6c7c5');p.flower(x+4,y+3,3,'#e8c7cb')
  elif variant=='gingham':
   p.r(36,40,360,203,'#efd5c8')
   for y in range(40,243,12):
    for x in range(36,397,12):
     if (x//12+y//12)%2==0:p.r(x,y,11,11,'#dfbbc2')
  else:
   for x in range(43,390,31):p.line([(x,45),(x,240)],'#c1a7a5');p.line([(x+2,45),(x+2,240)],'#ecd4bc')
  # Real framing and roof beams; ceiling is a different plane from the wall.
  p.poly([(17,26),(66,5),(367,5),(413,26),(396,40),(35,40)],'#b28c87');p.line([(18,27),(213,16),(413,27)],'#e8c9aa',4)
  p.line([(29,30),(104,73)],'#866376',9);p.line([(403,30),(331,73)],'#886675',9);p.line([(31,29),(105,71)],'#cba38e',3);p.line([(402,28),(330,70)],'#d7b29a',3)
  for x in [27,396]:p.box(x,37,10,246,'#9c7580',4,4)
  p.box(28,246,369,18,'#c8a18b',6,7)
  for x in range(36,395,43):p.box(x,264,40,28,'#ac8580',4,3);p.r(x+4,270,29,12,'#c8a294')
  p.box(25,286,379,10,'#7c606f',4,5)
  arch(p,(116,48,200,187),'#e9d1b0','#9b7784',5)
  mask=Image.new('L',p.im.size);d=ImageDraw.Draw(mask);d.ellipse((129,61,302,199),fill=255);d.rectangle((129,126,302,226),fill=255)
  p.im.putalpha(Image.frombytes('L',p.im.size,bytes(0 if v else a for v,a in zip(mask.tobytes(),p.im.getchannel('A').tobytes()))));p.d=ImageDraw.Draw(p.im)
  p.r(211,61,6,166,'#c7a688');p.line([(214,62),(214,223)],'#fae2bd',2);p.r(129,145,174,5,'#b29286');p.box(111,225,211,12,'#ead2ad',5,6)
  # Gathered curtains have contour, sag, folded lit faces and tied sides.
  for side in [0,1]:
   x=101 if not side else 300;sign=1 if not side else -1
   pts=[(x,57),(x+31,57),(x+26,105),(x+12,170),(x+26,218),(x+9,225),(x-4,217)] if not side else [(x,57),(x+31,57),(x+35,216),(x+21,225),(x+5,219),(x+18,170),(x+5,107)]
   p.poly(pts,'#8b769e')
   for k in range(4):
    xx=x+3+k*7;p.bez([(xx,62),(xx+sign*2,100),(xx+sign*7,141),(x+13,169)],['#b6a0b8','#d9b7c4','#a28aa8','#e1bec6'][k],3)
   p.line([(x+7,169),(x+23,171)],GOLD,3);p.line([(x+15,172),(x+10,194)],'#e5c797',2)
  p.bez([(105,56),(143,89),(282,89),(329,56)],'#b69ab1',9);p.bez([(107,53),(151,73),(281,74),(327,53)],'#e1bfc9',3)
  for x,y in [(63,104),(370,111)]:p.line([(x,53),(x,y-5)],'#9d7b86');p.flower(x,y,5,'#e7c18a',1)
  add('cabin-walls-'+variant,p)
 # More airy display-room architecture for the confectionery, no extra NPCs.
 p=P(432,322);p.r(0,0,432,322,'#493c52');p.r(19,25,394,286,'#d2b39e');p.r(28,33,376,258,'#e9d4b8')
 for x in range(33,407,19):p.r(x,34,5,255,'#d9b3ba');p.r(x+5,34,1,255,'#f4e0c2')
 p.poly([(19,25),(43,39),(43,291),(19,312)],'#a37989');p.poly([(390,39),(413,25),(413,312),(390,291)],'#9c7e8d')
 p.box(20,292,392,22,'#a27782',7,7)
 for x in range(37,395,56):p.box(x,303,52,14,'#b28e89',3,4)
 arch(p,(158,41,119,170),'#e5cbb1','#8b6c83',4)
 p.r(173,62,87,137,(0,0,0,0));p.r(214,56,5,143,'#c2a487');p.r(174,124,87,5,'#bc9a86');p.box(153,201,129,10,'#e6ccb0',4,5)
 for x in [70,353]:
  p.line([(x,27),(x,40)],GOLD);p.poly([(x-15,60),(x-9,39),(x+9,39),(x+15,60)],'#9b718d');p.bowl(x,60,15,4,'#e7c9a0');p.bowl(x,63,6,3,'#fff0b6')
 p.box(171,229,91,60,'#997785',5,4);p.r(177,237,78,42,'#505a65');p.bez([(183,240),(207,234),(229,242),(248,240)],'#b5ab9f');add('candy-walls',p)
 # Floor tiles: long boards and laid herringbone, not a square grid.
 for kind in ['wood','pale','herringbone','candy']:
  p=P(432,570);p.r(0,0,432,570,'#78616b')
  if kind=='candy':
   for row,y in enumerate(range(-16,570,8)):
    for col,x in enumerate(range(-24,432,24)):
     x+=12 if row%2 else 0;color=['#f0dbc1','#b7bbae'][(row//2+col)%2];p.poly([(x+12,y),(x+24,y+8),(x+12,y+16),(x,y+8)],color);p.line([(x+1,y+8),(x+12,y+15),(x+23,y+8)],mix(color,INK,.18))
  elif kind=='herringbone':
   for row,y in enumerate(range(-32,570,20)):
    for col,x in enumerate(range(-40,432,40)):
     for sign in [-1,1]:
      pts=[(x+20,y),(x+20+sign*18,y+10),(x+20+sign*18,y+28),(x+20,y+18)];colr=['#c49a79','#d7b38a','#a98473'][(row+col+(1 if sign>0 else 0))%3];p.poly(pts,colr);p.line([pts[0],pts[1],pts[2]],mix(colr,CREAM,.27))
  else:
   colors=['#ae857a','#c49b85','#bd927e','#d2ad8d'] if kind=='wood' else ['#c8c8b9','#d8d8c6','#b5bdba','#d7d6c0']
   for row,y in enumerate(range(0,570,21)):
    for col,x in enumerate(range(-60,432,84)):
     x+=42 if row%2 else 0;color=colors[(row*3+col)%4];p.r(x,y,82,20,color);p.line([(x+1,y),(x+79,y)],mix(color,CREAM,.33));p.bez([(x+4,y+8),(x+20,y+5),(x+40,y+14),(x+68,y+9)],mix(color,INK,.12));p.bez([(x+13,y+14),(x+33,y+17),(x+46,y+12),(x+75,y+14)],mix(color,CREAM,.13))
  add('floor-'+kind,p)

def candy_assets():
 flavors={'strawberry':'#d995aa','pumpkin':'#d8a25f','lavender':'#aaa5d1'}
 for flavor,color in flavors.items():
  for shape in ['moon','star','cat']:
   p=P(96,96);shadow(p,49,82,31,5)
   for flip in [False,True]:
    pts=[(5,31),(25,40),(25,63),(3,72),(10,51)];pts=[(96-x,y) for x,y in pts] if flip else pts
    p.poly(pts,(*mix(color,CREAM,.30),170));p.line([(96-x if flip else x,y) for x,y in [(7,35),(23,44),(11,51),(23,59),(6,68)]],mix(color,CREAM,.6))
   mask=Image.new('L',(96,96));d=ImageDraw.Draw(mask)
   if shape=='star':
    pts=[]
    for i in range(10):a=-math.pi/2+i*math.pi/5;r=32 if i%2==0 else 16;pts.append((48+math.cos(a)*r,44+math.sin(a)*r))
    d.polygon(pts,fill=255)
   elif shape=='moon':d.ellipse((17,12,80,77),fill=255);d.ellipse((37,4,86,56),fill=0)
   else:
    d.ellipse((26,43,73,79),fill=255)
    for x,y,rx,ry in [(22,34,9,12),(40,20,9,13),(59,21,9,13),(76,37,8,11)]:d.ellipse((x-rx,y-ry,x+rx,y+ry),fill=255)
   shell=Image.new('RGBA',(96,96));shell.paste(mix(color,'#6e475f',.55),mask=mask);p.paste(shell,0,5);p.shade(mask,color,grain=False)
   # Icing and reflected light follow the molded form instead of floating dots.
   if shape=='star':p.line([(48,16),(52,29),(67,31)],'#f9e5cf',2);p.line([(29,54),(23,67)],'#f2cdb9',2);p.flower(49,46,8,'#f4d5bb',1)
   elif shape=='moon':p.bez([(30,22),(15,40),(28,66),(48,70)],'#f6debf',3);p.bez([(32,25),(22,40),(29,55),(40,60)],mix(color,CREAM,.36));p.flower(26,45,3,'#f2d3b3',1)
   else:p.bowl(49,62,13,10,mix(color,CREAM,.52));p.bez([(40,55),(48,50),(57,52),(60,61)],'#fae5cd',2);p.line([(19,31),(18,36)],'#f7dfcb',2);p.line([(37,16),(36,22)],'#fbe5d0',2);p.line([(57,16),(56,22)],'#fbe5d0',2)
   for x,y in [(42,62),(59,72),(62,34)]:p.r(x,y,2,1,'#eecda0')
   add('candy-'+flavor+'-'+shape,p,'ui')
 # Working illustrations: actual detailed stage plates for each activity.
 p=P(432,280);p.r(0,0,432,280,'#e1d4bd')
 for x in range(0,432,36):p.box(x,0,35,78,'#ccbdba',3,2)
 p.r(0,79,432,201,'#aa8e85')
 for y in range(88,280,29):p.bez([(0,y),(100,y-3),(300,y+4),(431,y)],'#c9aa96')
 for x,c in [(19,'#c5aac8'),(359,'#e0b97e')]:glassjar(p,x,31,43,65,c)
 p.pot(376,121,34,30,'#b6c5b4');p.line([(390,126),(374,82)],'#cfa377',4);p.line([(389,126),(398,78)],'#8b788a',3)
 shadow(p,216,228,137,11);p.poly([(82,108),(92,176),(126,215),(309,215),(342,175),(351,108)],'#7c8b9e');p.poly([(88,113),(103,174),(132,207),(301,207),(333,174),(345,113)],'#c4d1cd');p.line([(112,157),(126,188),(145,201)],'#f6e7cc',4);p.line([(316,151),(310,188)],'#92a7b3',3);p.bowl(216,110,135,43,'#e3e1d1');p.bowl(216,108,126,35,'#eee0c7');p.bowl(216,107,117,29,'#e8b5c1')
 p.box(49,244,334,23,'#90707c',7,5);p.r(60,250,303,4,'#c5a7a5');add('stage-mix',p,'ui')
 p=P(432,280);p.r(0,0,432,280,'#d4c5bc')
 for y in range(0,205,18):
  for x in range(-15,432,42):p.box(x+(y//18%2)*20,y,40,17,'#d8cbbd',2,2)
 shadow(p,218,198,154,7);p.box(69,37,296,155,'#b2958c',12,18);arch(p,(82,5,267,175),'#d1c0a5','#877081',6);arch(p,(105,30,220,122),'#704f61','#ad8a84',5);arch(p,(114,39,200,107),'#d5a384','#e2c5a2',3);p.r(124,86,180,53,'#8f6171');p.box(118,130,191,12,'#534854',5,7);p.r(137,147,156,5,'#d8b194')
 for x in [129,217,303]:p.bowl(x,174,12,9,'#887080');p.bowl(x,172,9,7,'#bda294');p.r(x,167,1,6,'#f3e0b8')
 p.box(330,67,11,72,'#e0bd8f',4,4);p.r(333,76,3,53,'#fff0bf');p.box(22,217,391,51,'#8a6b7a',9,9);p.r(42,230,348,23,'#d0b7a4');p.r(49,235,329,12,'#6b6073');add('stage-oven',p,'ui')
 # Porcelain presentation plate in a still-life, used by the recipe menu.
 p=P(432,200);p.r(0,0,432,200,'#d9c9ba');p.poly([(21,13),(414,1),(431,192),(1,200)],'#c3b3b9')
 for x in range(0,432,13):p.line([(x,0),(x+17,200)],'#cec1c1')
 p.bowl(216,151,127,28,'#938793');p.bowl(216,145,126,28,'#eadcc4');p.bowl(216,143,118,23,'#b9c6bf');p.bowl(216,140,105,18,'#f5e6d0');p.bez([(116,141),(170,158),(264,160),(315,141)],'#d8b385',2)
 for x,y in [(34,54),(367,52)]:p.stem(x,y+23,8,25);p.leaf(x,y+12,15,-4);p.flower(x+8,y,7,'#d9a0b6',1)
 p.box(10,132,57,31,'#af8a7a',6,6);p.r(20,140,34,14,'#f2dfbf');p.r(23,144,28,1,'#b8979e');add('stage-recipe',p,'ui')
 # Open keepsake box: rear lid, velvet cups and a front face with satin ribbon.
 p=P(256,182);shadow(p,130,168,114,8);p.poly([(22,68),(38,19),(221,19),(238,68)],'#b27e9b');p.poly([(30,66),(43,25),(217,25),(230,66)],'#efc8ce');p.line([(46,31),(211,31)],'#f8e0c8',2);p.box(17,68,223,93,'#c98da8',12,15);p.poly([(25,77),(226,77),(221,133),(31,133)],'#f0d4c1')
 for x in [37,100,163]:p.cushion((x,82,x+56,128),'#bb91a2',8,False);p.cushion((x+4,85,x+52,122),'#e8cdbb',7,False)
 p.r(22,140,201,4,'#e6b4c4');p.r(116,137,17,26,'#e9c998');p.line([(120,138),(120,159)],'#ffebbe',2)
 p.bez([(126,147),(82,123),(86,162),(122,150)],'#f4d7b6',5);p.bez([(128,148),(162,121),(170,160),(132,152)],'#e9c49f',5);p.bowl(126,150,7,5,'#d7ac94');add('gift-box-open',p,'ui')
 # A glass cloche and its turned walnut stand provide the memory-game stage.
 p=P(96,115);shadow(p,48,109,40,4);p.bowl(48,96,40,10,'#806274');p.bowl(48,91,40,9,'#c6a185');p.bowl(48,88,36,7,'#ead0ae');p.bowl(48,12,5,6,'#c5cfd0');p.bez([(12,84),(11,5),(85,6),(84,84)],'#a8c1c7',3);p.bez([(17,77),(15,29),(29,24),(32,22)],'#e4e4d4',2);p.bez([(81,80),(79,37),(77,29),(72,25)],'#7e99ab');add('memory-cloche',p,'ui')
 # Wardrobe mirror frame. The original player portrait remains in the opening.
 p=P(160,224);shadow(p,80,215,64,5);arch(p,(18,5,125,194),'#a6bbc7','#b09186',6);arch(p,(28,15,105,174),'#becdd0','#ead2b2',3);p.poly([(34,63),(45,40),(118,147),(118,178),(95,178)],'#d7dbd3');p.box(14,197,133,10,'#b89588',4,5)
 for x in [31,127]:p.bez([(x,198),(x-7,207),(x+2,214),(x-3,219)],'#997183',4)
 p.flower(80,12,7,'#d5b287',1);add('wardrobe-mirror',p,'ui')
def workshop_props():
 p=P(122,211);shadow(p,60,205,54,4);p.box(4,14,112,186,'#9b7581',7,10);arch(p,(7,0,104,184),'#d2b3a2','#8a687e',4);p.r(15,24,87,146,'#685568')
 for row in range(3):
  y=32+row*49;p.box(11,y+37,96,8,'#ddba9e',3,4)
  for j in range(3):glassjar(p,21+j*28,y,18,35,['#d49bb0','#d1b47c','#a8accb'][(row+j)%3])
 p.box(12,179,93,20,'#bb958c',5,5);p.r(47,188,23,1,GOLD);p.line([(21,14),(96,14)],'#eed2af',2);add('shop-cabinet',p)
 p=P(145,79);shadow(p,71,73,66,4);p.box(5,21,136,20,'#8e6574',8,11);p.box(1,17,143,10,'#e5d3b3',5,7)
 for x in [13,127]:p.bez([(x,35),(x-4,49),(x+4,62),(x,75)],'#89636e',6);p.bez([(x+1,37),(x,50),(x+5,60),(x+1,72)],'#d0a38e',2)
 for x in [14,55,96]:p.box(x,33,35,12,'#bf9491',3,4);p.r(x+13,39,9,1,GOLD)
 p.bowl(70,14,32,12,'#a5bcc1');p.bowl(70,10,32,9,'#d9dfcf');p.bowl(70,9,27,6,'#e5b6bc');p.line([(83,8),(104,-2)],'#be936f',3);glassjar(p,8,2,12,16,'#d6b895');add('shop-mix-table',p)
 p=P(109,98);shadow(p,55,92,49,5);p.box(4,32,101,49,'#ae8291',8,8);arch(p,(12,0,85,68),'#e7d1b5','#8b6679',4);arch(p,(24,17,60,39),'#d9a789','#ac8481',3);p.box(23,51,62,8,'#6c556a',3,4)
 for x in [32,72]:p.bowl(x,69,6,4,'#9d8492');p.r(x,66,1,4,'#f2dbb8')
 p.box(3,84,102,7,'#e6c7a5',3,4);add('shop-oven',p)
 p=P(103,72);shadow(p,50,67,46,3);p.box(4,39,95,13,'#c29e8e',5,7)
 for x in [12,87]:p.box(x,50,5,18,'#896675',2,2)
 p.bowl(50,34,40,9,'#ead8bd');p.line([(12,35),(12,6),(89,6),(89,35)],'#b8ced0');p.line([(16,10),(16,28)],'#ecedde',2)
 for i in range(3):p.paste(ART['candy-'+['strawberry-moon','lavender-star','pumpkin-cat'][i]],20+i*24,8,scale=.24)
 add('shop-tasting-case',p)
 p=P(126,91);shadow(p,63,85,56,4);p.box(3,34,121,16,'#b28b85',6,9)
 for x in [12,109]:p.box(x,47,6,37,'#8a646e',3,2)
 p.paste(ART['gift-box-open'],25,0,scale=.33);p.book(7,21,22,15,'#af9abd');p.bowl(106,33,8,3,'#91728a');p.box(100,17,12,16,'#c6aeb8',3,3);p.bowl(106,17,8,3,'#ecd4ba');add('shop-pack-table',p)
 p=P(98,66);shadow(p,48,60,43,3);p.box(3,26,92,12,'#c6a596',5,6)
 for x in [12,81]:p.box(x,36,5,25,WOOD,2,2)
 p.book(15,11,67,18,'#e4cfc1');p.line([(48,12),(48,24)],'#b391a4');p.bez([(22,17),(28,13),(35,22),(42,18)],'#9d87a0');p.bez([(54,17),(62,13),(68,22),(76,18)],'#9d87a0');add('shop-recipe-desk',p)
 p=P(100,58);p.box(3,2,94,49,'#b8928b',5,6);p.r(10,10,78,29,'#75586d')
 for i in range(3):
  c=['#b2b5cf','#dda6b8','#dac198'][i];p.box(15+i*24,16,21,21,c,4,4);p.r(22+i*24,16,3,19,'#f6dfb6');p.r(16+i*24,25,17,2,'#f6dfb6')
 add('shop-gift-shelf',p)

def landscape_props():
 building('lake-cottage',212,214);building('map-shop',166,166,True);building('map-cabin',101,96)
 p=P(139,145);shadow(p,70,136,63,5);p.poly([(15,69),(85,69),(123,50),(123,121),(85,137),(15,137)],'#7e7088');p.poly([(15,69),(85,69),(85,132),(15,132)],'#bea69c')
 for x in [21,39,57,75]:p.box(x,71,4,61,'#765d74',2,1)
 for i in range(3):
  x=25+i*18;arch(p,(x,75,14,48),'#edc999','#866b80',2);p.r(x+6,79,1,41,'#a88d83');p.r(x+2,99,10,1,'#b09587')
 p.poly([(5,69),(35,24),(89,23),(133,51),(89,77),(5,77)],'#665e7e');p.poly([(12,67),(37,29),(86,29),(124,51),(87,70)],'#99b4bf')
 for i in range(5):p.line([(21+i*12,68),(41+i*8,30)],'#d5c4c1',2)
 for i in range(3):p.line([(20+i*6,55-i*8),(113-i*11,55-i*8)],'#80748f',2)
 p.line([(36,26),(88,25),(131,51)],'#e4cbbb',2);p.box(10,133,81,6,'#ab9397',3,3);p.pot(101,110,21,25,'#a5b1ad')
 for i in range(4):p.stem(111,111,i*3-6,17+i%2*6);p.flower(105+i*4,90-i%2*7,4,'#d8a5c3',i)
 add('lake-conservatory',p,'exterior')
 p=P(98,67);shadow(p,49,60,45,5)
 for x in [9,85]:p.bez([(x,39),(x-3,48),(x+1,54),(x-1,63)],'#5b5065',4)
 p.box(5,38,88,12,'#ac8793',6,6)
 for i in range(4):y=12+i*7;p.box(6,y,86,5,'#c49ba4',2,3);p.bez([(14,y+2),(34,y),(52,y+4),(82,y+1)],'#9e7b8a')
 for x,sign in [(5,-1),(91,1)]:p.box(x,3,3,45,'#776078',2,1);p.bez([(x,36),(x+sign*11,26),(x+sign*8,44),(x,43)],'#8a7185',3)
 p.r(7,40,83,2,'#efc9bc');add('meadow-bench',p,'exterior')
 p=P(124,94);shadow(p,63,80,56,7);p.poly([(4,21),(93,3),(120,75),(25,92)],'#a47c91');p.poly([(6,19),(94,1),(118,72),(25,89)],'#e7c1ce')
 for i in range(7):
  p.line([(10+i*13,18-i*2),(29+i*13,85-i*2)],'#f4dcca');p.line([(8+i*3,24+i*9),(97+i*3,7+i*9)],'#f4dcca')
 p.bowl(30,27,15,6,'#896b6e');p.bowl(30,24,14,6,'#d0a67e');p.bez([(18,23),(14,1),(43,-1),(43,21)],'#bd9675',3)
 for row in range(3):
  for col in range(7):p.r(18+col*4+row%2*2,22+row*3,2,1,'#eac69b')
 for i in range(6):p.stem(30,23,i*3-9,10+i%3*4);p.flower(21+i*3,11-i%3*4,3,['#d69cad','#b3a8ce','#f5d9b9'][i%3],i)
 p.bowl(73,46,17,7,'#f5e3c7');p.bowl(74,43,13,4,'#becac3');p.bowl(73,40,9,6,'#efe0cb');p.bowl(73,38,7,2,'#a67d72');p.book(52,62,33,17,'#9e9fb9');p.flower(100,62,5,'#e2b5c8',1);add('meadow-picnic',p,'exterior')
 # Brass telescope with a rounded glazed barrel and articulated oak tripod.
 p=P(89,116);shadow(p,44,107,36,5)
 for x,y in [(13,109),(72,109),(46,112)]:p.line([(46,52),(x,y)],'#715867',4);p.line([(47,55),(x+1,y-2)],'#c29b8f')
 p.bowl(46,54,8,5,'#aa8a80');p.poly([(9,36),(57,2),(77,27),(30,65)],'#75627f');p.poly([(11,35),(58,4),(65,12),(18,47)],'#d9bcaf');p.poly([(18,47),(65,12),(74,25),(29,62)],'#a18eac');p.line([(14,37),(59,7)],'#f0d2be',2);p.poly([(56,3),(62,0),(82,26),(75,30)],'#d0ab93');p.poly([(62,3),(65,3),(78,23),(75,25)],'#557c92');p.line([(65,5),(73,17)],'#c8e2df',2);p.poly([(8,35),(13,32),(33,61),(28,67)],'#e4c5b0');p.box(37,51,15,7,'#c6a589',3,3);add('telescope',p,'exterior')

def harmonize_nature(im):
 pix=im.load()
 ramps={
  'leaf':['#264c4d','#41675b','#5e866c','#7f9e7b','#a3b590','#ced0a7'],
  'pink':['#73536e','#9f6b8d','#c58aa8','#e4afc2','#edbccd','#f5d0d6'],
  'blue':['#585e86','#7a7fa4','#a0a4c2','#c5c7d5','#cfcae0','#e2d8e8'],
  'gold':['#887259','#b2946b','#d6b78c','#e6cc9d','#f3dfb5','#fff0d3']}
 for y in range(im.height):
  for x in range(im.width):
   r,g,b,a=pix[x,y]
   if not a:continue
   h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255);h*=360
   kind='leaf' if 64<h<180 and s>.16 else 'pink' if (h>280 or h<10) and s>.12 else 'blue' if 179<h<281 and s>.15 else 'gold' if 40<h<65 and s>.22 else None
   if kind:
    lum=(r*.299+g*.587+b*.114)/255;value=v*.6+lum*.4 if kind=='leaf' else lum;idx=max(0,min(5,round((value-.10)/.85*5)));pix[x,y]=(*rgb(ramps[kind][idx]),a)
 return im

def licensed_flowers():
 # Selection from the author's explicit CC0 flower pack, retaining the originals.
 pack=Path('/workspace/scratch/v5-assets/flowers/Pixel Art Flower Pack')
 choices=[('cosmos','Flower 2','TEAL'),('rose','Flower 8','PINK'),('lily','Flower 9','PURPLE'),('daisy','Flower 11','PINK'),('lupin','Flower 13','PURPLE'),('tulip','Flower 10','PINK'),('bell','Flower 6','PURPLE'),('aster','Flower 7','PURPLE'),('chamomile','FLower 5','PINK'),('low-pink','Flower 3','PINK'),('low-blue','Flower 4','TEAL'),('bush-rose','Bush 2','PINK'),('bush-leaf','Bush 1 (No Flowers)','GREEN'),('pot-fern','Flower Pot 1','GREEN'),('pot-lily','Flower Pot 4','WHITE')]
 for name,folder,color in choices:
  files=sorted((pack/folder).glob('*.png'));files=files or sorted(f for f in (OUT/'originals').glob('*.png') if f.name.lower().startswith(folder.lower()));source=next((f for f in files if f.name.endswith(' - '+color+'.png')),files[0]);im=Image.open(source).convert('RGBA');orig=OUT/'originals'/source.name;shutil.copy2(source,orig) if source.resolve()!=orig.resolve() else None
  SRC.append({'file':'originals/'+source.name,'atlas_frame':'flower-'+name,'author':'karsiori','original':str(source.relative_to(pack)) if source.is_relative_to(pack) else folder+'/'+source.name,'source':'https://karsiori.itch.io/free-pixel-art-flower-pack','license':'CC0-1.0','sha256':hashlib.sha256(source.read_bytes()).hexdigest()})
  im=harmonize_nature(im)
  add('flower-'+name,im,'nature')
 # Reuse the original licensed tree pixel clusters; stronger native values now
 # match the flowers instead of collapsing both into the same gray four tones.
 for name in ['oak','rowan','shore-rock','grass-fan']:
  im=Image.open(ROOT/'src/assets/lakeside'/ (name+'.png')).convert('RGBA');im=harmonize_nature(im);add('nature-'+name,im,'nature')
 # Crop-only source panorama: complete, non-repeated ridges at native resolution.
 source=ROOT/'src/assets/lakeside/mountains-4.png';im=Image.open(source).convert('RGBA').crop((0,0,768,256));im.save(OUT/'mountain-rock.png',optimize=True)
 for i in [1,2,3]:
  source=Path('/workspace/scratch/lakeside-references/karsiori/Pixel Art Tiles and Backgrounds - Mountains/Backgrounds')/f'Mountains {i}.png';source=source if source.exists() else OUT/f'mountain-forest-{i}.png';im=Image.open(source).convert('RGBA').crop((0,0,768,256));im.save(OUT/f'mountain-forest-{i}.png',optimize=True)
  if i<3:SRC.append({'file':f'mountain-forest-{i}.png','author':'karsiori','original':f'Backgrounds/Mountains {i}.png','source':'https://karsiori.itch.io/free-pixel-art-mountains-tileset-and-backgrounds','license':'CC0-1.0','original_sha256':PRIOR.get(f'mountain-forest-{i}.png',{}).get('original_sha256',hashlib.sha256(source.read_bytes()).hexdigest()) if source.parent==OUT else hashlib.sha256(source.read_bytes()).hexdigest(),'sha256':hashlib.sha256((OUT/f'mountain-forest-{i}.png').read_bytes()).hexdigest(),'modification':'Top 256px crop; native pixels, runtime palette adaptation'})

def extra_items():
 for flavor,color in [('strawberry','#d995aa'),('pumpkin','#d8a25f'),('lavender','#aaa5d1')]:
  p=P(48,76);glassjar(p,6,12,36,55,color);p.box(10,0,28,15,'#c7b29b',4,3);p.bowl(24,3,8,3,'#e8d5b5');p.r(11,39,25,17,'#f1e1c6');p.flower(24,47,6,color,1);add('flavor-jar-'+flavor,p,'ui')
 p=P(256,182);p.paste(ART['gift-box-open'],0,0);p.r(0,0,256,68,(0,0,0,0));p.poly([(22,65),(235,65),(226,136),(30,136)],'#dcaac0');p.line([(24,66),(232,66),(224,131),(31,131),(24,66)],'#f2cdd3',3);p.poly([(22,65),(235,65),(239,73),(24,74)],'#f0c7ce');p.r(119,66,15,72,'#efd7ae');p.bez([(125,100),(76,61),(78,113),(122,103)],'#f7dfbd',8);p.bez([(129,101),(175,65),(174,115),(131,105)],'#e7c69f',8);p.bowl(127,102,9,7,'#d7ab98');add('gift-box-closed',p,'ui')

def map_and_clothes():
 p=P(28,32);shadow(p,14,28,12,3)
 for x,rx,c in [(8,6,'#b87962'),(14,7,'#d4936f'),(20,6,'#b37768')]:p.bowl(x,17,rx,12,c)
 p.line([(13,8),(14,26)],'#edb382');p.line([(10,5),(12,1),(16,1),(15,6)],'#728b73',3);p.poly([(6,14),(9,10),(11,15)],'#ffd59a');p.poly([(17,15),(20,10),(23,14)],'#ffd59a');p.line([(9,23),(14,25),(21,22)],'#ffd59a',2);add('map-pumpkin',p,'exterior')
 p=P(118,90);shadow(p,59,75,53,9);p.bowl(59,44,56,39,'#a7aa9b');p.bowl(59,41,51,34,'#527e90');p.bowl(59,38,44,26,'#88b2b7')
 for i,(x,y,w) in enumerate([(21,29,16),(62,26,20),(37,37,26),(73,46,21),(18,52,15),(43,61,24),(62,68,11)]):p.bez([(x,y),(x+w*.3,y-2),(x+w*.6,y+2),(x+w,y)],'#bfd3cc' if i%2 else '#6a9eaa')
 for x,y in [(14,31),(25,12),(54,6),(85,12),(104,31),(108,57),(83,75),(50,79),(22,66)]:p.bowl(x,y,6,4,'#bfc1ad');p.line([(x-3,y-2),(x+2,y-2)],'#e6dcc0')
 for x,y in [(13,55),(106,64)]:
  for i in range(4):p.stem(x,y,i*3-4,18+i*3);p.line([(x+i*3-4,y-24),(x+i*3-4,y-30)],'#ae9c89',2)
 for x,y in [(82,27),(39,47)]:p.bowl(x,y,7,3,'#71988a');p.flower(x,y-2,3,'#efc7ce',1)
 add('map-pond',p,'exterior')
 p=P(64,35)
 for x in [4,35,59]:
  p.box(x,4,5,29,'#a38388',2,2);p.bowl(x+2,4,4,3,'#ddc0a7')
 for y in [14,25]:p.box(0,y,64,4,'#c3a293',2,2);p.r(1,y+1,61,1,'#ecd0b2')
 add('map-fence',p,'exterior')
 p=P(24,66);p.bowl(12,61,8,3,'#66546a');p.box(10,20,4,42,'#806b7e',2,1);p.poly([(3,16),(7,6),(17,6),(21,16)],'#a88694');p.box(4,17,16,19,'#7a5c71',2,2);p.r(7,21,9,11,'#ffd59a');p.r(11,20,1,12,'#b58c82');p.box(2,34,19,4,'#bd9d92',2,2);p.box(9,2,7,5,'#d0b395',2,2);add('map-lamp',p,'exterior')
 p=P(43,35);p.box(0,3,43,29,'#a18073',4,4);p.r(5,9,32,18,'#6e5e66')
 for y in [12,18,24]:p.line([(7,y),(33,y)],'#977b74');p.line([(8,y+1),(32,y+1)],'#b29a83')
 add('map-soil-bed',p,'exterior')
 p=P(64,32);p.r(0,0,64,32,'#827d7b')
 for x,y,w,h,col in [(0,1,22,14,'#b9b09d'),(23,1,40,14,'#c9bca3'),(1,17,36,14,'#d4c2a8'),(39,17,24,14,'#afa69a')]:
  p.poly([(x+2,y),(x+w-2,y),(x+w,y+3),(x+w-1,y+h-2),(x+3,y+h),(x,y+h-3)],col);p.line([(x+3,y),(x+w-3,y)],'#e6d6b6');p.line([(x+3,y+h-2),(x+w-3,y+h-2)],'#9b928b')
 add('tile-stone',p,'exterior')
 clothes=[('original','#b598bc','#c5acd0','#8c6991'),('cocoa','#6c5147','#f0c4c6','#8e6b57'),('rose','#d7afc1','#f3d9dc','#80675e'),('wild','#8d7659','#efe2cb','#aa9273'),('berry','#e6b7c4','#f6e5d5','#b8a393'),('pearl','#e9dcd9','#faeeee','#796054'),('mist','#c9bdb7','#ebe0d7','#927d71')]
 for kind,coat,top,skirt in clothes:
  p=P(56,66);p.bez([(28,6),(24,1),(34,0),(28,8)],GOLD);p.line([(28,8),(7,18),(49,18),(28,8)],'#b8977b',2);p.poly([(17,16),(39,16),(50,32),(42,36),(37,28),(38,43),(19,43),(19,27),(14,36),(6,32)],coat);p.poly([(22,18),(33,18),(35,40),(21,40)],top);p.poly([(19,41),(38,41),(43,59),(13,59)],skirt)
  for x in [19,25,31,37]:p.line([(x,44),(x-2,57)],mix(skirt,CREAM,.25))
  p.line([(21,17),(20,40)],mix(coat,CREAM,.45));p.line([(35,17),(37,40)],mix(coat,INK,.25));p.line([(26,21),(30,21)],GOLD);p.r(20,40,17,3,'#70586a');p.r(27,40,5,3,GOLD)
  if kind=='berry':
   for x,y in [(16,24),(41,24),(18,34),(39,34)]:p.bez([(x-3,y-2),(x,y+2),(x+4,y-3),(x,y+1)],'#f6e0d0',2)
  add('outfit-'+kind,p,'ui')

def pack_atlas():
 # Shelf packing leaves two transparent pixels between subjects to avoid bleed.
 width=2048;x=y=2;row=0;positions={}
 for name,im in sorted(ART.items(),key=lambda kv:(-kv[1].height,-kv[1].width,kv[0])):
  if x+im.width+2>width:x=2;y+=row+3;row=0
  positions[name]=(x,y,im.width,im.height);x+=im.width+3;row=max(row,im.height)
 height=2**math.ceil(math.log2(y+row+2));atlas=Image.new('RGBA',(width,height))
 for name,im in ART.items():
  x,y,w,h=positions[name];atlas.alpha_composite(im,(x,y));META[name].update({'x':x,'y':y,'w':w,'h':h})
 atlas.save(OUT/'atelier.png',optimize=True)
 (OUT/'atlas.json').write_text(json.dumps({'width':width,'height':height,'frames':META,'fabric':FAB},ensure_ascii=False,indent=2))
 (OUT/'SOURCE.json').write_text(json.dumps({'generated':'V5 pixel atelier','generator':'tools/build-v5-art.py','local_originals':SRC,'modifications':'Selective leaf and petal palette harmonization; scenes use native pixels, mirrored/clustered as documented','new_original_art':list(k for k,v in META.items() if v['kind'] not in ['nature'])},ensure_ascii=False,indent=2))
 # The sheet is packed without resampling; the runtime extracts original sizes.
 print('Atlas',atlas.size,len(ART),'frames',round((OUT/'atelier.png').stat().st_size/1024),'KiB')

if __name__=='__main__':
 furniture();furniture_fixed();walls();candy_assets();workshop_props();landscape_props();licensed_flowers();extra_items();map_and_clothes();pack_atlas()
