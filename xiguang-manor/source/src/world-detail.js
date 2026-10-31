import {LakeMaterials} from './lakeside-materials.js';
import {LakesideMountains} from './lakeside-background.js';
import {skyPalette,mix} from './sky-model.js';
import {volume,framed,jar,book,blossom,line,oval} from './material-painter.js';
let worldScene;const windows=new Map();
export function paintWindowVista(p,x,y,width,height,hour){
 if(!worldScene)return;hour=hour>=20||hour<5?22:hour<9?7:hour<17?12:18;
 const key=[width,height,hour].join('/');let canvas=windows.get(key);
 if(!canvas){canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.scale(2,2);const w=width/2,h=height/2,a=skyPalette(hour);for(let yy=0;yy<h;yy++){c.fillStyle=mix(a.top,a.bottom,Math.min(1,yy/(h*.8)));c.fillRect(0,yy,w,1)}const m=new LakeMaterials(worldScene),mountains=new LakesideMountains({baseHour:hour},m,w,h*1.6);c.save();c.translate(0,-h*.38);mountains.draw(c,a);mountains.drawForest(c,a);c.restore();m.clear();mountains.clear();windows.set(key,canvas)}
 p.c.drawImage(canvas,x,y,width,height);
}

export function refineWorld(scene){
 worldScene=scene;
 const source=scene.textures.get('world').getSourceImage(),c=source.getContext('2d'),pixels=c.getImageData(0,0,432,180),mask=new Set([0x35344f,0x403d5a,0x50475f,0x354e55]);
 const horizon=document.createElement('canvas');horizon.width=432;horizon.height=180;const hc=horizon.getContext('2d');hc.imageSmoothingEnabled=false;hc.scale(2,2);
 const view={baseHour:22},materials=new LakeMaterials(scene),mountains=new LakesideMountains(view,materials,216,110),a=skyPalette(22);hc.fillStyle=a.top;hc.fillRect(0,0,216,90);mountains.draw(hc,a,0);mountains.drawForest(hc,a,0);
 const art=hc.getImageData(0,0,432,180);for(let i=0;i<pixels.data.length;i+=4){const color=(pixels.data[i]<<16)|(pixels.data[i+1]<<8)|pixels.data[i+2];if(mask.has(color)){pixels.data[i]=art.data[i];pixels.data[i+1]=art.data[i+1];pixels.data[i+2]=art.data[i+2]}}c.putImageData(pixels,0,0);materials.clear();mountains.clear();
 const p={canvas:source,c,r:(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)},poly:(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()}},r=p.r;
 // Keep the candy house footprint, roof silhouette, doors and all hitboxes.
 r(46,324,135,3,'#f3d8bd');r(48,338,128,3,'#ad8396');r(176,340,5,62,'#b18e98');r(174,340,2,60,'#edd2bb');
 for(const x of[61,139]){r(x,351,25,2,'#6a526d');r(x,352,2,30,'#74586f');r(x+23,354,2,28,'#f0c6b0');r(x+4,355,1,20,'#fff0c8');volume(p,x-4,382,32,8,{color:'#ad8893',depth:3});for(let i=0;i<5;i++)blossom(p,x+i*5+2,382-i%2*3,i%2?'#c8accb':'#e5b0c1',2)}
 volume(p,96,399,31,6,{color:'#ae8790',depth:2});r(101,362,2,24,'#f1d0a9');r(119,362,2,26,'#a97d8a');r(104,388,14,2,'#9f7485');r(117,389,2,3,'#f6dfae');
 for(let row=0;row<5;row++){const y=287+row*6,left=68-row*6,right=158+row*6;for(let x=left;x<right;x+=12){r(x+1,y+1,7,1,'#d8a3b9');r(x+1,y+4,9,1,'#96708e');r(x+9,y+1,1,3,'#8e6584')}}
 volume(p,150,261,19,6,{color:'#bc90a8',depth:3});r(153,267,3,19,'#a07592');r(165,266,2,20,'#d6a8b6');
 // Wood grain, post caps and contact edges distinguish the fence from flat lines.
 for(const item of scene.worldObjects||[]){if(item.kind==='fence'){const b=item.bounds;for(let x=b.x;x<b.x+b.w;x+=16){r(x+1,b.y+5,1,17,'#c5a8b0');r(x+3,b.y+10,1,9,'#78667e');r(x,b.y+26,6,2,'#5c5b6a')}}if(item.kind==='lamp'){r(item.x-6,item.y-15,12,1,'#e0b4b1');r(item.x-3,item.y-10,1,8,'#ffedc7');r(item.x+1,item.y+4,1,25,'#8c7387')}}
 for(const item of scene.worldObjects||[]){if(item.kind!=='flower')continue;const{x,y}=item,color=item.color||'#dab2c7',kind=Math.abs(Math.round(x+y))%4;oval(p,x+1,y+7,5,1,'#49605f');line(p,x,y+7,x+1,y-2,'#759180');p.poly([[x,y+4],[x-4,y+1],[x-3,y-1],[x+1,y+3]],'#92a38a');if(kind===0){blossom(p,x-2,y-1,color,2);blossom(p,x+2,y-3,color,3)}else if(kind===1){for(let i=0;i<3;i++)blossom(p,x+i%2*2,y-4+i*2,color,2)}else blossom(p,x,y-2,color,kind===2?3:4)}
 // Pond stones, iris and layered steps remain outside existing collisions.
 for(const[x,y]of[[313,236],[327,233],[341,234],[369,235],[387,244],[391,276],[365,292],[335,294],[313,280]]){volume(p,x,y,10,5,{color:'#aab0ae',depth:2});r(x+2,y,5,1,'#d1c7b8')}
 scene.textures.get('world').refresh();
}
