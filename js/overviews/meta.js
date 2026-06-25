// overviews/meta.js — custom Overview for Meta Platforms, Inc. (NASDAQ: META)
// Built individually per the portal's per-company Overview model (see CLAUDE.md).
//
// Quantitative series: Summit DCF model for META (actuals_history sheet, snapshot
// 2026-05-22). HISTORICAL ONLY — the model's projection out-years are unreliable
// for META, so per the team's DCF policy we chart reported ACTUALS (FY2019–FY2025)
// and exclude forecast years.
// The "Spend Engine" decomposition (leases / cloud commitments) is an ANALYTICAL
// reconstruction by the Summit team from Meta 10-K/10-Q Note-8 commitments + vendor
// 8-Ks/press — it is NOT a clean company disclosure and lives outside the snapshots,
// so it is presented as estimated context (no per-line sourcing claimed).
// Qualitative content: Meta 10-Ks, Q4 2025 / Q1 2026 earnings calls, and a Summit
// "Ad Ecosystem" primer. No live API except the shared get-quote price banner.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Formatting ──────────────────────────────────────────────────────────────
function money(m){ if(m==null) return '—'; var neg=m<0,a=Math.abs(m),s;
  if(a>=1000) s='$'+(a/1000).toFixed(a/1000>=100?0:1)+'B'; else s='$'+Math.round(a)+'M'; return (neg?'−':'')+s; }
function pctStr(p){ return (p>=0?'+':'−')+Math.abs(p).toFixed(0)+'%'; }

// ─── Brand: Meta blue + Reality Labs violet ──────────────────────────────────
var BRAND='#0866FF', BRAND2='#1877F2', FOA='#0866FF', AD='#0866FF', OTHER='#7AA9FF', RL='#8B5CF6', GRAY='#B8C0CA', NEG='#C0392B', GREEN='#16A34A';

// ─── Annual ACTUALS, USD millions ────────────────────────────────────────────
var YEARS  = ['2019','2020','2021','2022','2023','2024','2025'];
var REV    = [70697, 85965, 117929, 116609, 134902, 164501, 200966];
var OPINC  = [23986, 32671, 46753, 28945, 46751, 69380, 83276];
var FCF    = [21212, 23584, 38993, 19044, 43847, 54072, 46109];
var CAPEX  = [15102, 15163, 18690, 31431, 27266, 37256, 69691];
var OPMARGIN = OPINC.map(function(v,i){ return v/REV[i]*100; });
// Depreciation & amortization, FY2021–2025 (the capex→D&A story).
var DA_YEARS = ['2021','2022','2023','2024','2025'];
var DA       = [7967, 8686, 11178, 15498, 18616];
// Segment split — clean from FY2021.
var SEG_YEARS = ['2021','2022','2023','2024','2025'];
var FOA_REV = [115655, 114450, 133005, 162354, 198758];
var RL_REV  = [2274, 2159, 1896, 2146, 2207];
var FOA_OP  = [56947, 42662, 62870, 87109, 102469];
var RL_OP   = [-10194, -13717, -15849, -17729, -19193];
// Family of Apps revenue = Advertising + Other (FY2021–2025).
var ADV_S = [114934, 113641, 131948, 160632, 196174];
var OTH_S = [721, 809, 1057, 1722, 2584];
var RL_CUM = 78781; // cumulative Reality Labs operating loss 2020–2025 (~$78.8B)

// ─── Snapshot & narrative ────────────────────────────────────────────────────
var SNAPSHOT=[
  ['Listing','NASDAQ: META'],['Founded','2004 — Cambridge, MA'],['IPO','May 2012 · $38.00'],
  ['CEO','Mark Zuckerberg (founder)'],['Segments','Family of Apps · Reality Labs'],['Control','Dual-class — founder voting control'],
];
var DESC='Meta is the world\'s largest social-advertising business. The <b>Family of Apps</b> — Facebook, Instagram, WhatsApp, Messenger and Threads (~3.5B daily people) — is the engine: an AI-driven advertising machine running at ~50% operating margin and almost entirely walled-garden (Meta owns every layer of the ad stack, so it keeps the whole ad dollar). That cash machine funds <b>Reality Labs</b>, the AR/VR + AI-hardware bet that still loses ~$19B a year — losses management now expects to peak around 2025 and then narrow. The whole story is: how much of the FoA cash gets re-invested into AI capex, and whether it pays off.';
var KPIS=[
  { l:'Revenue',          v:'$201B', d:pctStr((REV[6]/REV[5]-1)*100)+' YoY',  dir:'up' },
  { l:'Operating Income', v:'$83.3B',d:'~41% op margin',                       dir:'up' },
  { l:'Free Cash Flow',   v:'$46.1B',d:'after record capex',                   dir:'up' },
  { l:'Capex',            v:'$69.7B',d:pctStr((CAPEX[6]/CAPEX[5]-1)*100)+' YoY · AI build', dir:'down' },
];
var AS_OF='Headline KPIs are FY2025 (reported). Revenue $201.0B (+22%), operating income $83.3B (~41% margin), free cash flow $46.1B, and a record $69.7B of capex (+87% YoY). ~3.5B daily active people across the Family of Apps; advertising is ~98% of revenue.';
var FY_NOTE='Two engines, one company. <b>Family of Apps</b> generated ~$199B of revenue and ~$102B of segment operating profit in FY2025 — that profit <b>funds Reality Labs</b>, which lost ~$19B (~$79B cumulative since 2020). Forward years are intentionally excluded: the Summit DCF\'s META projection is unreliable in the out-years, so this overview charts reported actuals only (FY2019–FY2025), sourced from the model.';

