-- ALÉA: ejecutar en SQL Editor de un proyecto Supabase EXCLUSIVO para ALÉA.
create table if not exists public.alea_entries (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check (kind in ('period','symptom')),
 date date not null,
 cycle integer check (cycle between 20 and 45),
 length integer check (length between 1 and 12),
 symptom text,
 created_at timestamptz not null default now()
);
create index if not exists alea_entries_user_date_idx on public.alea_entries(user_id,date desc);
alter table public.alea_entries enable row level security;
revoke all on public.alea_entries from anon;
grant select,insert,update,delete on public.alea_entries to authenticated;
create policy "Cada persona lee sus registros" on public.alea_entries for select to authenticated using ((select auth.uid())=user_id);
create policy "Cada persona inserta sus registros" on public.alea_entries for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Cada persona edita sus registros" on public.alea_entries for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Cada persona elimina sus registros" on public.alea_entries for delete to authenticated using ((select auth.uid())=user_id);
