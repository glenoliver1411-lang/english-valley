// Original compact tree drawing, inside the original 64×89 interaction footprint.
const seeded=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
export function leafEllipse(p,x,y,rx,ry,color){for(let dy=-Math.ceil(ry);dy<=ry;dy++){const width=Math.floor(rx*Math.sqrt(Math.max(0,1-dy*dy/(ry*ry))));p.r(x-width,y+dy,width*2+1,1,color)}}
export function treeBranch(p,points,width,color){for(let j=1;j<points.length;j++){const [x,y]=points[j-1],[xx,yy]=points[j],n=Math.max(1,Math.ceil(Math.hypot(xx-x,yy-y)));for(let i=0;i<=n;i++){const u=i/n;p.r(x+(xx-x)*u-width/2,y+(yy-y)*u-width/2,width,width,color)}}}
export function detailedTree(p,x,y,s=1,colors={}){
 const a={dark:'#3f5a60',leaf:'#4b6b69',lit:'#638174',tip:'#779486',wood:'#675565',bark:'#977b7a',...colors},random=seeded(Math.round(x*97+y*13)),r=(xx,yy,w,h,col)=>p.r(x+xx*s,y+yy*s,Math.max(1,Math.round(w*s)),Math.max(1,Math.round(h*s)),col);
 p.poly([[x-5*s,y+34*s],[x-6*s,y+15*s],[x-4*s,y-4*s],[x+4*s,y-7*s],[x+5*s,y+18*s],[x+7*s,y+35*s]],a.wood);
 p.poly([[x-2*s,y+32*s],[x-1*s,y+14*s],[x+1*s,y-3*s],[x+3*s,y-2*s],[x+2*s,y+17*s],[x+4*s,y+33*s]],a.bark);
 treeBranch(p,[[x-1*s,y+14*s],[x-13*s,y+5*s],[x-18*s,y-5*s]],3*s,a.wood);treeBranch(p,[[x+3*s,y+8*s],[x+15*s,y],[x+19*s,y-10*s]],3*s,a.wood);
 p.poly([[x-4*s,y+29*s],[x-12*s,y+35*s],[x-3*s,y+33*s],[x+6*s,y+36*s],[x+12*s,y+34*s],[x+4*s,y+28*s]],a.wood);
 for(let i=0;i<6;i++){r(-2+i%3,3+i*5,1,2,a.wood);r(1+i%2,5+i*5,1,1,a.bark)}
 const clumps=[[-17,-24,13,12],[-23,-12,8,10],[-2,-14,22,13],[18,-13,12,11],[-11,-38,14,12],[10,-40,15,12],[22,-28,9,11],[-3,-31,21,13],[11,-23,16,12]];
 for(let i=0;i<clumps.length;i++){const [dx,dy,rx,ry]=clumps[i];leafEllipse(p,x+dx*s,y+dy*s,rx*s,ry*s,i<4?a.dark:a.leaf)}
 for(let i=0;i<clumps.length;i++){const [dx,dy,rx,ry]=clumps[i];
  const lx=x+(dx+rx*.16)*s,ly=y+(dy-ry*.45)*s;p.poly([[lx-rx*.4*s,ly],[lx,ly-ry*.26*s],[lx+rx*.56*s,ly+ry*.1*s],[lx+rx*.23*s,ly+ry*.42*s],[lx-rx*.34*s,ly+ry*.27*s]],i<4?a.leaf:a.lit);
  for(let j=0;j<13;j++){const angle=random()*Math.PI*2,rad=Math.sqrt(random()),px=dx+Math.cos(angle)*rx*rad*.86,py=dy+Math.sin(angle)*ry*rad*.8;r(px,py,1+j%3,1,j%4?a.lit:a.tip);if(j%3===0)r(px+1,py-1,1,1,a.leaf)}
 }
 // Small dark gaps reveal the branch structure without outlining every leaf clump.
 r(-9,-3,4,1,a.wood);r(8,-4,3,1,a.wood);
}
