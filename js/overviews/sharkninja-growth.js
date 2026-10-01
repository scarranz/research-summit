// overviews/sharkninja-growth.js — SharkNinja Deep Dive ▸ Miscellaneous ▸ Units vs Price.
//
// THE QUESTION (SAB, Sep 17 2026): can SharkNinja's top-line growth be split into units, price and
// mix? The honest answer, and the reason this pane exists rather than a bridge chart:
//
//   SharkNinja discloses NO unit volumes and NO average selling price, at any level — not a unit
//   count, not a company ASP, not a price/volume/mix split, not household penetration, not an
//   attach rate, not a replacement-cycle length. The finest cut in the reported numbers is NET
//   SALES DOLLARS for four category groupings plus geography.
//
// So the pane does the three things that ARE possible, and says plainly what is not:
//   1 · DOLLAR DECOMPOSITION, computed: each category's contribution to the year-on-year growth
//       rate, in percentage points, from js/results-data/sn.js. This is arithmetic on reported
//       figures — nothing is asserted.
//   2 · MANAGEMENT'S OWN SPLIT, in words: the Sep 15 2026 Goldman fireside, where the CEO says
//       2026 growth is "predominantly unit growth" with "a little bit" of ASP mix and no price
//       increases. Decisive on direction, unquantified — labelled as such.
//   3 · THE PROXIES that stand in for units: the shipments-vs-POS gap, the market's own decline
//       (Circana, quoted by management), the per-launch price ladder, and the price-action record.
//
// SOURCING. The commentary below was retrieved through Quartr on Sep 17 2026 by reading, in full,
// the four most recent earnings calls (Q3 2025 → Q2 2026) and the five conference/fireside
// transcripts in that window (Morgan Stanley Dec 2025, ICR Jan 2026, William Blair Jun 2026,
// Canaccord Aug 2026, Goldman Sachs Sep 2026): 49 statements carrying a figure, 44 qualitative.
// It is FROZEN here (memory: freeze-mcp-sourced-data) — no runtime call to anything. Every quote is
// verbatim and carries a deep link to its own paragraph.
//
// ⚠ TWO THINGS THE READER MUST NOT BE LET TO MISS, both stated in the pane:
//   • The decisive quote is from a CONFERENCE, not an earnings call. Conference remarks are not
//     part of a filing and were not read alongside a release.
//   • The one time an analyst asked for the split outright (Brooke Roach, Q4 2025 call: "what
//     contribution do you expect from units versus price?"), the answer was lost to a call audio
//     failure and was never restated. That hole is part of the answer.
//
// Path 3 of CHART_ENGINE_REFERENCE §0.1, drawn with the §0.7 kit (sharkninja-misc-kit.js).

import { snResults } from '../results-data/sn.js';
import { snvChart, snvInit, fold, tiles, head, SUMMIT_CAT, SUMMIT_MUTE } from './sharkninja-misc-kit.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&(?!#?\w+;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function pp(v){ return v==null ? '—' : (v>0?'+':'−')+Math.abs(v).toFixed(1)+' pp'; }

// ── 1 · The dollar decomposition — arithmetic on the reported category series ───────────────────
// Contribution of category i to the total year-on-year growth RATE:
//     (cat_i(t) − cat_i(t−n)) ÷ total(t−n),  n = 4 quarters or 1 year
// The four contributions sum to the total growth rate by construction, which is what makes this a
// decomposition rather than four growth rates side by side.
var CATS = [
  { key:'segCleaning',    label:'Cleaning',                   color:SUMMIT_CAT[0] },
  { key:'segCookBev',     label:'Cooking & Beverage',         color:SUMMIT_CAT[1] },
  { key:'segFoodPrep',    label:'Food Preparation',           color:SUMMIT_CAT[2] },
  { key:'segBeautyHome',  label:'Beauty & Home Environment',  color:SUMMIT_CAT[3] },
];

function contribView(view, lag){
  var m = snResults.views[view].metrics, per = m.rev.periods, out = { labels: [], series: [], total: [] };
  var keep = [];
  per.forEach(function(p, i){
    if (i - lag < 0) return;
    var base = m.rev.act[i - lag], now = m.rev.act[i];
    if (base == null || now == null) return;
    var ok = CATS.every(function(c){ return m[c.key].act[i] != null && m[c.key].act[i - lag] != null; });
    if (!ok) return;
    keep.push(i); out.labels.push(p);
    out.total.push(Math.round((now / base - 1) * 1000) / 10);
  });
  out.series = CATS.map(function(c){
    return { k: c.key, label: c.label, color: c.color, data: keep.map(function(i){
      var base = m.rev.act[i - lag];
      return Math.round((m[c.key].act[i] - m[c.key].act[i - lag]) / base * 1000) / 10;
    }) };
  });
  return out;
}

