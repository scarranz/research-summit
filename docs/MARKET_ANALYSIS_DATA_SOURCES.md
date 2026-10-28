# Market Analysis — data sourcing context

Where the **Market Analysis** tab's numbers come from, at every level: sector,
industry, and (eventually) ticker. This is written to be portable — the goal
is to hand this document to another portal's team and have them wire up the
same data with the same rules, without guessing.

**Status: sector, industry group, and ticker levels all verified (2026-09-03).**
Ticker-level sourcing (mapping each company to its GICS classification) is
in `js/gics-industry-map.js` — see §5.

---

## 1. The hierarchy

GICS (Global Industry Classification Standard), maintained jointly by S&P
Dow Jones Indices and MSCI, is the taxonomy: **11 sectors → 25 industry
groups → 74 industries → 163 sub-industries.** We track the first two levels
daily. A company is classified by GICS according to where >60% of its
revenue comes from.

Everything below is sourced from **one provider only** — State Street Global
Advisors (SSGA), the issuer of the SPDR fund family — so every number in the
tab traces back to a single, regulated, publicly-auditable source rather than
a mix of vendors.

---

## 2. Sector level — 11 GICS sectors

Each sector has a dedicated, highly liquid **Select Sector SPDR** ETF. Together
the 11 hold every stock in the S&P 500, sorted by sector — this is literally
the tradeable index-fund expression of GICS at the sector level.

| GICS sector | Ticker | Fund |
|---|---|---|
| Energy | `XLE` | Energy Select Sector SPDR |
| Materials | `XLB` | Materials Select Sector SPDR |
| Industrials | `XLI` | Industrial Select Sector SPDR |
| Consumer Discretionary | `XLY` | Consumer Discretionary Select Sector SPDR |
| Consumer Staples | `XLP` | Consumer Staples Select Sector SPDR |
| Health Care | `XLV` | Health Care Select Sector SPDR |
| Financials | `XLF` | Financial Select Sector SPDR |
| Information Technology | `XLK` | Technology Select Sector SPDR |
| Communication Services | `XLC` | Communication Services Select Sector SPDR |
| Utilities | `XLU` | Utilities Select Sector SPDR |
| Real Estate | `XLRE` | Real Estate Select Sector SPDR |

**Note:** the portal currently labels this sector "Technology" (`SCOLS`,
`SDATA` in `js/portal-data.js`). GICS's official name is **Information
Technology**. Cosmetic, but worth fixing before this is shared externally.

