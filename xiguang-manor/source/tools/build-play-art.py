"""Original V5-compatible play atelier. Uses the project's authored pixel tools.
No downloaded pictures, model API, or changes to the existing V5 atlas.
"""
from pathlib import Path
from PIL import Image,ImageDraw
import importlib.util,json,math
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('old_atelier',ROOT/'tools/build-v5-art.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
P=m.P;mix=m.mix;shadow=m.shadow;INK=m.INK;CREAM=m.CREAM;GOLD=m.GOLD
OUT=ROOT/'src/assets/play';OUT.mkdir(parents=True,exist_ok=True);ART={}
def add(name,p):ART[name]=p.im if isinstance(p,P) else p
COLS=['#dba2bb','#eee0be','#b9a1d1','#a7d1c4']
def flowers():
 for i,id in enumerate(['rose','lily','aster','glow']):
  p=P(26,40);p.stem(13,39,-2,22);p.leaf(12,31,-9,-7);p.leaf(13,33,9,-8,'#8da78b');p.flower(11,13,9,COLS[i],i);p.flower(18,23,4,COLS[i],i);add('flower-'+id,p)
 for id,col in [('cream','#d9b995'),('rose','#d9a5b7'),('night','#8f87ac')]:
  p=P(70,90);p.poly([(4,29),(20,13),(42,22),(65,20),(57,60),(39,85),(20,76)],mix(col,INK,.20));p.poly([(5,30),(24,23),(36,36),(56,29),(50,66),(38,83),(22,71)],col);p.line([(7,31),(24,26),(35,40),(55,33)],mix(col,CREAM,.55));p.line([(23,33),(28,69),(38,83)],mix(col,INK,.20));add('wrap-back-'+id,p)
  p=P(70,90);p.poly([(8,39),(22,51),(35,56),(59,39),(49,69),(38,85),(21,72)],col);p.poly([(11,43),(29,53),(38,83),(23,70)],mix(col,CREAM,.23));p.poly([(36,57),(57,43),(47,69),(39,82)],mix(col,INK,.21));p.line([(9,40),(29,54),(36,57),(58,40)],mix(col,CREAM,.62));p.line([(22,62),(48,61)],'#f5d6bd',3);p.poly([(34,62),(22,55),(19,59),(21,66),(33,64)],'#b77393');p.poly([(36,62),(47,54),(51,59),(48,65),(37,64)],'#eab8cb');p.r(33,60,5,6,'#f5d8cb');p.poly([(33,65),(28,78),(34,75),(36,66)],'#e4afc4');p.poly([(37,65),(43,76),(46,73),(39,64)],'#aa6b88');add('wrap-front-'+id,p)
def furniture():
 for on in [False,True]:
  suffix='-on' if on else '-off'
  p=P(34,49);shadow(p,17,47,12,2);p.bowl(17,44,11,3,'#ac895f');p.bowl(17,43,8,2,'#d7b682');p.box(15,20,5,23,'#c39b69',2,1);p.line([(16,23),(16,41)],'#f0d4a5');p.cushion((4,7,29,29),'#d793a7',9,False);p.poly([(6,17),(9,9),(23,7),(28,17),(26,25),(16,29),(7,24)],'#e8a4b3' if on else '#bc7f99');p.poly([(9,9),(16,3),(24,7),(22,13),(14,10),(8,15)],'#749475');p.leaf(16,8,0,-7,'#9ab28b');
  for x,y in [(9,18),(18,15),(23,20),(13,24),(18,25)]:p.r(x,y,1,2,'#f8dbb5')
  p.line([(7,14),(7,19)],'#f1c4c4');p.r(27,27,1,10,GOLD);p.bowl(27,38,1,2,GOLD);add('furniture-berryLamp'+suffix,p)
  p=P(40,52);shadow(p,20,49,15,2);p.box(7,39,27,10,'#846584',3,4);p.line([(10,43),(28,43)],'#d6b0a4');p.bowl(20,25,14,16,'#64768e');p.bowl(20,24,12,14,'#7b9dae' if on else '#697b93');p.bowl(20,24,9,11,'#9db7bb' if on else '#8092a6');p.line([(10,18),(12,12),(17,9)],'#dce3d5',2);p.r(29,22,1,10,'#4d5d7b');p.r(18,6,5,4,GOLD);p.r(19,4,3,2,'#e7caa0');
  for x,y in [(17,16),(24,20),(16,29),(25,33),(21,24)]:p.r(x,y,1,3,'#efe4bc');p.r(x-1,y+1,3,1,'#efe4bc')
  add('furniture-starProjector'+suffix,p)
  p=P(54,91);shadow(p,27,88,23,2);p.line([(4,87),(7,4),(47,4),(50,87)],GOLD,3);p.line([(7,5),(47,5)],'#ecd0a3');p.bowl(7,3,3,3,GOLD);p.bowl(47,3,3,3,GOLD);p.box(0,86,14,5,'#957383',1,2);p.box(40,86,14,5,'#957383',1,2)
  for x,w in [(9,17 if not on else 10),(28 if not on else 36,17 if not on else 10)]:
   p.poly([(x,8),(x+w,8),(x+w-1,75),(x+w-3,80),(x+2,78),(x,73)],'#d6c4cf');
   for k in range(x,x+w,4):p.line([(k,10),(k+2,43),(k,75)],'#f0e2df' if k%3 else '#b99fb4',2)
   for y in range(16,76,8):
    for xx in range(x+2,x+w-1,5):p.r(xx,y,2,2,'#f6eddf');p.r(xx+1,y+2,1,3,'#b89eaf')
   p.line([(x,75),(x+4,79),(x+8,76),(x+12,80),(x+w,76)],'#f7e9d7',2)
  add('furniture-laceDrape'+suffix,p)
  p=P(68,57);shadow(p,34,54,31,2);p.box(8,44,8,10,'#7c5768',2,2);p.box(52,44,8,10,'#7c5768',2,2);p.cushion((6,4,61,38),'#b88d9f',9);p.cushion((10,8,57,32),'#caa0ae',7);p.cushion((9,30,58,45),'#d9a8b9',4);p.cushion((1,22,13,44),'#bc8c9f',6);p.cushion((55,22,66,44),'#bc8c9f',6)
  for x,y in [(19,16),(33,17),(47,16)]:m.tuft(p,x,y)
  p.line([(15,38),(52,38)],'#f0ccce');p.line([(6,45),(60,45)],GOLD,2);p.cushion((14,21,27,34),'#eacdbf',3,False);p.cushion((41,22,53,35),'#a69bad',3,False);add('furniture-vintageSofa'+suffix,p)
  p=P(66,98);shadow(p,33,95,29,2);p.line([(5,93),(16,4),(51,4),(62,93)],'#7c6473',4);p.line([(8,92),(18,7),(49,7),(59,91)],'#c6a79b',2);p.box(12,3,44,8,'#b18e8b',3,3);p.line([(22,11),(21,64)],'#e2cbbb',2);p.line([(47,11),(47,64)],'#e2cbbb',2);p.cushion((16,49,52,70),'#c89bb2',6);p.box(14,69,42,8,'#b18b8b',3,4);p.line([(18,73),(50,73)],'#e5bdb6');
  for x,y in [(11,29),(14,17),(20,7),(49,12),(54,33),(57,62)]:p.leaf(x,y,8,-5);p.flower(x,y-2,4,'#d5a7c3',1)
  p.pot(0,82,15,15);p.pot(51,82,15,15);add('furniture-flowerSwing'+suffix,p)
  p=P(54,83);shadow(p,27,80,24,2);p.box(5,5,44,70,'#b89a8d',6,7);p.box(7,74,7,7,'#7c5c70',2,1);p.box(38,72,7,9,'#7c5c70',2,2);p.r(10,12,30,58,'#687e8b' if not on else '#9aadb0');p.r(12,14,26,54,'#b4c8be' if on else '#92a7a4');
  for y in [30,50,69]:
   p.box(10,y,31,4,'#b18a81',1,3)
   for x in [15,29]:p.pot(x,y-11,8,11,'#c8a4b0');p.stem(x+4,y-11,-1,10);p.flower(x+3,y-20,4,COLS[(x+y)%4],(x+y)%4)
  p.line([(25,13),(25,68)],'#e4c5ab');p.line([(12,17),(12,28)],'#e0e1d0');p.line([(33,38),(36,35)],'#e0e1d0');p.r(23,39,4,3,GOLD);p.r(41,17,2,4,'#8b6b77');p.r(41,59,2,4,'#8b6b77');add('furniture-glassCabinet'+suffix,p)
def equipment():
 p=P(26,12);p.bez([(1,9),(7,2),(18,3),(24,9)],'#c4a16a',2)
 for i,x in enumerate([4,10,16,22]):p.leaf(x,8,3,-4);p.flower(x,6,3,COLS[i],i)
 add('equip-crown',p);p=P(10,12);p.leaf(4,10,5,-4);p.flower(4,4,4,COLS[0],0);p.r(4,8,1,3,GOLD);add('equip-rosepin',p)
 p=P(15,25);p.bez([(4,8),(2,-1),(13,-1),(11,8)],GOLD);p.box(2,8,12,15,'#776176',3,3);p.r(4,12,6,9,'#efc582');p.r(6,13,2,7,'#fff0bd');p.line([(3,10),(11,10)],'#e4bf8a');p.r(3,23,9,2,'#b49478');add('equip-ghostlamp',p)
 p=P(12,13);p.bowl(6,7,4,4,GOLD);p.r(4,2,4,2,'#ebd49f');p.r(4,11,4,1,'#6e586e');p.r(6,8,1,2,'#70516b');add('equip-catbell',p)
def room():
 p=P(432,850);p.r(0,0,432,850,'#554653');p.r(20,18,392,270,'#d8bdc2');p.r(26,24,380,258,'#ead5ca')
 for x in range(29,405,23):p.line([(x,26),(x,274)],'#d9c0bc');p.line([(x+2,26),(x+2,271)],'#f4e1d0')
 m.arch(p,(155,45,123,198),'#8fa1b9');p.r(164,106,106,127,'#9eabc0');p.poly([(164,189),(186,165),(204,178),(228,150),(269,189),(269,233),(164,233)],'#7c8e9e');p.line([(215,69),(215,236)],'#b59391',3);p.line([(163,140),(270,140)],'#b59391',3);p.box(147,233,140,11,'#b89489',3,4)
 for x in [152,260]:p.pot(x,221,22,15);p.stem(x+9,223,-2,28);p.flower(x+8,196,7,COLS[0],1)
 p.r(26,265,380,17,'#b49391');p.r(26,266,380,2,'#edcfbc');p.r(26,281,380,542,'#b08e83')
 for y in range(285,820,23):
  for x in range(28-(y//23%2)*39,407,78):p.r(x,y,75,20,'#c6a494');p.line([(x+4,y+2),(x+68,y+2)],'#ddbc9f');p.line([(x+12,y+14),(x+51,y+14)],'#b59388')
 # Carved display shelves and softly lit bottles, each composed as a real object.
 for x in [39,298]:
  p.box(x,87,96,182,'#a07980',8,8);p.r(x+7,101,72,151,'#755e72')
  for row,y in enumerate([143,199,252]):
   p.box(x+2,y,85,7,'#c3a090',2,4)
   for i in range(3):
    xx=x+10+i*24;p.bowl(xx+8,y-10,8,11,['#a5b9af','#a6b2c2','#d2afba'][i]);p.line([(xx+3,y-17),(xx+3,y-9)],'#eee2d0');p.stem(xx+8,y-21,i*3-3,12+row*2);p.flower(xx+5,y-34-row*2,5,COLS[(i+row)%4],i+row)
 # Warm lamps; a thick panelled counter with broad top and wood end grain.
 for x in [139,290]:p.line([(x,18),(x,58)],GOLD);p.bowl(x,64,17,9,'#a58280');p.bowl(x,65,14,5,'#f3d29b');p.r(x-2,65,4,3,'#fff0c4')
 shadow(p,119,443,91,11);p.box(29,309,166,123,'#b88e87',21,14)
 for x in [40,109]:p.box(x,345,59,69,'#9a747d',5,4);p.r(x+4,354,46,48,'#c39891');p.line([(x+6,357),(x+43,357)],'#e0b8a3');p.flower(x+26,379,7,'#e2b8b8',1)
 p.box(22,300,179,18,'#d2b7a0',6,13);p.line([(28,307),(183,307)],'#f1d9b9');p.line([(188,303),(196,305),(186,313)],'#846676');p.pot(47,279,29,25,'#c7b8a3')
 for i,x in enumerate([50,62,72]):p.stem(x,281,0,34);p.flower(x,247+i%2*9,8,COLS[i],i)
 p.paste(ART['wrap-back-rose'],105,231,.8);p.paste(ART['flower-rose'],123,237,.9);p.paste(ART['flower-lily'],109,229,.8);p.paste(ART['wrap-front-rose'],105,231,.8)
 # Packaging bench, drawers, rolls of paper, scissors and a tied ribbon.
 shadow(p,341,585,56,8);p.box(287,502,12,77,'#876676',5,3);p.box(378,502,12,77,'#876676',5,3);p.box(278,461,119,41,'#ad8884',12,11);p.r(287,482,94,13,'#c5a295');p.r(327,484,9,3,GOLD);p.r(289,468,91,8,'#e5c8b0');
 for i,col in enumerate(['#dac2a7','#caa7b8','#a09ab7']):p.box(287+i*22,437+i%2*3,20,23,col,5,4);p.bowl(296+i*22,438+i%2*3,9,3,mix(col,CREAM,.35))
 p.line([(361,458),(374,449),(367,445),(358,457)],'#cdbbb4',2);p.bowl(357,458,4,3,'#b18096');p.bowl(365,461,4,3,'#b18096');p.paste(ART['equip-catbell'],376,446,.8)
 p.paste(ART['furniture-glassCabinet-on'],297,613,1.6);p.paste(ART['furniture-laceDrape-off'],40,496,1.3)
 # The aisle remains walkable: a hand woven oval runner, not a menu backdrop.
 p.el((160,485,267,736),'#9f7c93');p.el((165,491,262,729),'#ceacb6');p.el((169,497,258,723),'#b68caa');p.el((175,504,252,715),'#c59eb5');
 for y in [538,584,630,676]:p.line([(187,y),(208,y-10),(231,y),(210,y+11),(187,y)],'#e4c4c8');p.flower(210,y,5,'#e7c3c7',1)
 for x,y in [(65,746),(366,775)]:
  p.pot(x,y,36,34,'#b39391')
  for i in range(5):p.stem(x+18,y,-16+i*8,35+i%3*10);p.leaf(x+18,y-9,-12+i*6,-20);p.flower(x+2+i*8,y-35-i%3*10,6,COLS[i%4],i)
 p.box(179,780,73,40,'#8f797e',7,5);p.r(187,788,55,30,'#d4b9a2');p.line([(214,790),(214,816)],'#b19992');p.r(192,790,42,2,'#edcead');add('florist-room',p)
def ruins():
 for i in range(3):
  p=P(32,32);p.r(0,0,32,32,'#41485a');p.poly([(1,2),(28,0),(31,4),(30,29),(25,31),(2,30)],['#697487','#71788c','#636c80'][i]);p.line([(2,3),(27,2),(29,5)],'#8e99a9');p.line([(3,29),(25,29),(29,26)],'#4d576d');p.line([(6,8),(11,7),(14,10)],'#7c8799');p.line([(19,21),(25,20)],'#8993a3');
  if i==1:p.line([(8,13),(12,17),(10,23),(13,27)],'#4b586a');p.line([(12,18),(17,16)],'#929ba8')
  if i==2:p.line([(8,17),(16,9),(24,17),(16,25),(8,17)],'#7d8e9a');p.r(15,16,3,3,'#b6b4b4')
  add('ruins-floor-'+str(i),p)
 p=P(96,56);p.r(0,3,96,53,'#364354');p.poly([(0,12),(9,0),(96,0),(87,12)],'#9a9ca6');p.r(0,13,88,37,'#697789');p.poly([(88,13),(96,3),(96,43),(88,50)],'#4c5b73');p.line([(1,13),(86,13)],'#b5afb0',2)
 for y in [17,34]:
  for x in range(-13 if y==34 else 1,89,32):p.r(x,y,29,13,'#7c8393');p.line([(x+2,y+1),(x+24,y+1)],'#999caa');p.line([(x+1,y+12),(x+28,y+12)],'#536177')
 p.line([(1,49),(86,49)],'#9f9eaa');p.line([(2,52),(89,52)],'#273c4c',3)
 for x,y in [(13,9),(69,14),(40,39)]:p.leaf(x,y,11,-3,'#708c82');p.leaf(x,y,-7,5,'#5e7f77')
 add('ruins-wall',p)
 p=P(36,98);shadow(p,18,94,16,3);p.box(7,10,25,77,'#6f7c8e',5,7);p.box(2,2,33,13,'#a3a0a8',5,6);p.box(2,82,33,13,'#9b97a3',4,6);p.r(12,21,3,50,'#a8a6b0');p.r(22,18,4,57,'#46576d');p.line([(16,24),(19,28),(16,34),(19,39),(16,45),(19,49),(16,54),(19,59),(16,67)],'#bcb8ba');add('ruins-pillar',p)
 for pose in range(3):
  p=P(48,44);shadow(p,24,41,22,3);p.box(4,23,39,16,'#8f6c7d',4,7);p.r(8,29,27,8,'#aa8490');p.line([(10,31),(31,31)],'#bf9a99');p.box(8,25,4,14,GOLD,1,1);p.box(31,23,4,15,GOLD,1,1);p.r(15,23,15,3,'#2d3549');y=[14,7,0][pose];p.cushion((4,y,42,y+15),'#9b7e8e',5,False);p.line([(7,y+3),(35,y+3)],'#dbbb9e',2);p.box(8,y+2,4,14,'#c7a073',1,1);p.box(31,y+1,4,15,'#c7a073',1,1);p.box(20,23,8,8,GOLD,1,1);p.r(23,26,2,3,'#6b536b');p.r(5,38,34,2,'#dfba97');
  if pose>0:p.r(11,22,22,3,'#eed3a2');p.r(18,19,4,3,'#f7e1b6')
  add('ruins-chest-'+str(pose),p)
 for i in range(3):
  p=P(23,23);p.bowl(11,11,10,10,'#586880');p.bowl(11,10,8,8,'#8594a0');
  if i==0:p.bowl(11,10,5,6,'#eed6ad');p.bowl(14,8,4,5,'#8594a0')
  elif i==1:p.flower(11,10,6,'#dcb4c9',1)
  else:p.poly([(11,3),(13,8),(18,9),(14,12),(15,17),(11,14),(6,17),(7,12),(3,9),(9,8)],'#c7c6db')
  add('glyph-'+str(i),p)
 p=P(76,86);shadow(p,38,82,32,3);p.box(9,23,59,55,'#7a8191',10,9);p.poly([(6,24),(37,2),(68,24)],'#a0a1ac');p.poly([(16,23),(37,10),(58,23)],'#586f84');p.line([(16,27),(55,27),(55,61),(16,61),(16,27)],'#b1a6ae',2)
 for i,x in enumerate([17,38,58]):p.paste(ART['glyph-'+str(i)],x-11,37,.8)
 p.paste(ART['equip-ghostlamp'],31,7,.7);p.box(5,72,65,9,'#b4a7ad',3,5);add('ruins-mechanism',p)
 p=P(90,62)
 for i in range(5):p.box(9-i*2,6+i*10,72+i*4,11,'#8791a0',3,5);p.line([(11-i*2,9+i*10),(70+i*2,9+i*10)],'#bdc1bd')
 p.r(39,8,9,3,'#eedbb3');p.r(42,5,3,9,'#eedbb3');add('ruins-stairs',p)
 p=P(84,105);m.arch(p,(4,1,76,102),'#283e50',thick=10);m.arch(p,(14,15,56,87),'#617586',thick=4);p.r(28,44,30,56,'#334d60');p.paste(ART['glyph-2'],30,19);p.box(0,95,84,9,'#a5a6af',3,5);add('ruins-portal',p)
def pack():
 width=1024;x=y=2;row=0;pos={}
 for name,im in sorted(ART.items(),key=lambda a:-a[1].height):
  if x+im.width+2>width:x=2;y+=row+3;row=0
  pos[name]={'x':x,'y':y,'w':im.width,'h':im.height};x+=im.width+3;row=max(row,im.height)
 height=2**math.ceil(math.log2(y+row+3));atlas=Image.new('RGBA',(width,height))
 for name,im in ART.items():atlas.alpha_composite(im,(pos[name]['x'],pos[name]['y']))
 atlas.save(OUT/'atelier.png',optimize=True);(OUT/'atlas.json').write_text(json.dumps({'width':width,'height':height,'frames':pos},indent=2));print(len(ART),'original frames',atlas.size,(OUT/'atelier.png').stat().st_size,'bytes')
if __name__=='__main__':flowers();furniture();equipment();room();ruins();pack()
