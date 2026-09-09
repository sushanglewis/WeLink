/* EAIC 原型 · 共享 UI 构件（全部返回 HTML 字符串，ES5 语法，无模块）
 * base 参数 = 当前页面到 pages/ 目录的相对前缀：
 *   pages/<group>/x.html → '../'；tray/x.html → '../pages/'
 */
window.EAIC = window.EAIC || {};

EAIC.ui = (function () {

    function D() { return EAIC.data; }

    /* ---------- 基础构件 ---------- */

    function badge(n) {
        return n ? '<span class="badge">' + n + '</span>' : '';
    }

    function avatar(initials, status, sm) {
        return '<div class="avatar' + (sm ? ' sm' : '') + '">' + initials
            + (status ? '<span class="status-dot' + (status === 'online' ? '' : ' ' + status) + '"></span>' : '')
            + '</div>';
    }

    function titleBar() {
        // 应用外壳标题栏由门户级 .mac-titlebar 统一提供，页面内部不再重复渲染
        return '';
    }

    function sidebar(active, opts) {
        opts = opts || {};
        var base = opts.base || '../';
        var items = [
            ['chat', '聊天', opts.badge || 0],
            ['contacts', '通讯录', 0],
            ['tables', 'AI 表格', 0],
            ['kanban', '事项看板', 0]
        ];
        var html = '<div class="sidebar"><div class="side-nav">';
        items.forEach(function (it) {
            html += '<a class="side-item' + (active === it[0] ? ' active' : '') + '" href="'
                + base + 'main/' + it[0] + '.html">' + it[1] + badge(it[2]) + '</a>';
        });
        var u = D().currentUser;
        html += '</div><a class="userbar" href="' + base + 'overlays/avatar-menu.html">'
            + avatar(u.initial, u.status) + '<div class="u-name">' + u.name + '</div></a></div>';
        return html;
    }

    /* opts: { active, badge, base, overlay } */
    function frameMain(contentHtml, opts) {
        opts = opts || {};
        return titleBar()
            + '<div class="appbody">'
            + sidebar(opts.active || '', opts)
            + '<div class="app-main">' + contentHtml + '</div>'
            + '</div>'
            + (opts.overlay || '');
    }

    /* ---------- WebView 占位 ---------- */

    function wvPlaceholder(kind) {
        var m = D().webviews[kind];
        return '<div class="wv"><div class="wv-body"><div class="wv-placeholder">'
            + '<div class="wv-tag">' + m.tag + '</div>'
            + '<div class="wv-name">' + m.name + '</div>'
            + '<div class="wv-url">' + m.url + '</div>'
            + '</div></div></div>';
    }

    function wvLoading() {
        return '<div class="wv"><div class="wv-body">'
            + '<div class="wv-placeholder" style="border-style:solid;background:var(--surface)">'
            + '<div class="spinner"></div>'
            + '<div class="wv-name" style="font-size:14px;font-weight:400">正在加载…</div>'
            + '</div></div></div>';
    }

    function wvError() {
        return '<div class="wv"><div class="wv-body">'
            + '<div class="wv-placeholder" style="border-style:solid;background:var(--surface)">'
            + '<div class="wv-name">页面加载失败</div>'
            + '<div class="wv-error-code">ERR_CONNECTION_REFUSED</div>'
            + '<div class="wv-actions">'
            + '<a class="btn primary sm" style="width:auto" href="webview-loading.html">重试</a>'
            + '<a class="btn default sm" href="chat.html">返回首页</a>'
            + '</div></div></div></div>';
    }

    function wvOfflineBanner() {
        return '<div class="wv-offline-banner">网络连接已断开，正在尝试重连…</div>';
    }

    function wvOffline(kind) {
        var m = D().webviews[kind];
        return '<div class="wv">' + wvOfflineBanner()
            + '<div class="wv-body"><div class="wv-placeholder">'
            + '<div class="wv-tag">' + m.tag + '</div>'
            + '<div class="wv-name">' + m.name + '</div>'
            + '<div class="wv-url">' + m.url + '</div>'
            + '</div></div></div>';
    }

    /* ---------- 设置行构件 ---------- */

    function row(label, control) {
        return '<div class="set-row"><div class="sr-label">' + label + '</div><div>' + control + '</div></div>';
    }

    function sw(label, checked) {
        return row(label, '<label class="switch"><input type="checkbox"' + (checked ? ' checked' : '')
            + '><span class="track"></span></label>');
    }

    function select(label, options, value) {
        var h = '<select>';
        options.forEach(function (o) {
            h += '<option' + (o === value ? ' selected' : '') + '>' + o + '</option>';
        });
        return row(label, h + '</select>');
    }

    function ro(label, value) {
        return row(label + ' <span class="ro-tag">只读</span>', '<span class="sr-value">' + value + '</span>');
    }

    /* ---------- 设置页二级导航（独立页，BR-034） ---------- */

    function settingsNav(active, base) {
        base = base || '../';
        var groups = [
            { label: '个人设置', items: [
                ['profile', '账号信息'], ['notifications', '通知'], ['display', '显示'], ['security', '安全']
            ]},
            { label: '系统设置', items: [
                ['general', '通用'], ['advanced', '高级']
            ]},
            { label: '应用专属', items: [
                ['app-bridge', '桥接规则说明', true]
            ]}
        ];
        var h = '<div class="page-side">'
            + '<a class="ps-back" href="' + base + 'main/chat.html">&#8249; 返回</a>'
            + '<div class="ps-title">设置</div>';
        groups.forEach(function (g) {
            h += '<div class="ps-group">' + g.label + '</div>';
            g.items.forEach(function (it) {
                if (it[2]) {
                    h += '<span class="ps-item disabled" title="详见 prd-app-settings-bridge.html">' + it[1] + '</span>';
                } else {
                    h += '<a class="ps-item' + (active === it[0] ? ' active' : '') + '" href="'
                        + base + 'settings/' + it[0] + '.html">' + it[1] + '</a>';
                }
            });
        });
        return h + '</div>';
    }

    function settingsPage(active, title, bodyHtml, footHtml) {
        return '<div class="page">' + settingsNav(active, '../')
            + '<div class="page-main">'
            + '<div class="page-head"><h2>' + title + '</h2></div>'
            + '<div class="page-body"><div class="col">' + bodyHtml + '</div></div>'
            + (footHtml ? '<div class="page-foot">' + footHtml + '</div>' : '')
            + '</div></div>';
    }

    /* ---------- 托盘构件 ---------- */

    function trayIcon(unread) {
        return '<div class="app-logo">E</div>' + (unread ? '<span class="tray-badge">' + unread + '</span>' : '');
    }

    function trayUnreadItem(it, base) {
        return '<a class="tr-un" href="' + base + 'main/chat.html">'
            + avatar(it.initial, null, true)
            + '<div class="u-main"><div class="u-top"><span class="u-name">' + it.sender + '</span>'
            + badge(it.unread)
            + '<span class="u-time">' + it.time + '</span></div>'
            + '<div class="u-preview">' + (it.mention ? '<span style="color:var(--error)">[@我] </span>' : '') + it.preview + '</div>'
            + '</div></a>';
    }

    /* base = 当前页面到 pages/ 的相对前缀（tray/ 下为 '../pages/'） */
    function trayMenu(hasUnread, base) {
        var h = '<div class="menu">';
        if (hasUnread) {
            D().unreadItems.slice(0, 5).forEach(function (it) { h += trayUnreadItem(it, base); });
        } else {
            h += '<div class="tr-empty">暂无未读消息</div>';
        }
        h += '<div class="divider"></div>'
            + '<a class="mi" href="' + base + 'main/chat.html">打开 EAIC</a>'
            + '<div class="divider"></div>'
            + '<div class="mi danger">退出 EAIC</div>'
            + '</div>';
        return h;
    }

    /* ---------- 弹层构件 ---------- */

    function avatarMenu(base) {
        var u = D().currentUser;
        return '<a class="overlay-clear" href="' + base + 'main/chat.html"></a>'
            + '<div class="menu pop" style="left:12px;bottom:64px">'
            + '<div class="menu-head">' + avatar(u.initial, u.status)
            + '<div><div class="m-name">' + u.name + '</div><div class="m-mail">' + u.email + '</div></div></div>'
            + '<div class="mi"><span class="dot green"></span>在线<span class="mi-right"><span class="check">&#10003;</span></span></div>'
            + '<div class="mi"><span class="dot yellow"></span>离开</div>'
            + '<div class="mi"><span class="dot red"></span>勿扰</div>'
            + '<div class="mi"><span class="dot gray"></span>离线</div>'
            + '<div class="divider"></div>'
            + '<a class="mi" href="' + base + 'settings/profile.html">个人设置</a>'
            + '<a class="mi" href="' + base + 'settings/general.html">系统设置</a>'
            + '<a class="mi" href="' + base + 'org/org-list.html">组织管理</a>'
            + '<a class="mi" href="' + base + 'overlays/about.html">关于 EAIC</a>'
            + '<div class="divider"></div>'
            + '<a class="mi danger" href="' + base + 'onboarding/login.html">退出登录</a>'
            + '</div>';
    }

    function toastHtml(base) {
        return '<a class="toast" href="' + base + 'main/chat.html">'
            + avatar('李', null, true)
            + '<div style="min-width:0">'
            + '<div><span class="t-title">李四 - EAIC</span><span class="t-app">EAIC</span></div>'
            + '<div class="t-body">周报模板我已经更新到 AI 表格里了，今天下午三点前请大家补完各自负责的部分。</div>'
            + '</div><div class="t-close">&#10005;</div></a>';
    }

    function aboutDialog(base) {
        var org = D().currentOrg;
        return '<a class="overlay-backdrop" href="' + base + 'main/chat.html" style="display:block"></a>'
            + '<div class="about-dialog">'
            + '<div style="display:flex;justify-content:center"><div class="app-logo lg">E</div></div>'
            + '<div class="a-name">EAIC</div>'
            + '<div class="a-ver">版本 1.0.0（Build 20260727）</div>'
            + '<div class="a-org">' + org.name + '</div>'
            + '<div class="a-copy">&copy; 2026 ' + org.name + ' 保留所有权利</div>'
            + '<div class="a-links"><a class="link">第三方开源许可声明</a></div>'
            + '<div class="a-it">IT 支持：it-support@longgangdata.com</div>'
            + '</div>';
    }

    return {
        badge: badge,
        avatar: avatar,
        titleBar: titleBar,
        sidebar: sidebar,
        frameMain: frameMain,
        wvPlaceholder: wvPlaceholder,
        wvLoading: wvLoading,
        wvError: wvError,
        wvOffline: wvOffline,
        wvOfflineBanner: wvOfflineBanner,
        row: row,
        sw: sw,
        select: select,
        ro: ro,
        settingsNav: settingsNav,
        settingsPage: settingsPage,
        trayIcon: trayIcon,
        trayMenu: trayMenu,
        trayUnreadItem: trayUnreadItem,
        avatarMenu: avatarMenu,
        toastHtml: toastHtml,
        aboutDialog: aboutDialog
    };
})();
