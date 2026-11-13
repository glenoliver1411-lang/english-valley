import architecture from './assets/world/architecture.webp';
import botanical from './assets/world/botanical.webp';
import terrain from './assets/daylight/terrain.webp';
let started=false;const pending=[];
// These are the actual initial scene images, using the same URLs as Phaser.
// Begin alongside engine parsing, rather than after all small flower files.
export function preloadWorldBackdrop(){if(started)return;started=true;const scope=new URL(import.meta.env.BASE_URL,location.href);if(navigator.serviceWorker?.controller?.scriptURL===new URL('sw.js',scope).href)return;for(const src of[terrain,architecture,botanical]){const image=new Image();image.decoding='async';image.fetchPriority='low';pending.push(image);const complete=()=>{const i=pending.indexOf(image);if(i>=0)pending.splice(i,1)};image.onload=image.onerror=complete;image.src=src}}
