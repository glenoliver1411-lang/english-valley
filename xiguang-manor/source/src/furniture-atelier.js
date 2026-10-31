import {mix} from './sky-model.js';
import {oval,volume,framed,cushion,jar,book,line,blossom} from './material-painter.js';
import {ROMANCE} from './romantic-config.js';

export function paintFurniture(p,type,{theme='rose',bouquet='rose',on=false}={}){
 const r=p.r,w=p.canvas.width,h=p.canvas.height,cx=w/2,wood='#ad8996',edge='#675369',cream='#f2dcc2',gold='#d7b785',fabric=ROMANCE.themes.find(t=>t.id===theme)?.bed||'#dfb1c4';
 oval(p,cx,h-3,w*.41,2,'#57495e');
 const leg=(x,y,height=10)=>{volume(p,x,y,4,height,{color:wood,depth:1});r(x+1,y+1,1,height-3,'#d5b0ad')};
 if(type==='chair'){
  leg(8,h-12);leg(w-12,h-12);volume(p,5,10,w-10,37,{color:wood,depth:3});cushion(p,7,8,w-16,29,fabric);
  for(const x of [13,23,31]){r(x,18,1,1,'#f4dfce');r(x-1,19,2,1,mix(fabric,edge,.3))}
  cushion(p,6,33,w-12,15,mix(fabric,'#f1d7c8',.12));volume(p,3,29,7,20,{color:mix(fabric,wood,.3),depth:3});volume(p,w-10,29,7,20,{color:mix(fabric,wood,.3),depth:3});r(6,48,w-13,2,wood);cushion(p,12,29,18,11,'#ead3c5');r(16,32,9,1,'#d3b5c0');
 }else if(type==='tea'){
  leg(10,27,13);leg(w-15,27,13);oval(p,cx,24,25,11,edge);oval(p,cx,21,25,10,wood);oval(p,cx,18,24,9,'#e3bfa6');oval(p,cx,17,21,7,'#eed4b8');
  for(let i=0;i<3;i++)r(12+i*10,20+i%2,7,1,'#d1ad9e');oval(p,23,18,11,7,'#b38fa4');oval(p,23,14,10,7,'#e9c8c9');oval(p,24,10,8,3,'#f5dfcd');oval(p,24,9,7,2,'#c9a6b5');r(22,5,4,4,gold);r(23,4,2,1,cream);p.poly([[33,12],[42,8],[40,13],[36,19],[32,19]],'#e0b8c2');r(35,12,3,2,cream);r(10,11,3,9,'#c5a0b4');r(9,13,2,5,cream);
  oval(p,15,27,6,2,'#b793a2');oval(p,15,25,5,2,cream);volume(p,12,19,6,6,{color:'#f3e2ca',depth:1});r(13,20,3,1,'#9b737d');volume(p,35,24,9,3,{color:'#eac8b6',depth:1});blossom(p,39,22,'#d7a0bc',2);
 }else if(type==='lamp'){
  oval(p,cx,h-5,13,4,edge);oval(p,cx,h-7,11,4,gold);oval(p,cx,h-8,8,2,'#ead0a9');r(cx-2,27,4,h-36,edge);r(cx-1,27,2,h-36,gold);r(cx,28,1,h-40,cream);
  for(let y=-14;y<=14;y++)for(let x=-13;x<=13;x++)if(x*x+y*y<182&&(x-5)**2+(y+4)**2>143){r(cx+x,18+y,1,1,'#94778b');r(cx+x-1,17+y,1,1,on?'#f0d29a':'#cbb19a')}
  r(cx-10,13,1,5,on?'#fff0c5':'#e8cda9');r(cx+5,29,1,12,gold);blossom(p,cx+5,42,on?'#f0d9ad':'#b897ab',2);
 }else if(type==='plant'){
  oval(p,cx,h-5,13,3,edge);p.poly([[9,h-22],[w-8,h-22],[w-13,h-4],[13,h-4]],'#ac839a');p.poly([[12,h-21],[w-11,h-21],[w-14,h-5],[15,h-5]],'#d2acb6');r(14,h-18,2,10,'#edc9bf');oval(p,cx,h-23,15,4,'#e3c2b6');oval(p,cx,h-24,12,2,'#75616e');
  for(let i=0;i<7;i++){const x=9+i*4,y=18+(i*7)%17;line(p,x,y,cx,h-24,'#648577');p.poly([[x,y+12],[x-6,y+9],[x-7,y+5],[x-1,y+7],[x+1,y+11]],i%2?'#779987':'#9eb198');p.poly([[x,y+7],[x+7,y+2],[x+8,y+6],[x+3,y+10]],'#8da78f')}
  for(const [x,y]of [[10,19],[15,11],[22,16],[28,9],[33,20],[23,26]]){blossom(p,x,y,'#b9a2ca',5);for(let k=0;k<3;k++)blossom(p,x-2+k*2,y-2+k%2,'#d9bddb',2)}
 }else if(type==='vase'){
  leg(8,h-19,17);leg(w-11,h-19,17);volume(p,4,h-25,w-8,6,{color:'#d9b6a8',depth:2});line(p,10,h-18,w-11,h-6,wood);line(p,w-11,h-18,10,h-6,wood);
  oval(p,cx,h-30,9,7,'#8693ab');oval(p,cx,h-32,8,7,'#b8c8d1');r(cx-4,h-42,8,9,'#a8bccb');oval(p,cx,h-42,5,2,'#d8d9d8');oval(p,cx,h-42,3,1,'#6f7e99');r(cx-5,h-35,2,7,'#f1e5d7');r(cx+4,h-33,1,5,'#79879d');
  const color=ROMANCE.flowers.find(f=>f.id===bouquet)?.color||fabric;for(const [i,x]of [7,13,19,25,31].entries()){const y=8+i*5%12;line(p,cx,h-41,x,y+2,'#6d8c7d');p.poly([[x,y+10],[x+5,y+6],[x+5,y+9],[x,y+12]],'#98ad91');blossom(p,x,y,color,3)}
 }else if(type==='piano'){
  leg(8,h-14,13);leg(w-13,h-14,13);volume(p,4,7,w-8,36,{color:wood,depth:4,grain:true});framed(p,10,12,w-23,20,'#b79da4','#dcc3b0');r(18,17,29,1,cream);book(p,26,18,15,12,'#d6c5c2');
  volume(p,4,34,w-8,12,{color:'#7e667f',depth:3});for(let i=0;i<9;i++){volume(p,9+i*5,36,5,8,{color:'#f1e4cd',depth:1,edge:'#aa8f9b'});if(![2,6,8].includes(i))r(12+i*5,36,3,4,'#594e62')}
  volume(p,2,3,w-4,5,{color:'#d2af99',depth:2});r(52,26,4,7,'#b9b2cf');blossom(p,54,24,'#d6b3c6',2);r(22,h-8,20,2,gold);r(28,h-10,2,4,'#f0d2a3');
 }else if(type==='candles'){
  oval(p,cx,h-4,11,3,edge);oval(p,cx,h-5,9,3,gold);volume(p,cx-2,15,4,h-20,{color:gold,depth:1});p.poly([[5,22],[cx,18],[w-5,22],[w-5,25],[cx,22],[5,25]],gold);
  for(const [x,y]of [[6,9],[cx-2,3],[w-9,9]]){oval(p,x+2,y+15,4,2,'#a7868d');volume(p,x,y,5,15,{color:'#eed8c6',depth:1});r(x+2,y+2,1,8,'#fff0d7');r(x+1,y+6,1,5,'#d1b2bb');oval(p,x+2,y,2,1,'#c49da2');if(on){p.poly([[x+2,y-5],[x+4,y-2],[x+3,y],[x+1,y],[x,y-2]],'#edc18e');r(x+2,y-3,1,3,'#ffebbc')}}
 }else if(type==='record'){
  volume(p,3,h-19,w-6,17,{color:wood,depth:3,grain:true});r(9,h-10,22,3,'#b697a4');r(24,h-9,3,1,gold);oval(p,cx-4,h-20,12,4,edge);oval(p,cx-4,h-22,11,3,'#52536d');oval(p,cx-4,h-22,7,2,'#81728a');oval(p,cx-4,h-22,2,1,cream);line(p,w-9,h-27,w-12,h-21,gold);r(21,22,3,11,gold);
  p.poly([[21,27],[12,12],[14,7],[25,2],[39,7],[38,17],[31,25]],'#8e7286');p.poly([[22,25],[15,12],[26,4],[37,8],[35,19],[29,24]],'#d5ae89');p.poly([[16,11],[26,5],[35,8],[29,18],[23,22]],'#f0d3a2');p.poly([[18,11],[26,7],[32,9],[26,15]],'#94778a');line(p,25,5,35,8,'#ffe6bb');
 }else if(type==='screen'){
  for(let i=0;i<3;i++){const x=2+i*18,top=i%2?1:6;volume(p,x,top,17,h-top-5,{color:wood,depth:2});framed(p,x+2,top+3,12,h-top-14,'#e2ccc9','#c5a6ad');r(x+2,h-6,3,6,edge);r(x+11,h-6,3,6,edge);line(p,x+7,61,x+9,30,'#83978b');for(let j=0;j<4;j++)blossom(p,x+6+j%2*4,28+j*8,j%2?fabric:'#b6a4c4',2);r(x+15,22,1,4,gold);r(x+15,54,1,4,gold)}
 }else if(type==='cushion'){
  oval(p,cx,h-5,18,5,edge);cushion(p,2,4,w-4,h-6,fabric);r(6,h-7,w-12,1,mix(fabric,'#876681',.3));p.poly([[cx,8],[cx-9,2],[cx-10,7],[cx-3,11]],'#d7a7bf');p.poly([[cx,8],[cx+9,2],[cx+10,7],[cx+3,11]],'#edc4d0');volume(p,cx-2,7,5,4,{color:gold,depth:1});
 }else if(type==='easel'){
  line(p,21,10,6,h-1,edge,3);line(p,21,10,35,h-1,wood,3);line(p,22,18,28,h-2,'#c4a195',2);framed(p,5,4,w-10,40,'#324662','#c29e91');r(10,10,w-20,27,'#59637e');oval(p,27,17,3,3,'#efd9af');p.poly([[11,35],[18,26],[23,31],[29,25],[31,36]],'#8f9cab');for(let i=0;i<8;i++)blossom(p,12+i*3,34+i%3,i%2?'#dab2c8':'#e5d2b4',1);volume(p,2,44,w-4,5,{color:'#c8a795',depth:2});r(6,50,w-12,1,'#7f667b');
 }else if(type==='catBed'){
  oval(p,cx,19,24,9,edge);oval(p,cx,16,23,10,'#a8848e');oval(p,cx,13,22,9,'#d5b598');oval(p,cx,12,18,7,'#8e718c');oval(p,cx,13,16,6,fabric);oval(p,cx,12,12,4,'#ebd0d0');
  for(let row=0;row<3;row++)for(let i=0;i<9;i++){const x=5+i*5+row%2*2;r(x,17+row*3,3,1,row%2?'#d8bda3':'#9f7e87');r(x,18+row*3,1,2,'#b59491')}
  r(11,13,4,1,'#f4e0cf');r(31,14,3,1,'#ceb0c4');
 }
}
