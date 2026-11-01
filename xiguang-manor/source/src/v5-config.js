export const V5={
 version:'V5.0',
 workshop:{brand:'{name}的月光糖果工坊',steps:['选一份配方','慢慢搅拌','温柔收火','甜蜜收藏'],recipePreview:'这一颗，按你的喜好制作',progress:'搅拌进度',shelf:'MOONLIGHT',shelfSmall:'CONFECTIONERY'},
 labels:{home:'{name}的生活收藏',wardrobe:'糖果换来的小小心动',review:'V5 美术重制实机对比'}
};
// Interior glass follows the authored arch; rain and snow stay off the curtains.
export function v5WindowContains(x,y){return x>=129&&x<=302&&y>=61&&y<=226&&(y>=126||((x-215.5)/86.5)**2+((y-130)/69)**2<=1)}
