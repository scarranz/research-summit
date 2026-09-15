// overviews/sharkninja-quartr.js — SharkNinja (NYSE: SN), the Quartr pass (Sep 2026).
//
// Everything here was sourced through the Quartr MCP and then FROZEN. Nothing is fetched at
// runtime: the MCP connection may not stay active, so the portal must never depend on it.
// Refreshing this file is a deliberate, manual pass.
//
// PROVENANCE RULE: Quartr is the *retrieval* path, not the authority. Every figure is
// attributed to the underlying primary document — a quarterly earnings release (8-K exhibit),
// the investor presentation on ir.sharkninja.com, or the earnings-call transcript — so the
// citation survives even if Quartr access ends. The `q`/`src` fields are Quartr deep links, a
// convenience that may require a Quartr seat; the `doc` text names the primary document.
//
// ONE HOME PER NUMBER (blueprint §2). Most of what this pass retrieved does NOT live here —
// it was written into the place the structure already had for it:
//   • Product-category, brand and geography net sales  → js/results-data/sn.js, read through
//     by the Top Line engine as three alternative CUTS (Top Line ▸ Other).
//   • The growth decomposition, TAM, scale arc, innovation cadence, market-share sourcing,
//     sub-category adjacencies                          → js/segments-data/sn.js.
//   • Verbatim management commentary                    → js/themes-data/sn.js, surfaced as
//     Top Line ▸ Segments ▸ "What management has said".
// What remains below is only what has no home in those datasets: the provenance correction,
// the FY2026 guidance walk (Management ▸ Track Record), and the tariff / capital-structure
// analysis (Miscellaneous ▸ Other Analysis).

export var SN_Q_INTRO = 'A Quartr pass (Sep 2026) added the two things SharkNinja discloses <b>outside</b> the 10-K: the <b>net sales split by product category</b>, which every quarterly earnings release reports in dollars, and the strategic framing carried in the investor deck and on the earnings calls. Both were frozen into the codebase — the portal makes no live call to Quartr. The category, brand and geography cuts are in <b>Top Line &#9656; Other</b>; the growth decomposition and management commentary are in <b>Top Line &#9656; Segments</b>.';

// ═══════════════════════════════════════════════════════════════════════════════
// PROVENANCE — the correction this pass forced, and the releases behind it
// Rendered in Miscellaneous ▸ Other Analysis: it changes how a number may be quoted
// without anything changing in the business, which is that pane's genre.
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_CAT_CORRECTION = 'The 10-K discloses no product-category dollars — SharkNinja reports one segment — but <b>every quarterly earnings release does</b>, and each release also states the prior-year comparable, so six releases cover ten quarters. Assembled, the four categories sum to reported total net sales in every quarter (2Q26: 522.0 + 499.0 + 458.6 + 285.8 = $1,765.4M vs. $1,765.5M reported). That forced a correction: the same series in <code>js/results-data/sn.js</code> was labeled <i>"Bloomberg\'s own category tracking, not a company-disclosed dollar breakdown."</i> It matches the releases to the cent across 1Q24&ndash;2Q26 and FY2024&ndash;FY2025, so it is <b>company-reported</b> and is now labeled as such — the difference matters, because it is the difference between a figure you may quote and one you must hedge. The same check upgraded the <b>brand</b> split: FY2025 Shark $3,032.1M / Ninja $3,367.1M sums exactly to reported net sales and rounds to the $3.0Bn / $3.4Bn on p.5 of the Aug 2026 deck.';

export var SN_CAT_CORRECTION_LIMIT = 'The upgrade is scoped to what was verified. <b>FY2022&ndash;FY2023 and 3Q23&ndash;4Q23 category revenue remain Bloomberg-sourced and unverified</b> against a primary release — the FY2024 release\'s category paragraphs did not extract cleanly from the PDF. The quarterly and pre-FY2025 <b>brand</b> splits are likewise Bloomberg\'s own allocation; only the annual split is a company disclosure. Both limits are carried on the metric notes in the dataset itself, not just here.';

