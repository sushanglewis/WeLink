# Feasibility: Teable + Mattermost 督办协作系统

> **⚠️ 选型更新(2026-07-15)**:本文档基于 Baserow 的具体实例编写,**选型已更新为 [Teable](https://github.com/teableio/teable)**。文档中的可行性论证框架(业务、技术、运维)仍可参考,但具体工具链与版本号需按 Teable 实际能力重新核对。Baserow 仅保留作为功能完备性参照基线(见 SRS §1.3)。

## 业务可行性

- **需求来源明确**：督办协作是政府/企业常见的任务闭环场景，存在"派发—跟进—提醒—反馈"的固定模式。
- **用户路径清晰**：督办专员通过 Mattermost 批量操作，经办人通过 Mattermost 接收通知并登录 Teable 填报，符合现有工作习惯。
- **Teable 已承载数据**：主表与跟进表已存在且已建立 Link to table 关联，无需从零设计数据库。
- **风险点**：Excel 模板格式、经办人账号映射、汇报周期定义需要在开发前与业务方确认。

## 技术可行性

- **Mattermost Bot**：`mattermostdriver` 官方库支持 Bot 账号、DM 发送、文件下载，技术成熟。
- **Teable API**：提供标准的 REST API 和 Webhook，支持批量创建、字段过滤、协作者写入。
- **延时任务**：Celery + Redis 方案成熟，支持任务持久化、取消、延迟执行，满足 24h/36h 监控需求。
- **Excel 解析**：Python `pandas` + `openpyxl` 可稳定解析 `.xlsx`，支持错误行定位。
- **部署**：可通过 Docker Compose 统一部署 Bot、Webhook、Celery Worker、Redis。

## 开源项目与 MCP 调研

### Teable

- **官方 RESTful OpenAPI**:Teable 基于 OpenAPI(Swagger)提供完整 REST API,覆盖 CRUD、列出 base/表、获取表结构等操作。文档:https://help.teable.io/en/api-doc/token
- **社区 MCP Server / SDK**:社区提供 Teable MCP Server 与 Python SDK,适合脚本化调用与 Agent 编排。具体可用性与版本需在 PoC 阶段验证。
- **官方 OpenAPI 客户端**:若社区 SDK 不满足需求,可直接调用 Teable RESTful OpenAPI。

### Mattermost

- **官方 MCP Server**：Mattermost v11.2+ 提供官方 MCP Server，支持外部 AI 客户端通过 HTTP endpoint 或 OAuth/PAT 访问。文档：https://docs.mattermost.com/administration-guide/configure/agents-admin-guide.html
- **`mattermostdriver`**：官方 Python 驱动，覆盖 Mattermost REST API，适合作为备选通知通道。

### 研究文档

详见 `docs/research/collaborative-spreadsheet-oss-options.md`。

## 技术框架

| 层级 | 选型 | 理由 |
|------|------|------|
| Bot 框架 | `mattermostdriver` | 官方 Python 驱动，覆盖 Mattermost Bot API |
| Webhook 服务 | FastAPI + Uvicorn | 异步、轻量、自动 API 文档 |
| 延时任务 | Celery + Redis | 需求文档推荐，支持持久化和取消 |
| Excel 解析 | pandas + openpyxl | 成熟稳定，社区广泛 |
| 配置管理 | Pydantic Settings | 类型安全、环境变量注入 |
| 日志 | structlog | 结构化日志，便于观测 |
| 部署 | Docker Compose | 一键启动所有依赖服务 |

## 结论

技术方案可行，业务价值明确。建议在确认 Excel 模板、账号映射、汇报周期、URL 形态等 7 个待确认事项后进入研发实现。
