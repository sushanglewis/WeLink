# Design Review: issue-17

<!-- status: draft -->

## 背景

- Issue: #17
- 关联需求: `issue-17/requirements/2026-08-24-issue-17/requirements.md`
- 关联访谈: `issue-17/interviews/2026-08-24-issue-17/summary.md`
- 日程开源调研: `issue-17/docs/research/schedule-oss-options.md`

WeLink（龙智协同）的数字员工对话窗口目前为单一线性上下文，多任务并行时话题混杂、需求澄清低效、复杂任务缺少计划审批闭环，且对话中产生的待办无法落入个人日程。本设计将数字员工 IM 窗口直接 AI 工作台化，并新增 AI 日程能力。

## 设计目标

1. **话题级上下文管理**：在 IM 对话中提供话题列表，话题与 Mattermost thread 一一映射，支持人与 agent 创建、切换、继续话题。
2. **结构化澄清（Clarify）**：需求模糊时，agent 通过定制 Clarify 工具在话题窗口底部弹出多选项卡片（3 推荐 + 1 自定义），用户选择后以 user message 回传。
3. **计划审批闭环（Plan 模式）**：复杂任务生成 Plan.md，以定制消息卡片展示并提供「通过 / 需要修改」按钮，审批回调驱动 agent 执行或迭代。
4. **胶囊系统**：skills / MCP / 插件 / Teable 四类胶囊采用统一自定义 JSON schema，经输入框「+」菜单插入消息，agent 解析后分发调用；Teable 表单 iframe 复用 issue-6 成果。
5. **AI 日程**：为每位用户提供 iframe 嵌入的个人日程看板；agent 可代用户创建/更新/删除日程并邀请成员；agent 作为组织成员拥有独立日历身份，可管理自身日程并被日程事件触发执行动作。

## 范围

### 范围内

- 话题管理：话题列表、创建、切换/继续、元信息（标题/创建时间/最后活跃/摘要）、agent 建议创建话题。
- Clarify 工具：agent 端 Clarify 工具、前端底部选项卡、多轮澄清、结果以 user message 回传。
- Plan 模式：Plan.md 生成与文件化存储（按 thread 关联）、Plan 消息卡片渲染、「通过/需要修改」按钮与回调、Plan 迭代、执行锁定与进度反馈。
- 胶囊系统：统一自定义 JSON schema；skills / MCP / 插件 / Teable 四类胶囊的「+」菜单插入、消息内卡片渲染、删除/替换；agent 解析与分发调用。
- Teable 表单 iframe：复用 issue-6 的表单视图 iframe 嵌入、填报提交、postMessage 回执。
- AI 日程：个人日程看板（iframe 嵌入开源日历 UI）、agent 代管日程 CRUD、成员邀请与通知、agent 独立日历身份、日程事件触发 agent、agent 访问 token 签发与回收。
- 日程 OSS PoC：在设计阶段对 Nextcloud Calendar（主选）/ Stalwart（备选）/ sabre/dav + 自研 UI（fallback）完成最小闭环 PoC 后定案。

### 范围外

- 替换 Mattermost 作为 IM 底层。
- 单独建设独立 AI 工作台页面（IM 窗口即工作台）。
- Teable 多维表格集成与表单 iframe 的重新评估（issue-6 已实现，直接复用）。
- 日程后端移动端原生 SDK（Web/iframe 足够）。
- 通用 AI 工作台的代码编辑/终端能力。
- 与 Outlook / Google 日历互通。

## 关键决策