// ── How Meta makes money: the ad auction (clickable chain) ──
var AD_FLOW=[
  { t:'A user opens Facebook / Instagram / Threads', d:'~3.5B daily people generate billions of ad impressions. Each impression is an <b>auction</b> held in real time — Meta\'s inventory is its attention.' },
  { t:'Advertisers bid for the impression', d:'Advertisers set a budget and a goal (a click, install, purchase). Meta runs an <b>auction</b>, not a fixed price — so pricing rises with demand and ad quality.' },
  { t:'AI ranks the auction', d:'The winner ≈ <b>bid × estimated action rate × ad quality</b>. Meta\'s AI (the GEM ranking model, Advantage+ automation) predicts who will convert — recent models drove +3.5% ad clicks on Facebook and >1% more conversions on Instagram (Q4 2025). This is where AI turns directly into revenue.' },
  { t:'The ad is shown; advertiser pays per result', d:'Meta keeps essentially <b>all</b> of the ad revenue (it owns every layer of the ad stack — see the walled garden). Advertising is ~<b>98%</b> of total revenue.' },
  { t:'It converts to cash at high margin', d:'Family-of-Apps operating margin is ~<b>50%+</b>; the cash funds buybacks, a dividend, and the Reality Labs + AI-capex bet.', payoff:true },
];
// The ad ecosystem (Summit primer): in the OPEN web each intermediary takes a cut.
var ECO_OPEN=[
  ['Advertiser pays', 100, '$1.00', '#1E2733'],
  ['DSP (buy-side)', 15, '−$0.15', '#9AA7B8'],
  ['Ad Exchange', 10, '−$0.10', '#B8C0CA'],
  ['SSP (sell-side)', 20, '−$0.20', '#CBD3DD'],
  ['→ Publisher keeps', 55, '$0.55', GREEN],
];
var WALLED='In the <b>open web</b>, an advertiser\'s dollar passes through a chain of middlemen — a DSP (buy-side, ~5–20%), an ad exchange, an SSP (sell-side, ~10–25%), plus data &amp; verification vendors — so only ~<b>$0.55</b> of each $1.00 reaches the publisher. <b>Meta is a "walled garden": it IS every layer at once</b> — publisher (FB/IG), SSP, DSP, ad exchange, data platform and verification, all in one closed loop. So Meta <b>keeps the entire ad dollar</b> (no leakage to intermediaries), owns the user data end-to-end, and controls the whole auction. That full vertical integration is a structural margin <i>and</i> moat advantage that DSP/SSP-dependent rivals can\'t match.';
var FOA_WINS=[
  '<b>AI ranking turns straight into revenue:</b> the new <b>GEM</b> ad model drove <b>+3.5% ad clicks on Facebook</b> and <b>&gt;1% more conversions on Instagram</b> (Q4 2025); ad <b>impressions +18% YoY</b> with <b>price-per-ad +6%</b>.',
  '<b>AI recommendations lift time-spent:</b> AI-recommended (unconnected) content is now <b>40%+ of the Facebook feed</b>, and Facebook surfaces ~25% more same-day Reels — the same ranking AI that powers ads keeps users on-app longer, compounding impressions.',
  '<b>Reels monetization caught up to feed</b> — once a drag (lower-monetizing short video cannibalizing feed), Reels now monetizes at roughly feed levels while driving big time-spent gains.',
  '<b>Threads is ramping:</b> time-spent <b>+20% YoY</b> (Q4 2025) with ad monetization scaling — a near-zero-CAC surface built off the Instagram graph.',
  '<b>Business messaging:</b> click-to-WhatsApp / Instagram ads are among the fastest-growing ad products — turning messaging into the next monetization surface.',
];

