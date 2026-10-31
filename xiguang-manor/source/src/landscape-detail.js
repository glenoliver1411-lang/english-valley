import {mix} from './sky-model.js';

const seeded=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const snap=v=>Math.round(v*2)/2;

// Half-grid details share the existing sky canvas's native pixels. Scanline fills
// keep slopes crisp instead of antialiasing a smooth vector illustration.
export function pixelPolygon(c,points,color){
 c.fillStyle=color;
 const lo=Math.ceil(Math.min(...points.map(p=>p[1]))*2),hi=Math.ceil(Math.max(...points.map(p=>p[1]))*2);
 for(let row=lo;row<hi;row++){
  const y=(row+.5)/2,xs=[];
  for(let i=0,j=points.length-1;i<points.length;j=i++){
   const [x1,y1]=points[j],[x2,y2]=points[i];
   if((y1<=y&&y2>y)||(y2<=y&&y1>y))xs.push(x1+(y-y1)*(x2-x1)/(y2-y1));
  }
  xs.sort((a,b)=>a-b);
  for(let i=0;i+1<xs.length;i+=2){const x=Math.round(xs[i]*2)/2,end=Math.round(xs[i+1]*2)/2;if(end>x)c.fillRect(x,row/2,end-x,.5)}
 }
}
export function landscapePainter(w,h){
 const canvas=document.createElement('canvas');canvas.width=Math.round(w*2);canvas.height=Math.round(h*2);
 const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.scale(2,2);
 return{canvas,c,r:(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(snap(x),snap(y),snap(w),snap(h))},poly:(points,color)=>pixelPolygon(c,points,color)};
}
function ellipse(p,x,y,rx,ry,color){for(let y1=-Math.ceil(ry*2);y1<=Math.ceil(ry*2);y1++){const yy=y1/2;if(Math.abs(yy)>ry)continue;const dx=Math.floor(rx*Math.sqrt(1-yy*yy/(ry*ry))*2)/2;p.r(x-dx,y+yy,dx*2+.5,.5,color)}}
function segment(p,x1,y1,x2,y2,color,width=.5){const steps=Math.ceil(Math.hypot(x2-x1,y2-y1)*2);for(let i=0;i<=steps;i++){const u=i/Math.max(1,steps);p.r(x1+(x2-x1)*u,y1+(y2-y1)*u,width,width,color)}}

function cottageWindow(p,x,y,a,night,{small=false}={}){
 const r=p.r,w=small?5:7,h=small?8:11,frame=mix(a.roof,a.wall,.18),sill=mix(a.tile,a.wall,.35);
 p.poly([[x-1,y+2],[x+1,y],[x+w-1,y],[x+w+1,y+2],[x+w+1,y+h+1],[x-1,y+h+1]],frame);
 p.poly([[x,y+2],[x+1.5,y+.5],[x+w-1.5,y+.5],[x+w,y+2],[x+w,y+h],[x,y+h]],night?a.window:mix(a.window,'#b7cbd2',.40));
 r(x+.5,y+2,.5,h-3,mix(a.window,'#fff1cd',.45));r(x+w/2,y+1,.5,h-1,frame);r(x,y+h*.51,w,.5,frame);
 // Narrow shutters, a little reveal and a stone sill give the glass depth.
 for(const side of [-2,w+1.5]){r(x+side,y+2,1.5,h-1,a.roof);r(x+side,y+3,1.5,.5,a.tile);r(x+side,y+6,1.5,.5,a.tile)}
 r(x-1.5,y+h+1,w+3,1.5,sill);r(x-1,y+h+2.5,w+2,.5,mix(frame,a.shadow,.45));
 if(night){p.c.globalAlpha=.055;ellipse(p,x+w*.5,y+h*.5,w*.9,h*.76,a.window);p.c.globalAlpha=1}
}
function flowerBox(p,x,y,w,a){
 const r=p.r;r(x,y,w,2,mix(a.roof,a.trunk,.5));r(x-.5,y,w+1,.5,a.tile);
 for(let i=0;i<5;i++){const xx=x+.5+i*(w-1)/5,yy=y-1-(i%2);r(xx,yy,1,2,a.leaf);r(xx-1,yy-.5,1,.5,a.lit);r(xx-.5,yy-1,1.5,1,a.flower);r(xx,yy-1,.5,.5,'#edd9bc')}
}
function ivy(p,x,y,length,a,dir=1){
 const r=p.r;for(let i=0;i<length;i++){const xx=x+Math.sin(i*.68)*1.5,yy=y+i*1.8;r(xx,yy,.5,2,a.leaf);p.poly([[xx,yy+1],[xx+dir*2,yy-.5],[xx+dir*3,yy+1],[xx+dir*.5,yy+2.5]],i%3?a.leaf:a.lit);if(i%5===1){r(xx-1,yy+1,1.5,1.5,a.flower);r(xx-.5,yy+1,.5,.5,'#efc8b6')}}
}

