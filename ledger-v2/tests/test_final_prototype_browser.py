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


def test_return_requires_reason_and_moves_to_direct_downstream():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        page.locator("#returnBtn").click()
        assert page.locator("#modalConfirm").is_disabled()
        page.locator("#modalReason").fill("请补充责任单位与完成节点")
        assert page.locator("#modalConfirm").is_enabled()
        page.locator("#modalConfirm").click()
        assert page.locator("#detailFollow").inner_text() == "跟进中"
        assert "待经办人处理" in page.locator("#detailNode").inner_text()
        assert page.locator("#returnBanner").count() == 0
        assert page.locator("details").get_attribute("open") is not None
        assert "第 1 次打回" in page.locator("#flowList").inner_text()
        assert "请补充责任单位与完成节点" in page.locator("#flowList").inner_text()
        assert collaborator_status(page, "handler") == "pending"
        assert collaborator_status(page, "transfer") == "submitted"
        assert collaborator_status(page, "sub") == "submitted"
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
        assert "1 个批次" in summary
        assert "共 4 项" in summary
        assert "已撤回 1 项" in summary
        assert "实际导出并归档 3 项" in summary
        assert page.locator(".batch-check").count() == 0
        page.locator("#modalConfirm").click()
        page.locator("#batchMultiSelect").click()
        assert page.locator('.batch-option-check[data-bid="b1"]').is_checked() is False
        assert page.locator('.batch-option[data-bid="b1"]').get_attribute("data-status") == "archived"
        assert page.locator('.batch-option-check[data-bid="b2"]').is_checked()
        assert page.locator('.batch-option-check[data-bid="b3"]').is_checked()
        assert "已选 2 个批次" in page.locator("#batchMultiSelect").inner_text()
        page.locator('.batch-option-check[data-bid="b1"]').check()
        page.locator("#batchMultiSelect").click()
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
        assert page.locator(".card").count() == 10
        assert page.locator("#cards").evaluate("el => el.scrollWidth > el.clientWidth")
        card_tops = page.locator(".card").evaluate_all("els => els.map(el => Math.round(el.getBoundingClientRect().top))")
        assert len(set(card_tops)) == 1
        assert page.locator(".card .batch-tag").count() == 10
        states = page.locator(".card .follow").all_inner_texts()
        priority = {"逾期未填报": 0, "跟进中": 1, "已填报": 2, "已审核": 3, "已归档": 4, "已撤回": 5}
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
        page.locator("#selectExportable").click()
        assert page.locator('.batch-option-check[data-bid="b1"]').is_checked()
        assert page.locator('.batch-option-check[data-bid="b2"]').is_checked() is False
        assert page.locator('.batch-option-check[data-bid="b3"]').is_checked() is False
        assert page.locator('.batch-option-check[data-bid="b4"]').is_checked() is False
        assert page.locator(".card").count() == 4
        assert page.locator("#exportBtn").is_enabled()
        page.locator("#selectAllActive").click()
        assert page.locator(".card").count() == 10
        assert page.locator("#exportBtn").is_disabled()
        browser.close()


def test_selecting_an_archived_batch_blocks_export_but_keeps_history_visible():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        page.locator("#batchMultiSelect").click()
        archived_summary = page.locator('.batch-option[data-bid="b4"] small').inner_text()
        assert "已归档 1 项" in archived_summary
        assert "待处理 0 项" in archived_summary
        page.locator("#clearBatchSelection").click()
        page.locator('.batch-option-check[data-bid="b4"]').check()
        assert page.locator(".card").count() == 1
        assert page.locator(".card .follow").inner_text() == "已归档"
        assert page.locator("#exportBtn").is_disabled()
        assert "已归档批次" in page.locator("#exportBlockReason").inner_text()
        browser.close()


def test_handler_can_continue_return_to_transfer():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser, "?scenario=handler-return")
        assert collaborator_status(page, "handler") == "pending"
        assert collaborator_status(page, "transfer") == "submitted"
        assert collaborator_status(page, "sub") == "submitted"
        assert page.locator("#transferBtn").is_hidden()
        assert page.locator("#returnBtn").is_visible()
        page.locator("#returnBtn").click()
        page.locator("#modalReason").fill("请转办人补充执行依据")
        page.locator("#modalConfirm").click()
        assert page.locator("#detailNode").inner_text() == "待转办人处理"
        assert collaborator_status(page, "handler") == "inactive"
        assert collaborator_status(page, "transfer") == "pending"
        assert collaborator_status(page, "sub") == "submitted"
        assert page.locator("#transferBtn").is_hidden()
        browser.close()


def test_transfer_can_continue_return_to_sub_transfer():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser, "?scenario=transfer-return")
        assert collaborator_status(page, "handler") == "inactive"
        assert collaborator_status(page, "transfer") == "pending"
        assert collaborator_status(page, "sub") == "submitted"
        assert page.locator("#transferBtn").is_hidden()
        assert page.locator("#returnBtn").is_visible()
        page.locator("#returnBtn").click()
        page.locator("#modalReason").fill("请次转人补充实际进展")
        page.locator("#modalConfirm").click()
        assert page.locator("#detailNode").inner_text() == "待次转人处理"
        assert collaborator_status(page, "handler") == "inactive"
        assert collaborator_status(page, "transfer") == "inactive"
        assert collaborator_status(page, "sub") == "pending"
        assert page.locator("#transferBtn").is_hidden()
        flow = page.locator("#flowList").inner_text()
        assert "第 1 次打回" in flow
        assert "第 2 次打回" in flow
        assert "第 3 次打回" in flow
        assert "苏尚打回" in flow
        assert "张明明继续打回" in flow
        assert "李良龙继续打回" in flow
        browser.close()


def test_withdrawn_card_uses_supervisor_withdrawn_node_label():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        node = page.locator('.card[data-rid="r4"] .node')
        assert node.inner_text() == "督办人已撤回"
        browser.close()


def test_handler_and_transfer_entry_pages_open_return_to_downstream_dialogs():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        cases = [
            (ROOT / "pages" / "prototype" / "02-handler-return.html", "转办人"),
            (ROOT / "pages" / "prototype" / "03-transfer-return.html", "次转人"),
        ]
        for entry, target in cases:
            page = browser.new_page(viewport={"width": 1600, "height": 1000})
            page.goto(entry.as_uri(), wait_until="load")
            page.wait_for_url("**/01-supervisor.html?scenario=*-return&action=return")
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
        page.locator('.pnav-link[data-path="pages/prototype/01-supervisor.html"]').click()
        assert "focus" in (page.locator("#portalWrap").get_attribute("class") or "")
        assert page.locator("#navDrawerBtn").is_visible()
        page.locator("#navDrawerBtn").click()
        assert "nav-open" in (page.locator("#portalWrap").get_attribute("class") or "")
        page.locator('.pnav-link[data-path="pages/prototype/02-handler-return.html"]').click()
        assert "02-handler-return.html" in page.locator("#frame").get_attribute("src")
        page.locator("#navDrawerBtn").click()
        page.locator('.pnav-link[data-path="pages/prototype/03-transfer-return.html"]').click()
        assert "03-transfer-return.html" in page.locator("#frame").get_attribute("src")
        page.locator("#navDrawerBtn").click()
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
        assert page.locator("#detailNode").inner_text() == "待督办人提交"
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
