// ndx-attribution.js — NDX 100 Return Attribution (Carino linking)
import { fetchNdxAttribution } from './api.js';

// Filled by loadNdxAttribution(): the latest snapshot from the ndx-attribution edge
// function (Supabase), or the bundled static file if the function is unavailable.
var NDX_DATA = null;
var _dataSource = null;   // { kind: 'supabase' | 'static', meta }

const CASH       = 'Cash, Derivatives and Other Securities';
const CASH_LABEL = 'Cash & Futures';
const NS         = 'http://www.w3.org/2000/svg';

// Green / red ramps — shared by treemap, heatmap, scatter, beeswarm
var POS_RAMP = ['#D6EFE0','#A8D9B6','#5AB882','#27A05A','#177A4E'];
var NEG_RAMP = ['#F9DADA','#F1AFAF','#E34948','#B02E2D','#7A1F1E'];

var sectors     = [];
var igBySec     = {};
var igToSec     = {};
var exclSecs    = new Set();
var exclIGs     = new Set();
var baseR       = null;
var _chart      = null;
var _chartSim   = null;
var _chartFull  = [];
var attrTab     = 'sector';
var attrMode    = 'chart';
var _snap0      = {};
var _snapN      = {};
var _axisSecMin = 0, _axisSecMax = 0;
var _axisIGMin  = 0, _axisIGMax  = 0;
var _sortKey    = 'contrib';
var _sortDir    = 1;
var _attrDetailYear = 'ytd2026';
var _fromHoc    = 12;
var _toHoc      = 25;
var _activeHocs = [];
var _securities = [];
var _beeswarmFilter = 0;
var treemapSubMode = 'flat';
var _scatterHocIdx = -1;
var _secSnapshots  = [];
var _expandedSecs  = new Set();
var _scatterXLo = null, _scatterXHi = null, _scatterYHi = null;
var _activeYear  = 'ytd2026';
var _scatterYear = 'ytd2026';
var _scatterSecSnapshots = [];
var _scatterYrAxes = { xLo: null, xHi: null, yHi: null };
var _globalScatterAxes = { xLo: null, xHi: null, yHi: null };
var _globalBeeAxes     = { contribHi: null, xLo: null, xHi: null };
var _beeswarmYear = 'ytd2026';
var _beeswarmYears = new Set(['ytd2026']);
var _beeswarmProgress = 100;
var _beeswarmSectors = new Set();   // legacy — no longer used for filtering
var _beeswarmActiveSector = 'Information Technology';
var _beeswarmActiveIG = null;     // set → the beeswarm shows this industry group instead of a sector
var _beeswarmSecAll = [];
var _paretoN       = 5;
var _paretoYears   = new Set(['ytd2026']);
var _paretoSide    = 'pos';          // 'pos' = top N | 'neg' = bottom N | 'both'
var _paretoInfo    = 'sector';       // '' | 'sector' | 'ig' — one descriptor column at most
var _paretoView    = 'table';
var _paretoCols    = new Set(['ret']);
var _paretoCustomN = 0;
var YEAR_HOCS    = {};   // derived from the HOC dates in deriveYears(); e.g. { ytd2026: [12, 25], y2025: [2, 11] }
var _colorMode   = 'orig';   // 'orig' | 'A' | 'B' | 'C'
var _colorMaxPos = 0, _colorMaxNeg = 0;
var _wlTab        = 'A';
var _wlYear       = 'ytd2026';
var _attrChartYear = 'ytd2026';     // top chart: one year at a time
var _attrChartTab = 'sector';       // independent from attrTab (table)
var _compYear = 'ytd2026';          // Index Composition year
var _attrDecimals = 2;
var lastBaseR    = null;
var _scatterViewport  = null;   // { xLo, xHi, yLo, yHi } — null = use global axes
var _scatterDragState = null;

// ── Helpers ────────────────────────────────────────────────────────────────
function getActiveHocs() {
  return NDX_DATA.hocs.filter(function(h) { return h.n >= _fromHoc && h.n <= _toHoc; });
}
// Group HOCs into calendar years from their dates, so a new year in the data shows
// up everywhere on its own. A HOC belongs to the year of its close date (the open
// HOC to the year it started). A year is kept only if it is complete at the start:
// its first HOC must begin at the previous year-end (that drops the 8-day Dec-2024
// stub). The last year is "YTD" until a HOC closes on Dec 31.
// Year-end close = the last weekday of December (Dec 31 unless it falls on a weekend)
function yearEndClose(y) {
  var d = new Date(Date.UTC(y, 11, 31));
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6) d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
// Years from the analyst's "HOC Type" markers (h.yf: 1 = opening HOC of a year, 0 = internal,
// 2 = closing HOC). A year runs from each 1 to its 2; no 2 yet = YTD; HOCs outside a 1…2 run
// (the Dec-2019 stub) are left out. Year number = year of the opening HOC's effective date
// + 7 days (an opening HOC dated Dec 29-31 belongs to the next year). Same rule as the
// extractor's years_by_markers(). Used only when every HOC carries a marker.
function deriveYearsFromMarkers(hocs) {
  YEAR_HOCS = {}; YR_LABEL = {};
  var runs = [], cur = null;
  hocs.forEach(function(h) {
    if (h.yf === 1) {
      if (cur) runs.push(cur);
      var y = new Date(Date.parse(h.eff + 'T00:00:00Z') + 7 * 864e5).getUTCFullYear();
      cur = { y: y, first: h.n, last: h.n, closed: false };
    } else if (cur) {
      cur.last = h.n;
    } else {
      return;                                   // outside any year
    }
    if (h.yf === 2) { cur.closed = true; runs.push(cur); cur = null; }
  });
  if (cur) runs.push(cur);
  runs.forEach(function(r, i) {
    var ytd = !r.closed && i === runs.length - 1;
    var key = (ytd ? 'ytd' : 'y') + r.y;
    YEAR_HOCS[key] = [r.first, r.last];
    YR_LABEL[key]  = (ytd ? 'YTD ' : '') + r.y;
  });
}

function deriveYears(hocs) {
  if (hocs.length && hocs.every(function(h) { return h.yf === 0 || h.yf === 1 || h.yf === 2; }))
    return deriveYearsFromMarkers(hocs);
  // Fallback when the data has no complete "HOC Type" column: the date rule below
  var byYear = {};
  hocs.forEach(function(h) {
    // A HOC measures (prev close, close]: it belongs to the year of its close. The open HOC
    // belongs to the year its prev close is in — or the next one if it starts from that
    // year's year-end close (opened Dec 31, or Fri Dec 29 2028 when Dec 31 is a Sunday)
    var y;
    if (h.close) y = +h.close.slice(0, 4);
    else { y = +h.prev.slice(0, 4); if (h.prev >= yearEndClose(y)) y += 1; }
    (byYear[y] = byYear[y] || []).push(h);
  });
  YEAR_HOCS = {}; YR_LABEL = {};
  Object.keys(byYear).map(Number).sort().forEach(function(y) {
    var list = byYear[y], first = list[0], last = list[list.length - 1];
    // Year Y starts with the HOC whose prev close is the year-end close of Y-1
    // (2025 → HOC 2, prev 2024-12-31; 2026 → HOC 12, prev 2025-12-31). Anything
    // else is a partial year (the 8-day Dec-2024 stub) and is left out.
    if (first.prev !== yearEndClose(y - 1)) {
      console.warn('ndx-attribution: ' + y + ' skipped — first HOC ' + first.n + ' starts ' + first.prev + ', not at the ' + (y - 1) + ' year-end close');
      return;
    }
    // …and is complete once a HOC closes on its own year-end close; until then it is YTD
    var ytd = !last.close || last.close < yearEndClose(y);
    var key = (ytd ? 'ytd' : 'y') + y;
    YEAR_HOCS[key] = [first.n, last.n];
    YR_LABEL[key]  = (ytd ? 'YTD ' : '') + y;
  });
}
function yearOf(key) { return key.replace(/\D/g, ''); }

