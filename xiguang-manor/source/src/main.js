import {renderShell,icon} from './app-shell.js';
import {startup} from './startup-session.js';
import {lazyFeature,warmFeatures} from './lazy-feature.js';
import {DailyWelcome} from './daily-welcome.js';
import {CleanView} from './clean-view.js';
import {CLEAN_VIEW} from './clean-view-config.js';
import {consumeMeadowReturn} from './aurora-navigation.js';
import {V5} from './v5-config.js';
import './home.css';
import {GiftOpening} from './gift-opening.js';
import {GIFT} from './gift-config.js';
import {MEADOW} from './home-config.js';
import {NATURE} from './nature-config.js';
import {ROMANCE as R} from './romantic-config.js';
import './scenery.css';
import './session.css';
import './adventure.css';
import './candy.css';
import './romantic.css';
import './world-polish.css';
import './v5.css';
import './clean-view.css';
import './daily-welcome.css';
import {AdventureUI} from './adventure-ui.js';
import {AT} from './adventure-config.js';
import {SessionUI} from './session-ui.js';
import {SessionProgress} from './session-model.js';
import {XT} from './session-config.js';
import {SceneryUI} from './scenery-ui.js';
import {ST} from './scenery-config.js';
import {createSoundscape} from './soundscape.js';
import {CONFIG as C,T,fmt} from './config.js';
import {load,quest,grow,saveProtection} from './save.js';
import {PWA} from './pwa-config.js';
import {createGame,controls} from './game.js';
const auroraReturn=consumeMeadowReturn();
const $=s=>document.querySelector(s);const data=startup.data;if(matchMedia('(prefers-reduced-motion: reduce)').matches)data.romance.reducedMotion=true;const progress=new SessionProgress(data);let session;let gift=startup.gift;let audioUnlocked=startup.audioUnlocked;const sound=startup.sound;let romantic;let workshop;let adventure;let scenery;let cleanView;let daily;let pocket,pocketPromise;let scene,current=null,modal=false,dialogueNext=null,timer,fullText='',shown='',endingCleanup=null;
renderShell();
$('.device').classList.toggle('reduce-motion',data.romance.reducedMotion);
function save(){if(scene?.ready&&!scene.room&&!scene.observing&&!scene.exploring&&!progress.exited)data.position={x:scene.player.x,y:scene.player.y};const ok=progress.save(data);session?.saveStatus(ok);$('#saveStatus').textContent=ok?T.saved:T.saveError;return ok}
function hud(){$('#chapter').textContent=R.title;$('#candies').textContent=data.candies;$('#magic').textContent=`${data.magic.length}/3`;$('.aside-note>span').textContent=V5.version;updateMusic();scenery?.updateTime()}

