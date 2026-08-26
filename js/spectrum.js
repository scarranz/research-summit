// spectrum.js — Investment Spectrum: a draggable map of business models.
//
// Research → Summit → Spectrum. A plane, not a chart:
//   x = how value is created, intangible → tangible (the deck's original line)
//   y = capital intensity, asset-light → asset-heavy (the axis the deck did not have)
//
// Adjacency is the payload. Two companies near each other is a claim that they
// create value the same way and consume capital at the same rate — so the panel
// answers "who are my neighbours, and do I accept that?".
//
// Positions live in localStorage today. When the shape settles this moves to a
// Supabase table so the team shares one map; SPEC_STORE is the only thing that
// has to change (see loadPositions / savePositions).

import { SPECTRUM_ZONES, SPECTRUM_COMPANIES, SPECTRUM_AXES } from './spectrum-data.js';
import {
  METRICS, WINDOWS, seriesFor, averageFor, ttmFor, forwardFor, meta as metricsMeta
} from './spectrum-metrics.js';

var SPEC_STORE = 'summit.spectrum.positions.v1';
// win  — which averaging window the average columns use
// basis— which column the comparison table shows
// sort — { key, dir } for the comparison table
var _spec = null;

// Estimates load on demand from js/results-data/, so the panel and the table
// draw immediately and fill the forward column when it arrives.
var _fwd = {};

function forwardOf(ticker, then) {
  if (ticker in _fwd) return _fwd[ticker];
  _fwd[ticker] = null;
  forwardFor(ticker).then(function (v) {
    _fwd[ticker] = v;
    if (v && then) then();
  });
  return null;
}


function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

/* ─── Persistence ──────────────────────────────────────────────────────── */

function loadPositions() {
  try {
    var raw = localStorage.getItem(SPEC_STORE);
    if (!raw) return {};
    var parsed = JSON.parse(raw);
    return (parsed && typeof parsed === 'object') ? parsed : {};
  } catch (e) {
    return {};
  }
}

function savePositions(pos) {
  try {
    localStorage.setItem(SPEC_STORE, JSON.stringify(pos));
    return true;
  } catch (e) {
    return false;
  }
}

// Seed merged with whatever the user has moved. The seed always supplies the
// full company list, so adding a company to the data file just appears.
function currentPos(ticker) {
  var moved = _spec.pos[ticker];
  if (moved && typeof moved.x === 'number' && typeof moved.y === 'number') return moved;
  var seed = SPECTRUM_COMPANIES.filter(function (c) { return c.ticker === ticker; })[0];
  return { x: seed.x, y: seed.y };
}

function isMoved(ticker) {
  var moved = _spec.pos[ticker];
  if (!moved) return false;
  var seed = SPECTRUM_COMPANIES.filter(function (c) { return c.ticker === ticker; })[0];
  return Math.abs(moved.x - seed.x) > 0.5 || Math.abs(moved.y - seed.y) > 0.5;
}

/* ─── Geometry helpers ─────────────────────────────────────────────────── */

function zoneOf(x) {
  for (var i = 0; i < SPECTRUM_ZONES.length; i++) {
    var z = SPECTRUM_ZONES[i];
    if (x >= z.from && x < z.to) return z;
  }
  return SPECTRUM_ZONES[SPECTRUM_ZONES.length - 1];
}

// Logos come from the same source the Companies grid uses. Two fallbacks: the
// company's own favicon, then a monogram tinted with the zone colour.
function logoHtml(c) {
  return '<img class="spec-node-logo" alt="" data-step="0"' +
         ' data-domain="' + esc(c.domain || '') + '"' +
         ' src="https://assets.parqet.com/logos/symbol/' + esc(c.ticker) + '">';
}

function wireLogos(scope) {
  var imgs = scope.querySelectorAll('.spec-node-logo');
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].addEventListener('error', function () {
      var step = parseInt(this.dataset.step || '0', 10);
      var domain = this.dataset.domain;
      if (step === 0 && domain) {
        this.dataset.step = '1';
        this.src = 'https://www.google.com/s2/favicons?sz=64&domain=' + domain;
      } else {
        this.classList.add('is-gone');
      }
    });
  }
}

