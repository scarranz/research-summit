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


-- ─── 3. companies ─────────────────────────────────────────────

create table companies (
  id           uuid primary key default gen_random_uuid(),
  ticker       text not null unique,
  name         text not null,
  sector       text,
  group_name   text,
  logo_domain  text,
  mono         text,
  price        numeric,
  status       text not null default 'active',
  created_by   uuid references auth.users(id),
  updated_by   uuid references auth.users(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create trigger companies_updated_at
  before update on companies
  for each row
  execute function set_updated_at();

alter table companies enable row level security;

-- Any authenticated user can read companies
create policy "authenticated_read_companies" on companies
  for select using (auth.uid() is not null);

-- Any authenticated user can insert companies
create policy "authenticated_insert_companies" on companies
  for insert with check (auth.uid() is not null);

-- Any authenticated user can update companies
create policy "authenticated_update_companies" on companies
  for update using (auth.uid() is not null);


-- ─── 4. Seed: migrate hardcoded companies ──────────────────────
-- Run this AFTER creating the companies table.
-- These are the original 15 companies from portal-data.js.

insert into companies (ticker, name, price, sector, group_name, logo_domain, mono, status) values
  ('AMZN', 'Amazon.com Inc.', 201.30, 'Consumer Disc.', 'Consumer', 'amazon.com', 'AZ', 'active'),
  ('TBBB', 'BBB Foods Inc.', 31.07, 'Consumer Staples', 'Consumer', 'tiendas3b.com', '3B', 'active'),
  ('PAC', 'Grupo Aeroportuario del Pacífico', 210.00, 'Industrials', 'Airports', 'aeropuertosgap.com.mx', 'PAC', 'active'),
  ('CART', 'Instacart', 44.18, 'Consumer Disc.', 'Consumer', 'instacart.com', 'IC', 'active'),
  ('IBKR', 'Interactive Brokers', 205.00, 'Financials', 'Financial Services', 'interactivebrokers.com', 'IB', 'active'),
  ('LYFT', 'Lyft Inc.', 16.92, 'Technology', 'Transportation', 'lyft.com', 'LY', 'active'),
  ('MA', 'Mastercard Inc.', 525.00, 'Financials', 'Networks', 'mastercard.com', 'MA', 'active'),
  ('META', 'Meta Platforms', 612.18, 'Communication', 'Technology', 'meta.com', 'M', 'active'),
  ('NVDA', 'NVIDIA Corp.', 138.55, 'Semiconductors', 'Semiconductors', 'nvidia.com', 'NV', 'active'),
  ('SOFI', 'SoFi Technologies', 14.61, 'Financials', 'Banks', 'sofi.com', 'SO', 'active'),
  ('SPOT', 'Spotify Technology', 498.22, 'Communication', 'Streaming', 'spotify.com', 'SP', 'active'),
  ('TPL', 'Texas Pacific Land Corp.', 1100.00, 'Energy', 'Commodities', 'texaspacific.com', 'TPL', 'active'),
  ('UBER', 'Uber Technologies', 82.40, 'Technology', 'Transportation', 'uber.com', 'UB', 'active'),
  ('V', 'Visa Inc.', 290.00, 'Financials', 'Networks', 'visa.com', 'V', 'active'),
  ('VITL', 'Vital Farms Inc.', 38.90, 'Consumer Staples', 'Consumer', 'vitalfarms.com', 'VF', 'active')
on conflict (ticker) do nothing;
