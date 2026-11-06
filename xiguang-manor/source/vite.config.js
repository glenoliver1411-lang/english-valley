import {defineConfig} from 'vite';
import {bootShell} from './src/boot-template.js';
export default defineConfig({
  base:'./',
  plugins:[{
    name:'manor-loading-shell',
    transformIndexHtml(html,ctx){
      return ctx.path==='/index.html'||ctx.filename?.endsWith('/index.html')?html.replace('<body>','<body>'+bootShell()):html;
    }
  }],
  build:{
    target:'es2020',assetsInlineLimit:0,
    rollupOptions:{
      input:{manor:'index.html',aurora:'aurora.html'},
      output:{manualChunks:{phaser:['phaser']}}
    }
  }
});
