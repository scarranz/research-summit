-- ============================================================
-- Research Summit — Company Resources
-- Run this in the Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- ─── 1. company_resources table ──────────────────────────────

create table company_resources (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references companies(id) on delete restrict,
  name         text not null,
  date_published text,
  date_uploaded  date default current_date,
  type         text not null check (type in ('link', 'file')),
  category     text not null check (category in ('filing', 'financial', 'transcript', 'media', 'other')),
  url          text,
  sort_order   int not null default 0,
  created_by   uuid references auth.users(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create trigger company_resources_updated_at
  before update on company_resources
  for each row
  execute function set_updated_at();

alter table company_resources enable row level security;

create policy "authenticated_read_resources" on company_resources
  for select using (auth.uid() is not null);

create policy "authenticated_insert_resources" on company_resources
  for insert with check (auth.uid() is not null);

create policy "authenticated_update_resources" on company_resources
  for update using (auth.uid() is not null);

create policy "authenticated_delete_resources" on company_resources
  for delete using (auth.uid() is not null);


-- ─── 2. Storage bucket for company files ─────────────────────

insert into storage.buckets (id, name, public)
values ('company-files', 'company-files', false)
on conflict (id) do nothing;

-- Authenticated users can upload
create policy "authenticated_upload_company_files" on storage.objects
  for insert with check (
    bucket_id = 'company-files' and auth.uid() is not null
  );

-- Authenticated users can read
create policy "authenticated_read_company_files" on storage.objects
  for select using (
    bucket_id = 'company-files' and auth.uid() is not null
  );

-- Authenticated users can delete their own uploads
create policy "authenticated_delete_company_files" on storage.objects
  for delete using (
    bucket_id = 'company-files' and auth.uid() is not null
  );


-- ─── 3. Seed: migrate Symbotic hardcoded links ──────────────

insert into company_resources (company_id, name, date, type, category, url, sort_order)
select c.id, r.name, r.date, 'link', 'filing', r.url, r.sort_order
from companies c,
(values
  ('Q2 FY2026 · 10-Q', '2026-05-06', 'https://www.sec.gov/Archives/edgar/data/1837240/000183724026000024/sym-20260328.htm', 1),
  ('Q1 FY2026 · 10-Q', '2026-02-04', 'https://www.sec.gov/Archives/edgar/data/1837240/000183724026000009/sym-20251227.htm', 2),
  ('FY2025 · 10-K', '2025-11-24', 'https://www.sec.gov/Archives/edgar/data/1837240/000183724025000278/sym-20250927.htm', 3),
  ('Q3 FY2025 · 10-Q', '2025-08-06', 'https://www.sec.gov/Archives/edgar/data/1837240/000183724025000263/sym-20250628.htm', 4),
  ('Q2 FY2025 · 10-Q', '2025-05-07', 'https://www.sec.gov/Archives/edgar/data/1837240/000183724025000152/sym-20250329.htm', 5),
  ('Q1 FY2025 · 10-Q', '2025-02-05', 'https://www.sec.gov/Archives/edgar/data/1837240/000183724025000044/sym-20241228.htm', 6),
  ('FY2024 · 10-K', '2024-12-04', 'https://www.sec.gov/Archives/edgar/data/1837240/000183724024000232/sym-20240928.htm', 7),
  ('Q3 FY2024 · 10-Q', '2024-07-31', 'https://www.sec.gov/Archives/edgar/data/1837240/000183724024000168/sym-20240629.htm', 8)
) as r(name, date, url, sort_order)
where c.ticker = 'SYM';

insert into company_resources (company_id, name, date, type, category, url, sort_order)
select c.id, r.name, null, 'link', r.category, r.url, r.sort_order
from companies c,
(values
  ('financial', 'Income Statement — Annual (Fiscal.ai)', 'https://fiscal.ai/company/NasdaqGM-SYM/financials/income-statement/annual/', 10),
  ('transcript', 'Investor Relations & Transcripts (Fiscal.ai)', 'https://fiscal.ai/company/NasdaqGM-SYM/investor-relations/', 20),
  ('media', 'Symbotic — podcast episode (Spotify)', 'https://open.spotify.com/episode/2vPskyHUYQaWHM7Pn9AtE3', 30),
  ('media', 'Symbotic — feature video (YouTube)', 'https://youtu.be/EAAV9JxdjF0?si=sTsicnzUbpo_BphH', 31),
  ('media', 'Symbotic review (YouTube)', 'https://www.youtube.com/watch?v=_-KZzL1mPCQ&pp=ygUQc3ltYm90aWMgcmV2aWV3IA%3D%3D', 32),
  ('media', '"symbotic review" — search results (YouTube)', 'https://www.youtube.com/results?search_query=symbotic+review+', 33)
) as r(category, name, url, sort_order)
where c.ticker = 'SYM';
