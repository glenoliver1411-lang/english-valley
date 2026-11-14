import test from 'node:test';
import assert from 'node:assert/strict';
import {releaseEntryURL,releaseGameURL,releaseGameDocument} from '../src/release-entry-model.js';
const base='/english-valley/xiguang-manor/',version='full-stage1-test';
test('Each formal release has a unique game document, so an old worker cannot return its cached index',()=>{
 const location=new URL('https://example.com'+base+'?v=old&ready=stale&renderer=canvas#forest-garden');
 const entry=new URL(releaseEntryURL(location,base));
 assert.equal(entry.pathname,base+'enter-stage1.html');
 const game=new URL(releaseGameURL(entry,base,version));
 assert.equal(game.pathname,base+'game-full-stage1-test.html');
 assert.equal(game.searchParams.get('v'),null);
 assert.equal(game.searchParams.get('ready'),null);
 assert.equal(game.searchParams.get('renderer'),'canvas');
 assert.equal(game.hash,'#forest-garden');
 assert.notEqual(game.pathname,new URL(releaseGameURL(entry,base,'full-stage1-next')).pathname);
});
test('Preview documents remain unchanged; generated release filenames stay inside their scope',()=>{
 assert.equal(releaseGameDocument('forest-garden-test'),'index.html');
 assert.equal(releaseGameDocument('full-stage1-../../bad'),'game-full-stage1-------bad.html');
});
