# 研究笔记: AI 日程开源方案选型

## 研究问题

Issue #17 要求为 WeLink 每人提供一个日程看板，并满足：

1. 传统日历产品特性（月/周/日视图、事件 CRUD、邀请/忙闲等）。
2. 对 agent 友好：官方 CLI、agent skills 或干净 API；可为 agent 签发 token。
3. 开源协议限定 MIT / Apache-2.0 / AGPL。
4. 优先满足国产化/可商业买断路径。

需要找到最合适的开源日历后端，并明确 agent 集成方式与风险。

## 候选方案

| 方案 | License | Agent 集成 | 传统日历 UX | 邀请/忙闲 | 国产化/买断 | 综合 fit |
|---|---|---|---|---|---|---|
| **Nextcloud Calendar** | AGPL-3.0 | CalDAV + occ CLI + 多个现成 MCP server | 优秀 | ✅ iMIP 服务端 | 可自托管，需评估 AGPL 分发 | **5/5** |
| **Stalwart** | AGPL-3.0 | **JMAP（JSON）** + CalDAV + OAuth 2.0 | 弱（需自研 UI） | ✅ RFC 6638 CalDAV Scheduling | 可自托管，需评估 AGPL 分发 | **4/5** |
| **Cal.com** | 核心 AGPLv3（2026 闭源转投传闻待核实） | REST API v2 + webhook | 预约页导向，非传统看板 | ✅ | 可自托管，许可不确定 | 4/5（核实后可能降至 2/5） |
| **Rallly** | AGPL-3.0 | 无公开 API/CLI | 仅投票/找时间 | 部分 | 可自托管，多用户需付费 key | 2/5 |
| **EteSync / Etebase** | AGPL-3.0 server / GPL adapter | Etebase API + GPL CalDAV bridge | 基础 web 客户端 | 无服务端（E2EE） | 可自托管 | 2/5 |
| **sabre/dav 自建** | MIT（框架） | 自研 REST/MCP | 自研 | 自研 | 完全可控 | 3/5 |
| ~~Radicale~~ | GPL-3.0 | — | — | — | — | 排除 |
| ~~Baïkal~~ | GPL-3.0 | — | — | — | — | 排除 |
| ~~DAViCal~~ | GPL-2.0 | — | — | — | — | 排除 |
| ~~SOGo~~ | GPL/LGPL | — | — | — | — | 排除 |
| ~~Apple CalendarServer~~ | Apache-2.0 | CalDAV | 无 | ✅ | — | 1/5（已归档） |

## 候选详情

### 1. Nextcloud Calendar（推荐主选）

- **官网/仓库**：https://github.com/nextcloud/calendar / https://nextcloud.com
- **License**：AGPL-3.0（服务端与 calendar app 均为 AGPL-3.0）
- **描述**：完整的传统日历产品，月/周/日视图、共享日历、预约（Appointments）、任务、资源预订、iMIP 邮件邀请、CalDAV/CardDAV。
- **Agent 集成**：
  - 标准 CalDAV 端点 `/remote.php/dav`，可 PUT ICS 文件创建事件。
  - `occ` CLI 支持日历管理（`dav:create-calendar`、`dav:list-calendars` 等）。
  - 多个现成 MCP server：`dominik1001/caldav-mcp`、`johnwujiang2008/caldav-mcp-server`、`philflowio/dav-mcp`、Nextcloud CalDAV MCP。
  - App password 可直接作为 token 给 agent。
- **优点**：最成熟的传统日历 UX；协议标准、生态大；MCP 工具链现成；与 WeLink iframe 嵌入模式契合。
- **缺点**：PHP 单体，仅用于日历时运维较重；无官方单事件 CRUD CLI，agent 需讲 CalDAV。
- ** fit 评分**：5/5

### 2. Stalwart（备选）

- **官网/仓库**：https://stalw.art / https://github.com/stalwartlabs/stalwart
- **License**：AGPL-3.0 community（双许可，有商业 SELv2）
- **描述**：Rust 一体化邮件+协作服务器，2025 年通过 NLnet 资助加入 CalDAV/CardDAV/WebDAV/JMAP for Calendars。
- **Agent 集成**：
  - **JMAP for Calendars**：JSON-over-HTTP、批量、token auth，对 LLM/agent 最友好。
  - 同时支持 CalDAV，可复用现有 CalDAV MCP servers。
  - 内置 OAuth 2.0/OIDC、CalDAV Scheduling（RFC 6638）。
- **优点**：现代、内存安全、单二进制、Docker 友好；JMAP 是 agent 最优协议；邀请/忙闲服务端处理。
- **缺点**：它是服务器而非日历产品，用户看板 UI 需自研或复用第三方客户端（AgenDAV、InfCloud）。
- **fit 评分**：4/5

### 3. Cal.com

- **官网/仓库**：https://cal.com / https://github.com/calcom/cal.com
- **License**：核心 AGPLv3；`ee/` 目录商业许可
- **描述**：主流 Calendly 开源替代品，预约页、团队调度、路由表单、支付、视频集成。
- **Agent 集成**：REST API v2 + webhooks + embeddable atoms。
- **优点**：预约场景功能丰富；社区大（~46k stars）。
- **缺点**：
  - 2026 年 4 月 reportedly 将主仓库转为闭源，社区 fork 为 MIT 的 Cal.diy（定位为个人/非生产使用）。
  - 偏预约页，不是传统个人日历看板。
  - 栈重（Next.js/tRPC/Prisma/Postgres）。
- **fit 评分**：4/5（若闭源传闻属实且 Cal.diy 仅限个人使用，则降至 2/5）

### 4. Rallly

