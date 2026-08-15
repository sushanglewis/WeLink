# 需求文档: 2026-08-15-issue-14

<!-- status: approved -->

[x] PM 已确认需求

## 背景

- Issue: #14
- 访谈摘要: `issue-14/interviews/2026-08-15-issue-14/summary.md`
- 集成研究: `issue-14/docs/research/integration-research.md`

WeLink 已基于 Mattermost IM 能力与 Teable 多维协同表格构建了人-机混合组织架构，以及基于自然语言与多维表格的人-机协同交互方式。数字员工以 Mattermost Bot 账号成为组织架构的真实成员，可被用户发现、发起会话，并通过自然语言或操作 Teable 表格响应用户要求，同时接收 Teable webhook 通知响应表格中的操作。

为强化产品运营团队的对外服务能力与内部研发效率，现计划以 OpenClaw 为 agent 底座，创建一组命名统一为「龙小*」的数字员工 IP，覆盖客服、产品经理、技术研究员、架构师等角色，实现客服应答、需求分析、方案研究、issue 创建、成员通知等能力，并通过 Mattermost Playbook 形成从用户问题到 issue 的标准化 SOP。

（来源：GitHub Issue #14 描述）

## 问题

1. 产品运营团队需要 7×24 响应外部用户的客服问题、工单与能力介绍，人工响应成本高。
2. 从用户问题到内部 issue 的流转缺乏标准化 SOP，需求澄清、方案研究、issue 创建依赖人工接力。
3. 内部成员（PM、技术研究员、架构师）需要被及时拉入协作，但现有机制无法根据问题类型自动匹配角色。
4. 现有 teable agent skills 与 Mattermost Bot 已具备基础能力，但缺少以 OpenClaw 为统一底座的角色化、可扩展数字员工平台。

## 用户

| 用户角色 | 描述 | 核心诉求 |
|---------|------|---------|
| 外部用户 / 客户 | 使用 WeLink 或关注 WeLink 能力的人 | 快速获得客服解答、工单进展、能力介绍 |
| 客服人员 / 运营人员 | 负责日常客户沟通与工单跟进 | 由数字员工处理高频重复问题，只在复杂场景被拉入 |
| 产品经理（PM） | 负责需求分析与产品决策 | 自动获得已澄清的需求与初步分析，减少信息传递损耗 |
| 技术研究员 | 负责开源项目、代码与解决方案调研 | 在协作频道内接收研究任务并输出方案 |
| 架构师 | 负责技术方案评审与决策 | 在关键节点被 mention，确认方案可行性 |
| 研发团队 | 负责 issue 落地实现 | 收到清晰、可执行的 issue 与上下文 |

## 方案

### 总体架构

采用「OpenClaw agent 底座 + Mattermost Bot 身份 + Teable skills 复用」的架构：

- **OpenClaw**：提供 agent 运行时、skill 管理、memory、multi-agent routing；
- **Mattermost**：提供组织架构、IM 会话、thread 上下文、mention 协议、Playbook SOP；
- **Teable**：提供多维协同表格、agent skills、webhook、automation；
- **数字员工 IP**：统一以「龙小*」命名，如：
  - 龙小客：客服数字员工
  - 龙小产：产品经理数字员工
  - 龙小研：技术研究员数字员工
  - 龙小构：架构师数字员工

### 分阶段落地

1. **第一阶段：客服对外答疑**
   - 龙小客入驻客服频道；
   - 响应常见客服问题、能力介绍、工单状态查询；
   - 无法处理时，按 SOP 升级为 issue 并触发 Playbook。

2. **第二阶段：内部需求分析**
   - 龙小产接入，对 issue 进行需求澄清与拆解；
   - 调用 Teable 表格记录需求、优先级、验收标准；
   - 龙小研根据需求进行开源项目/代码/解决方案研究。

3. **第三阶段：多角色协作**
   - 客服频道触发 Playbook，创建基于 issue 的多智能体协作频道；
   - 龙小客、龙小产、龙小研、龙小构按 mention 协议串行协作；
   - 人类成员在关键节点被 Playbook 拉入/被 agent mention，完成 HITL。

### Mention 协议

- 采用标准 Mattermost `@username` / `@display_name` mention；
- agent 通过 `GET /api/v4/channels/{channel_id}/members` 获取频道成员 username；
- 当需要人类介入时，agent 在消息中 mention 对应人类成员；
- 由于存在 bot mention 不触发通知的已知问题，需设计私信/Webhook/Playbook 成员邀请兜底。

### Playbook SOP：用户问题 → issue

1. 用户在客服频道提出问题；
2. 龙小客初步响应；
3. 若需内部处理，龙小客触发 Playbook 创建协作频道；
4. 龙小产在协作频道内澄清需求；
5. 龙小研进行方案研究；
6. 龙小构评审方案；
7. 必要时 mention 人类 PM/架构师确认；
8. 生成 issue 并通知相关成员。

## 验收标准

- [ ] 龙小客 Bot 账号以真实成员身份出现在客服频道，拥有自定义头像、显示名称与在线状态，可被用户发现与 @mention。
- [ ] 龙小客能通过自然语言响应常见客服问题（FAQ/能力介绍/工单状态）。
- [ ] 龙小客能识别需升级为 issue 的问题，并触发 Mattermost Playbook 创建协作频道。
- [ ] 协作频道内，agent 能获取成员列表并按标准 mention 协议 `@username` 调用其他 agent 或人类成员。
- [ ] agent 能在 thread 内回复，保持 issue 上下文连续。
- [ ] 龙小产/龙小研/龙小构能按阶段介入协作，完成需求澄清、方案研究、架构评审。
- [ ] 协作最终生成 GitHub issue，并同步关键信息到 Teable 表格。
- [ ] 现有 teable agent skills 能被 OpenClaw 数字员工直接调用，无需重写为其他格式。
- [ ] 每个数字员工拥有独立的身份密钥/Token，权限最小化。

## 非目标

- 本期不替换现有 Mattermost 服务端或 Teable 服务端。
- 不要求数字员工具备语音/视频通话能力。
- 不要求完全无人值守：关键节点保留人类 HITL。
- 本期不做 OpenClaw 与其他 agent 框架的横向选型对比（OpenClaw 已确定）。
- 不要求一次性实现所有数字员工角色的全部能力，按阶段落地。

## 开放问题

1. ✅ **MVP 范围？** 本期设计完整多角色平台，但分阶段实现：客服对外答疑 → 内部需求分析 → 多角色协作。
2. ✅ **agent 底座？** 已确定为 OpenClaw，不做框架选型。
3. ✅ **mention 协议？** 标准 Mattermost `@username` / `@display_name`。
4. ✅ **teable skills 复用？** 现有 teable agent skills 可被 OpenClaw 直接调用。
5. ✅ **每个角色的具体能力边界与触发条件**在本 PRD 中粗粒度定义，产品设计/技术设计阶段再细化（如龙小研何时被调用）。
6. ✅ **LLM 供应商约束？** 无硬性国产化约束，倾向使用 kimi 3 等国内领先模型。
6. ✅ **Playbook 触发方式**：通过 Outgoing Webhook，由数字员工调用 Playbooks API 创建 run/协作频道。
7. ✅ **失败兜底机制**：在频道内 @人工客服 并发送私信兜底。
8. ✅ **数字员工在线状态与品牌展示**：需要为每个「龙小*」角色配置自定义头像、显示名称、在线状态，强化 IP 形象。

---
*PM 确认时请添加 `<!-- status: approved -->` 或 `[x] PM 已确认需求`。*