// How close to a zone edge, in x units. Small = the company straddles a boundary,
// which the deck could not express and which is usually the interesting case.
function edgeDistance(x) {
  var z = zoneOf(x);
  return Math.min(Math.abs(x - z.from), Math.abs(x - z.to));
}

function neighbours(ticker, n) {
  var me = currentPos(ticker);
  var others = SPECTRUM_COMPANIES
    .filter(function (c) { return c.ticker !== ticker; })
    .map(function (c) {
      var p = currentPos(c.ticker);
      var dx = p.x - me.x, dy = p.y - me.y;
      return { co: c, d: Math.sqrt(dx * dx + dy * dy) };
    });
  others.sort(function (a, b) { return a.d - b.d; });
  return others.slice(0, n);
}

/* ─── Render: the plane ────────────────────────────────────────────────── */

function planeHtml() {
  var h = '';

  // Zone bands (names live in the bar above, as in the deck)
  h += '<div class="spec-zones">';
  for (var i = 0; i < SPECTRUM_ZONES.length; i++) {
    var z = SPECTRUM_ZONES[i];
    h += '<div class="spec-zone" data-zone="' + z.id + '"' +
         ' style="left:' + z.from + '%;width:' + (z.to - z.from) + '%;--hue:' + z.hue + '"></div>';
  }
  h += '</div>';

  // Neighbour links, drawn under the nodes when one is selected
  h += '<svg class="spec-links" id="spec-links" aria-hidden="true"></svg>';


  // Nodes
  h += '<div class="spec-nodes" id="spec-nodes">';
  for (var j = 0; j < SPECTRUM_COMPANIES.length; j++) {
    var c = SPECTRUM_COMPANIES[j];
    var p = currentPos(c.ticker);
    var zc = zoneOf(p.x);
    h += '<button class="spec-node" data-ticker="' + esc(c.ticker) + '"' +
         ' data-zone="' + zc.id + '"' +
         ' style="left:' + p.x + '%;top:' + p.y + '%;--hue:' + zc.hue + '"' +
         ' title="' + esc(c.name) + '">' +
         logoHtml(c) +
         '<span class="spec-node-tk">' + esc(c.ticker) + '</span>' +
         '</button>';
  }
  h += '</div>';

  return h;
}

/* ─── The neighbour links ──────────────────────────────────────────────
   Percentage coordinates, so the lines follow the plane on resize without
   any measurement or redraw-on-resize handler.                          */

function drawLinks() {
  var svg = document.getElementById('spec-links');
  if (!svg) return;

  var s = '';

  if (!_spec.sel) { svg.innerHTML = s; return; }

  var me = currentPos(_spec.sel);
  var hue = zoneOf(me.x).hue;
  var near = neighbours(_spec.sel, 3);
  for (var i = 0; i < near.length; i++) {
    var p = currentPos(near[i].co.ticker);
    // nearest neighbour draws strongest — the ranking should be visible, not
    // just listed in the panel
    s += '<line x1="' + me.x + '%" y1="' + me.y + '%"' +
         ' x2="' + p.x + '%" y2="' + p.y + '%"' +
         ' stroke="' + hue + '" stroke-width="' + (2.4 - i * 0.5) + '"' +
         ' stroke-linecap="round" stroke-dasharray="6 5"' +
         ' opacity="' + (0.85 - i * 0.18) + '"/>';
    s += '<circle cx="' + p.x + '%" cy="' + p.y + '%" r="' + (4.5 - i * 0.7) + '"' +
         ' fill="' + hue + '" opacity="' + (0.28 - i * 0.06) + '"/>';
  }
  svg.innerHTML = s;
}

