// results.js — the "Results" engine: reported actuals vs Summit model, Street
// consensus and company guidance, per metric and period.
//
// EMBEDDABLE, not a standalone profile tab: renders INSIDE Deep Dive ▸ Evolution
// as the "Results" sub-tab (beside Call Prep). Datasets are hand-built per
// company (see results-data/amzn.js); the engine is fully generic. Periods can
// extend beyond the last reported quarter — forward periods carry the model's
// live projection and BBG consensus with no actual yet.
//
// LAYOUT (per SAB, Jul 2026): the sections are STACKED, not toggled — the
// reader scrolls from Top Line (revenue + every segment/revenue line with data,
// YoY-growth emphasis in % and $) straight into Margins & Profitability
// (op income / EBITDA / capex with margin % lines). Each section block carries
// its OWN metric pills, legend chips, chart, period slider, range analytics and
// Fiscal.ai-style transposed table. Fiscal UI refs: docs/references/fiscal-ai/.
//
// Wire-up (from a company's deep-dive module):
//   import { resultsHtml, initResults } from '../results.js';
//   ... pane html: resultsHtml('AMZN')          // '' when no dataset exists
//   ... when the pane becomes visible: requestAnimationFrame(initResults)

import { amznResults } from './results-data/amzn.js';
import { amznSetup } from './results-data/amzn-setup.js';
import { googlResults } from './results-data/googl.js';
import { googlSetup } from './results-data/googl-setup.js';
import { uberResults, uberSetup } from './results-data/uber.js';
import { metaResults } from './results-data/meta.js';
import { metaSetup } from './results-data/meta-setup.js';
import { ibkrResults } from './results-data/ibkr.js';
import { ibkrSetup } from './results-data/ibkr-setup.js';
import { spotResults } from './results-data/spot.js';
import { spotSetup } from './results-data/spot-setup.js';
import { lyftResults } from './results-data/lyft.js';
import { lyftSetup } from './results-data/lyft-setup.js';
import { tbbbResults } from './results-data/tbbb.js';
import { tbbbSetup } from './results-data/tbbb-setup.js';

var RESULTS_DATA = {
  AMZN: amznResults,
  AMZN_SETUP: amznSetup,
  GOOGL: googlResults,
  GOOGL_SETUP: googlSetup,
  UBER: uberResults,
  UBER_SETUP: uberSetup,
  META: metaResults,
  META_SETUP: metaSetup,
  IBKR: ibkrResults,
  IBKR_SETUP: ibkrSetup,
  SPOT: spotResults,
  SPOT_SETUP: spotSetup,
  LYFT: lyftResults,
  LYFT_SETUP: lyftSetup,
  TBBB: tbbbResults,
  TBBB_SETUP: tbbbSetup
};

export function getResultsData(ticker){
  var raw = RESULTS_DATA[ticker] || null;
  if (!raw) return null;
  if (!_rsTrimCache[ticker]) _rsTrimCache[ticker] = rsTrimData(raw);
  return _rsTrimCache[ticker];
}

// ─── Forward-horizon rule (SAB, Jul 29, 2026) ─────────────────────────────────
// Estimates are shown only as far as the DCF actually models them. Derived per
// dataset from its OWN last reported period — no per-company configuration, and
// fiscal-aligned because period labels are already fiscal ('nQyy' / 'yyyy'):
//   · Quarterly view: forward quarters only within the CURRENT fiscal year
//     (the FY of the next print). Later quarters are dropped from the view
//     even when the dataset carries them.
//   · Annual view: forward years capped at the current FY + 2.
//   · Estimate Evolution: the same annual cap (current FY + 2).
// The rule re-derives automatically as each print's actuals are filled in;
// datasets stay complete on disk — only the rendered copy is trimmed.
var _rsTrimCache = {};
function rsParseQ(p){ var m = /^([1-4])Q(\d{2})$/.exec(p); return m ? { y: 2000 + +m[2], q: +m[1] } : null; }
// Current FY = the fiscal year of the first quarter AFTER the last reported one.
function rsCurrentFY(data){
  var best = null, vq = data.views && data.views.q, k, m, i, pq;
  if (vq) for (k in vq.metrics){ m = vq.metrics[k];
    if (!m.act) continue;
    for (i = 0; i < m.periods.length; i++){
      if (m.act[i] == null) continue;
      pq = rsParseQ(m.periods[i]); if (!pq) continue;
      var o = pq.y * 4 + pq.q; if (best == null || o > best) best = o;
    } }
  // o = y*4+q: a 4Q rolls the division into y+1 (next print = 1Q of FY y+1),
  // 1Q–3Q floor back to y — so the floor IS the current fiscal year.
  if (best != null) return Math.floor(best / 4);
  var vy = data.views && data.views.y, bestY = null;
  if (vy) for (k in vy.metrics){ m = vy.metrics[k];
    if (!m.act) continue;
    for (i = 0; i < m.periods.length; i++)
      if (m.act[i] != null && !isNaN(+m.periods[i]) && (bestY == null || +m.periods[i] > bestY)) bestY = +m.periods[i];
  }
  return bestY != null ? bestY + 1 : null;
}
function rsTrimMetric(m, keep){
  var idx = [], i;
  for (i = 0; i < m.periods.length; i++) if (keep(m.periods[i])) idx.push(i);
  if (idx.length === m.periods.length) return m;
  var t = {}, k; for (k in m) t[k] = m[k];
  ['periods', 'act', 'summit', 'cons', 'guideLo', 'guideHi'].forEach(function(f){
    if (Array.isArray(m[f])) t[f] = idx.map(function(j){ return m[f][j]; });
  });
  return t;
}
function rsTrimData(raw){
  var fy = rsCurrentFY(raw);
  if (fy == null) return raw;
  var keepQ = function(p){ var pq = rsParseQ(p); return !pq || pq.y <= fy; };
  var keepY = function(p){ return isNaN(+p) || +p <= fy + 2; };
  var d = {}, k; for (k in raw) d[k] = raw[k];
  d.views = {};
  for (k in raw.views){
    var v = raw.views[k], nv = {}, kk; for (kk in v) nv[kk] = v[kk];
    nv.metrics = {};
    for (kk in v.metrics) nv.metrics[kk] = rsTrimMetric(v.metrics[kk], k === 'q' ? keepQ : keepY);
    d.views[k] = nv;
  }
  if (raw.evolution && Array.isArray(raw.evolution.years)){
    var keepIdx = [], i;
    for (i = 0; i < raw.evolution.years.length; i++) if (+raw.evolution.years[i] <= fy + 2) keepIdx.push(i);
    if (keepIdx.length !== raw.evolution.years.length){
      var evo = {}, ek; for (ek in raw.evolution) evo[ek] = raw.evolution[ek];
      evo.years = keepIdx.map(function(j){ return raw.evolution.years[j]; });
      evo.metrics = {};
      for (ek in raw.evolution.metrics){
        var em = raw.evolution.metrics[ek], t = {}, f; for (f in em) t[f] = em[f];
        if (Array.isArray(em.summit)) t.summit = keepIdx.map(function(j){ return em.summit[j]; });
        if (Array.isArray(em.cons))   t.cons   = keepIdx.map(function(j){ return em.cons[j]; });
        evo.metrics[ek] = t;
      }
      d.evolution = evo;
    }
  }
  return d;
}

// ─── Colors (match the portal/AVE conventions) ────────────────────────────────
var RS_ACT    = 'rgba(30,39,51,0.92)';    // navy — actual
var RS_SUMMIT = 'rgba(37,99,235,0.85)';   // accent blue — Summit model
var RS_CONS   = 'rgba(124,134,148,0.85)'; // mid gray — Street consensus
var RS_GUIDE  = 'rgba(62,90,130,0.18)';   // steel, translucent — guidance range
var RS_FWD    = '#2563EB';   // forward/estimate accent (matches the E-column highlight)

