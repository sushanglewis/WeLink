# 字段规格：Lincoln TUI 录音工具

**会话 ID**: 2026-06-28-stakeholder-checkout  
**设计 ID**: checkout-redesign

---

## 字段

### CLI 参数

| 字段名 | 数据类型 | 必填 | 默认值 | 说明 | 来源 |
|---|---|---|---|---|---|
| session_id | string | 否 | 自动生成 | 录音会话标识 | 系统自动 |
| --topic | string | 否 | `~/.lincolnrc` 或 "" | 访谈主题 | 用户输入 / 配置 |
| --design-id | string | 否 | `~/.lincolnrc` 或 "" | 关联设计 ID | 用户输入 / 配置 |
| --branch | string | 否 | git 当前分支 | 当前分支 | 自动检测 / 用户输入 |
| --no-tui | boolean | 否 | false | 是否禁用 TUI（MVP 外） | 用户输入 |

### 全局配置（`~/.lincolnrc`）

| 字段名 | 数据类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| auto_process | boolean | 否 | false | 停止后是否自动触发 process-interview |
| default_branch | string | 否 | "" | 默认分支值 |
| default_design_id | string | 否 | "" | 默认 design_id |
| default_topic | string | 否 | "" | 默认访谈主题 |
| show_audio_meter | boolean | 否 | true | 是否显示音频电平条 |
| audio_meter_style | string | 否 | "bar" | 电平条样式：`bar` / `dot` / `wave` |
| tui_theme | string | 否 | "default" | TUI 主题 |

### TUI 运行时状态

| 字段名 | 数据类型 | 说明 | 来源 |
|---|---|---|---|
| is_recording | boolean | 是否正在录音 | 录音后端状态 |
| duration | number | 已录音时长（秒） | TUI 计时器 |
| amplitude | number (0-1) | 当前音频电平 | ffmpeg 音频分析 |
| error_message | string | 错误信息 | 录音后端 / 系统错误 |
| last_key | string | 用户最后一次按键 | TUI 输入监听 |

### Session 元数据（写入 metadata.json）

| 字段名 | 数据类型 | 必填 | 说明 |
|---|---|---|---|
| session_id | string | 是 | 会话标识 |
| sessionId | string | 是 | 与 session_id 一致（兼容字段） |
| design_id | string | 否 | 设计 ID |
| topic | string | 否 | 访谈主题 |
| branch | string | 否 | 分支 |
| recording_file | string | 是 | 录音文件路径 |
| originalFile | string | 是 | 与 recording_file 一致（兼容字段） |
| started_at | ISO 8601 | 是 | 开始时间 |
| ended_at | ISO 8601 | 否 | 结束时间 |
| duration_seconds | number | 否 | 时长 |
| duration | number | 否 | 与 duration_seconds 一致（兼容字段） |
| source | string | 是 | 固定为 `lincoln-tui` |
| status | string | 是 | `completed` / `cancelled` |
| processedAt | ISO 8601 | 否 | 处理时间 |
| transcriptModel | string | 否 | 转写模型 |
| language | string | 否 | 语言 |

## 校验

| 字段/配置 | 校验规则 |
|---|---|
| session_id | 必须符合 `YYYY-MM-DD-descriptive-name` 格式 |
| --design-id / default_design_id | 必须为 kebab-case |
| --topic / default_topic | 不超过 200 字符 |
| `~/.lincolnrc` | 必须为有效 YAML 或 JSON |
| audio_meter_style | 必须是 `bar` / `dot` / `wave` 之一 |
| metadata.status | 必须是 `completed` 或 `cancelled` |
| metadata | 若 `status` 为 `completed`，`ended_at` 和 `duration_seconds` 必填 |

## 错误状态

| 错误场景 | 错误提示 | 处理方式 |
|---|---|---|
| 录音中麦克风无权限 | "麦克风权限被拒绝，请在系统设置中授权" | 退出 TUI，返回错误码 |
| ffmpeg 未安装 | "未检测到 ffmpeg，请先安装" | 退出 TUI，返回错误码 |
| `record-interview` CLI 调用失败 | "录音后端启动失败：{error_message}" | 显示错误，清理临时文件，退出 |
| `~/.lincolnrc` 格式错误 | "配置文件解析失败，请检查 ~/.lincolnrc" | 使用内置默认值继续，或退出 |
| 磁盘空间不足 | "磁盘空间不足，无法保存录音" | 停止录音，提示用户清理空间 |
| 无音频输入超过 10 秒 | "未检测到音频输入，请检查麦克风" | TUI 显示警告，继续录音 |
| 取消录音 | "录音已取消" | 不保存产物，优雅退出 |
