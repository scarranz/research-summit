# Market History 1995-2005 — presentation context

Context file written as a deck: one section per slide, speaker notes under each. It tells the story the Market
History tab tells (Market Analysis ▸ second tab) so it can be turned into slides, or used to brief the CIO, without
opening the portal. Every figure comes from the analyst's Bloomberg workbook (`dot com analysis.xlsx`: S&P 500
members, weights and price returns at 11 year-end snapshots, Dec 1994 – Dec 2004) or from public series (FRED,
FINRA). Method and limits: `docs/MARKET_HISTORY.md`.

Ground rules of the study: the universe is the **S&P 500** only; **no multiples and no fundamentals**; no analogy is
assumed ("today is 1999" is never the premise); it reports base rates and what the index's own members did.

---

## Slide 1 — Title

**When a few names carry the index: what the S&P 500 did in 1995-2005, and what it says about today**

*Notes.* The file is called "dot com" only because that was the hypothesis. The study is about the movements and
reversals of the market in those years, measured on the index's own constituents.

---

## Slide 2 — The short version

1. The 1990s rally **narrowed before it broke**: through 1997 about four in five names rose each year; in 1999 the index gained +18% while the median stock was flat.
2. The break **began as a reversal of the leaders, not a crash**: in 2000 the index fell −7% while the average stock rose +8%.
3. The reversal was **long, not a bounce**: the 1995-99 winners trailed the 1995-99 laggards through 2005; the loss sat in Technology and Communications.
4. **Leaders survive as companies and still lose as stocks**: 9 of the 10 largest names of Dec 1999 are in the S&P 500 today, with a median 2000-05 return of −32%.
5. **Today shows the same breadth signature as 1998-99** on the same measures, with the top ten at 39% of the index versus 25% then. The data cannot say whether the rest of the pattern follows.

---

## Slide 3 — What we measured, and what we did not

- 11 year-end snapshots (30-Dec-1994 … 31-Dec-2004) × the 500 members of each; each window is the next calendar year (1995 … 2005).
- Opening weights (market cap; the S&P 500 was market-cap weighted, not float-adjusted, until the 2005 change), window price returns, BICS sector / industry group.
- Names are keyed on Bloomberg's FIGI, so a renamed or merged company keeps one identity.
- Today's side comes from SPY's year-end holdings already in the portal (2020 – 2026 YTD), through the same functions.
- **Not in the study**: multiples, profitability, revenue, companies that never belonged to the S&P 500, any forecast for a name.

*Notes.* The fixed-basket return tracks the published S&P 500 within 1.2 points every year except 2000 (−7.2% vs −10.1%), the cost of entries and exits during the year; we report the gap, we do not hide it.

---

## Slide 4 — Finding 1: until 1997 the rally was broad; in 1998-99 it narrowed

| | 1996 | 1997 | 1998 | 1999 |
|---|---|---|---|---|
| Index (cap-weighted) | +20.2% | +30.3% | +26.7% | +18.4% |
| Equal-weighted | +16.6% | +25.9% | +12.2% | +12.1% |
| Median stock | +15.1% | +23.8% | +4.7% | −0.2% |
| % of names up | 74% | 80% | 59% | 49% |
| % beating the index | 43% | 42% | 28% | 32% |

- In 1999 the best tenth of stocks gained +141% and the worst tenth lost 49%: dispersion (σ 57 points) was the widest in the file.
- The ten largest names went from 17.8% of the index (Dec 1994) to 24.8% (Dec 1999); names needed for half the weight fell from 59 to 33.

*Message.* The index return of 1998-99 was a minority's return.

---

## Slide 5 — Finding 2: the break began as a reversal of the leaders

- **2000**: fixed basket −7.2%; equal-weighted +8.2%; median stock +7.9%; 55% of names rose.
- The sectors the market had ignored rose: Utilities +42%, Health Care +38%, Financials +23%, Energy +16%. Technology fell −38%, Communications −37%.
- It became a general bear market in 2001-02 (44% and 27% of names up).
- Even then the ignored sectors fell far less. **Dec 1999 → Dec 2002**: Technology −69%, Communications −60%; Financials −6%, Health Care −5%, Utilities −2%.

*Message.* The first year of the reversal was a leaders' problem, not a market problem.

---

## Slide 6 — Finding 2b: not all of tech fell alike

Industry groups, Dec-1999 members (cap-weighted, members still in the index each year):

