# Baserow 嵌入 IM 系统产品方案

> 适用场景：将 Baserow 作为 IM 系统的“多维表格”一级功能，支撑督办协作等需要协同表格的业务。
> 本文档面向产品经理、前端/后端研发、运维同步 embedding、SSO、导航、共享等关键设计。

## 1. 目标与范围

### 1.1 目标
- 在现有 IM 客户端左侧导航新增“多维表格”一级入口。
- 用户点击后，在 IM 主内容区嵌入 Baserow，实现“打开即用”的体验。
- 通过 SSO 与 IM 用户体系打通，用户无需额外 Baserow 账号密码。
- 说清楚 Baserow 的 workspace / database / table 如何与 IM 组织架构、共享权限对应。

### 1.2 范围
- 本期聚焦 **Baserow 全屏 iframe 嵌入** 与 **SSO 用户打通**。
- 共享模型以 **workspace 级别共享** 为主（Baserow 开源核心支持），database/table 级细粒度权限留作二期（需 Enterprise）。
- 涉及 IM 侧改造：左侧导航、iframe 容器、SSO 对接、用户映射。

---

## 2. 现有系统与 Baserow 产品框架对照

| IM 系统（现有） | Baserow（待嵌入） | 映射关系 |
|---|---|---|
| 左侧一级导航：消息、事项、通讯录、会议日程、知识库、AI工作台 | 左侧 Panel：Home、Notifications、Members、Databases、Applications、Dashboards、Automations、Audit log | 在 IM 左侧新增“多维表格”一级入口；Baserow 自身左侧 Panel 保留在 iframe 内 |
| 主内容区：展示 AI 工作台、待办、日程等 | 主内容区：workspace 首页、database 列表、table 视图 | 点击 IM 入口后，主内容区替换为 Baserow iframe |
| IM 用户体系（WeLink / 企业微信 / 自研） | Baserow User / Workspace Member | 通过 SSO 映射，做到账号统一 |
| IM 组织/部门 | Baserow Workspace | 可按“一个部门一个 workspace”或“一个业务域一个 workspace”映射 |

> 关键设计原则：**IM 侧只负责“把用户送进 Baserow”，Baserow 侧负责多维表格的完整交互**。避免第一期就把 Baserow 的 workspace/database/tree 同步到 IM 左侧导航，开发量和维护成本过高。

---

## 3. 总体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        IM 客户端（Electron/Web）                  │
│  ┌─────────────┐  ┌──────────────────────────────────────────┐  │
│  │ 左侧导航     │  │           主内容区（iframe）              │  │
│  │ · 消息       │  │  ┌────────────────────────────────────┐  │  │
│  │ · 事项       │  │  │        Baserow 自托管实例            │  │  │
│  │ · 多维表格 ✨ │  │  │  ┌──────────┐  ┌─────────────────┐ │  │  │
│  │ · AI工作台   │  │  │  │ 左侧 Panel │  │  workspace/     │ │  │  │
│  │ · 知识库     │  │  │  │          │  │  database/table │ │  │  │
│  └─────────────┘  │  │  └──────────┘  └─────────────────┘ │  │  │
│                   │  └────────────────────────────────────┘  │  │
└───────────────────┴────────────────────────────────────────────┘
         │                              │
         │ 1. 点击多维表格              │ 2. iframe 加载 Baserow URL
         ▼                              ▼
┌─────────────────┐          ┌──────────────────────┐
│   IM 后端服务    │          │   Baserow 后端服务    │
│ · 会话状态       │◄────────►│ · Workspace/Database │
│ · 用户映射       │          │ · Table/View/Rows    │
│ · 通知/待办      │          │ · Webhook/Automation │
└─────────────────┘          └──────────────────────┘
         │                              │
         │                              │
         ▼                              ▼
