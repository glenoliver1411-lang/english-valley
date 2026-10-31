import {FlowerPickupEffects} from './flower-effects.js';
import {ROMANCE as R} from './romantic-config.js';
import {addRomanticEntrances} from './romantic-art.js';
import Phaser from 'phaser';
import {makeArt} from './art.js';
import {MapEnvironment} from './environment.js';
import {ST} from './scenery-config.js';
import {AT} from './adventure-config.js';
import {registerWardrobe,outfitKey} from './wardrobe-art.js';
import {mapHit,closeDecoration} from './world-touch.js';
import {refineMap} from './map-detail.js';
import {CONFIG,T,fmt} from './config.js';
import {grow,quest} from './save.js';
export const controls={x:0,y:0};
export class Manor extends Phaser.Scene {
 constructor(data,api){super('manor');this.dataSave=data;this.api=api;this.ready=false;this.locked=true;this.room=false;this.target=null;this.elapsedSave=0;this.facing=0}
 create(){
  makeArt(this);refineMap(this);registerWardrobe(this);this.world=this.add.container(0,0);this.baseMap=this.add.image(0,0,'world').setOrigin(0);this.world.add(this.baseMap);
  this.cat=this.add.image(347,453,'cat').setScale(1.25);this.world.add(this.cat);this.tweens.add({targets:this.cat,scaleY:1.21,duration:1500,yoyo:true,repeat:-1});
  this.labels=[];for(let [x,y,text] of [[114,300,T.shop],[347,407,T.cat],[235,281,T.tree],[88,509,T.garden],[354,215,T.pond]]){
   let label=this.add.text(x,y,text,{fontSize:'11px',fontFamily:'sans-serif',color:'#ffebcf',backgroundColor:'#41374dd9',padding:{x:7,y:4}}).setOrigin(.5);this.world.add(label);this.labels.push(label);
  }
  this.magicPositions=[[169,235],[368,317],[44,646]];
  this.magic=this.magicPositions.map(([x,y],i)=>{let star=this.add.image(x,y,'magic').setScale(1.2);this.world.add(star);this.tweens.add({targets:star,y:y-5,duration:1000+i*160,yoyo:true,repeat:-1});return star});
  this.sweets=[[78,465],[309,575],[158,705],[292,250],[396,641]].map(([x,y],i)=>{let obj=this.add.image(x,y,['pink','orange','purple'][i%3]).setScale(.85);this.world.add(obj);return{obj,x,y,at:0}});
  this.plotSprites=this.dataSave.plots.map((_,i)=>{const x=57+(i%2)*49,y=561+Math.floor(i/2)*43;const flower=this.add.image(x,y,'flower-'+R.flowers[i].id).setScale(1.3);this.world.add(flower);return flower});
  this.gates=[this.add.rectangle(207,754,28,29,0x6e6079).setStrokeStyle(2,0xa893a8),this.add.rectangle(235,754,28,29,0x6e6079).setStrokeStyle(2,0xa893a8)];this.gates.forEach(v=>this.world.add(v));
  this.player=this.add.sprite(this.dataSave.position.x,this.dataSave.position.y,outfitKey(this.dataSave),0).setScale(1.25).setOrigin(.5,.85);
  for(let dir=0;dir<4;dir++)this.anims.create({key:`walk${dir}`,frames:this.anims.generateFrameNumbers('girl',{start:dir*4,end:dir*4+3}),frameRate:8,repeat:-1});
  this.world.add(this.player);this.roomImage=this.add.image(0,0,'room').setOrigin(0).setVisible(false).setDepth(100);
  this.cameras.main.setBounds(0,0,432,850);this.cameras.main.startFollow(this.player,true,.08,.08,0,50);
  this.cursor=this.input.keyboard.createCursorKeys();this.keys=this.input.keyboard.addKeys('W,A,S,D,E,SPACE');this.keys.E.on('down',()=>this.api.interact());this.keys.SPACE.on('down',()=>this.api.interact());
  this.input.on('pointerdown',p=>{if(!this.locked&&!this.room&&!this.observing&&!this.exploring){const hit=mapHit(this,p.worldX,p.worldY);if(hit){this.api.touch?.(hit);return}this.target={x:Phaser.Math.Clamp(p.worldX,22,410),y:Phaser.Math.Clamp(p.worldY,185,802)};this.ripple(p.worldX,p.worldY)}});
  this.nightVeil=this.add.rectangle(216,425,432,850,0x181c38,.20).setDepth(200).setVisible(false);
  this.stars=Array.from({length:20},(_,i)=>{let s=this.add.rectangle((i*83)%430,175+(i*73)%620,2,2,0xffe4b2,.6).setDepth(5);this.tweens.add({targets:s,alpha:.05,y:s.y-12,duration:1800+i*67,yoyo:true,repeat:-1});this.world.add(s);return s});
  this.pickups=new FlowerPickupEffects();this.pickupGraphics=this.add.graphics().setDepth(30);addRomanticEntrances(this);this.environment=new MapEnvironment(this,this.dataSave,this.api);this.ready=true;this.refresh();this.api.ready(this);
 }
 refresh(){if(!this.ready)return;this.magic.forEach((s,i)=>s.setVisible(!this.dataSave.magic.includes(i)));this.plotSprites.forEach((s,i)=>{let p=grow(this.dataSave.plots[i]);s.setVisible(p.state>0);s.setTint(p.state===3?0xffffff:p.state===2?0xa8c4b0:0x8baf90);s.setScale(p.state===3?1.3:.65)});this.api.hud()}
 ripple(x,y){let s=this.add.circle(x,y,6,0xffe3ad,.1).setStrokeStyle(1,0xffe3ad,.7);this.tweens.add({targets:s,scale:3,alpha:0,duration:500,onComplete:()=>s.destroy()})}
 burst(x,y,color=0xffdc9d){for(let i=0;i<(this.dataSave.scenery.lowEffects?6:12);i++){let s=this.add.rectangle(x,y,3,3,color).setDepth(110);this.tweens.add({targets:s,x:x+Math.cos(i)*28,y:y+Math.sin(i)*24-10,alpha:0,duration:900,onComplete:()=>s.destroy()})}}
 openGate(){this.tweens.add({targets:this.gates[0],x:187,scaleX:.25,duration:1600});this.tweens.add({targets:this.gates[1],x:255,scaleX:.25,duration:1600})}
 async opening(){this.locked=true;this.player.setPosition(216,728);this.cameras.main.stopFollow();this.cameras.main.setScroll(0,0);this.nightVeil.setVisible(true).setAlpha(.85);this.tweens.add({targets:this.nightVeil,alpha:0,duration:3500,onComplete:()=>this.nightVeil.setVisible(false)});const moonCover=this.add.rectangle(339,50,48,48,0x35344f).setDepth(202);this.tweens.add({targets:moonCover,alpha:0,delay:850,duration:1100,onComplete:()=>moonCover.destroy()});this.stars.forEach((s,i)=>{s.setAlpha(0);this.tweens.add({targets:s,alpha:.8,delay:250+i*45,duration:600})});await this.wait(2100);this.cameras.main.pan(216,650,1700,'Sine.easeInOut');[[183,335],[286,364],[174,641],[270,653]].forEach(([x,y],i)=>{const light=this.add.circle(x+12,y+26,21,0xffc982,0).setDepth(3);this.tweens.add({targets:light,alpha:.15,delay:i*180,duration:600,yoyo:true,hold:900,onComplete:()=>light.destroy()})});await this.wait(1500);this.openGate();await this.wait(1700);this.cameras.main.startFollow(this.player,true,.08,.08,0,50);this.locked=false}
 wait(ms){return new Promise(resolve=>this.time.delayedCall(ms,resolve))}
 blocked(x,y){return x<18||x>414||y<180||y>805||(x>38&&x<187&&y>298&&y<414)||(x>305&&x<400&&y>231&&y<295)||(x>215&&x<249&&y>191&&y<234)||(x>310&&x<394&&y>425&&y<471)}
 nearest(){
  const p=this.player,stage=quest(this.dataSave);const spots=[{id:'pond',x:295,y:307,title:AT.pondAction},{id:'lookout',x:355,y:375,title:ST.look},{id:'cabin',x:340,y:714,title:fmt(R.cabin)},{id:'garden',x:80,y:719,title:R.enterGarden},{id:'shop',x:113,y:425,title:T.shop},{id:'cat',x:this.cat.x,y:this.cat.y+30,title:T.pet},{id:'tree',x:235,y:250,title:T.tree}];
  this.dataSave.plots.forEach((plot,i)=>spots.push({id:'plot',index:i,x:57+(i%2)*49,y:564+Math.floor(i/2)*43,title:plot.state===0?T.seed:plot.state===1?T.water:plot.state===3?R.harvest:T.bloom}));
  if(true)this.magicPositions.forEach(([x,y],i)=>{if(!this.dataSave.magic.includes(i))spots.push({id:'magic',index:i,x,y,title:T.magical})});
  this.sweets.filter(s=>!s.at).forEach(s=>spots.push({id:'sweet',sweet:s,x:s.x,y:s.y,title:T.pickup}));
  return spots.map(s=>({...s,d:Phaser.Math.Distance.Between(p.x,p.y,s.x,s.y)})).filter(s=>s.d<70).sort((a,b)=>a.d-b.d)[0]||closeDecoration(this);
 }
 refreshOutfit(){const f=this.facing*4;this.player.stop();this.player.setTexture(outfitKey(this.dataSave),f)}
 enterRoom(){this.room=true;this.target=null;this.roomImage.setVisible(true);this.cameras.main.stopFollow();this.cameras.main.setScroll(0,0)}
 leaveRoom(){this.room=false;this.roomImage.setVisible(false);this.cameras.main.startFollow(this.player,true,.08,.08,0,50)}

