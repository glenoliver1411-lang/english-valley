import {preloadLakeside} from './lakeside-materials.js';
import {LakesideArt} from './lakeside-art.js';
import {VISTA} from './vista-config.js';
import {WishFlight,roofArrival} from './vista-effects.js';
import {MountainBackdrop} from './landscape-detail.js';
import {WindMeadow,grassMask} from './wind-grass.js';
import {MeteorSystem,meteorDedication} from './meteors.js';
import {Starlight,drawJewel,paintCloud} from './starlight.js';
import {ROMANCE as R} from './romantic-config.js';
import Phaser from 'phaser';
import {FireworkSystem} from './fireworks.js';
import {FIREWORKS,FT} from './fireworks-config.js';
import {outfitKey} from './wardrobe-art.js';
import {SCENERY} from './scenery-config.js';
import {landscape,makeNebula,rng,pixelEllipse} from './scenery-art.js';
import {skyPalette,mix,lerp,sunriseHour,meteorPhase} from './sky-model.js';
export class SkyScene extends Phaser.Scene{
 constructor(data,api){super('sky');this.profile=data;this.api=api}
 init(options){this.options=options;this.quiet=options.replay==='quiet';this.viewpoint=options.viewpoint||'lake';this.baseHour=this.quiet?18:22;this.tilt=0;this.skyReveal=0;this.mode='idle';this.elapsed=0;this.timeline=0;this.parallax=0;this.targetParallax=0;this.reduced=this.profile.scenery.lowEffects;this.autoReduced=false;this.slowFrames=0;this.meteors=new MeteorSystem(216,400,rng(932));this.pool=this.meteors.pool;this.drawAccumulator=0;this.rng=rng(932);this.lastPhase=-1;this.touchPulses=[];this.caughtCount=0;this.fireworks=new FireworkSystem({onBurst:()=>{if(!this.profile.scenery.fireworksSeen){this.profile.scenery.fireworksSeen=true;this.api.save()}this.api.fireworkSound?.()}});this.fireworkDone=false;this.fireworkPhase=-1;this.wishFlight=new WishFlight();this.arrivalTime=VISTA.roofSeconds;this.arriving=false}
 preload(){preloadLakeside(this)}
 create(){this.scene.bringToTop();this.camera=this.cameras.main;this.camera.setBackgroundColor('#151e40');this.rebuild();this.scale.on('resize',this.rebuild,this);this.input.on('pointerdown',this.pointerDown,this);this.input.on('pointermove',this.pointerMove,this);this.input.on('pointerup',this.pointerUp,this);this.events.once('shutdown',()=>{this.scale.off('resize',this.rebuild,this);this.input.off('pointerdown',this.pointerDown,this);this.input.off('pointermove',this.pointerMove,this);this.input.off('pointerup',this.pointerUp,this);this.paint?.destroy();if(this.textures.exists('sky-canvas'))this.textures.remove('sky-canvas');this.lakeArt?.destroy();this.lakeArt=null;this.layers=null;this.meadow=null;this.starlight=null;this.nebula=null;this.reflection=null;this.reflectionSky=null;this.mountains=null;this.meteors.clear();this.fireworks.clear();this.wishFlight.active=false;this.api.mood(0,false)});this.api.ready(this);if(this.options.replay==='meteor')this.startMeteor();if(this.options.replay==='dawn')this.startDawn();if(this.options.replay==='fireworks')this.startFireworks();this.camera.fadeIn(900,24,26,44)}
 rebuild(){this.w=216;this.h=Math.max(240,Math.round(this.scale.gameSize.height/2));this.paint?.destroy();if(this.textures.exists('sky-canvas'))this.textures.remove('sky-canvas');this.texture=this.textures.createCanvas('sky-canvas',this.w*2,this.h*2);this.ctx=this.texture.getContext();this.ctx.imageSmoothingEnabled=false;this.ctx.setTransform(2,0,0,2,0,0);this.paint=this.add.image(0,0,'sky-canvas').setOrigin(0).setDisplaySize(432,this.scale.gameSize.height);this.lakeArt?.destroy();this.lakeArt=this.viewpoint==='lake'?new LakesideArt(this,this.w,this.h):null;this.layers=this.lakeArt?.layers||{night:landscape(this.w,this.h,'night',this.viewpoint),dawn:landscape(this.w,this.h,'dawn',this.viewpoint),day:landscape(this.w,this.h,'day',this.viewpoint),dusk:landscape(this.w,this.h,'dusk',this.viewpoint)};const meadowMask=grassMask(this.layers.night,this.lakeArt?['#2c454d','#576e65']:['#344951','#476064']);this.meadow=new WindMeadow(this.w,this.h,{mask:(x,y)=>meadowMask(x*2,y*2),count:32,scale:.5,minY:this.h*.88,maxY:this.h-2});this.reflection=document.createElement('canvas');this.reflection.width=this.w*2;this.reflection.height=this.h*2;this.reflectionSky=document.createElement('canvas');this.reflectionSky.width=this.w*2;this.reflectionSky.height=this.h*2;this.nebula=makeNebula(this.w,this.h);this.moon=document.createElement('canvas');this.moon.width=this.moon.height=40;const mc=this.moon.getContext('2d');mc.fillStyle='#f9ddb0';for(let y=-10;y<=10;y++)for(let x=-10;x<=10;x++)if(x*x+y*y<100&&(x-4)*(x-4)+(y+3)*(y+3)>80)mc.fillRect(20+x,20+y,1,1);this.starlight=new Starlight(this.w,this.h);this.starField=this.starlight.stars;this.mountains=this.lakeArt?.mountains||new MountainBackdrop(this.w,this.h);this.clouds=Array.from({length:6},(_,i)=>({x:i*47-30,y:this.h*(.18+i*.067),speed:1+i*.25,w:38+i%3*13,night:paintCloud(i),day:paintCloud(i,true)}));this.fireworks.resize(this.w,this.h);this.meteors.resize(this.w,this.h);this.frame()}
 starPosition(star){return{x:star.x*this.w+this.parallax*.32,y:22+star.y*this.h*.86}}
 pointerDown(p){this.drag={x:p.x,y:p.y,base:this.targetParallax,moved:false}}
 pointerMove(p){if(!this.drag||!p.isDown)return;const d=p.x-this.drag.x;if(Math.abs(d)>8)this.drag.moved=true;this.targetParallax=Phaser.Math.Clamp(this.drag.base+d*.035,-8,8)}
 pointerUp(p){if(!this.drag)return;const moved=this.drag.moved;this.drag=null;if(moved)return;const x=p.x/2,y=p.y/this.scale.gameSize.height*this.h;if(this.quiet)return;if(this.mode==='fireworks'){this.launchFirework(x,y);return}this.touchPulses.push({x,y,t:this.elapsed});if(this.touchPulses.length>5)this.touchPulses.shift();const meteor=this.meteors.hit(x,y);if(meteor&&this.caughtCount<5){meteor.caught=true;this.caughtCount++;this.api.catchStar?.();return}if(this.mode==='idle'){const special=SCENERY.stars.map(s=>({s,d:Math.hypot(this.starPosition(s).x-x,this.starPosition(s).y-y)})).sort((a,b)=>a.d-b.d)[0];if(special.d<13){this.api.star(special.s);return}}let kind='star';if(y>this.h*.70&&y<this.h*.85&&x>this.w*.68){this.api.secret?.('moon');return}if(this.profile.romance.personalStar&&this.profile.romance.starPlace==='sky'&&Math.hypot(x-this.w*.15,y-this.h*.21)<12){this.api.personal?.();return}if(Math.hypot(x-this.w*.85,y-this.h*.13)<17)kind='moon';else if(this.mode==='dawn'&&x>this.w*.65&&y<this.h*.68)kind='sun';else if(this.clouds.some(cl=>Math.abs(x-(((cl.x+this.elapsed*cl.speed*.34+this.parallax*.4+this.w+80)%(this.w+100))-65))<cl.w&&Math.abs(y-cl.y)<9))kind='cloud';else if(y>this.h*.65){kind=y<this.h*.81?'mountain':'flower';if(x<93&&y>this.h*.81-65)kind='roof';if(x>120&&x<156&&y>this.h-62)kind='cat';else if(x>74&&x<146&&y>this.h-75)kind='bench';if(Math.hypot(x-54,y-(this.h-45))<14)kind='lamp'}if(this.birds?.some(b=>Math.hypot(b.x-x,b.y-y)<9))kind='bird';if(kind==='cat')this.catAwakeUntil=this.elapsed+5;if(kind==='lamp'){const switches=this.profile.adventure.switches;switches['sky-lamp']=!(switches['sky-lamp']??true);this.api.save()}this.api.inspect?.(kind)}
 receiveWish(starId='xi'){const star=SCENERY.stars.find(s=>s.id===starId)||SCENERY.stars[0];this.wishFlight.start(this.starPosition(star))}

