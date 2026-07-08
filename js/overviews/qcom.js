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
  npu:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.4"/><circle cx="5" cy="6" r="1.6"/><circle cx="19" cy="6" r="1.6"/><circle cx="5" cy="18" r="1.6"/><circle cx="19" cy="18" r="1.6"/><path d="M6.4 6.8l3.4 3.6M17.6 6.8l-3.4 3.6M6.4 17.2l3.4-3.6M17.6 17.2l-3.4-3.6"/></svg>',
  mem:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="7" width="18" height="10" rx="1.5"/><path d="M7 7v10M11 7v10M15 7v10M3 20v-1M8 20v-1M13 20v-1M18 20v-1" stroke-linecap="round"/></svg>',
  power: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
  robot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="5" y="8" width="14" height="10" rx="2"/><path d="M12 8V5M12 5a1.4 1.4 0 100-2.8A1.4 1.4 0 0012 5z"/><circle cx="9" cy="13" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="13" r="1.1" fill="currentColor" stroke="none"/><path d="M3 12v3M21 12v3" stroke-linecap="round"/></svg>',
  car:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M3 13l2-5a2 2 0 011.9-1.3h10.2A2 2 0 0119 8l2 5v5h-3v-2H6v2H3z"/><circle cx="7.5" cy="15.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="16.5" cy="15.5" r="1.1" fill="currentColor" stroke="none"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M7 18a4 4 0 01-.4-8A5 5 0 0117 9.5a3.5 3.5 0 01.5 6.96"/><path d="M7 18h10" stroke-linecap="round"/></svg>',
  screen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4" stroke-linecap="round"/></svg>',
  xr:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M2 9.5A2.5 2.5 0 014.5 7h15A2.5 2.5 0 0122 9.5v3a2.5 2.5 0 01-2.5 2.5h-4l-2-2h-3l-2 2h-4A2.5 2.5 0 012 12.5z"/><circle cx="7.5" cy="11" r="1.4"/><circle cx="16.5" cy="11" r="1.4"/></svg>',
  chip:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="1.5"/><path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M6 9H3M6 15H3M21 9h-3M21 15h-3" stroke-linecap="round"/><path d="M10 10h4v4h-4z"/></svg>',
  link:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 15l6-6M8 12l-1.5 1.5a3 3 0 004.2 4.2L16 14M16 12l1.5-1.5a3 3 0 00-4.2-4.2L8 10"/></svg>',
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
// Product tile + spec sheet. `brand` is per-product (Snapdragon / Dragonwing /
// Dragonfly …); `series`+`gen` form the model line, `gen` is accented in red.
function sdTile(s, i){
  var brand = s.brand || 'Snapdragon';
  return '<button type="button" class="sd-tile'+(i===0?' active':'')+'" data-sd="'+esc(s.id)+'" aria-label="'+esc(brand+' '+s.series+' '+(s.gen||''))+'">'+
    '<div class="sd-tile-brand">'+esc(brand)+'</div>'+
    '<div class="sd-tile-model">'+esc(s.series)+(s.gen?' <em>'+esc(s.gen)+'</em>':'')+'</div>'+
    '<div class="sd-tile-tier">'+esc(s.tier)+'</div>'+
    sdLogo('sd-tile-logo')+
  '</button>';
}
function specSheet(s){
  var brand = s.brand || 'Snapdragon';
  var rows = s.specs.map(function(sp){
    return '<div class="sd-spec"><span class="sd-spec-ic">'+(SD_ICONS[sp.ic]||'')+'</span>'+
      '<div><div class="sd-spec-t">'+esc(sp.t)+'</div><div class="sd-spec-d">'+esc(sp.d)+'</div></div></div>';
  }).join('');
  return '<div class="sd-sheet">'+
    '<div class="sd-sheet-head">'+sdLogo('sd-sheet-logo')+
      '<div class="sd-sheet-brand">'+esc(brand.toUpperCase())+'</div>'+
      '<div class="sd-sheet-model">'+esc(s.series+(s.gen?' '+s.gen:''))+'</div>'+
      '<div class="sd-sheet-tier">'+esc(s.tier)+'</div>'+
    '</div>'+rows+
  '</div>';
}
// Generalized product explorer (tiles → spec sheet). Reads seg.products / intro / note.
function productsExplorer(seg){
  var items = seg.products;
  var h = '<p class="ovlr-money-p">'+seg.productsIntro+'</p>';
  h += '<div class="sd-wrap">'+
    '<div class="sd-grid">'+items.map(sdTile).join('')+'</div>'+
    '<div class="sd-sheet-wrap" id="qcSdSheet_'+seg.key+'">'+specSheet(items[0])+'</div>'+
  '</div>';
  if (seg.productsNote) h += '<div class="ovlr-money-note">'+seg.productsNote+'</div>';
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

// Region palette — a segment's `regions` list picks keys from here; colours the
// card border / legend / detail dot inline (so segments aren't limited to 3 buckets).
var REGION_COL = { china:'#E4002B', usa:'#2E5CE6', row:'#1B9E5F', eu:'#F2A900', asia:'#7A5AF8', mideast:'#0FA3A3' };
function regColor(rk){ return REGION_COL[rk] || '#8A93A0'; }
function regLabel(seg, rk){ var r = (seg.regions||[]).filter(function(x){ return x.key===rk; })[0]; return r ? r.label : rk; }

function clLogo(c, cls){
  // Real brand logo via Google's favicon service (CSP-allows *.gstatic.com); the
  // monogram behind it shows if the logo fails to load.
  var fav = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=https://'+esc(c.domain);
  return '<span class="cl-logo '+(cls||'')+'"><span class="cl-mono" style="background:'+c.col+'">'+esc(c.mono)+'</span>'+
    (c.domain ? '<img src="'+fav+'" alt="'+esc(c.name)+'" loading="lazy" onerror="this.remove()">' : '')+'</span>';
}
function clientCard(c, i){
  return '<button type="button" class="cl-card'+(i===0?' active':'')+'" data-cl="'+esc(c.id)+'" style="border-color:'+regColor(c.region)+'" aria-label="'+esc(c.name)+'">'+
    clLogo(c)+'<span class="cl-name">'+esc(c.name)+'</span></button>';
}
function clSec(title, body){ return body ? '<div class="cl-sec"><div class="cl-sec-h">'+esc(title)+'</div><p class="cl-sec-p">'+body+'</p></div>' : ''; }
function clientDetail(c, seg){
  return '<div class="cl-detail">'+
    '<div class="cl-detail-head">'+clLogo(c, 'lg')+
      '<div><div class="cl-detail-name">'+esc(c.name)+'</div>'+
        '<div class="cl-detail-tag"><span class="cl-region-dot" style="background:'+regColor(c.region)+'"></span>'+esc(regLabel(seg, c.region))+' · '+esc(c.tag)+'</div></div>'+
    '</div>'+
    clSec('The relationship', c.relationship)+
    clSec('What they buy', c.buys)+
    clSec('How the contract is structured', c.contract)+
    clSec('Notable / risk', c.notes)+
  '</div>';
}
function clientsBody(seg){
  var legend = (seg.regions||[]).map(function(r){
    return '<span class="cl-lg"><i style="border-color:'+regColor(r.key)+'"></i>'+esc(r.label)+'</span>';
  }).join('');
  return '<p class="ovlr-money-p">'+seg.clientsIntro+'</p>'+
    '<div class="cl-legend">'+legend+'</div>'+
    '<div class="cl-grid">'+seg.clients.map(clientCard).join('')+'</div>'+
    '<div class="cl-detail-wrap" id="qcClDetail_'+seg.key+'">'+clientDetail(seg.clients[0], seg)+'</div>';
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
// Generalized competitors view: a share-bar chart + a "how each rival competes" table.
function segCompetitorsBody(seg){
  var col4 = seg.compCol4 || 'Flagship product';
  var h = '<p class="ovlr-money-p">'+seg.competitorsIntro+'</p>';
  if (seg.share && seg.share.length){
    h += '<div class="ms-sub">'+esc(seg.shareSub || 'Market share — estimated')+'</div>';
    h += '<div class="ms-chart">'+seg.share.map(function(m){
      return '<div class="ms-row"><div class="ms-name">'+esc(m.name)+'</div>'+
        '<div class="ms-bar"><div class="ms-fill'+(m.self?' self':'')+'" style="width:'+m.pct+'%'+(m.self?'':';background:'+m.col)+'"></div></div>'+
        '<div class="ms-pct">'+esc(m.label != null ? m.label : m.pct+'%')+'</div></div>';
    }).join('')+'</div>';
    if (seg.shareNote) h += '<div class="ovlr-money-note">'+seg.shareNote+'</div>';
  }
  h += '<div class="ms-sub" style="margin-top:22px">How each rival competes</div>';
  h += '<div style="overflow-x:auto"><table class="ov-table" style="min-width:720px"><thead><tr>'+
    '<th>Competitor</th><th>Type</th><th>Where it competes</th><th>'+esc(col4)+'</th><th>Est. share</th><th>Qualcomm’s edge</th>'+
    '</tr></thead><tbody>'+seg.compRows.map(function(r){
      return '<tr><td class="ov-td-name">'+esc(r.name)+'</td><td>'+esc(r.type)+'</td><td>'+esc(r.arena)+'</td>'+
        '<td>'+esc(r.flagship)+'</td><td>'+esc(r.share)+'</td><td>'+r.vs+'</td></tr>';
    }).join('')+'</tbody></table></div>';
  if (seg.tableNote) h += '<div class="ovlr-money-note">'+seg.tableNote+'</div>';
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
function advantageBody(seg){
  return '<p class="ovlr-money-p">'+seg.advIntro+'</p>'+
    '<div class="adv-grid">'+seg.adv.map(advCard).join('')+'</div>';
}

// ── Numbers — interactive revenue chart (year-range slider, YoY & CAGR), per segment.
// Each segment carries its own `numData` (revenue $B + QCT-margin %); state and DOM ids
// are keyed by seg.key so all four segment panes coexist without colliding.
function numYear(fy){ return parseInt(String(fy).replace(/[^0-9]/g, ''), 10); }
var NUM_ST = {};   // seg.key -> { start, end, margin, yoy, chart }
function numState(seg){
  if (!NUM_ST[seg.key]){ var n = seg.numData.length;
    // Default window hides the trailing projection, except when numFullRange is set
    // (segments like Data Center whose whole story IS the ramp to the target).
    var end = seg.numFullRange ? (n-1) : Math.max(0, n-2);
    NUM_ST[seg.key] = { start:0, end:end, margin:(seg.numHasMargin !== false), yoy:true, chart:null }; }
  return NUM_ST[seg.key];
}
function numIds(seg){ var k = seg.key; return { chips:'qcNumChips_'+k, chart:'qcNumChart_'+k, slider:'qcNumSlider_'+k, cagr:'qcNumCagr_'+k }; }
// Bar-top labels ($ value + YoY) — reads visibility off the chart instance (per-seg).
var numBarLabels = { id:'numBarLabels', afterDatasetsDraw:function(chart){
  var ctx = chart.ctx, ds = chart.data.datasets[0], meta = chart.getDatasetMeta(0);
  var yoy = chart.$yoy || [], rows = chart.$rows || [], showYoY = chart.$showYoY;
  meta.data.forEach(function(bar, i){
    ctx.save(); ctx.textAlign = 'center';
    ctx.font = '700 12px Inter, sans-serif'; ctx.fillStyle = (rows[i] && rows[i].proj) ? '#B7791F' : '#1E2733';
    ctx.fillText('$'+Number(ds.data[i]).toFixed(1)+'B', bar.x, bar.y - 20);
    if (showYoY && yoy[i] != null){ var up = yoy[i] >= 0;
      ctx.font = '700 10.5px Inter, sans-serif'; ctx.fillStyle = up ? '#1E9E62' : '#C0392B';
      ctx.fillText((up?'+':'')+yoy[i].toFixed(0)+'%', bar.x, bar.y - 6); }
    ctx.restore();
  });
}};
function numbersBody(seg){
  var id = numIds(seg);
  var chips = '';
  if (seg.numHasMargin !== false)
    chips += '<button type="button" class="ovlr-mg-chip on" data-num="margin" style="--mg:#00A9CE"><span class="ovlr-mg-dot"></span>'+esc(seg.numMarginChip || 'Operating margin')+'</button>';
  chips += '<button type="button" class="ovlr-mg-chip on" data-num="yoy" style="--mg:#1B9E5F"><span class="ovlr-mg-dot"></span>YoY growth</button>';
  return '<p class="ovlr-money-p">'+seg.numIntro+'</p>'+
    '<div class="ovlr-mg-chips" id="'+id.chips+'">'+chips+'</div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">'+seg.numTitle+' <span>· $B · drag the slider to change years</span></div>'+
    '<div class="ov-chart-wrap ovs-tall"><canvas id="'+id.chart+'"></canvas></div></div>'+
    '<div class="ovlr-mg-slider" id="'+id.slider+'"></div>'+
    '<div class="num-cagr" id="'+id.cagr+'"></div>'+
    '<div class="ovlr-money-note">'+seg.numNote+'</div>';
}
function renderNumSlider(seg){
  var id = numIds(seg), st = numState(seg), d = seg.numData;
  var el = document.getElementById(id.slider); if (!el) return;
  var n = d.length; if (n < 2){ el.innerHTML = ''; return; }
  var pos = function(i){ return (i/(n-1))*100; };
  var lp = pos(st.start), rp = pos(st.end);
  var ticks = d.map(function(r, i){ var on = (i>=st.start && i<=st.end);
    return '<span class="ovlr-mg-tick'+(on?' in':'')+(r.proj?' proj':'')+'">'+esc(r.fy)+'</span>'; }).join('');
  el.innerHTML = '<div class="ovlr-mg-rail"><div class="ovlr-mg-fill" style="left:'+lp+'%;right:'+(100-rp)+'%"></div>'+
    '<span class="ovlr-mg-handle" data-h="start" style="left:'+lp+'%" role="slider" tabindex="0" aria-label="range start"></span>'+
    '<span class="ovlr-mg-handle" data-h="end" style="left:'+rp+'%" role="slider" tabindex="0" aria-label="range end"></span></div>'+
    '<div class="ovlr-mg-ticks">'+ticks+'</div>';
}
function wireNumSlider(scope, seg){
  var id = numIds(seg), st = numState(seg), d = seg.numData;
  var slider = scope.querySelector('#'+id.slider); if (!slider || slider._w) return; slider._w = 1;
  var drag = null;
  function idxFromX(x){ var rail = slider.querySelector('.ovlr-mg-rail'); if (!rail) return st.start;
    var rect = rail.getBoundingClientRect(); var f = (x-rect.left)/Math.max(1, rect.width);
    return Math.round(Math.max(0, Math.min(1, f)) * (d.length-1)); }
  slider.addEventListener('pointerdown', function(e){
    var h = e.target.closest('.ovlr-mg-handle');
    if (h){ drag = { which:h.getAttribute('data-h') }; }
    else if (e.target.closest('.ovlr-mg-fill')){ drag = { which:'pan', anchor:idxFromX(e.clientX), s0:st.start, e0:st.end }; }
    else { var i = idxFromX(e.clientX);
      if (Math.abs(i-st.start) <= Math.abs(i-st.end)) st.start = Math.min(i, st.end-1); else st.end = Math.max(i, st.start+1);
      renderNumSlider(seg); buildNumbersChart(seg); return; }
    try { slider.setPointerCapture(e.pointerId); } catch(_){ } e.preventDefault();
  });
  slider.addEventListener('pointermove', function(e){ if (!drag) return; var i = idxFromX(e.clientX), n = d.length;
    if (drag.which === 'start') st.start = Math.max(0, Math.min(i, st.end-1));
    else if (drag.which === 'end') st.end = Math.min(n-1, Math.max(i, st.start+1));
    else if (drag.which === 'pan'){ var w = drag.e0-drag.s0, ns = Math.max(0, Math.min(drag.s0 + (i-drag.anchor), n-1-w)); st.start = ns; st.end = ns+w; }
    renderNumSlider(seg); buildNumbersChart(seg);
  });
  function end(e){ if (drag){ try { slider.releasePointerCapture(e.pointerId); } catch(_){ } drag = null; } }
  slider.addEventListener('pointerup', end); slider.addEventListener('pointercancel', end);
}
function updateNumCagr(seg, rows){
  var el = document.getElementById(numIds(seg).cagr); if (!el) return;
  var actuals = rows.filter(function(r){ return !r.proj; });
  var html = '';
  if (actuals.length >= 2){
    var a = actuals[0], b = actuals[actuals.length-1], steps = numYear(b.fy) - numYear(a.fy);
    var cagr = steps > 0 ? (Math.pow(b.rev/a.rev, 1/steps) - 1) * 100 : 0;
    html += '<span class="num-cagr-item"><b>'+(cagr>=0?'+':'')+cagr.toFixed(1)+'%</b> CAGR · '+esc(a.fy)+' → '+esc(b.fy)+'</span>';
  }
  var projs = rows.filter(function(r){ return r.proj; }), proj = projs[projs.length-1];  // last projection = the target endpoint
  if (proj && actuals.length){
    var last = actuals[actuals.length-1], steps2 = numYear(proj.fy) - numYear(last.fy);
    var cagr2 = steps2 > 0 ? (Math.pow(proj.rev/last.rev, 1/steps2) - 1) * 100 : 0;
    html += '<span class="num-cagr-item alt"><b>'+(cagr2>=0?'+':'')+cagr2.toFixed(1)+'%</b> / yr to '+esc(proj.fy)+' '+esc(seg.numTargetWord || 'target')+'</span>';
  }
  el.innerHTML = html;
}
function buildNumbersChart(seg){
  var id = numIds(seg), st = numState(seg), d = seg.numData;
  var cv = document.getElementById(id.chart);
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return;
  if (st.chart){ st.chart.destroy(); st.chart = null; }
  var rows = d.slice(st.start, st.end + 1);
  var yoy = rows.map(function(r, i){
    var gi = st.start + i; if (gi === 0 || r.proj) return null;
    var prev = d[gi-1]; if (!prev.rev || (numYear(r.fy) - numYear(prev.fy)) !== 1) return null;
    return (r.rev/prev.rev - 1) * 100;
  });
  var barColors = rows.map(function(r){ return r.proj ? '#F2A900' : '#3253DC'; });
  var datasets = [{ type:'bar', label:(seg.numBarLabel || 'Revenue ($B)'), data:rows.map(function(r){ return r.rev; }),
    backgroundColor:barColors, borderRadius:6, maxBarThickness:64, yAxisID:'y', order:2 }];
  var showMargin = st.margin && seg.numHasMargin !== false;
  if (showMargin) datasets.push({ type:'line', label:(seg.numMarginLabel || 'Operating margin (%)'), data:rows.map(function(r){ return r.margin; }),
    borderColor:'#00A9CE', backgroundColor:'#00A9CE', borderWidth:2.5, tension:.3, yAxisID:'y1', order:1,
    pointRadius:rows.map(function(r){ return r.proj ? 5 : 4; }), pointHoverRadius:6,
    pointStyle:rows.map(function(r){ return r.proj ? 'rectRot' : 'circle'; }),
    segment:{ borderDash:function(ctx){ return (rows[ctx.p1DataIndex] && rows[ctx.p1DataIndex].proj) ? [5,4] : undefined; } } });
  st.chart = new Chart(cv.getContext('2d'), {
    data:{ labels:rows.map(function(r){ return r.fy; }), datasets:datasets },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      layout:{ padding:{ top:30 } },
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:true, position:'bottom', labels:{ usePointStyle:true, font:{size:12} } },
        tooltip:{ callbacks:{ title:function(it){ var l=it[0].label; return /E$/.test(l) ? l+' · target' : l; },
          label:function(ctx){ return ctx.dataset.yAxisID==='y1'
            ? ' '+ctx.dataset.label+': '+ctx.parsed.y+'%' : ' '+ctx.dataset.label+': $'+Number(ctx.parsed.y).toFixed(1)+'B'; } } } },
      scales:{
        y:{ position:'left', beginAtZero:true, title:{ display:true, text:'Revenue ($B)', color:'#5b6470' },
          grid:{ color:'rgba(0,0,0,.05)' }, ticks:{ color:'#8A93A0', callback:function(v){ return '$'+v+'B'; } } },
        y1:{ position:'right', min:0, max:(seg.numMarginMax || 50), display:showMargin, title:{ display:true, text:'Operating margin (%)', color:'#5b6470' },
          grid:{ display:false }, ticks:{ color:'#8A93A0', callback:function(v){ return v+'%'; } } },
        x:{ grid:{ display:false }, ticks:{ color:'#8A93A0', font:{ weight:'600' } } }
      } },
    plugins:[numBarLabels]
  });
  st.chart.$rows = rows; st.chart.$yoy = yoy; st.chart.$showYoY = st.yoy;
  updateNumCagr(seg, rows);
}

