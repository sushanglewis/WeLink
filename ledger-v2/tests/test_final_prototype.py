import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PROTOTYPE = ROOT / "pages" / "prototype" / "01-supervisor.html"


def test_final_prototype_contract():
    html = PROTOTYPE.read_text(encoding="utf-8")
    assert 'data-framework="existing-ledger"' in html
    assert 'data-direction="A"' in html
    assert 'class="ledger-shell"' in html
    for text in [
        "跟进批次",
        "事项合集",
        "全选未归档",
        "仅选可导出",
        "清空",
        "交办内容",
        "协作者",
        "事项跟进状态",
        "事项节点状态",
        "跟进中",
        "已退回",
        "已填报",
        "已审核",
        "已归档",
        "逾期未填报",
        "督办人已审核",
        "打回",
        "督办人已撤回",
        "撤回事项",
        "导出即认可并归档",
        "实际导出",
    ]:
        assert text in html
    assert "手动刷新" not in html
    assert "2026-10-24 12:00-1" in html
    assert "2026-10-24 12:00-2" in html
    assert "（2）" not in html
    assert "prototypeRole" not in html
    assert "（审核下游）" not in html
    assert 'id="prevCard"' in html
    assert 'id="nextCard"' in html
    assert 'id="batchMultiSelect"' in html
    assert 'id="batchMenu"' in html
    assert 'id="selectAllActive"' in html
    assert 'id="selectExportable"' in html
    assert 'id="clearBatchSelection"' in html
    assert 'id="exportBlockReason"' in html
    assert "collaborators:" in html
    assert "scene:" in html
    assert "card-note" in html
    assert "validSubmittedRoles:" in html
    assert "hasBeenReturned:" in html
    assert 'class="collaborator-status' in html
    assert 'class="return-banner"' not in html
    assert "<details open>" in html
    assert "i.events.some" not in html
    assert 'data-view="flat"' not in html
    assert "平铺模式" not in html
    assert "batch-check" not in html
    assert 'class="traffic"' not in html
    assert "詹少鹏" not in html
    assert "苏尚" in html
    assert 'id="userAvatar"' in html
    assert "<svg" in html


def test_direction_gate_records_user_choice():
    gate = (ROOT / "direction-approved.md").read_text(encoding="utf-8")
    assert "用户选择原话：`A`" in gate
    assert "原位增补" in gate


def test_index_uses_lincoln_document_portal():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    assert 'class="portal-wrap"' in html
    assert 'id="portalWrap"' in html
    assert 'id="pnav"' in html
    assert 'id="pnavGroups"' in html
    assert 'id="frame"' in html
    assert 'id="docView"' in html
    # Lincoln 1.9.2 目录框架：nav-rail 展开按钮 + app.js 渲染的收起按钮
    assert 'id="navRail"' in html
    assert 'id="navExpandBtn"' in html
    assert 'id="navCollapseBtn"' in (ROOT / "assets" / "app.js").read_text(encoding="utf-8")
    assert 'id="focusToggle"' not in html
    assert 'id="navDrawerBtn"' not in html
    assert "assets/js/package-data.js" in html
    assert "assets/marked.min.js" in html
    assert "assets/mermaid.min.js" in html
    assert 'id="pann"' not in html


def test_portal_lists_role_views_in_left_navigation():
    data = (ROOT / "assets" / "js" / "package-data.js").read_text(encoding="utf-8")
    assert '"path": "index.html"' not in data
    assert "督办人视角" in data
    assert "经办人视角" in data
    assert "转办人视角" in data
    assert "次级转办人视角" in data
    assert "pages/prototype/01-supervisor.html" in data
    assert "pages/prototype/02-handler-return.html" in data
    assert "pages/prototype/03-transfer-return.html" in data
    assert "pages/prototype/04-sub-handler-return.html" in data
    assert '"markdown": ""' in data


def test_node_statuses_use_canonical_vocabulary():
    html = PROTOTYPE.read_text(encoding="utf-8")
    assert "待督办人审核" in html
    assert "待督办人提交" not in html
    assert "待次级转办人处理" in html
    assert "待次转人处理" not in html


