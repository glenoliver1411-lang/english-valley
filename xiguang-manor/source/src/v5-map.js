import {v5Blit,v5Frame} from './v5-assets.js';
const lawn={night:['#304b4e','#365853','#3c5c56'],dawn:['#91a88d','#9bb497','#a6ba9b'],day:['#7f9e7d','#8fae88','#a1bc94'],dusk:['#61796e','#6e8274','#839080']};
export function paintV5Map(scene,period='night'){
 const out=document.createElement('canvas');out.width=432;out.height=850;const c=out.getContext('2d');c.imageSmoothingEnabled=false;const colors=lawn[period];c.fillStyle=colors[0];c.beginPath();c.moveTo(0,177);c.bezierCurveTo(129,166,297,186,432,169);c.lineTo(432,850);c.lineTo(0,850);c.fill();
 for(let i=0;i<10;i++){const y=185+i*71;c.fillStyle=colors[1+i%2];c.beginPath();c.moveTo(0,y);c.bezierCurveTo(138,y-31,291,y+31,432,y-16);c.lineTo(432,y+26);c.bezierCurveTo(253,y+54,124,y-6,0,y+38);c.fill()}
 // Sky and distant mountains now live behind this transparent foreground.

 const road=[[194,850],[240,850],[240,643],[288,580],[288,486],[241,432],[241,290],[269,255],[248,211],[211,214],[198,270],[198,447],[242,497],[242,567],[194,632]];c.save();c.beginPath();road.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.rect(105,417,111,26);c.rect(270,486,70,26);c.rect(86,585,163,24);c.clip();const stone=v5Frame('tile-stone',{period});for(let y=210;y<850;y+=32)for(let x=80;x<350;x+=64)c.drawImage(stone,x,y);c.restore();
 v5Blit(c,'map-pond',294,222,{period});v5Blit(c,'map-shop',31,261,{period});
 for(const item of scene.worldObjects||[]){if(item.kind==='fence'){const b=item.bounds;c.save();c.beginPath();c.rect(b.x,b.y-3,b.w,38);c.clip();for(let x=b.x;x<b.x+b.w;x+=64)v5Blit(c,'map-fence',x,b.y-2,{period});c.restore()}if(item.kind==='lamp')v5Blit(c,'map-lamp',item.x-12,item.y-28,{period});if(item.kind==='pumpkin')v5Blit(c,'map-pumpkin',item.x-14,item.y-16,{period})}
 for(let row=0;row<2;row++)for(let col=0;col<2;col++)v5Blit(c,'map-soil-bed',36+col*49,547+row*43,{period});
 v5Blit(c,'room-rug',314,428,{period,width:73,height:55});v5Blit(c,'furniture-catBed',309,451,{period,width:27,height:16});
 for(const item of scene.worldObjects||[]){if(item.kind!=='flower')continue;const n=Math.abs(Math.round(item.x+item.y))%6,name=['low-pink','low-blue','daisy','rose','bell','lily'][n],im=v5Frame('flower-'+name,{period}),width=10+n%3*3;c.drawImage(im,item.x-width/2,item.y-im.height*width/im.width,width,im.height*width/im.width)}
 for(const item of scene.worldObjects||[]){if(item.kind!=='tree')continue;const special=item.special,name=item.x<230?'nature-oak':'nature-rowan',image=v5Frame(name,{period}),height=special?152:88,width=image.width*height/image.height,x=item.x-width/2,y=item.y+(special?50:28)-height;c.save();c.globalAlpha=.22;c.fillStyle=period==='night'?'#192e39':'#4c6357';c.beginPath();c.ellipse(item.x,item.y+(special?50:28),special?22:12,special?4:2.5,0,0,Math.PI*2);c.fill();c.globalAlpha=1;if(special){const temp=document.createElement('canvas');temp.width=image.width;temp.height=image.height;const t=temp.getContext('2d');t.drawImage(image,0,0);const data=t.getImageData(0,0,temp.width,temp.height),d=data.data;for(let i=0;i<d.length;i+=4){if(d[i+1]>d[i]*1.08){const value=d[i+1]/255;d[i]=Math.min(255,112+value*125);d[i+1]=Math.min(255,76+value*109);d[i+2]=Math.min(255,109+value*120)}}t.putImageData(data,0,0);c.drawImage(temp,x,y,width,height)}else c.drawImage(image,x,y,width,height);c.restore()}
 for(const [x,y]of [[176,731],[251,731]]){c.fillStyle=period==='night'?'#6a5b70':'#a08b8d';c.fillRect(x,y,12,49);c.fillStyle='#d2b395';c.fillRect(x-3,y-7,18,8)}
 return out;
}
export function refineV5Map(scene){const c=scene.textures.get('world').getSourceImage().getContext('2d');c.clearRect(0,0,432,850);c.drawImage(paintV5Map(scene),0,0);scene.textures.get('world').refresh();
 for(const[key,id]of [['pink','strawberry-moon'],['orange','pumpkin-star'],['purple','lavender-cat'],['magic','pumpkin-star']]){
  const icon=document.createElement('canvas');icon.width=24;icon.height=20;const g=icon.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(v5Frame('candy-'+id),0,-2,24,24);
  if(key==='magic'){g.fillStyle='#fff0bb';g.fillRect(3,2,1,4);g.fillRect(2,3,3,1);g.fillRect(21,15,1,3);g.fillRect(20,16,3,1)}
  if(scene.textures.exists(key))scene.textures.remove(key);scene.textures.addCanvas(key,icon);
 }
}
export const V5_MAP_GRASS=lawn.night;
