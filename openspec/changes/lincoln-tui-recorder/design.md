## Context

Lincoln 工作流已有 `record-interview` Python CLI 负责录音和元数据生成。本次变更在其之上构建一层 Node.js TUI，解决触发复杂、状态不可见的问题，同时保持后端逻辑复用。

## Goals / Non-Goals

**Goals:**

- 提供极简终端入口 `lincoln`。
- 在终端内展示录音状态、时长、音频电平条。
- 保持与现有 `record-interview` / `process-interview` 工作流的产物兼容。
- 支持全局配置 `~/.lincolnrc`。

**Non-Goals:**

- 不修改 Claude / Codex / OpenCode 等 AI 工具的 UI。
- 不实现实时字幕、音频编辑、云端同步。
- 第一阶段不支持 Windows/Linux。

## Decisions

| 决策 | 选择 | 理由 |
|---|---|---|
| TUI 框架 | `ink` | React for terminal，生态成熟，Claude Code 等工具也在使用 |
| 录音后端 | 复用 `record-interview` Python CLI | 避免重复实现 ffmpeg 录音逻辑，降低风险 |
| 语言/运行时 | TypeScript / Node.js | 便于 npm 分发，与 ink 生态一致 |
| 配置格式 | YAML/JSON `~/.lincolnrc` | 人类可读，易于手动编辑 |
| 音频电平获取 | ffmpeg 实时分析 | 不引入额外 Node.js 音频依赖 |

## Risks / Trade-offs

| 风险 | 缓解措施 |
|---|---|
| `record-interview` CLI 接口变更 | 抽象后端接口，契约测试覆盖 |
| npm 全局安装权限 | 文档说明 `sudo` 或 npm prefix 配置 |
| macOS 麦克风权限 | 首次使用提示用户授权 |
| TUI 在非 TTY 环境异常 | 检测 TTY，未来添加 `--no-tui` 降级模式 |

## Migration Plan

1. 发布 `lincoln` npm 包。
2. PM 通过 `npm install -g lincoln` 安装。
3. 在 Conductor 工作区终端输入 `lincoln` 开始使用。
4. 原有 `record-interview` CLI 继续保留作为备用入口。

## Open Questions

- 是否需要发布到公开 npm registry，还是仅内部私有 registry？
- 是否需要在 CI 中自动测试 TUI 渲染？
