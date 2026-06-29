// overviews/bbb.js — custom Overview for BBB Foods Inc. (NYSE: TBBB / "Tiendas 3B")
// Built individually per the portal's per-company Overview model (see CLAUDE.md).
//
// This module renders internal sub-tabs inside the Overview pane:
//   1. Overview              — company profile (FY2025 Form 20-F figures, MXN / Ps.)
//   2. Stores                — nested sub-tabs: SSS (vs. ANTAD) and Store Growth
//   3. Competitive Landscape — 3B vs. Neto vs. BARA (see ./bbb-landscape.js)
//   4. Product Mix / Unit Economics
// The company does not report EBITDA in its filing text, so it is intentionally omitted.

import { bbbLandscape } from './bbb-landscape.js';
import { bbbBim } from './bbb-bim.js';
import { bbbManagement } from './bbb-management.js';
import { bbbLogistics } from './bbb-logistics.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Snapshot & narrative ────────────────────────────────────────────────────
var SNAPSHOT = [
  ['Listing', 'NYSE: TBBB'],
  ['Brand', 'Tiendas 3B'],
  ['HQ', 'Mexico City, Mexico'],
  ['IPO', 'Feb 2024 · NYSE'],
  ['Founder · Chair · CEO', 'K. Anthony Hatoum'],
  ['Employees', '29,202 (FY2025)'],
];

var DESC = 'BBB Foods (Tiendas 3B) is the pioneer and leader of the grocery hard-discount model in Mexico. The "3B" name stands for "Bueno, Bonito y Barato" — Good, Nice and Affordable. It sells a deliberately limited assortment of roughly 850–900 SKUs — branded, private-label and rotating "spot" products — at market-leading prices through small neighborhood stores that low-to-middle-income households visit three to four times a week.';

// Headline KPIs — FY2025 (year ended Dec 31, 2025). All from the 20-F.
var KPIS = [
  { l:'Total Revenue',     v:'Ps.78.2B', d:'+36% YoY',    dir:'up' },
  { l:'Same-Store Sales',  v:'+18.3%',   d:'FY2025',      dir:'up' },
  { l:'Stores',            v:'3,346',    d:'+574 net new', dir:'up' },
  { l:'Gross Margin',      v:'16.2%',    d:'16.3% FY24',  dir:'muted' },
];
var AS_OF = 'Figures are in Mexican pesos (Ps.) unless noted. Headline metrics are for the fiscal year ended December 31, 2025 (FY2025), per the company\'s annual report on Form 20-F.';
var FY_NOTE = 'FY2025: total revenue Ps.78.2B (+36%) · gross profit Ps.12.6B (16.2% margin) · 825M transactions (+23%) · average ticket Ps.94.9 (+11%). The company reported a net loss of Ps.2.84B (vs. a Ps.0.33B profit in FY2024), driven primarily by a one-time, non-cash share-based compensation charge of ~Ps.2.93B tied to RSUs granted under its Liquidity Event Share Plan, plus an FX translation loss and strategic investment in new regions.';

var HOW_MONEY = [
  'Sells a limited assortment (~<b>850–900 SKUs</b>) of everyday groceries at the lowest sustainable price. Revenue is overwhelmingly retail merchandise sales, plus a tiny stream from recyclables.',
  'Profit comes from a <b>low-margin, low-cost</b> model: gross margin ~<b>16%</b>, with disciplined sales expenses (~10.4% of revenue) and lean administration.',
  'A heavy <b>private-label mix</b> (58.2% of sales in 2025) improves customer value and economics; high sales-per-SKU gives strong negotiating power with suppliers.',
  '<b>Negative working capital</b> (a 2.9× payable-days-to-inventory-days ratio in 2025) means suppliers partly finance each new store.',
  'Growth = <b>store-footprint expansion</b> plus durable <b>double-digit same-store-sales</b> growth.',
];

// Product mix — single reportable segment; categories with FY2025 (vs FY2024) sales share.
var SEGMENTS = [
  ['Private label — 58.2% of sales', 'Own-developed brands: 113 private-label brands across 525+ SKUs, outsourced to 179+ vetted manufacturers. Comparable or better quality than branded equivalents at lower cost. Up from 53.6% in 2024.'],
  ['Branded — 35.9% of sales', 'Well-known national and international brands offered at the lowest sustainable price to attract customers and drive traffic. Down from 40.6% in 2024 as private label grows.'],
  ['Spot products — 5.7% of sales', 'Opportunistic food and non-food deals in limited quantities; the selection rotates roughly every two weeks. Steady at ~5.7% of sales.'],
];

var TIMELINE = [
  ['2004', 'Company incorporated (British Virgin Islands); founder <b>K. Anthony Hatoum</b> sets out to build a hard discounter in Mexico.'],
  ['2005', 'Opens its <b>first Tiendas 3B store</b> in Mexico City (Feb); launches its first private label, <b>LactiBu</b>, in May.'],
  ['2021', 'Reaches <b>1,500 stores</b> as the model scales across central Mexico.'],
  ['Feb 2024', '<b>IPO on the NYSE</b> under ticker <b>TBBB</b> — becomes a publicly traded company.'],
  ['2025', 'Opens a new store roughly <b>every 15.3 hours</b>; ends the year with <b>3,346 stores, 20 distribution centers and 29,202 employees</b>; named by the Financial Times among the fastest-growing companies in the Americas.'],
];

// Footprint & store model stats + detail rows.
var FOOTPRINT = {
  stats: [
    ['3,346', 'Stores'],
    ['20', 'Distribution centers'],
    ['29,202', 'Employees'],
  ],
  rows: [
    ['Store format', 'Standardized neighborhood stores, mostly 300–450 m² (~55.7% of the base); red-and-green façades. Rent is fixed, inflation-linked and averages ~2.0% of a store\'s sales.'],
    ['Distribution', 'Decentralized into autonomous regions, each built around a distribution center that serves up to ~200 stores within a ~150 km radius, using cross-docking and its own truck fleet.'],
    ['Customer', 'Low-to-middle-income households visiting ~3–4 times per week. FY2025: 825M transactions (+23%), average ticket Ps.94.9 (+11%).'],
  ],
};

// Financial performance — FY2024 vs FY2025 (P&L), all from the 20-F.
var FINANCIALS = [
  ['Total revenue',            'Ps.57.4B',        'Ps.78.2B (+36%)'],
  ['Gross profit',             'Ps.9.38B',        'Ps.12.64B (+35%)'],
  ['Gross margin',             '16.3%',           '16.2%'],
  ['Cost of sales (% revenue)','83.7%',           '83.8%'],
  ['Operating profit / (loss)','Ps.1.33B (2.3%)', '(Ps.0.68B) (-0.9%)'],
  ['Net profit / (loss)',      'Ps.0.33B',        '(Ps.2.84B)'],
];
var FIN_NOTE = 'The FY2025 operating and net loss is driven by a one-time, non-cash share-based-compensation charge (~Ps.2.93B) recognized on RSUs granted under the Liquidity Event Share Plan, an FX translation loss on US-dollar IPO proceeds, and investment in new regions — not by a deterioration of the core store economics (revenue +36%, gross margin ~flat at 16.2%).';

