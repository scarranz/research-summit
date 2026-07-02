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

// ─── Shared helpers ─────────────────────────────────────────────────────────────
function badges(arr){ return arr.map(function(b){ return '<span class="pay-badge '+b[1]+'">'+esc(b[0])+'</span>'; }).join(''); }
function bar(pct, color){ return '<span style="flex:1;height:4px;background:var(--ice);border-radius:2px;overflow:hidden;display:inline-block"><span style="display:block;height:4px;border-radius:2px;width:'+pct+'%;background:'+color+'"></span></span>'; }

// ─── Tab 3 · Threat Vectors ─────────────────────────────────────────────────────
var THREATS = [
  { icon:'🏛️', bg:'var(--pale)', name:'Direct Network Replication', tag:'Category 1 · Must replicate all four layers simultaneously',
    body:'Build a fourth global card network doing exactly what Visa does — same rules, switching, fraud intelligence, and brand — but cheaper. Hardest path that exists. The only example is UnionPay, built on Chinese government mandate with 1.4 billion captive cardholders, and it still does not have genuine global parity after 20 years. Without a state mandate forcing bank participation, the coordination problem is essentially unsolvable from scratch.',
    tags:[['Highest difficulty','pay-b-mut'],['Lowest near-term risk','pay-b-green'],['Only viable via state mandate','pay-b-mut']] },
  { icon:'⚡', bg:'var(--green-l)', name:'Real-Time Rail Displacement', tag:'Category 2 · Attacks Layer 2 only — the most credible structural medium-term threat',
    body:'Government-mandated instant payment rails (UPI, PIX, FPS, FedNow/RTP) make the card-switching layer obsolete for domestic flows — cheaper, faster, and zero interchange for merchants. UPI already exceeds Visa and Mastercard combined for domestic India transactions. The critical question is whether rails acquire the fraud intelligence and rules layers over time, or remain dumb infrastructure.',
    tags:[['Medium difficulty','pay-b-mut'],['Highest credible volume risk','pay-b-red'],['Long runway in US','pay-b-amber'],['Already dominant in India','pay-b-green']] },
  { icon:'📱', bg:'var(--pale)', name:'Endpoint / Interface Capture', tag:'Category 3 · Currently rides on top of V/MA — could route beneath them',
    body:'Apple Pay, Google Pay, WeChat, and Alipay capture the consumer-merchant interface and are building Layer 4 trust through their own brands. Currently they route transactions over Visa/Mastercard rails — V/MA still collect network fees. The risk: if Apple or Google establish direct bank relationships and add their own routing logic, they bypass the network fee. Apple’s Goldman Sachs partnership and Apple Savings are early signals. EU Digital Markets Act could compel open routing, removing the default V/MA preference baked into every iPhone.',
    tags:[['Medium difficulty','pay-b-mut'],['Currently a partner, not a competitor','pay-b-amber'],['Watch: Apple bank charter','pay-b-mut']] },
  { icon:'⛓️', bg:'var(--blue-l)', name:'Protocol / Cryptographic Replacement', tag:'Category 4 · Stablecoins — replaces institutional trust with mathematical proof',
    body:'Stablecoins (USDC, USDT, tokenized bank deposits) make trust intermediation theoretically unnecessary — cryptographic settlement finality replaces the need for an entity every party trusts. The risk is not retail consumers paying with stablecoins instead of cards. The real risk is B2B and cross-border flows — supplier payments, payroll, FX settlement — bypassing card rails entirely without ever generating a V/MA transaction. Both companies are co-opting: Mastercard’s $1.8B BVNK acquisition, Visa’s stablecoin settlement program. A 10-year horizon, not a 5-year one.',
    tags:[['Longest timeline','pay-b-mut'],['B2B and cross-border first','pay-b-blue'],['V/MA actively co-opting','pay-b-mut']] },
];
function threatsTab(){
  return '<div class="pay-sec">Four categories of potential displacement</div>'+
    THREATS.map(function(t){
      return '<div class="pay-threat"><div class="pay-t-icon" style="background:'+t.bg+'">'+t.icon+'</div>'+
        '<div><div class="pay-t-name">'+esc(t.name)+'</div><div class="pay-t-tag">'+esc(t.tag)+'</div>'+
        '<div class="pay-t-body">'+esc(t.body)+'</div><div class="pay-t-tags">'+badges(t.tags)+'</div></div></div>';
    }).join('');
}

