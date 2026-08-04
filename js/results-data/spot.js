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
//             snapshot BEFORE that print; 3Q26 carries the live 2026-08-04 vintage. Gross
//             profit, net income and EPS are NOT carried as consolidated lines in the
//             model, so they stay null rather than being derived.
//   cons    — Street consensus right before the print. SPOT has no rows in the
//             BBG_CONSENSUS.txt archive (it carries only GOOG/GOOGL/HOOD/KKR/MA/META/UBER),
//             so this must be compiled BY HAND per print from earnings-day coverage, the
//             same way AMZN's and LYFT's were. Only 2Q26 revenue is filled so far — see
//             that metric's note for the source and for why EPS was deliberately left out.
//
// All monetary values in € millions; EPS in euros. null = not available.
// Arrays are parallel to `periods`. A period with act:null is an upcoming print.
//
// STATUS: 2Q26 is REPORTED — Spotify published it on Tuesday, August 4, 2026, before
// market open (6-K, accession 0001140361-26-031044). 3Q26 is now the upcoming print and
// carries the guidance issued in that same deck.
//
// ── FOLLOW-UPS STILL OPEN ─────────────────────────────────────────────────────────────
//  • The engine only knows money and EPS. Spotify's MAU, Premium subscribers, ARPU and
//    its guided gross-margin PERCENTAGE need a count/percent unit before they can be
//    shown here honestly. Those five guided lines are today only visible in the Earnings
//    tab's setup grid, not in this chart.
//  • Consolidated gross margin IS guided every quarter as a percentage (32.9% for 3Q26)
//    but the guidance band is a monetary series, so the percentage guide cannot be
//    plotted against the gross-profit line. Same blocker as above.