// Attach each handset OEM's home region onto the client objects (used by the generalized
// clients view). Done once at module-eval; harmless if re-run.
CLIENTS.forEach(function(c){ if (!c.region) c.region = CL_REGION[c.id] || 'row'; });

// ═══════════════════════════════════════════════════════════════════════════
// SEG — per-segment deep-dive content (Products · Clients · Competitors ·
// Competitive Advantage · Numbers). Handsets reuses the arrays defined above;
// IoT / Automotive / Data Center are built out here. Revenue in $B; "margin" is
// the QCT segment EBT margin (per-category margin is not disclosed by Qualcomm).
// ═══════════════════════════════════════════════════════════════════════════
var QCT_MARGIN = { 2021:28.7, 2022:34.1, 2023:26.1, 2024:28.7, 2025:30.4, 2029:30 };  // QCT EBT %
var SEG = {
  handsets: {
    key:'handsets', label:'Handsets',
    productsIntro:'Snapdragon chips for smartphones, sold across tiers from flagship to entry. Tap a Snapdragon series to see its characteristics.',
    productsNote:'Snapdragon mobile platforms by tier. The <b>Snapdragon 6 Gen 4</b> figures match Qualcomm’s spec sheet; other tiers are representative and should be verified before publishing.',
    products: SNAPDRAGON,
    clientsIntro:'Who buys Snapdragon for phones. The card border shows the OEM’s home region. Tap a client to see the relationship, what they buy and how the contract is structured.',
    regions:[ {key:'china',label:'China'}, {key:'usa',label:'United States'}, {key:'row',label:'Rest of World'} ],
    clients: CLIENTS,
    competitorsIntro:'Who competes with Snapdragon in smartphones — and where. By <b>volume</b> MediaTek leads; but in the <b>premium / merchant</b> tier (the profitable end, phones over ~$400), Qualcomm holds the majority. Apple, Samsung, Google and Huawei make chips only for their own phones (captive), so they take volume but don’t sell to other OEMs.',
    shareSub:'Mobile SoC market — estimated unit share',
    shareNote:'Approximate global smartphone SoC / application-processor unit share (industry estimates; varies by quarter). <b>Premium lens:</b> among merchant chips in phones &gt;$400, Qualcomm — not MediaTek — holds the majority.',
    share: MSHARE, compCol4:'Flagship SoC', compRows: COMPETE_ROWS,
    tableNote:'On <b>modems</b> specifically, Qualcomm leads the merchant 5G market; Apple is bringing its modem in-house, and MediaTek, Samsung and UNISOC supply their own.',
    advIntro:'Why Snapdragon wins in phones — the advantages rivals find hardest to copy. Tap a card to see why it’s defensible.',
    adv: ADV,
    numIntro:'Handsets revenue and how it has grown. Drag the <b>range slider</b> to widen or shift the years; toggle the operating-margin line and YoY labels. The readout shows the <b>CAGR</b> for the selected range.',
    numTitle:'Handsets revenue &amp; margin', numBarLabel:'Handsets revenue ($B)', numMarginLabel:'QCT operating margin (%)',
    numNote:'Handsets = QCT Handsets-category revenue. <b>FY2024 &amp; FY2025 reported</b>; FY2021–FY2023 are approximate (verify vs older 10-Ks). Operating margin is the <b>QCT segment</b> EBT margin (per-category margin is not disclosed). <b>FY2029E</b> = Investor Day target (~5% Android-handset CAGR, 30% QCT margin) — not a forecast.',
    numData:[
      { fy:'FY2021', rev:20.8, margin:29 },
      { fy:'FY2022', rev:28.4, margin:33 },
      { fy:'FY2023', rev:24.0, margin:28 },
      { fy:'FY2024', rev:24.9, margin:29 },
      { fy:'FY2025', rev:27.8, margin:30 },
      { fy:'FY2029E', rev:33.8, margin:30, proj:true },
    ]
  },

  // ─────────────────────────────── IoT ───────────────────────────────
  iot: {
    key:'iot', label:'IoT',
    productsIntro:'One low-power portfolio for everything that is not a phone or a car — PCs, XR/glasses, industrial, networking and robotics (the Dragonwing brand). Tap a platform to see its characteristics.',
    productsNote:'Representative platforms across IoT’s sub-verticals; NPU TOPS, cores and process nodes per Qualcomm product pages / CES 2026. IoT spans ~12 verticals — this is a selection, not the full catalogue.',
    products:[
      { id:'x2elite', brand:'Snapdragon', series:'X2 Elite', tier:'AI PC · 2026', specs:[
        { ic:'cpu',   t:'Oryon CPU (3rd gen)', d:'Up to 18 cores (12 Prime + 6 Perf), up to 5.0 GHz' },
        { ic:'npu',   t:'Hexagon NPU · 80 TOPS', d:'Leading on-device AI for Copilot+ PCs' },
        { ic:'gpu',   t:'Adreno X2-90 GPU', d:'New-generation integrated graphics' },
        { ic:'fab',   t:'3nm process', d:'TSMC N3' },
        { ic:'screen',t:'Windows-on-Arm', d:'All-day battery vs x86; premium AI laptops' },
      ]},
      { id:'xelite', brand:'Snapdragon', series:'X Elite', tier:'AI PC · installed base', specs:[
        { ic:'cpu',   t:'Oryon CPU (1st gen)', d:'12 cores — the current Copilot+ PC installed base' },
        { ic:'npu',   t:'Hexagon NPU · 45 TOPS', d:'Meets the Copilot+ 40-TOPS bar' },
        { ic:'fab',   t:'4nm process', d:'The 2024 platform, shipping across OEMs' },
        { ic:'screen',t:'Windows-on-Snapdragon', d:'Dell, HP, Lenovo, Asus, Samsung laptops' },
      ]},
      { id:'xr2', brand:'Snapdragon', series:'XR2+ Gen 2', tier:'XR headsets', specs:[
        { ic:'xr',    t:'Mixed-reality SoC', d:'Powers Samsung Galaxy XR & Meta Quest-class headsets' },
        { ic:'npu',   t:'Up to 8× AI-per-watt', d:'vs XR2 Gen 1 — on-device passthrough AI' },
        { ic:'screen',t:'Dual-3K displays', d:'Up to 10 concurrent cameras, 12ms passthrough' },
        { ic:'gpu',   t:'2.5× GPU', d:'vs prior generation' },
      ]},
      { id:'ar1', brand:'Snapdragon', series:'AR1 Gen 1', tier:'Smart glasses', specs:[
        { ic:'xr',    t:'Smart-glasses SoC', d:'Powers Ray-Ban Meta glasses' },
        { ic:'cam',   t:'14-bit ISP · 12MP', d:'On-glasses capture + visual search' },
        { ic:'npu',   t:'Hexagon NPU', d:'On-device AI: translation, visual AI, assistant' },
        { ic:'power', t:'Ultra-low power', d:'Thermally-constrained all-day wear' },
      ]},
      { id:'dragonwing', brand:'Dragonwing', series:'IQ Series', tier:'Industrial · robotics', specs:[
        { ic:'robot', t:'Physical-AI compute', d:'IQ-X industrial PCs → IQ10 for humanoid robotics' },
        { ic:'npu',   t:'Up to 700 TOPS', d:'Vision-language & autonomous edge (IQ10)' },
        { ic:'cpu',   t:'Oryon CPU · up to 18 cores', d:'Industrial temp −40°C to 105°C (IQ-X)' },
        { ic:'chip',  t:'Win 11 IoT / CODESYS', d:'PLCs, edge controllers, industrial handhelds' },
      ]},
      { id:'netpro', brand:'Dragonwing', series:'Networking Pro', tier:'Wi-Fi 7 networking', specs:[
        { ic:'wifi',  t:'Wi-Fi 7 platforms', d:'Scalable up to 16-stream, 6 GHz, multi-link' },
        { ic:'signal',t:'Enterprise & carrier', d:'Access points, mesh, fixed-wireless' },
        { ic:'link',  t:'Integrated connectivity', d:'One-vendor modem + Wi-Fi + compute BOM' },
      ]},
    ],
    clientsIntro:'Who builds on Qualcomm IoT silicon — from Windows-on-Snapdragon PC makers to XR, robotics and the developer edge. Tap a customer to see the relationship.',
    regions:[ {key:'usa',label:'United States'}, {key:'china',label:'China'}, {key:'row',label:'Rest of World'} ],
    clients:[
      { id:'microsoft', name:'Microsoft', domain:'microsoft.com', mono:'MS', col:'#2E7D32', region:'usa', tag:'Windows-on-Snapdragon partner',
        relationship:'The anchor of Qualcomm’s PC push — Microsoft co-engineers <b>Windows-on-Snapdragon</b> and defined the <b>Copilot+ PC</b> category around Snapdragon’s 40+ TOPS NPU.',
        buys:'Deep OS + platform co-engineering; Snapdragon X was the launch silicon for Copilot+ PCs.',
        contract:'Strategic co-marketing / co-engineering per Windows generation — not a per-unit chip sale but the gate to the whole Arm-PC ecosystem.',
        notes:'x86 (Intel/AMD) now also ship Copilot+ parts — Qualcomm’s first-mover Arm advantage narrows as rivals catch the NPU bar.' },
      { id:'dell', name:'Dell', domain:'dell.com', mono:'DE', col:'#007DB8', region:'usa', tag:'PC OEM',
        relationship:'A launch PC OEM for Snapdragon X (XPS / Latitude).', buys:'Snapdragon X Elite / Plus in consumer & commercial laptops.',
        contract:'Per-model design wins; co-marketed as Copilot+ PCs.' },
      { id:'hp', name:'HP', domain:'hp.com', mono:'HP', col:'#0096D6', region:'usa', tag:'PC OEM',
        relationship:'Ships Snapdragon X across its OmniBook line.', buys:'Snapdragon X Elite / Plus AI laptops.', contract:'Per-model design wins.' },
      { id:'lenovo', name:'Lenovo', domain:'lenovo.com', mono:'LE', col:'#E2231A', region:'china', tag:'PC OEM',
        relationship:'Snapdragon X across ThinkPad / Yoga / Slim.', buys:'Snapdragon X Elite / Plus.', contract:'Per-model design wins.' },
      { id:'asus', name:'Asus', domain:'asus.com', mono:'AS', col:'#1C3D6E', region:'row', tag:'PC OEM (Taiwan)',
        relationship:'Zenbook / Vivobook on Snapdragon X.', buys:'Snapdragon X Elite / Plus.', contract:'Per-model design wins.' },
      { id:'samsung', name:'Samsung', domain:'samsung.com', mono:'SS', col:'#1428A0', region:'row', tag:'PC + XR OEM',
        relationship:'A dual IoT customer: Galaxy Book PCs on Snapdragon X <b>and</b> the <b>Galaxy XR</b> headset on Snapdragon XR2+ Gen 2 — the first Android XR device.',
        buys:'Snapdragon X (PCs) + Snapdragon XR2+ Gen 2 (Galaxy XR).', contract:'Per-model design wins across PC and XR lines.' },
      { id:'meta', name:'Meta', domain:'meta.com', mono:'MT', col:'#0866FF', region:'usa', tag:'Flagship XR / AR customer',
        relationship:'Qualcomm’s flagship XR partner — Snapdragon powers <b>Quest</b> headsets (XR2 Gen 2) and <b>Ray-Ban Meta</b> glasses (AR1).',
        buys:'Snapdragon XR2 Gen 2 (Quest) and AR1 Gen 1 (smart glasses).',
        contract:'Multi-year platform collaboration + per-device silicon; Meta is also exploring custom silicon — the long-term in-sourcing risk.',
        notes:'The single most important XR relationship; Meta’s own-silicon ambitions are the key watch-item.' },
      { id:'google', name:'Google', domain:'google.com', mono:'GO', col:'#4285F4', region:'usa', tag:'Android XR partner',
        relationship:'Platform partner for <b>Android XR</b>, the OS layer for the next wave of headsets and glasses.', buys:'Reference-platform silicon for Android XR devices.', contract:'Ecosystem / platform partnership.' },
      { id:'arduino', name:'Arduino', domain:'arduino.cc', mono:'AR', col:'#00979D', region:'row', tag:'Owned subsidiary',
        relationship:'<b>Acquired by Qualcomm (Oct 2025)</b> — a ~33M-strong developer community that becomes a funnel into Dragonwing edge-AI silicon (Arduino UNO Q).',
        buys:'Now a wholly-owned dev-ecosystem subsidiary rather than a customer.', contract:'Owned; complements the Edge Impulse / Foundries.io / Modular software stack.',
        notes:'Strategic developer-reach play — turns hobbyist/edge developers into Qualcomm-silicon designers.' },
      { id:'advantech', name:'Advantech', domain:'advantech.com', mono:'AD', col:'#C8102E', region:'row', tag:'Industrial partner (Taiwan)',
        relationship:'An industrial-computing partner shipping Dragonwing edge-AI modules.', buys:'Dragonwing IQ industrial / edge-AI modules.', contract:'Mostly indirect — via 35+ distributors and 45+ system integrators.' },
    ],
    competitorsIntro:'IoT has no single rival — it is a different fight in each vertical. The clearest battleground is the <b>PC</b>, where Snapdragon X is Qualcomm’s Arm assault on x86. In XR Qualcomm is the incumbent merchant SoC; in industrial / edge it is a challenger to entrenched embedded vendors.',
    shareSub:'Windows PC processor share — estimated (Qualcomm’s Arm beachhead)',
    shareNote:'Approximate Windows-PC CPU share (analyst estimates). Qualcomm’s Arm share is low-single-digit of all Windows PCs but higher (~10–15%) among Copilot+/AI PCs. IoT overall spans ~12 verticals — this PC lens is one slice.',
    share:[
      { name:'Intel', pct:66, col:'#0068B5' },
      { name:'AMD', pct:24, col:'#ED1C24' },
      { name:'Qualcomm (Arm)', pct:8, self:true },
      { name:'Others', pct:2, col:'#C9CFD6' },
    ],
    compCol4:'Key products',
    compRows:[
      { name:'Intel', type:'Merchant', arena:'PC (x86) — the incumbent', flagship:'Core Ultra (Lunar Lake)', share:'~66%',
        vs:'Snapdragon X counters on <b>battery life</b> and NPU TOPS; Intel’s installed base + x86 compatibility remain the moat.' },
      { name:'AMD', type:'Merchant', arena:'PC (x86), Ryzen AI', flagship:'Ryzen AI 300', share:'~24%',
        vs:'Also chasing the AI-PC NPU bar; strong in gaming / performance x86.' },
      { name:'Apple Silicon', type:'Captive', arena:'Mac only (not Windows)', flagship:'M-series', share:'—',
        vs:'Not a Windows merchant, but sets the Arm perf-per-watt bar Snapdragon is measured against.' },
      { name:'MediaTek', type:'Merchant', arena:'XR, entry compute', flagship:'Dimensity / XR', share:'—',
        vs:'Emerging XR rival and a Chromebook/entry player; Qualcomm leads premium XR & PC.' },
      { name:'NXP · TI · Renesas', type:'Merchant', arena:'Industrial / embedded (MCU)', flagship:'i.MX / Sitara / RA', share:'fragmented',
        vs:'Embedded incumbents; Dragonwing brings smartphone-class <b>edge-AI compute</b> they lack.' },
      { name:'NVIDIA Jetson', type:'Merchant', arena:'High-compute edge / robotics', flagship:'Jetson Orin / Thor', share:'—',
        vs:'Leads high-wattage edge AI; Dragonwing targets <b>lower-power</b> physical-AI and cost.' },
      { name:'Ambarella', type:'Merchant', arena:'Edge vision AI', flagship:'CVflow', share:'—',
        vs:'Vision-specialist niche; Qualcomm competes with a broader integrated platform.' },
    ],
    tableNote:'IoT is deliberately fragmented — Qualcomm’s thesis is that one low-power compute + edge-AI + connectivity portfolio wins share across all of these verticals at once.',
    advIntro:'Why Qualcomm can win beyond the phone — the edge-AI advantages that travel across PC, XR, industrial and robotics. Tap a card to see why it’s defensible.',
    adv:[
      { ic:'🔋', title:'Low-power compute + edge AI', stat:'Mobile perf-per-watt heritage',
        body:'Qualcomm’s smartphone DNA — leading performance-per-watt from the Oryon CPU + Hexagon NPU — is exactly what battery- and thermally-constrained edge devices and smart glasses need.' },
      { ic:'💻', title:'Oryon CPU in the PC', stat:'The credible Arm challenger to x86',
        body:'Snapdragon X is the only credible Arm alternative to Apple Silicon on Windows, bringing all-day battery and NPU-TOPS leadership (80 TOPS on X2 Elite) into a market Intel and AMD have owned for decades.' },
      { ic:'🛠️', title:'Developer & far-edge ecosystem', stat:'Arduino ~33M + Edge Impulse',
        body:'Owning Arduino (~33M developers), Edge Impulse and Foundries.io — plus the Modular software stack — creates a full edge-AI developer funnel that pure-silicon rivals simply don’t have.' },
      { ic:'🔗', title:'Integrated connectivity', stat:'Modem + Wi-Fi 7 + BT on one platform',
        body:'Qualcomm bundles the modem, Wi-Fi 7/8, Bluetooth, RFFE and compute on one platform — a one-stop bill-of-materials advantage across IoT devices that need to connect.' },
      { ic:'🧩', title:'Breadth across ~12 verticals', stat:'One roadmap, shared R&D',
        body:'A single scalable Snapdragon / Dragonwing roadmap spans PC, XR, wearables, industrial, networking, robotics and drones — diversification plus R&D leverage amortised across handsets.' },
      { ic:'🥽', title:'XR silicon incumbency', stat:'De-facto standalone-headset SoC',
        body:'Snapdragon is the default SoC for standalone headsets and smart glasses (Meta, Samsung), with reference designs that lower OEM entry cost and lock in the ecosystem.' },
    ],
    numIntro:'IoT revenue and how it has grown. Drag the <b>range slider</b> to change the years; toggle the operating-margin line and YoY labels. The readout shows the <b>CAGR</b> for the selected range.',
    numTitle:'IoT revenue &amp; margin', numBarLabel:'IoT revenue ($B)', numMarginLabel:'QCT operating margin (%)',
    numNote:'IoT = QCT IoT-category revenue. FY2021–FY2024 <b>reported</b>; FY2025 (~$6.6B) is <b>derived</b> from reported QCT total less Handsets & Automotive (verify vs the final FY2025 10-K). <b>Note:</b> FY2021–FY2022 included the separate RFFE category (reallocated into IoT/Handsets/Auto from FY2023), so the FY2022→FY2023 step is partly a reclassification. Operating margin is the <b>QCT segment</b> EBT margin. <b>FY2029E</b> = Investor Day target ($14B+; non-handset revenue targeted to ~$40B by FY2029) — not a forecast.',
    numData:[
      { fy:'FY2021', rev:5.06, margin:28.7 },
      { fy:'FY2022', rev:6.95, margin:34.1 },
      { fy:'FY2023', rev:5.94, margin:26.1 },
      { fy:'FY2024', rev:5.42, margin:28.7 },
      { fy:'FY2025', rev:6.62, margin:30.4 },
      { fy:'FY2029E', rev:14.0, margin:30, proj:true },
    ]
  },

  // ─────────────────────────── Automotive ───────────────────────────
  auto: {
    key:'auto', label:'Automotive',
    productsIntro:'The <b>Snapdragon Digital Chassis</b> — one scalable platform spanning the cockpit, assisted/autonomous driving, connectivity and the cloud. Tap a pillar to see its characteristics.',
    productsNote:'The four Digital Chassis pillars. Specs per Qualcomm product pages / CES; Cockpit Elite & Ride Flex figures are Qualcomm-stated. Qualcomm brands the top cockpit tier "Elite" (not "Gen 4").',
    products:[
      { id:'cockpit-elite', brand:'Snapdragon', series:'Cockpit Elite', tier:'In-cabin · SDV', specs:[
        { ic:'cpu',   t:'Custom Oryon CPU', d:'~3× faster CPU vs prior flagship cockpit generation' },
        { ic:'npu',   t:'Up to 12× AI performance', d:'Multi-modal generative-AI assistant (Gemini)' },
        { ic:'screen',t:'Many high-res displays', d:'Cluster + IVI + passenger + pillar-to-pillar' },
        { ic:'car',   t:'Software-defined cockpit', d:'Selected by Mercedes-Benz, Li Auto and others' },
      ]},
      { id:'cockpit3', brand:'Snapdragon', series:'Cockpit (3rd Gen)', tier:'In-cabin · volume', specs:[
        { ic:'chip',  t:'SA8155 / SA8295 class', d:'The current volume cockpit workhorse' },
        { ic:'screen',t:'Multiple displays', d:'Digital cluster, IVI, in-cabin AI' },
        { ic:'car',   t:'Broad OEM adoption', d:'The platform behind most of the ~75–90M shipped cockpits' },
      ]},
      { id:'ride-flex', brand:'Snapdragon', series:'Ride Flex', tier:'Cockpit + ADAS · one chip', specs:[
        { ic:'chip',  t:'SA8775P · 5nm', d:'Industry-first single chip running cockpit + ADAS together' },
        { ic:'npu',   t:'50 → ~2,000 TOPS', d:'Scalable across the family' },
        { ic:'power', t:'Hardware safety island', d:'Mixed-criticality (ASIL) on one SoC' },
        { ic:'car',   t:'In market from MY2025', d:'Cuts automaker BOM & integration complexity' },
      ]},
      { id:'ride-elite', brand:'Snapdragon', series:'Ride Elite', tier:'ADAS / autonomy', specs:[
        { ic:'npu',   t:'Oryon-based high-end Ride', d:'L2+ up to higher autonomy' },
        { ic:'cam',   t:'Ride Vision stack', d:'Front + surround-camera perception' },
        { ic:'robot', t:'End-to-end AD stack', d:'Qualcomm’s automated-driving software' },
      ]},
      { id:'auto-conn', brand:'Snapdragon', series:'Auto Connectivity', tier:'Connected car', specs:[
        { ic:'signal',t:'5G / 5G-Advanced + C-V2X', d:'Qualcomm cites #1 global automotive telematics position' },
        { ic:'wifi',  t:'Wi-Fi / Bluetooth', d:'In-cabin connectivity + precise positioning' },
        { ic:'link',  t:'Telematics / TCU', d:'Software-update pipe for the software-defined vehicle' },
      ]},
      { id:'car2cloud', brand:'Snapdragon', series:'Car-to-Cloud', tier:'Lifecycle services', specs:[
        { ic:'cloud', t:'OTA updates', d:'Over-the-air software & remote diagnostics' },
        { ic:'chip',  t:'Feature-on-demand', d:'Recurring / post-sale monetisation over the vehicle life' },
      ]},
    ],
    clientsIntro:'Automakers and Tier-1 suppliers designing in the Snapdragon Digital Chassis. The card border shows the customer’s home region. Tap a customer to see the relationship.',
    regions:[ {key:'eu',label:'Europe'}, {key:'usa',label:'United States'}, {key:'china',label:'China'}, {key:'asia',label:'Asia (ex-China)'} ],
    clients:[
      { id:'bmw', name:'BMW', domain:'bmw.com', mono:'BM', col:'#1C69D4', region:'eu', tag:'Cockpit + ADAS',
        relationship:'A flagship relationship — BMW is <b>co-developing its ADAS stack with Qualcomm</b> for the next-gen "Neue Klasse" platform.',
        buys:'Snapdragon Cockpit + Snapdragon Ride (jointly-developed automated driving).', contract:'Deep multi-year co-development on central compute.' },
      { id:'mercedes', name:'Mercedes-Benz', domain:'mercedes-benz.com', mono:'MB', col:'#111111', region:'eu', tag:'Cockpit Elite',
        relationship:'Selected the <b>Snapdragon Cockpit Elite</b> tier for future vehicles (MB.OS).', buys:'Cockpit Elite + Ride.', contract:'Design win across future MB.OS models.' },
      { id:'gm', name:'GM', domain:'gm.com', mono:'GM', col:'#0170CE', region:'usa', tag:'Cockpit + ADAS',
        relationship:'Digital cockpit + ADAS compute across GM / Cadillac.', buys:'Snapdragon Cockpit + Ride.', contract:'Multi-year platform design wins.' },
      { id:'stellantis', name:'Stellantis', domain:'stellantis.com', mono:'ST', col:'#1B3A6B', region:'eu', tag:'SmartCockpit',
        relationship:'STLA SmartCockpit built on Snapdragon (14 brands incl. Jeep, Peugeot, Fiat).', buys:'Cockpit + connectivity.', contract:'Group-wide platform design win.' },
      { id:'vw', name:'VW Group', domain:'volkswagen-group.com', mono:'VW', col:'#001E50', region:'eu', tag:'Audi / Porsche (CARIAD)',
        relationship:'Central-compute design wins via CARIAD (Audi, Porsche).', buys:'Ride / Flex ADAS + cockpit.', contract:'Multi-year via CARIAD software unit.' },
      { id:'toyota', name:'Toyota', domain:'toyota.com', mono:'TO', col:'#EB0A1E', region:'asia', tag:'Cockpit + connectivity',
        relationship:'Long-standing IVI / telematics customer (Arene).', buys:'Cockpit + connectivity.', contract:'Multi-generation supply.' },
      { id:'honda', name:'Honda', domain:'honda.com', mono:'HO', col:'#E4002B', region:'asia', tag:'Cockpit (new EVs)',
        relationship:'Snapdragon Cockpit for its new "0 Series" EV line.', buys:'Cockpit + connectivity.', contract:'Design win on the new EV platform.' },
      { id:'geely', name:'Geely', domain:'geely.com', mono:'GE', col:'#0A4C9C', region:'china', tag:'Cockpit + ADAS (ECARX)',
        relationship:'A major China platform partner via ECARX (Zeekr, Lynk & Co).', buys:'Cockpit + Ride.', contract:'Platform partner across the Geely brands.' },
      { id:'liauto', name:'Li Auto', domain:'lixiang.com', mono:'LI', col:'#00499C', region:'china', tag:'Cockpit Elite + Ride Elite',
        relationship:'Selected the Elite tier for future models.', buys:'Cockpit Elite + Ride Elite.', contract:'Design win on next-gen models.' },
      { id:'nio', name:'NIO', domain:'nio.com', mono:'NI', col:'#00BEBE', region:'china', tag:'Digital cockpit',
        relationship:'Digital-cockpit customer among the Chinese EV leaders.', buys:'Cockpit + connectivity.', contract:'Per-platform design wins.' },
      { id:'xiaomi-ev', name:'Xiaomi EV', domain:'mi.com', mono:'MI', col:'#FF6900', region:'china', tag:'In-cabin (SU7)',
        relationship:'Snapdragon in-cabin compute in the SU7 — Xiaomi bridging phone and car.', buys:'Snapdragon Cockpit.', contract:'Design win on Xiaomi’s EV line.' },
      { id:'hyundai', name:'Hyundai / Kia', domain:'hyundai.com', mono:'HY', col:'#002C5F', region:'asia', tag:'Cockpit + connectivity',
        relationship:'IVI / telematics across Hyundai / Kia.', buys:'Cockpit + connectivity.', contract:'Multi-year supply.' },
      { id:'bosch', name:'Bosch', domain:'bosch.com', mono:'BO', col:'#EA0016', region:'eu', tag:'Tier-1 · cockpit + ADAS',
        relationship:'Tier-1 that integrates Snapdragon into cockpit + ADAS domain controllers sold to OEMs.', buys:'Cockpit + Ride silicon inside its modules.', contract:'Tier-1 module supply — an indirect route to many OEMs.' },
      { id:'aptiv', name:'Aptiv', domain:'aptiv.com', mono:'AP', col:'#FF6A00', region:'usa', tag:'Tier-1 · ADAS',
        relationship:'Tier-1 integrating Snapdragon Ride into ADAS platforms.', buys:'Ride silicon inside its ADAS systems.', contract:'Tier-1 integration contracts.' },
      { id:'visteon', name:'Visteon', domain:'visteon.com', mono:'VI', col:'#00A0DF', region:'usa', tag:'Tier-1 · cockpit HPC',
        relationship:'Tier-1 delivering production-ready Cockpit Elite high-performance-compute modules.', buys:'Cockpit Elite silicon inside its HPC modules.', contract:'Tier-1 module supply.' },
    ],
    competitorsIntro:'Automotive is two fights. In the <b>digital cockpit</b> Qualcomm is the clear leader — it dominates <b>premium</b> design wins. In <b>ADAS / autonomy</b> it is a challenger to entrenched Mobileye and premium NVIDIA, differentiating with the cockpit + ADAS fusion of Ride Flex.',
    shareSub:'Automotive digital-cockpit SoC — estimated share (all tiers)',
    shareNote:'Approximate all-tier cockpit-SoC share (third-party estimates, 2025). In <b>premium / high-performance</b> cockpit design wins Qualcomm’s share is far higher — analysts cite ~50%+ (some up to ~80%). ADAS/autonomy is a separate, more contested market.',
    share:[
      { name:'Qualcomm', pct:28, self:true },
      { name:'NXP', pct:22, col:'#0A7CC1' },
      { name:'Renesas', pct:18, col:'#1A3668' },
      { name:'Samsung', pct:8, col:'#1428A0' },
      { name:'Intel', pct:7, col:'#0068B5' },
      { name:'Others', pct:17, col:'#C9CFD6' },
    ],
    compCol4:'Flagship product',
    compRows:[
      { name:'NXP', type:'Merchant', arena:'Cockpit / embedded — the #2', flagship:'i.MX 9', share:'~22%',
        vs:'Broad embedded incumbent; Qualcomm brings higher <b>compute</b> + Oryon CPU + on-device AI to the premium cockpit.' },
      { name:'Renesas', type:'Merchant', arena:'Cockpit / MCU', flagship:'R-Car X5', share:'~18%',
        vs:'Strong in mid-tier IVI & MCUs; Qualcomm leads the high-performance software-defined cockpit.' },
      { name:'Mobileye', type:'Merchant', arena:'ADAS / autonomy', flagship:'EyeQ6', share:'—',
        vs:'Entrenched ADAS leader; Qualcomm counters with cockpit + ADAS <b>integration</b> (Ride Flex) and openness.' },
      { name:'NVIDIA', type:'Merchant', arena:'Premium ADAS / AV compute', flagship:'DRIVE Thor', share:'—',
        vs:'Owns premium AV compute; Qualcomm competes on cockpit+ADAS fusion, power and <b>cost per car</b>.' },
      { name:'Samsung', type:'Merchant', arena:'Cockpit (Exynos Auto)', flagship:'Exynos Auto V9', share:'~8%',
        vs:'A cockpit merchant + captive; Qualcomm’s scale and Oryon roadmap lead premium.' },
      { name:'Tesla · Horizon Robotics', type:'Captive · China', arena:'In-house / China ADAS', flagship:'FSD · Journey 6', share:'—',
        vs:'Tesla in-sources FSD; Horizon leads China ADAS — walled-off rather than merchant threats.' },
    ],
    tableNote:'Qualcomm’s edge is the <b>unified scalable Flex SoC</b>: one chip from L2 cockpit-plus-assist up to L4, with a hardware safety island — reducing the number of vendors and boxes an automaker must integrate.',
    advIntro:'Why Qualcomm is winning the software-defined car — the advantages behind a $65B design-win pipeline. Tap a card to see why it’s defensible.',
    adv:[
      { ic:'🧩', title:'Unified cockpit + ADAS Flex SoC', stat:'One chip, L2 → L4, safety island',
        body:'The Ride Flex SoC runs the cockpit and ADAS together on one mixed-criticality chip with a hardware safety island — an industry first that cuts the automaker’s BOM, box count and integration complexity.' },
      { ic:'📈', title:'Content-per-car growth ~8×', stat:'Gen3 cockpit → Gen5 / Elite + Ride',
        body:'As cars go software-defined, Qualcomm’s dollar content per vehicle grows ~8× across generations — cockpit, ADAS, connectivity and cloud services stacking on one supplier.' },
      { ic:'🚗', title:'Installed base & switching costs', stat:'~75–90M Snapdragon cockpits shipped',
        body:'Tens of millions of vehicles already run Snapdragon cockpits; the reference designs, tooling and OEM software ecosystems built around them create real switching costs.' },
      { ic:'📋', title:'$65B design-win pipeline', stat:'Multi-year revenue visibility',
        body:'Lifetime revenue from contracts already secured stands at ~$65B (raised at the June 2026 Investor Day) — converting into revenue through ~2029 and beyond. Rare forward visibility for a chip business.' },
      { ic:'🌍', title:'70+ automaker relationships', stat:'~40 active design-ins, all regions',
        body:'A broad, geographically diversified base spanning US, Europe, China and Asia — including nearly every premium marque and the leading Chinese EV makers.' },
      { ic:'⚙️', title:'Mobile / compute IP leverage', stat:'Oryon · Adreno · Hexagon · 5G',
        body:'Qualcomm reuses leading-edge nodes, custom Oryon CPU, Adreno GPU, Hexagon NPU and modem leadership across handsets, PC and auto — R&D amortised in a way pure-play auto-chip rivals can’t match.' },
    ],
    numIntro:'Automotive revenue and how it has grown — Qualcomm’s fastest-growing established business. Drag the <b>range slider</b> to change the years; toggle the operating-margin line and YoY labels. The readout shows the <b>CAGR</b> for the selected range.',
    numTitle:'Automotive revenue &amp; margin', numBarLabel:'Automotive revenue ($B)', numMarginLabel:'QCT operating margin (%)',
    numNote:'Automotive = QCT Automotive-category revenue, <b>all reported</b> (Qualcomm 10-K / earnings "QCT revenues by category"). Operating margin is the <b>QCT segment</b> EBT margin (per-category margin is not disclosed). <b>FY2029E</b> = Investor Day target ($10B, raised from $8B), backed by a ~$65B design-win pipeline — not a forecast.',
    numData:[
      { fy:'FY2021', rev:1.11, margin:28.7 },
      { fy:'FY2022', rev:1.51, margin:34.1 },
      { fy:'FY2023', rev:1.87, margin:26.1 },
      { fy:'FY2024', rev:2.91, margin:28.7 },
      { fy:'FY2025', rev:3.96, margin:30.4 },
      { fy:'FY2029E', rev:10.0, margin:30, proj:true },
    ]
  },

  // ─────────────────────────── Data Center ───────────────────────────
  dc: {
    key:'dc', label:'Data Center',
    extraTabs:[ { key:'newtech', label:'New Tech', render:dcNewTechBody } ],
    productsIntro:'The new business (the <b>Dragonfly</b> family): AI inference accelerators, an Oryon server CPU, connectivity IP and open software — a full rack-scale stack aimed at low-cost, energy-efficient AI <b>inference</b>. Tap a product to see its characteristics.',
    productsNote:'Everything here is roadmap: AI200 ships 2026, AI250 samples mid-2027, the Dragonfly AI300 accelerator & C1000 CPU sample 2028. Specs are Qualcomm-stated targets, not shipping benchmarks.',
    products:[
      { id:'ai200', brand:'Qualcomm AI', series:'AI200', tier:'Inference rack · 2026', specs:[
        { ic:'mem',   t:'768 GB LPDDR / card', d:'High capacity at low cost — sized for memory-bound inference' },
        { ic:'chip',  t:'Hexagon NPU-based', d:'Rack-scale AI inference accelerator' },
        { ic:'power', t:'160 kW / rack · liquid-cooled', d:'PCIe scale-up, Ethernet scale-out; confidential computing' },
        { ic:'cloud', t:'Low-TCO LLM / LMM inference', d:'Availability 2026 (target)' },
      ]},
      { id:'ai250', brand:'Qualcomm AI', series:'AI250', tier:'Near-memory · 2027', specs:[
        { ic:'mem',   t:'HBC Gen 1 · 133 TB/s', d:'~18× effective memory bandwidth vs AI200 — avoids HBM' },
        { ic:'chip',  t:'Near-memory computing', d:'Disaggregated inferencing architecture' },
        { ic:'power', t:'160 kW / rack · liquid-cooled', d:'Commercial sampling mid-2027 (target)' },
      ]},
      { id:'ai300', brand:'Dragonfly', series:'AI300', tier:'Accelerator · 2028', specs:[
        { ic:'mem',   t:'HBC Gen 2 · 54× vs AI200', d:'Memory bandwidth per card' },
        { ic:'power', t:'4–8× BW/watt vs GPUs', d:'Per-card memory-bandwidth efficiency (Qualcomm-stated)' },
        { ic:'link',  t:'UALink + ESUN scale-up', d:'Copper / optical scale-out; air + liquid cooled' },
        { ic:'cloud', t:'Commercial sampling 2028', d:'3rd-gen Dragonfly accelerator (target)' },
      ]},
      { id:'c1000', brand:'Dragonfly', series:'C1000 CPU', tier:'Server CPU · 2028', specs:[
        { ic:'cpu',   t:'250+ custom Oryon cores', d:'Chiplet design, >5 GHz (Nuvia lineage)' },
        { ic:'power', t:'2× perf/watt vs server CPUs', d:'Qualcomm-stated; agentic / general / AI head-node variants' },
        { ic:'link',  t:'PCIe Gen 7 · 2+ TB/s · CXL', d:'Memory disaggregation; OCP ORv3' },
        { ic:'chip',  t:'Meta is launch partner', d:'Availability 2028 (target)' },
      ]},
      { id:'alphawave', brand:'Qualcomm', series:'Alphawave', tier:'Connectivity IP · acquired', specs:[
        { ic:'link',  t:'100 / 400 / 800G SerDes', d:'High-speed connectivity IP' },
        { ic:'chip',  t:'UCIe chiplet interconnect', d:'The "glue" for chiplet designs (Oryon + Hexagon + connectivity)' },
        { ic:'signal',t:'~$2.4B acquisition', d:'Announced Jun 2025; completed early 2026' },
      ]},
      { id:'modular', brand:'Qualcomm', series:'Modular', tier:'Software · open', specs:[
        { ic:'npu',   t:'Mojo + MAX inference engine', d:'Hardware-agnostic across CPU / GPU / NPU / ASIC' },
        { ic:'link',  t:'Hugging Face one-click', d:'Efficient Transformers Library + AI Inference Suite' },
        { ic:'cloud', t:'The anti-CUDA play', d:'No vendor lock-in — attacks NVIDIA’s software moat (~$3.9B deal)' },
      ]},
    ],
    clientsIntro:'The early customer base — an anchor sovereign-AI buyer, a launch CPU partner and two undisclosed hyperscalers on custom silicon. Tap a customer to see what they’re buying.',
    regions:[ {key:'mideast',label:'Middle East'}, {key:'usa',label:'United States'} ],
    clients:[
      { id:'humain', name:'HUMAIN', domain:'humain.ai', mono:'HU', col:'#0FA3A3', region:'mideast', tag:'Anchor · 200 MW',
        relationship:'The <b>anchor customer</b> — Saudi Arabia’s HUMAIN, deploying <b>200 MW</b> of Qualcomm AI racks from 2026, plus a joint AI Engineering Center in Riyadh.',
        buys:'AI200 / AI250 rack-scale inference systems.', contract:'Multi-year sovereign-AI deployment; ~$2B of the FY2029 target is anchored here.',
        notes:'Concentration risk cuts both ways — HUMAIN is both the proof point and a single large dependency in the early ramp.' },
      { id:'meta', name:'Meta', domain:'meta.com', mono:'MT', col:'#0866FF', region:'usa', tag:'Launch CPU partner',
        relationship:'The launch partner for the <b>Dragonfly C1000 server CPU</b> — a marquee validation of Qualcomm’s Oryon data-center CPU.',
        buys:'Dragonfly C1000 CPUs (multi-generation) for its next-gen server fleet.', contract:'Multi-year; first systems ship <b>2H 2028</b>.',
        notes:'A hyperscaler committing to Qualcomm’s CPU is the single strongest external signal for the data-center thesis.' },
      { id:'hyper1', name:'Hyperscaler #1', domain:'', mono:'H1', col:'#5B6470', region:'usa', tag:'Custom silicon · ≥$1B',
        relationship:'An <b>undisclosed hyperscaler</b> under a custom-silicon (inference) contract worth ≥$1B.',
        buys:'Custom inference silicon co-developed with Qualcomm.', contract:'Multi-generation custom-silicon commitment; <b>first shipment in the Dec-quarter of CY2026</b> — the nearest-term real revenue.',
        notes:'Name undisclosed; the Dec-2026 ship is the first tangible data-center revenue milestone.' },
      { id:'hyper2', name:'Hyperscaler #2', domain:'', mono:'H2', col:'#8A93A0', region:'usa', tag:'Custom silicon · ≥$1B',
        relationship:'A second <b>undisclosed hyperscaler</b> under a ≥$1B custom-silicon framework, disclosed at the June 2026 Investor Day.',
        buys:'Custom silicon (entry point from spec to GDS).', contract:'Multi-generation commitment; margin-accretive custom-silicon model.' },
    ],
    competitorsIntro:'Qualcomm targets AI <b>inference</b> specifically — not training — the faster-growing and more contestable slice of the market. NVIDIA dominates overall; the bet is that inference buyers will choose on <b>cost, power-efficiency and TCO</b> rather than raw peak performance or CUDA lock-in.',
    shareSub:'AI accelerator market — estimated revenue share (2026E)',
    shareNote:'Approximate AI-accelerator revenue share (analyst estimates, 2026). Qualcomm is <b>~0% today</b> — a brand-new entrant with a $15B+ FY2029 <b>target</b>. NVIDIA’s share is easing from ~92% (2023) as custom ASICs and inference specialists take slices of the contestable inference market.',
    share:[
      { name:'NVIDIA', pct:85, col:'#76B900' },
      { name:'Custom ASIC (TPU / Trainium)', pct:7, col:'#5B6470' },
      { name:'AMD', pct:6, col:'#ED1C24' },
      { name:'Specialists (Groq / Cerebras)', pct:1, col:'#7A5AF8' },
      { name:'Qualcomm', pct:0, label:'new', self:true },
    ],
    compCol4:'Key products',
    compRows:[
      { name:'NVIDIA', type:'Merchant', arena:'Training + inference — dominant', flagship:'GB300 / CUDA', share:'~85%',
        vs:'Qualcomm attacks <b>inference only</b>, on tokens-per-watt & TCO, with open software vs the CUDA moat.' },
      { name:'AMD', type:'Merchant', arena:'Training + inference', flagship:'Instinct MI350', share:'~6%',
        vs:'The main GPU alternative; Qualcomm differentiates on near-memory efficiency, not raw GPU parity.' },
      { name:'Google · Amazon', type:'Captive', arena:'Hyperscaler custom silicon', flagship:'TPU · Trainium', share:'~7%',
        vs:'Vertically-integrated in-house ASICs; Qualcomm offers a merchant <b>and</b> custom-silicon alternative to those without their own.' },
      { name:'Groq · Cerebras', type:'Merchant', arena:'Inference specialists', flagship:'LPU · WSE-3', share:'~1%',
        vs:'Validate the inference thesis Qualcomm is chasing; niche, premium — Qualcomm plays the low-TCO volume angle.' },
      { name:'Intel', type:'Merchant', arena:'Inference', flagship:'Gaudi 3', share:'<1%',
        vs:'Struggling to gain share; not the primary competitive threat.' },
    ],
    tableNote:'The whole thesis rests on <b>inference economics</b>: if buyers optimise for cost-per-token and power rather than peak training FLOPS, Qualcomm’s memory-efficient, low-TCO approach has room — but it is entering a market NVIDIA overwhelmingly controls.',
    advIntro:'Why Qualcomm believes it can win a slice of AI inference — the differentiators behind the $15B+ FY2029 target. Tap a card to see the argument (and remember: this is a bet, not yet a business).',
    adv:[
      { ic:'⚡', title:'Energy-efficient inference', stat:'Tokens-per-watt as the pitch',
        body:'The core argument: AI300 claims 4–8× memory-bandwidth-per-watt vs GPUs and the C1000 claims 2× perf/watt vs server CPUs. Qualcomm leverages its mobile power-efficiency DNA for the metric inference buyers care about — cost and power per token.' },
      { ic:'🧠', title:'Near-memory HBC — no "HBM tax"', stat:'6× BW/watt vs HBM',
        body:'Qualcomm’s High Bandwidth Compute stacks memory near the compute (claimed 6× bandwidth/watt vs HBM) and puts huge capacity on-card (768GB LPDDR on AI200) — sidestepping HBM’s cost and supply constraints for memory-bound inference.' },
      { ic:'⚙️', title:'Oryon CPU for agentic workloads', stat:'250+ cores, validated by Meta',
        body:'The Nuvia-derived Oryon server CPU (Dragonfly C1000) is purpose-built for agentic and head-node workloads — and Meta signing on as launch partner is the strongest external validation of the effort.' },
      { ic:'🔗', title:'Alphawave connectivity IP', stat:'Owns the rack-scale interconnect',
        body:'The ~$2.4B Alphawave acquisition brings the 800G SerDes, UCIe chiplet and UALink/ESUN interconnect IP needed to build rack-scale systems — the "glue" a credible data-center player must own.' },
      { ic:'🔓', title:'Open software — no CUDA lock-in', stat:'Modular (Mojo + MAX)',
        body:'The ~$3.9B Modular acquisition brings a hardware-agnostic inference stack (Mojo + MAX) with Hugging Face integration — a direct attack on NVIDIA’s key moat, its CUDA software ecosystem.' },
      { ic:'🌐', title:'Device-to-cloud heritage', stat:'Phone → PC → auto → data center',
        body:'Qualcomm is the only player spanning the full edge-to-cloud stack. As AI inference distributes between device and data center, that end-to-end story is a positioning rivals can’t easily copy.' },
    ],
    numHasMargin:false, numFullRange:true,
    numIntro:'Data Center is a <b>ramp story, not a history</b> — near-zero revenue today against a large FY2029 target. Drag the <b>range slider</b> to include the FY2029 target; the readout shows the implied growth rate to the target.',
    numTitle:'Data Center revenue (ramp to target)', numBarLabel:'Data Center revenue ($B)', numTargetWord:'target',
    numNote:'Reported Data Center revenue was <b>~$0 through FY2025</b>. FY2026 (~$0.3B) is Qualcomm’s own base figure. <b>FY2027E–FY2028E are illustrative interpolation</b> toward the disclosed <b>FY2029 target of $15B+</b> (Investor Day, Jun 24 2026) — they are <b>not company guidance</b>. The target is anchored by HUMAIN (~$2B) plus two ≥$1B hyperscaler custom-silicon deals and the Meta CPU (from 2H2028).',
    numData:[
      { fy:'FY2026', rev:0.3 },
      { fy:'FY2027E', rev:2.5, proj:true },
      { fy:'FY2028E', rev:7.0, proj:true },
      { fy:'FY2029E', rev:15.4, proj:true },
    ]
  },
};

