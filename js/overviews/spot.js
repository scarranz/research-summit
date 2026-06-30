// overviews/spot.js — custom Overview for Spotify Technology S.A. (NYSE: SPOT)
// Built per the portal's per-company Overview model (see CLAUDE.md).
//
// Sub-tabs:
//   • Overview     — snapshot, business description, headline KPIs (Summit DCF).
//   • Product Mix  — VISUAL-FIRST gross-margin story: how content economics shifted
//                    from a music-only royalty model to a three-format platform
//                    (music + podcasts + audiobooks), and why that re-rates the P&L.
//
// Sources: Spotify FY2024 Annual Report (Form 20-F), Q1 2026 Shareholder Deck &
// earnings call prepared remarks, historical 20-F income statements, and the Summit
// DCF model (snapshot 2026-05-22). Financial figures reported in EUR.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function sec(title,inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }

// ════════════════════════════════════════════════════════════════════════════
// PANE 1 — OVERVIEW
// ════════════════════════════════════════════════════════════════════════════
var SNAPSHOT = [
  ['Listing', 'NYSE: SPOT'],
  ['HQ', 'Stockholm, Sweden'],
  ['Incorporated', 'Luxembourg (S.A.)'],
  ['Founded', '2006'],
  ['Public since', '2018 (direct listing)'],
  ['Founder & CEO', 'Daniel Ek'],
];
var DESC = 'Spotify is the world’s largest audio-streaming platform, monetizing through a freemium model: a paid Premium tier (the bulk of revenue) and an ad-supported free tier that funnels users toward Premium. Beyond music, Spotify has expanded into podcasts and audiobooks to deepen engagement and — critically — to lift gross margin. The investment debate centers on durable subscriber growth, pricing power, and the long climb in gross margin as the higher-margin formats scale.';
var KPIS = [
  { l:'Revenue (FY2025)',   v:'€17.2B', d:'+9.7% vs FY2024',       dir:'up' },
  { l:'EBITDA (FY2025)',    v:'€2.55B', d:'≈ 14.8% margin',        dir:'up' },
  { l:'Free cash flow',     v:'€2.9B',  d:'FY2025 actual',         dir:'up' },
  { l:'Gross margin (Q1’26)', v:'33.0%', d:'+133 bps Y/Y · record', dir:'up' },
];
var OV_NOTE = 'Headline figures from the Summit DCF model (snapshot 2026-05-22) and Spotify filings. See the Product Mix tab for the gross-margin story. Data sourced from Summit DCF models.';

