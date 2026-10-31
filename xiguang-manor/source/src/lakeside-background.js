import {landscapePainter} from './landscape-detail.js';
import {mix} from './sky-model.js';
import {LAKESIDE} from './lakeside-config.js';

const noise=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n)};
function field(x,y){const ix=Math.floor(x),iy=Math.floor(y),u=x-ix,v=y-iy,s=u*u*(3-2*u),t=v*v*(3-2*v);return(noise(ix,iy)*(1-s)+noise(ix+1,iy)*s)*(1-t)+(noise(ix,iy+1)*(1-s)+noise(ix+1,iy+1)*s)*t}
const weights=(scene,a)=>scene.baseHour===18?[['dusk',1]]:[['night',1],['dawn',Math.min(1,a.day*1.7)],['day',Math.max(0,(a.day-.58)/.42)]];
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));

// Hand-pixeled CC0 mountain faces, cropped at native resolution. The three
// depth layers have separate crops, values, haze and parallax, not cloned peaks.
export class LakesideMountains {
 constructor(scene,materials,w,h){this.scene=scene;this.materials=materials;this.w=w;this.h=h;this.renders=0;this.cache=new Map();this.forests=new Map();for(const period of Object.keys(LAKESIDE.periods)){this.cache.set(period,this.build(period));this.forests.set(period,this.forest(period))}}
 build(period){
  const result=[];const palette=LAKESIDE.periods[period];
  for(const [index,x,top,tint]of [[0,215,this.h*.505,.26],[1,28,this.h*.563,.08]]){
   const p=landscapePainter(this.w+24,this.h*.715-top),image=this.materials.image('mountains-4',period),height=p.canvas.height;
   p.c.save();p.c.translate(this.w+24,0);p.c.scale(-1,1);p.c.drawImage(image,x,0,(this.w+24)*2,height,0,0,this.w+24,height/2);p.c.restore();
   p.c.globalCompositeOperation='source-atop';p.c.globalAlpha=tint;p.r(0,0,this.w+24,height/2,period==='night'?'#8790b6':period==='dusk'?'#d3a7b8':'#e4c5c5');
   // Soft air at the foot of each mass, while the irregular rock ridges stay clear.
   for(let y=0;y<height/2;y+=.5){p.c.globalAlpha=Math.min(.48,(y/(height/2))**3*.48);p.r(0,y,this.w+24,.5,palette.water[2])}
   p.c.globalAlpha=1;p.c.globalCompositeOperation='source-over';result.push({canvas:p.canvas,top,parallax:.16+index*.19});
  }
  this.renders++;return result;
 }
 forest(period){
  const p=landscapePainter(this.w+20,44),a=LAKESIDE.periods[period],dark=mix(a.leaf[0],a.water[0],.3),mid=mix(a.leaf[1],a.water[1],.2);
  const source=this.materials.image('mountains-3',period);p.c.globalAlpha=.15;p.c.drawImage(source,190,0,(this.w+20)*2,88,0,0,this.w+20,44);p.c.globalAlpha=1;
  const ridge=x=>34-9*Math.exp(-(((x-25)/38)**2))-15*Math.exp(-(((x-194)/41)**2))+Math.sin(x*.079)*1.4;
  const points=[];for(let x=-3;x<this.w+24;x+=3)points.push([x,ridge(x)]);
  p.poly([...points,[this.w+24,44],[-3,44]],mix(mid,a.water[2],.14));
  const near=[];for(let x=-3;x<this.w+24;x+=3)near.push([x,39-7*Math.exp(-(((x-28)/28)**2))-12*Math.exp(-(((x-194)/38)**2))+Math.sin(x*.111)*.8]);
  p.poly([...near,[this.w+24,44],[-3,44]],dark);
  // Three silhouettes in unequal groves: firs, rounded willow crowns and saplings.
  for(let i=0;i<59;i++){
   const x=(i*19.713)%(this.w+20),base=ridge(x)+1.5,height=1.5+noise(i,8)*6,wide=.7+noise(i,5)*1.5;
   if(x>87&&x<124&&i%3)continue;
   p.r(x,base-height*.74,.5,height*.8,dark);
   if(i%4){for(let k=0;k<4;k++){const y=base-height+k*height*.24,r=wide*(.25+k*.23);p.poly([[x,y-1],[x-r,y+height*.33],[x+wide*.13,y+height*.25],[x+r,y+height*.35]],i%3?dark:mid)}}
   else {for(const[dx,dy,r]of [[0,0,wide],[wide*.5,1,wide*.8],[-wide*.55,1.5,wide*.7]])p.poly([[x+dx-r,base-height+dy],[x+dx-r*.4,base-height+dy-2],[x+dx+r*.6,base-height+dy-1.5],[x+dx+r,base-height+dy+2],[x+dx-r,base-height+dy+3]],mid)}
  }
  return p.canvas;
 }
 draw(c,a,parallax=0){for(const[period,alpha]of weights(this.scene,a)){if(alpha<=0)continue;c.globalAlpha=alpha;for(const layer of this.cache.get(period))c.drawImage(layer.canvas,Math.round((-12+parallax*layer.parallax)*2)/2,layer.top,this.w+24,layer.canvas.height/2)}c.globalAlpha=1}
 drawForest(c,a,parallax=0){for(const[period,alpha]of weights(this.scene,a)){if(alpha<=0)continue;c.globalAlpha=alpha;c.drawImage(this.forests.get(period),Math.round((-10+parallax*.47)*2)/2,this.h*.695-41,this.w+20,44)}c.globalAlpha=1}
 clear(){this.cache.clear();this.forests.clear()}
}

