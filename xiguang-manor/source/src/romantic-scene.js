import Phaser from 'phaser';
import {controls} from './game.js';
import {outfitKey} from './wardrobe-art.js';
import {retreatPainting} from './romantic-art.js';
import {ROMANCE as R} from './romantic-config.js';
import {flowerStage} from './romantic-model.js';
import {skyPalette,mix} from './sky-model.js';
export class RomanticScene extends Phaser.Scene {
 constructor(profile,api){super('retreat');this.profile=profile;this.api=api}
 init({place}){this.place=place;this.elapsed=0;this.target=null;this.selected=null;this.facing=3;this.quiet=false;this.awaken=0;this.frameTime=0;this.lastPaint='';this.slow=0}
 create(){
  this.cameras.main.setBackgroundColor('#493e52');this.repaint();
  this.player=this.add.sprite(216,785,outfitKey(this.profile),12).setOrigin(.5,.85).setScale(1.25);
  this.cat=this.add.image(251,772,'cat').setScale(1.1);this.g=this.add.graphics();
  this.cameras.main.setBounds(0,0,432,850);this.cameras.main.startFollow(this.player,true,.07,.07,0,40);this.cameras.main.fadeIn(700,35,35,53);
  this.keys=this.input.keyboard.createCursorKeys();this.extra=this.input.keyboard.addKeys('W,A,S,D');
  this.input.on('pointerdown',p=>{if(this.api.blocked()||this.quiet)return;const hit=this.props().map(v=>({...v,d:Math.hypot(p.worldX-v.x,p.worldY-v.y)})).sort((a,b)=>a.d-b.d)[0];if(hit?.d<32){if(Math.hypot(hit.x-this.player.x,hit.y-this.player.y)<100)this.api.action(hit);else{this.selected=hit;this.target=this.standPoint(hit)}}else if(!this.blocked(p.worldX,p.worldY)){this.selected=null;this.target={x:p.worldX,y:p.worldY}}});
  this.events.once('shutdown',()=>{for(const k of ['retreat-night','retreat-day','retreat-dusk'])if(this.textures.exists(k))this.textures.remove(k)});this.api.ready(this);
 }
 repaint(){
  const theme=this.profile.romance.theme;this.background?.destroy();this.blend?.destroy();
  for(const [key,hour]of [['night',22],['day',10],['dusk',18]]){const texture='retreat-'+key;if(this.textures.exists(texture))this.textures.remove(texture);this.textures.addCanvas(texture,retreatPainting(this.place,hour,theme))}
  this.background=this.add.image(0,0,'retreat-night').setOrigin(0).setDepth(-3);this.blend=this.add.image(0,0,'retreat-day').setOrigin(0).setDepth(-2);this.lastPaint=theme;
 }
 props(){return this.place==='garden'?[
  {id:'tree',x:215,y:284,title:R.tree},{id:'swing',x:356,y:540,title:R.swing},{id:'pool',x:278,y:307,title:R.lakeSit},
  {id:'hollow',x:38,y:330,title:R.secrets.hollow.name},{id:'grass',x:301,y:680,title:R.secrets.grass.name},{id:'candy',x:51,y:620,title:R.secrets.candy.name},
  ...this.profile.romance.beds.map((b,i)=>({id:'bed',index:i,x:87+i%2*67,y:401+Math.floor(i/2)*61,title:flowerStage(b)===0?R.plant:flowerStage(b)===1?R.water:flowerStage(b)===4?R.harvest:R.growing})),
  {id:'exit',x:216,y:799,title:R.leave},{id:'cat',x:this.cat.x,y:this.cat.y,title:R.cat}
 ]:[{id:'window',x:212,y:325,title:R.seat},{id:'gift',x:240,y:294,title:R.gift},{id:'rest',x:272,y:538,title:R.rest},{id:'fire',x:105,y:313,title:R.lakeSit},{id:'sofa',x:108,y:451,title:R.seat},{id:'wardrobe',x:109,y:617,title:R.wardrobe},{id:'books',x:302,y:665,title:R.shelf},{id:'mail',x:174,y:298,title:R.mailbox},{id:'cat',x:this.cat.x,y:this.cat.y,title:R.cat},{id:'exit',x:216,y:798,title:R.leave}]}
 standPoint(p){if(p.id==='tree')return{x:215,y:310};if(p.id==='swing')return{x:356,y:569};return{x:p.x,y:Math.min(795,p.y+27)}}
 blocked(x,y){if(x<40||x>398||y<290||y>811)return true;if(this.place==='garden')return ((x-324)/53)**2+((y-280)/36)**2<1||(x>187&&x<234&&y<302);return(x>273&&x<392&&y>337&&y<527)||(x>29&&x<94&&y>363&&y<448)||(x>320&&y>578&&y<684)||(x<101&&y>562&&y<667)}
 nearest(){return this.props().map(p=>({...p,d:Math.hypot(p.x-this.player.x,p.y-this.player.y)})).filter(p=>p.d<80).sort((a,b)=>a.d-b.d)[0]}
 sit(kind){this.quiet=true;this.target=null;this.selected=null;this.seat=kind;const pos=kind==='swing'?{x:356,y:533}:kind==='window'?{x:207,y:327}:kind==='pool'?{x:279,y:329}:kind==='fire'?{x:115,y:341}:{x:73,y:435};this.player.setPosition(pos.x,pos.y);this.player.setFrame(kind==='window'?12:0);this.cameras.main.stopFollow();this.cameras.main.pan(216,kind==='swing'?510:kind==='pool'?315:340,2200,'Sine.easeInOut')}
 stand(){this.quiet=false;this.player.setPosition(this.place==='garden'?this.seat==='swing'?356:270:216,this.place==='garden'?this.seat==='swing'?572:340:354);this.cameras.main.startFollow(this.player,true,.07,.07,0,40)}
 update(time,delta){
  if(document.hidden||this.api.blocked())return;const dt=Math.min(delta,60)/1000;this.elapsed+=dt;const w=this.profile.romance;
  if(!this.quiet){let dx=controls.x+(this.keys.right.isDown||this.extra.D.isDown?1:0)-(this.keys.left.isDown||this.extra.A.isDown?1:0),dy=controls.y+(this.keys.down.isDown||this.extra.S.isDown?1:0)-(this.keys.up.isDown||this.extra.W.isDown?1:0);if(dx||dy){this.target=null;this.selected=null}else if(this.target){dx=this.target.x-this.player.x;dy=this.target.y-this.player.y;if(Math.hypot(dx,dy)<5){this.target=null;dx=dy=0;if(this.selected){const p=this.selected;this.selected=null;this.api.action(p)}}}const len=Math.hypot(dx,dy);if(len>.08){dx/=Math.max(1,len);dy/=Math.max(1,len);const nx=this.player.x+dx*87*dt,ny=this.player.y+dy*87*dt;if(!this.blocked(nx,this.player.y))this.player.x=nx;if(!this.blocked(this.player.x,ny))this.player.y=ny;this.facing=Math.abs(dx)>Math.abs(dy)?dx<0?1:2:dy<0?3:0;this.player.play(`dress-${this.profile.wardrobe.equipped}-${this.facing}`,true)}else{this.player.stop();this.player.setTexture(outfitKey(this.profile),this.facing*4)}this.api.near(this.nearest())}
  if(delta>45)this.slow++;else this.slow=Math.max(0,this.slow-.25);const reduced=this.profile.scenery.lowEffects||this.slow>100;this.frameTime+=dt;if(this.frameTime<1/(reduced?16:30))return;this.frameTime=0;
  if(w.theme!==this.lastPaint)this.repaint();const a=skyPalette(this.profile.scenery.clock),day=a.day,t=w.reducedMotion?0:this.elapsed;if(this.profile.scenery.clock>=17&&this.profile.scenery.clock<20){this.background.setTexture('retreat-dusk');this.blend.setAlpha(0)}else{this.background.setTexture('retreat-night');this.blend.setAlpha(day)}
  const g=this.g;g.clear();const rect=(x,y,ww,hh,col,alpha=1)=>{g.fillStyle(parseInt(col.slice(1),16),alpha);g.fillRect(Math.round(x),Math.round(y),ww,hh)},ellipse=(x,y,ww,hh,col,alpha=1)=>{g.fillStyle(parseInt(col.slice(1),16),alpha);g.fillEllipse(x,y,ww,hh)};
  ellipse(this.player.x+3,this.player.y+2,25,6,'#384955',.12);ellipse(this.cat.x+4,this.cat.y+15,26,5,'#384955',.1);
  // The cat is always safe. It follows, chases a butterfly, stretches, then naps.
  const cycle=t%47,follow=w.catFollow&&!this.quiet;
  const cx=follow?this.player.x+30:this.place==='cabin'?cycle<14?255:325:cycle<15?286+Math.sin(t*.6)*23:254;
  const cy=follow?this.player.y-12:this.place==='cabin'?cycle<14?249:714:cycle<15?362+Math.cos(t*.5)*13:338;
  this.cat.x+=(cx-this.cat.x)*.065;this.cat.y+=(cy-this.cat.y)*.065;
  const sleep=!follow&&(this.quiet||cycle>28),stretch=!sleep&&cycle>23&&cycle<28?Math.sin((cycle-23)/5*Math.PI):0;
  this.cat.setTexture(sleep?'cat-sleep':'cat').setScale(1.1+stretch*.2,sleep?.8+Math.sin(t)*.008:1.1-stretch*.3);
  if(this.place==='garden'){
   for(let i=0;i<6;i++){const b=w.beds[i],stage=flowerStage(b),x=87+i%2*67,y=401+Math.floor(i/2)*61;if(stage===0)continue;const f=R.flowers.find(f=>f.id===b.flower),height=[0,4,8,16,24][stage],bend=Math.sin(t*.7+i*2.3)*1.4,near=Math.max(0,1-Math.hypot(this.player.x-x,this.player.y-y)/48);rect(x+bend+near*2,y-height,2,height,'#87a188');rect(x-7+bend,y-height*.6,8,3,'#a1b398');rect(x+2+bend,y-height*.4,8,3,'#809e87');if(stage>=3){const size=stage===4?10:5;rect(x-size/2+bend,y-height-3,size,7,f.color);rect(x-2+bend,y-height-6,5,12,f.color);rect(x+bend,y-height-2,2,2,f.center);if(f.id==='glow')ellipse(x,y-height,26,24,f.center,a.night*.12)}if(stage===2)rect(x+6,y-7,2,3,'#badcdb')}
   const glow=w.treeAwakened?Math.min(1,(this.elapsed-this.awaken)/3):0;
   if(glow)for(let i=0;i<22;i++){const x=131+i*43%173,y=105+i*29%90,alpha=(.55+Math.sin(t*.4+i*2)**2*.45)*glow;rect(x,y,2,2,'#ffe9b9',alpha);if(!reduced)ellipse(x+1,y+1,14,12,'#f9ceba',alpha*.055)}
   const swing=w.reducedMotion?0:Math.sin(t*.65)*(this.quiet&&this.seat==='swing'?5:1.4);rect(331+swing,529,53,7,'#cba8a3');if(this.quiet&&this.seat==='swing')this.player.x=356+swing;
   for(let i=0;i<7;i++){const x=296+i*9,y=269+(i*7)%27;rect(x+Math.sin(t+i)*3,y,7+i%3*2,1,'#d5dcd8',.3)}
   for(let i=0;i<(reduced?3:7);i++){const x=247+Math.sin(t*.35+i*2)*49,y=359+Math.cos(t*.6+i)*24;rect(x,y,2,3,'#9a84a1');rect(x-3,y+(Math.sin(t*7+i)>0?-2:0),3,3,i%2?'#e1bdcd':'#d8c8a6');rect(x+2,y,3,3,'#d3b5ce')}
   if(a.night>.2)for(let i=0;i<(reduced?8:24);i++){const x=45+i*67%340+Math.sin(t*.25+i)*10,y=320+i*83%418+Math.sin(t*.4+i*3)*7,alpha=(.15+.7*Math.sin(t*.5+i*2)**4)*a.night;rect(x,y,2,2,'#e8e6ac',alpha);if(!reduced)ellipse(x,y,9,9,'#dfe6a7',alpha*.05)}
   // Tree-hole silhouette and the small, unmarked hidden letter.
   ellipse(38,323,12,18,'#364852');rect(35,324,6,3,'#d1b4ae');
   if(!w.secrets.includes('grass')){rect(300,676,2,8,'#f1ddb4');rect(297,679,8,2,'#d3b9dc')}
  }else{
   // A handful of moving hearth pixels cast local warm light across the floor.
   for(let i=0;i<6;i++){const flame=8+Math.sin(t*4+i*2)*4;rect(51+i*6,309-flame,4,flame,i%2?'#efb77c':'#e38e72');rect(52+i*6,307-flame*.5,2,flame*.5,'#ffe1a2')}
   if(!reduced){ellipse(72,316,100,68,'#f7bd87',.055);ellipse(79,337,143,80,'#f1c18f',.04)}
   // Window glass is the only weather area inside; rain never falls through the roof.
   if(w.weather==='rain')for(let i=0;i<(reduced?18:42);i++){const x=134+i*37%163,y=83+(i*29+t*90)%135;rect(x,y,1,5,'#c1c8da',.5)}
   if(w.weather==='snow')for(let i=0;i<(reduced?10:25);i++){const x=134+(i*37+Math.sin(t*.3+i)*4)%162,y=83+(i*29+t*7)%135;rect(x,y,2,2,'#f5e8df',.7)}
   if(w.rainStoppedAt&&Date.now()-w.rainStoppedAt<180000&&w.weather==='clear'){g.lineStyle(2,0xd8a6ba,.35);g.beginPath();g.arc(218,151,48,Math.PI,Math.PI*2);g.strokePath();g.lineStyle(2,0xe5d1ac,.3);g.beginPath();g.arc(218,151,44,Math.PI,Math.PI*2);g.strokePath()}
   if(w.personalStar&&w.starPlace==='room'){rect(271,119,2,14,'#fae8bd');rect(266,125,12,2,'#fae8bd');ellipse(272,126,25,25,'#f9d4a7',.085)}
   if(w.personalStar){rect(227,245,25,19,'#bb9baa');rect(229,244,21,3,'#e1c4b8')}
   // Morning window rays are clipped to the room floor instead of tinting the frame.
   if(day>.3&&!reduced){g.fillStyle(0xffe6b3,.035*day);g.fillTriangle(139,236,150,510,243,510);g.fillTriangle(284,236,286,472,372,472)}
  }
  // Finite deterministic petal pool, slow and not synchronized with tree sway.
  if(!w.reducedMotion)for(let i=0;i<(reduced?7:18);i++){const x=24+((i*73+t*(2+i%3))%384),y=this.place==='garden'?175+(i*47+t*(4+i%4))%620:290+(i*37-t*1.3+520)%480;rect(x+Math.sin(t*.7+i)*7,y,i%4?2:3,1,this.place==='garden'?'#e3b2c9':'#f2d6b2',this.place==='garden'?.5:.22)}
  this.player.setDepth(4);this.cat.setDepth(3);g.setDepth(2);
 }
}
