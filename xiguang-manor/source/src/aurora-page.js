import {preloadPlay,installPlay} from './play-assets.js';
import Phaser from 'phaser';
import './aurora-page.css';
import {AURORA_PAGE as A} from './aurora-config.js';
import {preloadV5,installV5} from './v5-assets.js';
import {auroraMeadowPainting} from './aurora-meadow-art.js';
import {AuroraCurtains} from './aurora.js';
import {Starlight,paintCloud} from './starlight.js';
import {LakesideActors} from './lakeside-actors.js';
import {mix} from './sky-model.js';
import {load} from './save.js';
import {createSoundscape} from './soundscape.js';
import {CONFIG} from './config.js';

const profile=load(),app=document.querySelector('#aurora-app');
const fromWorld=new URLSearchParams(location.search).get('from')==='world';
const prefers=matchMedia('(prefers-reduced-motion: reduce)');let paused=profile.romance.reducedMotion||prefers.matches,quiet=false,audioUnlocked=false,scene,photoURL;
try{const saved=JSON.parse(localStorage.getItem(A.key));if(typeof saved?.paused==='boolean')paused=paused||saved.paused}catch{}
const sound=createSoundscape(profile);sound.mood(0,true);
document.title=A.title+' · '+CONFIG.title;
app.innerHTML=`<div id="aurora-canvas" role="img" aria-label="${A.photoAlt}"></div><header class="aurora-heading"><small>${A.tag}</small><h1>${A.title}</h1><p>${A.line}</p></header><nav class="aurora-top"><button id="aurora-pause" aria-pressed="${paused}"></button><button id="aurora-music"></button><button id="aurora-replay">${A.replay}</button></nav><footer class="aurora-bottom"><p class="aurora-note">${A.note}</p><a id="aurora-back" class="button" href="./index.html?return=${fromWorld?'world-aurora':'meadow'}">${fromWorld?'回到庄园':A.back}</a><button id="aurora-photo">${A.photo}</button><button id="aurora-quiet" aria-pressed="false">${A.quiet}</button></footer><div id="aurora-loading" role="status">${A.loading}</div><dialog id="aurora-photo-dialog" class="aurora-photo"><h2>${A.photoTitle}</h2><p>${A.photoHint}</p><img id="aurora-preview" alt="${A.photoAlt}"><footer><a id="aurora-download" class="button" download="${A.title}.png">${A.download}</a><button id="aurora-photo-close">${A.close}</button></footer></dialog>`;
const $=s=>document.querySelector(s),updateButtons=()=>{$('#aurora-pause').textContent=paused?A.play:A.pause;$('#aurora-pause').setAttribute('aria-pressed',String(paused));$('#aurora-music').textContent=profile.music?A.musicOff:A.musicOn;$('#aurora-music').setAttribute('aria-pressed',String(profile.music))};updateButtons();
$('#aurora-pause').onclick=()=>{paused=!paused;try{localStorage.setItem(A.key,JSON.stringify({paused}))}catch{}updateButtons();scene?.frame()};
$('#aurora-music').onclick=()=>{profile.music=!profile.music;sound.enabled();updateButtons()};
function setQuiet(value){quiet=value;app.classList.toggle('quiet',quiet);for(const part of ['.aurora-heading','.aurora-top','.aurora-bottom']){$(part).inert=quiet;$(part).setAttribute('aria-hidden',String(quiet))}$('#aurora-quiet').setAttribute('aria-pressed',String(quiet))}
$('#aurora-quiet').setAttribute('title',A.cleanHint);$('#aurora-quiet').onclick=()=>setQuiet(true);
let lastTap=null;$('#aurora-canvas').addEventListener('pointerup',e=>{if(!quiet)return;const now=performance.now();if(lastTap&&now-lastTap.time<360&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<30){setQuiet(false);lastTap=null}else lastTap={time:now,x:e.clientX,y:e.clientY}});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&quiet)setQuiet(false)});
$('#aurora-replay').onclick=()=>{if(scene){paused=false;updateButtons();scene.elapsed=0;scene.frame()}};
const dialog=$('#aurora-photo-dialog');
const photoError=()=>{let note=$('#aurora-error');if(!note){note=document.createElement('p');note.id='aurora-error';note.setAttribute('role','status');note.className='aurora-note';$('.aurora-bottom').prepend(note)}note.textContent=A.photoFailed};
$('#aurora-photo-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{if(photoURL){URL.revokeObjectURL(photoURL);photoURL=null}});
$('#aurora-photo').onclick=()=>{
 if(!scene?.texture)return;scene.frame();const source=scene.texture.getSourceImage(),out=document.createElement('canvas');out.width=864;out.height=source.height*2;const c=out.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(source,0,0,out.width,out.height);
 try{out.toBlob(blob=>{if(!blob){photoError();return}if(photoURL)URL.revokeObjectURL(photoURL);photoURL=URL.createObjectURL(blob);$('#aurora-preview').src=photoURL;$('#aurora-download').href=photoURL;dialog.showModal()},'image/png')}catch{photoError()}
};
document.addEventListener('pointerdown',()=>{audioUnlocked=true;sound.resume()},{once:true,passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)sound.suspend();else if(audioUnlocked)sound.resume()});window.addEventListener('pagehide',()=>{sound.suspend();if(photoURL)URL.revokeObjectURL(photoURL)});
const viewport=()=>({width:432,height:Math.round(432*app.clientHeight/app.clientWidth)});

