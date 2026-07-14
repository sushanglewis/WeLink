# Feasibility: 企业 AI 工作台一级落地页

## 1. 业务可行性

### 1.1 价值主张

AI 工作台作为 WeLink 一级 landing page，能够：
- 统一企业 AI 能力入口，降低员工发现和使用 AI 的成本。
- 通过自然语言分发算力、智能体、技能、插件、MCP，提升办公效率。
- 收集个人级使用数据，挖掘高频场景，为后续投资决策提供依据。
- 对标钉钉 One/悟空，向领导层展示 AI 投入的战略价值。

### 1.2 业务风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 员工使用率低 | 高 | 选择高频场景（督办）作为切入点；通过企业预配置 skill 降低使用门槛 |
| 场景挖掘价值不明显 | 中 | 先保证数据采集完整，后续迭代数据分析平台 |
| 领导层期望过高 | 中 | 明确一期范围，聚焦"入口+基础能力+督办" |

## 2. 技术可行性

### 2.1 开源方案

**LibreChat（推荐）**
- 许可证：MIT，可商用。
- 技术栈：React + TypeScript 前端，Node.js 后端，MongoDB/PostgreSQL。
- 关键能力：Agents、MCP、Skills、Artifacts、Code Interpreter、企业 SSO、多模型支持。
- 与现有栈契合度：前端同源 React，最容易以 iframe 或组件复用方式嵌入。

**Open WebUI（备选）**
- 许可证：MIT（含品牌条款）。
- 技术栈：Svelte 前端，Python/FastAPI 后端。
- 关键能力：RAG 成熟、Pipelines、MCP、RBAC、管理后台完善。
- 与现有栈契合度：Svelte 前端与 React 栈差异大，更适合 iframe 嵌入。

### 2.2 集成方式

**核心原则：尽可能复用 LibreChat 前端页面，WeLink 仅提供承载壳层和 IM 用户体系打通。**

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|---------|
| **iframe 嵌入 LibreChat 完整页面** | 100% 复用 LibreChat UI/UX；隔离性强；升级最简单 | 体验略受限；需处理跨域 SSO | 本期首选，用于 PM 快速体验和验证 |
| **iframe 嵌入 LibreChat 指定路由** | 复用 LibreChat 页面，但隐藏部分导航；比完整页面更聚焦 | 需要了解 LibreChat 路由结构；升级时可能受影响 | 长期推荐， landing page 嵌入对话主界面 |
| **React 组件级复用** | 体验最原生；可与 WeLink 风格深度融合 | 需深入 LibreChat 源码、维护成本高 | 长期演进方向，本期不采用 |

**本期建议**：采用 iframe 嵌入 LibreChat 指定路由（如 `/c/new` 或主聊天界面），WeLink 侧仅保留最小承载壳层（顶部标题、返回按钮、与工作台其他模块的导航）。同时通过 SSO/OAuth/token 注入实现 IM 用户体系打通，员工进入 AI 工作台时无需再次登录。

### 2.3 用户体系打通方案

| 方案 | 机制 | 优点 | 缺点 |
|------|------|------|------|
| **LibreChat OAuth/OIDC 对接 IM SSO** | LibreChat 配置 OAuth Provider 为 WeLink/企业 IAM | 标准、安全、可复用 | 需要企业 IAM 支持 OIDC |
| **WeLink 后端签发 LibreChat JWT/token，iframe URL 携带 token** | WeLink 服务端调用 LibreChat API 创建/获取用户 token，拼接 iframe src | 实现简单、无需 OIDC | token 需要妥善传递和刷新 |
| **共享 session / cookie** | 同一域名下共享 cookie | 最简单 | 需要 LibreChat 与 WeLink 同域或子域，安全边界模糊 |

**推荐**：方案 2（WeLink 后端签发 token + iframe 传参）作为 POC 和一期实现；后续可迁移到方案 1（OIDC）。

### 2.3 关键技术点

| 技术点 | 方案 | 可行性 |
|--------|------|--------|
| 对话能力 | 复用 LibreChat 多轮对话 | 高 |
| 知识库 | LibreChat RAG API + 企业 embed 模型 | 中（需明确 embed 接口） |
| Canvas | LibreChat Artifacts | 高（不支持 PPT，本期降级） |
| 数据收集 | LibreChat API/Webhook + 企业后台数据库 | 高 |
| 单点登录 | WeLink 后端签发 token + iframe 传参 | 高 |

### 2.4 技术风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| LibreChat 与 IM 登录态打通复杂 | 中 | 优先采用 token 注入方案；iframe 场景下使用 postMessage 传递 token |
| 知识库 RAG 效果不达预期 | 中 | POC 阶段用真实文档测试召回率和答案质量 |
| LibreChat 升级导致接口变更 | 中 | 独立部署，控制升级节奏；核心调用封装抽象层 |
| iframe 体验受限 | 低 | 选择 LibreChat 合适路由，调整 iframe 尺寸和主题 |
| 个人级数据存储性能瓶颈 | 低 | 使用异步写入、批量聚合 |

