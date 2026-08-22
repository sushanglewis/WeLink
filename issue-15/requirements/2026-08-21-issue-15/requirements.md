# Issue #15 — WeLink 产品背景与目标

## 元信息

- **Issue**: [#15 根据 issue 以及 welink 知识信息，总结 welink 背景和目标](https://github.com/sushanglewis/WeLink/issues/15)
- **Session ID**: 2026-08-21-issue-15
- **分支**: issue-15
- **工作流**: interview-to-knowledge
- **当前阶段**: build-codebase-knowledge
- **人类审批状态**: 待 PM 确认
- **标签**: welink, product-background, knowledge-curation

---

## 背景

WeLink（龙智协同）当前基于 Mattermost 11.8.0 进行 B/S 二开，已形成企业级即时通讯与协同办公的基础能力。随着 AI 能力与结构化协同需求的增加，产品需要在现有基础上补齐以下短板：

1. **AI 入口分散**：对话、知识库、Canvas、督办等 AI 能力缺少统一入口，员工难以发现和使用。
2. **品牌与体验不完整**：浏览器访问 Mattermost 二开系统流程割裂，缺少企业自有品牌的桌面客户端。
3. **结构化协同缺失**：督办、项目管理等场景需要结构化数据载体，IM 消息难以承载和跟踪。
4. **场景数据未沉淀**：个人级 AI 使用数据未收集，无法支撑场景挖掘和价值验证。

## 目标

1. **AI 工作台作为一级落地页**：登录 IM 后直接进入 AI 门户，统一分发企业算力、智能体、技能、插件、MCP。
2. **企业自有品牌桌面客户端**：基于 Tauri 的桌面应用，原生一级导航 + WebView 嵌入现有 B/S 页面，隐藏 Mattermost 品牌。
3. **多维表格作为结构化协同层**：通过 Teable 嵌入，支撑督办、项目管理等需要协同表格的业务场景。
4. **数据驱动运营**：收集个人级 AI 使用事件，挖掘高频场景，验证 AI 投入价值。

## 范围

### 包含

- 整理 WeLink 产品定位、目标用户、核心问题、产品目标。
- 整理现有技术栈与开源选型（Mattermost、LibreChat、Teable、Tauri 等）。
- 沉淀业务知识到 `knowledge/01-business/welink-product-background.md`。
- 沉淀技术知识到 `knowledge/02-technical/welink-technology-stack.md`。
- 更新 `knowledge/00-index.md` 索引。

### 不包含

- 不修改实际 WeLink 代码（代码托管在 Gitee）。
- 不生成新的代码实现或 PR。
- 不涉及移动端应用开发。

## 验收标准

- [ ] `knowledge/01-business/welink-product-background.md` 已创建并通过 PM 审批。
- [ ] `knowledge/02-technical/welink-technology-stack.md` 已创建并通过 PM 审批。
- [ ] `knowledge/00-index.md` 已更新并链接到上述两篇文档。
- [ ] `issue-15/docs/research/welink-background-summary.md` 已创建。
- [ ] Lincoln 阶段校验（validate-entry / validate-exit）通过。
- [ ] 产物路径已通过 `record-artifacts` 写回 `issue-15/workflow-stage.yaml`。

## 关联文档

- `issue-15/docs/research/welink-background-summary.md`
- `knowledge/01-business/welink-product-background.md`
- `knowledge/02-technical/welink-technology-stack.md`
- `knowledge/00-index.md`

## 变更记录

| 日期 | 版本 | 说明 | 作者 |
|------|------|------|------|
| 2026-08-21 | 1.0.0 | 初始版本 | Agent |
