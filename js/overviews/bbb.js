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
import { bbbSensitivity } from './bbb-sensitivity.js';
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// Brand palette (Tiendas 3B red + green) — used for the standardized Overview accent line.
var BRAND = '#E1251B', BRAND2 = '#00A650';

// Captured company row (id + ticker) for the Watch List DB wiring — set in html()/ddHtml() since
// deepDive.init() is called with no args (companies.js). Mirrors googl.js's `_co` pattern.
var _co = null;

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
  { l:'Employees',         v:'29,202',   d:'FY2025',      dir:'muted' },
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
// ═══ Standardized Overview (docs/OVERVIEW_CONVENTIONS.md — same structure as AMZN/GOOGL/IBKR) ═══
// Built block-by-block. Block 1 of 7: Key Facts. The legacy overviewBody() further below is kept
// intact — its content migrates into the Deep Dive later (Golden Rule #1: never delete).

// Block 1 — Key Facts: exactly 10 cells (5×2). Market cap is live (Massive) with a labeled fallback.
var STD_FACTS = [
  ['Listing',      'NYSE: TBBB'],
  ['HQ',           'Mexico City, Mexico'],
  ['Incorporated', 'British Virgin Islands'],
  ['SEC filer',    'Foreign (20-F/6-K)'],
  ['Founded',      '2004 · first store 2005'],
  ['IPO',          'Feb 2024 · NYSE'],
  ['CEO',          'K. Anthony Hatoum · founder-CEO since 2004'],
  ['Employees',    '~29,202 · Dec 2025'],
  ['Dividend',     'Non-payer'],
  ['Market cap',   '~$4.8B · Aug 2026'],
];

// Block 2 — Description: tight, high-level "what it is". NON-redundant (no assortment size,
// product mix, customer type or moat — each has its own block below). Always visible. Sourced
// from the FY2025 Form 20-F "Business" section. Raw HTML (controlled copy) — no esc().
var STD_DESC = 'BBB Foods, Inc. — operating under the <b>Tiendas 3B</b> brand — is a Mexican grocery retailer and the pioneer of the hard-discount store format in Mexico. Its name stands for <i>"Bueno, Bonito y Barato"</i> (Good, Nice and Affordable). It runs an expanding network of small, standardized neighborhood stores across the country.';

function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.slice(0,10).map(function(p){
    var v = (p[0]==='Market cap') ? '<span id="tbbbMc">'+esc(p[1])+'</span>' : esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>';
  }).join('')+'</div>';
}

// Block 3 — 4-quadrant: "understand the business at a glance". Single 2×2 table, each cell
// ≤~30 words, always visible (never collapsed). Order: What it sells · Who buys it · How it
// earns · The edge. Raw HTML (controlled copy) — no esc().
var STD_QUAD = [
  ['What it sells', 'A limited assortment of ~<b>850–900 everyday grocery SKUs</b> — private-label, branded and rotating "spot" items — at the lowest sustainable price.'],
  ['Who buys it',   '<b>Low-to-middle-income Mexican households</b> shopping for daily essentials, who visit a nearby 3B store around three to four times a week.'],
  ['How it earns',  'Retail merchandise sales from a <b>single store format</b> — a low ~<b>16% gross margin</b> earned on high volume and fast inventory turnover.'],
  ['The edge',      'A deep <b>private-label mix (58% of sales)</b>, hard-discount scale and <b>negative working capital</b> — funding low prices and largely self-funded store growth.'],
];

function stdFourQuad(){
  return '<div class="q2">'+STD_QUAD.map(function(p){
    return '<div class="q2-cell"><div class="q2-k">'+esc(p[0])+'</div><div class="q2-v">'+p[1]+'</div></div>';
  }).join('')+'</div>';
}

// Generic collapsible (progressive disclosure) — reused by Blocks 4–7. Default collapsed.
function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// Block 4 — How it makes money. TBBB is a SINGLE reportable segment (retail) in a SINGLE
// geography (~100% Mexico), so neither a segment nor a geography chart qualifies (≥2-slice
// rule). The meaningful revenue split is by PRODUCT TYPE — shown as the share-of-sales bar
// (FY2025). Each type gets a qualitative "What is X?" disclosure with NO numbers (bar has them).
var MM_MIX = [
  ['Private label', 58.2, '#00A650'],
  ['Branded',       35.9, '#5B7085'],
  ['Spot',           5.7, '#C99A3B'],
];
var MM_DEFS = [
  ['What is private label?', 'Own-developed house brands, sold only at 3B and made to order by a roster of vetted third-party manufacturers. They match or beat the branded equivalent on quality at a lower shelf price — the lever that lets 3B undercut rivals while still earning a healthier margin, which is why the mix keeps shifting this way.'],
  ['What is branded?', 'Well-known national and international brands, carried in a deliberately narrow selection and priced at the lowest sustainable level. They build trust and pull shoppers in — traffic that 3B then converts toward its cheaper private-label equivalents.'],
  ['What are spot products?', 'Opportunistic one-off buys — surplus or specially-sourced food and non-food deals bought cheap and passed on cheap. The selection is small and rotates constantly, giving shoppers a "treasure-hunt" reason to keep coming back.'],
];
function moneyMapBody(){
  var bar = MM_MIX.map(function(m){
    return '<div class="mm-seg" style="width:'+m[1]+'%;background:'+m[2]+'">'+(m[1]>=15?esc(m[0]):'')+'</div>';
  }).join('');
  var leg = MM_MIX.map(function(m){
    return '<span class="mm-lg"><i style="background:'+m[2]+'"></i>'+esc(m[0])+' · <b>'+m[1].toFixed(1)+'%</b></span>';
  }).join('');
  var accs = MM_DEFS.map(function(d){
    return '<div class="acc"><button type="button" class="acc-h">'+esc(d[0])+'<span class="acc-x">+</span></button><div class="acc-b" hidden>'+d[1]+'</div></div>';
  }).join('');
  return '<div class="mm-note">3B runs a <b>single reportable segment</b> (retail) in a <b>single geography</b> (~100% Mexico), so its revenue engine is best seen by <b>product type</b> — the share of sales each contributes (FY2025):</div>'+
    '<div class="mm-bar">'+bar+'</div>'+
    '<div class="mm-leg">'+leg+'</div>'+
    '<div class="acc-list" style="margin-top:12px">'+accs+'</div>';
}

// Block 5 — Products, two tiers. 3B is a retailer, so "products" = the assortment FAMILIES a
// household restocks (Tier 1 = emoji cards); each card opens a pop-up listing REPRESENTATIVE
// items (Tier 2). Items are illustrative of the in-store assortment, NOT an official SKU list
// (no fake precision) — the modal says so. Emoji fallback since there are no product photos.
var PROD_FAMS = [
  ['🥫', 'Pantry & staples', 'The core of the basket — the dry goods restocked every week.', [
    ['Cooking oil, rice, beans & pasta', 'The highest-frequency staples, where 3B\'s own-brand prices undercut the classic channel most visibly.'],
    ['Sugar, flour & baking basics', 'Everyday cooking essentials, mostly private label.'],
    ['Canned & packaged goods', 'Tuna, beans, tomato purée and other shelf-stable items.'],
  ]],
  ['🥛', 'Dairy & chilled', 'Refrigerated staples with fast turnover.', [
    ['Milk — Vaca Blanca (private label)', '3B\'s own-brand milk — the illustrative example of the private-label value-and-margin advantage.'],
    ['Eggs', 'A traffic-driving everyday staple.'],
    ['Yogurt, cheese & cold cuts', 'Chilled dairy and deli items.'],
  ]],
  ['🍪', 'Snacks & sweets', 'Impulse and treat categories.', [
    ['Cookies & crackers', 'Own-brand and branded biscuits side by side.'],
    ['Chips & salty snacks', 'Branded names alongside cheaper private-label bags.'],
    ['Candy & chocolate', 'Low-ticket impulse buys near the register.'],
  ]],
  ['🥤', 'Beverages', 'Water, soft drinks and hot drinks.', [
    ['Bottled water', 'A high-volume, low-price staple.'],
    ['Soft drinks & juices', 'Branded sodas plus cheaper own-brand options.'],
    ['Coffee & powdered drinks', 'Pantry beverages for the home.'],
  ]],
  ['🧴', 'Personal care', 'Health & hygiene basics.', [
    ['Soap, shampoo & toothpaste', 'Daily hygiene essentials.'],
    ['Toilet paper & tissues', 'High-restock household paper.'],
    ['Diapers & baby care', 'For the young families in the catchment.'],
  ]],
  ['🧽', 'Home cleaning', 'Laundry and household cleaning.', [
    ['Detergent & fabric softener', 'Laundry basics, own-brand led.'],
    ['Bleach & multipurpose cleaners', 'Core cleaning supplies.'],
    ['Dish soap & sponges', 'Kitchen cleaning items.'],
  ]],
];
function productsBody(){
  var cards = PROD_FAMS.map(function(f,i){
    return '<div class="stdp-card" data-fam="'+i+'"><div class="stdp-ic">'+f[0]+'</div>'+
      '<div class="stdp-n">'+esc(f[1])+'</div><div class="stdp-d">'+esc(f[2])+'</div>'+
      '<div class="stdp-more">See items ›</div></div>';
  }).join('');
  return '<div class="mm-note">3B stocks a deliberately narrow set of everyday categories — the families a low-to-middle-income household restocks each week. Tap a family for representative items.</div>'+
    '<div class="stdp">'+cards+'</div>';
}

// Products pop-up (Tier 2). Reuses the global .ov-modal styles. Modal is hoisted to
// #co-detailview in init() so it stays visible; degrades fine in the standalone preview.
function wireProducts(root){
  var back = root.querySelector('#tbbbModalBack'); if(!back) return;
  var mT = root.querySelector('#tbbbModalT'), mB = root.querySelector('#tbbbModalB');
  function onEsc(e){ if(e.key === 'Escape') closeM(); }
  function openM(t,b){ mT.innerHTML = t; mB.innerHTML = b; back.hidden = false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden = true; }, 180); }
  var xb = root.querySelector('#tbbbModalX'); if(xb) xb.onclick = closeM;
  back.onclick = function(e){ if(e.target === back) closeM(); };
  root.querySelectorAll('.stdp-card[data-fam]').forEach(function(card){ card.onclick = function(){
    var f = PROD_FAMS[+card.getAttribute('data-fam')]; if(!f) return;
    var items = f[3].map(function(it){
      return '<div class="prod-item"><div class="prod-item-n">'+esc(it[0])+'</div><div class="prod-item-d">'+esc(it[1])+'</div></div>';
    }).join('');
    openM(f[0]+' '+esc(f[1]),
      '<div class="prod-illus">Representative items — illustrative of the in-store assortment, not an official SKU list.</div>'+items);
  }; });
  // Block 7 — timeline "Read more" entries open the same modal with sequential bullets.
  root.querySelectorAll('.ov-timeline [data-tlr]').forEach(function(it){ it.onclick = function(){
    var t = STD_TL[+it.getAttribute('data-tlr')]; if(!t || !t[2]) return;
    openM(esc(t[0]), '<ul class="tl-more-list">'+t[2].map(function(b){ return '<li>'+b+'</li>'; }).join('')+'</ul>');
  }; });
}

