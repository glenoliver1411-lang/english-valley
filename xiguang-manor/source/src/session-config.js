// 退出与再次进入的全部文案。收礼人仍读取 config.js 的 recipient。
export const SESSION={
 duration:5.2,
 text:{exit:'退出庄园',exitTitle:'要把这次的心意保存下来吗？',exitNote:'选择保存，下次就从这里继续。',saveExit:'保存并退出',discardExit:'不保存本次并退出',cancel:'再待一会儿',discardNote:'不保存本次：会撤回本次进入后的自动存档，恢复到进入前的进度。',savedTitle:'庄园已经替你收好了',savedNote:'进度已保存在这台设备的浏览器里。下次回来，我们从这里继续。',discardedTitle:'回到进入前的那一页',discardedNote:'本次更改没有保留，进入前的存档仍在。',exitHint:'现在可以关闭页面，也可以再次进入庄园。',return:'再次进入庄园',saveFailed:'暂时无法写入存档，尚未退出。请检查浏览器是否允许本地存储，或继续游玩。',busy:'先关闭当前对话或等这段演出结束，再退出吧。',skip:'跳过开场',returnTag:'A LITTLE WELCOME, JUST FOR YOU',welcome:'欢迎回来，{name}',rotation:'三份不同的欢迎，轮流等你回家。',
 },
 openings:[
  {id:'moon-letter',title:'月光来信',line:'月亮捎来一封信：庄园一直在等你。'},
  {id:'cat-lantern',title:'猫咪点灯',line:'小猫把灯点亮了，今晚也欢迎你。'},
  {id:'flower-morning',title:'花田晨曦',line:'花儿与第一缕阳光，一起向你问好。'}
 ]
};
export const XT=SESSION.text;
