// overviews/payments-industry.js — "Payment Networks" industry analysis.
//
// Portal-skinned re-creation of the Visa/Mastercard moat & threat dashboard
// (payments-industry-reference/). Six tabs; built incrementally. Live now:
//   1 The Four Layers   — V/MA's moat decomposed into 4 layers
//   2 Competitive Map   — positioning: geographic reach vs. layer completeness
//   3–6                 — placeholders (Threat Vectors / Rail Displacement /
//                          Replication Matrix / Incentive Context) — coming next.
//
// Pure presentation + Chart.js (no external data, no auth). Rendered in-document
// inside the Industry Analysis tab under the "Payments" pill.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Tab 1 · The Four Layers ────────────────────────────────────────────────────
// Displayed top→bottom as Layer 4 → Layer 1 (cumulative moat first).
var LAYERS = [
  { n:'Layer 4 — Slowest to build · Highest cumulative moat', color:'#1E2733',
    t:'Brand & Consumer Trust', moat:100, badge:'Extreme', badgeCls:'pay-b-navy',
    b:'The Visa/MC logo signals global acceptance, fraud liability limits, and dispute resolution rights — a credible commitment every participant relies on. Amex has spent 70 years trying to match this globally and still has narrower acceptance.' },
  { n:'Layer 3 — Self-reinforcing · Growing fastest', color:'#3E5A82',
    t:'Fraud & Risk Intelligence', moat:90, badge:'Very High', badgeCls:'pay-b-blue',
    b:'Cross-network intelligence from 200B+ annual transactions. No bank, processor, or government rail sees the full picture. Better data → lower fraud → more participants → better data. This moat deepens as volume grows. Directly connected to why issuers value V/MA at renewal.' },
  { n:'Layer 2 — Most replicable · Under direct attack from rails', color:'#7C8694',
    t:'Network & Switching', moat:65, badge:'High — attackable', badgeCls:'pay-b-mut',
    b:'Routes authorization, clearing, and settlement. 65,000 tx/sec peak. 99.999% uptime. The technology is real but not the primary moat — the moat is 50 years of connectivity to every issuer and acquirer in 200 countries. Installing a competing connection costs banks real money and regulatory risk.' },
  { n:'Layer 1 — Invisible · Hardest to rebuild', color:'#A8B0BB',
    t:'Rules & Legal Standards', moat:95, badge:'Extreme — 200+ country recognition', badgeCls:'pay-b-mut',
    b:'Thousands-of-pages rulebooks binding every participant globally. Defines liability shifts, chargeback rights, fraud resolution, interchange, PCI-DSS. When you dispute a charge against a merchant in a country with no consumer protection laws, the rulebook covers you — it overrides local commercial law within the network.' },
];
var STATS = [
  { v:'65K',  l:'transactions/sec · peak capacity' },
  { v:'200B', l:'transactions/year · annual volume' },
  { v:'5-9s', l:'99.999% availability · uptime' },
  { v:'200+', l:'countries · issuers & acquirers' },
];
var THREAT_NOTES = [
  { c:'#7C8694', h:'Real-time rails', t:'attack Layer 2 only. Layers 1, 3, 4 remain intact and must be rebuilt separately.' },
  { c:'#8A93A0', h:'Apple/Google Pay', t:'capture Layer 4 but ride on top of all four layers. Parasitizing, not displacing.' },
  { c:'#3E5A82', h:'Stablecoins', t:'must rebuild all four layers simultaneously. Technology for Layer 2 exists; Layers 1, 3, 4 do not yet.' },
];

