# 流程图: issue-12

## 1. 数字员工回答用户问题（基于知识库）

```mermaid
sequenceDiagram
    actor U as 用户
    participant IM as Mattermost IM
    participant DE as 数字员工 Runtime
    participant KB as 企业知识库
    participant LLM as LLM

    U->>IM: @数字员工 提问
    IM->>DE: 转发消息 + 用户上下文
    DE->>DE: 识别用户身份与权限
    DE->>KB: 检索用户有权限的知识（向量检索 + 关键词）
    KB-->>DE: 返回相关知识片段
    DE->>LLM: 请求生成回答（问题 + 上下文）
    LLM-->>DE: 返回回答
    DE->>DE: 敏感操作/越权检查
    DE-->>IM: 发送回答
    IM-->>U: 展示回答
```

## 2. 技能分发与调用

```mermaid
sequenceDiagram
    actor A as 业务管理员
    participant Market as Skill 市场
    participant DE as 数字员工
    participant U as 用户
    participant Skill as Skill Runtime
    participant Ext as 外部系统/Teable

    A->>Market: 浏览并安装 Skill
    Market-->>A: 安装成功
    A->>DE: 将 Skill 分配给岗位
    U->>DE: 自然语言请求
    DE->>DE: 意图识别 → 匹配 Skill
    DE->>Skill: 调用 Skill（含用户权限）
    Skill->>Ext: 执行操作（查询/写入）
    Ext-->>Skill: 返回结果
    Skill-->>DE: 返回结果
    DE-->>U: 以自然语言回复
```

## 3. 人-机协作完成文档任务

```mermaid
sequenceDiagram
    actor U as 用户
    participant DE as 数字员工
    participant Skill as 文档 Skill
    participant Doc as 协作文档（OnlyOffice）
    participant KB as 企业知识库

    U->>DE: “帮我写一份项目周报”
    DE->>Skill: 调用文档生成 Skill
    Skill->>Doc: 创建文档初稿
    Doc-->>Skill: 返回文档链接
    Skill-->>DE: 返回结果
    DE-->>U: 发送文档链接
    U->>Doc: 查看、编辑、评论
    Doc-->>U: 实时协作
    U->>DE: “保存到知识库”
    DE->>KB: 将文档沉淀为知识
    KB-->>DE: 保存成功
    DE-->>U: 确认沉淀完成
```

## 4. 会议预约流程

```mermaid
sequenceDiagram
    actor U as 用户
    participant DE as 数字员工
    participant CalSkill as 日程 Skill
    participant Cal as 日历服务（Nextcloud/Baikal）
    participant Meet as 会议服务（Jitsi）

    U->>DE: “约一个下周的评审会”
    DE->>CalSkill: 调用日程 Skill
    CalSkill->>Cal: 查询参与者空闲时间
    Cal-->>CalSkill: 返回可选时间
    CalSkill-->>DE: 返回时间选项
    DE-->>U: 展示时间选项
    U->>DE: 确认时间
    DE->>CalSkill: 创建日历事件
    CalSkill->>Cal: 写入事件
    CalSkill->>Meet: 创建会议房间
    Meet-->>CalSkill: 返回会议链接
    CalSkill-->>DE: 返回事件 + 链接
    DE-->>U: 发送会议邀请
```

## 5. 产品架构概览

```mermaid
flowchart TB
    subgraph WeLink
        IM[Mattermost IM]
        DE[数字员工 Runtime]
        Teable[Teable 人-机协作中介]
        SkillMarket[Skill 市场]
    end

    subgraph P0_Infrastructure
        KB[(企业知识库<br/>BookStack/Wiki.js)]
        AgentPlatform[Agent/Skill 平台<br/>Dify/Coze Studio]
    end

    subgraph P1_Collaboration
        Docs[协作文档<br/>OnlyOffice]
        Calendar[协作日程<br/>Nextcloud/Baikal]
        Meeting[协作会议<br/>Jitsi Meet]
    end

    subgraph External
        LLM[LLM 服务]
        BizSys[业务系统<br/>MCP/API]
    end

    U[用户] --> IM
    IM --> DE
    DE --> Teable
    DE --> SkillMarket
    DE --> KB
    DE --> AgentPlatform
    DE --> Docs
    DE --> Calendar
    DE --> Meeting
    AgentPlatform --> LLM
    AgentPlatform --> BizSys
```

## 6. 决策流程：是否引入 AI 工作台（长期）

```mermaid
flowchart LR
    A[企业知识库 + 技能分发成熟] --> B{是否有大量<br/>多 Agent 编排需求?}
    B -->|是| C{需求来自<br/>普通用户还是开发者?}
    B -->|否| D[继续方向1]< nouvelle ligne >
    C -->|开发者| E[引入开发者后台<br/>高级模式]
    C -->|普通用户| F[暂不引入<br/>记录并观察]
    E --> G[混合路线<br/>方向3延迟引入]
```
