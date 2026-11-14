import {meteorPosition} from './meteors.js';
import {METEORS as C} from './meteor-config.js';
const sources=import.meta.glob('./assets/meteor-light/*.webp',{eager:true,query:'?url',import:'default'});
const clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp(v);return v*v*(3-2*v)};
export function preloadMeteorLights(scene){for(const [file,url]of Object.entries(sources)){const key='meteor-'+file.split('/').at(-1).replace('.webp','');if(!scene.textures.exists(key))scene.load.image(key,url)}}
// Fixed pools of native transparent paintings. No texture is drawn or allocated per frame.
export class MeteorLightLayer{
 constructor(scene,system){this.scene=scene;this.system=system;const image=()=>scene.add.image(0,0,'meteor-ice-head').setBlendMode(1).setVisible(false).setDepth(2);this.images=system.pool.map(()=>({tail:image().setOrigin(1,.5),head:image(),fringe:image().setOrigin(1,.5)}));this.dust=system.dust.map(()=>image().setDepth(2.1));this.samples=[{},{}]}
 update(){const sys=this.system;
  sys.pool.forEach((m,i)=>{const s=this.images[i];if(!m.active){s.head.setVisible(false);s.tail.setVisible(false);s.fringe.setVisible(false);return}
   const after=m.age>m.duration,age=Math.min(m.age,m.duration),alpha=m.brightness*ease(m.age/C.headFadeIn)*ease((m.duration-m.age)/C.headFadeOut),fade=after?(1-ease((m.age-m.duration)/C.afterglow))*.22:alpha;
   const head=meteorPosition(m,age,this.samples[0]),end=meteorPosition(m,Math.max(0,age-m.trailSeconds),this.samples[1]),angle=Math.atan2(head.y-end.y,head.x-end.x),length=Math.hypot(head.x-end.x,head.y-end.y)*2;
   const kind=m.special?'xi':m.distant?'ice':m.hero?'pearl':'ice',width=m.special?8.6:m.distant?2.2:m.hero?5:3.1;
   s.tail.setTexture('meteor-'+kind+'-tail').setPosition(head.x*2,head.y*2).setRotation(angle).setDisplaySize(Math.max(1,length),width).setAlpha(fade*(m.special?.82:.76)).setVisible(length>1);
   s.fringe.setTexture('meteor-'+kind+'-tail').setPosition(head.x*2,head.y*2).setRotation(angle).setDisplaySize(Math.max(1,length*.85),width*2.1).setAlpha(fade*(m.special?.13:.065)).setVisible(length>2&&!m.distant);
   const headSize=m.special?13:m.hero?8:m.distant?3.8:5.4;s.head.setTexture('meteor-'+kind+'-head').setPosition(m.x*2,m.y*2).setDisplaySize(headSize,headSize).setAlpha(alpha).setVisible(!after);
  });
  sys.dust.forEach((d,i)=>{const image=this.dust[i];if(!d.active){image.setVisible(false);return}const drag=(1-Math.exp(-C.dust.drag*d.age))/C.dust.drag,x=d.x+d.vx*drag,y=d.y+d.vy*drag+d.age*d.age*.8,alpha=d.brightness*(1-d.age/d.life)**2,size=d.glint?4.5:2.2;image.setTexture('meteor-'+(d.special?'xi':'ice')+'-dust').setPosition(x*2,y*2).setDisplaySize(size,size).setAlpha(alpha).setVisible(true)})
 }
 composite(ctx,scale=2){
  // Photo export composes the same visible Phaser sprites, including opacity and rotation.
  for(const group of this.images)for(const image of [group.fringe,group.tail,group.head])this.stamp(ctx,image,scale);for(const image of this.dust)this.stamp(ctx,image,scale);
 }
 stamp(ctx,im,scale){if(!im.visible||im.alpha<=0)return;const src=im.texture.getSourceImage();ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=im.alpha;ctx.translate(im.x*scale,im.y*scale);ctx.rotate(im.rotation);ctx.drawImage(src,-im.originX*im.displayWidth*scale,-im.originY*im.displayHeight*scale,im.displayWidth*scale,im.displayHeight*scale);ctx.restore()}
 destroy(){for(const group of this.images)for(const image of Object.values(group))image.destroy();this.dust.forEach(i=>i.destroy());this.images=[];this.dust=[]}
}
