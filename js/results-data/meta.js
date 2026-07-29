// results-data/meta.js — Meta Platforms (META) dataset for the standardized "Results" tab.
//
// Compares REPORTED actuals against three references, per period:
//   summit  — Summit DCF model estimate. Quarterly: the model's FROZEN per-quarter
//             projections (Projection History — each quarter's estimate as held going
//             into that print), full history from 1Q23; forward quarters carry the
//             live vintage (2026-05-22 snapshot). Annual: the estimate held on the
//             last snapshot BEFORE the year closed (2025 ← 2025-12-15 vintage);
//             forward years from the live vintage. Snapshot history starts Dec-2025.
//   cons    — Street consensus right before the print (LSEG/Refinitiv via
//             earnings-day coverage; RL per StreetAccount where cited). Annual:
//             Bloomberg estimates stored inside the Summit model (pre-print BBG for
//             closed years from the model's Actuals History; live BBG forward).
//   guideLo / guideHi — Meta's own revenue guidance range for that quarter, from the
//             prior quarter's press release (8-K Ex. 99.1). Meta guides quarterly
//             total revenue plus full-year total expenses and capex (annual view).
//
// All monetary values in US$ millions; EPS in dollars. null = not available.
// Arrays are parallel to `periods`. A period with act:null is an upcoming print.
//
// ⚠ Open reconciliation (flagged for San/Oscar): the 2026-05-22 snapshot re-rates
// 2026–27 op income / earnings / EBITDA sharply above the 2026-05-05 vintage with
// no print in between (e.g. FY26 op income $92.2B → $117.1B while revenue moved
// DOWN ~1%), and its 2028–29 far-year cells are corrupted (negative revenue etc.).
// Corrupted far-year values are shown as null; the re-rated 2026–27 values are shown
// as the model holds them, with notes where they matter.

