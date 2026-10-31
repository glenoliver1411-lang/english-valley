// Original star art: deterministic dust, curved star clouds and faceted points.
// Coordinates remain in the 216px landscape; distant stars use a half-pixel grid.
const TAU=Math.PI*2;
const seeded=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=t=>t*t*(3-2*t);
function hash(x,y){let n=Math.imul(x,374761393)^Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295}
function noise(x,y){const ix=Math.floor(x),iy=Math.floor(y),u=smooth(x-ix),v=smooth(y-iy);const a=hash(ix,iy)*(1-u)+hash(ix+1,iy)*u,b=hash(ix,iy+1)*(1-u)+hash(ix+1,iy+1)*u;return a*(1-v)+b*v}
function cloudNoise(x,y){return noise(x,y)*.55+noise(x*2.1+33,y*2.1)*.28+noise(x*4.2,y*4.2+19)*.17}
const ridge=u=>.626-u*.52+Math.sin(u*7.1)*.022;
const snap=v=>Math.round(v*2)/2;

export function createStarField(w,h){
 const random=seeded(42917),stars=[];
 const gaussian=()=>Math.sqrt(-2*Math.log(Math.max(.0001,random())))*Math.cos(TAU*random());
 const add=(x,y,group)=>{if(x<1||x>w-1||y<3||y>h*.68)return;const value=random();stars.push({x,y,group,layer:group===0?Math.floor(random()*3):1,size:value>.995?1.2:value>.97?.85:.5,phase:random()*TAU,speed:.23+random()*.64,light:group===2?.28+random()*.45:.17+random()*.53,color:['#f9f2df','#c9d9f2','#e6d8f0','#e9c8b0'][Math.floor(random()*4)]})};
 // Open sky is sparse. Two irregular star clouds sit inside a diagonal Milky Way.
 for(let i=0;i<470;i++)add(random()*w,random()*h*.675,0);
 for(let i=0;i<890;i++){const u=random(),width=.014+.027*Math.sin(u*Math.PI)**2,x=(.055+u*.88+gaussian()*.013)*w,y=(ridge(u)+gaussian()*width)*h;add(x,y,1)}
 for(const [cx,cy,sx,sy,count]of [[.43,.405,.058,.039,155],[.69,.254,.04,.027,100],[.24,.51,.035,.026,75]])for(let i=0;i<count;i++)add((cx+gaussian()*sx)*w,(cy+gaussian()*sy)*h,2);
 return stars;
}

export function paintMilkyWay(w,h){
 const canvas=document.createElement('canvas');canvas.width=w*2;canvas.height=h*2;
 const c=canvas.getContext('2d'),image=c.createImageData(canvas.width,canvas.height),pixels=image.data;
 // Cached fine pixel clouds; fractal structure and a winding dark lane break up the band.
 for(let py=0;py<canvas.height*.70;py++)for(let px=0;px<canvas.width;px++){
  const x=px/2,y=py/2,u=(x/w-.055)/.88;if(u<-.12||u>1.12)continue;
  const n=cloudNoise(x*.043,y*.034),distance=y/h-ridge(u),width=.027+.024*Math.sin(clamp(u)*Math.PI)**2;
  const envelope=Math.exp(-distance*distance/(width*width*2))*(.3+.7*Math.sin(clamp(u)*Math.PI)**.6);
  const lane=distance-(noise(x*.027+17,3)-.5)*.042;
  const opening=1-Math.exp(-lane*lane/.000044)*(.42+.26*n);
  const density=envelope*Math.max(0,n-.16)*opening,grain=.79+hash(px,py)*.29;
  const tint=cloudNoise(x*.018+55,y*.022),i=(py*canvas.width+px)*4;
  pixels[i]=Math.round(76+tint*100);pixels[i+1]=Math.round(91+tint*33);pixels[i+2]=Math.round(145+tint*28);pixels[i+3]=Math.round(clamp(density*grain*.66)*255);
 }
 c.putImageData(image,0,0);return canvas;
}

