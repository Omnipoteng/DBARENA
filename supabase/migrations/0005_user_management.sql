-- Add role, status, is_muted, is_banned, and notes columns to profiles table
alter table public.profiles
  add column if not exists role text not null default 'scaler',
  add column if not exists status text not null default 'Active',
  add column if not exists is_muted boolean not null default false,
  add column if not exists is_banned boolean not null default false,
  add column if not exists notes text not null default '';

-- Create index for quick searches and filtering in admin dashboard
create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_status on public.profiles (status);
create index if not exists idx_profiles_is_muted on public.profiles (is_muted);
create index if not exists idx_profiles_is_banned on public.profiles (is_banned);
