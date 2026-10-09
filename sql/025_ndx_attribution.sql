-- ============================================================
-- Research Summit -- Market Analysis > Nasdaq-100 Analysis: data snapshots
-- DRAFT — not run yet. Run in the Supabase SQL Editor AFTER schema.sql (San / Oscar).
--
-- One row per refresh. `data` holds the whole dataset the page draws
-- ({ meta, hocs: [{ n, eff, prev, close, sec: [{ t, co, w, wi, r, s, g, p0, p1 }] }] }).
-- The page reads the newest row; older rows are the history / rollback.
-- Written only by the ndx-attribution edge function (service role), which checks
-- the NDX_INGEST_KEY secret — so there is no insert policy for users.
-- ============================================================

create table ndx_snapshots (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  source        text not null check (source in ('excel', 'prices')),  -- full Excel upload | open-HOC re-price
  extracted_at  date,            -- when the Excel was extracted
  prices_as_of  date,            -- last session used to price the open HOC (Massive)
  hoc_count     int not null,
  note          text,
  data          jsonb not null
);

create index ndx_snapshots_created_idx on ndx_snapshots (created_at desc);

alter table ndx_snapshots enable row level security;

create policy "authenticated_read_ndx_snapshots" on ndx_snapshots
  for select using (auth.uid() is not null);

-- Rollback to an earlier version = delete the newer rows, e.g.
--   delete from ndx_snapshots where created_at > '<timestamp of the good row>';
