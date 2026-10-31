import {WORLD} from './world-config.js';
// Original translucent auroral curtains: broken vertical rays, a folded lower
// edge and diffuse higher veils. Based on NOAA's curtain/ray descriptions;
// no photograph, full-screen filter, neon stroke or solid ribbon is used.
export class AuroraCurtains{
 constructor(w,h){this.w=w;this.h=h;this.canvas=document.createElement('canvas');this.canvas.width=w*2;this.canvas.height=h*2;this.ctx=this.canvas.getContext('2d');this.tick=-1;this.builds=0;this.rays=WORLD.aurora.colors.slice(0,2).map(color=>{const ray=document.createElement('canvas');ray.width=2;ray.height=128;const p=ray.getContext('2d'),g=p.createLinearGradient(0,0,0,128);g.addColorStop(0,'#b1abcf00');g.addColorStop(.28,'#b1abcf28');g.addColorStop(.65,color+'78');g.addColorStop(.9,color+'a0');g.addColorStop(1,color+'08');p.fillStyle=g;p.fillRect(0,0,2,128);return ray})}
 draw(c,{time=0,night=1,reveal=1,low=false,still=false,enabled=true,parallax=0}={}){
  if(!enabled||night<.05)return;
  const tick=still?0:Math.floor(time*(low?WORLD.aurora.lowFps:WORLD.aurora.fps));
  if(tick!==this.tick||this.low!==low){this.tick=tick;this.low=low;this.paint(still?0:time,low);this.builds++}
  c.save();c.globalAlpha=night*WORLD.aurora.opacity*(.6+.4*reveal);c.drawImage(this.canvas,Math.round(parallax*.11*2)/2,0,this.w,this.h);c.restore();
 }
 paint(t,low){
  const c=this.ctx,w=this.w,h=this.h;c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,w,h);c.imageSmoothingEnabled=false;
  const count=low?WORLD.aurora.lowRays:WORLD.aurora.rays;
  for(let layer=0;layer<3;layer++)for(let i=0;i<count;i++){
   const u=i/(count-1),x=-9+u*(w+18),fold=Math.sin(u*8.3+t*.068+layer*1.7),secondary=Math.sin(u*18.1-t*.043+layer)*.22;
   const base=h*(.315+layer*.062)+fold*h*.047+secondary*h*.045;
   const height=h*(.095+.065*(.5+.5*Math.sin(u*11.7+layer+t*.036)));
   const texture=.42+.33*Math.sin(i*.71+layer)**2+.25*Math.sin(i*.19-t*.12)**6;
   const edge=Math.sin(Math.PI*u)**.7,light=edge*texture*(layer===0?.82:layer===1?.56:.30);
   const width=Math.max(.5,(w+18)/(count-1)*1.08);
   c.globalAlpha=light*.67;
   c.drawImage(this.rays[layer%2],Math.round(x*2)/2,Math.round((base-height)*2)/2,width,height);
   // Bright folded hem stays discontinuous and narrow, without a hard outline.
   if(i%7!==0){c.globalAlpha=light*.15;c.fillStyle=WORLD.aurora.colors[layer===2?3:1];c.fillRect(Math.round(x*2)/2,Math.round(base*2)/2,width,.5)}
  }
  c.globalAlpha=1;
 }
 destroy(){this.canvas.width=this.canvas.height=1;this.ctx=null;this.rays=[]}
}
