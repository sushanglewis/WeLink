# UI Handoff：在线协同多维表格 — product-prototype

> **阶段**：product-prototype（UI 设计）
> **当前进入阶段**：product-prototype
> **变更**：`online-collaborative-spreadsheet` / GitHub issue #6
> **生成时间**：2026-07-15
> **状态**：待 UI 设计师启动

---

## 1. 阶段目标

为 WeLink「在线协同多维表格」一级功能产出 UI 设计产物，供研发实现使用：
- `fields.md` — 字段规格（屏幕/表单字段、数据类型、校验、默认值、文案、错误状态）
- `ui-spec.md` — UI 规格（用户流程、屏幕清单、交互、组件状态、实现约束）
- `prototype.pen` — Pencil 可交互原型

---

## 2. 核心设计决策（PM 已确认，2026-07-15）

| # | 决策项 | 结论 |
|---|--------|------|
| 1 | **Teable UI 复用策略** | **完全复用 Teable 原生 UI**。UI 设计师只设计 IM 壳层（左侧导航入口 + iframe 容器 + 加载/错误/空状态），不设计 Teable 内部的表格/表单/卡片 UI。 |
| 2 | **SSO 与登录** | 嵌入 IM 后二次开发 SSO，**Teable 无需独立登录功能**。用户通过 WeLink/IM 登录态直接进入，无二次登录页。 |
| 3 | **督办场景界面** | 以**表格**呈现业务数据；单条数据的表单、卡片用 **Teable 原生功能**呈现，不定制 dashboard。 |
| 4 | **通知形态** | 保留 Teable 原始通知功能，同时由 **Mattermost bot** 转接发送通知。消息中包含 **Teable 筛选视图链接**，用户点击后在主视觉区的 Teable 中打开筛选视图。 |
| 5 | **多端适配** | **仅 PC 端**，暂不考虑移动端。 |
| 6 | **字段级 UI 责任** | 督办主表表头已提供（绿表表头）。**UI 设计无需关注表格设计**——应用场景中用户可自行在 Teable 中设计自己的业务模型。 |
| 7 | **设计系统** | 后续由 UI 团队提供，当前不阻塞。 |

---

## 3. UI 设计范围（UI 设计师需要画什么）

由于完全复用 Teable 原生 UI，prototype.pen 的工作量是**壳层 + 状态**，而非 Teable 内部界面。

### 3.1 必画屏幕

| 屏幕 | 内容 | 说明 |
|------|------|------|
| **WeLink 主界面 + 左侧导航** | 左侧导航含「多维表格」一级入口 | 入口图标、文案、选中态、hover 态 |
| **多维表格加载态** | 点击入口后，主内容区显示加载骨架/ spinner | iframe 加载中的过渡状态 |
| **多维表格已加载态** | 主内容区替换为 Teable iframe，显示 Teable 原生 UI | 壳层与 iframe 的边界、标题栏（可选）、全屏/退出全屏 |
| **多维表格错误态** | iframe 加载失败（网络错误、SSO 失效、Teable 服务不可用） | 错误提示文案、重试按钮、返回入口 |
| **多维表格空态** | Teable 中无数据时的引导（可选，Teable 原生已有空态） | 如需在壳层加引导，在此定义 |

### 3.2 必定义交互

| 交互 | 说明 |
|------|------|
| 点击左侧导航「多维表格」→ 主内容区切换 | 切换动画、路由变化、面包屑（可选） |
| iframe 加载完成 → 隐藏加载态 | 加载到完成的过渡 |
| iframe 加载失败 → 显示错误态 | 超时阈值、错误分类（网络/SSO/服务） |
| Mattermost bot 通知点击 → 主视觉区打开 Teable 筛选视图 | 链接跳转、筛选参数传递、视图定位 |
| 主题切换（明/暗） | 壳层与 Teable 的主题同步机制（postMessage） |

### 3.3 不需要画的内容（明确排除）

- Teable 内部的表格视图、表单视图、看板/日历/画廊视图（原生复用）
- 督办专员 dashboard（不定制，用 Teable 原生表格）
- 经办人填报表单（用 Teable 原生表单视图）
- 字段配置界面（用户在 Teable 后台自行配置）
- 移动端任何界面（仅 PC）