function contribChart(){
  var q = contribView('q', 4), y = contribView('y', 1);
  var mk = function(v, id){
    return { id:id, label:(id === 'q' ? 'Quarterly, YoY' : 'Annual, YoY'), labels:v.labels, series:v.series,
      note:'Each bar is the total year-on-year growth rate for the period, split by the category that produced it. Contributions sum to the total by construction: ' +
        v.labels.map(function(l, i){ return esc(l) + ' ' + pp(v.total[i]); }).join(' · ') + '.',
      extraRows:[{ label:'Total net sales growth', cells: v.total.map(function(t){ return pp(t); }) }] };
  };
  return snvChart('sn-grow-contrib', {
    title:'Contribution to net-sales growth, by product category', unit:'%', unitLabel:'Contribution to YoY growth, percentage points',
    stacked:true, height:300, tableHead:'Growth contribution by category',
    views:[mk(q, 'q'), mk(y, 'y')],
  });
}

// ── What the Street expects, and what management has said to anchor it (SAB, Sep 17 2026) ──────
// The consensus columns are read through from js/results-data/sn.js — the Bloomberg (BST) rows
// generated out of BBG_CONSENSUS.txt, latest snapshot Aug 10 2026 — so nothing is retyped and the
// table cannot drift from Evolution ▸ Results. Two basis warnings the table states itself:
//   • SharkNinja guides the FISCAL YEAR ONLY, never a quarter. So 3Q26 and 4Q26 carry consensus and
//     management DIRECTION, never a company number; FY2027 and FY2028 carry no company view at all.
//   • Consensus net income and EPS here are GAAP. The company guides ADJUSTED EPS and ADJUSTED
//     EBITDA, and for FY2026 GAAP also carries the tariff refund that adjusted partly excludes.
var CONS_COLS = [
  { k:'3Q26', view:'q', per:'3Q26', base:'3Q25', label:'3Q26E' },
  { k:'4Q26', view:'q', per:'4Q26', base:'4Q25', label:'4Q26E' },
  { k:'FY2026', view:'y', per:'2026', base:'2025', label:'FY2026E', ref:true },
  { k:'FY2027', view:'y', per:'2027', base:'2026', label:'FY2027E' },
  { k:'FY2028', view:'y', per:'2028', base:'2027', label:'FY2028E' },
];
var CONS_ROWS = [
  { key:'rev',        label:'Net sales',           kind:'usdM', growth:true },
  // The Street models the four product categories and the two brands as well — the same cuts the
  // company discloses in dollars — so the sales line can be broken out rather than left as a total.
  { head:'By product category' },
  { key:'segCleaning',   label:'Cleaning',                  kind:'usdM', indent:true, inlineGrowth:true },
  { key:'segCookBev',    label:'Cooking & Beverage',        kind:'usdM', indent:true, inlineGrowth:true },
  { key:'segFoodPrep',   label:'Food Preparation',          kind:'usdM', indent:true, inlineGrowth:true },
  { key:'segBeautyHome', label:'Beauty & Home Environment', kind:'usdM', indent:true, inlineGrowth:true },
  { head:'By brand' },
  // No YoY on the 4Q26 column: the 4Q25 brand split in the dataset is a known Bloomberg
  // reclassification (Shark $1,766M vs Ninja $336M against a quarter total that ties), and it is
  // flagged there rather than smoothed — so there is no comparable base to divide by.
  { key:'brandShark',    label:'Shark',                     kind:'usdM', indent:true, inlineGrowth:true, noGrowth:['4Q26'] },
  { key:'brandNinja',    label:'Ninja',                     kind:'usdM', indent:true, inlineGrowth:true, noGrowth:['4Q26'] },
  { head:'Profitability' },
  { key:'grossProfit',label:'Gross profit',        kind:'usdM', growth:true },
  { key:'ebitdaAdj',  label:'Adjusted EBITDA',     kind:'usdM', growth:true },
  { key:'opIncome',   label:'Operating income',    kind:'usdM', growth:true },
  { key:'niGaap',     label:'GAAP net income',     kind:'usdM', growth:true },
  { key:'epsGaap',    label:'GAAP diluted EPS',    kind:'eps',  growth:true },
];
// One accessor for both views: the consensus value for a period, and the prior-year base, which may
// itself be an actual (a reported quarter/year) or a consensus figure (FY2027 against FY2026E).
function cell(view, key, per){
  var m = snResults.views[view].metrics[key], i = m.periods.indexOf(per);
  if (i < 0) return { v:null, rev:null, src:null };
  var v = m.cons[i] != null ? m.cons[i] : m.act[i];
  var src = m.cons[i] != null ? 'cons' : 'act';
  var r = snResults.views[view].metrics.rev;
  var rv = r.cons[i] != null ? r.cons[i] : r.act[i];
  return { v:v, rev:rv, src:src };
}
function usd0(v){ return v==null ? '—' : '$'+Math.round(v).toLocaleString('en-US')+'M'; }
function usd2(v){ return v==null ? '—' : '$'+v.toFixed(2); }
function growPct(now, base){ return (now==null||base==null||base<=0) ? '—' : (now/base-1>=0?'+':'−')+Math.abs((now/base-1)*100).toFixed(1)+'%'; }
function marginPct(v, rev){ return (v==null||!rev) ? '—' : (v/rev*100).toFixed(1)+'%'; }

