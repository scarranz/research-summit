// overviews/sharkninja-bottomline.js — the Bottom Line data for SharkNinja.
//
// ── WHY THERE IS NO js/overviews/sn-bbg.js ───────────────────────────────────────────────────
// docs/PANE_CATALOG.md §2 says Bottom Line's data file is GENERATED: run
// `scripts/bbg_extract.py` against BBG_CONSENSUS.txt for the ticker. SN is not in that archive
// (eight tickers, checked Sep 2026), so the generator cannot run and there is no `snBBG` to port
// `aMarginsBody`/`aBridgeBody` against.
//
// What SN has instead is the Bloomberg FA_SN company-financials export, already parsed into
// js/results-data/sn.js. So every P&L series on this tab is READ THROUGH from snResults at render
// time rather than hand-copied into a second file — the same discipline the Earnings Setup grid
// uses, and it means Bottom Line cannot drift from Results. Only the lines snResults does not
// carry are declared here, and each says where it came from.
//
// When SN lands in BBG_CONSENSUS.txt, `bbg_extract.py` can generate a real snBBG and this file
// shrinks to whatever that export still lacks. Nothing here needs to be thrown away first.

import { snResults } from '../results-data/sn.js';

export var SN_BL_YEARS = ['2022', '2023', '2024', '2025'];

// Read an annual series out of the Results dataset, aligned to SN_BL_YEARS.
export function blSeries(key, field){
  var m = snResults.views.y.metrics[key];
  if (!m) return SN_BL_YEARS.map(function(){ return null; });
  return SN_BL_YEARS.map(function(y){
    var i = m.periods.indexOf(y);
    return (i >= 0 && m[field] && m[field][i] != null) ? m[field][i] : null;
  });
}

// ── the lines snResults does NOT carry ───────────────────────────────────────────────────────
// $M, aligned to SN_BL_YEARS. Sources are per-line, because they differ.
export var SN_BL_EXTRA = {
  capex:       { label: 'Capital expenditures', v: [80.3, 122.7, 137.7, 146.1],
                 src: 'FY2025 10-K cash-flow statement (FY2023–FY2025); FY2022 from a secondary aggregator, cross-checked against the D&A trend.' },
  fcf:         { label: 'Free cash flow',       v: [124.7, 157.9, 308.9, 488.1],
                 src: 'Bloomberg FA_SN export, cross-checked to the 10-K and press releases (FY2024/FY2025 tie exactly).' },
  cfo:         { label: 'Cash flow from operations', v: [205.0, 280.6, 446.6, 634.1],
                 src: 'FY2024 and FY2025 are disclosed ($446.6M / $634.1M). FY2022 and FY2023 are DERIVED as capex + FCF and are marked as such — not a disclosed figure.',
                 derived: [true, true, false, false] },
  sbc:         { label: 'Stock-based compensation', v: [null, null, 84.5, 43.9],
                 src: 'FY2024 and FY2025 only, from the FY2026 proxy and the FY2025 10-K. Earlier years were not compiled — blank, never zero.' },
  cash:        { label: 'Cash & equivalents',   v: [192.9, 154.1, 363.7, 777.3],
                 src: 'Balance sheets in the quarterly releases and the 10-K.' },
  inventories: { label: 'Inventories',          v: [548.6, 699.7, 900.0, 1002.2],
                 src: 'Balance sheets in the quarterly releases and the 10-K.' },
  totalDebt:   { label: 'Total debt',           v: [437.5, 810.0, 775.5, 736.1],
                 src: 'F-1/424B3 registration statement (FY2022–FY2023); Q4/FY2025 release balance sheet (FY2024–FY2025). Excludes unamortized deferred financing costs.' },
};

// ── the General picker (§2: "4 nested views + the expense-line collapsible") ──────────────────
// SN gets a fifth: balance sheet & cash flow. AMZN keeps that out of Bottom Line because its
// Supply Chain sub-tab carries the working-capital story; SN has no SPLC export, so the balance
// sheet would otherwise have no home on this tab.
export var SN_BL_VIEWS = [
  ['margins', 'Profitability & margins'],
  ['bridge',  'The cost walk — revenue → operating income'],
  ['net',     'Operating income → net income'],
  ['sbc',     'Stock-based compensation'],
  ['bs',      'Balance sheet & cash flow'],
];

export var SN_BL_LEDE = 'Where SharkNinja\'s revenue stops being revenue. Every P&L series here is read through from the same dataset the Results tab uses, so the two cannot disagree. Pick one view — the rest stay tucked away.';

export var SN_BL_MARGIN_STORY_V2 = 'Every margin line has expanded every year since FY2022 — gross margin <b>+11.1pp</b> and operating margin <b>+5.7pp</b> over three years. The company does not decompose the gross-margin gain, but three drivers are on the record: mix shift toward higher-margin categories, the end of the JS Global sourcing service fee (Jul 31, 2025), and cost optimization — against tariffs pushing the other way. The <b>operating</b> margin has expanded faster than gross in the last two years, which is the opex-leverage story rather than a pricing one.';

