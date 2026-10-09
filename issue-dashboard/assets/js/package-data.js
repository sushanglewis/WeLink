/* issue-dashboard · 门户导航数据（v1.2）
 * 信息架构：产品需求（PRD，含指标口径）→ 交互原型 → 版本记录。
 * 每条注解 ≤3 句；PRD 与版本记录以 .md 为源文件，html 页由 tools/build_doc_pages.py 生成。 */
window.LINC_PACKAGE = {
  "process_slug": "issue-dashboard",
  "issue_number": "",
  "current_stage": "product-design-docs",
  "status": "in_progress",
  "generated_at": "2026-10-08T09:30:00Z",
  "landing": "requirements/2026-09-28-dashboard/requirements.html",
  "nav": [
    {
      "group": "产品需求",
      "items": [
        {
          "path": "requirements/2026-09-28-dashboard/requirements.html",
          "label": "事项看板 PRD",
          "title": "事项看板 · 产品需求文档",
          "group": "产品需求",
          "stage": "product-design-docs",
          "version": "v1.2",
          "status": "draft",
          "purpose": "唯一权威文档：背景与数据来源、7 张指标卡口径、25 列明细、10 项筛选、下钻抽屉、跟进记录初始化规则、权限与验收，全部口径已并入本文，无需跳转其他文档。",
          "refs": ["requirements/2026-09-28-dashboard/requirements.md"]
        }
      ]
    },
    {
      "group": "交互原型",
      "items": [
        {
          "path": "prototype/kanban.html",
          "label": "事项看板原型",
          "title": "事项看板原型 v1.2",
          "group": "交互原型",
          "stage": "product-design-docs",
          "version": "v1.2-proto",
          "status": "draft",
          "purpose": "可交互高保真原型：7 指标卡 + 25 列明细 + 行下钻抽屉，按 PRD 逐条实现；验收以 PRD 第八章为准。",
          "refs": ["requirements/2026-09-28-dashboard/requirements.md"]
        }
      ]
    },
    {
      "group": "版本记录",
      "items": [
        {
          "path": "changelog.html",
          "label": "版本记录 v1.2",
          "title": "版本记录（issue-dashboard）",
          "group": "版本记录",
          "stage": "product-design-docs",
          "version": "v1.2",
          "status": "draft",
          "purpose": "定版变更与补充说明的唯一来源：v1.2 六项定版内容以表格归档，条目与 PRD 章节一一对应。",
          "refs": ["changelog.md"]
        }
      ]
    }
  ]
};
