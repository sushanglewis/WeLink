# 数据模型: issue-17

> 说明：话题消息本体复用 Mattermost Post/Thread 存储；日程事件本体复用日历后端的 iCalendar VEVENT（CalDAV）或 JSCalendar（JMAP）对象。下列实体中，标注「映射」的表示以既有系统对象为准，WeLink 侧仅保存引用与扩展字段。

## 实体

### Topic（话题，映射 Mattermost Thread）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| topic_id | string | PK | 等于 Mattermost root post id（thread id） |
| channel_id | string | 必填 | 所属 Mattermost channel（数字员工对话） |
| title | string | 可空 | 话题标题；可空，由 agent 生成回填 |
| summary | string | 可空 | 话题摘要，agent 生成 |
| creator_type | enum(human, agent) | 必填 | 创建者类型 |
| creator_id | string | 必填 | 创建者用户 id / agent id |
| created_at | datetime | 必填 | 创建时间 |
| last_active_at | datetime | 必填 | 最后活跃时间（随新消息更新） |

### ClarifySession（澄清会话）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| clarify_session_id | string | PK | 澄清会话 id |
| topic_id | string | FK → Topic | 所属话题（thread） |
| round | int | ≥1 | 第几轮澄清 |
| status | enum(open, answered, expired, cancelled) | 必填 | 会话状态 |
| created_by_agent | string | 必填 | 发起 agent id |
| created_at | datetime | 必填 | 创建时间 |
| answered_at | datetime | 可空 | 用户提交时间 |

### ClarifyQuestion（澄清问题）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| question_id | string | PK | 问题 id |
| clarify_session_id | string | FK → ClarifySession | 所属澄清会话 |
| question_text | string | 必填 | 问题文案 |
| options | string[3] | 必填，恰好 3 项 | 推荐选项 |
| allow_custom | bool | 默认 true | 是否提供自定义输入（本期固定 true） |
| multi_select | bool | 默认 false | 是否多选 |
| answer | object | 可空 | `{ selected: string[], custom_text: string \| null }` |

### PlanDocument（Plan 文档）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| plan_id | string | PK | Plan id |
| topic_id | string | FK → Topic | 所属话题（thread） |
| storage_path | string | 必填 | agent 后端 Plan.md 文件路径（按 thread 关联） |
| current_revision | int | ≥1 | 当前版本号 |
| status | enum(draft, pending_approval, approved, changes_requested, executing, completed, cancelled) | 必填 | Plan 状态 |
| created_at | datetime | 必填 | 创建时间 |
| approved_by | string | 可空 | 审批通过的用户 id |
| approved_at | datetime | 可空 | 审批通过时间 |

### PlanRevision（Plan 版本）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| plan_revision_id | string | PK | 版本 id |
| plan_id | string | FK → PlanDocument | 所属 Plan |
| revision | int | ≥1 | 版本号，递增 |
| content_md | string | 必填 | Plan.md 内容（背景/目标/步骤/依赖/验收标准/风险） |
| change_note | string | 可空 | 用户修改意见 |
| created_at | datetime | 必填 | 版本生成时间 |

### Capsule（胶囊）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| capsule_id | string | PK | 胶囊实例 id |
| message_id | string | 必填 | 所属 Mattermost post id |
| capsule_type | enum(skill, mcp, plugin, teable) | 必填 | 胶囊类型 |
| schema_version | string | 必填 | 统一自定义 JSON schema 版本 |
| display | object | 必填 | `{ title, summary, icon? }` 卡片展示信息 |
| payload | object | 必填 | 类型负载：skill→`{ skill_name, description, input_preview }`；mcp→`{ server_name, tool_count, key_tools[] }`；plugin→`{ plugin_name, version, feature_summary }`；teable→`{ base_id, table_id, view_id, table_name }` |
| permissions | object | 可空 | 权限范围声明（如 teable 的可读/可写范围） |
| created_by | string | 必填 | 插入者用户 id |
| created_at | datetime | 必填 | 创建时间 |

胶囊统一 schema（自定义 JSON，随消息 metadata 存储）：

```json
{
  "capsule_type": "skill | mcp | plugin | teable",
  "capsule_id": "uuid",
  "schema_version": "1.0",
  "display": { "title": "...", "summary": "...", "icon": "optional" },
  "payload": { "type_specific": "..." },
  "permissions": { "scope": "optional" },
  "created_by": "user_id",
  "created_at": "ISO-8601"
}
```

