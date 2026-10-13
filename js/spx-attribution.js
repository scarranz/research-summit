// spx-attribution.js — Market Analysis ▸ S&P 500 ▸ SPY Attribution by Sector and
// SPY Attribution Detail & Simulation. Same idea as the Nasdaq-100 sections, at
// sector level only, with MONTHS in place of HOCs, and for the SPY fund:
//
//   contribution of sector s in month t = w(s, t−1) × r(s, t)
//     w = SPY's weight in sector s at the previous month-end, from SPY's holdings
//         grouped by GICS sector (Bloomberg; renormalised over the 11 sectors)
//     r = the S&P 500 GICS sector index price return in the month (S5xxxx)
//   residual(t) = SPY's own price return(t) − Σ contributions (cash, timing)
//   each year: Carino-linked, so sectors + residual add up to SPY's return exactly
//
// Simulation: excluded sectors leave the fund and the remaining weights are
// rescaled to 100% every month (w / (1 − Σ excluded w)); the residual cannot be
// assigned to a sector, so a simulation is the sectors alone.
//
// The weights group SPY's holdings by TODAY's GICS, while the S5 levels carry the
// GICS of the time. They only line up after the last GICS restructuring (March
// 2023), so the attribution covers COMPLETE years from FIRST_YEAR on (residual
// 2024 −1 bp, 2025 −5 bp, 2026 YTD +4 bp; 100–330 bp a year before) plus the
// current year to date.

var FIRST_YEAR = 2024;

var D = null, YEARS = [], SECS = [];
var st = { chartYear: null, detYear: null, mode: 'table', excl: {} };
var charts = { top: null, det: null };

function idxOf(iso){ return D.levels.dates.indexOf(iso); }
// Last month-end index of a calendar year (or the cut-off for the current year)
function yearEndIdx(y){
  var ds = D.levels.dates, j = -1;
  for (var i = 0; i < ds.length; i++) if (+ds[i].slice(0, 4) === y) j = i;
  return j;
}

// Years with a full set of months: [{key, label, i0, i1}] oldest → newest
function buildYears(){
  var out = [];
  for (var y = FIRST_YEAR; y <= D.year; y++){
    var i0 = yearEndIdx(y - 1), i1 = yearEndIdx(y);
    if (i0 < 0 || i1 <= i0) continue;
    out.push({ key: String(y), label: (y === D.year ? 'YTD ' : '') + y, i0: i0, i1: i1 });
  }
  return out;
}
function yearOf(key){ for (var i = 0; i < YEARS.length; i++) if (YEARS[i].key === key) return YEARS[i]; return null; }

// Weights at month-end i, renormalised over the sectors still in the index (%)
function weightsAt(i, excl){
  var W = D.spyWeights.series, tot = 0, o = {};
  SECS.forEach(function(s){ if (!excl[s]) tot += W[s][i] || 0; });
  SECS.forEach(function(s){ o[s] = excl[s] || !tot ? null : (W[s][i] || 0) / tot * 100; });
  return o;
}

// The year's attribution. excl = {sector: true} for a simulation.
function compute(yr, excl){
  var L = D.levels.series, SPY = D.etf.levels.series.SPY, sim = SECS.some(function(s){ return excl[s]; });
  var monthC = [], kt = [], logSum = 0, resid = [];
  for (var i = yr.i0 + 1; i <= yr.i1; i++){
    var w = weightsAt(i - 1, excl), c = {}, sum = 0;
    SECS.forEach(function(s){
      if (excl[s]) return;
      var r = L[s][i] / L[s][i - 1] - 1;
      c[s] = w[s] / 100 * r; sum += c[s];
    });
    var Rt = sim ? sum : SPY[i] / SPY[i - 1] - 1;
    resid.push(Rt - sum);
    monthC.push(c);
    kt.push(Math.abs(Rt) > 1e-10 ? Math.log(1 + Rt) / Rt : 1);
    logSum += Math.log(1 + Rt);
  }
  var R = Math.exp(logSum) - 1, k = Math.abs(R) > 1e-10 ? Math.log(1 + R) / R : 1;
  var bySec = {}, residual = 0;
  SECS.forEach(function(s){
    if (excl[s]) return;
    var t = 0; monthC.forEach(function(c, j){ t += kt[j] * c[s]; });
    bySec[s] = t / k * 100;
  });
  resid.forEach(function(e, j){ residual += kt[j] * e; });
  var ret = {};
  SECS.forEach(function(s){ ret[s] = (L[s][yr.i1] / L[s][yr.i0] - 1) * 100; });
  return { bySec: bySec, residual: residual / k * 100, total: R * 100, ret: ret,
    wOpen: weightsAt(yr.i0, excl), wClose: weightsAt(yr.i1, excl), sim: sim };
}