export var metaResults = {
  updated: 'Jul 2026',
  intro: 'How Meta’s reported results have stacked up against what our Summit model projected, what the Street expected, and what the company itself guided. Pick a period view and a metric — each print shows the actual against every reference we have for it, with the surprise in percent. Periods marked “est.” are forward: the model’s live projection (and consensus where available), no actual yet. Use the slider under the chart to window the range, and click the legend chips to hide series.',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Quarterly Summit estimates are the model’s FROZEN per-quarter projections (Projection History — each quarter’s estimate as held going into that print), available from 1Q23; forward quarters carry the live 2026-05-22 vintage. Segment op-income projections (FoA / Reality Labs) freeze through 4Q25 only. Guidance and actuals from Meta’s 8-K press releases on SEC EDGAR; consensus as cited by earnings-day coverage (LSEG/Refinitiv; Reality Labs per StreetAccount).',
      metrics: {
        rev: { label: 'Total Revenue', short: 'Total revenue', group: 'Revenue', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'],
          act:    [28645, 31999, 34146, 40111, 36455, 39071, 40589, 48385, 42314, 47516, 51242, 59893, 56311, null, null, null],
          summit: [28313, 31023, 34353, 39659, 35041, 38455, 41083, 47346, 42957, 45970, 50766, 59296, 52879, 59472, 65188, 75210],
          cons:   [27650, 31120, 33560, 39180, 36160, 38310, 40290, 47040, 41400, 44800, 49410, 58350, 55450, 60240, null, null],
          guideLo:[26000, 29500, 32000, 36500, 34500, 36500, 38500, 45000, 39500, 42500, 47500, 56000, 53500, 58000, null, null],
          guideHi:[28500, 32000, 34500, 40000, 37000, 39000, 41000, 48000, 41800, 45500, 50500, 59000, 56500, 61000, null, null],
          note: 'Consolidated revenue — the line Meta guides every quarter. The actual has landed in the top half of the guidance range (or above it) in nearly every print since 1Q23 — 4Q25 printed ABOVE the high end ($59.9B vs $56–59B). Summit = the model’s frozen per-quarter projection; the 4Q25 estimate was within 1% of the print. Consensus per LSEG/Refinitiv, earnings-day coverage; 2Q26 (prints Jul 29, 2026 AMC): guide $58–61B, Street ~$60.2B.' },
        adv: { label: 'Advertising Revenue', short: 'Advertising', group: 'Revenue', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'],
          act:    [28101, 31498, 33643, 38706, 35635, 38329, 39885, 46783, 41392, 46563, 50082, 58137, 55024, null, null, null],
          summit: [27268, 30404, 33774, 39068, 34283, 37798, 40372, 45673, 42049, 45228, 49856, 57543, 51549, 58162, 63683, 73014],
          cons:   [null, null, null, null, null, null, null, null, null, 43970, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Advertising — ~97% of total revenue and the engine of every beat. The actual has run ABOVE the model’s frozen projection in 10 of 13 prints, by widening amounts in 2025–26 (1Q26: $55.0B vs $51.5B projected, +6.7%). Street ad-revenue consensus is cited only occasionally in coverage (2Q25 shown).' },
        foa: { label: 'Family of Apps Revenue', short: 'Family of Apps', group: 'Revenue', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'],
          act:    [28306, 31723, 33936, 39040, 36015, 38718, 40319, 47302, 41902, 47146, 50772, 58938, 55909, null, null, null],
          summit: [27618, 30707, 34068, 39368, 34617, 38110, 40820, 46007, 42429, 45617, 50442, 58322, 52314, 59065, 64718, 74255],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Family of Apps segment revenue (advertising + other revenue): Facebook, Instagram, WhatsApp, Messenger, Threads.' },
        rl: { label: 'Reality Labs Revenue', short: 'Reality Labs', group: 'Revenue', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'],
          act:    [339, 276, 210, 1071, 440, 353, 270, 1083, 412, 370, 470, 955, 402, null, null, null],
          summit: [695, 316, 285, 291, 424, 345, 263, 1339, 528, 353, 324, 975, 564, 407, 470, 955],
          cons:   [null, null, null, null, null, null, null, null, 493, null, null, 941, null, 423, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Reality Labs revenue — Quest headsets and Ray-Ban Meta glasses, heavily seasonal around Q4. Small enough that percent surprises are noisy; the line the market actually trades on is the RL operating LOSS (Margins section). Consensus per StreetAccount where cited (1Q25, 4Q25, 2Q26E).' },
        oth: { label: 'Other Revenue (FoA)', short: 'Other revenue', group: 'Revenue', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'],
          act:    [205, 225, 293, 334, 380, 389, 434, 519, 510, 583, 690, 801, 885, null, null, null],
          summit: [350, 303, 294, 300, 334, 312, 449, 334, 380, 389, 586, 779, 765, 904, 1035, 1242],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Non-advertising Family of Apps revenue — WhatsApp Business paid messaging and Meta Verified. Small but compounding fast (+74% YoY in 1Q26); the model has chased it upward all cycle.' },
        opinc: { label: 'Operating Income (GAAP)', short: 'Op. income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'],
          act:    [7227, 9392, 13748, 16384, 13818, 14847, 17350, 23365, 17555, 20441, 20535, 24745, 22872, null, null, null],
          summit: [6799, 8300, 11827, 14235, 13578, 15406, 15774, 19870, 17394, 18372, 20904, 24420, 24990, 29399, 30398, 34417],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'GAAP income from operations. Meta does not guide operating income directly — it guides full-year total expenses (annual view). The actual beat the model’s frozen projection in 11 of 13 prints; the exception quarters carry one-time charges (4Q25’s $6.0B RL loss; legal accruals). ⚠ Forward quarters come from the 2026-05-22 vintage, which re-rated FY26 op income sharply — see the annual view note.' },
        foaop: { label: 'Family of Apps Op. Income', short: 'FoA op. income', group: 'Profitability', unit: 'usdM', marginOf: 'foa', marginLabel: 'FoA operating margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'],
          act:    [11219, 13131, 17490, 21030, 17664, 19335, 21778, 28332, 21765, 24971, 24967, 30766, 26900, null, null, null],
          summit: [9390, 12283, 14990, 18109, 17309, 19817, 20410, 24384, 22488, 22809, 25726, 29161, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Family of Apps operating income — the profit engine (52–55% segment margin). The model’s frozen segment projections stop at 4Q25; from 1Q26 the model carries segment op income annually only.' },
        rlop: { label: 'Reality Labs Op. Income (Loss)', short: 'RL op. loss', group: 'Profitability', unit: 'usdM',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'],
          act:    [-3992, -3739, -3742, -4646, -3846, -4488, -4428, -4967, -4210, -4530, -4432, -6021, -4028, null, null, null],
          summit: [-2592, -3983, -3163, -3874, -3730, -4411, -4636, -4513, -5094, -4437, -4821, -4741, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, -4600, null, null, -5670, null, -5070, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Reality Labs operating loss — the bet’s quarterly bill, $4–6B a quarter. 4Q25’s $6.0B was the widest loss on record, wider than both the model ($4.7B) and StreetAccount ($5.7B) expected; 1Q26 then narrowed sharply to $4.0B. Frozen model projections stop at 4Q25; ⚠ the Summit DB stores 3Q23 as −$3,472M but the press release says −$3,742M (transposition — the actual is shown; flagged for the model owner). Meta guided 2026 RL losses "similar to 2025 levels".' },
        netinc: { label: 'Net Income (GAAP)', short: 'Net income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'net margin',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'],
          act:    [5709, 7788, 11583, 14017, 12369, 13465, 15688, 20838, 16644, 18337, 2709, 22768, 26773, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'GAAP net income. Two quarters carry one-time tax items that swamp the operating trend: 3Q25’s $2.7B bottom line includes the −$15.9B non-cash OBBBA deferred-tax charge, and 1Q26’s $26.8B includes the mirror-image one-time tax benefit. The Summit model carries net income annually only.' },
        eps: { label: 'Diluted EPS (GAAP)', short: 'EPS', group: 'Profitability', unit: 'eps',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'],
          act:    [2.20, 2.98, 4.39, 5.33, 4.71, 5.16, 6.03, 8.02, 6.43, 7.14, 1.05, 8.88, 10.44, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [2.03, 2.91, 3.63, 4.96, 4.32, 4.73, 5.25, 6.77, 5.28, 5.92, 6.69, 8.21, 6.79, 7.20, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'GAAP diluted EPS vs the pre-print Street estimate (Refinitiv through 2Q23, LSEG after). Meta beat the Street EVERY print in this window on a comparable basis — but two quarters need the tax lens: 3Q25’s $1.05 GAAP print carries the −$15.9B OBBBA charge (company-stated $7.25 ex-charge vs $6.69 expected — a beat), and 1Q26’s $10.44 carries the mirror one-time benefit (Street-comparable adjusted $7.31 vs $6.79). Meta does not guide EPS; the Summit model carries no per-quarter EPS line.' },
        capex: { label: 'Capital Expenditure', short: 'CapEx', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'capex % of revenue',
          periods: ['1Q23','2Q23','3Q23','4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'],
          act:    [7090, 6350, 6760, 7900, 6720, 8470, 9200, 14836, 13690, 17010, 19370, 22140, 19840, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, 28470, 36384, 41424, 47043],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Capital expenditure as Meta states it (including principal payments on finance leases), positive spend, per the 8-K releases. The AI build-out: from ~$7B/qtr in 2023 to ~$20B in 1Q26. ⚠ Basis note: the Summit model’s capex line is purchases of property & equipment only (ex-finance-leases), ~2–4% lower — its per-quarter projections start 1Q26, and the $28.5B 1Q26 projection overshot the $19.8B print badly even before the basis gap; the quarterly projections also sum to ~$153B for 2026 vs the model’s own $141B annual line (both flagged). Meta guides capex ANNUALLY — see the Annual view for the guidance band.' }
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
          { label: 'Totals', keys: ['rev'] },
          { label: 'Segments', keys: ['foa', 'rl'] },
          { label: 'Revenue lines', keys: ['adv', 'oth'] }
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'opinc', groups: [
          { label: 'Company', keys: ['opinc', 'netinc', 'eps', 'capex'] },
          { label: 'Segments (op. income)', keys: ['foaop', 'rlop'] }
        ] }
      ],
    },
    y: {
      label: 'Annual',
      note: 'Annual consensus is the Bloomberg estimate stored inside the Summit model alongside each year’s actual (the pre-print BBG for closed years). The Summit column for 2025 is the estimate held on the last snapshot before the year closed (Dec 15, 2025); earlier closed years have no surviving pre-print snapshot. Forward years from the live 2026-05-22 vintage, except segment op income (2026-05-05 — the live snapshot does not carry it forward).',
      metrics: {
        rev: { label: 'Total Revenue', short: 'Total revenue', group: 'Revenue', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027'],
          act:    [117929, 116609, 134902, 164501, 200966, null, null],
          summit: [null, null, null, null, 200368, 256182, 322461],
          cons:   [117661, 116072, 133656, 163061, 199447, 252862, 301011],
          guideLo:[null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null],
          note: 'Full-year revenue vs the Bloomberg consensus stored in the model. 2025: the Dec-15 Summit estimate ($200.4B) and the Street ($199.4B) both slightly under-called the $201.0B print. Forward: Summit sits ABOVE the Street both years — +1% in 2026 and +7% in 2027 ($322B vs $301B), the model’s ad-acceleration conviction.' },
        adv: { label: 'Advertising Revenue', short: 'Advertising', group: 'Revenue', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027'],
          act:    [114934, 113642, 131948, 160633, 196175, null, null],
          summit: [null, null, null, null, 195580, 249882, 313100],
          cons:   [null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null],
          note: 'Full-year advertising revenue. No BBG advertising line is stored in the model; Summit forward from the live vintage.' },
        foa: { label: 'Family of Apps Revenue', short: 'Family of Apps', group: 'Revenue', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027'],
          act:    [115655, 114450, 133006, 162355, 198759, null, null],
          summit: [null, null, null, null, 198142, 253948, 319401],
          cons:   [null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null],
          note: 'Family of Apps segment revenue, full year.' },
        rl: { label: 'Reality Labs Revenue', short: 'Reality Labs', group: 'Revenue', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027'],
          act:    [2274, 2159, 1896, 2146, 2207, null, null],
          summit: [null, null, null, null, 2227, 2234, 3061],
          cons:   [null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null],
          note: 'Reality Labs revenue has been FLAT at ~$2.2B for five years — the model holds it near-flat through 2027 too. The segment story is the loss line, not revenue.' },
        oth: { label: 'Other Revenue (FoA)', short: 'Other revenue', group: 'Revenue', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027'],
          act:    [721, 809, 1057, 1722, 2584, null, null],
          summit: [null, null, null, null, 2562, 4065, 6301],
          cons:   [null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null],
          note: 'WhatsApp Business paid messaging + Meta Verified: 3.6× in four years, and the model projects another 2.4× by 2027.' },
        opinc: { label: 'Operating Income (GAAP)', short: 'Op. income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027'],
          act:    [46753, 28944, 46751, 69380, 83276, null, null],
          summit: [null, null, null, null, 82951, 117086, 151691],
          cons:   [null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null],
          note: 'GAAP operating income. The Dec-15 estimate for 2025 ($83.0B) was within 0.4% of the print. ⚠ Forward: the 2026-05-22 vintage carries $117.1B for 2026 (45.7% margin) — re-rated from $92.2B on the 2026-05-05 snapshot with no print in between; flagged for reconciliation with the model owner. No BBG op-income consensus is stored in the model.' },
        foaop: { label: 'Family of Apps Op. Income', short: 'FoA op. income', group: 'Profitability', unit: 'usdM', marginOf: 'foa', marginLabel: 'FoA operating margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027'],
          act:    [56946, 42661, 62871, 87109, 102469, null, null],
          summit: [null, null, null, null, 100864, 111157, 133241],
          cons:   [null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null],
          note: 'Family of Apps operating income, full year. Forward from the 2026-05-05 vintage (the 2026-05-22 snapshot does not carry segment op income forward).' },
        rlop: { label: 'Reality Labs Op. Income (Loss)', short: 'RL op. loss', group: 'Profitability', unit: 'usdM',
          periods: ['2021','2022','2023','2024','2025','2026','2027'],
          act:    [-10193, -13717, -16120, -17729, -19193, null, null],
          summit: [null, null, null, null, -17913, -18981, -12854],
          cons:   [null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null],
          note: 'The cumulative Reality Labs bill: ~$77B of operating losses over five years (2023 per the press release: −$16,120M; the Summit DB stores −$15,849M via a 3Q23 transposition — flagged). The Dec-15 model under-called the 2025 loss by $1.3B (the 4Q25 blowout). Forward from the 2026-05-05 vintage, which models the loss finally NARROWING in 2027 — a call to watch; Meta itself guided 2026 losses "similar to 2025 levels".' },
        netinc: { label: 'Net Income (GAAP)', short: 'Net income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'net margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027'],
          act:    [39370, 23200, 39098, 62360, 60458, null, null],
          summit: [null, null, null, null, 73040, 99776, 129424],
          cons:   [39964, 24695, 37809, 59035, 58852, 83549, 89670],
          guideLo:[null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null],
          note: 'GAAP net income vs the Bloomberg estimate stored in the model. 2025 needs care: the GAAP print ($60.5B) carries the one-time OBBBA deferred-tax charge — the Street’s $58.9B was on the same basis, while the Dec-15 Summit estimate ($73.0B) was pre-charge (model-normalized ~$73.9B). Forward: Summit far above the Street in 2027 ($129B vs $90B) — the margin re-rate flag applies here too.' },
        ebitda: { label: 'EBITDA', short: 'EBITDA', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'EBITDA margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027'],
          act:    [64438, 49683, 73079, 103566, 126140, null, null],
          summit: [null, null, null, null, 128513, 168428, 220075],
          cons:   [64928, 50193, 71820, 96232, 121697, 144508, 177322],
          guideLo:[null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null],
          note: 'EBITDA (model definition) vs the matching Bloomberg estimate. The Street under-called 2024 and 2025 by 4–8%. Forward: Summit runs 17–24% above consensus — part real conviction, part the May-22 re-rate flag.' },
        capex: { label: 'Capital Expenditure', short: 'CapEx', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'capex % of revenue',
          periods: ['2021','2022','2023','2024','2025','2026','2027'],
          act:    [19240, 32040, 28100, 39225, 72220, null, null],
          summit: [null, null, null, null, 72133, 140900, 174129],
          cons:   [null, null, null, null, null, null, null],
          guideLo:[null, null, 27000, 38000, 70000, 125000, null],
          guideHi:[null, null, 29000, 40000, 72000, 145000, null],
          note: 'Capital expenditure as Meta states it (incl. finance-lease principal), positive spend. The AI ramp: $39B → $72B → a guided $125–145B in 2026 (raised from $115–135B at the 1Q26 print) and a modeled $174B in 2027 — capex intensity passing 55% of revenue. Guidance band = the FINAL full-year capex guide given for each year (2023: $27–29B; 2024: $38–40B; 2025: $70–72B); every year has landed inside or at the top of the final guide. Basis note: the Summit line ($72.1B held for 2025 on Dec-15; $140.9B for 2026) is purchases of PP&E ex-finance-leases, ~2–4% below Meta’s stated basis.' },
        eps: { label: 'Diluted EPS (GAAP)', short: 'EPS', group: 'Profitability', unit: 'eps',
          periods: ['2021','2022','2023','2024','2025','2026','2027'],
          act:    [13.77, 8.59, 14.87, 23.86, 23.49, null, null],
          summit: [null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, 31.72, null],
          guideLo:[null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null],
          note: 'GAAP diluted EPS. 2025’s $23.49 nets the 3Q25 OBBBA charge against the run-rate. FY2026 consensus ~$31.7 (aggregator basis varies, ~$31.7–32.8 — adjusted vs GAAP-incl-tax-benefit); no verified FY2027 aggregate consensus as of Jul 2026. The Summit model does not carry an EPS line (its net income is above — per-share would divide by ~2,574M held-flat shares).' },
        fcf: { label: 'Free Cash Flow', short: 'FCF', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'FCF margin',
          periods: ['2021','2022','2023','2024','2025','2026','2027'],
          act:    [38993, 19044, 43847, 54072, 46109, null, null],
          summit: [null, null, null, null, 39774, 3186, 17096],
          cons:   [null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null],
          note: 'Free cash flow — the line the capex ramp eats. The model has FY26 FCF collapsing to ~$3B (from $46B in 2025) before a partial 2027 recovery; the Estimate Evolution tab shows this forecast swinging between −$16B and +$24B across snapshots as the capex guide moved.' }
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
          { label: 'Totals', keys: ['rev'] },
          { label: 'Segments', keys: ['foa', 'rl'] },
          { label: 'Revenue lines', keys: ['adv', 'oth'] }
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'opinc', groups: [
          { label: 'Company', keys: ['opinc', 'netinc', 'eps', 'ebitda', 'capex', 'fcf'] },
          { label: 'Segments (op. income)', keys: ['foaop', 'rlop'] }
        ] }
      ],
    }
  },
  // Estimate EVOLUTION across model snapshots (vintages) — how the ANNUAL
  // forecast for each fiscal year moved as prints landed. Source of record:
  // the SUMMIT RESEARCH DATABASE (the DCF's Projection History vintages, pulled
  // through the Summit MCP; capex flipped to positive spend). `cons` is the
  // Bloomberg BEst consensus STORED INSIDE the model at each snapshot — both
  // columns as-of the same date. BBG is stored for revenue / EBITDA / net income
  // only. The 2026-05-22 snapshot's 2028–29 cells are corrupted in the DB and
  // shown as null (flagged for the model owner); its 2026–27 profitability
  // re-rate is shown as held.
  // Arrays: one row per fiscal year (parallel to `years`), one value per vintage.
  evolution: {
    intro: 'How the forecast itself has moved. Each line tracks one fiscal year’s estimate across the model’s saved snapshots — solid is the Summit model, dashed is the Bloomberg consensus stored alongside it at the same date. Two blocks, mirroring Results: Top Line (revenue and segments, with the growth each snapshot implies) and Profitability (spend and earnings power, with margins). The story of the cycle: each print pushed the capex line higher — FY26 capex went $120B → $133B → $143B across the winter snapshots — and FY26 free cash flow swung from +$24B to −$16B before recovering.',
    vintages: [
      { label: 'Dec 15, 2025', event: 'pre-4Q25 print' },
      { label: 'Feb 3, 2026',  event: 'post-4Q25 print' },
      { label: 'May 5, 2026',  event: 'post-1Q26 print' },
      { label: 'May 22, 2026', event: 'current vintage' }
    ],
    years: ['2026', '2027', '2028', '2029'],
    sections: [
      { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
        { label: 'Totals', keys: ['rev'] },
        { label: 'Segments (Summit only)', keys: ['foa', 'rl'] },
        { label: 'Revenue lines (Summit only)', keys: ['adv'] }
      ] },
      { key: 'prof', label: 'Profitability', defaultMetric: 'capex', groups: [
        { label: 'Company', keys: ['capex', 'fcf', 'opinc', 'ebitda', 'earnings'] }
      ] }
    ],
    metrics: {
      rev: { label: 'Total Revenue', unit: 'usdM',
        summit: [[245677, 260279, 259096, 256182], [300321, 311687, 320301, 322461], [344667, 357521, 367572, null], [395640, 410200, 421903, null]],
        cons:   [[235491, 245194, 251166, 252862], [272504, 289221, 298241, 301011], [309021, 335959, 347949, 351842], [348564, 375704, 397235, 403672]],
        prior:  { summit: [200368, 200965, 200965, 200965], cons: [199344, 199442, 199442, 199442] },
        note: 'Both columns revised UP at every winter snapshot — the Feb-3 vintage (post-4Q25 print) took FY26 from $245.7B to $260.3B (+6%), and the Street followed the same path from further below. Summit sits above consensus in every year, and the distance widens with the horizon: +$21B by FY27 and ~$50B by FY29 on the May-5 vintage. May-22 trimmed FY26 ~1%.' },
      adv: { label: 'Advertising Revenue', unit: 'usdM',
        summit: [[239586, 253355, 252796, 249882], [292294, 301492, 310940, 313100], [336139, 346716, 357581, null], [386559, 398723, 411218, null]],
        cons: null,
        prior: { summit: [195580, 194639, 194639, 194677] },
        note: 'Advertising is the whole revenue story: the Feb-3 snapshot added ~$14B to FY26 after the 4Q25 beat, and the out-years kept ratcheting up — FY27 rose from $292B to $313B (+7%) across the four snapshots. No BBG advertising line is stored per snapshot.' },
      foa: { label: 'Family of Apps Revenue', unit: 'usdM',
        summit: [[243172, 257294, 256862, 253948], [297315, 307598, 317241, 319401], [341661, 353432, 364512, null], [392634, 406111, 418842, null]],
        cons: null,
        prior: { summit: [198142, 196773, 196773, 196810] },
        note: 'Family of Apps tracks the advertising re-rate one-for-one (advertising is ~98% of the segment).' },
      rl: { label: 'Reality Labs Revenue', unit: 'usdM',
        summit: [[2505, 2985, 2234, 2234], [3006, 4089, 3061, 3061], [3006, 4089, 3061, 3061], [3006, 4089, 3061, 3061]],
        cons: null,
        prior: { summit: [2227, 2180, 2180, 2180] },
        note: 'Reality Labs revenue is a placeholder line in the model — held flat at ~$3B in every out-year and CUT from the Feb-3 vintage’s $4.1B after the weak 1Q26 device quarter. The forecast that matters (the operating loss) is not carried per-vintage.' },
      capex: { label: 'Capital Expenditure', unit: 'usdM', marginOf: 'rev', marginLabel: 'capex % of revenue',
        summit: [[120382, 132742, 142503, 140900], [120128, 168311, 172963, 174129], [86167, 89380, 91893, null], [98910, 102550, 105476, null]],
        cons: null,
        note: 'The re-rate of the cycle, in two steps: the Feb-3 snapshot (days after Meta raised its 2026 capex guide) took FY26 from $120B to $133B and FY27 from $120B to $168B (+40%); May-5 added another ~$5–10B to each. In the margin view capex intensity peaks at ~55% of revenue in FY26–27, then the model assumes the ramp HALVES to ~$92B by FY28 — the model’s biggest structural assumption. No BBG capex consensus is stored per snapshot.' },
      fcf: { label: 'Free Cash Flow', unit: 'usdM', marginOf: 'rev', marginLabel: 'FCF margin',
        summit: [[24150, -5978, -15910, 3186], [53865, -10809, -4483, 17096], [116067, 99959, 109476, null], [137764, 119832, 130515, null]],
        cons: null,
        note: 'The mirror of the capex re-rate: FY26 FCF flipped from +$24.2B (Dec) to −$5.9B (Feb) to −$15.9B (May-5), then back positive on the May-22 vintage’s margin re-rate. FY27 followed the same swing. The payoff lives in FY28–29 ($100–138B), which assumes the capex cliff above. Where a year flips sign, the revision is shown in dollars only — a percent is meaningless across zero.' },
      opinc: { label: 'Operating Income (GAAP)', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
        summit: [[99334, 93083, 92176, 117086], [121768, 112015, 120387, 151691], [149788, 148090, 160832, null], [175275, 174430, 187997, null]],
        cons: null,
        note: 'Operating income was revised DOWN through the winter (the expense/capex guides) — FY26 $99.3B → $92.2B — then the May-22 vintage re-rated it to $117.1B (45.7% margin) with no print in between. ⚠ That jump is the open reconciliation item with the model owner; until resolved, read the May-5 column as the conservative view. No BBG op-income consensus is stored per snapshot.' },
      ebitda: { label: 'EBITDA', unit: 'usdM', marginOf: 'rev', marginLabel: 'EBITDA margin',
        summit: [[162537, 147069, 147379, 168428], [195815, 179013, 192826, 220075], [230737, 222204, 237868, null], [270118, 261249, 278816, null]],
        cons:   [[138364, 140291, 143253, 144508], [163750, 170413, 175167, 177322], [193611, 199813, 212967, 217572], [224277, 234702, 251882, 259043]],
        note: 'Summit holds EBITDA well above the Street in every year and every snapshot (+15–24%). The Street’s revisions are steady and small; Summit’s track the expense guide down (Dec → Feb) and the May-22 re-rate up. The gap vs consensus is the model’s core profitability disagreement — clearest in the margin view (Summit ~66% vs Street ~57% FY26).' },
      earnings: { label: 'Net Income', unit: 'usdM', marginOf: 'rev', marginLabel: 'net margin',
        summit: [[86625, 79878, 78603, 99776], [105965, 95770, 102490, 129424], [127258, 118490, 129961, null], [150300, 141320, 154065, null]],
        cons:   [[76228, 76521, 80012, 83549], [85918, 88123, 89939, 89670], [99360, 104165, 104912, 105579], [117270, 125513, 124446, 126035]],
        note: 'Net income follows the same shape: trimmed through the winter on expenses, re-rated on May-22 (the flag). Consensus revised FY26 UP at every snapshot ($76.2B → $83.5B) — the Street chased the ad strength while holding margins flatter than the model does. By FY27 the gap is $129B (Summit) vs $90B (Street) — the widest disagreement on the board.' }
    },
    note: 'Single source: every number on this tab comes from the Summit Research database — the model’s saved snapshots (vintages) as recorded in the DCF’s Projection History: Dec 15, 2025 (before the 4Q25 print), Feb 3, 2026 (after it), May 5, 2026 (after the 1Q26 print) and May 22, 2026 (current). Consensus = the BBG estimates stored inside those same snapshot blocks (null where Summit holds none). Implied growth chains entirely within Summit’s data: each fiscal year against the prior year’s value stored in the same vintage — the FY25 base is the Dec-15 vintage’s own projection while the year was open, and the recorded actual once closed. Corrupted far-year cells in the 2026-05-22 snapshot (2028–29) are shown as null, flagged for the model owner.'
  },
  source: 'Sources: Meta 8-K press releases on SEC EDGAR (guidance ranges and reported actuals, exact figures); earnings-day coverage for pre-print consensus (LSEG/Refinitiv; Reality Labs per StreetAccount); Summit DCF model for META via the Summit Research database (MCP) — Projection History vintages 2025-12-15 / 2026-02-03 / 2026-05-05 / 2026-05-22, Actuals History for reported figures and stored pre-print BBG estimates. Values in US$ millions except EPS.'
};