function snap(arr){ return '<div class="ov-snap">'+arr.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('')+'</div>'; }
function kpis(arr){ return '<div class="ov-kpis">'+arr.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>'; }

function overviewBody(c){
  return snap(SNAPSHOT) + '<p class="ov-lede">'+esc(DESC)+'</p>' + kpis(KPIS) +
    '<div class="ov-asof">'+esc(OV_NOTE)+'</div>';
}

// ════════════════════════════════════════════════════════════════════════════
// PANE 2 — PRODUCT MIX  (visual-first)
// ════════════════════════════════════════════════════════════════════════════
var PM_LEDE = 'For a decade Spotify was, in effect, one product — <b>music</b> — and ~70% of every euro went to record labels. Adding <b>podcasts</b> and <b>audiobooks</b> (which don’t pay that toll) flipped the story: gross margin broke out from the mid-20s% to a record <b>33%</b>.';

// — Hero: reported consolidated gross margin trajectory (20-F + Q1'26 deck).
// NON-monotonic: flat mid-20s% to 2021, dip in 2022 (peak podcast spend), breakout from 2024.
var GM_LABELS = ['2019','2020','2021','2022','2023','2024','2025','Q1’26'];
var GM_CONS   = [25.6, 25.6, 26.8, 24.9, 25.6, 30.1, 32.0, 33.0];   // consolidated (reported)
var GM_PREM   = [null, null, null, 28, 29, 33, 34, 34.8];           // Premium segment
var GM_ADS    = [null, null, null, 2,  4,  11, 17, 13.0];           // Ad-Supported segment

// — Inline format icons (clean SVG, brand-tinted).
var IC = {
  music: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>',
  pod:   '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2a6 6 0 0 0-2 11.65V16a2 2 0 0 0 4 0v-2.35A6 6 0 0 0 12 2zm-1 18.93V22h2v-1.07a8 8 0 0 0 0-15.86V3a8 8 0 0 1 0 17.93z"/><circle cx="12" cy="8" r="3"/></svg>',
  book:  '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M4 4h7a2 2 0 0 1 2 2v14a3 3 0 0 0-2-1H4V4zm16 0h-3a2 2 0 0 0-2 2v13a3 3 0 0 1 2-1h3V4z"/></svg>',
};

// — "Where each euro goes" — share of revenue paid to rights holders (lower = more margin).
// Music ~70% is Spotify's framing; podcast/audiobook payouts are not disclosed (illustrative).
var FORMATS = [
  { ic:IC.music, n:'Music',      cost:70, tag:'pays the labels',         col:'#E2574C', note:'~70% to labels & publishers' },
  { ic:IC.book,  n:'Audiobooks', cost:40, tag:'licensed per title',      col:'#E8A33D', note:'wholesale, capped 15 hrs/mo' },
  { ic:IC.pod,   n:'Podcasts',   cost:25, tag:'owned / ad-supported',    col:'#1DB954', note:'no per-stream label royalty' },
];

// — The pivot, as a visual timeline (short labels).
var TIMELINE = [
  ['2019', 'Podcast land-grab — Gimlet, Anchor, Parcast'],
  ['2020', 'Buys Megaphone ad platform ($235M)'],
  ['2022', 'Acquires Findaway → enters audiobooks'],
  ['Nov 2023', 'Audiobooks bundled into Premium'],
  ['2023–25', 'First-ever Premium price increases'],
  ['2024', 'First full-year profit (€1.4B op. income)'],
];

// — Why it matters, as big stat cards.
var WHY_STATS = [
  { l:'Value of 1 margin point', v:'≈ €170M', d:'on €17B revenue',          dir:'up' },
  { l:'2030 gross-margin target', v:'35–40%', d:'raised at 2026 Investor Day', dir:'up' },
  { l:'Paid to rights holders',   v:'$11B+',  d:'2025 · Loud & Clear',       dir:'muted' },
  { l:'First full-year profit',   v:'FY2024', d:'driven by margin, not subs', dir:'up' },
];

var PM_SOURCES = 'Sources: Spotify FY2024 Annual Report (Form 20-F) MD&A; Q1 2026 Shareholder Deck & earnings call (Apr 2026); historical 20-F income statements (2018–2021); Loud & Clear 2025; Investor Day 2022 & 2026. Consolidated/segment gross margin as reported (EUR); per-format payout shares are illustrative.';

// Euro-split hero bar: one €1 of MUSIC revenue.
function euroBar(){
  return '<div class="spot-euro">'+
    '<div class="spot-euro-bar">'+
      '<div class="spot-euro-seg" style="width:70%;background:#E2574C">~70%<small>Rights holders</small></div>'+
      '<div class="spot-euro-seg" style="width:30%;background:#1DB954">~30%<small>Spotify gross profit</small></div>'+
    '</div>'+
    '<div class="spot-euro-cap">Every <b>€1 of music</b> revenue — most flows straight to the labels &amp; publishers. Podcasts and audiobooks don’t carry that toll, so each one Spotify adds to the mix <b>lifts the blended margin</b>.</div>'+
  '</div>';
}

// Format "toll" bars (shorter = more profit kept).
function formatBars(){
  return '<div class="spot-fmts">'+FORMATS.map(function(f){
    return '<div class="spot-fmt">'+
      '<div class="spot-fmt-h"><span class="spot-fmt-ic" style="color:'+f.col+'">'+f.ic+'</span>'+
        '<span class="spot-fmt-n">'+esc(f.n)+'</span><span class="spot-fmt-tag">'+esc(f.tag)+'</span></div>'+
      '<div class="spot-fmt-track"><div class="spot-fmt-fill" style="width:'+f.cost+'%;background:'+f.col+'"></div></div>'+
      '<div class="spot-fmt-note">'+esc(f.note)+'</div>'+
    '</div>';
  }).join('')+'</div>'+
  '<div class="spot-axis"><span>← more margin for Spotify</span><span>more paid to rights holders →</span></div>';
}

function timelineBlock(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t){
    return '<div class="ov-tl-item"><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t[0])+'</div>'+
      '<div class="ov-tl-body">'+esc(t[1])+'</div></div>';
  }).join('')+'</div>';
}

