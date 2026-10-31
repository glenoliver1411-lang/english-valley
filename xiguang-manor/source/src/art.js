import {ROMANCE} from './romantic-config.js';
// 全部素材在本地以相同的 2px 网格绘制；无图片下载、无 emoji。
const C={ink:'#42364f',grass:'#556867',light:'#718378',path:'#ba9c90',edge:'#8e7b7b',pink:'#e8a5b6',cream:'#ffe3b0',orange:'#e69c69',purple:'#aaa0c8'};
function painter(w,h){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;return{canvas,c,items:[],r:(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)},circle:(x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()},poly:(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()}}}
let seed=73;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
function flower(p,x,y,col=C.pink){p.items?.push({kind:'flower',id:`flower-${x}-${y}`,x,y,color:col,bounds:{x:x-6,y:y-6,w:13,h:16}});p.r(x,y,2,8,'#778a72');p.r(x-4,y+3,4,2,'#8ea37d');p.r(x-2,y-4,6,8,col);p.r(x-4,y-2,10,4,col);p.r(x,y-2,2,2,C.cream)}
function pumpkin(p,x,y,s=1){p.items?.push({kind:'pumpkin',id:`pumpkin-${x}-${y}`,x:x+8*s,y:y+8*s,bounds:{x,y:y-4*s,w:17*s,h:21*s}});const r=(a,b,w,h,c)=>p.r(x+a*s,y+b*s,w*s,h*s,c);r(5,-3,3,5,'#8c9b77');r(0,3,16,10,'#a65f57');r(2,0,12,16,'#d9885d');r(4,2,8,12,'#f5b576');r(7,1,2,12,'#e99a61');r(3,5,3,3,'#ffdf97');r(10,5,3,3,'#ffdf97');r(5,11,6,2,'#ffe3a2')}
function tree(p,x,y,s=1,pink=false){p.items?.push({kind:'tree',id:`tree-${x}-${y}`,x,y,special:pink,bounds:{x:x-32*s,y:y-53*s,w:64*s,h:89*s}});const r=(a,b,w,h,c)=>p.r(x+a*s,y+b*s,w*s,h*s,c);r(-5,0,10,36,'#675565');r(-2,2,3,33,'#977b7a');r(-13,9,11,5,'#675565');r(5,3,12,5,'#675565');let shades=pink?['#a181a8','#bb95b6','#d0a6bf']:['#3f5a60','#4b6b69','#638174'];for(let i=0;i<3;i++){r(-25+i*4,-23-i*14,50-i*8,30,shades[i]);r(-31+i*5,-17-i*14,62-i*10,14,shades[i])}r(-16,-49,11,3,pink?'#e4b8c7':'#779486')}
function fence(p,x,y,n){p.items?.push({kind:'fence',id:`fence-${x}-${y}`,x:x+n*8,y:y+10,bounds:{x,y:y-4,w:n*16,h:29}});for(let i=0;i<n;i++){p.r(x+i*16,y,5,24,'#9c8b9d');p.r(x+i*16+1,y-3,3,3,'#c4a8b5')}p.r(x,y+6,n*16,3,'#b19aa6');p.r(x,y+16,n*16,3,'#857c92')}
function lamp(p,x,y){p.items?.push({kind:'lamp',id:`lamp-${x}-${y}`,x,y,bounds:{x:x-9,y:y-21,w:20,h:54}});p.r(x-2,y,4,33,'#5e536b');p.r(x-7,y-14,14,17,'#5c4b61');p.r(x-4,y-11,8,11,'#ffda96');p.r(x-8,y-16,16,3,'#ae8b9a');p.r(x-3,y-20,6,4,'#ae8b9a')}
function house(p){p.items?.push({kind:'house',id:'candy-house',x:114,y:366,bounds:{x:31,y:261,w:166,h:155}});p.r(42,324,143,91,'#4b3d56');p.r(47,322,133,84,'#d8b0a0');p.r(53,325,121,76,'#e7c7ac');for(let y=330;y<400;y+=12)p.r(53,y,121,2,'#d4ac9b');p.poly([[31,326],[46,305],[67,305],[67,286],[159,286],[159,306],[183,306],[197,326]],'#5c4563');p.poly([[36,317],[69,281],[157,281],[190,317]],'#b7829e');for(let y=288;y<319;y+=7){p.r(68-(y-288),y,92+(y-288)*2,3,y%2?'#ca94ab':'#d1a0b2')}p.r(59,325,111,13,'#fff0c8');for(let x=59;x<171;x+=14)p.r(x,325,7,13,'#db9cab');p.r(96,356,31,50,'#765970');p.r(101,360,21,31,'#e8b889');p.r(104,363,15,25,'#ffe3ab');p.r(117,390,3,3,'#fff0bd');for(let x of [61,139]){p.r(x,351,25,32,'#84647d');p.r(x+3,354,19,24,'#ffdc9c');p.r(x+11,354,3,24,'#bd8f8b');p.r(x+3,365,19,3,'#bd8f8b');p.r(x-2,383,29,5,'#987d84');flower(p,x+5,384);flower(p,x+18,385,'#c2afd7')}p.r(87,405,51,6,'#bea397');p.r(82,411,61,5,'#d0b8a1');pumpkin(p,157,399,1.2);p.r(153,264,13,29,'#927288');p.r(150,261,19,5,'#c79ba7');}
export function makeArt(scene){
 const p=painter(432,850);const {r,poly}=p;
 r(0,0,432,850,C.grass);r(0,0,432,164,'#35344f');r(0,60,432,70,'#403d5a');r(0,112,432,54,'#50475f');
 for(let i=0;i<65;i++){let x=Math.floor(rand()*214)*2,y=Math.floor(rand()*66)*2;r(x,y,2,2,i%3?'#a69bb7':'#f1d6b4');if(i%9===0){r(x-2,y,6,2,'#f4dab7');r(x,y-2,2,6,'#f4dab7')}}
 // Pixel crescent moon and far-away manor skyline.
 for(let y=-20;y<=20;y+=2)for(let x=-20;x<=20;x+=2)if(x*x+y*y<400&&(x-9)*(x-9)+(y+5)*(y+5)>330)r(339+x,50+y,2,2,'#ffe4b2');
 poly([[0,156],[18,124],[34,141],[55,104],[79,143],[105,117],[132,152],[172,127],[210,157],[251,119],[286,144],[314,106],[343,146],[379,120],[412,146],[432,124],[432,180],[0,180]],'#354e55');
 for(let i=0;i<650;i++){let x=Math.floor(rand()*216)*2,y=166+Math.floor(rand()*340)*2;r(x,y,rand()>.5?4:2,2,i%3?'#60736b':'#4c605f')}
 // Raised winding stone paths.
 poly([[194,850],[240,850],[240,643],[288,580],[288,486],[241,432],[241,290],[269,255],[248,211],[211,214],[198,270],[198,447],[242,497],[242,567],[194,632]],'#8c7d7c');
 poly([[201,850],[233,850],[233,640],[281,578],[281,489],[234,434],[234,287],[260,254],[244,220],[217,220],[205,273],[205,450],[249,499],[249,569],[201,635]],C.path);
 r(105,417,111,26,C.edge);r(108,417,111,21,C.path);r(270,486,70,26,C.edge);r(270,486,70,21,C.path);r(86,585,163,24,C.edge);r(86,585,163,19,C.path);
 for(let i=0;i<95;i++){let y=240+i*6;let x=y<450?214:y<577?260:216;r(x+(i%3)*5-8,y,5,2,'#d0b2a0')}
 // Pond, reeds and stones.
 for(let [x,y,w,h,col] of [[304,234,98,65,'#45515e'],[310,230,84,69,'#9d949e'],[306,240,96,49,'#9d949e'],[314,237,78,55,'#698493'],[310,247,88,33,'#698493'],[320,244,64,38,'#7d97a4']])r(x,y,w,h,col);
 for(let i=0;i<13;i++)r(319+Math.floor(rand()*33)*2,245+Math.floor(rand()*18)*2,8,2,'#a8b5ba');r(350,250,16,4,'#ead1bb');r(357,245,4,14,'#ead1bb');for(let x of [307,390]){r(x,275,2,17,'#a0a081');r(x-2,269,6,8,'#b59e87')}flower(p,387,301,'#bda6d0');
 house(p);tree(p,232,218,1.65,true);for(let i=0;i<15;i++){let x=185+Math.floor(rand()*48)*2,y=132+Math.floor(rand()*35)*2;r(x,y,2,4,'#f2c8c5')}
 // Garden beds.
 fence(p,25,519,9);for(let row=0;row<2;row++)for(let col=0;col<2;col++){let x=41+col*49,y=552+row*43;r(x-3,y-3,41,30,'#b39689');r(x,y,35,24,'#78636b');for(let k=0;k<3;k++)r(x+3,y+5+k*7,29,2,'#8c7476')}
 for(let x of [29,151])for(let y of [556,591,626])flower(p,x,y,'#dfb0bd');
 // Cat courtyard, little blanket, cushions, climbing post.
 r(314,429,73,53,'#a78f9d');r(318,433,65,45,'#c8a3b0');r(322,437,57,37,'#a98da4');for(let x=323;x<377;x+=8)r(x,437,2,37,'#c0a2b7');r(376,414,7,33,'#c4a78d');r(363,411,32,6,'#a68b99');r(314,465,21,6,'#dfbca8');r(317,463,15,3,'#f1d1b2');fence(p,309,393,7);
 // Lanterns, border trees, stones, flowers and mushrooms.
 for(let [x,y] of [[24,248],[392,354],[23,467],[397,579],[39,700],[383,710],[88,198],[416,180]])tree(p,x,y,.8);
 for(let [x,y] of [[183,335],[286,364],[174,641],[270,653],[58,459],[377,544]]){lamp(p,x,y);pumpkin(p,x+9,y+20)}
 for(let i=0;i<75;i++){let x=Math.floor(rand()*214)*2,y=180+Math.floor(rand()*320)*2;if((x>180&&x<285)||(x<190&&y>280&&y<440)||(x>299&&y<310))continue;flower(p,x,y,i%3?'#b6a6c5':'#edb5b8')}
 // Manor entrance with two warm gateposts.
 fence(p,20,756,10);fence(p,264,756,10);for(let x of [176,251]){r(x,731,12,49,'#6a6175');r(x-3,725,18,9,'#a791a1');pumpkin(p,x-2,711,1)}
 r(194,780,46,4,'#d6b39e');r(190,786,54,4,'#9e8990');
 scene.textures.addCanvas('world',p.canvas);scene.worldObjects=p.items;
 const room=painter(432,560);room.r(0,0,432,560,'#68516d');room.r(18,30,396,265,'#bd97a8');for(let x=24;x<414;x+=20)room.r(x,30,2,260,'#cdacb7');for(let y=295;y<560;y+=22)for(let x=0;x<432;x+=40){room.r(x+(y%44?20:0),y,38,20,'#a4878a')}room.r(26,276,380,10,'#e2bda4');for(let x of [45,294]){room.r(x,96,93,132,'#765e77');room.r(x+6,102,81,120,'#8c6b83');for(let y of [134,176,218]){room.r(x+3,y,87,7,'#d3ac9f');for(let j=0;j<4;j++){room.r(x+10+j*20,y-25,13,25,'#ecd6bd');room.r(x+12+j*20,y-21,9,16,['#d8a0b5','#b6a9d0','#e9ba8f'][j%3]);room.r(x+9+j*20,y-29,15,4,'#b28e9f')}}}room.r(168,70,96,122,'#695b7c');room.r(174,76,84,110,'#515473');room.circle(216,110,19,'#ffdfab');room.r(213,76,6,110,'#b995a0');room.r(174,133,84,5,'#b995a0');room.r(45,271,342,66,'#745a71');room.r(39,263,354,15,'#f2caaa');room.r(52,286,328,43,'#a88090');for(let x of [100,200,300])pumpkin(room,x,244,1.3);scene.textures.addCanvas('room',room.canvas);
 // Directional four-frame walking sprite sheet, including feet, arms and a swinging bag.
 const sheet=painter(32*4,40*4);
 for(let dir=0;dir<4;dir++)for(let f=0;f<4;f++){
  let ox=f*32,oy=dir*40,b=f%2?1:0,step=[0,2,0,-2][f];const q=(x,y,w,h,c)=>sheet.r(ox+x,oy+y+b,w,h,c);
  q(7,33,20,4,'#42505b');q(11,28,4,7+step,'#654e68');q(19,28,4,7-step,'#654e68');q(10,33+step,6,3,'#e4b5ac');q(18,33-step,6,3,'#e4b5ac');
  q(8,17,18,15,'#8c6991');q(7,22,20,8,'#b598bc');q(10,20,14,6,'#c5acd0');q(5,21+step/2,4,8,'#f1cdb8');q(25,21-step/2,4,8,'#f1cdb8');q(24,25-step/2,6,6,'#e3aa8b');
  q(7,5,20,17,'#644c61');q(10,8,14,13,'#f5d5bc');q(7,5,20,7,'#79586e');q(6,10,5,11,'#79586e');q(23,10,5,12,'#79586e');q(11,3,12,3,'#79586e');q(7,5,20,3,'#edb9bb');q(21,3,6,5,'#f7c9bd');
  if(dir!==3){q(dir===1?11:dir===2?21:13,14,2,3,'#5d4d63');if(dir===0)q(21,14,2,3,'#5d4d63');q(16,18,3,1,'#cb8e95')}else q(10,10,14,13,'#79586e');
 }
 scene.textures.addSpriteSheet('girl',sheet.canvas,{frameWidth:32,frameHeight:40});
 const ghost=painter(32,38);ghost.r(7,7,18,23,'#f2ddcf');ghost.r(4,13,24,14,'#f2ddcf');ghost.r(5,29,6,4,'#f2ddcf');ghost.r(14,28,6,5,'#f2ddcf');ghost.r(23,27,5,4,'#f2ddcf');ghost.r(10,16,3,4,'#756178');ghost.r(22,16,3,4,'#756178');ghost.r(14,23,6,2,'#bf929e');ghost.r(7,22,4,2,'#e9b2b2');pumpkin(ghost,8,0);scene.textures.addCanvas('ghost',ghost.canvas);
 const cat=painter(40,40);cat.r(10,24,23,11,'#5b4a64');cat.r(8,16,23,15,'#66536e');cat.poly([[8,18],[10,9],[17,17]],'#66536e');cat.poly([[23,17],[29,9],[31,20]],'#66536e');cat.r(12,21,3,3,'#f4d9a3');cat.r(24,21,3,3,'#f4d9a3');cat.r(18,26,3,2,'#e7aeb7');cat.r(3,27,7,4,'#66536e');cat.r(2,21,4,9,'#66536e');cat.poly([[9,14],[20,0],[28,14]],'#9984b1');cat.r(5,13,29,4,'#ae94bf');cat.r(14,9,12,3,'#e4b5a5');cat.r(20,8,3,4,'#f6d39c');scene.textures.addCanvas('cat',cat.canvas);
 for(let [key,color] of [['pink','#e8a1bb'],['orange','#efba80'],['purple','#bcabe0'],['magic','#ffe3a3']]){const a=painter(24,20);a.poly([[1,5],[8,8],[8,12],[1,15]],color);a.poly([[23,5],[16,8],[16,12],[23,15]],color);a.r(7,4,10,12,C.ink);a.r(8,5,8,10,color);a.r(10,6,3,3,'#fff2d8');a.r(9,14,6,2,'#a7819c');scene.textures.addCanvas(key,a.canvas)}
 const f=painter(14,18);flower(f,6,8);scene.textures.addCanvas('flower',f.canvas);for(const type of ROMANCE.flowers){const v=painter(14,18);flower(v,6,8,type.color);scene.textures.addCanvas('flower-'+type.id,v.canvas)}
}
// Shared by the new scenery modules; the original textures and map stay intact.
export {painter,flower,pumpkin,tree,fence,lamp};
