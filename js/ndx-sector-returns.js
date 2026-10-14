// ndx-sector-returns.js — Market Analysis ▸ Nasdaq-100 ▸ Sector Returns & Attribution.
// The Nasdaq-100 counterpart of the S&P 500 panel's Sector Alpha, one year per bar.
// It is used as a short series of questions, top to bottom:
//   1. Sectors or Industry Groups?   2. One or Multiple?   3. Returns or Attribution?
//   then the years (and, for Returns only, Absolute / Relative).
//
// Returns — there is no official Nasdaq-100 sector index, so a sector's return is
// built from QQQ's holdings in the HOC data (docs/NDX_ATTRIBUTION.md):
//   HOC return of a sector = Σ wᵢ·rᵢ / Σ wᵢ over the sector's names (opening weights),
//   year return = Π (1 + HOC return) − 1, the same compounding as the index itself,
// i.e. the weights rescaled to 100% within the sector, exactly what the Detail
// simulation does when every other sector is excluded (checked: 77 of 77 sector-years
// match to 0.01 pp). Benchmark = the Nasdaq-100 price return from the same data, so
// Relative = sector minus that, in pp. Cash & futures are not a sector: left out.
// The HOCs hold each period's actual members (entries and exits included), so no
// full-year membership rule applies (unlike the S&P panel).
//
// Attribution — the Carino-linked contributions of the page's own engine
// (computeCore in js/ndx-attribution.js, passed in as `contribOf`): they add up to
// the Nasdaq-100 return, with cash & futures as the remainder row.
import { SCOLS } from './portal-data.js';

var root = null, CASH = null, YEARS = [], contribOf = null;   // YEARS: [{ key, label, ytd, hocs }] oldest → newest
var RET = {};      // RET[name][yearKey] = return %, name = sector or 'ig:' + group
var BENCH = {};    // BENCH[yearKey] = Nasdaq-100 price return %
var CONTRIB = {};  // CONTRIB[yearKey] = { bySec, byIG, ytd } from the attribution engine
var IG_SEC = {};   // industry group → sector (latest mapping wins)
var INFO = {};     // INFO[name][yearKey] = { names } — the companies behind a bar (hover)
var st = null;

