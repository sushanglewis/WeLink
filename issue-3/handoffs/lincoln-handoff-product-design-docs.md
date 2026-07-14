# Lincoln Handoff：AI 工作台落地页 — product-design-docs

> **阶段**：product-design-docs（已完成）  
> **当前进入阶段**：product-prototype  
> **变更**：`ai-workbench-landing-page` / GitHub issue #3  
> **生成时间**：2026-07-13  
> **状态**：待 PM 确认后通过 gate

---

## 1. 阶段目标回顾

为 WeLink（龙智协同）设计“企业 AI 工作台一级落地页”，明确：
- 产品形态与范围
- 开源方案选型
- 与 WeLink IM 的集成路径
- 用户体系、模型、知识库、数据收集方案
- 进入原型/开发前必须确认的关键决策

---

## 2. 核心产物清单

| 产物 | 路径 | 状态 | 说明 |
|------|------|------|------|
| 需求文档 | `requirements/github-issue-3/requirements.md` | approved | 背景、问题、用户、方案、验收标准、非目标 |
| 用户故事 | `requirements/github-issue-3/user-stories.md` | approved | 员工/管理员/决策层用户故事 |
| PRD | `requirements/github-issue-3/prd.md` | approved | 功能清单与验收条件 |
| 开源方案研究报告 | `docs/research/ai-workbench-landing-page-oss-options.md` | completed | LibreChat / Open WebUI / LobeChat 评分与推荐 |
| 设计评审 | `designs/ai-workbench-landing-page/design-review.md` | approved | 方向、范围、核心取舍 |
| 可行性分析 | `designs/ai-workbench-landing-page/feasibility.md` | completed | 业务/技术可行性、风险、时间估算 |
| 集成方案 | `designs/ai-workbench-landing-page/integration-plan.md` | draft | 基于 LibreChat 源码的 iframe 嵌入、SSO、模型、RAG、MCP、数据收集详细方案 |
| 特性目录 | `designs/ai-workbench-landing-page/feature-catalog.md` | completed | 功能清单与优先级 |
| 流程文档 | `designs/ai-workbench-landing-page/flows.md` | completed | 核心用户流程 |
| 数据模型 | `designs/ai-workbench-landing-page/data-model.md` | completed | User / UsageEvent / KnowledgeDoc 等 |
| 技术栈说明 | `designs/ai-workbench-landing-page/tech-stack.md` | completed | 与 WeLink 现有栈对照 |

---

## 3. 关键决策（已确认）

### 3.1 产品形态
- **AI 工作台作为 WeLink 左侧导航一级入口**。
- **主内容区复用 LibreChat 原生页面**，WeLink 仅提供承载壳层（顶部标题栏、iframe 容器）。
- **本期不做独立应用网格/督办集成**，优先最大化复用 LibreChat 原生能力，快速上线。

### 3.2 开源方案
- **首选 LibreChat（MIT）**。
  - 原生支持 Agents、MCP、Skills、Artifacts，与“分发算力、智能体、技能、插件、MCP”需求语义高度契合。
  - 前端 React/TypeScript 与 WeLink 现有栈同源。
  - 支持企业 SSO/LDAP/SAML/2FA。
- **备选 Open WebUI**：RAG 更强、社区最大，但前端 Svelte 与 React 栈差异大，Agent 抽象较弱。
- **LobeChat 作为候补**：技术栈契合但企业功能/许可风险较高。

### 3.3 集成方式
- **一期采用 iframe 嵌入 LibreChat 指定路由**（如 `/c/new`）。
- **用户体系**：WeLink 后端签发 LibreChat JWT/token，iframe URL 携带 token。
- **长期迁移 OIDC**：若企业 IAM 支持 OIDC，二期替换 token 注入。

### 3.4 范围边界

**本期包含**：
- AI 工作台 landing page 壳层
- 多轮对话（企业 model config）
- 知识库 RAG（LibreChat RAG API + 企业 embed 模型）
- Canvas / Artifacts（React/HTML/Mermaid/SVG，不支持 PPT）
- 个人级使用数据收集到企业后台

