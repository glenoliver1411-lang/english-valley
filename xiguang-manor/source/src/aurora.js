import {AURORA_PAGE as A} from './aurora-config.js';
import {sheetPoint,auroraEnvelope,auroraColor,clamp,lightNoise} from './aurora-field.js';

// Retained as a pure geometry helper for local verification.
export const auroraCurtainPoint=(u,t,layer=1)=>sheetPoint(u,t,layer===0?'far':layer===2?'wisp':'main');
export class AuroraCurtains{
 constructor(w,h){this.w=w;this.h=h;this.canvas=document.createElement('canvas');this.canvas.width=Math.round(w*2);this.canvas.height=Math.round(h*2);this.ctx=this.canvas.getContext('2d');this.tick=-1;this.builds=0;this.image=this.ctx.createImageData(this.canvas.width,this.canvas.height);this.light=new Float32Array(this.canvas.width*this.canvas.height*3)}
 draw(c,{time=0,night=1,reveal=1,low=false,still=false,enabled=true,parallax=0,strength=1}={}){
  this.visible=enabled&&night>=.05;this.night=night;if(!this.visible)return;const fps=low?A.light.lowFps:A.light.fps,tick=Math.floor((still?0:time)*fps);
  if(tick!==this.tick||this.low!==low){this.tick=tick;this.low=low;this.paint(tick/fps,low);this.builds++}
  c.save();c.globalAlpha=clamp(night*strength)*(.6+.4*reveal);c.drawImage(this.canvas,Math.round(parallax*.1),0,this.w,this.h);c.restore();
 }
 paint(time,low){
  const W=this.canvas.width,H=this.canvas.height,light=this.light;light.fill(0);const envelope=auroraEnvelope(time);this.envelope=envelope;
  // Integrate emission through bent filaments on three different meshes. The
  // light buffer contains radiance, not opaque green shapes. Pixels at a fold
  // accumulate naturally; the unlit sky stays fully transparent.
  for(const[layer,gain,count]of [['far',.48,low?150:240],['main',1.62,low?440:740],['wisp',.65,low?130:220]]){
   for(let i=0;i<count;i++){
    const u=i/(count-1),p=sheetPoint(u,time,layer),next=sheetPoint(Math.min(1,u+1/(count-1)),time,layer),spread=Math.max(.55,Math.min(2.1,Math.abs(next.x-p.x)*W*1.12));
    const localReveal=clamp(envelope*1.25-(1-envelope)*u*.7),facing=.18+.82*clamp(.5+(next.x-p.x)*count*1.4),alpha=p.alpha*gain*localReveal*(layer==='main'?facing:1);
    const height=p.height*H*(layer==='main'?.7+.3*facing:1),bottom=p.lower*H,top=bottom-height;
    const colorSteps=Array.from({length:16},(_,j)=>auroraColor(u,j/15,time,layer));
    const breaks=Array.from({length:9},(_,j)=>lightNoise(u*48+3,j+time*.011)),bends=Array.from({length:9},(_,j)=>lightNoise(u*13+11,time*.012+j*2.3/8));
    // The glow diffuses up the field lines while the low hem stays crisp.
    for(let y=Math.max(0,Math.floor(top));y<Math.min(H,bottom+2);y++){
     const v=(y-top)/height;if(v<0||v>1.012)continue;
     const rise=clamp(v),emission=layer==='main'?Math.pow(rise,1.7)*(.36+.64*Math.exp(-(((rise-.84)/.17)**2))):Math.pow(rise,.85)*Math.pow(1-rise,.48)*1.1;
     const hem=layer==='main'?Math.exp(-(((v-.965)/.036)**2))*.10:0;
     const q=Math.min(7.999,rise*8),qi=Math.floor(q),qm=q-qi,breakup=.67+.33*(breaks[qi]*(1-qm)+breaks[qi+1]*qm);
     const taper=clamp((1.014-v)/.025),energy=alpha*(emission+hem)*breakup*taper;
     if(energy<.001)continue;
     const bend=p.lean*W*(1-rise)**1.25+((bends[qi]*(1-qm)+bends[qi+1]*qm)-.5)*W*.016*(1-rise);
     const x=p.x*W+bend,col=colorSteps[Math.min(15,Math.floor(rise*15))],x0=Math.floor(x),fract=x-x0;
     for(let dx=-1;dx<=2;dx++){
      const xx=x0+dx;if(xx<0||xx>=W)continue;const kernel=Math.max(0,1-Math.abs(dx-fract)/(spread+.65));if(!kernel)continue;
      const k=(y*W+xx)*3,e=energy*kernel;light[k]+=col[0]*e;light[k+1]+=col[1]*e;light[k+2]+=col[2]*e;
     }
    }
   }
  }
  const pixels=this.image.data;
  for(let k=0,i=0;k<light.length;k+=3,i+=4){const peak=Math.max(light[k],light[k+1],light[k+2]);if(peak<.6){pixels[i+3]=0;continue}const alpha=1-Math.exp(-peak/148);pixels[i]=Math.min(235,light[k]/peak*235);pixels[i+1]=Math.min(235,light[k+1]/peak*235);pixels[i+2]=Math.min(235,light[k+2]/peak*235);pixels[i+3]=Math.round(Math.min(.78,alpha)*255)}
  this.ctx.putImageData(this.image,0,0);
 }
 destroy(){this.canvas.width=this.canvas.height=1;this.ctx=null;this.image=null;this.light=null}
}
