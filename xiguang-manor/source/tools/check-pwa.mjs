// Reproducible production-only test: two complete releases, one exact Pages
// prefix, forced HTTP failures in addition to browser offline mode.
import {spawn,spawnSync} from 'node:child_process';
import {cp,mkdtemp,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
const root=await mkdtemp(join(tmpdir(),'manor-pwa-builds-')),results=resolve('verification/pwa-results');await mkdir(results,{recursive:true});
function run(cmd,args,extra={}){const r=spawnSync(cmd,args,{stdio:'inherit',env:{...process.env,...extra}});if(r.status!==0)throw Error([cmd,...args].join(' ')+' failed: '+r.status)}
for(const release of ['a','b']){run('npm',['run','build:pwa:preview'],{MANOR_RELEASE:'pwa-stage1-'+release});await cp('dist',join(root,release),{recursive:true})}
const server=spawn(process.execPath,['tools/pwa-test-server.mjs'],{stdio:'inherit',env:{...process.env,PWA_TEST_ROOT:root}});
try{let ready=false;for(let i=0;i<80;i++){try{ready=(await fetch('http://localhost:4174/__test')).ok}catch{}if(ready)break;await new Promise(r=>setTimeout(r,100))}if(!ready)throw Error('test server unavailable');for(const args of [[],['--webkit']])for(const file of ['pwa-offline-journey.mjs','pwa-failures.mjs'])run(process.execPath,['tests/'+file,...args],{PWA_RESULTS_DIR:results})}finally{server.kill()}