// ── the bridge: revenue → operating income ───────────────────────────────────────────────────
// COGS is DERIVED (revenue − gross profit) because the dataset carries gross profit, not COGS.
export var SN_BL_BRIDGE_NOTE = 'Read left to right: every dollar of net sales, and what it is consumed by before it becomes operating income. <b>Cost of sales is derived</b> as revenue minus gross profit — the dataset carries gross profit, not COGS. The four expense lines are as reported.';

export var SN_BL_BRIDGE_READ = 'The shape of the walk has changed more than its size. <b>Cost of sales</b> fell from 62.1% of net sales to 51.0% across the four years — that is the whole gross-margin story in one line. But the saving did not drop to the bottom: <b>S&amp;M rose from 16.7% to 22.8%</b>, absorbing most of it. What actually produced the operating-margin expansion is <b>G&amp;A leveraging down</b> (6.8% → 6.1%, and 7.8% → 6.1% in the last two years alone) while R&amp;D held roughly flat. So this is a business that reinvested its gross-margin gain into demand generation and paid for its operating leverage out of overhead.';

// ── operating income → net income ────────────────────────────────────────────────────────────
export var SN_BL_NET_NOTE = 'SharkNinja\'s dataset carries operating income, the effective tax rate and GAAP net income, but <b>no interest or non-operating lines</b>. So the step between them is shown as a single <b>non-operating residual</b>, derived as pre-tax income (net income ÷ (1 − tax rate)) minus operating income. It is honest as a residual and must not be read as an interest expense: it bundles interest, FX and everything else below the operating line. When SN enters the consensus archive, <code>bbg_extract.py</code> emits the individual lines and this collapses into a real bridge.';

export var SN_BL_NET_READ = 'The residual is consistently <b>negative and large</b> — the cost of a leveraged spin-off. Total debt roughly doubled to $810M to fund the separation from JS Global and has been paying down since, and the interest on it is the main thing standing between operating income and net income. The other mover is tax: the effective rate fell to <b>22.1%</b> in FY2025 from 23.4%, which the company attributes to "one-time benefits recorded in the fourth quarter" without sizing them.';

// ── SBC ──────────────────────────────────────────────────────────────────────────────────────
export var SN_BL_SBC_NOTE = 'Only two years are on file, so this is a short series and is drawn as one — never extended with zeros. <b>SBC fell 48%</b>, from $84.5M in FY2024 to $43.9M in FY2025, and the FY2025 release names a $43.1M decrease in share-based compensation as the single largest driver of G&amp;A falling 10%. That is most of the operating-margin expansion in one line, and it is not a recurring source: a decline of that size cannot repeat from a $43.9M base. Worth holding against the 2Q26 print, where GAAP G&amp;A rose 40.8% YoY driven by a $22.6M <i>increase</i> in share-based compensation — the line has already turned.';

// ── expense lines — the collapsible (§2's expenseTabsBody, at SN's scale) ────────────────────
// AMZN runs six functional lines; SN reports three, so this is three. Composition is the
// company's own language from the releases, not a reconstruction.
export var SN_BL_EXPENSE_LINES = [
  { k: 'sm', label: 'Selling & Marketing', metric: 'sm',
    what: 'The largest expense line after cost of sales, and the one that has grown fastest as a share of net sales (16.7% → 22.8%, FY2022–FY2025).',
    composition: 'Per the releases, the recurring components are <b>delivery and distribution costs</b> (volume, mix and fuel), <b>advertising</b>, <b>personnel</b> supporting new product launches and new markets, <b>credit-card processing and merchant fees</b>, professional and consulting fees, and product samples for marketing and social commerce.',
    drivers: 'Two structural pressures: growth is being bought (category expansion and new markets both land here), and the DTC/social-commerce shift moves fulfilment and payment costs onto SharkNinja that a retailer used to absorb — the credit-card and merchant-fee line only exists because of it. The offset management points to is that those same channels carry a higher gross margin.',
    watch: 'Whether S&amp;M finally levers. Adjusted opex as a whole has levered five quarters running, but S&amp;M specifically was flat as a percentage of net sales in 2Q26 — flat, not down.' },
  { k: 'ga', label: 'General & Administrative', metric: 'ga',
    what: 'The line that actually produced the operating-margin expansion: 7.8% of net sales in FY2024 to 6.1% in FY2025.',
    composition: 'Personnel (including share-based compensation), legal fees, professional and consulting fees, technology support costs for cloud computing, credit-card processing, and transaction-related costs.',
    drivers: 'The FY2025 fall of 10.0% was driven by a <b>$36.8M</b> decrease in personnel costs — of which <b>$43.1M</b> was share-based compensation — plus a <b>$32.3M</b> decrease in legal fees, including <b>$36.0M</b> less in litigation costs. Both are one-time-ish: an SBC step-down off an elevated post-spin base, and litigation that closed.',
    watch: '⚑ This is the line most likely to reverse. In 2Q26 GAAP G&amp;A rose <b>40.8%</b> YoY on a $30.3M personnel increase, of which $22.6M was share-based compensation — the exact driver that fell in FY2025, running the other way.' },
  { k: 'rd', label: 'Research & Development', metric: 'rd',
    what: 'The product-refresh engine, and the most stable line on the page: 5.8–6.2% of net sales across four years.',
    composition: 'Overwhelmingly personnel — 1,000+ cross-functional engineers and designers — plus prototypes and testing, professional and consulting fees, and consumer-insight initiatives.',
    drivers: 'FY2025 rose 7.8% to $368.1M on $38.8M more personnel and $4.4M more prototypes/testing, partly offset by $12.2M less in consulting. Spend grows with headcount to support new categories and markets; it has not needed to spike to deliver 25 launches a year.',
    watch: 'The AI claim. Management says AI is compressing the "fuzzy front end" of product development from months to weeks. If true, R&amp;D intensity should hold or fall while the sub-category count keeps rising — it went 38 → 40 → 41 without R&amp;D intensity rising.' },
];

