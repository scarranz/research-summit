// results-data/spot.js — Spotify Technology S.A. (SPOT) dataset for the "Results" tab.
//
// ⚠ SPOTIFY REPORTS IN EUROS. The dataset declares `currency: '€'` so the engine labels
// every figure in euros rather than dollars (js/results.js rsCur/rsCurName). Do not
// convert to USD — the guidance is issued in euros too, so converting would make the
// actual-vs-guide comparison meaningless.
//
// Compares REPORTED actuals against, per period:
//   guideLo / guideHi — Spotify's OWN guidance for that quarter, taken from the PRIOR
//             quarter's shareholder deck. Unlike Amazon, Spotify guides a SINGLE POINT,
//             not a range — so guideLo === guideHi and the "band" renders as a line.
//             Spotify guides five things every quarter: total MAU, Premium subscribers,
//             total revenue, gross margin % and operating income. It is one of the most
//             completely-guided companies we cover, which is why the guide is the spine
//             of this tab until the Summit and Street columns land.
//   summit  — Summit DCF model estimate. **NULL EVERYWHERE FOR NOW** — the model has four
//             snapshots (2025-12-18 / 2026-02-09 / 2026-04-28 / 2026-05-22) but the
//             per-quarter extraction is still pending, so nothing is asserted rather than
//             guessed (EARNINGS_CONVENTIONS §5: Summit estimates are never invented).
//   cons    — Street consensus right before the print. **NULL EVERYWHERE FOR NOW.** SPOT
//             has no rows in the BBG_CONSENSUS.txt archive (it carries only GOOG/GOOGL/
//             HOOD/KKR/MA/META/UBER), so this has to be compiled per print from
//             earnings-day coverage, the same way AMZN's was.
//
// All monetary values in € millions; EPS in euros. null = not available.
// Arrays are parallel to `periods`. A period with act:null is an upcoming print.
//
// STATUS: 2Q26 is UPCOMING — Spotify reports it on **Tuesday, August 4, 2026, before
// market open** (Q&A session 8:00am ET), per the IR release of June 25, 2026. The latest
// reported quarter is 1Q26 (reported April 28, 2026).

