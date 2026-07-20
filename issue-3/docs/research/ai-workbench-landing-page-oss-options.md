# Open Source Research: 企业 AI 工作台一级落地页

> ✅ **国产化选型研究(2026-07-16 修订,推荐待 PM 确认)**:本报告**替代** 2026-07-14 前的境外候选评估(LibreChat / Open WebUI,彼时 LobeChat 被误并归为境外)。按国产化硬约束转向中国境内项目重评。
>
> **当前推荐(待 PM 确认后定稿):Top choice = [WeKnora(腾讯)](https://github.com/Tencent/WeKnora);Runner-up = [LobeChat](https://github.com/lobehub/lobehub);知识库引擎增强(组合退路)= [RAGFlow(英飞流)](https://github.com/infiniflow/ragflow)。** 境外候选保留为功能完备性参照基线(附录 B)。遵循 explore-opensource 规范:**最终选型绑定需 PM 确认**。
>
> **本轮修订要点**:①采纳 PM 新增的**维护时效硬约束**(最近更新 ≤7 天,优质项目 ≤30 天),用 GitHub API `pushed_at` 逐一复核——原首选 Coze Studio(2026-04-20,87 天未更)出局;②对最终两名候选做了源码级深挖(`gh api` 直读),确认 **WeKnora 知识库全员治理与嵌入免登全在开源标准版**,而 LobeChat 该能力落在企业版 + 信创合规存实质障碍,故首选易位为 WeKnora。

## Recommendation

**Top choice:** [WeKnora(腾讯)](https://github.com/Tencent/WeKnora)
**Reason:** 在全部国产候选中,WeKnora 是**唯一同时满足 6 项硬约束**(含时效)的项目——腾讯自研(国产化无疑义,且是**微信对话开放平台的底层框架**,生产在用)、**核心功能全部 MIT 开源且无企业版付费墙**、**昨天仍在更新**(2026-07-15)、**ReAct agent harness(非 workflow 编排)**,尤其**知识库"管理员统一构建、全员开箱即用"的双层治理(Tenant+Organization、owner/admin/editor/viewer 四角色、共享空间、审计日志)完整落在开源标准版**——这正是 WeLink 的核心诉求,且**嵌入与免登是一等公民设计**(`/embed/*` 刻意可跨域 iframe + 安全模式 token 交换免登 + OIDC SSO),与 WeLink"统一门户 iframe 嵌入 + 用户免登"的集成方式天然契合。

**Runner-up:** [LobeChat](https://github.com/lobehub/lobehub)
**Reason:** 技术栈(React/Next.js)与 WeLink 同源、**最纯粹的 agent harness 对话工作台**(完全无 workflow 编排)、~80K stars 最活跃、今天更新、MCP/插件/助手市场生态丰富。但源码级核查发现**两座大山**,暂列备选:①**知识库"统一构建→发布到工作区→全员可用 + RBAC"在专有 `business-server` 包(`private:true`、无 license),属企业版**,开源社区版知识库是个人级——与 WeLink 核心诉求直接冲突;②**版权主体仅美国 LobeHub LLC,查无中国法律实体、无权威政企/信创案例**,组件嵌入/白标须商业授权且无公开报价,信创合规存实质障碍。

**知识库引擎增强(组合退路):** [RAGFlow(英飞流)](https://github.com/infiniflow/ragflow) — 若一期 POC 发现 WeKnora 知识库治理或检索质量不达标,引入 RAGFlow 作**独立知识库引擎**经 MCP/HTTP API 接入。其 DeepDoc 深度文档理解(23+ 格式)为全部候选中最强,Apache-2.0 可直商用,自带 agent 虽为画布编排,但作纯检索后端不受影响。

## 选型约束(硬约束,缺一不可)

| # | 约束 | 口径 |
|---|------|------|
| 1 | **国产化** | 中国境内研发项目(信创/自主可控),公司主体与研发团队均在境内 |
| 2 | **核心功能开源** | 允许 open-core,但一期所需能力(多轮对话/知识库/Agent/技能)须在开源版完整可用,不被锁进企业版/高级版付费墙(同 issue-6 teable 口径) |
| 3 | **许可证** | 沿用 teable 模式:接受 copyleft(AGPL/GPL),通过商务合作买断以嵌入自研产品;宽松许可(Apache/MIT)可直商用者优先 |
| 4 | **可嵌入 WeLink** | web 端,支持 iframe 嵌入或 React 组件级复用(WeLink 栈:React 18 + TS 5.6 + react-router v5) |
| 5 | **agent harness 模式** | agent 运行时驱动工具调用(LLM 调用循环、工具/skill 调用、上下文管理、MCP);**排除 dify 式可视化工作流(workflow DAG)编排为架构核心的项目** |
| 6 | **维护时效**(PM 新增) | 最近更新(`pushed_at`)**≤7 天**;优质项目可放宽至 **≤30 天**。基准日 2026-07-16 |

> 产品形态(来自 PM 澄清):对话式工作台(输入需求→得答案)+ @智能体、/调用技能、选知识库、上传文件;智能体统一维护分发、**对接已部署的 skillshub(技能市场)**;知识库需**像 dify 那样管理员统一构建、全员可用、开箱即用**。

## Candidates(评分含时效复核)

评分维度:business 30% / technical 25% / maintenance 20% / docs 15% / integration 10%,各 1-5 分。`pushed_at` 为 GitHub API 权威值。

| Project | License | 主体(境内) | pushed_at | 时效 | Business | Technical | Maintenance | Docs | Integration | Total |
|---------|---------|-----------|-----------|------|----------|-----------|-------------|------|-------------|-------|
| **WeKnora** | MIT(核心) | 腾讯 ✓ | 2026-07-15 | ✓ | 5 | 3 | 5 | 4 | 4 | **4.25** |
| **RAGFlow**(知识库引擎) | Apache-2.0 | 英飞流·上海 ✓ | 2026-07-16 | ✓ | 4 | 4 | 5 | 4 | 4 | **4.20** |
| **LobeChat** | Apache-2.0+附加 | 团队境内/实体美国LLC △ | 2026-07-16 | ✓ | 3 | 5 | 5 | 4 | 2 | **3.95** |
| **Bisheng 毕昇** | Apache-2.0 | 数据壹生·北京 ✓ | 2026-07-16 | ✓ | 3 | 4 | 4 | 3 | 2 | **3.35** |
| ~~Coze Studio~~ | Apache-2.0 | 字节跳动 ✓ | **2026-04-20** | ✗(87天) | — | — | — | — | — | **时效出局** |

> **RAGFlow 角色说明**:RAG/知识库引擎最强、可纯作独立检索后端(HTTP API + MCP Server),但自带 agent 为画布/workflow 编排(不符约束 5),故**不作一体化工作台推荐**,仅作组合方案知识库引擎。**LobeChat** 的 business 扣分源于"知识库全员治理在企业版"(一期核心诉求开源版不满足),integration 扣分源于"信创合规 + 白标买断 + 嵌入非一等公民"。**Bisheng** 主体仍是 workflow 编排平台、嵌入以链接+API 为主、原生 MCP 未确证。**Coze Studio** 功能虽契合,但 87 天未更新,不满足约束 6,直接出局。

## Top candidate details

### 1. WeKnora(腾讯)— 推荐首选

- **Repo:** https://github.com/Tencent/WeKnora(2025-07 创建,最新 v0.6.3)
- **开发主体/国产化:** **腾讯**自研,是**微信对话开放平台(chatbot.weixin.qq.com)的底层技术框架**,生产在用;中文文档/社区,支持国产模型(DeepSeek/Qwen/Zhipu/Hunyuan/豆包)。国产化无疑义。
- **License:** **核心 MIT,无附加限制**(已读 LICENSE 原文:"Tencent does not impose any additional limitations");后附第三方组件清单(Apache-2.0 等宽松许可)。**可自由嵌入自研闭源 WeLink,无需买断**。*(POC 待办:逐行核第三方组件附录,确认无 copyleft 组件。)*
- **活跃度:** **昨天更新(2026-07-15)**,18.4K stars / 2.5K forks,约一年内 v0.2.10→v0.6.3,CHANGELOG 每版详尽,腾讯持续投入。

**Pros(对照一期需求与硬约束):**
- **知识库全员治理(决定性优势,全在开源标准版):** Tenant(空间)+ Organization(组织)双层模型;`owner/admin/editor/viewer` 四角色;知识库/智能体可**共享到组织**(`POST /knowledge-bases/:id/shares`)、设**内置资源全员可见**;含共享空间与审计日志。**"管理员建一次库、全员开箱即用"成立**,命中 WeLink 核心诉求(对照:LobeChat 此项锁企业版)。
- **嵌入 + 免登一等公民:** v0.6.3 头条特性 Website Embed Widget;`/embed/*` 页面**刻意不设 X-Frame-Options** 可跨域 iframe;**安全模式 token 交换**(`embed/<id>/exchange`)支持"先校验访客登录态、再发 ems_ 短令牌"——**正是 WeLink 用户免登进入 AI 工作台的关键链路**;另有完整 **OIDC SSO**(可对接 WeLink 账号体系)。
- **agent harness(非 DAG):** ReAct(smart-reasoning)+ RAG(quick-answer)双模式;支持 @智能体、选知识库、上传文件、引用气泡、RAG 进度时间线;自定义智能体可共享分发。
- **skillshub 对接双路径:** ①MCP client 完整(SSE/HTTP-streamable、api_key/token/OAuth2、**逐工具人工审批**治理);②Agent Skills 采用 **Anthropic SKILL.md 约定** + 沙箱执行,与技能市场形态同构。
- **embed 模型可自配:** 任意 OpenAI 兼容端点 / Ollama / BGE / GTE,企业可全自托管 embedding。
- **文档解析:** PDF/Word/Markdown/Excel/PPT/图片(OCR)/扫描件等 10+ 格式,解析引擎可插拔(Simple/高精度/MinerU/PaddleOCR-VL)。

**Cons / 风险:**
- **前端是 Vue 3,无 React(唯一实质短板):** WeLink(React 18)**只能 iframe 或框架无关 widget.js 嵌入,无法 React 组件级深度内嵌**。但约束 4 满足(iframe 即可),且与 WeLink 既定 iframe 嵌入集成方式一致;若长期需原生 React 体验,可自研前端调其完整 REST API(成本较高)。
- **MCP stdio 在服务端被禁用:** 若 skillshub 仅提供 stdio 传输,需改用 SSE/HTTP-streamable 或适配层(POC 实测)。
- **相对年轻(约 1 年):** 387 open issue;企业级打磨(权限边界、稳定性、性能基线)需 POC 压测验证。
- 多副本人工审批等待态依赖 Redis Pub/Sub(部署注意);README 个别文档链接失效(文档维护小瑕疵)。

**Integration notes:**
- **推荐集成方式:** 自托管 WeKnora(Docker Compose/Helm),经 **iframe 嵌入 `/embed/*` 或 widget.js** 到 WeLink"AI 工作台"一级页面;**WeLink 后端调 `embed/<id>/exchange` 安全模式实现免登**(断言用户身份后代为换取嵌入会话令牌)。
- **知识库:** 管理员在 WeKnora 建组织→共享 KB→成员按角色访问;embed 模型接企业自托管端点。
- **skillshub:** 将 skillshub 技能以 MCP(SSE/HTTP + OAuth2)形态接入,用人工审批做治理;或直接挂载 SKILL.md 目录。
- **数据采集:** 经完整 REST API/Webhook 将会话、skill 调用、知识库使用记录同步到企业后台数据库。

### 2. LobeChat — Runner-up(技术备选,两座大山待解)

- **Repo:** https://github.com/lobehub/lobehub(原 `lobehub/lobe-chat` 已迁移为 monorepo,default branch `canary`,稳定版走 `v2.2.x` tag)
- **开发主体/国产化(nuance):** **研发团队在中国**(创始人 arvinxx/许文豪,蚂蚁/百川背景),但 **LICENSE 版权主体为美国 LobeHub LLC,查无公开中国法律实体、无权威政企/信创采用案例**。
- **License:** **Apache-2.0 + 附加条款**(LobeHub Community License):不改源码的商业使用免费;**二次开发/白标/组件级嵌入自研商业产品 = 衍生作品,必须商业授权**(hello@lobehub.com),且**无公开报价**;producer 可单方调整协议。
- **活跃度:** **今天更新(2026-07-16)**,79.9K stars,canary 每日多次预发布 + `v2.2.x` 稳定 tag,治理健康。

**Pros:**
- **最纯粹的 agent harness 对话工作台:** 官方自述"LobeChat 是面向终端用户的 AI Chat 客户端",**完全无 workflow 编排**,正是"输入需求→得答案"目标形态。
- **React/Next.js 栈与 WeLink 同源**,功能覆盖面广(对话、@智能体/多智能体群组、/技能、知识库 RAG、文件、MCP/插件、企业 IM 渠道适配)。
- **政企账号对接面友好:** better-auth + Generic OIDC + casdoor/keycloak/logto/飞书/微信,SSO-only 可配。
- **维护活跃、时效达标。**

**Cons / 风险(两座大山):**
- **①知识库全员治理在企业版(与核心诉求冲突):** 源码级核查(`packages/database` schema + `business-server`)——开源社区版知识库是**个人级**(userId 作用域);"发布到工作区→全员可用 + Owner/Member/Viewer RBAC"实现在专有 `@lobechat/business-server`(`private:true`、无 license、不随 Apache 授权),由默认关闭的 `workspace` feature flag + 商业授权门控。**WeLink 要的 dify 式"管理员统一构建全员可用"落在企业版。**
- **②信创合规存实质障碍:** 版权主体仅美国 LobeHub LLC,无中国运营主体,无权威政企/信创案例;衍生作品授权依赖美国主体且条款可单方调整,政企"自主可控"审查难过。
- 许可非纯 Apache:组件级嵌入/白标必须商业授权且无公开报价;嵌入非一等公民(无 `ALLOWED_IFRAME_ORIGINS`,iframe 需关 CSP 自建 SSO 免登);发布重心偏 Desktop/Cloud。

**Integration notes:**
- 仅当"待核实项"解决后才可升级:①向 hello@lobehub.com 询"闭源自研组件级嵌入/白标 + 企业版(知识库工作区治理 + 用户管理 + 私有化)"报价,确认有无中国签约主体;②法务就"美国 LLC + 附加条款"出信创合规意见;③POC 实测开源版强行开启 `workspace` flag 后,知识库"发布到工作区 + RBAC"能否脱离云计费独立跑通。

## 与现有技术栈(Mattermost + Teable)兼容性

> 针对 PM 关切"选型与现有 mattermost+teable 栈的兼容性",逐层对照(WeKnora 栈来自 `docker-compose.yml`/`.env.example`/深挖,现有栈来自 `issue-3/designs/.../tech-stack.md` 与 Teable 集成方案)。

**现有栈:** WeLink 自研前端 React 18 + TS 5.6 + react-router v5;WeLink 后端 Spring Cloud + Nacos + MySQL 8.0 + Redis 7 + MinIO;Mattermost(已改造嵌入自研前端)= Go 后端 + React webapp + PostgreSQL;Teable(多维表格,已选定)= Next.js/Node + PostgreSQL,iframe 嵌入 + SSO。

**WeKnora 栈:** 后端 Go(Gin);前端 **Vue 3**;ParadeDB(PostgreSQL 17 + pgvector,默认一体库,可换 MySQL);Redis 7;存储 local/**minio**/s3/cos/tos;OIDC SSO + embed token 免登 + API Key;Docker Compose / Helm。

| 层 | 现有栈 | WeKnora | 兼容性 |
|----|--------|---------|--------|
| 前端框架 | React 18(WeLink/Mattermost/Teable 均 React) | **Vue 3** | △ **唯一显著差异**;但 iframe 嵌入模式下前端栈异构无影响(见下) |
| 后端语言 | Java/Spring Cloud(WeLink);Go(Mattermost) | Go(Gin) | ✓ 与 Mattermost 同语言;独立服务经 API/OIDC 集成 |
| 关系数据库 | PostgreSQL(Mattermost/Teable);MySQL 8.0(WeLink) | ParadeDB(PostgreSQL 17);亦支持 MySQL | ✓ 与 Mattermost/Teable 同为 PostgreSQL 系,运维一致;可选 MySQL 对齐 WeLink |
| 缓存 | Redis 7(WeLink) | Redis 7 | ✓ 一致,可复用 |
| 对象存储 | MinIO(WeLink) | 支持 **minio**/local/s3/cos/tos | ✓ 可直接复用 WeLink MinIO |
| 向量检索 | —(新增能力) | ParadeDB pgvector(默认);可换 qdrant/milvus/weaviate | ✓ 新增组件,无冲突 |
| 认证/SSO | Mattermost 用户体系;Teable 用 OIDC/Keycloak | OIDC SSO + embed token 免登 + API Key | ✓ 与 Teable 方案 OIDC/Keycloak 思路一致;embed 免登契合 WeLink 门户 |
| 部署 | Docker/K8s(Mattermost/Teable) | Docker Compose / Helm | ✓ 一致 |

**兼容性结论:**
1. **唯一显著差异是前端 Vue(全家均为 React)**。但集成方式为 **iframe 嵌入** —— WeKnora 前端跑在 iframe 内、WeLink 外壳用 React,两者经 iframe + postMessage 隔离,**前端栈异构不产生冲突**。这与"已将 Mattermost 嵌入自研前端""Teable 方案 iframe 嵌入"是**同一模式**,团队已有成熟的异构前端 iframe 集成经验。仅当未来追求"React 组件级原生内嵌"时,Vue 才构成成本(需自研前端调其完整 REST API)。
2. **基础设施层高度兼容、可复用**:PostgreSQL(与 Mattermost/Teable 同)、Redis 7(与 WeLink 同)、MinIO(与 WeLink 同,`STORAGE_TYPE=minio` 直接复用)。
3. **后端 Go 与 Mattermost 同语言**;虽与 WeLink Java/Spring Cloud 异构,但 AI 工作台作为独立服务部署、经 API/OIDC 集成,与 Mattermost/Teable 的"独立服务 + iframe/API + SSO"模式完全一致,WeLink Java 后端只做网关与用户映射。
4. **与 Teable 协同**:Teable 作多维表格数据层(督办),WeKnora 作 AI 工作台入口(对话+知识库+agent);二者均为"独立服务 + iframe 嵌入 + OIDC SSO",模式统一;督办场景中 WeKnora 的 agent 可经 MCP/API 调 Teable 数据(与 issue-6 督办集成路径一致)。

## 一体化 vs 组合方案

| 方案 | 构成 | 优点 | 缺点 | 建议 |
|------|------|------|------|------|
| **A. 一体化:WeKnora** | 单一平台承载对话工作台 + 知识库全员治理 + agent + 技能分发 | 6 项硬约束全满足;知识库治理+嵌入免登全在开源版;MIT 无需买断;腾讯信创无疑义 | 前端 Vue(只能 iframe/widget);新项目需 POC 压测 | **本期首选** |
| **B. 一体化:LobeChat** | 单一纯对话 harness 工作台 | React 同源、纯 harness、最活跃 | 知识库全员治理在企业版;信创(美国LLC)+白标买断无报价 | 备选(需先解两座大山) |
| **C. 组合:WeKnora + RAGFlow** | WeKnora(工作台)+ RAGFlow(独立 RAG 引擎,经 MCP/HTTP API) | 知识库文档理解达最强(DeepDoc 23+ 格式、引用溯源) | 两系统集成与统一登录成本;知识库 UI 与对话 UI 分体 | 若 WeKnora 知识库治理/检索不达标时启用 |

**结论:** 优先 **方案 A(WeKnora 一体化)**;以 **方案 B(LobeChat)** 作技术备选(待企业授权报价与法务意见);**方案 C** 作为知识库能力增强的退路。

## 其他国产候选评估与排除/降级说明

| 候选 | 主体 | License | pushed_at | 排除/降级原因 |
|------|------|---------|-----------|--------------|
| **Coze Studio** | 字节跳动 ✓ | Apache-2.0 | **2026-04-20** | **时效出局(约束 6):87 天未更新**。功能虽契合(React 同源、dify 式知识库),但近 3 个月无 push,不满足"一周内/一个月内" |
| **Cherry Studio** | 上海千彗 ✓ | AGPL-3.0 | 2026-07-16 ✓ | **仅桌面端(Electron)+ 移动 App,无 web 形态**(违反约束 4);管理员统一共享知识库仅企业版(违反约束 2) |
| **FastGPT** | 珠海环界云/杭州 ✓ | Apache-2.0+附加(禁多租户SaaS/禁去LOGO) | 2026-07-16 ✓ | **workflow DAG 编排为架构核心**(违反约束 5);开源版限 30 库/500 应用 |
| **MaxKB** | 飞致云·杭州 ✓ | GPLv3+FIT2CLOUD 附加 | 2026-07-16 ✓ | **社区版有用户数上限**(卡住"全员可用",违反约束 2);agent 为 workflow DAG 编排(违反约束 5) |
| **QAnything** | 网易有道 ✓ | Apache-2.0(许可存疑) | **2025-03-24** | **时效出局(约束 6):约 16 个月未更,转低维护**;且非 agent harness(无 MCP/agent) |
| **DB-GPT** | 蚂蚁 ✓ | MIT | 2026-07-15 ✓ | **workflow 编排(AWEL)为主,偏数据/BI**(Text2SQL/GBI),非通用对话工作台(违反约束 5 + 定位不符) |
| **Bisheng 毕昇** | 数据壹生·北京 ✓ | Apache-2.0 | 2026-07-16 ✓ | 入围但列末:信创背景最强、纯 Apache,但主体仍是 **workflow 编排平台**(Lingsight agent 接近 harness 而非主体),嵌入以"链接+API"为主、原生 MCP 未确证 |

## Build-from-scratch baseline

- **Effort estimate:** High — 需自研对话前端、agent harness(LLM 调用循环/工具调用/上下文管理)、RAG 知识库(文档解析/向量化/检索/溯源)、@agent 与 /skill 体系、MCP/插件框架、多租户治理、应用网格、用户权限、数据收集、管理后台、嵌入免登。
- **Maintenance burden:** High — 需持续跟进大模型生态、MCP/Agent 协议演进、RAG 技术、安全更新、前端框架升级。
- **When it wins:** 仅当开源方案在国产化/许可/可嵌入/agent harness/时效任一硬约束上全部不满足,或必须完全掌控每一寸交互与数据链路时。本期目标是"快速嵌入 + 复用开源",不建议从零构建。

## Next steps(POC 验证项)

1. **部署 WeKnora 自托管(Docker Compose)**,验证一期核心链路:
   - **许可附录 copyleft 核查:** 逐行核 LICENSE 第三方组件附录(约 3258 行),确认无 GPL/LGPL/AGPL/SSPL 组件(否则评估替换/买断)。
   - **免登端到端:** WeLink 后端调 `embed/<channel_id>/exchange` 安全模式,验证"验登录态→发 ems_→iframe 无感进入"链路;或对接 OIDC SSO。
   - **知识库治理实操:** 建组织→共享 KB→成员按角色访问完整闭环;embed 模型接企业自托管端点的检索质量。
   - **skillshub 实际对接:** 确认 skillshub 的 MCP 传输形态(SSE/HTTP vs stdio,注意 WeKnora 服务端禁用 stdio)与 OAuth2/凭证能否被直接消费;或验证 SKILL.md 目录挂载。
   - **React 宿主嵌入体验:** WeLink React 前端 iframe `weknora-widget.js`/`/embed/*` 的样式、postMessage 通信、免登、响应式是否达标。
   - **资源与性能基线:** 核心 5 容器(frontend/app/docreader/postgres/redis)的最低/推荐配置,目标并发下 ParadeDB 的检索表现。
   - **多租户边界与审计:** 跨空间隔离强度、audit log 字段是否满足政企合规。
   - **个人级数据采集:** 会话/skill 调用/知识库使用记录导出到企业后台数据库。
2. **(并行)推进 LobeChat 备选前置项:** ①向 hello@lobehub.com 询"闭源组件级嵌入/白标 + 企业版(知识库工作区治理+用户管理+私有化)"报价与中国签约主体;②法务就"美国 LLC + 附加条款"出信创合规意见;③POC 实测开源版 `workspace` flag 强开后知识库全员治理能否脱离云计费跑通。
3. **(可选)组合方案验证:** 部署 RAGFlow,验证 WeKnora 经 MCP/HTTP API 调用其知识库的效果,作为知识库增强退路。
4. **确认嵌入方式:** iframe/widget vs 长期自研 React 前端调 API(依据 POC 结果定)。
5. **选型定稿后:** 联动更新下游 `tech-stack.md` / `feasibility.md` / `integration-plan.md`(当前仍绑定 LibreChat,本次未改动),按新选型重写集成与可行性设计。

## Human gate(待 PM 确认)

本报告候选评分表与推荐结论(**Top = WeKnora,Runner-up = LobeChat,知识库引擎增强 = RAGFlow**)**待 PM 确认**。PM 确认后:①将本报告顶部标注更新为"**选型已确定**";②按 issue-6 模式在下游设计文档顶部补"选型更新"标注或重写;③进入 POC 与后续 product-design-docs 阶段。

## Sources

**WeKnora(首选)**
- https://github.com/Tencent/WeKnora
- LICENSE(MIT 无附加):https://github.com/Tencent/WeKnora/blob/main/LICENSE
- 知识库/组织/空间治理:https://github.com/Tencent/WeKnora/blob/main/docs/api/organization.md 、 https://github.com/Tencent/WeKnora/blob/main/docs/api/tenant.md
- Lite vs 标准版(标准版含共享空间/RBAC):https://github.com/Tencent/WeKnora/blob/main/docs/LITE.md
- Embed 安全模式免登:https://github.com/Tencent/WeKnora/blob/main/docs/embed-secure-mode.md
- OIDC SSO:https://github.com/Tencent/WeKnora/blob/main/docs/OIDC认证调用流程.md
- Agent / Skills / MCP:https://github.com/Tencent/WeKnora/blob/main/docs/api/agent.md 、 https://github.com/Tencent/WeKnora/blob/main/docs/agent-skills.md 、 https://github.com/Tencent/WeKnora/blob/main/docs/api/mcp-service.md
- 官网/托管:https://weknora.weixin.qq.com ;微信对话开放平台:https://chatbot.weixin.qq.com

**LobeChat(备选)**
- https://github.com/lobehub/lobehub (monorepo,canary)
- LICENSE(Apache-2.0+附加,白标/衍生需授权):https://github.com/lobehub/lobehub/blob/canary/LICENSE
- 知识库个人级 + RBAC 在 business-server(私有包):https://github.com/lobehub/lobehub/blob/canary/packages/business-server/package.json 、 https://github.com/lobehub/lobehub/blob/canary/docs/usage/workspace-permissions.zh-CN.mdx
- 定价(企业授权联系销售):https://lobehub.com/zh/pricing
- iframe 嵌入讨论:https://github.com/lobehub/lobehub/discussions/8484

**RAGFlow(知识库引擎增强)**
- https://github.com/infiniflow/ragflow
- HTTP API(可作独立引擎):https://ragflow.io/docs/dev/http_api_reference
- MCP 双向:https://ragflow.io/docs/mcp_client
- Apache-2.0:https://milvus.io/ai-quick-reference/is-ragflow-open-source-and-free-to-use

**其他候选(排除/降级)**
- Coze Studio(时效出局):https://github.com/coze-dev/coze-studio
- Cherry Studio(仅桌面端,AGPL):https://github.com/CherryHQ/cherry-studio
- FastGPT(workflow 编排;附加条款):https://github.com/labring/FastGPT 、 https://raw.githubusercontent.com/labring/FastGPT/main/LICENSE
- MaxKB(社区版用户数限制;GPLv3+附加):https://github.com/1Panel-dev/MaxKB 、 https://fit2cloud.com/legal/licenses.html
- QAnything(时效出局/低维护,非 harness):https://github.com/netease-youdao/QAnything
- DB-GPT(workflow 编排,偏数据/BI,MIT):https://github.com/eosphoros-ai/DB-GPT
- Bisheng 毕昇(workflow 编排为主,Apache-2.0):https://github.com/dataelement/bisheng

---

## 附录 A:研究方法说明

本报告经**两轮**联网核查:①4 路并行桌面研究(WebSearch)产出候选全景;②采纳 PM 时效约束后,用 **GitHub API `pushed_at`** 逐一复核最近更新时间(权威值),并对最终两名候选(WeKnora / LobeChat)做 **`gh api` 源码级深挖**(直读 LICENSE、schema、feature flags、docker-compose、nginx.conf、docs 原文)。全程未执行任何第三方代码(遵循 explore-opensource 规则)。stars 为 GitHub API 2026-07-16 实测值;`pushed_at` 为仓库最近推送时间。个别仍需 POC 实测项已在正文标注(如 WeKnora 许可附录 copyleft、stdio MCP 开关、LobeChat 开源版 workspace 强开)。

## 附录 B:境外参照基线(已被国产化约束取代,仅作功能完备性对照)

> 以下候选为 2026-07-14 前评估的**境外项目**,因不符合国产化硬约束,**不作为选型**,仅保留作功能完备性参照基线(类比 issue-6 保留 Baserow 作参照)。

- **LibreChat**(境外,MIT):原首选。原生 Agents/MCP/Skills/Artifacts,React/TS 栈。其"@智能体 + 技能 + 插件 + MCP"语义与本需求高度契合,可作 WeKnora/LobeChat 的功能对标基准。
- **Open WebUI**(境外,MIT 含品牌条款):原备选。RAG 能力最成熟、社区最大(~140K stars),可作知识库体验对标基准。
- **(注)** LobeChat 在原评估中被一并归为境外;经核实其研发团队在中国(法律实体为美国 LobeHub LLC),已移入国产候选重评(见正文 Runner-up)。
