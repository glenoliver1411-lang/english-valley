import {NATURE} from './nature-config.js';
import {mix} from './sky-model.js';
const seeded=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
export function grassMask(canvas,colors){const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height,data=c.getImageData(0,0,w,h).data,allowed=new Set(colors.map(x=>parseInt(x.slice(1),16)));return(x,y)=>{x=Math.round(x);y=Math.round(y);if(x<0||x>=w||y<0||y>=h)return false;const i=(y*w+x)*4;return allowed.has((data[i]<<16)|(data[i+1]<<8)|data[i+2])}}
export class WindMeadow{
 constructor(width,height,{mask=()=>true,count=NATURE.grass.count,seed=731,scale=1,minY=0,maxY=height}={}){
  this.time=0;this.scale=scale;this.random=seeded(seed);this.tufts=[];this.pool=Array.from({length:NATURE.grass.pool},()=>({active:false}));this.next=0.5;this.low=false;this.still=false;
  for(let i=0;i<count*30&&this.tufts.length<count;i++){const x=8+this.random()*(width-16),y=minY+this.random()*(maxY-minY);if(!mask(x,y)||!mask(x,y-4*scale))continue;this.tufts.push({x,y,height:(5+this.random()*6)*scale,phase:this.random()*6.28})}
 }
 range([a,b]){return a+(b-a)*this.random()}
 update(dt,{reduced=false,still=false}={}){this.low=reduced;this.still=still;if(still)return;dt=Math.min(dt,.1);this.time+=dt;for(const p of this.pool)if(p.active){p.age+=dt;if(p.age>=p.life)p.active=false}if(this.time>=this.next&&this.tufts.length){this.next=this.time+this.range(NATURE.grass.interval)*(reduced?1.8:1);const max=reduced?NATURE.grass.lowPool:this.pool.length;if(this.pool.filter(p=>p.active).length<max){const source=this.tufts[Math.floor(this.random()*this.tufts.length)],p=this.pool.find(p=>!p.active);if(p)Object.assign(p,{active:true,x:source.x,y:source.y-source.height,age:0,life:this.range(NATURE.grass.life),vx:this.range(NATURE.grass.speed)*this.scale,vy:-(7+this.random()*8)*this.scale,phase:this.random()*6.28})}}}
 draw(rect,{day=0,player=null,offsetX=0}={}){
  const t=this.time,s=this.scale,limit=this.low?Math.min(this.tufts.length,NATURE.grass.lowCount):this.tufts.length,stem=mix('#69877a','#a6b98c',day),tip=mix('#8da38a','#c5cd9f',day);
  for(let i=0;i<limit;i++){const v=this.tufts[i],pressure=player?Math.max(0,1-Math.hypot(v.x-player.x,v.y-player.y)/(26*s)):0,wind=this.still?0:(Math.sin(t*.75-v.x*.021+v.phase)*.65+Math.sin(t*1.3+v.y*.017)*.35),bend=wind*3.2*s+pressure*(v.x<player?.x?-3:3)*s,x=v.x+offsetX,y=v.y;
   for(let k=0;k<3;k++){const u=k/3,by=y-v.height*u;rect(x+bend*u*u,by,Math.max(.5,s),Math.max(1,v.height/3),k===2?tip:stem,.58)}
   rect(x-2*s+bend*.5,y-v.height*.58,2*s,Math.max(.5,s),stem,.6);
  }
  if(this.still)return;for(const p of this.pool){if(!p.active)continue;const u=p.age/p.life,x=p.x+p.vx*p.age+Math.sin(p.age*2+p.phase)*3*s+offsetX,y=p.y+p.vy*p.age+3.2*p.age*p.age*s,alpha=Math.sin(Math.PI*u)*.66,spin=Math.sin(p.age*3+p.phase);rect(x,y,2*s,Math.max(.5,s),tip,alpha);rect(x+(spin>0?1:-1)*s,y-s,s,Math.max(.5,s),stem,alpha*.8)}
 }
}
