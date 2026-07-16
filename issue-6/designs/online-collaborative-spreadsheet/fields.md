# Fields: 在线协同多维表格 — WeLink 壳层 + 督办场景字段规格

> **阶段**:product-prototype
> **design_id**:online-collaborative-spreadsheet
> **变更**:GitHub issue #6
> **版本**:v0.1(待 PM 评审)
> **生成时间**:2026-07-15
> **范围**:WeLink 壳层字段 + Mattermost bot 通知消息字段 + 督办场景示例字段(作为 Teable 配置参考)

---

## 1. 概述

### 1.1 范围边界

本文档定义三类字段:

| 类别 | 责任方 | 说明 |
|---|---|---|
| **WeLink 壳层字段** | WeLink 客户端研发 | 导航入口、iframe 容器、顶部标题栏等壳层 UI 元素的配置字段 |
| **Mattermost bot 通知消息字段** | 督办协作后端 / bot | bot 向经办人/督办专员发送的消息内容字段 |
| **督办场景示例字段** | Teable 业务管理员 | 作为 Teable 业务模型配置参考;**用户可在 Teable 中自行调整** |

> ⚠️ **重要**:Teable 原生 UI 完全复用,不需要 WeLink 侧设计表格/表单/卡片字段。本文档第 4 章仅作为**督办业务方在 Teable 中配置表结构的参考**,不作为 WeLink 研发交付物。

### 1.2 决策依据

