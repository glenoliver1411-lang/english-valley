"""V6 authored pixel subjects. No model API, downloaded art or photo filters.
Run once while building assets; game only crops and caches these local PNGs.
"""
from pathlib import Path
from PIL import Image,ImageDraw
import importlib.util,json,math,random,subprocess
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('v5',ROOT/'tools/build-v5-art.py');v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
P=v.P;mix=v.mix;OUT=ROOT/'src/assets/v6';OUT.mkdir(parents=True,exist_ok=True);ART={}
def add(n,p):ART[n]=p.im if isinstance(p,P) else p
def contact(p,x,y,w):
 p.el((x-w/2,y-2,x+w/2,y+2),(36,32,49,24));p.el((x-w*.33,y-1,x+w*.33,y+1),(36,32,49,42))
def wood(p,x,y,w,h,seed=1,base='#b79580'):
 original=p.im.copy();rng=random.Random(seed);p.r(x,y,w,h,'#806978');yy=y
 while yy<y+h:
  rh=min(rng.choice([18,21,25]),y+h-yy);xx=x-rng.randrange(30,90)
  while xx<x+w:
   rw=rng.randrange(72,156);col=mix(base,'#e9cfab',rng.random()*.14);p.r(xx,yy+1,rw-1,rh-2,col);p.line([(xx+2,yy+2),(xx+rw-4,yy+2)],mix(col,'#f6dfbf',.23));p.line([(xx+3,yy+rh-3),(xx+rw-5,yy+rh-3)],mix(col,'#6f5865',.14))
   for k in range(2):
    a=xx+rng.randrange(8,max(9,rw-25));b=min(xx+rw-6,a+rng.randrange(15,40));qy=yy+rng.randrange(5,max(6,rh-4));p.bez([(a,qy),(a+8,qy-1),(b-5,qy+1),(b,qy)],mix(col,'#7f626c',.15))
   if rng.random()<.18:p.el((xx+rw*.5,yy+rh*.6,xx+rw*.5+6,yy+rh*.6+2),mix(col,'#7f626c',.18))
   xx+=rw
  yy+=rh
 region=p.im.crop((x,y,x+w,y+h));p.im=original;p.im.alpha_composite(region,(x,y));p.d=ImageDraw.Draw(p.im)
def vase(p,x,y,w,h,flower,color):
 p.bowl(x+w/2,y+h-3,w*.44,3,'#7b8e91');p.bowl(x+w/2,y+h*.55,w*.45,h*.44,'#b8c9c3');p.bowl(x+w/2,y+h*.57,w*.34,h*.32,'#cad7c8');p.line([(x+3,y+h*.67),(x+w-3,y+h*.67)],'#93b2af');p.bez([(x+3,y+8),(x+2,y+13),(x+3,y+h-7),(x+5,y+h-5)],'#f5eed8');p.bowl(x+w/2,y+3,w*.33,2,'#d4d9cd')
 for i in range(3):p.stem(x+w/2,y+h-7,(i-1)*6,h+9+i%2*5);p.leaf(x+w/2,y+h*.4,(i-1)*7,-8);p.flower(x+w/2+(i-1)*6,y-9-i%2*5,5,color,flower)