export class LakesideWater {
 constructor(scene,w,h){this.scene=scene;this.w=w;this.h=h;this.top=Math.round(h*.695);this.bottom=Math.round(h*.886);this.height=this.bottom-this.top;this.cache=new Map();this.renders=0;for(const period of Object.keys(LAKESIDE.periods))this.cache.set(period,this.paint(period));this.reflect=document.createElement('canvas');this.reflect.width=w*2;this.reflect.height=this.height*2}
 paint(period){
  const width=this.w*2,height=this.height*2,canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const c=canvas.getContext('2d'),image=c.createImageData(width,height),a=LAKESIDE.periods[period],colors=Array.from({length:25},(_,i)=>rgb(mix(a.water[0],a.water[3],i/24)));
  // Broad irregular color fields establish depth first. Tiny ripples are a
  // restrained moving layer over this painting, never the whole lake texture.
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
   const depth=y/height,n=field(x*.019,y*.048),cloud=field(x*.007+7,y*.019+11),level=Math.round((.16+(1-depth)*.31+n*.11+cloud*.09)*24)/24;
   const col=colors[Math.round(level*24)],i=(y*width+x)*4;
   image.data[i]=col[0];image.data[i+1]=col[1];image.data[i+2]=col[2];image.data[i+3]=255;
  }
  c.putImageData(image,0,0);this.renders++;return canvas;
 }
 draw(c,a,p,t){
  const s=this.scene,top=this.top,bottom=this.bottom,height=this.height,w=this.w,h=this.h;
  for(const[period,alpha]of weights(s,a)){c.globalAlpha=alpha;c.drawImage(this.cache.get(period),0,top,w,height)}c.globalAlpha=1;
  const rc=this.reflect.getContext('2d');rc.setTransform(1,0,0,1,0,0);rc.clearRect(0,0,w*2,height*2);rc.imageSmoothingEnabled=false;
  rc.save();rc.translate(0,height*2);rc.scale(1,-1);rc.drawImage(s.mode==='fireworks'?c.canvas:s.reflectionSky,0,h*.402*2,w*2,h*.296*2,0,0,w*2,height*2);rc.restore();
  for(let row=0;row<height;row+=1){
   const drift=Math.round((Math.sin(row*.31+t*.47)*.55+Math.sin(row*.123-t*.27)*.6)*(row/height+.35)*2)/2;
   c.globalAlpha=(.27-row/height*.11)*(1-a.day*.23);
   c.drawImage(this.reflect,0,row*2,w*2,2,drift,top+row,w,1);
  }c.globalAlpha=1;
  const lit=s.baseHour===18||p>.35,reflectX=w*(lit?.77:.85),color=lit?'#f1c4a3':'#c7d8e8';
  // A broken, widening reflection with irregular gaps and small side echoes.
  for(let i=0;i<16;i++){
   if(i%5===2)continue;const u=i/16,y=top+5+u*(height-9),width=1.8+u*10+Math.sin(i*2.3)*1.3,x=reflectX+Math.sin(t*.43+i*1.31)*1.3;
   c.globalAlpha=(lit?.22:.15)*(1-u*.50)*(.6+.4*Math.sin(i*2.1+t*.31)**2);c.fillStyle=color;
   c.fillRect(Math.round((x-width*.5)*2)/2,Math.round(y*2)/2,width,.5);if(i%3===0){c.globalAlpha*=.4;c.fillRect(x-width*.7-3,y+1,2,.5)}
  }
  // Window light is confined to the open water alongside the cottage walls;
  // it is not a flipped copy of an entire building painted over the lake.
  for(const [x,yy,strength]of [[89,bottom-20,1],[145,bottom-25,.7]])for(let i=0;i<6;i++){
   const width=(2+i*.9)*(1+Math.sin(i*1.7+t*.39)*.16);c.globalAlpha=a.night*strength*.15*(1-i/7);c.fillStyle='#efbf8d';c.fillRect(x-width/2+Math.sin(t*.36+i),yy+i*2.3,width,.5);
  }
  // Very few changing crests. The center stays quiet for the mirrored sky.
  for(let i=0;i<(s.reduced?12:LAKESIDE.limits.waterRipples);i++){
   const x=8+(i*47.317)%(w-16),y=top+3+(i*13.31)%(height-7),phase=Math.sin(t*(.24+i%4*.023)+i*1.7);
   c.globalAlpha=.025+Math.max(0,phase)**3*.065;c.fillStyle=mix('#aac4d8','#e4c9b6',a.day);
   c.fillRect(Math.round((x+phase*.6)*2)/2,Math.round(y*2)/2,2+i%4,.5);
  }
  s.meteors.drawReflection(c,top,bottom);c.globalAlpha=1;
  const mist=p>.17&&p<.92?Math.sin((p-.17)/.75*Math.PI)*.085:.017*a.night;
  if(mist>0){for(let i=0;i<2;i++){c.globalAlpha=mist*(i?.5:1);c.fillStyle='#e2d8dc';for(let k=0;k<4;k++)c.fillRect(-35+i*97+Math.sin(t*.04+i)*9+k*12,top+4+i*8+k%2,74-k*11,.5)}}c.globalAlpha=1;
 }
 clear(){this.cache.clear();this.reflect=null}
}
