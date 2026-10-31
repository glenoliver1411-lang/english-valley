import test from 'node:test';import assert from 'node:assert/strict';
import {retreatRoute} from '../src/retreat-navigation.js';
const cabinBlocked=(x,y)=>x<40||x>398||y<290||y>811||(x>273&&x<392&&y>337&&y<527)||(x>29&&x<94&&y>363&&y<448)||(x>320&&y>578&&y<684)||(x<101&&y>562&&y<667);
function assertWalkable(start,path){let from=start;for(const p of path){const steps=Math.ceil(Math.hypot(p.x-from.x,p.y-from.y));for(let i=0;i<=steps;i++){const fraction=steps?i/steps:0;assert.equal(cabinBlocked(from.x+(p.x-from.x)*fraction,from.y+(p.y-from.y)*fraction),false,`Route crosses furniture near ${p.x},${p.y}`)}from=p}}
test('Cabin taps route around the bed and wardrobe instead of walking against them forever',()=>{
 for(const [start,goal]of [[{x:395,y:450},{x:212,y:352}],[{x:50,y:700},{x:212,y:352}],[{x:120,y:710},{x:302,y:692}],[{x:216,y:785},{x:212,y:352}]]){const path=retreatRoute(start,goal,cabinBlocked);assert.ok(path.length>0);assert.deepEqual(path.at(-1),goal);assertWalkable(start,path)}
});
test('Blocked or unreachable taps produce no automatic movement',()=>{
 assert.deepEqual(retreatRoute({x:216,y:785},{x:300,y:450},cabinBlocked),[]);
 const divided=(x,y)=>cabinBlocked(x,y)||y>500&&y<520;assert.deepEqual(retreatRoute({x:216,y:785},{x:212,y:352},divided),[]);
});
