import {WORLD} from './world-config.js';
import {mix} from './sky-model.js';

const TAU=Math.PI*2;
const snap=value=>Math.round(value*2)/2;
const clamp=value=>Math.max(0,Math.min(1,value));
const rgba=(hex,alpha)=>`${hex}${Math.round(clamp(alpha)*255).toString(16).padStart(2,'0')}`;

// A projected sheet, not parallel sine-wave stripes: its horizontal folds can
// turn back on themselves, concentrating light where the curtain is edge-on.
// All movement is slow advection. Ray modulation never translates the scenery.
export function auroraCurtainPoint(u,time,layer=1){
 const phase=time*.035;
 const fold=u*TAU*1.6+phase-1.1,pleat=u*TAU*4.2-time*.047;
 const x=-.12+u*1.27+.058*Math.sin(fold)+.026*Math.sin(pleat);
 const ridge=.30+.12*Math.sin(u*TAU*.84-.46+time*.016)-u*.22;
 const lower=ridge+.020*Math.sin(u*TAU*3.2-time*.067)+.007*Math.sin(u*TAU*8.7+time*.029);
 const height=.14+.10*(.5+.5*Math.sin(u*TAU*1.23+time*.023+.6));
 const slope=1.27+.058*TAU*1.6*Math.cos(fold)+.026*TAU*4.2*Math.cos(pleat);
 if(layer===0)return{x:x-.035,lower:lower-.07,height:height*1.14,depth:.33,slope};
 if(layer===2)return{x:x+.028,lower:lower+.035+.012*Math.sin(u*TAU*2.1+1.2),height:height*.64,depth:.40*Math.sin(Math.PI*u)**2,slope};
 return{x,lower,height,depth:1,slope};
}

