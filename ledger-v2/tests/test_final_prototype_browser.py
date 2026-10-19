import re
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
PROTOTYPE = ROOT / "pages" / "prototype" / "01-supervisor.html"


def open_page(browser, query=""):
    page = browser.new_page(viewport={"width": 1600, "height": 1000})
    page.goto(PROTOTYPE.as_uri() + query, wait_until="load")
    return page


def collaborator_status(page, role):
    person = page.locator(f'.person[data-role="{role}"]')
    return person.get_attribute("data-status")


def test_supervisor_submit_changes_both_states():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        page.locator("#submitBtn").click()
        assert page.locator("#detailFollow").inner_text() == "已审核"
        assert "督办人已审核" in page.locator("#detailNode").inner_text()
        assert collaborator_status(page, "supervisor") == "submitted"
        assert all(collaborator_status(page, role) == "submitted" for role in ["handler", "transfer", "sub"])
        browser.close()


def test_flow_records_render_standard_format_with_expandable_content():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        entry = page.locator("#flowList .flow-entry").first
        assert entry.locator(".flow-who").inner_text() == "张明明"
        assert entry.locator(".flow-role").inner_text() == "经办人"
        assert entry.locator(".flow-op").inner_text() == "提交"
        assert re.search(r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$", entry.locator(".flow-time").inner_text())
        details = entry.locator("details.flow-content")
        assert details.count() == 1
        assert details.evaluate("el => !el.open")  # 默认收起
        details.locator("summary").click()
        body = details.inner_text()
        assert "工作落实情况" in body
        assert "存在困难问题" in body
        assert "下一步工作计划" in body
        assert "预计完成时间" in body
        browser.close()


def test_card_node_displays_current_handler_name():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser, "?scenario=handler-return")
        # h1 卡片：待经办人处理 · 张明明
        card = page.locator('.card[data-rid="h1"] .node')
        assert "待经办人处理" in card.inner_text()
        assert "张明明" in card.inner_text()
        # 无当前处理人的已审核卡片不追加姓名
        r2_node = page.locator('.card[data-rid="r2"] .node')
        assert "·" not in r2_node.inner_text()
        browser.close()