export var SN_BL_EXPENSE_NOTE = 'AMZN\'s equivalent runs six functional lines because it discloses six. SharkNinja reports three operating expense lines, so this is three — not a reduced version of the same pane. Composition and drivers are the company\'s own language from the quarterly releases; the "what to watch" line is this desk\'s.';

// ── Supply Chain ─────────────────────────────────────────────────────────────────────────────
// §2 says skip this sub-tab when the ticker is not a subject in an SPLC export. SN is not — so
// this is NOT the SPLC supplier census AMZN ships. It is the disclosed supply chain, which for an
// asset-light outsourced manufacturer is a genuine Bottom Line story: it is where the gross
// margin is made and where the tariff line hits.
export var SN_SC_DIVERGENCE = 'AMZN\'s Supply Chain sub-tab is a <b>Bloomberg SPLC supplier census</b> — supplier count, facility count, geographic concentration, largest relationship. SharkNinja is not a subject company in any SPLC export we hold, and <code>PANE_CATALOG.md</code> §2 says to skip the sub-tab entirely in that case. This is <b>not</b> that pane and does not pretend to be. What it carries instead is the supply chain SharkNinja <i>discloses</i> — which for a company that owns no factories is where the gross margin is actually made, and where the single largest identified margin pressure lands.';

export var SN_SC_KPIS = [
  { v: '100%', l: 'Of products made by third parties', s: 'the company owns no factories' },
  { v: '6', l: 'Manufacturing countries', s: 'China, Vietnam, Malaysia, Thailand, Indonesia, Cambodia' },
  { v: '2.3%', l: 'Capex as a share of net sales', s: 'FY2025 — the asset-light consequence' },
  { v: '49.0%', l: 'Gross margin, FY2025', s: 'up from 37.9% in FY2022' },
];

export var SN_SC_TENK = 'Although we do not manufacture any of our own products, we have relationships with various third-party suppliers… primarily based in China… Vietnam, Malaysia, Thailand, Indonesia and Cambodia.';
export var SN_SC_TENK_WHERE = 'FY2025 Form 10-K, Item 1 — Manufacturing';

// [country, assumed 2026 tariff rate, note]
export var SN_SC_TARIFFS = [
  ['China', '12.5%', 'Raised from 10% during 2026. Historically the primary manufacturing base.'],
  ['Vietnam', '12.5%', 'Raised from 10% during 2026.'],
  ['Thailand', '12.5%', 'Raised from 10% during 2026.'],
  ['Indonesia', '10%', 'Assumed minimum rate.'],
  ['Malaysia', '10%', 'Assumed minimum rate.'],
  ['Cambodia', '10%', 'Assumed minimum rate.'],
];
export var SN_SC_TARIFF_NOTE = 'These are the company\'s <b>own outlook assumptions</b>, held constant for the remainder of 2026 — not a forecast of policy and not this desk\'s view. The per-country split is why the exposure is not a single-country risk: the deck calls the network "diversified… allowing us to nimbly adapt to policy changes, such as tariff changes," with dual-sourcing on key products.';

export var SN_SC_MARGIN_LINK = 'The connection to the numbers above is direct. Adjusted gross margin fell <b>70bp</b> YoY in 2Q26 to 48.7%, and the company names US tariff cost first among the causes, ahead of FX and retailer activations. Management framed the drag as mostly the <b>annualization</b> of 2025 tariffs rather than new cost — which is why it should fade rather than compound. Running the other way: $247.1M of refund claims were accepted by US CBP in July 2026 and land in 3Q26 as a reduction of cost of sales (see Miscellaneous ▸ Other Analysis for why GAAP will carry roughly twice the benefit the adjusted numbers do).';

export var SN_BL_SOURCES_V2 = 'Sources: js/results-data/sn.js (the Bloomberg FA_SN company-financials export, Sep 2026 snapshot) for every P&L series, read through rather than copied; the FY2025 Form 10-K and the quarterly earnings releases for capex, cash flow, balance-sheet lines and the expense-line composition language; the FY2026 proxy for stock-based compensation; the August 2026 investor presentation for the manufacturing footprint. Cost of sales and the non-operating residual are DERIVED and labelled as such wherever they appear.';
