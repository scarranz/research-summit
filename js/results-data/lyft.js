// results-data/lyft.js — Lyft, Inc. (LYFT) dataset for the standardized "Results" tab.
//
// Compares REPORTED actuals against, per period:
//   guideLo / guideHi — Lyft's OWN guidance for that quarter, from the PRIOR quarter's
//             8-K Ex. 99.1 press release. Lyft guides exactly TWO lines every quarter —
//             Gross Bookings and Adjusted EBITDA — and nothing else, so every other
//             metric here carries no guidance band by design, not by omission.
//   summit  — Summit DCF model estimate, from the model's frozen per-quarter projections.
//             1Q24–4Q25 are identical across every vintage (genuinely frozen at print time);
//             1Q26 carries the pre-print 2026-02-11 snapshot and 2Q26 the live 2026-05-13 one.
//             ⚠ 2026-05-08 and 2026-05-13 are the SAME model state, so LYFT really has three
//             distinct vintages, not four. Net income and EPS stay null: the model's `earnings`
//             row is scale-corrupted (x378) in the Feb-11 vintage and its annual `op_income`
//             projections are broken and sign-wrong.
//   cons    — Street consensus right before the print. LYFT has no rows in the
//             BBG_CONSENSUS.txt archive, so there is no matrix to reconstruct: every value
//             here is COMPILED PER PRINT from earnings-day coverage, and a quarter with no
//             defensible published number is left null rather than filled by interpolation.
//             No single house covers every line, so the column is deliberately RAGGED — the
//             source is recorded per cell below rather than claimed to be uniform.
//
//             ⚠ THE COLUMN MIXES HOUSES. Zacks, LSEG, FactSet, StreetAccount and StockStory
//             all appear, and where two published a figure for the same line they disagree by
//             up to ~0.6% (4Q24 revenue: Zacks $1.55B vs StockStory $1.56B). Read a surprise
//             inside ±1.5% as noise, not as a beat or a miss.
//
//             REVENUE, per quarter:
//               1Q24 — NULL. Only a rounded "beat estimates by 10%" was published; back-solving
//                      it would invent precision the source does not have.
//               2Q24 $1,386M · 3Q24 $1,420M — Zacks.
//               4Q24 $1,560M — StockStory (paired with its EBITDA figure so the quarter stays
//                      on one basis). ⚠ Zacks published $1.55B for the same line.
//               1Q25 $1,470M — LSEG.      2Q25 $1,610M — FactSet.     3Q25 $1,700M — Zacks.
//               4Q25 $1,760M — Zacks, corroborated by coverage noting ADJUSTED revenue
//                      "matched analyst expectations of $1.76 billion".
//               1Q26 $1,640M — Investing.com (+13.1% YoY); StockStory had $1.63B same morning.
//               2Q26 $1,840M — current aggregate (~40 contributors). ⚠ A 31 Jul 2026 preview
//                      framed revenue as "+14% YoY", implying ~$1,810M — a ~2% spread.
//
//             ADJ. EBITDA: 4Q24 $103.9M · 2Q25 $124.4M · 1Q26 $130.7M (StockStory) ·
//               3Q25 $138.7M (earnings-day coverage: the $138.9M print "beat the estimate of
//               $138.7 million") · 2Q26 $169M (the consensus reported against the guide on
//               7 May 2026 — ~3 months stale, but the only published bar).
//
//             GROSS BOOKINGS: 4Q24 $4,320M (Zacks) · 1Q25 $4,150M (StreetAccount) ·
//               1Q26 $4,910M (TIKR) · 2Q26 $5,310M.
//
// ⚠ WHY THESE TWO ROWS ARE STILL RAGGED, AND WHAT WOULD FIX IT — searched Aug 3 2026 and
// deliberately NOT filled:
//   • 1Q24–3Q24 and 1Q25 adj. EBITDA, and 1Q24–3Q24 / 2Q25 / 4Q25 gross bookings: no house
//     published a per-metric figure in any accessible coverage of those prints. Most outlets
//     covered only revenue and EPS. Nothing to compile.
//   • 3Q25 gross bookings: coverage says the $4,780.4M print came in above "the $4.7 billion
//     the Street was expecting" — rounded to $0.1B. At that precision the true surprise sits
//     anywhere between +0.6% and +2.8%, straddling this file's own ±1.5% noise floor, so a
//     point estimate would be a fabrication dressed as data. LEFT NULL ON PURPOSE.
//   • 1Q24: only a rounded "beat estimates by 10%" was ever published. Same reasoning.
// THE FIX IS NOT MORE WEB SEARCHING — it is a Bloomberg or FactSet consensus export for LYFT,
// which would populate every cell at once and on one basis. Until then this column is a
// best-effort compilation and is labelled as such on screen.
//
// ⚠ AND NOTE WHAT IS **NOT** MISSING: Lyft GUIDES both of these lines every single quarter, so
// `guideLo`/`guideHi` are complete for gross bookings and adjusted EBITDA across all ten periods.
// The outside bar for exactly the two metrics with the raggedest Street coverage is therefore
// still fully populated — and it is arguably the better bar, since the Street largely takes the
// guide anyway (1Q26: guide midpoint $4,930M vs a $4,910M Street, a 0.4% gap).
//
//             RIDES / ACTIVE RIDERS: only where a house actually published a count —
//               rides 4Q24 218.65M (Zacks) and 1Q26 241.5M (TIKR); active riders 4Q24 24.41M
//               (Zacks). The 1Q26 rides figure matters: the print of 236.9M landed 1.9% UNDER it,
//               which is the quarter's real tell and is invisible without a consensus.
//
//             ⚠ EPS carries NO consensus except 1Q26. The $0.07 there is a GAAP estimate and
//             is comparable to this row. Aggregator EPS for 2Q26 (~$0.15), Zacks' $0.32 for
//             4Q25 and its $0.31 for 1Q26 are ADJUSTED/normalised figures — a different basis
//             from this row's GAAP diluted EPS. Mixing them would manufacture a fake surprise.
//
// ⚠ THE PATTERN THE COLUMN EXPOSES — worth carrying into any read of this name.
// Through 2024 the Street badly UNDER-modelled revenue (2Q24 +3.6%, 3Q24 +7.2% beats) because
// it was slow to price Lyft's take-rate expansion. From 4Q24 it over-corrected and has modelled
// revenue slightly HIGH ever since (−0.6%, −1.3%, −1.4%, −0.9%), while consistently
// under-modelling profitability (adj. EBITDA +8.6%, +4.0%, +1.6%). So the base rate for this
// name is a small revenue miss alongside an EBITDA beat — which means a small revenue miss is
// close to meaningless here, and the lines that carry information are EBITDA and the counts.
//
// All monetary values in US$ millions; EPS in dollars; rides and riders in millions.
// null = not available. Arrays are parallel to `periods`.
//
// STATUS: 2Q26 is UPCOMING — Lyft reports it on **Thursday, August 6, 2026, after close**
// (every Lyft release is after the close, so the scoreable reaction is the NEXT day).
// The latest reported quarter is 1Q26 (May 7, 2026).
//
// ⚠ THREE THINGS THAT MAKE PRINTED QUARTERS NON-COMPARABLE — all recorded in the metric
// notes rather than smoothed away:
//   1. FREENOW closed 31 Jul 2025 and first entered results in 3Q25 with only TWO MONTHS
//      of contribution. Lyft has NEVER quantified it, gave no organic-vs-reported split
//      and restated nothing. TBR Global (Oct 2025) and Gett UK (May 2026) compound it.
//   2. 4Q25 carries a $211.6M legal/tax/regulatory charge — $168M of it as CONTRA-REVENUE.
//      Gross Bookings and Adjusted EBITDA are NOT affected (the full amount is added back),
//      which is why 4Q25 shows bookings +19% against revenue +3%.
//   3. 4Q25 also carries a $2.9B deferred-tax valuation-allowance release. It hits net
//      income and EPS ONLY — non-cash, below the line.