def test_return_and_withdraw_records_carry_comment_and_second_precision_time():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        page.locator("#returnBtn").click()
        page.locator("#modalReason").fill("请补充责任单位与完成节点")
        page.locator("#modalConfirm").click()
        entry = page.locator("#flowList .flow-entry").first
        assert entry.locator(".flow-op").inner_text() == "第 1 次打回"
        assert entry.locator(".flow-who").inner_text() == "苏尚"
        assert entry.locator(".flow-role").inner_text() == "督办人"
        assert re.search(r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$", entry.locator(".flow-time").inner_text())
        assert "请补充责任单位与完成节点" in entry.locator(".flow-note").inner_text()
        browser.close()


def test_return_requires_reason_and_moves_to_direct_downstream():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        page.locator("#returnBtn").click()
        assert page.locator("#modalConfirm").is_disabled()
        page.locator("#modalReason").fill("请补充责任单位与完成节点")
        assert page.locator("#modalConfirm").is_enabled()
        page.locator("#modalConfirm").click()
        assert page.locator("#detailFollow").inner_text() == "已退回"
        assert "待经办人处理" in page.locator("#detailNode").inner_text()
        assert page.locator("#returnBanner").count() == 0
        assert page.locator("details").first.get_attribute("open") is not None
        assert "第 1 次打回" in page.locator("#flowList").inner_text()
        assert "请补充责任单位与完成节点" in page.locator("#flowList").inner_text()
        assert collaborator_status(page, "handler") == "pending"
        assert collaborator_status(page, "transfer") == "inactive"
        assert collaborator_status(page, "sub") == "inactive"
        assert collaborator_status(page, "supervisor") == "inactive"
        browser.close()


def test_withdraw_preserves_collaborator_display_but_clears_pending_work():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        page.locator("#withdrawBtn").click()
        page.locator("#modalReason").fill("事项下发有误")
        page.locator("#modalConfirm").click()
        assert page.locator("#detailFollow").inner_text() == "已撤回"
        assert collaborator_status(page, "supervisor") == "pending"
        assert collaborator_status(page, "handler") == "submitted"
        assert page.locator("#submitBtn").is_hidden()
        assert page.locator("#returnBtn").is_hidden()
        browser.close()


def test_item_card_shows_deadline_not_batch_name():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        assert page.locator(".card .batch-tag").count() == 0
        deadline = page.locator(".card-deadline").first.inner_text()
        assert "截止" in deadline
        assert re.search(r"\d{4}-\d{2}-\d{2} \d{2}:\d{2}$", deadline)
        assert re.search(r"\d{2}:\d{2}-\d", deadline) is None  # 无批次序号后缀
        browser.close()


def test_export_archives_eligible_batch():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        assert page.locator("#exportBtn").is_disabled()
        assert "2 个批次暂不可导出" in page.locator("#exportBlockReason").inner_text()
        page.locator("#batchMultiSelect").click()
        page.locator("#selectExportable").click()
        assert page.locator("#exportBtn").is_enabled()
        page.locator("#exportBtn").click()
        assert page.locator("#modalTitle").inner_text() == "多批次合并导出"
        assert page.locator("#modalConfirm").is_enabled()
        summary = page.locator("#modalSummary").inner_text()
        assert "2 个批次" in summary
        assert "共 5 项" in summary
        assert "已撤回 1 项" in summary
        assert "实际导出 4 项" in summary
        assert "已归档 1 项仅重新导出" in summary
        assert page.locator(".batch-check").count() == 0
        page.locator("#modalConfirm").click()
        page.locator("#batchMultiSelect").click()
        assert page.locator('.batch-option-check[data-bid="b1"]').is_checked() is False
        assert page.locator('.batch-option[data-bid="b1"]').get_attribute("data-status") == "archived"
        assert page.locator('.batch-option-check[data-bid="b2"]').is_checked()
        assert page.locator('.batch-option-check[data-bid="b3"]').is_checked()
        assert "已选 2 个批次" in page.locator("#batchMultiSelect").inner_text()
        page.locator('.batch-option-check[data-bid="b1"]').check()
        page.locator('.batch-option-check[data-bid="b2"]').uncheck()
        page.locator('.batch-option-check[data-bid="b3"]').uncheck()
        page.locator("#batchMultiSelect").click()
        # 已归档批次可再次导出
        assert page.locator("#exportBtn").is_enabled()
        page.locator('.card[data-rid="r1"]').evaluate("el => el.click()")
        assert collaborator_status(page, "handler") == "submitted"
        assert collaborator_status(page, "transfer") == "submitted"
        assert collaborator_status(page, "sub") == "submitted"
        browser.close()


def test_batch_multiselect_defaults_to_all_unarchived_and_sorts_unified_cards():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        assert "已选 3 个批次" in page.locator("#batchMultiSelect").inner_text()
        page.locator("#batchMultiSelect").click()
        assert page.locator('.batch-option-check[data-bid="b1"]').is_checked()
        assert page.locator('.batch-option-check[data-bid="b2"]').is_checked()
        assert page.locator('.batch-option-check[data-bid="b3"]').is_checked()
        assert page.locator('.batch-option-check[data-bid="b4"]').is_checked() is False
        assert page.locator(".card").count() == 11
        assert page.locator("#cards").evaluate("el => el.scrollWidth > el.clientWidth")
        card_tops = page.locator(".card").evaluate_all("els => els.map(el => Math.round(el.getBoundingClientRect().top))")
        assert len(set(card_tops)) == 1
        assert page.locator(".card .card-deadline").count() == 11
        assert page.locator(".card .card-note").count() == 11
        states = page.locator(".card .follow").all_inner_texts()
        priority = {"逾期未填报": 0, "跟进中": 1, "已退回": 1.5, "已填报": 2, "已审核": 3, "已归档": 4, "已撤回": 5}
        assert [priority[state] for state in states] == sorted(priority[state] for state in states)
        first_title = page.locator("#detailTitle").inner_text()
        page.locator("#nextCard").click()
        assert page.locator("#detailTitle").inner_text() != first_title
        browser.close()


def test_batch_selection_shortcuts_change_the_unified_scope():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        page.locator("#batchMultiSelect").click()
        page.locator("#clearBatchSelection").click()
        assert page.locator(".card").count() == 0
        assert "请选择批次" in page.locator("#batchMultiSelect").inner_text()
        assert page.locator("#exportBtn").is_disabled()
        assert page.locator("#submitBtn").is_hidden()
        assert page.locator("#returnBtn").is_hidden()
        assert page.locator("#withdrawBtn").is_hidden()
        # 已归档批次同样可导出，「仅选可导出」一并选中
        page.locator("#selectExportable").click()
        assert page.locator('.batch-option-check[data-bid="b1"]').is_checked()
        assert page.locator('.batch-option-check[data-bid="b2"]').is_checked() is False
        assert page.locator('.batch-option-check[data-bid="b3"]').is_checked() is False
        assert page.locator('.batch-option-check[data-bid="b4"]').is_checked()
        assert page.locator(".card").count() == 5
        assert page.locator("#exportBtn").is_enabled()
        page.locator("#selectAllActive").click()
        assert page.locator(".card").count() == 11
        assert page.locator("#exportBtn").is_disabled()
        browser.close()


def test_selecting_an_archived_batch_allows_reexport_and_keeps_history_visible():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        page.locator("#batchMultiSelect").click()
        archived_summary = page.locator('.batch-option[data-bid="b4"] small').inner_text()
        assert "已归档 1 项" in archived_summary
        assert "需处理 0 项" in archived_summary
        for st in ["总数", "跟进中", "已退回", "已填报", "已审核", "已归档", "逾期未填报", "已撤回", "需处理"]:
            assert st in archived_summary
        page.locator("#clearBatchSelection").click()
        page.locator('.batch-option-check[data-bid="b4"]').check()
        assert page.locator(".card").count() == 1
        assert page.locator(".card .follow").inner_text() == "已归档"
        note = page.locator(".card .card-note")
        assert re.search(r"^\d+$", note.inner_text())
        assert "已归档批次回看" in note.get_attribute("data-note")
        # 归档批次支持再次导出
        assert page.locator("#exportBtn").is_enabled()
        assert "已选择 1 个可导出批次" in page.locator("#exportBlockReason").inner_text()
        page.locator("#exportBtn").click()
        summary = page.locator("#modalSummary").inner_text()
        assert "实际导出 1 项" in summary
        assert "已归档 1 项仅重新导出" in summary
        page.locator("#modalConfirm").click()
        # 再次导出不重复归档、不产生新流转记录：重新勾选 b4 查看 a2
        page.locator("#batchMultiSelect").click()
        page.locator('.batch-option-check[data-bid="b4"]').check()
        page.locator("#batchMultiSelect").click()
        page.locator('.card[data-rid="a2"]').evaluate("el => el.click()")
        assert page.locator('.card[data-rid="a2"] .follow').inner_text() == "已归档"
        flow = page.locator("#flowList").inner_text()
        assert "导出归档" in flow
        assert page.locator("#flowList .flow-entry").count() == 1
        browser.close()


def test_returned_item_blocks_batch_export():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        # b2 含已退回记录：单独选中时批次不可导出
        page.locator("#batchMultiSelect").click()
        page.locator("#clearBatchSelection").click()
        page.locator('.batch-option-check[data-bid="b2"]').check()
        assert page.locator(".card").count() == 4
        assert page.locator('.batch-option[data-bid="b2"]').get_attribute("data-status") == "blocked"
        assert page.locator("#exportBtn").is_disabled()
        assert "1 个批次暂不可导出" in page.locator("#exportBlockReason").inner_text()
        browser.close()


def test_returned_downstream_resubmit_moves_back_to_filled():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser, "?scenario=handler-return")
        assert page.locator("#detailFollow").inner_text() == "已退回"
        page.locator("#submitBtn").click()
        # 任一下游协作者重新提交：已退回 → 已填报
        assert page.locator("#detailFollow").inner_text() == "已填报"
        assert page.locator("#detailNode").inner_text() == "待督办人审核"
        assert collaborator_status(page, "handler") == "submitted"
        assert page.locator('.card[data-rid="h1"] .follow').inner_text() == "已填报"
        browser.close()


