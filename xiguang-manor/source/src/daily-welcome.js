import {DAILY_WELCOME as C} from './daily-welcome-config.js';
import {DailyWelcomeGate,dailyWelcome} from './daily-welcome-model.js';
import {welcomeIcon} from './daily-welcome-art.js';

export class DailyWelcome{
  constructor(api){
    this.api=api;this.gate=new DailyWelcomeGate();this.visible=false;this.lastCheck=0;this.lastAtManor=false;
    this.root=document.createElement('section');this.root.id='daily-welcome';this.root.className='daily-welcome hidden';this.root.setAttribute('role','status');this.root.setAttribute('aria-live','polite');
    document.querySelector('.playfield').append(this.root);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)this.dismiss(true);else{this.gate.foreground(new Date(),this.api.atManor());this.tick(true)}});
    window.addEventListener('pageshow',e=>{if(e.persisted){this.gate.foreground(new Date(),this.api.atManor());this.tick(true)}});
  }
  beginVisit({resume=false}={}){
    let lastDay=null;try{lastDay=sessionStorage.getItem(C.sessionKey)}catch{}
    this.gate.start(new Date(),{resume,lastDay});this.tick(true);
  }
  tick(force=false){
    const atManor=this.api.atManor(),now=performance.now();
    if(!force&&now-this.lastCheck<250&&atManor===this.lastAtManor)return;
    this.lastCheck=now;this.lastAtManor=atManor;
    const canShow=this.api.canShow();if(this.visible&&(!atManor||!canShow))this.dismiss(true);
    if(this.gate.update(new Date(),{atManor,canShow}))this.show();
  }
  show(){
    this.dismiss(true);const message=dailyWelcome(new Date());this.gate.shownDay=message.key;this.visible=true;
    this.root.className='daily-welcome'+(this.api.reduced()?' still':'');
    const card=document.createElement('button');card.type='button';card.className='daily-welcome-card';card.dataset.phase=message.phase;card.dataset.day=message.key;
    card.innerHTML=`<span class="daily-welcome-header"><span class="daily-welcome-icon">${welcomeIcon(message.phase)}</span><span><strong class="daily-welcome-title"></strong><span class="daily-welcome-date"><time></time><span></span></span></span></span><span class="daily-welcome-greeting"></span><span class="daily-welcome-note"></span><span class="daily-welcome-dismiss"></span>`;
    card.querySelector('.daily-welcome-title').textContent=message.title;
    const date=card.querySelector('time');date.dateTime=message.key;date.textContent=message.date;
    card.querySelector('.daily-welcome-date>span').textContent=message.weekday+' · '+message.phaseName;
    card.querySelector('.daily-welcome-greeting').textContent=message.greeting;card.querySelector('.daily-welcome-note').textContent=message.note;card.querySelector('.daily-welcome-dismiss').textContent=C.dismiss;
    card.onclick=()=>this.dismiss();this.root.replaceChildren(card);
    try{sessionStorage.setItem(C.sessionKey,message.key)}catch{}
    this.timer=setTimeout(()=>this.dismiss(),C.duration);
  }
  dismiss(immediate=false){
    clearTimeout(this.timer);clearTimeout(this.fadeTimer);this.visible=false;
    const clear=()=>{this.root.className='daily-welcome hidden';this.root.replaceChildren()};
    if(immediate||this.api.reduced())clear();else{this.root.classList.add('leaving');this.fadeTimer=setTimeout(clear,C.fade)}
  }
}
