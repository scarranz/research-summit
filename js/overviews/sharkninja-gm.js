// overviews/sharkninja-gm.js — SharkNinja Deep Dive ▸ Miscellaneous ▸ Gross Margin.
//
// THE QUESTION THIS PANE ANSWERS (SAB, Sep 17 2026): SharkNinja's gross margin went from the
// mid-30s to the high-40s in three years. Why did it rise, what has management named as the
// driver each quarter, and what have they said about where it goes next.
//
// WHERE THE NUMBERS COME FROM. Two sources, never mixed in one series:
//   • THE LEVELS drawn in the charts are REPORTED gross margin — gross profit ÷ net sales read
//     through from js/results-data/sn.js (annual FY2022–FY2025 and quarterly 3Q23–2Q26 actuals,
//     plus Bloomberg Street consensus on the forward periods). Nothing is retyped here.
//   • THE LEDGER is what management SAID on each call, in their own basis — ADJUSTED gross margin —
//     with the verbatim quote and the driver they named. Adjusted excludes share-based compensation
//     and a few one-offs, so an adjusted level sits a touch above the reported one; the two are
//     labelled and never plotted on the same line.
// The quotes are lifted from the frozen theme record (js/themes-data/sn.js — thirteen calls, Q2 2023
// through Q2 2026, read in full through Quartr in Sep 2026), so this pane makes no runtime call to
// anything and cannot drift from the record the rest of the profile reads.
//
// The tariff block at the foot MOVED here from Miscellaneous ▸ Other Analysis when SAB retired that
// sub-tab (Sep 17 2026). It belongs with gross margin: tariffs are the single largest identified
// pressure on the line, and the $247.1M refund lands in cost of sales.
//
// Path 3 of CHART_ENGINE_REFERENCE §0.1 (a metric over time against nothing — no vintage axis, no
// guidance band), drawn with the §0.7 kit in sharkninja-misc-kit.js, so every chart here gets the
// six non-negotiables for free: drag-to-zoom, chips that hide a series from the chart AND its table,
// a table under each chart carrying everything drawn, unambiguous units, forward periods marked E.

import { snResults } from '../results-data/sn.js';
import { snvChart, snvInit, fold, tiles, head, SUMMIT_CAT, SUMMIT_MUTE } from './sharkninja-misc-kit.js';
// Expansion vs contraction is POLARITY, not identity, so it takes the reserved semantic pair rather
// than two categorical slots (js/viz-palette.js's own rule).
import { SUMMIT_POS, SUMMIT_NEG } from '../viz-palette.js';
import { SN_TARIFF_KPIS, SN_TARIFF_LEDE, SN_TARIFF_REFUND, SN_TARIFF_TREATMENT,
         SN_TARIFF_MARGIN, SN_TARIFF_NOTE } from './sharkninja-quartr.js';
import { SN_DECK } from './sharkninja-deck-data.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&(?!#?\w+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function pct1(v){ return v==null ? '—' : v.toFixed(1)+'%'; }
function bp(v){ return v==null ? '—' : (v>0?'+':'−')+Math.abs(Math.round(v))+' bp'; }