// Data Center · New Tech — the two headline Investor-Day 2026 announcements:
// High Bandwidth Compute (HBC) memory, and the Microsoft / Azure endorsement.
function dcNewTechBody(){
  var hbcSpecs = [
    { v:'768 GB', k:'LPDDR memory / card' },
    { v:'~6×', k:'bandwidth-per-watt vs HBM' },
    { v:'~200×', k:'capacity-per-watt vs SRAM' },
    { v:'Gen 1 → 2', k:'AI250 (2027) → AI300' },
  ];
  var h = '<p class="ovlr-money-p">The two headline announcements from Qualcomm’s <b>June 24, 2026 Investor Day</b> that reframe its data-center story: a new memory architecture (<b>HBC</b>) and a cloud endorsement from <b>Microsoft</b>.</p>';

  // ── HBC ──
  h += '<div class="nt-block">'+
    '<div class="nt-head"><span class="nt-ic">🧠</span>'+
      '<span class="nt-title">High Bandwidth Compute (HBC)</span>'+
      '<span class="nt-tag">New memory architecture</span></div>'+
    '<p class="nt-lead">Inference is <b>memory-bound</b> — the bottleneck is feeding data to the compute, not the compute itself. The industry’s answer is <b>HBM</b>: stacks of fast memory sitting next to the chip, connected over an expensive silicon <b>interposer (CoWoS)</b> — costly, supply-constrained, and power-hungry because data has to travel across it. Qualcomm’s bet is to <b>stack the memory directly on top of the compute tile</b> instead. Data barely moves, so you get HBM-class bandwidth at far lower power — and you sidestep the HBM cost and supply crunch entirely (what Qualcomm calls eliminating the <b>“HBM tax”</b>).</p>';
  // comparison diagram
  h += '<div class="nt-cmp">'+
    '<div class="nt-cmp-col">'+
      '<div class="nt-cmp-h">Traditional · HBM + interposer</div>'+
      '<div class="nt-layer" style="background:#5B6470">HBM stacks</div>'+
      '<div class="nt-gap">⇕ interposer (CoWoS) — data travels far · power + cost</div>'+
      '<div class="nt-layer" style="background:#1E2733">Compute die</div>'+
    '</div>'+
    '<div class="nt-cmp-col hi">'+
      '<div class="nt-cmp-h">Qualcomm HBC · near-memory</div>'+
      '<div class="nt-layer" style="background:#3253DC">Memory — 768GB LPDDR</div>'+
      '<div class="nt-gap" style="color:var(--brand)">▲ stacked directly on top — no interposer</div>'+
      '<div class="nt-layer" style="background:#1E2733">Compute (base die)</div>'+
    '</div>'+
  '</div>';
  h += '<div class="nt-specs">'+hbcSpecs.map(function(s){
    return '<div class="nt-spec"><span class="nt-spec-v">'+esc(s.v)+'</span><span class="nt-spec-k">'+esc(s.k)+'</span></div>';
  }).join('')+'</div>';
  h += '<p class="nt-lead" style="margin:12px 0 0">HBC debuts as <b>Gen 1 in the AI250</b> accelerator (rack-scale AI inference, arriving <b>2027</b>) and advances to <b>Gen 2 in the Dragonfly AI300</b> (2028), where it pairs with UALink / ESUN rack fabrics. The pitch to buyers: the <b>best performance-per-watt</b> and lowest total cost for running large models — not training them.</p>'+
  '</div>';

  // ── Microsoft / Azure ──
  h += '<div class="nt-block">'+
    '<div class="nt-head"><span class="nt-ic">☁️</span>'+
      '<span class="nt-title">Microsoft / Azure endorsement</span>'+
      '<span class="nt-tag">Hyperscaler cloud</span></div>'+
    '<p class="nt-lead">At the Investor Day, Microsoft CEO <b>Satya Nadella appeared by video</b> to back the partnership “<b>from PCs to AI agents, and HBC in the data center</b>” — with <b>Azure</b> tapping Qualcomm’s <b>HBC accelerator</b> (the AI250 generation, targeted for <b>mid-2027</b>). It is the missing piece of the thesis: a <b>hyperscaler cloud</b> publicly validating the inference silicon, alongside <b>Meta</b> (committed to the Dragonfly C1000 CPU) and <b>HUMAIN</b> (the 200 MW anchor deployment).</p>'+
    '<div class="nt-specs">'+
      '<div class="nt-spec"><span class="nt-spec-v">Azure</span><span class="nt-spec-k">to deploy HBC accelerator</span></div>'+
      '<div class="nt-spec"><span class="nt-spec-v">mid-2027</span><span class="nt-spec-k">targeted timing</span></div>'+
      '<div class="nt-spec"><span class="nt-spec-v">PCs → agents → DC</span><span class="nt-spec-k">breadth of the relationship</span></div>'+
    '</div>'+
    '<p class="nt-lead" style="margin:12px 0 0">Why it matters: Microsoft is already Qualcomm’s <b>Windows-on-Snapdragon</b> partner in PCs. Extending that to the data center gives Qualcomm a credible cloud reference customer in a market NVIDIA overwhelmingly controls — though, so far, Nadella’s endorsement was <b>high-level</b>, without disclosed volumes or a binding commitment.</p>'+
  '</div>';

  h += '<div class="ovlr-money-note">Source: Qualcomm Investor Day, June 24 2026 (coverage: ServeTheHome, Futurum, CNBC). HBC efficiency figures are Qualcomm-stated; the Azure/HBC deployment is an endorsement with timing but no disclosed volume — treat as directional, not contracted revenue.</div>';
  return h;
}

