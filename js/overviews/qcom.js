// overviews/qcom.js — custom Overview for QUALCOMM Incorporated (NASDAQ: QCOM)
// Replicates the NVIDIA Overview tab (see feat/nvidia-overview): snapshot banner →
// valuation-multiples hero (live price) → expandable description → business snapshot
// (4 quadrants) → collapsible boxes (What they offer · How it makes money · Margins ·
// Competitors). Reuses the shared ovlr-* styling. Live price/market cap come from
// Massive via api.liveQuote; valuation seeds & margins beyond the reported lines are
// clearly labelled estimates.
//
// All figures USD. Fiscal year ends the last Sunday of September (FY2025 = Sep 28, 2025).
// Sources: FY2025 10-K, Q1–Q2 FY2026 results, June 2026 Investor Day.

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function fmtBig(v){ if(v==null) return '—'; if(v>=1e12) return '$'+(v/1e12).toFixed(2)+'T'; if(v>=1e9) return '$'+(v/1e9).toFixed(0)+'B'; return '$'+(v/1e6).toFixed(0)+'M'; }

// ─── 1 · Company snapshot ────────────────────────────────────────────────────
var SNAPSHOT = [
  ['Listing', 'NASDAQ: QCOM'],
  ['HQ', 'San Diego, CA'],
  ['Founded', '1985 · Delaware'],
  ['Fiscal year', 'Ends late Sept.'],
  ['Employees', '~52,000'],
  ['President & CEO', 'Cristiano Amon'],
];

var DESC = 'Qualcomm is a global leader in wireless and computing technologies. It makes money two ways: (1) designing and selling Snapdragon system-on-chip platforms — a single chip that combines the CPU, GPU, AI engine and cellular modem — for smartphones, cars and connected devices (the QCT segment), and (2) licensing its portfolio of patents essential to 3G/4G/5G cellular standards, collecting a royalty on virtually every mobile device sold worldwide (the QTL segment). It is the de-facto processor of the premium Android phone and is expanding beyond handsets into Automotive, IoT/PC and, most recently, the data center. Qualcomm is fabless: it designs the chips and outsources manufacturing to foundries such as TSMC, Samsung and GlobalFoundries.';

// ─── 2 · Valuation multiples (live price + trailing/forward toggle) ───────────
// One consistent basis. Trailing = FY2025 (non-GAAP EPS $12.03). Forward = FY2026E
// (seed estimate). P/E & EV/EBITDA use the live price & EV; growth & PEG from the seed.
var MULT = {
  trailing: { eps:12.03, epsGr:12, ebitda:14000, ebGr:11 },   // FY2025 non-GAAP (EBITDA $M, est.)
  forward:  { eps:13.20, epsGr:10, ebitda:15200, ebGr:9 },    // FY2026E (seed estimate)
};
var _multMode = 'trailing', _multPrice = null, _multEv = null;
function heroMultiples(){
  var tiles = [['P/E','qcMultPE'],['Earnings growth','qcMultEG'],['PEG','qcMultPEG'],
    ['EV / EBITDA','qcMultEV'],['EBITDA growth','qcMultEBG'],['PEG (EBITDA)','qcMultPEGE']];
  return '<div class="ovlr-mult">'+
    '<div class="ovlr-mult-top">'+
      '<div class="ovlr-mult-live"><span class="ov-live-dot"></span><span class="ov-live-tk">QCOM</span>'+
        '<span class="ov-live-kv">Mkt cap <b id="qcMultMc">—</b></span>'+
        '<span class="ov-live-kv">EV <b id="qcMultEv">—</b></span></div>'+
      '<div class="ovlr-seg" id="qcMultToggle">'+
        '<button type="button" class="ovlr-seg-b active" data-mult="trailing">Trailing</button>'+
        '<button type="button" class="ovlr-seg-b" data-mult="forward">Forward</button>'+
      '</div>'+
    '</div>'+
    '<div class="ovlr-mult-grid">'+tiles.map(function(t){
      return '<div class="ovlr-mult-tile"><div class="ovlr-mult-l">'+esc(t[0])+'</div>'+
        '<div class="ovlr-mult-v" id="'+t[1]+'"><span class="ovlr-mut">—</span></div></div>';
    }).join('')+'</div>'+
    '<div class="ovlr-mult-note" id="qcMultNote"></div>'+
  '</div>';
}
function multFill(pane){
  var m = MULT[_multMode], p = _multPrice, ev = _multEv;
  function set(id, txt){ var e = pane.querySelector('#'+id); if (e) e.textContent = txt; }
  set('qcMultEG', '+'+m.epsGr+'%');
  set('qcMultEBG', '+'+m.ebGr+'%');
  if (p != null){ var pe = p/m.eps; set('qcMultPE', pe.toFixed(1)+'×'); set('qcMultPEG', (pe/m.epsGr).toFixed(2)); }
  else { set('qcMultPE','—'); set('qcMultPEG','—'); }
  if (ev != null){ var eve = ev/(m.ebitda*1e6); set('qcMultEV', eve.toFixed(1)+'×'); set('qcMultPEGE', (eve/m.ebGr).toFixed(2)); }
  else { set('qcMultEV','—'); set('qcMultPEGE','—'); }
  var note = pane.querySelector('#qcMultNote');
  if (note) note.innerHTML = (_multMode==='trailing' ? '<b>Trailing</b> — FY2025 (non-GAAP EPS $12.03).' : '<b>Forward</b> — FY2026E (seed estimate).')+
    ' P/E &amp; EV/EBITDA use the live price &amp; EV; growth &amp; PEG are seed estimates. PEG = multiple ÷ growth-%.';
}

// ─── 3 · Description (expandable) ─────────────────────────────────────────────
function descBox(){
  return '<div class="ovlr-desc" data-desc>'+
    '<p class="ovlr-desc-txt" id="qcDescTxt">'+esc(DESC)+'</p>'+
    '<button type="button" class="ovlr-desc-more" id="qcDescMore">Read more ▾</button>'+
  '</div>';
}

// ─── 4 · Business snapshot (four quadrants) ───────────────────────────────────
var BIZ = [
  ['What it sells', 'Snapdragon <b>chips</b> for phones, cars and devices — plus <b>licenses</b> to its cellular patent portfolio.'],
  ['Who buys it',   'Phone makers (Samsung, Xiaomi, Apple), 70+ automakers, and PC &amp; data-center customers.'],
  ['How it earns',  '<b>~87% chips (QCT)</b> — Snapdragon SoCs sold per unit; the rest is <b>QTL licensing</b>, a ~72%-margin royalty on nearly every cellular device.'],
  ['The edge',      'The best integrated <b>5G modem + SoC</b>, plus <b>standard-essential patents</b> baked into every cellular device.'],
];
function heroBusiness(){
  return '<div class="ovlr-biz">'+BIZ.map(function(b){
    return '<div class="ovlr-biz-cell"><div class="ovlr-biz-k">'+esc(b[0])+'</div><div class="ovlr-biz-v">'+b[1]+'</div></div>';
  }).join('')+'</div>';
}

// ─── Collapsible box + expandable-card helpers ────────────────────────────────
function ovBox(id, title, sub, body, open){
  return '<section class="ovlr-box'+(open?' open':'')+'" data-box="'+id+'">'+
    '<button type="button" class="ovlr-box-h">'+
      '<span class="ovlr-box-t">'+esc(title)+'</span>'+
      (sub ? '<span class="ovlr-box-sub">'+esc(sub)+'</span>' : '')+
      '<span class="ovlr-box-ch">▾</span>'+
    '</button>'+
    '<div class="ovlr-box-b">'+body+'</div>'+
  '</section>';
}

// ─── 5 · Products (collapsible) — image cards + lightbox (tap to enlarge) ─────
// Images live in img/products/qcom-*.jpg (onerror hides a missing photo).
var PRODUCTS = [
  { img:'qcom-snapdragon.jpg', tag:'Flagship mobile SoC', name:'Snapdragon 8-series',
    d:'The premium smartphone chip: CPU, GPU, AI engine and 5G modem on one die.',
    detail:'Qualcomm’s flagship system-on-chip for premium Android phones. A single package fuses the custom Oryon/Kryo CPU, Adreno GPU, a Hexagon NPU for on-device AI, and an integrated 5G modem — the tightest modem-to-SoC integration in the industry. It is the chip inside most flagship Samsung, Xiaomi and Chinese-OEM phones, and the reason Qualcomm leads the premium Android tier.' },
  { img:'qcom-snapdragon-x.jpg', tag:'Windows-on-Snapdragon', name:'Snapdragon X Elite',
    d:'Arm-based laptop processor — all-day battery and on-device AI for Windows PCs.',
    detail:'The Arm-based PC processor behind “Windows-on-Snapdragon.” Built on Qualcomm’s custom Oryon CPU, the Snapdragon X family (X Elite / X Plus / X2) brings phone-class battery life and a powerful NPU for on-device AI to laptops — competing head-on with Intel and AMD x86 chips and anchoring Qualcomm’s push into the PC market.' },
  { img:'qcom-digital-chassis.jpg', tag:'Automotive', name:'Snapdragon Digital Chassis',
    d:'The in-car platform: digital cockpit + ADAS/autonomy + connectivity.',
    detail:'Qualcomm’s automotive platform. Snapdragon Cockpit powers the dashboard, displays and infotainment; Snapdragon Ride handles ADAS and autonomous driving (from L2 up to L4); and Snapdragon Auto Connectivity links the car to the network. One scalable Flex SoC spans the whole stack — already shipped in 90M+ vehicles across 70+ automakers, and Qualcomm’s fastest-growing business.' },
  { img:'qcom-dragonwing.jpg', tag:'IoT & robotics', name:'Dragonwing IQ (robotics)',
    d:'Edge-AI, industrial and robotics SoCs — “sense, think, act” compute.',
    detail:'The Dragonwing brand covers Qualcomm’s industrial and edge-AI silicon across 12 verticals. The flagship IQ robotics SoCs (up to 700 TOPS) give robots on-device “sense → think → act” compute — multi-NPU AI, dozens of concurrent sensors and a safety island — and are designed into humanoid and industrial robots from partners such as NEURA and Figure.' },
  { img:'qcom-ar-glasses.jpg', tag:'Wearables & XR', name:'Snapdragon AR (smart glasses)',
    d:'The low-power silicon inside Meta Ray-Ban and Samsung Galaxy XR.',
    detail:'Qualcomm’s AR/XR platforms (AR1, XR2) are the tiny, power-sipping chips that make smart glasses and mixed-reality headsets possible. The Snapdragon AR1+ module — about 52mm × 12mm — is the silicon inside Meta Ray-Ban smart glasses and Samsung’s Galaxy XR, a fast-emerging new device category Qualcomm effectively owns at the chip level.' },
  { img:'qcom-modem-rf.jpg', tag:'Connectivity', name:'Snapdragon X Modem-RF',
    d:'Standalone 5G modem-to-antenna system — the modem Apple buys.',
    detail:'A complete 5G modem-to-antenna system sold on its own, separate from the app-processor SoC. This is the product Apple buys (Apple uses Qualcomm’s standalone modem while designing its own main processor). Alongside it Qualcomm sells Wi-Fi, Bluetooth and RF front-end components — the connectivity layer that underpins the whole portfolio.' },
  { img:'qcom-dragonfly.jpg', tag:'New · Data center', name:'Dragonfly AI200 / AI250',
    d:'AI inference accelerators + Oryon server CPUs for the data center.',
    detail:'Qualcomm’s brand-new data-center line (ramps from FY2027). The Dragonfly AI200 / AI250 are rack-scale AI inference accelerators built for “tokens per watt” efficiency, paired with Oryon-based server CPUs and Alphawave connectivity. The pitch: run AI models (inference), not train them, far more power-efficiently than GPUs — with open software and no CUDA lock-in.' },
  { img:'qcom-qtl.jpg', tag:'Intellectual property', name:'Patent Licensing (QTL)',
    d:'200,000+ cellular standard-essential patents — the royalty engine.',
    detail:'Not a physical product, but Qualcomm’s most profitable one. QTL licenses a portfolio of 200,000+ patents essential to the 3G/4G/5G standards. Because those inventions are baked into the standard itself, virtually every cellular device on earth owes a per-unit royalty — even devices that don’t use Qualcomm chips. It runs at ~72% margin and is the company’s durable cash engine.' },
];
function productsBody(){
  return '<p class="ovlr-money-p">Qualcomm sells one technology roadmap — low-power compute, on-device AI and cellular connectivity — packaged for many markets. <span class="ovlr-prod-hint2">Tap a product to enlarge.</span></p>'+
    '<div class="ovlr-prod-row">'+PRODUCTS.map(function(p,i){
      return '<figure class="ovlr-prod-card ovlr-clickable" data-prod="'+i+'" tabindex="0" role="button" aria-label="'+esc(p.name)+' — enlarge">'+
        '<div class="ovlr-prod-imgwrap"><img class="ovlr-prod-img" src="img/products/'+esc(p.img)+'" alt="'+esc(p.name)+'" loading="lazy" onerror="this.style.display=\'none\'"><span class="ovlr-prod-zoom">⤢</span></div>'+
        '<figcaption class="ovlr-prod-body"><div class="ovlr-prod-tag">'+esc(p.tag)+'</div>'+
          '<div class="ovlr-prod-name">'+esc(p.name)+'</div><div class="ovlr-prod-d">'+esc(p.d)+'</div></figcaption>'+
      '</figure>';
    }).join('')+'</div>'+
    '<div class="ovlr-prod-note">Product imagery for illustration. Snapdragon, Dragonwing and Dragonfly are Qualcomm product brands; Licensing (QTL) is a non-hardware business.</div>'+
    '<div class="ovlr-modal" id="qcProdModal" hidden><div class="ovlr-modal-box" role="dialog" aria-modal="true">'+
      '<button type="button" class="ovlr-modal-x" id="qcProdX" aria-label="Close">×</button>'+
      '<img class="ovlr-modal-img" id="qcProdImg" src="" alt="">'+
      '<div class="ovlr-modal-body"><div class="ovlr-modal-tag" id="qcProdTag"></div>'+
        '<div class="ovlr-modal-name" id="qcProdName"></div><div class="ovlr-modal-d" id="qcProdDesc"></div></div>'+
    '</div></div>';
}