┌────────────────────────────────────────────────────────────┐
│                  身份认证（SSO）                             │
│  · 方案 A：Baserow Enterprise SSO（SAML/OIDC）               │
│  · 方案 B：Keycloak/Authentik 做 IdP 联邦，Baserow 接 OIDC    │
└────────────────────────────────────────────────────────────┘
```

> 架构图详见：`designs/supervision-collab-va/diagrams/baserow-integration-architecture.drawio`

---

## 4. 导航与一级入口设计

### 4.1 IM 左侧导航新增入口

在现有左侧导航中新增“多维表格”入口，图标建议用表格/网格 icon，与“AI工作台”同级。

```
龙智协同
├── AI工作台
├── 消息
├── 事项
├── 多维表格        ← 新增一级入口
├── 通讯录
├── 会议日程
├── 知识库
```

### 4.2 点击后的行为

1. 主内容区清空，显示一个全屏 iframe。
2. iframe 初始加载 `https://baserow.example.com/workspace/{default_workspace_id}`。
3. Baserow 自己的左侧 Panel 保留在 iframe 内，用户通过它切换 workspace / database / table / view。
4. IM 顶部标题栏可显示“多维表格”及当前 Baserow workspace 名称（通过 `postMessage` 或 URL 解析同步）。

### 4.3 为什么保留 Baserow 左侧 Panel

| 方案 | 优点 | 缺点 | 适用阶段 |
|---|---|---|---|
| **A. 全屏嵌入，保留 Baserow Panel** | 开发量最小；Baserow 功能完整；升级 Baserow 后无需改 IM 侧 | 视觉上有“两个左侧栏” | **本期推荐** |
| **B. 深度融合，IM 侧同步 workspace/database tree** | 体验最一体化 | 需要调用 Baserow API 维护树、处理权限、同步状态；IM 侧改造成本高 | 二期 |
| **C. 仅嵌入单表视图** | 最轻量 | 无法切换 database/table，必须 IM 侧维护入口 | 仅适合固定表单/看板 |

### 4.4 地址栏/面包屑同步（可选增强）

- Baserow 内路由变化时，通过 `window.postMessage` 向 IM 外层发送当前 `{workspace, database, table, view}` 信息。
- IM 顶部显示“多维表格 > {workspace} > {database} > {table}”面包屑，提升用户方位感。
- 用户刷新页面时，IM 根据保存的最后 URL 重新加载 iframe。

---

## 5. 单点登录（SSO）与用户体系打通

### 5.1 核心目标

- 用户使用 IM 账号登录后，进入“多维表格”无需再次输入 Baserow 账号密码。
- Baserow 中的用户身份与 IM 用户身份一致（姓名、邮箱、部门）。
- 用户离职或部门变动时，IM 侧权限回收即可同步失效（依赖 SSO 会话过期）。

### 5.2 推荐方案：Baserow Enterprise SSO（SAML/OIDC）

Baserow 的 SSO 功能在 **Advanced / Enterprise** 版本中提供，支持：
- SAML 2.0（Okta、OneLogin、Microsoft Entra ID / Azure AD）
- OpenID Connect（通用 OIDC 提供商）
- OAuth 2.0（Google、GitHub 等）
- 可禁用邮箱密码登录，强制 SSO
- JIT（Just-In-Time）自动创建用户

如果 IM 用户体系支持标准 OIDC/SAML，直接配置为 Baserow 的 IdP 即可。

#### 配置要点

1. 在 Baserow Admin → Authentication → SSO 中添加 provider。
2. 填写 IM IdP 的 metadata / discovery URL、client_id、client_secret。
3. 禁用邮箱密码登录，避免用户绕过 SSO。
4. 映射 claim：
   - `email` → Baserow username
   - `name` / `given_name+family_name` → Baserow 显示名
   - `sub` / `employee_id` → 外部用户 ID（可用于 IM 用户映射）

### 5.3 备选方案：Keycloak/Authentik 做身份联邦

如果 IM 用户体系协议不标准，或需要同时对接多个应用：

```
IM 用户体系 ──► Keycloak/Authentik ──► Baserow (OIDC)
```

