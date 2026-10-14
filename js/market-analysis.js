// market-analysis.js — Market Analysis tab: one list of functions, each with its own
// index toggle (S&P 500 · Nasdaq-100 · both where that makes sense), Oct 2026:
//
//   Index Price Return              both at once            js/ma-price.js
//   Sector Return / Contribution    S&P | Nasdaq            js/spx-sector-alpha.js · js/ndx-sector-returns.js
//   Attribution Detail & Simulation S&P | Nasdaq | Both     js/ma-detail.js (one table) · engines in spx-/ndx-attribution.js
//   Sector Summary — Market Beaters S&P | Nasdaq            this file (one table, two datasets)
//   Index Composition               S&P | Nasdaq            this file · js/ndx-attribution.js
//   Top Contributors                S&P | Nasdaq            js/spx-securities.js · js/ndx-attribution.js
//   Winners vs Losers               S&P | Nasdaq            this file · js/ndx-attribution.js
//   Security Return vs Weight       S&P | Nasdaq            js/spx-securities.js · js/ndx-attribution.js
//   Stock Lookup                    both                    this file
//
// S&P data: js/spx-data.js (scripts/spx/extract_spx.py — docs/SPX_MARKET_ANALYSIS.md).
// Nasdaq data: the ndx-attribution snapshot (docs/NDX_ATTRIBUTION.md).
import { SCOLS } from './portal-data.js';
import { loadNdxAttribution, ndxPriceData, ndxStocks, ndxDetail, ndxDetailYears, ndxIGs, ndxSetSim, ndxShowYear } from './ndx-attribution.js';
import { initDetail, setDetailNdx, setDetailIndex } from './ma-detail.js';
import { ndxLatestReturn } from './ndx-sector-returns.js';
import { spyAttributionYears, spyWeightSnaps } from './spx-attribution.js';
import { initSpxSectorAlpha } from './spx-sector-alpha.js';
import { initPriceReturn } from './ma-price.js';
import { dumbbell, distribution } from './ma-charts.js';
import { initSpxSecurities } from './spx-securities.js';

var SPX = null;          // SPX_DATA (js/spx-data.js)
var SPX_STOCKS = [];     // its members with the industry group as `i` (as the Nasdaq-100 stocks carry it)
var NDX = null;          // ndxStocks(): { stocks, years } once the Nasdaq-100 snapshot is loaded
var IT = 'Information Technology';

