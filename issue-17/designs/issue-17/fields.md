# 字段规格: issue-17

> 汇总关键界面与数据对象涉及的字段、类型、必填性、默认值及校验规则。
>
> 2026-09-03 按 9/2 领导会议纪要新增第 8~11 节（督办闭环 / 工作台首页 / 组织化管理 / 邮箱），1.6.0 三件套（审批/考勤/工资条）数据表在设计阶段另立。

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

## 8. 督办闭环（2026-09-03 新增，对应 supervision-p0.md S-5）

### ReminderRule（催办规则）

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| rule_id | string | 是 | — | UUID |
| scope | enum | 是 | default | default / batch / item |
| batch_id / item_id | string | 否 | null | scope 非 default 时必填 |
| due_offset | string | 是 | — | 截止前多久开始催办，ISO 8601 duration |
| overdue_threshold | int | 是 | 1 | 逾期天数阈值，≥1 |
| frequency | enum | 是 | daily | daily / weekly |
| channels | enum[] | 是 | [im] | im / email 子集，email 需邮箱渠道已接入 |
| enabled | bool | 是 | true | — |

### ReminderLog（催办历史）

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| log_id | string | 是 | — | UUID |
| item_id | string | 是 | — | FK → SupervisionItem |
| rule_id | string | 是 | — | FK → ReminderRule |
| channel | enum | 是 | — | im / email |
| content | string | 是 | — | 催办文案 |
| responsible_id | string | 是 | — | 责任人 id |
| sent_at | datetime | 是 | now | ISO-8601 |

### DailyDigest（每日汇总报告）

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| digest_id | string | 是 | — | UUID |
| digest_date | date | 是 | — | 报告归属日 |
| updated_items | object[] | 是 | — | 当日有进展的事项集合（item_id + 摘要 + topic 链接） |
| reminded_items | object[] | 是 | — | 当日已催办事项及反馈状态 |
| overdue_items | object[] | 是 | — | 逾期未反馈事项 |
| upcoming_items | object[] | 是 | — | 明日临近截止事项 |
| sent_to | string | 是 | — | 管理员 id（于福帅） |
| sent_at | datetime | 是 | now | ISO-8601 |

## 9. 工作台首页（2026-09-03 新增，对应 workbench-home-p0.md）

### TodoItem（待办）

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| todo_id | string | 是 | — | UUID |
| source_type | enum | 是 | — | approval / supervision |
| source_id | string | 是 | — | 审批单 id / SupervisionItem id |
| title | string | 是 | — | ≤200 字符 |
| initiator | string | 是 | — | 发起人 id |
| due_at | datetime | 否 | null | 时间要求 |
| priority | enum | 是 | normal | high / normal / low |
| status | enum | 是 | pending | pending / processing / done / overdue |
| owner_id | string | 是 | — | 待办归属人 |

### Notice（通知）

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| notice_id | string | 是 | — | UUID |
| type | enum | 是 | — | announcement / activity / rule |
| title | string | 是 | — | ≤200 字符 |
| body | string | 是 | — | 正文 |
| publisher | string | 是 | — | 发布人 id |
| target_scope | object | 是 | — | 全员 / 部门 / 人员范围 |
| require_ack | bool | 是 | false | 重要通知强制阅读确认 |
| read_status | object | 是 | — | per-user 已读/确认状态 |

### KnowledgeItem（知识项）

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| knowledge_id | string | 是 | — | UUID |
| content_type | enum | 是 | — | email / doc / article |
| source | string | 是 | — | 来源系统标识 |
| title | string | 是 | — | ≤200 字符 |
| summary | string | 否 | null | 摘要 |
| related_todo_id | string | 否 | null | 「与我相关」关联的 TodoItem |

## 10. 组织化数字员工管理（2026-09-03 新增，对应 org-agent-management-p0.md）

### AgentProfile / CreationRequest

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| agent_id | string | 是 | — | 全局唯一 |
| name | string | 是 | — | 通讯录展示名 |
| department / position | string | 是 | — | 部门 / 岗位 |
| job_description | string | 是 | — | 岗位说明书（职责与能力边界） |
| status | enum | 是 | onboarding | onboarding / active / transferred / suspended / decommissioned |
| owner_id | string | 是 | — | 负责人（数字赋能部） |
| request_id | string | 是 | — | UUID |
| request_department | string | 是 | — | 申请业务部门 |
| persona | object | 是 | — | 能力画像（经验/事务/范围） |
| flow_status | enum | 是 | draft | draft / submitted / hr_review / directory / provisioning / active / closed |

### SystemAccessGrant / SkillConfig

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| grant_id | string | 是 | — | UUID |
| agent_id | string | 是 | — | FK → AgentProfile |
| target_system | string | 是 | — | 业务系统标识（系统级访问，不含数据级权限） |
| granted_by | string | 是 | — | 数字赋能部操作人 |
| expires_at | datetime | 否 | null | 授权有效期 |
| config_id | string | 是 | — | UUID |
| agent_id | string | 是 | — | FK → AgentProfile |
| skills | string[] | 是 | — | 技能集 |
| biz_scope | object | 是 | — | 可访问业务范围 |
| preset_pack | string | 否 | null | 预设权限包引用 |
| edited_by_role | enum | 是 | — | 仅 hr 可写；越权写入被拒绝并审计 |

## 11. 邮箱接入（2026-09-03 新增，对应 email-p0.md）

### MailboxAccount / MigrationJob / MailChannelConfig

| 字段 | 类型 | 必填 | 默认值 | 说明/校验 |
|------|------|------|--------|-----------|
| account_id | string | 是 | — | UUID |
| user_id | string | 是 | — | FK → 用户 |
| channel | enum | 是 | — | netease / 163 |
| mailbox_address | string | 是 | — | 邮箱地址 |
| status | enum | 是 | pending | pending / active / migrating / suspended |
| job_id | string | 是 | — | UUID |
| channel_from / channel_to | enum | 是 | — | 迁移方向（tencent→netease） |
| scope | object | 是 | — | 账号/时间段范围 |
| status | enum | 是 | queued | queued / running / reconciling / done / failed / rolled_back |
| reconcile_result | object | 否 | null | 源/目标计数对账与抽样校验结果 |
| config_id | string | 是 | — | UUID |
| channel | enum | 是 | — | netease / 163 |
| credential_ref | string | 是 | — | 凭证引用（走密钥管理，禁止硬编码） |
| enabled | bool | 是 | true | — |
