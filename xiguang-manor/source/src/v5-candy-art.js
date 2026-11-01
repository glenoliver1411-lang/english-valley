import {v5Frame,v5Icon} from './v5-assets.js';
import {CANDY,products} from './candy-config.js';
import {mix,rgb} from './sky-model.js';
const valid=id=>products.some(p=>p.id===id)?id:products[0].id;
export function drawCandy(c,id,x,y,size=32){c.save();c.imageSmoothingEnabled=false;c.drawImage(v5Frame('candy-'+valid(id)),Math.round(x),Math.round(y),size,size);c.restore()}
export function candyImage(id){return v5Icon('candy-'+valid(id))}
export function giftImage(items,wrap='rose',open=false){
 const original=v5Frame(open?'gift-box-open':'gift-box-closed'),out=document.createElement('canvas');out.width=256;out.height=182;const c=out.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(original,0,0);
 const color=CANDY.wraps.find(w=>w.id===wrap)?.color||'#dba4b8';if(wrap!=='rose'){const image=c.getImageData(0,0,256,182),d=image.data;for(let i=0;i<d.length;i+=4){if(d[i]>d[i+1]*1.10&&d[i+2]>d[i+1]*1.03&&d[i+3]){const light=(d[i]*.3+d[i+1]*.58+d[i+2]*.12)/255,col=rgb(light>.70?mix(color,'#fff0d4',(light-.7)*1.7):mix('#68506d',color,Math.max(0,(light-.2)/.5)));d[i]=col[0];d[i+1]=col[1];d[i+2]=col[2]}}c.putImageData(image,0,0)}
 if(open)for(let i=0;i<3;i++)if(items[i])drawCandy(c,items[i],39+i*63,80,52);
 return out.toDataURL();
}
export function paintMix(c,{time=0,stirs=0,color='#e7a5bd'}){
 c.save();c.setTransform(c.canvas.width/432,0,0,c.canvas.height/280,0,0);c.imageSmoothingEnabled=false;c.drawImage(v5Frame('stage-mix'),0,0);
 const ellipse=(x,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()};ellipse(216,107,117,29,mix(color,'#f6e5ce',.28));ellipse(218,105,108,24,mix(color,'#ffedcf',.43));
 c.lineWidth=2;for(let j=0;j<3;j++){c.strokeStyle=j%2?mix(color,'#866479',.24):'#f6dfca';c.beginPath();for(let k=0;k<65;k++){const a=k*.15+time*.52+stirs*.31,rad=k*.95-j*8,x=216+Math.cos(a)*rad,y=107+Math.sin(a)*rad*.23;k?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}
 const angle=time*.65+stirs*.37,x=216+Math.cos(angle)*45,y=107+Math.sin(angle)*11;c.lineCap='round';c.lineWidth=8;c.strokeStyle='#8e6672';c.beginPath();c.moveTo(x,y);c.lineTo(x+30,y-76);c.stroke();c.lineWidth=3;c.strokeStyle='#deb78d';c.beginPath();c.moveTo(x+1,y-3);c.lineTo(x+32,y-77);c.stroke();ellipse(x,y,11,6,'#f4d9bc');ellipse(x+1,y-1,7,3,'#e6b5b8');
 for(let i=0;i<8;i++){c.fillStyle=i<stirs?'#e9c0ba':'#bfa3aa';c.fillRect(75+i*36,249,24,7);c.fillStyle=i<stirs?'#fff0cc':'#9c818f';c.fillRect(76+i*36,249,23,1)}c.restore();
}
export function paintOven(c,{time=0,needle=.5,target=.5,round=0,hits=0,product='strawberry-moon',flash=0}){
 c.save();c.setTransform(c.canvas.width/432,0,0,c.canvas.height/280,0,0);c.imageSmoothingEnabled=false;c.drawImage(v5Frame('stage-oven'),0,0);
 c.globalAlpha=.07+.025*Math.sin(time*2.1);c.fillStyle='#ffd69a';c.fillRect(127,74,175,62);c.globalAlpha=1;for(let i=0;i<3;i++)drawCandy(c,product,133+i*55,78,58);
 c.fillStyle=flash?'#d9d2a4':'#9ab8a6';c.fillRect(49+(target-.15)*329,235,329*.30,12);c.fillStyle='#e6cbb0';for(let i=0;i<13;i++)c.fillRect(49+i*27,248,1,i%3?4:7);
 const nx=49+needle*329;c.fillStyle='#78586d';c.fillRect(nx-2,227,5,27);c.fillStyle='#fff0c5';c.fillRect(nx-1,227,3,25);c.fillRect(nx-4,226,9,2);
 for(let i=0;i<3;i++){c.fillStyle=i<round?'#e7cb9d':'#927c8e';c.beginPath();c.arc(129+i*88,172,4,0,Math.PI*2);c.fill()}c.restore();
}
