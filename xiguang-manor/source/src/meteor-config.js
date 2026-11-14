// 流星的数量、方向、寿命、拖尾、星尘及演出节奏集中在这里修改。
export const METEORS={
 variations:[{id:'moonfall',name:'月光来信',radiant:{x:1.8,y:-.08},speed:1,tail:1,gap:1},{id:'silvershore',name:'银湾星潮',radiant:{x:1.48,y:-.10},speed:.88,tail:1.1,gap:1.12},{id:'lavender',name:'暮紫星渡',radiant:{x:2.05,y:-.04},speed:1.12,tail:.9,gap:.92}],
 duration:34, poolSize:10, dustPoolSize:64, lowDustLimit:20,
 limits:{idle:2,show:6,lowShow:4},
 // Perspective: all paths recede towards one off-screen radiant, never a row of vertical strings.
 radiant:{x:1.8,y:-.08}, angle:[17,44], skyBottom:.54,
 field:{left:.12,right:.94,top:.09,bottom:.40,columns:4},
 distant:{chance:.44,speed:.58,tail:.55,brightness:.58},
 idleInterval:[4.8,8.5], idleBrightChance:.065,
 colors:['#f3e4cc','#e9cca0','#bcd4e7','#c6b8dc'], colorWeights:[.43,.31,.21,.05], core:'#fff0d7',
 ordinary:{speed:[88,132],life:[1.3,1.95],tailSeconds:[.32,.51],tailLength:[30,57],brightness:[.78,.98],dustChance:.06,bend:[-.35,.35]},
 bright:{speed:[90,116],life:[1.65,2.25],tailSeconds:[.48,.67],tailLength:[44,70],brightness:[.92,1],dustChance:1,bend:[-.5,.5]},
 xi:{speed:[61,68],life:[3.1,3.45],tailSeconds:[.94,1.18],tailLength:[68,92],brightness:[.98,1],dustChance:1,bend:[-.7,.7],gold:'#f3d7a8',lavender:'#c6b6e1'},
 headFadeIn:.16, headFadeOut:.42, afterglow:.38,
 tailSamples:32, lowTailSamples:24, gapEvery:13,
 tail:{alpha:.90,specialAlpha:.96,taper:1.25,fringe:.16},
 dust:{interval:[.13,.22],life:[.55,1.15],drag:4.8,spread:5,brightness:.48},
 reflection:{brightness:.12,rows:5},
 caption:{start:25.6,fadeIn:.85,hold:1.8,fadeOut:1.15},
 phases:[
  {until:4,id:'calm',line:'夜很安静，群星轻轻闪烁'},
  {until:7,id:'first',line:'一束微光，斜斜掠过天际'},
  {until:13,id:'build',line:'远方的光，正陆续抵达'},
  {until:24,id:'peak',line:'把这一刻，留给星雨'},
  {until:28.4,id:'xi',line:'曦光流星，悄悄为你而来'},
  {until:34,id:'rest',line:'星雨远去，夜空又安静下来'}
 ],
 show:{firstAt:4.4,development:[7.4,13],developmentGap:[1.25,2.1],rise:[13.4,16.5],riseGap:[.62,1.05],peak:[16.9,21.9],peakGap:[.22,.46],brightChance:.25,xiAt:24.1,closing:[29.3,30.4]},
 text:{dedication:'{name}，这片星空都属于你。',keepsake:'最后一颗流星，留下了一颗星星糖果。'}
};
