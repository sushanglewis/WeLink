# WeLink 技术栈与开源选型

## 元信息

- **来源访谈**: —
- **来源需求**: GitHub Issue #15 — 根据 issue 以及 welink 知识信息，总结 welink 背景和目标
- **关联 Issue**: [#3](https://github.com/sushanglewis/WeLink/issues/3)、[#6](https://github.com/sushanglewis/WeLink/issues/6)、[#11](https://github.com/sushanglewis/WeLink/issues/11)
- **实现 PR**: —
- **状态**: <!-- status: approved --> PM 已确认
- **标签**: welink, tech-stack, oss-selection, mattermost, teable, librechat, tauri

---

## 技术知识

### 现有技术栈

> 来源：`issue-3/designs/ai-workbench-landing-page/tech-stack.md`，由 PM 于 2026-07-07 提供。

#### 后端

| 层级 | 技术 | 版本/说明 |
|------|------|----------|
| API 网关 | Spring Cloud Gateway | — |
| 注册/配置中心 | Nacos | v2.3.2 |
| 服务调用 | OpenFeign + LoadBalancer | 随 Spring Cloud |
| 关系数据库 | MySQL | 8.0 |
| 缓存 | Redis（Spring Data Redis） | 7-alpine |
| 对象存储 | MinIO | — |

#### 前端

| 层级 | 技术 | 版本 |
|------|------|------|
| 运行时 | Node / npm | ^24 / ^11 |
| UI 框架 | React / React DOM | 18.2.0 |
| 语言 | TypeScript | 5.6.3 |
| 状态管理 | Redux + redux-thunk + redux-persist | 5.0.1 / 3.1.0 / 6.0.0 |
| React 绑定 | react-redux | 9.2.0 |
| 路由 | react-router-dom v5 + history v4 | 5.3.4 / 4.10.1 |
| 国际化 | react-intl | 7.1.14 |
| UI 库 | MUI 5、Bootstrap 3、styled-components | 混合并存 |
| IM 前端 | mattermost-webapp (channels) | 11.8.0 |

#### 当前前端布局

应用名称为"龙智协同"，整体采用左侧导航 + 顶部标题栏 + 主内容区 + 右侧 AI 协同助手侧边栏的布局。左侧导航包含：AI 工作台、消息、事项、通讯录、会议日程、知识库。

### 开源选型决策

> 来源：`oss/projects.yaml` 及各 issue 设计文档。

| 能力域 | 选型 | 许可 | 状态 | 说明 |
|--------|------|------|------|------|
| IM 核心 | Mattermost 11.8.0 | 混合许可 | 已采用 | B/S 二开基础，用户体系来源 |
| AI 工作台 | LibreChat | MIT | 推荐 | React/TS 前端，原生支持 Agents/MCP/Skills/Artifacts |
| 多维表格 | Teable | AGPL-3.0（需商业授权） | 2026-07-15 确定 | 国产化项目，满足政企约束 |
| 桌面客户端 | Tauri | MIT/Apache-2.0 | 已确定 | 混合 C/S + B/S 外壳 |
| 会议转写（未来） | OpenWhispr | MIT | 推荐 | 本地 Whisper，离线可用 |

### 关键集成方案

#### AI 工作台（LibreChat）集成

来源：`issue-3/designs/ai-workbench-landing-page/integration-plan.md`

- **嵌入方式**：iframe 嵌入 LibreChat 路由（`/c/new`、`/c/:id`、`/agents`、`/skills`），避免与现有 react-router v5 冲突。
- **SSO**：Phase 1 通过 WeLink 签发的 token 注入实现免登；Phase 2 迁移到 OIDC。
- **模型接入**：企业模型网关作为 OpenAI-compatible `endpoints.custom`。
- **RAG**：LibreChat `rag_api` + pgvector，指向企业 embed 模型。
- **Artifacts**：React/HTML/Mermaid/SVG；本期不支持 PPT。
- **能力分发**：`mcpServers`、`skillSync`、预配置 `modelSpec` agents。
- **数据收集**：LibreChat 后端异步上报使用事件到 WeLink MySQL `UsageEvent` 表。

#### 多维表格（Teable）集成

来源：`issue-6/designs/supervision-collab-va/integration-plan.md`

- **嵌入方式**：全屏 iframe 嵌入 Teable workspace。
- **SSO**：Teable Enterprise SAML/OIDC + JIT provisioning；备选 Keycloak/Authentik 联邦。
- **Workspace 映射**：推荐按业务域或部门映射；督办场景建议一个共享 workspace + collaborator 字段行级过滤。
- **权限**：开源核心仅 workspace 级权限；行/列级权限需 Enterprise。
- **通知**：Mattermost bot 发送 Teable 过滤视图链接，点击唤起桌面客户端。

#### 桌面客户端（Tauri）架构

来源：`issue-11/designs/issue-11/ui-handoff.md`、`issue-11/designs/issue-11/data-model.md`

- **窗口**：1280×800（最小 1024×640），自定义标题栏。
- **导航**：左侧边栏，顺序为 聊天 → 通讯录 → AI 表格，默认 聊天。
- **内容区**：WebView 嵌入现有 B/S 页面；每次切换导航重新加载。
- **桥接**：JS Bridge 同步未读数、红点、系统通知、托盘状态。
- **登录**：当前阶段用户名/密码；SSO 入口预留。
- **设置**：精简为中国用户习惯的设置项，移除 Mattermost 术语。
- **品牌**：隐藏所有 Mattermost 痕迹，应用名 EAIC（待企业提供 VI）。

### 架构模式

WeLink 采用**薄外壳 + 嵌入 web 内容 + 消息桥接 + SSO 粘合**的重复模式：

1. **IM 层**：Mattermost 提供核心聊天、用户体系、组织架构。
2. **外壳层**：Tauri 桌面端 / React Web 端提供自有品牌导航和窗口管理。
3. **能力层**：LibreChat（AI 工作台）、Teable（多维表格）通过 iframe/WebView 嵌入。
4. **集成层**：JS Bridge / postMessage + token 注入 SSO + Mattermost Bot 通知。
5. **数据层**：WeLink 后端 MySQL 收集使用数据；Teable 自身数据库存储结构化数据。

### 合规与约束

- **国产化**：核心 OSS 需为中国境内项目或可控来源；Teable 因此取代 Baserow/NocoDB/Grist。
- **许可风险**：Teable AGPL-3.0 嵌入专有产品需商业授权，已确认商务路径。
- **数据主权**：所有服务私有化部署，数据不出域。
- **身份一致**：不建立独立账号体系，全部复用 Mattermost/WeLink 用户身份。

### 待澄清/风险点

1. **技术栈不一致**：`issue-6` UI 规格中 WeLink 客户端标注为"Electron / Web"，而 `issue-11` 已确定为 Tauri，需统一。
2. **SSO 阶段差异**：PRD 宣传企业邮箱 SSO，但 UI 交接将当前阶段收窄为仅用户名/密码，SSO 预留。
3. **LibreChat 国产化张力**：需求层面指出海外项目不适用于政企交付，但设计层面仍选择 LibreChat；需确认后续是否替换为国内方案。
4. **Teable 权限**：开源核心缺少行/列级权限，督办场景必须采购 Enterprise。

---

## 相关链接

- [[welink-product-background]] — 业务背景与目标
- `issue-3/designs/ai-workbench-landing-page/tech-stack.md`
- `issue-3/designs/ai-workbench-landing-page/integration-plan.md`
- `issue-6/designs/supervision-collab-va/integration-plan.md`
- `issue-11/designs/issue-11/ui-handoff.md`
- `issue-11/designs/issue-11/data-model.md`
- `oss/projects.yaml`
