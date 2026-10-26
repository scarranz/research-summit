# ASML Deep Dive: handoff for moving it into the portal

Status as of **Oct 26 2026**. SAB reviewed the dashboard and presented it. **The work is paused while the team thinks about what was presented.** Nothing goes into the portal until SAB picks it back up and says which parts move and how.

This file is the full record. Read it before touching ASML in the portal, or in this dashboard, again.

---

## 1. Where everything lives

| What | Where |
|---|---|
| Working copy of the dashboard (source of truth) | `C:\Users\santi\Downloads\asml_dashboard\`, open at `http://localhost:8010/asml_dashboard/index.html#<view>` (serve Downloads with a copy of `serve.ps1` and `-Root`) |
| Backup that moves between computers | this branch, `chore/asml-deep-dive-dashboard`, folder `research/asml/`. **Never merge and never open a PR** (Netlify would serve it publicly). |
| Shareable copy | Claude artifact https://claude.ai/artifact/BZzVUifFgUeDFHsYtyq8Ry (v12, "End markets + Investor Day 2030"). It is the same dashboard with the TSMC dashboard link removed. |
| Research notes and extracts | `research/asml/work/` (git keeps only the tools and the session notes). `work/data/` is gitignored because the repo is public; the local copy lives in `research-summit/asml-work/` |
| First single-file version | `Downloads\asml_dashboard_v1.html` (has the 7 YouTube clips; superseded) |
| ASML DCF workbook | `G:\…\Semiconductors - SAB\ASML\DCF ASML.xlsm`. **Do not open it while SAB has it open in Excel.** It is not in the Summit MCP. |
| Portal profile branch (separate track) | `feat/asml-profile`, local commit 4696bf2, not pushed. See `asml-work/SESION_2026-10-21.md` |

---

## 2. What the dashboard is now: 8 views

Sidebar (`js/app.js` NAV):
- **Business:** Machines · Installed Base · Overview
- **Revenue:** Revenue build
- **Customers:** Customers & Geography · TSMC Link
- **Margins:** GM Bridge & OpEx
- **Summary:** P&L & Multiples (*not built, shows "soon"*)

Every view follows `dashboard/BRIEF.md`:
- **v3 density rules:** at most 4 tiles and 4 unboxed sections, one chart per section, plain titles (not questions), and the method text inside the `details.tbl` dropdown.
- **The six chart non-negotiables** from `docs/CHART_ENGINE_REFERENCE.md` §0.

### 2.1 Machines (`pl.js`) — approved
- A clickable ladder of the 6 families: i-line, KrF, ArF dry, ArFi, EUV 0.33 NA, High-NA. Clicking a row opens its detail:
  - ASML press photo, wavelength, finest line and flagship tool.
  - FY2025 units and € from the 20-F (with the NXE/EXE split) and Bloomberg 2026E.
  - **"Chips it makes and where they go"** (added Oct 26): the chips it makes and the end markets those chips go to (`PL_END`). This is qualitative, from the 20-F FY2025 and asml.com. ASML does not report end-use per machine.
  - "Size & how hard it is to build".
- The **All lithography** row shows the only official split: Logic €16.1B (66%) and Memory €8.4B (34%) of 2025 system sales (20-F Note 2).
- Small multiples of units sold per family, plus ASML's capacity statements: 90 EUV/yr for 2025–26 and 20 High-NA/yr for 2027–28.
- Removed at SAB's request ("mucho relleno… se ve AI generated"): the DUV/EUV schematic, the chip loop, the video player, the build-facts lists, the illustrative +30% path and question-style titles.

### 2.2 Installed Base (`ib.js`)
Three sections:
- What is in IBM and what drives it.
- IBM over time and how far it can go: reported, Bloomberg, 2026 = 9M actual + Q4 guide, and the 2030 Investor Day range €11–13B.
- What management has said.

Sources: `work/data/ibm_research.md`.

### 2.3 Overview (`ov.js`) — still in the older layout, to be redone
Three sections:
- Quarterly net sales and margins.
- Where system sales came from.
- What management said (Q3 2026).

