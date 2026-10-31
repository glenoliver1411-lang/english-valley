import {NATURE} from './nature-config.js';
import {ROMANCE} from './romantic-config.js';
const TAU=Math.PI*2,clamp=v=>Math.max(0,Math.min(1,v));
export function flowerKind(object={}){if(object.color){const rgb=hex=>{const n=parseInt(hex.slice(1),16);return[n>>16&255,n>>8&255,n&255]},c=rgb(object.color);return ROMANCE.flowers.map(f=>({id:f.id,d:rgb(f.color).reduce((s,v,i)=>s+(v-c[i])**2,0)})).sort((a,b)=>a.d-b.d)[0].id}return ROMANCE.flowers[Math.abs(Math.round((object.x||0)*13+(object.y||0)*7))%4].id}
export class FlowerPickupEffects{
 constructor(){this.pool=Array.from({length:NATURE.flowerPool},()=>({active:false}));this.serial=0;this.low=false;this.still=false}
 emit(kind,x,y,target=null){const spec=NATURE.flowers[kind];if(!spec)return null;const b=this.pool.find(b=>!b.active)||this.pool.reduce((a,b)=>a.age>b.age?a:b);Object.assign(b,{active:true,kind,x,y,tx:target?.x??x,ty:target?.y??y-24,age:0,life:spec.duration,seed:(++this.serial)*2.39996});return b}
 update(dt,{reduced=false,still=false}={}){this.low=reduced;this.still=still;for(const b of this.pool)if(b.active){b.age+=Math.min(dt,.1);if(b.age>=b.life)b.active=false}}
 draw(rect){for(const b of this.pool){if(!b.active)continue;const spec=NATURE.flowers[b.kind],n=b.age/b.life,fade=Math.min(1,b.age*5)*Math.min(1,(1-n)*4),count=this.low?NATURE.lowParticles:NATURE.particles;
  if(!this.still){
   if(b.kind==='rose'){
    const rise=b.y-10-b.age*14,heartScale=1.0+Math.sin(Math.min(1,n*2)*Math.PI/2)*.35;for(let i=0;i<24;i++){const a=i/24*TAU,hx=16*Math.sin(a)**3,hy=-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a));rect(b.x+hx*heartScale,rise+hy*heartScale,2,2,spec.color,fade*.78)}
    for(let i=0;i<count;i++){const a=i*2.399+b.seed+b.age*2,r=5+n*24,x=b.x+Math.cos(a)*r,y=b.y-b.age*23+Math.sin(a)*r*.5;rect(x,y,i%3?3:2,2,spec.color,fade*.8);rect(x+1,y-1,1,3,spec.light,fade*.35)}
   }else if(b.kind==='lily'){
    for(let ring=0;ring<3;ring++){const q=clamp(n*1.4-ring*.18),radius=6+q*31;for(let i=0;i<20;i++){if(i%5===0)continue;const a=i/20*TAU;rect(b.x+Math.cos(a)*radius,b.y-8-b.age*10+Math.sin(a)*radius*.45,2,1,spec.color,fade*(1-q)*.7)}}
    for(let i=0;i<count/2;i++){const a=i*2.4+b.seed,x=b.x+Math.cos(a)*(5+n*23),y=b.y-16-Math.sin(a)*10-b.age*10+n*n*24;rect(x,y,1,3,spec.light,fade*.8);rect(x-1,y+2,3,1,spec.color,fade*.5)}
   }else if(b.kind==='aster'){
    for(let i=0;i<(this.low?5:8);i++){const a=i*TAU/8+b.seed+b.age*2.8,r=7+n*27,x=b.x+Math.cos(a)*r,y=b.y-12-b.age*13+Math.sin(a)*r*.6;rect(x-2,y,5,1,spec.color,fade*.85);rect(x,y-2,1,5,spec.color,fade*.85);rect(x,y,1,1,spec.light,fade);for(let k=1;k<4;k++){const lag=a-k*.13;rect(b.x+Math.cos(lag)*r,b.y-12-b.age*13+Math.sin(lag)*r*.6,1,1,spec.color,fade*(1-k/4)*.5)}}
   }else{
    for(let i=0;i<count;i++){const a=i*2.4+b.seed,x=b.x+Math.cos(a)*(5+n*25)+Math.sin(b.age*3+i)*5,y=b.y-n*(34+i%4*8)+Math.sin(a)*5,shine=(.4+.6*Math.sin(b.age*3+i)**2)*fade;rect(x-2,y-1,5,3,spec.light,shine*.07);rect(x,y,1,2,i%3?spec.light:spec.color,shine);rect(x-Math.sin(a)*2,y+5,1,1,spec.color,shine*.3)}
   }
  }
  // The picked bloom lifts from the plot to the player's hand, then dissolves.
  const q=1-(1-clamp(b.age/.85))**2,x=b.x+(b.tx-b.x)*q,y=b.y+(b.ty-b.y)*q-Math.sin(q*Math.PI)*12,alpha=fade*(1-clamp((b.age-.7)/.8));
  rect(x-3,y-1,7,3,spec.color,alpha);rect(x-1,y-3,3,7,spec.color,alpha);rect(x,y,1,1,spec.light,alpha);rect(x,y+4,1,3,'#8ba587',alpha);
 }}
}