// Year keys newest first (ytd2026, y2025, …) — every per-year control iterates this
function yearKeys() {
  return Object.keys(YEAR_HOCS).sort(function(a, b) { return YEAR_HOCS[b][0] - YEAR_HOCS[a][0]; });
}
// Sector weights (non-cash) at the first and last HOC of a year — shared by
// Index Composition and Winners vs Losers so both report the same weight change
function sectorWeightSnaps(yr) {
  var hocs = hocsForYear(yr), o = {}, c = {};
  if (!hocs.length) return { open: o, close: c };
  // Open = weights at the start of the year's first HOC; close = the last HOC drifted to its
  // close (for the open YTD HOC: drifted to the latest prices)
  var closeW = driftedWeights(hocs[hocs.length - 1]);
  hocs[0].sec.forEach(function(s) {
    if (isCash(s.t) || s.s === CASH) return;
    o[s.s] = (o[s.s] || 0) + (s.w || 0);
  });
  hocs[hocs.length - 1].sec.forEach(function(s) {
    if (isCash(s.t) || s.s === CASH) return;
    c[s.s] = (c[s.s] || 0) + (closeW[s.t || s.co] || 0);
  });
  return { open: o, close: c };
}
function hocsForYear(yr) {
  var rng = YEAR_HOCS[yr];
  if (!rng) return _activeHocs;
  return NDX_DATA.hocs.filter(function(h) { return h.n >= rng[0] && h.n <= rng[1]; });
}
function normalize() {
  NDX_DATA.hocs.forEach(function(hoc) {
    hoc.sec.forEach(function(s) {
      var bad = function(v) { return !v || !v.trim() || /^[#]?n\/?a(\s|$)/i.test(v.trim()); };
      if (bad(s.s)) s.s = CASH;
      if (bad(s.g)) s.g = CASH;
      if (s.s === CASH) s.g = CASH;
    });
  });
}
// Weights at the CLOSE of a HOC: the HOC's opening weights drifted by each name's return
// over the HOC, w·(1+r) / Σ w·(1+r). The raw `w` is the weight at the START of the HOC,
// so using it as a year-end weight left the year's close visibly off the next year's open.
// Drifted, the 2020 close ≈ the 2021 open (IT 44.05% vs 44.03%).
function driftedWeights(hoc) {
  var tot = 0, out = {};
  hoc.sec.forEach(function(s) { tot += (s.w || 0) * (1 + s.r); });
  if (!tot) tot = 1;
  hoc.sec.forEach(function(s) { out[s.t || s.co] = (s.w || 0) * (1 + s.r) / tot * 100; });
  return out;
}

// Every sector / industry group that appears in ANY year, so tables and charts keep the
// same rows when switching years (a name absent in a year shows 0)
var _universe = null;
var _anchorSnapN = null;   // latest-year weights (table "Weight" sort)
function universe() {
  if (_universe) return _universe;
  var secs = new Set(), igs = new Set(), igSec = {};
  yearKeys().slice().reverse().forEach(function(yr) {          // oldest → newest: latest sector mapping wins
    hocsForYear(yr).forEach(function(hoc) {
      hoc.sec.forEach(function(s) { secs.add(s.s); igs.add(s.g); igSec[s.g] = s.s; });
    });
  });
  return (_universe = { secs: Array.from(secs), igs: Array.from(igs), igSec: igSec });
}

function buildHierarchy() {
  // Rows = the full universe in the latest year's order (attrOrder), for every year
  var u = universe(), secPos = attrOrder(false), igPos = attrOrder(true);
  function bySecPos(a, b) { if (a === CASH) return 1; if (b === CASH) return -1; return secPos[a] - secPos[b]; }
  function byIGPos(a, b)  { if (a === CASH) return 1; if (b === CASH) return -1; return igPos[a] - igPos[b]; }
  sectors = u.secs.slice().sort(bySecPos);
  igBySec = {}; igToSec = {};
  sectors.forEach(function(s) { igBySec[s] = []; });
  u.igs.forEach(function(g) { var s = u.igSec[g]; igToSec[g] = s; (igBySec[s] = igBySec[s] || []).push(g); });
  sectors.forEach(function(s) { igBySec[s].sort(byIGPos); });

  // Open = weights at the start of the period's first HOC; close = drifted weights of its last HOC
  var first = _activeHocs[0], last = _activeHocs[_activeHocs.length - 1];
  var closeW = driftedWeights(last);
  _snap0 = {}; _snapN = {};
  [[first, _snap0, null], [last, _snapN, closeW]].forEach(function(p) {
    var hoc = p[0], snap = p[1], dw = p[2];
    hoc.sec.forEach(function(s) {
      var w = dw ? dw[s.t || s.co] : (s.w || 0);
      if (!snap[s.s]) snap[s.s] = { count: 0, w: 0 };
      if (!snap['ig:'+s.g]) snap['ig:'+s.g] = { count: 0, w: 0 };
      var countable = !isCash(s.t) && (s.w || 0) > 0;
      if (countable) { snap[s.s].count++; snap['ig:'+s.g].count++; }
      snap[s.s].w += w;
      snap['ig:'+s.g].w += w;
    });
  });
}
function lockAxes(res) {
  function rng(vals) {
    var mn = Math.min.apply(null, vals.concat(0));
    var mx = Math.max.apply(null, vals.concat(0));
    var pad = Math.max(Math.abs(mx - mn) * 0.12, 0.1);
    return { min: mn - pad, max: mx + pad };
  }
  var sr = rng(sectors.map(function(s) { return res.bySec[s] || 0; }));
  _axisSecMin = sr.min; _axisSecMax = sr.max;
  var igVals = [];
  sectors.forEach(function(s) { (igBySec[s]||[]).forEach(function(g) { igVals.push(res.byIG[g]||0); }); });
  var ir = rng(igVals);
  _axisIGMin = ir.min; _axisIGMax = ir.max;
}

// Carino-linked attribution
function computeCore(exS, exG, hocList) {
  var hocSecC = [], hocIGC = [], ktArr = [], logSum = 0, hocResults = [];
  var _hocs = hocList !== undefined ? hocList : _activeHocs;
  _hocs.forEach(function(hoc) {
    var exclW = 0;
    hoc.sec.forEach(function(s) { if (exS.has(s.s) || exG.has(s.g)) exclW += (s.w || 0); });
    var scale = exclW < 99.99 ? 100 / (100 - exclW) : 1;
    var hocRet = 0, count = 0, sc = {}, gc = {};
    hoc.sec.forEach(function(s) {
      if (exS.has(s.s) || exG.has(s.g)) return;
      var c = (s.w || 0) * scale * s.r;
      sc[s.s] = (sc[s.s] || 0) + c;
      gc[s.g] = (gc[s.g] || 0) + c;
      hocRet += c; count++;
    });
    var rw = hocRet / 100;
    var kt = Math.abs(rw) > 1e-10 ? Math.log(1 + rw) / rw : 1.0;
    logSum += Math.log(1 + rw);
    ktArr.push(kt); hocSecC.push(sc); hocIGC.push(gc);
    hocResults.push({ n: hoc.n, eff: hoc.eff, close: hoc.close, ret: hocRet, count: count });
  });
  var ytd = (Math.exp(logSum) - 1) * 100;
  var R = ytd / 100;
  var k = Math.abs(R) > 1e-10 ? Math.log(1 + R) / R : 1.0;
  var allSecs = new Set(), allIGs = new Set();
  hocSecC.forEach(function(m) { Object.keys(m).forEach(function(s) { allSecs.add(s); }); });
  hocIGC.forEach(function(m)  { Object.keys(m).forEach(function(g) { allIGs.add(g); }); });
  var bySec = {}, byIG = {};
  allSecs.forEach(function(s) {
    if (s === CASH) return;
    var sum = 0; hocResults.forEach(function(_, t) { sum += ktArr[t] * (hocSecC[t][s] || 0); });
    bySec[s] = sum / k;
  });
  allIGs.forEach(function(g) {
    if (g === CASH) return;
    var sum = 0; hocResults.forEach(function(_, t) { sum += ktArr[t] * (hocIGC[t][g] || 0); });
    byIG[g] = sum / k;
  });
  bySec[CASH] = ytd - Object.keys(bySec).reduce(function(a, s) { return a + bySec[s]; }, 0);
  byIG[CASH]  = ytd - Object.keys(byIG ).reduce(function(a, g) { return a + byIG[g];  }, 0);
  return { bySec: bySec, byIG: byIG, ytd: ytd, hocResults: hocResults, hocSecC: hocSecC };
}

// Per-security Carino-linked attribution (for scatter + beeswarm)
function computeSecurities(exS, exG, hocList) {
  var hocs = hocList !== undefined ? hocList : _activeHocs;
  var hocMeta = [], logSumTotal = 0;
  hocs.forEach(function(hoc) {
    var exclW = 0;
    hoc.sec.forEach(function(s) { if (exS.has(s.s) || exG.has(s.g)) exclW += (s.w || 0); });
    var scale = exclW < 99.99 ? 100 / (100 - exclW) : 1;
    var hocRet = 0;
    hoc.sec.forEach(function(s) {
      if (exS.has(s.s) || exG.has(s.g)) return;
      hocRet += (s.w || 0) * scale * s.r;
    });
    var rw = hocRet / 100;
    var kt = Math.abs(rw) > 1e-10 ? Math.log(1 + rw) / rw : 1.0;
    logSumTotal += Math.log(1 + rw);
    hocMeta.push({ kt: kt, scale: scale, hoc: hoc });
  });
  var ytd = (Math.exp(logSumTotal) - 1) * 100;
  var R = ytd / 100;
  var k = Math.abs(R) > 1e-10 ? Math.log(1 + R) / R : 1.0;

  // Closing weights = the last HOC's weights drifted to its close (see driftedWeights)
  var lastHoc = hocs[hocs.length - 1];
  var closeW = driftedWeights(lastHoc);
  lastHoc.sec.forEach(function(s) { if (exS.has(s.s) || exG.has(s.g)) delete closeW[s.t || s.co]; });

  var tickers = {};
  hocMeta.forEach(function(h) {
    var kt = h.kt, scale = h.scale, hoc = h.hoc;
    hoc.sec.forEach(function(s) {
      if (exS.has(s.s) || exG.has(s.g)) return;
      var key = s.t || s.co;
      if (!tickers[key]) tickers[key] = { name: key, co: s.co, sect: s.s, grp: s.g, logSum: 0, cSum: 0, w0: null };
      tickers[key].logSum += Math.log(1 + s.r);
      tickers[key].cSum  += kt * (s.w || 0) * scale * s.r;
      if (tickers[key].w0 === null) tickers[key].w0 = s.w || 0;
    });
  });

  return Object.keys(tickers).map(function(key) {
    var d = tickers[key];
    return {
      name: d.name, co: d.co, sect: d.sect, grp: d.grp,
      ret:    (Math.exp(d.logSum) - 1) * 100,
      w0:     d.w0 || 0,
      w1:     closeW[key] || 0,
      contrib: d.cSum / k
    };
  });
}

function dispSec(s) { return s === CASH ? CASH_LABEL : s; }
function dispIG(g)  { return g === CASH ? CASH_LABEL : g; }
function isCash(t) { return t && t.charAt(0) === '$'; }
function fmtC(v) {
  if (v == null || isNaN(v)) return '<span style="color:var(--mu)">—</span>';
  if (Math.abs(v) < 0.005) v = 0;   // shows +0.00%, never -0.00%
  return '<span style="color:' + (v >= 0 ? 'var(--pos)' : 'var(--neg)') + ';font-weight:600">' +
    (v >= 0 ? '+' : '') + v.toFixed(_attrDecimals) + '%</span>';
}
// Signed 2-decimal number; anything that rounds to zero prints +0.00 (never -0.00)
function sgn2(v) { v = Math.abs(v) < 0.005 ? 0 : v; return (v >= 0 ? '+' : '') + v.toFixed(2); }
function fmtYTD(v) { return v == null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(_attrDecimals) + '%'; }
function colr(v)   { return v >= 0 ? 'var(--pos)' : 'var(--neg)'; }
function esc(s)    { return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'"); }
function trunc(s, n) { return s.length > n ? s.slice(0, n-1) + '…' : s; }
function chartLbl(s, isIG) {
  var d = isIG ? dispIG(s) : dispSec(s);
  return trunc(d, isIG ? 36 : 28);
}

// Contribution-based color from the shared ramps (√ compression)
function contribColor(v, maxAbs, localMax) {
  if (!maxAbs || maxAbs < 1e-9) return '#EDECEA';
  var t;
  if (_colorMode === 'A') {
    var ref = v >= 0 ? (_colorMaxPos || maxAbs) : (_colorMaxNeg || maxAbs);
    t = ref > 0 ? Math.min(1, Math.sqrt(Math.abs(v) / ref)) : 0;
  } else if (_colorMode === 'B') {
    var lm = localMax != null ? localMax : maxAbs;
    t = lm > 0 ? Math.min(1, Math.sqrt(Math.abs(v) / lm)) : 0;
  } else if (_colorMode === 'C') {
    t = Math.min(1, Math.pow(Math.abs(v) / maxAbs, 0.65));
  } else {
    t = Math.min(1, Math.sqrt(Math.abs(v) / maxAbs));
  }
  var idx = Math.min(4, Math.floor(t * 5));
  return v >= 0 ? POS_RAMP[idx] : NEG_RAMP[idx];
}
function contribFg(v, maxAbs, localMax) {
  if (!maxAbs || maxAbs < 1e-9) return '#1E2D3D';
  var t;
  if (_colorMode === 'A') {
    var ref = v >= 0 ? (_colorMaxPos || maxAbs) : (_colorMaxNeg || maxAbs);
    t = ref > 0 ? Math.min(1, Math.sqrt(Math.abs(v) / ref)) : 0;
  } else if (_colorMode === 'B') {
    var lm = localMax != null ? localMax : maxAbs;
    t = lm > 0 ? Math.min(1, Math.sqrt(Math.abs(v) / lm)) : 0;
  } else if (_colorMode === 'C') {
    t = Math.min(1, Math.pow(Math.abs(v) / maxAbs, 0.65));
  } else {
    t = Math.min(1, Math.sqrt(Math.abs(v) / maxAbs));
  }
  return t > 0.52 ? '#FFFFFF' : '#1E2D3D';
}

// SVG element helper
function se(tag, attrs) {
  var e = document.createElementNS(NS, tag);
  Object.keys(attrs).forEach(function(k) { e.setAttribute(k, attrs[k]); });
  return e;
}
// Wrap long name into lines for SVG text
function wrapWords(text, maxW, fontSize) {
  var cw = fontSize * 0.58, maxC = Math.floor(maxW / cw);
  if (text.length <= maxC) return [text];
  var words = text.split(' '), lines = [], cur = '';
  words.forEach(function(w) {
    var test = cur ? cur + ' ' + w : w;
    if (test.length <= maxC) { cur = test; }
    else { if (cur) lines.push(cur); cur = w.length > maxC ? w.slice(0, maxC) : w; }
  });
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}
// Tooltip bind
function bindTip(el, html, maxW) {
  var tip = document.getElementById('ndx-tip');
  if (!tip) return;
  el.addEventListener('pointerenter', function() {
    tip.innerHTML = html; tip.style.maxWidth = (maxW || 260) + 'px'; tip.style.opacity = '1';
  });
  el.addEventListener('pointermove',  function(e) {
    var x = e.clientX + 14, y = e.clientY + 14;
    var r = tip.getBoundingClientRect();
    if (x + r.width  > window.innerWidth  - 8) x = e.clientX - r.width  - 14;
    if (y + r.height > window.innerHeight - 8) y = e.clientY - r.height - 14;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  });
  el.addEventListener('pointerleave', function() { tip.style.opacity = '0'; });
}

// ── KPI tile ──────────────────────────────────────────────────────────────
function computeGlobalAxes() {
  var allRets = [], allWts = [], allContribs = [];
  Object.keys(YEAR_HOCS).forEach(function(yr) {
    var range = YEAR_HOCS[yr];
    var yrHocs = NDX_DATA.hocs.filter(function(h) { return h.n >= range[0] && h.n <= range[1]; });
    var snaps = yrHocs.map(function(_, i) {
      return computeSecurities(new Set(), new Set(), yrHocs.slice(0, i + 1));
    });
    snaps.forEach(function(snap) {
      snap.forEach(function(d) {
        if (!isCash(d.name) && (d.w1 > 0 || d.w0 > 0)) {
          allRets.push(d.ret);
          allWts.push(d.w1);
          allContribs.push(d.contrib);
        }
      });
    });
  });
  if (allRets.length) {
    var rng = Math.max.apply(null, allRets) - Math.min.apply(null, allRets);
    _globalScatterAxes.xLo = Math.min.apply(null, allRets) - rng * 0.05;
    _globalScatterAxes.xHi = Math.max.apply(null, allRets) + rng * 0.05;
    _globalScatterAxes.yHi = Math.max.apply(null, allWts) * 1.08;
  }
  if (allContribs.length) {
    var absMax = Math.max.apply(null, allContribs.map(function(c) { return Math.abs(c); }));
    var cPad = absMax * 0.06;
    _globalBeeAxes.contribHi = absMax * 1.1;
    _globalBeeAxes.xLo = Math.min.apply(null, allContribs) - cPad;
    _globalBeeAxes.xHi = Math.max.apply(null, allContribs) + cPad;
  }
}

function computeYearReturn(yearKey) {
  var range = YEAR_HOCS[yearKey];
  if (!range) return null;
  var hocs = NDX_DATA.hocs.filter(function(h) { return h.n >= range[0] && h.n <= range[1]; });
  if (!hocs.length) return null;
  var logSum = 0;
  hocs.forEach(function(hoc) {
    var hocRet = 0;
    hoc.sec.forEach(function(s) { hocRet += (s.w || 0) * s.r; });
    logSum += Math.log(1 + hocRet / 100);
  });
  return (Math.exp(logSum) - 1) * 100;
}

// ── Hero: NDX Price Return — growth of $100, annual bars, table ───────────
// One control drives the whole block: "Invest $100 at the start of <year>". Everything is
// computed from the HOC returns (Σ w·r per HOC, compounded), so it is measured at each
// rebalance close — there is no intra-HOC price path. The open HOC ends at the latest prices.
var _heroStart = null;     // year key the $100 is invested at (default: the oldest year)

function chronoYears() { return yearKeys().slice().reverse(); }
function hocReturn(h) { var r = 0; h.sec.forEach(function(s) { r += (s.w || 0) * s.r; }); return r; }
function latestDate() {
  var m = (_dataSource && _dataSource.meta) || {};
  var last = NDX_DATA.hocs[NDX_DATA.hocs.length - 1];
  return last.close || m.pricesAsOf || m.extractedAt || last.eff;
}
function dayNum(d) { return Date.parse(d + 'T00:00:00Z') / 864e5; }
function fmtDate(d) {
  var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return M[+d.slice(5, 7) - 1] + ' ' + (+d.slice(8, 10)) + ', ' + d.slice(0, 4);
}
function money(v) { return '$' + (v >= 1000 ? v.toLocaleString('en-US', { maximumFractionDigits: 0 }) : v.toFixed(2)); }

// $100 path from the start of `key` to the latest close: [{ d, v, r, n }]
function growthPath(key) {
  var first = YEAR_HOCS[key][0], last = YEAR_HOCS[yearKeys()[0]][1];
  var hocs = NDX_DATA.hocs.filter(function(h) { return h.n >= first && h.n <= last; });
  var v = 100, pts = [{ d: hocs[0].prev, v: 100, r: null, n: null }];
  hocs.forEach(function(h) {
    var r = hocReturn(h);
    v *= 1 + r / 100;
    pts.push({ d: h.close || latestDate(), v: v, r: r, n: h.n, open: !h.close });
  });
  return pts;
}

window.ndxSetHeroStart = function(key) {
  if (!YEAR_HOCS[key]) return;
  _heroStart = key;
  renderHero();
};

function renderHero() {
  var yrs = chronoYears();
  if (!_heroStart || !YEAR_HOCS[_heroStart]) _heroStart = yrs[0];
  var start = _heroStart, startIdx = yrs.indexOf(start);
  var pts = growthPath(start), end = pts[pts.length - 1];
  var rets = {};
  yrs.forEach(function(k) { rets[k] = computeYearReturn(k); });
  function pct(v, dec) { v = Math.abs(v) < 0.005 ? 0 : v; return (v >= 0 ? '+' : '') + v.toFixed(dec == null ? 2 : dec) + '%'; }

  // Start-year pills (chronological, like everything in this block)
  var pills = document.getElementById('ndx-hero-pills');
  if (pills) pills.innerHTML = yrs.map(function(k) {
    return '<button class="ndx-tab-btn' + (k === start ? ' active' : '') + '" onclick="ndxSetHeroStart(\'' + k + '\')">' + (YR_LABEL[k] || k) + '</button>';
  }).join('');

  // KPI tiles
  var years = (dayNum(end.d) - dayNum(pts[0].d)) / 365.25;
  var total = end.v - 100;
  var cagr = years >= 1 ? (Math.pow(end.v / 100, 1 / years) - 1) * 100 : null;
  var peak = pts[0], dd = 0, ddPeak = null, ddTrough = null;
  pts.forEach(function(p) {
    if (p.v > peak.v) peak = p;
    var x = (p.v / peak.v - 1) * 100;
    if (x < dd) { dd = x; ddPeak = peak; ddTrough = p; }
  });
  var inRange = yrs.slice(startIdx).filter(function(k) { return k.indexOf('ytd') !== 0; });
  var best = inRange.slice().sort(function(a, b) { return rets[b] - rets[a]; })[0];
  var worst = inRange.slice().sort(function(a, b) { return rets[a] - rets[b]; })[0];
  function tile(label, value, sub, color) {
    return '<div class="sc" style="padding:13px 15px"><div class="sl">' + label + '</div>' +
      '<div class="sv" style="font-size:22px;' + (color ? 'color:' + color : '') + '">' + value + '</div>' +
      '<div class="ss">' + sub + '</div></div>';
  }
  var kp = document.getElementById('ndx-hero-kpis');
  if (kp) kp.innerHTML =
    tile('$100 invested ' + fmtDate(pts[0].d), money(end.v), 'worth today (' + fmtDate(end.d) + ')', colr(total)) +
    tile('Total return', pct(total, 1), 'price return, ' + years.toFixed(1) + ' years', colr(total)) +
    tile('Annualized', cagr == null ? '—' : pct(cagr, 1), cagr == null ? 'less than a year invested' : 'compound annual growth rate', cagr == null ? '' : colr(cagr)) +
    tile('Worst drawdown', dd < 0 ? pct(dd, 1) : '0.0%', dd < 0 ? fmtDate(ddPeak.d) + ' → ' + fmtDate(ddTrough.d) : 'never below its peak', dd < 0 ? 'var(--neg)' : '') +
    tile('Best / worst year', best ? pct(rets[best], 1) + ' / ' + pct(rets[worst], 1) : '—',
      best ? (YR_LABEL[best] || best) + ' / ' + (YR_LABEL[worst] || worst) : 'no full year in range');

  renderGrowthChart(pts, start);
  renderAnnualBars(yrs, rets, startIdx, pct);
  renderHeroTable(yrs, rets, pct);
}

// Growth of $100 — x is real time, one point per HOC close, a band per calendar year
function renderGrowthChart(pts, start) {
  var box = document.getElementById('ndx-hero-growth');
  if (!box) return;
  var VW = Math.max(520, Math.round(box.clientWidth || 820)), VH = 300, P = { t: 26, r: 64, b: 26, l: 56 };
  var x0 = dayNum(pts[0].d), x1 = dayNum(pts[pts.length - 1].d);
  var vals = pts.map(function(p) { return p.v; });
  var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
  var step = hi - lo > 400 ? 100 : hi - lo > 150 ? 50 : hi - lo > 60 ? 20 : 10;
  lo = Math.floor(Math.min(lo, 100) / step) * step; hi = Math.ceil(hi / step) * step;
  function X(d) { return P.l + (dayNum(d) - x0) / (x1 - x0 || 1) * (VW - P.l - P.r); }
  function Y(v) { return P.t + (hi - v) / (hi - lo || 1) * (VH - P.t - P.b); }
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block;font-family:Inter,sans-serif' });

  // Year bands + labels
  var firstY = +pts[0].d.slice(0, 4) + 1, lastY = +pts[pts.length - 1].d.slice(0, 4);
  for (var y = firstY; y <= lastY; y++) {
    var a = Math.max(x0, dayNum((y - 1) + '-12-31')), b = Math.min(x1, dayNum(y + '-12-31'));
    var xa = P.l + (a - x0) / (x1 - x0 || 1) * (VW - P.l - P.r), xb = P.l + (b - x0) / (x1 - x0 || 1) * (VW - P.l - P.r);
    if (y % 2 === 0) svg.appendChild(se('rect', { x: xa, y: P.t, width: Math.max(0, xb - xa), height: VH - P.t - P.b, fill: '#F5F7F9' }));
    var yl = se('text', { x: (xa + xb) / 2, y: P.t - 9, 'text-anchor': 'middle', 'font-size': 10.5, 'font-weight': 600, fill: '#6B7785' });
    yl.textContent = y; svg.appendChild(yl);
  }
  // $ grid
  for (var v = lo; v <= hi + 1e-9; v += step) {
    svg.appendChild(se('line', { x1: P.l, x2: VW - P.r, y1: Y(v), y2: Y(v), stroke: v === 100 ? '#9AAAB8' : '#E8ECF0', 'stroke-dasharray': v === 100 ? '4 3' : '' }));
    var t = se('text', { x: P.l - 6, y: Y(v) + 3.5, 'text-anchor': 'end', 'font-size': 10, fill: '#8A93A0' });
    t.textContent = '$' + v; svg.appendChild(t);
  }
  // Area + line
  var line = pts.map(function(p, i) { return (i ? 'L' : 'M') + X(p.d).toFixed(1) + ' ' + Y(p.v).toFixed(1); }).join(' ');
  var up = pts[pts.length - 1].v >= 100;
  svg.appendChild(se('path', { d: line + ' L' + X(pts[pts.length - 1].d).toFixed(1) + ' ' + Y(lo) + ' L' + X(pts[0].d).toFixed(1) + ' ' + Y(lo) + ' Z',
    fill: up ? 'rgba(23,122,78,.08)' : 'rgba(155,42,32,.08)' }));
  svg.appendChild(se('path', { d: line, fill: 'none', stroke: up ? '#177A4E' : '#9B2A20', 'stroke-width': 2.2, 'stroke-linejoin': 'round' }));
  // Points with hover
  pts.forEach(function(p, i) {
    var g = se('g', { class: 'mk', style: 'cursor:default' });
    g.appendChild(se('circle', { cx: X(p.d), cy: Y(p.v), r: 8, fill: 'transparent' }));
    g.appendChild(se('circle', { cx: X(p.d), cy: Y(p.v), r: i === pts.length - 1 ? 4 : 2.4, fill: '#fff', stroke: up ? '#177A4E' : '#9B2A20', 'stroke-width': 1.6 }));
    var since = p.v - 100;
    bindTip(g, '<b style="font-size:13px">' + money(p.v) + '</b> <span style="color:#6B7785">on ' + fmtDate(p.d) + (p.open ? ' (latest)' : '') + '</span>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      (i === 0 ? 'Starting point: $100 invested at the ' + (+p.d.slice(0, 4)) + ' year-end close'
        : 'Since start: <b style="color:' + colr(since) + '">' + (since >= 0 ? '+' : '') + since.toFixed(1) + '%</b>' +
          '<br>HOC ' + p.n + ' return: <span style="color:' + colr(p.r) + '">' + (p.r >= 0 ? '+' : '') + p.r.toFixed(2) + '%</span>') +
      '</span>');
    svg.appendChild(g);
  });
  // End label
  var e = pts[pts.length - 1], el = se('text', { x: X(e.d) + 7, y: Y(e.v) + 4, 'font-size': 12, 'font-weight': 700, fill: up ? '#177A4E' : '#9B2A20' });
  el.textContent = money(e.v); svg.appendChild(el);
  box.innerHTML = ''; box.appendChild(svg);
}

// Annual returns — chronological; years before the start are faded; click a bar to start there
function renderAnnualBars(yrs, rets, startIdx, pct) {
  var box = document.getElementById('ndx-hero-bars');
  if (!box) return;
  var VW = Math.max(260, Math.round(box.clientWidth || 380)), VH = 300, P = { t: 26, r: 8, b: 26, l: 8 };   // real px, same height as the growth chart
  var vals = yrs.map(function(k) { return rets[k]; });
  var lo = Math.floor(Math.min(0, Math.min.apply(null, vals)) / 10) * 10, hi = Math.ceil(Math.max(0, Math.max.apply(null, vals)) / 10) * 10;
  function Y(v) { return P.t + (hi - v) / (hi - lo || 1) * (VH - P.t - P.b); }
  var slot = (VW - P.l - P.r) / yrs.length, bw = slot * 0.62;
  var h = '<svg viewBox="0 0 ' + VW + ' ' + VH + '" style="width:100%;height:auto;display:block;font-family:Inter,sans-serif">';
  h += '<line x1="' + P.l + '" x2="' + (VW - P.r) + '" y1="' + Y(0) + '" y2="' + Y(0) + '" stroke="#9AAAB8"/>';
  yrs.forEach(function(k, i) {
    var v = rets[k], cx = P.l + slot * i + slot / 2, y0 = Y(Math.max(0, v)), y1 = Y(Math.min(0, v));
    var on = i >= startIdx, col = v >= 0 ? '#177A4E' : '#9B2A20';
    h += '<g style="cursor:pointer" onclick="ndxSetHeroStart(\'' + k + '\')"><title>' + (YR_LABEL[k] || k) + ': ' + pct(v) + ' — click to invest $100 from here</title>' +
      '<rect x="' + (cx - slot / 2) + '" y="' + P.t + '" width="' + slot + '" height="' + (VH - P.t - P.b) + '" fill="transparent"/>' +
      '<rect x="' + (cx - bw / 2) + '" y="' + y0 + '" width="' + bw + '" height="' + Math.max(1, y1 - y0) + '" rx="3" fill="' + col + '" opacity="' + (on ? 0.85 : 0.22) + '"/>' +
      '<text x="' + cx + '" y="' + (v >= 0 ? y0 - 5 : y1 + 12) + '" text-anchor="middle" font-size="10" font-weight="700" fill="' + col + '" opacity="' + (on ? 1 : 0.45) + '">' + pct(v, 1) + '</text>' +
      '<text x="' + cx + '" y="' + (VH - 8) + '" text-anchor="middle" font-size="10" font-weight="' + (i === startIdx ? 700 : 500) + '" fill="' + (on ? '#2B3B4E' : '#A5AEB8') + '">' + (YR_LABEL[k] || k).replace('YTD ', 'YTD ') + '</text></g>';
  });
  box.innerHTML = h + '</svg>';
}

// Table: years as columns (chronological), return + what $100 at the start of that year is worth today
function renderHeroTable(yrs, rets, pct) {
  var tb = document.getElementById('ndx-kpi-table');
  if (!tb) return;
  var CELL = 'border:1px solid var(--bdr,#D9DEE4);padding:6px 12px;text-align:center;white-space:nowrap;font-variant-numeric:tabular-nums';
  var HEAD = CELL + ';background:#EEF1F4;color:var(--navy);font-weight:700;font-size:12px';
  var LBL = CELL + ';background:#EEF1F4;color:var(--mu);font-weight:600;font-size:11px;text-align:left';
  var worth = {};
  yrs.forEach(function(k) { var p = growthPath(k); worth[k] = p[p.length - 1].v; });
  tb.innerHTML = '<table style="border-collapse:collapse;font-size:13px;width:100%">' +
    '<tr><th style="' + LBL + '">Year</th>' + yrs.map(function(k) {
      return '<th style="' + HEAD + (k === _heroStart ? ';box-shadow:inset 0 -3px 0 var(--navy)' : '') + '">' + (YR_LABEL[k] || k) + '</th>';
    }).join('') + '</tr>' +
    '<tr><td style="' + LBL + '">Price return</td>' + yrs.map(function(k) {
      return '<td style="' + CELL + ';font-weight:700;font-size:14px;color:' + colr(rets[k]) + '">' + pct(rets[k]) + '</td>';
    }).join('') + '</tr>' +
    '<tr><td style="' + LBL + '">$100 at the start of the year → today</td>' + yrs.map(function(k) {
      return '<td style="' + CELL + ';cursor:pointer;color:' + colr(worth[k] - 100) + '" onclick="ndxSetHeroStart(\'' + k + '\')" title="Show this in the chart">' + money(worth[k]) + '</td>';
    }).join('') + '</tr></table>';
}

function renderKPI(res) {
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  renderHero();

  var tag = document.getElementById('ndx-sim-badge');
  if (!tag) return;
  if (isBase) { tag.style.display = 'none'; return; }
  var diff = res.ytd - baseR.ytd;
  tag.style.display = 'inline-block';
  tag.innerHTML = 'Simulation active&nbsp;&nbsp;<span style="color:' + colr(diff) + ';font-weight:600">' +
    (diff >= 0 ? '+' : '') + diff.toFixed(2) + '% vs base</span>' +
    '&nbsp;&nbsp;<span class="ndx-reset-link" onclick="ndxResetSim()">reset</span>';
}

// ── Bar chart ─────────────────────────────────────────────────────────────
// Shared horizontal bar renderer. Always one year, always green = positive /
// red = negative. Callers pass exactly what to draw, so the top section and
// the Detail section never read each other's state.
//   opts.res      — computeCore result whose values are drawn
//   (row order always follows the latest year — see attrOrder)
//   opts.isIG     — industry groups instead of sectors
//   opts.keys     — explicit row keys (default: every key in res, minus Cash)
//   opts.label    — dataset label for the tooltip
// Min/max contribution across ALL years in YEAR_HOCS (sectors or IGs, Cash excluded).
// Both attribution charts use it, so switching years never rescales the axis.
// One axis for sectors AND industry groups, across every year, so switching tab or year
// never rescales the bars
var _attrAxisCache = {};
function attrAxis() {
  if (_attrAxisCache.all) return _attrAxisCache.all;
  var mn = 0, mx = 0;
  yearKeys().forEach(function(yr) {
    var r = computeCore(new Set(), new Set(), hocsForYear(yr));
    [r.bySec, r.byIG].forEach(function(m) {
      Object.keys(m).forEach(function(key) {
        if (key === CASH) return;
        mn = Math.min(mn, m[key]); mx = Math.max(mx, m[key]);
      });
    });
  });
  return (_attrAxisCache.all = { min: mn, max: mx });
}

// Position of each sector / IG in the latest year, largest contribution first
var _attrOrderCache = {};
function attrOrder(isIG) {
  var k = isIG ? 'ig' : 'sec';
  if (_attrOrderCache[k]) return _attrOrderCache[k];
  // Latest year, largest contribution first; names that are not in the latest year follow,
  // newest year they appear in first, then by their contribution in that year
  var ord = [], seen = new Set();
  yearKeys().forEach(function(yr) {
    var r = computeCore(new Set(), new Set(), hocsForYear(yr));
    var m = isIG ? r.byIG : r.bySec;
    Object.keys(m).filter(function(x) { return x !== CASH && !seen.has(x); })
      .sort(function(a, b) { return m[b] - m[a]; })
      .forEach(function(x) { seen.add(x); ord.push(x); });
  });
  var pos = {};
  ord.forEach(function(x, i) { pos[x] = i; });
  pos[CASH] = ord.length;
  return (_attrOrderCache[k] = pos);
}

function renderAttrChart(canvasId, boxId, opts) {
  var canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return null;
  var isIG  = !!opts.isIG;
  var vals  = isIG ? opts.res.byIG : opts.res.bySec;
  // Row order is anchored to the latest year (YTD 2026) for EVERY year, so names keep
  // their position when switching years; a name absent from that year goes after,
  // ordered by its own value. Chart.js draws the first label at the top.
  var anchor = attrOrder(isIG), u = universe();
  var keys  = (opts.keys || (isIG ? u.igs : u.secs)).filter(function(k) { return k !== CASH; });
  keys.sort(function(a, b) { return anchor[a] - anchor[b]; });

  var full   = keys.map(function(k) { return isIG ? dispIG(k) : dispSec(k); });
  var labels = keys.map(function(k) { return chartLbl(k, isIG); });
  var data   = keys.map(function(k) { return parseFloat((vals[k] || 0).toFixed(6)); });

  // Fixed axis shared by every year (see attrAxis) so bar lengths compare across years;
  // it only widens if a simulation pushes a value past it
  var ax = attrAxis();
  var mn = Math.min.apply(null, data.concat(ax.min)), mx = Math.max.apply(null, data.concat(ax.max));
  // Round the ends out to a clean step so the ticks read 0 / 5 / 10 …
  var span = mx - mn, step = span > 12 ? 5 : span > 5 ? 1 : span > 2 ? 0.5 : 0.25;
  var xLo = Math.floor((mn - span * 0.02) / step) * step, xHi = Math.ceil((mx + span * 0.02) / step) * step;
  var box = document.getElementById(boxId);
  if (box) box.style.height = Math.max(260, keys.length * (isIG ? 26 : 30) + 50) + 'px';

  return new Chart(canvas, {
    type: 'bar',
    data: { labels: labels, datasets: [{
      label: opts.label || '',
      data: data,
      backgroundColor: data.map(function(v) { return v >= 0 ? 'rgba(23,122,78,.72)' : 'rgba(155,42,32,.72)'; }),
      borderColor:     data.map(function(v) { return v >= 0 ? '#177A4E' : '#9B2A20'; }),
      borderWidth: 1, borderRadius: 3, barPercentage: 0.75
    }] },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false, animation: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: {
          title: function(ctx) { return full[ctx[0].dataIndex] || ctx[0].label; },
          label: function(ctx) { var v = ctx.raw; return ' ' + ctx.dataset.label + ': ' + (v >= 0 ? '+' : '') + v.toFixed(2) + '%'; }
        } }
      },
      scales: {
        x: { min: xLo, max: xHi, grid: { color: function(c) { return c.tick.value === 0 ? 'rgba(0,0,0,.25)' : 'rgba(0,0,0,.05)'; } }, border: { display: false },
          ticks: { stepSize: step, font: { size: 10, family: 'Inter,sans-serif' }, color: '#8A93A0',
            callback: function(v) { return (v >= 0 ? '+' : '') + v.toFixed(1) + '%'; } } },
        y: { grid: { display: false }, border: { display: false },
          ticks: { font: { size: isIG ? 9.5 : 11, family: 'Inter,sans-serif' }, color: '#2B3B4E' } }
      }
    }
  });
}

