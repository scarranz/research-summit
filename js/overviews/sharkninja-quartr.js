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
// FY2026 GUIDANCE WALK — Management ▸ Track Record
// The record of what management told the market and how it changed.
// ═══════════════════════════════════════════════════════════════════════════════

// [metric, priorGuide, updatedGuide, note]
export var SN_GUIDE_WALK_2026 = [
  ['Net sales growth', '+11.5% to +12.5%', '+16.0% to +17.0%', 'Raised ~4.5pp — no tariff-refund component at all; this is operating performance.'],
  ['Adjusted EPS', '$6.00 – $6.10', '$6.45 – $6.55', 'Of the $0.45 increase, ~$0.15 is the expected net tariff-refund benefit — so ~$0.30 is operational.'],
  ['Adjusted EBITDA', '$1,290M – $1,300M', '$1,357M – $1,369M', 'Of the $67–69M increase, ~$30M is the tariff refund — so roughly half to two-thirds is operational.'],
  ['GAAP effective tax rate', '~22.0% to ~23.0%', '~22.0% to ~23.0%', 'Unchanged.'],
  ['Diluted weighted avg. shares', '~143.0M', '~142.5M', 'Slightly lower on buyback activity.'],
  ['Capital expenditures', '$190M – $210M', '$190M – $210M', 'Range unchanged, but now "tracking toward the high end."'],
];

export var SN_GUIDE_WALK_READ = 'Read the top line first: the <b>net sales</b> raise carries <b>no</b> refund component, so the ~4.5pp increase is pure operating momentum. On the earnings lines the refund does real work — roughly a third of the EPS raise and around 45% of the EBITDA raise — and management said it intends to <b>reinvest a portion</b> of the benefit into retail activation, media, AI capability and tariff/input-cost mitigation rather than let it all drop through. 2Q26 itself was the <b>13th consecutive quarter</b> of double-digit net sales growth and the fastest since 4Q24.';

export var SN_GUIDE_WALK_NOTE = 'FY2026 outlook as of the Q2 2026 release (Aug 5, 2026), against the outlook it replaced. The company separates the tariff-refund benefit from underlying performance in its own disclosure — worth crediting, since that is the difference between a guidance raise and a one-off.';

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