// The two familiar cottages keep their footprint and roof silhouette.
export function paintCottages(p,w,g,a,period){
 const r=p.r,night=period==='night'||period==='dusk',edge=mix(a.roof,a.trunk,.45),plaster=mix(a.wall,a.window,.08),stone=mix(a.wall2,a.grass2,.22);
 p.poly([[16,g-39],[76,g-39],[83,g-35],[83,g],[25,g+1],[16,g-4]],a.wall2);
 r(25,g-38,52,37,a.wall);r(26,g-35,49,31,plaster);
 r(76,g-36,6,34,mix(a.wall,a.wall2,.45));r(76,g-36,.5,34,mix(a.wall,a.tile,.30));
 r(17,g-3,65,3,stone);r(24,g,55,1,mix(stone,a.shadow,.3));
 for(let i=0;i<10;i++){const x=19+i*6;r(x,g-2,.5,2,a.wall2);if(i%2)r(x+1,g-3,4,.5,mix(stone,a.wall,.28))}
 // Sparse plaster joints and corner stones, rather than noise across the facade.
 for(let i=0;i<7;i++){r(25,g-32+i*4,2,.5,a.wall2);r(73,g-30+i*4,2,.5,mix(a.wall2,a.wall,.45))}
 r(17,g-39,65,3,edge);r(24,g-35,53,1,mix(edge,a.wall2,.40));
 p.poly([[9,g-39],[25,g-62],[72,g-62],[91,g-39]],edge);
 p.poly([[11,g-40],[26,g-61],[71,g-61],[88,g-40]],a.roof);
 // Staggered, gently cupped tiles, with dark laps and small moonlit corners.
 for(let row=0;row<5;row++){
  const y=g-59+row*4,start=24-row*3,end=73+row*3;
  r(start,y+2.5,end-start+2,.5,mix(a.tile,a.roof,.48));
  for(let x=start+(row%2)*4;x<end;x+=8){r(x,y,.5,2.5,mix(a.roof,edge,.35));r(x+.5,y+2,5.5,.5,mix(a.tile,a.roof,.25));r(x+5.5,y+1.5,1,.5,a.tile)}
 }
 segment(p,25,g-62,72,g-62,a.tile,1);segment(p,72,g-62,90,g-39,mix(a.tile,a.wall,.25),1);
 r(9,g-39,82,1.5,mix(a.tile,a.wall,.20));r(13,g-37.5,73,.5,edge);
 // Chimney: shaded cap, brick courses and a lit edge.
 r(62,g-73,6,16,a.wall2);r(66.5,g-72,1.5,15,a.wall);r(60,g-75,10,3,edge);r(60,g-75,10,1,a.tile);r(63,g-74,4,.5,a.shadow);
 for(let i=0;i<4;i++){r(62,g-70+i*3,4,.5,mix(a.wall,a.wall2,.4));r(63.5+i%2,g-69+i*3,.5,2,a.roof)}
 // A modest dormer in the existing roof: a tiny round star-lit window.
 r(43,g-56,12,13,a.wall2);r(44,g-55,10,11,a.wall);
 p.poly([[40,g-55],[49,g-64],[58,g-55]],edge);segment(p,49,g-64,58,g-55,a.tile,1);segment(p,40,g-55,49,g-64,mix(a.tile,a.roof,.4),.5);
 ellipse(p,49,g-50,3.5,3.5,edge);ellipse(p,49,g-50,2.5,2.5,night?a.window:mix(a.window,'#adc2d0',.45));r(49,g-52,.5,4,edge);r(47,g-50,4,.5,edge);r(45,g-44,8,1,a.tile);
 for(const x of [28,47,66]){cottageWindow(p,x,g-30,a,night);flowerBox(p,x-1,g-16,9,a)}
 // Recessed little front door beneath the central upstairs window.
 p.poly([[45,g-1],[45,g-11],[47,g-14],[52,g-14],[54,g-11],[54,g-1]],edge);
 r(46,g-11,7,10,mix(a.roof,a.trunk,.3));r(47,g-10,5,4,night?mix(a.window,a.roof,.25):a.window);r(49,g-10,.5,4,edge);r(47,g-8,5,.5,edge);r(51.5,g-4,1,.5,a.window);r(44,g-1,11,1.5,stone);r(42,g+.5,15,1.5,mix(stone,a.wall,.25));
 ivy(p,20,g-33,14,a);ivy(p,79,g-30,9,a,-1);
 for(const x of [20,36,62,80]){r(x,g-36,.5,1,edge);r(x-.5,g-35,1.5,1,a.window)}

 // Smaller lakeside gable, with tiles, decorative fascia and matching joinery.
 const cx=w-43;r(w-58,g-25,42,27,a.wall2);r(w-55,g-24,34,25,a.wall);r(w-21,g-23,5,24,mix(a.wall2,a.roof,.15));
 p.poly([[w-65,g-25],[cx,g-45],[w-9,g-25]],edge);p.poly([[w-63,g-26],[cx,g-43],[w-12,g-26]],a.roof);
 for(let i=0;i<4;i++){const y=g-39+i*4,left=cx-3-i*4,right=cx+6+i*5;r(left,y,right-left,.5,mix(a.tile,a.roof,.3));for(let x=left+3+i%2*3;x<right-2;x+=7)r(x,y-2,.5,2,mix(a.roof,edge,.4))}
 segment(p,w-65,g-25,cx,g-45,a.tile,1);segment(p,cx,g-45,w-9,g-25,mix(a.tile,a.wall,.2),1);r(w-65,g-25,56,1,a.tile);
 r(cx-3,g-31,7,5,a.wall2);ellipse(p,cx+.5,g-30,2,2,edge);ellipse(p,cx+.5,g-30,1.25,1.25,a.window);
 cottageWindow(p,w-52,g-17,a,night,{small:true});flowerBox(p,w-53,g-7,7,a);
 cottageWindow(p,w-36,g-17,a,night);flowerBox(p,w-37,g-3,9,a);
 r(w-58,g,42,2,stone);ivy(p,w-20,g-23,11,a,-1);
}

