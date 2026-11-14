"""Technical asset preparation only: preserve original painted RGB; crop / alpha-mask / pack.
Never paints substitute scenery, furniture, soil or tiles. Original images remain in originals/.
Usage: python tools/prepare-forest-garden.py [period=/absolute/edited.png ...]
"""
from PIL import Image,ImageDraw
from pathlib import Path
import json,sys,hashlib,shutil
root=Path(__file__).resolve().parents[1]/'src/assets/forest-garden';original=root/'originals';root.mkdir(exist_ok=True)
for arg in sys.argv[1:]:
 key,path=arg.split('=',1);shutil.copy2(path,original/(key+'.png'))
if not (original/'day.png').exists():shutil.copy2(original/'garden-clean.png',original/'day.png')
scale=432/887
regions={
 'tree':([(74,378),(100,300),(192,200),(310,175),(435,155),(535,160),(646,202),(672,231),(793,235),(869,286),(886,325),(884,438),(795,488),(670,490),(605,556),(547,620),(486,665),(409,680),(341,657),(288,670),(234,689),(202,665),(255,612),(302,588),(345,546),(333,496),(301,459),(232,470),(181,438),(100,425)],(0,0),339),
 'leftBush':([(0,1160),(92,1169),(152,1204),(193,1263),(205,1317),(169,1386),(71,1390),(0,1376)],(817,0),677),
 'frontLeft':([(0,1435),(137,1436),(240,1487),(280,1531),(318,1640),(360,1760),(349,1773),(0,1773)],(0,545),850),
 'frontRight':([(540,1773),(565,1623),(614,1522),(710,1405),(787,1419),(886,1476),(886,1773)],(364,545),850),
 'arch':([(642,1265),(646,1185),(689,1148),(752,1130),(831,1157),(886,1193),(886,1410),(850,1400),(840,1299),(811,1236),(758,1200),(708,1224),(696,1297),(694,1351),(665,1366)],(715,545),686)
}
# Six independently occluding front rails, exact crops of the painted wooden beds.
beds=[(75,409),(160,420),(64,461),(154,472),(67,516),(160,530)]
for i,(x,y) in enumerate(beds):
 sx,sy=x/scale,y/scale;poly=[(sx-72,sy+8),(sx+72,sy+13),(sx+70,sy+48),(sx-75,sy+44)]
 regions['bed-'+str(i)]=(poly,(i*150,918),y+26)
def masked(im,poly):
 xs,ys=zip(*poly);box=(int(min(xs)),int(min(ys)),int(max(xs))+1,int(max(ys))+1);mask=Image.new('L',im.size);ImageDraw.Draw(mask).polygon(poly,fill=255);copy=im.convert('RGBA');copy.putalpha(mask);return copy.crop(box),box
