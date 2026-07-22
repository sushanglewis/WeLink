## Why

Issue-11 需要为现有 Mattermost B/S 二开系统打造企业自有品牌的 Windows/macOS 桌面应用 EAIC，解决浏览器访问体验割裂、Mattermost 品牌暴露、设置不符合中国用户习惯的问题。当前产品/设计阶段已完成，需进入实现阶段，将已确认的产品设计转化为可执行的研发任务。

## What Changes

- 新增基于 Tauri v2 的桌面应用 Shell（窗口管理、自定义标题栏、生命周期、托盘）。
- 新增 EAIC 引导程序（Onboarding Wizard），支持组织 URL 确认和已同步企业邮箱/密码登录。
- 新增左侧一级导航框架（聊天、通讯录、AI 表格），支持展开/折叠和未读红点。
- 新增 WebView 容器，用于嵌入现有 B/S 二开页面。
- 新增 JS Bridge，实现原生层与 WebView 之间的通知、红点、主题、会话定位等通信。
- 新增系统通知和托盘图标，点击通知可定位到具体会话。
- 新增个人设置和系统设置弹窗（左右分栏），适配中国用户习惯。
- 新增品牌替换能力（图标、标题、启动图、关于页）。
- 新增 Windows / macOS 安装包构建与签名流程。

## Capabilities

### New Capabilities

- `desktop-shell`：Tauri 桌面应用 Shell、窗口管理、自定义标题栏、系统托盘、开机自启。
- `onboarding-auth`：引导程序、组织 URL 确认、已同步企业邮箱/密码登录、记住我、token 安全存储。
- `navigation-framework`：左侧一级导航、展开/折叠、未读红点、底部用户信息区。
- `webview-embedding`：WebView 容器、页面加载/错误态、与 B/S 页面边界划分。
- `js-bridge`：原生层与 WebView 通信协议、通知同步、主题同步、会话定位。
- `notification-tray`：系统通知、托盘红点、点击定位会话。
- `settings-adaptation`：个人/系统设置弹窗、左右分栏、字段清单、生效策略。
- `branding-customization`：品牌替换、Splash、图标、关于页、深色模式适配。
- `packaging-distribution`：Windows/macOS 安装包构建、签名、企业内网分发。

### Modified Capabilities

- 无现有 spec 变更（openspec/specs/ 为空）。

## Impact

- **新增代码**：Tauri Rust 后端、前端导航/设置/引导程序 UI、JS Bridge、构建脚本。
- **依赖**：Tauri v2、keyring-rs、Mattermost API/WebSocket、CI 签名流程。
- **影响系统**：无 Mattermost 服务端改动；主要影响桌面客户端和 B/S 页面集成点。
- **构建/发布**：新增 Windows（exe/msi）和 macOS（dmg/pkg）安装包产物。
