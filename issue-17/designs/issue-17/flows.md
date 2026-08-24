# 流程图: issue-17

## 主流程

### 话题管理主流程（F-T01 ~ F-T05）

```mermaid
graph TD
    A[用户打开数字员工对话窗口] --> B[加载话题列表<br/>Topic 列表: 标题/最后活跃时间]
    B --> C{用户操作}
    C -->|新建话题| D[创建 Mattermost thread<br/>生成 Topic 记录]
    D --> E[进入新话题窗口]
    C -->|点击历史话题| F[加载该 thread 历史消息]
    F --> G[在话题内继续对话<br/>消息归属当前 thread]
    C -->|发送消息| G
    E --> G
    G --> H{Agent 判断是否为新任务}
    H -->|是| I[Agent 建议: 是否创建新话题讨论 X]
    I -->|用户确认| D
    I -->|用户拒绝| G
    H -->|否| G
```

### Clarify 流程（F-C01 ~ F-C03）

```mermaid
graph TD
    A[用户在当前话题发送需求] --> B{Agent 判断需求是否模糊}
    B -->|否| C[直接进入执行或 Plan 模式]
    B -->|是| D[Agent 调用 Clarify 工具<br/>创建 ClarifySession + ClarifyQuestion]
    D --> E[Mattermost 前端在该话题窗口底部<br/>弹出选项卡: 每题 3 推荐 + 1 自定义]
    E --> F[用户选择/填写并提交]
    F --> G[答案以 user message 发送回该 thread<br/>Session 状态 → answered]
    G --> H{Agent 判断需求是否明确}
    H -->|仍需澄清| D
    H -->|明确| C
```

### Plan 审批流程（F-P01 ~ F-P06）

```mermaid
graph TD
    A[Agent 识别复杂任务] --> B[生成 Plan.md<br/>背景/目标/步骤/依赖/验收标准/风险]
    B --> C[Plan.md 写入该 thread 关联文件<br/>生成 PlanRevision n=1]
    C --> D[话题中渲染 Plan 消息卡片<br/>附「通过」「需要修改」按钮]
    D --> E{用户操作}
    E -->|点击通过| F[自定义 action/webhook/postMessage 回调<br/>状态 → approved]
    F --> G[Agent 解锁执行 Plan<br/>状态 → executing]
    G --> H[话题中反馈执行进度<br/>状态 → completed]
    E -->|点击需要修改 + 输入框描述意见| I[Agent 更新 Plan.md 文件<br/>生成 PlanRevision n+1]
    I --> D
    E -->|未审批期间| J[关键动作保持锁定<br/>仅允许澄清类交互]
```

### 胶囊插入与解析分发流程（F-X01 ~ F-X07）

```mermaid
graph TD
    A[用户点击输入框「+」] --> B{选择胶囊类型}
    B -->|Skills| C1[浏览可用 skills<br/>仅列有权限项]
    B -->|MCP| C2[浏览已配置 MCP servers]
    B -->|插件| C3[浏览已安装插件]
    B -->|多维表格| C4[浏览有权限的 teable 表格]
    C1 & C2 & C3 & C4 --> D[生成统一 JSON schema 胶囊<br/>插入消息并渲染卡片]
    D --> E[消息发送至 thread]
    E --> F[Agent 解析消息中的胶囊]
    F --> G{capsule_type}
    G -->|skill| H1[注入 skill 及上下文并调用]
    G -->|mcp| H2[接入 MCP 工具集并调用]
    G -->|plugin| H3[激活插件能力并调用]
    G -->|teable| H4[调用 teable skills 操作表格]
    H1 & H2 & H3 & H4 --> I[Agent 在话题中回复结果]
```

### Teable 表单 iframe 流程（F-F01 ~ F-F02，复用 issue-6）

```mermaid
graph TD
    A[Agent 发送含 teable 表单视图的消息] --> B[前端以 iframe 嵌入表单<br/>保持 teable 原样式]
    B --> C[用户在 iframe 中填写字段并提交]
    C --> D[数据写入 teable]
    D --> E[postMessage 回传提交结果<br/>白名单校验来源]
    E --> F{提交结果}
    F -->|成功| G[聊天中显示提交成功提示]
    F -->|失败| H[聊天中显示失败原因<br/>用户可在 iframe 中重试]
```

