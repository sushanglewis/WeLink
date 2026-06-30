# 设计评审：Lincoln TUI 录音工具

**会话 ID**: 2026-06-28-stakeholder-checkout  
**设计 ID**: checkout-redesign  
**版本**: 1.0.0  
**状态**: 待 PM 审阅

---

## 决策摘要

基于已确认的需求，我们决定开发一款名为 `lincoln` 的 **npm 全局 TUI 录音工具**，以解决当前 `record-interview` CLI 触发复杂、状态不可见的问题。该工具不绑定任何单一 AI 工具（如 Claude），可在 Conductor、Codex、OpenCode 等任意工作区终端中使用。

## 范围

### 在范围内

- `lincoln` npm 全局包，安装后提供 `lincoln` 命令。
- 基于 `ink` 的终端用户界面（TUI）。
- 调用现有 Python `record-interview` CLI 作为录音后端。
- 动态“正在录音”状态展示（脉冲红点、时长、**实时音频电平条**）。
- 支持 `Enter` 保存、`q` 取消、`Ctrl+C` 优雅取消。
- 支持 `~/.lincolnrc` 全局配置文件。
- 产物与现有工作流兼容（`recordings/` + `interviews/`）。

### 不在范围内

- 不修改 Claude / Codex / OpenCode 等工具的 UI。
- 不实现实时字幕、音频编辑、云端同步。
- 第一阶段不原生支持 Windows/Linux。

## 设计文档链接

- [用户场景](scenarios.md)
- [功能清单](feature-catalog.md)
- [数据模型](data-model.md)
- [流程图](flows.md)
- [可行性分析](feasibility.md)

## 待解决问题

1. ✅ **TUI 音频电平条**：在 TUI 中展示实时音频电平条。
2. ✅ **全局配置**：支持 `~/.lincolnrc` 配置文件，保存默认参数。
3. 是否需要在 npm 包发布前提供本地 `npm link` 开发流程？（默认：是）

## 审批清单

- [x] 设计文档包完整（6 个文件）
- [x] 功能范围与需求一致
- [x] 技术栈选择合理
- [x] 流程图可理解
- [x] 风险已识别并可接受

<!-- status: approved -->