| Group | Weight Dec 1999 | 2000 | 2001-02 | 2003-05 | Dec 1999 → Dec 2005 |
|---|---|---|---|---|---|
| Tech Hardware & Semiconductors | 17.4% | −35% | −64% | +76% | −59% |
| Software & Tech Services | 9.3% | −43% | −20% | +19% | −46% |
| Telecommunications | 7.5% | −37% | −39% | +2% | −61% |
| Media | 5.8% | −38% | −33% | +10% | −55% |
| Health Care | 10.5% | +38% | −31% | +12% | +6% |
| Consumer Staple Products | 6.5% | +11% | −9% | +29% | +30% |
| Banking | 6.3% | +13% | −11% | +36% | +37% |
| Oil & Gas | 5.3% | +16% | −33% | +96% | +53% |

*Message.* Hardware and telecom (the physical build-out) took the largest hit through Dec 2002 (−76% and −62%); software fell less (−54%) but fell. None of the four had recovered by Dec 2005.

---

## Slide 7 — Finding 3: winners lost, laggards won, for six years

Method: rank the 500 names of the **Dec-1999 close** on their 1995-99 return. Nothing after that date forms the groups.

| Group | Names | % of index | 1995-99 | 2000-02 | 2003-05 | **2000-05** |
|---|---|---|---|---|---|---|
| Q5 winners | 91 | 55% | +344% | −36% | +38% | **−24%** |
| Q4 | 92 | 22% | +144% | −21% | +40% | +15% |
| Q3 | 91 | 9% | +64% | +5% | +48% | +42% |
| Q2 | 92 | 5% | +17% | +4% | +61% | +69% |
| Q1 laggards | 92 | 3% | −31% | −2% | +58% | **+35%** |

(Medians.) Cap-weighted, Dec 1999 = 100, Dec 2005: **Q5 68 · all Dec-1999 names 88 · Q1 186**.

*Message.* The top fifth held 55% of the index. It lost ground for six years, not one.

---

## Slide 8 — Finding 3b: it is not all winners, it is the tech and comm winners

