import {FOREST_GARDEN as G,gardenBlocked,insidePolygon} from './forest-garden-config.js';
import {preloadForest,forestReady,ForestGardenArt} from './forest-garden-art.js';
import {preloadFlowers,installFlowers,flowerSprite,flowerTexture} from './flower-art.js';
import {MEADOW_FLOWERS} from './flower-catalog.js';
import {preloadCottage,installCottage,fitCottage,cottageFlowers,cottageLighting,cottageWindow,COTTAGE} from './cottage-art.js';
import {portraitViewport} from './portrait-viewport.js';
import {EquipmentLayer} from './equipment-layer.js';
import {homeBouquet} from './play-model.js';
import {cachedPainting,retreatPair,periodHour} from './scene-paint-cache.js';
import {v5WindowContains} from './v5-config.js';
import {LakesideActors} from './lakeside-actors.js';
import {v5Period,V5_HOME_PROPS} from './v5-scenes.js';
import {v5Frame} from './v5-assets.js';
import {MeadowSprigs} from './v5-meadow.js';
import {meadowPath} from './meadow-art.js';
import {HOME,MEADOW} from './home-config.js';
import {cabinBlocked,canPlace,furnitureBox,furniture,furnitureStandPoints,safeRoomPoint} from './home-model.js';
import {furnitureCanvas} from './home-art.js';
import {FlowerPickupEffects} from './flower-effects.js';
import {WindMeadow,grassMask} from './wind-grass.js';
import {starTwinkle} from './nature-config.js';
import {retreatRoute} from './retreat-navigation.js';
import Phaser from 'phaser';
import {controls} from './game.js';
import {poseCharacter,CHARACTER} from './character-art.js';
import {outfitKey} from './wardrobe-art.js';
import {retreatPainting} from './romantic-art.js';
import {ROMANCE as R} from './romantic-config.js';
import {flowerStage} from './romantic-model.js';
import {skyPalette,mix} from './sky-model.js';
export function warmRetreat(place,profile){if(place==='garden')return;for(const period of new Set(retreatPair(profile.scenery.clock,skyPalette(profile.scenery.clock).day).slice(0,2)))retreatBackground(place,period,profile)}
function retreatBackground(place,period,profile){const w=profile.romance;return cachedPainting(['retreat',place,period,w.theme,w.room.wallpaper,w.room.floor].join('/'),()=>retreatPainting(place,periodHour[period],w.theme,w.room))}
export class RomanticScene extends Phaser.Scene {
 constructor(profile,api){super('retreat');this.profile=profile;this.api=api}
 init({place}){this.place=place;this.v5Cats=new LakesideActors();this.elapsed=0;this.target=null;this.path=[];this.selected=null;this.facing=3;this.quiet=false;this.awaken=0;this.frameTime=0;this.lastPaint='';this.slow=0;this.editing=null;this.homePulse=[];this.homeTextureKeys=new Set();this.homeSprites=new Map();this.fixedSprites=[];this.fixedSignature='';this.seatFront=null;this.seatItem=null;this.cottageGift=null;this.gardenArt=null;this.gardenCatGoal=null;this.gardenCatPath=[]}
 preload(){preloadFlowers(this);if(this.place==='garden')preloadForest(this);if(this.place==='cabin')preloadCottage(this)}
 create(){
  if(!installFlowers(this)||this.place==='garden'&&!forestReady(this)){this.api.failed?.();return}
  if(this.place==='cabin')installCottage(this);if(['cabin','garden'].includes(this.place)){this.releaseViewport=portraitViewport(this);this.cameras.main.setZoom(this.sys.game.manorPixelScale||1);this.onHomeResize=()=>this.cameras.main.setZoom(this.sys.game.manorPixelScale||1);this.scale.on('resize',this.onHomeResize)}
  this.cameras.main.setBackgroundColor('#493e52');this.repaint();
  this.player=this.add.sprite(216,785,outfitKey(this.profile),13).setOrigin(.5,.85).setScale(CHARACTER.roomScale);
  this.equipment=new EquipmentLayer(this,this.profile);this.cat=this.place==='garden'?this.add.sprite(251,772,'daylight-cat',0).setOrigin(.5,41/48).setDisplaySize(30,30):this.add.image(251,772,'cat').setScale(1.1);this.groundShadow=this.add.graphics().setDepth(19);this.g=this.add.graphics().setDepth(35);this.pickups=new FlowerPickupEffects();this.pickupGraphics=this.add.graphics().setDepth(100);this.decorGraphics=this.add.graphics().setDepth(150);this.homeEffectGraphics=this.add.graphics().setDepth(110);this.syncHome();this.syncFixed();if(this.place==='cabin'){const safe=safeRoomPoint(this.roomItems(),this.player);this.player.setPosition(safe.x,safe.y)}this.meadow=this.place==='meadow'?new WindMeadow(432,850,{count:this.place==='meadow'?64:105,mask:this.place==='meadow'?(x,y)=>Math.abs(x-meadowPath(y).x)>meadowPath(y).width/2+7&&!(x>278&&x<393&&y>540&&y<622)&&!(x>55&&x<151&&y>614&&y<689):grassMask(this.background.texture.getSourceImage(),['#3d5557','#49645e','#617970']),minY:340,maxY:800,seed:407}):null;
  this.flowerPatches=this.place==='meadow'?MEADOW_FLOWERS.map((f,i)=>({flower:f.id,x:f.x,y:f.y,sprite:flowerSprite(this,f.id,f.x,f.y,46,32+(f.y-330)/480*28).setDepth(20+(f.y+9)*.01),phase:i*2.39})):[];this.gardenBlooms=[];
  this.v5Sprigs=this.place==='meadow'?new MeadowSprigs(this):null;this.cameras.main.setBounds(0,0,432,850);this.cameras.main.startFollow(this.player,true,.07,.07,0,40);this.cameras.main.fadeIn(500,35,35,53);this.fadeTimeout=setTimeout(()=>{if(this.sys.isActive())this.cameras.main.fadeEffect.reset()},700);
  this.keys=this.input.keyboard.createCursorKeys();this.extra=this.input.keyboard.addKeys('W,A,S,D');
  this.input.on('pointerdown',p=>{if(this.api.blocked())return;if(this.editing){this.editing.controller.down(p);return}if(this.quiet)return;const homeHit=this.place==='cabin'?this.props().filter(v=>v.id==='homeItem').sort((a,b)=>b.item.y-a.item.y).find(v=>{const f=furniture(v.item.type);return Math.abs(p.worldX-v.item.x)<f.w/2+4&&p.worldY>v.item.y-f.h&&p.worldY<v.item.y+10}):null;const fixedHit=this.place==='cabin'?[...this.fixedSprites,this.cottageGift].reverse().find(v=>v.getBounds().contains(p.worldX,p.worldY)):null;const flowerHit=this.flowerPatches.find(n=>{const at=n.sprite.getLocalPoint(p.worldX,p.worldY);return(this.textures.getPixelAlpha(at.x,at.y,n.sprite.texture.key)||0)>64});let hit=this.place==='garden'?this.gardenHit(p.worldX,p.worldY):null;hit=hit||(flowerHit?{id:'meadowFlower',flower:flowerHit.flower,x:flowerHit.x,y:flowerHit.y,title:'采下这朵花',d:0}:null)||homeHit||(fixedHit?this.props().find(v=>v.id===fixedHit.homeAction):null)||this.props().map(v=>({...v,d:Math.hypot(p.worldX-v.x,p.worldY-v.y)})).sort((a,b)=>a.d-b.d)[0];if(this.place==='meadow'&&p.worldY>334&&!(hit?.d<32)&&Math.abs(p.worldX-meadowPath(p.worldY).x)>meadowPath(p.worldY).width/2+5){hit={id:'meadowPick',x:p.worldX,y:p.worldY,title:MEADOW.pick,d:0}}if(homeHit||fixedHit||hit?.d<32){if(Math.hypot(hit.x-this.player.x,hit.y-this.player.y)<100)this.api.action(hit);else this.walkTo(this.standPoint(hit),hit)}else if(!this.blocked(p.worldX,p.worldY)){this.walkTo({x:p.worldX,y:p.worldY})}});
  this.input.on('pointermove',p=>{if(this.editing&&p.isDown&&!this.api.blocked())this.editing.controller.move(p)});this.input.on('pointerup',p=>this.editing?.controller.up(p));this.input.on('pointerupoutside',p=>this.editing?.controller.up(p));this.events.once('shutdown',()=>{this.editing?.controller.dispose();clearTimeout(this.fadeTimeout);if(this.onHomeResize)this.scale.off('resize',this.onHomeResize);this.releaseViewport?.();this.gardenArt?.destroy();this.gardenArt=null;this.v5Sprigs?.destroy();this.v5Cats.clear();this.homeSprites.clear();this.fixedSprites=[];this.flowerPatches=[];this.gardenBlooms=[];this.meadow=null;this.pickups=null;this.homePulse=[];this.background=this.blend=null;for(const key of this.homeTextureKeys)if(this.textures.exists(key))this.textures.remove(key);for(const k of ['retreat-night','retreat-morning','retreat-day','retreat-dusk'])if(this.textures.exists(k))this.textures.remove(k)});this.api.ready(this);
 }
 ensurePeriod(period){const texture='retreat-'+period;if(!this.textures.exists(texture))this.textures.addCanvas(texture,retreatBackground(this.place,period,this.profile));return texture}
 repaint(){
  if(this.place==='garden'){this.gardenArt??=new ForestGardenArt(this);this.lastPaint=this.paintKey();return}
  if(this.place==='cabin'){if(!this.background){const scale=432/this.textures.get('cottage-shell').getSourceImage().width;this.background=this.add.image(0,0,'cottage-shell').setOrigin(0).setScale(scale).setDepth(-3);const layer=(y,h,depth)=>this.add.image(0,0,'cottage-shell').setOrigin(0).setScale(scale).setCrop(0,y,this.background.width,h).setDepth(depth);this.cottageWall=layer(0,695,-2.9);this.cottageFloor=layer(695,920,-2.8);this.cottageSurface=this.add.tileSprite(216,555,382,432,'cottage-herringbone').setDepth(-2.75).setVisible(false);this.cottageSurface.setTileScale(.3);this.cottagePaper=[this.add.tileSprite(49,159,29,209,'cottage-floral'),this.add.tileSprite(383,159,29,209,'cottage-floral')];for(const panel of this.cottagePaper)panel.setTileScale(.24).setDepth(-2.75).setVisible(false);this.cottageGift=fitCottage(this.add.image(248,279,'cottage-giftClosed').setOrigin(.5,1),'giftClosed',{w:30,h:30}).setDepth(23.31);this.cottageGift.homeAction='gift';this.cottageGlass=this.add.image(0,0,'cottage-shell').setOrigin(0).setScale(scale).setCrop(255,180,380,350).setDepth(-2.7)}this.lastPaint=this.paintKey();return}
  this.background?.destroy();this.blend?.destroy();for(const period of Object.keys(periodHour))if(this.textures.exists('retreat-'+period))this.textures.remove('retreat-'+period);
  const [base,blend]=retreatPair(this.profile.scenery.clock,skyPalette(this.profile.scenery.clock).day);
  this.background=this.add.image(0,0,this.ensurePeriod(base)).setOrigin(0).setDepth(-3);this.blend=this.add.image(0,0,this.ensurePeriod(blend)).setOrigin(0).setDepth(-2);this.lastPaint=this.paintKey();
 }
 props(){if(this.place==='meadow')return[...MEADOW_FLOWERS.map(f=>({id:'meadowFlower',flower:f.id,x:f.x,y:f.y,title:'采一朵'+f.name})),{id:'meadowBench',x:341,y:600,title:MEADOW.bench},{id:'picnic',x:105,y:688,title:MEADOW.picnic},{id:'meadowPick',x:130,y:490,title:MEADOW.pick},{id:'meadowGate',x:216,y:799,title:MEADOW.back},{id:'cat',x:this.cat.x,y:this.cat.y,title:R.cat}];return this.place==='garden'?[
  {id:'tree',x:G.tree.x,y:G.tree.y,stand:G.tree.stand,title:R.tree},{id:'swing',x:G.swing.x,y:G.swing.y,stand:G.swing.stand,title:R.swing},{id:'pool',x:G.pond.x,y:G.pond.y,stand:G.pond.stand,title:R.lakeSit},
  ...G.secrets.map(v=>({...v,title:R.secrets[v.id].name})),
  ...this.profile.romance.beds.map((b,i)=>({id:'bed',index:i,x:G.beds[i].x,y:G.beds[i].y,stand:{x:G.beds[i].x,y:G.beds[i].y+36},title:flowerStage(b)===0?R.plant:flowerStage(b)===1?R.water:flowerStage(b)===4?R.harvest:R.growing})),
  {id:'meadowGate',...G.meadow,title:MEADOW.gate},{id:'exit',...G.exit,title:R.leave},{id:'cat',x:this.cat.x,y:this.cat.y,title:R.cat}
 ]:[{id:'window',x:216,y:348,title:R.seat},{id:'gift',x:248,y:338,title:R.gift},{id:'cat',x:this.cat.x,y:this.cat.y,title:R.cat},{id:'exit',x:216,y:798,title:R.leave},...this.roomItems().filter(item=>furniture(item.type).action).map(item=>({id:'homeItem',item,x:item.x,y:item.y+10,title:furniture(item.type).name}))]}
 gardenHit(x,y){const props=this.props(),pick=id=>({...props.find(p=>p.id===id),d:0});if(Math.hypot(x-G.secrets[0].x,y-G.secrets[0].y)<18)return pick('hollow');if(insidePolygon(x,y,G.pond.polygon))return pick('pool');if(x>176&&x<257&&y>165&&y<341)return pick('tree');if(x>337&&x<411&&y>411&&y<505)return pick('swing');const index=G.beds.findIndex(b=>Math.abs(x-b.x)<38&&y>b.y-20&&y<b.y+27);return index>=0?{...props.find(p=>p.id==='bed'&&p.index===index),d:0}:null}
 standPoint(p){if(p.stand)return p.stand;if(p.id==='homeItem'){const candidates=furnitureStandPoints(p.item).sort((a,b)=>Math.hypot(a.x-this.player.x,a.y-this.player.y)-Math.hypot(b.x-this.player.x,b.y-this.player.y));const point=candidates.find(q=>!this.blocked(q.x,q.y)&&retreatRoute(this.player,q,(x,y)=>this.blocked(x,y)).length);if(point)return point}if(p.id==='tree')return{x:215,y:310};if(p.id==='swing')return{x:356,y:569};return{x:Phaser.Math.Clamp(p.x,40,398),y:Phaser.Math.Clamp(p.y+27,this.place==='cabin'?355:290,795)}}
 blocked(x,y){if(this.place==='cabin'&&y<COTTAGE.floorY)return true;if(x<40||x>398||y<290||y>811)return true;if(this.place==='garden')return gardenBlocked(x,y);return this.place==='cabin'?cabinBlocked(x,y,this.roomItems()):y<330}
 nearest(){return this.props().map(p=>({...p,d:Math.hypot(p.x-this.player.x,p.y-this.player.y)})).filter(p=>p.d<80).sort((a,b)=>a.d-b.d)[0]}
 playerDepth(){return this.quiet&&this.seat==='home'&&this.seatItem?20+this.seatItem.y*.01+.01:20+(this.player.y+4)*.01}
 idle(){
  poseCharacter(this,{seated:this.quiet,facing:this.quiet&&['window','meadowBench','pool'].includes(this.seat)?3:this.facing,scale:this.place==='meadow'?(this.player.scaleX||CHARACTER.roomScale):CHARACTER.roomScale});
  this.player.setDepth(this.playerDepth());
 }
 stopMoving(){this.target=null;this.path=[];this.selected=null;controls.x=controls.y=0;this.input.keyboard.resetKeys();this.idle()}
 walkTo(point,selected=null){const path=retreatRoute(this.player,point,(x,y)=>this.blocked(x,y));this.stopMoving();this.target=path.shift()||null;this.path=path;this.selected=this.target?selected:null}
 sit(kind,point=null){if(this.place==='cabin'&&kind==='sofa'){point=this.roomItems().find(i=>i.type==='sofa'||i.type==='vintageSofa');if(!point)return;kind='home'}this.seatReturn={x:this.player.x,y:this.player.y};this.stopMoving();this.quiet=true;this.seat=kind;this.seatItem=point;this.facing=kind==='window'?3:0;const pos=kind==='hearth'?safeRoomPoint(this.roomItems(),{x:point.x+45,y:point.y+15}):kind==='home'?{x:point.x,y:point.y-10}:kind==='meadowBench'?{x:341,y:566}:kind==='picnic'?{x:108,y:655}:kind==='swing'?{x:G.swing.x,y:G.swing.y+16}:kind==='window'?{x:207,y:327}:kind==='pool'?{...G.pond.stand}:kind==='fire'?{x:115,y:341}:{x:73,y:435};this.player.setPosition(pos.x,pos.y);this.idle();this.api.near(null);this.cameras.main.stopFollow();this.cameras.main.pan(216,['home','hearth'].includes(kind)?point.y-80:this.place==='meadow'?530:kind==='swing'?G.swing.y-35:kind==='pool'?G.pond.y:340,2200,'Sine.easeInOut')}
 stand(){this.seatFront?.destroy();this.seatFront=null;this.quiet=false;this.stopMoving();if(this.place==='garden'||['home','hearth','meadowBench','picnic'].includes(this.seat))this.player.setPosition(this.seatReturn.x,this.seatReturn.y);else this.player.setPosition(this.place==='garden'?this.seat==='swing'?356:270:216,this.place==='garden'?this.seat==='swing'?572:340:354);this.cameras.main.panEffect.reset();this.cameras.main.startFollow(this.player,true,.07,.07,0,40);this.api.near(this.nearest())}
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
  if(Math.hypot(this.player.x-oldX,this.player.y-oldY)>.001)poseCharacter(this,{moving:true,scale:this.place==='meadow'?this.player.scaleX:CHARACTER.roomScale});
  else{if(this.target){this.target=null;this.path=[];this.selected=null}this.idle()}
 }

 paintKey(){const w=this.profile.romance,r=this.editing?.controller.room||w.room;return[w.theme,r.wallpaper,r.floor].join('/')}
 homeTexture(item){if(this.place==='cabin')return 'cottage-'+(item.type==='floralWall'?'floral':item.type==='vase'?'vaseEmpty':item.type==='laceDrape'&&!item.on?'laceDrapeClosed':item.type==='candles'&&!item.on?'candlesOff':item.artType||item.type);const w=this.profile.romance,key=['home',item.type,w.theme,item.type==='vase'?w.room.bouquet+'-'+(homeBouquet(this.profile)?.id||0):'plain',item.on?1:0].join('-');if(!this.textures.exists(key)){this.textures.addCanvas(key,furnitureCanvas(item.type,w.theme,w.room.bouquet,item.on,homeBouquet(this.profile)));this.homeTextureKeys.add(key)}return key}
 roomItems(){return this.editing?.controller.room.items||this.profile.romance.room.items}
 syncFixed(){} // Former fixtures are now normal, movable, independently saved instances.
 syncHome(){
  if(this.place!=='cabin')return;const items=this.roomItems();
  for(const [id,image]of this.homeSprites)if(!items.some(i=>i.id===id)){image.sprays?.forEach(v=>v.destroy());image.destroy();this.homeSprites.delete(id)}
  for(const item of items){const f=furniture(item.type);let image=this.homeSprites.get(item.id);if(!image){image=this.add.image(item.x,item.y,this.homeTexture(item)).setOrigin(.5,1);this.homeSprites.set(item.id,image)}image.setTexture(this.homeTexture(item));fitCottage(image,item.type);image.setPosition(item.x,item.y).setFlipX(item.flip).setDepth(f.layer==='rug'?-1+items.indexOf(item)*.00001:f.layer==='wall'?-.5:20+item.y*.01).setVisible(true).setAlpha(this.editing?.item?.id===item.id ? .82 : 1);image.homeInstance=item.id;cottageFlowers(this,image,item,homeBouquet(this.profile),true)}
 }
 updatePlacement(){this.editing?.controller.draw()}
 endPlacement(){if(!this.editing)return;this.editing=null;this.decorGraphics.clear();this.syncHome();const safe=safeRoomPoint(this.profile.romance.room.items,this.player);this.player.setPosition(safe.x,safe.y);this.player.setVisible(true);this.cat.setVisible(true);this.stopMoving();const c=this.cameras.main;c.panEffect.reset();c.setZoom(this.sys.game.manorPixelScale||1).setBounds(0,0,432,850).startFollow(this.player,true,.07,.07,0,40)}
 touchHome(type){this.homePulse.push({type,at:this.elapsed});if(this.homePulse.length>6)this.homePulse.shift()}
 drawHome(rect,ellipse,a,t,reduced){
  const items=this.roomItems();
  for(const item of items){if(!furniture(item.type).layer)ellipse(item.x,item.y-1,furniture(item.type).footW,5,'#493b51',.12);
   if(item.on&&['lamp','candles','berryLamp','starProjector','glassCabinet'].includes(item.type)&&!reduced){const y=item.y-furniture(item.type).h+19,breath=this.profile.romance.reducedMotion?1:.92+Math.sin(t*1.4+item.x)*.08;ellipse(item.x,y,72,70,'#ffe1a6',.045*breath);ellipse(item.x,item.y-2,68,28,'#f6d4a6',.035)}
   if(item.type==='tea'&&item.on)for(let i=0;i<(reduced?2:3);i++){const q=(t*.28+i*.31)%1;ellipse(item.x-1+Math.sin(q*5+i)*3,item.y-35-q*16,2+q*3,2+q*4,'#fff0da',Math.sin(q*Math.PI)*.23)}
   if(item.type==='record'&&item.on){rect(item.x-5+Math.sin(t*2)*5,item.y-21,1,1,'#f5d6b7')}
  }
  const g=this.homeEffectGraphics;g.clear();for(const lamp of items.filter(i=>i.type==='starProjector'&&i.on)){g.fillStyle(0xa5bedb,.07);g.fillEllipse(lamp.x-20,lamp.y+15,116,68);const points=[[-53,8],[-35,-7],[-12,4],[2,22],[-23,36]];for(let i=0;i<points.length;i++){const [x,y]=points[i],alpha=.36+(reduced?0:Math.sin(t*.5+i)*.07);g.fillStyle(0xdcd2ed,alpha);g.fillRect(lamp.x+x-2,lamp.y+y,5,1);g.fillRect(lamp.x+x,lamp.y+y-2,1,5);if(i){g.lineStyle(1,0xb5badc,.14);g.lineBetween(lamp.x+points[i-1][0],lamp.y+points[i-1][1],lamp.x+x,lamp.y+y)}}}this.homePulse=this.homePulse.filter(p=>this.elapsed-p.at<1.6);
  for(const pulse of this.homePulse){const item=items.find(i=>i.id===pulse.type||i.type===pulse.type);if(!item)continue;const age=this.elapsed-pulse.at;for(let i=0;i<(reduced?5:10);i++){const angle=i*2.4,spread=4+age*15;g.fillStyle(item.type==='plant'?0xc0dedb:0xf1dbb0,(1-age/1.6)*.8);g.fillRect(item.x+Math.cos(angle)*spread,item.y-furniture(item.type).h*.6+Math.sin(angle)*spread*.5-age*10,2,2)}}
 }
 meadowPickup(kind){this.pickups.emit(kind,this.player.x-12,this.player.y-20,{x:this.player.x+10,y:this.player.y-28});this.meadowPulse=this.elapsed}
 drawMeadow(rect,ellipse,a,t,reduced){
  if(a.night>.1)for(let i=0;i<20;i++)rect(20+i*67%390,34+i*31%148,1,1,'#eee2d3',a.night*starTwinkle(t,i*1.71,.3+i%4*.1));
  for(let i=0;i<(reduced?15:32);i++){const x=20+i*73%390,y=345+i*89%468,bend=this.profile.romance.reducedMotion?0:Math.sin(t*.7+i*2.3)*2,near=Math.max(0,1-Math.hypot(this.player.x-x,this.player.y-y)/45);rect(x+bend+near*3,y-9,1,9,'#91ab8f',.65);ellipse(x+bend+near*3,y-12,5,4,i%3?'#d7b5d0':'#f0dfd0',.8)}
  for(let i=0;i<(reduced?3:6);i++){const x=86+Math.sin(t*.23+i*2.8)*61+i*32,y=415+Math.cos(t*.4+i)*37;rect(x,y,1,3,'#8f8097');ellipse(x-2,y+Math.sin(t*6+i),4,3,i%2?'#eac8d6':'#f5dfbd');ellipse(x+2,y,4,3,'#d6c5e0')}
  if(a.night>.2)for(let i=0;i<(reduced?6:16);i++){const x=30+i*83%374+Math.sin(t*.3+i)*7,y=380+i*71%380+Math.sin(t*.4+i)*4,alpha=a.night*(.1+.7*Math.sin(t*.5+i*1.9)**6);rect(x,y,1,1,'#f1e9b7',alpha)}
  if(this.meadowPulse&&this.elapsed-this.meadowPulse<2){const q=(this.elapsed-this.meadowPulse)/2;for(let i=0;i<12;i++){const angle=i*.524+t;ellipse(this.player.x+Math.cos(angle)*(10+q*25),this.player.y-14+Math.sin(angle)*12-q*8,3,2,i%2?'#edc4d5':'#eadcc8',(1-q)*.8)}}
 }

 flowerPickup(kind,index){this.pickups.emit(kind,G.beds[index].x,G.beds[index].y-17,{x:this.player.x+10,y:this.player.y-28})}
 update(time,delta){
  if(document.hidden||this.api.blocked()){this.stopMoving();return;}const dt=Math.min(delta,60)/1000;this.elapsed+=dt;const w=this.profile.romance;
  if(this.quiet||this.editing)this.idle();else{this.movePlayer(dt);if(!this.quiet&&!this.api.blocked())this.api.near(this.nearest())}
  if(delta>45)this.slow++;else this.slow=Math.max(0,this.slow-.25);const reduced=this.profile.scenery.lowEffects||this.slow>100;this.pickups.update(dt,{reduced,still:w.reducedMotion});this.meadow?.update(dt,{reduced,still:w.reducedMotion});this.frameTime+=dt;if(this.frameTime<1/(reduced?16:30))return;this.frameTime=0;
  if(this.paintKey()!==this.lastPaint)this.repaint();this.syncHome();this.syncFixed();this.updatePlacement();const a=skyPalette(this.profile.scenery.clock),day=a.day,t=w.reducedMotion?0:this.elapsed;const [basePeriod,blendPeriod,lightAlpha]=retreatPair(this.profile.scenery.clock,day);if(this.place==='cabin')cottageLighting(this,day);else if(this.place==='garden')this.gardenArt.setPeriod(this.profile.scenery.clock);else{this.background.setTexture(this.ensurePeriod(basePeriod));this.blend.setTexture(this.ensurePeriod(blendPeriod)).setAlpha(lightAlpha)}
  if(this.place==='cabin'){const lamps=this.roomItems().filter(item=>item.on&&['lamp','candles','berryLamp','starProjector','glassCabinet'].includes(item.type));for(const item of this.roomItems()){const image=this.homeSprites.get(item.id);let warm=0;for(const lamp of lamps)warm=Math.max(warm,Math.max(0,1-Math.hypot(item.x-lamp.x,item.y-lamp.y)/140));image?.setTint(parseInt(mix(mix('#c6bed0','#f3dcc4',warm*.45),'#fff6e6',day).slice(1),16))}}this.player.setDepth(this.playerDepth());this.cat.setDepth(20+(this.cat.y+(this.place==='garden'?3:13))*.01);this.v5Sprigs?.update(t,this.profile.scenery.clock,w.reducedMotion);const g=this.g;g.clear();const rect=(x,y,ww,hh,col,alpha=1)=>{g.fillStyle(parseInt(col.slice(1),16),alpha);g.fillRect(Math.round(x),Math.round(y),ww,hh)},ellipse=(x,y,ww,hh,col,alpha=1)=>{g.fillStyle(parseInt(col.slice(1),16),alpha);g.fillEllipse(x,y,ww,hh)};
  this.meadow?.draw(rect,{day,player:this.player});const fg=this.pickupGraphics;fg.clear();this.pickups.draw((x,y,w,h,color,alpha)=>{fg.fillStyle(parseInt(color.slice(1),16),alpha);fg.fillRect(Math.round(x),Math.round(y),w,h)});
  this.groundShadow.clear().fillStyle(0x384955,.16).fillEllipse(this.player.x+2,this.place==='garden'&&this.quiet&&this.seat==='swing'?G.swing.stand.y:this.player.y+3,20*this.player.scaleX/CHARACTER.roomScale,5).fillEllipse(this.cat.x+2,this.cat.y+(this.place==='garden'?3:15),this.place==='garden'?17:25,4);
  // The cat is always safe. It follows, chases a butterfly, stretches, then naps.
  const cycle=t%47,follow=(w.catFollow||this.profile.play.equipment.companion==='catbell')&&!this.quiet;
  const catBed=this.place==='cabin'?w.room.items.find(i=>i.type==='catBed'&&i.on):null;const cx=catBed&&!follow&&cycle>20?catBed.x:follow?this.player.x+30:this.place==='cabin'?cycle<14?255:325:this.place==='meadow'?this.quiet?this.player.x+30:cycle<20?330:112:cycle<15?286+Math.sin(t*.6)*23:254;
  const cy=catBed&&!follow&&cycle>20?catBed.y-12:follow?this.player.y-12:this.place==='cabin'?cycle<14?249:714:this.place==='meadow'?this.quiet?this.player.y+12:cycle<20?597:677:cycle<15?362+Math.cos(t*.5)*13:338;
  if(this.place==='garden'){
   let goal=follow?[{x:this.player.x+27,y:this.player.y-4},{x:this.player.x-27,y:this.player.y-4},{x:this.player.x,y:this.player.y+24}].find(p=>!this.blocked(p.x,p.y)):cycle<20?{x:266,y:559}:{x:238,y:654};goal??={x:251,y:710};
   if(!this.gardenCatGoal||Math.hypot(goal.x-this.gardenCatGoal.x,goal.y-this.gardenCatGoal.y)>14){this.gardenCatGoal=goal;this.gardenCatPath=retreatRoute(this.cat,goal,(x,y)=>this.blocked(x,y))}
   const next=this.gardenCatPath?.[0],dx=next?next.x-this.cat.x:0,dy=next?next.y-this.cat.y:0,distance=Math.hypot(dx,dy),step=Math.min(distance,follow?3.5:1.5);if(next&&distance<2)this.gardenCatPath.shift();if(distance>.1){this.cat.x+=dx/distance*step;this.cat.y+=dy/distance*step}
   const facing=Math.abs(dx)>Math.abs(dy)?dx<0?1:2:dy<0?3:0,moving=distance>1;this.cat.setTexture('daylight-cat',moving?(Math.floor(t*7)%2?4:8)+facing:facing).setDisplaySize(30,30).setDepth(20+(this.cat.y+3)*.01);
  }else{
  this.cat.x+=(cx-this.cat.x)*.065;this.cat.y+=(cy-this.cat.y)*.065;
  const sleep=!follow&&(this.quiet||cycle>28),stretch=!sleep&&cycle>23&&cycle<28?Math.sin((cycle-23)/5*Math.PI):0;
  const perspective=this.place==='meadow'?.45+Math.max(0,Math.min(1,(this.cat.y-310)/500))*.55:1;this.cat.setTexture(sleep?'cat-sleep':'cat').setScale((1.1+stretch*.2)*perspective,(sleep?.8+Math.sin(t)*.008:1.1-stretch*.3)*perspective);if(this.place==='meadow')this.player.setScale((.55+Math.max(0,Math.min(1,(this.player.y-330)/480))*.7)*.6);const catPeriod=v5Period(this.profile.scenery.clock),catPose=sleep?'sleep':stretch>.2?'stretch':'sit',catTexture='v5-cat-'+catPeriod+'-'+catPose;if(!this.textures.exists(catTexture)){this.textures.addCanvas(catTexture,this.v5Cats.cat(catPeriod,catPose));this.homeTextureKeys.add(catTexture)}this.cat.setTexture(catTexture).setDisplaySize((37+stretch*4)*perspective,(26-stretch*2)*perspective);
  }
  for(const p of this.flowerPatches){p.sprite.setTint(a.day>.4?0xffffff:a.day>.1?0xe9c8c0:0x99acc5);p.sprite.rotation=w.reducedMotion?0:Math.sin(t*.6+p.phase)*.012}
  if(this.place==='meadow'){this.drawMeadow(rect,ellipse,a,t,reduced)}else if(this.place==='garden'){
   this.gardenArt.update(t,reduced,w.reducedMotion);
  }else{
   this.drawHome(rect,ellipse,a,t,reduced);
   // A handful of moving hearth pixels cast local warm light across the floor.
   for(const fire of this.roomItems().filter(i=>i.type==='fireplace')){for(let i=0;i<6;i++){const flame=4+Math.sin(t*4+i*2)*2;rect(fire.x-18+i*5,fire.y-15-flame,2,flame,i%2?'#efb77c':'#e38e72')}if(!reduced){ellipse(fire.x,fire.y-14,100,68,'#f7bd87',.055);ellipse(fire.x,fire.y+7,143,80,'#f1c18f',.04)}}
   if(a.night>.05)for(let i=0;i<24;i++){const x=140+i*47%151,y=90+i*19%66;if((this.place==='cabin'?cottageWindow(x,y):v5WindowContains(x,y)))rect(x,y,1,1,i%4?'#e5d9e7':'#f4d9b3',a.night*starTwinkle(t,i*1.73,.2+i%5*.1))}
   // Window glass is the only weather area inside; rain never falls through the roof.
   if(w.weather==='rain')for(let i=0;i<(reduced?18:42);i++){const x=134+i*37%163,y=83+(i*29+t*90)%135;if(cottageWindow(x,y+5))rect(x,y,1,5,'#c1c8da',.5)}
   if(w.weather==='snow')for(let i=0;i<(reduced?10:25);i++){const x=134+(i*37+Math.sin(t*.3+i)*4)%162,y=83+(i*29+t*7)%135;if(cottageWindow(x,y+2))rect(x,y,2,2,'#f5e8df',.7)}
   if(w.rainStoppedAt&&Date.now()-w.rainStoppedAt<180000&&w.weather==='clear'){g.lineStyle(2,0xd8a6ba,.35);g.beginPath();g.arc(218,151,48,Math.PI,Math.PI*2);g.strokePath();g.lineStyle(2,0xe5d1ac,.3);g.beginPath();g.arc(218,151,44,Math.PI,Math.PI*2);g.strokePath()}
   if(w.personalStar&&w.starPlace==='room'){rect(271,119,2,14,'#fae8bd');rect(266,125,12,2,'#fae8bd');ellipse(272,126,25,25,'#f9d4a7',.085)}

   // Morning window rays are clipped to the room floor instead of tinting the frame.
   if(day>.3&&!reduced){g.fillStyle(0xffe6b3,.035*day);g.fillTriangle(139,236,150,510,243,510);g.fillTriangle(284,236,286,472,372,472)}
  }
  // Finite deterministic petal pool, slow and not synchronized with tree sway.
  if(this.place!=='garden'&&!w.reducedMotion)for(let i=0;i<(reduced?7:18);i++){const x=24+((i*73+t*(2+i%3))%384),y=this.place!=='cabin'?175+(i*47+t*(4+i%4))%620:290+(i*37-t*1.3+520)%480;rect(x+Math.sin(t*.7+i)*7,y,i%4?2:3,1,this.place!=='cabin'?'#e3b2c9':'#f2d6b2',this.place!=='cabin'?.5:.22)}
  this.player.setDepth(this.playerDepth());this.cat.setDepth(20+(this.cat.y+(this.place==='garden'?3:13))*.01);if(this.quiet&&this.seat==='home'&&this.seatItem){const item=this.seatItem;if(!this.seatFront){this.seatFront=this.add.image(item.x,item.y,this.homeTexture(item)).setOrigin(.5,1).setFlipX(item.flip);const f=furniture(item.type),cut=Math.round(f.h*.68);if(this.place==='cabin'){fitCottage(this.seatFront,item.type);const im=this.seatFront.texture.getSourceImage();const from=Math.round(im.height*.7);this.seatFront.setCrop(0,from,im.width,im.height-from)}else this.seatFront.setCrop(0,cut,f.w,f.h-cut)}this.seatFront.setDepth(this.player.depth+.01);if(item.type==='flowerSwing'&&!w.reducedMotion){const sway=Math.sin(this.elapsed*.65)*1.3;this.homeSprites.get(item.id)?.setX(item.x+sway);this.player.x=item.x+sway;this.seatFront.x=item.x+sway}}g.setDepth(this.place==='cabin'?35:18);
 }
}