// ── Reality Labs ──
var RL_NOTE='Reality Labs is the long bet — and it is run at a deliberate, large loss. Two things matter for modelling it:';
var RL_POINTS=[
  '<b>Revenue mix &amp; recognition:</b> RL revenue ≈ a platform/"proxy" line + <b>Meta Quest</b> (Meta sells the headset directly and books the <b>full device price</b>) + <b>smart glasses</b> (Ray-Ban / Oakley Meta). Crucially, <b>EssilorLuxottica manufactures and is the device seller of record</b> for the glasses — it books the retail sales in its own Wearables division — so Meta recognizes only its <b>shared / partial economics, not the full retail price</b> (the exact split is undisclosed). So glasses can sell huge units while adding comparatively little reported RL revenue — versus Quest, which is full-device revenue.',
  '<b>The breakout is glasses, not VR:</b> Ray-Ban / Oakley Meta sold <b>&gt;7M units in 2025</b>; management is pivoting investment <b>toward wearables and away from VR/Horizon</b> (~1,500 RL roles cut), pitching glasses as the next platform for "personal superintelligence." Orion (full AR) is still a prototype.',
  '<b>Losses are at their peak:</b> RL lost ~<b>$19B in 2025</b> (~$79B cumulative). Zuckerberg (Q4 2025): 2026 losses will be "<i>similar to last year, and this will likely be the peak as we start to gradually reduce our losses going forward.</i>" Still red — but the inflection the FoA cash machine is built to absorb.',
];

// ── The Spend Engine (the "devil's accounting") ──
var SPEND_LEDE='Here is the part the market — and Summit — can\'t fully reconcile: Meta\'s algorithms are <b>advertising-aimed</b>, not as obviously compute-hungry as AWS, Google Cloud or Azure (which also carry physical/other businesses), yet Meta burns capital at a staggering rate. A Summit analysis reverse-engineered the spend from the 10-K commitments and vendor filings. The buildout is funded <b>three ways</b>:';
var SPEND_WAYS=[
  { k:'owned', t:'1 · Owned capex → depreciation', d:'Servers + data centers Meta buys outright become PP&E and flow through the P&L as <b>D&A</b>, which has exploded ($8B in 2021 → ~$18.6B in 2025, heading toward ~$29B). This is the "clean" part — but the depreciation wave it creates will pressure margins for years.' },
  { k:'leases', t:'2 · Leases (data centers)', d:'Much of the footprint is <b>leased</b>, not bought — operating + finance leases. Disclosed lease obligations ballooned from ~$34B (2024) to ~$104B (2025) toward ~$183B — a large, long-dated (≈13–15yr) commitment that lands in the P&L as it is recognized.' },
  { k:'cloud', t:'3 · Third-party cloud commitments', d:'The murkiest piece: Meta also <b>rents</b> huge compute via multi-year deals — <b>Google Cloud (~$10B), Oracle OCI (~$20B), CoreWeave (~$14B + ~$21B), Nebius (~$12B + ~$9B)</b> and more. Total purchase commitments hit ~<b>$237.7B</b> (10-K Note 8). Roughly ~70% is recognized as <b>cloud operating expense</b> (split between COGS for <b>inference</b> serving and R&D for <b>training</b>), the rest is capex-adjacent.' },
];
var SPEND_NOTE='<b>Why it matters:</b> a big chunk of Meta\'s "AI spend" never shows up as capex — it hides in cost of revenue and R&D as lease and cloud-commitment expense. That makes the true investment intensity larger than the headline capex line, and the eventual depreciation + commitment run-off a multi-year margin question. <span class="ave-subh-note">Figures are a Summit analytical reconstruction from Meta\'s commitment disclosures + vendor 8-Ks/press — estimates, not a clean company breakdown; shown for understanding, not sourced into the charts.</span>';
var EFFIC=[
  '<b>Custom silicon (MTIA):</b> MTIA Gen-2 is in production for recommendation inference, and a Broadcom partnership targets <b>&gt;1 GW</b> of in-house silicon — cited as meaningfully cheaper per inference than merchant GPUs.',
  '<b>Silicon diversification:</b> the Andromeda inference engine now spans <b>NVIDIA + AMD + MTIA</b>, with compute efficiency reportedly ~<b>tripled</b> — lowering cost per inference as workloads scale.',
  '<b>AI-driven productivity + headcount discipline:</b> AI coding/agents plus the post-"Year of Efficiency" posture (~8,000 roles cut around Q1 2026) keep headcount growth well below revenue growth.',
  '<b>Operating leverage:</b> the FoA ad engine\'s ~50%+ margin means incremental revenue drops through hard — the offset to the depreciation wave.',
];

