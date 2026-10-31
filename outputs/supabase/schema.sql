-- 帅栈 Supabase 初始化脚本
-- 在 Supabase Dashboard → SQL Editor 中完整执行一次。

create extension if not exists pgcrypto;

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.site_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to anon, authenticated;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 1 and 180),
  excerpt text not null default '',
  category text not null default '技术笔记',
  post_date date not null default current_date,
  read_time text not null default '5 分钟阅读',
  cover_word text not null default '',
  cover_image text not null default '',
  body text not null default '',
  body_format text not null default 'markdown' check (body_format in ('markdown', 'html')),
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 1 and 180),
  summary text not null default '',
  description text not null default '',
  body text not null default '',
  body_format text not null default 'markdown' check (body_format in ('markdown', 'html')),
  tech_stack text not null default '',
  status text not null default '持续构建',
  cover_image text not null default '',
  project_url text not null default '',
  repo_url text not null default '',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null default '',
  url text not null unique,
  resource_type text not null default '官方入口',
  tags text[] not null default '{}',
  featured boolean not null default false,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null check (char_length(article_slug) between 1 and 180),
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null check (char_length(author_name) between 1 and 30),
  content text not null check (char_length(content) between 1 and 1200),
  status text not null default 'pending' check (status in ('pending', 'approved', 'spam')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null check (char_length(path) between 1 and 300),
  visitor_id uuid not null,
  view_date date not null default current_date,
  viewed_at timestamptz not null default now(),
  unique (path, visitor_id, view_date)
);

create index if not exists posts_published_date_idx on public.posts (published, post_date desc);
create index if not exists projects_published_order_idx on public.projects (published, sort_order, created_at desc);
create index if not exists resources_order_idx on public.resources (sort_order, name);
create index if not exists comments_article_status_idx on public.comments (article_slug, status, created_at desc);
create index if not exists page_views_date_idx on public.page_views (view_date desc);
create index if not exists page_views_path_idx on public.page_views (path, view_date desc);

grant usage on schema public to anon, authenticated;
grant select on public.posts, public.projects, public.resources, public.comments to anon;
grant insert on public.comments to anon;
grant select on public.site_admins to authenticated;
grant select, insert, update, delete on public.posts, public.projects, public.resources to authenticated;
grant select, insert, update, delete on public.comments to authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
before update on public.posts
for each row execute function public.touch_updated_at();

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
before update on public.projects
for each row execute function public.touch_updated_at();

drop trigger if exists resources_touch_updated_at on public.resources;
create trigger resources_touch_updated_at
before update on public.resources
for each row execute function public.touch_updated_at();

drop trigger if exists comments_touch_updated_at on public.comments;
create trigger comments_touch_updated_at
before update on public.comments
for each row execute function public.touch_updated_at();

alter table public.site_admins enable row level security;
alter table public.posts enable row level security;
alter table public.projects enable row level security;
alter table public.resources enable row level security;
alter table public.comments enable row level security;
alter table public.page_views enable row level security;

drop policy if exists "admin sees own membership" on public.site_admins;
create policy "admin sees own membership"
on public.site_admins for select
to authenticated
using (user_id = auth.uid() or public.is_site_admin());

drop policy if exists "public reads published posts" on public.posts;
create policy "public reads published posts"
on public.posts for select
to anon, authenticated
using (published = true);

drop policy if exists "admin manages posts" on public.posts;
create policy "admin manages posts"
on public.posts for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "public reads published projects" on public.projects;
create policy "public reads published projects"
on public.projects for select
to anon, authenticated
using (published = true);

drop policy if exists "admin manages projects" on public.projects;
create policy "admin manages projects"
on public.projects for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "public reads resources" on public.resources;
create policy "public reads resources"
on public.resources for select
to anon, authenticated
using (true);

drop policy if exists "admin manages resources" on public.resources;
create policy "admin manages resources"
on public.resources for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "public reads approved comments" on public.comments;
create policy "public reads approved comments"
on public.comments for select
to anon, authenticated
using (
  status = 'approved'
  or user_id = auth.uid()
  or public.is_site_admin()
);

drop policy if exists "signed in users create pending comments" on public.comments;
drop policy if exists "visitors create pending comments" on public.comments;
create policy "visitors create pending comments"
on public.comments for insert
to anon, authenticated
with check (
  status = 'pending'
  and (user_id is null or user_id = auth.uid())
);

drop policy if exists "admin updates comments" on public.comments;
create policy "admin updates comments"
on public.comments for update
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

drop policy if exists "admin deletes comments" on public.comments;
create policy "admin deletes comments"
on public.comments for delete
to authenticated
using (public.is_site_admin());

create or replace function public.record_page_view(p_path text, p_visitor_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.page_views (path, visitor_id)
  values (left(p_path, 300), p_visitor_id)
  on conflict (path, visitor_id, view_date) do nothing;
$$;

create or replace function public.get_public_site_stats()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'totalViews', count(*),
    'uniqueVisitors', count(distinct visitor_id),
    'todayViews', count(*) filter (where view_date = current_date),
    'todayVisitors', count(distinct visitor_id) filter (where view_date = current_date)
  )
  from public.page_views;
$$;

create or replace function public.get_admin_site_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_site_admin() then
    raise exception 'Not authorized';
  end if;

  return (
    select jsonb_build_object(
      'totalViews', count(*),
      'uniqueVisitors', count(distinct visitor_id),
      'todayViews', count(*) filter (where view_date = current_date),
      'todayVisitors', count(distinct visitor_id) filter (where view_date = current_date),
      'topPages', coalesce((
        select jsonb_agg(jsonb_build_object('path', path, 'views', views))
        from (
          select path, count(*) as views
          from public.page_views
          where view_date >= current_date - 30
          group by path
          order by views desc, path
          limit 8
        ) ranked
      ), '[]'::jsonb)
    )
    from public.page_views
  );
end;
$$;

revoke all on function public.record_page_view(text, uuid) from public;
revoke all on function public.get_public_site_stats() from public;
revoke all on function public.get_admin_site_stats() from public;
grant execute on function public.record_page_view(text, uuid) to anon, authenticated;
grant execute on function public.get_public_site_stats() to anon, authenticated;
grant execute on function public.get_admin_site_stats() to authenticated;
grant select, insert, update, delete on public.page_views to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads media" on storage.objects;
create policy "public reads media"
on storage.objects for select
using (bucket_id = 'media');

drop policy if exists "admin uploads media" on storage.objects;
create policy "admin uploads media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'media' and public.is_site_admin());

drop policy if exists "admin updates media" on storage.objects;
create policy "admin updates media"
on storage.objects for update
to authenticated
using (bucket_id = 'media' and public.is_site_admin())
with check (bucket_id = 'media' and public.is_site_admin());

drop policy if exists "admin deletes media" on storage.objects;
create policy "admin deletes media"
on storage.objects for delete
to authenticated
using (bucket_id = 'media' and public.is_site_admin());

-- 第一次登录后，把管理员账号加入白名单：
-- insert into public.site_admins (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
-- on conflict (user_id) do nothing;
