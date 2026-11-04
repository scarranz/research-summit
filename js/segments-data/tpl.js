// segments-data/tpl.js — the Top Line dataset for Texas Pacific Land Corporation (NYSE: TPL, CIK 1811074).
// Contract: docs/PROFILE_PLAYBOOK.md §10 (units TL-GEN, TL-SEG, TL-OTH, TL-CUS) · log docs/profiles/TPL.md.
//
// SHAPE OF THIS COMPANY: two reportable segments (FY2025 10-K, Note 16). Land and Resource Management owns the land and the
// oil and gas royalties; Water Services and Operations (Texas Pacific Water Resources) sells water to operators and collects
// royalties on produced water moved across or disposed into TPL's land. TPL is not an oil and gas producer and operates no
// disposal wells: every revenue line is paid by someone else's activity on its acreage.
//
// Segment revenue and profit are POINTERS into js/results-data/tpl.js (`results:<key>`), so each number has one home. KPI series
// that Results already carries (production, realized price, water volumes, the annual revenue lines) are read from it at load
// time and only re-scaled here; the ones Results does not carry (total MBoe, royalty stream split, water barrels, net wells)
// are typed from the 8-K Ex. 99.1 earnings releases (quarterly) and the 10-Ks (annual). Missing = null.
// No Summit model on file yet: `summit: {}` stays empty until TPL enters the Summit MCP (frozen per playbook rule 10).
//
// TEXT CHIPS: `tenK` / `filing` = FILING, verbatim from the FY2025 10-K (acc. 0001811074-26-000018) or the earnings release
// named in `where`; `summary` / `brief` / `sells` / `what` = OURS.

import { tplResults } from '../results-data/tpl.js';

var TENK = 'FY2025 Form 10-K';
var URL_K = 'https://www.sec.gov/Archives/edgar/data/1811074/000181107426000018/tpl-20251231.htm';
var REL = 'TPL earnings releases (8-K Ex. 99.1)';
var Q = ['1Q22', '2Q22', '3Q22', '4Q22', '1Q23', '2Q23', '3Q23', '4Q23', '1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26'];
var Y = ['2021', '2022', '2023', '2024', '2025'];
function qmap(vals){ var o = {}; Q.forEach(function(p, i){ if (vals[i] != null) o[p] = vals[i]; }); return o; }
function ymap(vals){ var o = {}; Y.forEach(function(p, i){ if (vals[i] != null) o[p] = vals[i]; }); return o; }
// A Results series as a period map, optionally re-scaled (Boe/d -> thousand Boe/d). Nothing is retyped.
function fromRes(view, key, mult){
  var m = tplResults.views[view].metrics[key], o = {};
  m.periods.forEach(function(p, i){ var v = m.act[i]; if (v != null) o[p] = mult ? Math.round(v * mult * 10) / 10 : v; });
  return o;
}

var CONC = 'Three customers represented, in the aggregate, 39.6% of TPL\'s total revenues for the year ended December 31, 2025. Three customers represented, in the aggregate, 40.9% of TPL\'s total revenues for the year ended December 31, 2024. Three customers represented, in the aggregate, 42.5% of TPL\'s total revenues for the year ended December 31, 2023.';
var ROY = { text: 'We are not an oil and gas producer. Rather, our oil and gas revenue is derived from our oil and gas royalty interests. Thus, in addition to being subject to fluctuations in response to the market prices for oil and gas, our oil and gas royalties are also subject to decisions made by the owners and operators of the oil and gas wells to which our royalty interests relate as to investments in and production from those wells.',
            where: TENK + ', Item 1 — Land and Resource Management' };
var EASE = { text: 'Our revenue from easements is primarily generated from easements for pipelines transporting oil, gas and related hydrocarbons, power line and utility easements, and subsurface wellbore easements.',
             where: TENK + ', Item 1 — Land and Resource Management' };
var NEXTGEN = { text: 'These agreements include the evaluation of data centers, power generation, grid-connected batteries, and carbon capture and sequestration, among other opportunities.',
                where: TENK + ', Item 1 — Land and Resource Management' };
var WATERC = { text: 'Energy businesses use water for their oil and gas projects, including new drilling and completion operations, while service businesses (i.e., water management service companies) operate water facilities to sell water to, and dispose of produced water of, energy businesses.',
               where: TENK + ', Item 1 — Water Services and Operations' };
var LANDC = { text: 'From time to time, we receive offers from third parties to acquire tracts of our land.',
              where: TENK + ', Item 1 — Land and Resource Management' };

