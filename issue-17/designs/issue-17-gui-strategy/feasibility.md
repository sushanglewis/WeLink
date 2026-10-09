# Issue #17 可行性分析

## 一、Mattermost 新特性调研

### 版本状态

- **Mattermost Server v10**：已发布，官方文档提供完整 v10 Release Notes。
- **Mattermost Server v11**：2026 年已发布（docs.mattermost.com 通知栏显示 v11.0 已可用）。
- 建议生产环境跟踪 **v10 LTS** 或 **v11 最新稳定版**。

### 与本场景相关的关键能力

#### 1. Plugin Framework（插件框架）

**来源**：
- [Mattermost Plugins — Official Docs](https://developers.mattermost.com/integrate/plugins/)
- [Mattermost Server v10 Release Notes](https://docs.mattermost.com/product-overview/mattermost-v10-changelog.html)

**关键特性**：
- **Server plugins**：以 RPC 服务运行，可监听生命周期事件、扩展 REST API。
- **Web App plugins**：可注册自定义 React 组件到 channel header、sidebar、main menu。
- **Custom post types**：通过 `registerPostTypeRenderer` 注册自定义消息渲染器，可在消息中渲染 iframe、卡片、自定义表单等。
- **Custom REST API endpoints**：插件可暴露自己的 API，供 iframe 或外部服务调用。
- **Starter template**：`mattermost-plugin-starter-template` 提供快速启动模板。

**如何用在本场景**：
- 开发一个 Mattermost Web App plugin，注册 custom post type `custom_supervision_form`。
- 当龙小督发送该类型的消息时，plugin 渲染一个包含 iframe 的 React 组件。
- iframe 加载自研表单页面，通过 URL 参数或 postMessage 接收数据与 token。

#### 2. Bot Accounts

**关键特性**：
- 专用 Bot Account，可创建 token。
- Bot 可发送消息、回复线程、创建 posts。
- 支持 interactive dialogs、slash commands、incoming/outgoing webhooks。

**如何用在本场景**：
- 龙小督使用 Bot Account 在 Mattermost 中发送 custom post。
- Bot 后端负责调用 Teable API 查询数据、生成 iframe URL。

#### 3. iframe 嵌入 Mattermost

**来源**：
- [Embed Mattermost](https://developers.mattermost.com/integrate/customization/embedding/)

**关键发现**：
- **把整个 Mattermost 应用嵌入 iframe 默认被禁用**，因为存在点击劫持（Click-Jacking）风险。
- 如需启用，需修改 `head.html` 并调整 NGINX 配置剥离安全头。**不推荐在公网使用**。
- **在 Mattermost 消息中嵌入 iframe（反向）是官方推荐做法**：通过 plugin 的 custom post type renderer 实现。

**如何用在本场景**：
- 不在外部页面嵌入 Mattermost，而是在 Mattermost 消息中嵌入自研 iframe 表单。
- 这种方式更安全，也更符合用户场景。

#### 4. Interactive Dialogs / Custom Post Actions

**关键特性**：
- 消息下方可附加按钮（message actions）。
- 可弹出 interactive dialog 收集用户输入。

**如何用在本场景**：
- 在 iframe 表单消息下方附加“刷新数据”、“查看详情”、“催办”等按钮。
- 简单操作可直接用 message action，复杂填报用 iframe。

### Mattermost 能力使用建议

| 能力 | 是否推荐 | 用途 |
|------|----------|------|
| Custom post type + iframe | ✅ 推荐 | 在消息中嵌入自研表单 |
| Web App plugin | ✅ 推荐 | 注册自定义渲染器、侧边栏入口 |
| Bot Account | ✅ 推荐 | 龙小督发送消息、调用 API |
| 把整个 Mattermost 嵌入 iframe | ❌ 不推荐 | 安全风险高 |
| Interactive dialogs | ⚠️ 备选 | 简单输入场景 |

---

## 二、Teable 新特性调研

### 版本状态

- **Teable Cloud / Self-hosted**：2026 年持续发布，最新 release 标签形如 `release.2026-08-14T05-13-33Z.2640`。
- **域名迁移**：从 `teable.io` 迁移到 `teable.ai`。
- **开源协议**：Teable 开源版采用 AGPL，需关注合规性。

### 与本场景相关的关键能力

#### 1. Form View（表单视图）

**关键特性**：
- 每条表可创建 Form view，用于数据填报。
- 支持字段可见性、必填校验、默认值。
- **2026 更新**：分享表单支持“Require login to submit”，即仅限登录用户提交。
- `shareMeta.submit.allow` 已废弃，表单提交权限现在取决于 view type。

**如何用在本场景**：
- 可作为备选方案：直接嵌入 Teable 原生分享表单 iframe。
- 但用户明确要求自研表单，因此 Teable Form view 更适合作为“快速原型”或“简单场景”的备选。

#### 2. Share View / Embed

**来源**：
- [Get share view - Teable API](https://help.teable.ai/zh/api-reference/share/get-share-view)
- [Post share viewform submit - Teable API](https://teablecn.mintlify.app/en/api-reference/share/post-share-viewform-submit)

**关键特性**：
- 表和视图可生成 share link。
- Share view 支持配置：密码、允许复制、包含隐藏字段、允许编辑、需要登录。
- **2026 更新**：Shared views support editing — 登录访客在允许编辑的分享视图中可增删改记录。
- Embed 配置改进：底部间距优化、设置弹窗不被遮挡。

**如何用在本场景**：
- 看板页面可使用 share view 的 embed 方式快速展示公开/受限数据。
- 自研 iframe 表单通过 Teable API 直接读写，不依赖 share view。

#### 3. Teable API

**来源**：
- [API Overview - Teable](https://help.teable.ai/en/api-doc/overview)

**关键端点**：
- `GET /api/base/{baseId}/table/{tableId}/permission` — 获取表权限矩阵。
- `GET /api/table/{tableId}/records` — 查询记录。
- `POST /api/table/{tableId}/record` — 创建记录。
- `PATCH /api/record/{recordId}` — 更新记录。
- `POST /api/share/{shareId}/view/form-submit` — 通过分享表单提交。

**认证**：
- Bearer Token（Personal Access Token 或 OAuth）。
- 2026 更新：OAuth scopes 更严格，access token 只包含显式批准的权限。

**如何用在本场景**：
- 自研 iframe 表单后端或 Bot 后端调用 Teable API。
- 提交时必须携带用户自己的 token 或短期签名凭证，保留操作痕迹。

#### 4. Teable Skills / AI Agent 集成

**2026 重要更新**：
- **New Teable Skill**：AI Agents（如 Claude Code、ChatGPT）可连接 Teable Base，管理数据、表、字段、视图、记录、自动化和应用。
- **App Builder**：支持可视化构建应用，Chat 可直接编辑页面元素。
- **Unified Secrets management**：AI Chat、App Builder、Automation 集中管理加密凭证。
- **Teable CLI**：支持自定义 Base URL 和 Base 管理命令。

**如何用在本场景**：
- 龙小督可通过 Teable Skill 直接操作数据，无需手写复杂 API 调用。
- App Builder 未来可作为 GUI 层的构建工具，但当前建议先自研轻量 GUI。

#### 5. Automation & Webhook

**2026 更新**：
- **Webhook Triggers Are Live**：新增 “When Webhook Received” 触发器，外部系统可通过 HTTP 请求启动自动化。
- Automation Script 节点最长运行 180 秒。
- Automation Run History 支持标签页、筛选、AI Chat 诊断错误。

**如何用在本场景**：
- Teable 自动化检测到逾期后，通过 Webhook 触发龙小督发送催办消息。
- 外部支付、CI/CD、电商系统也可通过 Webhook 将事件写入 Teable。

#### 6. Permission Management

**2026 更新**：
- 新权限矩阵配置工具：支持导出、编辑、预览、比较、校验、CLI 应用。
- 更严格的分享权限执行：不可用的操作会禁用并显示提示。
- 跨 Space 引用限制：新的 link/lookup/rollup 字段不再支持跨 Space。
- 记录和表级权限在 API 中加强校验。

**如何用在本场景**：
- 利用 Teable 的权限矩阵控制经办人只能看自己负责的数据。
- 通过 `GET /api/base/{baseId}/table/{tableId}/permission` 在 GUI 层判断用户可执行的操作。

### Teable 能力使用建议

| 能力 | 是否推荐 | 用途 |
|------|----------|------|
| Teable API（记录 CRUD） | ✅ 推荐 | 自研 iframe 表单读写数据 |
| Teable Permission API | ✅ 推荐 | GUI 层判断用户权限 |
| Teable Skill / AI Agent | ✅ 推荐 | 龙小督操作数据 |
| Teable Automation + Webhook | ✅ 推荐 | 逾期提醒、外部事件触发 |
| Teable Form view（原生） | ⚠️ 备选 | 简单场景快速实现 |
| Teable App Builder | ⚠️ 未来 | 长期 GUI 层可考虑 |
| Share view embed | ⚠️ 备选 | 公开/受限看板展示 |

---

## 三、技术可行性结论

### 自研 iframe 表单嵌入 Mattermost：✅ 可行

- 通过 Mattermost Web App plugin 注册 custom post type renderer。
- 在消息中渲染 iframe，加载自研表单页面。
- 自研表单通过 Teable API 查询/提交数据。
- 支持多表单翻页、用户令牌提交、操作痕迹保留。

### GUI 看板：✅ 可行

- 独立 Web 应用，通过 Teable API 查询数据。
- 可嵌入 Mattermost 侧边栏或作为消息链接打开。
- 权限由 Teable 控制，GUI 层只展示有权限的数据。

### 集成复杂度：中等

- 需要开发 Mattermost plugin（前端 + 可选后端）。
- 需要自研 iframe 表单前端。
- 需要 Bot 后端与 Teable API 交互。
- 需要解决用户 token 的安全传递与刷新。

### 推荐技术栈

| 层级 | 技术 |
|------|------|
| IM 平台 | Mattermost Server v10/v11 + Web App Plugin |
| 数字员工 | 龙小督 Bot（可基于现有实现扩展） |
| 数据底座 | Teable（开源/云端） |
| 表单前端 | HTML + CSS + JavaScript（原型）；后续可迁移至 React/Vue |
| GUI 看板 | React/Vue + Teable API |
| 通信 | postMessage（iframe ↔ Mattermost）、REST API、Webhook |

---

## 四、风险与缓解

| 风险 | 缓解措施 |
|------|----------|
| Mattermost plugin 开发门槛 | 使用官方 starter template；先实现最小 custom post renderer |
| iframe 跨域通信安全 | 使用 postMessage + origin 校验；token 不直接暴露在 iframe src 中 |
| 用户 token 安全 | 使用短期签名凭证或 OAuth refresh flow；生产环境用 secret manager |
| Teable API 变更 | 封装适配层；关注官方 changelog |
| 多表单翻页体验 | 每页只展示关键字段；提供进度指示器；允许保存草稿 |

## 五、下一步建议

1. 搭建最小 Mattermost plugin，实现 custom post type renderer。
2. 开发自研 iframe 表单原型（本次已覆盖）。
3. 实现 Bot 后端与 Teable API 的最小闭环：查询 → 生成 iframe URL → 发送消息。
4. 逐步扩展 GUI 看板与权限校验。