**本期不包含**：
- 应用网格设计
- 督办场景集成（依赖 `supervision-collab-va` 上线）
- 请假/报销/审批等具体办公 skill
- 复杂数据脱敏与审计平台
- 原生 PPT 生成
- 移动端独立 App

---

## 4. 待 PM / 架构确认的关键问题

进入 prototype / 开发前，建议确认以下问题：

| # | 问题 | 当前状态 | 建议 |
|---|------|----------|------|
| 1 | LibreChat 部署形态：独立子域还是与 WeLink 同域反向代理？ | 未明确 | 独立子域更安全、解耦；同域可简化 cookie/sso |
| 2 | 企业 model gateway 是否已提供 OpenAI 兼容接口？ | 未明确 | POC 前必须确认接口规格 |
| 3 | 企业 embed 模型接口规格及 RAG API 适配方式 | 未明确 | 需 embed 模型团队提供接口文档 |
| 4 | 用户体系是否采用 token 注入（一期）还是直接 OIDC？ | 倾向 token 注入 | 若 IAM 已支持 OIDC，可缩短路径 |
| 5 | 数据收集是否需要实时？是否允许异步批量上报？ | 未明确 | 建议异步批量，降低 LibreChat 主链路延迟 |
| 6 | AI 工作台是否需要支持 Web 端访问，还是仅桌面客户端？ | 未明确 | 框架文档建议保留 Web 端最小能力 |
| 7 | 本地 Agent Runtime 是否纳入 AI 工作台一期？ | 本期不包含 | 按框架建议，本地增强为后续可选阶段 |

---

## 5. 进入下一阶段的前提条件

1. PM 确认上述 7 个关键问题中的前 4 个（部署形态、model gateway、embed 模型、用户体系）。
2. 研发团队完成 LibreChat 部署 POC，验证：
   - 与企业 model gateway 对接
   - iframe 嵌入 WeLink 主内容区
   - token 注入链路打通
   - 一条完整对话可记录到企业后台
3. 补充或完善 `integration-plan.md` 中标记为 `draft` 的部分。

---

## 6. 风险速览

| 风险 | 影响 | 缓解 |
|------|------|------|
| iframe 跨域 token 传递被安全团队挑战 | 中 | 使用一次性 exchange code 替代直接 token；长期迁移 OIDC |
| LibreChat 版本升级导致 patch 冲突 | 中 | token patch 尽量小且集中；升级前回归验证 |
| 企业 embed 模型接口不兼容 RAG API | 中 | POC 阶段先做向量化端到端验证 |
| MCP 服务器暴露内部接口 | 高 | 严格配置 allowedDomains；MCP 服务自带认证 |
| 个人级数据量大导致企业 DB 压力 | 中 | 事件发布异步 + 批量写入；按用户/时间分区 |

---

## 7. 推荐下一步动作

1. PM 审阅本 handoff，确认关键决策与待解决问题。
2. 通过 gate 后，进入 `product-prototype`：部署 LibreChat POC，验证 iframe 嵌入 + token 注入 + model gateway。
3. 同步启动 AI 工作台壳层前端路由与容器开发。

---

## 8. 相关文档索引

- `requirements/github-issue-3/requirements.md`
- `docs/research/ai-workbench-landing-page-oss-options.md`
- `designs/ai-workbench-landing-page/design-review.md`
- `designs/ai-workbench-landing-page/feasibility.md`
- `designs/ai-workbench-landing-page/integration-plan.md`
- `designs/ai-workbench-landing-page/feature-catalog.md`
- `designs/ai-workbench-landing-page/flows.md`
- `designs/ai-workbench-landing-page/data-model.md`
- `designs/ai-workbench-landing-page/tech-stack.md`
- `docs/welink-master-framework.md`
- `docs/welink-master-framework-architecture-review.md`

---

**PM 确认**：请确认本 handoff 内容是否完整、关键决策是否准确。确认后我将标记 `product-design-docs` 阶段 gate 审批通过，并继续推进 prototype。
