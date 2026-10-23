# ASML Deep Dive — brief for every view agent

## What this is
A standalone research dashboard on ASML for SAB, an equity analyst at Summit. He uses it for the investment decision, to finish his ASML DCF, and to explain ASML to his team. It is a zero-build static site served at **http://localhost:8010/asml_dashboard/index.html** (the server is already running — do not start another one). Everything on screen is **in English**; filing and Bloomberg terms are kept verbatim.

Already built: `pl` (The Machines, the intro) and `ov` (Overview). Read both view files before you start — they are your reference for tone, density, chart behaviour and data style.

## The one file you own
You write **only `js/views/<your id>.js`**. Do not edit any other file (index.html, app.js, core.js, css, other views, data-overview.js). If you think a shared file needs a change, say so in your final report instead.

Contract (see `js/core.js`):
```js
registerView({ id:'vm', html:`…markup…`, css:`#v-vm .x{…}`, init(){ … }, onHide(){ … } });
```
- `html` is inserted immediately, so code after `registerView` in your file can bind events to your own elements.
- `init()` runs the first time the view is opened — build charts there (Chart.js needs a visible canvas).
- **All scripts are classic scripts sharing one global scope.** Prefix every top-level `const`/`let`/`function` name with your id (`vmData`, `VM_UNITS`, `vmRender…`) and every DOM id/class with `<id>-`. A name collision breaks the whole page.
- `css` is optional, scoped to `#v-<id>`. Prefer the shared classes in `css/portal.css`: `.srow/.sc/.sl/.sv/.ss` (KPI tiles), `.card/.ch/.ct/.cs/.cb`, `.r2e/.r3/.r4/.r32` grids, `.fbg/.fb` pill toggles, `.ch-wrap(.s/.d)`, `.leg/.li`, `.snote`, `.ins(.a)`, `details.tbl` + `.tw` tables, `td.est/th.est` for estimates, `.tag(.e)`, `.bx`, `.wi/.wk`.
- Helpers in core.js: `$`, `$$`, `fmtB`, `pct`, `sgn`, `pills(sel, fn)`, `attachZoom(getChart, onRange)`, `legend(el, items, hiddenSet, onToggle)`, `table(cols, rows, estCols)`, `TIP` (tooltip base). Shared data in `js/data-overview.js` (quarterly arrays `Q_*`, `MIX`, palette `C`, `COL`, `MKT`). Family data `FAM` lives in `js/views/pl.js` (FY2025 units/€ and 2026E per family).

## Look
Summit portal look, light only: Inter, navy `#1E2733` / steel `#3E5A82` / accent `#2563EB`, white 14px-radius cards on `#F6F7F9`. Chart colours — use these so every view reads as one system:
- Families: High-NA `#1B3F94` · EUV (0.33 NA) `#2563EB` · ArFi `#3E5A82` · ArF dry `#93B1F0` · KrF `#1E2733` · i-line `#A9B4C2` · M&I `#C8D7F4`
- IBM / installed base `#5E8BEC` · Logic `#2563EB` · Memory `#1E2733`
- Regions: Taiwan `#1E2733` · South Korea `#3E5A82` · China `#2563EB` · USA `#93B1F0` · Japan `#A9B4C2` · Rest `#C8D7F4`
- Estimates/consensus: same colour with lower opacity (bars) or dashed (lines), plus the `.est` class in tables. Positive `#16A34A`, negative `#DC2626` only for signs.

Layout of a view: one `.srow` of 4–6 KPI tiles, then 3–5 cards. One screen plus some scroll, not a report. No walls of text: a card has at most 2–3 short sentences of context.

## Charts — non-negotiable
Read `C:\Users\santi\Developer\research-summit\docs\CHART_ENGINE_REFERENCE.md` §0.2 (“the six non-negotiables”) and follow it with the core.js helpers:
1. Drag-to-zoom on both axes, double-click resets (`attachZoom`).
2. Clicking a legend item hides the series **and** removes it from the table and every total.
3. A `details.tbl` data table under each chart that carries at least everything drawn.
4. Metric choices grouped logically; units always explicit (€B vs €M, units, %, pp).
5. Estimates never ambiguous (styled + labelled with source and date).
6. Missing data renders nothing (null), never a zero or a broken line.
Use `animation:false` (automation tabs are hidden; rAF-driven animation stalls there).

## Data — rules
- **Freeze** every number into your file as constants with a comment saying where it came from. No fetches, no APIs, no MCP calls at runtime.
- Every card ends with a `.snote` source line (filing + page/note, or "Bloomberg consensus, Oct 16 2026").
- **Show evidence, not conclusions**: no scores, no buy/sell verdicts, no "ASML will…". Scenario tools are fine when every input is visible.
- Must reconcile with what is already on screen: FY2025 units/€ by family (20-F Note 2), Q1'22–Q3'26 quarterly sales in `data-overview.js`, Q4'26 guide (€14.2–15.2B, IBM ~€3.7B, GM ~57%), FY26 guide €44–45B.
- Never invent a number. If a fact you want is not in the sources below, leave it out or show it as a gap and mention it in your report.

