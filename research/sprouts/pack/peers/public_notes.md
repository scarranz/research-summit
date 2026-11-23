# Public grocery peers: notes, definitions, caveats

Data pack built on 2026-11-23 from SEC EDGAR: 10-K, 10-Q and 8-K earnings exhibits, plus data.sec.gov XBRL companyfacts for annual revenue, gross profit and operating income. Data file: `public.json`. Every figure carries a source key that maps to a filing URL and item. Fields we computed are listed per year in `derived`. Anything not disclosed is `null`.

## Fiscal calendars: line up periods before comparing

| Ticker | FY end | "Latest FY" here | Notes |
|---|---|---|---|
| SFM | Sun. closest to Dec 31 | FY2025 (Dec 28, 2025) | FY2026 is a 53-week year |
| NGVC | Sep 30 | **FY2026** (Sep 30, 2026) | 10-K not yet filed; FY2026 comes from the 8-K of 2026-11-19 |
| KR | Sat. nearest Jan 31 | FY2025 (Jan 31, 2026) | FY2023 = 53 weeks |
| ACI | Last Sat. of Feb | FY2025 (Feb 28, 2026) | **FY2025 = 53 weeks**; 16/12/12/12-week quarters |
| PUBLIX | Last Sat. of Dec | FY2025 (Dec 27, 2025) | FY2022 = 53 weeks |
| COST | Sun. nearest Aug 31 | **FY2026** (Aug 30, 2026) | Q4 = 16 weeks; FY2023 = 53 weeks |
| WMT | Jan 31 | FY2026 (Jan 31, 2026) | Walmart's label is one year ahead of KR/TGT for the same period |
| TGT | Sat. nearest Jan 31 | FY2025 (Jan 31, 2026) | FY2023 = 53 weeks |
| WMK | Last Sat. of Dec | FY2025 (Dec 27, 2025) | FY2022 = 53 weeks |

**Latest quarter used:** SFM Q3-26 (Sep 27) · NGVC Q4 FY26 (Sep 30) · KR Q2 FY26 (Aug 15) · ACI Q2 FY26 (Sep 12) · PUBLIX Q3-26 (Sep 26) · COST Q4 FY26 (Aug 30; Q1 FY27 not reported yet) · WMT Q3 FY27 (Oct 31) · TGT Q3-26 (Oct 31) · WMK Q3-26 (Sep 26).

## Comparable / identical sales: definitions differ

| Ticker | Name | Fuel | E-commerce | Comp-base entry | Other quirks |
|---|---|---|---|---|---|
| SFM | Comparable store sales | n/a (none sold) | included in store sales | from week 61 after opening | closed stores excluded from the day of closure |
| NGVC | **Daily average** comparable store sales | n/a | — | from month 13 after opening | divides by number of days; relocations/remodels stay in the base |
| KR | **Identical** sales **ex fuel** | excluded | Delivery included (with rules for fulfillment centers) | 5 full quarters without expansion or relocation | FY24/25 exclude Colorado strike stores (Adjusted Items) |
| ACI | **Identical** sales **ex fuel** | excluded | DTC digital included | stores open in both periods, compared **daily** | acquired stores comp after 1 year |
| PUBLIX | Comparable store sales | (no material fuel) | — | open the same weeks in both periods | **replacement stores included** |
| COST | Comparable sales | **included** (an "adjusted" series excludes gas and FX) | e-commerce sites >1 yr included | >1 year, incl. remodels and relocations | headline = US segment; 10-K rounds, so the 8-K precise figures are used |
| WMT | Calendar comparable sales (10-K) / comp ex fuel (quarterly) | 10-K reports **with** fuel plus a separate fuel impact | **all digitally initiated sales incl. advertising** | open 12 months, incl. remodels, relocations, conversions | Walmart U.S. segment only |
| TGT | Comparable sales | n/a | digitally originated merchandise sales included | open ≥13 months | merchandise sales only (excludes advertising and credit-card income) |
| WMK | Comparable store sales | headline **ex fuel** (incl-fuel also given) | — | after 5 full quarters | relocated/expanded stores included; FY2023 adjusted for the 53rd week |

**2026 drug-pricing distortion:** The Medicare "maximum fair price" (IRA) rule took effect on 2026-01-01. It depresses pharmacy-heavy comps in 2026: KR ~-138 bp, WMT ~-70 bp, plus PUBLIX, WMK and ACI (qualitative or $ amounts disclosed). SFM, NGVC and COST have little or no exposure (Costco pharmacy is small). Read 2026 comps with that in mind.

## Margins: comparability warnings

