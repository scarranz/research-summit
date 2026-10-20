// mh-attrib.js — Market History ▸ "Follow the names": for the best (or worst) contributors of a year picked, what each did in EVERY year 1995-2005
// and what became of it. The Index Analysis sections themselves (sector return, detail & simulation, beaters, top contributors, winners vs losers) are in mh-ia.js.
import { D, NK, st, SEC_COL, esc, n1, sg, pc, cls, med, secBtn, nameCell, heat, breadths, px, lvl, exitYear, fate } from './mh-util.js';

function members(k) { return D.secs.filter(function (s) { return s.w[k] != null && s.r[k] != null; }); }
// price level at the end of year j, with the end of year k = 100 (a name that stopped trading stays at its last close; Bloomberg price outside the index)
function rebased(s, j, k) { var a = lvl(s, j + 1), b = lvl(s, k + 1); return a != null && b != null ? a / b * 100 : null; }
function pubRebased(j, k) { var a = 1, b = 1; D.index.forEach(function (x, i) { if (i <= j) a *= 1 + x.pub / 100; if (i <= k) b *= 1 + x.pub / 100; }); return a / b * 100; }
function nN() { return st.fn.cn > 0 ? st.fn.cn : st.fn.n; }
// the names typed in the box: a ticker, or part of a company name; one match per entry (the biggest weight at any year-end)
function typed() { return String(st.fn.names || '').split(/[,;\n]+/).map(function (x) { return x.trim(); }).filter(Boolean); }
function findName(q) {
  var u = q.toUpperCase(), l = q.toLowerCase(), big = function (s) { return Math.max.apply(null, s.w.map(function (v) { return v || 0; })); };
  var by = function (fn) { return D.secs.filter(fn).sort(function (a, b) { return big(b) - big(a); })[0]; };
  return by(function (s) { return (s.t || '').toUpperCase() === u; }) || by(function (s) { return s.n.toLowerCase().indexOf(l) === 0; }) || by(function (s) { return s.n.toLowerCase().indexOf(l) >= 0; });
}
function fnList(k) {
  var cn = function (s) { return s.w[k] != null && s.r[k] != null ? s.w[k] * s.r[k] / 100 : null; };
  if (typed().length) {
    var seen = {}; return typed().map(findName).filter(function (s) { if (!s || seen[s.f]) return false; seen[s.f] = 1; return true; }).map(function (s) { return { s: s, c: cn(s) }; });
  }
  var key = st.fn.by === 'ret' ? function (d) { return d.s.r[k]; } : function (d) { return d.c; };
  var pool = members(k).map(function (s) { return { s: s, c: cn(s) }; });
  pool.sort(function (a, b) { return key(b) - key(a); });
  return st.fn.side === 'top' ? pool.slice(0, nN()) : pool.slice(-nN()).reverse();
}
export function renderFollow() {
  var box = document.getElementById('mh-follow'); if (!box) return;
  var f = st.fn, k = D.years.indexOf(f.y), yr = f.y, list = fnList(k), base = D.index[k].basket, b = breadths(), cum = 0, mine = typed().length > 0;
  var rows = list.map(function (d, i) {
    var s = d.s, lastI = -1; s.r.forEach(function (v, j) { if (v != null) lastI = j; }); if (d.c != null) cum += d.c;
    return '<tr><td class="mh-mu">' + (i + 1) + '</td><td class="mh-ell">' + nameCell(s) + '</td><td class="mh-ell"><i class="mh-dot" style="background:' + SEC_COL[s.s] + '"></i>' + s.s + '</td><td class="r">' + (s.w[k] != null ? n1(s.w[k], 1) + '%' : '—') + '</td><td class="r ' + cls(d.c) + '">' + sg(d.c, 2) + '</td><td class="r mh-mu">' + (d.c != null ? n1(cum / base * 100, 0) + '%' : '—') + '</td>' +
      D.years.map(function (y, j) {
        var v = s.r[j], sel = j === k ? ' mh-selcol' : '', ct = f.mode === 'con', e = (v == null && px(s, j) != null && px(s, j + 1) != null) ? (px(s, j + 1) / px(s, j) - 1) * 100 : null;
        if (f.mode === 'cum') { var cu = rebased(s, j, k); if (cu == null) return '<td class="' + sel + '"></td>'; var carried = px(s, j + 1) == null; return '<td class="r mh-cell' + sel + (carried ? ' mh-ext' : '') + '" style="' + heat(cu - 100, 100) + '" title="' + esc(s.n) + ', end of ' + y + ': ' + n1(cu, 0) + ' (end of ' + yr + ' = 100)' + (carried ? '. Stopped trading: carried at its last close.' : '') + '">' + n1(cu, 0) + '</td>'; }
        if (ct && v != null && s.w[j] != null) { var cv = s.w[j] * v / 100; return '<td class="r mh-cell' + sel + '" style="' + heat(cv, 3) + '" title="' + esc(s.n) + ' ' + y + ': ' + sg(cv, 2) + ' pp of the index return (weight ' + n1(s.w[j], 2) + '% x ' + pc(v, 1) + ')">' + sg(cv, 1) + '</td>'; }
        if (ct && (e != null || v != null)) return '<td class="r mh-mu' + sel + '" title="No contribution: not in the S&amp;P 500 for the whole year">&ndash;</td>';
        if (e != null) return '<td class="r mh-cell mh-ext' + sel + '" style="' + heat(e, 100) + '" title="' + esc(s.n) + ' ' + y + ': ' + pc(e, 1) + ' (not in the S&amp;P 500 that year; Bloomberg price)">' + pc(e, 0) + '</td>';
        if (v != null) return '<td class="r mh-cell' + sel + '" style="' + heat(v, 100) + '" title="' + esc(s.n) + ' ' + y + ': ' + pc(v, 1) + '">' + pc(v, 0) + '</td>';
        if (j === lastI + 1 && lastI < NK - 1) return '<td class="r mh-mu' + sel + '" title="Left the S&amp;P 500 after ' + D.years[lastI] + '. Carried at its last close.">out</td>';
        return '<td class="' + sel + '"></td>';
      }).join('') + '<td class="mh-ell">' + fate(s) + '</td></tr>';
  }).join('');
  var ref = function (lab, vals, dec) { return '<tr class="mh-tot"><td></td><td colspan="5">' + lab + '</td>' + vals.map(function (v, j) { return '<td class="r ' + cls(v) + (j === k ? ' mh-selcol' : '') + '">' + (dec ? sg(v, 1) : pc(v, 0)) + '</td>'; }).join('') + '<td></td></tr>'; };
  var lvlRef = function (lab, vals) { return '<tr class="mh-tot"><td></td><td colspan="5">' + lab + '</td>' + vals.map(function (v, j) { return '<td class="r ' + cls(v == null ? null : v - 100) + (j === k ? ' mh-selcol' : '') + '">' + n1(v, 0) + '</td>'; }).join('') + '<td></td></tr>'; };
  var sum = function (a) { var t = 0, n = 0; a.forEach(function (x) { if (x != null) { t += x; n++; } }); return n ? t : null; };
  var cnt = function (fn) { return list.filter(function (d) { return fn(d.s); }).length; }, gone = cnt(function (s) { var y = exitYear(s); return y && y <= 2005; });
  var tbl = '<div class="mh-scroll"><table class="mh-tbl mh-fix mh-strip"><colgroup><col style="width:28px"><col style="width:176px"><col style="width:128px"><col style="width:54px"><col style="width:58px"><col style="width:58px">' + D.years.map(function () { return '<col style="width:50px">'; }).join('') + '<col style="width:140px"></colgroup>' +
    '<thead><tr><th>#</th><th>Name</th><th>Sector</th><th class="r" title="Weight at the start of the year">Weight</th><th class="r" title="Percentage points added to the index return">Added</th><th class="r" title="Running total of the names above, as a share of the index return">Share</th>' + D.years.map(function (y, j) { return '<th class="r' + (j === k ? ' mh-selcol' : '') + '">' + y + '</th>'; }).join('') + '<th>Today</th></tr></thead><tbody>' + rows +
    (f.mode === 'cum' ? lvlRef('Median of these ' + list.length + ' (end of ' + yr + ' = 100)', D.years.map(function (y, j) { return med(list.map(function (d) { return rebased(d.s, j, k); })); })) + lvlRef('S&amp;P 500, published (end of ' + yr + ' = 100)', D.years.map(function (y, j) { return pubRebased(j, k); }))
      : f.mode === 'con' ? ref('Sum of these ' + list.length + ' (pp)', D.years.map(function (y, j) { return sum(list.map(function (d) { return d.s.w[j] != null && d.s.r[j] != null ? d.s.w[j] * d.s.r[j] / 100 : null; })); }), 1) + ref('S&amp;P 500, published (pp)', D.index.map(function (x) { return x.pub; }), 1)
      : ref('Median of these ' + list.length, D.years.map(function (y, j) { return med(list.map(function (d) { return d.s.r[j]; })); })) + ref('Median stock (every member)', b.map(function (x) { return x.med; })) + ref('S&amp;P 500, published', D.index.map(function (x) { return x.pub; }))) + '</tbody></table></div>';
  box.innerHTML = '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px">' + D.years.map(function (y) { return '<button class="ndx-tab-btn' + (y === yr ? ' active' : '') + '" data-act="fny" data-v="' + y + '">' + y + '</button>'; }).join('') + '</div>' +
    '<div class="mh-row" style="' + (mine ? 'opacity:.4;pointer-events:none' : '') + '"><label class="mh-lbl">Show</label>' + secBtn('fns', [['top', 'Top'], ['bot', 'Bottom']], f.side) + '<label class="mh-lbl" style="margin-left:10px">Pick by</label>' + secBtn('fnb', [['con', 'Contribution'], ['ret', 'Return']], f.by) +
    '<label class="mh-lbl" style="margin-left:10px">How many</label>' + secBtn('fnn', [[5, '5'], [10, '10'], [20, '20']], f.cn > 0 ? 0 : f.n) + '<input type="number" min="1" max="200" placeholder="Any" value="' + (f.cn > 0 ? f.cn : '') + '" class="mh-sel" style="width:64px" data-act="fncn"></div>' +
    '<div class="mh-row"><label class="mh-lbl">Show each year as</label>' + secBtn('fnm', [['con', 'Contribution'], ['ret', 'Return'], ['cum', 'Cumulative, base 100']], f.mode) + '<label class="mh-lbl" style="margin-left:10px">Or follow names you choose</label><input type="text" class="mh-sel" style="width:300px" placeholder="tickers or names: MSFT, Enron, WorldCom" value="' + esc(f.names || '') + '" data-act="fnt">' + (mine ? '<button class="ndx-tab-btn" data-act="fnx" data-v="1">Clear</button>' : '') + '</div>' +
    '<div class="mh-read">' + (mine ? 'The ' + list.length + ' names you chose' + (typed().length > list.length ? ' (' + (typed().length - list.length) + ' typed but not found: only names that were S&amp;P 500 members at a year-end 1994-2004 are in the data)' : '') + ': in ' + yr + ' they added ' + n1(cum, 1) + ' pp of the index\'s ' + n1(base, 1) + '%. ' : 'The ' + list.length + (f.side === 'top' ? ' top ' : ' bottom ') + 'S&amp;P 500 members of ' + yr + ' by ' + (f.by === 'ret' ? 'price return' : 'contribution') + ' added ' + n1(cum, 1) + ' pp of the index\'s ' + n1(base, 1) + '%. ') + 'Today: ' + cnt(function (s) { return s.st === 'SPX'; }) + ' are in the S&amp;P 500, ' + cnt(function (s) { return s.st === 'ACQ' || s.st === 'OTH'; }) + ' were acquired or delisted, ' + cnt(function (s) { return s.st === 'BK'; }) + ' went bankrupt, ' + cnt(function (s) { return s.st === 'LIVE'; }) + ' are listed outside the index. ' + (gone ? 'Only ' + gone + ' had left the index by Dec 2005.' : 'None had left the index by Dec 2005.') + '</div>' + tbl +
    '<div class="mh-note">' + (mine ? 'Your names, in the order typed' : 'Ranked by ' + (f.by === 'ret' ? 'price return' : 'weight × return') + ' in ' + yr) + ' (framed column). Every column is that year\'s ' + (f.mode === 'con' ? 'contribution to the index return, in percentage points (weight at the start of the year × price return; a dash = not a member for the whole year)' : f.mode === 'cum' ? 'price level at the end of the year, with the end of ' + yr + ' = 100 (earlier years scaled back with the returns before, later years forward with the returns after)' : 'price return') + '. Italic = the name was not in the S&amp;P 500 that year (before it joined, or after it left and kept trading): price return from Bloomberg. "out" = left the index and no price after.</div>' + exitTiming();
}
function exitTiming() {
  var rows = ['ACQ', 'BK', 'OTH'].map(function (c) {
    var L = D.secs.filter(function (s) { return s.st === c; }), by = L.filter(function (s) { return exitYear(s) && exitYear(s) <= 2005; }).length, af = L.filter(function (s) { return exitYear(s) && exitYear(s) > 2005; }).length;
    return '<tr><td><b>' + { ACQ: 'Acquired / merged', BK: 'Bankrupt', OTH: 'Delisted, other' }[c] + '</b></td><td class="r">' + L.length + '</td><td class="r">' + by + '</td><td class="r">' + af + '</td><td class="r">' + (L.length - by - af) + '</td></tr>'; }).join('');
  return '<details class="mh-more" style="margin-top:14px"><summary><b>When did the names actually leave?</b><span class="mh-mu"> most acquisitions came after the study window</span></summary><div class="mh-moreb"><div class="mh-scroll"><table class="mh-tbl"><thead><tr><th>Fate today</th><th class="r">Names</th><th class="r">Left by Dec 2005</th><th class="r">Left after 2005</th><th class="r">No date in Bloomberg</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="mh-note">All ' + D.secs.length + ' names that were members at any year-end from Dec 1994 to Dec 2004. From the delisting date in the Bloomberg workbook. "Acquired" can mean a deal 5 or 15 years after the window.</div></div></details>';
}
export function followAct(a, v) {
  if (a === 'fny') { st.fn.y = +v; renderFollow(); return true; }
  if (a === 'fns') { st.fn.side = v; renderFollow(); return true; }
  if (a === 'fnn') { st.fn.n = +v; st.fn.cn = 0; renderFollow(); return true; }
  if (a === 'fnb') { st.fn.by = v; renderFollow(); return true; }
  if (a === 'fncn') { st.fn.cn = +v > 0 ? Math.floor(+v) : 0; renderFollow(); return true; }
  if (a === 'fnt') { st.fn.names = String(v || ''); renderFollow(); return true; }
  if (a === 'fnx') { st.fn.names = ''; renderFollow(); return true; }
  if (a === 'fnm') { st.fn.mode = v; renderFollow(); return true; }
  return false;
}
