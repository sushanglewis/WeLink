# 决策记录：龙小督运行底座事实纠正（AgentScope vs OpenClaw）

- 日期：2026-09-08
- 状态：已确认（PM 口头确认，见 `interviews/2026-09-08-context-memory/summary.md` 决策 #0）
- 影响范围：context-memory 工作包全部设计文档；issue-17 调研文档不回改

## 背景

`issue-17/docs/research/agent-framework-decision.md`（2026-08-24）记载：WeLink 数字员工实际运行时底座为 **OpenClaw**（非 AgentScope），并基于 OpenClaw 的 session spawn/announce chain、Mattermost thread-scoped session 等机制做了话题管理设计。

## 纠正

2026-09-08 PM 在上下文/记忆方案讨论中确认：**龙小督基于 AgentScope 框架自研，7×24 小时服务，会话已持久化到 PostgreSQL**。

## 对本工作包的影响

1. 会话管理层设计以「AgentScope 运行时 + PostgreSQL 会话持久化」为现状基线，不假设 OpenClaw 的 session 机制可用。
2. 记忆层对接设计面向 AgentScope 的 agent/记忆扩展点（自定义 memory 模块 + 文件工作区），不依赖 OpenClaw 插件体系。
3. issue-17 中基于 OpenClaw 的话题管理设计（F-T01~F-T05）与本工作包的记忆层是两层正交关注点：前者管「对话在哪发生」，后者管「对话沉淀到哪、如何被回忆」。若 issue-17 后续底座也切换/确认为 AgentScope，其调研文档需另行更新。
