create table if not exists public.user_preferences (
  user_key text primary key references public.profiles(user_key) on delete cascade,
  interests text[] not null default '{}',
  debate_topics text[] not null default '{}',
  favorite_verses text[] not null default '{}',
  location text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_preferences_onboarding_completed
  on public.user_preferences (onboarding_completed);

create index if not exists idx_user_preferences_location
  on public.user_preferences (location);
