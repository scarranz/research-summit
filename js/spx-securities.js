// spx-securities.js — the S&P 500 side of Top Contributors,
// in the Nasdaq-100 format (js/ndx-attribution.js renderPareto).
// Data: js/spx-holdings-data.js (scripts/spx/extract_spx_holdings.py) — SPY's holdings and
// weights at each year-end and each name's return over the next year. ONE snapshot per year
// (no intra-year rebalances), so a year is a buy-and-hold of its opening holdings:
//   contribution = opening weight × the year's return; what that does not explain vs SPY
//   (names that joined during the year, delisted names without a price, cash) is the residual.
// So there is no "HOC evolution" slider on this side.

var H = null;                // SPX_HOLDINGS
var P = { years: {}, n: 5, custom: 0, side: 'pos', info: 'sector', ret: true };
var topRoot = null;

function colr(v){ return v >= 0 ? 'var(--pos)' : 'var(--neg)'; }
function sgn2(v){ if (Math.abs(v) < 0.005) v = 0; return (v >= 0 ? '+' : '') + v.toFixed(2); }
function trunc(s, n){ s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
function esc(s){ return String(s == null ? '' : s).replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
function yearOf(y){ for (var i = 0; i < H.years.length; i++) if (H.years[i].year === y) return H.years[i]; return null; }
function secs(y){
  var Y = yearOf(y); if (!Y) return [];
  var tot = 0; Y.holdings.forEach(function(h){ tot += h.w * (1 + h.r / 100); });
  return Y.holdings.map(function(h){ return { name: h.t, co: h.co, sect: h.s, grp: h.g, ret: h.r, w0: h.w, w1: h.w * (1 + h.r / 100) / tot * 100, contrib: h.w * h.r / 100 }; });
}
function btn(cls, on, onclick, label){ return '<button class="ndx-tab-btn ' + cls + (on ? ' active' : '') + '" onclick="' + onclick + '">' + label + '</button>'; }

// ── Top Contributors ───────────────────────────────────────────────
function renderTop(){
  if (!topRoot) return;
  var years = H.years.map(function(y){ return y.year; }).filter(function(y){ return P.years[y]; });
  var N = P.custom > 0 ? P.custom : P.n, showAll = N === 0, showPos = P.side !== 'neg', showNeg = P.side !== 'pos';
  var yd = {};
  years.forEach(function(y){
    var ranked = secs(y).sort(function(a, b){ return b.contrib - a.contrib; });
    ranked.forEach(function(d, i){ d.rank = i + 1; });
    var n = showAll ? ranked.length : Math.min(N, ranked.length);
    var pos = ranked.slice(0, n), neg = ranked.slice(P.side === 'both' ? Math.max(n, ranked.length - n) : ranked.length - n).reverse();
    [pos, neg].forEach(function(l){ var c = 0; l.forEach(function(d){ c += d.contrib; d.cum = c; }); });
    yd[y] = { n: ranked.length, pos: showPos ? pos : [], neg: showNeg ? neg : [], total: yearOf(y).spy, resid: yearOf(y).residual };
  });
  var SEP = '<div style="width:1px;height:16px;background:var(--rule);flex-shrink:0"></div>';
  var LBL = function(t){ return '<span style="font-size:11px;color:var(--mu)">' + t + '</span>'; };
  var html = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">' +
    '<div style="display:flex;gap:4px">' + H.years.map(function(y){ return btn('', P.years[y.year], 'spxTopYear(' + y.year + ')', y.year); }).join('') + '</div>' + SEP +
    '<div style="display:flex;gap:4px">' + [5, 10, 20, 0].map(function(nv){ return btn('', P.custom === 0 && P.n === nv, 'spxTopN(' + nv + ')', nv === 0 ? 'All' : 'Top ' + nv); }).join('') + '</div>' +
    '<input type="number" min="1" max="600" placeholder="Custom" value="' + (P.custom > 0 ? P.custom : '') + '" style="width:70px;font-size:11px;padding:3px 6px;border:1px solid var(--rule);border-radius:4px;background:var(--surface);color:var(--navy)" onchange="spxTopCustom(+this.value)">' + SEP +
    LBL('Show') + '<div style="display:flex;gap:4px">' + [['pos', 'Top'], ['neg', 'Bottom'], ['both', 'Both']].map(function(o){ return btn('', P.side === o[0], 'spxTopSide(\'' + o[0] + '\')', o[1]); }).join('') + '</div>' + SEP +
    LBL('Column') + '<div style="display:flex;gap:4px">' + [['', 'None'], ['sector', 'Sector'], ['ig', 'Industry Group']].map(function(o){ return btn('', P.info === o[0], 'spxTopInfo(\'' + o[0] + '\')', o[1]); }).join('') + '</div>' +
    btn('', P.ret, 'spxTopRet()', 'Ret%') + '</div>';

  var info = P.info, showRet = P.ret, cpy = 4 + (info ? 1 : 0) + (showRet ? 1 : 0);
  var TH = 'padding:4px 8px;color:var(--mu);font-weight:500;white-space:nowrap', GAP = 'border-left:12px solid transparent';
  var thead = '<thead><tr>' + years.map(function(y, i){ return '<th colspan="' + cpy + '" style="text-align:left;padding:4px 8px 2px;color:var(--navy);font-weight:700;border-bottom:1px solid var(--rule);' + (i ? GAP : '') + '">' + y + '</th>'; }).join('') +
    '</tr><tr style="border-bottom:1.5px solid var(--rule)">' + years.map(function(y, i){
      return '<th style="text-align:right;' + TH + ';' + (i ? GAP : '') + '" title="Rank by contribution among all ' + yd[y].n + ' holdings of the year">Rank</th><th style="text-align:left;' + TH + '">Ticker</th>' +
        (info ? '<th style="text-align:left;' + TH + '">' + (info === 'ig' ? 'Industry Group' : 'Sector') + '</th>' : '') +
        '<th style="text-align:right;' + TH + '">Contrib</th><th style="text-align:right;' + TH + '">Cum.</th>' + (showRet ? '<th style="text-align:right;' + TH + '">Ret%</th>' : '');
    }).join('') + '</tr></thead>';
  function cells(d, i){
    var first = i ? GAP + ';' : '';
    if (!d) return '<td style="' + first + 'padding:4px 8px"></td>' + new Array(cpy).join('<td></td>');
    var cat = info === 'ig' ? d.grp : d.sect, NUM = 'text-align:right;padding:4px 8px;font-variant-numeric:tabular-nums';
    return '<td style="' + first + NUM + ';color:var(--mu);font-size:11px">' + d.rank + '</td>' +
      '<td style="padding:4px 8px;white-space:nowrap" title="' + esc(d.co) + '"><b style="font-size:12px;color:var(--navy)">' + d.name + '</b></td>' +
      (info ? '<td style="padding:4px 8px;font-size:11px;color:var(--mu);white-space:nowrap" title="' + esc(cat) + '">' + trunc(cat, info === 'ig' ? 30 : 22) + '</td>' : '') +
      '<td style="' + NUM + ';font-weight:600;color:' + colr(d.contrib) + '">' + sgn2(d.contrib) + '%</td>' +
      '<td style="' + NUM + ';color:var(--mu);font-size:11px">' + sgn2(d.cum) + '%</td>' +
      (showRet ? '<td style="' + NUM + ';font-size:11px;color:' + colr(d.ret) + '">' + (d.ret >= 0 ? '+' : '') + d.ret.toFixed(1) + '%</td>' : '');
  }
  function block(key, title){
    var rows = Math.max.apply(null, years.map(function(y){ return yd[y][key].length; }).concat(0));
    if (!rows) return '';
    var out = '<tr><td colspan="' + (cpy * years.length) + '" style="padding:8px 8px 3px;font-size:10.5px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:' + (key === 'pos' ? 'var(--pos)' : 'var(--neg)') + '">' + title + '</td></tr>';
    for (var r = 0; r < rows; r++){
      out += '<tr style="border-bottom:.5px solid var(--rule);' + (r % 2 ? 'background:var(--surface)' : '') + '">';
      years.forEach(function(y, i){ out += cells(yd[y][key][r], i); });
      out += '</tr>';
    }
    return out;
  }
  var tbody = '<tbody>' + (showPos ? block('pos', showAll ? 'All holdings, top to bottom' : 'Top ' + N + ' contributors') : '') +
    (showNeg && !(showAll && showPos) ? block('neg', showAll ? 'All holdings, bottom to top' : 'Bottom ' + N + ' contributors') : '') + '</tbody>';
  var foot = '<tfoot><tr style="border-top:2px solid var(--navy)">' + years.map(function(y, i){
    var d = yd[y], shown = d.pos.concat(d.neg).reduce(function(s, x){ return s + x.contrib; }, 0), share = Math.abs(d.total) > 1e-9 ? shown / d.total * 100 : 0;
    return '<td colspan="' + cpy + '" style="padding:7px 8px;font-size:11.5px;color:var(--navy);' + (i ? GAP : '') + '">Listed: <b style="color:' + colr(shown) + '">' + sgn2(shown) + '%</b> of <b style="color:' + colr(d.total) + '">' + sgn2(d.total) + '%</b> SPY return <span style="color:var(--mu)">(' + share.toFixed(0) + '%)</span></td>';
  }).join('') + '</tr></tfoot>';
  html += '<div style="overflow-x:auto"><table style="width:auto;border-collapse:collapse;font-size:12px">' + thead + tbody + foot + '</table></div>' +
    '<div style="font-size:11px;color:var(--mu);margin-top:8px;line-height:1.5"><b>Contrib</b> = weight in SPY at the start of the year × the year\'s return (one snapshot per year). <b>Cum.</b> = running total down the list. ' +
    (showRet ? '<b>Ret%</b> = the year\'s price return. ' : '') + '<b>Rank</b> = position among all holdings of that year, 1 = largest contributor.</div>';
  topRoot.innerHTML = html;
}
window.spxTopYear = function(y){ if (P.years[y] && Object.keys(P.years).filter(function(k){ return P.years[k]; }).length === 1) return; P.years[y] = !P.years[y]; renderTop(); };
window.spxTopN = function(n){ P.n = n; P.custom = 0; renderTop(); };
window.spxTopCustom = function(n){ P.custom = n > 0 ? Math.floor(n) : 0; renderTop(); };
window.spxTopSide = function(s){ P.side = s; renderTop(); };
window.spxTopInfo = function(i){ P.info = i; renderTop(); };
window.spxTopRet = function(){ P.ret = !P.ret; renderTop(); };

// top: the S&P pane of Top Contributors · data: SPX_HOLDINGS
export function initSpxSecurities(top, data){
  H = data; topRoot = top;
  if (!H || !H.years || !H.years.length) return false;
  var last = H.years[H.years.length - 1].year;
  P.years = {}; P.years[last] = true;
  renderTop();
  return true;
}