export var tplSegments = {
  company: 'Texas Pacific Land',
  updated: 'Nov 2026',
  source: 'Segment revenue, operating income and net income: TPL 8-K Ex. 99.1 earnings releases (1Q22-2Q26, latest accession 0001811074-26-000056), the 2Q25 10-Q and the 10-Ks (FY2023, FY2025), through the Results dataset. KPIs (royalty production, realized prices, water volumes, net wells): the same releases and the FY2025 10-K. Segment and revenue-line descriptions and customer concentration: FY2025 10-K (accession 0001811074-26-000018). No Summit model or Street consensus on file yet.',

  axis: { q: Q, y: Y },

  bridgeLines: true,   // the Revenue interactions chart is drawn as lines, each over its own first quarter (= 100), so barrels, price per barrel and revenue share one axis

  shared: {
    // read from Results (one home)
    boed:  { label: 'Royalty production (thousand Boe per day)', short: 'Production MBoe/d', unit: 'idx', scope: 'segment', src: REL + ' / 10-K',
      q: { act: fromRes('q', 'boed', 0.001) }, y: { act: fromRes('y', 'boed', 0.001) } },
    pboe:  { label: 'Average realized price (US$ per Boe)', short: 'Realized $/Boe', unit: 'eps', scope: 'segment', src: REL + ' / 10-K',
      q: { act: fromRes('q', 'pboe') }, y: { act: fromRes('y', 'pboe') } },
    wsd:   { label: 'Water sales volume (thousand barrels per day)', short: 'Water sold MBbl/d', unit: 'idx', scope: 'segment', src: REL + ' / 10-K',
      q: { act: fromRes('q', 'wsd') }, y: { act: fromRes('y', 'wsd') } },
    pwrd:  { label: 'Produced water royalty volume (thousand barrels per day)', short: 'Produced water MBbl/d', unit: 'idx', scope: 'segment', src: REL + ' / 10-K',
      q: { act: fromRes('q', 'pwrd') }, y: { act: fromRes('y', 'pwrd') } },
    // typed: total production and the royalty stream as the releases' "Oil and Gas Activity" table gives them
    // (these exclude the $8.7M royalty recovery booked in 1Q23, so 1Q23 and FY2023 sit $8.7M below the income-statement line)
    mboe:  { label: 'Royalty production (thousand Boe, period total)', short: 'Production MBoe', unit: 'idx', scope: 'segment', src: REL + ' / 10-K, Oil and Gas Activity',
      q: { act: qmap([1871, 1805, 2151, 1964, 1882, 2269, 2009, 2416, 2258, 2270, 2600, 2676, 2801, 3020, 3338, 3453, 3339, 3615]) },
      y: { act: ymap([6795, 7791, 8575, 9804, 12613]) } },
    ogx:   { label: 'Oil and gas royalties (activity table)', short: 'Royalties', unit: 'usdM', scope: 'segment', src: REL + ' / 10-K, Oil and Gas Activity',
      q: { act: qmap([104.2, 121.3, 130.3, 96.7, 80.5, 82.4, 87.1, 98.8, 92.1, 89.8, 94.4, 97.0, 111.2, 95.0, 108.7, 96.7, 118.2, 145.6]) },
      y: { act: ymap([286.5, 452.4, 348.7, 373.3, 411.7]) } },
    oil:   { label: 'Oil royalties', short: 'Oil', unit: 'usdM', scope: 'segment', src: REL + ' / 10-K, Oil and Gas Activity',
      q: { act: qmap([71.7, 84, 83.4, 68.6, 56.9, 70.2, 66.9, 79.3, 72.6, 74.7, 75.4, 75.3, 76.2, 73.9, 79.9, 75, 90.6, 119.3]) },
      y: { act: ymap([195.7, 307.6, 273.3, 298.1, 304.9]) } },
    gas:   { label: 'Natural gas royalties', short: 'Natural gas', unit: 'usdM', scope: 'segment', src: REL + ' / 10-K, Oil and Gas Activity',
      q: { act: qmap([16.2, 17.6, 26.4, 14.7, 11, 3.8, 8.5, 6.7, 7.1, 2.4, 4.2, 4.9, 17.6, 4.6, 11.4, 3.9, 9.8, 2.6]) },
      y: { act: ymap([41.0, 74.9, 29.9, 18.5, 37.4]) } },
    ngl:   { label: 'NGL royalties', short: 'NGL', unit: 'usdM', scope: 'segment', src: REL + ' / 10-K, Oil and Gas Activity',
      q: { act: qmap([16.3, 19.7, 20.6, 13.4, 12.6, 8.5, 11.7, 12.7, 12.4, 12.7, 14.8, 16.8, 17.5, 16.5, 17.4, 17.9, 17.7, 23.7]) },
      y: { act: ymap([49.8, 70.0, 45.5, 56.7, 69.3]) } },
    // typed: water barrels (period totals). TPL first printed them in the 4Q25 release; 1Q25 and 3Q25 are comparative columns.
    wsvol: { label: 'Water sold (thousand barrels, period total)', short: 'Water sold MBbl', unit: 'idx', scope: 'segment', src: REL + ' (4Q25, 1Q26, 2Q26) / FY2025 10-K',
      q: { act: { '1Q25': 71264, '3Q25': 71332, '4Q25': 92072, '1Q26': 73747, '2Q26': 60343 } },
      y: { act: { '2023': 205552, '2024': 269281, '2025': 278564 } } },
    pwrvol: { label: 'Produced water royalty volume (thousand barrels, period total)', short: 'Produced water MBbl', unit: 'idx', scope: 'segment', src: REL + ' (4Q25, 1Q26, 2Q26) / FY2025 10-K',
      q: { act: { '1Q25': 335656, '3Q25': 400804, '4Q25': 443578, '1Q26': 414450, '2Q26': 443337 } },
      y: { act: { '2023': 916067, '2024': 1257246, '2025': 1566588 } } },
    // typed: well inventory on TPL's royalty acreage at quarter end (net wells), from each release's highlights
    npw:   { label: 'Net producing wells (quarter end)', short: 'Net producing wells', unit: 'idx', scope: 'segment', src: REL,
      q: { act: qmap([50.7, 52.1, 55.0, 57.7, 59.4, 62.6, 62.8, 67.2, 70.2, 73.3, 79.2, 86.8, 90.2, 95.4, 100.5, 116.1, 124.4, 131.9]) } },
    nduc:  { label: 'Net drilled but uncompleted wells (quarter end)', short: 'Net DUCs', unit: 'idx', scope: 'segment', src: REL,
      q: { act: qmap([7.7, 7.5, 6.9, 7.4, 7.8, 8.2, 7.9, 9.7, 10.3, 9.5, 11.8, 13.2, 12.9, 11.1, 9.9, 9.8, 9.6, 9.5]) } },
    nperm: { label: 'Net well permits (quarter end)', short: 'Net permits', unit: 'idx', scope: 'segment', src: REL,
      q: { act: qmap([7.4, 8.7, 5.6, 5.0, 5.0, 4.9, 6.7, 4.5, 5.1, 6.3, 6.9, 6.4, 5.9, 6.0, 6.1, 5.6, 5.8, 5.6]) } },
    // annual revenue lines, read from Results, for the "What each top customer buys" weights
    y_og:   { label: 'Oil and gas royalties', unit: 'usdM', scope: 'company', src: TENK, y: { act: fromRes('y', 'og') } },
    y_ease: { label: 'Easements and other surface-related income', unit: 'usdM', scope: 'company', src: TENK, y: { act: fromRes('y', 'ease') } },
    y_ws:   { label: 'Water sales', unit: 'usdM', scope: 'company', src: TENK, y: { act: fromRes('y', 'ws') } },
    y_pwr:  { label: 'Produced water royalties', unit: 'usdM', scope: 'company', src: TENK, y: { act: fromRes('y', 'pwr') } },
    y_land: { label: 'Land sales', unit: 'usdM', scope: 'company', src: TENK, y: { act: fromRes('y', 'land') } },
  },
  derived: {
    // $M / thousand units x 1000 = US$ per unit (`div: 0.001` multiplies by 1000)
    revPerBoe:  { num: 'shared:ogx', den: 'shared:mboe', unit: 'eps', div: 0.001, label: 'Royalty revenue per Boe (revenue / volume)', short: 'Revenue / Boe' },
    wsPerBbl:   { num: 'results:ws', den: 'shared:wsvol', unit: 'eps', div: 0.001, label: 'Water sales revenue per barrel sold', short: 'Water $ / bbl' },
    pwrPerBbl:  { num: 'results:pwr', den: 'shared:pwrvol', unit: 'eps', div: 0.001, label: 'Produced water royalty per barrel', short: 'Royalty $ / bbl' },
    lrmMargin:  { num: 'results:lrmop', den: 'results:rev_lrm', unit: 'pct', label: 'Land and Resource Management operating margin', short: 'LRM margin' },
    wsoMargin:  { num: 'results:wsoop', den: 'results:rev_wso', unit: 'pct', label: 'Water Services and Operations operating margin', short: 'WSO margin' },
  },

  overview: {
    tenK: { text: 'We operate our business in two reportable segments: Land and Resource Management and Water Services and Operations.',
            where: TENK + ', Item 1 — Business Segments' },
  },

  segments: [
    {
      key: 'lrm', label: 'Land and Resource Management', short: 'Land & Resources',
      tenK: { text: 'The Land and Resource Management segment encompasses the business of managing our approximately 882,000 surface acres of land and our approximately 224,000 NRA of oil and gas royalty interests, principally concentrated in the Permian Basin. The revenue streams of this segment consist primarily of royalties from oil and gas, revenues from easements and commercial leases, and land and material sales.',
              where: TENK + ', Note 16 (Business Segment Reporting)', cite: { form: '10-K', period: '2025', accession: '0001811074-26-000018' }, url: URL_K, verbatim: true },
      summary: 'The royalty and landlord business: 62% of FY2025 revenue and two-thirds of segment operating income, at an 80% operating margin, because operators carry all the drilling cost.',
      brief: 'TPL owns land and mineral royalties across West Texas, mostly in the Permian Basin. When an operator produces oil and gas from wells on its royalty acreage, TPL receives a share of the revenue without paying any of the cost. Pipeline, power and other companies pay for easements to cross the land or to build on it. Now and then TPL also sells tracts of land.',
      sells: [
        { name: 'Oil and gas royalties', what: 'A share of the oil, gas and NGL revenue from wells drilled by operators on TPL\'s royalty acreage (about 224,000 net royalty acres).' },
        { name: 'Easements', what: 'Rights of way for pipelines, power lines, utilities and subsurface wellbores, paid upfront and renewed every 10 years.' },
        { name: 'Commercial leases and materials', what: 'Leases for processing, storage, compression and roads; caliche and sand sold to operators; newer data-center and power projects.' },
        { name: 'Land sales', what: 'Occasional sales of tracts to third parties.' },
      ],
      products: [
        { name: 'Oil royalties', what: 'Royalties on crude oil and condensate. 74% of FY2025 oil and gas royalties.',
          tenK: { text: 'Oil and gas royalties are received in connection with royalty interests owned by TPL. Oil and gas royalties are reported net of production taxes and are recognized as revenue when crude oil and natural gas products are removed from the respective mineral reserve locations.', where: TENK + ', Note 2 (Revenue Recognition)' },
          customers: { archetype: ROY, named: [], concentration: CONC } },
        { name: 'Natural gas royalties', what: 'Royalties on natural gas. 9% of FY2025 oil and gas royalties, at $1.73 per Mcf realized.',
          tenK: { text: 'The oil and gas royalties which we receive are dependent upon the market prices for oil and gas, and locational and contractual price differences.', where: TENK + ', Note 2 (Revenue Recognition)' },
          customers: { archetype: ROY, named: [], concentration: CONC } },
        { name: 'NGL royalties', what: 'Royalties on natural gas liquids. 17% of FY2025 oil and gas royalties.',
          tenK: { text: 'The oil and gas royalties which we receive are dependent upon the market prices for oil and gas, and locational and contractual price differences.', where: TENK + ', Note 2 (Revenue Recognition)' },
          customers: { archetype: ROY, named: [], concentration: CONC } },
        { name: 'Pipeline, utility and wellbore easements', what: 'Rights of way for oil, gas and hydrocarbon pipelines, power lines and utilities, and subsurface wellbores, recognised when the agreement is signed or renewed.',
          tenK: { text: 'Easement contracts represent contracts which permit companies to install pipelines, electric lines and other equipment on land owned by TPL.', where: TENK + ', Note 2 (Revenue Recognition)' },
          customers: { archetype: EASE, named: [], concentration: 'Pipeline, utility and oil and gas companies; the 10-K gives no split by customer.' } },
        { name: 'Commercial leases, materials and next-generation projects', what: 'Facility, roadway and surface leases; caliche and sand; lease bonuses on acquired royalties; and data-center and power-generation projects, among them Project Kilby with a Chevron subsidiary (2Q26) and the Bolt Data & Energy agreement (Dec 2025).',
          tenK: { text: 'Other surface-related income includes revenue from permits, material sales, renewable energy sources, and lease bonuses related to royalty interests acquired.', where: TENK + ', Note 2 (Revenue Recognition)' },
          customers: { archetype: NEXTGEN,
            named: [{ name: 'Chevron', q: 'Q2 2026', what: 'Named in the 2Q26 earnings release (8-K Ex. 99.1, Aug 5 2026), not on a call: an agreement with a Chevron subsidiary to provide land and brackish water resources for Project Kilby, a power generation facility supporting a customer data center in Reeves County, Texas.' }],
            concentration: 'No revenue from these projects is broken out.' } },
        { name: 'Land sales', what: 'Tracts sold to third parties: $0.8M in FY2025; $20.9M in 1Q26 on a seller-financed sale to a power-plant developer.',
          tenK: LANDC,
          customers: { archetype: LANDC, named: [], concentration: 'Buyers are not named.' } },
      ],
      kpis: [
        { name: 'Royalty production', definition: 'TPL\'s share of oil, gas and NGL production from its royalty acreage, in thousand barrels of oil equivalent per day (6,000 cubic feet of gas = 1 Boe). The volume half of royalty revenue.',
          source: REL + ' / 10-K', periodicity: 'Quarterly and annual', series: 'shared:boed', unit: 'idx',
          filing: 'We measure our share of oil and gas produced in barrels of oil equivalent ("Boe"). One Boe equals one barrel of crude oil, condensate, NGLs (natural gas liquids) or approximately 6,000 cubic feet of gas.',
          filingWhere: TENK + ', Note 18 (Supplemental Oil and Gas Reserve Information)' },
        { name: 'Average realized price per Boe', definition: 'Royalty revenue per barrel of oil equivalent as TPL reports it; the price half of royalty revenue. Set by oil, gas and NGL markets, not by TPL. Excludes the $8.7M recovery booked in 1Q23.',
          source: REL + ' / 10-K', periodicity: 'Quarterly and annual', series: 'shared:pboe', unit: 'eps' },
        { name: 'Net producing wells', definition: 'Wells producing on TPL\'s royalty acreage, expressed as net wells (each well weighted by TPL\'s royalty interest), at quarter end.',
          source: REL, periodicity: 'Quarterly', series: 'shared:npw', unit: 'idx' },
        { name: 'Net drilled but uncompleted wells', definition: 'Wells drilled but not yet completed on TPL\'s royalty acreage (net), at quarter end: production that operators have started but not yet turned on.',
          source: REL, periodicity: 'Quarterly', series: 'shared:nduc', unit: 'idx',
          filing: 'These permitted and DUC wells represent potential near-term candidates for further development by operators towards ultimately being placed into production.',
          filingWhere: TENK + ', Item 1 — Oil and Gas Activity' },
        { name: 'Net well permits', definition: 'Permitted wells on TPL\'s royalty acreage awaiting drilling (net), at quarter end.',
          source: REL, periodicity: 'Quarterly', series: 'shared:nperm', unit: 'idx' },
        { name: 'Net royalty acres', definition: 'About 224,000 net royalty acres at Dec 31, 2025 (about 191,000 held since 1888 at no book value). Given at year end and after acquisitions, not as a quarterly series.',
          source: TENK + ', Note 18', periodicity: 'Annual (point figure)', series: null, unit: 'idx' },
        { name: 'Operating margin', definition: 'Segment operating income / segment revenue. Disclosed from 1Q24 (quarterly) and FY2023 (annual).',
          source: 'Derived from the Results dataset', periodicity: 'Quarterly and annual', series: 'lrmMargin', unit: 'pct' },
      ],
      kpiNote: 'TPL publishes royalty production (MBoe/d, and by product), realized prices by product, and a well inventory (net producing wells, permits, DUCs and, from 2025, completed-but-not-producing wells) every quarter. It publishes no easement count, no acreage under easement and no price per easement, so the surface business has no volume or price series.',
      interactions: [
        { name: 'Production × realized price', relation: 'oil and gas royalties = royalty production (Boe) × revenue per Boe', bridge: 'boe',
          lines: ['Oil royalties', 'Natural gas royalties', 'NGL royalties'],
          why: 'The price × volume identity of the royalty business. Volume has compounded: 1,871 thousand Boe in 1Q22, 3,615 thousand in 2Q26, as net producing wells went from 50.7 to 131.9 (partly bought: about 17,306 net royalty acres for $450.7M in Nov 2025). Price does the opposite of compounding: the reported realized price fell from $60.81 per Boe (FY2022) to $42.58 (FY2023), $39.87 (FY2024) and $34.18 (FY2025) before $42.17 in 2Q26, on oil at $97.55 per barrel. TPL sets no price and announces no increases: the market does. There is no unit cost to measure the price against, because the 10-K says: "Our oil and gas royalty interests require no capital expenditures or operating expense burden from us for well development." The reported realized price sits above revenue per Boe charted here ($42.17 vs $40.27 in 2Q26); the filing reports royalty revenue net of production taxes.',
          data: 'Charted quarterly, 1Q22-2Q26, from the releases\' Oil and Gas Activity table (which excludes the $8.7M recovery in 1Q23). DECOMPOSITION: revenue per Boe is royalty revenue / Boe, so the two terms multiply back to revenue.' },
        { name: 'Wells × production per well', relation: 'royalty production = net producing wells × production per net well', bridge: null,
          lines: ['Oil royalties', 'Natural gas royalties', 'NGL royalties'],
          why: 'The well inventory is the leading volume indicator TPL gives: permits and DUCs become producing wells. Net producing wells rose every quarter from 50.7 (1Q22) to 131.9 (2Q26); permits plus DUCs plus completed-not-producing wells stood at 18.4 net wells at Jun 30, 2026.',
          data: 'The well counts are charted in the KPIs above. NOT CHARTED as a bridge: TPL gives production per period but not per well, and the well counts are quarter-end stocks while production is a flow.' },
        { name: 'Easements × price per easement', relation: 'easement income = easements granted or renewed × payment per easement', bridge: null,
          lines: ['Pipeline, utility and wellbore easements'],
          why: 'Pricing is contractual and indexed: the 10-K says "Easements typically have a 30-plus year term but subsequently renew every 10 years with an additional payment that is subject to consumer price index escalators. Many of the renewals will reset over the next several years." That is the durability of this price: CPI-linked renewals. FY2025 growth came from pipeline easements (+$10.0M), wellbore easements (+$3.8M) and lease bonuses (+$2.5M).',
          data: 'NOT CHARTED: TPL discloses neither the number of easements nor a price per easement.' },
      ],
      bridges: [
        { key: 'boe', label: 'Production × price', view: 'q', target: 'ogx', kind: 'decomposition',
          terms: ['mboe', 'revPerBoe'],
          identity: 'oil and gas royalties = royalty production × revenue per Boe',
          note: 'A decomposition, not an independent build: revenue per Boe is royalty revenue divided by production, so the two terms multiply back to revenue by construction. Royalty revenue here is the activity-table total, which excludes the $8.7M recovery booked in 1Q23.' },
      ],
      highlights: [],
      drivers: { rev: { from: 'results:rev_lrm' }, opinc: { from: 'results:lrmop' }, ogx: { from: 'shared:ogx' } },
    },
    {
      key: 'wso', label: 'Water Services and Operations', short: 'Water',
      tenK: { text: 'The Water Services and Operations segment encompasses the business of providing a full-service water offering to operators in the Permian Basin. The revenue streams of this segment primarily consist of revenue generated from sales of sourced and treated water as well as revenue from produced water royalties.',
              where: TENK + ', Note 16 (Business Segment Reporting)', cite: { form: '10-K', period: '2025', accession: '0001811074-26-000018' }, url: URL_K, verbatim: true },
      summary: 'The water business: 38% of FY2025 revenue at a 64% operating margin, growing faster than the royalties (+39% year on year in 2Q26).',
      brief: 'Oil and gas operators need large volumes of water to drill and frack wells, and every producing well brings up salty "produced" water that has to be disposed of. TPL sells sourced and treated water from its own wells and pits to operators. When disposal companies move or inject produced water across TPL\'s land, they pay TPL a royalty per barrel; TPL runs no disposal wells itself.',
      sells: [
        { name: 'Water sales', what: 'Sourced, produced and treated water delivered to operators for drilling and completions.' },
        { name: 'Produced water royalties', what: 'A fee per barrel on produced water transported across or injected into TPL\'s land by disposal operators.' },
        { name: 'Water easements and permits', what: 'Easements and temporary permits for water lines on TPL\'s land.' },
      ],
      products: [
        { name: 'Water sales', what: 'Sourced and treated water delivered to operators; $169.7M in FY2025, 21% of revenue. Includes royalties in areas of mutual interest and legacy agreements.',
          tenK: { text: 'Water sales revenue encompasses the sale and delivery of sourced, produced and treated water to operators and other customers, royalties received related to areas of mutual interest ("AMI"), and royalties received pursuant to legacy agreements with operators.', where: TENK + ', Note 2 (Revenue Recognition)' },
          customers: { archetype: WATERC,
            named: [{ name: 'Chevron', q: 'Q2 2026', what: 'Named in the 2Q26 earnings release (8-K Ex. 99.1, Aug 5 2026), not on a call: TPL provides brackish water resources (with land) to a Chevron subsidiary for Project Kilby, a power generation facility for a data center in Reeves County, Texas.' }],
            concentration: CONC } },
        { name: 'Produced water royalties', what: 'Royalties per barrel of produced water moved across or disposed into TPL\'s land; $124.2M in FY2025, 16% of revenue.',
          tenK: { text: 'Produced water royalties represent revenue from the transfer and disposal of saltwater from producing oil and gas wells on our land. Revenue is recognized when the water is transported across or injected into our land.', where: TENK + ', Note 2 (Revenue Recognition)' },
          customers: { archetype: WATERC, named: [], concentration: CONC } },
        { name: 'Water easements and permits', what: 'Easements and temporary permits for sourced-water lines; $13.5M in FY2025.',
          tenK: { text: 'The increase in easements and other surface-related income primarily related to an increase in temporary permits for sourced water lines for the year ended December 31, 2025 compared to 2024.', where: TENK + ', Item 7 — Water Services and Operations' },
          customers: { archetype: WATERC, named: [], concentration: 'Not split by customer.' } },
      ],
      kpis: [
        { name: 'Water sales volume', definition: 'Water sold, thousand barrels per day. The volume half of water sales.',
          source: REL + ' / 10-K', periodicity: 'Quarterly from 4Q25 (plus 1Q25 and 3Q25 comparatives); annual 2023-2025', series: 'shared:wsd', unit: 'idx' },
        { name: 'Produced water royalty volume', definition: 'Produced water on which TPL earns a royalty, thousand barrels per day. The volume half of produced water royalties.',
          source: REL + ' / 10-K', periodicity: 'Quarterly from 4Q25 (plus 1Q25 and 3Q25 comparatives); annual 2023-2025', series: 'shared:pwrd', unit: 'idx' },
        { name: 'Water sales revenue per barrel', definition: 'Water sales revenue / barrels sold. Derived here; TPL reports both terms but not the ratio.',
          source: 'Derived from the releases and the FY2025 10-K', periodicity: 'Quarterly (5 quarters) and annual', series: 'wsPerBbl', unit: 'eps' },
        { name: 'Produced water royalty per barrel', definition: 'Produced water royalties / royalty barrels. Derived here; TPL reports both terms but not the ratio.',
          source: 'Derived from the releases and the FY2025 10-K', periodicity: 'Quarterly (5 quarters) and annual', series: 'pwrPerBbl', unit: 'eps' },
        { name: 'Operating margin', definition: 'Segment operating income / segment revenue. Disclosed from 1Q24 (quarterly) and FY2023 (annual).',
          source: 'Derived from the Results dataset', periodicity: 'Quarterly and annual', series: 'wsoMargin', unit: 'pct' },
      ],
      kpiNote: 'TPL publishes water sales and produced water royalty volumes, in barrels and barrels per day: annually for 2023-2025 in the 10-K, and quarterly only from the 4Q25 release (which, with the 1Q26 release, also gives 1Q25 and 3Q25). 2Q25 and every earlier quarter are not disclosed. It publishes no price per barrel and no cost per barrel.',
      interactions: [
        { name: 'Barrels sold × price per barrel', relation: 'water sales = barrels sold × revenue per barrel', bridge: 'water',
          lines: ['Water sales'],
          why: 'The price × volume identity of water sales. In FY2025 the 10-K attributes the growth to "increases of 8.8% in water sales pricing and 3.4% in volumes". Revenue per barrel, derived from the reported terms, rose from $0.55 (FY2023) to $0.56 (FY2024) and $0.61 (FY2025), and was $0.66 in 2Q26. TPL announces no price list. Against what is the price durable? TPL discloses no cost per barrel; the closest line is water service-related expenses ($53.5M in FY2025), which holds water purchases, transfer and treatment costs but is not split per barrel or between water sales and other water revenue.',
          data: 'Charted for the five quarters with volumes (1Q25, 3Q25, 4Q25, 1Q26, 2Q26); 2Q25 is not disclosed. DECOMPOSITION: revenue per barrel is revenue divided by barrels.' },
        { name: 'Royalty barrels × royalty per barrel', relation: 'produced water royalties = royalty barrels × royalty per barrel', bridge: 'pwr',
          lines: ['Produced water royalties'],
          why: 'Volume carries this line: royalty barrels rose from 2,510 thousand per day (FY2023) to 4,292 thousand (FY2025) and 4,872 thousand (2Q26), while the royalty per barrel, derived, slipped from $0.092 (FY2023) to $0.083 (FY2024) and $0.079 (FY2025). The 10-K: produced water royalties "are contractual and not paid as a matter of right"; the 3Q25 10-Q adds that they "are also fee based and not directly impacted by lower commodity prices". No cost per barrel exists to set the fee against: TPL operates no disposal wells.',
          data: 'Charted for the five quarters with volumes (1Q25, 3Q25, 4Q25, 1Q26, 2Q26). DECOMPOSITION.' },
      ],
      bridges: [
        { key: 'water', label: 'Water sales', view: 'q', target: 'ws', kind: 'decomposition',
          terms: ['wsvol', 'wsPerBbl'],
          identity: 'water sales = barrels sold × revenue per barrel',
          note: 'A decomposition: revenue per barrel is water sales divided by barrels sold. Only five quarters carry volumes; 2Q25 and earlier quarters are not disclosed.' },
        { key: 'pwr', label: 'Produced water', view: 'q', target: 'pwr', kind: 'decomposition',
          terms: ['pwrvol', 'pwrPerBbl'],
          identity: 'produced water royalties = royalty barrels × royalty per barrel',
          note: 'A decomposition: royalty per barrel is produced water royalties divided by royalty barrels. Only five quarters carry volumes.' },
      ],
      highlights: [],
      drivers: { rev: { from: 'results:rev_wso' }, opinc: { from: 'results:wsoop' }, ws: { from: 'results:ws' }, pwr: { from: 'results:pwr' } },
    },
  ],

  other: [
    {
      key: 'lines', label: 'Revenue lines', sub: 'royalties, easements, water sales, produced water, land',
      lede: 'The same revenue by line, as the income statement reports it. Oil and gas royalties are about half; the two water lines are over a third.',
      note: 'Quarterly from TPL\'s earnings releases, annual from the 10-K. Easements and other surface-related income is consolidated (both segments). The five lines add up to total revenue in every period.',
      tenK: { text: 'Our revenues are derived from oil and gas royalties, water sales, produced water royalties, easements and other surface-related income and land sales.', where: TENK + ', Item 7 — Overview' },
      cite: { form: '10-K', period: '2025', accession: '0001811074-26-000018', url: URL_K },
      spans: 'Quarterly 1Q22-2Q26 (8-K); annual 2021-2025 (10-K).',
      views: ['q', 'y'],
      series: [
        { key: 'og', ref: 'results:og', label: 'Oil and gas royalties' },
        { key: 'ease', ref: 'results:ease', label: 'Easements and other surface-related income' },
        { key: 'ws', ref: 'results:ws', label: 'Water sales' },
        { key: 'pwr', ref: 'results:pwr', label: 'Produced water royalties' },
        { key: 'land', ref: 'results:land', label: 'Land sales' },
      ],
    },
    {
      key: 'stream', label: 'Royalty stream', sub: 'oil, natural gas, NGL',
      lede: 'Oil and gas royalties split by product. Oil is about three-quarters; gas royalties swing with gas prices and were under $5M in several quarters.',
      note: 'From the Oil and Gas Activity table of each release and 10-K. That table excludes the $8.7M royalty recovery booked in 1Q23, so 1Q23 and FY2023 add to $8.7M less than the income-statement line.',
      caveat: 'This cut covers oil and gas royalties only, not total revenue.',
      tenK: { text: 'The table below provides financial and operational data by oil and gas royalty stream for the years ended December 31, 2025, 2024, and 2023', where: TENK + ', Item 1 — Oil and Gas Activity' },
      cite: { form: '10-K', period: '2025', accession: '0001811074-26-000018', url: URL_K },
      spans: 'Quarterly 1Q22-2Q26 (8-K); annual 2021-2025 (10-K).',
      views: ['q', 'y'],
      series: [
        { key: 'oil', ref: 'shared:oil', label: 'Oil royalties' },
        { key: 'gas', ref: 'shared:gas', label: 'Natural gas royalties' },
        { key: 'ngl', ref: 'shared:ngl', label: 'NGL royalties' },
      ],
    },
  ],

  customers: {
    cite: { form: '10-K', period: '2025', accession: '0001811074-26-000018', url: URL_K },
    concentration: { disclosed: true, note: CONC, where: TENK + ', Note 2 (Significant Customers)' },
    classes: [
      { key: 'operators', label: 'Oil and gas operators (royalties)', where: ROY.where, text: ROY.text },
      { key: 'surface', label: 'Pipeline, utility and other surface users (easements and leases)', where: EASE.where, text: EASE.text },
      { key: 'water', label: 'Energy businesses and water management service companies (water)', where: WATERC.where, text: WATERC.text },
      { key: 'nextgen', label: 'Data center, power and other next-generation developers', where: NEXTGEN.where, text: NEXTGEN.text },
      { key: 'top3', label: 'Three investment-grade operators (about 40% of revenue)', where: TENK + ', Item 1 — Major Customers',
        text: 'While approximately 40% of our 2025 revenue was derived from only three customers, each of these customers are investment-grade rated and are among the largest companies in the world based on market capitalization.' },
    ],
    buysLede: 'TPL names no customer in its 10-K, so the rows are the customer classes it describes, each weighed by the revenue line it pays for in FY2025.',
    buysBase: { keys: ['y_og', 'y_ease', 'y_ws', 'y_pwr', 'y_land'], y: '2025', label: 'FY2025 revenue' },
    buys: [
      { name: 'Oil and gas operators', what: 'Royalties on the oil, gas and NGL they produce from wells on TPL\'s royalty acreage', seg: 'Land and Resource Management', shareOf: ['y_og'], src: '10-K income statement: oil and gas royalties' },
      { name: 'Energy businesses buying water', what: 'Sourced and treated water for drilling and completions', seg: 'Water Services and Operations', shareOf: ['y_ws'], src: '10-K income statement: water sales' },
      { name: 'Water management service companies', what: 'Royalties per barrel to move or dispose of produced water across TPL\'s land', seg: 'Water Services and Operations', shareOf: ['y_pwr'], src: '10-K income statement: produced water royalties' },
      { name: 'Pipeline, utility and other surface users', what: 'Easements, commercial leases, materials, permits and lease bonuses', seg: 'Both segments', shareOf: ['y_ease'], src: '10-K income statement: easements and other surface-related income' },
      { name: 'Land buyers', what: 'Tracts of land', seg: 'Land and Resource Management', shareOf: ['y_land'], src: '10-K income statement: land sales' },
      { name: 'Three largest customers (unnamed)', what: 'Across royalties, water and surface; the 10-K describes them as investment-grade Permian operators', seg: 'Both segments', share: 39.6, shareBasis: 'filing', src: '10-K Note 2: Significant Customers' },
    ],
    buysNote: 'The first five rows are revenue lines over total FY2025 revenue and add to 100%. The last row overlaps them: it is the share of revenue the three largest customers paid across all lines, as the filing gives it. The 10-K shows the three in a chart and does not name them in its text.',
    splc: false,
  },

  summit: {},
};