// Segment deep-dive — 4th-level sub-tabs. Products · Clients · Competitors · Competitive
// Advantage · [extra tabs] · Numbers. `seg` is a SEG entry (handsets / iot / auto / dc).
// A segment may add `extraTabs` (e.g. Data Center's "New Tech"), inserted before Numbers.
function segTabsBody(seg){
  if (!seg) return '';
  var tabs = [
    { key:'products',    label:'Products',             body:productsExplorer(seg) },
    { key:'clients',     label:'Clients',              body:clientsBody(seg) },
    { key:'competitors', label:'Competitors',          body:segCompetitorsBody(seg) },
    { key:'advantage',   label:'Competitive Advantage', body:advantageBody(seg) },
  ];
  (seg.extraTabs || []).forEach(function(t){ tabs.push({ key:t.key, label:t.label, body:t.render() }); });
  tabs.push({ key:'numbers', label:'Numbers', body:numbersBody(seg) });
  return '<div class="hs-tabs">'+tabs.map(function(t,i){
      return '<button type="button" class="hs-tab'+(i===0?' active':'')+'" data-hs="'+t.key+'">'+esc(t.label)+'</button>';
    }).join('')+'</div>'+
    tabs.map(function(t,i){
      return '<div class="hs-pane" data-hs="'+t.key+'"'+(i===0?'':' hidden')+'>'+t.body+'</div>';
    }).join('');
}