// ── The driver record ───────────────────────────────────────────────────────────────────────────
// One entry per call that said something about the gross-margin line, oldest first. `lvl`/`yoy` are
// the ADJUSTED figures as SPOKEN (null where the call gave no number); `scope` says whether the
// number is the quarter or the full year, because management switches between the two. `up`/`down`
// are the drivers they named, in their words, compressed to a chip. `q` is verbatim.
var DRIVERS = [
  { q:'Q2 2023', lvl:43.5, yoy:370, scope:'quarter', who:'Larry Flynn (interim CFO)',
    up:['Freight costs down','D2C channel mix','Beauty mix'], down:[],
    quote:'primarily driven by cost tailwinds, including lower freight costs, as well as strong sales through our higher margin direct-to-consumer channel, specifically in the beauty category',
    src:'https://web.quartr.com/companies/15145/events/91000/overview' },
  { q:'Q3 2023', lvl:null, yoy:950, scope:'quarter', who:'Mark Barrocas (CEO)',
    up:['Supply-chain tailwinds','Cost optimization','Pricing & promo mix'], down:[],
    quote:'continued supply chain tailwinds, cost optimization efforts, and a favorable pricing and promotional mix',
    note:'The pre-COVID target was 45%: "We\'re currently on pace to hit that target this year, well ahead of plan." Part of the upside was spent — S&M went to 19.4% of sales from 14.1%.',
    src:'https://web.quartr.com/companies/15145/events/91026/overview' },
  { q:'Q4 2023', lvl:47.4, yoy:970, scope:'quarter', who:'Larry Flynn (interim CFO)',
    up:['Freight costs down','Beauty mix','D2C channel mix','Less discounting'], down:[],
    quote:'ASPs were strong in the fourth quarter, you know, discounted less than expected, you know, really driving demand through our investments in media',
    src:'https://web.quartr.com/companies/15145/events/129667/overview' },
  { q:'Q1 2024', lvl:50.8, yoy:210, scope:'quarter', who:'Larry Flynn (interim CFO)',
    up:['Supply-chain tailwinds','Cost optimization'], down:[],
    quote:'primarily driven by continued supply chain tailwinds and cost optimization efforts',
    note:'Adjusted EBITDA margin rose only 30 bp — the gross-margin upside was reinvested in R&D and marketing, which is the pattern for the whole period.',
    src:'https://web.quartr.com/companies/15145/events/164472/overview' },
  { q:'Q2 2024', lvl:null, yoy:600, scope:'quarter', who:'Mark Barrocas (CEO)',
    up:['Supplier diversification','Competitive bidding','Value engineering','Pricing management'], down:[],
    quote:'supplier diversification, competitive bidding, value engineering, and pricing management drove nearly 600 basis points of Adjusted Gross Margin improvement',
    note:'This is the clearest statement of the mechanism: the gains are sourcing and product-cost work, not price increases.',
    src:'https://web.quartr.com/companies/15145/events/192649/overview' },
  { q:'Q3 2024', lvl:null, yoy:200, scope:'year', who:'Mark Barrocas (CEO)',
    up:['Cost optimization','Supplier diversification'], down:['Section 301 tariffs'],
    quote:'This is on top of approximately 700 basis points improvement last year, an incredible 900 basis points increase over two years',
    src:'https://web.quartr.com/companies/15145/events/220027/overview' },
  { q:'Q4 2024', lvl:null, yoy:220, scope:'year', who:'Patraic Reagan (CFO)',
    up:['Supplier diversification','Competitive bidding','Value engineering'], down:[],
    quote:'a 220 basis point improvement in adjusted gross margin and a comparable rise in operating expenses as we continued reinvesting',
    src:'https://web.quartr.com/companies/15145/events/238603/overview' },
  { q:'Q1 2025', lvl:null, yoy:-60, scope:'quarter', who:'Patraic Reagan (CFO)',
    up:['Cost optimization','Mix'], down:['Tariffs','Lapping full-price sell-in'],
    quote:'cost optimization and mix upside offset primarily by the impact of tariffs and the lapping of full-price sell-in',
    note:'The first decline of the period, and the turn in the story: from here the line is defended rather than expanded.',
    src:'https://web.quartr.com/companies/15145/events/315494/overview' },
  { q:'Q2 2025', lvl:null, yoy:30, scope:'quarter', who:'Patraic Reagan (CFO)',
    up:['Cost optimization','Pricing & promo'], down:['Tariffs','Mix'],
    quote:'cost optimization and favorability on pricing and promotional activity partially offset by the impact of tariffs, with mix being a secondary offset',
    src:'https://web.quartr.com/companies/15145/events/344012/overview' },
  { q:'Q3 2025', lvl:null, yoy:90, scope:'quarter', who:'Adam Quigley (CFO)',
    up:['True outperformance (⅓)','Tariff timing (⅔)'], down:[],
    quote:'roughly one-third of the year-over-year expansion came from true outperformance, while two-thirds was the result of favorability related to the timing of tariffs flowing through the financials',
    note:'The most important caveat in the record: two-thirds of this quarter\'s expansion was timing that reverses. Management said so unprompted.',
    src:'https://web.quartr.com/companies/15145/events/372004/overview' },
  { q:'Q4 2025', lvl:null, yoy:null, scope:'quarter', who:'Adam Quigley (CFO)',
    up:['International gross margins','Channel mix','Sales mix'], down:[],
    quote:'First, our international gross margins expanded nicely based on a number of elements, including cost optimization and channel mix. Secondly, our overall sales mix was more favorable than anticipated',
    src:'https://web.quartr.com/companies/15145/events/399981/overview' },
  { q:'Q1 2026', lvl:49.2, yoy:-100, scope:'quarter', who:'Adam Quigley (CFO)',
    up:['Pricing','Mix'], down:['Tariffs — full quarter of impact'],
    quote:'Tariffs presented a sizable headwind with a full quarter of impact in Q1 of 2026 compared to a baseline with minimal tariffs',
    src:'https://web.quartr.com/companies/15145/events/555079/overview' },
  { q:'Q2 2026', lvl:48.7, yoy:-70, scope:'quarter', who:'Company (Q2 2026 release and call)',
    up:['Cost optimization','Category & channel mix','JS Global sourcing fee ended'], down:['US tariff cost','FX','Retailer activations'],
    quote:'mostly the annualization of 2025 tariffs rather than new cost',
    note:'The JS Global sourcing service fee terminated Jul 31, 2025, so its removal is a genuine structural help rather than a one-off.',
    src:'https://web.quartr.com/companies/15145/events/689372/overview' },
];

