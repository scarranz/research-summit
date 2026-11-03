// uber-splc.js — Uber Deep Dive ▸ Bottom Line ▸ Supply Chain (BL-SPLC, docs/PROFILE_PLAYBOOK.md §13).
//
// COPIED from js/overviews/googl-splc.js (the guide-built copy of meta-splc.js / tsm-splc.js / amzn.js aSplcBody), then
// fed with what exists for Uber:
//   • data: Bloomberg SPLC, UBER US Equity, as of Jun 29 2026 — the figures DOAA351 compiled for the July profile
//     (origin/feat/uber-deep-dive, uber.js SC_DISCLOSED and the KPI strip) and the supplier map kept in uber.js
//     (SC_SUPPLIERS, suppliersBody: the driver-and-courier lede and the vendor layer). Moved here (relocation map #42–#43);
//     nothing deleted. The export file itself was not found in the repo or under G:\My Drive\Summit (searched Nov 3
//     2026), so nothing could be re-read or added: the compilation gives relationship sizes for three vendors only, no
//     supplier-facility geography and no supplier revenue dependency — those blocks of the guide are therefore left
//     out and the pane says so (limitation first, §13).
//   • Chain 1 = the vendors with a disclosed relationship size; Chain 2 = the supplier base by role (the July map).
//   • formal skin (§21): Summit tokens, running text in black, no emojis, no logos, no Uber green; card readings are
//     Summit's (the earlier profile's text, kept).

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var _charts={};
function chartReady(id){ var cv=document.getElementById(id); return (cv&&typeof Chart!=='undefined'&&cv.offsetParent)?cv:null; }
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }

// ─── Data — Bloomberg SPLC, UBER US Equity, supplier side (as compiled by DOAA351) ────────────────
var SPLC_ASOF='Jun 29, 2026';
var SPLC_TOTAL={ suppliers:138, sized:3 };
// FY2025 Gross Bookings (US$ million, Uber 4Q25 earnings release) — the denominator for the disclosed-spend ratio.
var GB_FY25=193454;
// rel = Bloomberg's relationship size (US$M).
var CHAIN1=[
  { n:'HCLTech', cat:'Engineering and outsourced development', rel:127,
    d:'Outsourced engineering — the largest bill SPLC can size. The work it buys sits mostly in research and development and in operations and support; a commoditized input with little leverage over Uber.' },
  { n:'Oracle', cat:'Cloud', rel:55,
    d:'Cloud hosting. Uber runs on a mix of its own data centers and the public cloud; the cost lands in cost of revenue (“data center and networking expenses”, 10-K) and in R&amp;D.' },
  { n:'Alexandria Real Estate', cat:'Offices', rel:28,
    d:'Office space. Small dollars; the physical footprint that matters more going forward is the depot and charging network for autonomous vehicles, which SPLC does not size.' }
];
// Chain 2 — the supplier base by role (the July profile's map, uber.js SC_SUPPLIERS), text kept.
var CHAIN2=[
  { g:'Autonomous and automotive', tag:'30+ partners', who:'Waymo · Aurora · Nuro · Lucid · WeRide · Pony.ai · NVIDIA · Stellantis · Rivian · Zoox',
    role:'Supply the autonomous vehicles and the self-driving stack — sensors, compute, robotaxis, OEM cars.',
    read:'The future of low-cost supply, and the one group that can disintermediate Uber (Waymo already runs its own app). Mostly strategic and equity ties, not vendor bills; Uber’s hedge is to aggregate 30+ so that no single AV company owns the demand. Of the 30+, only about 5–7 have real money committed; the rest are memoranda of understanding.' },
  { g:'Technology and cloud', tag:'the plumbing', who:'Oracle · HCLTech · Adobe · Twilio · TomTom',
    role:'Cloud hosting, mapping, messaging and outsourced engineering.',
    read:'Keeps Uber asset-light with strikingly low disclosed spend (HCLTech $127M and Oracle $55M are the only large bills). Commoditized inputs — little leverage over Uber.' },
  { g:'Payments and fintech', tag:'money in and out', who:'Adyen · Stripe · Marqeta · Block · Klarna',
    role:'Move money in (rider payments) and out (driver and courier payouts).',
    read:'Global card acceptance and Instant Pay for drivers. Collecting upfront and paying out on Uber’s schedule makes the float mildly working-capital-positive.' },
  { g:'Fleet and charging', tag:'about 15% of supply hours', who:'Hertz · Avis · EVgo · Moove',
    role:'Vehicle supply (rental fleets) and EV charging infrastructure.',
    read:'About 15% of Mobility supply hours come from fleets; the on-ramp for EV and AV supply. Hertz also runs fleet operations for Uber’s AV partners.' },
  { g:'Ad tech and marketing', tag:'feeds the ads business', who:'The Trade Desk · Criteo · DoubleVerify',
    role:'Measure, target and verify Uber’s in-app advertising.',
    read:'Make the advertising business sellable to brands — the clearest pure-margin lever Uber has.' },
  { g:'Real estate and infrastructure', tag:'AV depots', who:'Alexandria · Equinix · Hudson Pacific',
    role:'Offices, data centers, and the AV depots Uber is buying for charging and repair.',
    read:'Physical backbone for the AV scale-up; small dollars (Alexandria’s $28M is the largest), mostly optionality.' }
];
// The demand side SPLC traces = the merchant network (its "customers"); the full explorer is Top Line ▸ Customers.
var CUST=[
  ['Restaurants','McDonald’s · Domino’s · Chipotle · Darden · Little Caesars — core Delivery supply; no single chain is material, so pricing power sits with Uber.'],
  ['Grocery and retail','Costco · Kroger · Albertsons · Carrefour · Coles · Best Buy — the fastest-growing part of the merchant base.'],
  ['International and partners','FEMSA · Rakuten · Cencosud · Loblaw · Instacart · Delta — reach into other markets and partnerships.']
];