export function paintLeafClusters(p,x,y,size,a){
 const random=seeded(Math.round(x*99+y)),dark=mix(a.leaf,a.shadow,.22),medium=mix(a.leaf,a.lit,.38);
 // Overlapping organic clumps, with a single consistent upper-right light.
 for(let i=0;i<13;i++){
  const angle=i*2.4,rad=3+random()*size*.83,cx=x+Math.cos(angle)*rad,cy=y+Math.sin(angle)*rad*.64,rx=4+random()*5,ry=3+random()*4;
  ellipse(p,cx,cy,rx,ry,i%4?a.leaf:dark);
  p.poly([[cx-1,cy-ry*.65],[cx+rx*.40,cy-ry*.8],[cx+rx*.65,cy-ry*.25],[cx+1,cy-ry*.1],[cx-2,cy-ry*.3]],medium);
  for(let j=0;j<4;j++){const lx=cx+(random()-.2)*rx,ly=cy-ry*.40+random()*ry*.8;p.r(lx,ly,1.5,.5,j%3?medium:a.lit);if(j%2)p.r(lx+.5,ly-.5,.5,.5,medium)}
 }
}

// Carefully spaced, unequal peaks leave the lake's central valley open.
const RIDGES=[
 [[-.14,.606],[-.02,.589],[.055,.568],[.10,.575],[.15,.555],[.185,.561],[.235,.542],[.255,.560],[.29,.581],[.32,.596],[.37,.579],[.415,.563],[.445,.573],[.505,.611],[.55,.595],[.61,.563],[.65,.574],[.695,.541],[.72,.526],[.745,.545],[.765,.550],[.79,.582],[.84,.601],[.91,.559],[.95,.570],[1.04,.597],[1.14,.61]],
 [[-.14,.655],[-.01,.628],[.07,.618],[.125,.635],[.19,.599],[.23,.608],[.29,.649],[.36,.636],[.405,.645],[.46,.625],[.51,.65],[.57,.661],[.625,.643],[.69,.608],[.73,.624],[.78,.647],[.84,.618],[.89,.632],[.96,.605],[1.04,.626],[1.14,.651]],
 [[-.14,.68],[-.02,.657],[.06,.647],[.105,.656],[.165,.642],[.215,.654],[.27,.675],[.34,.664],[.405,.681],[.47,.672],[.53,.686],[.60,.677],[.65,.658],[.70,.663],[.76,.646],[.815,.655],[.87,.681],[.93,.667],[1.02,.650],[1.14,.678]]
];
export class MountainBackdrop{
 constructor(w,h){
  this.w=w;this.h=h;this.key='';this.renders=0;
  this.layers=RIDGES.map((ridge,index)=>{
   const points=ridge.map(([x,y])=>[x*w,y*h]),top=Math.floor(Math.min(...points.map(p=>p[1]))-2),bottom=Math.ceil(h*.706);
   const paint=landscapePainter(w+32,bottom-top+1);paint.c.translate(16,-top);
   return{points,top,bottom,paint,parallax:.22+index*.24};
  });
 }
 render(a){
  const key=[a.far,a.mid,a.near,a.bottom,Math.round(a.day*32)].join('/');if(key===this.key)return;this.key=key;this.renders++;
  const bases=[a.far,a.mid,a.near],light=mix('#c0c9e1','#f3d3b3',a.day);
  for(let layer=0;layer<this.layers.length;layer++){
   const {paint:p,points,top,bottom}=this.layers[layer],c=p.c,base=bases[layer],shadow=mix(base,bases[Math.min(layer+1,2)],.19+layer*.09),lit=mix(base,light,.055+layer*.025),random=seeded(642+layer);
   c.clearRect(-16,top,this.w+32,bottom-top+1);c.globalCompositeOperation='source-over';
   p.poly([...points,[this.w+32,bottom],[-32,bottom]],base);c.globalCompositeOperation='source-atop';
   for(let i=1;i<points.length-1;i++){
    const P=points[i],L=points[i-1],R=points[i+1];if(P[1]>=L[1]||P[1]>=R[1])continue;
    const span=R[0]-L[0],root=Math.min(bottom,P[1]+(bottom-P[1])*.88),crease=P[0]-span*.48;
    const elbow=[P[0]-span*.08,P[1]+(root-P[1])*.27],toe=[crease,root];
    p.poly([P,elbow,toe,[L[0]-5,root+5],L],shadow);
    p.poly([P,R,[R[0]+span*.22,R[1]+(root-R[1])*.76],toe,[P[0]-span*.03,P[1]+(root-P[1])*.39],elbow],lit);
    // Broken thin ridgelights: narrow, irregular and quieter in the distance.
    segment(p,P[0]+1,P[1]+1,P[0]+(R[0]-P[0])*.45,P[1]+(R[1]-P[1])*.45,mix(lit,light,.055),.5);
    segment(p,elbow[0],elbow[1],crease+(P[0]-crease)*.36,root-(root-P[1])*.16,mix(shadow,base,.44),.5);
    if(layer===0&&P[1]<this.h*.55){
     const sx=2+span*.045;p.poly([[P[0]-sx*.6,P[1]+sx*.55],P,[P[0]+sx,P[1]+sx*.9],[P[0]+sx*.45,P[1]+sx*.63],[P[0]+.5,P[1]+sx],[P[0]-sx*.12,P[1]+sx*.65]],mix(lit,light,.10));
    }
    for(let j=0;j<(layer?4:2);j++){
     const u=.29+j*.14+random()*.07,x=P[0]+(crease-P[0])*u+span*.17,y=P[1]+(root-P[1])*u,width=span*(.14+random()*.15);
     p.poly([[x,y],[x+width*.36,y-1],[x+width,y+.5],[x+width*.63,y+1.5],[x-1,y+.5]],mix(base,lit,.43));
     segment(p,x+1,y+1.5,x+width*.7,y+2,mix(base,shadow,.37),.5);
    }
   }
   // A very restrained aerial fade softens the lower faces, while their crests stay crisp.
   const haze=mix(a.far,a.bottom,.22),foot=this.h*[.63,.674,.699][layer];
   for(let y=top;y<bottom;y+=2){c.globalAlpha=Math.min(.20,Math.max(0,(y-top)/(foot-top))**2*.18);p.r(-16,y,this.w+32,2,haze)}
   c.globalAlpha=1;
   c.globalCompositeOperation='source-over';
  }
 }
 draw(c,a,parallax=0){this.render(a);for(const layer of this.layers)c.drawImage(layer.paint.canvas,Math.round(-16+parallax*layer.parallax),layer.top,this.w+32,layer.paint.canvas.height/2)}
}
