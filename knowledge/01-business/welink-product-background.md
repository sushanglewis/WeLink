# WeLink 产品背景与目标

## 元信息

- **来源访谈**: —
- **来源需求**: GitHub Issue #15 — 根据 issue 以及 welink 知识信息，总结 welink 背景和目标
- **关联 Issue**: [#3](https://github.com/sushanglewis/WeLink/issues/3)、[#6](https://github.com/sushanglewis/WeLink/issues/6)、[#11](https://github.com/sushanglewis/WeLink/issues/11)
- **实现 PR**: —
- **状态**: <!-- status: approved --> PM 已确认
- **标签**: welink, product-background, enterprise-im, government, ai-workbench, collaborative-spreadsheet

---

## 业务知识

### 产品定位

**WeLink（龙智协同）** 是一款面向政企客户的企业级即时通讯与协同办公平台，定位为私有化部署、国产化合规、可深度定制的"类飞书/钉钉"产品。产品在现有 **Mattermost 11.8.0** B/S 二开系统基础上，通过自有前端外壳、品牌替换、一级导航扩展和 AI/表格能力嵌入，逐步演进为具备 AI 工作台、多维表格、桌面客户端的政企协同门户。

### 目标用户

| 用户角色 | 核心诉求 |
|---------|---------|
| 企业内部普通员工 | 统一入口使用 AI、聊天、待办、日程、表格等办公能力 |
| 企业/部门管理员 | 配置企业 AI 能力、管理知识库、监督业务数据填报 |
| 政府/企业 IT 部门 | 私有化部署、国产化合规、品牌可控、安全可审计 |
| 产品/运营负责人 | 通过使用数据挖掘 AI 场景、验证 ROI |

### 核心问题

1. **入口割裂**：AI 能力（对话、知识库、Canvas、督办）分散，员工难以发现和使用。
2. **体验不完整**：浏览器访问 Mattermost 二开系统流程割裂，缺少自有品牌桌面客户端。
3. **品牌暴露**：Mattermost 品牌、设置项、术语不符合中国政企用户习惯。
4. **结构化协同缺失**：督办、项目管理等场景需要结构化数据载体，IM 消息难以承载。
5. **场景数据孤岛**：个人级 AI 使用数据未收集，无法支撑场景挖掘和价值验证。

### 产品目标

1. **AI 工作台作为一级落地页**：登录 IM 后直接进入 AI 门户，统一分发企业算力、智能体、技能、插件、MCP。
2. **企业自有品牌桌面客户端**：Tauri 桌面应用，原生一级导航 + WebView 嵌入现有 B/S 页面，隐藏 Mattermost 品牌。
3. **多维表格作为结构化协同层**：通过 Teable 嵌入，支撑督办、项目管理等需要协同表格的业务场景。
4. **数据驱动运营**：收集个人级 AI 使用事件，挖掘高频场景，验证 AI 投入价值。

### 关键业务决策

| 决策项 | 结论 | 说明 |
|--------|------|------|
| 目标市场 | 政企客户（政府/国企/大型企业） | 核心约束为国产化、私有化、品牌可控 |
| IM 核心 | Mattermost 11.8.0 二开 | 不替换 Mattermost 服务端，在其上构建外壳 |
| 桌面客户端 | Tauri + WebView | 混合 C/S + B/S 架构，逐步迁移功能到原生 |
| AI 工作台 | LibreChat 源码集成 | iframe 嵌入，token 注入 SSO，复用原生页面 |
| 多维表格 | Teable | 2026-07-15 选型确定，满足国产化约束；AGPL 需商业授权 |
| 督办场景 | 首个验证场景 | 连接 AI 工作台与多维表格的核心用例 |
| 品牌名 | 桌面端暂定 EAIC | 数据模型默认 `app_name` 为 WeLink，待提供企业 VI |

### 已规划能力

| 能力 | Issue | 状态 | 核心价值 |
|------|-------|------|---------|
| AI 工作台一级落地页 | #3 | 设计完成 | 统一 AI 入口，分发智能体/技能/MCP |
| 在线协同多维表格 | #6 | 设计完成 | 结构化数据层，支撑督办等场景 |
| 企业 IM 桌面应用 | #11 | UI 交接完成 | 自有品牌客户端，提升产品完整度 |

### 非目标

- 本期不替换 Mattermost 服务端或重实现 IM 协议。
- 本期不开发 iOS/Android 移动端应用。
- AI 工作台本期不包含请假/报销/审批/查文档/查同事/发起会议等具体办公 skill 的实现。
- 多维表格本期不替代法律合同签署流程，仅生成结构化订单/合作意向书。

### 价值

WeLink 通过"IM 核心 + AI 工作台 + 多维表格"三层架构，将传统 Mattermost 二开系统升级为面向政企的 AI-Native 协同平台，既保留私有化部署和国产化合规优势，又补齐 AI 入口、结构化协同和品牌化的关键短板。

---

## 相关链接

- [[welink-technology-stack]] — 技术栈与开源选型
- [Issue #3 — AI 工作台](https://github.com/sushanglewis/WeLink/issues/3)
- [Issue #6 — 多维表格](https://github.com/sushanglewis/WeLink/issues/6)
- [Issue #11 — 桌面应用](https://github.com/sushanglewis/WeLink/issues/11)
- `issue-3/requirements/github-issue-3/requirements.md`
- `issue-6/requirements/2026-07-10-collaborative-spreadsheet/feature-requirements.md`
- `issue-11/requirements/2026-07-20-issue-11/requirements.md`
- `oss/projects.yaml`
