# issue-11：EAIC 企业 IM 桌面应用

一句话背景：为现有 Mattermost B/S 二开系统打造企业自有品牌的 Windows/macOS 桌面应用，让员工无需浏览器即可收发消息、使用通讯录与 AI 表格，并完全隐藏 Mattermost 品牌痕迹。

当前阶段：**`product-design-docs`（产品设计文档阶段，等待 PM 准出）**

---

## 按角色阅读地图

| 角色 | 优先阅读 | 次要参考 |
|------|----------|----------|
| **产品经理 / 决策者** | [`designs/issue-11/design-review.md`](designs/issue-11/design-review.md) | [`requirements/2026-07-20-issue-11/prd.md`](requirements/2026-07-20-issue-11/prd.md)、[`designs/issue-11/ui-handoff.md`](designs/issue-11/ui-handoff.md) |
| **UX 设计师** | [`designs/issue-11/ui-handoff.md`](designs/issue-11/ui-handoff.md)、[`designs/issue-11/html-mockups/index.html`](designs/issue-11/html-mockups/index.html) | [`designs/issue-11/scenarios.md`](designs/issue-11/scenarios.md)、[`designs/issue-11/feature-catalog.md`](designs/issue-11/feature-catalog.md) |
| **研发工程师** | [`requirements/2026-07-20-issue-11/prd.md`](requirements/2026-07-20-issue-11/prd.md)、[`openspec/changes/issue-11-desktop-app/`](openspec/changes/issue-11-desktop-app/)、[`designs/issue-11/flows.md`](designs/issue-11/flows.md) | [`designs/issue-11/data-model.md`](designs/issue-11/data-model.md)、[`designs/issue-11/feasibility.md`](designs/issue-11/feasibility.md) |
| **QA** | [`requirements/2026-07-20-issue-11/prd.md`](requirements/2026-07-20-issue-11/prd.md) 中的验收标准、[`designs/issue-11/feature-catalog.md`](designs/issue-11/feature-catalog.md) | [`designs/issue-11/flows.md`](designs/issue-11/flows.md) |

---

## 核心产物清单

| 产物 | 路径 | 状态 | 说明 |
|------|------|------|------|
| **需求澄清** | [`requirements/2026-07-20-issue-11/prd.md`](requirements/2026-07-20-issue-11/prd.md) | ✅ PM 已确认 | 包含需求背景、用户故事、功能拆解、业务流程图、验收标准、业务规则、非功能需求 |
| **设计评审** | [`designs/issue-11/design-review.md`](designs/issue-11/design-review.md) | ✅ PM 已确认 | 面向 PM 的简洁设计评审，含目标、范围、关键决策 |
| **UI/UX 交接** | [`designs/issue-11/ui-handoff.md`](designs/issue-11/ui-handoff.md) | ✅ PM 已确认 | 面向 UX 设计师的详细交互文档，含页面清单、逐页交互说明、设计规范 |
| **交互原型** | [`designs/issue-11/html-mockups/index.html`](designs/issue-11/html-mockups/index.html) | ✅ 可用 | 可直接在浏览器打开的可点击 HTML 原型 |
| **实现提案** | [`openspec/changes/issue-11-desktop-app/`](openspec/changes/issue-11-desktop-app/) | ✅ 已生成 | OpenSpec 变更提案：能力规格、技术设计、任务清单 |
| **阶段交接** | [`handoffs/lc-handoff-product-design-docs.md`](handoffs/lc-handoff-product-design-docs.md) | ✅ 已生成 | `product-design-docs` 阶段交接报告 |

---

## 目录结构速览

```
issue-11/
├── README.md                              # 本文件：阅读入口
├── workflow-stage.yaml                    # Lincoln 阶段状态
├── documents.yaml                         # 文档索引（自动生成）
├── interviews/2026-07-20-issue-11/        # 访谈产物（摄入阶段）
├── requirements/2026-07-20-issue-11/      # 需求澄清产物
│   ├── prd.md
│   ├── requirements.md
│   └── user-stories.md
├── designs/issue-11/                      # 产品设计文档
│   ├── design-review.md
│   ├── scenarios.md
│   ├── feature-catalog.md
│   ├── data-model.md
│   ├── flows.md
│   ├── feasibility.md
│   ├── ui-handoff.md
│   └── html-mockups/index.html
├── openspec/changes/issue-11-desktop-app/ # 实现提案
├── docs/research/                         # 研究/决策记录
├── handoffs/                              # 阶段交接文档
└── archive/                               # 已归档的历史产物
```

> 被归档或移出 issue-package 的历史文件见 `archive/` 与 `.context/issue-11/`。

---

## 下一步

等待 PM 确认 `product-design-docs` 阶段 gate 后，进入 `product-prototype` 阶段，由 UX 设计师产出：

- `designs/issue-11/ui-spec.md`
- `designs/issue-11/fields.md`
- `designs/issue-11/prototype.pen`
