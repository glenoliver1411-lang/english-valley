import Phaser from 'phaser';
import {controls} from './game.js';
import {outfitKey} from './wardrobe-art.js';
import {EquipmentLayer} from './equipment-layer.js';
import {portraitViewport} from './portrait-viewport.js';
import {REGION as R} from './world-region-config.js';
import {preloadWorldRegion,installWorldRegion,regionSprite,regionWindow} from './world-region-art.js';
import {worldNavigation,readWorldPose} from './world-navigation.js';
import map from './assets/world/rose-court.json';
import {FlowerPickupEffects} from './flower-effects.js';

const color=(a,b,t)=>{const A=Phaser.Display.Color.IntegerToColor(a),B=Phaser.Display.Color.IntegerToColor(b),c=Phaser.Display.Color.Interpolate.ColorWithColor(A,B,1,t);return Phaser.Display.Color.GetColor(c.r,c.g,c.b)};
export class WorldRegionScene extends Phaser.Scene{
 constructor(profile,api){super('world-region');this.profile=profile;this.api=api}
 preload(){preloadWorldRegion(this)}
 create(){
  if(!installWorldRegion(this)){this.api.failed();return}
  this.releaseViewport=portraitViewport(this);this.nav=worldNavigation(map);this.elapsed=0;this.target=null;this.path=[];this.selected=null;this.facing=0;this.quiet=false;this.overview=false;
  const pose=this.api.returnPoint||readWorldPose(),start=pose&&!this.nav.blocked(pose.x,pose.y)?pose:map.spawn;
  this.ground=this.add.image(0,0,'world-hd-terrain').setOrigin(0).setScale(map.terrain.scale).setDepth(-1000);
  this.nodes=map.objects.map(o=>{const sprite=regionSprite(this,o);let shadow;if(['building','tree'].includes(o.kind))shadow=this.add.image(o.x+13,o.y+7,sprite.texture.key,o.frame).setOrigin(.5,1).setScale(sprite.scaleX,sprite.scaleX*.13).setAngle(-17).setTint(0x294732).setAlpha(.16).setDepth(-990);const emission=o.kind==='building'?regionWindow(this,o):null;return{o,sprite,shadow,emission,scale:sprite.scaleX}});
  this.contact=this.add.ellipse(start.x,start.y+4,31,9,0x354631,.24).setDepth(-2);
  this.player=this.add.sprite(start.x,start.y,outfitKey(this.profile),0).setOrigin(.5,.85).setScale(2).setDepth(start.y+.1);
  this.cat=this.add.image(820,1530,'cat').setScale(1.7).setDepth(1530);
  this.equipment=new EquipmentLayer(this,this.profile);
  this.light=this.add.graphics().setDepth(-980);this.water=this.add.graphics().setDepth(1300.03);
  this.pickups=new FlowerPickupEffects();this.pickupGraphics=this.add.graphics().setDepth(3000);
  this.keys=this.input.keyboard.createCursorKeys();this.extra=this.input.keyboard.addKeys('W,A,S,D');this.input.keyboard.on('keydown-E',()=>this.api.interact());
  this.input.on('pointerdown',p=>{
   if(this.api.blocked()||document.body.classList.contains('manor-clean'))return;
   if(this.quiet){this.stand();return}
   const q=this.cameras.main.getWorldPoint(p.x,p.y);if(this.overview)this.setOverview(false);
   if(Math.hypot(q.x-this.cat.x,q.y-this.cat.y)<44){this.api.action({id:'cat',kind:'cat'});return}
   const hit=this.nodes.filter(n=>n.sprite.getBounds().contains(q.x,q.y)).sort((a,b)=>b.o.y-a.o.y).map(n=>map.interactions.find(v=>v.object===n.o.id)).find(Boolean)||map.interactions.filter(v=>Math.hypot(q.x-v.x,q.y-v.y)<65).sort((a,b)=>Math.hypot(q.x-a.x,q.y-a.y)-Math.hypot(q.x-b.x,q.y-b.y))[0];
   if(hit)this.approach(hit);else if(!this.blocked(q.x,q.y))this.walkTo(q);
  });
  this.resizeCamera();this.scale.on('resize',this.resizeCamera,this);this.follow();this.currentLight=R.periods[0];this.phaseSignature='';this.updateLighting(true);
  this.events.once('shutdown',()=>{this.scale.off('resize',this.resizeCamera,this);controls.x=controls.y=0;this.target=null;this.path=[];this.api.near(null);this.releaseViewport()});
  this.api.ready(this);
 }
 resizeCamera(){const c=this.cameras.main,w=this.scale.gameSize.width,h=this.scale.gameSize.height;c.setBounds(0,0,map.width,map.height);this.fitZoom=Math.min(w/(map.width+24),h/(map.height+24));this.exploreZoom=w/800;if(this.overview){c.useBounds=false;c.setZoom(this.fitZoom);c.centerOn(map.width/2,map.height/2)}else this.follow()}
 follow(){if(!this.player)return;const c=this.cameras.main;c.useBounds=true;c.setZoom(this.exploreZoom);c.startFollow(this.player,true,.1,.1,0,110)}
 setOverview(on){this.stopMoving();this.overview=on;const c=this.cameras.main;c.stopFollow();if(on){c.useBounds=false;c.setZoom(this.fitZoom);c.centerOn(map.width/2,map.height/2)}else this.follow();this.api.overview(on)}
 blocked(x,y){return this.nav.blocked(x,y)}
 idle(){if(!this.player)return;this.player.stop();if(this.quiet){if(this.player.texture.key!=='world-hd-seated'||this.player.frame.name!==this.profile.wardrobe.equipped)this.player.setTexture('world-hd-seated',this.profile.wardrobe.equipped);this.player.setDepth(1660.1)}else{const key=outfitKey(this.profile);if(this.player.texture.key!==key||this.player.frame.name!==this.facing*4)this.player.setTexture(key,this.facing*4);this.player.setDepth(this.player.y+.1)}}
 stopMoving(){this.target=null;this.path=[];this.selected=null;controls.x=controls.y=0;this.idle()}
 walkTo(p,selected=null){if(this.quiet)this.stand();if(this.overview)this.setOverview(false);const route=this.nav.route(this.player,p);this.stopMoving();if(!route.length){this.api.toast(R.roadBlocked);return false}this.target=route.shift();this.path=route;this.selected=selected;return true}
 approach(item){const p=typeof item==='string'?map.interactions.find(v=>v.id===item):item;if(p)this.walkTo(p.stand,p)}
 nearest(){if(this.quiet||this.overview)return null;const p=this.player;if(Math.hypot(p.x-this.cat.x,p.y-this.cat.y)<80)return{id:'cat',kind:'cat',title:'摸摸小猫'};return map.interactions.map(v=>({...v,d:Math.hypot(p.x-v.stand.x,p.y-v.stand.y)})).filter(v=>v.d<87).sort((a,b)=>a.d-b.d)[0]||null}
 sit(){this.stopMoving();this.seatReturn={x:this.player.x,y:this.player.y};this.quiet=true;this.player.setPosition(930,1594);this.idle();this.api.near(null);this.api.seated(true)}
 stand(){if(!this.quiet)return;this.quiet=false;this.player.setPosition(this.seatReturn.x,this.seatReturn.y);this.idle();this.api.seated(false)}
 pickup(kind,point){this.pickups.emit(kind,point.x,point.y-35,{x:this.player.x+12,y:this.player.y-38})}
 updateLighting(force=false){
  const next=this.api.period();if(!force&&this.phaseSignature===next.id&&this.lightProgress>=1)return;if(force||this.phaseSignature!==next.id){this.lightFrom=this.currentLight;this.lightTo=next;this.glowFrom=this.currentGlow||0;this.phaseSignature=next.id;this.lightProgress=force||this.profile.romance.reducedMotion?1:0}
  this.lightProgress=Math.min(1,this.lightProgress+(this.dt||0)/1.8);const t=this.lightProgress,a=this.lightFrom,b=this.lightTo;
  this.currentLight={ground:color(a.ground,b.ground,t),props:color(a.props,b.props,t),plants:color(a.plants,b.plants,t)};
  this.currentGlow=this.glowFrom+((b.id==='night'?1:b.id==='dusk'?.45:0)-this.glowFrom)*t;
  this.ground.setTint(this.currentLight.ground);for(const n of this.nodes){n.sprite.setTint(n.o.kind==='plant'||n.o.kind==='tree'?this.currentLight.plants:this.currentLight.props);n.emission?.setAlpha(this.currentGlow);n.shadow?.setAlpha(b.id==='night'?.07:b.id==='dusk'?.2:.16)}
  this.light.clear();if(b.id==='night')for(const [x,y]of[[285,580],[1005,805],[190,1310]])for(let i=3;i>0;i--){this.light.fillStyle(0xffd394,.022);this.light.fillEllipse(x,y,110+i*37,38+i*15)}
 }
 update(_,delta){
  if(!this.player)return;this.dt=Math.min(delta,60)/1000;this.elapsed+=this.dt;if(document.hidden||this.api.blocked()){this.idle();return}
  let dx=controls.x+(this.keys.right.isDown||this.extra.D.isDown?1:0)-(this.keys.left.isDown||this.extra.A.isDown?1:0),dy=controls.y+(this.keys.down.isDown||this.extra.S.isDown?1:0)-(this.keys.up.isDown||this.extra.W.isDown?1:0);
  if((dx||dy)&&this.quiet)this.stand();if((dx||dy)&&this.overview)this.setOverview(false);
  if(dx||dy){this.target=null;this.path=[];this.selected=null}else if(this.target){dx=this.target.x-this.player.x;dy=this.target.y-this.player.y;if(Math.hypot(dx,dy)<3){this.player.setPosition(this.target.x,this.target.y);this.target=this.path.shift()||null;if(!this.target){const selected=this.selected;this.selected=null;dx=dy=0;this.idle();if(selected)this.api.action(selected)}else{dx=this.target.x-this.player.x;dy=this.target.y-this.player.y}}}
  const len=Math.hypot(dx,dy);if(len>.08&&!this.quiet&&!this.overview){dx/=Math.max(1,len);dy/=Math.max(1,len);const step=this.target?Math.min(175*this.dt,len):175*this.dt,old={x:this.player.x,y:this.player.y};if(!this.blocked(this.player.x+dx*step,this.player.y))this.player.x+=dx*step;if(!this.blocked(this.player.x,this.player.y+dy*step))this.player.y+=dy*step;this.facing=Math.abs(dx)>Math.abs(dy)?dx<0?1:2:dy<0?3:0;if(Math.hypot(old.x-this.player.x,old.y-this.player.y)>.01){this.player.play(`dress-${this.profile.wardrobe.equipped}-${this.facing}`,true);this.player.setDepth(this.player.y+.1)}else this.stopMoving()}else this.idle();
  if(!this.sys.isActive()||!this.player?.active)return;
  this.contact.setPosition(this.player.x,this.player.y+4).setDepth(this.player.depth-.04).setVisible(!this.quiet);
  const still=this.profile.romance.reducedMotion,low=this.profile.scenery.lowEffects;
  for(const n of this.nodes)if(n.o.wind!==undefined)n.sprite.rotation=still?0:(Math.sin(this.elapsed*.51+n.o.wind)*.003+Math.sin(this.elapsed*.87+n.o.wind*3)*.002)*(n.o.kind==='tree'?.6:1);
  if(!still){const follow=this.profile.romance.catFollow||this.profile.play.equipment.companion==='catbell',q=follow?{x:this.player.x+58,y:this.player.y+22}:{x:855+Math.sin(this.elapsed*.12)*85,y:1515+Math.sin(this.elapsed*.19)*35},step=Math.min(1,this.dt*.6);const x=this.cat.x+(q.x-this.cat.x)*step,y=this.cat.y+(q.y-this.cat.y)*step;if(!this.blocked(x,y))this.cat.setPosition(x,y)}this.cat.setDepth(this.cat.y+.01);
  if(Math.floor(this.elapsed*(low?3:10))!==this.waterFrame){this.waterFrame=Math.floor(this.elapsed*(low?3:10));this.water.clear();if(!still)for(let i=0;i<3;i++){const age=(this.elapsed*.4+i/3)%1;this.water.lineStyle(1,0xffedc3,(1-age)*.35);this.water.strokeEllipse(930,1213+age*12,15+age*100,3+age*17)}}
  this.updateLighting();if(!this.quiet)this.api.near(this.nearest());this.api.position(this.player);
  this.pickups.update(this.dt,{reduced:low,still});const g=this.pickupGraphics;g.clear();this.pickups.draw((x,y,w,h,c,a)=>{g.fillStyle(parseInt(c.slice(1),16),a);g.fillRect(Math.round(x),Math.round(y),w*2,h*2)});
 }
}
