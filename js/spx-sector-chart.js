// spx-sector-chart.js — Market Analysis ▸ S&P 500 ▸ Sector Performance.
// Cumulative price return of the 11 S&P 500 GICS sector indices and the
// S&P 500 over a window of months, from js/spx-data.js month-end levels.
// Absolute = each line's own cumulative return; Relative = sector minus
// S&P 500 (percentage points), so the index is the zero line.
// A path-3 canvas (docs/CHART_ENGINE_REFERENCE.md §0.7): esc and
// rsAttachBrush are copied from js/results.js, the chrome is the global rs-*.

function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }

// Copied verbatim from js/results.js (rsAttachBrush) — drag sideways = window,
// drag down or on the axis strip = value range, double-click = reset.
function rsAttachBrush(el, chart, onX, onY, onReset){
  var wrap = el.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  el.style.cursor = 'crosshair';
  el.onmousedown = function(ev){
    if (ev.button !== 0) return;
    var r0 = el.getBoundingClientRect(), w0 = wrap.getBoundingClientRect();
    var area = chart.chartArea;
    var onAxis = (ev.clientX - r0.left) < area.left || (ev.clientX - r0.left) > area.right;
    var forcedY = onAxis || !onX;
    var vertical = forcedY ? true : null;
    var startX = ev.clientX, startY = ev.clientY;
    var box = null;
    function ensureBox(){
      if (box) return;
      box = document.createElement('div');
      box.className = 'rs-brush';
      if (vertical){
        box.style.left = (r0.left - w0.left + area.left) + 'px';
        box.style.width = (area.right - area.left) + 'px';
      } else {
        box.style.top = (r0.top - w0.top) + 'px';
        box.style.height = r0.height + 'px';
      }
      wrap.appendChild(box);
    }
    function decide(cx, cy){
      if (vertical != null) return;
      var dx = Math.abs(cx - startX), dy = Math.abs(cy - startY);
      if (Math.max(dx, dy) < 8) return;
      vertical = dy > dx;
    }
    function place(cx, cy){
      if (vertical == null) return;
      ensureBox();
      if (vertical){
        var a = Math.min(startY, cy), b = Math.max(startY, cy);
        box.style.top = (a - w0.top) + 'px';
        box.style.height = (b - a) + 'px';
      } else {
        var a2 = Math.min(startX, cx), b2 = Math.max(startX, cx);
        box.style.left = (a2 - w0.left) + 'px';
        box.style.width = (b2 - a2) + 'px';
      }
    }
    place(ev.clientX, ev.clientY);
    function onMove(e2){ decide(e2.clientX, e2.clientY); place(e2.clientX, e2.clientY); }
    function onUp(e2){
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      decide(e2.clientX, e2.clientY);
      if (box) box.remove();
      if (vertical == null) return;
      if (vertical){
        if (Math.abs(e2.clientY - startY) < 8) return;
        var v1 = chart.scales.y.getValueForPixel(Math.min(startY, e2.clientY) - r0.top);
        var v2 = chart.scales.y.getValueForPixel(Math.max(startY, e2.clientY) - r0.top);
        onY(Math.min(v1, v2), Math.max(v1, v2));
      } else {
        if (Math.abs(e2.clientX - startX) < 8) return;
        function idxAt(clientX){
          var v = chart.scales.x.getValueForPixel(clientX - r0.left);
          return Math.max(0, Math.min(chart.data.labels.length - 1, Math.round(v)));
        }
        var a = idxAt(startX), b = idxAt(e2.clientX);
        if (a !== b) onX(Math.min(a, b), Math.max(a, b));
      }
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    ev.preventDefault();
  };
  el.ondblclick = onReset;
}

var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var SPX_COLOR = 'rgba(30,39,51,0.92)';   // navy — the index, as "actual" everywhere in the portal

var D = null, colorOf = null, root = null;
var BENCH = 'SPX', BENCH_LABEL = 'S&P 500', SRC_LABEL = 'S&P 500 GICS sector indices', TICKERS = {};
var st = { from: null, to: null, mode: 'abs', hidden: {}, yr: null, tbl: false, chart: null };

function ymLabel(ym){ return MON[+ym.slice(5, 7) - 1] + " '" + ym.slice(2, 4); }
function addMonths(ym, n){
  var y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1 + n;
  y += Math.floor(m / 12); m = ((m % 12) + 12) % 12;
  return y + '-' + (m < 9 ? '0' : '') + (m + 1);
}
function months(){ return D.levels.dates.map(function(d){ return d.slice(0, 7); }); }
function sectors(){ return Object.keys(D.levels.series).filter(function(k){ return k !== 'SPX' && k !== 'SPY'; }); }
function vis(k){ return !st.hidden[k]; }                      // rule 2 — the ONE predicate
function isRel(){ return st.mode === 'rel'; }

// Points of the window: the month-end before `from` (the 0% base) through `to`.
function windowIdx(){
  var ms = months(), i0 = ms.indexOf(addMonths(st.from, -1)), i1 = ms.indexOf(st.to);
  if (i0 < 0) i0 = 0;
  return [i0, i1 < 0 ? ms.length - 1 : i1];
}
function cumSeries(k){
  var w = windowIdx(), L = D.levels.series[k], S = D.levels.series[BENCH], out = [];
  var b = L[w[0]], bs = S[w[0]];
  for (var i = w[0]; i <= w[1]; i++){
    if (b == null || L[i] == null){ out.push(null); continue; }
    var v = (L[i] / b - 1) * 100;
    if (isRel()){ if (bs == null || S[i] == null){ out.push(null); continue; } v -= (S[i] / bs - 1) * 100; }
    out.push(v);
  }
  return out;
}
function lastVal(a){ for (var i = a.length - 1; i >= 0; i--) if (a[i] != null) return a[i]; return null; }
function unit(){ return isRel() ? 'pp' : '%'; }
function fmt(v){
  if (v == null) return '—';
  if (Math.abs(v) < 0.005) v = 0;
  return (v > 0 ? '+' : '') + v.toFixed(2) + (isRel() ? ' pp' : '%');
}
function tone(v){ return v == null || Math.abs(v) < 0.005 ? 'var(--mu)' : v > 0 ? 'var(--pos)' : 'var(--neg)'; }

// Every series drawn: S&P 500 first (absolute only — relative makes it the
// zero line), then the sectors ranked by their return over the window.
function seriesList(){
  var list = sectors().map(function(k){ var c = cumSeries(k); return { k: k, label: TICKERS[k] ? k + ' (' + TICKERS[k] + ')' : k, color: colorOf(k), data: c, end: lastVal(c) }; });
  list.sort(function(a, b){ return (b.end == null ? -1e9 : b.end) - (a.end == null ? -1e9 : a.end); });
  if (!isRel()){ var s = cumSeries(BENCH); list.unshift({ k: BENCH, label: BENCH_LABEL, color: SPX_COLOR, data: s, end: lastVal(s), spx: true }); }
  return list;
}

function setPreset(p){
  var ms = months(), last = ms[ms.length - 1];
  st.to = last;
  if (p === 'ytd') st.from = D.year + '-01';
  else if (p === 'all') st.from = ms[1];
  else st.from = addMonths(last, -(12 * p) + 1);
  if (ms.indexOf(addMonths(st.from, -1)) < 0) st.from = ms[1];
  st.yr = null;
  render();
}

function presetActive(p){
  var ms = months(), last = ms[ms.length - 1];
  if (st.to !== last) return false;
  if (p === 'ytd') return st.from === D.year + '-01';
  if (p === 'all') return st.from === ms[1];
  return st.from === addMonths(last, -(12 * p) + 1);
}

// Month + year as two short dropdowns instead of the native month calendar.
function ymPicker(which, val, first, last, style){
  var y0 = +first.slice(0, 4), y1 = +last.slice(0, 4), h = '<span style="display:inline-flex;gap:4px">';
  h += '<select data-spf="' + which + '" data-part="m" style="' + style + '">' + MON.map(function(n, i){
    var mm = (i < 9 ? '0' : '') + (i + 1); return '<option value="' + mm + '"' + (val.slice(5, 7) === mm ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select>';
  h += '<select data-spf="' + which + '" data-part="y" style="' + style + '">';
  for (var y = y1; y >= y0; y--) h += '<option' + (String(y) === val.slice(0, 4) ? ' selected' : '') + '>' + y + '</option>';
  return h + '</select></span>';
}

function controlsHtml(){
  var ms = months(), first = ms[1], last = ms[ms.length - 1];
  var inp = 'padding:3px 6px;border:1px solid var(--bdr);border-radius:6px;font:inherit;font-size:11px;color:var(--text);background:var(--w)';
  var presets = [['ytd', 'YTD'], [1, '1Y'], [3, '3Y'], [5, '5Y'], ['all', 'All']];
  return '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px">' +
    '<span class="rs-views"><button type="button" class="rs-view' + (isRel() ? '' : ' active') + '" data-spm="abs">Absolute</button>' +
    '<button type="button" class="rs-view' + (isRel() ? ' active' : '') + '" data-spm="rel">Relative to ' + esc(BENCH_LABEL) + '</button></span>' +
    '<span class="rs-quick"><span class="rs-quick-l">Range</span>' +
    presets.map(function(p){ return '<button type="button" class="rs-preset" data-spp="' + p[0] + '"' + (presetActive(p[0]) ? ' style="color:#fff;background:var(--navy);border-color:var(--navy)"' : '') + '>' + p[1] + '</button>'; }).join('') +
    ymPicker('from', st.from, first, last, inp) +
    '<span style="font-size:11px;color:var(--mu)">to</span>' +
    ymPicker('to', st.to, first, last, inp) + '</span></div>';
}

function legendHtml(list){
  return '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">' + list.map(function(s){
    var sw = s.spx ? '<span class="rs-leg-dash" style="color:' + s.color + '"></span>' : '<span class="rs-leg-line" style="background:' + s.color + '"></span>';
    return '<button type="button" class="rs-leg' + (vis(s.k) ? '' : ' off') + '" data-spl="' + esc(s.k) + '" title="Show / hide">' + sw + esc(s.label) +
      ' <span style="color:' + tone(s.end) + ';font-weight:700">' + fmt(s.end) + '</span></button>';
  }).join('') + '</div>';
}

function tableHead(list, labels){
  var open = st.tbl === true, n = list.filter(function(s){ return vis(s.k); }).length;
  return '<span class="rs-collap-ic">' + (open ? '▾' : '▸') + '</span>Month-end detail' +
    '<span class="rs-collap-sub">' + (open ? 'hide' : 'show') + ' · cumulative ' + (isRel() ? 'pp vs ' + esc(BENCH_LABEL) : 'price return %') + ', ' +
    n + ' series, ' + (labels.length - 1) + ' months</span>';
}

function tableHtml(list, labels){
  var rows = list.filter(function(s){ return vis(s.k); });
  var h = '<div class="rs-ft-cap">Cumulative ' + (isRel() ? 'return minus ' + esc(BENCH_LABEL) + ', percentage points' : 'price return, %') +
    ' from the ' + ymLabel(labels[0]) + ' month-end · source: ' + esc(SRC_LABEL) + '</div>' +
    '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Series</th>';
  labels.slice(1).forEach(function(l){ h += '<th>' + esc(ymLabel(l)) + '</th>'; });
  h += '<th class="rs-ft-s">Window</th></tr></thead><tbody>';
  rows.forEach(function(s){
    h += '<tr class="rs-ft-main"><td class="rs-ft-h">' + esc(s.label) + '</td>';
    s.data.slice(1).forEach(function(v){ h += '<td style="color:' + tone(v) + '">' + fmt(v) + '</td>'; });
    h += '<td class="rs-ft-s" style="color:' + tone(s.end) + ';font-weight:700">' + fmt(s.end) + '</td></tr>';
  });
  return h + '</tbody></table></div>';
}

function render(){
  if (!root) return;
  if (st.chart){ st.chart.destroy(); st.chart = null; }
  var w = windowIdx(), labels = months().slice(w[0], w[1] + 1), list = seriesList();
  root.innerHTML = controlsHtml() + legendHtml(list) +
    '<div style="position:relative;height:380px"><canvas></canvas></div>' +
    '<div style="font-size:10.5px;color:var(--mu);margin-top:6px">Drag sideways to narrow the window, drag down (or on the axis) to zoom the scale, double-click to reset. Click a name to hide it.</div>' +
    '<div class="rs-collap"><button type="button" class="rs-collap-h" data-sptb="1">' + tableHead(list, labels) + '</button>' +
    '<div class="rs-collap-b"' + (st.tbl === true ? '' : ' hidden') + '><div class="rs-tablewrap">' + tableHtml(list, labels) + '</div></div></div>';

  var datasets = list.filter(function(s){ return vis(s.k); }).map(function(s){
    return { label: s.label, data: s.data, borderColor: s.color, backgroundColor: s.color,
      borderWidth: s.spx ? 2.5 : 1.8, borderDash: s.spx ? [6, 4] : [], pointRadius: 0, pointHoverRadius: 3,
      tension: 0, spanGaps: false, order: s.spx ? 0 : 1 };
  });
  var canvas = root.querySelector('canvas');
  var y = { position: 'right', grid: { color: function(c){ return c.tick && c.tick.value === 0 ? 'rgba(30,39,51,0.45)' : 'rgba(0,0,0,0.05)'; } },
    ticks: { font: { size: 11 }, callback: function(v){ return (+v.toFixed(1)) + (isRel() ? ' pp' : '%'); } } };
  if (st.yr){ y.min = st.yr[0]; y.max = st.yr[1]; }
  st.chart = new Chart(canvas, {
    type: 'line',
    data: { labels: labels.map(ymLabel), datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 200 },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17,30,51,.95)', itemSort: function(a, b){ return (b.parsed.y || 0) - (a.parsed.y || 0); },
          callbacks: {
            title: function(c){ return c[0].label + ' month-end · since ' + ymLabel(labels[0]); },
            label: function(c){ return c.dataset.label + ': ' + fmt(c.parsed.y); }
          }
        }
      },
      scales: { x: { grid: { display: false }, ticks: { font: { size: 11 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 14 } }, y: y }
    }
  });
  rsAttachBrush(canvas, st.chart,
    function(a, b){ var ms = labels; st.from = addMonths(ms[a], 1); st.to = ms[b]; st.yr = null; render(); },
    function(v1, v2){ st.yr = [v1, v2]; render(); },
    function(){ st.yr = null; setPreset('ytd'); });
}

function wire(){
  root.addEventListener('click', function(e){
    var t = e.target.closest('[data-spm],[data-spp],[data-spl],[data-sptb]');
    if (!t || !root.contains(t)) return;
    if (t.dataset.spm){ st.mode = t.dataset.spm; st.yr = null; render(); }
    else if (t.dataset.spp){ var p = t.dataset.spp; setPreset(p === 'ytd' || p === 'all' ? p : +p); }
    else if (t.dataset.spl){ st.hidden[t.dataset.spl] = !st.hidden[t.dataset.spl]; render(); }
    else if (t.dataset.sptb){ st.tbl = st.tbl !== true; render(); }
  });
  root.addEventListener('change', function(e){
    var t = e.target; if (!t.dataset || !t.dataset.spf || !t.value) return;
    var cur = st[t.dataset.spf], ms = months(), first = ms[1], last = ms[ms.length - 1];
    var v = t.dataset.part === 'y' ? t.value + cur.slice(4) : cur.slice(0, 5) + t.value;
    st[t.dataset.spf] = v < first ? first : v > last ? last : v;
    if (st.from > st.to){ var x = st.from; st.from = st.to; st.to = x; }
    if (months().indexOf(addMonths(st.from, -1)) < 0) st.from = months()[1];
    st.yr = null; render();
  });
}

// Switch between the S&P 500 sector indices (bench SPX) and the SPDR ETFs (bench SPY).
// Months, window and hidden series are kept; the value-axis zoom is dropped.
export function setSectorPerfSource(levels, bench, benchLabel, srcLabel, tickers){
  if (!D || !levels) return;
  D = { levels: levels, year: D.year };
  BENCH = bench; BENCH_LABEL = benchLabel; SRC_LABEL = srcLabel || SRC_LABEL; TICKERS = tickers || {};
  st.yr = null;
  render();
}

// host: the section's container. data: SPX_DATA (or null → the section stays empty).
export function initSectorPerfChart(host, data, sectorColor){
  root = host;
  if (!root) return;
  if (!data || !data.levels || typeof Chart === 'undefined'){
    var sec = root.closest('.sec'); if (sec) sec.style.display = 'none';
    return;
  }
  D = data; colorOf = sectorColor;
  var ms = months();
  st.from = D.year + '-01'; st.to = ms[ms.length - 1];
  wire();
  render();
}
