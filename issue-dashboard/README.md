# issue-dashboard · 事项看板设计 v1.2

AI+重点工作推进系统的 GUI Dashboard「事项看板」独立设计包（从 im-agent-supervision-teable-v1 复制分化，原包保持定版不动）。

## 打开方式
- 入口：`index.html` — Lincoln 门户（左侧导航 + 文档/原型画布 + 右侧注解面板），默认落地「事项看板」原型
- 原型：`prototype/kanban.html`（自包含单文件，纯 UI 无说明文字；本期无权限控制，单一最大权限视角）
- 规范：`requirements/2026-09-28-dashboard/requirements.md`（PRD v1.2，唯一权威文档：7 指标卡 + 25 列明细 + 10 项筛选 + 下钻抽屉 + 初始化规则 + 验收，口径已全部并入）、`changelog.md`（版本记录页：定版变更表格）
- md 改动后重新生成页面：`python3 tools/build_doc_pages.py <md-file>...`

## Lincoln 格式
- `documents.yaml` — 文档索引（各产物 stage / 确认状态）
- `requirements/<session-id>/` — 需求文档目录（.md 为源，.html 为生成页）
- `assets/` — 门户运行时（style.css / app.js / js/package-data.js / js/doc-render.js，与 teable-v1 同一套）
- 阶段状态（human_gate 待批）记录在 `../im-agent-supervision-teable-v1/workflow-stage.yaml`（node: pdd-issue-dashboard-v12）
