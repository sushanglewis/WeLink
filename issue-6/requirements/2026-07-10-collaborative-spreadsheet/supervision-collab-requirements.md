# Teable + Mattermost 督办协作系统需求文档（详细版）

> **⚠️ 选型更新(2026-07-15)**:本文档基于 Baserow 的具体实例编写(含 `database 84`、`table_id: 378/835`),**选型已更新为 [Teable](https://github.com/teableio/teable)**。文档中的督办业务流程、用户角色、双通道操作模式仍可参考,但具体表编号、字段映射、Webhook 事件名需按 Teable 重新设计。Baserow 仅保留作为功能完备性参照基线(见 SRS §1.3)。

> 版本：vA（技术实现版）  
> 前置确认：流程描述已与 vB 对齐，流程 1、流程 2 执行后均会触发流程 3 的主动跟进监控。

---

## 1. 文档目的

本文档在 vB 的基础上补充：
- 数据模型与字段映射
- API 调用方式与示例
- Webhook 事件格式
- Mattermost 通知 URL 构造规则
- 24h/36h 监控任务的具体实现逻辑

用于指导后续开发实现与测试验收。

---

## 2. 术语与角色

| 术语 | 说明 |
|------|------|
| **督办专员** | 通过 Mattermost 私聊 Bot 上传 Excel 或发送任务编号集合，也可直接登录 Teable 操作。 |
| **经办人** | 需要登录 Teable 填报部门反馈的责任人，也可接收 Bot 的 Mattermost 通知。 |
| **Agent / Bot** | 在 Mattermost 与 Teable 中各有独立账号的程序代理。 |
| **主表** | Teable 数据库 84 中的表 378（督办事项主表）。 |
| **跟进表** | Teable 数据库 84 中的表 835（跟进记录表）。 |
| **汇报周期** | 跟进记录表中的一条记录代表一次需要填报的周期，一条主表记录在多个周期内可对应多条跟进记录。 |

---

## 3. 系统架构

![系统架构图](images/architecture.png)

**组件说明：**

- **Agent (Bot)**：处理 Mattermost 消息、解析 Excel/任务编号、调用 Teable API、发送通知。
- **Teable**：数据持久化、权限控制、填报界面、Webhook 触发源。督办专员和经办人也可以直接登录 Teable 进行操作。
- **延时任务服务**：接收 Webhook 后启动 T+24h / T+36h 两次检查任务。可用 Celery、APScheduler、Rq 等实现，需具备持久化和取消能力。
- **实线箭头**：Agent 与系统之间的自动化交互。
- **虚线箭头**：人类用户可直接登录 Teable 进行人工操作。

### 3.2 人机交互方式

督办专员与系统的交互存在两条独立路径：

1. **通过 Mattermost 与 Bot 交互**：适合批量操作，包括上传 Excel 新建督办事项、发送任务编号集合发起历史事项跟进，由 Agent 自动完成 Teable 写入和通知。
2. **直接登录 Teable 操作**：适合单条或临时操作，例如手动创建跟进记录、直接修改主表数据、经办人直接填报反馈。

经办人同样可以通过 Mattermost 接收 Bot 通知，或直接登录 Teable 查看自己被协作者的跟进记录并填报。

**一致性保证**：无论通过哪种路径创建跟进记录，Teable 都会触发 `rows.created` Webhook，延时任务服务都会注册 24h/36h 监控任务。因此流程 3 是流程 1 和流程 2 的共同后续，也会覆盖人工在 Teable 中直接创建跟进记录的场景。

---

## 4. 账号与权限模型

### 4.1 Agent 账号

- **Mattermost**：Bot 账号，拥有 `app_id` / `app_secret`，可发送私聊/频道消息、@用户。
- **Teable**：独立用户账号，例如 `duibanyuan@example.com`（可命名为"督办 Bot"），持有 Database Token。
- 所有 Bot 写入 Teable 的操作均以此账号身份留痕。

### 4.2 人类账号

- 一套账号体系贯穿 Mattermost、Teable、Excel。
- 主表中当前使用文本字段`经办人及联系方式`存储姓名和电话，建议新增**协作者类型字段**`经办人账号`，直接绑定 Teable 用户。
- 跟进表 `Collaborators` 字段直接写入经办人对应的 Teable user_id。

### 4.3 权限建议

| 角色 | Teable 权限 | Mattermost 权限 |
|------|-------------|----------------|
| 督办专员 | 主表/跟进表可读写 | 可向 Bot 发送 Excel 指令、任务编号指令 |
| 经办人 | 仅可编辑自己被协作者的跟进记录 | 接收 Bot 通知 |
| Agent | 主表/跟进表可读写 | Bot 账号 |

---

## 5. 数据模型

### 5.1 督办事项主表（table_id: 378）

| 字段 ID | 字段名 | 类型 | 说明 |
|--------|--------|------|------|
| 3521 | Name | text | 记录标题 |
| 3523 | 序号 | number | 序号 |
| 3524 | 任务编号 | text | 唯一业务编号，如 `SJ20260750` |
| 3525 | 标签 | text | 标签 |
| 3526 | 交办时间 | date | 交办时间 |
| 3527 | 任务来源 | text | 来源 |
| 3528 | 议题名称 | text | 议题 |
| 3529 | 交办事项 | text | 事项 |
| 3530 | 交办内容 | long_text | 内容 |
| 3531 | 完成时限 | date | 完成时限 |
| 3532 | 预计完成时间 | date | 预计完成时间 |
| 3533 | 责任单位 | text | 责任单位 |
| 3534 | 协办单位 | text | 协办单位 |
| 3535 | 区级责任人 | text | 区级责任人 |
| 3536 | 部门主要领导 | text | 部门主要领导 |
| 3537 | 部门责任人 | text | 部门责任人 |
| 3538 | 科室责任人 | text | 科室责任人 |
| 3539 | 经办人及联系方式 | text | 姓名+联系方式（文本） |
| **建议新增** | **经办人账号** | **multiple_collaborators** | 直接绑定经办人 Teable 用户 |
| 3540 | 部门反馈工作落实情况 | long_text | 当前主表上的反馈字段 |
| 3541 | 部门反馈存在困难问题 | text | |
| 3542 | 部门反馈下一步工作计划 | long_text | |
| 3543 | 进度评价 | text | |
| 3544 | 事项类别 | text | |
| 3545 | 板块分类 | text | |
| 3546 | 督办频率 | text | 如"每周"、"每月" |
| 3547 | 领导批示 | long_text | |
| 3556 | Created by | created_by | |
| 3557 | Last modified by | last_modified_by | |
| 7962 | 跟进记录表 | link_row | 反向关联跟进表 |

### 5.2 跟进记录表（table_id: 835）

| 字段 ID | 字段名 | 类型 | 说明 |
|--------|--------|------|------|
| 7964 | Created on | created_on | 记录创建日期，自动生成 |
| 7926 | 任务编号 | text | 文本任务编号（如 `SJ20260750`） |
| 7945 | UUID | uuid | 唯一标识，自动生成 |
| 7961 | 任务编号 | link_row | 关联到主表对应记录 |
| 7942 | 部门反馈工作落实情况 | text | 经办人填报 |
| 7943 | 部门反馈存在困难问题 | text | 经办人填报 |
| 7944 | 部门反馈下一步工作计划 | text | 经办人填报 |
| 7965 | Created by | created_by | 创建者（应为 Agent） |
| 7966 | Collaborators | multiple_collaborators | @ 经办人 |

**字段命名说明：**
- 跟进表中存在两个"任务编号"字段：
  - `field_7926`：文本型，便于 Bot 读取和人类识别。
  - `field_7961`：Link to table 型，与主表建立正式关联。
- Bot 创建记录时应同时写入这两个字段，或仅写文本字段并通过 Webhook 自动补全 Link 字段。

### 5.3 账号映射（建议新增配置）

由于 Excel 中可能使用姓名或工号，建议维护一张映射表或在主表中增加字段：

| 来源标识 | Teable user_id | Mattermost user_id | 备注 |
|----------|----------------|-------------------|------|
| 张三 | 3 | @zhangsan | 可通过邮箱统一匹配 |

理想情况下，Excel、Teable、Mattermost 统一使用 **email** 作为唯一标识。

---

## 6. 业务流程（详细时序）

### 流程 1：新增督办事项（Excel 上传入口）

触发者：督办专员  
入口：Mattermost 私聊 Bot，上传 Excel

![流程1：新增督办事项](images/flow1_excel.png)

**文字说明**：督办专员上传 Excel 后，Agent Bot 解析并批量写入主表，再为需要跟进的记录创建跟进记录并 @ 经办人；同时 Teable 触发 Webhook，延时任务服务注册 24h/36h 监控。

### 流程 2：历史事项跟进（任务编号入口）

触发者：督办专员  
入口：Mattermost 向 Bot 发送任务编号集合

![流程2：历史事项跟进](images/flow2_tasks.png)

**文字说明**：督办专员发送任务编号集合后，Agent Bot 校验主表存在性，批量创建跟进记录并 @ 经办人；Webhook 触发后注册 24h/36h 监控。

### 流程 3：主动跟进监控（流程 1、2 的后续必经流程）

触发者：跟进记录表 `rows.created` Webhook  
执行者：延时任务服务

![流程3：主动跟进监控](images/flow3_monitor.png)

**取消条件：** 经办人在 T+36h 前完成填报（监控字段非空），则取消后续提醒任务。

---

## 7. 功能需求

### 7.1 Excel 解析与录入

| 编号 | 需求 | 优先级 |
|------|------|--------|
| FR-001 | Bot 支持接收 Excel 文件并解析为结构化数据。 | P0 |
| FR-002 | Excel 字段与主表字段存在可配置映射。 | P0 |
| FR-003 | 解析失败时返回具体错误行和原因。 | P0 |
| FR-004 | 支持批量创建主表记录。 | P0 |
| FR-005 | 可配置"录入主表后是否自动创建跟进记录"。 | P1 |
| FR-006 | 根据"经办人账号"字段或映射表，自动写入跟进表 Collaborators。 | P0 |

### 7.2 任务编号批量跟进

| 编号 | 需求 | 优先级 |
|------|------|--------|
| FR-007 | Bot 从消息中识别任务编号集合（支持逗号、空格、换行分隔）。 | P0 |
| FR-008 | 校验主表中是否存在对应任务编号。 | P0 |
| FR-009 | 对不存在编号返回失败清单。 | P0 |
| FR-010 | 创建成功后返回成功清单和通知列表。 | P0 |
| FR-011 | 支持按汇报周期去重，避免同一周期重复创建。 | P1 |

### 7.3 经办人通知

| 编号 | 需求 | 优先级 |
|------|------|--------|
| FR-012 | Bot 发送的 URL 指向 Teable 主表视图，并已预置筛选条件。 | P0 |
| FR-013 | 通知消息包含填报截止时间、操作步骤。 | P0 |
| FR-014 | Bot 以自身身份发送消息，不冒充人类。 | P0 |

### 7.4 24h/36h 监控提醒

| 编号 | 需求 | 优先级 |
|------|------|--------|
| FR-015 | 跟进记录新增后自动启动 T+24h 检查。 | P0 |
| FR-016 | T+24h 未更新则提醒经办人。 | P0 |
| FR-017 | T+36h 仍未更新则提醒经办人 + 督办专员。 | P0 |
| FR-018 | 填报完成后取消后续提醒。 | P0 |
| FR-019 | 支持配置"已更新"判断字段（默认 `field_7942`）。 | P1 |

---

## 8. 接口与集成

### 8.1 Teable Database API

基础信息：
- Base URL：`http://localhost:8081`（当前环境）
- 认证方式：`Authorization: Token {database_token}` 或 `Authorization: JWT {access_token}`
- 主表 ID：`378`
- 跟进表 ID：`835`

#### 8.1.1 创建主表记录（批量）

```http
POST /api/database/rows/table/378/batch/
Content-Type: application/json
Authorization: Token {AGENT_DB_TOKEN}

{
  "items": [
    {
      "field_3524": "SJ20260750",
      "field_3526": "2026-06-20",
      "field_3533": "XX局",
      "field_3539": "张三 13800138000",
      "field_XXXX": [3]
    }
  ]
}
```

#### 8.1.2 创建跟进记录

```http
POST /api/database/rows/table/835/
Content-Type: application/json
Authorization: Token {AGENT_DB_TOKEN}

{
  "field_7926": "SJ20260750",
  "field_7961": [1],
  "field_7966": [{"id": 3}]
}
```

**字段说明：**
- `field_7926`：文本型任务编号。
- `field_7961`：Link to table，值为数组，元素为主表 row_id。
- `field_7966`：Multiple collaborators，值为数组，元素为 `{"id": user_id}`。

#### 8.1.3 查询跟进记录

```http
GET /api/database/rows/table/835/{row_id}/?user_field_names=true
Authorization: Token {AGENT_DB_TOKEN}
```

### 8.2 Teable Webhook

#### 8.2.1 Webhook 配置

- **表**：835（跟进记录表）
- **事件**：`rows.created`
- **URL**：`http://{AGENT_HOST}:{PORT}/webhook/follow-up-created`
- **使用 user_field_names**：true

#### 8.2.2 Webhook Payload 示例

```json
{
  "event_type": "rows.created",
  "table_id": 835,
  "database_id": 84,
  "items": [
    {
      "id": 195,
      "order": "159.00000000000000000000",
      "field_7964": "2026-06-26",
      "field_7926": "SJ20260750",
      "field_7942": null,
      "field_7943": null,
      "field_7944": null,
      "field_7945": "06c52861-1530-4565-be05-0513cb868543",
      "field_7961": [{"id": 1, "value": "SJ20260750"}],
      "field_7965": {"id": 2, "name": "督办 Bot"},
      "field_7966": [{"id": 3, "name": "张三"}]
    }
  ]
}
```

### 8.3 Mattermost Bot API

- 使用 Mattermost Bot Account 的 `access token`。
- 创建/读取 DM 通道：`POST /api/v4/channels/direct`
- 发送消息：`POST /api/v4/posts`

示例：

```http
POST /api/v4/posts
Authorization: Bearer {BOT_ACCESS_TOKEN}
Content-Type: application/json

{
  "channel_id": "{dm_channel_id}",
  "message": "@张三 你有一项督办事项需要填报反馈，请点击链接：{teable_url}",
  "props": {
    "attachments": [
      {
        "title": "督办事项反馈提醒",
        "text": "任务编号：SJ20260750\n截止时间：2026-06-27 10:00",
        "actions": []
      }
    ]
  }
}
```

---

## 9. URL 构造规则

### 9.1 经办人填报视图 URL

Bot 发送给经办人的 URL 应让经办人登录后直接看到自己需要填报的事项。

**方案：** 使用 Teable 主表（378）的网格视图 URL，附加筛选参数。

格式示例：

```
{BASE_URL}/database/{database_id}/table/{table_id}/{view_id}?filter__field_3524__equal=SJ20260750
```

或更实用的方案：筛选"我的待办"——即当前登录用户作为主表 `经办人账号` 且存在未填报跟进记录的事项。

Teable 视图筛选 URL 参数格式（需根据实际视图测试）：

```
?filter__field_3539__contains=张三
?filter__field_XXXX__has=[current_user]
```

> 注：Teable 的公开分享视图和筛选参数行为需要结合实际版本验证。若视图筛选不支持动态当前用户，可在消息中发送具体任务编号列表 + 主表链接。

### 9.2 单条记录编辑 URL

若需要精确定位到某条记录，可发送：

```
{BASE_URL}/database/{database_id}/table/{table_id}/{view_id}?row={row_id}
```

---

## 10. 延时任务服务设计

### 10.1 任务注册

当 Webhook 接收到 `rows.created` 事件时，对每个新行注册两个延时任务：

- `check_follow_up_24h`：执行时间 = `created_on` + 24h
- `check_follow_up_36h`：执行时间 = `created_on` + 36h

### 10.2 任务取消

在每次执行检查前，先判断目标跟进记录是否已更新：
- 若已更新：取消后续任务（36h 检查）。
- 若未更新：发送提醒并继续等待下一个检查点。

### 10.3 检查逻辑

```python
def is_follow_up_filled(row):
    # 默认以"部门反馈工作落实情况"非空为准
    return bool(row.get("field_7942"))

def check_at_24h(row_id):
    row = fetch_row(row_id)
    if is_follow_up_filled(row):
        cancel_36h_task(row_id)
        return
    notify_handler(row)

def check_at_36h(row_id):
    row = fetch_row(row_id)
    if is_follow_up_filled(row):
        return
    notify_handler(row)
    notify_supervisor(row)
```

### 10.4 技术选型建议

| 方案 | 优点 | 缺点 |
|------|------|------|
| Celery + Redis | 成熟、可持久化、支持定时/取消 | 引入额外组件 |
| APScheduler | 轻量、易集成 | 单机、进程重启丢失 |
| Rq + Redis | 简单、Python 原生 | 功能较 Celery 少 |

**推荐：** Celery + Redis（若系统未来会扩展更多定时任务）。

---

## 11. 非功能需求

| 编号 | 需求 | 说明 |
|------|------|------|
| NFR-001 | 可靠性 | 解析或写入失败时明确反馈，不静默丢失。 |
| NFR-002 | 可追溯性 | Bot 操作通过 `Created by` / `Last modified by` 识别。 |
| NFR-003 | 幂等性 | 同一任务同一周期内避免重复创建跟进记录。 |
| NFR-004 | 可扩展性 | IM 平台抽象为 Bot 账号，切换平台时影响小。 |
| NFR-005 | 安全性 | Token、Secret 通过环境变量注入，不硬编码。 |
| NFR-006 | 可观测性 | Bot 操作日志、Webhook 接收日志、延时任务执行日志需保留。 |

---

## 12. 待确认事项

1. **Excel 模板**：字段顺序、命名、经办人列格式是否已固定？
2. **经办人账号字段**：主表是否新增 `经办人账号`（multiple_collaborators）字段？
3. **汇报周期定义**：跟进记录表是否需要新增"汇报周期"字段（如 2026-W26）？
4. **时间计算**：24h/36h 是自然小时还是工作日？节假日是否排除？
5. **已更新判断标准**：仅以 `field_7942` 非空为准，还是需要 7942/7943/7944 全部非空？
6. **URL 形态**：发送主表筛选视图 URL 还是单条记录编辑 URL？
7. **权限模型**：经办人是否仅可编辑自己被协作者的跟进记录？

---

## 13. 依赖与后续步骤

### 13.1 当前已具备的能力

- Teable 主表与跟进表已建立 Link to table 关联。
- Webhook 已实现自动关联新跟进记录到主表。
- Agent 已具备独立的 Teable 账号。

### 13.2 需要新增/完善的工作

1. 明确 Excel 模板和字段映射。
2. 决定是否在主表新增 `经办人账号` 字段。
3. 实现 Mattermost Bot 接收消息/文件的能力。
4. 实现 Excel 解析与 Teable 批量写入。
5. 实现任务编号解析与批量跟进。
6. 实现 Mattermost 通知发送（含 URL 构造）。
7. 实现延时任务服务（24h/36h 检查）。
8. 完善 Webhook 处理逻辑，使其能触发延时任务。
