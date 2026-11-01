import {v5WindowContains} from './v5-config.js';
import {LakesideActors} from './lakeside-actors.js';
import {v5Period,V5_HOME_PROPS} from './v5-scenes.js';
import {v5Frame} from './v5-assets.js';
import {MeadowSprigs} from './v5-landscape.js';
import {meadowPath} from './meadow-art.js';
import {HOME,MEADOW} from './home-config.js';
import {cabinBlocked,canPlace,furnitureBox,furniture,furnitureStandPoints} from './home-model.js';
import {furnitureCanvas} from './home-art.js';
import {FlowerPickupEffects} from './flower-effects.js';
import {WindMeadow,grassMask} from './wind-grass.js';
import {starTwinkle} from './nature-config.js';
import {retreatRoute} from './retreat-navigation.js';
import Phaser from 'phaser';
import {controls} from './game.js';
import {outfitKey} from './wardrobe-art.js';
import {retreatPainting} from './romantic-art.js';
import {ROMANCE as R} from './romantic-config.js';
import {flowerStage} from './romantic-model.js';
import {skyPalette,mix} from './sky-model.js';
export class RomanticScene extends Phaser.Scene {
 constructor(profile,api){super('retreat');this.profile=profile;this.api=api}
 init({place}){this.place=place;this.v5Cats=new LakesideActors();this.elapsed=0;this.target=null;this.path=[];this.selected=null;this.facing=3;this.quiet=false;this.awaken=0;this.frameTime=0;this.lastPaint='';this.slow=0;this.editing=null;this.homePulse=[];this.homeTextureKeys=new Set();this.homeSprites=new Map();this.fixedSprites=[];this.fixedSignature=''}
 create(){
  this.cameras.main.setBackgroundColor('#493e52');this.repaint();
  this.player=this.add.sprite(216,785,outfitKey(this.profile),12).setOrigin(.5,.85).setScale(1.25);
  this.cat=this.add.image(251,772,'cat').setScale(1.1);this.g=this.add.graphics().setDepth(35);this.pickups=new FlowerPickupEffects();this.pickupGraphics=this.add.graphics().setDepth(100);this.decorGraphics=this.add.graphics().setDepth(150);this.homeEffectGraphics=this.add.graphics().setDepth(110);this.syncHome();this.syncFixed();this.meadow=this.place!=='cabin'?new WindMeadow(432,850,{count:this.place==='meadow'?64:105,mask:this.place==='meadow'?(x,y)=>Math.abs(x-meadowPath(y).x)>meadowPath(y).width/2+7&&!(x>278&&x<393&&y>540&&y<622)&&!(x>55&&x<151&&y>614&&y<689):grassMask(this.textures.get('retreat-night').getSourceImage(),['#3d5557','#49645e','#617970']),minY:340,maxY:800,seed:407}):null;
  this.v5Sprigs=this.place==='meadow'?new MeadowSprigs(this):null;this.cameras.main.setBounds(0,0,432,850);this.cameras.main.startFollow(this.player,true,.07,.07,0,40);this.cameras.main.fadeIn(700,35,35,53);
  this.keys=this.input.keyboard.createCursorKeys();this.extra=this.input.keyboard.addKeys('W,A,S,D');
  this.input.on('pointerdown',p=>{if(this.api.blocked())return;if(this.editing){this.placeAt(p);return}if(this.quiet)return;const homeHit=this.place==='cabin'?this.props().filter(v=>v.id==='homeItem').sort((a,b)=>b.item.y-a.item.y).find(v=>{const f=furniture(v.item.type);return Math.abs(p.worldX-v.item.x)<f.w/2+4&&p.worldY>v.item.y-f.h&&p.worldY<v.item.y+10}):null;let hit=homeHit||this.props().map(v=>({...v,d:Math.hypot(p.worldX-v.x,p.worldY-v.y)})).sort((a,b)=>a.d-b.d)[0];if(this.place==='meadow'&&p.worldY>334&&!(hit?.d<32)&&Math.abs(p.worldX-meadowPath(p.worldY).x)>meadowPath(p.worldY).width/2+5){hit={id:'meadowPick',x:p.worldX,y:p.worldY,title:MEADOW.pick,d:0}}if(homeHit||hit?.d<32){if(Math.hypot(hit.x-this.player.x,hit.y-this.player.y)<100)this.api.action(hit);else this.walkTo(this.standPoint(hit),hit)}else if(!this.blocked(p.worldX,p.worldY)){this.walkTo({x:p.worldX,y:p.worldY})}});
  this.input.on('pointermove',p=>{if(this.editing&&p.isDown&&!this.api.blocked())this.placeAt(p)});this.events.once('shutdown',()=>{this.v5Sprigs?.destroy();for(const key of this.homeTextureKeys)if(this.textures.exists(key))this.textures.remove(key);for(const k of ['retreat-night','retreat-morning','retreat-day','retreat-dusk'])if(this.textures.exists(k))this.textures.remove(k)});this.api.ready(this);
 }
 repaint(){
  const theme=this.profile.romance.theme;this.background?.destroy();this.blend?.destroy();
  for(const [key,hour]of [['night',22],['morning',7],['day',12],['dusk',18]]){const texture='retreat-'+key;if(this.textures.exists(texture))this.textures.remove(texture);this.textures.addCanvas(texture,retreatPainting(this.place,hour,theme,this.profile.romance.room))}
  this.background=this.add.image(0,0,'retreat-night').setOrigin(0).setDepth(-3);this.blend=this.add.image(0,0,'retreat-day').setOrigin(0).setDepth(-2);this.lastPaint=this.paintKey();
 }
 props(){if(this.place==='meadow')return[{id:'meadowBench',x:341,y:600,title:MEADOW.bench},{id:'picnic',x:105,y:688,title:MEADOW.picnic},{id:'meadowPick',x:130,y:490,title:MEADOW.pick},{id:'meadowGate',x:216,y:799,title:MEADOW.back},{id:'cat',x:this.cat.x,y:this.cat.y,title:R.cat}];return this.place==='garden'?[
  {id:'tree',x:215,y:284,title:R.tree},{id:'swing',x:356,y:540,title:R.swing},{id:'pool',x:278,y:307,title:R.lakeSit},
  {id:'hollow',x:38,y:330,title:R.secrets.hollow.name},{id:'grass',x:301,y:680,title:R.secrets.grass.name},{id:'candy',x:51,y:620,title:R.secrets.candy.name},
  ...this.profile.romance.beds.map((b,i)=>({id:'bed',index:i,x:87+i%2*67,y:401+Math.floor(i/2)*61,title:flowerStage(b)===0?R.plant:flowerStage(b)===1?R.water:flowerStage(b)===4?R.harvest:R.growing})),
  {id:'meadowGate',x:355,y:735,title:MEADOW.gate},{id:'exit',x:216,y:799,title:R.leave},{id:'cat',x:this.cat.x,y:this.cat.y,title:R.cat}
 ]:[{id:'window',x:212,y:325,title:R.seat},{id:'gift',x:240,y:294,title:R.gift},{id:'rest',x:272,y:538,title:R.rest},{id:'fire',x:105,y:313,title:R.lakeSit},{id:'sofa',x:108,y:451,title:R.seat},{id:'wardrobe',x:109,y:617,title:R.wardrobe},{id:'books',x:302,y:665,title:R.shelf},{id:'mail',x:174,y:298,title:R.mailbox},{id:'cat',x:this.cat.x,y:this.cat.y,title:R.cat},{id:'exit',x:216,y:798,title:R.leave},...this.profile.romance.room.items.map(item=>({id:'homeItem',item,x:item.x,y:item.y+16,title:furniture(item.type).name}))]}
 standPoint(p){if(p.id==='homeItem'){const candidates=furnitureStandPoints(p.item).sort((a,b)=>Math.hypot(a.x-this.player.x,a.y-this.player.y)-Math.hypot(b.x-this.player.x,b.y-this.player.y));const point=candidates.find(q=>!this.blocked(q.x,q.y)&&retreatRoute(this.player,q,(x,y)=>this.blocked(x,y)).length);if(point)return point}if(p.id==='tree')return{x:215,y:310};if(p.id==='swing')return{x:356,y:569};return{x:Phaser.Math.Clamp(p.x,40,398),y:Phaser.Math.Clamp(p.y+27,290,795)}}
 blocked(x,y){if(x<40||x>398||y<290||y>811)return true;if(this.place==='garden')return ((x-324)/53)**2+((y-280)/36)**2<1||(x>187&&x<234&&y<302);return this.place==='cabin'?cabinBlocked(x,y,this.profile.romance.room.items):y<330}
 nearest(){return this.props().map(p=>({...p,d:Math.hypot(p.x-this.player.x,p.y-this.player.y)})).filter(p=>p.d<80).sort((a,b)=>a.d-b.d)[0]}
 idle(){this.player.stop();this.player.setTexture(outfitKey(this.profile),this.facing*4)}
 stopMoving(){this.target=null;this.path=[];this.selected=null;controls.x=controls.y=0;this.input.keyboard.resetKeys();this.idle()}
 walkTo(point,selected=null){const path=retreatRoute(this.player,point,(x,y)=>this.blocked(x,y));this.stopMoving();this.target=path.shift()||null;this.path=path;this.selected=this.target?selected:null}
 sit(kind,point=null){this.seatReturn={x:this.player.x,y:this.player.y};this.stopMoving();this.quiet=true;this.seat=kind;this.facing=kind==='window'?3:0;const pos=kind==='home'?{x:point.x,y:point.y-10}:kind==='meadowBench'?{x:341,y:566}:kind==='picnic'?{x:108,y:655}:kind==='swing'?{x:356,y:533}:kind==='window'?{x:207,y:327}:kind==='pool'?{x:279,y:329}:kind==='fire'?{x:115,y:341}:{x:73,y:435};this.player.setPosition(pos.x,pos.y);this.idle();this.api.near(null);this.cameras.main.stopFollow();this.cameras.main.pan(216,kind==='home'?point.y-80:this.place==='meadow'?530:kind==='swing'?510:kind==='pool'?315:340,2200,'Sine.easeInOut')}
 stand(){this.stopMoving();this.quiet=false;if(['home','meadowBench','picnic'].includes(this.seat))this.player.setPosition(this.seatReturn.x,this.seatReturn.y);else this.player.setPosition(this.place==='garden'?this.seat==='swing'?356:270:216,this.place==='garden'?this.seat==='swing'?572:340:354);this.cameras.main.panEffect.reset();this.cameras.main.startFollow(this.player,true,.07,.07,0,40);this.api.near(this.nearest())}
 movePlayer(dt){
  let dx=controls.x+(this.keys.right.isDown||this.extra.D.isDown?1:0)-(this.keys.left.isDown||this.extra.A.isDown?1:0),dy=controls.y+(this.keys.down.isDown||this.extra.S.isDown?1:0)-(this.keys.up.isDown||this.extra.W.isDown?1:0);
  if(dx||dy){this.target=null;this.path=[];this.selected=null}
  else if(this.target){
   if(this.selected&&Math.hypot(this.selected.x-this.player.x,this.selected.y-this.player.y)<62){const selected=this.selected;this.stopMoving();this.api.action(selected);return}
   dx=this.target.x-this.player.x;dy=this.target.y-this.player.y;
   if(Math.hypot(dx,dy)<1){this.player.setPosition(this.target.x,this.target.y);this.target=this.path.shift()||null;if(!this.target){const selected=this.selected;this.stopMoving();if(selected)this.api.action(selected);return}dx=this.target.x-this.player.x;dy=this.target.y-this.player.y}
  }
  const len=Math.hypot(dx,dy);if(len<=.08){this.idle();return}
  const step=this.target?Math.min(87*dt,len):87*dt;dx/=Math.max(1,len);dy/=Math.max(1,len);const oldX=this.player.x,oldY=this.player.y,nx=oldX+dx*step,ny=oldY+dy*step;
  if(!this.blocked(nx,this.player.y))this.player.x=nx;
  if(!this.blocked(this.player.x,ny))this.player.y=ny;
  this.facing=Math.abs(dx)>Math.abs(dy)?dx<0?1:2:dy<0?3:0;
  if(Math.hypot(this.player.x-oldX,this.player.y-oldY)>.001)this.player.play(`dress-${this.profile.wardrobe.equipped}-${this.facing}`,true);
  else{if(this.target){this.target=null;this.path=[];this.selected=null}this.idle()}
 }

