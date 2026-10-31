// 星光、草风与四种采花特效；所有新增文案放在这里。
export const NATURE={
 twinkle:{floor:.045,power:1.8,rate:1.13,spread:.78,brightCount:230,lowAnimated:76},
 grass:{count:105,lowCount:52,pool:18,lowPool:7,interval:[.38,.85],life:[2.4,3.7],speed:[12,23]},
 flowers:{rose:{name:'蔷薇心语',duration:2.1,color:'#e8a6c1',light:'#ffe1d0'},lily:{name:'月光涟漪',duration:2.0,color:'#e8e1d2',light:'#bbdce4'},aster:{name:'暮紫星环',duration:2.2,color:'#baa4e0',light:'#ffe6be'},glow:{name:'曦光萤舞',duration:2.3,color:'#c2dcb2',light:'#ffdf9c'}},
 flowerPool:6,particles:22,lowParticles:12,
 text:{picked:'收好{flower} · {effect}'}
};
export function starTwinkle(time,phase=0,speed=.5){const pulse=(.5+.5*Math.sin(time*(NATURE.twinkle.rate+speed*NATURE.twinkle.spread)+phase))**NATURE.twinkle.power;return NATURE.twinkle.floor+(1-NATURE.twinkle.floor)*pulse*(.86+.14*Math.sin(time*.23+phase*1.9)**2)}
