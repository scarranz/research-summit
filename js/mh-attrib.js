// mh-attrib.js — Market History ▸ the Index Analysis views for 1995-2005, built from the same S&P 500 members:
//   Sector return / contribution / weight, every year side by side (click a year to open it)
//   Then, for the year picked: Attribution detail & simulation · Top contributors · Winners vs losers
// Weights and returns: Bloomberg, the analyst's workbook (docs/MARKET_HISTORY.md). Price returns, members at the start of each year.
import { D, K0, NK, st, SEC_COL, esc, n1, sg, pc, pp, cls, med, snapLbl, secBtn, nameCell, heat, showTip, hideTip, breadths, px, exitYear, fate } from './mh-util.js';

var SM = [['ret', 'Return'], ['con', 'Contribution'], ['wgt', 'Weight at the start of the year']];

// ─── sector table: all eleven years side by side ───────────
function secVal(k, sc, m) {
  var d = D.sectors[k].d[sc];
  if (!d || !(d.w > 0)) return null;
  return m === 'ret' ? d.c / d.w * 100 : m === 'con' ? d.c : d.w;
}
export function renderSector() {
  var box = document.getElementById('mh-sec'); if (!box) return;
  var m = st.sm, ys = D.years, yh = function (y) { return '<th class="r mh-yh' + (y === st.yr ? ' mh-selcol' : '') + '" data-act="yr" data-v="' + y + '" title="Open ' + y + ' below">' + y + '</th>'; };
  var cell = function (v, k) {
    var sel = D.years[k] === st.yr ? ' mh-selcol' : '';
    if (v == null) return '<td class="r mh-mu' + sel + '">—</td>';
    if (m === 'wgt') return '<td class="r' + sel + '">' + n1(v, 1) + '%</td>';
    return '<td class="r mh-cell' + sel + '" style="' + heat(v, m === 'ret' ? 60 : 6) + '">' + (m === 'ret' ? pc(v, 0) : n1(v, 1)) + '</td>';
  };
  var rows = D.meta.sectors.map(function (sc) {
    var chain = 1, ok = false;
    var tds = ys.map(function (y, k) { var v = secVal(k, sc, m); if (m === 'ret' && v != null) { chain *= 1 + v / 100; ok = true; } return cell(v, k); }).join('');
    return '<tr><td><i class="mh-dot" style="background:' + SEC_COL[sc] + '"></i>' + sc + '</td>' + tds + (m === 'ret' ? '<td class="r mh-sepl ' + cls(chain - 1) + '" title="The yearly sector returns chained; the sector\'s members change every year">' + (ok ? pc((chain - 1) * 100, 0) : '—') + '</td>' : '') + '</tr>';
  }).join('');
  var tot = function (lab, vals, bold, extra) { return '<tr class="mh-tot"><td>' + lab + '</td>' + vals.map(function (v, k) { return m === 'wgt' ? '<td class="r' + (ys[k] === st.yr ? ' mh-selcol' : '') + '">' + n1(v, 0) + '%</td>' : '<td class="r ' + cls(v) + (ys[k] === st.yr ? ' mh-selcol' : '') + '">' + (m === 'ret' ? pc(v, 1) : sg(v, 1)) + '</td>'; }).join('') + (extra || (m === 'ret' ? '<td class="mh-sepl"></td>' : '')) + '</tr>'; };
  var pubChain = ys.reduce(function (a, y, k) { return a * (1 + D.index[k].pub / 100); }, 1), basChain = ys.reduce(function (a, y, k) { return a * (1 + D.index[k].basket / 100); }, 1);
  var foot = m === 'ret' ? tot('S&amp;P 500, members (size-weighted)', D.index.map(function (x) { return x.basket; }), 0, '<td class="r mh-sepl ' + cls(basChain - 1) + '">' + pc((basChain - 1) * 100, 0) + '</td>') +
      tot('S&amp;P 500, published', D.index.map(function (x) { return x.pub; }), 0, '<td class="r mh-sepl ' + cls(pubChain - 1) + '">' + pc((pubChain - 1) * 100, 0) + '</td>')
    : m === 'con' ? tot('S&amp;P 500, members', D.index.map(function (x) { return x.basket; })) : tot('Total', ys.map(function () { return 100; }));
  var what = { ret: 'Price return of the sector\'s members in the year (weighted by their size at the start of the year).', con: 'Percentage points each sector added to the index return (its weight times its return); the column adds up to the index.', wgt: 'Share of the index each sector held on the first trading day of the year.' }[m];
  box.innerHTML = '<div class="mh-row"><label class="mh-lbl">Show</label>' + secBtn('sm', SM, m) + '</div><div class="mh-read">' + what + ' Click a year to open it below.</div>' +
    '<div class="mh-scroll"><table class="mh-tbl mh-fix mh-sectbl"><colgroup><col style="width:210px">' + ys.map(function () { return '<col style="width:68px">'; }).join('') + (m === 'ret' ? '<col style="width:96px">' : '') + '</colgroup><thead><tr><th>Sector</th>' + ys.map(yh).join('') + (m === 'ret' ? '<th class="r mh-sepl">1995-2005, chained</th>' : '') + '</tr></thead><tbody>' + rows + foot + '</tbody></table></div>' +
    '<div class="mh-note">Sectors are Bloomberg Industry Classification as of today, applied to every year. A year counts the names that were members at its first trading day. Real Estate had only a few names in the index until the 2000s. The basket differs from the published index by the names without a market value in the workbook (see the notes at the end).</div>';
}

