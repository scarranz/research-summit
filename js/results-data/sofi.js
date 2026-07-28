// results-data/sofi.js — SoFi Technologies (SOFI) dataset for the standardized "Results" +
// "Estimates" tabs (see docs/RESULTS_CONVENTIONS.md).
//
// PROVENANCE (per the conventions):
//   summit  — the Summit Research DB for SOFI (DCF Projection History): FROZEN per-quarter
//             estimates 2Q22→1Q26 (SoFi keeps 16 quarters of frozen history — the original
//             "SoFi-style freezing" discovery) + the live 2026-05-13 snapshot for forward
//             periods. Annual closed-year values are the model's stored frozen projections.
//   cons    — quarterly: Street consensus per print (Refinitiv/LSEG via earnings-day press,
//             compiled by research — pending fill); annual: the Bloomberg BEst estimates
//             STORED INSIDE the Summit model (actuals_history row = the pre-print consensus
//             for closed years; projection row = forward). BBG revenue basis ≈ ADJUSTED net
//             revenue (SoFi's guided figure), noted per metric.
//   guideLo/Hi — SoFi's own guidance from the 8-K earnings releases (Ex. 99.1). SoFi guides
//             ADJUSTED net revenue / adj. EBITDA / net income / EPS — so guidance attaches to
//             the adjusted-revenue metric, never to total net revenue (no mixed bases).
//
// All monetary values in US$ millions; EPS in dollars. null = not available.
// A period with act:null is an upcoming print.
//
// ⚠ Known flags (kept deliberately): the model's FY2025 stored Adj. EBITDA projection
// ($752M vs $1,054M actual) looks stale/definitional and is NULLED rather than shown as a
// fake +40% beat; Technology Platform revenue is on the MODEL basis (~$361M FY2025,
// ex-intersegment) vs the 10-K's $450.2M segment figure — a definitional gap, noted.

