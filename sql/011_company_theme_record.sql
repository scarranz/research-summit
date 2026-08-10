-- ════════════════════════════════════════════════════════════════════════════
-- Research Summit — Company Theme RECORD (AMZN-style segmented Notes)
-- ════════════════════════════════════════════════════════════════════════════
-- The AMZN Notes tab (Pablo's #79) is a SEGMENTED theme record: each theme carries a segment, a
-- status, a "why", and PER-QUARTER note items — richer than the flat `company_themes` table (which has
-- no segment and no per-quarter items array). Rather than restructure company_themes (and disturb
-- GOOGL and the shared Watch List engine that rely on it), the whole record persists as ONE JSONB blob
-- per company: load it when the Notes tab mounts, save it after every edit/publish. Same principle as
-- GOOGL's company_themes (Supabase-backed, api.js, RLS = any authenticated user), adapted to the
-- richer shape.
--
-- Run this in the Supabase SQL editor (San / Oscar only), then the AMZN Notes tab and the
-- Post-Results "Publish to Notes" flow persist across a refresh and across team members.
--
-- Shape of `record` (a JSON array, mirroring AMZN_THEMES in js/overviews/amzn.js):
--   [ { "seg": "Amazon US", "theme": "Agentic commerce",
--       "st": { "k": "watch", "since": "Q4 2025", "last": "Q2 2026" },
--       "why": "…",
--       "updates": [ { "q": "Q2 2026", "items": ["note text (HTML ok)", "…"] } ] }, … ]
-- ────────────────────────────────────────────────────────────────────────────

create table if not exists company_theme_record (
  company_id  uuid primary key references companies(id) on delete restrict,
  ticker      text not null,               -- denormalized scope (mirror of the company's ticker)
  record      jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now()
);

-- RLS: same policy as company_themes — any authenticated team member can read and write.
alter table company_theme_record enable row level security;

create policy "authenticated_read_theme_record"
  on company_theme_record for select to authenticated using (true);

create policy "authenticated_upsert_theme_record"
  on company_theme_record for insert to authenticated with check (true);

create policy "authenticated_update_theme_record"
  on company_theme_record for update to authenticated using (true) with check (true);
