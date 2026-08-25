# 字段规格: issue-17

> 汇总关键界面与数据对象涉及的字段、类型、必填性、默认值及校验规则。

## 1. Topic（话题）

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| topic_id | string | 是 | — | 等于 Mattermost root post id |
| channel_id | string | 是 | — | 所属数字员工 channel |
| title | string | 否 | null | 话题标题；为空时由 Agent 生成摘要回填 |
| summary | string | 否 | null | 话题摘要 |
| creator_type | enum | 是 | human | human / agent |
| creator_id | string | 是 | — | 用户 id / agent id |
| created_at | datetime | 是 | now | ISO-8601 |
| last_active_at | datetime | 是 | now | 随新消息更新 |

## 2. ClarifySession / ClarifyQuestion

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| clarify_session_id | string | 是 | — | UUID |
| topic_id | string | 是 | — | FK → Topic |
| round | int | 是 | 1 | ≥1 |
| status | enum | 是 | open | open / answered / expired / cancelled |
| question_text | string | 是 | — | 问题文案，≤500 字符 |
| options | string[3] | 是 | — | 恰好 3 个推荐选项 |
| allow_custom | bool | 是 | true | 固定 true |
| multi_select | bool | 是 | false | 本期单选为主 |
| answer | object | 否 | null | `{ selected: string[], custom_text: string \| null }` |

## 3. PlanDocument / PlanRevision

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| plan_id | string | 是 | — | UUID |
| topic_id | string | 是 | — | FK → Topic |
| storage_path | string | 是 | — | thread 关联的 Plan.md 文件路径 |
| current_revision | int | 是 | 1 | ≥1 |
| status | enum | 是 | draft | draft / pending_approval / approved / changes_requested / executing / completed / cancelled |
| content_md | string | 是 | — | 必须包含背景/目标/步骤/依赖/验收标准/风险六部分 |
| change_note | string | 否 | null | 用户修改意见 |
| approved_by | string | 否 | null | 审批用户 id |
| approved_at | datetime | 否 | null | 审批时间 |

## 4. Capsule（胶囊）

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| capsule_id | string | 是 | — | UUID |
| message_id | string | 是 | — | 所属 Mattermost post id |
| capsule_type | enum | 是 | — | skill / mcp / plugin / teable |
| schema_version | string | 是 | "1.0" | 自定义 JSON schema 版本 |
| display.title | string | 是 | — | 卡片标题 |
| display.summary | string | 是 | — | 卡片摘要 |
| display.icon | string | 否 | null | 可选图标 |
| payload | object | 是 | — | 类型特定负载 |
| permissions | object | 否 | null | 权限范围声明 |
| created_by | string | 是 | — | 插入者 id |
| created_at | datetime | 是 | now | ISO-8601 |

### Payload 示例

- skill: `{ skill_name, description, input_preview }`
- mcp: `{ server_name, tool_count, key_tools[] }`
- plugin: `{ plugin_name, version, feature_summary }`
- teable: `{ base_id, table_id, view_id, table_name }`

## 5. ScheduleEvent / ScheduleParticipant

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| event_id | string | 是 | — | 日历后端 uid |
| calendar_owner | string | 是 | — | 用户 id / agent id |
| title | string | 是 | — | 事件标题 |
| description | string | 否 | null | 描述 |
| start_at | datetime | 是 | — | 含时区 |
| end_at | datetime | 是 | — | 含时区 |
| organizer | string | 是 | — | 组织者 |
| source_topic_id | string | 否 | null | FK → Topic |
| visibility | enum | 是 | private | private / participants |
| status | enum | 是 | confirmed | confirmed / tentative / cancelled |
| participant_id | string | 是 | — | 参与人 id |
| participant_type | enum | 是 | human | human / agent |
| rsvp_status | enum | 是 | needs_action | needs_action / accepted / declined / tentative |
| notified_via | enum | 是 | none | im / email / none |

## 6. AgentCalendarIdentity / ScheduleToken / ScheduleTriggerRule

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| agent_id | string | 是 | — | Agent 组织成员 id |
| calendar_account | string | 是 | — | 日历后端独立账户 |
| principal_uri | string | 是 | — | principal/calendar home 地址 |
| status | enum | 是 | active | active / suspended |
| token_id | string | 是 | — | token 记录 id |
| subject_type | enum | 是 | — | user / agent |
| subject_id | string | 是 | — | 授权对象 id |
| scope | string[] | 是 | — | read_events / write_events / invite_members |
| token_type | enum | 是 | — | app_password / oauth_token |
| issued_by | string | 是 | — | 签发人 |
| issued_at | datetime | 是 | now | ISO-8601 |
| expires_at | datetime | 否 | null | 过期时间 |
| revoked_at | datetime | 否 | null | 撤销时间 |
| rule_id | string | 是 | — | UUID |
| event_match | object | 是 | — | 匹配条件 |
| trigger_offset | string | 是 | — | ISO 8601 duration，如 `-PT5M` |
| action | object | 是 | — | send_reminder / push_materials / invoke_skill |
| channel | enum | 是 | polling | webhook / push / polling |
| enabled | bool | 是 | true | — |

## 7. 界面表单字段

### 新建话题

| 字段 | 类型 | 必填 | 默认值 | 校验 |
|------|------|------|--------|------|
| title | text | 否 | 空 | ≤100 字符 |
| summary | text | 否 | 空 | ≤500 字符 |

### Token 签发

| 字段 | 类型 | 必填 | 默认值 | 校验 |
|------|------|------|--------|------|
| subject | select | 是 | — | user / agent |
| scope | multi-select | 是 | — | 至少选一项 |
| token_type | select | 是 | — | 依后端选型 |
