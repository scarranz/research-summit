# Market Analysis — data sourcing context

Where the **Market Analysis** tab's numbers come from, at every level: sector,
industry, and (eventually) ticker. This is written to be portable — the goal
is to hand this document to another portal's team and have them wire up the
same data with the same rules, without guessing.

**Status: draft, sector + industry group levels only.** Ticker-level sourcing
(mapping each company to its GICS classification) is a separate, later step.

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
| Consumer Discretionary | Consumer Durables & Apparel (Homebuilding sub-industry) | `XHB` | partial — Homebuilders only |
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
| Information Technology | Technology Hardware & Equipment | `XLK` | sector fallback — no dedicated SPDR confirmed |
| Communication Services | Telecommunication Services | `XTL` | dedicated |
| Communication Services | Media & Entertainment | `XLC` | sector fallback |
| Utilities | *(Electric, Gas, Multi, Water, Independent Power)* | `XLU` | sector fallback — no dedicated SPDR for any |
| Real Estate | Equity REITs | `RWR` | dedicated |
| Real Estate | Real Estate Management & Development | `XLRE` | sector fallback |

Source: [ssga.com — GICS Sector and Industry Map](https://www.ssga.com/us/en/intermediary/capabilities/equities/sector-investing/gics-sector-and-industry-map)
and [ssga.com — Sector and Industry ETFs](https://www.ssga.com/us/en/intermediary/capabilities/equities/sector-investing/sector-and-industry-etfs).

**This table needs one manual pass** before it's treated as final: it was
compiled by fetching the SSGA mapping page through an AI summarizer, and a
couple of rows (Capital Goods, Technology Hardware & Equipment) came back
ambiguous between passes. Re-check those two directly on the live page before
this doc leaves the repo.

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

## 5. Open items before this integrates anywhere else

- **The portal's existing per-stock `s`/`i` tags are not GICS.** `js/portal-data.js`
  currently tags all 503 stocks with an 11-sector label that happens to match
  GICS sector names, but the industry label (`i`) is a *different*, non-GICS
  vendor taxonomy — 37 buckets like "Media & Publishing" or "Diversified
  Retail" that don't map 1:1 to the 25 GICS industry groups above. Re-tagging
  each ticker to GICS is the ticker-level step that comes after this doc.
- One row in the current data has a broken industry tag (`#VALUE!`, a leaked
  Excel error, on a Consumer Discretionary stock) — flagging it here since
  `js/portal-data.js` is off-limits for Claude to edit directly per
  `CLAUDE.md`; whoever does the GICS re-tag pass should fix it then.
- Six industry groups have **no dedicated SPDR fund at all** and always fall
  back to their sector ETF (Commercial & Professional Services, Automobiles &
  Components, Consumer Services, Food/Beverage/Tobacco, Household & Personal
  Products, Real Estate Management & Development, and all four Utilities
  industries). That's a real data limitation, not an oversight — there is no
  safe, verifiable daily industry-level read for those today.
