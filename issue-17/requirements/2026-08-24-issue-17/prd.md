# PRD: 2026-08-24-issue-17

## 产品目标

为 WeLink 数字员工对话窗口引入 AI 工作台化能力，并实现 AI 日程功能：

1. 让 IM 对话具备话题级别的上下文管理能力，支撑多任务并行协作。
2. 通过 Codex 风格的 Clarify 工具降低需求澄清成本。
3. 通过 Plan 模式建立复杂任务的人类审批闭环，提升 agent 执行的可控性。
4. 将 skills、MCP、插件、多维表格以胶囊形式嵌入对话，并复用 issue-6 已实现的 Teable 表单 iframe，让 agent 能够操作企业数据与调用外部能力。
5. 为每位用户提供个人日程看板；让 agent 能够帮助用户管理日程，同时让 agent 作为组织成员拥有独立日历身份、管理自己的日程，并能够被日程事件触发执行动作。

## 功能需求

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 话题列表展示 | 在聊天窗口中展示当前对话的所有话题 | P0 |
| 创建新话题 | 人类或 agent 可创建新话题并进入独立窗口 | P0 |
| 切换/继续话题 | 点击历史话题加载其消息并继续讨论 | P0 |
| 话题摘要与元信息 | 话题显示标题、创建时间、最后活跃时间、可选摘要 | P1 |
| Clarify 底部弹窗 | 需求模糊时 agent 弹出多选项澄清卡片 | P0 |
| Clarify 自定义输入 | 每个问题提供 3 推荐选项 + 1 自定义输入 | P0 |
| Clarify 多轮支持 | 支持连续多轮澄清直到需求明确 | P1 |
| Plan.md 生成 | 复杂任务触发时 agent 生成 markdown 计划 | P0 |
| Plan.md 展示 | 以消息卡片形式渲染 Plan.md | P0 |
| Plan 通过/修改按钮 | 卡片提供「通过」和「需要修改」按钮 | P0 |
| Plan 迭代修改 | 用户在输入框描述修改意见，agent 更新 Plan.md | P0 |
| Plan 执行锁定 | Plan 未通过前不执行关键动作 | P0 |
| 胶囊「+」菜单 | 输入框「+」菜单支持选择 skills / MCP / 插件 / 多维表格 | P0 |
| Skills 胶囊插入 | 选择 skill 后以胶囊形式插入消息，展示名称/描述/参数预览 | P0 |
| MCP 胶囊插入 | 选择 MCP server 后以胶囊形式插入消息，展示名称/可用工具数/关键工具预览 | P0 |
| 插件胶囊插入 | 选择插件后以胶囊形式插入消息，展示名称/版本/功能摘要 | P0 |
| 多维表格胶囊插入 | 选择 teable 表格后以胶囊形式插入消息，展示表名及 base_id / table_id / view_id | P0 |
| 胶囊解析与调用 | Agent 可解析消息中的胶囊并调用对应的 skill / MCP / 插件 / teable skills | P0 |
| Teable 表单 iframe 嵌入 | 复用 issue-6 已实现的 teable 单条记录表单 iframe 嵌入消息 | P0 |
| Teable 表单填报提交 | 用户在 iframe 中填写并提交，数据同步回 teable | P0 |
| 日程看板入口 | 提供个人日程看板入口，通过 iframe 嵌入完整开源日历 UI | P0 |
| Agent 创建日程 | Agent 从对话中提取待办并帮助用户创建事件 | P0 |
| Agent 邀请成员 | Agent 可将其他成员加入日程并发送邀请 | P0 |
| 个人日程范围 | 用户只关注个人日程；多人事件所有参与人均可见；不与外部日历互通 | P0 |
| Agent 日程 Token | 为 agent 签发访问日历后端的 token | P0 |
| Agent 独立日历身份 | Agent 作为组织成员拥有独立账户/身份，可管理自己的日程 | P0 |
| 日程事件触发 Agent | 事件到达触发条件时唤醒 agent 执行动作（如推送会议材料） | P0 |
| 日程看板编辑 | 用户在 iframe 看板中查看/编辑/删除事件 | P1 |
| 日程通知 | 事件创建/邀请时发送通知 | P1 |

## 非功能需求

| 类别 | 需求 |
|------|------|
| License | 日程后端必须采用 MIT / Apache-2.0 / AGPL；GPL 家族排除。 |
| Agent 友好 | 日历后端需提供 CLI、REST API、MCP server 或 JMAP 中至少一种可编程接口。 |
| 国产化 | 优先选择国内可部署或有商业买断路径的开源方案；遵循 issue-3/6/11/14 的国产化约束。 |
| 安全 | iframe 嵌入启用 HTTPS、CSP、postMessage 白名单；token 不硬编码、可轮换；权限最小化。 |
| 性能 | 话题切换、Clarify 弹窗、Plan 卡片渲染响应时间 < 500ms（前端）。 |
| 可用性 | 话题、Clarify、Plan、Teable 胶囊/表单、日程看板在桌面端（Tauri/WebView）与 B/S 端一致可用。 |
| 可维护性 | Agent 操作日历的接口封装为 skill / MCP server / CLI，便于替换后端。 |

## 发布标准

1. 话题管理、Clarify、Plan 模式、Teable 胶囊/表单、AI 日程均通过功能验收。
2. 日程开源方案完成 License 与 国产化 合规评审。
3. PM 确认需求文档（requirements.md / user-stories.md / prd.md）并标记 `<!-- status: approved -->`。
4. 产品设计文档通过 human_gate 审批。
5. 安全团队确认 iframe token 传递、postMessage、CSP 方案。

## 风险

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| AGPL 日程后端的商业分发合规成本 | 高 | 确认 WeLink 私有部署模式下 AGPL 网络触发条件；评估商业许可买断。 |
| 话题持久化模型选择错误导致后期重构 | 高 | 在产品设计阶段与 issue-14 的 Mattermost thread 规则对齐，明确数据模型。 |
| Plan.md 审批交互与 OpenClaw runtime 集成复杂 | 中 | 复用/扩展 issue-14 的 clarification.html 原型，定义统一的消息卡片协议。 |
| Teable 表单 iframe 跨域与权限控制 | 中 | PoC 验证 postMessage 白名单、CSP、token 注入方案；必要时使用一次性 exchange code。 |
| CalDAV/JMAP MCP server 成熟度不足 | 中 | 对 Nextcloud/Stalwart 进行 PoC，验证 "创建事件 + 邀请成员 + agent 独立账户 + 事件触发" 最小闭环。 |
| Agent 独立日历身份与日程事件触发机制 | 中 | 明确 agent 账户模型（per-agent account vs service account）与触发机制（webhook / push / 轮询）。 |
| 用户不接受 AGPL 方案 | 中 | 准备 MIT 自建路径（sabre/dav + 自研 UI）作为 fallback。 |

## 参考

- GitHub Issue #17：https://github.com/sushanglewis/WeLink/issues/17
- 需求文档：`issue-17/requirements/2026-08-24-issue-17/requirements.md`
- 用户故事：`issue-17/requirements/2026-08-24-issue-17/user-stories.md`
- 日程开源调研：`issue-17/docs/research/schedule-oss-options.md`
- 相关 issue：issue-3（AI 工作台）、issue-6（Teable）、issue-11（Tauri 桌面端）、issue-14（数字员工平台）、issue-15（Agent 交流广场）
