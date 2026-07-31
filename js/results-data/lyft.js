// results-data/lyft.js — Lyft, Inc. (LYFT) dataset for the standardized "Results" tab.
//
// Compares REPORTED actuals against, per period:
//   guideLo / guideHi — Lyft's OWN guidance for that quarter, from the PRIOR quarter's
//             8-K Ex. 99.1 press release. Lyft guides exactly TWO lines every quarter —
//             Gross Bookings and Adjusted EBITDA — and nothing else, so every other
//             metric here carries no guidance band by design, not by omission.
//   summit  — Summit DCF model estimate. **NULL EVERYWHERE FOR NOW** — the model has four
//             snapshots (2025-12-15 / 2026-02-11 / 2026-05-08 / 2026-05-13) and carries
//             guidance and BBG-consensus metrics directly, but the per-quarter extraction
//             is not finished. Nothing is asserted rather than guessed.
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
  intro: 'How Lyft’s reported results have stacked up against what the company guided. Lyft guides only two lines — Gross Bookings and Adjusted EBITDA — so those two carry a guidance band and the rest are shown as the reported record. Pick a metric; each print shows the actual against every reference we have, with the surprise in percent. Periods marked “est.” are forward: guided, no actual yet. Read the metric notes before comparing quarters — the FREENOW acquisition and two one-off items in 4Q25 make parts of this series non-comparable.',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Actuals and guidance from Lyft’s 8-K Exhibit 99.1 press releases on SEC EDGAR (CIK 0001759509). Guidance is the range issued for that quarter in the PRIOR quarter’s release. Lyft guides Gross Bookings and Adjusted EBITDA only.',
      metrics: {
        gb: { label: 'Gross Bookings', short: 'Gross bookings', group: 'Volume', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [3693.2, 4018.9, 4108.4, 4278.9, 4162.4, 4490.1, 4780.4, 5074.2, 4946.0, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[3500, 4000, 4000, 4280, 4050, 4410, 4650, 5010, 4860, 5300],
          guideHi:[3600, 4100, 4100, 4350, 4200, 4570, 4800, 5130, 5000, 5430],
          note: 'The headline volume line, and one of only two Lyft guides. It has landed inside or above the guided range in every quarter here. ⚠ From 3Q25 the series is NOT organic: FREENOW closed 31 Jul 2025 and contributed two months to 3Q25, with TBR Global added in Oct 2025 and Gett’s UK business in May 2026. Lyft has never disclosed the inorganic split, so the reported growth rate from 3Q25 onward mixes acquisition and underlying demand. The 2Q26 guide (+18–21%) is the first full quarter with both FREENOW and Gett.' },
        rev: { label: 'Revenue', short: 'Revenue', group: 'Volume', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [1277.2, 1435.8, 1522.7, 1550.3, 1450.2, 1588.2, 1685.2, 1592.7, 1650.5, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'Not guided. ⚠ 4Q25 is distorted: a $168M CONTRA-REVENUE charge from legal, tax and regulatory reserve changes is inside the $1,592.7M — without it revenue would have been ~$1.8B. That single item is why 4Q25 shows revenue +3% against Gross Bookings +19%; do not read it as a collapse in take rate.' },
        rides: { label: 'Rides', short: 'Rides', group: 'Volume', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [187.7, 205.3, 216.7, 218.5, 218.4, 234.8, 248.8, 243.5, 236.9, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'In MILLIONS of rides, not dollars — the unit label reads US$ because the engine has no count unit yet; read this line as a count. Not guided. The demand tell: 1Q26 rides FELL sequentially and disappointed even as bookings and revenue beat, which means price and mix, not volume, carried that quarter.' },
        riders: { label: 'Active Riders', short: 'Active riders', group: 'Volume', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [21.9, 23.7, 24.4, 24.7, 24.2, 26.1, 28.7, 29.2, 28.3, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'In MILLIONS of riders (same unit caveat as Rides). Not guided. The 3Q25 step from 26.1M to 28.7M coincides with FREENOW entering the base, so it is not a clean organic acceleration.' },
        ebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', group: 'Profitability', unit: 'usdM', marginOf: 'gb', marginLabel: 'Adj. EBITDA % of Gross Bookings',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [59.4, 102.9, 107.3, 112.8, 106.5, 129.4, 138.9, 154.1, 132.8, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[50, 95, 90, 100, 90, 115, 125, 135, 120, 160],
          guideHi:[55, 100, 95, 105, 95, 130, 145, 155, 140, 180],
          note: 'The second and last guided line, and the one Lyft manages to. It has printed at or above the top of the guide in almost every quarter. The margin line is the one management is judged on — % of Gross Bookings, climbing from 1.6% to ~3.0%, against a ~$1B Adjusted EBITDA goal for 2027. ⚠ 4Q25 is CLEAN despite the charge: the full $211.6M is added back, so the $154.1M and its 3.0% margin are comparable.' },
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
          summit: [null, null, null, null, null, null, null, null, null, null],
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
  source: 'Sources: Lyft 8-K Exhibit 99.1 press releases on SEC EDGAR (CIK 0001759509) — actuals for 1Q24–1Q26 and the guidance issued for each quarter in the prior release, including the Q2 2026 guide of $5.30–5.43B Gross Bookings and $160–180M Adjusted EBITDA given on 7 May 2026. Q2 2026 reports Thursday 6 August 2026 after close. The Summit and Street columns are intentionally empty — see the file header.'
};