function layersTab(){
  var layers = LAYERS.map(function(L){
    return '<div class="pay-layer" style="border-left-color:'+L.color+'">'+
      '<div class="pay-layer-n" style="color:'+L.color+'">'+esc(L.n)+'</div>'+
      '<div class="pay-layer-t">'+esc(L.t)+'</div>'+
      '<div class="pay-layer-b">'+esc(L.b)+'</div>'+
      '<div class="pay-layer-m"><span class="pay-lbl" style="margin:0">Moat</span>'+
        '<span class="pay-moat-track"><span class="pay-moat-fill" style="width:'+L.moat+'%;background:'+L.color+'"></span></span>'+
        '<span class="pay-badge '+L.badgeCls+'">'+esc(L.badge)+'</span></div>'+
    '</div>';
  }).join('');
  var stats = STATS.map(function(s){
    return '<div class="pay-stat"><div class="pay-stat-v">'+esc(s.v)+'</div><div class="pay-stat-l">'+esc(s.l)+'</div></div>';
  }).join('');
  var notes = THREAT_NOTES.map(function(n){
    return '<div class="pay-note"><div class="pay-note-bar" style="background:'+n.c+'"></div>'+
      '<div class="pay-body" style="font-size:11px"><b>'+esc(n.h)+'</b> '+esc(n.t)+'</div></div>';
  }).join('');
  return '<div class="pay-sec">What Visa &amp; Mastercard actually are — four distinct layers</div>'+
    '<div class="pay-grid-main">'+
      '<div>'+layers+'</div>'+
      '<div class="pay-side">'+
        '<div class="pay-card"><div class="pay-lbl">The coordination problem V/MA solve</div>'+
          '<div class="pay-body" style="margin-bottom:10px">Cardholder in Mexico City → card issued in New York → merchant in Tokyo → acquirer in Japan → two currencies → real-time fraud check → chargeback guarantee — all completed in under 100ms, without any two parties trusting each other directly.</div>'+
          '<div class="pay-inset"><div style="font:700 12px Inter,sans-serif;color:var(--navy);margin-bottom:2px">V/MA are the single entity every party trusts.</div><div class="pay-body" style="font-size:11px">The trust is the product. Technology serves the trust, not the reverse.</div></div></div>'+
        '<div class="pay-stats">'+stats+'</div>'+
        '<div class="pay-card"><div class="pay-lbl">Why layer structure matters for threats</div>'+
          '<div style="display:flex;flex-direction:column;gap:8px">'+notes+'</div></div>'+
      '</div>'+
    '</div>';
}

// ─── Tab 2 · Competitive Map ────────────────────────────────────────────────────
// x = geographic reach (0 local → 100 global); y = layer completeness (0 one → 100 all four);
// r = bubble radius (≈ transaction volume). cat = colour family.
var PLAYERS = [
  { k:'Visa',          x:85, y:88, r:30, cat:'card',   note:'$14T/yr' },
  { k:'Mastercard',    x:78, y:83, r:26, cat:'card',   note:'$11T/yr' },
  { k:'UnionPay',      x:52, y:50, r:22, cat:'card',   note:'China-centric' },
  { k:'Amex',          x:64, y:72, r:15, cat:'card',   note:'Closed loop' },
  { k:'UPI',           x:20, y:30, r:24, cat:'rail',   note:'India · 13B/mo' },
  { k:'PIX',           x:16, y:27, r:18, cat:'rail',   note:'Brazil · 5B/mo' },
  { k:'FPS UK',        x:28, y:24, r:15, cat:'rail',   note:'4B/mo' },
  { k:'FedNow/RTP',    x:37, y:20, r:12, cat:'railn',  note:'US · nascent' },
  { k:'Apple/Google',  x:68, y:36, r:16, cat:'wallet', note:'Rides V/MA' },
  { k:'Alipay/WeChat', x:44, y:42, r:16, cat:'wallet', note:'Asia closed' },
  { k:'Stablecoins',   x:58, y:18, r:12, cat:'proto',  note:'Emerging' },
];
var CATS = {
  card:  { bd:'#3E5A82', bg:'rgba(62,90,130,.12)' },
  rail:  { bd:'#16A34A', bg:'rgba(22,163,74,.12)' },
  railn: { bd:'#B45309', bg:'rgba(180,83,9,.10)' },
  wallet:{ bd:'#7C8694', bg:'rgba(124,134,148,.12)' },
  proto: { bd:'#2563EB', bg:'rgba(37,99,235,.07)' },
};
var RAILS = [
  { k:'UPI (India)',        v:'13B/mo',   pct:100, c:'#16A34A' },
  { k:'PIX (Brazil)',       v:'5B/mo',    pct:38,  c:'#16A34A' },
  { k:'FPS UK',             v:'4B/mo',    pct:31,  c:'#7C8694' },
  { k:'FedNow + RTP (US)',  v:'~0.3B/mo', pct:3,   c:'#7C8694' },
];
var LEGEND = [
  { c:'#3E5A82', t:'Card networks — multi-layer' },
  { c:'#16A34A', t:'Real-time payment rails' },
  { c:'#7C8694', t:'Endpoint / wallet players' },
  { c:'#2563EB', t:'Nascent / protocol-level' },
];