export var spotResults = {
  updated: 'Aug 2026',
  currency: '€',
  currencyName: '€',
  intro: 'How Spotify’s reported results have stacked up against what the company itself guided. Spotify guides five metrics every quarter — MAU, Premium subscribers, revenue, gross margin and operating income — so the guide is an unusually complete yardstick, and this tab scores each print against it. Pick a metric; the chart shows the actual against the guide for that quarter, with the surprise in percent. Periods marked “est.” are forward: guidance issued, no actual yet. The Summit line is the model’s frozen estimate held going into each print. <b>Latest: 2Q26, reported 4 Aug 2026</b> — revenue landed €23M under a €4.8B guide (−0.5%, the company called it in-line) while operating income beat at €655M vs €630M and gross margin set a record 33.4% against a 33.1% guide. The Street column is filled only where a figure has been compiled by hand — Spotify is not in our consensus archive.',
  views: {
    q: {
      label: 'Quarterly',
      note: 'Actuals from Spotify’s quarterly shareholder decks (investors.spotify.com; 2Q26 from the 6-K filed 4 Aug 2026). Guidance is the point estimate issued for that quarter in the PRIOR quarter’s deck — Spotify guides a single number, not a range, so the guidance band renders as a line. ⚠ Premium and Ad-Supported revenue are AS ORIGINALLY REPORTED in each quarter’s own deck: effective Jan 1 2026 Spotify moved certain activities from Ad-Supported into Premium and restated 2023–2025, so those two lines carry a basis break at 1Q26 (total revenue, gross profit and every consolidated line are unaffected).',
      metrics: {
        rev: { label: 'Total Revenue', short: 'Total revenue', group: 'Revenue', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26'],
          act:    [3636, 3807, 3988, 4242, 4190, 4193, 4272, 4531, 4533, 4777, null],
          summit: [3561.9, 3771.4, 3899.6, 4193.6, 4166.5, 4318.9, 4229.1, 4539.6, 4663.8, 4817.3, 5035.4],
          cons:   [null, null, null, null, null, null, null, null, null, 4790, null],
          guideLo:[3600, 3800, 4000, 4100, 4200, 4300, 4200, 4500, 4500, 4800, 5000],
          guideHi:[3600, 3800, 4000, 4100, 4200, 4300, 4200, 4500, 4500, 4800, 5000],
          note: 'Consolidated revenue. The guide is a single point, so “beat/miss” here is against that point. The honest record across the ten reported quarters: <b>six at or above the guided point, four below</b> — but three of the four shortfalls (3Q24 −€12M, 1Q25 −€10M, 2Q26 −€23M) are inside half a percent and read as in-line. The one real miss is 2Q25 (€4,193M against a €4,300M guide) on a ~490bps FX headwind. FX is the recurring swing factor: management states a bps assumption alongside every guide and it flips direction — a ~670bps headwind going into 1Q26, ~70bps of actual headwind in 2Q26, and a <b>~200bps TAILWIND assumed for 3Q26</b> (struck on USD:EUR 0.8756 at the June 30 close). That reversal is doing real work in the €5.0B 3Q26 guide, so read the guided growth as part currency. The single Street cell — <b>€4,790M for 2Q26</b> — is the FactSet consensus reported on the wire the morning of the print; the actual came in €13M (0.3%) under it.' },
        premrev: { label: 'Premium Revenue', short: 'Premium', group: 'Revenue', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26'],
          act:    [3247, 3351, 3516, 3705, 3771, 3740, 3826, 4013, 4148, 4331, null],
          summit: [3170.0, 3311.9, 3418.0, 3656.6, 3732.8, 3840.8, 3738.5, 4019.6, 4202.5, 4351.6, 4539.2],
          cons:   [null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null],
          note: '⚠ BASIS BREAK, not a revision: effective Jan 1 2026 Spotify reclassified certain revenue-generating activities OUT of Ad-Supported and INTO Premium, restating 2023–2025. The figures here are as ORIGINALLY reported in each quarter’s own deck, so 1Q26 onward is not on the same basis as the quarters before it. For scale, the 1Q26 deck’s restated 1Q25 comparative is €3,783M against the €3,771M originally reported. 2Q26 printed <b>€4,331M, +15% reported and +16% constant-currency</b> against the deck’s restated €3,753M base — driven by 9% subscriber growth and Premium ARPU of <b>€4.89, +7% (+7.4% cc)</b>, which is the number that matters: the July/August 2025 price increases lapped in this quarter and ARPU growth held. Not guided separately.' },
        adrev: { label: 'Ad-Supported Revenue', short: 'Ad-Supported', group: 'Revenue', unit: 'usdM',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26'],
          act:    [389, 456, 472, 537, 419, 453, 446, 518, 385, 446, null],
          summit: [391.9, 459.4, 481.6, 537.0, 433.8, 478.2, 490.6, 520.0, 461.4, 465.7, 496.2],
          cons:   [null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null],
          note: '⚠ Same basis break as Premium (the reclassification moved revenue OUT of this line from 1Q26; the restated 1Q25 comparative is €407M vs €419M as originally reported). 2Q26 printed <b>€446M — +1% reported, +3% constant-currency</b> against the deck’s restated €440M base. That is the second consecutive quarter at +3% cc, and 2Q25 was the first clean comp after the April 2025 Spotify Ad Exchange launch, so the transition-dip explanation has now had its test: the drag did NOT annualize out into a re-acceleration. Management attributes what growth there is to impressions sold (offset by pricing softness) and to podcast sponsorship in the Owned & Licensed portfolio. Summit is carrying €496M for 3Q26, which requires a step up to ~+11% — the widest Summit-vs-run-rate gap on the card. Not guided separately.' },
        gp: { label: 'Gross Profit', short: 'Gross profit', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'gross margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26'],
          act:    [1004, 1112, 1240, 1368, 1326, 1320, 1351, 1499, 1495, 1596, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null],
          note: 'The margin line is the story: consolidated gross margin climbed 27.6% → <b>33.4%</b> across these ten quarters, an all-time record set in 2Q26 (+193bps YoY, against a 33.1% guide). Both segments contributed — Premium gross margin 34.9% (+174bps), Ad-Supported 19.1% (+179bps, on favourable podcast and tax impacts). ⚠ Note what the 3Q26 guide does: <b>32.9%, a 50bp sequential STEP DOWN</b> from the record. Spotify DOES guide gross margin as a percentage every quarter, but the engine’s guidance band is a monetary series, so the percentage guide is not plotted here — switch on the margin line to read the actual and compare it against the guided percentages listed in this note. Summit carries no consolidated gross-profit line; its two segment lines imply ~33.6% for 3Q26, i.e. the model does not believe the guided step-down.' },
        opinc: { label: 'Operating Income', short: 'Op. income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26'],
          act:    [168, 266, 454, 477, 509, 406, 582, 701, 715, 655, null],
          summit: [-59.9, 62.4, 292.7, 287.0, 553.5, 520.8, 510.4, 632.1, 710.9, 637.6, 698.9],
          cons:   [null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[180, 250, 405, 481, 548, 539, 485, 620, 660, 630, 670],
          guideHi:[180, 250, 405, 481, 548, 539, 485, 620, 660, 630, 670],
          note: 'The second guided line, and historically the one that missed most often — 1Q24, 4Q24, 1Q25 and 2Q25 all landed under the guided point. The recurring reason is SOCIAL CHARGES: Spotify embeds an assumption for them in the guide based on the share price at the prior quarter’s close, so a rising stock mechanically inflates the charge and pushes the actual below the guide. <b>2Q26 shows the mechanism running in reverse</b> — the guide embedded €10M struck on a $484.91 close, the shares fell over the quarter, and the charge came in at €1M, €9M below forecast. That is most of the €25M beat (€655M vs €630M), so read this quarter’s beat as largely a share-price artifact rather than operating leverage; the underlying help was gross-margin strength, against opex growing 19% YoY ex-FX and social charges on marketing plus cloud/AI. Five straight quarters at or above the guide now. 3Q26 is guided to €670M with €9M of social charges embedded at a $459.13 close — Summit sits 4.3% above at €698.9M.' },
        netinc: { label: 'Net Income', short: 'Net income', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'net margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26'],
          act:    [197, 274, 300, 367, 225, -86, 899, 1174, 721, 545, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null],
          note: 'Net income attributable to owners of the parent. Far noisier than the operating line — 2Q25 printed an €86M LOSS despite €406M of operating income, and 3Q25/4Q25 printed well ABOVE it. Below-the-line items (FX on the exchangeable notes and financial-instrument revaluation) drive the gap. 2Q26’s €545M sits BELOW its own €655M operating income, and the swing versus 1Q26 (€721M) is almost entirely finance income: €248M net in 1Q26 against €65M in 2Q26. Not guided; score the operating line first.' },
        eps: { label: 'Diluted EPS', short: 'EPS', group: 'Profitability', unit: 'eps',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26'],
          act:    [0.97, 1.33, 1.45, 1.76, 1.07, -0.42, 3.28, 4.43, 3.45, 2.61, null],
          summit: [null, null, null, null, null, null, null, null, null, null, null],
          cons:   [null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null],
          note: 'Diluted EPS in EUROS (not dollars), IFRS as reported — 2Q26 €2.61 diluted on 208.9M shares (€2.65 basic). Carries the same below-the-line noise as net income. ⚠ <b>The Street cell is deliberately empty.</b> Earnings-day coverage put the expectation at ~€2.80, which would make this a ~7% miss, but the basis of that figure could not be verified as IFRS-as-reported rather than an adjusted or normalized number — and aggregators publish ADJUSTED EPS while this row is IFRS. Filling it would manufacture a surprise out of a definition difference. It stays null until a like-for-like source is in hand. Spotify does not guide EPS.' },
        fcf: { label: 'Free Cash Flow', short: 'Free cash flow', group: 'Profitability', unit: 'usdM', marginOf: 'rev', marginLabel: 'FCF margin',
          periods: ['1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26'],
          act:    [207, 490, 711, 877, 534, 700, 806, 834, 824, 797, null],
          summit: [108.6, 215.6, 351.2, 391.9, 753.7, 726.4, 706.2, 854.2, 797.6, 716.1, 769.4],
          cons:   [null, null, null, null, null, null, null, null, null, null, null],
          guideLo:[null, null, null, null, null, null, null, null, null, null, null],
          guideHi:[null, null, null, null, null, null, null, null, null, null, null],
          note: 'Free cash flow has run consistently ABOVE operating income — the payment timing of royalty accruals plus deferred subscription revenue give Spotify a structurally favourable working-capital cycle. Strongly seasonal (1Q is the trough). 2Q26 printed <b>€797M</b>, a record for a second quarter, on €816M of operating cash flow less €21M of capex, taking LTM free cash flow to <b>€3.3B</b> and the cash pile to €9.4B. It is what funds the buyback: $662M repurchased year-to-date through Aug 3, about 30% ahead of 2025, ~2.2M shares (≈1% of the count) since repurchases resumed. Not guided.' }
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
  // ── Estimate EVOLUTION across model snapshots (vintages) ────────────────────
  // How the ANNUAL forecast for each fiscal year moved as prints landed. Source of
  // record: the SUMMIT RESEARCH DATABASE — the model's saved snapshots, pulled
  // through the Summit MCP (`get_fundamentals`, sheet_source `projection_history`).
  // FIVE vintages now exist for SPOT; the fifth (2026-08-04) was parsed the morning
  // of the 2Q26 print and DOES contain it.
  //
  // ⚠ CORRECTION, Aug 2026: this tab previously stated that "no Bloomberg consensus is
  // stored per snapshot for these lines". That was WRONG. Every vintage carries
  // `rev_bbg_est`, `ebitda_bbg_est` and `earnings_bbg_est` alongside the Summit lines,
  // so those three metrics now show a real Street series next to the model — which
  // turns this tab from "the model against its own past self" into the far more useful
  // "the model against the Street, both moving". Operating income and free cash flow
  // have no BBG counterpart in the model, so they keep `cons: null`.
  evolution: {
    intro: 'How the forecast itself has moved. Each line tracks one fiscal year’s estimate across the model’s five saved snapshots — <b>and, on revenue, EBITDA and earnings, against the Bloomberg consensus stored in the same snapshot</b>. Two things stand out. First, the <b>February 2026 snapshot cut the out-years hard</b> — FY2029 revenue came down 19% and FY2029 EBITDA came down 30% in a single revision; the snapshots since have clawed part of it back. ⚠ Note what that revision was NOT: an update on the 4Q25 print. Its actuals still stop at 3Q25, so it was a re-think of the forward assumptions, not a reaction to reported numbers. Second, and only visible now that the Street line is drawn: <b>the Street barely moved at all</b>. FY2027 consensus revenue has sat in a €22.1–22.4B band across all eight months while Summit travelled from €24.8B down to €22.9B — the model did not lead the Street, it converged on it. The newest vintage (Aug 4, the morning of the 2Q26 print) changed almost nothing at the annual level.',
    vintages: [
      { label: 'Dec 18, 2025', event: 'actuals to 3Q25' },
      { label: 'Feb 9, 2026',  event: 'actuals still to 3Q25 — a forward re-think, NOT a post-4Q25 update' },
      { label: 'Apr 28, 2026', event: 'first to carry 4Q25 + 1Q26' },
      { label: 'May 22, 2026', event: 'post-Investor Day' },
      { label: 'Aug 4, 2026',  event: 'carries the 2Q26 print — parsed the morning it landed' }
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
        summit: [[20802, 19581, 19737, 19775, 19694], [24836, 22198, 21963, 22958, 22895], [29112, 24858, 24854, 26605, 26531], [33788, 27447, 27701, 30489, 30404]],
        cons:   [[19700, 19646, 19512, 19482, 19485], [22435, 22348, 22142, 22232, 22315], [25186, 25079, 24866, 25119, 25294], [27784, 27516, 27104, 28009, 28343]],
        // The FY2025 base each vintage's implied FY2026 growth is measured against — ONE ENTRY PER
        // VINTAGE (the engine indexes prior[src][vintageIndex], so a short array silently blanks the
        // growth for the newest snapshot). FY2025 is a reported actual, so the base is the same €17,186M
        // in every vintage, and the same base serves the consensus row.
        prior: { summit: [17186, 17186, 17186, 17186, 17186], cons: [17186, 17186, 17186, 17186, 17186] },
        note: 'The December 2025 vintage carried FY2026 revenue at €20.8B — about +21% on the FY2025 actual of €17.2B, against a company that has since guided to roughly +10%. February corrected it to €19.6B (on judgement, not on new actuals — that snapshot still ends at 3Q25) and it has barely moved since; the Aug 4 vintage sits at €19.7B, which is simply 1H26 actuals plus the guided 3Q and a modelled 4Q. The out-years took the real damage: FY2029 went €33.8B → €27.4B (−19%) in one revision, recovering to €30.4B. <b>The Street line is the useful comparison</b>: consensus FY2026 revenue has sat at €19.5B the whole time, so December’s €20.8B was the model roughly 6% above the Street, and February closed that gap rather than discovering anything. On FY2029 the model still runs ~7% above consensus, down from ~22% in December.' },
      ebitda: { label: 'EBITDA', unit: 'usdM', marginOf: 'rev', marginLabel: 'EBITDA margin',
        summit: [[3558, 3150, 3268, 3250, 3271], [5175, 4256, 3983, 4048, 4052], [6851, 5109, 5024, 5171, 5184], [8456, 5951, 5944, 6455, 6476]],
        cons:   [[3047, 3062, 3172, 3048, 3007], [3943, 3922, 3974, 3877, 3904], [4607, 4606, 4838, 4813, 4854], [5287, 5264, 5267, 5529, 5656]],
        note: 'The hardest-cut line in the model. FY2029 EBITDA fell €8.5B → €6.0B (−30%) at the February snapshot and is still ~23% below where it started. In the margin view the model now runs a ~21% EBITDA margin by FY2029 against the ~25% it assumed in December. <b>But this is where the model is most differentiated</b>: consensus FY2029 EBITDA is €5.7B against Summit’s €6.5B, so even after the cut the model sits ~15% above the Street — a wider gap than on revenue, which means the difference is a margin call, not a growth call. FY2026 is the exception: the model and the Street are within ~9% and both are near €3.0–3.3B.' },
      opinc: { label: 'Operating Income', unit: 'usdM', marginOf: 'rev', marginLabel: 'operating margin',
        summit: [[3205, 2853, 2923, 2900, 2888], [4802, 3978, 3659, 3714, 3710], [6473, 4859, 4771, 4907, 4911], [8084, 5741, 5729, 6229, 6241]],
        cons: null,
        note: 'Cut alongside EBITDA and never restored: FY2027 operating income went €4.8B → €3.7B (−23%) and has held there across the last three vintages. Worth holding next to the Investor Day target of a 20%+ operating margin by 2030 — the model’s own FY2029 margin is ~20.5%, so it sits right AT the promise rather than comfortably through it. No Bloomberg operating-income series is stored in the model, so there is no Street line to compare here; use EBITDA for that.' },
      earnings: { label: 'Earnings (model definition)', unit: 'usdM', marginOf: 'rev', marginLabel: 'net margin (model def.)',
        summit: [[2884, 2568, 2685, 2760, 2749], [4322, 3580, 3336, 3076, 3074], [5825, 4373, 4658, 4081, 4085], [7276, 5167, 5634, 5182, 5193]],
        cons:   [[2584, 2535, 2743, 2686, 2671], [3277, 3270, 3406, 3303, 3297], [3928, 3939, 4068, 3992, 4028], [4629, 4621, 4482, 4635, 4691]],
        note: '⚠ <b>UPDATE — the line that kept falling has stopped.</b> FY2027 earnings were cut at every one of the first four snapshots (€4,322M → €3,580M → €3,336M → €3,076M, a cumulative −29%); the Aug 4 vintage holds it flat at €3,074M. Read together with the Street line, the whole sequence now has a cleaner explanation than "something is wrong with this line": consensus FY2027 earnings has been anchored at €3.3B throughout, so the model started 32% ABOVE the Street and walked down THROUGH it — it now sits ~7% BELOW consensus. The cutting stopped roughly where the Street was, which looks like convergence rather than deterioration. FY2028 and FY2029 tell the same story and are now ~1–11% above consensus.' },
      fcf: { label: 'Free Cash Flow', unit: 'usdM', marginOf: 'rev', marginLabel: 'FCF margin',
        summit: [[4315, 3825, 3375, 3357, 3434], [5222, 4304, 4055, 4119, 4134], [6901, 5159, 5099, 5246, 5270], [8508, 6003, 6023, 6533, 6566]],
        cons: null,
        note: 'FY2026 free cash flow was cut from €4.3B to €3.4B (−22%) across the five snapshots — a steady walk down rather than one step, and it has now turned back up slightly. The €3.4B FY2026 figure reconciles well against the €3.3B LTM the company actually reported at 2Q26, so this line has landed somewhere defensible. The out-years follow the same shape as EBITDA. ⚠ One model caveat visible in the extraction: the capex assumption itself was revised upward across vintages (FY2026 €45M → €68M → €78M), which is a small drag but a real one — Spotify’s reported 2Q26 capex was €21M in the quarter, so the model is now assuming a higher run rate than the company is spending. No Bloomberg free-cash-flow series is stored in the model.' }
    },
    note: 'Single source: the Summit Research database — the model’s saved snapshots as recorded in the DCF’s Projection History, pulled through the Summit MCP on 4 Aug 2026 (sheet source `projection_history`, annual periods). FIVE vintages, dated by what each one actually CONTAINS rather than by what happened near its date: Dec 18 2025 and Feb 9 2026 both carry actuals only to 3Q25; 4Q25 and 1Q26 first appear in the Apr 28 2026 snapshot; May 22 2026 follows the Investor Day; and Aug 4 2026 was parsed the morning of the 2Q26 print and does carry it (the model’s actuals sheet holds revenue €4,777M and operating income €655M for 2026Q2, and FY2026 reconciles exactly to 1H26 actuals plus the two forward quarters). The dashed <b>Consensus</b> series is the Bloomberg estimate stored inside each snapshot (`rev_bbg_est` / `ebitda_bbg_est` / `earnings_bbg_est`) — it exists for revenue, EBITDA and earnings only. ⚠ Two cautions from the extraction audit still stand: Spotify’s fixed HISTORY is restated between snapshots (FY2022 adjusted EBITDA reads differently in each), so never build one time series by mixing vintages — compare the same year across vintages, which is what this tab does; and the model’s consolidated MAU/subscriber/ARPU lines were wiped from the Feb-2026 vintage onward, which is why no user metric appears here. A third was found in this extraction: the model’s `premium_cogs` and `ads_cogs` lines are mirrored to their revenue lines (cost equals revenue exactly), so segment cost of revenue is unusable — the segment GROSS PROFIT lines are sound and were used instead. Figures in € millions. Implied growth chains within Summit’s own data; the FY2025 base is the reported actual of €17,186M. Data sourced from Summit DCF models.'
  },
  source: 'Sources: Spotify quarterly shareholder decks on investors.spotify.com (actuals, and the guidance issued for the following quarter — each quarter’s figures taken from that quarter’s own deck). The 2Q26 print and the 3Q26 guidance are from the Q2 2026 Update filed with the SEC as Exhibit 99.1 to the Form 6-K of 4 Aug 2026 (accession 0001140361-26-031044, CIK 0001639920). The single Street cell (2Q26 revenue €4,790M) is the FactSet consensus carried on the wire the morning of the print. Values in € millions except EPS (€ per share). The Street column is otherwise empty because Spotify has no rows in our BBG_CONSENSUS.txt archive — see the file header.'
};
