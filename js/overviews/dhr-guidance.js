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

import { dStdScaffold, dStdRender, dWireTables, D_ACT, D_ADJ, D_REF, D_UP, D_DOWN, D_NEUT } from './dhr-chartkit.js';

var BRAND = '#0F7DC2', GRAY = '#9AA4B0', AMBER = '#B7791F';
function esc(s){ if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ═══ 1 · The driver table — what moved between the two releases ════════════════════════════════
// `mv` is the direction the DRIVER moved, not whether it is good news: amortisation going up is
// ▲ even though it is a cost. The read column says what it means.
var DRIVERS = [
  { k:'Core sales growth FY26',        a:'+3.0% – +6.0%', b:'+3.0% – +4.0%', mv:'dn', why:'Techo cortado 200pb. No fue demanda — fue respiratorio más el diferimiento de resinas.' },
  { k:'— Biotechnology',               a:'~+6.0%',        b:'+Mid-single digit', mv:'dn', why:'' },
  { k:'— Life Sciences',               a:'+Up slightly',  b:'+3.0% – +4.0%', mv:'up', why:'El cambio de tendencia más grande del portafolio.' },
  { k:'— Diagnostics',                 a:'+Low-single digit', b:'Flat',      mv:'dn', why:'Respiratorio.' },
  { k:'Adj. diluted EPS FY26',         a:'$8.35 – $8.55', b:'$8.45 – $8.60', mv:'up', why:'Subió con el techo de ventas bajando. Es mix, no volumen.' },
  { k:'Amortización de intangibles FY26', a:'~$(1,700)M', b:'~$(1,900)M',   mv:'up', why:'+$200M de Masimo.' },
  { k:'Interest expense, net FY26',    a:'~$(140)M',      b:'~$(310)M',     mv:'up', why:'+$170M. El 3T26 guiado a $(115)M implica un run-rate de ~$460M/año — ese es el costo real de financiar Masimo.' },
  { k:'Acciones diluidas prom. FY26',  a:'~714.0M',       b:'~709.0M',      mv:'dn', why:'−5M por recompra.' },
  { k:'FX sobre ventas FY26',          a:'~+0.5%',        b:'~+0.5%',       mv:'eq', why:'' },
  { k:'Corporate expense FY26',        a:'~$(360)M',      b:'~$(360)M',     mv:'eq', why:'' },
  { k:'Tasa efectiva',                 a:'~17.0%',        b:'~17.0%',       mv:'eq', why:'' }
];

// ═══ 2 · The guide as it stands — the three columns of the 2Q26 release ════════════════════════
var GUIDE = {
  cols: ['3T26', '4T26', 'FY26'],
  rows: [
    { k:'Biotechnology — core',    v:['+Mid-single digit', '+Mid-single digit', '—'] },
    { k:'Life Sciences — core',    v:['+3.0% – +4.0%', '+3.0% – +4.0%', '—'] },
    { k:'Diagnostics — core',      v:['Flat', '+Up slightly', '—'] },
    { k:'Total core',              v:['+2.0% – +3.0%', '+Mid-single digit', '+3.0% – +4.0%'], bold:true },
    { k:'Impacto de respiratorio', v:['+2.5%', 'Flat', '+Low-single digit'] },
    { k:'Core ex-respiratorio',    v:['~+5.0%', '+Mid-single digit', '+Mid-single digit'], bold:true },
    { k:'Adj. operating margin',   v:['~26.5%', '—', '—'] },
    { k:'Adj. diluted EPS',        v:['—', '—', '$8.45 – $8.60'], bold:true },
    { k:'Amortización de intangibles', v:['~$(500)M', '—', '~$(1,900)M'] },
    { k:'Interest expense, net',   v:['~$(115)M', '—', '~$(310)M'] },
    { k:'Corporate expense',       v:['~$(90)M', '—', '~$(360)M'] },
    { k:'Tasa efectiva',           v:['~17.0%', '—', '~17.0%'] },
    { k:'Acciones diluidas prom.', v:['~707M', '—', '~709M'] },
    { k:'FX sobre ventas',         v:['~(1.0)%', '—', '~+0.5%'] }
  ]
};

// ═══ 3 · Respiratory — the only line Danaher guides in DOLLARS ═════════════════════════════════
// Rounded by the company to the nearest $50M, which is why the quarters do not sum exactly to the
// year (its own footnote says so). The impact row is in POINTS of core growth, and a POSITIVE
// number is a HEADWIND — that is Danaher's sign convention, stated in the release, and it is the
// opposite of what a reader assumes, so the chart says it on screen.
var RESP = {
  labels: ['1T25','2T25','3T25','4T25','1T26','2T26','3T26','4T26'],
  sales:  [650, 300, 500, 500, 500, 250, 325, 500],
  drag:   [1.0, 0.5, -0.5, 1.5, 2.5, 1.5, 2.5, 0.0],
  lastAct: 5                                    // 2T26 — 3T26 and 4T26 are guided, not reported
};
// Reported core vs core ex-respiratory, from the same release. Forward cells stay null where the
// guide is a WORD ("mid-single digit") — turning a phrase into a number is the one thing §5.5
// forbids, and the guide table above already carries the words.
var COREX = {
  labels: ['1T25','2T25','3T25','4T25','1T26','2T26','3T26','4T26'],
  core:   [0.0, 1.5, 3.0, 2.5, 0.5, 3.0, 2.5, null],
  exResp: [1.0, 2.0, 2.5, 4.0, 3.0, 4.5, 5.0, null]
};

// ═══ 4 · The quotes ═══════════════════════════════════════════════════════════════════════════
var QUOTES = [
  { t:'El año y el exit rate', q:[
    { s:'Rainer Blair', w:'2T26, prepared remarks', x:'This results in a full year 2026 core revenue growth outlook in the range of 3%-4%.' },
    { s:'Rainer Blair', w:'2T26, prepared remarks', x:'We continue to expect to exit Q4 at the mid-single digit core revenue growth rate as we move past some of the headwinds from the first three quarters of the year.' },
    { s:'Matt Gugino', w:'2T26, Q&A', x:'Our view is these underlying trends continue, and as respiratory headwinds moderate in Q4, we’ll exit at that overall mid-single digit rate.' }
  ]},
  { t:'El trimestre que viene', q:[
    { s:'Rainer Blair', w:'2T26, prepared remarks', x:'We expect third quarter revenue growth to be approximately 2%-3%, which includes an approximately 250 basis point year-over-year headwind from respiratory testing. This implies that core growth excluding respiratory will be approximately 5%, an acceleration versus what we saw in the second quarter.' },
    { s:'Matt Gugino', w:'2T26, Q&A', x:'Those headwinds essentially go away year-on-year in Q4.' }
  ]},
  { t:'El diferimiento de resinas — lo más subestimado del trimestre', q:[
    { s:'Rainer Blair', w:'2T26, Q&A', x:'Later in the quarter, we had a few large chromatography resin shipments that were slated primarily for Q2 and Q3 move out of the year.' },
    { s:'Matt Gugino', w:'2T26, Q&A', x:'Then for the full year, we saw a little bit north of $100 million that shifted out of that Q2, Q3 into next year.' },
    { s:'Rainer Blair', w:'2T26, Q&A', x:'We believe, without talking specifically to 2027, that these push outs to 2027 would likely then ultimately ship in 2027.' }
  ]},
  { t:'Bioprocessing', q:[
    { s:'Rainer Blair', w:'2T26, Q&A', x:'Underlying demand remained very healthy, with mid-teens order growth in both consumables and equipment.' },
    { s:'Matt Gugino', w:'2T26, Q&A', x:'We’re probably exiting more in that mid to high single digits in Q4 as we go forward.' },
    { s:'Rainer Blair', w:'1T26', x:'Orders growth of more than 30%, marking the first quarter of year-over-year equipment order growth in nearly two years.' },
    { s:'Rainer Blair', w:'1T26', x:'Customer readiness is an important factor in when revenue is recognized, so timing can be a little lumpy.' }
  ]},
  { t:'Respiratorio', q:[
    { s:'Matt Gugino', w:'2T26, Q&A', x:'Respiratory, we’re thinking given where infection rates have trended, about $1.6 billion or a touch below that for the full year.' }
  ]},
  { t:'Masimo y StatLab', q:[
    { s:'Rainer Blair', w:'2T26, prepared remarks', x:'We closed our acquisition of Masimo in early June, ahead of our initial expectations. We expect Masimo to be immediately accretive, both strategically and to adjusted EPS.' },
    { s:'Matt Gugino', w:'1T26', x:'We expect both cost and revenue synergies—$125 million of cost synergies realized by year five, roughly $50 million on the gross margin side, $50 million on OpEx, and about $25 million of public company cost elimination. Then about $50 million of revenue synergies.' },
    { s:'Matt Gugino', w:'1T26', x:'Post-close of Masimo we will be around 2.5 times net debt to EBITDA.' },
    { s:'Rainer Blair', w:'2T26, prepared remarks', x:'StatLab generated approximately $250 million in revenue for the full year of 2025 and has an attractive business model with more than 85% recurring revenue. … We expect to close by the end of 2026.' }
  ]},
  { t:'Capital', q:[
    { s:'Rainer Blair', w:'2T26, prepared remarks', x:'Lastly, we deployed approximately $900 million of capital to repurchase 5 million shares of Danaher common stock.' },
    { s:'Rainer Blair', w:'1T26', x:'Our bias for capital deployment is M&A. … We have both the balance sheet capacity and the leadership bandwidth to execute additional acquisitions in any of the three segments.' }
  ]}
];

// ═══ 5 · Events ═══════════════════════════════════════════════════════════════════════════════
var PAST = [
  { d:'10-jun-2026', k:'Cierre de Masimo', s:'big',
    x:'$9.8B en efectivo, $180.00/acción, a Diagnostics. Cerró <b>antes</b> de lo previsto. Deuda neta $13.8B → <b>$22.2B</b>; goodwill +$4,960M, intangibles +$4,844M. Es lo que mueve amortización e interés en la tabla de arriba.' },
  { d:'2T26', k:'~$100M+ de resinas de cromatografía se corren a 2027', s:'big',
    x:'Timing puro. Deprime 2026 e <b>infla 2027</b>. Sin esto, bioprocessing no habría hecho low-single-digit en el trimestre.' },
  { d:'2T26', k:'Nace el non-GAAP "core sales excluding respiratory testing"', s:'def',
    x:'Discontinuidad en la serie de core sales. Cualquier comparación histórica cruza dos definiciones.' },
  { d:'jul-2026', k:'Leica Biosystems anuncia StatLab', s:'',
    x:'~$250M de ventas 2025, >85% recurrente. <b>Aún no está en ningún 10-K/10-Q.</b>' },
  { d:'1T26', k:'Órdenes de equipo de bioprocessing +30% a/a', s:'',
    x:'Primer crecimiento en casi dos años. El rezago orden→revenue es ~2–3 trimestres, así que aterriza en 2S26–1S27.' },
  { d:'2T25 → 2T26', k:'Life Sciences pasa de −2.5% a +5.5% de core', s:'',
    x:'El giro más grande del portafolio. La guía FY26 del segmento subió de "up slightly" a +3–4%.' },
  { d:'feb-2026', k:'Corte Suprema: IEEPA no autoriza esos aranceles', s:'',
    x:'Desde el 4-mar-2026 CBP procesa reembolsos. Entrada de caja no recurrente, monto y timing desconocidos. El costo arancelario de 2025 fue &lt;$300M.' },
  { d:'feb-2026', k:'Cambio de CFO: Matt McGrew → Matt Gugino', s:'',
    x:'Cambia el estilo de la guía hablada; la tabla del 8-K se mantuvo igual.' },
  { d:'sep-2025', k:'Nuevo programa de recompra: 35M de acciones', s:'',
    x:'A jun-2026 quedan <b>32.0M</b> autorizadas.' }
];
var FUTURE = [
  { d:'Finales de oct-2026', k:'Resultados 3T26', s:'big', warn:true,
    x:'<b>Primer trimestre completo de Masimo</b> → calibra la amortización y el margen de Diagnostics. Guiado: core +2–3%, ex-respiratorio ~5%, adj. operating margin ~26.5%. <i>La fecha exacta no está confirmada — Danaher reportó el 3T el 21-oct-2025 y el 22-oct-2024; confirmar en Events &amp; Presentations de danaher.com.</i>' },
  { d:'3T26', k:'Entra en vigor la exclusión de reembolsos de aranceles de core sales', s:'def',
    x:'Segundo cambio de definición del año. Anunciado en el propio 8-K de 2T26.' },
  { d:'Antes de fin de 2026', k:'Cierre de StatLab', s:'',
    x:'+$250M de base a Diagnostics vía Leica, >85% recurrente, accretiva al primer año completo. Sujeto a aprobaciones.' },
  { d:'4T26', k:'Temporada respiratoria', s:'big',
    x:'La guía asume que el headwind a/a <b>desaparece</b> en 4T (impacto "Flat"). Es la apuesta que sostiene el exit rate de mid-single-digit.' },
  { d:'4T26', k:'Test anual de goodwill (primer día del 4T)', s:'',
    x:'La reporting unit de ~$10.1B tiene sólo 20% de colchón — 10% bajo un escenario de −10%.' },
  { d:'ene/feb-2027', k:'Resultados 4T26 + guía inicial 2027', s:'big',
    x:'Primer año completo con Masimo y StatLab. Aquí se ve si los ~$100M de resinas volvieron.' },
  { d:'feb-2027', k:'10-K de FY2026', s:'',
    x:'Trae la <b>nueva tabla de amortización a 5 años ya con Masimo dentro</b> — el insumo limpio que hoy no existe.' },
  { d:'Hasta jun-2027', k:'Cierre del measurement period de la PPA de Masimo', s:'',
    x:'La empresa dice explícitamente que la asignación <b>va a cambiar</b>, y con ella la amortización.' }
];
var OPEN = [
  'Reembolsos IEEPA — Danaher reconocerá utilidad <b>menos lo que deba devolver a clientes</b>. Sin cuantificar.',
  'Los ~$100M de resinas deben embarcarse en 2027.',
  'China VBP: queda <b>$75–100M</b> de headwind en 2026, contra $150M en 2025. Se agota.',
  'Desapalancamiento desde ~2.5× deuda neta/EBITDA con &gt;$5B de FCF anual — determina cuándo vuelve el M&amp;A grande.',
  '<b>32.0M de acciones</b> aún autorizadas para recompra.',
  'Caso fiscal de Dinamarca: DKK 2.1B (~$326M), en apelación.',
  'Fondeo académico y gubernamental en EE.UU. — la empresa lo trata como <b>upside NO incluido en la guía</b>.'
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
    /* quotes */
    '.dgd .dgd-qg{border:1px solid var(--bdr);border-radius:10px;margin-bottom:7px;overflow:hidden}',
    '.dgd .dgd-qh{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--w);border:none;font:inherit;font-size:12px;font-weight:800;color:var(--navy);padding:10px 13px;cursor:pointer;text-align:left}',
    '.dgd .dgd-qh:hover{background:#F7F9FB}',
    '.dgd .dgd-qb{padding:4px 13px 12px;border-top:1px solid var(--bdr)}.dgd .dgd-qb[hidden]{display:none}',
    '.dgd blockquote{margin:11px 0 0;padding:0 0 0 13px;border-left:3px solid ' + BRAND + ';font-size:12px;line-height:1.65;color:var(--navy);font-style:italic}',
    '.dgd blockquote cite{display:block;margin-top:5px;font-style:normal;font-size:10px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:var(--mu)}',
    /* events */
    '.dgd .dgd-ev{border-left:2px solid var(--bdr);margin:0 0 4px;padding-left:0}',
    '.dgd .dgd-row{display:grid;grid-template-columns:118px 1fr;gap:12px;padding:10px 0 10px 15px;border-bottom:1px solid var(--bdr);position:relative}',
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
    '<th>Driver</th><th>8-K 1T26 · 21-abr</th><th>8-K 2T26 · 21-jul</th><th></th><th>Qué significa</th>' +
    '</tr></thead><tbody>' + DRIVERS.map(function(d){
      var sub = d.k.indexOf('—') === 0;
      return '<tr><td class="k' + (sub ? ' sub' : '') + '">' + esc(d.k) + '</td>' +
        '<td class="num">' + esc(d.a) + '</td><td class="num"><b>' + esc(d.b) + '</b></td>' +
        '<td><span class="mv ' + d.mv + '">' + MV[d.mv] + '</span></td>' +
        '<td class="why">' + d.why + '</td></tr>';
    }).join('') + '</tbody></table></div>';
}
function guideTable(){
  return '<div class="dgd-wrap"><table class="dgd-t"><thead><tr><th>Línea</th>' +
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
    [['Reportado', COREX.core], ['Ex-respiratorio', COREX.exResp]].map(function(r){
      return '<tr><td class="k">' + r[0] + '</td>' + r[1].map(function(v){
        return '<td class="num">' + (v == null ? '<span style="color:' + GRAY + '">guiado en palabras</span>' : (v > 0 ? '+' : '') + v.toFixed(1) + '%') + '</td>';
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
      '<div><div class="dgd-k">' + esc(e.k) + (e.warn ? '<span class="dgd-warn">fecha por confirmar</span>' : '') + '</div>' +
      '<div class="dgd-x">' + e.x + '</div></div></div>';
  }).join('') + '</div>';
}

export function dhrGuidanceHtml(){
  return style() + '<div class="dgd">' +
    '<p class="dgd-lede"><b>Lo que la empresa puso por escrito.</b> Danaher publica en cada 8-K una tabla de drivers hacia adelante —amortización, interés neto, tasa, acciones, FX, corporate, core por segmento— y <b>nunca la lee en el call</b>. Esa tabla manda; el call da el color y el porqué. Donde discrepan, gana el 8-K. Los números de abajo salieron del texto del comunicado, no de una transcripción ni de cobertura de prensa.</p>' +

    '<div class="ov-sec-h">Qué se movió entre los dos últimos comunicados</div>' +
    '<p class="dgd-sub">La lectura que importa: el recorte del techo de core (6% → 4%) <b>no fue demanda</b>. Fue respiratorio más el diferimiento de resinas. Al mismo tiempo subió el EPS y subió Life Sciences de “up slightly” a +3–4%. Es un mix mejor, no un año peor.</p>' +
    driverTable() +

    '<div class="ov-sec-h">La guía como está hoy — comunicado del 2T26</div>' +
    guideTable() +

    '<div class="ov-sec-h">Respiratorio — la única línea que Danaher guía en dólares</div>' +
    '<p class="dgd-sub">Es el swing factor de toda la guía de 2026. Danaher lo redondea al $50M más cercano, por eso los trimestres no suman exacto al año (lo dice su propia nota al pie). <b>El impacto está en puntos de core growth y un número positivo es un viento en contra</b> — esa es la convención de signo de la empresa, y es la contraria a la que uno asume.</p>' +
    dStdScaffold({ id:'dhrResp', title:'Ventas de respiratorio y su arrastre sobre el core', height:330,
      metricSel:[{ v:'resp', label:'Ventas de respiratorio ($M) + arrastre (pp)', on:true }],
      presets:[['all','Todo'],['fy26','FY26'],['fwd','Sólo guiado']],
      note:'Fuente: tabla “Historical and Forward-Looking Respiratory Testing Sales” del 8-K del 21-jul-2026. 3T26 y 4T26 son guía, no reportado.' }) +
    coreTable() +
    '<p class="dgd-sub">La brecha entre las dos filas <b>es</b> el respiratorio. En 2T26 el negocio creció 3.0% reportado y 4.5% sin respiratorio; para 3T26 la empresa guía ~5.0% sin respiratorio contra +2–3% reportado. Las celdas de 4T26 quedan vacías a propósito: ahí la guía es una palabra (“mid-single digit”), y convertir una palabra en un número es exactamente lo que no se debe hacer.</p>' +

    '<div class="ov-sec-h">Los quotes que hay que tener a mano</div>' +
    '<p class="dgd-sub">Textuales, atribuidos, de los calls de 1T26 y 2T26. Existen sólo como habla — no se mezclan con ninguna serie de un filing.</p>' +
    quotesBlock() +

    '<div class="ov-sec-h">Eventos que ya ocurrieron y cambian el modelo</div>' +
    eventList(PAST) +

    '<div class="ov-sec-h">Eventos por venir</div>' +
    eventList(FUTURE) +

    '<div class="ov-sec-h">Abierto, sin fecha, pero material</div>' +
    '<ul class="dgd-open">' + OPEN.map(function(o){ return '<li>' + o + '</li>'; }).join('') + '</ul>' +

    '<p class="dgd-foot">Fuentes primarias: 8-K Ex-99.1 del 21-jul-2026 (2T26) y del 21-abr-2026 (1T26), SEC EDGAR CIK 0000313616. Quotes: transcripciones de los calls de 1T26 y 2T26. Notas de trabajo completas, con las implicaciones para el modelo: <code>danaher-research/GUIDANCE_Y_EVENTOS.md</code>.</p>' +
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
      { k:'sales', grp:'sales', src:'Ventas de respiratorio', label:'Ventas de respiratorio ($M)', color:D_ACT, type:'bar' , data:RESP.sales.slice() },
      { k:'drag',  grp:'drag',  src:'Arrastre sobre core (pp)', label:'Arrastre sobre core (pp, + = viento en contra)', color:D_DOWN, type:'line', yAxisID:'y2', data:RESP.drag.slice() }
    ],
    yFmt: function(v){ return '$' + Math.round(v) + 'M'; },
    y2Fmt: function(v){ return (v > 0 ? '+' : '') + v.toFixed(1) + 'pp'; },
    tblTitle: 'Datos — lo que dibuja el gráfico',
    legNote: 'Las barras claras (3T26, 4T26) son guía, no reportado.'
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
