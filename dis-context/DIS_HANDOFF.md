# Disney (DIS) build — session handoff

**Purpose:** pick up the Disney profile work tomorrow on another machine with zero context loss.
Read this top-to-bottom, then open the companion research pack `dis-context/DIS_context.md`.

_Last updated: 2026-08-10. Branch: `feat/disney` (pushed to `origin`). No open PR — the branch itself is the source of truth._

---

## 0. TL;DR — where things stand

- A full **Disney (DIS) company profile** was built for the Research Summit portal: the
  standardized **Overview** (7 blocks) plus a rich, interactive **Deep Dive** (Segments top/bottom
  line, streaming margin inflection, capex→profit, an interactive parks/cruise/Disney+/expansion
  explorer, and growth & margin drivers).
- It is **committed and pushed** on branch `feat/disney`. **No PR is open** (the earlier PR #82 was
  closed on purpose). The branch on `origin/feat/disney` is the source of truth — pull it tomorrow.
- Disney appears in the grid **only on localhost** (a guarded seed) — nothing was written to the
  shared Supabase DB, so the team does not see it yet.
- Latest feature commit: **`4d6ac7a`** — `feat(disney): add DIS company profile …`.

---

## 1. Get set up on the new machine

```bash
# 1. Clone (or pull if you already have it)
git clone https://github.com/scarranz/research-summit.git
cd research-summit
git fetch origin
git checkout feat/disney          # the branch with all Disney work
git pull                          # get the latest (incl. this handoff)
```

**`env.js` is gitignored** (it holds the Supabase URL + anon key) — it will NOT be in the clone.
To run locally you need it. Options, easiest first:
- Copy `env.js` from the old machine (Desktop\Developer\research-summit\env.js), OR
- Recreate it from the Netlify env vars (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) — same values the
  build uses, OR ask San/Oscar. It is a tiny file that sets `window.__ENV` (URL + anon key).

**Run the local server** (static host on :8000):
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 8000
```
Then open **http://localhost:8000**, **sign in with your email** (magic link — works locally
because env.js points at the real Supabase), and go to **Companies → Disney**.

> ⚠️ On this branch, localhost does NOT auto-skip login (that bypass lives in the parked Spotify
> WIP, not here). If you land on the login page, just sign in. Once you have a session, the
> localhost seed adds Disney (and QCOM) to the grid.

---

## 2. Git state & the parked Spotify WIP

- **Working branch:** `feat/disney` (branched from `main` after fast-forwarding it 133 commits).
- **No open PR.** PR #82 was closed intentionally — this is a personal branch for now, not up for
  review yet. The commits live on `origin/feat/disney`; open a PR later when it's ready to share.
- **Spotify WIP is stashed** on the *old* machine only: `git stash list` shows
  `stash@{0}: On feat/spotify: spotify WIP (auth.js, companies.js)`. A git stash is **local** —
  it did NOT push anywhere, so it is NOT on the new machine. If you need that Spotify work on the
  new machine, `git stash pop` it on the OLD machine and commit/push it first. (It was ~20 lines
  across `js/auth.js` + `js/companies.js`, incl. a localhost auth-bypass.)
- Two stray untracked files (`_diag2.html`, `js/dev.js`) exist in the old working tree — they are
  NOT part of this feature and were deliberately not committed. `js/dev.js` has a `DEV_COMPANIES`
  seed + `isLocalDev()` but is not wired into the grid; we used the QCOM-style seed instead.

---

## 3. What was changed / created (file map)

| File | Status | What |
|---|---|---|
| `js/overviews/dis.js` | **new** | Render module. Exports `disOverview = { html, init, deepDive:{ html, init } }`. Overview + Deep Dive, all charts, the interactive map, modal. |
| `js/overviews/dis-data.js` | **new** | All data (facts, lede, quadrant, segment rev/OI, SVOD ramp, capex, products, timeline, peers, the map nodes, growth drivers). Sourced from filings. |
| `js/overviews/index.js` | modified | Registered `DIS: disOverview` (import + map entry). |
| `js/companies.js` | modified | Added a **localhost-only** DIS grid seed right after the existing QCOM one (guarded by `location.hostname === 'localhost'`). Around the `loadCompaniesPage()` seed block. |
| `dis-context/DIS_context.md` | **new** | The full research pack (10-K/10-Q/earnings/calls synthesis). |
| `dis-context/DIS_HANDOFF.md` | **new** | This file. |

---

## 4. Architecture & conventions (so you don't re-explore)

The portal is **vanilla JS, ES modules, no build step**, Chart.js from CDN, Supabase for
auth/DB. Each company Overview is a hand-built module. Key facts learned:

**Module contract** (see `docs/OVERVIEW_CONVENTIONS.md` — the mandatory contract, and
`.claude/commands/fill-overview.md`):
- Export `{ html(c), init(c), deepDive?: { html(c), init(c) } }`.
- `companies.js` calls `getOverview(ticker)` (`js/overviews/index.js`), renders `html(c)` into
  `.copane[data-pane="overview"]`, and `deepDive.html(c)` into `.copane[data-pane="deepdive"]`.
- `init()` / `deepDive.init()` are called under `requestAnimationFrame` **and re-called on every
  tab switch** (`coTab` in companies.js) — so wiring must be **idempotent** (we guard with
  `root._wired`). Charts must build only when their canvas is visible (`offsetParent !== null`).
- The Deep Dive tab shows only when the module exports `deepDive`. Modals must be **hoisted to
  `#co-detailview`** (an inactive `.copane` is `display:none`).

