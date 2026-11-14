import Phaser from 'phaser';
import originalPhoto from './assets/aurora-original/scene.webp';
import {AuroraPhotoScene} from './aurora-photo-scene.js';
import './aurora-page.css';
import {AURORA_PAGE as A} from './aurora-config.js';
import {load} from './save.js';
import {createSoundscape} from './soundscape.js';
import {CONFIG} from './config.js';

const profile=load(),app=document.querySelector('#aurora-app');
const fromWorld=new URLSearchParams(location.search).get('from')==='world';
const prefers=matchMedia('(prefers-reduced-motion: reduce)');let paused=profile.romance.reducedMotion||prefers.matches,quiet=false,audioUnlocked=false,scene,photoURL;
try{const saved=JSON.parse(localStorage.getItem(A.key));if(typeof saved?.paused==='boolean')paused=paused||saved.paused}catch{}
const requestedPlay=new URLSearchParams(location.search).get('play')==='1';
if(requestedPlay&&!prefers.matches&&!profile.romance.reducedMotion)paused=false;
if(paused&&document.querySelector('#aurora-plate'))document.querySelector('#aurora-plate').src=originalPhoto;
const sound=createSoundscape(profile);sound.mood(0,true);
document.title=A.title+' · '+CONFIG.title;
app.insertAdjacentHTML('beforeend',`<div id="aurora-canvas" role="img" aria-label="${A.photoAlt}"></div><header class="aurora-heading"><small>${A.tag}</small><h1>${A.title}</h1><p>${A.line}</p></header><details id="aurora-options" class="aurora-bottom"><summary>风景选项<span>＋</span></summary><div class="aurora-options-card"><nav class="aurora-top"><button id="aurora-pause" aria-pressed="${paused}"></button><button id="aurora-music"></button><button id="aurora-replay">${A.replay}</button></nav><p id="aurora-phase" class="aurora-note" role="status" aria-live="polite"></p><p class="aurora-note">${A.note}</p><button id="aurora-skip">${A.skip}</button><a id="aurora-back" class="button" href="./index.html?return=${fromWorld?'world-aurora':'meadow'}">${fromWorld?'回到庄园':A.back}</a><button id="aurora-framing">看完整原画</button><button id="aurora-photo">${A.photo}</button><button id="aurora-quiet" aria-pressed="false">${A.quiet}</button></div></details><div id="aurora-loading" role="status">${A.loading}</div><dialog id="aurora-photo-dialog" class="aurora-photo"><h2>${A.photoTitle}</h2><p>${A.photoHint}</p><img id="aurora-preview" alt="${A.photoAlt}"><footer><a id="aurora-download" class="button" download="${A.title}.png">${A.download}</a><button id="aurora-photo-close">${A.close}</button></footer></dialog>`);
const $=s=>document.querySelector(s),updateButtons=()=>{$('#aurora-pause').textContent=paused?A.play:A.pause;$('#aurora-pause').setAttribute('aria-pressed',String(paused));$('#aurora-music').textContent=profile.music?A.musicOff:A.musicOn;$('#aurora-music').setAttribute('aria-pressed',String(profile.music))};updateButtons();
$('#aurora-pause').onclick=()=>{paused=!paused;try{localStorage.setItem(A.key,JSON.stringify({paused}))}catch{}updateButtons();scene?.frame()};
$('#aurora-music').onclick=()=>{profile.music=!profile.music;sound.enabled();updateButtons()};
function setQuiet(value){quiet=value;app.classList.toggle('quiet',quiet);for(const part of ['.aurora-heading','.aurora-bottom']){$(part).inert=quiet;$(part).setAttribute('aria-hidden',String(quiet))}$('#aurora-quiet').setAttribute('aria-pressed',String(quiet))}
$('#aurora-quiet').setAttribute('title',A.cleanHint);$('#aurora-quiet').onclick=()=>setQuiet(true);
let lastTap=null;$('#aurora-canvas').addEventListener('pointerup',e=>{if(!quiet)return;const now=performance.now();if(lastTap&&now-lastTap.time<360&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<30){setQuiet(false);lastTap=null}else lastTap={time:now,x:e.clientX,y:e.clientY}});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&quiet)setQuiet(false)});
$('#aurora-framing').onclick=()=>{if(scene){scene.complete=!scene.complete;scene.resize();$('#aurora-framing').textContent=scene.complete?'铺满屏幕':'看完整原画'}};
$('#aurora-replay').onclick=()=>{if(scene){paused=false;try{localStorage.setItem(A.key,JSON.stringify({paused:false}))}catch{}updateButtons();scene.replay()}};
$('#aurora-skip').onclick=()=>scene?.skip();
const dialog=$('#aurora-photo-dialog');
const photoError=()=>{let note=$('#aurora-error');if(!note){note=document.createElement('p');note.id='aurora-error';note.setAttribute('role','status');note.className='aurora-note';$('.aurora-bottom').prepend(note)}note.textContent=A.photoFailed};
$('#aurora-photo-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{if(photoURL){URL.revokeObjectURL(photoURL);photoURL=null}});
$('#aurora-photo').onclick=()=>{
 if(!scene?.base)return;scene.frame();const out=scene.photo();
 try{out.toBlob(blob=>{if(!blob){photoError();return}if(photoURL)URL.revokeObjectURL(photoURL);photoURL=URL.createObjectURL(blob);$('#aurora-preview').src=photoURL;$('#aurora-download').href=photoURL;dialog.showModal()},'image/png')}catch{photoError()}
};
document.addEventListener('pointerdown',()=>{audioUnlocked=true;sound.resume()},{once:true,passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)sound.suspend();else if(audioUnlocked)sound.resume()});window.addEventListener('pagehide',()=>{sound.suspend();if(photoURL)URL.revokeObjectURL(photoURL)});
const density=Math.min(3,window.devicePixelRatio||1),viewport=()=>({width:Math.round(app.clientWidth*density),height:Math.round(app.clientHeight*density)});
const game=new Phaser.Game({type:Phaser.AUTO,parent:'aurora-canvas',...viewport(),backgroundColor:'#03112c',pixelArt:false,antialias:true,render:{roundPixels:false},scale:{mode:Phaser.Scale.NONE},audio:{noAudio:true},scene:new AuroraPhotoScene(profile,{paused:()=>paused,sequence:p=>{app.dataset.auroraPhase=p.phase;const line=$('#aurora-phase');if(line)line.textContent=A.phases[p.phase]||''},dialogOpen:()=>dialog.open,failed:()=>{const loading=$('#aurora-loading');if(loading)loading.textContent=A.failed},ready:s=>{scene=s;$('#aurora-loading')?.remove();$('#aurora-plate')?.remove()}})});
new ResizeObserver(()=>{const v=viewport();if(v.width!==game.scale.gameSize.width||v.height!==game.scale.gameSize.height)game.scale.resize(v.width,v.height)}).observe(app);
if(import.meta.env.DEV)window.__aurora={get scene(){return scene},get paused(){return paused},setQuiet,seek:t=>{scene.elapsed=t;scene.frame()}};
if(import.meta.env.PROD)import('./pwa-service.js').then(({offlineManor})=>offlineManor.start());