// A rounded-rect path helper for the canvas plugins below.
function rsRR(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
// Chart.js LOCAL plugin: make the FORWARD (estimate) periods unmistakable — a translucent shaded
// zone with a dashed boundary and a "FORECAST →" pill, plus a rounded BUBBLE behind each forward
// x-axis label (the forward labels are hidden by the scale so this draws them, crisp, on the bubble).
// Reads its options from `options.plugins.rsFwdZone = { from: firstForwardTickIndex }`.
var rsFwdZone = {
  id: 'rsFwdZone',
  beforeDatasetsDraw: function(chart, args, opts){
    var from = opts && opts.from; if (from == null || from < 0) return;
    var x = chart.scales.x, area = chart.chartArea, ctx = chart.ctx;
    var left = (from > 0) ? (x.getPixelForTick(from - 1) + x.getPixelForTick(from)) / 2 : area.left;
    ctx.save();
    ctx.fillStyle = 'rgba(37,99,235,0.07)';
    ctx.fillRect(left, area.top, area.right - left, area.bottom - area.top);
    ctx.strokeStyle = 'rgba(37,99,235,0.40)'; ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(left, area.top); ctx.lineTo(left, area.bottom); ctx.stroke();
    ctx.setLineDash([]);
    var label = 'FORECAST', pad = 7;
    ctx.font = '700 9px Inter, system-ui, sans-serif';
    var w = ctx.measureText(label).width, px = left + 8, py = area.top + 5;
    if (px + w + pad * 2 > area.right - 4) px = area.right - w - pad * 2 - 4;
    ctx.fillStyle = 'rgba(37,99,235,0.92)'; rsRR(ctx, px, py, w + pad * 2, 15, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(label, px + pad, py + 8);
    ctx.restore();
  },
  afterDraw: function(chart, args, opts){
    var from = opts && opts.from; if (from == null || from < 0) return;
    var x = chart.scales.x, ctx = chart.ctx;
    ctx.save();
    ctx.font = '700 11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var y = x.top + 13, labels = chart.data.labels || [];   // forward labels are hidden by the scale
    for (var i = from; i < x.ticks.length; i++){             // callback, so read them from data.labels
      var px = x.getPixelForTick(i);
      var lbl = labels[i] != null ? String(labels[i]) : '';
      if (!lbl) continue;
      var w = ctx.measureText(lbl).width;
      ctx.fillStyle = 'rgba(37,99,235,0.14)'; rsRR(ctx, px - w / 2 - 7, y - 9, w + 14, 18, 9); ctx.fill();
      ctx.fillStyle = RS_FWD; ctx.fillText(lbl, px, y);
    }
    ctx.restore();
  }
};
var RS_GREEN  = '#1E9E62', RS_RED = '#C0392B';
// Evolution block: one line per fiscal year — an ordered (ordinal) ramp of the
// portal blue, darkest = nearest year. Validated with the dataviz palette
// checker (monotone L, visible step gaps, light end ≥2:1 on white).
var EVO_RAMP = ['#1B3F94', '#2563EB', '#5E8BEC', '#93B1F0'];

// Global: dataset + view. Per-section (keyed by section key): metric, window,
// hidden series, chart instance. `evo` is the vintage-evolution block's state.
// `growth` (quarterly only): 'yoy' = vs the same quarter last year; 'qoq' = vs
// the previous reported quarter.
var _rs = { data: null, view: 'q', growth: 'yoy', mode: 'level', growUnit: 'pct',
            sec: {}, evo: null, surp: null, vint: 'preprint' };

function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }

// Quarterly/Annual, Levels/Growth, YoY/QoQ and %/Amount are all PER BLOCK (SAB, Aug 10 2026).
// One block can read revenue quarterly in dollars while the next reads EBITDA annually as
// growth — which is how the questions actually get asked. `_rs.view` survives only as the
// default a fresh block starts from and as the pane-level fallback for anything not scoped to
// a block. Safe because every view carries the same section keys and metric groups; a dataset
// where they diverge would need the block list to be per view, which none of ours is.
function rsView(k){
  var name = (k != null && _rs.sec[k] && _rs.sec[k].view) || _rs.view;
  return _rs.data.views[name] || _rs.data.views.y || _rs.data.views.q;
}
function rsViewName(k){ return (k != null && _rs.sec[k] && _rs.sec[k].view) || _rs.view; }
// Default view: quarterly when present, else annual (datasets like TBBB carry annual only).
function rsDefaultView(data){ return (data && data.views && data.views.q) ? 'q' : 'y'; }
function rsSecCfg(k){ return rsView(k).sections.filter(function(s){ return s.key === k; })[0]; }
// Sections declare their metrics in labeled groups (Totals / Segments / …);
// flatten for validation and default handling.
function rsSecGroups(cfg){ return cfg.groups || [{ label: '', keys: cfg.keys || [] }]; }
function rsSecKeys(cfg){ return rsSecGroups(cfg).reduce(function(a, g){ return a.concat(g.keys); }, []); }
function rsSt(k){
  if (!_rs.sec[k]) _rs.sec[k] = { metric: null, win: null, yr: null, chart: null,
    view: _rs.view, mode: 'level', growth: 'yoy', growUnit: 'pct', tbl: false,
    hidden: { act:false, summit:false, cons:false, guide:false, margin:false } };
  return _rs.sec[k];
}
function rsMetric(k){
  var st = rsSt(k), cfg = rsSecCfg(k);
  if (!st.metric || rsSecKeys(cfg).indexOf(st.metric) < 0) st.metric = cfg.defaultMetric;
  return rsView(k).metrics[st.metric];
}

// ─── Reporting currency ──────────────────────────────────────────────────────
// Per-metric `m.cur` takes priority (e.g. 'Ps.' for MXN in TBBB); falls back
// to dataset-level `currency` (e.g. '€' for Spotify EUR); then '$'.
// Non-monetary units — 'pct' (percentage) and 'count' (integer, e.g. store
// count) — carry no currency symbol.
function rsCur(m){ return (m && m.cur) || (_rs.data && _rs.data.currency) || '$'; }
function rsCurName(m){ return (m && m.cur) || (_rs.data && _rs.data.currencyName) || 'US$'; }

function rsFmt(m, v){
  if (v == null) return '—';
  var neg = v < 0 ? '−' : '', a = Math.abs(v), c = rsCur(m);
  if (m.unit === 'eps') return neg + c + a.toFixed(2);
  if (m.unit === 'pct') return neg + a.toFixed(1) + '%';
  if (m.unit === 'count') return neg + Math.round(a).toLocaleString();
  if (a >= 10000) return neg + c + (a/1000).toFixed(1) + 'B';
  return neg + c + Math.round(a).toLocaleString() + 'M';
}
function rsFmtD(m, v, dec){
  if (v == null) return '—';
  var sign = v >= 0 ? '+' : '−', a = Math.abs(v), c = rsCur(m);
  if (m.unit === 'eps') return sign + c + a.toFixed(2);
  if (m.unit === 'pct') return sign + a.toFixed(dec == null ? 1 : dec) + ' pts';
  if (m.unit === 'count') return sign + Math.round(a).toLocaleString();
  if (a >= 10000) return sign + c + (a/1000).toFixed(dec == null ? 1 : dec) + 'B';
  return sign + c + Math.round(a).toLocaleString() + 'M';
}
// Display scale for a metric: $B for AMZN-sized series, $M for SoFi-sized ones.
// Decided per metric (max |value| across every series) so a metric is always
// consistent with itself.
function rsScaleOf(m){
  if (m.unit === 'pct' || m.unit === 'count' || m.unit === 'eps') return 1;
  var mx = 0;
  ['act', 'summit', 'cons', 'guideLo', 'guideHi'].forEach(function(k){
    (m[k] || []).forEach(function(v){ if (v != null) mx = Math.max(mx, Math.abs(v)); });
  });
  return mx >= 10000 ? 1000 : 1;
}
function rsSurp(act, ref){
  if (act == null || ref == null || !ref) return null;
  return (act - ref) / Math.abs(ref) * 100;
}
function rsPctHtml(s, dec){
  if (s == null) return '<span class="rs-ft-nil">—</span>';
  var up = s >= 0;
  return '<span style="color:' + (up ? RS_GREEN : RS_RED) + '">' + (up ? '+' : '−') + Math.abs(s).toFixed(dec == null ? 1 : dec) + '%</span>';
}
function rsGuideMid(m, i){ return (m.guideLo[i] == null || m.guideHi[i] == null) ? null : (m.guideLo[i] + m.guideHi[i]) / 2; }
// Axis tick: negatives as −$50B, not $-50B; whole dollars only (zoomed bounds
// arrive fractional — $135.13111B would eat the chart's left margin). `div` is
// the metric's display scale from rsScaleOf (1000 → $B axis, 1 → $M axis).
function rsTick(v, unit, div, cur){
  var s = v < 0 ? '−' : '', a = Math.abs(v), c = cur || '$';
  if (unit === 'eps') return s + c + (+a.toFixed(2));
  if (unit === 'pct') return s + Math.round(a) + '%';
  if (unit === 'count') return s + Math.round(a).toLocaleString();
  return s + c + Math.round(a) + (div === 1000 ? 'B' : 'M');
}
function rsWin(k, m){
  var st = rsSt(k), n = m.periods.length;
  if (!st.win || st.win[1] >= n || st.win[0] < 0){ st.win = [0, n - 1]; }
  return st.win;
}
function rsRefsFor(m){
  function any(a){ return !!a && a.some(function(v){ return v != null; }); }
  return { summit: any(m.summit), cons: any(m.cons), guide: any(m.guideLo) };
}
// Index of the LAST period that has a reported actual. Everything after it is forward
// (an estimate); everything at or before it is a closed period — even where this particular
// metric has no actual, which happens when a line only starts partway through the history
// (e.g. UBER's Non-GAAP EPS begins at 1Q24). Using the FIRST null instead would shade a whole
// reported history as "forecast" the moment a series has a leading gap.
function rsLastAct(m){
  var lastA = -1;
  for (var i = 0; i < m.act.length; i++) if (m.act[i] != null) lastA = i;
  return lastA;
}
// Quick-range presets: windows anchored to the LAST REPORTED period (lr) —
// "Last 4Q" = the four most recent prints, "Forward" = last print + estimates.
function rsPresetWin(m, key){
  var n = m.periods.length, lr = rsLastAct(m);
  if (lr < 0) lr = n - 1;
  switch (key){
    case 'l4':  return [Math.max(0, lr - 3), lr];
    case 'l8':  return [Math.max(0, lr - 7), lr];
    case 'l3':  return [Math.max(0, lr - 2), lr];
    case 'l5':  return [Math.max(0, lr - 4), lr];
    case 'rep': return [0, lr];
    case 'fwd': return [Math.max(0, lr), n - 1];
    default:    return [0, n - 1];                     // 'all'
  }
}

// ─── Vintage axis (SAB, Aug 2026) ─────────────────────────────────────────────
// `estMatrix` is a GENERATED dataset block (contract: docs/RESULTS_CONVENTIONS.md §8):
// per source ('summit' | 'cons'), a vintage register plus — per view, per metric — one
// PERIOD-KEYED row per snapshot. Period-keyed rather than positional so the block
// survives the forward-horizon trim and any change to a metric's period axis, and so a
// snapshot covering six periods costs six numbers instead of a padded row of nulls. It
// sits at the dataset ROOT, beside `views`, to keep machine-generated numbers out of the
// hand-curated metric blocks (labels, `act`, guidance, notes) — a refresh overwrites the
// block wholesale without touching a word anyone wrote.
//
// Two reading modes:
//   'preprint' (default) — per period, the estimate that stood going INTO that print: the
//        latest snapshot whose own last-reported period is still before the period, i.e.
//        the shortest forward horizon, ties broken by the later snapshot. This reproduces
//        the hand-picked columns the datasets carried before the matrix existed. Two rules
//        keep it reproducing them exactly, both handled in rsSeriesFor: on an ALREADY
//        REPORTED period the dataset's own value wins (it is the projection the model froze
//        at that print — sharper than any snapshot saved weeks earlier), and where no
//        vintage reaches back far enough the dataset's value is kept rather than blanked.
//        So the matrix ADDS: it never silently subtracts a series the dataset already had.
//   '<vintage id>'       — that one snapshot's row read straight across, so every period on
//        screen is what a single model/consensus state said at one moment. Periods the
//        snapshot never covered stay NULL instead of quietly falling back to an older one.
function rsOrdIn(view, p){
  if (view === 'q'){ var q = rsParseQ(p); return q ? q.y * 4 + q.q : null; }
  return isNaN(+p) ? null : +p;
}
function rsMatrix(src){
  var mx = _rs.data && _rs.data.estMatrix;
  return (mx && mx[src]) || null;
}
// Every vintage across the sources that carry a matrix, newest first.
function rsVintages(){
  var out = [], seen = {};
  ['summit', 'cons'].forEach(function(src){
    var mx = rsMatrix(src); if (!mx) return;
    (mx.vintages || []).forEach(function(v){ if (!seen[v.id]){ seen[v.id] = 1; out.push(v); } });
  });
  return out.sort(function(a, b){ return a.id < b.id ? 1 : -1; });
}
var RS_MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var RS_SRCN = { summit: 'Summit', cons: 'Street' };
function rsVintDay(id, fallback){
  var p = String(id).split('-');
  return (p.length === 3 && RS_MON[+p[1] - 1]) ? RS_MON[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0] : (fallback || id);
}
function rsVintLabel(v){
  var thru = v.lastActual && (v.lastActual.q || v.lastActual.y);
  return rsVintDay(v.id, v.label) + (thru ? ' · knew through ' + thru : '');
}
// ─── Two calendars, one dropdown ──────────────────────────────────────────────
// The sources are archived on their OWN schedules: Bloomberg exports around each print,
// the model is saved whenever the analyst saves it. On UBER the two calendars intersect
// exactly ONCE (2026-07-31) out of 18 dates — so picking a date by itself leaves one side
// blank far more often than not, and the list has to say which source owns each date
// BEFORE it is picked — which is why the single-file list is split by archive.
function rsVintSrcs(id){
  var out = [];
  ['summit', 'cons'].forEach(function(src){
    var mx = rsMatrix(src); if (!mx) return;
    if ((mx.vintages || []).some(function(v){ return v.id === id; })) out.push(src);
  });
  return out;
}
// The snapshot a source resolves to for an "as of" reading: its latest file ON OR BEFORE
// that date. Dated ids sort lexically, so a string compare is the date compare.
function rsVintAsOf(src, date){
  var mx = rsMatrix(src); if (!mx) return null;
  var best = null;
  (mx.vintages || []).forEach(function(v){ if (v.id <= date && (best == null || v.id > best.id)) best = v; });
  return best;
}
// Dates worth offering as "as of" — the ones where BOTH sources have something to show.
// Earlier than that, an as-of reading is the single-file reading, so it would only pad
// the list with duplicates.
function rsAsOfDates(){
  if (['summit', 'cons'].some(function(s){ return !rsMatrix(s); })) return [];
  return rsVintages().filter(function(v){
    return ['summit', 'cons'].every(function(s){ return rsVintAsOf(s, v.id); });
  });
}
// The vintage a given source is actually showing, for any mode. Null = nothing to show.
function rsVintFor(src, mode){
  if (!mode || mode === 'preprint') return null;
  if (mode.indexOf('asof:') === 0) return rsVintAsOf(src, mode.slice(5));
  var mx = rsMatrix(src); if (!mx) return null;
  return (mx.vintages || []).filter(function(v){ return v.id === mode; })[0] || null;
}
function rsSeriesFor(view, m, mkey, src, mode){
  var mx = rsMatrix(src); if (!mx) return null;
  var cells = (mx[view] || {})[mkey]; if (!cells) return null;
  if (mode && mode !== 'preprint'){
    // Single-file read — either the date itself, or (as-of) this source's latest file up to
    // it. Nothing that old ⇒ an all-null series: blank, never a stand-in from another day.
    var hit = rsVintFor(src, mode);
    if (!hit) return m.periods.map(function(){ return null; });
    var row = cells[hit.id] || {};
    return m.periods.map(function(p){ return row[p] == null ? null : row[p]; });
  }
  var vs = mx.vintages || [], flat = m['_flat_' + src] || [];
  return m.periods.map(function(p, idx){
    var po = rsOrdIn(view, p); if (po == null) return null;
    var f = flat[idx] == null ? null : flat[idx];
    // On a period that has ALREADY REPORTED, the hand-authored series is the estimate the model
    // FROZE at that print — the sharpest possible pre-print read. A snapshot can only ever be as
    // fresh as the day it was saved, so where the two disagree (UBER 1Q26: 14,040 frozen against
    // 14,014 in the Feb-5 file, three months stale) the frozen one wins and the matrix is left to
    // fill holes. Forward periods have no freeze, so there the matrix — which carries the newest
    // snapshot — is the authority.
    if (f != null && m.act && m.act[idx] != null) return f;
    var best = null;
    for (var i = 0; i < vs.length; i++){
      var v = vs[i], row = cells[v.id];
      if (!row || row[p] == null) continue;
      var la = v.lastActual && v.lastActual[view];
      var lo = la == null ? -Infinity : rsOrdIn(view, la);
      if (!(lo < po)) continue;              // this snapshot already had the period reported
      if (best == null || lo > best.lo || (lo === best.lo && v.id > best.id)) best = { lo: lo, id: v.id, v: row[p] };
    }
    // No vintage can date this period (every snapshot post-dates it) — keep whatever the dataset
    // already shipped rather than blanking a series the matrix simply cannot reach back to.
    return best ? best.v : f;
  });
}
// Rewrite every metric's `summit`/`cons` from the matrix for the current selection. The
// engine reads those two arrays in ~40 places; resolving once, here, leaves all of them
// untouched. The hand-authored flat arrays are stashed on first use, so a metric with no
// matrix row keeps them and switching modes never compounds.
function rsApplyVintage(){
  var d = _rs.data; if (!d || !d.estMatrix) return;
  var mode = _rs.vint || 'preprint';
  ['q', 'y'].forEach(function(view){
    var v = d.views && d.views[view]; if (!v) return;
    Object.keys(v.metrics).forEach(function(mkey){
      var m = v.metrics[mkey];
      ['summit', 'cons'].forEach(function(src){
        var flat = '_flat_' + src;
        if (!(flat in m)) m[flat] = m[src];
        m[src] = rsSeriesFor(view, m, mkey, src, mode) || m[flat];
      });
    });
  });
}
// What each source actually resolved to — stated on screen, because one date means
// different things for a model refreshed weekly and a consensus file refreshed quarterly,
// and because a source with no matrix yet is still showing its pre-print series.
function rsVintNote(){
  var mode = _rs.vint || 'preprint';
  var names = { summit: 'Summit', cons: 'Consensus' }, asof = mode.indexOf('asof:') === 0, out = [];
  ['summit', 'cons'].forEach(function(src){
    var mx = rsMatrix(src);
    if (!mx){ out.push(names[src] + ': no vintage matrix yet — showing the estimate that stood before each print'); return; }
    if (mode === 'preprint'){ out.push(names[src] + ': ' + (mx.vintages || []).length + ' snapshots, each period taken from the last one before its print'); return; }
    var hit = rsVintFor(src, mode);
    if (!hit){
      out.push(names[src] + ': ' + (asof ? 'no file that far back — the series is blank, not zero'
                                         : 'no snapshot on this date — the series is blank, not zero'));
      return;
    }
    var thru = (hit.lastActual && (hit.lastActual.q || hit.lastActual.y)) || '—';
    // Under as-of the resolved date is usually NOT the date on the picker, so it is named.
    out.push(names[src] + ': snapshot ' + hit.id + (asof && hit.id !== mode.slice(5) ? ' (its latest up to ' + mode.slice(5) + ')' : '') +
             ', which knew through ' + thru);
  });
  return out.join(' · ');
}

// ─── Growth & margin series ───────────────────────────────────────────────────
// Lag for growth math: quarterly YoY = 4 quarters back, quarterly QoQ = 1 back,
// annual always 1 year back.
function rsLook(k){ var st = rsSt(k); return rsViewName(k) === 'q' ? (st.growth === 'qoq' ? 1 : 4) : 1; }
function rsGrowLabel(k){ return (rsViewName(k) === 'q' && rsSt(k).growth === 'qoq') ? 'QoQ growth' : 'YoY growth'; }
// Actual-only growth: both endpoints must be REPORTED. The Actual row never
// shows growth into estimate periods — there is no observation there.
function rsActGrowthPct(sk, m, i){
  var k = rsLook(sk); if (i - k < 0) return null;
  if (m.act[i] == null || m.act[i - k] == null || !m.act[i - k]) return null;
  return (m.act[i] - m.act[i - k]) / Math.abs(m.act[i - k]) * 100;
}
function rsActGrowthDollar(sk, m, i){
  var k = rsLook(sk); if (i - k < 0) return null;
  if (m.act[i] == null || m.act[i - k] == null) return null;
  return m.act[i] - m.act[i - k];
}
// ─── Growth as a CHART mode ───────────────────────────────────────────────────
// Growth was only ever a row in the table. Reading it off the chart is a different
// question — "who is growing and who is decelerating" rather than "how big is it" — and
// with the guidance band transformed too it answers the one an analyst asks before a print:
// what growth is the company itself signing up for.
//
// The base is the REPORTED period one lag back wherever it exists, so a forward estimate
// reads as "growth vs last year's actual" the way it gets quoted. That is the rule the
// table's growth rows already use; the chart must not invent a second one.
function rsGrowBase(sk, m, series, i){
  var k = rsLook(sk); if (i - k < 0) return null;
  if (series === 'act') return m.act ? m.act[i - k] : null;
  if (m.act && m.act[i - k] != null) return m.act[i - k];
  var ref = series === 'guideLo' || series === 'guideHi' ? null : m[series];
  return ref ? ref[i - k] : null;
}
function rsGrowArr(sk, m, series, amt){
  var arr = m[series];
  if (!arr) return null;
  return m.periods.map(function(_, i){
    var a = arr[i], b = rsGrowBase(sk, m, series, i);
    if (a == null || b == null) return null;
    if (amt) return a - b;
    return b === 0 ? null : (a - b) / Math.abs(b) * 100;
  });
}
function rsIsGrow(k){ return rsSt(k).mode === 'grow'; }
function rsGrowAmt(k){ return rsIsGrow(k) && rsSt(k).growUnit === 'amt'; }
function rsMarginArr(sk, m, series){
  if (!m.marginOf || m.unit === 'eps') return null;
  var d = rsView(sk).metrics[m.marginOf]; if (!d) return null;
  // Numerator and denominator MUST be the SAME series/vintage: a consensus margin is cons/cons, a
  // Summit margin is summit/summit, an actual margin is act/act. NEVER mix bases (e.g. a consensus
  // numerator over Summit revenue) — that is a meaningless hybrid mislabeled as one side. Consensus
  // and Summit margins stay distinct (see EARNINGS_CONVENTIONS general rule on margins).
  var dser = d[series] || [];
  return m.periods.map(function(p, i){
    var num = m[series][i], den = dser[i];
    if (num == null || den == null || !den) return null;
    return num / den * 100;
  });
}
// YoY growth of a REFERENCE series (summit/cons): what growth that estimate
// implies — measured against the reported base when it exists (else the same
// series a year back), so a forward estimate reads as "growth vs last year's
// actual", the way an analyst quotes it.
function rsRefGrowthPct(sk, m, series, i){
  var k = rsLook(sk); if (i - k < 0) return null;
  var a = m[series][i];
  var b = m.act[i - k] != null ? m.act[i - k] : m[series][i - k];
  if (a == null || b == null || !b) return null;
  return (a - b) / Math.abs(b) * 100;
}
function rsRefGrowthDollar(sk, m, series, i){
  var k = rsLook(sk); if (i - k < 0) return null;
  var a = m[series][i];
  var b = m.act[i - k] != null ? m.act[i - k] : m[series][i - k];
  if (a == null || b == null) return null;
  return a - b;
}

// ─── Embeddable HTML ──────────────────────────────────────────────────────────

export function resultsHtml(ticker){
  var data = getResultsData(ticker);
  _rs.data = data;
  if (!data) return '';
  _rs.view = rsDefaultView(data);
  _rs.growth = 'yoy';
  _rs.sec = {};
  _rs.evo = null;
  return rsBody();
}

function rsBody(){
  var d = _rs.data;
  var h = '<div class="rs-wrap">';
  // `intro` is deliberately NOT rendered (SAB, Aug 10 2026), the same call taken in Estimates:
  // a paragraph restating what the controls and the chart already say, which goes stale on a
  // refresh while they do not. The field stays in the datasets.
  h += rsTopRowHtml();
  h += '<div class="ov-foot rs-vintnote" id="rsVintNote">' + esc(rsVintNote()) + '</div>';
  h += '<div id="rsBlocks">' + rsBlocksHtml() + '</div>';
  if (d.surprise !== false && d.views.q && rsSurpGroups().length) h += rsSurpBlockHtml();
  h += '<div class="ov-foot" id="rsViewNote">' + esc(rsView().note || '') + '</div>';
  h += '<div class="ov-foot">' + esc(d.source) + '</div>';
  h += '</div>';
  return h;
}
// The pane's control row, extracted so switching Levels ⇄ Growth can re-render it: the
// %/Amount pair only exists while Growth is on.
// All that is left at the pane level is the vintage picker, which genuinely IS pane-wide:
// it selects which snapshot of the estimates every block reads from, not how a block is read.
function rsTopRowHtml(){
  return '<div class="rs-toprow">' + rsVintSelHtml() + '</div>';
}
// Every reading control lives INSIDE its block now, so one block can be quarterly dollars
// while the next is annual growth. The level button carries that block's own unit rather than
// a generic word, which is only possible down here — at the pane level the blocks have
// different units and no single label was honest.
function rsLevelLabel(m){
  var cur = rsCur(m);
  if (m.unit === 'eps') return cur;
  if (m.unit === 'pct') return '%';
  if (m.unit === 'count') return 'Units';
  return cur + (rsScaleOf(m) === 1000 ? 'B' : 'M');
}
// The table's own header: caret, show/hide, and what is inside — the metric and how many
// periods the current window holds, both of which follow the controls above it.
function rsTableHeadHtml(k, m){
  var open = rsSt(k).tbl !== false, w = rsWin(k, m), n = w[1] - w[0] + 1;
  return '<span class="rs-collap-ic">' + (open ? '▾' : '▸') + '</span>Period detail' +
    '<span class="rs-collap-sub">' + (open ? 'hide' : 'show') + ' · ' + esc(m.short || m.label) +
    ', ' + n + ' period' + (n === 1 ? '' : 's') + ' in the selected range</span>';
}
function rsBlockModesHtml(k, m){
  var d = _rs.data, st = rsSt(k), grow = rsIsGrow(k);
  var b = function(attr, val, on, label, title){
    return '<button type="button" class="rs-view' + (on ? ' active' : '') + '" data-' + attr + '="' + val + '"' +
      (title ? ' title="' + esc(title) + '"' : '') + '>' + label + '</button>';
  };
  var h = '<div class="rs-views">' + Object.keys(d.views).map(function(vn){
    return b('rsview', vn, rsViewName(k) === vn, esc(d.views[vn].label));
  }).join('') + '</div>';
  h += '<div class="rs-views">' +
    b('rsmode', 'level', !grow, esc(rsLevelLabel(m)), 'The reported level in each period') +
    b('rsmode', 'grow', grow, 'Growth', 'Growth over the base period, for every series at once') + '</div>';
  if (grow){
    if (rsViewName(k) === 'q'){
      h += '<div class="rs-views">' +
        b('rsgrow', 'yoy', st.growth !== 'qoq', 'YoY', 'vs the same quarter last year') +
        b('rsgrow', 'qoq', st.growth === 'qoq', 'QoQ', 'vs the previous reported quarter') + '</div>';
    }
    h += '<div class="rs-views">' +
      b('rsgunit', 'pct', !rsGrowAmt(k), '%') +
      b('rsgunit', 'amt', rsGrowAmt(k), 'Amount') + '</div>';
  }
  return h;
}

// All section blocks, stacked. Each block owns its pills/legend/chart/slider/
// analytics/table, suffixed by the section key.
function rsBlocksHtml(){
  return rsView().sections.map(function(cfg){
    var k = cfg.key, m = rsMetric(k);
    var pres = rsViewName(k) === 'q'
      ? [['l4', 'Last 4Q'], ['l8', 'Last 8Q'], ['rep', 'Reported'], ['fwd', 'Forward'], ['all', 'All']]
      : [['l3', 'Last 3Y'], ['l5', 'Last 5Y'], ['rep', 'Reported'], ['fwd', 'Forward'], ['all', 'All']];
    var h = '<div class="rs-block" data-rsblock="' + k + '">';
    // Row 1: what am I looking at. Row 2: how do I read it (left) and over what window (right).
    h += '<div class="rs-block-top"><div class="rs-block-h">' + esc(cfg.label) + '</div>' +
      '<select class="rs-msel" aria-label="Metric">' + rsSelectHtml(k) + '</select></div>';
    h += '<div class="rs-block-modes" id="rsModes-' + k + '"><div class="rs-modes">' + rsBlockModesHtml(k, m) + '</div>' +
      '<div class="rs-quick"><span class="rs-quick-l">Range</span>' +
        pres.map(function(p){ return '<button type="button" class="rs-preset" data-rsrange="' + p[0] + '">' + p[1] + '</button>'; }).join('') +
      '</div></div>';
    h += '<div class="ave-leg" id="rsLegend-' + k + '">' + rsLegendHtml(k, m) + '</div>';
    h += '<div class="ov-chart-card">' +
      '<div class="ov-chart-t" id="rsChartT-' + k + '"></div>' +
      '<div class="ov-chart-wrap ovs-tall"><canvas id="rsChart-' + k + '"></canvas></div>' +
    '</div>';
    h += '<div class="sg-controls">' +
      '<div class="sg-slider">' +
        '<div class="sg-track"><div class="sg-fill" id="rsFill-' + k + '"></div></div>' +
        '<div class="rs-ticks" id="rsTicks-' + k + '"></div>' +
        '<input type="range" id="rsMin-' + k + '" min="0" max="1" value="0" step="1" aria-label="Start period">' +
        '<input type="range" id="rsMax-' + k + '" min="0" max="1" value="1" step="1" aria-label="End period">' +
      '</div>' +
      '<div class="sg-ends"><span id="rsEnd0-' + k + '"></span><span id="rsEnd1-' + k + '"></span></div>' +
    '</div>';
    // The period table collapses, like the detail table in Estimates. It starts OPEN here:
    // there is one table per block rather than two, and it is the block's own detail rather
    // than an audit trail sitting behind a summary.
    h += '<div class="rs-collap" data-rstbl="' + k + '">' +
      '<button type="button" class="rs-collap-h" data-rstblb="' + k + '">' + rsTableHeadHtml(k, m) + '</button>' +
      '<div class="rs-collap-b" id="rsTableBody-' + k + '"' + (rsSt(k).tbl === false ? ' hidden' : '') + '>' +
        '<div class="rs-tablewrap" id="rsTable-' + k + '"></div>' +
      '</div></div>';
    h += '<div class="ov-foot" id="rsNote-' + k + '"></div>';
    h += '</div>';
    return h;
  }).join('');
}

// Vintage picker — one control for the whole pane (it governs every section block).
// Rendered only when the dataset carries an `estMatrix`; datasets without one keep the
// flat pre-print columns and show no control at all.
function rsVintSelHtml(){
  var vints = rsVintages(); if (!vints.length) return '';
  var mode = _rs.vint || 'preprint';
  var opt = function(val, label){
    return '<option value="' + esc(val) + '"' + (mode === val ? ' selected' : '') + '>' + esc(label) + '</option>';
  };
  var asof = rsAsOfDates(), html = '';
  if (asof.length){
    // What an analyst actually asks — "where did each side stand on this date" — which is not
    // the same question as "read me this one file", because the two archives rarely share a day.
    html += '<optgroup label="As of a date — each source&#39;s latest file">' +
      asof.map(function(v){
        var parts = ['summit', 'cons'].map(function(s){
          var hit = rsVintAsOf(s, v.id);
          return RS_SRCN[s] + ' ' + (hit ? rsVintDay(hit.id) : '—');
        });
        return opt('asof:' + v.id, rsVintDay(v.id, v.label) + ' · ' + parts.join(' + '));
      }).join('') + '</optgroup>';
  }
  // One file at a time, split BY ARCHIVE — the two keep separate calendars, so a single merged
  // list forced you to read an ownership tag on every row to know what you were about to get.
  // Each source's own vintage register is used, so "knew through" is that file's, not a merge.
  // The one date both archives share appears under both, flagged, because it is one pick that
  // lights up both series — and only the first copy carries `selected`, so a re-render cannot
  // leave two options marked in a single-choice list.
  var seen = false;
  [{ src: 'summit', label: 'Summit model files', other: 'Street' },
   { src: 'cons', label: 'Street (Bloomberg) files', other: 'Summit' }].forEach(function(g){
    var mx = rsMatrix(g.src); if (!mx || !(mx.vintages || []).length) return;
    html += '<optgroup label="One file — ' + esc(g.label) + '">' +
      mx.vintages.slice().sort(function(a, b){ return a.id < b.id ? 1 : -1; }).map(function(v){
        var shared = rsVintSrcs(v.id).length > 1;
        var label = rsVintLabel(v) + (shared ? ' · also a ' + g.other + ' file' : '');
        var sel = mode === v.id && !seen;
        if (sel) seen = true;
        return '<option value="' + esc(v.id) + '"' + (sel ? ' selected' : '') + '>' + esc(label) + '</option>';
      }).join('') + '</optgroup>';
  });
  return '<div class="rs-vint"><span class="rs-quick-l">Estimates as of</span>' +
    '<select class="rs-vsel" aria-label="Estimate vintage">' +
      opt('preprint', 'Closest snapshot before each print') + html +
    '</select></div>';
}

// Structured metric picker — a dropdown grouped by the section's groups
// (Totals / Segments / Revenue lines / …) instead of a wall of pills.
// Dropdowns group by METRIC FAMILY, with the segments inside — "Gross Bookings ▸ Total ·
// Mobility · Delivery · Freight", not "Mobility ▸ GB · revenue" (SAB, Aug 10 2026). The point
// is the rollout: every company has a couple of families and a few segments under them, so
// this shape homogenises across tickers where grouping by segment cannot.
//
// Which means the option text should be the SEGMENT, since the group header already carries
// the family — `seg` when the dataset declares one, falling back to the full label so a
// dataset that has not been regrouped yet still reads correctly.
function rsOptLabel(m){ return m.seg || m.label; }
function rsSelectHtml(k){
  var view = rsView(k), cfg = rsSecCfg(k), st = rsSt(k);
  rsMetric(k);                                        // ensure st.metric is valid
  return rsSecGroups(cfg).map(function(g){
    var opts = g.keys.map(function(mk){
      return '<option value="' + mk + '"' + (mk === st.metric ? ' selected' : '') + '>' + esc(rsOptLabel(view.metrics[mk])) + '</option>';
    }).join('');
    return g.label ? '<optgroup label="' + esc(g.label) + '">' + opts + '</optgroup>' : opts;
  }).join('');
}

function rsLegendHtml(k, m){
  var has = rsRefsFor(m), st = rsSt(k);
  var isTop = k === 'top';
  function chip(key, color, label, line){
    var off = st.hidden[key];
    var sw = line ? '<span class="rs-leg-line" style="background:' + color + '"></span>' : '<span class="ave-leg-act" style="background:' + color + '"></span>';
    return '<button type="button" class="rs-leg' + (off ? ' off' : '') + '" data-rsleg="' + key + '" title="Show / hide">' + sw + esc(label) + '</button>';
  }
  var h = chip('act', RS_ACT, 'Actual');
  if (has.summit) h += chip('summit', RS_SUMMIT, 'Summit model');
  if (has.cons)   h += chip('cons', RS_CONS, 'Consensus');
  // Label the chip for what the company actually gives: a range, or a single number.
  if (has.guide){
    var anyRange = m.guideLo.some(function(v, i){ return v != null && m.guideHi[i] != null && v !== m.guideHi[i]; });
    h += chip('guide', 'rgba(62,90,130,0.3)', anyRange ? 'Guidance range' : 'Guidance (single number)');
  }
  // Make the ABSENCE of guidance loud and explicit — a company (or a line) with no numeric guide gets
  // an amber badge, so no reader is left guessing why there is no guidance band (§5.5).
  else h += '<span class="rs-noguide" title="This company issued no numeric guidance for this line/period — so there is no guidance band to score against (only Street and Summit).">⚑ No company guidance</span>';
  if (!isTop && m.marginOf && m.unit !== 'eps') h += chip('margin', RS_ACT, esc(m.marginLabel || 'margin') + ' %', true);
  h += '<span class="tech-leg-i" style="margin-left:auto">▲ beat · ▼ miss · click a chip to hide it</span>';
  return h;
}

// ─── Chart (per section) ──────────────────────────────────────────────────────

function rsBuildChart(k){
  var m = rsMetric(k), st = rsSt(k);
  var el = document.getElementById('rsChart-' + k);
  if (!el || !el.offsetParent) return;                 // pane not visible yet
  if (st.chart){ st.chart.destroy(); st.chart = null; }

  var has = rsRefsFor(m);
  var isTop = k === 'top';
  var w = rsWin(k, m), lo = w[0], hi = w[1];
  var dec = m.unit === 'eps' ? 2 : 1;
  var div = rsScaleOf(m);
  var scale = function(v){ return v == null ? null : (m.unit === 'eps' ? v : v/div); };
  // Growth mode replaces every series with its growth over the lag. As a percentage the
  // values are already comparable, so they are NOT scaled; as an amount they are the same
  // units as the level and scale with it.
  var grow = rsIsGrow(k), amt = rsGrowAmt(k);
  var gscale = amt ? scale : function(v){ return v; };
  var ser = function(name){ return grow ? (rsGrowArr(k, m, name, amt) || []).map(gscale) : (m[name] || []).map(scale); };
  var cur = rsCur(m);
  var unitLbl = m.unit === 'eps'   ? cur
              : m.unit === 'pct'   ? '%'
              : m.unit === 'count' ? (m.unitLabel || 'count')
              : (div === 1000 ? cur + 'B' : cur + 'M');
  function sl(a){ return a.slice(lo, hi + 1); }

  var datasets = [], needY2 = false;
  if (has.guide && !st.hidden.guide){
    // A guide can be a RANGE (Amazon, Lyft) or a single POINT (Spotify guides one
    // number per metric, not a band). A point guide has guideLo === guideHi, which
    // as a floating bar is zero pixels tall — i.e. invisible. So the two cases get
    // two different marks: a translucent band for a range, and a horizontal tick
    // for a point. Both are honest about what the company actually said.
    var isPoint = function(i){ return m.guideLo[i] != null && m.guideHi[i] != null && m.guideLo[i] === m.guideHi[i]; };
    // The band is transformed too: in growth mode it reads as the growth the company's own
    // guide implies, which is the number the print gets judged against.
    var gLo = ser('guideLo'), gHi = ser('guideHi');
    var bandData = m.periods.map(function(_, i){
      return (m.guideLo[i] == null || m.guideHi[i] == null || isPoint(i) ||
              gLo[i] == null || gHi[i] == null) ? null : [gLo[i], gHi[i]];
    });
    var pointData = m.periods.map(function(_, i){ return isPoint(i) ? gLo[i] : null; });
    if (bandData.some(function(v){ return v != null; })){
      datasets.push({ label: 'Guidance range', type: 'bar',
        data: sl(bandData),
        backgroundColor: RS_GUIDE, borderColor: 'rgba(62,90,130,0.45)', borderWidth: 1, borderSkipped: false,
        barPercentage: 0.98, categoryPercentage: 0.98, grouped: false, order: 10 });
    }
    if (pointData.some(function(v){ return v != null; })){
      datasets.push({ label: 'Guidance', type: 'line',
        data: sl(pointData),
        showLine: false,               // each quarter's guide is its own number, not a trend
        pointStyle: 'line', pointRadius: 15, pointHoverRadius: 15,
        borderColor: 'rgba(62,90,130,0.95)', borderWidth: 2.5,
        spanGaps: false, order: 1 });
    }
  }
  if (!st.hidden.act) datasets.push({ label: 'Actual', data: sl(ser('act')), backgroundColor: RS_ACT, borderRadius: 3, maxBarThickness: 26, order: 3 });
  if (has.summit && !st.hidden.summit) datasets.push({ label: 'Summit model', data: sl(ser('summit')), backgroundColor: RS_SUMMIT, borderRadius: 3, maxBarThickness: 26, order: 4 });
  if (has.cons && !st.hidden.cons)     datasets.push({ label: 'Consensus', data: sl(ser('cons')), backgroundColor: RS_CONS, borderRadius: 3, maxBarThickness: 26, order: 5 });

  // Margin lines are suppressed in growth mode: the left axis is already a percentage there,
  // and two unrelated percentages sharing one chart is how a reader mistakes one for the other.
  if (!grow && !isTop && !st.hidden.margin && m.marginOf && m.unit !== 'eps'){
    var ma = rsMarginArr(k, m, 'act'), ms = rsMarginArr(k, m, 'summit'), mc = rsMarginArr(k, m, 'cons');
    if (ma && ma.some(function(v){ return v != null; })){
      needY2 = true;
      datasets.push({ label: 'Margin % (actual)', type: 'line', yAxisID: 'y2', data: sl(ma),
        borderColor: 'rgba(30,39,51,0.9)', backgroundColor: 'rgba(30,39,51,0.9)', borderWidth: 2,
        pointRadius: 2.5, tension: 0.25, spanGaps: true, order: 1 });
    }
    if (ms && ms.some(function(v){ return v != null; })){
      needY2 = true;
      datasets.push({ label: 'Margin % (Summit)', type: 'line', yAxisID: 'y2', data: sl(ms),
        borderColor: RS_SUMMIT, backgroundColor: RS_SUMMIT, borderWidth: 2, borderDash: [5, 4],
        pointRadius: 2, tension: 0.25, spanGaps: true, order: 2 });
    }
    if (mc && mc.some(function(v){ return v != null; })){
      needY2 = true;
      datasets.push({ label: 'Margin % (consensus)', type: 'line', yAxisID: 'y2', data: sl(mc),
        borderColor: 'rgba(124,134,148,0.9)', backgroundColor: 'rgba(124,134,148,0.9)', borderWidth: 2, borderDash: [2, 3],
        pointRadius: 2, tension: 0.25, spanGaps: true, order: 2 });
    }
  }

  var tEl = document.getElementById('rsChartT-' + k);
  if (tEl) tEl.innerHTML = esc(m.label) + ' — ' +
    (grow ? esc(rsGrowLabel(k)) + ' <span>(' + (amt ? unitLbl + ' added over the base period' : 'percent') +
            ' · every series measured against the reported period ' + rsLook(k) +
            (rsViewName(k) === 'q' ? (rsLook(k) === 1 ? ' quarter' : ' quarters') : ' year') + ' back)</span>'
          : 'actual vs expectations <span>(' + unitLbl + ' per period · ' + (isTop ? '' : 'margin lines on the right axis · ') + 'hover a period for every series)</span>');

  // Forward (estimate) periods: the reported labels render muted grey here; the FORWARD labels are
  // hidden (callback → '') and the rsFwdZone plugin redraws them inside a highlighted bubble, over a
  // shaded "FORECAST" zone — so old-vs-forward is unmistakable.
  var lastA = rsLastAct(m);
  var fwdFrom = (lastA + 1 > hi) ? -1 : Math.max(0, (lastA + 1) - lo);
  var scales = {
    x: { grid: { display: false }, ticks: { color: 'rgba(80,90,104,0.9)', font: { size: 11 }, autoSkip: false,
        callback: function(v, i){ return (fwdFrom >= 0 && i >= fwdFrom) ? '' : this.getLabelForValue(v); } } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 },
      callback: function(v){ return (grow && !amt) ? (+v.toFixed(1)) + '%' : rsTick(v, m.unit, div, m.cur); } } }
  };
  if (st.yr){ scales.y.min = st.yr[0]; scales.y.max = st.yr[1]; }
  if (needY2) scales.y2 = { position: 'right', grid: { display: false },
    ticks: { font: { size: 11 }, callback: function(v){ return v + '%'; } } };

  st.chart = new Chart(el.getContext('2d'), {
    type: 'bar',
    data: { labels: sl(m.periods), datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
      // Period-wise hover: one tooltip listing EVERY series at that period
      // (guidance range, actual, both estimates with their surprise, margins).
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        rsFwdZone: { from: fwdFrom },
        tooltip: {
          callbacks: {
            label: function(ctx){
              var i = ctx.dataIndex + lo;
              if (ctx.dataset.label === 'Guidance range'){
                return 'Guidance: ' + rsFmt(m, m.guideLo[i]) + ' – ' + rsFmt(m, m.guideHi[i]);
              }
              if (ctx.dataset.label === 'Guidance'){   // a single guided number, no range
                return 'Guidance: ' + rsFmt(m, m.guideLo[i]);
              }
              if (ctx.dataset.yAxisID === 'y2'){
                return ctx.dataset.label + ': ' + (ctx.parsed.y == null ? '—' : ctx.parsed.y.toFixed(1) + '%');
              }
              var raw = { 'Actual': m.act, 'Summit model': m.summit, 'Consensus': m.cons }[ctx.dataset.label];
              var line = ctx.dataset.label + ': ' + rsFmt(m, raw ? raw[i] : null);
              if (ctx.dataset.label !== 'Actual' && raw && raw[i] != null && m.act[i] != null){
                var s = rsSurp(m.act[i], raw[i]);
                line += '  (actual ' + (s >= 0 ? '+' : '−') + Math.abs(s).toFixed(dec) + '% · ' + rsFmtD(m, m.act[i] - raw[i]) + ')';
              }
              return line;
            }
          }
        }
      },
      scales: scales
    },
    plugins: [rsFwdZone]
  });

  rsSyncSlider(k, m);
  rsRenderTable(k, m);
  rsWireBrush(k, el, st.chart, lo);
  var n1 = document.getElementById('rsNote-' + k); if (n1) n1.textContent = m.note || '';
  var leg = document.getElementById('rsLegend-' + k); if (leg) leg.innerHTML = rsLegendHtml(k, m);
}

