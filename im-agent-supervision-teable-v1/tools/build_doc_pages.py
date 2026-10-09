#!/usr/bin/env python3
"""Build self-contained doc HTML pages from canonical .md sources.

Each doc page embeds its markdown source in <script type="text/markdown">
and renders it client-side via assets/js/doc-render.js (works over file://).
Usage: python3 tools/build_doc_pages.py <md-file> [<md-file> ...]
"""
import re
import sys
from pathlib import Path

SHELL = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="doc-uid" content="{uid}">
<title>{title}</title>
<link rel="stylesheet" href="{prefix}assets/style.css">
</head>
<body class="doc-page" data-page-uid="{uid}">

<header class="doc-header">
    <h1>{title}</h1>
    <div class="doc-meta">
        <span class="doc-version">v1.0-final</span>
        <span class="doc-stage">阶段: product-design-docs</span>
    </div>
</header>

<div class="doc-content" id="docContent"></div>

<script type="text/markdown" id="docSource">
{markdown}
</script>
<script src="{prefix}assets/js/doc-render.js"></script>
</body>
</html>
"""


def build(md_path: Path) -> Path:
    md = md_path.read_text(encoding="utf-8")
    if "</script" in md.lower():
        raise SystemExit(f"{md_path}: markdown must not contain </script>")
    m = re.search(r"^#\s+(.+)$", md, re.M)
    if not m:
        raise SystemExit(f"{md_path}: missing top-level # heading")
    title = m.group(1).strip()
    # doc-header already renders the title: drop the markdown's first # heading
    md = md[: m.start()] + md[m.end():].lstrip("\n")
    # md paths are given relative to the package root; asset prefix = one level up per dir
    depth = len(md_path.parent.parts)
    prefix = "../" * depth
    uid = md_path.stem
    html = SHELL.format(title=title, uid=uid, prefix=prefix, markdown=md.rstrip())
    out = md_path.with_suffix(".html")
    out.write_text(html, encoding="utf-8")
    print(f"built {out}")
    return out


if __name__ == "__main__":
    for arg in sys.argv[1:]:
        build(Path(arg))
