import {readFileSync,readdirSync,statSync,writeFileSync} from 'node:fs';
import {join,basename} from 'node:path';
import {createHash} from 'node:crypto';
export function currentReleaseOnly(outDir,version,base){return async entries=>{
 const assetDir=join(outDir,'assets'),names=readdirSync(assetDir),code=names.filter(n=>/\.(?:js|css)$/.test(n)).map(n=>readFileSync(join(assetDir,n),'utf8')).join('\n');
 const required=new Set(['index.html','aurora.html','manifest.webmanifest','pwa-icons/icon-192.png','pwa-icons/icon-512.png','pwa-icons/icon-180.png']);
 for(const name of names)if(/\.(js|css)$/.test(name)||code.includes(basename(name)))required.add('assets/'+name);
 const normalize=url=>{let p=url.startsWith(base)&&base.startsWith('/')?url.slice(base.length):url;return p.replace(/^\.\//,'')};
 const integrity=url=>'sha256-'+createHash('sha256').update(readFileSync(join(outDir,normalize(url)))).digest('base64');
 const selected=[...new Map(entries.filter(e=>required.has(normalize(e.url))).map(e=>[normalize(e.url),{...e,integrity:integrity(e.url)}])).values()];
 const covered=new Set(selected.map(e=>normalize(e.url)));for(const url of required)if(!covered.has(url))throw Error('Required offline resource missing: '+url);
 const metadata={version,files:selected.length+1,assets:selected.map(e=>({url:normalize(e.url),bytes:statSync(join(outDir,normalize(e.url))).size}))};
 writeFileSync(join(outDir,'offline-release.json'),JSON.stringify(metadata));
 // This metadata is data only. Workbox owns all downloading and revisioning.
 return{manifest:[...selected,{url:'offline-release.json',revision:version,integrity:integrity('offline-release.json')}],warnings:[]};
}}