def florist():
 p=P(432,850);p.r(0,0,432,850,'#514451');p.r(22,16,388,286,'#d5c5af');p.poly([(17,13),(34,24),(34,298),(17,315)],'#9b7f83');p.poly([(397,24),(415,13),(415,315),(397,298)],'#856b7c')
 for x in range(42,395,29):p.line([(x,32),(x,275)],'#c6b49e');p.line([(x+2,32),(x+2,275)],'#e9d7bc')
 p.box(22,16,390,12,'#91727a',4,5);p.box(25,275,381,24,'#b18c80',5,7)
 # Arched window, distant flower meadow and clear frame depth.
 v.arch(p,(150,50,133,202),'#a7b9bb','#8c6a7b',5);p.poly([(157,182),(180,164),(203,175),(237,155),(276,185),(276,243),(157,243)],'#91a48f');p.poly([(157,203),(204,188),(241,198),(276,186),(276,243),(157,243)],'#b4baa0')
 for i in range(26):x=160+i*23%112;y=204+i*11%33;p.r(x,y,2,1,['#dcc3c2','#eee0be','#bbafc9'][i%3])
 p.box(211,60,5,185,'#c29c88',2,1);p.box(156,145,120,5,'#b78f82',2,2);p.box(141,244,151,12,'#d2b59c',3,5)
 # Two asymmetrical display racks; every shelf has air around its vessels.
 for x,y,w in [(39,89,93),(299,124,91)]:
  p.box(x,y,w,143,'#977a78',6,8);p.r(x+7,y+13,w-22,119,'#726471')
  for row in range(2):
   yy=y+64+row*63;p.box(x+2,yy,w-9,8,'#c2a18c',3,4)
   for i in range(3):vase(p,x+11+i*23,yy-29,16,27,row+i,['#d69ab4','#dfcfac','#bca6ce'][row])
 # Painted timber sign, botanical print and a small calendar, not screen text.
 p.box(160,29,111,18,'#9a777c',3,4);p.line([(169,37),(198,37),(198,40),(225,40),(225,36),(257,36)],'#efd8b7');p.r(208,32,2,10,'#b9c4ac')
 p.box(278,51,25,34,'#a17c7b',3,3);p.r(282,56,16,24,'#ede0c3');p.stem(289,77,-2,13);p.flower(287,62,4,'#c09aaf',1)
 for x in [137,291]:p.line([(x,28),(x,59)],'#ad8c6b');p.poly([(x-12,74),(x-8,58),(x+8,58),(x+12,74)],'#a78689');p.bowl(x,74,12,3,'#eed5a5');p.r(x-4,76,8,2,'#f5dfb5')
 wood(p,24,300,384,528,71,'#b5947f')
 # Flush contact shadows are beneath feet, with no dark floating ellipse.
 for x in [34,172]:contact(p,x+5,432,18)
 p.box(30,319,164,108,'#a57d79',16,13);p.box(24,301,180,18,'#d5b69a',5,10)
 for x in [40,111]:
  p.box(x,339,58,70,'#8e6d74',4,6);p.r(x+5,347,42,52,'#b89082');p.line([(x+8,350),(x+42,350)],'#d8b7a0');p.box(x+18,363,17,4,'#a58a69',1,2);p.r(x+22,363,9,1,'#e8cda5');p.r(x+8,391,31,1,'#a37b77')
 p.line([(28,308),(188,308)],'#f1d5b0');p.line([(38,313),(83,313)],'#bc9983');vase(p,45,275,24,28,0,'#d99ab4');vase(p,84,278,21,25,1,'#eee0bc')
 p.poly([(124,286),(139,257),(157,278),(153,302),(134,302)],'#c39aad');p.flower(138,265,7,'#d7a3bd');p.flower(149,270,6,'#ebe0b9',1);p.line([(135,288),(151,289)],'#f0d5ba',2)
 # Packaging desk at the original collider, with four actual legs and a top plane.
 for x in [291,375]:p.box(x,501,7,75,'#886a73',2,2);contact(p,x+3,577,13)
 p.box(281,471,112,36,'#af8a7d',7,9);p.box(275,458,124,17,'#d8baa0',5,10);p.r(287,483,89,12,'#c59a87');p.box(326,486,15,3,'#ac8c69',1,1)
 for i,col in enumerate(['#d6c4a8','#c59fb1','#9a95b3']):p.box(284+i*21,437,18,21,col,4,3);p.bowl(292+i*21,438,7,2,'#efdebf')
 p.poly([(350,458),(369,450),(378,455),(358,465)],'#efdfc1');p.line([(357,452),(376,462)],'#8d8b94');p.line([(358,461),(375,450)],'#c1bdba');p.bowl(355,451,3,2,'#a47d96');p.bowl(357,461,3,2,'#a47d96');p.line([(373,444),(386,448),(380,455)],'#c58fa8',2)
 # Left display stand / right bouquet cabinet, preserving the walking aisle.
 p.box(42,516,59,93,'#997b7b',5,8)
 for yy in [539,589]:
  p.box(39,yy,65,7,'#c7a68d',2,3)
  for i in range(2):vase(p,48+i*24,yy-25,17,23,i+1,['#e3c7a3','#b89bc8'][i])
 p.box(301,616,76,111,'#9c7b79',7,8);p.r(309,627,51,88,'#7a9496')
 for yy in [663,705]:
  p.box(306,yy,58,5,'#c5a18d',2,2)
  for i in range(2):vase(p,312+i*23,yy-26,16,24,i+2,['#b7a3cf','#d8a0bb'][i])
 p.line([(309,632),(309,647)],'#d8ded0');p.line([(358,676),(358,692)],'#c1d6cf');p.r(336,630,2,81,'#ceb69d');p.r(332,677,3,3,'#e8cfaa');contact(p,339,731,61)
 # A quiet narrow linen runner frames the free floor, not the whole room.
 p.poly([(173,478),(250,478),(257,739),(164,739)],'#a28891');p.poly([(177,483),(246,483),(252,733),(169,733)],'#d1b5af')
 for yy in [495,718]:p.line([(176,yy),(247,yy)],'#ecd5bd',2)
 for yy in range(513,706,27):p.line([(176,yy),(180,yy+4),(176,yy+8)],'#b393a3');p.line([(245,yy),(241,yy+4),(245,yy+8)],'#b393a3')
 p.box(180,781,73,38,'#8f747b',5,5);p.r(187,788,56,28,'#ceb29b');p.line([(194,793),(236,793)],'#e9d0ad')
 for x,y in [(66,762),(366,785)]:p.pot(x-10,y-17,27,26,'#c8b39c');p.stem(x+2,y-15,-4,40);p.leaf(x+2,y-22,-17,-18);p.leaf(x+2,y-30,19,-10);p.flower(x-2,y-55,7,'#e2cbb7',3)
 add('florist-room',p)
