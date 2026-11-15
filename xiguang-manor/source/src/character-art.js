import {avatarPortrait,avatarKey,preloadIdentity,installIdentitySources,releaseEditingImages} from './identity-art.js';
import {ensureOwner,poseOwner} from './identity-phaser.js';
import original from './assets/daylight/xiaoxi-walk.webp';
import cocoa from './assets/daylight/xiaoxi-cocoa-walk.webp';
import rose from './assets/daylight/xiaoxi-rose-walk.webp';
import wild from './assets/daylight/xiaoxi-wild-walk.webp';
import berry from './assets/daylight/xiaoxi-berry-walk.webp';
import pearl from './assets/daylight/xiaoxi-pearl-walk.webp';
import mist from './assets/daylight/xiaoxi-mist-walk.webp';
import seated from './assets/daylight/xiaoxi-seated.webp';
import atlas from './assets/daylight/character-atlas.json';

// One production specification for every costume and every playable scene.
// Pixels are cropped from original illustrated sheets, never reconstructed.
export const CHARACTER={width:64,height:80,footX:32,footY:68,worldScale:1.3,roomScale:.75,floristScale:1.7};
const files={original,cocoa,rose,wild,berry,pearl,mist},sources=new Map(),portraits=new Map();
export const characterOutfit=profile=>Object.prototype.hasOwnProperty.call(files,profile.wardrobe?.equipped)?profile.wardrobe.equipped:'original';
export const characterKey=profile=>profile.identity?.mode==='modular'?avatarKey(profile):characterOutfit(profile)==='original'?'girl':'girl-'+characterOutfit(profile);
export function preloadCharacters(s){
 preloadIdentity(s,s.profile||s.dataSave);
 for(const[id,url]of Object.entries(files)){const key=id==='original'?'girl':'girl-'+id;if(!s.textures.exists(key))s.load.image('character-source-'+id,url)}
 if(!s.textures.exists('xiaoxi-seated'))s.load.image('xiaoxi-seated',seated);
}
export function installCharacters(s){
 installIdentitySources(s,s.profile||s.dataSave);ensureOwner(s,s.profile||s.dataSave);
 for(const id of Object.keys(files)){
  const key=id==='original'?'girl':'girl-'+id,sourceKey='character-source-'+id,source=s.textures.exists(sourceKey)?s.textures.get(sourceKey).getSourceImage():s.textures.get(key).getSourceImage();
  // Also repairs a failed spritesheet retried by the generic image loader.
  if(s.textures.exists(sourceKey)){if(s.textures.exists(key))s.textures.remove(key);s.textures.addSpriteSheet(key,source,{frameWidth:64,frameHeight:80});s.textures.remove(sourceKey)}
  s.textures.get(key).setFilter(1);sources.set(id,source);
  for(let d=0;d<4;d++)if(!s.anims.exists(`dress-${id}-${d}`))s.anims.create({key:`dress-${id}-${d}`,frames:s.anims.generateFrameNumbers(key,{start:d*4,end:d*4+3}),frameRate:7,repeat:-1});
 }
 const t=s.textures.get('xiaoxi-seated');t.setFilter(1);sources.set('seated',t.getSourceImage());
 for(const [id,f]of Object.entries(atlas.seated))if(!t.has(id))t.add(id,0,f.x,f.y,64,80);
 if(!document.querySelector('#owner-editor'))releaseEditingImages();
}
export function poseCharacter(s,{facing=s.facing||0,moving=false,seated=false,scale=CHARACTER.roomScale}={}){
 const p=s.player;if(!p)return;if((s.profile||s.dataSave).identity?.mode==='modular'){poseOwner(s,s.profile||s.dataSave,{facing,moving,seated,scale});return}p.setData('actorFacing',facing).setData('actorSeated',seated);const id=characterOutfit(s.profile||s.dataSave),key=seated?'xiaoxi-seated':characterKey(s.profile||s.dataSave),frame=seated?`${id}-${facing===3?'back':'front'}`:facing*4+1;
 if(p.texture.key!==key)p.setTexture(key,frame);
 p.setScale(scale).setOrigin(.5,.85);
 if(moving&&!seated)p.play(`dress-${id}-${facing}`,true);
 else{if(p.anims.isPlaying)p.stop();if(p.frame.name!==frame)p.setFrame(frame)}
}
export function characterPainting(profile,{seated=false,back=false,facing=back?3:0,frame=null,gather=false}={}){
 if(profile.identity?.mode==='modular'){const painting=avatarPortrait(profile,{facing,seated,frame:frame??0,gather});if(!painting)throw Error('人物模块尚未准备完整');return painting}
 const id=characterOutfit(profile),key=[id,seated,facing,frame].join('/');if(portraits.has(key))return portraits.get(key);
 const source=sources.get(seated?'seated':id);if(!source)throw new Error('Character artwork has not finished loading');
 const f=seated?atlas.seated[`${id}-${back?'back':'front'}`]:{x:64*((frame??1)%4),y:facing*80};
 const c=document.createElement('canvas');c.width=64;c.height=80;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(source,f.x,f.y,64,80,0,0,64,80);portraits.set(key,c);return c;
}
