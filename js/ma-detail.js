// ma-detail.js — Market Analysis ▸ Attribution Detail & Simulation: ONE table for the
// S&P 500, the Nasdaq-100 or both, one year selector, one Sector / Industry Group column.
// Each index shows its weight (open → close) and its contribution; clicking a row
// excludes that sector or group from BOTH indices and both recalculate (the remaining
// weights rescale to 100%: monthly for the S&P 500, per HOC for the Nasdaq-100).
// Engines: js/spx-attribution.js (spxDetail) · js/ndx-attribution.js (ndxDetail).
// "Cash & other" is the same row for both: SPY's residual (cash, timing) / QQQ's cash & futures.
// Company counts are not shown: the S&P data has today's members only.
import { spxDetail, spxDetailYears, spxGroups } from './spx-attribution.js';

var SPX = null, NDX = null;      // NDX: { detail, years, setSim } once its snapshot is loaded
var st = { idx: 'spx', year: null, excl: {}, open: {} };
var root = null, lastSim = '';

function key(s){ return String(s).toLowerCase().replace(/\band\b/g, '&').replace(/[^a-z&()]/g, ''); }
// Nasdaq-100 industry-group names → the S&P spelling ("and" → "&"; "Real Estate" is the pre-2023 GICS name)
var NDX_ALIAS = { 'realestate': 'Real Estate Management & Development' };
function canonIG(n, canon){ return canon[key(n)] || NDX_ALIAS[key(n)] || n; }

