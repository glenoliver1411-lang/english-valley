import {BOOT as B} from './boot-config.js';
export function lazyFeature(load,create,api){
  let module,instance,pending,token=0;const assigned={};
  const preload=()=>module?Promise.resolve(module):(pending??=load().then(m=>module=m).catch(e=>{pending=null;throw e}));
  const ensure=()=>preload().then(m=>instance??=Object.assign(create(m),assigned));
  async function invoke(key,args){
    const id=++token;api.close();api.lock(true);let root;
    const timer=setTimeout(()=>{if(id!==token)return;root=document.createElement('div');root.className='feature-loading';root.innerHTML='<div><p></p><button></button></div>';root.querySelector('p').textContent=B.sceneLoading;root.querySelector('button').textContent=B.cancel;root.querySelector('button').onclick=()=>{token++;root.remove();api.lock(false)};document.querySelector('.playfield').append(root)},120);
    try{const value=await ensure();if(id===token){api.lock(false);return value[key](...args)}}catch{if(id===token){api.lock(false);document.querySelector('#toast').textContent=B.failed;document.querySelector('#toast').classList.add('show');setTimeout(()=>document.querySelector('#toast').classList.remove('show'),2800)}}finally{clearTimeout(timer);root?.remove()}
  }
  return new Proxy({}, {get:(_,key)=>key==='ensure'?ensure:key==='preload'?preload:key==='prewarm'?profile=>preload().then(m=>m.prewarm?.(profile)):key==='loaded'?!!instance:instance?(typeof instance[key]==='function'?instance[key].bind(instance):instance[key]):['active','view','photoMode'].includes(key)?false:key==='then'?undefined:(...args)=>invoke(key,args),set:(_,key,value)=>{assigned[key]=value;if(instance)instance[key]=value;return true}});
}
export function warmFeatures(tasks,canRun){
  let i=0,lastInput=0;const input=()=>{lastInput=performance.now()};window.addEventListener('pointerdown',input,{passive:true});
  const next=()=>{if(document.hidden||!canRun()||performance.now()-lastInput<1000){setTimeout(next,1200);return}const task=tasks[i++];if(!task){window.removeEventListener('pointerdown',input);return;}const work=()=>Promise.resolve().then(task).catch(()=>{}).finally(()=>setTimeout(next,800));if('requestIdleCallback'in window)requestIdleCallback(work,{timeout:2500});else setTimeout(work,200)};
  if(!navigator.connection?.saveData&&!/2g/.test(navigator.connection?.effectiveType||''))setTimeout(next,1400);
}
