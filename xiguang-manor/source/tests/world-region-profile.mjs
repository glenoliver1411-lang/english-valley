// Short isolated production probe. These are cloud browser timings, not phone FPS.
import {chromium,webkit} from '@playwright/test';
import {fresh} from '../src/save.js';
import {mkdir,writeFile} from 'node:fs/promises';
const engine=process.argv.includes('--webkit')?webkit:chromium;
const origin=process.env.WORLD_TEST_ORIGIN||'http://localhost:4178';
const scope=origin+'/english-valley/xiguang-manor/world-garden-preview/';
const browser=await engine.launch({headless:true,...(engine===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN}:{args:['--no-sandbox']})});
const page=await browser.newPage({viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const seed=fresh();Object.assign(seed,{accepted:true,completed:true,stage:5,music:false});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
 await page.addInitScript(({seed,scope})=>{localStorage.setItem('xiguang-manor-v1',JSON.stringify(seed));localStorage.setItem('xiguang-pocket:'+scope+':snooze',String(Date.now()+86400000))},{seed,scope});
 await page.goto(scope+'?visit=world&light=dawn');await page.click('#skip-return');await page.waitForSelector('.world-region-ui.loaded');
 await page.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true',null,{timeout:120000});
 const result=await page.evaluate(async()=>{
  const c=document.querySelector('#game canvas');let gl=c.getContext('webgl2')||c.getContext('webgl'),renderer=null;
  if(gl){const e=gl.getExtension('WEBGL_debug_renderer_info');renderer=String(gl.getParameter(e?e.UNMASKED_RENDERER_WEBGL:gl.RENDERER))}
  const deltas=await new Promise(resolve=>{const a=[];let last;const step=t=>{if(last)a.push(t-last);last=t;if(a.length===120)resolve(a);else requestAnimationFrame(step)};requestAnimationFrame(step)});
  const sorted=deltas.slice().sort((a,b)=>a-b);
  return {viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},renderer,canvas:{width:c.width,height:c.height},frameSummaryMs:{median:sorted[60],p95:sorted[114],min:sorted[0],max:sorted[119]},frameDeltas:deltas,heapBytes:performance.memory?.usedJSHeapSize??null};
 });
 const report={engine:engine.name(),...result,errors,notes:'Isolated final production build, no parallel browser tests; idle following camera, normal decorative animation. 120 requestAnimationFrame intervals after complete offline install. Chromium reports SwiftShader. WebKit renderer text is not evidence of real Apple hardware. Linux headless automation, not physical iPhone/Android performance.'};
 await mkdir('verification/world-solo-profile',{recursive:true});await writeFile(`verification/world-solo-profile/${engine.name()}.json`,JSON.stringify(report,null,2));
 console.log(JSON.stringify({...report,frameDeltas:undefined}));if(errors.length)throw new Error(errors.join('; '));
}finally{await browser.close()}
