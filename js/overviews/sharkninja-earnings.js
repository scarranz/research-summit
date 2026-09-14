// overviews/sharkninja-earnings.js — the SN Earnings record, per docs/EARNINGS_CONVENTIONS.md §7.
//
// Shape follows CALL_EARNINGS exactly: quarters[], each with setup / results / call, plus the
// flat WL_ROWS table (§6f) which is OURS and is never a model output.
//
// ── WHAT IS SOURCED WHERE ────────────────────────────────────────────────────────────────────
// • Street (`cons`) and the YoY base are DERIVED from js/results-data/sn.js at render time, not
//   hand-typed — the same discipline as AMZN's grid ("BUILT FROM THE ARCHIVE, not hand-authored"),
//   so the cells cannot drift out of sync with the Results tab. The underlying source is the
//   Bloomberg FA_SN company-financials export (Sep 2026 snapshot), which satisfies §5 rule 1
//   (consensus = Bloomberg only).
// • Summit (`us`) is null EVERYWHERE. There is no Summit DCF model for SN, and §5 rule 3 is
//   explicit: estimates are never invented, absent → "to fill". So the Consensus ⇄ Summit ⇄ Both
//   toggle renders Summit empty rather than fabricating a second opinion, and `debate.rows` stays
//   null per §6 ("rows fill when Summit numbers exist").
// • Everything in `results` and `call` is from the company's own release and transcript, retrieved
//   through Quartr and frozen (see sharkninja-quartr.js for the no-runtime-call rule).
//
// ── WHY THE 2Q26 SCORECARD IS ALL `nocons` ───────────────────────────────────────────────────
// §7b defines five verdicts, not three, for exactly this case: `nocons` = "the Street published no
// estimate for this line". Our only Bloomberg file for SN is a Sep-2026 snapshot taken AFTER the
// print, so there is no FROZEN pre-print expectation to score against — scoring beat/miss off a
// post-print snapshot would be look-ahead. The doc is also explicit that `nocons` is never a
// comment on our coverage (Rule D). It resolves itself the moment SN enters BBG_CONSENSUS.txt and
// the vintage archive can serve a genuine pre-print column (scripts/consensus/map_sn.json).

import { snResults } from '../results-data/sn.js';

// ── derivation helpers ───────────────────────────────────────────────────────────────────────
function qv(key, period, field){
  var m = snResults.views.q.metrics[key];
  if (!m) return null;
  var i = m.periods.indexOf(period);
  if (i < 0) return null;
  var a = m[field];
  return (a && a[i] != null) ? a[i] : null;
}
// A Setup cell: Street value for `period`, with YoY against the same quarter a year earlier.
export function snCell(key, period, prior, unit){
  var v = qv(key, period, 'cons');
  var b = qv(key, prior, 'act');
  if (v == null) return null;
  return { v: v, unit: unit || 'usdM', yoy: (b == null || !b) ? null : (v / b - 1) };
}

export var SN_CE_SOURCE = 'Bloomberg (BST) company-financials export for SN, Sep 2026 snapshot';
export var SN_CE_ASOF = 'Sep 2026';

// ── the mandatory four + the four custom, §6 Setup ───────────────────────────────────────────
// Headline is fixed for every company: Revenue · Operating income · EPS · EBITDA.
export var SN_SETUP_HEADLINE = [
  { k: 'Revenue',          key: 'rev',       unit: 'usdM',
    note: 'Total net sales. SharkNinja does not guide by quarter — the FY2026 guide of +16.0–17.0% is the only company number in play, and it is an annual one. See Evolution ▸ Guidance.' },
  { k: 'Operating income', key: 'opIncome',  unit: 'usdM',
    note: 'GAAP operating income. The Street number implies a very large YoY step; note 3Q25 carried no tariff annualization, so the base is not clean.' },
  { k: 'EPS (diluted)',    key: 'epsAdj',    unit: 'eps',
    note: 'ADJUSTED diluted EPS — the basis SharkNinja guides and reports as its headline. GAAP diluted EPS is a separate line and the two diverge on share-based comp and FX.' },
  { k: 'EBITDA',           key: 'ebitdaAdj', unit: 'usdM',
    note: 'ADJUSTED EBITDA. The company\'s stated profitability goal is full-year Adjusted EBITDA growing FASTER than net sales — 2Q26 ran against that (+18.6% vs +22.2%) on tariff annualization.' },
];

