# WeLink 背景综述

## 元信息

- **来源**: GitHub Issue #15 — 根据 issue 以及 welink 知识信息，总结 welink 背景和目标
- **Session ID**: 2026-08-21-issue-15
- **关联 Issue**: [#3](https://github.com/sushanglewis/WeLink/issues/3)、[#6](https://github.com/sushanglewis/WeLink/issues/6)、[#11](https://github.com/sushanglewis/WeLink/issues/11)
- **状态**: 待 PM 确认

---

## 一句话总结

WeLink（龙智协同）是一款面向政企客户、基于 Mattermost 二开的企业级即时通讯与协同办公平台，当前正通过集成 LibreChat（AI 工作台）、Teable（多维表格）和 Tauri（自有品牌桌面客户端），补齐 AI 入口、结构化协同和品牌化三大短板。

## 产品背景

WeLink 现有的 IM 核心基于 **Mattermost 11.8.0** B/S 二开系统，前后端技术栈为 Spring Cloud + React/TypeScript。产品已具备聊天、通讯录、日程、知识库等基础协同能力，但面临以下问题：

1. **AI 入口割裂**：对话、知识库、Canvas、督办等能力分散，缺少统一发现和使用入口。
2. **体验不完整**：缺少自有品牌桌面客户端，用户需通过浏览器访问 Mattermost 二开页面。
3. **品牌暴露**：Mattermost 品牌、设置项和术语不符合中国政企用户习惯。
4. **结构化协同缺失**：督办、项目管理等场景需要表格化、可跟踪的协同载体。
5. **数据孤岛**：个人级 AI 使用数据未收集，无法验证 AI 投入价值。

## 产品目标

| 目标 | 关键举措 | 关联 Issue |
|------|---------|-----------|
| AI 工作台作为一级落地页 | 集成 LibreChat，iframe 嵌入，token 注入 SSO | #3 |
| 多维表格支撑结构化协同 | 集成 Teable，全屏 iframe，Mattermost bot 通知 | #6 |
| 企业自有品牌桌面客户端 | Tauri + WebView，自定义导航，隐藏 Mattermost 品牌 | #11 |
| 数据驱动运营 | 收集 AI 使用事件到 WeLink MySQL | #3 |

## 关键决策

- **目标市场**：政企客户（政府、国企、大型企业），核心约束为国产化、私有化、品牌可控。
- **IM 核心不替换**：在 Mattermost 上构建外壳，不重新实现 IM 协议。
- **AI 工作台选型**：LibreChat（MIT），React/TS 前端，原生支持 Agents/MCP/Skills/Artifacts。
- **多维表格选型**：Teable（AGPL-3.0，需商业授权），2026-07-15 确定，满足国产化约束。
- **桌面客户端选型**：Tauri（MIT/Apache-2.0），混合 C/S + B/S 架构。
- **督办场景**：作为首个验证场景，连接 AI 工作台与多维表格。

## 待澄清风险

1. **技术栈不一致**：`issue-6` UI 规格标注 WeLink 客户端为"Electron / Web"，而 `issue-11` 已确定为 Tauri，需统一。
2. **SSO 阶段差异**：PRD 宣传企业邮箱 SSO，但 UI 交接当前阶段收窄为仅用户名/密码，SSO 预留。
3. **LibreChat 国产化张力**：需求层面指出海外项目不适用于政企交付，但设计层面仍选择 LibreChat，需确认后续是否替换为国内方案。
4. **Teable 权限**：开源核心缺少行/列级权限，督办场景必须采购 Enterprise。

## 沉淀位置

- 业务知识：`knowledge/01-business/welink-product-background.md`
- 技术知识：`knowledge/02-technical/welink-technology-stack.md`
- 索引入口：`knowledge/00-index.md`

## 参考来源

- `issue-3/requirements/github-issue-3/requirements.md`
- `issue-3/requirements/github-issue-3/prd.md`
- `issue-3/designs/ai-workbench-landing-page/tech-stack.md`
- `issue-3/designs/ai-workbench-landing-page/integration-plan.md`
- `issue-6/requirements/2026-07-10-collaborative-spreadsheet/feature-requirements.md`
- `issue-6/designs/supervision-collab-va/integration-plan.md`
- `issue-11/requirements/2026-07-20-issue-11/requirements.md`
- `issue-11/requirements/2026-07-20-issue-11/prd.md`
- `issue-11/designs/issue-11/ui-handoff.md`
- `issue-11/designs/issue-11/data-model.md`
- `oss/projects.yaml`
