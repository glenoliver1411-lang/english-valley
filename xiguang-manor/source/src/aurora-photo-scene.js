import Phaser from 'phaser';
import photo from './assets/aurora-original/scene.webp';
import stars from './assets/aurora-original/stars.webp';
import meta from './assets/aurora-original/atlas.json';
import {auroraPhotoLayout,flowingLight} from './aurora-photo-layout.js';
const masks=import.meta.glob('./assets/aurora-original/light-*.webp',{eager:true,query:'?url',import:'default'});
const flowerFiles=import.meta.glob('./assets/aurora-original/flower-*.webp',{eager:true,query:'?url',import:'default'});
export class AuroraPhotoScene extends Phaser.Scene{
 constructor(profile,api){super('flower-aurora');this.profile=profile;this.api=api;this.elapsed=0;this.low=profile.scenery.lowEffects;this.slow=0;this.accumulator=0}
 preload(){this.load.image('aurora-original',photo);this.load.spritesheet('aurora-native-stars',stars,{frameWidth:12,frameHeight:12});for(const m of meta.lights)this.load.image('aurora-'+m.key,masks['./assets/aurora-original/'+m.file]);for(const f of meta.flowers){this.load.image('aurora-'+f.key,flowerFiles['./assets/aurora-original/'+f.file]);this.load.image('aurora-'+f.cleanKey,flowerFiles['./assets/aurora-original/'+f.cleanFile])}this.load.on('loaderror',()=>this.api.failed())}
 create(){
  const keys=['aurora-original','aurora-native-stars',...meta.lights.map(m=>'aurora-'+m.key),...meta.flowers.flatMap(f=>['aurora-'+f.key,'aurora-'+f.cleanKey])];if(!keys.every(k=>this.textures.exists(k))){this.api.failed();return}
  // Native 720×1280 pixels go straight to Phaser; no 432px scenery canvas.
  this.art=this.add.container(0,0);this.base=this.add.image(0,0,'aurora-original').setOrigin(0);this.art.add(this.base);
  this.lightNodes=meta.lights.map(m=>{const image=this.add.image(m.x,m.y,'aurora-'+m.key).setOrigin(0).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0);this.art.add(image);return {m,image}});
  this.starNodes=meta.stars.map((m,i)=>{const image=this.add.image(m.x,m.y,'aurora-native-stars',m.frame).setOrigin(0).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0);this.art.add(image);return {m,image,phase:i*1.719}});
  this.flowerNodes=meta.flowers.map(m=>{const clean=this.add.image(m.x,m.y,'aurora-'+m.cleanKey).setOrigin(0).setVisible(false),image=this.add.image(m.x+m.anchorX,m.y+m.anchorY,'aurora-'+m.key).setOrigin(m.anchorX/m.w,m.anchorY/m.h);this.art.add([clean,image]);return{m,image,clean}});
  this.resize();this.scale.on('resize',this.resize,this);this.events.once('shutdown',()=>{this.scale.off('resize',this.resize,this);this.lightNodes=this.starNodes=this.flowerNodes=[]});this.frame();this.api.ready(this);
 }
 resize(){this.layout=auroraPhotoLayout(this.scale.gameSize.width,this.scale.gameSize.height,720,1280,this.complete);this.art.setPosition(this.layout.x,this.layout.y).setScale(this.layout.scale);this.frame()}
 update(_,delta){if(document.hidden||this.api.dialogOpen())return;const dt=Math.min(delta,100)/1000;if(!this.api.paused())this.elapsed+=dt;if(delta>45)this.slow++;else this.slow=Math.max(0,this.slow-.2);if(this.slow>100)this.low=true;this.accumulator+=dt;if(this.accumulator>=1/(this.low?8:18)){this.accumulator=0;this.frame()}}
 frame(){if(!this.base)return;const moving=!this.api.paused(),t=this.elapsed;
  for(const [i,n]of this.lightNodes.entries())n.image.setAlpha(moving?flowingLight(t,i):0);
  for(const [i,n]of this.starNodes.entries())n.image.setAlpha(moving?Math.min(1,t/3)*(.04+.18*(.5+.5*Math.sin(t*(.18+i*.013)+n.phase))**4):0);
  for(const [i,n]of this.flowerNodes.entries()){n.clean.setVisible(moving);n.image.setVisible(moving);n.image.rotation=moving?Math.sin(t*(.29+i*.043)+i*2.1)*.004*Math.min(1,t/3):0}
 }
 photo(){
  // Export the original resolution, without UI or artificial upscaling.
  const out=document.createElement('canvas');out.width=meta.width;out.height=meta.height;const c=out.getContext('2d');c.drawImage(this.textures.get('aurora-original').getSourceImage(),0,0);
  for(const n of [...this.lightNodes,...this.starNodes]){const p=n.image.frame;c.globalCompositeOperation='lighter';c.globalAlpha=n.image.alpha;c.drawImage(n.image.texture.getSourceImage(),p.cutX,p.cutY,p.cutWidth,p.cutHeight,n.m.x,n.m.y,p.cutWidth,p.cutHeight)}
  c.globalCompositeOperation='source-over';c.globalAlpha=1;
  for(const n of this.flowerNodes)if(n.clean.visible){const m=n.m;c.drawImage(n.clean.texture.getSourceImage(),m.x,m.y);c.save();c.translate(m.x+m.anchorX,m.y+m.anchorY);c.rotate(n.image.rotation);c.drawImage(n.image.texture.getSourceImage(),-m.anchorX,-m.anchorY);c.restore()}
  return out;
 }
}
