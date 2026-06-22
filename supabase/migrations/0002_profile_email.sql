alter table if exists public.profiles
  add column if not exists email text;

create index if not exists idx_profiles_username on public.profiles (username);
create index if not exists idx_profiles_email on public.profiles (email);
