/**
 * 生命不息·学习不止 - 博客交互
 */

(function () {
    // ===== 主题数据（带最后更新日期和链接）=====
    const topicsData = [
        { name: "Linux 命令", icon: "🐧", desc: "常用命令、脚本、系统管理技巧，提升运维效率。", tag: "基础必备", lastUpdate: "2025-05-20", link: "posts/linux-basic.html" },
        { name: "SSH 远程连接 Linux", icon: "🔐", desc: "免密登录、端口转发、安全配置与多服务器管理。", tag: "网络·安全", lastUpdate: "2025-05-18", link: "posts/ssh-guide.html" },
        { name: "Docker 容器技术", icon: "🐳", desc: "镜像构建、容器编排、Docker Compose 实战。", tag: "容器化", lastUpdate: "2025-05-15", link: "posts/docker-guide.html" },
        { name: "Nginx 服务部署", icon: "⚙️", desc: "反向代理、负载均衡、HTTPS配置与性能调优。", tag: "Web服务器", lastUpdate: "2025-05-12", link: "posts/nginx-guide.html" },
        { name: "Git 版本控制", icon: "🌿", desc: "协作流程、分支策略、提交规范与高级技巧。", tag: "版本管理", lastUpdate: "2025-05-10", link: "posts/git-guide.html" },
        { name: "Markdown 文档书写", icon: "📝", desc: "优雅排版、扩展语法、文档自动化与写作规范。", tag: "写作利器", lastUpdate: "2025-05-08", link: "posts/markdown-guide.html" },
        { name: "前端基础", icon: "🎨", desc: "HTML5/CSS3/JavaScript 核心概念与框架初探。", tag: "前端入门", lastUpdate: "2025-05-05", link: "posts/frontend-basic.html" },
        { name: "日语学习", icon: "🗾", desc: "文法词汇、日常会话、JLPT备考与学习资源。", tag: "语言学习", lastUpdate: "2025-05-01", link: "courses/japanese/index.html" }
    ];

    const goalsData = [
        { emoji: "📌", title: "记录要点", text: "记录学习过程中的要点和经验" },
        { emoji: "🧠", title: "整理能力", text: "提高知识的整理能力，结构化输出" },
        { emoji: "📚", title: "快速复习", text: "为后续复习提供快速查阅的资料库" },
        { emoji: "🤝", title: "分享技巧", text: "分享实用技巧和规范写法，共同进步" }
    ];

    // 精选内容（日语学习固定显示，其他按顺序取前3个）
    const japaneseTopic = topicsData.find(item => item.name === "日语学习");
    const otherTopics = topicsData.filter(item => item.name !== "日语学习").slice(0, 3);
    const featuredData = japaneseTopic ? [japaneseTopic, ...otherTopics] : topicsData.slice(0, 4);

    // 格式化日期
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }

    // 渲染卡片（通用）
    function renderCards(containerId, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '';
        data.forEach(item => {
            // 添加 data-link 属性，存储文章链接
            const linkAttr = item.link ? `data-link="${item.link}"` : '';
            html += `
                <div class="topic-card" data-topic="${item.name}" ${linkAttr}>
                    <div class="topic-icon">${item.icon}</div>
                    <h3>${item.name}</h3>
                    <p>${item.desc}</p>
                    <span class="topic-tag">${item.tag}</span>
                    <div class="card-footer">
                        <span class="update-date">📅 更新于 ${formatDate(item.lastUpdate)}</span>
                        <span class="read-more">阅读 →</span>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;

        // 绑定点击事件 - 支持跳转
        document.querySelectorAll(`#${containerId} .topic-card`).forEach(card => {
            card.addEventListener('click', () => {
                const link = card.getAttribute('data-link');
                const title = card.querySelector('h3')?.innerText || '主题';
                
                if (link && link !== '') {
                    // 有链接时直接跳转
                    window.location.href = link;
                } else {
                    // 没有链接时，根据页面类型处理
                    if (options.isHome) {
                        // 主页没有链接，跳转到全部内容页并记住要看的主题
                        window.location.href = `topics.html?topic=${encodeURIComponent(title)}`;
                    } else {
                        alert(`📖 “${title}” 文章正在编写中，敬请期待！`);
                    }
                }
            });
        });
    }

    // ===== 暗色模式 =====
    const THEME_KEY = 'blog-theme';

    function initTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        applyTheme(theme);
    }

    function applyTheme(theme) {
        const html = document.documentElement;
        const toggleBtn = document.getElementById('themeToggle');
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
            if (toggleBtn) toggleBtn.textContent = '☀️';
        } else {
            html.setAttribute('data-theme', 'light');
            if (toggleBtn) toggleBtn.textContent = '🌙';
        }
        localStorage.setItem(THEME_KEY, theme);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    }

    // ===== 主页专属：右侧指示器 =====
    function initScrollIndicator() {
        const sections = ['welcome', 'featured', 'goals', 'usage'];
        const dots = document.querySelectorAll('.indicator-dot');
        if (dots.length === 0) return;

        function updateActiveDot() {
            const scrollPos = window.scrollY + window.innerHeight / 3;
            dots.forEach((dot, i) => {
                const section = document.getElementById(sections[i]);
                if (section) {
                    const top = section.offsetTop;
                    const bottom = top + section.offsetHeight;
                    if (scrollPos >= top && scrollPos < bottom) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                }
            });
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                const section = document.getElementById(sections[i]);
                if (section) section.scrollIntoView({ behavior: 'smooth' });
            });
        });

        window.addEventListener('scroll', updateActiveDot);
        updateActiveDot();
    }

    // ===== 移动端菜单 =====
    function initMobileMenu() {
        const btn = document.getElementById('mobileMenuBtn');
        const nav = document.getElementById('navLinks');
        if (btn && nav) {
            btn.addEventListener('click', () => nav.classList.toggle('active'));
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => nav.classList.remove('active'));
            });
        }
    }

    // ===== 平滑滚动（仅主页锚点需要）=====
    function initSmoothScroll() {
        document.querySelectorAll('.nav-links a, .scroll-hint, .view-all').forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    const id = href.substring(1);
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ===== 返回顶部 =====
    function initBackToTop() {
        const btn = document.getElementById('scrollTopBtn');
        if (!btn) return;
        window.addEventListener('scroll', () => {
            btn.classList.toggle('show', window.scrollY > 400);
        });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ===== 主页滚动提示 =====
    function initScrollHint() {
    const hint = document.getElementById('scrollHint');
    if (hint) {
        hint.addEventListener('click', () => {
            document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

    // ===== 渲染目标卡片（主页）=====
    function renderGoals() {
        const container = document.getElementById('goalsWrapper');
        if (!container) return;

        let html = '';
        goalsData.forEach(goal => {
            html += `
                <div class="goal-item">
                    <div class="emoji">${goal.emoji}</div>
                    <h4>${goal.title}</h4>
                    <p>${goal.text}</p>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // ===== 全部内容页面：渲染全部卡片 =====
    function renderAllTopics() {
        const container = document.getElementById('allTopicsGrid');
        if (!container) return;

        renderCards('allTopicsGrid', topicsData, { isHome: false });

        const statsBar = document.getElementById('statsBar');
        if (statsBar) {
            statsBar.innerHTML = `
                <div class="stats-count">
                    📚 共 <span>${topicsData.length}</span> 个学习主题
                </div>
                <div class="stats-count">
                    🏷️ 涵盖 <span>${new Set(topicsData.map(t => t.tag)).size}</span> 个领域
                </div>
                <div class="stats-count">
                    🔄 最后更新 <span>${formatDate(topicsData[0].lastUpdate)}</span>
                </div>
            `;
        }
    }

    // ===== 更新页脚年份 =====
    function updateYear() {
        const yearEl = document.querySelector('.footer .copyright');
        if (yearEl) {
            const year = new Date().getFullYear();
            yearEl.innerHTML = yearEl.innerHTML.replace('2025', year);
        }
    }

    // ===== 页面初始化 =====
    function init() {
        initTheme();
        updateYear();
        initMobileMenu();
        initBackToTop();

        const isHomePage = document.getElementById('featuredGrid') !== null;
        const isTopicsPage = document.getElementById('allTopicsGrid') !== null;

        if (isHomePage) {
            renderCards('featuredGrid', featuredData, { isHome: true });
            renderGoals();
            initScrollIndicator();
            initScrollHint();
            initSmoothScroll();
        } else if (isTopicsPage) {
            renderAllTopics();
        }

        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);

        console.log('📘 博客已加载 - ' + (isHomePage ? '主页' : (isTopicsPage ? '全部内容页' : '其他')));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();