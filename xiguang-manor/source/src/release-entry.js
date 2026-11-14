import {APP_VERSION,PWA_SCOPE,SERVICE_WORKER_URL,workerMessage} from './pwa-service.js';
import {backupCurrent} from './save.js';
import {releaseGameURL} from './release-entry-model.js';
const status=document.querySelector('#entry-status'),detail=document.querySelector('#entry-detail'),bar=document.querySelector('#entry-progress'),retry=document.querySelector('#entry-retry');
let running=false,attempt=0;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const version=async worker=>{if(!worker)return null;return workerMessage(worker,new URL(worker.scriptURL).searchParams.has('build')?'PWA_VERSION':'PWA_STATUS').catch(()=>null)};
function showProgress(s){if(!s||s.version!==APP_VERSION||!s.files)return;bar.max=s.files;bar.value=s.files-(s.missing?.length||0);detail.textContent=`新版资料 ${bar.value} / ${bar.max} 项 · 存档保留`}
function fail(message){running=false;status.textContent=message;retry.hidden=false;bar.removeAttribute('value')}
function openGame(){bar.max=1;bar.value=1;status.textContent=location.hash==='#forest-garden'?'新版已就绪，正在走进花园……':'新版已就绪，正在回到庄园……';location.replace(releaseGameURL(location,import.meta.env.BASE_URL,APP_VERSION))}
async function verifyAndOpen(worker){
 let s=await workerMessage(worker,'PWA_STATUS');showProgress(s);
 if(s?.version===APP_VERSION&&s.scope===PWA_SCOPE&&!s.complete&&navigator.onLine)s=await workerMessage(worker,'PWA_REPAIR');
 if(s?.version===APP_VERSION&&s.scope===PWA_SCOPE&&s.complete){openGame();return}
 fail('离线资料暂未准备完整。请联网后重试，原进度还在。');
}
async function enter(){
 if(running)return;running=true;const id=++attempt;retry.hidden=true;bar.removeAttribute('value');
 if(!('serviceWorker'in navigator)||!isSecureContext){openGame();return}
 try{
  const existing=await navigator.serviceWorker.getRegistration(PWA_SCOPE),current=await version(navigator.serviceWorker.controller);
  if(current?.version===APP_VERSION&&current.scope===PWA_SCOPE){await verifyAndOpen(navigator.serviceWorker.controller);return}
  // Fresh visitors keep the lightweight letter-first startup. The game installs
  // its offline package in the background; only an existing old worker needs migration.
  if(!existing?.active&&!navigator.serviceWorker.controller){openGame();return}
  status.textContent=existing?.active?'检测到旧离线版本，正在切换到新花园……':'正在准备完整庄园，完成后自动进入……';
  const reg=await navigator.serviceWorker.register(SERVICE_WORKER_URL,{scope:PWA_SCOPE,updateViaCache:'none'});if(navigator.onLine)await reg.update();
  let backedUp=false;const started=Date.now();let quietSince=Date.now();
  while(id===attempt){
   const controller=await version(navigator.serviceWorker.controller);if(controller?.version===APP_VERSION&&controller.scope===PWA_SCOPE){await verifyAndOpen(navigator.serviceWorker.controller);return}
   if(Date.now()-started>300000){fail('下载比平时久了一些，请保持联网后重试。原进度还在。');return}
   const waiting=reg.waiting;
   if(waiting){const s=await workerMessage(waiting,'PWA_STATUS').catch(()=>null);showProgress(s);if(s?.version===APP_VERSION&&s.complete){
     if(!backedUp){if(!backupCurrent('before-update')){fail('浏览器暂时不能备份进度。请保留此页面后重试，原存档没有改动。');return}backedUp=true}
     const result=await workerMessage(waiting,'PWA_ACTIVATE');if(!result.ok){if(result.reason==='tabs')fail('另一页庄园还开着。请在那页保存并关闭，再点重试。');else fail('新版资料还没准备完整，请保持联网后重试。');return}
     status.textContent='进度已备份，正在换上新版……';
     for(let n=0;n<40;n++){const live=await version(navigator.serviceWorker.controller);if(live?.version===APP_VERSION&&live.scope===PWA_SCOPE){await verifyAndOpen(navigator.serviceWorker.controller);return}await delay(250)}
     fail('版本已准备好，浏览器还在切换。轻点重试即可继续。');return;
   }}
   if(reg.installing){quietSince=Date.now();const s=await workerMessage(reg.installing,'PWA_STATUS').catch(()=>null);showProgress(s)}
   else if(reg.active){const active=await version(reg.active);if(active?.version===APP_VERSION){status.textContent='新版已准备好，正在接入当前页面……';await delay(600)}else if(!reg.waiting&&Date.now()-quietSince>15000){fail('新版下载暂时中断。请保持联网后重试，原进度还在。');return}}
   else if(Date.now()-quietSince>15000){fail('暂时无法下载新版，请联网后重试。原进度还在。');return}
   await delay(1200);
  }
 }catch{fail('网络暂时没有连上新版庄园。请保持联网，再点重试。')}
}
retry.onclick=enter;enter();