// The negative-working-capital / efficiency engine.
var ENGINE = [
  'Suppliers are paid on longer terms than it takes inventory to sell — a <b>2.9× payable-days-to-inventory-days</b> ratio in 2025 — so each new store is partly financed by suppliers.',
  'This <b>negative working capital</b> dynamic, combined with low capex per store, lets 3B <b>self-fund</b> rapid expansion.',
  'Ever-increasing purchase scale per SKU → lower supplier prices → lower shelf prices → more customer loyalty and sales — the company\'s <b>"virtuous cycle of efficiency."</b>',
];

var PEERS = [
  ['Walmart de México (Bodega Aurrerá)', 'Largest retailer in Mexico; Bodega Aurrerá / Mi Bodega target value shoppers with a broad assortment.', '3B is a pure hard-discounter with far fewer SKUs and smaller neighborhood stores — deeper everyday-low-price focus and faster rollout.'],
  ['Tiendas Neto', 'Domestic hard-discount chain — the closest direct competitor in format.', 'Head-to-head on the hard-discount model; 3B competes on private-label depth, scale and store economics.'],
  ['Chedraui / Soriana', 'Large supermarket and hypermarket operators.', 'Full-assortment supermarkets; 3B undercuts on price for daily essentials with a convenience-led small-store network.'],
  ['OXXO (FEMSA)', 'Dominant convenience-store network (20k+ stores).', 'Convenience and impulse at premium prices; 3B is destination grocery value, not impulse.'],
  ['Traditional "tienditas"', 'Fragmented independent mom-and-pop corner stores — still the bulk of Mexican grocery.', 'The primary share-donor: 3B offers similar convenience at materially lower prices, structurally taking share.'],
];

var TAILWINDS = [
  'Huge white space — 3B sees room for about <b>14,000 stores</b> in Mexico (vs ~3,346 today).',
  'Structural shift from fragmented mom-and-pop stores to organized <b>hard discount</b>.',
  'Inflation and budget pressure on low-to-middle-income households favor <b>everyday-low-price</b> formats.',
  'Private-label penetration still rising (<b>58%+ and climbing</b>) — lifts both value and margin.',
  'Negative working capital + low capex per store = <b>self-funded, capital-efficient</b> growth.',
];

var HEADWINDS = [
  'Inherently <b>low gross margins</b> (~16%) leave little room for operating missteps.',
  'Rapid expansion strains real estate, distribution capacity and the talent pipeline.',
  'Share-based compensation and strategic investment pressured FY2025 GAAP profitability (net loss).',
  'FX exposure on US-dollar IPO proceeds creates accounting volatility (a stronger peso = translation losses).',
  'Competition from Walmart (Bodega Aurrerá), Tiendas Neto and others; wage and rent inflation.',
];

// White-space / scale opportunity.
var TAM = [
  { v:'~14,000',     l:'Store white space',           s:'Total stores 3B sees room for in Mexico (vs 3,346 today).' },
  { v:'3,346',       l:'Stores today (FY2025)',       s:'Up from 1,500 at end-2021 — a 22.2% store CAGR.' },
  { v:'~every 15.3h',l:'New-store pace (2025)',       s:'Faster than any other grocery retailer in Mexico.' },
  { v:'58.2%',       l:'Private-label share',         s:'Up from 53.6% in 2024 — a core value and margin lever.' },
];

var DRIVERS = [
  ['Store expansion', 'Open new stores at a rapid, capital-efficient pace toward the ~14,000-store white-space opportunity.'],
  ['New regions', 'Stand up new autonomous regions (each a DC plus up to ~200 stores) to extend geographic reach.'],
  ['Private-label deepening', 'Grow the 113-brand / 525-SKU private-label range to lift value and unit economics.'],
  ['Same-store-sales growth', 'Sustain double-digit SSS via more transactions and higher tickets (items per basket).'],
  ['Operating efficiency', 'Protect the low-cost model and negative-working-capital engine as scale compounds.'],
];

var LEADERSHIP = [
  ['K. Anthony Hatoum', 'Founder, Chairman & CEO — started Tiendas 3B in 2004–05; a serial entrepreneur with prior hard-discount experience.'],
  ['Eduardo Pizzuto', 'Chief Financial Officer — with the company since 2007; previously at Nestlé Purina.'],
  ['Diego Apalategui', 'Director of Sales & Operations — joined in December 2004; earlier helped scale retailer EKI to 250 stores.'],
];

var SOURCES = 'Sources: BBB Foods Inc. (NYSE: TBBB) FY2025 annual report on Form 20-F (year ended December 31, 2025) — Business Overview and Operating & Financial Review. All figures in Mexican pesos (Ps.) unless stated; the FY2025 net loss reflects a one-time, non-cash share-based-compensation charge. Peer descriptions summarize public information.';

// ─── Same Store Sales (SSS) — quarterly, TBBB vs. ANTAD ───────────────────────
// Replicates the "Same Store Sales Growth vs. ANTAD" chart in the earnings decks.
// 4Q23–4Q24 from the 4Q24 presentation; 1Q25–1Q26 from the 1Q26 presentation.
// ANTAD = 3-month average (total ANTAD basis in the 4Q24 deck; ANTAD Self-Service
// basis in the 1Q26 deck). TBBB SSS = stores operational for ≥12 months. Percentages.
var SSS_Q     = ['4Q23','1Q24','2Q24','3Q24','4Q24','1Q25','2Q25','3Q25','4Q25','1Q26'];
var SSS_TBBB  = [ 14.9,  14.8,  10.7,  11.6,  11.8,  13.5,  17.7,  17.9,  16.6,  16.0 ];
var SSS_ANTAD = [  4.5,   6.9,   4.0,   3.2,   2.6,   0.6,   2.5,   1.1,   1.5,   1.4 ];
var SSS_NOTE  = 'Quarterly Same Store Sales growth (%, vs. the same quarter a year earlier). TBBB has outpaced the broader Mexican self-service market (ANTAD) in every quarter shown. Source: BBB Foods 4Q24 (4Q23–4Q24) and 1Q26 (1Q25–1Q26) earnings presentations; ANTAD is a 3-month average. TBBB measures stores operational for at least the full preceding 12 months.';

var _chartSSS = null;