// Custom four — the product categories, which is where SN's quarter is actually won or lost.
export var SN_SETUP_CUSTOM = [
  { k: 'Cleaning',                  key: 'segCleaning',   unit: 'usdM',
    note: 'The largest category and the slowest-growing: +4.1% in 2Q26 and +3.4% in 4Q25. The whole diversification argument rests on this being "growing, not flat".' },
  { k: 'Cooking & Beverage',        key: 'segCookBev',    unit: 'usdM',
    note: 'Luxe Café espresso and the Crispi franchise. The Crispi Microwave launched Jul 2026 and lands in this line from 3Q26.' },
  { k: 'Food Preparation',          key: 'segFoodPrep',   unit: 'usdM',
    note: 'The lumpiest line in the business — +52.8% in 2Q25, −3.3% in 1Q26, +13.3% in 2Q26. Frozen drinks (SLUSHi) drive the swing.' },
  { k: 'Beauty & Home Environment', key: 'segBeautyHome', unit: 'usdM',
    note: 'The fastest grower for four straight quarters (+65.3% in 2Q26). Also the most seasonal — fans peak in Q2/Q3, which is why the Street models a step DOWN from 2Q26 here.' },
];

export var SN_SETUP_SYNTH = 'The one thing 3Q26 has to resolve: <b>whether the tariff refund is read as the quarter, or the quarter is read without it.</b> Roughly $247.1M lands as a reduction of cost of sales, but only about half flows through the adjusted metrics — so GAAP will carry roughly twice the benefit the adjusted numbers do. A GAAP print that looks like a blowout and an adjusted print that looks ordinary are the same quarter. Underneath that, the real question is <b>Cleaning</b>: the largest category has grown low-single-digit in two of the last three quarters, and the Street models +7.6%.';

export var SN_SETUP_DEBATE_NOTE = 'The Street-vs-Summit divergence rows are empty by construction, not by omission: there is no Summit DCF model for SN, so there is no second estimate to disagree with. §5 rule 3 — estimates are never invented. The synth box alone carries the going-in read, which is what §6 (v2.5) says it should.';

// ── the frozen pre-call view for reported quarters ───────────────────────────────────────────
export var SN_FROZEN = {
  'Q2 2026': {
    pricedIn: 'No frozen pre-print consensus exists on file for SN — our only Bloomberg snapshot postdates the print. What WAS on the record going in: the company\'s own FY2026 guide of +11.5–12.5% net sales, set at the 1Q26 print in May, and eleven consecutive quarters of adjusted EPS growth above 23%.',
    oneLiner: 'Going in, the question was whether the international acceleration (+31.6% in 1Q26) could hold while tariffs annualized against the margin. It held, and then some.',
  },
  'Q1 2026': {
    pricedIn: 'Same gap — no frozen Street column. The company had guided FY2026 to +10.0–11.0% at the February print.',
    oneLiner: 'The first test of whether the FY2026 opening guide was as conservative as FY2025\'s had been.',
  },
};

