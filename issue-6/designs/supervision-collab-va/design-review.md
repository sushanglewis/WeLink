# Design Review: Baserow + Mattermost 督办协作系统

> Related documents:
> - [scenarios.md](scenarios.md)
> - [feature-catalog.md](feature-catalog.md)
> - [data-model.md](data-model.md)
> - [flows.md](flows.md)
> - [feasibility.md](feasibility.md)

<!-- status: approved -->

## 1. 概述与目标

基于现有 Baserow 督办主表（`table_id: 378`）与跟进记录表（`table_id: 835`），为 Agent（Claude）提供一组可编排的脚本/CLI 工具，使其能够批量完成督办事项录入、跟进记录创建、通知发送与延时监控，而无需在运行时逐行处理业务数据。

**核心目标：**
- 提供 `upload-excel`、`follow-up-tasks`、`send-notifications`、`check-followups` 等脚本，Agent 通过调用脚本完成批量操作。
- 脚本接收明确的入参：Baserow 表编号、文件路径、操作类型（如 `append`），脚本内部自动化完成数据录入，并返回成功记录数与失败明细。
- Agent 不解析 Excel 行数据，仅接收脚本返回的汇总信息，并向督办专员汇报结果与发送主表筛选 URL。
- Baserow 内部通过公式/自动化将 Excel 中的经办人字段匹配为协作者（Collaborators），并触发通知。
- 跟进记录创建后自动触发延时监控，24h/36h 未填报则分级提醒；提醒按经办人聚合批量发送，避免消息轰炸。

## 2. 系统架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Agent (Claude)                                  │
│  根据用户指令决定调用哪个脚本；不直接处理业务数据，只负责编排与确认。          │
└───────────────────────────────┬─────────────────────────────────────────────┘
                                │ 调用脚本 / CLI
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        tools/baserow-mattermost/                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │ upload-excel │ │follow-up-tasks│ │send-notifications│ │  webhook-server    │ │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────────┬───────────┘ │
│         │                │                │                    │             │
│         └────────────────┴────────────────┴────────────────────┘             │
│                                    │                                         │
│         ┌──────────────────────────┘                                         │
│         ▼                                                                    │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                     shared: clients, parsers, scheduler                │ │
│  │  BaserowClient / MattermostClient / ExcelParser / TaskParser / Celery  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Baserow     │    │   Mattermost    │    │  Celery + Redis │
│  table 378/835  │    │      API        │    │  check_24h/36h  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 3. 组件设计

### 3.1 Agent 编排层（Claude）

- **职责**：理解用户指令，选择并调用合适的脚本；不直接解析 Excel 或逐行写入数据。
- **交互方式**：
  - 用户："请导入这个 Excel 并通知经办人"
  - Agent：调用 `upload-excel --file path/to.xlsx --notify`，等待脚本返回结果摘要。
- **价值**：减少 Agent 上下文负担，避免在 runtime 中处理上百条业务数据。

### 3.2 脚本工具集（tools/baserow-mattermost/）

| 脚本 | 职责 | 典型调用 |
|------|------|----------|
| `upload-excel` | 解析 Excel，按表编号批量新增主表记录；返回成功数与失败明细 | `upload-excel --table-id 378 --file data.xlsx --operation append` |
| `follow-up-tasks` | 按任务编号批量创建跟进记录 | `follow-up-tasks --table-id 835 --tasks SJ20260750,SJ20260751` |
| `send-notifications` | 按经办人/协作者聚合后批量发送 Mattermost 通知 | `send-notifications --by-handler --url-filter collaborator` |
| `webhook-server` | 接收 Baserow `rows.created` Webhook，注册延时任务 | `webhook-server --host 0.0.0.0 --port 8000` |
| `check-followups` | 手动触发 24h/36h 检查（也供 Celery 调用） | `check-followups --row-id 195 --deadline 36h` |

### 3.3 Baserow 数据访问层

