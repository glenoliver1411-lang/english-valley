import {BOOT} from './boot-config.js';
import {CONFIG,T,fmt} from './config.js';
import {GIFT} from './gift-config.js';
import {GiftSky,envelopeGeometry,paintEnvelope} from './gift-art.js';
import {ManorAwakening} from './manor-awakening.js';

const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=key=>esc(fmt(GIFT.text[key]));
const HINT_KEY='xiguang-manor-first-hints-v1';

export class GiftOpening {
  constructor(manor,data,api) {
    this.manor=manor;this.data=data;this.api=api;this.active=false;this.raf=0;
    this.root=document.createElement('section');this.root.id='gift-opening';this.root.className='hidden';
    this.welcome=document.createElement('div');this.welcome.id='gift-welcome';this.welcome.className='hidden';this.welcome.setAttribute('aria-live','polite');
    this.tip=document.createElement('div');this.tip.id='first-visit-tip';this.tip.setAttribute('role','status');
    $('.playfield').append(this.root,this.welcome,this.tip);
    try{this.hints=JSON.parse(localStorage.getItem(HINT_KEY))||{enabled:false,seen:[]}}catch{this.hints={enabled:false,seen:[]}}
    if(typeof this.hints!=='object'||Array.isArray(this.hints))this.hints={enabled:false,seen:[]};
    if(!Array.isArray(this.hints.seen))this.hints.seen=[];
    this.resize=new ResizeObserver(()=>{if(this.active&&!this.awakening)this.resizeCanvas()});this.resize.observe($('.playfield'));
    this.onKey=e=>{if(!this.active)return;if(e.key==='Escape'){e.preventDefault();this.skip()}else if(e.key==='Tab'){
      this.root.classList.add('gift-keyboard');
      const buttons=[...this.root.querySelectorAll('button:not(:disabled),input')].filter(el=>el.getClientRects().length);
      const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
    }};document.addEventListener('keydown',this.onKey);
  }
  attach(manor,api){this.manor=manor;this.api=api;const action=this.pendingAction;this.pendingAction=null;document.querySelector('#gift-engine-wait')?.remove();if(action)this[action]()}
  waitForWorld(action){if(this.manor.ready)return false;this.pendingAction=action;let note=document.querySelector('#gift-engine-wait');if(!note){note=document.createElement('p');note.id='gift-engine-wait';note.setAttribute('role','status');this.root.append(note)}note.textContent=BOOT.initializing;return true}
  get reduced(){return this.reduceOverride??(this.data.romance.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches)}
  start(replay=false) {
    if(this.active)return;
    if(!replay&&!this.data.accepted&&matchMedia('(prefers-reduced-motion: reduce)').matches)this.data.romance.reducedMotion=true;
    this.replay=replay;this.active=true;this.stage='envelope';this.time=0;this.stageTime=0;this.lastStamp=0;this.lastDraw=0;
    this.awakening=null;this.api.close();this.api.block(true);this.hideWelcome();this.tip.classList.remove('show');
    $('.device').classList.add('gift-playing');this.root.className=`gift-opening${this.reduced?' gift-still':''}`;this.root.dataset.stage=this.stage;
    this.root.setAttribute('role','dialog');this.root.setAttribute('aria-modal','true');this.root.setAttribute('aria-label',T.letterTitle);
    this.root.innerHTML=`<canvas aria-hidden="true"></canvas><div class="gift-toolbar"><label><input id="gift-reduced" type="checkbox" ${this.reduced?'checked':''}><span>${text('reduced')}</span></label><button id="skip-gift">${text('skip')}</button></div><header class="gift-heading"><span>${text('tag')}</span><h1>${text('heading')}</h1></header><button id="gift-envelope" aria-label="${text('open')}"><span>${text('envelope')}</span></button><div class="gift-invitation"><p>${text('touch')}</p><button id="gift-music">${text(this.data.music?'musicOn':'music')}</button></div><div id="gift-letter" class="gift-letter hidden"></div><p class="gift-awakening-note">${text('awakening')}</p>`;
    this.canvas=this.root.querySelector('canvas');this.resizeCanvas();
    $('#gift-envelope').onclick=()=>this.openEnvelope();$('#skip-gift').onclick=()=>this.skip();
    $('#gift-music').onclick=()=>{this.data.music=!this.data.music;this.api.music();$('#gift-music').textContent=fmt(GIFT.text[this.data.music?'musicOn':'music'])};
    $('#gift-reduced').onchange=e=>{this.reduceOverride=e.target.checked;this.data.romance.reducedMotion=e.target.checked;this.root.classList.toggle('gift-still',this.reduced);this.api.save();if(this.stage==='unfolding')this.readLetter();if(this.awakening)this.awakening.finish()};
    $('#gift-envelope').focus({preventScroll:true});this.draw();performance.mark('manor-envelope-interactive');this.raf=requestAnimationFrame(stamp=>this.tick(stamp));
  }
  resizeCanvas() {
    if(!this.canvas)return;
    const height=Math.round($('.playfield').clientHeight/Math.max(1,$('.playfield').clientWidth)*432);
    if(this.sky&&this.canvas.width===432&&this.canvas.height===height)return;
    this.canvas.width=432;this.canvas.height=height;
    this.sky=new GiftSky(432,this.canvas.height);const geo=envelopeGeometry(this.canvas.height);
    const button=$('#gift-envelope');if(button){button.style.top=`${geo.y/this.canvas.height*100}%`;button.style.height=`${geo.h/this.canvas.height*100}%`}
    this.draw();
  }
  openEnvelope() {
    if(this.stage!=='envelope')return;
    this.api.gesture();this.stage='unfolding';this.stageTime=0;this.root.dataset.stage=this.stage;
    $('#gift-envelope').disabled=true;$('#skip-gift').textContent=fmt(GIFT.text.unfoldSkip);$('#skip-gift').focus({preventScroll:true});
    if(this.reduced)this.readLetter();
  }
  readLetter() {
    if(!this.active||this.stage==='awakening')return;
    this.stage='letter';this.root.dataset.stage=this.stage;
    const paper=$('#gift-letter');paper.classList.remove('hidden');
    paper.innerHTML=`<article aria-label="${esc(T.letterTitle)}"><span class="gift-letter-tag">${esc(T.letterTag)}</span><h2>${esc(fmt(T.salutation))}</h2><p>${esc(CONFIG.letter).replaceAll('\n','<br>')}</p><div class="gift-letter-sign">${esc(T.signature)}</div><button id="accept" class="primary">${esc(T.accept)}</button><small>${esc(CONFIG.edition)}</small></article>`;
    $('#skip-gift').textContent=fmt(GIFT.text.skip);$('#accept').onclick=()=>this.accept();$('#accept').focus({preventScroll:true});
  }
  commitAcceptance() {
    if(!this.data.accepted){this.data.accepted=true;this.api.save();this.hints.enabled=true;this.storeHints()}
  }
  accept() {
    if(!this.active||this.stage==='awakening')return;
    this.api.gesture();this.commitAcceptance();if(this.waitForWorld('accept'))return;this.stage='awakening';this.root.dataset.stage=this.stage;
    $('#gift-letter').classList.add('gift-letter-leaving');
    $('#skip-gift').textContent=fmt(GIFT.text.skip);$('#skip-gift').focus({preventScroll:true});
    this.awakening=new ManorAwakening(this.manor,{reduced:this.reduced,done:()=>this.finish()});
  }
  skip() {
    if(!this.active)return;
    this.api.gesture();
    if(this.stage==='unfolding'){this.readLetter();return}
    this.commitAcceptance();if(this.waitForWorld('skip'))return;
    if(this.awakening)this.awakening.finish();else this.finish();
  }
  tick(stamp) {
    if(!this.active)return;
    const dt=this.lastStamp?Math.min(.08,(stamp-this.lastStamp)/1000):0;this.lastStamp=stamp;
    if(!document.hidden){this.time+=dt;this.stageTime+=dt;if(this.stage==='unfolding'&&this.stageTime>=GIFT.timing.unfold)this.readLetter();
      if(stamp-this.lastDraw>1000/(this.data.scenery.lowEffects?15:30)){this.lastDraw=stamp;this.draw()}}
    this.raf=requestAnimationFrame(next=>this.tick(next));
  }
  draw() {
    if(!this.canvas||!this.sky||this.stage==='awakening')return;
    const c=this.canvas.getContext('2d');this.sky.draw(c,this.time,{still:this.reduced,low:this.data.scenery.lowEffects});
    if(this.stage==='envelope'||this.stage==='unfolding')paintEnvelope(c,envelopeGeometry(this.canvas.height,this.stage==='unfolding'?this.stageTime/GIFT.timing.unfold:0,this.time,this.reduced));
  }
  finish() {
    if(!this.active)return;
    this.active=false;cancelAnimationFrame(this.raf);this.raf=0;
    if(!this.awakening){this.manor.gates.forEach((gate,i)=>gate.setPosition(i?255:187,754).setScale(.25,1))}
    this.root.className='hidden';this.root.innerHTML='';this.root.removeAttribute('aria-modal');this.canvas=null;this.sky=null;this.awakening=null;
    $('.device').classList.remove('gift-playing');this.api.block(false);performance.mark('manor-free');
    if(!this.replay)this.api.save();this.showWelcome();
    $('#joystick').setAttribute('tabindex','0');$('#joystick').focus({preventScroll:true});
  }
  showWelcome() {
    this.hideWelcome();const a=fmt(GIFT.text.welcome),b=fmt(GIFT.text.welcomeLine);
    this.welcomeLabels=[...this.manor.labels,this.manor.environment.label].map(label=>({label,visible:label.visible}));
    this.welcomeLabels.forEach(({label})=>label.setVisible(false));
    this.welcome.innerHTML='<p></p><span></span><small></small>';this.welcome.className=`gift-welcome${this.reduced?' gift-welcome-still':''}`;
    const p=this.welcome.querySelector('p'),span=this.welcome.querySelector('span');let n=0;
    const letters=[...a,...b];
    const frame=()=>{n++;p.textContent=a.slice(0,Math.min(n,a.length));span.textContent=b.slice(0,Math.max(0,n-a.length-4));if(n>=letters.length+4){clearInterval(this.welcomeType);this.welcome.querySelector('small').textContent=GIFT.text.free}};
    if(this.reduced){p.textContent=a;span.textContent=b;this.welcome.querySelector('small').textContent=GIFT.text.free}else this.welcomeType=setInterval(frame,57);
    this.welcomeEnd=setTimeout(()=>{this.hideWelcome();if(!this.replay)this.api.welcomeDone?.()},GIFT.timing.welcome*1000);this.nextHint=Date.now()+8000;
  }
  hideWelcome() {clearInterval(this.welcomeType);clearTimeout(this.welcomeEnd);this.welcome.className='hidden';this.welcomeLabels?.forEach(({label,visible})=>label.setVisible(visible));this.welcomeLabels=null}
  hint(item) {
    if(!this.hints.enabled||!item||this.active||this.api.isModal()||this.manor.locked||this.manor.observing||this.manor.exploring||Date.now()<(this.nextHint||0))return;
    const line=GIFT.text.tips[item.id];if(!line||this.hints.seen.includes(item.id))return;
    this.hints.seen.push(item.id);this.storeHints();this.nextHint=Date.now()+11000;
    this.tip.textContent=line;this.tip.classList.add('show');clearTimeout(this.tipTimer);this.tipTimer=setTimeout(()=>this.tip.classList.remove('show'),4800);
  }
  storeHints(){try{localStorage.setItem(HINT_KEY,JSON.stringify(this.hints))}catch{}}
}