---

## 4. fields.md 输入（字段规格参考）

UI 设计师编写 fields.md 时，以下信息可从现有文档提取：

| 来源文档 | 可提取内容 |
|----------|-----------|
| `requirements/2026-07-10-collaborative-spreadsheet/srs.md` §3.3 | 字段类型清单（文本、数字、日期、协作人、公式、关联等） |
| `requirements/2026-07-10-collaborative-spreadsheet/srs.md` REQ-DM 系列 | 数据模型约束（字段类型、表关联、不可合并单元格） |
| `requirements/2026-07-10-collaborative-spreadsheet/supervision-collab-requirements.md` | 督办主表/跟进表的具体字段（含绿表表头） |
| `designs/supervision-collab-va/data-model.md` | 督办场景数据模型 |

**注意**：由于用户可自行在 Teable 中设计业务模型，fields.md 不需要穷举所有字段，只需定义**壳层相关字段**（导航入口、通知消息字段）和**督办场景的示例字段**（作为 Teable 配置的参考）。

---

## 5. ui-spec.md 输入（UI 规格参考）

| 来源文档 | 可提取内容 |
|----------|-----------|
| `designs/supervision-collab-va/integration-plan.md` | 嵌入架构、SSO 对接、iframe 尺寸与主题、壳层与 Teable 的边界 |
| `requirements/2026-07-10-collaborative-spreadsheet/srs.md` REQ-VW 系列 | 视图能力要求（作为 Teable 原生能力的验收基线） |
| `designs/supervision-collab-va/flows.md` | 系统流程（作为交互设计的参考） |
| `designs/supervision-collab-va/scenarios.md` | 用户场景 |

---

## 6. 关键约束

1. **仅 PC 端**：不考虑响应式或移动端适配。
2. **完全复用 Teable 原生 UI**：不重新设计 Teable 内部界面。
3. **SSO 无登录页**：嵌入后 Teable 无独立登录功能，UI 设计师不需要画登录页。
4. **设计系统待定**：视觉风格、颜色、字体、组件库后续由 UI 团队提供。当前 prototype.pen 可用中性占位样式。
5. **Mattermost bot 通知**：通知消息的 UI 由 IM 侧定义，UI 设计师只需定义消息中包含的 Teable 链接格式和跳转行为。

---

## 7. 待 UI 设计师产出的产物清单

| 产物 | 路径 | 说明 |
|------|------|------|
| `fields.md` | `designs/online-collaborative-spreadsheet/fields.md` | 壳层字段 + 督办场景示例字段规格 |
| `ui-spec.md` | `designs/online-collaborative-spreadsheet/ui-spec.md` | 屏幕清单、交互、组件状态、实现约束 |
| `prototype.pen` | `designs/online-collaborative-spreadsheet/prototype.pen` | Pencil 原型（壳层 + 状态） |

**注意**：`designs/online-collaborative-spreadsheet/` 是 `design_id`，与 `supervision-collab-va/`（督办场景设计）并列。UI 设计产物应放在 `online-collaborative-spreadsheet/` 下。

---

## 8. 相关文档索引

- `requirements/2026-07-10-collaborative-spreadsheet/srs.md`
- `requirements/2026-07-10-collaborative-spreadsheet/feature-requirements.md`
- `requirements/2026-07-10-collaborative-spreadsheet/supervision-collab-requirements.md`
- `designs/supervision-collab-va/integration-plan.md`
- `designs/supervision-collab-va/design-review.md`
- `designs/supervision-collab-va/data-model.md`
- `designs/supervision-collab-va/flows.md`
- `designs/supervision-collab-va/scenarios.md`
- `designs/supervision-collab-va/feature-catalog.md`
- `designs/supervision-collab-va/feasibility.md`
- `docs/research/collaborative-spreadsheet-oss-options.md`

---

**PM 确认**：本 handoff 已基于 2026-07-15 确认的 6 项设计决策编写。UI 设计师可按此范围启动 product-prototype 阶段。