function html() {
  var ax = SPECTRUM_AXES;
  var h = '<div class="spec-wrap">';

  // Header
  h += '<div class="spec-head">';
  h += '<h2 class="spec-title">Investment Spectrum</h2>';
  h += '<p class="spec-sub">How companies create value. Left to right is the original spectrum — ' +
       'intangible to tangible. Top to bottom is capital intensity, the axis the deck did not have. ' +
       '<strong>Drag a company</strong> to where you think it belongs; where it lands is an argument ' +
       'about who its neighbours are.</p>';
  h += '</div>';

  // Toolbar
  h += '<div class="spec-bar">';
  h += '<div class="spec-bar-l">';
  h += '<button class="spec-btn" id="spec-reset">Reset to default</button>';
  h += '<span class="spec-status" id="spec-status"></span>';
  h += '</div>';
  h += '<div class="spec-bar-r"><span class="spec-scope">Saved on this device only</span></div>';
  h += '</div>';

  // The board: zone bar, y label, plane, x label
  h += '<div class="spec-board">';

  h += '<div class="spec-zonebar">';
  for (var zi = 0; zi < SPECTRUM_ZONES.length; zi++) {
    var zz = SPECTRUM_ZONES[zi];
    h += '<div class="spec-zonebar-cell" data-zone="' + zz.id + '"' +
         ' style="flex:0 0 ' + (zz.to - zz.from) + '%;--hue:' + zz.hue + '">' +
         esc(zz.name) + '</div>';
  }
  h += '</div>';

  h += '<div class="spec-ylab">';
  h += '<span class="spec-ylab-t">' + esc(ax.y.top) + '</span>';
  h += '<span class="spec-ylab-n">' + esc(ax.y.label) + '</span>';
  h += '<span class="spec-ylab-b">' + esc(ax.y.bottom) + '</span>';
  h += '</div>';

  h += '<div class="spec-plane" id="spec-plane">' + planeHtml() + '</div>';

  h += '<div class="spec-xlab">';
  h += '<span class="spec-xlab-l">' + esc(ax.x.left) + '</span>';
  h += '<span class="spec-xlab-n">' + esc(ax.x.label) + '</span>';
  h += '<span class="spec-xlab-r">' + esc(ax.x.right) + '</span>';
  h += '</div>';

  h += '</div>'; // board

  // Criteria strip — the deck's bullets, one column per zone
  h += '<div class="spec-crit" id="spec-crit">';
  for (var i = 0; i < SPECTRUM_ZONES.length; i++) {
    var z = SPECTRUM_ZONES[i];
    h += '<div class="spec-crit-col" data-zone="' + z.id + '" style="--hue:' + z.hue + '">';
    h += '<div class="spec-crit-hd">' + esc(z.name) + '</div>';
    h += '<ul class="spec-crit-list">';
    for (var k = 0; k < z.criteria.length; k++) {
      h += '<li>' + esc(z.criteria[k]) + '</li>';
    }
    h += '</ul>';
    h += '<p class="spec-crit-blurb">' + esc(z.blurb) + '</p>';
    if (z.note) h += '<p class="spec-crit-note">' + esc(z.note) + '</p>';
    h += '</div>';
  }
  h += '</div>';

  // Detail panel
  h += '<div class="spec-panel" id="spec-panel"></div>';

  // The numbers, all fifteen at once
  h += '<div class="spec-table-wrap" id="spec-table"></div>';

  // Footnote
  h += '<p class="spec-foot">The default board is the team\'s placement of Aug 14, 2026, which ' +
       'started from the Investment Spectrum deck but no longer matches it everywhere. ' +
       'Every figure below is as filed with the SEC — 10-K, or 20-F for TSMC, Spotify, Grupo ' +
       'Aeroportuario and Tiendas 3B — and ratios only ever divide two numbers from the same ' +
       'statement, so the reporting currency does not matter. A blank cell means the company ' +
       'does not report that line, never that the figure is zero. The estimate column comes from ' +
       'the portal\'s own Results datasets, which cover eight of the fifteen.</p>';

  h += '</div>';
  return h;
}

/* ─── Render: the detail panel ─────────────────────────────────────────── */