- **首选方案**：Baserow MCP Server（官方内置）或 `baserow-cli`。
- **备选方案**：直接调用 Baserow REST API（`requests`）。
- **关键操作**：
  - 批量创建主表记录
  - 创建跟进记录并写入 Collaborators
  - 按任务编号查询主表
  - 读取跟进记录判断填报状态

### 3.4 Excel 解析与录入脚本

- **职责**：脚本接收 `--table-id`、`--file`、`--operation` 等参数，自动化完成 Excel 解析与主表批量写入，返回成功记录数和失败明细。
- **库**：`pandas` + `openpyxl`。
- **字段映射**：`config/field_mapping.py` 中维护 Excel 列名 → Baserow field_id 的映射。
- **经办人处理**：Excel 中的 `经办人及联系方式` 字段作为普通文本录入主表；**协作者匹配由 Baserow 内部公式/自动化完成**，不需要脚本预先解析并写入 `Collaborators`。
- **失败处理**：记录导入失败不允许整体失败；失败行作为明细返回给 Agent。

### 3.5 任务编号解析器

- **职责**：从文本中提取任务编号集合（支持逗号、空格、换行分隔），校验主表存在性。
- **去重**：同一任务编号在同一汇报周期内只创建一个跟进记录（P1，MVP 可先不实现）。

### 3.6 Webhook 服务

- **职责**：接收 Baserow `rows.created` 事件，为每个新跟进记录注册 24h/36h 检查任务。
- **实现**：FastAPI + `POST /webhook/follow-up-created`。
- **幂等**：以 row_id 为任务 key，重复注册时覆盖或忽略。

### 3.7 延时任务服务

- **职责**：执行 24h/36h 检查，发送提醒，取消已完成任务的后续检查。
- **实现**：Celery + Redis。
- **任务**：
  - `check_follow_up_24h(row_id)`
  - `check_follow_up_36h(row_id)`
- **完成判断**：`field_7942`、`field_7943`、`field_7944` 全部非空。

### 3.8 Mattermost 通知器

- **职责**：按经办人/协作者聚合待办事项，批量构造并发送 Mattermost 私聊/频道消息，包含汇总后的筛选 URL、截止时间、操作步骤。
- **实现**：Mattermost MCP Server 或 `mattermostdriver` / Mattermost REST API。
- **URL 构造**：使用 Baserow 主表筛选视图 URL，按当前登录用户的协作者字段筛选（如 `filter__field_XXXX__has=[current_user]`）。
- **批量策略**：为避免消息轰炸，同一批次内按经办人聚合所有待跟进任务，发送一条汇总消息而非逐条发送。

## 4. 数据模型与字段映射

### 4.1 主表（table_id: 378）写入字段

| Baserow field_id | 含义 | Excel 列示例 |
|------------------|------|--------------|
| field_3524 | 任务编号 | SJ20260750 |
| field_3526 | 交办时间 | 2026-06-20 |
| field_3533 | 责任单位 | XX局 |
| field_3539 | 经办人及联系方式 | 张三 13800138000 |
| field_XXXX | 经办人账号（建议新增） | - |

### 4.2 跟进表（table_id: 835）写入字段

| Baserow field_id | 字段名 | 类型 | 值示例 |
|------------------|--------|------|--------|
| 7926 | 任务编号 | text | SJ20260750 |
| 7961 | 关联主表 | link_row | `[{ "id": 1 }]` |
| 7966 | Collaborators | multiple_collaborators | 由 Baserow 公式/自动化根据主表经办人字段匹配生成 |

### 4.3 Baserow 内部自动化

- **协作者自动匹配**：在 Baserow 中配置公式或自动化规则，将主表 `经办人账号`（或 `经办人及联系方式`）字段匹配为 Baserow 用户，并自动写入跟进表的 `Collaborators` 字段。
- **通知触发**：当跟进记录创建且 `Collaborators` 被填充后，可通过 Webhook 或 Baserow 内置通知触发 Mattermost 消息。

