# 曦光庄园：完整离线游玩与存档保护

这一阶段只发布到 [PWA 独立预览](https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/experience-preview/?v=pwa-offline-20261106-1)。正式版 `xiguang-manor/index.html` 与正式版资源不变。开发分支为 `pwa/offline-stage1`，修改前回退标签为 `before-pwa-stage1-20261106`。

已发布版本 `pwa-offline-20261106-1`，GitHub Pages 部署成功，公网 Chromium／WebKit 安装核验及离线主页面、花海、极光往返均通过。当前完整资源 **31 项 / 2,362,463 字节（约 2.25 MiB）**；另有 64 字节的内部激活标记及浏览器单独保存的 24,272 字节 Service Worker 脚本。正式版页面发布前后的 SHA-256 相同。

## 玩家使用

第一次需要联网打开预览，等出现「庄园已经准备好，可以离线游玩」。也可以在**庄园手记 → 离线游玩 · 安装与存档**查看逐项核验后的缓存状态、资源数量、大小与版本。未准备完整会明确提示重试，不把“Service Worker 注册成功”当作完成。

iPhone：使用 Safari 打开 → 分享 → 添加到主屏幕 → 添加。主屏幕应用第一次打开后也应检查离线就绪状态。添加前建议导出 JSON；若 Safari 与主屏幕应用中的进度不同，可导入备份。安卓：浏览器提供安装事件时才显示真正的安装按钮；其他情况给出浏览器菜单指引。安装提示可以关闭，至少七天内不再主动提醒。

无需安装也能在支持 Service Worker 的普通浏览器离线打开已缓存的预览地址。第一次完全没有网络时无法安装；清除网站数据、隐私浏览或系统回收存储后，需要重新联网准备。离线缓存不是永久保管存档的替代品。

## 缓存与更新

- `vite-plugin-pwa` InjectManifest + Workbox；`sw.js` 就在预览目录内，作用域、manifest 的 id/start_url/scope 均限定为 `/english-valley/xiguang-manor/experience-preview/`。不注销正式版或其他应用的 worker，不清理其他作用域缓存。
- 从**干净的当前 Vite 构建**建立清单：两个 HTML、CSS、全部当前 JS（包括按需加载）、Phaser、当前图集与解码回退 PNG、实际使用的山景图片、manifest 和三种图标。现有音乐、雨声、环境声由本地 JavaScript 合成，没有遗漏的音频外链。
- 不缓存截图、文档、测试工具、原件目录、旧发行包遗留文件或第三方网站。开发服务器不注册 worker，离线验收使用 production 构建。
- 每项资源带构建生成的 SHA-256 完整性校验。安装完整成功后才能激活；客户端进一步逐项读取缓存确认状态。缺项时不显示就绪，可联网通过 Workbox 补齐并重新检查。首次安装失败后，只在没有本预览活动／安装中／等待中 worker 时清理本作用域未激活的半成品缓存，再重新安装，避免 WebKit 重用失败缓存。完整版本及其他应用不受影响。
- 页面启动不等待完整离线安装：原有独立信封仍可先阅读。离线准备在主场景完成初始化后开始，不以“推迟交互”伪造启动速度。
- 再次联网只下载等待中的完整新版本。提示「庄园有新的变化，想现在更新吗？」；只有回到主庄园、玩家确认、当前存档写入成功且本机更新前备份成功后，才允许激活并刷新。制作、布置、遗迹、观景、开场、隐藏界面和其他弹窗期间不主动打断。
- 多个庄园窗口同时打开时拒绝激活，要求先关闭其他窗口。更新操作锁住输入，刷新前不会再让旧内存状态覆盖导入／更新结果。
- 当前与上一份完整发行缓存暂时并存，保证旧内存引用的哈希模块可用；只有新页面证实版本一致后才清理更旧的本预览缓存。因此安全更新后存储用量可接近两份资源，另有浏览器元数据开销。

## 存档

继续使用 `xiguang-manor-v1`，未改版号或删改原字段。糖果、服装、遗迹、家具、花朵、剧情、猫名、天气、音乐与星空喜好沿用原保存逻辑。普通联网／断网不会迁移或清空记录。

读取失败、JSON 损坏或未知版本时，停止自动写入，并显示恢复界面；不会把内存中的空白展示数据自动覆盖回原存档。单次写入失败保留当前内存进度及上次成功记录，允许重试。