function renderPanel() {
  var el = document.getElementById('spec-panel');
  if (!el) return;

  if (!_spec.sel) {
    el.innerHTML = '<p class="spec-panel-empty">Select a company to see why it sits there — and who it ends up next to.</p>';
    return;
  }

  var c = SPECTRUM_COMPANIES.filter(function (x) { return x.ticker === _spec.sel; })[0];
  if (!c) { el.innerHTML = ''; return; }

  var p = currentPos(c.ticker);
  var z = zoneOf(p.x);
  var near = neighbours(c.ticker, 3);
  var moved = isMoved(c.ticker);

  var h = '<div class="spec-panel-in" style="--hue:' + z.hue + '">';

  h += '<div class="spec-panel-hd">';
  h += '<div class="spec-panel-id">';
  h += logoHtml(c);
  h += '<span class="spec-panel-tk">' + esc(c.ticker) + '</span>';
  h += '<span class="spec-panel-nm">' + esc(c.name) + '</span>';
  h += '</div>';
  h += '<div class="spec-panel-pos">';
  h += '<span class="spec-chip">' + esc(z.name) + '</span>';
  if (edgeDistance(p.x) < 4) h += '<span class="spec-chip spec-chip--edge">on the boundary</span>';
  if (moved) h += '<span class="spec-chip spec-chip--moved">moved from default</span>';
  h += '</div>';
  h += '</div>';

  h += '<div class="spec-panel-grid">';

  h += '<div class="spec-panel-cell">';
  h += '<div class="spec-panel-lbl">Why here — horizontally</div>';
  h += '<p class="spec-panel-txt">' + esc(c.why) + '</p>';
  h += '</div>';

  h += '<div class="spec-panel-cell">';
  h += '<div class="spec-panel-lbl">Why here — vertically</div>';
  h += '<p class="spec-panel-txt">' + esc(c.capital) + '</p>';
  h += '</div>';

  h += '<div class="spec-panel-cell">';
  h += '<div class="spec-panel-lbl">Nearest neighbours</div>';
  h += '<ul class="spec-nb">';
  for (var i = 0; i < near.length; i++) {
    var n = near[i];
    var nz = zoneOf(currentPos(n.co.ticker).x);
    h += '<li><button class="spec-nb-btn" data-goto="' + esc(n.co.ticker) + '"' +
         ' style="--hue:' + nz.hue + '">' +
         logoHtml(n.co) +
         '<span class="spec-nb-tk">' + esc(n.co.ticker) + '</span>' +
         '<span class="spec-nb-nm">' + esc(n.co.name) + '</span>' +
         '</button></li>';
  }
  h += '</ul>';
  h += '<p class="spec-nb-ask">Same way of creating value, same appetite for capital — or not?</p>';
  h += '</div>';

  h += '</div>'; // grid

  h += metricsHtml(c);

  if (c.tension) {
    h += '<div class="spec-tension">';
    h += '<span class="spec-tension-lbl">Where this placement is contested</span>';
    h += '<p class="spec-tension-txt">' + esc(c.tension) + '</p>';
    h += '</div>';
  }

  h += '</div>';
  el.innerHTML = h;
  wireLogos(el);
}

/* ─── The numbers ──────────────────────────────────────────────────────────
   Seven ratios, as an average over a window you choose, as trailing twelve
   months, and as this year's estimate. No score, no ranking, no verdict: where
   a company belongs on the board is the reader's call, and this is the evidence
   they make it on.                                                            */

function winYears() {
  var w = WINDOWS.filter(function (x) { return x.key === _spec.win; })[0];
  return w ? w.years : 10;
}

function fmt(metric, v) {
  return (v === null || v === undefined || !isFinite(v)) ? '' : metric.format(v);
}

