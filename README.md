# Lincoln — 产品经理需求调研工作流模板

这是一个 **GitHub Template Repository**，用于快速初始化一个基于 **Conductor + Claude Code + OpenSpec + GitHub + Obsidian** 的产品经理需求调研与研发协作工作区。

每个从该模板创建的项目都拥有：
- 独立的文件空间
- 独立的 Obsidian Wiki Vault（项目知识库）
- 标准的访谈 → 需求 → 产品设计 → Pencil 原型 → TDD 研发计划 → OpenSpec → GitHub Issues → 知识库沉淀 工作流
- Claude Code skill 包约束 Agent 按规范执行

## 新增能力（v1.1.0）

- **技能依赖清单**：`.claude/skills/dependencies.yaml` 显式声明 `superpowers`、`gsd`、`openspec` 等外部依赖，配合 `scripts/check-skill-dependencies.sh` 一键检查。
- **工作流路由**：新增 `lincoln-workflow-router`，根据仓库上下文选择最合适的工作流模板，不再只有单一固定流程。
- **多模板支持**：除默认 `interview-to-knowledge` 外，新增 `existing-project-iteration`、`bug-fix`、`design-spike`、`oss-first-design` 模板。
- **自定义 Lincoln 技能**：
  - `lincoln-build-codebase-knowledge`：扫描已有代码库，生成 `docs/knowledge/` 功能文档。
  - `lincoln-explore-opensource`：在设计阶段调研可借鉴的开源方案，输出 `docs/research/{change_name}-oss-options.md`。
- **更密集的技能调用**：各阶段已绑定 `superpowers:brainstorming`、`superpowers:writing-plans`、`superpowers:test-driven-development`、`superpowers:verification-before-completion`、`gsd-import`、`gsd-docs-update` 等方法论子技能。

## 工作状态与交接

每个 Lincoln 分支都有实时状态报告和交接机制，确保跨窗口、跨人机协作不丢上下文。

### 查看当前分支状态

```bash
python scripts/lincoln-status.py --format table
```

输出包含：当前阶段、等待对象、已加载上下文、推荐技能、产物状态、下一步动作。支持 `--format json|table|markdown`。

### 生成交接文档

当需要暂停工作或切换协作者时：

```bash
python scripts/stage_loader.py --stage <current-stage> --action handoff-report
```

生成 `.context/lincoln-handoff-<stage>.md`，包含当前阶段、已确认产物、待解决问题、下一角色、推荐技能。

阶段通过人类 PM 确认后，运行：

```bash
python scripts/stage_loader.py --stage <current-stage> --action approve-gate
```

标记该阶段 gate 已审批通过。

### 查看所有进行中的 Lincoln 分支

```bash
scripts/list-active-lincoln-branches.sh
# 仅查看等待我的分支
scripts/list-active-lincoln-branches.sh --waiting-for-me
```

### 审计工作流健康度

```bash
python scripts/lincoln-audit.py --format markdown
```

输出 PASS/WARN/FAIL 报告，覆盖状态一致性、产物完整性、门控合规性、技能覆盖、异常检测。

## 框架文档

Lincoln 框架的核心设计文档：

- `.claude/stages/stage-manifest.yaml` — 阶段注册表与门控要求。
- `.claude/skills/routing.yaml` — 完整技能路由表：按阶段、项目类型、场景映射外部技能仓库能力。
- `.claude/agents/default.md` — Agent 行为总则。
- `.claude/schemas/` — JSON Schema 校验定义。

## 快速开始

### 1. 从模板创建项目

在 GitHub 上点击 **Use this template**，创建新项目仓库，然后 clone 到本地 Conductor 工作区。

### 2. 配置 GitHub 目标仓库

编辑 `.github/openspec-config.yml`：

```yaml
repository:
  owner: your-org
  name: your-product-repo
  default_branch: main
```

将 `owner` 和 `name` 改成真实目标仓库。初始化脚本会拒绝默认占位值。

### 3. 初始化项目

进入项目目录后运行：

```bash
scripts/init-project.sh
```

脚本会：
- 校验依赖（ffmpeg、whisper、gh、openspec CLI）
- 创建 Obsidian vault 基础结构
- 读取 `.github/openspec-config.yml` 中的目标仓库配置
- 在干净模板初始化时提交脚本创建的占位文件

### 4. 运行工作流

#### Step 1: 放入访谈录音

将音频文件放入 `recordings/`：

```bash
cp ~/Downloads/2026-06-27-stakeholder.m4a recordings/
```

#### Step 2: 录制访谈（Lincoln Recording TUI）

如果你还没有录音文件，可以直接用 Lincoln 终端录音工具录制：

```bash
# 全局安装 lincoln（每个工作区只需一次）
cd tools/lincoln
npm install
npm run build
npm link

# 在项目根目录运行
lincoln 2026-06-27-stakeholder \
  --topic "结算流程 redesign 需求访谈" \
  --design-id checkout-redesign \
  --branch lincoln/2026-06-27-stakeholder-checkout-redesign
```