| 决策 | 选项 | 理由 |
|------|------|------|
| D-1 工作台形态 | 数字员工 IM 窗口即 AI 工作台 | 避免另建工作台页面；话题、Clarify、Plan、胶囊均在消息层扩展，复用 issue-14 Mattermost/OpenClaw 运行时。 |
| D-2 话题持久化模型 | 每个话题 = 一个 Mattermost thread | 天然获得消息隔离、历史回溯与权限模型；避免自建会话存储导致后期重构。 |
| D-3 Plan.md 存储与审批 | 前端定制 Plan 消息卡片；agent 后端按 thread 关联文件存储 Plan.md；审批经 Mattermost 自定义 action / webhook / postMessage 回调 | 文件化存储便于版本管理与审批历史追溯；卡片 + 回调构成人类审批闭环，未通过前执行锁定。 |
| D-4 Clarify 工具宿主 | 定制 Clarify agent 工具；工具调用触发 Mattermost 前端在该话题窗口弹出选项卡 | 复用 agent 工具调用链路；选项卡内嵌话题窗口，降低用户表达成本（3 推荐 + 1 自定义）。 |
| D-5 胶囊元数据协议 | 统一自定义 JSON schema，agent 解析后分发到 skill / MCP / 插件 / teable skills | 四类胶囊一致渲染、携带元数据、可删除/替换；schema 统一降低 agent 解析与后续扩展成本。 |
| D-6 Teable 集成 | 直接复用 issue-6 已实现的表格集成与表单 iframe | 避免重复建设；本期仅扩展胶囊类型到 skills / MCP / 插件。 |
| D-7 日程范围 | 个人日程；多人事件所有参与人可见；不与 Outlook/Google 互通 | 聚焦数字员工协同主场景，降低协议与合规复杂度。 |
| D-8 日程 OSS 选型 | 暂缓定案，设计阶段 PoC 后决策：主选 Nextcloud Calendar（AGPL-3.0），备选 Stalwart（AGPL-3.0），fallback sabre/dav + 自研 UI（MIT） | Nextcloud 前后端完整最贴合「人+agent 共用」；Stalwart JMAP 最 agent-friendly 但缺 UI；AGPL 合规不可接受时退回 MIT 自建路径。详见 [可行性分析](./feasibility.md)。 |
| D-9 Agent 日程访问 | token（app password / OAuth token）+ 封装为 skill / MCP server / CLI | token 可独立签发、轮换、回收；封装层隔离后端，便于 PoC 后替换实现。 |

## 验收标准

- [ ] 聊天窗口可见话题列表；人可创建新话题；agent 可建议/创建话题；点击历史话题加载该话题消息并继续对话；话题间消息隔离。
- [ ] 需求模糊时 agent 在话题窗口底部弹出 Clarify 选项卡；每题 3 推荐选项 + 1 自定义输入；选择/填写后以 user message 发送；支持多轮。
- [ ] 复杂任务生成 Plan.md 卡片（背景/目标/步骤/依赖/验收标准/风险）；卡片含「通过」「需要修改」按钮；输入框可描述修改意见并驱动 Plan.md 更新；未通过前 agent 不执行关键动作；通过后按计划执行并反馈进度。
- [ ] 「+」菜单支持插入 skills / MCP / 插件 / Teable 四类胶囊；各胶囊展示约定元信息；agent 可解析并调用对应能力；胶囊统一渲染为可点击/展开卡片，支持删除/替换。
- [ ] Teable 表单 iframe 复用 issue-6：保持原样式、可填写提交、结果同步 teable 并在聊天中反馈。
- [ ] 每人有日程看板入口（iframe 嵌入开源日历 UI）；agent 可从对话创建日程并邀请成员；受邀人在其看板可见；用户可在看板查看/编辑/删除事件。
- [ ] Agent 拥有独立日历身份，可管理自己的日程；日程事件到达触发条件时可唤醒 agent 执行配置动作。
- [ ] 日程后端 license 属于 MIT / Apache-2.0 / AGPL；提供 CLI / REST API / MCP server / JMAP 至少一种可编程接口；agent 使用可独立签发与回收的 token 访问。

## 关联文档

- [场景分析](./scenarios.md)
- [功能目录](./feature-catalog.md)
- [数据模型](./data-model.md)
- [流程图](./flows.md)
- [可行性分析](./feasibility.md)

---
*PM 确认时请添加 `<!-- status: approved -->` 或 `[x] PM 已确认设计文档`。*