export var lyftResults = {
  updated: 'Jul 2026',
  intro: 'How Lyft’s reported results have stacked up against what the company guided and what the Street expected. Lyft guides only two lines — Gross Bookings and Adjusted EBITDA — so those two carry a guidance band and the rest are shown as the reported record. The Street column is <b>compiled by hand, print by print</b>, because Lyft is not in our Bloomberg archive: it covers revenue back to 2Q24 and is deliberately ragged elsewhere, since a cell with no published figure is left blank rather than interpolated. It also mixes houses (Zacks, LSEG, FactSet, StreetAccount, StockStory), which disagree by up to ~0.6% on the same line — so read a surprise inside ±1.5% as noise. The regularity worth knowing: from 4Q24 on, Lyft has <b>missed revenue slightly and beaten adjusted EBITDA</b> almost every quarter, so a small revenue miss here is the base case rather than news. Pick a metric; each print shows the actual against every reference we have, with the surprise in percent. Periods marked “est.” are forward: guided, no actual yet. Read the metric notes before comparing quarters — the FREENOW acquisition and two one-off items in 4Q25 make parts of this series non-comparable, and on GUIDED lines the model mirrors the reported number once a quarter closes, so a zero surprise there is an artifact rather than a good call.',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Actuals and guidance from Lyft’s 8-K Exhibit 99.1 press releases on SEC EDGAR (CIK 0001759509). Guidance is the range issued for that quarter in the PRIOR quarter’s release. Lyft guides Gross Bookings and Adjusted EBITDA only.',
      metrics: {
        gb: { label: 'Gross Bookings', short: 'Gross bookings', group: 'Volume', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [3693.2, 4018.9, 4108.4, 4278.9, 4162.4, 4490.1, 4780.4, 5074.2, 4946.0, null],
          summit: [3258.8, 3625.7, 3798.5, 4235.2, 4135.3, 4532.1, 4731.2, 5076.2, 4937.5, 5363.4],
          cons:   [null, null, null, 4320, 4150, null, null, null, 4910, 5310],
          guideLo:[3500, 4000, 4000, 4280, 4050, 4410, 4650, 5010, 4860, 5300],
          guideHi:[3600, 4100, 4100, 4350, 4200, 4570, 4800, 5130, 5000, 5430],
          note: 'ℹ THE STREET COLUMN IS SPARSE HERE ON PURPOSE — only 4Q24, 1Q25, 1Q26 and the 2Q26 estimate had a per-metric consensus published anywhere; for the rest no house printed a bookings figure, and 3Q25 exists only as a rounded "$4.7 billion", too coarse to state as a point. Use the GUIDANCE BAND instead: Lyft guides this line every quarter, so the guide is complete across all ten periods — and it is the better bar anyway, since the Street largely takes the guide (1Q26: guide midpoint $4,930M vs a $4,910M Street). The headline volume line, and one of only two Lyft guides. It has landed inside or above the guided range in every quarter here. ⚠ From 3Q25 the series is NOT organic: FREENOW closed 31 Jul 2025 and contributed two months to 3Q25, with TBR Global added in Oct 2025 and Gett’s UK business in May 2026. Lyft has never disclosed the inorganic split, so the reported growth rate from 3Q25 onward mixes acquisition and underlying demand. The 2Q26 guide (+18–21%) is the first full quarter with both FREENOW and Gett.' },
        rev: { label: 'Revenue', short: 'Revenue', group: 'Volume', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [1277.2, 1435.8, 1522.7, 1550.3, 1450.2, 1588.2, 1685.2, 1592.7, 1650.5, null],
          summit: [1188.5, 1348.9, 1417.1, 1579.5, 1449.0, 1632.3, 1719.8, 1799.4, 1705.4, 1815.3],
          cons:   [null, 1386, 1420, 1560, 1470, 1610, 1700, 1760, 1640, 1840],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'Not guided, so the Street line is the only outside reference here. ⚠ READ THE SURPRISE COLUMN AS A REGIME, NOT AS A SCORE: through 2024 the Street under-modelled revenue badly (2Q24 +3.6%, 3Q24 +7.2%) because it was slow to price take-rate expansion; from 4Q24 it over-corrected and has modelled slightly high ever since (−0.6%, −1.3%, −1.4%, −0.9%). A sub-1.5% revenue miss on this name is the base case, not news — especially since the consensus column mixes houses that disagree by up to ~0.6% on the same line. ⚠ 4Q25 is distorted: a $168M CONTRA-REVENUE charge from legal, tax and regulatory reserve changes is inside the $1,592.7M — without it revenue would have been ~$1.8B. That single item is why 4Q25 shows revenue +3% against Gross Bookings +19%; do not read it as a collapse in take rate. ⚠ AND IT IS THE WHOLE STORY OF THE 9.5% "MISS" THIS TAB SHOWS FOR 4Q25: consensus was $1,760M, the print was $1,592.7M, and $1,760M is almost exactly what the quarter earned ex-charge. Coverage that looked at adjusted revenue said it "matched analyst expectations of $1.76 billion" — but the headline number is what cost the stock 17% the next day. Read this row\'s 4Q25 surprise as a disclosure artifact, not a demand miss.' },
        rides: { label: 'Rides', short: 'Rides', group: 'Volume', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [187.7, 205.3, 216.7, 218.5, 218.4, 234.8, 248.8, 243.5, 236.9, null],
          summit: [166.9, 184.3, 194.0, 221.2, 211.2, 237.8, 247.4, 256.5, 236.9, 254.3],
          cons:   [null, null, null, 218.65, null, null, null, null, 241.5, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'In MILLIONS of rides, not dollars — the unit label reads US$ because the engine has no count unit yet; read this line as a count. Not guided. ⚠ The 1Q26 Summit figure (236.9) equals the reported number exactly; treat that single point as mirrored, not forecast. THE DEMAND TELL, and it is now scoreable: the Street had 1Q26 rides at 241.5M and Lyft printed 236.9M — <b>1.9% short</b>, and a sequential DECLINE from 243.5M, in the same quarter bookings and revenue beat. At 1.9% the surprise sits just inside the engine’s 2% in-line tolerance, so the chip reads “in line”; judge it on the combination instead — under the Street, down sequentially, and beats on every other line all say the same thing, that price and mix carried the quarter rather than volume. Only two quarters carry a published rides consensus (4Q24 218.65M, met to within 0.1%; 1Q26 241.5M) because most houses do not publish a ride count at all.' },
        riders: { label: 'Active Riders', short: 'Active riders', group: 'Volume', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [21.9, 23.7, 24.4, 24.7, 24.2, 26.1, 28.7, 29.2, 28.3, null],
          summit: [19.6, 21.5, 22.4, 24.4, 23.9, 25.8, 27.0, 29.9, 28.6, 30.5],
          cons:   [null, null, null, 24.41, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'In MILLIONS of riders (same unit caveat as Rides). Not guided. The 3Q25 step from 26.1M to 28.7M coincides with FREENOW entering the base, so it is not a clean organic acceleration.' },
        ebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', group: 'Profitability', unit: 'usdM', marginOf: 'gb', marginLabel: 'Adj. EBITDA % of Gross Bookings',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [59.4, 102.9, 107.3, 112.8, 106.5, 129.4, 138.9, 154.1, 132.8, null],
          summit: [59.4, 102.9, 107.3, 110.2, 95.9, 134.2, 151.4, 160.8, 136.2, 173.6],
          cons:   [null, null, null, 103.9, null, 124.4, 138.7, null, 130.7, 169],
          guideLo:[50, 95, 90, 100, 90, 115, 125, 135, 120, 160],
          guideHi:[55, 100, 95, 105, 95, 130, 145, 155, 140, 180],
          note: 'THE LINE THAT CARRIES INFORMATION. Where a Street figure exists, Lyft has beaten or met it every time — 4Q24 +8.6%, 2Q25 +4.0%, 3Q25 +0.1%, 1Q26 +1.6% — while revenue was missing in those same quarters. ℹ Five of ten periods carry a Street number; no house published one for 1Q24–3Q24, 1Q25 or 4Q25. The GUIDANCE BAND is complete for all ten, so use it where the Street is blank. That is the shape of this business as the Street models it: profitability under-modelled, revenue over-modelled. ⚠ READ THE SUMMIT LINE WITH CARE HERE: for 1Q24–3Q24 the model’s “estimate” EQUALS the reported figure to the decimal (59.4 / 102.9 / 107.3). That is the model mirroring an actual on a closed guided line, not a perfect forecast — treat a zero surprise on those quarters as no information. The second and last guided line, and the one Lyft manages to. It has printed at or above the top of the guide in almost every quarter. The margin line is the one management is judged on — % of Gross Bookings, climbing from 1.6% to ~3.0%, against a ~$1B Adjusted EBITDA goal for 2027. ⚠ 4Q25 is CLEAN despite the charge: the full $211.6M is added back, so the $154.1M and its 3.0% margin are comparable.' },
        ni: { label: 'Net Income (GAAP)', short: 'Net income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'net margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [-31.5, 5.0, -12.4, 61.7, 2.6, 40.3, 46.1, 2755.1, 14.2, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: '⚠ THE 4Q25 FIGURE IS NOT EARNINGS. $2,755.1M includes a **$2.9B non-cash benefit** from releasing the valuation allowance on US federal and certain state deferred tax assets. Lyft’s FY2025 PRE-TAX result was a $53.2M LOSS. The release hits net income and EPS only — no effect on Gross Bookings, revenue, Adjusted EBITDA or free cash flow. This is also why screens show a ~2x trailing P/E for LYFT; never quote it unqualified. 4Q24 separately carries a $29.6M lease-termination gain.' },
        eps: { label: 'Diluted EPS (GAAP)', short: 'EPS', group: 'Profitability', unit: 'eps',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [-0.08, 0.01, -0.03, null, 0.01, 0.10, 0.11, null, 0.04, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, 0.07, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'Not guided. The two gaps are REAL, not missing data: Lyft’s Q4 releases present only the full-year income statement, so no standalone Q4 diluted EPS is ever printed (FY24 $0.06; FY25 $6.81 — the latter carrying the deferred-tax release). ⚠ ONLY 1Q26 CARRIES A STREET NUMBER, and deliberately so: the $0.07 there is a GAAP estimate, comparable to this row. The EPS figures that circulate for other quarters — ~$0.15 for 2Q26, Zacks’ $0.32 for 4Q25 — are ADJUSTED/normalised, a different basis from GAAP diluted EPS. Putting them in this row would manufacture a surprise out of a definition change, so they are left out.' },
        fcf: { label: 'Free Cash Flow', short: 'Free cash flow', group: 'Profitability', unit: 'usdM', marginOf: 'gb', marginLabel: 'FCF % of Gross Bookings',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [127.1, 256.4, 242.8, 140.0, 280.7, 329.4, 277.8, 227.6, 287.3, null],
          summit: [138.3, 256.0, 242.7, 86.5, 141.3, 257.4, 292.2, 310.7, 212.8, 276.6],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'Not guided quarterly, but it is one of the three 2027 targets — management raised the goal from ~$900M to over $1B, and FY2025 generation exceeded $1.1B. Runs consistently above Adjusted EBITDA, helped by the insurance-reserve build below.' },
        ins: { label: 'Insurance Reserves', short: 'Insurance reserves', group: 'Profitability', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [1391.0, 1489.6, 1592.6, 1701.4, 1823.5, 1947.9, 2070.6, 2180.4, 2245.0, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'The balance-sheet reserve, not an expense. It has risen every single quarter, from $1.39B to $2.25B — a steady build that flatters free cash flow while it accrues, and the single largest estimate on Lyft’s balance sheet. Management credits recent insurance reform and its own insurance strategies for a falling average cost per ride; this line is where that claim can be audited over time.' }
      },
      sections: [
        { key: 'top', label: 'Volume & Demand', defaultMetric: 'gb', groups: [
          { label: 'Marketplace', keys: ['gb', 'rev'] },
          { label: 'Demand (counts, in millions)', keys: ['rides', 'riders'] }
        ] },
        { key: 'margins', label: 'Profitability', defaultMetric: 'ebitda', groups: [
          { label: 'Company', keys: ['ebitda', 'ni', 'eps', 'fcf'] },
          { label: 'Balance sheet', keys: ['ins'] }
        ] }
      ]
    },
    // ── ANNUAL view ───────────────────────────────────────────────────────────
    // Pulled from the Summit model (snapshot 2026-05-13) via the MCP: FY actuals from
    // `actuals_history`, FY estimates from `projection_history`. EVERY actual was reconciled
    // against the quarterly series above and ties exactly — FY2025 revenue 6,316.3 = the four
    // reported quarters summed, gross bookings 18,507.1, adjusted EBITDA 528.9, free cash flow
    // 1,115.5, rides 945.5. Active riders is a POINT (the Q4 figure), never a sum.
    //
    // ⚠ THE SUMMIT COLUMN IS DELIBERATELY BLANK IN THE EARLY YEARS, and this is the audit
    // talking, not missing data. The model's stored projections for 2022–2023 are unusable:
    // adjusted EBITDA reads −2,325.2 for 2022 against a −416.5 actual (and the identical value
    // appears on the CFO line — a column misalignment, not a forecast), free cash flow is
    // SIGN-WRONG for 2023 (+187.4 against a −248.1 actual), and capex is POSITIVE for 2022–2023
    // where every actual is negative. Showing them would invent a forecasting record that never
    // existed. Adjusted EBITDA therefore starts at 2025, free cash flow and rides/riders at 2024.
    //
    // ⚠ CAPEX MIXES BASES ACROSS THE DIVIDE. The actuals here are the `DEFAULT` series
    // (FY2024 −83.5) but the model's own forward capex is struck on `SEGM` (FY2024 −161.5, the
    // ~2x gap flagged for the model owner). The Summit line therefore starts at 2026, where only
    // one basis exists, rather than pretending the history and the forecast are the same series.
    y: {
      label: 'Annual',
      note: 'Fiscal years. Actuals from Lyft’s 10-K/8-K filings as carried in the Summit model’s actuals history (each one reconciled against the quarterly series); the Summit column is the model’s own stored projection from the 2026-05-13 snapshot. No Street consensus exists at the annual level for this name — LYFT is not in BBG_CONSENSUS.txt — and Lyft gives no annual guidance, so both of those columns are empty by construction rather than unfilled.',
      metrics: {
        gb: { label: 'Gross Bookings', short: 'Gross bookings', group: 'Volume', unit: 'usdM',
          periods: ['2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [12057.3, 13775.1, 16099.4, 18507.1, null, null, null, null],
          summit: [null, 12372.1, 14918.2, 18474.8, 21785.1, 24822.6, 26768.6, 28604.0],
          cons:   [null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null],
          note: 'The line Lyft’s 2027 plan is written in: management’s stated goal is <b>~$25B</b>, and the model carries <b>$24.8B</b> — within a percent, so on volume the target is intact. Compounding steadily: $12.1B → $18.5B over three years, +15% in FY2025. ⚠ FY2025 is the first year that is NOT organic — FREENOW entered in August and TBR Global in October, and Lyft has never published the split.' },
        rev: { label: 'Revenue', short: 'Revenue', group: 'Volume', unit: 'usdM',
          periods: ['2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [4095.1, 4403.6, 5786.0, 6316.3, null, null, null, null],
          summit: [null, null, null, 6484.3, 7372.7, 8219.3, 8844.8, 9434.9],
          cons:   [null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null],
          note: 'Grew FASTER than bookings through 2024 (+31% against +17%) as take rate expanded — which is exactly why the Street kept under-modelling revenue that year. FY2025’s +9% is the slower side of that: the $168M contra-revenue charge in Q4 costs the full year about 2.7 points of growth. ⚠ The model mirrors the actual on 2022–2024, so those cells are omitted rather than shown as forecasts; FY2025’s 6,484.3 is a real estimate and came in 2.7% high.' },
        rides: { label: 'Rides', short: 'Rides', group: 'Volume', unit: 'usdM',
          periods: ['2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [598.5, 709.1, 828.2, 945.5, null, null, null, null],
          summit: [null, null, 766.4, 952.9, 1027.4, 1131.3, 1226.2, 1316.8],
          cons:   [null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null],
          note: 'In MILLIONS of rides (the engine has no count unit yet, so the axis reads US$ — read it as a count). 945.5M in FY2025, which management put as “30 rides a second”. The forward line asks for <b>1.0bn+ in 2026</b> — and Q1 2026 rides fell sequentially and came in under the Street, which is the first evidence against that ramp.' },
        riders: { label: 'Active Riders', short: 'Active riders', group: 'Volume', unit: 'usdM',
          periods: ['2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [20.4, 22.4, 24.7, 29.2, null, null, null, null],
          summit: [null, null, 24.4, 29.9, 33.0, 36.3, 39.6, 42.7],
          cons:   [null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null],
          note: 'In MILLIONS, and a POINT not a sum — the Q4 figure, so the annual series is the year-end level. The FY2025 jump 24.7M → 29.2M (+18%) is the largest in the record and coincides with FREENOW consolidating, so it is not a clean organic step.' },
        ebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', group: 'Profitability', unit: 'usdM', marginOf: 'gb', marginLabel: 'Adj. EBITDA % of Gross Bookings',
          periods: ['2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [-416.5, 222.3, 382.4, 528.9, null, null, null, null],
          summit: [null, null, null, 554.8, 691.1, 829.8, 995.7, 1016.3],
          cons:   [null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null],
          note: '⚠ THE LINE TO ARGUE ABOUT. The turnaround is real — <b>−$416.5M in 2022 to +$528.9M in 2025</b>, with margin on bookings going 0% → 2.9%. But set the forward line against management’s own <b>~$1B adjusted-EBITDA goal for 2027</b>: the model carries <b>$829.8M</b>, roughly <b>17% short</b>. In the margin view the assumed take of bookings flattens around 3.3–3.7% instead of reaching the ~4% the target implies. Bookings hit the 2027 goal; this line does not. ⚠ Summit starts at 2025 — see the header note on why 2022–2024 projections are excluded.' },
        fcf: { label: 'Free Cash Flow', short: 'Free cash flow', group: 'Profitability', unit: 'usdM', marginOf: 'gb', marginLabel: 'FCF % of Gross Bookings',
          periods: ['2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [-352.3, -248.1, 766.3, 1115.6, null, null, null, null],
          summit: [null, null, 688.3, 1088.3, 1185.0, 1080.3, 783.4, 793.5],
          cons:   [null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null],
          note: 'The cleanest part of the story: from <b>−$352M in 2022 to +$1,116M in 2025</b>, which is what let management raise the 2027 goal from ~$900M to over $1B. The model has FY2027 at <b>$1,080M</b>, so that target survives — but only just, and the line then FALLS to ~$783M in 2028 before flattening. ⚠ Flattered by the insurance-reserve build, which is cash in hand until the claims land. DEFAULT series; the SEGM basis reads FY2024 at 688.3 instead of 766.3.' },
        capex: { label: 'Capital Expenditure', short: 'Capex', group: 'Profitability', unit: 'usdM',
          periods: ['2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [115.0, 149.8, 83.5, 52.8, null, null, null, null],
          summit: [null, null, null, null, 85.8, 164.4, 132.7, 141.5],
          cons:   [null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null],
          note: 'Shown as POSITIVE spend (the model carries it as a negative outflow). This is the asset-light proof: capex never exceeds ~1.1% of gross bookings and has FALLEN in absolute dollars for three straight years while bookings grew 53%. ⚠ The Summit line starts at 2026 on purpose — the model’s forward capex is struck on the SEGM basis (FY2024 −161.5) while these actuals are DEFAULT (FY2024 −83.5), a ~2x gap flagged for the model owner. Splicing them would draw a step that is a basis change, not a spending decision.' },
        ins: { label: 'Insurance Reserves', short: 'Insurance reserves', group: 'Profitability', unit: 'usdM',
          periods: ['2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [1417.3, 1337.9, 1701.4, 2180.4, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null],
          note: 'Year-end balance, not an expense — the single largest estimate on Lyft’s balance sheet, and it has grown faster than bookings since 2023 ($1.34B → $2.18B, +63%, against bookings +34%). The model carries NO projection for this line at all, which is why the forward years are empty.' }
      },
      sections: [
        { key: 'top', label: 'Volume & Demand', defaultMetric: 'gb', groups: [
          { label: 'Marketplace', keys: ['gb', 'rev'] },
          { label: 'Demand (counts, in millions)', keys: ['rides', 'riders'] }
        ] },
        { key: 'margins', label: 'Profitability', defaultMetric: 'ebitda', groups: [
          { label: 'Company', keys: ['ebitda', 'fcf', 'capex'] },
          { label: 'Balance sheet', keys: ['ins'] }
        ] }
      ]
    }
  },
  // ── Estimate EVOLUTION across model snapshots (vintages) ────────────────────
  // Source of record: the Summit Research database — the model's saved snapshots,
  // pulled through the Summit MCP (sheet_source `projection_history`, annual periods).
  // ⚠ LYFT has FOUR snapshot rows but only THREE distinct model states: 2026-05-08 and
  // 2026-05-13 are identical on every metric, so only 05-13 is shown.
  // ⚠ Two lines are DELIBERATELY ABSENT because the audit found them unusable:
  // `earnings` is scale-corrupted (~x378) in the 2026-02-11 vintage, and annual
  // `op_income` projections are broken and sign-wrong (2018 reads +651 against an actual
  // of roughly -977). Insurance reserves have actuals but no projections at all.
  evolution: {
    intro: 'How the forecast itself has moved. Each line tracks one fiscal year’s estimate across the model’s three distinct snapshots. This is the most aggressive downgrade in anything we cover: between December and May the model cut <b>FY2029 adjusted EBITDA almost in half</b> and FY2029 free cash flow by half. The top line held up far better than the bottom line — bookings for FY2029 came down 15% while the profit on them came down 47% — so what was revised is not how big Lyft gets, but how much of it it keeps.',
    vintages: [
      { label: 'Dec 15, 2025', event: 'pre-4Q25 print' },
      { label: 'Feb 11, 2026', event: 'post-4Q25 print' },
      { label: 'May 13, 2026', event: 'post-1Q26 print' }
    ],
    years: ['2026', '2027', '2028', '2029'],
    sections: [
      { key: 'top', label: 'Top Line', defaultMetric: 'gb', groups: [
        { label: 'Marketplace', keys: ['gb', 'rev'] }
      ] },
      { key: 'prof', label: 'Profitability', defaultMetric: 'ebitda', groups: [
        { label: 'Company', keys: ['ebitda', 'fcf', 'capex'] }
      ] }
    ],
    metrics: {
      gb: { label: 'Gross Bookings', unit: 'usdM',
        summit: [[22069, 21609, 21785], [25268, 24861, 24823], [29153, 28808, 26769], [33575, 33179, 28604]],
        cons: null,
        prior: { summit: [18507, 18507, 18507] },
        note: 'The near years barely moved — FY2026 and FY2027 are within ~2% of where they started. The damage is all in the back: FY2028 came down 8% and FY2029 down 15%, both entirely at the May snapshot. Read against Lyft’s own 2027 goal of <b>~$25B</b>: the model has FY2027 at $24.8B, so on bookings the target is still intact.' },
      rev: { label: 'Revenue', unit: 'usdM',
        summit: [[7729, 7552, 7373], [8807, 8629, 8219], [10112, 9953, 8845], [11596, 11418, 9435]],
        cons: null,
        prior: { summit: [6316, 6316, 6316] },
        note: 'Cut at every snapshot and hardest at the end: FY2029 revenue fell from $11.6B to $9.4B, −18.6% cumulative. In the margin view this is a take-rate story — revenue was cut more than bookings in every year, so the model now assumes Lyft keeps a smaller share of what flows through the marketplace.' },
      ebitda: { label: 'Adjusted EBITDA', unit: 'usdM', marginOf: 'gb', marginLabel: 'Adj. EBITDA % of Gross Bookings',
        summit: [[781, 793, 691], [1109, 938, 830], [1537, 1274, 996], [1906, 1615, 1016]],
        cons: null,
        prior: { summit: [529, 529, 529] },
        note: '⚠ THE LINE TO TAKE INTO THE MEETING. FY2029 adjusted EBITDA went <b>$1,906M → $1,615M → $1,016M — down 47%</b> across three snapshots, and FY2028 down 35%. Set it against Lyft’s stated <b>~$1B adjusted-EBITDA goal for 2027</b>: the model now carries <b>$830M</b>, roughly <b>17% short of the target</b>, having started at $1,109M comfortably above it. In the margin view the assumed take of gross bookings peaks around 3.5% instead of climbing past 5%.' },
      fcf: { label: 'Free Cash Flow', unit: 'usdM', marginOf: 'gb', marginLabel: 'FCF % of Gross Bookings',
        summit: [[1270, 1221, 1185], [1488, 1234, 1080], [1263, 1022, 783], [1580, 1314, 793]],
        cons: null,
        prior: { summit: [1116, 1116, 1116] },
        note: 'Halved at the long end: FY2029 free cash flow fell from $1,580M to $793M (−50%). Lyft raised its own 2027 free-cash-flow goal from ~$900M to <b>over $1B</b>; the model has FY2027 at <b>$1,080M</b>, so that target survives — but only just, and only because FY2027 was cut less than the years around it. ⚠ The model’s capex, CFO and FCF rows carry 159 DEFAULT-vs-SEGM source disagreements (FY2024 capex −83 vs −161); these are the DEFAULT series.' },
      capex: { label: 'Capital Expenditure', unit: 'usdM', marginOf: 'gb', marginLabel: 'capex % of Gross Bookings',
        summit: [[97, 113, 86], [176, 173, 164], [152, 149, 133], [174, 171, 142]],
        cons: null,
        note: 'Shown as positive spend (the model carries it as a negative outflow). Trimmed modestly at the May snapshot across every year — a rounding error next to the EBITDA and FCF cuts, and a reminder that this is an asset-light marketplace: capex never exceeds ~0.7% of gross bookings even at the peak.' }
    },
    note: 'Single source: the Summit Research database — the model’s saved snapshots as recorded in the DCF’s Projection History, pulled through the Summit MCP on 31 Jul 2026 (annual periods). ⚠ The model has four snapshot rows but only THREE distinct states: 2026-05-08 and 2026-05-13 are identical on every metric sampled. No Bloomberg consensus is stored per snapshot for these lines, so there is no dashed comparison series — this tab is the model measured against its own past self. Growth chains within Summit’s own data against the FY2025 reported actuals. Two model lines are excluded on purpose: `earnings` is scale-corrupted in the Feb-2026 vintage and annual `op_income` projections are broken and sign-wrong — both flagged for the model owner. Data sourced from Summit DCF models.'
  },
  source: 'Sources: Lyft 8-K Exhibit 99.1 press releases on SEC EDGAR (CIK 0001759509) — actuals for 1Q24–1Q26 and the guidance issued for each quarter in the prior release, including the Q2 2026 guide of $5.30–5.43B Gross Bookings and $160–180M Adjusted EBITDA given on 7 May 2026. Q2 2026 reports Thursday 6 August 2026 after close. The Summit column comes from the model’s frozen per-quarter projections. The Street column is COMPILED PER PRINT from earnings-day coverage — Lyft is not in the BBG_CONSENSUS.txt archive — so it covers only 4Q25, 1Q26 and the 2Q26 estimate, and every other cell is left blank rather than interpolated. Each figure’s individual source is listed in the file header.'
};
