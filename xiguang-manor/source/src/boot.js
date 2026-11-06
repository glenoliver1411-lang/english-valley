import {earlyGift} from './early-gift.js';
import {BOOT as B} from './boot-config.js';
const root=document.querySelector('#manor-loading'),message=document.querySelector('#boot-message'),bar=document.querySelector('#boot-progress'),actions=root.querySelector('.boot-actions');
let ready=false,failed=false,giftVisible=false;
const recovery=phase=>{root.hidden=false;message.textContent=B[phase]||B.failed;actions.hidden=false};
const timeout=setTimeout(()=>{if(!ready&&!failed&&!giftVisible)recovery('slow')},B.slowAfter);
function reload(canvas=false){const url=new URL(location.href);url.searchParams.set('reload',Date.now().toString(36));if(canvas)url.searchParams.set('renderer','canvas');location.replace(url.href)}
document.querySelector('#boot-retry').onclick=()=>reload();document.querySelector('#boot-canvas').onclick=()=>reload(true);
window.addEventListener('manor:boot',({detail})=>{
  if(detail.phase==='gift'){giftVisible=true;root.hidden=true;return}
  if(detail.phase==='ready'){ready=true;failed=false;clearTimeout(timeout);root.hidden=true;return}
  if(detail.phase==='failed'||detail.phase==='graphics'){failed=true;clearTimeout(timeout);recovery(detail.phase);return}
  if(!ready&&!failed){if(B[detail.phase])message.textContent=B[detail.phase];bar.value=Math.max(bar.value,Math.round((detail.progress??0)*100))}
});
const fail=()=>{if(!ready){failed=true;clearTimeout(timeout);recovery('failed')}};
window.addEventListener('error',fail);window.addEventListener('unhandledrejection',fail);
// Keep this bootstrap independent of the game bundle: a missing or interrupted
// module download is a recoverable screen, rather than an empty frozen shell.
earlyGift();
// Let the existing gift paint before parsing the world, while starting the real
// engine immediately afterwards. The free-control metric still includes it.
requestAnimationFrame(()=>setTimeout(()=>import('./main.js').catch(fail),0));