// Row order and x-axis are fixed across years (NDX convention): order = the
// latest year's contributions, axis = the widest base-case range of any year.
var _order = null, _axis = null;
function order(){
  if (_order) return _order;
  var r = compute(YEARS[YEARS.length - 1], {});
  return (_order = SECS.slice().sort(function(a, b){ return r.bySec[b] - r.bySec[a]; }));
}
function axis(){
  if (_axis) return _axis;
  var mn = 0, mx = 0;
  YEARS.forEach(function(y){ var r = compute(y, {}); SECS.forEach(function(s){ mn = Math.min(mn, r.bySec[s]); mx = Math.max(mx, r.bySec[s]); }); });
  return (_axis = { min: mn, max: mx });
}

function sgn(v, d){ if (Math.abs(v) < 0.5 * Math.pow(10, -d)) v = 0; return (v >= 0 ? '+' : '') + v.toFixed(d); }
function fmtC(v){
  if (v == null || isNaN(v)) return '<span style="color:var(--mu)">—</span>';
  if (Math.abs(v) < 0.005) v = 0;
  return '<span style="color:' + (v >= 0 ? 'var(--pos)' : 'var(--neg)') + ';font-weight:600">' + sgn(v, 2) + '%</span>';
}

function yrBtns(cls, handler, active){
  return YEARS.map(function(y){
    return '<button class="' + cls + ' ndx-tab-btn' + (y.key === active ? ' active' : '') + '" data-yr="' + y.key + '" onclick="' + handler + '(\'' + y.key + '\')">' + y.label + '</button>';
  }).join('');
}

function barChart(canvas, box, r, label){
  var keys = order().filter(function(s){ return r.bySec[s] != null; });
  var data = keys.map(function(s){ return +r.bySec[s].toFixed(6); });
  // The residual is drawn as its own grey bar (last), so the bars add up to SPY's
  // return exactly; a simulation has no residual (sectors only).
  var isRes = keys.map(function(){ return false; });
  if (!r.sim){ keys.push('Residual (cash & other)'); data.push(+r.residual.toFixed(6)); isRes.push(true); }
  var ax = axis();
  var mn = Math.min.apply(null, data.concat(ax.min)), mx = Math.max.apply(null, data.concat(ax.max));
  var span = mx - mn, step = span > 12 ? 5 : span > 5 ? 1 : span > 2 ? 0.5 : 0.25;
  var xLo = Math.floor((mn - span * 0.02) / step) * step, xHi = Math.ceil((mx + span * 0.02) / step) * step;
  box.style.height = Math.max(260, keys.length * 30 + 50) + 'px';
  return new Chart(canvas, {
    type: 'bar',
    data: { labels: keys, datasets: [{ label: label, data: data,
      backgroundColor: data.map(function(v, i){ return isRes[i] ? 'rgba(124,134,148,.55)' : v >= 0 ? 'rgba(23,122,78,.72)' : 'rgba(155,42,32,.72)'; }),
      borderColor: data.map(function(v, i){ return isRes[i] ? '#7C8694' : v >= 0 ? '#177A4E' : '#9B2A20'; }),
      borderWidth: 1, borderRadius: 3, barPercentage: 0.75 }] },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false, animation: false,
      plugins: { legend: { display: false },
        tooltip: { callbacks: { label: function(c){ return ' ' + c.dataset.label + ': ' + sgn(c.raw, 2) + '% of SPY\'s return'; } } } },
      scales: {
        x: { min: xLo, max: xHi, border: { display: false },
          grid: { color: function(c){ return c.tick.value === 0 ? 'rgba(0,0,0,.25)' : 'rgba(0,0,0,.05)'; } },
          ticks: { stepSize: step, font: { size: 10, family: 'Inter,sans-serif' }, color: '#8A93A0', callback: function(v){ return sgn(v, 1) + '%'; } } },
        y: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11, family: 'Inter,sans-serif' }, color: '#2B3B4E' } }
      }
    }
  });
}

function reconcileLine(r, yr){
  var sum = 0; SECS.forEach(function(s){ if (r.bySec[s] != null) sum += r.bySec[s]; });
  return '<b style="color:var(--text)">Sum of the bars = SPY ' + sgn(r.total, 2) + '% (' + yr.label + ', price return)</b>: sectors ' + sgn(sum, 2) + '% + residual ' + sgn(r.residual, 2) + '%. ' +
    'Each month: SPY\'s weight in the sector at the previous month-end (SPY holdings by GICS sector) × the S&amp;P 500 sector index return; months linked with Carino. Residual = what the sector weights do not explain: SPY\'s cash, intra-month changes and fund vs index differences.';
}

