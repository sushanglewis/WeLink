# Issue #17 原型字段规格

## 表单数据来源

原型使用 3 条模拟待填报数据，代表一个经办人当前需要处理的督办事项。

## 数据项字段

| 字段名 | 类型 | 是否只读 | 说明 |
|--------|------|----------|------|
| recordId | Text | 是 | Teable 记录 ID，隐藏字段 |
| 事项名称 | Text | 是 | 督办项标题 |
| 截止日期 | Date | 是 | 计划完成时间 |
| 当前状态 | Select | 是 | 未开始 / 进行中 |
| 进度百分比 | Number | 否 | 0-100 的整数 |
| 填报内容 | LongText | 否 | 本次填报说明 |

## 模拟数据集

### 事项 1

```json
{
  "recordId": "rec-2026-001",
  "title": "完成 Q3 销售目标拆解",
  "deadline": "2026-09-15",
  "status": "进行中",
  "progress": 30,
  "content": ""
}
```

### 事项 2

```json
{
  "recordId": "rec-2026-002",
  "title": "提交上半年合规自查报告",
  "deadline": "2026-09-10",
  "status": "未开始",
  "progress": 0,
  "content": ""
}
```

### 事项 3

```json
{
  "recordId": "rec-2026-003",
  "title": "更新客户满意度调研问卷",
  "deadline": "2026-09-20",
  "status": "进行中",
  "progress": 60,
  "content": ""
}
```

## 提交请求体（模拟）

```json
{
  "recordId": "rec-2026-001",
  "userId": "mm-user-10086",
  "token": "Bearer teable_pat_user_xxx",
  "data": {
    "progress": 45,
    "content": "已完成华东区目标拆解，待华北区确认。",
    "status": "进行中",
    "filledAt": "2026-08-29T12:00:00Z"
  }
}
```

## 字段校验规则

- 进度百分比：必填，0-100 整数。
- 填报内容：必填，最少 5 个字符。
- 校验失败时，高亮错误字段并提示。

## 用户身份令牌

- 原型使用模拟 token：`teable_pat_user_xxx`。
- 提交时在前端展示 `Authorization: Bearer teable_pat_user_xxx`。
- 真实环境中应通过后端签发短期凭证，不直接暴露 token。
