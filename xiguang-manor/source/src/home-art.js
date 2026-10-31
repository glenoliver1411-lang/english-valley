import {paintFurniture} from './furniture-atelier.js';
import {painter} from './art.js';
import {pixelEllipse} from './scenery-art.js';
import {mix} from './sky-model.js';
import {HOME} from './home-config.js';
import {ROMANCE} from './romantic-config.js';
const icons=new Map();
export function furnitureCanvas(type,theme='rose',bouquet='rose',on=false){const f=HOME.items.find(f=>f.type===type),p=painter(f.w,f.h);paintFurniture(p,type,{theme,bouquet,on});return p.canvas}
export function furnitureIcon(type,theme='rose',bouquet='rose'){const key=[type,theme,bouquet].join('-');if(!icons.has(key))icons.set(key,furnitureCanvas(type,theme,bouquet,true).toDataURL());return icons.get(key)}
export function paintRoomSurfaces(p,room,day){
 const r=p.r;if(room.wallpaper==='floral'){r(26,29,380,238,'#bdaabf');for(let y=45;y<260;y+=29)for(let x=39;x<400;x+=31){r(x,y,1,13,'#a49aa8');r(x-4,y+5,4,2,'#d4c3c9');r(x+1,y+9,5,2,'#8f9f93');r(x-2,y-2,5,4,'#e9cad2');r(x,y-1,1,1,'#f4dfba')}}
 if(room.wallpaper==='gingham'){r(26,29,380,238,'#ead0c7');for(let y=30;y<265;y+=16)r(26,y,380,6,'#dcb8bc');for(let x=28;x<405;x+=16)r(x,30,5,235,'#ddb6bc');for(let y=30;y<265;y+=16)for(let x=28;x<405;x+=16)r(x,y,5,6,'#cda4b1')}
 if(room.floor!=='original'){const pale=room.floor==='pale';r(26,281,380,528,pale?'#c7b8b0':'#b69483');p.c.save();p.c.beginPath();p.c.rect(26,281,380,528);p.c.clip();for(let y=283;y<809;y+=18)for(let x=25;x<408;x+=36){if(pale){r(x+(y%36?18:0),y,34,16,(x+y)%4?'#d6c8ba':'#c5b8b2');r(x+3,y+3,24,1,'#e6d8c7')}else{p.poly([[x,y],[x+17,y+8],[x+17,y+23],[x,y+15]],'#d0ad91');p.poly([[x+18,y+8],[x+35,y],[x+35,y+15],[x+18,y+23]],'#bd9885');r(x+2,y+3,9,1,'#e0bea2')}}p.c.restore()}
}