- 完全复用 Teable 原生 UI(决策 #1)
- 仅 PC 端(决策 #5)
- SSO 无独立登录页(决策 #2)
- 督办业务模型由用户在 Teable 中自行设计(决策 #6)
- Mattermost bot 通知 + Teable 筛选视图链接(决策 #4)

---

## 2. WeLink 壳层字段

### 2.1 左侧导航入口

WeLink 客户端左侧一级导航新增「多维表格」入口。

| 字段 | 类型 | 必填 | 默认值 | 文案 | 校验 | 错误状态 | 源数据对象 |
|---|---|---|---|---|---|---|---|
| `nav_item.id` | string | 是 | `spreadsheet` | — | 全应用唯一,kebab-case | 重复时拒绝注册 | 应用配置 |
| `nav_item.icon` | asset | 是 | 表格/网格 icon | — | SVG,24×24 viewBox | 资源缺失时回退默认 icon | 设计系统 |
| `nav_item.label` | string | 是 | 多维表格 | 多维表格 | 2–8 个汉字 | 超长截断 + tooltip 显示全文 | 应用配置 |
| `nav_item.route` | string | 是 | `/spreadsheet` | — | URL 路径,以 `/` 开头 | 路径冲突时回退 `/home` | 路由配置 |
| `nav_item.order` | number | 是 | 4 | — | ≥ 0 整数 | 重复时按字母序排 | 应用配置 |
| `nav_item.visible` | boolean | 是 | true | — | — | 为 false 时隐藏入口 | 权限服务 |
| `nav_item.badge` | object | 否 | null | — | `{count: number}` 或 `{dot: true}` | 数量 > 99 时显示「99+」 | 通知服务 |

**说明**:
- 入口图标、文案的视觉规范由 UI 团队提供(设计系统待定)。
- 入口的选中/hover/disabled 态由壳层组件库提供,详见 `ui-spec.md` §6.1。

### 2.2 主内容区 iframe 容器

| 字段 | 类型 | 必填 | 默认值 | 文案 | 校验 | 错误状态 | 源数据对象 |
|---|---|---|---|---|---|---|---|
| `iframe.src` | URL | 是 | `https://teable.{corp-domain}/workspace/{default_workspace_id}` | — | HTTPS,域名白名单 | 加载失败显示错误态(S-04) | 环境配置 |
| `iframe.sandbox` | string | 是 | `allow-same-origin allow-scripts allow-forms allow-popups allow-downloads` | — | — | 不允许空值 | 安全策略 |
| `iframe.allow` | string | 是 | `fullscreen` | — | — | — | 安全策略 |
| `iframe.title` | string | 是 | 多维表格 | 多维表格 | ≤ 50 字符 | — | 应用配置 |
| `iframe.loading_timeout_ms` | number | 是 | 15000 | — | 5000–60000 | 超时触发错误态(S-04d) | 客户端配置 |
| `iframe.theme` | enum | 是 | `auto` | — | `light` / `dark` / `auto` | 非法值回退 `auto` | 用户偏好 |
| `iframe.last_url` | URL | 否 | null | — | 同源 | 失效时回到默认 workspace | localStorage |

### 2.3 顶部标题栏(可选,默认显示)

| 字段 | 类型 | 必填 | 默认值 | 文案 | 校验 | 错误状态 | 源数据对象 |
|---|---|---|---|---|---|---|---|
| `header.visible` | boolean | 是 | true | — | — | — | 应用配置 |
| `header.title` | string | 是 | 多维表格 | 多维表格 | ≤ 20 字符 | 超长截断 | 应用配置 |
| `header.breadcrumb` | array | 否 | [] | — | 每项 ≤ 20 字符 | 超长省略中间 | postMessage |
| `header.show_breadcrumb` | boolean | 是 | false | — | — | 默认关闭以避免与 Teable 原生面包屑重复 | 应用配置 |
| `header.fullscreen_toggle` | boolean | 是 | true | — | — | — | 用户偏好 |

---

## 3. Mattermost bot 通知消息字段

### 3.1 督办通知(经办人待办提醒)

由督办协作 bot 通过 Mattermost 私聊发送给经办人。通知保留 Teable 原始通知功能,Mattermost 通知为增强通道(决策 #4)。

| 字段 | 类型 | 必填 | 默认值 | 文案示例 | 校验 | 错误状态 | 源数据对象 |
|---|---|---|---|---|---|---|---|
| `msg.bot_id` | string | 是 | `supervision-bot` | — | Mattermost 已注册 bot | 未注册时拒绝发送 | bot 配置 |
| `msg.channel` | string | 是 | DM channel id | — | bot 与经办人建立 DM | 用户离职时跳过 | Mattermost API |
| `msg.title` | string | 是 | 督办事项待填报 | 督办事项待填报 | ≤ 80 字符 | 超长截断 + 详情链接 | 督办协作后端 |
| `msg.summary` | string | 是 | — | @张三,您有 3 项督办事项待填报 | ≤ 200 字符 | — | 督办协作后端 |
| `msg.task_count` | number | 是 | — | 聚合后的待办数 | ≥ 1 | — | 督办协作后端 |
| `msg.deadline` | datetime | 否 | — | 最早截止:2026-07-20 18:00 | ISO 8601 | 超期时高亮 | 督办主表 |
| `msg.link_url` | URL | 是 | Teable 筛选视图链接 | 点击查看待办 | HTTPS,Teable 域名白名单 | 失效时回退督办主表 URL | 督办协作后端 |
| `msg.link_text` | string | 是 | 查看我的待办 | 查看我的待办 | ≤ 20 字符 | — | 文案配置 |
| `msg.actions` | array | 否 | — | [查看详情] [稍后提醒] | ≤ 3 个 | — | 文案配置 |
| `msg.priority` | enum | 是 | normal | — | `normal` / `high` / `urgent` | — | 督办协作后端 |
| `msg.silent` | boolean | 是 | false | — | — | true 时仅留消息不推送 | 用户偏好 |

**链接构造**:`link_url` 是 **Teable 筛选视图链接**,格式为 `{TEABLE_BASE}/base/{app_id}/table/{tbl_id}/view/{viw_id}?filter=...`,点击后在主视觉区打开 Teable 筛选视图(决策 #4)。

### 3.2 督办升级提醒(经办人 + 督办专员)

36h 未填报时升级提醒,收件人扩展到督办专员。

| 字段 | 类型 | 必填 | 默认值 | 文案示例 | 校验 | 错误状态 | 源数据对象 |
|---|---|---|---|---|---|---|---|
| `msg.recipients` | array | 是 | [经办人, 督办专员] | — | Mattermost user_id 列表 | 离职用户跳过 | 督办协作后端 |
| `msg.escalation_level` | enum | 是 | level_2 | — | `level_1(24h)` / `level_2(36h)` | — | 督办协作后端 |
| `msg.overdue_hours` | number | 是 | — | 已超期 36 小时 | ≥ 0 | — | 督办协作后端 |

---

## 4. 督办场景示例字段(Teable 配置参考)

> 以下内容作为**督办业务方在 Teable 中配置表结构的参考**,**不作为 WeLink 研发交付物**。Teable 原生 UI 完全复用,字段的实际呈现样式由 Teable 提供。
>
> 字段命名、字段 ID 参照 `designs/supervision-collab-va/data-model.md`(历史 Baserow 字段 ID 仅作为语义参考,实际部署需按 Teable 实际 `fld...` ID 映射)。

### 4.1 督办事项主表

| 字段名 | 类型 | 必填 | 默认值 | 校验 | 文案/示例 | 错误状态 | 源数据对象 |
|---|---|---|---|---|---|---|---|
| 任务编号 | text | 是 | — | 全局唯一,格式 `SJ\d{8}` | SJ20260750 | 重复时拒绝导入 | 业务规则 |
| 序号 | number | 是 | 自动 | ≥ 1 整数 | — | — | Teable 自动 |
| 标签 | text | 否 | — | ≤ 20 字符 | — | — | 用户填写 |
| 交办时间 | date | 是 | 当日 | 合法日期,精度到日 | 2026-07-15 | 非法日期拒绝 | 用户填写 |
| 任务来源 | text | 否 | — | ≤ 50 字符 | 区委办 | — | 用户填写 |
| 议题名称 | text | 否 | — | ≤ 100 字符 | — | — | 用户填写 |
| 交办事项 | text | 否 | — | ≤ 200 字符 | — | — | 用户填写 |
| 交办内容 | long_text | 否 | — | ≤ 5000 字符 | — | — | 用户填写 |
| 完成时限 | date | 是 | — | ≥ 交办时间 | 2026-07-30 | 早于交办时间拒绝 | 用户填写 |
| 预计完成时间 | date | 否 | — | ≥ 交办时间 | — | — | 用户填写 |
| 责任单位 | text | 是 | — | ≤ 100 字符 | XX局 | — | 用户填写 |
| 协办单位 | text | 否 | — | ≤ 200 字符 | — | — | 用户填写 |
| 区级责任人 | text | 否 | — | ≤ 50 字符 | — | — | 用户填写 |
| 部门主要领导 | text | 否 | — | ≤ 50 字符 | — | — | 用户填写 |
| 部门责任人 | text | 否 | — | ≤ 50 字符 | — | — | 用户填写 |
| 科室责任人 | text | 否 | — | ≤ 50 字符 | — | — | 用户填写 |
| 经办人及联系方式 | text | 是 | — | 含姓名 + 11 位手机号 | 张三 13800138000 | 手机号格式错误时警告(不阻断) | 用户填写 |
| **经办人账号** | multiple_collaborators | 否 | — | 绑定 Teable 用户 | — | 匹配失败留空 | Teable 自动化 |
| 部门反馈工作落实情况 | long_text | 否 | — | ≤ 5000 字符 | — | — | 经办人填报 |
| 部门反馈存在困难问题 | text | 否 | — | ≤ 500 字符 | — | — | 经办人填报 |
| 部门反馈下一步工作计划 | long_text | 否 | — | ≤ 5000 字符 | — | — | 经办人填报 |
| 进度评价 | text | 否 | — | ≤ 200 字符 | — | — | 督办专员填写 |
| 事项类别 | text | 否 | — | ≤ 50 字符 | — | — | 用户填写 |
| 板块分类 | text | 否 | — | ≤ 50 字符 | — | — | 用户填写 |
| 督办频率 | text | 否 | — | ≤ 20 字符 | 每周 / 每月 | — | 用户填写 |
| 领导批示 | long_text | 否 | — | ≤ 5000 字符 | — | — | 用户填写 |
| Created by | created_by | 自动 | — | — | — | — | Teable 自动 |
| Last modified by | last_modified_by | 自动 | — | — | — | — | Teable 自动 |
| 跟进记录表 | link_row | 自动 | — | 反向关联跟进表 | — | — | Teable 自动 |

### 4.2 跟进记录表

| 字段名 | 类型 | 必填 | 默认值 | 校验 | 文案/示例 | 错误状态 | 源数据对象 |
|---|---|---|---|---|---|---|---|
| Created on | created_on | 自动 | — | 精度到小时 | — | — | Teable 自动 |
| 任务编号(文本) | text | 是 | — | 与主表任务编号一致 | SJ20260750 | 主表不存在时拒绝 | 脚本写入 |
| UUID | uuid | 自动 | — | — | — | — | Teable 自动 |
| 任务编号(关联) | link_row | 是 | — | 关联主表对应记录 | — | 主表不存在时拒绝 | 脚本写入 |
| 部门反馈工作落实情况 | text | 否 | — | ≤ 2000 字符 | — | — | 经办人填报 |
| 部门反馈存在困难问题 | text | 否 | — | ≤ 2000 字符 | — | — | 经办人填报 |
| 部门反馈下一步工作计划 | text | 否 | — | ≤ 2000 字符 | — | — | 经办人填报 |
| Created by | created_by | 自动 | — | — | 督办 Bot | — | Teable 自动 |
| Collaborators | multiple_collaborators | 否 | — | @ 经办人 | — | 匹配失败留空 | Teable 自动化 |
| 汇报周期 | text | 否 | — | `YYYY-Www` 格式 | 2026-W28 | — | 脚本写入 |

### 4.3 关键约束

1. **任务编号唯一性**:主表「任务编号」全局唯一,用于 Excel 导入和编号跟进。
2. **导入不可失败**:即使经办人无法匹配为 Teable 用户,主表记录也必须导入成功,协作者字段留空。
3. **跟进记录关联**:脚本创建跟进记录时同时写入「任务编号(文本)」与「任务编号(关联)」。
4. **监控字段**:默认以跟进表的「部门反馈工作落实情况」「部门反馈存在困难问题」「部门反馈下一步工作计划」**全部非空**作为"已填报"判断标准。

---

## 5. 待 PM 确认事项

1. **左侧导航入口位置**:「多维表格」位于「事项」之后是否合理?是否需要调整顺序或与「AI工作台」相邻?
2. **顶部标题栏**:是否需要?是否显示面包屑(可能与 Teable 原生面包屑重复)?默认建议 `show_breadcrumb=false`。
3. **加载超时阈值**:默认 15s 是否合理?内网环境可能需要更长。
4. **bot 通知免打扰**:是否需要提供「仅 IM 推送、不弹窗」的免打扰模式?是否需要 snooze 间隔可配置?
5. **Teable 字段命名**:督办主表的字段命名(如「经办人及联系方式」)是否需要按业务习惯调整?字段类型(text vs long_text)是否符合实际数据量?
6. **bot 消息字段**:`msg.actions` 是否需要「稍后提醒」之外的快捷操作(如「标记已读」「@督办专员」)?

---

## 6. 相关文档

- `handoffs/ui-handoff-product-prototype.md` — UI handoff
- `designs/online-collaborative-spreadsheet/ui-spec.md` — UI 规格
- `requirements/2026-07-10-collaborative-spreadsheet/srs.md` — SRS §3.3 字段类型
- `requirements/2026-07-10-collaborative-spreadsheet/supervision-collab-requirements.md` — 督办协作需求
- `designs/supervision-collab-va/data-model.md` — 督办数据模型
- `designs/supervision-collab-va/integration-plan.md` — Teable 嵌入 IM 方案