var TIMELINE=[
  { y:'2004', t:'<b>Facebook founded</b> by Mark Zuckerberg at Harvard.' },
  { y:'2012', t:'<b>IPO</b> on NASDAQ at $38.00; acquires <b>Instagram</b> (~$1B).',
    d:'Meta (then Facebook) IPO\'d in May 2012 at <b>$38.00</b> — a famously rocky debut that traded down sharply before the mobile-advertising pivot re-rated it. The same year it bought <b>Instagram</b> for ~$1B, one of the best acquisitions in tech history.' },
  { y:'2014', t:'Acquires <b>WhatsApp</b> (~$19B) and <b>Oculus</b> (~$2B) — messaging scale + the VR seed.',
    d:'<b>WhatsApp</b> (~$19B) brought global messaging scale (now ~3B users and the base for click-to-message ads); <b>Oculus</b> (~$2B) seeded what became Reality Labs.' },
  { y:'2021', t:'Rebrands to <b>Meta</b>; carves out <b>Reality Labs</b> as a reported segment.',
    d:'The October 2021 rebrand to <b>Meta</b> signaled the metaverse pivot and introduced <b>Reality Labs</b> as a separate reporting segment — making its multi-billion-dollar losses visible for the first time.' },
  { y:'2022', t:'<b>The crash</b> — ad recession, Apple ATT, metaverse spend; stock falls to ~$88.',
    d:'A brutal year: Apple\'s <b>App Tracking Transparency</b> (ATT) hit ad targeting (~$10B headwind), a macro ad recession, TikTok competition, and surging Reality Labs spend collapsed the stock to ~$88. It set up the turnaround.' },
  { y:'2023', t:'<b>"Year of Efficiency"</b> — ~21k layoffs; margins and stock recover sharply.',
    d:'Zuckerberg declared a <b>"Year of Efficiency,"</b> cutting ~21,000 roles, flattening management and refocusing on AI and Reels. Operating margin re-expanded and the stock more than tripled.' },
  { y:'2024–26', t:'<b>AI re-rate</b> — record profit, the all-in AI push, and the FTC win.',
    d:'AI-driven ad improvements lifted price and conversion; revenue and profit hit records and Meta paid its <b>first dividend</b> (2024). In 2025 it went all-in: a <b>$14.3B stake in Scale AI</b> bringing <b>Alexandr Wang</b> as Chief AI Officer, the new <b>Superintelligence Labs</b>, a costly talent war, and an open→closed model pivot. It <b>won the FTC antitrust case (Nov 2025)</b> — no Instagram/WhatsApp breakup — and ramped <b>capex toward ~$125–145B</b> (2026 guide) for AI infrastructure.' },
];
var PEERS=[
  ['Alphabet (Google)', 'The other ad giant — Search + YouTube; also a walled garden.', 'Both re-rating on AI and both keep the ad dollar in-house. Meta owns <b>social/feed</b> attention and the best <b>direct-response</b> engine; Google owns <b>intent</b> (search). Both face the same AI-capex test — but Google has a cloud business to absorb its spend; Meta must monetize internally.'],
  ['TikTok (ByteDance)', 'Short-video attention machine.', 'The sharpest <b>attention</b> rival; Meta\'s answer is <b>Reels</b> (now monetizing near feed levels). A US ban / forced sale would be a direct tailwind.'],
  ['Amazon', 'Fast-growing retail-media ad business + AWS.', 'Competes for lower-funnel (purchase-intent) ad budgets; less a feed rival than a share-of-wallet one.'],
  ['Apple', 'Platform gatekeeper, not an ad peer.', 'ATT privacy changes structurally taxed Meta\'s targeting; Apple controls the iOS rules Meta lives under — a standing strategic risk.'],
];
var TAILWINDS=[
  '<b>AI monetizes directly:</b> Advantage+ is moving from "AI-assisted targeting" to a <b>full campaign autopilot</b> (Zuckerberg\'s "agentic" advertising: a business states a goal + budget + product, Meta\'s AI does the rest) — AI capex showing up as ad revenue.',
  '<b>Walled-garden economics:</b> Meta keeps the whole ad dollar (vs ~$0.55 to publishers in the open web) — full vertical integration is a structural margin + data moat.',
  '<b>Engagement wins:</b> Reels at feed-level monetization, AI-lifted time-spent (40%+ of FB feed AI-recommended), Threads +20% time-spent, business messaging as the next surface.',
  '<b>Operating discipline:</b> post-"Year of Efficiency" the FoA runs ~50%+ margin; management guides 2026 operating income <i>above</i> 2025 despite the capex step-up ("spend through it").',
  '<b>Legal overhang cleared:</b> the FTC antitrust case was <b>dismissed (Nov 2025)</b> — no breakup; plus the first dividend (2024) and large buybacks.',
];
var HEADWINDS=[
  '<b>The most binary AI-capex bet in megacap:</b> 2026 capex guided to ~<b>$125–145B</b> (raised in Apr 2026 from $115–135B) that must be monetized <b>internally</b> — Meta has no AWS/GCP-style cloud to absorb it. The depreciation + cloud-commitment wave pressures margins before returns are proven; the stock fell ~9% on the Q1 2026 raise.',
  '<b>Opaque spend:</b> much of the AI build hides in leases (~$183B obligations) and cloud commitments (~$237.7B) rather than capex — the true investment intensity, and its run-off, is hard to model.',
  '<b>Reality Labs burn:</b> ~$19B/yr (~$79B cumulative); losses expected to peak ~2025 but stay negative — tolerated only while FoA delivers.',
  '<b>AI strategy whiplash:</b> a costly talent war, the $14.3B Scale AI deal, and an open→closed Llama pivot have caused internal churn; the differentiated product is unproven.',
  '<b>Regulatory + governance:</b> EU DMA "pay-or-consent" fights and teen/AI-safety pressure persist; dual-class control leaves minority holders little say.',
];
var SOURCES='Quantitative series: Summit DCF model for META, actuals_history sheet (snapshot 2026-05-22) — reported FY2019–FY2025; the model\'s projection out-years are excluded as unreliable. Family DAP (~3.5B) and ARPP are company disclosures (not carried in this snapshot). The Spend Engine decomposition (leases, third-party cloud commitments by vendor) is a Summit analytical reconstruction from Meta 10-K/10-Q Note-8 commitment disclosures + vendor 8-Ks and press — estimates, shown for understanding and not sourced into the charts. Other qualitative content: Meta 10-Ks and Q4 2025 / Q1 2026 earnings calls, and a Summit "Ad Ecosystem" primer. Brand colors approximate Meta blue.';

