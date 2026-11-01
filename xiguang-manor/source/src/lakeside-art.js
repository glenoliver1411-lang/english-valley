import {landscapeWeights} from './scenery-grounding.js';
import {paintV5Lake} from './v5-landscape.js';
import {v5Frame} from './v5-assets.js';
import {landscapePainter,pixelPolygon} from './landscape-detail.js';
import {mix,hourPhase} from './sky-model.js';
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
 constructor(scene,w,h){this.scene=scene;this.w=w;this.h=h;this.materials=new LakeMaterials(scene);this.actors=new LakesideActors();this.mountains=new LakesideMountains(scene,this.materials,w,h);this.water=new LakesideWater(scene,w,h);this.layers={};this.fronts={};this.windFlowers=[];for(const period of Object.keys(LAKESIDE.periods)){const {back,front}=this.paint(period);this.layers[period]=back;this.fronts[period]=front}}
 paint(period){return paintV5Lake(this.w,this.h,period)}
 blend(c,source,a,offset=0){
  for(const[period,alpha]of landscapeWeights(this.scene,a)){if(alpha<=0)continue;c.globalAlpha=alpha;c.drawImage(source[period],offset,0,this.w,this.h)}c.globalAlpha=1;
 }
 drawActors(c,a,p,t,offset){
  const period=(hourPhase(this.scene.baseHour)==='dusk')?'dusk':a.day>.8?'day':a.day>.25?'dawn':'night',palette=LAKESIDE.periods[period],painter={c,r:(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x*2)/2,Math.round(y*2)/2,w,h)}};
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
  const period=(hourPhase(s.baseHour)==='dusk')?'dusk':a.day>.8?'day':a.day>.25?'dawn':'night',palette=LAKESIDE.periods[period];
  const pt={c,poly:(points,col)=>pixelPolygon(c,points,col),r:(x,y,ww,hh,col)=>{c.fillStyle=col;c.fillRect(Math.round(x*2)/2,Math.round(y*2)/2,ww,hh)}};
  // Local glass glow and doorstep spill: cold roof, warm glass, cool ground.
  if(a.night>.1){
   for(const [x,y,rx,ry]of [[15,g-43,11,14],[60,g-43,11,14],[w-48,g-23,8,10],[35,g-74,7,9]]){
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
  for(const [i,name,x,y]of [[0,'cosmos',20,h-9],[1,'lily',w-37,h-7],[2,'lupin',w-10,h-19]]){const im=v5Frame('flower-'+name,{period}),width=15+i*3,height=im.height*width/im.width;c.save();c.translate(x+offset,y);c.rotate(still?0:Math.sin(t*.46+i*2.4)*.03);c.drawImage(im,-width/2,-height,width,height);c.restore()}
  if(still)return;
  // Only small leaf tips move. Trunks and the cottage never rock as a whole.
  for(const [i,x,y]of [[0,3,g-50],[1,w-7,g-56],[2,9,g-62],[3,w-17,g-48]]){
   const bend=Math.round(Math.sin(t*(.38+i*.041)+i*2.7)*1.2*2)/2;
   leaf(pt,x+offset+bend,y,2+i%2,palette.leaf[2+i%2],i%2===0);
  }
  // Four reusable smoke wisps, each with a different age and a long quiet pause.
  if(t%39<27)for(let i=0;i<LAKESIDE.limits.smoke;i++){
   const u=(t*.053+i*.23)%1,x=75+offset+Math.sin(u*3+i)*1.4-u*3,y=g-101-u*21;
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
