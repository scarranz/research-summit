# ASML Deep Dive — standalone research dashboard (SAB)

Work-in-progress research dashboard on ASML, kept outside the portal app. **Not meant to be merged into `main`**:
this branch only carries it between computers. (If it were merged, Netlify would serve this folder publicly.)

## Open it
- `dashboard/index.html` — open it through any local static server rooted at `research/asml/` or above
  (e.g. the repo's `serve.ps1` from the repo root → `http://localhost:8000/research/asml/dashboard/index.html`).
  Zero-build: classic scripts + Chart.js 4.4.1 from cdnjs.
- Tabs: Machines · Installed Base · Overview · Revenue build · Customers & Geography · TSMC Link · GM Bridge & OpEx.
  P&L & Multiples is still "soon".
- `dashboard/BRIEF.md` — the contract every view follows (one file per view, id-prefixed globals, chart rules, v3 density rules).
  `js/views/*.bak` are earlier versions kept on purpose.

## Data
All numbers are frozen in the view files. Their sources and research notes are in `work/`:
- `work/data/quarterly.json`, `annual.json`, `targets.json` — 6-K / 20-F / Investor Day extracts.
- `work/data/bbg_s1.tsv`, `bbg_s2.tsv` — Bloomberg consensus as of Oct 16 2026.
- `work/data/capacity_quotes.md`, `ibm_research.md`, `gm_opex_research.md` — management quotes, verified against the filings.
- `work/data/guidance_history.tsv` + `build_guidance_xlsx.ps1` — the guidance table (Excel goes to Downloads).
- `work/SESION_2026-10-21.md` — the BBG consensus walkthrough.
- Not included (re-downloadable, ~120 MB): `asml-work/filings/` (6-K / 20-F text and call transcripts) and `data/sec/`.
  The research notes cite paths under `filings/`; `work/tools/get6k.ps1` / `get20f.ps1` fetch them again from SEC EDGAR.

## Open items
- Call Q&A (Quartr needs re-auth; ASML's Q3 2026 transcript blocks automated download).
- **Paused Oct 26 2026 after SAB's review: read `PORTAL_HANDOFF.md`** (full state, Investor Day targets, data issues, plan for the portal).
- Still to rebuild in the calm layout: Customers & Taiwan, Overview; P&L & Multiples not started.
