# 可行性分析: issue-11

## 业务可行性

### 价值

- 补齐 PC 端独立应用入口，提升产品完整度和企业形象。
- 预配置服务器 URL + 已同步账号体系显著降低员工使用门槛。
- 隐藏 Mattermost 品牌，强化 EAIC 企业自有 IM 认知。

### 成本

- **开发成本**：中。Tauri 技术栈轻量，团队可复用现有 Web 前端能力；原生部分主要集中在一级导航、托盘、通知、登录引导程序。
- **维护成本**：中。无需 fork 官方 Mattermost Desktop，但需要跟踪 Mattermost Web 升级对嵌入页面的影响。
- **部署成本**：低。企业内网分发，无需应用商店审核。

## 技术可行性

### 推荐技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 桌面框架 | **Tauri v2** | Rust + Web 前端，产物体积小，原生能力强，支持 Windows/macOS |
| 前端框架 | Vue 3 / React | 复用现有 B/S 二开页面技术栈 |
| 状态管理 | Pinia / Redux | 管理导航、会话、通知状态 |
| 原生存储 | Tauri Store / keyring-rs | 配置与 token 安全存储 |
| 构建/打包 | GitHub Actions / CI | 自动化构建 Windows/macOS 安装包 |

### 备选方案

| 方案 | 适用场景 | 不推荐原因 |
|------|----------|------------|
| Electron | 需要大量原生插件 | 产物体积大，内存占用高 |
| Flutter Desktop | 团队有 Flutter 经验 | 生态相对弱，嵌入 WebView 复杂 |
| Wails | 类似 Tauri | 生态与成熟度不如 Tauri v2 |

## 开源项目 / 框架参考

- **Tauri**: https://tauri.app/ — 官方文档完善，v2 支持移动端（为后续扩展预留）。
- **Mattermost API**: https://api.mattermost.com/ — 用于用户信息、token、频道等接口。
- **Mattermost WebSocket**: 用于实时消息推送。
- **keyring-rs**: Rust 跨平台安全凭证存储。

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| WebView 与 B/S 页面通信复杂 | 中 | 定义统一 JS Bridge 协议；提供调试工具 |
| Mattermost Web 升级破坏嵌入 | 高 | 锁定服务端版本；建立回归测试 |
| macOS 签名/公证流程阻塞 | 中 | 提前申请 Apple Developer；CI 自动化 |
| 已同步账号体系的认证流程适配 | 中 | 复用 Mattermost 认证 API；明确 token 刷新策略 |
| 后续功能 C/S 化投入超出预期 | 高 | 明确 MVP 范围，按优先级逐步迁移 |

## 建议方案

**技术方案可行**。采用 Tauri v2 构建混合 C/S + B/S 桌面应用是当前最优路径：

- 开发效率高，可复用现有 Web 资产。
- 产物体积小，适合企业内网分发。
- 原生能力足够覆盖通知、托盘、开机自启、文件下载等需求。
- 为后续移动端（Tauri v2 mobile）和功能 C/S 化预留扩展空间。

### 建议的 MVP 边界

1. Tauri 桌面 Shell + 左侧导航。
2. 聊天功能通过 WebView 嵌入现有 B/S 页面。
3. 应用级统一登录：引导程序 + 已同步企业邮箱/密码 + 「记住我」。
4. 系统通知 + 托盘红点，点击通知定位到具体会话。
5. 品牌替换（图标、标题、启动图、关于页）。
6. Windows 和 macOS 双平台安装包。

## 参考

- 需求文档：`issue-11/requirements/requirements.md`
- 开源方案调研：`issue-11/docs/research/mattermost-desktop-mobile-oss-options.md`
- Tauri 官方文档：https://tauri.app/
