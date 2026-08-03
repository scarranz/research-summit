// overviews/hyperscalers-industry.js — "Hyperscalers" industry analysis.
//
// The question this dashboard answers: HOW HAS AI CAPEX AND ITS GUIDANCE MOVED,
// call by call, across AMZN / GOOGL / META / MSFT since 2024 — and how much of the
// reported number is real investment versus accounting.
//
// Five tabs, built incrementally (same approach as payments-industry.js):
//   1 Escalera de Guidance — every revision, dated to the call that made it   ✅
//   2 CapEx Trimestral     — reported quarterly spend + why the bases differ  ✅
//   3 Backlog y Cobertura  — the only externally verifiable demand proof      ✅
//   4 Contabilidad         — the useful-life & off-balance-sheet changes      ✅
//   5 Cuello de Botella    — chips → energía → memoria                        ✅
//
// Pure presentation + Chart.js. Data (and its sourcing rules) live in
// hyperscalers-data.js. Rendered in-document inside Industry Analysis.
//
// CHART RULES followed here (data-viz method): one y-axis per chart — never dual;
// validated categorical palette in fixed order, colour follows the company and
// never its rank; 2px lines, 8px markers; legend always present for ≥2 series AND
// end-of-line direct labels (mandatory relief — Meta's aqua is 2.82:1 on white);
// a table view accompanies every chart; recessive grid; hover crosshair+tooltip.

import {
  HS_COMPANIES, HS_VINTAGES, HS_GUIDE, HS_QUARTERLY, HS_BASIS,
  HS_BACKLOG, HS_BACKLOG_NOTES, HS_ACCOUNTING, HS_BOTTLENECK,
} from './hyperscalers-data.js';

