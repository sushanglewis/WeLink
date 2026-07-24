# PM → UX Handoff: issue-11 EAIC 企业 IM 桌面应用

**Version:** v1.1  
**Date:** 2026-07-24  
**From:** PM / Product Design Agent  
**To:** UX Designer / Product Prototype Agent  
**Status:** Ready for UX prototyping

---

## 1. 产品一句话

为现有 Mattermost B/S 二开系统打造企业自有品牌的 Windows/macOS 桌面应用 **EAIC**，将一级功能目录提升为原生 C/S 导航，功能页初期通过 WebView 嵌入现有 B/S 页面，并完全隐藏 Mattermost 品牌痕迹。

## 2. 设计目标

1. 为企业内部员工提供独立的 PC 端 IM 应用入口，降低使用门槛。
2. 通过原生一级导航 + WebView 嵌入现有 B/S 页面，平衡体验与开发成本。
3. 完全隐藏 Mattermost 品牌，呈现 EAIC 企业自有形象。
4. 个人/系统设置适配中国用户习惯。
5. 支持桌面原生体验：通知、托盘、开机自启、记住我自动登录。

## 3. 范围边界

**范围内：**
- Windows 10+ / macOS 12+ 桌面应用（x64 + Apple Silicon）。
- 安装包预配置组织地址 `lgdg.cc`。
- 应用级统一登录：已同步的企业邮箱/密码 + 「记住我」。
- 原生一级导航：通讯录、聊天、AI 表格（顺序固定，默认聊天）。
- WebView 嵌入现有 B/S 页面。
- 系统通知、托盘图标、开机自启动。
- 品牌替换与设置适配。

**不在范围内（后续迭代）：**
- 移动端应用。
- 离线消息推送补发。
- 语音/视频通话原生能力。
- 第三方 OAuth/SSO 登录集成。
- 一次性完整 IM 协议 C/S 化。

## 4. 关键决策

| 决策 | 选项 | 理由 |
|------|------|------|
| 架构 | 混合 C/S + B/S | 原生导航 + WebView 嵌入，平衡体验与成本 |
| 登录方式 | 已同步企业邮箱/密码 | 用户无需注册，复用企业身份体系 |
| 导航形式 | 左侧边栏 | 对标飞书/钉钉，符合国内用户习惯 |
| 通知点击 | 唤出窗口 + 切换聊天 + 定位会话 | 提升消息响应效率 |
| 品牌策略 | 完全替换 Mattermost 品牌 | 强化企业自有 IM 认知 |
| 设置形式 | 弹窗 + 左右分栏 | 符合桌面应用设置习惯 |

## 5. UX 设计必读文档

请按以下顺序阅读：

1. **PRD**（单一事实来源，含第 6 章逐页字段与交互详细规格）：`issue-11/prd.md`
2. **交互原型（参考）**：`issue-11/designs/html-mockups/index.html`
3. **页面地图**（信息架构与页面流转）：`issue-11/designs/page-map.md`
4. **场景分析**：`issue-11/designs/scenarios.md`
5. **功能目录**：`issue-11/designs/feature-catalog.md`
6. **流程图**：`issue-11/designs/flows.md`
7. **数据模型**：`issue-11/designs/data-model.md`
8. **可行性分析**：`issue-11/designs/feasibility.md`
9. **设计评审**：`issue-11/designs/design-review.md`
10. **用户故事**：`issue-11/requirements/user-stories.md`
11. **需求澄清文档**：`issue-11/requirements/requirements.md`

## 6. 对 UX 设计师的核心要求

### 6.1 品牌

- 所有用户可见位置不得出现 Mattermost 字样、图标或外链。
- 应用名称固定为 **EAIC**。
- 企业提供品牌色/图标/Logo 时直接使用；未提供时采用 Data UI Design 默认规范（主色 `#00AE68`、背景 `#F7F8FA`、字体 PingFang SC）。

### 6.2 布局

- 默认窗口尺寸：1280 × 800；最小 1024 × 640。
- 左侧边栏：展开 240px，折叠 72px。
- 左侧导航与 WebView 内容区之间需 1px 可见分割线。
- 完全自定义标题栏（含企业品牌标题和窗口控制按钮）。

### 6.3 导航

- 一级导航顺序固定：聊天 → 通讯录 → AI 表格。
- 默认选中「聊天」。
- 支持折叠为仅图标模式。

### 6.4 登录

- 启动后若本地无有效 token，进入 EAIC 品牌引导程序。
- 组织地址 `lgdg.cc` 已预配置，用户仅做确认。
- 输入已同步的企业邮箱/密码登录。
- 「记住我」默认勾选。
- 无 SSO/OAuth 入口。

### 6.5 通知

- 触发条件：应用在线、未处于前台聚焦、用户已开启桌面通知、收到新消息。
- 通知标题：发送者名称 + 应用名（如「李四 - EAIC」）。
- 通知内容：默认展示消息内容预览；用户可在个人设置中关闭预览。
- 通知图标：企业应用图标优先，未提供时使用 EAIC 默认图标。
- 点击通知：唤出窗口 → 切换到聊天导航 → 定位到对应会话。
- 托盘「标记为已读」遵循 Mattermost 原生实现。

### 6.6 设置

- 入口：点击侧边栏底部头像 → 弹出菜单 → 选择「个人设置」/「系统设置」。
- 弹窗形式，内部左右分栏。
- **个人设置**：头像、通知、主题、语言、密码；账号（企业邮箱）与姓名（用户名/全名）只读。个人设置统一收敛到 C/S 弹窗实现，与 Mattermost 原生用户设置保持同步。
- **系统设置**：开机自启、最小化到托盘、下载路径、缓存清理（若 Mattermost 原生支持则沿用，否则本次 MVP 不加）。
- 语言设置位于个人设置（Display），与 Mattermost Web 端一致。

### 6.7 平台差异

- `Ctrl/Cmd + W`：关闭窗口（Windows/Linux 最小化到托盘；macOS 关闭窗口，不退出应用）。
- `Ctrl/Cmd + Q`：退出应用（macOS 标准；Windows/Linux 等价于托盘菜单「退出」）。
- `Ctrl/Cmd + 1/2/3`：切换导航项（1=聊天，2=通讯录，3=AI 表格）。

## 7. 验收标准摘要

- 安装包预配置组织地址，启动后无地址输入入口。
- 企业邮箱/密码登录流程可用，「记住我」默认勾选。
- 原生一级导航展示并支持切换。
- 聊天 WebView 正常加载 B/S 页面。
- 系统通知/托盘红点同步，点击通知定位会话。
- 托盘常驻并可唤出应用。
- 无 Mattermost 品牌暴露。
- 设置页面符合中国用户习惯。

## 8. 待后续提供（非 UX 阻塞项）

- 企业 VI / 设计规范 / 品牌色 / 图标 / Logo 源文件。
- Mattermost 当前设置项的具体字段清单（用于与推荐清单对齐）。

## 9. 下一步

UX 设计师基于本 handoff 与上述文档产出：

- `issue-11/designs/ui-spec.md`
- `issue-11/designs/fields.md`
- `issue-11/designs/prototype.pen`（可选）
