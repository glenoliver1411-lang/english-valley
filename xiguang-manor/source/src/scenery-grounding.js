import {mix,skyPalette} from './sky-model.js';

export function landscapeWeights(scene,a){
  const hour=((scene.baseHour%24)+24)%24;
  if(scene.mode!=='dawn'&&hour>=16&&hour<18)return [['day',1],['dusk',(hour-16)/2]];
  if(scene.mode!=='dawn'&&hour>=18&&hour<20)return [['dusk',1],['night',(hour-18)/2]];
  return [['night',1],['dawn',Math.min(1,a.day*1.5)],['day',Math.max(0,(a.day-.78)/.22)]];
}

// Haze colors only existing rock/forest pixels. It must never fill the empty
// pixels around a ridge with a rectangular strip of a second sky color.
export function bindToSky(canvas,period,{far=false,forest=false}={}){
  const c=canvas.getContext('2d'),a=skyPalette(period==='night'?22:period==='dawn'?6.8:period==='dusk'?18:12);
  c.save();c.globalCompositeOperation='source-atop';
  for(let y=0;y<canvas.height;y++){
    const q=y/canvas.height;
    c.fillStyle=mix(a.top,a.bottom,.61+q*.35);
    c.globalAlpha=(forest?.10:far?.35:.18)+q*q*(forest?.12:.19);
    c.fillRect(0,y,canvas.width,1);
  }c.restore();return canvas;
}

export function treeSlices(image,{left,top,width,height,groundY}){
  const split=Math.round(image.height*.77),scale=height/image.height;
  const crownBottom=top+split*scale,rootTop=groundY-(image.height-split)*scale;
  return {left,top,width,height,split,crownBottom,rootTop,groundY,extension:Math.max(0,rootTop-crownBottom)};
}
export function drawGroundedTree(c,image,options){
  const p=treeSlices(image,options),day=options.period==='day'||options.period==='dawn';
  // The canopy keeps its existing framing; only the exposed trunk is extended.
  const pixels=image.getContext('2d').getImageData(0,image.height-5,image.width,5).data;
  let sum=0,count=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i+3]>100){sum+=(i/4)%image.width;count++}
  const rootX=p.left+(count?sum/count:image.width/2)*p.width/image.width;
  c.save();c.globalAlpha=day?.20:.28;c.fillStyle=day?'#435854':'#182e3c';c.beginPath();c.ellipse(rootX,p.groundY,p.width*.20,2.2,0,0,Math.PI*2);c.fill();c.restore();
  c.drawImage(image,0,0,image.width,p.split,p.left,p.top,p.width,p.crownBottom-p.top);
  if(p.extension>0)c.drawImage(image,0,p.split-3,image.width,3,p.left,p.crownBottom,p.width,p.extension);
  c.drawImage(image,0,p.split,image.width,image.height-p.split,p.left,p.rootTop,p.width,p.groundY-p.rootTop);
  c.fillStyle=day?'#7c997a':'#526d61';
  for(const [dx,dy]of [[-6,0],[7,1],[-3,2]]){c.fillRect(Math.round(rootX+dx),Math.round(p.groundY+dy),.5,2);c.fillRect(Math.round(rootX+dx-1),Math.round(p.groundY+dy),1,.5)}
  return {...p,rootX};
}
