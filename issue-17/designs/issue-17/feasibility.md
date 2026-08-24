# 可行性分析: issue-17

## 业务可行性

- **需求真实且高频**：访谈确认数字员工对话窗口在多任务并行、需求澄清、计划审批、数据操作、日程管理五个维度存在明确痛点；本设计直接对应验收标准逐项可验。
- **复用既有投资**：聊天表面复用 issue-14 的 Mattermost/OpenClaw 运行时；Teable 表格集成与表单 iframe 复用 issue-6 成果；桌面端承载复用 issue-11 Tauri。新增建设集中在消息层扩展（话题、Clarify、Plan、胶囊）与日程能力，边际成本低。
- **用户接受度**：IM 窗口即工作台，不引入新页面与新心智；Clarify 选项卡与 Plan 卡片均为对话内轻交互，学习成本低。
- **合规路径明确**：日程后端候选均在 MIT / Apache-2.0 / AGPL 范围内；AGPL 在私有部署模式下的网络触发条件已列入 PoC 评估项，且存在 MIT fallback（sabre/dav 自建）兜底，不存在无解合规风险。

## 技术可行性

- **话题 = Mattermost thread**：Mattermost 原生支持 thread（root post + replies），消息隔离、历史加载、权限模型均现成；WeLink 侧仅需维护话题元信息扩展（标题/摘要/最后活跃），技术风险低。
- **Clarify 工具**：agent 工具调用触发前端弹窗的链路可复用 issue-14 clarification 交互原型；选项卡为纯前端组件，答案以普通 user message 回传，无需改动 agent 核心协议。风险点为回调时序与幂等，已用 ClarifySession 状态机约束。
- **Plan 模式**：Plan.md 文件化存储（按 thread 关联）+ 定制消息卡片 + Mattermost 自定义 action / webhook / postMessage 回调，三部分均为成熟模式；执行锁定由 PlanDocument 状态机在 agent 侧强制，可实现性高。
- **胶囊系统**：统一自定义 JSON schema 随消息 metadata 传递，agent 解析后按 `capsule_type` 分发到 skill / MCP / 插件 / teable skills——分发目标四类能力在 agent 侧均已存在或可经标准协议接入，主要工作是 schema 定义、前端卡片渲染与权限过滤，技术风险中低。
- **Teable 表单 iframe**：issue-6 已实现并验收（iframe 嵌入、postMessage 回执、白名单控制），本期直接复用，风险低。
- **AI 日程**：为本期最大技术不确定性来源，核心未知项（日历后端选型、agent 独立身份、事件触发机制）已通过「PoC 后定案」策略管理，详见下节评估。
- **性能**：话题切换、Clarify 弹窗、Plan 卡片均为本地渲染与单次 API 调用，< 500ms 目标可达；日程看板为 iframe 加载，依赖后端部署质量，< 3s 目标在自托管条件下可达。

## 开源项目 / 框架参考

### 日程后端候选（调研详见 `issue-17/docs/research/schedule-oss-options.md`）

| 候选 | License | Agent 集成 | 日历 UI | 定位 |
|------|---------|-----------|---------|------|
| Nextcloud Calendar | AGPL-3.0 | CalDAV + occ CLI + 现成 CalDAV MCP servers；app password 作 token | 完整（月/周/日、共享、邀请 iMIP） | **主选（fit 5/5）** |
| Stalwart | AGPL-3.0（双许可 SELv2） | **JMAP for Calendars** + CalDAV + OAuth 2.0；RFC 6638 调度 | 无（需自研或复用第三方客户端） | **备选（fit 4/5）** |
| sabre/dav + 自研 UI | MIT | 自研 REST/MCP over CalDAV | 自研 | **Fallback（fit 3/5）** |

已排除：Radicale / Baïkal / DAViCal / SOGo（GPL 家族）；Apple CalendarServer（已归档）；EteSync（GPL adapter + 维护停滞 + E2EE 与 server-side agent 冲突）；Rallly（非日历产品、无公开 API）；Cal.com（2026 许可证变化未核实、偏预约页非看板，仅在出现对外预约子需求时单独评估）。

### 其他复用组件

- **Mattermost**（issue-14 已接入）：IM 底层、thread、自定义 action / webhook。
- **Teable**（issue-6 已接入）：多维表格与表单 iframe。
- **CalDAV MCP servers**（dominik1001/caldav-mcp、philflowio/dav-mcp 等）：agent 日程操作的现成 MCP 封装，PoC 直接复用验证。
- 协议标准：iCalendar (RFC 5545)、CalDAV (RFC 4791)、CalDAV Scheduling (RFC 6638，邀请/忙闲的关键使能器)、iTIP/iMIP (RFC 5546/6047)、JMAP/JSCalendar (RFC 8984)。

## 延期决策评估：日程 OSS PoC 计划

需求阶段已将「日程 OSS 最终选择」决策延期至设计阶段 PoC。本节给出 PoC 计划与评估结论。

### PoC 目标

在真实 WeLink 集成形态下验证「创建事件 + 邀请成员 + agent 独立账户 + 事件触发」最小闭环，而非纸面比对。

### PoC 范围与验收用例

