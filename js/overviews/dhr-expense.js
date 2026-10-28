// dhr-expense.js — Danaher, Deep Dive ▸ Bottom Line ▸ General: the KPI strip and the expense
// explorer that sit under the charts.
//
// This is the layer Danaher's Bottom Line was missing next to Amazon's. The charts were already
// there — more of them, in fact — but Amazon carries 31 KPI tiles, a six-line expense explorer
// with a panel each, sparklines and filing quotes, and Danaher carried none of it. Same shape
// here, adapted to a P&L that is built differently.
//
// ── WHY FOUR LINES AND NOT SIX ────────────────────────────────────────────────────────────────
// Amazon splits opex six ways because it discloses six. Danaher's income statement has exactly
// three expense lines — cost of sales, SG&A, R&D — and inventing a fourth split it does not
// publish would be fabrication. The fourth panel here is not an invented split: it is
// **amortisation of acquisition-related intangibles**, which is real, is ~$1.9B a year, and is
// the single most consequential number in Danaher's P&L. It does NOT get its own income-statement
// line — it runs *through* cost of sales and SG&A — so it is the one thing a reader cannot find
// by looking at the statement, and the entire GAAP-to-adjusted gap is it.
//
// ── DEFINITIONS: SEVERAL QUOTES PER LINE, NOT ONE ─────────────────────────────────────────────
// Danaher does not define most of its expense lines as a whole. It publishes scattered policy
// sentences that each say "this falls in that line". One borrowed quote standing in for a
// definition is worse than three real ones plus a note saying no single definition exists —
// which is what `defNote` is for. Saying "the company never defines this" is information.
//
// ── THE DATA COMES IN, IT IS NOT REDECLARED ───────────────────────────────────────────────────
// `dhrExpenseHtml(A)` takes the annual array from dhr-bottomline.js rather than importing it,
// which would make a cycle (bottom line imports this module). One home for the numbers.