- **仓库**：https://github.com/lukevella/rallly
- **License**：AGPL-3.0
- **描述**：Doodle 式群组投票调度，用于找大家都有空的时间。
- **Agent 集成**：无公开 API/CLI，需反向工程内部 tRPC。
- **优点**：适合「与多人约时间」子场景；简洁。
- **缺点**：不是日历产品；自托管多用户 Spaces 在 v4+ 需要付费 license key。
- **fit 评分**：2/5

### 5. EteSync / Etebase

- **仓库**：https://github.com/orgs/etesync/repositories
- **License**：Server AGPL-3.0；adapter/app GPL-3.0（不兼容需求）
- **描述**：端到端加密日历/联系人/任务同步。
- **Agent 集成**：Etebase API + `etesync-dav` CalDAV bridge（GPL-3.0）。
- **优点**：隐私性强（E2EE）。
- **缺点**：
  - 维护缓慢：服务端上次更新 2024-07，Android 上次发布 2024-03，vdirsyncer 已移除 EteSync 支持。
  - E2EE 与 server-side agent 冲突：agent 必须持有用户密钥才能读写事件。
  - 混合 license，GPL adapter 不满足 #17 约束。
- **fit 评分**：2/5

### 6. sabre/dav 自建

- **仓库**：https://github.com/sabre-io/dav
- **License**：MIT
- **描述**：PHP CalDAV/CardDAV/WebDAV 框架，Baïkal 基于此构建。
- **Agent 集成**：自研 REST/JSON API 和 MCP server，底层复用 sabre/dav 的 CalDAV 输出。
- **优点**：License 最干净；完全匹配 Lincoln 产品模型；无单体依赖。
- **缺点**：需自行实现邀请（iMIP/iTIP）、忙闲、递归、时区等，日历正确性成本高。
- **fit 评分**：3/5

## 推荐结论

1. **主选：Nextcloud Calendar（AGPL-3.0）**
   - 若产品需要快速交付真正的传统个人日程看板，Nextcloud 是最成熟、生态最大、MCP 工具链最现成的选择。
   - 通过 iframe 嵌入 Nextcloud Calendar UI，agent 通过 CalDAV MCP server / occ CLI / app password token 操作事件。
   - 邀请成员通过 CalDAV Scheduling + iMIP 邮件实现，服务端自动发送邀请。

2. **备选：Stalwart（AGPL-3.0）**
   - 若 Lincoln 更看重 agent 原生集成体验（JMAP JSON API）且愿意自研/复用 board UI，Stalwart 是更现代、更 agent-friendly 的后端。
   - 适合对日历 UX 有强烈定制需求、愿意投入 UI 建设的场景。

3. **Cal.com 仅用于预约链接场景**
   - 如果 #17 包含「对外预约时间」子需求，可单独评估 Cal.com；但必须先核实 2026 许可证变化。

4. **Agent 集成统一建议**
   - 无论后端是 Nextcloud 还是 Stalwart，agent 侧统一封装为 **MCP server / CLI wrapper over CalDAV（或 JMAP）**。
   - 让服务端通过 RFC 6638 / iMIP 处理邀请函，agent 只负责生成/更新 ICS 或 JSCalendar 事件对象。

## 协议与标准说明

- **iCalendar (RFC 5545)**：`.ics` 数据模型（VEVENT、ATTENDEE、ORGANIZER、RRULE）。
- **CalDAV (RFC 4791)**：HTTP/WebDAV 日历 CRUD，通用但 XML 较重。
- **CalDAV Scheduling (RFC 6638)**：服务端处理邀请与忙闲，是「agent 邀请成员」的关键使能器。
- **iTIP/iMIP (RFC 5546/6047)**：跨邮件系统的邀请投递。
- **JMAP for Calendars (JSCalendar RFC 8984)**：现代 JSON API，对 agent 最友好；Stalwart 已实现。
- **MCP**：现有 CalDAV MCP servers 可直接复用，降低 agent 集成成本。

## 待确认事项

1. **License 接受度**：PM/法务是否接受 AGPL-3.0 作为日程后端协议？WeLink 私有部署模式下 AGPL 网络触发条件如何评估？
2. **UI 策略**：是否愿意自研日程看板 UI？若不愿意，Nextcloud 是更优解；若愿意，Stalwart + JMAP 更优。
3. **外部互通**：是否需要与 Outlook/Google 日历互通？CalDAV/iMIP 已提供基础互通，但需验证企业邮件网关。
4. **Token 模式**：使用 app password（Nextcloud）还是 OAuth token（Stalwart）？token 生命周期如何管理？
5. **国产化要求**：是否需要国内厂商支持或源码可控？Nextcloud 与 Stalwart 均可自托管，但 国产化 合规需进一步确认。

## 参考链接

- Nextcloud Calendar: https://github.com/nextcloud/calendar
- Nextcloud CalDAV endpoint docs: https://docs.nextcloud.com/server/stable/user_manual/en/groupware/calendar.html
- Stalwart: https://stalw.art / https://github.com/stalwartlabs/stalwart
- Stalwart NLnet collaboration grant: https://stalw.art/blog/nlnet-grant-collaboration/
- Cal.com: https://github.com/calcom/cal.com
- Cal.com closed-source report (unverified): https://www.how2shout.com/news/cal-com-closed-source-cal-diy-open-source-ai-security.html
- CalDAV MCP servers: https://mcpservers.org/servers/dominik1001/caldav-mcp, https://mcpservers.org/servers/philflowio/dav-mcp
- RFC 4791 (CalDAV), RFC 6638 (CalDAV Scheduling), RFC 8984 (JSCalendar)
