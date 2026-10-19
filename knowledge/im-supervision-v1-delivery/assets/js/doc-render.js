/* Lincoln doc page renderer: markdown source embedded in <script type="text/markdown" id="docSource">
 * is rendered into #docContent. Shared by all *.{document} pages in this package.
 * Extracted from the im-agent-supervision-teable-next portal doc pages (2026-09-15). */
(function () {
    'use strict';

    var THEME_KEY = 'lincoln-theme';

    function getQueryTheme() {
        var m = window.location.search.match(/[?&]theme=(light|dark)(?:&|$)/);
        return m ? m[1] : null;
    }

    function getStoredTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (err) {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (err) {
            // ignore
        }
    }

    function applyTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') return;
        document.documentElement.setAttribute('data-theme', theme);
        setStoredTheme(theme);
    }

    function initTheme() {
        var theme = getQueryTheme() || getStoredTheme() || 'light';
        applyTheme(theme);

        window.addEventListener('message', function (e) {
            var data = e.data || {};
            if (data.type === 'lincoln-theme' && (data.theme === 'light' || data.theme === 'dark')) {
                applyTheme(data.theme);
            }
        });

        window.addEventListener('load', function () {
            if (window.parent) {
                window.parent.postMessage({ type: 'lincoln-theme-ready' }, '*');
            }
        });
    }

    function renderMarkdown(src) {
        var lines = src.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
        var html = '';
        var inCode = false;
        var codeLang = '';
        var codeBuffer = [];
        var inTable = false;
        var tableBuffer = [];

        function flushCode() {
            if (!inCode) return;
            if (codeLang === 'mermaid') {
                html += '<div class="mermaid">' + escapeHtml(codeBuffer.join('\n')) + '</div>\n';
            } else {
                html += '<pre><code class="language-' + (codeLang || 'text') + '">' + escapeHtml(codeBuffer.join('\n')) + '</code></pre>\n';
            }
            inCode = false;
            codeLang = '';
            codeBuffer = [];
        }

        function flushTable() {
            if (!inTable || tableBuffer.length < 2) return;
            html += '<table>\n<thead><tr>';
            var headers = tableBuffer[0].split('|').map(function (s) { return s.trim(); }).filter(Boolean);
            headers.forEach(function (h) { html += '<th>' + inlineRender(h) + '</th>'; });
            html += '</tr></thead>\n<tbody>\n';
            for (var i = 2; i < tableBuffer.length; i++) {
                html += '<tr>';
                var cells = tableBuffer[i].split('|').map(function (s) { return s.trim(); }).filter(Boolean);
                cells.forEach(function (c) { html += '<td>' + inlineRender(c) + '</td>'; });
                html += '</tr>\n';
            }
            html += '</tbody>\n</table>\n';
            inTable = false;
            tableBuffer = [];
        }

        function escapeHtml(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        function inlineRender(str) {
            return escapeHtml(str)
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/\*([^*]+)\*/g, '<em>$1</em>');
        }

        function blockRender(line) {
            if (/^#{1,6}\s+/.test(line)) {
                var level = line.match(/^(#{1,6})\s+/)[1].length;
                var text = line.replace(/^#{1,6}\s+/, '');
                return '<h' + level + '>' + inlineRender(text) + '</h' + level + '>';
            }
            if (/^\s*>\s*(.*)/.test(line)) {
                return '<blockquote><p>' + inlineRender(line.replace(/^\s*>\s*/, '')) + '</p></blockquote>';
            }
            if (/^\s*[-*+]\s+/.test(line)) {
                return '<li>' + inlineRender(line.replace(/^\s*[-*+]\s+/, '')) + '</li>';
            }
            if (/^\s*\d+\.\s+/.test(line)) {
                return '<li>' + inlineRender(line.replace(/^\s*\d+\.\s+/, '')) + '</li>';
            }
            return '<p>' + inlineRender(line) + '</p>';
        }

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            if (/^```/.test(line)) {
                if (inCode) {
                    flushCode();
                } else {
                    flushTable();
                    inCode = true;
                    codeLang = line.replace(/^```\s*/, '').trim();
                }
                continue;
            }

            if (inCode) {
                codeBuffer.push(line);
                continue;
            }

            if (/^\|/.test(line)) {
                inTable = true;
                tableBuffer.push(line);
                continue;
            } else {
                flushTable();
            }

            if (/^\s*$/.test(line)) {
                continue;
            }

            html += blockRender(line) + '\n';
        }
        flushCode();
        flushTable();

        // Wrap consecutive list items
        html = html.replace(/(<li>[^<]*<\/li>\n)+/g, function (match) {
            return '<ul>\n' + match + '</ul>\n';
        });

        return html;
    }

    initTheme();

    function mermaidFallback(list) {
        list.forEach(function (el) {
            if (el.getAttribute('data-fb')) return;
            el.setAttribute('data-fb', '1');
            var pre = document.createElement('pre');
            pre.textContent = el.textContent;
            el.parentNode.replaceChild(pre, el);
        });
    }
    function runMermaid(diagrams) {
        diagrams.forEach(function (el, i) { el.id = 'mmd-' + i; });
        try {
            mermaid.initialize({ startOnLoad: false, theme: 'neutral', flowchart: { htmlLabels: true } });
            mermaid.run({ querySelector: '#docContent .mermaid' });
        } catch (e) { mermaidFallback(diagrams); }
    }
    var sourceEl = document.getElementById('docSource');
    var contentEl = document.getElementById('docContent');
    if (sourceEl && contentEl) {
        var src = sourceEl.textContent;
        contentEl.innerHTML = renderMarkdown(src);
        var diagrams = contentEl.querySelectorAll('.mermaid');
        if (diagrams.length) {
            if (window.mermaid) { runMermaid(diagrams); }
            else {
                var ms = document.createElement('script');
                ms.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.3/dist/mermaid.min.js';
                ms.onload = function () { if (window.mermaid) { runMermaid(diagrams); } else { mermaidFallback(diagrams); } };
                ms.onerror = function () { mermaidFallback(diagrams); };
                document.head.appendChild(ms);
                setTimeout(function () { if (!window.mermaid) { mermaidFallback(diagrams); } }, 8000);
            }
        }
    }
})();
