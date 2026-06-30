alter table public.posts
  add column if not exists content text not null default '',
  add column if not exists image_url text not null default '';

alter table public.profiles
  add column if not exists role text not null default 'scaler',
  add column if not exists status text not null default 'Active',
  add column if not exists is_muted boolean not null default false,
  add column if not exists is_banned boolean not null default false,
  add column if not exists notes text not null default '';

create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_status on public.profiles (status);
create index if not exists idx_profiles_is_muted on public.profiles (is_muted);
create index if not exists idx_profiles_is_banned on public.profiles (is_banned);

insert into storage.buckets (id, name, public)
values ('posts', 'posts', true)
on conflict (id) do update
set public = excluded.public;