function near(item){gift?.hint(item);current=item;const b=$('#interact');b.disabled=!item||modal;b.querySelector('span').textContent=item?item.title:T.interact}
function toast(text,variant=''){$('#toast').classList.toggle('flower-toast',variant==='flower');$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>$('#toast').classList.remove('show'),2800)}
function title(text,duration=2500){$('#scene-title').textContent=text;$('#scene-title').classList.add('show');setTimeout(()=>$('#scene-title').classList.remove('show'),duration)}
function setLock(v){if(scene){scene.locked=v||!!scene.observing||!!scene.exploring||!!scene.inShop||!!scene.inRetreat;scene.target=null}controls.x=controls.y=0;$('#knob').style.transform='translate(-50%,-50%)'}
function openModal(html,kind=''){daily?.dismiss(true);cleanView?.show();modal=true;setLock(true);$('#modal').className=`modal ${kind}`;$('#modal').innerHTML=html;$('#modal').querySelector('button,input')?.focus({preventScroll:true})}
function closeModal(){modal=false;$('#modal').className='modal hidden';$('#modal').innerHTML='';setLock(false)}
function button(id,label,cls='primary'){return`<button id="${id}" class="${cls}">${label}</button>`}
function letter(replay=false){openModal(`<article class="letter"><div class="letter-stars">✧ · ✦ · ✧</div><div class="letter-tag">${T.letterTag}</div><h2>${fmt(T.salutation)}</h2><p>${C.letter.replaceAll('\n','<br>')}</p><div class="letter-sign">${T.signature}<span>${icon('heart')}</span></div><div class="seal">${icon('moon')}</div>${button('accept',replay?T.continue:data.accepted?T.resume:T.accept)}<small>${C.edition}</small></article>`,'letter-modal');$('#accept').onclick=async()=>{closeModal();startAudio();if(replay||data.accepted){scene.openGate();return}data.accepted=true;save();title(T.sky,3300);await scene.opening();title(fmt(T.welcome),3000)}}
function candyShop(){workshop.enter()}
function journal(){openModal(`<article class="card journal"><button id="close-journal" class="icon-button corner" aria-label="${T.close}">${icon('close')}</button><span class="eyebrow">${T.memories}</span><h2>${T.journalTitle}</h2><p>${T.journalDesc}</p><dl><div><dt>${T.favorite}</dt><dd>${C.candies.find(c=>c.id===data.favorite)?.name||T.noFavorite}</dd></div><div><dt>${T.catName}</dt><dd id="journal-cat"></dd></div><div><dt>${T.flowers}</dt><dd>${data.plots.filter(p=>grow(p).state===3).length} / 4</dd></div></dl><div class="button-stack">${button('pocket-journal',PWA.journal,'secondary')}${button('hide-journal-interface',CLEAN_VIEW.hide,'secondary')}${button('scenery-journal',ST.album,'secondary')}${button('replay-opening',GIFT.text.replay,'secondary')}${button('replay-letter',T.replayLetter,'secondary')}${button('replay-ending',T.replayEnding,'secondary')}${button('home',T.resetMove,'text-button')}</div><small>${R.homeLine}</small></article>`);$('#journal-cat').textContent=data.catName||T.catDefault;$('#pocket-journal').onclick=()=>loadPocket().then(p=>p?.panel());$('#close-journal').onclick=closeModal;$('#hide-journal-interface').onclick=()=>{closeModal();cleanView.hide()};$('#scenery-journal').onclick=()=>scenery.album();$('#replay-opening').onclick=()=>gift.start(true);$('#replay-letter').onclick=()=>letter(true);$('#replay-ending').onclick=()=>scenery.enter('dawn');$('#home').onclick=()=>{scene.player.setPosition(216,728);data.position={x:216,y:728};save();closeModal()}}
function interact(){if(modal||cleanView?.hidden)return;if(workshop?.active){workshop.interact();return}if(adventure?.view){adventure.interact();return}if(romantic?.active){romantic.interact();return}if(!current||scene.locked)return;const n=current;switch(n.id){case'cabin':romantic.enter('cabin');break;case'garden':romantic.enter('garden');break;case'pond':lakeMenu();break;case'decor':adventure.inspect(n.object);break;case'lookout':scenery.enter();break;case'shop':candyShop();break;case'cat':romantic.cat();break;case'magic':if(data.magic.includes(n.index))break;data.magic.push(n.index);data.candies++;scene.burst(n.x,n.y);save();scene.refresh();chime();toast(T.magicToast);break;case'sweet':if(n.sweet.at)break;data.candies++;n.sweet.at=Date.now()+24000;n.sweet.obj.setVisible(false);scene.burst(n.x,n.y);save();hud();toast(T.sweetToast);chime();break;case'plot':{const p=grow(data.plots[n.index]);if(p.state===0){p.state=1;toast(T.seedToast)}else if(p.state===1){p.state=2;p.wateredAt=Date.now();toast(T.waterToast);scene.burst(n.x,n.y,0xb5d7df)}else if(p.state===2)toast(T.waterToast);else{const flower=R.flowers[n.index];scene.pickups.emit(flower.id,n.x,n.y-8,{x:scene.player.x+10,y:scene.player.y-28});if(!data.romance.flowers.includes(flower.id))data.romance.flowers.push(flower.id);p.state=0;p.wateredAt=0;toast(fmt(NATURE.text.picked,{flower:flower.name,effect:NATURE.flowers[flower.id].name}),'flower')}save();scene.refresh();break}case'tree':scene.burst(235,218);chime();openModal(`<article class="card"><h2>${T.tree}</h2><p>${R.homeLine}</p><div class="button-stack">${button('tree-dawn',ST.waitDawn)}${button('tree-close',T.continue,'secondary')}</div></article>`);$('#tree-dawn').onclick=()=>scenery.enter('dawn');$('#tree-close').onclick=closeModal;break}}
function lakeMenu(){openModal(`<article class="card"><button id="lake-close" class="scenery-close">×</button><span class="eyebrow">${R.title}</span><h2>${R.lake}</h2><div class="button-stack">${button('lake-quiet',R.lakeSit)}${button('lake-dawn',R.lakeDawn,'secondary')}${button('lake-stars',ST.startMeteor,'secondary')}${button('lake-explore',AT.pondAction,'secondary')}</div></article>`);$('#lake-close').onclick=closeModal;$('#lake-quiet').onclick=()=>scenery.enter('quiet',false,'lake');$('#lake-dawn').onclick=()=>scenery.enter('dawn',false,'lake');$('#lake-stars').onclick=()=>scenery.enter('meteor',false,'lake');$('#lake-explore').onclick=()=>adventure.pond()}