// ═══ Block 6 — Competitors scatter (ported from the standardized AMZN scatter) ══════════════
// X = valuation multiple (P/E ⇄ EV/EBITDA — never P/S), Y = revenue growth, bubble = LIVE market
// cap (Massive, USD). Basis toggle Trailing ⇄ Forward (default Forward). Peers add/removable by
// ticker; the × deletes immediately, re-adding a known ticker restores its seed. Multiples &
// growth are SEEDED approximations (Aug 2026, labeled) — market caps are live. Only LISTED peers
// with a public multiple plot; private rivals (Tiendas Neto, the informal "tienditas") drop out
// and live in the Deep Dive's competitive map. TBBB posted an FY2025 net loss, so it has NO
// trailing P/E (peT:null) and drops out of that view.
var B_PEERS = [
  { tk:'TBBB',     n:'Tiendas 3B', peT:null, peF:40, evT:22,  evF:16,  gt:36, gf:28, mc:4.8, hl:true,
    why:'The hard-discount pioneer and the growth outlier here — no trailing P/E (FY2025 net loss from a one-off SBC charge); read the forward number.' },
  { tk:'WALMEX',   n:'Walmex',     peT:23,   peF:21, evT:14,  evF:13,  gt:8,  gf:8,  mc:57,
    logo:'https://logo.clearbit.com/walmartmexico.com.mx',
    why:'Mexico\'s largest retailer and owner of Bodega Aurrerá — 3B\'s closest big-box value rival. Far slower growth at a premium multiple.' },
  { tk:'FMX',      n:'FEMSA',      peT:22,   peF:19, evT:10,  evF:9,   gt:11, gf:9,  mc:37,
    logo:'https://logo.clearbit.com/femsa.com',
    why:'Owner of OXXO, the dominant convenience network. Chases the same everyday shopper, but on convenience and impulse rather than destination value.' },
  { tk:'CHDRAUIB', n:'Chedraui',   peT:11,   peF:10, evT:6,   evF:5.5, gt:8,  gf:7,  mc:5.5,
    logo:'https://logo.clearbit.com/chedraui.com.mx',
    why:'Full-assortment supermarket and hypermarket operator — the cheapest name on the map, growing in the mid-single digits.' },
  { tk:'LACOMUBC', n:'La Comer',   peT:21,   peF:19, evT:12,  evF:11,  gt:12, gf:10, mc:3.7,
    logo:'https://logo.clearbit.com/lacomer.com.mx',
    why:'Premium supermarket operator (La Comer, City Market) — a higher-income positioning than 3B, priced at a growth premium.' },
];
var B_SC = { metric:'pe', basis:'f', peers:null, _capsFetched:false };
function bScReset(){ if(!B_SC.peers) B_SC.peers = B_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function bScMult(p){ var key=(B_SC.metric==='pe'?'pe':'ev')+(B_SC.basis==='f'?'F':'T'); return p[key]; }
function bScMax(){ return B_SC.metric==='pe'?45:30; }
function bLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function bPeerScatter(sfx){
  sfx=sfx||'ov';
  var h='<style>.mg-tog-row{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 8px}'+
    '.mg-tog{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)}'+
    '.mg-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.mg-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.mg-pill.active{background:var(--navy);color:#fff}'+
    '.mg-node{cursor:pointer}.mg-node text{pointer-events:none}'+
    '.asc-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 2px}'+
    '.asc-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:999px;padding:3px 9px;background:var(--w);cursor:pointer;color:var(--navy)}'+
    '.asc-chip .x{color:var(--mu);font-weight:800}'+
    '.asc-add{display:inline-flex;gap:5px;align-items:center}'+
    '.asc-add input{width:84px;font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:7px;padding:3px 7px;text-transform:uppercase}'+
    '.asc-add button{font:inherit;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:7px;padding:3px 9px;background:#F2F5F8;cursor:pointer}'+
    '.mg-tip{position:fixed;z-index:60;max-width:250px;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;box-shadow:0 8px 22px rgba(16,20,26,.28);pointer-events:none;border-top:3px solid '+BRAND+'}'+
    '.mg-tip .mgt-h{display:flex;align-items:center;gap:7px;margin-bottom:4px}.mg-tip .mgt-h img{width:18px;height:18px;border-radius:4px;background:#fff;object-fit:contain}'+
    '.mg-tip .mgt-n{font-weight:800;font-size:12.5px;color:#FF6B5E}</style>';
  h+='<div class="tbbb-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y). <b>Bubble size = live market cap in USD.</b> <span style="opacity:.75">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row">'+
    '<span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgmetric="pe">P/E</button><button type="button" class="mg-pill" data-mgmetric="ev">EV/EBITDA</button></span></span>'+
    '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span>'+
  '</div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="tbbb-sc-svg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower multiple)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="tbbb-sc-xlab">P/E · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<g class="tbbb-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="asc-chips tbbb-sc-chips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only <b>listed</b> peers with a public multiple plot here — private rivals like <b>Tiendas Neto</b> and the informal <b>"tienditas"</b> have no market multiple and appear in the Deep Dive\'s competitive map instead. <span class="ave-subh-note">Multiples &amp; growth are seeded approximations (Aug 2026), labeled; market caps are live. TBBB has no trailing P/E (FY2025 net loss).</span></div>';
  h+='<div class="mg-tip tbbb-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
function bScRenderOne(wrap){
  var g=wrap.querySelector('.tbbb-sc-nodes'); if(!g||!B_SC.peers) return;
  var maxMult=bScMax(), X0=80, X1=612, Y0=252, Y1=44;
  var lab=wrap.querySelector('.tbbb-sc-xlab'); if(lab) lab.textContent=(B_SC.metric==='pe'?'P/E':'EV/EBITDA')+' · '+(B_SC.basis==='f'?'forward':'trailing');
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===B_SC.basis); });
  wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgmetric')===B_SC.metric); });
  var frag='';
  B_SC.peers.forEach(function(p){
    if(!p.on) return; var m=bScMult(p); if(m==null||isNaN(m)) return;
    var growth=B_SC.basis==='f'?p.gf:p.gt; if(growth==null) growth=p.gf!=null?p.gf:p.gt;
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth||0)/40))*(Y0-Y1);
    var r=Math.max(11,Math.min(27,9+Math.sqrt(Math.max(1,p.mc))*0.32));
    var logo=bLogoUrl(p);
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?BRAND:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" style="pointer-events:none" onerror="this.style.display=\'none\'"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?'#C0341F':'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
}
function bScChipsOne(wrap){
  var box=wrap.querySelector('.tbbb-sc-chips'); if(!box||!B_SC.peers) return;
  var h=B_SC.peers.map(function(p,i){ return '<span class="asc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="asc-add"><input class="tbbb-sc-addtk" placeholder="+ TICKER" maxlength="8"><button type="button" class="tbbb-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
}
function bScRenderAll(root){ root.querySelectorAll('.tbbb-sc').forEach(bScRenderOne); }
function bScChipsAll(root){ root.querySelectorAll('.tbbb-sc').forEach(function(w){ bScChipsOne(w); wireBScChips(root, w); }); }
function wireBScatters(root){
  bScReset();
  root.querySelectorAll('.tbbb-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var g=wrap.querySelector('.tbbb-sc-nodes'), tip=wrap.querySelector('.tbbb-sc-tip');
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ B_SC.basis=btn.getAttribute('data-mgbasis'); bScRenderAll(root); }; });
    wrap.querySelectorAll('.mg-pill[data-mgmetric]').forEach(function(btn){ btn.onclick=function(){ B_SC.metric=btn.getAttribute('data-mgmetric'); bScRenderAll(root); }; });
    if(g&&tip){
      var svg=wrap.querySelector('.tbbb-sc-svg');
      function nodeOf(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; }
      function show(node){ tip.innerHTML='<div class="mgt-h"><img src="'+node.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+node.getAttribute('data-name')+'</span></div>'+node.getAttribute('data-why'); tip.hidden=false; }
      function move(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; }
      function hide(){ tip.hidden=true; }
      g.addEventListener('pointerover', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
      g.addEventListener('pointermove', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } else hide(); });
      g.addEventListener('pointerout', function(e){ if(!nodeOf(e)) return; var rt=e.relatedTarget; if(rt&&rt.closest&&rt.closest('.mg-node')) return; hide(); });
      if(svg) svg.addEventListener('pointerleave', hide);
      g.addEventListener('click', function(e){ var n=nodeOf(e); if(n){ show(n); move(e); } });
    }
  });
  bScRenderAll(root); bScChipsAll(root); bScFetchCaps(root);
}
function wireBScChips(root, wrap){
  wrap.querySelectorAll('.tbbb-sc-chips .asc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(B_SC.peers[i]){ B_SC.peers.splice(i,1); bScRenderAll(root); bScChipsAll(root); } }; });
  var addBtn=wrap.querySelector('.tbbb-sc-addbtn'), addIn=wrap.querySelector('.tbbb-sc-addtk');
  if(addBtn&&addIn){ addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
    if(!B_SC.peers.some(function(p){ return p.tk===tk; })){
      var seed=B_PEERS.filter(function(p){ return p.tk===tk; })[0];
      if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; B_SC.peers.push(o); }
      else B_SC.peers.push({ tk:tk, n:tk, on:true, mc:5, peT:null,peF:null,evT:null,evF:null,gt:null,gf:null, why:'Added by ticker — live market cap only; no multiple on file, so it plots once one is available.' });
    }
    addIn.value=''; bScRenderAll(root); bScChipsAll(root); bLiveOne(root, tk); }; }
}
// Live market cap for the peer bubbles (Massive via api.liveQuote). Degrades gracefully; BMV
// tickers may not resolve and simply keep their labeled seed.
function bLiveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res; if(!q||q.marketCap==null) return; var b=q.marketCap/1e9; if(B_SC.peers) B_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=b; }); bScRenderAll(root); }).catch(function(){}); }
function bScFetchCaps(root){ if(B_SC._capsFetched||!B_SC.peers) return; B_SC._capsFetched=true; B_SC.peers.forEach(function(p){ if(p.tk) bLiveOne(root, p.tk); }); }

// Block 7 — Timeline: the corporate lineage (why each event matters to what 3B is today), not a
// news feed. Genesis established (incorporated BVI 2004 → first store 2005 → traditional NYSE IPO
// 2024; organically grown, no spin-off/SPAC/roll-up). Depth lives in per-entry Read Mores (open
// the shared modal) with sequential bullets. Entry text is raw HTML (controlled copy).
var STD_TL = [
  ['2004', 'Incorporated in the <b>British Virgin Islands</b>; founder <b>K. Anthony Hatoum</b> sets out to build a hard-discounter in Mexico.', null],
  ['2005', 'Opens its <b>first Tiendas 3B store</b> in Mexico City and launches its first private-label product — the model is born.', null],
  ['2021', 'Reaches <b>1,500 stores</b> as the hard-discount format scales across central Mexico.', null],
  ['Feb 2024', '<b>IPO on the NYSE</b> under ticker <b>TBBB</b> — a traditional underwritten offering (not a SPAC or direct listing).', [
    'Went public via a conventional underwritten IPO on the New York Stock Exchange — its structural transition into the company it is today.',
    'Adopted a <b>triple-class share structure</b>: Series A (1 vote), founder-only Series B (15 votes) and Series C (1 vote).',
    'The structure leaves founder K. Anthony Hatoum with a minority of the economics (~11%) but <b>voting control</b> (~45% of the vote) — a key governance fact.',
  ]],
  ['2025', 'Ends the year with <b>3,346 stores, 20 distribution centers and 29,202 employees</b> — opening a new store roughly every 15 hours.', [
    'Revenue grew <b>+36%</b> to Ps.78.2B, with gross margin roughly flat at ~16.2%.',
    'Reported a <b>net loss of ~Ps.2.84B</b> — but driven by a one-off, <b>non-cash share-based-compensation charge</b> (~Ps.2.93B) tied to IPO-era RSUs, plus an FX translation loss.',
    'Core store economics did not deteriorate: the loss is an accounting artifact of the IPO, not an operating one.',
  ]],
];
function stdTimeline(){
  return '<div class="ov-timeline">'+STD_TL.map(function(t,i){
    var more = t[2] ? '<div class="ov-tl-more">Read more →</div>' : '';
    var cls  = t[2] ? ' is-click' : '';
    var attr = t[2] ? ' data-tlr="'+i+'"' : '';
    return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div><div class="ov-tl-body">'+t[1]+more+'</div></div>';
  }).join('')+'</div>';
}

var STD_SOURCES = 'Sources: BBB Foods FY2025 annual report (Form 20-F) and investor relations; SEC EDGAR (CIK 0001978954). Market cap is live via Massive; peer multiples are seeded approximations (Aug 2026), labeled. Figures in Mexican pesos (Ps.) unless noted.';

