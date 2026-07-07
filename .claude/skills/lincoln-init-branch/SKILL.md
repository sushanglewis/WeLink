---
name: lincoln-init-branch
description: 从 main 切出 Lincoln feature branch 并初始化过程文档目录
triggers:
  - "初始化 Lincoln 分支"
  - "lincoln-init-branch"
  - "创建 Lincoln feature branch"
inputs:
  - name: session_id
    description: 会话 ID，如 2026-06-27-stakeholder
    required: true
  - name: design_id
    description: 设计 ID，如 checkout-redesign
    required: true
outputs:
  - git branch lincoln/{session_id}-{design_id}
  - 项目根目录下的 recordings/ interviews/ requirements/ designs/ openspec/changes/ docs/research/ handoffs/
  - ".claude/workflow-state.yaml"
required_tools:
  - Bash
  - Read
  - Write
---

# lincoln-init-branch

为新的 Lincoln 需求初始化 feature branch：

1. 从 `main` 切出分支 `lincoln/{session_id}-{design_id}`。
2. 在项目根目录创建 Lincoln 工作所需的标准文档目录（`recordings/`、`interviews/`、`requirements/`、`designs/`、`openspec/changes/`、`docs/research/`、`handoffs/`）。
3. 在 `.claude/workflow-state.yaml` 中写入 `variables.session_id` 和 `variables.design_id`。
4. Commit 并可选地 push 到远程。

如果分支名已包含 session-id 和 design-id，可自动解析参数。
