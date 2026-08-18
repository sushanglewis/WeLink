# Handoff · Issue #14 product-design-docs → Issue #15 新场景

> 生成时间：2026-08-18  
> 当前阶段：`product-design-docs`  
> 状态：原型已产出，阶段 `human_gate` 待人类 PM 确认  
> 交接目标：为接手 Issue #15（G2B/B2B Agent 交流广场）的 Agent 提供 Issue #14 的全部上下文与可复用资产。

---

## 1. Issue #14 已确认的核心需求

Issue #14 的目标是为 WeLink 产品运营团队构建一套基于 OpenClaw 的多角色数字员工平台，统一以「龙小*」IP 嵌入 Mattermost 组织架构：

- **对外**：客服数字员工 `龙小客` 在客服频道响应常见客服问题、能力介绍、工单状态查询。
- **对内**：`龙小产`（需求澄清）、`龙小研`（方案研究）、`龙小构`（架构评审）在 Playbook 创建的协作频道内按 SOP 接力完成 issue 分析，关键节点由人类确认后生成 GitHub issue 并同步 Teable。

已批准的 PRD 明确以下关键机制：

| 机制 | 结论 |
|------|------|
| Agent 身份 | 每个 agent 是独立 Mattermost Bot 账号，拥有独立 Token、头像、显示名、在线状态 |
| Thread 上下文 | 同一 issue 的讨论在同一个 Mattermost thread 内进行，回复携带 `root_id` |
| Mention 协议 | 使用标准 `@username`；agent 只能 mention 已获取 username 的成员 |
| 升级触发 | 龙小客通过 Outgoing Webhook 调用 Playbooks API 创建协作频道 |
| HITL 节点 | 需求确认前、方案评审前、issue 创建前必须 mention 人类 PM/架构师 |
| Teable skills | 现有 `teableio/agent-skills` 可直接被 OpenClaw agent 调用 |
| LLM | 倾向使用 kimi 3 等国内领先模型，支持私有化部署 |

---

## 2. 可直接复用的产物

### 2.1 已批准的 Markdown 源文档（human-pm 确认）

- `issue-14/requirements/2026-08-15-issue-14/requirements.md`
- `issue-14/requirements/2026-08-15-issue-14/user-stories.md`
- `issue-14/requirements/2026-08-15-issue-14/prd.md`

### 2.2 HTML 门户与文档

- `issue-14/index.html` — Lincoln Issue Package 门户
- `issue-14/pages/docs/requirements.html`
- `issue-14/pages/docs/user-stories.html`
- `issue-14/pages/docs/prd.html`
- `issue-14/pages/docs/snapshots/prd-v1.0.html`

### 2.3 集成研究

- `issue-14/docs/research/integration-research.md` — Mattermost Thread/Member/Mention/Playbook API、OpenClaw skill/memory/routing、Teable API 的调研结论与风险。

### 2.4 可视化原型（EAIC 风格）

- `issue-14/pages/prototypes/overview.html` — 原型总览
- `issue-14/pages/prototypes/group-creation.html` — Playbook 建群
- `issue-14/pages/prototypes/clarification.html` — 需求澄清
- `issue-14/pages/prototypes/hitl-confirm.html` — 人类确认
- `issue-14/pages/prototypes/agent-collab.html` — 多 agent 接力协作

视觉风格参考路径：

```
/Users/stylesu/Documents/产品/EAIC原型/
├── assets/css/tokens.css
├── assets/css/base.css
├── assets/css/app.css
└── assets/js/components.js
```

---

## 3. 关键设计决策（已确认）

1. **多角色按 SOP 接力，而非自由对话**。每个角色有明确阶段边界，通过 mention 触发下一步。
2. **Playbook 是协作频道的创建者**。agent 不直接建群，而是调用 Playbooks API 触发 run，由 Playbook 统一拉入成员。
3. **Teable 是持久化/结构化数据的唯一来源**。需求、issue、状态均同步到 Teable。
4. **HITL 是不可跳过的硬规则**。任何生成动作（issue 创建、关键方案确认）前必须让人类成员收到 mention 并显式确认。
5. **Agent 身份与权限最小化**。每个 bot 独立 token，按角色分配 API key。

---

