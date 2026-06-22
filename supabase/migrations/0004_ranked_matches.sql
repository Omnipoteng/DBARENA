create table if not exists public.ranked_matches (
  id bigserial primary key,
  user_key text not null,
  opponent text not null,
  platform text not null,
  result text not null check (result in ('Win', 'Loss', 'Draw', 'No Contest')),
  delta integer not null default 0,
  from_rank text not null,
  to_rank text not null,
  match_date date not null,
  preview_image_url text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_ranked_matches_user_date
  on public.ranked_matches (user_key, match_date desc);