// ── Attribution by Sector (no simulation) ──────────────────────────
function renderTop(){
  if (charts.top){ charts.top.destroy(); charts.top = null; }
  var yr = yearOf(st.chartYear), r = compute(yr, {});
  charts.top = barChart(document.getElementById('spx-attr-canvas'), document.getElementById('spx-attr-box'), r, yr.label);
  var n = document.getElementById('spx-attr-note'); if (n) n.innerHTML = reconcileLine(r, yr);
}

// ── Attribution Detail & Simulation ────────────────────────────────
function renderDetail(){
  var yr = yearOf(st.detYear), base = compute(yr, {}), r = compute(yr, st.excl);
  var tblWrap = document.getElementById('spx-det-table'), chBox = document.getElementById('spx-det-chart-box');
  tblWrap.style.display = st.mode === 'table' ? '' : 'none';
  chBox.style.display = st.mode === 'chart' ? '' : 'none';
  if (charts.det){ charts.det.destroy(); charts.det = null; }
  if (st.mode === 'chart') charts.det = barChart(document.getElementById('spx-det-canvas'), chBox, r, yr.label + (r.sim ? ' (simulated)' : ''));
  var note = document.getElementById('spx-det-note');
  if (note){
    note.style.display = st.mode === 'chart' ? '' : 'none';
    note.innerHTML = r.sim
      ? 'Simulated SPY <b>' + sgn(r.total, 2) + '%</b> (' + SECS.filter(function(s){ return !st.excl[s]; }).length + ' of 11 sectors, weights rescaled monthly) vs actual ' + sgn(base.total, 2) + '% · difference ' + sgn(r.total - base.total, 2) + ' pp'
      : reconcileLine(r, yr);
  }

  var dot = function(on){ return '<span style="display:inline-block;width:16px;height:16px;border-radius:50%;vertical-align:middle;' +
    (on ? 'background:var(--navy);border:2px solid var(--navy)' : 'background:transparent;border:2px solid #9AAAB8') + '"></span>'; };
  var html = '';
  order().forEach(function(s){
    var ex = !!st.excl[s];
    var w0 = r.wOpen[s], w1 = r.wClose[s];
    html += '<tr style="cursor:pointer;' + (ex ? 'opacity:.42' : '') + '" onclick="spxAttrToggle(\'' + s.replace(/'/g, "\\'") + '\')">' +
      '<td style="text-align:center;padding:6px 4px">' + dot(!ex) + '</td>' +
      '<td style="font-weight:700;color:var(--navy)">' + s + '</td>' +
      '<td class="num">' + fmtC(r.ret[s]) + '</td>' +
      '<td class="num" style="color:var(--mu);font-size:11px">' + (ex ? '—' : w0.toFixed(2) + '% → ' + w1.toFixed(2) + '%') + '</td>' +
      '<td class="num" style="font-weight:700">' + (ex ? '<span style="color:var(--mu)">—</span>' : fmtC(r.bySec[s])) + '</td></tr>';
  });
  if (!r.sim){
    html += '<tr><td></td><td style="color:var(--mu);font-style:italic" title="What the month-end sector weights do not explain: SPY\'s cash, intra-month changes and fund vs index differences">Residual</td>' +
      '<td></td><td></td><td class="num" style="color:var(--mu)">' + sgn(r.residual, 2) + '%</td></tr>';
    html += '<tr style="border-top:2px solid var(--navy);font-weight:700"><td></td><td colspan="3" style="color:var(--navy)">SPY</td><td class="num">' + fmtC(r.total) + '</td></tr>';
  } else {
    var kept = SECS.filter(function(s){ return !st.excl[s]; }).length;
    html += '<tr style="border-top:2px solid var(--navy);font-weight:700"><td></td><td colspan="3" style="color:var(--navy)">Simulated SPY <span style="font-weight:500;color:var(--mu)">(' + kept + ' of 11 sectors, weights rescaled monthly)</span></td><td class="num">' + fmtC(r.total) + '</td></tr>';
    html += '<tr><td></td><td colspan="3" style="color:var(--mu)">Actual SPY</td><td class="num" style="color:var(--mu)">' + sgn(base.total, 2) + '%</td></tr>';
    html += '<tr><td></td><td colspan="3" style="color:var(--mu)">Difference (simulated − actual)</td><td class="num" style="color:' + (r.total - base.total >= 0 ? 'var(--pos)' : 'var(--neg)') + ';font-weight:600">' + sgn(r.total - base.total, 2) + ' pp</td></tr>';
  }
  document.getElementById('spx-det-tbody').innerHTML = html;
}

window.spxAttrChartYear = function(y){ st.chartYear = y; syncBtns('spx-attr-yr-btn', y); renderTop(); };
window.spxAttrDetYear = function(y){ st.detYear = y; syncBtns('spx-det-yr-btn', y); renderDetail(); };
window.spxAttrMode = function(m){ st.mode = m; document.querySelectorAll('[data-spxmode]').forEach(function(b){ b.classList.toggle('active', b.dataset.spxmode === m); }); renderDetail(); };
window.spxAttrReset = function(){ st.excl = {}; renderDetail(); };
window.spxAttrToggle = function(s){
  st.excl[s] = !st.excl[s];
  if (SECS.every(function(x){ return st.excl[x]; })) st.excl[s] = false;   // keep at least one sector
  renderDetail();
};
function syncBtns(cls, y){ document.querySelectorAll('.' + cls).forEach(function(b){ b.classList.toggle('active', b.dataset.yr === y); }); }

// host: an element inside the S&P 500 panel; data: SPX_DATA (needs .spyWeights and the SPY level series)
export function initSpxAttribution(host, data){
  if (!host) return;
  if (!data || !data.spyWeights || !data.etf || !data.etf.levels.series.SPY || typeof Chart === 'undefined'){ host.style.display = 'none'; return; }
  if (data.etf.levels.dates.join() !== data.levels.dates.join()){ console.warn('[spx-attribution] SPY and sector index dates differ'); host.style.display = 'none'; return; }
  D = data; SECS = Object.keys(D.spyWeights.series); YEARS = buildYears();
  if (!YEARS.length){ host.style.display = 'none'; return; }
  st.chartYear = st.detYear = YEARS[YEARS.length - 1].key;   // default: the latest year
  host.innerHTML =
    '<div class="sec">' +
      '<div class="sechdr"><span class="sect">SPY Attribution by Sector</span><span class="secn">Contribution of each GICS sector to the SPY fund\'s price return · weights from SPY\'s holdings, sector returns from the S&amp;P 500 sector indices · full years from ' + FIRST_YEAR + '</span></div>' +
      '<div class="card">' +
        '<div style="font-size:11px;color:var(--mu);line-height:1.5;background:var(--surface);border:1px solid var(--bdr);border-radius:8px;padding:8px 12px;margin-bottom:10px">' +
        '<b style="color:var(--text)">This is the SPY fund, built from the stocks it holds.</b> Each sector\'s contribution comes from SPY\'s own holdings in that sector (weights from SPY\'s holdings, returns from the S&amp;P 500 sector indices). ' +
        'It is not the return of the SPDR sector ETFs (XLK, XLF, XLC…): those funds cap their largest holdings, so their returns can differ a lot from the same sector inside SPY. Owning SPY is not the same as owning the sector ETFs.</div>' +
        '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">' + yrBtns('spx-attr-yr-btn', 'spxAttrChartYear', st.chartYear) + '</div>' +
        '<div id="spx-attr-box" style="position:relative;height:340px"><canvas id="spx-attr-canvas"></canvas></div>' +
        '<div id="spx-attr-note" style="font-size:11px;color:var(--mu);margin-top:8px;line-height:1.5"></div>' +
      '</div>' +
    '</div>' +
    '<div class="sec">' +
      '<div class="sechdr"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
        '<div><span class="sect">SPY Attribution Detail &amp; Simulation</span>' +
          '<span class="secn" style="display:block;margin-top:2px">SPY fund, from its holdings (not the sector ETFs) · click a sector to include / exclude · SPY\'s sector weights rescale to 100% every month · the fund return updates in real time</span></div>' +
        '<div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap">' +
          '<div style="display:flex;gap:3px;margin-right:4px">' + yrBtns('spx-det-yr-btn', 'spxAttrDetYear', st.detYear) + '</div>' +
          '<button class="ndx-tab-btn" data-spxmode="chart" onclick="spxAttrMode(\'chart\')">&#9646; Chart</button>' +
          '<button class="ndx-tab-btn active" data-spxmode="table" onclick="spxAttrMode(\'table\')">Table</button>' +
          '<button class="sb-tbtn" onclick="spxAttrReset()">Reset</button>' +
        '</div></div></div>' +
      '<div class="card">' +
        '<div id="spx-det-chart-box" style="position:relative;height:340px;display:none"><canvas id="spx-det-canvas"></canvas></div>' +
        '<div id="spx-det-note" style="display:none;font-size:11px;color:var(--mu);margin-top:8px;line-height:1.5"></div>' +
        '<table id="spx-det-table" class="rt" style="width:100%;table-layout:fixed">' +
          '<colgroup><col style="width:32px"><col><col style="width:130px"><col style="width:170px"><col style="width:130px"></colgroup>' +
          '<thead><tr><th></th><th>Sector</th><th style="text-align:right">Sector return</th><th style="text-align:right">SPY weight: open → close</th><th style="text-align:right">Contribution</th></tr></thead>' +
          '<tbody id="spx-det-tbody"></tbody></table>' +
      '</div>' +
    '</div>';
  renderTop();
  renderDetail();
}
