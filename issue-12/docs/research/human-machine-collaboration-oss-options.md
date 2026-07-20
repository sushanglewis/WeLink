# 开源方案研究：人-机协同系统

**Issue**: #12 — IM中的AI应用  
**研究目标**: 为短期补齐人-机协同系统（协作文档、协作日程、协作会议、企业知识库、技能分发/Agent平台）寻找合适的开源项目。  
**约束条件**:
1. 支持产品二次开发。
2. 支持国产化/国内私有化部署。
3. 支持产品分发/嵌入（白标、商业分发许可友好）。  

**日期**: 2026-07-20  

---

## 总体推荐

| 能力领域 | 首选方案 | 备选方案 | 核心理由 |
|----------|----------|----------|----------|
| 协作文档 | **OnlyOffice Document Server** | Collabora Online | 私有化成熟、API 丰富、可二次开发、信创适配多。 |
| 企业知识库 | **BookStack** / **Wiki.js** | Outline | BookStack 简单、MIT 许可、适合中小团队；Wiki.js 功能全、可扩展。 |
| 协作日程 | **Nextcloud Calendar** | Baikal + AgenDAV | Nextcloud 生态完整；Baikal 轻量极简。 |
| 协作会议 | **Jitsi Meet** | BigBlueButton | Jitsi 社区活跃、SDK 丰富、易嵌入；BigBlueButton 适合在线教育。 |
| 技能分发 / Agent 平台 | **Dify**（内部使用/集成）或 **Coze Studio**（Apache 2.0 可分发） | FastGPT、MaxKB | Dify 生态最成熟但 SaaS 受限；Coze Studio 许可最干净但技术栈不同。 |

**综合建议**：短期优先补齐 **企业知识库 + 技能分发** 两个 P0 能力；协作文档、日程、会议可作为 P1 通过成熟开源方案快速补齐。

---

## 一、协作文档

### 候选项目

| 项目 | License | Stars | 业务匹配 | 技术匹配 | 维护 | 文档 | 集成成本 | 总分 |
|------|---------|-------|----------|----------|------|------|----------|------|
| OnlyOffice Document Server | AGPL / 商业版 | 高 | 5 | 5 | 5 | 4 | 4 | **4.75** |
| Collabora Online | MPL-2.0 | 中 | 4 | 4 | 4 | 4 | 3 | **3.95** |
| Etherpad | Apache 2.0 | 中 | 3 | 4 | 4 | 3 | 4 | **3.55** |
| HedgeDoc | AGPL | 中 | 3 | 3 | 3 | 3 | 3 | **3.00** |

*加权：业务 30%，技术 25%，维护 20%，文档 15%，集成 10%*

### Top 1：OnlyOffice Document Server

- **Repo**: https://github.com/ONLYOFFICE/DocumentServer
- **定位**: 企业级在线办公套件核心，支持文档、表格、幻灯片协作编辑。
- **优点**:
  - 私有化部署成熟，Docker/K8s 方案完善。
  - 提供丰富的 API 和 WOPI 协议，可嵌入第三方应用。
  - 支持二次开发，可定制界面和功能。
  - 国产化/信创适配较好，支持国产操作系统和文档格式。
- **缺点**:
  - 社区版 AGPL 协议，嵌入商业产品需注意许可证传染性。
  - 商业版/开发版可获得更宽松的集成许可。
  - 资源占用相对较高。
- **集成方式**: WOPI 协议、API、iframe 嵌入。
- **适用**: WeLink 协作文档的底座，替换或补充现有文档能力。

### Top 2：Collabora Online

- **Repo**: https://github.com/CollaboraOnline/online
- **定位**: LibreOffice 的在线版本，支持文档协作。
- **优点**:
  - MPL-2.0 许可相对友好。
  - 与 Nextcloud、ownCloud 等集成成熟。
  - 支持 ODF 格式，兼容性好。
- **缺点**:
  - 二次开发门槛高于 OnlyOffice。
  - 移动端体验略逊。
  - 社区规模和文档丰富度不如 OnlyOffice。
- **集成方式**: WOPI、iframe、API。

---

## 二、企业知识库

### 候选项目