导出生成本地 JSON，无上传。导入先检查大小、格式和版本，展示摘要；取消不会写入。明确确认后先保留 `xiguang-manor-v1:before-import` 原始记录，再一次性替换主键并重开。更新前另保留 `:before-update`。这些辅助键不改变原 v1 数据格式，也不是云端备份；建议玩家自行保存下载的 JSON 文件。

同一个 GitHub Pages 来源下，预览与正式版仍共用用户要求保留的存档键。Service Worker 与缓存则严格按路径隔离。

## 验收证据

两种浏览器均已通过完整断网旅程、更新与六项故障恢复检查；79 项单元测试通过。测试发行包每版实际核验 31 项资源、2,362,443 字节（约 2.25 MiB），另有一个内部激活标记。正式预览构建及公网核验的准确数字见下列记录。

缓存数量、体积和浏览器结果见本轮的 `public/pwa-review/results.json`（含本地 A/B 更新测试及实际 HTTPS 公网核验）；截图也位于该目录。资源体积按 Cache Storage 中解压后的响应体逐项相加，不冒充网络压缩流量或设备总占用。Workbox 构建日志可能包含重复追加的 manifest 条目；运行时去重，以实际核验数量为准。激活标记是额外的一个内部缓存项。

自动化使用 Chromium／WebKit 手机视口。联网安装后关闭整个持久化浏览器进程，保留用户数据目录，重启时同时设置浏览器 offline 和测试服务器 HTTP 503；随后用实际按钮／触摸进入从未打开过的懒加载场景。没有使用开发态 `__manor` 跳过离线验收步骤。在线更新由同一路径下的 A/B 两个 production 构建模拟。

已覆盖的验证项与最终结果以 `results.json` 为准，包括离线采花、完整制作糖果、触摸移动家具、遗迹取宝、独立极光往返、退出与闭浏览器后进度、等待更新、失败存储与多窗口拦截、导出／导入预览及确认、缺失资源与坏存档恢复。

限制：WebKit 自动化不等于真实 iPhone。iOS 原生“添加到主屏幕”界面、Safari 与主屏幕应用的数据容器、系统清理策略，以及真实飞行模式与后台进程回收，需要在真机上复核；没有声称这些原生行为已经自动化验证。安卓原生安装确认框同样取决于浏览器环境。

## 构建和复测

```bash
npm ci
npm test
npm run build:pwa:preview
```

构建默认生成唯一时间版本号；可用 `MANOR_RELEASE` 指定**每次发布都不同**的版本号。`.env.pwa-preview` 固定预览 base，避免误控制正式版。不要将此模式生成的 HTML 移动到其他部署目录。

装好 Playwright Chromium 和 WebKit 后，可运行完整生产环境断网检查：

```bash
node tools/check-pwa.mjs
```

若环境使用独立的 WebKit 启动器，可设置 `WEBKIT_PORTABLE_BIN`。测试结果写入忽略提交的 `verification/pwa-results/`，两个测试发行包位于新建的系统临时目录。测试服务器的故障注入接口仅在本地工具中，正式游戏没有这些接口。

将构建分发到现有仓库时，只更新预览与本游戏源码：

```bash
python tools/stage-release.py /path/to/english-valley --preview experience-preview
```

## 主要文件

`vite.config.js`、`.env.pwa-preview`、`tools/offline-manifest.js` 负责构建清单；`src/sw.js` 负责 Workbox 缓存和版本生命周期；`src/pwa-service.js` 负责注册、状态和确认激活；`src/pwa-ui.js`／`pwa.css`／`pwa-config.js` 负责安装、更新和备份界面；`src/backup-model.js`、`src/save.js` 负责校验和保护；`main.js`、`early-gift.js`、`aurora-page.js` 只增加必要接点。图标及软件依赖来源见 `ASSET_CREDITS.md`。

公网手机视口截图：[Chromium 离线状态](public/pwa-review/chromium-published-offline.png) · [WebKit 离线状态](public/pwa-review/webkit-published-offline.png)。本机完整原始测试结果写入 `verification/pwa-results/`。原有手机体验回归在两个引擎通过：五种视口、摇杆、独立开场、重复场景清理与极光往返；其中 WebKit 在并行构建时曾有一次原有 180ms 摇杆时序断言失败，隔离重跑原测试通过，没有修改移动逻辑或放宽断言。