// Top section — "Attribution by Sector / Industry Group": its own year + tab, no simulation
function renderTopAttrChart() {
  if (_chart) { _chart.destroy(); _chart = null; }
  var res = computeCore(new Set(), new Set(), hocsForYear(_attrChartYear));
  _chart = renderAttrChart('ndx-attr-canvas', 'ndx-chart-section-box', {
    res: res, isIG: _attrChartTab === 'ig', label: YR_LABEL[_attrChartYear] || _attrChartYear
  });
}

window.ndxSetAttrChartYear = function(yr) {
  if (!YEAR_HOCS[yr]) return;
  _attrChartYear = yr;
  document.querySelectorAll('.ndx-attr-yr-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.yr === yr);
  });
  renderTopAttrChart();
};

window.ndxSetAttrChartTab = function(tab) {
  _attrChartTab = tab;
  document.querySelectorAll('[data-attr-chart-tab]').forEach(function(b) {
    b.classList.toggle('active', b.dataset.attrChartTab === tab);
  });
  renderTopAttrChart();
};

// Detail section chart mode — the Detail year only, simulation values, rows ordered by the base case
function renderDetailChart(res) {
  if (_chartSim) { _chartSim.destroy(); _chartSim = null; }
  var isIG = attrTab === 'ig', keys = [];
  sectors.forEach(function(s) {
    if (s === CASH) return;
    if (isIG) (igBySec[s] || []).forEach(function(g) { keys.push(g); });
    else keys.push(s);
  });
  _chartSim = renderAttrChart('ndx-attr-sim-canvas', 'ndx-attr-chart-box', {
    res: res, isIG: isIG, keys: keys, label: YR_LABEL[_attrDetailYear] || _attrDetailYear
  });
}

// ── Squarified treemap algorithm ──────────────────────────────────────────
function squarify(items, x, y, W, H) {
  if (!items.length || W <= 0 || H <= 0) return;
  if (items.length === 1) {
    items[0].rx = x; items[0].ry = y; items[0].rw = W; items[0].rh = H; return;
  }
  var isH = W >= H, fixD = isH ? H : W;
  var split = 1, prevAR = Infinity, rowA = 0;
  for (var i = 0; i < items.length; i++) {
    rowA += items[i].area;
    var sw = rowA / fixD, ar = 0;
    for (var j = 0; j <= i; j++) { var cd = items[j].area / sw; ar = Math.max(ar, Math.max(sw/cd, cd/sw)); }
    if (ar > prevAR && i > 0) break;
    prevAR = ar; split = i + 1;
  }
  var strip = items.slice(0, split), rest = items.slice(split);
  rowA = strip.reduce(function(a, it) { return a + it.area; }, 0);
  var sw2 = rowA / fixD, pos = isH ? y : x;
  for (var k = 0; k < strip.length; k++) {
    var cd2 = strip[k].area / sw2;
    if (isH) { strip[k].rx = x;    strip[k].ry = pos; strip[k].rw = sw2; strip[k].rh = cd2; }
    else      { strip[k].rx = pos;  strip[k].ry = y;   strip[k].rw = cd2; strip[k].rh = sw2; }
    pos += cd2;
  }
  if (rest.length) {
    if (isH) squarify(rest, x + sw2, y, W - sw2, H);
    else     squarify(rest, x, y + sw2, W, H - sw2);
  }
}

// ── Helpers shared by treemap variants ───────────────────────────────────
// Treemap color scale. Positives and negatives are shaded on SEPARATE scales, each
// blending the tile's rank within its sign with √(|v| / largest |v| of that sign).
// One shared scale let IT's +23.7% wash every other tile out to the palest step.
function treemapScale(values) {
  var pos = values.filter(function(v) { return v > 0; }).sort(function(a, b) { return a - b; });
  var neg = values.filter(function(v) { return v < 0; }).map(Math.abs).sort(function(a, b) { return a - b; });
  function t(v) {
    var arr = v > 0 ? pos : neg, a = Math.abs(v);
    if (!arr.length || a < 1e-9) return 0;
    var below = arr.filter(function(x) { return x < a; }).length;
    var rank = arr.length === 1 ? 1 : Math.min(1, below / (arr.length - 1));
    return 0.5 * rank + 0.5 * Math.min(1, Math.sqrt(a / arr[arr.length - 1]));
  }
  return {
    fill: function(v) { if (Math.abs(v) < 1e-9) return '#EDECEA'; var i = Math.min(4, Math.floor(t(v) * 5)); return v > 0 ? POS_RAMP[i] : NEG_RAMP[i]; },
    fg:   function(v) { return t(v) >= 0.6 ? '#FFFFFF' : '#1E2D3D'; }
  };
}

// Wrap without ever cutting a word; null if it cannot fit
function fitLines(text, maxW, fs) {
  var cw = fs * 0.6, maxC = Math.floor(maxW / cw);
  var words = text.split(' '), lines = [], cur = '';
  for (var i = 0; i < words.length; i++) {
    if (words[i].length > maxC) return null;
    var test = cur ? cur + ' ' + words[i] : words[i];
    if (test.length <= maxC) cur = test; else { lines.push(cur); cur = words[i]; }
  }
  if (cur) lines.push(cur);
  return lines;
}
// Label at the largest font (14 → 9 px) where the whole name fits; nothing if it never fits
// (the tooltip still has it). Real pixels: treemaps are drawn at the card's width.
function treemapTileLabel(svg, rx, ry, rw, rh, label, contribStr, fillC, fgC) {
  var fs, lines = null;
  for (fs = 14; fs >= 9; fs -= 0.5) {
    lines = fitLines(label, rw - 10, fs);
    if (lines && lines.length * fs * 1.25 <= rh - 6) break;
    lines = null;
  }
  if (!lines) return;
  var lineH = fs * 1.25, totalH = lines.length * lineH;
  var showC = rh > totalH + fs * 1.9;
  var startY = showC
    ? ry + rh / 2 - (totalH + fs * 1.6) / 2 + fs * 0.82
    : ry + rh / 2 - totalH / 2 + fs * 0.82;
  lines.forEach(function(line, li) {
    var t = se('text', { x: rx + rw / 2, y: startY + li * lineH,
      'text-anchor': 'middle', 'font-family': 'Inter,sans-serif',
      'font-size': fs, 'font-weight': '700', fill: fgC });
    t.textContent = line; svg.appendChild(t);
  });
  if (showC && contribStr) {
    var cfs = Math.max(8, fs - 2);
    var ct = se('text', { x: rx + rw / 2, y: startY + lines.length * lineH + cfs * 0.9,
      'text-anchor': 'middle', 'font-family': 'Inter,sans-serif',
      'font-size': cfs, fill: fgC, opacity: '0.88' });
    ct.textContent = contribStr; svg.appendChild(ct);
  }
}

// ── Sector flat treemap ───────────────────────────────────────────────────
function renderSectorFlatTreemap(res, box, VW, VH) {
  var items = [];
  sectors.forEach(function(s) {
    var w = (_snapN[s]||{w:0}).w;
    if (w < 0.001) return;
    items.push({ key: s, label: dispSec(s), w: w, c: res.bySec[s]||0, excl: exclSecs.has(s) });
  });
  items.sort(function(a, b) {
    if (a.key === CASH) return 1; if (b.key === CASH) return -1; return b.w - a.w;
  });
  // Tiles are sized by weight, but never below TM_MIN of the map so every sector can be
  // read and clicked (tooltips keep the true weight)
  var totalW = items.reduce(function(s, x) { return s + x.w; }, 0) || 100;
  items.forEach(function(it) { it.dw = Math.max(it.w, TM_MIN_SEC * totalW); });
  var totalD = items.reduce(function(s, x) { return s + x.dw; }, 0);
  items.forEach(function(it) { it.area = (it.dw / totalD) * VW * VH; });
  squarify(items, 0, 0, VW, VH);
  var sc = treemapScale(items.filter(function(it) { return it.key !== CASH; }).map(function(it) { return it.c; }));

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, role: 'img',
    style: 'width:100%;height:auto;display:block;overflow:visible' });
  items.forEach(function(item) {
    if (!item.rw || !item.rh) return;
    var rx = item.rx + 1, ry = item.ry + 1,
        rw = Math.max(0, item.rw - 2), rh = Math.max(0, item.rh - 2);
    var g = se('g', { class: 'mk', style: 'cursor:pointer' });
    var cash   = item.key === CASH;
    var fillC  = item.excl ? '#D0D4D8' : cash ? '#E4E7EB' : sc.fill(item.c);
    var fgC    = item.excl ? '#6A7888' : cash ? '#52606D' : sc.fg(item.c);
    var strokeC = item.excl || cash ? '#9AAAB8' : (item.c >= 0 ? '#177A4E' : '#9B2A20');
    g.appendChild(se('rect', { x: rx, y: ry, width: rw, height: rh, rx: 4,
      fill: fillC, stroke: strokeC, 'stroke-opacity': item.excl ? 0.25 : 0.55,
      'stroke-width': 1, opacity: item.excl ? 0.35 : 1 }));
    treemapTileLabel(g, rx, ry, rw, rh, item.label,
      sgn2(item.c) + '%', fillC, fgC);
    var tipC = sgn2(item.c) + '%';
    bindTip(g, '<b style="font-size:13px">' + item.label + '</b>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      'Weight: ' + item.w.toFixed(3) + '%<br>Contribution: ' + tipC +
      '<br><em style="color:#898781">Click to see industry groups</em></span>');
    if (item.key !== CASH) g.setAttribute('onclick', 'ndxShowIGModal(\'' + esc(item.key) + '\')');
    svg.appendChild(g);
  });
  box.appendChild(svg);
}

// ── IG flat treemap ───────────────────────────────────────────────────────
function renderIGFlatTreemap(res, box, VW, VH) {
  var items = [];
  sectors.forEach(function(s) {
    (igBySec[s]||[]).forEach(function(g) {
      if (g === CASH) return;
      var w = (_snapN['ig:'+g]||{w:0}).w;
      if (w < 0.001) return;
      items.push({ key: g, sect: s, label: g, w: w, c: res.byIG[g]||0 });
    });
  });
  items.sort(function(a, b) { return b.w - a.w; });
  var totalW = items.reduce(function(acc, x) { return acc + x.w; }, 0) || 100;
  items.forEach(function(it) { it.area = (it.w / totalW) * VW * VH; });
  squarify(items, 0, 0, VW, VH);
  var sc = treemapScale(items.map(function(it) { return it.c; }));

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, role: 'img',
    style: 'width:100%;height:auto;display:block;overflow:visible' });
  items.forEach(function(item) {
    if (!item.rw || !item.rh) return;
    var rx = item.rx + 1, ry = item.ry + 1,
        rw = Math.max(0, item.rw - 2), rh = Math.max(0, item.rh - 2);
    var g = se('g', { class: 'mk', style: 'cursor:pointer' });
    var fillC  = sc.fill(item.c);
    var fgC    = sc.fg(item.c);
    var strokeC = item.c >= 0 ? '#177A4E' : '#9B2A20';
    g.appendChild(se('rect', { x: rx, y: ry, width: rw, height: rh, rx: 3,
      fill: fillC, stroke: strokeC, 'stroke-opacity': 0.55, 'stroke-width': 1 }));
    treemapTileLabel(g, rx, ry, rw, rh, item.label,
      sgn2(item.c) + '%', fillC, fgC);
    var tipC = sgn2(item.c) + '%';
    bindTip(g, '<b style="font-size:13px">' + item.label + '</b>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      dispSec(item.sect) + '<br>Weight: ' + item.w.toFixed(3) + '%<br>Contribution: ' + tipC +
      '<br><em style="color:#898781">Click to see securities</em></span>');
    g.setAttribute('onclick', 'ndxShowSecuritiesModal(\'' + esc(item.key) + '\')');
    svg.appendChild(g);
  });
  box.appendChild(svg);
}

// Minimum tile sizes (share of the whole map)
var TM_MIN_SEC = 0.012, TM_MIN_IG = 0.012, TM_MIN_SEC_NESTED = 0.03;

// ── Nested IG treemap (sectors as containers, IGs as inner tiles) ─────────
function renderNestedIGTreemap(res, box, VW, VH) {
  var secItems = [];
  sectors.forEach(function(s) {
    if (s === CASH) return;
    var w = (_snapN[s]||{w:0}).w;
    if (w < 0.001) return;
    secItems.push({ key: s, label: dispSec(s), w: w, c: res.bySec[s]||0 });
  });
  secItems.sort(function(a, b) { return b.w - a.w; });
  // Minimum sizes so every group can be read and clicked: each IG gets at least TM_MIN_IG of
  // the map, each sector at least TM_MIN_SEC_NESTED (room for its header + a tile)
  var totalW = secItems.reduce(function(acc, x) { return acc + x.w; }, 0) || 100;
  secItems.forEach(function(it) {
    it.igs = (igBySec[it.key]||[]).filter(function(g) { return g !== CASH; }).map(function(g) {
      var w = (_snapN['ig:'+g]||{w:0}).w;
      return { key: g, label: g, w: w, dw: Math.max(w, TM_MIN_IG * totalW), c: res.byIG[g]||0, sect: it.key };
    }).filter(function(x) { return x.w > 0.001; });
    it.dw = Math.max(it.igs.reduce(function(a, x) { return a + x.dw; }, 0), TM_MIN_SEC_NESTED * totalW);
  });
  var totalD = secItems.reduce(function(acc, x) { return acc + x.dw; }, 0);
  secItems.forEach(function(it) { it.area = (it.dw / totalD) * VW * VH; });
  squarify(secItems, 0, 0, VW, VH);

  var igVals = [];
  sectors.forEach(function(s) {
    (igBySec[s]||[]).forEach(function(g) { if (g !== CASH) igVals.push(res.byIG[g]||0); });
  });
  var sc = treemapScale(igVals);

  var HPAD = 22; // header reserved for sector name
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, role: 'img',
    style: 'width:100%;height:auto;display:block;overflow:visible' });

  secItems.forEach(function(sec) {
    if (!sec.rw || !sec.rh) return;
    var sx = sec.rx, sy = sec.ry, sw = sec.rw, sh = sec.rh;
    var innerX = sx + 3, innerY = sy + HPAD, innerW = sw - 6, innerH = sh - HPAD - 3;

    // Sector container border
    var secStroke = sec.c >= 0 ? '#177A4E' : '#9B2A20';
    svg.appendChild(se('rect', { x: sx, y: sy, width: sw, height: sh, rx: 5,
      fill: 'none', stroke: secStroke, 'stroke-opacity': 0.4, 'stroke-width': 2.5 }));

    // Sector name header
    var hfs = 12, htxt = sec.label + '  ' + (sec.c >= 0 ? '+' : '') + sec.c.toFixed(2) + '%';
    if (htxt.length * hfs * 0.6 > sw - 12) htxt = sec.label;
    while (hfs > 9 && htxt.length * hfs * 0.6 > sw - 12) hfs -= 0.5;
    var hdr = se('text', { x: sx + 7, y: sy + HPAD - 6, 'font-family': 'Inter,sans-serif',
      'font-size': hfs, 'font-weight': '700', fill: '#1E2D3D' });
    hdr.textContent = htxt.length * hfs * 0.6 > sw - 12 ? trunc(htxt, Math.max(3, Math.floor((sw - 12) / (hfs * 0.6)))) : htxt;
    bindTip(hdr, '<b style="font-size:13px">' + sec.label + '</b><span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      'Weight: ' + sec.w.toFixed(3) + '%<br>Contribution: ' + (sec.c >= 0 ? '+' : '') + sec.c.toFixed(2) + '%</span>');
    svg.appendChild(hdr);

    if (innerW < 10 || innerH < 10) return;

    // IG tiles within this sector
    var igItems = sec.igs;
    if (!igItems.length) return;
    var igTotalW = igItems.reduce(function(acc, x) { return acc + x.dw; }, 0) || 1;
    igItems.forEach(function(it) { it.area = (it.dw / igTotalW) * innerW * innerH; });
    squarify(igItems, innerX, innerY, innerW, innerH);

    igItems.forEach(function(item) {
      if (!item.rw || !item.rh) return;
      var rx = item.rx + 1, ry = item.ry + 1,
          rw = Math.max(0, item.rw - 2), rh = Math.max(0, item.rh - 2);
      var g = se('g', { class: 'mk', style: 'cursor:pointer' });
      var fillC  = sc.fill(item.c);
      var fgC    = sc.fg(item.c);
      var strokeC = item.c >= 0 ? '#177A4E' : '#9B2A20';
      g.appendChild(se('rect', { x: rx, y: ry, width: rw, height: rh, rx: 2,
        fill: fillC, stroke: strokeC, 'stroke-opacity': 0.5, 'stroke-width': 0.8 }));
      treemapTileLabel(g, rx, ry, rw, rh, item.label,
        sgn2(item.c) + '%', fillC, fgC);
      var tipC = sgn2(item.c) + '%';
      bindTip(g, '<b style="font-size:13px">' + item.label + '</b>' +
        '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
        dispSec(item.sect) + '<br>Weight: ' + item.w.toFixed(3) + '%<br>Contribution: ' + tipC +
        '<br><em style="color:#898781">Click to see securities</em></span>');
      g.setAttribute('onclick', 'ndxShowSecuritiesModal(\'' + esc(item.key) + '\')');
      svg.appendChild(g);
    });
  });
  box.appendChild(svg);
}

// ── Treemap dispatcher ────────────────────────────────────────────────────
function renderTreemap(res) {
  var box = document.getElementById('ndx-treemap-box');
  if (!box) return;
  // Drawn at the card's real width so font sizes are real pixels
  var VW = Math.max(760, Math.round(box.clientWidth || 1100)), VH = Math.round(VW * 0.55);

  var expandBtn = '<div style="display:flex;justify-content:flex-end;margin-bottom:6px">' +
    '<button onclick="ndxTreemapExpand()" style="font-size:11px;font-weight:600;background:var(--w,#fff);border:1px solid var(--bdr);' +
    'border-radius:6px;padding:3px 9px;cursor:pointer;color:var(--navy)">⤢ Expand</button></div>';

  var inner = document.createElement('div');
  inner.style.cssText = 'position:relative;padding:4px 0';
  inner.innerHTML = expandBtn;
  box.innerHTML = '';
  box.appendChild(inner);

  if (attrTab === 'ig') renderNestedIGTreemap(res, inner, VW, VH);
  else                   renderSectorFlatTreemap(res, inner, VW, VH);

  var legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:16px;font-size:11px;color:var(--mu);margin-top:5px;flex-wrap:wrap';
  var clickNote = attrTab === 'ig' ? 'Industry groups nested in their sector · click tile for securities' : 'Click sector for industry groups';
  legend.innerHTML =
    '<span>Area = index weight at close (very small weights drawn at a minimum size so they can be opened; hover shows the true weight)</span>' +
    '<span style="color:#177A4E;font-weight:600">█</span> Positive contribution &nbsp;' +
    '<span style="color:#9B2A20;font-weight:600">█</span> Negative &nbsp;&middot;&nbsp; ' +
    'Shade = size within its own sign (positives and negatives on separate scales) &nbsp;&middot;&nbsp; ' + clickNote;
  box.appendChild(legend);
}