// The standardized Overview body. Grows block-by-block; currently Blocks 1–7.
function stdOverviewBody(c){
  var h = '<style>'+
    '.stdkf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:12px;overflow:hidden;background:var(--w);margin:2px 0}'+
    '.stdkf-cell{padding:11px 13px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.stdkf-cell:nth-child(5n){border-right:none}.stdkf-cell:nth-child(n+6){border-bottom:none}'+
    '.stdkf-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:3px}'+
    '.stdkf-v{font-size:12px;font-weight:700;color:var(--navy);line-height:1.3}'+
    '@media(max-width:720px){.stdkf{grid-template-columns:repeat(2,1fr)}.stdkf-cell{border-right:none}}'+
    '.q2{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:var(--w);margin:4px 0}'+
    '.q2-cell{padding:13px 15px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.q2-cell:nth-child(2n){border-right:none}.q2-cell:nth-child(n+3){border-bottom:none}'+
    '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+BRAND2+';margin-bottom:5px}'+
    '.q2-v{font-size:12px;color:var(--navy);line-height:1.5}.q2-v b{font-weight:800}'+
    '@media(max-width:600px){.q2{grid-template-columns:1fr}.q2-cell{border-right:none}.q2-cell:nth-child(n+2){border-bottom:1px solid var(--bdr)}.q2-cell:last-child{border-bottom:none}}'+
    // Block 4 — money map (product mix bar + legend)
    '.mm-note{font-size:12px;color:var(--mu);line-height:1.55;margin:0 0 10px}.mm-note b{color:var(--navy);font-weight:700}'+
    '.mm-bar{display:flex;height:34px;border-radius:8px;overflow:hidden;border:1px solid var(--bdr);background:var(--w)}'+
    '.mm-seg{display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:800;letter-spacing:.02em;min-width:0;white-space:nowrap;overflow:hidden}'+
    '.mm-leg{display:flex;flex-wrap:wrap;gap:16px;margin:10px 0 2px}'+
    '.mm-lg{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--navy);font-weight:600}'+
    '.mm-lg i{width:11px;height:11px;border-radius:3px;display:inline-block;flex:none}.mm-lg b{font-weight:800}'+
    // Generic collapsible + inner "What is X?" accordions (Blocks 4–7)
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}'+
    '.acc-list .acc{border:1px solid var(--bdr);border-radius:9px;margin-top:6px;overflow:hidden;background:var(--w)}'+
    '.acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12px;font-weight:700;color:var(--navy);padding:9px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}'+
    '.acc-h:hover{background:#EEF2F6}.acc-x{color:var(--mu);font-weight:800;font-size:14px}.acc-b{padding:10px 12px;font-size:12px;color:var(--navy);line-height:1.55}'+
    // Block 5 — products (family cards + pop-up items)
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:'+BRAND+'}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:'+BRAND2+';margin-top:6px}'+
    '.prod-illus{font-size:10.5px;color:var(--mu);font-style:italic;margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid var(--bdr)}'+
    '.prod-item{padding:8px 0;border-bottom:1px solid var(--bdr)}.prod-item:last-child{border-bottom:none}'+
    '.prod-item-n{font-size:12.5px;font-weight:800;color:var(--navy)}.prod-item-d{font-size:11.5px;color:var(--mu);line-height:1.5;margin-top:2px}'+
    // Block 7 — timeline Read More bullets (in the modal)
    '.tl-more-list{margin:0;padding-left:18px}.tl-more-list li{font-size:12.5px;color:var(--navy);line-height:1.55;margin-bottom:8px}.tl-more-list li:last-child{margin-bottom:0}'+
  '</style>';
  h += stdKeyFacts();
  h += '<p class="ov-lede" style="margin-top:16px">'+STD_DESC+'</p>';
  h += stdFourQuad();
  h += collapsible('How Tiendas 3B makes money', moneyMapBody(), false);
  h += collapsible('Products — what you find in a 3B store', productsBody(), false);
  h += collapsible('Competitors — the peer map', bPeerScatter('ov'), false);
  h += collapsible('Timeline — how it became today\'s Tiendas 3B', stdTimeline(), false);
  h += '<div class="ov-foot">'+esc(STD_SOURCES)+'</div>';
  // Tier-2 products pop-up (hoisted to #co-detailview in init).
  h += '<div class="ov-modal-back" id="tbbbModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button type="button" class="ov-modal-x" id="tbbbModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="tbbbModalT"></div><div class="ov-modal-b" id="tbbbModalB"></div></div></div>';
  return h;
}

// Live market cap for the Key Facts cell — Massive via api.liveQuote (no hardcoding). Degrades gracefully.
function tbbbLiveCap(root){
  import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote('TBBB'); }).then(function(res){
    var q = res && res.data ? res.data : res; if(!q || q.marketCap==null) return;
    var b = q.marketCap/1e9;
    var el = root.querySelector('#tbbbMc');
    if(el) el.textContent = '$'+(b>=1000?(b/1000).toFixed(2)+'T':b.toFixed(1)+'B')+' · live';
  }).catch(function(){});
}

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
    '</tbody></table>'
  );

  // 7 — Timeline
  h += sec('History & Milestones', '<div class="ov-timeline">'+TIMELINE.map(function(t){
    return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div><div class="ov-tl-body">'+t[1]+'</div></div>';
  }).join('')+'</div>');

  // 13 — Sources
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';

  return h;
}

// "Stores" sub-tab body — split into two nested sub-tabs: SSS and Store Growth.
// SSS sub-pane content (Same-Store Sales chart, TBBB vs ANTAD). Reused by the Deep Dive Top Line.
function sssBody(){
  return '<div class="ov-chart-card ovt-sss-card">'+
    '<div class="ov-chart-t">Same Store Sales Growth — TBBB vs. ANTAD <span>(quarterly, %)</span></div>'+
    '<div class="ov-chart-wrap ovt-sss-wrap"><canvas id="bbbChartSSS"></canvas></div>'+
  '</div>'+
  '<div class="ov-foot">'+esc(SSS_NOTE)+'</div>';
}
// Store Growth sub-pane content (store-count expansion + OXXO age comparison). Reused by Deep Dive.
function growthBody(){
  var maxI = STORE_YEARS.length - 1;
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
  return g;
}
// Legacy "Stores" body (nested SSS/Growth). Kept intact — content now also lives in the Deep Dive.
function storesBody(c){
  return '<div class="ovt-subtabs">'+
    '<button type="button" class="ovt-subtab active" data-ovst="sss">SSS</button>'+
    '<button type="button" class="ovt-subtab" data-ovst="growth">Store Growth</button>'+
  '</div>'+
  '<div class="ovt-subpane" data-ovst="sss">'+sssBody()+'</div>'+
  '<div class="ovt-subpane" data-ovst="growth" hidden>'+growthBody()+'</div>';
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

// Overview pane — the standardized 7-block Overview only. Everything deeper now lives in the
// sibling Deep Dive tab (ddHtml). Overview and Deep Dive are SIBLING profile tabs (§1), never nested.
function html(c){
  _co = c;   // capture company (id + ticker) for the Watch List DB wiring
  return '<div class="ov ov-tbbb" data-brand="TBBB" style="--brand:'+BRAND+';--brand-2:'+BRAND2+'">'+
    stdOverviewBody(c)+
  '</div>';
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
  if (key === 'sens') requestAnimationFrame(function(){ bbbSensitivity.init(root); });
  if (key === 'mgmt') requestAnimationFrame(function(){ bbbManagement.init(root); });
  if (key === 'ue') requestAnimationFrame(buildUeChart);
}

function init(c){
  // Scope to the Overview root specifically (the Deep Dive shares the .ov-tbbb class).
  var root = document.querySelector('.ov-tbbb:not(.ov-tbbb-dd)');
  if (!root) return;
  // Standardized Overview — live market cap for the Key Facts cell (Massive).
  tbbbLiveCap(root);
  // Standardized Overview — collapsible sections + inner "What is X?" accordions.
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick = function(){
    var cc = btn.parentElement; var open = cc.classList.toggle('open');
    var b = cc.querySelector('.ov-collap-b'); if(b) b.hidden = !open;
    var ic = btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent = open ? '▾' : '▸';
  }; });
  root.querySelectorAll('.acc-h').forEach(function(btn){ btn.onclick = function(){
    var b = btn.nextElementSibling; if(!b) return; var open = b.hidden; b.hidden = !open;
    var x = btn.querySelector('.acc-x'); if(x) x.textContent = open ? '–' : '+';
  }; });
  // Standardized Overview — products pop-up. Wire first, then hoist the modal to #co-detailview
  // so it stays visible from either profile tab (an inactive .copane is display:none).
  wireProducts(root);
  var detail = document.getElementById('co-detailview');
  if(detail){ var md = root.querySelector('#tbbbModalBack'); if(md && md.parentNode !== detail) detail.appendChild(md); }
  // Standardized Overview — competitors scatter (SVG renders even while its section is collapsed).
  wireBScatters(root);
}

// ═══ Deep Dive — sibling profile tab (docs/OVERVIEW_CONVENTIONS.md §1/§6) ════════════════════
// Amazon's 5-tab spine: Top Line · Bottom Line · Evolution · Valuation · Management. The existing
// TBBB tabs are RE-ARRANGED here (nothing deleted): Top Line = Stores (Growth/SSS) + Product Mix +
// General (Store Tour · Logistics · Competitive Landscape · BİM Blueprint); Bottom Line = Unit
// Economics; Evolution = blank scaffold (built later); Valuation = Sensitivity; Management = Management.
var DD_SOURCES = 'Sources: BBB Foods FY2025 annual report (Form 20-F) and investor relations; Summit DCF model (TBBB, snapshot 2026-05-22) for projections & sensitivity; competitor/logistics detail from company disclosures and cited research. Figures in Mexican pesos (Ps.) unless noted.';

function ddEmpty(){ return '<div class="dd-empty">🚧 <b>Evolution</b> — this section is being built.</div>'; }
function ddPending(title, msg){ return '<div class="dd-empty"><b>'+esc(title)+'</b><div style="margin-top:7px;font-weight:400;max-width:560px;margin-left:auto;margin-right:auto">'+esc(msg)+'</div></div>'; }

// ═══ Evolution — same divisions as Amazon (Earnings · Results · Estimates · Guidance · Strategy ·
// Timeline), per docs/EARNINGS_CONVENTIONS.md. Structure is built now; the data-heavy parts are
// labeled scaffolds pending TBBB's earnings data (transcripts + consensus export + Summit
// expectations). The Watch List is fully live via the shared engine (js/watchlist.js → Supabase).
var TBBB_IR_URL = 'https://investors.tiendas3b.com/';
var TBBB_EDGAR_URL = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001978954&type=&dateb=&owner=include&count=40';

var TBBB_LOGO_URL = 'https://assets.parqet.com/logos/symbol/TBBB';
var TBBB_SEC_SEAL = 'img/sec-seal.png';

