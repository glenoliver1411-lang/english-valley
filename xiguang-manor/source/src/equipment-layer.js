import {playFrame} from './play-assets.js';
import {actorAnchors} from './v6-assets.js';
export class EquipmentLayer{
 constructor(scene,profile){
  this.scene=scene;this.profile=profile;this.rear=scene.add.container(0,0);this.root=scene.add.container(0,0);this.glow=scene.add.graphics();this.parts={};
  for(const id of ['crown','rosepin','ghostlamp','catbell']){const key='worn-'+id;if(!scene.textures.exists(key))scene.textures.addCanvas(key,playFrame('equip-'+id));this.parts[id]=scene.add.image(0,0,key).setVisible(false);this.root.add(this.parts[id])}
  this.parts.ghostlamp.setOrigin(.5,.14);
  if(scene.world){scene.world.addAt(this.glow,scene.world.getIndex(scene.player));scene.world.addAt(this.rear,scene.world.getIndex(scene.player));scene.world.addAt(this.root,scene.world.getIndex(scene.player)+1)}
  scene.events.on('postupdate',this.update,this);scene.events.once('shutdown',()=>{scene.events.off('postupdate',this.update,this);this.root.destroy();this.rear.destroy();this.glow.destroy();this.ownCat?.destroy()});
 }
 update(){
  const s=this.scene,p=s.player,e=this.profile.play.equipment;if(!p?.active||!this.root.active)return;
  const visible=p.visible&&p.parentContainer?.visible!==false;for(const part of [this.root,this.rear,this.glow])part.setVisible(visible);if(!visible)return;
  const scale=p.scaleX||1,frame=Math.min(15,Number(p.frame?.name)||0),dir=Math.floor(frame/4),a=actorAnchors(this.profile.wardrobe.equipped,frame),seated=p.texture.key.includes('seated');
  this.root.setPosition(p.x,p.y).setDepth(p.depth+.02);this.rear.setPosition(p.x,p.y).setDepth(p.depth-.02);this.glow.setDepth(p.depth-.03);this.glow.clear();
  const at=(id,point,size=1)=>this.parts[id].setPosition((point[0]-16)*scale,(point[1]-34)*scale).setScale(scale*size);
  at('crown',seated?[16,5]:a.head).setVisible(e.head==='crown');
  at('rosepin',seated?[20,24]:a.pin,.6).setVisible(e.pin==='rosepin'&&dir!==3&&!seated);
  const torch=this.parts.ghostlamp;if(torch.parentContainer!==(a.back?this.rear:this.root))(a.back?this.rear:this.root).add(torch);
  at('ghostlamp',seated?[27,29]:a.hand,.65).setVisible(e.hand==='ghostlamp');
  if(e.hand==='ghostlamp'){const x=p.x+torch.x,y=p.y+torch.y+5*scale;for(let i=3;i>0;i--){this.glow.fillStyle(0xffd5a1,.016+(3-i)*.01);this.glow.fillEllipse(x,y,28+i*18,18+i*14)}}
  const follow=e.companion==='catbell'||this.profile.romance.catFollow;
  if(!s.cat&&follow&&!this.ownCat)this.ownCat=s.add.image(p.x+27,p.y+5,'cat').setScale(1.1);
  if(this.ownCat){this.ownCat.setVisible(follow);this.ownCat.x+=(p.x+27-this.ownCat.x)*.08;this.ownCat.y+=(p.y-10-this.ownCat.y)*.08;this.ownCat.setDepth(p.depth+.005)}
  const cat=s.cat||this.ownCat;this.parts.catbell.setVisible(e.companion==='catbell'&&!!cat&&cat.visible!==false);if(cat)this.parts.catbell.setPosition(cat.x-p.x+4,cat.y-p.y+5).setScale(.55);
 }
}
