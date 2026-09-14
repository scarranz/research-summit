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