// ── Post-Results, §6: red-line check FIRST, then the scorecard ──────────────────────────────
// thesisCheck lines are OURS — the things that, if they broke, would change the thesis.
export var SN_RESULTS = {
  'Q2 2026': {
    date: 'Aug 5, 2026',
    thesisCheck: [
      { line: 'Every one of the four categories grows', tripped: false,
        note: 'All four grew. Cleaning +4.1%, Cooking & Beverage +36.5%, Food Preparation +13.3%, Beauty & Home Environment +65.3%.' },
      { line: 'Adjusted EBITDA grows faster than net sales', tripped: true,
        note: 'BROKE. Adj. EBITDA +18.6% against net sales +22.2%. Management attributed it to the annualization of 2025 tariffs and reaffirmed EBITDA ahead of sales for the FULL year — so this is a quarter-level break on a year-level commitment, and 3Q26 is where it has to start reversing.' },
      { line: 'Adjusted opex levers as a share of sales', tripped: false,
        note: 'Held — 35.6% vs 36.0%, the fifth consecutive quarter of leverage.' },
      { line: 'International keeps compounding above 25%', tripped: false,
        note: 'Held comfortably at +36.6%, an acceleration from 1Q26\'s +31.6%.' },
      { line: 'No customer-concentration deterioration', tripped: false,
        note: 'Not re-disclosed quarterly; the FY2025 10-K figure (three customers, 45.7%) stands. Flagged as unverified this quarter rather than assumed good.' },
    ],
    // result: beat|miss|inline|nodisc|nocons  ·  surprise: editorial, orders the rows
    scorecard: [
      { metric: 'Beauty & Home Environment', actual: '$285.8M', yoy: '+65.3%', result: 'nocons', surprise: 90,
        note: 'The fastest line in the company for a fourth straight quarter, on skincare and fans.' },
      { metric: 'Cooking & Beverage',        actual: '$499.0M', yoy: '+36.5%', result: 'nocons', surprise: 80,
        note: 'Luxe Café espresso plus the Crispi franchise; the strongest this category has been in at least two years.' },
      { metric: 'Net sales',                 actual: '$1,765.5M', yoy: '+22.2%', result: 'nocons', surprise: 70,
        note: '13th consecutive quarter of double-digit growth and the fastest since 4Q24.' },
      { metric: 'Adjusted diluted EPS',      actual: '$1.26',   yoy: '+29.9%', result: 'nocons', surprise: 55,
        note: 'Growth above 23% in 11 of the last 12 quarters.' },
      { metric: 'Adjusted EBITDA',           actual: '$264.9M', yoy: '+18.6%', result: 'nocons', surprise: 45,
        note: '⚑ Grew slower than net sales — the red-line above.' },
      { metric: 'Food Preparation',          actual: '$458.6M', yoy: '+13.3%', result: 'nocons', surprise: 30,
        note: 'Blending was the standout; back to growth after 1Q26\'s −3.3%.' },
      { metric: 'Adjusted gross margin',     actual: '48.7%',   yoy: '−70bp',  result: 'nocons', surprise: 25,
        note: 'Tariffs, FX and retailer activations, partly offset by cost optimization, mix and the end of the JS Global sourcing fee.' },
      { metric: 'Cleaning',                  actual: '$522.0M', yoy: '+4.1%',  result: 'nocons', surprise: 20,
        note: 'The slowest of the four, again. Carpet extractors and cordless vacuums carried it.' },
      { metric: 'Channel mix (DTC share)',   actual: 'not disclosed', yoy: '—', result: 'nodisc', surprise: 60,
        note: 'The CEO declined it outright: "We don\'t break out the percentage of our D2C business." A company telling you DTC carries a structurally higher gross margin, and then not sizing it, is itself the finding.' },
    ],
    intoCall: [
      'The guide went up ~4.5pp with NO tariff-refund component in the top line — so the raise is an operating statement, not an accounting one.',
      'Adjusted EBITDA trailing net sales is the one line management has to walk back to plan, and it said it would for the full year.',
      'The international transition is declared finished — that removes an excuse as well as a drag.',
    ],
    priceReaction: 'Not compiled in this pass — the portal carries no intraday price history for SN.',
  },
};