// A sparkline of the company's own history for one ratio, scaled to its own
// range. Comparing shapes across rows is meaningless and deliberately not
// offered — the numbers beside it are what compare.
function sparkHtml(series, key) {
  var pts = series.map(function (r) { return r.values[key]; });
  var have = pts.filter(function (v) { return v != null && isFinite(v); });
  if (have.length < 2) return '<span class="spec-spark spec-spark--empty"></span>';

  var lo = Math.min.apply(null, have), hi = Math.max.apply(null, have);
  var range = (hi - lo) || Math.abs(hi) || 1;
  var w = 100, hgt = 22, step = w / (pts.length - 1);

  var d = '', open = false, dots = '';
  for (var i = 0; i < pts.length; i++) {
    if (pts[i] == null || !isFinite(pts[i])) { open = false; continue; }
    var x = i * step;
    var y = hgt - 2 - ((pts[i] - lo) / range) * (hgt - 4);
    d += (open ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
    open = true;
    if (i === pts.length - 1) {
      dots = '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.2" fill="currentColor"/>';
    }
  }
  // A zero line only where the series actually crosses it, so a margin that
  // has never been negative is not given a baseline it never touches.
  var zero = '';
  if (lo < 0 && hi > 0) {
    var zy = hgt - 2 - ((0 - lo) / range) * (hgt - 4);
    zero = '<line x1="0" y1="' + zy.toFixed(1) + '" x2="' + w + '" y2="' + zy.toFixed(1) +
           '" stroke="#D3DAE3" stroke-width="1"/>';
  }
  return '<svg class="spec-spark" viewBox="0 0 ' + w + ' ' + hgt + '" preserveAspectRatio="none" aria-hidden="true">' +
         zero + '<path d="' + d.trim() + '" fill="none" stroke="currentColor" stroke-width="1.6" ' +
         'stroke-linejoin="round" stroke-linecap="round"/>' + dots + '</svg>';
}

function metricsHtml(c) {
  var series = seriesFor(c.ticker);
  if (!series || !series.length) {
    return '<div class="spec-nums spec-nums--none">' +
           '<span class="spec-nums-lbl">The numbers</span>' +
           '<p class="spec-nums-empty">No filing history for this company.</p></div>';
  }

  var info = metricsMeta(c.ticker);
  var avg = averageFor(c.ticker, winYears());
  var ttm = ttmFor(c.ticker);
  var fwd = forwardOf(c.ticker, renderPanel);

  var h = '<div class="spec-nums">';

  h += '<div class="spec-nums-hd">';
  h += '<span class="spec-nums-lbl">The numbers</span>';
  h += '<span class="spec-nums-src">' + esc(info.currency) + ' · FY' + info.firstYear.fy +
       '–FY' + info.lastYear.fy + ' · ' + esc(info.lastYear.form || '') + '</span>';
  h += '</div>';

  h += '<table class="spec-nums-tbl"><thead><tr>';
  h += '<th class="spec-nums-th spec-nums-th--m">Metric</th>';
  h += '<th class="spec-nums-th spec-nums-th--s">FY' + info.firstYear.fy + '–' + info.lastYear.fy + '</th>';
  h += '<th class="spec-nums-th">' + avg.span + '-yr avg</th>';
  h += '<th class="spec-nums-th">' + (ttm ? 'TTM' : 'TTM') + '</th>';
  h += '<th class="spec-nums-th">' + (fwd ? esc(fwd.period) + 'E' : 'Est.') + '</th>';
  h += '</tr></thead><tbody>';

  for (var i = 0; i < METRICS.length; i++) {
    var m = METRICS[i];
    var a = avg.values[m.key];
    h += '<tr class="spec-nums-row" title="' + esc(m.hint) + '">';
    h += '<td class="spec-nums-m">' + esc(m.label) + '</td>';
    h += '<td class="spec-nums-spark">' + sparkHtml(series, m.key) + '</td>';
    h += '<td class="spec-nums-v">' + fmt(m, a.value) +
         (a.value != null && a.n < a.of ? '<i class="spec-nums-part" title="' + a.n + ' of ' +
           a.of + ' years reported">' + a.n + '/' + a.of + '</i>' : '') + '</td>';
    h += '<td class="spec-nums-v">' + (ttm ? fmt(m, ttm.values[m.key]) : '') + '</td>';
    h += '<td class="spec-nums-v spec-nums-v--est">' + (fwd ? fmt(m, fwd.values[m.key]) : '') + '</td>';
    h += '</tr>';
  }
  h += '</tbody></table>';

  var notes = [];
  if (ttm) notes.push('TTM to ' + ttm.end + ' (' + ttm.note + ').');
  else notes.push('No trailing-twelve-month column: this filer publishes no interim XBRL.');
  if (fwd) notes.push(fwd.period + ' estimate from the ' + fwd.source + ', via the Results dataset.');
  else notes.push('No estimate column: the portal carries no Results dataset for this company.');
  h += '<p class="spec-nums-note">' + esc(notes.join(' ')) + '</p>';

  if (c.caveat) h += '<p class="spec-nums-caveat">' + esc(c.caveat) + '</p>';

  h += '</div>';
  return h;
}

/* ─── The comparison table ─────────────────────────────────────────────────
   Fifteen rows, seven columns, one basis at a time. Placing a company is a
   comparison, so the board needs a view where the comparison is direct rather
   than one profile after another.                                            */

var BASES = [
  { key: 'avg', label: 'Average' },
  { key: 'ttm', label: 'TTM' },
  { key: 'est', label: 'Estimate' }
];

function basisValues(ticker) {
  if (_spec.basis === 'ttm') {
    var t = ttmFor(ticker);
    return t ? t.values : null;
  }
  if (_spec.basis === 'est') {
    var f = forwardOf(ticker, renderTable);
    return f ? f.values : null;
  }
  var a = averageFor(ticker, winYears());
  if (!a) return null;
  var out = {}, thin = {};
  for (var i = 0; i < METRICS.length; i++) {
    var cell = a.values[METRICS[i].key];
    out[METRICS[i].key] = cell.value;
    // An average over 5 of 10 years is not the same claim as one over 10, and
    // the table has no room to say so in full — so those cells are marked and
    // carry the count in their tooltip.
    if (cell.value != null && cell.n < cell.of) thin[METRICS[i].key] = cell.n + ' of ' + cell.of + ' years reported';
  }
  out.__thin = thin;
  return out;
}

function renderTable() {
  var el = document.getElementById('spec-table');
  if (!el) return;

  var rows = SPECTRUM_COMPANIES.map(function (c) {
    return { co: c, values: basisValues(c.ticker) || {} };
  });

  if (_spec.sort && _spec.sort.key) {
    var k = _spec.sort.key, dir = _spec.sort.dir;
    rows.sort(function (a, b) {
      var av = a.values[k], bv = b.values[k];
      // Blanks always sink, whichever way the column is sorted — a company that
      // does not report a line has not scored badly on it.
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return dir === 'asc' ? av - bv : bv - av;
    });
  }

  var basisLabel = _spec.basis === 'ttm' ? 'trailing twelve months'
    : _spec.basis === 'est' ? 'this year\'s estimate'
    : winYears() + '-year average';

  var h = '<div class="spec-table-hd">';
  h += '<span class="spec-table-lbl">All fifteen, ' + esc(basisLabel) + '</span>';
  h += '<div class="spec-table-ctl">';
  for (var b = 0; b < BASES.length; b++) {
    h += '<button class="spec-pill' + (_spec.basis === BASES[b].key ? ' is-on' : '') +
         '" data-basis="' + BASES[b].key + '">' + esc(BASES[b].label) + '</button>';
  }
  h += '<span class="spec-pill-sep"></span>';
  for (var w = 0; w < WINDOWS.length; w++) {
    h += '<button class="spec-pill spec-pill--win' + (_spec.win === WINDOWS[w].key ? ' is-on' : '') +
         (_spec.basis !== 'avg' ? ' is-off' : '') +
         '" data-win="' + WINDOWS[w].key + '">' + esc(WINDOWS[w].label) + '</button>';
  }
  h += '</div></div>';

  h += '<div class="spec-table-scroll"><table class="spec-table"><thead><tr>';
  h += '<th class="spec-th spec-th--co">Company</th>';
  for (var i = 0; i < METRICS.length; i++) {
    var m = METRICS[i];
    var on = _spec.sort && _spec.sort.key === m.key;
    h += '<th class="spec-th spec-th--n' + (on ? ' is-sorted' : '') + '" data-sort="' + m.key + '"' +
         ' title="' + esc(m.hint) + '">' + esc(m.short) +
         (on ? '<i class="spec-th-dir">' + (_spec.sort.dir === 'asc' ? '↑' : '↓') + '</i>' : '') +
         '</th>';
  }
  h += '</tr></thead><tbody>';

  for (var r = 0; r < rows.length; r++) {
    var co = rows[r].co, vals = rows[r].values;
    var z = zoneOf(currentPos(co.ticker).x);
    h += '<tr class="spec-tr' + (_spec.sel === co.ticker ? ' is-sel' : '') +
         '" data-goto="' + esc(co.ticker) + '" style="--hue:' + z.hue + '">';
    h += '<td class="spec-td spec-td--co">' + logoHtml(co) +
         '<span class="spec-td-tk">' + esc(co.ticker) + '</span>' +
         '<span class="spec-td-nm">' + esc(co.name) + '</span></td>';
    for (var j = 0; j < METRICS.length; j++) {
      var mm = METRICS[j];
      var thin = vals.__thin && vals.__thin[mm.key];
      h += '<td class="spec-td spec-td--n' + (thin ? ' is-thin' : '') + '"' +
           (thin ? ' title="' + esc(thin) + '"' : '') + '>' + fmt(mm, vals[mm.key]) + '</td>';
    }
    h += '</tr>';
  }
  h += '</tbody></table></div>';

  el.innerHTML = h;
  wireLogos(el);
}

function renderStatus() {
  var el = document.getElementById('spec-status');
  if (!el) return;
  var n = SPECTRUM_COMPANIES.filter(function (c) { return isMoved(c.ticker); }).length;
  el.textContent = n === 0
    ? 'Showing the default board'
    : n + (n === 1 ? ' company moved' : ' companies moved');
  el.className = 'spec-status' + (n ? ' spec-status--on' : '');
}

function syncNodes() {
  var nodes = document.querySelectorAll('#spec-nodes .spec-node');
  for (var i = 0; i < nodes.length; i++) {
    var tk = nodes[i].dataset.ticker;
    var p = currentPos(tk);
    var z = zoneOf(p.x);
    nodes[i].style.left = p.x + '%';
    nodes[i].style.top = p.y + '%';
    // colour follows the company, so dragging across a boundary recolours it
    nodes[i].style.setProperty('--hue', z.hue);
    nodes[i].dataset.zone = z.id;
    nodes[i].classList.toggle('is-sel', _spec.sel === tk);
    nodes[i].classList.toggle('is-nb', false);
    nodes[i].classList.toggle('is-moved', isMoved(tk));
  }


  // mark the three the panel is talking about
  if (_spec.sel) {
    var near = neighbours(_spec.sel, 3);
    for (var j = 0; j < near.length; j++) {
      var el = document.querySelector('#spec-nodes .spec-node[data-ticker="' + near[j].co.ticker + '"]');
      if (el) el.classList.add('is-nb');
    }
  }

  drawLinks();
}

function select(ticker) {
  _spec.sel = ticker;
  syncNodes();
  renderPanel();
  renderTable();
}

/* ─── Drag ─────────────────────────────────────────────────────────────── */

function wireDrag(plane) {
  var drag = null; // { node, ticker, dx, dy, moved }

  plane.addEventListener('pointerdown', function (e) {
    var node = e.target.closest('.spec-node');
    if (!node) return;
    e.preventDefault();

    var rect = plane.getBoundingClientRect();
    var nRect = node.getBoundingClientRect();
    drag = {
      node: node,
      ticker: node.dataset.ticker,
      // grab offset, so the chip does not jump to the cursor
      dx: e.clientX - (nRect.left + nRect.width / 2),
      dy: e.clientY - (nRect.top + nRect.height / 2),
      rect: rect,
      moved: false
    };
    node.setPointerCapture(e.pointerId);
    node.classList.add('is-drag');
    select(drag.ticker);
  });

  plane.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var r = drag.rect;
    var x = clamp(((e.clientX - drag.dx - r.left) / r.width) * 100, 0, 100);
    var y = clamp(((e.clientY - drag.dy - r.top) / r.height) * 100, 0, 100);
    if (!drag.moved) {
      // a few pixels of slop, so a click is still a click
      if (Math.abs(e.movementX) + Math.abs(e.movementY) > 0) drag.moved = true;
    }
    drag.node.style.left = x + '%';
    drag.node.style.top = y + '%';
    drag.node.classList.add('is-moved');
    _spec.pos[drag.ticker] = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };

    // recolour and re-aim the links while the chip is still in the air
    var z = zoneOf(x);
    drag.node.style.setProperty('--hue', z.hue);
    drag.node.dataset.zone = z.id;
    drawLinks();
  });

  function endDrag(e) {
    if (!drag) return;
    drag.node.classList.remove('is-drag');
    try { drag.node.releasePointerCapture(e.pointerId); } catch (err) { /* already gone */ }
    if (drag.moved) {
      var ok = savePositions(_spec.pos);
      if (!ok) {
        var st = document.getElementById('spec-status');
        if (st) { st.textContent = 'Could not save on this device'; st.className = 'spec-status spec-status--warn'; }
      } else {
        renderStatus();
      }
      renderPanel();
      syncNodes();
    }
    drag = null;
  }

  plane.addEventListener('pointerup', endDrag);
  plane.addEventListener('pointercancel', endDrag);
}

