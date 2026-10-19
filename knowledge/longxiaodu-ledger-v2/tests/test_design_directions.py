from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DIRECTIONS = {
    "direction-a-deadline-ribbon.html": "方向 A · 原位增补",
    "direction-b-task-focus.html": "方向 B · 紧凑操作",
    "direction-c-audit-rail.html": "方向 C · 状态提示",
}


def test_three_complete_direction_files_exist():
    demo_dir = ROOT / "design-demos"
    actual = {path.name for path in demo_dir.glob("direction-*.html")}
    assert actual == set(DIRECTIONS)


def test_each_direction_contains_business_contract():
    for filename, title in DIRECTIONS.items():
        html = (ROOT / "design-demos" / filename).read_text(encoding="utf-8")
        assert title in html
        assert 'data-framework="existing-ledger"' in html
        assert 'class="ledger-shell"' in html
        assert "跟进批次" in html
        assert "本批督办事项" in html
        assert "协作者" in html
        assert "部门反馈工作落实情况" in html
        assert "事项跟进状态" in html
        assert "事项节点状态" in html
        assert "已填报" in html
        assert "已审核" in html
        assert "督办人已审核" in html
        assert "打回" in html
        assert "导出即认可并归档" in html
        assert "交办内容" in html
        assert "评论" not in html
        assert "10:00-1" in html
        assert "10:00-2" in html
        assert "（2）" not in html
        assert "（审核下游）" not in html


def test_directions_use_distinct_layout_signatures():
    signatures = []
    for filename in DIRECTIONS:
        html = (ROOT / "design-demos" / filename).read_text(encoding="utf-8")
        marker = 'data-variation="'
        start = html.index(marker) + len(marker)
        signatures.append(html[start:html.index('"', start)])
    assert len(set(signatures)) == 3