function money(m){ return '$'+(m>=1000?(m/1000).toFixed(1)+'B':Math.round(m)+'M'); }
function ddStat(items){
  return '<div class="gdd-kpis">'+items.map(function(s){ return '<div class="gdd-kpi"><div class="gdd-kpi-v">'+s[0]+'</div><div class="gdd-kpi-k">'+esc(s[1])+'</div></div>'; }).join('')+'</div>';
}

export function uberSplcBody(){
  var top=CHAIN1[0], tot=0; CHAIN1.forEach(function(s){ tot+=s.rel; });
  var ratio=tot/GB_FY25*100;
  var h='';
  h+='<p class="ov-lede"><b>What SPLC can and cannot see.</b> Uber’s most important supplier is not in Bloomberg’s supply-chain data at all: it is the drivers and couriers who bring the cars and do the work — the supply constraint and, through their pay and insurance, the largest cost (cost of revenue, Bottom Line ▸ General). They are recruited, incentivized and retained but owned by no one, and the marketplace with the most of them online gives the best service at the lowest price, which attracts more riders, which attracts more drivers. What SPLC traces is the thin vendor layer around that marketplace: <b>'+SPLC_TOTAL.suppliers+' suppliers</b>, of which only <b>'+SPLC_TOTAL.sized+'</b> carry a relationship size.</p>';
  h+=ddStat([[String(SPLC_TOTAL.suppliers),'suppliers tracked'],[String(SPLC_TOTAL.sized),'with a disclosed relationship size'],
    ['~'+money(tot),'disclosed supplier spend'],[ratio.toFixed(2)+'%','of FY2025 Gross Bookings'],
    [money(top.rel),'largest relationship ('+top.n+')']]);
  h+='<div class="ew-note ew-small meta-splc-cap">The compilation behind this pane gives no supplier-facility geography and no supplier revenue dependency on Uber, so the guide’s geography and “who needs whom” blocks are not drawn. Autonomous vehicles are a future supply source, not today’s: human drivers still supply the overwhelming majority of trips.</div>';
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Chain 1 · the vendors SPLC can size</b> — relationship size; bar = relative to the largest. Tap a card for the read.</div>';
  h+='<div class="ce-watch">'+CHAIN1.map(function(s,i){
    var w=Math.max(s.rel/top.rel*100,2);
    return '<div class="ce-w ov-clickable meta-splc-card" data-detail="splc:'+i+'">'+
      '<div class="ce-w-top"><div class="ce-w-metric">'+esc(s.n)+'</div><span class="ce-w-chip meta-splc-chip">'+esc(s.cat)+'</span><span class="ce-w-chip meta-splc-more">the read ›</span></div>'+
      '<div class="ov-mbar meta-splc-bar"><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+w.toFixed(1)+'%"></div></div></div>'+
      '<div class="ce-w-chips"><span class="ce-w-chip meta-splc-chip"><b>'+money(s.rel)+'</b> relationship</span><span class="ce-w-chip meta-splc-chip">'+(s.rel/GB_FY25*100).toFixed(3)+'% of FY2025 Gross Bookings</span></div>'+
    '</div>';
  }).join('')+'</div>';
  h+='<div class="ov-sec meta-splc-geo"><div class="ov-sec-h">The disclosed spend against the platform — relationship size, US$ million</div>'+
    '<div class="meta-splc-geo-c"><canvas id="uberSplcRel"></canvas></div>'+
    '<div class="rs-collap"><button type="button" class="rs-collap-h" data-selfwired="1" data-usplc="1"><span class="rs-collap-ic">▸</span> Data — what the chart draws <span class="rs-collap-sub">'+CHAIN1.length+' rows</span></button>'+
      '<div class="rs-collap-b" hidden><div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Supplier</th><th>Category</th><th>Relationship (US$M)</th><th>% of FY2025 Gross Bookings</th></tr></thead><tbody>'+
      CHAIN1.map(function(s){ return '<tr><td class="rs-ft-h">'+esc(s.n)+'</td><td>'+esc(s.cat)+'</td><td>'+s.rel+'</td><td>'+(s.rel/GB_FY25*100).toFixed(3)+'%</td></tr>'; }).join('')+
      '</tbody></table></div></div></div>'+
    '<div class="ew-note ew-small meta-splc-cap">About '+money(tot)+' of sized spend against '+money(GB_FY25)+' of Gross Bookings ('+ratio.toFixed(2)+'%) — the ratio of a platform, not an operator. No supplier Uber buys from holds it captive.</div></div>';
  h+='<div class="ov-diagram-cap meta-splc-cap"><b>Chain 2 · the supplier base by role</b> — mostly strategic ties, not vendor bills</div>';
  h+='<div class="rs-ft-scroll"><table class="rs-ft"><thead><tr><th class="rs-ft-h">Group</th><th>What they do</th><th>Named counterparties</th><th>The read</th></tr></thead><tbody>'+
    CHAIN2.map(function(s){ return '<tr><td class="rs-ft-h">'+esc(s.g)+'<div class="meta-splc-sub">'+esc(s.tag)+'</div></td><td>'+esc(s.role)+'</td><td>'+esc(s.who)+'</td><td>'+esc(s.read)+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  h+='<div class="ew-note ew-small meta-splc-cap">The exception to “nobody holds Uber captive” is the autonomous-vehicle stack: it is the one group that could disintermediate the platform. The hedge is breadth — 30+ partners, so that no single one owns the demand.</div>';
  h+='<div class="ov-sec meta-splc-geo"><div class="ov-sec-h">The demand side SPLC can trace — the merchant network</div>'+
    '<div class="rs-ft-scroll"><table class="rs-ft"><tbody>'+
      CUST.map(function(c){ return '<tr><td class="rs-ft-h">'+esc(c[0])+'</td><td>'+esc(c[1])+'</td></tr>'; }).join('')+
    '</tbody></table></div>'+
    '<div class="ew-note ew-small meta-splc-cap">In SPLC, Uber’s “customers” are the merchants — really supply for the Delivery marketplace. The compilation puts about 77% of that merchant base in the US, against a Mobility business that books most of its Gross Bookings abroad. The full explorer is in Top Line ▸ Customers.</div></div>';
  h+='<div class="ov-foot">Source: Bloomberg Supply Chain Analysis (SPLC), UBER US Equity, as of '+SPLC_ASOF+', as compiled for the July 2026 profile (DOAA351); the export file itself was not found in the repository or in the Summit Drive (searched Nov 3 2026), so the figures are used as compiled and were not re-read. Relationship sizes are Bloomberg estimates; directional, not audited. '+
    'FY2025 Gross Bookings from Uber’s 4Q25 earnings release (Form 8-K, Feb 4 2026). Group readings are Summit’s (the July profile’s text).</div>';
  return h;
}

export function uberSplcBuild(){
  var pane=document.querySelector('.ov-uber-dd .ovt-subpane[data-ovst="supplychain"]');
  if(pane && !pane._usplcWired){ pane._usplcWired=true;
    pane.addEventListener('click', function(e){ var h=e.target.closest?e.target.closest('.rs-collap-h[data-usplc]'):null; if(!h) return;
      var b=h.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open;
      var ic=h.querySelector('.rs-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }); }
  var cv=chartReady('uberSplcRel'); if(!cv) return; destroy('uberSplcRel');
  _charts['uberSplcRel']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:CHAIN1.map(function(s){ return s.n; }), datasets:[
      { label:'Relationship size (US$M)', data:CHAIN1.map(function(s){ return s.rel; }), backgroundColor:getComputedStyle(document.documentElement).getPropertyValue('--navy').trim()||'#1E2733', maxBarThickness:15 } ] },
    options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ var s=CHAIN1[ctx.dataIndex]; return '$'+s.rel+'M · '+(s.rel/GB_FY25*100).toFixed(3)+'% of FY2025 Gross Bookings'; } } } },
      scales:{ x:{ grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ callback:function(v){ return '$'+v+'M'; } } }, y:{ grid:{ display:false }, ticks:{ font:{ size:10 } } } } } });
}

// Modal for a Chain 1 card (data-detail="splc:<i>"), resolved by uber.js's delegated handler.
export function uberSplcPop(id){
  var s=CHAIN1[+id]; if(!s) return null;
  return { t:esc(s.n)+' <span class="meta-splc-sub">'+money(s.rel)+' · '+esc(s.cat)+'</span>',
    h:'<p>'+s.d+'</p><p>Bloomberg sizes the relationship at <b>'+money(s.rel)+'</b>, about '+(s.rel/GB_FY25*100).toFixed(3)+'% of Uber’s FY2025 Gross Bookings. The compilation gives no figure for Uber’s share of '+esc(s.n)+'’s revenue.</p>' };
}
