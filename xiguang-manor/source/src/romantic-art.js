import {painter,tree,flower,lamp,fence} from './art.js';
import {rng,pixelEllipse} from './scenery-art.js';
import {mix,skyPalette} from './sky-model.js';
import {ROMANCE} from './romantic-config.js';
// Everything is drawn on the manor's existing two-pixel grid; no remote images.
export function retreatPainting(place,hour,theme='rose'){
 const p=painter(432,850),r=p.r,random=rng(311),a=skyPalette(hour),n=a.night,d=a.day;
 if(place==='garden'){
  r(0,0,432,850,mix('#3d5557','#7e987d',d));
  for(let i=0;i<1000;i++){const x=Math.floor(random()*216)*2,y=Math.floor(random()*425)*2;r(x,y,i%3?2:4,2,mix(i%2?'#49645e':'#617970',i%2?'#8da583':'#a6b18d',d))}
  // A winding path disappears beneath the south flower arch.
  p.poly([[180,850],[242,850],[242,724],[282,656],[262,577],[216,527],[231,451],[294,401],[296,359],[260,355],[252,387],[189,431],[175,533],[217,590],[236,649],[194,709]],mix('#827b7a','#d1b6a3',d));
  p.poly([[192,850],[229,850],[229,718],[268,652],[250,584],[203,530],[217,444],[281,394],[280,367],[268,365],[262,394],[204,436],[189,531],[231,588],[251,653],[207,713]],mix('#ad9991','#e0c9ae',d));
  for(let i=0;i<42;i++){let y=400+i*10,x=205+Math.sin(y*.014)*31;r(x,y,12,2,mix('#8e8382','#baa292',d))}
  // Old rosewood canopy, with roots that lead into the flower beds.
  for(const [x,y,s]of [[20,128,1.6],[407,135,1.8],[12,338,1.7],[425,390,1.6],[17,605,1.6],[420,670,1.5],[28,810,1.2],[406,824,1.3]])tree(p,x,y,s);
  r(189,187,44,98,'#584e5d');r(198,174,16,113,'#806778');r(206,174,4,105,'#a08488');p.poly([[201,225],[165,263],[146,273],[187,270],[210,245],[241,276],[274,279],[229,243]],'#806778');
  // Dense, scalloped canopy with clusters, branch gaps and tiny edge highlights.
  const canopy=rng(71);
  for(let row=0;row<8;row++){const yy=75+row*16,half=[43,69,88,100,109,100,86,59][row];for(let x=216-half;x<216+half;x+=14){const edge=Math.abs(x-216)/half,shade=row<3?'#ad8fa9':edge>.75?'#7d6a86':'#967e9c';r(x+canopy()*7,yy+canopy()*7,19+canopy()*10,15+canopy()*8,mix(shade,row<3?'#d4b1c2':'#b79cb4',d));if(canopy()>.4){r(x+4,yy+2,8,2,mix('#c9a5bd','#ead0d0',d));r(x+1,yy+5,3,2,'#b193ae')}}}
  for(let i=0;i<64;i++){const x=133+canopy()*170,y=89+canopy()*101;r(x,y,2+canopy()*3,2,i%3?'#caa5bd':'#e0bfcb')}
  // Oval reflecting pool and the low stone lip.
  pixelEllipse(p,324,285,54,37,'#827c89');pixelEllipse(p,324,280,51,32,'#beb1b2');pixelEllipse(p,324,280,44,26,mix('#455a72','#8faeb2',d));pixelEllipse(p,324,280,39,21,mix('#5c7188','#abc6c1',d));
  for(const [x,y]of [[305,283],[342,270]]){pixelEllipse(p,x,y,8,3,'#7f9b86');flower(p,x+2,y-4,'#d9b3c9')}
  // Six small flower plots, individually accessible from the path.
  for(let i=0;i<6;i++){const x=87+i%2*67,y=401+Math.floor(i/2)*61;r(x-24,y-18,48,35,'#a28a88');r(x-21,y-15,42,28,'#64565e');for(let k=0;k<3;k++)r(x-17,y-9+k*8,33,2,'#806b70');r(x-22,y+13,45,3,'#c1a19b')}
  // Swing ropes, hung from a quiet branch; seat is animated separately.
  r(319,425,6,139,'#746170');r(391,425,6,139,'#746170');r(315,419,87,8,'#a1848b');r(335,427,2,102,'#ceb9a4');r(377,427,2,102,'#ceb9a4');
  fence(p,281,604,6);lamp(p,285,635);
  // Archway of vines and asymmetrical clusters of roses.
  r(164,730,7,73,'#977e87');r(265,730,7,73,'#977e87');p.poly([[164,734],[164,713],[178,697],[197,689],[237,689],[257,701],[272,720],[272,738],[265,738],[265,723],[252,707],[234,698],[199,698],[183,706],[171,720],[171,734]],'#bda0a1');
  for(let i=0;i<18;i++){const angle=Math.PI+i/17*Math.PI,x=218+Math.cos(angle)*55,y=738+Math.sin(angle)*46;r(x,y,9,6,'#6f8b77');if(i%3!==0)flower(p,x+4,y-2,i%2?'#d7a7bd':'#c5b0d5')}
  for(let i=0;i<65;i++){const x=45+random()*343,y=320+random()*450;if(x>174&&x<279||x>53&&x<189&&y>375&&y<550)continue;flower(p,x,y,i%4?'#c5a3ba':'#e8d1a9')}
  // Tiny grass star and a pale sweet are discoveries, not quest markers.
  r(300,676,2,8,'#f1ddb4');r(297,679,8,2,'#d3b9dc');r(47,618,8,4,'#e5a3b7');r(45,617,2,6,'#e5c2bb');r(55,617,2,6,'#e5c2bb');
 }else{
  const themeColor=ROMANCE.themes.find(t=>t.id===theme)||ROMANCE.themes[0];
  r(0,0,432,850,'#594659');r(18,24,396,797,'#aa8c91');r(26,29,380,246,'#d3b4a2');
  for(let y=30;y<274;y+=14){r(26,y,380,1,'#e4c8ae');for(let x=28;x<405;x+=28)r(x+(y%28?12:0),y,1,14,'#c9a696')}
  r(26,267,380,14,'#8e6f7d');r(26,281,380,528,'#a98b87');p.c.save();p.c.beginPath();p.c.rect(26,281,380,528);p.c.clip();for(let y=284;y<808;y+=26)for(let x=27;x<406;x+=54){r(x+(y%52?27:0),y,51,23,(x+y)%4?'#ba9b8f':'#b4958c');r(x+3,y+2,43,1,'#d0b09a')}
  p.c.restore();
  // Generous window, with hills outside and curtains in the familiar lavender.
  r(119,69,194,171,'#8c6f7f');r(125,75,182,154,'#ebcdb2');r(131,81,170,139,a.top);
  for(let y=82;y<220;y+=2)r(132,y,168,2,mix(a.top,a.bottom,(y-82)/138));
  p.poly([[132,186],[151,165],[171,183],[192,158],[228,190],[257,163],[299,179],[299,220],[132,220]],a.far);p.poly([[132,199],[176,185],[220,206],[265,183],[300,197],[300,220],[132,220]],a.mid);

  r(212,78,6,147,'#d6b89f');r(130,156,170,5,'#d6b89f');r(118,224,197,10,'#f1d9b8');r(103,65,22,166,'#b09bb9');r(300,65,23,166,'#b09bb9');r(98,62,231,6,'#8e7385');r(109,72,4,109,'#ccb4c8');r(309,72,4,117,'#ccb4c8');
  // Fireplace, stone surround and mantle.
  r(31,184,73,144,'#9c8085');r(26,180,84,9,'#e0bfaa');r(40,238,56,78,'#63515e');r(45,248,46,65,'#3c3545');r(28,318,82,12,'#c5a596');for(let y=198;y<237;y+=14)r(36,y,60,2,'#bda08f');r(61,161,9,17,'#bea2bc');r(83,163,10,15,'#e4c19a');
  // Bed with pillow, handstitched quilt and a little star on the headboard.
  r(279,345,108,180,'#765e71');r(274,337,118,15,'#ba98a0');r(288,356,91,29,'#eedac6');r(286,389,95,108,themeColor.bed);r(293,365,34,17,'#fff0db');r(335,365,34,17,'#f5e6d2');for(let y=398;y<492;y+=18){r(291,y,85,2,'#efd5cc');for(let x=300;x<378;x+=19)r(x,y+5,3,3,'#f5dec1')}r(273,501,119,11,'#b08a94');r(280,512,8,21,'#806273');r(378,512,8,21,'#806273');
  // Wool rug, sofa, bookshelf, mirror and the cat's round bed.
  r(83,414,167,186,'#846777');r(87,418,159,178,themeColor.rug);for(let i=0;i<4;i++){r(93+i*3,424+i*3,147-i*6,1,'#dfbdc5');r(93+i*3,588-i*3,147-i*6,1,'#dfbdc5')}pixelEllipse(p,165,505,34,35,'#ddbbc6');r(162,475,6,57,'#edcfb9');r(140,501,51,6,'#edcfb9');
  r(37,372,53,108,'#8b7183');r(32,383,62,65,'#c7a3b1');r(41,390,44,24,'#e4c1c6');r(42,418,43,19,'#d8b5bf');r(32,444,62,6,'#7d6176');
  r(322,581,69,100,'#775d74');for(let i=0;i<3;i++){r(327,588+i*29,59,21,'#564657');for(let j=0;j<6;j++)r(330+j*9,592+i*29,6,17,['#c2a5bd','#c9b5a1','#9fabc0','#d0a0ac'][j%4]);r(325,611+i*29,63,4,'#c6a194')}
  r(44,565,59,95,'#997b8d');r(48,569,51,81,'#c4b9cf');r(52,573,43,72,'#b1b8c7');r(52,578,9,52,'#ddd8d9');r(39,659,70,8,'#d6b5a7');
  pixelEllipse(p,325,720,41,25,'#8c7281');pixelEllipse(p,325,717,36,21,themeColor.rug);pixelEllipse(p,325,715,28,14,'#cfafb5');
  // Window desk, mail and personal gift.
  r(148,265,118,12,'#dfbda8');r(155,277,6,57,'#967486');r(252,277,6,57,'#967486');r(172,251,27,13,'#f1dfc8');r(176,254,19,1,'#bc9ca2');r(227,245,25,19,'#c89caf');r(237,245,4,19,'#f0d5af');r(224,250,31,4,'#f0d5af');
  // A hanging constellation stitched between the rafters.
  r(29,33,375,7,'#8f6e7f');for(const [x,y]of [[54,86],[86,112],[345,86],[375,126]]){r(x,40,1,y-40,'#a88a9e');r(x-1,y-4,3,9,'#eed4a5');r(x-4,y-1,9,3,'#eed4a5')}
  r(181,748,72,72,'#755a71');r(186,754,62,64,'#c49fa1');r(193,759,48,48,'#e5c7aa');r(216,759,3,48,'#9d7c88');r(181,815,72,8,'#ecd0b2');
 }
 return p.canvas;
}
export function addRomanticEntrances(scene){
 const p=painter(97,86);p.r(10,25,77,57,'#d9baa3');p.poly([[2,28],[27,2],[70,2],[96,28]],'#a7849d');for(let y=7;y<29;y+=5)p.r(27-y*.7,y,43+y*1.4,2,'#cda5b8');p.r(27,43,25,39,'#8f7186');p.r(31,47,17,27,'#f1d1a8');p.r(61,42,17,18,'#ad8b9a');p.r(63,44,13,14,'#f9d8a3');p.r(69,44,2,14,'#b8969b');p.r(12,80,77,4,'#ae8e91');scene.textures.addCanvas('personal-cabin',p.canvas);
 scene.cabinImage=scene.add.image(340,665,'personal-cabin');scene.world.add(scene.cabinImage);
 const g=scene.add.graphics();g.lineStyle(5,0xbba0ad);g.strokeRoundedRect(49,665,62,65,28);g.fillStyle(0x567168);for(let i=0;i<12;i++){const x=49+i*5,y=677-Math.sin(i/11*Math.PI)*13;g.fillRect(x,y,7,6);g.fillStyle(i%3?0xd8acc1:0xc3afd7);g.fillRect(x+1,y,4,3);g.fillStyle(0x567168)}scene.world.add(g);
 // A small dock points toward the existing pond, without altering collisions.
 const dock=scene.add.graphics();dock.fillStyle(0x967e87);dock.fillRect(292,295,61,16);for(let x=294;x<352;x+=8){dock.fillStyle(0xc4a69d);dock.fillRect(x,296,2,14)}scene.world.add(dock);
}
