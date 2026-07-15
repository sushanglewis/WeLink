# UI Handoff：企业 AI 工作台落地页 — product-prototype

> **阶段**：product-prototype（UI 设计）
> **当前进入阶段**：product-prototype
> **变更**：`ai-workbench-landing-page` / GitHub issue #3
> **生成时间**：2026-07-15
> **状态**：待 UI 设计师启动

---

## 1. 阶段目标

为 WeLink「企业 AI 工作台一级落地页」产出 UI 设计产物，供研发实现使用：
- `fields.md` — 字段规格
- `ui-spec.md` — UI 规格
- `prototype.pen` — Pencil 可交互原型

---

## 2. 核心设计决策（已确认）

| # | 决策项 | 结论 |
|---|--------|------|
| 1 | **产品形态** | AI 工作台作为 WeLink 左侧导航一级入口，采用「AI 工作台 + 应用网格混合」形态。 |
| 2 | **主内容区** | 复用开源 AI 工作台原生页面，WeLink 仅提供承载壳层（顶部标题栏、iframe 容器）。 |
| 3 | **用户体系** | WeLink 后端签发 token，iframe URL 携带 token，员工无需二次登录。 |
| 4 | **一期范围** | 多轮对话、知识库 RAG、Canvas/Artifacts、应用网格、个人级数据收集。 |
| 5 | **本期不包含** | 督办场景集成、请假/报销/审批等办公 skill、复杂数据脱敏、原生 PPT、移动端。 |

---

## 3. ⚠️ 选型风险（需 PM 关注）

> **重要**：`integration-plan.md` 当前基于 **LibreChat** 编写，但 `requirements/github-issue-3/requirements.md` 已明确**政企/国产化硬约束**——开源选型必须为中国境内项目，LibreChat / Open WebUI / LobeChat 等境外项目**不适用**。
>
> **当前状态**：国产 AI 工作台/对话框架的选型**尚未最终确定**。UI 设计师启动前，建议 PM 先确认选型方向，或明确 UI 设计是否可以先按「壳层 + 通用 AI 工作台布局」推进，待选型确定后再调整细节。

---

## 4. UI 设计范围

### 4.1 必画屏幕

| 屏幕 | 内容 | 说明 |
|------|------|------|
| **WeLink 主界面 + 左侧导航** | 左侧导航含「AI 工作台」一级入口 | 入口图标、文案、选中态、hover 态 |
| **AI 工作台 landing page** | 顶部 AI 助手栏 + 应用/技能网格 + 核心场景卡片 + Canvas 入口 | 主屏幕，需完整布局 |
| **AI 助手栏交互态** | 自然语言输入框、发送按钮、建议提示、历史记录下拉 | 输入/发送/清空/历史状态 |
| **应用/技能网格** | 企业预配置 + 员工订阅的 skill/Agent/插件/MCP 入口卡片 | 卡片布局、分类标签、搜索、最近使用、推荐 |
| **核心场景卡片** | 督办（一期核心）、请假、报销、审批、查文档、查同事、发起会议（规划中） | 卡片样式、图标、文案、点击行为 |
| **Canvas 工作区入口** | 做 PPT、写文档等生成式内容创作的快捷入口 | 入口样式、展开/收起状态 |
| **多轮对话界面** | 对话列表、消息气泡、输入框、模型选择、知识库引用 | 复用开源 AI 工作台原生 UI 或自绘 |
| **知识库界面** | 文档上传、向量索引状态、知识库问答 | 复用或自绘 |
| **Canvas 工作区** | Artifacts 预览（React/HTML/Mermaid/SVG）、编辑/下载 | 复用或自绘 |
| **加载/错误/空态** | iframe 加载、模型调用失败、无对话历史、无知识库文档 | 各状态的表现 |

### 4.2 必定义交互

| 交互 | 说明 |
|------|------|
| 点击左侧导航「AI 工作台」→ 主内容区切换 | 切换动画、路由变化 |
| AI 助手栏输入 → 发送 → 显示回复 | 输入状态、发送状态、流式输出、停止生成 |
| 点击应用/技能卡片 → 进入对应功能 | 卡片点击、路由跳转、返回 |
| 点击核心场景卡片 → 进入场景 | 卡片点击、场景切换 |
| 点击 Canvas 入口 → 进入 Canvas 工作区 | 入口展开、工作区切换 |
| 知识库文档上传 → 向量化 → 可问答 | 上传状态、索引进度、完成提示 |
| 主题切换（明/暗） | 壳层与 AI 工作台的主题同步 |

