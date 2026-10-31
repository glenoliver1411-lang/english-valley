# 曦光庄园：万圣夜的礼物 · V4.0

“你的名字好美，所以我送给你一座庄园。”

Phaser 3 + JavaScript + Vite 的手机竖屏像素庄园。沿用原地图与角色，加入可散步的秘密花园、小屋和分层湖畔风景。没有 NPC、顾客、任务或每日登录要求。

**公开试玩**：https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/

在普通浏览器打开即可，不需要 GitHub 或 ChatGPT 登录。存档保存在当前浏览器本地。

## 启动和构建

需要 Node.js 20.19+ 或 22.12+。

```bash
npm ci
npm run dev
npm run build
npm run preview
```

`dist/` 是完整静态网页，Vite 的 `base: './'` 支持 GitHub Pages 子目录。不能直接双击源 HTML 运行。

现有仓库 `glenoliver1411-lang/english-valley` 的 `.github/workflows/pages.yml` 发布整个仓库；将 `dist/` 内的文件放进 `xiguang-manor/`，源码放进 `xiguang-manor/source/`，提交 main 后由 Actions 发布。不要改动仓库根目录原来的 English Valley 游戏。详细记录见 [V4_ROMANTIC_WORLD.md](V4_ROMANTIC_WORLD.md)。

观景星空已追加细碎星河美化：深蓝紫夜色、自然星团、蓝白与浅金星点、细光芒专属星、湖面碎光、薄云与垂花。保留现有角色、地图和全部玩法。

## 自由游玩

- 接收信件后，全部区域直接开放。摇杆 / WASD / 方向键移动，点物件或靠近后点互动，E / 空格也可互动。
- 原地图：右下小屋可进入，左下花拱门通往秘密花园，池塘木桥打开湖畔与遗迹入口，望远镜进入观星。也可用「在庄园里漫游」选择区域。
- 星空：点特殊星星收藏、命名、留下独立心愿；「送我一场流星雨」随时演出，最后可收下星星糖果。回忆册可重播流星雨、日出和烟花。
- 湖畔：「静静看一会儿」隐藏操作和任务界面，无奖励与倒计时。退出欣赏或拍照均可随时使用。
- 日出：湖畔、屋顶或窗前观看，天空、太阳、山峦、湖面与近景连续变化，结束回到清晨的探索。
- 秘密花园：六块花圃可选四种花，浇水后二十秒舒展、一分钟开花，采摘进入收藏；离线继续生长。树、秋千、水池、树洞与草地都有可选互动。
- 小屋：窗外可选晴天、细雨或薄雪；壁炉、窗前座位、床、衣橱、书架与信箱可互动。三套房间色彩，星星礼物可放在房间或挂回夜空。雨停后有彩虹。
- 猫咪：取名、抚摸、跟随或自由休息，没有喂养义务和惩罚。
- 糖果屋：九种配方、搅拌与收火小游戏、记忆游戏、配方收藏、礼盒拖放包装；制作糖果可兑换六套原有服装。旧顾客订单玩法已停用，旧订单统计作为历史数据保留。
- 原有三颗魔法糖、重复糖果、四块老花田、遗迹寻珍、三种技能、烟花、换装与拍照保留。
- 音乐默认关闭，可启用原创合成旋律与环境声。回忆册内有低特效与静止风景模式；慢设备也会自动减少粒子。
- 万圣节和演出无真实日期限制。

## 配置和存档

`src/config.js` 修改收礼人 `recipient`、开场信与原文案。`src/romantic-config.js` 修改 V4 场景名称、短句、花种、房间色彩；`scenery-config.js` / `fireworks-config.js` / `candy-config.js` / `adventure-config.js` / `session-config.js` 分别控制对应玩法。

名字使用 `{name}` 替换。没有收集或上传任何个人信息。

localStorage 继续使用 `xiguang-manor-v1`，新增 `romance` 字段，自动迁移旧存档。刷新保留花圃、收藏、心愿、服装和喜好；重新打开从原地图安全位置进入。换域名、换浏览器或清除站点数据不会自动转移存档。

右上退出按钮：保存退出 / 不保存本次并退出 / 取消。不保存会恢复本次进入前的快照，包括已经自动保存的 V4 更改。三种回归开场轮换，可跳过。直接关闭浏览器页签仍按浏览器限制自动保存，无法强制弹出自定义退出对话。

## 检查

```bash
npm test
# 先保持开发服务器运行，再运行浏览器测试
npx playwright install chromium webkit
node tests/journey.mjs
node tests/romantic-journey.mjs
node tests/retreat-view-journey.mjs
node tests/meteor-journey.mjs
node tests/nature-journey.mjs
node tests/candy-journey.mjs
node tests/adventure-journey.mjs
node tests/session-journey.mjs
node tests/fireworks-journey.mjs
node tests/romantic-journey.mjs --webkit
```

WebKit 所需系统依赖按 Playwright 安装说明配置。开发环境可使用 `WEBKIT_PORTABLE_BIN` 指定可用的 WebKit 启动程序。浏览器自动化使用手机尺寸与真实点击/拖动，并通过仅在开发构建存在的只读测试入口辅助定位；正式站点不暴露入口。模拟不能替代真实手机验收。

素材全部为原创代码像素绘图与 Web Audio 合成，无付费图片 API、下载素材或运行时第三方资源外链。详见 [ASSETS.md](ASSETS.md)。

星光、草风与采花反馈：星星会独立明暗闪烁，草坪上的小草随阵风弯曲，草屑轻轻飘散。原花田和秘密花园的四种花分别触发「蔷薇心语 / 月光涟漪 / 暮紫星环 / 曦光萤舞」，成熟后采摘即可体验。`src/nature-config.js` 可调整闪烁、粒子上限与特效文案。
