// market-history.js — Market History (1995-2005): what happened to the S&P 500's leaders, laggards and everyone else,
// and which conditions of that cycle are (not) present today.
//
// Data: js/market-history-data.js (scripts/market-history/extract_history.py: the analyst's Bloomberg workbook + FRED, R. Shiller, FINRA).
// Method, caveats and what is still missing: docs/MARKET_HISTORY.md.
// Member data = prices, weights and returns of the S&P 500's members (+ Bloomberg prices of the same names outside the index).
// Macro series are public context only: no multiples or fundamentals of the members.
// Page modules: mh-util.js (shared), mh-attrib.js (sector table, year drill-down), this file (the story).
import { SPX_HOLDINGS } from './spx-holdings-data.js';
import { dumbbell } from './ma-charts.js';
import { MHSP } from './market-history-sp.js';
import { D, K0, NK, st, SEC_COL, esc, n1, sg, nf, pc, pp, cls, dn, mean, med, snapLbl, ymLbl, secBtn, showTip, hideTip, mountLine, breadth, breadths, px, lvl, exitYear, Mo, MM, macroAt, FATE_TXT } from './mh-util.js';
import { renderFollow, followAct } from './mh-attrib.js';
import { renderIA, iaAct } from './mh-ia.js';

var root = null;

// ─── facts computed from the data (nothing typed in) ───────
function sp(iso) { var i = MHSP.d.indexOf(iso); return i < 0 ? null : MHSP.c[i]; }
function days(a, b) { return Math.round((new Date(b) - new Date(a)) / 864e5); }
function ix(iso) { return (+iso.slice(0, 4) - 1994) * 12 + (+iso.slice(5, 7) - 1); }       // month index in D.macro
function runs(key, test, from, to) {   // contiguous month ranges [first, last] where test(value) holds
  var out = [], cur = null;
  for (var i = ix(from); i <= ix(to); i++) {
    var v = MM[key][i];
    if (v != null && test(v)) { if (!cur) cur = [Mo[i], Mo[i]]; else cur[1] = Mo[i]; } else if (cur) { out.push(cur); cur = null; }
  }
  if (cur) out.push(cur); return out;
}
var PEAK = '2000-03-24', LOW = '2002-10-09';
function secByName(re) { return D.secs.filter(function (s) { return re.test(s.n); }); }

// ─── 1. the decade in four stages ───────────────────────────
var STAGES = [
  { name: 'Broad rally', y0: 1995, y1: 1997 },
  { name: 'Narrow peak', y0: 1998, y1: 1999 },
  { name: 'The break', y0: 2000, y1: 2002 },
  { name: 'Recovery', y0: 2003, y1: 2005 }
];
function stageOf(y) { return STAGES.filter(function (x) { return y >= x.y0 && y <= x.y1; })[0]; }
function stageCards() {
  var b = breadths();
  return '<div class="mh-stages">' + STAGES.map(function (s, n) {
    var k0 = D.years.indexOf(s.y0), k1 = D.years.indexOf(s.y1), cum = 1, ks = [];
    for (var k = k0; k <= k1; k++) { cum *= 1 + D.index[k].pub / 100; ks.push(k); }
    var yrs = s.y1 - s.y0 + 1, med1 = mean(ks.map(function (k) { return b[k].med; })), up = mean(ks.map(function (k) { return b[k].up; }));
    var li = function (a, v) { return '<div class="mh-sr"><span>' + a + '</span><b>' + v + '</b></div>'; };
    return '<div class="mh-stage"><div class="mh-sn">' + (n + 1) + '</div><div class="mh-stt">' + s.name + '</div><div class="mh-sy">' + s.y0 + '–' + s.y1 + '</div>' +
      '<div class="mh-sbig ' + cls(cum - 1) + '">' + pc((cum - 1) * 100, 0) + '</div><div class="mh-scap">S&amp;P 500, ' + yrs + ' years compounded</div>' +
      li('Median stock, average year', pc(med1, 0)) + li('Names that rose, average year', n1(up, 0) + '%') + li('Top 10 weight at start', n1(b[k0].top10w, 0) + '%') +
      li('Fed funds, Dec to Dec', n1(macroAt('ffr', (s.y0 - 1) + '-12'), 1) + '% → ' + n1(macroAt('ffr', s.y1 + '-12'), 1) + '%') + '</div>';
  }).join('') + '</div><div class="mh-note">The stages are a grouping for reading; every year is in the table below. S&amp;P 500 = published index price return (Bloomberg). Median stock = the median member. Fed funds = FRED, monthly average.</div>';
}
function yearTable() {
  var b = breadths(), last = null;
  var rows = D.years.map(function (y, k) {
    var s = stageOf(y), h = '', c = function (v, d) { return '<td class="r ' + cls(v) + '">' + pc(v, d == null ? 1 : d) + '</td>'; };
    if (s !== last) { last = s; h = '<tr class="mh-grp"><td colspan="11">' + (STAGES.indexOf(s) + 1) + ' · ' + s.name + ' ' + s.y0 + '–' + s.y1 + '</td></tr>'; }
    var cv = macroAt('curve', y + '-12');
    return h + '<tr><td><b>' + y + '</b></td>' + c(D.index[k].pub) + c(b[k].ew) + c(b[k].med) + '<td class="r">' + n1(b[k].up, 0) + '%</td><td class="r">' + n1(b[k].beat, 0) + '%</td><td class="r">' + n1(b[k].top10w, 0) + '%</td><td class="r">' + b[k].n50 + '</td>' +
      '<td class="r">' + n1(macroAt('ffr', y + '-12'), 2) + '%</td><td class="r">' + n1(macroAt('y10', y + '-12'), 2) + '%</td><td class="r ' + cls(cv) + '">' + (cv == null ? '—' : (cv >= 0 ? '+' : '−') + Math.abs(cv).toFixed(2)) + '</td></tr>';
  }).join('');
  return '<div class="mh-ch" style="margin-top:18px">Every year <span class="mh-mu">price returns; the stages above just group these rows</span></div><div class="mh-scroll"><table class="mh-tbl mh-fix"><colgroup><col style="width:70px">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function () { return '<col>'; }).join('') + '</colgroup><thead><tr><th>Year</th><th class="r">S&amp;P 500</th><th class="r" title="Every member counts the same">Average stock</th><th class="r">Median stock</th><th class="r">Names that rose</th><th class="r">Beat the index</th><th class="r" title="At the start of the year">Top 10 weight</th><th class="r" title="How many names make up the first half of the index, at the start of the year">Names for half the index</th><th class="r" title="Last month of the year, monthly average">Fed funds, Dec</th><th class="r">10-yr yield, Dec</th><th class="r" title="10-year minus 2-year Treasury yield; below 0 = inverted">Curve 10y − 2y, Dec</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="mh-note">Average stock = equal-weighted return of the members. "Beat the index" = share of members with a return above the size-weighted return of all members. Members = the names in the index on the first trading day of the year.</div>';
}
function mountTimeline() {
  var cut = Mo.indexOf('2005-12') + 1, xs = Mo.slice(0, cut), recB = runs('rec', function (v) { return v >= 0.5; }, '1994-01', '2005-12').map(function (r) { return { i0: ix(r[0] + '-01'), i1: ix(r[1] + '-01'), color: '#6B7684', op: .16 }; });
  var bear = { i0: ix(PEAK), i1: ix(LOW), color: '#9B2A20', op: .07 };
  var events = D.events.map(function (e) { return { i: ix(e[0]), label: e[0] + ' · ' + e[1] }; });
  mountLine(document.getElementById('mh-t1'), { x: xs, compact: true, title: 'S&P 500', unit: 'index level, monthly average of daily closes', series: [{ key: 'sp', label: 'S&P 500', color: '#1E2733', vals: MM.sp.slice(0, cut), fmt: function (v) { return n1(v, 0); } }], bands: [bear].concat(recB), events: events });
  mountLine(document.getElementById('mh-t2'), { x: xs, compact: true, title: 'Interest rates', unit: '%, monthly average', alwaysLegend: true, series: [
    { key: 'ffr', label: 'Fed funds', color: '#B45309', vals: MM.ffr.slice(0, cut), fmt: function (v) { return n1(v, 2) + '%'; } },
    { key: 'y10', label: '10-year Treasury', color: '#185FA5', vals: MM.y10.slice(0, cut), fmt: function (v) { return n1(v, 2) + '%'; } }], bands: [bear].concat(recB) });
  mountLine(document.getElementById('mh-t3'), { x: xs, compact: true, title: 'Yield curve: 10-year minus 2-year', unit: 'percentage points, monthly average; below 0 = inverted', series: [
    { key: 'cv', label: '10-year minus 2-year', color: '#0F6E56', vals: MM.curve.slice(0, cut), fmt: function (v) { return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2) + ' pp'; } }], bands: [bear].concat(recB) });
}
function chartReading() {
  var pk = sp(PEAK), lo = sp(LOW), dd = days(PEAK, LOW), f0 = macroAt('ffr', '2000-12'), f1 = macroAt('ffr', '2002-12'), s0 = macroAt('sp', '2000-12'), s1 = macroAt('sp', '2002-12');
  var inv = runs('curve', function (v) { return v < 0; }, '1999-01', '2001-12')[0], rec = runs('rec', function (v) { return v >= 0.5; }, '2000-01', '2002-12')[0];
  var li = function (t) { return '<li>' + t + '</li>'; };
  return '<div class="mh-box mh-chartread"><div class="mh-ch">What the three charts show</div><ul class="mh-ul">' +
    li('<b>The fall.</b> From the S&amp;P 500\'s close of ' + nf(pk, 2) + ' (24 Mar 2000) to ' + nf(lo, 2) + ' (9 Oct 2002): ' + pc((lo / pk - 1) * 100, 1) + ' in ' + dd + ' days (shaded red).') +
    li('<b>Rates fell the whole way.</b> The Fed funds rate went from ' + n1(f0, 2) + '% (Dec 2000) to ' + n1(f1, 2) + '% (Dec 2002), ' + n1(f0 - f1, 1) + ' points, while the index\'s monthly average fell ' + dn((s1 / s0 - 1) * 100) + '. The 10-year yield fell too, less: from ' + n1(macroAt('y10', '2000-12'), 2) + '% to ' + n1(macroAt('y10', '2002-12'), 2) + '%.') +
    li('<b>The curve.</b> The 10-year yield was below the 2-year in every month from ' + ymLbl(inv[0]) + ' to ' + ymLbl(inv[1]) + ': the market peak (Mar 2000) came inside that inversion. It turned positive in ' + ymLbl(runs('curve', function (v) { return v > 0; }, inv[1].slice(0, 4) + '-' + inv[1].slice(5, 7), '2001-12')[0][0]) + ', when short rates were falling faster than long ones.') +
    li('<b>The economy.</b> The recession months of the NBER dating (grey) are ' + ymLbl(rec[0]) + ' to ' + ymLbl(rec[1]) + ': the index had already been falling for ' + (ix(rec[0] + '-01') - ix(PEAK)) + ' months when they began.') + '</ul>' +
    '<div class="mh-ch" style="margin-top:12px">How to read it <span class="mh-mu">interpretation, not tested by this data</span></div><div class="mh-plain" style="margin:0">An inverted curve means investors expected short rates to fall, which usually happens when growth is expected to slow; here a recession followed and the Fed cut. The cuts came <i>because</i> things were weakening, so cheaper money did not stop the fall: the market had been priced for earnings that were not arriving, and a lower rate does not change that.</div></div>';
}