// ─── Store count growth (annual, year-end; 2026–2028 estimated) ───────────────
var STORE_YEARS     = ['2020','2021','2022','2023','2024','2025','2026E','2027E','2028E'];
var STORE_COUNT     = [ 1249,  1500,  1892,  2288,  2772,  3346,  3977,   4690,   5540 ];
var STORE_FIRST_EST = 6; // index of the first estimated year (2026E)
var STORE_NOTE      = 'Year-end total store count. 2020–2025 are actuals (FY2025 Form 20-F and company disclosures); 2026E–2028E are estimates (lighter bars). Drag the two handles to choose a window — the bars, YoY growth and CAGR update to that range.';
var _chartStores = null;

function storeYoY(i){ return i <= 0 ? null : (STORE_COUNT[i] / STORE_COUNT[i-1] - 1) * 100; }
function storeCAGR(a, b){ return b <= a ? null : (Math.pow(STORE_COUNT[b] / STORE_COUNT[a], 1 / (b - a)) - 1) * 100; }

// ─── Expansion vs. OXXO at the same company age ───────────────────────────────
// Stores by years-since-first-store. OXXO opened its first store in 1978, Tiendas 3B
// in 2005, so the columns line up the two chains at equal age (15 / 20 / 25 / 30 yrs).
var VS_AGES     = ['15 years','20 years','25 years','White space'];
var VS_OXXO     = [  500,  1000,  2900,  null ];   // OXXO Mexico stores (1993 / 1998 / 2003); no age-4 comparison
var VS_OXXO_EST = [ true, false,  true, false ];   // 1998 reported by FEMSA; 1993 & 2003 estimated
var VS_3B       = [ 1249,  3346,  7500, 14000 ];   // 3B: 2020/2025 actual; ~yr25 (2030) projected; white-space target
var VS_3B_EST   = [ false, false,  true,  true ];  // 25-yr projected; final point = stated white-space opportunity
var OXXO_CLR    = '#E8A200';                        // OXXO brand yellow/gold (readable on white)
var VS_CTX = [
  '<b>OXXO</b> (FEMSA) is the benchmark for store rollout in Mexico — the largest convenience chain in the Americas. From its first store in <b>1978</b> it reached <b>1,000 stores by 1998</b> (20 years), <b>6,374 by 2008</b> (30 years), and more than <b>22,000 in Mexico</b> today.',
  '<b>Tiendas 3B</b> (first store <b>2005</b>) runs a similar neighborhood-density playbook in hard-discount grocery — and is scaling <b>faster at the same age</b>: <b>3,346 stores at year 20</b> vs OXXO\'s ~1,000, roughly <b>3×</b>.',
  'In 2025, 3B opened a new store about every <b>15.3 hours</b> — faster than any other grocery retailer in Mexico.',
  'On its current trajectory 3B could reach roughly <b>7,500 stores by year 25</b> (2030), and management sees <b>white space for about 14,000 stores</b> in Mexico — well above the <b>3,346</b> it runs today.',
];
var VS_NOTE = 'Stores at the same company age (years since each chain\'s first store: OXXO 1978, Tiendas 3B 2005). OXXO Mexico stores shown for 1993 (~500), 1998 (1,000) and 2003 (~2,900): 1998 is reported by FEMSA; 1993 and 2003 are estimates interpolated from FEMSA\'s disclosed history (~250 stores in 1987, 1,000 in 1998, 6,374 in 2008). OXXO has since grown to ~22,000 stores in Mexico over ~48 years. Tiendas 3B — the 15- and 20-year points are actuals (1,249 in 2020; 3,346 in 2025); the 25-year point is a projection (~7,500 by 2030, holding 3B\'s ~21.8% store CAGR); the final point is management\'s stated white-space opportunity of ~14,000 stores in Mexico (vs ~3,346 today). Sources: FEMSA annual reports & investor presentations; BBB Foods FY2025 Form 20-F.';
var _chartVs = null;

// ─── Product mix: private label vs. branded (share of sales) ───────────────────
// User-provided private-label %; branded is the remainder to 100% (i.e. branded +
// spot products folded together), so it differs slightly from the 3-way split on
// the Overview tab.
var MIX_YEARS = ['2022','2023','2024','2025'];
var MIX_PL    = [42.8, 46.4, 53.5, 58.2];                                        // private label % of sales
var MIX_BR    = MIX_PL.map(function(p){ return Math.round((100 - p) * 10) / 10; }); // branded = remainder
var MIX_NOTE  = 'Share of merchandise sales. Here "branded" is all non-private-label sales (branded plus spot products), so it differs slightly from the three-way breakdown on the Overview tab. Private label has climbed from 42.8% of sales in 2022 to 58.2% in 2025 — overtaking branded in 2024 — as 3B widens its own-brand range (113 brands, 525+ SKUs). Sources: BBB Foods earnings disclosures and FY2025 Form 20-F.';
var _chartMix = null;

// ─── Unit economics (per single store) ────────────────────────────────────────
// Figures in Mexican pesos. Sales/store and negative-WC % are from the FY2025 20-F
// and the 4Q24/1Q26 decks; capex per store is derived from the FY2026 budget.
var UE_STEPS = [
  { n:'1', t:'Suppliers deliver on credit', d:'3B receives its products and pays nothing yet — suppliers give it about 2 months (~59 days) to pay.' },
  { n:'2', t:'It sells fast, for cash',     d:'Shoppers buy the goods within about 3 weeks and pay in cash on the spot, so the money comes in almost right away.' },
  { n:'3', t:'It pays suppliers later',     d:'3B only settles the bill about 2.9× later. In between it keeps — and spends — that cash to open new stores.' },
];
var UE_ANALOGY = 'Think of a fruit stand that sells all its fruit by Friday but doesn\'t pay the farmer until next month. For those weeks it holds and uses money it hasn\'t paid out yet. Multiply that across <b>3,346 stores</b> and ~<b>Ps.78B</b> of yearly sales and it becomes a large, <b>free source of funding</b> for opening new stores.';

// New-store first-year sales by vintage (median 12-month sales per store, real Ps. MM).
// Approximate reads from the company's "Median Sales per Store by Vintage" chart (4Q24 deck).
var UE_VINT_YEARS  = ['2008','2012','2016','2020','2023','2025'];
var UE_VINT_SALES  = [ 5.5,   7.0,   9.5,   11.5,  14.5,  16.0 ];
var UE_VINT_MATURE = 25; // approx. sales per store at maturity (Ps. MM)

// What it costs to open a store.
var UE_STORE_COST = '~Ps.5–6M';
var UE_COST_DESC  = 'Covers leasehold improvements, refrigeration, shelving, equipment and signage — deliberately low for a hard-discount format. The store\'s negative working capital (~Ps.2.5M of supplier financing) covers roughly half of that, and its own cash flow pays back the rest quickly, so expansion is largely self-funded.';
var UE_COST_NOTE  = 'Cost to open a store estimated from the company\'s FY2026 capital-expenditure budget of ~Ps.3,555M for new stores, spread over a store-opening pace of ~580–600 per year (≈Ps.5–6M each). Source: BBB Foods FY2025 Form 20-F.';

