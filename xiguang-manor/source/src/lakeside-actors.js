import {playFrame} from './play-assets.js';
import {landscapePainter} from './landscape-detail.js';
import {characterPainting} from './character-art.js';
import {mix} from './sky-model.js';
import {LAKESIDE} from './lakeside-config.js';

function line(p,x1,y1,x2,y2,color){const n=Math.ceil(Math.hypot(x2-x1,y2-y1)*2);for(let i=0;i<=n;i++)p.r(x1+(x2-x1)*i/n,y1+(y2-y1)*i/n,.5,.5,color)}
export function contact(p,x,y,rx,ry,color,alpha=1){p.c.save();p.c.globalAlpha=alpha;for(let i=-Math.ceil(ry*2);i<=Math.ceil(ry*2);i++){const yy=i/2;if(Math.abs(yy)>ry)continue;const width=rx*Math.sqrt(1-yy*yy/(ry*ry));p.r(x-width,y+yy,width*2,.5,color)}p.c.restore()}

// A genuine seated pose for this viewpoint, preserving her plum-brown hair,
// peach bow, lilac original outfit, and the selected wardrobe's exact colors.
export class LakesideActors {
 constructor(){this.girls=new Map();this.cats=new Map()}
 girl(profile,period){
  const id=profile.wardrobe.equipped,key=id+'/'+period+'/'+Object.values(profile.play?.equipment||{}).join(',');if(this.girls.has(key))return this.girls.get(key);
  // Crop/composite the same native seated illustration used in playable rooms.
  // Keep the approved face/hat identity through scenic views as well.
  const c=document.createElement('canvas');c.width=64;c.height=80;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(characterPainting(profile,{seated:true,back:true}),0,0);
  const eq=profile.play?.equipment||{};
  if(eq.head==='crown')ctx.drawImage(playFrame('equip-crown'),21,5,22,10);
  if(eq.hand==='ghostlamp')ctx.drawImage(playFrame('equip-ghostlamp'),40,44,10,16);
  const cropped=document.createElement('canvas');cropped.width=48;cropped.height=68;cropped.getContext('2d').drawImage(c,8,2,48,68,0,0,48,68);this.girls.set(key,cropped);return cropped;
 }

 cat(period,pose='sleep'){
  const key=period+'/'+pose;if(this.cats.has(key))return this.cats.get(key);
  const p=landscapePainter(26,18),r=p.r,a=LAKESIDE.periods[period],fur=period==='night'?['#4c405c','#7c668c','#ad91b6','#d2b4cd']:['#66516e','#a180a5','#d2adc9','#ebcede'];
  const stretch=pose==='stretch',awake=pose==='sit';
  contact(p,14,16,10,1,a.leaf[0],.5);
  p.poly(stretch?[[4,12],[9,8],[15,8],[19,11],[22,12],[22,15],[4,15]]:awake?[[9,6],[17,6],[20,10],[18,15],[7,15],[7,11]]:[[3,12],[6,8],[13,7],[20,10],[22,13],[20,16],[5,16]],fur[0]);
  p.poly(stretch?[[5,12],[10,9],[14,9],[18,12],[19,15],[5,15]]:[[4,12],[8,9],[14,9],[19,12],[19,15],[6,15]],fur[1]);
  if(awake)p.poly([[9,6],[16,7],[17,12],[15,15],[9,14]],fur[2]);
  // A curled tail, little toes and two whisker tufts avoid a squash-scaled sprite.
  line(p,19,13,23,12,fur[2]);line(p,23,12,23,15,fur[2]);line(p,23,15,19,16,fur[2]);r(21.5,13,.5,2,fur[3]);
  const hx=stretch?4:7,hy=awake?6:10;
  p.poly([[hx-3,hy+3],[hx-3,hy-2],[hx-1,hy],[hx+4,hy],[hx+6,hy-2],[hx+6,hy+4],[hx+3,hy+6],[hx,hy+5]],fur[0]);
  p.poly([[hx-2,hy+1],[hx+4,hy+1],[hx+5,hy+4],[hx+2,hy+5],[hx-1,hy+4]],fur[2]);
  r(hx-1,hy+3,1.5,.5,awake?'#e8d7a5':fur[0]);r(hx+3,hy+3,1.5,.5,awake?'#e8d7a5':fur[0]);r(hx+1.5,hy+4,.5,.5,'#efb5b7');
  line(p,hx-2,hy+4,hx-4,hy+3.5,fur[3]);line(p,hx+4,hy+4,hx+7,hy+3.5,fur[3]);
  // Same small witch hat, with its lavender band and cream buckle.
  p.poly([[hx-3,hy],[hx+1,hy-7],[hx+2,hy-3],[hx+5,hy],[hx+7,hy+1],[hx-5,hy+1]],fur[0]);r(hx-1,hy-2,5,1,'#a78cae');r(hx+1,hy-2,1,1,'#e8cf9f');r(hx-3,hy,7,.5,fur[2]);
  r(stretch?15:13,15,3,.5,fur[3]);r(stretch?20:17,15,2,.5,fur[2]);
  this.cats.set(key,p.canvas);return p.canvas;
 }
 clear(){this.girls.clear();this.cats.clear()}
}
