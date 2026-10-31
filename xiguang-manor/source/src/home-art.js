import {painter} from './art.js';
import {pixelEllipse} from './scenery-art.js';
import {mix} from './sky-model.js';
import {HOME} from './home-config.js';
import {ROMANCE} from './romantic-config.js';
const icons=new Map();
export function furnitureCanvas(type,theme='rose',bouquet='rose',on=false){
 const f=HOME.items.find(f=>f.type===type),p=painter(f.w,f.h),r=p.r,w=f.w,h=f.h,cx=w/2,wood='#987382',edge='#72586c',gold='#e3c296',cream='#f7dfc4',fabric=ROMANCE.themes.find(t=>t.id===theme)?.bed||'#e7b1c2';
 const ell=(x,y,rx,ry,col)=>pixelEllipse(p,x,y,rx,ry,col);
 const blossom=(x,y,col,size=2)=>{ell(x,y,size,size,col);r(x-1,y-1,2,2,'#ffe6b5')};
 if(type==='chair'){
  r(8,h-11,4,10,edge);r(w-12,h-11,4,10,edge);ell(cx,21,17,18,wood);ell(cx,20,15,16,fabric);ell(cx,22,11,11,mix(fabric,cream,.26));r(5,33,w-10,15,wood);r(6,32,w-12,12,fabric);r(3,28,7,19,fabric);r(w-10,28,7,19,fabric);r(6,47,w-12,3,edge);r(12,35,13,8,'#f4d9ca');r(25,36,8,7,'#bca9c6');r(18,15,2,2,cream);r(25,15,2,2,cream);
 }else if(type==='tea'){
  r(10,25,4,15,edge);r(w-15,25,4,15,edge);ell(cx,23,25,11,wood);ell(cx,20,25,10,'#dfbca6');ell(cx,19,22,8,'#f1d3b7');r(13,12,23,12,'#d4b5c0');ell(24,12,11,5,'#efd6c6');r(21,6,6,4,gold);p.poly([[34,12],[43,8],[39,18],[34,20]],'#dfbdc5');r(10,12,5,7,'#e7c5bd');r(9,12,2,4,cream);ell(15,23,5,2,cream);r(12,17,6,5,'#fbebd0');r(32,24,9,2,'#ba92a8');r(35,22,4,2,'#f4c6c5');
 }else if(type==='lamp'){
  ell(cx,h-5,12,4,edge);ell(cx,h-7,10,3,gold);r(cx-1,25,3,h-32,wood);r(cx,25,1,h-32,gold);
  for(let y=-12;y<=12;y++)for(let x=-12;x<=12;x++)if(x*x+y*y<144&&(x-5)*(x-5)+(y+3)*(y+3)>100)r(cx+x,17+y,1,1,on?'#ffe6a5':'#d8be99');
  r(22,28,1,12,gold);r(20,39,5,1,cream);r(22,37,1,5,cream);
 }else if(type==='plant'){
  p.poly([[9,h-22],[w-9,h-22],[w-13,h-3],[13,h-3]],'#c5a0aa');r(8,h-23,w-16,4,'#e8c6b7');r(12,h-18,3,12,'#e2bdba');r(15,h-7,w-28,2,wood);
  for(let i=0;i<6;i++){const x=10+i*5,y=16+(i*7)%18;r(x,y,2,h-24-y,'#74937c');p.poly([[x,y+13],[x-7,y+8],[x-6,y+3],[x+1,y+8]],'#9ab394');p.poly([[x+1,y+18],[x+7,y+10],[x+8,y+15]],'#8aa58d')}
  for(let i=0;i<11;i++){const x=9+(i*9)%25,y=10+(i*7)%17;blossom(x,y,i%3?'#c2b1d7':'#e0b5cd',3)}
 }else if(type==='vase'){
  r(8,h-21,3,20,wood);r(w-11,h-21,3,20,wood);r(4,h-24,w-8,5,'#d9b4a8');r(7,h-4,w-14,2,wood);ell(cx,h-30,8,8,'#b7becd');r(cx-4,h-40,8,6,'#d3cfdb');r(cx-2,h-37,2,8,'#ece1d9');const color=ROMANCE.flowers.find(f=>f.id===bouquet)?.color||fabric;
  for(let i=0;i<5;i++){const x=7+i*5,y=8+(i*5)%12;r(x,y,1,h-36-y,'#809b84');r(x+1,y+8,4,1,'#acc098');blossom(x,y,color,3)}
 }else if(type==='piano'){
  r(5,8,w-10,34,wood);r(8,10,w-16,24,'#dbc3b4');r(12,13,w-24,3,cream);r(19,20,28,2,'#b18f9d');r(7,38,w-14,7,edge);r(9,45,4,12,edge);r(w-13,45,4,12,edge);r(6,35,w-12,5,'#c5a4a4');
  for(let i=0;i<7;i++){r(11+i*6,34,5,8,'#f9ecd7');if(i!==2&&i!==6)r(15+i*6,34,3,5,'#6c596b')}r(2,5,w-4,5,gold);r(9,29,4,3,'#e7cbb6');r(52,25,5,7,'#af9bb9');
 }else if(type==='candles'){
  ell(cx,h-4,10,3,wood);r(cx-2,14,4,h-19,gold);r(4,21,w-8,3,gold);r(5,8,4,14,'#edd7c1');r(w-9,8,4,14,'#d9bfd0');r(cx-2,2,4,15,'#f7e4ce');
  for(const [x,y]of [[7,5],[cx,0],[w-7,5]])if(on){r(x,y,1,5,'#fff1bc');r(x-1,y+2,3,3,'#efc488')}
 }else if(type==='record'){
  r(3,h-18,w-6,16,wood);r(5,h-17,w-10,2,gold);ell(cx-3,h-20,12,4,edge);ell(cx-3,h-21,10,3,'#6a647c');ell(cx-3,h-21,2,1,cream);r(w-10,h-24,2,7,gold);r(21,21,3,13,wood);
  p.poly([[21,26],[13,10],[25,2],[39,6],[35,22],[25,28]],gold);p.poly([[18,10],[25,5],[35,8],[31,18],[24,22]],'#b59496');p.poly([[18,10],[25,6],[31,8],[25,14]],'#f3d8ae');
 }else if(type==='screen'){
  for(let i=0;i<3;i++){const x=2+i*18;r(x,7-i%2*5,17,h-10+i%2*5,wood);r(x+2,10-i%2*5,13,h-20+i%2*5,'#e8d1c6');r(x+4,13,1,h-25,'#f4e2cd');r(x+2,h-6,3,6,edge);r(x+12,h-6,3,6,edge);r(x+7,36,1,25,'#8da089');for(let j=0;j<4;j++)blossom(x+5+(j%2)*5,27+j*8,j%2?fabric:'#bba5ce',2)}
 }else if(type==='cushion'){
  ell(cx,h-7,17,6,wood);ell(cx,h-10,17,8,fabric);ell(cx,h-13,14,5,mix(fabric,cream,.27));p.poly([[cx-9,4],[cx,8],[cx-8,12]],'#b58ba8');p.poly([[cx+9,4],[cx,8],[cx+8,12]],'#b58ba8');r(cx-1,7,3,3,gold);
 }else if(type==='easel'){
  p.poly([[18,15],[22,15],[35,h],[31,h]],wood);p.poly([[18,15],[22,15],[8,h],[4,h]],wood);r(4,45,w-8,3,gold);r(6,4,w-12,38,'#cba994');r(9,7,w-18,32,'#56627c');r(12,9,w-24,26,'#7d819b');r(26,11,3,7,'#f3dfb5');r(24,13,6,3,'#f3dfb5');p.poly([[12,34],[18,26],[23,31],[29,23],[30,35]],'#a6a6bb');for(let i=0;i<7;i++)r(12+i*3,33+i%3,2,2,i%2?'#e3b0c5':'#e9d9bc');
 }else if(type==='catBed'){
  ell(cx,17,23,10,wood);ell(cx,14,22,10,'#c3a18e');ell(cx,13,18,8,fabric);ell(cx,13,13,5,'#efd5cd');r(5,15,w-10,2,gold);for(let i=0;i<6;i++)r(6+i*7,17,1,5,'#e5c5ac');r(20,20,7,2,cream);
 }
 return p.canvas;
}
export function furnitureIcon(type,theme='rose',bouquet='rose'){const key=[type,theme,bouquet].join('-');if(!icons.has(key))icons.set(key,furnitureCanvas(type,theme,bouquet,true).toDataURL());return icons.get(key)}
export function paintRoomSurfaces(p,room,day){
 const r=p.r;if(room.wallpaper==='floral'){r(26,29,380,238,'#bdaabf');for(let y=45;y<260;y+=29)for(let x=39;x<400;x+=31){r(x,y,1,13,'#a49aa8');r(x-4,y+5,4,2,'#d4c3c9');r(x+1,y+9,5,2,'#8f9f93');r(x-2,y-2,5,4,'#e9cad2');r(x,y-1,1,1,'#f4dfba')}}
 if(room.wallpaper==='gingham'){r(26,29,380,238,'#ead0c7');for(let y=30;y<265;y+=16)r(26,y,380,6,'#dcb8bc');for(let x=28;x<405;x+=16)r(x,30,5,235,'#ddb6bc');for(let y=30;y<265;y+=16)for(let x=28;x<405;x+=16)r(x,y,5,6,'#cda4b1')}
 if(room.floor!=='original'){const pale=room.floor==='pale';r(26,281,380,528,pale?'#c7b8b0':'#b69483');p.c.save();p.c.beginPath();p.c.rect(26,281,380,528);p.c.clip();for(let y=283;y<809;y+=18)for(let x=25;x<408;x+=36){if(pale){r(x+(y%36?18:0),y,34,16,(x+y)%4?'#d6c8ba':'#c5b8b2');r(x+3,y+3,24,1,'#e6d8c7')}else{p.poly([[x,y],[x+17,y+8],[x+17,y+23],[x,y+15]],'#d0ad91');p.poly([[x+18,y+8],[x+35,y],[x+35,y+15],[x+18,y+23]],'#bd9885');r(x+2,y+3,9,1,'#e0bea2')}}p.c.restore()}
}