def ruins():
 for i in range(12):
  p=P(64,64);rng=random.Random(103+i);p.r(0,0,64,64,'#4d606c');base=['#606e7a','#697781','#5d6c77','#65727b'][i%4]
  pts=[(1,2),(rng.randint(55,61),1),(63,3),(62,rng.randint(55,62)),(59,63),(2,62),(1,57)];p.poly(pts,base);p.line(pts[:4],mix(base,'#b3b6b2',.25));p.line([(3,62),(59,62),(62,58)],'#52636d')
  # Broad quiet faces, chipped corners, and sparse faults. No identical diamonds.
  if i%3==0:p.poly([(2,3),(11,3),(5,10)],'#8a979a');p.poly([(57,58),(61,49),(62,61)],'#354450')
  if i%4==1:p.line([(12,2),(18,14),(14,23),(25,31),(23,47),(30,61)],'#40535e');p.line([(19,15),(25,12),(31,14)],'#435661');p.line([(15,23),(25,32),(24,40)],'#829096')
  if i%4==2:p.line([(2,42),(17,38),(24,43),(37,40),(45,47),(61,46)],'#455762');p.line([(18,37),(23,41),(35,38)],'#7d8b91')
  for x,y,w in [(9,18,15),(36,45,12)]:p.line([(x,y),(x+w,y)],mix(base,'#a5aaa6',.12))
  if i in [5,8,11]:
   for x,y in [(4,54),(9,58),(14,59),(5,49),(3,45)]:p.r(x,y,5,2,'#617d74');p.r(x+2,y-1,2,1,'#8c9a80')
  add('ruins-floor-'+str(i),p)
 for i in range(3):
  p=P(96,72);p.poly([(0,18),(12,4),(95,1),(83,19)],'#9ea7a3');p.r(0,20,84,48,'#5b6b77');p.poly([(84,20),(96,4),(96,55),(84,68)],'#354958')
  for row in range(2):
   for j in range(3):
    x=j*29-(row%2)*7;y=23+row*22;col=['#77848a','#6d7c84','#839095'][(j+row+i)%3];p.poly([(x+2,y),(x+27,y+1),(x+26,y+18),(x+1,y+19)],col);p.line([(x+3,y+1),(x+25,y+2)],'#a4aaa5');p.line([(x+2,y+19),(x+25,y+18)],'#465c69')
  p.line([(1,19),(82,19)],'#c2c2b4',2);p.line([(1,68),(82,68),(94,56)],'#293e4c',3);p.line([(34,24),(39,34),(36,42),(43,46)],'#455b65')
  if i==1:p.poly([(8,4),(24,2),(19,13),(10,16)],'#536b74');p.line([(32,6),(55,6)],'#c4c5b4')
  for x,y in [(13,20),(67,45)]:p.leaf(x,y,14,-3,'#617c70');p.leaf(x+4,y,-7,9,'#83977c')
  add('ruins-wall-'+str(i),p)
 p=P(38,98);contact(p,20,95,29);p.box(7,14,27,72,'#6e7f88',6,8);p.box(1,3,36,14,'#a0aaa7',6,5);p.box(1,82,36,13,'#94a09e',4,5)
 for x in [12,19,26]:p.line([(x,24),(x,74)],'#96a6a6');p.line([(x+2,24),(x+2,73)],'#4c6673')
 p.line([(9,37),(17,42),(15,54),(22,61)],'#3d5664');p.poly([(4,5),(12,4),(9,12)],'#c1c6b6');p.leaf(10,85,-4,-22,'#617e70');p.leaf(11,78,8,-8,'#8c9e7d');add('ruins-pillar',p)
 p=P(44,94);contact(p,22,91,35);p.box(4,77,36,13,'#7c8a91',5,6);p.poly([(11,73),(10,37),(18,27),(30,32),(35,75)],'#7e8e92');p.poly([(22,32),(29,35),(32,72),(21,74)],'#566f7c');p.bowl(21,19,10,13,'#94a3a1');p.poly([(14,17),(24,8),(31,17),(28,29),(22,31)],'#b4bab0');p.line([(15,28),(21,30),(24,26)],'#526c79');p.line([(23,36),(16,49),(25,55)],'#3f5d6e');p.box(15,48,17,11,'#8a9c9d',4,4);p.r(19,50,4,4,'#d3c6a4');p.leaf(9,76,8,-18,'#6e8d79');p.leaf(13,63,14,-3,'#84967b');add('ruins-statue',p)
 p=P(98,66);p.box(2,3,94,59,'#526878',4,5);p.r(10,10,77,44,'#687c85');p.poly([(12,44),(29,21),(43,34),(54,17),(82,45)],'#9caaa3');p.bez([(17,46),(29,35),(62,52),(78,35)],'#bac1ad',2);p.bowl(56,23,5,5,'#c8bea0');p.r(57,18,6,9,'#687c85');p.line([(26,11),(24,23),(30,30),(27,53)],'#445d6b');p.leaf(83,57,-7,-20,'#668879');add('ruins-mural',p)
 p=P(74,31);p.poly([(3,17),(14,8),(31,5),(42,8),(62,5),(71,14),(62,24),(42,28),(25,24),(12,26)],'#3e6674');p.poly([(11,18),(24,12),(47,14),(63,11),(63,20),(43,24),(25,20)],'#557d88');p.line([(16,14),(30,14),(34,15)],'#7c9b9d');p.line([(42,22),(58,22)],'#98ada4');p.line([(8,21),(19,21)],'#49616a');p.r(53,13,6,1,'#a6b6ac');add('ruins-puddle',p)
 for pose in range(4):
  p=P(48,48);contact(p,24,45,40);p.box(4,24,39,19,'#6b5962',4,6);p.r(8,30,27,10,'#9d756b');p.line([(11,34),(29,34)],'#b58f76');p.line([(19,38),(34,38)],'#7a5c60');p.r(7,42,30,2,'#b49175');p.r(11,27,25,2,'#273c47');yy=[14,13,5,0][pose];p.poly([(4,yy+6),(10,yy),(36,yy),(43,yy+6),(41,yy+17),(5,yy+17)],'#92766f');p.poly([(11,yy+2),(32,yy+2),(36,yy+6),(8,yy+6)],'#b3937e')
  for xx in [9,32]:p.box(xx,yy+2,4,15,'#ae915f',1,1);p.r(xx+1,yy+3,2,1,'#eccea0');p.box(xx,27,4,16,'#b69b6c',1,1)
  p.box(20,23,8,9,'#c4a679',2,1);p.r(23,26,2,3,'#4b4656')
  if pose==1:p.r(23,26,4,1,'#4b4656');p.r(25,27,1,3,'#ecd6a3')
  if pose>1:p.r(10,24,26,2,'#eac88d');p.r(16,21,12,3,'#f4dfac')
  add('ruins-chest-'+str(pose),p)
