# 角色自定义正式发布 · 2026-11-15

玩家明确要求「覆盖正式版」后，将独立预览 identity-20261115-1 按正式路径重新构建为 full-stage1-identity-20261115-1。

正式地址：https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/

正式入口：https://glenoliver1411-lang.github.io/english-valley/xiguang-manor/enter-stage1.html

此前的 identity-preview 及其他预览保持原样。人物分层素材、七套原服装的整套限制及待精修项与验收版本一致，详见 IDENTITY_RELEASE.md 和 MISSING_IDENTITY_ART.md。本次未扩大玩法范围。

## 更新安全

- 保持原 Manifest id、scope 和单存档键 xiguang-manor-v1；昵称、猫咪、穿搭和全部游戏进度沿用。
- 正式 base 重新构建，动态 import、美术与离线缓存均指向正式目录，不能把预览 HTML 原样复制到根目录。
- 新的版本专属游戏文件与小型正式入口先打开游戏，不等待完整离线包。
- 旧版继续可玩，完整下载后仍由玩家确认保存并更新。
- Service Worker 激活后，把当前正式 scope 内旧版本命名的主屏幕启动地址导航到最新的完整缓存文件；不影响预览 scope，不改动存档，也不自动刷新正在玩的页面。
- 保留旧内容哈希资源及历史发布文件，给已打开旧页面继续使用；离线清单仅包含本次实际依赖。

## 验证

126项模型测试通过。tests/identity-formal-update.mjs 在真实生产构建与正式 scope 下安装上一正式版，再确认更新，检查全部旧进度、修改人物/猫咪、关闭整个浏览器、断网重开旧主屏幕地址及原正式根目录。浏览器结果附在正式 identity-review/formal-release.json；不将自动化 WebKit 当作 iPhone 实机测试。

回退点：rollback/identity-formal-20261115。发布分支：release/identity-formal-20261115。身份系统源码与逐项素材许可保留于原项目目录。
