/* EAIC 原型 · 全局 mock 数据（企业：龙岗数据，用户：苏尚） */
window.EAIC = window.EAIC || {};

EAIC.data = {

    /* 当前登录用户：苏尚 */
    currentUser: {
        name: '苏尚',
        initial: '苏',
        email: 'sushang@longgangdata.com',
        nickname: '尚尚',
        position: '高级工程师',
        department: '研发部/后端组/基础架构',
        gender: '男',
        phone: '138****8888',
        role: '管理员',
        status: 'online'
    },

    /* 当前组织：龙岗数据 */
    currentOrg: {
        name: '龙岗数据',
        initial: '龙',
        url: 'https://longgangdata.eaic.io'
    },

    /* 已添加组织列表（MVP 仅单组织在线，支持列表展示与切换） */
    orgs: [
        { name: '龙岗数据', initial: '龙', url: 'https://longgangdata.eaic.io', current: true, role: '管理员', status: '当前' },
        { name: '深圳湾实验室', initial: '深', url: 'https://szwlab.eaic.io', current: false, role: '成员', status: '离线' }
    ],

    /* 托盘未读消息列表（TrayModel，最多展示 5 条，mention 优先，按时间倒序） */
    unreadTotal: 8,
    unreadItems: [
        { sender: '李四', initial: '李', channelType: 'dm', preview: '周报模板我已经更新到 AI 表格里了，今天下午三点前请大家补完各自负责的部分。', unread: 3, time: '14:32', mention: true },
        { sender: '产品评审群', initial: '产', channelType: 'group', preview: '王五：明天上午十点评审新版原型，记得提前看一遍。', unread: 2, time: '13:58', mention: true },
        { sender: '王五', initial: '王', channelType: 'dm', preview: '好的，那我先按这个方案改。', unread: 1, time: '12:20', mention: false },
        { sender: '研发部大群', initial: '研', channelType: 'group', preview: '赵六：今晚 20:00 发布窗口，请大家提前合入代码。', unread: 1, time: '11:05', mention: false },
        { sender: '钱七', initial: '钱', channelType: 'dm', preview: '收到，谢谢！', unread: 1, time: '09:41', mention: false }
    ],

    /* 设置默认值 */
    settingsDefaults: {
        desktopNotify: true,
        notifySound: true,
        emailNotify: '跟随服务端',
        keywords: '苏尚 @all @channel',
        messagePreview: true,
        theme: '跟随系统',
        language: '简体中文',
        timezone: '跟随系统',
        showOnlineStatus: true,
        autoStart: false,
        minimizeToTray: true,
        downloadPath: '/Users/sushang/Downloads',
        cacheSize: '128 MB'
    },

    /* WebView 占位映射（龙岗数据） */
    webviews: {
        chat:     { tag: 'WebView', name: 'Mattermost · 聊天',   url: 'https://longgangdata.eaic.io/mattermost/channels/town-square' },
        contacts: { tag: 'WebView', name: 'Mattermost · 通讯录', url: 'https://longgangdata.eaic.io/mattermost/directory' },
        tables:   { tag: 'WebView', name: 'Teable · AI 表格',    url: 'https://longgangdata.eaic.io/teable/workspace' },
        kanban:   { tag: 'BFF 页面', name: '督办 · 事项看板',     url: 'https://longgangdata.eaic.io/supervision/kanban' }
    }
};
