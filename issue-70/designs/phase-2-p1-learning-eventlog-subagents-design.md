# Phase 2 / P1 设计方案：摩擦学习 + EventLog + 子代理委托

<!-- status: pending_review -->

## 1. 背景与目标

- 研究基线：PR #18 / `lew-70-research-baseline` 分支
- 研究笔记：`issue-70/docs/research/openhands-teamai-research-oss-options.md`
- Phase 1 实现：PR #22（已合并）
- 跟踪 Issue：#70
- PM 决策（延续）：
  - Lincoln 是 Claude Code / Codex / OpenCode 的 harness 插件，**不自研执行器**。
  - 所有设计必须能在三种 harness 上生效或优雅降级。
  - 人类门控不可跳过；高危/不可逆操作仍需 PM 显式确认。

## 2. 范围

本 Phase 只处理 P1 项，按优先级排序：

1. **Friction-Based Learning + Recall Precheck**
   - 在 `on-stop.sh` 中根据摩擦信号打分，高摩擦会话提示贡献者沉淀经验。
   - 知识库召回前做相关性预检查，避免每次会话加载全量知识。

2. **EventLog + Condenser**
   - 扩展 `workflow-stage.yaml` 的事件模型，记录关键 stage/工具/门控事件。
   - 长会话或事件过多时生成摘要（Condensation），回写到 handoff 或状态文件。

3. **Sub-Agent 委托**
   - 在复杂 stage（如 design-review、security-review）中并行调用 specialist agent。
   - 复用 Claude Code / Codex / OpenCode 的 agent 机制，不自建执行器。

4. **MR 知识挖掘**（可选纳入，工作量低）
   - 扩展 `.github/workflows/knowledge-sync.yml`，解析 PR review 评论与代码变更。
   - 自动沉淀决策依据到 `knowledge/`。

5. **Skill Marketplace + git 缓存**（本 phase 暂缓或轻量设计）
   - 分析改进 `scripts/lincoln-setup.py` 的 skill 同步与版本锁定机制。
   - 若与 P0/P1 其他项冲突，可作为独立后续任务保留。

## 3. 现状分析

### 3.1 当前 Hook 与事件能力

- `.claude/hooks/on-stop.sh`：会话结束时更新 `last_updated_at`。
- `.claude/hooks/post-tool-use.sh`：已写入 `.trace/lc-trace.jsonl`（工具调用、退出码、目标、stage）。
- `.claude/hooks/pre-tool-use.sh`：已集成 SecurityAnalyzer（PR #22）。
- `issue-70/workflow-stage.yaml` 的 `nodes[]`：追加式 stage 级别记录，但缺少 LLM/工具/门控级事件。

### 3.2 当前知识库与召回

- `knowledge/`：业务/技术双轨组织。
- `.github/workflows/knowledge-sync.yml`：PR 合并后根据 PR 描述写入知识库。
- **缺少**：会话结束时的经验捕获、召回前的相关性预检查。

### 3.3 当前 Agent 协作

- `.claude/agents/*.md`：定义 pm/designer/engineer/qa/researcher 等角色。
- **缺少**：在单个 stage 内并行调用多个 specialist agent 的机制与结果合并策略。

## 4. 设计详情

### 4.1 Friction-Based Learning + Recall Precheck

#### 4.1.1 架构原则

- **不新增 LLM 调用**：friction scoring 完全基于已有 hook 信号（退出码、重试、人工纠正）。
- **可配置阈值**：通过 `.claude/config/friction-policy.yaml` 定义信号权重与阈值。
- **人类最终确认**：高摩擦会话仅生成提示，由贡献者决定是否写入 `knowledge/`。
- **Recall precheck 轻量**：用关键词/向量相似度判断当前任务与知识库条目的相关性，无关时跳过召回。

#### 4.1.2 Friction 信号定义

| 信号 | 来源 | 权重 | 说明 |
|------|------|------|------|
| tool_failed | post-tool-use exit_code != 0 | +2 | 工具执行失败 |
| tool_rejected | pre-tool-use 返回 BLOCKED | +3 | 被安全/门控拦截 |
| retry_spike | 同一 stage 内同一工具连续失败 >=3 | +3 | 反复重试 |
| human_override | 人类 PM 明确纠正或回退 | +5 | 强摩擦信号 |
| long_session | 单个 node 持续时间 > 阈值 | +1 | 上下文压力 |

