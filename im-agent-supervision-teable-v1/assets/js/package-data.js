/* im-agent-supervision-teable-v1 · 门户导航数据（定版）
 * 信息架构：01 PRD → 02 龙小督台账（设计说明 + 17 屏角色原型）→ 03 桌面壳 → 04 GUI 看板。
 * 每条注解 ≤3 句；中间稿见旧包 im-agent-supervision-teable-next。 */
window.LINC_PACKAGE = {
  "process_slug": "im-agent-supervision-teable-v1",
  "issue_number": "",
  "current_stage": "product-design-docs",
  "status": "in_progress",
  "generated_at": "2026-09-15T02:00:00Z",
  "landing": "01-prd/overview.html",
  "nav": [
    {
      "group": "01 · PRD 需求",
      "items": [
        {
          "path": "01-prd/overview.html",
          "label": "整体需求概括",
          "title": "PRD · 整体需求概括",
          "group": "01 · PRD 需求",
          "stage": "clarify",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "需求基线：两大目标（GUI 看板 + 龙小督台账）、版本规划（1.3.1）与 10 条核心口径（双字段状态机、批次 DDL 默认 36h、提交即审核、导出即归档、无催办按钮等）。研发从这里开始读。",
          "refs": ["01-prd/sections.html", "01-prd/requirements.html", "../im-agent-supervision-teable-next/requirements/2026-09-07-supervision-gui-form/prd.md"]
        },
        {
          "path": "01-prd/sections.html",
          "label": "需求板块",
          "title": "PRD · 需求板块",
          "group": "01 · PRD 需求",
          "stage": "clarify",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "四大板块范围与编号约定：GUI-xx 看板 / FORM-xx 台账 / SHELL-xx 桌面壳 / AGT-xx 龙小督交互，附板块间数据流图。逐条功能描述见需求列表。",
          "refs": ["01-prd/requirements.html"]
        },
        {
          "path": "01-prd/requirements.html",
          "label": "需求列表（含决策附录）",
          "title": "PRD · 需求列表",
          "group": "01 · PRD 需求",
          "stage": "clarify",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "验收对账清单：GUI-01~08 / FORM-01~23 / SHELL-01~03 / AGT-01~13 逐条描述 + 非功能需求 + 发布标准 + D-1~D-31 决策附录。",
          "refs": ["01-prd/overview.html"]
        }
      ]
    },
    {
      "group": "02 · 台账 · 设计说明",
      "items": [
        {
          "path": "02-ledger/state-machine.html",
          "label": "状态机说明",
          "title": "督办事项状态机说明",
          "group": "02 · 台账 · 设计说明",
          "stage": "product-design-docs",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "唯一生命周期口径：三字段独立互不迁移（D-37）——事项状态=主表字段（风险/逾期仅通知督办人）× 事项跟进状态=跟进记录表字段（1-1 跟进记录明细）× 节点状态=跟进记录表独立字段（7 值含归档，提交即审核、逐级通知、越级代提，D-38）；逾期未填报记录不回推进中、下轮新建（D-41）。",
          "refs": ["02-ledger/role-scenarios.html", "../im-agent-supervision-teable-next/designs/im-agent-supervision-teable/state-machine.md"]
        },
        {
          "path": "02-ledger/role-scenarios.html",
          "label": "角色细分 · 场景闭环（操作映射表）",
          "title": "角色细分、场景闭环与操作映射",
          "group": "02 · 台账 · 设计说明",
          "stage": "product-design-docs",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "4 角色 × 7 事项状态操作映射矩阵（附件《事项状态-不同角色操作映射表》定稿）+ 场景闭环与 17 屏原型逐步对照。",
          "refs": ["02-ledger/state-machine.html", "../im-agent-supervision-teable-next/designs/im-agent-supervision-teable/role-scenarios.md"]
        },
        {
          "path": "02-ledger/submission-sequences.html",
          "label": "提交流转与越级代提（序列图）",
          "title": "提交流转与越级代提 · 序列图说明",
          "group": "02 · 台账 · 设计说明",
          "stage": "product-design-docs",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "D-39 复杂场景细致序列图：正常逐级提交-审核链、提交即审核通用写入机制、三角色越级代提（督办人直提→归档 / 经办人代提→待督办人提交 / 转办人代提→待经办人提交，含预填/润色/校验/直迁/并行通知/权限收敛）与直迁规则速查表。",
          "refs": ["02-ledger/state-machine.html", "02-ledger/role-scenarios.html"]
        },
        {
          "path": "02-ledger/notification-messages.html",
          "label": "消息通知文案（场景 × 触发 × 收件人 × 变量）",
          "title": "龙小督消息通知文案",
          "group": "02 · 台账 · 设计说明",
          "stage": "product-design-docs",
          "version": "v1.0-final",
          "status": "draft",
          "purpose": "龙小督 IM 通知文案唯一口径（09-18 修订）：7 类场景标准文案（新增/转办待办/催促·临期/催促·逾期/导入/DDL 到达/各级提交）+ 变量字典；文案为可直接开发的最终模板（来源与操作自然语句内嵌，不做变量拼接）：单事项消息随附事项编号+交办内容+上次反馈三要素，经办人多条待办最多列 3 条，句式区分督办交办/转办给你/已提交；含频控与逐级不跨级规则；临期/逾期措辞与督办人跟进版均已 PM 定稿（内容已定稿，gate 未过，待审批）。",
          "refs": ["02-ledger/state-machine.html", "02-ledger/role-scenarios.html"]
        },
        {
          "path": "02-ledger/chat-list-badge.html",
          "label": "聊天列表提醒改造（待处理督办事项标签）",
          "title": "龙小督聊天列表提醒改造",
          "group": "02 · 台账 · 设计说明",
          "stage": "product-prototype",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "会话列表原型：龙小督会话行督办待办徽标（D-41）——仅一种形态「待处理事项 N」，N=当前节点归属人=该用户的未归档记录数（流转到他头上等待处理），不做未读红点，所有人可见，N=0 不显示。?role= 切换角色。",
          "refs": ["01-prd/requirements.html"]
        }
      ]
    },
    {
      "group": "02 · 台账原型 · 督办人（S1~S5）",
      "items": [
        {
          "path": "02-ledger/prototype/ledger-db-01.html",
          "label": "督办人 · 批次查收与归档（5 屏）",
          "title": "龙小督台账 · 督办人 王督办",
          "group": "02 · 台账原型 · 督办人（S1~S5）",
          "stage": "product-prototype",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "督办人场景闭环：DDL 到达查收 → 直接修改/改评留痕 → 导出 Excel 归档本批 → 逾期未填报查收（无催办按钮，直接修改/代录补正）→ 全量批次浏览。右侧切换 5 个场景。",
          "refs": ["02-ledger/state-machine.html", "02-ledger/role-scenarios.html"],
          "cases": [
            {"label": "S1 批次 DDL 到达 · 查收", "path": "02-ledger/prototype/ledger-db-01.html", "desc": "到达批次 DDL，龙小督推送查收通知；台账按 批次>事项>详情 三级展示本批填报情况，已填报项可点开回看。"},
            {"label": "S2 直接修改 · 改评留痕", "path": "02-ledger/prototype/ledger-db-02.html", "desc": "查收中直接编辑已填报内容、进度评价改评；修改/润色在自己看板为暂存，点提交才存档（记录人=督办人）。"},
            {"label": "S3 导出 Excel · 归档本批", "path": "02-ledger/prototype/ledger-db-03.html", "desc": "批次卡片「导出 Excel」（按批导出）；仅当批内全部跟进记录=已填报时入口可用（否则置灰，直接修改/代录补正后再导）；导出后本轮关闭：该批次全部跟进记录变更为已归档（终态，D-43），节点=归档（D-38）。"},
            {"label": "S4 逾期未填报 · 查收视图", "path": "02-ledger/prototype/ledger-db-04.html", "desc": "逾期未填报项红标列出；无催办按钮，督办人直接修改/代录补正后提交。"},
            {"label": "S5 全量批次浏览 · 节点全貌", "path": "02-ledger/prototype/ledger-db-05.html", "desc": "全量批次按督办日期近→远浏览；每事项展示节点状态+归属人+「已转办」角标。"}
          ]
        }
      ]
    },
    {
      "group": "02 · 台账原型 · 经办人（S1~S6）",
      "items": [
        {
          "path": "02-ledger/prototype/ledger-jb-01.html",
          "label": "经办人 · 接收填报与转办（6 屏）",
          "title": "龙小督台账 · 经办人 詹少鹏",
          "group": "02 · 台账原型 · 经办人（S1~S6）",
          "stage": "product-prototype",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "经办人场景闭环：新批次待办 → 暂存/润色 → 转办 → 审核再上报（提交即审核）→ 必填校验 → 逾期未填报加急预警（批次DDL口径；事项级风险/逾期仅通知督办人、只在看板标红，不进台账，D-44）。右侧切换 6 个场景。",
          "refs": ["02-ledger/state-machine.html", "02-ledger/role-scenarios.html"],
          "cases": [
            {"label": "S1 新批次待办 · 开始填报", "path": "02-ledger/prototype/ledger-jb-01.html", "desc": "收「N 项 + 批次 DDL」通知；台账默认展开，k/N 导航从第 1 项开始，预填上次进展。"},
            {"label": "S2 填报中 · 暂存与润色", "path": "02-ledger/prototype/ledger-jb-02.html", "desc": "五要素逐条填写；支持暂存续填与龙小督润色（弹窗确认后替换、可撤销）。"},
            {"label": "S3 转办给转办人", "path": "02-ledger/prototype/ledger-jb-03.html", "desc": "当前项转办：弹窗选人（搜索+单选唯一）；经办人保留只读可见，转办人收同款表单。"},
            {"label": "S4 审核 · 再上报", "path": "02-ledger/prototype/ledger-jb-04.html", "desc": "收转办人提交通知；查看内容后提交——提交即审核、上报督办人。"},
            {"label": "S5 提交 · 必填校验", "path": "02-ledger/prototype/ledger-jb-05.html", "desc": "空项报错「{任务编号} {字段名}不能为空」；提交后该项只读存档 + 提交存档消息可回看。"},
            {"label": "S6 逾期未填报 · 加急预警", "path": "02-ledger/prototype/ledger-jb-06.html", "desc": "批次 DDL 过点未填报→逾期未填报：台账表单加急（角标/标红），通知经办人+督办人，不生成新表单；提交不受影响。事项级风险/逾期不进台账（D-44）。"}
          ]
        }
      ]
    },
    {
      "group": "02 · 台账原型 · 转办人（S1~S4）",
      "items": [
        {
          "path": "02-ledger/prototype/ledger-zb-01.html",
          "label": "转办人 · 收办填报与再转（4 屏）",
          "title": "龙小督台账 · 转办人 李良龙",
          "group": "02 · 台账原型 · 转办人（S1~S4）",
          "stage": "product-prototype",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "转办人场景闭环：收转办待办 → 填报提交上报经办人 → 再转次级转办人 → 审核次转提交再上报。右侧切换 4 个场景。",
          "refs": ["02-ledger/state-machine.html", "02-ledger/role-scenarios.html"],
          "cases": [
            {"label": "S1 收转办待办", "path": "02-ledger/prototype/ledger-zb-01.html", "desc": "经办人转办后收同款表单与待办通知；消息列表徽标 +1。"},
            {"label": "S2 填报提交 · 上报经办人审核", "path": "02-ledger/prototype/ledger-zb-02.html", "desc": "填报五要素提交；记录人=实际填报人；经办人收提交通知。"},
            {"label": "S3 再转次级转办人", "path": "02-ledger/prototype/ledger-zb-03.html", "desc": "可再转次级转办人（弹窗选人）；次级转办人为链路终点。"},
            {"label": "S4 审核次转提交 · 再上报", "path": "02-ledger/prototype/ledger-zb-04.html", "desc": "收次转提交通知；查看内容后提交上报经办人（提交即审核）。"}
          ]
        }
      ]
    },
    {
      "group": "02 · 台账原型 · 次级转办人（S1~S2）",
      "items": [
        {
          "path": "02-ledger/prototype/ledger-czb-01.html",
          "label": "次级转办人 · 链路终点填报（2 屏）",
          "title": "龙小督台账 · 次级转办人 王强",
          "group": "02 · 台账原型 · 次级转办人（S1~S2）",
          "stage": "product-prototype",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "次级转办人（链路终点，无转办按钮）场景闭环：收再转待办 → 填报提交上报转办人。右侧切换 2 个场景。",
          "refs": ["02-ledger/state-machine.html", "02-ledger/role-scenarios.html"],
          "cases": [
            {"label": "S1 收再转待办 · 链路终点", "path": "02-ledger/prototype/ledger-czb-01.html", "desc": "转办人再转后收待办；按钮仅 暂存/提交/润色，无转办。"},
            {"label": "S2 填报提交 · 上报转办人审核", "path": "02-ledger/prototype/ledger-czb-02.html", "desc": "填报五要素提交；转办人收提交通知（提交即审核）。"}
          ]
        }
      ]
    },
    {
      "group": "03 · 桌面壳改造",
      "items": [
        {
          "path": "03-desktop-shell/prototype.html",
          "label": "桌面壳四态布局原型图",
          "title": "桌面壳改造 · 右侧 panel 插件四态",
          "group": "03 · 桌面壳改造",
          "stage": "product-prototype",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "四态线框（对齐 2026-09 桌面壳示意 PDF）：① 插件面板右栏展开（480px 可拖拽）② 收起为 26px 窄条 ③ 全幅专注填报 ④ 无对话列表。对应 SHELL-01~03 + FORM-18。",
          "refs": ["01-prd/requirements.html"]
        }
      ]
    },
    {
      "group": "04 · GUI 看板",
      "items": [
        {
          "path": "04-gui-dashboard/prototype/index.html",
          "label": "事项看板原型（EAIC 壳内）",
          "title": "督办事项看板 · GUI 只读总览",
          "group": "04 · GUI 看板",
          "stage": "product-prototype",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "领导/督办人只读看板：5 指标卡（主表口径 D-43：总数/正常/风险/逾期/完结）+ 组合筛选/表头排序 + 行点击下钻跟进时间线 + 分页；零写操作入口。?role= 切换视角。",
          "refs": ["04-gui-dashboard/metrics-dictionary.html", "../im-agent-supervision-teable-next/designs/im-agent-supervision-teable/gui-dashboard-spec.md"],
          "cases": [
            {"label": "领导 / 督办人 · 全量", "query": "?role=leader", "desc": "5 指标卡（主表口径）按全量统计；筛选/排序/分页演示；点击行下钻跟进记录时间线（每次填报五要素）。"},
            {"label": "经办人 · 仅本人", "query": "?role=jb", "desc": "指标按身份过滤后实时重算；事项状态列着色，逾期红边条/风险橙边条。"},
            {"label": "转办人视角", "query": "?role=zb", "desc": "仅本人相关事项。"},
            {"label": "聊天列表徽标", "query": "?view=chat&role=jb", "desc": "龙小督会话行督办待办徽标（D-41）：仅一种形态「待处理事项 N」= 当前节点归属人=该用户的未归档记录数（流转到他头上等待处理），不做未读红点。"}
          ]
        },
        {
          "path": "04-gui-dashboard/metrics-dictionary.html",
          "label": "指标口径说明",
          "title": "GUI 看板指标口径说明",
          "group": "04 · GUI 看板",
          "stage": "product-design-docs",
          "version": "v1.0-final",
          "status": "final",
          "purpose": "5 指标卡（主表口径 D-43）+ 主表明细列清单的业务/技术双口径；mock 数据对照演算；待复核项（明细列与 D-26 对账、空截止时间）。",
          "refs": ["04-gui-dashboard/prototype/index.html", "../im-agent-supervision-teable-next/designs/im-agent-supervision-teable/metrics-dictionary.md"]
        }
      ]
    }
  ]
};
