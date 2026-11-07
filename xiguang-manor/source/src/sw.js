/*! Workbox - MIT License
Copyright 2018 Google LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
import {PrecacheController,PrecacheRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {clientsClaim} from 'workbox-core';
self.__WB_DISABLE_DEV_LOGS=true;
const VERSION=__APP_VERSION__,SCOPE=self.registration.scope,PREFIX='xiguang-precache::'+SCOPE+'::',CACHE=PREFIX+VERSION,MARK=new URL('__offline_version__',SCOPE).href;
const entries=self.__WB_MANIFEST;
// The plugin may also append the web manifest; count/cache it only once.
const unique=new Map();for(const entry of entries)if(!unique.has(entry.url))unique.set(entry.url,entry);
const manifest=[...unique.values()];
// Use the same explicit Cache handle for routing and auditing. Safari can
// retain stale CacheStorage.match results after a failed install/re-register;
// accepting those would skip downloads that the actual release cache lacks.
const precache=new PrecacheController({cacheName:CACHE,plugins:[{cachedResponseWillBeUsed:async({request,cacheName})=>{const response=await(await caches.open(cacheName)).match(request);return response?.ok?response:null}}]});precache.addToCacheList(manifest);
registerRoute(new PrecacheRoute(precache,{directoryIndex:'index.html',ignoreURLParametersMatching:[/^visit$/, /^v$/, /^reload$/, /^renderer$/, /^return$/, /^retry$/, /^utm_/, /^fbclid$/]}));
self.addEventListener('install',event=>event.waitUntil(precache.install(event)));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await precache.activate(event);const cache=await caches.open(CACHE);await cache.put(MARK,new Response(JSON.stringify({version:VERSION,activatedAt:Date.now()}),{headers:{'Content-Type':'application/json'}}))})()));
clientsClaim();
async function windows(){return(await self.clients.matchAll({type:'window',includeUncontrolled:true})).filter(c=>c.url.startsWith(SCOPE))}
async function audit(){let bytes=0,missing=[],missingDetails=[];for(const entry of manifest){const r=await precache.matchPrecache(entry.url);if(!r||!r.ok){missing.push(entry.url);missingDetails.push({url:entry.url,status:r?.status??null,type:r?.type??null})}else bytes+=(await r.blob()).size}const c=await caches.open(CACHE),mark=await c.match(MARK);return{version:VERSION,scope:SCOPE,cache:CACHE,complete:missing.length===0,files:manifest.length,bytes,cacheEntries:(await c.keys()).length,internalBytes:mark?(await mark.blob()).size:0,missing,missingDetails}}
async function repair(event){for(const entry of manifest){const existing=await precache.matchPrecache(entry.url);if(existing?.ok)continue;if(existing)await(await caches.open(CACHE)).delete(precache.getCacheKeyForURL(entry.url));const request=new Request(new URL(entry.url,SCOPE),{credentials:'same-origin',cache:'reload',integrity:entry.integrity});const [response,done]=precache.strategy.handleAll({event,request,params:{cacheKey:precache.getCacheKeyForURL(entry.url),integrity:entry.integrity}});await response;await done}return audit()}

// Old in-memory tabs may still request a content-hashed chunk while their
// approved reload is taking place. Only this scope's completed releases qualify.
registerRoute(({url})=>url.origin===self.location.origin&&url.pathname.startsWith(new URL('assets/',SCOPE).pathname)&&/-[\w-]{8}\.(?:js|css|png|webp|jpe?g)$/.test(url.pathname),async({request})=>{for(const name of(await caches.keys()).filter(n=>n.startsWith(PREFIX))){const c=await caches.open(name);if(!await c.match(MARK))continue;const r=await c.match(request,{ignoreSearch:true});if(r)return r}return fetch(request)});
async function prune(clientVersion){
 if(clientVersion!==VERSION||self.registration.installing||self.registration.waiting||(await windows()).length>1)return;
 const releases=[];for(const name of(await caches.keys()).filter(n=>n.startsWith(PREFIX))){const r=await(await caches.open(name)).match(MARK);if(r)releases.push({name,...await r.json()});else if(name!==CACHE)await caches.delete(name)}
 releases.sort((a,b)=>b.activatedAt-a.activatedAt);const keep=new Set([CACHE,...releases.filter(r=>r.name!==CACHE).slice(0,1).map(r=>r.name)]);for(const r of releases)if(!keep.has(r.name))await caches.delete(r.name);
}
self.addEventListener('message',event=>{
 const reply=data=>event.ports[0]?.postMessage(data),data=event.data||{};
 event.waitUntil((async()=>{try{
  // Re-read the client after navigation/activation; Safari can deliver a
  // stale WindowClient snapshot in the very first message after claiming.
  const client=event.source?.id?await self.clients.get(event.source.id):null;
  if(!client?.url?.startsWith(SCOPE)){reply({ok:false,complete:false,error:'scope'});return}
  if(data.type==='PWA_STATUS'){reply(await audit());return}
  if(data.type==='PWA_REPAIR'){reply(await repair(event));return}
  if(data.type==='PWA_PRUNE'){await prune(data.version);reply({ok:true});return}
  if(data.type==='PWA_ACTIVATE'){if((await windows()).length>1){reply({ok:false,reason:'tabs'});return}if(!(await audit()).complete){reply({ok:false,reason:'incomplete'});return}reply({ok:true,version:VERSION});await self.skipWaiting()}
 }catch(error){reply({ok:false,complete:false,error:String(error)})}})());
});
