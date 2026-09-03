# Issue #17 流程文档

## 流程 1：龙小督推送 iframe 表单（多表单翻页）

```mermaid
sequenceDiagram
    actor User
    participant MM as Mattermost
    participant Bot as 龙小督 Bot
    participant Form as 自研 iframe 表单
    participant Teable as Teable API

    User->>MM: @龙小督 "我要填报"
    MM->>Bot: 转发消息
    Bot->>Teable: 查询该用户待填报数据
    Teable-->>Bot: 返回 N 条记录
    Bot->>Form: 生成带 token 的表单 URL
    Bot->>MM: 发送 custom post（含 iframe）
    MM->>User: 显示表单消息
    loop 逐条填报
        User->>Form: 填写第 i 条数据
        Form->>Teable: 携带用户 token 提交
        Teable-->>Form: 返回成功
        Form->>Form: 翻页到第 i+1 条
    end
    Form->>MM: postMessage 提交完成事件
    Bot->>MM: 发送确认消息
```

## 流程 2：用户打开 GUI 看板

```mermaid
sequenceDiagram
    actor User
    participant MM as Mattermost
    participant GUI as GUI 看板
    participant Teable as Teable API

    User->>MM: 点击“督办看板”
    MM->>GUI: 打开看板页面
    GUI->>Teable: 携带用户 token 查询数据
    Teable-->>GUI: 返回权限内数据
    GUI->>User: 渲染看板/列表/统计
```

## 流程 3：龙小督主动催办

```mermaid
sequenceDiagram
    participant Teable as Teable Automation
    participant Bot as 龙小督 Bot
    participant MM as Mattermost
    actor User

    Teable->>Bot: Webhook：某事项即将逾期
    Bot->>Teable: 查询负责人信息
    Bot->>Bot: 生成催办消息 + iframe 表单链接
    Bot->>MM: @负责人 发送催办消息
    MM->>User: 显示催办通知
```

## 流程 4：话题管理（未来扩展）

```mermaid
sequenceDiagram
    actor User
    participant MM as Mattermost
    participant Bot as 龙小督 Bot
    participant Topic as 话题上下文存储

    User->>MM: “新建话题：Q3 销售督办”
    MM->>Bot: 转发
    Bot->>Topic: 创建话题上下文
    Bot->>MM: 确认新话题已创建
    loop 话题内对话
        User->>MM: 发送与话题相关消息
        Bot->>Topic: 读取/更新上下文
        Bot->>MM: 回复
    end
    User->>MM: “切换话题：Q3 技术督办”
    Bot->>Topic: 切换上下文
    Bot->>MM: 确认切换
```

## 流程 5：管理员配置新场景

```mermaid
sequenceDiagram
    actor Admin
    participant Teable as Teable Base
    participant Bot as 龙小督 Bot
    participant GUI as GUI 配置界面

    Admin->>Teable: 复制 Base 模板
    Admin->>Teable: 调整字段、权限、自动化
    Admin->>GUI: 配置字段映射与视图
    Admin->>Bot: 用自然语言描述新场景规则
    Bot->>Bot: 学习规则并注册新技能
    Bot->>Admin: 确认新场景已上线
```

## 关键状态流转

### 督办事项状态机

```
未开始 --(经办人填报)--> 进行中
进行中 --(完成填报)--> 已完成
进行中 --(逾期)--> 逾期
逾期   --(补报/审批)--> 进行中 / 已完成
```

### iframe 表单状态机

```
加载中 --(获取数据成功)--> 编辑中
编辑中 --(单条提交成功)--> 已保存（翻页）
编辑中 --(全部提交完成)--> 已完成
编辑中 --(提交失败)--> 错误提示（可重试）
```

## 异常处理

| 异常 | 处理 |
|------|------|
| Teable API 不可用 | iframe 显示错误提示；龙小督回复“服务暂时不可用，请稍后再试” |
| 用户 token 过期 | iframe 引导用户重新授权；或 Bot 自动发起 OAuth 刷新流程 |
| 权限不足 | iframe 显示“无权操作”；Bot 通知管理员 |
| 数据校验失败 | iframe 高亮错误字段，阻止提交 |
| iframe 加载超时 | 显示“打开完整页面”备选链接 |
