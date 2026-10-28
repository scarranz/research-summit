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
//             of this tab.
//   summit  — Summit DCF model estimate, from the model's frozen per-quarter projections
//             (Projection History). Reported quarters carry the estimate held on the last
//             snapshot BEFORE that print; 3Q26 is FROZEN from the Summit MCP snapshot 2026-08-05
//             (frozen on purpose, not live; the 2026-08-04 vintage this file carried before does
//             not exist in the MCP). Net income and EPS are NOT carried as
//             consolidated lines in the model (gross profit carries only the 3Q26 cell, the sum of the two
//             segment gross profits), so the rest stay null rather than being derived.
//   cons    — Street consensus from BBG_CONSENSUS.txt: 10 SPOT snapshots (2024-04-28 -> 2026-10-21),
//             in EUR, loaded into `estMatrix.cons` by scripts/consensus/emit_matrix.py + map_spot.json.
//             Each snapshot is taken right AFTER a print, so the pre-print Street for a quarter is the
//             snapshot after the PREVIOUS print (about three months out), shown with its date in the
//             vintage picker. The hand-compiled 2Q26 FactSet cell (EUR 4,790M) was dropped in favour
//             of the 2026-05-03 vintage (EUR 4,795M). Users lines (MAU, subscribers, ad-supported MAU,
//             Premium ARPU) carry actuals from the Bloomberg export. Summit forecasts them only in the 2025-12-18 snapshot
//             (4Q25), the three later snapshots hold the total rows at zero.
// All monetary values in € millions; EPS in euros. null = not available.
// Arrays are parallel to `periods`. A period with act:null is an upcoming print.
//
// STATUS: 2Q26 is REPORTED — Spotify published it on Tuesday, August 4, 2026, before
// market open (6-K, accession 0001140361-26-031044). 3Q26 is now the upcoming print and
// carries the guidance issued in that same deck.
//
// ── FOLLOW-UPS ──────────────────────────────────────────────────────────────────────
//  • DONE Oct 2026: MAU, Premium subscribers, ad-supported MAU and Premium ARPU are lines in this chart
//    (unit 'count' / 'eps'); the guided gross-margin PERCENTAGE is its own metric `gm` (unit 'pct', as TSM's);
//    the guidance for MAU, subscribers, revenue, gross margin and operating income is filled for EVERY quarter
//    1Q24–3Q26 from the prior quarter's call (Q4 2023 → Q2 2026 calls). Two guide lines are DERIVED and say so in
//    their notes: gross profit (guided margin × guided revenue) and ad-supported MAU (guided MAU − guided
//    subscribers + the overlap between the two definitions, held at the last reported quarter).
//  • estMatrix.summit is now generated (scripts/consensus/map_summit_spot.json): four Summit snapshots.
//    Open: the 1Q24 and 2Q24 Street cells, because the oldest Bloomberg file (2024-04-28) already knew 1Q24.

