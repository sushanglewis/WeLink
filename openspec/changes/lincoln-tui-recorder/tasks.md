## 1. Setup

- [ ] 1.1 初始化 npm 包 `lincoln`，配置 TypeScript + `tsup` 构建
- [ ] 1.2 安装依赖：`ink`、`react`、`@types/react`、`js-yaml`、`vitest`、`ink-testing-library`
- [ ] 1.3 配置 `bin` 入口，确保全局安装后 `lincoln` 命令可用
- [ ] 1.4 配置测试脚本与覆盖率阈值 80%

## 2. CLI 与配置

- [ ] 2.1 实现 CLI 参数解析（`--topic`、`--design-id`、`--branch`、`--no-tui`）
- [ ] 2.2 实现 `~/.lincolnrc` 与本地 `.lincolnrc` 配置加载
- [ ] 2.3 实现配置优先级：CLI args > 本地 `.lincolnrc` > `~/.lincolnrc` > 默认值
- [ ] 2.4 自动生成 `session_id`（日期 + 工作区/主题派生）

## 3. TUI 核心界面

- [ ] 3.1 创建 `RecordingScreen` 组件：标题、会话信息、录音状态、时长
- [ ] 3.2 实现每秒更新的录音计时器
- [ ] 3.3 创建 `AudioMeter` 组件，支持 `bar` / `dot` / `wave` 样式
- [ ] 3.4 实现脉冲红点动画效果
- [ ] 3.5 创建 `StopConfirmation` 组件（是否触发 process-interview）
- [ ] 3.6 创建 `CancelledScreen` 组件

## 4. 按键与交互

- [ ] 4.1 实现 `useKeyHandler` hook，监听 `Enter`、`q`、`Ctrl+C`
- [ ] 4.2 `Enter` 停止录音并进入确认界面
- [ ] 4.3 `q` 取消录音并退出
- [ ] 4.4 `Ctrl+C` 优雅取消，清理临时文件

## 5. 录音后端集成

- [ ] 5.1 实现 `spawnRecorder`，调用 `record-interview` Python CLI
- [ ] 5.2 正确传递 `--topic`、`--design-id`、`--branch`、`--session-id` 等参数
- [ ] 5.3 监听录音后端 stdout/stderr，更新 TUI 状态
- [ ] 5.4 录音停止后保存产物到 `recordings/` 和 `interviews/`

## 6. 音频电平

- [ ] 6.1 通过 ffmpeg 实时分析音频流获取音量
- [ ] 6.2 将音量映射为 0-1 的 amplitude
- [ ] 6.3 将 amplitude 传递给 `AudioMeter` 实时更新

## 7. Workflow 衔接

- [ ] 7.1 停止录音后询问是否触发 `claude process-interview`
- [ ] 7.2 实现 `triggerProcessInterview` 函数，spawn `claude process-interview`
- [ ] 7.3 确保 metadata.json 格式与 `record-interview` CLI 产物一致

## 8. 测试与文档

- [ ] 8.1 编写单元测试：参数解析、配置加载、计时器格式化、电平计算
- [ ] 8.2 编写集成测试：CLI 启动、按键行为、后端调用、产物生成
- [ ] 8.3 编写 UI 测试：`RecordingScreen`、`StopConfirmation` 渲染
- [ ] 8.4 确保测试覆盖率 ≥ 80%
- [ ] 8.5 编写 README.md：安装、使用、配置说明
