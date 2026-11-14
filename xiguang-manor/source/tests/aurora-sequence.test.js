import test from 'node:test';
import assert from 'node:assert/strict';
import {auroraSequence as phase} from '../src/aurora-sequence.js';
test('The full native aurora actually appears then disappears, and does not silently restart',()=>{
 assert.equal(phase(0).reveal,0);assert.equal(phase(1.9).phase,'quiet');assert.ok(phase(7).reveal>.4&&phase(7).reveal<.6);assert.equal(phase(24).reveal,1);assert.equal(phase(60).phase,'disappearing');assert.equal(phase(79).reveal,0);assert.equal(phase(79).ended,true);for(const t of [88,160,999])assert.deepEqual(phase(t),phase(79));
});
test('Entry and exit remain monotone and continuous at every stage boundary',()=>{
 let previous=0;for(let t=2;t<=12;t+=.025){const p=phase(t);assert.ok(p.reveal>=previous-1e-10&&p.reveal<=1);previous=p.reveal}
 previous=1;for(let t=56;t<=79;t+=.025){const p=phase(t);assert.ok(p.reveal<=previous+1e-10&&p.reveal>=0);previous=p.reveal}
 for(const t of [2,12,56,79])assert.ok(Math.abs(phase(t-.001).reveal-phase(t+.001).reveal)<.00001);
});
test('Reduced motion and explicit skip show the full original; a fresh sequence begins in calm night',()=>{
 for(const t of [0,8,60,100]){assert.equal(phase(t,{still:true}).reveal,1);assert.equal(phase(t,{skip:true}).reveal,1)}assert.equal(phase(0).reveal,0);assert.ok(Number.isFinite(phase(NaN).reveal));
});