// What each event is (plain words), what to take from it, and how it is typed. Every date and fact was checked against the sources in docs/MARKET_HISTORY.md;
// the "take from it" lines are interpretation and say so; numbers inside them are computed from the data.
var EVT = {
  '1996-02-08': ['Telecommunications Act', 'Federal law that rewrote the rules for phone, cable and broadcasting and opened local phone markets to new competitors.'],
  '1997-08-05': ['Tax cut on capital gains', 'Taxpayer Relief Act: the top tax rate on long-term capital gains went from 28% to 20% (assets held more than 18 months).'],
  '1998-09-29': ['Fed cuts after the LTCM rescue', 'The hedge fund LTCM was rescued by 13 banks, organised by the New York Fed (Sep 23); the Fed then cut three times (Sep 29, Oct 15, Nov 17) to 4.75%.'],
  '1999-03-24': ['NATO bombing over Kosovo', 'NATO air campaign against Yugoslavia over Kosovo, 24 Mar to 10 Jun 1999 (78 days). The US took part. A regional conflict, not a US-soil event.'],
  '1999-11-12': ['Banks allowed to merge with insurers and brokers', 'Gramm-Leach-Bliley Act: lets banks, securities firms and insurers belong to the same group; repeals parts of the Glass-Steagall Act.'],
  '2000-03-10': ['Nasdaq peak', 'The Nasdaq Composite closed at 5,048.62, its high of the cycle.'],
  '2000-03-24': ['S&P 500 peak', 'The S&P 500 closed at 1,527.46, its high of the cycle.'],
  '2000-05-16': ['Fed funds to 6.50%', 'The Fed raised its target rate to 6.50%, the top of the period.'],
  '2001-09-11': ['September 11 attacks', 'Attacks in New York and Washington. US stock exchanges stayed closed until Monday 17 September.'],
  '2001-10-07': ['Afghanistan', 'US military operations in Afghanistan begin (air strikes on Kabul and Kandahar).'],
  '2001-12-02': ['Enron bankruptcy', 'Energy company Enron files for bankruptcy after its accounting scandal.'],
  '2002-07-21': ['WorldCom bankruptcy', 'Telecom company WorldCom files for bankruptcy.'],
  '2002-07-30': ['Sarbanes-Oxley Act', 'Law after the accounting scandals: creates an auditor-oversight board (PCAOB), makes the CEO and CFO certify financial reports, requires a check of internal controls.'],
  '2002-10-09': ['S&P 500 low', 'The S&P 500 closed at 776.76, its low of the cycle.'],
  '2003-03-20': ['Iraq', 'US-led invasion of Iraq begins (some sources date it 19 Mar by time zone).'],
  '2003-06-25': ['Fed funds to 1.00%', 'The Fed cut its target rate to 1.00%.'],
  '2005-03-18': ['Index method change', 'S&P starts moving index weights from total market value to float-adjusted market value (finished Sep 2005).']
};
var EV_TAG = { policy: 'Policy', fed: 'Fed', war: 'Conflict', mkt: 'Market', shock: 'Shock', method: 'Index method' };
function memberLine(re, label) {   // "X was in this data: weight at Dec 20xx, return in the next year"
  var s = secByName(re)[0]; if (!s) return '';
  var kmax = 0; s.w.forEach(function (w, k) { if (w != null && w >= (s.w[kmax] || 0)) kmax = k; });
  var lastK = -1; s.r.forEach(function (v, k) { if (v != null) lastK = k; });
  return label + ' was a member: ' + n1(s.w[kmax], 2) + '% of the index at ' + snapLbl(kmax) + ' (its largest weight), and it returned ' + pc(s.r[lastK], 0) + ' in ' + D.years[lastK] + ', its last year in the index. ';
}
var READ = {
  '1996-02-08': function () { return 'A change in the rules, not a market event: it opened phone and cable to competition, so the economics of one sector were being rewritten. Whether it helped cause the telecom collapse of 2000-02 (see WorldCom) is an interpretation this data does not test.'; },
  '1997-08-05': function () { return 'A permanent change in what investors keep from a long-term gain. It explains no single year\'s return; read it as part of the backdrop of the period, not as a cause.'; },
  '1998-09-29': function () { return 'A funding scare at one highly leveraged fund reached the Fed within a week of the rescue. It shows how much borrowed money sat under the market in 1998. The cuts eased conditions; whether they helped fuel the 1999 rally is a question this data cannot answer.'; },
  '1999-03-24': function () { return 'A foreign conflict with US participation and no direct effect on the operations of US companies. It is listed because it was in the 1999 headlines; it is not a market-structure event and nothing in this data links it to the S&amp;P 500.'; },
  '1999-11-12': function () { return 'A structural change for Financials: banks, insurers and brokers could now sit in one group. Its effects play out over many years, past the end of this window.'; },
  '2000-03-10': function () { return 'The technology-heavy Nasdaq peaked ' + days('2000-03-10', PEAK) + ' days before the S&amp;P 500. The leaders turned before the broad index did.'; },
  '2000-03-24': function () { return 'The S&amp;P 500 did not get back to this level inside the window: its last close of 2005 (' + nf(MHSP.c[MHSP.c.length - 1], 2) + ') was ' + dn((MHSP.c[MHSP.c.length - 1] / sp(PEAK) - 1) * 100) + ' below it.'; },
  '2000-05-16': function () { var inv = runs('curve', function (v) { return v < 0; }, '1999-01', '2001-12')[0]; return 'The top of a tightening cycle: the Fed funds rate had gone from 4.75% (Nov 1998) to 6.50%, and the yield curve (10-year minus 2-year) had been inverted since ' + ymLbl(inv[0]) + ', meaning short rates sat above long rates.'; },
  '2001-09-11': function () { var rec = runs('rec', function (v) { return v >= 0.5; }, '2000-01', '2002-12')[0]; return 'An outside shock that arrived when the index had already been falling for more than ' + Math.floor(days(PEAK, '2001-09-10') / 30.44) + ' months and the economy was in recession (NBER months ' + ymLbl(rec[0]) + ' to ' + ymLbl(rec[1]) + '). It is part of this bear market, not its start.'; },
  '2001-10-07': function () { return 'A military operation abroad, weeks after 9/11. It belongs to the backdrop of the period; this data holds no company-level exposure to it.'; },
  '2001-12-02': function () { return memberLine(/enron/i, 'Enron') + 'The market had rated it highly and its accounts could not be relied on. It is the first of two such failures that led to Sarbanes-Oxley: the lesson was about trust in reported numbers, not about one sector.'; },
  '2002-07-21': function () { return memberLine(/worldcom/i, 'WorldCom') + 'A second failure of trust inside a year, ' + Math.round(days('2002-07-21', LOW) / 7) + ' weeks before the S&amp;P 500\'s low.'; },
  '2002-07-30': function () { return 'The rules answer to Enron and WorldCom: executives certify the accounts and an oversight board checks the auditors. It came ' + days('2002-07-30', LOW) + ' days before the S&amp;P 500\'s closing low.'; },
  '2002-10-09': function () { return 'The index closed ' + dn((sp(LOW) / sp(PEAK) - 1) * 100) + ' below its peak, ' + days(PEAK, LOW) + ' days after it. This is where the break ends and the recovery stage begins.'; },
  '2003-03-20': function () { return 'The invasion came ' + Math.round(days(LOW, '2003-03-20') / 30.4) + ' months after the market\'s low (Oct 2002): it did not mark the bottom of the market.'; },
  '2003-06-25': function () { return 'The lowest Fed funds rate of the period: from 6.50% (May 2000) to 1.00%. The monthly average was still ' + n1(macroAt('ffr', '2004-06'), 2) + '% in Jun 2004 and ' + n1(macroAt('ffr', '2005-12'), 2) + '% by Dec 2005, so the recovery stage ran from the bottom of the rate cycle to a rising one.'; },
  '2005-03-18': function () { return 'From here the index counts only shares available to trade (float). Weights after 2005 are not directly comparable with the ones in this study, which matters when today is compared with the 1990s below.'; }
};
function eventsList() {
  var last = null, h = '';
  D.events.forEach(function (e) {
    var y = +e[0].slice(0, 4), s = stageOf(y), info = EVT[e[0]] || [e[1], ''], rd = READ[e[0]];
    if (s !== last) { last = s; h += '<div class="mh-grp mh-grp2">' + (STAGES.indexOf(s) + 1) + ' · ' + s.name + ' ' + s.y0 + '–' + s.y1 + '</div>'; }
    h += '<details class="mh-ev"><summary><span class="mh-evdate">' + e[0] + '</span><b>' + esc(info[0]) + '</b><span class="mh-evtag">' + (EV_TAG[e[2]] || '') + '</span></summary><div class="mh-evb"><div>' + esc(info[1]) + '</div>' +
      (rd ? '<div class="mh-evr"><b>What to take from it</b> <span class="mh-mu">interpretation</span><div>' + rd() + '</div></div>' : '') + '</div></details>';
  });
  return '<div class="mh-evs">' + h + '</div><div class="mh-note">Click an event to open it. The dates are public record (sources in docs/MARKET_HISTORY.md). The page does not show what the market did after each event: many were expected and other news arrived the same weeks, so the data cannot say what an event caused.</div>';
}