- Keycloak 通过 LDAP/REST/自定义 SPI 与 IM 用户目录同步。
- Baserow 只认 Keycloak 这一个标准 OIDC 提供商。
- 优势：解耦 IM 私有协议与 Baserow；未来可对接更多应用。

### 5.4 开源核心版的限制

Baserow 开源核心版 **不包含 SSO**。若坚持不购买企业版，可选路径：

| 路径 | 做法 | 风险 |
|---|---|---|
| 预置账号 + token 注入 | 后台为每个 IM 用户创建 Baserow 账号，iframe URL 带一次性 token 自动登录 | 需要改 Baserow 登录逻辑或自研 gateway，维护成本高，安全性差 |
| 公共分享视图 | 对只读场景使用 public share link + iframe | 无法编辑，无法满足督办填报 |
| 仅共享表单 | 用 Baserow Form 收集数据 | 无法查看他人记录，协作弱 |

> **结论**：若要实现真正的 SSO + 编辑协作，建议购买 Baserow Advanced/Enterprise 授权，或改用 Frappe/自研方案。

### 5.5 用户生命周期

| 事件 | IM 侧动作 | Baserow 侧动作 |
|---|---|---|
| 新用户入职 | 创建 IM 账号 | 首次登录 Baserow 时 JIT 创建用户 |
| 部门调动 | 更新 IM 组织架构 | 需要管理员调整 workspace membership（可调用 Baserow API） |
| 离职 | 禁用/删除 IM 账号 | SSO 会话失效后无法登录；建议定期同步禁用状态或删除用户 |
| 密码修改 | 在 IM 侧完成 | 无需处理，Baserow 不保存密码 |

---

## 6. Workspace / Database / Table 共享模型

### 6.1 Baserow 概念梳理

- **Workspace**：最高级隔离单位。一个 workspace 包含多个 database、application、dashboard、automation。workspace 之间数据不互通。
- **Database**：一个数据库，包含多个 table。可理解为“一个业务域的数据集合”。
- **Table**：一张表，类似 Excel 工作表或数据库表，包含字段和记录。
- **View**：table 的视图（Grid、Kanban、Calendar、Form 等），同一 table 可有多个视图。
- **Member**：workspace 成员，角色通常为 Admin / Member / Viewer（具体取决于版本）。

### 6.2 与 IM 组织/部门的映射建议

| 映射策略 | 说明 | 适用场景 |
|---|---|---|
| **策略 A：一个 workspace 对应一个部门** | 每个部门有自己的数据库集合，权限天然隔离 | 部门之间数据敏感，不希望互相看见 |
| **策略 B：一个 workspace 对应一个业务域** | 如“督办协作 workspace”包含主表、跟进表、模板库 | 跨部门协作项目，所有人需要看到同一份数据 |
| **策略 C：全员一个 workspace + 视图过滤** | 所有人在同一个 workspace，但通过视图/协作者字段过滤可见行 | 数据需要集中管理，个人只看到与自己相关的行（推荐用于督办） |

> 对于当前“督办协作”场景，**策略 C 最轻量**：所有督办相关人员都在同一个 workspace，主表通过“经办人”字段或“协作者”字段控制行级可见性。这样避免了频繁跨 workspace 共享的复杂度。

### 6.3 Workspace 共享流程

Baserow 原生共享方式（workspace admin 操作）：

1. 进入 workspace → Members → Invite member。
2. 输入被邀请人邮箱，选择角色（Admin / Member / Viewer）。
3. 被邀请人收到邮件，点击链接接受后成为 workspace 成员。

与 IM 集成后的增强共享方式：

1. 用户在 Baserow 中点击“邀请成员”。
2. 弹出 IM 联系人选择器（由 IM 客户端提供）。
3. 选择联系人后，IM 侧将用户邮箱/ID 返回给 Baserow。
4. Baserow 调用 workspace invite API 直接发送邀请或添加成员。
5. 被邀请人收到 IM 消息通知（替代邮件）。