### 4.3 不需要画的内容（明确排除）

- 督办场景具体界面（依赖 issue-6 上线）
- 请假/报销/审批等办公 skill 的具体界面（规划中）
- 复杂数据脱敏与审计平台界面
- 移动端界面

---

## 5. fields.md 输入（字段规格参考）

| 来源文档 | 可提取内容 |
|----------|-----------|
| `requirements/github-issue-3/prd.md` | 功能清单与验收条件 |
| `requirements/github-issue-3/user-stories.md` | 员工/管理员/决策层用户故事 |
| `designs/ai-workbench-landing-page/feature-catalog.md` | 功能清单与优先级 |
| `designs/ai-workbench-landing-page/data-model.md` | User / UsageEvent / KnowledgeDoc 等数据模型 |
| `designs/ai-workbench-landing-page/flows.md` | 核心用户流程 |

---

## 6. ui-spec.md 输入（UI 规格参考）

| 来源文档 | 可提取内容 |
|----------|-----------|
| `designs/ai-workbench-landing-page/design-review.md` | 方向、范围、核心取舍 |
| `designs/ai-workbench-landing-page/integration-plan.md` | 嵌入架构、SSO、模型、RAG、MCP、数据收集（**注意：基于 LibreChat，需按国产化约束调整**） |
| `designs/ai-workbench-landing-page/scenarios.md` | 用户场景 |
| `designs/ai-workbench-landing-page/feasibility.md` | 可行性分析 |
| `designs/ai-workbench-landing-page/tech-stack.md` | 技术栈说明 |
| `designs/ai-workbench-landing-page/diagrams/ai-workbench-flows.drawio` | 流程图 |

---

## 7. 关键约束

1. **国产化硬约束**：开源选型必须为中国境内项目。当前 integration-plan 基于 LibreChat 编写，需按国产方案调整。
2. **完全复用开源 AI 工作台原生 UI**：WeLink 仅提供壳层，不重复绘制 UI/UX。
3. **仅 PC 端**：不考虑移动端独立 App。
4. **设计系统待定**：视觉风格后续由 UI 团队提供。
5. **个人级数据收集**：用户使用行为数据需记录到企业后台，UI 设计师需考虑数据上报的透明性（如隐私提示）。

---

## 8. 待 UI 设计师产出的产物清单

| 产物 | 路径 | 说明 |
|------|------|------|
| `fields.md` | `designs/ai-workbench-landing-page/fields.md` | 字段规格 |
| `ui-spec.md` | `designs/ai-workbench-landing-page/ui-spec.md` | UI 规格 |
| `prototype.pen` | `designs/ai-workbench-landing-page/prototype.pen` | Pencil 原型 |

---

## 9. 相关文档索引

- `requirements/github-issue-3/requirements.md`
- `requirements/github-issue-3/prd.md`
- `requirements/github-issue-3/user-stories.md`
- `designs/ai-workbench-landing-page/design-review.md`
- `designs/ai-workbench-landing-page/feasibility.md`
- `designs/ai-workbench-landing-page/integration-plan.md`
- `designs/ai-workbench-landing-page/feature-catalog.md`
- `designs/ai-workbench-landing-page/flows.md`
- `designs/ai-workbench-landing-page/data-model.md`
- `designs/ai-workbench-landing-page/tech-stack.md`
- `designs/ai-workbench-landing-page/scenarios.md`
- `designs/ai-workbench-landing-page/diagrams/ai-workbench-flows.drawio`
- `docs/research/ai-workbench-landing-page-oss-options.md`
- `handoffs/lincoln-handoff-product-design-docs.md`

---

**PM 确认**：本 handoff 基于现有产物编写。请在 UI 设计师启动前确认国产 AI 工作台选型方向，或明确 UI 设计可按「壳层 + 通用 AI 工作台布局」先行推进。
