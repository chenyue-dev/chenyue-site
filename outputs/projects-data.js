window.SITE_PROJECTS = [
  {
    slug: "shuaistack",
    title: "帅栈个人技术站",
    summary: "把文章、项目、开发资源与 AI 工具整理到一个可持续维护的个人空间。",
    description:
      "这是帅栈的第一件长期作品。目标不是一次做成模板，而是在学习 Java 全栈的过程中，让网站跟着项目经验一起成长。",
    body: `
      <h2>项目目标</h2>
      <p>把零散的笔记、软件入口和学习成果放在一个稳定的地方，并保留清楚的成长轨迹。</p>
      <h2>当前能力</h2>
      <ul>
        <li>技术文章、资源检索、AI 工具导航</li>
        <li>响应式页面、深浅色主题与无障碍基础</li>
        <li>Supabase 内容后台、图片上传和留言审核</li>
      </ul>
      <h2>接下来</h2>
      <p>补充 Java 全栈学习路线、完成更多真实项目，并把每次踩坑整理成可以复用的文章。</p>
    `,
    body_format: "html",
    tech_stack: "HTML · CSS · JavaScript · Supabase · Cloudflare Pages",
    status: "持续构建",
    cover_image: "",
    project_url: "",
    repo_url: "",
    featured: true,
    published: true,
    sort_order: 1,
  },
  {
    slug: "java-learning-roadmap",
    title: "Java 全栈学习路线",
    summary: "从 Java 基础到 Spring Boot、数据库、前端与部署，记录一条可执行的学习路径。",
    description:
      "为初学者设计的学习地图：每个阶段都有目标、工具、练习和验收项目，避免只收藏教程却不知道下一步做什么。",
    body: `
      <h2>路线范围</h2>
      <p>Java 基础、面向对象、集合与并发、Git、Maven、MySQL、Spring Boot、Vue、Docker 和部署。</p>
      <blockquote>学习路线不是课程清单，而是一组可以验证的能力。</blockquote>
    `,
    body_format: "html",
    tech_stack: "Java · Spring Boot · MySQL · Vue",
    status: "规划中",
    cover_image: "",
    project_url: "",
    repo_url: "",
    featured: true,
    published: true,
    sort_order: 2,
  },
  {
    slug: "student-toolbox",
    title: "学生开发工具箱",
    summary: "面向学生的免费软件、官方下载入口、教育授权与学习资源集合。",
    description:
      "把真正有用的工具和最容易踩坑的安装步骤集中整理，减少在搜索引擎里反复辨认下载站的时间。",
    body: `
      <h2>内容方向</h2>
      <p>优先收录官方下载、学生免费授权、安装教程和环境配置，不提供来路不明的安装包。</p>
      <h2>第一期</h2>
      <p>JDK、IntelliJ IDEA、VS Code、Git、Maven、MySQL 和 GitHub Student Pack。</p>
    `,
    body_format: "html",
    tech_stack: "Developer Tools · Documentation",
    status: "持续整理",
    cover_image: "",
    project_url: "",
    repo_url: "",
    featured: true,
    published: true,
    sort_order: 3,
  },
  {
    slug: "c-learning-lab",
    title: "C 语言学习实验室",
    summary: "用 GCC、GDB、CMake 和小型命令行程序，把 C 语言的语法变成可以运行和调试的能力。",
    description:
      "面向编程初学者的 C 语言实践项目，从工具链安装开始，逐步完成多文件工程、测试和内存调试。",
    body: `
      <h2>项目目标</h2>
      <p>不把 C 语言学习停留在选择题和单文件代码。项目围绕编译、链接、指针、结构体、动态内存和调试建立完整练习，最终完成一个可以持续扩展的命令行工具。</p>
      <h2>工程组成</h2>
      <ul>
        <li>MSYS2、GCC、GDB 与 CMake 开发环境</li>
        <li>头文件与源文件分离的模块结构</li>
        <li>内存错误、越界和空指针的调试案例</li>
        <li>自动化测试与 GitHub Actions 构建</li>
      </ul>
      <h2>验收方式</h2>
      <p>每个阶段都要求代码可以编译、运行、测试并写清楚错误原因，而不是以“看完了多少视频”作为完成标准。</p>
    `,
    body_format: "html",
    tech_stack: "C · GCC · GDB · CMake · Linux",
    status: "持续完善",
    cover_image: "",
    project_url: "",
    repo_url: "",
    featured: false,
    published: true,
    sort_order: 4,
  },
  {
    slug: "campus-marketplace",
    title: "校园二手交易平台",
    summary: "从需求、数据库、Spring Boot 接口到 Vue 页面，完成一个能注册、发布、搜索和管理商品的 Java Web 项目。",
    description:
      "用于练习 Java 全栈闭环的课程项目：用户发布校园二手物品，访客筛选搜索，管理员处理违规信息。",
    body: `
      <h2>第一版范围</h2>
      <p>第一版聚焦注册登录、商品发布、分类搜索、详情查看、状态修改和后台审核。聊天、推荐算法、在线支付等复杂功能留到后续迭代，避免项目范围失控。</p>
      <h2>技术结构</h2>
      <p>后端使用 Spring Boot 提供 REST API，MySQL 保存用户、分类和商品数据，MyBatis 或 JPA 完成持久化，前端使用 Vue 构建主要页面。接口使用统一错误结构，权限校验放在服务端。</p>
      <h2>工程重点</h2>
      <ul>
        <li>用户密码只保存哈希，不记录明文</li>
        <li>商品列表支持分页、分类、关键字和状态筛选</li>
        <li>发布和修改操作必须验证当前用户权限</li>
        <li>部署配置使用环境变量，数据库定期备份</li>
      </ul>
      <h2>完成标准</h2>
      <p>能够在新环境中按照 README 完成启动；核心接口有测试；管理员可以处理商品；整个流程可以实际演示，而不只是展示页面截图。</p>
    `,
    body_format: "html",
    tech_stack: "Java · Spring Boot · MySQL · Vue · Git",
    status: "规划中",
    cover_image: "",
    project_url: "",
    repo_url: "",
    featured: false,
    published: true,
    sort_order: 5,
  },
];