// IR + EDGAR source cards (EARNINGS_CONVENTIONS §6 — mandatory first element of Earnings). Same
// professional format as GOOGL/AMZN: dark cards with the company mark as a bleeding watermark + a
// glowing emblem, and the federal-gold EDGAR variant with the SEC seal. Colors are Tiendas 3B's.
function bIRButton(){
  return '<style>'+
    '.ce-srcrow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 16px}@media(max-width:760px){.ce-srcrow{grid-template-columns:1fr}}'+
    '.ce-ir{display:flex;align-items:center;gap:20px;text-decoration:none;border-radius:18px;padding:26px 26px;min-height:120px;position:relative;overflow:hidden;'+
      'background:linear-gradient(115deg,#0B0404 0%,#1C0808 60%,#0B0404 100%);border:1px solid rgba(225,37,27,.30);box-shadow:0 10px 32px rgba(0,0,0,.4);transition:.18s}'+
    '.ce-ir:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,'+BRAND+','+BRAND2+');height:4px;top:0}'+
    '.ce-ir:hover{transform:translateY(-2px);box-shadow:0 16px 42px rgba(225,37,27,.4);border-color:rgba(225,37,27,.75)}'+
    '.ce-ir-wm{position:absolute;right:-40px;bottom:-60px;width:230px;height:230px;object-fit:contain;opacity:.10;pointer-events:none;transition:.25s}'+
    '.ce-ir:hover .ce-ir-wm{opacity:.17;transform:scale(1.04) rotate(-2deg)}'+
    '.ce-ir-ic{width:72px;height:72px;border-radius:50%;background:transparent;display:flex;align-items:center;justify-content:center;flex:none;position:relative;z-index:1;'+
      'box-shadow:0 0 0 1px rgba(255,160,150,.3),0 0 32px rgba(225,37,27,.5)}'+
    '.ce-ir-ic img{width:56px;height:56px;object-fit:contain;display:block;border-radius:12px;filter:drop-shadow(0 2px 10px rgba(0,0,0,.55))}'+
    '.ce-ir-body{flex:1;min-width:0;position:relative;z-index:1}'+
    '.ce-ir-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:#F0A6A0;display:flex;align-items:center;gap:7px}'+
    '.ce-ir-dot{width:7px;height:7px;border-radius:50%;background:'+BRAND2+';box-shadow:0 0 0 0 rgba(0,166,80,.7);animation:ceirp 1.6s infinite}'+
    '@keyframes ceirp{0%{box-shadow:0 0 0 0 rgba(0,166,80,.6)}70%{box-shadow:0 0 0 8px rgba(0,166,80,0)}100%{box-shadow:0 0 0 0 rgba(0,166,80,0)}}'+
    '.ce-ir-t{font-size:19px;font-weight:900;color:#fff;letter-spacing:.05em;text-transform:uppercase;margin-top:4px}'+
    '.ce-ir-s{font-size:11.5px;color:#C8A9A5;font-weight:600;margin-top:3px;letter-spacing:.01em}'+
    '.ce-ir-go{font-size:13px;font-weight:900;color:#fff;background:linear-gradient(135deg,#F0473D,'+BRAND+');border-radius:999px;padding:12px 22px;white-space:nowrap;flex:none;display:flex;align-items:center;gap:8px;position:relative;z-index:1;letter-spacing:.04em;transition:.14s}'+
    '.ce-ir:hover .ce-ir-go{gap:12px;box-shadow:0 4px 18px rgba(225,37,27,.55)}'+
    '@media(max-width:560px){.ce-ir{flex-wrap:wrap}.ce-ir-go{width:100%;justify-content:center}}'+
    '.ce-ir.edgar{background:linear-gradient(115deg,#070502 0%,#171106 60%,#070502 100%);border-color:rgba(197,164,90,.35)}'+
    '.ce-ir.edgar:before{background:linear-gradient(90deg,#8C6D2F,#E3C878,#8C6D2F)}'+
    '.ce-ir.edgar:hover{box-shadow:0 16px 42px rgba(197,164,90,.32);border-color:rgba(227,200,120,.75)}'+
    '.ce-ir.edgar .ce-ir-ic{box-shadow:0 0 0 1px rgba(227,200,120,.28),0 0 32px rgba(197,164,90,.55)}'+
    '.ce-ir.edgar .ce-ir-ic img{width:72px;height:72px;border-radius:0}'+
    '.ce-ir.edgar .ce-ir-k{color:#E3C878}'+
    '.ce-ir.edgar .ce-ir-dot{background:#E3C878;animation:none;box-shadow:0 0 8px rgba(227,200,120,.8)}'+
    '.ce-ir.edgar .ce-ir-go{background:linear-gradient(135deg,#E3C878,#B8933F);color:#1A1305}'+
    '.ce-ir.edgar:hover .ce-ir-go{box-shadow:0 4px 18px rgba(197,164,90,.6)}'+
    '.ce-ir.edgar .ce-ir-wm{opacity:.1}'+
    '.ce-ir.edgar:hover .ce-ir-wm{opacity:.17}'+
  '</style>'+
  '<div class="ce-srcrow">'+
  '<a class="ce-ir" href="'+TBBB_IR_URL+'" target="_blank" rel="noopener">'+
    '<img class="ce-ir-wm" src="'+TBBB_LOGO_URL+'" alt="" aria-hidden="true">'+
    '<span class="ce-ir-ic"><img src="'+TBBB_LOGO_URL+'" alt="Tiendas 3B logo" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="ce-ir-body">'+
      '<span class="ce-ir-k"><span class="ce-ir-dot"></span>THE SOURCE · EARNINGS HQ</span>'+
      '<span class="ce-ir-t" style="display:block">Tiendas 3B Investor Relations</span>'+
      '<span class="ce-ir-s" style="display:block">Releases · webcast · slides · reports — straight from the company. Skip the search, go direct.</span>'+
    '</span>'+
    '<span class="ce-ir-go">OPEN IR <span>↗</span></span>'+
  '</a>'+
  '<a class="ce-ir edgar" href="'+TBBB_EDGAR_URL+'" target="_blank" rel="noopener">'+
    '<img class="ce-ir-wm" src="'+TBBB_SEC_SEAL+'" alt="" aria-hidden="true">'+
    '<span class="ce-ir-ic"><img src="'+TBBB_SEC_SEAL+'" alt="SEC seal" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="ce-ir-body">'+
      '<span class="ce-ir-k"><span class="ce-ir-dot"></span>THE RECORD · U.S. SECURITIES AND EXCHANGE COMMISSION</span>'+
      '<span class="ce-ir-t" style="display:block">BBB Foods on EDGAR</span>'+
      '<span class="ce-ir-s" style="display:block">20-F · 6-K · 6-K/A — the regulator\'s copy, as filed (CIK 0001978954). What IR curates, EDGAR certifies.</span>'+
    '</span>'+
    '<span class="ce-ir-go">OPEN EDGAR <span>↗</span></span>'+
  '</a>'+
  '</div>';
}

// ── Post-Results — AI "Call summary — the minute" (renderers ported from meta/googl/amzn;
// data model results.summary = { paras:[{ p, more, moreLabel }] }; see docs/EARNINGS_CONVENTIONS §6c-ii).
function ceSumNodes(nodes, depth){
  if(!nodes || !nodes.length) return '';
  return '<div class="ce-sum-nodes">'+nodes.map(function(n){
    return '<details class="ce-sum-n" data-d="'+(depth>2?2:depth)+'">'+
      '<summary class="ce-sum-nt"><span class="ce-sum-caret">▸</span><span>'+n.t+'</span></summary>'+
      '<div class="ce-sum-nb">'+(n.body||'')+ceSumNodes(n.nodes, depth+1)+'</div>'+
    '</details>';
  }).join('')+'</div>';
}
function ceSumMore(more){
  if(!more) return '';
  if(typeof more === 'string') return more;
  return (more.body||'')+ceSumNodes(more.nodes, 1);
}
function bCallSummary(qLabel, s){
  if(!s || !s.paras || !s.paras.length) return '';
  var body = s.paras.map(function(pa){
    var p = '<div class="ce-sum-block"><p class="ce-sum-para">'+(pa.p||'')+'</p>';
    if(pa.more){
      p += '<details class="ce-sum-n ce-sum-more" data-d="0">'+
        '<summary class="ce-sum-nt"><span class="ce-sum-caret">▸</span><span>'+(pa.moreLabel||'＋ more — the detail behind this')+'</span></summary>'+
        '<div class="ce-sum-nb">'+ceSumMore(pa.more)+'</div>'+
      '</details>';
    }
    return p+'</div>';
  }).join('');
  return '<details class="ce-sum" open>'+
    '<summary class="ce-sum-h"><span class="ce-sum-ic">🧠</span><b>Call summary — the minute</b>'+
      '<span class="ce-sum-tag">AI-generated</span></summary>'+
    '<div class="ce-sum-body">'+
      '<div class="ce-sum-tools"><span class="ce-sum-tt">The summary is the text; each paragraph lands a point · open <b>＋ more</b> for the detail · hover a <span class="ce-gl" data-def="A term with a dashed underline — hover it to read its definition here.">dashed term</span> for its definition</span>'+
        '<button type="button" class="ce-sum-btn" data-sum="exp">⊕ Expand all</button>'+
        '<button type="button" class="ce-sum-btn" data-sum="col">⊖ Collapse all</button></div>'+
      body+
    '</div>'+
  '</details>';
}
function bPrintRecap(pr){
  return '<div class="ce-print">'+pr.map(function(c){
    return '<div class="ce-print-c"><div class="ce-print-k">'+esc(c[0])+'</div><div class="ce-print-v">'+esc(c[1])+'</div><div class="ce-print-d">'+esc(c[2])+'</div></div>';
  }).join('')+'</div>';
}

// The latest reported call — 1Q26 (May 7, 2026). Source: docs/calls/TBBB.md.
var TBBB_1Q26 = {
  q: '1Q26', date: 'May 7, 2026',
  print: [
    ['Revenue', 'Ps.23.0B', '+33% YoY'],
    ['Same-store sales', '+16%', 'vs 1Q25'],
    ['Stores', '3,469', '+123 net · LTM +580'],
    ['Adj. EBITDA', 'Ps.1.3B', '+39% (ex-SBC)'],
    ['Operating cash flow', 'Ps.2.0B', '+64% YoY'],
    ['Neg. working capital', 'Ps.9.4B', '~11.3% LTM rev'],
  ],
  summary: { paras: [
    { p:'<b>1Q26 was another clean, self-funded beat.</b> Revenue grew <b>+33% to Ps.23B</b> on <b><span class="ce-gl" data-def="Sales from stores open at least ~12 months — growth that is not just from opening new stores.">same-store sales</span> of +16%</b> and <b>123 net new stores</b> (LTM +580, ~+20% of the base) — 3,469 stores across 20 distribution centers. Reported EBITDA was Ps.554M, but <b>ex the non-cash <span class="ce-gl" data-def="Share-based compensation — stock/RSUs paid to employees. A real expense but non-cash, so management adds it back to show the operating trend.">SBC</span> charge, adjusted EBITDA rose +39% to Ps.1.3B</b> (margin +22bps). Operating cash flow jumped <b>+64% to Ps.2B</b>.',
      moreLabel:'＋ more — the self-funding engine',
      more:'Adjusted <span class="ce-gl" data-def="Suppliers are paid later than inventory takes to sell, so shoppers\' cash funds the business — a source of cash, not a drain.">negative working capital</span> reached <b>Ps.9.4B (~11.3% of LTM revenue)</b>, up from Ps.6.5B a year earlier ex-IPO. That is what keeps 3B\'s expansion self-funded — and EBITDA is the one line to read <i>adjusted</i>, where SBC is the wedge between the reported Ps.554M and the Ps.1.3B operating number.' },
    { p:'<b>The same-store-sales engine is 2/3 volume, 1/3 mix — not price.</b> Management split the +16% as ~two-thirds <b>volume</b> (transactions + SKUs per ticket) and one-third a higher <b>average price per SKU</b>, stressing the price piece is <b>mix-driven, not inflation</b> — internal inflation stays very low. The gap to <span class="ce-gl" data-def="ANTAD — Mexico\'s national retailers association; its same-store-sales index is the market benchmark.">ANTAD</span> is still <b>&gt;14 points</b>.',
      more:'Durability comes from an improving value proposition and rising 3B brand recognition — tracked through annual surveys of ~15,000 customers and non-customers — built on near-zero marketing (word of mouth + social media). The "stretching" expansion means new regions already know the brand before a store opens.' },
    { p:'<b>Margins levered even against Mexico\'s wage backdrop.</b> Commercial/gross margin expanded on <b>product mix + supplier efficiencies</b> (management flags it stays quarter-to-quarter volatile); sales expenses held at <b>10.3% of revenue</b> and <b>labor fell as a % of revenue despite the minimum-wage increase</b>, on relentless "hours-worked" efficiency work.',
      moreLabel:'＋ more — the wage / work-week setup',
      more:'The coming <b>work-week reduction (expected 2027)</b> was played down as manageable — more hours-worked efficiency. G&amp;A stays ~stable this year as they add DCs and HQ talent; long-run, management expects G&amp;A to keep declining as a % of revenue. The scale → purchasing-power → part-margin / part-price "virtuous circle" was reiterated. No SG&amp;A guidance is given.' },
    { p:'<b>The reinvestment is in talent, IT and new categories — not marketing.</b> Hatoum framed 3B as "an IT company selling groceries": the <b>ERP is a 3-year build, ~halfway through</b> (gradual, modular rollout by region), and <b>AI is "starting to take root"</b> on efficiency. Capex is guided at <b>~Ps.5.2B</b> for the year (stores + DCs + fleet).',
      moreLabel:'＋ more — the assortment tests',
      more:{ body:'About 60 products/lines are in test at any time. Three stand out:',
        nodes:[
          { t:'Fresh — the fruit & vegetable trial', body:'Shows a <b>ticket uplift</b> in test stores and looks likely to extend / retrofit — a category that lifts basket size without breaking the low-price model.' },
          { t:'Irrepetibles — the "treasure hunt"', body:'Spot buys that rotate ~every two weeks (bicycles, white/brown goods, clothing) keep gaining share — the "wow effect" that drives visit frequency.' },
          { t:'Private label — 58%, updated annually', body:'Was 58% of sales last quarter (updated once a year), trend up. Management sees <b>no structural change</b> at higher penetration (50→60→70%), citing <b>Bimbo as a "time machine"</b> for the end state.' } ] } },
    { p:'<b>The one calendar item: the IPO lock-up expires August 6, 2026.</b> Management clarified the date (the 20-F\'s "July 8" was an error they will amend) — the near-term share <span class="ce-gl" data-def="Shares that become sellable when a lock-up ends can pressure the price if holders sell — a technical, not a fundamental, factor.">overhang</span> to watch into the summer, against an operating story management called "a very strong start to a 2026 that looks very promising."' }
  ] }
};