```yaml
# .claude/config/friction-policy.yaml
schema_version: 1.0.0
thresholds:
  prompt_user: 5
  auto_suggest: 3
weights:
  tool_failed: 2
  tool_rejected: 3
  retry_spike: 3
  human_override: 5
  long_session: 1
long_session_minutes: 30
retry_count_threshold: 3
```

#### 4.1.3 on-stop.sh 集成

在 `on-stop.sh` 末尾：

1. 读取当前 node 的 trace 文件（`.trace/lc-trace.jsonl`）。
2. 统计失败次数、被拦截次数、重试次数、会话时长。
3. 计算 friction score。
4. 若 score >= `prompt_user`，写入 `issue-<N>/.trace/friction-prompt.md` 并在 stderr 提示用户。
5. 若 score >= `auto_suggest` 但 < `prompt_user`，仅写入 `issue-<N>/.trace/friction-suggestion.md`，不打扰用户。

提示模板包含：
- 检测到的摩擦信号列表。
- 建议沉淀到 `knowledge/` 的路径（如 `knowledge/05-learnings/`）。
- 一键命令：`python3 scripts/lincoln-knowledge.py suggest ...`（可选）。

#### 4.1.4 Recall Precheck

新增 `scripts/lincoln_recall.py`：

- **输入**：当前 task 描述（从 workflow-stage.yaml 的 current_stage + 用户最近消息推断）。
- **处理**：
  1. 提取关键词（简单分词 + 项目术语表）。
  2. 对 `knowledge/` 中的每条文档计算关键词重叠或轻量向量相似度。
  3. 返回 Top-K 相关文档路径与分数。
- **输出**：JSON 或 Markdown 摘要。
- **集成点**：
  - `on-session-start.sh` 在注入 context 前调用，仅注入相关条目。
  - `lc-build-codebase-knowledge` 在扫描前调用，避免全量扫描。

**降级策略**：若未安装可选依赖（如 sentence-transformers），回退到关键词匹配，不阻塞会话。

### 4.2 EventLog + Condenser

#### 4.2.1 架构原则

- **补充而非替代**：EventLog 是 `nodes[]` 的细粒度补充，不替代现有 stage 状态机。
- **双路径持久化**：参考 OpenHands，事件追加到 JSON Lines 文件；base state 仍由 `workflow-stage.yaml` 承载。
- **Condenser 可选**：仅当事件数量超过阈值时触发摘要。

#### 4.2.2 事件模型

新增 `issue-<N>/.trace/lc-eventlog.jsonl`，每行一个事件：

```json
{
  "event_id": "evt-20260829-001",
  "timestamp": "2026-08-29T12:00:00Z",
  "type": "tool_invoked",
  "stage_id": "phase-2-p1-design",
  "node_id": "phase-2-p1-design-20260829",
  "run_id": "...",
  "payload": {
    "tool": "Bash",
    "target": "scripts/stage_loader.py",
    "exit_code": 0
  }
}
```

事件类型：
- `stage_started` / `stage_completed`
- `gate_approved` / `gate_rejected`
- `tool_invoked`
- `human_message` / `agent_message`（可选，由 harness 提供时记录）
- `condensation`（摘要事件，替换被摘要的旧事件引用）

#### 4.2.3 写入点

- `post-tool-use.sh`：写入 `tool_invoked`。
- `pre-tool-use.sh`：被拦截时写入 `tool_blocked`。
- `stage_loader.py`：写入 `stage_started` / `stage_completed` / `gate_*`。
- `on-stop.sh`：写入 `session_stopped`。

#### 4.2.4 Condenser

新增 `scripts/lincoln_condenser.py`：

- 当 `lc-eventlog.jsonl` 行数超过 `threshold`（默认 200）或 handoff 生成时触发。
- 读取事件，按 stage 分组，生成摘要（初期可用规则摘要；未来可接入 LLM）。
- 将摘要作为 `condensation` 事件追加，并在 handoff 文档中引用。
- 不删除原始事件，保留可追溯性。

### 4.3 Sub-Agent 委托

#### 4.3.1 架构原则

- **复用 harness agent 机制**：Claude Code 的 `/agent`、Codex 的 agent prompt、OpenCode 的 agent 目录。
- **并行调用**：一个 stage 可同时触发多个 specialist agent，结果汇总后返回主 agent。
- **结果合并**：采用结构化输出（schema），主 agent 按优先级合并。

