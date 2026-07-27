// results-data/amzn.js — Amazon (AMZN) dataset for the standardized "Results" tab.
//
// Compares REPORTED actuals against three references, per period:
//   summit  — Summit DCF model estimate (from archived model snapshots; the estimate
//             held on the last snapshot BEFORE the print: 4Q25 ← 2025-12-18, 1Q26 ← 2026-02-10.
//             Snapshot history starts Dec-2025, so quarterly Summit estimates exist
//             only from 4Q25 onward and the series grows each print. 2Q26 carries the
//             model's LIVE estimate (2026-05-13 snapshot) for the upcoming print.)
//   cons    — Street consensus right before the print. Quarterly: Refinitiv (1Q–2Q23)
//             / LSEG (3Q23 on) via CNBC earnings-day coverage; AWS per StreetAccount.
//             Annual: Bloomberg estimates stored inside the Summit model.
//   guideLo / guideHi — Amazon's own guidance range for that quarter, from the prior
//             quarter's press release (8-K Ex. 99.1 on SEC EDGAR). Amazon guides net
//             sales + GAAP operating income only; null for metrics it does not guide.
//
// All monetary values in US$ millions; EPS in dollars. null = not available.
// Arrays are parallel to `periods`. A period with act:null is an upcoming print.

export var amznResults = {
  updated: 'Jul 2026',
  intro: 'How Amazon’s reported results have stacked up against what our Summit model projected, what the Street expected, and what the company itself guided. Pick a period view and a metric — each print shows the actual against every reference we have for it, with the surprise in percent. The last quarterly column is the upcoming print: guidance and the model’s live estimate, no actual yet.',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Quarterly Summit estimates come from archived model snapshots (available from 4Q25; the history builds up going forward — 2Q26 shows the model’s current estimate for the upcoming print). Guidance and actuals from Amazon’s 8-K press releases on SEC EDGAR; consensus as cited by CNBC earnings-day coverage (Refinitiv through 2Q23, LSEG after; AWS per StreetAccount).',
      metrics: {
        rev: { label: 'Net Sales (Total)', short: 'Total revenue', group: 'Revenue', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [127358, 134383, 143083, 169961, 143313, 147977, 158877, 187792, 155667, 167702, 180169, 213386, 181519, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, 213352, 179234, 199783],
          cons:   [124500, 131500, 141400, 166200, 142500, 148560, 157200, 187300, 155040, 162090, 177800, 211330, 177300, null],
          guideLo:[121000, 127000, 138000, 160000, 138000, 144000, 154000, 181500, 151000, 159000, 174000, 206000, 173500, 194000],
          guideHi:[126000, 133000, 143000, 167000, 143500, 149000, 158500, 188500, 155500, 164000, 179500, 213000, 178500, 199000],
          note: 'Consolidated net sales. Actuals have landed at or above the TOP of guidance in 10 of the last 13 prints. Summit estimate = sum of the model’s three segment projections on the last snapshot before each print — 4Q25 was called within 0.02%. 2Q26: guidance $194–199B vs the model’s live $199.8B.' },
        aws: { label: 'AWS Net Sales', short: 'AWS', group: 'Revenue', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [21354, 22140, 23059, 24204, 25037, 26281, 27452, 28786, 29267, 30873, 33006, 35579, 37587, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, 35119, 36584, 39826],
          cons:   [21220, 21800, 23200, 24200, 24500, 26000, 27500, 28800, 29420, 30800, 32420, 34930, 36640, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'AWS segment net sales — the print the market cares most about. Amazon does not guide segments; consensus per StreetAccount. AWS has beaten the Street in every print since 2Q25 as the AI capacity ramp landed.' },
        usrev: { label: 'North America Net Sales', short: 'North America', group: 'Revenue', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [76881, 82546, 87887, 105514, 86341, 90033, 95537, 115586, 92887, 100068, 106267, 127083, 104143, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, 128300, 103105, 116579],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'North America segment net sales. Not guided and no widely-cited segment consensus — the comparison here is against the Summit model.' },
        intrev: { label: 'International Net Sales', short: 'International', group: 'Revenue', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [29123, 29697, 32137, 40243, 31935, 31663, 35888, 43420, 33513, 36761, 40896, 50724, 39789, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, 49933, 39545, 43378],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'International segment net sales. Not guided and no widely-cited segment consensus — the comparison here is against the Summit model.' },
        opinc: { label: 'Operating Income (GAAP)', short: 'Op. income', group: 'Profitability', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [4774, 7681, 11188, 13209, 15307, 14672, 17411, 21203, 18405, 19170, 17420, 24980, 23852, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[0,    2000, 5500, 7000, 8000, 10000, 11500, 16000, 14000, 13000, 15500, 21000, 16500, 20000],
          guideHi:[4000, 5500, 8500, 11000, 12000, 14000, 15000, 20000, 18000, 17500, 20500, 26000, 21500, 24000],
          note: 'GAAP operating income — the second line Amazon guides every quarter. Actuals beat the TOP of guidance in 11 of the last 13 prints. Watch the charges: 3Q25 includes the $2.5B FTC settlement + $1.8B severance ($21.7B ex-charges); 4Q25 includes $2.4B of charges. No same-day op-income consensus is published in earnings coverage, so that column is empty.' },
        eps: { label: 'Diluted EPS (GAAP)', short: 'EPS', group: 'Profitability', unit: 'eps',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'],
          act:    [0.31, 0.65, 0.94, 1.00, 0.98, 1.26, 1.43, 1.86, 1.59, 1.68, 1.95, 1.95, 2.78],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [0.21, 0.35, 0.58, 0.80, 0.83, 1.03, 1.14, 1.49, 1.36, 1.33, 1.57, 1.97, 1.64],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'GAAP diluted EPS vs the Street’s pre-print estimate (Refinitiv/LSEG). Amazon does not guide EPS. 12 beats in 13 prints — but mind mark-to-market noise: 1Q26’s $2.78 vs $1.64 expected was inflated by ~$16.8B of pre-tax Anthropic investment gains.' },
        segebitda: { label: 'Segment EBITDA (Total)', short: 'Segment EBITDA', group: 'Profitability', unit: 'usdM',
          periods: ['4Q25','1Q26','2Q26'],
          act:    [37667, 36692, null],
          summit: [25444, 21420, 23817],
          cons:   [null, null, null],
          guideLo:[null, null, null],
          guideHi:[null, null, null],
          note: 'Sum of the model’s three segment-EBITDA lines (NA + International + AWS), actual vs the pre-print snapshot. Uses the model’s own segment-EBITDA definition — the model has run very conservative on margins, so treat the large beats as a modeling gap to fix, not only an operational surprise.' },
        awsebitda: { label: 'AWS EBITDA', short: 'AWS EBITDA', group: 'Profitability', unit: 'usdM',
          periods: ['4Q25','1Q26','2Q26'],
          act:    [16695, 18441, null],
          summit: [12292, 12621, 14138],
          cons:   [null, null, null],
          guideLo:[null, null, null],
          guideHi:[null, null, null],
          note: 'AWS segment EBITDA, model definition. Same caveat as total segment EBITDA — the model’s AWS margin assumptions have been well below what Amazon printed.' }
      },
      groups: [
        { label: 'Revenue', keys: ['rev', 'usrev', 'intrev', 'aws'] },
        { label: 'Profitability', keys: ['opinc', 'eps', 'segebitda', 'awsebitda'] }
      ],
      defaultMetric: 'rev'
    },
    y: {
      label: 'Annual',
      note: 'Annual consensus is the Bloomberg estimate stored inside the Summit model alongside each year’s actual. The Summit column is the model’s own stored projection for that fiscal year.',
      metrics: {
        rev: { label: 'Net Sales (Total)', short: 'Total revenue', group: 'Revenue', unit: 'usdM',
          periods: ['2020','2021','2022','2023','2024','2025'],
          act:    [386064, 469822, 513983, 574785, 637959, 716924],
          summit: [null, null, null, null, null, null],
          cons:   [379571, 470209, 512444, 570829, 637832, 714794],
          guideLo:[null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null],
          note: 'Full-year net sales vs Bloomberg consensus. The model overwrites its past annual revenue projections with actuals, so no frozen Summit revenue estimate survives for closed years.' },
        ebitda: { label: 'EBITDA', short: 'EBITDA', group: 'Profitability', unit: 'usdM',
          periods: ['2020','2021','2022','2023','2024','2025'],
          act:    [57287, 72069, 73790, 109538, 143399, 165198],
          summit: [null, null, 82724, 114063, 155229, 185600],
          cons:   [54004, 69216, 71134, 105558, 141591, 167197],
          guideLo:[null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null],
          note: 'Consolidated EBITDA. The Summit column has over-projected every year on record (≈10% high) — a persistent modeling bias worth knowing about. Consensus has tracked much closer.' },
        earnings: { label: 'Earnings (model definition)', short: 'Earnings', group: 'Profitability', unit: 'usdM',
          periods: ['2020','2021','2022','2023','2024','2025'],
          act:    [21331, 33360, 14087, 29499, 61599, 62995],
          summit: [null, null, 11318, 29377, 54773, 64969],
          cons:   [17746, 21217, 7220, 28282, 54832, 76976],
          guideLo:[null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null],
          note: 'Earnings as defined in the Summit model (adjusted — not equal to GAAP net income in every year), against the matching Bloomberg estimate. 2025: the Street ended up too optimistic; Summit was close.' }
      },
      groups: [
        { label: 'Revenue', keys: ['rev'] },
        { label: 'Profitability', keys: ['ebitda', 'earnings'] }
      ],
      defaultMetric: 'rev'
    }
  },
  source: 'Sources: Amazon 8-K press releases on SEC EDGAR (guidance ranges and reported actuals, exact figures); CNBC earnings-day coverage for pre-print consensus (Refinitiv through 2Q23, LSEG after; AWS per StreetAccount); Summit DCF model for AMZN — actuals_history, archived snapshots 2025-12-18 / 2026-02-10 (pre-print Summit estimates), 2026-05-13 (live 2Q26 estimate) and stored Bloomberg estimates (annual consensus). Values in US$ millions except EPS.'
};