// The 7 reported calls, newest first (source: docs/calls/TBBB.md). 1Q26 is the fully-detailed one;
// the priors carry a tighter 2-para summary. The quarter pills switch between them.
var TBBB_CALLS = [ TBBB_1Q26,
  { q:'FY2025', date:'Mar 12, 2026',
    print: [ ['Revenue (FY)','Ps.78.0B','+36% YoY'], ['Same-store sales (FY)','+18.3%','FY2025'], ['Stores','3,346','+574 net · record'], ['Adj. EBITDA (FY)','Ps.4.4B','+30% (ex-SBC/w-off)'], ['Operating cash flow (FY)','Ps.4.7B','+~25% YoY'], ['Q4 revenue','Ps.22.0B','+34% YoY'] ],
    summary: { paras: [
      { p:'<b>FY2025 closed the year at scale — Ps.78B revenue (+36%) on a record 574 net new stores.</b> Q4 revenue grew +34% to Ps.22B on <b>+16.6% same-store sales</b>; the full year printed <b>+18.3% SSS</b> and a 4-year revenue <span class="ce-gl" data-def="Compound annual growth rate — the smoothed yearly growth over a multi-year period.">CAGR</span> of 35%. Openings exceeded the 500–550 guide (574, +21% vs 2024).',
        more:'The updated spaghetti chart (2005–2024 cohorts, inflation-adjusted) shows newer cohorts opening higher and ramping steeper while older cohorts still grow. The ANTAD gap stayed &gt;15 points despite low internal inflation.' },
      { p:'<b>The one line to read adjusted: EBITDA.</b> Reported Q4 EBITDA was just Ps.79M and reported FY EBITDA Ps.1.2B — but <b>ex the non-cash <span class="ce-gl" data-def="Share-based compensation — a real but non-cash expense; management adds it back to show the operating trend.">SBC</span> charge and a one-time asset write-off</b>, Q4 adj. EBITDA rose +23% to Ps.1.2B and <b>FY adj. EBITDA +30% to Ps.4.4B</b>. FY operating cash flow reached Ps.4.7B (+~25%).',
        more:'Eduardo detailed the asset write-off and outlined 2026 guidance on the call. The reported-vs-adjusted wedge (SBC + write-off) is the quarter\'s only "read-it-clean" line.' } ] } },
  { q:'3Q25', date:'Nov 20, 2025',
    print: [ ['Revenue','Ps.20.3B','+36.7% YoY'], ['Same-store sales','+17.9%','series peak'], ['Stores','3,162','+131 net · 18 DCs'], ['Adj. EBITDA','Ps.1.2B','+43.6% (ex-SBC)'], ['9M cash flow','Ps.3.0B','+30% YoY'], ['Neg. working capital','Ps.7.8B','~10.8% of rev'] ],
    summary: { paras: [
      { p:'<b>Same-store sales hit the peak of the series — +17.9%.</b> Revenue grew +36.7% to Ps.20.3B on 131 net new stores (3,162 total, 18 DCs); the gap to <span class="ce-gl" data-def="ANTAD — Mexico\'s national retailers association; its same-store-sales index is the market benchmark.">ANTAD</span> widened to <b>~17 points</b>, the widest in the series. Older vintages still grow faster than inflation; ~half the base opened in the last three years.',
        more:'Management reiterated white space of no less than 14,000 stores, and noted older vintages\' EBITDA margins are "close to other hard discounters" — the consolidated leverage is masked by the opening pace.' },
      { p:'<b>Reported EBITDA went negative — entirely on non-cash SBC.</b> Reported EBITDA was a <b>Ps.404M loss</b>, but ex the SBC charge it rose <b>+43.6% to +Ps.1.2B</b>. 9M operating cash flow +30% to Ps.3.0B; adjusted negative working capital Ps.7.8B (~10.8% of revenue). Management leaned on the adjusted figure and the appendix schedule.' } ] } },
  { q:'2Q25', date:'Aug 12, 2025',
    print: [ ['Revenue','Ps.18.8B','+38.3% YoY'], ['Same-store sales','+17.7%','vs +10.7% 2Q24'], ['Stores','3,031','+142 net'], ['Adj. EBITDA','—','+32% (ex-SBC)'], ['1H cash flow','Ps.1.9B','+56% YoY'], ['ANTAD gap','15 pts','2Q25'] ],
    summary: { paras: [
      { p:'<b>The fastest revenue quarter of the series — +38.3% to Ps.18.8B.</b> Same-store sales jumped to <b>+17.7%</b> (from +10.7% a year earlier) on 142 net new stores (3,031 total); 1H openings 259 (vs 215). The ANTAD gap reached 15 points.',
        more:'The team added two hires — <b>Amparo Martínez</b> (General Counsel) and <b>Joaquín Ley</b> (Investor Relations). About 45% of the base opened in the last three years, so unit-level leverage is real but masked at the consolidated level by the opening pace.' },
      { p:'<b>Adjusted EBITDA +32%; the SBC schedule got spelled out.</b> Reported EBITDA +22.5% to Ps.844M, ex-SBC +32%; 1H operating cash flow +56% to Ps.1.9B. The <span class="ce-gl" data-def="Share-based compensation — stock/RSUs; a non-cash expense.">SBC</span> is a legacy 20-year plan (terminated at IPO) + a new post-IPO plan + a June board IPO-tied award — <b>none change the fully-diluted share count</b>; they only book non-cash expense on grant.' } ] } },
  { q:'1Q25', date:'May 8, 2025',
    print: [ ['Revenue','Ps.17.1B','+35.1% YoY'], ['Same-store sales','+13.5%','vs 1Q24'], ['Stores','2,889','+117 net · LTM 507'], ['Reported EBITDA','Ps.705M','+12.7% YoY'], ['Operating cash flow','Ps.1.1B','+49% YoY'], ['Neg. working capital','Ps.6.5B','~10.5% of rev'] ],
    summary: { paras: [
      { p:'<b>Growth accelerated into a softening market — +35% revenue, +13.5% same-store sales.</b> 117 net new stores (2,889 total, vs 94 in 1Q24); LTM openings 507 (vs 416). Operating cash flow +49% to Ps.1.1B.' },
      { p:'<b>Margins dipped on deliberate reinvestment — not a model change.</b> EBITDA +12.7% to Ps.705M, margin 4.9%→4.1%; admin +60bps (incl Ps.84M <span class="ce-gl" data-def="Share-based compensation — a non-cash expense.">SBC</span> ~50bps). The company is hiring for four new 2025 regions and raising HQ talent density (IT, purchasing, controls, legal) — "we pay the full cost of new stores in regions before we see the full revenues."' } ] } },
  { q:'FY2024', date:'Apr 10, 2025',
    print: [ ['Revenue (FY)','Ps.57.4B','+30.3% YoY'], ['Same-store sales (FY)','+13.4%','FY2024'], ['Stores (net new)','+484','+21% vs 2023'], ['Operating cash flow (FY)','Ps.3.75B','+19.4% YoY'], ['Q4 revenue','Ps.16.3B','+32.7% YoY'], ['Q4 SSS','+11.8%','vs ANTAD +2.6%'] ],
    summary: { paras: [
      { p:'<b>First full year as a public company — Ps.57.4B revenue (+30%) on 484 net new stores.</b> Q4 same-store sales +11.8% vs <span class="ce-gl" data-def="ANTAD — the Mexican retailers association; its SSS index is the market benchmark.">ANTAD</span>\'s +2.6%; FY SSS +13.4% despite falling inflation. FY operating cash flow +19.4% to Ps.3.75B; store count closed above the original guide.' },
      { p:'<b>The first post-IPO spaghetti chart told the vintage story.</b> 2005–2023 cohorts (inflation-adjusted): newer cohorts start higher and ramp steeper, none has flattened. For 5-year-plus stores, traffic +4.6% and ticket +3.6% — growth from both, private-label-led. "When the economy slows and cost of living rises, that tends to play in our favor."' } ] } },
  { q:'3Q24', date:'Nov 26, 2024',
    print: [ ['Revenue','Ps.14.8B','+29.8% YoY'], ['Same-store sales','+11.6%','3Q24'], ['Stores','2,634','+131 net'], ['EBITDA','Ps.688M','+54% YoY'], ['Gross margin','15.8%','flat YoY'], ['SG&A','13.4% of rev','−51 bps'] ],
    summary: { paras: [
      { p:'<b>The earliest call on file — +29.8% revenue, +11.6% same-store sales, EBITDA +54%.</b> 131 net new stores (2,634 total); 9-month openings +42% YoY; gross margin 15.8% (flat — priced SKU-by-SKU for volume × peso margin); SG&amp;A leverage to 13.4% (−51bps).',
        more:'~1,500 Neto stores sit next to a 3B; asked about Neto\'s rumored supplier-payment troubles, Hatoum declined to isolate a "Neto effect" ("walk into a 3B and a Neto and you\'ll see").' },
      { p:'<b>The framing that recurs on every call since.</b> No gross-margin target (the model keeps it flat, paired with a store sales curve); price changes flow through with an <b>8–18-month lag</b>; dollarized input costs pass through over the same window on peso weakness; unit-economics target capex ~Ps.3.9M/store; dividends "way too early"; long-term white space cited at up to 20,000 stores.' } ] } }
];

function bPostResultsBody(){
  var pills = TBBB_CALLS.map(function(c, i){
    return '<button type="button" class="ce-rqpill'+(i===0?' active':'')+'" data-rq="'+esc(c.q)+'">'+esc(c.q)+'</button>';
  }).join('');
  var blocks = TBBB_CALLS.map(function(c, i){
    return '<div class="ce-rqblock" data-rq="'+esc(c.q)+'"'+(i===0?'':' hidden')+'>'+
      '<p class="ov-lede" style="margin-top:0">The <b>'+esc(c.q)+'</b> print (reported '+esc(c.date)+'), distilled. The AI-generated <b>call summary</b> captures the call; the full beat/miss scorecard vs frozen expectations lands once the Setup freeze workflow is wired.</p>'+
      bPrintRecap(c.print)+
      bCallSummary(c.q, c.summary)+
    '</div>';
  }).join('');
  return '<div class="ce-rqpills">'+pills+'</div>'+blocks;
}

// The Earnings sub-pane: IR/EDGAR + 3 phases (Setup · Watch List · Post-Results).
function bEarningsBody(){
  return bIRButton()+
    '<div class="ce-note">🎯 <b>Earnings</b> — the decision layer, in three phases: <b>Setup</b> (go in ready — what we track and expect) → <b>Watch List</b> (the themes we carry across quarters) → <b>Post-Results</b> (the print scored against what we froze). The Watch List is live; Setup &amp; Post-Results fill once we load TBBB\'s earnings data.</div>'+
    '<div class="ce-phtabs">'+
      '<button type="button" class="ce-phtab active" data-cep="setup">Setup</button>'+
      '<button type="button" class="ce-phtab" data-cep="watch">Watch List</button>'+
      '<button type="button" class="ce-phtab" data-cep="results">Post-Results</button>'+
    '</div>'+
    '<div class="ce-phpane" data-cep="setup">'+
      '<p class="ov-lede" style="margin-top:0">The tracked KPIs going into a print — reported actuals against the <b>Summit model</b> and, on Revenue, <b>Street consensus</b> (Bloomberg), by year. Pick a line, window the range with the lever, read the surprise in the table.</p>'+
      resultsHtml('TBBB_SETUP')+
    '</div>'+
    '<div class="ce-phpane" data-cep="watch" hidden>'+bWatchBody()+'</div>'+
    '<div class="ce-phpane" data-cep="results" hidden>'+bPostResultsBody()+'</div>';
}

