import './home-editor.css';
import {cottageImage} from './cottage-art.js';
import {PLAY} from './play-config.js';
import {buyFurniture} from './play-model.js';
import {HOME as H} from './home-config.js';
import {furnitureIcon} from './home-art.js';
import {findRoomSpot,placementResult,layoutResult,furniture,furnitureBox,roomDefaults,cloneRoom,RoomDraft,nextFurnitureId} from './home-model.js';
import {ROMANCE as R} from './romantic-config.js';
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export class HomeUI{
 constructor(parent){this.parent=parent;this.draft=null;this.snap=false;this.gestures=new Map();this.historyPointer=null}
 get room(){return this.draft?.room||this.parent.data.romance.room}
 get theme(){return this.room.decorTheme||this.parent.data.romance.theme}
 get selected(){return this.room.items.find(i=>i.id===this.selection)}
 begin(){
  if(this.draft)return;const ui=this.parent,v=ui.view;if(!v||ui.place!=='cabin')return;
  ui.api.close();if(v.quiet)v.stand();v.stopMoving();this.draft=new RoomDraft(ui.data.romance.room);this.draft.room.decorTheme=ui.data.romance.theme;this.selection=null;v.editing={controller:this,item:null};v.player.setVisible(false);v.cat.setVisible(false);$('.device').classList.remove('retreat-quiet');$('.device').classList.add('decorating','free-decorating');
  if(v.input.manager.pointersTotal<3)v.input.addPointer(3-v.input.manager.pointersTotal);const camera=v.cameras.main;camera.stopFollow();camera.panEffect.reset();camera.removeBounds();this.fit();this.render();v.syncHome();
 }
 fit(){const v=this.parent.view,c=v.cameras.main;this.minZoom=Math.min(v.scale.gameSize.width/432,v.scale.gameSize.height/850)*.87;c.setZoom(this.minZoom).centerOn(216,430)}
 render(){
  if(!this.draft)return;const root=this.parent.root;root.className='retreat-ui room-editor';root.innerHTML=`<div class="room-editor-top"><button id="room-cancel">取消</button><strong>布置小屋</strong><button id="room-save">保存布局</button></div><div class="room-camera"><button id="room-zoom-in" aria-label="放大视角">＋</button><button id="room-zoom-out" aria-label="缩小视角">－</button><button id="room-fit">全屋</button></div><div class="room-editor-bottom"><p id="room-editor-status" role="status"></p><div class="room-edit-tools"><button id="room-catalog">添置家具</button><button id="room-undo">撤销</button><button id="room-redo">重做</button><button id="room-grid" aria-pressed="${this.snap}">${this.snap?'网格对齐':'自由移动'}</button><button id="room-plans">方案</button></div><div class="room-selection" id="room-selection"><span id="room-selection-name"></span><button id="room-flip">翻转</button><button id="room-store">收纳这件</button></div></div>`;
  const on=(id,fn)=>$(id).onclick=fn;
  on('#room-cancel',()=>this.finish(false));on('#room-save',()=>this.finish(true));on('#room-catalog',()=>this.open());on('#room-flip',()=>this.change(room=>{const i=room.items.find(i=>i.id===this.selection);if(i)i.flip=!i.flip}));on('#room-store',()=>this.change(room=>{room.items=room.items.filter(i=>i.id!==this.selection);this.selection=null}));
  on('#room-undo',()=>{this.draft.undo();this.refresh()});on('#room-redo',()=>{this.draft.redo();this.refresh()});on('#room-grid',()=>{this.snap=!this.snap;$('#room-grid').textContent=this.snap?'网格对齐':'自由移动';$('#room-grid').setAttribute('aria-pressed',String(this.snap));this.draw()});on('#room-fit',()=>this.fit());on('#room-zoom-in',()=>this.zoom(1.2));on('#room-zoom-out',()=>this.zoom(1/1.2));on('#room-plans',()=>this.plans());this.refresh();
 }
 zoom(factor){const c=this.parent.view.cameras.main;c.setZoom(Math.max(this.minZoom*.8,Math.min((this.parent.view.sys.game.manorPixelScale||1)*2.5,c.zoom*factor)))}
 refresh(){const v=this.parent.view;if(!this.draft||!v)return;v.editing.item=this.selected||null;v.syncHome();this.lastDraw='';this.draw();this.status()}
 change(fn){this.draft.change(fn);this.refresh()}
 status(){
  if(!this.draft||!$('#room-editor-status'))return;const result=this.dragResult||{ok:true},selected=this.selected;
  $('#room-editor-status').textContent=result.ok?(this.drag?'松开手指放下家具':selected?furniture(selected.type).name+' · 长按拖动，底座可放处会亮起':'长按家具拖动 · 空处单指平移 · 双指缩放'):result.reason;
  $('#room-editor-status').classList.toggle('invalid',!result.ok);$('#room-selection').hidden=!selected;$('#room-selection-name').textContent=selected?furniture(selected.type).name:'';$('#room-undo').disabled=!this.draft.past.length;$('#room-redo').disabled=!this.draft.future.length;$('#room-save').disabled=!!this.drag||!result.ok;
 }
 open(tab='furniture'){
  this.begin();if(!this.draft)return;const ui=this.parent,data=ui.data;
  const types=H.items.filter(f=>tab==='newDecor'?f.price:tab==='placed'?false:!f.price);
  ui.card('家具箱',`<p>原有家具都可以移动；同一种家具可再放一件。购买过的新装饰永久拥有。</p><nav class="home-tabs">${['furniture','newDecor','surfaces','placed'].map(id=>`<button data-home-tab="${id}" class="${id===tab?'selected':''}">${H.text[id]}</button>`).join('')}</nav>${tab==='surfaces'?`<div class="home-themes">${R.themes.map(t=>`<button data-home-theme="${t.id}" class="${this.theme===t.id?'selected':''}">${t.name}</button>`).join('')}</div><label class="field-label">墙面</label><div class="home-surfaces">${H.walls.map(f=>`<button data-wall="${f.id}" class="${this.room.wallpaper===f.id?'selected':''}">${f.name}</button>`).join('')}</div><label class="field-label">地板</label><div class="home-surfaces">${H.floors.map(f=>`<button data-floor="${f.id}" class="${this.room.floor===f.id?'selected':''}">${f.name}</button>`).join('')}</div>`:tab==='placed'?`<div class="placed-list">${this.room.items.map(item=>`<div class="placed-furniture"><img alt="" src="${cottageImage(item.type)}"><span>${furniture(item.type).name}</span><button data-home-move="${item.id}">选择</button><button data-home-store="${item.id}">收纳</button></div>`).join('')}</div>`:`<div class="furniture-grid">${types.map(f=>{const owned=!f.price||data.play.furnitureOwned.includes(f.type);return`<button class="furniture-card" ${owned?'data-home-add':'data-buy-home'}="${f.type}"><img alt="" src="${cottageImage(f.type)}"><strong>${f.name}</strong><small>${f.desc}</small><span>${owned?'再放一件':f.price+' 糖果'}</span></button>`}).join('')}</div>`}<p class="home-note">${this.room.items.length} 件家具 · 未保存的布置可撤销</p><button id="room-return-editor" class="primary">回到房间</button>`);
  $('#modal .romantic-card').classList.add('home-catalog');$('#room-return-editor').onclick=()=>{ui.api.close();this.refresh()};document.querySelectorAll('[data-home-tab]').forEach(b=>b.onclick=()=>this.open(b.dataset.homeTab));
  document.querySelectorAll('[data-home-theme]').forEach(b=>b.onclick=()=>{this.change(r=>r.decorTheme=b.dataset.homeTheme);this.open('surfaces')});
  for(const [attr,key]of [['wall','wallpaper'],['floor','floor']])document.querySelectorAll(`[data-${attr}]`).forEach(b=>b.onclick=()=>{this.change(room=>{room[key]=b.dataset[attr]});this.open('surfaces')});
  document.querySelectorAll('[data-home-add]').forEach(b=>b.onclick=()=>this.place(b.dataset.homeAdd));
  document.querySelectorAll('[data-home-move]').forEach(b=>b.onclick=()=>{this.selection=b.dataset.homeMove;ui.api.close();this.refresh()});
  document.querySelectorAll('[data-home-store]').forEach(b=>b.onclick=()=>{this.change(room=>{room.items=room.items.filter(i=>i.id!==b.dataset.homeStore)});this.open('placed')});
  document.querySelectorAll('[data-buy-home]').forEach(b=>b.onclick=()=>{const result=ui.api.transact(p=>buyFurniture(p,b.dataset.buyHome));if(result.ok){ui.api.hud();ui.api.chime();this.open('newDecor')}else ui.api.toast(result.reason==='funds'?PLAY.text.short:PLAY.text.saveFailed)});
 }
 place(type,id=null){this.begin();if(!this.draft)return;if(furnitureGuard(this.parent.data,type))return;const old=id?this.room.items.find(i=>i.id===id):null;if(old){this.selection=old.id}else{const item=findRoomSpot(type,this.room.items);if(!item){this.parent.api.toast('暂时没有足够的空间，先移动或收纳一件家具吧。');return}this.change(room=>{item.id=nextFurnitureId(room);room.items.push(item);this.selection=item.id})}this.parent.api.close();this.refresh();const i=this.selected;this.parent.view.cameras.main.centerOn(i.x,i.y-60)}
 plans(){const ui=this.parent;ui.card('我的装修方案',`<p>保存当前草稿，随时换一间喜欢的小屋。应用方案后仍可撤销。</p><label class="field-label" for="room-plan-name">方案名称</label><input id="room-plan-name" maxlength="32" placeholder="窗边的午后"><button id="room-plan-save" class="primary">保存为方案</button><div class="room-plan-list">${this.room.layouts.map((l,i)=>`<div><span>${esc(l.name)}</span><button data-plan-load="${i}">应用</button><button data-plan-delete="${i}">删除</button></div>`).join('')}</div><button id="room-default" class="secondary">恢复默认家具布局</button><button id="room-plan-back" class="secondary">回到装修</button>`);
  $('#room-plan-save').onclick=()=>{if(this.room.layouts.length>=12){ui.api.toast('方案册已有 12 页，请删除一页后保存。');return}const name=$('#room-plan-name').value.trim()||'小屋方案 '+(this.room.layouts.length+1);this.change(room=>{room.layouts.push({id:'layout-'+room.layouts.length,name,wallpaper:room.wallpaper,floor:room.floor,items:cloneRoom(room.items)})});this.plans()};
  $('#room-plan-back').onclick=()=>{ui.api.close();this.refresh()};$('#room-default').onclick=()=>{this.change(room=>{room.items=roomDefaults().items;this.selection=null});ui.api.close()};document.querySelectorAll('[data-plan-load]').forEach(b=>b.onclick=()=>{const l=this.room.layouts[+b.dataset.planLoad],result=layoutResult(l);if(!result.ok){ui.api.toast(result.reason);return}this.change(room=>{Object.assign(room,{items:cloneRoom(l.items),floor:l.floor,wallpaper:l.wallpaper});this.selection=null});ui.api.close()});document.querySelectorAll('[data-plan-delete]').forEach(b=>b.onclick=()=>{this.change(room=>room.layouts.splice(+b.dataset.planDelete,1));this.plans()});
 }
 down(p){
  if(!this.draft)return;const v=this.parent.view,c=v.cameras.main,at=c.getWorldPoint(p.x,p.y);this.gestures.set(p.id,{x:p.x,y:p.y});
  if(this.gestures.size>=2){this.cancelDrag();const q=[...this.gestures.values()];this.pinch={distance:Math.hypot(q[0].x-q[1].x,q[0].y-q[1].y),zoom:c.zoom};this.pointer=null;return}
  const hit=[...this.room.items].sort((a,b)=>v.homeSprites.get(b.id).depth-v.homeSprites.get(a.id).depth).find(i=>{const im=v.homeSprites.get(i.id),b=im.getBounds();if(!b.contains(at.x,at.y))return false;const local=im.getLocalPoint(at.x,at.y);return(v.textures.getPixelAlpha(local.x,local.y,im.texture.key)||0)>40});
  this.pointer={id:p.id,x:p.x,y:p.y,at,scrollX:c.scrollX,scrollY:c.scrollY,hit:hit?.id,moved:false};
  if(hit){this.selection=hit.id;this.refresh();this.hold=setTimeout(()=>{if(this.pointer&&!this.pointer.moved)this.startDrag(p)},280)}
 }
 startDrag(p){const i=this.selected;if(!i)return;this.drag={before:cloneRoom(this.room),original:{...i},offsetX:i.x-this.pointer.at.x,offsetY:i.y-this.pointer.at.y};this.pointer.moved=true;this.status()}
 move(p){
  if(!this.draft)return;const c=this.parent.view.cameras.main;if(this.gestures.has(p.id))this.gestures.set(p.id,{x:p.x,y:p.y});
  if(this.pinch&&this.gestures.size>=2){const q=[...this.gestures.values()],x=(q[0].x+q[1].x)/2,y=(q[0].y+q[1].y)/2,anchor=c.getWorldPoint(x,y);c.setZoom(Math.max(this.minZoom*.8,Math.min((this.parent.view.sys.game.manorPixelScale||1)*2.5,this.pinch.zoom*Math.hypot(q[0].x-q[1].x,q[0].y-q[1].y)/Math.max(1,this.pinch.distance))));const next=c.getWorldPoint(x,y);c.scrollX+=anchor.x-next.x;c.scrollY+=anchor.y-next.y;return}
  if(!this.pointer||this.pointer.id!==p.id)return;const at=c.getWorldPoint(p.x,p.y),dist=Math.hypot(p.x-this.pointer.x,p.y-this.pointer.y);
  if(this.drag){const item=this.selected;if(!item)return;const density=this.parent.view.sys.game.manorPixelScale||1,lift=p.wasTouch?28*density/c.zoom:0,step=this.snap?H.grid:.1;item.x=Math.round((at.x+this.drag.offsetX)/step)*step;item.y=Math.round((at.y+this.drag.offsetY-lift)/step)*step;this.dragResult=placementResult(this.room.items,item);this.refresh()}
  else if(dist>10){clearTimeout(this.hold);this.pointer.moved=true;c.scrollX=this.pointer.scrollX-(p.x-this.pointer.x)/c.zoom;c.scrollY=this.pointer.scrollY-(p.y-this.pointer.y)/c.zoom}
 }
 up(p){
  clearTimeout(this.hold);this.gestures.delete(p.id);if(this.pinch){if(this.gestures.size<2)this.pinch=null;this.pointer=null;return}
  if(this.drag){if(this.dragResult?.ok===false)this.draft.room=this.drag.before;else{this.draft.past.push(this.drag.before);if(this.draft.past.length>60)this.draft.past.shift();this.draft.future=[]}this.drag=null;this.dragResult=null}
  else if(this.pointer&&!this.pointer.hit&&!this.pointer.moved)this.selection=null;
  this.pointer=null;this.refresh();
 }
 cancelDrag(){clearTimeout(this.hold);if(this.drag){this.draft.room=this.drag.before;this.drag=null;this.dragResult=null;this.refresh()}}
 draw(){
  if(!this.draft)return;const v=this.parent.view,g=v.decorGraphics,item=this.selected,key=JSON.stringify([item,this.snap,!!this.drag,this.dragResult?.ok]);if(key===this.lastDraw)return;this.lastDraw=key;g.clear();
  g.lineStyle(1,0xe7d6ba,.35).strokeRect(29,330,374,450);if(item&&furniture(item.type).layer==='wall')for(const z of H.wallZones)g.lineStyle(1,0xb6d7b4,.7).strokeRect(z.x,z.y,z.w,z.h);if(this.drag)for(const other of this.room.items){if(other.id===item?.id||furniture(other.type).layer)continue;const box=furnitureBox(other);g.lineStyle(.7,0xd3ad9e,.4).strokeRect(box.x,box.y,box.w,box.h)}if(this.snap){g.lineStyle(.5,0xeedfc5,.14);for(let x=30;x<404;x+=8)g.lineBetween(x,338,x,780);for(let y=338;y<=780;y+=8)g.lineBetween(30,y,402,y)}
  if(!item)return;const b=furnitureBox(item),valid=this.dragResult?.ok!==false,color=valid?0xb6d7b4:0xed9ca8;g.fillStyle(0x342739,.18).fillEllipse(item.x,item.y-1,b.w+4,6);g.fillStyle(color,.2).fillRect(b.x,b.y,b.w,b.h);g.lineStyle(1.5,color,.9).strokeRect(b.x-2,b.y-2,b.w+4,b.h+4);
 }
 finish(save){
  if(!this.draft)return;this.cancelDrag();if(save){const result=layoutResult(this.room);if(!result.ok){this.parent.api.toast(result.reason);return}const snapshot=cloneRoom(this.room),saved=this.parent.api.transact(p=>{p.romance.theme=snapshot.decorTheme||p.romance.theme;delete snapshot.decorTheme;p.romance.room=snapshot;return{room:true}});if(!saved.ok){this.parent.api.toast('没能保存，请保留当前页面再试一次。');return}}
  this.parent.api.close();this.dispose();this.parent.view.endPlacement();$('.device').classList.remove('decorating','free-decorating');this.parent.render();if(save)this.parent.api.toast(H.text.saved);
 }
 dispose(){clearTimeout(this.hold);this.draft=null;this.selection=null;this.pointer=null;this.drag=null;this.pinch=null;this.gestures.clear()}
 action(item){
  const ui=this.parent,f=H.items.find(f=>f.type===item.type),t=H.text;
  if(f.action==='hearth'){ui.sit('hearth',item);return}if(['rest','mail','wardrobe','books'].includes(f.action)){ui.action({id:f.action==='books'?'books':f.action});return}if(f.action==='sit'){ui.sit('home',item);return}
  let text=f.desc,buttons='';
  if(['light','record','projector','curtain','flowers'].includes(f.action))buttons=`<button id="home-toggle" class="primary">${item.on?t.turnOff:t.turnOn}</button>`;
  else if(f.action==='tea'){text=t.tea;buttons=`<button id="home-toggle" class="primary">${t.brew}</button>`}
  else if(f.action==='water')buttons=`<button id="home-water" class="primary">${t.water}</button>`;
  else if(f.action==='bouquet'){text=t.vaseHint;buttons=`<button id="home-bouquet" class="primary">${t.chooseBouquet}</button>`}
  else if(f.action==='cat')buttons=`<button id="home-cat" class="primary">${t.catBed}</button>`;
  else if(f.action==='piano'){text=t.pianoHint;buttons=`<div class="piano-keys">${H.noteNames.map((note,i)=>`<button data-note="${i}" aria-label="${note}">${note}</button>`).join('')}</div>${!ui.data.music?`<p>${t.soundHint}</p><button id="home-sound" class="secondary">${t.sound}</button>`:''}`}
  else{ text=f.action==='painting'?t.paintingLine:t.sparkle;buttons=`<button id="home-sparkle" class="primary">${t.use}</button>`}
  ui.card(f.name,`<img class="home-item-portrait" alt="" src="${cottageImage(item.type)||furnitureIcon(item.type,ui.data.romance.theme,this.room.bouquet)}"><p>${esc(text)}</p><div class="button-stack">${buttons}<button id="home-move" class="secondary">${t.move}</button></div>`);
  $('#modal .romantic-card').classList.add('home-item-card');$('#home-move').onclick=()=>this.place(item.type,item.id);
  if($('#home-toggle'))$('#home-toggle').onclick=()=>{item.on=f.action==='tea'?true:!item.on;ui.api.save();ui.api.close();ui.view.touchHome(item.id);if(f.action==='record'&&item.on)for(let i=0;i<4;i++)setTimeout(()=>ui.api.note?.([0,2,4,6][i]),i*180);else ui.api.chime()};
  if($('#home-water'))$('#home-water').onclick=()=>{ui.api.close();ui.view.touchHome(item.id);ui.api.toast(t.watered);ui.api.chime()};
  if($('#home-bouquet'))$('#home-bouquet').onclick=()=>ui.bouquet(false);
  if($('#home-cat'))$('#home-cat').onclick=()=>{item.on=true;ui.data.romance.catFollow=false;ui.api.save();ui.api.close();ui.api.toast(t.catRest)};
  if($('#home-sparkle'))$('#home-sparkle').onclick=()=>{ui.api.close();ui.view.touchHome(item.id);ui.api.chime()};
  document.querySelectorAll('[data-note]').forEach(b=>b.onclick=()=>{ui.api.note?.(Number(b.dataset.note));ui.view.touchHome(item.id);b.classList.add('played');setTimeout(()=>b.classList.remove('played'),180)});
  if($('#home-sound'))$('#home-sound').onclick=()=>{ui.api.enableMusic?.();this.action(item)};
 }
}

function furnitureGuard(data,type){return PLAY.goods.some(f=>f.type===type)&&!data.play.furnitureOwned.includes(type)}