// ─── Tab 4 · Rail Displacement ──────────────────────────────────────────────────
var CARD_FLOW = [
  { n:'Step 1', t:'Consumer taps card', b:'Card credential (PAN or token) sent to terminal. Merchant identifies the network from the card’s BIN number. V/MA logo determines which network to route to. Visa and Mastercard are in the flow from the first millisecond.', hl:'#EAF0F7' },
  { n:'Step 2', t:'Acquirer → VisaNet', b:'Authorization request sent to VisaNet / Banknet. V/MA run fraud scoring on 500+ variables in real time using their global intelligence layer. Routes to the issuing bank. V/MA collect a network fee at this point.' },
  { n:'Step 3', t:'Issuer authorizes', b:'Issuing bank approves or declines. Response returns through VisaNet to terminal in <100ms. V/MA guarantee the payment — if the acquirer fails, they make the issuer whole. This guarantee is central to the whole system’s trust.' },
  { n:'Step 4', t:'Clearing & settlement', b:'V/MA calculate net positions between all banks at end of day. Issue settlement instructions. Collect assessment fees and network fees from acquirer and issuer — the revenue line for V/MA.' },
];
var RAIL_FLOW = [
  { n:'Step 1', t:'Consumer scans QR / sends via app', b:'No card credential. No PAN. Consumer identifies payee via UPI ID, phone number, or QR code linked directly to their bank account. Visa and Mastercard have zero visibility into this transaction — they are not in the flow at all.', hl:'#E8F3EC' },
  { n:'Step 2', t:'App → Central infrastructure', b:'Request goes directly to the central operator: NPCI (India), Banco Central (Brazil), Federal Reserve (US). No private network intermediary. The central operator routes between banks. V/MA earn nothing on this flow.' },
  { n:'Step 3', t:'Accounts debited instantly', b:'Payer’s bank account debited in real time — not end of day. Payee’s account credited immediately. Settlement is final and irrevocable within seconds. The central bank is the guarantor — no private network guarantee needed.' },
  { n:'Step 4', t:'Zero interchange', b:'No network fee. No interchange. Merchant cost: typically zero. The government operator charges banks a nominal participation fee — orders of magnitude below V/MA network fees. This is why merchants actively prefer rails where available.' },
];
var DISPLACE = [
  ['Layer 2 network fees on domestic debit','Every domestic UPI or PIX transaction that would have been a Visa/MC debit card payment is a lost network fee. In India this is already material — V/MA earn nothing on those flows.'],
  ['Debit card issuance pressure','If consumers use their bank account directly via app, issuing banks have less incentive to issue debit cards. Fewer debit cards = lower network volume = lower network fees and VAS attachment. Credit cards are more resilient because rails don’t extend credit.'],
  ['Issuer negotiating leverage at renewal','When real-time rails exist, issuers can credibly threaten to migrate debit volume to the government rail. This is a real outside option that didn’t exist before UPI/PIX — and a structural driver of rising client incentives.'],
];
var NOTDISPLACE = [
  ['Cross-border transactions','UPI, PIX, and FedNow are domestic rails. The Indian tourist paying in Tokyo still uses Visa or Mastercard. Multi-country coordination — rules, FX, fraud — is exactly what local rails cannot solve. International flows remain entirely V/MA territory.'],
  ['Credit card economics','Rails move money between existing bank accounts. They do not extend credit. A UPI transaction cannot replace a credit card because the credit extension, rewards, and installment financing are provided by the issuing bank, not Visa. Credit volume (50–60% of V/MA revenue) is structurally insulated.'],
  ['Fraud & dispute infrastructure','Real-time rails have severe fraud problems. PIX fraud in Brazil and UPI phishing are serious — there is no equivalent of the V/MA chargeback framework. Banks building on rails must solve this themselves or buy it. This is the opening for V/MA’s VAS products on top of rail infrastructure.'],
];
var SECURITY = [
  { t:'1 — Strong customer authentication (SCA)', b:'UPI and PIX require two-factor authentication on every transaction: device PIN or biometric plus a bank UPI PIN or OTP. Authentication happens before the payment leaves the consumer’s device. Contrast with cards where authentication is optional and fraud liability is absorbed by the network guarantee.', tags:[['Effective for push payments','pay-b-green'],['Cannot stop authorized push fraud','pay-b-red']] },
  { t:'2 — Irrevocable settlement + bank liability', b:'Rail transactions are final — no chargeback mechanism equivalent to V/MA exists. Liability shifts entirely to the sending bank: if a customer is defrauded, their bank is responsible for remediation. This creates strong incentives for banks to invest in their own fraud prevention. The UK PSR’s APP fraud reimbursement mandate (Oct 2024) is the regulatory expression of this shift.', tags:[['Different from card chargeback','pay-b-mut'],['Regulatory frameworks maturing','pay-b-amber']] },
  { t:'3 — Central operator monitoring', b:'NPCI (UPI) and Banco Central (PIX) run their own transaction monitoring systems. Key weakness: they only see domestic transactions within their rail. Zero visibility into cross-border fraud patterns, no equivalent of V/MA’s global intelligence sharing. Fraud rates on UPI and PIX are meaningfully higher than on V/MA card networks per available data.', tags:[['Domestic visibility only','pay-b-amber'],['No cross-border intelligence','pay-b-red']] },
  { t:'4 — Third-party fraud overlay (the V/MA opportunity)', b:'Banks on real-time rails increasingly buy fraud intelligence from third parties to compensate for what the central operator cannot provide. This is where Visa’s Protect for A2A and Mastercard’s Consumer Fraud Risk (on Vocalink) enter the picture. V/MA are selling their fraud intelligence layer on top of the rails that displace their switching layer — lose the routing fee, sell the intelligence the new routing cannot generate on its own.', tags:[['V/MA VAS opportunity on rails','pay-b-blue'],['Already live in UK','pay-b-green']] },
];
var VERDICT = [
  ['Volume impact','Domestic debit volume in rail-dominant markets is at structural risk. Real — already happened in India. Not yet material in the US or Western Europe but the trajectory is clear. Model as a gradual debit volume headwind in EM markets, not a binary cliff.'],
  ['Revenue impact','Network fees on displaced debit volume are lost. But VAS revenue may partially offset: fraud intelligence sold to rail participants, A2A fraud products, open banking platforms (Tink, Finicity) on top of rail infrastructure. Net revenue impact is smaller than gross volume impact.'],
  ['Incentive impact','Rail existence increases issuer leverage at renewal. This is already flowing into higher client incentives — the CI/PV ratio drift is partly already a symptom of rail competition, not just bilateral V/MA bidding.'],
];
function flowRow(steps){
  return '<div class="pay-flow-row">'+steps.map(function(f,i){
    var arrow = i<steps.length-1 ? '<div class="pay-flow-arr">→</div>' : '';
    return '<div class="pay-flow-step"'+(f.hl?' style="background:'+f.hl+'"':'')+'>'+
      '<div class="pay-fn">'+esc(f.n)+'</div><div class="pay-ft">'+esc(f.t)+'</div><div class="pay-fb">'+esc(f.b)+'</div></div>'+arrow;
  }).join('')+'</div>';
}
function noteList(items, color){
  return items.map(function(it){
    return '<div class="pay-note"><div class="pay-note-bar" style="background:'+color+'"></div>'+
      '<div><div style="font:700 12px Inter,sans-serif;color:var(--navy);margin-bottom:2px">'+esc(it[0])+'</div>'+
      '<div class="pay-body" style="font-size:11px">'+esc(it[1])+'</div></div></div>';
  }).join('');
}
function railsTab(){
  var h = '<div class="pay-sec">How local rail displacement works — and whether it dislocates V/MA</div>';
  h += '<div class="pay-lbl" style="margin-bottom:8px">Card network transaction flow (Visa / Mastercard)</div>'+flowRow(CARD_FLOW);
  h += '<div class="pay-lbl" style="margin-bottom:8px">Instant payment rail flow (UPI / PIX / FedNow)</div>'+flowRow(RAIL_FLOW);
  h += '<div class="pay-sec">Does rail displacement actually dislocate Visa and Mastercard?</div>'+
    '<div class="pay-g2" style="margin-bottom:14px">'+
      '<div class="pay-card"><div class="pay-lbl" style="color:var(--green)">What it does displace</div>'+
        '<div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">'+noteList(DISPLACE,'#16A34A')+'</div></div>'+
      '<div class="pay-card"><div class="pay-lbl" style="color:var(--red)">What it does not displace</div>'+
        '<div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">'+noteList(NOTDISPLACE,'#DC2626')+'</div></div>'+
    '</div>';
  h += '<div class="pay-sec">How do real-time rails secure transactions without Visa/Mastercard?</div>'+
    '<div class="pay-card" style="margin-bottom:14px"><div class="pay-lbl" style="margin-bottom:12px">Four security mechanisms — and where they fall short</div>'+
    '<div class="pay-g2">'+SECURITY.map(function(s){
      return '<div class="pay-inset"><div style="font:700 12px Inter,sans-serif;color:var(--navy);margin-bottom:4px">'+esc(s.t)+'</div>'+
        '<div class="pay-body" style="font-size:11px">'+esc(s.b)+'</div><div style="margin-top:6px;display:flex;gap:5px;flex-wrap:wrap">'+badges(s.tags)+'</div></div>';
    }).join('')+'</div></div>';
  h += '<div class="pay-card" style="border-left:3px solid var(--navy)"><div class="pay-lbl">Verdict</div>'+
    '<div class="pay-g3" style="margin-top:8px">'+VERDICT.map(function(v){
      return '<div><div style="font:700 12px Inter,sans-serif;color:var(--navy);margin-bottom:4px">'+esc(v[0])+'</div><div class="pay-body" style="font-size:11px">'+esc(v[1])+'</div></div>';
    }).join('')+'</div></div>';
  return h;
}

