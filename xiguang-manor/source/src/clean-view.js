import {CLEAN_VIEW as T} from './clean-view-config.js';

export class CleanView {
  constructor({canHide,beforeHide,getGame,busy,walk}) {
    this.api={canHide,beforeHide,getGame,busy,walk};
    this.hidden=false;
    this.elements=new Map();
    this.texts=new Map();
    this.host=document.querySelector('.playfield');
    this.canvasHost=document.querySelector('#game');
    this.button=document.querySelector('#hide-interface');
    this.button.title=T.hint;
    this.button.setAttribute('aria-label',T.hint);
    this.button.onclick=()=>this.hide();
    this.observer=new MutationObserver(()=>this.concealElements());
    this.beforeRender=()=>this.concealText();
    this.restorePointer=null;
    this.lastTap=null;
    this.consumeUntil=0;

    // Phaser also listens to legacy touch/mouse events. Pointer capture alone
    // does not stop those on Safari; consume the final compatibility events too.
    for(const type of ['touchstart','touchmove','touchend','touchcancel','mousedown','mousemove','mouseup','click']){
      this.canvasHost.addEventListener(type,e=>{
        if(!this.hidden&&performance.now()>=this.consumeUntil)return;
        if(e.cancelable)e.preventDefault();
        e.stopImmediatePropagation();
      },{capture:true,passive:false});
    }

    // Clean taps only walk. Both taps are kept out of normal Phaser actions,
    // so restoring cannot collect candy, open a star or trigger a shop panel.
    this.canvasHost.addEventListener('pointerdown',e=>{
      if(!this.hidden)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      this.down={x:e.clientX,y:e.clientY,id:e.pointerId};
      if(this.lastTap&&performance.now()-this.lastTap.time<360&&Math.hypot(e.clientX-this.lastTap.x,e.clientY-this.lastTap.y)<30)this.restorePointer=e.pointerId;
    },true);
    this.canvasHost.addEventListener('pointerup',e=>{
      if(!this.hidden)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if(this.restorePointer===e.pointerId){this.consumeUntil=performance.now()+450;this.show();return}
      if(this.down?.id===e.pointerId&&Math.hypot(e.clientX-this.down.x,e.clientY-this.down.y)<12){
        this.lastTap={time:performance.now(),x:e.clientX,y:e.clientY};
        this.api.walk({x:e.clientX,y:e.clientY});
      }
      this.down=null;
    },true);
    this.canvasHost.addEventListener('pointercancel',()=>{this.lastTap=null;this.restorePointer=null;this.down=null},true);
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.hidden){e.preventDefault();this.show()}},true);
  }

  hide(){
    if(this.hidden)return;
    if(!this.api.canHide()){this.api.busy(T.busy);return}
    this.api.beforeHide();
    this.hidden=true;
    this.lastTap=null;
    this.restorePointer=null;
    document.activeElement?.blur();
    document.body.classList.add('manor-clean');
    this.button.setAttribute('aria-pressed','true');
    this.concealElements();
    this.observer.observe(this.host,{childList:true});
    this.api.getGame()?.events.on('prerender',this.beforeRender);
    this.concealText();
  }

  concealElements(){
    if(!this.hidden)return;
    const roots=[...document.querySelectorAll('.topbar,.device-footer,.intro,.right-note'),...this.host.children].filter(e=>e.id!=='game');
    for(const element of roots){
      if(this.elements.has(element))continue;
      this.elements.set(element,{inert:element.inert,aria:element.getAttribute('aria-hidden')});
      element.inert=true;
      element.setAttribute('aria-hidden','true');
    }
  }

  concealText(){
    if(!this.hidden)return;
    const visit=node=>{
      if(node.type==='Text'||node.type==='BitmapText'){
        if(!this.texts.has(node))this.texts.set(node,node.alpha);
        node.setAlpha(0);
      }
      for(const child of node.list||[])visit(child);
    };
    for(const scene of this.api.getGame()?.scene.getScenes(true)||[])for(const object of scene.children.list)visit(object);
  }

  show(){
    if(!this.hidden)return;
    this.api.beforeHide();
    this.hidden=false;
    this.down=null;
    this.lastTap=null;
    this.restorePointer=null;
    this.observer.disconnect();
    this.api.getGame()?.events.off('prerender',this.beforeRender);
    document.body.classList.remove('manor-clean');
    this.button.setAttribute('aria-pressed','false');
    for(const [element,state]of this.elements){
      element.inert=state.inert;
      if(state.aria===null)element.removeAttribute('aria-hidden');else element.setAttribute('aria-hidden',state.aria);
    }
    for(const [object,alpha]of this.texts)if(object.scene)object.setAlpha(alpha);
    this.elements.clear();
    this.texts.clear();
  }
}
