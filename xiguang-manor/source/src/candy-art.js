import {painter} from './art.js';
import {CANDY,products} from './candy-config.js';
import {mix} from './sky-model.js';
import {oval,volume,jar,line,blossom} from './material-painter.js';
const cache=new Map(),sprites=new Map();
function candySprite(id){
 if(sprites.has(id))return sprites.get(id);const item=products.find(p=>p.id===id)||products[0],p=painter(64,64),r=p.r,color=item.color,mask=painter(64,64);
 // Twisted paper has its own folded planes and reflected edges.
 p.poly([[2,23],[15,28],[15,42],[2,48],[5,35]],mix(color,'#8b7298',.45));p.poly([[62,23],[49,28],[49,42],[62,48],[59,35]],mix(color,'#f7e1cb',.38));line(p,5,26,13,32,'#ead5d2');line(p,5,43,13,38,'#96758e');line(p,52,30,59,26,'#f6e2cd');
 if(item.shape==='star'){const points=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rad=i%2?12:25;points.push([32+Math.cos(a)*rad,30+Math.sin(a)*rad])}mask.poly(points,color)}
 else if(item.shape==='cat'){oval(mask,32,41,18,15,color);for(const[x,y,rx,ry]of [[15,22,7,9],[26,14,7,10],[40,14,7,10],[50,24,7,9]])oval(mask,x,y,rx,ry,color)}
 else for(let y=-25;y<=25;y++)for(let x=-25;x<=25;x++)if(x*x+y*y<625&&(x-11)**2+(y+10)**2>520)mask.r(33+x,30+y,1,1,color);
 mask.c.globalCompositeOperation='source-atop';for(let y=0;y<64;y++){mask.r(0,y,64,1,mix(mix(color,'#fff1cf',.30),mix(color,'#825d88',.40),Math.max(0,(y-7)/55)))}mask.c.globalCompositeOperation='source-over';
 // The three-pixel base extrusion and short rim make a molded sweet, not an icon.
 const shadow=painter(64,64);shadow.c.drawImage(mask.canvas,0,0);shadow.c.globalCompositeOperation='source-in';shadow.r(0,0,64,64,mix(color,'#6d526d',.45));p.c.drawImage(shadow.canvas,0,3);p.c.drawImage(mask.canvas,0,0);
 if(item.shape==='cat'){oval(p,32,42,10,8,mix(color,'#ffe4cb',.55));r(26,37,5,2,'#f9e7d0');r(16,18,2,5,'#f8dfd1');r(39,8,3,5,'#fff0d8')}
 else {r(item.shape==='moon'?13:28,17,3,8,'#f9e9d3');r(item.shape==='moon'?16:31,14,5,2,'#fff0d9');r(19,33,2,3,mix(color,'#fff1da',.5))}
 for(const[x,y]of [[24,25],[34,21],[40,35],[28,46]]){r(x,y,1,1,'#f6e2cd');r(x+1,y+1,1,1,mix(color,'#fff1e0',.4))}
 sprites.set(id,p.canvas);return p.canvas;
}
export function drawCandy(c,id,x,y,size=32){c.save();c.imageSmoothingEnabled=false;c.drawImage(candySprite(id),Math.round(x),Math.round(y),size,size);c.restore()}
export function candyImage(id){if(!cache.has(id))cache.set(id,candySprite(id).toDataURL());return cache.get(id)}
export function giftImage(items,wrap='rose',open=false){
 const p=painter(128,94),r=p.r,color=CANDY.wraps.find(w=>w.id===wrap)?.color||'#dba4b8';oval(p,64,85,47,4,'#69566f');volume(p,18,34,94,48,{color,depth:8});r(23,41,78,22,'#f2dec7');
 for(let i=0;i<3;i++){volume(p,26+i*25,43,23,22,{color:'#c5a5b9',depth:2});r(29+i*25,46,17,15,'#f8e7cf');if(items[i])drawCandy(p.c,items[i],27+i*25,43,23)}
 if(!open){volume(p,14,28,102,14,{color:mix(color,'#f1dbc5',.2),depth:6});r(58,28,10,51,'#efd7ad');r(61,30,2,47,'#fff1cf');r(19,59,84,7,'#e9cda6');r(20,60,82,2,'#f9e2bf');
  p.poly([[63,28],[42,14],[35,17],[38,27],[57,33]],'#ab819b');p.poly([[63,26],[43,16],[39,18],[42,24],[59,30]],'#f0c7cf');p.poly([[65,28],[85,13],[92,17],[89,27],[72,33]],'#bd94a9');p.poly([[67,27],[85,16],[88,18],[84,25],[70,30]],'#ffe0d2');volume(p,58,24,13,10,{color:'#d6a7be',depth:3});r(60,26,6,1,'#f7dacb');
 }else {volume(p,14,8,102,14,{color,depth:5});r(59,9,10,12,'#f3d9ad');r(20,19,90,1,'#f7dfca')}
 r(28,77,13,1,mix(color,'#fff2dc',.35));r(88,75,8,1,mix(color,'#9c718e',.3));return p.canvas.toDataURL();
}
export function paintMix(c,{time=0,stirs=0,color='#e7a5bd'}){
 const p={c,r:(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)},poly:(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()}},r=p.r;c.imageSmoothingEnabled=false;r(0,0,216,140,'#b39591');for(let y=2;y<140;y+=18){r(0,y,216,1,'#c7aca0');r((y*7)%40,y+7,35,1,'#a38588')}
 jar(p,9,15,23,35,'#bdb0d3');volume(p,177,11,29,31,{color:'#e8d4bc',depth:4});r(181,16,17,11,'#f2e2ca');blossom(p,190,22,'#d7acbd',3);
 oval(p,108,109,67,12,'#826b7d');p.poly([[43,61],[51,91],[62,105],[157,105],[169,88],[173,61]],'#8d8fa9');p.poly([[48,64],[57,91],[67,101],[151,101],[162,85],[168,64]],'#b7c3ce');r(57,76,3,15,'#e8e1d5');r(157,73,3,13,'#7f8aa2');oval(p,108,61,65,23,'#ddd6d0');oval(p,108,59,61,20,'#f3e1cf');oval(p,108,59,55,16,mix(color,'#fff1d4',.2));
 for(let i=0;i<18;i++){const a=time*.75+i*.66,rad=7+i*2.2;r(108+Math.cos(a)*rad,59+Math.sin(a)*rad*.23,3+i%2,1,i%3?'#f9e8d4':mix(color,'#a07f9b',.3))}
 const angle=time*.8+stirs*.5,sx=110+Math.cos(angle)*25,sy=56+Math.sin(angle)*8;p.poly([[sx-2,sy],[sx+16,sy-38],[sx+20,sy-37],[sx+3,sy+3]],'#8f6b7b');line(p,sx,sy-1,sx+18,sy-36,'#d0a38f',2);oval(p,sx,sy,6,3,'#f5ddc9');
 volume(p,52,119,112,10,{color:'#81677e',depth:2});for(let i=0;i<8;i++)r(61+i*12,122,9,3,i<stirs?'#e7bdc6':'#b09aac');r(13,111,22,2,'#d9bdad');r(16,114,15,1,'#f4e2ca');
}
export function paintOven(c,{time=0,needle=.5,target=.5,round=0,hits=0,product='strawberry-moon',flash=0}){
 const p={c,r:(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)},poly:(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()}},r=p.r;r(0,0,216,140,'#d0b8b4');for(let y=0;y<100;y+=14){r(0,y,216,1,'#e0cac0');for(let x=y%28?14:0;x<216;x+=29)r(x,y,1,14,'#b897a7')}
 volume(p,36,7,148,84,{color:'#9e819a',depth:6});volume(p,42,12,132,68,{color:'#6b5b75',depth:3});r(50,22,115,49,'#bd8a83');r(55,27,105,39,'#dfb297');r(58,30,99,33,'#a8777f');for(let i=0;i<3;i++)drawCandy(c,product,65+i*29,35+Math.sin(time*.8+i)*.5,27);volume(p,52,65,109,7,{color:'#695b75',depth:3});r(57,70,101,1,'#c9b4bc');r(169,29,3,30,'#e9cda9');r(170,30,1,26,'#fff0ca');
 for(let i=0;i<3;i++){oval(p,72+i*35,83,5,4,'#705d75');oval(p,72+i*35,82,4,3,i<round?'#e8c49f':'#bca3b7');r(72+i*35,80,1,3,'#f2dfc7')}
 volume(p,17,107,182,24,{color:'#806d85',depth:3});r(24,114,168,9,'#b6a0af');r(24+(target-.15)*168,114,168*.3,9,flash?'#d8d8ad':'#abc0a3');for(let i=0;i<8;i++)r(25+i*23,122,1,3,'#877582');r(24+needle*168,108,2,20,'#fff2d5');r(22+needle*168,108,6,2,'#fff2d5');for(let i=0;i<hits;i++)blossom(p,197,21+i*12,'#efd6ac',2);
}