// ── "Also on the call" — §6, two bands only: context + logged. `lead` is routed to the Watch
// List instead, never rendered here. ──────────────────────────────────────────────────────────
export var SN_CALL = {
  'Q2 2026': {
    highlights: [
      { band: 'context', t: 'TikTok Shop live in seven countries, from zero a year ago',
        d: 'Germany reached in weeks the volume that took months in the US and UK. Goal of more than doubling by holiday; 13 referenced for Q4.' },
      { band: 'context', t: 'The distributor-to-direct conversions are finished',
        d: 'Italy and Spain were the last. The Salesforce DTC platform also finished rolling out across the major international markets.', open: false },
      { band: 'context', t: 'EMEA is under 10% penetrated on a category basis',
        d: 'Management\'s own estimate. France and Germany went from a "low double-digit number of categories" to over 50% more in a year.' },
      { band: 'context', t: 'TAM put at ~$120bn, heading to $125–130bn',
        d: 'The Crispi Microwave alone added a TAM management sized at over $3bn and took the sub-category count to 40. A 41st was flagged for late 3Q26.' },
      { band: 'logged', t: 'Palantir phase two on promotions and pricing',
        d: 'A four-month build; benefits expected in Q4 for the US, UK, Germany and France. An AWS media-optimization system goes live end-September, scaling in 2027.', open: true },
      { band: 'logged', t: '"Roughly flat headcount" into 2027',
        d: 'The specific opex claim from the AI programme — "leverage compensation in a big way in 2027… not to the extent of seeing any type of large reductions."', open: true },
      { band: 'logged', t: 'Retailer inventory called too LOW, not too high',
        d: '"If anything, I think retailers could take a bit more inventory… there\'s a lot of demand to capture." A sell-in tailwind into Q4 if right.', open: true },
      { band: 'logged', t: '$99.7M of stock repurchased in the quarter',
        d: '815,233 shares at an average $122.29; 1,008,368 shares for $119.7M year to date at an average $118.71.' },
      { band: 'logged', t: 'Ulta took the Shark ChillPill',
        d: 'The first SharkNinja product there outside hair and skin care — the example management used for earning placement in categories it did not previously sell into.' },
    ],
  },
};