## 5. 关键流程时序

### 5.1 流程 1：Excel 批量导入

1. 用户向 Agent 提供 Excel 文件路径与目标表编号。
2. Agent 调用脚本：`upload-excel --table-id 378 --file data.xlsx --operation append`。
3. 脚本自动化解析 Excel 并批量写入主表；返回成功记录数与失败明细。
4. Agent 向督办专员汇报汇总信息，并发送新增事项的主表筛选 URL。
5. Baserow 内部公式/自动化根据主表经办人字段匹配协作者，写入跟进表 `Collaborators`。
6. Baserow 触发 `rows.created` Webhook，延时服务注册 24h/36h 任务。

### 5.2 流程 2：任务编号批量跟进

1. 用户向 Agent 提供任务编号集合与跟进表编号。
2. Agent 调用脚本：`follow-up-tasks --table-id 835 --tasks SJ20260750,SJ20260751`。
3. 脚本校验主表存在性并批量创建跟进记录。
4. 脚本返回成功/失败清单；Agent 向督办专员汇报。
5. Baserow 自动匹配协作者并触发 Webhook。

### 5.3 流程 3：24h/36h 监控

1. Webhook 接收到 `rows.created`。
2. 对每个 row_id 调用 `check_follow_up_24h.apply_async(countdown=86400)`。
3. 对每个 row_id 调用 `check_follow_up_36h.apply_async(countdown=129600)`。
4. 24h 检查时：若已填报（7942/7943/7944 全部非空）则取消 36h 任务；否则提醒经办人。
5. 36h 检查时：若已填报则直接返回；否则提醒经办人 + 督办专员。

## 6. 技术栈

- **Python 3.12+**
- **Baserow MCP Server**（官方内置）：首选数据 CRUD 接口
- **`baserow-cli`**：脚本式 Baserow 操作备选
- **Mattermost MCP Server**（官方 v11.2+）：发送通知的首选接口
- **`mattermostdriver`**：Mattermost REST API 备选
- **FastAPI** / **Uvicorn**：Webhook HTTP 服务
- **Celery + Redis**：延时任务
- **pandas + openpyxl**：Excel 解析
- **Pydantic**：配置与数据校验
- **structlog**：结构化日志
- **Typer**：CLI 脚本框架

## 7. 项目结构

```
tools/baserow-mattermost/
├── pyproject.toml
├── requirements.txt
├── .env.example
├── README.md
├── src/
│   ├── baserow_mattermost/
│   │   ├── __init__.py
│   │   ├── cli/
│   │   │   ├── upload_excel.py
│   │   │   ├── follow_up_tasks.py
│   │   │   ├── send_notifications.py
│   │   │   └── check_followups.py
│   │   ├── web/
│   │   │   └── webhook_server.py
│   │   ├── clients/
│   │   │   ├── baserow_client.py      # 封装 MCP / CLI / REST
│   │   │   └── mattermost_client.py
│   │   ├── parsers/
│   │   │   ├── excel_parser.py
│   │   │   └── task_parser.py
│   │   ├── scheduler/
│   │   │   ├── celery_app.py
│   │   │   └── celery_tasks.py
│   │   ├── config/
│   │   │   ├── settings.py
│   │   │   └── field_mapping.py
│   │   ├── models/
│   │   │   ├── baserow_schemas.py
│   │   │   └── webhook_schemas.py
│   │   └── utils/
│   │       ├── url_builder.py
│   │       └── logger.py
│   └── entrypoints/
│       ├── upload-excel
│       ├── follow-up-tasks
│       ├── send-notifications
│       ├── webhook-server
│       └── check-followups
└── tests/
    ├── test_excel_parser.py
    ├── test_task_parser.py
    ├── test_baserow_client.py
    ├── test_celery_tasks.py
    └── test_webhook_handler.py
```

