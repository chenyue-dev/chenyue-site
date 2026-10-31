/*
 * 帅栈前端公开配置
 *
 * 在 Supabase 项目创建后填写下面两个值，然后重新部署网站。
 * anonKey 是设计为可公开的前端密钥，真正的数据权限由 supabase/schema.sql
 * 中的 Row Level Security 策略控制。
 *
 * 绝对不要把 service_role key 写进任何前端文件。
 */
window.SITE_CONFIG = {
  supabaseUrl: "https://rsopweveszbwgjzfoqfl.supabase.co",
  supabaseAnonKey: "sb_publishable_63gOWqhIWGdE6PHixyw2iA_8g0WhCGy",
  storageBucket: "media",
  siteUrl: "https://chenyue-dev.github.io/chenyue-site/",
};