function esc(s){ if (s == null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function co(id){ return HS_COMPANIES.filter(function(c){ return c.id === id; })[0]; }
const LABELS = HS_VINTAGES.map(function(v){ return v.label; });

// Chart chrome — recessive, portal-native.
const INK_MUTED = '#8A93A0';
const GRID      = '#EEF1F5';
const AXIS      = '#D7DDE4';

let _state = { tab: 'ladder', guideYear: '2026', backView: 'abs', charts: {} };

// ── Direct end-of-line labels ────────────────────────────────────────────────
// The legend carries identity, but the relief rule (aqua under 3:1 on white)
// requires identity NOT to rest on colour alone — so each line is also named at
// its last real point. Labels only, never a value on every point.
const endLabels = {
  id: 'hsEndLabels',
  afterDatasetsDraw: function(chart){
    const ctx = chart.ctx;
    ctx.save();
    ctx.font = '600 11px Inter, sans-serif';
    ctx.textBaseline = 'middle';
    const placed = [];
    chart.data.datasets.forEach(function(ds, di){
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden) return;
      let last = -1;
      ds.data.forEach(function(v, i){ if (v != null) last = i; });
      if (last < 0 || !meta.data[last]) return;
      const pt = meta.data[last];
      let y = pt.y;
      // nudge apart if two lines end within 12px of each other
      placed.forEach(function(py){ if (Math.abs(y - py) < 12) y = py + 12; });
      placed.push(y);
      ctx.fillStyle = ds.borderColor;
      ctx.textAlign = 'left';
      const x = Math.min(pt.x + 8, chart.chartArea.right + 4);
      ctx.fillText(ds.label, x, y);
    });
    ctx.restore();
  },
};

// Crop the x-axis to the stretch that actually carries data, keeping ONE empty
// column of run-up so "nobody had said anything yet" stays visible. Without this
// the CY2026 guide chart spends two-thirds of its width on empty quarters.
function window_(series){
  let lo = Infinity, hi = -Infinity;
  series.forEach(function(s){
    (s.data || []).forEach(function(v, i){ if (v != null){ if (i < lo) lo = i; if (i > hi) hi = i; } });
  });
  if (lo === Infinity) return { lo: 0, hi: HS_VINTAGES.length - 1 };
  return { lo: Math.max(0, lo - 1), hi: Math.min(HS_VINTAGES.length - 1, hi + 1) };
}

// ── Shared line chart ────────────────────────────────────────────────────────
// series: [{ id, data:[…] }]. `unit` formats ticks/tooltips. Gaps are spanned so
// a line survives a call that stated nothing, but markers only appear on real
// statements — the reader can always see which points were actually said.
function lineChart(canvasId, series, unit, yTitle){
  const el = document.getElementById(canvasId);
  if (!el || !el.offsetParent || _state.charts[canvasId]) return;
  // A series with nothing to plot gets no legend entry — an entry with no line
  // reads as "missing data" when the real reason is that the company never
  // guides on this basis (Microsoft, on a calendar year). The prose says why.
  series = series.filter(function(s){ return (s.data || []).some(function(v){ return v != null; }); });
  if (!series.length) return;
  const win = window_(series);
  const labels = LABELS.slice(win.lo, win.hi + 1);
  const vints = HS_VINTAGES.slice(win.lo, win.hi + 1);
  series = series.map(function(s){ return { id: s.id, data: s.data.slice(win.lo, win.hi + 1) }; });
  const fmt = function(v){
    if (v == null) return '—';
    return unit === 'x' ? (Math.round(v * 100) / 100) + '×' : '$' + (Math.round(v * 10) / 10) + 'B';
  };
  const datasets = series.map(function(s){
    const c = co(s.id);
    return {
      label: c.ticker,
      data: s.data,
      borderColor: c.color,
      backgroundColor: c.color,
      borderWidth: 2,
      spanGaps: true,
      tension: 0.25,
      pointRadius: function(ctx){ return ctx.raw == null ? 0 : 4.5; },
      pointHoverRadius: 6.5,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    };
  });
  _state.charts[canvasId] = new Chart(el.getContext('2d'), {
    type: 'line',
    data: { labels: labels, datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      // Reference charts, not marketing: render final-state immediately. Also
      // makes the view deterministic (a throttled rAF in a background tab can
      // otherwise leave the entry animation frozen part-way).
      animation: false,
      layout: { padding: { right: 54, top: 8 } },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', align: 'start',
          labels: { boxWidth: 8, boxHeight: 8, usePointStyle: true, pointStyle: 'circle',
                    color: '#1E2733', font: { size: 12, family: 'Inter', weight: '500' }, padding: 16 } },
        tooltip: {
          backgroundColor: '#1E2733', padding: 10, cornerRadius: 6, displayColors: true,
          boxWidth: 8, boxHeight: 8, usePointStyle: true,
          titleFont: { size: 12, family: 'Inter' }, bodyFont: { size: 12, family: 'Inter' },
          callbacks: {
            title: function(items){
              const v = vints[items[0].dataIndex];
              return v.label + ' — calls ' + v.calls + ' (MSFT ' + v.msft + ')';
            },
            label: function(c){ return c.dataset.label + ': ' + fmt(c.raw); },
          },
        },
      },
      scales: {
        x: { grid: { display: false }, border: { color: AXIS },
             ticks: { color: INK_MUTED, font: { size: 11, family: 'Inter' } } },
        y: { title: { display: !!yTitle, text: yTitle, color: INK_MUTED, font: { size: 11, family: 'Inter' } },
             grid: { color: GRID, drawTicks: false }, border: { display: false },
             ticks: { color: INK_MUTED, font: { size: 11, family: 'Inter' }, padding: 8,
                      callback: function(v){ return unit === 'x' ? v + '×' : '$' + v + 'B'; } } },
      },
    },
    plugins: [endLabels],
  });
}

function destroyCharts(){
  Object.keys(_state.charts).forEach(function(k){
    if (_state.charts[k]) { _state.charts[k].destroy(); delete _state.charts[k]; }
  });
}