### 6.4 权限模型

#### 开源核心版

- **Workspace 级权限**：Admin / Member / Viewer。
- 同一 workspace 内所有 database/table 对 Member 可见。
- 行级过滤依赖 **View 的 filter** 或 **字段级公式**，但不能真正阻止用户访问其他行数据（有 URL 即可打开）。

#### Enterprise 版

- **Database/Table 级权限**：可限制用户能访问哪些 database/table。
- **行级权限（Row-level permissions）**：可设置“用户只能看到自己被设为协作者的行”。
- **字段级权限**：隐藏敏感字段。

> 若督办场景对数据隔离要求高（例如经办人绝对不能看到其他人的督办事项），需要 **Enterprise 的行级权限**，或改用底层 RLS 方案（如 PostgreSQL + PostgREST）。

### 6.5 共享与通知的集成

- 当用户被加入 workspace 时，Baserow 可触发 Webhook 到 IM 后端。
- IM 后端向被邀请人发送一条消息：“你已被加入【督办协作】多维表格，点击打开。”
- 用户点击消息中的 deep link，IM 直接打开“多维表格”并加载对应 workspace。

---

## 7. 关键数据流

### 7.1 用户首次打开“多维表格”

```
1. 用户点击 IM 左侧“多维表格”
2. IM 客户端检查本地是否有有效的 Baserow 会话/token
   ├─ 有：直接 iframe 加载 Baserow URL
   └─ 无：跳转 SSO 登录页（或弹窗）
3. 用户完成 SSO 登录（或已在 IM 登录态中自动完成）
4. Baserow 返回 session cookie/token
5. iframe 加载 workspace 首页
6. 用户在 Baserow 内操作（切换 database/table/view）
7. Baserow 通过 Webhook 将数据变更异步通知 IM 后端（如督办提醒）
```

> 详见 drawio 第 3 页“SSO Login Flow”。

### 7.2 用户邀请同事共享 workspace

```
1. 用户在 Baserow 中点击“Invite member”
2. IM 客户端拦截并唤起联系人选择器
3. 用户选择 IM 联系人
4. IM 后端返回联系人邮箱/user_id
5. Baserow 后端调用 workspace invite API
6. 被邀请人收到 IM 消息通知
7. 被邀请人点击通知进入 Baserow（SSO 自动登录）
```

> 详见 drawio 第 4 页“Workspace Sharing Flow”。

---

## 8. 部署与接入

### 8.1 Baserow 自托管部署

推荐使用官方 Docker Compose：

```yaml
# docker-compose.yml（节选）
services:
  baserow:
    image: baserow/baserow:latest
    ports:
      - "8081:80"
    environment:
      BASEROW_PUBLIC_URL: https://baserow.example.com
      DATABASE_HOST: postgres
      DATABASE_NAME: baserow
      REDIS_HOST: redis
      # 企业版 license（如需要 SSO/高级权限）
      # BASEROW_LICENSE_KEY: xxx
```

### 8.2 IM 侧 iframe 接入要点

- iframe `src` 指向 Baserow 域名，建议带 `?workspace={id}` 预选中默认 workspace。
- 设置 `allow="fullscreen"`、`sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"`。
- 由于 Baserow 与 IM 可能跨域，需要 Baserow 配置 `X-Frame-Options` / CSP `frame-ancestors` 允许 IM 域名嵌入。
- 监听 `window.message` 实现面包屑同步和加载状态。

### 8.3 域名与网络

- 建议 Baserow 使用独立二级域名，如 `baserow.company.com`。
- 若部署在内网，确保 IM 客户端能访问该域名。
- 生产环境建议走 HTTPS + WAF/反向代理（Nginx/Caddy）。

### 8.4 隐藏 Baserow 品牌/付费提示（如需要）