#### 4.3.2 使用场景

| Stage | Specialist Agents | 输出 |
|-------|-------------------|------|
| design-review | architect, security-reviewer, pm | 评审意见列表 |
| security-review | security-reviewer, python-reviewer | 风险报告 |
| explore-opensource | researcher, engineer | 候选方案评分表 |

#### 4.3.3 实现方式

新增 `.claude/config/agent-delegation.yaml`：

```yaml
schema_version: 1.0.0
delegations:
  design-review:
    agents:
      - lc-architect
      - lc-security-reviewer
      - lc-pm
    merge_strategy: priority  # 或 vote / consensus
    output_schema: .claude/schemas/design-review-feedback.json
```

由于 Lincoln 不自建执行器，实际调用由 harness 完成：
- Claude Code：通过 agent prompt 提示主 agent 调用 `/agent <name>`。
- Codex：生成 `AGENTS.md` 时附带 delegation 说明。
- OpenCode：在 `.opencode/agent/` 中生成 specialist agent，由主 agent 引用。

第一阶段先提供规范与示例，第二阶段再视 harness 支持情况增加自动化。

### 4.4 MR 知识挖掘

#### 4.4.1 架构原则

- **扩展现有 knowledge-sync**：不新建工作流。
- **安全优先**：不记录代码中的潜在 secret；仅提取决策性评论与变更摘要。

#### 4.4.2 扩展点

修改 `.github/workflows/knowledge-sync.yml`：

1. 在 PR 合并后，除了 PR 描述，还读取 review 评论（通过 GitHub API）。
2. 提取包含 "decision"、"agreed"、"rejected"、"note:" 等关键词的评论。
3. 写入 `knowledge/04-decisions/lew-70-<pr>-<decision>.md`。
4. 关联回 issue-70 研究笔记。

新增 `scripts/lincoln_mr_mine.py`：

- 输入：PR number、repo。
- 输出：Markdown 决策摘要。
- 可由 workflow 调用，也可本地手动运行。

## 5. 边界与不做什么

- **不自研 LLM 执行器**：Action-Observation 循环、Workspace Factory 仅作参考。
- **不构建重型代码图**：P2 的 AST + Heuristic 代码图不在本 phase。
- **不实现实时 Dashboard**：Session Analytics 仅扩展现有 benchmark 输出，不做 Web UI。
- **不替换现有 `nodes[]`**：EventLog 是补充，保持向后兼容。

## 6. 实现顺序与验收标准

| 顺序 | 项 | 验收标准 |
|------|-----|---------|
| 1 | Friction policy + on-stop scoring | `on-stop.sh` 生成 friction 提示文件；测试覆盖 5 种信号 |
| 2 | Recall precheck | `scripts/lincoln_recall.py` 返回 Top-K 相关文档；关键词降级可用 |
| 3 | EventLog writer | `lc-eventlog.jsonl` 包含 tool/stage/gate 事件；可回放 |
| 4 | Condenser | 事件超阈值时生成摘要；handoff 引用摘要 |
| 5 | Agent delegation spec | `.claude/config/agent-delegation.yaml` + harness 示例 |
| 6 | MR knowledge mining | workflow 扩展解析 review 评论；生成决策摘要 |

## 7. 测试计划

- 单元测试：`tests/test_friction_scorer.py`、`tests/test_eventlog.py`、`tests/test_recall.py`、`tests/test_condenser.py`、`tests/test_agent_delegation.py`、`tests/test_mr_mining.py`。
- 集成测试：`on-stop.sh` 在摩擦会话后生成提示；`post-tool-use.sh` 写入 EventLog。
- 静态检查：所有新增脚本通过 `static-check.sh`。
- 覆盖率：>= 80%。

## 8. 风险与待澄清问题

1. **Recall precheck 是否允许调用 embedding 模型？** 若不允许，仅保留关键词匹配。
2. **EventLog 是否包含用户消息内容？** 建议默认不包含，仅记录元数据，避免隐私风险。
3. **Sub-agent 委托在 Codex/OpenCode 上的实际支持程度？** 需要在这些 harness 上验证 agent 调用语法。

---

**等待 PM 审批。** 审批后进入 Phase 2 / P1 实现。
