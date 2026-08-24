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

- 数字员工聊天表面复用 issue-14 已建设的 Mattermost/OpenClaw 运行时。
- 话题、Clarify、Plan、Teable 胶囊/表单在聊天消息层扩展。
- 日程看板通过 iframe 嵌入开源日历产品；agent 通过 CalDAV/JMAP MCP server 或官方 CLI 操作日程。

### 话题管理

- 在聊天窗口侧边或顶部提供「话题列表」组件。
- 每个话题 = 独立的消息窗口 + 独立上下文（可映射到 Mattermost thread 或 WeLink 后端独立表，待确认）。
- 人和 agent 均可创建新话题；点击历史话题可继续对话。
- 话题支持标题、创建时间、最后活跃时间、摘要。

### Clarify 工具

- 当 agent 识别到需求模糊时，生成澄清问题列表。
- 每个问题在聊天底部弹出选项卡：3 个推荐选项 + 1 个「自定义」输入框。
- 用户选择/填写后，以 user message 形式发送给 agent，继续后续处理。
- Clarify 可单轮或多轮，直到需求明确。

### Plan 模式

- 当任务较复杂时，agent 生成 Plan.md（markdown），包含背景、目标、步骤、依赖、验收标准、风险。
- Plan.md 以消息卡片形式展示，附带「通过」「需要修改」按钮。
- 用户点击「通过」后，agent 按 Plan 执行；点击「需要修改」或在输入框描述修改意见，agent 更新 Plan.md 并再次展示。
- Plan 审批通过前，agent 不执行 Plan 中的具体动作（除澄清外）。

### Teable 胶囊

- 输入框「+」菜单增加「多维表格 → 多维表格控件 → 数据库 → 多维表」四级选择。
- 用户选择自己有权限的 teable 表格后，以胶囊形式插入消息。
- 胶囊携带关键技术信息（base_id、table_id、view_id、表名、权限范围等），供 agent 调用 teable skills。
- 胶囊在消息中可点击展开查看表格概要。

### Teable 表单 iframe

- Agent 或用户可基于 teable 单条记录生成表单视图。
- 表单以 iframe 形式嵌入消息，保持 teable 原样式。
- 用户在 iframe 中填写/修改字段并提交；提交结果通过 postMessage 回传聊天窗口，并同步到 teable。

### AI 日程

- 为每个用户维护一个个人日程看板；看板通过 iframe 嵌入开源日历 UI。
- Agent 在对话中识别待办事项后，调用日历后端创建事件（时间、标题、描述、参与人）。
- 事件支持邀请其他成员；受邀人收到通知并可在自己的看板中看到事件。
- Agent 通过 token（app password / OAuth token）访问日历后端；操作封装为 CLI / MCP server / skill。
- 日历后端候选：Nextcloud Calendar（AGPL-3.0，主选）、Stalwart（AGPL-3.0，备选）、Cal.com（需核实 2026 许可证变化）。

## 非目标

- 本次不替换 Mattermost 作为 IM 底层。
- 不重新实现完整的 teable 多维表格产品，仅做集成与嵌入。
- 不要求日程后端支持移动端原生 SDK（Web/iframe 足够）。
- 不实现通用 AI 工作台的代码编辑/终端等能力，聚焦对话协作场景。
- 不替代企业现有 Outlook/Google 日历，但可考虑 CalDAV 互通。

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

### Teable 胶囊

- [ ] 输入框「+」菜单可四级选择 teable 表格。
- [ ] 选择后以胶囊形式插入消息，展示表名等关键信息。
- [ ] 胶囊携带 base_id / table_id / view_id 等技术信息。
- [ ] Agent 可读取胶囊信息并调用 teable skills 操作数据。

### Teable 表单 iframe

- [ ] 可将 teable 单条记录的表单视图以 iframe 嵌入消息。
- [ ] iframe 保持 teable 表单样式。
- [ ] 用户可在 iframe 中填写并提交。
- [ ] 提交后数据同步回 teable，并在聊天中反馈提交结果。

### AI 日程

- [ ] 每人有一个日程看板入口，可通过 iframe 查看。
- [ ] Agent 可从对话中提取待办并创建日程事件（时间、标题、参与人）。
- [ ] Agent 可将其他成员加入事件并发送邀请通知。
- [ ] 用户可在看板中查看、编辑、删除事件。
- [ ] 日历后端满足 MIT / Apache-2.0 / AGPL 协议，并提供 CLI/API/MCP 供 agent 调用。
- [ ] Agent 使用 token 访问日历后端，token 可独立签发和回收。

## 开放问题

1. **话题持久化模型**：话题是映射到 Mattermost thread、Mattermost channel，还是 WeLink 后端独立表？
2. **聊天宿主**：#17 的「人-数字员工对话窗口」是基于 issue-14 的 Mattermost/OpenClaw 数字员工聊天表面，还是 issue-3 的 AI 工作台落地页（LibreChat/WeKnora）？
3. **Plan.md 存储与审批回调**：Plan.md 存为消息卡片、Teable 记录还是文件？审批通过/修改的按钮如何回调 agent？
4. **Clarify 宿主**：是否复用 issue-14 的 `clarification.html` 原型？问题选项数据结构如何与 OpenClaw runtime 交互？
5. **Teable 胶囊字段**：胶囊中需携带 base_id / table_id / view_id / permission scope 中的哪些？使用 per-user token 还是共享 bot token？
6. **日程范围**：仅个人日历，还是也包含团队共享日历？是否需要与 Outlook/Google 日历互通？
7. **日程 OSS 最终选择**：主选 Nextcloud Calendar（AGPL-3.0，fit 5/5）还是 Stalwart（AGPL-3.0，JMAP，fit 4/5）？是否接受 AGPL 在 WeLink 私有部署场景下的合规成本？

## 参考

- 访谈转写：`issue-17/interviews/2026-08-24-issue-17/transcript.md`
- 访谈摘要：`issue-17/interviews/2026-08-24-issue-17/summary.md`
- 原始洞察：`issue-17/interviews/2026-08-24-issue-17/raw-insights.md`
- 日程开源调研：`issue-17/docs/research/schedule-oss-options.md`
- GitHub Issue #17：https://github.com/sushanglewis/WeLink/issues/17
