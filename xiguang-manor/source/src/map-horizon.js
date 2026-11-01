import {V5Mountains} from './v5-landscape.js';
import {mix,skyPalette} from './sky-model.js';
import {Starlight,paintMilkyWay,drawJewel} from './starlight.js';

// A complete backdrop behind the transparent map foreground. Stars, the moon,
// ridge and tree line are composited in order on one canvas, without a sky cap.
export class MapHorizon{
  constructor(){
    this.canvas=document.createElement('canvas');this.canvas.width=432;this.canvas.height=190;
    this.view={baseHour:22};this.mountains=new V5Mountains(this.view,null,216,110);
    this.stars=new Starlight(216,90);this.dust=paintMilkyWay(216,90);
  }
  draw({hour,time=0,low=false,still=false}){
    const a=skyPalette(hour),c=this.canvas.getContext('2d');this.view.baseHour=hour;
    c.setTransform(2,0,0,2,0,0);c.imageSmoothingEnabled=false;c.globalAlpha=1;
    for(let y=0;y<95;y++){c.fillStyle=mix(a.top,a.bottom,Math.min(1,y/91));c.fillRect(0,y,216,1)}
    const t=still?0:time;
    if(a.night>.01){c.globalAlpha=a.night*.25;c.drawImage(this.dust,0,0,216,90);this.stars.draw(c,{time:t,night:a.night,reveal:1,reduced:low});drawJewel(c,103,17,{alpha:a.night*.55,time:t,phase:1,color:'#d2c3df'});c.globalAlpha=a.night;c.fillStyle='#f6d8ac';for(let y=-9;y<=9;y++)for(let x=-9;x<=9;x++)if(x*x+y*y<=81&&(x-4)**2+(y+3)**2>64)c.fillRect(170+x,25+y,1,1);c.globalAlpha=1}
    if(a.day>.35){const x=150+(hour-9)*2,y=43-Math.sin((hour-5)/14*Math.PI)*22;c.globalAlpha=a.day;c.fillStyle='#ffe4b5';c.beginPath();c.arc(Math.round(x),Math.round(y),7,0,Math.PI*2);c.fill();c.globalAlpha=1}
    this.mountains.draw(c,a);
    c.fillStyle=mix(a.near,a.bottom,.12);c.beginPath();c.moveTo(0,77);c.bezierCurveTo(60,70,127,84,216,75);c.lineTo(216,96);c.lineTo(0,96);c.fill();
    this.mountains.drawForest(c,a);
    // Fog stays close to the foothills, with no opaque strip through the peaks.
    c.globalAlpha=.08;c.fillStyle=a.bottom;for(let i=0;i<3;i++){c.beginPath();c.ellipse(i*91-13,78+i%2*2,67,2,0,0,Math.PI*2);c.fill()}c.globalAlpha=1;
    return this.canvas;
  }
  destroy(){this.mountains.clear();this.canvas.width=this.canvas.height=1}
}