// What they said about where the line GOES — the forward statements, each tied to the call that made it.
var OUTLOOK = [
  { on:'Q2 2023 call', per:'2H 2023', said:'Gross-margin expansion "expanding at a faster rate in the second half relative to the first half", after +330 bp in 1H.', who:'Flynn', kind:'up',
    src:'https://web.quartr.com/companies/15145/events/91000/overview' },
  { on:'Q4 2023 call', per:'FY2024', said:'About <b>80–100 bp</b> of expansion for the year — weighted to 1H, "kind of flattish in the second half" — with adjusted opex effectively flat as a % of sales.', who:'Flynn', kind:'up',
    src:'https://web.quartr.com/companies/15145/events/129667/overview' },
  { on:'Q2 2024 call', per:'FY2024', said:'Raised to "roughly about <b>175 to 200 basis points</b> of expansion on a full year basis", with 2H slowing as it laps the prior-year gains.', who:'Reagan', kind:'up',
    src:'https://web.quartr.com/companies/15145/events/192649/overview' },
  { on:'Q4 2024 call', per:'FY2025', said:'"Q1 will be the low point in terms of margin expansion or better said contraction through the year", building through Q2–Q4 as production leaves China.', who:'Barrocas', kind:'mixed',
    src:'https://web.quartr.com/companies/15145/events/238603/overview' },
  { on:'Q3 2025 call', per:'Q4 2025', said:'Tariff timing "will put pressure on our adjusted gross margin by <b>roughly 50 basis points</b>", with nearly 250 bp of opex leverage to offset it.', who:'Quigley', kind:'down',
    src:'https://web.quartr.com/companies/15145/events/372004/overview' },
  { on:'Q4 2025 call', per:'1H 2026', said:'"The first half, we expect a <b>decent gross margin headwind driven by tariffs</b>, with slight offsets driven by all the cost optimization efforts."', who:'Quigley', kind:'down',
    src:'https://web.quartr.com/companies/15145/events/399981/overview' },
  { on:'Q1 2026 call', per:'FY2026 and beyond', said:'The model restated: "An adaptable P&L that can <b>absorb challenges on the gross margin line while driving material OpEx leverage</b> to deliver on our Adjusted EBITDA goals."', who:'Quigley', kind:'mixed',
    src:'https://web.quartr.com/companies/15145/events/555079/overview' },
  { on:'Q3 2025 call', per:'Structural', said:'Why the line can keep rising: value engineering, sourcing and mix — "we are entering into new categories that are commanding <b>higher price points that have more structural, higher gross margins</b>."', who:'Quigley', kind:'up',
    src:'https://web.quartr.com/companies/15145/events/372004/overview' },
  { on:'Q2 2026 outlook', per:'2H 2026', said:'Tariff rates held flat at the company\'s own assumptions for the rest of the year — <b>12.5%</b> on China, Vietnam and Thailand, <b>10%</b> on Indonesia, Malaysia and Cambodia — and the <b>$247.1M</b> refund recognised in cost of sales in 3Q26.', who:'Company outlook', kind:'mixed',
    src:'https://web.quartr.com/companies/15145/events/689372/overview' },
];

