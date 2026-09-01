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
// ── THE DATA COMES IN, IT IS NOT REDECLARED ───────────────────────────────────────────────────
// `dhrExpenseHtml(A)` takes the annual array from dhr-bottomline.js rather than importing it,
// which would make a cycle (bottom line imports this module). One home for the numbers.

import { DHR_KIT_CSS } from './dhr-chartkit.js';

var BRAND = '#0F7DC2', BRAND2 = '#1E3A5F', GREEN = '#2E8B57', RED = '#C0504D', AMBER = '#B7791F', GRAY = '#9AA4B0';
function esc(s){ if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fM(v){ return v == null ? '—' : '$' + Math.round(v).toLocaleString('en-US') + 'M'; }
function fP(v, d){ return v == null ? '—' : v.toFixed(d == null ? 1 : d) + '%'; }

// ─── Inline SVG sparkline. No Chart.js: these are eight points inside a heading, not a chart, and
// a canvas per line would cost eight chart instances for something a path renders exactly. It
// carries its own value labels at both ends so it is never a shape without numbers.
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
    '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="serie">' +
      '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' + dots +
    '</svg>' +
    '<span class="ew-spark-e">' + esc(labels[n - 1]) + ' <b>' + f(pts[n - 1]) + '</b></span>' +
  '</div>';
}