// The margin ladder: every line the Street models, as a percent of net sales, top to bottom. The
// three expense lines are the ones the company itself points at when it says profit growth comes
// from operating leverage rather than gross margin, so they belong beside the margins, not under them.
var MARGIN_ROWS = [
  { key:'grossProfit', label:'Gross margin',        head:true },
  { key:'sm',          label:'Sales & marketing',   cost:true, indent:true },
  { key:'ga',          label:'General & admin',     cost:true, indent:true },
  { key:'rd',          label:'Research & development', cost:true, indent:true },
  { key:'opIncome',    label:'Operating margin',    head:true },
  { key:'ebitdaAdj',   label:'Adjusted EBITDA margin', head:true },
  { key:'niGaap',      label:'Net margin (GAAP)',   head:true },
];
function marginTable(){
  var th = CONS_COLS.map(function(c){
    return '<th class="' + (c.ref ? 'cons-ref' : '') + '">' + esc(c.label) +
      (c.ref ? '<br><span class="ov-stat-mut" style="font-weight:500">for reference</span>' : '') + '</th>';
  }).join('');
  var body = MARGIN_ROWS.map(function(r){
    return '<tr' + (r.indent ? ' class="cons-in"' : '') + '><td class="ov-td-name">' + esc(r.label) +
      (r.cost ? ' <span class="ov-stat-mut">% of sales</span>' : '') + '</td>' +
      CONS_COLS.map(function(c){
        var v = cell(c.view, r.key, c.per), rev = cell(c.view, 'rev', c.per).v;
        var b = cell(c.view, r.key, c.base), brev = cell(c.view, 'rev', c.base).v;
        var now = (v.v != null && rev) ? v.v / rev * 100 : null;
        var was = (b.v != null && brev) ? b.v / brev * 100 : null;
        var d = (now != null && was != null) ? (now - was) * 100 : null;
        // On a COST line, falling is the good direction — so the arrow reads leverage, not decline.
        var good = r.cost ? (d != null && d < 0) : (d != null && d > 0);
        return '<td class="' + (c.ref ? 'cons-ref ' : '') + '"><span style="font-weight:600">' +
          (now == null ? '—' : now.toFixed(1) + '%') + '</span>' +
          (d == null ? '' : '<br><span class="ov-stat-mut" style="color:' +
            (Math.abs(d) < 5 ? 'var(--mu)' : (good ? 'var(--pos)' : 'var(--neg)')) + '">' +
            (d >= 0 ? '+' : '−') + Math.abs(Math.round(d)) + ' bp</span>') + '</td>';
      }).join('') + '</tr>';
  }).join('');
  return '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table cons-tbl"><thead><tr><th>Percent of net sales</th>' + th + '</tr></thead><tbody>' + body + '</tbody></table></div>' +
    '<div class="dd-note">Every line as a percent of net sales, with the change against the same period a year earlier in basis points — green is the <b>good</b> direction for that line, so a falling expense ratio reads as leverage. ' +
    'The three expense lines are the ones management points at: the stated model is to <b>absorb pressure on gross margin and take the profit from operating-expense leverage</b>, and consensus has exactly that — S&amp;M from 22.9% of FY2026E sales to 21.8% by FY2028E, G&amp;A 6.4% → 5.4%, R&amp;D 5.5% → 5.1%, while gross margin goes 51.2% → 49.5%. ' +
    'Gross margin less the three expense ratios does <b>not</b> tie exactly to the operating margin: other operating income, depreciation and amortisation and the consensus\'s own inconsistencies sit in between, and each line is modelled by a different set of analysts. ' +
    '<b>3Q26 is the distorted column again</b> — the tariff refund lifts gross margin to 57.5% and the operating margin to 22.4%, while adjusted EBITDA margin (21.1%) sits below the operating margin because the adjusted line strips the part of the refund tied to 2025 duties. Net margin is GAAP throughout.</div>';
}

