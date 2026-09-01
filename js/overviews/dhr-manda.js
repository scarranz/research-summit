// dhr-manda.js — Danaher, Deep Dive ▸ Evolution ▸ M&A.
//
// Danaher is an acquirer before it is anything else, and its P&L only makes sense read that way:
// the ~$1.9B of annual intangible amortisation that separates GAAP from adjusted earnings is the
// accumulated price of this table. So this pane sits in Evolution, next to Guidance, rather than
// in Miscellaneous — it is part of how the company evolves, not a footnote.
//
// ── WHAT IS IN THE TABLE, AND WHAT IS DELIBERATELY NOT ────────────────────────────────────────
// The NINE platform deals, not all of them. Danaher has done scores of bolt-ons — the 10-Ks
// disclose them only in aggregate ("acquired three businesses for total consideration of $558
// million in cash, net of cash acquired") with no names, no prices and no multiples. Listing a
// bolt-on with blank columns would pad the table without informing it, so the bolt-on years are
// shown in the CHART, where they are the real bars they were, and named in the note.
//
// ── THE MULTIPLE COLUMN IS THE ONE THAT NEEDS CARE ────────────────────────────────────────────
// Three provenances, and the pane marks which is which on every row, because they are not
// interchangeable:
//   `co`   Danaher (or the target) stated the multiple in the deal announcement. The best kind.
//   `calc` Derived here: the announced enterprise value divided by a target revenue figure the
//          announcement itself gives. The arithmetic is shown so it can be checked.
//   `none` Not disclosed and not derivable — a private target that never published revenue. It
//          says "no divulgado" and stays empty. It is never estimated.
// A multiple with no source behind it would be the easiest thing in this pane to invent and the
// hardest for a reader to catch, which is exactly why each one carries its provenance chip.

import { dStdScaffold, dStdRender, dWireTables, D_ACT, D_ADJ, D_REF, D_UP, D_DOWN, D_NEUT } from './dhr-chartkit.js';
import { A } from './dhr-bottomline.js';

