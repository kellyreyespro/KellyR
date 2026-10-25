-- ALÉA: ejecutar en el SQL Editor de Kelly (proyecto iqoafinzrqnmyvaqcrqa)
-- Datos de cuidado, preferencias y registros sensibles por usuaria.
create table if not exists public.alea_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint alea_answers_object check (jsonb_typeof(answers)='object' and pg_column_size(answers)<8192)
);
alter table public.alea_profiles enable row level security;
revoke all on public.alea_profiles from anon;
grant select,insert,update,delete on public.alea_profiles to authenticated;
do $$begin
if not exists (select 1 from pg_policies where schemaname='public' and tablename='alea_profiles' and policyname='alea_profiles_read_own') then
create policy alea_profiles_read_own on public.alea_profiles for select to authenticated using ((select auth.uid())=user_id);
end if;
if not exists (select 1 from pg_policies where schemaname='public' and tablename='alea_profiles' and policyname='alea_profiles_create_own') then
create policy alea_profiles_create_own on public.alea_profiles for insert to authenticated with check ((select auth.uid())=user_id);
end if;
if not exists (select 1 from pg_policies where schemaname='public' and tablename='alea_profiles' and policyname='alea_profiles_update_own') then
create policy alea_profiles_update_own on public.alea_profiles for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
end if;
if not exists (select 1 from pg_policies where schemaname='public' and tablename='alea_profiles' and policyname='alea_profiles_delete_own') then
create policy alea_profiles_delete_own on public.alea_profiles for delete to authenticated using ((select auth.uid())=user_id);
end if;
end$$;
create table if not exists public.alea_cycle_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_date date not null,
  kind text not null check (kind in ('period_start','symptom','intimacy')),
  detail text not null default '' check (length(detail)<120),
  created_at timestamptz not null default now()
);
create index if not exists alea_cycle_events_user_date_idx on public.alea_cycle_events(user_id,event_date desc);
alter table public.alea_cycle_events enable row level security;
revoke all on public.alea_cycle_events from anon;
grant select,insert,update,delete on public.alea_cycle_events to authenticated;
do $$begin
if not exists (select 1 from pg_policies where schemaname='public' and tablename='alea_cycle_events' and policyname='alea_cycle_read_own') then
create policy alea_cycle_read_own on public.alea_cycle_events for select to authenticated using ((select auth.uid())=user_id);
end if;
if not exists (select 1 from pg_policies where schemaname='public' and tablename='alea_cycle_events' and policyname='alea_cycle_create_own') then
create policy alea_cycle_create_own on public.alea_cycle_events for insert to authenticated with check ((select auth.uid())=user_id);
end if;
if not exists (select 1 from pg_policies where schemaname='public' and tablename='alea_cycle_events' and policyname='alea_cycle_update_own') then
create policy alea_cycle_update_own on public.alea_cycle_events for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
end if;
if not exists (select 1 from pg_policies where schemaname='public' and tablename='alea_cycle_events' and policyname='alea_cycle_delete_own') then
create policy alea_cycle_delete_own on public.alea_cycle_events for delete to authenticated using ((select auth.uid())=user_id);
end if;
end$$;
-- Nota: preservar tabla existente alea_preferences. Al eliminar cuenta auth.users, se borran filas vinculadas por cascade.