 paintKey(){const w=this.profile.romance;return[w.theme,w.room.wallpaper,w.room.floor].join('/')}
 homeTexture(item){const w=this.profile.romance,key=['home',item.type,w.theme,item.type==='vase'?w.room.bouquet:'plain',item.on?1:0].join('-');if(!this.textures.exists(key)){this.textures.addCanvas(key,furnitureCanvas(item.type,w.theme,w.room.bouquet,item.on));this.homeTextureKeys.add(key)}return key}
 syncFixed(){
  if(this.place!=='cabin')return;const period=v5Period(this.profile.scenery.clock),theme=this.profile.romance.theme,key=period+'/'+theme;if(key===this.fixedSignature)return;this.fixedSignature=key;
  this.fixedSprites.forEach(v=>v.destroy());this.fixedSprites=[];
  for(const p of V5_HOME_PROPS){const texture='v5-fixed-'+p.name+'-'+period+'-'+theme;if(!this.textures.exists(texture)){this.textures.addCanvas(texture,v5Frame(p.name,{period,theme}));this.homeTextureKeys.add(texture)}const sprite=this.add.image(p.x,p.y,texture).setOrigin(0).setDepth(20+p.foot*.01);if(p.height)sprite.setDisplaySize(sprite.width,p.height);this.fixedSprites.push(sprite)}
 }
 syncHome(){
  if(this.place!=='cabin')return;const items=this.profile.romance.room.items;
  for(const [type,image]of this.homeSprites)if(!items.some(i=>i.type===type)){image.destroy();this.homeSprites.delete(type)}
  for(const item of items){let image=this.homeSprites.get(item.type);if(!image){image=this.add.image(item.x,item.y,this.homeTexture(item)).setOrigin(.5,1);this.homeSprites.set(item.type,image)}image.setTexture(this.homeTexture(item)).setPosition(item.x,item.y).setFlipX(item.flip).setDepth(20+item.y*.01).setVisible(this.editing?.item.type!==item.type)}
 }
 startPlacement(item){this.stopMoving();this.editing={item:{...item}};this.cameras.main.stopFollow();this.cameras.main.panEffect.reset();this.cameras.main.pan(216,550,400,'Sine.easeOut');this.ghost=this.add.image(item.x,item.y,this.homeTexture(item)).setOrigin(.5,1).setAlpha(.8).setDepth(140);this.syncHome();this.updatePlacement()}
 placeAt(p){const item=this.editing.item;item.x=Math.round(p.worldX/HOME.grid)*HOME.grid;item.y=Math.round(p.worldY/HOME.grid)*HOME.grid;this.updatePlacement();this.api.editChanged?.()}
 updatePlacement(){
  if(!this.editing)return;const item=this.editing.item,valid=canPlace(this.profile.romance.room.items,item),box=furnitureBox(item),g=this.decorGraphics;
  g.clear();g.fillStyle(valid?0xc1d8bd:0xe5a2b1,.23);g.fillRoundedRect(box.x-3,box.y-3,box.w+6,box.h+6,3);g.lineStyle(1,valid?0xd7e8c2:0xf0b5c3,.8);g.strokeRect(box.x-3,box.y-3,box.w+6,box.h+6);
  this.ghost.setPosition(item.x,item.y).setFlipX(item.flip).setTint(valid?0xffffff:0xdc9db1);this.api.editChanged?.();
 }
 endPlacement(){this.editing=null;this.ghost?.destroy();this.ghost=null;this.decorGraphics.clear();this.syncHome();if(this.blocked(this.player.x,this.player.y))this.player.setPosition(216,730);this.stopMoving();this.cameras.main.panEffect.reset();this.cameras.main.startFollow(this.player,true,.07,.07,0,40)}
 touchHome(type){this.homePulse.push({type,at:this.elapsed});if(this.homePulse.length>6)this.homePulse.shift()}
 drawHome(rect,ellipse,a,t,reduced){
  const items=this.profile.romance.room.items;
  for(const item of items){ellipse(item.x,item.y, furniture(item.type).footW+7,8,'#493b51',.12);
   if(item.on&&['lamp','candles'].includes(item.type)&&!reduced){const y=item.y-furniture(item.type).h+19,breath=this.profile.romance.reducedMotion?1:.92+Math.sin(t*1.4+item.x)*.08;ellipse(item.x,y,72,70,'#ffe1a6',.045*breath);ellipse(item.x,item.y-2,68,28,'#f6d4a6',.035)}
   if(item.type==='tea'&&item.on)for(let i=0;i<(reduced?2:3);i++){const q=(t*.28+i*.31)%1;ellipse(item.x-1+Math.sin(q*5+i)*3,item.y-35-q*16,2+q*3,2+q*4,'#fff0da',Math.sin(q*Math.PI)*.23)}
   if(item.type==='record'&&item.on){rect(item.x-5+Math.sin(t*2)*5,item.y-21,1,1,'#f5d6b7')}
  }
  const g=this.homeEffectGraphics;g.clear();this.homePulse=this.homePulse.filter(p=>this.elapsed-p.at<1.6);
  for(const pulse of this.homePulse){const item=items.find(i=>i.type===pulse.type);if(!item)continue;const age=this.elapsed-pulse.at;for(let i=0;i<(reduced?5:10);i++){const angle=i*2.4,spread=4+age*15;g.fillStyle(pulse.type==='plant'?0xc0dedb:0xf1dbb0,(1-age/1.6)*.8);g.fillRect(item.x+Math.cos(angle)*spread,item.y-furniture(item.type).h*.6+Math.sin(angle)*spread*.5-age*10,2,2)}}
 }
 meadowPickup(kind){this.pickups.emit(kind,this.player.x-12,this.player.y-20,{x:this.player.x+10,y:this.player.y-28});this.meadowPulse=this.elapsed}
 drawMeadow(rect,ellipse,a,t,reduced){
  if(a.night>.1)for(let i=0;i<20;i++)rect(20+i*67%390,34+i*31%148,1,1,'#eee2d3',a.night*starTwinkle(t,i*1.71,.3+i%4*.1));
  for(let i=0;i<(reduced?15:32);i++){const x=20+i*73%390,y=345+i*89%468,bend=this.profile.romance.reducedMotion?0:Math.sin(t*.7+i*2.3)*2,near=Math.max(0,1-Math.hypot(this.player.x-x,this.player.y-y)/45);rect(x+bend+near*3,y-9,1,9,'#91ab8f',.65);ellipse(x+bend+near*3,y-12,5,4,i%3?'#d7b5d0':'#f0dfd0',.8)}
  for(let i=0;i<(reduced?3:6);i++){const x=86+Math.sin(t*.23+i*2.8)*61+i*32,y=415+Math.cos(t*.4+i)*37;rect(x,y,1,3,'#8f8097');ellipse(x-2,y+Math.sin(t*6+i),4,3,i%2?'#eac8d6':'#f5dfbd');ellipse(x+2,y,4,3,'#d6c5e0')}
  if(a.night>.2)for(let i=0;i<(reduced?6:16);i++){const x=30+i*83%374+Math.sin(t*.3+i)*7,y=380+i*71%380+Math.sin(t*.4+i)*4,alpha=a.night*(.1+.7*Math.sin(t*.5+i*1.9)**6);rect(x,y,1,1,'#f1e9b7',alpha)}
  if(this.meadowPulse&&this.elapsed-this.meadowPulse<2){const q=(this.elapsed-this.meadowPulse)/2;for(let i=0;i<12;i++){const angle=i*.524+t;ellipse(this.player.x+Math.cos(angle)*(10+q*25),this.player.y-14+Math.sin(angle)*12-q*8,3,2,i%2?'#edc4d5':'#eadcc8',(1-q)*.8)}}
 }

