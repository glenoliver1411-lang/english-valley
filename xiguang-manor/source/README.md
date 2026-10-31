# 曦光庄园：万圣夜的礼物

公开试玩：https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/

无需登录 GitHub 或 ChatGPT。游戏包含完整庄园剧情、糖果工坊、猫咪花田、遗迹寻珍、换装、星空、流星雨、日出与可点放烟花。

本目录是完整源码；上一级目录是已构建的静态网页。原 English Valley 网站文件保持原样。

## 本地运行

需要 Node.js 20.19+ 或 22.12+。

```bash
npm ci
npm run dev
```

```bash
npm test
npm run build
```

所有图片和音效均在本地由代码生成，无第三方图片外链、后端或模型 API。

## 修改与发布

`src/config.js` 配置收礼人和原剧情；各 `*-config.js` 配置新玩法文案和参数。构建后将 dist 的内容更新到本目录的上一级，再提交 main，现有 Pages 工作流会发布。

存档只存在当前浏览器的 localStorage；换设备、浏览器或域名不会自动同步。GitHub Pages 网址使用独立于旧站点的存档。

素材来源见 ASSETS.md，各功能说明与验证见相应 Markdown 文档。