// ── IG drill-down popup modal ─────────────────────────────────────────────
function getOrCreateModal() {
  var m = document.getElementById('ndx-ig-modal');
  if (m) return m;
  m = document.createElement('div');
  m.id = 'ndx-ig-modal';
  m.style.cssText = 'display:none;position:fixed;inset:0;z-index:2100;background:rgba(15,25,38,.55);' +
    'align-items:center;justify-content:center;backdrop-filter:blur(2px)';
  m.innerHTML =
    '<div style="background:var(--w,#fff);border-radius:14px;padding:28px 28px 22px;' +
    'max-width:780px;width:92%;max-height:85vh;overflow-y:auto;position:relative;' +
    'box-shadow:0 16px 48px rgba(0,0,0,.22)">' +
    '<button onclick="ndxCloseIGModal()" style="position:absolute;top:14px;right:16px;' +
    'font-size:22px;line-height:1;background:none;border:none;cursor:pointer;' +
    'color:var(--mu,#777);padding:0 4px">&times;</button>' +
    '<div id="ndx-ig-modal-title" style="font-size:15px;font-weight:700;color:var(--navy,#1E2D3D);' +
    'margin-bottom:16px"></div>' +
    '<div id="ndx-ig-modal-body"></div>' +
    '</div>';
  m.addEventListener('click', function(e) { if (e.target === m) ndxCloseIGModal(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') ndxCloseIGModal(); });
  document.body.appendChild(m);
  return m;
}

window.ndxShowIGModal = function(sector) {
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  var igs = (igBySec[sector] || []).filter(function(g) { return g !== CASH; });
  if (!igs.length) return;

  var m = getOrCreateModal();
  document.getElementById('ndx-ig-modal-title').textContent =
    dispSec(sector) + '  —  Industry Groups';
  var body = document.getElementById('ndx-ig-modal-body');
  body.innerHTML = '';

  var VW = 720, VH = Math.max(160, Math.min(340, igs.length * 40 + 40));
  var items = igs.map(function(g) {
    return { key: g, label: g, w: (_snapN['ig:'+g]||{w:0}).w, c: res.byIG[g]||0 };
  });
  items.sort(function(a, b) { return b.w - a.w; });
  var totalW = items.reduce(function(s, x) { return s + x.w; }, 0) || 1;
  items.forEach(function(it) { it.area = (it.w / totalW) * VW * VH; });
  squarify(items, 0, 0, VW, VH);

  var sc = treemapScale(items.map(function(it) { return it.c; }));
  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH,
    style: 'width:100%;height:auto;display:block;overflow:visible' });

  items.forEach(function(item) {
    if (!item.rw || !item.rh) return;
    var rx = item.rx + 1, ry = item.ry + 1,
        rw = Math.max(0, item.rw - 2), rh = Math.max(0, item.rh - 2);
    var g = se('g', { class: 'mk', style: 'cursor:default' });
    var fillC   = sc.fill(item.c);
    var fgC     = sc.fg(item.c);
    var strokeC = item.c >= 0 ? '#177A4E' : '#9B2A20';
    g.appendChild(se('rect', { x: rx, y: ry, width: rw, height: rh, rx: 3,
      fill: fillC, stroke: strokeC, 'stroke-opacity': 0.5, 'stroke-width': 1 }));

    if (rw > 40 && rh > 26) {
      var fs = Math.min(13, Math.max(9, Math.min(rw, rh) / 5));
      var lines = wrapWords(item.label, rw - 12, fs);
      var lineH = fs * 1.25, totalLH = lines.length * lineH;
      var showC = rh > totalLH + fs * 2;
      var startY = ry + rh / 2 - (totalLH + (showC ? fs * 1.5 : 0)) / 2 + fs * 0.82;

      lines.forEach(function(line, li) {
        var t = se('text', { x: rx + rw / 2, y: startY + li * lineH,
          'text-anchor': 'middle', 'font-family': 'Inter,sans-serif',
          'font-size': fs, 'font-weight': '700', fill: fgC });
        t.textContent = line; g.appendChild(t);
      });
      if (showC) {
        var cfs = Math.max(8, fs - 2);
        var ct = se('text', { x: rx + rw / 2, y: startY + lines.length * lineH + cfs,
          'text-anchor': 'middle', 'font-family': 'Inter,sans-serif',
          'font-size': cfs, fill: fgC, opacity: '0.88' });
        ct.textContent = sgn2(item.c) + '%';
        g.appendChild(ct);
      }
    }
    var tipC = sgn2(item.c) + '%';
    bindTip(g, '<b style="font-size:13px">' + item.label + '</b>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      'Weight: ' + item.w.toFixed(3) + '%<br>Contribution: ' + tipC + '</span>');
    svg.appendChild(g);
  });
  body.appendChild(svg);

  var thtml = '<table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:14px;font-variant-numeric:tabular-nums">' +
    '<thead><tr><th style="text-align:left;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Industry Group</th>' +
    '<th style="text-align:right;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Weight (close) %</th>' +
    '<th style="text-align:right;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Contribution %</th></tr></thead><tbody>';
  items.slice().sort(function(a, b) { return b.c - a.c; }).forEach(function(item) {
    thtml += '<tr style="cursor:pointer" title="Show securities" onclick="ndxShowSecuritiesModal(\'' + esc(item.key) + '\')">' +
      '<td style="text-align:left;padding:4px 8px;border-bottom:1px solid #f0f0f0;text-decoration:underline dotted;text-underline-offset:3px">' + item.label + '</td>' +
      '<td style="text-align:right;padding:4px 8px;border-bottom:1px solid #f0f0f0">' + item.w.toFixed(3) + '%</td>' +
      '<td style="text-align:right;padding:4px 8px;border-bottom:1px solid #f0f0f0;color:' +
      (item.c >= 0 ? '#177A4E' : '#9B2A20') + ';font-weight:600">' +
      sgn2(item.c) + '%</td></tr>';
  });
  thtml += '</tbody></table>';
  body.insertAdjacentHTML('beforeend', thtml);
  m.style.display = 'flex';
};
window.ndxCloseIGModal = function() {
  var m = document.getElementById('ndx-ig-modal');
  if (m) m.style.display = 'none';
};

// ── Securities popup — click IG in nested/flat-IG treemap ─────────────────
window.ndxShowSecuritiesModal = function(ig) {
  var secs = _securities.filter(function(d) { return d.grp === ig; });
  if (!secs.length) return;
  var m = getOrCreateModal();
  document.getElementById('ndx-ig-modal-title').textContent = ig + '  —  Securities';
  var body = document.getElementById('ndx-ig-modal-body');
  body.innerHTML = '';

  secs.sort(function(a, b) { return b.contrib - a.contrib; });
  var thtml = '<table style="width:100%;border-collapse:collapse;font-size:12px;font-variant-numeric:tabular-nums">' +
    '<thead><tr>' +
    '<th style="text-align:left;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Ticker</th>' +
    '<th style="text-align:left;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Company</th>' +
    '<th style="text-align:right;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Return %</th>' +
    '<th style="text-align:right;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Close Wt %</th>' +
    '<th style="text-align:right;padding:4px 8px;border-bottom:1px solid var(--bdr,#ddd);color:var(--mu)">Contrib %</th>' +
    '</tr></thead><tbody>';
  secs.forEach(function(d) {
    var rc = d.ret >= 0 ? '#177A4E' : '#9B2A20';
    var cc = d.contrib >= 0 ? '#177A4E' : '#9B2A20';
    thtml += '<tr>' +
      '<td style="padding:4px 8px;border-bottom:1px solid #f0f0f0;font-weight:700">' + d.name + '</td>' +
      '<td style="padding:4px 8px;border-bottom:1px solid #f0f0f0;color:#52514e">' + (d.co && d.co !== d.name ? d.co : '—') + '</td>' +
      '<td style="text-align:right;padding:4px 8px;border-bottom:1px solid #f0f0f0;color:' + rc + ';font-weight:600">' + (d.ret >= 0 ? '+' : '') + d.ret.toFixed(2) + '%</td>' +
      '<td style="text-align:right;padding:4px 8px;border-bottom:1px solid #f0f0f0">' + d.w1.toFixed(3) + '%</td>' +
      '<td style="text-align:right;padding:4px 8px;border-bottom:1px solid #f0f0f0;color:' + cc + ';font-weight:600">' + sgn2(d.contrib) + '%</td>' +
      '</tr>';
  });
  thtml += '</tbody></table>';
  body.insertAdjacentHTML('beforeend', thtml);
  m.style.display = 'flex';
};

// ── Treemap fullscreen expand ─────────────────────────────────────────────
window.ndxTreemapExpand = function() {
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  var m = document.getElementById('ndx-treemap-full-modal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'ndx-treemap-full-modal';
    m.style.cssText = 'display:none;position:fixed;inset:0;z-index:2000;background:rgba(15,25,38,.6);' +
      'align-items:center;justify-content:center;backdrop-filter:blur(2px)';
    m.innerHTML = '<div style="background:var(--w,#fff);border-radius:14px;padding:22px 22px 18px;' +
      'width:94vw;max-width:1200px;max-height:90vh;overflow-y:auto;position:relative;' +
      'box-shadow:0 16px 48px rgba(0,0,0,.22)">' +
      '<button onclick="document.getElementById(\'ndx-treemap-full-modal\').style.display=\'none\'" ' +
      'style="position:absolute;top:12px;right:14px;font-size:22px;line-height:1;background:none;' +
      'border:none;cursor:pointer;color:var(--mu,#777);padding:0 4px">&times;</button>' +
      '<div id="ndx-treemap-full-inner" style="padding-top:8px"></div></div>';
    m.addEventListener('click', function(e) { if (e.target === m) m.style.display = 'none'; });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { var fm = document.getElementById('ndx-treemap-full-modal'); if (fm) fm.style.display = 'none'; }
    });
    document.body.appendChild(m);
  }
  var inner = document.getElementById('ndx-treemap-full-inner');
  inner.innerHTML = '';
  var EW = Math.min(1600, Math.round(window.innerWidth * 0.9)), EH = Math.round(EW * 0.55);
  if (attrTab === 'ig') renderNestedIGTreemap(res, inner, EW, EH);
  else                  renderSectorFlatTreemap(res, inner, EW, EH);
  m.style.display = 'flex';
};

window.ndxSetTreemapSubMode = function(mode) {
  treemapSubMode = mode;
  document.querySelectorAll('.ndx-tmsub-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.sub === mode);
  });
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  renderTreemap(isBase ? baseR : computeCore(exclSecs, exclIGs));
};

// Replaced by ndxToggleBeeswarmSector (multi-select pills)

