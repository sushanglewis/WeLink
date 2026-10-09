# 数据模型：账本记忆层

<!-- status: draft -->

- 设计: context-memory-v1
- 日期: 2026-09-08

## 目录结构（agent 工作区）

```
memory/
├── INDEX.md                     # 全局索引：用户 → 事项 → 层级/状态/更新时间（机器可重建）
├── users/
│   └── {user_id}/
│       ├── profile.md           # 用户级长期偏好（跨事项稳定特征，谨慎写入）
│       └── matters/
│           ├── {matter_id}.md   # L1 活跃账本（锚点：用户 × 督办事项）
│           └── _misc.md         # 未识别事项的对话归档，可升格
├── matters/
│   └── {matter_id}/
│       └── summary-card.md      # L2 事项摘要卡（完结/沉降后）
└── archive/                     # L3 冷存（>1 年未访问的摘要卡）
    └── {year}/{matter_id}.md
```

## frontmatter 规范（`{matter_id}.md`）

```yaml
---
anchor: { user_id: "U123", matter_id: "M456" }
batch: "2026-Q3-督办"        # 批次 = 事项的维度信息
title: "XX 专项检查督办"
status: active                # active | settled | archived
created_at: 2026-09-01T10:00:00+08:00
updated_at: 2026-09-08T09:30:00+08:00
last_accessed_at: 2026-09-08T09:30:00+08:00
source:                       # 来源指针，可回查 PG 原文
  - { session_id: "s-001", from_seq: 128, to_seq: 201, archived_at: 2026-09-08T02:10:00+08:00 }
teable_refs: { table: "督办台账", record_id: "recXYZ" }   # 业务事实引用键，不冗余字段
---
```

## 正文分段规范

```markdown
## 背景        # 事项来龙去脉（稳定，少更新）
## 关键决定    # 何时、谁、决定了什么（含推翻旧决定的时间线）
## 承诺        # 用户/相关方承诺事项 + 状态（open/done）
## 待续事宜    # 下次协作的接续点
## 摘录        # 关键原文摘录（带来源 seq），供回查
```

- 摘要 agent 必须按段写入；「承诺」「关键决定」段为验收抽检重点。
- `profile.md` 仅记录跨事项稳定特征（行文偏好、称呼习惯、常用对接方式），写入需低阈值谨慎触发。

## PG 侧补充结构（在现有会话表基础上）

- `last_active_at`（用户级最近活跃时间，索引）——不活跃检测依据
- `archive_cursor`（每用户/每事项已归档到的消息 seq）——幂等归档，断点续传
- `archive_tasks`（归档任务队列：user_id、检测时间、状态、重试次数）

## 检索模型（无向量库前提）

1. `INDEX.md` 常驻缓存（小规模下全文 < 100KB），激活注入时直接定位文件路径；
2. 信号检索 = INDEX 匹配（事项名称/编号）+ 文件内 grep；可选补充：对 INDEX 与账本标题做轻量 embedding 索引（演进项，非必需）。