 update(time,delta){if(!this.ready)return;this.environment.update(delta);this.pickupGraphics.setVisible(!this.room&&!this.observing&&!this.exploring);this.pickups.update(Math.min(delta,80)/1000,{reduced:this.dataSave.scenery.lowEffects,still:this.dataSave.romance.reducedMotion});if(!this.room&&!this.observing&&!this.exploring){const g=this.pickupGraphics;g.clear();this.pickups.draw((x,y,w,h,color,alpha)=>{g.fillStyle(parseInt(color.slice(1),16),alpha);g.fillRect(Math.round(x),Math.round(y),w,h)})}this.api.worldFrame?.();this.sweets.forEach(s=>{if(s.at&&Date.now()>=s.at){s.at=0;s.obj.setVisible(true)}});if(Math.floor(time/1000)!==this.lastGrowth){this.lastGrowth=Math.floor(time/1000);this.refresh()}
  if(this.locked||this.room||this.observing||this.exploring){this.player.anims.stop();return}
  let dx=controls.x+(this.cursor.right.isDown||this.keys.D.isDown?1:0)-(this.cursor.left.isDown||this.keys.A.isDown?1:0),dy=controls.y+(this.cursor.down.isDown||this.keys.S.isDown?1:0)-(this.cursor.up.isDown||this.keys.W.isDown?1:0);
  if(dx||dy)this.target=null;else if(this.target){dx=this.target.x-this.player.x;dy=this.target.y-this.player.y;if(Math.hypot(dx,dy)<4){this.target=null;dx=dy=0}}
  const len=Math.hypot(dx,dy);if(len>.08){dx/=Math.max(1,len);dy/=Math.max(1,len);const step=86*Math.min(delta,40)/1000;let nx=this.player.x+dx*step,ny=this.player.y+dy*step;if(!this.blocked(nx,this.player.y))this.player.x=nx;else if(this.target)this.target=null;if(!this.blocked(this.player.x,ny))this.player.y=ny;else if(this.target)this.target=null;this.facing=Math.abs(dx)>Math.abs(dy)?dx<0?1:2:dy<0?3:0;this.player.play(`dress-${this.dataSave.wardrobe.equipped}-${this.facing}`,true)}else{this.player.anims.stop();this.player.setFrame(this.facing*4)}
  this.player.setDepth(10);this.api.near(this.nearest());this.elapsedSave+=delta;if(this.elapsedSave>1600){this.elapsedSave=0;this.dataSave.position={x:this.player.x,y:this.player.y};this.api.save()}
 }
}
export function createGame(data,api){const scene=new Manor(data,api);const host=document.getElementById('game');const viewportHeight=()=>Math.max(480,Math.round(432*host.clientHeight/host.clientWidth));const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:432,height:viewportHeight(),backgroundColor:'#35344f',pixelArt:true,roundPixels:true,antialias:false,resolution:1,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[scene],input:{activePointers:3},render:{transparent:false},audio:{noAudio:true}});const resize=new ResizeObserver(()=>{if(host.clientWidth&&host.clientHeight)game.scale.setGameSize(432,viewportHeight())});resize.observe(host);game.events.once('destroy',()=>resize.disconnect());return{scene,game}}
