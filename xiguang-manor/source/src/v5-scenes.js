import {V5} from './v5-config.js';
import {v5Frame,v5Blit,v5MountainSource} from './v5-assets.js';
import {skyPalette,mix,hourPhase} from './sky-model.js';
export const V5_HOME_PROPS=[
 {name:'fixed-fireplace',x:24,y:178,foot:330},{name:'fixed-desk',x:140,y:245,foot:330},
 {name:'fixed-bed',x:272,y:315,foot:527},{name:'fixed-sofa',x:29,y:363,height:90,foot:448},
 {name:'fixed-wardrobe',x:31,y:548,height:119,foot:667},{name:'fixed-bookcase',x:318,y:568,height:116,foot:684}
];
export const V5_SHOP_PROPS=[
 {name:'shop-oven',x:280,y:255,foot:352},{name:'shop-mix-table',x:40,y:329,foot:407},
 {name:'shop-tasting-case',x:36,y:386,foot:442},{name:'shop-pack-table',x:270,y:456,foot:530},
 {name:'shop-recipe-desk',x:54,y:528,foot:574},{name:'shop-recipe-desk',x:256,y:611,foot:663},
 {name:'shop-gift-shelf',x:296,y:376,foot:424}
];
export const v5Period=hour=>hourPhase(hour)==='morning'?'dawn':hourPhase(hour)==='dusk'?'dusk':hourPhase(hour)==='day'?'day':'night';
export function v5Window(c,x,y,w,h,hour){const a=skyPalette(hour),period=v5Period(hour);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();for(let yy=0;yy<h;yy++){c.fillStyle=mix(a.top,a.bottom,yy/h);c.fillRect(x,y+yy,w,1)}
 const rock=v5MountainSource('rock',period,true);c.drawImage(rock,0,0,768,230,x-w*.11,y+h*.30,w*1.22,h*.53);c.drawImage(v5MountainSource('forest2',period),0,0,768,155,x,y+h*.68,w,h*.26);c.fillStyle=mix(a.near,a.bottom,.23);c.fillRect(x,y+h*.83,w,h*.17);
 if(a.night>.3){c.fillStyle='#f4dfb5';c.fillRect(x+w*.77,y+h*.15,5,7);c.fillStyle=a.top;c.fillRect(x+w*.79,y+h*.14,4,5);for(let i=0;i<16;i++){c.globalAlpha=.35+i%4*.12;c.fillStyle='#ede2cf';c.fillRect(x+7+(i*31)%Math.max(1,w-14),y+6+(i*17)%Math.max(1,h*.47),1,1)}}c.restore();}
export function paintV5Cabin(hour,theme,room){
 const out=document.createElement('canvas');out.width=432;out.height=850;const c=out.getContext('2d');c.imageSmoothingEnabled=false;const period=v5Period(hour),a=skyPalette(hour),opts={period,theme};
 c.fillStyle='#44384c';c.fillRect(0,0,432,850);c.save();c.beginPath();c.rect(24,280,384,550);c.clip();v5Blit(c,'floor-'+(room.floor==='pale'?'pale':room.floor==='herringbone'?'herringbone':'wood'),0,280,opts);c.restore();
 v5Window(c,129,61,174,166,hour);v5Blit(c,'cabin-walls-'+(room.wallpaper||'original'),0,0,opts);
 // Side walls recede to the same floor plane. These are architectural faces,
 // not a full-screen color tint or an overlay on the previous room painting.
 c.fillStyle=period==='night'?'#725b70':'#9f7d87';c.beginPath();c.moveTo(16,294);c.lineTo(25,285);c.lineTo(25,828);c.lineTo(16,836);c.fill();c.fillStyle=period==='night'?'#4c4055':'#786073';c.fillRect(407,294,9,540);
 v5Blit(c,'room-rug',79,405,opts);
 if(a.day>.2){c.globalAlpha=a.day*.12;c.fillStyle='#fff1c8';c.beginPath();c.moveTo(149,284);c.lineTo(238,284);c.lineTo(179,558);c.lineTo(66,536);c.closePath();c.fill();c.globalAlpha=a.day*.07;c.fillRect(117,333,73,4);c.globalAlpha=1}
 // Fixed subjects are separate Phaser sprites, sorted at their original footprints.
 v5Blit(c,'furniture-catBed',282,690,{...opts,width:88,height:52});
 // Two framed botanical prints replace empty wall space, below the rafters.
 for(const [x,y]of [[54,105],[359,116]]){c.fillStyle='#a18384';c.fillRect(x-12,y-16,25,34);c.fillStyle='#eedcc4';c.fillRect(x-10,y-14,21,29);v5Blit(c,'flower-'+(x<100?'lily':'rose'),x-8,y-10,{...opts,width:18,height:25})}
 c.fillStyle='#8b6879';c.fillRect(179,748,76,80);c.fillStyle='#d1ad99';c.fillRect(185,756,64,65);c.fillStyle='#e9ceaa';c.fillRect(190,762,54,54);c.fillStyle='#99788a';c.fillRect(215,763,2,51);c.fillStyle='#e8c5a3';c.fillRect(178,821,78,7);
 return out;
}
export function paintV5Workshop(hour){
 const out=document.createElement('canvas');out.width=432;out.height=850;const c=out.getContext('2d');c.imageSmoothingEnabled=false;const period=v5Period(hour),opts={period},a=skyPalette(hour);
 c.fillStyle='#493c53';c.fillRect(0,0,432,850);c.save();c.beginPath();c.rect(20,314,392,523);c.clip();v5Blit(c,'floor-candy',0,314,opts);c.restore();v5Window(c,173,55,88,145,hour);v5Blit(c,'candy-walls',0,0,opts);
 v5Blit(c,'shop-cabinet',29,66,opts);v5Blit(c,'shop-cabinet',285,66,opts);
 c.fillStyle='#efddc2';c.font='11px sans-serif';c.textAlign='center';c.fillText(V5.workshop.shelf,216,250);c.font='8px sans-serif';c.fillStyle='#d4b3bc';c.fillText(V5.workshop.shelfSmall,216,268);c.textAlign='left';
 if(a.day>.2){c.globalAlpha=a.day*.14;c.fillStyle='#fff2cc';c.beginPath();c.moveTo(180,317);c.lineTo(245,317);c.lineTo(303,615);c.lineTo(132,589);c.closePath();c.fill();c.globalAlpha=1}
 // Workstations are sorted separately against the walking player.
 // A runner and its woven floral borders frame the walking aisle.
 c.fillStyle=period==='night'?'#96758d':'#b48e9c';c.fillRect(172,437,85,306);c.fillStyle='#e4c5ba';for(let y=447;y<734;y+=23){c.fillRect(178,y,2,9);c.fillRect(249,y,2,9);c.fillRect(212,y+3,5,3)}
 for(const[name,x,y]of [['flower-pot-fern',25,287],['flower-pot-lily',377,430]])v5Blit(c,name,x,y,{...opts,width:32,height:42});
 c.fillStyle='#8a697d';c.fillRect(180,754,76,79);c.fillStyle='#d9b59d';c.fillRect(186,760,64,67);c.fillStyle='#f0d7b4';c.fillRect(193,766,50,53);c.fillStyle='#ad8b87';c.fillRect(216,767,2,50);c.fillRect(177,828,82,5);
 return out;
}