export class Starlight {
 constructor(w,h){
  this.w=w;this.h=h;this.stars=createStarField(w,h);
  this.layers=Array.from({length:3},(_,layer)=>{
   const canvas=document.createElement('canvas');canvas.width=w*2;canvas.height=h*2;const c=canvas.getContext('2d');
   for(const s of this.stars){if(s.layer!==layer)continue;c.globalAlpha=s.light*(s.size>.5?.56:.77);c.fillStyle=s.color;c.fillRect(Math.round(s.x*2),Math.round(s.y*2),s.size>.85?2:1,1);if(s.size>1){c.globalAlpha=s.light*.08;c.fillRect(Math.round(s.x*2)-2,Math.round(s.y*2)-1,5,3)}}
   return canvas;
  });
  this.twinkles=this.stars.filter((s,i)=>s.size>.8||i%19===0).slice(0,135);
 }
 draw(c,{time=0,night=1,reveal=1,parallax=0,reduced=false}){
  if(night<.003)return;
  const alpha=night*(.44+.56*reveal);
  for(let i=0;i<3;i++){c.globalAlpha=alpha*(i===0?.69:1);c.drawImage(this.layers[i],Math.round(parallax*(.045+i*.085)*2)/2,0,this.w,this.h)}
  const count=reduced?44:this.twinkles.length;
  for(let i=0;i<count;i++){const s=this.twinkles[i],wave=.48+.32*Math.sin(time*s.speed+s.phase)+.2*Math.sin(time*s.speed*.39+s.phase*2.3),x=snap(s.x+parallax*(.045+s.layer*.085)),y=snap(s.y);c.globalAlpha=alpha*wave*s.light;c.fillStyle=s.color;c.fillRect(x,y,.5,.5);if(s.size>.85){c.globalAlpha*=.23;c.fillRect(x-.5,y,1.5,.5);c.fillRect(x,y-.5,.5,1.5)}}
  c.globalAlpha=1;
 }
}

// A luminous jewel, with a cool edge, warm heart and very fine diffraction rays.
// No circular badges: stars stay part of the sky, including the seven named stars.
export function drawJewel(c,x,y,{alpha=1,time=0,phase=0,major=false,color='#cbdcf4'}={}){
 x=snap(x);y=snap(y);const breath=.8+.12*Math.sin(time*.57+phase)+.08*Math.sin(time*.23+phase*1.7),a=alpha*breath;
 c.fillStyle=color;c.globalAlpha=a*.018;c.fillRect(x-4,y-1.5,8.5,3.5);c.fillRect(x-1.5,y-4,3.5,8.5);
 c.globalAlpha=a*.055;c.fillRect(x-2,y-1,4.5,2.5);c.fillRect(x-1,y-2,2.5,4.5);
 c.globalAlpha=a*.44;c.fillRect(x-.5,y-1.5,1.5,3.5);c.fillRect(x-1.5,y-.5,3.5,1.5);
 c.globalAlpha=a*.8;c.fillRect(x-.5,y-.5,1.5,1.5);c.fillStyle='#fff3da';c.globalAlpha=a;c.fillRect(x,y,.5,.5);
 const glint=Math.max(0,Math.sin(time*.49+phase))**20,ray=(major?3.5:2)+glint*1.6;
 c.fillStyle=major?'#f8d8b1':color;c.globalAlpha=a*(.26+glint*.3);c.fillRect(x-ray,y,ray*2+.5,.5);c.fillRect(x,y-ray,.5,ray*2+.5);
 c.globalAlpha=a*.2*glint;for(const [dx,dy]of [[-1,-1],[1,-1],[1,1],[-1,1]])c.fillRect(x+dx*1.5,y+dy*1.5,.5,.5);
 c.globalAlpha=1;
}

export function paintCloud(seed=0,day=false){
 const canvas=document.createElement('canvas');canvas.width=192;canvas.height=48;const c=canvas.getContext('2d'),image=c.createImageData(192,48),d=image.data;
 for(let y=0;y<48;y++)for(let x=0;x<192;x++){
  const u=x/191,v=y/47,n=cloudNoise(x*.034+seed*21,y*.046),center=.54+Math.sin(u*6.8+seed)*.085;
  const edge=Math.sin(u*Math.PI)**.7*Math.exp(-(((v-center)/(.12+n*.14))**2)),alpha=edge*Math.max(0,n-.16)*.7;
  const i=(y*192+x)*4;d[i]=day?243:125;d[i+1]=day?215:131;d[i+2]=day?204:165;d[i+3]=Math.round(alpha*255);
 }
 c.putImageData(image,0,0);return canvas;
}
