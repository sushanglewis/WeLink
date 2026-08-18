window.LINC_PACKAGE = {
  "issue_number": "15",
  "process_slug": "issue-15",
  "current_stage": "clarify",
  "checklist": [
    {
      "key": "prd",
      "label": "PRD"
    },
    {
      "key": "requirements",
      "label": "需求文档"
    },
    {
      "key": "user-stories",
      "label": "用户故事"
    },
    {
      "key": "research",
      "label": "调研笔记"
    },
    {
      "key": "ui-spec",
      "label": "UI 规范"
    },
    {
      "key": "fields",
      "label": "字段说明"
    },
    {
      "key": "decisions",
      "label": "决策记录"
    },
    {
      "key": "prototype-web",
      "label": "原型 · Web 端"
    },
    {
      "key": "prototype-mobile",
      "label": "原型 · 手机端"
    },
    {
      "key": "prototype-app",
      "label": "原型 · 应用端"
    },
    {
      "key": "handoff",
      "label": "Handoff 交接"
    },
    {
      "key": "openspec",
      "label": "OpenSpec 提案"
    }
  ],
  "checklist_done": {
    "prd": true,
    "requirements": true,
    "user-stories": true,
    "prototype-web": true
  },
  "nav": [
    {
      "group": "文档",
      "items": [
        {
          "path": "requirements/2026-08-18-issue-15/requirements.md",
          "label": "需求文档",
          "title": "需求文档: 2026-08-18-issue-15",
          "version": "v1.0",
          "status": "completed",
          "stage": "clarify",
          "human_confirmed": false
        },
        {
          "path": "requirements/2026-08-18-issue-15/user-stories.md",
          "label": "用户故事",
          "title": "用户故事: 2026-08-18-issue-15",
          "version": "v1.0",
          "status": "completed",
          "stage": "clarify",
          "human_confirmed": false
        },
        {
          "path": "requirements/2026-08-18-issue-15/prd.md",
          "label": "PRD",
          "title": "PRD: 2026-08-18-issue-15",
          "version": "v1.0",
          "status": "completed",
          "stage": "clarify",
          "human_confirmed": false
        },
        {
          "path": "requirements/2026-08-18-issue-15/clarification-questions.md",
          "label": "澄清问题",
          "title": "澄清问题 · Issue #15",
          "version": "v1.0",
          "status": "completed",
          "stage": "clarify",
          "human_confirmed": false
        }
      ]
    },
    {
      "group": "设计",
      "items": [
        {
          "path": "designs/issue-15/agent-exchange-plaza-outline.md",
          "label": "产品设计大纲",
          "title": "Agent 交流广场 · 产品设计大纲",
          "version": "v1.0",
          "status": "completed",
          "stage": "clarify",
          "human_confirmed": false,
          "purpose": "信息架构、页面与组件清单、交互规则与异常分支、数据实体字段、agent 编排规则"
        },
        {
          "path": "designs/issue-15/demo-script.md",
          "label": "演示剧本",
          "title": "演示剧本 · Agent 交流广场（Issue #15）",
          "version": "v1.0",
          "status": "completed",
          "stage": "clarify",
          "human_confirmed": false,
          "purpose": "角色卡、分镜时序、HITL 节点与兜底路径、原型点击顺序与演示检查清单"
        }
      ]
    },
    {
      "group": "原型",
      "items": [
        {
          "path": "pages/prototypes/overview.html",
          "label": "原型总览",
          "title": "原型总览 · Issue #15 Agent 交流广场",
          "status": "completed",
          "stage": "clarify",
          "human_confirmed": false,
          "purpose": "6 个场景原型的导航落地页，含 agent 色彩图例与主线案例流程条"
        },
        {
          "path": "pages/prototypes/town-square.html",
          "label": "广场供需发布",
          "title": "原型 · 广场供需发布（Town Square）",
          "status": "completed",
          "stage": "clarify",
          "human_confirmed": false,
          "purpose": "Town Square 信息流：多条供需话题、结构化标签、工信小采发布新需求并高亮、敏感字段脱敏"
        },
        {
          "path": "pages/prototypes/match-intent.html",
          "label": "意向匹配",
          "title": "原型 · 意向匹配（智联小供 · 匹配中 → 发起撮合）",
          "status": "completed",
          "stage": "clarify",
          "human_confirmed": false,
          "purpose": "智联小供的匹配思考态：规则逐条命中、置信度 0.87、发起撮合按钮；其余 agent 静默"
        },
        {
          "path": "pages/prototypes/group-creation.html",
          "label": "私密撮合建群",
          "title": "原型 · 私密撮合频道创建（Playbook 建群）",
          "status": "completed",
          "stage": "clarify",
          "human_confirmed": false,
          "purpose": "Playbook 建群回执：双方阵营、4 名成员、初始系统消息、信息边界提示、撮合 SOP 步骤条"
        },
        {
          "path": "pages/prototypes/private-channel.html",
          "label": "信息交换与方案草拟",
          "title": "原型 · 私密撮合频道（关键信息卡交换与方案草拟）",
          "status": "completed",
          "stage": "clarify",
          "human_confirmed": false,
          "purpose": "双方 agent 各发可折叠关键信息卡，共同草拟合作方案 v1 并完成交叉校验"
        },
        {
          "path": "pages/prototypes/hitl-confirm.html",
          "label": "双人 HITL 确认",
          "title": "原型 · 双人 HITL 确认（@王科长 @陈总）",
          "status": "completed",
          "stage": "clarify",
          "human_confirmed": false,
          "purpose": "成单决策卡：双人确认制 1/2 状态、确认/修改按钮、超时兜底规则"
        },
        {
          "path": "pages/prototypes/order-generated.html",
          "label": "成单与 Teable 同步",
          "title": "原型 · 成单与 Teable 同步（闭环终态）",
          "status": "completed",
          "stage": "clarify",
          "human_confirmed": false,
          "purpose": "订单卡 ORD-2026-0818-001、Teable 同步回执、合作达成通知与全链路留痕"
        }
      ]
    }
  ]
};