- **Gross margin definitions differ a lot.** KR excludes rent and D&A from cost (its GM looks low-cost-loaded but omits occupancy). NGVC includes store occupancy in COGS. SFM includes DC and supply-chain costs and their D&A. COST includes fresh-department labor and excludes membership fees, which are most of its profit. WMT U.S. GM is **derived** from segment net sales less segment cost of sales.
- **Fuel dilutes GM% and inflates sales** at KR, ACI, COST, WMK (and Sam's, which is not included). SFM, NGVC and TGT sell no fuel.
- **Operating margins are GAAP and include one-offs.** KR FY2025 1.28% includes **$2.5B** of fulfillment-network impairment (adjusted FIFO op. profit ≈ $4.9B). KR FY2023 includes a $1.5B opioid settlement. ACI FY2025 0.87% is GAAP. TGT Q3-26 includes ~1.1 pp of tariff refunds. PUBLIX operating profit includes other operating income.
- **COST:** GM is total company. The operating margin shown is **US segment OI / US segment total revenue (incl. membership fees)**, derived. The total-company figure is in `om_basis`.
- **WMK:** FY2023 and FY2024 were **restated** in the FY2025 10-K (meat-plant inventory error); restated values are used. The MD&A shows GM 25.1% for FY2025, but GP / net sales from its own income statement is 25.01%. We report the computed figure and flag it.

## Stores and square footage

- Store growth is year-end over year-end and always **derived**, except NGVC FY2024 and FY2025 (company-reported "store unit count increase"). For KR, ACI, COST, TGT, WMT and WMK, net new stores are derived from end counts or from open/close tables.
- **WMT U.S. FY2024:** 4,717 to 4,615 (-102) as reported. The drop isn't explained in what we read; it may be reclassification or closures of small formats. Don't read it as organic shrinkage without checking.
- **COST:** headline `stores_end` is **US incl. Puerto Rico**; totals are in `*_total`.
- **Average sq ft** is derived (total sq ft / stores) for KR (sq ft rounded to millions), ACI, PUBLIX, COST-US, WMT-US and TGT. SFM reports it directly. WMK discloses "~49,000". NGVC discloses **selling** sq ft (~11,000) for FY2025 but we derived **gross** sq ft for FY2024 (~16,100), so the two NGVC figures are on different bases. Formats differ hugely: NGVC ~11k selling, SFM ~27k, WMK/ACI/PUBLIX ~47-50k, KR ~67k, TGT ~126k, COST ~149k, WMT-US ~152k (supercenters 178k).

## Private label

- **Disclosed as % of sales:** SFM (just over 20% in FY23, 23% in FY24, 25% in FY25).
- **Disclosed as $ only, % derived:** KR ("over $39B" in FY25 vs "over $32B" in FY24; the FY25 definition counts fresh and service-case items without a Kroger brand, so the ~26% is **not like-for-like** with ~22%). ACI ($16.4-16.9B, ~20%).
- **Not disclosed in filings:** PUBLIX, COST (Kirkland Signature share), WMT, TGT (owned brands listed but no %), WMK, NGVC (brand exists, 119 new items in FY25, no %).

## SKUs / items per store

| Ticker | Figure | Source |
|---|---|---|
| COST | <4,000 active SKUs per warehouse | 10-K FY2026 Item 1 |
| NGVC | ~20,000 SKUs per comparable store (~6,500 supplements) | 10-K FY2025 Item 1 |
| WMT | ~120,000 items per **supercenter** | CFO B. Biggs via Talk Business & Politics, 2019-03-28 (dated, not a filing) |
| KR | >13,000 **private-label** items on average per store (total not disclosed) | 10-K FY2025 Item 1 |
| ACI | Own Brands >14,000 unique items (company-wide, not per store) | 10-K FY2025 Item 1 |
| SFM, PUBLIX, TGT, WMK | not disclosed | — |

SFM: trade press attributes "~18,000-20,000 SKUs" to management, but we could not reach a dated primary or reputable article (supermarketperimeter.com returned 403). It is left null. Worth confirming from an SFM investor presentation or transcript if needed.

## Scope warnings by company

- **TGT** is a general-merchandise retailer. Food & beverage is only ~23-24% of merchandise sales, so comps and margins reflect apparel, home and hardlines.
- **WMT** figures are the **Walmart U.S. segment** only. Grocery is ~59% of segment net sales (derived from the revenue note).
- **COST** is ~53% food (Foods & Sundries + Fresh); the rest is non-foods plus large gas and ancillary revenue.
- **PUBLIX** is employee-owned (no traded stock) and gives no guidance.
- **KR** has a pending acquisition of Giant Eagle (announced 2026-07-01). **ACI** withdrew FY2026 guidance on 2026-10-13. **SFM** guided FY2026 comps to ~-1.7% with Q4 at -2% to -4%. This is the first negative year in the series and a notable change versus the 7%+ comps of 2024-25.

## Gaps (null in the JSON)

- KR latest-quarter store count (not in the Q2 10-Q or release).
- NGVC FY2026 square footage (10-K not yet filed).
- Private label %: PUBLIX, COST, WMT, TGT, WMK, NGVC.
- SKUs: SFM, PUBLIX, TGT, WMK, plus total SKUs for KR and ACI.
- Comp or opening guidance: COST, WMT-US, TGT (only sales and margin guidance), PUBLIX and WMK (none), ACI (withdrawn).
