/* EAIC 原型 · 页面辅助脚本（ES5，无模块） */
window.EAIC = window.EAIC || {};

EAIC.proto = (function () {

    /* 门户 iframe 自适应高度 */
    function autoHeight(frame) {
        function fit() {
            var top = frame.getBoundingClientRect().top;
            frame.style.height = Math.max(320, window.innerHeight - top) + 'px';
        }
        window.addEventListener('resize', fit);
        fit();
    }

    /* 门户导航：点击加载 iframe + 高亮当前链接 + 更新信息面板
     * pages: [{ path, label, group }]
     */
    function bindPortal(navEl, frame, infoEl, pages) {
        function select(link) {
            var links = navEl.querySelectorAll('.pnav-link');
            for (var i = 0; i < links.length; i++) links[i].classList.remove('active');
            link.classList.add('active');
            frame.src = link.getAttribute('data-path');
            var p = null;
            for (var j = 0; j < pages.length; j++) {
                if (pages[j].path === link.getAttribute('data-path')) p = pages[j];
            }
            if (p && infoEl) {
                infoEl.innerHTML = '<div class="ann-kicker">当前页面</div><h2>' + p.label + '</h2>'
                    + '<div class="p-path">' + p.path + '</div>'
                    + '<p>分组：' + p.group + '</p>'
                    + '<p>每个页面右下角的「PR 说明」面板包含该页面的业务规则引用与设计说明，可点击折叠。</p>'
                    + '<p>导航已全部改为真实相对链接，可直接用浏览器打开单个页面。</p>';
            }
        }
        navEl.addEventListener('click', function (e) {
            var t = e.target;
            while (t && t !== navEl && !(t.classList && t.classList.contains('pnav-link'))) t = t.parentNode;
            if (t && t.classList && t.classList.contains('pnav-link')) {
                e.preventDefault();
                select(t);
            }
        });
        var first = navEl.querySelector('.pnav-link');
        if (first) select(first);
    }

    /* 侧滑抽屉：bindDrawer({ open: '.selector', drawer: '#id', backdrop: '#id', close: '.selector' }) */
    function bindDrawer(cfg) {
        var drawer = document.querySelector(cfg.drawer);
        var backdrop = document.querySelector(cfg.backdrop);
        if (!drawer || !backdrop) return;
        function open() { drawer.classList.add('open'); backdrop.classList.add('open'); }
        function close() { drawer.classList.remove('open'); backdrop.classList.remove('open'); }
        var opens = document.querySelectorAll(cfg.open);
        for (var i = 0; i < opens.length; i++) opens[i].addEventListener('click', open);
        var closes = document.querySelectorAll(cfg.close);
        for (var k = 0; k < closes.length; k++) closes[k].addEventListener('click', close);
        backdrop.addEventListener('click', close);
    }

    /* 拦截子页面内所有本地链接，通过 postMessage 交给门户统一导航，
     * 保证左侧目录高亮与右侧 PRD 面板同步。
     */
    function bindPortalLinks() {
        document.addEventListener('click', function (e) {
            var a = e.target.closest('a');
            if (!a) return;
            var href = a.getAttribute('href') || '';
            if (!href) return;
            // 外部链接、邮件、脚本、锚点、target="_top" 保持默认行为
            if (/^(https?:|mailto:|javascript:|#)/.test(href)) return;
            if (a.getAttribute('target') === '_top') return;
            // 计算以 html-mockups 根为基准的绝对路径
            var abs;
            try {
                abs = new URL(href, window.location.href).href;
            } catch (err) {
                return;
            }
            var base;
            try {
                base = new URL('../../', window.location.href).href;
            } catch (err) {
                return;
            }
            if (abs.indexOf(base) !== 0) return;
            var path = abs.substring(base.length);
            if (!path || path.indexOf('pages/') !== 0) return;
            window.parent.postMessage({ type: 'eaic-navigate', path: path }, '*');
            e.preventDefault();
        });
    }

    /* 把页面渲染进 #win 容器 */
    function mount(html) {
        document.getElementById('win').innerHTML = html;
        bindPortalLinks();
    }

    return {
        autoHeight: autoHeight,
        bindPortal: bindPortal,
        bindDrawer: bindDrawer,
        bindPortalLinks: bindPortalLinks,
        mount: mount
    };
})();
