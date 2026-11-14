import test from 'node:test';
import assert from 'node:assert/strict';
import {releaseEntryURL,releaseGameURL,consumeReleasePass} from '../src/release-entry-model.js';
const base='/english-valley/xiguang-manor/',version='full-stage1-test';
test('Release entry uses a new document path instead of an ignored cache-busting parameter',()=>{
 const location=new URL('https://example.com'+base+'?v=old&renderer=canvas#forest-garden');
 const entry=new URL(releaseEntryURL(location,base));
 assert.equal(entry.pathname,base+'enter-stage1.html');
 assert.equal(entry.hash,'#forest-garden');
 const game=new URL(releaseGameURL(entry,base,version));
 assert.equal(game.pathname,base+'index.html');
 assert.equal(game.searchParams.get('v'),null);
 assert.equal(game.searchParams.get('renderer'),'canvas');
 assert.equal(game.searchParams.get('ready'),version);
 assert.equal(game.hash,'#forest-garden');
});
test('Only a matching one-use release pass starts the game and it never changes player data',()=>{
 let result=null;const history={replaceState:(_a,_b,url)=>result=url};
 const location=new URL('https://example.com'+base+'index.html?ready='+version+'&renderer=canvas#forest-garden');
 assert.equal(consumeReleasePass(location,'other-version',history),false);
 assert.equal(result,null);
 assert.equal(consumeReleasePass(location,version,history),true);
 assert.equal(result,base+'index.html?renderer=canvas#forest-garden');
 assert.equal(consumeReleasePass(new URL(result,location),version,history),false);
});