// QCT sub-tab — its own 3rd-level segment tabs (Handsets · IoT · Automotive · Data Center).
function qctBody(){
  var h = '<p class="ovlr-money-p">QCT is Qualcomm’s chip business (~87% of revenue, ~30% operating margin). It reports three end-markets today — Handsets, IoT and Automotive — with Data Center the new fourth pillar ramping from FY2026:</p>';
  h += '<div class="qseg-tabs">'+QCT_CATS.map(function(cat,i){
    return '<button type="button" class="qseg-tab'+(i===0?' active':'')+'" data-qseg="'+cat.key+'">'+esc(cat.label)+'</button>';
  }).join('')+'</div>';
  h += QCT_CATS.map(function(cat,i){
    var body = SEG[cat.key] ? segTabsBody(SEG[cat.key]) : segBody(cat);
    return '<div class="qseg-pane" data-qseg="'+cat.key+'"'+(i===0?'':' hidden')+'>'+body+'</div>';
  }).join('');
  return h;
}
// ═══════════════════════════════════════════════════════════════════════════
// QTL — Licensing. Three sub-tabs: History (interactive timeline) · How it makes
// money (royalty model + estimator) · Numbers (QTL revenue & EBT margin chart).
// ═══════════════════════════════════════════════════════════════════════════
var QTL_TYPES = [
  { key:'tech',  label:'Founding & Tech',   col:'#2E5CE6' },
  { key:'legal', label:'Legal battle',      col:'#E4002B' },
  { key:'deal',  label:'Settlement / Deal', col:'#1B9E5F' },
  { key:'reg',   label:'Regulatory',        col:'#F2A900' },
];
function qtlTypeCol(t){ var x = QTL_TYPES.filter(function(q){ return q.key===t; })[0]; return x ? x.col : '#8A93A0'; }
function qtlTypeLabel(t){ var x = QTL_TYPES.filter(function(q){ return q.key===t; })[0]; return x ? x.label : t; }

