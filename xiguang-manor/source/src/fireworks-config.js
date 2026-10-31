// 烟花独立配置；不改原流星雨、日出与庄园时间。
export const FIREWORKS={
 duration:30,
 maxSparks:900,lowSparks:280,maxRockets:10,
 styles:[{id:'gold',name:'金色繁花',color:'#ffe4ae'},{id:'willow',name:'垂柳流金',color:'#eec37c'},{id:'heart',name:'心愿花火',color:'#e9b2c6'}],
 text:{title:'曦光花火',start:'放烟花',replay:'再看一场烟花',hint:'轻点天空点放一束 · 金色花火会在夜空慢慢绽开',launch:'点燃一束',auto:'自动花火秀',manual:'自由点放',end:'结束烟花',show:'一场只为{name}绽放的花火',greeting:'{name}，今晚的花火，\n也只为你盛开。',phases:['点亮第一束，等它升上夜空','金色花瓣，慢慢铺满夜色','让细碎的星火，替你留住这一刻','最后这一朵，把心愿送给你','天空安静下来，还可以继续亲手点放'],seen:'烟花回忆已收好，随时可以重看。',busy:'等这一束升上去，再轻轻点一下吧。',sky:'轻点天空，选择想让花火盛开的位置',choose:'选择花火',photo:'拍下这片花火'},
 schedule:[
  {at:.7,x:.48,y:.33,style:'gold'},
  {at:4.0,x:.30,y:.30,style:'willow'},{at:5.4,x:.70,y:.27,style:'gold'},
  {at:8.0,x:.50,y:.26,style:'gold'},
  {at:10.3,x:.27,y:.36,style:'gold'},{at:11.3,x:.73,y:.35,style:'willow'},
  {at:14.0,x:.49,y:.24,style:'willow'},
  {at:16.5,x:.30,y:.31,style:'gold'},{at:17.2,x:.68,y:.28,style:'gold'},
  {at:20.1,x:.50,y:.28,style:'heart'},
  {at:23.1,x:.32,y:.33,style:'willow'},{at:23.8,x:.68,y:.32,style:'gold'},
  {at:25.7,x:.50,y:.26,style:'gold'}
 ]
};
export const FT=FIREWORKS.text;
