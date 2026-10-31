import {landscapePainter,pixelPolygon} from './landscape-detail.js';
import {mix} from './sky-model.js';
import {LAKESIDE} from './lakeside-config.js';
import {LakeMaterials,stamp} from './lakeside-materials.js';
import {LakesideMountains,LakesideWater} from './lakeside-background.js';
import {LakesideActors,contact} from './lakeside-actors.js';

function line(p,x1,y1,x2,y2,color,width=.5){const n=Math.max(1,Math.ceil(Math.hypot(x2-x1,y2-y1)*2));for(let i=0;i<=n;i++)p.r(x1+(x2-x1)*i/n,y1+(y2-y1)*i/n,width,width,color)}
function leaf(p,x,y,size,a,flip=false){p.poly([[x,y],[x+(flip?-1:1)*size,y-size*.6],[x+(flip?-1:1)*size*1.5,y],[x+(flip?-.2:.2)*size,y+size*.5]],a);p.r(x+(flip?-.7:.7)*size,y-.5,.5,.5,mix(a,'#c6c9ac',.24))}
function vine(p,x,y,length,a,dir=1){for(let i=0;i<length;i++){const xx=x+Math.sin(i*.77)*1.4,yy=y+i*1.7;p.r(xx,yy,.5,2,a.leaf[1]);if(i%2===0)leaf(p,xx,yy+1,1.8,a.leaf[i%3+1],dir<0);if(i%7===1){p.r(xx-1,yy,1.5,1.5,a.petal[1]);p.r(xx-.5,yy,.5,.5,a.petal[3])}}}
function flowerBox(p,x,y,a){p.r(x,y,13,3,a.bark[1]);p.r(x-.5,y,14,.5,a.wood[3]);p.r(x+.5,y+2.5,12,.5,a.bark[0]);for(let i=0;i<7;i++){const xx=x+1+i*1.65,yy=y-1-(i%3)*.6;p.r(xx,yy,1,3,a.leaf[1]);leaf(p,xx,yy,1.5,a.leaf[2],i%2===0);p.r(xx-.5,yy-1,1.5,1,a.petal[1+i%3]);p.r(xx,yy-1,.5,.5,a.warm)}}
function iris(p,x,y,a,height=10){line(p,x,y,x+1,y-height,a.stem);p.poly([[x,y],[x-4,y-height*.7],[x-3,y-height*.77],[x+1,y-3],[x+3,y-height*.6],[x+4,y-height*.6],[x+1,y]],a.leaf[2]);p.poly([[x-2,y-height],[x-3,y-height-3],[x-1,y-height-2],[x,y-height-4],[x+1,y-height-3],[x+3,y-height-4],[x+3,y-height-1],[x+1,y-height+1]],a.petal[1]);p.r(x,y-height-2,1,1,a.petal[3]);p.r(x-1,y-height,1,.5,a.warm)}
function fern(p,x,y,a,flip=false){for(let i=0;i<5;i++){const dir=flip?-1:1,xx=x+dir*(i-1.5)*3,yy=y-3-i%2*3;line(p,x,y,xx,yy-5,a.leaf[1]);for(let k=0;k<4;k++){const u=.2+k*.18,px=x+(xx-x)*u,py=y+(yy-5-y)*u;line(p,px,py,px+2.6*(1-u),py-1.8,a.leaf[2]);line(p,px,py,px-2.2*(1-u),py-.5,a.leaf[3])}}}