export var SN_CAT_SOURCES = [
  { doc: 'Q2 2026 earnings release (8-K), Aug 5, 2026 — covers 2Q26 and 2Q25', q: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=3667127&documentType=report&eventId=661459&navigation=external&utm_medium=referral&utm_source=mcp&rp=1' },
  { doc: 'Q1 2026 earnings release (8-K), May 6, 2026 — covers 1Q26 and 1Q25', q: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=3289577&documentType=report&eventId=555079&navigation=external&utm_medium=referral&utm_source=mcp&rp=1' },
  { doc: 'Q4/FY2025 earnings release (8-K), Feb 11, 2026 — covers 4Q25 and 4Q24', q: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=2802766&documentType=report&eventId=399981&navigation=external&utm_medium=referral&utm_source=mcp&rp=2' },
  { doc: 'Q3 2025 earnings release (8-K), Nov 6, 2025 — covers 3Q25 and 3Q24', q: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=2242166&documentType=report&eventId=372004&navigation=external&utm_medium=referral&utm_source=mcp&rp=2' },
  { doc: 'Q2 2025 earnings release (8-K), Aug 7, 2025 — covers 2Q24', q: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=2062205&documentType=report&eventId=344012&navigation=external&utm_medium=referral&utm_source=mcp&rp=2' },
  { doc: 'Q1 2025 earnings release (8-K), May 8, 2025 — covers 1Q24', q: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=1930552&documentType=report&eventId=315494&navigation=external&utm_medium=referral&utm_source=mcp&rp=2' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-CATEGORY ROSTER — the full 38, as of Dec 31 2025 (deck p.17)
// Rendered as a collapsible under Top Line ▸ General. The engine's segment cards carry
// the shape of each brand; this is the exhaustive list behind them.
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_SUBCATS = {
  Shark: ['Mops', 'Handheld Vacuums', 'Upright Vacuums', 'Corded Stick Vacuums', 'Cordless Stick Vacuums', 'Robot Vacuums', 'Canister Vacuums', '2-in-1 Vacuums', 'Wet/Dry Vacuums', 'Carpet Extractors', 'Hair Dryers', 'Hair Stylers', 'Skincare', 'Air Purifiers', 'Fans'],
  Ninja: ['Blenders', 'Food Processors', 'Coffee Makers', 'Air Fryers', 'Multi-Cookers', 'Indoor Grills', 'Outdoor Grills', 'Propane Grills', 'Outdoor Ovens', 'Countertop Ovens', 'Toasters', 'Waffle Makers', 'Electric Kettles', 'Cookware', 'Bakeware', 'Cutlery', 'Drinkware', 'Coolers', 'Juicers', 'Ice Cream Makers', 'Frozen Drink System', 'Carbonation Drink System', 'Fire Pits'],
};
export var SN_SUBCATS_NOTE = 'As of Dec 31, 2025, per the investor presentation (p.17) — 38 in total, rising to 40 with the Ninja Crispi Microwave (Jul 2026) and a 41st flagged by management for late 3Q26. The rosters show how little the two brands overlap: Shark is the home and personal-care side, Ninja is everything that sits near food. Note the drift beyond appliances — Ninja now sells Drinkware, Coolers, Cutlery, Cookware and Bakeware, none of which are motorized, which the 10-K\'s "small household appliances" description does not capture.';

// ═══════════════════════════════════════════════════════════════════════════════
// GUIDANCE — Evolution ▸ Guidance
//
// SharkNinja guides the FISCAL YEAR, never the quarter (confirmed across every release
// read: each carries a "Fiscal 20XX Outlook" block and no quarterly outlook at all). So
// the unit of analysis is a FY guide and how it moved print by print — a ratchet, not a
// per-quarter beat/miss. Each release also restates the guide it replaced ("above the
// prior expectation of …"), which is what makes the walk reconstructible.
//
// SOURCED PER ISSUE DATE from the release itself. A cell reading 'n/r' means NOT
// RECOVERABLE, never "not given": the FY2024 and early-FY2025 release PDFs on Quartr
// carry no extractable text layer (they return heading fragments only), so the Feb 2025
// initial guide survives only through the restatement in the 1Q25 release, which listed
// the three headline metrics and not the rest. FY2024's walk is not recoverable at all.
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_GUIDE_LEDE = 'SharkNinja guides the <b>fiscal year</b> and never the quarter — so the question is not "did it beat the quarter" but <b>how the year\'s guide moved across the four prints, and where it landed</b>. Every release restates the guide it replaced, which makes the whole ratchet reconstructible from primary sources.';

// verdict: 'above' | 'below' | 'inside' | null (year still open)
export var SN_GUIDE_YEARS = [
  {
    fy: 'FY2026',
    status: 'in flight',
    // [shortLabel, date, what happened]
    issues: [
      ['Initial', 'Feb 11, 2026', 'issued with the FY2025 results'],
      ['After 1Q26', 'May 6, 2026', 'raised'],
      ['After 2Q26', 'Aug 5, 2026', 'raised again — the current guide'],
    ],
    hasActual: false,
    metrics: [
      { m: 'Net sales growth', vals: ['+10.0% to +11.0%', '+11.5% to +12.5%', '+16.0% to +17.0%'], act: null, verdict: null,
        note: 'Raised twice, and the second raise carries <b>no</b> tariff-refund component — the whole ~4.5pp step is operating performance.' },
      { m: 'Adj. net income per diluted share', vals: ['$5.90 – $6.00', '$6.00 – $6.10', '$6.45 – $6.55'], act: null, verdict: null,
        note: 'Of the $0.45 raise at 2Q26, ~$0.15 is the expected net tariff refund — so ~$0.30 is operational.' },
      { m: 'Adj. EBITDA', vals: ['$1,270M – $1,280M', '$1,290M – $1,300M', '$1,357M – $1,369M'], act: null, verdict: null,
        note: 'Of the $67–69M raise at 2Q26, ~$30M is the tariff refund — roughly half to two-thirds is operational.' },
      { m: 'GAAP effective tax rate', vals: ['~22.0% to 23.0%', '~22.0% to 23.0%', '~22.0% to 23.0%'], act: null, verdict: null,
        note: 'Held flat all year.' },
      { m: 'Diluted weighted avg. shares', vals: ['~143.5M', '~143.0M', '~142.5M'], act: null, verdict: null,
        note: 'Grinding down as the $750M repurchase program runs — 1,008,368 shares bought back in 1H26 at an average $118.71.' },
      { m: 'Capital expenditures', vals: ['$190M – $210M', '$190M – $210M', '$190M – $210M'], act: null, verdict: null,
        note: 'Range never moved, but at 2Q26 it is "tracking toward the high end" — the opposite of FY2025, which tracked to the low end and then undershot badly.' },
    ],
    story: 'FY2026 is running the same play as FY2025. The year opened at <b>+10.0–11.0%</b> net sales growth and is now guided to <b>+16.0–17.0%</b> — two raises in two prints, and the top-line raise contains no tariff-refund benefit at all. If the FY2025 pattern repeats, the final guide is still the floor rather than the ceiling.',
  },
  {
    fy: 'FY2025',
    status: 'closed',
    issues: [
      ['Initial', 'Feb 13, 2025', 'issued with the FY2024 results'],
      ['After 1Q25', 'May 8, 2025', 'raised'],
      ['After 2Q25', 'Aug 7, 2025', 'raised'],
      ['After 3Q25', 'Nov 6, 2025', 'raised — the final guide'],
    ],
    hasActual: true,
    metrics: [
      { m: 'Net sales growth', vals: ['+10% to +12%', '+11% to +13%', '+13% to +15%', '+15.0% to +15.5%'], act: '+15.7%', verdict: 'above',
        note: 'Raised at every single print, and the reported year still came in <b>above the final raised guide</b>.' },
      { m: 'Adj. net income per diluted share', vals: ['$4.80 – $4.90', '$4.90 – $5.00', '$5.00 – $5.10', '$5.05 – $5.15'], act: '$5.28', verdict: 'above',
        note: 'Landed <b>$0.13 above the top</b> of the final range, and ~$0.40 above where the year started.' },
      { m: 'Adj. EBITDA', vals: ['$1,070M – $1,090M', '$1,090M – $1,110M', '$1,100M – $1,120M', '$1,115M – $1,125M'], act: '$1,135.5M', verdict: 'above',
        note: 'Above the top of the final range by $10.5M, and ~$55M above the initial guide\'s midpoint.' },
      { m: 'GAAP effective tax rate', vals: ['n/r', '~24% to 25%', '~24% to 25%', '~23.0% to 24.0%'], act: '22.1%', verdict: 'below',
        note: 'Below the guided range — <b>favourable</b> here, since a lower tax rate flatters EPS. The company attributes it to "one-time benefits recorded in the fourth quarter of 2025"; the amount and nature were not disclosed.' },
      { m: 'Diluted weighted avg. shares', vals: ['n/r', '~142.5M', '~143M', '~142.5M'], act: 'n/c', verdict: null,
        note: 'Guided consistently around 142.5–143M. The reported full-year diluted share count was not compiled in this pass.' },
      { m: 'Capital expenditures', vals: ['n/r', '$180M – $200M', '$180M – $200M', '$180M – $200M'], act: '$146.1M', verdict: 'below',
        note: '⚑ <b>The one real planning miss.</b> Guided $180–200M all year and flagged as "tracking toward the lower end" at 3Q25, yet the 10-K cash-flow statement shows <b>$146.1M</b> — roughly $34M below even the bottom of the range. Caveat before calling it a miss: the guided "capital expenditures" may be defined more broadly than the cash-flow line (capitalised software is the usual difference), and the company did not reconcile the two. Shown as reported, not forced to agree.' },
    ],
    story: 'FY2025 is the cleanest read on management\'s own conservatism: <b>the guide went up at every one of the four prints</b> — net sales from +10–12% to +15.0–15.5% — and the reported year then came in <b>above the final raised guide on all three headline lines</b>. Tax also came in below the guided range, which helped EPS. The exception is capex, which undershot its own range by a wide margin.',
  },
];

export var SN_GUIDE_PATTERN = 'Across the two years that are reconstructible, SharkNinja has <b>never once cut a guide</b> — seven revisions, all upward. That is a real, testable pattern, and it cuts two ways: management has been reliably conservative at the start of a year, which also means the <b>initial</b> guide should not be read as a genuine expectation. The check to run on the next print is whether the FY2026 ratchet holds, and whether capex finally lands inside its range.';

export var SN_GUIDE_SOURCES_NOTE = 'Every figure is from the company\'s own "Fiscal 20XX Outlook" block in the quarterly earnings release (8-K exhibit), retrieved through Quartr and frozen here. Actuals are from the Q4/FY2025 release and the FY2025 10-K. <b>n/r = not recoverable</b> (the FY2024 and Feb-2025 release PDFs carry no extractable text layer on Quartr, so the initial FY2025 guide survives only through the restatement in the 1Q25 release, which listed the three headline metrics only); <b>n/c = not compiled</b> this pass. FY2024\'s guidance walk is not recoverable for the same reason. Nothing here is fetched at runtime.';

// ═══════════════════════════════════════════════════════════════════════════════
// EARNINGS — Evolution ▸ Earnings
//
// SCAFFOLD + WHAT IS REAL. Built so the consensus-dependent half fills in by itself the
// day SN lands in BBG_CONSENSUS.txt — see scripts/consensus/map_sn.json for the exact
// five-step path. NOTHING below is invented: where a number needs Street consensus and
// none exists, the pane renders an explicit pending badge instead of a placeholder
// figure. EARNINGS_CONVENTIONS §5 rule 3 — "estimates are never invented, absent →
// to fill" — and rule 1 — "consensus = Bloomberg ONLY" — are the reason.
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_IR_URL = 'https://ir.sharkninja.com';
export var SN_EDGAR_URL = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&ticker=SN&type=10-K&dateb=&owner=include&count=40';

export var SN_EARN_LEDE = 'Two phases, one per print: the <b>Setup</b> for the quarter that has not happened, and <b>Post-Results</b> for the one that just did. The chart in Setup is the shared Results engine on a rolling window — real reported actuals against Bloomberg Street consensus. What is <b>not</b> here yet is the consensus <b>grid</b> and the surprise scorecard, and the reason is structural rather than effort: the Setup grid is gated on SN appearing in <code>BBG_CONSENSUS.txt</code>, and there is no Summit DCF model to score against either.';

export var SN_EARN_PENDING = {
  title: 'The Setup grid and the surprise scorecard are not built — here is exactly why, and what fills them',
  body: 'Two independent inputs are missing, and neither is available from Quartr (which carries primary filings and transcripts, <b>never analyst estimates</b>):<br><br>' +
    '<b>1 · Street consensus.</b> The vintage machinery reads snapshots keyed by <code>data_as_of</code> out of <code>BBG_CONSENSUS.txt</code>. That file carries eight tickers — AMZN, GOOGL, LYFT, META, NVDA, SPOT, TBBB, UBER — and SN is not one. Adding it is a Bloomberg-terminal job. It also decides the <b>authorized KPI set</b>: per EARNINGS_CONVENTIONS §5 rule 6, the metrics allowed in the Setup grid and the charts are exactly the ones the txt authorizes, and nothing else qualifies a line.<br><br>' +
    '<b>2 · The Summit model.</b> No DCF model exists for SN, so there is no Summit estimate to put beside the Street\'s and no model-vs-reality back-test.<br><br>' +
    'The plumbing for both is already in place: <code>scripts/consensus/map_sn.json</code> carries the generator config and the five-step run order, and <code>js/results-data/sn-setup.js</code> already feeds the chart above. Dropping SN\'s row into the archive and running the generator fills the grid, the scorecard, the vintage picker on Results and the whole Estimates pane — with no further code.',
};

// The next print. Everything here is sourced, and every item is a question the print answers.
export var SN_NEXT_PRINT = {
  label: 'Q3 2026',
  date: 'Nov 5, 2026',
  status: 'scheduled',
  watch: [
    ['The $247.1M tariff refund lands', 'Recognized in 3Q26 as a reduction of cost of sales. Roughly half relates to duties expensed in FY2025 and is <b>excluded</b> from the adjusted metrics — so GAAP will carry about twice the benefit the adjusted numbers do. A GAAP quarter that looks like a blowout and is not.'],
    ['Does the FY2026 ratchet hold?', 'The guide has gone up at every print for two years — seven revisions, never a cut. It currently sits at +16.0–17.0% net sales. A fourth raise would confirm the pattern; a hold would be the first break in it.'],
    ['The DTC claim comes due', 'Management said plainly that the Salesforce re-platform benefit is <b>not in the numbers yet</b> and should appear in <b>Q4 2026</b>, accelerating into 2027. This is the print where that stops being a promise.'],
    ['TikTok Shop country count', 'Seven at the end of 2Q26, with a stated goal of more than doubling by holiday and 13 referenced for Q4. A countable, falsifiable number.'],
    ['Does capex finally land in its range?', 'FY2025 guided $180–200M and reported $146.1M. FY2026 guides $190–210M and is "tracking toward the high end" — the opposite direction. Worth watching whether the guide or the outturn moves.'],
    ['Cleaning\'s growth rate', 'The largest category grew just +4.1% in 2Q26 and +3.4% in 4Q25, against +17.0% in 1Q26. The diversification argument depends on the core being "growing, not flat" — this is the line that tests it.'],
  ],
  note: 'Compiled from the Q2 2026 release and call (Aug 5, 2026) and the FY2025 10-K. The event date is from the Quartr event record. No consensus expectation is shown for any of these because none is available — see the notice above.',
};

// The last print — scored against what IS available: the prior year and the company's own
// FY guide. NOT against Street consensus, which does not exist for SN.
export var SN_LAST_PRINT = {
  label: 'Q2 2026',
  date: 'reported Aug 5, 2026',
  kpis: [
    { v: '$1,765.5M', l: 'Net sales', s: '+22.2% YoY — fastest since 4Q24' },
    { v: '$264.9M', l: 'Adj. EBITDA', s: '+18.6% YoY · 15.0% margin' },
    { v: '$1.26', l: 'Adj. diluted EPS', s: '+29.9% YoY' },
    { v: '48.7%', l: 'Adj. gross margin', s: '−70bp YoY on tariffs' },
  ],
  // [line, reported, YoY, read]
  rows: [
    ['Net sales', '$1,765.5M', '+22.2%', '13th consecutive quarter of double-digit growth. Domestic +15.5%, International +36.6%.'],
    ['Cleaning', '$522.0M', '+4.1%', 'The largest category and the slowest — carpet extractors and cordless vacuums carried it.'],
    ['Cooking &amp; Beverage', '$499.0M', '+36.5%', 'Ninja Luxe Café espresso and the Crispi franchise.'],
    ['Food Preparation', '$458.6M', '+13.3%', 'Blending was the standout; frozen treats grew too.'],
    ['Beauty &amp; Home Environment', '$285.8M', '+65.3%', 'Skincare and fans. The fastest-growing category for the fourth straight quarter.'],
    ['Adj. gross margin', '48.7%', '−70bp', 'Tariff annualization, FX and retailer activations, partly offset by cost optimization, mix and the end of the JS Global sourcing fee.'],
    ['Adj. operating expenses', '35.6% of sales', '−40bp', 'Fifth consecutive quarter of opex leverage.'],
    ['Adj. EBITDA', '$264.9M', '+18.6%', '⚑ Grew SLOWER than net sales (+22.2%) — the stated goal is EBITDA ahead of sales for the full year, so this quarter ran against it on tariff annualization.'],
    ['Adj. diluted EPS', '$1.26', '+29.9%', 'Growth above 23% in 11 of the last 12 quarters.'],
  ],
  verdict: 'Scored against the only yardsticks available for SN — the prior year and the company\'s own FY guide — 2Q26 was unambiguously strong: growth accelerated, every category grew, opex levered for a fifth quarter, and management raised the FY guide by ~4.5pp with <b>no</b> tariff-refund component in the top-line raise. The one line that ran against plan is <b>Adjusted EBITDA growing slower than net sales</b>, which management attributed to the annualization of 2025 tariffs while reaffirming EBITDA ahead of sales for the full year. <b>What cannot be said</b> is whether any of it beat the Street: no consensus exists for SN in our archive, so no beat/miss verdict is possible, and none is implied here.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// ESTIMATES — Evolution ▸ Estimates
// The engine renders this pane only when the dataset carries `estMatrix`/`evolution`.
// SN has neither, so resultsEvoHtml('SN') returns '' and this notice renders instead.
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_EST_PENDING = {
  title: 'Estimates — the vintage axis — is wired but empty',
  body: 'This pane answers a different question from Results: not "what did it earn against expectations" but <b>"how did the expectation itself move"</b> — the same forecast read at successive snapshot dates, so you can see the Street revise. It needs two generated blocks in <code>js/results-data/sn.js</code>, and SN has neither:<br><br>' +
    '<b><code>estMatrix.cons</code></b> — consensus vintages, generated from <code>BBG_CONSENSUS.txt</code> deduped by <code>data_as_of</code>. SN is not among the eight tickers in that file.<br>' +
    '<b><code>estMatrix.summit</code></b> and <b><code>evolution</code></b> — both generated from Summit MCP snapshots, one pull per model save. No Summit DCF model exists for SN.<br><br>' +
    'The pane is already mounted and the generator config is written (<code>scripts/consensus/map_sn.json</code>), so this fills itself once the data lands — <code>emit_matrix.py</code> → <code>verify_preprint.py</code> → <code>apply_matrix.py</code>, with no code change here. Until then it shows this rather than an empty frame, because a blank pane reads as a bug and this is a sourcing gap.<br><br>' +
    '<b>What stands in for it today:</b> <b>Evolution ▸ Guidance</b> does the same job on the company\'s own numbers — SharkNinja\'s FY outlook read at each of the four prints that issued it, which is a genuine revision history, just management\'s rather than the Street\'s.',
};

// ═══════════════════════════════════════════════════════════════════════════════
// STRATEGY — Evolution ▸ Strategy
//
// The three-pillar GROWTH decomposition is not here — it lives in the segments dataset
// and renders under Top Line ▸ Segments ▸ Revenue interactions. This pane is the other
// half: the OPERATING model the company says produces that growth, and the live
// initiatives you can actually audit against a future print.
// Sources: the Aug 2026 investor presentation (p.7-13, 22, 25) and the 2Q26 call.
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_STRAT_LEDE = 'SharkNinja describes its strategy in two layers that are easy to confuse. The <b>growth</b> layer — where the incremental dollars come from — is the three-pillar decomposition under <b>Top Line &#9656; Segments</b>. This pane is the <b>operating</b> layer: the four capabilities management claims compound into a moat, what it promises the consumer, and the initiatives currently in flight. The useful question for each is not "is it a nice slide" but <b>what would show up in the numbers if it were true</b>.';

// [title, what the company says it is, what it should show up as]
export var SN_STRAT_MOAT = [
  ['Disruptive innovation', '1,000+ cross-functional engineers and designers across the US, UK and China on a 24/7 cycle; 5,500+ patents in force; a target of 25 new products a year, 20 of them into existing categories.', 'R&amp;D held near <b>5.8-6.2% of net sales</b> while sales compounded — the spend scales with the business rather than spiking. The test is sub-category count still rising (38 &#8594; 40 &#8594; 41) without R&amp;D intensity rising with it.'],
  ['Global, agile supply chain', 'Third-party suppliers manufacture <b>100%</b> of products across six countries — China, Vietnam, Malaysia, Thailand, Indonesia, Cambodia — with dual-sourcing on key products.', 'Capex at <b>2.3% of net sales</b> (FY2025) because it owns no factories, and a tariff exposure spread across six jurisdictions rather than one. The 2026 assumption set (10% on three countries, 12.5% on three others) is the live test.'],
  ['Always-on 360° marketing', 'Marketing is built into product development rather than bolted on — "marketing-first products," influencer and press seeding, rapid content off consumer reviews.', 'S&amp;M rising as a share of sales (<b>16.7% &#8594; 22.8%</b> FY2022-FY2025) is the cost of this, and the offsetting claim is category expansion. The test is whether S&amp;M finally levers now that opex has levered five quarters running.'],
  ['Omni-channel distribution', 'No retailer exclusivity, ever — mass, specialty, pure players, own DTC and social commerce. 180+ retail partners globally, 36 in the US.', 'Three customers each above 10% of net sales is the counter-fact: the channel is broad but the <b>customer</b> base is concentrated (45.7% in three). Watch whether DTC and social commerce dilute that.'],
];

// [point, what it means]
export var SN_STRAT_PROMISE = [
  ['Speed', 'First-to-market disruptive innovation'],
  ['Performance', 'Products that exceed expectations'],
  ['Quality', 'A 5-star product experience'],
  ['Value', 'Accessible prices'],
];
export var SN_STRAT_PROMISE_NOTE = 'The four consumer value points the company says every product must hit (deck p.7). Worth holding onto when reading the margin story: <b>Value</b> — accessible pricing — is an explicit constraint management has put on itself, which is why the gross-margin expansion argument runs through product cost and mix rather than through price.';

export var SN_STRAT_GM = 'The deck is unusually direct about the profit engine: the 2026 roadmap names <b>"Ruthless focus on Product Cost and Avg Sell Price: Gross Margin Rate expansion is our Growth Catalyst"</b> as a top-line principle. The stated drivers are the scaled manufacturing and supply chain, data-driven inventory management, and mix. Two independent tailwinds sit underneath it that the deck does not spell out: <b>channel mix</b> (DTC and social commerce carry a structurally higher gross margin, per the CFO) and the <b>end of the JS Global sourcing service fee</b> on Jul 31, 2025. The offsetting headwind is tariffs.';

export var SN_STRAT_DIVERSIFY = 'The roadmap\'s other financially load-bearing principle is <b>"The Power of Diversification: allows winning categories to help newer or declining categories develop or resurge."</b> That is the same claim the quarterly category table tests directly — and it holds up: Food Preparation swung from +52.8% to &minus;3.3% and back to +13.3% across four quarters while total net sales never dropped below double-digit growth.';

// [initiative, what it is, status, what to check]
export var SN_STRAT_INITIATIVES = [
  ['Social commerce (TikTok Shop)', 'A discovery channel for the oldest categories, not just viral launches — Ninja NeverDull cutlery, a five-year-old category, became top-three in the channel in the US.', 'Scaling', 'Live in 7 countries at end-2Q26 vs zero a year earlier; management targets more than double by holiday 2026 and referenced 13 for Q4. Count the countries on the 3Q26 call.'],
  ['DTC re-platforming (Salesforce)', 'One consolidated storefront replacing the legacy sites, with CRM and promotion tooling behind it.', 'Complete', 'Rollout finished across the major international markets in 2Q26; live in 14 European countries by Q4. Management says the benefit is not yet in the numbers and should appear in Q4 2026 and accelerate in 2027 — so this is a dated, falsifiable claim.'],
  ['Distributor → direct conversions', 'Taking markets off distributors and onto SharkNinja\'s own operation, the model the UK proved in 2014.', 'Complete', 'Italy and Spain were the last; management said it is "now done for the foreseeable future." Mexico converted a year earlier. The drag on reported international growth should now be gone.'],
  ['AI — "Jailbreak SharkNinja"', 'A company-wide programme: 8 big-bet and 20 quick-win projects, every one on a two-week review cycle, with resources reallocated if progress stalls.', 'Building', 'Named partners: <b>Palantir</b> on promotions and pricing (phase two, a four-month build, benefits expected in Q4 for US/UK/Germany/France) and <b>AWS</b> on media optimization (live end-September, scaling 2027).'],
  ['AI in product development', 'Compressing the "fuzzy front end" — concepting a product\'s form and style — from months to weeks.', 'Building', 'The claim to audit is a stronger pipeline into the core, not more splashy launches. Management also says AI lifted organic social-content capture from under 20% (hashtag-only) to 60%+.'],
  ['Share repurchase', 'The first capital-return programme as an independent company — $750M authorized Feb 11, 2026.', 'Live', '1,008,368 shares bought in 1H26 for $119.7M at an average $118.71; ~$100M of that in 2Q26 alone. Guided diluted share count has stepped down ~143.5M &#8594; ~142.5M across the year.'],
];

export var SN_STRAT_AUDIT = 'Three things this strategy has promised on a date, which makes them testable rather than rhetorical: (1) <b>DTC benefit appears in Q4 2026</b> and accelerates in 2027 — management explicitly said it is not in the numbers yet; (2) <b>opex leverage from AI in 2027</b>, on "roughly flat headcount," with no large reductions; (3) <b>TikTok Shop above 13 countries</b> by holiday 2026. None of the three needs a model to check — only the next two prints.';

export var SN_STRAT_SOURCES = 'Sources: SharkNinja investor presentation, August 2026 (p.7-13 the operating model, p.22 the 2026 roadmap, p.25 the growth and gross-margin drivers) and the Q2 2026 earnings call (Aug 5, 2026). Retrieved through Quartr and frozen. Status labels are this desk\'s reading of management\'s own description, not a company classification.';

// ═══════════════════════════════════════════════════════════════════════════════
// TIMELINE — Evolution ▸ Timeline
//
// NOT the corporate-genesis timeline — that is 1994-2023 and already lives in the
// Overview (SN_TIMELINE in sharkninja-data.js). This is the PUBLIC-COMPANY execution
// record: what happened, print by print, since the Jul 2023 spin-off. Dates are from
// the Quartr event list (every call, deck, conference and filing) cross-checked against
// the releases the facts come from.
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_TL_LEDE = 'The Overview\'s timeline covers how SharkNinja <i>became</i> SharkNinja, 1994 to the spin-off. This is the record since: <b>what the company has actually done as an independent public company</b>, print by print. Thirteen earnings calls in, the pattern is visible — guide low, raise, launch into the core, and take the catalogue abroad.';

// [date, tag, headline, detail]
// tag ∈ Listing · Print · Guidance · Product · Channel · Capital · People · Policy
export var SN_EXEC_TIMELINE = [
  ['Jul 31, 2023', 'Listing', 'Independent trading begins on the NYSE', 'The spin-off from JS Global completes via a pro-rata share distribution — not an IPO and not a cash sale. JS Global keeps Joyoung and SharkNinja\'s APAC operations. Mark Barrocas, President since 2008, becomes CEO.'],
  ['Aug 24, 2023', 'Print', 'First earnings call as a public company', 'Q2 2023. The start of the record below — thirteen calls to date.'],
  ['2024', 'Product', 'Ninja Crispi launches', 'The first portable glass air fryer. It becomes a platform rather than a product — Crispi Pro, DualZone Crispi and eventually the Crispi Microwave all build off it, which is the clearest single example of the "new category matures into core" claim.'],
  ['2025', 'Product', 'Three launches that reshaped the mix', 'Ninja <b>SLUSHi</b> (frozen drinks), Shark <b>CryoGlow</b> face masks — the company\'s first skincare entry — and the Ninja <b>Luxe Café</b> espresso machine. Beauty &amp; Home Environment grew 45.3% for the year and Food Preparation 31.6%, both led by these.'],
  ['Jul 31, 2025', 'Policy', 'The JS Global sourcing service fee ends', 'A contractual fee paid to the former parent for supply-chain services terminates, and the company names it as a gross-margin tailwind in every subsequent release. A quiet, dated structural improvement rather than an operating one.'],
  ['Sep 5 – Nov 6, 2025', 'People', 'Second CFO transition in about a year', 'Patraic Reagan resigns Sep 5, 2025; Adam Quigley is named permanent CFO Nov 6, 2025. Paul Carbone had held the role from 2022. Worth watching as a churn signal two years into independent public life.'],
  ['Nov 6, 2025', 'Guidance', 'FY2025 guide raised for the fourth time', 'Net sales to +15.0-15.5%, from +10-12% at the start of the year. The reported year then came in above even this — see Evolution ▸ Guidance.'],
  ['Feb 11, 2026', 'Capital', 'First capital-return programme — $750M buyback', 'Authorized alongside the FY2025 results, on record cash. The company states it does not expect to incur debt to fund it.'],
  ['Feb 11, 2026', 'Guidance', 'FY2026 opens conservatively at +10.0-11.0%', 'The same opening posture as FY2025, which started at +10-12% and finished at +15.7%.'],
  ['2Q26 (quarter ended Jun 30, 2026)', 'Channel', 'The international go-to-market transition completes', 'Italy and Spain finish converting from distributor-led to direct — the last of them — and the Salesforce DTC platform finishes rolling out across the major international markets. Management: "now done for the foreseeable future with these distributor conversions."'],
  ['2Q26', 'Channel', 'TikTok Shop live in seven countries, from zero a year earlier', 'Germany reached in weeks the volume that took months in the US and UK. Goal of more than doubling the country count by holiday 2026.'],
  ['Jul 2026', 'Policy', '$247.1M of tariff refund claims accepted by US CBP', 'To be recognized in 3Q26 as a reduction of cost of sales. Roughly half relates to duties expensed in FY2025 and is excluded from the adjusted metrics — so GAAP 3Q26 will carry about twice the benefit the adjusted numbers do.'],
  ['Jul 2026', 'Product', 'Ninja Crispi Microwave — the 40th sub-category', 'Entry into a multi-billion-dollar category the company had never touched, built on the Crispi platform. A 41st sub-category was flagged for late 3Q26.'],
  ['Jul 10, 2026', 'Capital', 'Controlling shareholder sells $401.2M of stock', 'JS&amp;W Group Holdings LP, controlled by Chairperson CJ Xuning Wang, sells 2,668,200 shares at $150.36 — near the 52-week high, with the stock up roughly 36% year-to-date. It retained 50,639,560 shares.'],
  ['Aug 5, 2026', 'Print', '2Q26 — the fastest growth since 4Q24', 'Net sales +22.2% to $1,765.5M, the 13th consecutive quarter of double-digit growth. International +36.6%. All four categories grew; Beauty &amp; Home Environment +65.3%.'],
  ['Aug 5, 2026', 'Guidance', 'FY2026 guide raised to +16.0-17.0%', 'The second raise of the year. The top-line raise carries no tariff-refund component — it is operating performance.'],
  ['Nov 5, 2026', 'Print', 'Q3 2026 results — next scheduled print', 'The print that tests the DTC-benefit claim (management said Q4 2026), the TikTok Shop country count, and whether the FY2026 ratchet holds. It also carries the $247.1M refund.'],
];

export var SN_TL_TAGS = ['Listing', 'Print', 'Guidance', 'Product', 'Channel', 'Capital', 'People', 'Policy'];

// The IR cadence — where management speaks, from the Quartr event record.
export var SN_IR_CADENCE = {
  lede: 'Beyond the quarterly calls, SharkNinja works a consistent conference circuit — which is where the non-scripted commentary tends to come from.',
  rows: [
    ['Earnings calls', '13 held', 'Q2 2023 (Aug 24, 2023) through Q2 2026 (Aug 5, 2026); Q3 2026 scheduled Nov 5, 2026.'],
    ['ICR Conference', '2024, 2026', 'January — the consumer/retail season opener.'],
    ['Goldman Sachs Retailing', '2023, 2024, 2025', 'September. A fourth appearance, at GS Global Consumer &amp; Retail, was scheduled for Sep 15, 2026.'],
    ['William Blair Growth Stock', '2024, 2026', 'June.'],
    ['Canaccord Genuity Growth', '2025, 2026', 'August, days after the Q2 print each year.'],
    ['Morgan Stanley Consumer &amp; Retail', '2024, 2025', 'December.'],
    ['BofA Consumer &amp; Retail', '2025', 'March.'],
    ['Investor presentation', 'refreshed ~quarterly', 'Published alongside most prints; the Aug 2026 edition added two new slides specifically to answer the growth-durability question.'],
  ],
  note: 'Compiled from the Quartr event record (Jun 2023 &ndash; Nov 2026) and frozen. Conference appearances are listed by the year the company attended; transcripts for them were not mined — only the earnings calls were (Q2 2023 through Q2 2026), into the theme record.',
};

export var SN_TL_SOURCES = 'Sources: the Quartr event record for dates and the IR cadence; SharkNinja quarterly earnings releases (8-K), the FY2025 10-K, the FY2026 proxy and the Q2 2026 call for what each entry says. Retrieved through Quartr and frozen — nothing here is fetched at runtime. The corporate history before the Jul 2023 spin-off is deliberately not repeated here; it is in the Overview\'s timeline.';

// ═══════════════════════════════════════════════════════════════════════════════
// TARIFFS & CAPITAL STRUCTURE — Miscellaneous ▸ Other Analysis
// Both belong to that pane's genre: things that move reported profit, or the reading of
// the balance sheet, without anything changing in the business.
// ═══════════════════════════════════════════════════════════════════════════════

export var SN_TARIFF_KPIS = [
  { v: '$247.1M', l: 'Refund claims submitted', s: 'accepted by US CBP, Jul 2026' },
  { v: '10%', l: 'Assumed minimum tariff rate', s: 'Indonesia, Malaysia, Cambodia' },
  { v: '12.5%', l: 'Assumed tariff rate', s: 'China, Vietnam, Thailand — up from 10%' },
];

export var SN_TARIFF_LEDE = 'Tariffs are the single largest identified pressure on SharkNinja\'s gross margin — and in 2026 they also produced its largest one-off benefit.';

export var SN_TARIFF_REFUND = 'In July 2026 SharkNinja submitted refund claims of approximately <b>$247.1M</b> through the US Customs and Border Protection refund process, and CBP accepted them. The company expects to recognize the full amount as a <b>reduction of cost of sales</b>, with a corresponding receivable, in <b>3Q26</b>. The underlying duties split roughly evenly between amounts expensed in FY2025 and in 1H26.';

export var SN_TARIFF_TREATMENT = 'The accounting treatment is the part worth reading carefully, because it decides what appears where. Refunds tied to tariffs <b>expensed in 2025</b> benefit GAAP results and cash flow but are <b>excluded</b> from Adjusted Net Income, Adjusted EBITDA and Adjusted EPS in the FY2026 outlook. Refunds tied to tariffs <b>incurred in 2026</b> flow through those same adjusted metrics. So GAAP 3Q26 will carry roughly <b>twice</b> the benefit the adjusted numbers do — which will look like a blowout GAAP quarter and should not be read as one.';

export var SN_TARIFF_MARGIN = 'The pressure itself is visible in the reported margin. Adjusted gross margin fell <b>70bp</b> YoY in 2Q26 to 48.7%, which the company attributes primarily to US tariff cost, unfavourable FX and increased retailer activations, partly offset by cost optimization, favourable category and channel mix, and the end of the JS Global sourcing service fee (which terminated Jul 31, 2025). Management framed the 2Q26 drag as mostly the <b>annualization</b> of 2025 tariffs rather than new cost.';

export var SN_TARIFF_NOTE = 'Source: Q2 2026 earnings release and earnings call, Aug 5, 2026. The assumed rates are the company\'s own outlook assumptions, held constant for the remainder of 2026 — not a forecast of policy, and not the portal\'s view.';

export var SN_CAPSTRUCT = {
  lede: 'The company publishes its own capital-structure summary, which settles a reconciliation this profile previously left open.',
  rows: [
    ['Cash and cash equivalents', '$780M'],
    ['Total debt', '$719M'],
    ['Net debt', '($61M) — i.e. net cash'],
    ['LTM Adjusted EBITDA (2Q26)', '$1,212M'],
    ['LTM net leverage', '(0.05x)'],
  ],
  note: 'As of June 30, 2026, per the investor presentation (p.27). Total debt consists of $729.0M outstanding under the term loan; the release states $718.9M excluding unamortized deferred financing costs. Roughly $489.8M remained available on the $500M revolving credit facility.',
  resolves: 'This resolves the flag carried on <b>Bottom Line &#9656; Balance Sheet &amp; Cash Flow</b>. Bloomberg\'s "Net Debt (Cash)" line showed net <b>debt</b> of $124.2M at FY2025 despite $777.3M of cash on hand, while the company\'s own figures implied a small net <b>cash</b> position. The company\'s Jun-30-2026 slide uses its own definition — cash less term-loan borrowings — and reports <b>net cash of $61M at (0.05x) leverage</b>. The likely explanation for Bloomberg\'s figure is still that it includes operating lease liabilities under ASC 842, and that is still <b>not confirmed</b>. But the practical question is settled either way: on the company\'s own definition SharkNinja carries no net debt, and the gap between the two figures is definitional, not a disputed fact.',
  src: 'https://web.quartr.com/companies/15145?companyId=15145&documentId=3966451&documentType=slide&eventId=661459&navigation=external&utm_medium=referral&utm_source=mcp&sp=27',
};

export var SN_QUARTR_SOURCES = 'Quartr pass (Sep 2026) sources: SharkNinja quarterly earnings releases (8-K exhibits) for 1Q25, 2Q25, 3Q25, Q4/FY2025, 1Q26 and 2Q26; the investor presentations of August 2026 (34pp) and February 2026; and the Q2 2026 earnings-call transcript (Aug 5, 2026). All retrieved through Quartr and frozen into the repo — the portal makes no runtime call to Quartr. Flagged for review: the deck\'s p.14 market-share bars (values not reliably extractable from the PDF — read the slide); the deck\'s own 35-vs-38 markets discrepancy; FY2022–FY2023 / 3Q23–4Q23 category revenue and the quarterly brand split, which remain Bloomberg-sourced and unverified; and the theme record, which so far carries only the 2Q26 call — earlier quarters are a gap to fill, not a defect in the shape.';