// ─── 3. Index Composition: weight by sector ───────────────
function scOpts(cur, lo, hi) { var o = ''; for (var k = lo; k <= hi; k++) o += '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + snapLbl(k) + '</option>'; return o; }
function renderWC() {
  var box = document.getElementById('mh-wc'); if (!box) return;
  var a = st.wc[0], b = st.wc[1], cx = st.wcx, dis = function (on) { return on ? ' disabled style="opacity:.4;cursor:not-allowed"' : ''; };
  // Customize on: the span selects work and the year buttons are off; Customize off: the other way round. Nothing moves.
  box.innerHTML = '<div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;margin-bottom:10px">' + D.years.slice(0, NK - 1).map(function (y, k) { return '<button class="ndx-tab-btn' + (!cx && k === st.wcy ? ' active' : '') + '" data-act="wcy" data-v="' + k + '"' + dis(cx) + '>' + y + '</button>'; }).join('') +
    '<span style="width:1px;height:16px;background:var(--rule);margin:0 6px"></span><button class="ndx-tab-btn' + (cx ? ' active' : '') + '" data-act="wcc" data-v="1">Customize</button>' +
    '<span class="mh-lbl" style="margin-left:8px">From</span><select id="mh-wcf" class="mh-sel"' + (cx ? '' : ' disabled') + '>' + scOpts(a, 0, NK - 2) + '</select><span class="mh-lbl">to</span><select id="mh-wct" class="mh-sel"' + (cx ? '' : ' disabled') + '>' + scOpts(b, 1, NK - 1) + '</select></div><div id="mh-wcbox"></div>';
  var hi = 10;
  D.sectors.forEach(function (y) { D.meta.sectors.forEach(function (sc) { hi = Math.max(hi, Math.ceil(y.d[sc].w / 10) * 10); }); });
  var anchor = D.sectors[NK - 1].d;
  var rows = D.meta.sectors.map(function (sc) { return { name: sc, w0: D.sectors[a].d[sc].w, w1: D.sectors[b].d[sc].w }; }).sort(function (x, y) { return anchor[y.name].w - anchor[x.name].w; });
  dumbbell(document.getElementById('mh-wcbox'), rows, hi, snapLbl(b), snapLbl(a) + ' → ' + snapLbl(b), 'Share of the S&amp;P 500 by sector at each year-end; the sector order is the same whatever the dates. A sector\'s share falls when its stocks fall, or when other stocks rise faster.', snapLbl(a));
}

// ─── 4. did yesterday's winners stay winners? (scatter) ────
// Both axes are fixed (-95% to +20,000%, a ratio scale) whatever the dates, so two periods can be compared by eye; a name beyond a limit sits on the edge.
var SC_TICKS = [-90, -75, -50, 0, 100, 300, 1000, 3000, 10000], SC_LO = Math.log(0.05), SC_HI = Math.log(201);
function scT(r) { return Math.max(SC_LO, Math.min(SC_HI, Math.log(Math.max(1 + r / 100, 0.05)))); }
function scWin() { var d = st.sc.d; return { a: d[0], b: d[1], c: d[2], before: d[1] - d[0], after: d[2] - d[1] }; }
function setSplit(b, before, after) {
  b = Math.max(1, Math.min(NK - 1, b)); before = Math.max(1, Math.min(b, before)); after = Math.max(1, Math.min(NK - b, after));
  st.sc.d = [b - before, b, b + after];
}
function renderSC() {
  var box = document.getElementById('mh-sc'); if (!box) return;
  var w = scWin(), a = w.a, b = w.b, c = w.c, m = st.scm;
  // every name with a price at both the start and the split date, in the index or not; a name that stops trading stays at its last close
  var pts = D.secs.filter(function (s) { return px(s, a) != null && px(s, b) != null && lvl(s, c) != null; }).map(function (s) {
    return { s: s, x: (px(s, b) / px(s, a) - 1) * 100, y: (lvl(s, c) / px(s, b) - 1) * 100, w: s.w[b] };
  });
  var rk = pts.slice().sort(function (p1, p2) { return p2.x - p1.x; }), N = Math.min(m.n, Math.floor(pts.length / 2)), pick = {};
  if (m.side !== 'bot') rk.slice(0, N).forEach(function (d) { pick[d.s.f] = 'top'; });
  if (m.side !== 'top') rk.slice(-N).forEach(function (d) { pick[d.s.f] = 'bot'; });
  var VW = 900, VH = 520, M = { t: 16, r: 20, b: 48, l: 58 }, cw = VW - M.l - M.r, ch = VH - M.t - M.b;
  var X = function (r) { return M.l + (scT(r) - SC_LO) / (SC_HI - SC_LO) * cw; }, Y = function (r) { return M.t + ch - (scT(r) - SC_LO) / (SC_HI - SC_LO) * ch; };
  var g = '', lab = function (t) { return (t > 0 ? '+' : t < 0 ? '−' : '') + Math.abs(t).toLocaleString('en-US') + '%'; };
  SC_TICKS.forEach(function (t) {
    var col = t === 0 ? '#9AA3AF' : '#EEF1F4', sw = t === 0 ? 1.5 : 1;
    g += '<line x1="' + X(t) + '" x2="' + X(t) + '" y1="' + M.t + '" y2="' + (VH - M.b) + '" stroke="' + col + '" stroke-width="' + sw + '"/><text x="' + X(t) + '" y="' + (VH - M.b + 15) + '" text-anchor="middle" font-size="11" fill="#8A93A0">' + lab(t) + '</text>' +
      '<line x1="' + M.l + '" x2="' + (VW - M.r) + '" y1="' + Y(t) + '" y2="' + Y(t) + '" stroke="' + col + '" stroke-width="' + sw + '"/><text x="' + (M.l - 7) + '" y="' + (Y(t) + 4) + '" text-anchor="end" font-size="11" fill="#8A93A0">' + lab(t) + '</text>';
  });
  var yrs = function (n) { return n + (n === 1 ? ' year' : ' years'); };
  g += '<text x="' + (M.l + cw / 2) + '" y="' + (VH - 8) + '" text-anchor="middle" font-size="11" fill="#4A5666">BEFORE · price change over ' + yrs(w.before) + ', ' + snapLbl(a) + ' → ' + snapLbl(b) + '</text>' +
    '<text transform="translate(14,' + (M.t + ch / 2) + ') rotate(-90)" text-anchor="middle" font-size="11" fill="#4A5666">AFTER · ' + yrs(w.after) + ', ' + snapLbl(b) + ' → ' + snapLbl(c) + '</text>';
  var q = { ur: 0, ul: 0, lr: 0, ll: 0 }; pts.forEach(function (d) { q[(d.y >= 0 ? 'u' : 'l') + (d.x >= 0 ? 'r' : 'l')]++; });
  var cap = function (x, y, anchor, t, n) { return '<text x="' + x + '" y="' + y + '" text-anchor="' + anchor + '" font-size="11" font-weight="600" fill="#6B7684" stroke="#fff" stroke-width="3" paint-order="stroke">' + t + ': ' + n + ' names (' + n1(n / pts.length * 100, 0) + '%)</text>'; };
  g += cap(M.l + 8, M.t + 14, 'start', 'Fell before, rose after', q.ul) + cap(VW - M.r - 8, M.t + 14, 'end', 'Rose before, rose after', q.ur) + cap(M.l + 8, VH - M.b - 24, 'start', 'Fell before, fell after', q.ll) + cap(VW - M.r - 8, VH - M.b - 24, 'end', 'Rose before, fell after', q.lr);
  var COL = { top: '#0E7A45', bot: '#B3261E' }, clamped = 0;
  pts.slice().sort(function (p1, p2) { return (pick[p1.s.f] ? 1 : 0) - (pick[p2.s.f] ? 1 : 0); }).forEach(function (d) {
    var k = pick[d.s.f]; if (d.x > 19000 || d.y > 19000) clamped++;
    g += '<circle class="mh-hit" data-i="' + pts.indexOf(d) + '" cx="' + X(d.x) + '" cy="' + Y(d.y) + '" r="' + (k ? 5.5 : 3.2) + '" fill="' + (k ? COL[k] : '#8A93A0') + '" fill-opacity="' + (k ? 0.9 : 0.16) + '" stroke="' + (k ? '#fff' : 'none') + '" stroke-width="1"/>';
  });
  if (N <= 10) pts.filter(function (d) { return pick[d.s.f]; }).forEach(function (d) { g += '<text x="' + (X(d.x) + 8) + '" y="' + (Y(d.y) + 4) + '" font-size="11" font-weight="700" fill="#1E2733" stroke="#fff" stroke-width="3" paint-order="stroke">' + esc(d.s.t || d.s.n.split(' ')[0]) + '</text>'; });
  var sel = pts.filter(function (d) { return pick[d.s.f]; }), medY = function (k) { return med(sel.filter(function (d) { return pick[d.s.f] === k; }).map(function (d) { return d.y; })); };
  var endY = c >= NK ? D.years[NK - 1] : +D.bases[c].slice(0, 4);
  var gone = function (k) { return sel.filter(function (d) { return pick[d.s.f] === k && exitYear(d.s) && exitYear(d.s) <= endY; }).length; };
  var summ = (m.side !== 'bot' ? 'The ' + N + ' best before ' + snapLbl(b) + ' returned a median ' + pc(medY('top'), 0) + ' afterwards (' + gone('top') + ' stopped trading by ' + snapLbl(c) + '). ' : '') + (m.side !== 'top' ? 'The ' + N + ' worst returned a median ' + pc(medY('bot'), 0) + ' afterwards (' + gone('bot') + ' stopped trading). ' : '') + 'All ' + pts.length + ' names: median ' + pc(med(pts.map(function (d) { return d.y; })), 0) + ' afterwards.';
  var sel3 = function (id, cur, lo, hi, lblf) { var o = ''; for (var v = lo; v <= hi; v++) o += '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + lblf(v) + '</option>'; return '<select id="' + id + '" class="mh-sel">' + o + '</select>'; };
  var controls = '<div class="mh-row"><label class="mh-lbl">Split date</label>' + sel3('mh-scb', b, 1, NK - 1, snapLbl) + '<label class="mh-lbl">Years before</label>' + sel3('mh-sca', w.before, 1, b, function (v) { return v; }) + '<label class="mh-lbl">Years after</label>' + sel3('mh-scc', w.after, 1, NK - b, function (v) { return v; }) +
    '<label class="mh-lbl" style="margin-left:10px">Highlight</label>' + secBtn('scs', [['top', 'Best'], ['bot', 'Worst'], ['both', 'Both']], m.side) + '<label class="mh-lbl" style="margin-left:10px">How many</label>' + secBtn('scn', [[10, '10'], [20, '20'], [50, '50']], m.n) + '</div>';
  box.innerHTML = controls + '<div class="mh-read">Each dot is one stock. <b>Left to right</b> = what it did in the ' + yrs(w.before) + ' <i>before</i> ' + snapLbl(b) + '; <b>bottom to top</b> = what it did in the ' + yrs(w.after) + ' <i>after</i>. A dot at the bottom right was a winner that then lost money; a dot at the top left was a laggard that then recovered. ' + summ + '</div>' +
    '<div class="mh-note" style="margin:0 0 8px"><b>How this differs from Top Contributors.</b> Top Contributors ranks the S&amp;P 500 members of <i>one year</i> by how many points each added to the index (weight × return, so size counts) and then follows those names year by year. Here every stock with a price counts, in the index or not, the ranking is by price change over <i>several years</i> before the split date with no weighting by size, and the question is what the whole group did next, not the path of each name.</div>' +
    '<svg viewBox="0 0 ' + VW + ' ' + VH + '" class="mh-svg">' + g + '</svg><div class="mh-key"><span><i class="mh-dot" style="background:' + COL.top + '"></i>Best ' + N + ' before ' + snapLbl(b) + '</span><span><i class="mh-dot" style="background:' + COL.bot + '"></i>Worst ' + N + '</span><span><i class="mh-dot" style="background:#8A93A0;opacity:.35"></i>Everyone else</span></div>' +
    '<div class="mh-note">Best / worst = the biggest gains and losses between ' + snapLbl(a) + ' and ' + snapLbl(b) + ', chosen among every name with a price at both dates, in the S&amp;P 500 or not. The axes never change: both run from −95% to +20,000% on a ratio scale (+100% = doubled, −50% = halved)' + (clamped ? '; ' + clamped + ' names beyond a limit sit on the edge' : '') + '. A name that stops trading stays at its last close. Names with no price at ' + snapLbl(a) + ' or ' + snapLbl(b) + ' are not shown (not listed yet, or already delisted).</div>';
  box.querySelectorAll('.mh-hit').forEach(function (e) {
    e.addEventListener('mousemove', function (ev) { var d = pts[+e.getAttribute('data-i')], s = d.s;
      showTip('<b>' + esc(s.n) + '</b>' + (s.t ? ' ' + esc(s.t) : '') + '<div>' + s.s + (d.w != null ? ' · weight ' + n1(d.w, 2) + '% at ' + snapLbl(b) : ' · not in the index at ' + snapLbl(b)) + '</div><div>Before: <b>' + pc(d.x, 0) + '</b> · After: <b>' + pc(d.y, 0) + '</b></div><div>Today: ' + FATE_TXT[s.st] + (exitYear(s) ? ' (' + exitYear(s) + ')' : '') + '</div>', ev); });
    e.addEventListener('mouseleave', hideTip);
  });
}

// ─── 4b. the winners and laggards of the run-up: what happened next ───
// Quintiles of the 1995-99 price return (members at Dec 1999); the outcome is the 2000-05 price return against the S&P 500's.
function cohortTable(qn, head) {
  var G = D.secs.filter(function (s) { return s.q === qn && s.r05 != null; }), idx = (D.index.slice(5, 11).reduce(function (a, x) { return a * (1 + x.pub / 100); }, 1) - 1) * 100;
  var B = qn === 5 ? [['Kept beating the index', function (s) { return s.r05 > idx; }], ['Fell behind the index', function (s) { return s.r05 <= idx && s.r05 > -75; }], ['Lost more than 75%', function (s) { return s.r05 <= -75; }]]
    : [['Recovered and beat the index', function (s) { return s.r05 > idx; }], ['Stayed behind the index', function (s) { return s.r05 <= idx && s.r05 > -75; }], ['Lost more than 75%', function (s) { return s.r05 <= -75; }]];
  var rows = B.map(function (b) {
    var L = G.filter(b[1]), sec = {}; L.forEach(function (s) { sec[s.s] = (sec[s.s] || 0) + 1; });
    var top = Object.keys(sec).sort(function (x, y) { return sec[y] - sec[x]; }).slice(0, 3).map(function (k) { return k + ' ' + sec[k]; }).join(', '), big = L.slice().sort(function (x, y) { return (y.w[K0] || 0) - (x.w[K0] || 0); }).slice(0, 4).map(function (s) { return esc(s.t || s.n.split(' ')[0]); }).join(', ');
    var gone = L.filter(function (s) { return exitYear(s) && exitYear(s) <= 2005; }).length, inS = L.filter(function (s) { return s.st === 'SPX'; }).length;
    return '<tr><td><b>' + b[0] + '</b></td><td class="r">' + L.length + '</td><td class="r">' + n1(L.length / G.length * 100, 0) + '%</td><td class="r ' + cls(med(L.map(function (s) { return s.r05; }))) + '">' + (L.length ? pc(med(L.map(function (s) { return s.r05; })), 0) : '—') + '</td><td class="r">' + (L.length ? n1(inS / L.length * 100, 0) + '%' : '—') + '</td><td class="r">' + gone + '</td><td class="mh-ell" title="' + esc(top) + '">' + esc(top) + '</td><td class="mh-ell" title="' + big + '">' + big + '</td></tr>';
  }).join('');
  return '<div class="mh-ch" style="margin-top:14px">' + head + ' <span class="mh-mu">' + G.length + ' names; their median 1995-99 return was ' + pc(med(G.map(function (s) { return s.c; })), 0) + '; the S&amp;P 500 returned ' + pc(idx, 0) + ' in 2000-05</span></div>' +
    '<div class="mh-scroll"><table class="mh-tbl mh-fix"><colgroup><col style="width:210px"><col style="width:60px"><col style="width:70px"><col style="width:90px"><col style="width:90px"><col style="width:90px"><col><col style="width:240px"></colgroup><thead><tr><th>What happened next</th><th class="r">Names</th><th class="r">Of group</th><th class="r">Median 2000-05</th><th class="r">In S&amp;P 500 today</th><th class="r" title="Stopped trading by Dec 2005">Gone by 2005</th><th>Main sectors</th><th>Largest in Dec 1999</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}
function cohorts() {
  return '<div class="mh-read">Members at Dec 1999 ranked by their price return in 1995-99 (five equal groups). The top group is the euphoria\'s winners, the bottom group its laggards. What each did in 2000-05 is measured against the S&amp;P 500 itself. This is a split by <b>outcome</b> and by <b>sector</b>: profit and revenue of each name at the time are not in this data, so it cannot yet say whether the survivors were the ones with real earnings.</div>' +
    cohortTable(5, 'The winners of 1995-99 (top fifth)') + cohortTable(1, 'The laggards of 1995-99 (bottom fifth)') +
    '<div class="mh-note">2000-05 = Dec 1999 to Dec 2005 price return; a name that stopped trading is carried at its last close, so a takeover is counted at its last price. "In S&amp;P 500 today" is the Bloomberg membership list of Oct 2026.</div>';
}

// ─── 5. names that joined the index ────────────────────────
function addedNames() {
  var rows = [], pb = [], pa = [], po = [], upBefore = 0, nBefore = 0;
  for (var k = 1; k < NK; k++) {
    var ent = D.secs.filter(function (s) { return s.w[k] != null && s.w[k - 1] == null && s.r[k] != null; }), stay = D.secs.filter(function (s) { return s.w[k] != null && s.w[k - 1] != null && s.r[k] != null; });
    var bef = ent.filter(function (s) { return px(s, k - 1) != null && px(s, k) != null; }).map(function (s) { return (px(s, k) / px(s, k - 1) - 1) * 100; });
    var aft = ent.map(function (s) { return s.r[k]; }), oth = stay.map(function (s) { return s.r[k]; });
    pb = pb.concat(bef); pa = pa.concat(aft); po = po.concat(oth); upBefore += bef.filter(function (v) { return v > 0; }).length; nBefore += bef.length;
    rows.push('<tr><td><b>' + snapLbl(k) + '</b></td><td class="r">' + ent.length + '</td><td class="r">' + bef.length + '</td><td class="r ' + cls(med(bef)) + '">' + pc(med(bef), 0) + '</td><td class="r ' + cls(med(aft)) + '">' + pc(med(aft), 0) + '</td><td class="r ' + cls(med(oth)) + '">' + pc(med(oth), 0) + '</td><td class="r ' + cls(med(aft) - med(oth)) + '">' + pp(med(aft) - med(oth), 0) + '</td></tr>');
  }
  return '<div class="mh-read">Names that joined the index had already risen in the year before they joined: ' + n1(upBefore / nBefore * 100, 0) + '% of them were up, median ' + pc(med(pb), 0) + ' (' + nBefore + ' additions with a price a year earlier). In the year after joining their median return was ' + pc(med(pa), 0) + ', against ' + pc(med(po), 0) + ' for the names already in the index (all years pooled).</div>' +
    '<div class="mh-scroll"><table class="mh-tbl mh-fix"><colgroup><col style="width:110px"><col><col><col><col><col><col></colgroup><thead><tr><th>Added at</th><th class="r">Names added</th><th class="r">With a price a year earlier</th><th class="r">Median return, year before joining</th><th class="r">Median return, year after joining</th><th class="r">Names already in, same year</th><th class="r">Added minus already in</th></tr></thead><tbody>' + rows.join('') + '</tbody></table></div>' +
    '<div class="mh-note">Added at = the first year-end the name appears among the members; "year before" uses the Bloomberg price a year earlier, when the name was outside the index (names not yet listed then are left out of that column). "Year after" = the year starting at the year-end it joined. Medians of price returns.</div>';
}

// ─── 6. where today differs ────────────────────────────────
var TOL = { ffr: 2, y10: 2, curve: 1, base: 5, corp: 5, fed: 20, margin: 1.5, prof: 3, cape: 8, ey: 1.5, cpi: 1.5, un: 1.5, baa: 1, top10: 5, n50: 10 };
var QROW = { corp: 1, fed: 1, prof: 1 };
var SHORT = { ffr: 'Fed funds', y10: '10-year yield', curve: 'yield curve (10y − 2y)', base: 'monetary base / GDP', corp: 'company debt / GDP', fed: 'federal debt / GDP', margin: 'margin debt / GDP', prof: 'corporate profits / GDP', cape: 'CAPE', ey: 'earnings yield', cpi: 'inflation', un: 'unemployment', baa: 'credit spread', top10: 'top-10 weight', n50: 'stocks for half the index' };
function nowHoldings() {
  var ys = SPX_HOLDINGS.years || [], y = ys[ys.length - 1];
  var items = (y.holdings || []).filter(function (h) { return h.w > 0 && h.r != null; }).map(function (h) { return { w: h.w, r: h.r }; });
  return breadth(items);
}
function todayRows() {
  var N = D.now, b = breadths()[K0], nb = nowHoldings(), asOf = SPX_HOLDINGS.asOf, rows = N.rows.slice();
  rows.push({ k: 'top10', group: 'Who carries the index', label: 'Top 10 stocks, share of the index', unit: '%', v: [b.top10w, null, nb.top10w], d: ['1999-12', null, asOf.slice(0, 7)], src: 'Study data (Dec 1999) · SPY holdings in the portal (float-adjusted weights)' });
  rows.push({ k: 'n50', group: 'Who carries the index', label: 'Stocks that make up the first half of the index', unit: 'n', v: [b.n50, null, nb.n50], d: ['1999-12', null, asOf.slice(0, 7)], src: 'Study data · SPY holdings' });
  return rows;
}
function todayDiff(r) { return r.v[2] == null || r.v[0] == null ? null : r.v[2] - r.v[0]; }
function todayBig(r) { var dv = todayDiff(r); return dv != null && Math.abs(dv) >= TOL[r.k]; }
function todayTable() {
  var fm = function (r, v) { return v == null ? '—' : r.unit === 'n' ? String(Math.round(v)) : r.unit === '%' ? n1(v, r.k === 'ffr' || r.k === 'y10' ? 2 : 1) + '%' : r.unit === 'pp' ? sg(v, 2) + ' pp' : sg(v, 1); };
  var dl = function (r, i) { var d = r.d[i]; if (!d) return ''; if (QROW[r.k]) return 'Q' + (Math.floor((+d.slice(5, 7) - 1) / 3) + 1) + ' ' + d.slice(0, 4); return ymLbl(d); };
  var rows = todayRows();
  var last = null, verdicts = { diff: [], close: [] };
  var body = rows.map(function (r) {
    var h = '', dv = todayDiff(r), big = todayBig(r);
    if (r.group !== last) { last = r.group; h = '<tr class="mh-grp"><td colspan="6">' + r.group + '</td></tr>'; }
    if (dv != null) (big ? verdicts.diff : verdicts.close).push(SHORT[r.k] + ' ' + fm(r, r.v[0]) + ' → ' + fm(r, r.v[2]));
    var cell = function (i) { return '<td class="r' + (i === 2 ? ' mh-sepl' : '') + '">' + (r.v[i] == null ? '<span class="mh-mu">—</span>' : fm(r, r.v[i])) + (r.v[i] != null ? '<div class="mh-mu">' + dl(r, i) + '</div>' : '') + '</td>'; };
    var dtxt = dv == null ? '—' : r.unit === '%' || r.unit === 'pp' ? (dv >= 0 ? '+' : '−') + Math.abs(dv).toFixed(r.k === 'ffr' || r.k === 'y10' || r.unit === 'pp' ? 2 : 1) + ' pp' : r.unit === 'n' ? (dv >= 0 ? '+' : '−') + Math.abs(dv).toFixed(0) : (dv >= 0 ? '+' : '−') + Math.abs(dv).toFixed(1);
    return h + '<tr><td><b>' + esc(r.label) + '</b><div class="mh-mu">' + esc(r.src) + (r.note ? ' · ' + esc(r.note) : '') + '</div></td>' + cell(0) + cell(1) + cell(2) + '<td class="r">' + dtxt + '</td><td>' + (dv == null ? '' : '<span class="mh-st ' + (big ? 'mh-st-mid' : 'mh-st-no') + '" title="Different = moved by at least ' + TOL[r.k] + (r.unit === 'n' ? '' : ' ' + (r.unit === 'x' ? 'turns' : 'pp')) + '">' + (big ? 'Different' : 'Similar') + '</span>') + '</td></tr>';
  }).join('');
  return '<div class="mh-scroll"><table class="mh-tbl mh-fix"><colgroup><col><col style="width:110px"><col style="width:110px"><col style="width:110px"><col style="width:110px"><col style="width:96px"></colgroup><thead><tr><th>Measure</th><th class="r">Dec 1999</th><th class="r">Mar 2000<div class="mh-mu" style="text-transform:none;letter-spacing:0">S&amp;P peak</div></th><th class="r mh-sepl">Latest</th><th class="r" title="Latest minus Dec 1999">Change</th><th>Versus 1999</th></tr></thead><tbody>' + body + '</tbody></table></div>' +
    '<div class="mh-read" style="margin-top:12px"><b>Different today:</b> ' + verdicts.diff.join('; ') + '.<br><b>Similar to 1999:</b> ' + verdicts.close.join('; ') + '.</div>' +
    '<div class="mh-note">"Different" = moved by at least these margins (a fixed rule per measure, not a judgement of risk): ' + Object.keys(TOL).map(function (k) { return SHORT[k] + ' ' + TOL[k] + (k === 'cape' ? ' turns' : k === 'n50' ? ' names' : ' pp'); }).join(', ') + '. Rates, debt, inflation, unemployment: FRED (St. Louis Fed), FINRA for margin debt. Valuation and earnings yield: Robert Shiller\'s S&amp;P 500 data (index level: trailing earnings, not forward). Debt ratios use nominal GDP; the latest GDP and debt quarters are the latest published. Concentration today is from SPY holdings (float-adjusted weights, which count only shares available to trade), so it is not exactly comparable with the 1999 weights. Nothing here says what happens next, and the profits or debt of the individual leaders are not in this data.</div>';
}

// ─── the story ──────────────────────────────────────────────
function bottomLine() {
  var b = breadths(), cohort = D.secs.filter(function (s) { return s.q != null; });
  var q5m = med(cohort.filter(function (s) { return s.q === 5; }).map(function (s) { return s.r05; })), q1m = med(cohort.filter(function (s) { return s.q === 1; }).map(function (s) { return s.r05; }));
  var top = D.secs.filter(function (s) { return s.w[K0] != null; }).sort(function (a, c) { return c.w[K0] - a.w[K0]; }).slice(0, 10);
  var nb = nowHoldings();
  return '<div class="mh-bl"><div class="mh-blh">The short version</div><ol>' +
    '<li>1998-99: the S&amp;P 500 rose ' + pc(D.index[3].pub, 0) + ' and ' + pc(D.index[4].pub, 0) + '. The median stock: ' + pc(b[3].med, 0) + ' and ' + pc(b[4].med, 0) + '.</li>' +
    '<li>2000: the index fell ' + dn(D.index[5].pub) + ' while the average stock rose ' + pc(b[5].ew, 0) + '. The leaders fell first.</li>' +
    '<li>The 1995-99 winners returned ' + pc(q5m, 0) + ' (median) in 2000-05; the laggards ' + pc(q1m, 0) + '.</li>' +
    '<li>' + top.filter(function (s) { return s.st === 'SPX'; }).length + ' of the 10 largest of Dec 1999 are still in the S&amp;P 500. In 2000-05 they lost ' + dn(med(top.map(function (s) { return s.r05; }))) + ' (median).</li>' +
    '<li>Today the top 10 are ' + n1(nb.top10w, 0) + '% of the index, against ' + n1(b[K0].top10w, 0) + '% in 1999.</li></ol></div>';
}
function howTo() {
  return '<details class="mh-more"><summary><b>How to read this page</b><span class="mh-mu"> data, terms, limits</span></summary><div class="mh-moreb"><ul class="mh-ul">' +
    '<li><b>Data.</b> Every member of the S&amp;P 500 on the last trading day of each year, Dec 1994 to Dec 2004: its weight and its price return over the next year. A name that leaves the index is followed to its last close and not replaced. For the same names, Bloomberg prices from before they joined and after they left (where they kept trading) feed the scatter and the italic cells.</li>' +
    '<li><b>Index</b> = size-weighted, as the S&amp;P 500. <b>Average stock</b> = equal-weighted. <b>Median stock</b> = the member in the middle. <b>Weight</b> = share of the index. <b>Contribution</b> = weight × return, in percentage points.</li>' +
    '<li><b>Public context.</b> Rates, the yield curve, recessions, debt, inflation, unemployment and the index-level valuation come from public series (FRED, FINRA, R. Shiller). They are background: nothing in the member data (prices and weights) can test them.</li>' +
    '<li><b>Limits.</b> Prices and weights only: no revenue, profit or valuation of the members. It shows what happened, not why, and not what comes next.</li></ul></div></details>';
}
function takeaway() {
  var b = breadths(), cohort = D.secs.filter(function (s) { return s.q != null; }), nb = nowHoldings();
  var q5m = med(cohort.filter(function (s) { return s.q === 5; }).map(function (s) { return s.r05; })), q1m = med(cohort.filter(function (s) { return s.q === 1; }).map(function (s) { return s.r05; }));
  var top = D.secs.filter(function (s) { return s.w[K0] != null; }).sort(function (a, c) { return c.w[K0] - a.w[K0]; }).slice(0, 10), still = top.filter(function (s) { return s.st === 'SPX'; }).length;
  var f0 = macroAt('ffr', '2000-12'), f1 = macroAt('ffr', '2002-12'), s0 = macroAt('sp', '2000-12'), s1 = macroAt('sp', '2002-12');
  var pb = [], pa = [];
  for (var k = 1; k < NK; k++) D.secs.forEach(function (s) { if (s.w[k] != null && s.w[k - 1] == null) { if (px(s, k - 1) != null) pb.push((px(s, k) / px(s, k - 1) - 1) * 100); if (s.r[k] != null) pa.push(s.r[k]); } });
  var li = function (h, t) { return '<li><b>' + h + '</b> ' + t + '</li>'; };
  var rowsT = todayRows(), tr = {}; rowsT.forEach(function (r) { tr[r.k] = r; });
  var diffL = rowsT.filter(todayBig).map(function (r) { return SHORT[r.k]; }), sameL = rowsT.filter(function (r) { return todayDiff(r) != null && !todayBig(r); }).map(function (r) { return SHORT[r.k]; });
  var lead = '<div class="mh-lead"><b>In one paragraph.</b> In 1998-99 the S&amp;P 500 rose ' + pc(D.index[3].pub, 0) + ' and ' + pc(D.index[4].pub, 0) + ' while the median stock rose ' + pc(b[3].med, 0) + ' and ' + pc(b[4].med, 0) + ', because ten stocks were ' + n1(b[4].top10w, 0) + '% of the index. Those leaders fell first, and a ' + n1(f0 - f1, 1) + '-point fall in the Fed funds rate did not stop the index losing ' + dn((sp(LOW) / sp(PEAK) - 1) * 100) + ' from peak to low. Today the top ten are ' + n1(tr.top10.v[2], 0) + '% of the index (1999: ' + n1(tr.top10.v[0], 0) + '%), and the index-level valuation (CAPE ' + n1(tr.cape.v[2], 1) + ') is close to 1999 (' + n1(tr.cape.v[0], 1) + '), but corporate profits (' + n1(tr.prof.v[2], 1) + '% of GDP against ' + n1(tr.prof.v[0], 1) + '%), government debt (' + n1(tr.fed.v[2], 0) + '% against ' + n1(tr.fed.v[0], 0) + '%) and borrowing to buy stocks (' + n1(tr.margin.v[2], 1) + '% of GDP against ' + n1(tr.margin.v[0], 1) + '%) are on a different footing.</div>';
  return lead + '<div class="mh-two"><div class="mh-box"><div class="mh-ch">What the data shows</div><ul class="mh-ul">' +
    li('The index hid the market.', 'In 1998-99 the S&amp;P 500 rose ' + pc(D.index[3].pub, 0) + ' and ' + pc(D.index[4].pub, 0) + ' while the median stock rose ' + pc(b[3].med, 0) + ' and ' + pc(b[4].med, 0) + '. A few very large names carried the headline: ten stocks were ' + n1(b[4].top10w, 0) + '% of the index at the start of 1999.') +
    li('The leaders turned first.', 'The Nasdaq peaked ' + days('2000-03-10', PEAK) + ' days before the S&amp;P 500. In 2000 the index fell ' + dn(D.index[5].pub) + ' while the average stock rose ' + pc(b[5].ew, 0) + ': the damage was in the biggest names.') +
    li('Last run\'s winners were the wrong thing to own.', 'The 1995-99 winners returned a median ' + pc(q5m, 0) + ' in 2000-05, the laggards ' + pc(q1m, 0) + '.') +
    li('Size did not protect.', still + ' of the 10 largest names of Dec 1999 are still in the S&amp;P 500; in 2000-05 they lost a median ' + dn(med(top.map(function (s) { return s.r05; }))) + '.') +
    li('Cheap money did not stop the fall.', 'Fed funds went from ' + n1(f0, 2) + '% to ' + n1(f1, 2) + '% (Dec 2000 to Dec 2002) while the index\'s monthly average fell ' + dn((s1 / s0 - 1) * 100) + '.') +
    li('Index additions followed strength.', 'Names added to the index had a median ' + pc(med(pb), 0) + ' in the year before joining and ' + pc(med(pa), 0) + ' in the year after.') +
    '</ul></div><div class="mh-box"><div class="mh-ch">What it does not show</div><ul class="mh-ul">' +
    li('That today is 1999.', 'Different today: ' + diffL.join(', ') + '. Similar to 1999: ' + sameL.join(', ') + '. A list of differences, not a signal that a reversal is due.') +
    li('Why a name rose or fell.', 'There are prices and weights, not revenue, profit or the debt of each company. The index-level valuation is a public series, not a test of the leaders.') +
    li('What an event caused.', 'The events table gives context and a reading; the data cannot separate one cause from the others.') +
    li('What happens after 2005.', 'Fates after 2005 (acquired, delisted, still in the index) are in the tables; there is no forecast.') +
    '</ul></div></div>';
}

// ─── page ──────────────────────────────────────────────────
function sec(title, sub, body) { return '<div class="sec"><div class="sechdr"><span class="sect">' + title + '</span><span class="secn">' + (sub || '') + '</span></div>' + body + '</div>'; }
function render() {
  var gaps = D.index.map(function (x) { return Math.abs(x.gap); });
  root.innerHTML =
    '<div class="mh-intro"><div class="mh-h1">Market History · 1995-2005</div><div class="mh-mu">S&amp;P 500 members, weights and price returns, followed to today · Bloomberg, FRED, FINRA, R. Shiller · docs/MARKET_HISTORY.md</div></div>' +
    bottomLine() + howTo() +
    sec('The decade in four stages', 'what the market did, who carried it, what the backdrop was', stageCards() + yearTable() + '<div class="mh-two" style="margin-top:18px"><div id="mh-t1"></div><div id="mh-t2"></div><div id="mh-t3"></div>' + chartReading() + '</div>' +
      '<div class="mh-note">Shaded red: the S&amp;P 500 from its peak (24 Mar 2000) to its low (9 Oct 2002). Shaded grey: recession months (NBER dating, FRED USREC). The S&amp;P line is the monthly average of daily closes (R. Shiller\'s series; it agrees with daily closes to within ' + '0.3% in every month, so the peak close of 1,527 shows as a monthly average of 1,442). Rates and curve: FRED.</div>') +
    sec('What happened when', 'each event, what it is, and what to take from it', eventsList()) +
    sec('Sector Return / Contribution', 'Index Analysis format · 1995-2005', '<div class="card" id="mh-ia-sector"></div>') +
    sec('Attribution Detail &amp; Simulation', 'Index Analysis format · click a row to exclude it', '<div class="card" id="mh-ia-detail"></div>') +
    sec('Sector Summary &mdash; Market Beaters', 'Index Analysis format · plus what the beaters did next', '<div class="card" id="mh-ia-beat"></div>') +
    sec('Index Composition &mdash; Weight Change', 'pick a year, or switch on Customize for any span', '<div class="card" id="mh-wc"></div>') +
    sec('Top Contributors', 'Index Analysis format · and what became of them', '<div class="card" id="mh-ia-top"></div><div class="card" id="mh-follow" style="margin-top:14px"></div>') +
    sec('Winners vs Losers', 'Index Analysis format', '<div class="card" id="mh-ia-wl"></div>') +
    sec('Did yesterday\'s winners stay winners?', 'every stock: what it did before a date, and after', '<div id="mh-sc"></div>') +
    sec('The euphoria\'s winners and laggards: what happened next', 'who kept winning, who collapsed, who recovered', cohorts()) +
    sec('Names added to the index', 'were they already rising when they joined?', addedNames()) +
    sec('Where today differs', 'the same public measures, then and now', todayTable()) +
    sec('Take away', '', takeaway()) +
    '<div class="mh-note" style="margin-top:6px">Basket vs published: the members\' size-weighted return differs from the published index by up to ' + n1(Math.max.apply(null, gaps), 1) + ' pp in a year (names without a market value in the workbook, and names that joined or left during the year).</div>';
  mountTimeline(); renderIA(); renderFollow(); renderWC(); renderSC();
}

var wired = false, built = false;
function build() {
  if (built) return; built = true;
  root = document.getElementById('mh-root'); if (!root) return;
  render();
  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    if (t.tagName === 'INPUT' && t.type === 'number') return;      // handled on change, so typing does not lose focus
    var a = t.getAttribute('data-act'), v = t.getAttribute('data-v');
    if (followAct(a, v) || iaAct(a, v, t)) return;
    if (a === 'scs') { st.scm.side = v; renderSC(); }
    else if (a === 'scn') { st.scm.n = +v; renderSC(); }
    else if (a === 'wcy') { st.wcy = +v; st.wc = [+v, +v + 1]; renderWC(); }
    else if (a === 'wcc') { st.wcx = !st.wcx; if (!st.wcx) st.wc = [st.wcy, st.wcy + 1]; renderWC(); }
  });
  root.addEventListener('change', function (e) {
    var id = e.target.id, ge = function (x) { return +document.getElementById(x).value; };
    if (e.target.getAttribute('data-act') === 'iaTopCustom') { iaAct('iaTopCustom', null, e.target); return; }
    if (id === 'mh-wcf' || id === 'mh-wct') {
      var f = ge('mh-wcf'), t = ge('mh-wct'); if (id === 'mh-wcf' && f >= t) t = f + 1; if (id === 'mh-wct' && t <= f) f = t - 1;
      st.wc = [f, t]; renderWC();
    } else if (id === 'mh-sca' || id === 'mh-scb' || id === 'mh-scc') {
      setSplit(ge('mh-scb'), ge('mh-sca'), ge('mh-scc')); renderSC();
    }
  });
}
// Market Analysis ▸ the tab bar at the top of #tp-rot switches between the index sections and this page
export function initMarketHistoryTabs() {
  if (wired) return; wired = true;
  var tp = document.getElementById('tp-rot'); if (!tp) return;
  tp.querySelectorAll('.ma-tab').forEach(function (b) {
    b.addEventListener('click', function () {
      var hist = b.getAttribute('data-matab') === 'history';
      tp.classList.toggle('mh-on', hist);
      tp.querySelectorAll('.ma-tab').forEach(function (x) { x.classList.toggle('active', x === b); });
      if (hist) build();
    });
  });
}