### Agent 代管日程流程（F-S01 ~ F-S05）

```mermaid
graph TD
    A[对话中出现待办: 时间/事项/参与人] --> B[Agent 识别待办要素]
    B --> C[Agent 持用户授权 token<br/>调用日历后端创建事件]
    C --> D{是否含参与人}
    D -->|否| E[事件写入用户个人日历]
    D -->|是| F[添加参与人并触发邀请通知<br/>IM 消息或邮件]
    F --> E
    E --> G[事件在所有参与人的日程看板可见]
    G --> H[Agent 在话题中返回确认消息]
    H --> I[用户经侧边栏/聊天入口打开看板<br/>iframe 查看/编辑/删除]
```

### 日程事件触发 Agent 流程（F-S07 ~ F-S08）

```mermaid
graph TD
    A[Agent 以独立日历身份创建/被邀请事件] --> B[事件落入 agent 自身日历]
    B --> C[ScheduleTriggerRule 匹配事件<br/>如开始前 5 分钟]
    C --> D{触发通道}
    D -->|webhook/push| E[日历后端推送触发通知]
    D -->|polling 兜底| F[定时轮询对账发现到达触发条件]
    E & F --> G[唤醒 Agent]
    G --> H[执行配置动作:<br/>发送提醒 / 推送会议材料 / 调用 skill]
    H --> I[结果反馈至相关话题或用户]
```

## 分支流程

### 分支一：Agent 建议创建话题的两种处理

```mermaid
graph TD
    A{Agent 检测到新任务} -->|默认| B[发送建议卡片<br/>等待用户确认]
    A -->|规则允许自动创建| C[直接创建新话题<br/>并携带上下文摘要]
    B -->|确认| D[创建话题并切换]
    B -->|拒绝| E[留在当前话题继续]
    C --> D
```

### 分支二：日程 OSS 后端适配分支（PoC 后定案）

```mermaid
graph TD
    A{日程后端 PoC 结论} -->|主选| B[Nextcloud Calendar<br/>CalDAV + occ CLI + CalDAV MCP<br/>token = app password]
    A -->|备选| C[Stalwart<br/>JMAP for Calendars + CalDAV<br/>token = OAuth 2.0]
    A -->|AGPL 不可接受| D[sabre/dav + 自研 UI<br/>自研 REST/MCP over CalDAV]
    B & C & D --> E[Agent 侧统一封装:<br/>skill / MCP server / CLI]
```

### 分支三：日程通知通道降级

```mermaid
graph TD
    A{邀请通知} -->|后端支持 iMIP 邮件| B[发送邮件邀请]
    A -->|邮件通道不可用| C[发送 IM 消息通知]
    B --> D[受邀人看板可见事件]
    C --> D
```

## 状态机

### PlanDocument 状态机

- draft → pending_approval（Plan.md 生成并渲染卡片）
- pending_approval → changes_requested（用户点击「需要修改」）
- changes_requested → pending_approval（agent 生成新 revision 并重渲染）
- pending_approval → approved（用户点击「通过」，回调成功）
- approved → executing（agent 解锁开始执行）
- executing → completed（Plan 全部步骤完成）
- draft / pending_approval / changes_requested → cancelled（用户取消任务）

约束：`executing` 的唯一前置状态是 `approved`；`approved` 之后若需变更，生成新 revision 回到 `pending_approval`。

### ClarifySession 状态机

- open（agent 发起 Clarify，选项卡弹出）
- open → answered（用户提交答案，以 user message 回传）
- answered → open（agent 发起新一轮澄清，round+1）
- open → expired（超时未提交，可重新打开）
- open → cancelled（agent 判断无需继续澄清或用户中止）

### ScheduleEvent 状态机

- confirmed（创建成功，默认状态）
- confirmed → tentative（时间或参与人待定调整）
- tentative → confirmed（确认后）
- confirmed / tentative → cancelled（用户或 agent 删除事件）