// A table view for every chart — required, not decorative: it is the fallback
// that makes the sub-3:1 series legible and the gaps explicit.
function dataTable(rows, head){
  return '<div class="hs-tablewrap"><table class="hs-table"><thead><tr>' +
    head.map(function(h, i){ return '<th' + (i ? ' class="num"' : '') + '>' + esc(h) + '</th>'; }).join('') +
    '</tr></thead><tbody>' + rows.map(function(r){
      return '<tr>' + r.map(function(c, i){
        return '<td' + (i ? ' class="num"' : '') + '>' + (c == null ? '<span class="hs-na">—</span>' : c) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody></table></div>';
}

function dot(id){ return '<span class="hs-dot" style="background:' + co(id).color + '"></span>'; }

// ── Tab 1 · Escalera de Guidance ─────────────────────────────────────────────
function ladderTab(){
  const pills = HS_GUIDE.map(function(g){
    return '<button type="button" class="hs-pill' + (g.year === _state.guideYear ? ' active' : '') +
      '" data-year="' + g.year + '">' + esc(g.label) + '</button>';
  }).join('');
  const g = HS_GUIDE.filter(function(x){ return x.year === _state.guideYear; })[0];

  const rows = HS_COMPANIES.map(function(c){
    const r = g.resolve[c.id] || {};
    const chg = (r.first != null && r.last != null && r.first !== 0)
      ? ((r.last - r.first) / r.first * 100) : null;
    const chgHtml = chg == null ? null
      : '<span class="' + (chg > 0 ? 'hs-up' : chg < 0 ? 'hs-dn' : '') + '">' +
        (chg > 0 ? '+' : '') + chg.toFixed(0) + '%</span>';
    return [
      dot(c.id) + c.ticker,
      r.first != null ? '$' + r.first + 'B' : null,
      r.last  != null ? '$' + r.last  + 'B' : null,
      chgHtml,
      r.actual != null ? '$' + r.actual + 'B' + (r.d ? ' <span class="hs-flag">der.</span>' : '') : null,
    ];
  });

  const notes = HS_COMPANIES.map(function(c){
    const r = g.resolve[c.id]; if (!r || !r.src) return '';
    return '<li>' + dot(c.id) + '<b>' + c.ticker + '</b> · ' + r.src + '</li>';
  }).join('');

  return '<div class="hs-tab">' +
    '<p class="hs-lede">' + esc(g.blurb) + '</p>' +
    '<div class="hs-pills">' + pills + '</div>' +
    '<div class="hs-card">' +
      '<div class="hs-charthead"><h4>Guía de CapEx para ' + esc(g.year) + ', revisión por revisión</h4>' +
        '<span class="hs-unit">US$B · punto medio del rango guiado</span></div>' +
      '<div class="hs-canvas"><canvas id="hs-ladder"></canvas></div>' +
      '<p class="hs-cap">Cada punto es una guía efectivamente enunciada en esa call. La línea cruza los trimestres en que no se dio número anual — no es interpolación, es continuidad visual.' +
      (_state.guideYear === '2025'
        ? ' <b>Microsoft no aparece</b> porque no guía por año calendario: su primer número calendario es el de CY2026.'
        : '') +
      '</p>' +
    '</div>' +
    '<div class="hs-card">' +
      '<h4>De la primera guía al desenlace</h4>' +
      dataTable(rows, ['', 'Primera guía', 'Última guía', 'Δ', 'Real / última']) +
      '<ul class="hs-src">' + notes + '</ul>' +
    '</div>' +
  '</div>';
}

// ── Tab 2 · CapEx trimestral ─────────────────────────────────────────────────
function quarterlyTab(){
  const rows = HS_COMPANIES.map(function(c){
    return [dot(c.id) + c.ticker].concat(HS_QUARTERLY[c.id].map(function(v){
      return v == null ? null : '$' + v + 'B';
    }));
  });
  const basis = HS_BASIS.map(function(b){
    return '<li>' + dot(b.id) + '<b>' + co(b.id).ticker + '</b> — <b>' + esc(b.basis) + '.</b> ' + esc(b.note) + '</li>';
  }).join('');

  return '<div class="hs-tab">' +
    '<p class="hs-lede">El gasto efectivamente reportado. Se ve el quiebre: hasta mediados de 2025 las cuatro series corren juntas y bajas; a partir de ahí se abren en abanico.</p>' +
    '<div class="hs-card">' +
      '<div class="hs-charthead"><h4>CapEx reportado por trimestre</h4>' +
        '<span class="hs-unit">US$B · eje calendario</span></div>' +
      '<div class="hs-canvas"><canvas id="hs-qtr"></canvas></div>' +
      '<p class="hs-cap">Los huecos son huecos: la call no dio el número (Alphabet 2Q24 no está en el corpus). Nada está interpolado.</p>' +
    '</div>' +
    '<div class="hs-card hs-warn">' +
      '<h4>Por qué estas cuatro series no se pueden apilar</h4>' +
      '<ul class="hs-src">' + basis + '</ul>' +
    '</div>' +
    '<div class="hs-card">' +
      '<h4>Tabla</h4>' +
      dataTable(rows, [''].concat(LABELS)) +
    '</div>' +
  '</div>';
}

// ── Tab 3 · Backlog y cobertura ──────────────────────────────────────────────
// Deliberately NOT a dual-axis "backlog vs capex" chart. Two measures on two
// scales in one frame is the single most misleading chart form there is, so the
// relationship is expressed as a ratio on ONE axis instead: how many years of
// current spend the contracted book already covers.
function coverage(id){
  return HS_BACKLOG[id].map(function(b, i){
    const q = HS_QUARTERLY[id][i];
    if (b == null || q == null || !q) return null;
    return b / (q * 4);
  });
}
function backlogTab(){
  const abs = _state.backView === 'abs';
  const withBook = ['googl', 'amzn', 'msft'];
  const rows = withBook.map(function(id){
    const src = abs ? HS_BACKLOG[id] : coverage(id);
    return [dot(id) + co(id).ticker].concat(src.map(function(v){
      return v == null ? null : (abs ? '$' + v + 'B' : (Math.round(v * 100) / 100) + '×');
    }));
  });

  return '<div class="hs-tab">' +
    '<p class="hs-lede">La única prueba externa de que el gasto está vendido. Meta no aparece: no vende capacidad contratada, y esa ausencia es el hallazgo.</p>' +
    '<div class="hs-pills">' +
      '<button type="button" class="hs-pill' + (abs ? ' active' : '') + '" data-back="abs">Backlog contratado</button>' +
      '<button type="button" class="hs-pill' + (!abs ? ' active' : '') + '" data-back="cov">Cobertura del gasto</button>' +
    '</div>' +
    '<div class="hs-card">' +
      '<div class="hs-charthead"><h4>' + (abs ? 'Backlog / RPO contratado' : 'Años de CapEx cubiertos por el backlog') + '</h4>' +
        '<span class="hs-unit">' + (abs ? 'US$B' : 'backlog ÷ CapEx anualizado del trimestre') + '</span></div>' +
      '<div class="hs-canvas"><canvas id="hs-back"></canvas></div>' +
      '<p class="hs-cap">' + (abs
        ? 'Alphabet “Cloud backlog”, Amazon “backlog”, Microsoft “commercial RPO”. No son definiciones idénticas.'
        : 'Ratio derivado: backlog ÷ (CapEx del trimestre × 4). Un mismo eje en vez de superponer dos escalas distintas.') +
      '</p>' +
    '</div>' +
    '<div class="hs-card hs-warn">' +
      '<h4>Lo que el número no dice</h4>' +
      '<ul class="hs-src">' + HS_BACKLOG_NOTES.map(function(n){ return '<li>' + n + '</li>'; }).join('') + '</ul>' +
    '</div>' +
    '<div class="hs-card"><h4>Tabla</h4>' + dataTable(rows, [''].concat(LABELS)) + '</div>' +
  '</div>';
}

// ── Tab 4 · Contabilidad ─────────────────────────────────────────────────────
function accountingTab(){
  const rows = HS_ACCOUNTING.map(function(a){
    return '<tr>' +
      '<td class="hs-when">' + esc(a.when) + '</td>' +
      '<td>' + dot(a.who) + '<b>' + co(a.who).ticker + '</b></td>' +
      '<td>' + esc(a.what) + '</td>' +
      '<td class="hs-eff"><span class="hs-' + (a.effect === '+' ? 'up' : 'dn') + '">' +
        (a.effect === '+' ? 'favorable' : 'adverso') + '</span></td>' +
      '<td class="hs-imp">' + esc(a.impact) + '</td>' +
    '</tr>';
  }).join('');

  return '<div class="hs-tab">' +
    '<p class="hs-lede">Siete cambios en dos años y medio. Seis mueven el número reportado en la dirección favorable. Ninguno es irregular — y precisamente por eso hay que leerlos juntos.</p>' +
    '<div class="hs-card">' +
      '<div class="hs-tablewrap"><table class="hs-table hs-acct"><thead><tr>' +
        '<th>Fecha</th><th></th><th>Cambio</th><th>Efecto</th><th>Impacto declarado</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '</div>' +
    '<div class="hs-card hs-warn">' +
      '<h4>La consecuencia práctica</h4>' +
      '<p class="hs-body">El CapEx reportado dejó de ser comparable entre las cuatro y a lo largo del tiempo dentro de cada una. ' +
      'El caso más nítido: el CapEx CY2026 de Microsoft baja de ~$190B a ~$175B <b>sin que cambie un dólar de inversión</b> — ' +
      'es el reclasificado de leases financieros a operativos que arrastra la extensión de vida útil. ' +
      'Cualquier gráfico que apile las cuatro series tal como se publican está midiendo, en parte, decisiones contables.</p>' +
    '</div>' +
  '</div>';
}

// ── Tab 5 · Cuello de botella ────────────────────────────────────────────────
function bottleneckTab(){
  const items = HS_BOTTLENECK.map(function(b, i){
    return '<li class="hs-step">' +
      '<span class="hs-stepn">' + (i + 1) + '</span>' +
      '<div><div class="hs-stephead"><b>' + esc(b.label) + '</b>' +
        '<span class="hs-period">' + esc(b.period) + '</span></div>' +
        '<p class="hs-body">' + esc(b.quote) + '</p></div>' +
    '</li>';
  }).join('');
  return '<div class="hs-tab">' +
    '<p class="hs-lede">El límite se movió tres veces. Importa porque cada traslado cambia quién captura el margen — y en 2026 el que sube la factura es el proveedor de memoria, no el de cómputo.</p>' +
    '<div class="hs-card"><ol class="hs-steps">' + items + '</ol></div>' +
  '</div>';
}

// ── Shell ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'ladder',  label: 'Escalera de Guidance', render: ladderTab },
  { id: 'qtr',     label: 'CapEx Trimestral',     render: quarterlyTab },
  { id: 'backlog', label: 'Backlog y Cobertura',  render: backlogTab },
  { id: 'acct',    label: 'Contabilidad',         render: accountingTab },
  { id: 'neck',    label: 'Cuello de Botella',    render: bottleneckTab },
];

function paint(){
  const host = document.getElementById('hs-body');
  if (!host) return;
  destroyCharts();
  const tab = TABS.filter(function(t){ return t.id === _state.tab; })[0];
  host.innerHTML = tab.render();
  // Built synchronously, not on rAF: layout is already resolvable right after the
  // innerHTML assignment, and rAF is throttled to never in a background tab —
  // which would leave the pane chart-less until the user re-clicked.
  build();
}

function build(){
  if (typeof Chart === 'undefined') return;
  if (_state.tab === 'ladder'){
    const g = HS_GUIDE.filter(function(x){ return x.year === _state.guideYear; })[0];
    lineChart('hs-ladder', HS_COMPANIES.map(function(c){
      return { id: c.id, data: g.series[c.id] };
    }), 'usd', 'CapEx guiado');
  } else if (_state.tab === 'qtr'){
    lineChart('hs-qtr', HS_COMPANIES.map(function(c){
      return { id: c.id, data: HS_QUARTERLY[c.id] };
    }), 'usd', 'CapEx del trimestre');
  } else if (_state.tab === 'backlog'){
    const abs = _state.backView === 'abs';
    lineChart('hs-back', ['googl', 'amzn', 'msft'].map(function(id){
      return { id: id, data: abs ? HS_BACKLOG[id] : coverage(id) };
    }), abs ? 'usd' : 'x', abs ? 'Backlog contratado' : 'Cobertura');
  }
}

export const hyperscalersIndustry = {
  html: function(){
    return '<div class="hs-wrap">' +
      '<div class="hs-intro">' +
        '<p class="hs-body">Cómo se movió el CapEx de IA y su guidance, call por call, en Amazon, Alphabet, Meta y Microsoft desde 2024. ' +
        'Todo sale de las propias earnings calls: cada número está fechado en la call que lo dijo, y lo derivado está marcado como tal.</p>' +
        '<p class="hs-note"><b>Eje calendario.</b> Microsoft cierra ejercicio en junio; su “FY26Q2” cae en la columna de enero 2026. ' +
        'La equivalencia aparece en cada tooltip.</p>' +
      '</div>' +
      '<div class="hs-subnav">' + TABS.map(function(t, i){
        return '<button type="button" class="hs-tabbtn' + (i === 0 ? ' active' : '') + '" data-tab="' + t.id + '">' + esc(t.label) + '</button>';
      }).join('') + '</div>' +
      '<div id="hs-body"></div>' +
    '</div>';
  },
  init: function(){
    _state = { tab: 'ladder', guideYear: '2026', backView: 'abs', charts: {} };
    const root = document.querySelector('.hs-wrap');
    if (!root) return;
    root.addEventListener('click', function(e){
      const tb = e.target.closest('.hs-tabbtn');
      if (tb){
        root.querySelectorAll('.hs-tabbtn').forEach(function(b){ b.classList.toggle('active', b === tb); });
        _state.tab = tb.dataset.tab; paint(); return;
      }
      const yr = e.target.closest('[data-year]');
      if (yr){ _state.guideYear = yr.dataset.year; paint(); return; }
      const bk = e.target.closest('[data-back]');
      if (bk){ _state.backView = bk.dataset.back; paint(); return; }
    });
    paint();
  },
};
