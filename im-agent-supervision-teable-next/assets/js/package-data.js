window.LINC_PACKAGE = {
  "process_slug": "im-agent-supervision-teable-next",
  "issue_number": "",
  "current_stage": "clarify",
  "status": "in_progress",
  "generated_at": "2026-09-08T06:00:00Z",
  "nav": [
    {
      "group": "需求文档 (2026-09-07)",
      "items": [
        {
          "path": "pages/docs/prd-supervision-gui-form.html",
          "label": "PRD · 督办 GUI 看板与聊内填报表单",
          "title": "PRD：督办 GUI 看板与聊内填报表单",
          "group": "需求文档 (2026-09-07)",
          "stage": "clarify",
          "version": "v0.10-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "IM 督办两大目标的需求基线：GUI 只读看板（指标卡+条件筛选/表头排序/分页列表+跟进记录下钻）与聊内 iframe 填报表单（k/N 逐条/批量提交转办/润色/两级办结审批/状态持久化/提交存档消息/督办人 DDL 查收视图）；功能需求已编号（GUI-01~08/FORM-01~15/AGT-01~11）供研发排期与验收对账；进度评价枚举已确认（推进中/已落实/已滞后）；第三轮决策 D-13~D-17 已回填：Excel 唯一下发、消息列表督办状态徽标、自动催办=原表单加急+push+可视化（不加表单）、困难仅填报内容、批示过问移出本期；第五轮决策已回填：D-18 交互模式立场（待 PM 确认三问题）、D-19 状态机（6 状态，跟进中更名推进中）、D-20 聊内不做审核（数据交互 GUI：督办人改数据+提交+导 Excel+逾期催办；提交存填报消息可回看；无审核/打回/申请办结/汇总页；本轮关闭回暂存由导出 Excel 触发（D-21）；风险/紧急(超期未反馈)/逾期口径改挂完成时限与督办DDL）；状态 draft 待 PM 审批",
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
          "version": "v0.8-proto",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "EAIC 应用外壳（复用 issue-11 原型运行时装件：tokens/base/app CSS + components/proto JS，品牌绿 #00AE68 风格；左侧导航：聊天/通讯录/AI 表格/事项看板）内嵌事项看板 WebView：7 指标卡（D-19 状态机口径：总数/推进中/已填报/暂存(在库)/风险(完成时限前7天)/紧急(超期未反馈)/逾期(过完成时限)，D-21 口径）+ 筛选条件框（状态 6 值/责任单位/经办人/截止时间区间）+ 表头点击排序（▲▼）+ 行点击下钻跟进时间线；底部分页栏（原型 5 条/页演示双页，可选 5/10/20/50，指标卡始终按筛选后全量计算、不受分页影响）；进度评价单选三枚举（推进中/已落实/已滞后）；状态列按 D-19 状态机 6 值着色（逾期红/风险·紧急橙/推进中蓝/已填报绿/暂存灰），逾期行红边条、风险/紧急行橙边条；转出价视角（经办人已转出的项、转办人已再转出的项）状态列叠加「已转办」橙色展示标识，仅展示层变化、指标口径仍按真实状态计入；聊天会话列表演示龙小督督办状态徽标（绿/红 pill「督办 · N 项待填报」，≠未读红点，D-14；加急转红 D-15），?view=chat 直达；页面无任何写操作与说明文案，场景切换与 case 说明在右侧 panel（领导/督办人全量、经办人/转办人/次级转办人仅自己相关），角色经 URL 参数透传进壳内 iframe；指标口径与 mock 对照见指标口径字典",
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
              "desc": "页面状态：仅「经办人=詹少鹏」的 3 项——SJ2609041005（推进中，截止09-11，已转给李良龙，状态列叠加「已转办」标识）、SJ2608311909（已填报，截止09-15）、SJ2608261503（逾期，截止09-05，已转给王强，「已转办」标识+红色警示边条）；指标卡按该 3 项实时重算（D-19 口径：总数 3 / 推进中 1 / 已填报 1 / 暂存 0 / 风险 0 / 紧急 0 / 逾期 1）；「已转办」仅展示层标识，口径仍按真实状态计入詹少鹏汇总。\n筛选与排序：同领导视图（筛选条件框组合筛选 + 表头点击排序 + 分页）。\n按钮与操作：页面只读，填报/转办等写操作在 IM 聊内表单完成（见聊内填报表单原型）。"
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
        {
          "path": "pages/prototypes/form.html",
          "label": "聊内填报表单原型",
          "title": "督办事项进展填报 · 交互原型（五角色场景）",
          "group": "界面原型",
          "stage": "product-prototype",
          "version": "v0.8-proto",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "IM 消息卡片内 iframe 表单（D-20 定位=数据交互 GUI，无审核/无汇总页）：k/N 导航 + 左侧多选列表（督办人设定 DDL + 状态标记）+ 批量提交 + 转办/批量转办（**弹窗选人**：组织成员搜索+单选唯一）+ 三反馈字段各配龙小督润色；按角色区分按钮——经办人/转办人：暂存·提交·转办，次级转办人：无转办（链路终点）；**提交=保存 Teable + 存为填报消息**（点击消息呼出只读表单回看，case=ro）；督办人 supervisor **查收**视图（D-11/D-20）：直接改数据+「提交（保存到 Teable）」+「导出 Excel」（龙小督发文件消息）+逾期项催办（已填报项禁催办）；进度评价三枚举（推进中/已落实/已滞后）；状态持久化见嵌入方案（D-12）",
          "refs": [
            "designs/im-agent-supervision-teable/embed-form-spec.md",
            "designs/im-agent-supervision-teable/agent-scenario-script.md"
          ],
          "cases": [
            {
              "label": "经办人 · 詹少鹏",
              "query": "?case=jb",
              "desc": "页面状态：填报视图，可见本人批次 5 项（SJ2609041005 / SJ2608311909 / SJ2608311922 / SJ2608261503 / SJHRM20260812T001）：前 2 项已提交（✓已填报）、第 3 项暂存（草稿）、SJ2608261503 已转办给王强（↷已转办·王强，只读留痕，仍计入批次汇总）、最后 1 项未填且督办DDL 09-09 已到 T2 预警点→紧急（红色警示+加急横幅，D-15/D-19：自动催办不生成新表单，仅原表单加急+push）；左侧列表每项显示督办人 DDL（填报截止，MM-DD）；头部「当前第 k / 共 5 项」+ 进度条 + 已提交计数；当前停在可编辑的暂存项。\n按钮与操作（经办人）：当前项 暂存/提交/转办（弹出组织成员选择弹窗：搜索+列表**单选唯一一位**转办人，确认后写主表并 IM 通知新执行人）/龙小督润色（三个反馈字段各一个）/申请办结 + 上一项；左侧多选后 批量提交（空项报错「{编号} {字段}不能为空」）/批量转办（同一弹窗单选一位，统一转办所选项；未勾选点击给提示）；提交单项 → 该项状态→已填报（T5）+ 转只读存档 + **存为填报消息**（算作用户发送的一次聊内表单消息，点击可只读回看）+ 卡片角标「已提交 k/5」；全部完成 → 卡片完成态 + 汇总回执（**无汇总页**，D-20）。"
            },
            {
              "label": "转办人 · 李良龙",
              "query": "?case=zb",
              "desc": "页面状态：转办人视角 2 项——SJ2609051107 主干道窨井更换（风险，督办DDL 09-10 已过 T1 预警点，橙色警示，待我填报，当前项）与 SJ2609041005 城区道路维修（↷已转办·王强：我再转出的项，只读留痕，进展仍计入我的视图）。\n按钮与操作（转办人）：当前可填项 = 暂存/提交/转办（弹窗单选唯一一位**次级转办人**）/龙小督润色/申请办结；已转办项仅可查看+查看跟进记录。"
            },
            {
              "label": "次级转办人 · 王强",
              "query": "?case=czb",
              "desc": "页面状态：次级转办人视角 1 项——SJ2609031518 人行天桥护栏加固（推进中，督办DDL 09-12，未填，当前项）；链路终点角色。\n按钮与操作（次级转办人）：暂存/提交/龙小督润色/申请办结；**无转办按钮**（显示「转办（链路终点）」禁用，D-8）。"
            },
            {
              "label": "督办人 · DDL 查收（supervisor 视图）",
              "query": "?case=db",
              "desc": "页面状态：到达督办人设定 DDL 时收到的**填报查收表单**（D-11/D-20，替代原 Teable 筛选视图链接；**无审核**），共 2 项：1 项已填报 + 1 项逾期未填报，头部计数展示；左侧栏顶部「导出 Excel」。\n已填报项（SJ2609041005，预填填报人李良龙 09-06 14:22 的跟进记录）：字段可修改。\n按钮与操作（督办人 · 已填报项）：**提交（保存到 Teable）**（修改写跟进表，创建人=督办人，留痕）/ 龙小督润色（三个反馈字段各一个）/ 催办**禁用**「已填报无需催办」。\n逾期项（SJ2609070612）：红色横幅提示可代录补正或催办；催办可点（IM+邮件通知经办人，留痕）；提交同已填报项。**督办人导出 Excel 即触发本轮批次关闭：已填报→暂存（D-21）**，填报人收「本轮跟进已关闭」通知。"
            },
            {
              "label": "提交存档消息 · 只读回顾",
              "query": "?case=ro",
              "desc": "页面状态：点击聊天历史中的**填报消息**（由提交自动生成，以用户消息身份发送）呼出的**只读表单**：顶部蓝色横幅说明「这是一条已提交的填报消息（存档，只读）」，展示提交时的全部五字段+进度评价与提交人/时间。\n按钮与操作：仅「已提交存档 · 只读」禁用标识 + 「查看跟进记录」；不可编辑，如需修改请在会话中告诉龙小督（D-12/D-20）。"
            }
          ]
        },
        {
          "path": "pages/prototypes/shell-chat-panel.html",
          "label": "龙小督会话 · 台账面板壳",
          "title": "会话 + 台账插件 panel：EAIC 壳（对话优先，台账在侧）",
          "group": "界面原型",
          "stage": "product-prototype",
          "version": "v0.1-proto",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "EAIC 壳内「对话窗口 + 右侧插件 panel」壳形式：聊天窗口上方插件 tab 栏（当前仅「事项」）显示当前用户待办事项数徽标（绿/红，可 ?n= &urgent=1 演示），点击 tab 切换右侧台账 panel 收起/展开（?panel=open|closed）；右侧台账=聊内表单载体（骨架占位，交互细节见聊内填报表单原型，本壳不重复设计）；对话演示「自然语言为主 + 台账在侧」模型：龙小督垂询/代录仅暂存台账，提交必须由用户点击（使用用户 Token 写入 Teable），龙小督无权代提交",
          "refs": [
            "designs/im-agent-supervision-teable/embed-form-spec.md",
            "requirements/2026-09-07-supervision-gui-form/prd.md",
            "designs/im-agent-supervision-teable/agent-vs-form-interaction.md"
          ],
          "cases": [
            {
              "label": "台账展开（默认）",
              "query": "?panel=open",
              "desc": "页面状态：EAIC 壳左侧导航选中「聊天」，主区=龙小督会话；聊天窗口上方插件 tab 栏显示「事项」tab + 绿色待办数徽标 5；右侧台账 panel 展开（宽 400px）：头部「龙小督 · 工作台账」+ 待办数 tag，panel 本体为骨架占位（聊内表单渲染位，交互细节不在本壳范围）。\n按钮与操作：点击「事项」tab → panel 收起；对话区与输入框为静态演示。"
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
          "title": "督办事项状态机（D-19）",
          "group": "设计文档 (im-agent-supervision-teable)",
          "stage": "product-design-docs",
          "version": "v0.4-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "6 状态生命周期（暂存/**推进中**/已填报/风险/紧急/逾期）+ 严格串联预警（D-21 口径：风险=完成时限前 7 天、紧急=超期未反馈=过督办DDL、逾期=过完成时限）+ **本轮关闭闭环（督办人导出 Excel 触发已填报→暂存）**；迁移表 T1~T6；取代 D-3/D-10，审核闭环被 D-20 取代",
          "refs": [
            "designs/im-agent-supervision-teable/state-machine.md",
            "requirements/2026-09-07-supervision-gui-form/prd.md",
            "designs/im-agent-supervision-teable/agent-vs-form-interaction.md"
          ]
        },
        {
          "path": "pages/designs/agent-vs-form-interaction.html",
          "label": "交互模式决策备忘录",
          "title": "表单化 vs 数字员工：交互模式立场（D-18）",
          "group": "设计文档 (im-agent-supervision-teable)",
          "stage": "product-design-docs",
          "version": "v0.2-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "回应「流程IT化」核心顾虑：表单=消息富媒体载体而非流程入口、自然语言与表单双通道等价、审核不流程IT化、状态机归 BFF/agent 层、Teable 归记录层；含待 PM 确认三问题（立场/引导权重/打回后自然语言补正）",
          "refs": [
            "designs/im-agent-supervision-teable/agent-vs-form-interaction.md",
            "requirements/2026-09-07-supervision-gui-form/prd.md",
            "designs/im-agent-supervision-teable/state-machine.md",
            "designs/im-agent-supervision-teable/embed-form-spec.md"
          ]
        },
        {
          "path": "pages/designs/gui-dashboard-spec.html",
          "label": "GUI 看板方案",
          "title": "GUI 看板方案：督办事项展示界面",
          "group": "设计文档 (im-agent-supervision-teable)",
          "stage": "product-design-docs",
          "version": "v0.6-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "看板页面结构（指标卡 + 筛选条件框组合筛选 + 表头点击排序 + 下钻抽屉）、BFF 首批接口草拟与三路线评估材料（供研发决策）；状态徽章与警示边条按 D-19/D-21 状态机 6 值着色（推进中/风险=完成时限前7天/紧急=超期未反馈/逾期=过完成时限）；指标口径单一事实源见「指标口径字典」",
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
          "version": "v0.4-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "7 个指标卡（总数/推进中/已填报/暂存(在库)/风险/紧急(=超期未反馈)/逾期(=过完成时限)，D-19/D-21 口径）+ 2 个列表统计列（跟进次数/催办次数）的业务口径、技术口径（字段 ID + 过滤条件）、可计算性验证、边界与原型 mock 数据手算对照；D-21 口径演算示例与督办DDL/完成时限锚点关系待复核项已列 §4",
          "refs": [
            "designs/im-agent-supervision-teable/metrics-dictionary.md",
            "designs/im-agent-supervision-teable/gui-dashboard-spec.md"
          ]
        },
        {
          "path": "pages/designs/embed-form-spec.html",
          "label": "聊内表单嵌入方案",
          "title": "嵌入方案：聊内填报表单（IM 消息卡片 + iframe）",
          "group": "设计文档 (im-agent-supervision-teable)",
          "stage": "product-design-docs",
          "version": "v0.9-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "Mattermost 嵌入能力评估、消息卡片与 postMessage 协议、k/N 逐条填报导航、提交链路（用户 Token 写跟进表 + 自动化回写主表）、安全清单与降级策略；含督办人**查收**视图按钮矩阵（D-20 无审核：改数据+提交保存+导出 Excel 文件消息+逾期催办；已填报项禁催办）、转办/批量转办弹窗选人（组织成员单选唯一）、提交存填报消息+只读回看、左侧列表督办人 DDL 展示",
          "refs": [
            "designs/im-agent-supervision-teable/embed-form-spec.md",
            "requirements/2026-09-07-supervision-gui-form/prd.md"
          ]
        },
        {
          "path": "pages/designs/agent-scenario-script.html",
          "label": "场景剧本（全角色）",
          "title": "场景剧本：龙小督 × 督办全角色",
          "group": "设计文档 (im-agent-supervision-teable)",
          "stage": "product-design-docs",
          "version": "v0.9-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "触发→通知→逐条填报(含润色/转办/批量)→回执→两级办结审批完整时序与话术，第三幕为督办人 DDL 查收与本轮关闭（D-20 无审核：改数据/保存/导 Excel/催逾期）；含降级/口头回复/催办升级/24h监督四分支及 10 条走查用例",
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
          "version": "v0.8-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "督办人/经办人/转办人/领导四角色 17 个细分场景闭环矩阵，含 8 项业务风险与决策清单 D-1~D-21（D-3/D-10 被 D-19 取代、审核闭环被 D-20 取消）；闭环总图含 DDL 查收与本轮关闭段",
          "refs": [
            "designs/im-agent-supervision-teable/role-scenarios.md",
            "designs/im-agent-supervision-teable/agent-scenario-script.md"
          ]
        }
      ]
    },
    {
      "group": "规划文档",
      "items": [
        {
          "path": "pages/docs/next-steps.html",
          "label": "下一步行动",
          "title": "下一步行动：IM / 数字员工 / 督办场景 / 多维表格",
          "group": "规划文档",
          "stage": "clarify",
          "version": "v0.1",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "四条主线近期行动清单（9 月）+ R1–R8 全路线索引",
          "refs": [
            "issue-17/requirements/2026-08-24-issue-17/prd.md",
            "issue-17/requirements/2026-08-24-issue-17/supervision-p0.md",
            "issue-17/docs/research/issue-17-gui-vs-custom-system.md"
          ]
        },
        {
          "path": "pages/docs/input-sources.html",
          "label": "输入来源",
          "title": "输入来源与决策依据",
          "group": "规划文档",
          "stage": "clarify",
          "version": "v0.1",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "9/2 会议纪要、issue-17 重排基线与 PM 决策的可追溯记录",
          "refs": [
            "issue-17/interviews/2026-09-02-roadmap-meeting/summary.md",
            "issue-17/recordings/数字员工产品路线与企业协同系统需求讨论-2026年09月02日.pdf"
          ]
        },
        {
          "path": "pages/docs/gui-route-teable-bff.html",
          "label": "GUI 路线研究（Teable+BFF）",
          "title": "研究：Teable API GUI vs 独立系统（BFF 路线）",
          "group": "规划文档",
          "stage": "clarify",
          "version": "v1.0",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "GUI 技术债与三条路线（直连/BFF/App Builder）对比，推荐 Teable 数据底座 + 轻量 BFF 应用层",
          "refs": [
            "im-agent-supervision-teable-next/docs/research/gui-route-teable-bff.md"
          ]
        }
      ]
    },
    {
      "group": "上游需求基线 (issue-17)",
      "items": [
        {
          "path": "pages/upstream/requirements.html",
          "label": "需求总览",
          "title": "需求总览",
          "group": "上游需求基线 (issue-17)",
          "stage": "clarify",
          "version": "v1.0",
          "status": "completed",
          "human_confirmed": true,
          "purpose": "镜像自 issue-17/requirements/2026-08-24-issue-17/requirements.md"
        },
        {
          "path": "pages/upstream/user-stories.html",
          "label": "用户故事",
          "title": "用户故事",
          "group": "上游需求基线 (issue-17)",
          "stage": "clarify",
          "version": "v1.0",
          "status": "completed",
          "human_confirmed": true,
          "purpose": "镜像自 issue-17/requirements/2026-08-24-issue-17/user-stories.md"
        },
        {
          "path": "pages/upstream/prd.html",
          "label": "PRD",
          "title": "PRD",
          "group": "上游需求基线 (issue-17)",
          "stage": "clarify",
          "version": "v1.0",
          "status": "completed",
          "human_confirmed": true,
          "purpose": "镜像自 issue-17/requirements/2026-08-24-issue-17/prd.md"
        },
        {
          "path": "pages/upstream/topic-windows-p0.html",
          "label": "子需求 · 话题多窗口",
          "title": "子需求 · 话题多窗口",
          "group": "上游需求基线 (issue-17)",
          "stage": "product-prototype",
          "version": "v0.9-draft",
          "status": "in_progress",
          "human_confirmed": false,
          "purpose": "镜像自 issue-17/requirements/2026-08-24-issue-17/topic-windows-p0.md"
        },
        {
          "path": "pages/upstream/supervision-p0.html",
          "label": "子需求 · 督办场景",
          "title": "子需求 · 督办场景",
          "group": "上游需求基线 (issue-17)",
          "stage": "product-prototype",
          "version": "v0.9-draft",
          "status": "in_progress",
          "human_confirmed": false,
          "purpose": "镜像自 issue-17/requirements/2026-08-24-issue-17/supervision-p0.md"
        },
        {
          "path": "pages/upstream/workbench-home-p0.html",
          "label": "子需求 · 工作台首页",
          "title": "子需求 · 工作台首页",
          "group": "上游需求基线 (issue-17)",
          "stage": "product-prototype",
          "version": "v0.9-draft",
          "status": "in_progress",
          "human_confirmed": false,
          "purpose": "镜像自 issue-17/requirements/2026-08-24-issue-17/workbench-home-p0.md"
        },
        {
          "path": "pages/upstream/org-agent-management-p0.html",
          "label": "子需求 · 组织化数字员工管理",
          "title": "子需求 · 组织化数字员工管理",
          "group": "上游需求基线 (issue-17)",
          "stage": "product-prototype",
          "version": "v0.9-draft",
          "status": "in_progress",
          "human_confirmed": false,
          "purpose": "镜像自 issue-17/requirements/2026-08-24-issue-17/org-agent-management-p0.md"
        },
        {
          "path": "pages/upstream/email-p0.html",
          "label": "子需求 · 邮箱接入",
          "title": "子需求 · 邮箱接入",
          "group": "上游需求基线 (issue-17)",
          "stage": "product-prototype",
          "version": "v0.9-draft",
          "status": "in_progress",
          "human_confirmed": false,
          "purpose": "镜像自 issue-17/requirements/2026-08-24-issue-17/email-p0.md"
        },
        {
          "path": "pages/upstream/wework-replacement-p0.html",
          "label": "子需求 · 企微替换",
          "title": "子需求 · 企微替换",
          "group": "上游需求基线 (issue-17)",
          "stage": "product-prototype",
          "version": "v0.9-draft",
          "status": "in_progress",
          "human_confirmed": false,
          "purpose": "镜像自 issue-17/requirements/2026-08-24-issue-17/wework-replacement-p0.md"
        }
      ]
    },
    {
      "group": "上游设计文档 (issue-17)",
      "items": [
        {
          "path": "pages/upstream/design-review.html",
          "label": "设计评审",
          "title": "设计评审",
          "group": "上游设计文档 (issue-17)",
          "stage": "product-design-docs",
          "version": "v1.0",
          "status": "completed",
          "human_confirmed": true,
          "purpose": "镜像自 issue-17/designs/issue-17/design-review.md"
        },
        {
          "path": "pages/upstream/feature-catalog.html",
          "label": "功能目录",
          "title": "功能目录",
          "group": "上游设计文档 (issue-17)",
          "stage": "product-design-docs",
          "version": "v1.0",
          "status": "completed",
          "human_confirmed": true,
          "purpose": "镜像自 issue-17/designs/issue-17/feature-catalog.md"
        },
        {
          "path": "pages/upstream/feasibility.html",
          "label": "可行性分析",
          "title": "可行性分析",
          "group": "上游设计文档 (issue-17)",
          "stage": "product-design-docs",
          "version": "v1.0",
          "status": "completed",
          "human_confirmed": true,
          "purpose": "镜像自 issue-17/designs/issue-17/feasibility.md"
        },
        {
          "path": "pages/upstream/ui-spec.html",
          "label": "UI 规格",
          "title": "UI 规格",
          "group": "上游设计文档 (issue-17)",
          "stage": "product-prototype",
          "version": "v0.9-draft",
          "status": "in_progress",
          "human_confirmed": false,
          "purpose": "镜像自 issue-17/designs/issue-17/ui-spec.md"
        },
        {
          "path": "pages/upstream/fields.html",
          "label": "字段规格",
          "title": "字段规格",
          "group": "上游设计文档 (issue-17)",
          "stage": "product-prototype",
          "version": "v0.9-draft",
          "status": "in_progress",
          "human_confirmed": false,
          "purpose": "镜像自 issue-17/designs/issue-17/fields.md"
        }
      ]
    },
    {
      "group": "研究调研 (issue-17)",
      "items": [
        {
          "path": "pages/upstream/agent-framework-decision.html",
          "label": "Agent 框架决策",
          "title": "Agent 框架决策",
          "group": "研究调研 (issue-17)",
          "stage": "product-prototype",
          "version": "v0.9-draft",
          "status": "in_progress",
          "human_confirmed": false,
          "purpose": "镜像自 issue-17/docs/research/agent-framework-decision.md"
        },
        {
          "path": "pages/upstream/gui-vs-custom-system.html",
          "label": "GUI 路线研究（Teable+BFF）",
          "title": "GUI 路线研究（Teable+BFF）",
          "group": "研究调研 (issue-17)",
          "stage": "product-prototype",
          "version": "v0.9-draft",
          "status": "in_progress",
          "human_confirmed": false,
          "purpose": "镜像自 issue-17/docs/research/issue-17-gui-vs-custom-system.md"
        },
        {
          "path": "pages/upstream/schedule-oss-options.html",
          "label": "日程 OSS 选型",
          "title": "日程 OSS 选型",
          "group": "研究调研 (issue-17)",
          "stage": "",
          "version": "v0.9-draft",
          "status": "draft",
          "human_confirmed": false,
          "purpose": "镜像自 issue-17/docs/research/schedule-oss-options.md"
        },
        {
          "path": "pages/upstream/roadmap-meeting-summary.html",
          "label": "9/2 会议纪要摘要",
          "title": "9/2 会议纪要摘要",
          "group": "研究调研 (issue-17)",
          "stage": "product-prototype",
          "version": "v0.9-draft",
          "status": "in_progress",
          "human_confirmed": false,
          "purpose": "镜像自 issue-17/interviews/2026-09-02-roadmap-meeting/summary.md"
        }
      ]
    }
  ],
  "landing": "pages/docs/prd-supervision-gui-form.html"
};