var BRAND = '#0F7DC2', BRAND2 = '#1E3A5F', GRAY = '#9AA4B0', AMBER = '#B7791F', GREEN = '#2E8B57', PURPLE = '#7A5AF8';
function esc(s){ if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// Segment colours match the rest of the Danaher tab.
var SEG = {
  bio: { n:'Biotechnology', c:BRAND },
  ls:  { n:'Life Sciences', c:GREEN },
  dx:  { n:'Diagnostics',   c:PURPLE },
  mix: { n:'Dx + Life Sci', c:GRAY }
};

// ═══ The platform deals ═══════════════════════════════════════════════════════════════════════
// `ev` in $M. `mult` is what is shown; `multSrc` is its provenance (see the header).
var DEALS = [
  { co:'Masimo', closed:'jun-2026', year:2026, ev:9900, evLab:'~$9.9B EV', seg:'dx',
    mult:'~18× EBITDA 2027E', multSrc:'co', multNote:'15× incluyendo el beneficio pleno de las sinergias anuales esperadas. Cifra de Danaher en el anuncio del 17-feb-2026. $180.00 por acción.',
    prod:'Oximetría de pulso y monitoreo de paciente', prodX:'Cuidado agudo. ~$1.5B de ventas. Es la primera vez que Danaher compra un negocio de dispositivo médico de cabecera y no de laboratorio.',
    flag:'El más reciente. Cerró antes de lo previsto y llevó la deuda neta de $13.8B a $22.2B.' },

  { co:'StatLab', closed:'pendiente', year:2026, ev:null, evLab:'no divulgado', seg:'dx',
    mult:'no divulgado', multSrc:'none',
    prod:'Consumibles de histología', prodX:'~$250M de ventas 2025 y <b>más de 85% de ingreso recurrente</b>. Entra por Leica Biosystems. Danaher espera crecimiento de high-single digit a largo plazo y que sea accretiva al primer año completo.',
    flag:'Anunciada en julio de 2026, sujeta a aprobaciones. Aún no aparece en ningún 10-K ni 10-Q.' },

  { co:'Abcam', closed:'dic-2023', year:2023, ev:5700, evLab:'$5.7B', seg:'ls',
    mult:'7.9× ventas · 22.7× EBITDA', multSrc:'co', multNote:'Ambos sobre CY2023. $24.00 por acción.',
    prod:'Anticuerpos y reactivos de investigación', prodX:'Catálogo de consumibles para investigación, con marca propia y venta directa. En 2T26 la dirección lo nombró como "su mejor trimestre desde la adquisición".',
    flag:'El múltiplo más alto sobre EBITDA de la lista.' },

  { co:'Aldevron', closed:'ago-2021', year:2021, ev:9600, evLab:'$9.6B', seg:'bio',
    mult:'~32× ventas 2020', multSrc:'calc', multNote:'$9.6B ÷ ~$300M de ventas 2020. Danaher no publicó múltiplo; la cifra de ventas es la del anuncio.',
    prod:'ADN plasmídico, ARNm y proteínas', prodX:'Insumos de grado GMP para terapias génicas y celulares y para vacunas de ARNm. Comprado a EQT en el pico del ciclo post-COVID.',
    flag:'Comprado en 2021, cuando el mercado de bioprocessing pagaba múltiplos que no volvieron.' },

  { co:'Cytiva (GE Biopharma)', closed:'mar-2020', year:2020, ev:21400, evLab:'$21.4B', seg:'bio',
    mult:'~17× EBITDA 2019E', multSrc:'co', multNote:'Cifra de Danaher. Precio neto ~$20B después de beneficios fiscales esperados ⇒ ~6.7× sobre ~$3.2B de ventas, con ~75% de ingreso recurrente.',
    prod:'Bioprocessing: equipos y consumibles', prodX:'Resinas de cromatografía, filtración, sistemas de un solo uso. Es el corazón del segmento Biotechnology y el origen de los envíos de resina que se difirieron a 2027.',
    flag:'La operación más grande de la historia de Danaher, y la que define el segmento Biotechnology.' },

  { co:'Integrated DNA Technologies (IDT)', closed:'abr-2018', year:2018, ev:2100, evLab:'~$2.1B neto de caja', seg:'ls',
    mult:'no divulgado', multSrc:'none', multNote:'IDT era privada y no publicaba ingresos; el precio tampoco se divulgó en el anuncio inicial.',
    prod:'ADN sintético y oligonucleótidos', prodX:'Consumibles de alto valor para genómica. Fabricación por encargo de oligos para investigación, diagnóstico y terapias.',
    flag:'' },

  { co:'Cepheid', closed:'nov-2016', year:2016, ev:4000, evLab:'~$4.0B', seg:'dx',
    mult:'~6.3–6.5× ventas 2016E', multSrc:'calc', multNote:'~$4.0B ÷ los $618–635M que Cepheid guiaba para 2016 (ventas 2015: $539M). $53.00 por acción, incluyendo deuda y neto de caja adquirida.',
    prod:'Diagnóstico molecular — GeneXpert', prodX:'Plataforma de PCR en punto de atención con cartuchos cerrados. Es el negocio que hace las pruebas respiratorias — los ~$1.6B que hoy son el mayor swing factor de la guía.',
    flag:'Sin esta compra no existiría el problema del respiratorio, ni el auge de 2020–2022.' },

  { co:'Pall Corporation', closed:'ago-2015', year:2015, ev:13800, evLab:'$13.8B', seg:'ls',
    mult:'~18× EBITDA · ~4.9× ventas', multSrc:'calc', multNote:'El múltiplo de EBITDA (~18×) es el que reportó la prensa financiera en el anuncio; el de ventas es $13.8B ÷ $2.8B de ingresos del ejercicio cerrado en julio de 2014. $127.20 por acción.',
    prod:'Filtración, separación y purificación', prodX:'Consumibles de filtración para biofarma e industria. Es el negocio de "applied filtration" que en 2T26 creció ~10% empujado por microelectrónica de semiconductores.',
    flag:'' },

  { co:'Beckman Coulter', closed:'jun-2011', year:2011, ev:6800, evLab:'~$6.8B EV', seg:'mix',
    mult:'~1.8× ventas', multSrc:'calc', multNote:'~$6.8B de valor de empresa ÷ ~$3.7B de ingresos anuales. $83.50 por acción, incluyendo deuda asumida y neto de caja. El anuncio no dio múltiplo de EBITDA.',
    prod:'Diagnóstico clínico e instrumentos de laboratorio', prodX:'Química clínica, inmunoensayo, hematología y automatización de laboratorio. Se reparte hoy entre Diagnostics y Life Sciences.',
    flag:'El múltiplo más bajo de la lista, y con diferencia — otra época y otro tipo de activo.' }
];

// ═══ Capital deployed ═════════════════════════════════════════════════════════════════════════
// The `acq` line of the cash flow statement, read through dhr-bottomline.js so it keeps one home.
// FY2026 is the Bloomberg consensus figure, which is essentially the Masimo cheque — it is an
// ESTIMATE and the chart fades it like every other forward bar.
var Y2026E = 9855;

function acqSeries(){
  var years = A.map(function(a){ return a.y; }).concat([2026]);
  var vals  = A.map(function(a){ return a.acq == null ? null : a.acq; }).concat([Y2026E]);
  return { labels: years.map(String), vals: vals, lastAct: A.length - 1 };
}

// ═══ Style ════════════════════════════════════════════════════════════════════════════════════
function style(){
  return '<style>' + [
    '.dma .dma-lede{font-size:12.5px;line-height:1.65;color:var(--mu);margin:0 0 18px}',
    '.dma .dma-lede b{color:var(--navy)}',
    '.dma .ov-sec-h{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);margin:26px 0 10px;display:flex;align-items:center;gap:9px}',
    '.dma .ov-sec-h:first-child{margin-top:0}',
    '.dma .ov-sec-h::after{content:"";flex:1;height:1px;background:var(--bdr)}',
    '.dma .dma-sub{font-size:11.5px;color:var(--mu);line-height:1.6;margin:0 0 12px}',
    '.dma .dma-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:9px;margin:0 0 18px}',
    '.dma .dma-tile{border:1px solid var(--bdr);border-radius:11px;padding:11px 13px;background:var(--w)}',
    '.dma .dma-tv{font-size:20px;font-weight:800;color:var(--navy);line-height:1.15;letter-spacing:-.01em}',
    '.dma .dma-tl{font-size:9.5px;font-weight:800;letter-spacing:.045em;text-transform:uppercase;color:var(--mu);margin-top:5px;line-height:1.4}',
    '.dma .dma-tn{font-size:10.5px;color:var(--mu);margin-top:5px;line-height:1.5}',
    /* segment filter */
    '.dma .dma-filter{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 12px}',
    '.dma .dma-fl{font-size:9.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--mu);margin-right:3px}',
    '.dma .dma-chip{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--bdr);background:#fff;border-radius:999px;padding:5px 12px;cursor:pointer;font:inherit;font-size:11px;font-weight:800;color:var(--navy);transition:.13s}',
    '.dma .dma-chip:hover{border-color:' + BRAND + '}',
    '.dma .dma-chip.off{opacity:.4}',
    '.dma .dma-dot{width:9px;height:9px;border-radius:3px;flex:none}',
    /* deal cards */
    '.dma .dma-deal{border:1px solid var(--bdr);border-left:3px solid var(--bdr);border-radius:11px;padding:13px 15px;margin-bottom:9px;background:var(--w)}',
    '.dma .dma-deal[hidden]{display:none}',
    '.dma .dma-dh{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:3px}',
    '.dma .dma-dn{font-size:14px;font-weight:800;color:var(--navy)}',
    '.dma .dma-dd{font-size:10px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--mu)}',
    '.dma .dma-seg{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;border-radius:999px;padding:2px 8px;color:#fff}',
    '.dma .dma-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:10px}',
    '.dma .dma-f{border-top:1px solid var(--bdr);padding-top:8px}',
    '.dma .dma-fk{font-size:9px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:' + GRAY + ';margin-bottom:4px}',
    '.dma .dma-fv{font-size:12.5px;font-weight:800;color:var(--navy);line-height:1.35}',
    '.dma .dma-fx{font-size:10.5px;color:var(--mu);line-height:1.55;margin-top:4px}',
    '.dma .dma-fx b{color:var(--navy)}',
    '.dma .dma-prov{font-size:8px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;border-radius:999px;padding:1px 6px;margin-left:6px;white-space:nowrap;vertical-align:middle}',
    '.dma .dma-prov.co{color:' + GREEN + ';background:rgba(46,139,87,.10);border:1px solid rgba(46,139,87,.30)}',
    '.dma .dma-prov.calc{color:' + AMBER + ';background:rgba(183,121,31,.10);border:1px solid rgba(183,121,31,.30)}',
    '.dma .dma-prov.none{color:' + GRAY + ';background:#F2F5F8;border:1px solid var(--bdr)}',
    '.dma .dma-flag{font-size:11px;color:var(--navy);background:rgba(15,125,194,.055);border:1px solid rgba(15,125,194,.22);border-radius:8px;padding:7px 10px;margin-top:10px;line-height:1.55}',
    '.dma .dma-legend{font-size:10.5px;color:var(--mu);line-height:1.65;margin:0 0 14px}',
    '.dma .dma-foot{font-size:10.5px;color:' + GRAY + ';line-height:1.6;margin-top:20px;padding-top:12px;border-top:1px solid var(--bdr)}',
    '.dma .dma-none{font-size:11.5px;color:' + GRAY + ';font-style:italic;padding:14px 0}'
  ].join('') + '</style>';
}

var PROV = { co:['fuente: la empresa','co'], calc:['derivado aquí','calc'], none:['no divulgado','none'] };

function dealCard(d){
  var s = SEG[d.seg];
  var h = '<div class="dma-deal" data-dmadeal="' + d.seg + '" style="border-left-color:' + s.c + '">' +
    '<div class="dma-dh"><span class="dma-dn">' + esc(d.co) + '</span>' +
    '<span class="dma-seg" style="background:' + s.c + '">' + esc(s.n) + '</span>' +
    '<span class="dma-dd">' + esc(d.closed) + '</span></div>' +
    '<div class="dma-grid">' +
      '<div class="dma-f"><div class="dma-fk">Precio</div><div class="dma-fv">' + esc(d.evLab) + '</div></div>' +
      '<div class="dma-f"><div class="dma-fk">Múltiplo pagado</div><div class="dma-fv">' + esc(d.mult) +
        '<span class="dma-prov ' + PROV[d.multSrc][1] + '">' + PROV[d.multSrc][0] + '</span></div>' +
        (d.multNote ? '<div class="dma-fx">' + d.multNote + '</div>' : '') + '</div>' +
      '<div class="dma-f"><div class="dma-fk">Qué hace</div><div class="dma-fv">' + esc(d.prod) + '</div>' +
        '<div class="dma-fx">' + d.prodX + '</div></div>' +
    '</div>';
  if (d.flag) h += '<div class="dma-flag">' + d.flag + '</div>';
  return h + '</div>';
}

export function dhrMandaHtml(){
  if (!A || !A.length) return '';                    // rule 6 — nothing, never broken
  var total = A.reduce(function(t, a){ return t + (a.acq || 0); }, 0) + Y2026E;
  return style() + '<div class="dma">' +
    '<p class="dma-lede"><b>Danaher es un adquirente antes que cualquier otra cosa</b>, y su estado de resultados sólo se entiende leído así: los ~$1.9B anuales de amortización de intangibles que separan el GAAP del ajustado son el precio acumulado de esta tabla. Aquí están las <b>nueve operaciones de plataforma</b> — no todas: Danaher ha hecho decenas de compras pequeñas que los 10-K divulgan sólo en agregado, sin nombre ni precio ni múltiplo. Esas viven en el gráfico, que es donde son las barras que realmente fueron.</p>' +

    '<div class="dma-strip">' +
      '<div class="dma-tile"><div class="dma-tv">$' + (total / 1000).toFixed(1) + 'B</div><div class="dma-tl">Efectivo en adquisiciones, 2016–2026E</div><div class="dma-tn">De la línea del flujo de efectivo, no de los precios anunciados.</div></div>' +
      '<div class="dma-tile"><div class="dma-tv">9</div><div class="dma-tl">Operaciones de plataforma</div><div class="dma-tn">De 2011 a hoy. Una está pendiente de cerrar.</div></div>' +
      '<div class="dma-tile"><div class="dma-tv">$21.4B</div><div class="dma-tl">La más grande — Cytiva, 2020</div><div class="dma-tn">Define el segmento Biotechnology entero.</div></div>' +
      '<div class="dma-tile"><div class="dma-tv">~1.8× → ~32×</div><div class="dma-tl">Rango de múltiplos de ventas</div><div class="dma-tn">Beckman en 2011 contra Aldevron en 2021. No son comparables entre sí.</div></div>' +
      '<div class="dma-tile"><div class="dma-tv">$22.2B</div><div class="dma-tl">Deuda neta a jun-2026</div><div class="dma-tn">Desde $13.8B antes de Masimo. ~2.5× deuda neta/EBITDA.</div></div>' +
      '<div class="dma-tile"><div class="dma-tv">~$1.9B</div><div class="dma-tl">Amortización anual resultante</div><div class="dma-tn">Guía FY2026. Es la factura contable de todo lo de arriba.</div></div>' +
    '</div>' +

    '<div class="ov-sec-h">Efectivo desplegado en adquisiciones, por año</div>' +
    '<p class="dma-sub">Es la línea <i>Acquisitions of businesses</i> del estado de flujo de efectivo, así que recoge también las compras pequeñas que no tienen ficha abajo: <b>2022</b> son siete negocios por $582M y <b>2024</b> son tres por $558M, sin nombre en el filing. Pall (2015) queda fuera del gráfico porque la serie arranca en 2016. <b>2025 fue cero</b> — el único año en blanco de la década, justo antes de Masimo.</p>' +
    dStdScaffold({ id:'dhrAcq', title:'Efectivo pagado por adquisiciones ($M)', height:300,
      metricSel:[{ v:'acq', label:'Efectivo pagado por adquisiciones', on:true }],
      presets:[['all','Todo'],['l5','Últimos 5'],['big','Sólo años de plataforma']],
      note:'FY2016–FY2025 del flujo de efectivo de Danaher, neto de caja adquirida. <b>FY2026 es estimación</b> (consenso Bloomberg), y es esencialmente el cheque de Masimo.' }) +

    '<div class="ov-sec-h">Las operaciones de plataforma</div>' +
    '<p class="dma-legend"><b>Sobre la columna de múltiplo</b>, que es la que hay que leer con cuidado. ' +
      '<span class="dma-prov co">fuente: la empresa</span> el múltiplo lo dijo Danaher en el anuncio. ' +
      '<span class="dma-prov calc">derivado aquí</span> es el valor de empresa anunciado dividido entre una cifra de ventas que el propio anuncio da — la aritmética está escrita para que se pueda revisar. ' +
      '<span class="dma-prov none">no divulgado</span> ni se divulgó ni se puede derivar, y se queda vacío en vez de estimarse. ' +
      'Los múltiplos de años distintos <b>no son comparables entre sí</b>: 2011 y 2021 son dos mercados diferentes.</p>' +
    '<div class="dma-filter"><span class="dma-fl">Segmento</span>' +
      Object.keys(SEG).map(function(k){
        return '<button type="button" class="dma-chip" data-dmaseg="' + k + '"><span class="dma-dot" style="background:' + SEG[k].c + '"></span>' + esc(SEG[k].n) + '</button>';
      }).join('') + '</div>' +
    '<div id="dmaDeals">' + DEALS.map(dealCard).join('') + '</div>' +
    '<div class="dma-none" id="dmaNone" hidden>Ningún segmento seleccionado — vuelve a activar al menos uno.</div>' +

    '<p class="dma-foot">Precios y fechas: comunicados de Danaher y de las empresas adquiridas, más los 8-K/10-K correspondientes (SEC EDGAR, CIK 0000313616). Serie de efectivo: estado de flujo de efectivo consolidado, FY2016–FY2025. Los múltiplos llevan su procedencia marcada uno a uno; ninguno está estimado.</p>' +
  '</div>';
}

// ═══ Init ═════════════════════════════════════════════════════════════════════════════════════
function acqDerive(st){
  var s = acqSeries(), n = s.labels.length;
  var pr = st.range || 'all', lo = 0, hi = n - 1;
  if (pr === 'l5') lo = Math.max(0, n - 5);
  st.win = (st.win && st.win[0] >= lo && st.win[1] <= hi) ? st.win : [lo, hi];
  var vals = s.vals.slice();
  if (pr === 'big') vals = vals.map(function(v){ return (v != null && v >= 2000) ? v : null; });
  return {
    labels: s.labels.slice(), lastAct: s.lastAct,
    series: [{ k:'acq', grp:'acq', src:'Efectivo en adquisiciones', label:'Efectivo pagado por adquisiciones ($M)', color:D_ACT, type:'bar', data:vals }],
    yFmt: function(v){ return '$' + Math.round(v).toLocaleString('en-US') + 'M'; },
    tblTitle:'Datos — lo que dibuja el gráfico',
    legNote:'La barra clara (FY2026) es estimación.'
  };
}

export function dhrMandaInit(pane){
  var root = pane && pane.querySelector ? pane.querySelector('.dma') : null;
  if (!root) return;
  dStdRender('dhrAcq', acqDerive, root);
  if (root._dmaWired) return;
  root._dmaWired = true;
  dWireTables(root);
  var off = {};
  root.addEventListener('click', function(e){
    var b = e.target.closest ? e.target.closest('[data-dmaseg]') : null;
    if (!b || !root.contains(b)) return;
    var k = b.getAttribute('data-dmaseg');
    off[k] = !off[k];
    b.classList.toggle('off', !!off[k]);
    var shown = 0;
    root.querySelectorAll('[data-dmadeal]').forEach(function(d){
      var hide = !!off[d.getAttribute('data-dmadeal')];
      d.hidden = hide; if (!hide) shown++;
    });
    // rule 6 again — an empty list says so rather than rendering as a blank gap.
    var none = root.querySelector('#dmaNone'); if (none) none.hidden = shown > 0;
  });
}