// Chronology of the licensing business and the legal/regulatory battles that define it.
var QTL_EVENTS = [
  { year:'1985', type:'tech', title:'Qualcomm founded — the CDMA bet',
    body:'Seven engineers led by <b>Irwin Jacobs</b> found Qualcomm. Its bet on <b>CDMA</b> (a spread-spectrum cellular technology) over the incumbent TDMA becomes the foundation of a patent portfolio that will underpin 3G, 4G and 5G.' },
  { year:'1990s', type:'tech', title:'CDMA becomes the standard — “no license, no chips”',
    body:'CDMA is adopted as IS-95 and then the basis of 3G. Owning the <b>standard-essential patents</b>, Qualcomm builds the model that still defines QTL: any device using the cellular standard must license its patents — whether or not it buys a Qualcomm chip.' },
  { year:'2000s', type:'tech', title:'The device-price royalty model',
    body:'Qualcomm licenses a <b>percentage of the whole device sale price</b> (with a cap), collecting a royalty on virtually every 3G/4G phone sold worldwide — an extraordinarily profitable, chip-independent stream.' },
  { year:'2015', type:'reg', title:'China NDRC settlement — $975M',
    body:'Qualcomm paid a <b>$975M</b> fine and agreed a China rate framework (royalties charged on <b>65% of the device price</b>) to resolve a 14-month antitrust probe — lower China rates, but it kept the model intact.' },
  { year:'2016', type:'reg', title:'Korea KFTC fine — ~$865M',
    body:'South Korea’s Fair Trade Commission fined Qualcomm <b>₩1.03 trillion (~$865M)</b> — Korea’s largest-ever — for limiting SEP licenses to rival chipmakers and tying chip sales to licenses. Qualcomm appealed; <b>Korea’s Supreme Court upheld the penalty in April 2023</b>.' },
  { year:'2017', type:'legal', title:'FTC sues; Apple sues days later',
    body:'The <b>US FTC</b> sued (Jan 2017), alleging the “no license, no chips” policy was anticompetitive. Days later <b>Apple</b> sued for ~$1B and directed its contract manufacturers to <b>stop paying royalties</b> — opening a two-year standoff.' },
  { year:'2018', type:'reg', title:'EU fine — €997M (later annulled)',
    body:'The European Commission fined Qualcomm <b>€997M</b> for payments to Apple to use its modems exclusively. The <b>EU General Court annulled the fine in 2022</b>.' },
  { year:'2019', type:'deal', title:'Apple settlement — the model holds',
    body:'April 2019: Apple and Qualcomm <b>settle</b> — a six-year license, a multi-year chip-supply deal and a one-time payment to Qualcomm (~<b>$4.5B</b>). The same day, <b>Intel exited the 5G modem business</b>, leaving Qualcomm the sole merchant supplier.' },
  { year:'2019', type:'legal', title:'Judge Koh rules against Qualcomm',
    body:'May 2019: Judge <b>Lucy Koh</b> ruled for the FTC, ordering Qualcomm to renegotiate its licenses at chip level — an <b>existential threat</b> to the royalty model. Qualcomm appealed.' },
  { year:'2020', type:'legal', title:'Ninth Circuit reversal — vindication',
    body:'August 2020: the <b>Ninth Circuit unanimously reversed</b> Judge Koh, calling the practices “hypercompetitive, not anticompetitive.” The FTC declined to appeal further — the licensing model was upheld.' },
  { year:'2020', type:'deal', title:'Huawei long-term license',
    body:'Qualcomm signed a <b>long-term license with Huawei</b> and recognised ~$1.8B of back royalties — resolving a major overhang and locking in one of the largest licensees.' },
  { year:'2025', type:'legal', title:'Huawei royalties cease — a headwind',
    body:'Qualcomm’s Huawei license <b>expired and royalties ceased in Q2 FY2025</b> (under renegotiation) — a direct headwind to QTL. Offset in part by new licenses with Chinese OEMs and a comprehensive 4G/5G deal with <b>Transsion</b>.' },
  { year:'2025+', type:'deal', title:'Apple renewal & the road to 6G',
    body:'Apple’s <b>QTL license renewal is underway</b> — crucially <b>separate from the chip business</b>: Apple’s in-house modem does not end the patent royalty. Qualcomm positions its <b>200,000+ patents</b> for the 6G standard, extending the stream for another decade.' },
];
function qtlEvent(e, i){
  return '<div class="ql-ev'+(i<2?' open':'')+'" data-type="'+esc(e.type)+'" style="--c:'+qtlTypeCol(e.type)+'">'+
    '<span class="ql-ev-dot"></span>'+
    '<div class="ql-ev-card">'+
      '<button type="button" class="ql-ev-head">'+
        '<span class="ql-ev-year">'+esc(e.year)+'</span>'+
        '<span class="ql-ev-title">'+esc(e.title)+'</span>'+
        '<span class="ql-ev-tag">'+esc(qtlTypeLabel(e.type))+'</span>'+
        '<span class="ql-ev-ch">▾</span>'+
      '</button>'+
      '<div class="ql-ev-body"><p>'+e.body+'</p></div>'+
    '</div>'+
  '</div>';
}
function qtlHistoryBody(){
  var chips = QTL_TYPES.map(function(t){
    return '<button type="button" class="ql-fchip on" data-qtype="'+t.key+'" style="--c:'+t.col+'"><span class="ql-fdot"></span>'+esc(t.label)+'</button>';
  }).join('');
  return '<p class="ql-intro">QTL is the licensing business — small in revenue, but Qualcomm’s <b>profit engine</b> (~70% EBT margin). Its whole value rests on the <b>standard-essential patents</b> it owns and the decades of legal precedent defending the right to charge for them. Tap the chips to filter by event type, or an event to read what happened.</p>'+
    '<div class="ql-filters">'+chips+'</div>'+
    '<div class="ql-tl">'+QTL_EVENTS.map(qtlEvent).join('')+'</div>'+
    '<div class="ovlr-money-note">The model has survived every major legal and regulatory challenge (FTC, EU, Korea, China) largely intact — the <b>2020 Ninth Circuit reversal</b> being the decisive vindication. The live risks now are <b>Huawei</b> (royalties ceased FY2025) and the <b>Apple renewal</b>. Dates and amounts from court/regulator records and Qualcomm filings.</div>';
}

