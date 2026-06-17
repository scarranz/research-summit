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
  exchange     text,
  sector       text,
  group_name   text,
  logo_domain  text,
  mono         text,
  brand_color  text,
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

insert into companies (ticker, name, price, exchange, sector, group_name, logo_domain, mono, brand_color, status) values
  ('AMZN', 'Amazon.com Inc.', 201.30, 'NASDAQ', 'Consumer Disc.', 'Consumer', 'amazon.com', 'AZ', '#FF9900', 'active'),
  ('TBBB', 'BBB Foods Inc.', 31.07, 'NYSE', 'Consumer Staples', 'Consumer', 'tiendas3b.com', '3B', '#E2231A', 'active'),
  ('PAC', 'Grupo Aeroportuario del Pacífico', 210.00, 'NYSE', 'Industrials', 'Airports', 'aeropuertosgap.com.mx', 'PAC', '#1A2A6C', 'active'),
  ('CART', 'Instacart', 44.18, 'NASDAQ', 'Consumer Disc.', 'Consumer', 'instacart.com', 'IC', '#FF7009', 'active'),
  ('IBKR', 'Interactive Brokers', 205.00, 'NASDAQ', 'Financials', 'Financial Services', 'interactivebrokers.com', 'IB', '#D81222', 'active'),
  ('LYFT', 'Lyft Inc.', 16.92, 'NASDAQ', 'Technology', 'Transportation', 'lyft.com', 'LY', '#FF00BF', 'active'),
  ('MA', 'Mastercard Inc.', 525.00, 'NYSE', 'Financials', 'Networks', 'mastercard.com', 'MA', '#EB001B', 'active'),
  ('META', 'Meta Platforms', 612.18, 'NASDAQ', 'Communication', 'Technology', 'meta.com', 'M', '#0866FF', 'active'),
  ('NVDA', 'NVIDIA Corp.', 138.55, 'NASDAQ', 'Semiconductors', 'Semiconductors', 'nvidia.com', 'NV', '#76B900', 'active'),
  ('SOFI', 'SoFi Technologies', 14.61, 'NASDAQ', 'Financials', 'Banks', 'sofi.com', 'SO', '#00A0DF', 'active'),
  ('SPOT', 'Spotify Technology', 498.22, 'NYSE', 'Communication', 'Streaming', 'spotify.com', 'SP', '#1DB954', 'active'),
  ('TPL', 'Texas Pacific Land Corp.', 1100.00, 'NYSE', 'Energy', 'Commodities', 'texaspacific.com', 'TPL', '#0A2342', 'active'),
  ('UBER', 'Uber Technologies', 82.40, 'NYSE', 'Technology', 'Transportation', 'uber.com', 'UB', '#000000', 'active'),
  ('V', 'Visa Inc.', 290.00, 'NYSE', 'Financials', 'Networks', 'visa.com', 'V', '#1A1F71', 'active'),
  ('VITL', 'Vital Farms Inc.', 38.90, 'NASDAQ', 'Consumer Staples', 'Consumer', 'vitalfarms.com', 'VF', '#C8102E', 'active')
on conflict (ticker) do nothing;