// ─── Render helpers ──────────────────────────────────────────────────────────
function sec(t,inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(t)+'</div>'+inner+'</section>'; }
function bullets(a){ return '<ul class="ov-bullets">'+a.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function chain(arr, key){ return '<div class="ov-chain">'+arr.map(function(s,i){
  var cls='ov-chain-step'+(s.payoff?' is-payoff':'')+(key?' ov-clickable':'');
  var attr=key?' data-detail="'+key+':'+i+'"':''; var more=key?' <span class="ov-tl-more">tap ›</span>':'';
  return '<div class="'+cls+'"'+attr+'><div class="ov-chain-n">'+(i+1)+'</div><div class="ov-chain-t">'+esc(s.t)+more+'</div><div class="ov-chain-d">'+s.d+'</div></div>';
}).join('')+'</div>'; }
function mbars(arr){ return '<div class="ov-mbars">'+arr.map(function(r){
  return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
    '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+r[3]+';">'+esc(r[2])+'</div></div>'+
    '<div class="ov-mbar-v">'+r[1]+'%</div></div>';
}).join('')+'</div>'; }

// ─── Pane: Overview ───────────────────────────────────────────────────────────
function overviewBody(){
  var h='';
  h+='<div class="ov-snap">'+SNAPSHOT.map(function(p){ return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-live" id="meLive" hidden></div>';
  h+='<p class="ov-lede">'+DESC+'</p>';
  h+='<div class="ov-kpis">'+KPIS.map(function(k){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h+='<div class="ov-fynote">'+FY_NOTE+'</div>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Revenue <span>($B, FY · actuals)</span></div><div class="ov-chart-wrap"><canvas id="meRev"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Operating Income <span>($B, FY · actuals)</span></div><div class="ov-chart-wrap"><canvas id="meOp"></canvas></div></div>'+
  '</div>';
  h+=sec('How Meta Makes Money — the ad auction',
    '<p class="ov-lede" style="margin:0 0 14px">~98% of revenue is advertising sold by real-time auction — <b>tap any step</b>.</p>'+chain(AD_FLOW,'ad'));
  h+=sec('History & Milestones','<div class="ov-timeline">'+TIMELINE.map(function(t,i){
    var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':'';
    return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>';
  }).join('')+'</div>');
  h+=sec('Peers & Competitive Landscape',
    '<table class="ov-table"><thead><tr><th>Peer</th><th>What they are</th><th>How Meta differs</th></tr></thead><tbody>'+
    PEERS.map(function(p){return '<tr><td class="ov-td-name">'+esc(p[0])+'</td><td>'+p[1]+'</td><td>'+p[2]+'</td></tr>';}).join('')+'</tbody></table>');
  h+=sec('Tailwinds & Headwinds',
    '<div class="ov-grid2"><div class="ov-wind ov-wind-up"><div class="ov-wind-h">Tailwinds</div>'+bullets(TAILWINDS)+'</div>'+
    '<div class="ov-wind ov-wind-down"><div class="ov-wind-h">Headwinds</div>'+bullets(HEADWINDS)+'</div></div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Pane: Family of Apps (the engine) ────────────────────────────────────────
function foaBody(){
  var h='';
  h+='<p class="ov-lede"><b>This is where everything that matters happens.</b> The Family of Apps is ~99% of revenue and all of the profit — an advertising machine of ~3.5B daily people, run at ~50% operating margin. Revenue is <b>Advertising</b> (Core: Facebook · Instagram · Threads, plus <b>WhatsApp</b> click-to-message) + a small <b>Other</b> line.</p>';
  h+='<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+AD+'"></span>Advertising</span>'+
     '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+OTHER+'"></span>Other revenue</span></div>';
  h+='<div class="ov-chart-t">Family of Apps revenue <span>($B, FY · Advertising + Other)</span></div>';
  h+='<div class="ov-chart-wrap ovs-tall"><canvas id="meFoaRev"></canvas></div>';
  h+='<div class="ov-fynote">Advertising is ~<b>98% of total revenue</b>. Within it, the <b>Core</b> apps (FB/IG/Threads) are the bulk and <b>WhatsApp</b> click-to-message is among the fastest-growing pieces. <span class="ave-subh-note">(Meta no longer discloses Core-vs-WhatsApp or per-app ARPU separately; the solid KPIs today are <b>Family DAP</b> ~3.5B and <b>Family ARPP</b>, both rising — these are company disclosures, not in the Summit snapshot.)</span></div>';
  h+=sec('The ad engine — and why the "walled garden" wins',
    '<p class="ov-lede" style="margin:0 0 12px">'+WALLED+'</p>'+
    '<div class="ov-sec-h ovt-store-h">Where each $1.00 of advertiser spend goes <span class="ave-subh-note">(open web · illustrative)</span></div>'+
    mbars(ECO_OPEN)+
    '<div class="ov-diagram-cap" style="margin-top:8px"><b>Meta (walled garden):</b> being publisher + SSP + DSP + ad-exchange + data + verification all at once, Meta keeps <b>~the entire $1.00</b> — no leakage to intermediaries.</div>');
  h+=sec('Family of Apps — recent wins', '<div class="ov-callout">'+bullets(FOA_WINS)+'</div>');
  h+=sec('The cash machine', '<div class="ov-callout"><div class="ov-tl-body">FoA segment operating profit reached ~<b>$102B</b> in FY2025 at ~<b>50%+ margin</b>. That is the profit that funds <i>everything</i> — Reality Labs, the AI-capex buildout, buybacks and the dividend. See the Reality Labs tab for it against RL\'s loss.</div></div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Pane: Reality Labs (the bet) ─────────────────────────────────────────────
function rlBody(){
  var h='';
  h+='<p class="ov-lede">Reality Labs is the <b>bet</b>, not the business — a deliberate, large loss the Family of Apps is built to absorb. Keep the focus proportional: it is ~1% of revenue and ~−$19B of profit.</p>';
  h+='<div class="tech-leg"><span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+FOA+'"></span>Family of Apps</span>'+
     '<span class="tech-leg-i"><span class="tech-leg-bar" style="background:'+RL+'"></span>Reality Labs</span></div>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Revenue by segment <span>($B, FY)</span></div><div class="ov-chart-wrap"><canvas id="meSegRev"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Operating income by segment <span>($B, FY · RL is a loss)</span></div><div class="ov-chart-wrap"><canvas id="meSegOp"></canvas></div></div>'+
  '</div>';
  h+='<div class="ov-fynote">Family of Apps made ~<b>$102B</b> of operating profit in FY2025; Reality Labs <b>lost ~$19B</b> — cumulative ~<b>$'+(RL_CUM/1000).toFixed(0)+'B</b> since 2020.</div>';
  h+=sec('How to read Reality Labs', '<p class="ov-lede" style="margin:0 0 12px">'+RL_NOTE+'</p><div class="ov-callout">'+bullets(RL_POINTS)+'</div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Pane: Spend Engine (the devil's accounting) ──────────────────────────────
function spendBody(){
  var h='';
  h+='<p class="ov-lede">'+SPEND_LEDE+'</p>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Capex <span>($B, FY · the AI build)</span></div><div class="ov-chart-wrap"><canvas id="meCapex"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Depreciation & amortization <span>($B, FY · the wave)</span></div><div class="ov-chart-wrap"><canvas id="meDa"></canvas></div></div>'+
  '</div>';
  h+=sec('Three ways the buildout is funded',
    '<div class="ov-drivers">'+SPEND_WAYS.map(function(w){ return '<div class="ov-driver"><div class="ov-driver-t">'+esc(w.t)+'</div><div class="ov-driver-d">'+w.d+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-fynote">'+SPEND_NOTE+'</div>');
  h+=sec('Where tomorrow\'s efficiencies could come from', '<div class="ov-callout">'+bullets(EFFIC)+'</div>');
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Pane: Financials ─────────────────────────────────────────────────────────
function finBody(){
  var h='';
  h+='<p class="ov-lede">Reported financials from the Summit DCF (actuals, FY2019–FY2025). Profit and cash recovered hard off the 2022 trough; the open question is the <b>capex wave</b> and the depreciation it creates.</p>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Operating margin <span>(% of revenue)</span></div><div class="ov-chart-wrap"><canvas id="meMargin"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Free cash flow <span>($B, FY)</span></div><div class="ov-chart-wrap"><canvas id="meFcf"></canvas></div></div>'+
  '</div>';
  h+='<div class="ov-fynote">Operating margin re-expanded to ~41% (2025); FCF held at ~$46B <i>despite</i> capex jumping to $69.7B — the ad engine is that profitable. Whether capex out-runs cash flow is the number to watch.</div>';
  h+='<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

// ─── Shell ────────────────────────────────────────────────────────────────────
function html(c){
  var h='<div class="ov ov-meta" data-brand="META">';
  h+='<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="foa">Family of Apps</button>'+
    '<button type="button" class="ovt-tab" data-ovt="rl">Reality Labs</button>'+
    '<button type="button" class="ovt-tab" data-ovt="spend">Spend Engine</button>'+
    '<button type="button" class="ovt-tab" data-ovt="fin">Financials</button>'+
  '</div>';
  h+='<div class="ovt-pane" data-ovt="overview">'+overviewBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="foa" hidden>'+foaBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="rl" hidden>'+rlBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="spend" hidden>'+spendBody()+'</div>';
  h+='<div class="ovt-pane" data-ovt="fin" hidden>'+finBody()+'</div>';
  h+='<div class="ov-modal-back" id="meModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="meModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="meModalT"></div><div class="ov-modal-b" id="meModalB"></div></div></div>';
  h+='</div>';
  return h;
}

// ═══ Charts ═══════════════════════════════════════════════════════════════════
var _charts={};
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }
function bar(id, labels, data, color, fmt){
  var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  var colors=Array.isArray(color)?color:labels.map(function(){ return color; });
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:labels, datasets:[{ data:data, backgroundColor:colors, borderRadius:4, maxBarThickness:46 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:22, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return fmt(ctx.parsed.y); } } } },
      scales:{ y:{ display:false, grace:'16%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } },
    plugins:[ { id:'vl', afterDatasetsDraw:function(ch){ var ctx=ch.ctx; ch.getDatasetMeta(0).data.forEach(function(b,i){ var v=ch.data.datasets[0].data[i];
      ctx.save(); ctx.textAlign='center'; ctx.font='700 10.5px Inter, sans-serif'; ctx.fillStyle='#1E2733'; ctx.fillText(fmt(v), b.x, (v<0?b.y+14:b.y-7)); ctx.restore(); }); } } ] });
}
function stacked2(id, labels, s1, s2, fmt){
  var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:labels, datasets:[
      { label:s1.label, data:s1.data, backgroundColor:s1.color, stack:'s', maxBarThickness:48 },
      { label:s2.label, data:s2.data, backgroundColor:s2.color, stack:'s', maxBarThickness:48, borderRadius:3 } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:22, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+fmt(ctx.parsed.y); } } } },
      scales:{ x:{ stacked:true, grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } }, y:{ stacked:true, display:false, grace:'14%' } } },
    plugins:[ { id:'tot', afterDatasetsDraw:function(ch){ var ctx=ch.ctx, top=ch.getDatasetMeta(1).data;
      top.forEach(function(b,i){ var tot=s1.data[i]+s2.data[i]; ctx.save(); ctx.textAlign='center'; ctx.font='700 10.5px Inter, sans-serif'; ctx.fillStyle='#1E2733'; ctx.fillText(fmt(tot), b.x, b.y-6); ctx.restore(); }); } } ] });
}
function grouped(id, labels, s1, s2, fmt){
  var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:labels, datasets:[
      { label:s1.label, data:s1.data, backgroundColor:s1.color, borderRadius:3, maxBarThickness:24 },
      { label:s2.label, data:s2.data, backgroundColor:s2.color, borderRadius:3, maxBarThickness:24 } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, layout:{ padding:{ top:14, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+fmt(ctx.parsed.y); } } } },
      scales:{ y:{ display:false, grace:'16%' }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } } });
}
function line(id, labels, data, color, fmt){
  var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return; destroy(id);
  _charts[id]=new Chart(cv.getContext('2d'),{ type:'line',
    data:{ labels:labels, datasets:[{ data:data, borderColor:color, backgroundColor:'rgba(8,102,255,0.06)', borderWidth:2.5, tension:.3, pointRadius:3, pointBackgroundColor:'#fff', pointBorderColor:color, pointBorderWidth:2, fill:true }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return fmt(ctx.parsed.y); } } } },
      scales:{ y:{ grid:{ color:'#EEF2F7' }, ticks:{ color:'#8A93A0', font:{ size:10 }, callback:fmt } }, x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ size:11 } } } } } });
}
function pf(v){ return v.toFixed(0)+'%'; }
function buildOverview(){ bar('meRev', YEARS, REV, BRAND, money); bar('meOp', YEARS, OPINC, BRAND2, money); }
function buildFoa(){ stacked2('meFoaRev', SEG_YEARS, { label:'Advertising', data:ADV_S, color:AD }, { label:'Other', data:OTH_S, color:OTHER }, money); }
function buildRl(){
  grouped('meSegRev', SEG_YEARS, { label:'Family of Apps', data:FOA_REV, color:FOA }, { label:'Reality Labs', data:RL_REV, color:RL }, money);
  grouped('meSegOp', SEG_YEARS, { label:'Family of Apps', data:FOA_OP, color:FOA }, { label:'Reality Labs', data:RL_OP, color:RL }, money);
}
function buildSpend(){ bar('meCapex', YEARS, CAPEX, CAPEX.map(function(v,i){ return i===CAPEX.length-1?NEG:GRAY; }), money); bar('meDa', DA_YEARS, DA, RL, money); }
function buildFin(){ line('meMargin', YEARS, OPMARGIN, BRAND, pf); bar('meFcf', YEARS, FCF, BRAND2, money); }

