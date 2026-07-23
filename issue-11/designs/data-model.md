# 数据模型: issue-11

## 实体

### AppConfig（应用配置）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `server_url` | string | 必填，安装包预配置 | 组织地址，默认 `https://lgdg.cc` |
| `app_name` | string | 必填 | 应用显示名称，如「EAIC」 |
| `brand_primary_color` | string | 可选，HEX | 主品牌色 |
| `enable_auto_start` | boolean | 默认 `false` | 是否默认开机自启 |
| `allow_multiple_instances` | boolean | 默认 `false` | 是否允许多开 |

### UserSession（用户会话）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `user_id` | string | 登录后写入 | Mattermost 用户 ID |
| `access_token` | string | 加密存储 | Mattermost access token |
| `refresh_token` | string | 加密存储 | 用于长期保持登录 |
| `expires_at` | datetime | 用于预刷新 | access token 过期时间 |
| `email` | string | 登录后写入 | 企业邮箱 |
| `remember_me` | boolean | 默认 `true` | 是否长期保持登录 |

### NavigationItem（一级导航项）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | string | 必填 | `contacts` / `chat` / `ai-sheets` |
| `label` | string | 必填 | 显示名称，如「通讯录」「聊天」「AI 表格」 |
| `position` | enum | 默认 `sidebar` | 导航位置 |
| `icon` | string | 必填 | 图标名称/SVG |
| `type` | enum | 必填 | `webview` / `native` |
| `url_path` | string | `type=webview` 时必填 | WebView 加载路径 |
| `order` | integer | 必填 | 排序 |

### WebViewTab（WebView 标签/视图）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | string | 必填 | 标签唯一标识 |
| `navigation_id` | string | 必填 | 所属导航项 |
| `url` | string | 必填 | 当前加载 URL |
| `title` | string | 可同步自 WebView | 页面标题 |
| `unread_count` | integer | 由 Bridge 上报 | 未读消息数 |
| `is_active` | boolean | 同一时刻仅一个为 `true` | 是否当前展示 |

### Notification（系统通知）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | string | 必填 | 通知唯一标识 |
| `title` | string | 必填 | 通知标题 |
| `body` | string | 必填 | 通知内容 |
| `channel_id` | string | 必填 | 频道/会话 ID，用于点击跳转 |
| `source` | enum | 必填 | `webview` / `native` |
| `sender_name` | string | 可选 | 发送者名称 |
| `created_at` | datetime | 必填 | 通知时间 |

### AppSettings（应用设置）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `language` | string | 默认 `zh-CN` | 界面语言 |
| `theme` | enum | 默认 `system` | `light` / `dark` / `system` |
| `notification_enabled` | boolean | 默认 `true` | 是否启用通知 |
| `notification_sound` | boolean | 默认 `true` | 是否播放声音 |
| `auto_start` | boolean | 默认 `false` | 开机自启 |
| `minimize_to_tray` | boolean | 默认 `true` | 关闭时最小化到托盘 |
| `download_path` | string | 默认系统下载文件夹 | 文件默认下载目录 |

## 关系

- `UserSession` 属于一个 `AppConfig`：同一应用配置下可存在多个用户会话，但当前仅单账号登录。
- `WebViewTab` 关联一个 `NavigationItem`：每个导航项对应一个 WebView 标签。
- `Notification` 关联一个 `channel_id`：用于点击后定位到具体会话。

## 约束

- `server_url` 在安装包中预配置为 `https://lgdg.cc`，用户在引导程序中仅做确认。
- `access_token` 和 `refresh_token` 必须加密存储于系统 keychain/DPAPI。
- `remember_me=true` 时，`refresh_token` 长期有效直到用户手动退出登录。
- 同一时刻仅一个 `WebViewTab.is_active=true`。
- 应用默认单实例运行，`allow_multiple_instances=false`。
