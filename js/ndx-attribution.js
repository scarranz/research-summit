import { NDX_DATA } from './ndx-attribution-data.js';

const SEC_SHORT = {
  'Information Technology': 'Info Tech',
  'Communication Services': 'Comm. Svcs',
  'Consumer Discretionary': 'Cons. Disc.',
  'Consumer Staples': 'Cons. Staples',
  'Cash, Derivatives and Other Securities': 'Cash / Derivatives',
};
function sShort(s) { return SEC_SHORT[s] || s; }
function pp(v, d) { d = d == null ? 2 : d; return (v >= 0 ? '+' : '') + v.toFixed(d) + 'pp'; }
function pct(v, d) { d = d == null ? 2 : d; return (v >= 0 ? '+' : '') + v.toFixed(d) + '%'; }
function esc(s) { return String(s).replace(/'/g, "\\'"); }

// Module state
var sectors = [], igBySector = {}, secByIG = {};
var exclSecs = new Set(), exclIGs = new Set();
var baseContribs = null, _chart = null;
var igExpanded = {};

// ── Core math ─────────────────────────────────────────────────
function computeContribs(exS, exG) {
  var bySec = {}, byIG = {}, arithmetic = 0, compounded = 1;
  NDX_DATA.hocs.forEach(function(hoc) {
    var exclW = 0;
    hoc.sec.forEach(function(s) {
      if (exS.has(s.s) || exG.has(s.g)) exclW += (s.w || 0);
    });
    var scale = exclW < 100 ? 100 / (100 - exclW) : 1;
    var hocRet = 0;
    hoc.sec.forEach(function(s) {
      if (exS.has(s.s) || exG.has(s.g)) return;
      var c = (s.w || 0) * scale * s.r;
      bySec[s.s] = (bySec[s.s] || 0) + c;
      if (s.g) byIG[s.g] = (byIG[s.g] || 0) + c;
      hocRet += c;
    });
    arithmetic += hocRet;
    compounded *= (1 + hocRet / 100);
  });
  var ytd = (compounded - 1) * 100;
  return { bySec: bySec, byIG: byIG, arithmetic: arithmetic, ytd: ytd, residual: ytd - arithmetic };
}

function hocRet(hoc) {
  var r = 0;
  hoc.sec.forEach(function(s) { r += (s.w || 0) * s.r; });
  return r;
}

function getHoc(n) {
  for (var i = 0; i < NDX_DATA.hocs.length; i++) {
    if (NDX_DATA.hocs[i].n === n) return NDX_DATA.hocs[i];
  }
  return null;
}

function secSnap(secName, hocN) {
  var hoc = getHoc(hocN);
  if (!hoc) return { count: 0, w: 0 };
  var count = 0, w = 0;
  hoc.sec.forEach(function(s) { if (s.s === secName) { count++; w += (s.w || 0); } });
  return { count: count, w: w };
}

function igSnap(igName, hocN) {
  var hoc = getHoc(hocN);
  if (!hoc) return { count: 0, w: 0 };
  var count = 0, w = 0;
  hoc.sec.forEach(function(s) { if (s.g === igName) { count++; w += (s.w || 0); } });
  return { count: count, w: w };
}

// ── Init ──────────────────────────────────────────────────────
function initData() {
  var secSet = new Set(), igMap = {};
  NDX_DATA.hocs.forEach(function(hoc) {
    hoc.sec.forEach(function(s) {
      if (!s.s) return;
      secSet.add(s.s);
      if (s.g) {
        if (!igMap[s.s]) igMap[s.s] = new Set();
        igMap[s.s].add(s.g);
        secByIG[s.g] = s.s;
      }
    });
  });

  baseContribs = computeContribs(new Set(), new Set());

  var CASH = 'Cash, Derivatives and Other Securities';
  sectors = Array.from(secSet).sort(function(a, b) {
    if (a === CASH) return 1;
    if (b === CASH) return -1;
    return (baseContribs.bySec[b] || 0) - (baseContribs.bySec[a] || 0);
  });

  sectors.forEach(function(s) {
    igBySector[s] = Array.from(igMap[s] || []).sort(function(a, b) {
      return (baseContribs.byIG[b] || 0) - (baseContribs.byIG[a] || 0);
    });
  });
}

// ── Formatting helpers ────────────────────────────────────────
function fmtPP(v) {
  if (v == null) return '<span style="color:var(--mu)">—</span>';
  var c = v >= 0 ? 'var(--pos)' : 'var(--neg)';
  return '<span style="color:' + c + ';font-weight:600">' + pp(v) + '</span>';
}

// ── HTML builders ─────────────────────────────────────────────
function kpiHTML() {
  var c = baseContribs;
  var ytdColor = c.ytd >= 0 ? 'var(--pos)' : 'var(--neg)';
  return '<div class="srow" style="margin-bottom:24px">' +
    '<div class="sc" style="border-top-color:' + ytdColor + '">' +
      '<div class="sl">NDX 2026 YTD</div>' +
      '<div class="sv" id="ndx-kpi-ytd" style="color:' + ytdColor + '">' + pct(c.ytd) + '</div>' +
      '<div class="ss">Compounded &middot; 13 HOCs</div>' +
    '</div>' +
    '<div class="sc">' +
      '<div class="sl">Arithmetic Sum</div>' +
      '<div class="sv" id="ndx-kpi-arith" style="font-size:18px">' + pct(c.arithmetic) + '</div>' +
      '<div class="ss">Simple sum of HOC returns</div>' +
    '</div>' +
    '<div class="sc">' +
      '<div class="sl">Compounding Residual</div>' +
      '<div class="sv" id="ndx-kpi-residual" style="font-size:18px;color:var(--steel)">' + pp(c.residual) + '</div>' +
      '<div class="ss">Compounded minus arithmetic</div>' +
    '</div>' +
    '<div class="sc">' +
      '<div class="sl">HOCs</div>' +
      '<div class="sv" style="font-size:24px;color:var(--navy)">13</div>' +
      '<div class="ss">Dec 31 2025 &rarr; Oct 6 2026</div>' +
    '</div>' +
  '</div>';
}

function simPanelHTML() {
  var html = '<div id="ndx-chip-area">';

  // Sector chips
  html += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">';
  sectors.forEach(function(s) {
    var active = !exclSecs.has(s);
    html += '<span class="ndx-chip' + (active ? ' active' : '') + '" onclick="ndxToggleSec(\'' + esc(s) + '\')" title="' + s + '">' + sShort(s) + '</span>';
  });
  html += '</div>';

  // IG chips grouped by sector
  sectors.forEach(function(s) {
    var igs = igBySector[s] || [];
    if (!igs.length) return;
    var secInactive = exclSecs.has(s);
    html += '<div class="ndx-ig-group">';
    html += '<span class="ndx-ig-sector-lbl">' + sShort(s) + '</span>';
    igs.forEach(function(g) {
      var active = !exclIGs.has(g);
      var dimStyle = secInactive ? ' style="opacity:.45"' : '';
      html += '<span class="ndx-chip ndx-chip-sm' + (active ? ' active' : '') + '"' + dimStyle + ' onclick="ndxToggleIG(\'' + esc(g) + '\')" title="' + g + '">' + g + '</span>';
    });
    html += '</div>';
  });

  html += '</div>';

  // Sim result row
  var hasExcl = exclSecs.size > 0 || exclIGs.size > 0;
  html += '<div id="ndx-sim-result" class="ndx-sim-result" style="' + (hasExcl ? '' : 'display:none') + '">';
  if (hasExcl) {
    var sim = computeContribs(exclSecs, exclIGs);
    var delta = sim.ytd - baseContribs.ytd;
    var deltaColor = delta >= 0 ? 'var(--pos)' : 'var(--neg)';
    html += '<span id="ndx-sim-val">Simulated NDX YTD: <strong style="color:var(--navy)">' + pct(sim.ytd) + '</strong> <span style="font-size:11px;color:' + deltaColor + '">(' + pp(delta) + ' vs base)</span></span>';
  } else {
    html += '<span id="ndx-sim-val"></span>';
  }
  html += '<button class="sb-secchip-all" style="margin-left:14px" onclick="ndxResetSim()">Reset</button>';
  html += '</div>';

  return html;
}

function secTbodyHTML() {
  var c = computeContribs(exclSecs, exclIGs);
  var html = '';
  sectors.forEach(function(s) {
    var excl = exclSecs.has(s);
    var o = secSnap(s, 7), cl = secSnap(s, 19);
    var contrib = c.bySec[s] || 0;
    html += '<tr style="' + (excl ? 'opacity:.4;' : '') + '">' +
      '<td><span style="font-weight:600">' + s + '</span></td>' +
      '<td class="num">' + o.count + ' &rarr; ' + cl.count + '</td>' +
      '<td class="num">' + o.w.toFixed(1) + '% &rarr; ' + cl.w.toFixed(1) + '%</td>' +
      '<td class="num">' + fmtPP(contrib) + '</td>' +
    '</tr>';
  });
  html += '<tr style="border-top:.5px solid var(--bdr)">' +
    '<td style="color:var(--mu);font-style:italic;font-size:11px">Compounding Residual</td>' +
    '<td class="num">—</td><td class="num">—</td>' +
    '<td class="num">' + fmtPP(c.residual) + '</td>' +
  '</tr>';
  html += '<tr style="border-top:2px solid var(--navy);background:var(--surface)">' +
    '<td style="font-weight:700;color:var(--navy)">Total (Compounded)</td>' +
    '<td class="num">—</td><td class="num">—</td>' +
    '<td class="num">' + fmtPP(c.ytd) + '</td>' +
  '</tr>';
  return html;
}

function igTbodyHTML() {
  var c = computeContribs(exclSecs, exclIGs);
  var html = '';
  sectors.forEach(function(s) {
    var igs = igBySector[s] || [];
    var expanded = igExpanded[s];
    var caret = expanded ? '&#x25BC;' : '&#x25B6;';
    var secExcl = exclSecs.has(s);
    html += '<tr class="ndx-ig-secrow" onclick="ndxToggleIGSec(\'' + esc(s) + '\')" style="cursor:pointer;' + (secExcl ? 'opacity:.4;' : '') + '">' +
      '<td colspan="5" style="font-weight:700;color:var(--navy);padding-left:10px">' +
        '<span style="font-size:9px;margin-right:7px;color:var(--mu)">' + caret + '</span>' + s +
      '</td>' +
    '</tr>';
    if (expanded) {
      igs.forEach(function(g) {
        var igExcl = exclIGs.has(g);
        var os = igSnap(g, 7), cs = igSnap(g, 19);
        var contrib = c.byIG[g] || 0;
        html += '<tr style="' + (igExcl ? 'opacity:.4;' : '') + 'background:#FAFCFE">' +
          '<td style="padding-left:28px;font-size:10.5px;color:var(--mu)">' + sShort(s) + '</td>' +
          '<td style="font-size:12px">' + g + '</td>' +
          '<td class="num">' + os.count + ' &rarr; ' + cs.count + '</td>' +
          '<td class="num">' + os.w.toFixed(1) + '% &rarr; ' + cs.w.toFixed(1) + '%</td>' +
          '<td class="num">' + fmtPP(contrib) + '</td>' +
        '</tr>';
      });
    }
  });
  return html;
}

function hocTbodyHTML() {
  var html = '';
  NDX_DATA.hocs.forEach(function(hoc) {
    var r = hocRet(hoc);
    var endDate = hoc.close ? hoc.close : '<em style="color:var(--mu)">Open</em>';
    html += '<tr>' +
      '<td class="num" style="font-weight:600;color:var(--navy)">' + hoc.n + '</td>' +
      '<td>' + hoc.eff + '</td>' +
      '<td>' + endDate + '</td>' +
      '<td class="num">' + hoc.sec.length + '</td>' +
      '<td class="num">' + fmtPP(r) + '</td>' +
    '</tr>';
  });
  return html;
}

// ── Chart ─────────────────────────────────────────────────────
function chartDatasets(contribs) {
  var labels = [], data = [], colors = [], borderColors = [];
  sectors.forEach(function(s) {
    labels.push(sShort(s));
    var v = contribs.bySec[s] || 0;
    data.push(parseFloat(v.toFixed(4)));
    if (exclSecs.has(s)) {
      colors.push('rgba(150,150,150,0.25)');
      borderColors.push('rgba(150,150,150,0.4)');
    } else if (v >= 0) {
      colors.push('rgba(23,122,78,0.72)');
      borderColors.push('rgba(23,122,78,0.9)');
    } else {
      colors.push('rgba(155,42,32,0.72)');
      borderColors.push('rgba(155,42,32,0.9)');
    }
  });
  labels.push('Comp. Residual');
  data.push(parseFloat(contribs.residual.toFixed(4)));
  colors.push('rgba(90,110,131,0.45)');
  borderColors.push('rgba(90,110,131,0.7)');
  return { labels: labels, data: data, colors: colors, borderColors: borderColors };
}

function initChart() {
  var canvas = document.getElementById('ndx-chart');
  if (!canvas || typeof Chart === 'undefined') return;
  var c = computeContribs(exclSecs, exclIGs);
  var ds = chartDatasets(c);
  _chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ds.labels,
      datasets: [{
        data: ds.data,
        backgroundColor: ds.colors,
        borderColor: ds.borderColors,
        borderWidth: 1,
        borderRadius: 3,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              var v = ctx.raw;
              return ' ' + (v >= 0 ? '+' : '') + v.toFixed(2) + 'pp';
            }
          },
          bodyFont: { family: 'Inter, sans-serif', size: 12 },
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,.05)' },
          border: { display: false },
          ticks: {
            font: { size: 10, family: 'Inter, sans-serif' },
            color: '#8A93A0',
            callback: function(v) { return (v >= 0 ? '+' : '') + v.toFixed(1) + 'pp'; }
          }
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: { font: { size: 11, family: 'Inter, sans-serif' }, color: '#2B3B4E' }
        }
      }
    }
  });
}