// ─── Live price (shared get-quote edge fn; hides gracefully if not deployed) ──
function fetchQuote(t){ var env=(typeof window!=='undefined')&&window.ENV; if(!env||!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY) return Promise.reject();
  var base=String(env.SUPABASE_URL).replace(/\/+$/,'');
  return fetch(base+'/functions/v1/get-quote?ticker='+t,{ headers:{ apikey:env.SUPABASE_ANON_KEY, Authorization:'Bearer '+env.SUPABASE_ANON_KEY } })
    .then(function(r){ if(!r.ok) throw 0; return r.json(); }).then(function(j){ if(j&&typeof j.price==='number') return j; throw 0; }); }
function renderLive(root){ var el=root.querySelector('#meLive'); if(!el) return; el.hidden=false; el.innerHTML='<span class="ov-live-ts">fetching live price…</span>';
  fetchQuote('META').then(function(q){ var p=q.changePct, up=(p==null||p>=0); var t=q.time?new Date(q.time*1000):null, hh=t?(('0'+t.getHours()).slice(-2)+':'+('0'+t.getMinutes()).slice(-2)):'';
    el.innerHTML='<span class="ov-live-dot"></span><span class="ov-live-tk">META</span><span class="ov-live-px">$'+q.price.toFixed(2)+'</span>'+
      (p!=null?'<span class="ov-live-ch '+(up?'up':'down')+'">'+(up?'▲ +':'▼ −')+Math.abs(p).toFixed(2)+'%</span>':'')+
      '<span class="ov-live-ts">live · '+esc(q.exchange||'NASDAQ')+(hh?(' · '+hh):'')+'</span>';
  }).catch(function(){ el.hidden=true; el.innerHTML=''; }); }

