# im-agent-supervision-teable-v1 · 定版交付包

IM 督办（龙小督台账 + GUI 看板 + 桌面壳改造）最终定版方案与原型，供研发直接开工。
由 `im-agent-supervision-teable-next`（草稿工作包，原样保留）抽取定稿产物重组而成。

## 打开方式

直接双击 `index.html`（门户，file:// 可用），或 `python3 -m http.server` 后访问 `/im-agent-supervision-teable-v1/`。

## 阅读顺序（研发导读）

1. **01-prd/** — 整体需求概括（核心口径 10 条）→ 需求板块 → 需求列表（GUI/FORM/SHELL/AGT 逐条 + D-1~D-31 决策附录）。
2. **02-ledger/** — 龙小督台账：状态机说明 → 角色细分·场景闭环（操作映射矩阵）→ 17 屏角色原型（督办 5 / 经办 6 / 转办 4 / 次级转办 2，门户右侧切换场景）→ 聊天列表徽标原型。
3. **03-desktop-shell/prototype.html** — 桌面壳四态布局线框（插件面板展开/收起/全幅/无对话列表）。
4. **04-gui-dashboard/** — 事项看板原型（?role= 切换视角）+ 指标口径说明。

## 约定

- 文档以 `.md` 为准；同名 `.html` 由 `tools/build_doc_pages.py` 生成（内嵌 md 源码，file:// 直开）。
- 每条门户导航注解 ≤3 句；详细推导与中间稿（agent-scenario-script、embed-form-spec、research、upstream 等）回旧包 `im-agent-supervision-teable-next/` 查阅。
- `designs/im-agent-supervision-teable/` 为工作流模板约定的评审索引（design-review/scenarios/feature-catalog/data-model/flows/feasibility），指向四节结构的实际内容。
- 工作流绑定 interview-to-knowledge 的 **product-design-docs** 阶段：设计评审 human_gate 通过（`scripts/stage_loader.py --stage product-design-docs --action approve-gate --approved-by <姓名>`）后才可进入 product-prototype 与后续 TDD 研发计划。

## 核心口径速记

双字段状态机（事项状态×事项跟进状态，完全独立）· 事项跟进状态 4 值：推进中/已填报/逾期未填报/已归档，批内全部跟进记录=已填报方可导出批次 Excel、导出后全批转已归档（D-43），「在库」为派生概念非字段值 · 批次-事项 M:N，事项级风险/逾期只在看板标红、不进台账（D-44） · GUI 看板指标仅主表口径 5 卡（总数/正常/风险/逾期/完结，D-43）· 任务下发双通道（Excel / 口头编号仅限在库事项，D-32）· 批次 DDL 默认 36h · 提交即审核（无审核按钮）· 逐级通知不跨级、上级可越级代提 · 台账可见性：只见与自己有关、仅改节点在自己头上的事项（D-34）· 督办人无催办按钮、逾期仍可填报（D-33）· 转办最多三级 · 徽标单一形态「待处理事项 N」、无未读红点（D-41）· 事项详情展示责任链路 督办人→经办人→（转办人→次级转办人），无则不显示（D-40）· 界面只用业务话术（D-31）。