### ScheduleEvent（日程事件，映射 VEVENT / JSCalendar）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| event_id | string | PK | 日历后端事件 uid |
| calendar_owner | string | 必填 | 所属日历身份（用户 id 或 agent id） |
| title | string | 必填 | 事件标题 |
| description | string | 可空 | 描述/备注 |
| start_at | datetime | 必填 | 开始时间（含时区） |
| end_at | datetime | 必填 | 结束时间（含时区） |
| organizer | string | 必填 | 组织者（用户或 agent） |
| source_topic_id | string | FK → Topic，可空 | 来源话题（从对话创建时回填） |
| visibility | enum(private, participants) | 必填 | 个人日程范围；多人事件对所有参与人可见 |
| status | enum(confirmed, tentative, cancelled) | 必填 | 事件状态 |

### ScheduleParticipant（日程参与人）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| event_id | string | FK → ScheduleEvent | 所属事件 |
| participant_id | string | 必填 | 参与人用户 id / agent id |
| participant_type | enum(human, agent) | 必填 | 参与人类型 |
| rsvp_status | enum(needs_action, accepted, declined, tentative) | 必填 | 响应状态 |
| notified_via | enum(im, email, none) | 必填 | 通知通道 |

联合主键 (event_id, participant_id)。

### AgentCalendarIdentity（Agent 日历身份）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| agent_id | string | PK | agent 在组织中的成员 id |
| calendar_account | string | 必填 | 日历后端独立账户名 |
| principal_uri | string | 必填 | 日历后端 principal/calendar home 地址 |
| created_at | datetime | 必填 | 身份开通时间 |
| status | enum(active, suspended) | 必填 | 身份状态 |

### ScheduleToken（日程访问令牌）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| token_id | string | PK | token 记录 id（非 token 本体） |
| subject_type | enum(user, agent) | 必填 | 授权对象类型 |
| subject_id | string | 必填 | 用户 id / agent id |
| scope | string[] | 必填 | 权限范围（read_events / write_events / invite_members） |
| token_type | enum(app_password, oauth_token) | 必填 | 依后端选型确定 |
| issued_by | string | 必填 | 签发人 |
| issued_at | datetime | 必填 | 签发时间 |
| expires_at | datetime | 可空 | 过期时间 |
| revoked_at | datetime | 可空 | 撤销时间 |

### ScheduleTriggerRule（日程触发规则）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| rule_id | string | PK | 规则 id |
| agent_id | string | FK → AgentCalendarIdentity | 目标 agent |
| event_match | object | 必填 | 匹配条件（如 organizer=self、标题模式、时间窗） |
| trigger_offset | string | 必填 | 触发偏移（如 `-PT5M` 表示开始前 5 分钟） |
| action | object | 必填 | 触发动作（send_reminder / push_materials / invoke_skill + 参数） |
| channel | enum(webhook, push, polling) | 必填 | 触发通道；polling 为兜底 |
| enabled | bool | 默认 true | 是否启用 |

## 关系

- Topic 与 Mattermost Thread：一对一（topic_id = root post id）。
- Topic 与 ClarifySession：一对多（一个话题可多轮澄清）。
- ClarifySession 与 ClarifyQuestion：一对多（一轮澄清包含 1..n 个问题）。
- Topic 与 PlanDocument：一对一（一个话题同一时刻至多一个进行中的 Plan；历史 Plan 保留）。
- PlanDocument 与 PlanRevision：一对多（每次生成/修改递增版本）。
- Mattermost Post 与 Capsule：一对多（一条消息可携带多个胶囊）。
- ScheduleEvent 与 ScheduleParticipant：一对多（多人事件多参与人）。
- AgentCalendarIdentity 与 ScheduleEvent：一对多（agent 自身日程）。
- AgentCalendarIdentity 与 ScheduleTriggerRule：一对多。
- ScheduleToken 与 用户/Agent：多对一（一个主体可持有多个 token，支持轮换）。
- Topic 与 ScheduleEvent：一对多（对话中创建的多个日程可回溯来源话题）。

## 约束

- 话题消息读写一律经 Mattermost thread API，禁止跨话题串写。
- Plan 状态机强制：`pending_approval` 之前不得进入 `executing`；`approved` 是进入 `executing` 的唯一前置状态。
- PlanRevision 只增不改；Plan.md 文件与最新 revision 保持一致。
- Capsule 必须通过统一 schema 校验方可渲染与解析；schema_version 不兼容时降级为「无法解析」展示。
- Teable 胶囊仅允许写入用户有权限的 base_id/table_id/view_id。
- ScheduleEvent 的 visibility=participants 时，所有 ScheduleParticipant 在其日历视图中必须可见该事件。
- ScheduleToken 仅存元数据，token 本体加密存储于密钥管理设施；撤销即时生效。
- 日程后端不提供与 Outlook/Google 的任何同步字段，数据模型中不出现外部日历映射。
