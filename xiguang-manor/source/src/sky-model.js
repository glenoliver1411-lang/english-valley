export const lerp=(a,b,t)=>a+(b-a)*Math.max(0,Math.min(1,t));
export function rgb(hex){const n=typeof hex==='number'?hex:parseInt(hex.replace('#',''),16);return[(n>>16)&255,(n>>8)&255,n&255]}
export function mix(a,b,t){a=rgb(a);b=rgb(b);return'#'+a.map((v,i)=>Math.round(lerp(v,b[i],t)).toString(16).padStart(2,'0')).join('')}
export function hourPhase(hour){hour=((hour%24)+24)%24;return hour>=5&&hour<9?'morning':hour>=9&&hour<17?'day':hour>=17&&hour<20?'dusk':'night'}
const stops=[
 [0,{top:'#151e40',bottom:'#655579',far:'#525473',mid:'#3b465f',near:'#303e50',night:1,day:0}],
 [4,{top:'#1d284d',bottom:'#746386',far:'#5a5d7c',mid:'#424c66',near:'#354658',night:1,day:0}],
 [5,{top:'#38385e',bottom:'#bb8fa5',far:'#82718f',mid:'#64647e',near:'#465769',night:.8,day:.12}],
 [5.8,{top:'#77719b',bottom:'#f3b8a0',far:'#b891a8',mid:'#907f9a',near:'#607484',night:.33,day:.4}],
 [7,{top:'#adafca',bottom:'#ffe1b2',far:'#b6aaa9',mid:'#93a2a1',near:'#6f8c89',night:0,day:.8}],
 [9,{top:'#8bb3cb',bottom:'#e6d3bb',far:'#a4bdc1',mid:'#7ea3aa',near:'#628e91',night:0,day:1}],
 [16,{top:'#9cacc8',bottom:'#f1d5b4',far:'#b7b6be',mid:'#91a0aa',near:'#748e94',night:0,day:1}],
 [18,{top:'#655c86',bottom:'#ecaa99',far:'#9f849c',mid:'#796d8e',near:'#535e77',night:.35,day:.35}],
 [20,{top:'#252a50',bottom:'#806484',far:'#65617f',mid:'#4e506f',near:'#3a455d',night:1,day:0}],
 [24,{top:'#151e40',bottom:'#655579',far:'#525473',mid:'#3b465f',near:'#303e50',night:1,day:0}]
];
export function skyPalette(hour){hour=((hour%24)+24)%24;let i=stops.findIndex(([h])=>h>hour);if(i<1)i=stops.length-1;const[a,A]=stops[i-1],[b,B]=stops[i],t=(hour-a)/(b-a);return Object.fromEntries(Object.keys(A).map(k=>[k,typeof A[k]==='number'?lerp(A[k],B[k],t):mix(A[k],B[k],t)]))}
export function sunriseHour(p){const frames=[[0,3],[.18,5],[.4,5.8],[.68,6.6],[1,8]];for(let i=1;i<frames.length;i++)if(p<=frames[i][0])return lerp(frames[i-1][1],frames[i][1],(p-frames[i-1][0])/(frames[i][0]-frames[i-1][0]));return 8}
export function meteorPhase(seconds){return seconds<4?0:seconds<10?1:seconds<22?2:seconds<27?3:4}
export function sceneryDefaults(){return {clock:22,visited:false,stars:[],names:{},wish:'',meteorSeen:false,dawnSeen:false,starCandy:false,lowEffects:false,photos:0,fireworksSeen:false,fireworkStyle:'gold'}}
export function sanitizeScenery(raw,ids){const d=sceneryDefaults();if(!raw||typeof raw!=='object')return d;d.clock=Number.isFinite(raw.clock)?((raw.clock%24)+24)%24:22;d.stars=Array.isArray(raw.stars)?[...new Set(raw.stars.filter(v=>ids.includes(v)))]:[];for(const id of ids)if(id!=='xi'&&typeof raw.names?.[id]==='string')d.names[id]=raw.names[id].slice(0,16);d.wish=typeof raw.wish==='string'?raw.wish.slice(0,100):'';for(const k of ['visited','meteorSeen','dawnSeen','starCandy','lowEffects','fireworksSeen'])d[k]=!!raw[k];d.fireworkStyle=['gold','willow','heart'].includes(raw.fireworkStyle)?raw.fireworkStyle:'gold';d.photos=Math.max(0,Math.min(99999,Number(raw.photos)||0));return d}
