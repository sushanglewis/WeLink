# 竞品分析报告：飞书 Aily vs 钉钉悟空

**Issue**: #12 — IM中的AI应用  
**研究范围**: 公开资料  
**日期**: 2026-07-20  
**来源**: issue-12/interviews/2026-07-20-issue-12/raw-insights.md

---

## 1. 飞书 Aily

### 1.1 官方定位

飞书 Aily 是飞书推出的企业级 AI 智能体平台，官方定位是“飞书里来了位新同事”。它既可以作为个人 AI 办公助手，也可以帮助企业搭建专属“数字员工”。Aily 与飞书消息、文档、日历、任务、会议、多维表格等深度集成，强调“长在飞书工作流里的 AI 同事”。

- 官方入口：[https://aily.feishu.cn](https://aily.feishu.cn)
- 飞书帮助中心：[Get started with Feishu Aily](https://www.feishu.cn/hc/en-US/articles/790732948604-get-started-with-feishu-aily)

### 1.2 核心功能

| 功能 | 说明 |
|------|------|
| 个人办公助手 | 转发复杂消息即可自动解析、总结、生成回复；辅助写日报/周报/文档/PPT/数据报告。 |
| 上下文感知 | 读取用户有权限访问的飞书消息、文档、会议纪要、日程、任务等，形成工作记忆。 |
| 主动服务 | 定时执行任务、监测关键群聊/联系人动态，每天早上推送昨日未读和今日待办。 |
| 技能扩展（Skills） | 内置官方技能，支持自定义 Skills 或通过 MCP 接入外部工具与服务，Agent 可自主发现、安装所需技能。 |
| 飞书 Aily Pro | 面向专业场景的进阶版本，支持复杂任务拆解、长指令、生成网页/应用/仪表盘等。 |
| 自定义智能体 | 企业可按业务场景搭建专属智能体，如报销专员、项目助手、HR 答疑机器人等。 |

### 1.3 产品逻辑

1. **以联系人形态存在**：Aily 被设计成飞书通讯录里的一个长期联系人，用户可以随时 @、转发消息或私信它，交互方式与和同事聊天几乎一致。
2. **深度绑定飞书生态数据**：天然理解飞书文档、日历、任务、审批、会议等数据，能基于真实工作上下文作答。
3. **权限即用户权限**：Aily 的操作权限与使用者本人严格一致，敏感操作需人工确认，AI 行为可追溯。
4. **Multi-Agent 协同**：需求澄清 Agent、规划 Agent、智能检索 Agent、执行 Agent 等分工合作，将复杂任务拆解为可执行步骤。
5. **通过 MCP/API 连接业务系统**：企业可把内部知识库、业务系统以 MCP 服务形式接入。

### 1.4 产品主张

- **不做独立 AI 工作台**：Aily 是飞书内置的统一数字员工身份，通过 Lark skills 操作 Lark CLI，使用飞书办公套件功能。
- **统一且唯一的数字员工**：对组织而言，Aily 是统一入口；除非企业自建应用或用户使用云 claw，否则飞书原生不提供其他数字员工方式。
- **AI 即同事**：强调自然交互、上下文感知、权限一致，让 AI 从“问答工具”升级为“可执行任务的数字员工”。

### 1.5 典型案例

| 场景 | 案例 |
|------|------|
| 智能客服 | 公牛集团：7×24 小时响应客户与经销商咨询，客服接待能力提升 30 倍。 |
| 项目洞察数字员工 | 长城物业：实时获取项目数据，缩短业务报告产出时间。 |
| 智能审批助手 | 阳光海天：自然语言发起审批，自动匹配模板并填充表单。 |
| 智能导诊 | 普瑞眼科：通过 MCP 直接查询 HIS 系统。 |

---

## 2. 钉钉悟空

### 2.1 官方定位

钉钉悟空（Wukong）是阿里巴巴钉钉推出的企业级 AI-native 智能体平台。与飞书 Aily 不同，悟空被定位为“AI 桌面 Agent”，可以主动操作计算机、应用和业务系统，而不仅仅是在聊天窗口中回答问题。悟空目前处于邀请制内测阶段。

- 官方文档：[Wukong FAQ](https://wukong.dingtalk.com/docs/en/faq/)
- 竞品对比：[Comparison of competing products](https://wukong.dingtalk.com/docs/en/quick-start/competitor-comparison/)

### 2.2 核心功能

| 功能 | 说明 |
|------|------|
| 多智能体编排 | 协调多个 AI Agent 处理复杂工作流：文档编辑、表格更新、会议转写/总结、研究、报告、应用开发、电商运营等。 |
| 自然语言指令 | 用户用自然语言描述任务，悟空拆解并分派给专业 Agent。 |
| 三种访问模式 | 本地桌面客户端（隐私优先、本地计算）、云沙箱（安全测试环境）、钉钉集成（移动/桌面管理、IM 机器人、可视化面板、通知）。 |
| CLI-native 架构 | 钉钉底层代码重写，所有 GUI 操作变为命令行/API 调用；交互模型从“人→GUI→系统”变为“AI Agent→CLI/API→系统”。 |
| 深度钉钉生态集成 | 连接钉钉消息、文档、知识库、待办、OA 审批、AI 笔记、AI 表格等。 |
| 跨平台连接 | 计划支持 Slack、Microsoft Teams、WeChat；部分来源称原生支持 Google Workspace。 |
| 阿里巴巴生态技能 | 可调用淘宝、天猫、1688、支付宝、阿里云等模块化 Skills。 |
| AI-native 文件系统 | Real Doc / RealDog 存储 AI 决策的过程快照，使输出可追溯、可回滚，并减少 token 消耗。 |
| 企业安全 | 内置身份认证、权限控制、沙箱隔离、全链路审计架构，继承钉钉企业权限规则。 |
| 行业套件 | 发布 10 个 OPT（One Person Team）能力套件，覆盖电商、内容创作、零售运营等。 |
| AI 能力市场 | 钉钉推出 AI skills/agent 能力市场。 |
| 多语言/跨模型 | 支持 30+ 语言，跨模型推理（通义千问、Llama 等）。 |

### 2.3 产品逻辑

1. **AI-native 操作系统**：悟空不只是钉钉里的一个功能，而是试图把钉钉重构为 AI-native OS。
2. **独立应用 + 嵌入钉钉**：悟空和钉钉是两个独立应用，但通过登录认证打通；钉钉内嵌入后的悟空工作台提供 agent harness。
3. **从 GUI 到 CLI/API**：钉钉 CEO 陈航表示“我们把钉钉拆开，用 AI 重新做成悟空”，核心是把 GUI 操作变成 AI 可调用的 CLI/API。
4. **Agent 即操作员**：悟空可以主动操作电脑、应用和系统，强调“动手做事”而非“回答问题”。

### 2.4 产品主张

- **AI 桌面 Agent**：Wukong is not a chatbot, but an AI desktop agent that can do hands-on work.
- **独立 AI 工作台**：通过统一的 AI 工作台提供 agent harness，操作钉钉各类功能。
- **AI-native 工作方式**：把企业软件从“人操作 GUI”转变为“AI Agent 直接调用系统”。

### 2.5 计费模式

- 免费版：每天 100 个“算力粒”。
- 普通会员：约 ¥39/人/月。
- 高级会员：约 ¥99/人/月。
- 按任务成本计费，而非按 raw token。

---

## 3. 对比总结

| 维度 | 飞书 Aily | 钉钉悟空 |
|------|-----------|----------|
| **产品形态** | 飞书内置的统一数字员工/智能体平台 | 独立的 AI-native 工作平台 + 嵌入钉钉的悟空工作台 |
| **入口位置** | 飞书通讯录中的联系人，IM 内原生入口 | 独立桌面客户端/云沙箱 + 钉钉内嵌面板 |
| **交互模型** | 聊天式 + 上下文感知 + 主动推送 | 自然语言指令 + 多 Agent 编排 + 主动操作电脑/应用 |
| **生态集成** | 深度集成飞书办公套件（文档、表格、日程、会议） | 深度集成钉钉生态 + 阿里生态 + 计划跨平台 |
| **数字员工理念** | 统一且唯一的数字员工身份 | 多 Agent 协作，AI 工作台作为 harness |
| **技术架构** | Multi-Agent + MCP + 权限即用户权限 | CLI-native + Agent → CLI/API → 系统 + AI-native 文件系统 |
| **是否做独立 AI 工作台** | **不做**，AI 是办公套件的原生能力 | **做**，AI 工作台是核心入口 |
| **适用组织假设** | 组织希望 AI 融入现有飞书工作流，降低切换成本 | 组织希望 AI 重构工作方式，接受新的 AI-native OS |
| **商业模式** | 飞书订阅 + AI 额度 | 会员订阅（¥39/¥99）+ 算力粒 |

---

## 4. 对 WeLink 的启示

### 4.1 路线选择的关键问题

WeLink 当前已经拥有：
1. 嵌入组织架构的数字员工（Mattermost BOT + skills + MCP/CLI）。
2. 人-机协作中介平台 Teable（未来接入更多中介应用）。
3. 部门 BOT 接入的 Agent 即服务。

这与飞书 Aily 有相似之处（组织嵌入的数字员工），也与钉钉悟空有相似之处（中介平台/Agent harness 思路）。但 WeLink 缺少的是：
- 飞书式的统一数字员工身份和用户心智。
- 钉钉式的独立 AI 工作台和大规模 Agent 编排能力。

### 4.2 两种路线的映射

| 路线 | 与 WeLink 现有能力的匹配度 | 主要冲突 |
|------|---------------------------|----------|
| **Aily 路线：不做独立 AI 工作台，强化数字员工 + Teable** | 高。WeLink 已有数字员工和 Teable，只需统一身份、强化技能分发、扩展 Teable 能力。 | 需要解决“数字员工 vs 部门 BOT vs Teable”三者的用户心智统一问题。 |
| **悟空路线：做独立 AI 工作台，作为 Agent harness** | 中。WeLink 已有 skills 和 MCP/CLI，可以升级为工作台式入口。 | 与现有“嵌入组织架构”理念冲突，可能让用户困惑“该用谁”。 |

### 4.3 关键决策假设

1. **用户心智假设**：WeLink 用户是否已经接受“数字员工”作为 AI 入口？如果接受，Aily 路线更自然。
2. **组织规模假设**：小型组织可能更需要统一的数字员工；大型组织可能需要 AI 工作台来编排多 Agent。
3. **技术债务假设**：引入独立 AI 工作台是否会导致现有数字员工和 Teable 架构分裂？
4. **生态完整性假设**：WeLink 是否有足够的办公套件能力（文档、表格、日程、会议）来支撑 Aily 路线的“AI 即同事”体验？

---

## 5. 信息来源

- Feishu Help Center — [Get started with Feishu Aily](https://www.feishu.cn/hc/en-US/articles/790732948604-get-started-with-feishu-aily)
- Feishu Help Center — [V7.65 AI and automation features](https://www.feishu.cn/hc/en-US/articles/429896178269-v7.65-introducing-new-ai-and-automation-features-to-boost-productivity)
- Feishu Aily 官网 — [https://aily.feishu.cn](https://aily.feishu.cn)
- 36Kr — [The Real and Capable Agent is Here! Feishu Launches a Large Number of New AI Products](https://eu.36kr.com/en/p/3371623528452615)
- AIHub — [飞书Aily - 飞书旗下AI智能体与企业Agent开发平台](https://www.aihub.cn/agents/feishu-aily/)
- Wukong FAQ — [https://wukong.dingtalk.com/docs/en/faq/](https://wukong.dingtalk.com/docs/en/faq/)
- Wukong Competitor Comparison — [https://wukong.dingtalk.com/docs/en/quick-start/competitor-comparison/](https://wukong.dingtalk.com/docs/en/quick-start/competitor-comparison/)
- MLQ.ai — [Alibaba Launches Wukong AI Agent Platform](https://mlq.ai/news/alibaba-unveils-wukong-ai-agent-platform-for-enterprise-automation/)
- Top AI Product — [Alibaba Wukong Turns DingTalk Into an AI-Native OS](https://topaiproduct.com/2026/03/17/alibaba-wukong-turns-dingtalk-into-an-ai-native-os-for-27-million-enterprises/)
- PanDaily — [Alibaba Launches Enterprise AI Platform “WuKong”](https://pandaily.com/alibaba-launches-enterprise-ai-platform-wu-kong-introducing-ai-native-workplace-for-businesses)
- Alibaba Group — [阿里巴巴推出“悟空”](https://www.alibabagroup.com/document-1971078136456019968)
- 36Kr — [800 Million Users' AI Migration: DingTalk Reinvents Itself and Launches “Wukong”](https://eu.36kr.com/en/p/3726513860377221)

---

## 6. 开放问题（供路线决策阶段使用）

1. WeLink 的“数字员工”是否应成为统一且唯一的 AI 入口（类似 Aily）？
2. Teable 作为人-机协作中介平台，是否应升级为 Agent harness（类似悟空工作台）？
3. 如果不做独立 AI 工作台，现有数字员工 + Teable 如何覆盖“多 Agent 编排、自然语言任务分发、跨应用操作”等场景？
4. 如果做独立 AI 工作台，如何避免与现有数字员工入口冲突？
5. 协作文档、日程、会议、知识库、技能分发中，哪些应优先补齐以支撑所选路线？
