# Issue #14 数字员工集成研究笔记

## 研究目标

为 WeLink Issue #14「创建产品运营团队的数字员工」提供 OpenClaw、Mattermost、Teable 三者的集成点分析，重点回答：

1. OpenClaw 作为 agent 底座，其 skill、memory、multi-agent routing 机制如何与现有 teable skills 复用？
2. Mattermost Bot 如何获取频道成员、在 thread 内回复、使用 mention 协议串行协作？
3. Mattermost Playbook 如何被触发并创建基于 issue 的协作频道？
4. Teable 的 webhook、API、automation 如何被数字员工消费？

## 结论摘要

- **OpenClaw**：已确认为 agent 底座，团队已掌握其开发与集成方式；本次 PRD 不再做框架选型，只列出需纳入架构设计的 OpenClaw 关键机制假设（skill 文件、memory 文件、heartbeat、router）。
- **Mattermost 集成点**：
  - `GET /api/v4/channels/{channel_id}/members` 可获取频道成员（含 user_id、username、roles），agent 据此构造 `@username` mention；
  - 回复 thread 需提供 `root_id`（原始帖子 ID）；
  - 标准 mention 协议采用 `@username` / `@display_name`，但存在 bot mention 不触发通知的已知问题，需要验证或采用 webhook/私信兜底；
  - Playbook 插件暴露独立 REST API：`/plugins/playbooks/api/v0/runs` 创建 run，`/plugins/playbooks/api/v0/playbooks` 管理 playbook。
- **Teable 集成点**：
  - 现有 `teableio/agent-skills` 可被 OpenClaw 直接调用，skill 结构包含 `SKILL.md`、`api-reference/`、`metadata.json`；
  - Teable API 使用 Bearer Token（PAT/OAuth），支持通过 webhook 接收外部事件；
  - automation 可通过 API 编程创建，适合数字员工反向操作表格。

## 1. OpenClaw（底座）

> 仓库：https://github.com/openclaw/openclaw  
> 许可证：MIT（待仓库最终确认）  
> 技术栈：TypeScript / Node.js

由于 PM 已确认 OpenClaw 为指定底座且团队已掌握开发方式，本次研究不再做横向框架对比，而是列出与 WeLink 集成相关的关键机制假设，供 PRD 与后续设计阶段参考。

### 1.1 关键机制（待代码仓库验证）

| 机制 | 与 Issue #14 的相关性 | 需要验证的问题 |
|------|----------------------|---------------|
| Skill 文件（SKILL.md） | 复用现有 teable skills 或封装为 OpenClaw skills | teable skills 的 `SKILL.md` 是否能被 OpenClaw 直接加载？还是需要字段映射？ |
| Memory 文件（SOUL.md / MEMORY.md / HEARTBEAT.md） | 多角色数字员工的记忆隔离与共享 | 每个数字员工 IP 是否独立 SOUL？共享记忆如何同步？ |
| Heartbeat 循环 | 主动唤醒、定时任务、工单响应 | 是否需要心跳来扫描待处理工单？ |
| Multi-agent routing | 多个「龙小*」角色之间的任务分发 | OpenClaw 是否内置角色路由，还是需要外层编排？ |
| IM connector | Mattermost 消息收发 | 是否已有 Mattermost connector，还是需自研？ |

### 1.2 建议验证动作

- 拉取 `openclaw/openclaw` 源码，确认 `package.json`、示例 skills、connector 目录结构。
- 确认 `SKILL.md` 格式与 `teableio/agent-skills` 的差异点。
- 确认运行多 agent 的入口（gateway / router）。

## 2. Mattermost 集成

### 2.1 获取频道成员

**API：** `GET /api/v4/channels/{channel_id}/members`

- 返回成员列表，包含 `user_id`、`roles`、`scheme_roles` 等；
- 需要进一步调用 `GET /api/v4/users/ids` 或 `GET /api/v4/users/{user_id}` 获取 username / display_name；
- 单次请求上限 200 条，需分页。

**与数字员工的关系：**

agent 必须知道频道内有哪些人类成员和 bot 成员，才能在需要时正确 `@username` mention。

### 2.2 Thread（话题）回复