| 项目 | License | Stars | 业务匹配 | 技术匹配 | 维护 | 文档 | 集成成本 | 总分 |
|------|---------|-------|----------|----------|------|------|----------|------|
| Wiki.js | AGPL | 高 | 5 | 5 | 4 | 5 | 4 | **4.75** |
| BookStack | MIT | 中高 | 4 | 5 | 4 | 4 | 5 | **4.35** |
| Outline | BSL 1.1 | 高 | 4 | 4 | 4 | 4 | 3 | **3.95** |
| MediaWiki | GPL-2.0+ | 很高 | 3 | 3 | 5 | 5 | 3 | **3.70** |

### Top 1：Wiki.js

- **Repo**: https://github.com/Requarks/wiki
- **定位**: 现代化、可扩展的开源 Wiki 与知识库平台。
- **优点**:
  - 基于 Node.js + Vue，技术栈与 WeLink 前端较接近。
  - 支持 Markdown、可视化编辑器、全文搜索、权限管理。
  - 模块化设计，支持多种存储和认证后端。
  - 私有化部署简单，中文支持良好。
- **缺点**:
  - AGPL 协议，商业嵌入需注意。
  - 部分高级功能需商业许可。
- **集成方式**: REST API、SSO、数据库直连。
- **适用**: 作为 WeLink 企业知识库底座，为数字员工提供组织上下文。

### Top 2：BookStack

- **Repo**: https://github.com/BookStackApp/BookStack
- **定位**: 简洁易用的开源知识库，适合团队文档管理。
- **优点**:
  - **MIT 许可**，商业分发最友好。
  - PHP + Laravel，部署简单，二次开发门槛低。
  - 界面直观，适合非技术用户。
  - 支持 LDAP/SSO、权限、全文搜索。
- **缺点**:
  - 扩展性不如 Wiki.js。
  - 多语言/国际化支持一般。
- **集成方式**: API、SSO、数据库。
- **适用**: 如果 WeLink 希望快速上线一个可商业分发的知识库，BookStack 是低风险选择。

---

## 三、协作日程

### 候选项目

| 项目 | License | Stars | 业务匹配 | 技术匹配 | 维护 | 文档 | 集成成本 | 总分 |
|------|---------|-------|----------|----------|------|------|----------|------|
| Nextcloud Calendar | AGPL | 高 | 5 | 4 | 5 | 4 | 3 | **4.35** |
| Baikal + AgenDAV | AGPL / MIT | 中 | 3 | 4 | 4 | 3 | 4 | **3.55** |
| Radicale | GPL-3.0 | 中 | 3 | 4 | 3 | 3 | 4 | **3.35** |
| Cal.com / Calendso | AGPL | 高 | 4 | 4 | 4 | 4 | 3 | **3.95** |

### Top 1：Nextcloud Calendar

- **Repo**: https://github.com/nextcloud/calendar
- **定位**: Nextcloud 内置的 CalDAV 日历应用，支持共享日历、会议邀请、任务。
- **优点**:
  - 生态完整，可配套文件、文档、聊天能力。
  - 支持 CalDAV/CardDAV，兼容 iOS、Android、Thunderbird、Outlook。
  - 私有化部署成熟，LDAP/SSO 支持好。
- **缺点**:
  - AGPL 协议，商业嵌入需注意。
  - 部署相对重，适合中大规模团队。
- **集成方式**: CalDAV 协议、Nextcloud API、iframe。
- **适用**: WeLink 需要一套完整的协作日程底座时首选。

### Top 2：Baikal + AgenDAV

- **Baikal Repo**: https://github.com/sabre-io/Baikal
- **AgenDAV**: CalDAV/CardDAV Web 客户端
- **定位**: 轻量级自建日历/通讯录服务。
- **优点**:
  - 极轻量，资源占用低。
  - 支持 CalDAV/CardDAV，兼容主流客户端。
  - 部署简单，适合私有化。
- **缺点**:
  - 功能简单，缺乏协作特性（共享、权限、会议预约）。
  - 用户体验不如 Nextcloud。
- **集成方式**: CalDAV 协议、AgenDAV iframe。
- **适用**: 如果 WeLink 只需要基础日程同步，不想引入完整 Nextcloud。

---

## 四、协作会议

### 候选项目

| 项目 | License | Stars | 业务匹配 | 技术匹配 | 维护 | 文档 | 集成成本 | 总分 |
|------|---------|-------|----------|----------|------|------|----------|------|
| Jitsi Meet | Apache 2.0 | 很高 | 5 | 5 | 5 | 5 | 4 | **4.90** |
| BigBlueButton | LGPL-3.0 | 高 | 4 | 4 | 4 | 4 | 3 | **3.95** |
| 野火IM RTC | 商业/开源 | 中 | 4 | 4 | 3 | 3 | 4 | **3.65** |