// ─── Tab 5 · Replication Matrix ─────────────────────────────────────────────────
var MATRIX = [
  { section:'Direct network replication', rows:[
    { flag:'🇨🇳', name:'UnionPay', sub:'State-mandated card network', d:[2,2,2,3], overall:['Low globally','pay-b-green'] },
  ]},
  { section:'Real-time rail displacement (Layer 2 attack)', rows:[
    { flag:'🇮🇳', name:'UPI — India / NPCI', sub:'Government instant rail', d:['x',1,3,'x'], overall:['High — in India','pay-b-red'] },
    { flag:'🇧🇷', name:'PIX — Brazil', sub:'Central bank instant payments', d:['x',1,3,'x'], overall:['High — in Brazil','pay-b-red'] },
    { flag:'🇺🇸', name:'FedNow / RTP — US', sub:'Fed Reserve + Clearing House', d:['x',1,3,'x'], overall:['Low now — watch 10yr','pay-b-mut'] },
  ]},
  { section:'Endpoint / interface capture', rows:[
    { flag:'📱', name:'Apple Pay / Google Pay', sub:'Currently routes over V/MA', d:['x',3,3,1], overall:['Medium — growing leverage','pay-b-amber'] },
    { flag:'🇨🇳', name:'Alipay / WeChat Pay', sub:'Closed-loop ecosystem', d:['x',1,2,2], overall:['Low outside Asia','pay-b-green'] },
  ]},
  { section:'Protocol replacement', rows:[
    { flag:'⛓️', name:'Stablecoins (USDC/USDT)', sub:'Cryptographic settlement', d:[3,1,'x',3], overall:['Low retail, watch B2B','pay-b-mut'] },
  ]},
];
var MATRIX_KEY = [['1','pay-d1','Done / straightforward'],['2','pay-d2','Hard — years + capital'],['3','pay-d3','Very hard — needs state mandate'],['✕','pay-dn','Not attempting this layer']];
var MATRIX_SUM = [
  ['Most replicable','var(--green)','<b>Layer 2 — Switching.</b> Instant payment rails have already done this domestically. But Layer 2 alone generates no revenue without Layers 1, 3, and 4 built on top.'],
  ['Least replicable','var(--red)','<b>Layer 3 — Fraud intelligence.</b> Requires cross-network global transaction data. No challenger has this without being the network. Self-reinforcing — the data advantage widens with volume.'],
  ['Slowest to build','var(--mid)','<b>Layer 1 — Rules.</b> Requires government recognition in 200+ jurisdictions and legal precedent built over decades. Cannot be solved with technology alone.'],
];
function diffChip(v){ if(v==='x') return '<span class="pay-diff pay-dn">✕</span>'; return '<span class="pay-diff pay-d'+v+'">'+v+'</span>'; }
function matrixTab(){
  var key = MATRIX_KEY.map(function(k){ return '<span style="display:inline-flex;align-items:center;gap:5px"><span class="pay-diff '+k[1]+'" style="width:24px;height:24px;font-size:10px">'+k[0]+'</span><span class="pay-body" style="font-size:11px">'+esc(k[2])+'</span></span>'; }).join('');
  var body = MATRIX.map(function(sec){
    var rows = '<tr class="pay-rs"><td colspan="6">'+esc(sec.section)+'</td></tr>';
    rows += sec.rows.map(function(r){
      return '<tr><td><div class="pay-mtx-co"><span style="font-size:15px">'+r.flag+'</span><div><b>'+esc(r.name)+'</b><div class="sub">'+esc(r.sub)+'</div></div></div></td>'+
        r.d.map(function(v){ return '<td>'+diffChip(v)+'</td>'; }).join('')+
        '<td><span class="pay-badge '+r.overall[1]+'">'+esc(r.overall[0])+'</span></td></tr>';
    }).join('');
    return rows;
  }).join('');
  var sum = MATRIX_SUM.map(function(s){
    return '<div class="pay-card-sm"><div class="pay-lbl" style="color:'+s[1]+'">'+esc(s[0])+'</div><div class="pay-body" style="font-size:11px">'+s[2]+'</div></div>';
  }).join('');
  return '<div class="pay-sec">Replication difficulty — layer by layer, challenger by challenger</div>'+
    '<div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-bottom:12px"><span class="pay-lbl" style="margin:0">Difficulty key</span>'+key+'</div>'+
    '<div class="pay-card" style="padding:0;overflow:hidden"><table class="pay-mtx"><thead><tr>'+
      '<th>Challenger</th><th>L1 Rules</th><th>L2 Switching</th><th>L3 Fraud Intel</th><th>L4 Brand</th><th>Overall threat</th>'+
    '</tr></thead><tbody>'+body+'</tbody></table></div>'+
    '<div class="pay-g3" style="margin-top:12px">'+sum+'</div>';
}

