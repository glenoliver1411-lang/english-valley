# 小屋坐姿与窗户修复 · reference-art-20261106-2

试玩：<https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/reference-art-preview/?v=reference-art-20261106-2>

实机记录：<https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/reference-art-preview/reference-review/seat-fix/>

## 修复

- 坐姿：原来每帧 `idle()` 先赋回站立贴图，坐姿仅在 30/16 Hz 的环境绘制中恢复。现在角色状态独立于环境刷新频率，坐下期间始终保持坐姿贴图和稳定的遮挡深度。起身先退出坐姿，再恢复行走贴图；不会因打开拍照或降低特效而反复切换。
- 窗户：LPC 开帘素材中央含一根独立备用横杆，组合时误落在玻璃里。只在制作裁切中移除这根横杆，保留帘布、窗框、山景和全部原始上游文件。修正三个墙面版本及可摆放蕾丝帘的展开态，其他 55 个图块逐像素不变。

修改：`src/romantic-scene.js`、`tools/build-reference-art.py`、`src/assets/reference/{atelier.png,SOURCES.json}`；新增两个浏览器回归脚本 `tests/seat-window-{regression,public}.mjs` 与实机记录。

## 验证

- 回退版本能复现「坐下期间仍赋站立贴图」的回归失败；晨间窗玻璃存在 80px 的连续深色线。
- Chromium 与 WebKit 分别采样正常／低特效下的坐椅与窗前状态，每个条件 90 帧。修复后坐椅的 180 帧无站立贴图赋值，遮挡深度稳定；窗玻璃的连续黑线为 0。
- 两个内核均验证起身、坐下时拍照与返回；六件商品的购买、摆放、开关、两种坐姿回归通过。
- 发布构建在两内核完成联网完整缓存→浏览器断网并刷新→第一次进入小屋→真实触屏走到阅读椅→坐下／拍照／起身→走到窗前／起身。糖果、猫名和原家具布局核对通过。
- 原有 94 项 Node 测试通过。只更新现有独立美术预览，未覆盖其他稳定版本；存档键和数据结构不变。

这轮没有修改极光、角色身份、经济或其他玩法。缓存采用新版本号；已安装旧版的玩家在提示后选择「保存进度并更新」，无需清空网站数据。
