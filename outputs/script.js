/* =========================================================
   帅栈 · Site interactions and article data
   To add a post, append an object to the POSTS array below.
   ========================================================= */

let POSTS = [
  {
    slug: "build-your-own-tech-blog",
    title: "从零搭建一个真正属于你的技术博客",
    excerpt: "博客不只是一个展示页。它是你的知识资产、思考轨迹，也是与世界建立连接的入口。",
    category: "前端开发",
    date: "2026-10-24",
    readTime: "12 分钟阅读",
    featured: true,
    coverWord: "MAKE<br>IT<br>YOURS",
    body: `
      <p>很多人想做一个博客，第一反应是先选框架、找模板、配置主题。但真正决定一个博客能否长期存在的，往往不是技术栈，而是你能否回答三个问题：写给谁看、准备写什么、愿意用什么方式持续维护。</p>
      <p>这篇笔记记录的是一条更实际的路径：先建立最小可用的内容系统，再逐步加入视觉、搜索、订阅和部署。它不追求一次做到完美，而是让网站尽快开始承载你的思考。</p>

      <h2>先定义博客，而不是定义技术栈</h2>
      <p>“个人技术博客”至少可以是三种完全不同的东西：</p>
      <ul>
        <li><strong>作品集：</strong>用项目证明你能做什么，重点是结果和过程。</li>
        <li><strong>知识库：</strong>沉淀学习记录、技术方案和踩坑经验，重点是可检索。</li>
        <li><strong>公开写作：</strong>表达观点并与读者建立连接，重点是持续更新。</li>
      </ul>
      <p>三者可以融合，但一定有一个是第一阶段的核心。如果没有目标，海量的主题选择和插件功能只会让项目停在配置阶段。</p>
      <blockquote>一个只有三篇真实文章的上线博客，价值远高于一个拥有完美设计却始终没有内容的草稿。</blockquote>

      <h2>选择最轻、最可控的起点</h2>
      <p>如果你正在学习网页开发，我建议从「静态 HTML + CSS + JavaScript」开始。它几乎零依赖，浏览器打开就能看，部署到 GitHub Pages、Vercel 或 Netlify 都很直接，也足够承载一个个人博客。</p>
      <p>当文章数量增长、需要 Markdown 写作或构建期优化时，再迁移到 Astro、Hugo 或 Next.js。此时你已经知道自己真正需要什么，迁移是自然的升级，而不是提前制造复杂度。</p>
      <pre><code>&lt;article&gt;
  &lt;header&gt;
    &lt;p&gt;2026 · 技术笔记&lt;/p&gt;
    &lt;h1&gt;文章标题&lt;/h1&gt;
  &lt;/header&gt;
  &lt;p&gt;从这里开始写真正有价值的内容。&lt;/p&gt;
&lt;/article&gt;</code></pre>

      <h2>让内容结构先于视觉设计</h2>
      <p>一套简单的文章数据，至少应该包含标题、摘要、分类、日期、阅读时间和正文。把这些字段先想清楚，页面就只是数据的呈现方式。</p>
      <div class="note">
        <span>内容模型建议</span>
        <p>slug 用于稳定链接，title 和 excerpt 用于列表展示，date 用于排序，category 用于归档，body 保存正文。再增加一个 featured 字段，就能轻松维护首页精选。</p>
      </div>
      <p>随着规模增长，你可以把数据迁移到 Markdown frontmatter。字段保持一致，已有的页面和交互仍然能够继续使用。</p>

      <h2>建立三个真正重要的页面</h2>
      <h3>首页：用一句话说明你是谁</h3>
      <p>首页不需要解释所有技术细节。一个明确的个人定位、几句可信的自我介绍，再加上精选项和最新文章，已经足够让陌生读者决定是否继续探索。</p>
      <h3>文章页：让阅读成为唯一重点</h3>
      <p>限制正文宽度、提高行高、给代码块清晰的边界，并在移动端减少装饰元素。好的阅读体验来自大量小决定，而不是堆叠动画。</p>
      <h3>关于页：让文字背后有一个真实的人</h3>
      <p>读者关注的不只是知识，也会关注知识来自怎样的人。写下你的经历、关注方向和正在做的事情，这比一排技能图标更有温度。</p>

      <h2>最后，给写作减少阻力</h2>
      <p>长期更新最大的敌人是发布成本。稳定一个文章模板、固定几个常用分类、提前准备好代码块样式，能让你把注意力放在内容本身。</p>
      <p>也不要等到“写得足够好”再公开。博客的价值来自时间累积：旧文章会修正，观点会成熟，而每一次公开表达都会留下当时的思考痕迹。</p>
      <blockquote><p>先上线，再迭代。你的博客不需要在第一天就完整，它需要从第一天就开始生长。</p></blockquote>
      <p>下一步，是绑定一个属于你的域名，配置 HTTPS 和自动部署。当网址真正属于你，这个空间也就开始成为你长期可以回来的地方。</p>
    `,
  },
  {
    slug: "sustainable-knowledge-system",
    title: "我怎样设计一套可持续的个人知识系统",
    excerpt: "从收集、加工到输出，一套不依赖复杂工具的知识管理方法，以及它如何改变我的学习方式。",
    category: "成长",
    date: "2026-10-18",
    readTime: "9 分钟阅读",
    coverWord: "THINK<br>IN<br>PUBLIC",
    body: `
      <p>知识管理系统最容易出现的问题，不是工具不够强大，而是收集的速度远远超过理解和输出的速度。收藏夹越堆越满，真正能调用的知识却没有增加。</p>
      <h2>从“保存”转向“加工”</h2>
      <p>我现在只保留三种笔记：正在解决的问题、值得反复参考的方法、以及已经形成观点的文章。每一条新信息进入系统前，都要回答它将在哪里被再次使用。</p>
      <p>没有用途的材料宁可暂时不保存。信息本身不是资产，经过验证、连接和表达的信息才是。</p>
      <blockquote>如果一条笔记永远不会被再次打开，它就不是知识，只是占据注意力的库存。</blockquote>
      <h2>一个足够小的闭环</h2>
      <p>我的流程只有四步：捕捉一个问题，围绕问题收集材料，用自己的语言建立结论，最后通过项目或文章公开输出。项目负责检验可行性，文章负责检验表达是否清晰。</p>
      <h2>让工具退到背景</h2>
      <p>目录不必完美，标签不必齐全，系统也不必每天整理。真正重要的是让下一次写作和下一次搜索足够快。如果维护工具的时间超过使用工具的时间，就应该做减法。</p>
      <p>可持续的系统通常并不精致。它只需要足够低的使用门槛，让你在忙碌时也愿意留下一条记录，在好奇时总能找到回来的路。</p>
    `,
  },
  {
    slug: "css-container-queries",
    title: "CSS Container Queries：让组件真正学会适配",
    excerpt: "媒体查询知道窗口有多大，容器查询则知道组件有多少空间。用新的响应式思维重构你的组件。",
    category: "前端开发",
    date: "2026-10-11",
    readTime: "8 分钟阅读",
    coverWord: "THINK<br>IN<br>SPACE",
    body: `
      <p>传统响应式设计主要依赖视口宽度。但组件被放进侧边栏、弹窗或卡片网格后，它对空间的理解不应该继续由整个窗口决定。Container Queries 让样式可以基于父容器的尺寸变化。</p>
      <h2>先声明容器</h2>
      <p>只有明确声明为容器的元素，才能成为子元素查询的参照。使用 <code>container-type: inline-size</code> 可以让容器根据行内尺寸响应。</p>
      <pre><code>.card-list {
  container-type: inline-size;
  container-name: cards;
}

@container cards (min-width: 480px) {
  .card {
    grid-template-columns: 180px 1fr;
  }
}</code></pre>
      <h2>从页面断点转向组件断点</h2>
      <p>现在同一个卡片放进窄侧栏时使用纵向布局，放进宽内容区时自动切换成横向布局。断点表达的是组件需要多少空间，而不是设备属于哪一类。</p>
      <h2>什么时候仍然使用媒体查询</h2>
      <p>页面级导航、全局字体比例和整体布局更适合媒体查询；单个组件的内部结构更适合容器查询。两者不是替代关系，而是不同层级上的工具。</p>
      <blockquote><p>好的响应式不是为更多设备写更多样式，而是让组件在可预期的空间里自然改变。</p></blockquote>
    `,
  },
  {
    slug: "reading-progress-bar",
    title: "用 JavaScript 写一个克制的阅读进度条",
    excerpt: "一个不到 30 行的实用交互：不打扰阅读、兼容减少动态效果偏好，又能准确反映当前进度。",
    category: "前端开发",
    date: "2026-09-29",
    readTime: "6 分钟阅读",
    coverWord: "READ<br>WITH<br>FLOW",
    body: `
      <p>阅读进度条是很小的功能，却很容易暴露实现上的问题。过于敏感会分散注意力，计算错误则会让进度与真实阅读位置脱节。</p>
      <h2>计算真正可滚动的距离</h2>
      <pre><code>const root = document.documentElement;
const maxScroll = root.scrollHeight - root.clientHeight;
const progress = maxScroll > 0 ? root.scrollTop / maxScroll : 0;

bar.style.transform = \`scaleX(\${progress})\`;</code></pre>
      <p>用 <code>transform</code> 更新宽度，比修改 <code>width</code> 更不容易触发布局计算。滚动监听可以配合 <code>requestAnimationFrame</code>，把多次事件合并到同一帧。</p>
      <h2>视觉应该服务于阅读</h2>
      <p>进度条只需要固定在页面顶部，使用一种清晰的强调色。避免渐变闪烁和持续动画，并且尊重用户的 <code>prefers-reduced-motion</code> 设置。</p>
      <div class="note"><span>小提醒</span><p>进度条最好提供 aria-hidden="true"。它表达的是视觉辅助信息，不应被读屏软件当作主要内容重复朗读。</p></div>
      <h2>细节决定是否“克制”</h2>
      <p>在页面顶部时隐藏、超过内容区时停止增长、移动端保持足够细的尺寸。一个合格的工具型交互，应该让用户感受到帮助，而不是持续注意到它的存在。</p>
    `,
  },
  {
    slug: "writing-makes-thinking-clear",
    title: "代码之外：技术写作如何让思路变清晰",
    excerpt: "写作不只是输出的最后一步。当你尝试解释一个系统时，隐藏的假设会逐一暴露出来。",
    category: "工程实践",
    date: "2026-09-16",
    readTime: "7 分钟阅读",
    coverWord: "WRITE<br>TO<br>THINK",
    body: `
      <p>写代码时，我们很容易把“能运行”当成“已经理解”。但当你试着向另一个人解释方案，尤其是解释为什么不选另一种做法时，模糊之处会突然变得明显。</p>
      <h2>写作暴露隐藏假设</h2>
      <p>一篇技术方案至少需要说明背景、约束、选择和代价。很多时候，难点并不在于选项本身，而在于团队对目标和约束没有形成一致理解。写下来的过程，就是把这些前提摊开。</p>
      <blockquote>清晰的文档不会让复杂消失，它会告诉你复杂究竟在哪里。</blockquote>
      <h2>从写给未来的自己开始</h2>
      <p>不用一开始就面向大量读者。设想三个月后的你需要重新接手这个项目：哪些信息最重要？哪些决定容易被忘记？哪些看起来很显而易见的前提，其实只是当时的语境？</p>
      <h2>用结构代替文采</h2>
      <p>技术写作最有效的结构通常是：问题是什么、当前约束是什么、考虑过哪些方案、为什么选择它、还有哪些风险。这样的结构让读者可以快速定位信息，也迫使作者完整推演。</p>
      <p>写作不是开发的附属工作。它是设计过程的一部分，是把个人理解转换成团队共同资产的方式。</p>
    `,
  },
  {
    slug: "nodejs-performance-hunt",
    title: "一次 Node.js 性能排查记录：从现象到证据",
    excerpt: "不要靠直觉猜性能问题。用可观测数据、最小复现和逐步排除，找到真正的瓶颈。",
    category: "工程实践",
    date: "2026-08-28",
    readTime: "10 分钟阅读",
    coverWord: "TRACE<br>THE<br>CAUSE",
    body: `
      <p>一次接口响应时间从 80ms 上升到 600ms，团队的第一反应是数据库变慢。但在没有数据之前，任何猜测都可能让排查走向错误方向。</p>
      <h2>先建立问题边界</h2>
      <p>我们记录了三组数据：请求在入口和出口的时间、数据库查询耗时、事件循环延迟。结果发现数据库耗时稳定，而事件循环在高并发下明显阻塞。</p>
      <div class="note"><span>排查原则</span><p>先确认问题发生在哪一层，再深入该层寻找证据。不要同时修改多个变量，否则无法判断哪项改动产生了效果。</p></div>
      <h2>做最小复现</h2>
      <p>将可疑接口从业务框架中剥离，只保留参数处理、数据访问和序列化，复现出相同的趋势。缩小代码范围后，瓶颈最终定位到一段同步 JSON 处理：它在大负载下占用了过多 CPU。</p>
      <h2>优化要能被验证</h2>
      <p>我们把处理拆成流式操作，并补充了稳定的压测脚本。优化后的中位响应时间从 560ms 降到 95ms，事件循环延迟也回到正常范围。</p>
      <blockquote><p>性能排查的核心不是更快地猜，而是更快地获得可靠的证据。</p></blockquote>
      <p>这次排查也改变了团队的排查模板：先画时间线，再列出测量点，最后记录每次实验的假设和结果。工具会换，方法论可以留下。</p>
    `,
  },
];