// How far the modelled lines sit from the modelled total, per column — stated rather than hidden.
function gapNote(){
  var cats = ['segCleaning','segCookBev','segFoodPrep','segBeautyHome'], brands = ['brandShark','brandNinja'];
  var bits = CONS_COLS.map(function(c){
    var tot = cell(c.view, 'rev', c.per).v;
    var sc = cats.reduce(function(a, k){ var v = cell(c.view, k, c.per).v; return a + (v || 0); }, 0);
    var sb = brands.reduce(function(a, k){ var v = cell(c.view, k, c.per).v; return a + (v || 0); }, 0);
    if (!tot || !sc) return null;
    return esc(c.label) + ' categories ' + (sc - tot >= 0 ? '+' : '−') + '$' + Math.abs(Math.round(sc - tot)) + 'M' +
      (sb ? ', brands ' + (sb - tot >= 0 ? '+' : '−') + '$' + Math.abs(Math.round(sb - tot)) + 'M' : '');
  }).filter(Boolean);
  return 'Gap to the consensus total: ' + bits.join(' · ') + '.';
}

function consTable(){
  var th = CONS_COLS.map(function(c){
    return '<th class="' + (c.ref ? 'cons-ref' : '') + '">' + esc(c.label) +
      (c.ref ? '<br><span class="ov-stat-mut" style="font-weight:500">for reference</span>' : '') + '</th>';
  }).join('');
  var body = CONS_ROWS.map(function(r){
    if (r.head) return '<tr class="cons-head"><td class="ov-td-name" colspan="' + (CONS_COLS.length + 1) + '">' + esc(r.head) + '</td></tr>';
    var vals = CONS_COLS.map(function(c){ return cell(c.view, r.key, c.per); });
    var bases = CONS_COLS.map(function(c){ return cell(c.view, r.key, c.base); });
    var revs  = CONS_COLS.map(function(c){ return cell(c.view, 'rev', c.per); });
    var h = '<tr' + (r.indent ? ' class="cons-in"' : '') + '><td class="ov-td-name">' + esc(r.label) + '</td>' + vals.map(function(v, i){
      return '<td class="' + (CONS_COLS[i].ref ? 'cons-ref' : '') + '" style="font-weight:600">' +
        (r.kind === 'eps' ? usd2(v.v) : usd0(v.v)) +
        (r.inlineGrowth ? '<br><span class="ov-stat-mut"' +
          (r.noGrowth && r.noGrowth.indexOf(CONS_COLS[i].k) >= 0 ? ' title="No comparable base: the 4Q25 brand split is a known reclassification in the Bloomberg source">—</span>' : '>' + growPct(v.v, bases[i].v) + '</span>') : '') + '</td>';
    }).join('') + '</tr>';
    if (r.growth) h += '<tr class="cons-sub"><td class="ov-td-name">year-on-year growth</td>' + vals.map(function(v, i){
      return '<td class="' + (CONS_COLS[i].ref ? 'cons-ref' : '') + '">' + growPct(v.v, bases[i].v) + '</td>';
    }).join('') + '</tr>';
    if (r.margin) h += '<tr class="cons-sub"><td class="ov-td-name">' + esc(r.margin) + '</td>' + vals.map(function(v, i){
      var now = marginPct(v.v, revs[i].v), was = marginPct(bases[i].v, cell(CONS_COLS[i].view, 'rev', CONS_COLS[i].base).v);
      var d = (v.v != null && revs[i].v && bases[i].v != null) ?
        (v.v / revs[i].v - bases[i].v / cell(CONS_COLS[i].view, 'rev', CONS_COLS[i].base).v) * 10000 : null;
      return '<td class="' + (CONS_COLS[i].ref ? 'cons-ref' : '') + '">' + now +
        (d == null ? '' : '<br><span class="ov-stat-mut">' + (d >= 0 ? '+' : '−') + Math.abs(Math.round(d)) + ' bp vs ' + esc(CONS_COLS[i].base) + '</span>') + '</td>';
    }).join('') + '</tr>';
    return h;
  }).join('');
  return '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table cons-tbl"><thead><tr><th>Bloomberg consensus</th>' + th + '</tr></thead><tbody>' + body + '</tbody></table></div>' +
    '<div class="dd-note">Bloomberg (BST) consensus, snapshot of Aug 10, 2026, read through from the Results dataset — the same numbers Evolution ▸ Results draws, never retyped. Growth for the quarters is against the reported year-ago quarter; FY2027 and FY2028 growth is against the consensus year before, so it compounds an estimate on an estimate. ' +
    '<b>⚠ 3Q26 gross margin is not a run rate.</b> Consensus has it at 57.5%, roughly 740 bp above 3Q25, because the <b>$247.1M tariff refund</b> lands in 3Q26 as a reduction of cost of sales. Adjusted EBITDA for the same quarter ($394M) sits <b>below</b> operating income ($419M) for exactly that reason — the adjusted line excludes the part of the refund tied to duties expensed in 2025. FY2026 consensus gross margin of 51.2% carries the same benefit; FY2027 drops back to 49.0%. ' +
    'Net income and EPS here are <b>GAAP</b>; the company guides adjusted, so the two are not comparable line for line — the table below keeps them apart. ' +
    '<b>The category and brand lines do not add to the total</b>, and that is a property of consensus, not an error: each line is modelled by a different subset of analysts. ' + gapNote() +
    ' SharkNinja reports <b>one segment</b>, so these cuts are net sales only — no margin exists at this level. ' +
    'The category split is a <b>company disclosure</b> (every quarterly release states it in dollars); the <b>brand</b> split is Bloomberg\'s own tracking, and its 4Q25 quarter is a known reclassification in that source — so the 4Q26 brand column carries the level but no year-on-year figure.</div>';
}

