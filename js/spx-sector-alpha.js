// spx-sector-alpha.js — the S&P 500 side of Market Analysis ▸ Sector Return / Contribution.
// Used as a series of questions, top to bottom:
//   1 · Level (Sectors / Industry Groups) → 2 · How many (One / Multiple) →
//   3 · Period (Yearly / Monthly) → 4 · Show (Returns / Contribution to SPY; yearly only)
//   + Measured with (SPDR ETFs / S&P 500 indices; sectors' returns only) and
//     Absolute / Relative (returns only)
// then one dates box: Years (at least one on); Monthly adds the months — the same picked
// months for EVERY year switched on — Single month / Cumulative YTD and a Custom period.
// Data: js/spx-data.js — sector levels (S5 indices or SPDR ETFs), industry-group levels
// (data.groups, S5 industry-group indices) and the yearly SPY attribution
// (spx-attribution.js). Relative = minus SPY (ETFs) or the S&P 500 (indices), in pp.

var D = null, ATTR = [], TICK = null, colorOf = null, onSource = null;
var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var st = { level: 'sec', one: false, period: 'year', show: 'ret', src: 'etf', rel: false,
  years: {}, secs: {}, igs: {}, months: {}, mview: 'month', custom: false, from: null, to: null };

function el(id){ return document.getElementById(id); }
function esc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
function jsq(s){ return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }
function ymLabel(ym){ return MON[+ym.slice(5, 7) - 1] + " '" + ym.slice(2, 4); }
function asOfTxt(iso){ var d = new Date(iso + 'T12:00:00Z'); return MON[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear(); }
function curYear(){ return String(D.year); }
function isAttr(){ return st.period === 'year' && st.show === 'attr'; }
function isIG(){ return st.level === 'ig' && !!D.groups; }
function isETF(){ return !isIG() && !isAttr() && st.src === 'etf' && !!D.etf; }
function rel(){ return !isAttr() && st.rel; }
function allYears(){ return D.years.slice(); }                       // '2017' … '2026'
function attrYears(){ return ATTR.map(function(a){ return a.key; }); }
function yearKeys(){ return isAttr() ? attrYears() : allYears(); }
function onYears(){ return yearKeys().filter(function(y){ return st.years[y]; }); }

// ── the numbers ────────────────────────────────────────────────────
function source(){
  if (isIG()) return { levels: { dates: D.levels.dates, series: D.groups.levels }, annual: D.groups.annual, bench: 'SPX', benchSeries: D.levels.series.SPX, benchAnnual: D.annual.SPX, benchLabel: 'S&P 500' };
  if (isETF()) return { levels: D.etf.levels, annual: D.etf.annual, bench: 'SPY', benchSeries: D.etf.levels.series.SPY, benchAnnual: D.etf.annual.SPY, benchLabel: 'SPY' };
  return { levels: D.levels, annual: D.annual, bench: 'SPX', benchSeries: D.levels.series.SPX, benchAnnual: D.annual.SPX, benchLabel: 'S&P 500' };
}
function names(){ return Object.keys(isIG() ? D.groups.levels : D.levels.series).filter(function(k){ return k !== 'SPX'; }); }
function picked(){ return isIG() ? st.igs : st.secs; }
function idx(ym){ var ds = D.levels.dates; for (var i = 0; i < ds.length; i++) if (ds[i].slice(0, 7) === ym) return i; return -1; }
function win(series, from, to){
  var i0 = idx(from) - 1, i1 = idx(to);
  if (!series || i0 < 0 || i1 <= i0 || series[i0] == null || series[i1] == null) return null;
  return (series[i1] / series[i0] - 1) * 100;
}
function attrOf(y){ for (var i = 0; i < ATTR.length; i++) if (ATTR[i].key === y) return ATTR[i]; return null; }
function val(n, p){
  if (isAttr()){ var a = attrOf(p.year); if (!a) return null; var m = isIG() ? a.byIG : a.bySec; return m && m[n] != null ? m[n] : null; }
  var S = source(), r, b;
  if (p.type === 'year'){ r = (S.annual[n] || {})[p.year]; b = S.benchAnnual[p.year]; }
  else { r = win(S.levels.series[n], p.from, p.to); b = win(S.benchSeries, p.from, p.to); }
  if (r == null) return null;
  if (!rel()) return r;
  return b == null ? null : r - b;
}
function dataMonths(){ return D.levels.dates.slice(1).map(function(d){ return d.slice(0, 7); }); }
function isMTD(ym){
  if (ym !== D.asOf.slice(0, 7)) return false;
  var d = new Date(D.asOf + 'T12:00:00Z'), nx = new Date(d.getTime() + 864e5 * 4);
  return nx.getUTCMonth() === d.getUTCMonth();
}
// Periods on screen: each year (oldest first) followed by ITS picked months, so every month sits
// under the year it belongs to; the custom period last
function periods(){
  var out = [], ms = dataMonths();
  onYears().forEach(function(y){
    out.push({ type: 'year', year: y, label: y });
    if (st.period !== 'month') return;
    Object.keys(st.months).filter(function(m){ return st.months[m]; }).sort().forEach(function(m){
      var ym = y + '-' + m; if (ms.indexOf(ym) < 0) return;
      out.push(st.mview === 'ytd'
        ? { type: 'month', year: y, from: y + '-01', to: ym, label: 'YTD ' + ymLabel(ym) }
        : { type: 'month', year: y, from: ym, to: ym, label: ymLabel(ym) + (isMTD(ym) ? ' MTD' : '') });
    });
  });
  if (st.period === 'month' && st.custom) out.push({ type: 'range', from: st.from, to: st.to, label: ymLabel(st.from) + '–' + ymLabel(st.to) });
  return out;
}
function label(n){ return !isIG() && !isAttr() && TICK ? n + ' (' + TICK[isETF() ? 'etf' : 'index'][n] + ')' : n; }

// ── rendering ──────────────────────────────────────────────────────
function seg(fn, opts, cur){
  return '<span class="sb-toggle" style="margin-left:0">' + opts.map(function(o){
    return '<button class="sb-tbtn' + (o[0] === cur ? ' active' : '') + '" onclick="' + fn + '(\'' + o[0] + '\')">' + o[1] + '</button>'; }).join('') + '</span>';
}
function q(label, ctl){ return '<span style="display:inline-flex;align-items:center;gap:8px"><span class="sb-secrow-lbl" style="margin-right:0">' + label + '</span>' + ctl + '</span>'; }
function renderQuestions(){
  var n = 0, h = '';
  if (D.groups) h += q(++n + ' · Level', seg('saLevel', [['sec', 'Sectors'], ['ig', 'Industry Groups']], st.level));
  h += q(++n + ' · How many', seg('saOne', [['one', 'One'], ['multi', 'Multiple']], st.one ? 'one' : 'multi'));
  h += q(++n + ' · Period', seg('saPeriod', [['year', 'Yearly'], ['month', 'Monthly']], st.period));
  if (st.period === 'year' && ATTR.length) h += q(++n + ' · Show', seg('saShow', [['ret', 'Returns'], ['attr', 'Contribution to SPY']], st.show));
  // Always on screen (never appears / disappears); greyed where it does not apply: industry groups
  // have no ETFs, and Contribution is SPY's own holdings × the S&P 500 indices
  if (D.etf){
    var na = isIG() || isAttr();
    h += q('Measured with', na
      ? '<span class="sb-toggle" style="margin-left:0;opacity:.45" title="' + (isAttr() ? 'Contribution uses SPY&rsquo;s holdings and the S&amp;P 500 indices' : 'There are no sector ETFs for industry groups: S&amp;P 500 indices') + '"><button class="sb-tbtn" disabled>SPDR sector ETFs</button><button class="sb-tbtn active" disabled>S&amp;P 500 indices</button></span>'
      : seg('saSrc', [['etf', 'SPDR sector ETFs'], ['index', 'S&amp;P 500 indices']], st.src));
  }
  if (!isAttr()) h += '<span style="margin-left:auto">' + seg('saRel', [['abs', 'Absolute'], ['rel', 'Relative']], st.rel ? 'rel' : 'abs') + '</span>';
  var e = el('sb-qbar'); e.style.gap = '16px'; e.innerHTML = h;
}
function renderChips(){
  var P = picked(), list = names().sort(function(a, b){ var p = { type: 'year', year: curYear() }; return (val(b, p) || -1e9) - (val(a, p) || -1e9); });
  var h = '<span class="sb-secrow-lbl">' + (isIG() ? 'Industry groups:' : 'Sectors:') + '</span>' + list.map(function(n){
    return '<span class="sb-secchip' + (P[n] ? ' active' : '') + '" onclick="saPick(\'' + jsq(n) + '\')">' + esc(label(n)) + '</span>'; }).join('');
  if (!st.one) h += '<span style="margin-left:auto;display:inline-flex;gap:6px"><button class="sb-secchip-all" style="margin-left:0" onclick="saAll(true)">All</button><button class="sb-secchip-all" style="margin-left:0" onclick="saAll(false)">None</button></span>';
  el('sb-secrow').innerHTML = h;
}
function sel(){ return 'padding:3px 6px;border:1px solid var(--bdr);border-radius:6px;font:inherit;font-size:11px;color:var(--text);background:var(--w)'; }
function ymPicker(id, v, first, last){
  var y0 = +first.slice(0, 4), y1 = +last.slice(0, 4), h = '<span style="display:inline-flex;gap:4px">';
  h += '<select id="' + id + '-m" onchange="saRange()" style="' + sel() + '">' + MON.map(function(n, i){ var mm = (i < 9 ? '0' : '') + (i + 1); return '<option value="' + mm + '"' + (v.slice(5, 7) === mm ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select>';
  h += '<select id="' + id + '-y" onchange="saRange()" style="' + sel() + '">';
  for (var y = y1; y >= y0; y--) h += '<option' + (String(y) === v.slice(0, 4) ? ' selected' : '') + '>' + y + '</option>';
  return h + '</select></span>';
}
function renderDates(){
  var h = '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><span class="sb-secrow-lbl">Years</span>' + yearKeys().map(function(y){
    return '<span class="sb-secchip' + (st.years[y] ? ' active' : '') + '" onclick="saYear(\'' + y + '\')"' + (y === curYear() ? ' title="Year to date, through ' + asOfTxt(D.asOf) + '"' : '') + '>' + y + '</span>'; }).join('') + '</div>';
  if (st.period === 'month'){
    var ms = dataMonths(), ys = onYears();
    h += '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center"><span class="sb-secrow-lbl">Months</span>' + MON.map(function(n, i){
      var mm = (i < 9 ? '0' : '') + (i + 1), any = ys.some(function(y){ return ms.indexOf(y + '-' + mm) >= 0; });
      if (!any) return '<span class="sb-secchip" style="opacity:.35;cursor:default">' + n + '</span>';
      return '<span class="sb-secchip' + (st.months[mm] ? ' active' : '') + '" onclick="saMonth(\'' + mm + '\')">' + n + '</span>'; }).join('');
    var k = Object.keys(st.months).filter(function(m){ return st.months[m]; }).length;
    if (k) h += '<button class="sb-secchip-all" style="margin-left:0" onclick="saMonthsClear()">Clear (' + k + ')</button>';
    h += '<span style="margin-left:auto;display:inline-flex;gap:6px">' + seg('saMView', [['month', 'Single month'], ['ytd', 'Cumulative YTD']], st.mview) +
      '<span class="sb-toggle" style="margin-left:0"><button class="sb-tbtn' + (st.custom ? ' active' : '') + '" onclick="saCustom()">Custom period</button></span></span></div>';
    if (st.custom){
      h += '<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:flex-end"><span class="sb-secrow-lbl">From</span>' +
        ymPicker('sa-from', st.from, ms[0], ms[ms.length - 1]) + '<span class="sb-secrow-lbl" style="margin-left:4px">to</span>' + ymPicker('sa-to', st.to, ms[0], ms[ms.length - 1]) + '</div>';
    }
  }
  el('sb-dates').innerHTML = h;
}
function bar(lbl, v, maxV, hl){
  var u = rel() ? ' pp' : '%';
  if (v == null) return '<div class="sby' + (hl ? ' sby-hl' : '') + '"><span class="sbyl">' + lbl + '</span><div class="sbtr-div"></div><span class="sbi" style="color:var(--mu);font-weight:600">n/a</span></div>';
  if (Math.abs(v) < 0.005) v = 0;
  var pct = Math.min(Math.abs(v) / maxV * 50, 50), left = v >= 0 ? 50 : 50 - pct;
  return '<div class="sby' + (hl ? ' sby-hl' : '') + '"><span class="sbyl">' + lbl + '</span><div class="sbtr-div"><div class="sbfl-div" style="left:' + left + '%;width:' + pct + '%;background:' + (v >= 0 ? '#1E3A5F' : '#9B2A20') + '"></div></div>' +
    '<span class="sbi" style="color:' + (v >= 0 ? 'var(--pos)' : 'var(--neg)') + ';font-weight:600">' + (v >= 0 ? '+' : '') + v.toFixed(2) + u + '</span></div>';
}
function renderBars(){
  var ps = periods(), P = picked(), lastY = ps.filter(function(p){ return p.type === 'year'; }).pop() || ps[ps.length - 1];
  var rows = names().filter(function(n){ return P[n]; }).sort(function(a, b){ return (val(b, lastY) || -1e9) - (val(a, lastY) || -1e9); });
  var maxV = 0;
  rows.forEach(function(n){ ps.forEach(function(p){ var v = val(n, p); if (v != null && Math.abs(v) > maxV) maxV = Math.abs(v); }); });
  maxV = Math.max(maxV, isAttr() ? 5 : rel() ? 15 : 30);
  var NM = 'width:230px;min-width:230px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
  var h = '';
  // html: the row label (may carry a colour dot) · title: its plain text, for the tooltip
  function row(html, vals, style, title){
    h += '<div class="sbr"><span class="sbn" style="' + NM + (style ? ';' + style : '') + '" title="' + esc(title || '').replace(/"/g, '&quot;') + '">' + html + '</span><div class="sbbs">' +
      ps.map(function(p, i){ return bar(p.label, vals[i], maxV, p.type === 'year'); }).join('') + '</div></div>';
  }
  if (isAttr()) row('SPY', ps.map(function(p){ var a = attrOf(p.year); return a ? a.total : null; }), 'font-weight:700;color:var(--navy)');
  rows.forEach(function(n){
    var dot = isIG() && colorOf ? '<span style="display:inline-block;width:7px;height:7px;border-radius:2px;margin-right:6px;background:' + colorOf(D.groups.sectorOf[n]) + '"></span>' : '';
    row(dot + esc(label(n)), ps.map(function(p){ return val(n, p); }), '', label(n) + (isIG() ? ' · ' + D.groups.sectorOf[n] : ''));
  });
  if (isAttr() && !st.one && names().every(function(n){ return P[n]; }))
    row('Residual (cash &amp; other)', ps.map(function(p){ var a = attrOf(p.year); return a ? a.residual : null; }), 'color:var(--mu);font-style:italic');
  el('sb-wrap').innerHTML = h;
  el('sb-note').innerHTML = isAttr()
    ? 'SPY fund, from its holdings — not the SPDR sector ETFs, which cap their largest holdings. Contribution = points of SPY\'s return each ' + (isIG() ? 'industry group' : 'sector') + ' added (its weight × its return, linked over the year). From 2024.'
    : '';
}
function render(){
  renderQuestions(); renderChips(); renderDates(); renderBars();
  var a = el('ma-sb-asof');
  if (a) a.textContent = '';
}

// ── handlers ───────────────────────────────────────────────────────
function keepOne(){ var P = picked(), k = names().filter(function(n){ return P[n]; })[0] || names()[0], o = {}; o[k] = true; if (isIG()) st.igs = o; else st.secs = o; }
function fixYears(){ var ys = yearKeys(); if (!ys.some(function(y){ return st.years[y]; })) st.years[ys[ys.length - 1]] = true; }
window.saLevel = function(v){ st.level = v; if (st.one) keepOne(); render(); };
window.saOne = function(v){ st.one = v === 'one'; if (st.one) keepOne(); render(); };
window.saPeriod = function(v){ st.period = v; fixYears(); render(); };
window.saShow = function(v){ st.show = v; fixYears(); render(); };
window.saSrc = function(v){ st.src = v; render(); if (onSource) onSource(v); };
window.saRel = function(v){ st.rel = v === 'rel'; render(); };
window.saYear = function(y){
  if (st.years[y] && onYears().length === 1) return;   // at least one year
  st.years[y] = !st.years[y]; renderDates(); renderBars();
};
window.saPick = function(n){
  var P = picked();
  if (st.one){ var o = {}; o[n] = true; if (isIG()) st.igs = o; else st.secs = o; }
  else { P[n] = !P[n]; if (!Object.keys(P).some(function(k){ return P[k]; })) P[n] = true; }
  renderChips(); renderBars();
};
window.saAll = function(on){ var P = picked(); names().forEach(function(n){ P[n] = on; }); if (!on) keepOne(); renderChips(); renderBars(); };
window.saMonth = function(m){ st.months[m] = !st.months[m]; renderDates(); renderBars(); };
window.saMonthsClear = function(){ st.months = {}; renderDates(); renderBars(); };
window.saMView = function(v){ st.mview = v; renderDates(); renderBars(); };
window.saCustom = function(){ st.custom = !st.custom; renderDates(); renderBars(); };
window.saRange = function(){
  var ms = dataMonths(), f = el('sa-from-y').value + '-' + el('sa-from-m').value, t = el('sa-to-y').value + '-' + el('sa-to-m').value;
  function clamp(v){ return v < ms[0] ? ms[0] : v > ms[ms.length - 1] ? ms[ms.length - 1] : v; }
  f = clamp(f); t = clamp(t); if (f > t){ var x = f; f = t; t = x; }
  st.from = f; st.to = t; renderDates(); renderBars();
};

// data: SPX_DATA · attr: spyAttributionYears() · tickers: { etf: {sector: XLK…}, index: {sector: S5…} }
// sectorColor: sector → colour · onSourceChange: called with 'etf' | 'index'
export function initSpxSectorAlpha(data, attr, tickers, sectorColor, onSourceChange){
  D = data; ATTR = attr || []; TICK = tickers; colorOf = sectorColor; onSource = onSourceChange;
  if (!D || !el('sb-qbar')) return;
  if (!D.etf) st.src = 'index';
  st.years = {}; st.years[curYear()] = true;           // opens on the current year alone
  names().forEach(function(n){ st.secs[n] = true; });
  if (D.groups) Object.keys(D.groups.levels).forEach(function(n){ st.igs[n] = true; });
  var ms = dataMonths(); st.from = D.year + '-01'; st.to = ms[ms.length - 1];
  render();
}
