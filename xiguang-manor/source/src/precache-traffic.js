// Workbox still owns install/repair/cache consistency. Only background traffic
// is limited; game image requests and already cached responses never queue here.
export function precacheTraffic(concurrency=2){
 let active=0;const waiting=[];
 return{
  async requestWillFetch({request,state}){
   await new Promise(resolve=>{const enter=()=>{active++;let released=false;state.release=()=>{if(released)return;released=true;active--;waiting.shift()?.()};resolve()};if(active<concurrency)enter();else waiting.push(enter)});
   try{return new Request(request,{priority:'low'})}catch{return request}
  },
  // Complete means response body and Cache.put finished, not merely headers.
  handlerDidComplete({state}){state.release?.()}
 };
}
