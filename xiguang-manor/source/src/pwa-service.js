// Workbox owns precaching. This small client only coordinates consent,
// exact-scope registration and a positive, resource-by-resource cache audit.
export const APP_VERSION=__APP_VERSION__;
export const PWA_SCOPE=new URL(import.meta.env.BASE_URL,location.href).href;
const script=new URL('sw.js',PWA_SCOPE).href;
export function workerMessage(worker,type,extra={}){
 return new Promise((resolve,reject)=>{if(!worker)return reject(Error('worker unavailable'));const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();reject(Error('worker timeout'))},type==='PWA_STATUS'?6000:45000);channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();resolve(e.data)};worker.postMessage({type,...extra},[channel.port2])});
}
export class OfflineManor{
 constructor(){this.state={supported:'serviceWorker'in navigator&&isSecureContext,phase:'preparing',ready:false,waiting:false};this.listeners=new Set();this.watchers=new WeakSet();this.registration=null;this.reloading=false;this.installPrompt=null;this.started=false;this.onInstall=e=>{e.preventDefault();this.installPrompt=e;this.emit()};window.addEventListener('beforeinstallprompt',this.onInstall);window.addEventListener('appinstalled',()=>{this.installPrompt=null;this.emit()})}
 subscribe(fn){this.listeners.add(fn);fn(this.state);return()=>this.listeners.delete(fn)}
 emit(){document.documentElement.dataset.offlineReady=String(this.state.ready);document.documentElement.dataset.offlineVersion=this.state.audit?.version||'';for(const fn of this.listeners)fn(this.state)}
 valid(reg){return reg?.scope===PWA_SCOPE&&(!reg.active||reg.active.scriptURL===script)}
 async clearFailedInstall(){const reg=await navigator.serviceWorker.getRegistration(PWA_SCOPE);if(reg?.scope===PWA_SCOPE&&(reg.active||reg.installing||reg.waiting))return;const prefix='xiguang-precache::'+PWA_SCOPE+'::',mark=new URL('__offline_version__',PWA_SCOPE).href;for(const name of(await caches.keys()).filter(n=>n.startsWith(prefix))){const cache=await caches.open(name);if(!await cache.match(mark))await caches.delete(name)}}
 async start(){if(this.started)return;this.started=true;if(!import.meta.env.PROD){this.state.phase='dev';return this.emit()}if(!this.state.supported){this.state.phase='unsupported';return this.emit()}
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(this.reloading){this.finishUpdate();return}this.audit().catch(()=>{});this.recheckActivation()});
  window.addEventListener('online',()=>this.check().catch(()=>{}));
  try{
   const old=await navigator.serviceWorker.getRegistration(PWA_SCOPE);if(this.valid(old)){this.observe(old);if(old.active)await this.audit()}
   if(navigator.onLine||!this.registration){if(!this.registration?.active&&!this.registration?.installing&&!this.registration?.waiting)await this.clearFailedInstall();const reg=await navigator.serviceWorker.register(script,{scope:PWA_SCOPE,updateViaCache:'none'});if(!this.valid(reg))throw Error('scope');this.observe(reg);if(reg.active)await this.audit();if(navigator.onLine&&this.state.audit?.version&&this.state.audit.version!==APP_VERSION)await reg.update()}
  }catch{if(!this.state.ready)this.state.phase='failed';this.emit()}this.recheckActivation();
 }
 recheckActivation(){if(this.activationChecks)return;this.activationChecks=true;for(const delay of [1000,4000,9000])setTimeout(()=>{if(!this.state.ready&&this.registration?.active)this.audit().catch(()=>{})},delay)}
 observe(reg){this.registration=reg;this.state.waiting=!!reg.waiting;if(this.watchers.has(reg)){this.emit();return}this.watchers.add(reg);
  const watch=sw=>{if(!sw||this.watchers.has(sw))return;this.watchers.add(sw);sw.addEventListener('statechange',()=>{this.state.waiting=!!reg.waiting;if(sw.state==='activated')this.audit().catch(()=>{});if(sw.state==='installed'){this.state.waiting=!!reg.waiting;setTimeout(()=>{this.state.waiting=!!reg.waiting;this.emit()},0)}if(sw.state==='redundant'&&!this.state.ready)this.state.phase='failed';this.emit()})};
  reg.addEventListener('updatefound',()=>watch(reg.installing));watch(reg.installing);watch(reg.active);watch(reg.waiting);this.emit();
 }
 async audit(){const active=this.registration?.active;if(!active||active.state!=='activated')return;try{let result=await workerMessage(active,'PWA_STATUS');if(result.scope===PWA_SCOPE&&!result.complete&&navigator.onLine){try{this.repairing??=workerMessage(active,'PWA_REPAIR').finally(()=>this.repairing=null);result=await this.repairing}catch{}}this.state.audit=result;this.state.ready=result.complete===true&&result.scope===PWA_SCOPE&&result.version===APP_VERSION;this.state.phase=this.state.ready?'ready':'incomplete';this.state.waiting=!!this.registration.waiting;this.emit();if(this.state.ready&&result.version===APP_VERSION)workerMessage(active,'PWA_PRUNE',{version:APP_VERSION}).catch(()=>{});return result}catch{this.state.ready=false;this.state.phase='failed';this.emit()}}
 async check(){if(!this.started)await this.start();if(!this.state.supported||!import.meta.env.PROD)return;this.state.phase='checking';this.emit();try{const r=this.registration;if(!r||!r.active&&!r.installing&&!r.waiting){await this.clearFailedInstall();this.registration=null;this.started=false;await this.start()}else if(navigator.onLine)await r.update();await this.audit();if(!this.registration?.active&&!this.registration?.installing)this.state.phase='failed';this.state.waiting=!!this.registration?.waiting;this.emit()}catch{this.state.phase=this.state.ready?'ready':'failed';this.emit()}}
 async finishUpdate(){try{const approved=await this.activation;if(!approved?.ok)return;const active=this.registration?.active;if(!active)return;if(active.state!=='activated')await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('activation timeout')),6000);const changed=()=>{if(active.state==='activated'){clearTimeout(timer);active.removeEventListener('statechange',changed);resolve()}};active.addEventListener('statechange',changed);changed()});const verified=await workerMessage(active,'PWA_STATUS');if(this.reloading&&verified.complete&&verified.version===approved.version)location.reload()}catch{this.reloading=false}}
 async activate(){const worker=this.registration?.waiting;if(!worker)return{ok:false};this.reloading=true;try{this.activation=workerMessage(worker,'PWA_ACTIVATE');const r=await this.activation;if(!r.ok)this.reloading=false;return r}catch{this.reloading=false;return{ok:false}}}
 async install(){const prompt=this.installPrompt;if(!prompt)return false;this.installPrompt=null;await prompt.prompt();const choice=await prompt.userChoice;this.emit();return choice.outcome==='accepted'}
}
export const offlineManor=new OfflineManor();