function productMixBody(c){
  var h = '';
  h += '<p class="ov-lede">'+PM_LEDE+'</p>';

  // 1 — Hero chart (the breakout)
  h += sec('The breakout — gross margin, 2019 → today',
    '<div class="ov-chart-card"><div class="ov-chart-t">Gross margin <span>(%, reported · consolidated vs. segment)</span></div>'+
      '<div class="ov-chart-wrap ovt-mix-wrap"><canvas id="spotGmChart"></canvas></div>'+
      '<div class="ovt-legend">'+
        '<span class="ovt-lg"><i style="background:#1DB954"></i>Consolidated</span>'+
        '<span class="ovt-lg"><i style="background:#11833b"></i>Premium</span>'+
        '<span class="ovt-lg"><i style="background:#9AA7B4"></i>Ad-Supported</span>'+
      '</div>'+
      '<div class="ov-chart-t" style="margin-top:8px;font-weight:600;color:var(--mu)"><span>Flat in the mid-20s% for a decade → dipped in 2022 on podcast spend → broke out past 30% from 2024.</span></div>'+
    '</div>');

  // 2 — The mechanism (the €1 bar)
  h += sec('Why music caps the margin', euroBar());

  // 3 — Format toll bars
  h += sec('The toll, by format', formatBars());

  // 4 — The pivot timeline
  h += sec('How Spotify changed the mix', timelineBlock());

  // 5 — Why it matters (stat cards)
  h += sec('Why it matters', kpis(WHY_STATS));

  h += '<div class="ov-foot">'+esc(PM_SOURCES)+'</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════
// SHELL + CHART + INIT
// ════════════════════════════════════════════════════════════════════════════
function html(c){
  var h = '<div class="ov ov-spot" data-brand="SPOT" style="--brand:#1DB954">';
  h += '<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="mix">Product Mix</button>'+
  '</div>';
  h += '<div class="ovt-pane" data-ovt="overview">'+overviewBody(c)+'</div>';
  h += '<div class="ovt-pane" data-ovt="mix" hidden>'+productMixBody(c)+'</div>';
  h += '</div>';
  return h;
}

var _charts = {};
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }

function buildGmChart(){
  var id='spotGmChart', cv=document.getElementById(id);
  if(!cv || typeof Chart==='undefined' || !cv.offsetParent) return; // not visible yet
  destroy(id);
  var pf=function(v){ return v+'%'; };
  _charts[id]=new Chart(cv.getContext('2d'),{
    type:'line',
    data:{ labels:GM_LABELS, datasets:[
      { label:'Consolidated', data:GM_CONS, borderColor:'#1DB954', backgroundColor:'rgba(29,185,84,0.10)', borderWidth:3, tension:.3, pointRadius:4, pointBackgroundColor:'#fff', pointBorderColor:'#1DB954', pointBorderWidth:2, fill:true },
      { label:'Premium', data:GM_PREM, borderColor:'#11833b', backgroundColor:'transparent', borderWidth:2, borderDash:[5,4], tension:.3, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:'#11833b', pointBorderWidth:2, spanGaps:false, fill:false },
      { label:'Ad-Supported', data:GM_ADS, borderColor:'#9AA7B4', backgroundColor:'transparent', borderWidth:2, borderDash:[2,3], tension:.3, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:'#9AA7B4', pointBorderWidth:2, spanGaps:false, fill:false },
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+(ctx.parsed.y==null?'n/a':ctx.parsed.y+'%'); } } } },
      scales:{
        y:{ beginAtZero:true, suggestedMax:40, grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:pf } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } }
  });
}

function showOvt(root, key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt') === key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovt') !== key); });
  if (key === 'mix') requestAnimationFrame(buildGmChart);
}

function init(c){
  var root = document.querySelector('.ov-spot');
  if (!root) return;
  root.querySelectorAll('.ovt-tab').forEach(function(btn){
    btn.onclick = function(){ showOvt(root, btn.getAttribute('data-ovt')); };
  });
  var active = root.querySelector('.ovt-tab.active');
  if (active && active.getAttribute('data-ovt') === 'mix') requestAnimationFrame(buildGmChart);
}

export var spotOverview = { html: html, init: init };
