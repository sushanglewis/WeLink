# 可行性说明（feasibility）

<!-- status: final -->

- 结论：技术已确认可落地；状态迁移由 BFF 定时任务 + 龙小督 agent 驱动（非 Teable 自动化硬编码流程）。
- 实现路线调研（Teable + BFF）：见旧包 `../../im-agent-supervision-teable-next/docs/research/gui-route-teable-bff.md` 与 `gui-vs-custom-system.md`、`agent-framework-decision.md`。
- 已知待改造项：C2 催办次数需按字典方案 A（催办记录表）改造后方可计算；截止时间为空的历史数据量实现期跑数确认（`../../04-gui-dashboard/metrics-dictionary.md` §4）。
- 频控与降级：通知频控 D-7；表单加载失败降级链接卡片（FORM-12）。
