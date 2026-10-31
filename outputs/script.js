/* =========================================================
   帅栈 · Site interactions and article data
   To add a post, append an object to the POSTS array below.
   ========================================================= */

let POSTS = Array.isArray(window.SITE_POSTS) ? window.SITE_POSTS : [];
let RESOURCES = Array.isArray(window.SITE_RESOURCES) ? window.SITE_RESOURCES : [];
let PROJECTS = Array.isArray(window.SITE_PROJECTS) ? window.SITE_PROJECTS : [];
const SITE_BASE_URL = "https://chenyue-dev.github.io/chenyue-site";

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
  $('link[rel="canonical"]')?.setAttribute(
    "href",
    `${SITE_BASE_URL}/project.html?slug=${encodeURIComponent(project.slug)}`,
  );
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
  $('link[rel="canonical"]')?.setAttribute(
    "href",
    `${SITE_BASE_URL}/post.html?slug=${encodeURIComponent(post.slug)}`,
  );
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
