# Open Source Research: 企业 AI 工作台一级落地页

> ⚠️ **已被国产化要求取代（2026-07-14）**：本研究候选（LibreChat / Open WebUI / LobeChat）均为**境外项目**，不符合政企"国产化"硬约束（须为中国境内项目、许可支持嵌入自研产品或可商务买断）。**请勿据此选型**。explore-opensource 阶段需按国产化约束转向国产 AI 工作台/对话框架重新评估。详见 `issue-3/requirements/github-issue-3/requirements.md` 技术集成一节。

## Recommendation

**Top choice:** LibreChat  
**Reason:** LibreChat 原生支持 Agents、MCP、Skills、Artifacts 和 Code Interpreter，与本次需求中的"分发算力、智能体、技能、插件、MCP"高度语义契合；前端基于 React/TypeScript，与 WeLink 现有 React + Webpack 技术栈最容易融合；同时提供企业级 SSO/LDAP/SAML/2FA，适合组织内部部署。

**Runner-up:** Open WebUI  
**Reason:** 社区规模最大、RAG 能力最成熟、文档与插件生态最完善，若一期最看重"开箱即用的知识库"和"稳定的多模型聊天体验"，Open WebUI 是强有力替代方案。

## Candidates

| Project | License | Stars | Business | Technical | Maintenance | Docs | Integration | Total |
|---------|---------|-------|----------|-----------|-------------|------|-------------|-------|
| LibreChat | MIT | ~40K | 5 | 4 | 4 | 4 | 3 | **4.20** |
| Open WebUI | MIT（含品牌条款） | ~140K | 4 | 3 | 5 | 5 | 3 | **4.00** |
| LobeChat | Apache 2.0 + 附加条款 | ~76K | 4 | 4 | 4 | 3 | 3 | **3.75** |

*Total = business×0.30 + technical×0.25 + maintenance×0.20 + docs×0.15 + integration×0.10.*

## Top candidate details

### 1. LibreChat

- **Repo:** https://github.com/danny-avila/LibreChat
- **Website:** https://www.librechat.ai/
- **License:** MIT（可商用、可修改、可分发）
- **Language / stack:** React + TypeScript 前端，Node.js 后端，MongoDB / PostgreSQL
- **Last pushed / activity:** 持续活跃，2025 年 ClickHouse 收购背后团队，企业级支持可期
- **Description:** "Enhanced ChatGPT Clone: Features Agents, MCP, Skills, DeepSeek, Anthropic, AWS, OpenAI, Azure, Groq, GPT-5, Mistral, OpenRouter, Gemini, Artifacts, Code Interpreter..."

**Pros:**
- **业务匹配度极高**：原生概念与本次需求几乎一一对应 —— Agents（智能体）、MCP（插件/MCP）、Skills（技能）、Artifacts（Canvas 替代品）、Code Interpreter。
- **技术栈契合**：前端是 React/TypeScript，与 WeLink 现有 React + Webpack 栈同源，最容易以"嵌入 React 路由"方式融合。
- **企业认证**：支持 OAuth、SAML、LDAP、OIDC、2FA，适合组织内部成员登录场景。
- **多模型支持**：OpenAI、Anthropic、Azure、AWS Bedrock、Groq、Mistral、DeepSeek、OpenRouter、Ollama 等，便于对接企业统一 model config。
- **数据可控**：自托管，数据留在企业基础设施内，便于将个人级使用数据写入企业后台数据库。

**Cons:**
- **RAG 不是最强**：虽然有 RAG API（LangChain + pgvector）和文件上传，但不如 Open WebUI 的 RAG 成熟。
- **嵌入成本**：产品定位为独立应用，没有官方"iframe 组件"或"React SDK"，需要自定义嵌入或 iframe 包裹。
- **Canvas 支持有限**：Artifacts 可生成 React/HTML/Mermaid/SVG，但没有原生 PPT 生成；若需求坚持 PPT，需要二次开发或插件。
- **Node.js 后端**：若企业后台以 Python/Java 为主，需要额外维护 Node 服务。

**Integration notes:**
- **推荐集成方式**：独立部署 LibreChat 后端，将其前端以 iframe 嵌入 WeLink；或基于其 React 前端做二次开发，替换/复用部分组件到 WeLink React 路由中。
- **数据收集**：利用 LibreChat 的数据库（MongoDB/PostgreSQL）和 API，将会话、Agents 调用、Skills 使用、Artifacts 生成记录同步到企业后台数据库。
- **知识库**：企业当前无独立知识库，可先用 LibreChat 内置 RAG API + 企业提供 embed 模型构建索引；若效果不满足，后续可替换为独立 RAG 服务。
- **督办场景**：可通过 MCP Server 或 OpenAPI Actions 将督办能力暴露为 Agent 工具，也可将督办页面以 iframe/动态路由方式嵌入工作台。

### 2. Open WebUI

- **Repo:** https://github.com/open-webui/open-webui
- **Website:** https://openwebui.com/
- **License:** MIT（部分商业再分发需注意品牌/商标条款）
- **Language / stack:** Svelte 前端，Python（FastAPI）后端，SQLAlchemy/Alembic，SQLite/PostgreSQL
- **Last pushed / activity:** 极其活跃，GitHub  stars ~140K，社区贡献者 400+
- **Description:** "User-friendly AI Interface (Supports Ollama, OpenAI API, ...)"