/* ─── Wiring ───────────────────────────────────────────────────────────── */

function wire(root) {
  var plane = document.getElementById('spec-plane');
  if (plane) wireDrag(plane);

  root.addEventListener('click', function (e) {
    var node = e.target.closest('.spec-node');
    if (node) { select(node.dataset.ticker); return; }

    var nb = e.target.closest('.spec-nb-btn');
    if (nb) { select(nb.dataset.goto); return; }

    var tr = e.target.closest('.spec-tr[data-goto]');
    if (tr) { select(tr.dataset.goto); return; }

    if (e.target.closest('#spec-reset')) {
      _spec.pos = {};
      savePositions({});
      syncNodes();
      renderStatus();
      renderPanel();
      return;
    }

    var basis = e.target.closest('[data-basis]');
    if (basis) {
      _spec.basis = basis.dataset.basis;
      renderTable();
      return;
    }

    // The window pills stay live on any basis: picking "5 years" while looking
    // at TTM switches the table back to averages rather than doing nothing.
    var win = e.target.closest('[data-win]');
    if (win) {
      _spec.win = win.dataset.win;
      _spec.basis = 'avg';
      renderTable();
      renderPanel();
      return;
    }

    var th = e.target.closest('[data-sort]');
    if (th) {
      var key = th.dataset.sort;
      _spec.sort = (_spec.sort && _spec.sort.key === key && _spec.sort.dir === 'desc')
        ? { key: key, dir: 'asc' }
        : { key: key, dir: 'desc' };
      renderTable();
      return;
    }
  });

  // Hovering a zone band lights up its criteria column, and vice versa.
  root.addEventListener('mouseover', function (e) {
    var z = e.target.closest('[data-zone]');
    if (!z) return;
    var id = z.dataset.zone;
    root.querySelectorAll('[data-zone]').forEach(function (el) {
      el.classList.toggle('is-lit', el.dataset.zone === id);
    });
  });
  root.addEventListener('mouseleave', function () {
    root.querySelectorAll('[data-zone]').forEach(function (el) { el.classList.remove('is-lit'); });
  }, true);

  // Arrow keys nudge the selected company — finer than a drag, and keeps the
  // board usable without a mouse.
  root.addEventListener('keydown', function (e) {
    if (!_spec.sel) return;
    var step = e.shiftKey ? 5 : 1;
    var d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!d) return;
    e.preventDefault();
    var p = currentPos(_spec.sel);
    _spec.pos[_spec.sel] = { x: clamp(p.x + d[0], 0, 100), y: clamp(p.y + d[1], 0, 100) };
    savePositions(_spec.pos);
    syncNodes();
    renderStatus();
    renderPanel();
  });
}

export function loadSpectrumPage() {
  var root = document.getElementById('spectrum-root');
  if (!root) return;

  _spec = {
    pos: loadPositions(), sel: null,
    win: '10y', basis: 'avg', sort: null
  };

  root.innerHTML = html();
  wireLogos(root);
  wire(root);
  syncNodes();
  renderStatus();
  renderPanel();
  renderTable();
}