// ── Guidance — 3B guides only what it controls (store openings every year; +revenue growth &
// per-store capex for 2026) and has BEATEN its store-opening guide every year. It deliberately
// does NOT guide margins / EBITDA / SG&A. Source: docs/calls/TBBB.md + the 20-F.
var GD_TRACK = [
  { y:'FY2024', lo:380, hi:420, act:484 },
  { y:'FY2025', lo:500, hi:550, act:574 },
  { y:'FY2026', lo:590, hi:630, act:null }
];
var GD_CARDS = [
  ['Store openings', '590–630', 'net new · +3–10% over the 574 opened in 2025'],
  ['Revenue growth', '+29% to +32%', '1Q26 printed +33% — running above the top'],
  ['Capex / store', '~Ps.5.5M', 'up from ~Ps.3.9M (bigger-store mix) · ~26-month payback'],
  ['Total capex (FY26)', '~Ps.5.2B', 'stores + distribution centers + fleet']
];
var GD_NOT = [
  ['Gross margin', 'Priced SKU-by-SKU for volume × peso margin — deliberately volatile, <b>no target</b> (~16%).'],
  ['EBITDA', '"We don\'t drive to an EBITDA" — it is a <b>consequence</b>, not a target.'],
  ['SG&amp;A', '"We don\'t provide specific guidance on SG&amp;A" — long run it declines as a % of revenue.']
];
function bGuidanceBody(){
  var MAX = 700;
  var track = GD_TRACK.map(function(g){
    var band = '<div class="gd-band" style="left:'+(g.lo/MAX*100).toFixed(1)+'%;width:'+((g.hi-g.lo)/MAX*100).toFixed(1)+'%"></div>';
    var mark = g.act!=null ? '<div class="gd-mark" style="left:'+(g.act/MAX*100).toFixed(1)+'%" title="Delivered '+g.act+'"></div>' : '';
    var res = g.act==null ? '<span class="gd-res prog">in progress</span>'
      : '<span class="gd-res '+(g.act>g.hi?'beat':'miss')+'">'+(g.act>g.hi?'▲ beat':'▼ miss')+' · +'+Math.round((g.act/g.hi-1)*100)+'% vs top</span>';
    return '<div class="gd-row"><div class="gd-yr">'+esc(g.y)+'</div>'+
      '<div class="gd-bar">'+band+mark+'</div>'+
      '<div class="gd-nums"><b>'+g.lo+'–'+g.hi+'</b>'+(g.act!=null?' → <b>'+g.act+'</b>':'')+'</div>'+ res +'</div>';
  }).join('');
  var cards = GD_CARDS.map(function(c){ return '<div class="gd-card"><div class="gd-k">'+esc(c[0])+'</div><div class="gd-v">'+esc(c[1])+'</div><div class="gd-d">'+esc(c[2])+'</div></div>'; }).join('');
  var not = GD_NOT.map(function(n){ return '<div class="gd-not-row"><span class="gd-nochip">'+n[0]+'</span><span class="gd-not-d">'+n[1]+'</span></div>'; }).join('');
  return '<p class="ov-lede" style="margin-top:0">3B guides <b>only what it controls</b> — store openings (every year) plus, for 2026, revenue growth and per-store capex. It deliberately does <b>not</b> guide margins, EBITDA or SG&amp;A. And it has <b>beaten its store-opening guide every year since the IPO.</b></p>'+
    '<div class="ov-sec-h">Store-opening guidance vs delivered</div>'+
    '<div class="gd-track">'+track+'</div>'+
    '<div class="gd-scale"><span>0</span><span>350</span><span>700 stores</span></div>'+
    '<div class="ov-sec-h" style="margin-top:20px">Current guidance — FY2026</div>'+
    '<div class="gd-cards">'+cards+'</div>'+
    '<div class="ov-sec-h" style="margin-top:20px">What management does NOT guide</div>'+
    '<div class="gd-not">'+not+'</div>'+
    '<div class="ov-foot">Sources: BBB Foods FY2024 & FY2025 earnings calls and Form 20-F — store-opening guides (380–420 / 500–550 / 590–630), the FY2026 revenue-growth guide (+29–32%), ~Ps.5.5M/store capex and ~26-month payback. See docs/calls/TBBB.md.</div>';
}

// Evolution body — the 6 Amazon sub-tabs. Earnings (Watch List live), Results & Estimates (engine),
// Guidance (authored) are built; Strategy / Timeline are scaffolds until authored.
function bEvolutionBody(c){
  return '<div class="dd-subtabs">'+
    '<button type="button" class="dd-subtab active" data-dds="earnings">Earnings</button>'+
    '<button type="button" class="dd-subtab" data-dds="results">Results</button>'+
    '<button type="button" class="dd-subtab" data-dds="estimates">Estimates</button>'+
    '<button type="button" class="dd-subtab" data-dds="guidance">Guidance</button>'+
    '<button type="button" class="dd-subtab" data-dds="strategy">Strategy</button>'+
    '<button type="button" class="dd-subtab" data-dds="timeline">Timeline</button>'+
  '</div>'+
  '<div class="dd-subpane" data-dds="earnings">'+bEarningsBody()+'</div>'+
  '<div class="dd-subpane" data-dds="results" hidden>'+
    '<p class="ov-lede" style="margin-top:0">The <b>track record</b> — reported actuals against the <b>Summit model</b> and, on revenue, <b>Street consensus</b> (Bloomberg), across the full history and forward years. Pick a KPI, window the range with the lever, read the surprise in the table.</p>'+
    resultsHtml('TBBB')+
  '</div>'+
  '<div class="dd-subpane" data-dds="estimates" hidden>'+
    '<p class="ov-lede" style="margin-top:0">The <b>estimate itself, moving</b> — how the Street’s (Bloomberg) forecast for each fiscal year has been revised across 11 snapshots (Apr 2024 → Aug 2026). Toggle Ps. ⇄ % (implied growth); hover a point for the revision vs the prior snapshot.</p>'+
    resultsEvoHtml('TBBB')+
  '</div>'+
  '<div class="dd-subpane" data-dds="guidance" hidden>'+bGuidanceBody()+'</div>'+
  '<div class="dd-subpane" data-dds="strategy" hidden>'+ddEmptyLabel('Strategy')+'</div>'+
  '<div class="dd-subpane" data-dds="timeline" hidden>'+ddEmptyLabel('Timeline')+'</div>';
}
function ddEmptyLabel(name){ return '<div class="dd-empty">🚧 <b>'+esc(name)+'</b> — this section is being built.</div>'; }

// ── WL_ROWS — the Watch List: ONE flat table of themes we carry across quarters (§6f), authored
// from the calls (docs/calls/TBBB.md). Same shape as amzn/meta: { theme, tags, trackSince,
// trackUntil (null = open/live), definition, seededBy:{q,n}, src, thread:[{q,n}] }. LIVE hooks are
// what we hunt going into 2Q26 (seeded from the 1Q26 call); CLOSED hooks stay as the record.
var WL_ROWS_TBBB = [
  // ── LIVE — going into 2Q26 (seeded from 1Q26's newQuestions) ──
  { q:'2Q26', theme:'The Aug 6 lock-up expiry & share overhang', tags:['lockup','technical','shares'],
    trackSince:'1Q26', trackUntil:null,
    definition:'The IPO lock-up expires <b>Aug 6, 2026</b> (the 20-F\'s July 8 date is being amended). It frees pre-IPO/insider shares to trade — a potential technical overhang into H2, independent of the operating story. The tell is how many shares actually come to market and how the stock absorbs it.',
    seededBy:{ q:'1Q26', n:'When exactly does the lock-up expire and how should investors think about the overhang?' },
    src:'1Q26 call: Hatoum clarified Aug 6 (not July 8); the 20-F will be amended.',
    thread:[ {q:'1Q26', n:'Lock-up expiry clarified to Aug 6, 2026 — the one near-term technical.'} ] },
  { q:'2Q26', theme:'Gross-margin durability — the deliberately volatile line', tags:['margin','mix','suppliers'],
    trackSince:'3Q24', trackUntil:null,
    definition:'3B prices <b>SKU-by-SKU for volume × peso margin</b>, so gross margin (~16%) is volatile with no target. The hook tracks whether the mix + supplier-efficiency tailwind keeps margin roughly stable as private label rises — or whether price reinvestment pulls it down (which management calls a win if volume follows).',
    seededBy:{ q:'1Q26', n:'Sources of commercial-margin expansion — mix, terms, or efficiencies — and how durable?' },
    src:'Recurring since 3Q24; 1Q26 attributed the expansion to mix + supplier efficiencies, flagged as quarter-to-quarter volatile.',
    thread:[ {q:'3Q24', n:'GM 15.8% (flat); 16.7% the prior quarter — "no target, it fluctuates."'}, {q:'1Q26', n:'Commercial margin expanded on mix + supplier efficiencies.'} ] },
  { q:'2Q26', theme:'Fresh / F&V rollout + Irrepetibles share', tags:['categories','fresh','mix'],
    trackSince:'1Q26', trackUntil:null,
    definition:'New categories that lift basket size without breaking the low-price model: the <b>fresh fruit-&-vegetable trial</b> (ticket uplift, likely to extend/retrofit) and <b>Irrepetibles</b> ("treasure-hunt" spot buys). The tell is whether these move from "promising trial" to a disclosed contributor to same-store sales.',
    seededBy:{ q:'1Q26', n:'Fresh-trial specifics + the opportunity to extend/retrofit; how Irrepetibles evolve.' },
    src:'1Q26: ~60 lines in test at any time; F&V shows a ticket uplift; Irrepetibles selling bicycles, appliances, clothing.',
    thread:[ {q:'1Q26', n:'F&V trial promising (ticket uplift); Irrepetibles gaining share.'} ] },
  { q:'2Q26', theme:'G&A trajectory as DCs + HQ talent scale', tags:['sga','opex','leverage'],
    trackSince:'1Q25', trackUntil:null,
    definition:'Consolidated SG&A leverage is masked by the accelerating opening pace (new regions carry full cost before full revenue). The hook tracks whether admin/G&A stays ~stable this year (as guided) and resumes its long-run decline as a % of revenue, with labor leverage holding through the minimum-wage increases.',
    seededBy:{ q:'1Q26', n:'The G&A trajectory this year as DCs + HQ talent are added.' },
    src:'1Q26: labor fell as a % of revenue despite the wage hike; G&A ~stable this year, long-run declining.',
    thread:[ {q:'1Q25', n:'Admin +60bps on region hiring + SBC.'}, {q:'1Q26', n:'Sales exp 10.3%; labor leverage held through the wage hike.'} ] },
  { q:'2Q26', theme:'Work-week reduction cost prep (2027)', tags:['labor','regulation'],
    trackSince:'1Q26', trackUntil:null,
    definition:'Mexico\'s coming <b>work-week reduction (expected 2027)</b> raises labor cost per hour. Management plays it down — more "hours-worked" efficiency — but the hook tracks whether store-level productivity keeps absorbing wage + work-week pressure without denting the low-cost model.',
    seededBy:{ q:'1Q26', n:'Is the work-week reduction manageable via hours-worked efficiency?' },
    src:'1Q26: "when it happens, next year… not a big concern; we drive efficiencies at store level."',
    thread:[ {q:'1Q26', n:'Work-week reduction expected 2027; framed as manageable.'} ] },
  { q:'2Q26', theme:'Private-label penetration at the annual update', tags:['private-label','mix','margin'],
    trackSince:'3Q24', trackUntil:null,
    definition:'Private label was <b>58% of sales</b> at the last annual update, trending up. Management sees no structural change at higher penetration (50→60→70%), citing Bimbo as the "time machine." The hook is the next annual print and whether the mix shift keeps lifting both customer value and 3B\'s margin.',
    seededBy:{ q:'1Q26', n:'Private-label % this quarter and any threshold effects at higher penetration.' },
    src:'1Q26: updated once a year; 58% last quarter, trend up; "no structural change" 50→70%.',
    thread:[ {q:'1Q26', n:'58% at last update; no structural change at higher penetration.'} ] },
  // ── CLOSED — the record (hooks scored against results) ──
  { q:'1Q26', theme:'SSS durability — mix, not inflation', tags:['sss','volume','mix'],
    trackSince:'3Q24', trackUntil:'1Q26',
    definition:'The whole story rides on same-store sales staying double-digit and being <b>volume/mix-led, not price/inflation</b>. Scored HELD: +16% in 1Q26, ~2/3 volume, ANTAD gap &gt;14pts.',
    seededBy:{ q:'4Q25', n:'Does SSS hold ~mid-teens and stay volume-led?' },
    src:'1Q26: +16%, split ~2/3 volume · 1/3 mix (not inflation); ANTAD gap &gt;14 points.',
    thread:[ {q:'3Q25', n:'+17.9% (series peak).'}, {q:'4Q25', n:'+16.6% Q4 / +18.3% FY.'}, {q:'1Q26', n:'+16%, 2/3 volume — HELD.'} ] },
  { q:'1Q26', theme:'Reported vs adjusted EBITDA — the SBC wedge', tags:['ebitda','sbc','margin'],
    trackSince:'2Q25', trackUntil:'1Q26',
    definition:'A growing non-cash <b>share-based-compensation</b> charge pushed <i>reported</i> EBITDA to a loss in 3Q25 and near-zero in 4Q25; the operating trend only shows in the <i>adjusted</i> figure. The hook tracks whether adjusted EBITDA keeps compounding as the SBC schedule rolls off.',
    seededBy:{ q:'4Q25', n:'Does adjusted EBITDA keep compounding as SBC declines?' },
    src:'1Q26: reported Ps.554M vs adjusted Ps.1.3B (+39%); the SBC schedule declines through 2029.',
    thread:[ {q:'3Q25', n:'Reported LOSS Ps.404M; adj. +43.6%.'}, {q:'4Q25', n:'Reported Ps.79M; adj. +23%.'}, {q:'1Q26', n:'Reported Ps.554M; adj. +39% — wedge narrowing.'} ] }
];