// ═══ The four lines ═══════════════════════════════════════════════════════════════════════════
// `pick(A)` returns the % -of-revenue series for the sparkline; `kpis` are FY2025 unless said.
var LINES = [
  {
    k:'cogs', n:'Cost of sales', c:BRAND2, tag:'$10,045M · 40.9%',
    pick:function(a){ return a.rev ? a.cogs / a.rev * 100 : null; },
    kpis:[['$10,045M','Cost of sales, FY2025'],['59.1%','Gross margin'],['58.7–60.8%','Rango de 4 años'],['+3.9%','Crecimiento a/a']],
    def:'The Company’s segment operating profit … reflects cost of sales, SG&A expenses and R&D expenses, <b>excluding depreciation, amortization of intangible assets and impairments</b>. Included within these categories of expenses are overhead expenses, stock compensation expense, restructuring charges and allocated corporate expenses.',
    defSrc:'10-K FY2025, nota de segmentos',
    comp:[
      ['Materiales y trabajo directo','El grueso. Consumibles de bioprocessing, reactivos de diagnóstico, instrumentos.'],
      ['Overhead de manufactura','Incluido explícitamente por la nota de segmentos, junto con SBC y cargos de reestructuración.'],
      ['Envío y manejo','Lo que se factura al cliente entra en ventas; el costo entra aquí.'],
      ['Amortización de intangibles','Una parte corre por esta línea — ver el cuarto panel. No se puede separar desde el estado de resultados.']
    ],
    why:'Es la línea que define el margen bruto, y el margen bruto de Danaher es notablemente estable: <b>58.7% a 60.8% en cuatro años</b>, a través de una caída de ventas del 10% en 2023 y de una recuperación. Eso es mezcla, no precio: los consumibles recurrentes sostienen el margen cuando los instrumentos caen.',
    drivers:[
      ['Mezcla consumibles vs equipo','Los consumibles llevan margen más alto. En 2023–2024 cayó el equipo y el margen bruto <i>subió</i>.'],
      ['FX','Danaher vende ~60% fuera de EE.UU. El impacto en ventas se guía por separado (~+0.5% en FY26).'],
      ['Aranceles','El costo arancelario de 2025 fue <b>&lt;$300M</b>. Desde 3T26 los reembolsos salen de core sales.'],
      ['Precio','Danaher no publica un puente de precio/volumen. No lo inventes.']
    ]
  },
  {
    k:'sga', n:'SG&A', c:BRAND, tag:'$8,235M · 33.5%',
    pick:function(a){ return a.rev ? a.sga / a.rev * 100 : null; },
    kpis:[['$8,235M','SG&A, FY2025'],['33.5%','% de ventas'],['$562M','Deterioros dentro, FY2025'],['$265M','Deterioros, FY2024']],
    def:'Advertising — Advertising costs are expensed as incurred.',
    defSrc:'10-K FY2025, políticas contables',
    comp:[
      ['Fuerza de ventas y marketing','El costo comercial de vender instrumentos y consumibles a través de tres segmentos.'],
      ['Amortización de intangibles','La mayor parte de los ~$1.7B corre por aquí. Es la razón principal de que SG&A suba mientras las ventas no.'],
      ['<b>Deterioros</b>','$265M en FY2024 y <b>$562M en FY2025</b> — casi todos en Life Sciences, y todos dentro de esta línea.'],
      ['Costos de transacción de M&A','Los cargos de Masimo aterrizan aquí y en Diagnostics.']
    ],
    compNote: '⚠ <b>Esta es la línea que hace que la tendencia del margen operativo engañe.</b> El margen reportado cayó de 21.8% (FY23) a 19.1% (FY25). Sumando los deterioros de vuelta, el margen limpio va de ~21.8% a <b>~21.4%</b> — prácticamente plano. La caída de 270pb es casi toda deterioros, no deterioro operativo.',
    why:'SG&A creció <b>+15.6% entre FY2022 y FY2025</b> mientras las ventas cayeron 7.8%. Casi nada de eso es gasto comercial: es amortización de adquisiciones y deterioros. Leer esta línea como ineficiencia comercial es el error más fácil de cometer con Danaher.',
    drivers:[
      ['Deterioros','FY2024 $265M, FY2025 $562M. Concentrados en Life Sciences. No recurrentes, pero han ocurrido dos años seguidos.'],
      ['Amortización creciente','Cada adquisición grande sube el escalón. Masimo añade ~$200M en 2026.'],
      ['Apalancamiento operativo negativo','Con ventas planas, un gasto que crece comprime el margen aunque nada empeore.']
    ]
  },
  {
    k:'rnd', n:'I+D', c:GREEN, tag:'$1,598M · 6.5%',
    pick:function(a){ return a.rev ? a.rnd / a.rev * 100 : null; },
    kpis:[['$1,598M','I+D, FY2025'],['6.5%','% de ventas'],['6.3–6.6%','Rango de 4 años'],['+0.9%','Crecimiento a/a']],
    def:'The Company conducts research and development (“R&D”) activities for the purpose of developing new products, enhancing the functionality, effectiveness, ease of use and reliability of the Company’s existing products and expanding the applications for which uses of the Company’s products are appropriate. <b>R&D costs are expensed as incurred.</b>',
    defSrc:'10-K FY2025, políticas contables',
    comp:[
      ['Desarrollo interno','El grueso, a través de los tres segmentos.'],
      ['Tecnología licenciada o adquirida','El 10-K lo nombra explícitamente como parte del esfuerzo de I+D.'],
      ['Nada se capitaliza','"Expensed as incurred" — no hay activo de desarrollo que amortizar después.']
    ],
    why:'Es la línea <b>más estable de todo el estado de resultados</b>: 6.3% a 6.6% de ventas durante cuatro años, sin importar el ciclo. Danaher no recorta I+D en la caída, que es la señal de que el Danaher Business System se aplica al gasto discrecional de verdad.',
    drivers:[
      ['Lanzamientos','Biacore 8S, SCIEX novus V55 y los sistemas de automatización de Beckman fueron nombrados como motores de Life Sciences en 2T26.'],
      ['Sin capitalización','No hay palanca contable aquí. Lo que se gasta, se gasta.']
    ]
  },
  {
    k:'amort', n:'Amortización de intangibles', c:AMBER, tag:'$1,697M · 6.9%',
    pick:function(a){ return a.rev ? a.amort / a.rev * 100 : null; },
    kpis:[['$1,697M','Amortización, FY2025'],['6.9%','% de ventas'],['~$1,900M','Guía FY2026 (post-Masimo)'],['$2.77','Por acción, FY2025']],
    def:'We exclude the amortization of acquisition-related intangible assets because the amount and timing of such charges are significantly impacted by the timing and size of the Company’s acquisitions.',
    defSrc:'8-K 2T26, definición del non-GAAP',
    comp:[
      ['No tiene línea propia','Corre <b>dentro</b> de cost of sales y de SG&A. No se puede leer desde el estado de resultados — sólo desde el flujo de efectivo y las notas.'],
      ['Es todo el puente GAAP → ajustado','FY2025: EPS GAAP $5.03 contra ajustado $7.80. La brecha de $2.77 es esencialmente esta línea.'],
      ['Es efectivo ya gastado','La caja salió cuando se compró la empresa. Por eso Danaher lo excluye — y por eso el FCF supera al ingreso neto todos los años.']
    ],
    compNote: '⚠ <b>Usa la guía del 8-K, no la tabla del 10-K.</b> La nota 10 del 10-K FY2025 es <b>pre-Masimo</b> y proyecta ~$1.7B para 2026. El 8-K del 21-jul-2026, ya con Masimo cerrado, dice <b>~$1,900M</b> para FY2026 y ~$500M para el 3T26. La diferencia es Masimo: ~$200M en 2026 desde el 10-jun, que implica un run-rate anual de ~$300–360M.',
    why:'Es el número más consecuente del P&L de Danaher y el que explica por qué el mercado mira el ajustado. También es el que <b>va a cambiar</b>: el measurement period de la PPA de Masimo cierra hasta jun-2027 y la empresa dice explícitamente que la asignación se va a mover, y con ella la amortización.',
    drivers:[
      ['Masimo','+$200M en 2026 sobre $4,844M de intangibles adquiridos. Vida mezclada implícita de 13–17 años.'],
      ['StatLab','Aún no está en ningún filing. Cierra antes de fin de 2026.'],
      ['El escalón no baja solo','En régimen (2027, Masimo completo): ~$1.6B de base + ~$330M ≈ <b>$1.9–2.0B</b>.']
    ],
    calls:[
      { s:'Matt Gugino', w:'1T26', x:'Post-close of Masimo we will be around 2.5 times net debt to EBITDA.' },
      { s:'Rainer Blair', w:'1T26', x:'We expect Masimo to be accretive to adjusted diluted net earnings per common share in the first full year post-acquisition and to deliver a high-single-digit return on invested capital by the fifth full year of our ownership.' }
    ]
  }
];