def test_handler_can_continue_return_to_transfer():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser, "?scenario=handler-return")
        assert page.locator("#detailFollow").inner_text() == "已退回"
        assert collaborator_status(page, "handler") == "pending"
        assert collaborator_status(page, "transfer") == "inactive"
        assert collaborator_status(page, "sub") == "inactive"
        assert page.locator("#transferBtn").is_hidden()
        assert page.locator("#returnBtn").is_visible()
        page.locator("#returnBtn").click()
        page.locator("#modalReason").fill("请转办人补充执行依据")
        page.locator("#modalConfirm").click()
        assert page.locator("#detailFollow").inner_text() == "已退回"
        assert page.locator("#detailNode").inner_text() == "待转办人处理"
        assert collaborator_status(page, "handler") == "inactive"
        assert collaborator_status(page, "transfer") == "pending"
        assert collaborator_status(page, "sub") == "inactive"
        assert page.locator("#transferBtn").is_hidden()
        browser.close()


def test_transfer_can_continue_return_to_sub_transfer():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser, "?scenario=transfer-return")
        assert page.locator("#detailFollow").inner_text() == "已退回"
        assert collaborator_status(page, "handler") == "inactive"
        assert collaborator_status(page, "transfer") == "pending"
        assert collaborator_status(page, "sub") == "inactive"
        assert page.locator("#transferBtn").is_hidden()
        assert page.locator("#returnBtn").is_visible()
        page.locator("#returnBtn").click()
        page.locator("#modalReason").fill("请次转人补充实际进展")
        page.locator("#modalConfirm").click()
        assert page.locator("#detailFollow").inner_text() == "已退回"
        assert page.locator("#detailNode").inner_text() == "待次级转办人处理"
        assert collaborator_status(page, "handler") == "inactive"
        assert collaborator_status(page, "transfer") == "inactive"
        assert collaborator_status(page, "sub") == "pending"
        assert page.locator("#transferBtn").is_hidden()
        flow = page.locator("#flowList").inner_text()
        assert "第 1 次打回" in flow
        assert "第 2 次打回" in flow
        assert "第 3 次打回" in flow
        assert "苏尚" in flow and "打回" in flow
        assert "张明明" in flow and "继续" not in flow  # 操作统一为结构化 op
        assert "李良龙" in flow
        browser.close()


