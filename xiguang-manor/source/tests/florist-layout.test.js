import test from 'node:test';
import assert from 'node:assert/strict';
import {FLORIST as F,floristBlocked,floristRoute,frontAt} from '../src/florist-layout.js';
test('original-paint florist has connected, safe first-floor routes to every working counter',()=>{
 assert.equal(floristBlocked(F.spawn.x,F.spawn.y),false);
 for(const station of F.stations)for(const end of station.approaches){const path=floristRoute(F.spawn,end);assert.ok(path.length,station.id);let a=F.spawn;for(const b of path){const n=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/3);for(let i=0;i<=n;i++)assert.equal(floristBlocked(a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n),false,station.id);a=b}}
});
test('floor mask blocks loft, stairs, glass, counter, flower table and front planters',()=>{for(const[x,y]of [[0,0],[350,400],[710,620],[420,870],[750,995],[1035,1040],[930,1175],[230,1030],[1035,818],[1160,600]])assert.equal(floristBlocked(x,y),true,`${x},${y}`)});
test('sloping contact edge distinguishes front and back of original furniture',()=>{const foot=[[601,968],[653,1032],[756,1066],[906,987]];assert.ok(858<frontAt(foot,818));assert.ok(1091>frontAt(foot,803));assert.equal(frontAt([[235,979],[577,870]],577),870)});
