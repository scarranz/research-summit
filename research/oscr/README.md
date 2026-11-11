# Oscar Health (OSCR) — standalone research

**Not part of the portal.** SAB's decision (Nov 9, 2026): no `companies` row, no profile, no PR.
This folder only keeps the work so it can be resumed. Nothing here is loaded by the site.

## What is here

| File | What it is |
|---|---|
| `oscr-overview.html` | Source of the artifact https://claude.ai/artifact/9iFPYAMo9GzSXiHDhvR6SX (v12). Four tabs: **Overview** (playbook-style 7 blocks) · **How Oscar works** (per-$100 money flow) · **Investor Day 2026** · **Income statement** (inline drivers; scenarios Oscar plan Low/Mid/High and Our case (Consensus-like toggle removed Nov 11, 2026: it was nearly identical to Our case; BBG stays as comparison rows and chart bars); compare charts; EPS tornado and MLR×SG&A grid; P/E–PEG valuation). To update the artifact, copy this file to a scratchpad and publish it to the same URL. |
| `DRIVERS.md` | Nov 10, 2026: every guided driver by income-statement line (Investor Day transcript + slides 38–49, filings), inconsistencies, and the BBG consensus vs company targets. Base for the income statement (no DCF). |

## Rules for this company

- **Sources: Oscar's own documents only.** No Bloomberg consensus, no Summit MCP (OSCR is not in it), and no market data on the page.
- **DCF: built from scratch with SAB.** Do not use the old `G:\My Drive\Summit\Docs\Research\DCF\Insurance\3\DCF OSCR.xlsm` (May 2025).
- **Segments:** Oscar reports a single segment. Oscar / Lucie / Tech are the Investor Day "engines", not reported segments.

## Source documents (re-download from EDGAR / IR; not committed)

**SEC filings (CIK 1568651):**

| Document | Accession no. | Date |
|---|---|---|
| 10-K FY2025 | 0001568651-26-000011 | filed Feb 13, 2026 |
| 10-Q 3Q26 | 0001568651-26-000086 | Nov 5, 2026 |
| 8-K (earnings release, Ex. 99.1) | — | Nov 5, 2026 |
| 8-K (Investor Day) | 0001568651-26-000074 | Sep 16, 2026 |
| DEF 14A | — | Apr 22, 2026 |
| 424B4 IPO prospectus | — | Mar 4, 2021 |

**Investor Day materials** (https://ir.oscarhealth.com/news-events/investor-day):
- the 78-slide deck;
- the 4-page fact sheet.

The PDFs embed their text as glyph IDs, so text extraction returns nothing. Render the pages to PNG instead (WinRT `Windows.Data.Pdf`; see memory `pdf-text-extraction-windows`).

## Key numbers already pulled

**Results (US$ thousands):**

| | FY2024 | FY2025 | 9M26 |
|---|---|---|---|
| Revenue | 9,177,564 | 11,701,427 | 14,666,712 |
| Medical costs | 7,332,589 | 10,019,025 | 11,257,147 |
| Earnings from operations | 57,265 | −396,357 | 1,270,738 |
| Net income | 25,432 | −443,151 | 1,208,085 |
| MLR | 81.7% | 87.4% | 78.1% |
| SG&A ratio | 19.1% | 17.5% | 14.4% |

**Members:**
- 2,042,449 at Dec 2025, in 18 states;
- 2,691,885 at Sep 30, 2026, in 20 states.

**FY2026 guidance (Nov 5, 2026):**
- revenue $19.0–19.3B;
- MLR 80.5–81.5%;
- SG&A 15.1–15.6%;
- earnings from operations $850–950M.

**Investor Day 2029 targets:**
- revenue CAGR above 20% (2026–29);
- operating margin 5–7%;
- EPS $4.00+;
- MLR ~80% and SG&A below 15%;
- 18%+ national market share;
- $4.0–4.5B of capital generated over 2027–29.

**Assumptions behind the 2029 EPS:**
- ~$20M of interest and other expenses;
- a tax rate in the mid-20s;
- 331M diluted shares, growing 2–3% a year.

## Next

1. Get SAB's open confirmations on the Overview tab:
   - the wording of "The edge";
   - Key Fact cell 10 showing Members;
   - the competitor examples marked "our read".
2. Start the DCF from scratch with SAB. The Investor Day bridges are the natural skeleton for the assumptions:
   - revenue: existing markets 17–19 pts, new markets 2–4 pts, new products 2–4 pts;
   - margin: medical trend −5 to −7, price +5 to +7, efficiency +2 to +4;
   - the MLR and SG&A paths.