function mapTab(){
  var legend = LEGEND.map(function(l){
    return '<div class="pay-legend-row"><span class="pay-legend-dot" style="border-color:'+l.c+';background:'+l.c+'22"></span><span class="pay-body" style="font-size:10px">'+esc(l.t)+'</span></div>';
  }).join('');
  var rails = RAILS.map(function(r){
    return '<div class="pay-rv-row"><span>'+esc(r.k)+'</span><span style="color:var(--mu)">'+esc(r.v)+'</span></div>'+
      '<div class="pay-rv-track"><span class="pay-rv-fill" style="width:'+r.pct+'%;background:'+r.c+'"></span></div>';
  }).join('');
  return '<div class="pay-sec">Positioning — geographic reach vs. layer completeness</div>'+
    '<div class="pay-grid-main">'+
      '<div class="pay-chart-wrap"><canvas id="payMapChart"></canvas></div>'+
      '<div class="pay-side">'+
        '<div class="pay-card-sm"><div class="pay-lbl">How to read</div>'+
          '<div class="pay-body" style="font-size:11px;margin-bottom:8px">Bubble size ≈ transaction volume. Position = geographic scope (x) vs. layer completeness (y).</div>'+legend+'</div>'+
        '<div class="pay-card-sm"><div class="pay-lbl">Key observation</div>'+
          '<div class="pay-body" style="font-size:11px">No player is close to the top-right quadrant. <b>Global reach + all 4 layers simultaneously</b> remains unmatched. Every threat vector attacks only part of the stack.</div></div>'+
        '<div class="pay-card-sm"><div class="pay-lbl">Real-time rail volumes</div><div style="margin-top:8px">'+rails+'</div></div>'+
      '</div>'+
    '</div>';
}

var _mapChart = null;
// Draw each player's name at its bubble centre (Chart.js has no built-in bubble labels).
var bubbleLabels = { id:'bubbleLabels', afterDatasetsDraw:function(chart){
  var ctx = chart.ctx; ctx.save();
  ctx.font = '600 9px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  chart.data.datasets.forEach(function(ds, di){
    var meta = chart.getDatasetMeta(di);
    meta.data.forEach(function(pt, i){
      var p = ds.data[i]; if(!p) return;
      ctx.fillStyle = CATS[ds.label] ? CATS[ds.label].bd : '#1E2733';
      ctx.fillText(p.k, pt.x, pt.y - 2);
      if(p.note){ ctx.font = '400 7.5px Inter, sans-serif'; ctx.fillStyle = '#8A93A0';
        ctx.fillText(p.note, pt.x, pt.y + 8); ctx.font = '600 9px Inter, sans-serif'; }
    });
  });
  ctx.restore();
}};