function littleCottage(p,w,g,a){
 const r=p.r,x=w-62;
 contact(p,x+27,g+2,27,3,a.leaf[0],.65);
 p.poly([[x+3,g-27],[x+41,g-27],[x+46,g-24],[x+46,g],[x+3,g]],a.wood[1]);
 p.poly([[x+7,g-26],[x+39,g-26],[x+39,g-1],[x+7,g-1]],a.wood[3]);p.poly([[x+39,g-26],[x+46,g-24],[x+46,g],[x+39,g-1]],a.wood[2]);
 for(let y=g-25;y<g-2;y+=3){r(x+7,y,31,.5,a.wood[2]);r(x+7,y+.5,31,.5,mix(a.wood[3],a.wood[4],.3));for(let k=0;k<3;k++)r(x+11+k*9+(Math.floor(y)%2),y+1,3,.5,a.wood[2])}
 p.poly([[x-5,g-27],[x+15,g-48],[x+21,g-48],[x+56,g-27],[x+53,g-25],[x-5,g-25]],a.roof[0]);
 p.poly([[x-3,g-28],[x+17,g-47],[x+21,g-47],[x+52,g-28]],a.roof[1]);
 for(let row=0;row<5;row++){const y=g-44+row*3.3,left=x+14-row*3.1,right=x+24+row*5.5;for(let xx=left+row%2*2;xx<right-3;xx+=6.5){r(xx,y,5.5,.5,a.roof[2]);r(xx,y+2.5,5.5,.5,a.roof[0]);r(xx+5.5,y+.5,.5,2,a.roof[0]);r(xx+.5,y+.5,2,.5,a.roof[3])}}
 line(p,x+20,g-48,x+55,g-27,a.roof[3]);line(p,x-4,g-26,x+54,g-26,a.wood[3]);
 p.poly([[x+11,g-27],[x+20,g-38],[x+29,g-27]],a.wood[2]);line(p,x+20,g-36,x+20,g-28,a.wood[1]);r(x+18,g-31,4,3,a.roof[0]);r(x+19,g-30,2,1,a.glass[1]);
 // An inset arched window faces the lake; slender shutters and a flower sill.
 p.poly([[x+13,g-3],[x+13,g-18],[x+15,g-20],[x+24,g-20],[x+26,g-17],[x+26,g-3]],a.wood[0]);
 p.poly([[x+15,g-4],[x+15,g-17],[x+17,g-19],[x+23,g-19],[x+24,g-16],[x+24,g-4]],a.glass[1]);r(x+16,g-16,1,10,a.glass[2]);r(x+19.5,g-18,.5,14,a.bark[1]);r(x+15,g-11,9,.5,a.bark[1]);r(x+10,g-17,2,12,a.roof[1]);r(x+27,g-17,2,12,a.roof[1]);
 r(x+33,g-17,7,11,a.wood[0]);r(x+34,g-16,5,9,a.glass[1]);r(x+36,g-16,.5,9,a.bark[1]);r(x+34,g-11,5,.5,a.bark[1]);
 flowerBox(p,x+13,g-2,a);vine(p,x+44,g-23,12,a,-1);r(x+2,g,45,2,a.stone[1]);r(x+4,g+.5,40,.5,a.stone[2]);
 // A few weathered dock boards, with space between them and moss at the bank.
 for(let i=0;i<5;i++){const xx=x-11+i*3.6;r(xx,g-6-i*.45,3,9,a.bark[1]);r(xx+.5,g-5-i*.45,.5,7,a.wood[2]);r(xx+1,g-6-i*.45,1,.5,a.wood[3])}r(x-12,g-7,2,12,a.bark[1]);r(x+8,g-8,2,11,a.bark[1]);
}

function telescope(p,h,a){
 const y=h-47,r=p.r;
 contact(p,165,y+22,15,2,a.leaf[0],.6);
 p.poly([[163,y-1],[155,y+22],[157,y+22],[166,y+3],[176,y+21],[178,y+21],[167,y-2]],a.bark[0]);
 line(p,165,y+2,165,y+23,a.bark[2],1);line(p,165,y+3,157,y+21,a.bark[3]);line(p,167,y+2,176,y+20,a.wood[1]);r(162,y-1,7,4,a.bark[1]);r(163,y-1,3,.5,a.roof[3]);
 p.poly([[148,y-9],[170,y-25],[179,y-14],[157,y+1]],a.roof[0]);
 p.poly([[149,y-10],[170,y-24],[174,y-20],[153,y-5]],a.roof[3]);
 p.poly([[153,y-5],[174,y-20],[178,y-15],[157,y]],a.roof[1]);
 p.poly([[150,y-9],[171,y-23],[172,y-21],[152,y-7]],mix(a.roof[3],a.light,.45));
 p.poly([[169,y-25],[172,y-27],[181,y-15],[178,y-13]],a.wood[2]);p.poly([[171,y-25],[174,y-24],[179,y-17],[178,y-15]],a.roof[0]);
 p.poly([[173,y-23],[175,y-22],[178,y-18],[177,y-17]],'#607f99');line(p,174,y-22,176,y-20,'#bfd9df');r(174,y-23,.5,1,a.light);
 p.poly([[147,y-9],[150,y-11],[158,y],[155,y+2]],a.wood[3]);line(p,148,y-9,155,y,a.wood[4]);r(162,y-4,2,2,a.wood[3]);r(162.5,y-4,.5,.5,a.warm);
}

