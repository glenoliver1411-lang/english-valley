import {paintV5Workshop} from './v5-scenes.js';
import {painter} from './art.js';
import {skyPalette,mix} from './sky-model.js';
import {volume,oval,framed,jar,book,blossom,line} from './material-painter.js';
import {drawCandy,giftImage} from './candy-art.js';
import {CT} from './candy-config.js';
import {paintWindowVista} from './world-detail.js';

export function paintCandyRoom(hour=22){return paintV5Workshop(hour);

 const p=painter(432,850),r=p.r,a=skyPalette(hour),wood='#b58c9e',edge='#71566e',cream='#eed6bd',glass=mix('#655d7b','#b6d0da',a.day);
 r(0,0,432,850,'#55455d');r(16,24,400,292,'#c5a3b0');r(23,28,386,278,'#e6c8bc');
 for(let x=25;x<410;x+=18){r(x,29,6,276,'#d7b2bd');r(x+6,29,1,276,'#f0d5c4')}
 for(let x=25;x<410;x+=38)for(let y=45;y<267;y+=34){line(p,x,y,x+4,y+11,'#b39baa');blossom(p,x+4,y+3,'#c8a6b8',2)}
 volume(p,20,295,392,19,{color:'#ab8296',depth:5});r(24,299,382,2,'#f4d8b9');r(24,311,382,4,'#766174');
 // Honey parquet: end joints, bevels, a few grain lines and a wall-floor seam.
 r(20,316,392,520,'#9d7d86');for(let y=318;y<837;y+=24)for(let x=-26;x<432;x+=66){const xx=x+(y%48?32:0);r(xx,y,63,21,(x+y)%4?'#b39895':'#bea194');r(xx+2,y+1,59,1,'#d7bba7');r(xx+4,y+18,54,1,'#987d87');r(xx+11,y+9,27,1,'#ac8d8d')}
 r(0,316,20,534,'#6b526b');r(412,316,20,534,'#6b526b');
 // Window with depth, pane reflections, a velvet valance and reflected moonlight.
 framed(p,166,45,105,164,'#b598a9','#ad8299');r(174,53,88,148,glass);for(let y=54;y<200;y++)r(175,y,86,1,mix(a.top,a.bottom,(y-54)/160));
 p.poly([[175,169],[193,155],[209,170],[234,149],[261,174],[261,197],[175,197]],a.far);p.poly([[175,184],[202,173],[227,184],[252,168],[261,177],[261,199],[175,199]],a.near);
 if(a.night>.2){oval(p,239,80,13,13,'#f0d7b0');oval(p,245,77,12,12,a.top)}r(215,52,5,148,'#b58c9a');r(174,127,87,5,'#c4a294');r(174,54,2,66,'#e9d9cc');volume(p,160,201,116,9,{color:'#e7c8ac',depth:3});
 paintWindowVista(p,175,54,86,143,hour);r(215,54,5,143,'#b58c9a');r(175,127,86,5,'#c4a294');
 volume(p,157,41,123,8,{color:'#ae8b9f',depth:3});r(159,49,13,146,'#ab8da6');r(264,49,13,146,'#b397ae');for(let x of[161,168,266,273])r(x,52,1,126,'#d3b3c4');
 // Open apothecary-style shelves; each bottle has a lid, glass rim and contents.
 for(const[x,w]of [[33,115],[291,108]]){
  volume(p,x,62,w,201,{color:wood,depth:5,grain:true});r(x+8,72,w-19,177,'#7e637e');
  for(let shelf=0;shelf<3;shelf++){const yy=95+shelf*57;volume(p,x+4,yy+34,w-10,7,{color:'#d6b3ac',depth:3});for(let j=0;j<3;j++)jar(p,x+12+j*29,yy,20,33,['#e4aac0','#bdb2d7','#e3bd91'][(shelf+j)%3])}
 }
 framed(p,176,230,87,58,'#746078','#c8a3ab');p.c.fillStyle='#ead5bd';p.c.font='10px serif';p.c.textAlign='center';p.c.fillText(CT.make,219,247);for(let i=0;i<3;i++)drawCandy(p.c,['strawberry-moon','pumpkin-star','lavender-cat'][i],184+i*23,254,23);p.c.textAlign='left';
 // Copper mixing station with open knee space, drawers and stone worktop.
 volume(p,45,357,133,18,{color:'#e7c9b5',depth:5});for(const x of[52,166])volume(p,x,374,7,33,{color:wood,depth:2,grain:true});r(59,380,102,4,'#9c7b8f');volume(p,78,343,74,18,{color:'#9ca6b6',depth:3});oval(p,115,344,35,10,'#e3d0c8');oval(p,115,342,30,7,'#e8b5c8');line(p,133,340,142,316,'#b78b7d',3);r(137,322,1,10,'#eed6b5');
 for(const x of[55,85,115]){r(x,384,24,10,'#c2a0ad');r(x+2,386,20,1,'#dfbdba');r(x+11,390,3,1,'#e4c393')}
 // A substantial rose-metal oven, inset glass, rivets, controls and masonry cap.
 volume(p,285,268,106,63,{color:'#b18a9a',depth:5});framed(p,294,279,85,44,'#654c68','#cca1ae');r(303,286,66,27,'#e6b697');r(307,290,58,19,'#a77b88');for(let i=0;i<3;i++)drawCandy(p.c,['strawberry-star','lavender-moon','pumpkin-cat'][i],309+i*18,289,20);volume(p,298,314,78,8,{color:'#745f78',depth:3});r(388,286,3,30,'#f0d2ab');for(let i=0;i<3;i++){oval(p,308+i*27,329,4,3,'#75576f');r(307+i*27,327,1,2,'#efcfa5')}volume(p,281,261,114,9,{color:'#edd2b8',depth:3});
 // Tasting counter: glass display cover and sweets on porcelain stands.
 volume(p,44,417,89,14,{color:'#d2a5b2',depth:4});for(const x of[52,122])volume(p,x,430,6,26,{color:wood,depth:2});
 for(let i=0;i<3;i++){const x=56+i*24;oval(p,x+7,414,9,3,'#9a7d90');oval(p,x+7,412,8,2,cream);drawCandy(p.c,['strawberry-moon','lavender-star','pumpkin-cat'][i],x-2,394,21)}
 r(49,393,81,1,'#f3decc');r(49,394,1,20,'#e1cdd0');r(129,394,1,20,'#b7acbd');r(51,395,1,11,'#f7e9d9');
 // Packing bench and folded papers, with ribbon spools and a divided gift tray.
 volume(p,278,482,111,19,{color:'#e4c4b3',depth:5});for(const x of[286,381])volume(p,x,500,6,45,{color:wood,depth:2,grain:true});volume(p,301,466,57,18,{color:'#c89fb7',depth:4});r(307,470,44,7,'#f1dfcc');r(326,466,7,17,'#efd2ab');
 oval(p,371,477,7,3,'#856980');r(366,464,10,13,'#c9acbd');oval(p,371,464,7,3,'#f2d7b8');r(369,464,3,1,'#927486');book(p,282,467,13,12,'#bea5c4');
 volume(p,303,389,88,35,{color:wood,depth:4,grain:true});r(309,397,74,18,'#8d6e87');for(let i=0;i<3;i++){volume(p,314+i*23,398,19,17,{color:['#d3abc0','#b5a8ce','#dfbe9c'][i],depth:3});r(322+i*23,399,3,15,cream);r(316+i*23,405,14,2,cream)}
 volume(p,63,560,80,12,{color:'#ccb0a7',depth:3});for(const x of[69,135])volume(p,x,572,5,28,{color:wood,depth:2});book(p,75,542,39,18,'#d9bbc2');r(84,547,17,1,'#f7dfb5');
 volume(p,267,642,74,13,{color:'#c9a6aa',depth:4});for(const x of[274,333])volume(p,x,655,5,27,{color:wood,depth:2});book(p,280,622,47,21,'#9d85a6');r(287,630,11,1,'#a5819c');r(307,630,12,1,'#a5819c');
 // Woven runner leaves the walking aisle open; no new collision geometry.
 r(171,434,89,310,'#9b7c8c');r(175,438,81,302,'#bd94a8');for(let i=0;i<3;i++){r(178+i*3,442+i*3,74-i*6,1,'#e0bac0');r(178+i*3,733-i*3,74-i*6,1,'#e0bac0')}for(let y=459;y<727;y+=24){p.poly([[215,y],[222,y+6],[215,y+12],[208,y+6]],'#d1adba');r(214,y+4,2,3,'#e9cbbc')}
 for(const[x,y]of[[39,285],[388,450],[253,282]]){volume(p,x,y,12,14,{color:'#bfa0af',depth:2});line(p,x+6,y,x+4,y-12,'#8c9c84');blossom(p,x+4,y-13,'#d6b1c9',4)}
 // Door frame, inset panels, brass latch and layered entry step.
 framed(p,181,754,73,74,'#c29b9e','#967587');volume(p,192,764,51,57,{color:'#d6b3a5',depth:3,grain:true});r(215,767,3,51,'#9b788a');r(202,778,4,5,'#e8cfad');r(230,795,3,2,'#f7deb1');volume(p,177,824,82,8,{color:'#e7ccb6',depth:3});
 // Small pendant shades cast local warm pools; daylight keeps the glass cool.
 for(const x of[72,350]){r(x,26,1,9,'#8e7385');p.poly([[x-14,47],[x-9,34],[x+9,34],[x+14,47]],'#c7a0b4');r(x-13,47,26,2,'#edd2b7');oval(p,x,51,4,3,mix('#f8ddb1','#e1c9ae',a.day));p.c.globalAlpha=.045*(1-a.day*.8);oval(p,x,90,34,30,'#ffd4a1');p.c.globalAlpha=1}
 // Material illumination varies spatially: cool recesses, warm pendant pools,
 // and daylight entering from the real window. Glass preserves the sky palette.
 const image=p.c.getImageData(0,0,432,850),pixels=image.data;
 for(let y=24;y<838;y++)for(let x=20;x<412;x++){
  if(x>=175&&x<=260&&y>=54&&y<=197)continue;
  const i=(y*432+x)*4,windowLight=Math.max(0,1-Math.hypot((x-218)*.8,y-220)/440)*a.day,
   lampLight=Math.max(0,1-Math.min(Math.hypot(x-72,y-51),Math.hypot(x-350,y-51))/155)*a.night,
   ambient=.89+a.day*.10+windowLight*.06;
  pixels[i]=Math.min(255,pixels[i]*ambient+lampLight*10+windowLight*6);
  pixels[i+1]=Math.min(255,pixels[i+1]*ambient+lampLight*5+windowLight*4);
  pixels[i+2]=Math.min(255,pixels[i+2]*(ambient+.035)-lampLight*2);
 }
 p.c.putImageData(image,0,0);
 return p.canvas;
}
