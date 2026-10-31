import {Starlight, paintMilkyWay, drawJewel} from './starlight.js';
import {mix, skyPalette} from './sky-model.js';

export const clamp01 = value => Math.max(0, Math.min(1, value));
export const ease = value => {const t = clamp01(value); return t * t * (3 - 2 * t)};

// Same two-pixel material grid as the manor. The flap rotates around its hinge;
// the letter slides out of the pocket behind the three front folds.
export function envelopeGeometry(height, progress = 0, time = 0, still = false) {
  const p = clamp01(progress), hinge = ease(p / .58) * Math.PI;
  return {x: 78, y: Math.round(height * .51 + (still ? 0 : Math.sin(time * .8) * 2)),
    w: 276, h: 170, flap: Math.cos(hinge) * 106,
    lift: ease((p - .25) / .75) * 102, seal: 1 - ease(p / .23)};
}

export function paintEnvelope(c, geometry) {
  const {x, y, w, h, flap, lift, seal} = geometry;
  const r = (a,b,ww,hh,color) => {c.fillStyle=color;c.fillRect(Math.round(a),Math.round(b),Math.round(ww),Math.round(hh))};
  const poly = (points,color) => {c.fillStyle=color;c.beginPath();points.forEach(([a,b],i)=>i?c.lineTo(Math.round(a),Math.round(b)):c.moveTo(Math.round(a),Math.round(b)));c.closePath();c.fill()};
  // Local, stepped shadow and a small warm rim; no whole-screen glow/filter.
  r(x+8,y+h+8,w-16,4,'#0a102453');r(x+20,y+h+12,w-40,2,'#0a102426');
  r(x-4,y-2,w+8,h+4,'#b49bad');r(x-2,y,w+4,h,'#e6c8b9');
  r(x,y+2,w,h-4,'#9e829e');r(x+4,y+6,w-8,h-12,'#665776');
  if(flap<0){poly([[x,y+2],[x+w,y+2],[x+w/2,y+flap]],'#c6b2c7');poly([[x+5,y],[x+w-5,y],[x+w/2,y+flap+6]],'#98849f')}
  // The lifting paper remains occluded by the envelope's front pocket.
  r(x+18,y+12-lift,w-36,h-24,'#bca9b0');r(x+20,y+10-lift,w-40,h-26,'#f4e6d1');
  r(x+26,y+16-lift,w-52,2,'#cfb7ad');r(x+26,y+16-lift,2,h-42,'#ddc8b8');
  for(let i=0;i<4;i++)r(x+46,y+39+i*12-lift,w-92-(i%2)*30,1,'#c6a8aa');
  poly([[x,y+2],[x+w/2,y+h*.61],[x,y+h]],'#bda5b9');
  poly([[x+w,y+2],[x+w/2,y+h*.61],[x+w,y+h]],'#a58da7');
  poly([[x,y+h],[x+w/2,y+62],[x+w,y+h]],'#d6b8c5');
  poly([[x+5,y+h-4],[x+w/2,y+68],[x+w-5,y+h-4]],'#c7a5b9');
  r(x+2,y+h-4,w-4,2,'#ebcdbf');
  if(flap>=0){poly([[x,y],[x+w,y],[x+w/2,y+flap]],'#ddc4cf');poly([[x+4,y+2],[x+w-4,y+2],[x+w/2,y+flap-4]],'#baa2bd')}
  // Tiny embossed corner stars and fine gold stitching.
  for(const [sx,sy]of [[x+17,y+140],[x+w-18,y+140]]){r(sx-4,sy,10,2,'#efd3b4');r(sx,sy-4,2,10,'#efd3b4');r(sx,sy,2,2,'#f7e8cd')}
  if(seal>0){c.globalAlpha=seal;const sx=x+w/2,sy=y+106;
    r(sx-16,sy-10,32,22,'#80536c');r(sx-12,sy-15,24,32,'#80536c');
    r(sx-14,sy-9,28,19,'#c18492');r(sx-10,sy-13,20,27,'#c18492');
    r(sx-10,sy-10,20,2,'#e4aca8');r(sx-13,sy-7,2,14,'#d69a9e');
    // A cream crescent stamped into the wax, drawn one pixel-row at a time.
    for(let dy=-8;dy<=8;dy+=2)for(let dx=-8;dx<=8;dx+=2)if(dx*dx+dy*dy<63&&(dx-4)**2+(dy+2)**2>46)r(sx+dx,sy+dy,2,2,'#f0d3b4');
    c.globalAlpha=1;
  }
}

export class GiftSky {
  constructor(width,height,{journey=false}={}) {
    this.w=width;this.h=height;this.journey=journey;
    this.stars=new Starlight(width/2,height/2*(journey?1.46:1));
    this.dust=paintMilkyWay(width/2,height/2);
    this.back=document.createElement('canvas');this.back.width=width;this.back.height=height;
    const c=this.back.getContext('2d'),end=journey?skyPalette(22).top:'#28283f';
    for(let y=0;y<height;y+=2){c.fillStyle=mix('#0c142b',end,y/height);c.fillRect(0,y,width,2)}
  }
  draw(c,time,{still=false,low=false,parallax=0}={}) {
    c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.imageSmoothingEnabled=false;
    c.drawImage(this.back,0,0);c.save();c.scale(2,2);
    c.globalAlpha=.15;c.drawImage(this.dust,0,0,this.w/2,this.h/2);
    this.stars.draw(c,{time:still?0:time,night:.83,reveal:1,parallax,reduced:low||still});
    drawJewel(c,this.w*.365,this.h*.13,{time:still?0:time,phase:1.4,alpha:.45,color:'#dfc3d2'});
    drawJewel(c,this.w*.12,this.h*.28,{time:still?0:time,phase:3.1,alpha:.38,color:'#c0d6ed'});
    c.restore();c.globalAlpha=1;
    if(!still){for(let i=0;i<3;i++){
      const x=((i*157+time*(.75+i*.16)+parallax*.07)%(this.w+160))-95,y=this.h*(.2+i*.22);
      c.fillStyle=['#9390b209','#a2a1c20b','#a899b309'][i];
      for(let k=0;k<4;k++)c.fillRect(Math.round(x+k*16),Math.round(y+Math.sin(k)*4),74-k*9,2+k%2*2);
    }}
  }
}