function bench(p,h,a,front=false){
 const r=p.r,y=h-41;
 if(!front){
  contact(p,109,y+20,37,4,a.leaf[0],.76);contact(p,110,y+17,25,2,a.bark[0],.45);
  for(const x of [80,137]){p.poly([[x,y+8],[x+2,y+8],[x+2,y+23],[x-1,y+24],[x-1,y+22],[x,y+21]],a.bark[0]);r(x+.5,y+10,.5,11,a.bark[2])}
  r(77,y+7,65,5,a.bark[1]);r(76,y+7,67,1,a.wood[3]);r(78,y+8,63,1,a.wood[2]);r(78,y+11,63,.5,a.wood[0]);
  return;
 }
 for(let i=0;i<3;i++){
  const yy=y-8+i*5;r(78,yy,63,3.5,a.bark[0]);r(78,yy,63,2.5,a.wood[2]);r(78.5,yy,62,.5,a.wood[3]);r(79,yy+2.5,61,.5,a.wood[1]);
  for(const [x,len]of [[83+i*4,7],[106-i*2,10],[126+i*2,5]]){r(x,yy+1.5,len,.5,a.wood[1]);r(x+len,yy+1,1,.5,a.wood[3])}
  for(const x of [81,137])r(x,yy+.5,.5,.5,a.wood[4]);
 }
 for(const [x,dir]of [[78,-1],[140,1]]){r(x,y-11,1.5,25,a.bark[0]);r(x+.5,y-11,.5,24,a.bark[2]);p.poly([[x,y+2],[x+dir*6,y+2],[x+dir*8,y+5],[x+dir*7,y+8],[x+dir*5,y+8],[x+dir*6,y+5],[x,y+5]],a.bark[1]);line(p,x,y+2,x+dir*5,y+2,a.wood[3])}
 r(76,y+8,67,1.5,a.wood[2]);r(76,y+8,67,.5,a.wood[3]);
}