var BRAND = '#0F7DC2', BRAND2 = '#1E3A5F', GREEN = '#2E8B57', AMBER = '#B7791F', GRAY = '#9AA4B0';
function esc(s){ if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fP(v, d){ return v == null ? '—' : v.toFixed(d == null ? 1 : d) + '%'; }

// ─── Inline SVG sparkline. No Chart.js: these are seven points inside a heading, not a chart, and
// a canvas per line would cost four more chart instances for something a path renders exactly. It
// carries its value at both ends so it is never a shape without numbers.
function spark(pts, labels, color, fmt){
  var vals = pts.filter(function(v){ return v != null; });
  if (vals.length < 2) return '';
  var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), rng = (hi - lo) || 1;
  var W = 300, H = 40, n = pts.length;
  var x = function(i){ return (i / (n - 1)) * (W - 4) + 2; };
  var y = function(v){ return H - 4 - ((v - lo) / rng) * (H - 10); };
  var d = '', dots = '';
  pts.forEach(function(v, i){
    if (v == null) return;
    d += (d ? ' L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1);
    if (i === 0 || i === n - 1) dots += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="2.6" fill="' + color + '"/>';
  });
  var f = fmt || function(v){ return fP(v); };
  return '<div class="ew-spark">' +
    '<span class="ew-spark-e">' + esc(labels[0]) + ' <b>' + f(pts[0]) + '</b></span>' +
    '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="share of revenue over time">' +
      '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' + dots +
    '</svg>' +
    '<span class="ew-spark-e">' + esc(labels[n - 1]) + ' <b>' + f(pts[n - 1]) + '</b></span>' +
  '</div>';
}

// ═══ The four lines ═══════════════════════════════════════════════════════════════════════════
// `pick(a)` returns the %-of-revenue series for the sparkline; `kpis` are FY2025 unless said.
var LINES = [
  {
    k:'cogs', n:'Cost of sales', c:BRAND2, tag:'$10,045M · 40.9%',
    pick:function(a){ return a.rev ? a.cogs / a.rev * 100 : null; },
    kpis:[['$10,045M','Cost of sales, FY2025'],['59.1%','Gross margin'],['58.7–60.8%','Four-year range'],['+3.9%','Year on year']],
    defNote:'Danaher publishes <b>no single definition</b> of cost of sales. It publishes three policies which, together, decide what falls inside:',
    defs:[
      { x:'<b>Inventories</b> — Inventories include the costs of <b>material, labor and overhead</b>.', src:'10-K FY2025, accounting policies' },
      { x:'<b>Shipping and Handling</b> — Shipping and handling costs are included <b>as a component of cost of sales</b>. Revenue derived from shipping and handling costs billed to customers is included in sales.', src:'10-K FY2025, accounting policies' },
      { x:'…reflects cost of sales, SG&A expenses and R&D expenses, <b>excluding depreciation, amortization of intangible assets and impairments</b>. Included within these categories of expenses are overhead expenses, stock compensation expense, restructuring charges and allocated corporate expenses.', src:'10-K FY2025, segment note — about segment profit, not about this line' }
    ],
    comp:[
      ['Materials and direct labour','The bulk of it. Bioprocessing consumables, diagnostic reagents, instruments.'],
      ['Manufacturing overhead','Named explicitly by the segment note, alongside stock compensation and restructuring charges.'],
      ['Shipping and handling','What is billed to the customer goes to sales; the cost lands here.'],
      ['Intangible amortisation','Part of it runs through this line — see the fourth panel. It cannot be separated from the income statement.']
    ],
    why:'This is the line that sets gross margin, and Danaher\'s gross margin is remarkably steady: <b>58.7% to 60.8% across four years</b>, through a 10% revenue decline in 2023 and the recovery out of it. That is mix, not price — recurring consumables hold the margin up when instruments fall.',
    drivers:[
      ['Consumables vs equipment mix','Consumables carry the higher margin. Equipment fell in 2023–2024 and gross margin <i>rose</i>.'],
      ['FX','Danaher sells ~60% outside the US. The revenue impact is guided separately (~+0.5% for FY26).'],
      ['Tariffs','The 2025 tariff cost was <b>&lt;$300M</b>. From 3Q26 the refunds come out of core sales.'],
      ['Price','Danaher publishes no price/volume bridge. Do not invent one.']
    ]
  },
  {
    k:'sga', n:'SG&A', c:BRAND, tag:'$8,235M · 33.5%',
    pick:function(a){ return a.rev ? a.sga / a.rev * 100 : null; },
    kpis:[['$8,235M','SG&A, FY2025'],['33.5%','Of revenue'],['$562M','Total FY2025 impairments'],['$432M','…of which, the trade name']],
    defNote:'⚠ <b>Danaher never defines SG&A as a line.</b> What it publishes are scattered sentences saying “this lands in SG&A” — and they turn out to be exactly the ones that explain why the line grew. The impairments are inside it, in the filing\'s own words:',
    defs:[
      { x:'…the Company recorded a noncash impairment charge of <b>$432 million pretax</b> ($328 million after-tax) for the year ended December 31, 2025 related to a trade name <b>which is included in SG&A expenses</b> in the Consolidated Statement of Earnings.', src:'10-K FY2025, intangibles note — the FY2025 charge' },
      { x:'…a noncash impairment charge of <b>$222 million pretax</b> ($169 million after-tax) related to the trade name for the year ended December 31, 2024, <b>which is included in SG&A expenses</b>…', src:'10-K FY2025 — the same charge, a year earlier' },
      { x:'…the Company terminated three contracts with distributors and incurred <b>$56 million of costs</b> related to the termination of the arrangements, <b>which are recorded within SG&A expenses</b>…', src:'10-K FY2025' },
      { x:'Earnings attributable to noncontrolling interests have been reflected in <b>selling, general and administrative (“SG&A”) expenses</b> and were insignificant in all periods presented.', src:'10-K FY2025, basis of presentation' },
      { x:'<b>Advertising</b> — Advertising costs are expensed as incurred.', src:'10-K FY2025, accounting policies' }
    ],
    comp:[
      ['Sales force and marketing','The commercial cost of selling instruments and consumables across three segments.'],
      ['Intangible amortisation','Most of the ~$1.7B runs through here. It is the main reason SG&A rises while revenue does not.'],
      ['<b>Impairments</b>','$265M in FY2024 and <b>$562M in FY2025</b> — almost all in Life Sciences, and all inside this line.'],
      ['M&A transaction costs','The Masimo charges land here and in Diagnostics.']
    ],
    compNote:'<b>On the two impairment figures:</b> the <b>$562M</b> is the company total for FY2025; the <b>$432M</b> the filing quotes above is the <i>trade name</i> charge, the largest piece of that total, and it sits in Life Sciences. They do not contradict each other — one contains the other.<br><br>⚠ <b>This is the line that makes the operating-margin trend mislead.</b> Reported margin fell from 21.8% (FY23) to 19.1% (FY25). Add the impairments back and the clean margin goes from ~21.8% to <b>~21.4%</b> — essentially flat. The 270bp fall is almost all impairments, not operating deterioration.',
    why:'SG&A grew <b>+15.6% between FY2022 and FY2025</b> while revenue fell 7.8%. Almost none of that is commercial spend: it is acquisition amortisation and impairments. Reading this line as commercial inefficiency is the easiest mistake to make with Danaher.',
    drivers:[
      ['Impairments','FY2024 $265M, FY2025 $562M. Concentrated in Life Sciences. Non-recurring, but they have now recurred two years running.'],
      ['Rising amortisation','Every large acquisition steps it up. Masimo adds ~$200M in 2026.'],
      ['Negative operating leverage','With flat revenue, an expense that grows compresses the margin even when nothing is getting worse.']
    ]
  },
  {
    k:'rnd', n:'R&D', c:GREEN, tag:'$1,598M · 6.5%',
    pick:function(a){ return a.rev ? a.rnd / a.rev * 100 : null; },
    kpis:[['$1,598M','R&D, FY2025'],['6.5%','Of revenue'],['6.3–6.6%','Four-year range'],['+0.9%','Year on year']],
    defNote:'The one line of the three Danaher <b>does define head-on</b>:',
    defs:[
      { x:'<b>Research and Development</b> — The Company conducts research and development (“R&D”) activities for the purpose of developing new products, enhancing the functionality, effectiveness, ease of use and reliability of the Company’s existing products and expanding the applications for which uses of the Company’s products are appropriate. The Company’s R&D efforts include internal initiatives and those that use <b>licensed or acquired technology</b>. <b>R&D costs are expensed as incurred.</b>', src:'10-K FY2025, accounting policies' }
    ],
    comp:[
      ['Internal development','The bulk of it, across all three segments.'],
      ['Licensed or acquired technology','Named explicitly by the 10-K as part of the R&D effort.'],
      ['Nothing is capitalised','“Expensed as incurred” — there is no development asset to amortise later.']
    ],
    why:'It is the <b>steadiest line in the whole income statement</b>: 6.3% to 6.6% of revenue across four years, regardless of the cycle. Danaher does not cut R&D in the downturn, which is the sign that the Danaher Business System is actually applied to discretionary spend.',
    drivers:[
      ['Launches','Biacore 8S, SCIEX novus V55 and Beckman automation systems were named as Life Sciences drivers in 2Q26.'],
      ['No capitalisation','There is no accounting lever here. What is spent is spent.']
    ]
  },
  {
    k:'amort', n:'Intangible amortisation', c:AMBER, tag:'$1,697M · 6.9%',
    pick:function(a){ return a.rev ? a.amort / a.rev * 100 : null; },
    kpis:[['$1,697M','Amortisation, FY2025'],['6.9%','Of revenue'],['~$1,900M','FY2026 guide (post-Masimo)'],['$2.77','Per share, FY2025']],
    defNote:'Not an income-statement line, so it has no accounting policy of its own. What does exist is the reason Danaher excludes it from adjusted earnings, and the confirmation that it runs inside the other lines:',
    defs:[
      { x:'<b>Amortization of Intangible Assets:</b> We exclude the amortization of acquisition-related intangible assets because <b>the amount and timing of such charges are significantly impacted by the timing and size of the Company’s acquisitions</b>.', src:'8-K 2Q26, non-GAAP definition' },
      { x:'…reflects cost of sales, SG&A expenses and R&D expenses, <b>excluding depreciation, amortization of intangible assets and impairments</b>.', src:'10-K FY2025, segment note — which is why segment profit does not carry it and the consolidated figure does' }
    ],
    comp:[
      ['It has no line of its own','It runs <b>inside</b> cost of sales and SG&A. It cannot be read off the income statement — only from the cash flow statement and the notes.'],
      ['It is the entire GAAP → adjusted bridge','FY2025: GAAP EPS $5.03 against adjusted $7.80. The $2.77 gap is essentially this line.'],
      ['It is cash already spent','The money left when the business was bought. That is why Danaher excludes it — and why free cash flow beats net earnings every year.']
    ],
    compNote:'⚠ <b>Use the 8-K guide, not the 10-K table.</b> Note 10 of the FY2025 10-K is <b>pre-Masimo</b> and projects ~$1.7B for 2026. The 21-Jul-2026 8-K, with Masimo closed, says <b>~$1,900M</b> for FY2026 and ~$500M for 3Q26. The difference is Masimo: ~$200M in 2026 from 10 June, implying an annual run-rate of ~$300–360M.',
    why:'It is the most consequential number in Danaher\'s P&L and the reason the market reads the adjusted figures. It is also the one that <b>will change</b>: the Masimo purchase-price-allocation measurement period runs to June 2027 and the company says explicitly that the allocation will move, and the amortisation with it.',
    drivers:[
      ['Masimo','+$200M in 2026 on $4,844M of acquired intangibles. Implied blended life of 13–17 years.'],
      ['StatLab','Not in any filing yet. Closes before the end of 2026.'],
      ['The step does not come back down on its own','At run-rate (2027, full Masimo): ~$1.6B of base + ~$330M ≈ <b>$1.9–2.0B</b>.']
    ],
    calls:[
      { s:'Matt Gugino', w:'1Q26', x:'Post-close of Masimo we will be around 2.5 times net debt to EBITDA.' },
      { s:'Rainer Blair', w:'1Q26', x:'We expect Masimo to be accretive to adjusted diluted net earnings per common share in the first full year post-acquisition and to deliver a high-single-digit return on invested capital by the fifth full year of our ownership.' }
    ]
  }
];

// ═══ KPI strip ════════════════════════════════════════════════════════════════════════════════
var STRIP = [
  { v:'59.1%',   l:'Gross margin FY2025',             n:'Steady in a 58.7–60.8% band for four years.' },
  { v:'19.1%',   l:'Reported operating margin',       n:'', warn:true },
  { v:'~21.4%',  l:'Operating margin ex-impairments', n:'The difference is $562M that is not operating.', good:true },
  { v:'28.2%',   l:'Adjusted operating margin',       n:'The one the company guides and discusses.' },
  { v:'$1,697M', l:'Acquisition amortisation',        n:'6.9% of revenue. The whole GAAP→adjusted bridge.' },
  { v:'$298M',   l:'Stock-based compensation',        n:'1.2% of revenue — an order of magnitude below the amortisation.' },
  { v:'$5,260M', l:'Free cash flow FY2025',           n:'21.4% of revenue.' },
  { v:'34',      l:'Straight years of FCF > net earnings', n:'', good:true }
];

// ═══ Style ════════════════════════════════════════════════════════════════════════════════════
var EXP_CSS = '<style>' + [
  '.dxp .ew-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:9px;margin:0 0 18px}',
  '.dxp .ew-tile{border:1px solid var(--bdr);border-radius:11px;padding:11px 13px;background:var(--w)}',
  '.dxp .ew-tile.good{border-color:rgba(46,139,87,.34);background:linear-gradient(180deg,rgba(46,139,87,.05),transparent)}',
  '.dxp .ew-tile.warn{border-color:rgba(183,121,31,.34);background:linear-gradient(180deg,rgba(183,121,31,.05),transparent)}',
  '.dxp .ew-tv{font-size:20px;font-weight:800;color:var(--navy);letter-spacing:-.01em;line-height:1.15}',
  '.dxp .ew-tl{font-size:9.5px;font-weight:800;letter-spacing:.045em;text-transform:uppercase;color:var(--mu);margin-top:5px;line-height:1.4}',
  '.dxp .ew-tn{font-size:10.5px;color:var(--mu);margin-top:5px;line-height:1.5}',
  '.dxp .exp-explorer{border:1.5px solid ' + BRAND + ';border-radius:14px;padding:14px 16px 16px;background:linear-gradient(180deg,rgba(15,125,194,.05),transparent);margin:6px 0}',
  '.dxp .exp-explorer-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:' + BRAND2 + ';margin:0 0 11px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
  '.dxp .exp-hint{font-size:9px;font-weight:700;text-transform:none;letter-spacing:0;color:var(--mu);background:#fff;border:1px solid var(--bdr);border-radius:20px;padding:2px 9px}',
  '.dxp .exp-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}',
  '.dxp .exp-tab{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--bdr);background:#fff;border-radius:20px;padding:7px 12px;cursor:pointer;font:inherit;font-size:12px;font-weight:800;color:var(--navy);transition:.13s}',
  '.dxp .exp-tab:hover{border-color:' + BRAND + '}',
  '.dxp .exp-tab.active{background:' + BRAND2 + ';border-color:' + BRAND2 + ';color:#fff}',
  '.dxp .exp-tab.active .exp-tag{color:rgba(255,255,255,.82)}',
  '.dxp .exp-dot{width:10px;height:10px;border-radius:3px;flex:none}',
  '.dxp .exp-tag{font-size:10px;font-weight:800;color:var(--mu)}',
  '.dxp .exp-panel{background:#fff;border:1px solid var(--bdr);border-radius:12px;padding:15px 17px}',
  '.dxp .exp-panel[hidden]{display:none}',
  '.dxp .ew-h{font-size:9.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);margin:16px 0 8px;display:flex;align-items:center;gap:8px}',
  '.dxp .ew-h::after{content:"";flex:1;height:1px;background:var(--bdr)}',
  '.dxp .ew-h:first-child{margin-top:0}',
  '.dxp .ew-defnote{font-size:11.5px;color:var(--mu);line-height:1.6;margin:0 0 10px}',
  '.dxp .ew-defnote b{color:var(--navy)}',
  '.dxp .ew-q + .ew-q{margin-top:9px}',
  '.dxp .ew-q{font-size:11.5px;line-height:1.65;color:var(--navy);font-style:italic;border-left:3px solid ' + BRAND + ';padding:0 0 0 12px;margin:0}',
  '.dxp .ew-att{display:block;font-style:normal;font-size:9.5px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:var(--mu);margin-top:5px}',
  '.dxp .ew-boxes{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px}',
  '.dxp .ew-box{border:1px solid var(--bdr);border-radius:9px;padding:9px 11px;background:#FCFDFE}',
  '.dxp .ew-box-k{font-size:11px;font-weight:800;color:var(--navy);margin-bottom:4px}',
  '.dxp .ew-box-x{font-size:10.5px;color:var(--mu);line-height:1.55}',
  '.dxp .ew-note{font-size:11.5px;color:var(--mu);line-height:1.65}',
  '.dxp .ew-note b{color:var(--navy)}',
  '.dxp .ew-warn{font-size:11.5px;line-height:1.65;color:var(--navy);background:rgba(183,121,31,.07);border:1px solid rgba(183,121,31,.28);border-radius:9px;padding:10px 12px;margin-top:9px}',
  '.dxp .ew-spark{display:flex;align-items:center;gap:11px}',
  '.dxp .ew-spark svg{flex:1;height:40px;min-width:120px}',
  '.dxp .ew-spark-e{font-size:9.5px;font-weight:700;color:var(--mu);white-space:nowrap}',
  '.dxp .ew-spark-e b{color:var(--navy);font-size:11px}',
  '.dxp .ew-foot{font-size:10px;color:' + GRAY + ';line-height:1.55;margin-top:15px;padding-top:10px;border-top:1px solid var(--bdr)}',
  '.dxp blockquote{margin:9px 0 0;padding:0 0 0 12px;border-left:3px solid ' + GRAY + ';font-size:11.5px;line-height:1.6;color:var(--navy);font-style:italic}',
  '.dxp blockquote cite{display:block;font-style:normal;font-size:9.5px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:var(--mu);margin-top:4px}'
].join('') + '</style>';

function boxes(list){
  return '<div class="ew-boxes">' + list.map(function(b){
    return '<div class="ew-box"><div class="ew-box-k">' + b[0] + '</div><div class="ew-box-x">' + b[1] + '</div></div>';
  }).join('') + '</div>';
}

function panel(line, A){
  var years = A.filter(function(a){ return a.y >= 2019; });
  var pts = years.map(line.pick), labs = years.map(function(a){ return 'FY' + String(a.y).slice(2); });
  var h = '<div class="ew-strip">' + line.kpis.map(function(k){
    return '<div class="ew-tile"><div class="ew-tv">' + esc(k[0]) + '</div><div class="ew-tl">' + esc(k[1]) + '</div></div>';
  }).join('') + '</div>';
  if (line.defs && line.defs.length){
    h += '<div class="ew-h">How the filing defines it</div>';
    if (line.defNote) h += '<div class="ew-defnote">' + line.defNote + '</div>';
    h += line.defs.map(function(d){
      return '<p class="ew-q">“' + d.x + '”<span class="ew-att">' + esc(d.src) + '</span></p>';
    }).join('');
  }
  h += '<div class="ew-h">What sits inside this line</div>' + boxes(line.comp);
  if (line.compNote) h += '<div class="ew-warn">' + line.compNote + '</div>';
  h += '<div class="ew-h">Share of revenue over time</div>' + spark(pts, labs, line.c);
  h += '<div class="ew-h">Why it matters to the bottom line</div><div class="ew-note">' + line.why + '</div>';
  if (line.drivers){ h += '<div class="ew-h">What moves it</div>' + boxes(line.drivers); }
  if (line.calls){
    h += '<div class="ew-h">What management said</div>' + line.calls.map(function(q){
      return '<blockquote>“' + esc(q.x) + '”<cite>' + esc(q.s) + ' · ' + esc(q.w) + '</cite></blockquote>';
    }).join('');
  }
  h += '<div class="ew-foot">FY2025 figures unless noted. Sources: 10-K FY2025 (MD&A and notes) and the 1Q26 / 2Q26 8-Ks, via SEC EDGAR CIK 0000313616; management commentary from the earnings calls.</div>';
  return h;
}

export function dhrExpenseHtml(A){
  if (!A || !A.length) return '';                      // rule 6 — nothing, never broken
  return EXP_CSS + '<div class="dxp">' +
    '<div class="ew-strip">' + STRIP.map(function(t){
      return '<div class="ew-tile' + (t.good ? ' good' : t.warn ? ' warn' : '') + '">' +
        '<div class="ew-tv">' + esc(t.v) + '</div><div class="ew-tl">' + esc(t.l) + '</div>' +
        (t.n ? '<div class="ew-tn">' + t.n + '</div>' : '') + '</div>';
    }).join('') + '</div>' +
    '<div class="exp-explorer"><div class="exp-explorer-h">Expense explorer — the three lines Danaher publishes, plus the one it does not <span class="exp-hint">tap a line to switch</span></div>' +
    '<div class="exp-tabs">' + LINES.map(function(l, i){
      return '<button type="button" class="exp-tab' + (i === 0 ? ' active' : '') + '" data-dxptab="' + l.k + '">' +
        '<span class="exp-dot" style="background:' + l.c + '"></span>' + esc(l.n) + ' <span class="exp-tag">' + esc(l.tag) + '</span></button>';
    }).join('') + '</div>' +
    '<div class="exp-panels">' + LINES.map(function(l, i){
      return '<div class="exp-panel" data-dxppanel="' + l.k + '"' + (i > 0 ? ' hidden' : '') + '>' + panel(l, A) + '</div>';
    }).join('') + '</div></div></div>';
}

export function dhrExpenseInit(root){
  var host = root && root.querySelector ? root.querySelector('.dxp') : null;
  if (!host || host._dxpWired) return;
  host._dxpWired = true;
  host.addEventListener('click', function(e){
    var b = e.target.closest ? e.target.closest('[data-dxptab]') : null;
    if (!b || !host.contains(b)) return;
    var k = b.getAttribute('data-dxptab');
    host.querySelectorAll('[data-dxptab]').forEach(function(x){ x.classList.toggle('active', x === b); });
    host.querySelectorAll('[data-dxppanel]').forEach(function(p){ p.hidden = (p.getAttribute('data-dxppanel') !== k); });
  });
}