// ─── Tab 6 · Incentive Context ──────────────────────────────────────────────────
var INCENTIVES = [
  { y:'FY2018', pct:29, amt:'$5.5B', c:'#3E5A82' }, { y:'FY2019', pct:30, amt:'$6.3B', c:'#3E5A82' },
  { y:'FY2020', pct:32, amt:'$6.6B', c:'#3E5A82' }, { y:'FY2021', pct:31, amt:'$8.4B', c:'#3E5A82' },
  { y:'FY2022', pct:33, amt:'$10.3B', c:'#3E5A82' }, { y:'FY2023', pct:35, amt:'$12.3B', c:'#7C8694' },
  { y:'FY2024', pct:36, amt:'$13.8B', c:'#7C8694' }, { y:'FY2025', pct:37, amt:'$15.8B', c:'#1E2733', hl:true },
];
var LOOP = ['Rails emerge','Issuer outside option credible','Incentive leverage ↑','CI/PV ratio drifts up'];
function incentiveTab(){
  var bars = INCENTIVES.map(function(r){
    return '<div class="pay-inc-row"><div class="pay-inc-yr'+(r.hl?' hl':'')+'">'+esc(r.y)+'</div>'+
      '<div class="pay-inc-track"><div class="pay-inc-fill" style="width:'+r.pct+'%;background:'+r.c+'"><span class="pay-inc-pct">'+r.pct+'%</span></div></div>'+
      '<div class="pay-inc-amt'+(r.hl?' hl':'')+'">'+esc(r.amt)+'</div></div>';
  }).join('');
  var loop = LOOP.map(function(l,i){
    var arr = i<LOOP.length-1 ? '<span class="pay-loop-arr">→</span>' : '';
    return '<span class="pay-loop-chip'+(i===LOOP.length-1?' end':'')+'">'+esc(l)+'</span>'+arr;
  }).join('');
  return '<div class="pay-sec">Why client incentives are rising — the competitive and structural context</div>'+
    '<div class="pay-g2">'+
      '<div class="pay-card"><div class="pay-lbl">Visa client incentives as % of gross revenue</div>'+
        '<div style="margin-top:12px">'+bars+'</div>'+
        '<div class="pay-inset" style="margin-top:12px"><div class="pay-body" style="font-size:11px">8 percentage points over 7 years. At current Visa gross revenue (~$43B), each additional percentage point = ~$430M of additional contra-revenue drag on net revenue.</div></div></div>'+
      '<div class="pay-side">'+
        '<div class="pay-card"><div class="pay-lbl">Driver 1 — V/MA bilateral competition</div>'+
          '<div class="pay-body" style="margin-bottom:8px">When a large issuer portfolio comes up for renewal, Visa and Mastercard bid against each other. Neither has incentive to destroy the economics — this is bounded and self-limiting. But competition is real for the top-10 global issuer portfolios.</div>'+
          '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px">'+badges([['Chase','pay-b-blue'],['BofA','pay-b-blue'],['Citi','pay-b-blue'],['ICBC','pay-b-mut'],['HSBC','pay-b-mut']])+'</div>'+
          '<div style="display:flex;align-items:center;gap:8px"><span class="pay-lbl" style="margin:0;white-space:nowrap">Intensity</span>'+bar(55,'#7C8694')+'<span class="pay-badge pay-b-amber">Bounded / self-limiting</span></div></div>'+
        '<div class="pay-card" style="border-left:3px solid var(--red)"><div class="pay-lbl" style="color:var(--red)">Driver 2 — Issuers learned their leverage</div>'+
          '<div class="pay-body" style="margin-bottom:8px">Fintechs (Chime, Revolut), EU interchange regulation, and real-time rail alternatives taught issuers precisely what they need from V/MA vs. what they can route elsewhere. Better-informed negotiators extract higher incentives at each renewal cycle.</div>'+
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span class="pay-lbl" style="margin:0;white-space:nowrap">Intensity</span>'+bar(75,'#DC2626')+'<span class="pay-badge pay-b-red">Growing — structural</span></div>'+
          '<div class="pay-inset"><div class="pay-body" style="font-size:11px">Rail displacement strengthens Driver 2 directly: a real UPI or PIX alternative for debit makes the issuer’s outside option credible at renewal. The CI/PV ratio drift is partly already a symptom of rail competition.</div></div></div>'+
        '<div class="pay-card-sm"><div class="pay-lbl">The compounding loop</div><div class="pay-loop">'+loop+'</div></div>'+
      '</div>'+
    '</div>';
}