// What management has actually said for each of those periods. `kind` is how hard the number is.
var ANCHORS = [
  { per:'3Q26E', kind:'direction', what:'<b>No quarterly guidance exists</b> — SharkNinja guides the fiscal year only. What is dated to the quarter: the <b>$247.1M</b> CBP refund is recognised in <b>3Q26</b> as a reduction of cost of sales, with roughly half of it (the duties expensed in FY2025) <b>excluded</b> from adjusted EBITDA, adjusted net income and adjusted EPS. So GAAP 3Q26 carries about twice the benefit the adjusted figures do.',
    who:'Q2 2026 release and call, Aug 5 2026' },
  { per:'3Q26E', kind:'direction', what:'Tariff rates are <b>held flat</b> at the company\'s own assumptions for the rest of 2026 — 12.5% on China, Vietnam and Thailand, 10% on Indonesia, Malaysia and Cambodia. Not a policy forecast, an outlook assumption.',
    who:'Q2 2026 outlook' },
  { per:'4Q26E', kind:'direction', what:'Also unguided as a quarter. The shape given for the year: the 2Q26 gross-margin drag was "mostly the <b>annualization</b> of 2025 tariffs rather than new cost", and <b>no list-price increases</b> sit in the FY2026 guide — so the second half is volume and mix, not price.',
    who:'Q2 2026 call · Q1 2026 call' },
  { per:'FY2026E', kind:'number', what:'The only period with company numbers, raised at the 2Q26 print: net sales <b>+16.0% to +17.0%</b> (from +11.5–12.5%), <b>adjusted</b> EPS <b>$6.45–6.55</b> (from $6.00–6.10) and <b>adjusted</b> EBITDA <b>$1,357–1,369M</b> (from $1,290–1,300M). Of the raise, ~$0.15 of EPS and ~$30M of EBITDA is the expected net tariff refund; the sales raise carries none.',
    who:'Q2 2026 release, Aug 5 2026' },
  { per:'FY2026E', kind:'direction', what:'Profitability shape: adjusted EBITDA is reaffirmed to grow <b>faster than net sales</b> for the full year, with the expansion coming from operating-expense leverage rather than gross margin — "leverage on adjusted operating expense as a percentage of net sales for <b>five quarters in a row</b>".',
    who:'Q2 2026 call' },
  { per:'FY2027E', kind:'none', what:'<b>No company guidance.</b> What exists is the growth algorithm, repeated at the 2Q26 print and again in September: a core base growing <b>mid-to-high single digits</b>, plus international, plus new categories, "translates into a growth algorithm in <b>mid to high teens</b>" — against consensus at +13.3%. And a margin stance: an "adaptable P&amp;L that can <b>absorb challenges on the gross margin line while driving material OpEx leverage</b>".',
    who:'Goldman Sachs conf. Sep 15 2026 · Q2 2026 call · Q1 2026 call' },
  { per:'FY2027E', kind:'direction', what:'The one pricing signal that reaches 2027: "I expect us to look at taking a little bit of price... <b>small price increases</b> as we get towards the end of the year, maybe 2027" — the first since 2025, after a year with none.',
    who:'Goldman Sachs conf. Sep 15 2026' },
  { per:'FY2028E', kind:'none', what:'<b>Nothing period-specific.</b> Only the structural claims that would have to hold: the same mid-to-high-teens algorithm, two new sub-categories and ~25 new products a year (20 of them into existing categories), and the observation that only ~<b>20%</b> of the last three years\' growth came from products launched within two years — the base does the work.',
    who:'Q2 2026 call · Canaccord conf. Aug 2026' },
];