**How Disney shows in the grid locally:** `fetchCompanies()` (`js/api.js`) reads only the Supabase
`companies` table; locally (no matching rows) the grid is seeded in `companies.js` by the
localhost-guarded block. To **publish for the team**, add a real `companies` row (San/Oscar, via
the portal "Add Company" or SQL) and remove the localhost seed block.

**Reusable patterns we copied (house style — there is no shared helper module, it's copy-paste):**
- **Collapsible** `.ov-collap` / `.ov-collap-h` / `.ov-collap-b` (see `googl.js:25`).
- **Deep-dive tab spine** `.dd-tabs` / `.dd-tab` + `.dd-pane[data-dd]` (uber/googl).
- **Grouped/stacked bars & mixed bar+line** charts (meta.js `grouped()` / capital chart).
- **Interactive map** modeled on `js/overviews/semi-map.js` (drill-down cards + detail panel,
  state on the element's dataset). Our version is a self-contained explorer in `dis.js`
  (`DIS_MAP` data → categories → items → detail panel).
- CSS: shared `css/overview.css` (`--brand`, `--brand-soft`, `--navy`, `--mu`, `--bdr`). We inject
  our own scoped `<style>` under `.ov-dis` inside `html()` — no `index.html` edit needed.

**Docs worth reading before deepening:** `docs/OVERVIEW_CONVENTIONS.md`, `docs/CHART_TOOLKIT.md`
(the reusable Results engine `js/results.js` — "a metric over time vs expectations", already used
by other tickers; could power a richer Disney estimates/results view later),
`docs/EARNINGS_CONVENTIONS.md`, `docs/RESULTS_CONVENTIONS.md`.

---

## 5. What's built, section by section

**Overview** (`dis.js` → `html()`):
1. Key Facts (10 cells, 3px brand top border).
2. Lede (neutral, non-redundant).
3. 2×2 quadrant.
4. *How Disney makes money* — Segments⇄Geography toggle (bars) + per-segment "What is X?"
   accordions with subsegments.
5. Products — 6 family cards → click opens a modal with the specific brands.
6. Competitor scatter — EV/EBITDA⇄P/E × Trailing⇄Forward (Chart.js bubble). **Seeded** multiples.
7. Timeline — 11 entries with sequential "Read more" bullets.

**Deep Dive** (`dis.js` → `deepDiveHtml()`), 5 tabs:
- **Segments** — two grouped-bar charts (Revenue = top line, Operating income = bottom line) for
  Entertainment/Sports/Experiences; Annual (FY24–FY25) ⇄ Quarterly (FY26) toggle.
- **Streaming** — SVOD operating income (bars) + margin (line), the 5%→13% inflection.
- **Capex** — capex bars (FY26E flagged) + Experiences operating income line.
- **Expansion Map** — the interactive explorer: Domestic Parks · International Parks · Cruise Fleet
  (8→13 by 2031) · Disney+/Streaming · Expansion Pipeline. Legend: Operating/Launching/Planned.
- **Growth & Margins** — 4 driver cards.

---

## 6. Key numbers (quick reference — full detail in DIS_context.md)

- **FY2025:** revenue **$94.4B** (+3%); total segment OI **$17.55B**; diluted EPS $6.85 (tax-boosted).
- **Segments FY2025 (rev / OI):** Entertainment $42.5B / $4.67B · Sports $17.7B / $2.88B ·
  Experiences $36.2B / $10.0B.
- **Streaming inflection (Entertainment SVOD margin):** 5.4% → 6.4% → 6.6% → 7.9% (FY25 quarters)
  → 8.4% → 10.6% → **12.9%** (1Q–3Q FY26). FY25 SVOD OI ~$1.3B (from a ~$4B loss in FY22).
- **Capex:** FY24 $5.4B → FY25 $8.0B → **FY26E ~$9B** (guidance); part of a ~$60B/10-yr Experiences
  plan. Cruise fleet **8 → 13 ships by 2031**.
- **Capital return:** dividend $1.50 (+50%); buyback ramped **$3.5B → ≥$9B**; FY26E adj. EPS **~12%**.
- **Leadership:** Bob Iger → **Josh D'Amaro** (CEO, ~2026); CFO **Hugh Johnston**.

---

## 7. Known caveats / draft items to verify before publishing

- **Peer scatter** uses **seeded** multiples & growth (labeled approximate). Conventions want
  **live market-cap bubbles via `api.liveQuote`** and **add/remove peers by ticker** — not yet
  wired. Key Facts market cap does attempt `liveQuote('DIS')` with a labeled fallback.
- Verify a few Key Facts against the source of record: **IPO 1957**, **founded 1923**, and the
  **geography split** (approximate) — flagged in the code footer.
- Segment reporting change: **Consumer Products moves Experiences→Entertainment in Q1 FY27** — keep
  in mind when re-baselining trend lines.
- Quarter-standalone cash flows in the context pack are **derived** (YTD minus prior YTD).

---

## 8. Suggested next steps (backlog, roughly prioritized)

1. **Deepen the Expansion Map** (user's top interest): add a true geographic layout or region
   grouping, per-item dates/capex, and maybe a small world map SVG (see `world-paths.js`).
2. **Capex → ROIC** story: add earlier years if sourceable, and an explicit "capex vintage →
   Experiences OI" read; overlay cruise capacity.
3. **Wire the peer scatter to convention:** live bubbles via `api.liveQuote`, editable peer set.
4. **Consider the Results/Estimates engine** (`js/results.js`) for a Disney topline-vs-expectations
   view (needs a `js/results-data/dis.js` dataset — see `docs/CHART_TOOLKIT.md §8`).
5. **Publish for the team** when ready: add a real `companies` row (San/Oscar) and remove the
   localhost seed block in `companies.js`. Add a `css/dis.css` + link in `index.html` if the inline
   `<style>` grows.
6. Fill the standard **Pillars** (Business/Growth/Management/Valuation) — Management/Valuation
   auto-sync from Fiscal.ai/Massive, but DIS may not be on the Fiscal free plan (~25 tickers).

---

## 9. Dev-environment gotchas (Windows box)

- **No `node`** and **no `python`/`py` on PATH** — you cannot lint JS from the CLI. We validated
  structure with a small PowerShell bracket/string checker (recreate if needed; it handles regex
  literals). The real test is loading in the browser and watching the console (F12).
- **Curly quotes are fine as text but FATAL as JS delimiters/attributes.** Use straight `'`/`"` for
  code; typographic `’ “ ”` only inside string *content*.
- Charts don't render inside a hidden/collapsed container — build them when the pane/section
  becomes visible (we do this on tab-switch and on collapsible-open).
- Scope DOM lookups to the pane root, not `document` (ids can duplicate across instances).

---

## 10. One-line resume prompt for tomorrow

> "Continue the Disney (DIS) profile on branch `feat/disney`. Read `dis-context/DIS_HANDOFF.md` and
> `dis-context/DIS_context.md` first. Then [pick a task from §8]."