function show(k){ return st.idx === k || st.idx === 'both'; }
function years(){
  var a = spxDetailYears(SPX), b = NDX ? NDX.years : [], all = {};
  a.concat(b).forEach(function(y){ all[y] = 1; });
  return Object.keys(all).map(Number).sort();
}
function hasYear(k, y){ return k === 'spx' ? spxDetailYears(SPX).indexOf(y) >= 0 : !!NDX && NDX.years.indexOf(y) >= 0; }
function fmtC(v){
  if (v == null || isNaN(v)) return '<span style="color:var(--mu)">—</span>';
  if (Math.abs(v) < 0.005) v = 0;
  return '<span style="color:' + (v >= 0 ? 'var(--pos)' : 'var(--neg)') + ';font-weight:600">' + (v >= 0 ? '+' : '') + v.toFixed(2) + '%</span>';
}
function fmtW(a, b){ return a == null && b == null ? '<span style="color:var(--mu)">—</span>' : (a || 0).toFixed(2) + '% → ' + (b || 0).toFixed(2) + '%'; }
function jsq(s){ return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

// Both engines' results for the year, in the S&P spelling
function data(){
  var y = st.year, g = spxGroups(SPX), canon = {};
  Object.keys(g.igsOf).forEach(function(sec){ g.igsOf[sec].forEach(function(ig){ canon[key(ig)] = ig; }); });
  var exSec = Object.keys(st.excl).filter(function(k){ return st.excl[k] && k.indexOf('sec:') === 0; }).map(function(k){ return k.slice(4); });
  var exIG = Object.keys(st.excl).filter(function(k){ return st.excl[k] && k.indexOf('sec:') !== 0; });
  var out = { canon: canon, groups: g, spx: null, ndx: null };
  if (show('spx') && hasYear('spx', y)) out.spx = spxDetail(SPX, y, st.excl);
  if (show('ndx') && NDX && hasYear('ndx', y)){
    // the Nasdaq engine takes its own group names: map the exclusions back
    var back = {}; NDX.igs.forEach(function(n){ back[canonIG(n, canon)] = n; });
    var r = NDX.detail(y, exSec, exIG.map(function(n){ return back[n] || n; }));
    var m = function(o){ var x = {}; Object.keys(o || {}).forEach(function(k){ x[canonIG(k, canon)] = (x[canonIG(k, canon)] || 0) + o[k]; }); return x; };
    out.ndx = { bySec: r.bySec, byIG: m(r.byIG), wOpen: r.wOpen, wClose: r.wClose, wOpenIG: m(r.wOpenIG), wCloseIG: m(r.wCloseIG), total: r.total, cash: r.cash, cashW: r.cashW, CASH: r.CASH };
    // the same exclusions drive the Nasdaq-100 simulation elsewhere (Top Contributors): sync on change only
    var sig = exSec.join('|') + '#' + exIG.join('|');
    if (sig !== lastSim){ lastSim = sig; NDX.setSim(exSec, exIG.map(function(n){ return back[n] || n; })); }
  }
  return out;
}

function render(){
  if (!root) return;
  var ys = years();
  if (!st.year || ys.indexOf(st.year) < 0) st.year = ys[ys.length - 1];
  if (st.idx === 'spx' && !hasYear('spx', st.year)) st.year = spxDetailYears(SPX).slice(-1)[0];
  var d = data(), first = d.spx ? 'spx' : 'ndx', R = d[first] || {};
  var cols = ['spx', 'ndx'].filter(show);
  var sim = Object.keys(st.excl).some(function(k){ return st.excl[k]; });

  // rows: a FIXED order — the first index shown, its latest year, nothing excluded (largest
  // contribution first) — so rows never move when switching year or excluding
  var base = first === 'spx' ? spxDetail(SPX, spxDetailYears(SPX).slice(-1)[0], {}) : NDX ? NDX.detail(NDX.years.slice(-1)[0], [], []) : null;
  if (first === 'ndx' && base){ var bm = {}; Object.keys(base.byIG || {}).forEach(function(k){ bm[canonIG(k, d.canon)] = (bm[canonIG(k, d.canon)] || 0) + base.byIG[k]; }); base = { bySec: base.bySec, byIG: bm }; }
  R = base || R;
  var secs = d.groups.secs.slice().sort(function(a, b){ return ((R.bySec || {})[b] || 0) - ((R.bySec || {})[a] || 0); });
  function igsOf(sec){
    var l = (d.groups.igsOf[sec] || []).slice();
    if (d.ndx) Object.keys(d.ndx.byIG).forEach(function(ig){ if (l.indexOf(ig) < 0 && d.ndx.byIG[ig] != null && sectorOf(ig) === sec) l.push(ig); });
    return l.sort(function(a, b){ return ((R.byIG || {})[b] || 0) - ((R.byIG || {})[a] || 0); });
  }
  function sectorOf(ig){ var g = d.groups.igsOf; for (var s in g) if (g[s].indexOf(ig) >= 0) return s; return null; }
  function cells(k, w0, w1, c, off){
    if (!d[k]) return '<td class="num ma-dt-k" style="color:var(--mu)">n/a</td><td class="num">' + '<span style="color:var(--mu)">—</span></td>';
    return '<td class="num ma-dt-k" style="color:var(--mu);font-size:11px">' + (off ? '—' : fmtW(w0, w1)) + '</td><td class="num" style="font-weight:700">' + (off ? '<span style="color:var(--mu)">—</span>' : fmtC(c)) + '</td>';
  }
  var dot = function(on, sz){ sz = sz || 16; return '<span style="display:inline-block;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;vertical-align:middle;' +
    (on ? 'background:var(--navy);border:2px solid var(--navy)' : 'background:transparent;border:2px solid #9AAAB8') + '"></span>'; };

  var body = '';
  secs.forEach(function(sec){
    var off = !!st.excl['sec:' + sec], igs = igsOf(sec), canOpen = igs.length > 1, open = canOpen && st.open[sec];
    body += '<tr style="cursor:pointer;background:var(--surface);' + (off ? 'opacity:.42' : '') + '" onclick="maDetToggle(\'sec:' + jsq(sec) + '\')">' +
      '<td style="text-align:center;padding:6px 4px">' + dot(!off) + '</td>' +
      '<td style="text-align:center;padding:6px 0">' + (canOpen ? '<span onclick="event.stopPropagation();maDetOpen(\'' + jsq(sec) + '\')" style="cursor:pointer;color:var(--mu);font-size:10px">' + (open ? '▲' : '▼') + '</span>' : '') + '</td>' +
      '<td style="font-weight:700;color:var(--navy)">' + sec + '</td>' +
      cols.map(function(k){ var x = d[k] || {}; return cells(k, (x.wOpen || {})[sec], (x.wClose || {})[sec], (x.bySec || {})[sec], off); }).join('') + '</tr>';
    if (open) igs.forEach(function(ig){
      var gx = off || !!st.excl[ig];
      body += '<tr style="cursor:pointer;' + (gx ? 'opacity:.38' : '') + '" onclick="maDetToggle(\'' + jsq(ig) + '\')">' +
        '<td style="text-align:center;padding:5px 4px 5px 10px">' + dot(!gx, 13) + '</td><td></td><td style="padding-left:20px;font-size:12px">' + ig + '</td>' +
        cols.map(function(k){ var x = d[k] || {}; return cells(k, (x.wOpenIG || {})[ig], (x.wCloseIG || {})[ig], (x.byIG || {})[ig], gx); }).join('') + '</tr>';
    });
  });
  // Cash & other — the same row for both indices
  body += '<tr><td></td><td></td><td style="color:var(--mu);font-style:italic" title="S&amp;P 500: what SPY\'s month-end sector weights do not explain (cash, timing) · Nasdaq-100: QQQ\'s cash and futures">Cash &amp; other</td>' +
    cols.map(function(k){
      var x = d[k]; if (!x) return '<td></td><td></td>';
      if (k === 'spx') return '<td class="num ma-dt-k" style="color:var(--mu)">—</td><td class="num" style="color:var(--mu)">' + (sim ? '—' : fmtC(x.residual)) + '</td>';
      return '<td class="num ma-dt-k" style="color:var(--mu);font-size:11px">' + fmtW(x.cashW[0], x.cashW[1]) + '</td><td class="num" style="color:var(--mu)">' + fmtC(x.cash) + '</td>';
    }).join('') + '</tr>';
  body += '<tr style="border-top:2px solid var(--navy);font-weight:700"><td></td><td></td><td style="color:var(--navy)">Total</td>' +
    cols.map(function(k){ var x = d[k]; return '<td class="ma-dt-k"></td><td class="num">' + (x ? fmtC(x.total) : '<span style="color:var(--mu)">n/a</span>') + '</td>'; }).join('') + '</tr>';

  var NAME = { spx: 'S&amp;P 500 · SPY', ndx: 'Nasdaq-100 · QQQ' };
  root.innerHTML =
    '<div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;margin-bottom:10px">' +
      '<div style="display:flex;gap:3px;flex-wrap:wrap">' + ys.map(function(y){
        var ok = cols.some(function(k){ return hasYear(k, y); });
        return '<button class="ndx-tab-btn' + (y === st.year ? ' active' : '') + '"' + (ok ? ' onclick="maDetYear(' + y + ')"' : ' disabled style="opacity:.35;cursor:default" title="No ' + (st.idx === 'spx' ? 'S&amp;P 500' : '') + ' attribution for ' + y + '"') + '>' + y + '</button>'; }).join('') + '</div>' +
      '<span style="margin-left:auto;display:flex;gap:3px">' +
        '<button class="ndx-tab-btn" onclick="maDetOpenAll(true)">Expand All</button><button class="ndx-tab-btn" onclick="maDetOpenAll(false)">Collapse All</button>' +
        '<button class="sb-tbtn" onclick="maDetReset()">Reset</button></span>' +
    '</div>' +
    '<table class="rt" style="width:100%;table-layout:fixed">' +
      '<colgroup><col style="width:32px"><col style="width:26px"><col>' + cols.map(function(){ return '<col style="width:150px"><col style="width:100px">'; }).join('') + '</colgroup>' +
      '<thead><tr><th></th><th></th><th></th>' + cols.map(function(k){ return '<th colspan="2" class="ma-dt-k" style="text-align:center;color:var(--navy)">' + NAME[k] + '</th>'; }).join('') + '</tr>' +
      '<tr><th></th><th></th><th>Sector / Industry Group</th>' + cols.map(function(){ return '<th class="num ma-dt-k">Weight: open → close</th><th class="num">Contribution</th>'; }).join('') + '</tr></thead>' +
      '<tbody>' + body + '</tbody></table>' +
    '<div style="font-size:11px;color:var(--mu);margin-top:8px">Click a row to exclude it from ' + (cols.length > 1 ? 'both indices' : 'the index') + '; the rest rescale to 100%. S&amp;P 500 = the SPY fund, from its holdings (not the sector ETFs), from 2024.</div>';
}

window.maDetYear = function(y){ st.year = y; render(); };
window.maDetOpen = function(s){ st.open[s] = !st.open[s]; render(); };
window.maDetOpenAll = function(on){ spxGroups(SPX).secs.forEach(function(s){ st.open[s] = on; }); render(); };
window.maDetReset = function(){ st.excl = {}; render(); };
window.maDetToggle = function(k){
  st.excl[k] = !st.excl[k];
  if (k.indexOf('sec:') === 0){ var g = spxGroups(SPX).igsOf[k.slice(4)] || []; g.forEach(function(ig){ delete st.excl[ig]; }); }
  var anyOn = spxGroups(SPX).secs.some(function(s){ return !st.excl['sec:' + s]; });
  if (!anyOn) st.excl[k] = false;          // keep at least one sector in
  render();
};

export function initDetail(host, spx){ root = host; SPX = spx; if (root && spxGroups(SPX)) render(); }
// ndx: { detail(year, exSecs, exIGs), years: [2020 …], igs: [names], setSim(exSecs, exIGs) }
export function setDetailNdx(ndx){ NDX = ndx; render(); }
export function setDetailIndex(idx){ st.idx = idx; render(); }
