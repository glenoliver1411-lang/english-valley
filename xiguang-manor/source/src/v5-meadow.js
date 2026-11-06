import {v5Frame,v5Blit,v5MountainSource} from './v5-assets.js';
import {mix,skyPalette,hourPhase} from './sky-model.js';
import {meadowPath} from './meadow-art.js';
const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const random=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
export function paintV5Meadow(hour){
 const period=hourPhase(hour)==='morning'?'dawn':hourPhase(hour)==='day'?'day':hourPhase(hour)==='dusk'?'dusk':'night';const a=skyPalette(hour),out=canvas(432,850),c=out.getContext('2d');c.imageSmoothingEnabled=false;const rng=random(8053);
 for(let y=0;y<330;y++){c.fillStyle=mix(a.top,a.bottom,Math.min(1,y/310));c.fillRect(0,y,432,1)}
 if(a.night>.1){c.globalAlpha=a.night;c.fillStyle='#efdcba';for(let y=-9;y<=9;y++)for(let x=-9;x<=9;x++)if(x*x+y*y<81&&(x-4)**2+(y+3)**2>64)c.fillRect(350+x,76+y,1,1);c.globalAlpha=1}
 const rock=v5MountainSource('rock',period,true);c.globalAlpha=.78;c.drawImage(rock,0,0,768,230,-30,166,492,150);c.globalAlpha=1;c.drawImage(v5MountainSource('forest2',period),0,0,768,155,0,269,432,69);
 const grass=period==='night'?['#536773','#314e52']:period==='dusk'?['#a1a68e','#55736a']:period==='dawn'?['#bbc6a2','#67896f']:['#b4c99a','#5f916e'];for(let y=305;y<850;y++){c.fillStyle=mix(grass[0],grass[1],(y-305)/545);c.fillRect(0,y,432,1)}
 // Gently rising planted islands establish space before individual flowers.
 for(let j=0;j<7;j++){const y=325+j*73;c.globalAlpha=.15;c.fillStyle=period==='night'?'#8993a8':'#d7d4b2';c.beginPath();c.moveTo(0,y+20);c.bezierCurveTo(112,y-29,244,y+42,432,y-8);c.lineTo(432,y+50);c.bezierCurveTo(240,y+70,92,y+2,0,y+70);c.fill()}c.globalAlpha=1;
 const path=[];for(let y=316;y<=860;y+=6){const p=meadowPath(y);path.push([p.x-p.width/2,y])}for(let y=860;y>=316;y-=6){const p=meadowPath(y);path.push([p.x+p.width/2,y])}c.fillStyle=period==='night'?'#7b7a8a':period==='dusk'?'#d5b4ab':'#e8d5b6';c.beginPath();path.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();
 if(a.day>.5){c.fillStyle='#ffe7b9';c.beginPath();c.arc(350,115,14,0,Math.PI*2);c.fill()}
 const names=['cosmos','rose','lily','daisy','lupin','tulip','bell','aster','chamomile'];const flowers=[];
 // Loose clumps, not 4,800 repeats. Each island has a dominant flower plus
 // companion leaves and a different depth-scaled silhouette.
 for(let row=0;row<12;row++)for(let group=0;group<7;group++){
  const cx=group*71-12+Math.sin(row*1.7+group*.7)*15,cy=330+row*44+Math.cos(group*1.9+row)*13;
  for(let k=0;k<(row<3?8:12);k++){
   const x=cx+(rng()-.5)*(29+row*2),y=cy+(rng()-.5)*(17+row),p=meadowPath(y);
   if(Math.abs(x-p.x)<p.width/2+10||x>278&&x<395&&y>535&&y<614||x>46&&x<165&&y>603&&y<701)continue;
   const depth=Math.max(0,(y-310)/540),name=names[(row+group*3+k%3)%names.length],im=v5Frame('flower-'+name,{period}),width=3+depth**1.20*(22+rng()*14);flowers.push({x,y,im,width,height:im.height*width/im.width});
  }
 }
 for(let i=0;i<220;i++){const x=-8+rng()*448,y=328+rng()*178,p=meadowPath(y);if(Math.abs(x-p.x)<p.width/2+9)continue;const name=['low-pink','low-blue','bush-rose'][i%3],im=v5Frame('flower-'+name,{period}),width=5+(y-320)/186*(9+rng()*13);flowers.push({x,y,im,width,height:im.height*width/im.width})}
 flowers.sort((a,b)=>a.y-b.y);for(const f of flowers)c.drawImage(f.im,Math.round(f.x-f.width/2),Math.round(f.y-f.height),Math.round(f.width),Math.round(f.height));
 for(const[name,x,y,width]of [['bush-leaf',0,716,76],['bush-rose',412,789,92],['lily',18,848,52],['cosmos',80,863,58],['tulip',391,865,61],['lupin',426,723,39]]){const im=v5Frame('flower-'+name,{period});c.drawImage(im,x-width/2,y-im.height*width/im.width,width,im.height*width/im.width)}
 v5Blit(c,'meadow-bench',292,540,{period});v5Blit(c,'meadow-picnic',46,608,{period});
 if(a.day>.4&&hour<9){c.globalAlpha=.10;c.fillStyle='#fff2c8';c.beginPath();c.moveTo(365,294);c.lineTo(404,294);c.lineTo(229,850);c.lineTo(132,850);c.fill();c.globalAlpha=1}
 return out;
}
export class MeadowSprigs{
 constructor(scene){this.scene=scene;this.images=[];this.keys=new Set();const kinds=['rose','lily','cosmos','tulip','lupin','bell'];for(let i=0;i<22;i++){const y=384+(i*73.7)%445,p=meadowPath(y),side=i%2?1:-1,x=p.x+side*(p.width/2+12+(i*7)%57);if(x>278&&x<395&&y>535&&y<614||x>46&&x<165&&y>603&&y<701)continue;this.images.push({name:kinds[i%kinds.length],x,y,image:scene.add.image(x,y,'cat').setOrigin(.5,1)})}}
 update(t,hour,still){const period=hourPhase(hour)==='morning'?'dawn':hourPhase(hour)==='day'?'day':hourPhase(hour)==='dusk'?'dusk':'night';for(const [i,s]of this.images.entries()){const key='v5-sprig-'+s.name+'-'+period;if(!this.scene.textures.exists(key)){this.scene.textures.addCanvas(key,v5Frame('flower-'+s.name,{period}));this.keys.add(key)}const frame=v5Frame('flower-'+s.name,{period}),width=8+(s.y-310)/540*28;s.image.setTexture(key).setDisplaySize(width,frame.height*width/frame.width).setRotation(still?0:Math.sin(t*.56-s.y*.011+s.x*.017+i*.37)*.035).setDepth(20+s.y*.01)}}
 destroy(){this.images.forEach(s=>s.image.destroy());for(const key of this.keys)if(this.scene.textures.exists(key))this.scene.textures.remove(key);this.images=[];this.keys.clear()}
}