// ─── Tab registry + shell ───────────────────────────────────────────────────────
// ─── Value Chain tab · fee waterfall + the full stack ───────────────────────────
var WATERFALL = {
  cardType:'US Visa Rewards Credit Card', mdr:2.30,
  notes:[
    'US debit (Durbin-regulated): interchange capped at ~$0.21 + 0.05% (~$0.26 on $100); merchant MDR ~0.40–0.80%; the merchant can route to a PIN network (STAR, NYCE) at lower cost.',
    'Cross-border credit: add a network cross-border assessment ~0.80–1.00% plus a 1.5–3.0% FX spread the issuer charges the cardholder.',
    'A2A (UPI, PIX): $0 merchant fee, $0 consumer fee, $0 interchange — the operator charges banks only ~$0.01–0.04 per transaction.',
  ],
};
var FEE_SEGS = [
  { l:'Interchange → issuing bank', v:1.80, p:78.3, c:'#B45309' },
  { l:'Processor / acquirer margin', v:0.37, p:16.1, c:'#7C8694' },
  { l:'Assessment → card network', v:0.13, p:5.7, c:'#16A34A' },
];
function waterfallBlock(){
  var bar1 = '<div class="pay-wf"><div class="pay-wf-cap"><span>A $100 purchase · '+esc(WATERFALL.cardType)+'</span><span>total MDR ~'+WATERFALL.mdr.toFixed(2)+'%</span></div>'+
    '<div class="pay-wf-bar"><div class="pay-wf-seg" style="width:97.7%;background:#3E5A82">Merchant keeps $97.70</div>'+
    '<div class="pay-wf-seg" style="width:2.3%;background:#B45309"></div></div>'+
    '<div class="pay-wf-key"><span class="pay-wf-ki"><span class="pay-wf-dot" style="background:#3E5A82"></span>Merchant net $97.70 (97.7%)</span>'+
    '<span class="pay-wf-ki"><span class="pay-wf-dot" style="background:#B45309"></span>Total fees $2.30 (2.3%) — split below</span></div></div>';
  var bar2 = '<div class="pay-wf"><div class="pay-wf-cap"><span>Where the $2.30 fee goes</span><span>= the 2.3% MDR</span></div>'+
    '<div class="pay-wf-bar">'+FEE_SEGS.map(function(s){ return '<div class="pay-wf-seg" style="width:'+s.p+'%;background:'+s.c+'">$'+s.v.toFixed(2)+'</div>'; }).join('')+'</div>'+
    '<div class="pay-wf-key">'+FEE_SEGS.map(function(s){ return '<span class="pay-wf-ki"><span class="pay-wf-dot" style="background:'+s.c+'"></span>'+esc(s.l)+' $'+s.v.toFixed(2)+' ('+Math.round(s.p)+'%)</span>'; }).join('')+'</div></div>';
  var notes = '<div class="pay-inset" style="margin-top:4px">'+WATERFALL.notes.map(function(n){ return '<div class="pay-body" style="font-size:11px;margin-bottom:5px">• '+esc(n)+'</div>'; }).join('')+'</div>';
  var callout = '<div class="pay-card" style="margin-top:10px"><div class="pay-body">The <b>card network’s slice is the smallest</b> — just <b>$0.13</b> of the $2.30 fee — yet Visa and Mastercard earn the best margins in the whole chain. Their cut is a <b>toll on volume</b> at near-zero marginal cost; the issuer takes the biggest slice (interchange, ~$1.80) for bearing credit and fraud risk.</div></div>';
  return bar1 + bar2 + notes + callout;
}
var FOURPARTY = [
  { n:'Cardholder', t:'Initiates & repays', b:'Taps card or wallet; repays the issuer over time (credit) or from balance (debit). Chooses the payment method — the demand that sets the whole chain in motion.' },
  { n:'Merchant', t:'Pays the MDR', b:'Accepts the card and pays the full merchant discount rate (~2.30% on credit) to its acquirer. The primary cost-bearer of the four-party model.' },
  { n:'Acquirer', t:'Collects MDR, remits', b:'Stripe / Adyen / Fiserv. Collects the MDR, remits interchange to the issuer and assessment to the network, and keeps the margin.' },
  { n:'Network', t:'Routes · takes assessment', b:'Visa / Mastercard. Switches the authorization, runs fraud scoring, guarantees the payment — and takes a ~0.13% assessment, the smallest slice.' },
  { n:'Issuer', t:'Funds · takes interchange', b:'Chase / BofA. Approves and funds the purchase, bears credit & fraud risk, and receives interchange (~1.80%) — the largest fee slice.' },
];
var VC_SEGMENTS = [
  { id:'core-banking', size:46, name:'Core Banking & BaaS', tag:'Account-ledger infrastructure behind every issuer', flow:1,
    cos:[{n:'Temenos'},{n:'Thought Machine'},{n:'Mambu'},{n:'Galileo'},{n:'Cross River'},{n:'Green Dot'}] },
  { id:'consumers', size:52, name:'Consumer / Cardholder', tag:'Origin of every transaction & spending volume', flow:1, cos:[] },
  { id:'wallets', size:54, name:'Digital Wallets & Super-apps', tag:'Consumer interface riding on card or proprietary rails', flow:2,
    cos:[{n:'Apple Pay'},{n:'Google Pay'},{n:'PayPal'},{n:'Cash App'},{n:'Alipay'},{n:'WeChat Pay'},{n:'Revolut'}] },
  { id:'issuers', size:64, name:'Issuers', tag:'Banks that issue cards & receive interchange', flow:2,
    cos:[{n:'JPMorgan Chase'},{n:'Bank of America'},{n:'Citi'},{n:'Capital One'},{n:'Amex'},{n:'HSBC'}] },
  { id:'issuer-processors', size:50, name:'Issuer-Processors', tag:'Process card authorizations for issuers', flow:2,
    cos:[{n:'Fiserv'},{n:'FIS'},{n:'TSYS'},{n:'Marqeta'},{n:'Pismo',own:'V'}] },
  { id:'bnpl', size:46, name:'BNPL', tag:'Installment credit at POS; bypasses interchange', flow:2,
    cos:[{n:'Affirm'},{n:'Klarna'},{n:'Afterpay'},{n:'PayPal Pay Later'},{n:'Zip'}] },
  { id:'networks', size:76, name:'Card Networks', tag:'Rules · routing · fraud · brand — the trust platform', flow:3,
    cos:[{n:'Visa'},{n:'Mastercard'},{n:'American Express'},{n:'Discover'},{n:'UnionPay'},{n:'RuPay'}] },
  { id:'fraud-risk', size:50, name:'Fraud, Risk & Identity', tag:'Overlay intelligence across the chain', flow:3,
    cos:[{n:'Featurespace',own:'V'},{n:'Recorded Future',own:'MA'},{n:'LexisNexis'},{n:'Socure'},{n:'BioCatch'}] },
  { id:'a2a', size:52, name:'A2A / Real-Time Rails', tag:'Instant bank-to-bank; zero interchange', flow:3,
    cos:[{n:'UPI / NPCI'},{n:'PIX'},{n:'FedNow'},{n:'Zelle'},{n:'Visa Direct',own:'V'},{n:'Vocalink',own:'MA'}] },
  { id:'open-banking', size:46, name:'Open Banking', tag:'Account-data access & payment initiation', flow:3,
    cos:[{n:'Plaid'},{n:'Finicity',own:'MA'},{n:'Tink',own:'V'},{n:'TrueLayer'},{n:'Aiia',own:'MA'}] },
  { id:'crypto-rails', size:48, name:'Crypto & Stablecoin Rails', tag:'Cryptographic settlement finality', flow:3,
    cos:[{n:'Circle (USDC)'},{n:'Tether'},{n:'Coinbase'},{n:'BVNK',own:'MA'},{n:'Ripple'}] },
  { id:'acquirers', size:64, name:'Acquirers', tag:'Merchant-side banks; collect the MDR', flow:4,
    cos:[{n:'Stripe'},{n:'Adyen'},{n:'Fiserv'},{n:'Square'},{n:'Worldpay'},{n:'Checkout.com'}] },
  { id:'processors-gateways', size:52, name:'Processors & Gateways', tag:'Route checkout → acquirer', flow:4,
    cos:[{n:'CyberSource',own:'V'},{n:'Authorize.net',own:'V'},{n:'Braintree'},{n:'Stripe'},{n:'Adyen'}] },
  { id:'orchestration', size:44, name:'Payment Orchestration', tag:'Routing intelligence above gateways', flow:4,
    cos:[{n:'Spreedly'},{n:'Primer'},{n:'Payoneer'},{n:'Gr4vy'}] },
  { id:'cross-border-fx', size:52, name:'Cross-Border & FX', tag:'Highest-margin activity in the ecosystem', flow:4,
    cos:[{n:'Wise'},{n:'Remitly'},{n:'Western Union'},{n:'Nium'},{n:'Airwallex'},{n:'Currencycloud',own:'V'}] },
  { id:'pos-hardware', size:48, name:'POS Hardware & Terminals', tag:'Physical acceptance at the point of sale', flow:5,
    cos:[{n:'Ingenico'},{n:'Verifone'},{n:'Clover'},{n:'Square'},{n:'Toast'},{n:'Lightspeed'}] },
  { id:'merchants', size:58, name:'Merchants', tag:'Final recipient; primary bearer of the MDR', flow:6, cos:[] },
];
var SEG_BY_ID = {}; VC_SEGMENTS.forEach(function(s){ SEG_BY_ID[s.id] = s; });
var TIER_COLOR = { 1:'#94A3B8', 2:'#3E5A82', 3:'#1E2733', 4:'#B45309', 5:'#7C8694', 6:'#16A34A' };
// One recognizable company per node to give it a "face" (not every node has one).
var LOGO_BY_ID = {
  'core-banking':'temenos.com', 'wallets':'paypal.com', 'issuers':'chase.com',
  'issuer-processors':'fiserv.com', 'bnpl':'affirm.com', 'networks':'visa.com',
  'fraud-risk':'experian.com', 'a2a':'zellepay.com', 'open-banking':'plaid.com',
  'crypto-rails':'coinbase.com', 'acquirers':'stripe.com', 'processors-gateways':'adyen.com',
  'cross-border-fx':'wise.com', 'pos-hardware':'toasttab.com',
};
// Directed money flows between segments (from payments-extract.json). w = 1–3 size.
var PAY_FLOWS = [
  { a:'consumers', b:'issuers', l:'Interest, fees & payments', w:3 },
  { a:'consumers', b:'wallets', l:'Wallet funding', w:2 },
  { a:'wallets', b:'issuers', l:'Card-funded transaction', w:2 },
  { a:'issuers', b:'issuer-processors', l:'Issuer processing fees', w:2 },
  { a:'issuers', b:'networks', l:'Volume assessments', w:2 },
  { a:'networks', b:'issuers', l:'Interchange + rebates', w:3 },
  { a:'merchants', b:'acquirers', l:'Merchant discount rate', w:3 },
  { a:'acquirers', b:'networks', l:'Assessment / scheme fees', w:2 },
  { a:'acquirers', b:'issuers', l:'Interchange (settlement)', w:3 },
  { a:'acquirers', b:'processors-gateways', l:'Processing fees', w:2 },
  { a:'merchants', b:'processors-gateways', l:'Gateway fees', w:2 },
  { a:'merchants', b:'bnpl', l:'Merchant fee 2.5–6%', w:2 },
  { a:'consumers', b:'bnpl', l:'Installment repayments', w:2 },
  { a:'merchants', b:'a2a', l:'~Zero acceptance fee', w:1 },
  { a:'consumers', b:'a2a', l:'Bank-to-bank transfer', w:2 },
  { a:'issuers', b:'open-banking', l:'Account data access', w:1 },
  { a:'open-banking', b:'a2a', l:'Payment initiation', w:1 },
  { a:'acquirers', b:'cross-border-fx', l:'FX conversion margin', w:2 },
  { a:'consumers', b:'crypto-rails', l:'On-ramp fees', w:1 },
  { a:'crypto-rails', b:'merchants', l:'Stablecoin settlement', w:1 },
  { a:'core-banking', b:'issuers', l:'Core platform licensing', w:2 },
  { a:'fraud-risk', b:'issuers', l:'Fraud scoring fees', w:2 },
  { a:'fraud-risk', b:'acquirers', l:'Fraud screening fees', w:1 },
  { a:'networks', b:'a2a', l:'Fraud VAS on rails', w:1 },
  { a:'merchants', b:'pos-hardware', l:'Terminal lease + SaaS', w:1 },
  { a:'orchestration', b:'acquirers', l:'Dynamic routing', w:1 },
];
var VC_TIERS = [
  [1,'Upstream — infrastructure & origin'], [2,'Issuing side — cards, credit & processing'],
  [3,'Core rails — networks, intelligence & alternatives'], [4,'Acquiring side — acceptance, routing & FX'],
  [5,'Physical acceptance'], [6,'Downstream — demand'],
];
function vcStack(){
  return VC_TIERS.map(function(tier){
    var segs = VC_SEGMENTS.filter(function(s){ return s.flow===tier[0]; });
    if(!segs.length) return '';
    var cards = segs.map(function(s){
      var chips = s.cos.length ? '<div class="pay-vc-chips">'+s.cos.map(function(c){
        var own = c.own ? '<span class="pay-own pay-own-'+(c.own==='V'?'v':'ma')+'">'+c.own+'</span>' : '';
        return '<span class="pay-chip">'+esc(c.n)+own+'</span>';
      }).join('')+'</div>' : '<div class="pay-vc-empty">No investable pure-play — observed via volume.</div>';
      return '<div class="pay-vc-card"><div class="pay-vc-name">'+esc(s.name)+'</div><div class="pay-vc-tag">'+esc(s.tag)+'</div>'+chips+'</div>';
    }).join('');
    return '<div class="pay-vc-tier">'+esc(tier[1])+'</div><div class="pay-vc-grid">'+cards+'</div>';
  }).join('');
}
var VC_INSIGHTS = [
  ['Networks are not processors','Visa &amp; Mastercard are four-layer trust platforms — rules, switching, fraud intelligence, brand — not payment processors. Real-time rails attack only the switching layer.'],
  ['The smallest slice, the best business','The network keeps ~$0.13 of a $2.30 fee, yet earns ~60–68% operating margins — a toll on volume at near-zero marginal cost.'],
  ['Cross-border is gold','A single cross-border purchase triggers a domestic assessment, a cross-border assessment AND a processing assessment at once — three revenue lines on one transaction.'],
  ['Buying the disruptors','Rather than compete, V/MA acquire across the stack — fraud, open banking, gateways, A2A, cross-border, stablecoins — turning threats into owned fee layers.'],
];
function vcInsights(){
  return '<div class="pay-g2">'+VC_INSIGHTS.map(function(it){
    return '<div class="pay-card-sm"><div class="pay-lbl">'+esc(it[0])+'</div><div class="pay-body" style="font-size:11px">'+it[1]+'</div></div>';
  }).join('')+'</div>';
}
function econView(){
  var h = '<div class="pay-sec">Where a $100 card payment goes — and who does what in the chain</div>';
  h += '<p class="pay-body" style="margin-bottom:14px">Visa and Mastercard sit in the middle of a deep, unbundled value chain — from the bank core that issues the card to the terminal that accepts it. Below: the fee split on a typical $100 purchase, the four-party money flow, and the full stack of 17 segments — with the networks’ own holdings marked <span class="pay-own pay-own-v">V</span> / <span class="pay-own pay-own-ma">MA</span>.</p>';
  h += waterfallBlock();
  h += '<div class="pay-sec">The four-party money flow</div>'+flowRow(FOURPARTY);
  h += '<div class="pay-sec">The full payments value chain — 17 segments</div>'+vcStack();
  h += '<div class="pay-card" style="margin:12px 0;border-left:3px solid var(--steel)"><div class="pay-lbl">The networks are everywhere</div><div class="pay-body">Visa and Mastercard don’t just run the switch — they’ve <b>bought into nearly every layer</b>: fraud (Featurespace → V, Recorded Future → MA), open banking (Tink → V, Finicity → MA), gateways (CyberSource &amp; Authorize.net → V), issuer processing (Pismo → V), A2A rails (Vocalink → MA, Visa Direct → V), cross-border (Currencycloud → V) and stablecoins (BVNK → MA). Lose a fee at the switch, capture it one layer over.</div></div>';
  h += '<div class="pay-sec">Key economics</div>'+vcInsights();
  return h;
}

