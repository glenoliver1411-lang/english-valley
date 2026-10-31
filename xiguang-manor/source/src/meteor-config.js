// 流星的数量、方向、寿命、拖尾、星尘及演出节奏集中在这里修改。
export const METEORS={
 duration:34, poolSize:8, dustPoolSize:48, lowDustLimit:20,
 limits:{idle:2,show:6,lowShow:4},
 angle:[20,40], rareAngle:[17,44], rareAngleChance:.08,
 idleInterval:[2.2,4.8], idleBrightChance:.065,
 colors:['#f3e4cc','#e9cca0','#bcd4e7','#c6b8dc'], colorWeights:[.43,.31,.21,.05], core:'#fff0d7',
 ordinary:{speed:[98,146],life:[.72,1.12],tailSeconds:[.18,.27],tailLength:[20,37],brightness:[.55,.84],dustChance:.10,bend:[-.7,.7]},
 bright:{speed:[88,116],life:[1.1,1.55],tailSeconds:[.26,.34],tailLength:[28,43],brightness:[.82,1],dustChance:1,bend:[-1.2,1.2]},
 xi:{speed:[74,84],life:[2.05,2.3],tailSeconds:[.48,.57],tailLength:[38,49],brightness:[.95,1],dustChance:1,bend:[-3,3],gold:'#f3d7a8',lavender:'#c6b6e1'},
 headFadeIn:.065, headFadeOut:.24, afterglow:.18,
 tailSamples:28, lowTailSamples:20, gapEvery:9,
 dust:{interval:[.13,.22],life:[.32,.66],drag:4.8,spread:5,brightness:.37},
 reflection:{brightness:.12,rows:5},
 caption:{start:24.2,fadeIn:.85,hold:1.8,fadeOut:1.15},
 phases:[
  {until:4,id:'calm',line:'夜很安静，群星轻轻闪烁'},
  {until:7,id:'first',line:'一束微光，斜斜掠过天际'},
  {until:15,id:'build',line:'远方的光，正陆续抵达'},
  {until:22,id:'peak',line:'把这一刻，留给星雨'},
  {until:26.4,id:'xi',line:'曦光流星，悄悄为你而来'},
  {until:34,id:'rest',line:'星雨远去，夜空又安静下来'}
 ],
 show:{firstAt:4.4,development:[7.5,14.4],developmentGap:[1.65,2.7],rise:[15,18],riseGap:[.6,.95],peak:[18.1,21.6],peakGap:[.24,.36],xiAt:21.85,closing:[25.8,28.1]},
 text:{dedication:'{name}，这片星空都属于你。',keepsake:'最后一颗流星，留下了一颗星星糖果。'}
};
