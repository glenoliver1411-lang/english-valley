import {VitePWA} from 'vite-plugin-pwa';
import {currentReleaseOnly} from './tools/offline-manifest.js';
import {resolve} from 'node:path';
import {defineConfig,loadEnv} from 'vite';
import {bootShell} from './src/boot-template.js';
import {copyFileSync} from 'node:fs';
import {releaseGameDocument} from './src/release-entry-model.js';
export default defineConfig(({mode})=>{
 const env=loadEnv(mode,process.cwd(),'MANOR_'),base=env.MANOR_BASE||'./',version=process.env.MANOR_RELEASE||new Date().toISOString().replace(/[:.]/g,'-');
 return {
  define:{__APP_VERSION__:JSON.stringify(version)},
  base,
  plugins:[{
    name:'manor-loading-shell',
    transformIndexHtml(html,ctx){
      if(ctx.filename?.endsWith('/enter-stage1.html'))return html.replaceAll('__RELEASE_GAME_DOCUMENT__',releaseGameDocument(version));
      return ctx.path==='/index.html'||ctx.filename?.endsWith('/index.html')?html.replace('<head>',`<head><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="曦光庄园"><link rel="apple-touch-icon" href="${base}pwa-icons/icon-180.png">`).replace('<body>','<body>'+bootShell()):html;
    },
    writeBundle(){if(version.startsWith('full-stage1'))copyFileSync(resolve('dist/index.html'),resolve('dist/'+releaseGameDocument(version)))}
  },VitePWA({strategies:'injectManifest',srcDir:'src',filename:'sw.js',injectRegister:false,registerType:'prompt',scope:base,manifest:{id:base,name:'曦光庄园',short_name:'曦光庄园',description:'一座可以放进口袋、离线游玩的私人童话庄园',start_url:base+releaseGameDocument(version),scope:base,display:'standalone',orientation:'portrait',lang:'zh-CN',theme_color:'#28263f',background_color:'#28263f',icons:[{src:base+'pwa-icons/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:base+'pwa-icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]},injectManifest:{rollupFormat:'iife',globPatterns:['index.html','aurora.html','enter-stage1.html','game-*.html','manifest.webmanifest','assets/*','pwa-icons/*.png'],maximumFileSizeToCacheInBytes:6*1024*1024,manifestTransforms:[currentReleaseOnly(resolve('dist'),version,base)]},devOptions:{enabled:false}})],
  build:{
    target:'es2020',assetsInlineLimit:0,manifest:true,
    rollupOptions:{
      input:{manor:'index.html',aurora:'aurora.html',entry:'enter-stage1.html'},
      output:{manualChunks:{phaser:['phaser']}}
    }
  }
};});