// ── The levels, read through from the Results dataset ───────────────────────────────────────────
function marginSeries(view){
  var m = snResults.views[view].metrics, gp = m.grossProfit, rev = m.rev;
  var gm = function(src){ return gp.periods.map(function(_, i){
    var g = gp[src][i], r = rev[src][i];
    return (g == null || !r) ? null : Math.round(g / r * 1000) / 10;
  }); };
  var act = gm('act'), cons = gm('cons');
  // One line, actual where reported and consensus beyond it, so the axis never has two versions of
  // the same period; `estFrom` shades and marks the consensus columns.
  var joined = act.map(function(v, i){ return v != null ? v : cons[i]; });
  var first = -1;
  act.forEach(function(v, i){ if (first < 0 && v == null && joined[i] != null) first = i; });
  return { labels: gp.periods.slice(), data: joined, estFrom: first };
}

function gmCharts(){
  var y = marginSeries('y'), q = marginSeries('q');
  var annual = snvChart('sn-gm-annual', {
    title: 'Reported gross margin by fiscal year', unit: '%', unitLabel: 'Gross profit ÷ net sales, %',
    labelsOn: true, height: 250, yMin: 30, labels: y.labels, estFrom: y.estFrom,
    series: [{ k: 'gm', label: 'Gross margin', color: SUMMIT_CAT[0], data: y.data }],
    tableHead: 'Gross margin by year', note: 'FY2022–FY2025 reported; later years are Bloomberg Street consensus, marked E. Reported, not adjusted — the calls quote adjusted figures, which run a little higher.',
  });
  var quarterly = snvChart('sn-gm-quarterly', {
    title: 'Reported gross margin by quarter', unit: '%', unitLabel: 'Gross profit ÷ net sales, %',
    height: 250, yMin: 40, labels: q.labels, estFrom: q.estFrom,
    series: [{ k: 'gm', label: 'Gross margin', color: SUMMIT_CAT[0], data: q.data }],
    tableHead: 'Gross margin by quarter', note: 'The quarterly record starts at 3Q23, SharkNinja\'s first full quarter as a public company. 3Q26–4Q26 are Bloomberg Street consensus. ⚠ The 3Q26 consensus carries the $247.1M tariff refund as a reduction of cost of sales, which is why it jumps — see the tariff section below.',
  });
  return '<div class="snv-grid2">' + annual + quarterly + '</div>';
}

function gmYoyChart(){
  var rows = DRIVERS.filter(function(d){ return d.yoy != null; });
  var up = rows.map(function(d){ return d.yoy > 0 ? d.yoy / 100 : null; });
  var dn = rows.map(function(d){ return d.yoy < 0 ? d.yoy / 100 : null; });
  return snvChart('sn-gm-yoy', {
    title: 'What management said the change was, quarter by quarter', unit: '%', unitLabel: 'Year-on-year change in ADJUSTED gross margin, percentage points',
    labelsOn: true, height: 260, labels: rows.map(function(d){ return d.q + (d.scope === 'year' ? ' (FY)' : ''); }),
    series: [{ k: 'up', label: 'Expansion', color: SUMMIT_POS, data: up },
             { k: 'dn', label: 'Contraction', color: SUMMIT_NEG, data: dn }],
    tableHead: 'Year-on-year change as stated on each call',
    note: 'The figure each call gave for ADJUSTED gross margin, in percentage points (100 bp = 1.0 pp). Two entries are full-year statements rather than the quarter and are marked (FY). Q4 2025 gave drivers but no number, so it is not drawn.',
  });
}