def test_returned_downstream_resubmit_state_and_card_scene_annotation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        # 事项卡片均标注模拟场景
        assert page.locator(".card .card-note").count() == 11
        # 新状态：打回后下游（转办人）重新提交，待经办人审核
        page.locator('.card[data-rid="t2"]').evaluate("el => el.click()")
        t2_note = page.locator('.card[data-rid="t2"] .card-note')
        assert re.search(r"^\d+$", t2_note.inner_text())
        assert "打回后下游再提交" in t2_note.get_attribute("data-note")
        assert page.locator("#detailNode").inner_text() == "待经办人提交"
        # 经办人黄色待处理；被打回后重新提交的转办人恢复绿色；其更下游保持灰色
        assert collaborator_status(page, "handler") == "pending"
        assert collaborator_status(page, "transfer") == "submitted"
        assert collaborator_status(page, "sub") == "inactive"
        flow = page.locator("#flowList").inner_text()
        assert "第 1 次打回" in flow
        assert "请补充授权范围、期限与责任人" in flow
        # 已发生打回且当前待经办人提交：督办人视角无可操作动作，仅查看
        assert page.locator("#transferBtn").is_hidden()
        assert page.locator("#returnBtn").is_hidden()
        assert page.locator("#submitBtn").is_hidden()
        browser.close()