export var spotResults = {
  updated: 'Jul 2026',
  currency: '€',
  currencyName: '€',
  intro: 'How Spotify’s reported results have stacked up against what the company itself guided. Spotify guides five metrics every quarter — MAU, Premium subscribers, revenue, gross margin and operating income — so the guide is an unusually complete yardstick, and this tab scores each print against it. Pick a metric; the chart shows the actual against the guide for that quarter, with the surprise in percent. Periods marked “est.” are forward: guidance issued, no actual yet. The Summit and Street columns are deliberately empty pending their sources — see the file header.',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Actuals from Spotify’s quarterly shareholder decks (investors.spotify.com). Guidance is the point estimate issued for that quarter in the PRIOR quarter’s deck — Spotify guides a single number, not a range, so the guidance band renders as a line. ⚠ Premium and Ad-Supported revenue are AS ORIGINALLY REPORTED in each quarter’s own deck: effective Jan 1 2026 Spotify moved certain activities from Ad-Supported into Premium and restated 2023–2025, so those two lines carry a basis break at 1Q26 (total revenue, gross profit and every consolidated line are unaffected).',
      metrics: {
        rev: { label: 'Total Revenue', short: 'Total revenue', group: 'Revenue', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [3636, 3807, 3988, 4242, 4190, 4193, 4272, 4531, 4533, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[3600, 3800, 4000, 4100, 4200, 4300, 4200, 4500, 4500, 4800],
          guideHi:[3600, 3800, 4000, 4100, 4200, 4300, 4200, 4500, 4500, 4800],
          note: 'Consolidated revenue. The guide is a single point, so “beat/miss” here is against that point. Spotify has come in at or above the guide in 8 of the 9 reported quarters — the exception is 3Q25 (€4,272M vs a €4,200M guide is a beat; the miss quarter is 2Q25, €4,193M vs €4,300M, on a ~490bps FX headwind). FX is the recurring swing factor: management states a bps headwind alongside every guide (from ~250bps in 1Q24 to ~670bps for 1Q26) but publishes no currency-neutral guidance figure.' },
        premrev: { label: 'Premium Revenue', short: 'Premium', group: 'Revenue', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [3247, 3351, 3516, 3705, 3771, 3740, 3826, 4013, 4148, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: '⚠ BASIS BREAK, not a revision: effective Jan 1 2026 Spotify reclassified certain revenue-generating activities OUT of Ad-Supported and INTO Premium, restating 2023–2025. The figures here are as ORIGINALLY reported in each quarter’s own deck, so 1Q26 is not on the same basis as the quarters before it. For scale, the 1Q26 deck’s restated 1Q25 comparative is €3,783M against the €3,771M originally reported. Not guided separately.' },
        adrev: { label: 'Ad-Supported Revenue', short: 'Ad-Supported', group: 'Revenue', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [389, 456, 472, 537, 419, 453, 446, 518, 385, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: '⚠ Same basis break as Premium (the reclassification moved revenue OUT of this line from 1Q26; the restated 1Q25 comparative is €407M vs €419M as originally reported). The apparent 1Q26 collapse to €385M is therefore part reclassification and part the real thing management flagged: the rebuild of the ad stack around biddable/programmatic buying (SAX) is causing a transition dip — −5% reported but +3% constant-currency. Not guided separately.' },
        gp: { label: 'Gross Profit', short: 'Gross profit', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'gross margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [1004, 1112, 1240, 1368, 1326, 1320, 1351, 1499, 1495, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'The margin line is the story: consolidated gross margin climbed 27.6% → 33.0% across these nine quarters. Spotify DOES guide gross margin as a percentage every quarter (26.4% for 1Q24 rising to 33.1% for 2Q26) — but the engine’s guidance band is a monetary series, so the percentage guide is not plotted here. Switch on the margin line to read the actual; the guided percentages are listed in this note’s source deck per quarter. Filling a percentage guide properly needs a percent unit in the engine (see the file header follow-ups).' },
        opinc: { label: 'Operating Income', short: 'Op. income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [168, 266, 454, 477, 509, 406, 582, 701, 715, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[180, 250, 405, 481, 548, 539, 485, 620, 660, 630],
          guideHi:[180, 250, 405, 481, 548, 539, 485, 620, 660, 630],
          note: 'The second guided line, and the one that misses most often — 1Q24, 4Q24, 1Q25 and 2Q25 all landed under the guided point. The recurring reason is SOCIAL CHARGES: Spotify embeds an assumption for them in the guide based on the share price at the prior quarter’s close, so a rising stock mechanically inflates the charge and pushes the actual below the guide. The embedded assumption is disclosed each quarter (€13M for 2Q24 at a $263.90 close, rising to €25M for 3Q25 at $767.34, back to €10M for 2Q26 at a $484.91 close). Read a small miss here as a share-price artifact before reading it as operational.' },
        netinc: { label: 'Net Income', short: 'Net income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'net margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [197, 274, 300, 367, 225, -86, 899, 1174, 721, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'Net income attributable to owners of the parent. Far noisier than the operating line — 2Q25 printed a €86M LOSS despite €406M of operating income, and 3Q25/4Q25 printed well ABOVE it. Below-the-line items (FX on the convertible/exchangeable notes and financial-instrument revaluation) drive the gap. Not guided; score the operating line first.' },
        eps: { label: 'Diluted EPS', short: 'EPS', group: 'Profitability', unit: 'eps',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [0.97, 1.33, 1.45, 1.76, 1.07, -0.42, 3.28, 4.43, 3.45, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'Diluted EPS in EUROS (not dollars). Carries the same below-the-line noise as net income — the 2Q25 −€0.42 and the 4Q25 €4.43 are both driven by items beneath operating income. Spotify does not guide EPS.' },
        fcf: { label: 'Free Cash Flow', short: 'Free cash flow', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'FCF margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26'],
          act:    [207, 490, 711, 877, 534, 700, 806, 834, 824, null],
          summit: [null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null],
          note: 'Free cash flow has run consistently ABOVE operating income — the payment-timing of royalty accruals plus deferred subscription revenue give Spotify a structurally favourable working-capital cycle. Strongly seasonal (1Q is always the trough). Not guided.' }
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
          { label: 'Totals', keys: ['rev'] },
          { label: 'Segments', keys: ['premrev', 'adrev'] }
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'opinc', groups: [
          { label: 'Company', keys: ['gp', 'opinc', 'netinc', 'eps', 'fcf'] }
        ] }
      ]
    }
  },
  source: 'Sources: Spotify quarterly shareholder decks on investors.spotify.com (actuals, and the guidance issued for the following quarter — each quarter’s figures taken from that quarter’s own deck); the Q2 2026 report date from Spotify’s IR release of June 25, 2026 (results Tuesday, August 4, 2026, before market open). Values in € millions except EPS (€ per share). The Summit and Street columns are intentionally empty — see the file header for why.'
};