def cabin():
 # Architectural frames keep the same glass aperture and original collisions.
 old=Image.open(ROOT/'src/assets/v5/atelier.png').convert('RGBA');meta=json.loads((ROOT/'src/assets/v5/atlas.json').read_text())
 def oldframe(n):r=meta['frames'][n];return old.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']))
 for variant in ['original','floral','gingham']:
  p=P(432,300);p.im=oldframe('cabin-walls-'+variant);p.d=ImageDraw.Draw(p.im)
  # New tailored drapery silhouettes, broad shadow pleats and a scalloped valance.
  for side in [0,1]:
   x=99 if not side else 299;s=1 if not side else -1
   pts=[(x,56),(x+33,60),(x+28,108),(x+13,170),(x+27,215),(x+18,226),(x,220)] if not side else [(x,61),(x+33,55),(x+34,220),(x+17,227),(x+4,216),(x+18,170),(x+6,110)]
   p.poly(pts,'#695d7e')
   for k in range(5):
    xx=x+3+k*6;p.bez([(xx,63),(xx+s*1,105),(x+12+k*.7,145),(x+14,170)],['#93829e','#b8a2b7','#debec8','#a28aa5','#cbb1c0'][k],3)
    p.bez([(x+14,173),(xx+s*3,191),(xx+1,205),(xx+3,219)],['#8a7897','#c5aabd','#e5c8ce','#a28ba7','#cbb1c0'][k],3)
   p.bez([(x+6,169),(x+11,174),(x+21,175),(x+25,170)],'#dfc79e',2);p.line([(x+16,175),(x+13,196),(x+16,199)],'#af8c65')
  p.bez([(103,54),(154,97),(271,97),(333,54)],'#83708d',10);p.bez([(105,52),(162,86),(270,85),(331,52)],'#d4b8c3',6)
  for xx in [139,175,213,251,289]:p.bez([(xx-11,67),(xx-7,78),(xx+3,79),(xx+10,69)],'#ead4cd',2)
  add('cabin-walls-'+variant,p)
 for name,base in [('wood','#b79582'),('pale','#c8b8a3')]:
  p=P(432,570);wood(p,0,0,432,570,386,base);add('floor-'+name,p)
 # Replace the bed with a sewn quilt with large fabric panels, folded linen and turned feet.
 p=P(124,219);contact(p,63,211,100)
 for x in [9,109]:p.box(x,176,6,32,'#876372',2,2);p.bowl(x+3,209,5,3,'#be9a7c')
 p.box(6,49,114,152,'#917379',8,12);p.cushion((7,7,115,64),'#b79a8c',16,False);p.cushion((15,14,106,58),'#cba4b4',15)
 for x,y in [(31,31),(58,24),(84,31),(45,47),(73,47)]:v.tuft(p,x,y)
 p.cushion((14,58,104,190),'#ebe0c9',9,False)
 for x in [20,62]:p.cushion((x,65,x+37,89),'#f4e9d5',7,False);p.bez([(x+4,81),(x+17,74),(x+26,88),(x+33,83)],'#d1beb6');p.line([(x+5,67),(x+31,67)],'#fff3df')
 p.poly([(17,99),(102,97),(110,106),(109,187),(102,198),(17,187)],'#a47692');p.poly([(19,99),(101,100),(101,183),(19,184)],'#d0a3b6');p.poly([(102,102),(109,107),(108,186),(102,194)],'#895e7e')
 for xx in [35,62,87]:p.bez([(xx,106),(xx-4,127),(xx+4,158),(xx-1,181)],'#b389a4');p.line([(xx+1,111),(xx+2,146),(xx+1,175)],'#e2bbc7')
 p.bez([(18,100),(37,111),(78,111),(102,102)],'#f0d4d0',4);p.line([(19,183),(102,183)],'#e8c5c5',2)
 for xx,yy in [(28,126),(53,153),(78,126)]:p.stem(xx,yy+12,2,12);p.leaf(xx,yy+8,5,-4);p.flower(xx+2,yy,4,'#e9d4bb',1)
 p.box(1,197,121,10,'#b49388',4,7);p.line([(8,200),(110,200)],'#e8c8b0');add('fixed-bed',p)
 # Fireplace brick arch, soot, layered iron grate and real log volume.
 p=P(87,153);p.box(7,10,73,123,'#97897f',5,9);p.box(1,3,85,13,'#dbc6aa',4,8)
 rng=random.Random(8)
 for row in range(6):
  for j in range(4):
   x=10+j*16+(row%2)*3;y=20+row*18;p.poly([(x,y),(x+13,y+1),(x+12,y+15),(x,y+14)],rng.choice(['#baa58e','#a79484','#cab49a']));p.line([(x+1,y+1),(x+11,y+2)],'#d6c0a2')
 v.arch(p,(17,65,51,70),'#2e303d','#756775',6);p.poly([(25,94),(34,82),(56,85),(59,132),(25,132)],'#403b45');p.bez([(27,125),(39,116),(53,120),(61,130)],'#8f6c58',5);p.line([(29,126),(55,131)],'#c29163',2)
 for x in range(24,66,8):p.line([(x,125),(x,138)],'#555264',2);p.r(x,125,2,1,'#bd9d82')
 p.box(1,135,85,12,'#bda791',4,7);p.box(14,145,59,7,'#937f7a',2,3);add('fixed-fireplace',p)
 # Woven rug with a quiet central medallion and irregular hand-knotted fringe.
 p=P(175,195);p.el((1,1,173,193),'#8e7482');p.el((4,4,170,189),'#d5b6b6');p.el((8,8,166,185),'#ead2bf');p.el((11,11,163,182),'#b28aa0');p.el((18,19,156,175),'#c9a5b3');p.el((27,29,147,164),'#bc95a9')
 for i in range(24):a=i*math.tau/24;x=87+math.cos(a)*68;y=97+math.sin(a)*78;p.leaf(x,y,math.sin(a)*6,-math.cos(a)*6,'#e9cfc2');p.r(x,y,2,1,'#a9859d')
 p.poly([(87,58),(109,92),(87,130),(65,93)],'#debbb9');p.poly([(87,66),(103,93),(87,121),(72,93)],'#9e829e');p.flower(87,94,8,'#edd9bf',1);add('room-rug',p)
 # Other fixed furniture retain their structure but now receive material-specific joinery.
 for name in ['fixed-sofa','fixed-wardrobe','fixed-bookcase','fixed-desk']:
  p=P(1,1);p.im=oldframe(name);p.d=ImageDraw.Draw(p.im)
  if name=='fixed-sofa':
   p.cushion((7,10,60,96),'#caa2b2',18);p.cushion((12,18,54,65),'#dfb5c2',13);p.cushion((7,67,58,98),'#d3a4b6',7);p.cushion((1,52,13,94),'#b78b9f',6);p.cushion((54,52,65,94),'#ac8299',6);p.bez([(15,71),(27,76),(42,76),(53,71)],'#f0cdd0',2);p.cushion((20,58,42,80),'#e9d3bc',5,False)
  elif name=='fixed-wardrobe':
   for xx in [14,41]:p.line([(xx,22),(xx,97)],'#e9d8c1');p.line([(xx+19,22),(xx+19,97)],'#829aa7');p.line([(xx+4,36),(xx+18,59)],'#e9e5d6');p.r(xx+17,72,2,4,'#e7cda0')
  elif name=='fixed-desk':
   for x in [14,67]:p.line([(x+4,35),(x+39,35)],'#deb8a0');p.box(x+19,40,13,3,'#a5835e',1,1);p.r(x+22,40,6,1,'#eacda2')
  else:
   for y in [46,71,96]:p.line([(12,y),(57,y)],'#e5c6aa');p.line([(12,y+3),(57,y+3)],'#654f67')
  add(name,p)