def test_state_machine_doc_covers_states_and_role_operations():
    html = (ROOT / "pages" / "docs" / "state-and-flow.html").read_text(encoding="utf-8")
    for state in ["跟进中", "已退回", "已填报", "已审核", "逾期未填报", "已归档",
                  "待经办人处理", "待转办人处理", "待次级转办人处理",
                  "待转办人提交", "待经办人提交", "待督办人审核", "督办人已审核", "归档"]:
        assert state in html, state
    for role in ["督办人", "经办人", "转办人", "次级转办人"]:
        assert f"### {role}" in html, role
    for op in ["提交", "打回", "撤回", "转办", "导出", "下发"]:
        assert op in html
    assert "待督办人提交" not in html
    assert "待次转人" not in html
    data = (ROOT / "assets" / "js" / "package-data.js").read_text(encoding="utf-8")
    assert "待督办人提交" not in data
    assert "待次转人" not in data
    assert "待督办人审核" in data
    assert "待次级转办人处理" in data


def test_card_node_shows_current_handler_name():
    html = PROTOTYPE.read_text(encoding="utf-8")
    # 卡片左下节点状态后拼接当前处理人姓名
    assert "node-name" in html
    assert "collaborators[item.assignee]" in html


def test_notification_playbook_doc_covers_triggers_and_copy():
    html = (ROOT / "pages" / "docs" / "notification-playbook.html").read_text(encoding="utf-8")
    # 触发逻辑总表仅覆盖本次新增的两个场景
    for scene in ["打回", "撤回"]:
        assert scene in html, scene
    # 历史业务触发的消息文案不再展示
    for legacy in ["### 下发", "### 提交", "### 转办"]:
        assert legacy not in html, legacy
    # 打回只通知直接下游临近节点；撤回通知全部下游协作者
    assert "直接下游临近节点角色" in html
    assert "全部下游协作者" in html
    # 消息剧本：每个场景有完整文案
    for ph in ["{收件人}，你好", "{打回原因}", "{撤回原因}", "原截止时间 {截止时间} 保持不变"]:
        assert ph in html, ph
    # 不在原型中展示通知
    proto = PROTOTYPE.read_text(encoding="utf-8")
    assert "notif" not in proto
    assert "notify(" not in proto
    # 门户已登记
    data = (ROOT / "assets" / "js" / "package-data.js").read_text(encoding="utf-8")
    assert "notification-playbook.html" in data
    assert "消息剧本" in data


def test_state_machine_doc_has_mermaid_diagrams_and_corrected_transitions():
    html = (ROOT / "pages" / "docs" / "state-and-flow.html").read_text(encoding="utf-8")
    # 两张 mermaid 状态图：LR 布局，迁移边标注操作主体
    assert html.count("```mermaid") == 2
    assert html.count("stateDiagram-v2") == 2
    # 代码围栏配平，防止下方 markdown 被吞进未闭合代码块
    assert html.count("```") == 4
    assert "direction LR" in html
    for actor in ["督办人", "经办人", "转办人", "次级转办人"]:
        assert f"（{actor}）" in html, actor
    # 已退回为跟进状态第二值，已撤回并入跟进状态（七值）
    for state in ["跟进中", "已退回", "已填报", "已审核", "已归档", "逾期未填报", "已撤回"]:
        assert f"| {state} |" in html, state
    assert "覆盖态" not in html
    # 跟进中的退出条件使用填报截止时间
    assert "填报截止时间" in html
    # 打回：已填报 → 已退回；重报：已退回 → 已填报；超时未重报：已退回 → 逾期未填报
    assert "已填报 → 已退回" in html
    assert "已退回 → 已填报" in html
    assert "仍未重新提交 → 逾期未填报" in html
    # 初始填报提交（非打回重报）：跟进中 → 已填报
    assert "跟进中 → 已填报" in html
    data = (ROOT / "assets" / "js" / "package-data.js").read_text(encoding="utf-8")
    assert data.count("```mermaid") == 2
    assert data.count("stateDiagram-v2") == 2
    assert "覆盖态" not in data
    # package-data 内嵌副本与 HTML docSource 逐字一致、围栏配平
    pkg = json.loads(data[len("window.LINC_PACKAGE = "):].rstrip().rstrip(";"))
    doc_md = [it["markdown"] for g in pkg["nav"] for it in g["items"] if "state-and-flow" in it["path"]][0]
    src = re.search(r'<script type="text/markdown" id="docSource">\n?(.*?)</script>', html, re.S).group(1)
    assert src == doc_md
    assert doc_md.count("```") == 4
    # data-model 同步：已退回为跟进状态第二值，已撤回为第七值
    model = (ROOT / "designs" / "ledger-v2" / "data-model.md").read_text(encoding="utf-8")
    assert "固定七值" in model
    assert "| 已退回 |" in model
    assert "| 已撤回 |" in model


