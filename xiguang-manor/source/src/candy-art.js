import {candyArt} from './candy-atelier.js';
import {products} from './candy-config.js';
const valid=id=>products.some(p=>p.id===id)?id:products[0].id;
const images=new Map();
function bitmap(name){if(!images.has(name)){const image=new Image();image.src=candyArt(name);images.set(name,image)}return images.get(name)}
function place(c,name,x,y,w,h){const i=bitmap(name);if(!i.complete||!i.naturalWidth)return;const s=Math.min(w/i.naturalWidth,h/i.naturalHeight);c.drawImage(i,x+(w-i.naturalWidth*s)/2,y+(h-i.naturalHeight*s)/2,i.naturalWidth*s,i.naturalHeight*s)}
export function candyImage(id){return candyArt(valid(id))}
export function giftImage(items,wrap='rose',open=false){return candyArt('box-'+(open?'open':'closed')+(['violet','cream'].includes(wrap)?'-'+wrap:''))}
export function drawCandy(c,id,x,y,size=32){place(c,valid(id),x,y,size,size)}
export function paintMix(c,{time=0,stirs=0}){c.clearRect(0,0,c.canvas.width,c.canvas.height);c.save();c.setTransform(c.canvas.width/432,0,0,c.canvas.height/280,0,0);c.imageSmoothingEnabled=false;const phase=time*.7+stirs*.55;c.save();c.translate(216,131);c.rotate(Math.sin(phase)*.025);place(c,'bowl',-126,-122,252,226);c.restore();c.fillStyle='#79536b';c.font='13px sans-serif';c.textAlign='center';c.fillText(stirs>=8?'糖浆拌好了，可以送进烤炉。':'沿着碗边慢慢搅拌。',216,263);c.restore()}
export function paintOven(c,{needle=.5,target=.5,round=0,flash=0}){c.clearRect(0,0,c.canvas.width,c.canvas.height);c.save();c.setTransform(c.canvas.width/432,0,0,c.canvas.height/280,0,0);c.imageSmoothingEnabled=false;place(c,'oven',125,0,182,220);c.fillStyle='#937786';c.fillRect(49,238,329,7);c.fillStyle=flash?'#d9c18a':'#88ad98';c.fillRect(49+(target-.15)*329,234,329*.30,15);const nx=49+needle*329;c.fillStyle='#604354';c.fillRect(nx-2,227,4,26);c.fillStyle='#fff0ce';c.fillRect(nx-1,228,2,23);c.font='12px sans-serif';c.textAlign='center';c.fillStyle='#79536b';c.fillText(`第 ${Math.min(3,round+1)} 次收火 · 在绿色范围内轻点`,216,274);c.restore()}