| 用例 | Nextcloud Calendar | Stalwart | sabre/dav fallback |
|------|-------------------|----------|--------------------|
| iframe 嵌入日历 UI（月/周/日） | 验证原生 calendar app 嵌入与 SSO/token 注入 | 验证第三方客户端（AgenDAV/InfCloud）或自研简易看板 | 验证自研 UI 原型成本 |
| 创建/更新/删除事件（agent 代用户） | CalDAV MCP server + app password | JMAP for Calendars + OAuth token | 自研 REST over CalDAV |
| 邀请成员并通知 | RFC 6638 调度 + iMIP 邮件；验证通知可达性 | RFC 6638 调度；验证通知可达性 | 需自研 iMIP/iTIP，评估工作量 |
| Agent 独立日历身份 | 为 agent 建独立账户 + app password | 为 agent 建独立账户 + OAuth client | 自研账户模型 |
| 事件触发 agent | webhook/轮询 CalDAV sync-token；验证唤醒延迟 | JMAP push / 轮询；验证唤醒延迟 | 自研轮询，评估成本 |
| token 签发/回收 | app password 生命周期管理 | OAuth token 生命周期管理 | 自研 |

### PoC 通过标准

1. 最小闭环六项用例全部跑通，且 agent 侧调用统一封装为 skill / MCP / CLI。
2. iframe 嵌入满足安全基线（HTTPS、CSP、postMessage 白名单）。
3. 触发链路端到端延迟可接受（会议前 5 分钟提醒类场景，轮询兜底 ≤ 1 分钟对账间隔）。
4. License 合规评审通过：确认 WeLink 私有部署模式下 AGPL-3.0 网络触发条件可接受，或确认商业买断路径；任一不满足则降级到备选/fallback。
5. 运维成本评估落档：Nextcloud（PHP 单体，仅用于日历偏重）vs Stalwart（单二进制）vs 自研（长期维护成本）。

### 决策规则

- Nextcloud PoC 通过且 AGPL 合规可接受 → 定案主选。
- Nextcloud 不合规或 UI 嵌入验证失败 → 转 Stalwart PoC 结论；Stalwart 通过且愿意投入看板 UI → 定案备选。
- 两条 AGPL 路径均不可接受 → 启用 sabre/dav + 自研 UI fallback，并将「自研 iMIP/调度/触发」工作量计入排期。
- PoC 结论回填本文档与设计评审，作为 human_gate 审批输入。

### 对设计的影响（已前置消解）

- 数据模型（ScheduleEvent/ScheduleParticipant/ScheduleToken/AgentCalendarIdentity/ScheduleTriggerRule）按 RFC 5545/6638 通用语义建模，三个候选后端均可承载，PoC 结果不引发数据模型返工。
- ScheduleToken.token_type（app_password / oauth_token）已枚举两种形态。
- 触发通道（webhook / push / polling）已按三候选能力并集设计，polling 兜底保证任意后端可用。
- agent 侧统一封装层使后端替换成本限于适配层。

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| AGPL 日程后端商业分发合规成本 | 高 | PoC 含合规评审；评估商业买断（Stalwart SELv2 双许可）；保留 MIT fallback（sabre/dav 自建）。 |
| 话题模型与 issue-14 thread 规则不一致导致返工 | 高 | 设计已确认 topic = Mattermost thread（D-2）；实现前与 issue-14 规则对齐评审。 |
| Plan 审批交互与 OpenClaw runtime 集成复杂 | 中 | 复用/扩展 issue-14 clarification.html 原型；Plan 卡片与 Clarify 选项卡共用消息卡片协议；回调接口幂等。 |
| Teable iframe 跨域与权限控制 | 中 | 复用 issue-6 已验证的 postMessage 白名单 + CSP + token 注入；必要时一次性 exchange code。 |
| CalDAV/JMAP MCP server 成熟度不足 | 中 | PoC 直接验证现成 MCP servers；不满足时自研薄封装（CalDAV 协议稳定，成本可控）。 |
| Agent 独立日历身份与事件触发机制不确定 | 中 | 已建模 AgentCalendarIdentity 与 ScheduleTriggerRule；触发以 webhook/push 为主、polling 兜底；PoC 用例覆盖。 |
| 用户/法务不接受 AGPL 方案 | 中 | MIT fallback 已预留；fallback 触发自研 UI 与调度逻辑，工作量已在 PoC 用例中评估。 |
| Cal.com 许可证传闻影响评估完整性 | 低 | 本期不依赖 Cal.com；仅在出现对外预约子需求时单独核实 2026 许可证后再评估。 |

## 建议方案

1. **按 D-1 ~ D-9 关键决策实施**：IM 窗口即工作台；topic = thread；Plan.md 文件化 + 卡片审批；Clarify 定制工具；胶囊统一 JSON schema；复用 issue-6 Teable 成果。
2. **日程能力按 PoC 驱动落地**：在设计阶段完成 Nextcloud Calendar 主选 PoC（六项用例），合规与体验双通过后定案；agent 侧自始封装统一 skill / MCP / CLI 适配层，隔离后端差异。
3. **实施顺序建议**：话题管理 → 胶囊系统（含 Teable 复用）→ Clarify → Plan 模式 → AI 日程（依赖 PoC 结论），前四项不阻塞日程 PoC 并行推进。
