import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const label=process.argv[2]||'before',root=process.argv[3]||'http://localhost:4173/';
const b=await chromium.launch({args:['--no-sandbox']});
try{
 const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),cdp=await p.context().newCDPSession(p),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1600000/8,uploadThroughput:750000/8});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 const t=Date.now();await p.goto(root,{waitUntil:'domcontentloaded'});await p.waitForSelector('#gift-envelope',{timeout:90000});const openingMs=Date.now()-t;
 const result=await p.evaluate(()=>({resources:performance.getEntriesByType('resource').filter(x=>x.transferSize>0).map(x=>({name:x.name.split('/').pop(),bytes:x.encodedBodySize,duration:Math.round(x.duration)}))}));
 Object.assign(result,{label,openingMs,errors,totalTransferBytes:result.resources.reduce((n,r)=>n+r.bytes,0)});await writeFile('/workspace/scratch/startup-'+label+'.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await b.close()}