## 8. 配置项

| 环境变量 | 说明 |
|----------|------|
| `MATTERMOST_URL` | Mattermost 服务器地址 |
| `MATTERMOST_BOT_TOKEN` | Bot Access Token |
| `MATTERMOST_BOT_USERNAME` | Bot 用户名 |
| `BASEROW_URL` | Baserow 服务器地址 |
| `BASEROW_DB_TOKEN` | Database Token |
| `BASEROW_MAIN_TABLE_ID` | 主表 ID，默认 378 |
| `BASEROW_FOLLOW_TABLE_ID` | 跟进表 ID，默认 835 |
| `REDIS_URL` | Redis 连接地址 |
| `WEBHOOK_HOST` / `WEBHOOK_PORT` | Webhook 服务监听地址 |

## 9. 安全与可观测性

- Token/Secret 全部通过环境变量注入，不硬编码。
- Bot 以自身身份发送消息，不冒充人类。
- 操作日志、Webhook 接收日志、延时任务执行日志统一结构化输出。
- 失败场景明确返回错误信息，不静默丢失。

## 10. 待确认事项（已解决）

| # | 问题 | 决策 |
|---|------|------|
| 1 | Excel 模板是否固定？ | 已固定，字段映射配置化。 |
| 2 | 主表是否新增 `经办人账号`？ | **新增** multiple_collaborators 字段。 |
| 3 | 跟进表是否新增"汇报周期"字段？ | **需要**。 |
| 4 | 24h/36h 是自然小时还是工作日？ | **自然小时**。 |
| 5 | 已更新判断标准？ | **7942/7943/7944 全部非空**。 |
| 6 | URL 形态？ | **主表筛选视图 URL**。 |
| 7 | 经办人是否仅编辑自己被协作者的记录？ | 是的，经办人仅需要负责需要自己协作的记录。 |

## 11. 推荐实现顺序

1. **环境验证**：确认 Baserow MCP / `baserow-cli` 与 Mattermost MCP 可用性。
2. **基础框架**：项目结构、配置加载、Baserow/Mattermost Client 封装。
3. **Webhook 服务**：接收 `rows.created` 并注册 Celery 任务。
4. **延时任务**：实现 `check_24h` / `check_36h`。
5. **任务编号跟进脚本**：`follow-up-tasks`。
6. **Excel 导入脚本**：`upload-excel`。
7. **通知脚本**：`send-notifications`。
8. **测试与部署**：单元测试、Docker Compose、文档。

## 12. 决策记录

- **脚本/CLI 优先，Agent 仅编排**：Agent 不直接解析 Excel 行数据，只调用脚本并汇报汇总信息；脚本负责自动化录入。
- **Baserow 内部自动化匹配协作者**：协作者字段由 Baserow 公式/自动化根据主表经办人字段生成，脚本不预处理经办人映射。
- **Baserow MCP / `baserow-cli` 优先**：优先使用官方 MCP Server 或 `baserow-cli` 进行 CRUD，直接 REST API 作为备选。
- **Mattermost MCP 优先**：优先使用 Mattermost 官方 MCP Server 发送通知，`mattermostdriver` 作为备选。
- **通知按经办人批量聚合**：同一批次内按经办人聚合所有待跟进任务，发送一条汇总消息，避免消息轰炸。
- **Created on 字段粒度到小时**：便于按小时批次触发和聚合提醒任务。
- **经办人：督办事项为 1:n**：一条通知 URL 按协作者字段筛选，展示该经办人所有待办主表记录。
- **自然小时 + 三字段全部非空**：24h/36h 按自然小时计算；填报完成以 7942/7943/7944 全部非空为准。
- **使用 Celery + Redis**：需求文档推荐方案，支持持久化、取消、未来扩展。
- **MVP 排除 P1 需求**：FR-005、FR-011、FR-019 留待后续迭代。
