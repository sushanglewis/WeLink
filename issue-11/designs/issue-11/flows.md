# 流程图: issue-11

## 主流程：应用启动与登录

```mermaid
flowchart TD
    A[安装应用] --> B[首次启动]
    B --> C{本地有有效 token?}
    C -->|是| D[进入主界面]
    C -->|否| E[显示 EAIC 品牌引导程序]
    E --> F[确认/输入组织 URL]
    F --> G[输入企业邮箱/密码]
    G --> H{记住我?}
    H -->|是| I[保存 refresh token]
    H -->|否| J[仅保存 session token]
    I --> K[登录成功]
    J --> K
    K --> D
    D --> L[左侧导航切换功能]
    L --> M[聊天 WebView]
    L --> N[通讯录 WebView]
    L --> O[AI 表格 WebView]
    M --> P[收到新消息]
    P --> Q[系统通知 + 托盘红点]
    Q --> R[点击通知/托盘唤出应用]
    R --> S[切换到聊天并定位会话]
```

## 分支流程：登录认证

```mermaid
sequenceDiagram
    autonumber
    participant U as 用户
    participant App as EAIC 桌面应用
    participant Auth as 认证服务
    participant MM as Mattermost 服务端

    U->>App: 启动应用
    App->>App: 读取 AppConfig
    App->>App: 检查本地 token 是否有效
    alt token 有效
        App->>MM: 携带 token 请求 /api/v4/users/me
        MM-->>App: 返回用户信息
        App->>U: 展示主界面
    else token 无效/缺失
        App->>U: 展示 EAIC 品牌引导程序
        U->>App: 确认/输入组织 URL
        U->>App: 输入企业邮箱/密码
        App->>Auth: 提交邮箱/密码认证
        Auth-->>App: 返回 access token + refresh token
        App->>App: 加密保存 token
        alt 记住我（默认勾选）
            App->>App: 保存 refresh token，长期有效
        else 不记住我
            App->>App: 仅保存 session token
        end
        App->>U: 展示主界面
    end
```

## 分支流程：新消息通知与红点统一

```mermaid
sequenceDiagram
    autonumber
    participant MM as Mattermost 服务端
    participant WV as 聊天 WebView
    participant Bridge as Tauri JS Bridge
    participant App as EAIC 桌面应用 Shell
    participant Sidebar as 左侧边栏导航
    participant OS as 操作系统

    MM->>WV: WebSocket 推送新消息
    WV->>Bridge: postMessage('unread-update', {channelId, count})
    Bridge->>App: 调用 native updateUnreadCount
    App->>Sidebar: 更新对应导航项红点/未读数
    App->>App: 更新托盘红点
    alt 需要弹窗
        App->>OS: 发送系统通知（含 channelId）
        OS-->>App: 用户点击通知
        App->>App: 唤出窗口并切换至聊天标签
        App->>WV: postMessage('navigate-to-channel', {channelId})
        WV->>WV: 定位到对应会话/频道
    end
```

## 状态机：应用生命周期

```
未启动 → 启动中 → 引导程序 → 登录中 → 主界面 → 后台运行 → 退出
              ↓
           已登录（本地有有效 token）
              ↓
           主界面
```

## 状态机：登录状态

- `unauthenticated` → `authenticating`（用户提交邮箱/密码）
- `authenticating` → `authenticated`（认证成功，获取 token）
- `authenticated` → `session_expired`（token 过期且刷新失败）
- `session_expired` → `unauthenticated`（跳转回引导程序）

## 状态机：WebView 标签状态

- `loading` → `loaded`（页面加载完成，JS Bridge 就绪）
- `loading` → `error`（加载失败或网络异常）
- `error` → `loading`（用户点击重试）
- `loaded` → `active` / `inactive`（用户切换导航项）