## Sources (all local, already collected)
- `C:\Users\santi\Developer\research-summit\asml-work\data\`
  - `quarterly.json` + `quarterly_notes.md` — 6-K quarterly 1Q22–3Q26: P&L, splits by technology / end-use / region (% of net system sales), units by technology, IBM, backlog/bookings where disclosed.
  - `annual.json` + `annual_notes.md` — 20-F annual 2015–2025: units/€/ASP by technology (EUV split NXE/EXE from 2024), new vs used, end-use, sales by customer location, customer concentration, backlog, bookings, installed base.
  - `targets.json` — Investor Day (2018, 2021, 2024) scenario ranges and unit grids, 2030 targets.
  - `bbg_s1.tsv`, `bbg_s2.tsv` (+ `.txt`) — Bloomberg consensus as of Oct 16 2026 (columns 2020–2029): units, ASP, revenue by line, IBM, margins, opex.
  - `overview.json` + `overview_notes.md` — company facts, product specs, export controls, competitors, with URLs.
  - `ASML_DCF_inputs.xlsx` (sheet `Projection`: 3 scenarios) — its generator `add_projection.ps1` shows every assumption in plain text; read that rather than the xlsx.
  - `20f_split.txt` — FY2025 20-F text, one sentence per line (grep it).
- `C:\Users\santi\Developer\research-summit\asml-work\SESION_2026-10-21.md` — SAB's walkthrough of the BBG consensus: tables for units, ASP, revenue (BBG vs units×ASP), GM, opex, and the known BBG inconsistencies.
- Prior ASML profile work (local git commit, not on the current branch): `git -C C:\Users\santi\Developer\research-summit show 4696bf2:docs/profiles/ASML.md`, `…:js/overviews/asml-data.js`, `…:js/overviews/asml.js`, `…:js/results-data/asml.js`, `…:js/segments-data/asml.js`. Read with `git show`; **do not check out or switch branches** (another session owns the working tree).
- `C:\Users\santi\Downloads\tsmc_dashboard_v7.html` — SAB's TSMC dashboard (ASML Pipeline view, EUV counts, capex), and in the repo `js/overviews/tsm-asml.js`, `tsm-asml-data.js`, `docs/profiles/TSM.md` §6c.
- **Do not open `G:\…\DCF ASML.xlsm`** — SAB has it open in Excel.

Known data quirks (already found; respect them, flag new ones):
- Bloomberg's own "EUV" row does not equal Low-NA + High-NA; use the Low-NA / High-NA rows. BBG "DUV" row ≠ sum of its parts.
- Q2'26 net system sales = total − IBM (€9,326M − €2,762M = €6,564M); a workbook rounds it to €6.6B.
- ASML stopped publishing quarterly bookings after Q4 2025 (last €13.2B).
- Quarterly € by technology are derived from integer % pies → label them "derived".
- 2026: Q1–Q3 actual + Q4 guide; consensus FY26 €44.4B.

## Check your work, then report
1. Open `http://localhost:8010/asml_dashboard/index.html#<id>` in **your own new Chrome tab** (`tabs_create_mcp`; never reuse another tab), read console errors, take one screenshot, fix what is broken, then close your tab.
2. Final report (short, plain text): the cards you built and what each answers; every source used; assumptions; any number that does not reconcile; anything you need from a shared file.

---
## v3 — DENSITY RULES (SAB, Oct 22 2026: "se ve muy amontonado… solo con la información necesaria"; and "mostrar todas las máquinas en una sola gráfica no me encanta")
The shared CSS now matches the portal's company Deep Dive (reference: the AMZN profile, `css/segments.css` `.sg-*`): white page, sections are NOT boxes (`.card` is just a heading with a rule + content), tiles are light cards with a navy top rule, segmented controls, pale note boxes. Your view must now match that calm, sparse look:

1. **At most 4 KPI tiles.** One number each, one short subline (≤ 8 words). No badges inside tiles.
2. **At most 4 sections** per view. Each answers ONE question with ONE chart (or one table). Cut or merge the rest — keep the most decision-useful.
3. **Never draw all six machine families stacked in one chart.** Use a family selector (segmented control: EUV · ArFi · KrF · …), or small multiples (one small chart per family, same layout), or group into 2–3 groups (EUV / DUV immersion / dry DUV) at most.
4. **Controls**: one row per chart, each group labelled like the portal (`<span class="ctl-l">Period</span><div class="fbg">…</div>`, wrap groups in `<div class="ctls">`). Max 2 groups.
5. **Text**: section subtitle ≤ 1 line. Source note (`.snote`) ≤ 2 short lines: source + one caveat. Method details, reconciliations and long caveats go inside the `details.tbl` dropdown under the table, not on the page. No side panels of prose next to charts; no boxes inside boxes.
6. Legends: only the series actually drawn; ≤ 6 entries.
7. Keep the chart non-negotiables (zoom, legend hides from table, table, units, estimates styled, nulls). Keep every number's source (in the dropdown if not in the note).
8. Charts get room: `.ch-wrap` 300px is the default height; don't squeeze two charts side by side unless both are small and related.
Don't delete data constants you might need later — just stop rendering what isn't necessary. Same contract as before: edit only your own `js/views/<id>.js`, verify in your own new Chrome tab (no console errors, one screenshot), close it, short report.
