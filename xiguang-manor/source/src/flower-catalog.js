// Stable IDs: the original four keep their prices and all old save meanings.
export const FLOWERS=[
 {id:'rose',name:'晚风玫瑰',gardenName:'草莓蔷薇',price:2,color:'#e7a5bd',center:'#ffe5b4'},
 {id:'lily',name:'奶油百合',gardenName:'月光铃兰',price:2,color:'#eee1d1',center:'#c4b6d7'},
 {id:'aster',name:'雾紫星花',gardenName:'暮紫星花',price:3,color:'#b7a4d4',center:'#f4d3a4'},
 {id:'glow',name:'月光铃兰',gardenName:'曦光萤花',price:4,color:'#c5dac0',center:'#fff0bc'},
 {id:'lavender',name:'晚风薰衣草',price:3,color:'#b39bd3',center:'#e8dafa',effect:'紫雾轻旋',pattern:'spiral'},
 {id:'sunflower',name:'暖阳向日葵',price:2,color:'#edc55d',center:'#a87b4b',effect:'暖阳微芒',pattern:'rays'},
 {id:'tulip',name:'晨露郁金香',price:3,color:'#e8adb6',center:'#fff0d6',effect:'花笺轻舞',pattern:'cups'},
 {id:'daisy',name:'奶油雏菊',price:2,color:'#f1e8d6',center:'#e7bd69',effect:'雏菊清风',pattern:'daisies'},
 {id:'hydrangea',name:'雾蓝绣球',price:4,color:'#aab9dd',center:'#e4e4f5',effect:'蓝雾花簇',pattern:'clusters'},
 {id:'peony',name:'粉霞芍药',price:4,color:'#dda2b7',center:'#f7d7ce',effect:'粉霞绽放',pattern:'bloom'},
 {id:'iris',name:'月影鸢尾',price:3,color:'#9d9bce',center:'#efd895',effect:'鸢尾回旋',pattern:'helix'},
 {id:'cosmos',name:'秋日波斯菊',price:2,color:'#dda9c4',center:'#f4dfa4',effect:'花海星语',pattern:'stars'}
];
export const flowerById=id=>FLOWERS.find(f=>f.id===id);
export const MEADOW_FLOWERS=FLOWERS.map((f,i)=>({...f,x:[165,300,168,300,164,312,165,300,143,275,135,265][i],y:[410,410,465,465,520,520,575,655,709,710,766,766][i]}));
