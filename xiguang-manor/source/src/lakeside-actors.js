import {landscapePainter} from './landscape-detail.js';
import {ADVENTURE} from './adventure-config.js';
import {mix} from './sky-model.js';
import {LAKESIDE} from './lakeside-config.js';

function line(p,x1,y1,x2,y2,color){const n=Math.ceil(Math.hypot(x2-x1,y2-y1)*2);for(let i=0;i<=n;i++)p.r(x1+(x2-x1)*i/n,y1+(y2-y1)*i/n,.5,.5,color)}
export function contact(p,x,y,rx,ry,color,alpha=1){p.c.save();p.c.globalAlpha=alpha;for(let i=-Math.ceil(ry*2);i<=Math.ceil(ry*2);i++){const yy=i/2;if(Math.abs(yy)>ry)continue;const width=rx*Math.sqrt(1-yy*yy/(ry*ry));p.r(x-width,y+yy,width*2,.5,color)}p.c.restore()}

// A genuine seated pose for this viewpoint, preserving her plum-brown hair,
// peach bow, lilac original outfit, and the selected wardrobe's exact colors.
export class LakesideActors {
 constructor(){this.girls=new Map();this.cats=new Map()}
 girl(profile,period){
  const id=profile.wardrobe.equipped,key=id+'/'+period;if(this.girls.has(key))return this.girls.get(key);
  const p=landscapePainter(24,34),r=p.r,a=LAKESIDE.periods[period],o=ADVENTURE.outfits.find(o=>o.id===id),coat=o?.coat||'#b598bc',top=o?.top||'#c5acd0',skirt=o?.skirt||'#8c6991';
  const hair=period==='night'?['#44384f','#644b62','#816075','#a18096','#c3a6b9']:period==='dusk'?['#4c394f','#705063','#956b7f','#bc8c9f','#dfb2bd']:['#564052','#785568','#a27787','#c89da9','#e6c5c7'];
  // Bent knees and the shadowed hem sit on the cushion, not above the backrest.
  p.poly([[6,25],[17,25],[20,29],[18,32],[6,32],[4,30]],mix(skirt,a.bark[0],.28));
  p.poly([[5,16],[8,14],[16,14],[19,17],[19.5,27],[17,30],[6,30],[4.5,27]],mix(coat,a.light,.10));
  r(5.5,20,1,7,mix(coat,a.bark[0],.23));r(17,18,1,9,mix(coat,a.light,.30));
  p.poly([[8,17],[16,17],[15.5,27],[8.5,27]],mix(top,a.light,.12));
  for(let y=20;y<26;y+=2.5){r(8.5,y,7,.5,mix(top,coat,.4));r(15.5,y,.5,1,mix(top,a.light,.24))}
  p.poly([[4.5,18],[6.5,17],[8,23],[10,26],[9,28],[6,26],[3.5,22]],coat);
  p.poly([[18,17],[20,18],[21,23],[18,26],[15,27],[14,25],[18,23]],mix(coat,a.light,.16));
  r(8.5,25.5,3,1.5,'#e1bcad');r(13,25.5,3,1.5,'#f4d4bd');
  // Asymmetric hair outline, small overlapping locks and broken strand lights.
  const hp=landscapePainter(24,22);
  hp.poly([[6,2.5],[8,1],[16,1],[19,3],[20.5,7],[20,14],[21,18],[19.5,21],[16,19.5],[13,21],[9,20],[6,21],[4,17.5],[4.5,8]],hair[0]);
  hp.poly([[6.5,3],[10,2],[16,2.5],[18.5,4.5],[19.5,9],[18.5,14],[19.5,18],[17.5,20],[14,18.5],[11,20],[7,18.5],[5.5,19],[5,15],[6,9]],hair[1]);
  hp.poly([[8,3.5],[13,2.5],[17.5,4],[18,9],[16,16],[17,18.5],[14.5,17],[12,19],[9,17],[7,18],[7.5,12]],hair[2]);
  hp.poly([[12,3],[16.5,3.5],[18,5],[18,8],[16.5,10],[16,7],[14,6],[12.5,7],[10,6]],hair[3]);
  for(const points of [[[18.5,8],[18,12],[17.5,14]],[[15,8],[15.5,12],[14.5,16]],[[10,10],[10.5,14],[10,17]],[[7,8],[6.5,12],[7.5,15]]])for(let i=1;i<points.length;i++)line(hp,...points[i-1],...points[i],hair[i%2?1:3]);
  hp.r(15,3.5,2.5,.5,hair[4]);hp.r(18,5,.5,2,hair[4]);
  // The existing peach ribbon is the immediately recognizable identity cue.
  hp.poly([[5,4],[10,3],[16,3.5],[19,5],[18.5,6],[15,5],[10,4.5],[5.5,5.5]],'#dab0b9');
  hp.poly([[18,3],[21,2],[22,4],[21,6],[19,5],[18.5,7],[17,6]],'#f1c4bc');hp.r(19,3,1,2,'#ffe1c8');hp.r(20.5,5,.5,2,'#bf8f9d');
  p.c.drawImage(hp.canvas,0,0,24,18.5);
  // A fine moon/sun rim on the right shoulder binds the sprite to the scene.
  r(20,18.5,.5,3,mix(coat,a.light,.55));r(18.5,24,1,.5,mix(coat,a.light,.4));
  this.girls.set(key,p.canvas);return p.canvas;
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
