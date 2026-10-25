-- Crear en un proyecto Supabase exclusivo de ALÉA.
create table if not exists public.alea_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  country text not null default 'PA' check (country in ('PA','CO','MX','CR','ES','US','OT')),
  skin text not null default 'normal' check (skin in ('normal','seca','grasa','mixta','sensible')),
  goal text not null default 'hidratacion' check (goal in ('hidratacion','limpieza','proteccion','cabello')),
  period_date date,
  cycle_days integer not null default 28 check (cycle_days between 20 and 45),
  updated_at timestamptz not null default now()
);
alter table public.alea_preferences enable row level security;
revoke all on public.alea_preferences from anon;
grant select,insert,update,delete on public.alea_preferences to authenticated;
create policy "Lee sus preferencias" on public.alea_preferences
for select to authenticated using ((select auth.uid())=user_id);
create policy "Crea sus preferencias" on public.alea_preferences
for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Modifica sus preferencias" on public.alea_preferences
for update to authenticated using ((select auth.uid())=user_id)
with check ((select auth.uid())=user_id);
create policy "Borra sus preferencias" on public.alea_preferences
for delete to authenticated using ((select auth.uid())=user_id);