// ── THE WATCH LIST — §6f. OURS. Flat table, never nested per quarter. ────────────────────────
// `rank` is SORT ORDER ONLY and is never rendered. Empty `trackUntil` means the hook is OPEN.
// Dropped in v2.6 and deliberately absent: `tell`, `trigger`, `cons`.
export var SN_WL_ROWS = [
  { id: 'sn-ebitda-vs-sales', q: 'Q3 2026', rank: 1,
    theme: 'Adjusted EBITDA back ahead of net sales',
    tags: ['margin', 'tariffs', 'guidance'],
    definition: 'The company states its profitability goal as full-year Adjusted EBITDA growing faster than net sales. 2Q26 broke it at the quarter level (+18.6% vs +22.2%) and management reaffirmed the full-year commitment anyway. We are tracking whether it actually reverses, not whether it is restated.',
    trackSince: 'Q2 2026', trackUntil: '',
    seededBy: { q: 'Q2 2026', n: 1, tripped: true },
    src: 'Q2 2026 call — Quigley on the annualization of 2025 tariffs; the FY guide still implies EBITDA ahead of sales.' },

  { id: 'sn-cleaning-core', q: 'Q3 2026', rank: 2,
    theme: 'Cleaning is "growing, not flat"',
    tags: ['core', 'categories', 'thesis'],
    definition: 'The whole durability argument rests on the core being alive: management\'s words are "not flat, not managed for decline. Growing." Cleaning is the largest category and grew +4.1% and +3.4% in two of the last three quarters. If the core is really a low-single-digit business, the three-pillar arithmetic does not reach double digits.',
    trackSince: 'Q2 2026', trackUntil: '',
    src: 'Q2 2026 call prepared remarks; the category table under Top Line ▸ Other.' },

  { id: 'sn-dtc-benefit', q: 'Q3 2026', rank: 3,
    theme: 'The DTC re-platform benefit shows up in Q4 2026',
    tags: ['channel', 'dtc', 'dated-claim'],
    definition: 'Management said plainly the Salesforce benefit is NOT in the numbers yet and should appear in Q4 2026, accelerating into 2027. A dated, falsifiable promise — the kind that belongs on a list rather than in a narrative.',
    trackSince: 'Q2 2026', trackUntil: '',
    src: 'Q2 2026 call — Barrocas: "I don\'t think you\'re seeing in the numbers today the benefits… I think you\'ll start to see that in Q4 of this year."' },

  { id: 'sn-tariff-optics', q: 'Q3 2026', rank: 4,
    theme: 'The $247.1M refund is read correctly',
    tags: ['tariffs', 'accounting', 'optics'],
    definition: 'Half the refund flows through the adjusted metrics and half does not, so GAAP 3Q26 carries roughly twice the benefit. We are watching whether the print is framed on the GAAP number, and whether any of the reinvestment management promised (retail activation, media, AI, cost mitigation) is actually visible in opex.',
    trackSince: 'Q2 2026', trackUntil: '',
    src: 'Q2 2026 release and 10-Q; CBP accepted the claims in July 2026.' },

  { id: 'sn-capex-range', q: 'Q3 2026', rank: 5,
    theme: 'Capex lands inside its guided range',
    tags: ['capex', 'guidance', 'credibility'],
    definition: 'FY2025 guided $180–200M, was flagged "tracking toward the lower end" at 3Q25, and reported $146.1M — about $34M below the floor. FY2026 guides $190–210M and is "tracking toward the high end." Either the guide is loose or the definition differs from the cash-flow line; the company has not reconciled the two.',
    trackSince: 'Q2 2026', trackUntil: '',
    src: 'FY2025 10-K cash-flow statement vs. the 3Q25 and 2Q26 outlook blocks.' },

  { id: 'sn-headcount-flat', q: 'Q3 2026', rank: 6,
    theme: 'Growing on roughly flat headcount in 2027',
    tags: ['ai', 'opex', 'dated-claim'],
    definition: 'The specific cost claim attached to the AI programme. It is a 2027 statement, so it cannot be settled in 3Q26 — what we are tracking is whether the language survives contact with the 2027 planning cycle management said is already underway.',
    trackSince: 'Q2 2026', trackUntil: '',
    src: 'Q2 2026 call — "keep growing the business on roughly flat headcount as we get into 2027."' },

  { id: 'sn-channel-mix-disc', q: 'Q3 2026', rank: 7,
    theme: 'Whether DTC share ever gets disclosed',
    tags: ['channel', 'disclosure', 'silence'],
    definition: 'Management says DTC and social commerce carry a structurally higher gross margin and will grow faster than the rest of the business through 2027 — and refuses to size them. A promise-type item: the silence is the signal, and it is why this sits on the list rather than in Post-Results.',
    trackSince: 'Q2 2026', trackUntil: '',
    src: 'Q2 2026 call — "We don\'t break out the percentage of our D2C business."' },

  { id: 'sn-consensus-coverage', q: 'Q3 2026', rank: 8,
    theme: 'SN enters the consensus archive',
    tags: ['coverage', 'infrastructure'],
    definition: 'Ours, not the company\'s. Until SN is in BBG_CONSENSUS.txt there is no frozen pre-print column, so no print can be scored beat/miss and the Estimates pane stays empty. Closing this hook is what turns the whole Earnings tab on — see scripts/consensus/map_sn.json.',
    trackSince: 'Q2 2026', trackUntil: '',
    src: 'Counted from the archive, Sep 2026: eight tickers, SN not among them.' },
];

export var SN_WL_NOTE = 'The Watch List is <b>ours</b> (§6f) — it is a judgement about what matters to this desk, not a model output, and it is the one place that can say the model missed something. Rows carry only what we decided: the theme, its tags, and what it <i>means</i> in our words. An empty <b>tracking-until</b> means the hook is still open. Cards deliberately carry no numbers — <code>rank</code> is sort order only, so removing a theme never leaves a stale 1–5 behind.';