def map_details():
 p=P(64,32);p.r(0,0,64,32,'#718184')
 for i,(x,y,w,h) in enumerate([(1,1,31,14),(34,1,29,15),(0,18,21,13),(24,17,38,14)]):
  col=['#a7aba2','#b8b8a7','#929e99','#aeb1a5'][i];p.poly([(x+1,y),(x+w-2,y),(x+w,y+3),(x+w-1,y+h-1),(x+2,y+h-1),(x,y+3)],col);p.line([(x+2,y+1),(x+w-3,y+1)],'#d0cbb7');p.line([(x+2,y+h-2),(x+w-3,y+h-2)],'#76878a')
 p.line([(8,2),(13,6),(11,13)],'#8d9894');p.leaf(23,29,7,-4,'#8b9f83');add('tile-stone',p)
 p=P(24,66);contact(p,12,63,17);p.box(8,34,7,28,'#756575',2,2);p.box(5,58,14,5,'#998983',2,3);p.poly([(3,20),(8,12),(16,12),(21,20),(19,36),(5,36)],'#64576a');p.poly([(7,21),(16,21),(16,32),(7,32)],'#efc58d');p.poly([(17,21),(20,19),(18,33),(17,34)],'#b58b68');p.r(10,22,3,8,'#ffe6b4');p.r(11,20,1,14,'#b58d6c');p.box(3,35,18,5,'#aa8f7a',2,2);p.poly([(2,20),(8,12),(16,12),(23,20)],'#917c81');p.line([(5,19),(19,19)],'#d3b69b');p.line([(11,4),(11,12)],'#a58c79');p.bowl(12,3,2,2,'#cead87');add('map-lamp',p)