// How it makes money — royalty estimator + mechanic cards.
var QTL_RATES = [
  { key:'multi',  label:'Multimode 5G',   rate:0.02275 },
  { key:'single', label:'Single-mode 5G', rate:0.04 },
];
var QTL_CAP = 400;  // royalty base is capped at a $400 device sale price
function qtlMoneyBody(){
  var segs = QTL_RATES.map(function(r,i){
    return '<button type="button" class="qm-rate-b'+(i===0?' active':'')+'" data-qrate="'+r.key+'">'+esc(r.label)+' · '+(r.rate*100).toFixed(3).replace(/0+$/,'').replace(/\.$/,'')+'%</button>';
  }).join('');
  var cards = [
    { ic:'📜', t:'200,000+ essential patents', p:'Qualcomm owns patents that are <b>essential to the 3G/4G/5G standards</b>. You cannot build a compliant phone without using them — so nearly every device maker on Earth must take a license.' },
    { ic:'🔒', t:'“No license, no chips”', p:'Qualcomm will only sell its chips to companies that hold a patent license. This links the two businesses and is the leverage that has kept licensees paying — the practice regulators attacked, and courts upheld.' },
    { ic:'📱', t:'A % of the device price', p:'The royalty is a <b>percentage of the phone’s sale price</b>, with the base <b>capped at $400</b> — so a $400 phone and a $1,200 phone pay a similar royalty. Charged per unit, paid quarterly.' },
    { ic:'🔄', t:'Independent of the chip cycle', p:'QTL collects <b>whether or not the phone uses a Qualcomm chip</b> — even MediaTek- and Apple-powered phones pay. That makes the royalty stream durable and largely decoupled from the QCT chip cycle.' },
    { ic:'🌍', t:'Hundreds of licensees', p:'Apple, Samsung, Xiaomi, Oppo, Vivo, Transsion — virtually every phone brand. Long-term, multi-year agreements renewed as new standards (5G, soon 6G) arrive.' },
    { ic:'💎', t:'Almost pure margin', p:'The patents are already written; the incremental cost of another license is near zero. QTL runs at roughly a <b>70% EBT margin</b> — a small-revenue segment that produces an outsized share of Qualcomm’s profit.' },
  ];
  return '<p class="ovlr-money-p">QTL charges a royalty for the use of its cellular-essential patents. Small in revenue, it is the company’s profit machine. Move the slider to see how a single phone’s royalty is calculated.</p>'+
    '<div class="qm-calc">'+
      '<div class="qm-calc-h">Royalty estimator — one 5G phone</div>'+
      '<div class="qm-rate-seg" id="qtlRateSeg">'+segs+'</div>'+
      '<div class="qm-slider-row"><label>Device price</label>'+
        '<input type="range" class="qm-range" id="qtlPrice" min="50" max="1600" step="10" value="600" aria-label="device price">'+
        '<span class="qm-price" id="qtlPriceV">$600</span></div>'+
      '<div class="qm-flow">'+
        '<div class="qm-step"><div class="qm-step-v" id="qtlF1">$600</div><div class="qm-step-k">device sale price</div></div>'+
        '<div class="qm-arrow">→</div>'+
        '<div class="qm-step"><div class="qm-step-v" id="qtlF2">$400</div><div class="qm-step-k">royalty base<br>(capped at $400)</div></div>'+
        '<div class="qm-arrow">→</div>'+
        '<div class="qm-step res"><div class="qm-step-v" id="qtlF3">$9.10</div><div class="qm-step-k" id="qtlF3k">royalty · 2.275%</div></div>'+
      '</div>'+
      '<div class="qm-note"><b>Illustrative.</b> Rates approximate Qualcomm’s published 5G program (multimode ~2.275%, single-mode ~4% of device price) with the base capped at <b>$400</b>. Actual per-licensee rates are confidential and vary; some large OEMs negotiate fixed per-unit fees.</div>'+
    '</div>'+
    '<div class="qm-grid">'+cards.map(function(c){
      return '<div class="qm-card"><div class="qm-card-ic">'+c.ic+'</div><div class="qm-card-t">'+esc(c.t)+'</div><p class="qm-card-p">'+c.p+'</p></div>';
    }).join('')+'</div>'+
    '<div class="ovlr-money-note">The economics: a modest royalty (single-digit dollars) on <b>~1.2 billion phones a year</b>, at ~70% margin — a stream that funds much of Qualcomm’s R&amp;D and is largely independent of who makes the chip inside.</div>';
}