function legacySec(s){ return s === IT ? 'Technology' : s; }
function secColor(s){ return SCOLS[s] || SCOLS[legacySec(s)] || '#888'; }
var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function asOfTxt(iso){ var d = new Date(iso + 'T12:00:00Z'); return MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear(); }
function esc(s){ return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
function jsq(s){ return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }
function pctTxt(v, d){ if (v == null) return '—'; if (Math.abs(v) < 0.005) v = 0; return (v >= 0 ? '+' : '') + v.toFixed(d == null ? 1 : d) + '%'; }
function seg(fn, opts, cur){
  return '<span class="sb-toggle" style="margin-left:0">' + opts.map(function(o){
    return '<button class="sb-tbtn' + (o[0] === cur ? ' active' : '') + '" onclick="' + fn + '(\'' + o[0] + '\')">' + o[1] + '</button>'; }).join('') + '</span>';
}

// Ticker after each sector name, so a number can be checked against its Bloomberg line
var SEC_TICKER = {
  etf:   {'Information Technology':'XLK','Communication Services':'XLC','Financials':'XLF','Consumer Discretionary':'XLY','Industrials':'XLI','Health Care':'XLV','Utilities':'XLU','Consumer Staples':'XLP','Real Estate':'XLRE','Energy':'XLE','Materials':'XLB'},
  index: {'Information Technology':'S5INFT','Communication Services':'S5TELS','Financials':'S5FINL','Consumer Discretionary':'S5COND','Industrials':'S5INDU','Health Care':'S5HLTH','Utilities':'S5UTIL','Consumer Staples':'S5CONS','Real Estate':'S5RLST','Energy':'S5ENRS','Materials':'S5MATR'}
};

// ─── Index toggles, one per section ─────────────────────────────────
var MA_OPTS = {
  sector:  [['spx', 'S&amp;P 500'], ['ndx', 'Nasdaq-100']],
  detail:  [['spx', 'S&amp;P 500'], ['ndx', 'Nasdaq-100'], ['both', 'Both']],
  summary: [['spx', 'S&amp;P 500'], ['ndx', 'Nasdaq-100']],
  comp:    [['spx', 'S&amp;P 500'], ['ndx', 'Nasdaq-100']],
  wl:      [['spx', 'S&amp;P 500'], ['ndx', 'Nasdaq-100']],
  top:     [['spx', 'S&amp;P 500'], ['ndx', 'Nasdaq-100']],
  scatter: [['spx', 'S&amp;P 500'], ['ndx', 'Nasdaq-100']]
};
// S&P 500 first and selected by default in every section
var MA_IDX = { sector: 'spx', detail: 'spx', summary: 'spx', comp: 'spx', wl: 'spx', top: 'spx', scatter: 'spx' };
function maSec(k){ return document.querySelector('.sec[data-ma="' + k + '"]'); }
function renderToggle(k){
  var t = maSec(k) && maSec(k).querySelector('.ma-idx'); if (!t) return;
  t.innerHTML = '<span class="sb-toggle" style="margin-left:0">' + MA_OPTS[k].map(function(o){
    var off = o[0] !== 'spx' && !NDX;   // the Nasdaq side appears once its snapshot is loaded
    return '<button class="sb-tbtn' + (o[0] === MA_IDX[k] ? ' active' : '') + '"' + (off ? ' disabled style="opacity:.45"' : '') + ' onclick="maIdx(\'' + k + '\',\'' + o[0] + '\')">' + o[1] + '</button>'; }).join('') + '</span>';
}
function showPanes(k){
  var sec = maSec(k); if (!sec) return;
  var v = MA_IDX[k];
  sec.querySelectorAll('.ma-pane').forEach(function(p){ p.hidden = !(v === 'both' || p.dataset.idx === v); });
  var row = sec.querySelector('.ma-panes-row'); if (row) row.classList.toggle('both', v === 'both');
}
function maIdx(k, v){
  if (v !== 'spx' && !NDX) return;
  MA_IDX[k] = v; renderToggle(k); showPanes(k);
  if (k === 'summary'){ renderFilterBar(); applyFilters(); renderSSExclChips(); }
  // Index Composition and Winners vs Losers keep the same year whichever index is shown
  if (k === 'wl'){ if (v === 'spx') renderSpxWL(); else ndxShowYear('wl', WL_YEAR); }
  if (k === 'comp' && v === 'ndx') ndxShowYear('comp', COMP_YEAR);
  if (k === 'detail') setDetailIndex(v);
  if (k === 'comp' && v === 'spx') renderSpxComp();
}
window.maIdx = maIdx;

// ─── Sector Summary — Market Beaters: one table, two datasets ───────
// S&P 500: today's members, a year counts only if the stock was in the index that whole
// year (e<yy> from the extractor). Nasdaq-100: every company that was in the index in any
// year (the HOCs carry each period's members) with the same whole-year rule.
var SS_EXCL = {}, tblData = [], ACTIVE_YRS = [];
var FILT = {};   // { p26: true, b25: true … } — kept when switching index (a year one index lacks is ignored there)
function DS(){
  if (MA_IDX.summary === 'ndx' && NDX){
    var by = {}; NDX.years.forEach(function(y){ by[y.yy] = y.ret; });
    return { key: 'ndx', name: 'Nasdaq-100', stocks: NDX.stocks, years: NDX.years.map(function(y){ return y.yy; }).reverse(),
      bench: function(yy){ return by[yy]; }, secYtd: function(s){ return ndxLatestReturn(s, false); }, igYtd: function(g){ return ndxLatestReturn(g, true); },
      ytdLabel: NDX.years[NDX.years.length - 1].year + ' YTD' };
  }
  return { key: 'spx', name: 'S&P 500', stocks: SPX_STOCKS, years: ['26','25','24','23','22'],
    bench: function(yy){ return SPX.annual.SPX['20' + yy]; },
    secYtd: function(s){ var a = SPX.annual[s]; return a ? a[String(SPX.year)] : null; },
    igYtd: function(g){ var a = SPX.groups && SPX.groups.annual[g]; return a ? a[String(SPX.year)] : null; },
    ytdLabel: SPX.year + ' YTD' };
}
function elig(s, yy){ return s['e' + yy] === 1; }
function memberNote(s, yy){ return s['m' + yy] === 0 ? 'Not in the index that year: shown, but left out of filters and counts' : 'Not in the index for the whole year: shown, but left out of filters and counts'; }
function renderFilterBar(){
  var d = DS(), h = '<span class="flm">Filters:</span>';
  d.years.forEach(function(yy){
    h += '<label class="fc' + (FILT['p' + yy] ? ' active' : '') + '" id="fc-p' + yy + '"><input type="checkbox" onchange="applyFilters()"' + (FILT['p' + yy] ? ' checked' : '') + '> &#x2713; Positive 20' + yy + '</label>' +
      '<label class="fc' + (FILT['b' + yy] ? ' active' : '') + '" id="fc-b' + yy + '"><input type="checkbox" onchange="applyFilters()"' + (FILT['b' + yy] ? ' checked' : '') + '> &#x2191; Beat ' + d.name + ' 20' + yy + '</label>';
  });
  h += '<button onclick="clearFilters()" style="padding:5px 11px;border:1px solid var(--bdr);border-radius:7px;background:var(--w);cursor:pointer;font-size:11px;color:var(--mu)">Clear</button>';
  document.getElementById('fc-bar').innerHTML = h;
  document.getElementById('sec-summary-note').innerHTML = '<i>Positive</i> = price return above 0% that year · <i>Beat</i> = above the ' + d.name + '. A year counts only for a company that was in the ' + d.name + ' the <b>whole year</b>' +
    (d.key === 'ndx' ? '; companies that have since left the index still count for the years they were in it.' : '.');
  document.getElementById('sec-summary-ytd-h').textContent = d.ytdLabel;
}
function applyFilters(){
  var d = DS(), f = {};
  d.years.forEach(function(yy){
    ['p', 'b'].forEach(function(k){
      var e = document.querySelector('#fc-' + k + yy + ' input');
      if (e){ f[k + yy] = e.checked; FILT[k + yy] = e.checked; e.parentElement.classList.toggle('active', e.checked); }
    });
  });
  ACTIVE_YRS = d.years.filter(function(yy){ return f['p' + yy] || f['b' + yy]; });
  var data = d.stocks.slice();
  d.years.forEach(function(yy){
    var b = d.bench(yy);
    if (f['p' + yy]) data = data.filter(function(s){ return elig(s, yy) && s['r' + yy] > 0; });
    if (f['b' + yy]) data = data.filter(function(s){ return elig(s, yy) && s['r' + yy] > b; });
  });
  tblData = data;
  renderTbl();
}
function clearFilters(){
  document.querySelectorAll('#fc-bar input').forEach(function(c){ c.checked = false; c.parentElement.classList.remove('active'); });
  applyFilters();
}
// The 11 GICS sectors in one fixed order for both indices (ties in the table keep it)
var SECTOR_ORDER = [IT, 'Consumer Discretionary', 'Communication Services', 'Consumer Staples', 'Financials', 'Health Care', 'Energy', 'Industrials', 'Materials', 'Utilities', 'Real Estate'];
// IT's three industry groups can be excluded on their own (dashed chips), as before
var TECH_SUBS = [['Semiconductors', 'semiconductors'], ['Software', 'software'], ['Hardware', 'technology hardware']];
function techSub(s){ if (s.s !== IT) return null; var g = String(s.i || '').toLowerCase(); for (var j = 0; j < TECH_SUBS.length; j++) if (g.indexOf(TECH_SUBS[j][1]) === 0) return TECH_SUBS[j][0]; return null; }
function ssOut(s){ return SS_EXCL[s.s] || (techSub(s) && SS_EXCL[techSub(s)]); }
function renderSSExclChips(){
  var row = document.getElementById('sec-excl-row'); if (!row) return;
  var d = DS(), secs = SECTOR_ORDER.slice().sort(function(a, b){ return (d.secYtd(b) == null ? -1e9 : d.secYtd(b)) - (d.secYtd(a) == null ? -1e9 : d.secYtd(a)); });
  function chip(k, dashed){
    var x = SS_EXCL[k];
    return '<span class="sb-secchip' + (x ? ' active' : '') + '" style="' + (x ? 'background:#9B2A20;border-color:#9B2A20' : dashed ? 'border-style:dashed' : '') + '" onclick="toggleSSExcl(\'' + jsq(k) + '\')">' + k + '</span>';
  }
  row.innerHTML = '<span class="sb-secrow-lbl">Exclude:</span>' + secs.map(function(k){ return chip(k, false); }).join('') +
    TECH_SUBS.map(function(t){ return chip(t[0], true); }).join('') + '<button class="sb-secchip-all" onclick="ssExclClear()">Clear</button>';
}
function toggleSSExcl(sec){ SS_EXCL[sec] = !SS_EXCL[sec]; renderSSExclChips(); renderTbl(); }
function ssExclClear(){ SS_EXCL = {}; renderSSExclChips(); renderTbl(); }
function fmtRet(v){ if (v == null || isNaN(v)) return '<span style="color:var(--mu)">&mdash;</span>'; return '<span style="color:' + (v >= 0 ? 'var(--pos)' : 'var(--neg)') + ';font-weight:600">' + (v >= 0 ? '+' : '') + v.toFixed(2) + '%</span>'; }
function renderTbl(){
  var body = document.getElementById('sec-summary-body'); if (!body) return;
  var d = DS(), match = {};
  tblData.forEach(function(s){ if (!ssOut(s)) match[s.t] = true; });
  // the denominators count only the companies eligible for every filtered year
  var pool = d.stocks.filter(function(s){ return s.s && !ssOut(s) && ACTIVE_YRS.every(function(y){ return elig(s, y); }); });
  if (d.key === 'ndx' && !ACTIVE_YRS.length) pool = pool.filter(function(s){ return s.now; });   // no filter: today's members
  var bySec = {};
  pool.forEach(function(s){ (bySec[s.s] = bySec[s.s] || []).push(s); });
  var rows = Object.keys(bySec).map(function(sec){
    var all = bySec[sec], m = all.filter(function(s){ return match[s.t]; });
    return { sec: sec, all: all, matched: m, pct: all.length ? m.length / all.length * 100 : 0 };
  }).sort(function(a, b){ return SECTOR_ORDER.indexOf(a.sec) - SECTOR_ORDER.indexOf(b.sec); });
  var html = '', totM = 0, totS = 0;
  rows.forEach(function(r){
    totM += r.matched.length; totS += r.all.length;
    var cc = secColor(r.sec), open = window.SEC_EXPANDED && window.SEC_EXPANDED[r.sec];
    var pc = r.pct >= 70 ? 'var(--pos)' : r.pct >= 40 ? 'var(--text)' : 'var(--mu)';
    html += '<tr onclick="toggleSecExp(\'' + jsq(r.sec) + '\')" style="cursor:pointer"><td><span style="display:inline-block;width:13px;color:var(--mu);font-size:9px">' + (open ? '&#x25BC;' : '&#x25B6;') + '</span>' +
      '<span class="sch" style="background:' + cc + '22;color:' + cc + ';font-weight:600;margin-left:4px">' + r.sec + '</span></td>' +
      '<td style="text-align:right;font-weight:700;font-size:14px;color:var(--navy)">' + r.matched.length + '</td>' +
      '<td style="text-align:right;font-weight:600;color:' + pc + '">' + r.pct.toFixed(0) + '%</td>' +
      '<td style="text-align:right;color:var(--mu)">' + r.all.length + '</td><td style="text-align:right">' + fmtRet(d.secYtd(r.sec)) + '</td></tr>';
    if (!open) return;
    var ig = {};
    r.all.forEach(function(s){ var g = s.i || 'Unclassified'; (ig[g] = ig[g] || { all: [], m: [] }).all.push(s); if (match[s.t]) ig[g].m.push(s); });
    var gs = Object.keys(ig);
    if (gs.length < 2){ html += companiesBlock(r.matched, 32); return; }
    gs.map(function(g){ return { g: g, all: ig[g].all, m: ig[g].m }; }).sort(function(a, b){ return a.g < b.g ? -1 : 1; }).forEach(function(x){
      var key = r.sec + '|' + x.g, gopen = window.IG_EXPANDED && window.IG_EXPANDED[key], p = r.all.length ? x.m.length / r.all.length * 100 : 0;
      html += '<tr onclick="toggleIgExp(\'' + jsq(key) + '\')" style="cursor:pointer;background:#FAFCFE"><td style="padding-left:32px"><span style="display:inline-block;width:13px;color:var(--mu);font-size:9px">' + (gopen ? '&#x25BC;' : '&#x25B6;') + '</span><span style="margin-left:4px">' + x.g + '</span></td>' +
        '<td style="text-align:right;font-weight:600;color:var(--navy)">' + x.m.length + '</td><td style="text-align:right;color:' + (p >= 70 ? 'var(--pos)' : p >= 40 ? 'var(--text)' : 'var(--mu)') + '">' + p.toFixed(0) + '%</td>' +
        '<td style="text-align:right;color:var(--mu)">' + x.all.length + '</td><td style="text-align:right">' + fmtRet(d.igYtd(x.g)) + '</td></tr>';
      if (gopen) html += companiesBlock(x.m, 58);
    });
  });
  html += '<tr style="border-top:2px solid var(--navy);background:var(--surface)"><td style="font-weight:700;color:var(--navy);text-transform:uppercase;font-size:11px;letter-spacing:.5px;padding-left:25px">Total</td>' +
    '<td style="text-align:right;font-weight:700;font-size:14px;color:var(--navy)">' + totM + '</td><td style="text-align:right;font-weight:700;color:var(--navy)">' + (totS ? (totM / totS * 100).toFixed(0) : 0) + '%</td>' +
    '<td style="text-align:right;color:var(--mu);font-weight:600">' + totS + '</td><td style="text-align:right" title="' + d.name + ' YTD">' + fmtRet(d.bench(d.years[0])) + '</td></tr>';
  body.innerHTML = html;
}
// Companies under a sector or industry group: the last three years; a year the company was
// not in the index the whole year is greyed
function companiesBlock(list, indent){
  var d = DS(), yrs = d.years.slice(0, 3).reverse();
  var m = list.slice().sort(function(a, b){ return (b['r' + yrs[2]] != null ? b['r' + yrs[2]] : -999) - (a['r' + yrs[2]] != null ? a['r' + yrs[2]] : -999); });
  var th = 'padding:4px 8px;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mu);font-weight:500';
  var h = '<tr><td colspan="5" style="padding:0;background:#FAFCFE"><div style="padding:8px 14px 12px ' + indent + 'px"><div style="font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mu);font-weight:600;margin-bottom:6px">Matched companies (' + m.length + ')</div>';
  if (!m.length) return h + '<div style="font-size:11px;color:var(--mu);font-style:italic;padding:4px 0">No companies match the current filters.</div></div></td></tr>';
  h += '<table style="width:100%;border-collapse:collapse;font-size:11.5px"><thead><tr style="border-bottom:1px solid var(--bdr)"><th style="text-align:left;' + th + '">Ticker</th><th style="text-align:left;' + th + '">Company</th>' +
    yrs.map(function(yy, i){ return '<th style="text-align:right;' + th + '">20' + yy + (i === 2 ? ' YTD' : '') + '</th>'; }).join('') + '</tr></thead>';
  m.forEach(function(co){
    h += '<tr style="border-bottom:.5px solid #EEF2F7"><td style="padding:5px 8px;font-weight:600;color:var(--navy);font-size:11px">' + co.t + (d.key === 'ndx' && !co.now ? ' <span style="color:var(--mu);font-weight:400" title="No longer in the Nasdaq-100">·&nbsp;former</span>' : '') + '</td><td style="padding:5px 8px">' + esc(co.n) + '</td>' +
      yrs.map(function(yy){
        var v = co['r' + yy];
        if (v == null) return '<td style="padding:5px 8px;text-align:right;color:var(--mu)">&mdash;</td>';
        if (!elig(co, yy)) return '<td style="padding:5px 8px;text-align:right;color:var(--mu);font-style:italic;opacity:.6" title="' + memberNote(co, yy) + '">' + pctTxt(v) + '</td>';
        return '<td style="padding:5px 8px;text-align:right;color:' + (v >= 0 ? 'var(--pos)' : 'var(--neg)') + ';font-weight:600">' + pctTxt(v) + '</td>';
      }).join('') + '</tr>';
  });
  return h + '</table></div></td></tr>';
}
function toggleSecExp(sec){ window.SEC_EXPANDED = window.SEC_EXPANDED || {}; window.SEC_EXPANDED[sec] = !window.SEC_EXPANDED[sec]; renderTbl(); }
function toggleIgExp(key){ window.IG_EXPANDED = window.IG_EXPANDED || {}; window.IG_EXPANDED[key] = !window.IG_EXPANDED[key]; renderTbl(); }

// ─── Index Composition — S&P 500 (SPY's holdings by sector) ─────────
var COMP_YEAR = null;
function renderSpxComp(){
  var host = document.getElementById('ma-spx-comp'); if (!host || !SPX) return;
  var years = SPX.years.filter(function(y){ return spyWeightSnaps(SPX, y); });
  if (!COMP_YEAR) COMP_YEAR = years[years.length - 1];
  var anchor = spyWeightSnaps(SPX, years[years.length - 1]).open, sn = spyWeightSnaps(SPX, COMP_YEAR), hi = 10;
  years.forEach(function(y){ var s = spyWeightSnaps(SPX, y); [s.open, s.close].forEach(function(m){ Object.keys(m).forEach(function(k){ hi = Math.max(hi, Math.ceil(m[k] / 10) * 10); }); }); });
  var rows = Object.keys(sn.open).map(function(s){ return { name: s, w0: sn.open[s], w1: sn.close[s], a: anchor[s] }; }).sort(function(a, b){ return b.a - a.a; });
  host.innerHTML = '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px">' + years.map(function(y){
    return '<button class="ndx-tab-btn' + (y === COMP_YEAR ? ' active' : '') + '" onclick="maSpxComp(\'' + y + '\')">' + y + '</button>'; }).join('') + '</div><div id="ma-spx-comp-box"></div>';
  dumbbell(document.getElementById('ma-spx-comp-box'), rows, hi, +COMP_YEAR === SPX.year ? 'Latest' : 'Close', COMP_YEAR, 'SPY\'s holdings by GICS sector, month-end weights.');
}
window.maSpxComp = function(y){ COMP_YEAR = y; renderSpxComp(); };

// ─── Winners vs Losers — S&P 500 (members in the index the whole year) ──
var WL_YEAR = null, WL_STATE = { bin: null };
function renderSpxWL(){
  var host = document.getElementById('ma-spx-wl'); if (!host || !SPX) return;
  if (!WL_YEAR) WL_YEAR = String(SPX.year);
  host.innerHTML = '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px">' + SPX.years.map(function(y){
    return '<button class="ndx-tab-btn' + (y === WL_YEAR ? ' active' : '') + '" onclick="maSpxWL(\'' + y + '\')">' + y + '</button>'; }).join('') + '</div><div id="ma-spx-wl-box"></div>' +
    '<div style="font-size:11px;color:var(--mu);margin-top:6px">Today\'s S&amp;P 500 members that were in the index the whole year.</div>';
  var yy = WL_YEAR.slice(2);
  var items = SPX.members.filter(function(s){ return s['e' + yy] === 1 && s['r' + yy] != null; }).map(function(s){ return { name: s.t, co: s.n, ret: s['r' + yy] }; });
  distribution(document.getElementById('ma-spx-wl-box'), items, WL_STATE);
}
window.maSpxWL = function(y){ WL_YEAR = y; WL_STATE.bin = null; renderSpxWL(); };

// ─── Stock Lookup — one box per year: the return, beat the S&P 500?, beat the Nasdaq-100? ──
var LK = [];   // [{ t, n, spx: member|null, ndx: stock|null }]
function buildLookup(){
  var by = {};
  SPX.members.forEach(function(m){ by[m.t] = { t: m.t, n: m.n, spx: m, ndx: null }; });
  if (NDX) NDX.stocks.forEach(function(s){ (by[s.t] = by[s.t] || { t: s.t, n: s.n, spx: null, ndx: null }).ndx = s; });
  LK = Object.keys(by).map(function(k){ return by[k]; });
}
function doSearch(v){
  var res = document.getElementById('sr-res'); if (!res) return;
  v = (v || '').trim().toUpperCase();
  if (!v){ res.style.display = 'none'; return; }
  var hits = LK.filter(function(x){ return x.t.indexOf(v) === 0 || (x.n || '').toUpperCase().indexOf(v) >= 0; })
    .sort(function(a, b){ return (a.t === v ? -1 : 0) - (b.t === v ? -1 : 0) || a.t.localeCompare(b.t); }).slice(0, 8);
  res.innerHTML = hits.length ? hits.map(function(x){
    return '<div class="sri-item" onmousedown="showDetail(\'' + jsq(x.t) + '\')"><b>' + x.t + '</b> <span style="color:var(--mu)">' + esc(x.n) + '</span></div>'; }).join('')
    : '<div class="sri-item" style="color:var(--mu)">Not in the S&amp;P 500 or the Nasdaq-100 data</div>';
  res.style.display = 'block';
}
function closeSrch(){ var r = document.getElementById('sr-res'); if (r) r.style.display = 'none'; }
function showDetail(t){
  closeSrch();
  var x = LK.filter(function(l){ return l.t === t; })[0], box = document.getElementById('sr-det'); if (!x || !box) return;
  var inp = document.getElementById('sr-inp'); if (inp) inp.value = t;
  var nb = {}; if (NDX) NDX.years.forEach(function(y){ nb[y.yy] = y.ret; });
  var years = SPX.years.map(function(y){ return y.slice(2); });
  var cards = years.map(function(yy){
    var r = x.spx && x.spx['r' + yy] != null ? x.spx['r' + yy] : x.ndx && x.ndx['r' + yy] != null ? x.ndx['r' + yy] : null;
    if (r == null) return '';
    // m<yy>: 2 = in the index the whole year, 1 = part of it, 0 = not in it
    function badge(name, rec, bench, noData){
      if (noData) return '<div class="lk-b lk-out">' + name + ': no data that year</div>';
      var m = rec ? rec['m' + yy] : 0;
      if (m !== 2) return '<div class="lk-b lk-out">' + (m === 1 ? name + ': part of the year' : 'Not in the ' + name) + '</div>';
      var beat = r > bench;
      return '<div class="lk-b ' + (beat ? 'lk-win' : 'lk-lose') + '">' + (beat ? '&#x2713; Beat ' : '&#x2717; Lagged ') + name + ' <span>' + pctTxt(bench) + '</span></div>';
    }
    return '<div class="lk-card"><div class="lk-y" title="' + (('20' + yy) === String(SPX.year) ? 'Year to date' : '') + '">20' + yy + '</div>' +
      '<div class="lk-r" style="color:' + (r >= 0 ? 'var(--pos)' : 'var(--neg)') + '">' + pctTxt(r) + '</div>' +
      badge('S&amp;P 500', x.spx, SPX.annual.SPX['20' + yy], false) + badge('Nasdaq-100', x.ndx, nb[yy], nb[yy] == null) + '</div>';
  }).join('');
  var now = [x.spx ? 'S&amp;P 500' : null, x.ndx && x.ndx.now ? 'Nasdaq-100' : null].filter(Boolean);
  box.innerHTML = '<div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin:6px 0 10px"><b style="font-size:16px;color:var(--navy)">' + x.t + '</b><span>' + esc(x.n) + '</span>' +
    '<span style="font-size:11px;color:var(--mu)">' + (now.length ? 'Today in the ' + now.join(' and the ') : 'No longer in either index') + '</span></div>' +
    '<div class="lk-cards">' + cards + '</div>' +
    '<div style="font-size:11px;color:var(--mu);margin-top:8px">"Beat" counts only years the company was in that index the whole year. Price return.</div>';
  box.style.display = 'block';
}

window.applyFilters = applyFilters; window.clearFilters = clearFilters;
window.toggleSSExcl = toggleSSExcl; window.ssExclClear = ssExclClear;
window.toggleSecExp = toggleSecExp; window.toggleIgExp = toggleIgExp;
window.doSearch = doSearch; window.closeSrch = closeSrch; window.showDetail = showDetail;

export function loadMarketAnalysisPage() {
  return import('./spx-data.js').then(function(m){ return m.SPX_DATA; }, function(){ return null; }).then(initMarketAnalysis);
}

function initMarketAnalysis(D) {
  SPX = D && D.members && D.members.length ? D : null;
  var main = document.getElementById('tp-rot');
  if (!SPX){ if (main) main.innerHTML = '<div style="text-align:center;color:var(--neg);padding:34px;font-size:13px">Market data failed to load. Please refresh the page.</div>'; return; }

  SPX_STOCKS = SPX.members.map(function(m){ var o = {}; for (var k in m) o[k] = m[k]; o.i = m.ig; return o; });
  Object.keys(MA_IDX).forEach(function(k){ renderToggle(k); showPanes(k); });
  // S&P 500 side
  initSpxSectorAlpha(SPX, spyAttributionYears(SPX), SEC_TICKER, secColor);
  initDetail(document.getElementById('ma-detail'), SPX);
  renderFilterBar(); applyFilters(); renderSSExclChips();
  renderSpxComp(); renderSpxWL();
  // S&P company weights (one SPY holdings snapshot per year): Top Contributors + Security Return vs Weight
  import('./spx-holdings-data.js').then(function(m){ initSpxSecurities(document.getElementById('ma-spx-top'), document.getElementById('ma-spx-scatter'), m.SPX_HOLDINGS); },
    function(){ ['ma-spx-top', 'ma-spx-scatter'].forEach(function(id){ var e = document.getElementById(id); if (e) e.innerHTML = '<div class="ma-pending">S&amp;P 500 company weights are not in the data.</div>'; }); });
  buildLookup();
  var si = document.getElementById('sr-inp');
  if (si){
    si.addEventListener('input', function(){ doSearch(this.value); });
    si.addEventListener('blur', function(){ setTimeout(closeSrch, 200); });
  }
  // Nasdaq-100 side: its snapshot loads asynchronously, then the joint sections fill in
  loadNdxAttribution({
    sector:  document.getElementById('ndx-sector-returns'),
    comp:    document.getElementById('ma-ndx-comp'),
    top:     document.getElementById('ma-ndx-top'),
    wl:      document.getElementById('ma-ndx-wl'),
    scatter: document.getElementById('ma-ndx-scatter'),
    allYears: SPX.years,            // the S&P years: those before the Nasdaq data starts show disabled
    onYear: function(sec, y){ if (sec === 'comp') COMP_YEAR = String(y); else { WL_YEAR = String(y); WL_STATE.bin = null; } }
  }).then(function(){
    NDX = ndxStocks();
    initPriceReturn(document.getElementById('ma-price'), ndxPriceData(), SPX);
    setDetailNdx({ detail: ndxDetail, years: ndxDetailYears(), igs: ndxIGs(), setSim: ndxSetSim });
    buildLookup();
    Object.keys(MA_IDX).forEach(function(k){ renderToggle(k); showPanes(k); });
  }, function(e){ console.error('[market-analysis] Nasdaq-100 data failed', e); });
}