function bWatchCard(w){
  var live = !w.trackUntil;
  var chips = (w.tags||[]).map(function(t){ return '<span class="wl2-chip tag">#'+esc(t)+'</span>'; }).join('')+
    (w.trackSince?'<span class="wl2-chip since"><b>Since:</b> '+esc(w.trackSince)+'</span>':'')+
    (w.trackUntil?'<span class="wl2-chip until"><b>Until:</b> '+esc(w.trackUntil)+'</span>':'');
  var thread = (w.thread&&w.thread.length)?'<p class="wl2-more-h">The thread — how it evolved:</p>'+
    w.thread.map(function(t){ return '<div class="wl2-thread"><b>'+esc(t.q)+'</b><span>'+t.n+'</span></div>'; }).join('') : '';
  var more = (w.seededBy||w.src||thread)?
    '<details class="wl2-more"><summary class="wl2-more-s"><span class="wl2-caret">▸</span>'+(w.thread?'the thread':'background')+' ›</summary><div class="wl2-more-b">'+
      (w.seededBy?'<p><b>Seeded by '+esc(w.seededBy.q)+':</b> "'+esc(w.seededBy.n)+'"</p>':'')+
      (w.src?'<p><b>Why it earned a slot:</b> '+w.src+'</p>':'')+ thread +
    '</div></details>' : '';
  return '<div class="wl2-card" data-tags="'+esc((w.tags||[]).join(' '))+'">'+
    '<div class="wl2-top"><span class="wl2-dot"></span><div class="wl2-title">'+esc(w.theme)+'</div>'+
      (w.seededBy?'<span class="wl2-seed" title="'+esc(w.seededBy.n)+'">seeded by '+esc(w.seededBy.q)+'</span>':'')+
      '<span class="wl2-qchip '+(live?'live':'closed')+'">'+(live?'live':'closed · '+esc(w.trackUntil))+'</span>'+
    '</div>'+
    (w.definition?'<div class="wl2-def">'+w.definition+'</div>':'')+
    '<div class="wl2-chips">'+chips+'</div>'+ more +
  '</div>';
}
function bWatchBody(){
  var live = WL_ROWS_TBBB.filter(function(w){ return !w.trackUntil; });
  var closed = WL_ROWS_TBBB.filter(function(w){ return w.trackUntil; });
  var tags = []; WL_ROWS_TBBB.forEach(function(w){ (w.tags||[]).forEach(function(t){ if(tags.indexOf(t)<0) tags.push(t); }); });
  var tagbar = '<div class="wl2-tagbar"><span class="wl2-bark">Filter by theme</span>'+
    '<button type="button" class="wl2-tag active" data-wtag="">All</button>'+
    tags.map(function(t){ return '<button type="button" class="wl2-tag" data-wtag="'+esc(t)+'">#'+esc(t)+'</button>'; }).join('')+'</div>';
  var note = '<div class="ce-note">🎯 <b>Watch List</b> — the themes we carry across quarters. The <b>live</b> list is what we hunt going into the next print (2Q26), seeded from the 1Q26 call; <b>closed</b> hooks stay as the record. Tap <b>the thread ›</b> to see how a theme evolved. (Authored from docs/calls/TBBB.md.)</div>';
  function grp(title, sub, rows){ return rows.length ? '<div class="wl2-grouph">'+esc(title)+' <span>'+esc(sub)+'</span></div>'+rows.map(bWatchCard).join('') : ''; }
  return note + tagbar + grp('Live — going into 2Q26', live.length+' open hooks', live) + grp('Closed — the record', 'scored against results', closed);
}
// Wire the Watch List tag filter (native <details> handle the "the thread" expanders).
function bWireWatch(pane){
  var cards = pane.querySelectorAll('.wl2-card');
  pane.querySelectorAll('.wl2-tag').forEach(function(btn){ btn.onclick = function(){
    var t = btn.getAttribute('data-wtag');
    pane.querySelectorAll('.wl2-tag').forEach(function(b){ b.classList.toggle('active', b === btn); });
    cards.forEach(function(c){ var has = !t || (' '+c.getAttribute('data-tags')+' ').indexOf(' '+t+' ') >= 0; c.hidden = !has; });
  }; });
}
// Build the Setup chart (shared Results engine, TBBB_SETUP dataset) when its phase is visible.
function bBuildSetupChart(pane){
  var wrap = pane.querySelector('.ce-phpane[data-cep="setup"] .rs-wrap');
  if(wrap) requestAnimationFrame(function(){ initResults(wrap, 'TBBB_SETUP'); });
}
// Wire the Earnings phase tabs + build the Setup chart / mount the Watch List when a phase opens.
function bEarningsInit(root){
  var pane = root.querySelector('.dd-subpane[data-dds="earnings"]'); if(!pane) return;
  pane.querySelectorAll('.ce-phtab').forEach(function(btn){ btn.onclick = function(){
    var key = btn.getAttribute('data-cep');
    pane.querySelectorAll('.ce-phtab').forEach(function(b){ b.classList.toggle('active', b === btn); });
    pane.querySelectorAll('.ce-phpane').forEach(function(p){ p.hidden = (p.getAttribute('data-cep') !== key); });
    if(key === 'setup') bBuildSetupChart(pane);
    if(key === 'watch') bWireWatch(pane);
    if(key === 'results') bWireSummary(pane);
  }; });
  var act = pane.querySelector('.ce-phtab.active'), akey = act ? act.getAttribute('data-cep') : 'setup';
  if(akey === 'setup') bBuildSetupChart(pane);
  if(akey === 'watch') bMountWL(pane);
  if(akey === 'results') bWireSummary(pane);
  bWireSummary(pane);   // wire the summary buttons up-front too (the pane exists even while hidden)
}
// Post-Results wiring: the quarter selector + each summary's Expand-all / Collapse-all.
function bWireSummary(pane){
  // Quarter pills — switch which call's print + summary is shown.
  pane.querySelectorAll('.ce-rqpill').forEach(function(btn){ btn.onclick = function(){
    var q = btn.getAttribute('data-rq');
    pane.querySelectorAll('.ce-rqpill').forEach(function(b){ b.classList.toggle('active', b === btn); });
    pane.querySelectorAll('.ce-rqblock').forEach(function(bl){ bl.hidden = (bl.getAttribute('data-rq') !== q); });
  }; });
  // Expand-all / Collapse-all — toggles only the inner dropdown nodes of THIS summary box.
  pane.querySelectorAll('.ce-sum-btn').forEach(function(btn){ btn.onclick = function(e){
    e.preventDefault();
    var box = btn.closest('.ce-sum'); if(!box) return;
    var open = (btn.getAttribute('data-sum') === 'exp');
    box.querySelectorAll('details.ce-sum-n').forEach(function(d){ d.open = open; });
  }; });
}

