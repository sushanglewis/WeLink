# Flows: Teable + Mattermost 督办协作系统

> **⚠️ 选型更新(2026-07-15)**:本文档基于 Baserow 的具体实例编写(含 `database 84`、`table_id: 378/835`、`field_3521~7966` 等),**选型已更新为 [Teable](https://github.com/teableio/teable)**。文档中的流程时序、Webhook 触发、Agent 编排模式仍可参考,但 API 路径、字段 ID、事件名需按 Teable 实际能力重新映射。Baserow 仅保留作为功能完备性参照基线(见 SRS §1.3)。

## 流程 1：Excel 批量导入

```mermaid
sequenceDiagram
    autonumber
    participant 专员 as 督办专员
    participant Agent as Agent (Claude)
    participant Script as upload-excel 脚本
    participant Teable as Teable API
    participant Webhook as Webhook Service
    participant Celery as Celery + Redis

    专员->>Agent: 提供 Excel 路径
    Agent->>Script: upload-excel --table-id 378 --file data.xlsx --operation append
    Script->>Script: 自动化解析与写入
    Script->>Teable: POST /rows/table/378/batch/
    Teable-->>Script: created main rows
    Script-->>Agent: 成功数 + 失败明细
    Agent->>专员: 汇报汇总 + 主表筛选 URL
    Teable->>Teable: 公式/自动化匹配协作者
    Teable->>Webhook: rows.created event
    Webhook->>Celery: register check_24h / check_36h
```

## 流程 2：任务编号批量跟进

```mermaid
sequenceDiagram
    autonumber
    participant 专员 as 督办专员
    participant Agent as Agent (Claude)
    participant Script as follow-up-tasks 脚本
    participant Teable as Teable API
    participant Webhook as Webhook Service
    participant Celery as Celery + Redis

    专员->>Agent: 发送任务编号集合
    Agent->>Script: follow-up-tasks --table-id 835 --tasks SJ20260750,...
    Script->>Teable: 校验主表存在性
    loop 每个存在的编号
        Script->>Teable: POST /rows/table/835/
        Teable-->>Script: created follow-up row
    end
    Script-->>Agent: 成功/失败清单
    Agent->>专员: 汇报结果
    Teable->>Webhook: rows.created event
    Webhook->>Celery: register check_24h / check_36h
```

## 流程 3：24h / 36h 批量监控提醒

```mermaid
sequenceDiagram
    autonumber
    participant Celery as Celery + Redis
    participant Teable as Teable API
    participant Script as send-notifications 脚本
    participant Agent as Agent (Claude)
    participant 经办人 as 经办人
    participant 专员 as 督办专员

    Note over Celery: T+24h
    Celery->>Teable: 查询本小时内未填报跟进记录
    Teable-->>Celery: rows
    alt 硬编码聚合可行
        Celery->>Script: 按经办人聚合后批量发送
        Script->>经办人: 汇总通知 + 筛选 URL
    else 需 Agent 编排
        Celery->>Agent: 推送触发明细（任务编号/经办人/协作者）
        Agent->>Script: send-notifications --by-handler
        Script->>经办人: 按经办人汇总通知
    end

    Note over Celery: T+36h
    Celery->>Teable: 查询本小时内仍未填报记录
    Teable-->>Celery: rows
    alt 硬编码聚合可行
        Celery->>Script: 向经办人 + 督办专员发送升级提醒
        Script->>经办人: 升级提醒 + 筛选 URL
        Script->>专员: 按任务编号筛选的汇总 URL
    else 需 Agent 编排
        Celery->>Agent: 推送触发明细
        Agent->>Script: send-notifications --escalate
        Script->>经办人: 升级提醒
        Script->>专员: 汇总 URL
    end
```

## 流程 4：Teable 内部协作者自动匹配

```mermaid
sequenceDiagram
    autonumber
    participant Teable as Teable
    participant Main as 主表 (378)
    participant Auto as 自动化/公式
    participant Follow as 跟进表 (835)

    Teable->>Main: 新增记录，经办人="张三"
    Main->>Follow: 通过 link_row 创建跟进记录
    Follow->>Auto: 触发自动化
    Auto->>Auto: 将"张三"匹配为 Teable user_id=3
    Auto->>Follow: 写入 Collaborators=[{"id": 3}]
```
