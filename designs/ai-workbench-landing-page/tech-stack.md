# WeLink 技术栈与前端框架布局

> 来源：PM 2026-07-07 提供，用于 AI 工作台集成方案设计。

## 后端技术栈

| 层级 | 技术 | 版本/说明 |
|------|------|----------|
| API 网关 | Spring Cloud Gateway | — |
| 注册/配置中心 | Nacos | v2.3.2 |
| 服务调用 | OpenFeign + LoadBalancer | 随 Spring Cloud |
| 关系数据库 | MySQL | 8.0 |
| 缓存 | Redis（Spring Data Redis） | 7-alpine |
| 对象存储 | MinIO | — |

## 前端技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 运行时 | Node / npm | ^24 / ^11 |
| UI 框架 | React / React DOM | 18.2.0 |
| 语言 | TypeScript | 5.6.3 |
| 状态管理 | Redux + redux-thunk + redux-persist | 5.0.1 / 3.1.0 / 6.0.0 |
| React 绑定 | react-redux | 9.2.0 |
| 路由 | react-router-dom v5 + history v4 | 5.3.4 / 4.10.1 |
| 国际化 | react-intl | 7.1.14 |
| UI 库 | MUI 5、Bootstrap 3、styled-components | 混合并存 |
| 应用版本 | mattermost-webapp (channels) | 11.8.0 |

## 当前前端框架布局

应用名称为"龙智协同"，整体采用左侧导航 + 顶部标题栏 + 主内容区 + 右侧 AI 协同助手侧边栏的布局。

### 左侧导航

| 入口 | 说明 |
|------|------|
| AI 工作台 | 当前 landing page，展示工作台 dashboard |
| 消息 | IM 消息列表（Mattermost channels） |
| 事项 | 待办/任务 |
| 通讯录 | 组织架构 |
| 会议日程 | 日程管理 |
| 知识库 | 企业知识 |

### AI 工作台当前形态

- **顶部问候区**：展示用户姓名、AI 智能体入口、今日待办/日程/风险预警统计。
- **待办事项区**：以卡片形式展示 AI 预处理的待办（如督办专员·AI 生成的待确认事项）。
- **智能日程区**：展示今日/本周日程。
- **通知公告区**：展示企业通知、消息、公告、活动。
- **右侧 AI 协同助手**：常驻侧边栏，展示对话消息、处理建议、操作按钮。

## 对 AI 工作台集成方案的约束

1. **前端技术栈**：React 18 + TypeScript 5.6 + react-router-dom v5 + Redux。新增页面需兼容现有路由和状态管理。
2. **UI 库混合**：MUI 5、Bootstrap 3、styled-components 并存，新增组件建议优先使用 MUI 5 或 styled-components。
3. **IM 用户体系**：基于 Mattermost 11.8.0 用户体系，LibreChat 需要与 Mattermost 用户做映射或复用 SSO。
4. **后端体系**：Spring Cloud + Nacos + MySQL + Redis + MinIO。LibreChat 后端（Node.js/MongoDB/PostgreSQL）需要作为独立服务接入，或通过网关暴露。
5. **右侧助手形态**：当前已有 AI 协同助手侧边栏，LibreChat 可作为该侧边栏的聊天引擎，或替换为完整的 LibreChat 对话界面。

## 集成建议

> 说明：以下建议基于"截图仅参考整体布局框架，AI 工作台具体形态遵循 LibreChat UI/UX"。

1. **主内容区嵌入 LibreChat**：点击左侧"AI 工作台"后，主内容区直接嵌入 LibreChat 前端页面（iframe 或组件级复用），作为核心对话和工作区。
2. **左侧导航复用**：不新增导航，继续使用现有"AI 工作台"入口。
3. **右侧区域**：根据 LibreChat 页面布局决定是否保留右侧辅助区域；若 LibreChat 原生为三栏布局，右侧栏可作为上下文/推荐区。
4. **用户体系打通**：WeLink/IM 后端签发 LibreChat token，iframe 传参实现免登。
5. **应用网格**：本期不做，后续规划。