function ddHtml(c){
  _co = c;   // capture company (id + ticker) for the Watch List DB wiring
  var h = '<div class="ov ov-tbbb ov-tbbb-dd" data-brand="TBBB" style="--brand:'+BRAND+';--brand-2:'+BRAND2+'">';
  h += '<style>'+
    '.dd-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 14px;border-bottom:1px solid var(--bdr)}'+
    '.dd-tab{border:none;background:transparent;font:inherit;font-size:12.5px;font-weight:700;color:var(--mu);padding:9px 14px;cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1px}'+
    '.dd-tab:hover{color:var(--navy)}.dd-tab.active{color:'+BRAND2+';border-bottom-color:'+BRAND+'}'+
    '.dd-pane[hidden]{display:none}'+
    '.dd-subtabs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px}'+
    '.dd-subtab{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11.5px;font-weight:700;color:var(--mu);padding:6px 12px;border-radius:999px;cursor:pointer}'+
    '.dd-subtab:hover{color:var(--navy)}.dd-subtab.active{background:var(--navy);color:#fff;border-color:var(--navy)}'+
    '.dd-subpane[hidden]{display:none}'+
    '.dd-empty{border:1px dashed var(--bdr);border-radius:12px;padding:40px 20px;text-align:center;color:var(--mu);font-size:12.5px;background:var(--w)}'+
    // Evolution ▸ Earnings — note + phase tabs (the IR/EDGAR source cards bring their own <style>)
    '.ce-note{font-size:11.5px;color:var(--navy);line-height:1.55;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px;padding:11px 13px;margin:0 0 14px}.ce-note b{font-weight:800}'+
    '.ce-phtabs{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin:0 0 14px;gap:2px}'+
    '.ce-phtab{border:none;background:transparent;font:inherit;font-size:11px;font-weight:800;color:var(--mu);padding:5px 14px;border-radius:999px;cursor:pointer}'+
    '.ce-phtab:hover{color:var(--navy)}.ce-phtab.active{background:'+BRAND+';color:#fff}'+
    '.ce-phpane[hidden]{display:none}'+
    // Post-Results — print recap tiles
    '.ce-print{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin:0 0 14px}'+
    '.ce-print-c{border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:10px;padding:10px 12px;background:var(--w)}'+
    '.ce-print-k{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)}'+
    '.ce-print-v{font-size:15px;font-weight:800;color:var(--navy);margin-top:3px}'+
    '.ce-print-d{font-size:10px;color:var(--mu);margin-top:1px}'+
    // Post-Results — AI "Call summary — the minute" (ported from meta/googl/amzn)
    '.ce-sum{border:1px solid var(--bdr);border-radius:12px;background:#fff;margin:2px 0 14px}'+
    '.ce-sum>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:9px;padding:11px 14px;border-radius:12px;background:linear-gradient(180deg,rgba(122,90,248,.06),transparent)}'+
    '.ce-sum>summary::-webkit-details-marker{display:none}'+
    '.ce-sum-ic{font-size:15px}.ce-sum-h b{font-size:13px;color:var(--navy)}'+
    '.ce-sum-tag{font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;color:#7A5AF8;background:rgba(122,90,248,.12);border:1px solid rgba(122,90,248,.25);border-radius:999px;padding:2px 8px;margin-left:auto}'+
    '.ce-sum[open]>summary{border-bottom:1px solid var(--bdr);border-radius:12px 12px 0 0}'+
    '.ce-sum-body{padding:12px 15px 15px}'+
    '.ce-sum-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:11px}'+
    '.ce-sum-tt{font-size:10px;color:var(--mu);font-weight:600;margin-right:auto}'+
    '.ce-sum-btn{font-size:9.5px;font-weight:800;color:#2E6BE6;border:1px solid var(--bdr);background:#fff;border-radius:999px;padding:3px 10px;cursor:pointer;transition:.12s}'+
    '.ce-sum-btn:hover{border-color:#2E6BE6;background:rgba(46,107,230,.06)}'+
    '.ce-sum-block{margin:0 0 13px}'+
    '.ce-sum-para{font-size:12.5px;line-height:1.7;color:var(--navy);font-weight:500;margin:0}'+
    '.ce-sum-more{border:0!important;background:transparent!important;border-radius:0;margin:5px 0 0}'+
    '.ce-sum-more>.ce-sum-nt{padding:2px 0;font-size:10px;font-weight:800;color:#2E6BE6;text-transform:none}'+
    '.ce-sum-more>.ce-sum-nt .ce-sum-caret{color:#2E6BE6}'+
    '.ce-sum-more>.ce-sum-nb{padding:7px 0 4px 13px;border-left:2px dashed var(--bdr);margin-top:5px;font-size:11.5px;line-height:1.65}'+
    '.ce-sum-nodes{display:flex;flex-direction:column;gap:6px}'+
    '.ce-sum-n{border:1px solid var(--bdr);border-left:3px solid #2E6BE6;border-radius:9px;background:#FBFCFE}'+
    '.ce-sum-n[data-d="1"]{border-left-color:'+BRAND2+';background:#fff}'+
    '.ce-sum-n[data-d="2"]{border-left-color:#B7791F}'+
    '.ce-sum-nt{list-style:none;cursor:pointer;display:flex;align-items:center;gap:7px;padding:8px 11px;font-size:11.5px;font-weight:700;color:var(--navy)}'+
    '.ce-sum-nt::-webkit-details-marker{display:none}'+
    '.ce-sum-caret{font-size:9px;color:var(--mu);transition:transform .15s;flex:none}'+
    '.ce-sum-n[open]>.ce-sum-nt .ce-sum-caret{transform:rotate(90deg)}'+
    '.ce-sum-nb{padding:0 12px 11px 21px;font-size:11px;line-height:1.65;color:var(--navy);font-weight:500}'+
    '.ce-sum-nb .ce-sum-nodes{margin-top:9px}'+
    '.ce-gl{border-bottom:1px dashed #2E6BE6;cursor:help;position:relative}'+
    '.ce-gl:hover::after{content:attr(data-def);position:absolute;left:0;bottom:calc(100% + 8px);width:min(300px,74vw);white-space:normal;text-align:left;background:#10141A;color:#fff;font-size:10.5px;font-weight:500;line-height:1.55;padding:9px 12px;border-radius:9px;box-shadow:0 10px 28px rgba(16,24,40,.28);z-index:60}'+
    '.ce-gl:hover::before{content:"";position:absolute;left:16px;bottom:calc(100% + 3px);border:5px solid transparent;border-top-color:#10141A;z-index:61}'+
    // Post-Results — quarter selector pills
    '.ce-rqpills{display:flex;flex-wrap:wrap;gap:5px;margin:0 0 14px}'+
    '.ce-rqpill{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);padding:5px 11px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-rqpill:hover{color:var(--navy);border-color:'+BRAND+'}'+
    '.ce-rqpill.active{background:'+BRAND+';color:#fff;border-color:'+BRAND+'}'+
    '.ce-rqblock[hidden]{display:none}'+
    // Watch List — theme cards + tag filter + thread (WL_ROWS, amzn/meta style)
    '.wl2-tagbar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0 0 12px;padding:9px 12px;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px}'+
    '.wl2-bark{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)}'+
    '.wl2-tag{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.wl2-tag:hover{color:var(--navy)}.wl2-tag.active{background:'+BRAND+';color:#fff;border-color:'+BRAND+'}'+
    '.wl2-grouph{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--navy);margin:16px 0 8px}.wl2-grouph span{color:var(--mu);font-weight:600;text-transform:none;letter-spacing:0}'+
    '.wl2-card{border:1px solid var(--bdr);border-left:3px solid '+BRAND+';border-radius:10px;background:var(--w);padding:12px 14px;margin:0 0 8px}.wl2-card[hidden]{display:none}'+
    '.wl2-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}'+
    '.wl2-dot{width:7px;height:7px;border-radius:50%;background:'+BRAND+';flex:none}'+
    '.wl2-title{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.wl2-seed{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:#7A5AF8;background:rgba(122,90,248,.08);border:1px solid rgba(122,90,248,.28);border-radius:999px;padding:2px 8px}'+
    '.wl2-qchip{font-size:9px;font-weight:800;border-radius:999px;padding:2px 9px;margin-left:auto;flex:none}'+
    '.wl2-qchip.live{background:rgba(0,166,80,.12);color:#00873f;border:1px solid rgba(0,166,80,.3)}'+
    '.wl2-qchip.closed{background:#EEF1F4;color:var(--mu);border:1px solid var(--bdr)}'+
    '.wl2-def{font-size:11.5px;line-height:1.6;color:var(--navy);margin:8px 0 0}.wl2-def b{font-weight:800}'+
    '.wl2-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}'+
    '.wl2-chip{font-size:9.5px;font-weight:700;border-radius:999px;padding:2px 8px;border:1px solid var(--bdr);color:var(--mu);background:#F7F9FB}'+
    '.wl2-chip.tag{color:#7A5AF8;border-color:rgba(122,90,248,.25)}.wl2-chip.since b,.wl2-chip.until b{color:var(--navy)}'+
    '.wl2-more{margin-top:9px}'+
    '.wl2-more-s{list-style:none;cursor:pointer;font-size:10px;font-weight:800;color:#2E6BE6;display:flex;align-items:center;gap:5px}.wl2-more-s::-webkit-details-marker{display:none}'+
    '.wl2-caret{font-size:8px;transition:transform .15s}.wl2-more[open] .wl2-caret{transform:rotate(90deg)}'+
    '.wl2-more-b{padding:9px 0 2px;font-size:11px;line-height:1.6;color:var(--navy)}.wl2-more-b p{margin:0 0 7px}.wl2-more-h{font-weight:800;margin:0 0 4px}'+
    '.wl2-thread{display:flex;gap:9px;padding:4px 0;border-bottom:1px solid var(--bdr);font-size:11px;line-height:1.5}.wl2-thread b{white-space:nowrap;color:'+BRAND+'}'+
    // Guidance — track record bars + guide cards + not-guided list
    '.gd-track{border:1px solid var(--bdr);border-radius:12px;background:var(--w);padding:4px 14px;margin-top:8px}'+
    '.gd-row{display:grid;grid-template-columns:60px 1fr 118px 150px;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--bdr)}.gd-row:last-child{border-bottom:none}'+
    '@media(max-width:640px){.gd-row{grid-template-columns:52px 1fr;grid-auto-rows:auto}.gd-nums,.gd-res{grid-column:2}}'+
    '.gd-yr{font-size:12px;font-weight:800;color:var(--navy)}'+
    '.gd-bar{position:relative;height:14px;background:#F2F5F8;border-radius:7px}'+
    '.gd-band{position:absolute;top:0;height:14px;background:rgba(46,107,230,.20);border:1px solid rgba(46,107,230,.5);border-radius:7px}'+
    '.gd-mark{position:absolute;top:-3px;width:3px;height:20px;background:'+BRAND+';border-radius:2px;box-shadow:0 0 0 2px #fff}'+
    '.gd-nums{font-size:11.5px;color:var(--mu)}.gd-nums b{color:var(--navy);font-weight:800}'+
    '.gd-res{font-size:10px;font-weight:800;border-radius:999px;padding:3px 9px;text-align:center}'+
    '.gd-res.beat{background:rgba(0,166,80,.12);color:#00873f;border:1px solid rgba(0,166,80,.3)}'+
    '.gd-res.prog{background:#EEF1F4;color:var(--mu);border:1px solid var(--bdr)}'+
    '.gd-scale{display:flex;justify-content:space-between;font-size:9px;color:var(--mu);padding:4px 14px 0}'+
    '.gd-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}'+
    '.gd-card{border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:11px;padding:12px 14px;background:var(--w)}'+
    '.gd-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)}'+
    '.gd-v{font-size:17px;font-weight:800;color:var(--navy);margin:4px 0 2px}'+
    '.gd-d{font-size:10.5px;color:var(--mu);line-height:1.45}'+
    '.gd-not{display:flex;flex-direction:column;gap:8px}'+
    '.gd-not-row{display:flex;gap:10px;align-items:baseline}'+
    '.gd-nochip{font-size:10px;font-weight:800;color:#B4451F;background:rgba(180,69,31,.08);border:1px solid rgba(180,69,31,.25);border-radius:999px;padding:3px 10px;flex:none;white-space:nowrap}'+
    '.gd-not-d{font-size:11.5px;color:var(--navy);line-height:1.5}.gd-not-d b{font-weight:800}'+
  '</style>';
  h += '<div class="dd-tabs">'+
    '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
    '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
    '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
    '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
    '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
  '</div>';
  // Top Line — revenue drivers: Stores (Growth/SSS) + Product Mix + General (Tour/Logistics/Landscape/BİM)
  h += '<div class="dd-pane" data-dd="topline">'+
    '<div class="dd-subtabs">'+
      '<button type="button" class="dd-subtab active" data-dds="growth">Store Growth</button>'+
      '<button type="button" class="dd-subtab" data-dds="sss">Same-Store Sales</button>'+
      '<button type="button" class="dd-subtab" data-dds="mix">Product Mix</button>'+
      '<button type="button" class="dd-subtab" data-dds="tour">Store Tour</button>'+
      '<button type="button" class="dd-subtab" data-dds="logistics">Logistics</button>'+
      '<button type="button" class="dd-subtab" data-dds="landscape">Competitive Landscape</button>'+
      '<button type="button" class="dd-subtab" data-dds="bim">BİM Blueprint</button>'+
    '</div>'+
    '<div class="dd-subpane" data-dds="growth">'+growthBody()+'</div>'+
    '<div class="dd-subpane" data-dds="sss" hidden>'+sssBody()+'</div>'+
    '<div class="dd-subpane" data-dds="mix" hidden>'+mixBody(c)+'</div>'+
    '<div class="dd-subpane" data-dds="tour" hidden>'+bbbLogistics.tourBody(c)+'</div>'+
    '<div class="dd-subpane" data-dds="logistics" hidden>'+bbbLogistics.body(c)+'</div>'+
    '<div class="dd-subpane" data-dds="landscape" hidden>'+bbbLandscape.body(c)+'</div>'+
    '<div class="dd-subpane" data-dds="bim" hidden>'+bbbBim.body(c)+'</div>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="bottomline" hidden>'+ueBody(c)+'</div>';
  h += '<div class="dd-pane" data-dd="evolution" hidden>'+bEvolutionBody(c)+'</div>';
  h += '<div class="dd-pane" data-dd="valuation" hidden>'+bbbSensitivity.body(c)+'</div>';
  h += '<div class="dd-pane" data-dd="mgmt" hidden>'+bbbManagement.body(c)+'</div>';
  h += '<div class="ov-foot">'+esc(DD_SOURCES)+'</div>';
  h += '</div>';
  return h;
}

// Lazily build a Top Line sub-pane's charts/interactions when it becomes visible.
function ddBuildSub(root, key){
  if (key === 'growth')         requestAnimationFrame(function(){ buildStoresChart(); setupStoreSlider(); buildVsChart(); });
  else if (key === 'sss')       requestAnimationFrame(buildSSSChart);
  else if (key === 'mix')       requestAnimationFrame(buildMixChart);
  else if (key === 'logistics') requestAnimationFrame(function(){ bbbLogistics.init(root); });
  else if (key === 'landscape') requestAnimationFrame(function(){ bbbLandscape.init(root); });
  else if (key === 'bim')       requestAnimationFrame(function(){ bbbBim.init(root); });
  else if (key === 'earnings')  requestAnimationFrame(function(){ bEarningsInit(root); });
  else if (key === 'results')   requestAnimationFrame(function(){ var w = root.querySelector('.dd-subpane[data-dds="results"] .rs-wrap'); if(w) initResults(w, 'TBBB'); });
  else if (key === 'estimates') requestAnimationFrame(function(){ resultsEvoHtml('TBBB'); initResultsEvo(); });   // resultsEvoHtml re-establishes _rs.data=TBBB (its evolution block); initResultsEvo builds into #rsEvoWrap
  // 'tour' (static embed) and the remaining Evolution scaffolds (guidance/strategy/timeline)
  // have nothing to build.
}
// Lazily build a Deep Dive pane when it becomes visible.
function ddBuildPane(root, key){
  if (key === 'topline' || key === 'evolution'){
    var tp = root.querySelector('.dd-pane[data-dd="'+key+'"]');
    var act = tp ? tp.querySelector('.dd-subtab.active') : null;
    if (act) ddBuildSub(root, act.getAttribute('data-dds'));
  }
  else if (key === 'bottomline') requestAnimationFrame(buildUeChart);
  else if (key === 'valuation')  requestAnimationFrame(function(){ bbbSensitivity.init(root); });
  else if (key === 'mgmt')       requestAnimationFrame(function(){ bbbManagement.init(root); });
  // 'evolution' is a blank scaffold — nothing to build.
}
function ddInit(c){
  var root = document.querySelector('.ov-tbbb-dd');
  if (!root) return;
  // Top-level Deep Dive tabs.
  root.querySelectorAll('.dd-tab').forEach(function(btn){ btn.onclick = function(){
    var key = btn.getAttribute('data-dd');
    root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b === btn); });
    root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-dd') !== key); });
    ddBuildPane(root, key);
  }; });
  // Top Line sub-tabs (pane-scoped so they don't collide).
  root.querySelectorAll('.dd-subtab').forEach(function(btn){ btn.onclick = function(){
    var pane = btn.closest('.dd-pane'); if(!pane) return; var key = btn.getAttribute('data-dds');
    pane.querySelectorAll('.dd-subtab').forEach(function(b){ b.classList.toggle('active', b === btn); });
    pane.querySelectorAll('.dd-subpane').forEach(function(p){ p.hidden = (p.getAttribute('data-dds') !== key); });
    ddBuildSub(root, key);
  }; });
  // Build the initially-visible pane (Top Line → Store Growth).
  ddBuildPane(root, 'topline');
}

export var bbbOverview = { html: html, init: init, deepDive: { html: ddHtml, init: ddInit } };
