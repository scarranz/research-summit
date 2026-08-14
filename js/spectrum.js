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

var SPEC_STORE = 'summit.spectrum.positions.v1';
var _spec = null; // { pos: {TICKER: {x,y}}, sel: ticker|null, dirty: bool }

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

  if (!_spec.sel) { svg.innerHTML = ''; return; }

  var me = currentPos(_spec.sel);
  var hue = zoneOf(me.x).hue;
  var near = neighbours(_spec.sel, 3);
  var s = '';
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
  h += '<button class="spec-btn" id="spec-reset">Reset to deck</button>';
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

  // Footnote
  h += '<p class="spec-foot">Seeded from the Investment Spectrum deck; the left-to-right order is ' +
       'the deck\'s. Capital intensity is a judgment call today — ' + esc(ax.y.note) + '</p>';

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
  if (moved) h += '<span class="spec-chip spec-chip--moved">moved from the deck</span>';
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

function renderStatus() {
  var el = document.getElementById('spec-status');
  if (!el) return;
  var n = SPECTRUM_COMPANIES.filter(function (c) { return isMoved(c.ticker); }).length;
  el.textContent = n === 0
    ? 'Showing the deck\'s positions'
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

    if (e.target.closest('#spec-reset')) {
      _spec.pos = {};
      savePositions({});
      syncNodes();
      renderStatus();
      renderPanel();
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

  _spec = { pos: loadPositions(), sel: null };

  root.innerHTML = html();
  wireLogos(root);
  wire(root);
  syncNodes();
  renderStatus();
  renderPanel();
}