// ─── 6 · How it makes money (segment / region doughnut) ───────────────────────
var MONEY_SEG = { title:'FY2025 revenue by category <span>($B · reported)</span>',
  labels:['Handsets','IoT','Licensing (QTL)','Automotive'], data:[27.8,6.6,5.6,4.0],
  colors:['#3253DC','#00A9CE','#6C7A89','#F2A900'], unit:'B',
  note:'QCT (the chip business) reports three end-markets — Handsets, IoT and Automotive; QTL is the patent-licensing business. A small QSI / reconciling amount is excluded.' };
var MONEY_REG = { title:'FY2025 revenue by region <span>(% · by customer/licensee HQ)</span>',
  labels:['China (+HK)','United States','South Korea','Other'], data:[46,24,21,9],
  colors:['#C0772C','#1F8A70','#5B53A8','#9aa6b4'], unit:'%',
  note:'⚠️ By customer / licensee <b>headquarters</b> (not end-demand). China is 46% of revenue — the key concentration risk.' };
var MONEY_SEG_CARDS = [
  { name:'Handsets', dot:'#3253DC', rev:'$27.8B', yoy:'+12% YoY',
    desc:'Snapdragon chips for smartphones — the core business. Sold per unit to <b>Samsung, Xiaomi</b> and Chinese OEMs; <b>Apple</b> buys the modem only.',
    prod:'Snapdragon (Mobile) · Modem-RF' },
  { name:'IoT', dot:'#00A9CE', rev:'$6.6B', yoy:'+22% YoY',
    desc:'PCs (<b>Windows-on-Snapdragon</b>), XR / smart glasses, industrial and networking (Dragonwing) — one low-power portfolio across 12 verticals.',
    prod:'Snapdragon X (PC) · AR/XR · Dragonwing' },
  { name:'Licensing (QTL)', dot:'#6C7A89', rev:'$5.6B', yoy:'flat',
    desc:'Per-unit royalties on 3G/4G/5G <b>standard-essential patents</b> — collected on nearly every cellular device, at <b>~72% margin</b>. The profit engine.',
    prod:'Patent Licensing (QTL)' },
  { name:'Automotive', dot:'#F2A900', rev:'$4.0B', yoy:'+36% YoY',
    desc:'Snapdragon Digital Chassis — digital cockpit + ADAS/autonomy — the <b>fastest-growing</b> line, already a >$6B run-rate exiting FY26.',
    prod:'Snapdragon Digital Chassis' },
];
function moneySegCards(){
  return '<div class="ovlr-mseg">'+MONEY_SEG_CARDS.map(function(s){
    return '<div class="ovlr-mseg-card">'+
      '<div class="ovlr-mseg-h"><span class="ovlr-mseg-dot" style="background:'+s.dot+'"></span>'+
        '<span class="ovlr-mseg-nm">'+esc(s.name)+'</span>'+
        '<span class="ovlr-mseg-rev">'+esc(s.rev)+' <em>'+esc(s.yoy)+'</em></span></div>'+
      '<div class="ovlr-mseg-d">'+s.desc+'</div>'+
      '<div class="ovlr-mseg-prod">↳ '+s.prod+'</div>'+
    '</div>';
  }).join('')+'</div>';
}
var MONEY_REG_DETAIL = '<p class="ovlr-mseg-note">Geography is by <b>customer / licensee headquarters</b>, not end-demand. China (46%) is the single largest region and the key concentration risk — exacerbated by trade tensions and Chinese OEMs developing in-house chips. South Korea (21%) is mostly Samsung.</p>';
var _moneyMode = 'segment', _moneyChart = null;
function moneyBody(){
  return '<p class="ovlr-money-p">Two engines: a large <b>chip business (QCT, ~87%)</b> that reports three end-markets, and a small but hugely profitable <b>licensing business (QTL, ~72% margin)</b>. Toggle segment vs region; the cards below explain each slice.</p>'+
    '<div class="ovlr-seg" id="qcMoneyToggle">'+
      '<button type="button" class="ovlr-seg-b active" data-money="segment">By segment</button>'+
      '<button type="button" class="ovlr-seg-b" data-money="region">By region</button>'+
    '</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t" id="qcMoneyTitle">'+MONEY_SEG.title+'</div>'+
    '<div class="ov-chart-wrap"><canvas id="qcMoneyChart"></canvas></div></div>'+
    '<div class="ovlr-money-note" id="qcMoneyNote">'+MONEY_SEG.note+'</div>'+
    '<div id="qcMoneyDetail">'+moneySegCards()+'</div>';
}
function buildMoneyChart(){
  var cv = document.getElementById('qcMoneyChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_moneyChart){ _moneyChart.destroy(); _moneyChart = null; }
  var d = _moneyMode === 'region' ? MONEY_REG : MONEY_SEG;
  _moneyChart = new Chart(cv.getContext('2d'), {
    type:'doughnut',
    data:{ labels:d.labels, datasets:[{ data:d.data, backgroundColor:d.colors, borderWidth:2, borderColor:'#fff' }] },
    options:{ responsive:true, maintainAspectRatio:false, cutout:'58%',
      plugins:{ legend:{ position:'right', labels:{ boxWidth:12, font:{size:12}, color:'#5b6470', padding:10 } },
        tooltip:{ callbacks:{ label:function(ctx){ var t=ctx.dataset.data.reduce(function(a,b){return a+b;},0);
          var v=ctx.parsed; return ' '+ctx.label+': '+(d.unit==='B'?'$'+v.toFixed(1)+'B':v+'%')+' ('+(v/t*100).toFixed(0)+'%)'; } } } } }
  });
}

// ─── 6.5 · Margins (interactive trend) ────────────────────────────────────────
// Gross / Operating / Net = reported GAAP (from the 10-K / press releases).
// EBITDA / CFO / FCF = seed estimates. FY26E = seed projection for the current year.
var MARGIN_METRICS = [
  { key:'gross',  label:'Gross',     color:'#3253DC' },
  { key:'oper',   label:'Operating', color:'#00A9CE' },
  { key:'net',    label:'Net',       color:'#7A5AF8' },
  { key:'ebitda', label:'EBITDA',    color:'#12B5A5' },
  { key:'cfo',    label:'CFO',       color:'#F2A73B' },
  { key:'fcf',    label:'FCF',       color:'#EB5757' },
];
var MARGIN_PROJ = { fy:'FY26E', gross:55.0, oper:25.5, net:23.5, ebitda:31.0, cfo:30.0, fcf:27.0, proj:true };
var MARGIN_FALLBACK = [
  { fy:'FY21', gross:57.5, oper:28.6, net:26.9, ebitda:32.0, cfo:30.5, fcf:27.5 },
  { fy:'FY22', gross:57.5, oper:35.9, net:29.3, ebitda:39.5, cfo:20.6, fcf:18.0 },
  { fy:'FY23', gross:55.7, oper:21.7, net:20.2, ebitda:26.0, cfo:31.5, fcf:25.0 },
  { fy:'FY24', gross:56.2, oper:25.8, net:26.0, ebitda:30.0, cfo:31.3, fcf:28.0 },
  { fy:'FY25', gross:55.4, oper:27.9, net:12.5, ebitda:32.0, cfo:31.6, fcf:28.9 },
];
var MRG_NOTE = 'Gross, operating &amp; net margins: Qualcomm reported <b>GAAP</b>. EBITDA, CFO &amp; FCF margins: <b>seed estimates</b>. <b>FY25 net margin</b> is depressed by a one-time $5.7B tax charge (OBBB Act) — the underlying operating trend was a record. <b>FY26E</b> = seed projection for the current fiscal year.';
var _mrgSel = { gross:true, oper:true, net:true, ebitda:false, cfo:false, fcf:false };
var _mrgData = MARGIN_FALLBACK.concat([MARGIN_PROJ]);
var _mrgStart = 0, _mrgEnd = 0, _mrgChart = null;
function mrgDefaultWindow(){
  var n = _mrgData.length;
  var lastActual = (n && _mrgData[n-1].proj) ? n-2 : n-1;
  return [ Math.max(0, lastActual - 4), n-1 ];
}
function marginsBody(){
  var chips = MARGIN_METRICS.map(function(m){
    return '<button type="button" class="ovlr-mg-chip'+(_mrgSel[m.key]?' on':'')+'" data-mg="'+m.key+'" style="--mg:'+m.color+'">'+
      '<span class="ovlr-mg-dot"></span>'+esc(m.label)+'</button>';
  }).join('');
  return '<p class="ovlr-money-p">Profitability &amp; cash margins as a % of revenue. Tap any line to toggle it; drag the <b>range slider</b> to widen or shift the years. The last point (<b>FY26E</b>) is a seed projection.</p>'+
    '<div class="ovlr-mg-chips" id="qcMgChips">'+chips+'</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Margins (% of revenue) <span>· fiscal years · FY26E = projection</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="qcMgChart"></canvas></div></div>'+
    '<div class="ovlr-mg-slider" id="qcMgSlider"></div>'+
    '<div class="ovlr-money-note" id="qcMgNote">'+MRG_NOTE+'</div>';
}
function renderMrgSlider(){
  var el = document.getElementById('qcMgSlider'); if (!el) return;
  var n = _mrgData.length; if (n < 2){ el.innerHTML=''; return; }
  var pos = function(i){ return (i/(n-1))*100; };
  var lp = pos(_mrgStart), rp = pos(_mrgEnd);
  var ticks = _mrgData.map(function(r,i){
    var on = (i>=_mrgStart && i<=_mrgEnd);
    return '<span class="ovlr-mg-tick'+(on?' in':'')+(r.proj?' proj':'')+'">'+esc(r.fy)+'</span>';
  }).join('');
  el.innerHTML =
    '<div class="ovlr-mg-rail">'+
      '<div class="ovlr-mg-fill" style="left:'+lp+'%;right:'+(100-rp)+'%"></div>'+
      '<span class="ovlr-mg-handle" data-h="start" style="left:'+lp+'%" role="slider" tabindex="0" aria-label="range start"></span>'+
      '<span class="ovlr-mg-handle" data-h="end" style="left:'+rp+'%" role="slider" tabindex="0" aria-label="range end"></span>'+
    '</div>'+
    '<div class="ovlr-mg-ticks">'+ticks+'</div>';
}
function wireMrgSlider(pane){
  var slider = pane.querySelector('#qcMgSlider'); if (!slider || slider._w) return; slider._w = 1;
  var drag = null;
  function idxFromX(clientX){
    var rail = slider.querySelector('.ovlr-mg-rail'); if (!rail) return _mrgStart;
    var rect = rail.getBoundingClientRect();
    var f = (clientX - rect.left) / Math.max(1, rect.width);
    return Math.round(Math.max(0, Math.min(1, f)) * (_mrgData.length - 1));
  }
  slider.addEventListener('pointerdown', function(e){
    var h = e.target.closest('.ovlr-mg-handle');
    if (h){ drag = { which:h.getAttribute('data-h') }; }
    else if (e.target.closest('.ovlr-mg-fill')){ drag = { which:'pan', anchor:idxFromX(e.clientX), s0:_mrgStart, e0:_mrgEnd }; }
    else {
      var i = idxFromX(e.clientX);
      if (Math.abs(i-_mrgStart) <= Math.abs(i-_mrgEnd)) _mrgStart = Math.min(i, _mrgEnd-1);
      else _mrgEnd = Math.max(i, _mrgStart+1);
      renderMrgSlider(); buildMarginChart(); return;
    }
    try { slider.setPointerCapture(e.pointerId); } catch(_){}
    e.preventDefault();
  });
  slider.addEventListener('pointermove', function(e){
    if (!drag) return;
    var i = idxFromX(e.clientX), n = _mrgData.length;
    if (drag.which === 'start') _mrgStart = Math.max(0, Math.min(i, _mrgEnd-1));
    else if (drag.which === 'end') _mrgEnd = Math.min(n-1, Math.max(i, _mrgStart+1));
    else if (drag.which === 'pan'){ var w = drag.e0-drag.s0, ns = Math.max(0, Math.min(drag.s0 + (i-drag.anchor), n-1-w)); _mrgStart = ns; _mrgEnd = ns+w; }
    renderMrgSlider(); buildMarginChart();
  });
  function endDrag(e){ if (drag){ try { slider.releasePointerCapture(e.pointerId); } catch(_){} drag = null; } }
  slider.addEventListener('pointerup', endDrag);
  slider.addEventListener('pointercancel', endDrag);
}
function buildMarginChart(){
  var cv = document.getElementById('qcMgChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_mrgChart){ _mrgChart.destroy(); _mrgChart = null; }
  var rows = _mrgData.slice(_mrgStart, _mrgEnd + 1);
  var projIdx = rows.reduce(function(acc,r,i){ return r.proj ? i : acc; }, -1);
  var labels = rows.map(function(r){ return r.fy; });
  var datasets = MARGIN_METRICS.filter(function(m){ return _mrgSel[m.key]; }).map(function(m){
    return {
      label:m.label,
      data:rows.map(function(r){ return r[m.key]; }),
      borderColor:m.color, backgroundColor:m.color,
      borderWidth:2.5, tension:0.3, pointHoverRadius:5, spanGaps:true,
      pointStyle:rows.map(function(r){ return r.proj ? 'rectRot' : 'circle'; }),
      pointRadius:rows.map(function(r){ return r.proj ? 5 : 3; }),
      segment:{ borderDash:function(ctx){ return ctx.p1DataIndex === projIdx ? [5,4] : undefined; } }
    };
  });
  _mrgChart = new Chart(cv.getContext('2d'), {
    type:'line',
    data:{ labels:labels, datasets:datasets },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{
          title:function(items){ var l=items[0].label; return l==='FY26E' ? 'FY26E · projection' : l; },
          label:function(ctx){ return ' '+ctx.dataset.label+': '+ctx.parsed.y.toFixed(1)+'%'; } } } },
      scales:{ x:{ grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', font:{weight:'600'} } },
        y:{ grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', callback:function(v){ return v+'%'; } } } } }
  });
}

// ─── 7 · Competitors (bubble: multiple × growth, size = market cap) ────────────
var COMP = [
  { ticker:'QCOM', name:'Qualcomm',          pe:16, peF:14, ev:12, evF:11, eg:12, egF:10, ebg:11, ebgF:9,  mcap:190, self:true },
  { ticker:'NVDA', name:'NVIDIA',            pe:38, peF:19, ev:30, evF:16, eg:59, egF:96, ebg:60, ebgF:92, mcap:4100 },
  { ticker:'AVGO', name:'Broadcom',          pe:38, peF:30, ev:28, evF:24, eg:25, egF:22, ebg:30, ebgF:26, mcap:1150 },
  { ticker:'AMD',  name:'AMD',               pe:45, peF:28, ev:33, evF:22, eg:35, egF:60, ebg:38, ebgF:55, mcap:260 },
  { ticker:'TXN',  name:'Texas Instruments', pe:35, peF:30, ev:22, evF:20, eg:5,  egF:12, ebg:6,  ebgF:11, mcap:170 },
  { ticker:'ARM',  name:'Arm',               pe:80, peF:55, ev:60, evF:45, eg:25, egF:30, ebg:28, ebgF:32, mcap:150 },
];
var _compMult = 'pe', _compTime = 'trailing', _compChart = null;
function competitorsBody(){
  return '<p class="ovlr-money-p">Qualcomm’s public peers. <b>X</b> = valuation multiple, <b>Y</b> = growth, <b>bubble size</b> = market cap. Add or remove any public company.</p>'+
    '<div class="ovlr-comp-ctl">'+
      '<div class="ovlr-seg" id="qcCompMult">'+
        '<button type="button" class="ovlr-seg-b active" data-cmult="pe">P/E · earnings</button>'+
        '<button type="button" class="ovlr-seg-b" data-cmult="ev">EV/EBITDA</button>'+
      '</div>'+
      '<div class="ovlr-seg" id="qcCompTime">'+
        '<button type="button" class="ovlr-seg-b active" data-ctime="trailing">Trailing</button>'+
        '<button type="button" class="ovlr-seg-b" data-ctime="forward">Forward</button>'+
      '</div>'+
    '</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Peers — multiple × growth × size <span>(bubble = market cap)</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="qcCompChart"></canvas></div></div>'+
    '<div class="ovlr-comp-add"><input type="text" id="qcCompInput" placeholder="Add ticker (e.g. MRVL)" maxlength="6" autocomplete="off">'+
      '<button type="button" id="qcCompAdd">+ Add</button></div>'+
    '<div class="ovlr-comp-chips" id="qcCompChips"></div>'+
    '<div class="ovlr-money-note">Market cap is <b>live</b> (Massive) per ticker. Multiples &amp; growth are <b>seed</b> values (editable) until a live ratios mapping is confirmed.</div>';
}
var compLabels = {
  id:'compLabels',
  afterDatasetsDraw:function(chart){
    var ctx = chart.ctx, ds = chart.data.datasets[0], meta = chart.getDatasetMeta(0);
    ctx.save(); ctx.font = '700 11px Inter, sans-serif'; ctx.textAlign = 'center';
    meta.data.forEach(function(el, i){
      var p = ds.data[i]; if (!p) return;
      ctx.fillStyle = p.self ? '#2a44c0' : '#1E2733';
      ctx.fillText(p.t, el.x, el.y - (p.r || 6) - 5);
    });
    ctx.restore();
  }
};
function buildCompChart(){
  var cv = document.getElementById('qcCompChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_compChart){ _compChart.destroy(); _compChart = null; }
  var fwd = _compTime === 'forward', isPe = _compMult === 'pe';
  var pts = COMP.map(function(c){
    var mult = isPe ? (fwd?c.peF:c.pe) : (fwd?c.evF:c.ev);
    var gr   = isPe ? (fwd?c.egF:c.eg) : (fwd?c.ebgF:c.ebg);
    if (mult == null || gr == null) return null;
    return { x:mult, y:gr, r:Math.max(6, Math.sqrt(c.mcap||1)/2.4), t:c.ticker, mcap:c.mcap, self:c.self };
  }).filter(Boolean);
  _compChart = new Chart(cv.getContext('2d'), {
    type:'bubble',
    data:{ datasets:[{ data:pts,
      backgroundColor:pts.map(function(p){ return p.self ? 'rgba(50,83,220,0.55)' : 'rgba(45,106,159,0.42)'; }),
      borderColor:pts.map(function(p){ return p.self ? '#3253DC' : '#2D6A9F'; }), borderWidth:2 }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:16, right:12, left:4 } },
      plugins:{ legend:{ display:false },
        tooltip:{ callbacks:{ label:function(ctx){ var p=ctx.raw;
          return p.t+': '+(isPe?'P/E ':'EV/EBITDA ')+p.x+'× · growth '+p.y+'% · mcap $'+(p.mcap>=1000?(p.mcap/1000).toFixed(1)+'T':p.mcap+'B'); } } } },
      scales:{ x:{ reverse:true, title:{ display:true, text:(isPe?'P/E':'EV/EBITDA')+' (×)'+(fwd?' · forward':' · trailing')+' · cheaper →', color:'#5b6470', font:{size:11,weight:'600'} },
          grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', callback:function(v){ return v+'×'; } } },
        y:{ title:{ display:true, text:(isPe?'Earnings':'EBITDA')+' growth (%)'+(fwd?' · forward':' · trailing'), color:'#5b6470', font:{size:11,weight:'600'} },
          grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', callback:function(v){ return v+'%'; } } } } },
    plugins:[compLabels]
  });
}
function renderCompChips(){
  var box = document.getElementById('qcCompChips'); if (!box) return;
  box.innerHTML = COMP.map(function(c,i){
    return '<span class="ovlr-comp-chip'+(c.self?' self':'')+'">'+esc(c.ticker)+
      (c.mcap!=null?' · $'+(c.mcap>=1000?(c.mcap/1000).toFixed(1)+'T':c.mcap+'B'):'')+
      (c.self?'':'<button type="button" class="ovlr-comp-x" data-rm="'+i+'" aria-label="remove">×</button>')+'</span>';
  }).join('');
}

var SOURCES = 'Sources: QUALCOMM Incorporated (NASDAQ: QCOM) FY2025 Form 10-K (year ended Sept 28, 2025), Q1–Q2 FY2026 results, and the June 24, 2026 Investor Day. Live price / market cap: Massive. Forward multiples, EBITDA/CFO/FCF margins and peer seed values are estimates, not company guidance or consensus. Peer descriptions summarize public information.';

// ═══════════════════════════════════════════════════════════════════════════
// DEEP DIVE — QCT (4 end-market sub-tabs) and QTL. Each segment covers competitive
// advantages, who they compete with, main customers, and how the contracts are
// structured.
// ═══════════════════════════════════════════════════════════════════════════
var QCT_CATS = [
  { key:'handsets', label:'Handsets', rev:'$27.8B', tag:'+12% YoY · the core',
    intro:'Snapdragon SoCs and 5G modems for smartphones — Qualcomm’s largest and most cyclical business.',
    adv:[
      'The only vendor that integrates the <b>best 5G modem</b> + CPU (Oryon) + GPU (Adreno) + AI engine (NPU) on a single chip — premium performance that is hard to match.',
      'Leadership of the <b>premium Android tier</b> and an annual roadmap cadence that sustains its performance-per-watt lead.',
      '<b>On-device AI</b> (agentic) is driving a new upgrade cycle and more silicon content per phone.',
    ],
    comp:[
      '<b>MediaTek</b> — the direct rival; strong in mid-range and pushing into the premium tier.',
      'Customers’ own silicon: <b>Apple</b> (A-series + its own modem), <b>Samsung</b> (Exynos), <b>Google</b> (Tensor) and formerly Huawei (HiSilicon).',
      '<b>UNISOC</b> at the low end.',
    ],
    cust:[
      '<b>Samsung</b> and <b>Xiaomi</b> — each >10% of consolidated revenue.',
      'Chinese OEMs: <b>Oppo, Vivo, Honor</b>.',
      '<b>Apple</b> — but it buys only the <b>modem</b>, not the integrated SoC.',
    ],
    contracts:[
      '<b>Per-unit</b> chip sales won by design win each flagship generation — no long-term volume guarantees; re-competed every cycle.',
      '<b>Samsung</b>: <b>share agreements per flagship line</b> (Galaxy S26 ~75% baseline after 100% on the S25); dual-flagship strategy.',
      '<b>Apple</b>: modem only, <b>20% of the fall-2026 iPhones</b> and no relationship beyond that — ~$2B in FY27, then ~zero.',
      'Pricing is driven by <b>mix</b>: a richer premium mix lifts ASP.',
    ] },
  { key:'iot', label:'IoT', rev:'$6.6B', tag:'+22% YoY',
    intro:'One low-power portfolio for everything that is not a phone or a car: PCs, XR, industrial, networking and robotics (the Dragonwing brand).',
    adv:[
      '<b>Low-power compute + edge AI</b> applied across 12 verticals from a single portfolio.',
      'In PCs, the <b>Oryon</b> CPU (Windows-on-Snapdragon) brings Arm-class battery life vs x86.',
      'A developer ecosystem (<b>Arduino</b> 33M+ users, Edge Impulse) plus integrated connectivity.',
    ],
    comp:[
      'PC: <b>Intel</b> and <b>AMD</b> (x86), Apple Silicon.',
      'XR / glasses: <b>MediaTek</b> and in-house silicon from Meta/Apple.',
      'Industrial / edge / robotics: <b>NXP, Texas Instruments, Renesas, NVIDIA Jetson, Ambarella</b>.',
    ],
    cust:[
      '<b>Microsoft</b> (Windows-on-Snapdragon partner) and PC OEMs: Dell, HP, Lenovo, Asus, Samsung.',
      '<b>Meta</b> (Ray-Ban glasses), <b>Samsung</b> (Galaxy XR), <b>Google</b> (Android XR).',
      '<b>38,000+ industrial companies</b>, mostly through the channel.',
    ],
    contracts:[
      'Design wins + per-unit sales; in PCs, <b>co-marketing with Microsoft</b> per model.',
      'XR via <b>reference designs</b>.',
      'Industrial: a <b>mostly indirect</b> model (35+ distributors, 45+ integrators) — long-tail and less concentrated.',
    ] },
  { key:'auto', label:'Automotive', rev:'$4.0B', tag:'+36% YoY · fastest grower',
    intro:'Snapdragon Digital Chassis: digital cockpit (Cockpit) + assisted/autonomous driving (Ride) + connectivity. Already a >$6B run-rate exiting FY26.',
    adv:[
      'A <b>unified cockpit+ADAS</b> scalable platform (Flex SoC), from <b>L2 to L4</b>, with a safety island.',
      'Content per car growing ~<b>8x</b> from Gen3 to Gen5; <b>90M+ cockpits</b> already shipped.',
      'A design-win pipeline of ~<b>$65B</b> — multi-year revenue visibility.',
    ],
    comp:[
      'Cockpit: <b>NXP, Renesas, Samsung</b>; MediaTek entering.',
      'ADAS / autonomy: <b>Mobileye</b> (Intel), <b>NVIDIA</b> (DRIVE), Texas Instruments, Ambarella, and in-house silicon (Tesla).',
    ],
    cust:[
      '<b>70+ automakers</b>: BMW, GM, Stellantis, VW Group (Audi/Porsche), Mercedes, Toyota, Geely, Li Auto, NIO, Hyundai.',
      'Tier-1s: <b>Bosch, Aptiv, Valeo, ZF, Magna, Visteon, Hyundai Mobis</b>.',
    ],
    contracts:[
      'Long cycles: <b>2–4 years</b> from design win to production, then <b>5–7 year</b> runs (the model’s life) — very sticky.',
      'The <b>$65B</b> pipeline is lifetime-revenue backlog from programs already won.',
      'Contracted directly with the OEM or via a Tier-1; content per car (SAM) of <b>$200 to $3,000</b>.',
    ] },
  { key:'dc', label:'Data Center', rev:'~$0 → $15B+ (FY29 target)', tag:'new · FY27+',
    intro:'The new business (Dragonfly brand): AI inference accelerators + Oryon server CPU + connectivity (Alphawave). Near-zero today; a $15B+ target for FY2029.',
    adv:[
      '<b>Energy-efficient inference</b> (tokens per watt) and a disaggregated architecture — running models, not training them.',
      'Proprietary <b>HBC</b> memory (avoids the "HBM tax"), the Oryon CPU for agentic workloads, and Alphawave connectivity IP.',
      '<b>Open software (Modular)</b> — no CUDA lock-in; a device-to-cloud stack.',
    ],
    comp:[
      '<b>NVIDIA</b> (dominant, GPU+CUDA), <b>AMD</b> (MI), custom ASICs (Google TPU/Broadcom, Amazon Trainium/Marvell), Intel (Gaudi).',
      '<b>Groq</b> and <b>Cerebras</b> (inference specialists) — cited by Qualcomm as validating the thesis.',
    ],
    cust:[
      '<b>HUMAIN</b> — the first customer (200 MW from 2026).',
      'Two <b>custom-silicon design wins</b> with hyperscalers; one ships in the December quarter of CY2026.',
    ],
    contracts:[
      'Custom silicon: <b>multi-generation</b> commitments with hyperscalers (entry points from spec to GDS), <b>margin-accretive</b>.',
      'An "<b>all of the above</b>" go-to-market: merchant + custom.',
      '<b>Early stage</b> — mostly framework/commitments, not yet volume.',
    ] },
];

var QTL_SEG = {
  rev:'$5.6B', tag:'~72% EBT margin · the profit engine',
  intro:'The licensing business: it charges royalties for the use of its cellular-essential patents. Small in revenue but the company’s profit machine. QTL has no further sub-segments.',
  adv:[
    '<b>200,000+ patents</b> essential to the 3G/4G/5G standards (with 6G coming): it collects on <b>nearly every cellular device in the world</b>, whether or not it uses Qualcomm chips.',
    'Decades of <b>legal precedent</b> defending the model; "no license, no chips" leverage.',
    'Almost <b>pure margin</b> — a durable royalty stream independent of the chip cycle.',
  ],
  comp:[
    'Not classic competitors: the challenge comes from the <b>licensees (OEMs)</b> themselves, governments and <b>antitrust regulators</b> (US FTC, EU, Korea KFTC).',
    'Other essential-patent holders: <b>Nokia, Ericsson, InterDigital</b> — but Qualcomm holds the largest cellular portfolio.',
  ],
  cust:[
    'Hundreds of device makers: <b>Apple, Samsung, Xiaomi, Oppo, Vivo, Transsion</b> — virtually every phone brand.',
  ],
  contracts:[
    'A <b>per-unit</b> royalty as a % of the device price <b>with a cap</b>, paid quarterly; mostly on 3G/4G/5G.',
    '<b>Long-term</b> license agreements (multi-year). FY2025: new licenses with two Chinese OEMs and a comprehensive 4G/5G deal with Transsion.',
    '<b>Huawei</b>: royalties ceased in Q2 FY2025 (agreement expired, under renegotiation).',
    '<b>Apple</b>: license renewal underway, <b>separate</b> from the chip business.',
  ],
};

// Blank canvas for each segment — structure/content to be defined from scratch.
function segBody(seg){
  var h = '<div class="qa-cat-head"><span class="qa-cat-rev">'+esc(seg.rev)+'</span><span class="qa-cat-tag">'+esc(seg.tag)+'</span></div>';
  h += '<p class="ovlr-intro">'+esc(seg.intro)+'</p>';
  h += '<div class="qa-block"><div class="qa-h">'+esc(seg.label||'Segment')+'</div>'+
    '<p class="ov-p" style="margin:0;color:var(--mu)">Blank — content to be defined.</p></div>';
  return h;
}
// ── Handsets — clickable Snapdragon-series explorer (tile → spec sheet) ───────
// Line-icons (stroke = currentColor) matching the style of Qualcomm's spec sheets.
var SD_ICONS = {
  cpu:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M6 9H3M6 15H3M21 9h-3M21 15h-3"/></svg>',
  gpu:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 9h4M7 12h6" stroke-width="1.3"/></svg>',
  fab:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M3 21V10l6 4V10l6 4V7l6 3v11z"/><path d="M3 21h18"/></svg>',
  cam:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.4"/><path d="M8.5 7l1.2-2.5h4.6L15.5 7"/></svg>',
  signal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 20v-3M10 20v-7M15 20v-11M20 20V5"/></svg>',
  wifi:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 12a12 12 0 0115 0M7.5 15a7.5 7.5 0 019 0"/><circle cx="12" cy="18.5" r="1.1" fill="currentColor" stroke="none"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></svg>',
};
// The Snapdragon badge — a red rounded-square mark (approximation of the logo).
function sdLogo(cls){
  return '<svg class="'+cls+'" viewBox="0 0 100 100" aria-hidden="true">'+
    '<rect x="8" y="8" width="84" height="84" rx="24" fill="none" stroke="#E4002B" stroke-width="7"/>'+
    '<path d="M63 34c-10-6-24-4-28 6-3 8 3 13 11 15 6 2 9 4 8 8-1 5-8 6-14 3-3-1-5-3-6-6" fill="none" stroke="#E4002B" stroke-width="7" stroke-linecap="round"/>'+
  '</svg>';
}
// Snapdragon mobile lineup (by tier). Snapdragon 6 Gen 4 matches Qualcomm's published
// spec sheet exactly; the other tiers are representative and should be verified.
var SNAPDRAGON = [
  { id:'8elite5', series:'8 Elite', gen:'Gen 5', tier:'Flagship · 2025', specs:[
    { ic:'cpu',    t:'Oryon CPU', d:'2× prime up to 4.6 GHz + 6× performance (3rd-gen custom Oryon)' },
    { ic:'gpu',    t:'Adreno GPU', d:'New generation · hardware ray tracing' },
    { ic:'fab',    t:'3nm process', d:'TSMC N3P' },
    { ic:'cam',    t:'Up to 320MP cameras', d:'Snapdragon Spectra ISP' },
    { ic:'signal', t:'5G connectivity', d:'Snapdragon X85 5G Modem-RF' },
    { ic:'wifi',   t:'Wi-Fi 7 / Bluetooth 6.0', d:'FastConnect' },
    { ic:'video',  t:'8K HDR video capture', d:'Multimedia' },
  ]},
  { id:'8sgen4', series:'8s', gen:'Gen 4', tier:'Premium · 2025', specs:[
    { ic:'cpu',    t:'Kryo CPU', d:'1× 3.2 GHz prime + 7× performance / efficiency cores' },
    { ic:'gpu',    t:'Adreno GPU', d:'Graphics processing unit' },
    { ic:'fab',    t:'4nm process', d:'Manufacturing technology' },
    { ic:'cam',    t:'Up to 200MP cameras', d:'Spectra ISP' },
    { ic:'signal', t:'5G connectivity', d:'Snapdragon 5G modem' },
    { ic:'wifi',   t:'Wi-Fi 7 / Bluetooth 5.4', d:'Wireless connectivity' },
    { ic:'video',  t:'4K HDR video capture', d:'Multimedia' },
  ]},
  { id:'7gen4', series:'7', gen:'Gen 4', tier:'Upper mid-range', specs:[
    { ic:'cpu',    t:'Kryo CPU', d:'1× 2.8 GHz Cortex-A720 + 3× A720 + 4× A520' },
    { ic:'gpu',    t:'Adreno GPU', d:'Graphics processing unit' },
    { ic:'fab',    t:'4nm process', d:'Manufacturing technology' },
    { ic:'cam',    t:'Up to 200MP cameras', d:'Spectra ISP' },
    { ic:'signal', t:'5G connectivity', d:'Snapdragon 5G modem' },
    { ic:'wifi',   t:'Wi-Fi 6E / Bluetooth 5.4', d:'Wireless connectivity' },
    { ic:'video',  t:'4K HDR video capture', d:'Multimedia' },
  ]},
  { id:'6gen4', series:'6', gen:'Gen 4', tier:'Mid-range · 2024', specs:[
    { ic:'cpu',    t:'Kryo CPU', d:'1× 2.3 GHz Cortex-A720 + 3× 2.2 GHz Cortex-A720 + 4× 1.8 GHz Cortex-A520' },
    { ic:'gpu',    t:'Adreno 810 GPU', d:'Graphics processing unit' },
    { ic:'fab',    t:'4nm process', d:'Manufacturing technology' },
    { ic:'cam',    t:'Up to 200MP cameras', d:'ISP' },
    { ic:'signal', t:'5G connectivity', d:'Mobile connectivity' },
    { ic:'wifi',   t:'Wi-Fi 6E / Bluetooth 5.4', d:'Wireless connectivity' },
    { ic:'video',  t:'4K HDR video capture', d:'Multimedia features' },
  ]},
  { id:'4gen3', series:'4', gen:'Gen 3', tier:'Entry', specs:[
    { ic:'cpu',    t:'Kryo CPU', d:'2× 2.3 GHz + 6× 2.0 GHz (Cortex-A78 / A55 class)' },
    { ic:'gpu',    t:'Adreno GPU', d:'Graphics processing unit' },
    { ic:'fab',    t:'4nm process', d:'Manufacturing technology' },
    { ic:'cam',    t:'Up to 108MP cameras', d:'Spectra ISP' },
    { ic:'signal', t:'5G connectivity', d:'Snapdragon 5G modem' },
    { ic:'wifi',   t:'Wi-Fi 5 / Bluetooth 5.1', d:'Wireless connectivity' },
    { ic:'video',  t:'1080p / 4K video capture', d:'Multimedia' },
  ]},
];
function sdTile(s, i){
  return '<button type="button" class="sd-tile'+(i===0?' active':'')+'" data-sd="'+s.id+'" aria-label="Snapdragon '+esc(s.series+' '+s.gen)+'">'+
    '<div class="sd-tile-brand">Snapdragon</div>'+
    '<div class="sd-tile-model">'+esc(s.series)+' <em>'+esc(s.gen)+'</em></div>'+
    '<div class="sd-tile-tier">'+esc(s.tier)+'</div>'+
    sdLogo('sd-tile-logo')+
  '</button>';
}
function specSheet(s){
  var rows = s.specs.map(function(sp){
    return '<div class="sd-spec"><span class="sd-spec-ic">'+(SD_ICONS[sp.ic]||'')+'</span>'+
      '<div><div class="sd-spec-t">'+esc(sp.t)+'</div><div class="sd-spec-d">'+esc(sp.d)+'</div></div></div>';
  }).join('');
  return '<div class="sd-sheet">'+
    '<div class="sd-sheet-head">'+sdLogo('sd-sheet-logo')+
      '<div class="sd-sheet-brand">SNAPDRAGON</div>'+
      '<div class="sd-sheet-model">'+esc(s.series+' '+s.gen)+'</div>'+
      '<div class="sd-sheet-tier">'+esc(s.tier)+'</div>'+
    '</div>'+rows+
  '</div>';
}
// The Snapdragon-series explorer (tiles → spec sheet).
function snapdragonExplorer(){
  var h = '<p class="ovlr-money-p">Snapdragon chips for smartphones, sold across tiers from flagship to entry. Tap a Snapdragon series to see its characteristics.</p>';
  h += '<div class="sd-wrap">'+
    '<div class="sd-grid">'+SNAPDRAGON.map(sdTile).join('')+'</div>'+
    '<div class="sd-sheet-wrap" id="qcSdSheet">'+specSheet(SNAPDRAGON[0])+'</div>'+
  '</div>';
  h += '<div class="ovlr-money-note">Snapdragon mobile platforms by tier. The <b>Snapdragon 6 Gen 4</b> figures match Qualcomm’s spec sheet; other tiers are representative and should be verified before publishing.</div>';
  return h;
}
// ── Handsets · Clients — logo grid → per-client relationship detail ───────────
// Logos load from Clearbit by domain (CSP-allowed); onerror falls back to a monogram.
var CLIENTS = [
  { id:'samsung', name:'Samsung', domain:'samsung.com', mono:'SS', col:'#1428A0', tag:'>10% of QCOM revenue',
    relationship:'A top-tier, <b>>10%-of-revenue</b> customer — and a complex one: Samsung is at once a major Snapdragon buyer, a <b>foundry</b> that fabricates some Qualcomm chips, and a <b>rival</b> through its in-house Exynos SoC.',
    buys:'Snapdragon <b>8-series</b> in flagship Galaxy S / Z fold-flip phones, plus Snapdragon across parts of the A-series. Samsung splits flagship volume between Snapdragon and Exynos by region and model.',
    contract:'Per-generation <b>design wins</b> with a negotiated Snapdragon <b>share of each flagship line</b> — Qualcomm secured ~100% of the Galaxy S25 and guided to a ~75% baseline on the S26 (Exynos takes the rest). No long-term volume guarantee; the split is re-negotiated each cycle. A separate multi-year <b>QTL patent license</b> covers all Samsung devices.',
    notes:'Dual-edged: because Samsung is also a foundry and an Exynos competitor, the Snapdragon share can swing each generation — a key variable for QCT handset revenue.' },
  { id:'xiaomi', name:'Xiaomi', domain:'mi.com', mono:'MI', col:'#FF6900', tag:'>10% of QCOM revenue',
    relationship:'A top-tier, <b>>10%-of-revenue</b> customer and one of Qualcomm’s closest Android partners — Xiaomi flagships routinely <b>launch first</b> on each new Snapdragon.',
    buys:'Snapdragon <b>8-series</b> in flagship Xiaomi / Redmi / POCO phones and Snapdragon across the mid-range (7- and 6-series).',
    contract:'Per-unit chip sales won by <b>design win</b> each generation, often as a lead-launch partner for new flagship Snapdragon. A separate <b>QTL license</b> covers its devices worldwide.',
    notes:'Xiaomi is developing its own “XRING” SoC — a long-term in-sourcing risk — but is still overwhelmingly Snapdragon-powered today.' },
  { id:'apple', name:'Apple', domain:'apple.com', mono:'AP', col:'#333333', tag:'Modem only · ramping to ~zero',
    relationship:'A large but <b>shrinking</b> customer and the single biggest handset risk. Apple buys only Qualcomm’s standalone <b>5G modem</b>, not the Snapdragon SoC (Apple designs its own A-series processor).',
    buys:'Snapdragon <b>5G Modem-RF</b> systems for iPhone. No app-processor / SoC business.',
    contract:'A modem-supply agreement covering a <b>declining share</b>: ~20% of the fall-2026 iPhones, with <b>no product relationship beyond that</b> — the Street models ~$2B of QCT product revenue in FY27, then ~zero as Apple’s in-house modem (C-series) takes over. Separately, Apple pays Qualcomm <b>QTL patent royalties</b> under a multi-year license (independent of the chip business; renewal underway).',
    notes:'The modem revenue ramps to near-zero after the 2026 iPhone; the QTL royalty is a separate, continuing stream.' },
  { id:'oppo', name:'Oppo', domain:'oppo.com', mono:'OP', col:'#1B8E4F', tag:'Major Android OEM',
    relationship:'A major Chinese OEM customer, part of the BBK group (which also owns OnePlus and is affiliated with Vivo/Realme).',
    buys:'Snapdragon <b>8-series</b> in Find-series flagships and Snapdragon across the mid-range.',
    contract:'Per-generation design wins plus a separate <b>QTL license</b>. FY2025 saw new long-term licenses signed with key Chinese OEMs.' },
  { id:'oneplus', name:'OnePlus', domain:'oneplus.com', mono:'1+', col:'#EB0028', tag:'Flagship Snapdragon',
    relationship:'A flagship-focused brand under Oppo/BBK, known for pairing top Snapdragon silicon with performance-tuned phones.',
    buys:'Snapdragon <b>8-series</b> (flagship) across the OnePlus and Nord lines.',
    contract:'Design wins per generation; licensing handled under the Oppo/BBK <b>QTL</b> agreements.' },
  { id:'vivo', name:'Vivo', domain:'vivo.com', mono:'VV', col:'#415FFF', tag:'Major Android OEM',
    relationship:'A major Chinese OEM (BBK group), including its performance sub-brand <b>iQOO</b>.',
    buys:'Snapdragon <b>8-series</b> in X-series and iQOO flagships, plus Snapdragon across the mid-range.',
    contract:'Per-generation design wins + separate <b>QTL license</b>.' },
  { id:'honor', name:'Honor', domain:'hihonor.com', mono:'HO', col:'#1B6EF3', tag:'Android OEM',
    relationship:'Independent since being spun off from Huawei in 2020 — and, unlike export-restricted Huawei, free to use Snapdragon across its lineup.',
    buys:'Snapdragon <b>8-series</b> in Magic-series flagships and Snapdragon across mid-range.',
    contract:'Design wins per generation + <b>QTL license</b>.' },
  { id:'motorola', name:'Motorola', domain:'motorola.com', mono:'MO', col:'#2E6CE6', tag:'Android OEM (Lenovo)',
    relationship:'Lenovo-owned; a long-standing Snapdragon customer across its razr and edge lines.',
    buys:'Snapdragon <b>8-series</b> in razr / edge flagships and Snapdragon across mid- and entry-tier.',
    contract:'Design wins per generation + <b>QTL license</b>.' },
  { id:'asus', name:'Asus', domain:'asus.com', mono:'AS', col:'#1C3D6E', tag:'Gaming flagship',
    relationship:'Uses top-bin Snapdragon for its gaming-focused <b>ROG Phone</b> and Zenfone lines.',
    buys:'Snapdragon <b>8-series</b> (often the highest-clocked “Leading Version”).',
    contract:'Design wins per generation + <b>QTL license</b>.' },
  { id:'sony', name:'Sony', domain:'sony.com', mono:'SY', col:'#111111', tag:'Xperia flagship',
    relationship:'Sony’s Xperia flagships run on Snapdragon’s top tier.',
    buys:'Snapdragon <b>8-series</b> in Xperia 1 / 5 flagships.',
    contract:'Design wins per generation + <b>QTL license</b>.' },
  { id:'zte', name:'ZTE / Nubia', domain:'zte.com', mono:'ZN', col:'#0A5AA8', tag:'Gaming flagship',
    relationship:'ZTE’s Nubia / RedMagic gaming phones use flagship Snapdragon.',
    buys:'Snapdragon <b>8-series</b> in RedMagic gaming phones.',
    contract:'Design wins per generation + <b>QTL license</b>.' },
  { id:'realme', name:'Realme', domain:'realme.com', mono:'RM', col:'#E6A400', tag:'Value Android OEM',
    relationship:'A fast-growing value brand (BBK-affiliated) spanning flagship to entry.',
    buys:'Snapdragon <b>8-series</b> in GT flagships and Snapdragon across mid/entry.',
    contract:'Design wins per generation + <b>QTL license</b>.' },
  { id:'nothing', name:'Nothing', domain:'nothing.tech', mono:'NO', col:'#1A1A1A', tag:'Emerging OEM',
    relationship:'A design-led newcomer using Snapdragon across its Phone and CMF lines.',
    buys:'Snapdragon <b>8s / 7-series</b> in the Phone line.',
    contract:'Design wins per generation + <b>QTL license</b>.' },
];
// Region of each handset OEM — colours the card border (China / USA / Rest of World).
var CL_REGION = { samsung:'row', xiaomi:'china', apple:'usa', oppo:'china', oneplus:'china',
  vivo:'china', honor:'china', motorola:'usa', asus:'row', sony:'row', zte:'china',
  realme:'china', nothing:'row' };
var CL_REGION_LABEL = { china:'China', usa:'United States', row:'Rest of World' };

function clLogo(c, cls){
  // Real brand logo via Google's favicon service (CSP-allows *.gstatic.com); the
  // monogram behind it shows if the logo fails to load.
  var fav = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=https://'+esc(c.domain);
  return '<span class="cl-logo '+(cls||'')+'"><span class="cl-mono" style="background:'+c.col+'">'+esc(c.mono)+'</span>'+
    '<img src="'+fav+'" alt="'+esc(c.name)+'" loading="lazy" onerror="this.remove()"></span>';
}
function clientCard(c, i){
  var r = CL_REGION[c.id] || 'row';
  return '<button type="button" class="cl-card cl-'+r+(i===0?' active':'')+'" data-cl="'+c.id+'" aria-label="'+esc(c.name)+'">'+
    clLogo(c)+'<span class="cl-name">'+esc(c.name)+'</span></button>';
}
function clSec(title, body){ return body ? '<div class="cl-sec"><div class="cl-sec-h">'+esc(title)+'</div><p class="cl-sec-p">'+body+'</p></div>' : ''; }
function clientDetail(c){
  var r = CL_REGION[c.id] || 'row';
  return '<div class="cl-detail">'+
    '<div class="cl-detail-head">'+clLogo(c, 'lg')+
      '<div><div class="cl-detail-name">'+esc(c.name)+'</div>'+
        '<div class="cl-detail-tag"><span class="cl-region-dot cl-'+r+'"></span>'+esc(CL_REGION_LABEL[r])+' · '+esc(c.tag)+'</div></div>'+
    '</div>'+
    clSec('The relationship', c.relationship)+
    clSec('What they buy', c.buys)+
    clSec('How the contract is structured', c.contract)+
    clSec('Notable / risk', c.notes)+
  '</div>';
}
function clientsBody(){
  return '<p class="ovlr-money-p">Who buys Snapdragon for phones. The card border shows the OEM’s home region. Tap a client to see the relationship, what they buy and how the contract is structured.</p>'+
    '<div class="cl-legend">'+
      '<span class="cl-lg cl-china"><i></i>China</span>'+
      '<span class="cl-lg cl-usa"><i></i>United States</span>'+
      '<span class="cl-lg cl-row"><i></i>Rest of World</span>'+
    '</div>'+
    '<div class="cl-grid">'+CLIENTS.map(clientCard).join('')+'</div>'+
    '<div class="cl-detail-wrap" id="qcClDetail">'+clientDetail(CLIENTS[0])+'</div>';
}

// ── Handsets · Competitors — mobile-SoC market share + comparison table ───────
// Estimated mobile SoC / application-processor unit share (industry estimates).
var MSHARE = [
  { name:'MediaTek',          pct:35, col:'#F5A623' },
  { name:'Qualcomm',          pct:24, self:true },
  { name:'Apple',             pct:15, col:'#8E8E93' },
  { name:'UNISOC',            pct:11, col:'#7A5AF8' },
  { name:'Samsung (Exynos)',  pct:6,  col:'#1428A0' },
  { name:'HiSilicon (Kirin)', pct:3,  col:'#C0392B' },
  { name:'Others',            pct:6,  col:'#C9CFD6' },
];
var COMPETE_ROWS = [
  { name:'MediaTek', type:'Merchant', arena:'Mid-range & entry; pushing into premium', flagship:'Dimensity 9400', share:'~35%',
    vs:'The volume leader. Qualcomm keeps the <b>premium Android tier</b> and owns the 5G standard-essential patents MediaTek must license.' },
  { name:'Apple (A-series)', type:'Captive', arena:'iPhone (premium) only', flagship:'A19 Pro', share:'~15%',
    vs:'Not a merchant rival, but sets the performance bar. Still buys Qualcomm’s <b>modem</b> — ramping down to ~zero.' },
  { name:'Samsung (Exynos)', type:'Captive + limited merchant', arena:'Parts of its own Galaxy line', flagship:'Exynos 2500', share:'~6%',
    vs:'Splits Galaxy flagships with Snapdragon — a <b>swing factor</b> on Samsung volume each generation.' },
  { name:'Google (Tensor)', type:'Captive', arena:'Pixel only', flagship:'Tensor G5', share:'<2%',
    vs:'A lapsed Snapdragon SoC customer; small volume, co-developed and fabbed with partners.' },
  { name:'UNISOC', type:'Merchant', arena:'Entry / low-cost (emerging markets)', flagship:'T-series', share:'~11%',
    vs:'Competes at the <b>bottom</b> of the market; not present in premium, where Qualcomm’s margins are.' },
  { name:'HiSilicon (Kirin)', type:'Captive (Huawei)', arena:'China premium', flagship:'Kirin 9020', share:'~3%',
    vs:'US export-restricted; a <b>China-only</b> resurgence — a walled-off, not merchant, threat.' },
];
function handsetsCompetitorsBody(){
  var h = '<p class="ovlr-money-p">Who competes with Snapdragon in smartphones — and where. By <b>volume</b> MediaTek leads; but in the <b>premium / merchant</b> tier (the profitable end, phones over ~$400), Qualcomm holds the majority. Apple, Samsung, Google and Huawei make chips only for their own phones (captive), so they take volume but don’t sell to other OEMs.</p>';
  h += '<div class="ms-sub">Mobile SoC market — estimated unit share</div>';
  h += '<div class="ms-chart">'+MSHARE.map(function(m){
    return '<div class="ms-row"><div class="ms-name">'+esc(m.name)+'</div>'+
      '<div class="ms-bar"><div class="ms-fill'+(m.self?' self':'')+'" style="width:'+m.pct+'%'+(m.self?'':';background:'+m.col)+'"></div></div>'+
      '<div class="ms-pct">'+m.pct+'%</div></div>';
  }).join('')+'</div>';
  h += '<div class="ovlr-money-note">Approximate global smartphone SoC / application-processor unit share (industry estimates; varies by quarter). <b>Premium lens:</b> among merchant chips in phones &gt;$400, Qualcomm — not MediaTek — holds the majority.</div>';
  h += '<div class="ms-sub" style="margin-top:22px">How each rival competes</div>';
  h += '<div style="overflow-x:auto"><table class="ov-table" style="min-width:720px"><thead><tr>'+
    '<th>Competitor</th><th>Type</th><th>Where it competes</th><th>Flagship SoC</th><th>Est. share</th><th>Qualcomm’s edge</th>'+
    '</tr></thead><tbody>'+COMPETE_ROWS.map(function(r){
      return '<tr><td class="ov-td-name">'+esc(r.name)+'</td><td>'+esc(r.type)+'</td><td>'+esc(r.arena)+'</td>'+
        '<td>'+esc(r.flagship)+'</td><td>'+esc(r.share)+'</td><td>'+r.vs+'</td></tr>';
    }).join('')+'</tbody></table></div>';
  h += '<div class="ovlr-money-note">On <b>modems</b> specifically, Qualcomm leads the merchant 5G market; Apple is bringing its modem in-house, and MediaTek, Samsung and UNISOC supply their own.</div>';
  return h;
}

// ── Handsets · Competitive Advantage — interactive, expandable advantage cards ─
var ADV = [
  { ic:'📡', title:'Best integrated modem + SoC', stat:'Modem-to-antenna on one chip',
    body:'Qualcomm is the only vendor pairing a top-tier 5G modem with a flagship CPU, GPU and NPU on a single die. Rivals — even Apple — have struggled to match the modem, which is exactly why Apple still buys Qualcomm’s.' },
  { ic:'👑', title:'Premium Android leadership', stat:'Majority of premium merchant SoCs',
    body:'Snapdragon is the de-facto chip of flagship Android — the tier where ASPs and margins live. MediaTek leads by unit volume, but Qualcomm owns the profitable premium end.' },
  { ic:'📜', title:'The 5G patent moat', stat:'200,000+ essential patents',
    body:'Even rivals pay: MediaTek, Apple and every phone maker license Qualcomm’s cellular standard-essential patents. They are baked into the 3G/4G/5G standard — unavoidable, and a ~72%-margin royalty stream (QTL).' },
  { ic:'⚙️', title:'Custom Oryon CPU + annual cadence', stat:'A new platform every year',
    body:'A yearly flagship roadmap and its custom Oryon CPU keep Qualcomm’s performance-per-watt lead ahead of rivals and pull customers through repeated upgrade cycles.' },
  { ic:'🧠', title:'On-device AI leadership', stat:'Agentic-AI upgrade cycle',
    body:'The Hexagon NPU makes Snapdragon a leader in on-device generative and agentic AI — driving a new upgrade super-cycle and more silicon content per phone.' },
  { ic:'🔗', title:'The full connectivity stack', stat:'Modem + RF + Wi-Fi / BT',
    body:'Beyond the SoC, Qualcomm supplies the RF front-end and FastConnect Wi-Fi / Bluetooth — a complete connectivity system a stand-alone merchant chip can’t match.' },
];
function advCard(a, i){
  return '<div class="adv-card'+(i===0?' open':'')+'" data-adv="'+i+'">'+
    '<button type="button" class="adv-head">'+
      '<span class="adv-ic">'+a.ic+'</span>'+
      '<span class="adv-hcol"><span class="adv-title">'+esc(a.title)+'</span><span class="adv-stat">'+esc(a.stat)+'</span></span>'+
      '<span class="adv-ch">▾</span>'+
    '</button>'+
    '<div class="adv-body">'+esc(a.body)+'</div>'+
  '</div>';
}
function advantageBody(){
  return '<p class="ovlr-money-p">Why Snapdragon wins in phones — the advantages rivals find hardest to copy. Tap a card to see why it’s defensible.</p>'+
    '<div class="adv-grid">'+ADV.map(advCard).join('')+'</div>';
}

// ── Handsets · Numbers — interactive revenue chart: year-range slider, YoY & CAGR.
// Handsets = QCT Handsets-category revenue ($B). FY2024/FY2025 reported; FY2021–FY2023
// approximate (verify vs older 10-Ks); FY2029E = Investor Day target.
var NUM_DATA = [
  { fy:'FY2021', rev:20.8, margin:29 },
  { fy:'FY2022', rev:28.4, margin:33 },
  { fy:'FY2023', rev:24.0, margin:28 },
  { fy:'FY2024', rev:24.9, margin:29 },
  { fy:'FY2025', rev:27.8, margin:30 },
  { fy:'FY2029E', rev:33.8, margin:30, proj:true },
];
var _numStart = 0, _numEnd = NUM_DATA.length - 2, _numMargin = true, _numYoY = true, _numChart = null;
function numYear(fy){ return parseInt(String(fy).replace(/[^0-9]/g, ''), 10); }
var numBarLabels = { id:'numBarLabels', afterDatasetsDraw:function(chart){
  var ctx = chart.ctx, ds = chart.data.datasets[0], meta = chart.getDatasetMeta(0);
  var yoy = chart.$yoy || [], rows = chart.$rows || [];
  meta.data.forEach(function(bar, i){
    ctx.save(); ctx.textAlign = 'center';
    ctx.font = '700 12px Inter, sans-serif'; ctx.fillStyle = (rows[i] && rows[i].proj) ? '#B7791F' : '#1E2733';
    ctx.fillText('$'+Number(ds.data[i]).toFixed(1)+'B', bar.x, bar.y - 20);
    if (_numYoY && yoy[i] != null){ var up = yoy[i] >= 0;
      ctx.font = '700 10.5px Inter, sans-serif'; ctx.fillStyle = up ? '#1E9E62' : '#C0392B';
      ctx.fillText((up?'+':'')+yoy[i].toFixed(0)+'%', bar.x, bar.y - 6); }
    ctx.restore();
  });
}};
function numbersBody(){
  return '<p class="ovlr-money-p">Handsets revenue and how it has grown. Drag the <b>range slider</b> to widen or shift the years; toggle the operating-margin line and YoY labels. The readout shows the <b>CAGR</b> for the selected range.</p>'+
    '<div class="ovlr-mg-chips" id="qcNumChips">'+
      '<button type="button" class="ovlr-mg-chip on" data-num="margin" style="--mg:#00A9CE"><span class="ovlr-mg-dot"></span>Operating margin</button>'+
      '<button type="button" class="ovlr-mg-chip on" data-num="yoy" style="--mg:#1B9E5F"><span class="ovlr-mg-dot"></span>YoY growth</button>'+
    '</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Handsets revenue &amp; margin <span>· $B · drag the slider to change years</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="qcNumChart"></canvas></div></div>'+
    '<div class="ovlr-mg-slider" id="qcNumSlider"></div>'+
    '<div class="num-cagr" id="qcNumCagr"></div>'+
    '<div class="ovlr-money-note">Handsets = QCT Handsets-category revenue. <b>FY2024 &amp; FY2025 reported</b>; FY2021–FY2023 are approximate (verify vs older 10-Ks). Operating margin is the <b>QCT segment</b> EBT margin (per-category margin is not disclosed). <b>FY2029E</b> = Investor Day target (~5% Android-handset CAGR, 30% QCT margin) — not a forecast.</div>';
}
function numDefaultWindow(){ return [0, NUM_DATA.length - 2]; }
function renderNumSlider(){
  var el = document.getElementById('qcNumSlider'); if (!el) return;
  var n = NUM_DATA.length; if (n < 2){ el.innerHTML = ''; return; }
  var pos = function(i){ return (i/(n-1))*100; };
  var lp = pos(_numStart), rp = pos(_numEnd);
  var ticks = NUM_DATA.map(function(r, i){ var on = (i>=_numStart && i<=_numEnd);
    return '<span class="ovlr-mg-tick'+(on?' in':'')+(r.proj?' proj':'')+'">'+esc(r.fy)+'</span>'; }).join('');
  el.innerHTML = '<div class="ovlr-mg-rail"><div class="ovlr-mg-fill" style="left:'+lp+'%;right:'+(100-rp)+'%"></div>'+
    '<span class="ovlr-mg-handle" data-h="start" style="left:'+lp+'%" role="slider" tabindex="0" aria-label="range start"></span>'+
    '<span class="ovlr-mg-handle" data-h="end" style="left:'+rp+'%" role="slider" tabindex="0" aria-label="range end"></span></div>'+
    '<div class="ovlr-mg-ticks">'+ticks+'</div>';
}
function wireNumSlider(scope){
  var slider = scope.querySelector('#qcNumSlider'); if (!slider || slider._w) return; slider._w = 1;
  var drag = null;
  function idxFromX(x){ var rail = slider.querySelector('.ovlr-mg-rail'); if (!rail) return _numStart;
    var rect = rail.getBoundingClientRect(); var f = (x-rect.left)/Math.max(1, rect.width);
    return Math.round(Math.max(0, Math.min(1, f)) * (NUM_DATA.length-1)); }
  slider.addEventListener('pointerdown', function(e){
    var h = e.target.closest('.ovlr-mg-handle');
    if (h){ drag = { which:h.getAttribute('data-h') }; }
    else if (e.target.closest('.ovlr-mg-fill')){ drag = { which:'pan', anchor:idxFromX(e.clientX), s0:_numStart, e0:_numEnd }; }
    else { var i = idxFromX(e.clientX);
      if (Math.abs(i-_numStart) <= Math.abs(i-_numEnd)) _numStart = Math.min(i, _numEnd-1); else _numEnd = Math.max(i, _numStart+1);
      renderNumSlider(); buildNumbersChart(); return; }
    try { slider.setPointerCapture(e.pointerId); } catch(_){ } e.preventDefault();
  });
  slider.addEventListener('pointermove', function(e){ if (!drag) return; var i = idxFromX(e.clientX), n = NUM_DATA.length;
    if (drag.which === 'start') _numStart = Math.max(0, Math.min(i, _numEnd-1));
    else if (drag.which === 'end') _numEnd = Math.min(n-1, Math.max(i, _numStart+1));
    else if (drag.which === 'pan'){ var w = drag.e0-drag.s0, ns = Math.max(0, Math.min(drag.s0 + (i-drag.anchor), n-1-w)); _numStart = ns; _numEnd = ns+w; }
    renderNumSlider(); buildNumbersChart();
  });
  function end(e){ if (drag){ try { slider.releasePointerCapture(e.pointerId); } catch(_){ } drag = null; } }
  slider.addEventListener('pointerup', end); slider.addEventListener('pointercancel', end);
}
function updateNumCagr(rows){
  var el = document.getElementById('qcNumCagr'); if (!el) return;
  var actuals = rows.filter(function(r){ return !r.proj; });
  var html = '';
  if (actuals.length >= 2){
    var a = actuals[0], b = actuals[actuals.length-1], steps = numYear(b.fy) - numYear(a.fy);
    var cagr = steps > 0 ? (Math.pow(b.rev/a.rev, 1/steps) - 1) * 100 : 0;
    html += '<span class="num-cagr-item"><b>'+(cagr>=0?'+':'')+cagr.toFixed(1)+'%</b> CAGR · '+esc(a.fy)+' → '+esc(b.fy)+'</span>';
  }
  var proj = rows.filter(function(r){ return r.proj; })[0];
  if (proj && actuals.length){
    var last = actuals[actuals.length-1], steps2 = numYear(proj.fy) - numYear(last.fy);
    var cagr2 = steps2 > 0 ? (Math.pow(proj.rev/last.rev, 1/steps2) - 1) * 100 : 0;
    html += '<span class="num-cagr-item alt"><b>'+(cagr2>=0?'+':'')+cagr2.toFixed(1)+'%</b> / yr to FY2029E target</span>';
  }
  el.innerHTML = html;
}
function buildNumbersChart(){
  var cv = document.getElementById('qcNumChart');
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (_numChart){ _numChart.destroy(); _numChart = null; }
  var rows = NUM_DATA.slice(_numStart, _numEnd + 1);
  var yoy = rows.map(function(r, i){
    var gi = _numStart + i; if (gi === 0 || r.proj) return null;
    var prev = NUM_DATA[gi-1]; if ((numYear(r.fy) - numYear(prev.fy)) !== 1) return null;
    return (r.rev/prev.rev - 1) * 100;
  });
  var barColors = rows.map(function(r){ return r.proj ? '#F2A900' : '#3253DC'; });
  var datasets = [{ type:'bar', label:'Handsets revenue ($B)', data:rows.map(function(r){ return r.rev; }),
    backgroundColor:barColors, borderRadius:6, maxBarThickness:64, yAxisID:'y', order:2 }];
  if (_numMargin) datasets.push({ type:'line', label:'QCT operating margin (%)', data:rows.map(function(r){ return r.margin; }),
    borderColor:'#00A9CE', backgroundColor:'#00A9CE', borderWidth:2.5, tension:.3, yAxisID:'y1', order:1,
    pointRadius:rows.map(function(r){ return r.proj ? 5 : 4; }), pointHoverRadius:6,
    pointStyle:rows.map(function(r){ return r.proj ? 'rectRot' : 'circle'; }),
    segment:{ borderDash:function(ctx){ return (rows[ctx.p1DataIndex] && rows[ctx.p1DataIndex].proj) ? [5,4] : undefined; } } });
  _numChart = new Chart(cv.getContext('2d'), {
    data:{ labels:rows.map(function(r){ return r.fy; }), datasets:datasets },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:30 } },
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:true, position:'bottom', labels:{ usePointStyle:true, font:{size:12} } },
        tooltip:{ callbacks:{ title:function(it){ var l=it[0].label; return l==='FY2029E' ? 'FY2029E · target' : l; },
          label:function(ctx){ return ctx.dataset.yAxisID==='y1'
            ? ' '+ctx.dataset.label+': '+ctx.parsed.y+'%' : ' '+ctx.dataset.label+': $'+Number(ctx.parsed.y).toFixed(1)+'B'; } } } },
      scales:{
        y:{ position:'left', beginAtZero:true, title:{ display:true, text:'Revenue ($B)', color:'#5b6470' },
          grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', callback:function(v){ return '$'+v+'B'; } } },
        y1:{ position:'right', min:0, max:50, display:_numMargin, title:{ display:true, text:'Operating margin (%)', color:'#5b6470' },
          grid:{ display:false }, ticks:{ color:'#8A93A0', callback:function(v){ return v+'%'; } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ weight:'600' } } }
      } },
    plugins:[numBarLabels]
  });
  _numChart.$rows = rows; _numChart.$yoy = yoy;
  updateNumCagr(rows);
}

// Handsets — 4th-level sub-tabs. Products · Clients · Competitors · Competitive Advantage · Numbers.
function handsetsBody(){
  return '<div class="hs-tabs">'+
    '<button type="button" class="hs-tab active" data-hs="products">Products</button>'+
    '<button type="button" class="hs-tab" data-hs="clients">Clients</button>'+
    '<button type="button" class="hs-tab" data-hs="competitors">Competitors</button>'+
    '<button type="button" class="hs-tab" data-hs="advantage">Competitive Advantage</button>'+
    '<button type="button" class="hs-tab" data-hs="numbers">Numbers</button>'+
  '</div>'+
  '<div class="hs-pane" data-hs="products">'+snapdragonExplorer()+'</div>'+
  '<div class="hs-pane" data-hs="clients" hidden>'+clientsBody()+'</div>'+
  '<div class="hs-pane" data-hs="competitors" hidden>'+handsetsCompetitorsBody()+'</div>'+
  '<div class="hs-pane" data-hs="advantage" hidden>'+advantageBody()+'</div>'+
  '<div class="hs-pane" data-hs="numbers" hidden>'+numbersBody()+'</div>';
}

// QCT sub-tab — its own 3rd-level segment tabs (Handsets · IoT · Automotive · Data Center).
function qctBody(){
  var h = '<p class="ovlr-money-p">QCT is Qualcomm’s chip business (~87% of revenue, ~30% operating margin). It reports four end-markets:</p>';
  h += '<div class="qseg-tabs">'+QCT_CATS.map(function(cat,i){
    return '<button type="button" class="qseg-tab'+(i===0?' active':'')+'" data-qseg="'+cat.key+'">'+esc(cat.label)+'</button>';
  }).join('')+'</div>';
  h += QCT_CATS.map(function(cat,i){
    var body = (cat.key === 'handsets') ? handsetsBody() : segBody(cat);
    return '<div class="qseg-pane" data-qseg="'+cat.key+'"'+(i===0?'':' hidden')+'>'+body+'</div>';
  }).join('');
  return h;
}
function qtlBody(){ return segBody(QTL_SEG); }
// Deep Dive body — QCT / QTL sub-tabs.
function deepDiveBody(){
  var h = '<div class="ovt-subtabs">'+
    '<button type="button" class="ovt-subtab active" data-ovst="qct">QCT — Chips</button>'+
    '<button type="button" class="ovt-subtab" data-ovst="qtl">QTL — Licensing</button>'+
  '</div>';
  h += '<div class="ovt-subpane" data-ovst="qct">'+qctBody()+'</div>';
  h += '<div class="ovt-subpane" data-ovst="qtl" hidden>'+qtlBody()+'</div>';
  return h;
}

// ─── Overview body (the Overview tab’s content) ───────────────────────────────
function overviewBody(){
  var h = '';
  h += '<div class="ov-snap ovlr-snap6">' + SNAPSHOT.map(function(p){
    return '<div class="ov-snap-cell"><div class="ov-snap-k">'+esc(p[0])+'</div><div class="ov-snap-v">'+esc(p[1])+'</div></div>';
  }).join('') + '</div>';
  h += heroMultiples();
  h += descBox();
  h += heroBusiness();
  h += ovBox('products', 'What they offer', 'products & platforms', productsBody(), false);
  h += ovBox('money', 'How it makes money', 'segments & regions', moneyBody(), false);
  h += ovBox('margins', 'Margins', 'interactive · profitability & cash', marginsBody(), false);
  h += ovBox('competitors', 'Competitors', 'multiple × growth × size', competitorsBody(), false);
  h += '<div class="ov-foot">'+esc(SOURCES)+'</div>';
  return h;
}

function html(c){
  var h = '<div class="ov ov-qcom" data-brand="QCOM">';
  h += '<div class="ovt-tabs">'+
    '<button type="button" class="ovt-tab active" data-ovt="overview">Overview</button>'+
    '<button type="button" class="ovt-tab" data-ovt="deep">Deep Dive</button>'+
  '</div>';
  h += '<div class="ovt-pane" data-ovt="overview">'+overviewBody()+'</div>';
  h += '<div class="ovt-pane" data-ovt="deep" hidden>'+deepDiveBody()+'</div>';
  h += '</div>';
  return h;
}

// Wire the overview. Idempotent; safe on load and re-entry.
function init(c){
  var pane = document.querySelector('.ov-qcom'); if (!pane) return;

  // Top-level tabs (Overview | Deep Dive).
  pane.querySelectorAll(':scope > .ovt-tabs > .ovt-tab').forEach(function(btn){
    btn.onclick = function(){
      var key = btn.getAttribute('data-ovt');
      pane.querySelectorAll(':scope > .ovt-tabs > .ovt-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
      pane.querySelectorAll(':scope > .ovt-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovt') !== key); });
    };
  });
  // Deep Dive — QCT / QTL sub-tabs.
  var deep = pane.querySelector('.ovt-pane[data-ovt="deep"]');
  if (deep) deep.querySelectorAll('.ovt-subtab').forEach(function(btn){
    btn.onclick = function(){
      var key = btn.getAttribute('data-ovst');
      deep.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
      deep.querySelectorAll('.ovt-subpane').forEach(function(p){ p.hidden = (p.getAttribute('data-ovst') !== key); });
    };
  });
  // QCT — segment sub-sub-tabs (Handsets · IoT · Automotive · Data Center).
  var qct = pane.querySelector('.ovt-subpane[data-ovst="qct"]');
  if (qct) qct.querySelectorAll('.qseg-tab').forEach(function(btn){
    btn.onclick = function(){
      var key = btn.getAttribute('data-qseg');
      qct.querySelectorAll('.qseg-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
      qct.querySelectorAll('.qseg-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-qseg') !== key); });
    };
  });

  // Handsets — Snapdragon-series explorer: tap a tile → update the spec sheet.
  var hs = pane.querySelector('.qseg-pane[data-qseg="handsets"]');
  if (hs){
    // 4th-level sub-tabs (Products · Clients · Competitors · Competitive Advantage · Numbers).
    hs.querySelectorAll('.hs-tab').forEach(function(btn){
      btn.onclick = function(){
        var key = btn.getAttribute('data-hs');
        hs.querySelectorAll('.hs-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
        hs.querySelectorAll('.hs-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-hs') !== key); });
        if (key === 'numbers') requestAnimationFrame(function(){ renderNumSlider(); buildNumbersChart(); });   // Chart.js needs a visible canvas
      };
    });
    // Competitive Advantage — expandable cards.
    hs.querySelectorAll('.adv-head').forEach(function(head){
      head.onclick = function(){ head.parentElement.classList.toggle('open'); };
    });
    // Numbers — metric toggles (operating margin · YoY) + year-range slider.
    var numChips = hs.querySelector('#qcNumChips');
    if (numChips) numChips.onclick = function(e){ var b = e.target.closest('.ovlr-mg-chip'); if (!b) return;
      var k = b.getAttribute('data-num');
      if (k === 'margin') _numMargin = !_numMargin; else if (k === 'yoy') _numYoY = !_numYoY;
      b.classList.toggle('on'); buildNumbersChart();
    };
    wireNumSlider(hs);
    var sheet = hs.querySelector('#qcSdSheet');
    hs.querySelectorAll('.sd-tile').forEach(function(tile){
      tile.onclick = function(){
        var id = tile.getAttribute('data-sd');
        hs.querySelectorAll('.sd-tile').forEach(function(t){ t.classList.toggle('active', t===tile); });
        var s = SNAPDRAGON.filter(function(x){ return x.id === id; })[0];
        if (s && sheet) sheet.innerHTML = specSheet(s);
      };
    });
    // Clients — tap a logo → update the relationship detail.
    var clDetail = hs.querySelector('#qcClDetail');
    hs.querySelectorAll('.cl-card').forEach(function(card){
      card.onclick = function(){
        var id = card.getAttribute('data-cl');
        hs.querySelectorAll('.cl-card').forEach(function(c){ c.classList.toggle('active', c===card); });
        var cl = CLIENTS.filter(function(x){ return x.id === id; })[0];
        if (cl && clDetail) clDetail.innerHTML = clientDetail(cl);
      };
    });
  }

  // 2 — multiples: trailing/forward toggle + live price/EV fill.
  pane.querySelectorAll('#qcMultToggle .ovlr-seg-b').forEach(function(b){
    b.onclick = function(){ _multMode = b.getAttribute('data-mult');
      pane.querySelectorAll('#qcMultToggle .ovlr-seg-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      multFill(pane);
    };
  });
  multFill(pane);
  import('../api.js').then(function(api){ return api.liveQuote('QCOM'); }).then(function(res){
    var q = res && res.data; if (!q || q.price == null) return;
    _multPrice = q.price; _multEv = q.ev;
    var mc = pane.querySelector('#qcMultMc'); if (mc && q.marketCap != null) mc.textContent = fmtBig(q.marketCap);
    var evEl = pane.querySelector('#qcMultEv'); if (evEl && q.ev != null) evEl.textContent = fmtBig(q.ev);
    multFill(pane);
  }).catch(function(){});

  // 3 — description expand/collapse.
  var dMore = pane.querySelector('#qcDescMore');
  if (dMore) dMore.onclick = function(){
    var box = pane.querySelector('.ovlr-desc'); var open = box.classList.toggle('open');
    dMore.textContent = open ? 'Read less ▴' : 'Read more ▾';
  };

  // 5 — products lightbox (tap a card → enlarge photo + detail).
  var modal = pane.querySelector('#qcProdModal');
  if (modal){
    var mImg = modal.querySelector('#qcProdImg'), mTag = modal.querySelector('#qcProdTag'),
        mName = modal.querySelector('#qcProdName'), mDesc = modal.querySelector('#qcProdDesc');
    var closeProd = function(){ modal.hidden = true; };
    var openProd = function(card){ var p = PRODUCTS[parseInt(card.getAttribute('data-prod'),10)]; if (!p) return;
      mImg.src = 'img/products/'+p.img; mImg.alt = p.name; mImg.onerror = function(){ mImg.style.display='none'; };
      mImg.style.display = ''; mTag.textContent = p.tag; mName.textContent = p.name;
      mDesc.innerHTML = p.detail || p.d; modal.hidden = false; };
    pane.querySelectorAll('.ovlr-prod-card').forEach(function(card){
      card.onclick = function(){ openProd(card); };
      card.onkeydown = function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openProd(card); } };
    });
    modal.onclick = function(e){ if (e.target === modal) closeProd(); };
    var xb = modal.querySelector('#qcProdX'); if (xb) xb.onclick = closeProd;
    if (!modal._esc){ modal._esc = 1; document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !modal.hidden) closeProd(); }); }
  }

  // 5/6/7 — collapsible boxes; build the lazy chart when a box opens.
  pane.querySelectorAll('.ovlr-box-h').forEach(function(hb){
    hb.onclick = function(){
      var box = hb.parentElement; var open = box.classList.toggle('open');
      if (open){
        var id = box.getAttribute('data-box');
        if (id === 'money') requestAnimationFrame(buildMoneyChart);
        if (id === 'margins') requestAnimationFrame(function(){ renderMrgSlider(); buildMarginChart(); });
        if (id === 'competitors') requestAnimationFrame(buildCompChart);
      }
    };
  });

  // 6 — money segment/region toggle.
  pane.querySelectorAll('#qcMoneyToggle .ovlr-seg-b').forEach(function(b){
    b.onclick = function(){ _moneyMode = b.getAttribute('data-money');
      pane.querySelectorAll('#qcMoneyToggle .ovlr-seg-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      var d = _moneyMode === 'region' ? MONEY_REG : MONEY_SEG;
      var t = pane.querySelector('#qcMoneyTitle'); if (t) t.innerHTML = d.title;
      var n = pane.querySelector('#qcMoneyNote'); if (n) n.innerHTML = d.note;
      var det = pane.querySelector('#qcMoneyDetail');
      if (det) det.innerHTML = _moneyMode === 'region' ? MONEY_REG_DETAIL : moneySegCards();
      buildMoneyChart();
    };
  });

  // 6.5 — margins: metric toggle chips + range slider.
  var mgChips = pane.querySelector('#qcMgChips');
  if (mgChips) mgChips.onclick = function(e){ var b = e.target.closest('.ovlr-mg-chip'); if (!b) return;
    var k = b.getAttribute('data-mg'); _mrgSel[k] = !_mrgSel[k]; b.classList.toggle('on', _mrgSel[k]); buildMarginChart(); };
  var w = mrgDefaultWindow(); _mrgStart = w[0]; _mrgEnd = w[1];
  wireMrgSlider(pane);
  renderMrgSlider();

  // 7 — competitors: toggles, add/remove, live market cap per ticker.
  pane.querySelectorAll('#qcCompMult .ovlr-seg-b').forEach(function(b){
    b.onclick = function(){ _compMult = b.getAttribute('data-cmult');
      pane.querySelectorAll('#qcCompMult .ovlr-seg-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      buildCompChart(); };
  });
  pane.querySelectorAll('#qcCompTime .ovlr-seg-b').forEach(function(b){
    b.onclick = function(){ _compTime = b.getAttribute('data-ctime');
      pane.querySelectorAll('#qcCompTime .ovlr-seg-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      buildCompChart(); };
  });
  var liveMcap = function(tk){
    import('../api.js').then(function(api){ return api.liveQuote(tk); }).then(function(res){
      var q = res && res.data; if (!q || q.marketCap == null) return;
      var row = COMP.filter(function(c){ return c.ticker === tk; })[0];
      if (row){ row.mcap = Math.round(q.marketCap/1e9); renderCompChips(); buildCompChart(); }
    }).catch(function(){});
  };
  COMP.forEach(function(c){ liveMcap(c.ticker); });
  var addInput = pane.querySelector('#qcCompInput'), addBtn = pane.querySelector('#qcCompAdd');
  var doAdd = function(){
    var tk = (addInput.value||'').trim().toUpperCase().replace(/[^A-Z.]/g,''); if (!tk) return;
    if (COMP.some(function(c){ return c.ticker === tk; })){ addInput.value=''; return; }
    COMP.push({ ticker:tk, name:tk, pe:null, peF:null, ev:null, evF:null, eg:null, egF:null, ebg:null, ebgF:null, mcap:null });
    addInput.value=''; renderCompChips(); liveMcap(tk);
  };
  if (addBtn) addBtn.onclick = doAdd;
  if (addInput) addInput.onkeydown = function(e){ if (e.key === 'Enter'){ e.preventDefault(); doAdd(); } };
  var chips = pane.querySelector('#qcCompChips');
  if (chips) chips.onclick = function(e){ var t = e.target.closest('.ovlr-comp-x'); if (!t) return;
    COMP.splice(parseInt(t.getAttribute('data-rm'),10), 1); renderCompChips(); buildCompChart(); };
  renderCompChips();
}

export var qcomOverview = { html: html, init: init };