def actors():
 cfg=json.loads((ROOT/'src/assets/v5/atlas.json').read_text())
 # Existing wardrobe identities and palettes, authored into the same 32×40 / four-direction cells.
 outfits=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {ADVENTURE} from './src/adventure-config.js';process.stdout.write(JSON.stringify(ADVENTURE.outfits))"],cwd=ROOT,text=True))
 palettes={o['id']:[o['coat'],o['top'],o['skirt'],o['accent'],o['boots']] for o in outfits}

 anchors={}
 for id,(coat,top,skirt,trim,boot) in palettes.items():
  sheet=Image.new('RGBA',(128,160));points=[]
  for direction in range(4):
   for frame in range(4):
    p=P(32,40);bob=1 if frame in [1,3] else 0;step=[0,2,0,-2][frame];skin='#efd0b9';hair='#78586b';dark='#543d53';light='#a77c89'
    # Alternating heel/toe shape leaves a gap between legs, keeping the feet readable.
    for xx,dy in [(10,step),(19,-step)]:p.poly([(xx,29),(xx+5,29),(xx+5,34+dy),(xx+7,35+dy),(xx+6,37+dy*.3),(xx-1,37+dy*.3)],boot);p.r(xx+1,34+dy,4,1,mix(boot,'#dcbca1',.35))
    p.poly([(8,20+bob),(13,18+bob),(22,19+bob),(26,24+bob),(25,31+bob),(8,31+bob)],mix(coat,dark,.28));p.poly([(10,20+bob),(23,20+bob),(24,29+bob),(10,29+bob)],coat);p.r(14,21+bob,7,7,top)
    p.poly([(10,28+bob),(24,28+bob),(26+step*.3,33+bob),(8+step*.3,33+bob)],skirt)
    for xx in [12,17,22]:p.line([(xx,29+bob),(xx-1+step*.2,32+bob)],mix(skirt,dark,.18))
    p.line([(10,28+bob),(24,28+bob)],trim);p.r(17,22+bob,1,4,trim)
    for xx,dy in [(5,-step*.5),(25,step*.5)]:p.poly([(xx+1,21+bob),(xx+4,23+bob),(xx+3,28+bob+dy),(xx,29+bob+dy)],coat);p.r(xx,28+bob+dy,4,3,skin);p.r(xx+1,29+bob+dy,2,1,'#f9ddc4')
    if id=='cocoa':
     for yy in [22,24,26]:p.r(14,yy+bob,7,1,trim)
     p.r(10,22+bob,1,7,trim)
    if id in ['rose','pearl']:
     for xx in range(9,26,3):p.r(xx,27+bob,1,2,trim)
    if id=='wild':
     for xx,yy in [(9,22),(24,23),(11,26),(23,27)]:p.r(xx,yy+bob,2,2,boot)
    if id=='berry':
     for xx in [7,25]:p.r(xx,23+bob,3,1,trim);p.r(xx+1,22+bob,1,3,trim)
    if id=='mist':p.line([(12,22+bob),(21,25+bob),(14,27+bob)],trim)
    # Hair outline, crown lighting, face or back locks; same bow and long brown hair.
    p.poly([(5,9+bob),(7,4+bob),(11,2+bob),(23,2+bob),(27,6+bob),(29,12+bob),(27,22+bob),(22,24+bob),(8,23+bob),(5,18+bob)],dark)
    p.poly([(7,8+bob),(10,4+bob),(22,4+bob),(26,8+bob),(27,20+bob),(23,23+bob),(8,21+bob)],hair)
    if direction!=3:
     fx=9 if direction==1 else 13 if direction==2 else 10;p.poly([(fx,10+bob),(fx+12,10+bob),(fx+12,19+bob),(fx+9,23+bob),(fx+3,22+bob),(fx,18+bob)],skin);p.r(fx+2,11+bob,8,1,'#f8dec5');p.r(fx+3,16+bob,2,3,dark)
     if direction==0:p.r(fx+10,16+bob,2,3,dark)
     p.r(fx+6,21+bob,3,1,'#ba7f87');p.r(fx+1,20+bob,2,1,'#e2a5a5');p.poly([(7,7+bob),(12,5+bob),(24,6+bob),(26,12+bob),(20,11+bob),(17,10+bob),(13,13+bob),(9,12+bob)],hair)
    else:
     p.bez([(11,8+bob),(7,14+bob),(14,18+bob),(12+step*.2,23+bob)],light);p.bez([(21,7+bob),(25,15+bob),(19,18+bob),(23+step*.2,23+bob)],'#8c687b',2)
    p.bez([(8,8+bob),(9,5+bob),(16,5+bob),(20,6+bob)],light,2);p.bez([(7,13+bob),(9,15+bob),(6,19+bob),(9+step*.2,23+bob)],'#946d80');p.r(8,5+bob,17,2,trim);p.poly([(22,3+bob),(26,2+bob),(27,5+bob),(24,8+bob),(22,6+bob)],'#edc3c1');p.r(24,4+bob,2,1,'#ffdfcd')
    if direction in [1,2]:
     # The leading arm and overlapping coat seam distinguish side views.
     xx=9 if direction==1 else 24;p.line([(xx,23+bob),(xx,28+bob)],mix(coat,dark,.3));p.r(xx-1,29+bob-step*.4,3,2,skin)
    sheet.alpha_composite(p.im,(frame*32,direction*40));points.append({'head':[16,5+bob],'pin':[14 if direction==1 else 21 if direction==2 else 20,25+bob],'hand':[6 if direction==1 else 27,29+bob+(step*.5 if direction==1 else -step*.5)],'back':direction==3})
  add('actor-'+id,sheet);anchors[id]=points
 (OUT/'anchors.json').write_text(json.dumps(anchors,separators=(',',':')))
