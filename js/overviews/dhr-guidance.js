// dhr-guidance.js — Danaher, Deep Dive ▸ Evolution ▸ Guidance.
//
// What the company itself has put in writing, what has already happened that changes the model,
// and what is still coming. It is the sub-tab the DCF is built against, which is why it exists
// beside Call Prep rather than inside it: Call Prep is about one print, this is about the year.
//
// ── SOURCE HIERARCHY, and it is not negotiable ────────────────────────────────────────────────
// The **8-K earnings release governs**. Danaher publishes a formal forward-looking driver table in
// every release — amortisation, net interest, tax rate, share count, FX, corporate expense, core
// growth by segment — and it **never reads that table out on the call**. The call supplies colour
// and the why; the 10-Q supplies the accounting. Where the call and the 8-K disagree, the 8-K wins.
// Every number in the two tables below was read out of the release text in
// `danaher-research/sec/8k/`, not from a transcript and not from coverage.
//
// The quotes are the opposite case: they exist only as speech, they are attributed to the person
// who said it, and they are never mixed into a filed series. That is the same rule the Call Prep
// scorecard follows with its "said on the call" marker.
//
// Full working notes, including the model implications: `danaher-research/GUIDANCE_Y_EVENTOS.md`
// (gitignored — it is research material, not portal content).

import { dStdScaffold, dStdRender, dWireTables, D_ACT, D_DOWN, D_UP } from './dhr-chartkit.js';

