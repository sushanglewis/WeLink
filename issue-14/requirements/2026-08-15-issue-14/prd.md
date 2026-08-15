# PRD: 2026-08-15-issue-14

<!-- status: approved -->

## 产品目标

为 WeLink 产品运营团队构建一套基于 OpenClaw 的多角色数字员工平台，统一以「龙小*」IP 嵌入 Mattermost 组织架构，对外提供客服解答、工单响应、能力介绍，对内完成用户需求分析、解决方案研究、方案生成、创建 issue、通知成员等职责，并通过 Mattermost Playbook 实现从用户问题到 issue 的人-机协作 SOP。

本期设计完整多角色平台，但按「客服对外答疑 → 内部需求分析 → 多角色协作」三阶段分步落地。

## 功能需求

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 数字员工身份注册 | 每个数字员工以独立 Mattermost Bot 账号存在，拥有 username、display_name、自定义头像、在线状态，体现「龙小*」IP 形象 | P0 |
| 客服对外答疑 | 龙小客在客服频道响应常见客服问题、能力介绍、工单状态查询 | P0 |
| 智能升级与 Playbook 触发 | 龙小客识别需内部处理的问题，触发 Playbook 创建基于 issue 的协作频道 | P0 |
| 成员发现与 Mention 协议 | agent 能获取频道成员列表，使用标准 `@username` mention 调用其他 agent 或人类成员 | P0 |
| Thread 上下文保持 | agent 在协作频道的 thread 内接力回复，保持 issue 上下文连续 | P0 |
| 需求澄清（龙小产） | 对 issue 进行需求拆解、背景澄清、验收标准定义，并写入 Teable | P1 |
| 方案研究（龙小研） | 基于需求进行开源项目、代码库、解决方案调研，输出方案建议 | P1 |
| 架构评审（龙小构） | 评估方案可行性、与现有架构兼容性，必要时请求人类架构师确认 | P1 |
| Issue 创建与同步 | 协作最终生成 GitHub issue，并同步关键信息到 Teable 表格 | P1 |
| 通知与兜底机制 | bot mention 不触发通知时，通过私信/Webhook/Playbook 成员邀请兜底 | P1 |
| Teable skills 复用 | 现有 teable agent skills 能被 OpenClaw 数字员工直接调用 | P0 |
| 独立身份密钥 | 每个数字员工/角色拥有独立的 API key/Token，权限最小化 | P0 |

## 非功能需求

- **性能**：客服问题首响时间 ≤ 5 秒；Playbook 触发到协作频道创建 ≤ 10 秒。
- **稳定性**：数字员工服务 7×24 可用，崩溃后自动重启；消息处理失败时有重试与告警。
- **安全性**：每个 Bot 使用独立 Token；Teable API key 按角色最小权限分配；不泄露客户敏感信息到公开 issue。
- **可扩展性**：新数字员工角色可通过新增 OpenClaw skill 与配置加入，无需改动核心框架。
- **可观测性**：记录每条数字员工消息的输入、输出、调用 skill、mention 对象，便于审计与调试。
- **国产化/私有化**：OpenClaw 与 LLM 供应商需支持私有化部署；具体模型选型按效果与成本决定，当前倾向使用 kimi 3 等国内领先模型。

## 业务流程图

```
用户问题 → 客服频道
    │
    ▼
┌─────────────┐
│   龙小客    │ ← 初步响应 / FAQ / 能力介绍
└──────┬──────┘
       │
       ├─ 可解决 ──> 直接回复用户
       │
       └─ 需升级 ──> 触发 Playbook 创建协作频道
                          │
                          ▼
                   ┌─────────────┐
                   │   龙小产    │ ← 需求澄清，写入 Teable
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   龙小研    │ ← 方案研究（开源/代码/解决方案）
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   龙小构    │ ← 架构评审
                   └──────┬──────┘
                          │
              ├─ 需要人类确认 ─> mention 人类 PM/架构师
              │                                      │
              ▼                                      ▼
        继续完善方案                         人类确认通过
              │                                      │
              └──────────────┬───────────────────────┘
                             ▼
                      生成 GitHub issue
                             │
                             ▼
                      同步到 Teable
                             │
                             ▼
                      通知相关成员
```

## 业务规则

