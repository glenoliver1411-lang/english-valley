import {VISTA} from './vista-config.js';
const clamp=t=>Math.max(0,Math.min(1,t));
export const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
export function roofArrival(time){const progress=clamp(time/VISTA.roofSeconds),climb=smooth((progress-.1)/.72);return{progress,climb,walking:progress>.10&&progress<.82,frame:progress>.10&&progress<.82?Math.floor(time*8)%4:0,topOffset:(1-climb)*62,xOffset:(1-climb)*4}}
export class WishFlight{
 constructor(){this.active=false;this.age=0;this.target={x:112,y:128}}
 start(target){this.age=0;this.target={...target};this.active=true}
 update(dt){if(!this.active)return;this.age+=Math.max(0,Math.min(.25,dt));if(this.age>=VISTA.wishSeconds)this.active=false}
 draw(c,w,h,{reduced=false}={}){
  if(!this.active)return;const a=this.age,target=this.target,travel=smooth(a/1.55),sx=w*.50,sy=h*.84,cx=w*.76,cy=h*.42;
  const point=q=>({x:(1-q)**2*sx+2*(1-q)*q*cx+q*q*target.x,y:(1-q)**2*sy+2*(1-q)*q*cy+q*q*target.y});
  const rect=(x,y,ww,hh,color,alpha)=>{c.fillStyle=color;c.globalAlpha=alpha;c.fillRect(Math.round(x*2)/2,Math.round(y*2)/2,ww,hh)};
  if(a<1.65){const p=point(travel),fade=Math.min(1,a/.16)*(1-smooth((a-1.42)/.23));
   for(let i=1;i<(reduced?6:11);i++){const q=Math.max(0,travel-i*.014),tail=point(q);rect(tail.x+Math.sin(i*2.4)*1.3,tail.y,.5,.5,i%2?'#dfc7e5':'#f5deb8',fade*(1-i/12)*.55)}
   rect(p.x-2.5,p.y-1.5,5,3,'#f6dfc6',fade);rect(p.x-2,p.y-1,4,.5,'#e3b9cc',fade);rect(p.x-1,p.y,2,.5,'#c49ab9',fade);rect(p.x,p.y-2,.5,1,'#fff0d4',fade);
  }
  if(a>1.3){const q=clamp((a-1.3)/2.9),pulse=Math.sin(q*Math.PI),bright=1-smooth((a-3.1)/1.1),r=4+q*17;
   rect(target.x-1,target.y,2,.5,'#fff0c9',bright);rect(target.x,target.y-1,.5,2,'#fff0c9',bright);
   for(let i=0;i<(reduced?10:18);i++){const angle=i*Math.PI*2/(reduced?10:18),xx=target.x+Math.cos(angle)*r,yy=target.y+Math.sin(angle)*r*.73;rect(xx,yy,.5,.5,i%3?'#e8cfda':'#f7dfb0',pulse*.65)}
   c.fillStyle='#f2d8bd';c.globalAlpha=pulse*.035;c.fillRect(Math.round(target.x-3),Math.round(target.y-3),6,6);
  }
  c.globalAlpha=1;
 }
}