// Numbers — QTL revenue & EBT margin, via the shared per-segment chart engine.
var QTL_NUMSEG = {
  key:'qtl', numMarginMax:100, numMarginChip:'EBT margin', numFullRange:true,  // no projection year — show all reported years
  numIntro:'QTL revenue and its extraordinary margin. A mature, slow-growth royalty stream — the story here is <b>profitability and durability</b>, not growth. Drag the range slider to change the years; toggle the EBT-margin line and YoY labels.',
  numTitle:'QTL revenue &amp; EBT margin', numBarLabel:'QTL revenue ($B)', numMarginLabel:'QTL EBT margin (%)',
  numNote:'QTL = Qualcomm Technology Licensing segment revenue and <b>EBT (pre-tax) margin</b>, both <b>reported</b> (Qualcomm 10-K / earnings). The FY2023 dip reflects a weaker handset market and licensing timing; the <b>Huawei royalty cessation (Q2 FY2025)</b> is a headwind partly offset by new Chinese-OEM and Transsion licenses. QTL is mature — Qualcomm does not set a growth target for it.',
  numData:[
    { fy:'FY2021', rev:6.32, margin:73 },
    { fy:'FY2022', rev:6.36, margin:72 },
    { fy:'FY2023', rev:5.31, margin:68 },
    { fy:'FY2024', rev:5.57, margin:72 },
    { fy:'FY2025', rev:5.58, margin:72 },
  ]
};

// QTL body — three sub-tabs (reuses the .hs-tab / .hs-pane sub-tab styling).
function qtlBody(){
  return '<div class="qa-cat-head"><span class="qa-cat-rev">'+esc(QTL_SEG.rev)+'</span><span class="qa-cat-tag">'+esc(QTL_SEG.tag)+'</span></div>'+
    '<div class="hs-tabs">'+
    '<button type="button" class="hs-tab active" data-hs="history">History</button>'+
    '<button type="button" class="hs-tab" data-hs="money">How it makes money</button>'+
    '<button type="button" class="hs-tab" data-hs="numbers">Numbers</button>'+
  '</div>'+
  '<div class="hs-pane" data-hs="history">'+qtlHistoryBody()+'</div>'+
  '<div class="hs-pane" data-hs="money" hidden>'+qtlMoneyBody()+'</div>'+
  '<div class="hs-pane" data-hs="numbers" hidden>'+numbersBody(QTL_NUMSEG)+'</div>';
}
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

  // Each QCT segment (Handsets · IoT · Automotive · Data Center) — wire its 4th-level
  // sub-tabs and interactive pieces. State and DOM ids are keyed by seg.key so the four
  // panes coexist without colliding.
  QCT_CATS.forEach(function(cat){
    var seg = SEG[cat.key]; if (!seg) return;
    var pn = pane.querySelector('.qseg-pane[data-qseg="'+cat.key+'"]'); if (!pn) return;
    var ids = numIds(seg), st = numState(seg);
    // Sub-tabs: Products · Clients · Competitors · Competitive Advantage · Numbers.
    pn.querySelectorAll('.hs-tab').forEach(function(btn){
      btn.onclick = function(){
        var key = btn.getAttribute('data-hs');
        pn.querySelectorAll('.hs-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
        pn.querySelectorAll('.hs-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-hs') !== key); });
        if (key === 'numbers') requestAnimationFrame(function(){ renderNumSlider(seg); buildNumbersChart(seg); });   // Chart.js needs a visible canvas
      };
    });
    // Competitive Advantage — expandable cards.
    pn.querySelectorAll('.adv-head').forEach(function(head){
      head.onclick = function(){ head.parentElement.classList.toggle('open'); };
    });
    // Numbers — metric toggles (operating margin · YoY) + year-range slider.
    var numChips = pn.querySelector('#'+ids.chips);
    if (numChips) numChips.onclick = function(e){ var b = e.target.closest('.ovlr-mg-chip'); if (!b) return;
      var k = b.getAttribute('data-num');
      if (k === 'margin') st.margin = !st.margin; else if (k === 'yoy') st.yoy = !st.yoy;
      b.classList.toggle('on'); buildNumbersChart(seg);
    };
    wireNumSlider(pn, seg);
    // Products — tap a tile → update the spec sheet.
    var sheet = pn.querySelector('#qcSdSheet_'+seg.key);
    pn.querySelectorAll('.sd-tile').forEach(function(tile){
      tile.onclick = function(){
        var tid = tile.getAttribute('data-sd');
        pn.querySelectorAll('.sd-tile').forEach(function(t){ t.classList.toggle('active', t===tile); });
        var s = seg.products.filter(function(x){ return x.id === tid; })[0];
        if (s && sheet) sheet.innerHTML = specSheet(s);
      };
    });
    // Clients — tap a logo → update the relationship detail.
    var clDetail = pn.querySelector('#qcClDetail_'+seg.key);
    pn.querySelectorAll('.cl-card').forEach(function(card){
      card.onclick = function(){
        var cid = card.getAttribute('data-cl');
        pn.querySelectorAll('.cl-card').forEach(function(c){ c.classList.toggle('active', c===card); });
        var cl = seg.clients.filter(function(x){ return x.id === cid; })[0];
        if (cl && clDetail) clDetail.innerHTML = clientDetail(cl, seg);
      };
    });
  });

  // QTL — Licensing pane: History (timeline) · How it makes money (estimator) · Numbers.
  var qtl = pane.querySelector('.ovt-subpane[data-ovst="qtl"]');
  if (qtl){
    var qseg = QTL_NUMSEG, qids = numIds(qseg), qst = numState(qseg);
    // Sub-tabs.
    qtl.querySelectorAll('.hs-tab').forEach(function(btn){
      btn.onclick = function(){
        var key = btn.getAttribute('data-hs');
        qtl.querySelectorAll('.hs-tab').forEach(function(b){ b.classList.toggle('active', b===btn); });
        qtl.querySelectorAll('.hs-pane').forEach(function(p){ p.hidden = (p.getAttribute('data-hs') !== key); });
        if (key === 'numbers') requestAnimationFrame(function(){ renderNumSlider(qseg); buildNumbersChart(qseg); });
      };
    });
    // History — event expand + type filters.
    qtl.querySelectorAll('.ql-ev-head').forEach(function(head){
      head.onclick = function(){ head.closest('.ql-ev').classList.toggle('open'); };
    });
    var qFilters = qtl.querySelector('.ql-filters');
    if (qFilters) qFilters.onclick = function(e){ var b = e.target.closest('.ql-fchip'); if (!b) return;
      b.classList.toggle('on');
      var on = {}; qtl.querySelectorAll('.ql-fchip').forEach(function(c){ on[c.getAttribute('data-qtype')] = c.classList.contains('on'); });
      qtl.querySelectorAll('.ql-ev').forEach(function(ev){ ev.hidden = !on[ev.getAttribute('data-type')]; });
    };
    // How it makes money — royalty estimator (rate toggle + price slider).
    var qPrice = qtl.querySelector('#qtlPrice');
    var qRate = QTL_RATES[0];
    var recalc = function(){
      if (!qPrice) return;
      var price = parseInt(qPrice.value, 10) || 0;
      var base = Math.min(price, QTL_CAP);
      var roy = base * qRate.rate;
      var set = function(id, v){ var el = qtl.querySelector('#'+id); if (el) el.textContent = v; };
      set('qtlPriceV', '$'+price);
      set('qtlF1', '$'+price);
      set('qtlF2', '$'+base);
      set('qtlF3', '$'+roy.toFixed(2));
      var k = qtl.querySelector('#qtlF3k'); if (k) k.textContent = 'royalty · '+(qRate.rate*100).toFixed(3).replace(/0+$/,'').replace(/\.$/,'')+'%';
    };
    if (qPrice) qPrice.oninput = recalc;
    var qRateSeg = qtl.querySelector('#qtlRateSeg');
    if (qRateSeg) qRateSeg.onclick = function(e){ var b = e.target.closest('.qm-rate-b'); if (!b) return;
      var rk = b.getAttribute('data-qrate');
      qRate = QTL_RATES.filter(function(r){ return r.key === rk; })[0] || QTL_RATES[0];
      qRateSeg.querySelectorAll('.qm-rate-b').forEach(function(x){ x.classList.toggle('active', x===b); });
      recalc();
    };
    recalc();
    // Numbers — metric toggles + slider.
    var qNumChips = qtl.querySelector('#'+qids.chips);
    if (qNumChips) qNumChips.onclick = function(e){ var b = e.target.closest('.ovlr-mg-chip'); if (!b) return;
      var k = b.getAttribute('data-num');
      if (k === 'margin') qst.margin = !qst.margin; else if (k === 'yoy') qst.yoy = !qst.yoy;
      b.classList.toggle('on'); buildNumbersChart(qseg);
    };
    wireNumSlider(qtl, qseg);
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
