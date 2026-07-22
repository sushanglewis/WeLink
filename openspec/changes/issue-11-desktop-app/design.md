## Context

Issue-11 的目标是为现有 Mattermost B/S 二开系统打造企业自有品牌的 Windows/macOS 桌面应用 EAIC。当前已完成产品设计和需求澄清，进入实现阶段。

本设计面向 Tauri v2 混合 C/S + B/S 架构：
- **C/S 层**：原生桌面 Shell、一级导航、托盘、通知、设置、登录引导程序。
- **B/S 层**：聊天、通讯录、AI 表格等功能页面继续复用现有二开 Web 页面，通过 WebView 嵌入。
- **Bridge 层**：定义 JS ↔ Native 通信协议，同步通知、红点、主题、会话定位等状态。

## Goals / Non-Goals

**Goals：**
- 构建可运行的 Windows/macOS 桌面应用 MVP。
- 实现引导程序、已同步企业账号登录、记住我自动登录。
- 实现左侧一级导航和 WebView 内容区。
- 实现系统通知、托盘红点、点击定位会话。
- 实现个人/系统设置弹窗。
- 完成品牌替换（图标、标题、启动图、关于页）。
- 产出 Windows/macOS 安装包。

**Non-Goals：**
- 不 fork 官方 Mattermost Desktop。
- 不替换 Mattermost 服务端。
- 不实现移动端应用。
- 不实现离线消息推送。
- 不实现第三方 OAuth/SSO（后续迭代）。
- 不一次性将所有功能 C/S 化。

## Decisions

| 决策 | 选择 | 理由 |
|------|------|------|
| 桌面框架 | Tauri v2 | 轻量、原生能力强、双平台支持、产物体积小、无需 fork Mattermost Desktop |
| 架构 | 混合 C/S + B/S | 原生导航 + WebView 嵌入，平衡原生体验与开发成本 |
| 认证方式 | 复用 Mattermost 认证 API | 企业员工账号已同步，无需新增认证服务 |
| Token 存储 | keyring-rs / DPAPI / Keychain | 跨平台安全凭证存储，符合安全最佳实践 |
| 导航实现 | 前端框架（Vue/React）+ Tauri 原生窗口 | 复用现有 Web 技术栈，导航为 C/S 原生 |
| WebView 状态 | 切换导航时重新加载 | 简化实现；聊天页状态由 B/S 页面自身维护 |
| 通知同步 | JS Bridge + WebSocket | WebView 内 B/S 页面已具备 WebSocket，通过 Bridge 同步到原生层 |
| 设置实现 | 原生弹窗 + 左右分栏 | 符合桌面应用习惯，避免在 WebView 内暴露 Mattermost 设置 |
| 主题同步 | Native 监听主题变化 → WebView postMessage | 保持原生界面与 B/S 页面视觉一致 |

## Risks / Trade-offs

| 风险/权衡 | 缓解措施 |
|-----------|----------|
| WebView 与 B/S 页面通信复杂 | 定义统一 JS Bridge 协议；提供调试工具；文档化事件格式 |
| Mattermost Web 升级破坏嵌入 | 锁定服务端版本；建立回归测试；监控 Mattermost 更新 |
| macOS 签名与公证流程阻塞 | 提前申请 Apple Developer；CI 自动化签名 |
| 自定义标题栏在 macOS 全屏下异常 | 保留系统窗口控制入口；充分测试全屏/分屏场景 |
| WebView 每次切换重新加载导致输入丢失 | 聊天页为默认首页，用户较少频繁切换；后续可优化为实例复用 |
| 主题同步增加 B/S 页面改造量 | 优先保证原生界面主题；B/S 主题同步作为增量优化 |

## Migration Plan

1. **开发阶段**：在 feature branch 上实现核心 Shell、导航、WebView、登录、通知。
2. **测试阶段**：企业内部测试 Windows/macOS 安装包，验证登录、导航、聊天加载、通知、托盘。
3. **发布阶段**：通过企业内网分发安装包；提供升级机制（后续迭代）。
4. **回滚策略**：保留浏览器访问入口；桌面应用问题不影响 Mattermost 服务端和 B/S 页面。

## Open Questions

- 企业 VI/设计规范（颜色、字体、图标）提供时间。
- Windows/macOS 签名证书是否已准备。
- 是否需要支持自动更新（OTA）机制。
- 缓存清理是否需要提供确认弹窗和清理范围选择。