export var spotResults = {
  forwardQuarters: 2,   // two quarters past the last print, not just the current fiscal year (see rsTrimData in js/results.js)
  updated: 'Oct 2026',
  currency: '€',
  currencyName: '€',
  intro: 'How Spotify’s reported results have stacked up against what the company itself guided. Spotify guides five metrics every quarter — MAU, Premium subscribers, revenue, gross margin and operating income — so the guide is an unusually complete yardstick, and this tab scores each print against it. Pick a metric; the chart shows the actual against the guide for that quarter, with the surprise in percent. Periods marked “est.” are forward: guidance issued, no actual yet. The Summit line is the model’s frozen estimate held going into each print. Latest: 3Q26, reported 22 Oct 2026 — revenue landed €31M under a €5.0B guide (−0.6%, in line per the company), operating income was €672M against €670M, gross margin 33.0% against 32.9%, subscribers 306M against 305M and MAU 788M on the guide. The 4Q26 guide: MAU 818M, subscribers 316M, revenue €5.2B, gross margin 33.8%, operating income €820M. The Street column is the Bloomberg consensus archive (the snapshot before each print).',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Actuals from Spotify’s quarterly shareholder decks (investors.spotify.com; 3Q26 from the deck of 22 Oct 2026). Guidance is the point estimate issued for that quarter in the PRIOR quarter’s deck — Spotify guides a single number, not a range, so the guidance band renders as a line. ⚠ Premium and Ad-Supported revenue are AS ORIGINALLY REPORTED in each quarter’s own deck: effective Jan 1 2026 Spotify moved certain activities from Ad-Supported into Premium and restated 2023–2025, so those two lines carry a basis break at 1Q26 (total revenue, gross profit and every consolidated line are unaffected).',
      metrics: {
        rev: { label: 'Total Revenue', guided: true, short: 'Total revenue', group: 'Revenue', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [3636, 3807, 3988, 4242, 4190, 4193, 4272, 4531, 4533, 4777, 4969, null, null, null],
          summit: [3561.9, 3771.4, 3899.6, 4193.6, 4166.5, 4318.9, 4229.1, 4539.6, 4663.8, 4817.3, 5023.1, 5428.4, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[3600, 3800, 4000, 4100, 4200, 4300, 4200, 4500, 4500, 4800, 5000, 5200, null, null],
          guideHi:[3600, 3800, 4000, 4100, 4200, 4300, 4200, 4500, 4500, 4800, 5000, 5200, null, null],
          note: 'Consolidated revenue. The guide is a single point, so “beat/miss” here is against that point. The record across the eleven reported quarters: six at or above the guided point, five below — but four of the five shortfalls (3Q24 −€12M, 1Q25 −€10M, 2Q26 −€23M, 3Q26 −€31M) are inside 0.7% and read as in-line, which is how the company itself describes 3Q26. The one real miss is 2Q25 (€4,193M against a €4,300M guide) on a ~490bps FX headwind. FX is the recurring swing factor: management states a bps assumption alongside every guide and it flips direction — a ~670bps headwind going into 1Q26, ~70bps of actual headwind in 2Q26, ~190bps of actual tailwind in 3Q26 (against ~200bps guided), and ~230bps of tailwind assumed for the €5.2B 4Q26 guide (struck on USD:EUR 0.8828 at the September 30 close). Read the guided growth as part currency. 3Q26 printed €4,969M, +16% reported and +14% constant-currency; the Street (Bloomberg, snapshot of 21 Oct 2026) stood at €4,983M (−0.3%). Investor Day target (21 May 2026, to 2030): a mid-teens revenue CAGR; 3Q26 grew +16% reported and +14% in constant currency, and the 4Q26 guide is about +15%.' },
        premrev: { label: 'Premium Revenue', short: 'Premium revenue', group: 'Revenue', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [3247, 3351, 3516, 3705, 3771, 3740, 3826, 4013, 4148, 4331, 4487, null, null, null],
          summit: [3170.0, 3311.9, 3418.0, 3656.6, 3732.8, 3840.8, 3738.5, 4019.6, 4202.5, 4351.6, 4511.6, 4838.4, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: '⚠ BASIS BREAK, not a revision: effective Jan 1 2026 Spotify reclassified certain revenue-generating activities OUT of Ad-Supported and INTO Premium, restating 2023–2025. The figures here are as ORIGINALLY reported in each quarter’s own deck, so 1Q26 onward is not on the same basis as the quarters before it. For scale, the restated comparatives in the decks are €3,783M for 1Q25 against €3,771M originally reported, and €3,835M for 3Q25 against €3,826M. 3Q26 printed €4,487M, +17% reported and +15% constant-currency against the restated base, on 9% subscriber growth and Premium ARPU of €4.95, +9.3% (+7.5% constant-currency): the deck attributes the ARPU gain to price increases, partly offset by product and market mix. Not guided separately.' },
        adrev: { label: 'Ad-Supported Revenue', short: 'Ad-Supported revenue', group: 'Revenue', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [389, 456, 472, 537, 419, 453, 446, 518, 385, 446, 482, null, null, null],
          summit: [391.9, 459.4, 481.6, 537.0, 433.8, 478.2, 490.6, 520.0, 461.4, 465.7, 511.6, 590.0, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: '⚠ Same basis break as Premium (the reclassification moved revenue OUT of this line from 1Q26; the restated comparatives are €407M for 1Q25 against €419M as originally reported, and €437M for 3Q25 against €446M). 3Q26 printed €482M, +10% reported and +9% constant-currency against the restated €437M: the first clear step up after two quarters at +3% constant-currency. The deck credits the automated sales channels, which remain the largest contributor, and podcast sponsorship in the Owned & Licensed portfolio; music advertising grew on impressions sold with softness in pricing. The CFO puts the biddable channel at up to 40% and guides to continued progress toward double-digit growth in 4Q26. Summit’s 2026-08-05 snapshot carried €511.6M for 3Q26, so the print sits 6% under the model. Not guided separately. Context: on the Q2 call (4 Aug 2026) management said the migration of the ad inventory to the in-house ad server was complete, which is why double-digit growth in H2 2026 was expected; 3Q26 grew +10% reported and +9% in constant currency.' },
        gp: { label: 'Gross Profit', short: 'Gross profit', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'gross margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [1004, 1112, 1240, 1368, 1326, 1320, 1351, 1499, 1495, 1596, 1639, null, null, null],
          summit: [809.8, 896, 1057.1, 1140.1, 1174.9, 1254.6, 1202.8, 1499.5, 1518.9, 1598.9, 1653.4, 1831.5, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[950.4, 1067.8, 1208, 1303.8, 1323, 1354.5, 1306.2, 1480.5, 1476, 1588.8, 1645, 1757.6, null, null],
          guideHi:[950.4, 1067.8, 1208, 1303.8, 1323, 1354.5, 1306.2, 1480.5, 1476, 1588.8, 1645, 1757.6, null, null],
          note: 'The margin line is the story: consolidated gross margin climbed 27.6% → 33.0% across these eleven quarters (the record is 33.4% in 2Q26; 33.0% is the highest Q3). 3Q26 printed 33.0% against a 32.9% guide, +136bps YoY, with Premium gross margin 34.5% (+130bps) and Ad-Supported 18.7% (+105bps). The 4Q26 guide is 33.8%, +70bps YoY and about +130bps for the full year, after the 3Q26 guide had stepped down 50bps from the record. Spotify guides gross MARGIN (a percentage) every quarter, not gross profit: the guide drawn on this chart is that guided percentage times the guided revenue (derived arithmetic on two of the company’s own numbers: €5.2B × 33.8% = €1,758M for 4Q26), and the guided percentage itself is plotted under Margins (as Spotify guides them). Summit carries no consolidated gross-profit line; here it is the sum of its two segment lines, held from the snapshot before each print (3Q26 from Aug 5 2026: ~32.9% against 32.9% guided and 33.0% reported). The 3Q26 segment gross profits (Premium €1,549M, Ad-Supported €90M) are derived from the deck’s segment margins and the €1,639M total — the only whole-euro pair consistent with 34.5%, 18.7% and the sum — until the segment note of the interim 6-K is filed.' },
        gm: { label: 'Gross Margin (as guided)', guided: true, short: 'Gross margin', group: 'Margins', unit: 'pct', surprise: false,
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [27.6, 29.2, 31.1, 32.2, 31.6, 31.5, 31.6, 33.1, 33, 33.4, 33, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[26.4, 28.1, 30.2, 31.8, 31.5, 31.5, 31.1, 32.9, 32.8, 33.1, 32.9, 33.8, null, null],
          guideHi:[26.4, 28.1, 30.2, 31.8, 31.5, 31.5, 31.1, 32.9, 32.8, 33.1, 32.9, 33.8, null, null],
          note: 'Gross profit ÷ revenue (€, exact; matches each deck’s reported margin). Guide: the single percentage Spotify gave on the prior quarter’s call, every quarter from 1Q24 (Q4 2023 call → 1Q24 … Q3 2026 call → 4Q26). 3Q26 printed 33.0% against a 32.9% guide. The Street margin is on Gross Profit in margin mode; the Summit model has no consolidated margin line. Investor Day target (21 May 2026, to 2030): a 35–40% gross margin; 3Q26 at 33.0% is 200bps below the bottom of the range and the 4Q26 guide of 33.8% is 120bps below it.' },
        opinc: { label: 'Operating Income', guided: true, short: 'Op. income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [168, 266, 454, 477, 509, 406, 582, 701, 715, 655, 672, null, null, null],
          summit: [-59.9, 62.4, 292.7, 287.0, 553.5, 520.8, 510.4, 632.1, 710.9, 637.6, 672.5, 927.2, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[180, 250, 405, 481, 548, 539, 485, 620, 660, 630, 670, 820, null, null],
          guideHi:[180, 250, 405, 481, 548, 539, 485, 620, 660, 630, 670, 820, null, null],
          note: 'The second guided line, and historically the one that missed most often — 1Q24, 4Q24, 1Q25 and 2Q25 all landed under the guided point. The recurring reason is SOCIAL CHARGES: Spotify embeds an assumption for them in the guide based on the share price at the prior quarter’s close, so a rising stock mechanically inflates the charge and pushes the actual below the guide. 3Q26 printed €672M against €670M with €22M of social charges against €9M embedded (struck on a $459.13 close), so excluding the unforecast €13M the beat is €15M, which the deck attributes to marketing and personnel-related costs and gross-margin strength; the prior-year quarter carried a €16M credit. Six straight quarters at or above the guide now. 4Q26 is guided to €820M with €6M of social charges embedded at a $487.38 close, and the CFO says operating expense growth is moderating and will keep doing so into 2027. The Street stood at €670M going in; Summit’s 2026-08-05 snapshot carried €698.9M, 4% above the print. Investor Day target (21 May 2026, to 2030): an operating margin above 20%; 3Q26 printed 13.5% and the 4Q26 guide implies 15.8% (€820M on €5.2B). Marketing and AI-related investments are the spend behind the operating-expense growth: about €200M of incremental operating expense for the full year (CFO, Q2 call), +19% ex-FX and social charges in 3Q26, growth peaking in Q3 and moderating from Q4 into 2027.' },
        netinc: { label: 'Net Income', short: 'Net income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'net margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [197, 274, 300, 367, 225, -86, 899, 1174, 721, 545, 518, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Net income attributable to owners of the parent. Far noisier than the operating line — 2Q25 printed an €86M LOSS despite €406M of operating income, and 3Q25/4Q25 printed well ABOVE it. Below-the-line items (FX and fair-value moves on the exchangeable notes and financial instruments) drive the gap. 3Q26’s €518M sits BELOW its €672M operating income: finance income net of costs was only €33M (€62M income less €29M costs) against €245M in 3Q25, and tax was €187M. The Exchangeable Notes are no longer on the balance sheet. Not guided; score the operating line first.' },
        eps: { label: 'Diluted EPS', short: 'EPS', group: 'Profitability', unit: 'eps',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [0.97, 1.33, 1.45, 1.76, 1.07, -0.42, 3.28, 4.43, 3.45, 2.61, 2.48, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Diluted EPS in EUROS (not dollars), IFRS as reported — 3Q26 €2.48 diluted on 208.6M shares (€2.52 basic), down from €2.61 in 2Q26 although operating income rose, because the finance line fell from €65M to €33M. Carries the same below-the-line noise as net income. The Bloomberg snapshot of 21 Oct 2026 stood at €2.80, an 11% shortfall; ⚠ the basis of that consensus (IFRS as reported against adjusted or normalized) is not verified, so read the gap as a direction, not as a precise surprise. Spotify does not guide EPS.' },
        fcf: { label: 'Free Cash Flow', short: 'Free cash flow', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'FCF margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [207, 490, 711, 877, 534, 700, 806, 834, 824, 797, 735, null, null, null],
          summit: [108.6, 215.6, 351.2, 391.9, 753.7, 726.4, 706.2, 854.2, 797.6, 716.1, 742.3, 991.2, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Free cash flow has run consistently ABOVE operating income in most quarters — the payment timing of royalty accruals plus deferred subscription revenue give Spotify a structurally favourable working-capital cycle — and 3Q26 is the exception: €735M against €672M of operating income, but down 9% YoY and 14% under the €857M the Street carried, on €740M of operating cash flow less €6M of capex (and a €1M restricted-cash change). The CFO names unfavourable working-capital and cash-tax timing. LTM free cash flow is €3.2B and cash, restricted cash and short term investments €9.9B, with no debt other than leases. Repurchases: $1.1B year to date through Oct 21 (2.2M shares), which neutralizes this year’s dilution, and about 3M shares (~1.5% of the count) since August 2025. Not guided.' },
        mau: { label: 'Monthly Active Users', guided: true, short: 'MAU', group: 'Users', unit: 'count', unitLabel: 'millions of users',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [615, 626, 640, 675, 678, 696, 713, 751, 761, 777, 788, null, null, null],
          summit: [null, null, null, null, null, null, null, 761.2, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          fwd:   [null, null, null, null, null, null, null, null, null, null, 788.13, 819.08, 827.43, 842.97],   // Street (Bloomberg, 2026-10-21) for the periods still to print: the Summit model does not carry this line, so the Top Line forecast reads it
          guideLo:[618, 631, 639, 665, 678, 689, 710, 745, 759, 778, 788, 818, null, null],
          guideHi:[618, 631, 639, 665, 678, 689, 710, 745, 759, 778, 788, 818, null, null],
          note: 'Total monthly active users (millions, end of quarter). Reported by Spotify; the series matches the Bloomberg export (1Q23-3Q26). The guide is the point Spotify gave on the prior quarter’s call, every quarter from 1Q24 (the model holds it only for 4Q25–3Q26; the earlier ones are read from the calls). 3Q26 printed 788M, exactly on the guide (+11M net adds, +11% YoY, growth in all regions). Management says it is optimizing MAU growth across markets (sign-up hygiene, ad load and client migration in markets such as India and Indonesia). The 4Q26 guide is 818M (+30M), with growth the company says is not as high as last year’s record rollout of the new free tier. Summit: only the 2025-12-18 snapshot carries a total-MAU forecast (4Q25 761.2M); in the three later snapshots the row is zero, so there is no Summit line after 4Q25.' },
        subs: { label: 'Premium Subscribers', guided: true, short: 'Subscribers', group: 'Users', unit: 'count', unitLabel: 'millions of subscribers',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [239, 246, 252, 263, 268, 276, 281, 290, 293, 300, 306, null, null, null],
          summit: [null, null, 230.5, 245.4, 240.8, 250.6, 257, 270.9, 270.7, 281.8, 304.9, 319, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          fwd:   [null, null, null, null, null, null, null, null, null, null, 305.15, 314.72, 318.08, 324.76],   // Street (Bloomberg, 2026-10-21) for the periods still to print: the Summit model does not carry this line, so the Top Line forecast reads it
          guideLo:[230, 245, 251, 260, 265, 273, 281, 289, 293, 299, 305, 316, null, null],
          guideHi:[230, 245, 251, 260, 265, 273, 281, 289, 293, 299, 305, 316, null, null],
          note: 'Premium subscribers (millions, end of quarter). Guide: the point Spotify gave on the prior quarter’s call, every quarter from 1Q24 (read from the calls; the Summit model’s subscriber-guide label is empty). 3Q26 printed 306M, one million ahead of the 305M guide (+6M net adds, +9% YoY, growth in every region). The 4Q26 guide is 316M (+10M). Summit: only the 2025-12-18 snapshot forecasts subscribers (4Q25 295.1M). Bloomberg labels this series Premium Monthly Active Users.' },
        admau: { label: 'Ad-Supported MAU', short: 'Ad-supported MAU', group: 'Users', unit: 'count', unitLabel: 'millions of users',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [388, 393, 402, 425, 423, 433, 446, 476, 483, 494, 499, null, null, null],
          summit: [null, null, 357.3, 380.4, 378, 382.1, 393.3, 428, 430.4, 450.9, 501.5, 526.4, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          fwd:   [null, null, null, null, null, null, null, null, null, null, 498.37, 519.69, 523.88, 533.08],   // Street (Bloomberg, 2026-10-21) for the periods still to print: the Summit model does not carry this line, so the Top Line forecast reads it
          guideLo:[401, 398, 401, 419, 426, 429, 442, 470, 481, 494, 500, 519, null, null],
          guideHi:[401, 398, 401, 419, 426, 429, 442, 470, 481, 494, 500, 519, null, null],
          note: 'Ad-supported monthly active users (millions, end of quarter), the audience the advertising business sells. Spotify does not guide it; the line drawn as guidance is DERIVED: guided total MAU minus guided Premium subscribers plus the overlap between the two definitions (subscribers + ad-supported MAU − total MAU, which has run 12–17M: a free user who upgrades can be counted in both, and a lapsed subscriber who stays on the free tier likewise), held at the last reported quarter’s overlap (17M at 3Q26). 3Q26 printed 499M against a derived 500M; the derived 4Q26 guide is 519M (818M less 316M plus 17M). Summit’s 4Q25 estimate (466.2M) is exactly its total MAU less its subscribers, i.e. the model assumed zero overlap. Bloomberg export, one value per quarter across all snapshots.' },
        arpu: { label: 'Premium ARPU', short: 'Premium ARPU', group: 'Users', unit: 'eps',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [4.55, 4.62, 4.71, 4.85, 4.73, 4.57, 4.53, 4.7, 4.76, 4.89, 4.95, null, null, null],
          summit: [null, null, 4.54, 4.65, 4.7, 4.69, 4.43, 4.63, 4.68, 4.85, 4.93, 5.06, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          fwd:   [null, null, null, null, null, null, null, null, null, null, 4.95, 5.03, 5.06, 5.17],   // Street (Bloomberg, 2026-10-21) for the periods still to print: the Summit model does not carry this line, so the Top Line forecast reads it
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Premium average revenue per user, EUR per month, as reported. Not guided; the CFO guides 4Q26 ARPU growth of 4.5% to 5% YoY (recent pricing actions and Audiobooks+ add-ons, partly offset by lapping the prior-year pricing actions across more than 150 markets). 3Q26 printed €4.95, +9.3% (+7.5% constant-currency). Currency moves it by several percent either way, so read it with the constant-currency figure in the deck; the 2Q25-3Q25 dip is mostly FX. Summit: the analyst-supplied quarterly Premium revenue per subscriber (revenue / subscribers at quarter end) divided by three, so it reads on the same monthly basis as the reported figure; the own estimate of the model for each quarter 3Q24 to 4Q26 (the model rows are zero; no Summit quarterly forecast for 2027 yet).' },

        pcpu: { label: 'Premium cost per subscriber', short: 'Premium cost / subscriber', group: 'Users', unit: 'eps',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [3.163, 3.117, 3.093, 3.063, 3.12, 3.023, 3.033, 3.007, 3.077, 3.133, 3.2, null, null, null],
          summit: [null, null, 3.063, 3.14, 3.123, 3.11, 2.953, 3.033, 3.067, 3.177, 3.247, 3.287, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Premium cost of revenue (Premium revenue less Premium gross profit) per subscriber per month: quarterly cost divided by subscribers at quarter end and by three, EUR. Reported quarters are computed from the published lines. Summit: the own estimate of the model for each quarter 3Q24 to 4Q26, supplied by the analyst (the model rows are zero; no Summit quarterly forecast for 2027 yet). They reproduce from the projection history of the model (Premium revenue and gross profit, 2026-08-05 snapshot).' },
        aarpu: { label: 'Ad-Supported ARPU', short: 'Ad-Supported ARPU', group: 'Users', unit: 'eps',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [0.333, 0.387, 0.39, 0.42, 0.33, 0.35, 0.333, 0.363, 0.267, 0.3, 0.322, null, null, null],
          summit: [null, null, 0.413, 0.44, 0.347, 0.383, 0.38, 0.38, 0.28, 0.323, 0.34, 0.373, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Ad-Supported revenue in the quarter divided by Ad-Supported MAUs at quarter end, EUR per month (the quarterly quotient divided by three, as ARPU is reported). Reported quarters are computed from the published lines. Summit: the own estimate of the model for each quarter 3Q24 to 4Q26, supplied by the analyst (the model rows are zero; no Summit quarterly forecast for 2027 yet). They reproduce from the projection history of the model (Premium revenue and gross profit, 2026-08-05 snapshot).' },
        acpu: { label: 'Ad-Supported cost per MAU', short: 'Ad cost / MAU', group: 'Users', unit: 'eps',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [0.313, 0.337, 0.34, 0.357, 0.28, 0.283, 0.273, 0.293, 0.23, 0.243, 0.262, null, null, null],
          summit: [null, null, 0.38, 0.417, 0.313, 0.323, 0.323, 0.297, 0.237, 0.257, 0.267, 0.287, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Ad-Supported cost of revenue (Ad-Supported revenue less Ad-Supported gross profit) divided by Ad-Supported MAUs at quarter end, EUR per month (the quarterly quotient divided by three, as ARPU is reported). Reported quarters are computed from the published lines. Summit: the own estimate of the model for each quarter 3Q24 to 4Q26, supplied by the analyst (the model rows are zero; no Summit quarterly forecast for 2027 yet). They reproduce from the projection history of the model (Premium revenue and gross profit, 2026-08-05 snapshot).' },
        premgp: { label: 'Premium Gross Profit', short: 'Premium gross profit', group: 'Segments', unit: 'usdM', marginOf: 'premrev', marginLabel: 'Premium gross margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [979, 1051, 1178, 1287, 1262, 1237, 1269, 1398, 1445, 1511, 1549, null, null, null],
          summit: [820.4, 920.1, 1020.5, 1113, 1136.4, 1188.1, 1136.7, 1386.8, 1428.8, 1501.3, 1543, 1693.5, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Gross profit of the Premium segment (the profit measure Spotify reports by segment; there is no segment operating income). Reported quarters from the Bloomberg export, which ties to the 6-K segment note in every quarter except 3Q25: Bloomberg carries the consolidated figure there, so 3Q25 is derived as the FY2025 Form 20-F segment total (EUR 5,166M) less the other three quarters. Same reclassification break as Premium revenue from 1Q26.' },
        adgp: { label: 'Ad-Supported Gross Profit', short: 'Ad-Supported gross profit', group: 'Segments', unit: 'usdM', marginOf: 'adrev', marginLabel: 'Ad-Supported gross margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [25, 61, 62, 81, 64, 83, 82, 101, 50, 85, 90, null, null, null],
          summit: [-10.6, -24.1, 36.6, 27.1, 38.5, 66.5, 66.1, 112.8, 90, 97.6, 110.4, 138.1, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Gross profit of the Ad-Supported segment, reported quarters from the Bloomberg export; 3Q25 derived as the FY2025 Form 20-F segment total (EUR 330M) less the other three quarters, because Bloomberg carries a wrong figure there. Same reclassification break as Ad-Supported revenue from 1Q26.' },
        ebitda: { label: 'EBITDA', short: 'EBITDA', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'EBITDA margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [350, 378.3, 631.7, 657, 580, 505, 681, 783, 797, 770, 792, null, null, null],
          summit: [null, null, null, null, null, null, null, 716.8, 892.8, 726.1, 765.3, 1013.2, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'EBITDA on the basis that ties to the Results history: operating income plus D&A plus share-based compensation (3Q26: €672M + €33M + €87M = €792M; the same formula reproduces 2Q25 to 2Q26 to the euro). Street is Bloomberg adjusted EBITDA (€710M for 3Q26, a different definition). Spotify does not guide it. The Summit cell is the 3Q26 projection of the 2026-08-05 snapshot.' },
        ocf: { label: 'Operating Cash Flow', short: 'Operating cash flow', group: 'Cash flow', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [211, 492, 715, 883, 539, 709, 829, 885, 836, 816, 740, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, 765.3, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Net cash from operating activities, reported quarters from the Summit model actuals (which tie to the 6-K: 3Q26 EUR 740M less EUR 6M of capex and a EUR 1M restricted-cash change is the EUR 735M of free cash flow). Not guided.' },
        capex: { label: 'Capex', short: 'Capex', group: 'Cash flow', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [5, 2, 4, 6, 6, 10, 23, 22, 13, 20, 6, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, 23, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Capital expenditure as a positive spend (the model and Bloomberg store it negative). Spotify is structurally capital-light: single-digit to low-twenties EUR millions a quarter (3Q26: EUR 6M, down 17M YoY). Not guided.' },
        dna: { label: 'D&A', short: 'D&A', group: 'Cash flow', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [31, 30, 30, 30, 29, 26, 24, 25, 26, 29, 33, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, 29, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Depreciation and amortisation (3Q26: EUR 27M of property, equipment and lease right-of-use assets plus EUR 6M of intangibles), from the cash-flow statement. Not guided.' },
        shares: { label: 'Diluted Shares', short: 'Diluted shares', group: 'Per share', unit: 'count', unitLabel: 'millions of shares',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26', '4Q26', '1Q27', '2Q27'],
          act:    [203.77, 206.12, 207.4, 209.01, 210.24, 205.43, 213.79, 212.49, 209.28, 208.86, 208.58, null, null, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null, null, null, null],
          note: 'Diluted weighted-average shares (millions). 3Q26 208.6M (205.7M basic) matches the deck; earlier quarters from the Bloomberg export (one value per quarter across all snapshots). The Summit model keeps shares annual only, so there is no Summit cell.' },
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
          { label: 'Totals', keys: ['rev'] },
          { label: 'Segments', keys: ['premrev', 'adrev'] },
          { label: 'Segment gross profit', keys: ['premgp', 'adgp'] }
        ] },
        { key: 'users', label: 'Users', defaultMetric: 'mau', groups: [
          { label: 'Audience', keys: ['mau', 'subs', 'admau'] },
          { label: 'Monetization', keys: ['arpu', 'pcpu', 'aarpu', 'acpu'] }
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'opinc', groups: [
          { label: 'Company', keys: ['gp', 'opinc', 'ebitda', 'netinc', 'eps', 'fcf'] },
          { label: 'Margins (as Spotify guides them)', keys: ['gm'] },
          { label: 'Cash flow', keys: ['ocf', 'capex', 'dna'] },
          { label: 'Per share', keys: ['shares'] }
        ] }
      ]
    },
    y: {
      label: 'Annual',
      note: 'Fiscal-year actuals against the Summit model (snapshot 2026-08-05, frozen) and the Bloomberg consensus vintages. Spotify guides quarters, not years, so there is no guide here. All figures in EUR millions.',
      metrics: {
        rev: { label: 'Total Revenue', short: 'Total revenue', group: 'Revenue', unit: 'usdM',
          periods: ['2023','2024','2025','2026','2027','2028'],
          act:    [13247, 15673, 17186, null, null, null],
          summit: [null, null, null, 19761.5, 23118.8, 27097.4],
          cons:   [null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null],
          note: 'Consolidated revenue. FY2023 is the sum of the four reported quarters (Bloomberg export); FY2024 and FY2025 are the sums of the quarterly dataset and tie to the Form 20-F. FY2026-FY2028 is the Summit model, snapshot 2026-08-05, frozen. Street comes from the Bloomberg vintages.' },
        premrev: { label: 'Premium Revenue', short: 'Premium revenue', group: 'Revenue', unit: 'usdM',
          periods: ['2023','2024','2025','2026','2027','2028'],
          act:    [11566, 13819, 15350, null, null, null],
          summit: [null, null, null, 17829, 20885, 24358],
          cons:   [null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null],
          note: 'Premium segment. FY2023-FY2025 as reported (Form 20-F, EUR 15,350M for FY2025). Basis break: from 1 Jan 2026 Spotify moved certain activities from Ad-Supported into Premium and restated 2023-25; the Summit years are on the new basis, so the step from FY2025 to FY2026 mixes the two bases.' },
        adrev: { label: 'Ad-Supported Revenue', short: 'Ad-Supported revenue', group: 'Revenue', unit: 'usdM',
          periods: ['2023','2024','2025','2026','2027','2028'],
          act:    [1681, 1854, 1836, null, null, null],
          summit: [null, null, null, 1933, 2234, 2739],
          cons:   [null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null],
          note: 'Ad-Supported segment, as reported through FY2025 (EUR 1,836M). Same basis break as Premium: Summit FY2026-FY2028 is on the restated basis.' },
        gp: { label: 'Gross Profit', short: 'Gross profit', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'gross margin',
          periods: ['2023','2024','2025','2026','2027','2028'],
          act:    [3397, 4724, 5496, null, null, null],
          summit: [null, null, null, 6576, 7931, 9728],
          cons:   [null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null],
          note: 'Consolidated gross profit. Summit is the sum of the two segment gross profits in the model, which is how the model carries it.' },
        premgp: { label: 'Premium Gross Profit', short: 'Premium gross profit', group: 'Profitability', unit: 'usdM', marginOf: 'premrev', marginLabel: 'Premium gross margin',
          periods: ['2023','2024','2025','2026','2027','2028'],
          act:    [3334, 4495, 5166, null, null, null],
          summit: [null, null, null, 6192, 7372, 8769],
          cons:   [null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null],
          note: 'Premium segment gross profit: Form 20-F Note 23 for FY2025 (EUR 5,166M); FY2023-FY2024 are sums of the reported quarters. No segment operating income exists.' },
        adgp: { label: 'Ad-Supported Gross Profit', short: 'Ad-Supported gross profit', group: 'Profitability', unit: 'usdM', marginOf: 'adrev', marginLabel: 'Ad-Supported gross margin',
          periods: ['2023','2024','2025','2026','2027','2028'],
          act:    [62, 229, 330, null, null, null],
          summit: [null, null, null, 384, 559, 959],
          cons:   [null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null],
          note: 'Ad-Supported segment gross profit: Form 20-F Note 23 for FY2025 (EUR 330M); FY2023-FY2024 are sums of the reported quarters.' },
        opinc: { label: 'Operating Income', short: 'Op. income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
          periods: ['2023','2024','2025','2026','2027','2028'],
          act:    [-446, 1365, 2198, null, null, null],
          summit: [null, null, null, 2969.7, 3914.0, 5259.7],
          cons:   [null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null],
          note: 'Operating income (IFRS): FY2023 is a loss of EUR 446M (sum of the four quarters), FY2024 EUR 1,365M, FY2025 EUR 2,198M.' },
        earnings: { label: 'Net Income (model earnings)', short: 'Net income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'net margin',
          periods: ['2023','2024','2025','2026','2027','2028'],
          act:    [null, 1138, 2212, null, null, null],
          summit: [null, null, null, 2821.6, 3234.8, 4363.4],
          cons:   [null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null],
          note: 'Net income attributable to owners of the parent: the sum of the four reported quarters (FY2024 1,138, FY2025 2,212; FY2023 is not on file). Summit: the EARNINGS row of the model, which carries ANNUAL values only (FY2026 2,821.6, FY2027 3,234.8, FY2028 4,363.4 in the 2026-08-05 snapshot) and no quarters, so the quarterly chart has no Summit line.' },
        ebitda: { label: 'EBITDA', short: 'EBITDA', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'EBITDA margin',
          periods: ['2023','2024','2025','2026','2027','2028'],
          act:    [null, 2017, 2549, null, null, null],
          summit: [null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null],
          note: 'EBITDA as the Bloomberg export defines it: the sum of the four reported quarters (FY2024 2,017, FY2025 2,549; FY2023 is not on file). The Summit model has no annual EBITDA in the 2026-08-05 snapshot (the row is zero), so the annual chart has no Summit line.' },
        fcf: { label: 'Free Cash Flow', short: 'Free cash flow', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'FCF margin',
          periods: ['2023','2024','2025','2026','2027','2028'],
          act:    [678, 2285, 2874, null, null, null],
          summit: [null, null, null, 3508.5, 4340.1, 5621.3],
          cons:   [null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null],
          note: 'Free cash flow: the sum of the four reported quarters (the FY2025 actual in the Summit model is EUR 2,872M).' },
      },
      sections: [
        { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
          { label: 'Totals', keys: ['rev'] },
          { label: 'Segments', keys: ['premrev', 'adrev'] }
        ] },
        { key: 'margins', label: 'Margins & Profitability', defaultMetric: 'opinc', groups: [
          { label: 'Company', keys: ['gp', 'opinc', 'ebitda', 'earnings', 'fcf'] },
          { label: 'Segment gross profit', keys: ['premgp', 'adgp'] }
        ] }
      ]
    }
  },
  // ── Estimate EVOLUTION across model snapshots (vintages) ────────────────────
  // How the ANNUAL forecast for each fiscal year moved as prints landed. Source of
  // record: the SUMMIT RESEARCH DATABASE — the model's saved snapshots, pulled
  // through the Summit MCP (`get_fundamentals`, sheet_source `projection_history`).
  // FIVE vintages now exist for SPOT; the fifth (2026-08-04) was parsed the morning
  // of the 2Q26 print and DOES contain it.
  //
  // ── GENERATED BLOCK — do not hand-edit. Rebuilt by scripts/consensus/emit_matrix.py
  // (see docs/RESULTS_CONVENTIONS.md §8). Source: the UNION of BBG_CONSENSUS.txt (the
  // exported archive) and Consensus_Portal.xlsm sheet CONSENSUS (the live sheet, which
  // can overwrite its most recent row), deduped by data_as_of. Only FORWARD horizons
  // are kept — the (Rep)-marked columns are Bloomberg's own reported figures, not
  // estimates, and can sit on a different basis than the company's own measure.
  estMatrix: {
    cons: {
      vintages: [
        { id: '2024-04-28', label: '2024-04-28', lastActual: { q: '1Q24', y: '2023' } },
        { id: '2024-07-28', label: '2024-07-28', lastActual: { q: '2Q24', y: '2023' } },
        { id: '2024-11-17', label: '2024-11-17', lastActual: { q: '3Q24', y: '2023' } },
        { id: '2025-02-09', label: '2025-02-09', lastActual: { q: '4Q24', y: '2024' } },
        { id: '2025-05-04', label: '2025-05-04', lastActual: { q: '1Q25', y: '2024' } },
        { id: '2025-08-03', label: '2025-08-03', lastActual: { q: '2Q25', y: '2024' } },
        { id: '2025-11-09', label: '2025-11-09', lastActual: { q: '3Q25', y: '2024' } },
        { id: '2026-02-15', label: '2026-02-15', lastActual: { q: '4Q25', y: '2025' } },
        { id: '2026-05-03', label: '2026-05-03', lastActual: { q: '1Q26', y: '2025' } },
        { id: '2026-10-21', label: '2026-10-21', lastActual: { q: '2Q26', y: '2025' } },
      ],
      q: {
      rev: {
        '2024-04-28': { '2Q24': 3794.7778, '3Q24': 3962.1154, '4Q24': 4218.6538, '1Q25': 4210.5833 },
        '2024-07-28': { '3Q24': 4029.4444, '4Q24': 4266.3704, '1Q25': 4227.2, '2Q25': 4417.8 },
        '2024-11-17': { '4Q24': 4164.0667, '1Q25': 4172.0435, '2Q25': 4365.1739, '3Q25': 4562.4783 },
        '2025-02-09': { '1Q25': 4214.6897, '2Q25': 4404, '3Q25': 4619.1429, '4Q25': 4914.4286 },
        '2025-05-04': { '2Q25': 4304.0938, '3Q25': 4522.6875, '4Q25': 4841.4062, '1Q26': 4794.2 },
        '2025-08-03': { '3Q25': 4260.4688, '4Q25': 4627.0938, '1Q26': 4681.5294, '2Q26': 4832.1176 },
        '2025-11-09': { '4Q25': 4530.5938, '1Q26': 4609.2273, '2Q26': 4834.6818, '3Q26': 5020.15 },
        '2026-02-15': { '1Q26': 4531.2581, '2Q26': 4776.1613, '3Q26': 4946.8065, '4Q26': 5264.3226 },
        '2026-05-03': { '2Q26': 4794.5882, '3Q26': 4924.7353, '4Q26': 5229.1176, '1Q27': 5191.8824 },
        '2026-10-21': { '3Q26': 4982.8824, '4Q26': 5244.6765, '1Q27': 5233.2857, '2Q27': 5482.4762 },
      },
      premrev: {
        '2024-04-28': { '2Q24': 3325.9749, '3Q24': 3442.5727, '4Q24': 3634.738, '1Q25': 3675.8279 },
        '2024-07-28': { '3Q24': 3543.8989, '4Q24': 3709.8008, '1Q25': 3785.986, '2Q25': 3895.8086 },
        '2024-11-17': { '4Q24': 3644.881, '1Q25': 5638.0949, '2Q25': 3874.2116, '3Q25': 4048.3935 },
        '2025-02-09': { '1Q25': 3796.618, '2Q25': 3907.4218, '3Q25': 4091.1243, '4Q25': 4316.906 },
        '2025-05-04': { '2Q25': 3822.5576, '3Q25': 4011.6638, '4Q25': 4250.5627, '1Q26': 4306.4495 },
        '2025-08-03': { '3Q25': 3793.962, '4Q25': 4083.2981, '1Q26': 4235.9637, '2Q26': 4330.7638 },
        '2025-11-09': { '4Q25': 4002.0605, '1Q26': 4179.2496, '2Q26': 4342.3485, '3Q26': 4492.9065 },
        '2026-02-15': { '1Q26': 4104.0272, '2Q26': 4293.7928, '3Q26': 4436.9231, '4Q26': 4664.9705 },
        '2026-05-03': { '2Q26': 4338.6551, '3Q26': 4430.2132, '4Q26': 4660.3226, '1Q27': 4749.8513 },
        '2026-10-21': { '3Q26': 4495.538, '4Q26': 4675.0694, '1Q27': 4787.8877, '2Q27': 4968.3486 },
      },
      adrev: {
        '2024-04-28': { '2Q24': 474.4105, '3Q24': 522.1229, '4Q24': 591.7698, '1Q25': 472.6465 },
        '2024-07-28': { '3Q24': 482.9579, '4Q24': 551.7305, '1Q25': 445.7892, '2Q25': 529.8957 },
        '2024-11-17': { '4Q24': 509.7396, '1Q25': 409.3606, '2Q25': 485.4149, '3Q25': 519.4957 },
        '2025-02-09': { '1Q25': 421.1745, '2Q25': 496.2829, '3Q25': 528.6679, '4Q25': 603.0464 },
        '2025-05-04': { '2Q25': 482.0445, '3Q25': 507.7378, '4Q25': 583.9929, '1Q26': 470.3733 },
        '2025-08-03': { '3Q25': 478.9487, '4Q25': 559.1509, '1Q26': 460.4261, '2Q26': 519.0066 },
        '2025-11-09': { '4Q25': 527.8747, '1Q26': 428.4916, '2Q26': 487.7477, '3Q26': 513.0262 },
        '2026-02-15': { '1Q26': 420.382, '2Q26': 480.9523, '3Q26': 505.5668, '4Q26': 596.0883 },
        '2026-05-03': { '2Q26': 455.5662, '3Q26': 485.3981, '4Q26': 579.5901, '1Q27': 434.4909 },
        '2026-10-21': { '3Q26': 484.7809, '4Q26': 572.2163, '1Q27': 439.9142, '2Q27': 508.341 },
      },
      gp: {
        '2024-04-28': { '2Q24': 1058.7667, '3Q24': 1121.4085, '4Q24': 1216.143, '1Q25': 1189.8851 },
        '2024-07-28': { '3Q24': 1205.895, '4Q24': 1291.6058, '1Q25': 1267.9238, '2Q25': 1351.5832 },
        '2024-11-17': { '4Q24': 1313.8301, '1Q25': 1300.7107, '2Q25': 1379.3474, '3Q25': 1466.2147 },
        '2025-02-09': { '1Q25': 1324.0654, '2Q25': 1388.5602, '3Q25': 1466.4977, '4Q25': 1606.3422 },
        '2025-05-04': { '2Q25': 1357.5727, '3Q25': 1433.0838, '4Q25': 1580.5029, '1Q26': 1553.0359 },
        '2025-08-03': { '3Q25': 1335.8552, '4Q25': 1510.5701, '1Q26': 1515.4271, '2Q26': 1571.5765 },
        '2025-11-09': { '4Q25': 1490.447, '1Q26': 1488.8048, '2Q26': 1585.2558, '3Q26': 1647.3117 },
        '2026-02-15': { '1Q26': 1481.3085, '2Q26': 1581.3338, '3Q26': 1637.0683, '4Q26': 1795.176 },
        '2026-05-03': { '2Q26': 1587.8117, '3Q26': 1625.969, '4Q26': 1780.2668, '1Q27': 1764.7186 },
        '2026-10-21': { '3Q26': 1642.0917, '4Q26': 1772.2205, '1Q27': 1768.1968, '2Q27': 1873.3539 },
      },
      premgp: {
        '2024-04-28': { '2Q24': 1009.7806, '3Q24': 1050.7967, '4Q24': 1118.8298, '1Q25': 1134.7861 },
        '2024-07-28': { '3Q24': 1130.6053, '4Q24': 1184.8288, '1Q25': 1193.9678, '2Q25': 1235.3281 },
        '2024-11-17': { '4Q24': 1802.4664, '1Q25': 2017.6652, '2Q25': 1295.8859, '3Q25': 1371.8514 },
        '2025-02-09': { '1Q25': 1274.8679, '2Q25': 1307.4371, '3Q25': 1375.9478, '4Q25': 1486.777 },
        '2025-05-04': { '2Q25': 1281.2402, '3Q25': 1349.903, '4Q25': 1470.111, '1Q26': 1470.2304 },
        '2025-08-03': { '3Q25': 1254.0641, '4Q25': 1408.4891, '1Q26': 1450.5518, '2Q26': 1480.5001 },
        '2025-11-09': { '4Q25': 1380.6754, '1Q26': 1414.0878, '2Q26': 1490.2649, '3Q26': 1536.6523 },
        '2026-02-15': { '1Q26': 1405.3669, '2Q26': 1481.2245, '3Q26': 1529.9793, '4Q26': 1659.049 },
        '2026-05-03': { '2Q26': 1510.7543, '3Q26': 1534.7247, '4Q26': 1659.5271, '1Q27': 1688.3076 },
        '2026-10-21': { '3Q26': 1543.6566, '4Q26': 1646.5518, '1Q27': 1693.5006, '2Q27': 1764.9523 },
      },
      adgp: {
        '2024-04-28': { '2Q24': 54.0892, '3Q24': 71.7244, '4Q24': 100.5048, '1Q25': 59.9387 },
        '2024-07-28': { '3Q24': 74.2086, '4Q24': 98.6432, '1Q25': 54.0751, '2Q25': 92.3298 },
        '2024-11-17': { '4Q24': 88.8335, '1Q25': 47.9472, '2Q25': 79.9378, '3Q25': 91.2412 },
        '2025-02-09': { '1Q25': 41.2042, '2Q25': 71.6139, '3Q25': 79.0513, '4Q25': 108.0372 },
        '2025-05-04': { '2Q25': 74.6297, '3Q25': 79.8074, '4Q25': 106.5205, '1Q26': 79.1365 },
        '2025-08-03': { '3Q25': 82.1965, '4Q25': 108.1175, '1Q26': 80.497, '2Q26': 107.5804 },
        '2025-11-09': { '4Q25': 109.4898, '1Q26': 76.5472, '2Q26': 102.9968, '3Q26': 110.2263 },
        '2026-02-15': { '1Q26': 76.5754, '2Q26': 100.7923, '3Q26': 107.0013, '4Q26': 141.196 },
        '2026-05-03': { '2Q26': 76.6342, '3Q26': 88.2942, '4Q26': 125.539, '1Q27': 81.1984 },
        '2026-10-21': { '3Q26': 93.7125, '4Q26': 125.4267, '1Q27': 75.1329, '2Q27': 108.7677 },
      },
      opinc: {
        '2024-04-28': { '2Q24': 228.9231, '3Q24': 275.7826, '4Q24': 307.2174, '1Q25': 329.3333 },
        '2024-07-28': { '3Q24': 401.2308, '4Q24': 426.52, '1Q25': 396.7692, '2Q25': 444.7857 },
        '2024-11-17': { '4Q24': 476.3793, '1Q25': 477, '2Q25': 504.2381, '3Q25': 581.3182 },
        '2025-02-09': { '1Q25': 544.7273, '2Q25': 557.96, '3Q25': 638.2963, '4Q25': 701.7407 },
        '2025-05-04': { '2Q25': 536.1667, '3Q25': 594.5517, '4Q25': 679.9286, '1Q26': 692.2667 },
        '2025-08-03': { '3Q25': 504.5714, '4Q25': 622.0357, '1Q26': 660, '2Q26': 657 },
        '2025-11-09': { '4Q25': 623.4483, '1Q26': 642.5714, '2Q26': 672.1905, '3Q26': 796.5789 },
        '2026-02-15': { '1Q26': 663.8889, '2Q26': 669.1154, '3Q26': 778.963, '4Q26': 882.5185 },
        '2026-05-03': { '2Q26': 640.8214, '3Q26': 703.4138, '4Q26': 854.4, '1Q27': 886.6875 },
        '2026-10-21': { '3Q26': 669.9677, '4Q26': 803.6562, '1Q27': 881.1, '2Q27': 887.35 },
      },
      ebitda: {
        '2024-04-28': { '2Q24': 276.15, '3Q24': 327.7143, '4Q24': 358.05, '1Q25': 382.2 },
        '2024-07-28': { '3Q24': 440.2857, '4Q24': 470.1304, '1Q25': 438.8571, '2Q25': 492.1429 },
        '2024-11-17': { '4Q24': 516.4348, '1Q25': 506.0526, '2Q25': 540.25, '3Q25': 626.3 },
        '2025-02-09': { '1Q25': 561.1364, '2Q25': 589.5652, '3Q25': 673.6957, '4Q25': 743.9091 },
        '2025-05-04': { '2Q25': 569.5652, '3Q25': 628.7083, '4Q25': 716.5, '1Q26': 725.5 },
        '2025-08-03': { '3Q25': 535.9545, '4Q25': 666.1667, '1Q26': 695.6154, '2Q26': 692.8462 },
        '2025-11-09': { '4Q25': 661.4615, '1Q26': 683.2941, '2Q26': 712.7059, '3Q26': 831.25 },
        '2026-02-15': { '1Q26': 708.6923, '2Q26': 726.72, '3Q26': 833.24, '4Q26': 938.8333 },
        '2026-05-03': { '2Q26': 692.2963, '3Q26': 748.4074, '4Q26': 902.5556, '1Q27': 943.3846 },
        '2026-10-21': { '3Q26': 710.16, '4Q26': 848.32, '1Q27': 920, '2Q27': 917 },
      },
      netinc: {
        '2024-04-28': { '2Q24': 223.6048, '3Q24': 277.65, '4Q24': 324.8, '1Q25': 301.4444 },
        '2024-07-28': { '3Q24': 360.2381, '4Q24': 387.0476, '1Q25': 357.4167, '2Q25': 405.75 },
        '2024-11-17': { '4Q24': 398.5217, '1Q25': 387.3333, '2Q25': 427.2778, '3Q25': 506.0556 },
        '2025-02-09': { '1Q25': 449.2917, '2Q25': 480.2917, '3Q25': 551.125, '4Q25': 607.1667 },
        '2025-05-04': { '2Q25': 436.84, '3Q25': 487.96, '4Q25': 564.76, '1Q26': 573 },
        '2025-08-03': { '3Q25': 391.3846, '4Q25': 514.6538, '1Q26': 530.4, '2Q26': 514.2667 },
        '2025-11-09': { '4Q25': 572.6154, '1Q26': 551.3333, '2Q26': 584.1111, '3Q26': 693.7059 },
        '2026-02-15': { '1Q26': 607.6957, '2Q26': 618.5, '3Q26': 706.375, '4Q26': 793.2917 },
        '2026-05-03': { '2Q26': 588.1852, '3Q26': 649.8148, '4Q26': 766.5556, '1Q27': 790.9091 },
        '2026-10-21': { '3Q26': 581.3571, '4Q26': 692.7857, '1Q27': 749.4286, '2Q27': 763.5 },
      },
      eps: {
        '2024-04-28': { '2Q24': 1.0071, '3Q24': 1.2604, '4Q24': 1.3992, '1Q25': 1.435 },
        '2024-07-28': { '3Q24': 1.7285, '4Q24': 1.8596, '1Q25': 1.7338, '2Q25': 1.9029 },
        '2024-11-17': { '4Q24': 1.9154, '1Q25': 1.8832, '2Q25': 2.0635, '3Q25': 2.3848 },
        '2025-02-09': { '1Q25': 2.1326, '2Q25': 2.2715, '3Q25': 2.6204, '4Q25': 2.8722 },
        '2025-05-04': { '2Q25': 2.1713, '3Q25': 2.4113, '4Q25': 2.8227, '1Q26': 2.7654 },
        '2025-08-03': { '3Q25': 2.0243, '4Q25': 2.5662, '1Q26': 2.69, '2Q26': 2.5094 },
        '2025-11-09': { '4Q25': 2.5752, '1Q26': 2.6938, '2Q26': 2.79, '3Q26': 3.278 },
        '2026-02-15': { '1Q26': 2.9003, '2Q26': 2.9163, '3Q26': 3.2852, '4Q26': 3.7068 },
        '2026-05-03': { '2Q26': 2.7735, '3Q26': 3.0526, '4Q26': 3.6397, '1Q27': 3.7759 },
        '2026-10-21': { '3Q26': 2.8, '4Q26': 3.3229, '1Q27': 3.6141, '2Q27': 3.6614 },
      },
      fcf: {
        '2024-04-28': { '2Q24': 316.7339, '3Q24': 459.9513, '4Q24': 582.175, '1Q25': 416.2584 },
        '2024-07-28': { '3Q24': 548.8356, '4Q24': 677.3087, '1Q25': 495.8394, '2Q25': 561.2951 },
        '2024-11-17': { '4Q24': 688.3751, '1Q25': 533.8979, '2Q25': 665.3047, '3Q25': 732.4653 },
        '2025-02-09': { '1Q25': 516.9574, '2Q25': 722.2113, '3Q25': 812.4698, '4Q25': 962.1223 },
        '2025-05-04': { '2Q25': 675.6609, '3Q25': 810.806, '4Q25': 1001.8566, '1Q26': 620.8809 },
        '2025-08-03': { '3Q25': 690.1333, '4Q25': 962.32, '1Q26': 634.5939, '2Q26': 815.9991 },
        '2025-11-09': { '4Q25': 935.0815, '1Q26': 659.3918, '2Q26': 871.6106, '3Q26': 962.3689 },
        '2026-02-15': { '1Q26': 760.5658, '2Q26': 918.118, '3Q26': 994.6742, '4Q26': 996.1769 },
        '2026-05-03': { '2Q26': 858.385, '3Q26': 896.2226, '4Q26': 942.1267, '1Q27': 916.9679 },
        '2026-10-21': { '3Q26': 857.3042, '4Q26': 885.4249, '1Q27': 899.7553, '2Q27': 932.9059 },
      },
      mau: {
        '2024-04-28': { '2Q24': 632.1229, '3Q24': 651.6254, '4Q24': 677.0369, '1Q25': 688.0892 },
        '2024-07-28': { '3Q24': 641.4103, '4Q24': 664.3317, '1Q25': 678.8655, '2Q25': 694.9319 },
        '2024-11-17': { '4Q24': 664.1953, '1Q25': 679.3461, '2Q25': 694.3838, '3Q25': 710.3419 },
        '2025-02-09': { '1Q25': 678.7476, '2Q25': 694.8973, '3Q25': 711.5549, '4Q25': 739.4801 },
        '2025-05-04': { '2Q25': 689.7333, '3Q25': 706.5465, '4Q25': 736.2422, '1Q26': 744.8202 },
        '2025-08-03': { '3Q25': 709.9674, '4Q25': 740.6754, '1Q26': 747.865, '2Q26': 763.2011 },
        '2025-11-09': { '4Q25': 743.5788, '1Q26': 752.1064, '2Q26': 768.4067, '3Q26': 784.5565 },
        '2026-02-15': { '1Q26': 758.6711, '2Q26': 774.1057, '3Q26': 790.3443, '4Q26': 821.1584 },
        '2026-05-03': { '2Q26': 777.6568, '3Q26': 793.4692, '4Q26': 825.6119, '1Q27': 834.6784 },
        '2026-10-21': { '3Q26': 788.1308, '4Q26': 819.0788, '1Q27': 827.4254, '2Q27': 842.9702 },
      },
      subs: {
        '2024-04-28': { '2Q24': 245.2388, '3Q24': 250.9102, '4Q24': 259.8686, '1Q25': 262.5137 },
        '2024-07-28': { '3Q24': 251.0729, '4Q24': 259.6215, '1Q25': 262.9301, '2Q25': 269.7103 },
        '2024-11-17': { '4Q24': 259.9847, '1Q25': 263.3764, '2Q25': 270.1932, '3Q25': 275.8154 },
        '2025-02-09': { '1Q25': 265.0408, '2Q25': 271.3912, '3Q25': 277.3647, '4Q25': 286.7886 },
        '2025-05-04': { '2Q25': 272.9425, '3Q25': 278.3346, '4Q25': 287.6878, '1Q26': 291.537 },
        '2025-08-03': { '3Q25': 280.5636, '4Q25': 289.8034, '1Q26': 293.9119, '2Q26': 299.534 },
        '2025-11-09': { '4Q25': 289.0015, '1Q26': 293.5869, '2Q26': 299.8603, '3Q26': 305.1074 },
        '2026-02-15': { '1Q26': 293.2522, '2Q26': 300.7458, '3Q26': 306.525, '4Q26': 315.6361 },
        '2026-05-03': { '2Q26': 299.0801, '3Q26': 305.3312, '4Q26': 314.9588, '1Q27': 317.9194 },
        '2026-10-21': { '3Q26': 305.1475, '4Q26': 314.7188, '1Q27': 318.0825, '2Q27': 324.7615 },
      },
      admau: {
        '2024-04-28': { '2Q24': 398.7064, '3Q24': 411.9461, '4Q24': 428.6856, '1Q25': 438.5434 },
        '2024-07-28': { '3Q24': 402.5897, '4Q24': 416.551, '1Q25': 428.3597, '2Q25': 437.5755 },
        '2024-11-17': { '4Q24': 417.4038, '1Q25': 427.7078, '2Q25': 436.3159, '3Q25': 446.4055 },
        '2025-02-09': { '1Q25': 426.154, '2Q25': 436.083, '3Q25': 446.5198, '4Q25': 464.4002 },
        '2025-05-04': { '2Q25': 429.9187, '3Q25': 441.5645, '4Q25': 461.7152, '1Q26': 466.026 },
        '2025-08-03': { '3Q25': 441.6096, '4Q25': 462.411, '1Q26': 466.0089, '2Q26': 474.3103 },
        '2025-11-09': { '4Q25': 467.4911, '1Q26': 471.4997, '2Q26': 480.1378, '3Q26': 489.7981 },
        '2026-02-15': { '1Q26': 478.896, '2Q26': 486.8136, '3Q26': 497.0026, '4Q26': 518.1011 },
        '2026-05-03': { '2Q26': 491.166, '3Q26': 502.4756, '4Q26': 524.7727, '1Q27': 528.1382 },
        '2026-10-21': { '3Q26': 498.3735, '4Q26': 519.6926, '1Q27': 523.8809, '2Q27': 533.0779 },
      },
      arpu: {
        '2024-04-28': { '2Q24': 4.5702, '3Q24': 4.6162, '4Q24': 4.7367, '1Q25': 4.6921 },
        '2024-07-28': { '3Q24': 4.7539, '4Q24': 4.8369, '1Q25': 4.8236, '2Q25': 4.8795 },
        '2024-11-17': { '4Q24': 4.7533, '1Q25': 4.7746, '2Q25': 4.8364, '3Q25': 4.9304 },
        '2025-02-09': { '1Q25': 4.7925, '2Q25': 4.8461, '3Q25': 4.9595, '4Q25': 5.0895 },
        '2025-05-04': { '2Q25': 4.7045, '3Q25': 4.8471, '4Q25': 4.9933, '1Q26': 4.9323 },
        '2025-08-03': { '3Q25': 4.5453, '4Q25': 4.7633, '1Q26': 4.8337, '2Q26': 4.8312 },
        '2025-11-09': { '4Q25': 4.6737, '1Q26': 4.7745, '2Q26': 4.8516, '3Q26': 4.9157 },
        '2026-02-15': { '1Q26': 4.6875, '2Q26': 4.8103, '3Q26': 4.8664, '4Q26': 4.9854 },
        '2026-05-03': { '2Q26': 4.8843, '3Q26': 4.8892, '4Q26': 5.0007, '1Q27': 4.9628 },
        '2026-10-21': { '3Q26': 4.9503, '4Q26': 5.03, '1Q27': 5.0572, '2Q27': 5.1745 },
      },
      ocf: {
        '2024-04-28': { '2Q24': 323.6068, '3Q24': 464.7296, '4Q24': 588.3662, '1Q25': 451.5326 },
        '2024-07-28': { '3Q24': 520.1801, '4Q24': 629.7979, '1Q25': 501.2889, '2Q25': 565.9084 },
        '2024-11-17': { '4Q24': 631.1541, '1Q25': 539.5882, '2Q25': 670.5493, '3Q25': 738.1744 },
        '2025-02-09': { '1Q25': 524.8337, '2Q25': 717.2692, '3Q25': 819.7825, '4Q25': 948.0038 },
        '2025-05-04': { '2Q25': 653.9825, '3Q25': 767.6882, '4Q25': 916.4566, '1Q26': 627.0745 },
        '2025-08-03': { '3Q25': 657.7396, '4Q25': 894.8161, '1Q26': 642.8403, '2Q26': 810.4902 },
        '2025-11-09': { '4Q25': 883.3417, '1Q26': 673.1391, '2Q26': 879.0512, '3Q26': 949.1894 },
        '2026-02-15': { '1Q26': 764.3582, '2Q26': 928.0977, '3Q26': 1010.8507, '4Q26': 1038.5596 },
        '2026-05-03': { '2Q26': 913.7925, '3Q26': 881.716, '4Q26': 979.6301, '1Q27': 933.2658 },
        '2026-10-21': { '3Q26': 873.2494, '4Q26': 898.8828, '1Q27': 909.3875, '2Q27': 947.14 },
      },
      capex: {
        '2024-04-28': { '2Q24': 5.3661, '3Q24': 4.9024, '4Q24': 5.3706, '1Q25': 5.84 },
        '2024-07-28': { '3Q24': 4.6015, '4Q24': 5.1195, '1Q25': 5.6736, '2Q25': 5.7864 },
        '2024-11-17': { '4Q24': 4.7506, '1Q25': 5.9673, '2Q25': 5.4606, '3Q25': 5.9919 },
        '2025-02-09': { '1Q25': 6.6384, '2Q25': 6.5475, '3Q25': 7.2015, '4Q25': 7.683 },
        '2025-05-04': { '2Q25': 6.0709, '3Q25': 6.6991, '4Q25': 7.1939, '1Q26': 6.7333 },
        '2025-08-03': { '3Q25': 7.2692, '4Q25': 8.2937, '1Q26': 8.262, '2Q26': 10.012 },
        '2025-11-09': { '4Q25': 10.9591, '1Q26': 9.8218, '2Q26': 11.2624, '3Q26': 14.3147 },
        '2026-02-15': { '1Q26': 11.6978, '2Q26': 12.753, '3Q26': 15.6822, '4Q26': 15.4309 },
        '2026-05-03': { '2Q26': 10.7276, '3Q26': 11.9596, '4Q26': 12.4536, '1Q27': 8.3531 },
        '2026-10-21': { '3Q26': 16.032, '4Q26': 16.6184, '1Q27': 13.2812, '2Q27': 15.6006 },
      },
      dna: {
        '2024-04-28': { '2Q24': 38.1259, '3Q24': 37.2964, '4Q24': 37.6298, '1Q25': 35.9091 },
        '2024-07-28': { '3Q24': 33.5742, '4Q24': 33.4347, '1Q25': 33.8723, '2Q25': 33.886 },
        '2024-11-17': { '4Q24': 31.9513, '1Q25': 32.6741, '2Q25': 32.8028, '3Q25': 32.68 },
        '2025-02-09': { '1Q25': 31.538, '2Q25': 31.2672, '3Q25': 30.963, '4Q25': 30.5549 },
        '2025-05-04': { '2Q25': 29.9991, '3Q25': 29.7194, '4Q25': 29.5332, '1Q26': 27.5598 },
        '2025-08-03': { '3Q25': 28.7689, '4Q25': 28.8198, '1Q26': 27.0169, '2Q26': 26.8803 },
        '2025-11-09': { '4Q25': 28.8279, '1Q26': 27.7321, '2Q26': 27.4534, '3Q26': 26.889 },
        '2026-02-15': { '1Q26': 27.7157, '2Q26': 27.8096, '3Q26': 27.4592, '4Q26': 27.6659 },
        '2026-05-03': { '2Q26': 28.3676, '3Q26': 27.549, '4Q26': 27.5524, '1Q27': 26.3195 },
        '2026-10-21': { '3Q26': 28.9007, '4Q26': 28.8512, '1Q27': 28.2861, '2Q27': 29.2259 },
      },
      shares: {
        '2024-04-28': { '2Q24': 201.5458, '3Q24': 202.2206, '4Q24': 202.1723, '1Q25': 205.5105 },
        '2024-07-28': { '3Q24': 205.6164, '4Q24': 205.8267, '1Q25': 207.3402, '2Q25': 207.8699 },
        '2024-11-17': { '4Q24': 206.7104, '1Q25': 207.4082, '2Q25': 208.0442, '3Q25': 208.5619 },
        '2025-02-09': { '1Q25': 208.6217, '2Q25': 209.1727, '3Q25': 209.6822, '4Q25': 210.6851 },
        '2025-05-04': { '2Q25': 210.2015, '3Q25': 210.8121, '4Q25': 211.9004, '1Q26': 211.894 },
        '2025-08-03': { '3Q25': 209.2715, '4Q25': 209.9029, '1Q26': 210.4503, '2Q26': 210.7297 },
        '2025-11-09': { '4Q25': 211.7332, '1Q26': 210.4405, '2Q26': 210.6544, '3Q26': 212.1262 },
        '2026-02-15': { '1Q26': 212.6045, '2Q26': 212.6679, '3Q26': 213.5611, '4Q26': 213.6672 },
        '2026-05-03': { '2Q26': 209.4753, '3Q26': 210.0049, '4Q26': 210.0059, '1Q27': 209.5478 },
        '2026-10-21': { '3Q26': 209.1344, '4Q26': 209.2733, '1Q27': 208.4354, '2Q27': 208.3642 },
      },
      },
      y: {
      rev: {
        '2024-04-28': { '2024': 15611.3226, '2025': 17844.5484, '2026': 19989.6071 },
        '2024-07-28': { '2024': 15732.1765, '2025': 18116.2059, '2026': 20434.0667 },
        '2024-11-17': { '2024': 15599.7568, '2025': 17892.8649, '2026': 20201.9688 },
        '2025-02-09': { '2025': 18146.8286, '2026': 20806.5714, '2027': 23461.25 },
        '2025-05-04': { '2025': 17892.625, '2026': 20605.6585, '2027': 23285.6765 },
        '2025-08-03': { '2025': 17340.9767, '2026': 19959.7381, '2027': 22769.7059 },
        '2025-11-09': { '2025': 17202.65, '2026': 19685.439, '2027': 22399.5429 },
        '2026-02-15': { '2026': 19560.3556, '2027': 22182.561, '2028': 24925.1935 },
        '2026-05-03': { '2026': 19496.7209, '2027': 22175.0952, '2028': 24876.4375 },
        '2026-10-21': { '2026': 19530.093, '2027': 22341.7442, '2028': 25306.8571 },
      },
      premrev: {
        '2024-04-28': { '2024': 13650.0144, '2025': 15437.5483, '2026': 17192.0986 },
        '2024-07-28': { '2024': 13846.4028, '2025': 15918.8506, '2026': 17850.8739 },
        '2024-11-17': { '2024': 13756.3473, '2025': 15819.241, '2026': 17859.8822 },
        '2025-02-09': { '2025': 16112.0266, '2026': 18415.9679, '2027': 20503.3232 },
        '2025-05-04': { '2025': 15865.6288, '2026': 18248.4338, '2027': 20501.286 },
        '2025-08-03': { '2025': 15395.6699, '2026': 17733.7158, '2027': 20157.7735 },
        '2025-11-09': { '2025': 15332.1532, '2026': 17651.6312, '2027': 20081.4312 },
        '2026-02-15': { '2026': 17499.6, '2027': 19827.7694, '2028': 22132.852 },
        '2026-05-03': { '2026': 17577.1938, '2027': 20021.7119, '2028': 22458.5631 },
        '2026-10-21': { '2026': 17644.552, '2027': 20219.4416, '2028': 22881.2036 },
      },
      adrev: {
        '2024-04-28': { '2024': 1976.5938, '2025': 2375.4128, '2026': 2798.2473 },
        '2024-07-28': { '2024': 1885.2146, '2025': 2189.6841, '2026': 2546.7651 },
        '2024-11-17': { '2024': 2485.2716, '2025': 2006.9568, '2026': 2319.4988 },
        '2025-02-09': { '2025': 2049.0848, '2026': 2393.8947, '2027': 2754.0523 },
        '2025-05-04': { '2025': 2001.7248, '2026': 2288.2121, '2027': 2630.0122 },
        '2025-08-03': { '2025': 1915.0992, '2026': 2199.5797, '2027': 2558.005 },
        '2025-11-09': { '2025': 1850.3159, '2026': 2072.7842, '2027': 2421.5244 },
        '2026-02-15': { '2026': 2019.2855, '2027': 2334.8336, '2028': 2721.157 },
        '2026-05-03': { '2026': 1905.5681, '2027': 2212.445, '2028': 2599.6559 },
        '2026-10-21': { '2026': 1885.6642, '2027': 2154.1163, '2028': 2499.5986 },
      },
      gp: {
        '2024-04-28': { '2024': 4396.2977, '2025': 5192.4079, '2026': 6001.4201 },
        '2024-07-28': { '2024': 4601.0498, '2025': 5541.1445, '2026': 6388.1151 },
        '2024-11-17': { '2024': 4659.9637, '2025': 5685.4683, '2026': 6641.0189 },
        '2025-02-09': { '2025': 5801.238, '2026': 6861.7215, '2027': 7939.6855 },
        '2025-05-04': { '2025': 5720.7623, '2026': 6821.3821, '2027': 7939.3555 },
        '2025-08-03': { '2025': 5512.4638, '2026': 6541.8096, '2027': 7743.789 },
        '2025-11-09': { '2025': 5495.3844, '2026': 6500.4298, '2027': 7666.1876 },
        '2026-02-15': { '2026': 6483.6936, '2027': 7580.8343, '2028': 8684.3763 },
        '2026-05-03': { '2026': 6490.2525, '2027': 7620.8945, '2028': 8760.9023 },
        '2026-10-21': { '2026': 6493.4515, '2027': 7648.0235, '2028': 8946.3624 },
      },
      opinc: {
        '2024-04-28': { '2024': 984.6667, '2025': 1515.7333, '2026': 2008.1923 },
        '2024-07-28': { '2024': 1256.5, '2025': 1938.3125, '2026': 2485.5714 },
        '2024-11-17': { '2024': 1357.5, '2025': 2162.2857, '2026': 2790.1667 },
        '2025-02-09': { '2025': 2413.2353, '2026': 3210.1818, '2027': 4064.6957 },
        '2025-05-04': { '2025': 2331.6944, '2026': 3176.5, '2027': 4035.129 },
        '2025-08-03': { '2025': 2088.2857, '2026': 2948.2895, '2027': 3889.0645 },
        '2025-11-09': { '2025': 2110.9143, '2026': 2937.5946, '2027': 3872.7419 },
        '2026-02-15': { '2026': 2969.6053, '2027': 3864.1471, '2028': 4765.8889 },
        '2026-05-03': { '2026': 2915.0286, '2027': 3759.4286, '2028': 4685.5 },
        '2026-10-21': { '2026': 2840.7632, '2027': 3726.2564, '2028': 4698.0625 },
      },
      ebitda: {
        '2024-04-28': { '2024': 1153.25, '2025': 1728.8, '2026': 2182 },
        '2024-07-28': { '2024': 1388.6071, '2025': 2057.6552, '2026': 2602.32 },
        '2024-11-17': { '2024': 1482.3462, '2025': 2285.4483, '2026': 2896.32 },
        '2025-02-09': { '2025': 2557.9655, '2026': 3338.6071, '2027': 4144.6842 },
        '2025-05-04': { '2025': 2402.5806, '2026': 3227.125, '2027': 4059.6923 },
        '2025-08-03': { '2025': 2167.7667, '2026': 3048.7097, '2027': 3996.6154 },
        '2025-11-09': { '2025': 2206.303, '2026': 3064.8788, '2027': 3985.0333 },
        '2026-02-15': { '2026': 3114.9189, '2027': 3952.5455, '2028': 4752 },
        '2026-05-03': { '2026': 3067.7778, '2027': 3887.2432, '2028': 4739.2593 },
        '2026-10-21': { '2026': 2952.2069, '2027': 3852.0312, '2028': 4799.3846 },
      },
      earnings: {
        '2024-04-28': { '2024': 952.1905, '2025': 1351.9524, '2026': 1712.15 },
        '2024-07-28': { '2024': 1175.6667, '2025': 1719.8148, '2026': 2137.3478 },
        '2024-11-17': { '2024': 1174.1724, '2025': 1858.3333, '2026': 2335.4615 },
        '2025-02-09': { '2025': 2102.0333, '2026': 2756.7931, '2027': 3390.75 },
        '2025-05-04': { '2025': 1830.4412, '2026': 2647.5455, '2027': 3321.12 },
        '2025-08-03': { '2025': 1182.3611, '2026': 2356.2222, '2027': 3154.8929 },
        '2025-11-09': { '2025': 1475.3056, '2026': 2504.5278, '2027': 3194.3103 },
        '2026-02-15': { '2026': 2680.8824, '2027': 3401.0323, '2028': 4096.2083 },
        '2026-05-03': { '2026': 2705.5, '2027': 3313.7273, '2028': 3980.75 },
        '2026-10-21': { '2026': 2546.3429, '2027': 3176.5714, '2028': 3924.2222 },
      },
      eps: {
        '2024-04-28': { '2024': 4.4648, '2025': 6.5841, '2026': 8.429 },
        '2024-07-28': { '2024': 5.8097, '2025': 8.0194, '2026': 10.2291 },
        '2024-11-17': { '2024': 5.7278, '2025': 8.8153, '2026': 11.1294 },
        '2025-02-09': { '2025': 9.9276, '2026': 12.7697, '2027': 15.8417 },
        '2025-05-04': { '2025': 8.7364, '2026': 12.6539, '2027': 15.7047 },
        '2025-08-03': { '2025': 5.8134, '2026': 11.6505, '2027': 15.3948 },
        '2025-11-09': { '2025': 6.8122, '2026': 11.9156, '2027': 15.3158 },
        '2026-02-15': { '2026': 12.7571, '2027': 16.0763, '2028': 19.3887 },
        '2026-05-03': { '2026': 12.8121, '2027': 15.8656, '2028': 19.1667 },
        '2026-10-21': { '2026': 12.2164, '2027': 15.0739, '2028': 18.6891 },
      },
      fcf: {
        '2024-04-28': { '2024': 1428.1311, '2025': 2008.6924, '2026': 2490.7397 },
        '2024-07-28': { '2024': 1775.4858, '2025': 2495.1216, '2026': 2907.5889 },
        '2024-11-17': { '2024': 2025.3779, '2025': 2758.245, '2026': 3286.5105 },
        '2025-02-09': { '2025': 2952.9026, '2026': 3692.1758, '2027': 4249.5455 },
        '2025-05-04': { '2025': 2847.9279, '2026': 3632.464, '2027': 4351.3127 },
        '2025-08-03': { '2025': 2665.1199, '2026': 3361.2073, '2027': 4245.0881 },
        '2025-11-09': { '2025': 2723.8604, '2026': 3499.9952, '2027': 4218.6322 },
        '2026-02-15': { '2026': 3584.9537, '2027': 4256.4197, '2028': 5020.6519 },
        '2026-05-03': { '2026': 3494.7864, '2027': 4089.5506, '2028': 4817.3026 },
        '2026-10-21': { '2026': 3369.7933, '2027': 4055.6004, '2028': 4777.795 },
      },
      },
    },
    summit: {
      vintages: [
        { id: '2025-12-18', label: 'Dec 18, 2025', lastActual: { q: '3Q25', y: '2024' } },
        { id: '2026-02-09', label: 'Feb 9, 2026', lastActual: { q: '3Q25', y: '2024' } },
        { id: '2026-04-28', label: 'Apr 28, 2026', lastActual: { q: '1Q26', y: '2025' } },
        { id: '2026-08-05', label: 'Aug 5, 2026', lastActual: { q: '2Q26', y: '2025' } },
      ],
      q: {
      rev: {
        '2025-12-18': { '4Q25': 4600.4 },
        '2026-02-09': { '4Q25': 4539.6, '1Q26': 4663.8, '2Q26': 4893.2, '3Q26': 5083, '4Q26': 5373 },
        '2026-04-28': { '2Q26': 4817.3, '3Q26': 5050.5, '4Q26': 5335.7 },
        '2026-08-05': { '3Q26': 5023.1, '4Q26': 5428.4 },
      },
      premrev: {
        '2025-12-18': { '4Q25': 4017.3 },
        '2026-02-09': { '4Q25': 4019.6, '1Q26': 4202.5, '2Q26': 4393.7, '3Q26': 4593.6, '4Q26': 4802.6 },
        '2026-04-28': { '2Q26': 4351.6, '3Q26': 4560.7, '4Q26': 4791.6 },
        '2026-08-05': { '3Q26': 4511.6, '4Q26': 4838.4 },
      },
      adrev: {
        '2025-12-18': { '4Q25': 583.1 },
        '2026-02-09': { '4Q25': 520, '1Q26': 461.4, '2Q26': 499.5, '3Q26': 489.3, '4Q26': 570.4 },
        '2026-04-28': { '2Q26': 465.7, '3Q26': 489.8, '4Q26': 544.1 },
        '2026-08-05': { '3Q26': 511.6, '4Q26': 590 },
      },
      gp: {
        '2025-12-18': { '4Q25': 1478.9 },
        '2026-02-09': { '4Q25': 1499.5, '1Q26': 1518.9, '2Q26': 1605.8, '3Q26': 1671.8, '4Q26': 1778.9 },
        '2026-04-28': { '2Q26': 1598.9, '3Q26': 1694, '4Q26': 1801.2 },
        '2026-08-05': { '3Q26': 1653.4, '4Q26': 1831.5 },
      },
      premgp: {
        '2025-12-18': { '4Q25': 1386 },
        '2026-02-09': { '4Q25': 1386.8, '1Q26': 1428.8, '2Q26': 1493.9, '3Q26': 1561.8, '4Q26': 1632.9 },
        '2026-04-28': { '2Q26': 1501.3, '3Q26': 1591.7, '4Q26': 1677.1 },
        '2026-08-05': { '3Q26': 1543, '4Q26': 1693.5 },
      },
      adgp: {
        '2025-12-18': { '4Q25': 93 },
        '2026-02-09': { '4Q25': 112.8, '1Q26': 90, '2Q26': 111.9, '3Q26': 109.9, '4Q26': 146 },
        '2026-04-28': { '2Q26': 97.6, '3Q26': 102.3, '4Q26': 124.2 },
        '2026-08-05': { '3Q26': 110.4, '4Q26': 138.1 },
      },
      opinc: {
        '2025-12-18': { '4Q25': 636.6 },
        '2026-02-09': { '4Q25': 632.1, '1Q26': 710.9, '2Q26': 729.2, '3Q26': 794.1, '4Q26': 825.3 },
        '2026-04-28': { '2Q26': 637.6, '3Q26': 721.7, '4Q26': 848.4 },
        '2026-08-05': { '3Q26': 672.5, '4Q26': 927.2 },
      },
      ebitda: {
        '2025-12-18': { '4Q25': 727.8 },
        '2026-02-09': { '4Q25': 716.8, '1Q26': 892.8, '2Q26': 921.2, '3Q26': 990, '4Q26': 1033.1 },
        '2026-04-28': { '2Q26': 726.1, '3Q26': 810.9, '4Q26': 934.4 },
        '2026-08-05': { '3Q26': 765.3, '4Q26': 1013.2 },
      },
      fcf: {
        '2025-12-18': { '4Q25': 867.3 },
        '2026-02-09': { '4Q25': 854.2, '1Q26': 797.6, '2Q26': 819, '3Q26': 868, '4Q26': 923.8 },
        '2026-04-28': { '2Q26': 716.1, '3Q26': 787.9, '4Q26': 912.4 },
        '2026-08-05': { '3Q26': 742.3, '4Q26': 991.2 },
      },
      mau: {
        '2025-12-18': { '4Q25': 761.2 },
      },
      subs: {
        '2025-12-18': { '4Q25': 295.1 },
      },
      admau: {
        '2025-12-18': { '4Q25': 466.2 },
      },
      },
      y: {
      rev: {
        '2025-12-18': { '2025': 17255.4, '2026': 20802.2, '2027': 24836.1, '2028': 29112.1, '2029': 33788.3 },
        '2026-02-09': { '2025': 17194.6, '2026': 19580.9, '2027': 22197.8, '2028': 24857.8, '2029': 27446.5 },
        '2026-04-28': { '2026': 19736.5, '2027': 21963.3, '2028': 24854, '2029': 27700.9 },
        '2026-08-05': { '2026': 19761.5, '2027': 23118.8, '2028': 27097.4, '2029': 31372.9 },
      },
      premrev: {
        '2025-12-18': { '2025': 15354.3, '2026': 18578.7, '2027': 22275.9, '2028': 26218.7, '2029': 30571 },
        '2026-02-09': { '2025': 15356.6, '2026': 17487.2, '2027': 19814.4, '2028': 22139.7, '2029': 24400.2 },
        '2026-04-28': { '2026': 17851.9, '2027': 19696.4, '2028': 22326.8, '2029': 24963 },
        '2026-08-05': { '2026': 17829, '2027': 20884.8, '2028': 24358, '2029': 28068.9 },
      },
      adrev: {
        '2025-12-18': { '2025': 1901.1, '2026': 2223.5, '2027': 2560.2, '2028': 2893.4, '2029': 3217.3 },
        '2026-02-09': { '2025': 1838, '2026': 2093.6, '2027': 2383.4, '2028': 2718, '2029': 3046.4 },
        '2026-04-28': { '2026': 1884.6, '2027': 2266.9, '2028': 2527.1, '2029': 2737.9 },
        '2026-08-05': { '2026': 1932.5, '2027': 2234, '2028': 2739.5, '2029': 3304 },
      },
      gp: {
        '2025-12-18': { '2025': 5475.9, '2026': 6575.7, '2027': 8341.9, '2028': 10189.2, '2029': 11986.8 },
        '2026-02-09': { '2025': 5496.5, '2026': 6364.4, '2027': 7650.1, '2028': 8700.2, '2029': 9758.6 },
        '2026-04-28': { '2026': 6589.1, '2027': 7519.6, '2028': 8810.5, '2029': 9957 },
        '2026-08-05': { '2026': 6575.9, '2027': 7930.8, '2028': 9727.7, '2029': 11707.1 },
      },
      premgp: {
        '2025-12-18': { '2025': 5154, '2026': 6131, '2027': 7573.8, '2028': 9176.5, '2029': 10699.8 },
        '2026-02-09': { '2025': 5154.8, '2026': 5945.7, '2027': 6935, '2028': 7748.9, '2029': 8540.1 },
        '2026-04-28': { '2026': 6215, '2027': 6952.8, '2028': 7926, '2029': 8861.9 },
        '2026-08-05': { '2026': 6192.4, '2027': 7372.3, '2028': 8768.9, '2029': 10385.5 },
      },
      adgp: {
        '2025-12-18': { '2025': 322, '2026': 444.7, '2027': 768.1, '2028': 1012.7, '2029': 1286.9 },
        '2026-02-09': { '2025': 341.8, '2026': 418.7, '2027': 715, '2028': 951.3, '2029': 1218.6 },
        '2026-04-28': { '2026': 374, '2027': 566.7, '2028': 884.5, '2029': 1095.2 },
        '2026-08-05': { '2026': 383.5, '2027': 558.5, '2028': 958.8, '2029': 1321.6 },
      },
      opinc: {
        '2025-12-18': { '2025': 2133.6, '2026': 3204.6, '2027': 4802.3, '2028': 6472.7, '2029': 8084.4 },
        '2026-02-09': { '2025': 2129.1, '2026': 2852.9, '2027': 3977.6, '2028': 4859, '2029': 5740.6 },
        '2026-04-28': { '2026': 2922.7, '2027': 3659.5, '2028': 4771, '2029': 5729.3 },
        '2026-08-05': { '2026': 2969.7, '2027': 3914, '2028': 5259.7, '2029': 6768.7 },
      },
      ebitda: {
        '2025-12-18': { '2025': 2491.8, '2026': 3558.3, '2027': 5174.8, '2028': 6851.1, '2029': 8456.1 },
        '2026-02-09': { '2025': 2480.8, '2026': 3149.7, '2027': 4256.2, '2028': 5109.2, '2029': 5951.3 },
        '2026-04-28': { '2026': 3268.4, '2027': 3983.1, '2028': 5024.1, '2029': 5944.1 },
        '2026-08-05': { '2026': 3345.5, '2027': 4258.2, '2028': 5535.3, '2029': 7007.2 },
      },
      fcf: {
        '2025-12-18': { '2025': 2995.3, '2026': 4314.9, '2027': 5222.1, '2028': 6900.7, '2029': 8508.1 },
        '2026-02-09': { '2025': 2982.2, '2026': 3824.7, '2027': 4303.5, '2028': 5158.8, '2029': 6003.4 },
        '2026-04-28': { '2026': 3375.4, '2027': 4054.5, '2028': 5099.1, '2029': 6022.8 },
        '2026-08-05': { '2026': 3508.5, '2027': 4340.1, '2028': 5621.3, '2029': 7097.5 },
      },
      mau: {
        '2025-12-18': { '2025': 761.2, '2026': 834.1, '2027': 902.1, '2028': 957.7, '2029': 1003.1 },
      },
      subs: {
        '2025-12-18': { '2025': 295.1, '2026': 324.6, '2027': 353.8, '2028': 378.5, '2029': 401.2 },
      },
      admau: {
        '2025-12-18': { '2025': 466.2, '2026': 509.6, '2027': 548.3, '2028': 579.1, '2029': 601.9 },
      },
      },
    },
  },
  // ⚠ CORRECTION, Aug 2026: this tab previously stated that "no Bloomberg consensus is
  // stored per snapshot for these lines". That was WRONG. Every vintage carries
  // `rev_bbg_est`, `ebitda_bbg_est` and `earnings_bbg_est` alongside the Summit lines,
  // so those three metrics now show a real Street series next to the model — which
  // turns this tab from "the model against its own past self" into the far more useful
  // "the model against the Street, both moving". Operating income and free cash flow
  // have no BBG counterpart in the model, so they keep `cons: null`.
  evolution: {
    intro: 'How the forecast itself has moved. Each line tracks one fiscal year’s estimate across the model’s four saved snapshots — and, on revenue, EBITDA and earnings, against the Bloomberg consensus stored in the same snapshot. Three things stand out. First, the February 2026 snapshot cut the out-years hard — FY2029 revenue −19%, FY2029 EBITDA −30% in one revision. ⚠ That revision was NOT an update on the 4Q25 print: its actuals still stop at 3Q25, so it was a re-think of the forward assumptions. Second, the latest snapshot (Aug 5, after the 2Q26 print) reverses most of the out-year cut: against April, FY2028 revenue is +9% and FY2029 revenue +13%, and FY2029 EBITDA +18%, while FY2026 barely moves (+0.1% on revenue). Third, because the Street stayed put (FY2029 consensus revenue €27.1–28.2B in every snapshot), the model is again well above it in the out-years: +4% on FY2027 revenue, +11% on FY2029 revenue and +25% on FY2029 EBITDA — a margin call more than a growth call.',
    vintages: [
      { label: 'Dec 18, 2025', event: 'actuals to 3Q25' },
      { label: 'Feb 9, 2026',  event: 'actuals still to 3Q25 — a forward re-think, NOT a post-4Q25 update' },
      { label: 'Apr 28, 2026', event: 'first to carry 4Q25 + 1Q26' },
      { label: 'Aug 5, 2026',  event: 'carries the 2Q26 print' }
    ],
    years: ['2026', '2027', '2028', '2029'],
    sections: [
      { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
        { label: 'Revenue', keys: ['rev'] }
      ] },
      { key: 'prof', label: 'Profitability', defaultMetric: 'ebitda', groups: [
        { label: 'Company', keys: ['ebitda', 'opinc', 'earnings', 'fcf'] }
      ] }
    ],
    metrics: {
      rev: { label: 'Total Revenue', unit: 'usdM',
        summit: [[20802, 19581, 19737, 19762], [24836, 22198, 21963, 23119], [29112, 24858, 24854, 27097], [33788, 27447, 27701, 31373]],
        cons:   [[19700, 19646, 19512, 19527], [22435, 22348, 22142, 22316], [25185, 25079, 24866, 25333], [27784, 27516, 27104, 28150]],
        // The FY2025 base each vintage’s implied FY2026 growth is measured against — ONE ENTRY PER
        // VINTAGE (the engine indexes prior[src][vintageIndex], so a short array silently blanks the
        // growth for the newest snapshot). FY2025 is a reported actual (€17,186M), the same in every vintage.
        prior: { summit: [17186, 17186, 17186, 17186], cons: [17186, 17186, 17186, 17186] },
        note: 'December 2025 carried FY2026 revenue at €20.8B — +21% on the FY2025 actual of €17.2B, against a company that has since guided to roughly +10%. February corrected it to €19.6B (on judgement, not on new actuals) and it has barely moved since: Aug 5 sits at €19.8B, which is 1H26 actuals (€9,310M) plus the guided 3Q (€5.0B) and a modelled 4Q (€5.4B). The out-years are where it moves. FY2029 went €33.8B → €27.4B (−19%) in February, stayed there in April, and came back to €31.4B (+13%) on Aug 5; FY2028 went €24.9B → €27.1B (+9%). Against the Street (consensus FY2029 revenue €27.1–28.2B in all four snapshots), the model was 22% above in December, level in February (−0.3%), 2% above in April, and is 11% above now. FY2026 is within ~1% of consensus.' },
      ebitda: { label: 'EBITDA', unit: 'usdM', marginOf: 'rev', marginLabel: 'EBITDA margin',
        summit: [[3558, 3150, 3268, 3345], [5175, 4256, 3983, 4258], [6851, 5109, 5024, 5535], [8456, 5951, 5944, 7007]],
        cons:   [[3047, 3062, 3172, 3005], [3943, 3922, 3974, 3889], [4607, 4606, 4838, 4816], [5287, 5264, 5267, 5625]],
        prior: { summit: [2549, 2549, 2549, 2549], cons: [2549, 2549, 2549, 2549] },
        note: 'The most volatile line in the model. FY2029 EBITDA fell €8.5B → €6.0B (−30%) in February, sat at €5.9B in April, and is back at €7.0B on Aug 5 (+18% in one snapshot). In the margin view the model now runs a ~22% EBITDA margin by FY2029, against ~25% in December and ~21% in April. This is where the model is most differentiated from the Street: consensus FY2029 EBITDA is €5.6B, so the model sits ~25% above it — a wider gap than on revenue (+11%), which means the difference is a margin call, not a growth call. FY2026 is also above the Street (+11%: €3.35B vs €3.00B), the one year where the print is close enough to test it.' },
      opinc: { label: 'Operating Income', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
        summit: [[3205, 2853, 2923, 2970], [4802, 3978, 3659, 3914], [6473, 4859, 4771, 5260], [8084, 5741, 5729, 6769]],
        cons: null,
        prior: { summit: [2198, 2198, 2198, 2198] },
        note: 'Moves with EBITDA: FY2027 operating income went €4.8B → €3.7B (−24%) by April and is back to €3.9B on Aug 5; FY2029 €8.1B → €5.7B → €6.8B. Held next to the Investor Day target of a 20%+ operating margin by 2030, the model’s FY2029 margin is now ~21.6% (it was ~21% in April), so it sits through the promise rather than at it. No Bloomberg operating-income series is stored in the model, so there is no Street line here; use EBITDA for that.' },
      earnings: { label: 'Earnings (model definition)', unit: 'usdM', marginOf: 'rev', marginLabel: 'net margin (model def.)',
        summit: [[2884, 2568, 2686, 2822], [4322, 3580, 3336, 3235], [5825, 4373, 4658, 4363], [7276, 5166, 5634, 5619]],
        cons:   [[2584, 2535, 2743, 2598], [3277, 3270, 3406, 3219], [3928, 3939, 4068, 3973], [4628, 4621, 4482, 4666]],
        prior: { summit: [2212, 2212, 2212, 2212], cons: [2212, 2212, 2212, 2212] },
        note: '⚠ The one line that did NOT follow the re-raise. FY2027 earnings were cut at every snapshot — €4,322M → €3,580M → €3,336M → €3,235M, a cumulative −25% — while revenue and EBITDA went back up on Aug 5. Read with the Street line: consensus FY2027 earnings has sat at €3.2–3.4B throughout, so the model started 32% ABOVE the Street, walked down through it, and now sits on it (+0.5%). FY2028 and FY2029 stay above consensus (+10% and +20%), well below the EBITDA gaps: FY2029 EBITDA is +18% against April while FY2029 earnings is −0.3%, so the model’s tax and below-the-line assumptions are the question to put to its author. ‘Earnings’ here is the model’s definition, not IFRS net income.' },
      fcf: { label: 'Free Cash Flow', unit: 'usdM', marginOf: 'rev', marginLabel: 'FCF margin',
        summit: [[4315, 3825, 3375, 3508], [5222, 4303, 4055, 4340], [6901, 5159, 5099, 5621], [8508, 6003, 6023, 7097]],
        cons: null,
        prior: { summit: [2872, 2872, 2872, 2872] },
        note: 'FY2026 free cash flow was cut from €4.3B to €3.4B (−22%) by April and is back to €3.5B on Aug 5. The €3.5B reconciles with the €3.3B LTM free cash flow the company reported at 2Q26. The out-years follow EBITDA: FY2029 €8.5B → €6.0B → €7.1B. No Bloomberg free-cash-flow series is stored in the model.' }
    },
    note: 'Single source: the Summit Research database — the model’s saved snapshots as recorded in the DCF’s Projection History, pulled through the Summit MCP on 20 Oct 2026 (sheet source `projection_history`, annual periods 2026–2029). FOUR vintages, dated by what each one actually CONTAINS: Dec 18 2025 and Feb 9 2026 both carry actuals only to 3Q25; 4Q25 and 1Q26 first appear in the Apr 28 2026 snapshot; Aug 5 2026 carries the 2Q26 print (valuation block “after Q2 - 2026”). ⚠ The two vintages this tab carried until Oct 2026 — “May 22, 2026” and “Aug 4, 2026” — are NOT in the MCP (the snapshot list is Dec 18, Feb 9, Apr 28, Aug 5); they were seeded from the DCF workbook and cannot be reproduced, so they were removed. Their last values (rev FY2027 €22,958M / €22,895M, FY2029 €30,489M / €30,404M) are in the profile log (docs/profiles/SPOT.md). The dashed Consensus series is the Bloomberg estimate stored inside each snapshot (`rev_bbg_est` / `ebitda_bbg_est` / `earnings_bbg_est`) — it exists for revenue, EBITDA and earnings only. ⚠ Cautions that still stand: Spotify’s fixed HISTORY is restated between snapshots, so never build one time series by mixing vintages — compare the same year across vintages, which is what this tab does; the model’s consolidated MAU/subscriber/ARPU lines are empty, which is why no user metric appears here; and the annual `premium_cogs` / `ads_cogs` lines are mirrored to their revenue lines, so segment cost of revenue is unusable. Figures in € millions. Implied growth chains within Summit’s own data; the FY2025 bases are the reported actuals (revenue €17,186M, EBITDA €2,549M, operating income €2,198M, net income €2,212M, free cash flow €2,872M). Data sourced from Summit DCF models.'
  },
  source: 'Sources: Spotify quarterly shareholder decks on investors.spotify.com (actuals, and the guidance issued for the following quarter — each quarter’s figures taken from that quarter’s own deck). The 3Q26 print and the 4Q26 guidance are from the Q3 2026 Update of 22 Oct 2026 (Form 6-K filed the same day, accession 0001140361-26-040435, CIK 0001639920); earlier quarters from each quarter’s own deck. Values in € millions except EPS (€ per share). Street consensus is Bloomberg (BBG_CONSENSUS.txt, 10 snapshots to 2026-10-21, EUR). Summit 4Q26 is the model snapshot 2026-08-05, frozen. Users series (MAU, subscribers, ad-supported MAU, ARPU) from the Bloomberg export, matching the decks.'
};

// ─── Derived estimate lines ───────────────────────────────────────────────────────────────────
// Computed here from the vintage matrix, never typed: for every snapshot (Summit) and every file (Street),
//   gross margin            = gross profit / revenue                       (percent, as the reported line)
//   Premium ARPU            = Premium revenue / Premium subscribers / 3    (Summit only: the Street has its own, reported basis)
//   Premium cost per sub.   = (Premium revenue - Premium gross profit) / Premium subscribers / 3
//   Ad-Supported ARPU       = Ad-Supported revenue / ad-supported MAU / 3
//   Ad-Supported cost / MAU = (Ad-Supported revenue - Ad-Supported gross profit) / ad-supported MAU / 3
// Users are at quarter end and the division by 3 puts the figure per month, as the reported ARPU is.
// A period gets a value only when EVERY input exists in the same file for that period; otherwise it is left out.
// Summit subscribers and ad-supported MAU for 3Q26 and 4Q26 are supplied by the analyst: the model rows are zero in the snapshot.
(function(){
  var mx = spotResults.estMatrix;
  mx.summit.q.subs['2026-08-05'] = { '3Q26': 304.9, '4Q26': 319.0 };
  mx.summit.q.admau['2026-08-05'] = { '3Q26': 501.5, '4Q26': 526.4 };
  var vq = spotResults.views.q.metrics, vs = vq.subs.summit, va = vq.admau.summit;
  vq.mau.summit.forEach(function(x, i){ if (vs[i] != null && va[i] != null) vq.mau.summit[i] = Math.round((vs[i] + va[i]) * 10) / 10; });
  function at(src, m, v){ var o = mx[src].q[m]; return (o && o[v]) || {}; }
  function put(src, m, v, p, x){
    if (!mx[src].q[m]) mx[src].q[m] = {};
    if (!mx[src].q[m][v]) mx[src].q[m][v] = {};
    mx[src].q[m][v][p] = Math.round(x * 1000) / 1000;
  }
  ['cons', 'summit'].forEach(function(src){
    mx[src].vintages.forEach(function(vt){
      var v = vt.id, rev = at(src, 'rev', v), gp = at(src, 'gp', v), pr = at(src, 'premrev', v), pg = at(src, 'premgp', v),
          ar = at(src, 'adrev', v), ag = at(src, 'adgp', v), sb = at(src, 'subs', v), ad = at(src, 'admau', v);
      if (src === 'summit'){   // Summit's total MAU is its Premium subscribers + ad-supported MAU (how the analyst's model defines it; the model's own MAU row is empty)
        var mu = at(src, 'mau', v);
        Object.keys(sb).forEach(function(p){ if (ad[p] != null && mu[p] == null) put(src, 'mau', v, p, sb[p] + ad[p]); });
      }
      Object.keys(gp).forEach(function(p){ if (rev[p]) put(src, 'gm', v, p, gp[p] / rev[p] * 100); });
      Object.keys(pr).forEach(function(p){
        if (sb[p]){
          if (src === 'summit') put(src, 'arpu', v, p, pr[p] / sb[p] / 3);
          if (pg[p] != null) put(src, 'pcpu', v, p, (pr[p] - pg[p]) / sb[p] / 3);
        }
      });
      Object.keys(ar).forEach(function(p){
        if (ad[p]){
          put(src, 'aarpu', v, p, ar[p] / ad[p] / 3);
          if (ag[p] != null) put(src, 'acpu', v, p, (ar[p] - ag[p]) / ad[p] / 3);
        }
      });
    });
  });
})();

// ─── Quarterly axis: two quarters past the last print ──────────────────────────────────────────
// The Bloomberg vintage carries 2Q27, but the profile shows two quarters ahead of the last reported one (analyst rule): after
// 3Q26 that is 4Q26 and 1Q27. Every per-period array of the quarterly view is cut at the same index, so nothing drifts.
(function(){
  Object.keys(spotResults.views.q.metrics).forEach(function(k){
    var m = spotResults.views.q.metrics[k], n = m.periods.length, last = -1;
    m.act.forEach(function(x, i){ if (x != null) last = i; });
    var keep = Math.min(n, last + 3);   // the last print plus two quarters
    if (keep >= n) return;
    Object.keys(m).forEach(function(f){ if (Array.isArray(m[f]) && m[f].length === n) m[f] = m[f].slice(0, keep); });
  });
})();