- Mattermost 支持 Collapsed Reply Threads（CRT）；
- 在 thread 内回复时，消息需携带 `root_id` 字段（即 thread 根帖子的 ID）；
- 常见期望：bot 在 thread 内回复后，后续同 thread 的回复不再需要 `@mention` 即可被 bot 识别。

**与数字员工的关系：**

客服频道触发 Playbook 创建协作频道后，建议以 thread 形式组织每个 issue 的上下文，agent 在 thread 内接力回复。

### 2.3 Mention 协议与通知

**标准格式：**

```text
@username
@display_name
@here
@channel
@all
```

**已知风险：**

- Mattermost 存在 bot mention 不触发通知的已知问题：[Bot mentions do not work #27505](https://github.com/mattermost/mattermost/issues/27505)；
- 这意味着仅靠 `@username` 可能无法保证人类成员收到通知，需要配合私信、Webhook 或 Playbook 的自动成员邀请作为兜底。

**与数字员工的关系：**

PM 已确认使用标准 mention 协议。PRD 中应把「bot mention 可能不触发通知」列为风险，并设计兜底通知机制。

### 2.4 Playbook 触发与 Run 创建

Playbooks 插件暴露独立 API：`/plugins/playbooks/api/v0/`

| 动作 | 端点 |
|------|------|
| 创建 playbook run | `POST /plugins/playbooks/api/v0/runs` |
| 创建 playbook | `POST /plugins/playbooks/api/v0/playbooks` |
| 获取 run 详情 | `GET /plugins/playbooks/api/v0/runs/{id}` |

**触发方式：**

1. 客服频道配置关键词 Channel Action，用户消息触发「运行 playbook」提示；
2. 通过 Outgoing Webhook / 自定义集成，由数字员工或外部系统调用 Playbooks API 创建 run；
3. 使用 `/playbook run` 斜杠命令。

**已知限制：**

- API 创建 run 时可能忽略「关联到现有频道」配置，总是创建新频道：[API call to create playbook run does not respect the option to attach to existing channel #1800](https://github.com/mattermost/mattermost-plugin-playbooks/issues/1800)。

**与数字员工的关系：**

SOP 设计需明确：客服数字员工识别到需升级为 issue 的问题后，通过调用 Playbooks API 创建 run（即协作频道），并将相关人类和 agent 成员拉入。

### 2.5 Bot 权限模型

Bot 账号需要以下权限：

- 读取频道消息（用于感知 @mention 和 thread 上下文）；
- 获取频道成员列表；
- 发送消息、回复 thread；
- 创建频道 / 加入频道（Playbook run 创建时由 Playbook 插件完成，但 bot 可能需要被自动加入）；
- 调用 Playbooks API（需要 bot 账号具备插件 API 访问权限）。

## 3. Teable 集成

### 3.1 Agent Skills

GitHub 仓库：`teableio/agent-skills`

- 包含 `teable-assistant-ops` skill，覆盖 base/table/field/view/record/SQL query/automation 等操作；
- 安装方式：`npx skills add https://github.com/teableio/agent-skills`；
- skill 结构：`SKILL.md`、`api-reference/`、`guides/`、`rules/`、`metadata.json`。

**与数字员工的关系：**

PM 已确认现有 teable agent skills 可直接被 OpenClaw 调用。PRD 中应把 `teableio/agent-skills` 列为依赖资产，并说明数字员工通过 OpenClaw skill 机制复用这些能力。

### 3.2 API 与鉴权

- Base URL：cloud 为 `https://app.teable.io`，私有化部署为自定义域名；
- 鉴权：`Authorization: Bearer <token>`；
- Token 类型：Personal Access Token（PAT，服务端/脚本）或 OAuth Access Token（多用户场景）；
- 需要 `spaceId`、`baseId`、`tableId`、`viewId`、`fieldId`、`recordId` 进行资源定位。

### 3.3 Webhook 与 Automation

- Teable 支持 incoming webhook trigger：外部系统 POST JSON 到唯一 URL；
- 速率限制：50/sec/base、2/sec/workflow、payload max 4 MB；
- 可通过 API 编程创建 workflow：
  1. `POST /base/{baseId}/workflow` 创建工作流；
  2. `POST /base/{baseId}/workflow/{wf.id}/trigger` 添加 trigger；
  3. `POST /base/{baseId}/workflow/{wf.id}/action` 添加 action；
  4. `PUT /base/{baseId}/workflow/{wf.id}/active` 激活。

**与数字员工的关系：**

- 数字员工可通过 Teable webhook 感知用户在表格中的操作；
- 数字员工也可通过 Teable API 反向创建/更新记录，实现「操作多维表格并分享给人类用户」。

## 4. 集成架构草图

```
┌─────────────────────────────────────────────────────────────────┐
│                        Mattermost 组织                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  客服频道     │  │ 协作频道      │  │  数字员工 Bot 账号    │  │
│  │ （人类用户 +  │  │ （基于 issue  │  │ （龙小客/龙小产/...） │  │
│  │  龙小客）     │  │  创建）       │  │                      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
│         │                 │                                      │
│         │  mention / thread                                      │
│         └─────────────────┘                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         OpenClaw Agent 底座                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ 龙小客 skill │  │ 龙小产 skill │  │ Router / Orchestrator   │  │
│  │ 客服问答     │  │ 需求分析     │  │ 决定下一步 mention 谁    │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘  │
│         │                │                                       │
│         └────────────────┘                                       │
│                   │                                               │
│                   ▼                                               │
│         ┌─────────────────┐                                       │
│         │ teable skills   │  ← 复用 teableio/agent-skills        │
│         │ 表格操作/查询   │                                       │
│         └─────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Teable                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ 表格数据     │  │ Webhook     │  │ Automation              │  │
│  │ API 操作     │  │ 事件通知     │  │ 自动触发外部动作         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 5. 风险与待验证项

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| OpenClaw 仓库/文档与描述不一致 | 高 | 拉取源码验证 skill、memory、connector 结构 |
| Mattermost bot mention 不触发通知 | 中 | 设计私信/Webhook/Playbook 成员邀请兜底 |
| Playbook API 创建 run 时忽略现有频道配置 | 中 | 明确 SOP 接受创建新频道，或通过 webhook 在创建后迁移 |
| 多角色 agent memory 隔离与共享边界不清 | 中 | PRD 中定义每个角色的 memory 范围与共享规则 |
| Teable API key 权限过大 | 中 | 为每个数字员工分配最小权限的独立 API key |
| 频道成员列表获取有 200 条分页限制 | 低 | 大频道分页拉取，或维护成员缓存 |

## 6. 推荐实现顺序

1. **第一阶段（客服对外答疑）**：
   - 龙小客接入客服频道；
   - 实现 Mattermost 消息监听、thread 回复、@username mention；
   - 集成 FAQ/知识库，支持常见客服问题自动回复。
2. **第二阶段（内部需求分析）**：
   - 龙小产/龙小研接入，支持需求澄清与方案研究；
   - 打通 Teable 表格操作（读取/创建记录）。
3. **第三阶段（多角色协作 + Playbook）**：
   - 客服频道触发 Playbook 创建协作频道；
   - 多 agent 在协作频道内按 mention 协议接力；
   - 人类在关键节点被拉入/mention，最终生成 issue。

## 参考来源

- OpenClaw 官方仓库：https://github.com/openclaw/openclaw
- Mattermost API - Get channel members：https://www.postman.com/api-evangelist/mattermost/request/01hsdu5/get-channel-members
- Mattermost Mention 文档：https://docs.mattermost.com/end-user-guide/collaborate/mention-people.html
- Mattermost Bot mentions issue：https://github.com/mattermost/mattermost/issues/27505
- Mattermost Playbooks GitHub：https://github.com/mattermost/mattermost-plugin-playbooks
- Mattermost Playbooks 创建 run 频道问题：https://github.com/mattermost/mattermost-plugin-playbooks/issues/1800
- Teable Agent Skills：https://github.com/teableio/agent-skills
- Teable API Overview：https://help.teable.ai/en/api-doc/overview
- Teable Webhook Trigger：https://help.teable.ai/en/basic/automation/trigger/external/webhook-received
- Teable Automation API Example：https://help.teable.ai/en/basic/automation/examples/api-automation
