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
import { dhrResults } from './results-data/dhr.js';
import { dhrSetup } from './results-data/dhr-setup.js';
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
  TBBB_SETUP: tbbbSetup,
  DHR: dhrResults,
  DHR_SETUP: dhrSetup
};

// Register a dataset at runtime, so a caller can compose one and get the whole engine — every
// mode, the presets, the slider, drag-to-zoom, the chips and the table — instead of building a
// canvas that reimplements them badly. js/segments.js uses this to give each segment its own
// top-line block from the metrics that already live in this ticker's dataset.
export function registerResultsData(key, data){
  RESULTS_DATA[key] = data;
  delete _rsTrimCache[key];                 // a re-registration must not serve the old trim
  return key;
}

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
  if (!_rs.sec[k]){
    // A dataset can open with series switched OFF via `defaultHidden: ['summit','cons']`. The
    // chips still turn them on — this only decides what the reader meets first. Used where the
    // question is "how big is this and how fast is it moving", and the expectation lines are a
    // second question the reader should have to ask for.
    var off = (_rs.data && _rs.data.defaultHidden) || [];
    var hid = { act:false, summit:false, cons:false, guide:false, margin:false };
    off.forEach(function(x){ hid[x] = true; });
    _rs.sec[k] = { metric: null, win: null, yr: null, chart: null,
      view: _rs.view, mode: 'level', growth: 'yoy', growUnit: 'pct', labels: false, tbl: false, hidden: hid };
  }
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
// ─── Which end of a guided RANGE a comparison is scored against ───────────────
// (SAB, Aug 11 2026.) A band is three numbers, and which one you judge a print by is a real
// choice, not a formatting detail. The midpoint is the neutral read. The LOW end is the bar
// the company actually committed to — "did they clear the floor they set" is the question a
// guide exists to answer, and a print landing at the bottom of the range is a very different
// event from one landing at the top even though both are "within". The HIGH end is what they
// dared to put on the tape, and the gap to it is how much of the raise the market had already
// been handed. Scoring all three against the same print is the point.
//
// Offered ONLY where the company gave a genuine range: against a single guided number
// (Spotify guides one figure per metric) low, mid and high are the same value and three pills
// that all do nothing is worse than no control.
var RS_GPTS = [['lo', 'Low'], ['mid', 'Mid'], ['hi', 'High']];
function rsGuideRanged(m){
  return !!(m && m.guideLo && m.guideHi && m.guideLo.some(function(v, i){
    return v != null && m.guideHi[i] != null && v !== m.guideHi[i];
  }));
}
// The guided figure at one period, read at the chosen end. Falls back to whatever exists, so
// a period the company guided as a single number still answers on every setting.
function rsGuideAt(m, i, gpt){
  if (!m.guideLo || !m.guideHi) return null;
  var lo = m.guideLo[i], hi = m.guideHi[i];
  if (lo == null || hi == null) return null;
  return gpt === 'lo' ? lo : gpt === 'hi' ? hi : (lo + hi) / 2;
}
function rsGptName(gpt){ return gpt === 'lo' ? 'low' : gpt === 'hi' ? 'high' : 'mid'; }
function rsGptHtml(attr, cur, ranged, label){
  if (!ranged) return '';
  return (label ? '<span class="rs-quick-l rs-gpt-l">' + esc(label) + '</span>' : '') +
    '<div class="rs-views">' + RS_GPTS.map(function(g){
      return '<button type="button" class="rs-view' + ((cur || 'mid') === g[0] ? ' active' : '') +
        '" data-' + attr + '="' + g[0] + '" title="Score against the ' + rsGptName(g[0]) +
        ' end of the guided range">' + g[1] + '</button>';
    }).join('') + '</div>';
}
// The same choice, sized to live INSIDE a table row — in the sticky label cell of the row whose
// arithmetic it changes. That is where it belongs: it moves one row's numbers, not the chart, so
// it has no business holding permanent space in the control row above (SAB, Aug 11 2026). Sitting
// on the row also makes it self-limiting — it exists only where a guidance row exists, which is
// only where the company actually guided that line.
function rsGptMiniHtml(attr, cur){
  return '<span class="rs-gptmini">' + RS_GPTS.map(function(g){
    return '<button type="button" class="' + ((cur || 'mid') === g[0] ? 'on' : '') + '" data-' + attr +
      '="' + g[0] + '" title="Score against the ' + rsGptName(g[0]) + ' end of the guided range">' +
      g[1] + '</button>';
  }).join('') + '</span>';
}
// Axis tick: negatives as −$50B, not $-50B; whole dollars only (zoomed bounds
// arrive fractional — $135.13111B would eat the chart's left margin). `div` is
// the metric's display scale from rsScaleOf (1000 → $B axis, 1 → $M axis).
// `ticks` is the array Chart.js hands the callback. It is used ONLY to decide how many
// decimals a tick needs: whole dollars are right for a chart spanning $10B→$60B, and wrong
// for one spanning $55B→$58B, where rounding prints "$58B" twice and the axis reads broken.
// Derived from the actual tick STEP rather than from the values, so it follows the zoom.
function rsTickDec(ticks){
  if (!ticks || ticks.length < 2) return 0;
  var step = Math.abs(ticks[1].value - ticks[0].value);
  for (var i = 2; i < ticks.length; i++) step = Math.min(step, Math.abs(ticks[i].value - ticks[i - 1].value));
  if (!isFinite(step) || step <= 0) return 0;
  if (step >= 1) return 0;
  return step >= 0.1 ? 1 : 2;
}
function rsTick(v, unit, div, cur, ticks){
  var s = v < 0 ? '−' : '', a = Math.abs(v), c = cur || '$', d = rsTickDec(ticks);
  if (unit === 'eps') return s + c + (+a.toFixed(2));
  if (unit === 'pct') return s + a.toFixed(d) + '%';
  if (unit === 'count') return s + (d ? a.toFixed(d) : Math.round(a).toLocaleString());
  return s + c + (d ? a.toFixed(d) : Math.round(a)) + (div === 1000 ? 'B' : 'M');
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
// The same date without its year — for the second and third mentions in one option, where the
// year is already established by the date the option leads with.
function rsVintDayShort(id){
  var p = String(id).split('-');
  return (p.length === 3 && RS_MON[+p[1] - 1]) ? RS_MON[+p[1] - 1] + ' ' + (+p[2]) : id;
}
// The period a snapshot was the last read BEFORE. Datasets label vintages by what they already
// KNEW ("knew through 1Q26"), which is the archivist's fact; the question an analyst asks is
// which print they were standing in front of. Same file, and it is the phrasing you scan a list
// with — "give me the read going into 2Q26" — so the label is derived rather than stored.
// It is also two characters shorter, which the dropdown needed (SAB, Aug 11 2026).
function rsNextPeriod(view, p){
  if (p == null) return null;
  if (view === 'q'){
    var q = rsParseQ(p); if (!q) return null;
    var ny = q.q === 4 ? q.y + 1 : q.y, nq = q.q === 4 ? 1 : q.q + 1;
    return nq + 'Q' + ('0' + (ny % 100)).slice(-2);
  }
  return isNaN(+p) ? null : String(+p + 1);
}
function rsVintBefore(v){
  var la = v.lastActual || {};
  var n = rsNextPeriod('q', la.q);
  if (n) return n;
  n = rsNextPeriod('y', la.y);
  return n ? 'FY' + n : null;
}
function rsVintLabel(v){
  var b = rsVintBefore(v);
  return rsVintDay(v.id, v.label) + (b ? ' · before ' + b : '');
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
// Does the dataset carry ANY value for this source, in any view, in any metric — flat array or
// vintage matrix? A ticker we have no model for (DHR) or no Summit line for yet (GOOGL) ships
// `summit: []` on every metric, and without this guard the note underneath the picker still
// announced "Summit: no vintage matrix yet — showing the estimate that stood before each print",
// which reads as a promise that a Summit series is on the chart. It is not; say nothing about it.
function rsSrcInData(src){
  var d = _rs.data; if (!d) return false;
  if (rsMatrix(src)) return true;
  var vs = d.views || {};
  for (var vn in vs){
    var ms = vs[vn].metrics || {};
    for (var mk in ms){
      var a = ms[mk][src] || ms[mk]['_flat_' + src];
      if (a && a.some(function(v){ return v != null; })) return true;
    }
  }
  return false;
}
function rsVintNote(){
  var mode = _rs.vint || 'preprint';
  var names = { summit: 'Summit', cons: 'Consensus' }, asof = mode.indexOf('asof:') === 0, out = [];
  ['summit', 'cons'].forEach(function(src){
    if (!rsSrcInData(src)) return;                 // the source is absent, not merely un-versioned
    var mx = rsMatrix(src);
    if (!mx){ out.push(names[src] + ': no vintage matrix yet — showing the estimate that stood before each print'); return; }
    if (mode === 'preprint'){ out.push(names[src] + ': ' + (mx.vintages || []).length + ' snapshots, each period taken from the last one before its print'); return; }
    var hit = rsVintFor(src, mode);
    if (!hit){
      out.push(names[src] + ': ' + (asof ? 'no file that far back — the series is blank, not zero'
                                         : 'no snapshot on this date — the series is blank, not zero'));
      return;
    }
    var before = rsVintBefore(hit);
    // Under as-of the resolved date is usually NOT the date on the picker, so it is named.
    out.push(names[src] + ': ' + rsVintDay(hit.id) + (asof && hit.id !== mode.slice(5) ? ' (its latest up to ' + mode.slice(5) + ')' : '') +
             (before ? ' — the last read before ' + before : ''));
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
// ─── Margin as a READING MODE (SAB, Aug 11 2026) ──────────────────────────────
// The margin used to be a line on a second axis, available only outside Top Line and only
// as a legend chip. That made it a decoration on the level chart rather than a way of
// reading it — you could not see the margin ALONE, at a scale where 40bps is visible,
// which is exactly the question Margins & Profitability exists to ask. It is now the third
// mode beside the level and growth, offered wherever the metric declares `marginOf`, so
// the same block can be read three ways without a second chart.
function rsHasMargin(k, m){ return !!(m.marginOf && m.unit !== 'eps' && rsView(k).metrics[m.marginOf]); }
function rsIsMargin(k){ return rsSt(k).mode === 'margin'; }
// The plotted series for the block's CURRENT mode. One place, so the chart, the tooltip and
// the y-axis can never disagree about what is on screen — which is exactly how the tooltip
// came to be reporting levels under a growth chart.
function rsModeArr(k, m, name){
  if (rsIsMargin(k)) return rsMarginArr(k, m, name);
  if (rsIsGrow(k))   return rsGrowArr(k, m, name, rsGrowAmt(k));
  return m[name] || null;
}
// Is the plotted number a PERCENTAGE? Everything derived is, except growth-as-amount —
// which is a currency delta and has to be scaled, ticked and formatted like money.
function rsIsPctMode(k){ return rsIsMargin(k) || (rsIsGrow(k) && !rsGrowAmt(k)); }
// How a value reads in the current mode. A margin is a level ("6.2%"), so it carries no
// sign; growth is a move ("+24.1%") and always does.
function rsModeFmt(k, m, v){
  if (v == null) return '—';
  if (rsIsMargin(k)) return v.toFixed(1) + '%';
  if (rsIsGrow(k))   return rsGrowAmt(k) ? rsFmtD(m, v) : ((v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%');
  return rsFmt(m, v);
}
// A DIFFERENCE between two values in the current mode. Percentages differ in percentage
// POINTS; levels and amounts differ in their own units.
function rsModeDiff(k, m, v){
  if (v == null) return '—';
  if (rsIsPctMode(k)) return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + ' pp';
  return rsFmtD(m, v);
}
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
  // The scorecard and the walk hold their own metric/period/vintage now, so they have to be
  // dropped with the rest when the pane is rebuilt for another dataset — a stale metric key
  // from the previous ticker would otherwise survive into a view that has no such line.
  _rs.surp = null;
  _rs.conv = null;
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
  // The scorecard no longer requires a quarterly view — it carries its own period axis now.
  if (d.surprise !== false && (d.views.q || d.views.y) && rsSurpGroups().length) h += rsSurpBlockHtml();
  // …and under it, the same prints read the other way round: one period, every snapshot.
  h += '<div id="rsConvHost">' + rsConvBlockHtml() + '</div>';
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
  return '<div class="rs-toprow">' + rsVintSelHtml(_rs.vint || 'preprint', 'pane', 'Estimates as of', _rs.vsrc) + '</div>';
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
  var d = _rs.data, st = rsSt(k);
  // A metric with no denominator has no margin — switching to one and then picking such a
  // metric would otherwise leave the block in a mode it cannot draw.
  if (st.mode === 'margin' && !rsHasMargin(k, m)) st.mode = 'level';
  var grow = rsIsGrow(k), marg = rsIsMargin(k);
  var b = function(attr, val, on, label, title){
    return '<button type="button" class="rs-view' + (on ? ' active' : '') + '" data-' + attr + '="' + val + '"' +
      (title ? ' title="' + esc(title) + '"' : '') + '>' + label + '</button>';
  };
  var h = '<div class="rs-views">' + Object.keys(d.views).map(function(vn){
    return b('rsview', vn, rsViewName(k) === vn, esc(d.views[vn].label));
  }).join('') + '</div>';
  h += '<div class="rs-views">' +
    b('rsmode', 'level', !grow && !marg, esc(rsLevelLabel(m)), 'The reported level in each period') +
    b('rsmode', 'grow', grow, 'Growth', 'Growth over the base period, for every series at once') +
    (rsHasMargin(k, m)
      ? b('rsmode', 'margin', marg, 'Margin %',
          (m.marginLabel || 'margin') + ' — every series over its OWN denominator (actual/actual, Summit/Summit, Street/Street)')
      : '') + '</div>';
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
  h += '<div class="rs-views">' +
    b('rslab', '1', st.labels === true, 'On', 'Print every plotted value on the chart') +
    b('rslab', '0', st.labels !== true, 'Off') + '</div>';
  // NB: the Low/Mid/High guidance control is deliberately NOT here (SAB, Aug 11 2026). It sat
  // in this row for one commit and was wrong there: this row is where controls that change the
  // CHART live, and that one changes a single row of the period table. Up here it also stood
  // permanently, on metrics the company never guides. It now renders inside the table, on the
  // row whose arithmetic it moves — see rsRenderTable.
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
// `mode` / `cls` are passed in because there are now TWO of these on the page: the pane-wide
// one at the top, and the scorecard's own (SAB, Aug 11 2026). They keep separate selections,
// so the picker cannot read its state from a single global.
// ─── Two controls, not one long list (SAB, Aug 11 2026) ──────────────────────
// This was a single <select> holding ~20 options across four optgroups. Most of that length was
// the per-file lists, and those are the part almost nobody opens: reading ONE archived file is
// the forensic case, not the daily one. So the picker splits in two —
//
//   [ how to read it ▾ ]  [ which one ▾ ]
//
// The first names the READING (before each print · as of a date · one Summit file · one Street
// file), four short options and the only one on screen by default. The second appears only when
// the reading needs an argument, and lists just that one archive's dates — so browsing Summit's
// files never means scrolling past Bloomberg's.
//
// `vsrc` is the extra bit of state this needs. A stored value of '2026-07-31' cannot say which
// archive you were browsing (that date exists in both), and it does not have to: rsVintFor looks
// the id up in each source's own register either way. It only decides which list select B shows.
function rsVintSrcLabel(src){ return src === 'summit' ? 'Summit model' : 'Street (Bloomberg)'; }
// The reading a stored value represents. Falls back to whichever archive owns the id.
function rsVintParse(val, vsrc){
  if (!val || val === 'preprint') return { mode: 'preprint', id: null };
  if (val.indexOf('asof:') === 0) return { mode: 'asof', id: val.slice(5) };
  return { mode: (vsrc === 'cons' || vsrc === 'summit') ? vsrc : (rsVintSrcs(val)[0] || 'summit'), id: val };
}
// Newest-first list of one archive's files.
function rsVintList(src){
  var mx = rsMatrix(src);
  return (mx && mx.vintages || []).slice().sort(function(a, b){ return a.id < b.id ? 1 : -1; });
}
// ⚠ The newest file is the WRONG default, and it looks like a broken pane rather than a bad
// pick. Archives are written around prints, so the newest file is always saved just AFTER the
// latest one — it therefore carries forward periods only, has no estimate for anything that has
// reported, and every surface that scores estimates against actuals renders empty on it. On UBER
// picking "One Summit model file" landed on Aug 5, 2026 and greyed out both comparators.
//
// So a reading lands on the newest file that is still a FORECAST of something now known: its own
// last-reported period sits strictly before the dataset's. On UBER that is Jul 31 for all three
// readings — the last read before the 2Q26 print, which is the file anyone means anyway.
function rsLastReportedOrd(view){
  var v = _rs.data && _rs.data.views && _rs.data.views[view];
  if (!v) return null;
  var best = null;
  Object.keys(v.metrics).forEach(function(k){
    var m = v.metrics[k]; if (!m.act) return;
    for (var i = 0; i < m.periods.length; i++){
      if (m.act[i] == null) continue;
      var o = rsOrdIn(view, m.periods[i]);
      if (o != null && (best == null || o > best)) best = o;
    }
  });
  return best;
}
function rsVintScoreable(v, view){
  var la = v.lastActual && v.lastActual[view];
  var lo = la == null ? null : rsOrdIn(view, la);
  var lr = rsLastReportedOrd(view);
  return lo != null && lr != null && lo < lr;
}
function rsVintPick(list, view, wrap){
  for (var i = 0; i < list.length; i++) if (rsVintScoreable(list[i], view)) return wrap(list[i]);
  return list.length ? wrap(list[0]) : 'preprint';   // nothing has printed yet — newest it is
}
function rsVintDefault(mode, view){
  view = view || 'q';
  if (mode === 'preprint') return 'preprint';
  if (mode === 'asof') return rsVintPick(rsAsOfDates(), view, function(v){ return 'asof:' + v.id; });
  return rsVintPick(rsVintList(mode), view, function(v){ return v.id; });
}
function rsVintSelHtml(val, scope, label, vsrc){
  if (!rsVintages().length) return '';
  var cur = rsVintParse(val, vsrc), asof = rsAsOfDates();
  var modes = [['preprint', 'Latest file before each print']];
  if (asof.length) modes.push(['asof', 'As of a date']);
  ['summit', 'cons'].forEach(function(src){
    if (rsVintList(src).length) modes.push([src, 'One ' + rsVintSrcLabel(src) + ' file']);
  });
  var h = '<div class="rs-vint"><span class="rs-quick-l">' + esc(label || 'Estimates as of') + '</span>' +
    '<select class="rs-vsel" data-vscope="' + esc(scope) + '" data-vpart="mode" aria-label="How to read the estimates">' +
      modes.map(function(m){
        return '<option value="' + m[0] + '"' + (cur.mode === m[0] ? ' selected' : '') + '>' + esc(m[1]) + '</option>';
      }).join('') +
    '</select>';

  var opts = '';
  if (cur.mode === 'asof'){
    // What an analyst actually asks — "where did each side stand on this date" — which is not
    // the same question as "read me this one file", because the two archives rarely share a day.
    // A source is named only when its latest file is OLDER than the date picked: that is the one
    // case that costs the reader something, and spelling out both every time said "both are
    // current" in 44 characters.
    opts = asof.map(function(v){
      var stale = ['summit', 'cons'].map(function(s){
        var hit = rsVintAsOf(s, v.id);
        if (!hit) return RS_SRCN[s] + ' —';
        return hit.id === v.id ? null : RS_SRCN[s] + ' ' + rsVintDayShort(hit.id);
      }).filter(Boolean);
      var b = rsVintBefore(v);
      return '<option value="asof:' + v.id + '"' + (cur.id === v.id ? ' selected' : '') + '>' +
        esc(rsVintDay(v.id, v.label) + (b ? ' · before ' + b : '') + (stale.length ? ' · ' + stale.join(' · ') : '')) +
        '</option>';
    }).join('');
  } else if (cur.mode === 'summit' || cur.mode === 'cons'){
    // One archive at a time. Splitting the two was already necessary — they keep separate
    // calendars, so a merged list forced an ownership tag onto every row — and now that each
    // archive has the control to itself, the tag is the mode select above.
    opts = rsVintList(cur.mode).map(function(v){
      var shared = rsVintSrcs(v.id).length > 1;
      return '<option value="' + v.id + '"' + (cur.id === v.id ? ' selected' : '') + '>' +
        esc(rsVintLabel(v) + (shared ? ' · in both' : '')) + '</option>';
    }).join('');
  }
  if (opts) h += '<select class="rs-vsel2" data-vscope="' + esc(scope) + '" data-vpart="file" aria-label="Which file">' + opts + '</select>';
  return h + '</div>';
}

// Structured metric picker — a dropdown grouped by the section's groups
// (Totals / Segments / Revenue lines / …) instead of a wall of pills.
// Dropdowns group by METRIC FAMILY, with the segments inside — "Gross Bookings ▸ Total ·
// Mobility · Delivery · Freight", not "Mobility ▸ GB · revenue" (SAB, Aug 10 2026). The point
// is the rollout: every company has a couple of families and a few segments under them, so
// this shape homogenises across tickers where grouping by segment cannot.
//
// The option text stays the metric's FULL name even though the group header repeats the
// family. A closed <select> renders only the chosen option — the optgroup label is not part
// of it — so trimming the option to "Mobility" would leave the control reading "Mobility"
// with no clue which line that is. One name per metric, the same one the chart title and the
// table header use.
function rsOptLabel(m){ return m.label; }
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
  var marg = rsIsMargin(k);
  function chip(key, color, label, line){
    var off = st.hidden[key];
    var sw = line ? '<span class="rs-leg-line" style="background:' + color + '"></span>' : '<span class="ave-leg-act" style="background:' + color + '"></span>';
    return '<button type="button" class="rs-leg' + (off ? ' off' : '') + '" data-rsleg="' + key + '" title="Show / hide">' + sw + esc(label) + '</button>';
  }
  var h = chip('act', RS_ACT, 'Actual');
  if (has.summit) h += chip('summit', RS_SUMMIT, 'Summit model');
  if (has.cons)   h += chip('cons', RS_CONS, 'Consensus');
  // Label the chip for what the company actually gives: a range, or a single number.
  // In MARGIN mode there is no guidance band to draw: a guided margin would need the company
  // to have guided the denominator too, and pairing guideLo with guideLo is not the low end of
  // a margin range — it is a corner of it. Say so rather than silently dropping the chip.
  if (marg){
    if (has.guide) h += '<span class="rs-noguide" title="The company guides this line in ' + esc(rsCurName(m)) +
      ', not as a margin — and dividing one end of a guided range by one end of another is a corner of the band, not the band. The guidance range is on the level chart.">⚑ Guidance is not a margin</span>';
  }
  else if (has.guide){
    var anyRange = m.guideLo.some(function(v, i){ return v != null && m.guideHi[i] != null && v !== m.guideHi[i]; });
    h += chip('guide', 'rgba(62,90,130,0.3)', anyRange ? 'Guidance range' : 'Guidance (single number)');
  }
  // Make the ABSENCE of guidance loud and explicit — a company (or a line) with no numeric guide gets
  // an amber badge, so no reader is left guessing why there is no guidance band (§5.5).
  else h += '<span class="rs-noguide" title="This company issued no numeric guidance for this line/period — so there is no guidance band to score against (only Street and Summit).">⚑ No company guidance</span>';
  // The margin LINE chip only exists in level mode — in margin mode the margin IS the chart,
  // and in growth mode it is suppressed (two unrelated percentages on one axis).
  if (!isTop && !marg && !rsIsGrow(k) && rsHasMargin(k, m)) h += chip('margin', RS_ACT, esc(m.marginLabel || 'margin') + ' %', true);
  h += '<span class="tech-leg-i" style="margin-left:auto">▲ beat · ▼ miss · click a chip to hide it</span>';
  return h;
}

// ─── Chart (per section) ──────────────────────────────────────────────────────

// Create a chart, unbinding anything still attached to the canvas first.
//
// The engine keeps ONE module-level `_rs`, and initResults() wipes `_rs.sec` / `_rs.surp` /
// `_rs.conv` whenever it re-targets to a different dataset. That orphans the live Chart objects
// without unbinding them from their canvases, so returning to a pane that is still on screen —
// two engine instances in one profile, which js/segments.js now creates — hits Chart.js's
// "Canvas is already in use". State we no longer hold a reference to cannot be cleaned up any
// other way, so ask Chart.js for it.
// Values printed on the plot itself, off by default — the same instrument the Segments charts
// carry, so one toggle means one thing everywhere in the portal. A label that will not fit inside
// its own bar segment, or that would run past the plot edge, is skipped rather than half-drawn.
var rsLabels = {
  id: 'rsLabels',
  afterDatasetsDraw: function(chart, args, opts){
    if (!opts || !opts.on) return;
    var ctx = chart.ctx, area = chart.chartArea;
    ctx.save();
    ctx.font = '600 9.5px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    chart.data.datasets.forEach(function(ds, di){
      var meta = chart.getDatasetMeta(di);
      if (meta.hidden || ds.rsNoLabel) return;
      var bar = meta.type === 'bar';
      (meta.data || []).forEach(function(el, i){
        var v = ds.data[i];
        if (v == null || typeof v !== 'number' || !el) return;
        var txt = opts.fmt ? opts.fmt(v) : String(v);
        var w = ctx.measureText(txt).width;
        if (el.x - w / 2 < area.left - 1 || el.x + w / 2 > area.right + 1) return;
        if (bar){
          var top = Math.min(el.y, el.base), bot = Math.max(el.y, el.base);
          if (bot - top < 13) return;
          ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff';
          ctx.fillText(txt, el.x, (top + bot) / 2);
        } else {
          var y = el.y - 6;
          if (y < area.top + 8) y = el.y + 13;
          ctx.textBaseline = 'bottom'; ctx.fillStyle = 'rgba(30,39,51,0.85)';
          ctx.fillText(txt, el.x, y);
        }
      });
    });
    ctx.restore();
  }
};
// Short enough not to collide; the period table underneath carries the precision.
function rsLabNum(v){
  var a = Math.abs(v);
  return a >= 100 ? v.toFixed(0) : a >= 1 ? v.toFixed(1) : v.toFixed(2);
}
function rsNewChart(el, cfg){
  var prev = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(el) : null;
  if (prev) prev.destroy();
  return new Chart(el.getContext('2d'), cfg);
}
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
  // Each mode replaces every series with its own transform (growth over the lag, or the
  // margin over the metric's denominator). Percentages are already comparable so they are
  // NOT scaled; growth-as-an-amount is in the metric's own units and scales with them.
  var grow = rsIsGrow(k), amt = rsGrowAmt(k), marg = rsIsMargin(k), pctMode = rsIsPctMode(k);
  var mscale = pctMode ? function(v){ return v; } : scale;
  // `raw` is the plotted number BEFORE display scaling — what the tooltip and the table
  // quote. `ser` is the same thing scaled for the axis. Keeping the two derived from one
  // function is the fix for the tooltip reporting levels under a growth chart.
  var raw = function(name){ return rsModeArr(k, m, name) || []; };
  var ser = function(name){ return raw(name).map(mscale); };
  var cur = rsCur(m);
  var unitLbl = marg              ? '%'
              : m.unit === 'eps'  ? cur
              : m.unit === 'pct'  ? '%'
              : m.unit === 'count' ? (m.unitLabel || 'count')
              : (div === 1000 ? cur + 'B' : cur + 'M');
  function sl(a){ return a.slice(lo, hi + 1); }

  var datasets = [], needY2 = false;
  // Guidance is suppressed in MARGIN mode — see the legend note: the company guides the
  // line, not the ratio, and the corner of two guided ranges is not a guided margin.
  if (has.guide && !marg && !st.hidden.guide){
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

  // Margin lines are suppressed in growth mode: the main axis is already a percentage there,
  // and two unrelated percentages sharing one chart is how a reader mistakes one for the other.
  // They are suppressed in margin mode for the opposite reason — there the margin IS the bars.
  if (!grow && !marg && !isTop && !st.hidden.margin && rsHasMargin(k, m)){
    // Each margin line belongs to a SOURCE, so it follows that source's chip as well as the
    // margin chip. Gating them on `margin` alone left "Margin % (Summit)" drawn after the Summit
    // bars were hidden — the reader had asked for the series to go and half of it stayed, which
    // is exactly what non-negotiable 2 forbids (CHART_ENGINE_REFERENCE §0.2).
    var ma = rsMarginArr(k, m, 'act'), ms = rsMarginArr(k, m, 'summit'), mc = rsMarginArr(k, m, 'cons');
    if (!st.hidden.act && ma && ma.some(function(v){ return v != null; })){
      needY2 = true;
      datasets.push({ label: 'Margin % (actual)', type: 'line', yAxisID: 'y2', data: sl(ma),
        borderColor: 'rgba(30,39,51,0.9)', backgroundColor: 'rgba(30,39,51,0.9)', borderWidth: 2,
        pointRadius: 2.5, tension: 0.25, spanGaps: true, order: 1 });
    }
    if (!st.hidden.summit && ms && ms.some(function(v){ return v != null; })){
      needY2 = true;
      datasets.push({ label: 'Margin % (Summit)', type: 'line', yAxisID: 'y2', data: sl(ms),
        borderColor: RS_SUMMIT, backgroundColor: RS_SUMMIT, borderWidth: 2, borderDash: [5, 4],
        pointRadius: 2, tension: 0.25, spanGaps: true, order: 2 });
    }
    if (!st.hidden.cons && mc && mc.some(function(v){ return v != null; })){
      needY2 = true;
      datasets.push({ label: 'Margin % (consensus)', type: 'line', yAxisID: 'y2', data: sl(mc),
        borderColor: 'rgba(124,134,148,0.9)', backgroundColor: 'rgba(124,134,148,0.9)', borderWidth: 2, borderDash: [2, 3],
        pointRadius: 2, tension: 0.25, spanGaps: true, order: 2 });
    }
  }

  var tEl = document.getElementById('rsChartT-' + k);
  if (tEl) tEl.innerHTML = esc(m.label) + ' — ' +
    (marg ? esc(m.marginLabel || 'margin') + ' <span>(percent per period · each series over its OWN denominator — actual/actual, Summit/Summit, Street/Street · hover a period for every series)</span>'
    : grow ? esc(rsGrowLabel(k)) + ' <span>(' + (amt ? unitLbl + ' added over the base period' : 'percent') +
            ' · every series measured against the reported period ' + rsLook(k) +
            (rsViewName(k) === 'q' ? (rsLook(k) === 1 ? ' quarter' : ' quarters') : ' year') + ' back)</span>'
          : 'actual vs expectations <span>(' + unitLbl + ' per period · ' + (isTop ? '' : 'margin lines on the outer right axis · ') + 'hover a period for every series)</span>');

  // Forward (estimate) periods: the reported labels render muted grey here; the FORWARD labels are
  // hidden (callback → '') and the rsFwdZone plugin redraws them inside a highlighted bubble, over a
  // shaded "FORECAST" zone — so old-vs-forward is unmistakable.
  var lastA = rsLastAct(m);
  var fwdFrom = (lastA + 1 > hi) ? -1 : Math.max(0, (lastA + 1) - lo);
  // ── Y AXES ON THE RIGHT (SAB, Aug 11 2026) ──────────────────────────────────
  // Every y-axis in the pane reads on the right-hand edge. The eye lands on the most recent
  // period first — it is the right-most bar and the one the reader came for — and having the
  // scale right there means no traverse back across the whole history to decode it. Where a
  // block carries two axes they STACK on the right (`weight` decides the order: the primary
  // inboard against the plot, the margin axis outboard of it), rather than one per side.
  var scales = {
    x: { grid: { display: false }, ticks: { color: 'rgba(80,90,104,0.9)', font: { size: 11 }, autoSkip: false,
        callback: function(v, i){ return (fwdFrom >= 0 && i >= fwdFrom) ? '' : this.getLabelForValue(v); } } },
    y: { position: 'right', weight: 0, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 },
      callback: function(v, i, ts){ return pctMode ? (+v.toFixed(1)) + '%' : rsTick(v, m.unit, div, m.cur, ts); } } }
  };
  if (st.yr){ scales.y.min = st.yr[0]; scales.y.max = st.yr[1]; }
  if (needY2) scales.y2 = { position: 'right', weight: 1, grid: { display: false },
    ticks: { font: { size: 11 }, callback: function(v){ return v + '%'; } } };

  st.chart = rsNewChart(el, {
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
        rsLabels: { on: st.labels === true, fmt: rsLabNum },
        // ── The tooltip reads in the CURRENT MODE (SAB, Aug 11 2026) ──────────────
        // It used to quote `m.act` / `m.summit` / `m.cons` straight from the dataset, which
        // meant a growth chart hovered as dollars: the bar said +24.1% and the tooltip said
        // $57.3B. Every line now comes off `raw()` — the same transform the bars are drawn
        // from — so the number under the cursor is the number on the screen. The surprise
        // clause follows too: percentages differ in percentage POINTS, not in percent.
        tooltip: {
          callbacks: {
            label: function(ctx){
              var i = ctx.dataIndex + lo;
              var gl = raw('guideLo'), gh = raw('guideHi');
              if (ctx.dataset.label === 'Guidance range'){
                return (grow ? 'Guidance implies: ' : 'Guidance: ') +
                  rsModeFmt(k, m, gl[i]) + ' – ' + rsModeFmt(k, m, gh[i]);
              }
              if (ctx.dataset.label === 'Guidance'){   // a single guided number, no range
                return (grow ? 'Guidance implies: ' : 'Guidance: ') + rsModeFmt(k, m, gl[i]);
              }
              if (ctx.dataset.yAxisID === 'y2'){
                return ctx.dataset.label + ': ' + (ctx.parsed.y == null ? '—' : ctx.parsed.y.toFixed(1) + '%');
              }
              var key = { 'Actual': 'act', 'Summit model': 'summit', 'Consensus': 'cons' }[ctx.dataset.label];
              if (!key) return ctx.dataset.label + ': ' + (ctx.parsed.y == null ? '—' : ctx.parsed.y);
              var arr = raw(key), aArr = raw('act');
              var line = ctx.dataset.label + ': ' + rsModeFmt(k, m, arr[i]);
              if (key !== 'act' && arr[i] != null && aArr[i] != null){
                var d = aArr[i] - arr[i];
                line += pctMode
                  ? '  (actual ' + rsModeDiff(k, m, d) + ')'
                  : '  (actual ' + (rsSurp(aArr[i], arr[i]) >= 0 ? '+' : '−') +
                    Math.abs(rsSurp(aArr[i], arr[i])).toFixed(dec) + '% · ' + rsFmtD(m, d) + ')';
              }
              return line;
            }
          }
        }
      },
      scales: scales
    },
    plugins: [rsFwdZone, rsLabels]
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
    // Starting the drag on an AXIS STRIP always means a y-drag. The strips are outside the
    // plot on either side, and since the y-axes moved to the right (SAB, Aug 11 2026) the
    // live one is the right strip — testing only the left made the gesture silently dead
    // exactly where the scale now is.
    var onAxis = (ev.clientX - r0.left) < area.left || (ev.clientX - r0.left) > area.right;
    var forcedY = onAxis || !onX;
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
  var st = rsSt(k);
  var gpt = st.gpt || 'mid';                           // which end of the guided range is scored
  // A hidden series leaves the TABLE too (non-negotiable 2). The margin chip only exists in
  // level mode, so its state may only gate rows while the chip is on screen to un-gate them —
  // otherwise hiding margins in level mode and switching to Growth would strip rows with no
  // visible control to bring them back.
  var marginChip = !isTop && !rsIsMargin(k) && !rsIsGrow(k) && rsHasMargin(k, m);
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
    var ab = 0, wi = 0, be = 0, gs = [];
    idx.forEach(function(i){
      if (m.guideLo[i] == null || m.act[i] == null) return;
      if (m.act[i] > m.guideHi[i]) ab++; else if (m.act[i] < m.guideLo[i]) be++; else wi++;
      var g = rsGuideAt(m, i, gpt); if (g) gs.push((m.act[i] - g) / Math.abs(g) * 100);
    });
    if (!(ab + wi + be)) return '';
    // above/within/below always describe the whole BAND — that verdict does not move with the
    // toggle, and pretending it did would turn "within" into "below" on a low setting.
    return ab + '▲ · ' + wi + '⊙ · ' + be + '▼<br><span class="rs-ft-dim">avg vs ' + rsGptName(gpt) + ' ' +
      (gs.length ? sgn(avg(gs)) : '—') + '</span>';
  }

  var unitCap = m.unit === 'eps'   ? (rsCurName(m) + ' per share')
              : m.unit === 'pct'   ? 'percent (%)'
              : m.unit === 'count' ? (m.unitLabel || 'count')
              : (rsCurName(m) + ' ' + (div === 1000 ? 'billions' : 'millions'));
  var h = '<div class="rs-ft-cap">' + unitCap + ' · <span class="rs-ft-e">E</span> = estimate, no actual reported yet · the right column summarizes the selected range: how the actual has come in vs each estimate (▲ = beat)' +
    (has.guide && rsGuideRanged(m)
      ? ' · guidance is scored at the <b>' + rsGptName(gpt) + '</b> of the range (the ▲⊙▼ verdict always describes the whole band)'
      : '') + '</div>';
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

  var showMargin = m.marginOf && m.unit !== 'eps' && !isTop && !(marginChip && st.hidden.margin);

  // Actual: value → YoY/QoQ growth (→ margin).
  var growLbl = rsGrowLabel(k);
  var maA = showMargin ? rsMarginArr(k, m, 'act') : null;
  if (!st.hidden.act){
    h += row('Actual', function(i){ return m.act[i] == null ? '<span class="rs-ft-nil">—</span>' : '<b>' + num(m.act[i]) + '</b>'; }, 'main nb', sumCagr());
    h += row(growLbl, function(i){ return pctDollar(rsActGrowthPct(k, m, i), rsActGrowthDollar(k, m, i)); }, showMargin ? 'sub nb' : 'sub', sumGrowth(rsActGrowthPct.bind(null, k, m)));
    if (showMargin) h += row(esc(m.marginLabel || 'margin'), function(i){ return maA && maA[i] != null ? maA[i].toFixed(1) + '%' : '<span class="rs-ft-nil">—</span>'; }, 'sub', sumMargin(maA));
  }

  // Reference series (Summit / Consensus): value → YoY growth → surprise (→ margin).
  [{ on: has.summit, series: 'summit', label: 'Summit model' },
   { on: has.cons,   series: 'cons',   label: 'Consensus' }].forEach(function(r){
    if (!r.on || st.hidden[r.series]) return;
    var s = r.series;
    var mm = showMargin ? rsMarginArr(k, m, s) : null;
    h += row(r.label, function(i){ return num(m[s][i]); }, 'main nb', '');
    h += row(growLbl, function(i){ return pctDollar(rsRefGrowthPct(k, m, s, i), rsRefGrowthDollar(k, m, s, i)); }, 'sub nb',
      sumGrowth(function(i){ return rsRefGrowthPct(k, m, s, i); }));
    h += row('surprise', function(i){ return (m.act[i] == null || m[s][i] == null) ? '<span class="rs-ft-nil">—</span>' : pctDollar(rsSurp(m.act[i], m[s][i]), m.act[i] - m[s][i]); },
      mm ? 'sub nb' : 'sub', sumSurprise(m[s]));
    if (mm) h += row(esc(m.marginLabel || 'margin'), function(i){ return mm[i] != null ? mm[i].toFixed(1) + '%' : '<span class="rs-ft-nil">—</span>'; }, 'sub', sumMargin(mm));
  });

  if (has.guide && !st.hidden.guide){
    // A point guide prints one number, not "4800–4800". The end being scored against is marked
    // in the range itself, so the two rows never disagree about which number is in play.
    var anyRangeRow = rsGuideRanged(m);
    h += row('Guidance', function(i){
      if (m.guideLo[i] == null) return '<span class="rs-ft-nil">—</span>';
      if (m.guideLo[i] === m.guideHi[i]) return num(m.guideLo[i]);
      var lo2 = num(m.guideLo[i]), hi2 = num(m.guideHi[i]);
      if (gpt === 'lo') lo2 = '<b>' + lo2 + '</b>';
      else if (gpt === 'hi') hi2 = '<b>' + hi2 + '</b>';
      return lo2 + '–' + hi2;
    }, 'main nb', '');
    // "within" only exists when there IS a range; against a single guided number the
    // comparison is simply above or below it, and the delta is vs the guide, not vs an end.
    // The Low/Mid/High pills ride in this row's own label, because this row is the only thing
    // they change — and a company that guides a single number gets no pills at all.
    var vsLabel = anyRangeRow
      ? 'actual vs range' + rsGptMiniHtml('rsgpt', gpt)
      : 'actual vs guide';
    h += row(vsLabel, function(i){
      if (m.guideLo[i] == null || m.act[i] == null) return '<span class="rs-ft-nil">—</span>';
      var point = m.guideLo[i] === m.guideHi[i];
      var g = rsGuideAt(m, i, gpt), d = g == null ? null : m.act[i] - g;
      var word;
      if (m.act[i] > m.guideHi[i]) word = '<span style="color:' + RS_GREEN + '">above</span>';
      else if (m.act[i] < m.guideLo[i]) word = '<span style="color:' + RS_RED + '">below</span>';
      else word = '<span style="color:var(--mu)">' + (point ? 'in line' : 'within') + '</span>';
      return word + (d == null ? '' : ' <span class="rs-ft-dim">· ' + rsFmtD(m, d) +
        (point ? ' vs guide' : ' vs ' + rsGptName(gpt)) + '</span>');
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
// The math, with the basis passed IN rather than read from a block's state — so the projection
// curve at the foot of the pane (which is the same numbers transposed, and holds its own mode)
// computes growth and margins through this one function instead of a second copy of the rules.
function rsEvoPct(k, m, src, yi){ return rsEvoPctAt(m, src, yi, rsEvoBasis(k), rsEvoIsAmt(k)); }
function rsEvoPctAt(m, src, yi, basis, amt){
  var arr = m[src] ? m[src][yi] : null;
  if (!arr) return null;
  if (basis === 'grow'){
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
  _rs.curve = null;
  var ev = data.evolution;
  var h = '<div class="rs-wrap" id="rsEvoWrap">';
  // `evolution.intro` is deliberately NOT rendered (SAB, Aug 10 2026). It was a paragraph of
  // conclusions above charts that state the same thing, and it went stale on every refresh
  // while the charts did not. The field stays in the datasets — each metric's `note`, which
  // does render under its own block, is where a written read belongs.
  h += ev.sections.map(function(cfg){ return rsEvoBlockHtml(cfg.key); }).join('');
  h += '<div id="rsCurveHost">' + rsCurveBlockHtml() + '</div>';
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
function rsEvoActualPct(k, mkey, m, year){ return rsEvoActualPctAt(mkey, m, year, rsEvoBasis(k), rsEvoIsAmt(k)); }
function rsEvoActualPctAt(mkey, m, year, basis, amt){
  var a = rsEvoActual(mkey, m, year);
  if (a == null) return null;
  if (basis === 'grow'){
    var prev = rsEvoActual(mkey, m, String(+year - 1));
    if (prev == null || !prev) return null;
    return amt ? a - prev : (a - prev) / Math.abs(prev) * 100;
  }
  if (!basis) return null;
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

  st.chart = rsNewChart(el, {
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
        // Right-hand axis, like every other chart in Results and Estimates (SAB, Aug 11 2026):
        // the latest snapshot is the right-most point and the scale now sits beside it.
        y: { position: 'right', grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 },
          callback: function(v, i, ts){ return pct ? (+v.toFixed(1)) + '%' : rsTick(v, m.unit, div, m.cur, ts); } },
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
// ─── The scorecard reads on its OWN axes (SAB, Aug 11 2026) ───────────────────
// This block used to be hard-wired to the quarterly view and to whatever vintage the pane's
// picker had selected. Both were wrong for what it is: a per-print scorecard is a different
// question from the blocks above it — "how did the year land" is asked annually, and "how did
// the print land against the Street as it stood in April" is asked of a specific file, not of
// whatever the reader last picked upstairs. So it carries its own Quarterly/Annual toggle and
// its own snapshot picker, and neither one touches the rest of the pane.
function rsSurpViewName(){
  var st = rsSurpSt(), d = _rs.data;
  var n = st.view || (d.views.q ? 'q' : 'y');
  return d.views[n] ? n : (d.views.q ? 'q' : 'y');
}
function rsSurpView(){ return _rs.data.views[rsSurpViewName()]; }
// Growth inside this block is always over ONE year: four quarters in the quarterly view, one
// year in the annual one. It never follows a block's YoY/QoQ pill — that belongs to that block.
function rsSurpLag(){ return rsSurpViewName() === 'q' ? 4 : 1; }
// A series for the scorecard, resolved through ITS OWN vintage selection rather than the
// pane's. `m.summit` / `m.cons` are the arrays rsApplyVintage rewrote for the pane, so reading
// them here would silently inherit the upstairs pick; rsSeriesFor resolves from the matrix
// without mutating anything, falling back to the hand-authored flats (`_flat_*`) exactly as
// the pane does. `mkey` is needed because the matrix is keyed by metric, not by object.
// Guidance enters the comparison as ONE number — a band cannot be scored as a band — and which
// number that is follows the block's Low/Mid/High toggle rather than being fixed at the mid.
function rsSrcLabel(s){ return s === 'guide' ? 'Guidance (' + rsGptName(rsSurpSt().gpt) + ')' : RS_SRC_LABEL[s]; }
function rsSrcShort(s){ return s === 'guide' ? 'guidance ' + rsGptName(rsSurpSt().gpt) : RS_SRC_SHORT[s]; }
function rsSrcArr(m, key, mkey){
  if (key === 'guide'){
    var gpt = rsSurpSt().gpt;
    return m.guideLo ? m.periods.map(function(_, i){ return rsGuideAt(m, i, gpt); }) : null;
  }
  if (key === 'act') return m.act || null;
  var mode = rsSurpSt().vint;
  if (mkey && mode && _rs.data && _rs.data.estMatrix){
    var s = rsSeriesFor(rsSurpViewName(), m, mkey, key, mode);
    if (s) return s;
    return m['_flat_' + key] || m[key] || null;
  }
  return m[key] || null;
}
function rsSrcHas(m, key, mkey){ var a = rsSrcArr(m, key, mkey); return !!a && a.some(function(v){ return v != null; }); }
// A pair is offerable only where the two series overlap ON A REPORTED PERIOD. The block is
// "Actuals vs Estimates" and its base defaults to the actual, so an overlap that exists only in
// the forward horizon — a consensus and a company guide for the same future quarter, say — is not
// a surprise anyone can score, and offering it puts a metric in the dropdown that draws an empty
// chart. DHR is the dataset that surfaced this: it guides 3Q26 core growth and carries a Street
// number for the same quarter, and nothing else pairs anywhere, so the whole block rendered with
// one option and no data. Requiring an actual also makes `rsSurpGroups()` return empty for a
// ticker with no scoreable history at all, which drops the block entirely (rule 6 — show nothing
// rather than something broken) instead of shipping a blank canvas.
function rsSurpPairOk(m, a, b, mkey){
  var A = rsSrcArr(m, a, mkey), B = rsSrcArr(m, b, mkey);
  if (!A || !B) return false;
  var act = m.act || [];
  return m.periods.some(function(_, i){ return A[i] != null && B[i] != null && act[i] != null; });
}
// A metric qualifies when ANY two of its series overlap — not just actual-vs-Summit.
// Deliberately independent of the current base/comparator choice, so changing the
// comparison never makes the metric disappear from the dropdown mid-session.
function rsSurpGroups(){
  var v = rsSurpView(), out = [];
  if (!v) return out;
  v.sections.forEach(function(cfg){
    rsSecGroups(cfg).forEach(function(g){
      var keys = g.keys.filter(function(k){
        var m = v.metrics[k]; if (!m) return false;
        var srcs = RS_SRCS.filter(function(s){ return rsSrcHas(m, s, k); });
        for (var i = 0; i < srcs.length; i++)
          for (var j = i + 1; j < srcs.length; j++)
            if (rsSurpPairOk(m, srcs[i], srcs[j], k)) return true;
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
function rsPaneEl(id){
  var root = _rs.wrap && _rs.wrap.isConnected ? _rs.wrap : document;
  return root.querySelector('#' + id);
}
function rsSurpEl(id){ return rsPaneEl(id); }
function rsSurpSt(){
  if (!_rs.surp) _rs.surp = { metric: null, win: null, yr: null, tbl: false, mode: 'pct', chart: null,
    view: null, vint: 'preprint', gpt: 'mid',
    base: 'act', cmp: { summit: true, cons: true, guide: false } };
  return _rs.surp;
}
// Comparators actually drawn: checked, present on this metric, and not the base itself.
function rsSurpCmps(m){
  var st = rsSurpSt();
  return RS_SRCS.filter(function(s){ return s !== st.base && st.cmp[s] && rsSurpPairOk(m, st.base, s, st.metric); });
}
function rsSurpM(){
  var st = rsSurpSt();
  var all = rsSurpGroups().reduce(function(a, g){ return a.concat(g.keys); }, []);
  if (!st.metric || all.indexOf(st.metric) < 0) st.metric = all[0];
  return st.metric ? rsSurpView().metrics[st.metric] : null;
}
// Last period with a reported actual — the surprise story ends there.
function rsSurpLr(m){
  // Follows the BASE series, not always the actual: comparing Summit against consensus is a
  // story about forward periods, and capping at the last print would hide all of them.
  var st = rsSurpSt();
  var a = rsSrcArr(m, st.base, st.metric) || m.act || [], lr = 0;
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
// A file that post-dates every print has nothing to score, and it must SAY so. Rendering '' was
// worse than useless: rsRerenderSurp assigns to host.outerHTML, so an empty string deletes the
// block from the DOM with no host left to render back into — the scorecard was gone until the
// pane was rebuilt. The shell (and its pickers) always renders; only the contents go.
function rsSurpEmptyHtml(reason){
  var st = rsSurpSt();
  var h = '<div class="rs-block" data-rssurp>';
  h += '<div class="rs-block-top"><div class="rs-block-h">Actuals vs Estimates</div>' +
    '<div class="rs-views">' + Object.keys(_rs.data.views).map(function(vn){
      return '<button type="button" class="rs-view' + (rsSurpViewName() === vn ? ' active' : '') +
        '" data-rssurpview="' + vn + '">' + esc(_rs.data.views[vn].label) + '</button>';
    }).join('') + '</div></div>';
  var vsel = rsVintSelHtml(st.vint, 'surp', 'Estimates as of', st.vsrc);
  if (vsel) h += '<div class="rs-surp-ctl rs-surp-vint">' + vsel + '</div>';
  h += '<div class="ave-leg"><span class="rs-noguide">⚑ Nothing to score</span>' +
    '<span class="tech-leg-i">' + esc(reason) + '</span></div>';
  return h + '</div>';
}
function rsSurpBlockHtml(){
  var m = rsSurpM(), st = rsSurpSt();
  if (!m){
    // The only way every metric drops out is a vintage that pre- or post-dates the whole history.
    var v0 = rsVintFor('summit', st.vint) || rsVintFor('cons', st.vint);
    return rsSurpEmptyHtml(v0
      ? 'The ' + rsVintDay(v0.id) + ' file was saved after the last print, so it holds forward periods only — there is no estimate in it for anything that has already reported. Pick an earlier file.'
      : 'No estimate in the selected snapshot overlaps a reported period on this view.');
  }
  var sv = rsSurpView();
  var h = '<div class="rs-block" data-rssurp>';
  h += '<div class="rs-block-top"><div class="rs-block-h">Actuals vs Estimates</div>' +
    '<select class="rs-msel rs-ssel" aria-label="Metric">' + rsSurpGroups().map(function(g){
      return '<optgroup label="' + esc(g.label) + '">' + g.keys.map(function(k){
        return '<option value="' + k + '"' + (k === st.metric ? ' selected' : '') + '>' + esc(sv.metrics[k].label) + '</option>';
      }).join('') + '</optgroup>';
    }).join('') + '</select>' +
    // This block's OWN period axis — nothing here follows the blocks above.
    '<div class="rs-views">' + Object.keys(_rs.data.views).map(function(vn){
      return '<button type="button" class="rs-view' + (rsSurpViewName() === vn ? ' active' : '') +
        '" data-rssurpview="' + vn + '">' + esc(_rs.data.views[vn].label) + '</button>';
    }).join('') + '</div>' +
    '<div class="rs-views" id="rsSurpMode"></div></div>';
  // …and its own snapshot. Scoring the 2Q26 print against the Street as it stood on Apr 30 is
  // a different question from scoring it against the last file before the print, and neither
  // is the question the blocks upstairs are set to.
  var vsel = rsVintSelHtml(st.vint, 'surp', 'Estimates as of', st.vsrc);
  if (vsel) h += '<div class="rs-surp-ctl rs-surp-vint">' + vsel + '</div>';
  // Base + comparators: any combination of the four series. The base is what gets judged
  // (default the actual); every checked comparator becomes its own bar per period.
  var cmps = rsSurpCmps(m);
  h += '<div class="rs-surp-ctl"><span class="rs-quick-l">Compare</span>' +
    '<select class="rs-bsel" aria-label="Base series">' + RS_SRCS.filter(function(s){ return rsSrcHas(m, s, st.metric); }).map(function(s){
      return '<option value="' + s + '"' + (s === st.base ? ' selected' : '') + '>' + esc(rsSrcLabel(s)) + '</option>';
    }).join('') + '</select>' +
    '<span class="rs-quick-l">against</span>' +
    RS_SRCS.filter(function(s){ return s !== st.base; }).map(function(s){
      var avail = rsSurpPairOk(m, st.base, s, st.metric);
      var on = avail && !!st.cmp[s];
      return '<button type="button" class="rs-cmp' + (on ? ' on' : '') + (avail ? '' : ' na') + '" data-rssurpcmp="' + s + '"' +
        (avail ? '' : ' disabled title="' + esc(rsSrcLabel(s)) + ' has no overlapping period with the base on this line"') + '>' +
        '<span class="ave-leg-act" style="background:' + RS_SRC_COLOR[s] + '"></span>' + esc(rsSrcLabel(s)) + '</button>';
    }).join('') +
    // Which end of the band the guide is scored at — shown only when guidance is actually in
    // the comparison, because a control that changes nothing on screen is noise. Here it moves
    // the CHART as well as the table: the guide enters as a single number either way.
    rsGptHtml('rssurpgpt', st.gpt,
      rsGuideRanged(m) && (st.base === 'guide' || cmps.indexOf('guide') >= 0), 'at') +
  '</div>';
  h += '<div class="ave-leg"><span class="tech-leg-i"><span class="ave-leg-act" style="background:' + RS_GREEN + '"></span>' + esc(rsSrcLabel(st.base)) + ' came in above</span>' +
    '<span class="tech-leg-i"><span class="ave-leg-act" style="background:' + RS_RED + '"></span>came in below</span>' +
    '<span class="tech-leg-i" style="margin-left:auto">' +
      (cmps.length
        ? 'bar outline = which series it is measured against' +
          (cmps.length > 1 ? ' · labels stack per period in the order of the chips' : '') +
          ' · drag to zoom, double-click to reset'
        // Distinguish "you unchecked everything" from "the file you picked cannot answer this".
        // Both used to read "pick at least one series", which on a post-print file is advice the
        // reader cannot act on — every chip is struck through.
        : (st.vint !== 'preprint' && RS_SRCS.every(function(s){ return s === st.base || !rsSurpPairOk(m, st.base, s, st.metric); })
            ? 'the selected snapshot has no estimate for any period that has already reported on this line — pick an earlier file'
            : 'pick at least one series to compare against')) +
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
  var baseArr = rsSrcArr(m, st.base, st.metric) || [];
  var cmps = rsSurpCmps(m);
  // One {pcts, dols} pair per comparator, over the selected window.
  var series = cmps.map(function(s){
    var A = rsSrcArr(m, s, st.metric) || [], pcts = [], dols = [];
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
  if (tEl) tEl.innerHTML = esc(m.label) + ' — ' + esc(rsSrcLabel(st.base)) + ' vs ' +
    (cmps.length ? esc(cmps.map(function(s){ return rsSrcShort(s); }).join(' · ')) : '<i>nothing selected</i>') +
    ' <span>(' + (pctMode ? '%' : esc(unitLbl)) + ' per period · hover for the underlying values)</span>';

  st.chart = rsNewChart(el, {
    type: 'bar',
    data: { labels: m.periods.slice(lo, hi + 1), datasets: series.map(function(s){
      return { label: rsSrcLabel(s.src),
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
            var A = rsSrcArr(m, sr.src, st.metric) || [];
            return [
              rsSrcLabel(st.base) + ': ' + rsFmt(m, baseArr[i]),
              rsSrcLabel(sr.src) + ': ' + rsFmt(m, A[i]),
              s == null ? 'Difference: —' : 'Difference: ' + (s >= 0 ? '+' : '−') + Math.abs(s).toFixed(1) + '% · ' + rsFmtD(m, d)
            ];
          }
        } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { position: 'right', grid: { color: 'rgba(0,0,0,0.05)' },
          min: st.yr ? st.yr[0] : undefined, max: st.yr ? st.yr[1] : undefined,
          ticks: { font: { size: 11 },
          callback: function(v, i, ts){
            if (pctMode) return (v < 0 ? '−' : '') + Math.abs(v).toFixed(rsTickDec(ts)) + '%';
            return rsTick(v, m.unit, div, rsCur(m), ts);
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
  // Growth is always over ONE YEAR here — four quarters in the quarterly view, one year in
  // the annual one — and independent of any block's YoY/QoQ pill, which belongs to that block.
  var lag = rsSurpLag();
  function g(arr, base, i){ if (i - lag < 0) return null; var a = arr[i], b = base[i - lag]; if (a == null || b == null || !b) return null; return (a - b) / Math.abs(b) * 100; }
  function gd(arr, base, i){ if (i - lag < 0) return null; var a = arr[i], b = base[i - lag]; if (a == null || b == null) return null; return a - b; }
  function pctDollar(p, d){
    if (p == null) return '<span class="rs-ft-nil">—</span>';
    return rsPctHtml(p, dec) + ' <span class="rs-ft-dim">· ' + rsFmtD(m, d) + '</span>';
  }
  function sumGrowth(fn){ var a = []; idx.forEach(function(i){ var v = fn(i); if (v != null) a.push(v); }); return a.length ? 'avg ' + sgn(avg(a)) : ''; }
  function sumCagr(){
    var first = null, last = null, fi = null, li = null;
    idx.forEach(function(i){ var v = m.act[i]; if (v != null){ if (first == null){ first = v; fi = i; } last = v; li = i; } });
    if (first == null || li === fi || first <= 0 || last <= 0) return '';
    var years = (li - fi) / lag;
    return years > 0 ? 'CAGR ' + sgn((Math.pow(last / first, 1 / years) - 1) * 100) : '';
  }
  var st = rsSurpSt(), baseArr = rsSrcArr(m, st.base, st.metric) || [], cmps = rsSurpCmps(m);
  function sumSurprise(src){
    var A = rsSrcArr(m, src, st.metric) || [], pcts = [], dols2 = [], above = 0, below = 0;
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

  var h = '<div class="rs-ft-cap">' + (m.unit === 'eps' ? rsCurName() + ' per share' : (rsCurName() + (div === 1000 ? ' billions' : ' millions'))) + ' · difference = (' + esc(rsSrcShort(st.base)) + ' − comparator) ÷ |comparator| · ▲/green = ' + esc(rsSrcShort(st.base)) + ' came in above · the right column summarizes the selected range</div>';
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

  // The guidance row carries the Low/Mid/High pills, exactly like the period table upstairs.
  // The difference here — and it is the reason this one is wired to a full re-render rather
  // than a table repaint — is that in this block the guide is a COMPARATOR: moving the end
  // moves the bars, the labels on them, the tooltip and the Range record, not just a row of
  // numbers. So the whole block is rebuilt, and the chart follows the pick.
  var gptRanged = rsGuideRanged(m);
  function lbl(s){ return rsSrcLabel(s) + (s === 'guide' && gptRanged ? rsGptMiniHtml('rssurpgpt', st.gpt) : ''); }

  // Base first, then one value row + one difference row per comparator. Growth rows always
  // measure against the ACTUAL a year back — an estimate's growth is only meaningful off a
  // reported base — so they are skipped when the base is not the actual.
  h += row(lbl(st.base), function(i){ return baseArr[i] == null ? '<span class="rs-ft-nil">—</span>' : '<b>' + num(baseArr[i]) + '</b>'; }, 'main nb', sumCagr());
  if (st.base === 'act')
    h += row('YoY growth', function(i){ return pctDollar(g(m.act, m.act, i), gd(m.act, m.act, i)); }, 'sub',
      sumGrowth(function(i){ return g(m.act, m.act, i); }));
  cmps.forEach(function(src){
    var A = rsSrcArr(m, src, st.metric) || [];
    h += row(lbl(src), function(i){ return num(A[i]); }, 'main nb', '');
    if (m.act)
      h += row('YoY growth', function(i){ return pctDollar(g(A, m.act, i), gd(A, m.act, i)); }, 'sub nb',
        sumGrowth(function(i){ return g(A, m.act, i); }));
    h += row('vs ' + rsSrcShort(src), function(i){
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

// ─── Road to the print — ONE period, EVERY snapshot (SAB, Aug 11 2026) ────────
// Every other chart in Results puts periods on the x-axis and asks "how big was each one".
// This one turns that ninety degrees: pick a single quarter or fiscal year, put the SNAPSHOT
// DATES on the x-axis, and watch the two forecasts walk toward the number that eventually
// printed — with the actual and the company's own guidance drawn as flat references across
// the whole walk.
//
// The question it answers is the one a track record is actually made of, and it is not the
// one the scorecard above answers. The scorecard says "the print beat consensus by 1.4%".
// This says WHEN that gap opened: whether we were early and the Street came to us, whether
// we drifted onto the Street's number in the last file before the print, and where both of
// us sat relative to the range the company itself had signed up for. A model that is right
// on the day and wrong for six months before it is a different model from one that held its
// number — and only this view can tell them apart.
//
// ⚠ THE LAST READ IS NOT THE DAY BEFORE. The x-axis is the archived snapshots, and Bloomberg
// exports around each print, so the right-most point is the last FILE before the print, not
// the consensus the morning of it. On UBER's 2Q26 that is Jul 31 against an Aug 5 print —
// five days, and the days that move most. The gap is named on screen rather than papered
// over; when a day-before BBG pull lands in the archive it becomes another vintage and this
// chart picks it up with no code change (SAB: "va a ser una parte muy importante").
function rsConvSt(){
  if (!_rs.conv) _rs.conv = { metric: null, view: null, period: null, mode: 'level',
    base: 'act', unit: 'pct', gpt: 'mid', yr: null, chart: null, tbl: false, hidden: {} };
  return _rs.conv;
}
function rsConvViewName(){
  var st = rsConvSt(), d = _rs.data;
  var n = st.view || (d.views.q ? 'q' : 'y');
  return d.views[n] ? n : (d.views.q ? 'q' : 'y');
}
function rsConvView(){ return _rs.data.views[rsConvViewName()]; }
// Every archived snapshot across both sources, oldest first. The two keep separate calendars
// (Bloomberg around each print, the model when the analyst saves it), so the axis is their
// UNION and each line simply has holes where its own archive has no file that day.
function rsAllVints(){
  var seen = {}, out = [];
  ['summit', 'cons'].forEach(function(src){
    var mx = rsMatrix(src); if (!mx) return;
    (mx.vintages || []).forEach(function(v){ if (!seen[v.id]){ seen[v.id] = 1; out.push(v); } });
  });
  return out.sort(function(a, b){ return a.id < b.id ? -1 : 1; });
}
function rsConvCells(src, view, mkey){
  var mx = rsMatrix(src); if (!mx) return null;
  return (mx[view] || {})[mkey] || null;
}
function rsConvHasM(view, mkey){
  return ['summit', 'cons'].some(function(src){
    var c = rsConvCells(src, view, mkey);
    return !!c && Object.keys(c).length > 0;
  });
}
function rsConvGroups(){
  var v = rsConvView(), view = rsConvViewName(), out = [];
  if (!v) return out;
  v.sections.forEach(function(cfg){
    rsSecGroups(cfg).forEach(function(g){
      var keys = g.keys.filter(function(k){ return v.metrics[k] && rsConvHasM(view, k); });
      if (keys.length) out.push({ label: g.label, keys: keys });
    });
  });
  return out;
}
function rsConvM(){
  var st = rsConvSt();
  var all = rsConvGroups().reduce(function(a, g){ return a.concat(g.keys); }, []);
  if (!st.metric || all.indexOf(st.metric) < 0) st.metric = all[0] || null;
  return st.metric ? rsConvView().metrics[st.metric] : null;
}
// Only periods some snapshot actually forecast. Offering a period no archive ever covered
// would open an empty chart and leave the reader deciding whether that is a bug.
function rsConvPeriodIdx(m, mkey){
  var view = rsConvViewName(), out = [];
  m.periods.forEach(function(p, i){
    var any = ['summit', 'cons'].some(function(src){
      var c = rsConvCells(src, view, mkey); if (!c) return false;
      return Object.keys(c).some(function(vid){ return c[vid][p] != null; });
    });
    if (any) out.push(i);
  });
  return out;
}
// Default to the most recent period that has ALREADY PRINTED — the walk you can score,
// because it is the only kind with an actual at the end of it.
function rsConvPi(m, mkey){
  var st = rsConvSt(), avail = rsConvPeriodIdx(m, mkey);
  if (!avail.length) return -1;
  var i = st.period == null ? -1 : m.periods.indexOf(st.period);
  if (i >= 0 && avail.indexOf(i) >= 0) return i;
  var best = avail[avail.length - 1];
  for (var j = avail.length - 1; j >= 0; j--) if (m.act[avail[j]] != null){ best = avail[j]; break; }
  st.period = m.periods[best];
  return best;
}
// The snapshots that were still FORECASTING this period, and the first one that already knew
// it. A snapshot taken after the print is not a forecast of it — it is a transcription of the
// result, and plotting it would draw a convergence that never happened.
function rsConvVints(pi, m, mkey){
  var view = rsConvViewName(), po = rsOrdIn(view, m.periods[pi]);
  var pre = [], knew = null;
  rsAllVints().forEach(function(v){
    var la = v.lastActual && v.lastActual[view];
    var lo = la == null ? -Infinity : rsOrdIn(view, la);
    if (po == null || lo < po) pre.push(v);
    else if (!knew) knew = v;
  });
  // ⚠ Drop the LEADING snapshots that carry no read of this period at all. Bloomberg's
  // workbook only ever holds four forward quarters (`fq+1…fq+4`), so for a 2Q26 walk the
  // 2023 and 2024 files are simply silent — and plotting them stretches the axis across
  // three empty years, squeezing the walk that matters into the last inch of the chart.
  // Only the LEADING run is cut: a hole in the middle is a real gap in an archive and stays
  // visible as one.
  var first = -1;
  for (var i = 0; i < pre.length; i++){
    var any = ['summit', 'cons'].some(function(src){
      var c = rsConvCells(src, view, mkey);
      return !!c && c[pre[i].id] && c[pre[i].id][m.periods[pi]] != null;
    });
    if (any){ first = i; break; }
  }
  return { pre: first < 0 ? [] : pre.slice(first), knew: knew };
}
function rsConvSeries(src, mkey, m, pi, vints){
  var c = rsConvCells(src, rsConvViewName(), mkey); if (!c) return null;
  var p = m.periods[pi];
  return vints.map(function(v){ var row = c[v.id]; return (row && row[p] != null) ? row[p] : null; });
}
function rsConvIsDist(){ return rsConvSt().mode === 'dist'; }
function rsConvIsPct(){ return rsConvIsDist() && rsConvSt().unit === 'pct'; }
// What the distance is measured against, and whether it exists on this period.
function rsConvBase(m, pi){
  var st = rsConvSt();
  if (st.base === 'guide') return rsGuideAt(m, pi, st.gpt);
  return m.act ? m.act[pi] : null;
}
function rsConvDist(v, base){
  if (v == null || base == null) return null;
  return rsConvIsPct() ? (base === 0 ? null : (v - base) / Math.abs(base) * 100) : (v - base);
}

// The OUTCOME line, labelled. The whole chart is a walk toward one number, so that number has to
// be the loudest thing on it — as a thin dotted rule it read as chart furniture, and the eye had
// to hunt the right axis to find out what the lines were converging on. Now it carries its own
// value at the right end (SAB, Aug 11 2026). Reads `options.plugins.rsConvRef = { v, text, color }`,
// where `v` is an axis value — so it works in Distance mode too, where the reference is zero.
var rsConvRef = {
  id: 'rsConvRef',
  afterDatasetsDraw: function(chart, args, opts){
    if (!opts || opts.v == null || !opts.text) return;
    var area = chart.chartArea, ctx = chart.ctx;
    var y = chart.scales.y.getPixelForValue(opts.v);
    if (y == null || isNaN(y) || y < area.top - 2 || y > area.bottom + 2) return;
    ctx.save();
    ctx.font = '800 10px Inter, system-ui, sans-serif';
    var pad = 8, w = ctx.measureText(opts.text).width;
    // LEFT end of the plot, not the right. The walk starts far from its target and ends on it,
    // so the right end of a reference line is exactly where the lines arrive — the label sat on
    // the final Summit point every time. The left end is clear in both modes, and the right side
    // is already spoken for by the y-axis and the "last read" marker.
    var x = area.left + 4;
    // Above the line by default; below it when the line is hard against the top of the plot,
    // which is exactly where a beat puts it.
    var top = y - 21;
    if (top < area.top + 2) top = y + 5;
    ctx.fillStyle = opts.color || RS_ACT;
    rsRR(ctx, x, top, w + pad * 2, 16, 8); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(opts.text, x + pad, top + 8);
    ctx.restore();
  }
};
// A dashed marker on the last pre-print snapshot, with the size of the blind spot on it.
// Reads `options.plugins.rsConvLast = { at, label }`.
var rsConvLast = {
  id: 'rsConvLast',
  afterDatasetsDraw: function(chart, args, opts){
    var at = opts && opts.at; if (at == null || at < 0) return;
    var x = chart.scales.x, area = chart.chartArea, ctx = chart.ctx;
    var px = x.getPixelForTick(at);
    if (px == null || isNaN(px)) return;
    ctx.save();
    ctx.strokeStyle = 'rgba(192,57,43,0.45)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(px, area.top); ctx.lineTo(px, area.bottom); ctx.stroke();
    ctx.setLineDash([]);
    var label = opts.label || 'last read before the print', pad = 7;
    ctx.font = '700 9px Inter, system-ui, sans-serif';
    var w = ctx.measureText(label).width;
    // Anchored to the BOTTOM of its rule: the top-right corner belongs to the Reported label,
    // and a beat puts that line hard against the top of the plot, right where this used to sit.
    var bx = Math.min(px + 6, area.right - w - pad * 2 - 2), by = area.bottom - 21;
    ctx.fillStyle = 'rgba(192,57,43,0.90)'; rsRR(ctx, bx, by, w + pad * 2, 15, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(label, bx + pad, by + 8);
    ctx.restore();
  }
};

function rsConvHeadHtml(m, pi){
  var st = rsConvSt(), nv = pi < 0 ? 0 : rsConvVints(pi, m, st.metric).pre.length;
  var open = st.tbl === true;
  return '<span class="rs-collap-ic">' + (open ? '▾' : '▸') + '</span>Snapshot detail' +
    '<span class="rs-collap-sub">' + (open ? 'hide' : 'show') + ' · ' + (pi < 0 ? '—' : esc(m.periods[pi])) +
    ', ' + nv + ' snapshot' + (nv === 1 ? '' : 's') + ' before the print</span>';
}
function rsConvBlockHtml(){
  // A dataset opts out of "Road to the print" with `conv: false`, the same way it opts out of the
  // surprise scorecard with `surprise: false`. The per-segment datasets js/segments.js composes
  // carry the vintage matrix (so the picker works) but sit inside a Top Line section that is
  // about size and growth — block C there would be a second copy of what Evolution already shows.
  if (_rs.data && _rs.data.conv === false) return '';
  var d = _rs.data;
  if (!d || !d.estMatrix) return '';                 // no archive ⇒ no walk to draw
  var m = rsConvM();
  if (!m) return '';
  var st = rsConvSt(), mkey = st.metric, pi = rsConvPi(m, mkey);
  if (pi < 0) return '';
  var avail = rsConvPeriodIdx(m, mkey);
  var dist = rsConvIsDist(), hasGuide = !!(m.guideLo && m.guideLo[pi] != null);

  var h = '<div class="rs-block" data-rsconv>';
  h += '<div class="rs-block-top"><div class="rs-block-h">Road to the print</div>' +
    '<select class="rs-msel rs-csel" aria-label="Metric">' + rsConvGroups().map(function(g){
      return '<optgroup label="' + esc(g.label) + '">' + g.keys.map(function(k){
        return '<option value="' + k + '"' + (k === mkey ? ' selected' : '') + '>' + esc(rsConvView().metrics[k].label) + '</option>';
      }).join('') + '</optgroup>';
    }).join('') + '</select>' +
    // Its own period axis, and inside it the one period being walked. Both are this block's
    // alone — nothing here follows the blocks above or the scorecard.
    '<div class="rs-views">' + Object.keys(d.views).map(function(vn){
      return '<button type="button" class="rs-view' + (rsConvViewName() === vn ? ' active' : '') +
        '" data-rsconvview="' + vn + '">' + esc(d.views[vn].label) + '</button>';
    }).join('') + '</div>' +
    '<select class="rs-msel rs-cpsel" aria-label="Period">' + avail.slice().reverse().map(function(i){
      var reported = m.act[i] != null;
      return '<option value="' + esc(m.periods[i]) + '"' + (i === pi ? ' selected' : '') + '>' +
        esc(m.periods[i]) + (reported ? ' · reported' : ' · still forward') + '</option>';
    }).join('') + '</select></div>';

  // Row 2: how to read it. The level is the walk itself; "Distance" re-bases every point on
  // the outcome, which is the form the track-record question actually takes.
  var b = function(attr, val, on, label, title, dis){
    return '<button type="button" class="rs-view' + (on ? ' active' : '') + '" data-' + attr + '="' + val + '"' +
      (dis ? ' disabled' : '') + (title ? ' title="' + esc(title) + '"' : '') + '>' + label + '</button>';
  };
  var baseOk = rsConvBase(m, pi) != null;
  h += '<div class="rs-block-modes"><div class="rs-modes">' +
    '<div class="rs-views">' +
      b('rsconvmode', 'level', !dist, esc(rsLevelLabel(m)), 'What each snapshot said the number would be') +
      b('rsconvmode', 'dist', dist, 'Distance',
        baseOk ? 'Every snapshot re-based on the outcome — how far each read sat from it'
               : 'Nothing to measure against on this period yet', !baseOk) +
    '</div>';
  if (dist){
    h += '<div class="rs-views">' +
      b('rsconvbase', 'act', st.base === 'act', 'vs Actual', 'Distance from the reported figure',
        !(m.act && m.act[pi] != null)) +
      b('rsconvbase', 'guide', st.base === 'guide', 'vs Guidance',
        'Distance from the company’s own guided range', !hasGuide) + '</div>';
    h += '<div class="rs-views">' +
      b('rsconvunit', 'pct', rsConvIsPct(), '%') +
      b('rsconvunit', 'amt', !rsConvIsPct(), 'Amount') + '</div>';
  }
  // Up here ONLY when it moves the chart — under Distance ▸ vs Guidance the chosen end IS the
  // zero line. In every other mode it just re-bases a table row, and it rides in that row's own
  // label instead (see rsConvTableRender), so it never holds space above a chart it cannot change.
  var gRanged = hasGuide && m.guideLo[pi] !== m.guideHi[pi];
  h += rsGptHtml('rsconvgpt', st.gpt, gRanged && dist && st.base === 'guide', 'Guide at');
  h += '</div></div>';
  h += '<div class="ave-leg" id="rsConvLegend">' + rsConvLegendHtml(m, pi) + '</div>';
  h += '<div class="ov-chart-card">' +
    '<div class="ov-chart-t" id="rsConvChartT"></div>' +
    '<div class="ov-chart-wrap ovs-tall"><canvas id="rsConvChart"></canvas></div>' +
  '</div>';
  h += '<div class="rs-collap" data-rsconvtbl>' +
    '<button type="button" class="rs-collap-h" data-rsconvtblb>' + rsConvHeadHtml(m, pi) + '</button>' +
    '<div class="rs-collap-b" id="rsConvTableBody"' + (st.tbl === true ? '' : ' hidden') + '>' +
      '<div class="rs-tablewrap" id="rsConvTable"></div>' +
    '</div></div>';
  h += '<div class="ov-foot" id="rsConvNote"></div>';
  h += '</div>';
  return h;
}
function rsConvLegendHtml(m, pi){
  var st = rsConvSt(), dist = rsConvIsDist();
  function chip(key, color, label, dash){
    var off = st.hidden[key];
    var sw = dash ? '<span class="rs-leg-dash" style="color:' + color + '"></span>'
                  : '<span class="rs-leg-line" style="background:' + color + '"></span>';
    return '<button type="button" class="rs-leg' + (off ? ' off' : '') + '" data-rsconvleg="' + key + '" title="Show / hide">' + sw + esc(label) + '</button>';
  }
  var h = '';
  if (rsMatrix('summit')) h += chip('summit', RS_SUMMIT, 'Summit model');
  if (rsMatrix('cons'))   h += chip('cons', RS_CONS, 'Consensus');
  var hasAct = !!(m.act && m.act[pi] != null);
  var hasGuide = !!(m.guideLo && m.guideLo[pi] != null);
  // In distance mode the base IS the zero line, so it is named there rather than chipped.
  if (!dist && hasAct)   h += chip('act', RS_ACT, 'Reported (' + m.periods[pi] + ')', true);
  if (!dist && hasGuide) h += chip('guide', 'rgba(62,90,130,0.7)', 'Guidance range', true);
  if (dist && hasGuide && st.base === 'act') h += chip('guide', 'rgba(62,90,130,0.7)', 'Guidance range', true);
  if (!hasAct)
    h += '<span class="rs-noguide" title="This period has not printed yet, so there is no outcome to walk toward — only the forecasts moving.">⚑ ' + esc(m.periods[pi]) + ' has not printed</span>';
  else if (!hasGuide)
    h += '<span class="rs-noguide" title="The company issued no numeric guidance for this line in this period, so there is no guided range to place the reads against.">⚑ No company guidance</span>';
  h += '<span class="tech-leg-i" style="margin-left:auto">x-axis = archived snapshots · click a chip to hide it</span>';
  return h;
}
function rsBuildConv(){
  var d = _rs.data;
  if (!d || !d.estMatrix) return;
  var m = rsConvM(); if (!m) return;
  var st = rsConvSt(), mkey = st.metric, pi = rsConvPi(m, mkey);
  if (pi < 0) return;
  var el = rsPaneEl('rsConvChart');
  if (!el || !el.offsetParent) return;
  if (st.chart){ st.chart.destroy(); st.chart = null; }

  var vv = rsConvVints(pi, m, mkey), vints = vv.pre;
  if (!vints.length) return;
  var period = m.periods[pi];
  var dist = rsConvIsDist(), pct = rsConvIsPct();
  var base = rsConvBase(m, pi);
  if (dist && base == null){ st.mode = 'level'; dist = false; pct = false; }
  var div = rsScaleOf(m);
  // Percent distances are already comparable, so they are never scaled; everything else is
  // in the metric's own units and scales with it.
  var sc = function(v){ return v == null ? null : (pct ? v : (m.unit === 'eps' ? v : v / div)); };
  var tr = function(v){ return dist ? rsConvDist(v, base) : v; };      // raw, unscaled
  var pt = function(arr){ return (arr || []).map(function(v){ return sc(tr(v)); }); };
  var flat = function(v){ return vints.map(function(){ return sc(tr(v)); }); };

  var datasets = [];
  var hasGuide = !!(m.guideLo && m.guideLo[pi] != null && m.guideHi && m.guideHi[pi] != null);
  var isPointGuide = hasGuide && m.guideLo[pi] === m.guideHi[pi];
  // Guidance first, so it sits behind everything: a band the forecasts walk inside of.
  // In distance mode it only makes sense against the ACTUAL — re-basing the guidance on its
  // own midpoint would draw a band around zero that says nothing.
  var showGuide = hasGuide && !st.hidden.guide && (!dist || st.base === 'act');
  if (showGuide){
    if (isPointGuide){
      datasets.push({ label: 'Guidance', data: flat(m.guideLo[pi]),
        borderColor: 'rgba(62,90,130,0.75)', borderWidth: 1.5, borderDash: [4, 3],
        pointRadius: 0, pointHitRadius: 6, fill: false, order: 20 });
    } else {
      datasets.push({ label: 'Guidance high', data: flat(m.guideHi[pi]),
        borderColor: 'rgba(62,90,130,0.45)', borderWidth: 1, borderDash: [4, 3],
        pointRadius: 0, pointHitRadius: 6, backgroundColor: RS_GUIDE, fill: '+1', order: 21 });
      datasets.push({ label: 'Guidance low', data: flat(m.guideLo[pi]),
        borderColor: 'rgba(62,90,130,0.45)', borderWidth: 1, borderDash: [4, 3],
        pointRadius: 0, pointHitRadius: 6, fill: false, order: 21 });
    }
  }
  // The outcome: a flat line in level mode, the zero line in distance mode. It is the target the
  // whole chart walks toward, so it is drawn HEAVY and dashed long — dashed because it is an
  // outcome rather than another forecast, heavy because everything else on screen is measured
  // against it. `refLabel` puts its value at the right end (rsConvRef).
  var refLabel = null;
  if (dist){
    datasets.push({ label: 'Zero', data: vints.map(function(){ return 0; }),
      borderColor: RS_ACT, borderWidth: 2.5, borderDash: [8, 4],
      pointRadius: 0, pointHitRadius: 0, fill: false, order: 19 });
    refLabel = { v: 0, text: st.base === 'guide' ? 'Guided · ' + rsFmt(m, base) : 'Reported · ' + rsFmt(m, base),
                 color: RS_ACT };
  } else if (m.act[pi] != null && !st.hidden.act){
    datasets.push({ label: 'Reported', data: flat(m.act[pi]),
      borderColor: RS_ACT, borderWidth: 2.5, borderDash: [8, 4],
      pointRadius: 0, pointHitRadius: 6, fill: false, order: 19 });
    refLabel = { v: sc(m.act[pi]), text: 'Reported · ' + rsFmt(m, m.act[pi]), color: RS_ACT };
  }
  var sSum = st.hidden.summit ? null : rsConvSeries('summit', mkey, m, pi, vints);
  var sCon = st.hidden.cons   ? null : rsConvSeries('cons',   mkey, m, pi, vints);
  if (sSum && sSum.some(function(v){ return v != null; })){
    datasets.push({ label: 'Summit model', data: pt(sSum), _raw: sSum,
      borderColor: RS_SUMMIT, backgroundColor: RS_SUMMIT, borderWidth: 2.5,
      pointRadius: 3.5, tension: 0, spanGaps: true, fill: false, order: 1 });
  }
  if (sCon && sCon.some(function(v){ return v != null; })){
    datasets.push({ label: 'Consensus', data: pt(sCon), _raw: sCon,
      borderColor: RS_CONS, backgroundColor: RS_CONS, borderWidth: 2.5, borderDash: [6, 4],
      pointRadius: 3, tension: 0, spanGaps: true, fill: false, order: 2 });
  }

  var cur = rsCur(m);
  var unitLbl = m.unit === 'eps'   ? cur
              : m.unit === 'pct'   ? '%'
              : m.unit === 'count' ? (m.unitLabel || 'count')
              : (div === 1000 ? cur + 'B' : cur + 'M');
  var gRanged = hasGuide && !isPointGuide;
  var gWord = st.base === 'guide' ? (gRanged ? 'guide ' + rsGptName(st.gpt) : 'guide') : 'actual';
  var baseName = st.base === 'guide'
    ? (gRanged ? 'the ' + rsGptName(st.gpt) + ' end of the guided range' : 'the guided figure')
    : 'the reported figure';
  var tEl = rsPaneEl('rsConvChartT');
  if (tEl) tEl.innerHTML = esc(m.label) + ' · ' + esc(period) + ' — ' +
    (dist
      ? 'distance from ' + baseName + ' <span>(' + (pct ? 'percent' : esc(unitLbl)) +
        ' per snapshot · zero is where ' + (st.base === 'guide' ? 'the company guided' : 'it landed') + ')</span>'
      : 'how the forecast moved <span>(' + esc(unitLbl) + ' per snapshot · each point is what that archived file said ' +
        esc(period) + ' would be)</span>');

  st.chart = rsNewChart(el, {
    type: 'line',
    data: { labels: vints.map(function(v){ return rsVintDay(v.id, v.label); }), datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        rsConvRef: refLabel || {},
        rsConvLast: { at: vints.length - 1, label: 'last read before the print' },
        tooltip: {
          callbacks: {
            title: function(items){
              var v = vints[items[0].dataIndex];
              var thru = v.lastActual && v.lastActual[rsConvViewName()];
              return rsVintDay(v.id, v.label) + (thru ? ' · knew through ' + thru : '');
            },
            label: function(ctx){
              var i = ctx.dataIndex, lbl = ctx.dataset.label;
              if (lbl === 'Zero') return null;
              // Reference lines quote the underlying figure, not the re-based zero.
              if (lbl === 'Reported') return 'Reported: ' + rsFmt(m, m.act[pi]);
              if (lbl === 'Guidance')      return 'Guidance: ' + rsFmt(m, m.guideLo[pi]);
              if (lbl === 'Guidance high') return 'Guidance: ' + rsFmt(m, m.guideLo[pi]) + ' – ' + rsFmt(m, m.guideHi[pi]);
              if (lbl === 'Guidance low')  return null;
              var raw = (ctx.dataset._raw || [])[i];
              if (raw == null) return lbl + ': — (no file in this archive that day)';
              var line = lbl + ': ' + rsFmt(m, raw);
              // Both readings on every hover: what the file said, and how far that sat from
              // where the period landed. The second is the point of the chart, and asking the
              // reader to switch modes to see it would hide it behind a click.
              var b2 = rsConvBase(m, pi);
              if (b2 != null){
                var dv = raw - b2, dp = b2 === 0 ? null : dv / Math.abs(b2) * 100;
                line += '  (' + (dp == null ? '' : (dp >= 0 ? '+' : '−') + Math.abs(dp).toFixed(1) + '% · ') +
                  rsFmtD(m, dv) + ' vs ' + gWord + ')';
              }
              return line;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, maxRotation: 0, autoSkipPadding: 12 } },
        y: { position: 'right', grid: { color: 'rgba(0,0,0,0.05)' },
          min: st.yr ? st.yr[0] : undefined, max: st.yr ? st.yr[1] : undefined,
          ticks: { font: { size: 11 }, callback: function(v, i, ts){
            if (pct) return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(Math.max(1, rsTickDec(ts))) + '%';
            return rsTick(v, m.unit, div, m.cur, ts);
          } } }
      }
    },
    plugins: [rsConvLast, rsConvRef]
  });

  // Vertical-only brush: the x-axis is a handful of archived dates, so a drag is a y-zoom.
  rsAttachBrush(el, st.chart, null,
    function(v1, v2){ rsConvSt().yr = [v1, v2]; rsBuildConv(); },
    function(){ rsConvSt().yr = null; rsBuildConv(); });

  rsConvTableRender(m, mkey, pi, vints, div);
  var root = _rs.wrap && _rs.wrap.isConnected ? _rs.wrap : document;
  var th = root.querySelector('[data-rsconvtblb]');
  if (th) th.innerHTML = rsConvHeadHtml(m, pi);
  var lg = rsPaneEl('rsConvLegend'); if (lg) lg.innerHTML = rsConvLegendHtml(m, pi);

  // The footnote names the blind spot rather than leaving the reader to assume the last point
  // is the morning of the print — see the block comment. `knew` is the first archived file
  // that already had the result, so the print happened between the two dates.
  var note = rsPaneEl('rsConvNote');
  if (note){
    var lastV = vints[vints.length - 1];
    var txt = 'Last archived read before the ' + period + ' print: ' + rsVintDay(lastV.id, lastV.label) + '.';
    if (vv.knew) txt += ' The next file, ' + rsVintDay(vv.knew.id, vv.knew.label) + ', already knew the result — so the print landed between those two dates, and nothing in the archive covers the days in between.';
    txt += ' A day-before Bloomberg pull would drop straight in here as one more snapshot.';
    note.textContent = txt;
  }
}
function rsConvTableRender(m, mkey, pi, vints, div){
  var el = rsPaneEl('rsConvTable'); if (!el) return;
  var st = rsConvSt(), period = m.periods[pi], gpt = st.gpt || 'mid';
  var act = m.act ? m.act[pi] : null;
  var gref = rsGuideAt(m, pi, gpt);
  var ranged = !!(gref != null && m.guideLo[pi] !== m.guideHi[pi]);
  var gname = ranged ? rsGptName(gpt) : 'guide';
  // One control per screen. The block's own row already carries the pills when the chart is
  // zeroed on the guide, and drawing them again down here would be the same state twice.
  var shown = false;
  function gptShown(){ var was = shown; shown = true; return was || (rsConvIsDist() && st.base === 'guide'); }
  function num(v){
    if (v == null) return '<span class="rs-ft-nil">—</span>';
    if (m.unit === 'eps') return Number(v).toFixed(2);
    if (m.unit === 'count') return Math.round(v).toLocaleString();
    return (v / div).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  function vs(v, b){
    if (v == null || b == null || !b) return '<span class="rs-ft-nil">—</span>';
    var d = v - b;
    return rsPctHtml(d / Math.abs(b) * 100) + ' <span class="rs-ft-dim">· ' + rsFmtD(m, d) + '</span>';
  }
  var unitCap = m.unit === 'eps'   ? (rsCurName(m) + ' per share')
              : m.unit === 'count' ? (m.unitLabel || 'count')
              : (rsCurName(m) + ' ' + (div === 1000 ? 'billions' : 'millions'));
  var h = '<div class="rs-ft-cap">' + esc(period) + ' · ' + unitCap +
    ' · columns are the archived snapshots that were still forecasting this period · “vs actual” is how far that file sat from where it landed' +
    (act == null ? ' (nothing yet — this period has not printed)' : '') +
    (ranged ? ' · “vs ' + rsGptName(gpt) + '” scores against the ' + rsGptName(gpt) + ' end of the guided range' : '') + '</div>';
  h += '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h"></th>';
  vints.forEach(function(v, i){
    h += '<th' + (i === vints.length - 1 ? ' class="rs-ft-este"' : '') + '>' + esc(rsVintDay(v.id, v.label)) +
      (i === vints.length - 1 ? '<br><span class="rs-ft-dim">last before print</span>' : '') + '</th>';
  });
  h += '<th class="rs-ft-s">First → last</th></tr></thead><tbody>';

  function block(label, arr){
    if (!arr || !arr.some(function(v){ return v != null; })) return '';
    var first = null, last = null;
    arr.forEach(function(v){ if (v != null){ if (first == null) first = v; last = v; } });
    var r = '<tr class="rs-ft-main rs-ft-nb"><td class="rs-ft-h">' + label + '</td>';
    arr.forEach(function(v, i){ r += '<td' + (i === arr.length - 1 ? ' class="rs-ft-este"' : '') + '><b>' + num(v) + '</b></td>'; });
    r += '<td class="rs-ft-s">' + rsRevHtml(m, first, last) + '</td></tr>';
    // Both comparisons, when both exist. "How far were we from the print" and "how far were we
    // from what the company had told the market" are different questions, and reading them off
    // the same column is the whole point of putting guidance on this chart.
    function sub(label, ref, last){
      if (ref == null) return '';
      var s = '<tr class="rs-ft-sub' + (last ? '' : ' rs-ft-nb') + '"><td class="rs-ft-h">' + label + '</td>';
      arr.forEach(function(v, i){ s += '<td' + (i === arr.length - 1 ? ' class="rs-ft-este"' : '') + '>' + vs(v, ref) + '</td>'; });
      return s + '<td class="rs-ft-s"></td></tr>';
    }
    r += sub('vs actual', act, gref == null);
    // The pills sit on the guidance row itself, and only on the FIRST such row — repeating them
    // once per source would be three copies of one setting arguing on the same screen.
    r += sub('vs ' + gname + (ranged && !gptShown() ? rsGptMiniHtml('rsconvgpt', gpt) : ''), gref, true);
    return r;
  }
  // Non-negotiable 2 (CHART_ENGINE_REFERENCE §0.2): the predicate that hides a series from the
  // chart must feed the table. rsBuildConv already nulls these on `st.hidden`; the table used to
  // call rsConvSeries straight and kept rendering a row for a line that was no longer drawn —
  // which is worse than no legend, because the reader trusts a number that is not on screen.
  if (!st.hidden.summit) h += block('Summit model', rsConvSeries('summit', mkey, m, pi, vints));
  if (!st.hidden.cons)   h += block('Consensus',    rsConvSeries('cons',   mkey, m, pi, vints));
  // The references, held flat across the walk, so a column can be read straight down.
  if (gref != null && !st.hidden.guide){
    h += '<tr class="rs-ft-main"><td class="rs-ft-h">Guidance</td>';
    vints.forEach(function(){
      if (!ranged){ h += '<td>' + num(m.guideLo[pi]) + '</td>'; return; }
      var lo2 = num(m.guideLo[pi]), hi2 = num(m.guideHi[pi]);      // mark the end being scored
      if (gpt === 'lo') lo2 = '<b>' + lo2 + '</b>'; else if (gpt === 'hi') hi2 = '<b>' + hi2 + '</b>';
      h += '<td>' + lo2 + '–' + hi2 + '</td>';
    });
    h += '<td class="rs-ft-s"></td></tr>';
  }
  if (act != null && !st.hidden.act){
    h += '<tr class="rs-ft-main"><td class="rs-ft-h">Reported</td>';
    vints.forEach(function(){ h += '<td><b>' + num(act) + '</b></td>'; });
    h += '<td class="rs-ft-s"></td></tr>';
  }
  h += '</tbody></table></div>';
  el.innerHTML = h;
}
// Re-render the whole block: which toggles exist (Distance, the base pair) depends on what
// the selected period actually has, so rebuilding the chart alone leaves stale controls.
function rsRerenderConv(pane){
  var host = (pane || document).querySelector('#rsConvHost');
  if (!host) return;
  host.innerHTML = rsConvBlockHtml();
  rsBuildConv();
}

// ─── Wiring ───────────────────────────────────────────────────────────────────

function rsBuildAll(){
  rsView().sections.forEach(function(s){ rsBuildChart(s.key); });
  rsBuildSurp();                      // the surprise scorecard at the foot of the pane
  rsBuildConv();                      // …and the one-period walk under it
}

function wireResults(pane){
  pane.onclick = (function(e){
    // Every reading control is scoped to ITS block: Quarterly/Annual, the level⇄growth pair,
    // YoY/QoQ and %/Amount. Each changes what the axis means, so that block's brushed y-range
    // and window are dropped rather than carried into a scale that no longer describes them,
    // and its control row is re-rendered because which groups exist depends on the mode.
    // ── Road to the print (its own block, its own everything) ──
    var cvt = e.target.closest('[data-rsconvtblb]');
    if (cvt){
      var cst0 = rsConvSt();
      cst0.tbl = cst0.tbl !== true;
      var cbody = pane.querySelector('#rsConvTableBody');
      if (cbody) cbody.hidden = cst0.tbl !== true;
      var cm0 = rsConvM();
      if (cm0) cvt.innerHTML = rsConvHeadHtml(cm0, rsConvPi(cm0, rsConvSt().metric));
      return;
    }
    var cvc = e.target.closest('[data-rsconvview], [data-rsconvmode], [data-rsconvbase], [data-rsconvunit], [data-rsconvgpt]');
    if (cvc && !cvc.disabled){
      var cst = rsConvSt();
      if (cvc.hasAttribute('data-rsconvgpt')) cst.gpt = cvc.getAttribute('data-rsconvgpt');
      if (cvc.hasAttribute('data-rsconvview')){
        cst.view = cvc.getAttribute('data-rsconvview');
        cst.metric = null;                       // the metric list and the period axis are per view
        cst.period = null;
      }
      if (cvc.hasAttribute('data-rsconvmode')) cst.mode = cvc.getAttribute('data-rsconvmode');
      if (cvc.hasAttribute('data-rsconvbase')) cst.base = cvc.getAttribute('data-rsconvbase');
      if (cvc.hasAttribute('data-rsconvunit')) cst.unit = cvc.getAttribute('data-rsconvunit');
      cst.yr = null;                             // the units on the axis changed
      rsRerenderConv(pane);
      return;
    }
    var cvl = e.target.closest('[data-rsconvleg]');
    if (cvl){
      var cst2 = rsConvSt(), ck = cvl.getAttribute('data-rsconvleg');
      cst2.hidden[ck] = !cst2.hidden[ck];
      rsBuildConv();
      return;
    }
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
    // The guidance end changes ONE ROW of the period table. Handled before the control-row
    // branch and on its own, so it repaints the table and nothing else: no chart teardown, no
    // lost brush, no flicker on a click that moved a single arithmetic base.
    var gp = e.target.closest('[data-rsgpt]');
    if (gp){
      var gblk = gp.closest('[data-rsblock]');
      if (!gblk) return;
      var gk = gblk.getAttribute('data-rsblock');
      rsSt(gk).gpt = gp.getAttribute('data-rsgpt');
      rsRenderTable(gk, rsMetric(gk));
      return;
    }
    var ctl = e.target.closest('[data-rsview], [data-rsmode], [data-rsgrow], [data-rsgunit], [data-rslab]');
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
      if (ctl.hasAttribute('data-rslab')) bst.labels = ctl.getAttribute('data-rslab') === '1';
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
    var sgp = e.target.closest('[data-rssurpgpt]');
    if (sgp){ rsSurpSt().gpt = sgp.getAttribute('data-rssurpgpt'); rsRerenderSurp(pane); return; }
    var svw = e.target.closest('[data-rssurpview]');
    if (svw){
      var sstV = rsSurpSt();
      sstV.view = svw.getAttribute('data-rssurpview');
      sstV.metric = null;               // the metric list is per view
      sstV.win = null;                  // and so is the period axis
      sstV.yr = null;
      rsRerenderSurp(pane);
      return;
    }
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
    // The vintage picker is two selects now — the reading, and (only when the reading needs one)
    // which file. Both carry `data-vscope`, so one handler serves the pane-wide copy and the
    // scorecard's own without either knowing about the other.
    if (e.target.classList.contains('rs-vsel') || e.target.classList.contains('rs-vsel2')){
      var vscope = e.target.getAttribute('data-vscope');
      var vmode = e.target.getAttribute('data-vpart') === 'mode';
      var vst = vscope === 'surp' ? rsSurpSt() : _rs;
      if (vmode){
        // Changing the READING lands on the newest thing it can show, and remembers which
        // archive is being browsed so select B knows which list to draw.
        var mv = e.target.value;
        vst.vsrc = (mv === 'summit' || mv === 'cons') ? mv : null;
        vst.vint = rsVintDefault(mv, vscope === 'surp' ? rsSurpViewName() : _rs.view);
      } else {
        vst.vint = e.target.value;
      }
      if (vscope === 'surp'){
        var ss = rsSurpSt();
        ss.metric = null;              // which metrics have overlapping series depends on the file
        ss.win = null;
        rsRerenderSurp(pane);
        return;
      }
      rsApplyVintage();                                // re-resolve summit/cons from the matrix
      _rs.sec = {};                                    // windows/metrics reset: the series changed
      // The row itself is re-rendered: select B appears, disappears or changes list with the mode.
      var tr = pane.querySelector('.rs-toprow'); if (tr) tr.outerHTML = rsTopRowHtml();
      var vn = pane.querySelector('#rsVintNote'); if (vn) vn.textContent = rsVintNote();
      var blocks = pane.querySelector('#rsBlocks');
      if (blocks) blocks.innerHTML = rsBlocksHtml();   // legend chips depend on what has data
      wireSliders(pane);
      rsBuildAll();
      return;
    }
    // (The scorecard's own snapshot picker is handled by the shared `data-vscope` branch above:
    // it resolves through rsSrcArr → rsSeriesFor without mutating anything, so it never disturbs
    // the pane-wide picker and vice versa.)
    if (e.target.classList.contains('rs-csel')){
      var cstM = rsConvSt();
      cstM.metric = e.target.value;
      cstM.period = null;              // which periods any archive covers is per metric
      cstM.yr = null;
      rsRerenderConv(pane);
      return;
    }
    if (e.target.classList.contains('rs-cpsel')){
      var cstP = rsConvSt();
      cstP.period = e.target.value;
      cstP.yr = null;
      rsRerenderConv(pane);
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
    if (_rs._active !== ticker){ _rs.view = rsDefaultView(d); _rs.growth = 'yoy'; _rs.sec = {}; _rs.vint = 'preprint';
                                 _rs.surp = null; _rs.conv = null; }
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

// ─── Projection curve — the WHOLE forecast, as one snapshot saw it ────────────
// (SAB, Aug 11 2026.) Every other chart in Estimates puts the model's saved snapshots on the
// x-axis and draws one line per fiscal year: "how did our view of FY2027 move". This is that
// chart turned ninety degrees — PERIODS on the x-axis, one line per SNAPSHOT — and it is the
// same `evolution` numbers, read the other way. Deliberately the same block and not the
// vintage matrix: two charts on one pane that disagree about a number is worse than one
// chart fewer, and the transpose of a table can never disagree with it.
//
// What it answers that the chart above cannot: whether a revision moved the LEVEL or the SHAPE.
// Five lines that fall parallel mean the model cut every year by the same proportion — a
// re-basing. Five lines that fan mean it changed the trajectory, which is a different claim
// about the business and usually a different thesis. On UBER's revenue the May snapshot did the
// first (a UK accounting change, ~$1B a quarter off reported revenue) and it is unmistakable
// here: the whole curve drops and keeps its slope.
//
// ONE snapshot at a time. The first version drew every snapshot at once as a ramp of lines, which
// is a different (and already-answered) question: the chart above this one is exactly "how did the
// view move across files". This block is the plain one — pick any archived file and see what it
// projected, in bars, the same way Results draws a period.
function rsCurveSt(){
  if (!_rs.curve) _rs.curve = { metric: null, vi: null, vi2: null, cmp: false,
    mode: 'usd', growUnit: 'pct', hidden: {}, yr: null, chart: null, tbl: false };
  return _rs.curve;
}
// The selected snapshot, defaulting to the newest — here the newest IS the right default: this
// pane is not scoring anything against a print, it is reading what a file says.
function rsCurveVi(){
  var ev = rsEvo(), st = rsCurveSt(), n = (ev.vintages || []).length;
  if (st.vi == null || st.vi < 0 || st.vi >= n) st.vi = n - 1;
  return st.vi;
}
// The comparison snapshot. Defaults to the one immediately BEFORE the selected file — "what
// changed at this save" is the question Compare gets opened for nine times out of ten.
function rsCurveVi2(){
  var ev = rsEvo(), st = rsCurveSt(), n = (ev.vintages || []).length, vi = rsCurveVi();
  if (st.vi2 == null || st.vi2 < 0 || st.vi2 >= n || st.vi2 === vi) st.vi2 = vi > 0 ? vi - 1 : Math.min(1, n - 1);
  return st.vi2;
}
function rsCurveCmp(){
  var ev = rsEvo();
  return !!(rsCurveSt().cmp && (ev.vintages || []).length > 1);
}
// The comparison file is drawn in a washed-out version of its series' own colour rather than a
// colour of its own: the reader is comparing two SNAPSHOTS of the same line, so the line has to
// stay recognisable and only its age should change.
var RS_CURVE_DIM = { act: 'rgba(30,39,51,0.30)', summit: 'rgba(37,99,235,0.32)', cons: 'rgba(124,134,148,0.38)' };
function rsCurveGroups(){
  var ev = rsEvo(), out = [];
  (ev.sections || []).forEach(function(cfg){
    (cfg.groups || []).forEach(function(g){ out.push({ label: g.label, keys: g.keys }); });
  });
  return out;
}
function rsCurveM(){
  var st = rsCurveSt();
  var all = rsCurveGroups().reduce(function(a, g){ return a.concat(g.keys); }, []);
  if (!st.metric || all.indexOf(st.metric) < 0) st.metric = all[0] || null;
  return st.metric ? rsEvo().metrics[st.metric] : null;
}
function rsCurveBasis(){ var mo = rsCurveSt().mode; return mo === 'usd' ? null : mo; }
function rsCurveAmt(){ var st = rsCurveSt(); return st.mode === 'grow' && st.growUnit === 'amt'; }
function rsCurveIsPct(){ return !!rsCurveBasis() && !rsCurveAmt(); }
// The selected snapshot's projection for one source, across every fiscal year on the axis —
// transformed by whichever mode is on. `act` is the reported figure, which belongs to the year
// rather than to any snapshot, and is only ever present where a year has closed.
function rsCurveSeries(m, src, vi){
  var ev = rsEvo(), basis = rsCurveBasis(), amt = rsCurveAmt();
  if (vi == null) vi = rsCurveVi();
  if (src === 'act'){
    return ev.years.map(function(y){
      return basis ? rsEvoActualPctAt(rsCurveSt().metric, m, y, basis, amt)
                   : rsEvoActual(rsCurveSt().metric, m, y);
    });
  }
  return ev.years.map(function(y, yi){
    if (!basis){ var a = m[src] ? m[src][yi] : null; return a ? a[vi] : null; }
    var p = rsEvoPctAt(m, src, yi, basis, amt);
    return p ? p[vi] : null;
  });
}
// The three bars per year, in the same order and the same colours Results uses, so a reader
// moving between the two panes is reading the same picture.
var RS_CURVE_SER = [
  { key: 'act',    label: 'Reported',  color: RS_ACT },
  { key: 'summit', label: 'Summit',    color: RS_SUMMIT },
  { key: 'cons',   label: 'Street',    color: RS_CONS }
];
function rsCurveHas(m, key){
  if (key === 'act') return true;
  return !!m[key];
}
function rsCurveHeadHtml(m){
  var ev = rsEvo(), st = rsCurveSt(), open = st.tbl === true;
  var v = ev.vintages[rsCurveVi()];
  return '<span class="rs-collap-ic">' + (open ? '▾' : '▸') + '</span>Projection detail' +
    '<span class="rs-collap-sub">' + (open ? 'hide' : 'show') + ' · ' + esc(v ? v.label : '—') +
    ', ' + ev.years.length + ' fiscal years</span>';
}
function rsCurveBlockHtml(){
  var ev = rsEvo();
  if (!ev || !ev.vintages || ev.vintages.length < 2) return '';   // one snapshot is not a curve to compare
  var m = rsCurveM();
  if (!m) return '';
  var st = rsCurveSt(), vi = rsCurveVi(), cmp = rsCurveCmp(), vi2 = cmp ? rsCurveVi2() : -1;
  var b = function(attr, val, on, label, title, dis){
    return '<button type="button" class="rs-view' + (on ? ' active' : '') + '" data-' + attr + '="' + val + '"' +
      (dis ? ' disabled' : '') + (title ? ' title="' + esc(title) + '"' : '') + '>' + label + '</button>';
  };
  var h = '<div class="rs-block" data-rscurve>';
  // Row 1: WHICH line, and WHICH file. That is the whole identity of this chart.
  h += '<div class="rs-block-top"><div class="rs-block-h">Projection by snapshot</div>' +
    '<select class="rs-msel rs-curvesel" aria-label="Metric">' + rsCurveGroups().map(function(g){
      return '<optgroup label="' + esc(g.label) + '">' + g.keys.map(function(k){
        return '<option value="' + k + '"' + (k === st.metric ? ' selected' : '') + '>' + esc(rsOptLabel(ev.metrics[k])) + '</option>';
      }).join('') + '</optgroup>';
    }).join('') + '</select>' +
    // NEWEST FIRST. The register is stored oldest-first because that is the order the files were
    // written in, but a list of dates gets read from the top, and the top of this one should be
    // the file you are most likely to want (SAB, Aug 11 2026). The option VALUE stays the stored
    // index, so nothing downstream has to know the list was reversed.
    rsCurveVselHtml('rs-curvevsel', vi, null) +
    '<button type="button" class="rs-view rs-curvecmpb' + (cmp ? ' active' : '') + '" data-rscurvecmp="1"' +
      (ev.vintages.length > 1 ? '' : ' disabled') +
      ' title="Put a second snapshot beside this one, to see what the save changed">' +
      (cmp ? '✕ Comparing' : '⇄ Compare') + '</button>' +
    // "vs" and its select wrap as ONE unit — orphaned at the end of the row above, the word
    // read as though the comparison had been dropped.
    (cmp ? '<span class="rs-curvevs"><span class="rs-quick-l">vs</span>' +
           rsCurveVselHtml('rs-curvevsel2', vi2, vi) + '</span>' : '') +
    '</div>';
  // Row 2: how to read it. Nothing else — this block has no window and no baseline.
  h += '<div class="rs-block-modes"><div class="rs-modes">' +
    '<div class="rs-views">' +
      b('rscurvemode', 'usd', st.mode === 'usd', esc(rsCurName(m) + (rsEvoScaleOf(m) === 1000 ? 'B' : 'M'))) +
      b('rscurvemode', 'grow', st.mode === 'grow', 'Growth', 'Year-over-year growth along the projection, as this file saw it') +
      (m.marginOf ? b('rscurvemode', 'margin', st.mode === 'margin', 'Margin %',
        'This file’s own numerator over its own denominator') : '') +
    '</div>' +
    (st.mode === 'grow' ? '<div class="rs-views">' +
      b('rscurvegunit', 'pct', !rsCurveAmt(), '%') +
      b('rscurvegunit', 'amt', rsCurveAmt(), 'Amount') + '</div>' : '') +
    '</div></div>';
  h += '<div class="ave-leg" id="rsCurveLegend">' + rsCurveLegendHtml(m) + '</div>';
  h += '<div class="ov-chart-card">' +
    '<div class="ov-chart-t" id="rsCurveChartT"></div>' +
    '<div class="ov-chart-wrap ovs-tall"><canvas id="rsCurveChart"></canvas></div>' +
  '</div>';
  h += '<div class="rs-collap" data-rscurvetbl>' +
    '<button type="button" class="rs-collap-h" data-rscurvetblb>' + rsCurveHeadHtml(m) + '</button>' +
    '<div class="rs-collap-b" id="rsCurveTableBody"' + (st.tbl === true ? '' : ' hidden') + '>' +
      '<div class="rs-tablewrap" id="rsCurveTable"></div>' +
    '</div></div>';
  h += '<div class="ov-foot" id="rsCurveNote"></div>';
  h += '</div>';
  return h;
}
// One snapshot dropdown, newest at the top. `exclude` drops the file already picked by the other
// select, so the two can never land on the same date and draw a comparison against itself.
function rsCurveVselHtml(cls, sel, exclude){
  var ev = rsEvo();
  var opts = ev.vintages.map(function(v, i){ return { i: i, v: v }; })
    .filter(function(o){ return o.i !== exclude; })
    .sort(function(a, b){ return b.i - a.i; });
  // The event loses its trailing "print" — "post-2Q26" is unambiguous next to a date, and the
  // six characters are what decided whether this row fits on one line or two.
  return '<select class="rs-msel ' + cls + '" aria-label="Snapshot">' + opts.map(function(o){
    var ev2 = o.v.event ? String(o.v.event).replace(/\s*print$/, '') : '';
    return '<option value="' + o.i + '"' + (o.i === sel ? ' selected' : '') + '>' + esc(o.v.label) +
      (ev2 ? ' · ' + esc(ev2) : '') + '</option>';
  }).join('') + '</select>';
}
function rsCurveLegendHtml(m){
  var st = rsCurveSt();
  var h = RS_CURVE_SER.filter(function(s){ return rsCurveHas(m, s.key); }).map(function(s){
    var arr = rsCurveSeries(m, s.key);
    if (!arr.some(function(v){ return v != null; })) return '';
    var off = st.hidden[s.key];
    return '<button type="button" class="rs-leg' + (off ? ' off' : '') + '" data-rscurveleg="' + s.key + '" title="Show / hide">' +
      '<span class="ave-leg-act" style="background:' + s.color + '"></span>' + s.label + '</button>';
  }).join('');
  var ya = rsCurveActYears(m);
  if (!ya.length)
    h += '<span class="rs-noguide" title="No fiscal year on this axis has closed yet, so there is nothing on the chart that is not a forecast.">⚑ No year has closed yet</span>';
  var ev = rsEvo();
  h += '<span class="tech-leg-i" style="margin-left:auto">' +
    (rsCurveCmp()
      ? 'solid = ' + esc(ev.vintages[rsCurveVi()].label) + ' · faded = ' + esc(ev.vintages[rsCurveVi2()].label)
      : 'what this one file projected') +
    ' · click a chip to hide it</span>';
  return h;
}
// Fiscal years on the axis that have actually landed, in the current mode.
function rsCurveActYears(m){
  var arr = rsCurveSeries(m, 'act'), ev = rsEvo(), out = [];
  arr.forEach(function(v, i){ if (v != null) out.push(ev.years[i]); });
  return out;
}
function rsBuildCurve(){
  var ev = rsEvo(); if (!ev) return;
  var m = rsCurveM(); if (!m) return;
  var st = rsCurveSt();
  var el = rsPaneEl('rsCurveChart') || document.getElementById('rsCurveChart');
  if (!el || !el.offsetParent) return;
  if (st.chart){ st.chart.destroy(); st.chart = null; }

  var vi = rsCurveVi(), pct = rsCurveIsPct(), amt = rsCurveAmt();
  var cmp = rsCurveCmp(), vi2 = cmp ? rsCurveVi2() : -1;
  var div = rsEvoScaleOf(m);
  var sc = function(v){ return v == null ? null : (pct ? v : v / div); };
  // `raw` holds the selected file, `raw2` the comparison one. The reported row is the same in
  // both — it belongs to the fiscal year, not to any snapshot — so it is never doubled.
  var raw = {}, raw2 = {};
  RS_CURVE_SER.forEach(function(s){
    raw[s.key] = rsCurveHas(m, s.key) ? rsCurveSeries(m, s.key, vi) : [];
    raw2[s.key] = (cmp && rsCurveHas(m, s.key)) ? rsCurveSeries(m, s.key, vi2) : [];
  });

  // Bars, grouped per fiscal year, in the same order and colours Results uses — so a reader
  // moving between the two panes is looking at the same picture with a different x-axis. Under
  // Compare each estimate series gets a second, faded bar: the older file on the left of the
  // pair, so a group reads left-to-right in time.
  var datasets = [];
  RS_CURVE_SER.forEach(function(s, i){
    if (st.hidden[s.key] || !rsCurveHas(m, s.key)) return;
    var arr = raw[s.key], old = raw2[s.key];
    var any = function(a){ return a && a.some(function(v){ return v != null; }); };
    if (!any(arr) && !any(old)) return;
    var pushOne = function(a, isOld, ord){
      datasets.push({ label: s.label + (cmp && s.key !== 'act' ? ' · ' + ev.vintages[isOld ? vi2 : vi].label : ''),
        data: a.map(sc), _key: s.key, _old: isOld,
        backgroundColor: isOld ? RS_CURVE_DIM[s.key] : s.color,
        borderRadius: 3, maxBarThickness: 46, order: ord });
    };
    // The actual does not move with the snapshot, so it stays a single bar under Compare too.
    if (cmp && s.key !== 'act' && any(old)){
      if (vi2 < vi){ pushOne(old, true, i * 2 + 1); if (any(arr)) pushOne(arr, false, i * 2 + 2); }
      else { if (any(arr)) pushOne(arr, false, i * 2 + 1); pushOne(old, true, i * 2 + 2); }
    } else if (any(arr)) pushOne(arr, false, i * 2 + 1);
  });

  var unitLbl = pct ? '%' : (rsCur(m) + (div === 1000 ? 'B' : 'M'));
  var vint = ev.vintages[vi] || {}, vint2 = cmp ? (ev.vintages[vi2] || {}) : null;
  var tEl = rsPaneEl('rsCurveChartT') || document.getElementById('rsCurveChartT');
  if (tEl) tEl.innerHTML = esc(m.label) + ' · ' +
    (cmp ? esc(vint.label || '—') + ' vs ' + esc(vint2.label || '—') : 'as of ' + esc(vint.label || '—')) + ' — ' +
    (pct ? (rsCurveBasis() === 'grow' ? 'implied YoY growth' : esc(m.marginLabel || 'margin'))
         : 'the projection') +
    ' <span>(' + esc(unitLbl) + ' per fiscal year · ' +
    (cmp ? 'what changed between the two saves · hover for the move'
         : 'what this one saved file said' + (vint.event ? ', ' + esc(vint.event) : '')) + ')</span>';

  // Fiscal years with no reported figure are forward — the same shading and the same bubbled
  // labels Results uses, so "closed" versus "still a forecast" reads identically in both panes.
  var lastA = -1;
  (raw.act || []).forEach(function(v, i){ if (v != null) lastA = i; });
  var fwdFrom = (lastA + 1 >= ev.years.length) ? -1 : lastA + 1;

  st.chart = rsNewChart(el, {
    type: 'bar',
    data: { labels: ev.years.map(function(y){ return 'FY' + y; }), datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        rsFwdZone: { from: fwdFrom },
        tooltip: {
          callbacks: {
            label: function(ctx){
              var i = ctx.dataIndex, key = ctx.dataset._key, old = ctx.dataset._old;
              var src = old ? raw2 : raw;
              var v = src[key] ? src[key][i] : null;
              if (v == null) return null;
              var fmt = function(x){
                return pct ? (rsCurveBasis() === 'grow' ? ((x >= 0 ? '+' : '−') + Math.abs(x).toFixed(1) + '%')
                                                        : (x.toFixed(1) + '%'))
                           : (amt ? rsFmtD(m, x) : rsFmt(m, x));
              };
              var line = ctx.dataset.label + ': ' + fmt(v);
              // Under Compare the move between the two saves is the whole point, so it is on the
              // NEWER bar — where the reader's eye already is — rather than left to subtraction.
              if (cmp && !old && key !== 'act'){
                var o = raw2[key] ? raw2[key][i] : null;
                if (o != null){
                  line += pct ? '  (' + ((v - o) >= 0 ? '+' : '−') + Math.abs(v - o).toFixed(1) + ' pp vs ' + ev.vintages[vi2].label + ')'
                              : '  (' + rsFmtD(m, v - o) + ' vs ' + ev.vintages[vi2].label + ')';
                }
              }
              // Where the year has closed, an estimate is worth scoring against it right here.
              var a = raw.act ? raw.act[i] : null;
              if (key !== 'act' && a != null){
                line += pct
                  ? '  (actual ' + ((a - v) >= 0 ? '+' : '−') + Math.abs(a - v).toFixed(1) + ' pp)'
                  : '  (actual ' + (rsSurp(a, v) >= 0 ? '+' : '−') + Math.abs(rsSurp(a, v)).toFixed(1) + '% · ' + rsFmtD(m, a - v) + ')';
              }
              return line;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, autoSkip: false,
          callback: function(v, i){ return (fwdFrom >= 0 && i >= fwdFrom) ? '' : this.getLabelForValue(v); } } },
        y: { position: 'right', grid: { color: 'rgba(0,0,0,0.05)' },
          min: st.yr ? st.yr[0] : undefined, max: st.yr ? st.yr[1] : undefined,
          ticks: { font: { size: 11 }, callback: function(v, i, ts){
            if (pct) return (+v.toFixed(rsTickDec(ts))) + '%';
            return rsTick(v, m.unit, div, m.cur, ts);
          } } }
      }
    },
    plugins: [rsFwdZone, rsLabels]
  });

  // Vertical-only brush: the x-axis is a handful of fiscal years, so a drag is a y-zoom.
  rsAttachBrush(el, st.chart, null,
    function(v1, v2){ rsCurveSt().yr = [v1, v2]; rsBuildCurve(); },
    function(){ rsCurveSt().yr = null; rsBuildCurve(); });

  rsCurveTableRender(m, raw, raw2, div);
  var root = document.getElementById('rsEvoWrap') || document;
  var th = root.querySelector('[data-rscurvetblb]'); if (th) th.innerHTML = rsCurveHeadHtml(m);
  var lg = root.querySelector('#rsCurveLegend'); if (lg) lg.innerHTML = rsCurveLegendHtml(m);
  var note = root.querySelector('#rsCurveNote');
  if (note) note.textContent = m.note || '';
}
function rsCurveTableRender(m, raw, raw2, div){
  var root = document.getElementById('rsEvoWrap') || document;
  var el = root.querySelector('#rsCurveTable'); if (!el) return;
  var ev = rsEvo(), st = rsCurveSt(), pct = rsCurveIsPct(), amt = rsCurveAmt();
  var grow = rsCurveBasis() === 'grow';
  var cmp = rsCurveCmp(), vi2 = cmp ? rsCurveVi2() : -1;
  function cell(v){
    if (v == null) return '<span class="rs-ft-nil">—</span>';
    if (pct) return grow ? ((v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%') : (v.toFixed(1) + '%');
    if (amt) return rsFmtD(m, v);
    if (m.unit === 'eps') return Number(v).toFixed(2);
    return (v / div).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  var unitCap = pct ? 'percent' : (rsCurName(m) + ' ' + (div === 1000 ? 'billions' : 'millions'));
  var vint = ev.vintages[rsCurveVi()] || {};
  var h = '<div class="rs-ft-cap">' + esc(unitCap) + ' · the ' + esc(vint.label || '') +
    ' snapshot' + (cmp ? ' against ' + esc(ev.vintages[vi2].label) : '') +
    ', fiscal years across the top · the right column is how far the projection travels over the horizon' +
    ' · <span class="rs-ft-e">E</span> = no reported figure for that year yet</div>';
  h += '<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">' +
    (cmp ? 'Line · snapshot' : '') + '</th>';
  var lastA = -1;
  (raw.act || []).forEach(function(v, i){ if (v != null) lastA = i; });
  ev.years.forEach(function(y, i){
    var est = i > lastA;
    h += '<th class="' + (est ? 'rs-ft-este' : '') + '">FY' + esc(y) + (est ? ' <span class="rs-ft-e">E</span>' : '') + '</th>';
  });
  h += '<th class="rs-ft-s">' + (cmp ? 'Across the horizon · biggest move' : 'Across the horizon') + '</th></tr></thead><tbody>';

  RS_CURVE_SER.forEach(function(s){
    if (!rsCurveHas(m, s.key)) return;
    var arr = raw[s.key] || [];
    if (!arr.some(function(v){ return v != null; })) return;
    // First → last: what the projection itself says about the shape of the horizon.
    var f = null, l = null;
    arr.forEach(function(v){ if (v != null){ if (f == null) f = v; l = v; } });
    var sum = (f == null || l === f) ? ''
      : (pct ? '<span style="color:' + (l - f >= 0 ? RS_GREEN : RS_RED) + '">' + (l - f >= 0 ? '+' : '−') + Math.abs(l - f).toFixed(1) + ' pp</span>'
             : rsRevHtml(m, f, l));
    // Under Compare BOTH rows carry their snapshot. Labelling the selected one plain "Summit"
    // and the other one "Dec 15, 2025" was asymmetric in a way that hid the comparison: the
    // reader could not tell that the first row was also a snapshot, so the pair did not read as
    // a pair at all. Now it is "Summit · Aug 5, 2026" over "Summit · Dec 15, 2025".
    var rowLbl = (cmp && s.key !== 'act') ? s.label + ' <span class="rs-ft-dim">· ' + esc(ev.vintages[rsCurveVi()].label) + '</span>' : s.label;
    h += '<tr class="rs-ft-main' + (s.key === 'act' ? '' : ' rs-ft-nb') + '"><td class="rs-ft-h">' + rowLbl + '</td>';
    arr.forEach(function(v, i){ h += '<td class="' + (i > lastA ? 'rs-ft-este' : '') + '">' +
      (s.key === 'act' ? '<b>' + cell(v) + '</b>' : cell(v)) + '</td>'; });
    h += '<td class="rs-ft-s">' + sum + '</td></tr>';
    // Then the older file's row, then the move between the two — which is the number the button
    // was opened for, so it gets its own row rather than being left to subtraction.
    if (cmp && s.key !== 'act'){
      var old = (raw2 && raw2[s.key]) || [];
      h += '<tr class="rs-ft-sub rs-ft-nb"><td class="rs-ft-h">' + s.label +
        ' <span class="rs-ft-dim">· ' + esc(ev.vintages[vi2].label) + '</span></td>';
      ev.years.forEach(function(_, i){ h += '<td class="' + (i > lastA ? 'rs-ft-este' : '') + '">' + cell(old[i]) + '</td>'; });
      // The older file travels its own horizon too — same summary, so the two rows are readable
      // side by side rather than one carrying a number the other silently lacks.
      var f2 = null, l2 = null;
      old.forEach(function(v){ if (v != null){ if (f2 == null) f2 = v; l2 = v; } });
      h += '<td class="rs-ft-s">' + ((f2 == null || l2 === f2) ? ''
        : (pct ? '<span style="color:' + (l2 - f2 >= 0 ? RS_GREEN : RS_RED) + '">' + (l2 - f2 >= 0 ? '+' : '−') + Math.abs(l2 - f2).toFixed(1) + ' pp</span>'
               : rsRevHtml(m, f2, l2))) + '</td></tr>';
      var moves = [];
      h += '<tr class="rs-ft-sub rs-ft-nb"><td class="rs-ft-h">the move</td>';
      ev.years.forEach(function(_, i){
        var a = arr[i], o = old[i];
        if (a == null || o == null){ h += '<td class="' + (i > lastA ? 'rs-ft-este' : '') + '"><span class="rs-ft-nil">—</span></td>'; return; }
        moves.push({ d: a - o, y: ev.years[i] });
        h += '<td class="' + (i > lastA ? 'rs-ft-este' : '') + '">' +
          (pct ? (Math.abs(a - o) < 0.05 ? '<span class="rs-ft-dim">0.0 pp</span>'
                 : '<span style="color:' + (a - o >= 0 ? RS_GREEN : RS_RED) + '">' + (a - o >= 0 ? '+' : '−') + Math.abs(a - o).toFixed(1) + ' pp</span>')
               : rsRevHtml(m, o, a)) + '</td>';
      });
      // Which year absorbed the revision — the one-line answer to "what did this save change".
      var big = null;
      moves.forEach(function(x){ if (big == null || Math.abs(x.d) > Math.abs(big.d)) big = x; });
      h += '<td class="rs-ft-s">' + (!big || Math.abs(big.d) < 0.05
        ? '<span class="rs-ft-dim">unmoved</span>'
        : '<span style="color:' + (big.d >= 0 ? RS_GREEN : RS_RED) + '">' +
          (pct ? ((big.d >= 0 ? '+' : '−') + Math.abs(big.d).toFixed(1) + ' pp') : rsFmtD(m, big.d)) +
          '</span><br><span class="rs-ft-dim">most of it in FY' + esc(big.y) + '</span>') + '</td></tr>';
    }
    // Scored against the print, wherever the year has closed.
    if (s.key !== 'act' && (raw.act || []).some(function(v){ return v != null; })){
      h += '<tr class="rs-ft-sub"><td class="rs-ft-h">vs reported</td>';
      arr.forEach(function(v, i){
        var a = raw.act[i];
        if (v == null || a == null){ h += '<td class="' + (i > lastA ? 'rs-ft-este' : '') + '"><span class="rs-ft-nil">—</span></td>'; return; }
        h += '<td>' + (pct
          ? '<span style="color:' + (a - v >= 0 ? RS_GREEN : RS_RED) + '">' + (a - v >= 0 ? '+' : '−') + Math.abs(a - v).toFixed(1) + ' pp</span>'
          : rsPctHtml(rsSurp(a, v)) + ' <span class="rs-ft-dim">· ' + rsFmtD(m, a - v) + '</span>') + '</td>';
      });
      h += '<td class="rs-ft-s"></td></tr>';
    }
  });
  h += '</tbody></table></div>';
  el.innerHTML = h;
}
function rsRerenderCurve(){
  var host = (document.getElementById('rsEvoWrap') || document).querySelector('#rsCurveHost');
  if (!host) return;
  host.innerHTML = rsCurveBlockHtml();
  rsBuildCurve();
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
    // ── Projection curve (one block at the foot of the pane, its own everything) ──
    var cvt = e.target.closest('[data-rscurvetblb]');
    if (cvt){
      var cst0 = rsCurveSt();
      cst0.tbl = cst0.tbl !== true;
      var cb = wrap.querySelector('#rsCurveTableBody');
      if (cb) cb.hidden = cst0.tbl !== true;
      cvt.innerHTML = rsCurveHeadHtml(rsCurveM());
      return;
    }
    var cvb = e.target.closest('[data-rscurvecmp]');
    if (cvb && !cvb.disabled){
      var bst = rsCurveSt();
      bst.cmp = !bst.cmp;
      bst.yr = null;                                   // a second series can widen the range
      rsRerenderCurve();
      return;
    }
    var cvc = e.target.closest('[data-rscurvemode], [data-rscurvegunit]');
    if (cvc && !cvc.disabled){
      var cst = rsCurveSt();
      if (cvc.hasAttribute('data-rscurvemode'))  cst.mode = cvc.getAttribute('data-rscurvemode');
      if (cvc.hasAttribute('data-rscurvegunit')) cst.growUnit = cvc.getAttribute('data-rscurvegunit');
      cst.yr = null;                                   // the units on the axis changed
      rsRerenderCurve();
      return;
    }
    var cvl = e.target.closest('[data-rscurveleg]');
    if (cvl){
      var cst2 = rsCurveSt(), ck = cvl.getAttribute('data-rscurveleg');
      cst2.hidden[ck] = !cst2.hidden[ck];
      rsBuildCurve();
      return;
    }
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
    if (e.target.classList.contains('rs-curvesel')){
      var cs = rsCurveSt();
      cs.metric = e.target.value;
      cs.mode = 'usd';                                 // % means something different per metric
      cs.yr = null;
      rsRerenderCurve();
      return;
    }
    if (e.target.classList.contains('rs-curvevsel2')){
      var cvB = rsCurveSt();
      cvB.vi2 = +e.target.value;
      cvB.yr = null;
      rsRerenderCurve();
      return;
    }
    if (e.target.classList.contains('rs-curvevsel')){
      var cv2 = rsCurveSt();
      cv2.vi = +e.target.value;                        // pick any archived file — that is the block
      // The comparison cannot be the file you just selected; let it re-derive.
      if (cv2.vi2 === cv2.vi) cv2.vi2 = null;
      cv2.yr = null;
      rsRerenderCurve();
      return;
    }
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
  rsBuildCurve();                     // the transpose at the foot of the pane
}
