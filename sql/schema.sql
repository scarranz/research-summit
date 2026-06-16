-- ============================================================
-- Research Summit — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ─── 0. Housekeeping ─────────────────────────────────────────

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- ─── 1. user_roles ───────────────────────────────────────────

create table user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid unique references auth.users(id),
  role       text not null,
  email      text not null unique,
  created_at timestamptz default now()
);

-- Seed: add your email first, then team members as needed
-- insert into user_roles (email, role) values
--   ('scarranza@summit-mgmtx.com', 'admin');

-- Post-login: backfill user_id on first sign-in
create or replace function backfill_user_role()
returns trigger as $$
begin
  update user_roles
    set user_id = new.id
  where email = new.email
    and user_id is null;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function backfill_user_role();

-- Client-callable backfill for dashboard-created users
create or replace function backfill_user_role_on_login()
returns void as $$
begin
  update user_roles
    set user_id = auth.uid()
  where email = (select email from auth.users where id = auth.uid())
    and user_id is null;
end;
$$ language plpgsql security definer;


-- ─── 2. Row Level Security ──────────────────────────────────

alter table user_roles enable row level security;

-- Each user can read their own role
create policy "users_read_own_role" on user_roles
  for select using (user_id = auth.uid());

-- Admin can read all roles
create policy "admin_reads_all_roles" on user_roles
  for select using (
    exists (
      select 1 from user_roles where user_id = auth.uid() and role = 'admin'
    )
  );