**Pending:** rewrite it in the calm layout. It goes last, once the other tabs are settled.

### 2.4 Revenue build (`rb.js`) — built Oct 26, replaces ASP Engine + Revenue Model
Tiles + 4 sections:

1. **Revenue by product line, 2015–2029E.**
   - Stacked lines: EUV (Low + High-NA), DUV, M&I, IBM.
   - Overlays: the Bloomberg revenue row, the 2026 point (9M + Q4 guide) and a **2030 column with the Investor Day range €44–60B and the moderate mark at €52B**.
   - Toggle between € and % of sales; in % mode the overlays are hidden.
   - The table includes a "2030 Investor Day" column (EUV 22/26/32, DUV 11/14/15 with M&I, IBM 11/12/13).
   - The 2015–2025 line totals tie to the 20-F totals (checked).
2. **Average price per system.** Family selector, annual or quarterly.
3. **System sales growth: volume, price, mix bridge.** Bloomberg consistency checks sit in a dropdown.
4. **Scenarios to 2030.**
   - Presets come from the Projection sheet (`work/data/add_projection.ps1`), and every driver is editable: units, € per system, M&I growth and IBM growth.
   - The **Line** selector (Total / EUV / Non-EUV + M&I / IBM) shows each line's 2030 Investor Day range.
   - A dropdown holds the full table of Investor Day targets against consensus and against the assumption for each driver.
- Dropped: the EUV price vs wafers-per-hour scatter.

Backups: `asp.v3.bak`, `rev.v3.bak`.

### 2.5 GM Bridge & OpEx (`gm.js`)
- Gross margin against guidance: quarterly, with the guide range given a quarter earlier, and Bloomberg.
- Path to the 2030 gross margin: 2026 guide ~56%, Bloomberg, and the 2030 range of 56–60%.
- Operating expenses: R&D and SG&A, with the 2030 targets.

Sources: `work/data/gm_opex_research.md`, `guidance_history.tsv`.

### 2.6 Customers & Geography (`cust.js`) — older layout
- Sales by region (Taiwan, Korea, China, USA, Japan, Rest).
- China share and the export-control record (numbered events).
- Customer concentration.
- Order book: bookings and backlog. ASML stopped publishing quarterly bookings.

### 2.7 TSMC Link (`tsmc.js`) — older layout
- Taiwan as a share of ASML compared with TSMC capex.
- Taiwan in quarterly system sales.
- EUV: ASML shipments, its capacity ceiling and TSMC's share.
- TSMC capex → implied ASML spend in 2026, with a sensitivity table.

Data from the TSMC dashboard v7. Plan: merge Customers & Geography and TSMC Link into a single **Customers & Taiwan** tab.

---

## 3. 2024 Investor Day targets (Nov 14 2024, for 2030) — already in the dashboard

Source: `work/data/targets.json` (`cmd_2024_11_14`) and the 20-F.

| Target | 2030 | Where it shows |
|---|---|---|
| Total revenue | €44 / 52 / 60B (low / moderate / high) | Revenue build §1 and §4 |
| EUV | €22 / 26 / 32B | Revenue build §4 (Line = EUV) |
| Non-EUV litho + M&I | €11 / 14 / 15B | Revenue build §4 |
| IBM | €11 / 12 / 13B | Installed Base; Revenue build §4 |
| Net system sales | €33–47B | targets table |
| Gross margin | 56–60% | GM Bridge |
| R&D | €6.0–6.6B | GM Bridge ▸ OpEx |
| SG&A | €1.7–1.9B | GM Bridge ▸ OpEx |
| Capex | ~€2.5B | targets table (goes into P&L & Multiples) |
| Tax rate | ~17% | targets table (goes into P&L & Multiples) |
| Cash conversion cycle | < 200 days | targets table |
| Semiconductor market | > US$1T in 2030, 9% CAGR 2025–30 | targets table |
| EUV litho spend CAGR 2025–30 | Logic 10–20%, DRAM 15–25% | targets table |
| Holistic lithography | > 15% CAGR | targets table |
| Applications TAM | €11B in 2030 (€5.4B in 2023, €7.6B in 2026) | targets table |