export class AuroraCurtains{
 constructor(w,h){
  this.w=w;this.h=h;this.canvas=document.createElement('canvas');
  this.canvas.width=w*2;this.canvas.height=h*2;this.ctx=this.canvas.getContext('2d');
  this.sheet=document.createElement('canvas');this.sheet.width=w*2;this.sheet.height=h*2;this.sheetCtx=this.sheet.getContext('2d');
  this.tick=-1;this.builds=0;
  // Fixed tiny vertical spectra. Smooth alpha within individual native pixels
  // avoids the old grid of rectangular cells, with no blur/filter pass.
  this.rays=Array.from({length:6},(_,i)=>this.spectrum(i,false));
  this.glows=Array.from({length:6},(_,i)=>this.spectrum(i,true));
 }
 spectrum(index,glow){
  const ray=document.createElement('canvas');ray.width=2;ray.height=192;
  const c=ray.getContext('2d'),g=c.createLinearGradient(0,0,0,192),a=WORLD.aurora.colors;
  const u=index/5,green=mix(a.jade,a.mint,u),pale=mix(a.mint,a.hem,u*.75);
  for(const [at,color,alpha]of glow?
   [[0,a.violet,0],[.32,a.violet,.015],[.62,green,.12],[.86,green,.30],[.96,pale,.25],[1,pale,0]]:
   [[0,a.violet,0],[.20,a.violet,.015],[.43,a.teal,.14],[.69,green,.36],[.88,green,.55],[.96,pale,.65],[.985,pale,.84],[1,green,0]]){
   g.addColorStop(at,rgba(color,alpha));
  }
  c.fillStyle=g;c.fillRect(0,0,2,192);return ray;
 }
 draw(c,{time=0,night=1,reveal=1,low=false,still=false,enabled=true,parallax=0,strength=1}={}){
  this.visible=enabled&&night>=.05;this.night=night;if(!this.visible)return;
  const fps=low?WORLD.aurora.lowFps:WORLD.aurora.fps,tick=still?0:Math.floor(time*fps);
  if(tick!==this.tick||this.low!==low){this.tick=tick;this.low=low;this.paint(still?0:tick/fps,low);this.builds++}
  c.save();c.globalAlpha=night*WORLD.aurora.opacity*clamp(strength)*(.6+.4*reveal);
  c.drawImage(this.canvas,snap(parallax*.11),0,this.w,this.h);c.restore();
 }
 paint(time,low){
  const c=this.sheetCtx,w=this.w,h=this.h,count=low?WORLD.aurora.lowRays:WORLD.aurora.rays;
  c.setTransform(2,0,0,2,0,0);c.clearRect(0,0,w,h);c.imageSmoothingEnabled=false;
  // Screen preserves the dark sky between filaments. This small cached canvas
  // is the only compositing surface; the main game does not use a glow filter.
  c.globalCompositeOperation='screen';
  for(let layer=0;layer<3;layer++)for(let i=0;i<count;i++){
   const u=i/(count-1),point=auroraCurtainPoint(u,time,layer);
   const edge=Math.sin(Math.PI*u)**.65;
   const texture=.79+.14*Math.sin(u*83.7+time*.11+layer)**2+.07*Math.sin(u*197.3-time*.18)**6;
   const foldLight=.79+.21/(.35+Math.abs(point.slope));
   const breath=.90+.10*Math.sin(u*9.7-time*.055+layer*.9);
   const alpha=clamp(edge*point.depth*texture*foldLight*breath);
   const x=snap(point.x*w),bottom=snap(point.lower*h),height=point.height*h;
   const width=Math.max(.5,Math.abs(point.slope)*w/(count-1)*1.24+.35),variant=Math.min(5,Math.floor((.5+.5*Math.sin(u*8.1+layer*.7))*5.99));
   // Broad, faint emission and a thin luminous folded hem share the same sheet.
   // Light does not become a hard continuous outline or a neon stroke.
   if(i%2===0){c.globalAlpha=alpha*.13;c.drawImage(this.glows[variant],snap(x-width),snap(bottom-height*1.03),width*3.3,height*1.05)}
   c.globalAlpha=Math.min(1,alpha*1.2);c.drawImage(this.rays[variant],x,snap(bottom-height),width*1.12,height);
  }
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
  // A 2-native-pixel diffusion of the emitted light joins adjacent filaments.
  // Only this transparent light texture is averaged; scenery stays untouched.
  const out=this.ctx;out.setTransform(2,0,0,2,0,0);out.clearRect(0,0,w,h);
  out.globalCompositeOperation='lighter';
  for(const [offset,alpha]of [[-1,.13],[-.5,.23],[0,.28],[.5,.23],[1,.13]]){
   out.globalAlpha=alpha;out.drawImage(this.sheet,offset,0,w,h);
  }
  out.globalCompositeOperation='screen';
  // A handful of unequal fine rays, rather than a grid of bright vertical bars.
  for(let i=0;i<(low?7:15);i++){
   const u=(.173+i*.61803398875)%1,p=auroraCurtainPoint(u,time),height=p.height*h;
   out.globalAlpha=.045+.045*Math.sin(i*3.7+time*.09)**2;
   out.drawImage(this.rays[i%6],snap(p.x*w),snap(p.lower*h-height),.5,height);
  }
  out.globalAlpha=1;out.globalCompositeOperation='source-over';
 }
 drawWaterReflection(c,top,bottom,{time=0,low=false}={}){
  if(!this.visible)return;const rows=low?12:22,height=bottom-top;
  c.save();for(let i=0;i<rows;i++){
   if(i%5===2)continue;const u=i/rows,sourceY=this.h*(.43-u*.36),sway=Math.sin(time*.19+i*.73)*.9;
   c.globalAlpha=this.night*.12*(1-u*.55);
   c.drawImage(this.canvas,0,Math.round(sourceY*2),this.w*2,2,snap(sway),snap(top+2+u*(height-4)),this.w,.5);
  }c.restore();
 }
 destroy(){this.canvas.width=this.canvas.height=1;this.ctx=null;this.sheet.width=this.sheet.height=1;this.sheetCtx=null;this.rays=[];this.glows=[]}
}