1. **触发规则**：龙小客在以下情况通过 Outgoing Webhook 调用 Playbooks API 触发 Playbook：
   - 用户明确要求人工/升级；
   - 龙小客置信度低于阈值；
   - 问题类型为 bug/功能需求/工单。
2. **Mention 规则**：
   - 使用标准 `@username` / `@display_name`；
   - agent 只能 mention 已获取到 username 的成员；
   - 人类成员在以下节点必须被 mention：需求确认前、方案评审前、issue 创建前。
3. **权限规则**：
   - 数字员工 Bot 需具备读取频道消息、获取成员列表、发送消息、回复 thread、调用 Playbooks API 的权限；
   - 每个角色使用独立 Teable API key，权限按最小可用原则分配。
4. **上下文规则**：
   - 同一 issue 的所有讨论必须在同一个 Mattermost thread 内进行；
   - agent 在回复时必须携带 `root_id` 以保持 thread 连续性。
5. **Issue 同步规则**：
   - issue 创建后，必须在 Teable 表格中新增对应记录；
   - issue 状态变更时，同步更新 Teable 记录并通知相关成员。

## 关联系统/接口

| 系统 | 接口/能力 | 用途 |
|------|----------|------|
| Mattermost | Bot Account API | 创建与管理数字员工 Bot 账号 |
| Mattermost | `GET /api/v4/channels/{channel_id}/members` | 获取频道成员 username |
| Mattermost | Posts API + `root_id` | 发送消息、回复 thread |
| Mattermost | Playbooks Plugin API `/plugins/playbooks/api/v0/runs` | 创建 playbook run / 协作频道 |
| OpenClaw | Skill / Memory / Router | agent 运行时与多角色编排 |
| Teable | `teableio/agent-skills` | 表格操作与查询能力 |
| Teable | REST API + Webhook | 表格数据读写与事件通知 |
| GitHub | Issues API | 创建与同步 issue |

## 相关产物链接

- GitHub Issue #14：https://github.com/sushanglewis/WeLink/issues/14
- 访谈摘要：`issue-14/interviews/2026-08-15-issue-14/summary.md`
- 访谈转写：`issue-14/interviews/2026-08-15-issue-14/transcript.md`
- 原始洞察：`issue-14/interviews/2026-08-15-issue-14/raw-insights.md`
- 需求文档：`issue-14/requirements/2026-08-15-issue-14/requirements.md`
- 用户故事：`issue-14/requirements/2026-08-15-issue-14/user-stories.md`
- 集成研究：`issue-14/docs/research/integration-research.md`

## 风险与开放问题

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| OpenClaw 具体机制与假设不一致 | 高 | PRD 阶段只定义接口假设；设计阶段拉取源码验证 |
| Mattermost bot mention 不触发通知 | 中 | 设计私信/Webhook/Playbook 成员邀请兜底 |
| Playbook API 创建 run 时忽略现有频道配置 | 中 | 明确 SOP 接受创建新频道，或在创建后做频道迁移 |
| 多角色 memory 隔离与共享边界不清 | 中 | PRD 中定义每个角色的 memory 范围与共享规则；设计阶段细化 |
| Teable API key 权限过大 | 中 | 为每个角色分配最小权限独立 key |
| LLM 私有化部署与成本约束 | 中 | 设计阶段确认 LLM 供应商与部署方案 |
| 用户接受度：数字员工回复不够准确 | 中 | 第一阶段只处理高频 FAQ，保留人工升级通道 |

**已确认问题：**

1. ✅ Playbook 触发方式：Outgoing Webhook，由数字员工调用 Playbooks API。
2. ✅ 失败兜底机制：在频道内 @人工客服 并发送私信兜底。
3. ✅ 数字员工在线状态与品牌展示：需要自定义头像、显示名称、在线状态，强化 IP 形象。
4. ✅ LLM 供应商：无硬性国产化约束，倾向使用 kimi 3 等国内领先模型。
5. ✅ 角色能力边界：本 PRD 中粗粒度定义，产品设计/技术设计阶段再细化。

**剩余开放问题：**

无。所有关键问题已在需求澄清阶段确认，剩余细节进入 `product-design-docs` 阶段细化。

---
*PM 确认时请添加 `<!-- status: approved -->`。*
