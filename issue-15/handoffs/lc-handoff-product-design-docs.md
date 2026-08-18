# Handoff · Issue #15 product-design-docs

> 生成时间：2026-08-18  
> 当前阶段：`product-design-docs`  
> 状态：需求草案、设计大纲、演示剧本与可视化原型已产出；`clarify` 与 `product-design-docs` 的 `human_gate` 均待人类 PM 确认  
> 交接目标：为在新窗口继续工作的 Agent 提供 Issue #15 的完整上下文、已产出物清单与下一步建议。

---

## 1. 需求背景

Issue #15 是在 Issue #14 多角色数字员工平台基础上，向 **G2B / B2B 供需撮合** 场景的延伸：

- 政府各部门与每一家企业都在 Mattermost 组织架构中，并都在 `Town Square` 公共频道中。
- 每家企业/部门拥有自己的人类成员和 agent。
- 企业 agent 在 `Town Square` 发布结构化的供给/需求话题。
- 其他企业 agent 被动接收信息，判断是否有合作意向：
  - 无意向 → 保持静默（不打扰）。
  - 有意向 → 调用 Playbook 创建私密撮合频道，邀请双方企业的人类成员 + 双方 agent。
- 在私密频道内，双方 agent 一次性交换关键信息卡，共同草拟合作方案。
- 方案生成后 mention 双方人类成员，需**双方都确认通过**才可成单。
- 成单后自动生成订单/合作协议，并同步到 Teable。

本期 MVP 聚焦 B2B 供需撮合闭环；G2B 监管/审批作为 P1 预留扩展点。

---

## 2. 已产出的核心假设（待 PM 确认）

1. **发布权限**：企业 agent 经人类成员预授权后，可在 Town Square 发布供需话题。
2. **匹配机制**：基于规则（行业/能力/地域/预算区间）+ LLM 摘要，5 秒内输出意向/静默。
3. **建群权限**：有意向的 agent 可直接调用 Playbooks API 建群，无需每次人类确认。
4. **信息边界**：公共广场只展示脱敏/结构化信息；敏感字段（精确价格、联系方式）只在私密频道披露。
5. **HITL 硬规则**：方案确认与成单必须双方人类成员都点击「确认通过」。
6. **订单形态**：成单后生成结构化订单记录并同步 Teable，法律效力本期不深入。
7. **多方意向**：同一需求被多家企业同时匹配时，各自独立建私密频道并行撮合，互不可见。

---

## 3. 已产出文档

### 3.1 Intake / Clarify（阶段：`clarify`，待确认）

- `issue-15/interviews/2026-08-18-issue-15/metadata.json`
- `issue-15/interviews/2026-08-18-issue-15/transcript.md`（基于场景文本的合成转写）
- `issue-15/interviews/2026-08-18-issue-15/summary.md`
- `issue-15/interviews/2026-08-18-issue-15/raw-insights.md`
- `issue-15/requirements/2026-08-18-issue-15/requirements.md`
- `issue-15/requirements/2026-08-18-issue-15/user-stories.md`（8 条用户故事）
- `issue-15/requirements/2026-08-18-issue-15/prd.md`
- `issue-15/requirements/2026-08-18-issue-15/clarification-questions.md`（15 个待澄清问题）

### 3.2 Product Design Docs（阶段：`product-design-docs`，待确认）

- `issue-15/designs/issue-15/agent-exchange-plaza-outline.md`
  - 信息架构与频道地图
  - 8 个视图清单与优先级
  - 关键页面/组件列表
  - 主流程 + 8 条异常分支
  - 6 个数据实体字段表（供需话题、意向匹配、撮合频道、关键信息卡、合作方案、订单）
  - Agent 编排规则与 mention 协议
  - 待 PM 确认的 4 项关键决策

- `issue-15/designs/issue-15/demo-script.md`
  - 主线案例：工信局采购 1000 套物联网传感器 × 智联传感供应
  - 6 张角色卡（触发条件、行为、样例消息）
  - 6 幕分镜时序表（对应 6 个原型页）
  - 3 个 HITL 硬节点 + 5 条兜底分支话术
  - 原型点击顺序与演示检查清单

### 3.3 可视化原型（EAIC 风格，自包含 HTML）

- `issue-15/pages/prototypes/overview.html` — 原型总览与角色图例
- `issue-15/pages/prototypes/town-square.html` — 广场供需发布
- `issue-15/pages/prototypes/match-intent.html` — 意向匹配
- `issue-15/pages/prototypes/group-creation.html` — Playbook 建群
- `issue-15/pages/prototypes/private-channel.html` — 信息交换与方案草拟
- `issue-15/pages/prototypes/hitl-confirm.html` — 双人 HITL 确认
- `issue-15/pages/prototypes/order-generated.html` — 成单与 Teable 同步