var BRAND = '#0F7DC2', GRAY = '#9AA4B0', AMBER = '#B7791F';
function esc(s){ if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ═══ 1 · The driver table — what moved between the two releases ════════════════════════════════
// `mv` is the direction the DRIVER moved, not whether it is good news: amortisation going up is
// ▲ even though it is a cost. The read column says what it means.
var DRIVERS = [
  { k:'FY26 core sales growth',        a:'+3.0% – +6.0%', b:'+3.0% – +4.0%', mv:'dn', why:'Ceiling cut by 200bp. It was not demand — it was respiratory plus the resin deferral.' },
  { k:'— Biotechnology',               a:'~+6.0%',        b:'+Mid-single digit', mv:'dn', why:'' },
  { k:'— Life Sciences',               a:'+Up slightly',  b:'+3.0% – +4.0%', mv:'up', why:'The largest change of direction in the portfolio.' },
  { k:'— Diagnostics',                 a:'+Low-single digit', b:'Flat',      mv:'dn', why:'Respiratory.' },
  { k:'FY26 adjusted diluted EPS',     a:'$8.35 – $8.55', b:'$8.45 – $8.60', mv:'up', why:'It went up while the revenue ceiling came down. That is mix, not volume.' },
  { k:'FY26 intangible amortisation',  a:'~$(1,700)M',    b:'~$(1,900)M',   mv:'up', why:'+$200M from Masimo.' },
  { k:'FY26 interest expense, net',    a:'~$(140)M',      b:'~$(310)M',     mv:'up', why:'+$170M. The 3Q26 guide of $(115)M implies a run-rate of ~$460M a year — that is the real cost of financing Masimo.' },
  { k:'FY26 average diluted shares',   a:'~714.0M',       b:'~709.0M',      mv:'dn', why:'−5M from buybacks.' },
  { k:'FY26 FX on sales',              a:'~+0.5%',        b:'~+0.5%',       mv:'eq', why:'' },
  { k:'FY26 corporate expense',        a:'~$(360)M',      b:'~$(360)M',     mv:'eq', why:'' },
  { k:'Effective tax rate',            a:'~17.0%',        b:'~17.0%',       mv:'eq', why:'' }
];

// ═══ 2 · The guide as it stands — the three columns of the 2Q26 release ════════════════════════
var GUIDE = {
  cols: ['3Q26', '4Q26', 'FY26'],
  rows: [
    { k:'Biotechnology — core',        v:['+Mid-single digit', '+Mid-single digit', '—'] },
    { k:'Life Sciences — core',        v:['+3.0% – +4.0%', '+3.0% – +4.0%', '—'] },
    { k:'Diagnostics — core',          v:['Flat', '+Up slightly', '—'] },
    { k:'Total core',                  v:['+2.0% – +3.0%', '+Mid-single digit', '+3.0% – +4.0%'], bold:true },
    { k:'Impact of respiratory',       v:['+2.5%', 'Flat', '+Low-single digit'] },
    { k:'Core ex-respiratory',         v:['~+5.0%', '+Mid-single digit', '+Mid-single digit'], bold:true },
    { k:'Adjusted operating margin',   v:['~26.5%', '—', '—'] },
    { k:'Adjusted diluted EPS',        v:['—', '—', '$8.45 – $8.60'], bold:true },
    { k:'Intangible amortisation',     v:['~$(500)M', '—', '~$(1,900)M'] },
    { k:'Interest expense, net',       v:['~$(115)M', '—', '~$(310)M'] },
    { k:'Corporate expense',           v:['~$(90)M', '—', '~$(360)M'] },
    { k:'Effective tax rate',          v:['~17.0%', '—', '~17.0%'] },
    { k:'Average diluted shares',      v:['~707M', '—', '~709M'] },
    { k:'FX on sales',                 v:['~(1.0)%', '—', '~+0.5%'] }
  ]
};

// ═══ 3 · Respiratory — the only line Danaher guides in DOLLARS ═════════════════════════════════
// Rounded by the company to the nearest $50M, which is why the quarters do not sum exactly to the
// year (its own footnote says so). The impact row is in POINTS of core growth, and a POSITIVE
// number is a HEADWIND — that is Danaher's sign convention, stated in the release, and it is the
// opposite of what a reader assumes, so the pane says it on screen.
var RESP = {
  labels: ['1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'],
  sales:  [650, 300, 500, 500, 500, 250, 325, 500],
  drag:   [1.0, 0.5, -0.5, 1.5, 2.5, 1.5, 2.5, 0.0],
  lastAct: 5                                    // 2Q26 — 3Q26 and 4Q26 are guided, not reported
};
// Reported core vs core ex-respiratory, from the same release. Forward cells stay null where the
// guide is a WORD ("mid-single digit") — turning a phrase into a number is the one thing §5.5
// forbids, and the guide table above already carries the words.
var COREX = {
  labels: ['1Q25','2Q25','3Q25','4Q25','1Q26','2Q26','3Q26','4Q26'],
  core:   [0.0, 1.5, 3.0, 2.5, 0.5, 3.0, 2.5, null],
  exResp: [1.0, 2.0, 2.5, 4.0, 3.0, 4.5, 5.0, null]
};

// ═══ 4 · The quotes ═══════════════════════════════════════════════════════════════════════════
var QUOTES = [
  { t:'The year and the exit rate', q:[
    { s:'Rainer Blair', w:'2Q26, prepared remarks', x:'This results in a full year 2026 core revenue growth outlook in the range of 3%-4%.' },
    { s:'Rainer Blair', w:'2Q26, prepared remarks', x:'We continue to expect to exit Q4 at the mid-single digit core revenue growth rate as we move past some of the headwinds from the first three quarters of the year.' },
    { s:'Matt Gugino', w:'2Q26, Q&A', x:'Our view is these underlying trends continue, and as respiratory headwinds moderate in Q4, we’ll exit at that overall mid-single digit rate.' }
  ]},
  { t:'The quarter ahead', q:[
    { s:'Rainer Blair', w:'2Q26, prepared remarks', x:'We expect third quarter revenue growth to be approximately 2%-3%, which includes an approximately 250 basis point year-over-year headwind from respiratory testing. This implies that core growth excluding respiratory will be approximately 5%, an acceleration versus what we saw in the second quarter.' },
    { s:'Matt Gugino', w:'2Q26, Q&A', x:'Those headwinds essentially go away year-on-year in Q4.' }
  ]},
  { t:'The resin deferral — the most underrated thing in the quarter', q:[
    { s:'Rainer Blair', w:'2Q26, Q&A', x:'Later in the quarter, we had a few large chromatography resin shipments that were slated primarily for Q2 and Q3 move out of the year.' },
    { s:'Matt Gugino', w:'2Q26, Q&A', x:'Then for the full year, we saw a little bit north of $100 million that shifted out of that Q2, Q3 into next year.' },
    { s:'Rainer Blair', w:'2Q26, Q&A', x:'We believe, without talking specifically to 2027, that these push outs to 2027 would likely then ultimately ship in 2027.' }
  ]},
  { t:'Bioprocessing', q:[
    { s:'Rainer Blair', w:'2Q26, Q&A', x:'Underlying demand remained very healthy, with mid-teens order growth in both consumables and equipment.' },
    { s:'Matt Gugino', w:'2Q26, Q&A', x:'We’re probably exiting more in that mid to high single digits in Q4 as we go forward.' },
    { s:'Rainer Blair', w:'1Q26', x:'Orders growth of more than 30%, marking the first quarter of year-over-year equipment order growth in nearly two years.' },
    { s:'Rainer Blair', w:'1Q26', x:'Customer readiness is an important factor in when revenue is recognized, so timing can be a little lumpy.' }
  ]},
  { t:'Respiratory', q:[
    { s:'Matt Gugino', w:'2Q26, Q&A', x:'Respiratory, we’re thinking given where infection rates have trended, about $1.6 billion or a touch below that for the full year.' }
  ]},
  { t:'Masimo and StatLab', q:[
    { s:'Rainer Blair', w:'2Q26, prepared remarks', x:'We closed our acquisition of Masimo in early June, ahead of our initial expectations. We expect Masimo to be immediately accretive, both strategically and to adjusted EPS.' },
    { s:'Matt Gugino', w:'1Q26', x:'We expect both cost and revenue synergies—$125 million of cost synergies realized by year five, roughly $50 million on the gross margin side, $50 million on OpEx, and about $25 million of public company cost elimination. Then about $50 million of revenue synergies.' },
    { s:'Matt Gugino', w:'1Q26', x:'Post-close of Masimo we will be around 2.5 times net debt to EBITDA.' },
    { s:'Rainer Blair', w:'2Q26, prepared remarks', x:'StatLab generated approximately $250 million in revenue for the full year of 2025 and has an attractive business model with more than 85% recurring revenue. … We expect to close by the end of 2026.' }
  ]},
  { t:'Capital', q:[
    { s:'Rainer Blair', w:'2Q26, prepared remarks', x:'Lastly, we deployed approximately $900 million of capital to repurchase 5 million shares of Danaher common stock.' },
    { s:'Rainer Blair', w:'1Q26', x:'Our bias for capital deployment is M&A. … We have both the balance sheet capacity and the leadership bandwidth to execute additional acquisitions in any of the three segments.' }
  ]}
];

// ═══ 5 · Events ═══════════════════════════════════════════════════════════════════════════════
var PAST = [
  { d:'10 Jun 2026', k:'Masimo closes', s:'big',
    x:'$9.8B in cash, $180.00 per share, into Diagnostics. Closed <b>ahead of schedule</b>. Net debt $13.8B → <b>$22.2B</b>; goodwill +$4,960M, intangibles +$4,844M. It is what moves amortisation and interest in the table above.' },
  { d:'2Q26', k:'~$100M+ of chromatography resin slips to 2027', s:'big',
    x:'Pure timing. It depresses 2026 and <b>inflates 2027</b>. Without it, bioprocessing would not have printed low-single-digit growth in the quarter.' },
  { d:'2Q26', k:'“Core sales excluding respiratory testing” is born', s:'def',
    x:'A discontinuity in the core sales series. Any historical comparison now crosses two definitions.' },
  { d:'Jul 2026', k:'Leica Biosystems announces StatLab', s:'',
    x:'~$250M of 2025 revenue, >85% recurring. <b>Not yet in any 10-K or 10-Q.</b>' },
  { d:'1Q26', k:'Bioprocessing equipment orders +30% y/y', s:'',
    x:'First growth in nearly two years. The order-to-revenue lag is ~2–3 quarters, so it lands in 2H26–1H27.' },
  { d:'2Q25 → 2Q26', k:'Life Sciences goes from −2.5% to +5.5% core', s:'',
    x:'The biggest turn in the portfolio. The segment\'s FY26 guide went from “up slightly” to +3–4%.' },
  { d:'Feb 2026', k:'Supreme Court: IEEPA does not authorise those tariffs', s:'',
    x:'From 4 March 2026 CBP began processing refunds. A non-recurring cash inflow, amount and timing unknown. The 2025 tariff cost was &lt;$300M.' },
  { d:'Feb 2026', k:'CFO change: Matt McGrew → Matt Gugino', s:'',
    x:'It changes the style of the spoken guide; the 8-K table stayed the same.' },
  { d:'Sep 2025', k:'New buyback authorisation: 35M shares', s:'',
    x:'As of June 2026, <b>32.0M</b> remain authorised.' }
];
var FUTURE = [
  { d:'Late Oct 2026', k:'3Q26 results', s:'big', warn:true,
    x:'<b>The first full quarter of Masimo</b> → it calibrates the amortisation and the Diagnostics margin. Guided: core +2–3%, ex-respiratory ~5%, adjusted operating margin ~26.5%. <i>The exact date is unconfirmed — Danaher reported 3Q on 21-Oct-2025 and 22-Oct-2024; confirm on the Events &amp; Presentations page at danaher.com.</i>' },
  { d:'3Q26', k:'Tariff refunds start being excluded from core sales', s:'def',
    x:'The second definition change of the year. Announced in the 2Q26 8-K itself.' },
  { d:'Before end 2026', k:'StatLab closes', s:'',
    x:'+$250M of base into Diagnostics via Leica, >85% recurring, accretive in the first full year. Subject to approvals.' },
  { d:'4Q26', k:'Respiratory season', s:'big',
    x:'The guide assumes the y/y headwind <b>disappears</b> in Q4 (impact “Flat”). It is the bet that holds up the mid-single-digit exit rate.' },
  { d:'4Q26', k:'Annual goodwill test (first day of Q4)', s:'',
    x:'The ~$10.1B reporting unit has only 20% of headroom — 10% under a −10% scenario.' },
  { d:'Jan/Feb 2027', k:'4Q26 results + initial 2027 guide', s:'big',
    x:'The first full year with Masimo and StatLab. This is where it becomes visible whether the ~$100M of resin came back.' },
  { d:'Feb 2027', k:'FY2026 10-K', s:'',
    x:'It carries the <b>new five-year amortisation table with Masimo already inside</b> — the clean input that does not exist today.' },
  { d:'By Jun 2027', k:'Masimo PPA measurement period closes', s:'',
    x:'The company says explicitly that the allocation <b>will change</b>, and the amortisation with it.' }
];
var OPEN = [
  'IEEPA refunds — Danaher will recognise the benefit <b>less whatever it must return to customers</b>. Unquantified.',
  'The ~$100M of resin has to ship in 2027.',
  'China VBP: <b>$75–100M</b> of headwind left in 2026, against $150M in 2025. It runs out.',
  'Deleveraging from ~2.5× net debt/EBITDA with &gt;$5B of annual free cash flow — it determines when large M&amp;A comes back.',
  '<b>32.0M shares</b> still authorised for repurchase.',
  'Danish tax case: DKK 2.1B (~$326M), under appeal.',
  'US academic and government funding — the company treats it as <b>upside NOT included in the guide</b>.'
];

// ═══ Style ════════════════════════════════════════════════════════════════════════════════════
function style(){
  return '<style>' + [
    '.dgd .dgd-lede{font-size:12.5px;line-height:1.65;color:var(--mu);margin:0 0 18px}',
    '.dgd .dgd-lede b{color:var(--navy)}',
    '.dgd .ov-sec-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);margin:24px 0 4px;display:flex;align-items:center;gap:9px}',
    '.dgd .ov-sec-h:first-child{margin-top:0}',
    '.dgd .ov-sec-h::after{content:"";flex:1;height:1px;background:var(--bdr)}',
    '.dgd .dgd-sub{font-size:11.5px;color:var(--mu);line-height:1.6;margin:0 0 12px}',
    '.dgd table.dgd-t{width:100%;border-collapse:collapse;font-size:11.5px;margin:0 0 6px}',
    '.dgd .dgd-t th{text-align:left;background:#F7F9FB;color:var(--mu);font-weight:800;font-size:9.5px;text-transform:uppercase;letter-spacing:.04em;padding:8px 10px;border-bottom:1px solid var(--bdr);white-space:nowrap}',
    '.dgd .dgd-t td{padding:8px 10px;border-bottom:1px solid var(--bdr);color:var(--navy);vertical-align:top;line-height:1.5}',
    '.dgd .dgd-t tr:last-child td{border-bottom:none}',
    '.dgd .dgd-t td.k{font-weight:700;white-space:nowrap}',
    '.dgd .dgd-t td.sub{padding-left:24px;font-weight:400;color:var(--mu)}',
    '.dgd .dgd-t td.why{color:var(--mu);font-size:11px}',
    '.dgd .dgd-t tr.b td{font-weight:800;background:rgba(15,125,194,.045)}',
    '.dgd .dgd-t td.num{white-space:nowrap;font-variant-numeric:tabular-nums}',
    '.dgd .mv{font-size:12px;font-weight:800;white-space:nowrap}',
    '.dgd .mv.up{color:' + D_UP + '}.dgd .mv.dn{color:' + D_DOWN + '}.dgd .mv.eq{color:' + GRAY + '}',
    '.dgd .dgd-wrap{overflow-x:auto;border:1px solid var(--bdr);border-radius:10px;margin:0 0 8px}',
    '.dgd .dgd-qg{border:1px solid var(--bdr);border-radius:10px;margin-bottom:7px;overflow:hidden}',
    '.dgd .dgd-qh{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--w);border:none;font:inherit;font-size:12px;font-weight:800;color:var(--navy);padding:10px 13px;cursor:pointer;text-align:left}',
    '.dgd .dgd-qh:hover{background:#F7F9FB}',
    '.dgd .dgd-qb{padding:4px 13px 12px;border-top:1px solid var(--bdr)}.dgd .dgd-qb[hidden]{display:none}',
    '.dgd blockquote{margin:11px 0 0;padding:0 0 0 13px;border-left:3px solid ' + BRAND + ';font-size:12px;line-height:1.65;color:var(--navy);font-style:italic}',
    '.dgd blockquote cite{display:block;margin-top:5px;font-style:normal;font-size:10px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:var(--mu)}',
    '.dgd .dgd-ev{border-left:2px solid var(--bdr);margin:0 0 4px;padding-left:0}',
    '.dgd .dgd-row{display:grid;grid-template-columns:128px 1fr;gap:12px;padding:10px 0 10px 15px;border-bottom:1px solid var(--bdr);position:relative}',
    '.dgd .dgd-row:last-child{border-bottom:none}',
    '.dgd .dgd-row::before{content:"";position:absolute;left:-5px;top:15px;width:8px;height:8px;border-radius:50%;background:var(--bdr)}',
    '.dgd .dgd-row.big::before{background:' + BRAND + '}',
    '.dgd .dgd-row.def::before{background:' + AMBER + '}',
    '.dgd .dgd-d{font-size:10px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:var(--mu);padding-top:2px}',
    '.dgd .dgd-k{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:3px}',
    '.dgd .dgd-x{font-size:11.5px;color:var(--mu);line-height:1.6}.dgd .dgd-x b{color:var(--navy)}',
    '.dgd .dgd-warn{font-size:8.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:' + AMBER + ';background:rgba(183,121,31,.10);border:1px solid rgba(183,121,31,.30);border-radius:999px;padding:1px 7px;margin-left:7px;white-space:nowrap}',
    '.dgd .dgd-open{margin:0;padding-left:18px}',
    '.dgd .dgd-open li{font-size:11.5px;color:var(--mu);line-height:1.65;margin-bottom:5px}',
    '.dgd .dgd-open li b{color:var(--navy)}',
    '.dgd .dgd-foot{font-size:10.5px;color:' + GRAY + ';line-height:1.6;margin-top:20px;padding-top:12px;border-top:1px solid var(--bdr)}'
  ].join('') + '</style>';
}

// ═══ Blocks ═══════════════════════════════════════════════════════════════════════════════════
var MV = { up:'▲', dn:'▼', eq:'=' };
function driverTable(){
  return '<div class="dgd-wrap"><table class="dgd-t"><thead><tr>' +
    '<th>Driver</th><th>8-K 1Q26 · 21 Apr</th><th>8-K 2Q26 · 21 Jul</th><th></th><th>What it means</th>' +
    '</tr></thead><tbody>' + DRIVERS.map(function(d){
      var sub = d.k.indexOf('—') === 0;
      return '<tr><td class="k' + (sub ? ' sub' : '') + '">' + esc(d.k) + '</td>' +
        '<td class="num">' + esc(d.a) + '</td><td class="num"><b>' + esc(d.b) + '</b></td>' +
        '<td><span class="mv ' + d.mv + '">' + MV[d.mv] + '</span></td>' +
        '<td class="why">' + d.why + '</td></tr>';
    }).join('') + '</tbody></table></div>';
}
function guideTable(){
  return '<div class="dgd-wrap"><table class="dgd-t"><thead><tr><th>Line</th>' +
    GUIDE.cols.map(function(c){ return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
    GUIDE.rows.map(function(r){
      return '<tr' + (r.bold ? ' class="b"' : '') + '><td class="k' + (r.k.indexOf('—') === 0 ? ' sub' : '') + '">' + esc(r.k) + '</td>' +
        r.v.map(function(v){ return '<td class="num">' + esc(v) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody></table></div>';
}
function coreTable(){
  return '<div class="dgd-wrap"><table class="dgd-t"><thead><tr><th>Core sales growth</th>' +
    COREX.labels.map(function(l, i){ return '<th>' + esc(l) + (i > RESP.lastAct ? ' E' : '') + '</th>'; }).join('') +
    '</tr></thead><tbody>' +
    [['Reported', COREX.core], ['Ex-respiratory', COREX.exResp]].map(function(r){
      return '<tr><td class="k">' + r[0] + '</td>' + r[1].map(function(v){
        return '<td class="num">' + (v == null ? '<span style="color:' + GRAY + '">guided in words</span>' : (v > 0 ? '+' : '') + v.toFixed(1) + '%') + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody></table></div>';
}
function quotesBlock(){
  return QUOTES.map(function(g, i){
    return '<div class="dgd-qg"><button type="button" class="dgd-qh" data-dgdq="' + i + '">' + esc(g.t) +
      '<span class="dgd-qic">+</span></button><div class="dgd-qb" hidden>' +
      g.q.map(function(q){
        return '<blockquote>“' + esc(q.x) + '”<cite>' + esc(q.s) + ' · ' + esc(q.w) + '</cite></blockquote>';
      }).join('') + '</div></div>';
  }).join('');
}
function eventList(rows){
  return '<div class="dgd-ev">' + rows.map(function(e){
    return '<div class="dgd-row' + (e.s ? ' ' + e.s : '') + '"><div class="dgd-d">' + esc(e.d) + '</div>' +
      '<div><div class="dgd-k">' + esc(e.k) + (e.warn ? '<span class="dgd-warn">date to confirm</span>' : '') + '</div>' +
      '<div class="dgd-x">' + e.x + '</div></div></div>';
  }).join('') + '</div>';
}

export function dhrGuidanceHtml(){
  return style() + '<div class="dgd">' +
    '<p class="dgd-lede"><b>What the company put in writing.</b> Danaher publishes a forward-looking driver table in every 8-K — amortisation, net interest, tax rate, share count, FX, corporate expense, core growth by segment — and it <b>never reads it out on the call</b>. That table governs; the call supplies colour and the why. Where they disagree, the 8-K wins. The numbers below were read out of the release text, not from a transcript and not from press coverage.</p>' +

    '<div class="ov-sec-h">What moved between the last two releases</div>' +
    '<p class="dgd-sub">The read that matters: the core ceiling coming down (+3–6% → +3–4%) was <b>not demand</b>. It was respiratory plus the resin deferral. At the same time adjusted EPS went up and Life Sciences went from “up slightly” to +3–4%. Better mix, not a worse year.</p>' +
    driverTable() +

    '<div class="ov-sec-h">The guide as it stands — the 2Q26 release</div>' +
    guideTable() +

    '<div class="ov-sec-h">Respiratory — the only line Danaher guides in dollars</div>' +
    '<p class="dgd-sub">It is the swing factor of the entire 2026 guide. Danaher rounds it to the nearest $50M, which is why the quarters do not sum exactly to the year (its own footnote says so). <b>The impact is in points of core growth, and a positive number is a headwind</b> — that is the company\'s sign convention, and it is the opposite of what a reader assumes.</p>' +
    dStdScaffold({ id:'dhrResp', title:'Respiratory testing sales and their drag on core', height:330,
      metricSel:[{ v:'resp', label:'Respiratory sales ($M) + drag (pp)', on:true }],
      presets:[['all','All'],['fy26','FY26'],['fwd','Guided only']],
      note:'Source: the “Historical and Forward-Looking Respiratory Testing Sales” table of the 21-Jul-2026 8-K. 3Q26 and 4Q26 are guidance, not reported.' }) +
    coreTable() +
    '<p class="dgd-sub">The gap between the two rows <b>is</b> respiratory. In 2Q26 the business grew 3.0% reported and 4.5% excluding respiratory; for 3Q26 the company guides ~5.0% excluding respiratory against +2–3% reported. The 4Q26 cells are empty on purpose: there the guide is a word (“mid-single digit”), and turning a word into a number is exactly what must not be done.</p>' +

    '<div class="ov-sec-h">The quotes worth having to hand</div>' +
    '<p class="dgd-sub">Verbatim, attributed, from the 1Q26 and 2Q26 calls. They exist only as speech — they are never mixed into a series from a filing.</p>' +
    quotesBlock() +

    '<div class="ov-sec-h">Events that have already happened and change the model</div>' +
    eventList(PAST) +

    '<div class="ov-sec-h">Events still to come</div>' +
    eventList(FUTURE) +

    '<div class="ov-sec-h">Open, undated, but material</div>' +
    '<ul class="dgd-open">' + OPEN.map(function(o){ return '<li>' + o + '</li>'; }).join('') + '</ul>' +

    '<p class="dgd-foot">Primary sources: 8-K Ex-99.1 of 21-Jul-2026 (2Q26) and 21-Apr-2026 (1Q26), SEC EDGAR CIK 0000313616. Quotes: transcripts of the 1Q26 and 2Q26 earnings calls. Full working notes, with the model implications: <code>danaher-research/GUIDANCE_Y_EVENTOS.md</code>.</p>' +
  '</div>';
}

// ═══ Init ═════════════════════════════════════════════════════════════════════════════════════
function respDerive(st){
  var n = RESP.labels.length, lo = 0, hi = n - 1;
  var pr = st.range || 'all';
  if (pr === 'fy26'){ lo = 4; }
  else if (pr === 'fwd'){ lo = RESP.lastAct + 1; }
  st.win = (st.win && st.win[0] >= lo && st.win[1] <= hi) ? st.win : [lo, hi];
  return {
    labels: RESP.labels.slice(),
    lastAct: RESP.lastAct,
    series: [
      { k:'sales', grp:'sales', src:'Respiratory sales', label:'Respiratory testing sales ($M)', color:D_ACT, type:'bar' , data:RESP.sales.slice() },
      { k:'drag',  grp:'drag',  src:'Drag on core (pp)', label:'Drag on core growth (pp, + = headwind)', color:D_DOWN, type:'line', yAxisID:'y2', data:RESP.drag.slice() }
    ],
    yFmt: function(v){ return '$' + Math.round(v) + 'M'; },
    y2Fmt: function(v){ return (v > 0 ? '+' : '') + v.toFixed(1) + 'pp'; },
    tblTitle: 'Data — what the chart draws',
    legNote: 'The pale bars (3Q26, 4Q26) are guidance, not reported.'
  };
}

export function dhrGuidanceInit(pane){
  var root = pane && pane.querySelector ? pane.querySelector('.dgd') : null;
  if (!root) return;
  dStdRender('dhrResp', respDerive, root);
  if (root._dgdWired) return;
  root._dgdWired = true;
  dWireTables(root);
  root.addEventListener('click', function(e){
    var h = e.target.closest ? e.target.closest('.dgd-qh') : null;
    if (!h || !root.contains(h)) return;
    var b = h.nextElementSibling; if (!b || !b.classList.contains('dgd-qb')) return;
    var open = b.hidden; b.hidden = !open;
    var ic = h.querySelector('.dgd-qic'); if (ic) ic.textContent = open ? '−' : '+';
  });
}