// ─── the year picked: simulation, contributors, winners vs losers ───
function members(k) { return D.secs.filter(function (s) { return s.w[k] != null && s.r[k] != null; }); }
function sum(a, f) { return a.reduce(function (x, y) { return x + f(y); }, 0); }
function shortName(s) { return s.t || s.n.split(' ')[0]; }
function yearBar() {
  return '<div class="mh-row"><label class="mh-lbl">Year</label><span class="sb-toggle mh-seg">' + D.years.map(function (y) { return '<button class="sb-tbtn' + (y === st.yr ? ' active' : '') + '" data-act="yr" data-v="' + y + '">' + y + '</button>'; }).join('') + '</span></div>';
}

// Attribution detail & simulation: tick names (or a whole sector) to see the index without them
function simBlock(k) {
  var all = members(k), tw = sum(all, function (s) { return s.w[k]; }), base = sum(all, function (s) { return s.w[k] * s.r[k]; }) / tw;
  var keep = all.filter(function (s) { return !st.ex[s.f]; }), out = all.length - keep.length;
  var kw = sum(keep, function (s) { return s.w[k]; }), ret2 = kw ? sum(keep, function (s) { return s.w[k] * s.r[k]; }) / kw : null, wout = tw - kw;
  var tile = function (big, cap, sub, c) { return '<div class="mh-tile"><div class="mh-big ' + (c || '') + '">' + big + '</div><div class="mh-cap">' + cap + '</div><div class="mh-sub">' + sub + '</div></div>'; };
  var tiles = '<div class="mh-tiles mh-tiles3">' + tile(pc(base, 1), 'All ' + all.length + ' members', 'size-weighted price return; published index ' + pc(D.index[k].pub, 1), cls(base)) +
    tile(out ? pc(ret2, 1) : '—', out ? 'Without the ' + out + ' ticked names' : 'Without the ticked names', out ? n1(wout, 1) + '% of the index removed' : 'tick names below, or use a button', out ? cls(ret2) : '') +
    tile(out ? pp(ret2 - base, 1) : '—', 'Effect of removing them', out ? 'the index return changes by this much' : '', out ? cls(ret2 - base) : '') + '</div>';
  var rank = all.slice().sort(function (a, b) { return b.w[k] * b.r[k] - a.w[k] * a.r[k]; });
  var btn = function (v, t) { return '<button class="mh-btn" data-act="exq" data-v="' + v + '">' + t + '</button>'; };
  var bar = '<div class="mh-row"><label class="mh-lbl">Remove</label>' + btn('top5', 'Top 5 contributors') + btn('top10', 'Top 10') + btn('top20', 'Top 20') + btn('bot10', 'Worst 10 detractors') + btn('clr', 'Clear') + '</div>';
  var secs = D.meta.sectors.map(function (sc) {
    var L = all.filter(function (s) { return s.s === sc; }); if (!L.length) return '';
    var w = sum(L, function (s) { return s.w[k]; }), c = sum(L, function (s) { return s.w[k] * s.r[k]; }) / 100, nx = L.filter(function (s) { return st.ex[s.f]; }).length, open = !!st.sx[sc];
    var h = '<tr class="mh-sechd"><td><input type="checkbox" data-act="exs" data-v="' + esc(sc) + '"' + (nx === L.length ? ' checked' : '') + ' title="Tick the whole sector"></td><td data-act="sx" data-v="' + esc(sc) + '" class="mh-tg"><span class="mh-car">' + (open ? '▾' : '▸') + '</span> <i class="mh-dot" style="background:' + SEC_COL[sc] + '"></i><b>' + sc + '</b> <span class="mh-mu">' + L.length + ' names' + (nx ? ' · ' + nx + ' ticked' : '') + '</span></td><td class="r">' + n1(w, 1) + '%</td><td class="r ' + cls(c / w * 100) + '">' + pc(c / w * 100, 0) + '</td><td class="r ' + cls(c) + '">' + sg(c, 2) + '</td><td class="r mh-mu">' + pc(c / base * 100, 0) + '</td></tr>';
    if (!open) return h;
    return h + L.sort(function (a, b) { return b.w[k] * b.r[k] - a.w[k] * a.r[k]; }).map(function (s) {
      var c1 = s.w[k] * s.r[k] / 100;
      return '<tr class="mh-nm' + (st.ex[s.f] ? ' ex' : '') + '"><td><input type="checkbox" data-act="exn" data-v="' + s.f + '"' + (st.ex[s.f] ? ' checked' : '') + '></td><td class="mh-ind">' + nameCell(s) + '</td><td class="r">' + n1(s.w[k], 2) + '%</td><td class="r ' + cls(s.r[k]) + '">' + pc(s.r[k], 0) + '</td><td class="r ' + cls(c1) + '">' + sg(c1, 2) + '</td><td class="r mh-mu">' + pc(c1 / base * 100, 1) + '</td></tr>';
    }).join('');
  }).join('');
  var tbl = '<div class="mh-scroll"><table class="mh-tbl mh-fix"><colgroup><col style="width:34px"><col><col style="width:80px"><col style="width:80px"><col style="width:110px"><col style="width:150px"></colgroup><thead><tr><th></th><th>Sector, then its names (click a sector to open it)</th><th class="r">Weight</th><th class="r">Return</th><th class="r">Contribution, pp</th><th class="r">Share of return</th></tr></thead><tbody>' + secs + '</tbody></table></div>';
  var top5 = rank.slice(0, 5);
  var read = '<div class="mh-read">In ' + D.years[k] + ' the ' + all.length + ' members returned ' + pc(base, 1) + '. The five names that added the most (' + top5.map(function (s) { return esc(shortName(s)); }).join(', ') + ') contributed ' + n1(sum(top5, function (s) { return s.w[k] * s.r[k] / 100; }), 1) + ' pp' + (base > 0 ? ', ' + n1(sum(top5, function (s) { return s.w[k] * s.r[k] / 100; }) / base * 100, 0) + '% of the index return,' : ',') + ' with ' + n1(sum(top5, function (s) { return s.w[k]; }), 1) + '% of the weight.</div>';
  return '<div class="mh-sh">Attribution detail and simulation <span class="mh-mu">what the index would have done without some names</span></div>' + read + tiles + bar + tbl +
    '<div class="mh-note">Simulation: the remaining names are re-weighted to 100% of what is left; the return is the weighted average of their price returns. Tick a sector to remove all its names.</div>';
}

