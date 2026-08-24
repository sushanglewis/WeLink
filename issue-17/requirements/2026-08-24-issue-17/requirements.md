# 需求文档: 2026-08-24-issue-17

<!-- status: draft -->

## 背景

- Issue: #17
- 访谈摘要: `issue-17/interviews/2026-08-24-issue-17/summary.md`
- 来源：GitHub Issue [#17](https://github.com/sushanglewis/WeLink/issues/17)「新版本需求」

WeLink（龙智协同）正在建设「数字员工」能力：在 Mattermost IM 中，人类员工可以与数字员工（agent）进行对话并协同完成任务。当前对话窗口是单一线性上下文，随着任务复杂度提升，存在以下问题：

1. 缺乏对多任务并行上下文的显式管理，历史话题难以回溯、切换和继续。
2. Agent 面对模糊需求时无法结构化澄清，导致反复猜测、效率低下。
3. 复杂任务缺少公开透明的执行计划（Plan）及人类审批机制。
4. Agent 无法直接引用和操作企业数据（多维表格），无法将表格数据/表单以自然方式嵌入对话。
5. 对话中产生的待办/日程无法自动落入个人日程看板，agent 也无法邀请其他成员参与。

## 问题

1. **聊天上下文管理不足**：现有 IM 对话是单一连续流，人与数字员工讨论多个任务时上下文混杂，无法像 AI 工作台一样按话题组织。
2. **需求澄清效率低**：Agent 对模糊需求只能文本反问，缺少 Codex 式的多选项澄清弹窗，用户表达意图成本高。
3. **复杂任务缺乏计划与审批**：Agent 直接执行复杂任务，缺少 Plan.md 形式的前因后果说明和人类审批闭环。
4. **企业数据难以在对话中操作**：Teable 多维表格数据无法以胶囊/表单形式进入聊天，agent 不能通过 skills 操作表格。
5. **日程与对话割裂**：对话中产生的待办无法自动创建为日程，agent 不能替人类安排会议并邀请成员。

## 目标

为 WeLink 数字员工对话窗口引入 AI 工作台化能力，并实现 AI 日程：

1. **话题管理**：在 IM 对话中提供话题列表，支持人与 agent 创建、切换、继续话题，每个话题有独立窗口与历史。
2. **Clarify 工具**：需求模糊时，agent 以底部弹窗提出多选题（3 推荐 + 1 自定义），用户选择后作为 user message 发送。
3. **Plan 模式**：复杂任务生成 Plan.md，以 markdown 展示并支持通过/修改按钮迭代，审批通过后 agent 执行。
4. **Teable 集成**：输入框支持选择 teable 表格并以胶囊插入消息；支持将 teable 表单视图作为 iframe 嵌入消息并填报提交。
5. **AI 日程**：每人拥有日程看板，agent 可从对话中识别待办并创建日程（时间/事项/参与人），支持邀请成员；选择开源、agent-friendly 的日历后端。

## 用户

- **普通员工**：通过数字员工完成日常任务，需要清晰的话题管理、需求澄清、计划审批。
- **数字员工（agent）**：需要结构化上下文、澄清工具、计划执行协议、数据操作 skills、日程创建能力。
- **团队协作者**：被 agent 邀请加入日程的其他成员。

## 方案（初定）

### 总体架构

延续 WeLink「薄外壳 + iframe/WebView 嵌入 + token SSO」的集成模式：

- **数字员工 IM 窗口即 AI 工作台**：不再单独建设独立工作台页面，而是将现有 IM 对话窗口直接 AI 工作台化。
- 数字员工聊天表面复用 issue-14 已建设的 Mattermost/OpenClaw 运行时。
- 话题、Clarify、Plan、各类胶囊（skills / MCP / 插件 / 多维表格）在聊天消息层扩展。
- 日程看板通过 iframe 嵌入开源日历产品；agent 通过 CalDAV/JMAP MCP server 或官方 CLI 操作日程。

### 话题管理

- 在聊天窗口侧边或顶部提供「话题列表」组件。
- 每个话题 = 一个 Mattermost thread = 独立的消息窗口 + 独立上下文。
- 人和 agent 均可创建新话题；点击历史话题可继续对话。
- 话题支持标题、创建时间、最后活跃时间、摘要。

### Clarify 工具

- 当 agent 识别到需求模糊时，通过定制化开发的 Clarify agent 工具生成澄清问题列表。
- agent 对该 thread 发起 Clarify 工具调用时，Mattermost 前端在该话题聊天窗口中弹出选项卡。
- 每个问题提供 3 个推荐选项 + 1 个「自定义」输入框；用户选择/填写后，以 user message 形式发送给 agent。
- Clarify 可单轮或多轮，直到需求明确。

### Plan 模式

- 当任务较复杂时，agent 生成 Plan.md（markdown），包含背景、目标、步骤、依赖、验收标准、风险。
- 前端以定制 Plan 消息卡片形式展示 Plan.md，附带「通过」「需要修改」按钮。
- agent 后端将 Plan.md 存储在该 thread 对应的文件中，便于版本管理与审批历史追溯。
- 用户点击「通过」后，通过 Mattermost 自定义 action / webhook / postMessage 回调 agent，agent 按 Plan 执行；点击「需要修改」或在输入框描述修改意见，agent 更新 Plan.md 文件并重新渲染卡片。
- Plan 审批通过前，agent 不执行 Plan 中的具体动作（除澄清外）。

### 胶囊系统（ skills / MCP / 插件 / 多维表格 ）

在输入框或 agent 消息中支持插入多种类型的胶囊，用于显式指定一个 skill、MCP server、插件或 teable 表格：

- **Skills 胶囊**：显示指定 skill 名称、描述、输入参数预览；点击后可将该 skill 及其上下文注入当前对话，agent 可调用。
- **MCP 胶囊**：显示指定 MCP server 名称、可用工具数量、关键工具预览；点击后可将 MCP 工具集接入当前 agent 上下文。
- **插件胶囊**：显示指定插件名称、版本、功能摘要；点击后激活插件能力。
- **Teable 胶囊**：显示指定 teable 表格关键信息（base_id、table_id、view_id、表名、权限范围）；点击后 agent 可通过 teable skills 操作数据。
- 四类胶囊采用统一的自定义 JSON schema，agent 解析后分发到 skill / MCP / 插件 / teable skills 调用。
- 胶囊统一支持：消息中渲染为可点击/展开的卡片、携带元数据、可被 agent 解析、支持删除/替换。

> 注：Teable 多维表格的集成与表单 iframe 能力已在 issue-6 实现，本次 #17 直接复用，不再重新评估 Teable 本身；重点是扩展胶囊类型到 skills、MCP、插件。

### Teable 表单 iframe

- 直接复用 issue-6 已实现的 teable 表单视图 iframe 嵌入能力。
- 表单以 iframe 形式嵌入消息，保持 teable 原样式。
- 用户在 iframe 中填写/修改字段并提交；提交结果通过 postMessage 回传聊天窗口，并同步到 teable。

### AI 日程

- 日程需要同时具备**前端 UI**和**后端服务**，且对人、对 agent 都友好。
- 为每个用户维护一个个人日程看板；看板通过 iframe 嵌入开源日历 UI。
- Agent 在对话中识别待办事项后，调用日历后端**帮助用户**创建、更新、删除事件（时间、标题、描述、参与人）。
- 事件支持邀请其他成员；被邀请的成员均可在自己的日程看板中看到该事件。
- **Agent 本身作为组织成员拥有独立日历身份**，可以管理自己的日程，并能在自己的事件触发时被唤醒执行动作。
- 用户侧只关注个人日程，无需与 Outlook / Google 日历互通。
- Agent 通过 token（app password / OAuth token）访问日历后端；操作封装为 CLI / MCP server / skill。
- 日历后端候选：Nextcloud Calendar（AGPL-3.0，主选，具备完整前后端）、Stalwart（AGPL-3.0，备选，后端强但需自研 UI）、Cal.com（需核实 2026 许可证变化）。

## 非目标

- 本次不替换 Mattermost 作为 IM 底层。
- 不单独建设独立 AI 工作台页面；数字员工 IM 窗口即工作台。
- Teable 多维表格集成与表单 iframe 已在 issue-6 实现，本次仅扩展胶囊类型，不重新评估 Teable 本身。
- 不要求日程后端支持移动端原生 SDK（Web/iframe 足够）。
- 不实现通用 AI 工作台的代码编辑/终端等能力，聚焦对话协作场景。
- 不替代企业现有 Outlook/Google 日历，本次也不与其互通。

## 验收标准

### 话题管理

- [ ] 聊天窗口中可看到话题列表。
- [ ] 人类用户可创建新话题并进入新话题窗口。
- [ ] Agent 可主动建议/创建新话题。
- [ ] 点击历史话题可加载该话题历史消息并继续对话。
- [ ] 话题切换不丢失上下文，且不同话题间消息隔离。

### Clarify 工具

- [ ] Agent 识别到模糊需求时，在聊天底部弹出 Clarify 选项卡。
- [ ] 每个问题至少展示 3 个推荐选项和 1 个自定义输入。
- [ ] 用户选择/填写后，以 user message 发送给 agent。
- [ ] 支持多轮 Clarify，直到需求明确。

### Plan 模式

- [ ] 复杂任务触发 Plan 模式，生成 Plan.md 消息卡片。
- [ ] Plan.md 以 markdown 渲染，包含背景、目标、步骤、依赖、验收标准、风险。
- [ ] 卡片提供「通过」和「需要修改」按钮。
- [ ] 用户可在输入框描述修改意见，agent 据此更新 Plan.md。
- [ ] Plan 未通过前，agent 不执行 Plan 中的关键动作。
- [ ] Plan 通过后，agent 按 Plan 执行并反馈进度。

### 胶囊系统

- [ ] 输入框「+」菜单支持选择 skills / MCP / 插件 / 多维表格并插入对应胶囊。
- [ ] Skills 胶囊展示 skill 名称、描述、输入参数预览；点击后可注入当前对话供 agent 调用。
- [ ] MCP 胶囊展示 MCP server 名称、可用工具数量、关键工具预览；点击后接入 agent 上下文。
- [ ] 插件胶囊展示插件名称、版本、功能摘要；点击后激活插件能力。
- [ ] Teable 胶囊展示表名、base_id / table_id / view_id 等关键信息；agent 可读取并调用 teable skills。
- [ ] 胶囊在消息中统一渲染为可点击/展开的卡片，支持删除/替换。

### Teable 表单 iframe

- [ ] 复用 issue-6 已实现的 teable 表单视图 iframe 嵌入。
- [ ] iframe 保持 teable 表单样式。
- [ ] 用户可在 iframe 中填写并提交。
- [ ] 提交后数据同步回 teable，并在聊天中反馈提交结果。

### AI 日程

- [ ] 日程后端具备完整前端 UI 与后端服务，对人、对 agent 都友好。
- [ ] 每人有一个日程看板入口，可通过 iframe 查看。
- [ ] Agent 可从对话中提取待办并**帮助用户**创建日程事件（时间、标题、参与人）。
- [ ] Agent 可将其他成员加入事件并发送邀请通知。
- [ ] 用户可在看板中查看、编辑、删除事件。
- [ ] **Agent 作为组织成员拥有独立日历身份，可管理自己的日程。**
- [ ] **Agent 可被自己的日程事件触发并执行对应动作（如会议前推送准备材料）。**
- [ ] 日历后端满足 MIT / Apache-2.0 / AGPL 协议，并提供 CLI/API/MCP 供 agent 调用。
- [ ] Agent 使用 token 访问日历后端，token 可独立签发和回收。

## 已确认决策与待决策问题

1. **话题持久化模型** ✅ 已确认：每个话题映射到一个 **Mattermost thread**。
2. **Plan.md 存储与审批回调** ✅ 已确认：前端使用定制 Plan 消息卡片展示；agent 后端将 Plan.md 存储在该 thread 对应的文件中；审批按钮通过 Mattermost 自定义 action / webhook / postMessage 回调 agent。
3. **Clarify 工具宿主** ✅ 已确认：定制化开发一个 Clarify agent 工具；agent 对该 thread 发起 Clarify 工具调用时，Mattermost 前端在该话题聊天窗口中弹出选项卡。
4. **胶囊元数据协议** ✅ 已确认：采用统一的**自定义 JSON schema**，四类胶囊由 agent 解析后分发调用。
5. **日程范围** ✅ 已确认：用户侧只关注**个人日程**；事件涉及多人时所有参与人均可见；**不与 Outlook / Google 日历互通**。
6. **日程 OSS 最终选择** ⏳ 仍待决策：日程需要同时具备**前后端**、对人/对 agent 都友好，且支持 **agent 作为组织成员独立管理日程并被事件触发**。在此约束下：
   - **Nextcloud Calendar（AGPL-3.0，fit 5/5）**：自带完整前后端与成熟日历 UI，CalDAV + 现成 MCP，最贴合「人+agent 共用」场景，**建议作为主选**。
   - **Stalwart（AGPL-3.0，fit 4/5）**：后端 JMAP 对 agent 最友好，但缺少日历 UI，需自研看板。
   - 是否接受 AGPL-3.0 在 WeLink 私有部署场景下的合规成本？若不接受，需转向 MIT 自建路径（sabre/dav + 自研 UI）。

## 参考

- 访谈转写：`issue-17/interviews/2026-08-24-issue-17/transcript.md`
- 访谈摘要：`issue-17/interviews/2026-08-24-issue-17/summary.md`
- 原始洞察：`issue-17/interviews/2026-08-24-issue-17/raw-insights.md`
- 日程开源调研：`issue-17/docs/research/schedule-oss-options.md`
- GitHub Issue #17：https://github.com/sushanglewis/WeLink/issues/17