frames={};anchors={};sources={}
for period in ['morning','day','dusk','night']:
 path=original/(period+'.png')
 if not path.exists():continue
 im=Image.open(path).convert('RGB');assert im.size==(887,1774),(period,im.size);im.save(root/(period+'.webp'),lossless=True,method=6)
 sheet=Image.new('RGBA',(1024,1024))
 for name,(poly,(x,y),depth) in regions.items():
  tile,box=masked(im,poly)
  if name=='tree':
   mask=Image.new('L',im.size);d=ImageDraw.Draw(mask);d.polygon(poly,fill=255);d.rectangle((0,500,887,1774),fill=0)
   for trunk in [[(446,450),(522,446),(557,487),(544,541),(526,595),(528,641),(496,656),(469,657),(443,650),(419,654),(383,663),(360,673),(332,682),(292,695),(265,699),(256,687),(281,667),(308,646),(341,619),(351,596),(370,564),(390,542),(408,500)],[(390,570),(350,592),(314,607),(267,616),(218,624),(191,637),(198,650),(242,651),(278,640),(318,645),(362,632),(403,604)],[(481,594),(520,606),(549,620),(569,633),(548,643),(510,632),(478,624)]]:d.polygon(trunk,fill=255)
   copy=im.convert('RGBA');copy.putalpha(mask);tile=copy.crop(box)
  assert x+tile.width<=1024 and y+tile.height<=1024,(name,tile.size)
  sheet.alpha_composite(tile,(x,y));frames[name]={'frame':{'x':x,'y':y,'w':tile.width,'h':tile.height},'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':tile.width,'h':tile.height},'sourceSize':{'w':tile.width,'h':tile.height}};anchors[name]={'x':box[0]*scale,'y':box[1]*scale,'depth':depth,'sourceCrop':box}
 sheet.save(root/(period+'-objects.webp'),lossless=True,method=6);sources[period]={'file':'originals/'+period+'.png','sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
(root/'atlas.json').write_text(json.dumps({'frames':frames,'meta':{'size':{'w':1024,'h':1024},'anchors':anchors,'sources':sources,'method':'Exact original RGB crops with alpha masks only'}},indent=2))
# Moving swing/fish are exact painted source crops; the clean plates remove their baked versions.
im=Image.open(original/'garden-source.png');sheet=Image.new('RGBA',(1024,1024));props={}
def add(name,tile,x,y):
 assert x+tile.width<=1024 and y+tile.height<=1024,(name,tile.size)
 sheet.alpha_composite(tile,(x,y));props[name]={'frame':{'x':x,'y':y,'w':tile.width,'h':tile.height},'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':tile.width,'h':tile.height},'sourceSize':{'w':tile.width,'h':tile.height}}
mask=Image.new('L',im.size);d=ImageDraw.Draw(mask)
for poly in [[(733,840),(739,841),(729,967),(724,979),(720,977),(731,848)],[(800,841),(807,842),(797,966),(791,986),(785,983),(790,963)],[(707,969),(795,969),(813,977),(799,1008),(704,995)]]:d.polygon(poly,fill=255)
copy=im.convert('RGBA');copy.putalpha(mask);add('swing',copy.crop((700,830,820,1010)),0,0)
front=Image.new('L',im.size);ImageDraw.Draw(front).polygon([(706,982),(799,989),(811,977),(799,1008),(704,995)],fill=255);copy=im.convert('RGBA');copy.putalpha(front);add('swing-front',copy.crop((700,830,820,1010)),124,0)
for i,(box,poly) in enumerate([((625,680,680,702),[(631,685),(646,686),(659,690),(674,688),(676,692),(663,698),(645,692),(631,690)]),((661,696,711,719),[(667,700),(684,703),(700,704),(706,710),(694,716),(680,712),(668,706)])]):
 tile,_=masked(im,poly);out=Image.new('RGBA',(box[2]-box[0],box[3]-box[1]));xs,ys=zip(*poly);out.alpha_composite(tile,(int(min(xs))-box[0],int(min(ys))-box[1]));add('fish-'+str(i),out,260+i*65,0)
water=Image.open(original/'garden-clean.png').convert('RGBA').crop((650,675,760,712));wm=Image.new('L',water.size);ImageDraw.Draw(wm).ellipse((4,3,106,34),fill=255);water.putalpha(wm);add('water',water,400,0)
if (original/'garden-props.png').exists():
 art=Image.open(original/'garden-props.png');w,h=art.size
 for name,(col,row),(x,y) in [('sprout',(0,0),(0,200)),('seedling',(1,0),(350,200)),('petal',(0,1),(0,650)),('leaf',(1,1),(350,650))]:
  tile=art.crop((col*w//2,row*h//2,(col+1)*w//2,(row+1)*h//2));box=tile.getchannel('A').point(lambda v:255 if v>20 else 0).getbbox();tile=tile.crop(box);add(name,tile,x,y)
sheet.save(root/'props.webp',lossless=True,method=6);(root/'props.json').write_text(json.dumps({'frames':props,'meta':{'size':{'w':1024,'h':1024},'source':'originals/garden-source.png + originals/garden-props.png','preparation':'Technical transparent crops; no replacement painting'}},indent=2))
print('Prepared native paintings, cropped foregrounds, six bed rails and independent original props.')
