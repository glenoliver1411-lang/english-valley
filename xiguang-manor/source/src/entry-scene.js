import Phaser from 'phaser';
import {outfitKey} from './wardrobe-art.js';
import {SESSION} from './session-config.js';
import {landscape,rng,pixelEllipse} from './scenery-art.js';
import {skyPalette,mix,lerp} from './sky-model.js';
// Three short animated welcomes. Original character/cat textures are reused intact.
export class EntryScene extends Phaser.Scene{
 constructor(profile,done){super('entry');this.profile=profile;this.done=done}
 init(options){this.variant=options.variant;this.elapsed=0;this.accumulator=0;this.finished=false}
 create(){this.build();this.scale.on('resize',this.build,this);this.events.once('shutdown',()=>{this.scale.off('resize',this.build,this);this.image?.destroy();this.image=null;if(this.textures.exists('entry-canvas'))this.textures.remove('entry-canvas');this.layers=null});this.cameras.main.fadeIn(350,24,27,48)}
 build(){this.image?.destroy();if(this.textures.exists('entry-canvas'))this.textures.remove('entry-canvas');this.w=216;this.h=Math.max(240,Math.round(this.scale.gameSize.height/2));this.texture=this.textures.createCanvas('entry-canvas',this.w,this.h);this.c=this.texture.getContext();this.c.imageSmoothingEnabled=false;this.image=this.add.image(0,0,'entry-canvas').setOrigin(0).setDisplaySize(432,this.scale.gameSize.height);this.layers={night:landscape(this.w,this.h,'night'),day:landscape(this.w,this.h,'dawn')};const rand=rng(121);this.specks=Array.from({length:this.profile.scenery.lowEffects?45:90},(_,i)=>({x:rand()*this.w,y:rand()*this.h*.68,phase:rand()*6.28,speed:.5+rand(),i}));this.frame()}
 finish(){if(this.finished)return;this.finished=true;this.done()}
 update(time,delta){if(this.finished||document.hidden)return;const dt=Math.min(delta,80)/1000;this.elapsed+=dt;this.accumulator+=dt;if(this.accumulator>=1/30){this.accumulator%=1/30;this.frame()}if(this.elapsed>=SESSION.duration)this.finish()}
 frame(){if(!this.c)return;const c=this.c,w=this.w,h=this.h,t=this.elapsed,q=Math.min(1,t/SESSION.duration),v=this.variant,progress=v===2?Math.min(1,t/4.8):0,a=skyPalette(v===2?lerp(4.1,7.6,progress):22);const rect=(x,y,ww,hh,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,ww),Math.max(1,hh))},poly=(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(Math.round(x),Math.round(y)):c.moveTo(Math.round(x),Math.round(y)));c.closePath();c.fill()};c.globalAlpha=1;
  for(let y=0;y<h;y+=2)rect(0,y,w,2,mix(a.top,a.bottom,Math.min(1,y/(h*.72))));
  for(const s of this.specks){c.globalAlpha=a.night*(.35+.4*Math.sin(t*s.speed+s.phase)**2);rect(s.x,s.y,s.i%13===0?2:1,1,'#edddc4')}c.globalAlpha=1;
  if(v!==2){const mx=174,my=h*.20;c.globalAlpha=.05;pixelEllipse({r:rect},mx,my,19,19,'#ffe1ab');c.globalAlpha=1;for(let y=-10;y<=10;y++)for(let x=-10;x<=10;x++)if(x*x+y*y<100&&(x-4)*(x-4)+(y+3)*(y+3)>80)rect(mx+x,my+y,1,1,'#f9ddb0')}
  else{const sy=lerp(h*.76,h*.50,Math.max(0,(progress-.3)/.7));c.globalAlpha=.07;pixelEllipse({r:rect},167,sy,25,25,'#ffdeaa');c.globalAlpha=1;pixelEllipse({r:rect},167,sy,11,11,'#ffe4b3')}
  // Separate mountain silhouettes, with different lighting, behind the original-style roof.
  for(let k=0;k<3;k++){const points=[[-5,h]];for(let i=0;i<12;i++)points.push([i*24-12,h*(.63+k*.055)-Math.sin(i*1.8+k)*10-(i%3)*5]);points.push([w+5,h]);poly(points,[a.far,a.mid,a.near][k])}
  c.drawImage(this.layers.night,0,0);if(v===2){c.globalAlpha=a.day;c.drawImage(this.layers.day,0,0);c.globalAlpha=1}
  if(v===0)this.letter(rect,poly,q,t);else if(v===1)this.catWelcome(rect,t,h);else this.flowers(rect,t,h,progress);
  if(q>.90){c.globalAlpha=(q-.90)/.10*.65;rect(0,0,w,h,'#28283f');c.globalAlpha=1}this.texture.refresh();
 }
 letter(rect,poly,q,t){const c=this.c,w=this.w,h=this.h,x=w/2,y=h*.51,open=Math.max(0,Math.min(1,(t-.6)/1)),lift=Math.sin(Math.min(1,open)*Math.PI/2)*27;const bob=Math.sin(t*1.3)*1.2;c.globalAlpha=.07;pixelEllipse({r:rect},x,y,47,39,'#f5d4bf');c.globalAlpha=1;
  poly([[x-37,y+5+bob],[x,y-22-open*18+bob],[x+37,y+5+bob]],'#b999b0');rect(x-33,y-4-lift+bob,66,44,'#f7e5cd');rect(x-28,y+1-lift+bob,56,1,'#d6b5aa');rect(x-24,y+9-lift+bob,43,1,'#be9ba0');rect(x-24,y+15-lift+bob,48,1,'#be9ba0');rect(x-24,y+21-lift+bob,35,1,'#be9ba0');rect(x-37,y+4+bob,74,38,'#c7a6b7');poly([[x-37,y+4+bob],[x,y+26+bob],[x+37,y+4+bob],[x+37,y+42+bob],[x-37,y+42+bob]],'#d9b5bf');poly([[x-37,y+42+bob],[x,y+17+bob],[x+37,y+42+bob]],'#e4c3c7');rect(x-4,y+25+bob,9,9,'#a87f96');rect(x-1,y+27+bob,3,5,'#f3d7b8');
  const count=this.profile.scenery.lowEffects?12:24;for(let i=0;i<count;i++){let age=Math.max(0,t-.8-i*.045),distance=age*18,angle=i*2.4;let sx=x+Math.cos(angle)*distance,sy=y-9-lift-age*13+Math.sin(angle)*distance*.6;c.globalAlpha=Math.min(1,age)*Math.max(0,1-age/4);rect(sx,sy,i%4?1:2,i%4?1:2,'#ffe8be');if(i%4===0)rect(sx-1,sy+1,4,1,'#e8c5d8')}c.globalAlpha=1;
 }
 catWelcome(rect,t,h){const c=this.c,cat=this.textures.get('cat').getSourceImage();const walk=Math.min(1,t/3.3),x=lerp(16,116,walk),floor=h*.81+9,bob=walk<1?Math.sin(t*12)*.8:0;
  for(let i=0;i<3;i++){const lx=54+i*48,ly=h-49;if(t>.45+i*.7){const alpha=Math.min(1,(t-.45-i*.7)*2);c.globalAlpha=alpha*.08;pixelEllipse({r:rect},lx,ly,19,19,'#ffda9f');c.globalAlpha=alpha;rect(lx-2,ly-3,5,7,'#ffe1a3');c.globalAlpha=1}rect(lx-1,ly+7,2,16,'#78627e')}
  c.drawImage(cat,0,0,40,40,Math.round(x-12),Math.round(floor-22+bob),27,27);if(walk<1){rect(x-5,floor+1+Math.sin(t*13)*1.5,4,2,'#69516e');rect(x+6,floor+1-Math.sin(t*13)*1.5,4,2,'#69516e')}
  const lanternX=x+17,lanternY=floor-8+Math.sin(t*2);rect(lanternX-3,lanternY-6,7,9,'#9b8099');rect(lanternX-1,lanternY-4,3,5,'#ffe0a7');c.globalAlpha=.08;pixelEllipse({r:rect},lanternX,lanternY,13,13,'#ffe0a7');c.globalAlpha=1;

 }
 flowers(rect,t,h,p){const c=this.c,girl=this.textures.get(outfitKey(this.profile)).getSourceImage();c.drawImage(girl,0,120,32,40,99,h-70,22,28);const count=this.profile.scenery.lowEffects?14:28;for(let i=0;i<count;i++){const growth=Math.max(0,Math.min(1,(t-.8-i*.045)*1.5)),x=8+(i*37)%202,y=h-9-(i*17)%42;if(x>80&&x<146)continue;const rise=growth*7,bend=Math.sin(t*.9+i)*.8;rect(x+bend,y-rise,1,rise+1,'#9aaa85');if(growth>.2){const size=1+Math.floor(growth*3);rect(x-1+bend,y-rise-2,size,3,i%3?'#e7b4c6':'#f0d4a3');rect(x+bend,y-rise-1,1,1,'#fff0c4')}const px=(i*31+t*7)%this.w,py=h*.6+((i*23-t*3)%100+100)%100;c.globalAlpha=p*.55;rect(px,py,i%3?1:2,1,i%3?'#f0dcb8':'#e7b5c8');c.globalAlpha=1}
 }
}
