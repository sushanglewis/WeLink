## Why

当前 Lincoln 工作流依赖 `record-interview` Python CLI 启动访谈录音，PM 需要记忆复杂命令、无法直观确认录音状态，导致访谈启动门槛高、体验不连贯。本变更引入 `lincoln` npm 全局 TUI 工具，让 PM 在任意 AI 工具工作区终端输入 `lincoln` 即可一键录音，并通过终端内动态界面获得实时状态反馈。

## What Changes

- 新增 `lincoln` npm 全局包，提供 `lincoln` CLI 命令。
- 基于 `ink` 构建终端 TUI，展示“正在录音”脉冲红点、时长、实时音频电平条。
- TUI 复用现有 `record-interview` Python CLI 作为录音后端，保持产物格式兼容。
- 支持 `Enter` 保存、`q` 取消、`Ctrl+C` 优雅取消。
- 支持 `~/.lincolnrc` 全局配置文件，保存默认 design_id、topic、branch 等参数。
- 录音停止后询问是否触发 `claude process-interview`。

## Capabilities

### New Capabilities

- `lincoln-cli`: CLI 入口、参数解析、配置加载。
- `lincoln-tui`: ink 终端界面、录音状态渲染、音频电平条、按键交互。
- `lincoln-recording-backend`: 调用 `record-interview` 后端、产物保存、元数据写入。
- `lincoln-workflow-integration`: 停止录音后触发 `process-interview` 的衔接逻辑。

### Modified Capabilities

- 无现有 spec 需要修改需求。

## Impact

- 新增 npm 包依赖：`ink`、`react`、`typescript`、`js-yaml` 等。
- 系统依赖：`ffmpeg`、现有 `record-interview` Python CLI。
- 用户安装方式： `npm install -g lincoln`。
- 产物目录与现有 Lincoln 工作流一致，不破坏下游 `process-interview`。

## 来源

本提案基于以下设计产物：

- [designs/checkout-redesign/design-review.md](../../../designs/checkout-redesign/design-review.md)
- [designs/checkout-redesign/tdd-plan.md](../../../designs/checkout-redesign/tdd-plan.md)
- [designs/checkout-redesign/prototype.pen](../../../designs/checkout-redesign/prototype.pen)
