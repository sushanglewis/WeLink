# TDD 研发计划：Lincoln TUI 录音工具

**会话 ID**: 2026-06-28-stakeholder-checkout  
**设计 ID**: checkout-redesign  
**版本**: 1.0.0

---

## 来源链接

- [requirements/2026-06-28-stakeholder-checkout/requirements.md](../../requirements/2026-06-28-stakeholder-checkout/requirements.md)
- [requirements/2026-06-28-stakeholder-checkout/user-stories.md](../../requirements/2026-06-28-stakeholder-checkout/user-stories.md)
- [requirements/2026-06-28-stakeholder-checkout/prd.md](../../requirements/2026-06-28-stakeholder-checkout/prd.md)
- [designs/checkout-redesign/design-review.md](../design-review.md)
- [designs/checkout-redesign/scenarios.md](../scenarios.md)
- [designs/checkout-redesign/feature-catalog.md](../feature-catalog.md)
- [designs/checkout-redesign/data-model.md](../data-model.md)
- [designs/checkout-redesign/flows.md](../flows.md)
- [designs/checkout-redesign/feasibility.md](../feasibility.md)
- [designs/checkout-redesign/fields.md](../fields.md)
- [designs/checkout-redesign/ui-spec.md](../ui-spec.md)
- [designs/checkout-redesign/prototype.pen](../prototype.pen)

---

## 验收标准映射

| 验收标准 | 来源 | 测试覆盖 |
|---|---|---|
| 用户可输入 `lincoln` 启动录音 | 需求文档 | 集成测试：CLI 入口解析与 TUI 启动 |
| TUI 显示动态“正在录音”状态和时长 | `[00:00:19 - 00:00:26]` | UI 测试：渲染状态、计时器递增 |
| 支持 `Enter` 保存、`q` 取消、`Ctrl+C` 优雅取消 | 用户澄清 | 集成测试：按键事件与产物行为 |
| 产物保存到 `recordings/` 和 `interviews/` | 需求文档 | 集成测试：文件系统断言 |
| 产物格式与 `record-interview` CLI 一致 | 需求文档 | 契约测试：metadata.json schema |
| 调用现有 Python `record-interview` CLI | 用户澄清 | 集成测试：spawn 调用与参数传递 |
| 支持 `~/.lincolnrc` 全局配置 | 用户澄清 | 单元测试：配置加载优先级 |
| TUI 展示实时音频电平条 | 用户澄清 | UI 测试：电平条随 amplitude 变化 |

---

## 测试场景

### 场景 1：正常录音并保存

1. 用户在终端输入 `lincoln`。
2. TUI 启动并开始录音。
3. TUI 显示“正在录音”、时长、音频电平条。
4. 用户按 `Enter`。
5. 录音保存到 `recordings/<session_id>.m4a`。
6. 元数据写入 `interviews/<session_id>/metadata.json`。
7. TUI 询问是否处理访谈。
8. 用户选择“否”，TUI 退出。

**来源**: [用户场景](../scenarios.md) 场景 1

### 场景 2：取消录音

1. 用户输入 `lincoln` 开始录音。
2. 用户按 `q`。
3. TUI 显示“录音已取消”。
4. 不生成 `recordings/` 和 `interviews/` 产物。

**来源**: [用户场景](../scenarios.md) 场景 2

### 场景 3：Ctrl+C 优雅取消

1. 用户输入 `lincoln` 开始录音。
2. 用户按 `Ctrl+C`。
3. 工具清理临时文件并退出。
4. 不生成产物，不触发 process-interview。

**来源**: [UI 规格](../ui-spec.md)

### 场景 4：全局配置生效

1. `~/.lincolnrc` 中设置 `default_design_id=checkout-redesign`。
2. 用户输入 `lincoln`。
3. TUI 自动使用 `checkout-redesign` 作为 design_id。

**来源**: [数据模型](../data-model.md)

### 场景 5：麦克风权限错误

1. 用户输入 `lincoln`。
2. 系统未授权麦克风。
3. TUI 显示错误信息并退出。

**来源**: [字段规格](../fields.md) 错误状态

---

## 红/绿/重构序列

### 任务 1：CLI 入口与参数解析

1. **红**：测试 `lincoln` 命令不存在时抛出错误。
2. **绿**：创建 `src/cli.tsx`，解析 `--topic`、`--design-id`、`--branch`。
3. **重构**：将参数解析提取到 `src/config/args.ts`。

### 任务 2：配置加载

1. **红**：测试 `~/.lincolnrc` 不存在时使用默认值。
2. **绿**：实现 `src/config/loadConfig.ts`，支持 YAML/JSON。
3. **重构**：统一配置优先级：CLI args > 本地 `.lincolnrc` > `~/.lincolnrc` > 默认值。

### 任务 3：TUI 录音主界面

1. **红**：测试 `RecordingScreen` 渲染标题、状态、时长。
2. **绿**：使用 `ink` 创建 `RecordingScreen` 组件。
3. **重构**：将样式提取为 `src/components/theme.ts`。

### 任务 4：音频电平条

1. **红**：测试 `AudioMeter` 根据 amplitude 渲染正确块数。
2. **绿**：实现 `src/components/AudioMeter.tsx`。
3. **重构**：支持 `bar` / `dot` / `wave` 三种样式。

