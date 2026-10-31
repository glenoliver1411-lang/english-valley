import {refineCabin} from './room-detail.js';
import {paintGarden} from './garden-art.js';
import {painter} from './art.js';
import {rng,pixelEllipse} from './scenery-art.js';
import {mix,skyPalette} from './sky-model.js';
import {ROMANCE} from './romantic-config.js';
import {paintRoomSurfaces} from './home-art.js';
import {meadowPainting} from './meadow-art.js';
// Everything is drawn on the manor's existing two-pixel grid; no remote images.
export function retreatPainting(place,hour,theme='rose',room={}){
 if(place==='meadow')return meadowPainting(hour);
 const p=painter(432,850),r=p.r,random=rng(311),a=skyPalette(hour),n=a.night,d=a.day;
 if(place==='garden'){paintGarden(p,a);
 }else{
  const themeColor=ROMANCE.themes.find(t=>t.id===theme)||ROMANCE.themes[0];
  r(0,0,432,850,'#594659');r(18,24,396,797,'#aa8c91');r(26,29,380,246,'#d3b4a2');
  for(let y=30;y<274;y+=14){r(26,y,380,1,'#e4c8ae');for(let x=28;x<405;x+=28)r(x+(y%28?12:0),y,1,14,'#c9a696')}
  r(26,267,380,14,'#8e6f7d');r(26,281,380,528,'#a98b87');p.c.save();p.c.beginPath();p.c.rect(26,281,380,528);p.c.clip();for(let y=284;y<808;y+=26)for(let x=27;x<406;x+=54){r(x+(y%52?27:0),y,51,23,(x+y)%4?'#ba9b8f':'#b4958c');r(x+3,y+2,43,1,'#d0b09a')}
  p.c.restore();
  paintRoomSurfaces(p,room,d);
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
  r(181,748,72,72,'#755a71');r(186,754,62,64,'#c49fa1');r(193,759,48,48,'#e5c7aa');r(216,759,3,48,'#9d7c88');r(181,815,72,8,'#ecd0b2');refineCabin(p,a,themeColor,hour,room);
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
