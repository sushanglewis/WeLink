window.LINC_PACKAGE = {
  "process_slug": "im-agent-supervision-teable-next",
  "issue_number": "",
  "current_stage": "clarify",
  "status": "in_progress",
  "generated_at": "2026-09-10T08:00:00Z",
  "nav": [
    {
      "group": "需求文档 (2026-09-07)",
      "items": [
        {
          "path": "pages/docs/prd-supervision-gui-form.html",
          "label": "PRD · 督办 GUI 看板与龙小督台账",
          "title": "PRD：督办 GUI 看板与龙小督台账",
          "group": "需求文档 (2026-09-07)",
          "stage": "clarify",
          "version": "v0.19-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "IM 督办需求基线（v0.19 重构版）：只定义业务规则与产品体验，技术方案由研发定义，不做技术决策。结构=产品目标/版本规划/功能需求（GUI-01~08 看板、FORM-01~23 台账、SHELL-01~03 桌面外壳、AGT-01~13 龙小督交互）/非功能需求/发布标准/文末决策记录表（D-1~D-31 全量）。核心口径：双字段状态机（事项状态 4 值×事项跟进状态 4 值，完全独立）；填报载体=龙小督 DM 右侧扩展 panel「龙小督台账」（三级层级 批次>事项>详情，节点状态 7 值业务展示名，提交即审核、无审核按钮，逐级通知不跨级，上级可越级代提）；督办批次（督办日期/批次 DDL 口头约定默认 36h、事项级不设 DDL、DDL 双轨）；督办人导出 Excel 按批、入口在批次卡片（导出即归档）；无批量操作、无催办按钮（逾期未填报项=督办人直接修改/代录补正）；D-30/D-31（2026-09-14）：操作映射表 + 界面去技术语言。",
          "refs": [
            "requirements/2026-09-07-supervision-gui-form/prd.md",
            "issue-17/requirements/2026-08-24-issue-17/supervision-p0.md",
            "issue-17/requirements/2026-08-24-issue-17/topic-windows-p0.md",
            "issue-17/designs/issue-17/feature-catalog.md"
          ]
        }
      ]
    },
    {
      "group": "界面原型",
      "items": [
        {
          "path": "pages/prototypes/shell-kanban.html",
          "label": "事项看板（EAIC 壳内）",
          "title": "事项看板 · EAIC 应用外壳一级功能",
          "group": "界面原型",
          "stage": "product-prototype",
          "version": "v0.7-proto",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "EAIC 应用外壳（复用 issue-11 原型运行时装件：tokens/base/app CSS + components/proto JS，品牌绿 #00AE68 风格；左侧导航：聊天/通讯录/AI 表格/事项看板）内嵌事项看板 WebView：7 指标卡（D-22/v0.6 双字段口径：总数(含完结)/推进中/已填报/暂存(在库)/逾期未填报(过批次DDL)/风险(截止前7天)/逾期(过截止时间)）+ 筛选条件框（事项状态 4 值/事项跟进状态 4 值/责任单位/经办人/截止时间区间）+ 表头点击排序（▲▼）+ 行点击下钻跟进时间线；底部分页栏（原型 5 条/页演示双页，可选 5/10/20/50，指标卡始终按筛选后全量计算、不受分页影响）；进度评价单选三枚举（推进中/已落实/已滞后）；状态列双字段着色（逾期红/风险橙/推进中蓝/已填报绿/暂存·完结灰），逾期行红边条、风险行橙边条；转出价视角（经办人已转出的项、转办人已再转出的项）状态列叠加「已转办」橙色展示标识，仅展示层变化、指标口径仍按真实状态计入；聊天会话列表演示龙小督督办状态徽标（绿/红 pill「督办 · N 项待填报」，≠未读红点，D-14；加急转红 D-15），?view=chat 直达；页面无任何写操作与说明文案，场景切换与 case 说明在右侧 panel（领导/督办人全量、经办人/转办人/次级转办人仅自己相关），角色经 URL 参数透传进壳内 iframe；指标口径与 mock 对照见指标口径字典",
          "refs": [
            "designs/im-agent-supervision-teable/gui-dashboard-spec.md",
            "designs/im-agent-supervision-teable/metrics-dictionary.md",
            "designs/im-agent-supervision-teable/role-scenarios.md"
          ],
          "cases": [
            {
              "label": "领导 / 督办人（全部）",
              "query": "?role=leader",
              "desc": "页面状态：EAIC 壳内左侧导航选中「事项看板」，看板 WebView 全屏加载；可见全部 10 项督办事项；指标卡按全量实时统计（D-19/D-21 口径：总数 10 / 推进中 2 / 已填报 2 / 暂存(在库) 3 / 风险 1 / 紧急 1 / 逾期 1）。\n筛选与排序：顶部筛选条件框支持状态（暂存/推进中/已填报/风险/紧急/逾期 6 值）/责任单位/经办人/截止时间区间任意组合筛选；点击表头 ▲▼ 切换排序（默认截止时间升序）；底部分页（默认 5 条/页、共 2 页，切 10 条/页即合 1 页；指标卡按全量统计不受分页影响）；点击任意行 → 右侧滑出抽屉（事项详情 + 跟进记录时间线）。\n视觉：逾期行左侧红色警示边条，风险/紧急行橙色警示边条；指标卡副标题标注口径（风险=完成时限前7天、紧急=超期未反馈、逾期=过完成时限，D-21）。\n按钮与操作：页面只读（D-5），无任何写操作入口。"
            },
            {
              "label": "经办人 · 詹少鹏",
              "query": "?role=jb",
              "desc": "页面状态：仅「经办人=詹少鹏」的 3 项——SJ2609041005（推进中，截止09-11，已转给李良龙，状态列叠加「已转办」标识）、SJ2608311909（已填报，截止09-15）、SJ2608261503（逾期，截止09-05，已转给王强，「已转办」标识+红色警示边条）；指标卡按该 3 项实时重算（D-19 口径：总数 3 / 推进中 1 / 已填报 1 / 暂存 0 / 风险 0 / 紧急 0 / 逾期 1）；「已转办」仅展示层标识，口径仍按真实状态计入詹少鹏汇总。\n筛选与排序：同领导视图（筛选条件框组合筛选 + 表头点击排序 + 分页）。\n按钮与操作：页面只读，填报/转办等写操作在 IM 聊内表单完成（见龙小督台账原型）。"
            },
            {
              "label": "转办人 · 李良龙",
              "query": "?role=zb",
              "desc": "页面状态：可见 2 项——「转办人=李良龙」的 SJ2609041005（推进中，截止09-11，已再转给王强，显示「已转办」标识）与「经办人=李良龙」的 SJ2608150733（风险，橙色警示边条，截止09-14，已到 T1 预警点）；指标卡（D-19 口径：总数 2 / 推进中 1 / 已填报 0 / 暂存 0 / 风险 1 / 紧急 0 / 逾期 0）。\n筛选与排序：同上（筛选条件框组合筛选 + 表头点击排序 + 分页）。\n按钮与操作：页面只读。"
            },
            {
              "label": "次级转办人 · 王强",
              "query": "?role=czb",
              "desc": "页面状态：可见 2 项——「次级转办人=王强」的 SJ2608261503（逾期，红色警示边条，截止09-05）与「转办人=王强」的 SJ2609041005（推进中，截止09-11）；指标卡（D-19 口径：总数 2 / 推进中 1 / 已填报 0 / 暂存 0 / 风险 0 / 紧急 0 / 逾期 1）；链路终点角色，列表中不再出现更下级转办人。\n筛选与排序：同上（筛选条件框组合筛选 + 表头点击排序 + 分页）。\n按钮与操作：页面只读。"
            }
          ]
        },
        {"path": "pages/prototypes/ledger/ledger-jb-01.html", "label": "台账场景 · 经办人 詹少鹏", "title": "龙小督台账 · 经办人 詹少鹏（6 个场景）", "group": "界面原型", "stage": "product-prototype", "version": "v0.14-scene", "status": "draft", "human_confirmed": false, "purpose": "龙小督台账 D-30 分角色场景页（独立 html，右侧 panel 按钮切换）：表单只含五要素字段；事项列表按状态机口径展示：节点状态（7 值显示名）＋当前节点归属协作者＋逾期未填报角标；操作按钮按「事项状态-不同角色操作映射表」渲染（处理中=转办〔次转/督办人无〕+填报提交，审核中=编辑+提交，上级可越级代提，暂存/更高审核态只读）；无批量、无催办；新批次待办·开始填报、填报中·暂存与润色、转办给转办人、审核·再上报（提交即审核）、提交·必填校验、临期加急·逾期预警。统一口径：批次>事项>详情三级层级、批次近→远；节点状态 7 值；提交即审核（无审核按钮），提交以提交人 Token 写入跟进记录表；逐级通知仅相邻前置角色；DDL 双轨；督办人导出按批、入口在批次卡片。", "refs": ["designs/im-agent-supervision-teable/state-machine.md", "designs/im-agent-supervision-teable/role-scenarios.md"], "cases": [{"label": "新批次待办·开始填报", "query": "?s=jb-01", "path": "pages/prototypes/ledger/ledger-jb-01.html", "desc": "页面状态：批次 SUP-20260910-01 高亮（近→远第 1 批），事项列表 4 项（节点徽标：待督办人提交 · 王督办/待经办人提交 · 詹少鹏/待经办人处理 · 詹少鹏/暂存（在库））；当前项 SJ2608261503 空表单，落实情况和预计完成时间带必填星标。\n按钮与操作：暂存/转办/提交可用（待经办人处理=经办人可转办+填报提交，操作映射表）；龙小督润色入口在三个反馈字段右下角。"}, {"label": "填报中·暂存与润色", "query": "?s=jb-02", "path": "pages/prototypes/ledger/ledger-jb-02.html", "desc": "页面状态：SJ2608261503 行内「草稿」角标；表单=五要素，落实情况已填、困难/计划待补。\n按钮与操作：暂存（草稿保留）/龙小督润色（弹窗确认替换，不确认不生效）/转办/提交。"}, {"label": "转办给转办人", "query": "?s=jb-03", "path": "pages/prototypes/ledger/ledger-jb-03.html", "desc": "页面状态：转办选人弹窗打开（搜索+成员列表单选唯一）；背后事项行「↷ 已转办 · 李良龙」角标与「待转办人处理 · 李良龙」节点徽标并列。\n按钮与操作：确认转办（李良龙收待办通知）/取消。"}, {"label": "审核·再上报（提交即审核）", "query": "?s=jb-04", "path": "pages/prototypes/ledger/ledger-jb-04.html", "desc": "页面状态：节点「待经办人提交 · 詹少鹏」（李良龙已提交，行内徽标可见）；五要素为转办人提交内容，可编辑润色。\n按钮与操作：暂存/润色/提交——提交即视为审核通过并上报：节点转「待督办人提交 · 王督办」，仅通知督办人（系统无审核按钮）。"}, {"label": "提交·必填校验", "query": "?s=jb-05", "path": "pages/prototypes/ledger/ledger-jb-05.html", "desc": "页面状态：点「提交」时必填校验拦截，表单顶部红色报错条逐条列出「{任务编号} {字段名}不能为空」（D-1），事项保持待办、草稿不丢。\n按钮与操作：暂存/转办/提交（补全必填后再提交）。"}, {"label": "临期加急·逾期预警", "query": "?s=jb-06", "path": "pages/prototypes/ledger/ledger-jb-06.html", "desc": "页面状态：批次卡片「批次 DDL 2026-09-08 10:00」标红（是否已过按相对当前时间计算）；事项行名称标红·已加急。\n按钮与操作：与正常填报一致。"}]},
        {"path": "pages/prototypes/ledger/ledger-zb-01.html", "label": "台账场景 · 转办人 李良龙", "title": "龙小督台账 · 转办人 李良龙（4 个场景）", "group": "界面原型", "stage": "product-prototype", "version": "v0.14-scene", "status": "draft", "human_confirmed": false, "purpose": "龙小督台账 D-30 分角色场景页（独立 html，右侧 panel 按钮切换）：表单只含五要素字段；事项列表按状态机口径展示：节点状态（7 值显示名）＋当前节点归属协作者＋逾期未填报角标；操作按钮按「事项状态-不同角色操作映射表」渲染（处理中=转办〔次转/督办人无〕+填报提交，审核中=编辑+提交，上级可越级代提，暂存/更高审核态只读）；无批量、无催办；收转办待办、填报提交·上报经办人审核、再转次级转办人、审核次转提交·再上报。统一口径：批次>事项>详情三级层级、批次近→远；节点状态 7 值；提交即审核（无审核按钮），提交以提交人 Token 写入跟进记录表；逐级通知仅相邻前置角色；DDL 双轨；督办人导出按批、入口在批次卡片。", "refs": ["designs/im-agent-supervision-teable/state-machine.md", "designs/im-agent-supervision-teable/role-scenarios.md"], "cases": [{"label": "收转办待办", "query": "?s=zb-01", "path": "pages/prototypes/ledger/ledger-zb-01.html", "desc": "页面状态：节点「待转办人处理 · 李良龙」（詹少鹏转办，行内徽标）；空表单待填。\n按钮与操作：暂存/提交/转办（再转次级转办人）/润色。"}, {"label": "填报提交·上报经办人审核", "query": "?s=zb-02", "path": "pages/prototypes/ledger/ledger-zb-02.html", "desc": "页面状态：节点「待经办人提交 · 詹少鹏」；表单只读存档（提交人视角不可再改）。\n流转：提交后以转办人 Token 写入跟进记录表＋存为填报消息；仅通知詹少鹏（不跨级）。"}, {"label": "再转次级转办人", "query": "?s=zb-03", "path": "pages/prototypes/ledger/ledger-zb-03.html", "desc": "页面状态：行内「↷ 已转办 · 王强」+节点「待次级转办人填报 · 王强」并列；表单只读。\n流转：IM 待办通知王强；王强提交后本项将进入「待转办人提交 · 李良龙」由你核对上报。"}, {"label": "审核次转提交·再上报", "query": "?s=zb-04", "path": "pages/prototypes/ledger/ledger-zb-04.html", "desc": "页面状态：批次 SUP-20260903-03；节点「待转办人提交 · 李良龙」（王强已提交）；五要素可编辑润色。\n按钮与操作：暂存/润色/提交——提交即上报：节点转「待经办人提交 · 詹少鹏」，仅通知詹少鹏。"}]},
        {"path": "pages/prototypes/ledger/ledger-czb-01.html", "label": "台账场景 · 次级转办人 王强", "title": "龙小督台账 · 次级转办人 王强（2 个场景）", "group": "界面原型", "stage": "product-prototype", "version": "v0.14-scene", "status": "draft", "human_confirmed": false, "purpose": "龙小督台账 D-30 分角色场景页（独立 html，右侧 panel 按钮切换）：表单只含五要素字段；事项列表按状态机口径展示：节点状态（7 值显示名）＋当前节点归属协作者＋逾期未填报角标；操作按钮按「事项状态-不同角色操作映射表」渲染（处理中=转办〔次转/督办人无〕+填报提交，审核中=编辑+提交，上级可越级代提，暂存/更高审核态只读）；无批量、无催办；收再转待办·链路终点、填报提交·上报转办人审核。统一口径：批次>事项>详情三级层级、批次近→远；节点状态 7 值；提交即审核（无审核按钮），提交以提交人 Token 写入跟进记录表；逐级通知仅相邻前置角色；DDL 双轨；督办人导出按批、入口在批次卡片。", "refs": ["designs/im-agent-supervision-teable/state-machine.md", "designs/im-agent-supervision-teable/role-scenarios.md"], "cases": [{"label": "收再转待办·链路终点", "query": "?s=czb-01", "path": "pages/prototypes/ledger/ledger-czb-01.html", "desc": "页面状态：节点「待次级转办人填报 · 王强」（李良龙再转）；空表单待填；导航<b>无转办按钮</b>（链路终点 D-8）。\n按钮与操作：暂存/提交/润色。"}, {"label": "填报提交·上报转办人审核", "query": "?s=czb-02", "path": "pages/prototypes/ledger/ledger-czb-02.html", "desc": "页面状态：节点「待转办人提交 · 李良龙」；表单只读存档。\n流转：提交后跟进记录存档（填报人=你）＋会话留存填报消息；仅通知李良龙（不跨级）。"}]},
        {"path": "pages/prototypes/ledger/ledger-db-01.html", "label": "台账场景 · 督办人 王督办（全量查收）", "title": "龙小督台账 · 督办人 王督办（全量查收）（5 个场景）", "group": "界面原型", "stage": "product-prototype", "version": "v0.14-scene", "status": "draft", "human_confirmed": false, "purpose": "龙小督台账 D-30 分角色场景页（独立 html，右侧 panel 按钮切换）：表单只含五要素字段；事项列表按状态机口径展示：节点状态（7 值显示名）＋当前节点归属协作者＋逾期未填报角标；操作按钮按「事项状态-不同角色操作映射表」渲染（处理中=转办〔次转/督办人无〕+填报提交，审核中=编辑+提交，上级可越级代提，暂存/更高审核态只读）；无批量、无催办；批次 DDL 到达·查收、直接修改·改评留痕、导出 Excel·归档本批、逾期未填报·查收视图、全量批次浏览·节点全貌。统一口径：批次>事项>详情三级层级、批次近→远；节点状态 7 值；提交即审核（无审核按钮），提交以提交人 Token 写入跟进记录表；逐级通知仅相邻前置角色；DDL 双轨；督办人导出按批、入口在批次卡片。", "refs": ["designs/im-agent-supervision-teable/state-machine.md", "designs/im-agent-supervision-teable/role-scenarios.md"], "cases": [{"label": "批次 DDL 到达·查收", "query": "?s=db-01", "path": "pages/prototypes/ledger/ledger-db-01.html", "desc": "页面状态：全量 3 批次近→远，本批 4 项节点徽标一览（待督办人提交 · 王督办/待经办人处理 · 詹少鹏/待经办人提交 · 詹少鹏/暂存（在库））。\n按钮与操作：任意未归档项可直接编辑并「提交」（记录人=督办人，留痕）；导出入口在左侧批次卡片（每次导出一个批次）。"}, {"label": "直接修改·改评留痕", "query": "?s=db-02", "path": "pages/prototypes/ledger/ledger-db-02.html", "desc": "页面状态：SJ2609041005（节点「待督办人提交 · 王督办」）五要素可编辑，进度评价可改评。\n按钮与操作：「提交」=修改存档并留痕（记录人=督办人，改评留痕 D-6）。"}, {"label": "导出 Excel·归档本批", "query": "?s=db-03", "path": "pages/prototypes/ledger/ledger-db-03.html", "desc": "页面状态：批次 SUP-20260906-02 已归档——卡片导出按钮置灰，事项行节点「暂存（在库）」灰色徽标，表单只读。\n流转：导出即本轮关闭（T5：已填报→暂存、节点回「暂存（在库）」），填报人收「本轮跟进已关闭」通知；新一轮启动后节点离开暂存态（T6）。"}, {"label": "逾期未填报·查收视图", "query": "?s=db-04", "path": "pages/prototypes/ledger/ledger-db-04.html", "desc": "页面状态：批次 SUP-20260903-03；SJ2609070612 行内节点「待转办人提交 · 李良龙」＋「逾期未填报」橙色角标（口径：所属批次 DDL 已过且当前节点归属人尚未提交，PM 2026-09-14）。\n按钮与操作：与正常查收一致——直接编辑并「提交」；列表与表单均无催办按钮（无此功能，PM 2026-09-14）。"}, {"label": "全量批次浏览·节点全貌", "query": "?s=db-05", "path": "pages/prototypes/ledger/ledger-db-05.html", "desc": "页面状态：3 批按督办日期近→远；SUP-20260903-03 已归档（全部「暂存（在库）」、导出禁用）；选中已过 DDL 的 SUP-20260906-02——SJ2609051107 行内「待次级转办人填报 · 王强」（列表口径：节点状态＋归属人＋逾期未填报角标）。\n流转：新一批 Excel 下发生成新批次，新批次事项从「暂存（在库）」进入「待经办人处理 · 詹少鹏」（T1）。"}]},
        {
          "path": "pages/prototypes/shell-chat-panel.html",
          "label": "龙小督会话 · 台账面板壳",
          "title": "龙小督会话 · 台账面板壳",
          "group": "界面原型",
          "stage": "product-prototype",
          "version": "v0.8-proto",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "EAIC 壳内「对话窗口 + 右侧插件 panel」壳形式：聊天窗口上方插件 tab 栏（当前仅「事项」）显示当前用户待办事项数徽标（绿/红，可 ?n= &urgent=1 演示），点击 tab 切换右侧台账 panel 收起/展开（?panel=open|closed）；右侧台账=聊内表单载体（骨架占位，交互细节见龙小督台账原型，本壳不重复设计）；对话演示「自然语言为主 + 台账在侧」模型：龙小督垂询/代录仅暂存台账，提交必须由用户本人点击（跟进记录存档），龙小督无权代提交；D-28：有待办督办事项进入会话默认展开台账、提交记录以用户消息存档（过长默认收起）",
          "refs": [
            "designs/im-agent-supervision-teable/embed-form-spec.md",
            "requirements/2026-09-07-supervision-gui-form/prd.md",
            "designs/im-agent-supervision-teable/agent-vs-form-interaction.md"
          ],
          "cases": [
            {
              "label": "台账展开（默认）",
              "query": "?panel=open",
              "desc": "页面状态：EAIC 壳左侧导航选中「聊天」，主区=龙小督会话；聊天窗口上方插件 tab 栏显示「事项」tab + 绿色待办数徽标 2；右侧台账 panel 展开（宽 480px）：头部「龙小督台账」+ 待办数 tag，panel 本体为骨架占位（聊内表单渲染位，交互细节不在本壳范围）。\n按钮与操作：点击「事项」tab → panel 收起；对话区与输入框为静态演示。"
            },
            {
              "label": "台账收起",
              "query": "?panel=closed",
              "desc": "页面状态：同一会话，右侧台账 panel 收起，对话区占满主区宽度；tab 栏仍在聊天窗口上方，「事项」tab + 徽标 5 保持可见。\n按钮与操作：点击「事项」tab → panel 重新展开。"
            },
            {
              "label": "加急徽标",
              "query": "?urgent=1",
              "desc": "页面状态：台账展开，tab 徽标转红（对应 D-15 自动催办加急时徽标转红语义）；?n=3 可改待办数，n=0 时徽标隐藏。"
            }
          ]
        }
      ]
    },
    {
      "group": "设计文档 (im-agent-supervision-teable)",
      "items": [
        {
          "path": "pages/designs/state-machine.html",
          "label": "督办事项状态机",
          "title": "督办事项状态机（D-22 双字段 + D-29 节点状态 + D-30 操作映射）",
          "group": "设计文档 (im-agent-supervision-teable)",
          "stage": "product-design-docs",
          "version": "v0.11-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "督办事项唯一生命周期（D-22/v0.6）：事项状态（时间状态：正常/风险/逾期/完结，纯按当前时间×截止时间，完结=督办人 Teable 手动改、终态）× 事项跟进状态（跟进：暂存/推进中/已填报/逾期未填报）两字段完全独立；T1~T8 迁移表（启动/提交/逾期未填报/补报/导出关闭/下轮重启/风险/逾期）；风险（截止前7天）必须通知经办人（D-23）；去除「紧急」；历史清洗映射待 PM 确认",
          "refs": [
            "designs/im-agent-supervision-teable/state-machine.md",
            "requirements/2026-09-07-supervision-gui-form/prd.md",
            "designs/im-agent-supervision-teable/agent-vs-form-interaction.md"
          ]
        },
        {
          "path": "pages/designs/gui-dashboard-spec.html",
          "label": "GUI 看板方案",
          "title": "GUI 看板方案：督办事项展示界面",
          "group": "设计文档 (im-agent-supervision-teable)",
          "stage": "product-design-docs",
          "version": "v0.12-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "GUI 看板方案（D-22/v0.6 + D-23）：7 指标卡双字段口径 + 筛选（事项状态/事项跟进状态 双筛选器）+ 21 列列表 + 下钻抽屉（责任链/督办时间/填报完成时间/响应时长；跟进时间线每次填报展示五要素内容，D-23）+ BFF 接口草拟；纯只读（D-5，批示/审批为线下流程，D-28）",
          "refs": [
            "designs/im-agent-supervision-teable/gui-dashboard-spec.md",
            "designs/im-agent-supervision-teable/metrics-dictionary.md",
            "docs/research/gui-route-teable-bff.md"
          ]
        },
        {
          "path": "pages/designs/metrics-dictionary.html",
          "label": "指标口径字典",
          "title": "指标口径字典：事项看板 7 指标卡 + 2 统计列",
          "group": "设计文档 (im-agent-supervision-teable)",
          "stage": "product-design-docs",
          "version": "v0.9-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "7 指标卡口径字典（D-22/v0.6 双字段）：M1 总数(含完结)/M2 推进中/M3 已填报/M4 暂存/M6 逾期未填报(=超期未反馈，事项跟进状态)/M5 风险/M7 逾期(事项状态，纯时间口径与填报无关)；技术口径=字段 ID+过滤条件；原型 mock 11 条与演算对照（11/4/3/3/1/1/1）",
          "refs": [
            "designs/im-agent-supervision-teable/metrics-dictionary.md",
            "designs/im-agent-supervision-teable/gui-dashboard-spec.md"
          ]
        },
        {
          "path": "pages/designs/agent-scenario-script.html",
          "label": "场景剧本（全角色）",
          "title": "场景剧本：龙小督 × 督办全角色",
          "group": "设计文档 (im-agent-supervision-teable)",
          "stage": "product-design-docs",
          "version": "v0.14-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "触发→通知→逐条填报(含润色/转办/批量)→回执→完结（线下审批+督办人手动标记，无系统内审批流）完整时序与话术，第三幕为督办人 DDL 查收与本轮关闭（D-20 无审核：改数据/保存/导 Excel/催逾期）；含降级/口头回复/催办升级/24h监督四分支及 10 条走查用例",
          "refs": [
            "designs/im-agent-supervision-teable/agent-scenario-script.md",
            "issue-17/requirements/2026-08-24-issue-17/supervision-p0.md"
          ]
        },
        {
          "path": "pages/designs/role-scenarios.html",
          "label": "角色细分场景与闭环",
          "title": "角色细分场景与业务闭环：龙小督督办全角色",
          "group": "设计文档 (im-agent-supervision-teable)",
          "stage": "product-design-docs",
          "version": "v0.14-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "四角色（督办人/经办人/转办人/领导）17 细分场景闭环 + 决策清单 D-1~D-25（D-19/D-21 被 D-22 取代；D-23 风险通知经办人+时间线五要素；D-24 表单=DM 右侧 panel；D-25 桌面端外壳收起+待办徽标）",
          "refs": [
            "designs/im-agent-supervision-teable/role-scenarios.md",
            "designs/im-agent-supervision-teable/agent-scenario-script.md"
          ]
        },
        {
          "path": "pages/designs/desktop-shell-spec.html",
          "label": "桌面端外壳改造",
          "title": "桌面端外壳改造：侧栏收起 + 督办待办徽标（D-25）",
          "group": "设计文档 (im-agent-supervision-teable)",
          "stage": "product-design-docs",
          "version": "v0.4-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "EAIC 桌面端外壳改造（D-25，PM 2026-09-10）：左侧功能菜单可收起为 56px 纯 icon bar（hover tooltip、状态记忆）；聊天列表可收起（配合 D-24 panel 拖宽形成全宽填报）；聊天列表龙小督条目双徽标=未读红点+待办事项数量徽标（BFF 聚合，0 隐藏，加急转红，D-14 升级）",
          "refs": [
            "designs/im-agent-supervision-teable/desktop-shell-spec.md",
            "designs/im-agent-supervision-teable/embed-form-spec.md",
            "designs/im-agent-supervision-teable/role-scenarios.md"
          ]
        }
      ]
    }
  ],
  "landing": "pages/docs/prd-supervision-gui-form.html"
};
