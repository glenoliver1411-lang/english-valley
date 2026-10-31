import {GiftSky, ease} from './gift-art.js';
import {GIFT} from './gift-config.js';

// A camera move through an extended sky into the REAL manor, not a second map.
// All temporary objects, bounds, labels, light/time overrides are restored once.
export class ManorAwakening {
  constructor(scene,{reduced=false,done=()=>{}}={}) {
    this.scene=scene;this.done=done;this.reduced=reduced;this.elapsed=0;this.finished=false;
    this.duration=reduced?GIFT.timing.reducedAwakening:GIFT.timing.awakening;
    const camera=scene.cameras.main;
    this.saved={scrollX:camera.scrollX,scrollY:camera.scrollY,zoom:camera.zoom};
    this.labels=[...scene.labels,scene.environment.label].map(label=>({label,visible:label.visible}));
    this.labels.forEach(({label})=>label.setVisible(false));
    scene.giftOpening=true;scene.giftLight=0;scene.player.stop();scene.target=null;
    camera.stopFollow();
    this.h=scene.scale.height;this.startY=-this.h*.83;
    this.endY=Math.max(0,Math.min(850-this.h,scene.player.y-this.h/2-50));
    camera.setBounds(0,-this.h,432,850+this.h);
    camera.setScroll(0,reduced?this.endY:this.startY);
    this.skyCanvas=document.createElement('canvas');this.skyCanvas.width=432;this.skyCanvas.height=this.h;
    this.skyPainter=new GiftSky(432,this.h,{journey:true});
    scene.textures.addCanvas('gift-journey-sky',this.skyCanvas);
    this.sky=scene.add.image(0,-this.h,'gift-journey-sky').setOrigin(0).setDepth(-10);
    this.lights=scene.add.graphics().setDepth(25);
    this.front=scene.add.graphics().setDepth(31);
    scene.tweens.killTweensOf(scene.gates);
    scene.gates.forEach((gate,i)=>gate.setPosition(i?235:207,754).setScale(1,1));
    this.onUpdate=(_time,delta)=>this.update(delta);
    scene.events.on('update',this.onUpdate);
    this.onResize=()=>this.finish();scene.scale.on('resize',this.onResize);
    this.update(0);
  }
  update(delta) {
    if(this.finished||document.hidden)return;
    this.elapsed+=Math.min(delta,80)/1000;
    const t=this.elapsed,camera=this.scene.cameras.main;
    const move=this.reduced?1:ease((t-.55)/(this.duration-1.1));
    camera.setScroll(0,this.startY+(this.endY-this.startY)*move);
    this.scene.giftLight=this.reduced?1:ease((t-2.6)/3.1);
    const gate=ease(this.reduced?1:(t-5.4)/2);
    this.scene.gates.forEach((g,i)=>{g.x=(i?235:207)+(i?20:-20)*gate;g.scaleX=1-.75*gate});
    const tick=Math.floor(t*(this.scene.dataSave.scenery.lowEffects?15:30));
    if(tick!==this.tick){this.tick=tick;this.frame()}
    if(t>=this.duration)this.finish();
  }
  frame() {
    const s=this.scene,t=this.elapsed,g=this.lights,front=this.front;
    this.skyPainter.draw(this.skyCanvas.getContext('2d'),t,{still:this.reduced,low:s.dataSave.scenery.lowEffects,parallax:-s.cameras.main.scrollY*.035});
    s.textures.get('gift-journey-sky').refresh();g.clear();front.clear();
    const fill=(x,y,w,h,color,alpha)=>{if(alpha<=0)return;g.fillStyle(color,alpha);g.fillRect(Math.round(x),Math.round(y),w,h)};
    // Cover only the existing illuminated panes. Never darken the entire scene.
    for(const [index,x]of [64,142].entries()){
      const light=this.reduced?1:ease((t-3.1-index*.45)/1.05);
      fill(x,354,19,24,0x706980,1-light);
      fill(x+8,354,3,24,0xbd8f8b,1-light);fill(x,365,19,3,0xbd8f8b,1-light);
      for(let k=0;k<3;k++){g.fillStyle(0xffd59e,light*(.018-k*.004));g.fillEllipse(x+9,368,39+k*18,49+k*15)}
    }
    const lamps=(s.worldObjects||[]).filter(item=>item.kind==='lamp'||item.kind==='pumpkin');
    for(let i=0;i<lamps.length;i++){
      const item=lamps[i],light=this.reduced?1:ease((t-(2.5+item.y/205+i%3*.13))/.8),dark=1-light;
      if(item.kind==='lamp')fill(item.x-4,item.y-11,8,11,0x706277,dark);
      else {const size=item.bounds.w/17,x=item.bounds.x,y=item.bounds.y+4*size;
        fill(x+3*size,y+5*size,3*size,3*size,0x98595d,dark);
        fill(x+10*size,y+5*size,3*size,3*size,0x98595d,dark);
        fill(x+5*size,y+11*size,6*size,2*size,0x98595d,dark);
      }
      g.fillStyle(0xffd69d,light*.025);g.fillEllipse(item.x,item.y+(item.kind==='lamp'?-7:0),38,30);
    }
    if(!this.reduced){
      const count=s.dataSave.scenery.lowEffects?4:9;
      for(let i=0;i<count;i++){
        const age=(t*.065+i*.137)%1,x=(i*71+Math.sin(t*.32+i)*12+age*38)%432,y=185+i*67%560+age*28;
        const a=Math.sin(age*Math.PI)*.6*ease((t-3)/2)*(1-ease((t-8)/1.2));
        front.fillStyle(i%3?0xddb4c9:0xd6cbad,a);
        front.fillRect(Math.round(x),Math.round(y),i%2?3:2,1);front.fillRect(Math.round(x+1),Math.round(y-1),2,1);
      }
    }
  }
  finish() {
    if(this.finished)return;this.finished=true;
    const s=this.scene,c=s.cameras.main;
    s.events.off('update',this.onUpdate);s.scale.off('resize',this.onResize);
    this.sky.destroy();this.lights.destroy();this.front.destroy();s.textures.remove('gift-journey-sky');
    s.giftOpening=false;delete s.giftLight;
    this.labels.forEach(({label,visible})=>label.setVisible(visible));
    c.setZoom(this.saved.zoom).setBounds(0,0,432,850);
    // Both normal completion and skip use exactly the same final state.
    c.setScroll(this.saved.scrollX,this.endY);
    c.startFollow(s.player,true,.08,.08,0,50);
    s.gates.forEach((gate,i)=>gate.setPosition(i?255:187,754).setScale(.25,1));
    s.environment.lastFrame=-1;s.environment.update(0);
    this.skyPainter=null;this.skyCanvas=null;
    this.done();
  }
}