export var sofiResults = {
  updated: 'Jul 2026',
  // Opt out of the engine's generic Actuals-vs-Estimates surprise block: SoFi's
  // Estimates pane carries its own richer version (17 metrics incl. KPIs and
  // expense lines, favorability-aware) rebuilt inside overviews/sofi.js.
  surprise: false,
  intro: 'How SoFi’s reported results have stacked up against what our Summit model projected, what the Street expected, and what the company itself guided. SoFi’s model keeps sixteen quarters of frozen pre-print estimates — the deepest Summit history of any name — and SoFi guides four lines (adjusted net revenue, adjusted EBITDA, net income, EPS) and has beaten its own revenue guide every quarter it gave one. Periods marked “E” are forward: the model’s live projection, no actual yet.',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Summit estimates are the model’s FROZEN per-quarter projections (2Q22→1Q26; forward quarters carry the live 2026-05-13 snapshot). Actuals from SoFi’s 8-K releases as recorded in the Summit DB and the guidance engine. Guidance is SoFi’s next-quarter guide from the PRIOR quarter’s release — adjusted basis, so it attaches to Adjusted Net Revenue / Adj. EBITDA / Adj. Net Income. Street consensus per print compiled from earnings-day coverage (FactSet/Refinitiv 2022–mid-2023, LSEG after, Benzinga/Zacks compilations 2024 on) — quoted on the adjusted-revenue basis, so it lives on Adjusted Net Revenue and EPS. 2Q26 shows the CURRENT pre-print consensus: SoFi reports Jul 29, 2026 before the open.',
      metrics: {
        rev: { label: 'Total Net Revenue', short: 'Total revenue', group: 'Revenue', unit: 'usdM',
          periods: ['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27','4Q27'],
          act:    [359.3, 420.1, 506.1, 472.3, 499.8, 537.1, 615.4, 645.0, 599.8, 697.1, 734.1, 771.8, 854.9, 961.6, 1025.1, 1100.4, null, null, null, null, null, null, null],
          summit: [327.6, 362.7, 452.9, 490.6, 575.8, 588.0, 628.7, 646.2, 700.9, 657.3, 735.3, 707.7, 779.5, 831.0, 1009.8, 1020.9, 1111.0, 1196.6, 1261.5, 1366.0, 1416.0, 1523.5, 1620.7],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Consolidated GAAP total net revenue vs the model’s frozen quarterly estimate. The pattern flipped: the model ran optimistic through 2023 (a miss streak), then conservative through 2025–26 — the actual has beaten the frozen estimate in 10 of the last 11 prints. SoFi guides — and the Street quotes its consensus on — ADJUSTED net revenue, so guidance and consensus live on that metric.' },
        adjrev: { label: 'Adjusted Net Revenue', short: 'Adj. revenue', group: 'Revenue', unit: 'usdM',
          periods: ['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27','4Q27'],
          act:    [356.1, 419.3, 443.4, 460.2, 488.8, 530.7, 594.2, 580.6, 597.0, 689.4, 739.1, 770.7, 858.2, 949.6, 1012.8, 1087.2, null, null, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [340.8, 393.6, 425.6, 441.0, 475.9, 511.3, 571.8, 556.0, 564.4, 632.3, 674.1, 739.1, 801.5, 880.3, 982.0, 1050.0, 1115.0, null, null, null, null, null, null],
          guideLo:[330, null, null, 430, 470, null, null, 550, 555, 625, null, 725, 785, null, null, 1040, null, null, null, null, null, null, null],
          guideHi:[340, null, null, 440, 480, null, null, 560, 565, 645, null, 745, 805, null, null, 1040, null, null, null, null, null, null, null],
          note: 'Adjusted net revenue — the figure SoFi guides AND the basis the Street quotes its revenue consensus on (FactSet/Refinitiv explicitly; Benzinga/Zacks compilations after). The double streak is the story: SoFi has beaten the consensus AND its own guide essentially every print — 16 straight revenue beats vs the Street. 2Q26 carries the CURRENT pre-print consensus (~$1,115M, provider-unnamed previews — SoFi reports Jul 29, 2026 before the open). Basis caveats: the 3Q22 and 2Q24 press numbers were framed against GAAP revenue in their articles; treat those two surprises as approximate.' },
        nii: { label: 'Net Interest Margin Revenue', short: 'NIM revenue', group: 'Revenue', unit: 'usdM',
          periods: ['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27','4Q27'],
          act:    [122.7, 158.2, 210.4, 236.2, 292.9, 345.0, 389.6, 402.7, 413.6, 431.0, 470.2, 498.7, 517.8, 585.1, 617.3, 693.0, null, null, null, null, null, null, null],
          summit: [121.1, 150.4, 203.7, 200.0, 331.2, 370.0, 429.6, 422.0, 456.8, 471.7, 503.9, 488.3, 497.6, 498.4, 566.7, 572.6, 672.2, 730.6, 802.3, 869.4, 927.7, 996.8, 1072.1],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Net interest margin revenue (the model’s NII construct — within ~0.3% of SoFi’s reported net interest income). The model overshot through 2023–24, then under-forecast 2025–26 as deposits and NIM outran it — the actual has beaten the frozen estimate eight prints in a row.' },
        lpb: { label: 'Loan Platform Business Revenue', short: 'LPB', group: 'Revenue', unit: 'usdM',
          periods: ['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27','4Q27'],
          act:    [null, null, null, null, null, null, null, null, null, null, null, null, 127.4, 164.9, 190.9, 138.3, null, null, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, 85.5, 115.9, 208.0, 208.0, 206.0, 244.6, 244.6, 262.9, 246.9, 269.8, 279.3],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Loan Platform Business revenue — the capital-light originate-for-others fee engine. Short history: the model only carries a meaningful quarterly estimate from 2Q25. Two big early beats, then a 1Q26 miss as LPB volume cooled ($138M vs $208M modeled) — the line to watch.' },
        tp: { label: 'Technology Platform Revenue', short: 'Tech Platform', group: 'Revenue', unit: 'usdM',
          periods: ['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27','4Q27'],
          act:    [82.2, 82.2, 81.5, 73.2, 82.2, 81.5, 87.1, 85.9, 86.1, 91.0, 88.7, 86.4, 90.8, 89.7, 94.0, 49.4, null, null, null, null, null, null, null],
          summit: [51.7, 75.1, 78.9, 82.1, 81.2, 95.3, 93.9, 90.8, 88.1, 88.8, 99.0, 95.7, 99.1, 99.4, 99.3, 118.1, 53.0, 60.6, 68.5, 88.4, 90.6, 94.6, 94.1],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Technology Platform revenue on the MODEL basis (ex-intersegment — the 10-K segment figure, which includes services to SoFi itself, runs higher: $450.2M FY2025 vs ~$361M here). Roughly in line for years, then the sharp 1Q26 miss ($49M vs $118M modeled) as a large client rolled off — the model re-based the whole line after that print (see the Estimates tab).' },
        loss: { label: 'Loan Origination, Sales & Securitizations', short: 'Orig. & sales', group: 'Revenue', unit: 'usdM',
          periods: ['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27','4Q27'],
          act:    [144.4, 163.7, 139.6, 126.5, 90.2, 75.4, 82.9, 57.0, 54.9, 70.1, 73.9, 48.4, 62.9, 65.4, 53.9, 142.2, null, null, null, null, null, null, null],
          summit: [145.7, 136.2, 164.5, 142.1, 134.8, 95.0, 78.0, 85.5, 61.1, 60.3, 77.7, 81.6, 46.5, 58.7, 68.6, 50.4, 103.4, 83.4, 67.6, 67.2, 69.8, 75.1, 81.1],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Gains from loan origination, sales and securitizations — volatile and hard to call quarter to quarter. Note the outsized 1Q26 beat ($142M vs $50M modeled) as loan sales surged.' },
        other: { label: 'Other Revenue', short: 'Other', group: 'Revenue', unit: 'usdM',
          periods: ['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27','4Q27'],
          act:    [null, null, null, 14.0, 17.2, 18.3, 38.9, 81.7, 26.5, 39.5, 39.4, 41.0, 48.1, 56.5, 69.1, 76.7, null, null, null, null, null, null, null],
          summit: [null, null, null, 52.6, 15.0, 18.1, 19.0, 40.1, 87.5, 29.2, 43.7, 43.6, 46.1, 50.3, 67.2, 71.8, 76.5, 77.4, 78.5, 78.1, 81.1, 87.3, 94.2],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Other revenue (interchange, brokerage, referrals and the rest of Financial Services). Starts 1Q23 — 2022 estimates were near-zero and produce meaningless surprises.' },
        ebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'adj. EBITDA margin',
          periods: ['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27','4Q27'],
          act:    [null, null, 70.1, 75.7, 76.8, 98.0, 181.2, 144.4, 137.9, 186.2, 198.0, 210.3, 249.1, 276.9, 317.6, 339.9, null, null, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, 188.4, 208.5, 316.6, 289.0, 330.6, 428.9, 477.2, 238.4, 230.8, 359.7, 435.0],
          cons:   [null, null, 43.0, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, 40, 50, null, null, 110, 115, 160, null, 175, 200, null, null, 300, null, null, null, null, null, null, null],
          guideHi:[null, null, null, 45, 60, null, null, 120, 125, 165, null, 185, 210, null, null, 300, null, null, null, null, null, null, null],
          note: 'Adjusted EBITDA — actuals from 4Q22 (earlier quarters were near zero), the model’s quarterly estimate only from 2Q25. SoFi beat its own quarterly EBITDA guide in every guided quarter. The lone quarterly EBITDA consensus the press carried (4Q22: $43M FactSet vs $70M printed) is included. Margin drawn over TOTAL net revenue (model basis) — SoFi’s headline margin uses adjusted revenue and runs ~0.5pp higher. Note the model’s 1Q27–2Q27 forward dip ($238M/$231M) — modeled seasonality worth challenging.' },
        ani: { label: 'Adjusted Net Income', short: 'Adj. net income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'adj. net margin',
          periods: ['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27','4Q27'],
          act:    [null, null, null, null, null, null, null, null, null, null, null, null, 97.3, 139.4, 173.5, 166.7, null, null, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, 45.6, 63.7, 162.5, 142.2, 140.6, 240.3, 281.1, 21.3, 3.7, 117.7, 178.6],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, 60, null, null, 160, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, 70, null, null, 160, null, null, null, null, null, null, null],
          note: 'Adjusted net income — the model’s estimate history starts 2Q25 (GAAP net income has no stored estimate). Guidance shown only for the cleanly-guided quarters (SoFi guided GAAP through mid-2025, adjusted after — mixed-basis periods omitted). ⚠ The model’s 1Q27–2Q27 forward projections collapse to ~$21M/$4M — an internal seasonality/conservatism assumption worth reviewing with the model owner.' },
        eps: { label: 'Diluted EPS', short: 'EPS', group: 'Profitability', unit: 'eps',
          periods: ['2Q22','3Q22','4Q22','1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26','1Q27','2Q27','3Q27','4Q27'],
          act:    [-0.12, -0.09, -0.05, -0.05, -0.06, -0.03, 0.02, 0.02, 0.01, 0.05, 0.05, 0.06, 0.08, 0.11, 0.13, 0.12, null, null, null, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [-0.14, -0.11, -0.09, -0.07, -0.07, -0.08, 0.00, 0.01, 0.01, 0.04, 0.04, 0.03, 0.06, 0.09, 0.12, 0.12, 0.11, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, 0.04, null, 0.03, 0.05, null, null, 0.12, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, 0.04, null, 0.03, 0.06, null, null, 0.12, null, null, null, null, null, null, null],
          note: 'GAAP diluted EPS vs the Street (FactSet/Refinitiv/LSEG via earnings-day coverage; Benzinga/Zacks compilations 2024 on) and SoFi’s sparse quarterly EPS guides. 4Q23 was the inflection: the Street modeled $0.00 and SoFi printed its first-ever GAAP profit ($0.02). ⚠ 4Q24 pair is on the ADJUSTED basis ($0.04 cons / $0.05 act) — GAAP printed $0.29 on one-time items; do not mix. Where providers genuinely disagreed (2Q22, 1Q25), the more official provider’s number is shown. 2Q26 carries the current pre-print consensus ($0.11; reports Jul 29, 2026).' }
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
          { label: 'Totals', keys: ['rev', 'adjrev'] },
          { label: 'Revenue lines', keys: ['nii', 'lpb', 'tp', 'loss', 'other'] }
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'ebitda', groups: [
          { label: 'Company', keys: ['ebitda', 'ani', 'eps'] }
        ] }
      ],
    },
    y: {
      label: 'Annual',
      note: 'Annual consensus is the Bloomberg estimate stored inside the Summit model (the actuals-history row is the pre-print consensus for closed years; BBG revenue is on the adjusted-net-revenue basis). Annual guidance is SoFi’s INITIAL full-year guide (issued at the prior year’s Q4 release) — the year-ahead promise vs what was delivered; SoFi revises guidance upward through the year (see the Deep Dive’s Guidance tab for every revision).',
      metrics: {
        rev: { label: 'Total Net Revenue', short: 'Total revenue', group: 'Revenue', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [984.9, 1573.5, 2122.9, 2674.9, 3613.4, null, null, null, null],
          summit: [null, null, null, 2676.0, 3616.7, 4669.5, 6287.6, 8133.1, 9407.9],
          cons:   [null, null, null, 2566.6, 3560.1, 4671.7, 5688.6, 6469.9, 7001.0],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null],
          note: 'Full-year GAAP total net revenue. Summit = the model’s stored annual projection (frozen for closed years — 2025 was called within 0.1%). Consensus = BBG stored in the model (adjusted-revenue basis; pre-print row for closed years). The 2027+ gap is the story: Summit models $6.3B→$9.4B vs the Street’s $5.7B→$7.0B — the model is ~10–34% above consensus in the out-years, driven by LPB and NII conviction.' },
        adjrev: { label: 'Adjusted Net Revenue', short: 'Adj. revenue', group: 'Revenue', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [1010.3, 1540.5, 2073.9, 2606.2, 3591.4, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[980, 1570, 1925, 2365, 3200, 4655, null, null, null],
          guideHi:[980, 1570, 2000, 2405, 3275, 4655, null, null, null],
          note: 'Adjusted net revenue vs SoFi’s INITIAL full-year guide. SoFi has beaten its initial revenue guide every year except FY2022 — the year the student-loan moratorium forced the only guidance CUT in company history (initial $1,570M; the actual still reached $1,540M). FY2026’s initial guide: $4,655M.' },
        nii: { label: 'Net Interest Margin Revenue', short: 'NIM revenue', group: 'Revenue', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [null, null, null, 1717.5, 2219.0, null, null, null, null],
          summit: [null, null, null, null, 2061.2, 2898.1, 3765.1, 4647.9, 5206.9],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null],
          note: 'Net interest margin revenue (model construct, ≈ reported net interest income). The 2025 frozen projection ran 7% light — deposits and NIM outgrew the model. Forward: the model has NII more than doubling by 2029 ($5.2B) as the deposit-funded book compounds.' },
        lpb: { label: 'Loan Platform Business Revenue', short: 'LPB', group: 'Revenue', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [null, null, null, 141.6, 575.9, null, null, null, null],
          summit: [null, null, null, null, null, 1100.0, 1236.0, 1802.5, 2000.0],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null],
          note: 'Loan Platform Business revenue — $142M → $576M in one year (FY2024→FY2025), and the model puts it at $1.1B in 2026 and $2.0B by 2029. No stored estimate for closed years (the line was too new when frozen).' },
        tp: { label: 'Technology Platform Revenue', short: 'Tech Platform', group: 'Revenue', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [null, null, null, 351.7, 360.9, null, null, null, null],
          summit: [null, null, null, null, 390.6, 231.5, 260.4, 291.2, 318.1],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null],
          note: 'Technology Platform revenue, model basis (ex-intersegment; the 10-K segment figure is higher — $450.2M FY2025). The model SLASHED the forward line after the 1Q26 client roll-off: 2026 went from $427M (Feb snapshot) to $231M — see the Estimates tab for the full re-base.' },
        ebitda: { label: 'Adjusted EBITDA', short: 'Adj. EBITDA', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'adj. EBITDA margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [30.2, 143.3, 431.7, 666.5, 1053.9, null, null, null, null],
          summit: [null, null, null, null, null, 1852.2, 2292.6, 3112.5, 3268.2],
          cons:   [null, null, null, 647.2, 1037.3, 1595.6, 2066.4, 2518.1, 3353.0],
          guideLo:[27, 180, 260, 580, 845, 1600, null, null, null],
          guideHi:[27, 180, 280, 590, 865, 1600, null, null, null],
          note: 'Adjusted EBITDA vs the initial full-year guide and BBG consensus. Margin drawn over total net revenue. ⚠ The model’s stored FY2025 EBITDA projection ($752M vs the $1,054M actual) looks stale/definitional and is deliberately omitted rather than shown as a fake +40% beat — flagged for the model owner. Forward, Summit sits ABOVE the Street in 2026–28 ($1.85B vs $1.60B in 2026) but below in 2029.' },
        ani: { label: 'Adjusted Net Income', short: 'Adj. net income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'adj. net margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [null, null, null, 227.2, 481.3, null, null, null, null],
          summit: [null, null, null, null, null, 1160.0, 1292.1, 1864.9, 2159.9],
          cons:   [null, null, null, 201.2, 460.4, 847.2, 1165.7, 1497.0, 1606.0],
          guideLo:[null, null, null, 95, 285, 825, null, null, null],
          guideHi:[null, null, null, 105, 305, 825, null, null, null],
          note: 'Adjusted net income (FY2024 actual shown on the adjusted basis — headline GAAP $499M included a one-time ~$271M deferred-tax benefit). SoFi delivered more than DOUBLE its initial FY2024 guide and +60% over the initial FY2025 guide. Forward: Summit’s $1.16B for 2026 sits 37% above the Street’s $847M, and the gap widens to +34% by 2029.' },
        eps: { label: 'Diluted EPS', short: 'EPS', group: 'Profitability', unit: 'eps',
          periods: ['2021','2022','2023','2024','2025','2026','2027','2028','2029'],
          act:    [null, null, null, 0.15, 0.39, null, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, 0.07, 0.25, 0.60, null, null, null],
          guideHi:[null, null, null, 0.08, 0.27, 0.60, null, null, null],
          note: 'Diluted EPS vs the initial full-year guide (FY2024 actual on the adjusted basis, excluding the deferred-tax benefit; FY2025 GAAP and adjusted converged at $0.39). SoFi has beaten its initial EPS guide both years it gave one; FY2026’s initial guide is $0.60.' }
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
          { label: 'Totals', keys: ['rev', 'adjrev'] },
          { label: 'Revenue lines', keys: ['nii', 'lpb', 'tp'] }
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'ebitda', groups: [
          { label: 'Company', keys: ['ebitda', 'ani', 'eps'] }
        ] }
      ],
    }
  },
  // Estimate EVOLUTION across the Summit DB's saved snapshots (vintages). Single source:
  // the Summit Research DB (Projection History per snapshot); `cons` is the BBG estimate
  // stored inside the model at the same snapshot. The Apr 29 and May 13 snapshots carry
  // IDENTICAL values for every metric here — the May refresh changed nothing — so the real
  // move is Feb → Apr (the 1Q26 print landed Apr 29).
  evolution: {
    intro: 'How the forecast itself has moved across the model’s saved snapshots — solid is the Summit model, dashed is the Bloomberg consensus stored alongside it at the same date. Two blocks, mirroring Results: Top Line (with the growth each snapshot implies) and Profitability (with margins). The story: after the 1Q26 print, the model raised FY2026 adjusted net income 24% ($939M → $1,160M) and out-year EBITDA ~15%, while SLASHING Technology Platform revenue ($427M → $231M for 2026) after a large client rolled off. The May 13 snapshot changed nothing — it was a refresh.',
    vintages: [
      { label: 'Feb 3, 2026',  event: 'post-4Q25 print' },
      { label: 'Apr 29, 2026', event: 'post-1Q26 print' },
      { label: 'May 13, 2026', event: 'refresh — unchanged' }
    ],
    years: ['2026', '2027', '2028', '2029'],
    sections: [
      { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
        { label: 'Totals', keys: ['rev'] },
        { label: 'Revenue lines (Summit only)', keys: ['nii', 'lpb', 'tp'] }
      ] },
      { key: 'prof', label: 'Profitability', defaultMetric: 'ani', groups: [
        { label: 'Company', keys: ['ebitda', 'ani'] }
      ] }
    ],
    metrics: {
      rev: { label: 'Total Net Revenue', unit: 'usdM',
        summit: [[4613.2, 4669.5, 4669.5], [6105.2, 6287.6, 6287.6], [7985.8, 8133.1, 8133.1], [8838.9, 9407.9, 9407.9]],
        cons:   [[4586.7, 4671.7, 4671.7], [5518.8, 5688.6, 5688.6], [6240.0, 6469.9, 6469.9], [6652.0, 7001.0, 7001.0]],
        prior:  { summit: [3616.7, 3613.4, 3613.4], cons: [null, null, null] },
        note: 'Both columns revised up after the 1Q26 print — but the model raised the OUT years harder (FY2029 +6.4% vs the Street’s +5.2%), and the level gap is wide: by 2029 Summit models $9.4B vs the Street’s $7.0B (+34%). In the growth view, the model’s implied FY2026 growth rose from 27.6% to 29.2%. BBG revenue is on the adjusted basis; no FY2025 BBG value is stored per vintage, so consensus implied growth starts in 2027.' },
      nii: { label: 'Net Interest Margin Revenue', unit: 'usdM',
        summit: [[2562.1, 2898.1, 2898.1], [3280.3, 3765.1, 3765.1], [4134.7, 4647.9, 4647.9], [4658.2, 5206.9, 5206.9]],
        cons: null,
        prior:  { summit: [2061.2, 2050.9, 2050.9] },
        note: 'The biggest dollar re-rate: after the 1Q26 NII beat, every year was raised ~12–15% — FY2026 $2.56B → $2.90B, FY2029 $4.66B → $5.21B. The deposit-funded interest engine is where the model added the most conviction.' },
      lpb: { label: 'Loan Platform Business Revenue', unit: 'usdM',
        summit: [[1100.0, 1100.0, 1100.0], [1471.5, 1236.0, 1236.0], [2166.0, 1802.5, 1802.5], [2000.0, 2000.0, 2000.0]],
        cons: null,
        prior:  { summit: [null, null, null] },
        note: 'The counterweight: after the 1Q26 LPB volume miss, the model held FY2026 flat at $1.1B but CUT the middle years — FY2027 −16% ($1.47B → $1.24B) and FY2028 −17% ($2.17B → $1.80B). No stored FY2025 value per vintage, so no implied-growth chain for 2026.' },
      tp: { label: 'Technology Platform Revenue', unit: 'usdM',
        summit: [[426.8, 231.5, 231.5], [431.1, 260.4, 260.4], [435.4, 291.2, 291.2], [492.5, 318.1, 318.1]],
        cons: null,
        prior:  { summit: [390.6, 393.6, 393.6] },
        note: 'The hardest re-base in the model: after the 1Q26 client roll-off ($49M printed vs $118M modeled), every forward year was cut ~35–46% — FY2026 went from $427M to $231M. The growth view says it plainly: the model flipped from projecting +9% growth to a −41% decline for FY2026.' },
      ebitda: { label: 'Adjusted EBITDA', unit: 'usdM', marginOf: 'rev', marginLabel: 'adj. EBITDA margin',
        summit: [[1715.7, 1852.2, 1852.2], [2204.3, 2292.6, 2292.6], [3085.6, 3112.5, 3112.5], [2850.0, 3268.2, 3268.2]],
        cons:   [[1553.7, 1595.6, 1595.6], [2007.8, 2066.4, 2066.4], [2408.4, 2518.1, 2518.1], [2909.0, 3353.0, 3353.0]],
        note: 'Raised across the board after 1Q26 — FY2026 +8% ($1.72B → $1.85B) and FY2029 +15% ($2.85B → $3.27B). In the margin view the model holds ~40% adj. EBITDA margin (over total revenue) by 2026 vs the Street’s ~34% — but note the Street is above Summit in 2029.' },
      ani: { label: 'Adjusted Net Income', unit: 'usdM', marginOf: 'rev', marginLabel: 'adj. net margin',
        summit: [[939.2, 1160.0, 1160.0], [1244.0, 1292.1, 1292.1], [1873.8, 1864.9, 1864.9], [1816.1, 2159.9, 2159.9]],
        cons:   [[799.9, 847.2, 847.2], [1107.7, 1165.7, 1165.7], [1400.3, 1497.0, 1497.0], [1501.0, 1606.0, 1606.0]],
        note: 'The headline revision: FY2026 adjusted net income +24% in one snapshot ($939M → $1,160M) after the 1Q26 beat, and FY2029 +19% ($1.82B → $2.16B). Summit sits 34–37% above the stored BBG consensus in every year — the widest model-vs-Street gap on any SoFi line.' }
    },
    note: 'Single source: the Summit Research DB for SOFI — saved snapshots (vintages) of the DCF’s Projection History: Feb 3, 2026 (after the 4Q25 print, Jan 30), Apr 29, 2026 (after the 1Q26 print) and May 13, 2026 (a refresh — every value here is identical to Apr 29). Consensus = the BBG estimates stored inside those same snapshots (adjusted-revenue basis; null where the DB holds none). Implied growth chains entirely within each snapshot; FY2026 chains to the FY2025 value stored in the same vintage.'
  },
  source: 'Sources: Summit Research DB for SOFI (DCF Projection History — frozen quarterly estimates 2Q22→1Q26, live 2026-05-13 snapshot for forward periods, and per-snapshot BBG estimates); SoFi quarterly earnings releases via SEC EDGAR Form 8-K Ex. 99.1 (actuals and every guidance range, FY2021–FY2026); FY2025 10-K for annual actuals. Street quarterly consensus compiled per print from earnings-day coverage — FactSet (Barron’s/CNBC) 2022–mid-2023, one verified Refinitiv cite (1Q23, CNBC) and LSEG/I-B-E-S (4Q23, AAII), Benzinga Pro/Zacks/MarketBeat compilations 2024–2026; adjusted-net-revenue basis; genuine provider splits resolved to the more official provider; 2Q26 = current pre-print consensus (reports Jul 29, 2026). Values in US$ millions except EPS.'
};
