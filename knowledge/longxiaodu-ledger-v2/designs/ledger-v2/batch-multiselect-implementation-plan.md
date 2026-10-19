# Batch Multi-select Unified Ledger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the separate batch/flat modes and export-selection modal with one multi-batch ledger scope whose selected batches determine both visible cards and the exact export set.

**Architecture:** Keep the existing single-file interactive prototype and Lincoln 1.9.1 portal. Extend the prototype state from one `batchId` plus `view` to a `selectedBatchIds` collection, render one multi-select popover in the existing batch row, derive the horizontal card collection and export eligibility from that collection, and keep the modal only for final export confirmation. Product documents remain business-only.

**Tech Stack:** Static HTML/CSS/JavaScript, Python pytest contract tests, Playwright browser tests, Lincoln 1.9.1 issue-package portal.

## Global Constraints

- Preserve the existing EAIC information hierarchy and approved A「原位增补」direction.
- Remove the flat-mode switch and all flat-mode preference behavior.
- Default-select every unarchived batch and no archived batch.
- Total item counts include withdrawn items; withdrawn counts are shown separately and withdrawn records are excluded from export and archive actions.
- The export set always equals the selected batch set; if any selected batch is ineligible or archived, export is prohibited.
- Keep cards in one horizontal row and sort by `逾期未填报 > 跟进中 > 已填报 > 已审核 > 已归档 > 已撤回`, then deadline, batch sequence, and item code.
- Do not add technical solution content to product documents.
- Do not transition beyond the `product-prototype` human gate.

---

### Task 1: Lock the revised business contract in tests and documents

**Files:**
- Modify: `ledger-v2/tests/test_final_prototype.py`
- Modify: `ledger-v2/requirements/2026-10-14-ledger-v2/prd.md`
- Modify: `ledger-v2/requirements/2026-10-14-ledger-v2/requirements.md`
- Modify: `ledger-v2/requirements/2026-10-14-ledger-v2/user-stories.md`
- Modify: `ledger-v2/designs/ledger-v2/design-review.md`
- Modify: `ledger-v2/designs/ledger-v2/feature-catalog.md`
- Modify: `ledger-v2/designs/ledger-v2/scenarios.md`
- Modify: `ledger-v2/designs/ledger-v2/flows.md`
- Modify: `ledger-v2/designs/ledger-v2/data-model.md`
- Modify: `ledger-v2/designs/ledger-v2/feasibility.md`
- Modify: `ledger-v2/designs/ledger-v2/ui-spec.md`
- Modify: `ledger-v2/designs/ledger-v2/fields.md`
- Modify: `ledger-v2/pages/docs/prd.html`
- Modify: `ledger-v2/pages/docs/state-and-flow.html`

**Interfaces:**
- Consumes: approved rules in `batch-multiselect-interaction.md`.
- Produces: one consistent business contract used by the prototype and browser tests.

- [ ] **Step 1: Write failing static contract assertions**

Add assertions requiring `batchMultiSelect`, `全选未归档`, `仅选可导出`, `共`, `已撤回`, and the absence of `data-view="flat"`, `平铺模式`, and export batch checkboxes.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pytest -q ledger-v2/tests/test_final_prototype.py -vv --tb=short`

Expected: failures because the current prototype and documents still define flat mode and modal-based batch selection.

- [ ] **Step 3: Update the business documents**

Replace flat-mode and export-modal selection rules with the approved unified multi-select rules. State explicitly that total counts include withdrawn records, archived batches are manual-view-only, any ineligible selected batch blocks the whole export, and successful export reselects remaining unarchived batches.

- [ ] **Step 4: Re-run the focused test**

Run: `pytest -q ledger-v2/tests/test_final_prototype.py -vv --tb=short`

Expected: document assertions pass; prototype assertions remain RED until Task 2.

### Task 2: Build the multi-batch selector and unified card collection

**Files:**
- Modify: `ledger-v2/pages/prototype/01-supervisor.html`
- Test: `ledger-v2/tests/test_final_prototype.py`
- Test: `ledger-v2/tests/test_final_prototype_browser.py`

**Interfaces:**
- Produces: `state.selectedBatchIds`, `selectedBatches()`, `visibleItems()`, `renderBatchMultiSelect()`, and stable controls `#batchMultiSelect`, `#batchMenu`, `#selectAllActive`, `#selectExportable`, `#clearBatchSelection`.

- [ ] **Step 1: Add failing browser tests for default and shortcut selection**

Assert that all unarchived batches are initially selected, archived batches are not selected, all selected batches contribute cards, clearing empties the card area, and “仅选可导出” selects only eligible unarchived batches.

- [ ] **Step 2: Run focused browser tests and verify RED**