Finding visible on the chart: **the Bloomberg revenue row already goes past the top of the range (€60B) from 2028.**

---

## 4. Data sources, all frozen in the view files

- **ASML 6-K Q3'26** (Oct 14 2026, EDGAR 0001628280-26-065813). The slides and statements are JPGs, so the images have to be read.
- **20-F FY2025.** Units and € per family, the Logic/Memory split and the regions (`20f_split.txt`, `region_block.txt`).
- **Bloomberg consensus as of Oct 16 2026:** `bbg_s1.tsv` and `bbg_s2.tsv` (units, ASP, revenue, IBM, GM, opex). The walkthrough is in `SESION_2026-10-21.md`.
- **Investor Day Nov 2024:** `targets.json`.
- **Capacity quotes** (verified against the filings): `capacity_quotes.md`.
- **TSMC dashboard v7** (`Downloads\tsmc_dashboard_v7.html`), for the TSMC Link.

**Known data issues (to check before the portal):**
- In v7, "largest customer = TSMC" fails for 2015/17/18/23/24: the largest customer is bigger than all of Taiwan's sales.
- v7's EUV 2025 count of 48 includes High-NA.
- v7's 2028 Low-NA ceiling is 90, against ~110 (ASML +30% study) or 112 (Bloomberg).
- Bloomberg's total-units row is below the sum of the families (435 vs 440 in 2026E).
- Bloomberg's quarterly and annual IBM figures disagree.
- In the DCF workbook:
  - Q4 is empty for OP income, NI and CFO (take FY − 9M).
  - "Earnings" is comparable NI (Q3'26 4,826 vs 4,960 reported).
  - Q2'26 systems is rounded to 6,600.
- The Q3'26 call Q&A is pending: Quartr needs re-auth, and ASML blocks automatic download of the transcript.

---

## 5. How to move it into the portal (when SAB decides)

The portal has its own process: `docs/PROFILE_PLAYBOOK.md` via `/build-profile ASML`, one unit at a time, each approved by SAB and logged in `docs/profiles/ASML.md`. This dashboard is **input material** for that process, not code to paste in as-is.

Suggested mapping onto the Amazon spine (to be confirmed with SAB):

| Dashboard | Portal |
|---|---|
| Overview | Overview OV-1…OV-7 |
| Revenue build (§1 lines, §2 ASP, §3 bridge) | Deep Dive ▸ Top Line |
| Machines (end markets, families) | Deep Dive ▸ Top Line or Miscellaneous |
| Installed Base | Deep Dive ▸ Top Line (segment) |
| GM Bridge & OpEx | Deep Dive ▸ Bottom Line |
| Customers & Geography + TSMC Link | Deep Dive ▸ Miscellaneous (like TSM's "TSMC × ASML") |
| Scenarios to 2030 + Investor Day targets | Deep Dive ▸ Valuation / Evolution |
| P&L & Multiples (not built) | Valuation, once an ASML DCF is in the MCP |

Rules that apply when porting:
- **Charts:** a metric over time (revenue by line, GM, opex, IBM) should be a **dataset for `js/results.js`**, not a hand-written canvas. Bridges, waterfalls and the scenario tool are written by hand, but §0 still applies.
- **Colours:** Summit tokens; ASML's brand colours go only in the logo.
- **Language:** everything on screen in English.
- **Numbers:** frozen, dated data files. Nothing is live.
- ASML is **not in the Summit MCP** and **not in BBG_CONSENSUS.txt**, so Results/Estimates for ASML depend on San/Oscar adding the model, or on loading the Bloomberg file by hand.
- Do not copy the `*.bak` files or the `registerView` structure. The portal uses ES modules and `.ovt-*` / `dd-tab`.

---

## 6. Pending (paused)
1. SAB decides what goes into the portal and in what order (team discussion).
2. Customers & Taiwan (merge cust + tsmc) in the calm layout.
3. Overview in the calm layout.
4. P&L & Multiples (capex ~€2.5B, tax ~17% and the multiples go here).
5. The Q3'26 call Q&A.
