# Open Source Research: 协同表格 (Collaborative Spreadsheet)

> ✅ **选型已确定（2026-07-15）**:经国产化约束筛选与 PM 决策,**最终选型为 [Teable](https://github.com/teableio/teable)**(中国境内项目,AGPL-3.0,可通过商务合作获取商业授权)。本报告保留 Baserow / NocoDB / Grist 等境外候选作为**功能完备性参照基线**与历史评估记录,具体实现按 Teable 重新设计。详见 `issue-6/requirements/2026-07-10-collaborative-spreadsheet/` 选型原则与 SRS §1.3。

## Recommendation

**Final choice (2026-07-15):** [Teable](https://github.com/teableio/teable)
**Reason:** Teable 是中国境内研发的多维表格项目,满足政企"国产化"硬约束;提供工作空间/应用/表/视图/字段/记录完整数据模型、实时协同、权限系统、REST API 与 Webhook,可作为 WeLink 多维表格一级功能的底层实现。许可为 AGPL-3.0,商业嵌入需通过商务合作获取授权。

**Previous top choice (superseded):** Baserow(荷兰,MIT/企业版付费)。因不符合国产化约束,不再作为选型;保留作为功能完备性参照基线(见 SRS §1.3)。

## Candidates

| Project | License | Stars | Business | Technical | Maintenance | Docs | Integration | Total |
|---------|---------|-------|----------|-----------|-------------|------|-------------|-------|
| Baserow | MIT | 5,196 | 5 | 4 | 4 | 4 | 3 | **4.20** |
| Mattermost | Mixed (AGPLv3 / MIT / Source Available) | 38,248 | 2 | 3 | 5 | 4 | 3 | **3.25** |

*Total = business×0.30 + technical×0.25 + maintenance×0.20 + docs×0.15 + integration×0.10.*

## Top candidate details

### 1. Baserow

- **Repo:** https://github.com/baserow/baserow
- **Local clone:** `.context/oss-research/baserow/`
- **License:** MIT for the open-core non-premium features (enterprise features are paid)
- **Language / stack:** Python (Django / Django REST Framework), Vue 3 / Nuxt 3, PostgreSQL, Redis, Celery
- **Last pushed:** 2026-06-29
- **Description:** "Build databases, automations, apps & agents with AI — no code. Open source platform available on cloud and self-hosted. GDPR, HIPAA, SOC 2 compliant. Best Airtable alternative."

**Pros:**
- Spreadsheet/database hybrid is the core product — business fit is very high.
- Self-hostable via Docker, Docker Compose, Helm, Heroku, Render, AWS, etc.
- Headless and API-first; exposes REST API and OpenAPI schema.
- Built-in views (grid, form, kanban, dashboard) and permission system.
- Active development and clear product direction (AI assistant Kuma, application builder, automations).

**Cons:**
- Enterprise-grade features (SSO, audit logs, advanced permissions) are paid.
- Full self-hosted deployment requires PostgreSQL + Redis + Celery, so ops cost is non-trivial.
- Frontend is Vue/Nuxt; if our stack differs, UI customization requires learning its module system.

**Integration notes:**
- Best integrated as a backend service or iframe-embedded component for spreadsheet views.
- Use the REST API (`https://api.baserow.io/api/redoc/`) to sync records with our application.
- For real-time collaboration, evaluate Baserow’s built-in collaboration model vs. exposing its data through our own WebSocket layer.

### 2. Mattermost

- **Repo:** https://github.com/mattermost/mattermost
- **Local clone:** `.context/oss-research/mattermost/`
- **License:** Mixed — source under AGPLv3, compiled releases under MIT, enterprise plugins under Mattermost Source Available License
- **Language / stack:** Go, React / TypeScript, PostgreSQL
- **Last pushed:** 2026-06-30
- **Description:** "Mattermost is an open source platform for secure collaboration across the entire software development lifecycle."

**Pros:**
- Very mature, high community activity (38k+ stars), monthly releases.
- Strong self-hosting story: single Linux binary, Docker, Kubernetes, Helm.
- Rich API, webhooks, slash commands, apps framework, and plugin marketplace.
- Excellent for messaging, workflow automation, and DevSecOps use cases.

**Cons:**
- Core value proposition is team chat and communication, not structured data or spreadsheets.
- No native tabular data / database / spreadsheet feature in the main repo (Focalboard, a kanban/board tool, is a separate project).
- License mix is complex; enterprise features require Source Available license review.

**Integration notes:**
- Mattermost could serve as a **notification/comment/chat layer** around a collaborative spreadsheet, but it is not a substitute for the spreadsheet itself.
- If we only need embedded chat/comments inside a spreadsheet, Mattermost’s plugin/apps framework could be considered, but a lighter integration (e.g., Slack/Discord-style webhook) may be simpler.

## Build-from-scratch baseline

- **Effort estimate:** High — would require designing a real-time collaborative data grid, CRUD API, permission model, change history, formula engine, and import/export.
- **Maintenance burden:** High — ongoing security, performance, and feature parity with user expectations (Airtable-like experience).
- **When it wins:** Only if the product vision diverges strongly from existing no-code database paradigms, or if we must own the entire data stack end-to-end without third-party dependencies.

## Next steps

1. **Confirm the scope of 协同表格** with the PM: is it a full Airtable-like no-code database, a simpler shared spreadsheet, or a data grid embedded in a larger workflow?
2. If the scope is database-like, **spike a Baserow self-hosted deployment** and prototype an API integration with our stack.
3. If chat/commentary around spreadsheet rows is required, **evaluate Mattermost as a secondary integration**, not the primary data store.
4. Review Baserow’s enterprise feature matrix against our permission/auditing requirements before committing to the open-core edition.

## Sources

- [Mattermost GitHub repository](https://github.com/mattermost/mattermost)
- [Mattermost editions and licensing](https://docs.mattermost.com/product-overview/editions-and-offerings.html)
- [Baserow GitHub repository](https://github.com/baserow/baserow)
- [Baserow user documentation](https://baserow.io/user-docs/baserow-basics)
- [Baserow API documentation](https://api.baserow.io/api/redoc/)
