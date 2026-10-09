# Agent 框架与 Mattermost BOT 对话窗口决策记录

<!-- status: draft -->

## 背景

issue-17 在规划阶段面临三个关键决策：

1. Mattermost 官方 BOT 对话窗口方案是否已升级，是否原生支持 BOT 会话多 session / 多话题上下文。
2. 当前 WeLink 数字员工底座（OpenClaw）是否原生支持 sub-agent 扇出/扇入与多 agent 协作。
3. 近期热门的 DeepSeek Harness 与开源 Codex Harness 是否有必要替换现有 OpenClaw 框架。

本记录汇总调研结论与推荐方案。

## 调研结论

### 1. Mattermost 官方方案（截至 2026-08）

Mattermost 核心本身没有「session」这一概念，上下文隔离历来由上层集成通过 **channel / DM / thread** 组合实现。但 2026 年官方在 Agents 插件（原 Copilot）上已提供可直接复用的会话方案：

- **Mattermost Agents 插件 v2.x**（原 Copilot）已演进为官方 AI agent 方案，随 Mattermost v11.7+ ESR 预装或推荐安装：
  - 右侧栏（RHS）提供独立 AI 聊天面板，支持「start a new chat」。
  - 会话作为一等公民实体（`LLM_Conversations` / `LLM_Turns`）。
  - 频道中 @mention agent 时，thread 即上下文边界。
  - v11.10 引入 channel auto-reply "Top-level posts only"：每个顶层消息自动开启 thread——本质即官方版「按话题拆分上下文」。
  - 支持多 agent 自助创建，每个 agent 拥有独立 bot 账号、指令、工具集。
- **Mattermost MCP Server**（v11.3+）：允许外部 AI 客户端把 Mattermost 当工具使用。
- **Thread 机制**：可作为 session key 使用；频道中基本够用，但 DM 中所有顶层消息共享一个 session，需要自研会话管理层（按 `root_id` 或自建会话表）。

**结论**：官方已提供可直接满足多会话/多话题的方案（Agents 插件 v2.x + thread），但 WeLink 当前基于 OpenClaw + Mattermost 自研，切换官方 Agents 插件成本极高，宜作为参考和备选。

### 2. 当前 Agent 底座：OpenClaw

WeLink 数字员工实际运行时底座为 **OpenClaw**（非 AgentScope）：

- **Sub-agent 扇出/扇入**：原生支持。
  - `sessions_spawn` 异步非阻塞创建隔离子 session。
  - 子 agent 完成后通过 announce chain 自动汇总回父 session。
- **多 agent 协作**：原生支持。
  - Multi-agent routing 支持多角色隔离 agent。
  - Agent-to-Agent 对等通信可通过 `sessions_send` 实现（默认关闭，需配置白名单）。
- **状态共享/任务委托/结果汇总**：
  - workspace 隔离，可选共享 workspace。
  - `sessions_spawn` 委托 + 自动回传。
  - Teable 被设计为结构化状态唯一事实源。
- **Mattermost 集成**：官方 `@openclaw/mattermost` 插件支持 thread-scoped session、mention 门控、Bot Token + WebSocket。

**结论**：OpenClaw 已经原生支持 sub-agent 扇出扇入和多 agent 协作，框架层改造量≈零。

### 3. DeepSeek Harness vs 开源 Codex Harness

| 维度 | DeepSeek Harness | Codex Harness | OpenClaw（当前） |
|------|-----------------|---------------|-----------------|
| 定位 | 插件化 agent runtime | 生产级 coding agent 执行层 | 自托管 AI agent 网关 |
| Sub-agent | 支持，插件化 dispatch | 原生支持 `spawn_agent` / `wait` | 原生支持 `sessions_spawn` |
| 多 agent 协作 | 通过插件包装异构 agent | 多线程并行 thread | 原生 multi-agent routing + A2A |
| 模型中立 | 高 | 中（偏 OpenAI） | 高 |
| 生产就绪 | 低（developer preview） | 高 | 高 |
| 许可证 | MIT | Apache-2.0 | MIT（待最终确认） |
| 与现有 Mattermost/Teable 集成 | 需重新适配 | 需重新适配 | 已集成 |

**结论**：

- DeepSeek Harness 处于早期 preview，稳定性与生态不足，不建议现在替换。
- Codex Harness 生产级，但偏 OpenAI 生态，整体替换成本高、风险大。
- **OpenClaw 已满足 issue-17 及龙小督督办场景的核心需求，建议保留**。
- 未来如需增强 coding agent 执行质量，可将 Codex app-server 作为工具接入 OpenClaw，而非整体替换。

## 推荐方案

### Mattermost 方案建议

**继续基于 OpenClaw + Mattermost thread 自研话题管理，同时参考 Mattermost 官方 Agents 插件 v2.x 设计。**

理由：

1. WeLink 已经投入 OpenClaw + Mattermost 运行时建设（issue-14），切换官方 Agents 插件成本极高。
2. Mattermost thread 机制已能满足「按话题隔离上下文」的核心需求，OpenClaw 官方 Mattermost 插件也支持 thread-scoped session。
3. 官方 Agents 插件的 RHS 多会话、auto-reply thread、多 agent 等设计可作为 UX 参考，未来如需可渐进引入。
4. 关键注意点：DM 中顶层消息共享 session，需要自研会话管理层（按 `root_id` 或自建会话表）。

### Agent 框架决策建议

**保留 OpenClaw，不替换为 DeepSeek Harness 或 Codex Harness。**

理由：

1. OpenClaw 已原生支持 sub-agent 扇出扇入和多 agent 协作，满足 issue-17 和龙小督场景需求。
2. DeepSeek Harness 处于 developer preview，稳定性不足，不建议在生产环境使用。
3. Codex Harness 成熟但偏 OpenAI 生态，整体替换成本高风险大。
4. 未来如需增强 coding agent 执行能力，可采用「OpenClaw 编排 + Codex app-server 作为工具」的混合架构，而非整体替换。

## 影响

- **issue-17 设计**：话题管理继续基于 OpenClaw + Mattermost thread 实现；Agent 主动创建话题能力依赖 OpenClaw `sessions_spawn` 或本地 topic 状态机。
- **龙小督督办场景**：龙小督作为独立 agent 身份运行，其「主动通知 + 话题控制」依赖 OpenClaw 多 agent 能力；表格查询与填报通过 Teable skills/MCP 接入。
- **风险消除**：无需因「OpenClaw 不支持 sub-agent」而引入新框架，避免技术栈震荡。

## 参考

- Mattermost Agents 插件文档（v2.x）：https://docs.mattermost.com/configure/enable-copilot.html
- Mattermost MCP Server 公告：https://docs.mattermost.com/about/mcp-server.html
- OpenClaw 官方文档与 `@openclaw/mattermost` 插件
- DeepSeek Harness GitHub 仓库（developer preview）
- OpenAI Codex CLI / Codex Harness（Apache-2.0）
- 关联文档：`issue-17/designs/issue-17/feasibility.md`、`issue-17/designs/issue-17/design-review.md`

## 修订记录

| 日期 | 修订内容 | 修订人 |
|------|----------|--------|
| 2026-08-28 | 创建：Mattermost 官方方案、OpenClaw 能力、DSH/Codex 对比与推荐决策 | agent |
