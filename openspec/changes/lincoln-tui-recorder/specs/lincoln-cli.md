# Lincoln CLI 规格

## 概述

`lincoln` 命令是用户与 Lincoln TUI 录音工具的主要交互入口。它负责解析参数、加载配置、启动 TUI，并在录音完成后处理后续流程。

## 命令格式

```bash
lincoln [session-id] [options]
```

## 参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| session-id | string | 否 | 录音会话标识。若省略，自动生成 |
| --topic | string | 否 | 访谈主题 |
| --design-id | string | 否 | 关联设计 ID（kebab-case） |
| --branch | string | 否 | 当前 git 分支。默认自动检测 |
| --no-tui | boolean | 否 | 禁用 TUI（MVP 外） |
| --help | boolean | 否 | 显示帮助信息 |
| --version | boolean | 否 | 显示版本号 |

## 配置加载

1. 读取内置默认值
2. 读取 `~/.lincolnrc`（若存在）
3. 读取当前工作区 `.lincolnrc`（若存在）
4. 读取 CLI 参数

后加载的配置覆盖先加载的配置。

## 输出

- 启动 TUI 后，终端进入全屏交互模式。
- 录音完成后，根据用户选择可能触发 `claude process-interview`。

## 错误处理

- `~/.lincolnrc` 格式错误：显示警告，使用默认值继续。
- git 分支检测失败：branch 字段留空，不影响录音。
- 非 TTY 环境：若 `--no-tui` 未提供，显示错误并退出。