### Top 1：Jitsi Meet

- **Repo**: https://github.com/jitsi/jitsi-meet
- **定位**: 完全开源的 WebRTC 视频会议平台。
- **优点**:
  - **Apache 2.0 许可**，商业分发最友好。
  - 社区极活跃，维护稳定。
  - 提供 Web、iOS、Android SDK，可深度嵌入。
  - 私有化部署成熟，支持端到端加密。
  - 二次开发文档丰富，界面可品牌化。
- **缺点**:
  - 大规模部署（千人会议）需要额外调优和基础设施。
  - 部分高级功能（直播、录制）需配置额外组件。
- **集成方式**: iframe 嵌入、SDK、REST API。
- **适用**: WeLink 协作会议的首选方案。

### Top 2：BigBlueButton

- **Repo**: https://github.com/bigbluebutton/bigbluebutton
- **定位**: 开源在线会议/网络教室平台。
- **优点**:
  - 专为教育场景设计，白板、录制、分组讨论功能强。
  - 私有化部署成熟。
- **缺点**:
  - 二次开发门槛高于 Jitsi。
  - 移动端体验一般。
  - LGPL 协议，嵌入需注意。
- **集成方式**: API、LTI、iframe。
- **适用**: 如果 WeLink 会议场景偏培训/教育，可选 BigBlueButton。

---

## 五、技能分发 / Agent 平台

### 候选项目

| 项目 | License | Stars | 业务匹配 | 技术匹配 | 维护 | 文档 | 集成成本 | 总分 |
|------|---------|-------|----------|----------|------|------|----------|------|
| Dify | Apache 2.0 + SaaS 限制条款 | 很高 | 5 | 5 | 5 | 5 | 4 | **4.90*** |
| Coze Studio / Loop | Apache 2.0 | 中 | 4 | 3 | 4 | 4 | 3 | **3.80** |
| FastGPT | 社区版 + 商业授权 | 高 | 4 | 4 | 4 | 4 | 4 | **4.00** |
| MaxKB | GPL-3.0 | 中高 | 3 | 4 | 4 | 4 | 4 | **3.70** |
| LangBot | AGPL | 中 | 4 | 4 | 3 | 3 | 4 | **3.55** |

*Dify 功能评分高，但 License 含 SaaS 限制，商业分发需评估或购买授权。*

### Top 1：Dify（内部集成/购买商业授权后分发）

- **Repo**: https://github.com/langgenius/dify
- **定位**: 开源 LLM 应用开发平台，支持 Agent、Workflow、RAG、知识库。
- **优点**:
  - 生态最成熟，社区活跃，文档丰富。
  - 支持多模型、MCP、Function Calling、可视化工作流。
  - Python + React 技术栈，与 WeLink 后端/前端匹配度高。
  - 私有化部署成熟（Docker Compose / K8s）。
- **缺点**:
  - License 含"未经授权不得提供 SaaS 服务"条款，对外商业分发需购买商业授权。
  - 前端需保留 LOGO，白标需改造或授权。
- **集成方式**: REST API、嵌入 Chat、工作流 API。
- **适用**: 如果 WeLink 把 Dify 作为内部 Agent 编排层（不直接对外售卖 Dify 本身），风险可控；若需白标分发，需采购商业授权。

### Top 2：Coze Studio / Coze Loop（Apache 2.0，许可最干净）

- **Repo**: https://github.com/coze-dev/coze-studio
- **定位**: 字节跳动 Coze 的开源版，支持 Agent 开发、技能编排。
- **优点**:
  - **Apache 2.0 纯净协议**，无 SaaS 限制，最适合二次开发和商业分发。
  - 与飞书 Aily 同源技术体系，概念模型可参考。
  - 低代码 Agent 开发体验较好。
- **缺点**:
  - 技术栈为 Golang，与 WeLink 现有 Python/Node 栈不完全一致。
  - 开源版企业级功能较弱，社区规模不如 Dify。
- **集成方式**: API、SDK。
- **适用**: 如果 WeLink 最看重 License 自由和可分发性，Coze Studio 是长期更安全的底座。