function anchorTable(){
  var tag = { number:'<span class="ov-tag" style="background:rgba(27,175,122,.14);color:#0F7A55">company number</span>',
              direction:'<span class="ov-tag">direction only</span>',
              none:'<span class="ov-tag" style="background:rgba(227,73,72,.12);color:#B0322F">no guidance</span>' };
  var rows = ANCHORS.map(function(a){
    return '<tr><td class="ov-td-name">' + esc(a.per) + '</td><td>' + tag[a.kind] + '</td>' +
      '<td style="white-space:normal">' + a.what + '</td><td style="white-space:normal">' + esc(a.who) + '</td></tr>';
  }).join('');
  return '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr>' +
    '<th>Period</th><th>How hard</th><th>What management has given</th><th>Where it was said</th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="dd-note">SharkNinja guides the <b>fiscal year only</b> — it has never guided a quarter — so 3Q26 and 4Q26 can only be anchored by dated facts and direction, and FY2027–FY2028 by the algorithm. Every figure above is the company\'s own; the consensus table is the Street\'s. The full guidance walk, print by print, is under Management ▸ Track Record.</div>';
}

// ── 2 · Management's own split, and the record behind it ────────────────────────────────────────
var HERO = {
  text:'In 2026, we haven\'t raised prices. Our growth is coming predominantly from unit growth. A little bit of ASP growth from a mix perspective as we continue to grow our espresso business at $600, $700.',
  who:'Mark Barrocas, CEO — Goldman Sachs Global Consumer &amp; Retail Conference, Sep 15 2026',
  url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=4171240&documentType=transcript&eventId=743347&targetTime=1200.75',
};

