# 退出确认与三种回归开场

点击右上角门形箭头「退出庄园」，可选择：

- **保存并退出**：立即写入当前进度和准确位置，然后停留在退出页，可放心关页。
- **不保存本次并退出**：恢复为本次进入前的存档，本次自动保存的更改也会撤回。退出确认页明确说明此行为。
- **再待一会儿**：取消退出，继续当前地图或观星场景。

退出后再次点击「再次进入庄园」，或以后重新打开网页，已接收庄园的玩家会轮流看到：

1. 月光来信：信封展开、信纸升起、星光散开。
2. 猫咪点灯：原来的魔女猫散步提灯，路径灯依次亮起，小幽灵迎接。
3. 花田晨曦：天空与山峦渐暖，太阳升起，花朵生长与花瓣漂浮。

开场约 5.2 秒，可跳过。三种开场独立于游戏存档轮换；即使这次不保存，下一次仍会换一种欢迎。第一次收到礼物时的信与庄园开门演出原样保留。回归开场不改变玩家坐标、剧情、糖果、昼夜或收藏，不会在手机切换后台时反复播放。

保存失败会留在确认页，提示失败并允许重试，不会谎报已保存。退出完成后暂停游戏，并阻止 pagehide / visibilitychange 等后续事件覆盖已经保存或回滚的结果。

浏览器通常不允许网页直接关闭用户打开的标签页，因此游戏内退出使用停留页。直接关闭浏览器或刷新时保留自动保存。手机系统强制关闭进程不保证触发任何退出事件，网页也不能强制弹出自定义「是否保存」框。仅在已发现写入失败、有进度风险时，临时注册原生 beforeunload 提醒；该提醒的样式、文案和是否出现由浏览器决定。

## 修改文件

- 新增 `src/session-config.js`：所有新增文案与开场时长。
- 新增 `src/session-model.js`：进入前快照、保存 / 回滚、退出后的写入保护、轮换序号。
- 新增 `src/entry-scene.js`：三种原创像素动画，复用原有猫咪、幽灵、女孩与风景素材。
- 新增 `src/session-ui.js` / `src/session.css`：退出确认、退出页、回归动画界面。
- 修改 `src/main.js`：退出入口、生命周期保存接入、回归演出接入。
- 新增单元测试与 Chromium / WebKit 浏览器流程测试；现有浏览器测试增加等待回归开场完成。

仍沿用 localStorage 的 `xiguang-manor-v1`，无存档重置。新增 `xiguang-manor-entrances-v1` 仅记录轮换序号。不上传数据。

本次前的 Git 回退点：`f99743b`。

## 参考资料

查阅官方建议，没有复制其他游戏的代码或资源：

- MDN beforeunload：https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
- MDN visibilitychange：https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
- Chrome 页面生命周期：https://developer.chrome.com/docs/web-platform/page-lifecycle-api
- Phaser 相机与补间说明：https://docs.phaser.io/phaser/concepts/cameras

## 验证

```bash
npm test
npm run build
# 启动 npm run dev 后：
node tests/session-journey.mjs
node tests/session-journey.mjs --webkit
```

WebKit 需先安装 Playwright 对应浏览器与依赖。自动化模拟不能替代真实 iPhone / 安卓设备验收。

本次验证：13 项单元测试和生产构建通过；Chromium 与 WebKit 手机模拟均实际播放了三种完整开场，并通过轮换、跳过、原位置恢复、退出取消、保存退出、撤回本次自动存档、退出后的 pagehide 防覆盖、观星中退出、存储失败与重试流程；无页面 JavaScript 错误。