Run: `pytest -q ledger-v2/tests/test_final_prototype_browser.py -k 'batch_multiselect or selection_shortcuts' -vv --tb=short`

Expected: failures because the multi-select controls do not exist.

- [ ] **Step 3: Implement the minimal unified selector**

Replace the single `<select>` and view switch with a button-triggered checkbox menu. Store selected batch IDs in insertion-independent state, render counts as `共 N 项 · 已撤回 N 项 · 已填报 N 项 · 已审核 N 项 · 待处理 N 项`, and display all selected items in the existing horizontal card track.

- [ ] **Step 4: Implement unified sorting and card provenance**

Sort by the approved status priority, deadline, batch name, and item code. Always render the batch name on cards because more than one batch may be visible.

- [ ] **Step 5: Run focused static and browser tests**

Run: `pytest -q ledger-v2/tests/test_final_prototype.py ledger-v2/tests/test_final_prototype_browser.py -k 'contract or batch_multiselect or selection_shortcuts' -vv --tb=short`

Expected: all selected tests pass.

### Task 3: Enforce exact-selection export and confirmation-only modal

**Files:**
- Modify: `ledger-v2/pages/prototype/01-supervisor.html`
- Test: `ledger-v2/tests/test_final_prototype_browser.py`

**Interfaces:**
- Consumes: `selectedBatches()` from Task 2.
- Produces: `selectedExportSummary()`, `canExportSelection()`, inline `#exportBlockReason`, confirmation content in `#modalSummary`, and post-export reselection.

- [ ] **Step 1: Add failing export behavior tests**

Cover: one ineligible selected batch blocks the entire export; selecting only eligible active batches enables export; the confirmation includes selected batch count, total count including withdrawn, withdrawn count, and actual export count; exported batches become archived and are deselected; remaining active batches are selected.

- [ ] **Step 2: Run focused export tests and verify RED**

Run: `pytest -q ledger-v2/tests/test_final_prototype_browser.py -k 'export_selection or export_confirmation or export_reselection' -vv --tb=short`

Expected: failures because the current modal still owns batch selection and exports checkbox choices.

- [ ] **Step 3: Implement exact-selection eligibility**

Enable export only when at least one batch is selected, every selected batch is unarchived, and every non-withdrawn item in every selected batch is `已填报` or `已审核`. Render a specific reason for empty, archived, and ineligible selections.

- [ ] **Step 4: Reduce the modal to final confirmation**

Remove export batch checkboxes. Show the approved batch/total/withdrawn/actual counts and the fixed recognition-and-archive statement.

- [ ] **Step 5: Implement post-export state**

Archive non-withdrawn records in selected batches, deselect exported batches, select all remaining unarchived batches, and show the approved success message.

- [ ] **Step 6: Run export tests and verify GREEN**

Run: `pytest -q ledger-v2/tests/test_final_prototype_browser.py -k 'export' -vv --tb=short`

Expected: all export tests pass.

### Task 4: Regenerate the Lincoln projection and verify the prototype stage

**Files:**
- Modify (generated): `ledger-v2/assets/js/package-data.js`
- Update: `ledger-v2/workflow-stage.yaml`
- Update: `ledger-v2/documents.yaml`
- Create: `.context/ledger-v2-batch-multiselect.png`
- Create: `.context/ledger-v2-export-confirmation.png`

**Interfaces:**
- Consumes: completed documents and prototype from Tasks 1–3.
- Produces: reviewable Lincoln portal navigation and screenshots while preserving the pending human gate.

- [ ] **Step 1: Regenerate package data with Lincoln 1.9.1**

Run the tagged `scripts/lincoln_index.py` projection against `ledger-v2/workflow-stage.yaml`, excluding the portal’s own `index.html` from page navigation as in the existing package workflow.

- [ ] **Step 2: Run the complete automated suite**

Run: `pytest -q ledger-v2/tests`

Expected: all tests pass with zero failures.

- [ ] **Step 3: Run multi-viewport visual and console verification**

Open the Lincoln portal at 1600×1000, 1440×900, and 1280×800. Exercise batch selection, blocker state, eligible-only shortcut, export confirmation, and post-export reselection. Require zero page errors and zero console errors.

- [ ] **Step 4: Capture review screenshots**

Save the unified multi-select ledger and confirmation-only export modal under `.context/`.

- [ ] **Step 5: Record artifacts and validate the Lincoln exit gate**

Run:

```bash
python3 scripts/stage_loader.py --state-file ledger-v2/workflow-stage.yaml --stage product-prototype --action record-artifacts
python3 scripts/stage_loader.py --state-file ledger-v2/workflow-stage.yaml --stage product-prototype --action validate-exit
```

Expected: artifacts pass; exit remains blocked only by the unapproved `product-prototype` human gate.
