# Open Source Research: 协同表格 (Collaborative Spreadsheet)

> ⚠️ **已被国产化要求取代（2026-07-14）**：本研究候选（Baserow / NocoDB / Grist / Teable）多为**境外项目或 AGPL 许可**，不符合政企"国产化"硬约束（须为中国境内项目、许可支持嵌入自研产品或可商务买断）。**请勿据此选型**。explore-opensource 阶段需按国产化约束转向国产多维表格方案重新评估。详见 `issue-6/requirements/2026-07-10-collaborative-spreadsheet/` 选型原则。

## Recommendation

**Top choice:** Baserow  
**Reason:** Baserow is an open-source, self-hostable no-code database built around a spreadsheet-like interface; it directly matches the "协同表格" domain and provides the data model, permissions, real-time collaboration, and API surface we need. Mattermost is a chat/collaboration platform and is not designed for tabular data.

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
