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
    assert "评论" not in html
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
    assert 'id="focusToggle"' in html
    assert 'id="navDrawerBtn"' in html
    assert 'id="navDrawerBackdrop"' in html
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


def test_handler_and_transfer_entries_open_downstream_return_interfaces():
    handler = (ROOT / "pages" / "prototype" / "02-handler-return.html").read_text(encoding="utf-8")
    transfer = (ROOT / "pages" / "prototype" / "03-transfer-return.html").read_text(encoding="utf-8")
    assert "scenario=handler-return&action=return" in handler
    assert "scenario=transfer-return&action=return" in transfer


def test_html_prd_is_present_and_business_complete():
    html = (ROOT / "pages" / "docs" / "prd.html").read_text(encoding="utf-8")
    for text in ["产品目标", "交办内容", "撤回", "批次多选", "默认全选全部未归档批次", "逐级打回", "多批次合并导出", "YYYY-MM-DD HH:mm-N"]:
        assert text in html