// ── Attribution table ─────────────────────────────────────────────────────
function computeDisplayWeights(exS, exG) {
  var lastHoc = _activeHocs[_activeHocs.length - 1];
  if (!lastHoc) return { sec: {}, ig: {} };
  // Adjusted weights: w_adj(i) = w_i*(1+r_i) / Σ_j[w_j*(1+r_j)] from last active HOC
  var denom = 0;
  lastHoc.sec.forEach(function(s) {
    if (exS.has(s.s) || exG.has(s.g)) return;
    denom += (s.w || 0) * (1 + s.r / 100);
  });
  if (!denom) denom = 1;
  var secW = {}, igW = {};
  lastHoc.sec.forEach(function(s) {
    if (exS.has(s.s) || exG.has(s.g)) return;
    var aw = (s.w || 0) * (1 + s.r / 100) / denom * 100;
    secW[s.s] = (secW[s.s] || 0) + aw;
    igW[s.g]  = (igW[s.g]  || 0) + aw;
  });
  return { sec: secW, ig: igW };
}
function dot(on, sz) {
  sz = sz || 16;
  return on
    ? '<span style="display:inline-block;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:var(--navy);border:2px solid var(--navy);vertical-align:middle"></span>'
    : '<span style="display:inline-block;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:transparent;border:2px solid #9AAAB8;vertical-align:middle"></span>';
}
function selDot(sec, sz) {
  sz = sz || 16;
  var r = sz / 2 - 1.5;
  var cx = sz / 2, cy = sz / 2;
  var fullyExcl = exclSecs.has(sec);
  var igs = igBySec[sec] || [];
  var someExcl = !fullyExcl && igs.some(function(g) { return exclIGs.has(g); });
  var pfx = '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 ' + sz + ' ' + sz + '" style="vertical-align:middle;flex-shrink:0;overflow:visible">';
  if (fullyExcl) {
    return pfx + '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#9AAAB8" stroke-width="2"/></svg>';
  } else if (someExcl) {
    return pfx +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="var(--navy)" stroke-width="1.5"/>' +
      '<path d="M ' + cx + ' ' + (cy - r) + ' A ' + r + ' ' + r + ' 0 0 0 ' + cx + ' ' + (cy + r) + ' Z" fill="var(--navy)"/>' +
      '</svg>';
  } else {
    return pfx + '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="var(--navy)" stroke="var(--navy)" stroke-width="1.5"/></svg>';
  }
}
function renderAttrTable(res) {
  var tbody = document.getElementById('ndx-attr-tbody');
  if (!tbody) return;
  lastBaseR = res;
  var html = '';
  // The table ignores the Sector / Industry Group toggle (that is for Chart and Treemap):
  // it always lists sectors, and each arrow expands that sector's industry groups in place.
  // Row order always comes from the base case (no exclusions) so rows never jump
  // around while simulating — only the numbers change.
  // Sort keys always come from the LATEST year (contribution order = attrOrder, weight =
  // latest close weight), so rows stay put when switching years; absent names show 0
  var secPos = attrOrder(false), igPos = attrOrder(true), aw = _anchorSnapN || _snapN;
  function cmpSec(a, b) {
    if (a === CASH) return 1; if (b === CASH) return -1;
    if (_sortKey === 'name')   return _sortDir * dispSec(a).localeCompare(dispSec(b));
    if (_sortKey === 'weight') return _sortDir * ((aw[b]||{w:0}).w - (aw[a]||{w:0}).w);
    return _sortDir * -(secPos[b] - secPos[a]);
  }
  function cmpIG(a, b) {
    if (a === CASH) return 1; if (b === CASH) return -1;
    if (_sortKey === 'name')   return _sortDir * dispIG(a).localeCompare(dispIG(b));
    if (_sortKey === 'weight') return _sortDir * ((aw['ig:'+b]||{w:0}).w - (aw['ig:'+a]||{w:0}).w);
    return _sortDir * -(igPos[b] - igPos[a]);
  }
  var sortedSecs = sectors.slice().sort(cmpSec);
  var dw = computeDisplayWeights(exclSecs, exclIGs);
  function fmtW(w, excl) {
    if (excl) return '<span style="color:var(--mu)">—</span>';
    return (w || 0).toFixed(2) + '%';
  }
  var NAME = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
  sortedSecs.forEach(function(s) {
    var igs = (igBySec[s]||[]).slice().sort(cmpIG);
    if (!igs.length) return;
    var secExcl = exclSecs.has(s);
    var sn = _snapN[s]||{count:0,w:0}, so = _snap0[s]||{count:0,w:0};
    var hasIGs = s !== CASH && igs.some(function(g) { return g !== CASH; });
    var expanded = _expandedSecs.has(s);
    var arrow = !hasIGs ? '' : '<span onclick="event.stopPropagation();ndxToggleSecExpand(\'' + esc(s) + '\')" title="' + (expanded ? 'Collapse' : 'Expand') + ' industry groups" ' +
          'style="display:inline-block;width:100%;cursor:pointer;user-select:none;color:var(--mu);font-size:10px">' + (expanded ? '▲' : '▼') + '</span>';
    html += '<tr style="background:var(--surface);' + (secExcl?'opacity:.42;':'') + 'cursor:pointer" ' +
      'onclick="event.stopPropagation();ndxToggleSec(\'' + esc(s) + '\')">' +
      '<td style="text-align:center;padding:6px 4px">' + selDot(s, 16) + '</td>' +
      '<td style="text-align:center;padding:6px 0">' + arrow + '</td>' +
      '<td style="font-weight:700;color:var(--navy);' + NAME + '" title="' + dispSec(s).replace(/"/g, '&quot;') + '">' + dispSec(s) + '</td>' +
      '<td class="num" style="color:var(--mu);font-size:11px">' + so.count + ' → ' + sn.count + '</td>' +
      '<td class="num" style="color:var(--mu);font-size:11px">' + fmtW(dw.sec[s], secExcl) + '</td>' +
      '<td class="num" style="font-weight:700">' + fmtC(res.bySec[s]||0) + '</td></tr>';
    if (expanded) {
      igs.forEach(function(g) {
        var igExcl = exclIGs.has(g);
        var anyExcl = secExcl || igExcl;
        var gn = _snapN['ig:'+g]||{count:0,w:0}, go = _snap0['ig:'+g]||{count:0,w:0};
        html += '<tr style="' + (anyExcl?'opacity:.38;':'') + 'cursor:pointer" onclick="event.stopPropagation();ndxToggleIG(\'' + esc(g) + '\')">' +
          '<td style="text-align:center;padding:5px 4px 5px 10px">' + dot(!anyExcl, 13) + '</td>' +
          '<td></td>' +
          '<td style="padding-left:20px;font-size:12px;' + NAME + '" title="' + dispIG(g).replace(/"/g, '&quot;') + '">' + dispIG(g) + '</td>' +
          '<td class="num" style="font-size:11.5px">' + go.count + ' → ' + gn.count + '</td>' +
          '<td class="num" style="font-size:11.5px">' + fmtW(dw.ig[g], anyExcl) + '</td>' +
          '<td class="num">' + fmtC(res.byIG[g]||0) + '</td></tr>';
      });
    }
  });
  html += '<tr style="border-top:2px solid var(--navy);font-weight:700">' +
    '<td></td><td></td><td colspan="3" style="color:var(--navy)">Total</td>' +
    '<td class="num" style="color:' + colr(res.ytd) + ';font-weight:700">' + fmtYTD(res.ytd) + '</td></tr>';
  tbody.innerHTML = html;
  updateArrows();
}
function updateArrows() {
  ['name','weight','contrib'].forEach(function(k) {
    var el = document.getElementById('ndx-sort-' + k);
    if (el) el.textContent = _sortKey === k ? (_sortDir === -1 ? ' ▼' : ' ▲') : '';
  });
}

// ── HOC timeline ─────────────────────────────────────────────────────────
function renderHOC(res) {
  var tbody = document.getElementById('ndx-hoc-tbody');
  if (!tbody) return;
  tbody.innerHTML = res.hocResults.map(function(h) {
    return '<tr>' +
      '<td style="font-weight:700;color:var(--navy);text-align:center">' + h.n + '</td>' +
      '<td>' + h.eff + '</td>' +
      '<td>' + (h.close || '<em style="color:var(--mu)">Open</em>') + '</td>' +
      '<td class="num">' + h.count + '</td>' +
      '<td class="num" style="color:' + colr(h.ret) + ';font-weight:600">' +
      (h.ret>=0?'+':'') + h.ret.toFixed(2) + '%</td></tr>';
  }).join('');
}

// ── Dot Plot — IG contributions ───────────────────────────────────────────
function renderDotPlotIG(res) {
  var box = document.getElementById('ndx-dotplot-box');
  if (!box) return;
  var rows = [];
  sectors.forEach(function(s) {
    (igBySec[s]||[]).forEach(function(g) {
      if (g === CASH) return;
      rows.push({ name: dispIG(g), sector: dispSec(s), c: res.byIG[g]||0,
        w0: (_snap0['ig:'+g]||{w:0}).w, w1: (_snapN['ig:'+g]||{w:0}).w });
    });
  });
  rows.sort(function(a, b) { return b.c - a.c; });

  var rowH = 20, P = { t: 28, r: 90, b: 30, l: 210 }, VW = 900;
  var VH = P.t + rows.length * rowH + P.b;
  var lo = Math.min(-0.5, Math.min.apply(null, rows.map(function(r) { return r.c; })));
  var hi = Math.max.apply(null, rows.map(function(r) { return r.c; })) * 1.05;
  var xa0 = P.l, xa1 = VW - P.r - 60;
  function X(v) { return xa0 + (v - lo) / (hi - lo) * (xa1 - xa0); }

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });

  var step = hi > 8 ? 5 : hi > 2 ? 2.5 : 1;
  for (var t = 0; t <= hi + step; t += step) {
    if (t > hi + 0.01) break;
    svg.appendChild(se('line', { x1: X(t), x2: X(t), y1: P.t - 8, y2: VH - P.b + 2, stroke: '#E5E8EC', 'stroke-width': 1 }));
    var tx = se('text', { x: X(t), y: P.t - 14, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' });
    tx.textContent = (t > 0 ? '+' : '') + t.toFixed(1) + '%'; svg.appendChild(tx);
  }
  svg.appendChild(se('line', { x1: X(0), x2: X(0), y1: P.t - 8, y2: VH - P.b + 2, stroke: '#9AAAB8', 'stroke-width': 1 }));

  rows.forEach(function(r, i) {
    var y = P.t + i * rowH + rowH / 2;
    var g = se('g', { class: 'mk' });
    var col = r.c >= 0 ? '#177A4E' : '#9B2A20';
    var nm = se('text', { x: P.l - 12, y: y + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 11.5, fill: '#2B3B4E' });
    nm.textContent = trunc(r.name, 28); g.appendChild(nm);
    g.appendChild(se('line', { x1: X(0), x2: X(r.c), y1: y, y2: y, stroke: col, 'stroke-opacity': 0.3, 'stroke-width': 2 }));
    var circle = se('circle', { cx: X(r.c), cy: y, r: 5, fill: col, stroke: '#fff', 'stroke-width': 2 });
    g.appendChild(circle);
    var vt = se('text', { x: VW - P.r + 55, y: y + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: col, 'font-weight': '600', 'font-variant-numeric': 'tabular-nums' });
    vt.textContent = (r.c >= 0 ? '+' : '') + r.c.toFixed(2) + '%'; g.appendChild(vt);
    bindTip(g, '<b style="font-size:13px">' + r.name + '</b>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      r.sector + '<br>Contribution: ' + (r.c >= 0 ? '+' : '') + r.c.toFixed(2) + '%' +
      '<br>Weight: ' + r.w0.toFixed(2) + '% → ' + r.w1.toFixed(2) + '%</span>');
    svg.appendChild(g);
  });
  box.innerHTML = ''; box.appendChild(svg);
}

// ── Heatmap — sector × HOC window (green positive, red negative) ──────────
function renderHeatmap() {
  var box = document.getElementById('ndx-heatmap-box');
  if (!box || !baseR) return;
  var hocSecC = baseR.hocSecC, hocResults = baseR.hocResults;
  if (!hocSecC || !hocSecC.length) { box.innerHTML = '<em style="color:var(--mu)">No data</em>'; return; }

  var secs = sectors.filter(function(s) { return s !== CASH; });
  var VW = 900, cellW = (VW - 230) / hocResults.length, cellH = 28;
  var P = { t: 60, l: 215 };
  var VH = P.t + secs.length * cellH + 30;

  var mx = 0;
  hocSecC.forEach(function(sc) { secs.forEach(function(s) { mx = Math.max(mx, Math.abs(sc[s] || 0)); }); });
  function ramp(v) {
    if (Math.abs(v) < 1e-9) return '#EDECEA';
    var t = Math.min(1, Math.sqrt(Math.abs(v) / mx));
    var idx = Math.min(4, Math.floor(t * 5));
    return v > 0 ? POS_RAMP[idx] : NEG_RAMP[idx];
  }
  function hmFg(v) {
    var t = Math.min(1, Math.sqrt(Math.abs(v) / (mx || 1)));
    return t > 0.52 ? '#fff' : '#1E2D3D';
  }

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });

  hocResults.forEach(function(h, j) {
    var lbl = se('text', { x: 0, y: 0, 'text-anchor': 'start', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0',
      transform: 'translate(' + (P.l + j * cellW + cellW / 2) + ',' + (P.t - 10) + ') rotate(-50)' });
    lbl.textContent = h.eff.slice(5); svg.appendChild(lbl);
  });

  secs.forEach(function(s, i) {
    var y = P.t + i * cellH;
    var nm = se('text', { x: P.l - 12, y: y + cellH / 2 + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#2B3B4E' });
    nm.textContent = trunc(dispSec(s), 26); svg.appendChild(nm);
    hocResults.forEach(function(h, j) {
      var v = hocSecC[j][s] || 0;
      var g = se('g', { class: 'mk' });
      g.appendChild(se('rect', { x: P.l + j * cellW + 1, y: y + 1, width: cellW - 2, height: cellH - 2, rx: 3, fill: ramp(v) }));
      // value label if cell wide enough
      if (cellW > 38 && Math.abs(v) > 0.01) {
        var vt = se('text', { x: P.l + j * cellW + cellW / 2, y: y + cellH / 2 + 4, 'text-anchor': 'middle',
          'font-family': 'Inter,sans-serif', 'font-size': 9, fill: hmFg(v), 'font-weight': '600' });
        vt.textContent = (v >= 0 ? '+' : '') + v.toFixed(1); g.appendChild(vt);
      }
      bindTip(g, '<b style="font-size:13px">' + dispSec(s) + ' · HOC ' + h.n + ' (' + h.eff + ')</b>' +
        '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
        'Contribution: ' + (v >= 0 ? '+' : '') + v.toFixed(2) + '%' +
        '<br>Window return: ' + (h.ret >= 0 ? '+' : '') + h.ret.toFixed(2) + '%</span>');
      svg.appendChild(g);
    });
  });

  var legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:16px;font-size:11px;color:var(--mu);margin-top:8px;flex-wrap:wrap;align-items:center';
  legend.innerHTML =
    '<span><span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:' + NEG_RAMP[3] + ';margin-right:5px;vertical-align:-1px"></span>Negative</span>' +
    '<span><span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:#EDECEA;margin-right:5px;vertical-align:-1px"></span>Zero</span>' +
    '<span><span style="display:inline-block;width:11px;height:11px;border-radius:3px;background:' + POS_RAMP[3] + ';margin-right:5px;vertical-align:-1px"></span>Positive</span>';
  box.innerHTML = ''; box.appendChild(svg); box.appendChild(legend);
}

function ndxSetCompYear(yr) {
  _compYear = yr;
  document.querySelectorAll('.ndx-comp-yr-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.yr === yr);
  });
  renderDumbbell();
}

// ── Dumbbell — weight composition open vs close ───────────────────────────
function renderDumbbell() {
  var box = document.getElementById('ndx-dumbbell-box');
  if (!box) return;

  // Own snapshots for _compYear (independent of the simulation and of every other section)
  var snaps = sectorWeightSnaps(_compYear);
  // Same rows in the same order for every year: all sectors of any year, ordered by the
  // LATEST year's opening weight (a sector absent in a year shows 0 → 0)
  var anchor = sectorWeightSnaps(yearKeys()[0]).open;
  var ytd = _compYear.indexOf('ytd') === 0;
  var rows = universe().secs.filter(function(s) { return s !== CASH; }).map(function(s) {
    return { sec: s, name: dispSec(s), w0: snaps.open[s] || 0, w1: snaps.close[s] || 0, a: anchor[s] || 0 };
  }).sort(function(a, b) { return b.a - a.a; });

  // One axis for every year: the largest sector weight seen in ANY year (open or
  // close), rounded up to the next 10%. Adding a year to YEAR_HOCS updates it.
  var hi = 10;
  yearKeys().forEach(function(k) {
    var sn = sectorWeightSnaps(k);
    [sn.open, sn.close].forEach(function(m) {
      Object.keys(m).forEach(function(s) { hi = Math.max(hi, Math.ceil(m[s] / 10) * 10); });
    });
  });

  var VW = 900, rowH = 30, P = { t: 56, r: 190, b: 26, l: 200 };
  var VH = P.t + rows.length * rowH + P.b;
  function X(v) { return P.l + v / hi * (VW - P.l - P.r); }

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });
  for (var t = 0; t <= hi; t += 10) {
    svg.appendChild(se('line', { x1: X(t), x2: X(t), y1: P.t - 10, y2: VH - P.b, stroke: '#E5E8EC', 'stroke-width': 1 }));
    var ax = se('text', { x: X(t), y: P.t - 18, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' });
    ax.textContent = t + '%'; svg.appendChild(ax);
  }
  svg.appendChild(se('line', { x1: X(0), x2: X(0), y1: P.t - 10, y2: VH - P.b, stroke: '#9AAAB8', 'stroke-width': 1 }));
  // Column titles for the numbers on the right
  var closeLbl = ytd ? 'Latest' : 'Close';
  [[VW - P.r + 12, 'start', 'Index weight: open → ' + closeLbl.toLowerCase()], [VW - 6, 'end', 'Change']].forEach(function(h) {
    var ht = se('text', { x: h[0], y: 12, 'text-anchor': h[1], 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0', 'font-weight': '600' });
    ht.textContent = h[2]; svg.appendChild(ht);
  });

  rows.forEach(function(r, i) {
    var y = P.t + i * rowH + rowH / 2;
    var up = r.w1 >= r.w0;
    var col = up ? '#177A4E' : '#9B2A20';
    var g = se('g', { class: 'mk' });
    var nm = se('text', { x: P.l - 14, y: y + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 11.5, fill: '#2B3B4E' });
    nm.textContent = r.name; g.appendChild(nm);
    g.appendChild(se('line', { x1: X(Math.min(r.w0, r.w1)), x2: X(Math.max(r.w0, r.w1)), y1: y, y2: y, stroke: col, 'stroke-width': 3, 'stroke-opacity': 0.45, 'stroke-linecap': 'round' }));
    g.appendChild(se('circle', { cx: X(r.w0), cy: y, r: 5.5, fill: '#fff', stroke: col, 'stroke-width': 2 }));
    g.appendChild(se('circle', { cx: X(r.w1), cy: y, r: 5.5, fill: col, stroke: '#fff', 'stroke-width': 2 }));
    var diff = r.w1 - r.w0;
    var vt1 = se('text', { x: VW - P.r + 12, y: y + 4, 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#2B3B4E', 'font-variant-numeric': 'tabular-nums' });
    vt1.textContent = r.w0.toFixed(1) + '% → ' + r.w1.toFixed(1) + '%';
    g.appendChild(vt1);
    var vt2 = se('text', { x: VW - 6, y: y + 4, 'text-anchor': 'end', 'font-family': 'Inter,sans-serif', 'font-size': 11, fill: diff >= 0 ? '#177A4E' : '#9B2A20', 'font-weight': '600', 'font-variant-numeric': 'tabular-nums' });
    vt2.textContent = (diff >= 0 ? '+' : '') + diff.toFixed(2) + ' pp';
    g.appendChild(vt2);
    bindTip(g, '<b style="font-size:13px">' + r.name + '</b>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      'Share of the index at the start of ' + (YR_LABEL[_compYear] || _compYear) + ': ' + r.w0.toFixed(2) + '%' +
      '<br>' + closeLbl + ': ' + r.w1.toFixed(2) + '%' +
      '<br>Change: ' + (diff >= 0 ? '+' : '') + diff.toFixed(2) + ' percentage points</span>');
    svg.appendChild(g);
  });

  var legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:16px;font-size:11px;color:var(--mu);margin-top:8px;flex-wrap:wrap';
  legend.innerHTML =
    '<span><span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:transparent;border:2px solid #177A4E;box-sizing:border-box;margin-right:5px;vertical-align:-1px"></span>Open weight</span>' +
    '<span><span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#177A4E;margin-right:5px;vertical-align:-1px"></span>Close weight</span>' +
    '<span style="color:#177A4E;font-weight:600">▬</span> gained &nbsp; <span style="color:#9B2A20;font-weight:600">▬</span> lost weight' +
    '<div style="flex-basis:100%;line-height:1.5">Each sector\'s share of the index. <b>Open</b> = weights at the start of the year (the year-end close of the year before); ' +
    '<b>' + closeLbl + '</b> = ' + (ytd ? 'today, with the open HOC drifted to the latest prices' : 'at the year-end close') +
    ' (the last HOC\'s weights moved by each stock\'s return to that date). <b>Change</b> is in percentage points of index weight: ' +
    '48.0% → 47.4% = −0.6 pp. Rows keep the order of ' + (YR_LABEL[yearKeys()[0]] || '') + ' opening weights in every year.</div>';
  box.innerHTML = ''; box.appendChild(svg); box.appendChild(legend);
}

// ── Scatter helpers ───────────────────────────────────────────────────────
function rebuildScatterSnapshots(yr) {
  var range = YEAR_HOCS[yr];
  if (!range) return;
  var yrHocs = NDX_DATA.hocs.filter(function(h) { return h.n >= range[0] && h.n <= range[1]; });

  // Snapshot zero: start of year — all returns = 0, use opening weights
  var zeroSnap = [];
  var firstHoc = yrHocs[0];
  if (firstHoc) {
    firstHoc.sec.forEach(function(s) {
      if (!isCash(s.t) && (s.w || 0) > 0) {
        zeroSnap.push({ name: s.t, co: s.co, sect: s.s, grp: s.g,
                         ret: 0, w0: s.w || 0, w1: s.w || 0, contrib: 0 });
      }
    });
  }

  // Normal snapshots: cumulative return through HOC i+1
  var normalSnaps = yrHocs.map(function(_, i) {
    return computeSecurities(new Set(), new Set(), yrHocs.slice(0, i + 1));
  });

  _scatterSecSnapshots = [zeroSnap].concat(normalSnaps);
  _scatterHocIdx = _scatterSecSnapshots.length - 1;
  // Axes are global — computed once in computeGlobalAxes()
}

function _updateScatterSlider() {
  var sl = document.getElementById('ndx-scatter-hoc-slider');
  var lbl = document.getElementById('ndx-scatter-hoc-label');
  var range = YEAR_HOCS[_scatterYear];
  if (!range) return;
  var yrHocs = NDX_DATA.hocs.filter(function(h) { return h.n >= range[0] && h.n <= range[1]; });
  if (sl) { sl.max = String(_scatterSecSnapshots.length - 1); sl.value = String(_scatterHocIdx); }
  if (lbl) {
    if (_scatterHocIdx === 0) {
      lbl.textContent = 'Start of ' + yearOf(_scatterYear);
    } else {
      var hoc = yrHocs[_scatterHocIdx - 1];  // -1: index 0 is the zero snap
      lbl.textContent = hoc ? ('HOC ' + hoc.n + ' · ' + (hoc.close || hoc.eff + ' (Open)')) : '';
    }
  }
  if (_scatterSecSnapshots[_scatterHocIdx]) renderScatter(_scatterSecSnapshots[_scatterHocIdx]);
}

// ── Beeswarm helpers ──────────────────────────────────────────────────────
function rebuildBeeswarmSecurities(yr) {
  var range = YEAR_HOCS[yr];
  if (!range) return;
  var yrHocs = NDX_DATA.hocs.filter(function(h) { return h.n >= range[0] && h.n <= range[1]; });
  _beeswarmSecAll = computeSecurities(new Set(), new Set(), yrHocs);
}

function beeProgressToHocIdx(yr, progress) {
  var range = YEAR_HOCS[yr];
  if (!range) return 0;
  var yrHocs = NDX_DATA.hocs.filter(function(h) { return h.n >= range[0] && h.n <= range[1]; });
  if (!yrHocs.length) return 0;
  var totalSnaps = yrHocs.length + 1; // 0=zero snap, 1..N=HOC snapshots
  return Math.round(progress / 100 * (totalSnaps - 1));
}

function buildBeeswarmSectorPills() {
  var container = document.getElementById('ndx-bee-pills');
  var igBox = document.getElementById('ndx-bee-ig-pills');
  if (!container) return;
  var secPos = attrOrder(false), igPos = attrOrder(true), u = universe();
  function pill(kind, key, label, act) {
    return '<button class="ndx-tab-btn ndx-bee-pill' + (act ? ' active' : '') + '" data-kind="' + kind + '" data-key="' + esc(key) + '" ' +
      'onclick="' + (kind === 'ig' ? 'ndxSetBeeswarmIG' : 'ndxSetBeeswarmSector') + '(\'' + esc(key) + '\')" style="font-size:11px;padding:3px 9px">' +
      label + '</button>';
  }
  container.innerHTML = u.secs.filter(function(s) { return s !== CASH; })
    .sort(function(a, b) { return secPos[a] - secPos[b]; })
    .map(function(s) { return pill('sec', s, dispSec(s), !_beeswarmActiveIG && s === _beeswarmActiveSector); }).join('');
  if (igBox) igBox.innerHTML = u.igs.filter(function(g) { return g !== CASH; })
    .sort(function(a, b) { return igPos[a] - igPos[b]; })
    .map(function(g) { return pill('ig', g, dispIG(g), g === _beeswarmActiveIG); }).join('');
}

// ── Scatter — weight × return per security ────────────────────────────────
function renderScatter(securities) {
  var box = document.getElementById('ndx-scatter-box');
  if (!box || !securities.length) return;

  var dots = securities.filter(function(d) { return d.w1 > 0 || d.w0 > 0; });
  var VW = 900, P = { t: 40, r: 30, b: 50, l: 60 };
  var VH = 480;
  var cw = VW - P.l - P.r, ch = VH - P.t - P.b;

  // Viewport-based axes — zoom/pan changes these ranges, not the dot positions
  var axes = _scatterViewport || _globalScatterAxes;
  var xLo = axes.xLo != null ? axes.xLo : -5;
  var xHi = axes.xHi != null ? axes.xHi :  5;
  var yLo = axes.yLo || 0;
  var yHi = axes.yHi != null ? axes.yHi : 10;

  function X(v) { return P.l + (v - xLo) / (xHi - xLo) * cw; }
  function Y(v) { return P.t + ch - (v - yLo) / (yHi - yLo) * ch; }

  var maxAbsC = Math.max.apply(null, dots.map(function(d) { return Math.abs(d.contrib); })) || 1;

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH,
    style: 'width:100%;height:auto;display:block;cursor:crosshair' });

  // Axes & gridlines — drawn directly on SVG (no group transform, always correct)
  // ~8 readable ticks whatever the zoom: step = 1 / 2 / 2.5 / 5 × 10^k
  function niceStep(range, target) {
    var raw = range / target, mag = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / mag;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag;
  }
  var xRange = xHi - xLo;
  var xStep = niceStep(xRange, 8);
  var xStart = Math.ceil(xLo / xStep) * xStep;
  for (var xv = xStart; xv <= xHi + xStep * 0.01; xv += xStep) {
    svg.appendChild(se('line', { x1: X(xv), x2: X(xv), y1: P.t, y2: VH - P.b, stroke: '#E5E8EC', 'stroke-width': 1 }));
    var xt = se('text', { x: X(xv), y: VH - P.b + 14, 'text-anchor': 'middle',
      'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' });
    xt.textContent = (xv > 0 ? '+' : '') + (+xv.toFixed(2)) + '%';
    svg.appendChild(xt);
  }
  if (xLo < 0 && xHi > 0) {
    svg.appendChild(se('line', { x1: X(0), x2: X(0), y1: P.t, y2: VH - P.b,
      stroke: '#C0C8D0', 'stroke-width': 1.5 }));
  }
  var yRange = yHi - yLo;
  var yStep = niceStep(yRange, 6);
  var yvStart = Math.ceil(yLo / yStep) * yStep;
  for (var yv = yvStart; yv <= yHi + yStep * 0.01; yv += yStep) {
    svg.appendChild(se('line', { x1: P.l, x2: VW - P.r, y1: Y(yv), y2: Y(yv),
      stroke: '#E5E8EC', 'stroke-width': 1 }));
    var ytxt = se('text', { x: P.l - 6, y: Y(yv) + 4, 'text-anchor': 'end',
      'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' });
    ytxt.textContent = (+yv.toFixed(2)) + '%'; svg.appendChild(ytxt);
  }
  var xal = se('text', { x: P.l + cw / 2, y: VH - 8, 'text-anchor': 'middle',
    'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#8A93A0' });
  xal.textContent = 'Security return (%, compounded)'; svg.appendChild(xal);
  var yal = se('text', { x: 0, y: 0, 'text-anchor': 'middle',
    'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#8A93A0',
    transform: 'translate(12,' + (P.t + ch / 2) + ') rotate(-90)' });
  yal.textContent = 'Closing weight (%)'; svg.appendChild(yal);

  // Top 10 contributors by |contrib| from FINAL snapshot of this year (always labeled)
  var finalSnap = computeSecurities(new Set(), new Set(), hocsForYear(_scatterYear))
    .filter(function(d) { return !isCash(d.name) && (d.w0 > 0 || d.w1 > 0); });
  finalSnap.sort(function(a, b) { return Math.abs(b.contrib) - Math.abs(a.contrib); });
  var top10Names = new Set(finalSnap.slice(0, 10).map(function(d) { return d.name; }));

  // Draw dots — directly on SVG, no group transform
  var labelItems = [];
  dots.forEach(function(d) {
    var cx = X(d.ret), cy = Y(d.w1);
    // Skip dots outside viewport (they'd be drawn outside the chart area)
    if (cx < P.l - 2 || cx > VW - P.r + 2 || cy < P.t - 2 || cy > VH - P.b + 2) return;
    var r = Math.max(3, Math.min(14, Math.sqrt(Math.abs(d.contrib)) * 4));
    var fillC = contribColor(d.contrib, maxAbsC);
    var strokeC = d.contrib >= 0 ? '#177A4E' : '#9B2A20';
    var g = se('g', { class: 'mk' });
    g.appendChild(se('circle', { cx: cx, cy: cy, r: r, fill: fillC, 'fill-opacity': 0.82,
      stroke: strokeC, 'stroke-width': 1.2 }));
    bindTip(g,
      '<b style="font-size:13px">' + d.name + (d.co && d.co !== d.name ? ' — ' + d.co : '') + '</b>' +
      '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
      dispSec(d.sect) + ' / ' + d.grp +
      '<br>Return: ' + (d.ret >= 0 ? '+' : '') + d.ret.toFixed(2) + '%' +
      '<br>Close weight: ' + d.w1.toFixed(3) + '%' +
      '<br>Contribution: ' + sgn2(d.contrib) + '%</span>');
    svg.appendChild(g);
    if (top10Names.has(d.name)) labelItems.push({ name: d.name, cx: cx, cy: cy, r: r });
  });

  // Top-10 labels (always visible regardless of zoom level)
  var placed = [];
  labelItems.sort(function(a, b) { return b.cy - a.cy; });
  labelItems.forEach(function(item) {
    var fs = 10, lh = fs + 2;
    var lx = item.cx + item.r + 3, ly = item.cy - 3;
    placed.forEach(function(p) {
      if (Math.abs(lx - p.lx) < 50 && Math.abs(ly - p.ly) < lh + 1) ly = p.ly - lh - 2;
    });
    ly = Math.max(P.t + fs, Math.min(VH - P.b - 2, ly));
    var t = se('text', { x: lx, y: ly, 'font-family': 'Inter,sans-serif',
      'font-size': fs, 'font-weight': '700', fill: '#1E2D3D', 'pointer-events': 'none' });
    t.textContent = item.name; svg.appendChild(t);
    placed.push({ lx: lx, ly: ly });
  });

  // Wheel zoom — viewport-based (axes re-computed, entire chart re-renders)
  svg.addEventListener('wheel', function(e) {
    e.preventDefault();
    var factor = e.deltaY < 0 ? 1.3 : 1 / 1.3;
    var rect = svg.getBoundingClientRect();
    var cxPx = Math.min(1, Math.max(0, ((e.clientX - rect.left) * (VW / rect.width) - P.l) / cw));
    var cyFrac = 1 - Math.min(1, Math.max(0, ((e.clientY - rect.top) * (VH / rect.height) - P.t) / ch));
    _scatterZoomViewport(factor, cxPx, cyFrac);
  }, { passive: false });

  // Drag to pan — viewport-based
  svg.addEventListener('mousedown', function(e) {
    _scatterDragState = {
      startX: e.clientX, startY: e.clientY,
      vp: JSON.parse(JSON.stringify(_scatterViewport || _globalScatterAxes))
    };
    svg.style.cursor = 'grabbing';
    e.preventDefault();
  });
  svg.addEventListener('mousemove', function(e) {
    if (!_scatterDragState) return;
    var rect = svg.getBoundingClientRect();
    var dxPx = (e.clientX - _scatterDragState.startX) * (VW / rect.width);
    var dyPx = (e.clientY - _scatterDragState.startY) * (VH / rect.height);
    var vp = _scatterDragState.vp;
    var xRng = vp.xHi - vp.xLo, yRng = (vp.yHi - (vp.yLo || 0));
    var dxData = -dxPx / cw * xRng;
    var dyData =  dyPx / ch * yRng;
    var g = _globalScatterAxes;
    var nxLo = Math.max(g.xLo, Math.min(g.xHi - xRng, vp.xLo + dxData));
    var nyLo = Math.max(0,     Math.min(g.yHi - yRng, (vp.yLo || 0) + dyData));
    _scatterViewport = { xLo: nxLo, xHi: nxLo + xRng, yLo: nyLo, yHi: nyLo + yRng };
    if (_scatterSecSnapshots[_scatterHocIdx]) renderScatter(_scatterSecSnapshots[_scatterHocIdx]);
  });
  svg.addEventListener('mouseup',    function() { _scatterDragState = null; svg.style.cursor = 'crosshair'; });
  svg.addEventListener('mouseleave', function() { _scatterDragState = null; });

  var legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:16px;font-size:11px;color:var(--mu);margin-top:8px;flex-wrap:wrap';
  legend.innerHTML =
    'Bubble area ∝ √|contribution| &nbsp;·&nbsp; ' +
    '<span style="color:#177A4E;font-weight:600">●</span> Positive &nbsp; ' +
    '<span style="color:#9B2A20;font-weight:600">●</span> Negative &nbsp;·&nbsp; ' +
    'Top 10 labeled &nbsp;·&nbsp; Scroll or +/− to zoom · drag to pan · ⟳ to reset';
  box.innerHTML = ''; box.appendChild(svg); box.appendChild(legend);
}

// ── Scatter zoom/pan — viewport-based ─────────────────────────────────────
function _scatterZoomViewport(factor, cxFrac, cyFrac) {
  cxFrac = cxFrac != null ? cxFrac : 0.5;
  cyFrac = cyFrac != null ? cyFrac : 0.5;
  var axes = _scatterViewport || _globalScatterAxes;
  var xRng = axes.xHi - axes.xLo;
  var yRng = axes.yHi - (axes.yLo || 0);
  var pivX = axes.xLo + xRng * cxFrac;
  var pivY = (axes.yLo || 0) + yRng * (1 - cyFrac);
  var nxRng = xRng / factor, nyRng = yRng / factor;
  var g = _globalScatterAxes;
  var nxLo = Math.max(g.xLo, Math.min(g.xHi - nxRng, pivX - nxRng * cxFrac));
  var nxHi = Math.min(g.xHi, nxLo + nxRng);
  var nyLo = Math.max(0,     Math.min(g.yHi - nyRng, pivY - nyRng * (1 - cyFrac)));
  var nyHi = Math.min(g.yHi, nyLo + nyRng);
  _scatterViewport = { xLo: nxLo, xHi: nxHi, yLo: nyLo, yHi: nyHi };
  if (_scatterSecSnapshots[_scatterHocIdx]) renderScatter(_scatterSecSnapshots[_scatterHocIdx]);
}

window.ndxScatterZoom = function(factor) { _scatterZoomViewport(factor); };

window.ndxScatterReset = function() {
  _scatterViewport = null; _scatterDragState = null;
  if (_scatterSecSnapshots[_scatterHocIdx]) renderScatter(_scatterSecSnapshots[_scatterHocIdx]);
};

// ── Beeswarm — contributions per security, lane per sector ────────────────
window.ndxSetBeeswarmFilter = function(threshold) {
  _beeswarmFilter = threshold;
  document.querySelectorAll('.ndx-bee-btn').forEach(function(b) {
    b.classList.toggle('active', parseFloat(b.dataset.thr) === threshold);
  });
  renderBeeswarm();
};

function beeswarmLayout(dots, X, r) {
  var placed = [];
  dots.forEach(function(d) {
    var cx = X(d.contrib), cy = 0;
    var diam = r * 2 + 1.5;
    outer: for (var i = 0; i <= 30; i++) {
      var cands = i === 0 ? [0] : [i * diam, -i * diam];
      for (var ci = 0; ci < cands.length; ci++) {
        var ty = cands[ci];
        var ok = true;
        for (var j = 0; j < placed.length; j++) {
          var dx = cx - placed[j].cx, dy = ty - placed[j].cy;
          if (dx * dx + dy * dy < diam * diam) { ok = false; break; }
        }
        if (ok) { cy = ty; break outer; }
      }
    }
    placed.push({ cx: cx, cy: cy });
    d.bx = cx; d.by = cy;
  });
}

function _beeSvgForYear(yr, xLo, xHi, maxAbsC, multiYear, showTitle) {
  var snapIdx = beeProgressToHocIdx(yr, _beeswarmProgress);
  var range = YEAR_HOCS[yr];
  var yrHocs = NDX_DATA.hocs.filter(function(h) { return h.n >= range[0] && h.n <= range[1]; });
  var secs;
  if (snapIdx === 0) {
    var firstHoc = yrHocs[0];
    secs = [];
    if (firstHoc) {
      firstHoc.sec.forEach(function(s) {
        if (!isCash(s.t) && (s.w || 0) > 0) {
          secs.push({ name: s.t, co: s.co, sect: s.s, grp: s.g,
                       ret: 0, w0: s.w || 0, w1: s.w || 0, contrib: 0 });
        }
      });
    }
  } else {
    secs = computeSecurities(new Set(), new Set(), yrHocs.slice(0, snapIdx));
  }

  var filtered = secs.filter(function(d) {
    return Math.abs(d.contrib) > _beeswarmFilter && !isCash(d.name) && (d.w0 > 0 || d.w1 > 0) &&
      (_beeswarmActiveIG ? d.grp === _beeswarmActiveIG : d.sect === _beeswarmActiveSector);
  });

  var secList = [_beeswarmActiveSector];

  var dotR = 5;
  var laneH = 72;
  var P = { t: (showTitle ? 18 : 0) + (multiYear ? 34 : 20), b: 12, l: 20, r: 20 };
  var VW = 900;
  var VH = P.t + secList.length * laneH + P.b;
  var cw = VW - P.l - P.r;
  function X(v) { return P.l + (v - xLo) / (xHi - xLo) * cw; }

  var svg = se('svg', { viewBox: '0 0 ' + VW + ' ' + VH, style: 'width:100%;height:auto;display:block' });

  // "Contribution (%)" — once, on the first chart of the stack
  if (showTitle) {
    var axLbl = se('text', { x: P.l + cw / 2, y: 12, 'text-anchor': 'middle',
      'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#2B3B4E', 'font-weight': '700' });
    axLbl.textContent = 'Contribution to the index return (%)'; svg.appendChild(axLbl);
  }

  // Year label for multi-year mode
  if (multiYear) {
    var ylbl = se('text', { x: P.l + cw / 2, y: (showTitle ? 18 : 0) + 14, 'text-anchor': 'middle',
      'font-family': 'Inter,sans-serif', 'font-size': 11, fill: '#2B3B4E', 'font-weight': '600' });
    ylbl.textContent = YR_LABEL[yr]; svg.appendChild(ylbl);
  }

  // X-axis ticks (top, below both labels)
  var xRange = xHi - xLo;
  var xStep = xRange > 8 ? 2 : xRange > 3 ? 1 : 0.5;
  var xStart = Math.ceil(xLo / xStep) * xStep;
  for (var xv = xStart; xv <= xHi + xStep * 0.5; xv += xStep) {
    svg.appendChild(se('line', { x1: X(xv), x2: X(xv), y1: P.t, y2: VH - P.b, stroke: '#EAEDEF', 'stroke-width': 1 }));
    var xt = se('text', { x: X(xv), y: P.t - 6, 'text-anchor': 'middle', 'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0' });
    xt.textContent = (xv > 0 ? '+' : '') + xv.toFixed(1) + '%'; svg.appendChild(xt);
  }
  if (xLo < 0 && xHi > 0) {
    svg.appendChild(se('line', { x1: X(0), x2: X(0), y1: P.t, y2: VH - P.b, stroke: '#C0C8D0', 'stroke-width': 1.5 }));
  }

  secList.forEach(function(sec, si) {
    var laneY = P.t + si * laneH + laneH / 2;
    svg.appendChild(se('rect', { x: P.l, y: P.t + si * laneH, width: cw, height: laneH, fill: si % 2 === 1 ? '#F7F8FA' : 'none', opacity: '0.6' }));

    var laneDots = filtered;
    if (!laneDots.length) return;
    beeswarmLayout(laneDots, X, dotR);

    laneDots.forEach(function(d) {
      var fillC = contribColor(d.contrib, maxAbsC);
      var strokeC = d.contrib >= 0 ? '#177A4E' : '#9B2A20';
      var gy = Math.max(P.t + si * laneH + dotR + 1, Math.min(P.t + (si + 1) * laneH - dotR - 1, laneY + d.by));
      var g = se('g', { class: 'mk' });
      g.appendChild(se('circle', { cx: d.bx, cy: gy, r: dotR, fill: fillC, 'fill-opacity': 0.85, stroke: strokeC, 'stroke-width': 1.2 }));
      var tipRet = (d.ret >= 0 ? '+' : '') + d.ret.toFixed(2) + '%';
      var tipCon = sgn2(d.contrib) + '%';
      g.setAttribute('title', d.name + ': contrib ' + tipCon + ', return ' + tipRet);
      bindTip(g,
        '<b style="font-size:13px">' + d.name + '</b>' +
        '<span style="display:block;color:#52514e;font-size:12px;margin-top:3px">' +
        d.grp +
        '<br>Return: ' + tipRet +
        '<br>Contribution: ' + tipCon +
        '<br>Close weight: ' + d.w1.toFixed(3) + '%</span>');
      svg.appendChild(g);
    });
  });
  return svg;
}

function renderBeeswarm() {
  var box = document.getElementById('ndx-beeswarm-box');
  if (!box) return;

  var activeYrs = yearKeys().filter(function(k) { return _beeswarmYears.has(k); });   // newest first
  if (!activeYrs.length) return;

  // Global X axis bounds (consistent across all years)
  var xLo = _globalBeeAxes.xLo != null ? _globalBeeAxes.xLo : -3;
  var xHi = _globalBeeAxes.xHi != null ? _globalBeeAxes.xHi : 3;
  var maxAbsC = _globalBeeAxes.contribHi != null ? _globalBeeAxes.contribHi : 1;

  box.innerHTML = '';

  var multiYear = activeYrs.length > 1;
  activeYrs.forEach(function(yr, i) {
    box.appendChild(_beeSvgForYear(yr, xLo, xHi, maxAbsC, multiYear, i === 0));
  });

  var legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:16px;font-size:11px;color:var(--mu);margin-top:6px;flex-wrap:wrap;align-items:center';
  var legendHtml = '<span style="color:#177A4E;font-weight:600">●</span> Positive contribution &nbsp; ' +
    '<span style="color:#9B2A20;font-weight:600">●</span> Negative';
  legendHtml = '<b style="color:var(--navy)">' + (_beeswarmActiveIG ? dispIG(_beeswarmActiveIG) : dispSec(_beeswarmActiveSector)) +
    '</b> &nbsp;·&nbsp; ' + legendHtml + ' &nbsp;·&nbsp; same axis for every year';
  legend.innerHTML = legendHtml;
  box.appendChild(legend);
}

// ── Pareto / Top Contributors ────────────────────────────────────────────
var YR_LABEL  = {};     // filled by deriveYears(): { ytd2026: 'YTD 2026', y2025: '2025' }

function _yearTotalRet(yr) {
  var range = YEAR_HOCS[yr];
  if (!range) return 0;
  var hocs = NDX_DATA.hocs.filter(function(h) { return h.n >= range[0] && h.n <= range[1]; });
  var logSum = 0;
  hocs.forEach(function(hoc) {
    var hocRet = 0;
    hoc.sec.forEach(function(s) { hocRet += (s.w || 0) * s.r; });
    logSum += Math.log(1 + hocRet / 100);
  });
  return (Math.exp(logSum) - 1) * 100;
}

function renderPareto() {
  var box = document.getElementById('ndx-pareto-box');
  if (!box) return;

  // Selected years, newest first — each one is a column group, left to right
  var years = yearKeys().filter(function(k) { return _paretoYears.has(k); });
  var N = _paretoCustomN > 0 ? _paretoCustomN : _paretoN;
  var showAll = N === 0;
  var showPos = _paretoSide !== 'neg', showNeg = _paretoSide !== 'pos';

  // Per year: full ranking by contribution (1 = largest positive contributor)
  var yrData = {};
  years.forEach(function(yr) {
    var ranked = getSecuritiesForYear(yr)
      .filter(function(d) { return !isCash(d.name) && (d.w0 > 0 || d.w1 > 0) && d.sect !== CASH; })
      .sort(function(a, b) { return b.contrib - a.contrib; });
    ranked.forEach(function(d, i) { d.rank = i + 1; });
    // Top N = the first N of the ranking, Bottom N = the last N (worst first), whatever
    // their sign — a bottom is a bottom even if it was flat or slightly positive.
    // In Both they never overlap; All = the whole ranking.
    var n = showAll ? ranked.length : Math.min(N, ranked.length);
    var pos = ranked.slice(0, n);
    var neg = ranked.slice(_paretoSide === 'both' ? Math.max(n, ranked.length - n) : ranked.length - n).reverse();
    [pos, neg].forEach(function(list) { var c = 0; list.forEach(function(d) { c += d.contrib; d.cum = c; }); });
    // Index return on the same basis as the contributions (respects simulation exclusions)
    var total = computeCore(exclSecs, exclIGs, hocsForYear(yr)).ytd;
    yrData[yr] = { n: ranked.length, pos: showPos ? pos : [], neg: showNeg ? neg : [], total: total };
  });

  // ── Toolbar ─────────────────────────────────────────────────────────────────
  var yrPills = yearKeys().map(function(k) {
    return '<button class="ndx-tab-btn ndx-par-yr-btn' + (_paretoYears.has(k) ? ' active' : '') +
      '" data-yr="' + k + '" onclick="ndxToggleParetoYear(\'' + k + '\')">' + (YR_LABEL[k] || k) + '</button>';
  }).join('');
  var nBtns = [5, 10, 20, 0].map(function(nv) {
    var act = _paretoCustomN === 0 && _paretoN === nv;
    return '<button class="ndx-tab-btn ndx-pareto-n-btn' + (act ? ' active' : '') +
      '" data-n="' + nv + '" onclick="ndxSetParetoN(' + nv + ')">' + (nv === 0 ? 'All' : 'Top ' + nv) + '</button>';
  }).join('');
  var customInp = '<input type="number" min="1" max="200" placeholder="Custom" value="' + (_paretoCustomN > 0 ? _paretoCustomN : '') + '" ' +
    'style="width:70px;font-size:11px;padding:3px 6px;border:1px solid var(--rule);border-radius:4px;' +
    'background:var(--surface);color:var(--navy)" onchange="ndxSetParetoCustomN(+this.value)">';
  var sideBtns = [['pos', 'Top'], ['neg', 'Bottom'], ['both', 'Both']].map(function(o) {
    return '<button class="ndx-tab-btn' + (_paretoSide === o[0] ? ' active' : '') + '" onclick="ndxSetParetoSide(\'' + o[0] + '\')">' + o[1] + '</button>';
  }).join('');
  var infoBtns = [['', 'None'], ['sector', 'Sector'], ['ig', 'Industry Group']].map(function(o) {
    return '<button class="ndx-tab-btn' + (_paretoInfo === o[0] ? ' active' : '') + '" onclick="ndxSetParetoInfo(\'' + o[0] + '\')">' + o[1] + '</button>';
  }).join('');
  var SEP = '<div style="width:1px;height:16px;background:var(--rule);flex-shrink:0"></div>';
  var LBL = function(t) { return '<span style="font-size:11px;color:var(--mu)">' + t + '</span>'; };
  var html =
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">' +
      '<div style="display:flex;gap:4px">' + yrPills + '</div>' + SEP +
      '<div style="display:flex;gap:4px">' + nBtns + '</div>' + customInp + SEP +
      LBL('Show') + '<div style="display:flex;gap:4px">' + sideBtns + '</div>' + SEP +
      LBL('Column') + '<div style="display:flex;gap:4px">' + infoBtns + '</div>' +
      '<button class="ndx-tab-btn' + (_paretoCols.has('ret') ? ' active' : '') + '" onclick="ndxToggleParetoCol(\'ret\')">Ret%</button>' + SEP +
      '<button class="ndx-tab-btn" onclick="ndxToggleParetoView()">' + (_paretoView === 'table' ? 'Chart view' : 'Table view') + '</button>' +
    '</div>';

  if (_paretoView === 'chart') {
    var py = years[0], d0 = yrData[py];
    html += _renderParetoChartSVG(d0.pos, d0.neg, d0.total, YR_LABEL[py] || py);
    box.innerHTML = html;
    return;
  }

  // ── TABLE — one column group per year ───────────────────────────────────────
  var showRet = _paretoCols.has('ret');
  var info = _paretoInfo;
  var colsPerYr = 4 + (info ? 1 : 0) + (showRet ? 1 : 0);
  var TH = 'padding:4px 8px;color:var(--mu);font-weight:500;white-space:nowrap';
  var GAP = 'border-left:12px solid transparent';

  var thead = '<thead><tr>';
  years.forEach(function(yr, yi) {
    thead += '<th colspan="' + colsPerYr + '" style="text-align:left;padding:4px 8px 2px;color:var(--navy);font-weight:700;' +
      'border-bottom:1px solid var(--rule);' + (yi ? GAP : '') + '">' + (YR_LABEL[yr] || yr) + '</th>';
  });
  thead += '</tr><tr style="border-bottom:1.5px solid var(--rule)">';
  years.forEach(function(yr, yi) {
    thead += '<th style="text-align:right;' + TH + ';' + (yi ? GAP : '') + '" title="Rank by contribution among all ' + yrData[yr].n + ' constituents of the year">Rank</th>';
    thead += '<th style="text-align:left;' + TH + '">Ticker</th>';
    if (info) thead += '<th style="text-align:left;' + TH + '">' + (info === 'ig' ? 'Industry Group' : 'Sector') + '</th>';
    thead += '<th style="text-align:right;' + TH + '">Contrib</th>';
    thead += '<th style="text-align:right;' + TH + '">Cum.</th>';
    if (showRet) thead += '<th style="text-align:right;' + TH + '" title="Compounded price return of the security while in the index during that year">Ret%</th>';
  });
  thead += '</tr></thead>';

  function cells(d, yi) {
    var first = yi ? GAP + ';' : '';
    if (!d) return '<td style="' + first + 'padding:4px 8px"></td>' + new Array(colsPerYr).join('<td></td>');
    var co = (d.co || d.name).replace(/"/g, '&quot;');
    var cat = info === 'ig' ? dispIG(d.grp) : dispSec(d.sect);
    var NUM = 'text-align:right;padding:4px 8px;font-variant-numeric:tabular-nums';
    return '<td style="' + first + NUM + ';color:var(--mu);font-size:11px">' + d.rank + '</td>' +
      '<td style="padding:4px 8px;white-space:nowrap" title="' + co + '"><b style="font-size:12px;color:var(--navy)">' + d.name + '</b></td>' +
      (info ? '<td style="padding:4px 8px;font-size:11px;color:var(--mu);white-space:nowrap" title="' + cat.replace(/"/g, '&quot;') + '">' + trunc(cat, info === 'ig' ? 30 : 22) + '</td>' : '') +
      '<td style="' + NUM + ';font-weight:600;color:' + colr(d.contrib) + '">' + sgn2(d.contrib) + '%</td>' +
      '<td style="' + NUM + ';color:var(--mu);font-size:11px">' + sgn2(d.cum) + '%</td>' +
      (showRet ? '<td style="' + NUM + ';font-size:11px;color:' + colr(d.ret) + '">' + (d.ret >= 0 ? '+' : '') + d.ret.toFixed(1) + '%</td>' : '');
  }
  function block(key, title) {
    var rows = Math.max.apply(null, years.map(function(yr) { return yrData[yr][key].length; }));
    if (!rows) return '';
    var out = '<tr><td colspan="' + (colsPerYr * years.length) + '" style="padding:8px 8px 3px;font-size:10.5px;font-weight:700;' +
      'letter-spacing:.6px;text-transform:uppercase;color:' + (key === 'pos' ? 'var(--pos)' : 'var(--neg)') + '">' + title + '</td></tr>';
    for (var i = 0; i < rows; i++) {
      out += '<tr style="border-bottom:.5px solid var(--rule);' + (i % 2 ? 'background:var(--surface)' : '') + '">';
      years.forEach(function(yr, yi) { out += cells(yrData[yr][key][i], yi); });
      out += '</tr>';
    }
    return out;
  }
  var tbody = '<tbody>' +
    (showPos ? block('pos', showAll ? 'All constituents, top to bottom' : 'Top ' + N + ' contributors') : '') +
    (showNeg && !(showAll && showPos) ? block('neg', showAll ? 'All constituents, bottom to top' : 'Bottom ' + N + ' contributors') : '') +
    '</tbody>';

  // Footer: what the listed names add up to vs the index return of each year
  var foot = '<tfoot><tr style="border-top:2px solid var(--navy)">';
  years.forEach(function(yr, yi) {
    var d = yrData[yr];
    var shown = d.pos.concat(d.neg).reduce(function(s, x) { return s + x.contrib; }, 0);
    var share = Math.abs(d.total) > 1e-9 ? shown / d.total * 100 : 0;
    foot += '<td colspan="' + colsPerYr + '" style="padding:7px 8px;font-size:11.5px;color:var(--navy);' + (yi ? GAP : '') + '">' +
      'Listed: <b style="color:' + colr(shown) + '">' + (shown >= 0 ? '+' : '') + shown.toFixed(2) + '%</b>' +
      ' of <b style="color:' + colr(d.total) + '">' + (d.total >= 0 ? '+' : '') + d.total.toFixed(2) + '%</b> index return' +
      ' <span style="color:var(--mu)">(' + share.toFixed(0) + '%)</span></td>';
  });
  foot += '</tr></tfoot>';

  // Sized to its columns: each selected year appends a column group on the right
  html += '<div style="overflow-x:auto"><table style="width:auto;border-collapse:collapse;font-size:12px">' +
    thead + tbody + foot + '</table></div>' +
    '<div style="font-size:11px;color:var(--mu);margin-top:8px;line-height:1.5">' +
      '<b>Contrib</b> = Carino-linked contribution to the NDX price return of that year. ' +
      '<b>Cum.</b> = running total down the list. ' +
      (showRet ? '<b>Ret%</b> = each security\'s own compounded price return while it was in the index during that year ' +
        '(full year for names held all year; only the time in the index for names that joined or left). ' : '') +
      '<b>Rank</b> = position among all constituents of that year, 1 = largest contributor.' +
    '</div>';
  box.innerHTML = html;
}

// Bar chart of the listed names (first selected year): green = positive, red = negative,
// dashed line = running total, grey line = index return
function _renderParetoChartSVG(pos, neg, totalRet, yrLabel) {
  var rows = pos.concat(neg);
  if (!rows.length) return '<div style="color:var(--mu);padding:20px">No data</div>';
  var VW = 900, VH = 380, P = { t: 40, r: 70, b: 60, l: 50 };
  var cw = VW - P.l - P.r, ch = VH - P.t - P.b;
  var cum = 0, cumPts = rows.map(function(d) { cum += d.contrib; return cum; });
  var vals = rows.map(function(d) { return d.contrib; }).concat(cumPts, [0, totalRet]);
  var yMax = Math.max.apply(null, vals), yMin = Math.min.apply(null, vals);
  var pad = Math.max((yMax - yMin) * 0.08, 0.05); yMax += pad; yMin -= pad;
  function Y(v) { return P.t + ch - (v - yMin) / (yMax - yMin) * ch; }
  var slotW = cw / rows.length, barW = slotW * 0.6;
  var out = '';
  for (var ti = 0; ti <= 4; ti++) {
    var tv = yMin + (yMax - yMin) * ti / 4, ty = Y(tv);
    out += '<line x1="' + P.l + '" y1="' + ty.toFixed(1) + '" x2="' + (P.l + cw) + '" y2="' + ty.toFixed(1) + '" stroke="rgba(0,0,0,.05)"/>' +
      '<text x="' + (P.l - 4) + '" y="' + (ty + 3).toFixed(1) + '" text-anchor="end" font-size="9" fill="#8A93A0" font-family="Inter,sans-serif">' + (tv >= 0 ? '+' : '') + tv.toFixed(1) + '%</text>';
  }
  out += '<line x1="' + P.l + '" y1="' + Y(0).toFixed(1) + '" x2="' + (P.l + cw) + '" y2="' + Y(0).toFixed(1) + '" stroke="rgba(0,0,0,.25)"/>';
  out += '<line x1="' + P.l + '" y1="' + Y(totalRet).toFixed(1) + '" x2="' + (P.l + cw) + '" y2="' + Y(totalRet).toFixed(1) + '" stroke="#8A93A0" stroke-dasharray="5 3"/>' +
    '<text x="' + (P.l + cw + 4) + '" y="' + (Y(totalRet) + 3).toFixed(1) + '" font-size="9" fill="#8A93A0" font-family="Inter,sans-serif">Index ' + (totalRet >= 0 ? '+' : '') + totalRet.toFixed(1) + '%</text>';
  var pts = [];
  rows.forEach(function(d, i) {
    var cx = P.l + i * slotW + slotW / 2;
    var yt = Y(Math.max(d.contrib, 0)), yb = Y(Math.min(d.contrib, 0));
    out += '<rect x="' + (cx - barW / 2).toFixed(1) + '" y="' + yt.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + Math.max(yb - yt, 1).toFixed(1) +
      '" fill="' + (d.contrib >= 0 ? '#177A4E' : '#9B2A20') + '" opacity=".82" rx="2"><title>' + d.name + ' ' + sgn2(d.contrib) + '%</title></rect>';
    if (rows.length <= 60) out += '<text x="' + cx.toFixed(1) + '" y="' + (P.t + ch + 12) + '" text-anchor="end" font-size="9" fill="#2B3B4E" font-family="Inter,sans-serif" transform="rotate(-45,' + cx.toFixed(1) + ',' + (P.t + ch + 12) + ')">' + d.name + '</text>';
    pts.push(cx.toFixed(1) + ',' + Y(cumPts[i]).toFixed(1));
  });
  if (pts.length > 1) out += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="var(--navy)" stroke-width="1.5" stroke-dasharray="4 2" opacity=".7"/>';
  out += '<text x="' + P.l + '" y="' + (P.t - 16) + '" font-size="11" fill="var(--navy)" font-family="Inter,sans-serif">' + yrLabel +
    ' · dashed = running total of listed names</text>';
  return '<svg viewBox="0 0 ' + VW + ' ' + VH + '" style="width:100%;height:auto;overflow:visible">' + out + '</svg>';
}

function propTabBar(tabs, active, handler) {
  return '<div style="display:flex;gap:4px;margin-bottom:12px">' +
    tabs.map(function(t) {
      return '<button class="ndx-tab-btn' + (t.k === active ? ' active' : '') + '" ' +
        'onclick="' + handler + '(\'' + t.k + '\')">' + t.lbl + '</button>';
    }).join('') +
  '</div>';
}

function getSecuritiesForYear(yr) {
  var range = YEAR_HOCS[yr];
  if (!range) return [];
  var hocs = NDX_DATA.hocs.filter(function(h) { return h.n >= range[0] && h.n <= range[1]; });
  return computeSecurities(exclSecs, exclIGs, hocs);
}

// ── Winners vs Losers helpers ────────────────────────────────────────────
function getWLSecurities() {
  var range = YEAR_HOCS[_wlYear];
  if (!range) return _securities;
  var hocs = NDX_DATA.hocs.filter(function(h) { return h.n >= range[0] && h.n <= range[1]; });
  return computeSecurities(exclSecs, exclIGs, hocs);
}

// Sectors present in the selected year's own constituents (not the Detail section's year)
function wlSectorList(nonCash) {
  var c = {};
  nonCash.forEach(function(d) { c[d.sect] = (c[d.sect] || 0) + d.contrib; });
  return Object.keys(c).sort(function(a, b) { return c[b] - c[a]; });
}

// ── Winners vs Losers — Proposal A: sector matrix table ──────────────────
function renderWLA() {
  var box = document.getElementById('ndx-wl-box');
  if (!box) return;
  var secs = getWLSecurities();
  if (!secs.length) return;
  var nonCash = secs.filter(function(d) { return !isCash(d.name) && d.sect !== CASH && (d.w0 > 0 || d.w1 > 0); });
  var secList = wlSectorList(nonCash);
  // Same open/close sector weights as Index Composition — includes names that joined or left
  var snaps = sectorWeightSnaps(_wlYear);
  var rows = secList.map(function(sec) {
    var arr = nonCash.filter(function(d) { return d.sect === sec; });
    if (!arr.length) return null;
    var contrib = arr.reduce(function(s,d) { return s+d.contrib; }, 0);
    var wSum = arr.reduce(function(s,d) { return s+d.w0; }, 0);
    var avgRet = wSum > 0 ? arr.reduce(function(s,d) { return s+d.ret*d.w0; }, 0) / wSum : 0;
    var wn = arr.filter(function(d) { return d.ret >= avgRet; }).length;
    var ln = arr.filter(function(d) { return d.ret < avgRet; }).length;
    var wChg = (snaps.close[sec] || 0) - (snaps.open[sec] || 0);
    return { sec: sec, contrib: contrib, avgRet: avgRet, wn: wn, ln: ln, wChg: wChg, n: arr.length };
  }).filter(Boolean);
  rows.sort(function(a,b) { return b.contrib - a.contrib; });
  var html = '<div class="twrap"><table class="rt">' +
    '<thead><tr>' +
    '<th>Sector</th><th class="num">Contribution</th><th class="num">Avg Return (wtd)</th>' +
    '<th class="num" style="color:var(--pos)" title="Count of constituents with return ≥ sector weighted-average return">Winners</th>' +
    '<th class="num" style="color:var(--neg)" title="Count of constituents with return < sector weighted-average return">Losers</th>' +
    '<th class="num" title="Sector weight at the last HOC minus the first HOC of the year (same as Index Composition, includes names that joined or left the index)">Wt Δ</th></tr></thead><tbody>';
  rows.forEach(function(r) {
    var cStr = sgn2(r.contrib)+'%';
    var rStr = (r.avgRet>=0?'+':'')+r.avgRet.toFixed(1)+'%';
    var wStr = (r.wChg>=0?'+':'')+r.wChg.toFixed(2)+'pp';
    html += '<tr>' +
      '<td style="font-weight:600;font-size:12px">' + dispSec(r.sec) + '</td>' +
      '<td class="num" style="color:' + colr(r.contrib) + ';font-weight:700">' + cStr + '</td>' +
      '<td class="num" style="color:' + colr(r.avgRet) + '">' + rStr + '</td>' +
      '<td class="num" style="color:var(--pos);font-weight:600">' + r.wn + '/' + r.n + '</td>' +
      '<td class="num" style="color:var(--neg);font-weight:600">' + r.ln + '/' + r.n + '</td>' +
      '<td class="num" style="color:' + colr(r.wChg) + '">' + wStr + '</td>' +
    '</tr>';
  });
  box.innerHTML = html + '</tbody></table></div>';
}

// ── Winners vs Losers — Proposal B: return distribution histogram ─────────
function renderWLB() {
  var box = document.getElementById('ndx-wl-box');
  if (!box) return;
  var secs = getWLSecurities();
  if (!secs.length) return;
  var nonCash = secs.filter(function(d) { return !isCash(d.name) && d.sect !== CASH && (d.w0 > 0 || d.w1 > 0); });
  var bins = [[-1e9,-20],[-20,-10],[-10,-5],[-5,0],[0,5],[5,10],[10,20],[20,1e9]];
  var lbls = ['< -20%','-20 to -10%','-10 to -5%','-5 to 0%','0 to 5%','5 to 10%','10 to 20%','> 20%'];
  var counts = bins.map(function() { return { n:0, contrib:0, names:[] }; });
  nonCash.forEach(function(d) {
    for (var i=0; i<bins.length; i++) {
      if (d.ret >= bins[i][0] && d.ret < bins[i][1]) {
        counts[i].n++; counts[i].contrib += d.contrib; counts[i].names.push(d); break;
      }
    }
  });
  var maxN = Math.max.apply(null, counts.map(function(c){return c.n;})) || 1;
  var VW = 860, VH = 220, P = {t:20,r:20,b:60,l:44};
  var binW = (VW-P.l-P.r)/bins.length - 2;
  var svg = se('svg', { viewBox:'0 0 '+VW+' '+VH, style:'width:100%;height:auto;display:block' });
  counts.forEach(function(c, i) {
    var barH = Math.round(c.n / maxN * (VH-P.t-P.b));
    var x = P.l + i * ((VW-P.l-P.r)/bins.length) + 1;
    var y = VH-P.b-barH;
    var col = i < 4 ? '#9B2A20' : '#177A4E';
    var rect = se('rect', { x:x, y:y, width:binW, height:barH, rx:3, fill:col, opacity:'.75' });
    svg.appendChild(rect);
    // Every ticker in the bin, best return first, in a compact grid
    var tipNames = c.names.length
      ? '<div style="display:grid;grid-template-columns:repeat(' + Math.min(4, Math.ceil(c.names.length / 10)) + ',auto);' +
          'gap:1px 12px;margin-top:5px;font-size:10.5px;font-variant-numeric:tabular-nums">' +
          c.names.slice().sort(function(a, b) { return b.ret - a.ret; }).map(function(d) {
            return '<span><b>' + d.name + '</b> <span style="color:' + colr(d.ret) + '">' + (d.ret >= 0 ? '+' : '') + d.ret.toFixed(1) + '%</span></span>';
          }).join('') + '</div>'
      : '';
    var hitbox = se('rect', { x: x, y: P.t, width: binW, height: VH - P.b - P.t, fill: 'transparent' });
    svg.appendChild(hitbox);
    bindTip(hitbox, '<b>' + lbls[i] + '</b> · ' + c.n + ' constituent' + (c.n !== 1 ? 's' : '') + tipNames, 520);
    if (c.n > 0) {
      var nt = se('text', {x:x+binW/2, y:y-4, 'text-anchor':'middle', 'font-family':'Inter,sans-serif', 'font-size':11, fill:'#2B3B4E', 'font-weight':'600', 'pointer-events':'none'});
      nt.textContent = c.n; svg.appendChild(nt);
    }
    var xt = se('text', {x:x+binW/2, y:VH-P.b+14, 'text-anchor':'middle', 'font-family':'Inter,sans-serif', 'font-size':9.5, fill:'#8A93A0'});
    xt.textContent = lbls[i]; svg.appendChild(xt);
    xt.setAttribute('transform', 'rotate(-35,' + (x+binW/2) + ',' + (VH-P.b+14) + ')');
    xt.setAttribute('text-anchor', 'end');
  });
  for (var g=0; g<=4; g++) {
    var yv = Math.round(g/4 * maxN);
    var yp = VH-P.b - Math.round(g/4*(VH-P.t-P.b));
    var yt = se('text', {x:P.l-4, y:yp+4, 'text-anchor':'end', 'font-family':'Inter,sans-serif', 'font-size':10, fill:'#8A93A0'});
    yt.textContent = yv; svg.appendChild(yt);
  }
  // X axis title
  var xTitle = se('text', { x: P.l + (VW-P.l-P.r)/2, y: VH - 4, 'text-anchor': 'middle',
    'font-family': 'Inter,sans-serif', 'font-size': 10, fill: '#8A93A0', 'font-style': 'italic' });
  xTitle.textContent = 'Security Return while in index (%)';
  svg.appendChild(xTitle);

  box.innerHTML = '';
  box.appendChild(svg);
  var leg = document.createElement('div');
  leg.style.cssText = 'font-size:11px;color:var(--mu);margin-top:6px';
  leg.textContent = 'Each bar = number of constituents with return in that range. Hover to see names. Return = Carino-linked cumulative return for each security during the period it was active in the index.';
  box.appendChild(leg);
}

// ── Winners vs Losers — Proposal C: top / bottom per sector ──────────────
function renderWLC() {
  var box = document.getElementById('ndx-wl-box');
  if (!box) return;
  var wlSecs = getWLSecurities();
  if (!wlSecs.length) return;
  var nonCash = wlSecs.filter(function(d) { return !isCash(d.name) && d.sect !== CASH && (d.w0 > 0 || d.w1 > 0); });
  var secList = wlSectorList(nonCash);

  var html = '<div class="twrap"><table class="rt">' +
    '<thead><tr>' +
    '<th>Sector</th>' +
    '<th title="Highest contribution (weight × return) in sector">Top Name</th>' +
    '<th class="num">Contribution</th>' +
    '<th title="Lowest contribution in sector">Bottom Name</th>' +
    '<th class="num">Contribution</th>' +
    '</tr></thead><tbody>';
  secList.forEach(function(sec) {
    var arr = nonCash.filter(function(d){return d.sect===sec;});
    if (!arr.length) return;
    var sorted = arr.slice().sort(function(a,b){return b.contrib-a.contrib;});
    if (arr.length === 1) {
      var only = sorted[0];
      var oc = sgn2(only.contrib)+'%';
      html += '<tr>' +
        '<td style="font-weight:600;font-size:12px;color:var(--navy)">' + dispSec(sec) + '</td>' +
        '<td colspan="4" style="font-size:12px;color:var(--mu);font-style:italic">' +
          '<b style="color:var(--navy)" title="' + (only.co||'') + '">' + only.name + '</b>' +
          ' — only constituent, contrib: <b style="color:' + colr(only.contrib) + '">' + oc + '</b>' +
        '</td>' +
      '</tr>';
    } else {
      var best = sorted[0], worst = sorted[sorted.length-1];
      var bc = sgn2(best.contrib)+'%';
      var wc = sgn2(worst.contrib)+'%';
      html += '<tr>' +
        '<td style="font-weight:600;font-size:12px;color:var(--navy)">' + dispSec(sec) + '</td>' +
        '<td style="font-size:12px">' +
          '<b style="color:var(--navy)">' + best.name + '</b>' +
          '<span style="font-size:10px;color:var(--mu);margin-left:4px">' + (best.co||'') + '</span>' +
        '</td>' +
        '<td class="num" style="color:' + colr(best.contrib) + ';font-weight:700">' + bc + '</td>' +
        '<td style="font-size:12px">' +
          '<b style="color:var(--navy)">' + worst.name + '</b>' +
          '<span style="font-size:10px;color:var(--mu);margin-left:4px">' + (worst.co||'') + '</span>' +
        '</td>' +
        '<td class="num" style="color:' + colr(worst.contrib) + ';font-weight:700">' + wc + '</td>' +
      '</tr>';
    }
  });
  box.innerHTML = html + '</tbody></table></div>';
}

function renderWLSection() {
  var box = document.getElementById('ndx-wl-box');
  if (!box) return;
  if (_wlTab === 'A') renderWLA();
  else if (_wlTab === 'B') renderWLB();
  else renderWLC();
}

// ── Master refresh ────────────────────────────────────────────────────────
function refresh() {
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  renderKPI(res);
  if (attrMode === 'chart') renderDetailChart(res); else renderTreemap(res);
  renderAttrTable(res);
  _securities = computeSecurities(exclSecs, exclIGs);
  renderPareto();
  renderWLSection();
  _updateScatterSlider();
  renderBeeswarm();
}

function reloadSnapshot() {
  _activeHocs = getActiveHocs();
  if (!_activeHocs.length) return;
  // The include / exclude selection is kept on purpose: moving across years with the same
  // names excluded shows how the index would have looked without them in each period
  sectors = []; igBySec = {}; igToSec = {};
  baseR = computeCore(new Set(), new Set());
  buildHierarchy();
  lockAxes(baseR);
  _securities = computeSecurities(new Set(), new Set());
  rebuildScatterSnapshots(_scatterYear);
  rebuildBeeswarmSecurities(_beeswarmYear);
  // rebuild pills for the new sector list
  buildBeeswarmSectorPills();

  refresh();
  renderDumbbell();
  var last = _activeHocs[_activeHocs.length - 1], first = _activeHocs[0];
  var endLabel = last.close || last.eff + ' (Open)';
  var el;
  el = document.getElementById('ndx-meta-period');
  if (el) el.textContent = 'HOC ' + first.n + ' → HOC ' + last.n + ' (' + endLabel + ')';
  el = document.getElementById('ndx-meta-nhocs');
  if (el) el.textContent = _activeHocs.length;
  el = document.getElementById('ndx-meta-const');
  if (el) el.textContent = first.sec.length + ' → ' + last.sec.length;
}

// ── Window handlers ───────────────────────────────────────────────────────
window.ndxToggleSec = function(sec) {
  if (exclSecs.has(sec)) { exclSecs.delete(sec); (igBySec[sec]||[]).forEach(function(g){ exclIGs.delete(g); }); }
  else { exclSecs.add(sec); (igBySec[sec]||[]).forEach(function(g){ exclIGs.add(g); }); }
  refresh();
};
window.ndxToggleIG = function(ig) {
  var sec = igToSec[ig];
  if (exclIGs.has(ig)) {
    exclIGs.delete(ig);
    if (exclSecs.has(sec) && !(igBySec[sec]||[]).every(function(g){ return exclIGs.has(g); })) exclSecs.delete(sec);
  } else {
    exclIGs.add(ig);
    if (sec && (igBySec[sec]||[]).every(function(g){ return exclIGs.has(g); })) exclSecs.add(sec);
  }
  refresh();
};
window.ndxResetSim = function() { exclSecs.clear(); exclIGs.clear(); refresh(); };
window.ndxToggleSecExpand = function(sec) {
  if (_expandedSecs.has(sec)) _expandedSecs.delete(sec); else _expandedSecs.add(sec);
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  renderAttrTable(isBase ? baseR : computeCore(exclSecs, exclIGs));
};
window.ndxExpandAll = function() {
  sectors.forEach(function(s) { _expandedSecs.add(s); });
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  renderAttrTable(isBase ? baseR : computeCore(exclSecs, exclIGs));
};
window.ndxCollapseAll = function() {
  _expandedSecs.clear();
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  renderAttrTable(isBase ? baseR : computeCore(exclSecs, exclIGs));
};
window.ndxSetDecimals = function(n) {
  _attrDecimals = Math.max(1, Math.min(4, n || 2));
  if (lastBaseR) renderAttrTable(lastBaseR);
};
window.ndxSetAttrTab = function(tab) {
  attrTab = tab;

  document.querySelectorAll('#ndx-attr-tabs .ndx-tab-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.tab === tab); });
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  if (attrMode === 'chart') renderDetailChart(res); else renderTreemap(res);
  renderAttrTable(res);
};
window.ndxSetAttrMode = function(mode) {
  attrMode = mode;
  document.querySelectorAll('#ndx-attr-mode-btns .ndx-tab-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.mode === mode); });
  var cb = document.getElementById('ndx-attr-chart-box'), tb = document.getElementById('ndx-treemap-box');
  var tw = document.getElementById('ndx-attr-table-wrap');
  if (cb) cb.style.display = mode === 'chart'   ? '' : 'none';
  if (tb) tb.style.display = mode === 'treemap' ? '' : 'none';
  if (tw) tw.style.display = mode === 'table'   ? '' : 'none';
  // Sector / Industry Group applies to Chart and Treemap only; Expand / Collapse to the table only
  var tabs = document.getElementById('ndx-attr-tabs'), eb = document.getElementById('ndx-expand-btns');
  if (tabs) tabs.style.display = mode === 'table' ? 'none' : 'flex';
  if (eb)   eb.style.display   = mode === 'table' ? 'flex' : 'none';
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  if (mode === 'chart') {
    renderDetailChart(res);
  } else {
    if (_chartSim) { _chartSim.destroy(); _chartSim = null; }
    if (mode === 'treemap') renderTreemap(res);
  }
};
window.ndxSort = function(key) {
  if (_sortKey === key) { _sortDir = -_sortDir; }
  else { _sortKey = key; _sortDir = key === 'name' ? 1 : -1; }
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  renderAttrTable(isBase ? baseR : computeCore(exclSecs, exclIGs));
};
window.ndxSetAttrDetailYear = function(yr) {
  _attrDetailYear = yr;
  var range = YEAR_HOCS[yr];
  if (!range) return;
  _fromHoc = range[0]; _toHoc = range[1];
  document.querySelectorAll('.ndx-attr-det-yr-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.yr === yr);
  });
  reloadSnapshot();
};
window.ndxSetYear = function(yr) {
  var range = YEAR_HOCS[yr];
  if (!range) return;
  _activeYear = yr;
  _fromHoc = range[0]; _toHoc = range[1];
  _beeswarmSectors = new Set();
  _scatterYear = yr; _beeswarmYear = yr; _beeswarmYears = new Set([yr]);
  document.querySelectorAll('.ndx-yr-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.yr === yr);
  });
  document.querySelectorAll('.ndx-scat-yr-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.yr === yr);
  });
  document.querySelectorAll('.ndx-bee-yr-btn').forEach(function(b) {
    b.classList.toggle('active', _beeswarmYears.has(b.dataset.yr));
  });
  reloadSnapshot();
};

window.ndxSetScatterYear = function(yr) {
  if (!YEAR_HOCS[yr]) return;
  _scatterYear = yr;
  _scatterViewport = null; _scatterDragState = null;
  document.querySelectorAll('.ndx-scat-yr-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.yr === yr);
  });
  rebuildScatterSnapshots(yr);
  _updateScatterSlider();
};

window.ndxSetScatterHoc = function(idx) {
  _scatterHocIdx = Math.max(0, Math.min(_scatterSecSnapshots.length - 1, idx));
  _scatterViewport = null;  // reset zoom on HOC change
  _updateScatterSlider();
};

window.ndxSetBeeswarmYear = function(yr) {
  if (!YEAR_HOCS[yr]) return;
  _beeswarmYear = yr;
  _beeswarmYears = new Set([yr]);
  _beeswarmSectors = new Set();
  document.querySelectorAll('.ndx-bee-yr-btn').forEach(function(b) {
    b.classList.toggle('active', _beeswarmYears.has(b.dataset.yr));
  });
  rebuildBeeswarmSecurities(yr);
  buildBeeswarmSectorPills();
  renderBeeswarm();
};

window.ndxToggleBeeYear = function(yr) {
  if (!YEAR_HOCS[yr]) return;
  if (_beeswarmYears.has(yr)) {
    if (_beeswarmYears.size > 1) _beeswarmYears.delete(yr);
  } else {
    _beeswarmYears.add(yr);
  }
  document.querySelectorAll('.ndx-bee-yr-btn').forEach(function(b) {
    b.classList.toggle('active', _beeswarmYears.has(b.dataset.yr));
  });
  renderBeeswarm();
};

window.ndxSetBeeProgress = function(pct) {
  _beeswarmProgress = pct;
  var lbl = document.getElementById('ndx-bee-progress-lbl');
  if (lbl) lbl.textContent = pct + '%';
  renderBeeswarm();
};

window.ndxToggleBeeswarmSector = function(sec) {
  // legacy — kept for any stale calls; delegates to new handler
  if (sec) ndxSetBeeswarmSector(sec);
};
window.ndxSetBeeswarmSector = function(sec) {
  _beeswarmActiveSector = sec; _beeswarmActiveIG = null;     // one filter at a time
  buildBeeswarmSectorPills();
  renderBeeswarm();
};
window.ndxSetBeeswarmIG = function(ig) {
  _beeswarmActiveIG = ig;
  buildBeeswarmSectorPills();
  renderBeeswarm();
};

window.ndxSetColorMode = function(m) {
  _colorMode = m;
  document.querySelectorAll('.ndx-color-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.mode === m);
  });
  var isBase = exclSecs.size === 0 && exclIGs.size === 0;
  var res = isBase ? baseR : computeCore(exclSecs, exclIGs);
  if (attrMode === 'treemap') renderTreemap(res);
  renderBeeswarm();
};

window.ndxSetCompYear = function(yr) { ndxSetCompYear(yr); };

window.ndxSetWLTab = function(t) {
  _wlTab = t;
  document.querySelectorAll('.ndx-wl-tab').forEach(function(b) {
    b.classList.toggle('active', b.dataset.tab === t);
  });
  renderWLSection();
};

window.ndxSetWLYear = function(yr) {
  if (!YEAR_HOCS[yr]) return;
  _wlYear = yr;
  document.querySelectorAll('.ndx-wl-yr-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.yr === yr);
  });
  renderWLSection();
};

window.ndxSetParetoN = function(n) {
  _paretoN = parseInt(n, 10);
  _paretoCustomN = 0;
  document.querySelectorAll('.ndx-pareto-n-btn').forEach(function(b) {
    b.classList.toggle('active', parseInt(b.dataset.n, 10) === _paretoN);
  });
  renderPareto();
};
window.ndxToggleParetoYear = function(yr) {
  if (_paretoYears.has(yr)) {
    if (_paretoYears.size > 1) _paretoYears.delete(yr);
  } else {
    _paretoYears.add(yr);
  }
  document.querySelectorAll('.ndx-par-yr-btn').forEach(function(b) {
    b.classList.toggle('active', _paretoYears.has(b.dataset.yr));
  });
  renderPareto();
};
window.ndxToggleParetoView = function() {
  _paretoView = _paretoView === 'table' ? 'chart' : 'table';
  renderPareto();
};
window.ndxSetParetoCustomN = function(n) {
  _paretoCustomN = (n && n > 0) ? Math.floor(n) : 0;
  if (_paretoCustomN > 0) {
    document.querySelectorAll('.ndx-pareto-n-btn').forEach(function(b) { b.classList.remove('active'); });
  }
  renderPareto();
};
window.ndxSetParetoSide = function(side) { _paretoSide = side; renderPareto(); };
window.ndxSetParetoInfo = function(info) { _paretoInfo = info; renderPareto(); };
window.ndxToggleParetoCol = function(col) {
  if (_paretoCols.has(col)) _paretoCols.delete(col); else _paretoCols.add(col);
  document.querySelectorAll('.ndx-par-col-btn').forEach(function(b) {
    b.classList.toggle('active', _paretoCols.has(b.dataset.col));
  });
  renderPareto();
};
window.ndxSetFrom = function(n) {
  _fromHoc = parseInt(n, 10);
  if (_toHoc < _fromHoc) { _toHoc = _fromHoc; var ts = document.getElementById('ndx-to-sel'); if (ts) ts.value = n; }
  reloadSnapshot();
};
window.ndxSetTo = function(n) {
  _toHoc = parseInt(n, 10);
  if (_fromHoc > _toHoc) { _fromHoc = _toHoc; var fs = document.getElementById('ndx-from-sel'); if (fs) fs.value = n; }
  reloadSnapshot();
};

// Single-select year pills, one per YEAR_HOCS key (newest first)
function yrBtns(cls, handler, active) {
  return yearKeys().map(function(k) {
    return '<button class="' + cls + ' ndx-tab-btn' + (k === active ? ' active' : '') + '" data-yr="' + k + '" ' +
      'onclick="' + handler + '(\'' + k + '\')">' + (YR_LABEL[k] || k) + '</button>';
  }).join('');
}

// ── Skeleton ──────────────────────────────────────────────────────────────
function hocOpts(sel) {
  return NDX_DATA.hocs.map(function(h) {
    return '<option value="' + h.n + '"' + (h.n === sel ? ' selected' : '') + '>' +
      'HOC ' + h.n + ' — ' + h.eff + (h.close ? '' : ' (Open)') + '</option>';
  }).join('');
}


// "Data as of …" line under the title
function sourceLine() {
  var m = (_dataSource && _dataSource.meta) || {};
  var parts = [];
  if (m.extractedAt) parts.push('Excel extract ' + m.extractedAt);
  if (m.pricesAsOf)  parts.push('open HOC priced ' + m.pricesAsOf + (m.priceSource ? ' (' + m.priceSource + ')' : ''));
  if (!parts.length && NDX_DATA && NDX_DATA.meta && NDX_DATA.meta.latestDate) parts.push('latest HOC ' + NDX_DATA.meta.latestDate);
  if (_dataSource && _dataSource.kind === 'static')
    parts.push('<span title="The ndx-attribution function did not answer; showing the copy bundled with the site">bundled copy</span>');
  return parts.join(' &middot; ');
}

function buildSkeleton() {
  var last  = _activeHocs[_activeHocs.length - 1];
  var first = _activeHocs[0];

  return (
  '<div id="ndx-tip" style="position:fixed;pointer-events:none;opacity:0;transition:opacity .09s;' +
  'background:var(--w,#fff);border:1px solid rgba(0,0,0,.1);border-radius:9px;' +
  'padding:8px 12px;font-size:12px;box-shadow:0 5px 18px rgba(0,0,0,.14);z-index:1999;max-width:260px;font-family:Inter,sans-serif"></div>' +

  '<div class="sec" style="padding-bottom:0">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;padding-bottom:14px">' +
      '<div>' +
        '<div class="sect" style="font-size:17px;font-weight:700;color:var(--navy)">Nasdaq-100 — Return Attribution</div>' +
        '<div style="font-size:11px;color:var(--mu);margin-top:3px">NDX Price Return &middot; Source: Summit NDX NonBBG &middot; ' + sourceLine() + '</div>' +
      '</div>' +
    '</div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr"><span class="sect">NDX Price Return</span>' +
      '<span class="secn">Growth of $100 and yearly returns, measured at each rebalance (HOC) close</span></div>' +
    '<div class="card">' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
        '<span style="font-size:12px;color:var(--navy);font-weight:600">Invest $100 at the start of</span>' +
        '<div id="ndx-hero-pills" style="display:flex;gap:4px;flex-wrap:wrap"></div>' +
        '<div id="ndx-sim-badge" style="display:none;margin-left:auto;font-size:11px;background:rgba(255,180,0,.1);border:1px solid rgba(200,160,0,.35);border-radius:20px;padding:4px 12px;color:#7A5A00"></div>' +
      '</div>' +
      '<div id="ndx-hero-kpis" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-bottom:14px"></div>' +
      '<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start">' +
        '<div style="flex:2 1 520px;min-width:300px">' +
          '<div style="font-size:11px;color:var(--mu);font-weight:600;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">Growth of $100</div>' +
          '<div id="ndx-hero-growth"></div>' +
        '</div>' +
        '<div style="flex:1 1 300px;min-width:260px">' +
          '<div style="font-size:11px;color:var(--mu);font-weight:600;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px">Return by year <span style="text-transform:none;letter-spacing:0;font-weight:400">· click a year to start there</span></div>' +
          '<div id="ndx-hero-bars"></div>' +
        '</div>' +
      '</div>' +
      '<div id="ndx-kpi-table" style="margin-top:14px;overflow-x:auto"></div>' +
      '<div style="font-size:11px;color:var(--mu);margin-top:8px;line-height:1.5">NDX price return (no dividends), compounded HOC by HOC from the Summit NDX NonBBG holdings; the open HOC is valued at the latest prices. ' +
        'Drawdown is measured at HOC closes, so intra-period dips are not captured.</div>' +
    '</div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr"><span class="sect">Attribution by Sector / Industry Group</span></div>' +
    '<div class="card">' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px">' +
        '<div style="display:flex;gap:4px">' +
          yrBtns('ndx-attr-yr-btn', 'ndxSetAttrChartYear', _attrChartYear) +
        '</div>' +
        '<div style="display:flex;gap:3px">' +
          '<button class="ndx-tab-btn active" data-attr-chart-tab="sector" onclick="ndxSetAttrChartTab(\'sector\')">By Sector</button>' +
          '<button class="ndx-tab-btn" data-attr-chart-tab="ig" onclick="ndxSetAttrChartTab(\'ig\')">By Industry Group</button>' +
        '</div>' +
      '</div>' +
      '<div id="ndx-chart-section-box" style="position:relative;height:340px"><canvas id="ndx-attr-canvas"></canvas></div>' +
    '</div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
        '<div>' +
          '<span class="sect">Attribution Detail &amp; Simulation</span>' +
          '<span class="secn" style="display:block;margin-top:2px">Click any row to include / exclude · weights rescale to 100% within each HOC · YTD updates in real time</span>' +
        '</div>' +
        '<div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap">' +
          '<div style="display:flex;gap:3px;margin-right:4px">' +
            yrBtns('ndx-attr-det-yr-btn', 'ndxSetAttrDetailYear', _attrDetailYear) +
          '</div>' +
          '<div id="ndx-attr-tabs" style="display:none;gap:3px">' +
            '<button class="ndx-tab-btn active" data-tab="sector" onclick="ndxSetAttrTab(\'sector\')">By Sector</button>' +
            '<button class="ndx-tab-btn" data-tab="ig" onclick="ndxSetAttrTab(\'ig\')">By Industry Group</button>' +
          '</div>' +
          '<div id="ndx-attr-mode-btns" style="display:flex;gap:3px">' +
            '<button class="ndx-tab-btn" data-mode="chart" onclick="ndxSetAttrMode(\'chart\')">&#9646; Chart</button>' +
            '<button class="ndx-tab-btn" data-mode="treemap" onclick="ndxSetAttrMode(\'treemap\')">Treemap</button>' +
            '<button class="ndx-tab-btn active" data-mode="table" onclick="ndxSetAttrMode(\'table\')">Table</button>' +
          '</div>' +
          '<span id="ndx-expand-btns" style="display:flex;gap:3px">' +
            '<button class="ndx-tab-btn" onclick="ndxExpandAll()">Expand All</button>' +
            '<button class="ndx-tab-btn" onclick="ndxCollapseAll()">Collapse All</button>' +
          '</span>' +
          '<button class="sb-tbtn" onclick="ndxResetSim()">Reset</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="card">' +
      '<div id="ndx-attr-chart-box" style="position:relative;height:340px;display:none"><canvas id="ndx-attr-sim-canvas"></canvas></div>' +
      '<div id="ndx-treemap-box" style="display:none;padding:4px 0"></div>' +
      '<table id="ndx-attr-table-wrap" class="rt" style="width:100%;table-layout:fixed">' +
        '<colgroup><col style="width:32px"><col style="width:26px"><col><col style="width:110px"><col style="width:110px"><col style="width:130px"></colgroup>' +
        '<thead><tr>' +
          '<th></th><th></th>' +
          '<th onclick="ndxSort(\'name\')" style="cursor:pointer;user-select:none">Sector / Industry Group<span id="ndx-sort-name" style="color:var(--mu)"></span></th>' +
          '<th class="num">Stocks</th>' +
          '<th class="num" onclick="ndxSort(\'weight\')" style="cursor:pointer;user-select:none">Weight<span id="ndx-sort-weight" style="color:var(--mu)"></span></th>' +
          '<th class="num" onclick="ndxSort(\'contrib\')" style="cursor:pointer;user-select:none">Contribution<span id="ndx-sort-contrib" style="color:var(--mu)"> ▼</span></th>' +
        '</tr></thead>' +
        '<tbody id="ndx-attr-tbody"></tbody>' +
      '</table>' +
    '</div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
        '<div>' +
          '<span class="sect">Index Composition — Weight Change</span>' +
          '<span class="secn" style="display:block;margin-top:2px">Open weight (hollow) vs. close weight (solid) by sector. Ordered by opening weight.</span>' +
        '</div>' +
        '<div style="display:flex;gap:4px">' +
          yrBtns('ndx-comp-yr-btn', 'ndxSetCompYear', _compYear) +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="card"><div id="ndx-dumbbell-box"></div></div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<span class="sect">Top Contributors</span>' +
      '<span class="secn">Constituents ranked by contribution to the index return. Extra years add columns to the right.</span>' +
    '</div>' +
    '<div class="card"><div id="ndx-pareto-box"></div></div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr" style="padding-top:0">' +
      '<span class="sect">Winners vs Losers</span>' +
      '<span class="secn" style="display:block;margin-top:3px">Three views of performance breakdown by sector and constituent.</span>' +
    '</div>' +
    '<div class="card">' +
      '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px">' +
        '<div style="display:flex;gap:4px">' +
          yrBtns('ndx-wl-yr-btn', 'ndxSetWLYear', _wlYear) +
        '</div>' +
        '<div style="display:flex;gap:4px;margin-left:8px">' +
          '<button class="ndx-wl-tab ndx-tab-btn active" data-tab="A" onclick="ndxSetWLTab(\'A\')">Sector Matrix</button>' +
          '<button class="ndx-wl-tab ndx-tab-btn" data-tab="B" onclick="ndxSetWLTab(\'B\')">Return Distribution</button>' +
          '<button class="ndx-wl-tab ndx-tab-btn" data-tab="C" onclick="ndxSetWLTab(\'C\')">Top/Bottom by Sector</button>' +
        '</div>' +
      '</div>' +
      '<div id="ndx-wl-box"></div>' +
    '</div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<span class="sect">Security Return vs. Weight Scatter</span>' +
      '<span class="secn">Each dot = one constituent. X = compounded return, Y = closing weight, bubble area ∝ √|contribution|. Top 10 labeled.</span>' +
    '</div>' +
    '<div class="card">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap">' +
        '<div style="display:flex;gap:4px">' +
          yrBtns('ndx-scat-yr-btn', 'ndxSetScatterYear', _scatterYear) +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;margin-left:auto">' +
          '<span style="font-size:11px;color:var(--mu)">HOC evolution:</span>' +
          '<input type="range" id="ndx-scatter-hoc-slider" min="0" max="13" value="13" style="width:140px;accent-color:var(--navy)" oninput="ndxSetScatterHoc(+this.value)">' +
          '<span id="ndx-scatter-hoc-label" style="font-size:11px;color:var(--navy);min-width:180px;width:180px;display:inline-block;white-space:nowrap;overflow:hidden"></span>' +
          '<div style="display:flex;gap:3px;margin-left:6px">' +
            '<button class="ndx-tab-btn" onclick="ndxScatterZoom(1.5)" style="font-size:12px;padding:2px 7px;line-height:1" title="Zoom in">+</button>' +
            '<button class="ndx-tab-btn" onclick="ndxScatterZoom(1/1.5)" style="font-size:12px;padding:2px 7px;line-height:1" title="Zoom out">−</button>' +
            '<button class="ndx-tab-btn" onclick="ndxScatterReset()" style="font-size:11px;padding:2px 7px;line-height:1" title="Reset zoom">⟳</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="ndx-scatter-box"></div>' +
    '</div>' +
  '</div>' +

  '<div class="sec">' +
    '<div class="sechdr">' +
      '<span class="sect">Security Contributions — Beeswarm by Sector</span>' +
      '<span class="secn">One dot per constituent. X = Carino-linked contribution. Lane = sector. Select multiple years to compare side by side.</span>' +
    '</div>' +
    '<div class="card">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap">' +
        '<div style="display:flex;gap:4px">' +
          yrBtns('ndx-bee-yr-btn', 'ndxToggleBeeYear', _beeswarmYear) +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<span style="font-size:11px;color:var(--mu)">Progress:</span>' +
          '<input type="range" id="ndx-bee-progress-sl" min="0" max="100" value="100" step="1" ' +
            'style="width:120px;accent-color:var(--navy)" oninput="ndxSetBeeProgress(+this.value)">' +
          '<span id="ndx-bee-progress-lbl" style="font-size:11px;color:var(--navy);min-width:36px">100%</span>' +
        '</div>' +
        '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">' +
          '<span style="font-size:11px;color:var(--mu);font-weight:600">Sector:</span>' +
          '<div id="ndx-bee-pills" style="display:flex;gap:4px;flex-wrap:wrap"></div>' +
        '</div>' +
        '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;flex-basis:100%">' +
          '<span style="font-size:11px;color:var(--mu);font-weight:600">or Industry Group:</span>' +
          '<div id="ndx-bee-ig-pills" style="display:flex;gap:4px;flex-wrap:wrap"></div>' +
        '</div>' +
      '</div>' +
      '<div id="ndx-beeswarm-box"></div>' +
    '</div>' +
  '</div>'
  );
}

// ── Entry point ───────────────────────────────────────────────────────────
export async function loadNdxAttribution(container) {
  container.innerHTML = '<div style="padding:40px;color:var(--mu);font-size:13px">Loading Nasdaq-100 attribution…</div>';
  var res = await fetchNdxAttribution();
  if (res.success && res.data && res.data.hocs && res.data.hocs.length) {
    NDX_DATA = res.data; _dataSource = { kind: 'supabase', meta: res.data.meta || {} };
  } else {
    if (!res.success) console.warn('ndx-attribution: falling back to bundled data —', res.error);
    NDX_DATA = (await import('./ndx-attribution-data.js')).NDX_DATA;
    _dataSource = { kind: 'static', meta: NDX_DATA.meta || {} };
  }
  deriveYears(NDX_DATA.hocs);
  _attrAxisCache = {}; _attrOrderCache = {}; _universe = null; _anchorSnapN = null;
  var LATEST = yearKeys()[0];

  sectors = []; igBySec = {}; igToSec = {};
  _snap0 = {}; _snapN = {};
  exclSecs = new Set(); exclIGs = new Set();
  attrTab = 'sector'; attrMode = 'table';
  _sortKey = 'contrib'; _sortDir = 1;
  _attrDetailYear = LATEST;
  _fromHoc = YEAR_HOCS[LATEST][0]; _toHoc = YEAR_HOCS[LATEST][1];
  _beeswarmFilter = 0; _securities = [];
  treemapSubMode = 'flat';
  _scatterHocIdx = -1; _secSnapshots = [];
  _expandedSecs = new Set();
  _scatterXLo = null; _scatterXHi = null; _scatterYHi = null;
  _scatterYear = LATEST; _scatterSecSnapshots = []; _scatterYrAxes = { xLo: null, xHi: null, yHi: null };
  _scatterViewport = null; _scatterDragState = null;
  _globalScatterAxes = { xLo: null, xHi: null, yHi: null };
  _globalBeeAxes = { contribHi: null, xLo: null, xHi: null };
  _beeswarmYear = LATEST; _beeswarmYears = new Set([LATEST]); _beeswarmProgress = 100;
  _beeswarmSectors = new Set(); _beeswarmSecAll = []; _beeswarmActiveSector = 'Information Technology'; _beeswarmActiveIG = null;
  _activeYear = LATEST;
  _paretoN = 5; _paretoYears = new Set([LATEST]); _paretoView = 'table'; _paretoCustomN = 0;
  _paretoSide = 'pos'; _paretoInfo = 'sector'; _paretoCols = new Set(['ret']);
  _wlYear = LATEST; _wlTab = 'A';
  _attrChartYear = LATEST;
  _attrChartTab = 'sector';
  _compYear = LATEST;
  _colorMode = 'orig';
  _colorMaxPos = 0; _colorMaxNeg = 0;
  _wlTab = 'A';
  _attrDecimals = 2; lastBaseR = null; _heroStart = null;
  if (_chart) { _chart.destroy(); _chart = null; }

  normalize();
  computeGlobalAxes();
  _activeHocs = getActiveHocs();
  baseR = computeCore(new Set(), new Set());
  buildHierarchy();
  _anchorSnapN = _snapN;   // the load starts on the latest year: its weights fix the "Weight" sort
  lockAxes(baseR);
  _securities = computeSecurities(new Set(), new Set());
  rebuildScatterSnapshots(_scatterYear);
  rebuildBeeswarmSecurities(_beeswarmYear);

  container.innerHTML = buildSkeleton();
  buildBeeswarmSectorPills();
  renderKPI(baseR);
  renderTopAttrChart();
  renderAttrTable(baseR);
  renderDumbbell();
  renderPareto();
  renderWLSection();
  _updateScatterSlider();
  renderBeeswarm();
}
