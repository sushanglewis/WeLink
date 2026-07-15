# Design Review: 企业 AI 工作台一级落地页

> Related documents:
> - [scenarios.md](scenarios.md)
> - [feature-catalog.md](feature-catalog.md)
> - [data-model.md](data-model.md)
> - [flows.md](flows.md)
> - [feasibility.md](feasibility.md)
> - [tech-stack.md](tech-stack.md)
> - [需求文档](../../requirements/github-issue-3/requirements.md)
> - [开源方案研究报告](../../docs/research/ai-workbench-landing-page-oss-options.md)

<!-- status: draft -->

## 1. 决策摘要

### 1.1 产品方向

基于当前"龙智协同"前端布局框架（左侧导航 + 顶部标题栏 + 主内容区 + 右侧区域），AI 工作台作为一级入口。截图仅用于参考整体布局框架，具体功能内容不照搬。

AI 工作台形态主要遵循 **LibreChat UI/UX**，优先最大化复用 LibreChat 原生能力（多轮对话、RAG、Artifacts、Agents、MCP、Skills），快速上线：

- **左侧导航**：保留"AI 工作台"作为一级入口。
- **主内容区**：嵌入/复用 LibreChat 前端页面，作为核心对话和工作区。
- **应用网格/督办集成**：本期不做具体设计，列入后续规划；督办场景需等待 `designs/supervision-collab-va` 功能上线后再集成。

员工进入 AI 工作台后，直接使用 LibreChat 原生体验，无需学习新的 UI。后续再逐步叠加企业自定义能力。

### 1.2 开源方案

- **首选**：LibreChat（MIT License）
- **理由**：原生支持 Agents、MCP、Skills、Artifacts，与需求中"分发算力、智能体、技能、插件、MCP"高度契合；前端为 React/TypeScript，与 WeLink 现有 React + Webpack 栈同源；支持企业 SSO/LDAP/SAML/2FA。
- **集成原则**：**尽可能复用 LibreChat 前端页面**，不做独立 UI/UX 重绘；WeLink 仅提供承载壳层（路由/iframe/容器）和 IM 用户体系打通。
- **用户体系打通**：WeLink 登录态映射到 LibreChat 用户，实现单点登录和身份同步；员工在 WeLink 内进入 AI 工作台时，无需再次登录 LibreChat。

### 1.3 核心设计取舍

| 议题 | 选择 | 理由 |
|------|------|------|
| 布局形态 | **LibreChat UI/UX**，截图仅参考整体布局框架 | 优先复用 LibreChat 原生能力，快速上线 |
| 嵌入方式 | **复用 LibreChat 前端页面** + WeLink 壳层承载 | 避免重复造轮子，聚焦用户体系打通 |
| 知识库 | 复用 LibreChat RAG API | 企业暂无独立知识库，企业提供 embed 模型 |
| Canvas | LibreChat Artifacts 替代 | 支持 React/HTML/Mermaid/SVG；PPT 暂不支持，一期不做 |
| 数据收集 | 企业后台数据库 | 个人级轨迹写入企业数据库，本期不脱敏 |
| 应用网格 | 本期不做，列入规划 | 优先最大化利用 LibreChat 原生能力 |
| 督办集成 | 本期不做，依赖 `supervision-collab-va` 上线后集成 | 避免阻塞本期快速上线 |
| 用户体系 | IM 登录态映射到 LibreChat | 实现单点登录，员工无感进入 AI 工作台 |

## 2. 范围

### 2.1 本期包含

- **集成方案设计**：如何复用 LibreChat 前端页面、如何与 IM 用户体系打通、如何在当前"龙智协同"布局框架中承载
- AI 工作台 landing page 壳层（左侧导航入口 + 主内容区承载 LibreChat）
- 多轮对话（复用 LibreChat，基于企业 model config）
- 知识库 RAG（复用 LibreChat RAG API + 企业 embed 模型）
- Canvas/Artifacts（复用 LibreChat，生成可下载的 React/HTML/Mermaid/SVG）
- 个人级使用数据收集并写入企业后台数据库

### 2.2 本期不包含

- **应用网格设计**：本期不做，列入后续规划。
- **督办场景集成**：依赖 `designs/supervision-collab-va` 功能上线后，再以 skill/iframe/API 方式接入。
- 请假、报销、审批、查文档、查同事、发起会议等办公 skill 的具体实现（列入规划）。
- 复杂数据脱敏与审计
- 面向业务负责人的数据分析平台
- 原生 PPT 生成
- AI 工作台独立域名或移动端独立 App

## 3. 目标用户

- **主要用户**：组织内部普通员工
- **次要用户**：企业/部门管理员
- **间接受益者**：业务负责人、产品/运营

## 4. 关键指标

- AI 工作台 DAU / WeLink DAU
- 人均会话数
- 知识库问答使用次数
- Canvas/Artifacts 生成次数
- 高频使用场景 Top 10

## 5. 待解决问题

1. LibreChat 页面在当前"龙智协同"布局中的具体嵌入方式（iframe 路由、尺寸适配、主题风格统一）。
2. 企业后台数据库类型和访问方式。
3. 员工账号体系与 LibreChat 用户映射方式。
4. 企业 embed 模型接口规格。

## 6. 审批清单

- [x] 布局形态确认：LibreChat UI/UX，截图仅参考整体布局框架
- [x] 开源方案确认：LibreChat 首选
- [x] **集成原则确认：复用 LibreChat 前端页面，不重复绘制 UI/UX**
- [x] **用户体系打通确认：IM 登录态映射到 LibreChat**
- [x] 范围确认：应用网格、督办集成本期不做，列入规划
- [x] 关键指标确认

<!-- status: approved -->