### 任务 5：按键处理

1. **红**：测试 `Enter` 触发 `onStop`，`q` 触发 `onCancel`，`Ctrl+C` 触发 `onCancel`。
2. **绿**：实现 `src/hooks/useKeyHandler.ts`。
3. **重构**：支持可配置的按键映射。

### 任务 6：调用录音后端

1. **红**：测试 `record-interview` CLI 被正确 spawn。
2. **绿**：实现 `src/recording/spawnRecorder.ts`。
3. **重构**：抽象录音后端接口，便于未来替换。

### 任务 7：停止确认与 process-interview 触发

1. **红**：测试停止后显示确认界面。
2. **绿**：实现 `StopConfirmation` 组件和 `process-interview` spawn。
3. **重构**：将 process-interview 触发逻辑独立为 `src/workflow/triggerProcessInterview.ts`。

### 任务 8：产物与元数据写入

1. **红**：测试停止后 metadata.json 包含正确字段。
2. **绿**：实现 `src/recording/writeMetadata.ts`。
3. **重构**：确保与 `record-interview` CLI 产物格式一致。

---

## 测试边界

### 单元测试

- 参数解析（`src/config/args.ts`）
- 配置加载（`src/config/loadConfig.ts`）
- 计时器格式化（`src/utils/formatDuration.ts`）
- 音频电平计算（`src/utils/amplitudeToMeter.ts`）
- 按键处理（`src/hooks/useKeyHandler.ts`）

### 集成测试

- `lincoln` 命令启动 TUI
- `Enter` / `q` / `Ctrl+C` 按键行为
- `record-interview` CLI 调用与参数传递
- 产物文件生成
- 配置优先级

### UI 测试

- `RecordingScreen` 渲染状态、时长、电平条
- `StopConfirmation` 选项切换与确认
- `CancelledScreen` 渲染

### 契约测试

- `metadata.json` 字段与 `record-interview` CLI 产物一致
- `record-interview` CLI 调用协议稳定

### 回归范围

- 不破坏现有 `record-interview` CLI 行为
- 不破坏 `process-interview` 工作流
- 产物目录结构保持一致

---

## 数据 Fixtures

### Fixture 1：有效配置

```yaml
# ~/.lincolnrc
auto_process: false
default_design_id: checkout-redesign
default_topic: "结算流程 redesign 需求访谈"
show_audio_meter: true
audio_meter_style: bar
```

### Fixture 2：CLI 参数

```bash
lincoln --topic "测试访谈" --design-id test-design --branch main
```

### Fixture 3：录音中状态

```json
{
  "is_recording": true,
  "duration": 83,
  "amplitude": 0.65,
  "error_message": null
}
```

### Fixture 4：完成后的 metadata.json

```json
{
  "session_id": "2026-06-28-stakeholder-checkout",
  "design_id": "checkout-redesign",
  "topic": "结算流程 redesign 需求访谈",
  "branch": "pm-workflow-integration-plugin",
  "recording_file": "recordings/2026-06-28-stakeholder-checkout.m4a",
  "started_at": "2026-06-28T01:09:40Z",
  "ended_at": "2026-06-28T01:10:41Z",
  "duration_seconds": 60.97,
  "source": "lincoln-tui",
  "status": "completed"
}
```

---

## 任务切片

| 切片 | 描述 | 验收标准 | 依赖 |
|---|---|---|---|
| T1 | 初始化 npm 包与 `ink` 项目结构 | `npm run build` 通过，CLI 入口可执行 | 无 |
| T2 | CLI 参数解析 | 支持 `--topic`、`--design-id`、`--branch` | T1 |
| T3 | 配置加载（`~/.lincolnrc`） | 配置优先级正确，格式错误优雅降级 | T1 |
| T4 | TUI 录音主界面 | 显示标题、状态、时长、电平条 | T1 |
| T5 | 按键处理 | `Enter` / `q` / `Ctrl+C` 行为正确 | T4 |
| T6 | 调用 `record-interview` 后端 | 正确 spawn 并传递参数 | T2 |
| T7 | 音频电平获取 | 电平条实时更新 | T6 |
| T8 | 停止确认与 process-interview 触发 | 询问并触发后续流程 | T5, T6 |
| T9 | 元数据写入 | metadata.json 格式与 CLI 一致 | T6 |
| T10 | 测试覆盖 80%+ | 单元 + 集成 + UI 测试通过 | T1-T9 |
| T11 | README 与安装文档 | `npm install -g lincoln` 可用 | T10 |

---

## 风险与依赖

| 风险 | 影响 | 缓解措施 |
|---|---|---|
| `record-interview` CLI 接口变更 | 高 | 抽象后端接口，契约测试覆盖 |
| macOS 麦克风权限弹窗阻塞 | 中 | 首次使用提示用户授权 |
| npm 全局安装权限 | 中 | 文档说明 `sudo` 或 npm prefix 配置 |
| ink 版本与 React 19 兼容性 | 低 | 锁定版本，CI 测试 |
| 音频电平获取延迟 | 低 | 使用独立子进程，不阻塞 TUI 渲染 |

## 范围外

- Windows/Linux 原生支持
- 录音暂停/继续
- 实时字幕
- 云端同步
- 多麦克风选择

<!-- status: ready-for-openspec -->
