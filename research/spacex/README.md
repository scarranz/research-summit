# SpaceX (SPCX) — standalone deep dive (Research ▸ SpaceX)

The SpaceX deep dive shown under **Research ▸ SpaceX** in the portal. Owner: SAB. It is a standalone dashboard
(its own sidebar, 16 pages) embedded in a same-origin iframe — the same way Industries embeds
`industry-embed.html` — so its CSS and JS cannot collide with the portal.

This is **not** the company profile (Companies ▸ SpaceX, built with the profile playbook on branch `feat/spcx-profile`).

## Where things are

| Path | What it is |
|---|---|
| `spacex-deep-dive/index.html` | The page the iframe loads. Script order: Chart.js → `js/core.js` → `js/data.js` → `js/data-model.js` → `js/model.js` → `js/views/*.js` → `js/app.js`. |
| `spacex-deep-dive/js/core.js` | Shared helpers: `registerView`, `chartBlock` (legend toggles hide series from table and totals, drag-zoom, data table), `sec`, `tile`, `seg`, `table`, palette `C`. |
| `spacex-deep-dive/js/data.js` | Reported figures (Q3 2026 release and 10-Q, 424B4): 9M income statement, balance sheet, segment KPIs, contracts, defense, Street targets. |
| `spacex-deep-dive/js/data-model.js` | `CONS` = Bloomberg consensus (BEst) pulled Nov 25 2026 (index 0 = 2025A … 5 = 2030E); `JPM` = J.P. Morgan Oct 21 2026; `DEBT`; `PRICE` (last close, refreshed on each update). |
| `spacex-deep-dive/js/model.js` | Scenario engine used only by Financials ▸ "The forecast and what drives it" and the financing inputs of Cash & financing. |
| `spacex-deep-dive/js/views/<id>.js` | One file per page. Menu order and grouping: `NAV` in `js/app.js`. |
| `research/spacex/sources/` | Public sources the numbers come from: `SPCX_424B4_Prospectus.md`, `SPCX_10-Q_2Q26.md`, `SPCX_10-Q_3Q26.md`, the Q2/Q3 2026 earnings releases, `SPCX_calls_2Q26_3Q26.txt` (call transcripts — every quote on the page must match it word for word) and `ELON_MEDIA_GUIDE.md` (Musk interviews and stated targets). |

**Not in this repo (the repo is public):** SAB's working notes (`SPCX_DeepDive.md`), the sell-side reports (J.P. Morgan,
UBS, Deutsche Bank, Mizuho, Needham, Clear Street, Barclays, Wells Fargo), the Bloomberg consensus export and the
Bloomberg SPLC. They stay in SAB's Drive folder `Summit/Docs/Extras/Team/SAB/Company Analisys/SpaceX/` — ask SAB for access.

## Pages

The company: Overview · Financials (income statement on consensus, with growth and margins) · Cash & financing
(consensus cash flow; only the financing choices are inputs; sources & uses chart and bridge) · Customers · Management & ownership.
Segments: Segment economics · Starlink · Starship & launch · AI & compute · Defense.
The thesis: Orbital compute · Why this operator · What can go wrong. Reference: Stated targets · Sources & open questions.
Valuation: pick a year, set revenue, net margin and P/E → market cap → price per share, against consensus.

## Rules the content follows (keep them)

- **Primary sources first** — filings, releases, call transcripts. Sell-side and press are allowed but labelled on the page
  ("Sell-side", "Press report only"); our own inferences are labelled "Our inference" / "Our read".
- **Consensus only** in the income statement, Cash & financing and Valuation defaults (SAB, Nov 25 2026). Bloomberg fields come
  from different analyst sets, so lines don't always add up — grey "reconciling" rows show the gap instead of hiding it.
- **Frozen data.** Nothing is fetched at runtime; the price is the last close in `PRICE`.
- **Open items:** whether the 455.8M-share early lock-up release was triggered; Roelof Botha's board seat (FT report, not yet in a filing).

## Changing it

1. Edit the page in `spacex-deep-dive/js/views/<id>.js` (numbers in `data.js` / `data-model.js`). A new page = a new view file +
   its `<script>` line in `spacex-deep-dive/index.html` + an entry in `NAV` in `js/app.js`.
2. Check it locally: serve the repo (e.g. `serve.ps1` on localhost:8000) and open `/spacex-deep-dive/index.html`; every page must load
   with no console errors and no `NaN` / `undefined`.
3. Branch + PR as usual (CLAUDE.md git workflow). After the merge Netlify deploys it.
4. The shared Claude artifact (https://claude.ai/artifact/3Rwq4EAtkKxvCqRzj52KWZ) is a copy SAB republishes from his account.