def test_withdrawn_is_terminal_state_in_both_state_machines():
    html = PROTOTYPE.read_text(encoding="utf-8")
    # 原型：已撤回是两套状态机的真实终态，撤回前取值以 prevFollow/prevNode 保留
    assert "i.follow='已撤回'" in html
    assert "i.node='已撤回'" in html
    assert "prevFollow" in html
    assert "prevNode" in html
    # 不再使用布尔覆盖层
    assert "withdrawn:false" not in html
    assert "i.withdrawn=" not in html
    # 文档：节点状态机九值含已撤回，状态图含 n9 终态
    doc = (ROOT / "pages" / "docs" / "state-and-flow.html").read_text(encoding="utf-8")
    assert "共九值" in doc
    assert "| 已撤回 | 无 |" in doc
    assert "n9: 已撤回" in doc
    assert "督办人已撤回" in doc
    assert doc.count("```") == 4
    # data-model / fields 同步：九值与双状态终态
    model = (ROOT / "designs" / "ledger-v2" / "data-model.md").read_text(encoding="utf-8")
    assert "固定九值（含已撤回）" in model
    fields = (ROOT / "designs" / "ledger-v2" / "fields.md").read_text(encoding="utf-8")
    assert "九个节点状态" in fields
    # PRD：跟进状态六值、节点状态九值均含已撤回
    prd = (ROOT / "pages" / "docs" / "prd.html").read_text(encoding="utf-8")
    assert "逾期未填报 / 已撤回" in prd
    assert "归档 / 已撤回" in prd


def test_flow_records_use_structured_standard_format():
    html = PROTOTYPE.read_text(encoding="utf-8")
    # 渲染结构：姓名、角色、操作、时间戳、可展开内容、评论
    for cls in ["flow-entry", "flow-who", "flow-role", "flow-op", "flow-time", "flow-content", "flow-note"]:
        assert cls in html
    assert "flow-line" not in html
    # 结构化数据：秒级时间戳、操作、评论字段
    assert "nowStamp" in html
    assert "op:'打回'" in html
    assert "op:'撤回'" in html
    assert "op:'提交'" in html
    assert "note:" in html
    assert "content:" in html
    # 不再有旧版纯文案模板
    assert "提交 · 待" not in html
    assert "events.unshift(`" not in html


def test_item_card_shows_deadline_instead_of_batch():
    html = PROTOTYPE.read_text(encoding="utf-8")
    assert "batch-tag" not in html
    assert "card-deadline" in html
    assert "截止 ${batch.deadline}" in html


def test_handler_and_transfer_entries_land_on_scenario_without_auto_dialog():
    handler = (ROOT / "pages" / "prototype" / "02-handler-return.html").read_text(encoding="utf-8")
    transfer = (ROOT / "pages" / "prototype" / "03-transfer-return.html").read_text(encoding="utf-8")
    assert "scenario=handler-return" in handler
    assert "scenario=transfer-return" in transfer
    assert "action=return" not in handler
    assert "action=return" not in transfer
    # 引擎不再保留 action 参数自动弹窗入口
    proto = PROTOTYPE.read_text(encoding="utf-8")
    assert "actionParam" not in proto


def test_html_prd_is_present_and_business_complete():
    html = (ROOT / "pages" / "docs" / "prd.html").read_text(encoding="utf-8")
    for text in ["产品目标", "交办内容", "撤回", "批次多选", "默认全选全部未归档批次", "逐级打回", "多批次合并导出", "YYYY-MM-DD HH:mm-N"]:
        assert text in html
