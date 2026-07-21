# Mattermost 桌面端/移动端开源方案调研

## 研究问题

针对 issue #11「基于 Mattermost 打造更完整自然的 IM 用户体验」，需要为 PC（Windows/macOS）和移动端（iOS/Android）选择合适的客户端实现路径：

1. 能否基于官方开源客户端二次开发，并预配置服务器 URL、邮箱 SSO？
2. 能否在合理成本内隐藏 Mattermost 品牌痕迹，贴近中国用户习惯？
3. 推送通知、应用商店分发、后续维护成本如何？

## 候选方案

### A. Fork 官方 Mattermost Desktop + Mobile 源码

- **Desktop**: [`mattermost/desktop`](https://github.com/mattermost/desktop)（Electron，MIT 许可）
- **Mobile**: [`mattermost/mattermost-mobile`](https://github.com/mattermost/mattermost-mobile)（React Native，Apache 2.0 / 源码可用许可）

| 维度 | 评估 |
|------|------|
| 业务契合度 | 高。官方实现与 Mattermost 服务端协议完全对齐，功能（消息、频道、通知、呼叫）开箱即用。 |
| 技术契合度 | 中-高。Electron/React Native 技术栈成熟，但需要团队具备相应能力；iOS/Android 需要各自构建环境。 |
| 预配置服务器 URL | Desktop 支持通过 `config.json` 或源码补丁预配置服务器；Mobile 需要在源码中修改默认服务器/引导配置。 |
| 品牌隐藏 | 中。可替换图标、应用名、启动图、登录页等，但需遵守 Mattermost 商标政策，保留版权信息。 |
| 推送通知 | Mobile 自编译时必须部署自己的 Mattermost Push Notification Service（MPNS）。 |
| 许可证 | Desktop MIT；Mobile 及 Enterprise 功能涉及 Source Available License，商业分发需注意。 |
| 维护活跃度 | 高。官方持续更新，但自定义分支合并 upstream 会有持续成本。 |
| 集成成本 | 中-高。需要 fork、改配置、改 branding、搭建 CI/CD、签名分发。 |

### B. 基于 Mattermost Web 构建轻量封装客户端

- **Desktop**: Tauri / Electron 封装 Mattermost Web（B/S 二开页面）
- **Mobile**: Capacitor / Flutter WebView 封装 Mattermost Web

| 维度 | 评估 |
|------|------|
| 业务契合度 | 中-高。可直接复用现有 B/S 二开页面，快速统一 PC/移动端体验。 |
| 技术契合度 | 高。Tauri/Capacitor/Flutter 相对轻量，团队可聚焦 Web 层改造。 |
| 预配置服务器 URL | 容易。可在壳层代码或构建配置中硬编码服务器地址，用户无需输入。 |
| 品牌隐藏 | 高。完全控制外壳，登录页、设置页已在 Web 层二开，可控性最强。 |
| 推送通知 | 低-中。WebView 方案需额外桥接原生推送，或依赖 Web Push（iOS 支持有限）。 |
| 许可证 | 高。不受 Mattermost 客户端商标/源码可用许可约束，只需遵守服务端 MIT。 |
| 维护活跃度 | 中。依赖封装框架和社区生态，Web 层由团队自维护。 |
| 集成成本 | 中。需要搭建壳层、JS Bridge、原生能力（通知、文件、相机等）、签名分发。 |

### C. 完全自研客户端（基线方案）

| 维度 | 评估 |
|------|------|
| 业务契合度 | 低。需完整实现 IM 协议、消息同步、频道管理、通知等，周期长。 |
| 技术契合度 | 低。工作量大，短期难以达到 Mattermost 现有功能完整度。 |
| 预配置服务器 URL | 完全可控。 |
| 品牌隐藏 | 完全可控。 |
| 推送通知 | 完全可控，但开发成本高。 |
| 许可证 | 完全自有。 |
| 维护活跃度 | 完全依赖团队。 |
| 集成成本 | 极高。不推荐作为 issue #11 当前阶段的实现路径。 |

## 综合评分

| 方案 | 业务契合 | 技术契合 | 成本/周期 | 品牌可控 | 维护风险 | 推荐度 |
|------|:--------:|:--------:|:---------:|:--------:|:--------:|:------:|
| A. Fork 官方客户端 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ★★★★ |
| B. Web 封装客户端 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ★★★★★ |
| C. 完全自研 | ⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ★★ |

## 推荐结论

**首选方案 B（Web 封装客户端）**，理由：

1. 与当前已完成的 Mattermost B/S 二开页面形成自然衔接，PC/移动端可共用同一套 Web 改造。
2. 预配置服务器 URL、隐藏 Mattermost 痕迹、适配中国用户习惯的成本最低。
3. 许可证风险最小，不需要 fork 官方移动/桌面仓库并持续合并上游。
4. Tauri（桌面）+ Capacitor/Flutter（移动）可统一技术选型，便于团队维护。

**备选方案 A（Fork 官方客户端）**，当以下情况成立时考虑：

- 需要深度使用原生推送、语音/视频通话、离线消息等能力，且无法接受 Web 封装的功能折损。
- 团队有 Electron + React Native 双栈能力，并愿意承担长期 upstream 合并成本。
- 预算允许采购 Mattermost Enterprise 以使用系统控制台品牌定制能力。

**不推荐方案 C**，除非产品有极长周期和充足资源。

## 关键待澄清问题

1. 当前 B/S 二开页面是否已经覆盖 issue #11 所需的全部 IM 功能？移动端是否必须支持全部功能，还是可以先做「聊天+通讯录」MVP？
2. 是否需要 iOS/Android 应用商店公开分发，还是仅企业内部分发（TestFlight/企业证书/APK）？
3. 推送通知是否必须使用原生推送，还是可以接受 WebSocket/Web Push 方案？
4. 语音/视频通话、文件预览、位置共享等原生能力，哪些是 P0？
5. 是否考虑采购 Mattermost Enterprise 以获取系统控制台品牌定制和官方支持？

## 参考链接

- Mattermost Desktop GitHub: https://github.com/mattermost/desktop
- Mattermost Mobile GitHub: https://github.com/mattermost/mattermost-mobile
- Mattermost Desktop 开发者文档: https://developers.mattermost.com/contribute/more-info/desktop/
- Mattermost Mobile 开发者文档: https://developers.mattermost.com/contribute/more-info/mobile/
- Mattermost 桌面应用部署与自定义: https://docs.mattermost.com/deploy/desktop-app.html
- Mattermost 自定义与品牌: https://docs.mattermost.com/configure/customizing-mattermost.html
- Mattermost 商标政策: https://mattermost.com/trademark-standards/
- Mattermost 商业 FAQ: https://docs.mattermost.com/about/faq-business.html
- Mattermost 许可 FAQ: https://docs.mattermost.com/about/faq-license.html
- 文档 issue：白标选项讨论 https://github.com/mattermost/docs/issues/1006