// ── Interactive value-chain node map (Option B · cytoscape) ──────────────────────
var _cyLoading = null;
function ensureCytoscape(){
  if(window.cytoscape) return Promise.resolve();
  if(_cyLoading) return _cyLoading;
  _cyLoading = new Promise(function(res, rej){
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/cytoscape@3.30.2/dist/cytoscape.min.js';
    s.onload = res; s.onerror = function(){ rej(new Error('cytoscape load failed')); };
    document.head.appendChild(s);
  });
  return _cyLoading;
}
function payFlowsFor(id){
  return { inn:PAY_FLOWS.filter(function(f){ return f.b===id; }), out:PAY_FLOWS.filter(function(f){ return f.a===id; }) };
}
function payPanelDefault(){
  var el = document.getElementById('payMapPanel'); if(!el) return;
  var legend = [[1,'Upstream / origin'],[2,'Issuing side'],[3,'Core rails'],[4,'Acquiring side'],[5,'Acceptance'],[6,'Demand']].map(function(t){
    return '<span class="pay-map-leg"><span class="pay-wf-dot" style="background:'+TIER_COLOR[t[0]]+'"></span>'+esc(t[1])+'</span>';
  }).join('');
  el.innerHTML = '<div class="pay-card-sm"><div class="pay-lbl">The payments money web</div>'+
    '<div class="pay-body" style="font-size:11px">Every arrow is a fee or money movement between segments. <b>Interchange</b> (network → issuer) and the <b>MDR</b> (merchant → acquirer) are the thickest. <b>Click a node</b> to isolate it.</div></div>'+
    '<div class="pay-card-sm"><div class="pay-lbl">Tiers</div><div class="pay-map-legend">'+legend+'</div></div>';
}
function payPanelFocus(id){
  var el = document.getElementById('payMapPanel'), s = SEG_BY_ID[id]; if(!el || !s) return;
  var f = payFlowsFor(id);
  function lines(arr, dir){
    if(!arr.length) return '<div class="pay-body" style="font-size:11px;color:var(--mu)">—</div>';
    return arr.map(function(x){ var o = SEG_BY_ID[dir==='out'?x.b:x.a];
      return '<div class="pay-flowline"><span>'+esc(o?o.name:'')+'</span><b>'+esc(x.l)+'</b></div>'; }).join('');
  }
  var chips = s.cos.length ? '<div class="pay-vc-chips">'+s.cos.map(function(c){
      var own = c.own ? '<span class="pay-own pay-own-'+(c.own==='V'?'v':'ma')+'">'+c.own+'</span>' : '';
      return '<span class="pay-chip">'+esc(c.n)+own+'</span>'; }).join('')+'</div>'
    : '<div class="pay-vc-empty">No investable pure-play.</div>';
  el.innerHTML = '<div class="pay-card"><div class="pay-vc-name">'+esc(s.name)+'</div><div class="pay-vc-tag">'+esc(s.tag)+'</div>'+chips+'</div>'+
    '<div class="pay-card-sm"><div class="pay-lbl">Money in →</div>'+lines(f.inn,'in')+'</div>'+
    '<div class="pay-card-sm"><div class="pay-lbl">→ Money out</div>'+lines(f.out,'out')+'</div>';
}
// Logo <img> with a clearbit → favicon → hide fallback chain (HTML overlay avoids
// the canvas CORS problem that blocks cytoscape background-image logos).
function payLogoImg(domain){
  var img = document.createElement('img');
  img.style.cssText = 'position:absolute;transform:translate(-50%,-50%);object-fit:contain;pointer-events:none;transition:opacity .15s';
  var srcs = ['https://logo.clearbit.com/'+domain, 'https://www.google.com/s2/favicons?domain='+domain+'&sz=128'];
  var idx = 0; img.src = srcs[0];
  img.onerror = function(){ idx++; if(idx<srcs.length){ img.src = srcs[idx]; } else { img.style.display = 'none'; } };
  return img;
}
var _payCy = null;
function buildPayMap(){
  var cv = document.getElementById('payMapCy'); if(!cv || !cv.offsetParent) return;
  if(_payCy){ requestAnimationFrame(function(){ _payCy.resize(); _payCy.fit(undefined,40); }); return; }
  ensureCytoscape().then(function(){
    if(!window.cytoscape){ cv.innerHTML = '<div style="padding:22px;color:#8A93A0;font:400 12px Inter,sans-serif">Could not load the map library.</div>'; return; }
    cv.innerHTML = '';
    var tiers = {}; VC_SEGMENTS.forEach(function(s){ (tiers[s.flow] = tiers[s.flow]||[]).push(s); });
    var els = [];
    VC_SEGMENTS.forEach(function(s){
      var arr = tiers[s.flow], i = arr.indexOf(s), yc = (i-(arr.length-1)/2)*150;
      var d = { id:s.id, label:s.name, color:TIER_COLOR[s.flow], size:Math.round(s.size*1.5) };
      if(LOGO_BY_ID[s.id]) d.logo = 'https://logo.clearbit.com/'+LOGO_BY_ID[s.id];
      els.push({ data:d, position:{ x:(s.flow-1)*235, y:yc } });
    });
    PAY_FLOWS.forEach(function(f, i){
      els.push({ data:{ id:'pe'+i, source:f.a, target:f.b, label:f.l, w:1.4+f.w*1.7, color:TIER_COLOR[SEG_BY_ID[f.a].flow] } });
    });
    _payCy = window.cytoscape({ container:cv, elements:els, layout:{ name:'preset', fit:true, padding:46 },
      wheelSensitivity:0.2, minZoom:0.35, maxZoom:2.6,
      style:[
        { selector:'node', style:{ 'background-color':'data(color)','background-opacity':0.95,'width':'data(size)','height':'data(size)',
          'border-width':2,'border-color':'#fff',
          'label':'data(label)','color':'#1E2733','font-size':13,'font-weight':600,'text-wrap':'wrap','text-max-width':118,
          'text-valign':'bottom','text-margin-y':6,'text-background-color':'#fff','text-background-opacity':0.9,
          'text-background-padding':3,'text-background-shape':'roundrectangle' }},
        { selector:'node[logo]', style:{ 'background-color':'#fff','border-width':2.5,'border-color':'data(color)' }},
        { selector:'edge', style:{ 'width':'data(w)','line-color':'data(color)','opacity':0.3,'curve-style':'bezier',
          'target-arrow-shape':'triangle','target-arrow-color':'data(color)','arrow-scale':0.9 }},
        { selector:'.faded', style:{ 'opacity':0.06,'text-opacity':0.15 }},
        { selector:'node.hot', style:{ 'border-width':3.5,'border-color':'#1E2733' }},
        { selector:'edge.hot', style:{ 'opacity':0.92 }},
      ]
    });
    payPanelDefault();
    // Company-logo overlay: HTML <img>s positioned over the logo nodes.
    var logoLayer = document.createElement('div');
    logoLayer.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden';
    cv.appendChild(logoLayer);
    VC_SEGMENTS.forEach(function(s){
      if(!LOGO_BY_ID[s.id]) return;
      var img = payLogoImg(LOGO_BY_ID[s.id]); img.setAttribute('data-node', s.id); logoLayer.appendChild(img);
    });
    function positionLogos(){
      logoLayer.querySelectorAll('img').forEach(function(img){
        var n = _payCy.getElementById(img.getAttribute('data-node')); if(!n || !n.length) return;
        var p = n.renderedPosition(), sz = n.renderedWidth()*0.62;
        img.style.width = sz+'px'; img.style.height = sz+'px';
        img.style.left = p.x+'px'; img.style.top = p.y+'px';
        img.style.opacity = n.hasClass('faded') ? '0.12' : '1';
      });
    }
    var _lraf = null;
    function schedPos(){ if(_lraf) return; _lraf = requestAnimationFrame(function(){ _lraf = null; positionLogos(); }); }
    positionLogos();
    _payCy.on('render pan zoom', schedPos);
    _payCy.on('tap', 'node', function(e){
      var n = e.target; _payCy.elements().removeClass('hot faded');
      var hood = n.closedNeighborhood(); _payCy.elements().not(hood).addClass('faded'); hood.addClass('hot');
      payPanelFocus(n.id()); schedPos();
    });
    _payCy.on('tap', function(e){ if(e.target===_payCy){ _payCy.elements().removeClass('hot faded'); payPanelDefault(); schedPos(); } });
  }).catch(function(){ cv.innerHTML = '<div style="padding:22px;color:#8A93A0;font:400 12px Inter,sans-serif">Map failed to load (offline?).</div>'; });
}
function mapView(){
  return '<div class="pay-map-canvas" id="payMapCy"><div style="padding:22px;color:var(--mu);font:400 12px Inter,sans-serif">Loading map…</div></div>'+
    '<div class="pay-map-panel" id="payMapPanel"></div>'+
    '<div class="pay-asof" style="margin-top:8px">Nodes = value-chain segments (left → right is upstream → downstream), sized by relative importance; the logo is one representative player. Arrows = money flows, width ≈ magnitude. <b>Click a segment</b> to isolate its flows and see its players; <b>scroll to zoom</b>, drag to pan. Interchange (network → issuer) and the MDR (merchant → acquirer) are the thickest.</div>';
}