def pack():
 width=1024;height=2048;positions={};free=[(1,1,width-2,height-2)]
 for name,im in sorted(ART.items(),key=lambda a:-max(a[1].size)):
  w,h=im.width+2,im.height+2;fits=[(min(r[2]-w,r[3]-h),r[2]*r[3]-w*h,r) for r in free if r[2]>=w and r[3]>=h];assert fits,('Atlas full',name)
  _,_,(x,y,_,_)=min(fits);positions[name]={'x':x+1,'y':y+1,'w':im.width,'h':im.height};nextfree=[]
  for fx,fy,fw,fh in free:
   if x>=fx+fw or x+w<=fx or y>=fy+fh or y+h<=fy:nextfree.append((fx,fy,fw,fh));continue
   if x>fx:nextfree.append((fx,fy,x-fx,fh))
   if x+w<fx+fw:nextfree.append((x+w,fy,fx+fw-x-w,fh))
   if y>fy:nextfree.append((fx,fy,fw,y-fy))
   if y+h<fy+fh:nextfree.append((fx,y+h,fw,fy+fh-y-h))
  free=[]
  for i,r in enumerate(nextfree):
   if not any(i!=j and r[0]>=q[0] and r[1]>=q[1] and r[0]+r[2]<=q[0]+q[2] and r[1]+r[3]<=q[1]+q[3] for j,q in enumerate(nextfree)):free.append(r)
 atlas=Image.new('RGBA',(width,height))
 for n,im in ART.items():atlas.alpha_composite(im,(positions[n]['x'],positions[n]['y']))
 atlas.save(OUT/'atelier.png',optimize=True);(OUT/'atlas.json').write_text(json.dumps({'width':width,'height':height,'frames':positions},indent=2));print(len(ART),'V6 frames',atlas.size,(OUT/'atelier.png').stat().st_size,'bytes')
if __name__=='__main__':florist();ruins();cabin();map_details();actors();pack()
