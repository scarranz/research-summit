-- ============================================================
-- Research Summit — add a second authorized editor for return overrides
-- Run this in the Supabase SQL Editor, after 019_investor_return_overrides.sql.
--
-- Extends the insert/update policies on investor_return_overrides
-- (previously scarranza@summit-mgmtx.com only) to also allow
-- dposternak@summit-mgmtx.com.
-- ============================================================

drop policy if exists "editor_insert_return_overrides" on investor_return_overrides;
drop policy if exists "editor_update_return_overrides" on investor_return_overrides;

create policy "editor_insert_return_overrides" on investor_return_overrides
  for insert with check (auth.email() in ('scarranza@summit-mgmtx.com', 'dposternak@summit-mgmtx.com'));

create policy "editor_update_return_overrides" on investor_return_overrides
  for update using (auth.email() in ('scarranza@summit-mgmtx.com', 'dposternak@summit-mgmtx.com'))
  with check (auth.email() in ('scarranza@summit-mgmtx.com', 'dposternak@summit-mgmtx.com'));