function secColor(s){ return SCOLS[s] || SCOLS[s === 'Information Technology' ? 'Technology' : s] || '#888'; }
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }
function jsq(s){ return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

function compute(){
  RET = {}; BENCH = {}; IG_SEC = {}; INFO = {}; CONTRIB = {};
  YEARS.forEach(function(y){
    var grow = {}, bench = 1, seen = {};
    y.hocs.forEach(function(h){
      var agg = {}, tot = 0;
      h.sec.forEach(function(s){
        var w = s.w || 0;
        tot += w * s.r;
        if (s.s === CASH || (s.t && s.t.charAt(0) === '$') || w <= 0) return;
        IG_SEC[s.g] = s.s;
        [s.s, 'ig:' + s.g].forEach(function(k){
          var a = agg[k] || (agg[k] = { wr: 0, w: 0 }); a.wr += w * s.r; a.w += w;
          (seen[k] || (seen[k] = {}))[s.t || s.co] = 1;
        });
      });
      bench *= 1 + tot / 100;          // weights are in %, returns in decimals
      Object.keys(agg).forEach(function(k){ grow[k] = (grow[k] == null ? 1 : grow[k]) * (1 + agg[k].wr / agg[k].w); });
    });
    Object.keys(seen).forEach(function(k){ (INFO[k] = INFO[k] || {})[y.key] = { names: Object.keys(seen[k]).sort() }; });
    BENCH[y.key] = (bench - 1) * 100;
    Object.keys(grow).forEach(function(k){ (RET[k] = RET[k] || {})[y.key] = (grow[k] - 1) * 100; });
    if (contribOf) CONTRIB[y.key] = contribOf(y.key);
  });
}

// ── what is on screen ──────────────────────────────────────────────
function isAttr(){ return st.show === 'attr'; }
function rel(){ return !isAttr() && st.rel; }
function latestKey(){ return YEARS[YEARS.length - 1].key; }
function pre(){ return st.ig ? 'ig:' : ''; }
// Names of the current level (sectors or groups), best → worst latest-year return
function names(){
  return Object.keys(RET).filter(function(k){ return st.ig ? k.indexOf('ig:') === 0 : k.indexOf('ig:') !== 0; })
    .map(function(k){ return st.ig ? k.slice(3) : k; })
    .sort(function(a, b){ return ((RET[pre() + b] || {})[latestKey()] || -1e9) - ((RET[pre() + a] || {})[latestKey()] || -1e9); });
}
function picked(){ return st.ig ? st.igs : st.secs; }
function val(n, yk){
  if (isAttr()){ var c = CONTRIB[yk]; if (!c) return null; var v = (st.ig ? c.byIG : c.bySec)[n]; return v == null ? null : v; }
  var r = RET[pre() + n] && RET[pre() + n][yk];
  if (r == null) return null;
  return rel() ? r - BENCH[yk] : r;
}
function benchVal(yk){ return isAttr() ? (CONTRIB[yk] ? CONTRIB[yk].ytd : null) : BENCH[yk]; }
function fmt(v){ if (Math.abs(v) < 0.005) v = 0; return (v >= 0 ? '+' : '') + v.toFixed(2) + (rel() ? ' pp' : '%'); }
function tip(n, yk){
  var i = INFO[pre() + n] && INFO[pre() + n][yk]; if (!i) return '';
  var k = i.names.length;
  return k + (k === 1 ? ' company' : ' companies') + ': ' + i.names.slice(0, 12).join(', ') + (k > 12 ? '…' : '');
}

// ── pieces ─────────────────────────────────────────────────────────
var NAME = 'width:230px;min-width:230px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
function bar(label, v, maxV, title, grey){
  if (v == null) return '<div class="sby sby-hl"><span class="sbyl">' + label + '</span><div class="sbtr-div"></div><span class="sbi" style="color:var(--mu);font-weight:600">n/a</span></div>';
  var pct = Math.min(Math.abs(v) / maxV * 50, 50), left = v >= 0 ? 50 : 50 - pct;
  var col = grey ? '#9AAAB8' : v >= 0 ? '#1E3A5F' : '#9B2A20';
  return '<div class="sby sby-hl"' + (title ? ' title="' + esc(title) + '"' : '') + '><span class="sbyl">' + label + '</span><div class="sbtr-div"><div class="sbfl-div" style="left:' + left + '%;width:' + pct + '%;background:' + col + '"></div></div>' +
    '<span class="sbi" style="color:' + (grey ? 'var(--mu)' : v >= 0 ? 'var(--pos)' : 'var(--neg)') + ';font-weight:600">' + fmt(v) + '</span></div>';
}
function seg(fn, opts, cur){
  return '<span class="sb-toggle" style="margin-left:0">' + opts.map(function(o){
    return '<button class="sb-tbtn' + (o[0] === cur ? ' active' : '') + '" onclick="' + fn + '(\'' + o[0] + '\')">' + o[1] + '</button>';
  }).join('') + '</span>';
}
function q(num, label, ctl){
  return '<span style="display:inline-flex;align-items:center;gap:8px"><span class="sb-secrow-lbl" style="margin-right:0">' + num + ' · ' + label + '</span>' + ctl + '</span>';
}
function questions(){
  var h = '<div class="sb-secrow" style="gap:18px">' +
    q(1, 'Level', seg('ndxSrLevel', [['sec', 'Sectors'], ['ig', 'Industry Groups']], st.ig ? 'ig' : 'sec')) +
    q(2, 'How many', seg('ndxSrOne', [['one', 'One'], ['multi', 'Multiple']], st.one ? 'one' : 'multi')) +
    q(3, 'Show', seg('ndxSrShow', [['ret', 'Returns'], ['attr', 'Contribution to index']], st.show));
  if (!isAttr()) h += '<span style="margin-left:auto">' + seg('ndxSrRel', [['abs', 'Absolute'], ['rel', 'Relative']], st.rel ? 'rel' : 'abs') + '</span>';
  return h + '</div>';
}
function chips(){
  var P = picked();
  return '<div class="sb-secrow"><span class="sb-secrow-lbl">' + (st.ig ? 'Industry groups:' : 'Sectors:') + '</span>' + names().map(function(n){
    return '<span class="sb-secchip' + (P[n] ? ' active' : '') + '" onclick="ndxSrPick(\'' + jsq(n) + '\')"' + (st.ig ? ' title="' + esc(IG_SEC[n] || '') + '"' : '') + '>' + esc(n) + '</span>';
  }).join('') +
    (st.one ? '' : '<span style="margin-left:auto;display:inline-flex;gap:6px"><button class="sb-secchip-all" style="margin-left:0" onclick="ndxSrAll(true)">All</button><button class="sb-secchip-all" style="margin-left:0" onclick="ndxSrAll(false)">None</button></span>') + '</div>';
}
function yearsRow(){
  return '<div class="sb-secrow"><span class="sb-secrow-lbl">Years</span>' + YEARS.map(function(y){
    return '<span class="sb-secchip' + (st.years[y.key] ? ' active' : '') + '" onclick="ndxSrYear(\'' + y.key + '\')"' + (y.ytd ? ' title="Year to date"' : '') + '>' + y.label + '</span>';
  }).join('') + '</div>';
}

function render(){
  if (!root) return;
  var yrs = YEARS.filter(function(y){ return st.years[y.key]; });
  var sk = yrs[yrs.length - 1].key, P = picked();
  var rows = names().filter(function(n){ return P[n]; });
  rows.sort(function(a, b){ var x = val(a, sk), y = val(b, sk); return (y == null ? -1e9 : y) - (x == null ? -1e9 : x); });
  // Attribution with every name on: a cash & futures row, so the bars add up to the index
  var allOn = !st.one && names().every(function(n){ return P[n]; });
  var cashRow = isAttr() && allOn;

  var maxV = 0;
  function seen(v){ if (v != null && Math.abs(v) > maxV) maxV = Math.abs(v); }
  rows.forEach(function(n){ yrs.forEach(function(y){ seen(val(n, y.key)); }); });
  // In Attribution the index row (the sum) would flatten the contributions: its bar is capped instead
  if (!rel() && !isAttr()) yrs.forEach(function(y){ seen(benchVal(y.key)); });
  maxV = Math.max(maxV, isAttr() ? 5 : rel() ? 15 : 30);

  var html = questions() + chips() + yearsRow() + '<div class="sbrs">';
  // The index first (in Relative it is the zero line, so it is left out)
  if (!rel()){
    html += '<div class="sbr"><span class="sbn key" style="' + NAME + '">Nasdaq-100</span><div class="sbbs">' +
      yrs.map(function(y){ return bar(y.label, benchVal(y.key), maxV); }).join('') + '</div></div>';
  }
  rows.forEach(function(n){
    var sec = st.ig ? IG_SEC[n] : null;
    html += '<div class="sbr"><span class="sbn" style="' + NAME + '" title="' + esc(n + (sec ? ' · ' + sec : '')) + '">' +
      (sec ? '<span style="display:inline-block;width:7px;height:7px;border-radius:2px;margin-right:6px;background:' + secColor(sec) + '"></span>' : '') + esc(n) + '</span><div class="sbbs">' +
      yrs.map(function(y){ return bar(y.label, val(n, y.key), maxV, tip(n, y.key)); }).join('') + '</div></div>';
  });
  if (cashRow){
    html += '<div class="sbr"><span class="sbn" style="' + NAME + ';color:var(--mu);font-style:italic">Cash &amp; futures</span><div class="sbbs">' +
      yrs.map(function(y){ var c = CONTRIB[y.key]; return bar(y.label, c ? (st.ig ? c.byIG : c.bySec)[CASH] : null, maxV, '', true); }).join('') + '</div></div>';
  }
  html += '</div><div style="font-size:11px;color:var(--mu);margin-top:12px;line-height:1.5">' + (isAttr()
    ? 'Contribution = points of the Nasdaq-100’s return each ' + (st.ig ? 'industry group' : 'sector') + ' added (its weight × its return, linked over the year).'
    : 'Return = QQQ’s holdings in the ' + (st.ig ? 'industry group' : 'sector') + ', their weights rescaled to 100% within it, compounded over the year.') + '</div>';
  root.innerHTML = html;
}

// ── handlers ───────────────────────────────────────────────────────
function firstOn(){ var P = picked(); return names().filter(function(n){ return P[n]; })[0] || names()[0]; }
function keepOne(){ var k = firstOn(), o = {}; o[k] = true; if (st.ig) st.igs = o; else st.secs = o; }
window.ndxSrLevel = function(v){ st.ig = v === 'ig'; if (st.one) keepOne(); render(); };
window.ndxSrOne = function(v){ st.one = v === 'one'; if (st.one) keepOne(); render(); };
window.ndxSrShow = function(v){ st.show = v; render(); };
window.ndxSrRel = function(v){ st.rel = v === 'rel'; render(); };
window.ndxSrYear = function(k){
  if (st.years[k] && Object.keys(st.years).filter(function(x){ return st.years[x]; }).length === 1) return;   // at least one year
  st.years[k] = !st.years[k]; render();
};
window.ndxSrPick = function(n){
  var P = picked();
  if (st.one){ var o = {}; o[n] = true; if (st.ig) st.igs = o; else st.secs = o; render(); return; }
  P[n] = !P[n];
  if (!Object.keys(P).some(function(k){ return P[k]; })) P[n] = true;   // at least one
  render();
};
window.ndxSrAll = function(on){
  var P = picked();
  names().forEach(function(n){ P[n] = on; });
  if (!on) P[names()[0]] = true;
  render();
};

// host: the section's card. years: [{ key, label, ytd, hocs }] oldest → newest.
// cash: the sector name used for cash / futures lines. contrib: yearKey → computeCore() result.
export function initNdxSectorReturns(host, years, cash, contrib){
  root = host; CASH = cash; contribOf = contrib || null;
  YEARS = (years || []).filter(function(y){ return y.hocs && y.hocs.length; });
  if (!root || !YEARS.length) return;
  compute();
  st = { years: {}, secs: {}, igs: {}, one: false, rel: false, ig: false, show: 'ret' };
  st.years[latestKey()] = true;                       // opens on the latest year alone
  Object.keys(RET).forEach(function(k){ if (k.indexOf('ig:') === 0) st.igs[k.slice(3)] = true; else st.secs[k] = true; });
  render();
}

// Latest-year return of a sector (or industry group) — Sector Summary's YTD column
export function ndxLatestReturn(name, isIG){
  if (!YEARS.length) return null;
  var r = RET[(isIG ? 'ig:' : '') + name];
  return r ? r[latestKey()] : null;
}
