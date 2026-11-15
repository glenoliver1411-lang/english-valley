// Public life-game identity. No gender locks and no gameplay prices.
const items=(rows)=>rows.map(([id,name])=>({id,name}));
export const IDENTITY={
 hair:items([['short','短发'],['medium','中长发'],['long','长发'],['curly','卷发'],['ponytail','马尾'],['twintails','双马尾']]),
 hairColors:items([['black','墨黑'],['darkBrown','深棕'],['lightBrown','浅棕'],['gold','麦金'],['silver','银白'],['blueGray','灰蓝'],['lavender','雾紫']]),
 eyes:items([['round','圆眼'],['soft','温柔眼'],['narrow','细长眼'],['bright','明亮眼']]),
 eyeColors:items([['dark','深棕'],['blue','湖蓝'],['green','叶绿'],['hazel','浅榛'],['gray','雾灰'],['violet','淡紫']]),
 brows:items([['thin','细眉'],['thick','浓眉']]),expressions:items([['calm','平静'],['smile','微笑'],['focused','专注']]),
 bangs:items([['natural','自然刘海'],['fringe','柔软额发']]),
 tops:items([['shirt','白衬衫'],['plaid','格纹衬衫'],['tshirt','T 恤'],['knit','针织衫'],['sweater','毛衣'],['hoodie','卫衣'],['jacket','开衫外套'],['vest','马甲']]),
 bottoms:items([['jeans','牛仔裤'],['casual','休闲长裤'],['wide','宽松裤'],['shorts','短裤'],['cargo','工装裤'],['longskirt','长裙'],['shortskirt','短裙']]),
 shoes:items([['sneakers','运动鞋'],['leather','皮鞋'],['canvas','帆布鞋'],['boots','靴子']]),
 accessories:items([['hat','软帽'],['hairclip','发带'],['glasses','圆框眼镜'],['scarf','围巾'],['backpack','背包']]),
 coats:items([['orange','橘猫'],['white','白猫'],['black','黑猫'],['gray','灰猫'],['tuxedo','奶牛猫'],['calico','三花猫'],['tabby','虎斑猫']]),
 catEyes:items([['blue','湖蓝'],['green','叶绿'],['amber','琥珀'],['dark','深棕']]),
 catEars:items([['natural','自然耳'],['soft','柔软耳尖']]),catTails:items([['full','蓬松尾'],['small','小尾尖']]),
 catPatterns:items([['native','原生花纹'],['light','浅色花纹']]),
 collars:items([['none','无项圈'],['forest','森林绿'],['blue','雾蓝'],['cream','米白'],['berry','莓红']]),
 catAccessories:items([['none','不佩戴'],['bow','蝴蝶结'],['bell','小铃铛']]),
 colors:{black:'#393644',darkBrown:'#654737',lightBrown:'#a77952',gold:'#d6b16a',silver:'#d9dde0',blueGray:'#7a94ae',lavender:'#a28cba',dark:'#453b36',blue:'#709fb9',green:'#6f9875',hazel:'#b89b65',gray:'#929ca6',violet:'#a08bbc',amber:'#d5a35d',forest:'#6a846c',cream:'#e8ddbd',berry:'#af6773'},
 directions:['正面','左侧','右侧','背面'],slots:5,
};
export const defaultAppearance=()=>({hair:'short',hairColor:'darkBrown',eyeShape:'soft',eyeColor:'dark',brows:'thin',expression:'calm',bangs:'natural',top:'shirt',bottom:'jeans',shoes:'sneakers',accessories:[]});
export const defaultCat=()=>({custom:true,coat:'orange',eyes:'green',ears:'natural',tail:'full',pattern:'native',collar:'forest',accessory:'none'});
