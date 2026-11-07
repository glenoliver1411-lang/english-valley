import room from './assets/candy-atelier/room.webp';
import atlas from './assets/candy-atelier/atlas.json';
const files=import.meta.glob('./assets/candy-atelier/*.webp',{eager:true,query:'?url',import:'default'});
export const candyArt=name=>files['./assets/candy-atelier/'+name+'.webp'];
export const ATELIER={floor:335,props:[
 {id:'make',art:'mixing',x:110,y:407,w:136,h:106,footW:112,footH:27,stand:{x:202,y:414}},
 {id:'oven',art:'oven',x:337,y:372,w:94,h:136,footW:78,footH:31,stand:{x:258,y:397}},
 {id:'taste',art:'display',x:92,y:505,w:132,h:98,footW:112,footH:25,stand:{x:175,y:520}},
 {id:'pack',art:'packing',x:338,y:576,w:128,h:106,footW:112,footH:27,stand:{x:251,y:590}},
 {id:'orders',art:'desk',x:96,y:665,w:128,h:98,footW:108,footH:26,stand:{x:180,y:678}},
 {id:'shelf',art:'cabinet',x:353,y:479,w:86,h:134,footW:70,footH:25,stand:{x:281,y:491}},
 {id:'ingredients',art:'ingredients',x:144,y:316,w:140,h:99,footW:0,footH:0,stand:{x:213,y:350}},
 {id:'book',art:'bookstand',x:332,y:735,w:104,h:80,footW:83,footH:20,stand:{x:255,y:753}}
]};
export function preloadAtelier(s){if(!s.textures.exists('candy-hd-room'))s.load.image('candy-hd-room',room);for(const name of Object.keys(atlas.frames))if(!s.textures.exists('candy-hd-'+name))s.load.image('candy-hd-'+name,candyArt(name))}
export function atelierSprite(s,p){const f=atlas.frames[p.art],image=s.add.image(p.x,p.y,'candy-hd-'+p.art).setOrigin(.5,1).setScale(Math.min(p.w/f.width,p.h/f.height)).setDepth(20+p.y*.01);image.texture.setFilter(1);return image}