function driverChips(list, dir){
  if (!list || !list.length) return '';
  return '<div class="snv-chips" style="margin-top:6px">' + list.map(function(x){
    return '<span class="snv-chip' + (dir === 'down' ? ' snv-chip-dn' : ' snv-chip-up') + '">' + (dir === 'down' ? '▼ ' : '▲ ') + esc(x) + '</span>';
  }).join('') + '</div>';
}
function driverCards(){
  return '<div class="snv-gm-cards">' + DRIVERS.slice().reverse().map(function(d){
    var tone = d.yoy == null ? SUMMIT_MUTE : (d.yoy > 0 ? SUMMIT_POS : SUMMIT_NEG);
    return '<div class="snv-gm-card" style="border-left-color:' + tone + '">' +
      '<div class="snv-gm-top"><b>' + esc(d.q) + '</b>' +
        '<span class="snv-gm-num">' + (d.lvl != null ? pct1(d.lvl) : '') +
          (d.yoy != null ? '<small>' + esc(bp(d.yoy)) + (d.scope === 'year' ? ' FY' : ' YoY') + '</small>' : '<small>no figure given</small>') + '</span></div>' +
      driverChips(d.up, 'up') + driverChips(d.down, 'down') +
      '<blockquote class="snv-gm-q">“' + esc(d.quote) + '”<cite>' + esc(d.who) +
        ' · <a href="' + esc(d.src) + '" target="_blank" rel="noopener">call ↗</a></cite></blockquote>' +
      (d.note ? '<div class="snv-gm-note">' + esc(d.note) + '</div>' : '') +
    '</div>';
  }).join('') + '</div>';
}

