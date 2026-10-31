(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const backend = window.Backend;
  const state = {
    user: null,
    posts: [],
    projects: [],
    resources: [],
    comments: [],
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function isoDate(value) {
    if (value) return String(value).slice(0, 10);
    return new Date().toISOString().slice(0, 10);
  }

  function formatDate(value) {
    if (!value) return "—";
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  }

  function toast(message, type = "success") {
    const element = $("[data-admin-toast]");
    if (!element) return;
    element.textContent = message;
    element.dataset.type = type;
    element.hidden = false;
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => {
      element.hidden = true;
    }, 3200);
  }

  function showPanel(name) {
    $$("[data-panel]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.panel === name);
    });
    $$("[data-admin-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.adminPanel === name);
    });
  }

  function setFormMessage(form, message, isError = false) {
    const node = $("[data-form-message]", form);
    if (!node) return;
    node.textContent = message;
    node.dataset.type = isError ? "error" : "success";
  }

  function setButtonBusy(button, busy, text = "处理中…") {
    if (!button) return;
    if (busy) {
      button.dataset.originalText = button.innerHTML;
      button.disabled = true;
      button.textContent = text;
    } else {
      button.disabled = false;
      if (button.dataset.originalText) button.innerHTML = button.dataset.originalText;
    }
  }

  function setupTheme() {
    $$(".theme-toggle").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const root = document.documentElement;
        const next = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        localStorage.setItem("theme", next);
      });
    });
  }

  function renderStats() {
    $("[data-stat-posts]").textContent = String(state.posts.length).padStart(2, "0");
    $("[data-stat-projects]").textContent = String(state.projects.length).padStart(2, "0");
    $("[data-stat-resources]").textContent = String(state.resources.length).padStart(2, "0");
    $("[data-stat-comments]").textContent = String(
      state.comments.filter((comment) => comment.status === "pending").length,
    ).padStart(2, "0");
  }

  function tableEmpty(message) {
    return `<div class="admin-table-empty">${escapeHtml(message)}</div>`;
  }

  function renderPosts() {
    const container = $("[data-admin-posts]");
    if (!container) return;
    container.innerHTML = state.posts.length
      ? state.posts
          .map(
            (post) => `
              <div class="admin-row">
                <div class="admin-row-main">
                  <span>${escapeHtml(post.category || "未分类")} · ${formatDate(post.post_date)}</span>
                  <strong>${escapeHtml(post.title)}</strong>
                </div>
                <span class="admin-status ${post.published ? "is-live" : ""}">${
                  post.published ? "已发布" : "草稿"
                }</span>
                <div class="admin-row-actions">
                  <a href="post.html?slug=${encodeURIComponent(post.slug)}" target="_blank">查看</a>
                  <button type="button" data-edit-post="${escapeHtml(post.id)}">编辑</button>
                  <button type="button" data-delete-post="${escapeHtml(post.id)}">删除</button>
                </div>
              </div>
            `,
          )
          .join("")
      : tableEmpty("还没有数据库文章。点击“新建文章”开始写作。");
  }

  function renderProjects() {
    const container = $("[data-admin-projects]");
    if (!container) return;
    container.innerHTML = state.projects.length
      ? state.projects
          .map(
            (project) => `
              <div class="admin-row">
                <div class="admin-row-main">
                  <span>${escapeHtml(project.tech_stack || "项目")}</span>
                  <strong>${escapeHtml(project.title)}</strong>
                </div>
                <span class="admin-status ${project.published ? "is-live" : ""}">${
                  project.published ? "公开展示" : "隐藏"
                }</span>
                <div class="admin-row-actions">
                  <a href="project.html?slug=${encodeURIComponent(project.slug)}" target="_blank">查看</a>
                  <button type="button" data-edit-project="${escapeHtml(project.id)}">编辑</button>
                  <button type="button" data-delete-project="${escapeHtml(project.id)}">删除</button>
                </div>
              </div>
            `,
          )
          .join("")
      : tableEmpty("还没有数据库项目。添加第一个正在构建的作品吧。");
  }

  function renderResources() {
    const container = $("[data-admin-resources]");
    if (!container) return;
    container.innerHTML = state.resources.length
      ? state.resources
          .slice(0, 150)
          .map(
            (resource) => `
              <div class="admin-row">
                <div class="admin-row-main">
                  <span>${escapeHtml(resource.category)} · ${escapeHtml(resource.resource_type || "入口")}</span>
                  <strong>${escapeHtml(resource.name)}</strong>
                </div>
                <span class="admin-status">${escapeHtml(resource.url?.replace(/^https?:\/\//, "").split("/")[0])}</span>
                <div class="admin-row-actions">
                  <a href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer">打开</a>
                  <button type="button" data-edit-resource="${escapeHtml(resource.id)}">编辑</button>
                  <button type="button" data-delete-resource="${escapeHtml(resource.id)}">删除</button>
                </div>
              </div>
            `,
          )
          .join("")
      : tableEmpty("数据库资源为空。可以一键导入网站内置的 95 个资源。");
  }

  function renderComments() {
    const container = $("[data-admin-comments]");
    if (!container) return;
    const comments = [...state.comments].sort((a, b) => {
      if (a.status === b.status) return new Date(b.created_at) - new Date(a.created_at);
      return a.status === "pending" ? -1 : 1;
    });
    container.innerHTML = comments.length
      ? comments
          .map(
            (comment) => `
              <article class="admin-comment">
                <div class="admin-comment-head">
                  <div>
                    <strong>${escapeHtml(comment.author_name)}</strong>
                    <span>${escapeHtml(comment.article_slug)} · ${formatDate(comment.created_at)}</span>
                  </div>
                  <span class="admin-status ${comment.status === "approved" ? "is-live" : ""}">${
                    comment.status === "approved" ? "已公开" : "待审核"
                  }</span>
                </div>
                <p>${escapeHtml(comment.content).replaceAll("\n", "<br />")}</p>
                <div class="admin-row-actions">
                  <a href="post.html?slug=${encodeURIComponent(comment.article_slug)}" target="_blank">查看文章</a>
                  <button type="button" data-comment-action="${
                    comment.status === "approved" ? "pending" : "approved"
                  }" data-comment-id="${escapeHtml(comment.id)}">${
                    comment.status === "approved" ? "撤回" : "通过"
                  }</button>
                  <button type="button" data-delete-comment="${escapeHtml(comment.id)}">删除</button>
                </div>
              </article>
            `,
          )
          .join("")
      : tableEmpty("暂时没有留言。");
  }

  function renderAll() {
    renderStats();
    renderPosts();
    renderProjects();
    renderResources();
    renderComments();
  }

  async function loadAll() {
    const results = await Promise.all([
      backend.select("posts", "select=*&order=created_at.desc"),
      backend.select("projects", "select=*&order=sort_order.asc,created_at.desc"),
      backend.select("resources", "select=*&order=sort_order.asc,name.asc"),
      backend.select("comments", "select=*&order=created_at.desc"),
    ]);
    [state.posts, state.projects, state.resources, state.comments] = results;
    renderAll();
  }

  async function loadAnalytics() {
    try {
      const stats = await backend.rpc("get_admin_site_stats");
      const format = (value) => new Intl.NumberFormat("zh-CN").format(value || 0);
      $("[data-analytics-total]").textContent = format(stats.totalViews);
      $("[data-analytics-visitors]").textContent = format(stats.uniqueVisitors);
      $("[data-analytics-today]").textContent = format(stats.todayViews);
      $("[data-analytics-today-visitors]").textContent = format(stats.todayVisitors);
      const container = $("[data-analytics-top-pages]");
      if (container) {
        container.innerHTML = stats.topPages?.length
          ? stats.topPages
              .map(
                (page) => `
                  <div class="admin-top-page">
                    <code>${escapeHtml(page.path)}</code>
                    <strong>${format(page.views)}</strong>
                  </div>
                `,
              )
              .join("")
          : '<div class="admin-table-empty">还没有访问数据。</div>';
      }
    } catch {
      // Analytics is optional and should not block the admin.
    }
  }

  function openPost(post = null) {
    const form = $("[data-post-form]");
    form.reset();
    form.hidden = false;
    form.elements.id.value = post?.id || "";
    form.elements.body_format.value = post?.body_format || "markdown";
    form.elements.title.value = post?.title || "";
    form.elements.slug.value = post?.slug || "";
    form.elements.excerpt.value = post?.excerpt || "";
    form.elements.category.value = post?.category || "Java 学习";
    form.elements.post_date.value = isoDate(post?.post_date);
    form.elements.read_time.value = post?.read_time || "5 分钟阅读";
    form.elements.cover_word.value = post?.cover_word || "";
    form.elements.cover_image.value = post?.cover_image || "";
    form.elements.body.value = post?.body || "";
    form.elements.published.checked = post?.published ?? true;
    setFormMessage(form, post ? "正在编辑已有文章" : "新文章会保存到数据库");
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    form.elements.title.focus({ preventScroll: true });
  }

  function openProject(project = null) {
    const form = $("[data-project-form]");
    form.reset();
    form.hidden = false;
    form.elements.id.value = project?.id || "";
    form.elements.body_format.value = project?.body_format || "markdown";
    form.elements.title.value = project?.title || "";
    form.elements.slug.value = project?.slug || "";
    form.elements.summary.value = project?.summary || "";
    form.elements.status.value = project?.status || "持续构建";
    form.elements.tech_stack.value = project?.tech_stack || "";
    form.elements.project_url.value = project?.project_url || "";
    form.elements.repo_url.value = project?.repo_url || "";
    form.elements.cover_image.value = project?.cover_image || "";
    form.elements.body.value = project?.body || "";
    form.elements.featured.checked = Boolean(project?.featured);
    form.elements.published.checked = project?.published ?? true;
    setFormMessage(form, project ? "正在编辑已有项目" : "新项目会保存到数据库");
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    form.elements.title.focus({ preventScroll: true });
  }

  function openResource(resource = null) {
    const form = $("[data-resource-form]");
    form.reset();
    form.hidden = false;
    form.elements.id.value = resource?.id || "";
    form.elements.name.value = resource?.name || "";
    form.elements.category.value = resource?.category || "";
    form.elements.url.value = resource?.url || "";
    form.elements.description.value = resource?.description || "";
    form.elements.resource_type.value = resource?.resource_type || "官方下载";
    form.elements.tags.value = Array.isArray(resource?.tags) ? resource.tags.join(", ") : "";
    form.elements.featured.checked = Boolean(resource?.featured);
    setFormMessage(form, resource ? "正在编辑已有资源" : "新资源会保存到数据库");
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    form.elements.name.focus({ preventScroll: true });
  }

  async function submitContent(form, table, values, afterSave) {
    const id = form.elements.id.value;
    const button = $('button[type="submit"]', form);
    setButtonBusy(button, true, "正在保存…");
    try {
      if (id) await backend.update(table, id, values);
      else await backend.insert(table, values);
      setFormMessage(form, "保存成功");
      toast("内容已保存");
      form.hidden = true;
      await loadAll();
      afterSave?.();
    } catch (error) {
      setFormMessage(form, `保存失败：${error.message}`, true);
      toast(error.message, "error");
    } finally {
      setButtonBusy(button, false);
    }
  }

  function insertIntoTextarea(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.setRangeText(text, start, end, "end");
    textarea.focus();
  }

  async function handleImageUpload(input) {
    const file = input.files?.[0];
    if (!file) return;
    const form = input.closest("form");
    const targetName = input.dataset.uploadTo;
    const target = form.elements[targetName];
    const label = input.parentElement;
    const textNode = [...label.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    const originalLabel = textNode?.nodeValue || "上传图片";
    if (textNode) textNode.nodeValue = "正在上传…";
    try {
      const url = await backend.uploadImage(file, input.dataset.uploadFolder || "uploads");
      if (targetName === "body") {
        insertIntoTextarea(target, `\n![${file.name.replace(/[\[\]]/g, "")}](${url})\n`);
      } else if (target) {
        target.value = url;
      }
      toast("图片上传成功");
    } catch (error) {
      toast(`图片上传失败：${error.message}`, "error");
    } finally {
      if (textNode) textNode.nodeValue = originalLabel;
      input.value = "";
    }
  }

  async function importBuiltInResources() {
    const button = $("[data-import-resources]");
    const existingUrls = new Set(state.resources.map((resource) => resource.url));
    const resources = (window.SITE_RESOURCES || [])
      .filter((resource) => !existingUrls.has(resource.url))
      .map((resource, index) => ({
        name: resource.name,
        category: resource.category,
        description: resource.description,
        url: resource.url,
        resource_type: resource.type || "官方入口",
        tags: resource.tags || [],
        featured: Boolean(resource.featured),
        sort_order: index + 1,
      }));
    if (!resources.length) {
      toast("内置资源已经全部导入");
      return;
    }
    setButtonBusy(button, true, "正在导入…");
    try {
      for (let index = 0; index < resources.length; index += 35) {
        await backend.insert("resources", resources.slice(index, index + 35));
      }
      toast(`已导入 ${resources.length} 个资源`);
      await loadAll();
    } catch (error) {
      toast(`导入失败：${error.message}`, "error");
    } finally {
      setButtonBusy(button, false);
    }
  }

  async function importBuiltInPosts() {
    const button = $("[data-import-posts]");
    const existingSlugs = new Set(state.posts.map((post) => post.slug));
    const posts = (window.SITE_POSTS || [])
      .filter((post) => !existingSlugs.has(post.slug))
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || "",
        category: post.category || "技术笔记",
        post_date: post.date,
        read_time: post.readTime || "5 分钟阅读",
        cover_word: post.coverWord || "",
        cover_image: post.coverImage || "",
        body: post.body || "",
        body_format: "html",
        featured: Boolean(post.featured),
        published: true,
      }));
    if (!posts.length) {
      toast("内置示例文章已经全部导入");
      return;
    }
    setButtonBusy(button, true, "正在导入…");
    try {
      for (let index = 0; index < posts.length; index += 20) {
        await backend.insert("posts", posts.slice(index, index + 20));
      }
      toast(`已导入 ${posts.length} 篇示例文章`);
      await loadAll();
    } catch (error) {
      toast(`导入失败：${error.message}`, "error");
    } finally {
      setButtonBusy(button, false);
    }
  }

  async function importBuiltInProjects() {
    const button = $("[data-import-projects]");
    const existingSlugs = new Set(state.projects.map((project) => project.slug));
    const projects = (window.SITE_PROJECTS || [])
      .filter((project) => !existingSlugs.has(project.slug))
      .map((project, index) => ({
        slug: project.slug,
        title: project.title,
        summary: project.summary || "",
        description: project.description || "",
        body: project.body || project.description || "",
        body_format: "html",
        tech_stack: project.tech_stack || "",
        status: project.status || "持续构建",
        cover_image: project.cover_image || "",
        project_url: project.project_url || "",
        repo_url: project.repo_url || "",
        featured: Boolean(project.featured),
        published: true,
        sort_order: index + 1,
      }));
    if (!projects.length) {
      toast("内置示例项目已经全部导入");
      return;
    }
    setButtonBusy(button, true, "正在导入…");
    try {
      await backend.insert("projects", projects);
      toast(`已导入 ${projects.length} 个示例项目`);
      await loadAll();
    } catch (error) {
      toast(`导入失败：${error.message}`, "error");
    } finally {
      setButtonBusy(button, false);
    }
  }

  async function showAdmin(user) {
    state.user = user;
    $("[data-admin-gate]").hidden = true;
    $("[data-admin-app]").hidden = false;
    $("[data-admin-signout]").hidden = false;
    $("[data-admin-email]").textContent = user.email || "管理员";
    $("[data-connection-status]").textContent = "数据服务已连接";
    $("[data-admin-date]").textContent = new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
    await loadAll();
    await loadAnalytics();
    showPanel("overview");
  }

  async function checkSession() {
    const configured = Boolean(backend?.configured);
    const configWarning = $("[data-config-warning]");
    if (configWarning) configWarning.hidden = configured;
    if (!configured) {
      $("[data-connection-status]").textContent = "数据服务未配置";
      $("[data-connection-status]").classList.add("is-offline");
      return;
    }
    $("[data-connection-status]").textContent = "正在验证管理员身份…";
    const user = await backend.currentUser();
    if (!user) return;
    const isAdmin = await backend.isAdmin();
    if (!isAdmin) {
      const message = $("[data-login-message]");
      if (message) {
        message.textContent =
          "账号已登录，但还不是管理员。请按部署指南把当前 user_id 加入 site_admins 表，然后刷新。";
      }
      $("[data-admin-signout]").hidden = false;
      return;
    }
    await showAdmin(user);
  }

  function setupEvents() {
    $("[data-github-login]")?.addEventListener("click", () => {
      try {
        backend.signInWithGitHub(window.location.href);
      } catch (error) {
        const message = $("[data-login-message]");
        if (message) message.textContent = `GitHub 登录失败：${error.message}`;
      }
    });

    $("[data-login-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = $('button[type="submit"]', event.currentTarget);
      const message = $("[data-login-message]");
      if (!backend?.configured) {
        if (message) message.textContent = "请先填写 site-config.js 并重新部署网站。";
        return;
      }
      setButtonBusy(button, true, "正在发送…");
      try {
        await backend.signInWithEmail(
          event.currentTarget.elements.email.value.trim(),
          window.location.href,
        );
        if (message) message.textContent = "登录链接已发送，请检查邮箱并点击链接。";
      } catch (error) {
        if (message) message.textContent = `发送失败：${error.message}`;
      } finally {
        setButtonBusy(button, false);
      }
    });

    $("[data-admin-signout]")?.addEventListener("click", async () => {
      await backend.signOut();
      window.location.reload();
    });

    $$("[data-panel]").forEach((button) => {
      button.addEventListener("click", () => showPanel(button.dataset.panel));
    });
    $$("[data-quick-panel]").forEach((button) => {
      button.addEventListener("click", () => {
        const panel = button.dataset.quickPanel;
        showPanel(panel);
        if (panel === "posts") openPost();
        if (panel === "projects") openProject();
        if (panel === "resources") openResource();
      });
    });

    $("[data-new-post]")?.addEventListener("click", () => openPost());
    $("[data-new-project]")?.addEventListener("click", () => openProject());
    $("[data-new-resource]")?.addEventListener("click", () => openResource());
    $$("[data-close-editor]").forEach((button) => {
      button.addEventListener("click", () => {
        button.closest("form").hidden = true;
      });
    });

    $("[data-post-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      submitContent(
        form,
        "posts",
        {
          title: form.elements.title.value.trim(),
          slug: form.elements.slug.value.trim(),
          excerpt: form.elements.excerpt.value.trim(),
          category: form.elements.category.value.trim(),
          post_date: form.elements.post_date.value,
          read_time: form.elements.read_time.value.trim(),
          cover_word: form.elements.cover_word.value.trim(),
          cover_image: form.elements.cover_image.value.trim(),
          body: form.elements.body.value,
          body_format: form.elements.body_format.value || "markdown",
          published: form.elements.published.checked,
        },
        () => renderPosts(),
      );
    });

    $("[data-project-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      submitContent(
        form,
        "projects",
        {
          title: form.elements.title.value.trim(),
          slug: form.elements.slug.value.trim(),
          summary: form.elements.summary.value.trim(),
          description: form.elements.summary.value.trim(),
          status: form.elements.status.value.trim(),
          tech_stack: form.elements.tech_stack.value.trim(),
          project_url: form.elements.project_url.value.trim(),
          repo_url: form.elements.repo_url.value.trim(),
          cover_image: form.elements.cover_image.value.trim(),
          body: form.elements.body.value,
          body_format: form.elements.body_format.value || "markdown",
          featured: form.elements.featured.checked,
          published: form.elements.published.checked,
        },
        () => renderProjects(),
      );
    });

    $("[data-resource-form]")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      submitContent(
        form,
        "resources",
        {
          name: form.elements.name.value.trim(),
          category: form.elements.category.value.trim(),
          url: form.elements.url.value.trim(),
          description: form.elements.description.value.trim(),
          resource_type: form.elements.resource_type.value.trim(),
          tags: form.elements.tags.value
            .split(/[,，]/)
            .map((tag) => tag.trim())
            .filter(Boolean),
          featured: form.elements.featured.checked,
          sort_order: 100,
        },
        () => renderResources(),
      );
    });

    $$("[data-upload-to]").forEach((input) => {
      input.addEventListener("change", () => handleImageUpload(input));
    });

    $("[data-import-resources]")?.addEventListener("click", importBuiltInResources);
    $("[data-import-posts]")?.addEventListener("click", importBuiltInPosts);
    $("[data-import-projects]")?.addEventListener("click", importBuiltInProjects);
    $("[data-refresh-comments]")?.addEventListener("click", loadAll);

    $("[data-admin-posts]")?.addEventListener("click", async (event) => {
      const edit = event.target.closest("[data-edit-post]");
      const remove = event.target.closest("[data-delete-post]");
      if (edit) openPost(state.posts.find((post) => post.id === edit.dataset.editPost));
      if (remove && window.confirm("确定删除这篇文章吗？这个操作无法在页面中撤销。")) {
        try {
          await backend.remove("posts", remove.dataset.deletePost);
          toast("文章已删除");
          await loadAll();
        } catch (error) {
          toast(`删除失败：${error.message}`, "error");
        }
      }
    });

    $("[data-admin-projects]")?.addEventListener("click", async (event) => {
      const edit = event.target.closest("[data-edit-project]");
      const remove = event.target.closest("[data-delete-project]");
      if (edit) openProject(state.projects.find((project) => project.id === edit.dataset.editProject));
      if (remove && window.confirm("确定删除这个项目吗？")) {
        try {
          await backend.remove("projects", remove.dataset.deleteProject);
          toast("项目已删除");
          await loadAll();
        } catch (error) {
          toast(`删除失败：${error.message}`, "error");
        }
      }
    });

    $("[data-admin-resources]")?.addEventListener("click", async (event) => {
      const edit = event.target.closest("[data-edit-resource]");
      const remove = event.target.closest("[data-delete-resource]");
      if (edit) openResource(state.resources.find((resource) => resource.id === edit.dataset.editResource));
      if (remove && window.confirm("确定删除这个资源入口吗？")) {
        try {
          await backend.remove("resources", remove.dataset.deleteResource);
          toast("资源已删除");
          await loadAll();
        } catch (error) {
          toast(`删除失败：${error.message}`, "error");
        }
      }
    });

    $("[data-admin-comments]")?.addEventListener("click", async (event) => {
      const action = event.target.closest("[data-comment-action]");
      const remove = event.target.closest("[data-delete-comment]");
      try {
        if (action) {
          await backend.update("comments", action.dataset.commentId, {
            status: action.dataset.commentAction,
          });
          toast("留言状态已更新");
          await loadAll();
        }
        if (remove && window.confirm("确定永久删除这条留言吗？")) {
          await backend.remove("comments", remove.dataset.deleteComment);
          toast("留言已删除");
          await loadAll();
        }
      } catch (error) {
        toast(`操作失败：${error.message}`, "error");
      }
    });
  }

  setupTheme();
  setupEvents();
  checkSession();
})();