def test_withdrawn_card_uses_supervisor_withdrawn_node_label():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        node = page.locator('.card[data-rid="r4"] .node')
        assert node.inner_text() == "督办人已撤回"
        browser.close()


def test_withdraw_enters_withdrawn_state_in_both_machines():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        page.locator('.card[data-rid="r1"]').click()
        assert page.locator("#detailFollow").inner_text() == "已填报"
        assert page.locator("#detailNode").inner_text() == "待督办人审核"
        page.locator("#withdrawBtn").click()
        page.locator("#modalReason").fill("事项下发有误")
        page.locator("#modalConfirm").click()
        # 两套状态机同时进入已撤回终态；卡片与详情联动
        assert page.locator("#detailFollow").inner_text() == "已撤回"
        assert page.locator("#followChip").inner_text() == "事项跟进状态 · 已撤回"
        assert page.locator("#detailNode").inner_text() == "撤回前：待督办人审核"
        assert page.locator('.card[data-rid="r1"] .follow').inner_text() == "已撤回"
        assert page.locator('.card[data-rid="r1"] .node').inner_text() == "督办人已撤回"
        assert page.locator("#withdrawBtn").is_hidden()
        browser.close()


def test_handler_and_transfer_entry_pages_land_without_dialog_and_open_via_return_button():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        cases = [
            (ROOT / "pages" / "prototype" / "02-handler-return.html", "转办人"),
            (ROOT / "pages" / "prototype" / "03-transfer-return.html", "次级转办人"),
        ]
        for entry, target in cases:
            page = browser.new_page(viewport={"width": 1600, "height": 1000})
            page.goto(entry.as_uri(), wait_until="load")
            page.wait_for_url("**/01-supervisor.html?scenario=*-return")
            assert "action=return" not in page.url
            assert not page.locator("#modal").is_visible()
            page.locator("#returnBtn").click()
            assert page.locator("#modal").is_visible()
            assert page.locator("#modalTitle").inner_text() == "打回事项"
            assert target in page.locator("#modalSummary").inner_text()
            assert page.locator("#modalReason").is_visible()
            assert page.locator("#modalConfirm").is_disabled()
            page.close()
        browser.close()


def test_sub_handler_can_only_resubmit_to_transfer():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser, "?scenario=sub-return")
        assert collaborator_status(page, "handler") == "inactive"
        assert collaborator_status(page, "transfer") == "inactive"
        assert collaborator_status(page, "sub") == "pending"
        assert page.locator("#transferBtn").is_hidden()
        assert page.locator("#returnBtn").is_hidden()
        page.locator("#submitBtn").click()
        assert page.locator("#detailNode").inner_text() == "待转办人提交"
        assert collaborator_status(page, "transfer") == "pending"
        assert collaborator_status(page, "sub") == "submitted"
        browser.close()


def test_missing_collaborators_show_dash_without_status_marker():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser, "?scenario=missing-collaborators")
        transfer = page.locator('.person[data-role="transfer"]')
        sub = page.locator('.person[data-role="sub"]')
        assert transfer.locator("b").inner_text() == "—"
        assert sub.locator("b").inner_text() == "—"
        assert transfer.get_attribute("data-status") == "missing"
        assert sub.get_attribute("data-status") == "missing"
        assert transfer.locator(".collaborator-status").count() == 0
        assert sub.locator(".collaborator-status").count() == 0
        browser.close()