 startMeteor(){this.arriving=false;this.arrivalTime=VISTA.roofSeconds;this.quiet=false;this.baseHour=22;this.fireworks.clear();this.mode='meteor';this.timeline=0;this.lastPhase=-1;this.caughtCount=0;this.meteors.startShow();this.api.mode('meteor');this.api.mood(0,true)}
 startDawn(){this.quiet=false;this.baseHour=22;this.arrivalTime=this.viewpoint==='roof'?0:VISTA.roofSeconds;this.arriving=this.viewpoint==='roof';this.fireworks.clear();this.mode='dawn';this.timeline=0;this.lastPhase=-1;this.caughtCount=0;this.meteors.clear();this.api.mode('dawn');if(this.arriving)this.api.phaseText?.(VISTA.text.roofArrival)}
 startFireworks(){this.arriving=false;this.arrivalTime=VISTA.roofSeconds;this.quiet=false;this.baseHour=22;this.meteors.clear();this.mode='fireworks';this.fireworkDone=false;this.fireworkPhase=-1;this.fireworks.resize(this.w,this.h);this.fireworks.setReduced(this.reduced);this.fireworks.startShow();this.api.mode('fireworks');this.api.mood(0,true)}
 launchFirework(x=this.w*.5,y=this.h*.30){const ok=this.fireworks.launch(x,y,this.profile.scenery.fireworkStyle||'gold');if(!ok)this.api.fireworkBusy?.();return ok}
 endFireworks(){this.fireworks.clear();this.mode='idle';this.api.mode('idle')}
 toggleFireworkAuto(){if(this.fireworks.auto){this.fireworks.auto=false;this.fireworks.finished=false;this.api.fireworkControls?.()}else this.startFireworks()}
 setFireworkStyle(style){if(!FIREWORKS.styles.some(s=>s.id===style))return;this.profile.scenery.fireworkStyle=style;this.api.save();this.api.fireworkControls?.()}
 skip(){if(this.mode==='meteor')this.completeMeteor();else if(this.mode==='dawn')this.completeDawn();else if(this.mode==='fireworks')this.endFireworks()}
 completeMeteor(){this.mode='idle';this.meteors.clear();this.profile.scenery.meteorSeen=true;this.api.save();this.api.mode('idle');this.api.meteorDone()}
 completeDawn(){this.mode='morning';this.arriving=false;this.arrivalTime=VISTA.roofSeconds;this.timeline=SCENERY.sunriseSeconds;this.profile.scenery.dawnSeen=true;this.profile.scenery.clock=SCENERY.hours.morning;this.api.save();this.api.mode('morning');this.api.dawnDone()}
 update(time,delta){if(document.hidden||this.api.blocked?.())return;const dt=Math.min(delta,250)/1000;this.elapsed+=dt;this.wishFlight.update(dt);this.skyReveal=Math.min(1,this.skyReveal+dt*.3);this.tilt=lerp(this.tilt,this.mode==='meteor'?Math.min(1,this.timeline/3.5):0,.025);this.parallax=lerp(this.parallax,this.profile.romance.reducedMotion?0:this.targetParallax,.035);this.reduced=this.profile.scenery.lowEffects||this.autoReduced;if(delta>42)this.slowFrames++;else this.slowFrames=Math.max(0,this.slowFrames-.2);if(this.slowFrames>60)this.autoReduced=true;this.meadow.update(dt,{reduced:this.reduced,still:this.profile.romance.reducedMotion});
  if(this.mode==='fireworks'){this.fireworks.setReduced(this.reduced);this.fireworks.update(dt);const phase=this.fireworks.finished?4:Math.min(3,Math.floor(this.fireworks.showTime/8));if(phase!==this.fireworkPhase){this.fireworkPhase=phase;this.api.phase('fireworks',phase)}if(this.fireworks.finished&&!this.fireworkDone){this.fireworkDone=true;this.api.fireworksDone?.()}}
  else if(this.mode==='meteor'){this.meteors.update(dt,{mode:'show',reduced:this.reduced});this.timeline=this.meteors.showTime;this.api.dedication?.(meteorDedication(this.timeline));const phase=meteorPhase(this.timeline);if(phase!==this.lastPhase){this.lastPhase=phase;this.api.phase('meteor',phase)}if(this.meteors.finished)this.completeMeteor()}
  else if(this.mode==='dawn'&&this.arriving){this.arrivalTime=Math.min(VISTA.roofSeconds,this.arrivalTime+dt);if(this.arrivalTime>=VISTA.roofSeconds){this.arriving=false;this.lastPhase=-1}}
  else if(this.mode==='dawn'){this.timeline+=dt;const phase=Math.min(4,Math.floor(this.timeline/SCENERY.sunriseSeconds*5));if(phase!==this.lastPhase){this.lastPhase=phase;this.api.phase('dawn',phase)}this.api.mood(skyPalette(sunriseHour(this.timeline/SCENERY.sunriseSeconds)).day,true);if(this.timeline>=SCENERY.sunriseSeconds)this.completeDawn()}
  else if(this.mode==='idle')this.meteors.update(dt,{mode:this.baseHour===22&&!this.profile.romance.reducedMotion?'idle':'off',reduced:this.reduced});
  this.drawAccumulator+=dt;if(this.drawAccumulator>=1/(this.reduced?24:30)){this.drawAccumulator%=1/(this.reduced?24:30);this.frame()}}
 frame(){if(!this.ctx)return;const c=this.ctx,w=this.w,h=this.h,t=this.profile.romance.reducedMotion&&this.mode==='idle'?0:this.elapsed,p=this.mode==='dawn'?Math.min(1,this.timeline/SCENERY.sunriseSeconds):this.mode==='morning'?1:0;const a=skyPalette(p?sunriseHour(p):this.baseHour),n=a.night;const color=(col)=>{c.fillStyle=col};const rect=(x,y,ww,hh,col)=>{color(col);c.fillRect(Math.round(x),Math.round(y),ww,hh)};
  c.setTransform(2,0,0,2,0,0);c.globalAlpha=1;for(let y=0;y<h;y+=2)rect(0,y,w,2,mix(a.top,a.bottom,Math.min(1,y/(h*.68))));
  c.globalAlpha=n*(.70+.09*Math.sin(t*.025))*(.38+.62*this.skyReveal);c.drawImage(this.nebula,this.parallax*.10,0,w,h);c.globalAlpha=1;
  this.starlight.draw(c,{time:t,night:n,reveal:this.skyReveal,parallax:this.parallax,reduced:this.reduced});
  // Crescent and sun are separate from the sky and travel behind the mountains.
  const moonX=w*.85+this.parallax*.17,moonY=h*.13-p*28;c.globalAlpha=n;c.drawImage(this.moon,Math.round(moonX-20),Math.round(moonY-20));for(let i=4;i>0;i--){c.globalAlpha=n*.007*(5-i);pixelEllipse({r:rect},moonX,moonY,11+i*3,11+i*3,'#cbd9ed')}c.globalAlpha=1;
  if(p>.32||this.baseHour===18){let sx=w*.77,sy=this.baseHour===18?h*.54:lerp(h*.71,h*.43,(p-.32)/.68);c.globalAlpha=.055;pixelEllipse({r:rect},sx,sy,29,29,'#ffe2a9');c.globalAlpha=.09;pixelEllipse({r:rect},sx,sy,20,20,'#ffe2a9');c.globalAlpha=1;pixelEllipse({r:rect},sx,sy,12,12,'#ffe1ab');rect(sx-7,sy-7,10,2,'#fff0c4')}
  // Personal constellation: fine, dashed pixel threads and independently glowing stars.
  c.globalAlpha=n*.085;for(const [i,j]of SCENERY.links){const A=this.starPosition(SCENERY.stars[i]),B=this.starPosition(SCENERY.stars[j]);const dist=Math.hypot(B.x-A.x,B.y-A.y);c.fillStyle='#b7c5e1';for(let k=0;k<dist;k+=3)c.fillRect(Math.round(lerp(A.x,B.x,k/dist)*2)/2,Math.round(lerp(A.y,B.y,k/dist)*2)/2,.5,.5)}c.globalAlpha=1;
  for(let i=0;i<SCENERY.stars.length;i++){const s=SCENERY.stars[i],v=this.starPosition(s);drawJewel(c,v.x,v.y,{alpha:n,time:t,phase:i*1.73,major:s.fixed,color:i%2?'#b8d4eb':'#dbc8eb'});if(this.profile.scenery.stars.includes(s.id)){c.globalAlpha=n*.45;c.fillStyle='#efc6af';c.fillRect(v.x+3,v.y+3,.5,.5)}}c.globalAlpha=1;
  this.prepareReflection(a,p,t);this.meteors.draw(c);if(this.mode==='fireworks')this.fireworks.draw(c);
  // Drifting cloud bands partially occlude stars instead of sitting behind them.
  this.drawClouds(c,a,t);
  c.save();c.translate(0,Math.round(this.tilt*h*.035));
  this.drawMountains(c,a,p);
  this.drawDistantForest(rect,a,t);
  this.drawLake(rect,a,p,t);
  // Foreground shadows, roofs, trees and flowers change palette, not a screen tint.
  const offset=Math.round(this.parallax*.75);c.drawImage(this.baseHour===18?this.layers.dusk:this.layers.night,offset,0,w,h);if(a.day>0&&this.baseHour!==18){c.globalAlpha=Math.min(1,a.day*1.7);c.drawImage(this.layers.dawn,offset,0,w,h);c.globalAlpha=Math.max(0,(a.day-.58)/.42);c.drawImage(this.layers.day,offset,0,w,h);c.globalAlpha=1}
  if(!this.lakeArt&&n>.1&&(this.profile.adventure.switches['sky-lamp']??true)){c.globalAlpha=n*.06;pixelEllipse({r:rect},54+offset,h-45,16,16,'#ffcc8e');c.globalAlpha=n*.12;pixelEllipse({r:rect},54+offset,h-45,8,8,'#ffce91');c.globalAlpha=1}
  if(this.viewpoint==='lake')this.meadow.draw((x,y,w,h,color,alpha)=>{c.globalAlpha=alpha;rect(x,y,w,h,color)},{day:a.day,offsetX:offset});c.globalAlpha=1;
  // Morning light shafts peek between the eastern leaves.
  if(p>.45&&!this.reduced){for(let i=0;i<3;i++){c.globalAlpha=.035*Math.sin(Math.min(1,(p-.45)/.55)*Math.PI*.7);c.fillStyle='#fff0ca';c.beginPath();c.moveTo(w-24-i*6,h*.61);c.lineTo(76-i*13,h);c.lineTo(99-i*12,h);c.closePath();c.fill()}c.globalAlpha=1}
  // A few flowers lean independently in the breeze; dust and petals use fixed pools.
  if(!this.lakeArt)for(let i=0;i<13;i++){const x=(i*37+13)%w+offset,y=h-7-(i*17)%27,bend=Math.sin(t*.8+i*2.5)*1.3;c.globalAlpha=.85;rect(x+bend,y,1,5,mix('#6d8475','#a3b48a',a.day));rect(x-1+bend,y-3,3,3,mix('#bb91ad','#e8b3bf',a.day))}c.globalAlpha=1;
  const particles=this.lakeArt?0:this.reduced?8:25;for(let i=0;i<particles;i++){const x=((i*31+t*(i%2?1.9:-1.2))%w+w)%w,y=h*.70+((i*17-t*(.5+i%3*.2))%(h*.29)+h*.29)%(h*.29);c.globalAlpha=(.2+.3*Math.sin(t*.7+i)**2)*(p?Math.min(1,a.day+.2):.45);rect(x+this.parallax,y,i%5===0?2:1,1,i%3?'#f4d6b4':'#e8b4c5')}c.globalAlpha=1;
  if(!this.lakeArt&&n>.2&&this.viewpoint==='lake')for(let i=0;i<(this.reduced?5:11);i++){const x=12+(i*43)%(w-24)+Math.sin(t*.23+i*2)*3,y=h-8-(i*17)%36+Math.sin(t*.32+i)*2,alpha=n*(.08+.5*Math.sin(t*.49+i*1.9)**6);c.fillStyle='#e3dfb7';c.globalAlpha=alpha;c.fillRect(Math.round(x*2)/2,Math.round(y*2)/2,.5,.5);c.globalAlpha=alpha*.08;c.fillRect(x-1,y-1,2.5,2.5)}c.globalAlpha=1;
  if(this.lakeArt){this.lakeArt.drawActors(c,a,p,t,offset);this.lakeArt.ambient(c,a,p,t,offset)}else{const girl=this.textures.get(outfitKey(this.profile)).getSourceImage(),cat=this.textures.get('cat').getSourceImage();const arrival=roofArrival(this.arrivalTime),walking=this.arriving&&arrival.walking;c.drawImage(girl,walking?arrival.frame*32:0,120,32,40,99+offset+(this.arriving?arrival.xOffset:0),h-70+(this.arriving?arrival.topOffset:0),22,28);
  // Same witch cat: sleeping silhouette, wake-up stretch, then a little morning walk.
  const catX=127+offset+(p>.84?Math.sin((p-.84)*12)*6:0),stretch=p>.63&&p<.85?Math.sin((p-.63)/.22*Math.PI):0;const catH=p<.63&&!(this.catAwakeUntil>t)?13:18-stretch*4;c.drawImage(cat,0,0,40,40,catX,h-28-catH,21+stretch*4,catH);if(p<.63&&!(this.catAwakeUntil>t)){rect(catX+6,h-33,2,1,'#c2a3ba');rect(catX+12,h-33,2,1,'#c2a3ba')}}
  this.birds=[];if(p>.68){for(let i=0;i<3;i++){const bx=((t*13+i*29)%270)-25,by=h*.56-i*7+Math.sin(t*2+i)*2;const wing=Math.sin(t*5+i)>0?1:-1;this.birds.push({x:bx,y:by});rect(bx,by,1,1,a.mid);rect(bx-2,by-wing,2,1,a.mid);rect(bx+1,by-wing,2,1,a.mid)}}
  if(this.profile.romance.personalStar&&this.profile.romance.starPlace==='sky')drawJewel(c,w*.15,h*.21,{alpha:n,time:t,phase:2.1,major:true,color:'#f3d8b5'});
  if(this.viewpoint==='window'){rect(0,0,8,h,'#665068');rect(w-8,0,8,h,'#665068');rect(0,h-13,w,13,'#bf9a9a');rect(8,h-16,w-16,3,'#e4c4ad');rect(0,0,17,h-20,'#a291b0');rect(w-17,0,17,h-20,'#a291b0');rect(16,0,2,h-20,'#c3a9c2');rect(w-19,0,2,h-20,'#c3a9c2')}

  c.restore();
  for(const pulse of this.touchPulses){const age=t-pulse.t;if(age>1)continue;c.globalAlpha=(1-age)*.65;for(let i=0;i<12;i++)rect(pulse.x+Math.cos(i*.524)*(4+age*13),pulse.y+Math.sin(i*.524)*(4+age*13),1,1,'#fff0ce')}c.globalAlpha=1;this.wishFlight.draw(c,w,h,{reduced:this.reduced});this.texture.refresh();
 }
 drawClouds(c,a,t){const w=this.w;for(let i=0;i<(this.reduced?3:6);i++){const cl=this.clouds[i],cx=((cl.x+t*cl.speed*.34+this.parallax*.4+w+80)%(w+100))-65,cy=cl.y,height=13+i%3*4;c.globalAlpha=.35*(1-a.day*.6);c.drawImage(cl.night,cx-cl.w,cy-height/2,cl.w*2,height);if(a.day>.05){c.globalAlpha=a.day*.45;c.drawImage(cl.day,cx-cl.w,cy-height/2,cl.w*2,height)}}c.globalAlpha=1;}
 drawMountains(c,a,p){this.mountains.draw(c,a,this.parallax)}
 prepareReflection(a,p,t){const c=this.reflectionSky.getContext('2d');c.setTransform(2,0,0,2,0,0);c.imageSmoothingEnabled=false;c.globalAlpha=1;c.drawImage(this.ctx.canvas,0,0,this.w,this.h);this.drawClouds(c,a,t);c.save();c.translate(0,Math.round(this.tilt*this.h*.035));this.drawMountains(c,a,p);if(this.lakeArt)this.lakeArt.mountains.drawForest(c,a,this.parallax);c.restore()}
 drawDistantForest(rect,a,t){
  if(this.lakeArt){this.lakeArt.mountains.drawForest(this.ctx,a,this.parallax);return}
  const c=this.ctx,w=this.w,h=this.h,shore=h*.695;
  for(let i=0;i<49;i++){const x=(i*13.73)%w,y=shore-2-Math.sin(i*1.91)*2,height=2+(i*5%6)+Math.sin(i*1.71)**2*5;c.globalAlpha=.64;c.fillStyle=a.near;c.beginPath();c.moveTo(Math.round(x),Math.round(y-height));c.lineTo(Math.round(x-2-i%2),Math.round(y));c.lineTo(Math.round(x+3),Math.round(y));c.fill()}
  c.globalAlpha=.045;c.fillStyle=a.bottom;for(let i=0;i<3;i++)pixelEllipse({r:rect},i*97-20+Math.sin(t*.035+i)*6,shore-2-i*2,74,3,a.bottom);c.globalAlpha=1;
 }
 drawLake(rect,a,p,t){
  if(this.lakeArt){this.lakeArt.water.draw(this.ctx,a,p,t);return}
  const c=this.ctx,w=this.w,h=this.h,top=Math.round(h*.695),bottom=Math.round(h*.88),height=bottom-top,rc=this.reflection.getContext('2d');
  rc.imageSmoothingEnabled=false;rc.clearRect(0,0,w*2,h*2);rc.save();rc.translate(0,(top+height)*2);rc.scale(1,-1);rc.drawImage(this.mode==='fireworks'?c.canvas:this.reflectionSky,0,h*.12*2,w*2,h*.56*2,0,0,w*2,height*2);rc.restore();
  c.globalAlpha=1;rect(0,top,w,height,mix('#243b53','#9fb7b6',a.day));
  for(let row=0;row<height;row+=2){const drift=Math.round(Math.sin(row*.44+t*.6)*(.5+row/height)*2)/2;c.globalAlpha=.29+(1-row/height)*.09;c.drawImage(this.reflection,0,(top+row)*2,w*2,4,drift,top+row,w,2)}c.globalAlpha=1;
  const sunset=this.baseHour===18,light=p>.35||sunset,reflectionX=light?w*.77:w*.85;
  for(let i=0;i<22;i++){const yy=top+3+i*(height-5)/22,spread=3+i*.7,xx=reflectionX+Math.sin(t*.65+i*1.4)*2.8;c.globalAlpha=(light?.22:.18)*(.55+.45*Math.sin(i*1.7+t*.6)**2)*(1-i/28);rect(xx-spread,yy,spread*2,1,light?'#ffd5a5':'#edd5bf');if(i%3===0)rect(xx-spread-6,yy+1,3,1,light?'#efb2a1':'#b0bbd1')}
  for(let i=0;i<(this.reduced?17:42);i++){const x=(i*37+Math.sin(t*.27+i)*6+w)%w,y=top+2+(i*17)%Math.max(2,height-4);c.globalAlpha=.04+Math.sin(t*.5+i*1.6)**2*.10;rect(x,y,3+i%5*2,1,mix('#acb6c9','#e0cfbc',a.day))}
  // A few bright stars make little broken echoes on the water, not rigid columns.
  for(let i=0;i<(this.reduced?12:28);i++){const star=this.starlight.twinkles[i];if(!star)continue;const x=star.x+Math.sin(t*.46+i)*1.5,y=top+3+((h*.67-star.y)/(h*.67))*(height-7);c.globalAlpha=a.night*(.12+.16*Math.sin(t*.65+i)**4);c.fillStyle=i%3?'#b2c9de':'#e7c9c9';c.fillRect(Math.round(x*2)/2,Math.round(y*2)/2,.5+(i%3)*.5,.5)}
  this.meteors.drawReflection(c,top,bottom);
  c.globalAlpha=1;rect(0,bottom-2,w,2,mix('#536767','#8e9c85',a.day));
  // Dark reeds on the far shore and a pale morning mist with slow parallax.
  for(let i=0;i<17;i++){const x=i*19%w,y=top+Math.sin(i*1.7)*2;rect(x,y-3,1,4,a.near);rect(x+1,y-2,3,1,a.near)}
  if(a.night>.2){c.globalAlpha=.025*a.night;for(let i=0;i<2;i++)pixelEllipse({r:rect},(i*119+t*.36)%(w+120)-45,top+3+i*4,80,3,'#bfc6dc')}
  if(p>.2&&p<.9){c.globalAlpha=.08*Math.sin((p-.2)/.7*Math.PI);for(let i=0;i<3;i++)pixelEllipse({r:rect},(i*83+t*.7)%300-35,top+8+i*5,70,4,'#f4d8cb')}
  c.globalAlpha=1;
 }
}
