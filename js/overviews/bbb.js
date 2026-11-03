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
import { bbbBridge } from './bbb-bridge.js';
import { tbbbCeHtml, tbbbCeWire, tbbbCeBuild, tbbbCePop } from './tbbb-ce.js';   // Evolution ▸ Earnings (playbook machinery + ./tbbb-ce-data.js)
import { bbbSbc } from './bbb-sbc.js';
import { tbbbTargetMult } from './tbbb-target-multiple.js';   // Valuation ▸ Target Multiple / PEG (Summit model, frozen)
import { submitsHtml, initSubmits } from '../submits.js';   // Valuation ▸ Submit History (engine + js/submits-data/tbbb.js)
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
var FY_NOTE = 'FY2025: total revenue Ps.78.2B (+36%) · gross profit Ps.12.6B (16.2% margin) · 825M transactions (+23%) · average ticket Ps.94.9 (+11%). The company reported a net loss of Ps.2.84B (vs. a Ps.0.33B profit in FY2024), driven primarily by a non-cash share-based compensation charge of ~Ps.2.93B from the Liquidity Event Plan (vesting over three years, so it steps down through 2028), plus an FX translation loss and strategic investment in new regions.';

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
var FIN_NOTE = 'The FY2025 operating and net loss is driven by a non-cash share-based-compensation charge (recognized over a three-year vesting schedule, so it steps down through 2028) (~Ps.2.93B) recognized on RSUs granted under the Liquidity Event Share Plan, an FX translation loss on US-dollar IPO proceeds, and investment in new regions — not by a deterioration of the core store economics (revenue +36%, gross margin ~flat at 16.2%).';

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

