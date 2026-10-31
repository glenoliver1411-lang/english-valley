import {mix} from './sky-model.js';
import {volume,framed,cushion,book,jar,blossom,line,oval} from './material-painter.js';
import {paintWindowVista} from './world-detail.js';

// Refine the existing fixed fixtures in place; the bed, sofa, shelves, door and
// all walkable spaces retain their original dimensions and interaction anchors.
export function refineCabin(p,a,theme,hour=22,room={}){
 const r=p.r,wood='#a4838e',edge='#705b73',warm='#e6c8b3',cloth=theme.bed;
 // Wall boards and turned skirting introduce depth without repainting the room.
 volume(p,26,264,380,17,{color:'#b08d93',depth:4});r(28,268,374,2,'#e7c8b1');r(28,280,375,3,'#765f75');
 if(!room.wallpaper||room.wallpaper==='original'){r(26,29,77,146,'#d4b7ac');r(329,29,77,235,'#d4b7ac');for(let x=30;x<405;x+=27){if(x>96&&x<330)continue;r(x,31,1,143,'#bb9ca1');r(x+1,31,1,143,'#ead0b9');for(let y=55;y<169;y+=51){r(x+9,y,8,1,'#ceb0aa');r(x+11,y+3,3,1,'#bea0a4')}}}
 paintWindowVista(p,132,82,168,138,hour);r(212,81,6,141,'#d6b89f');r(132,156,168,5,'#d6b89f');
 // Window reveals and deep stone sill; curtains have hems and shaded folds.
 volume(p,119,222,194,14,{color:'#d9baa3',depth:5});r(124,227,181,1,'#f8dfbd');r(126,235,182,3,'#987888');r(126,80,3,139,'#766d86');r(294,81,4,139,'#cbb5bf');r(132,83,2,67,'#e5ddd8');
 for(const x of[104,113,304,313]){r(x,75,2,132,'#8c7b96');r(x+2,75,1,131,'#d7bccf');r(x,207,5,2,'#d6b4c1')}
 // Fireplace arch, stacked stone courses, mantel thickness and brass grate.
 volume(p,26,178,84,12,{color:'#d9bda8',depth:4});r(29,183,74,1,'#f0d9bd');r(38,236,57,4,'#846777');r(40,240,4,73,'#a18689');r(92,238,4,76,'#604e63');
 for(let y=195;y<235;y+=11){r(33,y,64,1,'#c8a69c');for(let x=35+(y%22?0:9);x<98;x+=19){r(x,y,1,8,'#8e737f');r(x+2,y+1,11,1,'#d9b7a5')}}
 volume(p,26,315,84,14,{color:'#b89b96',depth:4});r(41,310,52,3,'#4e4356');for(let x=49;x<88;x+=9){r(x,294,2,19,'#806673');r(x+1,294,1,16,'#bb9385')}r(47,303,43,2,'#ae8982');
 // A real mattress stack, bed frame, quilt, bolster and turned posts.
 volume(p,279,345,108,179,{color:'#9e7c8e',depth:5,grain:true});volume(p,274,337,118,16,{color:'#b7959f',depth:4});r(280,342,105,2,'#e4c0b3');
 volume(p,284,359,97,142,{color:'#d8bfbc',depth:4});r(286,364,91,130,'#ead5c4');cushion(p,290,365,39,19,'#f7e4ce');cushion(p,333,365,39,19,'#ead3ca');r(293,367,28,1,'#fff0d7');
 cushion(p,284,391,96,108,cloth);r(288,398,87,3,mix(cloth,'#f2dac7',.46));r(287,488,91,5,mix(cloth,edge,.26));
 for(let x=299;x<376;x+=16){line(p,x,404,x-2,484,mix(cloth,edge,.15));line(p,x+2,404,x,479,mix(cloth,'#fff0d0',.2))}
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){const x=298+col*21,y=414+row*21;p.poly([[x,y],[x+3,y-3],[x+6,y],[x+3,y+3]],mix(cloth,'#f6ddbc',.55));r(x+3,y,1,1,'#f7e1c1')}
 volume(p,273,499,119,15,{color:'#b28e99',depth:4});r(280,504,104,1,'#e4bdb1');volume(p,280,513,8,18,{color:wood,depth:2});volume(p,378,513,8,18,{color:wood,depth:2});
 // Upholstered reading sofa, with arms and cushions above a wooden plinth.
 volume(p,32,374,62,75,{color:'#8b6e83',depth:4});cushion(p,39,379,47,32,'#d4aebb');cushion(p,39,415,47,24,'#c49fb2');volume(p,31,386,10,61,{color:'#bd98ad',depth:3});volume(p,85,386,10,61,{color:'#af8ca4',depth:3});r(38,445,49,3,'#71566f');cushion(p,48,397,24,17,'#ead0ca');
 // Bookcase side, shelves, turned knobs, page edges and individual bindings.
 volume(p,322,581,69,100,{color:'#98758e',depth:5,grain:true});r(328,589,55,82,'#67516d');
 for(let shelf=0;shelf<3;shelf++){const y=592+shelf*28;for(let i=0;i<6;i++){const h=15+(i*3+shelf)%5;volume(p,331+i*8,y+19-h,6,h,{color:['#b99dbb','#cbbba7','#8caaa9','#d4a0b2'][i%4],depth:1});r(332+i*8,y+16-h,4,1,'#ecdbbf');r(332+i*8,y+16,3,1,'#ead3b8')}volume(p,326,y+20,59,5,{color:'#b996a4',depth:2})}
 volume(p,322,671,69,9,{color:'#ab8999',depth:3});
 // Window desk has thickness; letter, gift, pen and ink each keep a small volume.
 volume(p,148,263,118,15,{color:'#d7b39f',depth:4});volume(p,155,277,6,56,{color:wood,depth:2});volume(p,252,277,6,56,{color:wood,depth:2});book(p,173,250,27,13,'#e4d4c0');r(180,255,13,1,'#b696a5');volume(p,227,244,25,20,{color:'#c99ab5',depth:4});r(236,245,4,17,'#f0d3aa');r(228,251,20,3,'#f3d8b4');p.poly([[238,246],[231,239],[228,243],[235,248]],'#e4bbc6');p.poly([[238,246],[245,239],[249,243],[241,248]],'#efcfd0');jar(p,154,252,10,12,'#ada3ba');
 // Mirror edge and the woven fixed cat basket.
 framed(p,44,565,59,94,'#a8b9c8','#a2869a');r(51,575,4,69,'#dde2db');r(55,575,1,69,'#ede7db');line(p,60,582,88,634,'#c6d1d4',2);volume(p,39,658,70,9,{color:'#d4b49f',depth:3});
 oval(p,325,720,41,25,'#8a707e');oval(p,325,716,37,22,'#c6a78f');oval(p,325,712,30,15,cloth);oval(p,325,711,24,11,'#e4c5c7');for(let row=0;row<3;row++)for(let i=0;i<10;i++)r(292+i*7+row%2*3,720+row*5,4,1,row%2?'#e1c3a5':'#a48587');
 // The floor receives a broad, directional pool of fresh morning light, clipped
 // behind the furniture; night remains readable and warm around the hearth.
 if(a.day>.3){p.c.save();p.c.beginPath();p.c.rect(26,282,380,526);p.c.clip();p.c.globalAlpha=.06*a.day;p.poly([[137,281],[271,281],[384,509],[183,509]],'#fff0c9');p.c.globalAlpha=.028*a.day;p.poly([[153,281],[173,281],[287,520],[267,520]],'#fff5d6');p.c.restore()}
}
