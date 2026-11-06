import {playFrame} from './play-assets.js';
import {EXPLORE as C} from './play-config.js';
// A floor is composed once on entry, never regenerated in the frame loop.
export function paintExpedition(layout,room){
 const out=document.createElement('canvas');out.width=432;out.height=C.height;
 const c=out.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#223644';c.fillRect(0,0,432,C.height);
 for(let y=128,row=0;y<C.height-35;y+=64,row++)for(let x=24-(row%2)*32,col=0;x<408;x+=64,col++){
  const index=(row*7+col*5+room*3+(row%3)*col)%12;c.drawImage(playFrame('ruins-floor-'+index),x,y);
 }
 for(const p of layout.chests)c.drawImage(playFrame('ruins-light-amber'),p.x-72,p.y-45);c.drawImage(playFrame('ruins-light-cyan'),layout.puzzle.x-72,layout.puzzle.y-55);
 // Architectural side plinths give a vertical plane to the corridor.
 for(const x of [18,399]){c.fillStyle='#273e4d';c.fillRect(x,130,15,C.height-160);c.fillStyle='#70818b';c.fillRect(x+2,130,3,C.height-160);c.fillStyle='#a1a9a6';c.fillRect(x+3,130,1,C.height-160)}
 for(let y=235;y<C.height-150;y+=420){c.drawImage(playFrame('ruins-pillar'),6,y);c.drawImage(playFrame('ruins-pillar'),389,y+110)}

 for(const [x,y]of [[35,Math.round(C.height*.85)],[357,Math.round(C.height*.49)]])c.drawImage(playFrame('ruins-statue'),x,y-87);
 for(const [x,y]of [[128,Math.round(C.height*.64)],[267,Math.round(C.height*.9)],[119,394]])c.drawImage(playFrame('ruins-puddle'),x,y);
 // Narrow cool recesses and shallow contact shadows, not a scene-wide tint.
 for(let i=0;i<4;i++){c.fillStyle=`rgba(16,31,43,${.045+i*.018})`;c.fillRect(29+i*5,140,5,C.height-184);c.fillRect(382-i*5,140,5,C.height-184)}
 c.drawImage(playFrame('ruins-stairs'),layout.exit.x-45,layout.exit.y-20);c.drawImage(playFrame('ruins-mechanism'),layout.puzzle.x-38,layout.puzzle.y-68);c.drawImage(playFrame('ruins-portal'),layout.portal.x-42,layout.portal.y-100);
 return out;
}
export function paintExpeditionWall(wall,room){
 const out=document.createElement('canvas');out.width=432;out.height=104;const c=out.getContext('2d');c.imageSmoothingEnabled=false;
 for(const [a,b]of [[25,wall.gap-32],[wall.gap+32,407]]){
  c.save();c.beginPath();c.rect(a,24,b-a,80);c.clip();for(let x=a,i=0;x<b;x+=84,i++)c.drawImage(playFrame('ruins-wall-'+(i+room)%3),x,24);if(b-a>150)c.drawImage(playFrame('ruins-mural'),a+Math.round((b-a)/2)-33,40,66,44);c.restore();
 }
 c.drawImage(playFrame('ruins-pillar'),wall.gap-60,0,32,98);c.drawImage(playFrame('ruins-pillar'),wall.gap+28,0,32,98);return out;
}