## 3. 部署与运维

### 3.1 推荐部署架构

```
WeLink 前端 (React + Webpack)
    │ iframe
    ▼
AI 工作台壳层（可选，WeLink 内部路由）
    │ iframe / API
    ▼
LibreChat 服务（Docker Compose / K8s）
    │
    ├── MongoDB/PostgreSQL（LibreChat 内部数据）
    ├── 向量数据库（RAG）
    └── 企业 model config

企业后台数据库（使用事件、skill 订阅、用户映射）
```

### 3.2 运维成本

- LibreChat 需要独立部署和维护。
- 需要持续跟进 LibreChat 版本更新和安全补丁。
- 企业后台数据库需要设计使用事件表和索引。

## 4. 开源项目与技术框架建议

| 层次 | 推荐 | 备选 |
|------|------|------|
| AI 工作台核心 | LibreChat | Open WebUI |
| 前端框架 | React（WeLink 现有） | - |
| 后端语言 | Node.js（跟随 LibreChat） | Python（若选 Open WebUI） |
| 数据库 | 企业现有数据库 + LibreChat 内部 DB | - |
| 向量检索 | LibreChat 内置 RAG/pgvector | Qdrant / Milvus |
| 模型接入 | 企业统一 model config | - |
| 部署 | Docker Compose / Kubernetes | - |

## 6. 当前技术栈约束

| 层级 | 技术 | 版本/说明 | 对集成的影响 |
|------|------|----------|-------------|
| API 网关 | Spring Cloud Gateway | — | LibreChat 可作为独立服务注册到网关后，或走独立域名 |
| 注册/配置中心 | Nacos | v2.3.2 | 后端服务发现可复用，但 LibreChat 后端是 Node.js，需包装或独立部署 |
| 服务调用 | OpenFeign + LoadBalancer | Spring Cloud | WeLink Java 后端与 LibreChat 交互可采用 HTTP/REST 或 MCP |
| 关系数据库 | MySQL | 8.0 | 企业后台数据库首选；LibreChat 内部数据可用其默认 MongoDB/PostgreSQL |
| 缓存 | Redis | 7-alpine | 可用于 token、session、使用事件缓存 |
| 对象存储 | MinIO | — | 可用于知识库文档、Artifacts 生成内容存储 |
| 前端运行时 | Node / npm | ^24 / ^11 | 与 LibreChat 前端 Node 版本需兼容 |
| UI 框架 | React / React DOM | 18.2.0 | 同源，便于长期组件级复用 |
| 语言 | TypeScript | 5.6.3 | 与 LibreChat 一致 |
| 路由 | react-router-dom v5 + history v4 | 5.3.4 / 4.10.1 | WeLink 路由较旧，iframe 嵌入可避免路由冲突 |
| 国际化 | react-intl | 7.1.14 | 若长期组件复用需考虑 |
| UI 库 | MUI 5 / Bootstrap 3 / styled-components | 混合 | 新增集成壳层建议优先使用 MUI 5 或 styled-components |
| IM 应用 | mattermost-webapp | 11.8.0 | 用户体系基于 Mattermost，LibreChat 需要与其打通 |

### 6.1 布局约束

当前"龙智协同"前端布局框架为：左侧导航 + 顶部标题栏 + 主内容区 + 右侧区域。截图仅用于参考该整体框架，具体功能内容不照搬。

AI 工作台设计原则：

- **不新增一级入口**：复用现有左侧导航"AI 工作台"。
- **主区域遵循 LibreChat UI/UX**：主内容区嵌入/复用 LibreChat 前端页面，作为核心对话和工作区。
- **应用网格**：本期不做，列入后续规划；本期最大化复用 LibreChat 原生能力。
- **右侧区域**：根据 LibreChat 原生布局确定，可作为上下文、推荐或辅助信息区。

## 7. 时间估算（粗略）

| 阶段 | 周期 |
|------|------|
| POC：LibreChat 部署 + iframe 嵌入 + model config 对接 + 用户打通 | 1-2 周 |
| 产品设计与原型 | 1-2 周 |
| AI 工作台壳层（WeLink 路由/iframe 容器） | 1-2 周 |
| 知识库接入 + Canvas/Artifacts | 2-3 周 |
| 数据收集 | 1-2 周 |
| 测试与上线 | 2 周 |

**总计**：约 8-13 周（视团队规模和集成复杂度调整）。

**规划中功能（本期不做）**：应用网格、督办集成、管理员 skill 发布、办公 skill。