export class LakesideArt {
 constructor(scene,w,h){this.scene=scene;this.w=w;this.h=h;this.materials=new LakeMaterials(scene);this.actors=new LakesideActors();this.mountains=new LakesideMountains(scene,this.materials,w,h);this.water=new LakesideWater(scene,w,h);this.layers={};this.fronts={};this.windFlowers=[['daisy',22,h-18],['rose',56,h-8],['wildflower',w-47,h-27],['rose',w-18,h-11]];for(const period of Object.keys(LAKESIDE.periods)){const {back,front}=this.paint(period);this.layers[period]=back;this.fronts[period]=front}}
 paint(period){
  const w=this.w,h=this.h,g=h*.88,a=LAKESIDE.periods[period],p=landscapePainter(w,h),r=p.r;
  // A curving bank, earth, moss, and stones create a physical edge to the lake.
  const bank=[[0,g-3],[12,g-7],[26,g-4],[41,g+1],[57,g-2],[74,g-5],[88,g-1],[103,g+3],[119,g+1],[137,g-5],[155,g-8],[176,g-5],[193,g-6],[w,g-2],[w,h],[0,h]];
  p.poly(bank,a.ground);p.poly([[0,g-3],[12,g-7],[26,g-4],[41,g+1],[57,g-2],[74,g-5],[88,g-1],[103,g+3],[119,g+1],[137,g-5],[155,g-8],[176,g-5],[193,g-6],[w,g-2],[w,g],[193,g-4],[176,g-3],[155,g-6],[137,g-3],[119,g+3],[103,g+5],[88,g+1],[74,g-3],[57,g],[41,g+3],[26,g-2],[12,g-5],[0,g-1]],mix(a.moss,a.stone[0],.43));
  for(const [x,y,rx,ry]of [[20,g+9,25,7],[170,g+4,29,5],[34,h-4,29,10],[194,h-7,30,12]])contact(p,x,y,rx,ry,mix(a.ground,a.leaf[0],.45),.6);
  // Ground shadows all recede to the lower-left from the upper-right key light.
  p.poly([[13,g-3],[19,g],[3,g+18],[-10,g+18]],mix(a.ground,a.leaf[0],.7));p.poly([[w-14,g-2],[w-8,g+2],[w-42,g+22],[w-54,g+23]],mix(a.ground,a.leaf[0],.7));
  // Stepping stones retain a quiet center instead of a flat pink trapezoid.
  for(let i=0;i<5;i++){
   const yy=g+9+i*8.7,half=8+i*1.4,x=106+Math.sin(i*.8)*2;
   p.poly([[x-half,yy],[x-half+2,yy-1.5],[x+half,yy-1],[x+half+1,yy+4],[x+half-1,yy+5],[x-half-1,yy+4]],a.stone[0]);
   p.poly([[x-half+.5,yy],[x-half+2,yy-1],[x+half-.5,yy-.5],[x+half,yy+3],[x-half,yy+3]],mix(a.stone[1],a.wood[2],.26));r(x-half+2,yy+.5,half*.8,.5,a.stone[2]);line(p,x+3,yy,x+1,yy+2,a.stone[0]);r(x+half-2,yy+3.5,2,.5,a.moss);
  }
  // Hand-pixeled cottage and asymmetric trees: local CC0 sources, palette edited.
  contact(p,49,g+2,39,4,a.leaf[0],.7);
  stamp(p,this.materials.image('cottage',period),11,g-67,{flip:true});
  flowerBox(p,20,g-13,a);flowerBox(p,63,g-13,a);vine(p,86,g-38,18,a,-1);vine(p,13,g-30,13,a);
  r(43,g+.5,16,2,a.stone[1]);r(41,g+2,20,2,a.stone[0]);r(42,g+2,18,.5,a.stone[2]);
  littleCottage(p,w,g,a);
  // Native one-pixel leaf clusters and branching replace repeated circular clumps.
  stamp(p,this.materials.image('oak',period),-26,g-81,{flip:true});
  stamp(p,this.materials.image('rowan',period),w-27,g-77,{flip:true});
  vine(p,1,g-36,16,a);vine(p,w-7,g-45,14,a,-1);
  // Shore rocks occupy unequal small groups, never an evenly tiled border.
  for(const [x,y,s]of [[3,g+4,.65],[84,g+5,.5],[147,g-4,.65],[w-9,g+2,.7]])stamp(p,this.materials.image('shore-rock',period),x,y,{scale:s});
  for(const [x,y,s]of [[3,h-5,1],[22,h-13,.8],[39,h-6,.9],[61,h-3,.8],[w-34,h-8,.9],[w-15,h-17,1],[w-5,h-1,.8]])stamp(p,this.materials.image('grass-fan',period),x,y-8,{scale:s,flip:x>100});
  for(const [x,y]of [[12,g+7],[92,g+9],[145,g+4],[w-18,g+8],[57,h-5],[152,h-3]])stamp(p,this.materials.image('grass-tuft',period),x,y);
  fern(p,16,h-4,a);fern(p,w-12,h-3,a,true);fern(p,53,h+1,a,true);iris(p,w-31,h-9,a,13);iris(p,35,h-12,a,9);
  const blooms=[['rose',2,h-15],['pink-cosmos',9,h-25],['daisy',22,h-18],['bellflower',31,h-30],['wildflower',39,h-11],['pink-cosmos',48,h-20],['rose',56,h-8],['daisy',64,h-17],['bellflower',w-59,h-14],['wildflower',w-47,h-27],['pink-cosmos',w-37,h-19],['daisy',w-25,h-29],['rose',w-18,h-11],['bellflower',w-8,h-23]];
  for(const [name,x,y]of blooms){contact(p,x+3,y+9,4,1,a.leaf[0],.45);if(!this.windFlowers.some(f=>f[1]===x&&f[2]===y))stamp(p,this.materials.image(name,period),x,y,{flip:x%3===0})}
  // Fine ground life has scale, direction, and gaps. No uniform checker noise.
  for(let i=0;i<85;i++){const x=(i*37.513)%w,y=g+7+(i*13.71)%(h-g-8);if(x>76&&x<146)continue;const shade=i%4?mix(a.moss,a.ground,.5):a.moss;r(x,y,1,.5,shade);if(i%5===0)r(x+.5,y-.5,.5,.5,shade)}
  bench(p,h,a);telescope(p,h,a);
  // The original clickable lantern stays in the same physical position.
  r(53,h-40,1.5,21,a.bark[0]);r(53.5,h-39,.5,18,a.bark[2]);r(48.5,h-51,11,2,a.bark[1]);p.poly([[49.5,h-49],[58,h-49],[57,h-39],[50.5,h-39]],a.bark[0]);r(51,h-47,5,6,a.glass[1]);r(51.5,h-46,1,4,a.glass[2]);r(53.5,h-47,.5,6,a.bark[1]);r(50,h-40,7,1,a.bark[2]);r(53,h-54,2,3,a.wood[3]);
  const front=landscapePainter(w,h);bench(front,h,a,true);
  return{back:p.canvas,front:front.canvas};
 }
 blend(c,source,a,offset=0){
  const night=this.scene.baseHour===18?'dusk':'night';c.globalAlpha=1;c.drawImage(source[night],offset,0,this.w,this.h);
  if(a.day>0&&night!=='dusk'){c.globalAlpha=Math.min(1,a.day*1.7);c.drawImage(source.dawn,offset,0,this.w,this.h);c.globalAlpha=Math.max(0,(a.day-.58)/.42);c.drawImage(source.day,offset,0,this.w,this.h)}c.globalAlpha=1;
 }
 drawActors(c,a,p,t,offset){
  const period=this.scene.baseHour===18?'dusk':a.day>.8?'day':a.day>.25?'dawn':'night',palette=LAKESIDE.periods[period],painter={c,r:(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x*2)/2,Math.round(y*2)/2,w,h)}};
  // Feet, seat and body have separate contact shadows; the backrest occludes her.
  contact(painter,110+offset,this.h-33,9,1.5,palette.bark[0],.8);
  c.drawImage(this.actors.girl(this.scene.profile,period),98+offset,this.h-68,24,34);
  this.blend(c,this.fronts,a,offset);
  const still=this.scene.profile.romance.reducedMotion,awake=this.scene.catAwakeUntil>this.scene.elapsed,cycle=still?0:t%47;
  const pose=awake?'sit':p>.65&&p<.84?'stretch':a.day>.45&&cycle>21&&cycle<25?'stretch':a.day>.45&&cycle>=25&&cycle<36?'sit':'sleep';
  const stretch=pose==='stretch'?Math.sin((p>.65?(p-.65)/.19:(cycle-21)/4)*Math.PI):0,catX=126+offset+(a.day>.6&&cycle>36?Math.sin((cycle-36)*.4)*1.5:0);
  c.drawImage(this.actors.cat(period,pose),catX,this.h-35+stretch*.3,26,18);
 }
 ambient(c,a,p,t,offset){
  const s=this.scene,still=s.profile.romance.reducedMotion,h=this.h,w=this.w,g=h*.88;
  const period=s.baseHour===18?'dusk':a.day>.8?'day':a.day>.25?'dawn':'night',palette=LAKESIDE.periods[period];
  const pt={c,poly:(points,col)=>pixelPolygon(c,points,col),r:(x,y,ww,hh,col)=>{c.fillStyle=col;c.fillRect(Math.round(x*2)/2,Math.round(y*2)/2,ww,hh)}};
  // Local glass glow and doorstep spill: cold roof, warm glass, cool ground.
  if(a.night>.1){
   for(const [x,y,rx,ry]of [[25,g-27,11,14],[70,g-27,11,14],[w-43,g-12,8,10]]){
    contact(pt,x+offset,y,rx,ry,palette.warm,a.night*.026);contact(pt,x+offset,y,rx*.6,ry*.6,palette.warm,a.night*.035);
   }
   c.globalAlpha=a.night*.065;c.fillStyle=palette.warm;c.beginPath();c.moveTo(42+offset,g-2);c.lineTo(47+offset,g-2);c.lineTo(52+offset,g+11);c.lineTo(33+offset,g+11);c.closePath();c.fill();c.globalAlpha=1;
  }
  if(!(s.profile.adventure.switches['sky-lamp']??true)){pt.r(51+offset,h-47,5,6,palette.bark[1]);pt.r(53.5+offset,h-47,.5,6,palette.bark[0])}
  else {contact(pt,54+offset,h-44,12,13,palette.warm,a.night*.028);contact(pt,54+offset,h-44,7,7,palette.warm,a.night*.045)}
  this.windFlowers.forEach(([name,x,y],i)=>{
   const image=this.materials.image(name,period),angle=still?0:Math.sin(t*(.48+i*.053)+i*2.91)*.035;
   c.save();c.translate(Math.round((x+offset+image.width/4)*2)/2,y+image.height/2);c.rotate(angle);c.drawImage(image,-image.width/4,-image.height/2,image.width/2,image.height/2);c.restore();
  });
  if(still)return;
  // Only small leaf tips move. Trunks and the cottage never rock as a whole.
  for(const [i,x,y]of [[0,3,g-50],[1,w-7,g-56],[2,9,g-62],[3,w-17,g-48]]){
   const bend=Math.round(Math.sin(t*(.38+i*.041)+i*2.7)*1.2*2)/2;
   leaf(pt,x+offset+bend,y,2+i%2,palette.leaf[2+i%2],i%2===0);
  }
  // Four reusable smoke wisps, each with a different age and a long quiet pause.
  if(t%39<27)for(let i=0;i<LAKESIDE.limits.smoke;i++){
   const u=(t*.053+i*.23)%1,x=75+offset+Math.sin(u*3+i)*1.4-u*3,y=g-68-u*21;
   contact(pt,x,y,1+u*2.5,.6+u*1.1,mix('#b5a7bc','#dfd5cb',a.day),.11*(1-u)**1.6);
  }
  // Sparse, slow, phase-offset petals and occasional fireflies stay secondary.
  for(let i=0;i<(s.reduced?3:LAKESIDE.limits.petals);i++){
   const u=(t*.014+i*.173)%1;if(u>.7)continue;const x=(i*57+u*43+Math.sin(t*.22+i)*3)%w,y=h-54+u*48-i%2*13;
   c.globalAlpha=Math.sin(u/.7*Math.PI)*.30;c.fillStyle=palette.petal[2];c.fillRect(Math.round((x+offset)*2)/2,Math.round(y*2)/2,1,.5);
  }c.globalAlpha=1;
  if(a.night>.35)for(let i=0;i<(s.reduced?2:LAKESIDE.limits.fireflies);i++){
   const phase=Math.max(0,Math.sin(t*(.29+i*.019)+i*2.31))**9,x=22+i*43+Math.sin(t*.17+i)*3+offset,y=h-23-i%3*10+Math.sin(t*.23+i*2)*2;
   c.globalAlpha=phase*.55;c.fillStyle='#e2dcad';c.fillRect(Math.round(x*2)/2,Math.round(y*2)/2,.5,.5);c.globalAlpha=phase*.035;c.fillRect(x-1,y-1,2.5,2.5);
  }c.globalAlpha=1;
 }
 destroy(){this.materials.clear();this.actors.clear();this.mountains.clear();this.water.clear();this.layers=null;this.fronts=null}
}
