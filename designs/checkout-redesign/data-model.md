# 数据模型：Lincoln TUI 录音工具

**会话 ID**: 2026-06-28-stakeholder-checkout  
**设计 ID**: checkout-redesign

---

## 核心实体

### Session（录音会话）

| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| session_id | string | 必填，唯一 | 格式：`YYYY-MM-DD-descriptive-name` |
| design_id | string | 可选 | 关联设计 ID，如 `checkout-redesign` |
| topic | string | 可选 | 访谈主题 |
| branch | string | 可选 | 当前 git 分支 |
| recording_file | string | 必填 | 录音文件路径，如 `recordings/<session_id>.m4a` |
| started_at | ISO 8601 | 必填 | 录音开始时间 |
| ended_at | ISO 8601 | 可选 | 录音结束时间 |
| duration_seconds | number | 可选 | 录音时长（秒） |
| status | enum | 必填 | `recording`, `completed`, `cancelled` |
| source | string | 必填 | 固定为 `lincoln-tui` |

### TUI State（TUI 运行时状态）

| 字段 | 类型 | 说明 |
|---|---|---|
| is_recording | boolean | 是否正在录音 |
| duration | number | 已录音时长（秒） |
| amplitude | number | 当前音频电平（0-1，可选） |
| last_key | string | 用户最后一次按键 |
| error_message | string | 错误信息 |

### Config（运行时配置 / `~/.lincolnrc`）

`~/.lincolnrc` 采用 YAML 或 JSON 格式，支持以下字段：

| 字段 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| auto_process | boolean | false | 停止后是否自动触发 process-interview |
| default_branch | string | git 当前分支 | 默认分支值 |
| default_design_id | string | "" | 默认 design_id |
| default_topic | string | "" | 默认访谈主题 |
| tui_theme | string | "default" | TUI 主题 |
| show_audio_meter | boolean | true | 是否显示音频电平条 |
| audio_meter_style | string | "bar" | 电平条样式：`bar` / `dot` / `wave` |

### 配置加载优先级

1. 命令行参数（最高优先级）
2. 当前工作区 `.lincolnrc`（若存在）
3. 用户主目录 `~/.lincolnrc`
4. 内置默认值（最低优先级）

## 状态转换

```
[启动] -> recording
recording -> completed (Enter)
recording -> cancelled (q / Ctrl+C)
completed -> [询问是否 process-interview]
```

## 校验规则

1. `session_id` 必须符合 `YYYY-MM-DD-descriptive-name` 格式。
2. `recording_file` 必须在当前工作区 `recordings/` 目录下。
3. 若 `status` 为 `completed`，则 `ended_at` 和 `duration_seconds` 必填。
4. 取消状态下不生成 `recordings/` 音频文件，但可保留空 `metadata.json` 或完全不生成。
