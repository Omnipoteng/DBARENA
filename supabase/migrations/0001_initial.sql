create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  user_key text primary key,
  display_name text not null default '',
  username text not null default '',
  bio text not null default '',
  avatar_url text not null default '',
  banner_url text not null default '',
  banner_kind text not null default 'image' check (banner_kind in ('image', 'video')),
  banner_focus integer not null default 50,
  banner_crop jsonb,
  border_key text not null default 'legend',
  rank_key text not null default 'Legend',
  ranked_points integer not null default 0,
  highest_rank text not null default 'Mythic',
  total_match integer not null default 0,
  win_rate numeric(5,2) not null default 0,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_tags (
  profile_user_key text not null references public.profiles(user_key) on delete cascade,
  label text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (profile_user_key, label)
);

create table if not exists public.follows (
  follower_user_key text not null,
  following_user_key text not null,
  created_at timestamptz not null default now(),
  primary key (follower_user_key, following_user_key)
);

create table if not exists public.token_wallets (
  user_key text primary key,
  balance integer not null default 0,
  unlocks jsonb not null default '[]'::jsonb,
  streak_day integer not null default 0,
  claim_date date,
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_login_claims (
  id bigserial primary key,
  user_key text not null,
  claim_date date not null,
  streak_day smallint not null,
  reward_day smallint not null,
  reward_type text not null check (reward_type in ('token', 'tag')),
  reward_amount integer,
  reward_tag text,
  claimed_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  item_key text primary key,
  title text not null,
  description text not null,
  cost integer not null,
  category text not null,
  reward text not null,
  image_url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_inventory_items (
  id bigserial primary key,
  user_key text not null,
  item_key text not null references public.inventory_items(item_key),
  acquired_at timestamptz not null default now(),
  unique (user_key, item_key)
);

create table if not exists public.token_transactions (
  id bigserial primary key,
  user_key text not null,
  title text not null,
  cost integer not null,
  kind text not null check (kind in ('claim', 'redeem')),
  balance_after integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id text primary key,
  title text not null,
  description text not null,
  image_url text not null,
  date date not null,
  origin text not null default 'custom',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_preferences (
  user_key text primary key,
  theme text not null default 'light',
  reduce_motion boolean not null default false,
  compact_layout boolean not null default false,
  daily_login_reminder boolean not null default true,
  news_alerts boolean not null default true,
  ranked_alerts boolean not null default true,
  language text not null default 'id',
  hide_online_status boolean not null default false,
  public_rank_badge boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.achievements (
  achievement_key text primary key,
  title text not null,
  description text not null,
  icon text not null default '',
  category text not null default 'general',
  points_reward integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_achievements (
  id bigserial primary key,
  user_key text not null,
  achievement_key text not null references public.achievements(achievement_key),
  unlocked_at timestamptz not null default now(),
  unique (user_key, achievement_key)
);

create index if not exists idx_profiles_public on public.profiles (is_public);
create index if not exists idx_profile_tags_profile on public.profile_tags (profile_user_key, position);
create index if not exists idx_follows_follower on public.follows (follower_user_key);
create index if not exists idx_follows_following on public.follows (following_user_key);
create index if not exists idx_token_transactions_user on public.token_transactions (user_key, created_at desc);
create index if not exists idx_daily_login_claims_user on public.daily_login_claims (user_key, claim_date desc);
create index if not exists idx_posts_origin_date on public.posts (origin, date desc);