var UE_VINT_NOTE = 'New-store productivity keeps rising: a store\'s first-year sales (median 12-month sales per store, in real pesos) have roughly tripled from ~Ps.5M for mid-2000s vintages to ~Ps.16M for the 2025 vintage, and each store then ramps toward ~Ps.25M+ at maturity. Values for 2008–2023 are approximate reads from the company\'s "Median Sales per Store by Vintage" chart (4Q24 earnings deck); the 2025 figure is approximate, consistent with the continuing upward trend.';
var UE_WC_NOTE = 'Working-capital figures (FY2025), computed on average balances (365 ÷ (cost of sales ÷ average inventory or payables)): 3B sells its inventory in ~20.2 days (turning it ~18× a year) and pays suppliers in ~58.9 days — the 2.9× payable-to-inventory ratio the company cites for 2025. Because shoppers pay cash, that ~39-day gap is free financing: negative working capital reached ~Ps.5.9B at year-end 2025 (up from ~Ps.2.6B in 2024), funding most of the ~Ps.3.6B spent opening 574 new stores. Sources: BBB Foods FY2025 Form 20-F and 4Q24 earnings deck.';
var _chartUe = null;

// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function rows(arr){ return arr.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join(''); }

// Overview sub-tab body (the original company profile).
function overviewBody(c){
  var h = '';

  // 1 — Snapshot + lede
  h += '<div class="ov-snap">' + SNAPSHOT.map(function(p){
    return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>';
  }).join('') + '</div>';
  h += '<p class="ov-lede">'+esc(DESC)+'</p>';

  // 2 — KPI tiles + notes
  h += '<div class="ov-kpis">' + KPIS.map(function(k){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>';
  }).join('') + '</div>';
  h += '<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h += '<div class="ov-fynote">'+esc(FY_NOTE)+'</div>';

  // 3 — How it makes money
  h += sec('How Tiendas 3B Makes Money', bullets(HOW_MONEY));

  // 4 — Financial performance (FY2024 vs FY2025)
  h += sec('Financial Performance (FY2024 → FY2025)',
    '<table class="ov-table"><thead><tr><th>Metric</th><th>FY2024</th><th>FY2025</th></tr></thead><tbody>'+
    FINANCIALS.map(function(r){return '<tr><td class="ov-td-name">'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>';}).join('')+
    '</tbody></table>'+
    '<div class="ov-callout">'+esc(FIN_NOTE)+'</div>'
  );

  // 5 — Product mix
  h += sec('Product Mix', SEGMENTS.map(function(s){
    return '<div class="ov-row"><div class="ov-row-k">'+esc(s[0])+'</div><div class="ov-row-v">'+esc(s[1])+'</div></div>';
  }).join(''));

  // 6 — Footprint & store model
  h += sec('Footprint & Store Model',
    '<div class="ov-corr-stats">'+
      FOOTPRINT.stats.map(function(s){return '<div class="ov-corr-stat"><div class="ov-corr-v">'+esc(s[0])+'</div><div class="ov-corr-l">'+esc(s[1])+'</div></div>';}).join('')+
    '</div>'+ rows(FOOTPRINT.rows)
  );

  // 7 — Timeline
  h += sec('History & Milestones', '<div class="ov-timeline">'+TIMELINE.map(function(t){
    return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div><div class="ov-tl-body">'+t[1]+'</div></div>';
  }).join('')+'</div>');

  // 8 — Negative working capital engine
  h += sec('The Efficiency & Working-Capital Engine', '<div class="ov-callout">'+bullets(ENGINE)+'</div>');

  // 9 — Peers
  h += sec('Peers & Competitive Landscape',
    '<table class="ov-table"><thead><tr><th>Peer</th><th>What they offer</th><th>How 3B differs</th></tr></thead><tbody>'+
    PEERS.map(function(p){return '<tr><td class="ov-td-name">'+esc(p[0])+'</td><td>'+esc(p[1])+'</td><td>'+esc(p[2])+'</td></tr>';}).join('')+
    '</tbody></table>'
  );

  // 10 — Tailwinds / Headwinds
  h += sec('Tailwinds & Headwinds',
    '<div class="ov-grid2">'+
      '<div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
      '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div>'+
    '</div>'
  );

  // 11 — Strategic focus: white-space boxes + growth drivers
  function statBox(b){ return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>'; }
  h += sec('Strategic Focus',
    '<div class="ov-subh">Scale & White Space</div>'+
    '<div class="ov-targets">'+TAM.map(statBox).join('')+'</div>'+
    '<div class="ov-subh">Growth Drivers</div>'+
    '<div class="ov-drivers">'+DRIVERS.map(function(d){
      return '<div class="ov-driver"><div class="ov-driver-t">'+esc(d[0])+'</div><div class="ov-driver-d">'+esc(d[1])+'</div></div>';
    }).join('')+'</div>'
  );

  // 12 — Leadership
  h += sec('Leadership (Founder-Led)', LEADERSHIP.map(function(l){
    return '<div class="ov-row"><div class="ov-row-k">'+esc(l[0])+'</div><div class="ov-row-v">'+esc(l[1])+'</div></div>';
  }).join(''));

  // 13 — Sources
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';

  return h;
}

// "Stores" sub-tab body — split into two nested sub-tabs: SSS and Store Growth.
function storesBody(c){
  var maxI = STORE_YEARS.length - 1;
  var h = '';

  // Nested sub-tab bar (inside the Stores pane).
  h += '<div class="ovt-subtabs">'+
    '<button type="button" class="ovt-subtab active" data-ovst="sss">SSS</button>'+
    '<button type="button" class="ovt-subtab" data-ovst="growth">Store Growth</button>'+
  '</div>';

  // ── Sub-tab 1: SSS — Same Store Sales growth, TBBB vs. ANTAD ──
  var s = '';
  s += '<div class="ov-chart-card ovt-sss-card">'+
    '<div class="ov-chart-t">Same Store Sales Growth — TBBB vs. ANTAD <span>(quarterly, %)</span></div>'+
    '<div class="ov-chart-wrap ovt-sss-wrap"><canvas id="bbbChartSSS"></canvas></div>'+
  '</div>';
  s += '<div class="ov-foot">'+esc(SSS_NOTE)+'</div>';
  h += '<div class="ovt-subpane" data-ovst="sss">'+s+'</div>';

  // ── Sub-tab 2: Store Growth — store-count expansion + OXXO age comparison ──
  var g = '';
  // 1 — Interactive store count growth.
  g += '<div class="ov-sec-h ovt-store-h">Store Count Growth</div>';
  g += '<div class="sg-controls">'+
    '<div class="sg-slider">'+
      '<div class="sg-track"><div class="sg-fill" id="sgFill"></div></div>'+
      '<input type="range" id="sgMin" min="0" max="'+maxI+'" value="0" step="1" aria-label="Start year">'+
      '<input type="range" id="sgMax" min="0" max="'+maxI+'" value="'+maxI+'" step="1" aria-label="End year">'+
    '</div>'+
    '<div class="sg-ends"><span>'+esc(STORE_YEARS[0])+'</span><span>'+esc(STORE_YEARS[maxI])+'</span></div>'+
    '<div class="sg-readout" id="sgReadout"></div>'+
  '</div>';
  g += '<div class="ov-chart-card">'+
    '<div class="ov-chart-t">Total Stores <span>(year-end · light bars = estimate · red = YoY growth)</span></div>'+
    '<div class="ov-chart-wrap ovt-stores-wrap"><canvas id="bbbChartStores"></canvas></div>'+
  '</div>';
  g += '<div class="ov-foot">'+esc(STORE_NOTE)+'</div>';

  // 2 — Expansion vs. OXXO at the same company age.
  g += '<div class="ov-sec-h ovt-store-h">Store Expansion vs. OXXO — Same Company Age</div>';
  g += bullets(VS_CTX);
  g += '<div class="ov-chart-card">'+
    '<div class="ov-chart-t">Stores by Company Age — OXXO vs. Tiendas 3B <span>(ages since first store; final 3B point = stated white space · hollow / dashed = estimated / projected)</span></div>'+
    // OXXO logo + "where they are now" callout.
    '<div class="ovt-oxxo-note">'+
      '<span class="oxxo-logo">OXXO</span>'+
      '<span>OXXO today: <b>~22,000 stores in Mexico</b> — reached over <b>~48 years</b> (first store 1978).</span>'+
    '</div>'+
    '<div class="ov-chart-wrap ovt-vs-wrap"><canvas id="bbbChartVs"></canvas></div>'+
    '<div class="ovt-legend">'+
      '<span class="ovt-lg"><i style="background:'+OXXO_CLR+'"></i>OXXO (Mexico)</span>'+
      '<span class="ovt-lg"><i style="background:#E1251B"></i>Tiendas 3B</span>'+
    '</div>'+
  '</div>';
  g += '<div class="ov-foot">'+esc(VS_NOTE)+'</div>';
  h += '<div class="ovt-subpane" data-ovst="growth" hidden>'+g+'</div>';

  return h;
}

// "Unit Economics" sub-tab body — why 3B runs on negative working capital, in plain language.
function ueBody(c){
  var h = '';

  // 1 — New-store first-year sales by vintage (now the lead chart).
  h += '<div class="ov-subh">How much a new store sells in its first year</div>';
  h += '<p class="ov-lede">Each new generation ("vintage") of 3B stores opens stronger than the last: a brand-new store now sells far more in its first year than one opened a decade ago, and it keeps ramping toward maturity.</p>';
  h += '<div class="ov-chart-card">'+
    '<div class="ov-chart-t">First-Year Sales per New Store <span>(median, real Ps. MM · dashed = ~maturity)</span></div>'+
    '<div class="ov-chart-wrap ovt-ue-wrap"><canvas id="bbbChartUe"></canvas></div>'+
  '</div>';
  h += '<div class="ov-foot">'+UE_VINT_NOTE+'</div>';

  // 2 — What it costs to open a store.
  h += '<div class="ov-sec-h ovt-store-h">What it costs to open a store</div>';
  h += '<div class="ue-cost">'+
    '<div class="ue-cost-fig">'+esc(UE_STORE_COST)+'<span>per store</span></div>'+
    '<div class="ue-cost-body"><div class="ue-cost-t">to build and open a new Tiendas 3B store</div><div class="ue-cost-d">'+esc(UE_COST_DESC)+'</div></div>'+
  '</div>';
  h += '<div class="ov-foot">'+esc(UE_COST_NOTE)+'</div>';

  // 3 — Why 3B runs on negative working capital (moved to the bottom).
  h += '<div class="ov-sec-h ovt-store-h">Why 3B\'s suppliers fund its growth</div>';
  h += '<p class="ov-lede">"Negative working capital" sounds like a problem, but for 3B it is a superpower: the company collects cash from shoppers well before it has to pay its suppliers, so it grows largely on other people\'s money.</p>';

  // The cash timeline (visual).
  h += '<div class="wc-flow">'+
    '<div class="wc-bar">'+
      '<div class="wc-seg wc-sell"><span>Sell the inventory</span><small>~20 days</small></div>'+
      '<div class="wc-seg wc-free"><span>Hold the cash — free</span><small>~39 days</small></div>'+
    '</div>'+
    '<div class="wc-ticks">'+
      '<span class="wc-tick wc-tick-start" style="left:0%"><b>Day 0</b><small>get goods on credit</small></span>'+
      '<span class="wc-tick" style="left:34%"><b>~Day 20</b><small>sold · cash in</small></span>'+
      '<span class="wc-tick wc-tick-end" style="left:100%"><b>~Day 59</b><small>pay the supplier</small></span>'+
    '</div>'+
  '</div>';

  // Three simple steps.
  h += '<div class="wc-steps">' + UE_STEPS.map(function(s){
    return '<div class="wc-step"><div class="wc-step-n">'+esc(s.n)+'</div><div class="wc-step-t">'+esc(s.t)+'</div><div class="wc-step-d">'+esc(s.d)+'</div></div>';
  }).join('') + '</div>';

  // The two numbers behind it.
  h += sec('The two numbers behind it',
    '<div class="ov-row"><div class="ov-row-k">Inventory turnover</div><div class="ov-row-v">3B sells its products in about <b>20 days</b> — it cycles through its entire inventory roughly <b>18 times a year</b>. Fast sales mean cash arrives quickly.</div></div>'+
    '<div class="ov-row"><div class="ov-row-k">Accounts payable</div><div class="ov-row-v">3B pays its suppliers in about <b>59 days</b> — roughly <b>2.9× slower</b> than it sells the inventory. The longer it waits to pay, the more cash it holds in the meantime.</div></div>'+
    '<div class="ov-row"><div class="ov-row-k">The result (2025)</div><div class="ov-row-v">Because shoppers pay <b>cash on the spot</b>, 3B has the money ~<b>39 days</b> before it pays for the goods. By year-end 2025 this freed up <b>~Ps.5.9B</b> of cash (up ~Ps.3.2B in the year) — most of what it spent opening <b>574 new stores</b>.</div></div>'
  );

  // Everyday analogy.
  h += '<div class="milk-takeaway">'+UE_ANALOGY+'</div>';
  h += '<div class="ov-foot">'+UE_WC_NOTE+'</div>';

  return h;
}

// "Product Mix" sub-tab body — private label vs. branded evolution + economics example.
function mixBody(c){
  var h = '';

  // 1 — Why it matters: private-label economics, illustrated with 1 L milk.
  h += '<div class="ov-sec-h ovt-store-h">Private Label Economics — Milk (1 L)</div>';
  h += '<div class="milk-compare">'+
    '<div class="milk-card milk-pl">'+
      '<img class="milk-img" src="assets/milk-vacablanca.jpg" alt="Vaca Blanca whole milk 1 L" loading="lazy">'+
      '<div class="milk-brand">Vaca Blanca <span class="milk-tag">Private label · 3B</span></div>'+
      '<div class="milk-price">$20<span> MXN</span></div>'+
      '<div class="milk-margin">3B keeps <b>$4.5</b> · <b>~22%</b> margin</div>'+
    '</div>'+
    '<div class="milk-vs">vs</div>'+
    '<div class="milk-card milk-br">'+
      '<img class="milk-img" src="assets/milk-alpura.png" alt="Alpura Clásica milk 1 L" loading="lazy">'+
      '<div class="milk-brand">Alpura <span class="milk-tag">Branded</span></div>'+
      '<div class="milk-price">$33<span> MXN</span></div>'+
      '<div class="milk-margin">3B keeps <b>$3.3</b> · <b>~10%</b> margin</div>'+
    '</div>'+
  '</div>';
  h += '<div class="milk-takeaway">3B\'s own-brand milk (<b>Vaca Blanca</b>) is about <b>40% cheaper</b> for the shopper (<b>$20</b> vs <b>$33</b>) yet earns 3B <b>more than double the margin</b> (~<b>22%</b> vs ~<b>10%</b>) and more pesos per litre (<b>$4.5</b> vs <b>$3.3</b>). That is the private-label flywheel — better value for the customer <i>and</i> better economics for 3B — which is why private label keeps taking share (<b>58.2%</b> of sales in 2025).</div>';
  h += '<div class="ov-foot">Product photos: Vaca Blanca (Tiendas 3B) and Alpura Clásica, 1 L. Representative shelf prices and per-unit margins (MXN) for illustration.</div>';

  // 2 — Mix evolution chart (KPI boxes removed per request).
  h += '<div class="ov-chart-card">'+
    '<div class="ov-chart-t">Product Mix — Private Label vs. Branded <span>(% of sales)</span></div>'+
    '<div class="ov-chart-wrap ovt-mix-wrap"><canvas id="bbbChartMix"></canvas></div>'+
  '</div>';
  h += '<div class="ov-foot">'+esc(MIX_NOTE)+'</div>';

  return h;
}

// "General" tab — bundles Store Tour, Logistics, Competitive Landscape and BİM
// Blueprint as nested sub-tabs.
function generalBody(c){
  var h = '';
  h += '<div class="ovt-subtabs">'+
    '<button type="button" class="ovt-subtab active" data-ovst="tour">Store Tour</button>'+
    '<button type="button" class="ovt-subtab" data-ovst="logistics">Logistics</button>'+
    '<button type="button" class="ovt-subtab" data-ovst="landscape">Competitive Landscape</button>'+
    '<button type="button" class="ovt-subtab" data-ovst="bim">BİM Blueprint</button>'+
  '</div>';
  h += '<div class="ovt-subpane" data-ovst="tour">'+bbbLogistics.tourBody(c)+'</div>';
  h += '<div class="ovt-subpane" data-ovst="logistics" hidden>'+bbbLogistics.body(c)+'</div>';
  h += '<div class="ovt-subpane" data-ovst="landscape" hidden>'+bbbLandscape.body(c)+'</div>';
  h += '<div class="ovt-subpane" data-ovst="bim" hidden>'+bbbBim.body(c)+'</div>';
  return h;
}

function html(c){
  var h = '<div class="ov ov-tbbb" data-brand="TBBB">';
  // Sub-tab bar
  h += '<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="general">General</button>'+
    '<button type="button" class="ovt-tab" data-ovt="stores">Stores</button>'+
    '<button type="button" class="ovt-tab" data-ovt="mix">Product Mix</button>'+
    '<button type="button" class="ovt-tab" data-ovt="ue">Unit Economics</button>'+
    '<button type="button" class="ovt-tab" data-ovt="mgmt">Management</button>'+
  '</div>';
  // Panes
  h += '<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="general" hidden>'+generalBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="stores" hidden>'+storesBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="mix" hidden>'+mixBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="ue" hidden>'+ueBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="mgmt" hidden>'+bbbManagement.body(c)+'</div>';
  h += '</div>';
  return h;
}

// ─── Charts ──────────────────────────────────────────────────────────────────
// Inline plugin: draw each point's value (TBBB above the point, ANTAD below).
var sssValueLabels = {
  id: 'sssValueLabels',
  afterDatasetsDraw: function(chart){
    var ctx = chart.ctx;
    chart.data.datasets.forEach(function(ds, di){
      var meta = chart.getDatasetMeta(di);
      if (meta.hidden) return;
      meta.data.forEach(function(pt, i){
        var v = ds.data[i];
        ctx.save();
        ctx.font = '700 11px Inter, sans-serif';
        ctx.fillStyle = ds.borderColor;
        ctx.textAlign = 'center';
        // Draw both series' labels ABOVE their points — there is a wide empty band
        // between the (high) TBBB line and the (low) ANTAD line, so this keeps the
        // ANTAD values clear of the X-axis quarter labels.
        ctx.fillText(Number(v).toFixed(1) + '%', pt.x, pt.y - 10);
        ctx.restore();
      });
    });
  }
};

function buildSSSChart(){
  var cv = document.getElementById('bbbChartSSS');
  if (!cv || typeof Chart === 'undefined') return;
  if (!cv.offsetParent) return; // not visible yet — wait until the SSS tab is shown
  if (_chartSSS) { _chartSSS.destroy(); _chartSSS = null; }
  _chartSSS = new Chart(cv.getContext('2d'), {
    type: 'line',
    data: { labels: SSS_Q, datasets: [
      { label:'TBBB', data:SSS_TBBB, borderColor:'#E1251B', backgroundColor:'#E1251B',
        borderWidth:2.5, pointRadius:3, pointHoverRadius:5, tension:.3, fill:false },
      { label:'ANTAD Self-Service', data:SSS_ANTAD, borderColor:'#9AA3AE', backgroundColor:'#9AA3AE',
        borderWidth:2.5, pointRadius:3, pointHoverRadius:5, tension:.3, fill:false },
    ]},
    options: {
      responsive:true, maintainAspectRatio:false,
      layout:{ padding:{ top:24, bottom:12 } },
      interaction:{ mode:'index', intersect:false },
      plugins:{
        legend:{ display:true, position:'bottom', labels:{ usePointStyle:true, font:{size:12} } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+Number(ctx.parsed.y).toFixed(1)+'%'; } } }
      },
      scales:{
        // Y-axis hidden (like the source earnings decks) — the point labels carry the
        // values. A small negative floor lifts the low ANTAD line off the X-axis labels.
        y:{ display:false, min:-2, max:20 },
        x:{ grid:{ display:false }, position:'bottom',
            ticks:{ color:'#8A93A0', font:{size:12}, padding:14 } }
      }
    },
    plugins: [sssValueLabels]
  });
}

// Inline plugin: draw the store count (and YoY growth) above each bar.
var storesLabels = {
  id: 'storesLabels',
  afterDatasetsDraw: function(chart){
    var ctx = chart.ctx;
    var meta = chart.getDatasetMeta(0);
    var yoy = chart.$yoy || [];
    meta.data.forEach(function(bar, i){
      var v = chart.data.datasets[0].data[i];
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillStyle = '#1E2733';
      ctx.fillText(Number(v).toLocaleString(), bar.x, bar.y - 22);
      if (yoy[i] != null) {
        ctx.font = '600 11px Inter, sans-serif';
        ctx.fillStyle = '#E1251B';
        ctx.fillText('+' + yoy[i].toFixed(1) + '%', bar.x, bar.y - 7);
      }
      ctx.restore();
    });
  }
};

function buildStoresChart(){
  var cv = document.getElementById('bbbChartStores');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_chartStores) { _chartStores.destroy(); _chartStores = null; }
  _chartStores = new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: { labels: [], datasets: [{ data: [], backgroundColor: [], borderRadius: 4, maxBarThickness: 70 }] },
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:34, bottom:4 } },
      plugins:{
        legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){
          var yy = (_chartStores && _chartStores.$yoy) ? _chartStores.$yoy[ctx.dataIndex] : null;
          return Number(ctx.parsed.y).toLocaleString() + ' stores' + (yy != null ? '  (+' + yy.toFixed(1) + '% YoY)' : '');
        } } }
      },
      scales:{
        y:{ display:false, beginAtZero:true, grace:'14%' },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:12 } } }
      }
    },
    plugins: [storesLabels]
  });
}