export var SN_EARN_SOURCES = 'Sources: SharkNinja Q2 2026 earnings release and call (Aug 5, 2026), Q1 2026 release (May 6, 2026), FY2025 10-K and Q4/FY2025 release — all retrieved through Quartr and frozen. Street consensus is derived at render time from the Bloomberg (BST) FA_SN company-financials export, Sep 2026 snapshot, read out of js/results-data/sn.js. No Summit DCF model exists for SN, so every Summit cell is empty by construction.';

// ── the quarter selector, newest/upcoming first (§6) ────────────────────────────────────────
// `period`/`prior` address js/results-data/sn.js so Street values and the YoY base are read
// through, never copied. A quarter with no SN_RESULTS entry simply has no Post-Results phase —
// the pill carries `data-ceqhas` and the phase machinery hides it there.
export var SN_CE_QUARTERS = [
  { q: 'Q3 2026', status: 'upcoming', date: 'Nov 5, 2026', period: '3Q26', prior: '3Q25', prevQ: '2Q26' },
  { q: 'Q2 2026', status: 'reported', date: 'Aug 5, 2026', period: '2Q26', prior: '2Q25', prevQ: '1Q26' },
  { q: 'Q1 2026', status: 'reported', date: 'May 6, 2026', period: '1Q26', prior: '1Q25', prevQ: '4Q25' },
];

// ── per-metric caveats, keyed by the label shown on the cell ─────────────────────────────────
// Rendered behind the `?` on each Setup cell (§6's ceQ pop-ups). A cell without an entry says so
// rather than showing an empty popover.
export var SN_CE_NOTES = {
  'Revenue': 'Total net sales. SharkNinja does <b>not guide by quarter</b> — the FY2026 guide of +16.0-17.0% is the only company number in play and it is annual. See Evolution &#9656; Guidance.',
  'Gross profit': 'GAAP gross profit. The adjusted figure differs by the Product Procurement Adjustment and, through Jul 2025, the JS Global sourcing service fee.',
  'Operating income': 'GAAP operating income. The Street implies a large YoY step; 3Q25 carried no tariff annualization, so the base is not clean.',
  'EBITDA': '<b>Adjusted</b> EBITDA — the line the company guides. Its stated goal is full-year Adj. EBITDA growing FASTER than net sales; 2Q26 ran against that (+18.6% vs +22.2%) on tariff annualization.',
  'EPS (diluted)': '<b>Adjusted</b> diluted EPS, the basis SharkNinja guides and headlines. GAAP diluted EPS is a separate line and the two diverge on share-based comp and FX. Note the Street models FY2026 at $6.59, ABOVE the company\'s guided $6.45-6.55.',
  'D&A': 'Depreciation and amortization. Low relative to revenue because the company owns no factories — see Bottom Line &#9656; Supply Chain.',
  'Cleaning': 'The largest category and the slowest-growing: +4.1% in 2Q26 and +3.4% in 4Q25. The diversification argument rests on this being "growing, not flat".',
  'Cooking & Beverage': 'Luxe Cafe espresso and the Crispi franchise. The Crispi Microwave launched Jul 2026 and lands in this line from 3Q26.',
  'Food Preparation': 'The lumpiest line in the business — +52.8% in 2Q25, -3.3% in 1Q26, +13.3% in 2Q26. Frozen drinks (SLUSHi) drive the swing.',
  'Beauty & Home Environment': 'Fastest grower for four straight quarters (+65.3% in 2Q26) and the most seasonal — fans peak in Q2/Q3, which is why the Street models a step DOWN from 2Q26.',
  'Domestic net sales': 'Includes Canada, which fell 17% in 2Q26 on the remaining transition while the US grew 18%. The segment total understates the US.',
  'International net sales': 'The distributor-to-direct conversions finished in 2Q26, so 3Q26 is the first quarter with no conversion drag in the base.',
};
