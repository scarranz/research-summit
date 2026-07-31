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
//   cons    — Street consensus right before the print. **NULL EVERYWHERE FOR NOW.** LYFT
//             has no rows in the BBG_CONSENSUS.txt archive, so this must be compiled per
//             print from earnings-day coverage.
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
  intro: 'How Lyft’s reported results have stacked up against what the company guided. Lyft guides only two lines — Gross Bookings and Adjusted EBITDA — so those two carry a guidance band and the rest are shown as the reported record. Pick a metric; each print shows the actual against every reference we have, with the surprise in percent. Periods marked “est.” are forward: guided, no actual yet. Read the metric notes before comparing quarters — the FREENOW acquisition and two one-off items in 4Q25 make parts of this series non-comparable, and on GUIDED lines the model mirrors the reported number once a quarter closes, so a zero surprise there is an artifact rather than a good call.',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Actuals and guidance from Lyft’s 8-K Exhibit 99.1 press releases on SEC EDGAR (CIK 0001759509). Guidance is the range issued for that quarter in the PRIOR quarter’s release. Lyft guides Gross Bookings and Adjusted EBITDA only.',
      metrics: {
        gb: { label: 'Gross Bookings', short: 'Gross bookings', group: 'Volume', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [3693.2, 4018.9, 4108.4, 4278.9, 4162.4, 4490.1, 4780.4, 5074.2, 4946.0, null],
          summit: [3258.8, 3625.7, 3798.5, 4235.2, 4135.3, 4532.1, 4731.2, 5076.2, 4937.5, 5363.4],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[3500, 4000, 4000, 4280, 4050, 4410, 4650, 5010, 4860, 5300],
          guideHi:[3600, 4100, 4100, 4350, 4200, 4570, 4800, 5130, 5000, 5430],
          note: 'The headline volume line, and one of only two Lyft guides. It has landed inside or above the guided range in every quarter here. ⚠ From 3Q25 the series is NOT organic: FREENOW closed 31 Jul 2025 and contributed two months to 3Q25, with TBR Global added in Oct 2025 and Gett’s UK business in May 2026. Lyft has never disclosed the inorganic split, so the reported growth rate from 3Q25 onward mixes acquisition and underlying demand. The 2Q26 guide (+18–21%) is the first full quarter with both FREENOW and Gett.' },
        rev: { label: 'Revenue', short: 'Revenue', group: 'Volume', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [1277.2, 1435.8, 1522.7, 1550.3, 1450.2, 1588.2, 1685.2, 1592.7, 1650.5, null],
          summit: [1188.5, 1348.9, 1417.1, 1579.5, 1449.0, 1632.3, 1719.8, 1799.4, 1705.4, 1815.3],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'Not guided. ⚠ 4Q25 is distorted: a $168M CONTRA-REVENUE charge from legal, tax and regulatory reserve changes is inside the $1,592.7M — without it revenue would have been ~$1.8B. That single item is why 4Q25 shows revenue +3% against Gross Bookings +19%; do not read it as a collapse in take rate.' },
        rides: { label: 'Rides', short: 'Rides', group: 'Volume', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [187.7, 205.3, 216.7, 218.5, 218.4, 234.8, 248.8, 243.5, 236.9, null],
          summit: [166.9, 184.3, 194.0, 221.2, 211.2, 237.8, 247.4, 256.5, 236.9, 254.3],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'In MILLIONS of rides, not dollars — the unit label reads US$ because the engine has no count unit yet; read this line as a count. Not guided. ⚠ The 1Q26 Summit figure (236.9) equals the reported number exactly; treat that single point as mirrored, not forecast. The demand tell: 1Q26 rides FELL sequentially and disappointed even as bookings and revenue beat, which means price and mix, not volume, carried that quarter.' },
        riders: { label: 'Active Riders', short: 'Active riders', group: 'Volume', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [21.9, 23.7, 24.4, 24.7, 24.2, 26.1, 28.7, 29.2, 28.3, null],
          summit: [19.6, 21.5, 22.4, 24.4, 23.9, 25.8, 27.0, 29.9, 28.6, 30.5],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'In MILLIONS of riders (same unit caveat as Rides). Not guided. The 3Q25 step from 26.1M to 28.7M coincides with FREENOW entering the base, so it is not a clean organic acceleration.' },
        ebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', group: 'Profitability', unit: 'usdM', marginOf: 'gb', marginLabel: 'Adj. EBITDA % of Gross Bookings',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [59.4, 102.9, 107.3, 112.8, 106.5, 129.4, 138.9, 154.1, 132.8, null],
          summit: [59.4, 102.9, 107.3, 110.2, 95.9, 134.2, 151.4, 160.8, 136.2, 173.6],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[50, 95, 90, 100, 90, 115, 125, 135, 120, 160],
          guideHi:[55, 100, 95, 105, 95, 130, 145, 155, 140, 180],
          note: '⚠ READ THE SUMMIT LINE WITH CARE HERE: for 1Q24–3Q24 the model’s “estimate” EQUALS the reported figure to the decimal (59.4 / 102.9 / 107.3). That is the model mirroring an actual on a closed guided line, not a perfect forecast — treat a zero surprise on those quarters as no information. The second and last guided line, and the one Lyft manages to. It has printed at or above the top of the guide in almost every quarter. The margin line is the one management is judged on — % of Gross Bookings, climbing from 1.6% to ~3.0%, against a ~$1B Adjusted EBITDA goal for 2027. ⚠ 4Q25 is CLEAN despite the charge: the full $211.6M is added back, so the $154.1M and its 3.0% margin are comparable.' },
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
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'Not guided. The two gaps are REAL, not missing data: Lyft’s Q4 releases present only the full-year income statement, so no standalone Q4 diluted EPS is ever printed (FY24 $0.06; FY25 $6.81 — the latter carrying the deferred-tax release).' },
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
  source: 'Sources: Lyft 8-K Exhibit 99.1 press releases on SEC EDGAR (CIK 0001759509) — actuals for 1Q24–1Q26 and the guidance issued for each quarter in the prior release, including the Q2 2026 guide of $5.30–5.43B Gross Bookings and $160–180M Adjusted EBITDA given on 7 May 2026. Q2 2026 reports Thursday 6 August 2026 after close. The Summit and Street columns are intentionally empty — see the file header.'
};