// Update the store chart + readout for the selected [a, b] year window.
function renderStores(a, b){
  if (!_chartStores) return;
  var labels = [], data = [], colors = [], yoy = [];
  for (var i = a; i <= b; i++){
    labels.push(STORE_YEARS[i]);
    data.push(STORE_COUNT[i]);
    colors.push(i >= STORE_FIRST_EST ? 'rgba(225,37,27,0.40)' : '#E1251B');
    yoy.push(storeYoY(i)); // YoY vs. the true prior year (null for 2020)
  }
  _chartStores.data.labels = labels;
  _chartStores.data.datasets[0].data = data;
  _chartStores.data.datasets[0].backgroundColor = colors;
  _chartStores.$yoy = yoy;
  _chartStores.update('none');
}

// Wire the dual-handle year slider. Idempotent (uses oninput assignment).
function setupStoreSlider(){
  var mn = document.getElementById('sgMin'), mx = document.getElementById('sgMax');
  var fill = document.getElementById('sgFill'), read = document.getElementById('sgReadout');
  if (!mn || !mx || !fill || !read) return;
  var maxI = STORE_YEARS.length - 1;
  function apply(){
    var a = +mn.value, b = +mx.value;
    fill.style.left  = (a / maxI * 100) + '%';
    fill.style.width = ((b - a) / maxI * 100) + '%';
    renderStores(a, b);
    var cg = storeCAGR(a, b);
    read.innerHTML =
      '<span class="sg-range">' + STORE_YEARS[a] + ' → ' + STORE_YEARS[b] + '</span>' +
      '<span class="sg-stat"><b>' + STORE_COUNT[a].toLocaleString() + '</b> → <b>' + STORE_COUNT[b].toLocaleString() + '</b> stores</span>' +
      (cg != null ? '<span class="sg-stat sg-cagr">CAGR <b>' + cg.toFixed(1) + '%</b></span>' : '<span class="sg-stat">CAGR —</span>');
  }
  // Keep the two handles from crossing (min stays at least one year below max).
  mn.oninput = function(){ if (+mn.value >= +mx.value) mn.value = +mx.value - 1; apply(); };
  mx.oninput = function(){ if (+mx.value <= +mn.value) mx.value = +mn.value + 1; apply(); };
  apply();
}