function valueChainTab(){
  return '<div class="pay-vc-toggle" id="payVcToggle">'+
      '<button type="button" class="pay-vc-tab active" data-vcv="econ">Fee economics</button>'+
      '<button type="button" class="pay-vc-tab" data-vcv="map">Value-chain map</button>'+
    '</div>'+
    '<div class="pay-vc-view" data-vcv="econ">'+econView()+'</div>'+
    '<div class="pay-vc-view" data-vcv="map" hidden>'+mapView()+'</div>';
}

var TABS = [
  { key:'valuechain', label:'Value Chain',        body:valueChainTab },
  { key:'layers',     label:'The Four Layers',    body:layersTab },
  { key:'map',        label:'Competitive Map',    body:mapTab },
  { key:'threats',    label:'Threat Vectors',     body:threatsTab },
  { key:'rails',      label:'Rail Displacement',  body:railsTab },
  { key:'matrix',     label:'Replication Matrix', body:matrixTab },
  { key:'incentive',  label:'Incentive Context',  body:incentiveTab },
];

function html(){
  var h = '<div class="pay">';
  h += '<div class="pay-head"><div class="pay-h-title">Payment Network Competitive Landscape</div>'+
    '<div class="pay-h-sub">Structural analysis · Visa &amp; Mastercard moat and threat framework</div></div>';
  h += '<div class="pay-tabs">'+TABS.map(function(t,i){
    return '<button type="button" class="pay-tab'+(i===0?' active':'')+'" data-pt="'+t.key+'">'+esc(t.label)+'</button>';
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

function showVcView(root, v){
  root.querySelectorAll('.pay-vc-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-vcv')===v); });
  root.querySelectorAll('.pay-vc-view').forEach(function(p){ p.hidden = (p.getAttribute('data-vcv')!==v); });
  if(v==='map') requestAnimationFrame(buildPayMap);
}

function init(){
  var root = document.querySelector('.pay');
  if(!root) return;
  if(!root._wired){ root._wired = true;
    root.querySelectorAll('.pay-tab').forEach(function(btn){
      btn.onclick = function(){ show(root, btn.getAttribute('data-pt')); };
    });
    root.querySelectorAll('.pay-vc-tab').forEach(function(btn){
      btn.onclick = function(){ showVcView(root, btn.getAttribute('data-vcv')); };
    });
  }
  var active = root.querySelector('.pay-tab.active');
  show(root, active ? active.getAttribute('data-pt') : 'layers');
}

export var paymentsIndustry = { html: html, init: init };
