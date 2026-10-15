from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
PROTOTYPE = ROOT / "pages" / "prototype" / "01-supervisor.html"


def open_page(browser, query=""):
    page = browser.new_page(viewport={"width": 1600, "height": 1000})
    page.goto(PROTOTYPE.as_uri() + query, wait_until="load")
    return page


def test_supervisor_submit_changes_both_states():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser)
        page.locator("#submitBtn").click()
        assert page.locator("#detailFollow").inner_text() == "已审核"
        assert "督办人已审核" in page.locator("#detailNode").inner_text()
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
        assert page.locator("#returnBanner").is_visible()
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
        assert page.locator("#returnBtn").is_visible()
        page.locator("#returnBtn").click()
        page.locator("#modalReason").fill("请转办人补充执行依据")
        page.locator("#modalConfirm").click()
        assert page.locator("#detailNode").inner_text() == "待转办人处理"
        browser.close()


def test_transfer_can_continue_return_to_sub_transfer():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        page = open_page(browser, "?scenario=transfer-return")
        assert page.locator("#returnBtn").is_visible()
        page.locator("#returnBtn").click()
        page.locator("#modalReason").fill("请次转人补充实际进展")
        page.locator("#modalConfirm").click()
        assert page.locator("#detailNode").inner_text() == "待次转人处理"
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
        browser.close()