var SOURCES = 'Sources: BBB Foods Inc. (NYSE: TBBB) FY2025 annual report on Form 20-F (year ended December 31, 2025) — Business Overview and Operating & Financial Review. All figures in Mexican pesos (Ps.) unless stated; the FY2025 net loss reflects non-cash share-based compensation. Peer descriptions summarize public information.';

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
    why:'The hard-discount pioneer and the growth outlier here — no trailing P/E (FY2025 net loss from non-cash SBC); read the forward number.' },
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
    'Reported a <b>net loss of ~Ps.2.84B</b>, driven by a <b>non-cash share-based-compensation charge</b> (~Ps.2.93B) from the Liquidity Event Plan (7.5M Class C shares granted in June 2025, vesting quarterly over three years), plus lease interest and an FX translation loss.',
    'EBITDA excluding that charge (and a Ps.230M receivable write-off) grew <b>+30% to Ps.4.4B</b>. The SBC schedule steps down through 2028.',
  ]],
  ['2026', 'Completes an <b>equity follow-on (May)</b> and sees the <b>IPO lock-up expire on Aug 6</b>; reaches <b>3,765 stores and 25 distribution centers</b> by 3Q26 (3,624 and 21 at 2Q26).', [
    'The May follow-on raised about <b>Ps.1.49B of primary proceeds</b>, held mostly in short-term deposits; the net loss widened on SBC.',
    'On Aug 6 the lock-up on Class C shares expired and all Class C converted one-to-one into Class A.',
    '2Q26 revenue grew <b>+38.7% to Ps.26.0B</b> on <b>+20.0% same-store sales</b>; first-half operating cash flow rose 119% to Ps.4.3B.',
    '3Q26 revenue grew <b>+40.3% to Ps.28.4B</b> on <b>+20.5% same-store sales</b>; four distribution centers opened, EBITDA ex-SBC reached Ps.1.9B (6.6% margin) and reported net profit turned positive (Ps.23M) as the SBC charge faded.',
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
var DD_SOURCES = 'Sources: BBB Foods FY2025 annual report (Form 20-F) and investor relations; Summit DCF model (TBBB, submit of Aug 13, 2026) for projections & sensitivity; competitor/logistics detail from company disclosures and cited research. Figures in Mexican pesos (Ps.) unless noted.';

// ── Guidance — 3B guides only what it controls (store openings every year; +revenue growth &
// per-store capex for 2026) and has BEATEN its store-opening guide every year. It deliberately
// does NOT guide margins / EBITDA / SG&A. Source: docs/calls/TBBB.md + the 20-F.
var GD_TRACK = [
  { y:'FY2024', lo:380, hi:420, act:484 },
  { y:'FY2025', lo:500, hi:550, act:574 },
  { y:'FY2026', lo:590, hi:630, act:null }
];
var GD_CARDS = [
  ['Store openings', '590–630', 'net new · +3–10% over the 574 opened in 2025 · 419 opened in 9M26 (123 + 155 + 141)'],
  ['Revenue growth', '+29% to +32%', '1Q26 +33%, 2Q26 +38.7%, 3Q26 +40.3% (9M26 +37.7%) — running above the top'],
  ['Same-store sales', '+13% to +16%', '1Q26 +16.0%, 2Q26 +20.0%, 3Q26 +20.5% — at and above the top'],
  ['Capex / store', '~Ps.5.5M', 'up from ~Ps.3.9M (bigger-store mix) · ~26-month payback'],
  ['Total capex (FY26)', '~Ps.5.2B', 'stores + distribution centers + fleet']
];
// Guide vs delivered on the three guided lines. Guides: 4Q23 call (FY2024), 4Q24 call (FY2025), 4Q25 call (FY2026).
// Delivered: FY2024 and FY2025 from the 20-F / releases; FY2026 is nine months (1Q26 to 3Q26) and still open.
var GD_FULL = [
  { y:'FY2024', rows:[ ['Net new stores','380–420','484','beat'], ['Revenue growth','+28% to +32%','+30.3%','in'], ['Same-store sales','"mid-teens"','+13.4%','na'] ] },
  { y:'FY2025', rows:[ ['Net new stores','500–550','574','beat'], ['Revenue growth','+26% to +29%','+36.1%','beat'], ['Same-store sales','+11% to +14%','+18.3%','beat'] ] },
  { y:'FY2026 (9M)', rows:[ ['Net new stores','590–630','419 in 9M (123 + 155 + 141)','open'], ['Revenue growth','+29% to +32%','+37.7% in 9M','open'], ['Same-store sales','+13% to +16%','+16.0% 1Q · +20.0% 2Q · +20.5% 3Q','open'] ] }
];
function bGuideFull(){
  var tag = { beat:'<span class="gd-res beat">▲ above the top</span>', in:'<span class="gd-res" style="color:#5B7085">● inside the range</span>', na:'<span class="gd-res" style="color:#5B7085">no range given</span>', open:'<span class="gd-res prog">in progress</span>' };
  return '<table class="ov-table"><thead><tr><th>Year</th><th>Line</th><th>Guided</th><th>Delivered</th><th></th></tr></thead><tbody>'+
    GD_FULL.map(function(g){ return g.rows.map(function(r, i){
      return '<tr>'+(i===0?'<td class="ov-td-name" rowspan="'+g.rows.length+'">'+esc(g.y)+'</td>':'')+'<td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td><b>'+esc(r[2])+'</b></td><td>'+tag[r[3]]+'</td></tr>'; }).join(''); }).join('')+
    '</tbody></table>';
}
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
  return '<p class="ov-lede" style="margin-top:0">3B guides <b>what it controls</b>: net new stores, revenue growth and same-store sales every year, plus capex and unit economics. It deliberately does <b>not</b> guide margins, EBITDA or SG&amp;A. It <b>beat its store-opening guide in 2024 and 2025</b>, and 2025 revenue growth and same-store sales landed above the top of their ranges.</p>'+
    '<div class="ov-sec-h">Store-opening guidance vs delivered</div>'+
    '<div class="gd-track">'+track+'</div>'+
    '<div class="gd-scale"><span>0</span><span>350</span><span>700 stores</span></div>'+
    '<div class="ov-sec-h" style="margin-top:20px">Guide vs delivered — every guided line</div>'+bGuideFull()+
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
  '</div>'+
  '<div class="dd-subpane" data-dds="earnings">'+tbbbCeHtml(c)+'</div>'+
  '<div class="dd-subpane" data-dds="results" hidden>'+
    
    resultsHtml('TBBB')+
  '</div>'+
  '<div class="dd-subpane" data-dds="estimates" hidden>'+
    
    resultsEvoHtml('TBBB')+
  '</div>'+
  '<div class="dd-subpane" data-dds="guidance" hidden>'+bGuidanceBody()+'</div>'+
  '';
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
    '<button type="button" class="dd-tab" data-dd="misc">Miscellaneous</button>'+
  '</div>';
  // Top Line — General (store growth + same-store sales) · Segments (product mix: private label vs branded)
  h += '<div class="dd-pane" data-dd="topline">'+
    '<div class="dd-subtabs">'+
      '<button type="button" class="dd-subtab active" data-dds="tlgen">General</button>'+
      '<button type="button" class="dd-subtab" data-dds="tlseg">Segments</button>'+
    '</div>'+
    '<div class="dd-subpane" data-dds="tlgen">'+resultsHtml('TBBB_TL')+'</div>'+
    '<div class="dd-subpane" data-dds="tlseg" hidden>'+mixBody(c)+'</div>'+
  '</div>';
  // Bottom Line — General (unit economics, working capital) · Supply Chain (logistics, DC network)
  h += '<div class="dd-pane" data-dd="bottomline" hidden>'+
    '<div class="dd-subtabs">'+
      '<button type="button" class="dd-subtab active" data-dds="blgen">General</button>'+
      '<button type="button" class="dd-subtab" data-dds="blsc">Supply Chain</button>'+
    '</div>'+
    '<div class="dd-subpane" data-dds="blgen">'+bbbBridge.body()+resultsHtml('TBBB_BL')+bbbSbc.body()+'</div>'+
    '<div class="dd-subpane" data-dds="blsc" hidden>'+bbbLogistics.body(c)+'</div>'+
  '</div>';
  h += '<div class="dd-pane" data-dd="evolution" hidden>'+bEvolutionBody(c)+'</div>';
  // Valuation — Peers (multiples vs growth) · Sensitivity Analysis (SSS x store growth -> implied EV)
  h += '<div class="dd-pane" data-dd="valuation" hidden>'+
    '<div class="dd-subtabs">'+
      '<button type="button" class="dd-subtab active" data-dds="vapeers">Peers</button>'+
      '<button type="button" class="dd-subtab" data-dds="vatm">Target Multiple</button>'+
      '<button type="button" class="dd-subtab" data-dds="vasubs">Submit History</button>'+
      '<button type="button" class="dd-subtab" data-dds="vasens">Sensitivity Analysis</button>'+
    '</div>'+
    '<div class="dd-subpane" data-dds="vapeers">'+bPeerScatter('va')+'</div>'+
    '<div class="dd-subpane" data-dds="vatm" hidden>'+tbbbTargetMult.body()+'</div>'+
    '<div class="dd-subpane" data-dds="vasubs" hidden>'+submitsHtml('TBBB')+'</div>'+
    '<div class="dd-subpane" data-dds="vasens" hidden>'+bbbSensitivity.body(c)+'</div>'+
  '</div>';
  // Management — Executives & Board · Ownership · Governance & SBC
  h += '<div class="dd-pane" data-dd="mgmt" hidden>'+
    '<div class="dd-subtabs">'+
      '<button type="button" class="dd-subtab active" data-dds="mgteam">Executives &amp; Board</button>'+
      '<button type="button" class="dd-subtab" data-dds="mgown">Ownership</button>'+
      '<button type="button" class="dd-subtab" data-dds="mggov">Governance &amp; SBC</button>'+
      '<button type="button" class="dd-subtab" data-dds="mgtrack">Track Record</button>'+
    '</div>'+
    '<div class="dd-subpane" data-dds="mgteam">'+bbbManagement.body(c)+'</div>'+
    '<div class="dd-subpane" data-dds="mgown" hidden>'+bbbManagement.own(c)+'</div>'+
    '<div class="dd-subpane" data-dds="mggov" hidden>'+bbbManagement.gov(c)+'</div>'+
    '<div class="dd-subpane" data-dds="mgtrack" hidden>'+bbbManagement.track(c)+'</div>'+
  '</div>';
  // Miscellaneous — what is specific to 3B and has no home in the standard spine
  h += '<div class="dd-pane" data-dd="misc" hidden>'+
    '<div class="dd-subtabs">'+
      '<button type="button" class="dd-subtab active" data-dds="tour">Store Tour</button>'+
      '<button type="button" class="dd-subtab" data-dds="landscape">Competitive Landscape</button>'+
      '<button type="button" class="dd-subtab" data-dds="bim">BİM Blueprint</button>'+
      '<button type="button" class="dd-subtab" data-dds="storehist">Store &amp; SSS history</button>'+
      '<button type="button" class="dd-subtab" data-dds="uecon">Unit economics</button>'+
    '</div>'+
    '<div class="dd-subpane" data-dds="tour">'+bbbLogistics.tourBody(c)+'</div>'+
    '<div class="dd-subpane" data-dds="landscape" hidden>'+bbbLandscape.body(c)+'</div>'+
    '<div class="dd-subpane" data-dds="bim" hidden>'+bbbBim.body(c)+'</div>'+
    '<div class="dd-subpane" data-dds="storehist" hidden>'+growthBody()+sssBody()+'</div>'+
    '<div class="dd-subpane" data-dds="uecon" hidden>'+ueBody(c)+'</div>'+
  '</div>';
  h += '<div class="ov-foot">'+esc(DD_SOURCES)+'</div>';
  h += '</div>';
  return h;
}

// Lazily build a sub-pane's charts/interactions when it becomes visible.
function ddBuildSub(root, key){
  if (key === 'tlgen')          requestAnimationFrame(function(){ var w = root.querySelector('.dd-subpane[data-dds="tlgen"] .rs-wrap'); if(w) initResults(w, 'TBBB_TL'); });
  else if (key === 'tlseg')     requestAnimationFrame(buildMixChart);
  else if (key === 'blgen')     requestAnimationFrame(function(){ var w = root.querySelector('.dd-subpane[data-dds="blgen"] .rs-wrap'); if(w) initResults(w, 'TBBB_BL'); bbbBridge.init(root); bbbSbc.init(); });
  else if (key === 'blsc')      requestAnimationFrame(function(){ bbbLogistics.init(root); });
  else if (key === 'landscape') requestAnimationFrame(function(){ bbbLandscape.init(root); });
  else if (key === 'bim')       requestAnimationFrame(function(){ bbbBim.init(root); });
  else if (key === 'storehist') requestAnimationFrame(function(){ buildStoresChart(); setupStoreSlider(); buildVsChart(); buildSSSChart(); });
  else if (key === 'uecon')     requestAnimationFrame(function(){ buildUeChart(); });
  else if (key === 'vapeers')   requestAnimationFrame(function(){ wireBScatters(root); });
  else if (key === 'vatm')      requestAnimationFrame(function(){ tbbbTargetMult.init(root); });
  else if (key === 'vasubs')    requestAnimationFrame(function(){ initSubmits(root, 'TBBB'); });
  else if (key === 'vasens')    requestAnimationFrame(function(){ bbbSensitivity.init(root); });
  else if (key === 'mgteam')    requestAnimationFrame(function(){ bbbManagement.init(root); });
  else if (key === 'earnings')  requestAnimationFrame(function(){ tbbbCeBuild(root); });
  else if (key === 'results')   requestAnimationFrame(function(){ var w = root.querySelector('.dd-subpane[data-dds="results"] .rs-wrap'); if(w) initResults(w, 'TBBB'); });
  else if (key === 'estimates') requestAnimationFrame(function(){ resultsEvoHtml('TBBB'); initResultsEvo(); });   // resultsEvoHtml re-establishes _rs.data=TBBB (its evolution block); initResultsEvo builds into #rsEvoWra
  // 'tour', 'mgown', 'mggov' and 'guidance' are static: nothing to build.
}
// Lazily build a Deep Dive pane (its active sub-tab) when it becomes visible.
function ddBuildPane(root, key){
  var tp = root.querySelector('.dd-pane[data-dd="'+key+'"]');
  var act = tp ? tp.querySelector('.dd-subtab.active') : null;
  if (act) ddBuildSub(root, act.getAttribute('data-dds'));
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
  // Earnings: phase tabs, quarter pills, estimate toggles, Notes (theme record + editor).
  tbbbCeWire(root);
  // The "?" caveat pop-ups of Earnings resolve through the shared Overview modal.
  var back = document.getElementById('tbbbModalBack'), mT = document.getElementById('tbbbModalT'), mB = document.getElementById('tbbbModalB');
  function ceClose(){ if(!back) return; back.classList.remove('on'); setTimeout(function(){ back.hidden = true; }, 180); }
  root.addEventListener('click', function(e){
    var el = e.target.closest ? e.target.closest('[data-detail^="ce:"]') : null; if(!el || !back) return;
    var d = tbbbCePop(el.getAttribute('data-detail').slice(3)); if(!d) return;
    mT.innerHTML = d.t; mB.innerHTML = d.h; back.hidden = false; requestAnimationFrame(function(){ back.classList.add('on'); });
  });
  var bx = document.getElementById('tbbbModalX'); if(bx) bx.onclick = ceClose;
  // Build the initially-visible pane (Top Line → Store Growth).
  ddBuildPane(root, 'topline');
}

export var bbbOverview = { html: html, init: init, deepDive: { html: ddHtml, init: ddInit } };
