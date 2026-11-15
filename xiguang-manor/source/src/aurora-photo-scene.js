import {preloadCharacters,installCharacters,poseCharacter,characterPainting} from './character-art.js';
import {ensurePet,posePet} from './identity-phaser.js';
import benchFront from './assets/identity/aurora-bench-front.webp';
import Phaser from 'phaser';
import photo from './assets/identity/aurora-clean-scene.webp';
import night from './assets/identity/aurora-clean-night-scene.webp';
import {auroraSequence} from './aurora-sequence.js';
import stars from './assets/aurora-original/stars.webp';
import meta from './assets/aurora-original/atlas.json';
import {auroraPhotoLayout,flowingLight} from './aurora-photo-layout.js';
const masks=import.meta.glob('./assets/aurora-original/light-*.webp',{eager:true,query:'?url',import:'default'});
const flowerFiles=import.meta.glob('./assets/aurora-original/flower-*.webp',{eager:true,query:'?url',import:'default'});
export class AuroraPhotoScene extends Phaser.Scene{
 constructor(profile,api){super('flower-aurora');this.profile=profile;this.api=api;this.elapsed=0;this.lastFrameAt=null;this.skipSequence=false;this.phase='';this.low=profile.scenery.lowEffects;this.slow=0;this.accumulator=0}
 preload(){preloadCharacters(this);this.load.image('aurora-bench-front',benchFront);this.load.image('aurora-original',photo);this.load.image('aurora-night',night);this.load.spritesheet('aurora-native-stars',stars,{frameWidth:12,frameHeight:12});for(const m of meta.lights)this.load.image('aurora-'+m.key,masks['./assets/aurora-original/'+m.file]);for(const f of meta.flowers){this.load.image('aurora-'+f.key,flowerFiles['./assets/aurora-original/'+f.file]);this.load.image('aurora-'+f.cleanKey,flowerFiles['./assets/aurora-original/'+f.cleanFile])}this.load.on('loaderror',()=>this.api.failed())}
 create(){
  const keys=['aurora-original','aurora-night','aurora-native-stars',...meta.lights.map(m=>'aurora-'+m.key),...meta.flowers.flatMap(f=>['aurora-'+f.key,'aurora-'+f.cleanKey])];if(!keys.every(k=>this.textures.exists(k))){this.api.failed();return}
  installCharacters(this);
  // Native 720×1280 pixels go straight to Phaser; no 432px scenery canvas.
  this.art=this.add.container(0,0);this.night=this.add.image(0,0,'aurora-night').setOrigin(0);this.art.add(this.night);this.base=this.add.image(0,0,'aurora-original').setOrigin(0);this.art.add(this.base);
  this.lightNodes=meta.lights.map(m=>{const image=this.add.image(m.x,m.y,'aurora-'+m.key).setOrigin(0).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0);this.art.add(image);return {m,image}});
  this.starNodes=meta.stars.map((m,i)=>{const image=this.add.image(m.x,m.y,'aurora-native-stars',m.frame).setOrigin(0).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0);this.art.add(image);return {m,image,phase:i*1.719}});
  this.player=this.add.sprite(404,1000,'girl').setOrigin(.5,.85);poseCharacter(this,{facing:3,seated:true,scale:1.35});const painting=characterPainting(this.profile,{back:true,seated:true}),px=painting.getContext('2d').getImageData(0,0,64,80).data;let top=80;for(let y=0;y<80;y++)for(let x=0;x<64;x++)if(px[(y*64+x)*4+3]>60)top=Math.min(top,y);this.player.y=925+(68-top)*1.35;this.art.add(this.player);
  this.pet=this.profile.romance.catFollow||this.profile.play.equipment.companion==='catbell'?this.add.sprite(552,1044,ensurePet(this,this.profile),16):null;if(this.pet){posePet(this,this.pet,this.profile,{sleep:true,size:50});this.art.add(this.pet)}
  this.benchFront=this.add.image(0,0,'aurora-bench-front').setOrigin(0);this.art.add(this.benchFront);
  this.flowerNodes=meta.flowers.map(m=>{const clean=this.add.image(m.x,m.y,'aurora-'+m.cleanKey).setOrigin(0).setVisible(false),image=this.add.image(m.x+m.anchorX,m.y+m.anchorY,'aurora-'+m.key).setOrigin(m.anchorX/m.w,m.anchorY/m.h);this.art.add([clean,image]);return{m,image,clean}});
  this.resetClock=()=>{this.lastFrameAt=null};this.lastFrameAt=performance.now();document.addEventListener('visibilitychange',this.resetClock);this.game.events.on('resume',this.resetClock);
  this.resize();this.scale.on('resize',this.resize,this);this.events.once('shutdown',()=>{document.removeEventListener('visibilitychange',this.resetClock);this.game.events.off('resume',this.resetClock);this.scale.off('resize',this.resize,this);this.lightNodes=this.starNodes=this.flowerNodes=[]});this.frame();this.api.ready(this);
 }
 resize(){this.layout=auroraPhotoLayout(this.scale.gameSize.width,this.scale.gameSize.height,720,1280,this.complete);this.art.setPosition(this.layout.x,this.layout.y).setScale(this.layout.scale);this.frame()}
 update(_,delta){const now=performance.now(),dt=this.lastFrameAt===null?0:Math.max(0,(now-this.lastFrameAt)/1000);this.lastFrameAt=now;if(document.hidden||this.api.dialogOpen())return;if(!this.api.paused())this.elapsed+=dt;if(delta>45)this.slow++;else this.slow=Math.max(0,this.slow-.2);if(this.slow>100)this.low=true;this.accumulator+=dt;if(this.accumulator>=1/(this.low?8:18)){this.accumulator=0;this.frame()}}
 replay(){this.elapsed=0;this.lastFrameAt=performance.now();this.skipSequence=false;this.frame()}
 skip(){this.skipSequence=true;this.frame()}
 frame(){if(!this.base)return;const moving=!this.api.paused(),t=this.elapsed,p=auroraSequence(t,{still:!moving,skip:this.skipSequence});this.performance=p;this.base.setAlpha(p.reveal);if(this.phase!==p.phase){this.phase=p.phase;this.api.sequence?.(p)}
  for(const [i,n]of this.lightNodes.entries())n.image.setAlpha(moving?flowingLight(t,i)*p.reveal:0);
  for(const [i,n]of this.starNodes.entries())n.image.setAlpha(moving?Math.min(1,t/3)*(.04+.18*(.5+.5*Math.sin(t*(.18+i*.013)+n.phase))**4):0);
  for(const [i,n]of this.flowerNodes.entries()){n.clean.setVisible(moving);n.image.setVisible(moving);n.image.rotation=moving?Math.sin(t*(.29+i*.043)+i*2.1)*.004*Math.min(1,t/3):0}
 }
 photo(){
  // Export the original resolution, without UI or artificial upscaling.
  const out=document.createElement('canvas');out.width=meta.width;out.height=meta.height;const c=out.getContext('2d');c.drawImage(this.textures.get('aurora-night').getSourceImage(),0,0);c.globalAlpha=this.base.alpha;c.drawImage(this.textures.get('aurora-original').getSourceImage(),0,0);c.globalAlpha=1;
  for(const n of [...this.lightNodes,...this.starNodes]){const p=n.image.frame;c.globalCompositeOperation='lighter';c.globalAlpha=n.image.alpha;c.drawImage(n.image.texture.getSourceImage(),p.cutX,p.cutY,p.cutWidth,p.cutHeight,n.m.x,n.m.y,p.cutWidth,p.cutHeight)}
  c.globalCompositeOperation='source-over';c.globalAlpha=1;
  for(const actor of [this.player,this.pet])if(actor){const f=actor.frame,scale=actor.scaleX;c.drawImage(actor.texture.getSourceImage(),f.cutX,f.cutY,f.cutWidth,f.cutHeight,actor.x-actor.originX*f.cutWidth*scale,actor.y-actor.originY*f.cutHeight*scale,f.cutWidth*scale,f.cutHeight*scale)}c.drawImage(this.textures.get('aurora-bench-front').getSourceImage(),0,0);
  for(const n of this.flowerNodes)if(n.clean.visible){const m=n.m;c.drawImage(n.clean.texture.getSourceImage(),m.x,m.y);c.save();c.translate(m.x+m.anchorX,m.y+m.anchorY);c.rotate(n.image.rotation);c.drawImage(n.image.texture.getSourceImage(),-m.anchorX,-m.anchorY);c.restore()}
  return out;
 }
}
