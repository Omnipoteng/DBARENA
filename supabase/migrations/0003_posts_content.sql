alter table public.posts
add column if not exists content text not null default '';
