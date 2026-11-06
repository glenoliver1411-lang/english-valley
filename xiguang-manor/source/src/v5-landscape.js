import {bindToSky,drawGroundedTree,landscapeWeights} from './scenery-grounding.js';
import {v5Frame,v5Blit,v5MountainSource} from './v5-assets.js';
import {skyPalette,mix,hourPhase} from './sky-model.js';
const canvas=(w,h)=>{const v=document.createElement('canvas');v.width=w;v.height=h;return v};
const random=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const opts=period=>({period});
export class V5Mountains{
 constructor(scene,materials,w,h){this.scene=scene;this.w=w;this.h=h;this.cache=new Map();this.forests=new Map();this.renders=0;}
 build(period){const out=canvas((this.w+24)*2,this.h*.31*2),c=out.getContext('2d');c.imageSmoothingEnabled=false;const source=v5MountainSource('rock',period,true),near=v5MountainSource('rock',period),W=out.width,H=out.height;
  // Whole authored ranges, each with a separate crop and horizon, replace the
  // old pair of mirrored repeated peaks. Native rock faces remain visible.
  const distant=canvas(W,H),d=distant.getContext('2d');d.imageSmoothingEnabled=false;d.drawImage(source,0,0,768,240,0,0,W,H*.77);bindToSky(distant,period,{far:true});const ridge=canvas(W,H),r=ridge.getContext('2d');r.imageSmoothingEnabled=false;r.drawImage(near,360,0,408,244,-W*.08,H*.24,W*.72,H*.83);r.globalCompositeOperation='destination-in';const edge=r.createLinearGradient(W*.50,0,W*.64,0);edge.addColorStop(0,'#fff');edge.addColorStop(1,'#fff0');r.fillStyle=edge;r.fillRect(0,0,W,H);c.save();c.translate(W,0);c.scale(-1,1);c.globalAlpha=1;c.drawImage(distant,0,0);c.drawImage(ridge,0,0);c.restore();bindToSky(out,period);this.renders++;return out;}
 forest(period){const out=canvas((this.w+20)*2,this.h*.11*2),c=out.getContext('2d');c.imageSmoothingEnabled=false;const W=out.width,H=out.height;c.drawImage(v5MountainSource('forest2',period,true),0,0,768,170,0,0,W,H*.95);c.drawImage(v5MountainSource('forest1',period),0,0,768,120,0,H*.34,W,H*.8);return bindToSky(out,period,{forest:true})}
 weights(a){return landscapeWeights(this.scene,a)}
 draw(c,a,parallax=0){for(const[p,alpha]of this.weights(a)){if(alpha<=0)continue;c.globalAlpha=alpha;if(!this.cache.has(p))this.cache.set(p,this.build(p));const image=this.cache.get(p);c.drawImage(image,Math.round((-12+parallax*.25)*2)/2,this.h*.414,this.w+24,image.height/2)}c.globalAlpha=1}
 drawForest(c,a,parallax=0){for(const[p,alpha]of this.weights(a)){if(alpha<=0)continue;c.globalAlpha=alpha;if(!this.forests.has(p))this.forests.set(p,this.forest(p));const image=this.forests.get(p);c.drawImage(image,Math.round((-10+parallax*.47)*2)/2,this.h*.610,this.w+20,image.height/2)}c.globalAlpha=1}
 clear(){this.cache.clear();this.forests.clear()}
}
export function paintV5Lake(w,h,period){
 const out=canvas(w*2,h*2),c=out.getContext('2d');c.setTransform(2,0,0,2,0,0);c.imageSmoothingEnabled=false;const day=period==='day'||period==='dawn',g=h*.88;
 const ground=period==='night'?'#293f49':period==='dusk'?'#526461':period==='dawn'?'#80967e':'#7b9c7e';c.fillStyle=ground;c.beginPath();c.moveTo(0,g-3);c.bezierCurveTo(w*.24,g-16,w*.36,g+9,w*.49,g+1);c.bezierCurveTo(w*.71,g-14,w*.82,g-7,w,g-6);c.lineTo(w,h);c.lineTo(0,h);c.fill();
 c.strokeStyle=day?'#a2b8a0':'#617e7a';c.lineWidth=1;c.beginPath();c.moveTo(0,g-2);c.bezierCurveTo(w*.25,g-15,w*.37,g+10,w*.49,g+2);c.bezierCurveTo(w*.70,g-13,w*.83,g-6,w,g-5);c.stroke();
 for(let i=0;i<5;i++){const y=g+8+i*8.8,x=108+Math.sin(i*.7)*2,r=9+i*1.5;c.fillStyle=day?'#b3b7a7':'#637b80';c.beginPath();c.moveTo(x-r,y);c.lineTo(x-r+2,y-2);c.lineTo(x+r,y-1);c.lineTo(x+r+1,y+4);c.lineTo(x-2,y+5);c.lineTo(x-r-1,y+3);c.fill();c.fillStyle=day?'#e0d3b9':'#a2a9aa';c.fillRect(x-r+2,y,r*.8,.5)}
 // Subjects are newly authored local PNGs. Their larger silhouettes create a
 // readable focal point on a phone, with the old seat/telescope positions kept.
 v5Blit(c,'lake-cottage',-3,g-104,{period,width:106,height:107});v5Blit(c,'lake-conservatory',w-69,g-72,{period,width:69.5,height:72.5});
 const oak=v5Frame('nature-oak',{period}),leftTree=canvas(oak.width,oak.height),left=leftTree.getContext('2d');left.translate(oak.width,0);left.scale(-1,1);left.drawImage(oak,0,0);drawGroundedTree(c,leftTree,{left:-24,top:g-103,width:55,height:83,groundY:g+7,period});drawGroundedTree(c,v5Frame('nature-rowan',{period}),{left:w-30,top:g-96,width:50,height:80,groundY:g+6,period});
 for(const[x,y,s]of [[1,g+4,.40],[83,g+4,.34],[145,g-5,.42],[w-13,g-1,.45]]){const im=v5Frame('nature-shore-rock',{period});c.drawImage(im,x,y,im.width*s,im.height*s)}
 const plants=[['cosmos',13,h-5,29],['lily',35,h-14,20],['bush-rose',50,h-4,26],['tulip',w-49,h-4,26],['lupin',w-22,h-11,30],['daisy',w-7,h-1,19],['bell',21,g+11,15],['bush-leaf',w-14,g+11,20]];
 for(const[name,x,root,width]of plants){const im=v5Frame('flower-'+name,{period});c.drawImage(im,x-width/2,root-im.height*width/im.width,width,im.height*width/im.width)}
 // Curving seat, carved back and brass telescope are their own physical layers.
 const by=h-61;v5Blit(c,'meadow-bench',76,by,{period,width:68,height:46.5});v5Blit(c,'telescope',144,h-80,{period,width:44.5,height:58});
 c.fillStyle=day?'#9f8c85':'#6f6277';c.fillRect(53,h-52,1.5,33);c.fillStyle='#d2b392';c.fillRect(49,h-53,10,2);c.fillStyle=day?'#d8d1b5':'#f1ca8e';c.fillRect(50.5,h-49,6,7);c.fillStyle='#776478';c.fillRect(53,h-50,.5,9);
 const front=canvas(w*2,h*2),f=front.getContext('2d');f.setTransform(2,0,0,2,0,0);f.imageSmoothingEnabled=false;
 // A low foreground seat rail occludes the lap without hiding the new pose.
 f.fillStyle=day?'#d9b3ab':'#a7859c';f.fillRect(77,h-33,66,2);f.fillStyle=day?'#796676':'#504657';f.fillRect(80,h-30,2,11);f.fillRect(137,h-30,2,11);
 return{back:out,front};
}
