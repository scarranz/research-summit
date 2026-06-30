// overviews/spot.js — custom Overview for Spotify Technology S.A. (NYSE: SPOT)
// Built per the portal's per-company Overview model (see CLAUDE.md).
//
// STATUS: scaffold (first cut). Snapshot + business description + headline KPIs,
// all grounded in the Summit DCF model (snapshot 2026-05-22, reported in EUR millions).
// Next iterations: subscriber/MAU KPIs (regional rows), revenue & margin charts,
// and a valuation/DCF section.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Company snapshot ────────────────────────────────────────
var SNAPSHOT = [
  ['Listing', 'NYSE: SPOT'],
  ['HQ', 'Stockholm, Sweden'],
  ['Incorporated', 'Luxembourg (S.A.)'],
  ['Founded', '2006'],
  ['Public since', '2018 (direct listing)'],
  ['Founder & CEO', 'Daniel Ek'],
];

var DESC = 'Spotify is the world’s largest audio-streaming platform, monetizing through a freemium model: a paid Premium tier (the bulk of revenue) and an ad-supported free tier that funnels users toward Premium. Beyond music, Spotify has expanded into podcasts and audiobooks to deepen engagement and improve gross margin. The investment debate centers on durable subscriber growth, pricing power, and the long climb in gross margin as the business scales and the higher-margin advertising and marketplace layers grow.';

// Headline KPIs — Summit DCF model, snapshot 2026-05-22 (EUR).
var KPIS = [
  { l:'Revenue (FY2025)',  v:'€17.2B', d:'+9.7% vs FY2024',        dir:'up'    },
  { l:'EBITDA (FY2025)',   v:'€2.55B', d:'≈ 14.8% margin',    dir:'up'    },
  { l:'Free cash flow',    v:'€2.9B',  d:'FY2025 actual',          dir:'up'    },
  { l:'Reporting currency',v:'EUR',         d:'Model scale: millions',  dir:'muted' },
];

var NOTE = 'This Overview is a scaffold — a first cut. Headline figures are from the Summit DCF model (snapshot 2026-05-22). Coming next: subscriber / MAU KPIs, revenue & margin charts, and a valuation section. Data sourced from Summit DCF models.';

function rows(arr){ return arr.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join(''); }

function overviewBody(c){
  var h = '';
  h += '<div class="ov-snap">' + SNAPSHOT.map(function(p){
    return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>';
  }).join('') + '</div>';
  h += '<p class="ov-lede">'+esc(DESC)+'</p>';
  h += '<div class="ov-kpis">' + KPIS.map(function(k){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>';
  }).join('') + '</div>';
  h += '<div class="ov-asof">'+esc(NOTE)+'</div>';
  return h;
}

function html(c){
  var h = '<div class="ov ov-spot" data-brand="SPOT">';
  h += overviewBody(c);
  h += '</div>';
  return h;
}

// No interactive elements yet — init is a no-op placeholder (kept idempotent so it is
// safe to call on every tab switch, per renderOverview in companies.js).
function init(c){ /* charts / sub-tabs wired in a later iteration */ }

export var spotOverview = { html: html, init: init };