def test_portal_left_navigation_switches_role_views():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = browser.new_page(viewport={"width": 1600, "height": 1000})
        page.goto((ROOT / "index.html").as_uri() + "#/pages/docs/prd.html", wait_until="load")
        # Lincoln 1.9.2：原型页不再自动收起目录，切换行为与文档统一
        page.locator('.pnav-link[data-path="pages/prototype/01-supervisor.html"]').click()
        assert "01-supervisor.html" in page.locator("#frame").get_attribute("src")
        assert "focus" not in (page.locator("#portalWrap").get_attribute("class") or "")
        # 手动收起：pnav 头部「收起目录」→ nav-rail 展开按钮
        page.locator("#navCollapseBtn").click()
        assert "focus" in (page.locator("#portalWrap").get_attribute("class") or "")
        assert page.locator("#navExpandBtn").is_visible()
        # 收起态下目录链接不可见，需先经 nav-rail 展开再切换
        page.locator("#navExpandBtn").click()
        assert "focus" not in (page.locator("#portalWrap").get_attribute("class") or "")
        page.locator('.pnav-link[data-path="pages/prototype/02-handler-return.html"]').click()
        assert "02-handler-return.html" in page.locator("#frame").get_attribute("src")
        page.locator('.pnav-link[data-path="pages/prototype/03-transfer-return.html"]').click()
        assert "03-transfer-return.html" in page.locator("#frame").get_attribute("src")
        page.locator('.pnav-link[data-path="pages/prototype/04-sub-handler-return.html"]').click()
        assert "04-sub-handler-return.html" in page.locator("#frame").get_attribute("src")
        browser.close()


def test_supervisor_cannot_withdraw_reviewed_item():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        page.locator('.card[data-rid="r2"]').click()
        assert page.locator("#detailFollow").inner_text() == "已审核"
        assert page.locator("#detailNode").inner_text() == "督办人已审核"
        assert page.locator("#withdrawBtn").is_hidden()
        browser.close()


def test_supervisor_can_withdraw_filled_but_unreviewed_item():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        page.locator('.card[data-rid="r1"]').click()
        assert page.locator("#detailFollow").inner_text() == "已填报"
        assert page.locator("#withdrawBtn").is_visible()
        browser.close()


def test_card_click_switches_selected_item_record():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        assert page.locator(".card.on").get_attribute("data-rid") == "r1"
        page.locator('.card[data-rid="r3"]').click()
        assert page.locator(".card.on").get_attribute("data-rid") == "r3"
        assert "数据资源目录" in page.locator("#detailTitle").inner_text()
        assert page.locator("#detailNode").inner_text() == "待督办人审核"
        browser.close()


def test_bottom_left_avatar_uses_simulated_role_person_surname():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        cases = [
            ("?scenario=supervisor", "苏"),
            ("?scenario=handler-return", "张"),
            ("?scenario=transfer-return", "李"),
            ("?scenario=sub-return", "王"),
        ]
        for query, surname in cases:
            page = browser.new_page(viewport={"width": 1600, "height": 1000})
            page.goto(PROTOTYPE.as_uri() + query, wait_until="load")
            assert page.locator("#userAvatar").inner_text() == surname
            page.close()
        browser.close()


def test_left_rail_uses_icons_instead_of_text_labels():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        buttons = page.locator(".app-rail .rail-icon")
        assert buttons.count() == 5
        for idx in range(buttons.count()):
            button = buttons.nth(idx)
            assert button.locator("svg").count() >= 1
            assert button.inner_text().strip() == ""
        browser.close()


def test_no_legacy_supervisor_name_references():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        assert "詹少鹏" not in page.content()
        assert "苏尚" in page.content()
        browser.close()


def test_state_flow_doc_renders_markdown_and_state_diagrams():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = browser.new_page(viewport={"width": 1400, "height": 1200})
        page.goto((ROOT / "pages" / "docs" / "state-and-flow.html").as_uri(), wait_until="load")
        page.wait_for_timeout(2000)
        # 围栏修复后，文档下半的表格与标题正常渲染（未被吞进代码块）
        assert page.locator("#docContent h2").count() >= 6
        assert page.locator("#docContent table").count() >= 6
        # 两张 UML 状态图均渲染出 svg
        assert page.locator("#docContent .lincoln-mermaid").count() == 2
        assert page.locator("#docContent .lincoln-mermaid svg").count() == 2
        browser.close()