// ═══ KPI strip ════════════════════════════════════════════════════════════════════════════════
var STRIP = [
  { v:'59.1%',   l:'Margen bruto FY2025',            n:'Estable en 58.7–60.8% durante cuatro años.' },
  { v:'19.1%',   l:'Margen operativo reportado',      n:'', warn:true },
  { v:'~21.4%',  l:'Margen operativo sin deterioros', n:'La diferencia son $562M que no son operativos.', good:true },
  { v:'28.2%',   l:'Margen operativo ajustado',       n:'El que la empresa guía y discute.' },
  { v:'$1,697M', l:'Amortización de adquisiciones',   n:'6.9% de ventas. Todo el puente GAAP→ajustado.' },
  { v:'$298M',   l:'Stock-based compensation',        n:'1.2% de ventas — un orden de magnitud menor que la amortización.' },
  { v:'$5,260M', l:'Free cash flow FY2025',           n:'21.4% de ventas.' },
  { v:'34',      l:'Años seguidos de FCF > utilidad neta', n:'', good:true }
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
  if (line.def) h += '<div class="ew-h">Cómo lo define el filing</div><p class="ew-q">“' + line.def + '”<span class="ew-att">' + esc(line.defSrc) + '</span></p>';
  h += '<div class="ew-h">Qué hay dentro de esta línea</div>' + boxes(line.comp);
  if (line.compNote) h += '<div class="ew-warn">' + line.compNote + '</div>';
  h += '<div class="ew-h">Como % de ventas en el tiempo</div>' + spark(pts, labs, line.c);
  h += '<div class="ew-h">Por qué importa al resultado</div><div class="ew-note">' + line.why + '</div>';
  if (line.drivers){ h += '<div class="ew-h">Qué la mueve</div>' + boxes(line.drivers); }
  if (line.calls){
    h += '<div class="ew-h">Lo que dijo la dirección</div>' + line.calls.map(function(q){
      return '<blockquote>“' + esc(q.x) + '”<cite>' + esc(q.s) + ' · ' + esc(q.w) + '</cite></blockquote>';
    }).join('');
  }
  h += '<div class="ew-foot">Cifras FY2025 salvo que se indique. Fuentes: 10-K FY2025 (MD&A y notas) y los 8-K de 1T26 y 2T26, vía SEC EDGAR CIK 0000313616; comentarios de dirección, de los earnings calls.</div>';
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
    '<div class="exp-explorer"><div class="exp-explorer-h">Explorador de gastos — las tres líneas que Danaher publica, más la que no <span class="exp-hint">toca una línea para cambiar</span></div>' +
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
