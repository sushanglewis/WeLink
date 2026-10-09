# 设计评审摘要（design-review）

<!-- status: final -->

定版包按四节结构重组（01-prd / 02-ledger / 03-desktop-shell / 04-gui-dashboard），本文件为模板约定产物 design-review 的索引与评审口径。

- 需求基线与核心口径：`../../01-prd/overview.md`（10 条核心口径速记）
- 逐条验收对账：`../../01-prd/requirements.md`（GUI/FORM/SHELL/AGT + D-1~D-31 决策附录）
- 发布标准 checklist：见 `../../01-prd/requirements.md` 末节

## 评审 checklist

- [ ] 核心口径（双字段状态机/批次 DDL/提交即审核/导出即归档/无催办/三级转办/徽标语义）与 PRD 一致
- [ ] 状态机 T1~T8 与节点状态 7 值迁移链完整（`../../02-ledger/state-machine.md`）
- [ ] 操作映射矩阵 4 角色 × 7 状态与附件定稿一致（`../../02-ledger/role-scenarios.md`）
- [ ] 17 屏原型覆盖四角色场景闭环（督办 5 / 经办 6 / 转办 4 / 次转 2）
- [ ] 桌面壳四态与 2026-09 桌面壳示意 PDF 一致（`../../03-desktop-shell/prototype.html`）
- [ ] 5 指标卡（主表口径，D-43）与字典一致（`../../04-gui-dashboard/metrics-dictionary.md`）