// The shipments-vs-POS gap: the closest thing to a unit read, because POS is sell-through to the
// consumer while shipments are sell-in to the retailer. Management gives POS as a DIRECTION, never
// a number, so the column says exactly what was said.
var POS = [
  { q:'Q3 2025', ship:'—', pos:'Low double digits, "reaching mid-teens" in the last four weeks', mkt:'US market declined slightly, excluding SharkNinja',
    said:'Our own POS grew in the low double digits... with our POS reaching mid-teens growth as the market weakened further, again excluding SharkNinja.', who:'Barrocas',
    url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=3741618&documentType=transcript&eventId=372004&targetTime=274.32' },
  { q:'Q1 2026', ship:'US +10% · domestic net sales +8.4%', pos:'"Up more than that" — "even higher in the double digits"', mkt:'Circana: US market −low to −mid single digits across all four categories, ex-SharkNinja',
    said:'The industry was down low-to-mid single. Our U.S. business was up 10% on shipments. It was up more than that in POS.', who:'Barrocas',
    url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=3776135&documentType=transcript&eventId=555079&targetTime=2458.75' },
  { q:'Q2 2026', ship:'US +18% · domestic +15.5%', pos:'"Even higher than that"', mkt:'—',
    said:'Our shipments grew 18% in the United States. Our POS was even higher than that in the U.S.', who:'Barrocas',
    url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=3968466&documentType=transcript&eventId=661459&targetTime=2429.45' },
];

// The price-action record — what they did to list prices, and when. This is the other half of the
// identity: a year with no price increases makes reported growth ≈ units + mix.
var PRICE = [
  { d:'2025', what:'"Of the <b>80 or 90 price increases</b> that we\'ve taken across different products, some have stuck and have not had any demand impact" — and others were rolled back.',
    who:'Barrocas · Morgan Stanley conference, Dec 2025', kind:'up',
    url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=2428044&documentType=transcript&eventId=421557&targetTime=2263.68' },
  { d:'Q1 2025', what:'Ninja SLUSHi went from <b>$280</b> at launch to about <b>$300</b> — "that was unrelated to tariffs".',
    who:'Quigley · Morgan Stanley conference, Dec 2025', kind:'up',
    url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=2428044&documentType=transcript&eventId=421557&targetTime=956.7' },
  { d:'FY2026 guide', what:'"There\'s <b>nothing at this point planned from a price increase standpoint</b>, in our guide through the end of the year."',
    who:'Barrocas · Q1 2026 call', kind:'flat',
    url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=3776135&documentType=transcript&eventId=555079&targetTime=2956.56' },
  { d:'Late 2026 / 2027', what:'"I expect us to look at taking a little bit of price... <b>small price increases</b> as we get towards the end of the year, maybe 2027."',
    who:'Barrocas · Goldman Sachs conference, Sep 2026', kind:'up',
    url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=4171240&documentType=transcript&eventId=743347&targetTime=1249.64' },
];

// Where price DOES move: into the launch. Each row is a product whose price point management named.
var LADDER = [
  { p:'$129', n:'Ninja BlendBoss (single-serve blenders)', note:'The category was a "$69, $79" business; after the launch "a category now that\'s up 30%, and our average sale price on that product is $129" — "getting $40 and $50 more for these products".',
    who:'Barrocas · William Blair, Jun 2026', url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=3461649&documentType=transcript&eventId=676035&targetTime=822.6' },
  { p:'ASP up', n:'Shark PowerDetect Transformer (upright vacuums)', note:'"It raised average sale price. In a market declining 1%, our business is growing 5%."',
    who:'Barrocas · Goldman Sachs, Sep 2026', url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=4171240&documentType=transcript&eventId=743347&targetTime=102.84' },
  { p:'$949', n:'Ninja AutoBarista (automatic coffee)', note:'"Launched at $949 and was off to a great start" — the espresso push is the named source of the ASP-mix benefit ($600–$700 price points).',
    who:'Barrocas · Q2 2026 call', url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=3968466&documentType=transcript&eventId=661459&targetTime=3389.1' },
  { p:'$149', n:'Shark ChillPill', note:'"We think that\'s kind of the upper range of what we tested at" — price discovery happens at launch, not through increases.',
    who:'Barrocas · Q1 2026 call', url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=3776135&documentType=transcript&eventId=555079&targetTime=2990.98' },
  { p:'$129', n:'Vacuums — the opening price point', note:'"There\'s a big business that\'s $79 for vacuums. We don\'t participate in that. Our opening price point is $129."',
    who:'Barrocas · ICR, Jan 2026', url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=2584653&documentType=transcript&eventId=537681&targetTime=636.06' },
  { p:'$59–$999', n:'The ladder itself', note:'"We\'re selling $59, $79, $99 products to the Walmart consumer, and we\'re selling thousand-dollar grills at The Home Depot or Sephora." The elasticity is at the price point, not the product: "if you have a $99 blender at Walmart, that consumer is not looking for the $114 blender."',
    who:'Barrocas · Goldman Sachs Sep 2026 and Morgan Stanley Dec 2025', url:'https://web.quartr.com/companies/15145?companyId=15145&documentId=4171240&documentType=transcript&eventId=743347&targetTime=394.15' },
];

// What is not disclosed — loud, because a reader who does not see it will assume we failed to find it.
var NOT_DISCLOSED = [
  'Unit volumes, at any level — company, category, brand or product.',
  'A company-level average selling price, or a price/volume/mix percentage split.',
  'The direct-to-consumer share of net sales: "We don\'t break out the percentage of our D2C business." (Q2 2026 call)',
  'The TikTok Shop / social-commerce share: "not something we\'re going to talk about until we get a full year under our belt." (Goldman, Sep 2026)',
  'Household penetration, attach rates and replacement-cycle length — never given in any of the nine events read.',
];

function posTable(){
  var rows = POS.map(function(r){
    return '<tr><td class="ov-td-name">' + esc(r.q) + '</td><td>' + esc(r.ship) + '</td><td style="white-space:normal">' + esc(r.pos) + '</td>' +
      '<td style="white-space:normal">' + esc(r.mkt) + '</td>' +
      '<td style="white-space:normal"><i>"' + esc(r.said) + '"</i><br><span class="ov-stat-mut">' + esc(r.who) +
      '</span> <a href="' + esc(r.url) + '" target="_blank" rel="noopener">↗</a></td></tr>';
  }).join('');
  return '<div class="ov-table-wrap" style="overflow-x:auto"><table class="ov-table"><thead><tr>' +
    '<th>Period</th><th>Shipments (sell-in)</th><th>POS (sell-through)</th><th>The market</th><th>What was said</th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="dd-note">POS is always given as a <b>direction</b>, never a number, so the column quotes the words. Shipments are the reported figure. POS running above shipments is the evidence that growth is consumer demand rather than channel fill — and the one reversal of it is named: Q1 2026 food preparation fell 3.3% "driven largely by lapping a very large sell-in period for SLUSHi in Q1 2025".</div>';
}

function priceTimeline(){
  return '<div class="snv-tl">' + PRICE.map(function(p){
    var col = p.kind === 'up' ? SUMMIT_CAT[1] : SUMMIT_MUTE;
    return '<div class="snv-tl-row"><div class="snv-tl-yr" style="font-size:12.5px">' + esc(p.d) + '</div>' +
      '<div class="snv-tl-items"><div class="snv-tl-item" style="border-left-color:' + col + ';max-width:none">' +
      '<div class="snv-tl-txt">' + p.what + '</div><span>' + esc(p.who) +
      ' <a href="' + esc(p.url) + '" target="_blank" rel="noopener">↗</a></span></div></div></div>';
  }).join('') + '</div>';
}

function ladderCards(){
  return '<div class="snv-cards" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">' + LADDER.map(function(l){
    return '<div class="snv-card" style="border-top:4px solid ' + SUMMIT_CAT[1] + '">' +
      '<div class="snv-card-top"><span class="snv-card-yr" style="font-size:16px">' + esc(l.p) + '</span></div>' +
      '<div class="snv-card-t">' + esc(l.n) + '</div>' +
      '<div class="snv-card-d">' + l.note + '</div>' +
      '<div class="snv-card-m">' + esc(l.who) + ' <a href="' + esc(l.url) + '" target="_blank" rel="noopener">↗</a></div></div>';
  }).join('') + '</div>';
}

export function snGrowthBody(){
  var q = contribView('q', 4), y = contribView('y', 1);
  var lastQ = q.total.length - 1, lastY = y.total.length - 1;
  return '<div class="snv">' +
    tiles([
      { v: pp(q.total[lastQ]), l:'Net-sales growth ' + esc(q.labels[lastQ]), s:'reported, year on year' },
      { v: pp(y.total[lastY]), l:'Net-sales growth FY' + esc(y.labels[lastY]), s:'reported, year on year' },
      { v:'0', l:'Price increases in the FY2026 guide', s:'after 80–90 of them in 2025' },
      { v:'1.5%', l:'Industry growth a year since 2008', s:'management\'s own framing — the growth is share' },
    ], 4) +

    '<div class="dd-callout" style="margin-top:2px"><b>The short answer.</b> SharkNinja publishes <b>no unit volumes and no average selling price</b> — not at company, category, brand or product level — so a price-versus-volume bridge cannot be built from disclosure. What exists is (1) a dollar decomposition by category, which is arithmetic on reported figures, (2) management\'s own verbal split, which is decisive on direction but unquantified, and (3) proxies: the shipments-versus-POS gap, the market\'s own decline, and the price ladder. All three are below, each labelled for what it is.</div>' +

    head('Management\'s own split — in their words, not in numbers') +
    '<blockquote class="snv-gm-q" style="font-size:13.5px">“' + HERO.text + '”<cite>' + HERO.who +
      ' · <a href="' + esc(HERO.url) + '" target="_blank" rel="noopener">transcript ↗</a></cite></blockquote>' +
    '<div class="dd-note">⚠ This is the single clearest statement in the record, and it comes from a <b>conference fireside, not an earnings call</b> — conference remarks sit outside the filings and were not published alongside a release. Read with that weight. The growth algorithm it belongs to, given at the same event and on the Q2 2026 call: a core base growing <b>mid-to-high single digits</b>, plus international, plus new categories, "translates into a growth algorithm in mid to high teens".</div>' +
    fold('The data hole worth knowing about',
      'On the <b>Q4 2025 call</b> Brooke Roach of Goldman Sachs asked it outright — "what contribution do you expect from units versus price?" — and Barrocas began to answer, but the call\'s audio failed and the transcript renders the reply unintelligible; the operator apologised for technical difficulties two paragraphs later and the split was never restated. So the only direct answer management has given to this exact question is lost. That is part of the answer here, not a gap in the research.') +

    // The category contribution-to-growth chart was REMOVED at SAB's request (Sep 17 2026): the same
    // dollar cut is already engine-driven in Top Line ▸ Segments ▸ Other, and this pane is about the
    // units/price question, which dollars cannot answer. contribView/contribChart are kept below —
    // unused — because putting the section back is one line.

    head('What the Street expects — growth and margins', null,
      'Bloomberg consensus for the next two quarters and the next two fiscal years, with the year-on-year change under each line.') +
    consTable() +

    head('The margin ladder — and where the leverage is meant to come from', null,
      'The same five columns, every line as a percent of net sales, with the year-on-year change in basis points.') +
    marginTable() +

    head('And what management has said to anchor it', null,
      'Per period: a company number, a direction, or nothing at all — labelled, so an estimate is never read as a guide.') +
    anchorTable() +

    head('The best proxy for units: shipments versus POS') + posTable() +

    head('The price record — what they did to list prices, and when', null,
      'A year with no list-price increases is what makes reported 2026 growth ≈ units plus mix. This is that record.') +
    priceTimeline() +

    head('Where price actually moves: into the launch', null,
      'Management\'s stated model is to price at launch and hold, rather than raise on the installed range — so the ASP evidence is per product, and it is the only quantified price data that exists.') +
    ladderCards() +
    // Removed at SAB's request (Sep 17 2026): the "Not disclosed — and asked for" box (NOT_DISCLOSED,
    // kept below, unused) and this pane's own sources paragraph. The Deep Dive footer still carries the
    // profile's sourcing, and the callout at the top of this pane still says the unit/ASP data does not exist.
  '</div>';
}

export function snGrowthInit(pane){
  if (!pane) return;
  snvInit(pane);
}
