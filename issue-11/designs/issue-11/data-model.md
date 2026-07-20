# 数据模型：issue-11 企业 IM 桌面应用

## 核心实体

### AppConfig（应用配置）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `server_url` | string | Mattermost 服务端地址 | 必填，安装包预配置，用户不可见 |
| `app_name` | string | 应用显示名称 | 必填，如「WeLink」 |
| `brand_primary_color` | string | 主品牌色 | 可选，HEX 格式 |
| `sso_provider` | enum | SSO 类型 | `email_oidc` / `saml` / `oauth2` |
| `sso_login_url` | string | SSO 登录入口 | 必填，由服务端或配置提供 |
| `enable_auto_start` | boolean | 是否默认开机自启 | 默认 `false` |
| `allow_multiple_instances` | boolean | 是否允许多开 | 默认 `false` |

### UserSession（用户会话）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `user_id` | string | Mattermost 用户 ID | 登录后写入 |
| `access_token` | string | Mattermost access token | 加密存储于 keychain/DPAPI |
| `refresh_token` | string | refresh token | 加密存储 |
| `expires_at` | datetime | 令牌过期时间 | 用于预刷新 |
| `email` | string | 企业邮箱 | 登录后写入 |

### NavigationItem（一级导航项）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | string | 导航项标识 | `contacts` / `chat` / `ai-sheets` |
| `label` | string | 显示名称 | 中文化，如「通讯录」「聊天」「AI 表格」 |
| `position` | enum | 导航位置 | 默认 `sidebar`（左侧边栏） |
| `icon` | string | 图标名称/SVG | 必填 |
| `type` | enum | 内容类型 | `webview` / `native` |
| `url_path` | string | WebView 加载路径 | `type=webview` 时必填 |
| `order` | integer | 排序 | 必填 |

### WebViewTab（WebView 标签/视图）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | string | 标签唯一标识 | 必填 |
| `navigation_id` | string | 所属导航项 | 关联 NavigationItem |
| `url` | string | 当前加载 URL | 必填 |
| `title` | string | 页面标题 | 可同步自 WebView |
| `unread_count` | integer | 未读消息数 | 由 WebView 通过 Bridge 上报 |
| `is_active` | boolean | 是否当前展示 | 同一时刻仅一个为 `true` |

### Notification（系统通知）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | string | 通知唯一标识 | 必填 |
| `title` | string | 通知标题 | 必填 |
| `body` | string | 通知内容 | 必填 |
| `channel_id` | string | 频道/会话 ID | 用于点击跳转 |
| `source` | enum | 通知来源 | `webview` / `native` |
| `sender_name` | string | 发送者名称 | 可选 |
| `created_at` | datetime | 通知时间 | 必填 |

### AppSettings（应用设置）

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `language` | string | 界面语言 | 默认 `zh-CN` |
| `theme` | enum | 主题 | `light` / `dark` / `system` |
| `notification_enabled` | boolean | 是否启用通知 | 默认 `true` |
| `notification_sound` | boolean | 是否播放声音 | 默认 `true` |
| `auto_start` | boolean | 开机自启 | 默认 `false` |
| `minimize_to_tray` | boolean | 关闭时最小化到托盘 | 默认 `true` |

## 状态转换

### 应用生命周期

```
未启动 → 启动中 → 登录页 → 登录中 → 主界面 → 后台运行 → 退出
              ↓
           已登录（本地有有效 token）
              ↓
           主界面
```

### 登录状态

| 状态 | 转换条件 |
|------|----------|
| `unauthenticated` | 初始状态，或 token 过期/无效 |
| `authenticating` | 用户点击登录，跳转 SSO |
| `authenticated` | SSO 回调成功，获取 token |
| `session_expired` | token 过期且刷新失败 |

### WebView 标签状态

| 状态 | 转换条件 |
|------|----------|
| `loading` | 切换导航项，开始加载 URL |
| `loaded` | 页面加载完成，JS Bridge 就绪 |
| `error` | 加载失败或网络异常 |
| `active` / `inactive` | 用户切换导航项 |
