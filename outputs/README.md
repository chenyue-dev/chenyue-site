# 帅栈 · 个人技术博客

这是一套面向小帅的 Java 全栈个人网站。前端不需要安装依赖，直接打开即可预览；配置 Supabase 后即可启用内容后台、图片上传、项目管理和留言审核。

首版可以完全使用 GitHub、Supabase Free 和 Cloudflare Pages Free，无需购买域名。免费网址形如 `https://你的项目名.pages.dev`。如果以后需要真正属于自己的独立网址，再购买并绑定域名即可。

## 现在包含什么

- 首页：个人定位、精选文章、最新文章
- 项目作品：项目列表、详情、技术栈与项目链接
- 文章归档：分类筛选、关键词搜索
- 资源中心：80+ 个 Java、开发工具、学生福利、系统软件与 AI 网站官方入口
- 文章详情：目录、阅读进度、代码复制、相关推荐
- 关于页：个人介绍、原则、技能与关注方向
- 内容后台：文章、项目、资源的新增、编辑、删除与发布
- 图片上传：封面和正文图片保存到 Supabase Storage
- 留言系统：一次性邮箱登录、待审核、通过、撤回和删除
- 全局搜索、深浅色主题、移动端导航
- 响应式布局、无障碍标签、减少动态效果支持
- RSS、站点地图、404 页面、基础 SEO、安全响应头
- 数据库导出与图片存储备份脚本

## 本地预览

直接双击 `index.html` 即可在浏览器中打开。

也可以用 Node.js 启动本地服务器，方便测试邮箱登录跳转：

```bash
npx serve .
```

## 开启后台与留言

完整步骤见 [BACKEND_SETUP.md](BACKEND_SETUP.md)。简单流程：

1. 创建 Supabase 项目。
2. 在 SQL Editor 执行 `supabase/schema.sql`。
3. 把 Supabase URL 和 anon key 填入 `site-config.js`。
4. 发布网站并绑定自己的域名。
5. 打开 `admin.html`，输入管理员邮箱获取登录链接。
6. 在 Supabase 中把管理员 user id 加入 `site_admins` 表。
7. 导入内置资源并开始发布文章。

## 第一次个性化

1. 在 `about.html` 中继续补充小帅的个人经历、邮箱和 GitHub 地址。
2. 在所有页面页脚中替换 `hello@example.com` 与 GitHub 链接。
3. 如果以后想换博客名，搜索页面中的“帅栈”和“SHUAI STACK”。
4. 未配置云端时，可在 `script.js` 顶部的 `POSTS` 数组中修改示例文章。
5. 在 `resources-data.js` 中增加、删除或更新开发资源和 AI 网站。
6. 在 `projects-data.js` 中修改内置示例项目。
7. 在 `styles.css` 顶部修改 `--accent`、`--orange` 和 `--blue`，即可整体换色。

## 发布到公网

推荐把 `outputs` 目录中的文件放到 GitHub 仓库根目录，再使用 Cloudflare Pages 自动部署。无需构建命令，输出目录为 `/`。Vercel 与 Netlify 也可直接使用，项目中已经包含 `_redirects` 和 `vercel.json`。

全免费路线先使用 Cloudflare 提供的 `*.pages.dev` 网址，不购买域名。GitHub、Supabase Free 和 Cloudflare Pages Free 都没有强制付费要求，免费额度和休眠规则以各平台当前套餐页面为准。

## 上线前必须替换

- `feed.xml` 与 `sitemap.xml` 中的占位域名
- `robots.txt` 中的站点地图地址
- 作者姓名、邮箱、GitHub 与关于页内容
- `site-config.js` 中的 Supabase 配置

如果以后愿意购买域名，可以选择 `.dev`、`.me` 或 `.com`，并绑定到现有网站。现在不买域名也可以正常上线。

## 数据备份

在 `outputs` 目录中设置以下环境变量后运行：

```powershell
$env:SUPABASE_URL="https://你的项目.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="你的 service_role key"
node tools/backup.mjs
```

备份会导出全部数据库表和 `media` 存储桶中的图片。service_role key 只能在本机或安全自动化环境中使用，绝不能写进网页。

## 后续升级路线

如果文章未来超过几百篇，可以迁移到 Astro 做构建期静态生成。目前的结构足以支撑个人博客、留言、项目展示和资源库，并能在 Supabase 或托管平台更换时导出数据。