Source: [ssga.com — Select Sector ETFs](https://www.ssga.com/us/en/intermediary/capabilities/equities/sector-investing/select-sector-etfs)

---

## 3. Industry group level — 25 GICS industry groups

Below each sector, SSGA also publishes narrower **Select Industry SPDR**
ETFs for many (not all) industry groups. Where one exists, it's the more
precise daily read; where none exists, the sector ETF above is the fallback
— **not** a proxy we invented, but the same rule GICS itself implies (an
industry group with no dedicated fund still rolls up into its sector).

| Sector | GICS industry group | Tracking ETF | Coverage |
|---|---|---|---|
| Energy | Energy Equipment & Services | `XES` | dedicated |
| Energy | Oil, Gas & Consumable Fuels | `XOP` | dedicated |
| Materials | Metals & Mining | `XME` | dedicated |
| Materials | *(Chemicals, Construction Materials, Containers & Packaging, Paper & Forest Products)* | `XLB` | sector fallback |
| Industrials | Transportation | `XTN` | dedicated |
| Industrials | Capital Goods (Aerospace & Defense sub-industry) | `XAR` | partial — Aerospace & Defense only |
| Industrials | Capital Goods (rest) / Commercial & Professional Services | `XLI` | sector fallback |
| Consumer Discretionary | Consumer Discretionary Distribution & Retail | `XRT` | dedicated |
| Consumer Discretionary | Consumer Durables & Apparel (Homebuilding sub-industry) | `XHB` | partial — Homebuilders, plus adjacent Building Products/Home Furnishings/Home Improvement Retail/Household Appliances sub-industries |
| Consumer Discretionary | Automobiles & Components / Consumer Services / Durables & Apparel (rest) | `XLY` | sector fallback |
| Consumer Staples | Consumer Staples Distribution & Retail | `XRT` | dedicated (shared with Discretionary retail) |
| Consumer Staples | Food, Beverage & Tobacco / Household & Personal Products | `XLP` | sector fallback |
| Health Care | Pharmaceuticals, Biotechnology & Life Sciences (Biotech) | `XBI` | partial — Biotech only |
| Health Care | Pharmaceuticals, Biotechnology & Life Sciences (Pharma) | `XPH` | partial — Pharma only |
| Health Care | Health Care Equipment & Supplies | `XHE` | dedicated |
| Health Care | Health Care Providers & Services | `XHS` | dedicated |
| Financials | Banks | `KBE` (also `KRE` — regional banks) | dedicated |
| Financials | Financial Services (Capital Markets sub-industry) | `KCE` | partial — Capital Markets only |
| Financials | Insurance | `KIE` | dedicated |
| Information Technology | Semiconductors & Semiconductor Equipment | `XSD` | dedicated |
| Information Technology | Software & Services | `XSW` | dedicated |
| Information Technology | Technology Hardware & Equipment | `XLK` | sector fallback — dedicated fund (`XTH`) existed but was liquidated by SSGA in June 2020 |
| Communication Services | Telecommunication Services | `XTL` | dedicated |
| Communication Services | Media & Entertainment | `XLC` | sector fallback |
| Utilities | *(Electric, Gas, Multi, Water, Independent Power)* | `XLU` | sector fallback — no dedicated SPDR for any |
| Real Estate | Equity REITs | `RWR`¹ | dedicated |
| Real Estate | Real Estate Management & Development | `XLRE` | sector fallback |

Source: [ssga.com — GICS Sector and Industry Map](https://www.ssga.com/us/en/intermediary/capabilities/equities/sector-investing/gics-sector-and-industry-map)
and [ssga.com — Sector and Industry ETFs](https://www.ssga.com/us/en/intermediary/capabilities/equities/sector-investing/sector-and-industry-etfs).

¹ `RWR` tracks a **Dow Jones** U.S. Select REIT index, not an S&P Select
Industry index like every other fund in this table — still issued by SSGA,
still Equity-REITs-only (excludes mortgage/hybrid/specialty REITs), so it's
the right fund; it's just the one exception to the index family.

**Verification status:** the two rows that came back ambiguous from the
first AI-summarized pass are now resolved — `XAR` is confirmed (SEC filing
text) to track only the Aerospace & Defense sub-industry of Capital Goods,
and Technology Hardware & Equipment's dedicated fund (`XTH`) turned out to
have been liquidated by SSGA in June 2020, confirming today's `XLK` fallback
is correct rather than an oversight. `XRT`'s dual Discretionary/Staples
retail coverage was also confirmed directly against its index's sub-industry
list.

**Fully verified 2026-09-03** against a live screenshot of the SSGA "Sector
and Industry ETFs" page (that page renders as a JS app automated fetches
can't read as a table, so this needed a human screenshot). The screenshot's
"Industry ETFs" table lists SSGA's complete current industry-fund lineup and
confirms two things: `XME`, `XTN`, `XES`, `XPH`, `XHE`, `XHS` all match this
table exactly, and — because the table is exhaustive — every row still
marked "sector fallback" above genuinely has no dedicated fund today (none
snuck in since this doc was written). Two funds appear on the live page that
are deliberately **not** in this table: `XLSR` (US Sector Rotation ETF, an
active multi-sector strategy, not a single-sector tracker) and `XNTK` (NYSE
Technology ETF, a broad NYSE-tech benchmark that doesn't correspond to the
GICS Technology Hardware & Equipment sub-industry specifically). The
"Sector with Income" variants (`XLCI`, `XLYI`, etc.) are covered-call
overlay products on top of each sector, not plain sector exposure, and are
excluded for the same reason.

---

## 4. Update cadence

Three different things change on three different clocks. Don't conflate them.

| What | Cadence | Source |
|---|---|---|
| **Company universe** (which tickers are in the S&P 500, and therefore which sector/industry they roll into) | Quarterly scheduled rebalance — effective the Monday after the 3rd Friday of March, June, September, December — plus ad-hoc changes anytime for M&A, bankruptcy, or delisting | S&P Dow Jones Indices announcements |
| **ETF holdings** (exact constituent weights inside SPY and every SPDR sector/industry fund) | Published daily, end of trading day | ssga.com fund pages (each fund has a daily holdings file) |
| **ETF price / return** (what feeds the "Sector Alpha" bars and daily performance) | Continuous intraday; the portal should use the **official daily close** as its one figure per day, same pattern `SECTOR_RETS` already uses in `js/market-analysis.js` | Any market data feed, keyed to daily close |

Practical read: the sector/industry **ETF list itself is stable** (SSGA
doesn't add or remove Select Sector/Industry funds often), but the
**membership under each ETF drifts quarterly** with the index. A ticker's
sector/industry tag should be treated as correct only as of the last
reconstitution, not permanently.

Source: [S&P 500 rebalance schedule reporting, 2026](https://www.stocktitan.net/articles/nasdaq-100-sp-500-rebalance-june-2026) and [SPY fact sheet, ssga.com](https://www.ssga.com/library-content/products/factsheets/etfs/us/factsheet-us-en-spy.pdf).

---

## 5. Ticker-level GICS re-tag (done 2026-09-03)

**The portal's existing per-stock `s`/`i` tags in `js/portal-data.js` are not
GICS.** The 11-value `s` (sector) label happens to match GICS sector names,
but the 50-value `i` (industry) label is a *different*, non-GICS vendor
taxonomy — things like "Media & Publishing" or "Diversified Retail" — that
doesn't map 1:1 to the 25 GICS industry groups in §3.

All 504 tickers have now been re-tagged to their correct GICS industry group
(using §3's taxonomy as the target) and written to **`js/gics-industry-map.js`**
— a new, separate lookup file, deliberately **not** merged into
`portal-data.js`, since that file is off-limits for Claude to edit directly
per `CLAUDE.md`. Each entry carries `sector`, `gicsIndustryGroup`, a
`confidence` (`high`/`medium`/`low`), and a `note` explaining any judgment
call. It was built as a (sector, vendor-industry) → GICS-industry-group
crosswalk covering the ~65 clean pairs, plus ~35 explicit per-ticker
overrides for cases the crosswalk alone couldn't resolve (a vendor bucket
splitting across multiple correct GICS groups, or a wrong vendor tag).

**9 tickers are flagged `medium`/`low` confidence** and worth a second pair
of eyes: `BRK.B`, `DASH`, `TDY`, `FSLR`, `FIS`, `VLTO`, `CSGP`, `CDW`, `POOL`
— see each one's `note` in `js/gics-industry-map.js` for the specific reason.

**Data-quality issues found in `js/portal-data.js` along the way** (not
fixed there, per the file being off-limits — flagging for whoever does own
that edit):
- **`CCL` (Carnival Corp)** has a broken industry tag (`#VALUE!`, a leaked
  Excel error).
- **`MCK` (McKesson)** and **`CAH` (Cardinal Health)** are tagged
  `Pharmaceuticals`, but both are pharmaceutical *distributors*, not
  drugmakers — their correct GICS industry group is Health Care Providers &
  Services, not Pharma/Biotech.
- **`VLTO` (Veralto)** is tagged sector `Health Care`; its actual GICS
  sector is Industrials (Environmental & Facilities Services). The re-tag
  file above tags it by its true sector/industry, not the vendor's.

**A GICS industry with no ETF proxy at all, found during the re-tag:**
**Life Sciences Tools & Services** (`IQV`, `CRL`, `TECH`, `MTD` — IQVIA,
Charles River Labs, Bio-Techne, Mettler-Toledo) is a real third industry
inside the Pharma/Biotech/Life Sciences group, alongside Biotech (`XBI`)
and Pharma (`XPH`) from §3 — but SSGA has no dedicated fund for it. These 4
tickers are tagged `Life Sciences Tools & Services` in the map file with no
corresponding ETF; treat that combination as a known gap, same class of
limitation as the six sector-fallback-only industries below.

Six industry groups have **no dedicated SPDR fund at all** and always fall
back to their sector ETF (Commercial & Professional Services, Automobiles &
Components, Consumer Services, Food/Beverage/Tobacco, Household & Personal
Products, Real Estate Management & Development, and all four Utilities
industries). That's a real data limitation, not an oversight — there is no
safe, verifiable daily industry-level read for those today.

---

## 6. Handoff status — what's ready to wire up vs. what's still to build

This section exists so whoever picks this up next doesn't have to
re-derive it by reading the code. Checked against `js/market-analysis.js`
as of 2026-09-03.

**Ready — a live feed is a data swap, not new architecture:**
- The taxonomy and sourcing rules in §1–§4, and the per-ticker classification
  in `js/gics-industry-map.js`, are the complete conceptual map: which ETF
  is which sector/industry, how each data type's cadence works, and which
  GICS group every one of the 504 tickers belongs to.
- The **sector level** in the code is already built for this: `getMarketSnapshot()`
  and `getSectorYtd()` (`js/market-analysis.js` lines 4–32) are explicitly
  commented as the single seam live data should flow through. `SECTOR_RETS`
  (line 487) is already labeled "Sector returns from SPDR ETFs (actual
  market data)" — i.e. the code already assumes the same XLE/XLK/etc. source
  this doc verifies; today it's just a hardcoded object instead of a fetch.
- **Reuse existing prior art for the live price connection** rather than
  building a third one: the TBBB company profile uses the **IBKR MCP**
  (`get_price_snapshot`), and the SoFi profile uses a **Supabase edge
  function `get-quote`**. Either pattern already works elsewhere in this
  codebase.

**Not built yet — this is new work, not a data swap:**
1. **No live price feed is actually connected.** `SECTOR_RETS` is static
   data today; picking and wiring one of the two patterns above (or another
   feed) to populate it daily is still to do.
2. **No industry-level UI exists at all.** `IMAP` (line 479) only powers a
   filter dropdown using the old non-GICS vendor tags — there is no
   industry-equivalent of the Sector Alpha bars today. Rendering §3's
   industry table is a new feature, not a reconnection of an existing one.
3. **The SSGA daily holdings-file URL isn't confirmed.** §4 states holdings
   publish daily per fund, but the literal downloadable endpoint per ticker
   hasn't been pinned down — needed before any holdings-level automation.
4. **No automated S&P 500 reconstitution feed.** The quarterly rebalance
   cadence in §4 is a documented rule, not a subscribed feed — a ticker's
   sector/industry tag today is only as fresh as the last manual check.
5. **9 flagged tickers and 3 data-quality issues are still open** (§5) —
   `BRK.B`, `DASH`, `TDY`, `FSLR`, `FIS`, `VLTO`, `CSGP`, `CDW`, `POOL` need
   a second look, and `CCL`/`MCK`/`CAH` have tag errors in `portal-data.js`
   that should be fixed before the mapping is treated as fully authoritative.
