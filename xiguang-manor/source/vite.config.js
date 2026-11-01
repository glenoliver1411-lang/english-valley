import {defineConfig} from 'vite';
export default defineConfig({base:'./',build:{target:'es2020',rollupOptions:{input:{manor:'index.html',aurora:'aurora.html'}}}});