class AuroraMeadowScene extends Phaser.Scene{
 constructor(){super('flower-aurora');this.elapsed=paused?27:0;this.low=profile.scenery.lowEffects;this.slow=0;this.accumulator=0}
 preload(){preloadV5(this);preloadPlay(this);this.load.on('loaderror',()=>{$('#aurora-loading').textContent=A.failed})}
 create(){installV5(this);installPlay(this);scene=this;this.actors=new LakesideActors();this.build();this.scale.on('resize',this.build,this);$('#aurora-loading').remove();this.events.once('shutdown',()=>{this.scale.off('resize',this.build,this);this.release();this.actors.clear()})}
 release(){this.paint?.destroy();this.aurora?.destroy();if(this.textures.exists('flower-aurora-canvas'))this.textures.remove('flower-aurora-canvas')}
 build(){this.release();this.w=432;this.h=this.scale.gameSize.height;this.texture=this.textures.createCanvas('flower-aurora-canvas',this.w,this.h);this.ctx=this.texture.getContext();this.ctx.imageSmoothingEnabled=false;this.paint=this.add.image(0,0,'flower-aurora-canvas').setOrigin(0);this.art=auroraMeadowPainting(this.w,this.h);this.aurora=new AuroraCurtains(this.w/2,this.h/2);this.stars=new Starlight(this.w/2,this.h/2);this.cloud=paintCloud(8);this.sky=document.createElement('canvas');this.sky.width=this.w;this.sky.height=this.h;const c=this.sky.getContext('2d');for(let y=0;y<this.h;y++){c.fillStyle=mix('#0c142b','#34334d',Math.min(1,y/(this.h*.65)));c.fillRect(0,y,this.w,1)}this.frame()}
 update(_,delta){if(document.hidden||dialog.open)return;if(delta>44)this.slow++;else this.slow=Math.max(0,this.slow-.2);if(this.slow>75)this.low=true;const dt=Math.min(delta,100)/1000;if(!paused)this.elapsed+=dt;this.accumulator+=dt;if(this.accumulator>=1/(this.low?A.lowFps:A.maxFps)){this.accumulator=0;this.frame()}}
 frame(){if(!this.ctx)return;const c=this.ctx,t=this.elapsed,w=this.w,h=this.h;c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.drawImage(this.sky,0,0);
  // No galaxy, meteor shower or fireworks are mixed into this quiet page.
  c.save();c.scale(2,2);this.aurora.draw(c,{time:t,night:1,reveal:1,strength:A.strength,low:this.low,still:false});this.stars.draw(c,{time:t,night:.72,reveal:1,reduced:this.low});c.restore();
  c.fillStyle='#ead9b7';for(let y=-12;y<=12;y++)for(let x=-12;x<=12;x++)if(x*x+y*y<144&&(x-5)**2+(y+3)**2>110)c.fillRect(w*.84+x,h*.25+y,1,1);
  for(let i=0;i<(this.low?2:3);i++){c.globalAlpha=.16;c.drawImage(this.cloud,((i*173+t*(.5+i*.17))%(w+240))-120,h*(.35+i*.07),220,36)}c.globalAlpha=1;c.drawImage(this.art.back,0,0);
  const {seat,bench,actor}=this.art;c.drawImage(this.actors.girl(profile,'night'),actor.x,actor.y,actor.w,actor.h);c.drawImage(this.actors.cat('night','sleep'),seat.x+89,bench.y+77,37,26);c.drawImage(this.art.rail,bench.x,bench.y);
  c.drawImage(this.art.front,0,0);for(const [i,s]of this.art.sprigs.entries()){c.save();c.translate(s.x,s.y);c.rotate(paused?0:Math.sin(t*.45-s.y*.01+s.phase)*.026);c.drawImage(s.im,-s.width/2,-s.height,s.width,s.height);c.restore()}
  if(!this.low)for(let i=0;i<7;i++){const x=25+i*71%390+Math.sin(t*.17+i)*6,y=this.art.ground+38+i*53%Math.max(60,h-this.art.ground-50),alpha=.08+.24*Math.sin(t*.39+i*1.7)**6;c.fillStyle='#d7ddb2';c.globalAlpha=alpha;c.fillRect(Math.round(x),Math.round(y),1,1)}c.globalAlpha=1;this.texture.refresh();
 }
}
const game=new Phaser.Game({type:Phaser.CANVAS,parent:'aurora-canvas',...viewport(),backgroundColor:'#10172c',pixelArt:true,antialias:false,render:{roundPixels:true},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},audio:{noAudio:true},scene:AuroraMeadowScene});
new ResizeObserver(()=>{const v=viewport();if(v.height!==game.scale.gameSize.height)game.scale.resize(v.width,v.height)}).observe(app);
if(import.meta.env.DEV)window.__aurora={get scene(){return scene},get paused(){return paused},setQuiet,seek:t=>{scene.elapsed=t;scene.frame()}};

// Use the same narrowly scoped offline release; no update or install overlays interrupt the sky.
if(import.meta.env.PROD)import('./pwa-service.js').then(({offlineManor})=>offlineManor.start());
