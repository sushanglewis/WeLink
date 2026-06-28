# PRD：Lincoln TUI 录音工具

**会话 ID**: 2026-06-28-stakeholder-checkout  
**设计 ID**: checkout-redesign  
**版本**: 1.0.0  
**状态**: 已确认

---

## 1. 产品背景

Lincoln 工作流目前通过 `record-interview` Python CLI 录制访谈音频。访谈反馈显示，该工具在触发方式、状态可见性和集成位置上存在可用性问题。由于 Claude 等 AI 工具本身不开源，无法直接修改其 UI，因此需要一个**独立的、跨工具的终端 TUI 录音工具**。

## 2. 目标

- 提供极简终端入口：用户输入 `lincoln` 即可启动录音。
- 在终端内提供动态、可视化的“正在录音”状态反馈。
- 保持与现有 `record-interview` / `process-interview` 工作流的产物兼容。
- 不绑定任何单一 AI 工具，可在 Conductor、Claude、Codex、OpenCode 等工作区终端中使用。

## 3. 目标用户

| 用户角色 | 痛点 | 使用频率 |
|---|---|---|
| 产品经理（PM） | 记不住 `record-interview` 参数、不确定录音状态 | 每次访谈 |
| 研发团队 | 需要稳定的产物格式与自动化入口 | 持续 |

## 4. 功能规格

### 4.1 安装与入口

- **分发方式**：npm 全局包 `lincoln`。
- **安装命令**：`npm install -g lincoln`。
- **启动命令**：在任意工作区终端输入 `lincoln`。
- **参数**（可选）：
  - `--topic "结算流程 redesign 需求访谈"`
  - `--design-id checkout-redesign`
  - `--branch pm-workflow-integration-plugin`
  - 未指定时，自动从 git 分支、当前日期派生默认值。

### 4.2 TUI 录音界面

- **技术栈**：`ink`（React for terminal）。
- **默认界面**：
  - 顶部：访谈主题 / session_id / 当前分支
  - 中部：大型脉冲红点 + “正在录音” 文字 + 已录音时长
  - 底部：操作提示（“按 Enter 停止录音 · 按 q 取消 · Ctrl+C 优雅取消”）
- **动态效果**：
  - 脉冲红点，频率约 1Hz，柔和不刺眼。
  - 时长每秒更新。
  - 可选简单音频电平可视化（条形图）。

### 4.3 停止录音与后续

- **停止方式**：
  - 按 `Enter` 停止并保存录音。
  - 按 `q` 取消录音（不保存）。
  - 按 `Ctrl+C` 优雅取消（不保存、不触发 process-interview、清理临时文件）。
- **停止后**：
  - 保存音频到 `recordings/<session-id>.m4a`。
  - 写入 `interviews/<session-id>/metadata.json`。
  - 询问是否立即触发 `claude process-interview`。

### 4.4 与现有 CLI 兼容

- `lincoln` TUI 直接调用现有 Python `record-interview` CLI 作为录音后端。
- 产物格式与 CLI 完全一致，确保后续 `process-interview` 可正常处理。
- `record-interview` CLI 继续保留，可作为独立入口使用。

## 5. 验收标准

1. `npm install -g lincoln` 后，`lincoln` 命令全局可用。
2. 在 Conductor 工作区终端输入 `lincoln` 后 3 秒内进入 TUI 并开始录音。
3. TUI 在整个录音期间显示动态“正在录音”状态和时长。
4. 按 Enter 停止后 5 秒内产物保存完毕。
5. 产物格式与 `record-interview` CLI 产物一致。
6. 原有 `record-interview` CLI 行为不变。

## 6. 非目标

- 不实现专业级多轨音频编辑。
- 不实现录音过程中的实时字幕或实时转写。
- 不替换 `record-interview` Python CLI（保留为底层后端/备用入口）。
- 不构建原生 GUI 桌面应用或浏览器插件。
- 第一阶段不强制支持 Windows/Linux，优先 macOS。

## 7. 开放问题

1. ✅ TUI 技术栈：`ink`
2. ✅ 后端策略：直接调用现有 Python `record-interview` CLI
3. ✅ 停止交互：`Enter` 保存、`q` 取消、`Ctrl+C` 优雅取消
4. 是否需要在 TUI 中直接显示音频电平条？（默认：MVP 不显示，仅显示时长）

## 8. 依赖与风险

| 依赖 | 风险等级 | 说明 |
|---|---|---|
| npm 全局安装权限 | 中 | 可能需要 `sudo` 或配置 npm  prefix |
| ffmpeg | 低 | 系统需已安装 ffmpeg |
| TUI 框架成熟度 | 低 | `ink` 生态成熟，文档完善 |
| 麦克风权限 | 中 | macOS 首次运行时需授权终端 |

## 9. 可追溯性

- 触发入口需求：`[00:00:02 - 00:00:19]`
- 状态可见性需求：`[00:00:19 - 00:00:26]`
- 终端内集成需求：`[00:00:26 - 00:00:37]`
- 低调交互需求：`[00:00:52 - 00:00:55]`
- 跨工具 TUI 方向：用户澄清反馈