// Top contributors: the full 1995-2005 path of each name, so what happened before and after is in the same row
function fnList(k) {
  var pool = members(k).map(function (s) { return { s: s, c: s.w[k] * s.r[k] / 100 }; });
  pool.sort(function (a, b) { return b.c - a.c; });
  return st.fn.side === 'top' ? pool.slice(0, st.fn.n) : pool.slice(-st.fn.n).reverse();
}
function contribBlock(k) {
  var f = st.fn, yr = D.years[k], list = fnList(k), base = D.index[k].basket, b = breadths();
  var cum = 0;
  var rows = list.map(function (d, i) {
    var s = d.s, lastI = -1; s.r.forEach(function (v, j) { if (v != null) lastI = j; }); cum += d.c;
    return '<tr><td class="mh-mu">' + (i + 1) + '</td><td class="mh-ell">' + nameCell(s) + '</td><td class="mh-ell"><i class="mh-dot" style="background:' + SEC_COL[s.s] + '"></i>' + s.s + '</td><td class="r">' + n1(s.w[k], 1) + '%</td><td class="r ' + cls(d.c) + '">' + sg(d.c, 2) + '</td><td class="r mh-mu">' + n1(cum / base * 100, 0) + '%</td>' +
      D.years.map(function (y, j) {
        var v = s.r[j], sel = j === k ? ' mh-selcol' : '', e = (v == null && px(s, j) != null && px(s, j + 1) != null) ? (px(s, j + 1) / px(s, j) - 1) * 100 : null;
        if (e != null) return '<td class="r mh-cell mh-ext' + sel + '" style="' + heat(e, 100) + '" title="' + esc(s.n) + ' ' + y + ': ' + pc(e, 1) + ' (not in the S&amp;P 500 that year; Bloomberg price)">' + pc(e, 0) + '</td>';
        if (v != null) return '<td class="r mh-cell' + sel + '" style="' + heat(v, 100) + '" title="' + esc(s.n) + ' ' + y + ': ' + pc(v, 1) + '">' + pc(v, 0) + '</td>';
        if (j === lastI + 1 && lastI < NK - 1) return '<td class="r mh-mu' + sel + '" title="Left the S&amp;P 500 after ' + D.years[lastI] + '. Carried at its last close.">out</td>';
        return '<td class="' + sel + '"></td>';
      }).join('') + '<td class="mh-ell">' + fate(s) + '</td></tr>';
  }).join('');
  var ref = function (lab, vals) { return '<tr class="mh-tot"><td></td><td colspan="5">' + lab + '</td>' + vals.map(function (v, j) { return '<td class="r ' + cls(v) + (j === k ? ' mh-selcol' : '') + '">' + pc(v, 0) + '</td>'; }).join('') + '<td></td></tr>'; };
  var cnt = function (fn) { return list.filter(function (d) { return fn(d.s); }).length; }, gone = cnt(function (s) { var y = exitYear(s); return y && y <= 2005; });
  var tbl = '<div class="mh-scroll"><table class="mh-tbl mh-fix mh-strip"><colgroup><col style="width:28px"><col style="width:176px"><col style="width:128px"><col style="width:54px"><col style="width:58px"><col style="width:58px">' + D.years.map(function () { return '<col style="width:50px">'; }).join('') + '<col style="width:140px"></colgroup>' +
    '<thead><tr><th>#</th><th>Name</th><th>Sector</th><th class="r" title="Weight at the start of the year">Weight</th><th class="r" title="Percentage points added to the index return">Added</th><th class="r" title="Running total of the names above, as a share of the index return">Share</th>' + D.years.map(function (y, j) { return '<th class="r' + (j === k ? ' mh-selcol' : '') + '">' + y + '</th>'; }).join('') + '<th>Today</th></tr></thead><tbody>' + rows +
    ref('Median of these ' + f.n, D.years.map(function (y, j) { return med(list.map(function (d) { return d.s.r[j]; })); })) + ref('Median stock (every member)', b.map(function (x) { return x.med; })) + ref('S&amp;P 500, published', D.index.map(function (x) { return x.pub; })) + '</tbody></table></div>';
  return '<div class="mh-sh">Top contributors <span class="mh-mu">and what became of them</span></div><div class="mh-row"><label class="mh-lbl">Show</label>' + secBtn('fns', [['top', 'Best'], ['bot', 'Worst']], f.side) +
    '<label class="mh-lbl" style="margin-left:10px">How many</label>' + secBtn('fnn', [[5, '5'], [10, '10'], [20, '20']], f.n) + '</div>' +
    '<div class="mh-read">The ' + f.n + (f.side === 'top' ? ' biggest contributors' : ' biggest detractors') + ' of ' + yr + ' added ' + n1(cum, 1) + ' pp of the index\'s ' + n1(base, 1) + '%. Today: ' + cnt(function (s) { return s.st === 'SPX'; }) + ' are in the S&amp;P 500, ' + cnt(function (s) { return s.st === 'ACQ' || s.st === 'OTH'; }) + ' were acquired or delisted, ' + cnt(function (s) { return s.st === 'BK'; }) + ' went bankrupt, ' + cnt(function (s) { return s.st === 'LIVE'; }) + ' are listed outside the index. ' + (gone ? 'Only ' + gone + ' had left the index by Dec 2005.' : 'None had left the index by Dec 2005.') + '</div>' + tbl +
    '<div class="mh-note">Ranked by weight × return in ' + yr + ' (framed column). Every column is that year\'s price return. Italic = the name was not in the S&amp;P 500 that year (before it joined, or after it left and kept trading): price return from Bloomberg. "out" = left the index and no price after. Grey years in the last column are after the study window.</div>' + exitTiming();
}
function exitTiming() {
  var rows = ['ACQ', 'BK', 'OTH'].map(function (c) {
    var L = D.secs.filter(function (s) { return s.st === c; }), by = L.filter(function (s) { return exitYear(s) && exitYear(s) <= 2005; }).length, af = L.filter(function (s) { return exitYear(s) && exitYear(s) > 2005; }).length;
    return '<tr><td><b>' + { ACQ: 'Acquired / merged', BK: 'Bankrupt', OTH: 'Delisted, other' }[c] + '</b></td><td class="r">' + L.length + '</td><td class="r">' + by + '</td><td class="r">' + af + '</td><td class="r">' + (L.length - by - af) + '</td></tr>'; }).join('');
  return '<details class="mh-more" style="margin-top:14px"><summary><b>When did the names actually leave?</b><span class="mh-mu"> most acquisitions came after the study window</span></summary><div class="mh-moreb"><div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>Fate today</th><th class="r">Names</th><th class="r">Left by Dec 2005</th><th class="r">Left after 2005</th><th class="r">No date in Bloomberg</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="mh-note">All ' + D.secs.length + ' names that were members at any year-end from Dec 1994 to Dec 2004. From the delisting date in the Bloomberg workbook. "Acquired" in the table above can mean a deal 5 or 15 years after the window.</div></div></details>';
}