// Value labels for the OXXO-vs-3B lines (3B above its points, OXXO below).
var vsLabels = {
  id: 'vsLabels',
  afterDatasetsDraw: function(chart){
    var ctx = chart.ctx;
    chart.data.datasets.forEach(function(ds, di){
      var meta = chart.getDatasetMeta(di);
      meta.data.forEach(function(pt, i){
        if (ds.data[i] == null) return;   // skip empty points (e.g. OXXO has no white-space value)
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = '700 11px Inter, sans-serif';
        ctx.fillStyle = (di === 0) ? OXXO_CLR : '#E1251B';   // 0 = OXXO, 1 = 3B
        ctx.fillText(Number(ds.data[i]).toLocaleString(), pt.x, pt.y + (di === 0 ? 17 : -10));
        ctx.restore();
      });
    });
  }
};

function buildVsChart(){
  var cv = document.getElementById('bbbChartVs');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_chartVs) { _chartVs.destroy(); _chartVs = null; }
  // Hollow markers flag estimated / projected points.
  var oxxoPt = VS_OXXO_EST.map(function(e){ return e ? '#FFFFFF' : OXXO_CLR; });
  var b3Pt   = VS_3B_EST.map(function(e){ return e ? '#FFFFFF' : '#E1251B'; });
  _chartVs = new Chart(cv.getContext('2d'), {
    type: 'line',
    data: { labels: VS_AGES, datasets: [
      { label:'OXXO (Mexico)', data:VS_OXXO, borderColor:OXXO_CLR,
        pointBackgroundColor:oxxoPt, pointBorderColor:OXXO_CLR, pointBorderWidth:2,
        borderWidth:2.5, pointRadius:5, pointHoverRadius:6, tension:.25, fill:false },
      { label:'Tiendas 3B', data:VS_3B, borderColor:'#E1251B',
        pointBackgroundColor:b3Pt, pointBorderColor:'#E1251B', pointBorderWidth:2,
        borderWidth:2.5, pointRadius:5, pointHoverRadius:6, tension:.25, fill:false,
        // Dash the projected segments (25- and 30-year, i.e. from data index 2 on).
        segment:{ borderDash:function(c){ return c.p1DataIndex >= 2 ? [6,4] : undefined; } } },
    ]},
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:26, bottom:6 } },
      interaction:{ mode:'index', intersect:false },
      plugins:{
        legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label + ': ' + Number(ctx.parsed.y).toLocaleString() + ' stores'; } } }
      },
      scales:{
        y:{ display:false, beginAtZero:true, grace:'14%' },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:12 } } }
      }
    },
    plugins: [vsLabels]
  });
}

