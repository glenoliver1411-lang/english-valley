const ROOT=self.registration.scope;
const CACHE='english-valley-v3-'+ROOT;
const ASSETS=['./','./life.js','./world.js','./world.css','./manifest.webmanifest','./icon-192.png','./icon-512.png'].map(p=>new URL(p,ROOT).href);
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!e.request.url.startsWith(ROOT)||!(ASSETS.includes(e.request.url)||e.request.mode==='navigate'))return;e.respondWith(fetch(e.request).then(r=>{if(r.ok&&r.type==='basic'){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)))}return r}).catch(()=>caches.open(CACHE).then(c=>c.match(e.request).then(r=>r||(e.request.mode==='navigate'?c.match(ROOT):Response.error())))))});