const interactButton=$('#interact');let secondaryTouchPointer=null;
interactButton.onpointerdown=e=>{secondaryTouchPointer=null;if(e.pointerType==='touch'&&!e.isPrimary&&!interactButton.disabled){secondaryTouchPointer=e.pointerId;e.preventDefault();interact()}};
interactButton.onclick=e=>{if(e.pointerType==='touch'&&e.pointerId===secondaryTouchPointer){secondaryTouchPointer=null;return}interact()};$('#journal').onclick=()=>{if(modal||!scene)return;if(scene.observing)scenery.album();else if(!scene.locked)journal()};$('#scenery').onclick=()=>{if(scene&&!modal&&(!scene.locked||scene.observing||romantic?.active&&!romantic.view?.editing))scenery.album()};
function invokeCore(item){const previous=current;current=typeof item==='string'?{id:item}:item;interact();current=previous}
function updateMusic(){const b=$('#music');b.innerHTML=icon('sound');b.classList.toggle('muted',!data.music);b.setAttribute('aria-label',data.music?T.musicOn:T.musicOff);b.setAttribute('aria-pressed',String(data.music))}
function startAudio(){audioUnlocked=true;startup.audioUnlocked=true;sound.resume()}
function chime(){sound.chime()}
$('#music').onclick=()=>{data.music=!data.music;startAudio();sound.enabled();save();updateMusic()};document.addEventListener('visibilitychange',()=>{controls.x=controls.y=0;scene&&(scene.target=null);save();if(document.hidden)sound.suspend();else if(audioUnlocked)sound.resume()});window.addEventListener('pagehide',save);window.addEventListener('blur',()=>{controls.x=controls.y=0;scene&&(scene.target=null)});
const stick=$('#joystick');let pointer=null;
const moveStick=e=>{if(pointer!==e.pointerId)return;const r=stick.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,l=Math.hypot(dx,dy),scale=Math.min(1,32/(l||1));controls.x=dx*scale/32;controls.y=dy*scale/32;$('#knob').style.transform=`translate(calc(-50% + ${dx*scale}px),calc(-50% + ${dy*scale}px))`};stick.onpointerdown=e=>{if(data.music)startAudio();e.preventDefault();e.stopPropagation();if(modal||scene?.locked&&!workshop?.active&&!adventure?.view&&!romantic?.active)return;pointer=e.pointerId;stick.setPointerCapture(pointer);moveStick(e)};stick.onpointermove=moveStick;const stopStick=()=>{pointer=null;controls.x=controls.y=0;$('#knob').style.transform='translate(-50%,-50%)'};stick.onpointerup=stopStick;stick.onpointercancel=stopStick;stick.onlostpointercapture=stopStick;
cleanView=new CleanView({
 canHide:()=>!!scene?.ready&&!modal&&!session?.returning&&!progress.exited&&!romantic?.view?.editing&&!$('.device').classList.contains('gift-playing'),
 getGame:()=>scene?.sys.game,busy:toast,
 walk:point=>{
  if(modal||scenery?.view)return;
  const active=romantic?.active?romantic.view:workshop?.active?workshop.view:adventure?.view||scene;
  if(!active||active.quiet||active.editing||active===scene&&scene.locked)return;
  const game=scene.sys.game,box=game.canvas.getBoundingClientRect(),p=active.cameras.main.getWorldPoint((point.x-box.x)*game.scale.gameSize.width/box.width,(point.y-box.y)*game.scale.gameSize.height/box.height);
  if(active.blocked?.(p.x,p.y))return;
  if(active.walkTo)active.walkTo({x:p.x,y:p.y});else{active.target={x:p.x,y:p.y};active.selected=null}
 },
 beforeHide:()=>{stopStick();for(const active of scene.sys.game.scene.getScenes(true)){active.input.keyboard?.resetKeys();if(active.stopMoving)active.stopMoving();else{active.target=null;active.selected=null;active.player?.anims?.stop()}}}
});
daily=new DailyWelcome({
 atManor:()=>!!scene?.ready&&!scene.room&&!scene.observing&&!scene.exploring&&!scene.inShop&&!scene.inRetreat,
 canShow:()=>!!scene?.ready&&!scene.locked&&!modal&&!session?.returning&&!progress.exited&&!gift?.active&&(!gift?.welcome||gift.welcome.classList.contains('hidden'))&&!cleanView?.hidden&&!scenery?.photoMode&&$('#dialogue').classList.contains('hidden'),
 reduced:()=>data.romance.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches
});
createGame(data,{save,hud,near,interact,mood:sound.mood,touch:item=>{if(item.kind==='core')invokeCore(item);else if(item.kind==='pond')lakeMenu();else adventure?.inspect(item)},worldFrame:()=>{adventure?.mapFrame();daily.tick()},time:()=>scenery?.updateTime(),ready:s=>{scene=s;scenery=new SceneryUI(s,data,{save,hud,show:openModal,close:closeModal,toast,chime,mood:sound.mood,fireworkSound:sound.firework,secret:id=>romantic?.secret(id),personal:()=>romantic?.gift(),isModal:()=>modal});adventure=new AdventureUI(s,data,{save,hud,show:openModal,close:closeModal,toast,chime,isModal:()=>modal,near,core:invokeCore,leaveSky:()=>scenery.leave()});scenery.adventure=adventure;workshop=lazyFeature(()=>import('./candy-ui.js'),m=>new m.CandyWorkshop(s,data,{save,hud,show:openModal,close:closeModal,toast,chime,isModal:()=>modal,near,wardrobe:()=>adventure.wardrobe()}),{scene:s,lock:setLock,close:closeModal});session=new SessionUI(s,data,progress,{save,show:openModal,close:closeModal,toast,isModal:()=>modal,block:v=>{modal=v;setLock(v)},welcome:()=>daily.beginVisit(),finishExit:()=>{if(workshop?.active)workshop.leave();if(romantic?.active)romantic.leave();if(scene.observing)scenery.leave();if(scene.exploring)adventure.leave();sound.suspend()}});romantic=lazyFeature(()=>import('./romantic-ui.js'),m=>new m.RomanticUI(s,data,{save,hud,show:openModal,close:closeModal,toast,chime,isModal:()=>modal,near,wardrobe:()=>adventure.wardrobe(),letter:()=>letter(true),view:(mode,point)=>scenery.enter(mode,false,point),photo:()=>scenery.photo(),rain:sound.rain,note:n=>sound.piano(n),enableMusic:()=>{data.music=true;sound.enabled();save();updateMusic()}}),{scene:s,lock:setLock,close:closeModal});const shortcuts=document.createElement('div');shortcuts.className='world-shortcuts';shortcuts.innerHTML=`<button id="world-wander">${R.wander}</button>`;$('.playfield').append(shortcuts);$('#world-wander').onclick=()=>{if(modal||scene.locked)return;openModal(`<article class="card world-destinations"><button id="wander-close" class="scenery-close">×</button><span class="eyebrow">${R.title}</span><h2>${R.wander}</h2><div class="button-stack"><button id="world-garden" class="primary">${R.garden}</button><button id="world-meadow" class="secondary">${MEADOW.title}</button><button id="world-cabin" class="secondary">${fmt(R.cabin)}</button><button id="world-lake" class="secondary">${R.lake}</button><button id="world-shop" class="secondary">${T.shop}</button></div></article>`);$('#wander-close').onclick=closeModal;for(const [id,fn]of [['world-garden',()=>romantic.enter('garden')],['world-meadow',()=>romantic.enter('meadow')],['world-cabin',()=>romantic.enter('cabin')],['world-lake',()=>scenery.enter(null,false,'lake')],['world-shop',candyShop]])$('#'+id).onclick=()=>{closeModal();fn()}};const giftApi={save,close:closeModal,block:v=>{modal=v;setLock(v)},isModal:()=>modal,welcomeDone:()=>daily.beginVisit(),gesture:startAudio,music:()=>{startAudio();sound.enabled();save();updateMusic()}};const early=!!startup.gift;if(early)gift.attach(s,giftApi);else gift=new GiftOpening(s,data,giftApi);warmFeatures([()=>workshop.preload(),()=>romantic.preload(),()=>scenery.preload(),()=>workshop.prewarm(data),()=>romantic.prewarm(data)],()=>!modal&&(!scene.locked||gift?.active&&gift.stage==='letter')&&!document.hidden);loadPocket().then(p=>{if(saveProtection().blocked)p?.recovery()});if(saveProtection().blocked){scene.openGate()}else if(early){}else if(data.accepted){scene.openGate();if(auroraReturn){romantic.returnPoint=auroraReturn;romantic.enter('meadow');daily.beginVisit({resume:true})}else session.entrance()}else gift.start()}});hud();
function loadPocket(){return pocketPromise??=import('./pwa-ui.js').then(({PocketManor})=>pocket=new PocketManor({
 data:()=>data,save,show:openModal,close:closeModal,toast,
 canNotify:()=>!!scene?.ready&&!scene.locked&&!modal&&!progress.exited&&!session?.returning&&!gift?.active&&!daily?.visible&&!cleanView?.hidden&&!document.hidden&&(!gift?.welcome||gift.welcome.classList.contains('hidden')),
 canUpdate:()=>!!scene?.ready&&!scene.room&&!scene.observing&&!scene.exploring&&!scene.inShop&&!scene.inRetreat&&!progress.exited&&!session?.returning&&!gift?.active&&(!modal||!!pocket?.opened),
 freeze:()=>{const exited=progress.exited;progress.exited=true;setLock(true);stopStick();sound.suspend();return()=>{progress.exited=exited;setLock(modal);if(audioUnlocked)sound.resume()}}
})).catch(()=>{pocketPromise=null;toast(PWA.failed);return null})}
// Expose read-only state for local browser verification; no profile leaves this device.
if(import.meta.env.DEV)window.__manor={get scene(){return scene},get data(){return structuredClone(data)},get scenery(){return scenery},get session(){return session},get adventure(){return adventure},get romantic(){return romantic},get workshop(){return workshop},get gift(){return gift}};

// A restored music preference is unlocked by a real gesture, never by page load.
document.addEventListener('pointerdown',()=>{if(data.accepted)startAudio()},{once:true,passive:true});