### 3.4 Lincoln 门户

- `issue-15/index.html`
- `issue-15/assets/style.css`
- `issue-15/assets/app.js`
- `issue-15/assets/js/package-data.js`

---

## 4. 关键业务规则摘要

| 规则 | 内容 |
|------|------|
| 发布规则 | 只有企业 agent 可发布；公共广场不得展示精确价格和联系方式 |
| 触达规则 | 所有 agent 默认收到消息；无意向必须静默 |
| 建群规则 | 有意向 agent 调用 Playbooks API；频道成员 = 双方 agent + 双方人类成员 |
| 信息交换规则 | 双方各发一张关键信息卡，一次性披露 |
| HITL 规则 | 方案必须 @双方人类成员；双方都确认通过才允许成单 |
| 订单规则 | 成单后自动生成订单并写入 Teable |
| 兜底规则 | 私信 + Webhook 双通道保证人类收到通知；超时 30min 提醒 / 24h 升级 / 7 天归档 |

---

## 5. 继承自 Issue #14 的底座

- 每个 agent 是独立 Mattermost Bot 账号，拥有独立 Token。
- 使用 Mattermost Posts API + `root_id` 保持 Thread 上下文。
- 使用 Playbooks Plugin API 创建协作频道。
- 使用 OpenClaw skill / memory / router 编排 agent。
- 使用 Teable 作为结构化数据/订单同步目标。
- HITL 确认不可跳过。

---

## 6. 仍待 PM 确认的关键问题

详见 `issue-15/requirements/2026-08-18-issue-15/clarification-questions.md`，重点包括：

1. 供需话题的字段模板与必填项。
2. 意向判断是纯规则、纯 LLM，还是规则 + LLM 摘要？
3. 建群前是否需要人类成员二次授权？
4. 公共广场与私密频道的信息边界具体如何划分？
5. 成单后的「订单」是什么形态？是否具备法律效力？
6. 政府部门在流程中只是普通参与方，还是监管/审批方？
7. MVP 应优先 A/B/C 中哪一种闭环？（A. 手动建群 / B. 半自动 / C. 全自动）

---

## 7. 下一步建议

接手 Agent 在新窗口工作后，建议按以下顺序推进：

1. **确认 clarify gate**：
   - 与 PM 逐条确认 `clarification-questions.md`。
   - 根据确认结果修订 `requirements.md`、`user-stories.md`、`prd.md`。
   - 获得 PM 显式确认后，调用 `scripts/stage_loader.py --stage clarify --action approve-gate`。

2. **确认 product-design-docs gate**：
   - 根据 PM 的回答修订 `agent-exchange-plaza-outline.md` 和 `demo-script.md`。
   - 必要时更新原型页面（字段、交互、异常分支）。
   - 获得 PM 显式确认后，调用 `scripts/stage_loader.py --stage product-design-docs --action approve-gate`。

3. **进入实现阶段**：
   - 若下一阶段是 `product-prototype` 或 `openspec`，按 `workflow-stage.yaml` 的 `next_stage` 继续。
   - 建议先产出 OpenSpec 变更提案或 TDD 研发计划，再进入编码。

---

## 8. 快速访问链接

- GitHub Issue #15：https://github.com/sushanglewis/WeLink/issues/15
- Issue #14 交接文档：`issue-14/handoffs/lc-handoff-product-design-docs.md`
- Issue #14 PRD：`issue-14/requirements/2026-08-15-issue-14/prd.md`
- 当前分支：`issue-15`
- 门户入口：`issue-15/index.html`

---

## 9. 交接检查清单

- [x] Issue #15 工作包已初始化
- [x] Intake / Clarify 产物已产出
- [x] Product Design Docs（大纲 + 剧本）已产出
- [x] 7 个 HTML 原型已产出
- [x] Lincoln 门户已配置
- [x] 已推送远程分支 `origin/issue-15`
- [ ] `clarify` human_gate 待 PM 确认
- [ ] `product-design-docs` human_gate 待 PM 确认
- [ ] 下一阶段（实现/OpenSpec）待进入

---

*本 handoff 文档由 Lincoln `lc-handoff` 流程生成。下一 Agent 应首先阅读本文档，然后与 PM 确认澄清问题，再决定是否需要修订设计或直接进入实现。*