## 4. 仍开放的工程问题

- OpenClaw 的具体 skill/memory/routing 机制需在实现阶段拉源码验证。
- Mattermost bot mention 不触发通知时的兜底路径（私信/Webhook/Playbook 成员邀请）需在设计阶段细化。
- 多角色 memory 隔离与共享边界需在设计阶段明确。
- LLM 私有化部署方案与成本模型未定。

---

## 5. 向 Issue #15 过渡：G2B/B2B Agent 交流广场

### 5.1 新场景描述

在现有 Mattermost + OpenClaw + Teable 底座上，扩展为 **G2B / B2B 供需撮合场景**：

- 政府各部门、每一家企业都在 Mattermost 组织架构中，并都在 `Town Square` 公共频道中。
- 每家企业/部门拥有自己的人类成员和 agent。
- **企业 agent** 在 `Town Square` 发布本企业的供给或需求信息（以话题/帖子形式）。
- 其他 agent 默认收到消息，判断是否有合作意向：
  - 无意向 → 保持静默。
  - 有意向 → 主动拉群（将该企业的人类成员 + 目标企业的人类成员 + 双方合作意向 agent 加入新频道）。
- 建群后，双方 agent 一次性交换关键信息（供/需详情、合作方式、约束条件）。
- 双方 agent 共同草拟合作方案，并 mention 双方人类成员进行 HITL 确认。
- 人类确认后，生成订单/合作协议，并同步到 Teable。

### 5.2 初步方案（来自 PM）

1. **供需信息发布**：agent 直接将供给、需求信息以话题方式在 `Town Square` 发布。
2. **供需信息触达**：其他 agent 默认收到消息；无需回复则静默；有意向则拉群。
3. **交换信息、撮合**：建群 agent 将关键信息一次性提供给对方 agent；对方 agent 也一次性披露重要信息；双方 agent 共同草拟合作方案，并 mention 双方人类成员 HITL 确认。
4. **成交**：人类确认后生成订单。

### 5.3 对 Issue #15 的期望产出

接手 Agent 需要：

1. 初始化 `issue-15` 工作包（`scripts/init-lincoln-branch.sh --issue-number 15`）。
2. 基于上述场景向人类 PM 提出澄清问题（Johari 象限），明确范围、角色、编排规则、隐私/权限、成交机制。
3. 产出 **Agent 交流广场的大纲**（面向前端/UI 开发）：
   - 信息架构与页面地图
   - 关键页面与组件
   - 交互规则与异常分支
4. 产出 **演示剧本规划**：
   - 角色卡（每个 agent 的触发条件、行为、台词/消息模板）
   - 分镜/时序（从信息发布到成单的完整演示流程）
   - HITL 节点与兜底方案
5. 绘制可视化 HTML 原型（沿用 EAIC 风格）：
   - `Town Square` 供需信息发布页
   - Agent 意向匹配/建群页
   - 撮合频道信息交换页
   - HITL 确认页
   - 成单/订单生成页

---

## 6. 可直接继承的约束

- 继续使用 Mattermost Bot Account + Posts API + Playbooks API。
- 继续使用 OpenClaw skill/memory/routing 作为 agent 底座。
- 继续使用 Teable 作为结构化数据/订单同步目标。
- HITL 节点不可跳过。
- 每个 agent/角色独立 Token，权限最小化。
- 视觉风格沿用 `/Users/stylesu/Documents/产品/EAIC原型/`。

---

## 7. 交接检查清单

- [x] Issue #14 需求、PRD、用户故事已批准
- [x] Issue #14 集成研究已完成
- [x] Issue #14 HTML 门户与原型已产出
- [x] Issue #14 已推送远程分支 `origin/issue-14`
- [ ] Issue #14 `product-design-docs` 阶段 gate 需人类 PM 最终确认（当前为待确认状态）
- [ ] Issue #15 工作包待初始化
- [ ] Issue #15 澄清问题待提出并确认
- [ ] Issue #15 大纲、剧本、原型待产出

---

*本 handoff 文档由 Lincoln `lc-handoff` 流程生成。下一阶段（issue-15）的 Agent 应首先阅读本文档，然后初始化 issue-15 工作包并执行 intake/clarify。*
