import{chromium,webkit}from'@playwright/test';import{mkdir,writeFile}from'node:fs/promises';import{compactMenuClicks}from'./compact-menu.mjs';import{fresh}from'../src/save.js';
const engine=process.argv.includes('--webkit')?webkit:chromium,report={engine:engine.name(),conditions:'Local development builds, same browser/mobile viewport; simulated device, not physical phone',versions:{}};
const b=await engine.launch({headless:true,...(engine===webkit?{executablePath:process.env.WEBKIT_PORTABLE_BIN}:{args:['--no-sandbox','--enable-precise-memory-info']})});
const seed=fresh();Object.assign(seed,{accepted:true,completed:true,stage:5,candies:100});seed.scenery.clock=21;
const metrics=async p=>p.evaluate(()=>({textures:__manor.scene.textures.getTextureKeys().length,heap:performance.memory?.usedJSHeapSize||null}));
try{for(const [version,url]of [['before','http://localhost:5193'],['after','http://localhost:5194']]){
 const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});compactMenuClicks(p);p.setDefaultTimeout(20000);await p.addInitScript(d=>localStorage.setItem('xiguang-manor-v1',JSON.stringify(d)),seed);await p.goto(url);await p.click('#skip-return');await p.waitForFunction(()=>__manor.scene.ready&&!__manor.session.returning);await p.waitForTimeout(12000);
 const frames=await p.evaluate(async()=>{
  const runs=[];
  for(let r=0;r<3;r++)runs.push(await new Promise(resolve=>{
   const samples=[];let last=performance.now(),start=last;
   function tick(t){
    samples.push(t-last);last=t;
    if(t-start<2000){requestAnimationFrame(tick);return}
    samples.shift();samples.sort((a,b)=>a-b);
    resolve({fps:Number((samples.length/(t-start)*1000).toFixed(1)),frameP95:Number(samples[Math.floor(samples.length*.95)].toFixed(2))});
   }
   requestAnimationFrame(tick);
  }));
  return runs;
 });
 const cdp=engine===chromium?await p.context().newCDPSession(p):null;const cycles=[];for(let i=0;i<4;i++){for(const place of ['florist','cabin']){await p.click('#world-wander');await p.click('#world-'+place);await p.waitForTimeout(500);await p.click(place==='florist'?'#leave-florist':'#leave-retreat')}await p.click('#open-loot-bag');await p.click(i?'#resume-expedition':'#enter-ruins');await p.waitForTimeout(450);await p.click('#run-rest');await p.click('#pause-expedition');await p.waitForTimeout(200);if(cdp)await cdp.send('HeapProfiler.collectGarbage');cycles.push(await metrics(p))}
 const fps=frames.map(r=>r.fps).sort((a,b)=>a-b);report.versions[version]={frames,fpsMedian:fps[1],fpsRange:[fps[0],fps[2]],sceneCycles:cycles};
 if(version==='after'){
  await p.setViewportSize({width:375,height:667});await p.click('#world-wander');await p.click('#world-florist');await p.click('#florist-wrap');await p.waitForTimeout(300);const layout=await p.evaluate(()=>({viewport:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,close:document.querySelector('#flower-close').getBoundingClientRect().toJSON(),make:document.querySelector('#make-bouquet').getBoundingClientRect().toJSON()}));if(layout.overflow||layout.close.x<0||layout.close.right>375)throw Error('small screen overflow');await mkdir('public/v6-review',{recursive:true});await p.screenshot({path:`public/v6-review/small-${engine.name()}.png`});report.smallScreen=layout;
 }
 await p.close();
}await mkdir('verification/v6-results',{recursive:true});await writeFile(`verification/v6-results/performance-${engine.name()}.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}finally{await b.close()}