### 补充：技能分发生态

| 项目/标准 | 说明 |
|-----------|------|
| **skills.sh** | Vercel 推出的开源 AI Agent 技能目录与包管理器，类似 npm 的技能包分发。 |
| **MagicSkills** | 中文社区开源项目，实现 Agent 技能的统一管理、安装、组合与同步。 |
| **SKILL.md 标准** | 任何含 `SKILL.md` 的 GitHub 仓库都可被安装为技能，适合团队私有技能分发。 |
| **openJiuwen Symphony** | 华为支持的开源技能编排与智能分发系统，支持海量技能的精准发现与协同。 |

---

## 六、从零开发基线

| 能力领域 | 估算人月 | 维护负担 | 何时从零开发更优 |
|----------|----------|----------|------------------|
| 协作文档 | 12-24 人月 | 高 | 只有当我们需要完全差异化的文档体验时才考虑。 |
| 企业知识库 | 6-12 人月 | 中 | 现有开源方案已很成熟，不建议从零开发。 |
| 协作日程 | 8-16 人月 | 中 | CalDAV 协议复杂，建议基于开源方案。 |
| 协作会议 | 18-36 人月 | 很高 | WebRTC 基础设施复杂，强烈不建议从零开发。 |
| 技能分发 / Agent 平台 | 12-24 人月 | 高 | 短期建议基于 Dify/Coze Studio 二次开发，长期可考虑自研核心编排引擎。 |

**结论**: 这五个领域中，只有 Agent 编排引擎在长期有自研价值；其余四个都应优先采用开源方案集成。

---

## 七、License 与商业分发风险评估

| 项目 | License | 商业嵌入风险 | 建议 |
|------|---------|--------------|------|
| OnlyOffice Document Server | AGPL | 中-高 | 购买商业版/开发版以获得更宽松许可。 |
| Wiki.js | AGPL | 中-高 | 内部使用风险低；商业分发需评估。 |
| BookStack | MIT | 低 | 可自由嵌入和商业分发。 |
| Nextcloud Calendar | AGPL | 中-高 | 作为独立服务调用可降低风险。 |
| Jitsi Meet | Apache 2.0 | 低 | 最自由，可嵌入和分发。 |
| Dify | Apache 2.0 + 附加条款 | 中 | 不对外提供 SaaS 则风险低；白标需授权。 |
| Coze Studio | Apache 2.0 | 低 | 最适合二次开发和商业分发。 |

---

## 八、下一步建议

1. **P0 立即启动**:
   - 企业知识库：在 **BookStack**（MIT，快速可分发）和 **Wiki.js**（功能强，需评估 AGPL）之间做最终选择。
   - 技能分发：在 **Dify**（功能强，需授权）和 **Coze Studio**（License 干净，技术栈不同）之间做最终选择。

2. **P1 快速补齐**:
   - 协作文档：**OnlyOffice Document Server**（商业版）。
   - 协作日程：**Nextcloud Calendar** 或 **Baikal + AgenDAV**。
   - 协作会议：**Jitsi Meet**。

3. **设计阶段输入**:
   - 明确每个开源组件在 WeLink 架构中的位置：独立部署 vs 内嵌，API 网关如何统一，权限如何打通。
   - 明确数字员工如何通过 MCP/Skill 调用这些协同系统。

---

## 信息来源

- OnlyOffice: https://github.com/ONLYOFFICE/DocumentServer
- Collabora Online: https://github.com/CollaboraOnline/online
- Wiki.js: https://github.com/Requarks/wiki
- BookStack: https://github.com/BookStackApp/BookStack
- Nextcloud Calendar: https://github.com/nextcloud/calendar
- Baikal: https://github.com/sabre-io/Baikal
- Jitsi Meet: https://github.com/jitsi/jitsi-meet
- BigBlueButton: https://github.com/bigbluebutton/bigbluebutton
- Dify: https://github.com/langgenius/dify
- Coze Studio: https://github.com/coze-dev/coze-studio
- FastGPT: https://github.com/labring/FastGPT
- MaxKB: https://github.com/1Panel-dev/MaxKB
- skills.sh / MagicSkills / openJiuwen Symphony: 见 WebSearch 结果摘要
- 中文搜索结果：CSDN、知乎、微信公众号、OSCHINA、搜狐等关于私有化部署和二次开发的实践文章
