# 需求文档：录音工具可用性改进

**会话 ID**: 2026-06-28-stakeholder-checkout  
**设计 ID**: checkout-redesign  
**访谈主题**: 结算流程 redesign 需求访谈  
**最后更新**: 2026-06-28

## 背景

Lincoln 工作流目前通过 `record-interview` CLI 录制访谈音频，用于产品经理在访谈时 capture 需求。用户使用多种 AI 编程/协作工具（如 Conductor、Claude、Codex、OpenCode 等），无法也不希望将录音功能绑定到某一款封闭产品的 UI 上。当前 `record-interview` 触发方式复杂、状态不可见，需要一款**跨工具、终端原生、可全局安装**的 TUI 录音工具。

## 问题

1. **触发方式不友好**：用户必须记住并输入复杂的 `record-interview` 命令及参数才能启动录音。
   - 来源：`[00:00:02 - 00:00:19]`
2. **录音状态不可见**：录音过程中终端没有明确的“正在录音”提示，用户难以确认录音是否在进行。
   - 来源：`[00:00:19 - 00:00:26]`
3. **集成位置不自然**：用户希望在使用 AI 工具的终端工作区中直接触发录音，而不是切换到另一个 CLI 或记住复杂命令。
   - 来源：`[00:00:26 - 00:00:37]`
4. **交互过于高调**：现有体验对当前工作流造成干扰，需要更低调、顺滑的终端内触发与状态呈现方式。
   - 来源：`[00:00:52 - 00:00:55]`

## 用户

- **主要用户**：使用 Lincoln 工作流进行需求访谈的产品经理（PM）。
- **使用场景**：在 Claude 中与利益相关者对话前后，快速启动/停止录音，并自动进入 `process-interview` 工作流。
- **技术假设**：用户在 macOS 上使用 Conductor 等 AI 工具，终端是主要工作入口；用户不一定熟悉命令行参数，但接受在终端中输入简单命令。

## 方案

### 总体方向

开发一个名为 `lincoln` 的跨平台终端用户界面（TUI）工具，通过 npm 全局安装。用户在任意 Conductor / AI 工具工作区的终端中输入 `lincoln`，即可启动一个带有动态录音状态的 TUI，完成录音后产物与现有 `record-interview`/`process-interview` 工作流保持一致。

### 具体改进点

1. **极简启动**
   - 全局安装：`npm install -g lincoln`
   - 在任意工作区终端输入 `lincoln` 即可开始录音。
   - 自动根据当前工作区与日期生成 `session_id`。
   - 来源：`[00:00:02 - 00:00:19]`

2. **TUI 录音状态**
   - 启动后进入全屏 TUI，显示“正在录音”动态效果（如脉冲红点、时长、波形/进度条）。
   - 提供清晰的停止指引（如“按 Enter 或 q 停止”）。
   - 来源：`[00:00:19 - 00:00:26]`, `[00:00:37 - 00:00:52]`

3. **低调交互**
   - TUI 占据当前终端标签页，不弹出系统通知或弹窗。
   - 动态效果柔和，不占用大量注意力。
   - 来源：`[00:00:52 - 00:00:55]`

4. **与现有工作流兼容**
   - 录音文件保存到当前工作区 `recordings/<session-id>.m4a`。
   - 元数据写入 `interviews/<session-id>/metadata.json`。
   - 停止录音后询问是否触发 `claude process-interview` 或仅保存产物。

## 验收标准

1. 用户可在任意工作区终端输入 `lincoln` 启动录音，无需记忆复杂参数。
2. TUI 在整个录音期间显示动态“正在录音”状态（含时长）。
3. TUI 提供清晰的停止方式（如按键或按钮）。
4. 停止录音后自动生成标准 `recordings/` 与 `interviews/` 产物。
5. 用户可选择是否立即触发 `process-interview`。
6. 产物格式与现有 `record-interview` CLI 完全一致，可互换使用。
7. 支持 macOS，优先支持 Conductor 工作区终端环境。

## 非目标

- 不实现专业级多轨音频编辑。
- 不实现录音过程中的实时字幕或实时转写。
- 不替换或废弃现有的 `record-interview` Python CLI（可作为高级/备用入口保留）。
- 不构建原生 GUI 桌面应用或浏览器插件，聚焦在终端 TUI。
- 第一阶段不强制支持 Windows/Linux，优先保证 macOS + Conductor 体验。

## 开放问题

1. ✅ **TUI 技术栈**：使用 `ink` (React for terminal)。
2. ✅ **后端策略**：`lincoln` TUI 直接调用现有 Python `record-interview` CLI，复用其录音与元数据逻辑。
3. ✅ **停止交互**：支持 `Enter` 停止并保存、`q` 取消、以及 `Ctrl+C` 优雅取消（不保存、不触发 process-interview）。
4. ✅ **TUI 音频电平条**：在 TUI 中展示实时音频电平条。
5. ✅ **全局配置**：支持 `~/.lincolnrc` 配置文件，保存默认参数。
6. `lincoln` 启动时是否需要自动读取当前 git 分支作为 `--branch` 默认值？（默认：是）
7. 录音保存目录是否严格遵循当前工作区，还是允许通过环境变量/配置自定义？（默认：当前工作区）

## GitHub Issues

本需求已拆分为以下 GitHub Issues，用于研发实现：

- #3 [Lincoln] lincoln-cli: CLI entry, args parsing, and ~/.lincolnrc config loading
- #4 [Lincoln] lincoln-tui: Recording screen, audio meter, and key handlers
- #5 [Lincoln] lincoln-recording-backend: Spawn record-interview and save artifacts
- #6 [Lincoln] lincoln-workflow-integration: Trigger process-interview after recording

完整映射见 `.github/linked-issues.yaml`。

<!-- status: approved -->