**Pros:**
- **RAG 能力最强**：内置混合搜索（BM25 + CrossEncoder），支持 9+ 向量数据库（ChromaDB、PGVector、Qdrant、Milvus 等），对"企业暂无知识库、需快速复用开源 RAG"场景非常友好。
- **社区与生态最大**：插件（Tools/Functions/Pipelines）、MCP 支持、社区 Artifacts Overhaul、Reveal.js Slide Deck Builder 等扩展丰富。
- **管理后台完善**：RBAC、用户组、模型白名单、SSO/OIDC/LDAP/SCIM、使用分析、Token/成本追踪。
- **部署灵活**：Docker/Docker Compose/Kubernetes/Helm/pip install，上手快。
- **Pipelines 框架**：可用 Python 函数自定义工作流、工具、数据处理，便于扩展。

**Cons:**
- **技术栈差异**：前端是 Svelte，与 WeLink 的 React 栈不同；若选择"完全嵌入 React 路由"方案，前端融合成本高。
- **Agents 能力较弱**：相比 LibreChat 的 Agents + MCP + Skills 体系，Open WebUI 的 agent 能力更偏向聊天+工具调用，缺少"智能体工作流"层面的抽象。
- **Canvas/Artifacts 非主流**：原生没有 ChatGPT/Claude 式的 Canvas；Artifacts 需使用社区 fork 或插件，PPT 生成也依赖 Reveal.js 插件而非原生 .pptx。
- **Python 后端**：虽然与督办现有 Python 工具链更契合，但前端嵌入成本是主要障碍。

**Integration notes:**
- **推荐集成方式**：独立部署 Open WebUI，通过 iframe 嵌入 WeLink；利用其完善的 API 和 Webhook 进行数据收集。
- **数据收集**：Open WebUI 内置使用分析（消息、Token、成本），可结合 API 将会话、RAG 查询、插件调用同步到企业后台数据库。
- **知识库**：一期可充分利用其成熟 RAG，企业只需提供 embed 模型和文档上传入口。
- **督办场景**：可通过 MCP Server 或 Pipelines 暴露督办接口，也可以 iframe 方式嵌入督办页面。

### 3. LobeChat

- **Repo:** https://github.com/lobehub/lobe-chat
- **License:** Apache 2.0 + 附加商业条款（商业化前需仔细阅读 LICENSE）
- **Language / stack:** Next.js + React + TypeScript
- **Stars:** ~76K

**Pros:**
- 前端基于 Next.js/React，与 WeLink 技术栈高度契合。
- UI 现代、PWA 体验好，插件/Agent 市场丰富。
- 支持多模型、RAG、语音、视觉、团队共享对话。

**Cons:**
- 自托管复杂度被评价为较高；企业功能（RBAC、SSO、审计）不如 LibreChat/Open WebUI 成熟。
- License 有附加条款，商业化使用需法律确认。
- 文档和社区支持相对弱于 Open WebUI。
- 没有突出的 Agents/MCP/Skills 企业级抽象。

**Integration notes:**
- 可作为 React 嵌入的候选，但企业功能和长期维护风险较高，建议作为备选而非首选。

## Build-from-scratch baseline

- **Effort estimate:** High — 需要自研对话前端、RAG、Agent/skill/MCP 插件框架、Canvas/Artifacts、应用网格、用户权限、数据收集、管理后台等。
- **Maintenance burden:** High — 需持续跟进大模型生态、RAG 技术、安全更新、前端框架升级。
- **When it wins:** 当开源方案都无法满足高度定制化的企业 AI 工作台形态，或必须完全掌控每一寸交互和数据链路时。但本期目标是"快速嵌入"，不建议从零构建。

## Next steps

1. **PM 确认推荐方案**：请确认是否采用 LibreChat 作为首选，或倾向于 Open WebUI 的 RAG 优势。
2. **POC 验证**：部署 LibreChat（或 Open WebUI）独立实例，验证以下关键能力：
   - 与企业 model config 对接
   - RAG/知识库接入企业提供 embed 模型
   - Agents/MCP/Skills 调用示例
   - 以 iframe 嵌入 WeLink 的可行性
   - 个人级使用数据的导出与写入企业数据库
3. **明确嵌入方式**：根据 POC 结果，决定"独立部署 + iframe"还是"React 组件级复用"。
4. **督办集成方案**：明确督办场景以 MCP/API/iframe 中哪种方式接入 AI 工作台。
5. **进入 product-design-docs**：在方案确认后，产出 design-review.md、feature-catalog.md、data-model.md、flows.md、feasibility.md。

## Sources

- [LibreChat GitHub repository](https://github.com/danny-avila/LibreChat)
- [LibreChat Official Docs - Agents](https://www.librechat.ai/docs/features/agents)
- [LibreChat About](https://www.librechat.ai/about)
- [Open WebUI GitHub repository](https://github.com/open-webui/open-webui)
- [Open WebUI Features](https://docs.openwebui.com/features/)
- [Open WebUI Tools / Plugins](https://docs.openwebui.com/features/extensibility/plugin/tools/)
- [Open WebUI Community Plugins](https://docs.openwebui.com/features/extensibility/community/)
- [Open WebUI vs LibreChat comparison (Pexon)](https://pexon-consulting.de/blog/librechat-vs-open-webui/)
- [OpenWebUI vs LibreChat 2026 (Requesty)](https://www.requesty.ai/blog/openwebui-vs-librechat-which-self-hosted-chatgpt-ui-is-right-for-you)
- [LobeChat GitHub repository](https://github.com/lobehub/lobe-chat)
- [LobeChat vs Open WebUI (OpenAlternative)](https://openalternative.co/compare/lobechat/vs/open-webui)
