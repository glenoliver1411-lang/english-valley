import {auroraBench} from './aurora-bench.js';
import {v5Frame,v5MountainSource} from './v5-assets.js';
import {mix} from './sky-model.js';

const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const random=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const period='night';

// A separate viewing composition made from the manor's existing local pixel
// originals. Flowers keep their aspect ratio and the walking map is untouched.
export function auroraMeadowPainting(w,h){
 const back=canvas(w,h),front=canvas(w,h),c=back.getContext('2d'),f=front.getContext('2d'),rng=random(71503);
 c.imageSmoothingEnabled=f.imageSmoothingEnabled=false;
 const horizon=Math.round(h*.60),ground=horizon+44,seat={x:w*.56,y:h*.81};
 c.globalAlpha=.60;c.drawImage(v5MountainSource('rock',period,true),0,0,768,240,-24,horizon-102,w+48,143);
 c.globalAlpha=1;c.drawImage(v5MountainSource('forest2',period),0,0,768,155,0,horizon-3,w,65);
 for(let y=ground;y<h;y++){c.fillStyle=mix('#53656f','#2a4248',(y-ground)/(h-ground));c.fillRect(0,y,w,1)}
 for(let i=0;i<3;i++){c.globalAlpha=.045;c.fillStyle='#abb4ce';c.beginPath();c.ellipse(i*174-25,horizon+35+i*4,172,7,0,0,Math.PI*2);c.fill()}c.globalAlpha=1;
 const path=y=>({x:w*.48+Math.sin((y-ground)*.009)*16,width:4+(y-ground)*.16});
 c.fillStyle='#747182';c.beginPath();for(let y=ground;y<=h+8;y+=5){const p=path(y);c.lineTo(p.x-p.width/2,y)}for(let y=h+8;y>=ground;y-=5){const p=path(y);c.lineTo(p.x+p.width/2,y)}c.closePath();c.fill();
 const names=['cosmos','lily','lupin','rose','daisy','tulip','bell','aster','chamomile'],flowers=[];
 for(let row=0;row<10;row++)for(let group=0;group<7;group++){
  const cy=ground+13+row*(h-ground-15)/9,cx=group*72-10+Math.sin(row*2+group)*13;
  for(let k=0;k<6;k++){
   const x=cx+(rng()-.5)*50,y=cy+(rng()-.5)*22,p=path(y),depth=Math.max(0,(y-ground)/(h-ground));
   if(Math.abs(x-p.x)<p.width/2+8||x>seat.x-54&&x<seat.x+103&&y>seat.y-25&&y<seat.y+39)continue;
   const name=row<2?['low-pink','low-blue'][k%2]:names[(row+group*2+k)%names.length],im=v5Frame('flower-'+name,{period}),width=4+depth**1.2*(18+rng()*17);
   flowers.push({x,y,im,width,height:im.height*width/im.width});
  }
 }
 flowers.sort((a,b)=>a.y-b.y);for(const v of flowers){const layer=v.y>seat.y+36?f:c;layer.drawImage(v.im,Math.round(v.x-v.width/2),Math.round(v.y-v.height),Math.round(v.width),Math.round(v.height))}
 const bench=auroraBench(),bx=Math.round(seat.x-78),by=Math.round(seat.y-48);c.drawImage(bench.base,bx,by);
 // Contact shadows, then the seated character and cat are drawn by the scene.
 c.fillStyle='#1e303c';c.globalAlpha=.34;c.beginPath();c.ellipse(seat.x+2,by+99,79,8,0,0,Math.PI*2);c.fill();c.globalAlpha=1;
 const rail=bench.front,actor={x:bx+bench.actor.x,y:by+bench.actor.y,w:bench.actor.w,h:bench.actor.h};
 const sprigs=[];for(let i=0;i<12;i++){const y=h-12-i*19%Math.max(60,(h-ground)*.48),p=path(y),x=i%2?Math.min(w-7,p.x+p.width/2+27+i*7):Math.max(4,p.x-p.width/2-25-i*9),im=v5Frame('flower-'+names[i%names.length],{period}),width=20+(y-ground)/(h-ground)*18;sprigs.push({x,y,im,width,height:im.height*width/im.width,phase:i*2.31})}
 return{back,front,rail,bench:{x:bx,y:by,seatY:by+bench.seatY},actor,seat,ground,sprigs};
}
