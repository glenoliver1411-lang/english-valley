import {painter} from './art.js';
import {mix,skyPalette} from './sky-model.js';
import {MountainBackdrop} from './landscape-detail.js';
const seeded=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
export const meadowPath=y=>({x:214+Math.sin((y-310)*.009)*28,width:8+Math.max(0,y-310)*.095});
// Original soft-petal painting. Its restrained colors share the manor's palette;
// flowers are baked into three local textures rather than emitted as particles.
export function meadowPainting(hour){
 const p=painter(432,850),r=p.r,c=p.c,a=skyPalette(hour),d=a.day,random=seeded(909);
 for(let y=0;y<340;y+=2)r(0,y,432,2,mix(a.top,a.bottom,Math.min(1,y/325)));
 if(a.night>.1){for(let i=0;i<92;i++)r(12+random()*408,25+random()*175,1,1,mix(a.top,'#e6d8d1',.3+random()*.4));for(let y=-12;y<=12;y++)for(let x=-12;x<=12;x++)if(x*x+y*y<144&&(x-5)*(x-5)+(y+3)*(y+3)>104)r(351+x,101+y,1,1,'#f5ddba')}
 new MountainBackdrop(432,450).draw(c,a);
 for(let y=305;y<850;y+=2){const t=(y-305)/545,near=mix('#40585b','#829a7e',d),far=mix('#6d7588','#b8c1a4',d);r(0,y,432,2,mix(far,near,t))}
 const left=[],right=[];for(let y=315;y<=860;y+=8){const path=meadowPath(y);left.push([path.x-path.width/2,y]);right.unshift([path.x+path.width/2,y])}p.poly([...left,...right],mix('#8b8490','#dfc9b0',d));
 for(let i=0;i<70;i++){const y=350+i*7,road=meadowPath(y);r(road.x-4+(i%3)*3,y,3+i%4,1,mix('#aa95a0','#b8a98f',d))}
 const colors=['#edb6cc','#c5b4dd','#f5e4d8','#dcb4c7'],night=['#b59cb7','#a69ac2','#d0c4ca','#b398b4'];
 const flower=(x,y,size,color,phase)=>{
  const stem=mix('#627b71','#799779',d);r(x,y-size*5,1,size*5,stem);r(x-size*2,y-size*2,size*2,1,stem);c.fillStyle=color;
  for(let j=0;j<5;j++){const angle=j*Math.PI*.4+phase,px=x+Math.cos(angle)*size*1.8,py=y-size*5+Math.sin(angle)*size*1.3;c.beginPath();c.ellipse(px,py,size*1.55,size*.9,angle,0,Math.PI*2);c.fill()}
  c.fillStyle=mix('#d9c9a0','#f2d19b',d);c.beginPath();c.ellipse(x,y-size*5,size*.85,size*.7,0,0,Math.PI*2);c.fill();
 };
 // Low ribbons of bloom color read as a sea of flowers even on a small phone.
 for(let row=0;row<13;row++)for(let i=0;i<27;i++){const x=i*17+(row%2)*8,y=326+row*37+Math.sin(i*.53+row*.7)*15,road=meadowPath(y);if(Math.abs(x-road.x)<road.width/2+12||x>278&&x<393&&y>540&&y<622||x>55&&x<151&&y>614&&y<689)continue;c.globalAlpha=.22;c.fillStyle=mix(mix('#6c7583','#b2a4b9',d),mix(night[row%4],colors[row%4],d),.28);c.beginPath();c.ellipse(x,y,12+row*.6,3+row*.18,0,0,Math.PI*2);c.fill();c.globalAlpha=1}
 for(let i=0;i<4800;i++){
  const y=314+random()*537,x=-5+random()*442,road=meadowPath(y),depth=(y-314)/536;
  if(Math.abs(x-road.x)<road.width/2+5||x>278&&x<393&&y>540&&y<622||x>55&&x<151&&y>614&&y<689)continue;
  const band=Math.floor((y+Math.sin(x*.015)*40)/70)%4,size=.42+depth*1.17,flowerColor=mix(night[band],colors[band],d);
  flower(x,y,size,flowerColor,random()*3);
 }
 // Fuller, asymmetric foreground bouquets frame the walk instead of blocking it.
 for(const [cx,cy]of [[19,811],[411,820],[28,701],[414,650]])for(let i=0;i<23;i++){const x=cx+(random()-.5)*63,y=cy+(random()-.5)*49;flower(x,y,.95+random()*.5,mix(night[i%4],colors[i%4],d),random()*3)}
 // A small bench, a linen picnic blanket and a basket of flowers are real interactions.
 for(let i=0;i<3;i++){r(301,554+i*7,81,4,'#bfa1ac');r(303,554+i*7,77,1,'#e0c2bc')}r(300,575,84,7,'#c6a5ad');r(305,580,4,18,'#7b687a');r(375,580,4,18,'#7b687a');r(309,577,65,1,'#f0d4c1');
 p.poly([[55,628],[133,614],[150,673],[71,690]],mix('#ba9aab','#e6bfd0',d));
 for(let i=0;i<7;i++){const y=630+i*8;r(68+i*2,y,64,1,'#f0d7cb');r(77+i*9,627,1,45,'#e8cad0')}r(70,625,15,17,'#9e7f86');r(72,624,11,2,'#d4b096');r(75,620,5,4,'#d4b096');r(105,638,8,7,'#eedbc4');r(104,645,13,2,'#e2c1ad');
 for(let i=0;i<6;i++)flower(73+i*2,626,1,colors[i%4],i);
 // Gentle shore shrubs and low field stones keep the horizon grounded.
 for(let i=0;i<24;i++){const x=i*19,y=305+Math.sin(i*.8)*5;r(x,y,7+i%4*2,2,mix(a.near,'#a8b699',d*.35));r(x+2,y-2,5,2,mix(a.near,'#9baa92',d*.25))}
 return p.canvas;
}