// ─── Drag-to-zoom brush (both axes) ───────────────────────────────────────────
// Drag across the chart to zoom: the axis follows the DIRECTION OF THE DRAG —
// mostly-horizontal windows that stretch of periods, mostly-vertical sets the
// y-axis range — with a translucent selection box tracking it. Starting on the
// y-axis strip (left of the plot) always means a y-drag, as does any drag on a
// chart with no x-windowing. Double-click resets both. `onX(i1, i2)` receives
// chart-relative period indexes; `onY(lo, hi)` receives axis values; pass
// onX = null for charts with no x-windowing.
// The axis used to be chosen from the START POSITION alone, which put the whole
// y-zoom behind a ~40px strip nobody finds and made a vertical drag anywhere in
// the plot silently do nothing (it was read as an x-drag of zero width, then
// discarded by the 8px threshold). There are no on-screen hints here by design,
// so the gesture has to be the obvious one.
function rsAttachBrush(el, chart, onX, onY, onReset){
  var wrap = el.parentElement;
  if (wrap && getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';
  el.style.cursor = 'crosshair';
  el.onmousedown = function(ev){
    if (ev.button !== 0) return;
    var r0 = el.getBoundingClientRect(), w0 = wrap.getBoundingClientRect();
    var area = chart.chartArea;
    var forcedY = ((ev.clientX - r0.left) < area.left) || !onX;
    var vertical = forcedY ? true : null;   // null = direction not decided yet
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
    // Lock the axis once the pointer has moved far enough to show intent.
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
      if (vertical == null) return;                   // a click, not a drag
      if (vertical){
        if (Math.abs(e2.clientY - startY) < 8) return;   // a click, not a drag
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

function rsWireBrush(k, el, chart, lo){
  rsAttachBrush(el, chart,
    function(a, b){ rsSt(k).win = [lo + a, lo + b]; rsBuildChart(k); },
    function(v1, v2){ rsSt(k).yr = [v1, v2]; rsBuildChart(k); },
    function(){ var st = rsSt(k); st.win = null; st.yr = null; rsBuildChart(k); });
}

// ─── Period-window slider ─────────────────────────────────────────────────────

function rsSyncSlider(k, m){
  var mn = document.getElementById('rsMin-' + k), mx = document.getElementById('rsMax-' + k);
  var fill = document.getElementById('rsFill-' + k), e0 = document.getElementById('rsEnd0-' + k), e1 = document.getElementById('rsEnd1-' + k);
  if (!mn || !mx) return;
  var n = m.periods.length, w = rsWin(k, m);
  mn.max = n - 1; mx.max = n - 1;
  mn.value = w[0]; mx.value = w[1];
  if (fill){ fill.style.left = (w[0] / (n - 1) * 100) + '%'; fill.style.width = ((w[1] - w[0]) / (n - 1) * 100) + '%'; }
  if (e0) e0.textContent = m.periods[w[0]];
  if (e1) e1.textContent = m.periods[w[1]];
  // One dot per available period along the track — filled when inside the
  // selected window, hollow-ish for forward (estimate) periods.
  var ticks = document.getElementById('rsTicks-' + k);
  if (ticks){
    var h = '', tkLastA = rsLastAct(m);
    for (var i = 0; i < n; i++){
      var cls = 'rs-tick' + (i >= w[0] && i <= w[1] ? ' on' : '') + (i > tkLastA ? ' est' : '');
      h += '<span class="' + cls + '" style="left:' + (i / (n - 1) * 100) + '%" title="' + esc(m.periods[i]) + '"></span>';
    }
    ticks.innerHTML = h;
  }
}

// ─── Detail table — TRANSPOSED, Fiscal.ai-style spreadsheet ───────────────────
// (The "Range analytics" KPI tiles that used to sit above the table were
// removed Jul 28 per SAB — the table's sticky "Range record" column carries
// the same read.)

function rsRenderTable(k, m){
  // The collapsed header names the metric and counts the window, so it moves with both.
  var th = document.querySelector('[data-rstblb="' + k + '"]');
  if (th) th.innerHTML = rsTableHeadHtml(k, m);
  var el = document.getElementById('rsTable-' + k);
  if (!el) return;
  var has = rsRefsFor(m);
  var isTop = k === 'top';
  var w = rsWin(k, m), lo = w[0], hi = w[1];
  var dec = m.unit === 'eps' ? 2 : 1;
  var div = rsScaleOf(m);
  var idx = [], est = [], tbLastA = rsLastAct(m);
  for (var i = lo; i <= hi; i++){ idx.push(i); est.push(i > tbLastA); }

  function num(v){
    if (v == null) return '<span class="rs-ft-nil">—</span>';
    if (m.unit === 'eps') return Number(v).toFixed(2);
    if (m.unit === 'pct') return Number(v).toFixed(1) + '%';
    if (m.unit === 'count') return Math.round(v).toLocaleString();
    return (v/div).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  function pctDollar(p, d){
    if (p == null) return '<span class="rs-ft-nil">—</span>';
    return rsPctHtml(p, dec) + ' <span class="rs-ft-dim">· ' + rsFmtD(m, d) + '</span>';
  }

  // ── Range-summary helpers: the right-hand "how close are we over time"
  //    column, computed over the selected window. ──
  function avg(a){ return a.reduce(function(x, y){ return x + y; }, 0) / a.length; }
  function sgn(v, dec, suf){ return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(dec == null ? 1 : dec) + (suf || '%'); }
  function sumGrowth(fn){
    var g = []; idx.forEach(function(i){ var v = fn(i); if (v != null) g.push(v); });
    return g.length ? 'avg ' + sgn(avg(g)) : '';
  }
  // Actual-centric: how the ACTUAL came in vs this reference — ▲ = the actual
  // beat the estimate (matches the surprise cells and the beat/miss legend).
  function sumSurprise(arr){
    var pcts = [], dols = [], above = 0, below = 0;
    idx.forEach(function(i){
      if (arr[i] == null || m.act[i] == null || !arr[i]) return;
      var dv = m.act[i] - arr[i];
      pcts.push(dv / Math.abs(arr[i]) * 100); dols.push(dv);
      if (dv >= 0) above++; else below++;
    });
    if (!pcts.length) return '';
    var ap = avg(pcts);
    return above + '▲ · ' + below + '▼<br><span class="rs-ft-dim">actual avg <span style="color:' + (ap >= 0 ? RS_GREEN : RS_RED) + '">' + sgn(ap) + '</span> · ' + rsFmtD(m, avg(dols)) + '</span>';
  }
  function sumMargin(arr){
    var v = []; idx.forEach(function(i){ if (arr && arr[i] != null) v.push(arr[i]); });
    return v.length ? 'avg ' + avg(v).toFixed(1) + '%' : '';
  }
  // CAGR of the REPORTED series only — an estimate is not an observation.
  // Annualization depends on the VIEW (4 periods/yr in quarterly), never on the
  // YoY/QoQ growth lag.
  function sumCagr(){
    var first = null, last = null, fi = null, li = null;
    idx.forEach(function(i){ var v = m.act[i]; if (v != null){ if (first == null){ first = v; fi = i; } last = v; li = i; } });
    if (first == null || li === fi || first <= 0 || last <= 0) return '';
    var years = (li - fi) / (_rs.view === 'q' ? 4 : 1);
    return years > 0 ? 'CAGR ' + sgn((Math.pow(last / first, 1 / years) - 1) * 100) : '';
  }
  function sumGuide(){
    var ab = 0, wi = 0, be = 0, mids = [];
    idx.forEach(function(i){
      if (m.guideLo[i] == null || m.act[i] == null) return;
      if (m.act[i] > m.guideHi[i]) ab++; else if (m.act[i] < m.guideLo[i]) be++; else wi++;
      var mid = rsGuideMid(m, i); if (mid) mids.push((m.act[i] - mid) / Math.abs(mid) * 100);
    });
    if (!(ab + wi + be)) return '';
    return ab + '▲ · ' + wi + '⊙ · ' + be + '▼<br><span class="rs-ft-dim">avg vs mid ' + sgn(avg(mids)) + '</span>';
  }

  var unitCap = m.unit === 'eps'   ? (rsCurName(m) + ' per share')
              : m.unit === 'pct'   ? 'percent (%)'
              : m.unit === 'count' ? (m.unitLabel || 'count')
              : (rsCurName(m) + ' ' + (div === 1000 ? 'billions' : 'millions'));
  var h = '<div class="rs-ft-cap">' + unitCap + ' · <span class="rs-ft-e">E</span> = estimate, no actual reported yet · the right column summarizes the selected range: how the actual has come in vs each estimate (▲ = beat)</div>';
  h += '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h"></th>';
  idx.forEach(function(i, c){
    h += '<th class="' + (est[c] ? 'rs-ft-este' : '') + '">' + esc(m.periods[i]) + (est[c] ? ' <span class="rs-ft-e">E</span>' : '') + '</th>';
  });
  h += '<th class="rs-ft-s">Range record</th>';
  h += '</tr></thead><tbody>';

  function row(label, cellFn, cls, sum){
    var classes = cls.split(' ').map(function(c){ return 'rs-ft-' + c; }).join(' ');
    var r = '<tr class="' + classes + '"><td class="rs-ft-h">' + label + '</td>';
    idx.forEach(function(i, c){ r += '<td class="' + (est[c] ? 'rs-ft-este' : '') + '">' + cellFn(i) + '</td>'; });
    r += '<td class="rs-ft-s">' + (sum || '') + '</td>';
    return r + '</tr>';
  }

  var showMargin = m.marginOf && m.unit !== 'eps' && !isTop;

  // Actual: value → YoY/QoQ growth (→ margin).
  var growLbl = rsGrowLabel(k);
  var maA = showMargin ? rsMarginArr(k, m, 'act') : null;
  h += row('Actual', function(i){ return m.act[i] == null ? '<span class="rs-ft-nil">—</span>' : '<b>' + num(m.act[i]) + '</b>'; }, 'main nb', sumCagr());
  h += row(growLbl, function(i){ return pctDollar(rsActGrowthPct(k, m, i), rsActGrowthDollar(k, m, i)); }, showMargin ? 'sub nb' : 'sub', sumGrowth(rsActGrowthPct.bind(null, k, m)));
  if (showMargin) h += row(esc(m.marginLabel || 'margin'), function(i){ return maA && maA[i] != null ? maA[i].toFixed(1) + '%' : '<span class="rs-ft-nil">—</span>'; }, 'sub', sumMargin(maA));

  // Reference series (Summit / Consensus): value → YoY growth → surprise (→ margin).
  [{ on: has.summit, series: 'summit', label: 'Summit model' },
   { on: has.cons,   series: 'cons',   label: 'Consensus' }].forEach(function(r){
    if (!r.on) return;
    var s = r.series;
    var mm = showMargin ? rsMarginArr(k, m, s) : null;
    h += row(r.label, function(i){ return num(m[s][i]); }, 'main nb', '');
    h += row(growLbl, function(i){ return pctDollar(rsRefGrowthPct(k, m, s, i), rsRefGrowthDollar(k, m, s, i)); }, 'sub nb',
      sumGrowth(function(i){ return rsRefGrowthPct(k, m, s, i); }));
    h += row('surprise', function(i){ return (m.act[i] == null || m[s][i] == null) ? '<span class="rs-ft-nil">—</span>' : pctDollar(rsSurp(m.act[i], m[s][i]), m.act[i] - m[s][i]); },
      mm ? 'sub nb' : 'sub', sumSurprise(m[s]));
    if (mm) h += row(esc(m.marginLabel || 'margin'), function(i){ return mm[i] != null ? mm[i].toFixed(1) + '%' : '<span class="rs-ft-nil">—</span>'; }, 'sub', sumMargin(mm));
  });

  if (has.guide){
    // A point guide prints one number, not "4800–4800".
    h += row('Guidance', function(i){
      if (m.guideLo[i] == null) return '<span class="rs-ft-nil">—</span>';
      return (m.guideLo[i] === m.guideHi[i]) ? num(m.guideLo[i]) : (num(m.guideLo[i]) + '–' + num(m.guideHi[i]));
    }, 'main nb', '');
    // "within" only exists when there IS a range; against a single guided number the
    // comparison is simply above or below it, and the delta is vs the guide, not vs a mid.
    var anyRangeRow = m.guideLo.some(function(v, i){ return v != null && m.guideHi[i] != null && v !== m.guideHi[i]; });
    h += row(anyRangeRow ? 'actual vs range' : 'actual vs guide', function(i){
      if (m.guideLo[i] == null || m.act[i] == null) return '<span class="rs-ft-nil">—</span>';
      var point = m.guideLo[i] === m.guideHi[i];
      var mid = rsGuideMid(m, i), d = mid == null ? null : m.act[i] - mid;
      var word;
      if (m.act[i] > m.guideHi[i]) word = '<span style="color:' + RS_GREEN + '">above</span>';
      else if (m.act[i] < m.guideLo[i]) word = '<span style="color:' + RS_RED + '">below</span>';
      else word = '<span style="color:var(--mu)">' + (point ? 'in line' : 'within') + '</span>';
      return word + (d == null ? '' : ' <span class="rs-ft-dim">· ' + rsFmtD(m, d) + (point ? ' vs guide' : ' vs mid') + '</span>');
    }, 'sub', sumGuide());
  }

  h += '</tbody></table></div>';
  el.innerHTML = h;

  var tb = el.querySelector('table'), lastCol = -1;
  function colCells(ci){ return tb.querySelectorAll('tr > *:nth-child(' + (ci + 1) + ')'); }
  tb.onmouseover = function(e){
    var c = e.target.closest('td,th'); if (!c || c.cellIndex === lastCol) return;
    if (lastCol > 0) colCells(lastCol).forEach(function(x){ x.classList.remove('colhl'); });
    lastCol = c.cellIndex;
    if (lastCol > 0) colCells(lastCol).forEach(function(x){ x.classList.add('colhl'); });
  };
  tb.onmouseleave = function(){
    if (lastCol > 0) colCells(lastCol).forEach(function(x){ x.classList.remove('colhl'); });
    lastCol = -1;
  };
}

// ─── Estimate evolution — the annual forecast ACROSS model snapshots ──────────
// Its OWN sub-tab beside Results (same row: Call Prep · Results · Estimate
// Evolution · …), embedded via resultsEvoHtml(ticker) + initResultsEvo().
// One line per fiscal year across the saved snapshots: solid = Summit, dashed =
// the BBG consensus stored inside the model at the same date. Annual by nature
// (no Quarterly/Annual toggle). Dataset shape: `evolution` in
// results-data/<ticker>.js.

function rsEvo(){ return _rs.data ? _rs.data.evolution : null; }
function rsEvoSecCfg(k){ return rsEvo().sections.filter(function(s){ return s.key === k; })[0]; }
function rsEvoKeys(cfg){ return (cfg.groups || []).reduce(function(a, g){ return a.concat(g.keys); }, []); }
function rsEvoSt(k){
  if (!_rs.evo) _rs.evo = { sec: {} };
  if (!_rs.evo.sec[k]) _rs.evo.sec[k] = { metric: null, mode: 'usd', yr: null, chart: null, hidden: {} };
  return _rs.evo.sec[k];
}
function rsEvoMetric(k){
  var cfg = rsEvoSecCfg(k), st = rsEvoSt(k);
  if (!st.metric || rsEvoKeys(cfg).indexOf(st.metric) < 0) st.metric = cfg.defaultMetric;
  return rsEvo().metrics[st.metric];
}
// The % view of a metric for one source & fiscal year, across vintages.
// Top Line → IMPLIED YoY GROWTH: what growth each snapshot's estimate implies
// vs the prior fiscal year AS KNOWN AT THAT SNAPSHOT (chained within the
// vintage; the first year chains to `prior` — the vintage's own estimate while
// the year was open, the reported actual once closed). Profitability → MARGIN
// over the `marginOf` metric, same source and same vintage (a margin built
// from one snapshot's numerator and another's denominator would be fiction).
// The % basis is now the MODE, not the block. Growth used to be a Top Line privilege and
// margin a Profitability one; there is no reason a profit line cannot be read as growth, so
// `st.mode` carries which of the two is being asked for: 'usd' | 'grow' | 'margin'.
// Growth needs a base — the prior year inside the SAME vintage, or `prior` for the first year
// on the list — so a metric with no `prior` simply has no growth for its first year.
function rsEvoBasis(k){
  var mode = rsEvoSt(k).mode;
  return mode === 'usd' ? null : mode;
}
// Growth's one sub-choice: expressed as a percentage, or as the currency amount the line
// grew by. The comparison itself is always year-over-year — see rsEvoModeHtml.
function rsEvoGrowUnit(k){ return rsEvoSt(k).growUnit || 'pct'; }
// Is the plotted number a percentage? Everything derived is, EXCEPT growth-as-amount, which
// is a currency delta and has to be formatted, ticked and totalled like money.
function rsEvoIsAmt(k){ return rsEvoSt(k).mode === 'grow' && rsEvoGrowUnit(k) === 'amt'; }
function rsEvoPct(k, m, src, yi){
  var arr = m[src] ? m[src][yi] : null;
  if (!arr) return null;
  if (rsEvoBasis(k) === 'grow'){
    var amt = rsEvoIsAmt(k);
    return arr.map(function(cur, vi){
      var base = yi === 0
        ? (m.prior && m.prior[src] ? m.prior[src][vi] : null)
        : (m[src][yi - 1] ? m[src][yi - 1][vi] : null);
      if (cur == null || base == null || !base) return null;
      return amt ? cur - base : (cur - base) / Math.abs(base) * 100;
    });
  }
  if (!m.marginOf) return null;
  var d = rsEvo().metrics[m.marginOf];
  var den = d && d[src] ? d[src][yi] : null;
  if (!den) return null;
  return arr.map(function(v, vi){
    if (v == null || den[vi] == null || !den[vi]) return null;
    return v / den[vi] * 100;
  });
}
function rsEvoPctLabel(k, m){
  if (rsEvoBasis(k) !== 'grow') return m.marginLabel || 'margin';
  return 'implied YoY growth' + (rsEvoIsAmt(k) ? ' (amount)' : '');
}
// Display scale for an evolution metric (nested per-year arrays): $B or $M.
function rsEvoScaleOf(m){
  var mx = 0;
  ['summit', 'cons'].forEach(function(k){
    (m[k] || []).forEach(function(row){ (row || []).forEach(function(v){ if (v != null) mx = Math.max(mx, Math.abs(v)); }); });
  });
  return mx >= 10000 ? 1000 : 1;
}
// Revision between two snapshot values, read left → right. Dollars always;
// percent only when the base is non-zero and the sign holds (an FCF forecast
// flipping negative has no meaningful percent change).
function rsRevHtml(m, prev, cur){
  if (prev == null || cur == null) return '<span class="rs-ft-nil">—</span>';
  var d = cur - prev;
  var h = '<span style="color:' + (d >= 0 ? RS_GREEN : RS_RED) + '">' + rsFmtD(m, d) + '</span>';
  if (prev !== 0 && (prev > 0) === (cur > 0)){
    h += ' <span class="rs-ft-dim">· ' + (d >= 0 ? '+' : '−') + Math.abs(d / Math.abs(prev) * 100).toFixed(1) + '%</span>';
  }
  return h;
}
// Revision of a % series, in percentage points.
function rsRevPp(prev, cur){
  if (prev == null || cur == null) return '<span class="rs-ft-nil">—</span>';
  var d = cur - prev;
  return '<span style="color:' + (d >= 0 ? RS_GREEN : RS_RED) + '">' + (d >= 0 ? '+' : '−') + Math.abs(d).toFixed(1) + ' pp</span>';
}

// Embeddable pane html for the Estimate Evolution sub-tab ('' if the ticker's
// dataset has no `evolution` block). Mirrors the Results layout: stacked
// section blocks (Top Line — growth-focused · Profitability — with margins),
// each with its own metric select, US$/% display toggle, legend, chart, table.
export function resultsEvoHtml(ticker){
  var data = getResultsData(ticker);
  if (!data || !data.evolution) return '';
  _rs.data = data;
  _rs.evo = null;
  _rs.surp = null;
  var ev = data.evolution;
  var h = '<div class="rs-wrap" id="rsEvoWrap">';
  // `evolution.intro` is deliberately NOT rendered (SAB, Aug 10 2026). It was a paragraph of
  // conclusions above charts that state the same thing, and it went stale on every refresh
  // while the charts did not. The field stays in the datasets — each metric's `note`, which
  // does render under its own block, is where a written read belongs.
  h += ev.sections.map(function(cfg){ return rsEvoBlockHtml(cfg.key); }).join('');
  h += '<div class="ov-foot">' + esc(ev.note || '') + '</div>';
  // Generic Actuals-vs-Estimates surprise history at the bottom (opt-out via
  // dataset `surprise: false` — SoFi keeps its richer bespoke block).
  // NOTE: the "Actuals vs Estimates" surprise block used to render HERE, at the bottom of
  // Estimates. SAB moved it to the bottom of RESULTS (Aug 7, 2026) — it is a per-print
  // scorecard, so it belongs beside the prints, while this pane is about how the forecast
  // itself moved across vintages. See rsBody().
  h += '</div>';
  return h;
}

// Both collapsible headers carry the caret AND what is inside, so neither row is a mystery
// bar. The counts follow the legend chips like everything else in the block.
function rsEvoRecHeadHtml(k){
  var st = rsEvoSt(k), open = st.rec === true;     // every table starts collapsed (SAB, Aug 10)
  var n = rsEvoVisible(k, rsEvoMetric(k)).length;
  return '<span class="rs-collap-ic">' + (open ? '▾' : '▸') + '</span>Revision record' +
    '<span class="rs-collap-sub">' + (open ? 'hide' : 'show') + ' · ' + n + ' line' + (n === 1 ? '' : 's') +
    ' on the chart, first view to latest</span>';
}
function rsEvoDetHeadHtml(k){
  var st = rsEvoSt(k), ev = rsEvo(), open = !!st.det;
  var n = rsEvoVisible(k, rsEvoMetric(k)).length;
  return '<span class="rs-collap-ic">' + (open ? '▾' : '▸') + '</span>Snapshot by snapshot' +
    '<span class="rs-collap-sub">' + (open ? 'hide' : 'show') + ' · ' + n + ' line' + (n === 1 ? '' : 's') +
    ' × ' + ev.vintages.length + ' snapshots, with each revision</span>';
}
function rsEvoBlockHtml(k){
  var cfg = rsEvoSecCfg(k), m = rsEvoMetric(k);
  var h = '<div class="rs-block" data-rsevo="' + k + '">';
  h += '<div class="rs-block-top"><div class="rs-block-h">' + esc(cfg.label) + '</div>' +
    '<select class="rs-msel rs-esel" aria-label="Metric">' + rsEvoSelectHtml(k) + '</select>' +
    // A ROW of toggle groups, not one group: picking Growth opens two more beside it.
    '<div class="rs-modes" id="rsEvoMode-' + k + '">' + rsEvoModeHtml(k, m) + '</div>' +
    '<div class="rs-views" id="rsEvoAct-' + k + '">' + rsEvoActHtml(k) + '</div></div>';
  h += '<div class="ave-leg" id="rsEvoLegend-' + k + '">' + rsEvoLegendHtml(k, m) + '</div>';
  h += '<div class="ov-chart-card">' +
    '<div class="ov-chart-t" id="rsEvoChartT-' + k + '"></div>' +
    '<div class="ov-chart-wrap ovs-tall"><canvas id="rsEvoChart-' + k + '"></canvas></div>' +
  '</div>';
  // Chart → per-fiscal-year record → the snapshot-by-snapshot table. Both tables below the
  // chart show ONLY what the chart is currently drawing (see rsEvoVisible).
  // Both tables collapse. The record starts OPEN (it is the reading) and the detail table
  // starts closed (it is the audit trail).
  h += '<div class="rs-collap" data-rsevrec="' + k + '">' +
    '<button type="button" class="rs-collap-h" data-rsevrecb="' + k + '">' + rsEvoRecHeadHtml(k) + '</button>' +
    '<div class="rs-collap-b" id="rsEvoRecBody-' + k + '"' + (rsEvoSt(k).rec === true ? '' : ' hidden') + '>' +
      '<div class="rs-tablewrap" id="rsEvoTrack-' + k + '"></div>' +
    '</div></div>';
  // The detail table opens on click. It is the widest thing on the page — every snapshot as
  // its own column, three rows per line — and reading it is a deliberate act, not something
  // to scroll past on the way to the next block.
  h += '<div class="rs-collap" data-rsevdet="' + k + '">' +
    '<button type="button" class="rs-collap-h" data-rsevdetb="' + k + '">' + rsEvoDetHeadHtml(k) + '</button>' +
    '<div class="rs-collap-b" id="rsEvoDetBody-' + k + '" hidden>' +
      '<div class="rs-tablewrap" id="rsEvoTable-' + k + '"></div>' +
    '</div></div>';
  h += '</div>';
  return h;
}

// US$ / % display toggle (reuses the .rs-views pill styling). Top Line's %
// is the implied-YoY-growth view; Profitability's is the margin view (hidden
// when the metric declares no marginOf).
function rsEvoModeHtml(k, m){
  var st = rsEvoSt(k);
  // Margin needs a denominator; growth only needs a prior year, so it is offered everywhere.
  if (st.mode === 'margin' && !m.marginOf) st.mode = 'usd';
  var b = function(mode, label){
    return '<button type="button" class="rs-view' + (st.mode === mode ? ' active' : '') +
      '" data-rsevmode="' + mode + '">' + label + '</button>';
  };
  var h = '<div class="rs-views">' + b('usd', rsCurName() + 'B') + b('grow', 'Growth') +
    (m.marginOf ? b('margin', 'Margin %') : '') + '</div>';
  if (st.mode !== 'grow') return h;
  // Growth opens ONE more choice: expressed how. There is no YoY/QoQ pair because this pane
  // is annual by decision (SAB, Aug 10 2026) — every line is a fiscal year and the x-axis is
  // model snapshots, so no quarter exists to compare against. The data says the same thing:
  // no Summit snapshot reaches any quarter before 4Q25, and Bloomberg only ever carries four
  // forward quarters, so a quarterly version of this view would be consensus-only across most
  // of the history. The quarter-over-quarter read belongs in Earnings, beside the print.
  var unit = function(v, label){
    return '<button type="button" class="rs-view' + (rsEvoGrowUnit(k) === v ? ' active' : '') +
      '" data-rsevgunit="' + v + '">' + label + '</button>';
  };
  h += '<div class="rs-views">' + unit('pct', '%') + unit('amt', 'Amount') + '</div>';
  return h;
}

// The "Reported" toggle. Disabled — with the reason in its tooltip — when no year in the
// block has closed, which is the normal state early in a forecast window.
function rsEvoActHtml(k){
  var st = rsEvoSt(k), yrs = rsEvoActYears(k);
  if (!yrs.on.length)
    return '<button type="button" class="rs-view" disabled title="No fiscal year in this block has closed yet, so there is no reported figure to mark. ' +
      esc(yrs.off.join(', ')) + ' are still open.">Reported ✕</button>';
  return '<button type="button" class="rs-view' + (st.act ? ' active' : '') + '" data-rsevact="1" ' +
    'title="Draw a reference line at the reported figure for ' + esc(yrs.on.join(', ')) + '">Reported</button>';
}

function rsEvoSelectHtml(k){
  var ev = rsEvo(), cfg = rsEvoSecCfg(k), st = rsEvoSt(k);
  rsEvoMetric(k);                                      // ensure st.metric is valid
  return cfg.groups.map(function(g){
    var opts = g.keys.map(function(mk){
      return '<option value="' + mk + '"' + (mk === st.metric ? ' selected' : '') + '>' + esc(rsOptLabel(ev.metrics[mk])) + '</option>';
    }).join('');
    return '<optgroup label="' + esc(g.label) + '">' + opts + '</optgroup>';
  }).join('');
}

function rsEvoLegendHtml(k, m){
  var ev = rsEvo(), st = rsEvoSt(k);
  var h = ev.years.map(function(y, i){
    var off = st.hidden['y' + y];
    return '<button type="button" class="rs-leg' + (off ? ' off' : '') + '" data-rsevleg="y' + y + '" title="Show / hide">' +
      '<span class="ave-leg-act" style="background:' + EVO_RAMP[i % EVO_RAMP.length] + '"></span>FY' + esc(y) + '</button>';
  }).join('');
  h += '<button type="button" class="rs-leg' + (st.hidden.summit ? ' off' : '') + '" data-rsevleg="summit" title="Show / hide">' +
    '<span class="rs-leg-line" style="background:var(--navy)"></span>Summit (solid)</button>';
  if (m.cons){
    h += '<button type="button" class="rs-leg' + (st.hidden.cons ? ' off' : '') + '" data-rsevleg="cons" title="Show / hide">' +
      '<span class="rs-leg-dash" style="color:var(--navy)"></span>Consensus (dashed)</button>';
  }
  if (st.act){
    var ya = rsEvoActYears(k);
    h += '<button type="button" class="rs-leg" data-rsevact="1" title="Hide the reported line">' +
      '<span class="rs-leg-dash" style="color:var(--navy)"></span>Reported (dotted)</button>';
    if (ya.off.length) h += '<span class="rs-noguide" title="A fiscal year still in progress has no reported figure to mark.">⚑ FY' + esc(ya.off.join(', FY')) + ' still open</span>';
  }
  h += '<span class="tech-leg-i" style="margin-left:auto">one line per fiscal year · click a chip to hide it</span>';
  return h;
}

// ─── "Where did it actually land" (SAB, Aug 7 2026) ───────────────────────────
// A reference line across the whole vintage axis at the REPORTED figure, so a snapshot
// trajectory can be read against the outcome instead of only against itself. Only fiscal
// years that have CLOSED qualify — marking an open year would draw a line at a number that
// does not exist yet. The annual actual is looked up in the `y` view by the evolution
// metric's own key (or an explicit `actKey` when the two datasets name a line differently).
function rsEvoActual(mkey, m, year){
  var vy = _rs.data && _rs.data.views && _rs.data.views.y;
  if (!vy) return null;
  var am = vy.metrics[m.actKey || mkey];
  if (!am || !am.act) return null;
  var i = am.periods.indexOf(String(year));
  return i < 0 ? null : (am.act[i] == null ? null : am.act[i]);
}
// The same figure expressed in whatever the % mode of this block means: implied YoY growth
// on Top Line, the margin over `marginOf` on Profitability — both computed ACTUAL-on-ACTUAL,
// never mixing a reported numerator with an estimated denominator.
function rsEvoActualPct(k, mkey, m, year){
  var a = rsEvoActual(mkey, m, year);
  if (a == null) return null;
  if (rsEvoBasis(k) === 'grow'){
    var prev = rsEvoActual(mkey, m, String(+year - 1));
    if (prev == null || !prev) return null;
    return rsEvoIsAmt(k) ? a - prev : (a - prev) / Math.abs(prev) * 100;
  }
  if (!m.marginOf) return null;
  var den = rsEvoActual(m.marginOf, rsEvo().metrics[m.marginOf] || {}, year);
  return (den == null || !den) ? null : a / den * 100;
}
// Which of the block's years can be marked, and which cannot — the answer drives both the
// toggle's availability and the on-screen reason, so an empty toggle never reads as broken.
function rsEvoActYears(k){
  var ev = rsEvo(), st = rsEvoSt(k), m = rsEvoMetric(k), on = [], off = [];
  ev.years.forEach(function(y){
    var v = st.mode !== 'usd' ? rsEvoActualPct(k, st.metric, m, y) : rsEvoActual(st.metric, m, y);
    (v == null ? off : on).push(y);
  });
  return { on: on, off: off };
}

// Repaint one evolution block's toggle + legend in place (the chart is rebuilt separately).
// Both depend on the mode and on which years can be marked, so patching the chart alone
// would leave a stale pill.
function rsRerenderEvoHead(wrap, k){
  var root = wrap || document;
  var a = root.querySelector('#rsEvoAct-' + k); if (a) a.innerHTML = rsEvoActHtml(k);
  var l = root.querySelector('#rsEvoLegend-' + k); if (l) l.innerHTML = rsEvoLegendHtml(k, rsEvoMetric(k));
}

function rsBuildEvo(k){
  var ev = rsEvo();
  if (!ev) return;
  var st = rsEvoSt(k), m = rsEvoMetric(k);
  var el = document.getElementById('rsEvoChart-' + k);
  if (!el || !el.offsetParent) return;                 // pane not visible yet
  if (st.chart){ st.chart.destroy(); st.chart = null; }

  // `derived` = the plotted number is computed (growth or margin) rather than the level.
  // `amt` = growth expressed in currency, which is derived but NOT a percentage, so it is
  // scaled and ticked like money. `pct` therefore means "axis and labels are percentages".
  var derived = st.mode !== 'usd', amt = rsEvoIsAmt(k), pct = derived && !amt;
  var div = rsEvoScaleOf(m);
  var scale = function(v){ return v == null ? null : v / div; };
  function series(src, yi){
    if (derived){
      var d = rsEvoPct(k, m, src, yi);
      return (amt && d) ? d.map(scale) : d;
    }
    var a = m[src] ? m[src][yi] : null;
    return a ? a.map(scale) : null;
  }

  var datasets = [];
  ev.years.forEach(function(y, yi){
    if (st.hidden['y' + y]) return;
    var color = EVO_RAMP[yi % EVO_RAMP.length];
    var s = !st.hidden.summit ? series('summit', yi) : null;
    if (s && s.some(function(v){ return v != null; })){
      datasets.push({ label: 'FY' + y + ' · Summit', data: s,
        borderColor: color, backgroundColor: color, borderWidth: 2.5,
        pointRadius: 3.5, pointBackgroundColor: color, tension: 0, spanGaps: true, _src: 'summit', _yi: yi });
    }
    var c = !st.hidden.cons ? series('cons', yi) : null;
    if (c && c.some(function(v){ return v != null; })){
      datasets.push({ label: 'FY' + y + ' · Consensus', data: c,
        borderColor: color, backgroundColor: color, borderWidth: 2, borderDash: [6, 4],
        pointRadius: 2.5, pointBackgroundColor: color, tension: 0, spanGaps: true, _src: 'cons', _yi: yi });
    }
  });

  // The reported reference line — flat across every snapshot, dotted so it reads as an
  // outcome rather than another forecast. Drawn last (order 99) so it sits behind the lines.
  if (st.act){
    ev.years.forEach(function(y, yi){
      if (st.hidden['y' + y]) return;
      var av = derived ? (amt ? scale(rsEvoActualPct(k, st.metric, m, y)) : rsEvoActualPct(k, st.metric, m, y))
                       : scale(rsEvoActual(st.metric, m, y));
      if (av == null) return;
      datasets.push({ label: 'FY' + y + ' · reported', data: ev.vintages.map(function(){ return av; }),
        borderColor: EVO_RAMP[yi % EVO_RAMP.length], borderWidth: 1.5, borderDash: [2, 3],
        pointRadius: 0, pointHitRadius: 6, tension: 0, fill: false, _src: 'act', _yi: yi, order: 99 });
    });
  }

  var tEl = document.getElementById('rsEvoChartT-' + k);
  if (tEl) tEl.innerHTML = esc(m.label) + ' — ' +
    (derived
      ? esc(rsEvoPctLabel(k, m)) + ' by model snapshot <span>(' +
        (amt ? (m.cur || '$') + (div === 1000 ? 'B' : 'M') + ' of growth over the prior fiscal year'
             : '% per fiscal year, each snapshot against its own numbers') +
        ' · solid = Summit model, dashed = stored BBG consensus)</span>'
      : 'forecast by model snapshot <span>(' + (m.cur || '$') + (div === 1000 ? 'B' : 'M') + ' per fiscal year · solid = Summit model, dashed = stored BBG consensus · hover for the revision)</span>');

  st.chart = new Chart(el.getContext('2d'), {
    type: 'line',
    data: { labels: ev.vintages.map(function(v){ return [v.label, v.event]; }), datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: function(items){
              var v = ev.vintages[items[0].dataIndex];
              return v.label + ' · ' + v.event;
            },
            label: function(ctx){
              var i = ctx.dataIndex;
              // The reported line is one number repeated — no revision to report against it.
              if (ctx.dataset._src === 'act')
                return ctx.dataset.label + ': ' + (pct ? ctx.parsed.y.toFixed(1) + '%' : rsFmt(m, ctx.parsed.y * div));
              if (derived){
                var p = rsEvoPct(k, m, ctx.dataset._src, ctx.dataset._yi) || [];
                var line = ctx.dataset.label + ': ' +
                  (p[i] == null ? '—' : (amt ? rsFmtD(m, p[i]) : p[i].toFixed(1) + '%'));
                if (i > 0 && p[i] != null && p[i - 1] != null){
                  var d = p[i] - p[i - 1];
                  line += '  (' + (amt ? rsFmtD(m, d) : (d >= 0 ? '+' : '−') + Math.abs(d).toFixed(1) + ' pp') +
                    ' vs prior snapshot)';
                }
                return line;
              }
              var arr = m[ctx.dataset._src][ctx.dataset._yi];
              var cur = arr[i];
              var line2 = ctx.dataset.label + ': ' + rsFmt(m, cur);
              if (i > 0 && arr[i - 1] != null && cur != null){
                line2 += '  (' + rsFmtD(m, cur - arr[i - 1]) + ' vs prior snapshot)';
              }
              return line2;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 },
          callback: function(v){ return pct ? (+v.toFixed(1)) + '%' : rsTick(v, m.unit, div, m.cur); } },
          min: st.yr ? st.yr[0] : undefined, max: st.yr ? st.yr[1] : undefined }
      }
    }
  });

  // Vertical-only brush: only 3 x-points, so any drag adjusts the y-range.
  rsAttachBrush(el, st.chart, null,
    function(v1, v2){ rsEvoSt(k).yr = [v1, v2]; rsBuildEvo(k); },
    function(){ rsEvoSt(k).yr = null; rsBuildEvo(k); });

  // Both tables are rebuilt with the chart, from the same visibility state — so a chip click
  // moves all three together instead of leaving a table describing a line that is gone.
  rsRenderEvoTrack(k, m);
  rsRenderEvoTable(k, m);
  // Both collapsible headers count the visible lines, so they move with the chips too.
  var rh = document.querySelector('[data-rsevrecb="' + k + '"]');
  if (rh) rh.innerHTML = rsEvoRecHeadHtml(k);
  var dh = document.querySelector('[data-rsevdetb="' + k + '"]');
  if (dh) dh.innerHTML = rsEvoDetHeadHtml(k);
  // The per-metric `note` is no longer rendered (SAB, Aug 10 2026), for the same reason the
  // pane's lede went: a paragraph of conclusions under a chart that shows them, which ages
  // out of step with the numbers above it on every refresh. The field stays in the datasets —
  // it is still the written record of a basis decision — but the pane reads from the data.
  var leg = document.getElementById('rsEvoLegend-' + k); if (leg) leg.innerHTML = rsEvoLegendHtml(k, m);
  var md = document.getElementById('rsEvoMode-' + k); if (md) md.innerHTML = rsEvoModeHtml(k, m);
}

function rsRenderEvoTable(k, m){
  var ev = rsEvo();
  var el = document.getElementById('rsEvoTable-' + k);
  if (!el) return;
  var nv = ev.vintages.length;
  var div = rsEvoScaleOf(m);

  function num(v){
    if (v == null) return '<span class="rs-ft-nil">—</span>';
    return (v / div).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  var pctCap = rsEvoBasis(k) === 'grow'
    ? ' · “implied YoY growth” = the growth that snapshot\'s estimate implies vs the prior fiscal year as known at that date'
    : ' · margins are computed within each snapshot (numerator and denominator from the same vintage)';
  // ⚠ CURLY-QUOTE FIX, finished. This line originally shipped with curly quotes as its
  // JavaScript string delimiters, which is a hard parse error — the WHOLE of js/results.js
  // failed to load, taking Results, Estimate Evolution and every Earnings "Setup picture"
  // chart down for EVERY company. PRs #74/#75 fixed the JS delimiters so the file parses,
  // but left the HTML ATTRIBUTE quotes curly: `class=”rs-ft-cap”`. That is no longer a parse
  // error (it is inside a string), so it looks fixed — but the browser then reads the class
  // name as `”rs-ft-cap”` WITH the curly quotes, so the `.rs-ft-cap` rule never matches and
  // the caption under the Estimates table renders unstyled. Straight quotes on both now.
  // The typographic quotes INSIDE the prose (“revision”, the model’s) are intentional.
  var h = '<div class="rs-ft-cap">' + rsCurName(m) + ' ' + (div === 1000 ? 'billions' : 'millions') + ' · columns are the model’s saved snapshots · “revision” = change vs the prior snapshot · the right column is the cumulative move from the first snapshot to the latest' + pctCap + '</div>';
  h += '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h"></th>';
  ev.vintages.forEach(function(v){
    h += '<th>' + esc(v.label) + '<br><span class="rs-ft-dim">' + esc(v.event) + '</span></th>';
  });
  h += '<th class="rs-ft-s">Cumulative revision</th></tr></thead><tbody>';

  function rows(label, arr, pcts){
    if (!arr) return '';
    var hasPct = pcts && pcts.some(function(v){ return v != null; });
    var r = '<tr class="rs-ft-main rs-ft-nb"><td class="rs-ft-h">' + label + '</td>';
    arr.forEach(function(v){ r += '<td><b>' + num(v) + '</b></td>'; });
    r += '<td class="rs-ft-s">' + rsRevHtml(m, arr[0], arr[nv - 1]) + '</td></tr>';
    r += '<tr class="rs-ft-sub' + (hasPct ? ' rs-ft-nb' : '') + '"><td class="rs-ft-h">revision</td>';
    arr.forEach(function(v, i){ r += '<td>' + (i === 0 ? '<span class="rs-ft-nil">—</span>' : rsRevHtml(m, arr[i - 1], v)) + '</td>'; });
    r += '<td class="rs-ft-s"></td></tr>';
    if (hasPct){
      // Growth-as-amount is a currency delta, so its row is money and its summary is a money
      // difference — not points.
      var amtRow = rsEvoIsAmt(k);
      r += '<tr class="rs-ft-sub"><td class="rs-ft-h">' + esc(rsEvoPctLabel(k, m)) + '</td>';
      pcts.forEach(function(v){
        r += '<td>' + (v == null ? '<span class="rs-ft-nil">—</span>' : (amtRow ? rsFmtD(m, v) : v.toFixed(1) + '%')) + '</td>';
      });
      r += '<td class="rs-ft-s">' + (amtRow ? rsRevHtml(m, pcts[0], pcts[nv - 1]) : rsRevPp(pcts[0], pcts[nv - 1])) + '</td></tr>';
    }
    return r;
  }

  // Only the lines the chart is drawing — same source of truth as the revision record above.
  var vis = rsEvoVisible(k, m);
  vis.forEach(function(v){
    h += rows(esc(v.label), m[v.src] ? m[v.src][v.yi] : null, rsEvoPct(k, m, v.src, v.yi));
  });
  if (!vis.length){
    h += '<tr><td class="rs-ft-h" colspan="' + (nv + 2) + '"><span class="rs-ft-dim">Every line is hidden — click a chip above to bring one back.</span></td></tr>';
  }

  h += '</tbody></table></div>';
  el.innerHTML = h;
}

// ─── Actuals vs Estimates — generic surprise history (bottom of the Estimates
// pane, any ticker). Fed ONLY from the Results dataset: every quarterly metric
// that has at least one reported actual + frozen Summit-estimate pair. Diverging
// surprise bars (green = beat, red = miss — Results datasets carry no expense
// lines), a Surprise % ⇄ $ toggle, the tick-dot slider, and the transposed
// table. A dataset opts out with `surprise: false` (SoFi keeps its richer
// bespoke block instead). ─────────────────────────────────────────────────────
// The four comparable series. Guidance is a BAND in the dataset, so it enters the
// comparison as its midpoint — the only way to score it as a single number; the band
// itself stays the honest view and lives on the Results charts above.
var RS_SRCS = ['act', 'summit', 'cons', 'guide'];
var RS_SRC_LABEL = { act: 'Actual', summit: 'Summit', cons: 'Consensus', guide: 'Guidance (mid)' };
var RS_SRC_SHORT = { act: 'actual', summit: 'Summit', cons: 'Consensus', guide: 'guidance mid' };
var RS_SRC_COLOR = { act: RS_ACT, summit: RS_SUMMIT, cons: RS_CONS, guide: 'rgba(62,90,130,0.8)' };
function rsSrcArr(m, key){
  if (key === 'guide') return m.guideLo ? m.periods.map(function(_, i){ return rsGuideMid(m, i); }) : null;
  return m[key] || null;
}
function rsSrcHas(m, key){ var a = rsSrcArr(m, key); return !!a && a.some(function(v){ return v != null; }); }
function rsSurpPairOk(m, a, b){
  var A = rsSrcArr(m, a), B = rsSrcArr(m, b);
  if (!A || !B) return false;
  return m.periods.some(function(_, i){ return A[i] != null && B[i] != null; });
}
// A metric qualifies when ANY two of its series overlap — not just actual-vs-Summit.
// Deliberately independent of the current base/comparator choice, so changing the
// comparison never makes the metric disappear from the dropdown mid-session.
function rsSurpGroups(){
  var v = _rs.data.views.q, out = [];
  v.sections.forEach(function(cfg){
    rsSecGroups(cfg).forEach(function(g){
      var keys = g.keys.filter(function(k){
        var m = v.metrics[k]; if (!m) return false;
        var srcs = RS_SRCS.filter(function(s){ return rsSrcHas(m, s); });
        for (var i = 0; i < srcs.length; i++)
          for (var j = i + 1; j < srcs.length; j++)
            if (rsSurpPairOk(m, srcs[i], srcs[j])) return true;
        return false;
      });
      if (keys.length) out.push({ label: g.label, keys: keys });
    });
  });
  return out;
}
// Scoped element lookup for the surprise block. Its ids are NOT suffixed per section the
// way the stacked blocks' are, so a SECOND engine instance on the page (the merged Setup
// chart, which runs the same rsBody) would duplicate them — and a bare getElementById then
// returns whichever is first in the DOM, which is the hidden one, and the chart silently
// never builds. Scope to the wrap that initResults last wired instead.
function rsSurpEl(id){
  var root = _rs.wrap && _rs.wrap.isConnected ? _rs.wrap : document;
  return root.querySelector('#' + id);
}
function rsSurpSt(){
  if (!_rs.surp) _rs.surp = { metric: null, win: null, yr: null, tbl: false, mode: 'pct', chart: null,
    base: 'act', cmp: { summit: true, cons: true, guide: false } };
  return _rs.surp;
}
// Comparators actually drawn: checked, present on this metric, and not the base itself.
function rsSurpCmps(m){
  var st = rsSurpSt();
  return RS_SRCS.filter(function(s){ return s !== st.base && st.cmp[s] && rsSurpPairOk(m, st.base, s); });
}
function rsSurpM(){
  var st = rsSurpSt();
  var all = rsSurpGroups().reduce(function(a, g){ return a.concat(g.keys); }, []);
  if (!st.metric || all.indexOf(st.metric) < 0) st.metric = all[0];
  return _rs.data.views.q.metrics[st.metric];
}
// Last period with a reported actual — the surprise story ends there.
function rsSurpLr(m){
  // Follows the BASE series, not always the actual: comparing Summit against consensus is a
  // story about forward periods, and capping at the last print would hide all of them.
  var a = rsSrcArr(m, rsSurpSt().base) || m.act || [], lr = 0;
  for (var i = 0; i < m.periods.length; i++) if (a[i] != null) lr = i;
  return lr;
}
function rsSurpWin(m){
  var st = rsSurpSt(), lr = rsSurpLr(m);
  if (!st.win || st.win[1] > lr || st.win[0] < 0) st.win = [0, lr];
  return st.win;
}
// Bar-label plugin: zero baseline + the surprise printed on each diverging bar.
var rsSurpLabels = {
  id: 'rsSurpLabels',
  afterDatasetsDraw: function(chart){
    var surp = chart.$surp || [];
    var bars = chart.getDatasetMeta(0).data;
    var ctx = chart.ctx, area = chart.chartArea;
    if (area){
      var y0 = chart.scales.y.getPixelForValue(0);
      ctx.save();
      ctx.strokeStyle = '#D7DDE4'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(area.left, y0); ctx.lineTo(area.right, y0); ctx.stroke();
      ctx.restore();
    }
    // One label per bar, across every comparator dataset. With more than one comparator
    // the glyph is dropped and the type shrinks — grouped bars leave far less room, and
    // the green/red fill already carries the beat/miss read.
    //
    // CROWDING. Two things collide as the window widens: labels from neighbouring PERIODS,
    // and labels from different comparators inside the same period. The second is solved by
    // giving each comparator its own line (a vertical stagger by dataset index), which also
    // frees the first to use the whole period slot. What is left over is then THINNED — every
    // Nth period, N derived from the widest label against the slot it has to fit in — because
    // a readable sample beats an unreadable smear, and the tooltip still carries every value.
    var all = chart.$surpAll || [surp];
    var one = all.length <= 1;
    var font = (one ? '700 11px' : '700 9.5px') + ' Inter, sans-serif';
    var step = 1;
    // With comparators, a label is centred on its PERIOD rather than on its own bar, so the two
    // read as a stack (in the order of the chips above) instead of colliding side by side —
    // grouped bars are ~20px apart and a "+1.4%" is nearly twice that. Centring on the period
    // also hands each label the full period slot, which is what the thinning below measures.
    var xAt = function(di, i){
      var mm = chart.getDatasetMeta(di), b = mm && mm.data[i];
      if (one || !b) return b ? b.x : 0;
      var sum = 0, n = 0;
      for (var q = 0; q < all.length; q++){
        var mq = chart.getDatasetMeta(q), bq = mq && mq.data[i];
        if (bq){ sum += bq.x; n++; }
      }
      return n ? sum / n : b.x;
    };
    ctx.save();
    ctx.font = font;
    var m0 = chart.getDatasetMeta(0);
    if (m0 && m0.data.length > 1){
      var slot = Math.abs(xAt(0, 1) - xAt(0, 0));
      var widest = 0;
      for (var s0 = 0; s0 < all.length; s0++){
        var ss = all[s0] || [];
        for (var j = 0; j < ss.length; j++){
          if (ss[j] == null) continue;
          var t0 = (one ? '▲ ' : '') + (chart.$fmt ? chart.$fmt(ss[j]) : (Math.abs(ss[j]).toFixed(1) + '%'));
          widest = Math.max(widest, ctx.measureText(t0).width);
        }
      }
      if (slot > 0) step = Math.max(1, Math.ceil((widest + 6) / slot));
    }
    ctx.restore();
    chart.$labelStep = step;                        // read by the caption, so the thinning is stated
    // Drawn period by period rather than series by series, so a period's labels can stack from
    // the OUTERMOST bar in that period. Anchoring each one to its own bar's top let the second
    // label sit over the first bar whenever the two were different heights.
    var nper = (chart.getDatasetMeta(0) || { data: [] }).data.length;
    for (var i = 0; i < nper; i++){
      if (i % step !== 0) continue;
      var topY = null, botY = null, upN = 0, dnN = 0;
      for (var d1 = 0; d1 < all.length; d1++){
        var s1 = (all[d1] || [])[i], b1 = (chart.getDatasetMeta(d1) || { data: [] }).data[i];
        if (s1 == null || !b1) continue;
        if (s1 >= 0) topY = topY == null ? b1.y : Math.min(topY, b1.y);
        else botY = botY == null ? b1.y : Math.max(botY, b1.y);
      }
      for (var d2 = 0; d2 < all.length; d2++){
        var v2 = (all[d2] || [])[i], b2 = (chart.getDatasetMeta(d2) || { data: [] }).data[i];
        if (v2 == null || !b2) continue;
        var up = v2 >= 0, rank = up ? upN++ : dnN++;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = font;
        ctx.fillStyle = up ? RS_GREEN : RS_RED;
        var txt = (one ? (up ? '▲ ' : '▼ ') : '') +
          (chart.$fmt ? chart.$fmt(v2) : ((up ? '+' : '−') + Math.abs(v2).toFixed(1) + '%'));
        ctx.fillText(txt, xAt(d2, i), up ? topY - 6 - rank * 12 : botY + 13 + rank * 12);
        ctx.restore();
      }
    }
  }
};
function rsSurpTableHeadHtml(){
  var st = rsSurpSt(), open = st.tbl !== false, m = rsSurpM();
  var n = 0;
  if (m){ var w = rsSurpWin(m); n = w[1] - w[0] + 1; }
  return '<span class="rs-collap-ic">' + (open ? '▾' : '▸') + '</span>Period detail' +
    '<span class="rs-collap-sub">' + (open ? 'hide' : 'show') + ' · ' + n + ' reported period' +
    (n === 1 ? '' : 's') + ', each estimate scored against the base</span>';
}
function rsSurpBlockHtml(){
  var m = rsSurpM(), st = rsSurpSt();
  var h = '<div class="rs-block" data-rssurp>';
  h += '<div class="rs-block-top"><div class="rs-block-h">Actuals vs Estimates</div>' +
    '<select class="rs-msel rs-ssel" aria-label="Metric">' + rsSurpGroups().map(function(g){
      return '<optgroup label="' + esc(g.label) + '">' + g.keys.map(function(k){
        return '<option value="' + k + '"' + (k === st.metric ? ' selected' : '') + '>' + esc(_rs.data.views.q.metrics[k].label) + '</option>';
      }).join('') + '</optgroup>';
    }).join('') + '</select>' +
    '<div class="rs-views" id="rsSurpMode"></div></div>';
  // Base + comparators: any combination of the four series. The base is what gets judged
  // (default the actual); every checked comparator becomes its own bar per period.
  var cmps = rsSurpCmps(m);
  h += '<div class="rs-surp-ctl"><span class="rs-quick-l">Compare</span>' +
    '<select class="rs-bsel" aria-label="Base series">' + RS_SRCS.filter(function(s){ return rsSrcHas(m, s); }).map(function(s){
      return '<option value="' + s + '"' + (s === st.base ? ' selected' : '') + '>' + esc(RS_SRC_LABEL[s]) + '</option>';
    }).join('') + '</select>' +
    '<span class="rs-quick-l">against</span>' +
    RS_SRCS.filter(function(s){ return s !== st.base; }).map(function(s){
      var avail = rsSurpPairOk(m, st.base, s);
      var on = avail && !!st.cmp[s];
      return '<button type="button" class="rs-cmp' + (on ? ' on' : '') + (avail ? '' : ' na') + '" data-rssurpcmp="' + s + '"' +
        (avail ? '' : ' disabled title="' + esc(RS_SRC_LABEL[s]) + ' has no overlapping period with the base on this line"') + '>' +
        '<span class="ave-leg-act" style="background:' + RS_SRC_COLOR[s] + '"></span>' + esc(RS_SRC_LABEL[s]) + '</button>';
    }).join('') +
  '</div>';
  h += '<div class="ave-leg"><span class="tech-leg-i"><span class="ave-leg-act" style="background:' + RS_GREEN + '"></span>' + esc(RS_SRC_LABEL[st.base]) + ' came in above</span>' +
    '<span class="tech-leg-i"><span class="ave-leg-act" style="background:' + RS_RED + '"></span>came in below</span>' +
    '<span class="tech-leg-i" style="margin-left:auto">' +
      (cmps.length
        ? 'bar outline = which series it is measured against' +
          (cmps.length > 1 ? ' · labels stack per period in the order of the chips' : '') +
          ' · drag to zoom, double-click to reset'
        : 'pick at least one series to compare against') +
    '</span></div>';
  h += '<div class="ov-chart-card">' +
    '<div class="ov-chart-t" id="rsSurpChartT"></div>' +
    '<div class="ov-chart-wrap ovs-tall"><canvas id="rsSurpChart"></canvas></div>' +
  '</div>';
  h += '<div class="sg-controls">' +
    '<div class="sg-slider">' +
      '<div class="sg-track"><div class="sg-fill" id="rsSurpFill"></div></div>' +
      '<div class="rs-ticks" id="rsSurpTicks"></div>' +
      '<input type="range" id="rsSurpMin" min="0" max="1" value="0" step="1" aria-label="Start period">' +
      '<input type="range" id="rsSurpMax" min="0" max="1" value="1" step="1" aria-label="End period">' +
    '</div>' +
    '<div class="sg-ends"><span id="rsSurpEnd0"></span><span id="rsSurpEnd1"></span></div>' +
  '</div>';
  h += '<div class="rs-collap" data-rssurptbl>' +
    '<button type="button" class="rs-collap-h" data-rssurptblb>' + rsSurpTableHeadHtml() + '</button>' +
    '<div class="rs-collap-b" id="rsSurpTableBody"' + (rsSurpSt().tbl === false ? ' hidden' : '') + '>' +
      '<div class="rs-tablewrap" id="rsSurpTable"></div>' +
    '</div></div>';
  h += '<div class="ov-foot" id="rsSurpNote"></div>';
  h += '</div>';
  return h;
}
function rsBuildSurp(){
  if (!_rs.data || _rs.data.surprise === false) return;
  var st = rsSurpSt(), m = rsSurpM();
  if (!m) return;
  var el = rsSurpEl('rsSurpChart');
  if (!el || !el.offsetParent) return;
  if (st.chart){ st.chart.destroy(); st.chart = null; }

  var w = rsSurpWin(m), lo = w[0], hi = w[1];
  var div = rsScaleOf(m);
  var pctMode = st.mode !== 'usd';
  var baseArr = rsSrcArr(m, st.base) || [];
  var cmps = rsSurpCmps(m);
  // One {pcts, dols} pair per comparator, over the selected window.
  var series = cmps.map(function(s){
    var A = rsSrcArr(m, s) || [], pcts = [], dols = [];
    for (var i = lo; i <= hi; i++){
      var ok = (baseArr[i] != null && A[i] != null && A[i]);
      pcts.push(ok ? rsSurp(baseArr[i], A[i]) : null);
      dols.push(ok ? (baseArr[i] - A[i]) : null);
    }
    return { src: s, pcts: pcts, dols: dols };
  });

  var md = rsSurpEl('rsSurpMode');
  if (md) md.innerHTML = '<button type="button" class="rs-view' + (pctMode ? ' active' : '') + '" data-rssurpmode="pct">Surprise %</button>' +
    '<button type="button" class="rs-view' + (!pctMode ? ' active' : '') + '" data-rssurpmode="usd">' + esc(m.unit === 'eps' ? 'per-share' : 'Amount') + '</button>';
  var unitLbl = m.unit === 'eps' ? rsCur() : (rsCurName() + (div === 1000 ? ' billions' : ' millions'));
  var tEl = rsSurpEl('rsSurpChartT');
  if (tEl) tEl.innerHTML = esc(m.label) + ' — ' + esc(RS_SRC_LABEL[st.base]) + ' vs ' +
    (cmps.length ? esc(cmps.map(function(s){ return RS_SRC_SHORT[s]; }).join(' · ')) : '<i>nothing selected</i>') +
    ' <span>(' + (pctMode ? '%' : esc(unitLbl)) + ' per period · hover for the underlying values)</span>';

  st.chart = new Chart(el.getContext('2d'), {
    type: 'bar',
    data: { labels: m.periods.slice(lo, hi + 1), datasets: series.map(function(s){
      return { label: RS_SRC_LABEL[s.src],
        data: pctMode ? s.pcts : s.dols.map(function(v){ return v == null ? null : (m.unit === 'eps' ? v : v / div); }),
        // Fill carries the sign (beat/miss); the outline says which series it is against.
        backgroundColor: s.pcts.map(function(p){ return p == null ? '#C7CED6' : (p >= 0 ? RS_GREEN : RS_RED); }),
        borderColor: RS_SRC_COLOR[s.src], borderWidth: series.length > 1 ? 2 : 0,
        borderRadius: 3, maxBarThickness: 56 };
    }) },
    plugins: [rsSurpLabels],
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: {
          label: function(ctx){
            var i = ctx.dataIndex + lo, sr = series[ctx.datasetIndex];
            if (!sr) return '';
            var s = sr.pcts[ctx.dataIndex], d = sr.dols[ctx.dataIndex];
            var A = rsSrcArr(m, sr.src) || [];
            return [
              RS_SRC_LABEL[st.base] + ': ' + rsFmt(m, baseArr[i]),
              RS_SRC_LABEL[sr.src] + ': ' + rsFmt(m, A[i]),
              s == null ? 'Difference: —' : 'Difference: ' + (s >= 0 ? '+' : '−') + Math.abs(s).toFixed(1) + '% · ' + rsFmtD(m, d)
            ];
          }
        } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' },
          min: st.yr ? st.yr[0] : undefined, max: st.yr ? st.yr[1] : undefined,
          ticks: { font: { size: 11 },
          callback: function(v){
            if (pctMode) return (v < 0 ? '−' : '') + Math.abs(v).toFixed(0) + '%';
            return rsTick(v, m.unit, div, rsCur(m));
          } } }
      }
    }
  });
  st.chart.$surpAll = series.map(function(s){ return pctMode ? s.pcts : s.dols; });
  st.chart.$fmt = pctMode ? null : function(v){ return rsFmtD(m, v); };
  st.chart.update();

  // Slider + tick dots over the reported range.
  var lr = rsSurpLr(m), n = lr + 1;
  var mn = rsSurpEl('rsSurpMin'), mx = rsSurpEl('rsSurpMax');
  var fill = rsSurpEl('rsSurpFill'), e0 = rsSurpEl('rsSurpEnd0'), e1 = rsSurpEl('rsSurpEnd1');
  if (mn && mx){ mn.max = n - 1; mx.max = n - 1; mn.value = lo; mx.value = hi; }
  if (fill){ fill.style.left = (lo / (n - 1) * 100) + '%'; fill.style.width = ((hi - lo) / (n - 1) * 100) + '%'; }
  if (e0) e0.textContent = m.periods[lo];
  if (e1) e1.textContent = m.periods[hi];
  var ticks = rsSurpEl('rsSurpTicks');
  if (ticks){
    var th = '';
    for (var t = 0; t < n; t++){
      th += '<span class="rs-tick' + (t >= lo && t <= hi ? ' on' : '') + '" style="left:' + (t / (n - 1) * 100) + '%" title="' + esc(m.periods[t]) + '"></span>';
    }
    ticks.innerHTML = th;
  }

  // Drag to zoom, like every other chart in the pane: a horizontal drag narrows the period
  // window, a vertical one the y-range, double-click resets both. The window is stored on the
  // surprise block's own state, so the slider above stays in step with it.
  rsAttachBrush(el, st.chart,
    function(a, b){ rsSurpSt().win = [lo + a, lo + b]; rsBuildSurp(); },
    function(v1, v2){ rsSurpSt().yr = [v1, v2]; rsBuildSurp(); },
    function(){ var s2 = rsSurpSt(); s2.win = null; s2.yr = null; rsBuildSurp(); });

  rsSurpTableRender(m, lo, hi, div);
  var sh = document.querySelector('[data-rssurptblb]');
  if (sh) sh.innerHTML = rsSurpTableHeadHtml();
  var note = rsSurpEl('rsSurpNote'); if (note) note.textContent = m.note || '';
}
function rsSurpTableRender(m, lo, hi, div){
  var el = rsSurpEl('rsSurpTable');
  if (!el) return;
  var idx = []; for (var i = lo; i <= hi; i++) idx.push(i);
  var dec = m.unit === 'eps' ? 2 : 1;
  function avg(a){ return a.reduce(function(x, y){ return x + y; }, 0) / a.length; }
  function sgn(v){ return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%'; }
  function num(v){
    if (v == null) return '<span class="rs-ft-nil">—</span>';
    if (m.unit === 'eps') return Number(v).toFixed(2);
    return (v / div).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  // Growth is always YoY here (lag 4, quarterly data) — independent of the
  // Results pane's YoY/QoQ toggle, which belongs to that pane's state.
  function g(arr, base, i){ if (i - 4 < 0) return null; var a = arr[i], b = base[i - 4]; if (a == null || b == null || !b) return null; return (a - b) / Math.abs(b) * 100; }
  function gd(arr, base, i){ if (i - 4 < 0) return null; var a = arr[i], b = base[i - 4]; if (a == null || b == null) return null; return a - b; }
  function pctDollar(p, d){
    if (p == null) return '<span class="rs-ft-nil">—</span>';
    return rsPctHtml(p, dec) + ' <span class="rs-ft-dim">· ' + rsFmtD(m, d) + '</span>';
  }
  function sumGrowth(fn){ var a = []; idx.forEach(function(i){ var v = fn(i); if (v != null) a.push(v); }); return a.length ? 'avg ' + sgn(avg(a)) : ''; }
  function sumCagr(){
    var first = null, last = null, fi = null, li = null;
    idx.forEach(function(i){ var v = m.act[i]; if (v != null){ if (first == null){ first = v; fi = i; } last = v; li = i; } });
    if (first == null || li === fi || first <= 0 || last <= 0) return '';
    var years = (li - fi) / 4;
    return years > 0 ? 'CAGR ' + sgn((Math.pow(last / first, 1 / years) - 1) * 100) : '';
  }
  var st = rsSurpSt(), baseArr = rsSrcArr(m, st.base) || [], cmps = rsSurpCmps(m);
  function sumSurprise(src){
    var A = rsSrcArr(m, src) || [], pcts = [], dols2 = [], above = 0, below = 0;
    idx.forEach(function(i){
      if (A[i] == null || baseArr[i] == null || !A[i]) return;
      var dv = baseArr[i] - A[i];
      pcts.push(dv / Math.abs(A[i]) * 100); dols2.push(dv);
      if (dv >= 0) above++; else below++;
    });
    if (!pcts.length) return '';
    var ap = avg(pcts);
    return above + '▲ · ' + below + '▼<br><span class="rs-ft-dim">avg <span style="color:' + (ap >= 0 ? RS_GREEN : RS_RED) + '">' + sgn(ap) + '</span> · ' + rsFmtD(m, avg(dols2)) + '</span>';
  }

  var h = '<div class="rs-ft-cap">' + (m.unit === 'eps' ? rsCurName() + ' per share' : (rsCurName() + (div === 1000 ? ' billions' : ' millions'))) + ' · difference = (' + esc(RS_SRC_SHORT[st.base]) + ' − comparator) ÷ |comparator| · ▲/green = ' + esc(RS_SRC_SHORT[st.base]) + ' came in above · the right column summarizes the selected range</div>';
  h += '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h"></th>';
  idx.forEach(function(i){ h += '<th>' + esc(m.periods[i]) + '</th>'; });
  h += '<th class="rs-ft-s">Range record</th></tr></thead><tbody>';

  function row(label, cellFn, cls, sum){
    var classes = cls.split(' ').map(function(c){ return 'rs-ft-' + c; }).join(' ');
    var r = '<tr class="' + classes + '"><td class="rs-ft-h">' + label + '</td>';
    idx.forEach(function(i){ r += '<td>' + cellFn(i) + '</td>'; });
    r += '<td class="rs-ft-s">' + (sum || '') + '</td>';
    return r + '</tr>';
  }

  // Base first, then one value row + one difference row per comparator. Growth rows always
  // measure against the ACTUAL a year back — an estimate's growth is only meaningful off a
  // reported base — so they are skipped when the base is not the actual.
  h += row(RS_SRC_LABEL[st.base], function(i){ return baseArr[i] == null ? '<span class="rs-ft-nil">—</span>' : '<b>' + num(baseArr[i]) + '</b>'; }, 'main nb', sumCagr());
  if (st.base === 'act')
    h += row('YoY growth', function(i){ return pctDollar(g(m.act, m.act, i), gd(m.act, m.act, i)); }, 'sub',
      sumGrowth(function(i){ return g(m.act, m.act, i); }));
  cmps.forEach(function(src){
    var A = rsSrcArr(m, src) || [];
    h += row(RS_SRC_LABEL[src], function(i){ return num(A[i]); }, 'main nb', '');
    if (m.act)
      h += row('YoY growth', function(i){ return pctDollar(g(A, m.act, i), gd(A, m.act, i)); }, 'sub nb',
        sumGrowth(function(i){ return g(A, m.act, i); }));
    h += row('vs ' + RS_SRC_SHORT[src], function(i){
      if (baseArr[i] == null || A[i] == null || !A[i]) return '<span class="rs-ft-nil">—</span>';
      return pctDollar(rsSurp(baseArr[i], A[i]), baseArr[i] - A[i]);
    }, 'sub', sumSurprise(src));
  });
  if (!cmps.length)
    h += '<tr class="rs-ft-sub"><td class="rs-ft-h">—</td><td colspan="' + (idx.length + 1) + '">Pick at least one series to compare against.</td></tr>';

  h += '</tbody></table></div>';
  el.innerHTML = h;

  var tb = el.querySelector('table'), lastCol = -1;
  function colCells(ci){ return tb.querySelectorAll('tr > *:nth-child(' + (ci + 1) + ')'); }
  tb.onmouseover = function(e){
    var c = e.target.closest('td,th'); if (!c || c.cellIndex === lastCol) return;
    if (lastCol > 0) colCells(lastCol).forEach(function(x){ x.classList.remove('colhl'); });
    lastCol = c.cellIndex;
    if (lastCol > 0) colCells(lastCol).forEach(function(x){ x.classList.add('colhl'); });
  };
  tb.onmouseleave = function(){
    if (lastCol > 0) colCells(lastCol).forEach(function(x){ x.classList.remove('colhl'); });
    lastCol = -1;
  };
}

// ─── Wiring ───────────────────────────────────────────────────────────────────

function rsBuildAll(){
  rsView().sections.forEach(function(s){ rsBuildChart(s.key); });
  rsBuildSurp();                      // the surprise scorecard at the foot of the pane
}

function wireResults(pane){
  pane.onclick = (function(e){
    // Every reading control is scoped to ITS block: Quarterly/Annual, the level⇄growth pair,
    // YoY/QoQ and %/Amount. Each changes what the axis means, so that block's brushed y-range
    // and window are dropped rather than carried into a scale that no longer describes them,
    // and its control row is re-rendered because which groups exist depends on the mode.
    var stb = e.target.closest('[data-rssurptblb]');
    if (stb){
      var sst2 = rsSurpSt();
      sst2.tbl = sst2.tbl === false;
      var sbody = document.getElementById('rsSurpTableBody');
      if (sbody) sbody.hidden = sst2.tbl === false;
      stb.innerHTML = rsSurpTableHeadHtml();
      return;
    }
    var tb = e.target.closest('[data-rstblb]');
    if (tb){
      var tk = tb.getAttribute('data-rstblb'), tst = rsSt(tk);
      tst.tbl = tst.tbl === false;
      var tbody = document.getElementById('rsTableBody-' + tk);
      if (tbody) tbody.hidden = tst.tbl === false;
      tb.innerHTML = rsTableHeadHtml(tk, rsMetric(tk));
      return;
    }
    var ctl = e.target.closest('[data-rsview], [data-rsmode], [data-rsgrow], [data-rsgunit]');
    if (ctl){
      var blk = ctl.closest('[data-rsblock]');
      if (!blk) return;
      var bk = blk.getAttribute('data-rsblock'), bst = rsSt(bk);
      if (ctl.hasAttribute('data-rsview')){
        bst.view = ctl.getAttribute('data-rsview');
        bst.metric = null;                             // the metric list is per view
        bst.win = null;                                // and so is the period axis
      }
      if (ctl.hasAttribute('data-rsmode')) bst.mode = ctl.getAttribute('data-rsmode');
      if (ctl.hasAttribute('data-rsgrow')) bst.growth = ctl.getAttribute('data-rsgrow');
      if (ctl.hasAttribute('data-rsgunit')) bst.growUnit = ctl.getAttribute('data-rsgunit');
      bst.yr = null;
      var bm = rsMetric(bk);
      var head = blk.querySelector('.rs-block-h');
      var msel = blk.querySelector('.rs-msel'); if (msel) msel.innerHTML = rsSelectHtml(bk);
      var modes = blk.querySelector('.rs-modes'); if (modes) modes.innerHTML = rsBlockModesHtml(bk, bm);
      var quick = blk.querySelector('.rs-quick');
      if (quick){
        var pres2 = rsViewName(bk) === 'q'
          ? [['l4', 'Last 4Q'], ['l8', 'Last 8Q'], ['rep', 'Reported'], ['fwd', 'Forward'], ['all', 'All']]
          : [['l3', 'Last 3Y'], ['l5', 'Last 5Y'], ['rep', 'Reported'], ['fwd', 'Forward'], ['all', 'All']];
        quick.innerHTML = '<span class="rs-quick-l">Range</span>' + pres2.map(function(p){
          return '<button type="button" class="rs-preset" data-rsrange="' + p[0] + '">' + p[1] + '</button>'; }).join('');
      }
      var lg = blk.querySelector('.ave-leg'); if (lg) lg.innerHTML = rsLegendHtml(bk, bm);
      wireSliders(pane);
      // rsBuildChart already re-renders the table for this block; calling it again here (and
      // with the metric argument missing) is what threw on the first pass.
      rsBuildChart(bk);
      if (head) head.textContent = rsSecCfg(bk).label;
      return;
    }
    // ── Surprise scorecard (single block at the foot of the pane) ──
    var sm = e.target.closest('[data-rssurpmode]');
    if (sm){ rsSurpSt().mode = sm.getAttribute('data-rssurpmode'); rsBuildSurp(); return; }
    var sc = e.target.closest('[data-rssurpcmp]');
    if (sc && !sc.disabled){
      var sst = rsSurpSt(), key = sc.getAttribute('data-rssurpcmp');
      sst.cmp[key] = !sst.cmp[key];
      rsRerenderSurp(pane);
      return;
    }
    var block = e.target.closest('.rs-block');
    var k = block ? block.getAttribute('data-rsblock') : null;
    if (!k) return;
    var pr = e.target.closest('[data-rsrange]');
    if (pr){
      rsSt(k).win = rsPresetWin(rsMetric(k), pr.getAttribute('data-rsrange'));
      rsBuildChart(k);
      return;
    }
    var l = e.target.closest('[data-rsleg]');
    if (l){
      var st2 = rsSt(k);
      var key = l.getAttribute('data-rsleg');
      st2.hidden[key] = !st2.hidden[key];
      rsBuildChart(k);
    }
  });
  // Metric dropdown (grouped select) per section block, and the pane-wide vintage picker.
  pane.onchange = (function(e){
    if (e.target.classList.contains('rs-vsel')){
      _rs.vint = e.target.value;
      rsApplyVintage();                                // re-resolve summit/cons from the matrix
      _rs.sec = {};                                    // windows/metrics reset: the series changed
      var vn = pane.querySelector('#rsVintNote'); if (vn) vn.textContent = rsVintNote();
      var blocks = pane.querySelector('#rsBlocks');
      if (blocks) blocks.innerHTML = rsBlocksHtml();   // legend chips depend on what has data
      wireSliders(pane);
      rsBuildAll();
      return;
    }
    if (e.target.classList.contains('rs-bsel')){
      var sstB = rsSurpSt();
      sstB.base = e.target.value;
      sstB.cmp[sstB.base] = false;      // a series is never compared against itself
      sstB.win = null;                  // the window follows the base series
      rsRerenderSurp(pane);
      return;
    }
    if (e.target.classList.contains('rs-ssel')){
      var sstM = rsSurpSt();
      sstM.metric = e.target.value;
      sstM.win = null;
      rsRerenderSurp(pane);             // chip availability is per-metric
      return;
    }
    if (!e.target.classList.contains('rs-msel')) return;
    var block = e.target.closest('.rs-block');
    var k = block ? block.getAttribute('data-rsblock') : null;
    if (!k) return;
    var st = rsSt(k);
    st.metric = e.target.value;
    st.win = null;
    st.yr = null;
    rsBuildChart(k);
  });
  wireSliders(pane);
}

// Re-render the whole surprise block. The base select, the chips' availability and the
// legend all depend on the current selection, so rebuilding the chart alone would leave
// stale controls on screen.
function rsRerenderSurp(pane){
  var host = pane.querySelector('[data-rssurp]');
  if (!host) return;
  host.outerHTML = rsSurpBlockHtml();
  wireSurpSlider();
  rsBuildSurp();
}
function wireSurpSlider(){
  var smn = rsSurpEl('rsSurpMin'), smx = rsSurpEl('rsSurpMax');
  function onSlide(){
    var a = +smn.value, b = +smx.value;
    rsSurpSt().win = [Math.min(a, b), Math.max(a, b)];
    rsBuildSurp();
  }
  if (smn) smn.oninput = onSlide;
  if (smx) smx.oninput = onSlide;
}

function wireSliders(pane){
  wireSurpSlider();
  rsView().sections.forEach(function(s){
    var k = s.key;
    var mn = document.getElementById('rsMin-' + k), mx = document.getElementById('rsMax-' + k);
    function onSlide(){
      var a = +mn.value, b = +mx.value;
      rsSt(k).win = [Math.min(a, b), Math.max(a, b)];
      rsBuildChart(k);
    }
    if (mn) mn.oninput = onSlide;
    if (mx) mx.oninput = onSlide;
  });
}

// Called when the embedding pane becomes visible (Chart.js needs layout).
// Optional args enable a SECOND instance on the same page (the Setup chart beside the Results tab):
//   wrap   — the specific .rs-wrap element to wire (defaults to the first one, Amazon's behaviour);
//   ticker — re-establish _rs.data for this instance before building (each instance uses a dataset
//            whose section keys are unique, so their canvases/tables/sliders never collide).
export function initResults(wrap, ticker){
  if (ticker){
    var d = getResultsData(ticker); if (!d) return;
    if (_rs._active !== ticker){ _rs.view = rsDefaultView(d); _rs.growth = 'yoy'; _rs.sec = {}; _rs.vint = 'preprint'; }
    _rs.data = d; _rs._active = ticker;
  }
  if (!_rs.data) return;
  rsApplyVintage();          // resolve summit/cons from the vintage matrix before anything reads them
  wrap = wrap || document.querySelector('.rs-wrap:not(#rsEvoWrap)');
  _rs.wrap = wrap || null;             // scopes the surprise block's element lookups
  if (wrap) wireResults(wrap);
  rsBuildAll();
}

// Called when the Estimate Evolution pane becomes visible.
// ─── Revision record — how far each fiscal year travelled, and where it landed ─
// Ported from SoFi's Actuals-vs-Guidance table (js/overviews/sofi.js → guidanceBody /
// renderGuidTable / renderGuidStatsAnnual), with the axis swapped. SoFi walks a full-year
// GUIDE the company revises each quarter: Initial → Q1 → Q2 → Q3 → Actual. **Uber guides one
// quarter ahead only** — Gross Bookings, Adj. EBITDA and, since 1Q26, non-GAAP EPS — so there
// is no annual guide to walk. Here the SAVED SNAPSHOTS are the revision axis, which asks the
// same question of the estimate that SoFi asks of the guide.
//
// Two columns that look redundant and are not. "Net move" is first view → latest view: the
// travel. "First vs actual" is first view → where the year landed: the error. On a year the
// model has already absorbed they coincide, because after the print the stored row carries the
// reported figure. On the consensus side they do not — FY2025 drifted +0.0% between files while
// sitting 0.1% under the print — and the gap between the two columns is precisely the part of
// the miss the source never corrected.
// What the chart is drawing right now: the (fiscal year × source) pairs left visible by the
// legend chips, in chart order. BOTH tables under the chart are built from this, so hiding a
// year or a source removes it from the record and from the aggregates in the same click —
// there is no second place where "what is on screen" is decided.
function rsEvoVisible(k, m){
  var ev = rsEvo(), st = rsEvoSt(k), out = [];
  ev.years.forEach(function(y, yi){
    if (st.hidden['y' + y]) return;
    ['summit', 'cons'].forEach(function(src){
      if (st.hidden[src] || !m[src]) return;
      out.push({ y: y, yi: yi, src: src, label: 'FY' + y + ' · ' + (src === 'cons' ? 'Consensus' : 'Summit') });
    });
  });
  return out;
}
// One row per visible pair, measured on the basis the chart is currently drawing: dollars in
// US$ mode, growth/margin points in % mode. `pp` marks which one, because a move of "+2.1"
// means percent in one and percentage points in the other.
function rsEvoTrackRows(k, m){
  var ev = rsEvo(), st = rsEvoSt(k), pct = st.mode !== 'usd';
  var rows = [], agg = { raises: 0, cuts: 0, rSum: 0, cSum: 0, big: null,
                         driftSum: 0, driftN: 0, errSum: 0, errN: 0, errAbs: 0, pp: pct };
  rsEvoVisible(k, m).forEach(function(v){
    var arr = (pct ? rsEvoPct(k, m, v.src, v.yi) : (m[v.src] ? m[v.src][v.yi] : null)) || [];
    var first = null, fi = -1, last = null, li = -1, up = 0, dn = 0, prev = null;
    arr.forEach(function(val, i){
      if (val == null) return;
      if (first == null){ first = val; fi = i; }
      last = val; li = i;
      if (prev != null){
        // In % mode a "revision" is a move in percentage points; in US$ mode it is a percent
        // change. Same threshold either way — anything under 0.05 is noise, not a decision.
        var mv = pct ? (val - prev) : (prev === 0 ? null : (val - prev) / Math.abs(prev) * 100);
        if (mv != null){
          if (mv > 0.05){ up++; agg.raises++; agg.rSum += mv; }
          else if (mv < -0.05){ dn++; agg.cuts++; agg.cSum += mv; }
          if (Math.abs(mv) > 0.05 && (agg.big == null || Math.abs(mv) > Math.abs(agg.big.mv)))
            agg.big = { mv: mv, label: v.label, at: ev.vintages[i] };
        }
      }
      prev = val;
    });
    var act = pct ? rsEvoActualPct(k, st.metric, m, v.y) : rsEvoActual(st.metric, m, v.y);
    var drift = (first == null || last == null) ? null
              : (pct ? last - first : (first === 0 ? null : (last - first) / Math.abs(first) * 100));
    var err = (act == null || first == null) ? null
            : (pct ? first - act : (act === 0 ? null : (first - act) / Math.abs(act) * 100));
    if (drift != null){ agg.driftSum += drift; agg.driftN++; }
    if (err != null){ agg.errSum += err; agg.errAbs += Math.abs(err); agg.errN++; }
    rows.push({ label: v.label, src: v.src, first: first, firstV: ev.vintages[fi], last: last,
                lastV: ev.vintages[li], up: up, dn: dn, drift: drift, act: act, err: err });
  });
  return { rows: rows, agg: agg, pct: pct };
}
function rsRenderEvoTrack(k, m){
  var box = document.getElementById('rsEvoTrack-' + k); if (!box) return;
  var ev = rsEvo(), st = rsEvoSt(k);
  // Nothing to record with a single snapshot: every row would read zero revisions.
  if (!ev.vintages || ev.vintages.length < 2){ box.innerHTML = ''; return; }
  var t = rsEvoTrackRows(k, m), pct = t.pct, div = rsEvoScaleOf(m);
  var showAct = !!st.act;                          // the Actual columns follow the Reported chip

  // Three bases, three ways to write a number and its move:
  //   level  (US$B)             value = the level,        move = % change
  //   points (growth %, margin) value = a percentage,      move = percentage POINTS
  //   amount (growth in $)      value = a currency delta,  move = a currency difference
  var amt = rsEvoIsAmt(k), points = pct && !amt;
  function val(v){
    if (v == null) return '<span class="rs-ft-nil">—</span>';
    if (points) return v.toFixed(1) + '%';
    var s = (Math.abs(v) / div).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return (amt && v < 0 ? '−' : '') + s;          // an amount can legitimately be negative
  }
  function move(v){
    if (v == null) return '<span class="rs-ft-nil">—</span>';
    // Below the same 0.05 threshold that counts a revision, a move is noise — colouring a
    // rounded "−0.0" red says a line fell when it did not move.
    if (Math.abs(v) < 0.05) return '<span class="rs-ft-dim">' + (amt ? rsFmtD(m, 0) : '0.0' + (points ? ' pp' : '%')) + '</span>';
    if (amt) return '<span style="color:' + (v >= 0 ? RS_GREEN : RS_RED) + '">' + rsFmtD(m, v) + '</span>';
    return '<span style="color:' + (v >= 0 ? RS_GREEN : RS_RED) + '">' + (v >= 0 ? '+' : '−') +
      Math.abs(v).toFixed(1) + (points ? ' pp' : '%') + '</span>';
  }
  var h = '<div class="rs-ft-cap">' +
    (points ? esc(rsEvoPctLabel(k, m))
            : (amt ? esc(rsEvoPctLabel(k, m)) + ' · ' : '') + rsCurName(m) + ' ' + (div === 1000 ? 'billions' : 'millions')) +
    ' · one row per line ON THE CHART — hide a fiscal year or a source and it leaves this table too' +
    ' · “first / latest view” are the earliest and most recent snapshots carrying that line, “net move” the travel between them' +
    (showAct ? ' · “first vs actual” is how far the earliest view sat from where the year landed'
             : ' · turn on Reported to score the years that have landed') + '</div>';
  h += '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Line</th>' +
    '<th>First view</th><th>Latest view</th>' + (showAct ? '<th>Actual</th>' : '') +
    '<th>Revisions</th><th class="rs-ft-s">Net move</th>' +
    (showAct ? '<th class="rs-ft-s">First vs actual</th>' : '') + '</tr></thead><tbody>';
  if (!t.rows.length){
    h += '<tr><td class="rs-ft-h" colspan="7"><span class="rs-ft-dim">Every line is hidden — click a chip above to bring one back.</span></td></tr>';
  }
  t.rows.forEach(function(p){
    h += '<tr class="rs-ft-main"><td class="rs-ft-h">' + esc(p.label) + '</td>' +
      '<td><b>' + val(p.first) + '</b>' + (p.firstV ? '<br><span class="rs-ft-dim">' + esc(p.firstV.label) + '</span>' : '') + '</td>' +
      '<td><b>' + val(p.last) + '</b>' + (p.lastV ? '<br><span class="rs-ft-dim">' + esc(p.lastV.label) + '</span>' : '') + '</td>' +
      (showAct ? '<td>' + (p.act == null ? '<span class="rs-ft-dim">still open</span>' : '<b>' + val(p.act) + '</b>') + '</td>' : '') +
      // "unmoved" is a finding; no view at all is not. FY2025 op income carries the actual but
      // no estimate (the model's annual ADJ_OPINC is off-basis, see the dataset note), and
      // reading that row as "unmoved" would claim a steadiness nobody ever expressed.
      '<td>' + (p.first == null ? '<span class="rs-ft-nil">—</span>'
                                : (p.up || p.dn ? p.up + '↑ / ' + p.dn + '↓' : '<span class="rs-ft-dim">unmoved</span>')) + '</td>' +
      '<td class="rs-ft-s">' + move(p.drift) + '</td>' +
      (showAct ? '<td class="rs-ft-s">' + move(p.err) + '</td>' : '') + '</tr>';
  });
  h += '</tbody></table></div>';
  box.innerHTML = h;
  // No aggregate tiles. They restated per-row numbers as one figure and, mixing Summit with
  // Street and open years with landed ones, that figure answered no question anyone asks —
  // the rows carry the same facts already attributed. `rsEvoTrackRows` still computes the
  // aggregates (they cost nothing and a scope-picking version may want them back).
}

export function initResultsEvo(ticker){
  // Re-target the shared engine state to THIS ticker's dataset. The Setup/Results charts share _rs,
  // so _rs.data may be left pointing at a *_SETUP dataset (which has no `evolution`) → empty charts.
  // Guard on `string` so a requestAnimationFrame timestamp arg is ignored (callers that pass no
  // ticker keep the old behaviour). Pass the ticker to make the Estimates tab order-independent.
  if (typeof ticker === 'string'){ var _d = getResultsData(ticker); if (_d && _d.evolution) _rs.data = _d; }
  if (!_rs.data || !_rs.data.evolution) return;
  var wrap = document.getElementById('rsEvoWrap');
  if (!wrap) return;
  function secOf(el){
    var block = el.closest('[data-rsevo]');
    return block ? block.getAttribute('data-rsevo') : null;
  }
  wrap.onclick = function(e){
    var k;
    var rb = e.target.closest('[data-rsevrecb]');
    if (rb){
      k = rb.getAttribute('data-rsevrecb');
      var rst = rsEvoSt(k);
      rst.rec = rst.rec !== true;                  // starts collapsed, like every other table
      var rbody = document.getElementById('rsEvoRecBody-' + k);
      if (rbody) rbody.hidden = rst.rec !== true;
      rb.innerHTML = rsEvoRecHeadHtml(k);
      return;
    }
    var db = e.target.closest('[data-rsevdetb]');
    if (db){
      k = db.getAttribute('data-rsevdetb');
      var dst = rsEvoSt(k);
      dst.det = !dst.det;
      var body = document.getElementById('rsEvoDetBody-' + k);
      if (body) body.hidden = !dst.det;
      db.innerHTML = rsEvoDetHeadHtml(k);
      return;
    }
    var ab = e.target.closest('[data-rsevact]');
    if (ab && !ab.disabled && (k = secOf(ab))){
      var ast = rsEvoSt(k);
      ast.act = !ast.act;
      rsRerenderEvoHead(wrap, k);
      rsBuildEvo(k);
      return;
    }
    var md = e.target.closest('[data-rsevmode]');
    if (md && (k = secOf(md))){
      var mst = rsEvoSt(k);
      mst.mode = md.getAttribute('data-rsevmode');
      mst.yr = null;                                   // units change $B ↔ %
      rsRerenderEvoHead(wrap, k);                      // availability differs per mode
      rsBuildEvo(k);
      return;
    }
    // % ⇄ Amount changes the units on the axis, so the brushed y-range is dropped with it
    // rather than carried into a scale it no longer describes.
    var gu = e.target.closest('[data-rsevgunit]');
    if (gu && (k = secOf(gu))){
      var gst = rsEvoSt(k);
      gst.growUnit = gu.getAttribute('data-rsevgunit');
      gst.yr = null;
      rsBuildEvo(k);
      return;
    }
    var evl = e.target.closest('[data-rsevleg]');
    if (evl && (k = secOf(evl))){
      var st = rsEvoSt(k);
      var key = evl.getAttribute('data-rsevleg');
      st.hidden[key] = !st.hidden[key];
      rsBuildEvo(k);
    }
  };
  wrap.onchange = function(e){
    if (!e.target.classList.contains('rs-esel')) return;
    var k = secOf(e.target);
    if (!k) return;
    var st = rsEvoSt(k);
    st.metric = e.target.value;
    st.mode = 'usd';                                   // reset — % meaning may change per metric
    st.yr = null;
    rsBuildEvo(k);
  };
  // Repaint each block's head before building: the "Reported" toggle's availability depends
  // on dataset state, and the markup was generated when the pane's HTML string was built —
  // which can be long before this runs.
  rsEvo().sections.forEach(function(s){ rsRerenderEvoHead(wrap, s.key); rsBuildEvo(s.key); });
}