// ─── Orchestration ────────────────────────────────────────────────────────────
function showOvt(root,key){
  root.querySelectorAll('.ovt-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovt')===key); });
  root.querySelectorAll('.ovt-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovt')!==key); });
  if(key==='overview') requestAnimationFrame(buildOverview);
  if(key==='foa')      requestAnimationFrame(buildFoa);
  if(key==='rl')       requestAnimationFrame(buildRl);
  if(key==='spend')    requestAnimationFrame(buildSpend);
  if(key==='fin')      requestAnimationFrame(buildFin);
}
function wireModal(root){
  var back=root.querySelector('#meModalBack'), mT=root.querySelector('#meModalT'), mB=root.querySelector('#meModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#meModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  function resolve(key){ var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='ad'){ var s=AD_FLOW[+id]; return s?{t:'Step '+(+id+1)+' — '+s.t,h:s.d}:null; }
    return null; }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); }; });
}
function init(c){
  var root=document.querySelector('.ov-meta'); if(!root) return;
  renderLive(root);
  root.querySelectorAll('.ovt-tab').forEach(function(btn){ btn.onclick=function(){ showOvt(root, btn.getAttribute('data-ovt')); }; });
  wireModal(root);
  var active=root.querySelector('.ovt-tab.active'); showOvt(root, active?active.getAttribute('data-ovt'):'overview');
}
export var metaOverview = { html: html, init: init };