function buildMapChart(){
  var cv = document.getElementById('payMapChart');
  if(!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if(_mapChart){ _mapChart.destroy(); _mapChart = null; }
  var datasets = Object.keys(CATS).map(function(c){
    return { label:c, data:PLAYERS.filter(function(p){ return p.cat===c; }),
      backgroundColor:CATS[c].bg, borderColor:CATS[c].bd, borderWidth:1.5 };
  });
  _mapChart = new Chart(cv.getContext('2d'), {
    type:'bubble',
    data:{ datasets:datasets },
    options:{
      responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:14, right:16, bottom:6, left:6 } },
      plugins:{
        legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ var p=ctx.raw; return p.k+(p.note?' · '+p.note:''); } } }
      },
      scales:{
        x:{ min:0, max:100, grid:{ color:'rgba(0,0,0,.05)' },
          ticks:{ display:false },
          title:{ display:true, text:'Local / regional  ◄──  reach  ──►  Global', color:'#8A93A0', font:{size:10,weight:'600'} } },
        y:{ min:0, max:100, grid:{ color:'rgba(0,0,0,.05)' },
          ticks:{ display:false },
          title:{ display:true, text:'Only 1 layer  ◄──  layer completeness  ──►  All 4', color:'#8A93A0', font:{size:10,weight:'600'} } }
      }
    },
    plugins:[bubbleLabels]
  });
}

// ─── Placeholder tabs (built next) ──────────────────────────────────────────────
function soonTab(title, desc){
  return '<div class="pay-soon"><b>'+esc(title)+'</b>'+esc(desc)+'<br><span style="font-size:11px">Coming next — validating the first two tabs first.</span></div>';
}

// ─── Tab registry + shell ───────────────────────────────────────────────────────
var TABS = [
  { key:'layers',  label:'The Four Layers',    n:'01', body:layersTab },
  { key:'map',     label:'Competitive Map',    n:'02', body:mapTab },
  { key:'threats', label:'Threat Vectors',     n:'03', body:function(){ return soonTab('Threat Vectors','Four categories of potential displacement.'); } },
  { key:'rails',   label:'Rail Displacement',  n:'04', body:function(){ return soonTab('Rail Displacement','How local rail displacement works — and whether it dislocates V/MA.'); } },
  { key:'matrix',  label:'Replication Matrix', n:'05', body:function(){ return soonTab('Replication Matrix','Replication difficulty — layer by layer, challenger by challenger.'); } },
  { key:'incentive', label:'Incentive Context', n:'06', body:function(){ return soonTab('Incentive Context','Why client incentives are rising — the competitive & structural context.'); } },
];

function html(){
  var h = '<div class="pay">';
  h += '<div class="pay-head"><div class="pay-h-title">Payment Network Competitive Landscape</div>'+
    '<div class="pay-h-sub">Structural analysis · Visa &amp; Mastercard moat and threat framework</div></div>';
  h += '<div class="pay-tabs">'+TABS.map(function(t,i){
    return '<button type="button" class="pay-tab'+(i===0?' active':'')+'" data-pt="'+t.key+'"><span class="pay-tab-n">'+t.n+'</span>'+esc(t.label)+'</button>';
  }).join('')+'</div>';
  h += TABS.map(function(t,i){
    return '<div class="pay-pane" data-pt="'+t.key+'"'+(i===0?'':' hidden')+'>'+t.body()+'</div>';
  }).join('');
  h += '</div>';
  return h;
}

function show(root, key){
  root.querySelectorAll('.pay-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-pt')===key); });
  root.querySelectorAll('.pay-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-pt')!==key); });
  if(key==='map') requestAnimationFrame(buildMapChart);
}

function init(){
  var root = document.querySelector('.pay');
  if(!root) return;
  if(!root._wired){ root._wired = true;
    root.querySelectorAll('.pay-tab').forEach(function(btn){
      btn.onclick = function(){ show(root, btn.getAttribute('data-pt')); };
    });
  }
  var active = root.querySelector('.pay-tab.active');
  show(root, active ? active.getAttribute('data-pt') : 'layers');
}

export var paymentsIndustry = { html: html, init: init };