启动后：
- ↑/↓ 选择菜单项，Enter 确认
- 选择「开始录音」进入录音界面
- 录音中再次按 Enter 停止
- 停止后 TUI 会提示运行 `claude process-interview <sessionId>`
- 随时按 q / Esc / Ctrl+C 退出

也可以把常用配置写入项目级 `.lincolnrc`，之后直接运行 `lincoln <session-id>`：

```yaml
topic: "结算流程 redesign 需求访谈"
design-id: checkout-redesign
branch: lincoln/2026-06-27-stakeholder-checkout-redesign
```

详见 [tools/lincoln/README.md](tools/lincoln/README.md)。

#### Step 3: 触发访谈处理

```bash
claude process-interview recordings/2026-06-27-stakeholder.m4a
```

Agent 会生成：
- `interviews/2026-06-27-stakeholder/metadata.json`
- `interviews/2026-06-27-stakeholder/transcript.md`
- `interviews/2026-06-27-stakeholder/summary.md`
- `interviews/2026-06-27-stakeholder/raw-insights.md`

#### Step 4: 需求澄清

```bash
claude clarify-requirements 2026-06-27-stakeholder
```

Agent 会基于访谈内容提问，与你多轮澄清后生成：
- `requirements/2026-06-27-stakeholder/requirements.md`
- `requirements/2026-06-27-stakeholder/user-stories.md`
- `requirements/2026-06-27-stakeholder/prd.md`

#### Step 5: 产品设计文档评审

```bash
claude draft-product-design <session-id> <design-id>
```

Agent 会生成 `designs/<design-id>/` 下的设计评审包：
- `design-review.md`
- `scenarios.md`
- `feature-catalog.md`
- `data-model.md`
- `flows.md`
- `feasibility.md`

人类 PM 确认设计文档后，Agent 会在 `design-review.md` 写入确认标记。

#### Step 6: Pencil 产品原型

```bash
claude build-product-prototype <session-id> <design-id>
```

Agent 会生成：
- `designs/<design-id>/fields.md`
- `designs/<design-id>/ui-spec.md`
- `designs/<design-id>/prototype.pen`

人类 PM 直接用 Pencil 应用打开、修改并保存 `.pen` 文件。确认后，保存后的 `.pen` 是最终开发参照。

#### Step 7: TDD 研发计划

```bash
claude plan-tdd-development <session-id> <design-id>
```

Agent 会生成 `designs/<design-id>/tdd-plan.md`，作为 OpenSpec 和 GitHub Issues 拆分的输入。

#### Step 8: OpenSpec 提案

```bash
claude propose-with-openspec <session-id> <design-id> <change-name>
```

Agent 基于 `designs/<design-id>/tdd-plan.md` 调用 `openspec propose` 生成：
- `openspec/changes/<change-name>/proposal.md`
- `openspec/changes/<change-name>/specs/`
- `openspec/changes/<change-name>/design.md`
- `openspec/changes/<change-name>/tasks.md`

#### Step 9: 拆分到 GitHub

```bash
claude split-to-github <session-id> <change-name>
```

Agent 将 OpenSpec tasks 拆分为 GitHub Issues。

#### Step 10: 研发实现

研发团队基于 GitHub Issues 开发，提交 PR。

#### Step 11: 同步到知识库

PR 合并后，GitHub Action 会提交 `.github/lincoln-sync-queue/pr-<pr-number>.yaml` 待同步队列文件。本地 Agent 后续执行：

```bash
claude sync-to-knowledge <issue-number> <pr-number>
```

Agent 更新 Obsidian vault：
- `docs/knowledge/01-interviews/2026-06-27-stakeholder.md`
- `docs/knowledge/02-requirements/REQ-xxx.md`
- `docs/knowledge/03-features/<feature-slug>.md`
- `docs/knowledge/04-decisions/<decision-id>.md`

## 分支级工作流与阶段状态

每个需求使用独立的 Lincoln feature 分支，阶段状态随分支提交：

```bash
# 创建新需求分支（从 main 切出）
scripts/init-lincoln-branch.sh <session-id> <design-id> --push

# 查看所有进行中的 Lincoln 分支
scripts/list-active-lincoln-branches.sh
```

分支命名：`lincoln/<session-id>-<design-id>`，例如 `lincoln/2026-06-27-stakeholder-checkout-redesign`。

阶段状态保存在 `.claude/workflow-state.yaml`，关键规则：
- 状态文件是**分支级**的，不同 feature 分支互不干扰；
- PM 在本地推进阶段后，**push feature 分支**到远程，不合并 `main`；
- 下游角色（测试、研发）checkout 同一 feature 分支继续；
- 每个阶段都有 `.claude/stages/<stage-id>/` 下的专属上下文（AGENTS.md、CHECKLIST.md、SKILLS.md、PROMPT.md）。

