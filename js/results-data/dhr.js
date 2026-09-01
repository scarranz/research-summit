// results-data/dhr.js — Danaher. Contract in docs/RESULTS_CONVENTIONS.md §2.
//
// WHAT IS AND IS NOT IN HERE
//   `act`    — reported. Segment and consolidated GAAP figures from Danaher's own 10-K/10-Q
//              segment notes (SEC EDGAR, CIK 0000313616, newest filing per period so restatements
//              are picked up); every adjusted (non-GAAP) figure and every core-growth figure from
//              the quarterly earnings release itself (8-K EX-99.1).
//   `cons`   — Street consensus, from the Bloomberg BEst export `BBG.xlsx` (DHR US Equity,
//              Estimate Source BST), sheets "Quarters" and "Multiple Periods". FORWARD PERIODS
//              ONLY. Bloomberg's `(Rep)` columns are its own copy of the reported figure, not an
//              estimate, so they are not consensus and are not used as such (§8.3).
//   `summit` — EMPTY on every metric. Danaher is not in the Summit DCF universe yet
//              (`search_ticker('Danaher')` -> no_matches, Aug 2026). That is deliberate rather
//              than missing: the engine renders a reported+Street series correctly and a
//              fabricated model line would be worse than none. When the model arrives, fill
//              `summit` and the Summit line appears with no other change.
//   `guideLo/Hi` — Danaher's OWN guidance, taken from the PRIOR quarter's release, and ONLY
//              where the guide was numeric. See the guidance note below — most of Danaher's
//              history is guided in words, and a word is not a band.
//
// NO VINTAGE AXIS (`estMatrix`), AND NO `evolution` BLOCK. Both need a series of dated snapshots.
// DHR is not in `BBG_CONSENSUS.txt` / `Consensus_Portal.xlsm` (which carry AMZN, NVDA and UBER as
// of Aug 2026) and has no Summit projection history, so the only Street snapshot in existence
// here is the single `BBG.xlsx` export. One snapshot is a reading, not an axis — the vintage
// picker and the Estimates pane's revision record stay off until a second one exists.
//
// This dataset is also read THROUGH by Top Line > Segments: `js/segments-data/dhr.js` points at
// these keys with `from: 'results:<key>'` rather than copying them, so segment revenue and
// operating profit keep exactly one home. Do not rename a key without checking that file.
//
// ── THE BASIS TRAP, and it is the whole reason half the annual cells are null ──────────────────
// Veralto separated in September 2023. Danaher restated the INCOME STATEMENT back to FY2021 for
// continuing operations, and restated NOTHING else. Bloomberg keeps the as-filed figure where no
// restatement exists, so its annual column mixes two companies inside one row:
//   • total revenue FY2021/FY2022 arrives as 29,453 / 31,471 — that is WITH Veralto. The
//     continuing-operations figures are 24,802 / 26,643, they are what the segment rows sum to,
//     and they are what is carried here.
//   • the adjusted lines (adjusted operating profit, adjusted EBITDA, adjusted EPS) and core
//     growth for FY2021/FY2022 are as-filed too — adjusted EPS 10.95 in FY2022 against 7.58 in
//     FY2023 is a spin-off, not a collapse. Those cells are NULL rather than wrong.
//   • GAAP diluted EPS FY2021/FY2022 is carried from CONTINUING operations (7.28 / 8.47), not
//     Bloomberg's 8.50 / 9.66, which include the discontinued business.
//   • CASH FLOW was never restated by anyone, so capex and free cash flow FY2021–FY2023 include
//     Veralto and are carried as such, labelled in the metric note. FY2023 is the visible tell:
//     Danaher's own release says FY2023 free cash flow was $5.1B (continuing ops); the as-filed
//     statement gives 5,781.
// The quarterly view has none of this problem: it starts at 1Q23, which is as far back as the
// restatement reaches, so every quarter sits on today's company.
//
// ── GUIDANCE: Danaher guides words, not dollars ───────────────────────────────────────────────
// Danaher has never guided revenue in dollars. It guides (a) non-GAAP CORE revenue growth and
// (b) since April 2025, full-year adjusted diluted EPS. Until the 2Q26 release the core-growth
// guide was qualitative — "up mid-single digits", "down low-single digits" — and translating a
// phrase into a numeric band would be inventing a guide, which §5.5 forbids. So `guideLo/Hi` is
// populated on exactly four cells, and the wording for every other period is recorded here:
//   quarterly core growth, as guided in the prior release —
//     1Q23 up mid-single (base business) · 2Q23 up mid-single (base business) · 3Q23 down
//     low-single (base business) · 4Q23 down mid-single (base business) · 1Q24 down high-single ·
//     2Q24 down mid-single · 3Q24 down low-single · 4Q24 down low-single · 1Q25 down low-single ·
//     2Q25 up low-single · 3Q25 up low-single · 4Q25 not guided separately · 1Q26 up low-single ·
//     2Q26 up low-single · 3Q26 +2.0% to +3.0%, the first numeric quarterly guide Danaher has
//     given (21-Jul-26).
//   full-year adjusted EPS — FY2025 initiated $7.60–$7.75 (22-Apr-25), raised to $7.70–$7.80
//     (22-Jul-25), maintained (21-Oct-25); FY2026 initiated $8.35–$8.50 (28-Jan-26), raised to
//     $8.35–$8.55 (21-Apr-26), raised to $8.45–$8.60 (21-Jul-26). The band carried per §5.5 is
//     the last one standing before the period closes.
//   full-year core growth — FY2026 +3.0% to +4.0% (21-Jul-26). Earlier years qualitative.
//
// ONE THING TO RAISE. The Street is BELOW Danaher's own full-year guide on core growth: the
// FY2026 consensus organic figure is +2.9% against a company guide of +3.0% to +4.0% raised on
// 21-Jul-26. Both numbers are in this file and the divergence is real, not a units error — the
// quarterly consensus (3Q26 +2.5%, 4Q26 +5.1%) averages to the same +2.9%. Worth asking whether
// the export predates the raise before quoting either against the other.