let RESOURCES = Array.isArray(window.SITE_RESOURCES) ? window.SITE_RESOURCES : [];
let PROJECTS = Array.isArray(window.SITE_PROJECTS) ? window.SITE_PROJECTS : [];

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(date) {
  return date.replaceAll("-", ".");
}

function postUrl(post) {
  return `post.html?slug=${encodeURIComponent(post.slug)}`;
}

function stripHtml(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  return wrapper.textContent || "";
}

function safeLink(url) {
  return /^(https?:\/\/|\/)/i.test(String(url || "")) ? String(url) : "";
}

function renderMarkdown(markdown) {
  if (!markdown) return "";

  const codeBlocks = [];
  const withTokens = String(markdown).replace(/```([a-z0-9-]*)\n([\s\S]*?)```/gi, (_, language, code) => {
    const token = `@@CODE_BLOCK_${codeBlocks.length}@@`;
    codeBlocks.push(
      `<pre><code${language ? ` class="language-${escapeHtml(language)}"` : ""}>${escapeHtml(
        code.trimEnd(),
      )}</code></pre>`,
    );
    return token;
  });

  const lines = withTokens.replaceAll("\r\n", "\n").split("\n");
  const output = [];
  let listType = "";

  const closeList = () => {
    if (listType) output.push(`</${listType}>`);
    listType = "";
  };

  const inline = (value) =>
    escapeHtml(value)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => {
        const safeUrl = safeLink(url);
        return safeUrl ? `<img src="${escapeHtml(safeUrl)}" alt="${alt}" loading="lazy" />` : alt;
      })
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
        const safeUrl = safeLink(url);
        return safeUrl
          ? `<a href="${escapeHtml(safeUrl)}" target="_blank" rel="noreferrer">${label}</a>`
          : label;
      });

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const codeMatch = line.match(/^@@CODE_BLOCK_(\d+)@@$/);
    if (codeMatch) {
      closeList();
      output.push(codeBlocks[Number(codeMatch[1])] || "");
      continue;
    }
    if (!line) {
      closeList();
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length + 1, 4);
      output.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }
    if (line.startsWith("> ")) {
      closeList();
      output.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`);
      continue;
    }
    const unordered = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      const nextType = unordered ? "ul" : "ol";
      if (listType !== nextType) {
        closeList();
        output.push(`<${nextType}>`);
        listType = nextType;
      }
      output.push(`<li>${inline((unordered || ordered)[1])}</li>`);
      continue;
    }
    closeList();
    output.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  return output.join("\n");
}

function formatBody(item) {
  return item.body_format === "markdown" ? renderMarkdown(item.body) : item.body;
}

function renderFeatured() {
  const container = $("[data-featured-post]");
  if (!container) return;

  const post = POSTS.find((item) => item.featured) || POSTS[0];
  container.innerHTML = `
    <article class="feature-card">
      <div class="feature-content">
        <div class="feature-meta">
          <span>${escapeHtml(post.category)}</span>
          <span>${formatDate(post.date)}</span>
          <span>${escapeHtml(post.readTime)}</span>
        </div>
        <h3><a href="${postUrl(post)}">${escapeHtml(post.title)}</a></h3>
        <p>${escapeHtml(post.excerpt)}</p>
        <a class="feature-link" href="${postUrl(post)}">
          READ THE NOTE <span>↗</span>
        </a>
      </div>
      <div class="feature-art" aria-hidden="true">
        <span class="feature-art-number">FIELD NOTE / 001</span>
        <div class="feature-art-ring">
          <span class="feature-art-code">&lt;/&gt;</span>
        </div>
        <span class="feature-art-label">BUILD WITH CARE<br>WRITE WITH CLARITY</span>
      </div>
    </article>
  `;
}

function postRowTemplate(post, index) {
  return `
    <a class="post-row" href="${postUrl(post)}">
      <span class="post-number">${String(index + 1).padStart(2, "0")}</span>
      <div class="post-row-main">
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt)}</p>
      </div>
      <span class="post-category">${escapeHtml(post.category)}</span>
      <span class="post-date">${formatDate(post.date)}</span>
      <span class="post-arrow" aria-hidden="true">↗</span>
    </a>
  `;
}

function renderLatestPosts() {
  const container = $('[data-post-list="latest"]');
  if (!container) return;

  const limit = Number(container.dataset.limit || 4);
  const latestPosts = POSTS.filter((post) => !post.featured).slice(0, limit);
  container.innerHTML = latestPosts.map(postRowTemplate).join("");
}

function renderArchive() {
  const container = $('[data-post-list="archive"]');
  if (!container) return;

  const tabs = $$(".filter-tab");
  const queryInput = $("[data-archive-search]");
  const emptyState = $("[data-archive-empty]");
  let currentCategory = "全部";

  const render = () => {
    const query = (queryInput?.value || "").trim().toLocaleLowerCase("zh-CN");
    const filtered = POSTS.filter((post) => {
      const matchesCategory = currentCategory === "全部" || post.category === currentCategory;
      const haystack = `${post.title} ${post.excerpt} ${post.category}`.toLocaleLowerCase("zh-CN");
      return matchesCategory && haystack.includes(query);
    });

    container.innerHTML = filtered.map(postRowTemplate).join("");
    if (emptyState) emptyState.hidden = filtered.length > 0;
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => {
        item.classList.toggle("is-active", item === tab);
        item.setAttribute("aria-selected", String(item === tab));
      });
      currentCategory = tab.dataset.filter || "全部";
      render();
    });
  });

  queryInput?.addEventListener("input", render);
  $$("[data-topic-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.topicFilter;
      const matchingTab = tabs.find((tab) => tab.dataset.filter === filter);
      matchingTab?.click();
      $(".archive")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  render();
}

function renderResources() {
  const grid = $("[data-resource-grid]");
  const categoriesContainer = $("[data-resource-categories]");
  if (!grid || !categoriesContainer) return;

  const searchInput = $("[data-resource-search]");
  const resultCount = $("[data-resource-result-count]");
  const emptyState = $("[data-resource-empty]");
  const featuredContainer = $("[data-featured-resources]");
  const categories = [...new Set(RESOURCES.map((resource) => resource.category))];
  let activeCategory = "全部";
  let query = "";

  const renderFeatured = () => {
    if (!featuredContainer) return;
    const preferredNames = ["Eclipse Temurin", "IntelliJ IDEA", "JetBrains 学生包", "MySQL Community"];
    const featured = preferredNames
      .map((name) => RESOURCES.find((resource) => resource.name === name))
      .filter(Boolean);
    featuredContainer.innerHTML = featured
      .map(
        (resource, index) => `
          <a class="featured-resource" href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer">
            <span class="featured-resource-index">0${index + 1} / ${escapeHtml(resource.type)}</span>
            <h3>${escapeHtml(resource.name)}</h3>
            <p>${escapeHtml(resource.description)}</p>
            <span class="featured-resource-link" aria-hidden="true">↗</span>
          </a>
        `,
      )
      .join("");
  };

  const renderCategories = () => {
    const allCategories = ["全部", ...categories];
    categoriesContainer.innerHTML = allCategories
      .map((category) => {
        const count =
          category === "全部"
            ? RESOURCES.length
            : RESOURCES.filter((resource) => resource.category === category).length;
        return `
          <button
            class="resource-category${category === activeCategory ? " is-active" : ""}"
            type="button"
            data-resource-category="${escapeHtml(category)}"
          >
            ${escapeHtml(category)} <span>${String(count).padStart(2, "0")}</span>
          </button>
        `;
      })
      .join("");

    $$(".resource-category", categoriesContainer).forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.resourceCategory || "全部";
        renderCategories();
        renderGrid();
      });
    });
  };

  const renderGrid = () => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");
    const filtered = RESOURCES.filter((resource) => {
      const matchesCategory = activeCategory === "全部" || resource.category === activeCategory;
      const haystack =
        `${resource.name} ${resource.description} ${resource.category} ${resource.tags.join(" ")}`.toLocaleLowerCase(
          "zh-CN",
        );
      return matchesCategory && haystack.includes(normalizedQuery);
    });

    grid.innerHTML = filtered
      .map(
        (resource) => `
          <article class="resource-card">
            <div class="resource-card-top">
              <span class="resource-card-category">${escapeHtml(resource.category)}</span>
              <span class="resource-card-type">${escapeHtml(resource.type)}</span>
            </div>
            <h3>
              <a href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer">${escapeHtml(resource.name)}</a>
            </h3>
            <p class="resource-card-description">${escapeHtml(resource.description)}</p>
            <div class="resource-card-footer">
              <div class="resource-tags">
                ${resource.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
              </div>
              <a class="resource-open" href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer">
                打开官网 ↗
              </a>
            </div>
          </article>
        `,
      )
      .join("");

    if (resultCount) resultCount.textContent = String(filtered.length).padStart(2, "0");
    if (emptyState) emptyState.hidden = filtered.length > 0;
  };

  searchInput?.addEventListener("input", () => {
    query = searchInput.value;
    renderGrid();
  });

  $("[data-ai-filter]")?.addEventListener("click", () => {
    activeCategory = "全部";
    query = "AI";
    if (searchInput) searchInput.value = query;
    renderCategories();
    renderGrid();
    $(".resource-directory-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $$("[data-resource-count]").forEach((node) => {
    node.textContent = String(RESOURCES.length).padStart(2, "0");
  });

  $$("[data-resource-category-count]").forEach((node) => {
    node.textContent = String(categories.length).padStart(2, "0");
  });

  renderFeatured();
  renderCategories();
  renderGrid();
}

function projectUrl(project) {
  return `project.html?slug=${encodeURIComponent(project.slug)}`;
}

function renderProjects() {
  const grid = $("[data-project-grid]");
  if (!grid) return;

  $$("[data-project-count]").forEach((node) => {
    node.textContent = String(PROJECTS.length).padStart(2, "0");
  });

  grid.innerHTML = PROJECTS.map(
    (project, index) => `
      <article class="project-card">
        <a class="project-card-visual${project.cover_image ? " has-image" : ""}" href="${projectUrl(project)}">
          <span class="project-card-number">0${index + 1}</span>
          <span class="project-card-status">${escapeHtml(project.status || "持续构建")}</span>
          ${
            project.cover_image
              ? `<img src="${escapeHtml(safeLink(project.cover_image))}" alt="" />`
              : '<b aria-hidden="true">&lt;/&gt;</b>'
          }
        </a>
        <div class="project-card-copy">
          <span>${escapeHtml(project.tech_stack || "LEARNING PROJECT")}</span>
          <h2><a href="${projectUrl(project)}">${escapeHtml(project.title)}</a></h2>
          <p>${escapeHtml(project.summary)}</p>
          <a class="text-link" href="${projectUrl(project)}">查看项目 <span>↗</span></a>
        </div>
      </article>
    `,
  ).join("");
}

function renderProjectPage() {
  const page = $("[data-project-page]");
  if (!page) return;

  const slug = new URLSearchParams(window.location.search).get("slug");
  const project = PROJECTS.find((item) => item.slug === slug) || PROJECTS[0];
  if (!project) return;

  const index = PROJECTS.indexOf(project);
  const nextProject = PROJECTS[(index + 1) % PROJECTS.length];
  document.title = `${project.title} · 帅栈`;
  const description = $('meta[name="description"]');
  if (description) description.content = project.summary || project.description || "";

  const setText = (selector, value) => {
    const node = $(selector);
    if (node) node.textContent = value || "";
  };
  setText("[data-project-title]", project.title);
  setText("[data-project-summary]", project.summary);
  setText("[data-project-status]", project.status || "持续构建");
  setText("[data-project-cover-mark]", (project.title || "PROJECT").slice(0, 2));

  const cover = $("[data-project-cover]");
  if (cover && project.cover_image) {
    cover.classList.add("has-image");
    cover.style.setProperty("--project-image", `url("${safeLink(project.cover_image)}")`);
  }

  const stack = $("[data-project-stack]");
  if (stack) {
    stack.innerHTML = (project.tech_stack || "")
      .split(/[·,，/]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => `<span>${escapeHtml(item)}</span>`)
      .join("");
  }

  const body = $("[data-project-body]");
  if (body) body.innerHTML = formatBody(project);

  const links = $("[data-project-links]");
  if (links) {
    const items = [];
    if (safeLink(project.project_url)) {
      items.push(`<a class="button button-primary" href="${escapeHtml(safeLink(project.project_url))}" target="_blank" rel="noreferrer">访问项目 <span>↗</span></a>`);
    }
    if (safeLink(project.repo_url)) {
      items.push(`<a class="text-link" href="${escapeHtml(safeLink(project.repo_url))}" target="_blank" rel="noreferrer">查看源码 <span>↗</span></a>`);
    }
    links.innerHTML = items.join("");
  }

  const next = $("[data-project-next]");
  if (next && nextProject) {
    next.innerHTML = `
      <a class="next-card" href="${projectUrl(nextProject)}">
        <div>
          <p class="eyebrow">${escapeHtml(nextProject.status || "PROJECT")} / ${escapeHtml(nextProject.tech_stack || "LEARNING")}</p>
          <h3>${escapeHtml(nextProject.title)}</h3>
        </div>
        <span class="post-arrow" aria-hidden="true">↗</span>
      </a>
    `;
  }
}

function renderArticlePage() {
  const page = $("[data-post-page]");
  if (!page) return;

  const slug = new URLSearchParams(window.location.search).get("slug");
  const post = POSTS.find((item) => item.slug === slug) || POSTS[0];
  const index = POSTS.indexOf(post);

  document.title = `${post.title} · 帅栈`;
  const description = $('meta[name="description"]');
  if (description) description.content = post.excerpt;

  const title = $("[data-article-title]");
  const category = $("[data-article-category]");
  const date = $("[data-article-date]");
  const readTime = $("[data-article-read-time]");
  const excerpt = $("[data-article-excerpt]");
  const coverIndex = $("[data-article-cover-index]");
  const coverWord = $("[data-article-cover] .cover-word");
  const cover = $("[data-article-cover]");
  const body = $("[data-article-body]");
  const nextPost = POSTS[(index + 1) % POSTS.length];

  if (title) title.textContent = post.title;
  if (category) category.textContent = post.category;
  if (date) date.textContent = formatDate(post.date);
  if (readTime) readTime.textContent = post.readTime;
  if (excerpt) excerpt.textContent = post.excerpt;
  if (coverIndex) coverIndex.textContent = String(index + 1).padStart(2, "0");
  if (coverWord) coverWord.innerHTML = `${post.coverWord}<span>.</span>`;
  if (cover && post.coverImage) {
    cover.classList.add("has-image");
    cover.style.setProperty("--cover-image", `url("${safeLink(post.coverImage)}")`);
  }
  if (body) body.innerHTML = formatBody(post);

  const nextContainer = $("[data-next-post]");
  if (nextContainer) {
    nextContainer.innerHTML = `
      <a class="next-card" href="${postUrl(nextPost)}">
        <div>
          <p class="eyebrow">${escapeHtml(nextPost.category)} / ${formatDate(nextPost.date)}</p>
          <h3>${escapeHtml(nextPost.title)}</h3>
        </div>
        <span class="post-arrow" aria-hidden="true">↗</span>
      </a>
    `;
  }

  enhanceArticleBody();
  setupReadingProgress();
  setupArticleCopyActions();
  setupComments(post.slug);
}

function enhanceArticleBody() {
  const articleBody = $("[data-article-body]");
  const toc = $("[data-toc]");
  if (!articleBody) return;

  const headings = $$("h2, h3", articleBody);
  headings.forEach((heading, index) => {
    heading.id = `section-${index + 1}`;
  });

  if (toc && headings.length) {
    toc.innerHTML = `<span>本文目录</span>${headings
      .map(
        (heading) =>
          `<a class="${heading.tagName === "H3" ? "toc-sub" : ""}" href="#${heading.id}">${escapeHtml(
            heading.textContent,
          )}</a>`,
      )
      .join("")}`;
  }

  $$("pre", articleBody).forEach((pre) => {
    const button = document.createElement("button");
    button.className = "copy-code";
    button.type = "button";
    button.textContent = "复制";
    button.setAttribute("aria-label", "复制代码");
    button.addEventListener("click", async () => {
      const code = $("code", pre)?.textContent || pre.textContent || "";
      const copied = await copyText(code);
      button.textContent = copied ? "已复制" : "复制失败";
      window.setTimeout(() => {
        button.textContent = "复制";
      }, 1500);
    });
    pre.append(button);
  });

  if ("IntersectionObserver" in window && headings.length) {
    const tocLinks = $$("[data-toc] a");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          tocLinks.forEach((link) => {
            link.classList.toggle("is-active", link.hash === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-18% 0px -68% 0px" },
    );
    headings.forEach((heading) => observer.observe(heading));
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const input = document.createElement("textarea");
    input.value = text;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    return copied;
  }
}

function setupReadingProgress() {
  const progress = $(".reading-progress span");
  if (!progress) return;

  let ticking = false;
  const update = () => {
    const root = document.documentElement;
    const maxScroll = root.scrollHeight - root.clientHeight;
    const ratio = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
    progress.style.width = `${ratio * 100}%`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

function setupArticleCopyActions() {
  const button = $("[data-copy-link]");
  if (!button) return;
  button.addEventListener("click", async () => {
    const copied = await copyText(window.location.href);
    button.textContent = copied ? "链接已复制" : "复制失败";
    window.setTimeout(() => {
      button.textContent = "复制链接";
    }, 1600);
  });
}

function commentDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

async function setupComments(articleSlug) {
  const section = $(".comments-section");
  if (!section) return;

  const status = $("[data-comment-status]", section);
  const list = $("[data-comments-list]", section);
  const authBox = $("[data-comment-auth]", section);
  const form = $("[data-comment-form]", section);
  const count = $("[data-comment-count]", section);
  const backend = window.Backend;

  const loadComments = async () => {
    if (!backend?.configured) {
      if (status) {
        status.innerHTML =
          "<p>留言功能已完成，等待配置 Supabase 后开放。文章阅读不受影响。</p>";
      }
      return;
    }

    try {
      const comments = await backend.select(
        "comments",
        `select=id,author_name,content,created_at&article_slug=eq.${encodeURIComponent(
          articleSlug,
        )}&status=eq.approved&order=created_at.desc`,
      );
      if (count) count.textContent = `${comments.length} 条留言`;
      if (list) {
        list.innerHTML = comments.length
          ? comments
              .map(
                (comment) => `
                  <article class="comment-item">
                    <div class="comment-avatar">${escapeHtml(
                      (comment.author_name || "访客").slice(0, 1),
                    )}</div>
                    <div>
                      <div class="comment-meta">
                        <strong>${escapeHtml(comment.author_name)}</strong>
                        <time datetime="${escapeHtml(comment.created_at)}">${commentDate(
                          comment.created_at,
                        )}</time>
                      </div>
                      <p>${escapeHtml(comment.content).replaceAll("\n", "<br />")}</p>
                    </div>
                  </article>
                `,
              )
              .join("")
          : '<p class="comments-empty">还没有公开留言，来留下第一条吧。</p>';
      }
    } catch (error) {
      if (status) status.innerHTML = `<p>留言暂时无法加载：${escapeHtml(error.message)}</p>`;
    }
  };

  const updateAuthState = async () => {
    const user = await backend?.currentUser();
    if (!backend?.configured) return;
    if (authBox) authBox.hidden = true;
    if (form) form.hidden = false;
    const userLabel = $("[data-comment-user]", section);
    if (userLabel) userLabel.textContent = user?.email || "访客 · 提交后等待审核";
    const signOutButton = $("[data-comment-signout]", section);
    if (signOutButton) signOutButton.hidden = !user;
  };

  $("[data-comment-login-form]", section)?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    const message = $("[data-comment-login-message]", section);
    if (message) message.textContent = "正在发送登录链接…";
    try {
      await backend.signInWithEmail(String(email), window.location.href);
      if (message) message.textContent = "登录链接已发送，请检查邮箱（包括垃圾邮箱）。";
    } catch (error) {
      if (message) message.textContent = `发送失败：${error.message}`;
    }
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = $("[data-comment-form-message]", section);
    const submitButton = $('button[type="submit"]', form);
    const formData = new FormData(form);
    const user = await backend.currentUser();

    if (submitButton) submitButton.disabled = true;
    if (message) message.textContent = "正在提交…";
    try {
      await backend.insert("comments", {
        article_slug: articleSlug,
        ...(user?.id ? { user_id: user.id } : {}),
        author_name: String(formData.get("author_name")).trim(),
        content: String(formData.get("content")).trim(),
        status: "pending",
      });
      form.reset();
      if (message) message.textContent = "留言已提交，审核通过后会显示在这里。";
    } catch (error) {
      if (message) message.textContent = `提交失败：${error.message}`;
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  $("[data-comment-signout]", section)?.addEventListener("click", async () => {
    await backend.signOut();
    await updateAuthState();
  });

  await Promise.all([loadComments(), updateAuthState()]);
}

function setupSearch() {
  const dialog = $(".search-dialog");
  const input = $("#global-search");
  const results = $("[data-search-results]");
  if (!dialog || !input || !results) return;

  const renderResults = () => {
    const query = input.value.trim().toLocaleLowerCase("zh-CN");
    if (!query) {
      results.innerHTML = '<p class="search-empty">输入关键词，在笔记中寻找答案。</p>';
      return;
    }

    const postMatches = POSTS.filter((post) =>
      `${post.title} ${post.excerpt} ${post.category} ${stripHtml(post.body)}`
        .toLocaleLowerCase("zh-CN")
        .includes(query),
    );

    const resourceMatches = RESOURCES.filter((resource) =>
      `${resource.name} ${resource.description} ${resource.category} ${resource.tags.join(" ")}`
        .toLocaleLowerCase("zh-CN")
        .includes(query),
    );

    const projectMatches = PROJECTS.filter((project) =>
      `${project.title} ${project.summary} ${project.description || ""} ${project.tech_stack || ""}`
        .toLocaleLowerCase("zh-CN")
        .includes(query),
    );

    const postResults = postMatches
      .map(
        (post) => `
          <a class="search-result" href="${postUrl(post)}">
            <strong>${escapeHtml(post.title)}</strong>
            <span>文章 · ${escapeHtml(post.category)}</span>
            <p>${escapeHtml(post.excerpt)}</p>
          </a>
        `,
      )
      .join("");

    const resourceResults = resourceMatches
      .map(
        (resource) => `
          <a class="search-result" href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer">
            <strong>${escapeHtml(resource.name)}</strong>
            <span>资源 · ${escapeHtml(resource.category)}</span>
            <p>${escapeHtml(resource.description)}</p>
          </a>
        `,
      )
      .join("");

    const projectResults = projectMatches
      .map(
        (project) => `
          <a class="search-result" href="${projectUrl(project)}">
            <strong>${escapeHtml(project.title)}</strong>
            <span>项目 · ${escapeHtml(project.status || "作品")}</span>
            <p>${escapeHtml(project.summary)}</p>
          </a>
        `,
      )
      .join("");

    results.innerHTML =
      postMatches.length + resourceMatches.length + projectMatches.length > 0
        ? projectResults + postResults + resourceResults
        : '<p class="search-empty">没有找到匹配内容，试试“Java”“AI”“数据库”或“Git”。</p>';
  };

  $$(".search-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      dialog.showModal();
      document.body.classList.add("search-open");
      renderResults();
      window.setTimeout(() => input.focus(), 50);
    });
  });

  $(".search-close", dialog)?.addEventListener("click", () => dialog.close());
  input.addEventListener("input", renderResults);

  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (clickedOutside) dialog.close();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("search-open");
  });
}

function setupTheme() {
  const root = document.documentElement;
  $$(".theme-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("theme", next);
    });
  });
}

function setupNavigation() {
  const page = document.body.dataset.page;
  const navKey = page === "post" ? "articles" : page === "project" ? "projects" : page;
  $(`[data-nav="${navKey}"]`)?.classList.add("is-active");

  const menuButton = $(".menu-toggle");
  menuButton?.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  });
}

function setupUtilities() {
  $$("[data-current-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  $$("[data-article-count]").forEach((node) => {
    node.textContent = String(POSTS.length).padStart(2, "0");
  });

  $$("[data-project-count]").forEach((node) => {
    node.textContent = String(PROJECTS.length).padStart(2, "0");
  });

  $$("[data-rss-link]").forEach((link) => {
    link.href = "feed.xml";
  });

  const backToTop = $(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => backToTop.classList.toggle("is-visible", window.scrollY > 600),
      { passive: true },
    );
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function mapRemotePost(post) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    category: post.category || "技术笔记",
    date: post.post_date || String(post.created_at || "").slice(0, 10),
    readTime: post.read_time || "5 分钟阅读",
    featured: Boolean(post.featured),
    coverWord: post.cover_word || "FIELD<br>NOTE",
    coverImage: post.cover_image || "",
    body: post.body || "",
    body_format: post.body_format || "markdown",
  };
}

function mapRemoteProject(project) {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary || "",
    description: project.description || "",
    body: project.body || project.description || "",
    body_format: project.body_format || "markdown",
    tech_stack: project.tech_stack || "",
    status: project.status || "持续构建",
    cover_image: project.cover_image || "",
    project_url: project.project_url || "",
    repo_url: project.repo_url || "",
    featured: Boolean(project.featured),
    published: project.published !== false,
    sort_order: project.sort_order || 100,
  };
}

function mapRemoteResource(resource) {
  return {
    name: resource.name,
    category: resource.category,
    description: resource.description,
    url: resource.url,
    type: resource.resource_type || "官方入口",
    tags: Array.isArray(resource.tags) ? resource.tags : [],
    featured: Boolean(resource.featured),
  };
}

function mergeBySlug(defaultItems, remoteItems) {
  const remoteSlugs = new Set(remoteItems.map((item) => item.slug));
  return [...remoteItems, ...defaultItems.filter((item) => !remoteSlugs.has(item.slug))];
}

async function loadRemoteContent() {
  const backend = window.Backend;
  if (!backend?.configured) return;
  const page = document.body.dataset.page;

  const tasks = [];
  if (["home", "articles", "post"].includes(page)) {
    tasks.push(
      backend
        .select("posts", "select=*&published=eq.true&order=post_date.desc")
        .then((posts) => {
          if (posts.length) POSTS = mergeBySlug(POSTS, posts.map(mapRemotePost));
        }),
    );
  }
  if (page === "resources") {
    tasks.push(
      backend
        .select("resources", "select=*&order=sort_order.asc,name.asc")
        .then((resources) => {
          if (resources.length) RESOURCES = resources.map(mapRemoteResource);
        }),
    );
  }
  if (["home", "projects", "project"].includes(page)) {
    tasks.push(
      backend
        .select("projects", "select=*&published=eq.true&order=sort_order.asc,created_at.desc")
        .then((projects) => {
          if (projects.length) PROJECTS = mergeBySlug(PROJECTS, projects.map(mapRemoteProject));
        }),
    );
  }

  await Promise.allSettled(tasks);
}

async function initializeSite() {
  await loadRemoteContent();
  renderFeatured();
  renderLatestPosts();
  renderArchive();
  renderResources();
  renderProjects();
  renderArticlePage();
  renderProjectPage();
  setupSearch();
  setupTheme();
  setupNavigation();
  setupUtilities();
}

initializeSite();