// Centered % labels inside each segment of the 100%-stacked product-mix bars.
var mixLabels = {
  id: 'mixLabels',
  afterDatasetsDraw: function(chart){
    var ctx = chart.ctx;
    var zero = chart.scales.y.getPixelForValue(0);
    chart.data.datasets.forEach(function(ds, di){
      var meta = chart.getDatasetMeta(di);
      meta.data.forEach(function(bar, i){
        var base = (typeof bar.base === 'number') ? bar.base : zero;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '700 12px Inter, sans-serif';
        ctx.fillStyle = (di === 0) ? '#FFFFFF' : '#3A434F';   // white on red, dark on grey
        ctx.fillText(Number(ds.data[i]).toFixed(1) + '%', bar.x, (bar.y + base) / 2);
        ctx.restore();
      });
    });
  }
};

function buildMixChart(){
  var cv = document.getElementById('bbbChartMix');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_chartMix) { _chartMix.destroy(); _chartMix = null; }
  _chartMix = new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: { labels: MIX_YEARS, datasets: [
      { label:'Private label', data:MIX_PL, backgroundColor:'#E1251B', maxBarThickness:84 },
      { label:'Branded',       data:MIX_BR, backgroundColor:'#C9CFD6', maxBarThickness:84 },
    ]},
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{
        legend:{ display:true, position:'bottom', labels:{ usePointStyle:true, font:{ size:12 } } },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label + ': ' + Number(ctx.parsed.y).toFixed(1) + '%'; } } }
      },
      scales:{
        x:{ stacked:true, grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:12 } } },
        y:{ stacked:true, display:false, min:0, max:100 }
      }
    },
    plugins: [mixLabels]
  });
}