Agent 启动时会通过 hook 加载当前阶段上下文；若 hook 未启用，Agent 必须手动调用 `scripts/stage_loader.py` 执行准入/准出校验。

## 工作流概览

```
访谈录音 → 转写摘要 → 需求澄清 → 产品设计 → Pencil 原型 → TDD 研发计划 → OpenSpec 提案 → GitHub Issues → 代码实现 → PR 合并 → Obsidian 知识库
```

## 技能生态与工作流模板

Lincoln 默认走 `interview-to-knowledge` 模板，但根据项目上下文也可切换到其他模板：

| 上下文 | 推荐模板 |
|--------|----------|
| 有访谈录音 | `interview-to-knowledge` |
| 已有源码但知识库为空 | `existing-project-iteration` |
| 明确 bug/issue | `bug-fix` |
| 仅方案预研 | `design-spike` |
| 强依赖开源方案 | `oss-first-design` |

Agent 通过 `lincoln-workflow-router` 评估上下文并推荐模板，经 PM 确认后写入 `.claude/workflow-state.yaml`。

外部技能依赖声明在 `.claude/skills/dependencies.yaml`，运行 `scripts/check-skill-dependencies.sh` 可检查是否已安装：

```bash
scripts/check-skill-dependencies.sh
```

各阶段可调用的方法论子技能包括：

- `superpowers:brainstorming` — 需求/设计/UI 探索
- `superpowers:writing-plans` — 文档与计划结构化
- `superpowers:test-driven-development` — TDD 红/绿/重构约束
- `superpowers:verification-before-completion` — 产物完成前验证
- `superpowers:dispatching-parallel-agents` — 并行处理独立 Issue
- `superpowers:using-git-worktrees` — 隔离工作区
- `gsd-import` — 外部计划导入与冲突检测
- `gsd-docs-update` / `gsd-forensics` — 知识库生成与失败诊断

## 目录结构

```
.
├── recordings/              # 原始音频（gitignored）
├── interviews/              # 转写和摘要产物
├── requirements/            # 需求文档
├── designs/                 # 产品设计文档、Pencil 原型和 TDD 研发计划
├── openspec/                # OpenSpec 变更目录
├── docs/knowledge/          # 项目独立 Obsidian vault
├── docs/research/           # 开源方案调研等研究文档
├── .claude/                 # Claude Code skill、agent、hooks、schema、工作流
│   ├── agents/              # 智能体模板（default/pm/designer/engineer + external）
│   ├── hooks/               # 生命周期 hooks（由 .claude/settings.json 自动挂接）
│   ├── schemas/             # JSON Schema 校验
│   ├── skills/              # 原生 skills（含 routing.yaml、dependencies.yaml）
│   ├── stages/              # 阶段上下文（AGENTS.md / CHECKLIST.md / SKILLS.md / PROMPT.md）
│   ├── templates/           # feature branch 初始化模板
│   ├── workflows/           # 标准研发工作流模板
│   ├── AGENTS.md            # 项目级 Agent 行为总则
│   ├── settings.json        # Claude Code 项目级设置（hooks 映射）
│   └── workflow-state.yaml  # 分支级运行时状态（feature branch 独有）
├── .context/                # 交接文档（lincoln-handoff-<stage>.md）
├── .github/                 # GitHub issue 模板、Actions、配置
└── scripts/                 # 初始化脚本、状态命令、审计工具
```

## 依赖

- `ffmpeg`
- `faster-whisper` 或 OpenAI Whisper API key
- `gh` CLI（已登录）
- `openspec` CLI：`npm install -g @fission-ai/openspec`
- Pencil 应用或 Pencil MCP（用于 `.pen` 原型）
- `ecc` CLI（来自 everything-claude-code）
- Obsidian（可选，用于可视化浏览 vault）

此外，Lincoln 依赖若干外部 skill/CLI，清单见 `.claude/skills/dependencies.yaml`。初始化或升级后请运行：

```bash
scripts/check-skill-dependencies.sh
```

## 规范约束

Agent 必须遵守：
- `.claude/agents/default.md` — Agent 行为总则
- `.claude/AGENTS.md` — 项目级 Agent 行为总则
- `.claude/workflows/interview-to-knowledge.yaml` — 工作流定义
- `.claude/stages/stage-manifest.yaml` — 阶段注册表与门控要求
- `scripts/validate_stage.py` — 准入准出校验 runner

人类产品经理拥有以下节点的最终确认权：
- 需求澄清完成
- 产品设计文档确认
- Pencil 原型确认
- OpenSpec 提案确认
- GitHub Issues 拆分确认
- 研发实现完成

## 了解更多

- [OpenSpec 文档](https://github.com/Fission-AI/openspec)
- [Obsidian WikiLinks](https://help.obsidian.md/Linking+notes+and+files/Internal+links)
