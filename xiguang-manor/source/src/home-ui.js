import {cottageImage} from './cottage-art.js';
import {PLAY} from './play-config.js';
import {buyFurniture} from './play-model.js';
import {playImage} from './play-assets.js';
import {HOME as H} from './home-config.js';
import {furnitureIcon} from './home-art.js';
import {findRoomSpot,canPlace,putFurniture} from './home-model.js';
import {ROMANCE as R} from './romantic-config.js';
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export class HomeUI{
 constructor(parent){this.parent=parent}
 get room(){return this.parent.data.romance.room}
 open(tab='furniture'){
  const ui=this.parent,t=H.text,data=ui.data,items=this.room.items;
  const catalog=H.items.filter(f=>!f.price).map(f=>`<button data-home-add="${f.type}" class="furniture-card"><img alt="" src="${cottageImage(f.type)||furnitureIcon(f.type,data.romance.theme,this.room.bouquet)}"><strong>${f.name}</strong><small>${f.desc}</small><span>${items.some(i=>i.type===f.type)?t.move:t.place}</span></button>`).join('');
  const placed=items.map(item=>{const f=H.items.find(f=>f.type===item.type);return`<div class="placed-furniture"><img alt="" src="${cottageImage(item.type)||furnitureIcon(item.type,data.romance.theme,this.room.bouquet)}"><span>${f.name}</span><button data-home-add="${item.type}">${t.move}</button><button data-home-store="${item.type}">${t.store}</button></div>`}).join('');
  ui.card(t.catalog,`<p>${t.note}</p><div class="home-themes">${R.themes.map(theme=>`<button data-theme="${theme.id}" class="${data.romance.theme===theme.id?'selected':''}" style="--swatch:${theme.bed}"><i></i>${theme.name}</button>`).join('')}</div><nav class="home-tabs">${['furniture','newDecor','surfaces','placed'].map(id=>`<button data-home-tab="${id}" class="${id===tab?'selected':''}">${t[id]}</button>`).join('')}</nav>${tab==='furniture'?`<div class="furniture-grid">${catalog}</div>`:tab==='newDecor'?`<div class="furniture-grid">${PLAY.goods.map(f=>`<button ${data.play.furnitureOwned.includes(f.type)?'data-home-add':'data-buy-home'}="${f.type}" class="furniture-card"><img alt="" src="${cottageImage(f.type)||playImage('furniture-'+f.type+'-on')}"><strong>${f.name}</strong><small>${f.desc}</small><span>${data.play.furnitureOwned.includes(f.type)?t.place:f.price+' 糖果 · '+PLAY.text.buy}</span></button>`).join('')}</div>`:tab==='placed'?`<div class="placed-list">${placed||`<p>${t.empty}</p>`}</div>`:`<label class="field-label">${t.wallpaper}</label><div class="home-surfaces">${H.walls.map(v=>`<button data-wall="${v.id}" class="${this.room.wallpaper===v.id?'selected':''}">${v.name}</button>`).join('')}</div><label class="field-label">${t.floor}</label><div class="home-surfaces">${H.floors.map(v=>`<button data-floor="${v.id}" class="${this.room.floor===v.id?'selected':''}">${v.name}</button>`).join('')}</div>`}<small class="home-note">${PLAY.text.free} · ${items.length}/${H.maxItems}</small><div class="button-stack home-shortcuts"><button id="room-gift" class="secondary">${R.gift}</button><button id="room-outfit" class="secondary">${R.wardrobe}</button></div>`);
  $('#modal .romantic-card').classList.add('home-catalog');$('#room-gift').onclick=()=>ui.gift();$('#room-outfit').onclick=()=>ui.api.wardrobe();document.querySelectorAll('[data-home-tab]').forEach(b=>b.onclick=()=>this.open(b.dataset.homeTab));
  document.querySelectorAll('[data-theme]').forEach(b=>b.onclick=()=>{data.romance.theme=b.dataset.theme;ui.api.save();this.open(tab)});
  for(const [attr,key]of [['wall','wallpaper'],['floor','floor']])document.querySelectorAll(`[data-${attr}]`).forEach(b=>b.onclick=()=>{this.room[key]=b.dataset[attr];ui.api.save();this.open(tab)});
  document.querySelectorAll('[data-home-add]').forEach(b=>b.onclick=()=>this.place(b.dataset.homeAdd));
  document.querySelectorAll('[data-buy-home]').forEach(b=>b.onclick=()=>{const result=ui.api.transact(p=>buyFurniture(p,b.dataset.buyHome));if(result.ok){ui.api.hud();ui.api.chime();this.open('newDecor')}else ui.api.toast(result.reason==='funds'?PLAY.text.short:PLAY.text.saveFailed)});
  document.querySelectorAll('[data-home-store]').forEach(b=>b.onclick=()=>{this.room.items=this.room.items.filter(i=>i.type!==b.dataset.homeStore);ui.api.save();this.open('placed')});
 }
 place(type){
  const ui=this.parent;if(furnitureGuard(ui.data,type)){ui.api.toast(PLAY.text.short);return}const current=this.room.items.find(i=>i.type===type),item=current?{...current}:findRoomSpot(type,this.room.items);
  if(!item||!current&&this.room.items.length>=H.maxItems){ui.api.toast(H.text.full);return}
  ui.api.close();ui.view.startPlacement(item);$('.device').classList.add('decorating');
  ui.root.innerHTML=`<div class="decor-heading"><strong>${H.items.find(f=>f.type===type).name}</strong><p>${H.text.editing}</p></div><div class="decor-bar"><p id="decor-position"></p><div><button id="place-confirm" class="view-primary">${H.text.done}</button><button id="place-flip" class="view-secondary">${H.text.flip}</button><button id="place-cancel" class="view-secondary">${H.text.cancel}</button></div></div>`;
  $('#place-confirm').onclick=()=>{if(ui.api.transact(p=>putFurniture(p.romance.room,ui.view.editing.item)?{placed:true}:{ok:false}).ok){this.finish();ui.api.toast(H.text.saved)}};
  $('#place-flip').onclick=()=>{ui.view.editing.item.flip=!ui.view.editing.item.flip;ui.view.updatePlacement()};$('#place-cancel').onclick=()=>this.finish();this.status();
 }
 status(){const v=this.parent.view;if(!v?.editing||!$('#decor-position'))return;const valid=canPlace(this.room.items,v.editing.item);$('#decor-position').textContent=valid?H.text.valid:H.text.invalid;$('#decor-position').classList.toggle('invalid',!valid);$('#place-confirm').disabled=!valid}
 finish(){this.parent.view?.endPlacement();$('.device').classList.remove('decorating');this.parent.render()}
 action(item){
  const ui=this.parent,f=H.items.find(f=>f.type===item.type),t=H.text;
  if(f.action==='sit'){ui.sit('home',item);return}
  let text=f.desc,buttons='';
  if(['light','record','projector','curtain','flowers'].includes(f.action))buttons=`<button id="home-toggle" class="primary">${item.on?t.turnOff:t.turnOn}</button>`;
  else if(f.action==='tea'){text=t.tea;buttons=`<button id="home-toggle" class="primary">${t.brew}</button>`}
  else if(f.action==='water')buttons=`<button id="home-water" class="primary">${t.water}</button>`;
  else if(f.action==='bouquet'){text=t.vaseHint;buttons=`<button id="home-bouquet" class="primary">${t.chooseBouquet}</button>`}
  else if(f.action==='cat')buttons=`<button id="home-cat" class="primary">${t.catBed}</button>`;
  else if(f.action==='piano'){text=t.pianoHint;buttons=`<div class="piano-keys">${H.noteNames.map((note,i)=>`<button data-note="${i}" aria-label="${note}">${note}</button>`).join('')}</div>${!ui.data.music?`<p>${t.soundHint}</p><button id="home-sound" class="secondary">${t.sound}</button>`:''}`}
  else{ text=f.action==='painting'?t.paintingLine:t.sparkle;buttons=`<button id="home-sparkle" class="primary">${t.use}</button>`}
  ui.card(f.name,`<img class="home-item-portrait" alt="" src="${cottageImage(item.type)||furnitureIcon(item.type,ui.data.romance.theme,this.room.bouquet)}"><p>${esc(text)}</p><div class="button-stack">${buttons}<button id="home-move" class="secondary">${t.move}</button></div>`);
  $('#modal .romantic-card').classList.add('home-item-card');$('#home-move').onclick=()=>this.place(item.type);
  if($('#home-toggle'))$('#home-toggle').onclick=()=>{item.on=f.action==='tea'?true:!item.on;ui.api.save();ui.api.close();ui.view.touchHome(item.type);if(f.action==='record'&&item.on)for(let i=0;i<4;i++)setTimeout(()=>ui.api.note?.([0,2,4,6][i]),i*180);else ui.api.chime()};
  if($('#home-water'))$('#home-water').onclick=()=>{ui.api.close();ui.view.touchHome(item.type);ui.api.toast(t.watered);ui.api.chime()};
  if($('#home-bouquet'))$('#home-bouquet').onclick=()=>ui.bouquet(false);
  if($('#home-cat'))$('#home-cat').onclick=()=>{item.on=true;ui.data.romance.catFollow=false;ui.api.save();ui.api.close();ui.api.toast(t.catRest)};
  if($('#home-sparkle'))$('#home-sparkle').onclick=()=>{ui.api.close();ui.view.touchHome(item.type);ui.api.chime()};
  document.querySelectorAll('[data-note]').forEach(b=>b.onclick=()=>{ui.api.note?.(Number(b.dataset.note));ui.view.touchHome('piano');b.classList.add('played');setTimeout(()=>b.classList.remove('played'),180)});
  if($('#home-sound'))$('#home-sound').onclick=()=>{ui.api.enableMusic?.();this.action(item)};
 }
}

function furnitureGuard(data,type){return PLAY.goods.some(f=>f.type===type)&&!data.play.furnitureOwned.includes(type)}