 flowerPickup(kind,index){this.pickups.emit(kind,87+index%2*67,378+Math.floor(index/2)*61,{x:this.player.x+10,y:this.player.y-28})}
 update(time,delta){
  if(document.hidden||this.api.blocked()){this.stopMoving();return;}const dt=Math.min(delta,60)/1000;this.elapsed+=dt;const w=this.profile.romance;
  if(this.quiet||this.editing)this.idle();else{this.movePlayer(dt);if(!this.quiet&&!this.api.blocked())this.api.near(this.nearest())}
  if(delta>45)this.slow++;else this.slow=Math.max(0,this.slow-.25);const reduced=this.profile.scenery.lowEffects||this.slow>100;this.pickups.update(dt,{reduced,still:w.reducedMotion});this.meadow?.update(dt,{reduced,still:w.reducedMotion});this.frameTime+=dt;if(this.frameTime<1/(reduced?16:30))return;this.frameTime=0;
  if(this.paintKey()!==this.lastPaint)this.repaint();this.syncHome();this.syncFixed();this.updatePlacement();const a=skyPalette(this.profile.scenery.clock),day=a.day,t=w.reducedMotion?0:this.elapsed;if(this.profile.scenery.clock>=17&&this.profile.scenery.clock<20){this.background.setTexture('retreat-dusk');this.blend.setAlpha(0)}else if(day>.65){this.background.setTexture(this.profile.scenery.clock<9?'retreat-morning':'retreat-day');this.blend.setTexture('retreat-day').setAlpha(this.profile.scenery.clock<9?Math.max(0,(day-.80)/.20):0)}else{this.background.setTexture('retreat-night');this.blend.setTexture('retreat-morning').setAlpha(Math.min(1,day*1.5))}
  if(this.place==='cabin'){const lamps=w.room.items.filter(item=>item.on&&['lamp','candles'].includes(item.type));for(const item of w.room.items){const image=this.homeSprites.get(item.type);let warm=0;for(const lamp of lamps)warm=Math.max(warm,Math.max(0,1-Math.hypot(item.x-lamp.x,item.y-lamp.y)/140));image?.setTint(parseInt(mix(mix('#c6bed0','#f3dcc4',warm*.45),'#fff6e6',day).slice(1),16))}}this.player.setDepth(20+this.player.y*.01);this.cat.setDepth(20+(this.cat.y+13)*.01);this.v5Sprigs?.update(t,this.profile.scenery.clock,w.reducedMotion);const g=this.g;g.clear();const rect=(x,y,ww,hh,col,alpha=1)=>{g.fillStyle(parseInt(col.slice(1),16),alpha);g.fillRect(Math.round(x),Math.round(y),ww,hh)},ellipse=(x,y,ww,hh,col,alpha=1)=>{g.fillStyle(parseInt(col.slice(1),16),alpha);g.fillEllipse(x,y,ww,hh)};
  this.meadow?.draw(rect,{day,player:this.player});const fg=this.pickupGraphics;fg.clear();this.pickups.draw((x,y,w,h,color,alpha)=>{fg.fillStyle(parseInt(color.slice(1),16),alpha);fg.fillRect(Math.round(x),Math.round(y),w,h)});
  ellipse(this.player.x+3,this.player.y+2,25,6,'#384955',.12);ellipse(this.cat.x+4,this.cat.y+15,26,5,'#384955',.1);
  // The cat is always safe. It follows, chases a butterfly, stretches, then naps.
  const cycle=t%47,follow=w.catFollow&&!this.quiet;
  const catBed=this.place==='cabin'?w.room.items.find(i=>i.type==='catBed'&&i.on):null;const cx=catBed&&!follow&&cycle>20?catBed.x:follow?this.player.x+30:this.place==='cabin'?cycle<14?255:325:this.place==='meadow'?this.quiet?this.player.x+30:cycle<20?330:112:cycle<15?286+Math.sin(t*.6)*23:254;
  const cy=catBed&&!follow&&cycle>20?catBed.y-12:follow?this.player.y-12:this.place==='cabin'?cycle<14?249:714:this.place==='meadow'?this.quiet?this.player.y+12:cycle<20?597:677:cycle<15?362+Math.cos(t*.5)*13:338;
  this.cat.x+=(cx-this.cat.x)*.065;this.cat.y+=(cy-this.cat.y)*.065;
  const sleep=!follow&&(this.quiet||cycle>28),stretch=!sleep&&cycle>23&&cycle<28?Math.sin((cycle-23)/5*Math.PI):0;
  const perspective=this.place==='meadow'?.45+Math.max(0,Math.min(1,(this.cat.y-310)/500))*.55:1;this.cat.setTexture(sleep?'cat-sleep':'cat').setScale((1.1+stretch*.2)*perspective,(sleep?.8+Math.sin(t)*.008:1.1-stretch*.3)*perspective);if(this.place==='meadow')this.player.setScale(.55+Math.max(0,Math.min(1,(this.player.y-330)/480))*.7);const catPeriod=v5Period(this.profile.scenery.clock),catPose=sleep?'sleep':stretch>.2?'stretch':'sit',catTexture='v5-cat-'+catPeriod+'-'+catPose;if(!this.textures.exists(catTexture)){this.textures.addCanvas(catTexture,this.v5Cats.cat(catPeriod,catPose));this.homeTextureKeys.add(catTexture)}this.cat.setTexture(catTexture).setDisplaySize((37+stretch*4)*perspective,(26-stretch*2)*perspective);
  if(this.place==='meadow'){this.drawMeadow(rect,ellipse,a,t,reduced)}else if(this.place==='garden'){
   for(let i=0;i<6;i++){const b=w.beds[i],stage=flowerStage(b),x=87+i%2*67,y=401+Math.floor(i/2)*61;if(stage===0)continue;const f=R.flowers.find(f=>f.id===b.flower),height=[0,4,8,16,24][stage],bend=Math.sin(t*.7+i*2.3)*1.4,near=Math.max(0,1-Math.hypot(this.player.x-x,this.player.y-y)/48);rect(x+bend+near*2,y-height,2,height,'#87a188');rect(x-7+bend,y-height*.6,8,3,'#a1b398');rect(x+2+bend,y-height*.4,8,3,'#809e87');if(stage>=3){const size=stage===4?10:5;rect(x-size/2+bend,y-height-3,size,7,f.color);rect(x-2+bend,y-height-6,5,12,f.color);rect(x+bend,y-height-2,2,2,f.center);if(f.id==='glow')ellipse(x,y-height,26,24,f.center,a.night*.12)}if(stage===2)rect(x+6,y-7,2,3,'#badcdb')}
   for(let i=0;i<(reduced?8:18);i++){const x=130+i*37%170,y=154+i*17%61,bend=w.reducedMotion?0:Math.sin(t*.58+i*2.3)*1.4;rect(x+bend,y,2,1,i%3?'#dfb4ca':'#edcdd3',.6)}
   const glow=w.treeAwakened?Math.min(1,(this.elapsed-this.awaken)/3):0;
   if(w.treeAwakened&&this.elapsed-this.awaken<3.4){const age=this.elapsed-this.awaken;for(let i=0;i<(reduced?9:18);i++){const q=Math.max(0,Math.min(1,age/2.7-i*.025)),x=212+Math.sin(i*2.4)*q*64,y=281-q*(100+i%5*12);rect(x,y,1,2,'#f6dfb2',Math.sin(q*Math.PI)*.8)}}
   if(glow)for(let i=0;i<22;i++){const x=131+i*43%173,y=105+i*29%90,alpha=(.55+Math.sin(t*.4+i*2)**2*.45)*glow;rect(x,y,2,2,'#ffe9b9',alpha);if(!reduced)ellipse(x+1,y+1,14,12,'#f9ceba',alpha*.055)}
   const swing=w.reducedMotion?0:Math.sin(t*.65)*(this.quiet&&this.seat==='swing'?5:1.4);g.lineStyle(2,0xceb9a4,.9);g.beginPath();g.moveTo(335,427);g.lineTo(335+swing,529);g.moveTo(377,427);g.lineTo(377+swing,529);g.strokePath();rect(331+swing,529,53,7,'#cba8a3');rect(332+swing,529,51,1,'#e7c7b2');rect(335+swing,534,45,1,'#a78a97');if(this.quiet&&this.seat==='swing')this.player.x=356+swing;
   for(let i=0;i<7;i++){const x=296+i*9,y=269+(i*7)%27;rect(x+Math.sin(t+i)*3,y,7+i%3*2,1,'#d5dcd8',.3)}
   for(let i=0;i<(reduced?3:7);i++){const x=247+Math.sin(t*.35+i*2)*49,y=359+Math.cos(t*.6+i)*24;rect(x,y,2,3,'#9a84a1');rect(x-3,y+(Math.sin(t*7+i)>0?-2:0),3,3,i%2?'#e1bdcd':'#d8c8a6');rect(x+2,y,3,3,'#d3b5ce')}
   if(a.night>.2)for(let i=0;i<(reduced?8:24);i++){const x=45+i*67%340+Math.sin(t*.25+i)*10,y=320+i*83%418+Math.sin(t*.4+i*3)*7,alpha=(.15+.7*Math.sin(t*.5+i*2)**4)*a.night;rect(x,y,2,2,'#e8e6ac',alpha);if(!reduced)ellipse(x,y,9,9,'#dfe6a7',alpha*.05)}
   // Tree-hole silhouette and the small, unmarked hidden letter.
   ellipse(38,323,12,18,'#364852');rect(35,324,6,3,'#d1b4ae');
   if(!w.secrets.includes('grass')){rect(300,676,2,8,'#f1ddb4');rect(297,679,8,2,'#d3b9dc')}
  }else{
   this.drawHome(rect,ellipse,a,t,reduced);
   // A handful of moving hearth pixels cast local warm light across the floor.
   for(let i=0;i<6;i++){const flame=8+Math.sin(t*4+i*2)*4;rect(51+i*6,309-flame,4,flame,i%2?'#efb77c':'#e38e72');rect(52+i*6,307-flame*.5,2,flame*.5,'#ffe1a2')}
   if(!reduced){ellipse(72,316,100,68,'#f7bd87',.055);ellipse(79,337,143,80,'#f1c18f',.04)}
   if(a.night>.05)for(let i=0;i<24;i++){const x=140+i*47%151,y=90+i*19%66;if(v5WindowContains(x,y))rect(x,y,1,1,i%4?'#e5d9e7':'#f4d9b3',a.night*starTwinkle(t,i*1.73,.2+i%5*.1))}
   // Window glass is the only weather area inside; rain never falls through the roof.
   if(w.weather==='rain')for(let i=0;i<(reduced?18:42);i++){const x=134+i*37%163,y=83+(i*29+t*90)%135;if(v5WindowContains(x,y+5))rect(x,y,1,5,'#c1c8da',.5)}
   if(w.weather==='snow')for(let i=0;i<(reduced?10:25);i++){const x=134+(i*37+Math.sin(t*.3+i)*4)%162,y=83+(i*29+t*7)%135;if(v5WindowContains(x,y+2))rect(x,y,2,2,'#f5e8df',.7)}
   if(w.rainStoppedAt&&Date.now()-w.rainStoppedAt<180000&&w.weather==='clear'){g.lineStyle(2,0xd8a6ba,.35);g.beginPath();g.arc(218,151,48,Math.PI,Math.PI*2);g.strokePath();g.lineStyle(2,0xe5d1ac,.3);g.beginPath();g.arc(218,151,44,Math.PI,Math.PI*2);g.strokePath()}
   if(w.personalStar&&w.starPlace==='room'){rect(271,119,2,14,'#fae8bd');rect(266,125,12,2,'#fae8bd');ellipse(272,126,25,25,'#f9d4a7',.085)}
   if(w.personalStar){rect(227,245,25,19,'#bb9baa');rect(229,244,21,3,'#e1c4b8')}
   // Morning window rays are clipped to the room floor instead of tinting the frame.
   if(day>.3&&!reduced){g.fillStyle(0xffe6b3,.035*day);g.fillTriangle(139,236,150,510,243,510);g.fillTriangle(284,236,286,472,372,472)}
  }
  // Finite deterministic petal pool, slow and not synchronized with tree sway.
  if(!w.reducedMotion)for(let i=0;i<(reduced?7:18);i++){const x=24+((i*73+t*(2+i%3))%384),y=this.place!=='cabin'?175+(i*47+t*(4+i%4))%620:290+(i*37-t*1.3+520)%480;rect(x+Math.sin(t*.7+i)*7,y,i%4?2:3,1,this.place!=='cabin'?'#e3b2c9':'#f2d6b2',this.place!=='cabin'?.5:.22)}
  this.player.setDepth(20+this.player.y*.01);this.cat.setDepth(20+(this.cat.y+13)*.01);g.setDepth(this.place==='cabin'?35:18);
 }
}
