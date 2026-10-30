# 帅栈后台、留言与永久保存指南

这套网站现在是“静态前端 + Supabase 云端数据 + Cloudflare Pages 托管”的结构。完成下列配置后，可以在浏览器后台写文章、上传图片、管理项目和资源，并审核留言。

## 零付费路线

如果暂时不购买域名，可以全部使用免费方案：

- GitHub：免费仓库、源码和自动备份
- Supabase Free：数据库、邮箱登录、留言和图片存储
- Cloudflare Pages Free：网站托管与 HTTPS
- 网站地址：`https://你的项目名.pages.dev`

这条路线无需支付域名费用，但网址是托管平台提供的子域名，不是真正属于你的独立域名。如果删除 Cloudflare 项目或平台服务发生变化，地址可能无法继续使用。长期保留的可靠做法仍然是定期备份数据，有条件时再购买域名。

## 一、准备账号

需要注册：

1. GitHub：保存网站源码和数据备份。
2. Supabase：保存文章、项目、资源、留言和图片。
3. Cloudflare Pages：免费发布网站并提供 HTTPS。

免费路线不需要域名和付费服务器。以后如果要使用自己的独立网址，再购买域名即可，现有代码可以直接绑定。

## 二、创建 Supabase 数据库

1. 在 Supabase 创建项目，区域选择离主要访问者较近的位置。
2. 打开 **SQL Editor**。
3. 复制 `supabase/schema.sql` 的全部内容并执行。
4. 打开 **Project Settings → API**，记录 Project URL 和 anon/public key。
5. 打开 `site-config.js`，填写：

```js
window.SITE_CONFIG = {
  supabaseUrl: "https://你的项目.supabase.co",
  supabaseAnonKey: "你的 anon/public key",
  storageBucket: "media",
  siteUrl: "https://你的域名",
};
```

`anon key` 可以出现在浏览器中，真正的数据权限由 RLS 控制。**service_role key 绝对不能写进前端文件。**

## 三、配置登录链接

在 Supabase 打开 **Authentication → URL Configuration**：

- Site URL 填写免费网址，例如 `https://shuaistack.pages.dev`
- Redirect URLs 加入 `https://shuaistack.pages.dev/**`
- 本地调试时再加入 `http://localhost:4173/**`

后台和留言使用邮箱一次性登录，不需要密码。Supabase 默认邮件适合测试；正式运营后建议配置自己的 SMTP 邮件服务，避免发送频率限制。

## 四、授予第一位管理员

1. 在本地或部署好的网站打开 `admin.html`。
2. 输入管理员邮箱并点击登录链接。
3. 第一次登录会自动创建账号，但此时还没有管理员权限。
4. 在 Supabase 的 **Authentication → Users** 找到当前账号，复制 user id。
5. 在 SQL Editor 执行：

```sql
insert into public.site_admins (user_id)
values ('你的 user id')
on conflict (user_id) do nothing;
```

刷新后台后即可管理内容。不要给普通留言用户写入 `site_admins` 的权限。

## 五、首次进入后台

登录成功后可以：

- 写 Markdown 文章、保存草稿、上传封面和正文图片
- 新增项目作品并上传项目封面
- 一键导入网站内置的 95 个开发与 AI 资源
- 审核、通过、撤回或删除留言

留言者同样通过邮箱登录。新留言默认是 `pending`，管理员审核通过后才公开。

## 六、发布到 Cloudflare Pages

1. 把 `outputs` 目录中的全部文件放到 GitHub 仓库根目录。
2. 在 Cloudflare Pages 连接该仓库。
3. Framework preset 选择 `None`。
4. Build command 留空。
5. Build output directory 填写 `/`。
6. 每次向主分支提交，网站都会自动重新部署。

网站是纯静态文件，不需要 Node.js 服务器。

## 七、免费网址与以后绑定域名

全免费方案不需要购买域名。Cloudflare Pages 部署完成时会提供类似下面的免费网址：

```text
https://shuaistack.pages.dev
```

只要 Cloudflare 项目和账号继续存在，就可以继续访问。不要删除项目，也不要随意更换项目名。

以后如果希望拥有真正属于自己的长期网址：

1. 在域名注册商购买 `.dev`、`.me` 或 `.com` 域名。
2. 在 Cloudflare Pages 的 **Custom domains** 绑定域名。
3. 按 Cloudflare 提示配置 DNS。
4. 等待 HTTPS 证书生效。
5. 回到 Supabase，把新域名加入登录跳转白名单。

免费 `pages.dev` 网址能否长期访问，取决于 Cloudflare 账号与项目是否持续存在；自有域名能否长期使用，则取决于是否持续续费。更换托管平台时，自有域名只需重新配置 DNS，免费子域名则需要重新部署并更换网址。

## 八、备份

数据虽然保存在云端，但仍然必须定期备份。安装 Node.js 后，在 `outputs` 目录执行：

```powershell
$env:SUPABASE_URL="https://你的项目.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="你的 service_role key"
$env:SUPABASE_STORAGE_BUCKET="media"
node tools/backup.mjs
```

脚本会把文章、项目、资源、留言、管理员名单和全部图片导出到 `backups/时间/`。

- 不要把 `backups` 中的数据库内容直接提交到公开仓库。
- 不要把 service_role key 保存到网页、GitHub 或截图中。
- 建议至少每月备份一次，重要文章发布后额外备份。
- 同时保留一份 GitHub 源码副本和一份本地备份。

项目还提供了 `.github/workflows/backup.yml`，每月自动执行一次备份并保存为 GitHub Actions Artifact。需要在 GitHub 仓库的 **Settings → Secrets and variables → Actions** 添加：

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Artifact 默认保留 30 天。重要备份仍应下载到自己的电脑或私有云盘。

## 十、资源链接巡检

`.github/workflows/check-links.yml` 会每月检查资源库中的官方链接，并生成 `resource-links.json` 报告。部分网站会拦截自动访问，结果为“需人工确认”时应打开链接自行核对，不要直接删除可靠官网。

## 九、上线检查

- 首页、文章、项目、资源和后台均能打开
- 管理员可以发布和编辑文章
- 图片上传后能正常显示
- 普通访客可以登录并提交留言
- 新留言审核前不公开
- HTTPS、自定义域名和自动续费正常
- 手机端页面可以浏览和操作
- 完成第一次完整备份

## 关于“永久”

没有任何互联网服务可以承诺字面意义上的永久在线。零付费方案适合现在搭建和学习，但免费平台可能有额度、休眠或策略调整。无论是否购买域名，都应当定期备份文章、留言和图片。以后有条件时，再使用自有域名并把备份迁移到新平台。
