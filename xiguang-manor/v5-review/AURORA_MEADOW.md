# 花海极光：独立风景页面

这次将极光从原世界的天空渲染中移出，而不是继续调亮度叠加。

- 新增真实的 Vite 多页面入口 `aurora.html`。直接打开可欣赏，无需注册或完成剧情。
- 花海里的「去花海看极光」进入独立页面；风景回忆册也提供入口。
- 湖畔、屋顶、窗前和主地图不再创建或绘制极光，包括湖面极光倒影。已有 `aurora` 偏好仍保留在旧存储中，避免变更旧格式，但不再控制原场景。
- 独立页面以已有 V5 花草、山景、长椅和小曦坐姿重新构图；柔和光幕只在花海上空出现。不叠加银河云、流星雨或烟花演出。
- 可静止动态、收起界面、独立开关音乐和导出 864px 宽 PNG。iPhone 可长按预览保存。
- 从花海前往时先保存原进度，保存失败时停留在游戏并给出提示。通过 sessionStorage 暂记花海位置，返回时恢复该位置并跳过重复欢迎；无法暂存时回到花海默认位置。
- 独立页面只读取 v1 游戏档案以使用原服装及偏好，不写回游戏进度或改变游戏时钟。静止偏好使用新的独立键 `xiguang-meadow-aurora-v1`。
- 遵守首次点击后启用音频的浏览器限制，后台暂停渲染，低性能设备降低光幕更新频率。

## 修改文件

新增：`aurora.html`、`src/aurora-config.js`、`src/aurora-navigation.js`、`src/aurora-meadow-art.js`、`src/aurora-page.js`、`src/aurora-page.css`。

接入：`vite.config.js`、`src/romantic-ui.js`、`src/scenery-ui.js`、`src/main.js`、`src/romantic.css`。

移出原场景极光：`src/environment.js`、`src/sky-scene.js`、`src/lakeside-background.js`；`src/aurora.js`新增可配置强度供独立页面使用。

验证：更新`tests/aurora-journey.mjs`、`tests/world-atmosphere-journey.mjs`；新增静态页面检查`tests/aurora-production.mjs`。

## 素材与运行

没有新增外部素材或付费资源。沿用已在 `V5_ASSET_CREDITS.md` 记录的 karsiori CC0 花草和山景、本地原创图集、原创角色坐姿和合成音乐。

```bash
npm ci
npm run dev
# http://localhost:5173/aurora.html
npm run build
npm run preview
# http://localhost:4173/aurora.html
```

同一构建目录同时包含原游戏`index.html`与独立风景`aurora.html`，继续使用相对路径，适用于GitHub Pages子路径。本次继续在 `v5/art-remaster` 开发，原正式main未覆盖。回退标签为 `before-meadow-aurora-20261101`。

## 本轮验证

Chromium与WebKit的真实页面导航、四处原天空无极光、花海位置恢复、静止／隐藏界面／音乐、864px PNG导出及375/430px手机视口通过。Chromium原自动流星雨、烟花、四时段、屋顶／窗前与旧档回归通过。62项单元测试通过。

Vite多页面静态构建通过；WebKit对实际构建产物的独立页面、无开发入口、拍照、返回、静止偏好和旧档检查通过。

后续美术精修：独立页面已改用原创回卷光场与专用后视长椅，并支持关闭全部选项、双击画面恢复。美术研究、实机截图和原速视频见[AURORA_ART.md](AURORA_ART.md)。
