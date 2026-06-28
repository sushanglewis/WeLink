# 可行性分析：Lincoln TUI 录音工具

**会话 ID**: 2026-06-28-stakeholder-checkout  
**设计 ID**: checkout-redesign

---

## 业务可行性

### 为什么做这个工具

- 访谈反馈直接来自真实用户（PM），痛点明确：触发复杂、状态不可见。
- 不修改封闭 AI 工具（Claude/Codex/OpenCode）的 UI，以独立 npm 包形式交付，落地阻力小。
- 产物格式与现有工作流兼容，不破坏已有投资。

### 预期收益

- 降低每次访谈的启动认知负担。
- 提升录音状态的确定性，减少用户焦虑。
- 为 Lincoln 工作流提供一个跨工具的统一入口。

## 技术可行性

### 技术框架

### 前端/TUI 层

- **[ink](https://github.com/vadimdemedes/ink)**：React for terminal，组件化、支持 Flexbox、Focus 管理，生态成熟。
- **React 19 + TypeScript**：现代 React 版本，与 Ink 6+ 兼容。

### 后端/录音层

- **现有 `record-interview` Python CLI**：复用 ffmpeg 录音、元数据生成逻辑。
- **Node.js `child_process.spawn`**：TUI 调用 Python CLI 并处理其 stdout/stderr。

### 配置与工具

- **YAML/JSON 解析**：`js-yaml` 或原生 JSON 解析 `~/.lincolnrc`。
- **音频电平检测**：
  - 方案 A：通过 ffmpeg `volumedetect`/`silencedetect` 实时读取音量。
  - 方案 B：Node.js 使用 `mic` + `web-audio-api` 或 `node-audio` 分析音频流。
- **打包**：`tsup` 输出 CJS/ESM。
- **测试**：`Vitest` + `ink-testing-library`。

## 推荐技术栈

| 层级 | 技术 | 说明 |
|---|---|---|
| TUI 框架 | [ink](https://github.com/vadimdemedes/ink) | React for terminal，成熟、生态活跃，Claude Code 等工具也在使用 |
| 语言 | TypeScript / Node.js | 便于 npm 分发与 Conductor 工作区集成 |
| 打包 | tsup / unbuild | 输出 CommonJS + ESM |
| 录音后端 | 现有 `record-interview` Python CLI | 复用 ffmpeg 录音逻辑与元数据生成 |
| 测试 | Vitest | 单元测试与集成测试 |

### ink 当前状态（2026）

- 主流版本已基于 React 19 / Ink 6+。
- 支持 Flexbox 布局、focus 管理、组件化开发。
- 高-profile 采用：Claude Code、Gemini CLI、GitHub Copilot CLI 均基于 Ink 构建。
- 可通过 `npx create-ink-app --typescript` 快速初始化项目。

### 开源项目参考

- [vadimdemedes/ink](https://github.com/vadimdemedes/ink) - 核心 TUI 框架
- [ink-terminal](https://www.jsdelivr.com/package/npm/ink-terminal) - 高性能 renderer（进阶参考）
- [pastel](https://github.com/vadimdemedes/pastel) - 类 Next.js 的 CLI 框架（若需要更复杂路由）

## 风险评估

| 风险 | 等级 | 缓解措施 |
|---|---|---|
| npm 全局安装权限问题 | 中 | 提供 `npm install -g` 指南，或推荐 npx 运行 |
| macOS 麦克风权限 | 中 | 首次运行时提示用户授权终端 |
| 调用 Python CLI 增加依赖 | 低 | 明确文档要求系统已安装 Python + record-interview |
| TUI 在非 TTY 环境异常 | 低 | 检测 TTY，未来可添加 `--no-tui` 降级模式 |
| ink 版本兼容 | 低 | 锁定 React 19 + Ink 6+，CI 中跑测试 |

## 推荐实现路径

1. **MVP**：用 `ink` 构建最简 TUI，调用 `record-interview` 录音，支持 Enter/q/Ctrl+C。
2. **迭代**：添加实时音频电平条（通过 ffmpeg 音量检测或 Node.js 音频流分析）、`~/.lincolnrc` 配置解析、自动 session_id、git 分支检测、处理确认提示。
3. **增强**：多电平条样式、全局配置可视化编辑、Windows/Linux 支持。

## 结论

技术栈成熟、业务诉求清晰、风险可控，建议进入 `product-prototype` 阶段。