- Technology + Communications winners (48% of Q5's weight): median **−46%** over 2000-05.
- The other winners (Health Care, Financials, Industrials, Staples…): about flat, **−2%**.
- Yet the non-tech laggards returned **+37%**: even outside tech the winners trailed.
- Did last year's winners keep winning? Median next-year return, prior top fifth minus bottom fifth, in points:

| 95→96 | 96→97 | 97→98 | 98→99 | 99→00 | 00→01 | 01→02 | 02→03 | 03→04 | 04→05 |
|---|---|---|---|---|---|---|---|---|---|
| +18 | +11 | +27 | +2 | **−40** | −17 | +30 | −27 | +4 | +16 |

*Message.* Momentum held through 1998, flipped in 1999-2000, came back in 2002 (the 2001 laggards kept falling) and flipped again in the 2003 rebound.

---

## Slide 9 — Finding 4: leaders survive as companies, lose as stocks

The ten largest names at Dec 1999 (weight → 2000-05 return → today):

| Name | Weight | 2000-05 | Today |
|---|---|---|---|
| Microsoft | 4.86% | −50% | in the S&P 500 |
| General Electric | 4.10% | −32% | in the S&P 500 |
| Cisco | 2.87% | −68% | in the S&P 500 |
| Walmart | 2.49% | −32% | in the S&P 500 |
| Intel | 2.23% | −39% | in the S&P 500 |
| Lucent | 1.91% | −95% | acquired |
| Pfizer | 1.66% | −28% | in the S&P 500 |
| Exxon | 1.58% | +39% | in the S&P 500 |
| IBM | 1.56% | −24% | in the S&P 500 |
| Citigroup | 1.52% | +25% | in the S&P 500 |

Median −32%; 9 of 10 still in the index.

*Message.* Being right about the company and wrong about the price were true at the same time.

---

## Slide 10 — The index renews itself by acquisition

Of the 500 names in the S&P 500 at **Dec 1994**: 131 are in it today (47% of the weight then), 279 were acquired, 30 went bankrupt (6%), 60 other (still listed outside the index or delisted otherwise).
At **Dec 1999**: 185 in the index today, 225 acquired, 29 bankrupt.

*Notes.* "Acquired" includes mergers of equals; the business lives on in the buyer. It counts as the name no longer existing, not as a failure. Bankruptcy counts the old equity (Kodak, Delta, American Airlines emerged; their old shares did not). The mortality is a feature of an index of the largest companies, not mostly a record of failures.

---

## Slide 11 — Finding 5: where the weight went

| | Dec 1994 | Dec 1999 | Dec 2004 |
|---|---|---|---|
| Technology + Communications | 21% | **40%** | 22% |
| Financials | 11% | 14% | **21%** |

Health Care and Energy also gained.

*Message.* What the market stopped paying for in 2000 was not automatically safe afterwards. The file ends in 2005 and cannot say how the rotation into Financials ended.

---

## Slide 12 — Finding 6: the same breadth signature is back, on the same measures

| | 1998 | 1999 | 2023 | 2024 | 2025 | 2026 YTD |
|---|---|---|---|---|---|---|
| Index (cap-weighted) | +26.7% | +18.4% | +24.3% | +23.1% | +16.6% | +13.0% |
| Equal-weighted | +12.2% | +12.1% | +12.5% | +10.9% | +9.6% | +11.3% |
| Median stock | +4.7% | −0.2% | +8.3% | +9.4% | +5.4% | +4.1% |
| % beating the index | 28% | 32% | 27% | 28% | 29% | 35% |
| Top-10 weight at start of the year | 18.5% | 21.1% | 24.4% | 30.9% | 37.5% | 39.4% |

For reference the top ten were **24.8%** of the index at Dec 1999 (the start of the 2000 window).

- Today's narrowness has lasted longer (three full years against two) and the top ten are a larger share (39% vs 25%).
- Caveats: SPY weights are float-adjusted, the 1990s weights full market cap; 2026 is year to date (to Oct 14, 2026).

---

## Slide 13 — What this data supports

- A rally can be carried by a minority of stocks for years before it reverses: the 1998-99 signature lasted two years, and the median stock was flat while the index rose.
- When the leaders reversed, the average stock did not fall first.
- Owning the winners at the 1999 price lost money for years even when the company did well.
- The first-half laggards were ahead of the winners through 2005, and the weight they received (Financials, Health Care, Energy) became the new concentration.
- Today's index return depends on a minority as much as 1998-99's, with higher concentration.

## Slide 14 — What it does not support

- That today is 1999, or that a reversal is due: breadth is a **condition, not a timing signal** (in 1998-99 it was visible two years before the break).
- Anything about profitability, revenue or valuation of the winners, then or now.
- A conclusion about what the 2000-05 rotation led to (the file ends in 2005).
- A forecast for any name.

---

## Slide 15 — Backdrop (public series, context only)

| | Value |
|---|---|
| Fed funds (monthly average) | 4.76% (Jun 1999) → 6.27% (May 2000) |
| 10-year Treasury | 4.53% (Oct 1998) → 6.66% (Jan 2000) |
| WTI crude | $11 (Dec 1998) → $30 (Mar 2000) |
| Investment in IT equipment & software | peak 2000Q4 $466B → low 2002Q4 $379B (−19%) |
| Semiconductor producer prices | 92 (Mar 2000) → 80 (Dec 2002) |
| Margin debt (FINRA) | peak Mar 2000, $300B |
| Unemployment | low 3.8% (Apr 2000) |
| Federal budget | +2.3% of GDP surplus (FY2000) |

*Notes.* Context for the story, not an explanation of it: there are no company fundamentals in the file. The portal tab also charts these and others (commodities, dollar, curve, Baa/Aaa spreads, capacity, housing, productivity). Market high / low dates marked on the charts are from memory and still to verify.

---

## Slide 16 — Limits to state when presenting

1. S&P 500 members only; a name that left the index before 2005 has its 2000-05 chain truncated, which flatters the laggards' side.
2. Fixed basket per year; entries, exits and weight drift inside the year are not modelled (see the 2000 gap).
3. Peaks are the highest **year-end** price observed, not the March 2000 high.
4. BICS sectors in the 1990s, GICS for today's concentration comparison: comparable, not identical.
5. Display names of 1990s companies (Lucent, Sun, SBC…) were written by hand from Bloomberg's successor names and are to be checked.

---

## Anticipated questions

- **"Is this 2000 again?"** The study does not say so. It says today's index return is as dependent on a minority as 1998-99's, and that in the last cycle that condition lasted two years before reversing and started with the leaders, not the average stock.
- **"Did everything that shone fall?"** No: the winners outside tech and communications were about flat (−2%); the technology and communications winners fell −46% (median).
- **"Did the laggards win?"** Relative to the winners, yes, for six years (Q1 186 vs Q5 68, Dec 1999 = 100); in absolute terms the Dec-1999 names ended −12%.
- **"Are these companies gone?"** Mostly acquired, not failed: 279 of 500 acquired, 30 bankrupt, 131 still in the index (Dec 1994 members).
- **"What about valuation?"** Not in the study by decision: it would need per-stock multiples from a consistent source.
