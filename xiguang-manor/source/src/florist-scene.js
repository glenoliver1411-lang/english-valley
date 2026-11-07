import {preloadFlowers,installFlowers} from './flower-art.js';
import {EquipmentLayer} from './equipment-layer.js';
import Phaser from 'phaser';
import {controls} from './game.js';
import {outfitKey} from './wardrobe-art.js';
import {preloadFlorist,originalFloristArt,floristArtReady} from './florist-art.js';
import {FLORIST as F,floristBlocked,floristRoute,frontAt} from './florist-layout.js';

export class FloristScene extends Phaser.Scene{
 constructor(profile,api){super('florist');this.profile=profile;this.api=api}
 preload(){preloadFlorist(this);preloadFlowers(this)}
 create(){
  if(!floristArtReady(this)||!installFlowers(this)){this.api.failed();return}
  this.target=null;this.path=[];this.selected=null;this.facing=0;this.overview=false;this.entering=true;this.canvasRestored=false;
  const game=this.sys.game;this.previousPixelScale=game.manorPixelScale||1;
  const oldHeight=this.scale.gameSize.height/this.previousPixelScale;
  game.manorPixelScale=Math.min(2,Math.max(1,window.devicePixelRatio||1));
  this.scale.setGameSize(Math.round(432*game.manorPixelScale),Math.round(oldHeight*game.manorPixelScale));
  this.cameras.main.setBackgroundColor('#242134');
  const art=originalFloristArt(this);this.background=art.base;this.layers=art.layers;
  this.shadow=this.add.ellipse(F.spawn.x-9,F.spawn.y+8,53,14,0x443542,.19).setDepth(90);
  this.player=this.add.sprite(F.spawn.x,F.spawn.y,outfitKey(this.profile),0).setOrigin(.5,.85).setScale(F.actorScale).setTint(0xfff0de).setDepth(100);
  this.equipment=new EquipmentLayer(this,this.profile);this.props=F.stations;
  this.keys=this.input.keyboard.createCursorKeys();this.extra=this.input.keyboard.addKeys('W,A,S,D');this.input.keyboard.on('keydown-E',()=>this.api.interact());
  this.input.on('pointerdown',p=>{
   if(this.api.blocked()||document.querySelector('.device').classList.contains('manor-clean'))return;if(this.entering)this.finishEntrance();const world=this.cameras.main.getWorldPoint(p.x,p.y);
   if(this.overview){this.setOverview(false);return}
   const hit=this.props.map(v=>({...v,d:Math.hypot(world.x-v.x,world.y-v.y)})).filter(v=>v.d<v.hit).sort((a,b)=>a.d-b.d)[0];
   if(hit)this.approach(hit.id);else if(!this.blocked(world.x,world.y))this.walkTo({x:world.x,y:world.y});
  });
  this.scale.on('resize',this.resizeCamera,this);this.resizeCamera();this.updateOcclusion();
  this.events.once('shutdown',()=>{
   this.scale.off('resize',this.resizeCamera,this);this.target=null;this.path=[];this.selected=null;controls.x=controls.y=0;this.api.near(null);
   this.restoreCanvas();
  });
  this.api.ready(this);
  const still=this.profile.romance.reducedMotion||this.profile.scenery.lowEffects;
  if(still){this.entering=false;this.followPlayer()}else{
   const c=this.cameras.main;c.stopFollow();c.useBounds=false;c.setZoom(this.fitZoom);c.centerOn(F.width/2,F.height/2);
   this.time.delayedCall(1000,()=>{if(!this.entering)return;c.zoomTo(this.exploreZoom,1300,'Sine.easeInOut');c.pan(this.followCenterX(),F.height/2,1300,'Sine.easeInOut');this.time.delayedCall(1350,()=>{if(this.entering)this.finishEntrance()})});
  }
 }
 restoreCanvas(){if(this.canvasRestored!==false)return;this.canvasRestored=true;const game=this.sys.game,height=this.scale.gameSize.height/(game.manorPixelScale||1);game.manorPixelScale=this.previousPixelScale;this.scale.setGameSize(Math.round(432*this.previousPixelScale),Math.round(height*this.previousPixelScale))}
 resizeCamera(){
  const c=this.cameras.main,w=this.scale.gameSize.width,h=this.scale.gameSize.height;
  c.setBounds(-36,-24,F.width+72,F.height+48);this.fitZoom=Math.min(w/(F.width+24),h/(F.height+24));
  this.exploreZoom=Math.max(w/F.width*1.55,h/F.height*.89);
  if(this.overview){c.useBounds=false;c.setZoom(this.fitZoom);c.centerOn(F.width/2,F.height/2)}else if(!this.entering)this.followPlayer();
 }
 finishEntrance(){this.entering=false;this.cameras.main.panEffect.reset();this.cameras.main.zoomEffect.reset();this.followPlayer()}
 followCenterX(){return Phaser.Math.Clamp(this.player.x,F.width*.34,F.width*.70)}
 followPlayer(){const c=this.cameras.main;c.useBounds=true;c.setZoom(this.exploreZoom);c.startFollow(this.player,true,.075,.075,0,-(F.height/2-this.player.y));}
 setOverview(on){
  if(this.entering)this.finishEntrance();this.stopMoving();this.overview=on;const c=this.cameras.main;c.stopFollow();c.panEffect.reset();c.zoomEffect.reset();
  if(on){c.useBounds=false;c.setZoom(this.fitZoom);c.centerOn(F.width/2,F.height/2)}else this.followPlayer();this.api.overview?.(on);
 }
 blocked(x,y){return floristBlocked(x,y)}
 idle(){this.player.stop();this.player.setFrame(this.facing*4)}
 stopMoving(){this.target=null;this.path=[];this.selected=null;controls.x=controls.y=0;if(this.player)this.idle()}
 walkTo(point,selected=null){const route=floristRoute(this.player,point);this.stopMoving();if(!route.length)return false;this.target=route.shift();this.path=route;this.selected=selected;return true}
 approach(id){
  const station=this.props.find(p=>p.id===id);if(!station)return;if(this.entering)this.finishEntrance();
  if(this.overview)this.setOverview(false);
  const choices=station.approaches.map(p=>({p,route:floristRoute(this.player,p)})).filter(v=>v.route.length).sort((a,b)=>a.route.length-b.route.length||Math.hypot(a.p.x-this.player.x,a.p.y-this.player.y)-Math.hypot(b.p.x-this.player.x,b.p.y-this.player.y));
  if(choices.length)this.walkTo(choices[0].p,station);
 }
 nearest(){if(this.entering||this.overview)return null;return this.props.map(p=>({...p,d:Math.min(...p.approaches.map(q=>Math.hypot(q.x-this.player.x,q.y-this.player.y)))})).filter(p=>p.d<78).sort((a,b)=>a.d-b.d)[0]||null}
 updateOcclusion(){
  const p=this.player;
  for(const f of this.layers){const overlap=p.x+48>f.x&&p.x-48<f.x+f.w&&p.y>f.y&&p.y-112<f.y+f.h;const behind=p.y<frontAt(f.foot,p.x);f.image.setDepth(behind?200:10);f.image.setAlpha(overlap&&behind?.86:1)}
 }
 update(_,delta){
  if(!this.player)return;if(document.hidden||this.api.blocked()||this.entering){this.idle();return}
  const dt=Math.min(delta,60)/1000;
  let dx=controls.x+(this.keys.right.isDown||this.extra.D.isDown?1:0)-(this.keys.left.isDown||this.extra.A.isDown?1:0),dy=controls.y+(this.keys.down.isDown||this.extra.S.isDown?1:0)-(this.keys.up.isDown||this.extra.W.isDown?1:0);
  if((dx||dy)&&this.overview)this.setOverview(false);
  if(dx||dy){this.target=null;this.path=[];this.selected=null}else if(this.target){dx=this.target.x-this.player.x;dy=this.target.y-this.player.y;if(Math.hypot(dx,dy)<4){this.player.setPosition(this.target.x,this.target.y);this.target=this.path.shift()||null;if(this.target){dx=this.target.x-this.player.x;dy=this.target.y-this.player.y}else{const selected=this.selected;this.selected=null;this.idle();if(selected)this.api.action(selected.id);dx=dy=0}}}
  const len=Math.hypot(dx,dy);
  if(len>.05&&!this.overview){const before={x:this.player.x,y:this.player.y},step=this.target?Math.min(F.speed*dt,len):F.speed*dt;dx/=Math.max(1,len);dy/=Math.max(1,len);if(!this.blocked(this.player.x+dx*step,this.player.y))this.player.x+=dx*step;if(!this.blocked(this.player.x,this.player.y+dy*step))this.player.y+=dy*step;this.facing=Math.abs(dx)>Math.abs(dy)?dx<0?1:2:dy<0?3:0;if(Math.hypot(before.x-this.player.x,before.y-this.player.y)>.01)this.player.play(`dress-${this.profile.wardrobe.equipped}-${this.facing}`,true);else this.stopMoving()}else this.idle();
  this.shadow.setPosition(this.player.x-9,this.player.y+8);this.updateOcclusion();this.api.near(this.nearest());
 }
}