function outlookTable(){
  var rows = OUTLOOK.map(function(o){
    var tag = o.kind === 'up' ? '<span class="ov-tag" style="background:rgba(27,175,122,.14);color:#0F7A55">expansion</span>'
            : o.kind === 'down' ? '<span class="ov-tag" style="background:rgba(227,73,72,.12);color:#B0322F">headwind</span>'
            : '<span class="ov-tag">mixed</span>';
    return '<tr><td class="ov-td-name">' + esc(o.on) + '</td><td>' + esc(o.per) + ' ' + tag + '</td>' +
      '<td style="white-space:normal">' + o.said + '</td><td>' + esc(o.who) +
      ' <a href="' + esc(o.src) + '" target="_blank" rel="noopener">↗</a></td></tr>';
  }).join('');
  return '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr>' +
    '<th>Said on</th><th>About</th><th>What they said</th><th>Who</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

// The tariff block, moved here from Miscellaneous ▸ Other Analysis (Sep 17 2026).
function tariffBlock(){
  var ol = SN_DECK.outlook;
  var refundSplit = '<div class="snv-split" style="margin-top:6px">' +
      '<div style="flex:1;background:' + SUMMIT_CAT[1] + '">Duties expensed in FY2025 · excluded from adjusted</div>' +
      '<div style="flex:1;background:' + SUMMIT_CAT[0] + '">Duties incurred in 2026 · inside adjusted</div></div>' +
    '<div class="dd-note">The $247.1M refund splits roughly evenly — so GAAP 3Q26 carries about <b>twice</b> the benefit the adjusted figures do.</div>';
  var bridge = '<div class="snv-bridge">' + ol.rows.map(function(r){
    var pm = (r.prior[0] + r.prior[1]) / 2, nm = (r.now[0] + r.now[1]) / 2, raise = nm - pm, op = raise - r.tariff;
    var opPct = Math.round(op / raise * 100), tPct = 100 - opPct;
    return '<div><b>' + esc(r.label) + '</b><br><span style="color:var(--mu)">raise +' + esc(r.fmt(raise)) + '</span></div>' +
      '<div class="snv-split" title="' + esc('Operations ' + r.fmt(op) + ' · tariff refund ~' + r.fmt(r.tariff)) + '">' +
        '<div style="flex:' + opPct + ';background:' + SUMMIT_CAT[0] + '">' + opPct + '%</div>' +
        '<div style="flex:' + tPct + ';background:' + SUMMIT_CAT[1] + '">' + tPct + '%</div></div>' +
      '<div class="snv-bridge-v">' + esc(r.fmt(pm)) + ' → ' + esc(r.fmt(nm)) + '</div>';
  }).join('') + '</div>' +
    '<div class="snv-split-leg"><span><i style="background:' + SUMMIT_CAT[0] + '"></i>Raise from operations</span>' +
    '<span><i style="background:' + SUMMIT_CAT[1] + '"></i>Raise from the tariff refund</span></div>';
  return head('Tariffs — the pressure on the line, and the refund', null, esc(SN_TARIFF_LEDE)) +
    tiles(SN_TARIFF_KPIS.map(function(k){ return { v: k.v, l: k.l, s: k.s }; }), 3) +
    refundSplit +
    head('The FY2026 raise — how much of it is the refund', ol.link,
      'Net sales guide raised from <b>' + esc(ol.sales.prior) + '</b> to <b>' + esc(ol.sales.now) + '</b>, with no refund in it.') +
    bridge + '<div class="dd-note">' + esc(ol.note) + '</div>' +
    fold('The refund, the accounting treatment and the margin — in full',
      '<div class="dd-callout">' + SN_TARIFF_REFUND + '</div><div class="dd-callout">' + SN_TARIFF_TREATMENT + '</div>' +
      '<p style="margin:10px 0 0">' + SN_TARIFF_MARGIN + '</p><div class="dd-note">' + esc(SN_TARIFF_NOTE) + '</div>');
}

function gmTiles(){
  var y = marginSeries('y'), idx = {};
  y.labels.forEach(function(l, i){ idx[l] = i; });
  var v = function(l){ return y.data[idx[l]]; };
  var first = v('2022'), last = v('2025');
  var latest = DRIVERS[DRIVERS.length - 1];
  return tiles([
    { v: pct1(first), l: 'Gross margin FY2022', s: 'the year before the NYSE listing' },
    { v: pct1(last), l: 'Gross margin FY2025', s: (first != null && last != null ? bp((last - first) * 100) + ' in three years' : '') },
    { v: pct1(latest.lvl), l: 'Adjusted gross margin 2Q26', s: bp(latest.yoy) + ' YoY — tariff annualization' },
    { v: '≈900 bp', l: 'Expansion management claims for 2023–24', s: '~700 bp in 2023 plus ~200 bp in 2024' },
  ], 4);
}

export function snGmBody(){
  return '<div class="snv">' +
    gmTiles() +
    fold('The story in one paragraph',
      'SharkNinja\'s gross margin rose from the mid-30s in FY2022 to the high-40s by FY2024, and management has been unusually specific about why: first the freight and supply-chain costs of 2021–22 unwinding, then a deliberate product-cost programme — <b>supplier diversification, competitive bidding and value engineering</b> — and a mix shift towards higher-margin direct-to-consumer and beauty sales. Almost none of it dropped to the bottom line: the same calls say the upside was <b>reinvested</b> in R&D and marketing, which is why adjusted EBITDA margin barely moved while gross margin gained ~900 bp in two years. Since 1Q25 the line has been defended rather than expanded, because <b>tariffs</b> arrived; management\'s stated model is now to absorb that on the gross-margin line and deliver profit growth through operating-expense leverage instead. The one caveat they volunteered themselves: two-thirds of 3Q25\'s expansion was tariff <b>timing</b>, not performance.') +

    head('The level — reported, and where consensus has it going') + gmCharts() +

    head('The change, as management stated it') + gmYoyChart() +

    head('Every call, the drivers it named, and the quote', null,
      'Newest first. Levels and year-on-year changes are the company\'s ADJUSTED figures as spoken; the charts above are the reported line.') +
    driverCards() +

    head('What they have said about where it goes', null,
      'The forward statements, each tied to the call that made it — so a guide can be read against what the next print actually did.') +
    outlookTable() +

    tariffBlock() +

    '<div class="dd-note">Sources: gross-profit and net-sales levels from js/results-data/sn.js (SharkNinja 20-F/10-K and quarterly earnings releases; forward periods Bloomberg BST consensus). Commentary from SharkNinja\'s earnings calls, Q2 2023 through Q2 2026, retrieved through Quartr and frozen in js/themes-data/sn.js — each card links to its call. Tariff figures from the Q2 2026 earnings release and call (Aug 5, 2026).</div>' +
  '</div>';
}

export function snGmInit(pane){
  if (!pane) return;
  snvInit(pane);
}