// Value labels (Ps.MM) above each vintage bar.
var ueLabels = {
  id: 'ueLabels',
  afterDatasetsDraw: function(chart){
    var ctx = chart.ctx;
    var meta = chart.getDatasetMeta(0);
    meta.data.forEach(function(bar, i){
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillStyle = '#E1251B';
      ctx.fillText('Ps.' + Number(chart.data.datasets[0].data[i]).toFixed(1) + 'M', bar.x, bar.y - 8);
      ctx.restore();
    });
  }
};

function buildUeChart(){
  var cv = document.getElementById('bbbChartUe');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_chartUe) { _chartUe.destroy(); _chartUe = null; }
  var mature = UE_VINT_YEARS.map(function(){ return UE_VINT_MATURE; });
  _chartUe = new Chart(cv.getContext('2d'), {
    type: 'bar',
    data: { labels: UE_VINT_YEARS, datasets: [
      { type:'bar', label:'First-year sales', data:UE_VINT_SALES, backgroundColor:'#E1251B',
        borderRadius:4, maxBarThickness:70, order:2 },
      { type:'line', label:'~Maturity (~Ps.25M)', data:mature, borderColor:'#9AA3AE',
        borderDash:[6,4], borderWidth:2, pointRadius:0, fill:false, order:1 },
    ]},
    options: {
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:26 } },
      plugins:{
        legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){
          return ctx.datasetIndex === 0
            ? 'First-year sales: Ps.' + Number(ctx.parsed.y).toFixed(1) + 'M'
            : 'Approx. maturity: ~Ps.' + ctx.parsed.y + 'M'; } } }
      },
      scales:{
        y:{ display:false, beginAtZero:true, suggestedMax: UE_VINT_MATURE + 4 },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:12 } },
            title:{ display:true, text:'Store vintage (year opened)', color:'#8A93A0', font:{ size:11 } } }
      }
    },
    plugins: [ueLabels]
  });
}

// ── Nested sub-tabs (pane-scoped) — used by both Stores and General ──
// Each nested sub-pane builds its own charts/interactions lazily, only once it is
// visible (Chart.js / canvases need a non-null offsetParent to size correctly).
function buildStoresSubSSS(){
  buildSSSChart();
}
function buildStoresSubGrowth(){
  buildStoresChart();
  setupStoreSlider();
  buildVsChart();
}

// Build whichever nested sub-pane is active, dispatched by its group.
function buildSub(root, group, key){
  if (group === 'stores'){
    if (key === 'sss')         buildStoresSubSSS();
    else if (key === 'growth') buildStoresSubGrowth();
  } else if (group === 'general'){
    if (key === 'logistics')        bbbLogistics.init(root);
    else if (key === 'landscape')   bbbLandscape.init(root);
    else if (key === 'bim')         bbbBim.init(root);
  }
}

// Switch a nested sub-tab WITHIN one pane (scoped so Stores and General don't collide).
function showSub(root, pane, group, key){
  pane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovst') === key); });
  pane.querySelectorAll('.ovt-subpane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovst') !== key); });
  requestAnimationFrame(function(){ buildSub(root, group, key); });
}

// Wire a nested sub-tab group (idempotent) and build its currently-active sub-pane.
function wireSubtabs(root, group){
  var pane = root.querySelector('.ovt-pane[data-ovt="'+group+'"]');
  if (!pane) return;
  pane.querySelectorAll('.ovt-subtab').forEach(function(btn){
    btn.onclick = function(){ showSub(root, pane, group, btn.getAttribute('data-ovst')); };
  });
  var active = pane.querySelector('.ovt-subtab.active');
  if (active) buildSub(root, group, active.getAttribute('data-ovst'));
}

// Switch sub-tab. Builds the tab's charts lazily the first time it becomes visible.
function showOvt(root, key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt') === key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovt') !== key); });
  if (key === 'stores') requestAnimationFrame(function(){ wireSubtabs(root, 'stores'); });
  if (key === 'general') requestAnimationFrame(function(){ wireSubtabs(root, 'general'); });
  if (key === 'mix') requestAnimationFrame(buildMixChart);
  if (key === 'mgmt') requestAnimationFrame(function(){ bbbManagement.init(root); });
  if (key === 'ue') requestAnimationFrame(buildUeChart);
}

function init(c){
  var root = document.querySelector('.ov-tbbb');
  if (!root) return;
  // Idempotent wiring (init may run again when the Overview pane is re-activated).
  root.querySelectorAll('.ovt-tab').forEach(function(btn){
    btn.onclick = function(){ showOvt(root, btn.getAttribute('data-ovt')); };
  });
  // If a chart tab is the active one, (re)build its charts now.
  var active = root.querySelector('.ovt-tab.active');
  var activeKey = active ? active.getAttribute('data-ovt') : '';
  if (activeKey === 'stores') requestAnimationFrame(function(){ wireSubtabs(root, 'stores'); });
  if (activeKey === 'general') requestAnimationFrame(function(){ wireSubtabs(root, 'general'); });
  if (activeKey === 'mix') requestAnimationFrame(buildMixChart);
  if (activeKey === 'mgmt') requestAnimationFrame(function(){ bbbManagement.init(root); });
  if (activeKey === 'ue') requestAnimationFrame(buildUeChart);
}

export var bbbOverview = { html: html, init: init };
