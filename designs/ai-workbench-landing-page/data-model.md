# Data Model: 企业 AI 工作台一级落地页

## 说明

本文档描述 AI 工作台自身需要管理的核心实体。LibreChat 内部已有用户、会话、消息等数据模型，本期优先复用；以下模型聚焦于 WeLink 侧需要扩展或新增的实体。

> 注：应用网格、skill 订阅、企业自定义 skill 管理等功能本期不做，相关数据模型列入后续规划。

## 核心实体

### 1. 用户（User）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID / bigint | PK | WeLink 用户唯一标识 |
| wechat_id / employee_id | string | unique, not null | 企业微信/员工工号 |
| librechat_user_id | string | unique, nullable | LibreChat 侧用户 ID |
| department_id | string | nullable | 部门标识 |
| role | enum | default 'user' | user / admin / super_admin |
| created_at | timestamp | not null | 创建时间 |
| updated_at | timestamp | not null | 更新时间 |

**约束**：
- 一个 WeLink 用户对应一个 LibreChat 用户（SSO 映射）。

### 2. 使用事件（UsageEvent）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID / bigint | PK | 事件唯一标识 |
| user_id | UUID | FK -> User, not null | 用户 |
| event_type | enum | not null | chat / knowledge_base / artifact / search |
| session_id | string | nullable | LibreChat 会话 ID |
| message_id | string | nullable | LibreChat 消息 ID |
| artifact_type | string | nullable | markdown / html / mermaid / svg |
| query_text | text | nullable | 用户输入/query |
| metadata | JSON | nullable | 扩展字段 |
| created_at | timestamp | not null | 发生时间 |

**约束**：
- event_type 为 artifact 时，artifact_type 必填。

### 3. 知识库文档（KnowledgeDoc）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 文档唯一标识 |
| file_name | string | not null | 原始文件名 |
| file_path | string | not null | 存储路径 |
| file_type | string | not null | pdf / docx / md / txt |
| status | enum | default 'pending' | pending / indexing / indexed / failed |
| vector_store_ref | string | nullable | 向量库引用 ID |
| uploaded_by | UUID | FK -> User | 上传人 |
| created_at | timestamp | not null | 创建时间 |
| updated_at | timestamp | not null | 更新时间 |

## 状态转换

### KnowledgeDoc 状态

```
pending --> indexing --> indexed
indexing --> failed
failed --> indexing
```

## 关键关系

```
User 1:N UsageEvent
User 1:N KnowledgeDoc
```

## 规划中实体（本期不做）

- **Skill**：企业 skill/Agent 定义。
- **UserSubscription**：用户 skill 订阅关系。
- **AdminSkillConfig**：管理员 skill 发布配置。