function refreshChart() {
  if (!_chart) return;
  var c = computeContribs(exclSecs, exclIGs);
  var ds = chartDatasets(c);
  _chart.data.labels = ds.labels;
  _chart.data.datasets[0].data = ds.data;
  _chart.data.datasets[0].backgroundColor = ds.colors;
  _chart.data.datasets[0].borderColor = ds.borderColors;
  _chart.update();
}

// ── Update all UI after a toggle ──────────────────────────────
function updateAll() {
  refreshChart();
  var secTbody = document.getElementById('ndx-sec-tbody');
  if (secTbody) secTbody.innerHTML = secTbodyHTML();
  var igTbody = document.getElementById('ndx-ig-tbody');
  if (igTbody) igTbody.innerHTML = igTbodyHTML();
  var simCard = document.getElementById('ndx-sim-card');
  if (simCard) simCard.innerHTML = simPanelHTML();
}

// ── Window-exposed handlers ───────────────────────────────────
window.ndxToggleSec = function(sec) {
  if (exclSecs.has(sec)) {
    exclSecs.delete(sec);
    (igBySector[sec] || []).forEach(function(g) { exclIGs.delete(g); });
  } else {
    exclSecs.add(sec);
    (igBySector[sec] || []).forEach(function(g) { exclIGs.add(g); });
  }
  updateAll();
};

