# 设计评审: issue-12

<!-- status: draft -->

## 决策摘要

Issue-12 的核心问题是：**WeLink 是否应该在现有"数字员工 + Teable"路线之外，再做一个独立的 AI 工作台？**

经过竞品研究和 PM 讨论，设计决策如下：

- **短期（未来 3-6 个月）**：明确不走独立 AI 工作台路线，坚持"统一数字员工 + Teable 中介平台"方向。
- **短期目标**：补齐人-机协同系统，优先 **P0 企业知识库 + 技能分发**，其次 **P1 协作文档、协作日程、协作会议**。
- **长期（6-12 个月以后）**：保留观察窗口。当企业知识库和技能分发成熟后，如确有"多 Agent 编排"需求，可以"开发者后台/高级模式"形式引入 AI 工作台能力，但不对普通用户暴露独立入口。

## 设计范围

本设计覆盖 issue-12 短期阶段的产品架构、能力优先级、开源方案选型和关键流程，为后续 product-prototype 和 TDD 研发计划提供输入。

## 参考文档

- 需求文档：`issue-12/requirements/2026-07-20-issue-12/requirements.md`
- 用户故事：`issue-12/requirements/2026-07-20-issue-12/user-stories.md`
- PRD：`issue-12/requirements/2026-07-20-issue-12/prd.md`
- 竞品研究：`issue-12/docs/research/ai-in-im-competitive-analysis.md`
- 开源方案研究：`issue-12/docs/research/human-machine-collaboration-oss-options.md`

## 关键设计假设

1. 数字员工是组织内统一的 AI 入口，用户通过 IM 与数字员工交互。
2. Teable 是人-机协作的默认中介平台，用于状态同步、结果交付和任务协作。
3. 企业知识库是数字员工的"工作记忆"来源，没有它 AI 无法理解组织上下文。
4. 技能分发是数字员工从 demo 走向规模化部署的前提。
5. 短期不引入独立 AI 工作台，避免与现有产品理念冲突。

## 开放问题

1. 企业知识库最终选择 BookStack（MIT，低风险）还是 Wiki.js（功能强，需评估 AGPL）？
2. 技能分发/Agent 平台最终选择 Dify（功能强，需授权）还是 Coze Studio（License 干净，技术栈不同）？
3. 协作文档是否采购 OnlyOffice 商业版以获得更宽松的集成许可？
4. 数字员工的"工作记忆"具体如何实现：实时检索 vs 预构建索引 vs 混合模式？

## 审批清单

- [ ] 决策摘要正确反映了 PM 意图。
- [ ] 短期目标（P0 + P1）合理且可执行。
- [ ] 开源方案选型无重大 License 风险。
- [ ] 关键设计假设可被后续阶段验证。

---
*PM 确认时请添加 `<!-- status: approved -->`。*