- **企业版**：Admin 设置中可隐藏 Baserow logo、自定义品牌。
- **自托管开源版**：
  - 可通过 Application Builder 的 Custom CSS/JS 隐藏部分元素。
  - Baserow v2.2.2+ 支持通过环境变量注入全局客户端脚本，可用于隐藏 sidebar、logo、付费提示。
  - 注意：这种方式依赖前端 DOM 结构，升级 Baserow 后可能需要调整，属于“脆弱方案”。

---

## 9. 付费点与决策清单

| 能力 | 开源核心版 | Enterprise/Advanced | 备注 |
|---|---|---|---|
| 自托管部署 | ✅ | ✅ | — |
| 多 workspace / database / table | ✅ | ✅ | — |
| Workspace 级共享 | ✅ | ✅ | — |
| SSO（SAML/OIDC） | ❌ | ✅ | 必须购买授权 |
| Database/Table 级权限 | ❌ | ✅ | 高隔离场景需要 |
| 行级权限 | ❌ | ✅ | 高隔离场景需要 |
| 审计日志（Audit log） | 基础 | 高级 | 合规场景需要 |
| 隐藏 Baserow 品牌 | 有限 | ✅ | 需要自定义 CSS/JS 或企业版 |
| 自动化（Automations） | 基础 | 高级 | 督办提醒可结合外部 Celery/n8n 实现 |

### 决策建议

- **如果预算允许且希望快速上线**：购买 Baserow Advanced/Enterprise，直接获得 SSO + 审计 + 高级权限 + 品牌隐藏。
- **如果预算受限且对数据隔离要求不高**：使用开源核心版 + workspace 级共享 + 视图过滤 + 外部脚本实现自动化。但需要解决登录问题（ token 注入或预置账号）。
- **如果无法接受任何付费提示/企业版弹窗**：不建议使用 Baserow，改用 [Frappe Framework / KeystoneJS / PostgreSQL+PostgREST 自研方案](../docs/research/collaborative-spreadsheet-oss-options.md)。

---

## 10. 任务清单（供产研排期）

### 产品
- [ ] 确认“多维表格”在 IM 左侧导航的位置、名称、图标。
- [ ] 确认 Baserow workspace / database / table 与 IM 部门/业务的映射策略。
- [ ] 确认共享权限模型（是否允许 workspace 内全可见，还是需要行级隔离）。
- [ ] 确认是否购买 Baserow 企业版授权（决定 SSO 方案）。

### 前端
- [ ] 在 IM 客户端新增“多维表格”入口。
- [ ] 实现主内容区 iframe 容器（加载、错误、加载态、面包屑同步）。
- [ ] 实现 SSO 登录弹窗/跳转回跳逻辑。
- [ ] 实现邀请成员时唤起 IM 联系人选择器。

### 后端
- [ ] 部署 Baserow 自托管实例。
- [ ] 配置 SSO（直连 IM IdP 或通过 Keycloak 联邦）。
- [ ] 实现 IM 用户与 Baserow 用户的映射/同步逻辑。
- [ ] 对接 Baserow API，实现通过 IM 联系人邀请成员。
- [ ] 配置 Webhook，将 Baserow 数据变更通知到 IM 后端（用于督办提醒）。

### 运维/安全
- [ ] 配置 Baserow 域名、HTTPS、CSP/frame-ancestors。
- [ ] 制定备份策略（PostgreSQL + 附件存储）。
- [ ] 评估企业版授权采购（如需要 SSO/审计/高级权限）。

---

## 11. 相关文档

- `designs/supervision-collab-va/feature-catalog.md` — 督办协作功能清单
- `designs/supervision-collab-va/flows.md` — 现有数据流（Excel 导入、跟进、提醒）
- `designs/supervision-collab-va/data-model.md` — 主表/跟进表字段映射
- `designs/supervision-collab-va/diagrams/baserow-integration-architecture.drawio` — 本方案配套架构/流程图
- `docs/research/collaborative-spreadsheet-oss-options.md` — 协同表格开源方案研究（含 Baserow 替代方案）
