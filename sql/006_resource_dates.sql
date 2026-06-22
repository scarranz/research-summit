-- ============================================================
-- Research Summit — Resource Dates
-- Rename `date` to `date_published`, add `date_uploaded`
-- Run this in the Supabase SQL Editor
-- ============================================================

alter table company_resources rename column date to date_published;
alter table company_resources add column date_uploaded date default current_date;

-- Backfill: set date_uploaded = date_published for existing records
update company_resources set date_uploaded = date_published::date where date_published is not null;
-- For records without date_published, use created_at
update company_resources set date_uploaded = created_at::date where date_uploaded is null;