export var dhrResults = {
  updated: 'Aug 2026',
  intro: 'How each Danaher print landed against what the Street expected, and what the Street expects from here. Danaher reports three segments — Biotechnology, Life Sciences and Diagnostics — plus an unallocated corporate line it calls Other, which carries no revenue. Segment operating profit is GAAP, as the segment note gives it; the adjusted margins management discusses on calls are higher and sit in their own group. Periods marked "est." are forward. The Summit column is empty: Danaher is not in the DCF universe yet.',
  source: 'Reported: Danaher 10-K / 10-Q segment notes via SEC EDGAR (CIK 0000313616), newest filing per period; every adjusted and core-growth figure, and all guidance, from the quarterly 8-K EX-99.1 release. Consensus: Bloomberg BEst export BBG.xlsx (DHR US Equity), forward periods only. Fourth quarters are derived as the fiscal year less the three published quarters — Danaher never tags Q4 on its own. No Summit model for DHR yet.',

  views: {
    q: {
      label: 'Quarterly',
      note: 'Continuing operations throughout. 1Q23 is as far back as the Veralto restatement reaches, so the whole series sits on one company. Consensus is Bloomberg BEst, forward quarters only — Bloomberg’s reported columns are its own copy of the print, not an estimate.',
      sections: [
        { key: 'top', label: 'Top line', defaultMetric: 'rev',
          groups: [{ label: 'Revenue', keys: ['rev', 'bio', 'ls', 'dx'] },
                   { label: 'Core revenue growth', keys: ['coregr'] }] },
        { key: 'margins', label: 'Margins & profitability', defaultMetric: 'adjopinc',
          groups: [{ label: 'Adjusted (non-GAAP)', keys: ['adjopinc', 'adjebitda', 'adjeps'] },
                   { label: 'Operating profit (GAAP)', keys: ['opinc', 'bioopinc', 'lsopinc', 'dxopinc', 'corpopinc'] },
                   { label: 'Company', keys: ['gp', 'eps', 'capex', 'fcf'] }] }
      ],
      metrics: {
        rev: { label: 'Revenue', short: 'Revenue', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [5949, 5912, 5624, 6405, 5796, 5743, 5798, 6538, 5741, 5936, 6053, 6838, 5951, 6265, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null, 5560, 5840, 6000, 6790, 5990, 6100, 6554, 7545, 6590, 6793, 6832],
          note: 'Fourth quarters are the fiscal year less the three published quarters. Danaher does not guide revenue in dollars — see Core revenue growth, which is what it does guide. TWO SOURCES IN ONE ROW: 1Q25–2Q26 is the pre-print Street number reported on earnings day (Investing.com’s consensus, the one provider that prints both revenue and EPS every quarter); 3Q26 onward is the Bloomberg BEst export. Everything before 1Q25 is null — checked, not compiled. The segment consensus sums to about 0.2–0.3% more than the total-revenue consensus in each forward quarter; different analyst samples, not an error.' },

        bio: { label: 'Biotechnology — revenue', short: 'Biotech', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [1864, 1885, 1664, 1759, 1524, 1713, 1653, 1869, 1612, 1850, 1798, 2033, 1797, 1920, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 1874, 2147, 1916, 2066, 2011],
          note: '' },

        ls: { label: 'Life Sciences — revenue', short: 'Life Sci', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [1709, 1796, 1706, 1930, 1745, 1770, 1782, 2032, 1680, 1777, 1792, 2085, 1737, 1879, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 1844, 2161, 1800, 1935, 1914],
          note: '' },

        dx: { label: 'Diagnostics — revenue', short: 'Diagnostics', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [2376, 2231, 2254, 2716, 2527, 2260, 2363, 2637, 2449, 2309, 2463, 2720, 2417, 2466, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 2847, 3261, 2964, 2918, 2986],
          note: 'Masimo joins from 2Q26 — it added 4.0pp of the segment’s reported growth that quarter, and it is the step up in the forward consensus. The Street’s acquisition-and-divestiture assumption for this segment runs at about −16% a quarter through 2027, which is the same Masimo base effect running the other way.' },

        coregr: { label: 'Core revenue growth', short: 'Core growth', unit: 'pct',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [-4.0, -7.0, -11.5, -11.5, -4.0, -3.5, 0.5, 1.0, 0.0, 1.5, 3.0, 2.5, 0.5, 3.0, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 2.5, 5.1, 5.4, 5.6, 5.1],
          guideLo: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 2.0, null, null, null, null],
          guideHi: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 3.0, null, null, null, null],
          note: 'The measure Danaher actually guides. Reported figures are the company’s own non-GAAP core revenue growth from each release; the consensus line is Bloomberg’s organic growth, which ties to the reported figure exactly in all five quarters where both exist. The band on 3Q26 (+2.0% to +3.0%, guided 21-Jul-26) is the FIRST numeric quarterly guide Danaher has given — every earlier quarter was guided in words and is deliberately left without a band; the wording is in the file header. 1Q23–4Q23 were guided on "base business core", a narrower measure Danaher retired after FY2023.' },

        adjopinc: { label: 'Adjusted operating profit', short: 'Adj. op. profit', unit: 'usdM', marginOf: 'rev', marginLabel: 'Adjusted operating margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [null,null,null,null,null,null,null,null,null, 1618, 1688, 1934, 1795, 1698, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 1746, 2306, 1999, 1896, 1907],
          note: 'Non-GAAP. Reported quarters run from 2Q25 only — that is as far back as the Bloomberg export carries the quarterly adjusted line, and Danaher publishes an adjusted operating profit in a release only for the periods that release covers. The GAAP line in the group below is complete.' },

        adjebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', unit: 'usdM', marginOf: 'rev', marginLabel: 'Adjusted EBITDA margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [null,null,null,null,null,null,null,null,null, 1803, 1877, 2129, 1988, 1894, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 1939, 2542, 2239, 2150, 2167],
          note: 'Non-GAAP, Bloomberg’s comparable-EBITDA basket. Same 2Q25 start as adjusted operating profit, and the same reason.' },

        adjeps: { label: 'Adjusted diluted EPS', short: 'Adj. EPS', unit: 'eps',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [2.36, 2.05, 2.02, 2.09, 1.92, 1.72, 1.71, 2.14, 1.88, 1.80, 1.89, 2.23, 2.06, 1.94, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null, 1.62, 1.64, 1.72, 2.14, 1.94, 1.83, 1.93, 2.58, 2.23, 2.11, 2.13],
          note: 'Danaher’s headline number, and the line it is judged on. Every reported quarter is the figure in that quarter’s own release, so the actual is complete back to 1Q23; the five quarters where the Bloomberg export also carries it agree to the cent. CONSENSUS IS TWO SOURCES: 1Q25–2Q26 is the pre-print Street number reported on earnings day, 3Q26 onward is the Bloomberg BEst export. The pre-print half is one provider (Investing.com) for internal consistency; Zacks read the same two most recent quarters a cent higher ($1.95 for 1Q26, $1.84 for 2Q26), and its published surprise for 1Q25 (+16.05%) reproduces the $1.62 carried here — so the unusually large 2025 beats are real, not a bad number. Danaher guides this ANNUALLY, never by quarter, so the band is on the annual view.' },

        opinc: { label: 'Operating profit (GAAP)', short: 'Op. profit', unit: 'usdM', marginOf: 'rev', marginLabel: 'Operating margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [1517, 1163, 1185, 1337, 1312, 1168,  958, 1425, 1274,  760, 1154, 1502, 1344, 1127, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 1253, 1779, 1747, 1674, 1699],
          note: 'GAAP. The 2Q25 trough is a $432M trade-name impairment in Life Sciences, not trading. The forward consensus runs about 2–3% below the sum of the three segment consensus lines plus corporate cost — the two are built from different analyst samples.' },

        bioopinc: { label: 'Biotechnology — operating profit', short: 'Biotech op.', unit: 'usdM', marginOf: 'bio', marginLabel: 'Segment operating margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [ 596,  480,  417,  416,  325,  462,  390,  508,  441,  531,  352,  540,  534,  556, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 476, 630, 593, 642, 529],
          note: '' },

        lsopinc: { label: 'Life Sciences — operating profit', short: 'Life Sci op.', unit: 'usdM', marginOf: 'ls', marginLabel: 'Segment operating margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [ 321,  340,  313,  235,  235,  233,   35,  376,  201, -239,  222,  336,  225,  244, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 242, 375, 258, 274, 292],
          note: 'The 2Q25 loss is the $432M trade-name impairment; 3Q24 carries a smaller one. The Street models the segment back to a mid-teens margin and no further.' },

        dxopinc: { label: 'Diagnostics — operating profit', short: 'Diagnostics op.', unit: 'usdM', marginOf: 'dx', marginLabel: 'Segment operating margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [ 677,  424,  539,  766,  830,  556,  615,  624,  718,  554,  665,  713,  674,  416, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 658, 902, 819, 624, 788],
          note: '2Q26 carries $108M of pretax Masimo acquisition items, which is why the print sits far below the level the consensus resumes at.' },

        corpopinc: { label: 'Corporate ("Other") — operating profit', short: 'Corporate', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [ -77,  -81,  -84,  -80,  -78,  -83,  -82,  -83,  -86,  -86,  -85,  -87,  -89,  -89, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, -90, -93, -90, -91, -91],
          note: 'Unallocated corporate cost. It carries no revenue, so it has no margin. The most predictable line in the company — it has moved less than $13M a quarter in four years.' },

        gp: { label: 'Gross profit', short: 'Gross profit', unit: 'usdM', marginOf: 'rev', marginLabel: 'Gross margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [3662, 3318, 3275, 3779, 3487, 3428, 3401, 3890, 3511, 3523, 3523, 3966, 3591, 3611, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 3830, 4488, 4043, 4101, 4054],
          note: 'GAAP. 4Q23 is derived as the fiscal year less the three published quarters and reproduces the $3,779M Danaher did tag — which is the check the whole Q4 derivation rests on.' },

        eps: { label: 'Diluted EPS (GAAP)', short: 'EPS', unit: 'eps',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [1.94, 1.49, 1.51, 1.50, 1.45, 1.22, 1.12, 1.49, 1.32, 0.77, 1.27, 1.66, 1.45, 1.23, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 1.45, 2.09, 1.80, 1.68, 1.72],
          note: 'Continuing operations. 1Q23–3Q25 from each release; 4Q25 onward from the Bloomberg export, which agrees with the release wherever both carry the quarter. The gap to adjusted EPS is almost entirely acquisition-related intangible amortisation — about $1.9B a year, roughly $0.65 a quarter.' },

        capex: { label: 'Capital expenditure', short: 'CapEx', unit: 'usdM', marginOf: 'rev', marginLabel: 'CapEx % of revenue',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [null,null,null,null,null,null,null,null,null, 248, 292, 371, 237, 269, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 320, 359, 288, 301, 315],
          note: 'Reported quarters start at 2Q25 — the Bloomberg export’s quarterly window. Danaher’s 10-Q cash-flow statement is year-to-date, so the earlier quarters exist only as a difference of two YTD figures and have not been pulled. The annual view is complete.' },

        fcf: { label: 'Free cash flow', short: 'FCF', unit: 'usdM', marginOf: 'rev', marginLabel: 'FCF % of revenue',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27'],
          act:  [null,null,null,null,null,null,null,null,null, 1090, 1370, 1746, 1085, 1265, null, null, null, null, null],
          summit: [],
          cons: [null,null,null,null,null,null,null,null,null,null,null,null,null,null, 1580, 1838, 1584, 1465, 1754],
          note: 'Non-GAAP, operating cash flow less capex. Same 2Q25 start and same reason as capex. Danaher does print a rounded free cash flow for every quarter in its release ($1.7B, $1.6B, $1.3B …); those are not carried here because a $0.1B rounding sitting next to a $1,090M figure reads as precision that is not there.' }
      }
    },

    y: {
      label: 'Annual',
      note: 'FY2021 onward: that is as far back as Danaher restated the income statement for the Veralto separation. Where no restatement exists — the adjusted lines, core growth, and the cash-flow statement — the cell is either null or labelled as including Veralto. The full basis note is at the top of js/results-data/dhr.js.',
      sections: [
        { key: 'top', label: 'Top line', defaultMetric: 'rev',
          groups: [{ label: 'Revenue', keys: ['rev', 'bio', 'ls', 'dx'] },
                   { label: 'Core revenue growth', keys: ['coregr'] }] },
        { key: 'margins', label: 'Margins & profitability', defaultMetric: 'adjeps',
          groups: [{ label: 'Adjusted (non-GAAP)', keys: ['adjeps', 'adjopinc', 'adjebitda'] },
                   { label: 'Operating profit (GAAP)', keys: ['opinc', 'bioopinc', 'lsopinc', 'dxopinc', 'corpopinc'] },
                   { label: 'Company', keys: ['gp', 'eps', 'capex', 'fcf'] }] }
      ],
      metrics: {
        rev: { label: 'Revenue', short: 'Revenue', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [24802, 26643, 23890, 23875, 24568, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 26220, 28282, 30163, 32645],
          note: 'Continuing operations. FY2021 and FY2022 are Danaher’s restated figures and the ones the segment rows sum to — NOT Bloomberg’s 29,453 / 31,471, which still include Veralto. The FY2026 consensus carries Masimo from 2Q26.' },

        bio: { label: 'Biotechnology — revenue', short: 'Biotech', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [8570, 8758, 7172, 6759, 7293, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 7739, 8313, 8998, 9822],
          note: 'The Street has the segment back above its FY2022 peak only in FY2028.' },

        ls: { label: 'Life Sciences — revenue', short: 'Life Sci', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [6388, 7036, 7141, 7329, 7334, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 7620, 7930, 8377, 8877],
          note: '' },

        dx: { label: 'Diagnostics — revenue', short: 'Diagnostics', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [9844, 10849, 9577, 9787, 9941, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 10991, 12251, 13016, 13867],
          note: 'The FY2026 step is Masimo, consolidated from 2Q26.' },

        coregr: { label: 'Core revenue growth', short: 'Core growth', unit: 'pct',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [null, null, -10.0, -1.5, 2.0, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 2.9, 5.3, 6.1, 6.3],
          guideLo: [null, null, null, null, null, 3.0, null, null, null],
          guideHi: [null, null, null, null, null, 4.0, null, null, null],
          note: 'FY2021 and FY2022 are null on purpose: the core-growth figures Danaher published for those years (+23.0%, +9.5%) are for the company WITH Veralto and were never restated. The FY2026 band is the guide raised on 21-Jul-26. The consensus sits BELOW the low end of that guide — see the flag at the top of js/results-data/dhr.js.' },

        adjeps: { label: 'Adjusted diluted EPS', short: 'Adj. EPS', unit: 'eps',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [null, null, 7.58, 7.48, 7.80, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 8.51, 9.29, 10.20, 11.28],
          guideLo: [null, null, null, null, 7.70, 8.45, null, null, null],
          guideHi: [null, null, null, null, 7.80, 8.60, null, null, null],
          note: 'The number Danaher guides and is judged on. FY2025 landed at $7.80 — the top of the $7.70–$7.80 range it had held since July. FY2021/FY2022 are null: the $10.05 and $10.95 Danaher published are as-filed with Veralto and were never restated onto this basis. FY2026 guidance has been raised twice ($8.35–$8.50 → $8.35–$8.55 → $8.45–$8.60) and the Street sits at $8.51, inside the band.' },

        adjopinc: { label: 'Adjusted operating profit', short: 'Adj. op. profit', unit: 'usdM', marginOf: 'rev', marginLabel: 'Adjusted operating margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [null, null, 6855, 6840, 6939, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 7539, 8275, 8999, 9893],
          note: 'Non-GAAP. FY2021/FY2022 null — as-filed with Veralto, never restated. The margin sat at 28.7% → 28.6% → 28.2% across FY2023–FY2025 and the Street has it back above 30% only by FY2029.' },

        adjebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', unit: 'usdM', marginOf: 'rev', marginLabel: 'Adjusted EBITDA margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [null, null, 7530, 7561, 7689, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 8318, 9135, 9926, 10958],
          note: 'Non-GAAP, Bloomberg’s comparable-EBITDA basket. FY2021/FY2022 null for the same reason as adjusted operating profit.' },

        opinc: { label: 'Operating profit (GAAP)', short: 'Op. profit', unit: 'usdM', marginOf: 'rev', marginLabel: 'Operating margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [6377, 7536, 5202, 4863, 4690, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 5560, 7064, 7942, 9100],
          note: 'Restated for continuing operations, so FY2021 onward is one company. It falls every year after FY2022 — and almost all of the fall is Life Sciences. The Street has it recovering to the FY2022 level only by FY2028.' },

        bioopinc: { label: 'Biotechnology — operating profit', short: 'Biotech op.', unit: 'usdM', marginOf: 'bio', marginLabel: 'Segment operating margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [3074, 3008, 1909, 1685, 1864, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 2222, 2531, 2819, 3286],
          note: '' },

        lsopinc: { label: 'Life Sciences — operating profit', short: 'Life Sci op.', unit: 'usdM', marginOf: 'ls', marginLabel: 'Segment operating margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [1293, 1414, 1209, 879, 520, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 1103, 1277, 1423, 1631],
          note: 'Impairment charges of $0M, $222M and $446M across FY2023–FY2025 sit inside this line. The consensus doubling in FY2026 is the absence of another one, not a trading recovery.' },

        dxopinc: { label: 'Diagnostics — operating profit', short: 'Diagnostics op.', unit: 'usdM', marginOf: 'dx', marginLabel: 'Segment operating margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [2313, 3436, 2406, 2625, 2650, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 2670, 3179, 3412, 3636],
          note: 'FY2026 barely moves on a revenue line up $1.1B — the Masimo acquisition items land in this segment.' },

        corpopinc: { label: 'Corporate ("Other") — operating profit', short: 'Corporate', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [-303, -322, -322, -326, -344, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, -361, -377, -386, -397],
          note: 'Unallocated corporate cost. No revenue, so no margin.' },

        gp: { label: 'Gross profit', short: 'Gross profit', unit: 'usdM', marginOf: 'rev', marginLabel: 'Gross margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [15239, 16188, 14034, 14206, 14523, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 15558, 17011, 18254, 19773],
          note: 'GAAP, continuing operations. The margin has held in a 58.8–61.2% band for five years and the Street keeps it there.' },

        eps: { label: 'Diluted EPS (GAAP)', short: 'EPS', unit: 'eps',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [7.28, 8.47, 5.65, 5.29, 5.03, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 6.23, 7.60, 8.53, 9.09],
          note: 'CONTINUING operations — not Bloomberg’s 8.50 / 9.66 for FY2021/FY2022, which include the discontinued business. That is the one place in this file where the reported column deliberately disagrees with the export.' },

        capex: { label: 'Capital expenditure', short: 'CapEx', unit: 'usdM', marginOf: 'rev', marginLabel: 'CapEx % of revenue',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [1240, 1118, 1383, 1392, 1156, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 1177, 1282, 1304, 1374],
          note: 'FY2021–FY2023 INCLUDE VERALTO. Danaher never restated its cash-flow statement for the separation, so these are as-filed and are not comparable with FY2024 onward. FY2024 and FY2025 tie to the release.' },

        fcf: { label: 'Free cash flow', short: 'FCF', unit: 'usdM', marginOf: 'rev', marginLabel: 'FCF % of revenue',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act: [7118, 7401, 5781, 5296, 5260, null, null, null, null],
          summit: [],
          cons: [null, null, null, null, null, 5629, 6331, 6909, 7581],
          note: 'FY2021–FY2023 INCLUDE VERALTO, as with capex. The tell is FY2023: this row says 5,781 while Danaher’s own release says free cash flow was $5.1B on continuing operations. FY2024 (5,296 against "$5.3B") and FY2025 (5,260 against "$5.3B") tie.' }
      }
    }
  }
};
