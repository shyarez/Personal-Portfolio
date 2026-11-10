-- =====================================================================
--  Portfolio CRM: enquiries + admin allow-list, locked down with RLS.
--  Run in Supabase SQL editor (or `supabase db push`).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- Admin allow-list ----------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- A signed-in user may see only their own admin row (used to check access).
drop policy if exists "admins: read own row" on public.admins;
create policy "admins: read own row"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Helper used by policies. SECURITY DEFINER so it can read `admins`
-- regardless of the caller's RLS; search_path pinned for safety.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ---------- Enquiries ----------
create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 100),
  email       text not null check (char_length(email) between 3 and 254),
  subject     text not null check (char_length(subject) between 3 and 150),
  message     text not null check (char_length(message) between 10 and 5000),
  status      text not null default 'new' check (status in ('new', 'replied', 'archived')),
  ip_hash     text,
  user_agent  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists enquiries_status_created_idx on public.enquiries (status, created_at desc);
create index if not exists enquiries_ip_created_idx on public.enquiries (ip_hash, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists enquiries_touch on public.enquiries;
create trigger enquiries_touch
  before update on public.enquiries
  for each row execute function public.touch_updated_at();

alter table public.enquiries enable row level security;

-- No INSERT policy: public submissions go through the server Route Handler,
-- which uses the service-role key (bypasses RLS) after validation + spam checks.
-- No DELETE policy: enquiries are archived, not deleted, from the dashboard.

drop policy if exists "enquiries: admins read" on public.enquiries;
create policy "enquiries: admins read"
  on public.enquiries for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "enquiries: admins update" on public.enquiries;
create policy "enquiries: admins update"
  on public.enquiries for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Belt and braces: anonymous role gets no table privileges at all.
revoke all on public.enquiries from anon;
revoke all on public.admins from anon;

-- Admins may only change the status column.
revoke update on public.enquiries from authenticated;
grant select on public.enquiries to authenticated;
grant update (status) on public.enquiries to authenticated;

-- ---------------------------------------------------------------------
-- After creating your admin user (Auth → Users → Add user), run:
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'you@example.com';
-- ---------------------------------------------------------------------