// Winners vs losers: how the year's returns were spread, and who beat the index
var BINS = [[-1e9, -50, '< −50%'], [-50, -25, '−50 to −25%'], [-25, 0, '−25 to 0%'], [0, 25, '0 to +25%'], [25, 50, '+25 to +50%'], [50, 100, '+50 to +100%'], [100, 1e9, '> +100%']];
function wlBlock(k) {
  var all = members(k), base = D.index[k].basket, b = breadths()[k];
  var cnt = BINS.map(function (x) { return all.filter(function (s) { return s.r[k] >= x[0] && s.r[k] < x[1]; }); });
  var maxN = Math.max.apply(null, cnt.map(function (c) { return c.length; })) || 1, VW = 860, VH = 220, P = { t: 18, r: 14, b: 34, l: 40 }, slot = (VW - P.l - P.r) / BINS.length;
  var g = '', stp = [1, 2, 5, 10, 20, 25, 50, 100].filter(function (v) { return maxN / v <= 5; })[0] || 100; maxN = Math.ceil(maxN / stp) * stp;
  for (var t = 0; t <= maxN; t += stp) { var y = VH - P.b - t / maxN * (VH - P.t - P.b); g += '<line x1="' + P.l + '" x2="' + (VW - P.r) + '" y1="' + y + '" y2="' + y + '" stroke="#EEF1F4"/><text x="' + (P.l - 6) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="#8A93A0">' + t + '</text>'; }
  cnt.forEach(function (c, i) {
    var h = c.length / maxN * (VH - P.t - P.b), x = P.l + i * slot + 5, w = slot - 10, sel = st.bin === i;
    g += '<rect x="' + x + '" y="' + (VH - P.b - h) + '" width="' + w + '" height="' + h + '" rx="3" fill="' + (BINS[i][1] <= 0 ? '#9B2A20' : '#177A4E') + '" opacity="' + (sel ? 1 : .72) + '"/>' +
      (c.length ? '<text x="' + (x + w / 2) + '" y="' + (VH - P.b - h - 5) + '" text-anchor="middle" font-size="11" font-weight="600" fill="#2B3B4E">' + c.length + '</text>' : '') +
      '<text x="' + (x + w / 2) + '" y="' + (VH - P.b + 16) + '" text-anchor="middle" font-size="11" fill="' + (sel ? '#1E2733' : '#8A93A0') + '">' + BINS[i][2] + '</text>' +
      '<rect class="mh-bin" data-act="bin" data-v="' + i + '" x="' + x + '" y="' + P.t + '" width="' + w + '" height="' + (VH - P.b - P.t) + '" fill="transparent" style="cursor:pointer"/>';
  });
  var list = '';
  if (st.bin != null) {
    var c = cnt[st.bin].slice().sort(function (a, z) { return z.r[k] - a.r[k]; });
    list = '<div class="mh-binl"><div class="mh-ch">' + BINS[st.bin][2] + ' · ' + c.length + ' names, best first</div><div class="mh-bing">' + c.map(function (s) { return '<span title="' + esc(s.n) + '"><b>' + esc(shortName(s)) + '</b> ' + esc(s.n.slice(0, 22)) + ' <span class="' + cls(s.r[k]) + '">' + pc(s.r[k], 0) + '</span></span>'; }).join('') + '</div></div>';
  }
  var rows = D.meta.sectors.map(function (sc) {
    var L = all.filter(function (s) { return s.s === sc; }); if (!L.length) return '';
    var up = L.filter(function (s) { return s.r[k] > 0; }).length, bt = L.filter(function (s) { return s.r[k] > base; }).length;
    return '<tr><td><i class="mh-dot" style="background:' + SEC_COL[sc] + '"></i>' + sc + '</td><td class="r">' + L.length + '</td><td class="r">' + up + ' <span class="mh-mu">' + n1(up / L.length * 100, 0) + '%</span></td><td class="r">' + bt + ' <span class="mh-mu">' + n1(bt / L.length * 100, 0) + '%</span></td><td class="r ' + cls(med(L.map(function (s) { return s.r[k]; }))) + '">' + pc(med(L.map(function (s) { return s.r[k]; })), 0) + '</td><td class="r">' + n1(sum(L, function (s) { return s.w[k]; }), 1) + '%</td></tr>';
  }).join('');
  var tot = '<tr class="mh-tot"><td>All members</td><td class="r">' + all.length + '</td><td class="r">' + Math.round(b.up * all.length / 100) + ' <span class="mh-mu">' + n1(b.up, 0) + '%</span></td><td class="r">' + Math.round(b.beat * all.length / 100) + ' <span class="mh-mu">' + n1(b.beat, 0) + '%</span></td><td class="r ' + cls(b.med) + '">' + pc(b.med, 0) + '</td><td class="r">100%</td></tr>';
  return '<div class="mh-sh">Winners vs losers <span class="mh-mu">how the year\'s returns were spread</span></div>' +
    '<div class="mh-read">In ' + D.years[k] + ' ' + n1(b.up, 0) + '% of the members rose and ' + n1(b.beat, 0) + '% beat the index (' + pc(base, 1) + '). The median stock returned ' + pc(b.med, 0) + '. Click a bar to list its names.</div>' +
    '<svg viewBox="0 0 ' + VW + ' ' + VH + '" class="mh-svg">' + g + '</svg>' + list +
    '<div class="mh-scroll" style="margin-top:12px"><table class="mh-tbl mh-fix"><colgroup><col style="width:210px"><col style="width:80px"><col style="width:120px"><col style="width:140px"><col style="width:120px"><col style="width:90px"></colgroup><thead><tr><th>Sector</th><th class="r">Names</th><th class="r">Rose</th><th class="r">Beat the index</th><th class="r">Median return</th><th class="r">Weight</th></tr></thead><tbody>' + rows + tot + '</tbody></table></div>' +
    '<div class="mh-note">Members at the start of ' + D.years[k] + ' with a price at its end. "Beat the index" = a price return above the size-weighted return of all members (' + pc(base, 1) + ').</div>';
}

export function renderYear() {
  var box = document.getElementById('mh-yr'); if (!box) return;
  var k = D.years.indexOf(st.yr);
  box.innerHTML = yearBar() + '<div class="mh-yrbody">' + simBlock(k) + contribBlock(k) + wlBlock(k) + '</div>';
  box.querySelectorAll('.mh-bin').forEach(function (e) {
    e.addEventListener('mousemove', function (ev) { var i = +e.getAttribute('data-v'); showTip('<b>' + BINS[i][2] + '</b> · ' + members(k).filter(function (s) { return s.r[k] >= BINS[i][0] && s.r[k] < BINS[i][1]; }).length + ' names<div class="mh-mu">click to list them</div>', ev); });
    e.addEventListener('mouseleave', hideTip);
  });
}

// click / change handlers for this module; returns true when it handled the action
export function attribAct(a, v, el) {
  if (a === 'yr') { st.yr = +v; st.ex = {}; st.bin = null; renderSector(); renderYear(); return true; }
  if (a === 'sm') { st.sm = v; renderSector(); return true; }
  if (a === 'fns') { st.fn.side = v; renderYear(); return true; }
  if (a === 'fnn') { st.fn.n = +v; renderYear(); return true; }
  if (a === 'bin') { st.bin = st.bin === +v ? null : +v; renderYear(); return true; }
  if (a === 'sx') { st.sx[v] = !st.sx[v]; renderYear(); return true; }
  if (a === 'exn') { if (st.ex[v]) delete st.ex[v]; else st.ex[v] = 1; renderYear(); return true; }
  if (a === 'exs') {
    var k = D.years.indexOf(st.yr), L = members(k).filter(function (s) { return s.s === v; }), on = el && el.checked;
    L.forEach(function (s) { if (on) st.ex[s.f] = 1; else delete st.ex[s.f]; }); renderYear(); return true;
  }
  if (a === 'exq') {
    var k2 = D.years.indexOf(st.yr), rank = members(k2).sort(function (x, y) { return y.w[k2] * y.r[k2] - x.w[k2] * x.r[k2]; });
    st.ex = {};
    if (v !== 'clr') (v === 'bot10' ? rank.slice(-10) : rank.slice(0, +v.slice(3))).forEach(function (s) { st.ex[s.f] = 1; });
    renderYear(); return true;
  }
  return false;
}
