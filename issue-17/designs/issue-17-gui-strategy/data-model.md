# Issue #17 数据模型设计

## 核心原则

- **Teable 是唯一数据源**：GUI 层和龙小督都通过 Teable API 读写数据。
- **不重复存储业务数据**：GUI 层只缓存展示所需数据，不持久化。
- **用户身份令牌用于审计**：每次写操作都携带用户 token，Teable 记录操作者。

## Teable Base 结构（督办场景示例）

### 表 1：督办事项（SupervisionItems）

| 字段 | 类型 | 说明 |
|------|------|------|
| 事项编号 | Single line text | 唯一标识 |
| 事项名称 | Single line text | 简短描述 |
| 内容描述 | Long text | 详细说明 |
| 责任部门 | Single select / Link | 负责部门 |
| 责任人 | User / Link | 具体经办人 |
| 状态 | Single select | 未开始 / 进行中 / 已完成 / 逾期 |
| 优先级 | Single select | 高 / 中 / 低 |
| 截止日期 | Date | 计划完成时间 |
| 完成时间 | Date | 实际完成时间 |
| 创建时间 | Created time | 自动记录 |
| 最后更新时间 | Last modified time | 自动记录 |
| 最后更新人 | Last modified by | 自动记录（用户令牌操作痕迹） |

### 表 2：填报记录（FillRecords）

| 字段 | 类型 | 说明 |
|------|------|------|
| 关联事项 | Link to SupervisionItems | 对应督办项 |
| 填报人 | User | 当前经办人 |
| 填报内容 | Long text | 本次填报内容 |
| 进度百分比 | Number | 0-100 |
| 附件 | Attachment | 相关文件 |
| 填报时间 | Created time | 自动记录 |
| 数据来源 | Single select | IM 表单 / GUI / 导入 |

### 表 3：用户令牌映射（UserTokens）

**注意**：此表仅用于演示/原型阶段的概念设计。生产环境应使用 OAuth 服务或 secret manager，避免直接存储用户 token。

| 字段 | 类型 | 说明 |
|------|------|------|
| 用户 ID | Single line text | Mattermost 用户 ID |
| Teable Token | Single line text（加密） | 用户的 Teable API Token |
| 过期时间 | Date | Token 过期时间 |
| 刷新令牌 | Single line text（加密） | OAuth refresh token |

## GUI 层数据映射

### iframe 表单需要的数据

```json
{
  "userId": "mm-user-123",
  "token": "teable_pat_xxx",
  "items": [
    {
      "recordId": "rec-001",
      "title": "完成 Q3 销售目标拆解",
      "deadline": "2026-09-15",
      "status": "进行中",
      "formFields": [
        {"name": "progress", "type": "number", "label": "进度百分比", "value": 30},
        {"name": "content", "type": "longText", "label": "填报内容", "value": ""},
        {"name": "attachment", "type": "attachment", "label": "附件", "value": []}
      ]
    }
  ]
}
```

### GUI 看板需要的数据

```json
{
  "items": [
    {
      "recordId": "rec-001",
      "title": "完成 Q3 销售目标拆解",
      "responsibleDept": "销售部",
      "responsiblePerson": "张三",
      "status": "进行中",
      "priority": "高",
      "deadline": "2026-09-15",
      "progress": 30
    }
  ],
  "summary": {
    "total": 10,
    "completed": 4,
    "overdue": 1,
    "inProgress": 5
  }
}
```

## 权限模型

| 角色 | 数据权限 | 操作权限 |
|------|----------|----------|
| 领导 | 全量数据 | 查看、导出 |
| 部门负责人 | 本部门数据 | 查看、催办、审批 |
| 经办人 | 自己被分配的数据 | 填报、查看自己负责项 |
| 系统管理员 | 全部 | 配置、权限管理 |

## 与 Mattermost 的映射

| Mattermost 实体 | Teable 实体 | 说明 |
|-----------------|-------------|------|
| User ID | UserTokens.用户ID | 用户身份关联 |
| Bot Account | Service Account / Token | 龙小督操作 Teable 时使用服务 token |
| Channel | 督办场景分组 | 一个频道可对应一个督办 Base 或视图 |
| Custom Post | iframe 表单卡片 | 通过 plugin 注册自定义渲染 |

## 关键接口

| 操作 | Teable API | 说明 |
|------|------------|------|
| 查询待填报列表 | `GET /api/table/{tableId}/records` | 按经办人、状态筛选 |
| 提交填报 | `POST /api/table/{tableId}/record` 或 `PATCH /api/record/{recordId}` | 使用用户 token |
| 查询督办看板 | `GET /api/table/{tableId}/records` | 按角色权限筛选 |
| 获取分享视图 | `GET /api/share/{shareId}/view` | 用于公开/受限视图 |
| 提交分享表单 | `POST /api/share/{shareId}/view/form-submit` | 传统 Teable 表单提交 |

## 备注

- 生产环境中，用户 token 应通过 OAuth 2.0 / OIDC 流程获取，避免明文存储。
- GUI 层应封装 Teable API 调用，便于后续切换数据源或升级 API 版本。
- 自研 iframe 表单不直接暴露 Teable Token 给前端，而是通过后端签名短期凭证或 postMessage 安全传递。