window.ndxToggleIG = function(ig) {
  var sec = secByIG[ig];
  if (exclIGs.has(ig)) {
    exclIGs.delete(ig);
    if (exclSecs.has(sec)) {
      var allExcl = (igBySector[sec] || []).every(function(g) { return exclIGs.has(g); });
      if (!allExcl) exclSecs.delete(sec);
    }
  } else {
    exclIGs.add(ig);
    var allExcl2 = (igBySector[sec] || []).every(function(g) { return exclIGs.has(g); });
    if (allExcl2 && sec) exclSecs.add(sec);
  }
  updateAll();
};

window.ndxResetSim = function() {
  exclSecs.clear();
  exclIGs.clear();
  updateAll();
};

window.ndxToggleIGSec = function(sec) {
  igExpanded[sec] = !igExpanded[sec];
  var tbody = document.getElementById('ndx-ig-tbody');
  if (tbody) tbody.innerHTML = igTbodyHTML();
};

// ── Main entry ────────────────────────────────────────────────
export function loadNdxAttribution(container) {
  exclSecs = new Set();
  exclIGs = new Set();
  igExpanded = {};
  _chart = null;

  initData();

  container.innerHTML =
    kpiHTML() +
    '<div class="sec">' +
      '<div class="sechdr">' +
        '<span class="sect">Sector Return Attribution &mdash; 2026 YTD</span>' +
        '<span class="secn">Contribution in pp per sector &middot; compounding residual shown separately</span>' +
      '</div>' +
      '<div class="card"><div style="position:relative;height:360px"><canvas id="ndx-chart"></canvas></div></div>' +
    '</div>' +
    '<div class="sec">' +
      '<div class="sechdr">' +
        '<span class="sect">Simulation &mdash; NDX Without Sector(s) or Industry Group(s)</span>' +
        '<span class="secn">Toggle off sectors or groups &mdash; weights rescale to 100% &mdash; see what NDX would have returned without them</span>' +
      '</div>' +
      '<div class="card" id="ndx-sim-card">' + simPanelHTML() + '</div>' +
    '</div>' +
    '<div class="sec">' +
      '<div class="sechdr">' +
        '<span class="sect">Attribution by Sector</span>' +
        '<span class="secn">Open = HOC 7 (Dec 31 2025) &middot; Close = HOC 19 (Sep 22 2026) &middot; excluded sectors shown at 40% opacity</span>' +
      '</div>' +
      '<div class="card">' +
        '<div class="twrap"><table class="rt">' +
          '<thead><tr>' +
            '<th>Sector</th>' +
            '<th class="num">Stocks (O&rarr;C)</th>' +
            '<th class="num">Wt % (O&rarr;C)</th>' +
            '<th class="num">Contribution</th>' +
          '</tr></thead>' +
          '<tbody id="ndx-sec-tbody">' + secTbodyHTML() + '</tbody>' +
        '</table></div>' +
      '</div>' +
    '</div>' +
    '<div class="sec">' +
      '<div class="sechdr">' +
        '<span class="sect">Attribution by Industry Group</span>' +
        '<span class="secn">Click a sector row to expand &middot; same Open / Close methodology</span>' +
      '</div>' +
      '<div class="card">' +
        '<div class="twrap"><table class="rt">' +
          '<thead><tr>' +
            '<th>Sector</th>' +
            '<th>Industry Group</th>' +
            '<th class="num">Stocks (O&rarr;C)</th>' +
            '<th class="num">Wt % (O&rarr;C)</th>' +
            '<th class="num">Contribution</th>' +
          '</tr></thead>' +
          '<tbody id="ndx-ig-tbody">' + igTbodyHTML() + '</tbody>' +
        '</table></div>' +
      '</div>' +
    '</div>' +
    '<div class="sec">' +
      '<div class="sechdr">' +
        '<span class="sect">HOC Timeline</span>' +
        '<span class="secn">Holding Observation Construct &mdash; period between NDX rebalances &middot; 13 HOCs cover 2026 YTD</span>' +
      '</div>' +
      '<div class="card">' +
        '<div class="twrap"><table class="rt">' +
          '<thead><tr>' +
            '<th class="num">HOC #</th>' +
            '<th>Start</th>' +
            '<th>End</th>' +
            '<th class="num">Securities</th>' +
            '<th class="num">Period Return</th>' +
          '</tr></thead>' +
          '<tbody>' + hocTbodyHTML() + '</tbody>' +
        '</table></div>' +
      '</div>' +
    '</div>';

  initChart();
}
