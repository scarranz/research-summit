// overviews/remitly.js — Remitly Global (NASDAQ: RELY), NEW FORMAT.
// Two SIBLING profile tabs (OVERVIEW_CONVENTIONS §1): a standardized Overview (the hook)
// + a Deep Dive (the uber/lyft/cart/visa 5-tab spine). Golden Rule #1: the entire prior
// bespoke Overview was NOT deleted — every fact/number was MOVED into the most relevant
// place (SEGMENTS/charts → Top Line ▸ Segments; CORRIDORS → Top Line ▸ Customers; PREFUNDING
// → Bottom Line ▸ Unit Economics; PEERS/TAILWINDS/HEADWINDS → Top Line ▸ Industry; TAM →
// Top Line ▸ TAM; DRIVERS/TARGETS → Evolution ▸ Strategy; TIMELINE/MNA → Evolution; the
// annual series → Valuation ▸ Financials). Convention: esc() leaves & LITERAL (never HTML-encode & in source).
//
// Live data (companies.js fills these):
//   · Market cap / peer bubbles → api.liveQuote (Massive) overrides dated seeds, per ticker.
//   · Analyst Ratings → #dd-val-slot ; Ownership & insiders → #dd-mgmt-slot (absorbsPillars).
// Remitly is NOT in the Summit DCF universe, so Valuation ▸ Financials uses the hardcoded
// FY2021–FY2025 series (reported actuals + the research-team quarterly series) — no forward model.

import { makeManagement } from './management.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Brand palette / formatters ──────────────────────────────────────────────
var C_AXIS='#8A93A0', C_GRID='#EEF2F7';
var RELY_BLUE='#1F4DD8', RELY_STEEL='#3E5A82', RELY_STEEL2='#64748B', RELY_GOLD='#E8A00C', RELY_GREEN='#16A34A';
function _hexRgba(hex, a){ var h=hex.replace('#',''); return 'rgba('+parseInt(h.substr(0,2),16)+','+parseInt(h.substr(2,2),16)+','+parseInt(h.substr(4,2),16)+','+a+')'; }
function fmtUSD_M(m){ if (m >= 1000) return '$' + (m/1000).toFixed(1).replace(/\.0$/,'') + 'B'; return '$' + m.toFixed(0) + 'M'; }

// ─── Render helpers (shared across Overview + Deep Dive) ─────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// ═══════════════════════════════════════════════════════════════════════════
//  QUANTITATIVE DATA (research team — preserved verbatim from the prior Overview)
// ═══════════════════════════════════════════════════════════════════════════
// Quarterly, chronological (oldest → newest): Q1 2021 … Q1 2026 (21 quarters)
var QLABELS = ['Q1 21','Q2 21','Q3 21','Q4 21','Q1 22','Q2 22','Q3 22','Q4 22','Q1 23','Q2 23','Q3 23','Q4 23','Q1 24','Q2 24','Q3 24','Q4 24','Q1 25','Q2 25','Q3 25','Q4 25','Q1 26'];
var ACTIVE  = [2.1,2.4,2.6,2.8,3.0,3.4,3.8,4.2,4.6,5.0,5.4,5.9,6.2,6.9,7.3,7.8,8.0,8.5,8.9,9.3,9.6];          // avg active customers (millions)
var SENDVOL = [4273,4976,5200,6000,6094,6964,7521,8052,8544,9580,10227,11108,11464,13241,14490,15400,16158,18477,19519,20800,22100]; // send volume (USD millions)
var TAKERATE = [2.13,2.23,2.33,2.25,2.23,2.26,2.25,2.37,2.39,2.44,2.36,2.38,2.35,2.31,2.32,2.29,2.24,2.23,2.15,2.13,2.05]; // take rate (% of send volume)
var _chartActive=null, _chartVol=null, _chartTake=null;
function yoyPct(arr){ var n=arr.length; if(n<5) return null; return ((arr[n-1]/arr[n-5]-1)*100); }
function pctStr(p){ return (p>=0?'+':'') + p.toFixed(0) + '%'; }

// ═══════════════════════════════════════════════════════════════════════════
//  STANDARDIZED OVERVIEW DATA (the hook — OVERVIEW_CONVENTIONS §4)
// ═══════════════════════════════════════════════════════════════════════════

// ── Block 1 — Key Facts (10, 5×2). Market cap cell is live (#relyMc). ──
var RELY_FACTS=[
  ['Listing','NASDAQ: RELY'],
  ['HQ','Seattle, WA, USA'],
  ['Founded','2011 — as BeamIt Mobile'],
  ['IPO','Sep 2021 · $43.00'],
  ['CEO','Sebastian Gunningham · since Feb 2026'],
  ['Chairman','Matt Oppenheimer · co-founder'],
  ['Employees','~3,200'],
  ['FY2025 revenue','~$1.6B · +29% YoY'],
  ['FY2025 send volume','$74.9B'],
  ['Market cap','~$4B · est'],
];
function stdKeyFacts(){
  return '<div class="stdkf">'+RELY_FACTS.slice(0,10).map(function(p){
    var v=p[0]==='Market cap' ? '<span id="relyMc">'+esc(p[1])+'</span>' : esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}

// ── Block 2 — Description (high-level; non-redundant with the blocks below). ──
var RELY_LEDE = 'Remitly is a digital, mobile-first cross-border money-transfer and financial-services company built for immigrants and their families. Senders — mostly in the US and Europe — move money via the app to recipients in 170+ countries, who receive it to bank accounts, mobile wallets, or cash pickup, often within minutes. It earns a transaction fee plus an FX spread on each transfer (together the "take rate"), and is layering financial-services products on top of the core remittance rails.';

// ── Block 3 — the 4-quadrant (each cell ≤ ~30 words). Synthesized from DESC + HOW_MONEY. ──
var RELY_BIZ=[
  ['What it sells','Digital cross-border money transfers — app/web remittances paid out to bank accounts, mobile wallets, cash pickup and home delivery across 170+ countries, often in minutes — plus newer financial services (Remitly One, Business, Developers API).'],
  ['Who buys it','Immigrants and their families: senders concentrated in the US and Europe supporting recipients across 170+ receive countries. Recurring, non-discretionary family-support flows — a durable, habitual customer base.'],
  ['How it earns','A transaction fee + an FX spread on each transfer — together the effective take rate (revenue ÷ send volume), ~2.05% in Q1 2026. Revenue compounds with active customers × send volume. FY2025 revenue ~$1.6B (+29%).'],
  ['The edge','Digital-first, mobile-native delivery — typically cheaper and faster than legacy cash/agent networks — plus deep corridor density (5,100+), a pre-funded local-currency payout network for minutes-fast delivery, and brand trust with immigrant communities.'],
];
function stdFourQuad(){
  return '<div class="q2">'+RELY_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}

// ── Headline KPIs (Q1 2026 unless noted) — the demand pulse. ──
var KPIS = [
  { l:'Active Customers', v:'9.6M',    d:pctStr(yoyPct(ACTIVE))+' YoY', dir:'up' },
  { l:'Send Volume',      v:'$22.1B',  d:pctStr(yoyPct(SENDVOL))+' YoY', dir:'up' },
  { l:'Revenue',          v:'$452.8M', d:'+25% YoY', dir:'up' },
  { l:'Adj. EBITDA',      v:'$101.6M', d:'+74% YoY', dir:'up' },
];
var AS_OF = 'Headline metrics are for the quarter ended March 31, 2026 (Q1 2026). Charts cover Q1 2021–Q1 2026.';
var FY_NOTE = 'FY2025: ~$1.6B revenue (+29%) · $74.9B send volume · ~2.05% latest-quarter take rate · first full year of GAAP profitability (net income $67.9M, Adj. EBITDA $272.2M, FCF $283M).';
function kpiTiles(){
  return '<div class="ov-kpis">' + KPIS.map(function(k){
    return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(k.l)+'</div><div class="ov-kpi-v">'+esc(k.v)+'</div><div class="ov-kpi-d '+(k.dir||'muted')+'">'+esc(k.d)+'</div></div>';
  }).join('') + '</div>';
}

// ── Block 4 — How it makes money. ──
var HOW_MONEY = [
  'Charges a <b>transaction fee</b> plus an <b>FX spread</b> on each transfer — together the effective <b>take rate</b> (revenue ÷ send volume), ~<b>2.05%</b> in Q1 2026.',
  'Revenue compounds with <b>active customers</b> and <b>send volume</b> — more senders moving more money each quarter.',
  'Take rate has trended down from a ~<b>2.44%</b> peak (Q4 2022) to ~<b>2.05%</b> (Q1 2026) even as send volume more than doubled — priced share gains, offset by scale + marketing efficiency.',
  'Digital, app-based delivery rather than legacy cash/agent networks — a structurally lower cost to serve.',
];

// ── Block 5 — Products (segments + growth drivers). ──
var SEGMENTS = [
  ['Consumer remittance (core)', 'App/web cross-border transfers to bank accounts, mobile wallets, cash pickup and home delivery. The vast majority of revenue. Managed as a single reportable segment.'],
  ['Remitly One', 'All-in-one financial membership (launched Sep 2025, $9.99/mo for eligible US customers) — move, manage and grow money across borders.'],
  ['Remitly Business', 'Newer category aimed at micro / small-business cross-border payments (highlighted at the 2025 Investor Day).'],
  ['Remitly for Developers', 'Remittance-as-a-service / API letting third parties embed Remitly\'s cross-border network.'],
];
// The drivers management points to for the 2028 targets (Investor Day, Dec 2025).
var DRIVERS = [
  ['Remitly Business', 'Cross-border payments for micro and small businesses — a new category.'],
  ['Receivers', 'Recipient-side products that monetize the other end of the transfer.'],
  ['Remitly One & financial services', 'Scale the membership and value-added products beyond pure send-money.'],
  ['Geographic expansion', 'Enter the remaining high-opportunity send markets (24 → top 50).'],
  ['Unit economics & marketing efficiency', 'AI-driven cost leverage to widen margins as the base scales.'],
  ['High-value senders & stablecoins', 'Move up to high-amount senders; explore stablecoin rails.'],
];
function stdProducts(){
  var segCards='<div class="stdp-seg">What it sells today</div><div class="stdp">'+SEGMENTS.map(function(s,i){
    return '<div class="stdp-card ov-clickable" data-detail="seg:'+i+'"><div class="stdp-n">'+esc(s[0])+'</div><div class="stdp-d">'+esc(s[1]).slice(0,90)+'…</div><div class="stdp-more">Read more ›</div></div>';
  }).join('')+'</div>';
  var drvCards='<div class="stdp-seg" style="margin-top:14px">Growth drivers — the levers to the 2028 targets</div><div class="ov-drivers">'+DRIVERS.map(function(d,i){
    return '<div class="ov-driver ov-clickable" data-detail="drv:'+i+'"><div class="ov-driver-t">'+esc(d[0])+'</div><div class="ov-driver-d">'+esc(d[1])+'</div><div class="ov-more">More ›</div></div>';
  }).join('')+'</div>';
  return segCards+drvCards;
}

// ── Block 6 — Competitor scatter (DYNAMIC). X = valuation multiple, Y = revenue growth,
// bubble = LIVE market cap (api.liveQuote). Multiple EV/EBITDA ⇄ P/E; basis Trailing ⇄
// Forward (default Forward). ⚠ Multiples & growth are web-sourced approximations (mid-2026),
// clearly directional; market caps are live. Unlisted rails (Zepz/Sendwave, MoneyGram) → caption. ──
var RELY_PEERS=[
  { tk:'RELY', n:'Remitly',        evT:28, evF:18, peT:45, peF:30, gt:29, gf:25, mc:4,  hl:true, why:'Digital-first immigrant-remittance leader — fastest grower in the group, newly and durably profitable (first full-year GAAP profit in 2025). A premium growth multiple as Adj-EBITDA margin scales toward the 20–22% 2028 target. Directional multiples.' },
  { tk:'WISE', n:'Wise',           evT:24, evF:18, peT:32, peF:26, gt:16, gf:15, mc:14, logo:null, why:'Wise plc (LSE: WISE) — "borderless banking" and low-cost mid-market FX for consumers and SMBs. Higher-value / SMB tilt vs Remitly\'s immigrant-remittance focus; a premium multiple on steady mid-teens growth. Directional.' },
  { tk:'WU',   n:'Western Union',  evT:6,  evF:6,  peT:6,  peF:6,  gt:-3, gf:-1, mc:3,  why:'The legacy giant — 200+ countries and an unmatched physical agent/cash network, but flat-to-declining as digital share migrates. A deep-value, high-yield multiple; the classic incumbent Remitly is taking share from. Directional.' },
  { tk:'PYPL', n:'PayPal (Xoom)',  evT:13, evF:11, peT:16, peF:14, gt:9,  gf:9,  mc:70, why:'PayPal owns Xoom, digital remittance bundled inside the PayPal ecosystem. Much larger and cheaper on multiples, but remittance is a small slice; Remitly is the standalone immigrant-focused brand with deeper corridor depth. Directional.' },
  { tk:'DLO',  n:'dLocal',         evT:16, evF:13, peT:24, peF:19, gt:22, gf:20, mc:3,  why:'Cross-border payments infrastructure for enterprises in emerging markets — a B2B merchant rail, adjacent rather than head-to-head with consumer remittance. Fast-growing at a mid-teens EV/EBITDA. Directional.' },
];
var RELY_SC={ type:'ev', basis:'f', peers:null };
function relyScReset(){ RELY_SC.peers=RELY_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function relyScMult(p){ if(RELY_SC.type==='ev') return RELY_SC.basis==='f'?p.evF:p.evT; return RELY_SC.basis==='f'?p.peF:p.peT; }
function stdPeerScatter(){
  var h='<style>.mg-tog-row{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 8px}'+
    '.mg-tog{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)}'+
    '.mg-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.mg-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.mg-pill.active{background:var(--navy);color:#fff}'+
    '.mg-dot{transition:.15s}.mg-node text{pointer-events:none}'+
    '.masc-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 2px}'+
    '.masc-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:999px;padding:3px 9px;background:var(--w);cursor:pointer;color:var(--navy)}'+
    '.masc-chip .x{color:var(--mu);font-weight:800}'+
    '.masc-add{display:inline-flex;gap:5px;align-items:center}'+
    '.masc-add input{width:74px;font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:7px;padding:3px 7px;text-transform:uppercase}'+
    '.masc-add button{font:inherit;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:7px;padding:3px 9px;background:#F2F5F8;cursor:pointer}'+
    '.mg-node .mg-dot{transition:stroke-width .12s}.mg-node:hover .mg-dot{stroke-width:4.5}.mg-node:hover{filter:drop-shadow(0 3px 7px rgba(16,20,26,.25))}'+
    '.mg-tip{position:fixed;z-index:60;width:262px;background:#fff;color:var(--navy);border-radius:12px;padding:0;overflow:hidden;box-shadow:0 12px 30px rgba(16,20,26,.28);pointer-events:none;border:1px solid var(--bdr)}'+
    '.mgt-hd{display:flex;align-items:center;gap:9px;padding:11px 13px 8px}'+
    '.mgt-logo{width:32px;height:32px;border-radius:50%;border:2px solid;background:#fff;overflow:hidden;flex:none;display:flex;align-items:center;justify-content:center}.mgt-logo img{width:100%;height:100%;object-fit:cover;border-radius:50%}'+
    '.mgt-n{font-weight:800;font-size:14px}'+
    '.mgt-chips{display:flex;flex-wrap:wrap;gap:5px;padding:0 13px 8px}'+
    '.mgt-chip{font-size:10px;color:var(--mu);background:var(--surface);border:1px solid var(--bdr);border-radius:7px;padding:2px 7px}.mgt-chip b{color:var(--navy);font-weight:800}'+
    '.mgt-why{font-size:11px;line-height:1.5;color:var(--navy);padding:8px 13px 12px;border-top:1px solid var(--bdr);background:#F8FAFC}</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Listed peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y) — each is its <b>company logo</b>, sized by <b>live market cap</b>. <span style="opacity:.75">Hover or tap a logo for the read.</span></div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgtype="ev">EV/EBITDA</button><button type="button" class="mg-pill" data-mgtype="pe">P/E</button></span></span>'+
     '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span></div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" id="relyScSvg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" id="relyScXlab">EV/EBITDA · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<g id="relyScNodes"></g>'+
  '</svg></div>';
  h+='<div class="masc-chips" id="relyScChips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">The map spans the <b>listed money-movement set</b> — the digital-native leader (<b>Remitly</b>), "borderless banking" (<b>Wise</b>), the legacy incumbent (<b>Western Union</b>), a bundled wallet (<b>PayPal/Xoom</b>) and an EM B2B rail (<b>dLocal</b>). Remove a peer with the <b>×</b> or add one by ticker. <b>Private / unlisted rivals — Zepz (WorldRemit / Sendwave) and MoneyGram (taken private in 2023)</b> — have no market multiple, so they sit on the qualitative map in <b>Deep Dive ▸ Top Line ▸ Industry Analysis</b>. <span class="ave-subh-note">Multiples & growth are approximate, web-sourced (mid-2026); market caps are live. Directional, not exact.</span></div>';
  h+='<div id="relyScTip" class="mg-tip" hidden></div>';
  return h;
}
function relyScRender(root){
  var g=root.querySelector('#relyScNodes'); if(!g||!RELY_SC.peers) return;
  var mLo=4, mHi=RELY_SC.type==='ev'?30:46, gLo=-5, gHi=32, X0=84, X1=610, Y0=250, Y1=46;
  var lab=root.querySelector('#relyScXlab'); if(lab) lab.textContent=(RELY_SC.type==='ev'?'EV/EBITDA':'P/E')+' · '+(RELY_SC.basis==='f'?'forward':'trailing');
  var frag='';
  RELY_SC.peers.forEach(function(p){
    if(!p.on) return; var m=relyScMult(p); if(m==null||isNaN(m)) return;
    var growth=RELY_SC.basis==='f'?p.gf:p.gt; if(growth==null) growth=p.gf!=null?p.gf:p.gt;
    var col=p.hl?RELY_BLUE:'#7A8699';
    var x=X0+Math.max(0,Math.min(1,(m-mLo)/(mHi-mLo)))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,((growth||0)-gLo)/(gHi-gLo)))*(Y0-Y1);
    var r=Math.max(15,Math.min(25, 13+Math.sqrt(Math.max(1,p.mc))*0.30)); var ri=r-2.5;
    var mono=esc((p.tk||p.n).slice(0,4));
    frag+='<g class="mg-node" data-tk="'+esc(p.tk)+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')" style="cursor:pointer">'+
      '<clipPath id="relyClip-'+esc(p.tk)+'"><circle r="'+ri.toFixed(1)+'"/></clipPath>'+
      '<circle class="mg-dot" r="'+r.toFixed(1)+'" fill="#fff" stroke="'+col+'" stroke-width="'+(p.hl?3.5:2)+'"></circle>'+
      '<text class="mg-mono" y="4" text-anchor="middle" font-family="Inter,sans-serif" font-size="'+(ri>18?12:10)+'" font-weight="800" fill="'+col+'">'+mono+'</text>'+
      '<image href="'+(p.logo?esc(p.logo):'https://assets.parqet.com/logos/symbol/'+esc(p.tk))+'" x="'+(-ri).toFixed(1)+'" y="'+(-ri).toFixed(1)+'" width="'+(2*ri).toFixed(1)+'" height="'+(2*ri).toFixed(1)+'" clip-path="url(#relyClip-'+esc(p.tk)+')" preserveAspectRatio="xMidYMid slice" onerror="this.remove()"></image>'+
      (p.hl?'<circle r="'+(r+3).toFixed(1)+'" fill="none" stroke="'+col+'" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6"></circle>':'')+
      '</g>';
  });
  g.innerHTML=frag;
}
function relyScChips(root){
  var box=root.querySelector('#relyScChips'); if(!box||!RELY_SC.peers) return;
  var h=RELY_SC.peers.map(function(p,i){ return '<span class="masc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="masc-add"><input id="relyScAddTk" placeholder="+ TICKER" maxlength="6"><button type="button" id="relyScAddBtn">Add</button></span>';
  box.innerHTML=h;
}

// ── Block 7 — Timeline. ──
var TIMELINE = [
  { y:'2011', t:'Founded in Seattle as <b>BeamIt Mobile</b> by Matt Oppenheimer, Josh Hug and Shivaas Gulati; goes through Techstars Seattle.', d:'Matt Oppenheimer had run mobile & internet banking for Barclays in Kenya, where he saw first-hand how expensive and slow it was for people to send money home. He teamed with Josh Hug and Shivaas Gulati and launched <b>BeamIt Mobile</b> through the Techstars Seattle accelerator.' },
  { y:'2012', t:'Rebrands to <b>Remitly</b>; first corridors go live (e.g. US → Philippines, US → India).', d:'The company rebranded to <b>Remitly</b> and lit up its first remittance corridors — early on the US → Philippines and US → India lanes — proving out the digital, app-based transfer model against the incumbent cash/agent networks.' },
  { y:'2014–19', t:'Scales with Series A→E funding (QED, PayU/Naspers); 2019 round at ~$900M valuation, expands send-from markets beyond the US.', d:'A sequence of venture rounds (QED Investors, PayU/Naspers and others) funded rapid corridor and geographic expansion. A 2019 round valued Remitly at ~<b>$900M</b> and it began adding send-from markets beyond the US (Canada, UK, EU, Australia).' },
  { y:'2020', t:'Reaches <b>~$1.5B</b> valuation (unicorn); launches Passbook neobank.', d:'Remitly crossed a ~<b>$1.5B</b> valuation, becoming a unicorn, and launched <b>Passbook</b>, a neobank for immigrants — an early move to expand beyond one-off transfers into deeper financial relationships.' },
  { y:'Sep 2021', t:'<b>IPO</b> on Nasdaq at $43.00/share (ticker RELY), raising ~$523M.', d:'Remitly went public on the Nasdaq under ticker <b>RELY</b> at <b>$43.00</b>/share, raising ~<b>$523M</b> — capital to fund corridor expansion, marketing and the build-out of financial-services products.' },
  { y:'Jan 2023', t:'Completes acquisition of <b>Rewire</b> (Israel); winds down Passbook in May 2023.', d:'Remitly closed its acquisition of <b>Rewire</b>, an Israel-based account-based financial platform for migrant workers, adding an account/wallet product and European reach. It wound down the standalone Passbook neobank in May 2023, consolidating financial-services efforts.' },
  { y:'2024', t:'Customers send <b>$54B+</b> across <b>5,100+ corridors</b>.', d:'Send volume surpassed <b>$54B</b> for the year across <b>5,100+</b> active corridors — evidence of the compounding flywheel of more active customers moving more money.' },
  { y:'2025', t:'Launches <b>Remitly One</b> (Sep); <b>Investor Day</b> (Dec) sets 2028 targets; <b>first full year of GAAP profitability</b>.', d:'Remitly launched <b>Remitly One</b>, an all-in-one financial membership, held its first <b>Investor Day</b> (Dec) laying out 2028 medium-term targets, and delivered its <b>first full year of GAAP profitability</b> (net income $67.9M, Adj. EBITDA $272.2M).' },
  { y:'Feb 2026', t:'<b>Sebastian Gunningham</b> becomes CEO; founder Matt Oppenheimer stays on as Chairman.', d:'<b>Sebastian Gunningham</b> — a seasoned operator (ex-Amazon S-team SVP, ex-WeWork Vice Chair) — became CEO and a director (effective Feb 19, 2026), while co-founder <b>Matt Oppenheimer</b> — CEO since 2011 — stepped back from the CEO role but continued as (non-employee) <b>Chairman of the Board</b>: a classic founder-to-operator handoff as the company scales toward its 2028 targets.' },
];
function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}

// ── M&A → Evolution ▸ M&A. ──
var MNA = [
  {
    name: 'Rewire (R2C Ltd.)', date: 'Closed Jan 2023', value: '~$80M (≈$77M aggregate)', status: 'Private',
    did: 'Account-based digital financial platform for migrant workers — multi-currency accounts, stored-balance wallet, transfers and bill pay.',
    geo: 'Headquartered in Israel; served migrant communities across Europe.',
    product: 'Migrant neobank: accounts + cards + cross-border transfers.',
    adds: 'Expands into complementary geographies (Israel/Europe) and adds an account-based product that deepens customer relationships beyond one-off transfers.',
  },
];

// ── Corridors → Top Line ▸ Customers. ──
var CORRIDORS = {
  sendFrom: 'Tens of send markets',
  receiveTo: '170+ receive countries',
  corridors: '5,100+ active corridors',
  payout: 'Payout to 3.5B+ bank accounts, 630M+ mobile wallets and ~470k cash-pickup locations.',
  topReceive: ['India', 'Mexico', 'Philippines'],
  concentration: 'The United States is the largest send market (~70% of send volume). Revenue from outside the top three receive markets (India/Mexico/Philippines) is now >50% of total — a sign of growing diversification.',
};

// ── Prefunding → Bottom Line ▸ Unit Economics. ──
var PREFUNDING = [
  'To pay recipients <b>in minutes</b>, Remitly keeps its own cash <b>pre-positioned in local-currency accounts</b> in each disbursement market <i>before</i> the sender\'s funds have settled.',
  'It pre-funds disbursement partners <b>~1–2 business days in advance</b>, sized to <b>forecasted send volume</b> per corridor.',
  'This creates a <b>working-capital requirement</b>: cash is deployed into payout markets ahead of collecting from senders — too little starves the customer experience, too much leaves idle cash.',
  'Efficient prefunding (right amount, right place, right time) is central to free-cash-flow generation.',
];

// ── Peers → Top Line ▸ Industry (qualitative table, consistent with the scatter). ──
var PEERS = [
  ['Wise (ex-TransferWise)', 'Multi-currency accounts + low-cost mid-market FX; consumers and businesses.', 'More "borderless banking" / higher-value & SMB transfers; Remitly is immigrant-remittance-first with deeper cash-out and mobile-wallet payout.'],
  ['Western Union', 'Legacy giant, 200+ countries, vast physical agent/cash network.', 'Remitly is digital-first, typically cheaper and faster; WU keeps unmatched physical payout reach.'],
  ['MoneyGram', 'Agent network + digital transfers, 200+ countries (private since 2023).', 'Similar cash/retail heritage; Remitly competes on app experience and price.'],
  ['Xoom (PayPal)', 'Digital remittance bundled inside PayPal.', 'Tied to the PayPal ecosystem; Remitly is a standalone immigrant-focused brand with broader corridor depth.'],
  ['Zepz (WorldRemit / Sendwave)', 'Mobile-first remittance apps; Sendwave strong in Africa/Asia (private).', 'Closest digital-native peer; competes corridor-by-corridor on price and payout options.'],
  ['dLocal', 'Cross-border payments infrastructure for enterprises in emerging markets.', 'A B2B merchant rail, not consumer remittance — adjacent rather than head-to-head.'],
];

// ── Bull / Bear (from TAILWINDS / HEADWINDS, evidence-framed). ──
var TAILWINDS = [
  '<b>Cash-to-digital shift:</b> a large remittance market still migrating from cash/agent to digital — structural share gain for digital-first players.',
  '<b>Smartphone penetration</b> in send and receive markets keeps expanding the addressable base.',
  '<b>Recurring, non-discretionary flows:</b> senders support family regularly → durable, habitual volume.',
  '<b>US remittance tax (OBBBA §4475, 2026):</b> the 1% excise hits cash/money-order transfers but <b>exempts card- and bank-funded transfers</b> — favoring Remitly\'s digital model while taxing cash-based rivals.',
  '<b>Compounding scale advantages</b> — corridor density, payout network, brand trust and marketing efficiency all improve with size.',
];
var HEADWINDS = [
  '<b>Take-rate compression:</b> price/competition pressure from well-funded digital rivals (Wise, Zepz) can keep grinding the take rate down.',
  '<b>FX volatility</b> affects the spread and the value of pre-positioned local-currency balances.',
  '<b>Heavy regulatory/compliance burden</b> — money-transmitter licensing, AML/KYC, sanctions — across 170+ countries.',
  '<b>Immigration-policy crackdowns</b> could dampen overall flows even where Remitly\'s funding mix is favored.',
  '<b>Working-capital / prefunding intensity</b> scales with volume and is sensitive to funding costs.',
];

// ── TAM → Top Line ▸ TAM (Investor Day, Dec 2025). ──
var TAM = [
  { v:'~$2T',    l:'Consumer (C2C) TAM',       s:'Remitly\'s core addressable remittance pool.' },
  { v:'<4%',     l:'Remitly share of TAM',     s:'Long runway — management\'s "headroom" for growth.' },
  { v:'24 / 50', l:'Top send markets live',    s:'The top 50 send countries are ~92% of global C2C TAM.' },
  { v:'>$22T',   l:'Total cross-border flows', s:'New products (Business, Receivers) expand the TAM by orders of magnitude.' },
];
// ── 2028 medium-term targets (Investor Day, Dec 2025). ──
var TARGETS = [
  { v:'$2.6–3.0B',  l:'Revenue',     s:'Medium-term target by 2028.' },
  { v:'$575–600M',  l:'Adj. EBITDA', s:'20–22% margin.' },
  { v:'Rule of 40', l:'Framework',   s:'3-yr revenue CAGR + Adj. EBITDA margin ≥ 40%.' },
];

// ── Annual financials → Valuation ▸ Financials. Remitly is NOT in the Summit DCF universe,
// so these are REPORTED actuals (revenue, send volume) plus the research-team quarterly series
// rolled up — FY2021–FY2025, no forward projection. Adj EBITDA is directional. ──
var FIN_YEARS = [2021, 2022, 2023, 2024, 2025];
var FIN_EST   = [false, false, false, false, false];
function _finMoney(v){ return v==null?'—':(v>=1000?'$'+(v/1000).toFixed(2)+'B':'$'+Math.round(v)+'M'); }
function _finVolB(v){ return v==null?'—':'$'+v.toFixed(1)+'B'; }
function _finPct(v){ return v==null?'—':v.toFixed(2)+'%'; }
var FIN_SERIES = {
  finRev:    { label:'Revenue',      type:'bar',  color:RELY_BLUE,  data:[257, 459, 944, 1265, 1634], fmt:_finMoney },
  finVol:    { label:'Send Volume',  type:'bar',  color:RELY_STEEL, data:[16.2, 25.9, 39.5, 54.4, 74.9], fmt:_finVolB },
  finTake:   { label:'Take Rate',    type:'line', color:RELY_STEEL2,data:[1.59, 1.77, 2.39, 2.32, 2.18], fmt:_finPct },
  finEbitda: { label:'Adj. EBITDA',  type:'line', color:RELY_GREEN, data:[null, null, 25, 135, 272], fmt:_finMoney },
};
var FIN_INTRO = 'Remitly\'s annual trajectory — <b>reported</b> revenue and send volume, FY2021–FY2025. Remitly is not in the Summit DCF universe, so there is no forward model projection here. Take rate = revenue ÷ send volume; Adj. EBITDA turns solidly positive as the model scales (first full-year GAAP profit in 2025). Drag the timeline handles to mold the window; each chart\'s CAGR updates to your selection.';
var FIN_NOTE  = 'Annual, reported actuals (revenue & send volume). <b>Take rate</b> is revenue ÷ send volume (annual blend). <b>Adj. EBITDA</b> is directional (FY2023–FY2025; earlier years were around break-even/negative and are left blank). FY2025: ~$1.6B revenue, $74.9B send volume, Adj. EBITDA $272.2M, net income $67.9M, FCF $283M. Not company guidance; directional, not exact.';
var _finStart=2021, _finEnd=2025, _finCharts={};

// ── Margins → Bottom Line ▸ Margins (the profitability inflection). ──
var RELY_MRG_ROWS=[
  { fy:'FY23', ebitdaM:2.6 },
  { fy:'FY24', ebitdaM:10.7 },
  { fy:'FY25', ebitdaM:16.6 },
];

var OV_SOURCES = 'Sources — Remitly investor relations (Q1 2026 & FY2025 earnings releases, Dec 2025 Investor Day, Rewire acquisition & CEO-appointment releases), FY2024 10-K, and public reporting. Active-customer & send-volume series per internal research; annual revenue & send volume are reported actuals (Remitly is not in the Summit DCF universe). Peer multiples & growth are web-sourced approximations (mid-2026), labeled directional; market caps are live via Massive. Brand color is an estimate pending the official press-kit value.';
var DD_SOURCES = 'Sources — Remitly Global FY2025 & Q1 2026 earnings releases, FY2024 10-K, Dec 2025 Investor Day, Rewire acquisition & Feb 2026 CEO-appointment press releases, and public reporting. Earnings Calls built from the Q4 2023 – Q1 2026 transcripts + Investor Day; Supply Chain from Bloomberg SPLC (RELY US Equity, 20-Jul-2026). Financials are reported actuals; peer multiples are directional. Management roster verify against the latest DEF 14A.';

// ═══════════════════════════════════════════════════════════════════════════
//  STANDARDIZED OVERVIEW — the hook (Key Facts + live banner + lede + quad + collapsibles)
// ═══════════════════════════════════════════════════════════════════════════
function stdOverviewBody(c){
  var h='<style>.stdkf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--bdr);border-top:3px solid '+RELY_BLUE+';border-radius:12px;overflow:hidden;background:var(--w);margin:2px 0}'+
    '.stdkf-cell{padding:11px 13px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.stdkf-cell:nth-child(5n){border-right:none}.stdkf-cell:nth-child(n+6){border-bottom:none}'+
    '.stdkf-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:3px}'+
    '.stdkf-v{font-size:12px;font-weight:700;color:var(--navy);line-height:1.3}'+
    '@media(max-width:720px){.stdkf{grid-template-columns:repeat(2,1fr)}.stdkf-cell{border-right:none}}'+
    '.rely-live{display:flex;align-items:center;gap:10px;margin:10px 0 2px;padding:9px 13px;border:1px solid var(--bdr);border-radius:10px;background:var(--w);font-size:12px;color:var(--mu)}'+
    '.rely-live b{color:var(--navy);font-weight:800;font-size:14px}.rely-live .rely-live-dot{width:8px;height:8px;border-radius:50%;background:'+RELY_GREEN+';flex:none}'+
    '.ov-lede{margin:16px 0 6px;font-size:13px;line-height:1.6;color:var(--navy)}'+
    '.q2{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:var(--w);margin:4px 0}'+
    '.q2-cell{padding:13px 15px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.q2-cell:nth-child(2n){border-right:none}.q2-cell:nth-child(n+3){border-bottom:none}'+
    '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+RELY_BLUE+';margin-bottom:5px}'+
    '.q2-v{font-size:12px;color:var(--navy);line-height:1.5}.q2-v b{font-weight:800}'+
    '@media(max-width:600px){.q2{grid-template-columns:1fr}.q2-cell{border-right:none}.q2-cell:nth-child(n+2){border-bottom:1px solid var(--bdr)}.q2-cell:last-child{border-bottom:none}}'+
    '.ov-row{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:11.5px}.ov-row:last-child{border-bottom:none}.ov-row-k{color:var(--mu);font-weight:600}.ov-row-v{color:var(--navy);font-weight:800}'+
    '.stdp-seg{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:12px 0 7px}'+
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:'+RELY_BLUE+'}'+
    '.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:0 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:'+RELY_BLUE+';margin-top:6px}'+
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}</style>';
  // Hook (always visible): Key Facts, live banner, Description, 2×2 quadrant, KPI tiles
  h+=stdKeyFacts();
  h+='<div class="rely-live" id="relyLive"><span class="rely-live-dot"></span>Live quote loading…</div>';
  h+='<p class="ov-lede">'+esc(RELY_LEDE)+'</p>';
  h+=stdFourQuad();
  h+='<div style="margin-top:14px">'+kpiTiles()+'</div>';
  h+='<div class="ov-asof">'+esc(AS_OF)+'</div>';
  h+='<div class="ov-fynote">'+esc(FY_NOTE)+'</div>';
  // Progressive disclosure: everything below defaults collapsed
  h+=collapsible('How it makes money', bullets(HOW_MONEY));
  h+=collapsible('What it makes — the products', stdProducts());
  h+=collapsible('Competitors — valuation vs growth', stdPeerScatter());
  h+=collapsible('Timeline', stdTimeline());
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}
function html(c){
  var h='<div class="ov ov-rely" data-brand="RELY">';
  h+=stdOverviewBody(c);
  h+='<div class="ov-modal-back" id="ovModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="ovModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="ovModalT"></div><div class="ov-modal-b" id="ovModalB"></div></div></div>';
  h+='</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════
//  DEEP DIVE — the 5-tab spine (Top Line · Bottom Line · Evolution · Valuation ·
//  Management), like UBER/LYFT/CART/Visa. Root class .ov-rely-dd scopes it.
// ═══════════════════════════════════════════════════════════════════════════

// ── Top Line ▸ Segments (SEGMENTS + the 3 charts + HOW_MONEY + take-rate mechanics) ──
function ddSegmentsBody(c){
  var h='<p class="ov-lede">Remitly is managed as a <b>single reportable segment</b> — consumer cross-border remittance — with newer categories (Remitly One, Business, Developers) layered on top. The model is a <b>take-rate story</b>: revenue ≈ send volume × take rate, compounding with active customers.</p>';
  h+=sec('The demand engine — active customers, send volume & take rate',
    '<div class="ov-diagram-cap" style="margin:0 0 10px">The whole model in three charts: <b>active customers</b> and <b>send volume</b> compound, while the <b>take rate</b> drifts down as Remitly prices to win share — net-net revenue more than keeps pace.</div>'+
    '<div class="ov-charts">'+
      '<div class="ov-chart-card"><div class="ov-chart-t">Average Active Customers <span>(millions)</span></div><div class="ov-chart-wrap"><canvas id="ovChartActive"></canvas></div></div>'+
      '<div class="ov-chart-card"><div class="ov-chart-t">Send Volume <span>(USD millions, quarterly)</span></div><div class="ov-chart-wrap"><canvas id="ovChartVolume"></canvas></div></div>'+
      '<div class="ov-chart-card"><div class="ov-chart-t">Take Rate <span>(% of send volume)</span></div><div class="ov-chart-wrap"><canvas id="ovChartTake"></canvas></div></div>'+
    '</div>');
  h+=sec('What it sells — the segments',
    '<div class="ov-diagram-cap" style="margin:0 0 8px">The core is consumer remittance; the rest are the expansion bets. <b>Tap any card</b> for the detail.</div>'+
    '<div class="stdp">'+SEGMENTS.map(function(s,i){
      return '<div class="stdp-card ov-clickable" data-detail="seg:'+i+'"><div class="stdp-n">'+esc(s[0])+'</div><div class="stdp-d">'+esc(s[1]).slice(0,110)+'…</div><div class="stdp-more">Read more ›</div></div>';
    }).join('')+'</div>');
  h+=sec('How Remitly makes money', '<div class="ov-callout">'+bullets(HOW_MONEY)+'</div>');
  return h;
}
// ── Top Line ▸ Customers & Corridors (CORRIDORS) ──
function ddCustomersBody(c){
  var h='<p class="ov-lede">Remitly\'s customers are <b>immigrants and their families</b>. Senders concentrate in the US and Europe; recipients span 170+ countries. The moat is <b>corridor density</b> (5,100+) and a deep, pre-funded <b>payout network</b> that lets money arrive in minutes.</p>';
  h+=sec('Corridors & geographic reach',
    '<div class="ov-corr-stats">'+
      '<div class="ov-corr-stat"><div class="ov-corr-v">'+esc(CORRIDORS.sendFrom)+'</div><div class="ov-corr-l">Send from</div></div>'+
      '<div class="ov-corr-stat"><div class="ov-corr-v">'+esc(CORRIDORS.receiveTo)+'</div><div class="ov-corr-l">Receive in</div></div>'+
      '<div class="ov-corr-stat"><div class="ov-corr-v">'+esc(CORRIDORS.corridors)+'</div><div class="ov-corr-l">Active corridors</div></div>'+
    '</div>'+
    '<div class="ov-row"><div class="ov-row-k">Payout reach</div><div class="ov-row-v">'+esc(CORRIDORS.payout)+'</div></div>'+
    '<div class="ov-row"><div class="ov-row-k">Top receive markets</div><div class="ov-row-v">'+CORRIDORS.topReceive.map(function(x){return '<span class="ov-tag">'+esc(x)+'</span>';}).join('')+'</div></div>'+
    '<div class="ov-row"><div class="ov-row-k">Concentration</div><div class="ov-row-v">'+esc(CORRIDORS.concentration)+'</div></div>');
  h+='<div class="ov-foot">Corridor, payout and concentration figures per Remitly IR / FY2024 10-K & FY2025 disclosures.</div>';
  return h;
}
// ── Top Line ▸ TAM (TAM boxes + penetration framing) ──
function ddTamBody(c){
  function statBox(b){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+esc(b.l)+'</div><div class="ov-kpi-v">'+esc(b.v)+'</div><div class="ov-kpi-d muted">'+esc(b.s)+'</div></div>'; }
  var h='<p class="ov-lede">Remitly sizes its opportunity at the Dec 2025 Investor Day: a ~<b>$2T consumer (C2C) remittance TAM</b> of which it holds <b>&lt;4%</b> — a long runway — and a far larger <b>&gt;$22T</b> total cross-border pool that newer products (Business, Receivers) begin to address.</p>';
  h+='<div class="ov-kpis">'+TAM.map(statBox).join('')+'</div>';
  h+=sec('How little is penetrated — the runway',
    '<div class="ov-diagram-cap" style="margin:0 0 8px">Remitly captures under 4% of its core ~$2T remittance TAM, and is live in 24 of the top 50 send markets (which are ~92% of global C2C flows). The emptiness is the opportunity.</div>'+
    '<div style="margin:10px 0"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px"><span style="font-size:12.5px;font-weight:800;color:var(--navy)">Consumer (C2C) TAM — ~$2T</span><span style="font-size:13px;font-weight:900;color:'+RELY_BLUE+'">&lt;4% captured</span></div>'+
    '<div style="height:22px;background:#EEF2F7;border-radius:6px;overflow:hidden"><div style="height:100%;width:4%;background:'+RELY_BLUE+';border-radius:6px"></div></div>'+
    '<div style="font-size:11px;color:var(--mu);margin-top:4px">the vast majority of remittance flows are still with cash/agent incumbents or informal channels</div></div>'+
    '<div style="margin:10px 0"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px"><span style="font-size:12.5px;font-weight:800;color:var(--navy)">Top send markets live — 24 / 50</span><span style="font-size:13px;font-weight:900;color:'+RELY_GOLD+'">~48%</span></div>'+
    '<div style="height:22px;background:#EEF2F7;border-radius:6px;overflow:hidden"><div style="height:100%;width:48%;background:'+RELY_GOLD+';border-radius:6px"></div></div>'+
    '<div style="font-size:11px;color:var(--mu);margin-top:4px">the top 50 send countries are ~92% of global C2C TAM — geographic expansion is a core 2028 lever</div></div>');
  h+='<div class="ov-callout"><b>Sourcing note:</b> all TAM figures are <b>Remitly-cited</b> (Investor Day, Dec 2025) — company estimates of addressable flows, not an independent third-party number.</div>';
  h+='<div class="ov-foot">Source: Remitly Investor Day, Dec 2025.</div>';
  return h;
}
// ── Top Line ▸ Industry Analysis (PEERS table + bull/bear with evidence) ──
function ddIndustryBody(c){
  var h='<style>.mbb{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:6px 0}@media(max-width:720px){.mbb{grid-template-columns:1fr}}'+
    '.mbb-col{border:1px solid var(--bdr);border-radius:11px;padding:13px 15px;background:var(--w)}.mbb-bull{border-top:3px solid '+RELY_GREEN+'}.mbb-bear{border-top:3px solid #C0392B}'+
    '.mbb-h{font-size:13px;font-weight:800;color:var(--navy);margin-bottom:6px}</style>';
  h+='<p class="ov-lede">The remittance market is a shift <b>from cash/agent to digital</b>. Remitly is the digital-native leader taking share from legacy incumbents (Western Union, MoneyGram) while competing corridor-by-corridor with other digital rivals (Wise, Zepz). First the competitive map, then the bull/bear.</p>';
  h+=sec('Peers — the competitive map',
    '<div class="ov-chart-card" style="overflow-x:auto"><table class="ov-table"><thead><tr><th>Peer</th><th>What they offer</th><th>How Remitly differs</th></tr></thead><tbody>'+
    PEERS.map(function(p){return '<tr><td class="ov-td-name">'+esc(p[0])+'</td><td>'+esc(p[1])+'</td><td>'+esc(p[2])+'</td></tr>';}).join('')+
    '</tbody></table></div>'+
    '<div class="ov-diagram-cap" style="margin-top:8px"><b>Why a different peer set than the Overview scatter?</b> This map is qualitative and by <b>business model</b> — including the <b>private</b> rivals (Zepz/Sendwave, MoneyGram) that have no market multiple. The Overview scatter is the <b>listed</b> subset (Remitly, Wise, Western Union, PayPal, dLocal) mapped by valuation.</div>');
  h+=sec('The investment forces — bull vs bear (with the evidence)',
    '<div class="mbb"><div class="mbb-col mbb-bull"><div class="mbb-h">▲ Bull</div>'+bullets(TAILWINDS)+'</div>'+
    '<div class="mbb-col mbb-bear"><div class="mbb-h">▼ Bear</div>'+bullets(HEADWINDS)+'</div></div>'+
    '<div class="ov-fynote" style="margin-top:10px"><b>What to watch:</b> (1) the <b>take-rate</b> trajectory vs Wise/Zepz price competition; (2) Adj-EBITDA-margin progress toward the 20–22% 2028 target; (3) active-customer & send-volume growth; (4) diversification beyond the top-3 receive markets; (5) the OBBBA remittance-tax effect on funding mix; (6) immigration-policy shifts in key send markets.</div>');
  h+='<div class="ov-foot">Sources: Remitly IR & FY2024 10-K; company/press reporting on Wise, Western Union, MoneyGram, Zepz and dLocal; OBBBA §4475 (2026 remittance excise). Competitive framing is editorial.</div>';
  return h;
}

// ── Bottom Line ▸ Unit Economics (take-rate mechanics + PREFUNDING working capital) ──
function ddUnitEconBody(c){
  var h='<p class="ov-lede">Remitly has no cost of goods in the classic sense — its unit economics are a <b>take-rate</b> story plus a <b>working-capital</b> story. Two things to model: how many basis points it keeps on each dollar of send volume, and how much cash it must <b>pre-position</b> to pay recipients in minutes.</p>';
  h+=sec('The take rate — how a transfer becomes revenue',
    '<div class="ov-kpis">'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Take rate (Q1 26)</div><div class="ov-kpi-v">~2.05%</div><div class="ov-kpi-d muted">revenue ÷ send volume</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Peak take rate</div><div class="ov-kpi-v">~2.44%</div><div class="ov-kpi-d muted">Q4 2022, since drifting down</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Made of</div><div class="ov-kpi-v">fee + FX</div><div class="ov-kpi-d muted">transaction fee + spread</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Send volume (Q1 26)</div><div class="ov-kpi-v">$22.1B</div><div class="ov-kpi-d muted">the base the rate is applied to</div></div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:10px">Revenue ≈ <b>send volume × take rate</b>. The take rate has fallen from ~2.44% (Q4 2022) to ~2.05% (Q1 2026) as Remitly prices to win share — but send volume more than doubled over the same window, so revenue compounds. The bet: <b>scale + marketing efficiency</b> widen margins even as the headline take rate grinds lower.</div>');
  h+=sec('The prefunding mechanism — the working-capital engine',
    '<div class="ov-callout">'+bullets(PREFUNDING)+'</div>');
  h+='<div class="ov-foot">Take-rate and prefunding mechanics per Remitly FY2024 10-K & earnings disclosures.</div>';
  return h;
}
// ── Bottom Line ▸ Suppliers — Bloomberg SPLC (RELY US Equity, as of 20-Jul-2026).
//    SPLC discloses only a small public slice: 3 named suppliers, 0 named customers.
//    Grade = Bloomberg default-risk grade (IG = investment-grade, HY = high-yield). ──
var SPLC_SUPPLIERS=[
  { n:'Euronet Worldwide Inc', tk:'EEFT', ind:'Specialty Finance', dom:'United States', mc:'$3.1B', grade:'IG8', risk:'0.10%', chg:'+8.3%', flag:'',
    role:'Global payments + money-transfer rails — the <b>payout / disbursement</b> layer.',
    detail:'<b>What it is:</b> Euronet (NASDAQ: EEFT) runs EFT processing, epay, and a large money-transfer business (<b>Ria, Xe, Dandelion</b>). Its <b>Dandelion</b> real-time payout API and Ria network are exactly the kind of <b>last-mile disbursement rails</b> Remitly pre-funds to pay recipients.<br><br><b>Why it matters:</b> the single largest of the three by market cap ($3.1B) and investment-grade (IG8, ~0.10% default risk). <br><br><b>⚑ Frenemy:</b> Euronet\'s Ria/Xe compete with Remitly on the consumer side even as its infrastructure supplies part of the payout network — a classic supplier-and-rival.' },
  { n:'Currenc Group Inc', tk:'CURR', ind:'Specialty Finance', dom:'Singapore', mc:'$0.4B', grade:'HY2', risk:'1.33%', chg:'+6.0%', flag:'⚠ HY2',
    role:'Asia cross-border payout hub (Tranglo) — a <b>disbursement</b> dependency.',
    detail:'<b>What it is:</b> Currenc Group (NASDAQ: CURR, ex-Seamless Group) operates <b>Tranglo</b>, a cross-border payment hub connecting senders to bank and wallet payout across Asia — a <b>disbursement / settlement</b> partner.<br><br><b>⚠ The watch item:</b> the only <b>high-yield</b> name of the three — Bloomberg grade <b>HY2</b>, ~<b>1.33% default risk</b> (vs ~0.1% and ~0.01% for the others) and the smallest ($0.4B mkt cap). A payout-network dependency worth monitoring for counterparty risk.' },
  { n:'GB Group PLC', tk:'GBG', ind:'Software', dom:'United Kingdom', mc:'$0.7B', grade:'IG4', risk:'0.01%', chg:'+2.4%', flag:'',
    role:'Identity, KYC & fraud (GBG / IDscan / Acuant) — the <b>trust</b> layer.',
    detail:'<b>What it is:</b> GB Group (LSE: GBG) is an <b>identity verification, KYC and fraud</b> software vendor (GBG Identity, IDscan, Acuant).<br><br><b>Why it matters:</b> it sits behind Remitly\'s <b>onboarding and transaction screening</b> — the compliance/risk layer that gates the "trust and safety advantage" management keeps citing. Lowest default risk of the three (IG4, ~0.01%). The only non-finance supplier (Software).' },
];
// Bloomberg "Est Company Revenue %" by geography (directional estimate).
var SPLC_GEO=[['United States',66.24,RELY_BLUE],['Canada',10.02,'#0F9D58'],['China',4.96,'#7A5AF8'],['Mexico',1.55,RELY_GOLD]];
function ddSuppliersBody(c){
  var gr=function(g){ return g.charAt(0)==='H'?'#B7791F':RELY_STEEL2; };
  var h='<p class="ov-lede">Remitly is <b>asset-light</b>: its "supply chain" is the network of <b>pay-in and payout partners</b> it uses to collect from senders and pre-fund recipients, plus its <b>identity / fraud / compliance</b> vendors. <b>Bloomberg SPLC discloses only a small public slice</b> — <b>3 named suppliers, 0 named customers</b> (RELY US Equity, as of 20-Jul-2026) — because Remitly\'s customers are millions of individuals and small businesses, not disclosed corporates.</p>';
  h+=sec('Named suppliers — the disclosed vendor set',
    '<div class="ov-diagram-cap" style="margin:0 0 10px">Only three suppliers are named, and they map cleanly to Remitly\'s two biggest cost buckets: <b>payout networks</b> (Euronet, Currenc/Tranglo) and <b>identity / fraud</b> (GB Group). <b>Tap a card</b> for the read. Cost % and relationship size are undisclosed in SPLC.</div>'+
    '<div class="stdp">'+SPLC_SUPPLIERS.map(function(s,i){
      return '<div class="stdp-card ov-clickable" data-detail="sup:'+i+'">'+
        '<div class="stdp-n">'+esc(s.n)+' <span style="font-size:9.5px;font-weight:700;color:var(--mu)">'+esc(s.tk)+'</span></div>'+
        '<div style="display:flex;gap:5px;flex-wrap:wrap;margin:6px 0 7px">'+
          '<span style="font-size:9.5px;font-weight:700;color:var(--mu);background:var(--surface);border:1px solid var(--bdr);border-radius:7px;padding:2px 7px">'+esc(s.dom)+'</span>'+
          '<span style="font-size:9.5px;font-weight:700;color:var(--mu);background:var(--surface);border:1px solid var(--bdr);border-radius:7px;padding:2px 7px">'+esc(s.ind)+'</span>'+
          '<span style="font-size:9.5px;font-weight:800;color:#fff;background:'+gr(s.grade)+';border-radius:7px;padding:2px 7px">'+esc(s.grade)+'</span>'+
          (s.flag?'<span style="font-size:9.5px;font-weight:800;color:#B7791F;background:#FBF3E4;border:1px solid #E8C77A;border-radius:7px;padding:2px 7px">'+esc(s.flag)+'</span>':'')+
        '</div>'+
        '<div class="stdp-d">'+s.role+'</div>'+
        '<div class="stdp-more">Read more ›</div></div>';
    }).join('')+'</div>');
  h+=sec('Where the revenue sits — Bloomberg estimate',
    '<div class="ov-diagram-cap" style="margin:0 0 8px">SPLC\'s estimated company revenue by geography — US-heavy, consistent with Remitly\'s largest send market. Directional Bloomberg estimate.</div>'+
    '<div class="ov-chart-card" style="padding:15px 18px">'+SPLC_GEO.map(function(g){
      return '<div style="display:flex;align-items:center;gap:10px;margin:6px 0">'+
        '<div style="width:120px;font-size:11.5px;font-weight:700;color:var(--navy);text-align:right;flex:none">'+esc(g[0])+'</div>'+
        '<div style="flex:1;height:18px;background:#F1F4F8;border-radius:5px;overflow:hidden"><div style="height:100%;width:'+g[1].toFixed(0)+'%;background:'+g[2]+';border-radius:5px"></div></div>'+
        '<div style="width:52px;font-size:12px;font-weight:900;color:'+g[2]+';flex:none">'+g[1].toFixed(2)+'%</div></div>';
    }).join('')+'<div style="font-size:10.5px;color:var(--mu);margin-top:6px">Remaining share spans the UK, Singapore and other send/receive markets. Bloomberg estimate, directional.</div></div>');
  h+=sec('Risk & ESG flags (Bloomberg SPLC)',
    '<div style="display:flex;gap:9px;flex-wrap:wrap">'+
      '<div style="flex:1;min-width:150px;border:1px solid var(--bdr);border-left:3px solid #0F9D58;border-radius:10px;padding:10px 12px;background:var(--w)"><div style="font-size:11.5px;font-weight:800;color:var(--navy)">✓ No sanctions</div><div style="font-size:10.5px;color:var(--mu);margin-top:3px">No suppliers or customers carry sanctions.</div></div>'+
      '<div style="flex:1;min-width:150px;border:1px solid var(--bdr);border-left:3px solid #0F9D58;border-radius:10px;padding:10px 12px;background:var(--w)"><div style="font-size:11.5px;font-weight:800;color:var(--navy)">✓ None distressed</div><div style="font-size:10.5px;color:var(--mu);margin-top:3px">No suppliers or customers flagged as distressed.</div></div>'+
      '<div style="flex:1;min-width:150px;border:1px solid var(--bdr);border-left:3px solid #B7791F;border-radius:10px;padding:10px 12px;background:var(--w)"><div style="font-size:11.5px;font-weight:800;color:var(--navy)">⚑ ESG / GHG flags</div><div style="font-size:10.5px;color:var(--mu);margin-top:3px">1 of 3 suppliers an ESG-score laggard; all 3 flagged high GHG vs peers. Business-conduct / water / physical risk: none.</div></div>'+
    '</div>');
  h+=sec('Customers — none disclosed',
    '<div class="ov-callout"><div style="font-size:12px;color:var(--navy);line-height:1.6"><b>0 named customers.</b> This is expected, not a gap: Remitly sells to <b>millions of individual senders and small businesses</b>, so there are no large disclosed corporate customers for SPLC to surface. The demand-side picture lives in <b>Top Line ▸ Customers & Corridors</b> (who sends, and to where).</div></div>');
  h+='<div class="ov-foot">Source: Bloomberg SPLC (RELY US Equity), as of 20-Jul-2026 — 3 named suppliers, 0 named customers. Supplier roles are an editorial read of each company\'s business; cost % / relationship size are undisclosed in SPLC. Grades are Bloomberg default-risk grades (IG = investment-grade, HY = high-yield).</div>';
  return h;
}
// ── Bottom Line ▸ Margins (the profitability inflection) ──
function ddMarginsBody(c){
  var h='<p class="ov-lede">The profitability story reads in one line: Remitly went from cash-burning growth to its <b>first full year of GAAP profit in 2025</b>. Adjusted EBITDA margin has stepped up sharply as revenue scales against a largely fixed cost base — and management targets a <b>20–22%</b> margin by 2028.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY2025 Adj. EBITDA</div><div class="ov-kpi-v">$272.2M</div><div class="ov-kpi-d up">~17% margin</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY2025 net income</div><div class="ov-kpi-v">$67.9M</div><div class="ov-kpi-d up">first full-year GAAP profit</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY2025 free cash flow</div><div class="ov-kpi-v">$283M</div><div class="ov-kpi-d up">FCF-positive</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">2028 Adj. EBITDA margin</div><div class="ov-kpi-v">20–22%</div><div class="ov-kpi-d muted">medium-term target</div></div>'+
  '</div>';
  h+=sec('Adjusted EBITDA margin — the inflection',
    '<div class="ov-chart-card"><div class="ov-chart-t">Adj. EBITDA margin (% of revenue) <span>· fiscal years</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="relyChartMargins"></canvas></div></div>'+
    '<div class="ov-fynote" style="margin-top:8px">Adj. EBITDA margin: FY2023 ~<b>2.6%</b> → FY2024 ~<b>10.7%</b> → FY2025 ~<b>16.6%</b>, on the path toward the <b>20–22%</b> 2028 target. Earlier years (FY2021–22) were around break-even/negative as Remitly invested in corridors and marketing. Margins are directional (Adj. EBITDA ÷ revenue).</div>');
  h+='<div class="ov-foot">Sources: Remitly FY2023–FY2025 earnings releases (Adj. EBITDA, net income, FCF); Dec 2025 Investor Day (2028 margin target). Margin percentages are directional.</div>';
  return h;
}
// ════════════════════════════════════════════════════════════════════════════
//  Evolution ▸ CALL PREP — the decision layer (docs/CALL_PREP_CONVENTIONS.md v2.4)
//  Ported from googl.js / ibkr.js (canonical) via the Visa build. Four phases —
//  Setup · Watch List · Post-Results · Post-Call — as per-quarter blocks behind a
//  quarter selector. The theme record (RELY_THEMES) is FOLDED into the Watch List
//  (v2.3 fusion) — there is NO standalone Earnings Calls tab. Consensus (Bloomberg
//  BST) + Summit + the 4 custom KPIs render 'to fill'/'to define' until the export
//  lands. Remitly is a digital-remittance / consumer-fintech model (not a card network).
// ════════════════════════════════════════════════════════════════════════════
// Call Prep palette (Remitly identity): blue primary + gold custom-KPI accent.
var BRAND=RELY_BLUE, BRAND2=RELY_GREEN, BLUE='#2557D6', RED='#EA4335', YELLOW=RELY_GOLD, PURPLE='#7A5AF8', AMBER='#B7791F', GRAY='#64748B';
var CALL_PREP = { ticker:'RELY', quarters:[
  // ── UPCOMING: Q2 2026 (quarter ending Jun 2026; reports ~early Aug 2026) ──
  { q:'Q2 2026', status:'upcoming', date:'reports ~early August 2026',
    setup:{ source:'Bloomberg BST consensus — to import from the export', asOf:null,
      headline:[
        {k:'Revenue', cons:null, us:null, note:{t:'Guided $483–485M (+17–18%)',h:'Management guided Q2 revenue to <b>$483–485M, +17–18%</b> — a step down from Q1\'s +25% as the Q1 tailwinds reverse (US tax refunds, remittance-tax offline→online surge, Middle-East surge, Ramadan/Easter pulled into Q1) and comps toughen. Full-year is $1.96–1.975B (+20–21%), with H2 re-accelerating to ~20%. Street/Summit fill from the Bloomberg export.'}},
        {k:'Operating income', cons:null, us:null, note:{t:'Remitly guides to Adjusted EBITDA',h:'Remitly does not guide to GAAP operating income; its profit guide is Adjusted EBITDA (Q2 $86–88M, ~18% margin). GAAP net income is now positive each quarter.'}},
        {k:'EPS', cons:null, us:null},
        {k:'Adjusted EBITDA', cons:null, us:null, note:{t:'Guided $86–88M (~18% margin)',h:'Q2 Adj EBITDA guided to <b>$86–88M</b>, ~18% margin, ~+250bps YoY. Q2 SBC steps up (hiring shifted out of Q1 + tougher forfeiture comps). FY Adj EBITDA $370–385M (~19% margin).'}},
      ],
      custom:[ {k:null},{k:null},{k:null},{k:null} ], // 4 custom KPIs — to define with Dani (candidates: send volume · quarterly active customers · send/active customer · RLTE)
      marketDebate:{
        fear:'That Q1\'s +25% was a one-time confluence (remittance-tax offline→online, elevated tax refunds, a Middle-East surge, holiday timing) — and the Q2 step-down to +17–18% is the real core rate, making the guided H2 re-acceleration to ~20% a stretch.',
        real:'Consensus reads Q1 as genuinely inflated but sees a durable core (QAU +20% accelerating, RLTE +28% > revenue, record retention) plus scaling growth accelerators funding the H2 re-accel — a Q2 trough by mechanics, not a demand crack.',
        mech:[ {k:'Remittance-tax offline→online',v:'Q1 surge, "no science"',dir:'down'}, {k:'US tax refunds + ME surge',v:'reverse into Q2',dir:'down'}, {k:'Ramadan/Easter',v:'pulled into Q1',dir:'down'}, {k:'Growth accelerators + core',v:'H2 re-accel to ~20%',dir:'up'} ],
        synth:'The one thing to resolve: strip out the transitory Q1 stack — what is the <b>clean, durable core growth rate</b>, and does the guided H2 re-acceleration to ~20% actually show up, or does the core settle in the high-teens?'
      },
      debate:null },
    watchList:[
      { rank:1, metric:'Durable core growth vs the transitory Q1 stack', since:'Q1 2026', tags:['core-send','growth','one-timers'],
        pista:'Stripping out remittance-tax / tax-refunds / Middle-East / holiday timing — does H2 re-accelerate to the guided ~20%, or does the clean core settle in the high-teens?',
        breaks:'The clean core rate settles below ~15% and the guided H2 re-acceleration does not materialize.',
        seededBy:{ q:'Q1 2026', n:'Darrin Peller asked management to back out the one-timers (remittance tax, Middle-East, tax refunds) and name the sustainable rate; the answer leaned on growth accelerators + core, but Q2 still guides down to +17–18%.' },
        src:'Q1 2026: revenue +25% aided by remittance-tax offline→online, elevated US tax refunds, a UAE surge (+150%), and Ramadan/Easter pulled forward; Q2 guided +17–18%, H2 ~20%.',
        why:'The whole bull case is durable ~20%+ compounding toward the $3B/2028 target; if Q1 was a one-time spike, the trajectory resets.',
        thread:[ {q:'Q4 2025',n:'Revenue +26%; FY25 +29%; strong December holiday.'},{q:'Q1 2026',n:'Revenue +25% on a transitory stack; Q2 guided +17–18%, H2 re-accel to ~20%.'} ] },
      { rank:2, metric:'AI margin leverage — durable or one-time?', since:'Q1 2026', tags:['ai','margins','opex'],
        pista:'Does opex leverage hold once the Q1 hiring pause ends (Q2 SBC + hiring step back up), or was the margin beat partly a one-time freeze?',
        breaks:'Margin expansion reverses as reinvestment/hiring ramps, showing the leverage was a pause, not structural AI.',
        seededBy:{ q:'Q1 2026', n:'Sebastian\'s thesis: "significantly more revenue with roughly the same headcount in 3–4 years"; Q1 EBITDA beat was aided by a short-term hiring pause after in-quarter headcount cuts — Vikas flagged Q2 SBC/hiring stepping back up.' },
        src:'Q1 2026: 250+ headcount cuts YTD, corporate workforce −10%; T&D +14% vs revenue +25%; G&A +2% (lowest ever); Adj EBITDA $102M (record margin).',
        why:'The margin story is the new CEO\'s core bet — if it is durable AI leverage it self-funds growth; if it is a hiring freeze it unwinds.',
        thread:[ {q:'Q4 2025',n:'Adj EBITDA margin +500bps FY25; first full-year GAAP profit; AI fraud model +$10M RLTE.'},{q:'Q1 2026',n:'Record margin, but aided by a hiring pause; Q2 SBC guided higher.'} ] },
      { rank:3, metric:'Growth accelerators trajectory', since:'Q1 2026', tags:['high-value-senders','business','card'],
        pista:'Do high-value senders / business / card keep the >2x new-product growth toward the ~5%-in-2026, >10%-by-2028 path?',
        breaks:'Accelerators stall below plan or the >2x new-product growth decelerates.',
        seededBy:{ q:'Q1 2026', n:'Cris Kennedy / Zach asked how the accelerators are tracking vs plan; management said high-value senders (+73%) and business (+30% QoQ) are over-achieving, but the base is still ~5% of revenue.' },
        src:'Q1 2026: high-value senders volume +73%; Remitly Business +30% QoQ (20k+ users); new-product revenue >2x; accelerators ~5% of 2026 revenue, >10% by 2028.',
        why:'Accelerators are how Remitly diversifies beyond core remittance and defends the growth rate as core matures.',
        thread:[ {q:'Q4 2025',n:'New products ~1% of revenue in 2025; Flex 120k, Business 15k; >2x guided for 2026.'},{q:'Q1 2026',n:'High-value +73%, Business +30% QoQ, new-product rev >2x; receiver product first transactions.'} ] },
      { rank:4, metric:'Remitly Card / send-now-pay-later economics', since:'Q1 2026', tags:['card','snpl','unit-economics'],
        pista:'The card-based SNPL launch — adoption traction and unit economics (interchange + float + platform fees vs credit losses)?',
        breaks:'Card adoption or credit-loss performance disappoints as the product scales beyond invite-only.',
        seededBy:{ q:'Q1 2026', n:'Aditya Buddhavarapu asked why the card became the main SNPL channel; Sebastian: strong test signals, "a killer idea," US-first, bank-partner credit; unit economics "expected to be strong."' },
        src:'Q1 2026: SNPL moving to a card-based format (global debit card + wallet + short-term credit line via bank partner + rewards, monthly fee); invite-only to proven repayers; US-first.',
        why:'The card is the vehicle for the borrow/spend/save flywheel and higher per-customer economics — but credit adds a new risk vector.',
        thread:[ {q:'Q4 2025',n:'Flex 120k users, rev ~2x QoQ; Remitly Credit (recourse line) to launch spring 2026; wallet 60k.'},{q:'Q1 2026',n:'SNPL → card-based; strong signals; US-first; majority of SNPL growth to come from card format.'} ] },
      { rank:5, metric:'Remittance-tax / offline→online durability', since:'Q1 2026', tags:['remittance-tax','offline-online','regulatory'],
        pista:'Does the offline→online shift (aided by the 1% US cash-remittance tax) persist through the year, as management "takes on faith"?',
        breaks:'The offline→online tailwind fades faster than assumed, pressuring new-customer acquisition.',
        seededBy:{ q:'Q1 2026', n:'Ramsey El-Assal pressed on how durable the 1% remittance-tax tailwind is; Sebastian: "no science behind the 1%... we take it as an article of faith" it continues the rest of the year.' },
        src:'Q1 2026: record new-customer acquisition from offline→online shift tied to the 1% US cash-remittance tax; Skip-the-Line campaign, WhatsApp + ChatGPT distribution.',
        why:'A large cash-remittance base still to convert is a multi-year tailwind — but the pace is unquantified and management admits it is faith, not data.',
        thread:[ {q:'Q4 2025',n:'Campaigns featuring 1% remittance-tax awareness; WhatsApp Send offline→online conversion.'},{q:'Q1 2026',n:'Remittance-tax drove record new customers; durability "an article of faith."'} ] },
    ],
    results:null, call:null },

  // ── REPORTED: Q1 2026 (quarter ended Mar 2026; reported May 6 2026) ──
  { q:'Q1 2026', status:'reported', date:'May 6, 2026',
    setup:{ source:'Bloomberg BST consensus (archived) — precise figures to backfill',
      pricedIn:'Sebastian Gunningham\'s first full quarter as CEO: continued 25%+ revenue growth, record profitability, RLTE outpacing revenue. The open question was whether the new CEO would change strategy or pace — and how much of the strength was durable vs macro/regulatory tailwinds.',
      oneLiner:'The bar was "profitable growth continues, no strategy break under the new CEO" — Remitly beat both revenue and EBITDA guidance highs, but the beat leaned on a transitory stack and Q2 guides down.' },
    watchList:[
      { rank:1, metric:'CEO transition — accelerate or disrupt?', since:'Q4 2025', tags:['ceo','execution'],
        pista:'Does Sebastian accelerate execution (product velocity, AI) without breaking the strategy or culture?', breaks:'Strategy pivot or execution disruption in the transition.',
        seededBy:{ q:'Q4 2025', n:'Q4 announced Matt Oppenheimer → Chairman, Sebastian Gunningham incoming CEO; the question into Q1 was whether the hand-off accelerates or disrupts.' },
        src:'Q4 2025: CEO transition announced; Sebastian (ex-Amazon marketplace/payments, Oracle, Santander) incoming.', why:'A founder-to-operator hand-off at a compounder is the single biggest execution variable.' },
      { rank:2, metric:'New products / growth accelerators ramp', since:'Q4 2025', tags:['new-products','accelerators'],
        pista:'Do new products actually >2x in 2026 toward the 5–10%-by-2028 path?', breaks:'New-product growth undershoots the >2x guide.',
        seededBy:{ q:'Q4 2025', n:'Q4 set new products ~1% of 2025 revenue, guided >2x in 2026; the question was whether the ramp is real.' },
        src:'Q4 2025: Flex 120k users, Business 15k, wallet 60k; new products ~1% of revenue; >2x guided for 2026.', why:'Diversification beyond core remittance.' },
      { rank:3, metric:'Margin / EBITDA expansion durability', since:'Q4 2025', tags:['margins','ebitda'],
        pista:'Can the +500bps FY25 margin expansion continue, or does reinvestment cap it?', breaks:'Margin expansion stalls or reverses.',
        seededBy:{ q:'Q4 2025', n:'Q4 delivered +500bps FY25 Adj EBITDA margin and first GAAP profit; the question was durability into 2026 as they reinvest.' },
        src:'Q4 2025: Adj EBITDA $272M FY25 (~17% margin, +500bps); net income $68M (first full-year GAAP profit).', why:'The profitable-growth thesis.' },
      { rank:4, metric:'High-amount-sender mix shift', since:'Q4 2025', tags:['high-value-senders','mix'],
        pista:'Does the high-amount-sender mix keep compounding (40%+ growth) and lifting send/customer?', breaks:'The mix shift stalls or brings worse loss rates.',
        seededBy:{ q:'Q4 2025', n:'Q4 high-amount senders +40%, very-high +105%, ~50% of send volume; the question was whether the mix keeps shifting up.' },
        src:'Q4 2025: high-amount senders +40% YoY; very-high +105%; ~50% of send volume.', why:'Drives send/customer and volume ahead of QAU.' },
      { rank:5, metric:'Core growth durability / macro', since:'Q4 2025', tags:['core-send','macro'],
        pista:'Does core revenue growth hold near the high-20s into 2026 amid macro/geopolitics?', breaks:'Core growth decelerates below ~20% on macro or corridor weakness.',
        seededBy:{ q:'Q4 2025', n:'Q4 delivered +26% (FY25 +29%) "amid one of the more challenging macro environments"; the question was durability into 2026.' },
        src:'Q4 2025: revenue +26%; QAU +19%; send volume +35%.', why:'The base the whole model compounds from.' },
    ],
    results:{
      headline:'A record quarter that beat both guidance highs — revenue $453M (+25%), Adjusted EBITDA $102M (first time >$100M), record net income $49M (+300%) — but the beat leaned on a transitory stack (remittance tax, tax refunds, a Middle-East surge, holiday timing), and Q2 guides down to +17–18%.',
      thesisCheck:[
        {line:'CEO transition accelerates, not disrupts', tripped:false, note:'Sebastian kept the strategy ("the answer is no"), added a 4x4 operating framework + AI push; smooth — held.'},
        {line:'New products / accelerators ramp (>2x)', tripped:false, note:'High-value senders +73%, Business +30% QoQ, new-product revenue >2x; on track — held.'},
        {line:'Margin / EBITDA expansion durable', tripped:false, note:'Record Adj EBITDA margin + net income — but partly aided by a hiring pause (watch durability).'},
        {line:'High-amount-sender mix keeps shifting', tripped:false, note:'High-value senders (now $5k+ defn) +73%, +220bps mix — held.'},
        {line:'Core growth holds high-20s', tripped:true, note:'⚑ Q1 +25% was aided by one-timers and Q2 guides to +17–18% — the clean core rate is below the FY25 pace (watch).'},
      ],
      scorecard:[
        {metric:'Q2 revenue guide (decel)', cons:null, actual:'$483–485M (+17–18%)', result:'nocons', surprise:70, watchRank:null, note:{t:'The real news in the print',h:'Step down from +25% as Q1 tailwinds reverse (tax refunds, remittance-tax surge, Middle-East, Ramadan/Easter) and comps toughen; FY +20–21% with H2 re-accel to ~20%.'}},
        {metric:'Revenue', cons:null, actual:'$453M (+25%)', result:'beat', surprise:60, watchRank:5, note:{t:'$16M above midpoint',h:'Aided by remittance-tax offline→online, elevated US tax refunds, a UAE surge (+150%), and favorable corridors — management flagged these as partly transitory.'}},
        {metric:'Adjusted EBITDA', cons:null, actual:'$102M (first >$100M)', result:'beat', surprise:60, watchRank:3, note:{t:'$19M above midpoint',h:'Higher revenue, lower transaction losses (AI fraud model), and a short-term hiring pause after in-quarter headcount cuts.'}},
        {metric:'GAAP net income', cons:null, actual:'$49M (+300%)', result:'beat', surprise:55, watchRank:null, note:{t:'Record',h:'Vs $11M in Q1 2025; record GAAP profitability; SBC down 23% YoY (aided by forfeitures).'}},
        {metric:'Quarterly active customers', cons:null, actual:'9.6M (+20%)', result:'beat', surprise:45, watchRank:null, note:{t:'Growth accelerated QoQ',h:'Record new-customer acquisition on the offline→online shift; improved retention.'}},
        {metric:'Send volume', cons:null, actual:'$22.1B (+37%)', result:'beat', surprise:45, watchRank:4, note:{t:'Send/customer record $2,300 (+14%)',h:'Driven by transactions/customer and record average transaction size (high-value senders + business).'}},
        {metric:'High-value senders volume', cons:null, actual:'+73%', result:'beat', surprise:40, watchRank:4},
        {metric:'RLTE (revenue less transaction exp.)', cons:null, actual:'$308M (+28%), 68% of rev', result:'beat', surprise:35, watchRank:null, note:{t:'The right metric (not take rate)',h:'RLTE +28% outpaced revenue +25%, +156bps; management downplays take rate (2.05%, mix-driven).'}},
        {metric:'Free cash flow', cons:null, actual:'$70M+', result:'beat', surprise:30, watchRank:null, note:{t:'First-ever share-count decline',h:'Outstanding shares down QoQ for the first time ever; buyback $44M (2.8M shares), ~4x prior pace.'}},
      ],
      intoCall:[
        'Stripping the one-timers, what is the durable core growth rate — and does H2 really re-accelerate to ~20%?',
        'Is the record margin durable AI leverage or a one-time hiring pause (Q2 SBC/hiring steps up)?',
        'How are the growth accelerators (high-value, business, card) tracking vs plan?',
      ],
      priceReaction:'to fill from a trusted source' },
    call:{
      take:'A record quarter (revenue $453M/+25%, Adj EBITDA $102M, net income $49M/+300%) whose <b>composition is the story</b>: the beat leaned on a transitory stack (remittance-tax offline→online, elevated US tax refunds, a Middle-East surge, holiday timing) and Q2 already guides down to +17–18%. Underneath, the new CEO kept the strategy, added an AI-and-capacity thesis, and the durable engine (RLTE +28% > revenue, first-ever share-count decline) held.',
      highlights:[
        { tag:'watch', band:'lead', head:'The +25% beat leans on a <b>transitory stack</b> — Q2 decelerates to +17–18%.',
          open:'What is the clean, durable core rate stripping out remittance-tax / tax-refunds / Middle-East / holiday timing — and does H2 really re-accelerate to the guided ~20%?',
          detail:'<p>Vikas named the Q1 upside drivers: the <b>1% US cash-remittance tax</b> driving offline→online (record new-customer acquisition), <b>elevated US tax refunds</b>, a <b>Middle-East geopolitical surge</b> (UAE send volume +150%), and <b>Ramadan/Easter pulled into Q1</b>. Q2 guides to $483–485M (+17–18%) as these reverse and comps toughen; FY +20–21% with H2 re-accelerating to ~20%.</p><p>Sebastian on the remittance-tax tailwind: "no science behind the 1%… we take it as an article of faith" it continues. The tell: whether the H2 re-accel shows up, or the clean core settles in the high-teens.</p>' },
        { tag:'thesis', band:'lead', head:'New CEO\'s <b>AI thesis</b> — a capacity and margin bet ("more revenue, same headcount in 3–4 years").',
          open:'Is the record margin durable AI leverage or a one-time hiring pause? Q1 EBITDA was aided by a hiring freeze after in-quarter cuts; Vikas flagged Q2 SBC and hiring stepping back up.',
          detail:'<p>Sebastian kept the strategy ("the answer is no" to changing it) but reframed around a <b>4x4 matrix</b> (core / high-value / business / receivers × send / borrow / spend / save) and an aggressive AI agenda. Evidence: <b>250+ headcount cuts YTD</b>, corporate workforce <b>−10%</b> in Q1, T&D <b>+14% vs revenue +25%</b>, G&A +2% (lowest ever), 97% of transactions with no agent contact, "knowledge development engineers."</p><p>The plan: generate "significantly more revenue with roughly the same number of people in 3–4 years," reinvesting a large portion of the AI-driven capacity back into growth. The open question is how much of Q1\'s record margin is structural AI leverage vs a temporary hiring pause.</p>' },
        { tag:'thesis', band:'context', head:'Growth accelerators over-achieving — high-value senders <b>+73%</b>, Business <b>+30% QoQ</b>.',
          detail:'<p>New-product revenue >2x YoY; high-value senders (redefined as $5k+ transactions) +73% with +220bps mix; Remitly Business 20k+ users, RLTE per business customer ~2x core; receiver product first transactions (30M+ receiver TAM). Still ~5% of revenue (>10% by 2028) — early but working.</p>' },
        { tag:'thesis', band:'context', head:'Record profitability + <b>first-ever share-count decline</b>.',
          detail:'<p>Adj EBITDA $102M (first >$100M), net income $49M (+300%), FCF $70M+. Buyback $44M (2.8M shares), ~4x prior pace; outstanding shares down QoQ for the first time in company history. SBC 6.1% of revenue (−382bps).</p>' },
        { tag:'thesis', band:'context', head:'RLTE the real metric: <b>+28% &gt; revenue</b>, 68% of revenue (+156bps).',
          detail:'<p>Management explicitly downplays take rate (2.05%, mix-driven) in favor of RLTE dollar growth and RLTE/active customer. RLTE +28% outpaced revenue; transaction losses a record-low 9.3bps of send volume on the AI fraud model.</p>' },
        { tag:'curious', band:'context', head:'Send-now-pay-later goes <b>card-based</b> — the Remitly Card ambition.',
          open:'Unit economics + adoption as it scales beyond invite-only — interchange/float/platform fees vs credit losses.',
          detail:'<p>SNPL moving to a card format: global debit card + wallet + short-term credit line (bank partner) + rewards, for a low monthly fee; invite-only to proven repayers; US-first. Sebastian: "a killer idea," unit economics "expected to be strong." Ambition: "the most versatile and best debit card in the world" for 300M migrants + 80M SMBs.</p>' },
        { tag:'watch', band:'logged', head:'Stablecoins framed as a <b>targeted tool</b>, not a universal solution.',
          detail:'<p>USDC wallet for receivers; corridor-specific FX/speed/settlement advantage. Sebastian: "not a universal solution, but a targeted one" where there is a clear cost or speed advantage.</p>' },
        { tag:'curious', band:'logged', head:'Distribution via <b>WhatsApp + ChatGPT</b>; M&A muscle-building.',
          detail:'<p>WhatsApp integration + a ChatGPT experiment (no financial interchange, early). Sebastian starting to analyze acquisitions differently to accelerate the new categories, though "nothing obvious on the horizon" for core.</p>' },
      ],
      dots:'The two lead items pull in opposite directions on the same number: the <b>transitory stack inflated Q1 revenue</b> while the <b>hiring pause inflated Q1 margin</b> — so both the top-line beat and the profitability beat carry a "how durable?" asterisk. Underneath, the structural signals (RLTE +28% > revenue, first-ever share-count decline, accelerators over-achieving) say the compounding engine is intact — the next two prints test whether the new CEO\'s AI-capacity bet turns the one-timers into a durable step-up.',
      threeMinutes:[
        '<b>Record quarter, but the +25% beat is inflated by a transitory stack — Q2 already guides to +17–18%.</b> Remittance-tax offline→online, elevated US tax refunds, a Middle-East surge (UAE +150%), and Ramadan/Easter pulled into Q1; management admits "no science" behind the remittance-tax tailwind. The real question is the durable core rate and whether H2 truly re-accelerates to the guided ~20%.',
        '<b>The new CEO\'s AI thesis is the real story — a capacity and margin bet.</b> 250+ headcount cuts, corporate workforce −10%, tech spend +14% vs revenue +25%, 97% of transactions with no agent contact — funding a plan for "significantly more revenue with roughly the same headcount in 3–4 years," reinvested into growth. Watch whether the record margin is durable AI leverage or a one-time hiring pause (Q2 SBC/hiring steps up).',
        '<b>The compounding engine is intact and accelerators are working but still small.</b> RLTE +28% outpaced revenue, first-ever share-count decline, FCF $70M+; high-value senders +73%, business +30% QoQ, new-product revenue >2x — but only ~5% of revenue (>10% by 2028).',
      ],
      notBringing:[
        {item:'Take rate (2.05%)', why:'Management explicitly calls it a poor, mix-driven metric; RLTE dollar growth is the right lens.'},
        {item:'Stablecoins as a thesis driver', why:'Framed as a targeted corridor tool, not a universal solution; not material to the model yet.'},
        {item:'ChatGPT / WhatsApp monetization', why:'Early experiments, no financial interchange with ChatGPT — not a model input.'},
      ],
      newQuestions:[
        {n:'Stripping the one-timers, what is the durable core rate — and does H2 re-accelerate to ~20%?', landed:{q:'Q2 2026', rank:1}, tripped:true},
        {n:'Is the record margin durable AI leverage or a one-time hiring pause?', landed:{q:'Q2 2026', rank:2}},
        {n:'Do the growth accelerators keep the >2x pace toward 10%-by-2028?', landed:{q:'Q2 2026', rank:3}},
        {n:'What are the Remitly Card / SNPL unit economics as it scales?', landed:{q:'Q2 2026', rank:4}},
        {n:'Does the remittance-tax offline→online tailwind persist all year?', landed:{q:'Q2 2026', rank:5}},
      ] } },

  // ── REPORTED: Q4 2025 (quarter ended Dec 2025; reported Feb 18 2026) ──
  { q:'Q4 2025', status:'reported', date:'February 18, 2026',
    setup:{ source:'Bloomberg BST consensus (archived) — precise figures to backfill',
      pricedIn:'A strong close to 2025: mid-20s revenue growth, record margins, first full-year GAAP profit. The Investor-Day medium-term targets ($3B revenue / $600M EBITDA by 2028) were the frame; a holiday-quarter beat was expected.',
      oneLiner:'The bar was "finish 2025 strong and confirm the Investor-Day trajectory" — Remitly beat (+26%, record 20% EBITDA margin) AND dropped a surprise: a CEO transition to Sebastian Gunningham.' },
    watchList:[
      { rank:1, metric:'Margin / EBITDA expansion durability', since:'Q3 2025', tags:['margins','ebitda'],
        pista:'Does the margin expansion continue into a record Q4 as leverage compounds?', breaks:'Margin expansion stalls.',
        src:'Q3 2025: Adj EBITDA margin expanding on operating leverage.', why:'The profitable-growth thesis.' },
      { rank:2, metric:'New products / Investor-Day trajectory', since:'Q3 2025', tags:['new-products','investor-day'],
        pista:'Do new products confirm the path to 5–10% of revenue by 2028?', breaks:'New-product traction disappoints vs the Investor-Day frame.',
        src:'Q3 2025: Flex, Business, wallet/card scaling; Investor Day targets set.', why:'Diversification and the 2028 target.' },
      { rank:3, metric:'Core growth durability / macro', since:'Q3 2025', tags:['core-send','macro'],
        pista:'Does core revenue hold high-20s into year-end amid macro/geopolitics?', breaks:'Core decelerates below ~25%.',
        src:'Q3 2025: revenue growth in the mid-to-high 20s.', why:'The base of the model.' },
      { rank:4, metric:'High-amount-sender mix', since:'Q3 2025', tags:['high-value-senders','mix'],
        pista:'Does the high-amount-sender mix keep lifting send/customer?', breaks:'Mix shift stalls.',
        src:'Q3 2025: high-amount senders growing faster than low-amount.', why:'Drives volume ahead of QAU.' },
      { rank:5, metric:'Dilution / capital discipline', since:'Q3 2025', tags:['dilution','capital'],
        pista:'Does share-count growth keep moderating as FCF scales?', breaks:'Dilution outpaces FCF growth.',
        src:'Q3 2025: FCF scaling; buyback program launched H2 2025.', why:'The North Star is FCF/share.' },
    ],
    results:{
      headline:'A strong close to 2025 with a surprise: revenue $442M (+26%), record 20% Adj EBITDA margin, first full-year GAAP profit ($68M) — and the announced CEO transition from founder Matt Oppenheimer (→ Chairman) to Sebastian Gunningham.',
      thesisCheck:[
        {line:'Margin / EBITDA expansion durable', tripped:false, note:'Record 20% Q4 Adj EBITDA margin; FY +500bps; first full-year GAAP profit — held strongly.'},
        {line:'New products confirm the Investor-Day path', tripped:false, note:'Flex 120k, Business 15k, wallet 60k; >2x guided for 2026 — held.'},
        {line:'Core growth holds high-20s', tripped:false, note:'Revenue +26% (FY25 +29%) amid a tough macro — held.'},
        {line:'High-amount-sender mix keeps lifting', tripped:false, note:'High-amount +40%, very-high +105%, ~50% of send volume — held/accelerated.'},
      ],
      scorecard:[
        {metric:'CEO transition (Oppenheimer → Gunningham)', cons:null, actual:'founder → Chairman; Sebastian CEO', result:'nodisc', surprise:75, watchRank:null, note:{t:'The surprise in the print',h:'Founder Matt Oppenheimer moves to Chairman (largest shareholder, no plans to sell); Sebastian Gunningham (ex-Amazon marketplace/payments, Oracle, Santander) becomes CEO to "accelerate product velocity." A deliberate, board-run succession.'}},
        {metric:'Adjusted EBITDA', cons:null, actual:'$89M · 20% margin (record)', result:'beat', surprise:55, watchRank:1, note:{t:'Highest quarterly margin ever',h:'Lower transaction losses (AI fraud model), disciplined marketing, opex leverage across all categories.'}},
        {metric:'FY2025 net income', cons:null, actual:'$68M (first full-year GAAP profit)', result:'beat', surprise:55, watchRank:null, note:{t:'From −$37M a year ago',h:'Q4 net income $41M (vs −$6M in Q4 2024); FCF $283M (tripled).'}},
        {metric:'Revenue', cons:null, actual:'$442M (+26%); FY $1.635B (+29%)', result:'beat', surprise:45, watchRank:3, note:{t:'Above guidance',h:'FY revenue >$60M above the initial 2025 midpoint; strong December holiday.'}},
        {metric:'Very-high-amount senders volume', cons:null, actual:'+105%', result:'beat', surprise:45, watchRank:4, note:{t:'High-amount +40%',h:'The two tiers now ~50% of send volume, mix +350bps YoY.'}},
        {metric:'RLTE (% of revenue)', cons:null, actual:'$305M (+30%), 69% (record)', result:'beat', surprise:35, watchRank:1, note:{t:'Record high',h:'RLTE +30% > revenue; provision for losses a record-low 7.3bps of send volume.'}},
        {metric:'Send volume', cons:null, actual:'$21B (+35%)', result:'inline', surprise:25, watchRank:null},
        {metric:'Quarterly active customers', cons:null, actual:'9.3M (+19%)', result:'inline', surprise:20, watchRank:3},
        {metric:'New products (% of revenue)', cons:null, actual:'~1% (2025); >2x guided 2026', result:'nocons', surprise:30, watchRank:2, note:{t:'The 2028 path',h:'5–10% of revenue by 2028; Flex first product outside core to pass 100k users.'}},
      ],
      intoCall:[
        'Will the CEO transition accelerate execution or introduce disruption?',
        'Can the record margin expansion continue into 2026 as they reinvest?',
        'Do new products really >2x in 2026 toward the Investor-Day path?',
      ],
      priceReaction:'to fill from a trusted source' },
    call:{
      take:'A strong finish to 2025 (revenue +26%, record 20% Q4 Adj EBITDA margin, first full-year GAAP profit) paired with a <b>planned CEO succession</b>: founder Matt Oppenheimer to Chairman, Sebastian Gunningham (ex-Amazon/Oracle/Santander) as CEO to accelerate product velocity — strategy explicitly unchanged, execution pace the point.',
      highlights:[
        { tag:'thesis', band:'lead', head:'<b>CEO transition</b>: founder → Chairman, Sebastian Gunningham in to accelerate velocity.',
          open:'Does the hand-off accelerate execution or introduce disruption? Strategy is unchanged, but a founder-to-operator transition at a compounder is the key variable.',
          detail:'<p>Matt Oppenheimer moves to Chairman (remains largest individual shareholder, "no plans to sell"), running a "deliberate, exhaustive" board process. Sebastian brings Amazon marketplace/payments scale, Oracle, and Santander Consumer Finance chair experience — framed as a "product-first operator" to "relentlessly drive product velocity and operational cadence" while Matt provides founder continuity. The bet: same vision, faster delivery.</p>' },
        { tag:'thesis', band:'context', head:'Record <b>20% Q4 Adj EBITDA margin</b>; first full-year GAAP profit ($68M).',
          detail:'<p>FY25 Adj EBITDA $272M (~17% margin, +500bps); net income $68M (from −$37M a year prior); FCF $283M (tripled). Driven by an AI fraud model (record-low losses), disciplined marketing, and opex leverage across every category.</p>' },
        { tag:'thesis', band:'context', head:'Investor-Day frame confirmed: <b>$3B revenue / $600M EBITDA by 2028</b>.',
          detail:'<p>New products ~1% of 2025 revenue, guided >2x in 2026, 5–10% of revenue by 2028. Flex (SNPL) first product outside core to pass 100k users (~120k); Remitly Business 15k; wallet 60k; Remitly One membership ties them together. Remitly Credit (recourse line) to launch spring 2026.</p>' },
        { tag:'thesis', band:'context', head:'High-amount-sender mix accelerating — very-high <b>+105%</b>, high <b>+40%</b>.',
          detail:'<p>The two tiers now ~50% of send volume (+350bps mix YoY), lifting send/customer to $2,200 (+13%). New definitions: low <$1k, high $1k–$10k, very-high >$10k.</p>' },
        { tag:'thesis', band:'context', head:'Capital discipline: FCF tripled to <b>$283M</b>; buyback launched H2 2025.',
          detail:'<p>The North Star is FCF/share; outstanding shares grew only 5% in 2025; the share-repurchase program launched in H2 2025 (setting up Q1 2026\'s first-ever share-count decline).</p>' },
        { tag:'watch', band:'logged', head:'Geographic expansion: UAE, Japan (Q1), Saudi + Brazil (2026, pending).',
          detail:'<p>UAE new customers +160% QoQ; Japan outbound early Q1; Saudi Arabia and potentially Brazil planned for 2026 subject to regulatory approval.</p>' },
        { tag:'curious', band:'logged', head:'AI already contributing — fraud model added <b>~$10M RLTE</b> vs forecast.',
          detail:'<p>The recently upgraded AI fraud model drove record-low transaction losses; agent-automated workflows compressing developer time. The seed of the AI-capacity thesis Sebastian expands in Q1 2026.</p>' },
      ],
      dots:'The CEO transition and the record margins are the same story from two angles: 2025 proved the model works (profitable growth, first GAAP profit, FCF tripled), which is exactly why Matt judged it the right moment to hand a working machine to an operator built for velocity — the AI leverage flagged here ($10M RLTE from the fraud model) becomes Sebastian\'s central thesis one quarter later.',
      threeMinutes:[
        '<b>Strong close to 2025 and a planned CEO succession.</b> Revenue +26% (FY +29%), record 20% Q4 Adj EBITDA margin, first full-year GAAP profit ($68M), FCF tripled to $283M — and founder Matt Oppenheimer moves to Chairman with Sebastian Gunningham (ex-Amazon/Oracle/Santander) in as CEO to accelerate product velocity. Strategy explicitly unchanged; pace is the point.',
        '<b>The profitable-growth machine is proven</b> — +500bps FY margin expansion, RLTE +30% > revenue, provision for losses a record-low 7.3bps on the AI fraud model. That durability is what made this the right moment for the hand-off.',
        '<b>The Investor-Day path is intact</b>: $3B revenue / $600M EBITDA by 2028, with new products (~1% of revenue, >2x guided for 2026) and high-amount senders (~50% of volume) the diversification vectors. Watch the transition execution and whether margins hold as they reinvest.',
      ],
      notBringing:[
        {item:'Take rate (2.13%)', why:'Mix-driven; management steers to RLTE dollar growth as the right metric.'},
        {item:'Quarter-to-quarter send-volume noise', why:'+35% healthy; the signal is RLTE and mix, not the headline volume print.'},
        {item:'Geographic launch specifics', why:'UAE/Japan/Saudi/Brazil are optionality, not near-term model drivers.'},
      ],
      newQuestions:[
        {n:'Will the CEO transition accelerate execution or introduce disruption?', landed:{q:'Q1 2026', rank:1}},
        {n:'Do new products actually >2x in 2026 toward the 2028 path?', landed:{q:'Q1 2026', rank:2}},
        {n:'Can the record margin expansion continue as they reinvest?', landed:{q:'Q1 2026', rank:3}},
        {n:'Does the high-amount-sender mix keep compounding?', landed:{q:'Q1 2026', rank:4}},
        {n:'Does core revenue growth hold high-20s into 2026?', landed:{q:'Q1 2026', rank:5}},
      ] } },
]};

function cpUpcoming(){ return CALL_PREP.quarters.filter(function(q){ return q.status==='upcoming'; })[0]||null; }
function cpFill(x, muted){ return (x!=null && String(x).trim()!=='') ? x : '<span class="cp-empty">'+(muted||'— to fill')+'</span>'; }
var CP_POP={};
function cpReg(id, t, h){ CP_POP[id]={t:t, h:h}; return id; }
function cpQ(id, t, h){ return '<span class="cp-info ov-clickable" data-detail="cp:'+cpReg(id,t,h)+'" title="'+esc(String(t).replace(/<[^>]+>/g,''))+'">?</span>'; }
function cpStyle(){
  return '<style>.cp-note{font-size:11px;color:var(--mu);line-height:1.5;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;margin:0 0 12px}'+
    '.cp-phtabs{display:inline-flex;gap:3px;background:rgba(31,77,216,0.06);border:1px solid var(--bdr);border-radius:9px;padding:4px;margin:0 0 20px}'+
    '.cp-phtab{background:none;border:none;color:var(--mu);font-family:\'Inter\',sans-serif;font-size:12px;letter-spacing:.5px;text-transform:uppercase;font-weight:600;padding:7px 16px;border-radius:6px;cursor:pointer;transition:all .15s}'+
    '.cp-phtab:hover{color:var(--navy)}.cp-phtab.active{background:'+BRAND+';color:#fff}'+
    '.cp-phpane[hidden]{display:none}'+
    '.cp-qpills{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px}'+
    '.cp-qpill{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.cp-qpill:hover{color:var(--navy)}.cp-qpill.active{background:'+BRAND+';color:#fff;border-color:'+BRAND+'}'+
    '.cp-qpill .cp-qtag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin-left:6px;opacity:.75}'+
    '.cp-qblock[hidden]{display:none}'+
    '.cp-frozen{display:inline-block;font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:'+GRAY+';border-radius:20px;padding:2px 8px;margin-left:7px;vertical-align:middle}'+
    '.cp-wl-tagbar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 12px;padding:9px 12px;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px}'+
    '.cp-wl-tag{border:1px solid rgba(122,90,248,0.35);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+PURPLE+';padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.cp-wl-tag:hover{background:rgba(122,90,248,0.08)}.cp-wl-tag.active{background:'+PURPLE+';color:#fff;border-color:'+PURPLE+'}'+
    '.cp-wl-clear{border-color:var(--bdr);color:var(--mu)}'+
    '.cp-wl-add-btn{margin-left:auto;border:1px dashed '+BRAND+';background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+BRAND+';padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.cp-wl-addform{display:flex;flex-direction:column;gap:7px;border:1px dashed '+BRAND+';border-radius:10px;padding:12px;margin:0 0 12px;background:rgba(31,77,216,0.03)}'+
    '.cp-wl-addform[hidden]{display:none}'+
    '.cp-wl-in{font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:7px 10px;background:var(--w);color:var(--navy)}'+
    '.cp-wl-add-go{font:inherit;font-size:11px;font-weight:800;border:none;border-radius:8px;padding:6px 13px;background:'+BRAND+';color:#fff;cursor:pointer}'+
    '.cp-wl-all[hidden]{display:none}.cp-w[data-wlhide]{display:none}'+
    '.cp-empty{color:var(--mu);font-style:italic;opacity:.7}'+
    '.cp-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:4px 0}@media(max-width:640px){.cp-grid4{grid-template-columns:1fr 1fr}}'+
    '.cp-cell{border:1px solid var(--bdr);border-top:3px solid '+BLUE+';border-radius:10px;padding:11px 13px;background:var(--w)}'+
    '.cp-cell-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}.cp-cell-v{font-size:15px;font-weight:800;color:var(--navy);margin-top:3px;line-height:1.2}'+
    '.cp-ev-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.cp-ev-pill.active{background:'+BRAND+';color:#fff}'+
    '.cp-cell-custom{border-top-color:'+YELLOW+'}'+
    '.cp-row-cap{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:2px 0 4px}'+
    '.cp-val{display:flex;align-items:baseline;gap:7px}'+
    '.cp-val-lab{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:1px 7px;flex:none}'+
    '.cp-val-cons .cp-val-lab{background:rgba(37,87,214,0.10);color:'+BLUE+'}'+
    '.cp-val-us .cp-val-lab{background:rgba(22,163,74,0.12);color:'+BRAND2+'}'+
    '.cp-evwrap[data-ev="cons"] .cp-val-us{display:none}'+
    '.cp-evwrap[data-ev="us"] .cp-val-cons{display:none}'+
    '.cp-evwrap:not([data-ev="both"]) .cp-val-lab{display:none}'+
    '.cp-evwrap[data-ev="both"] .cp-cell-v{font-size:13px}'+
    '.cp-evwrap[data-ev="both"] .cp-val{margin-top:3px}'+
    '.cp-banner{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:11px;padding:13px 15px;background:linear-gradient(180deg,rgba(31,77,216,0.05),transparent);font-size:12.5px;line-height:1.6;color:var(--navy);margin:12px 0}'+
    '.cp-watch{display:flex;flex-direction:column;gap:11px}'+
    '.cp-w{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w);position:relative}'+
    '.cp-w-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}'+
    '.cp-w-rank{width:26px;height:26px;border-radius:50%;background:'+BRAND+';color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex:none}'+
    '.cp-w-metric{font-size:13.5px;font-weight:800;color:var(--navy)}'+
    '.cp-w-q{display:flex;gap:8px;align-items:flex-start;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;margin-top:8px}.cp-w-q .mic{flex:none}'+
    '.cp-kind{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid}'+
    '.cp-phase{display:inline-block;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#fff;border-radius:20px;padding:3px 10px;margin-bottom:8px}'+
    '.cp-info{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border-radius:50%;background:'+AMBER+';color:#fff;font-size:10px;font-weight:800;cursor:pointer;margin-left:5px;vertical-align:middle;flex:none}'+
    '.cp-info:hover{filter:brightness(1.1)}'+
    '.cp-debate{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin:4px 0}@media(max-width:600px){.cp-debate{grid-template-columns:1fr}}'+
    '.cp-dc{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w)}'+
    '.cp-dc.fear{border-top:4px solid '+RED+';background:linear-gradient(180deg,rgba(234,67,53,0.04),transparent)}'+
    '.cp-dc.real{border-top:4px solid '+BRAND2+';background:linear-gradient(180deg,rgba(22,163,74,0.05),transparent)}'+
    '.cp-dc-h{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}'+
    '.cp-dc.fear .cp-dc-h{color:'+RED+'}.cp-dc.real .cp-dc-h{color:'+BRAND2+'}'+
    '.cp-dc-b{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.cp-mech{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:12px 0}'+
    '.cp-mech-chip{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:800;border:1px solid var(--bdr);border-radius:9px;padding:7px 12px;background:var(--w);color:var(--navy)}'+
    '.cp-mech-ar{font-size:15px;color:var(--mu)}'+
    '.cp-synth{border-left:4px solid var(--navy);background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:6px 0}.cp-synth b{color:#E8A00C}'+
    '.cp-why-btn{display:inline-block;font-size:10px;font-weight:800;color:'+BLUE+';cursor:pointer;margin-top:8px}'+
    '.cp-w-chips{display:flex;gap:7px;flex-wrap:wrap;margin:6px 0 0}'+
    '.cp-w-chip{font-size:10px;font-weight:700;border-radius:7px;padding:4px 9px;line-height:1.3}'+
    '.cp-w-chip.cons{background:rgba(37,87,214,0.08);border:1px solid rgba(37,87,214,0.28);color:var(--navy)}'+
    '.cp-w-chip.red{background:rgba(234,67,53,0.06);border:1px solid rgba(234,67,53,0.28);color:var(--navy)}'+
    '.cp-w-chip b{font-weight:800}'+
    '.cp-take{border-left:4px solid '+BRAND+';background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:2px 0 14px}.cp-take b{color:#E8A00C}'+
    '.cp-hl{display:flex;flex-direction:column;gap:8px}'+
    '.cp-hl-row{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--hc);border-radius:10px;padding:10px 13px;background:var(--w);cursor:pointer;transition:.12s}'+
    '.cp-hl-row:hover{box-shadow:0 3px 10px rgba(0,0,0,.08)}'+
    '.cp-hl-tag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:var(--hc);border-radius:20px;padding:3px 9px;white-space:nowrap}'+
    '.cp-hl-head{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.cp-hl-more{font-size:15px;color:var(--hc);font-weight:800}'+
    '@media(max-width:560px){.cp-hl-row{grid-template-columns:auto 1fr}.cp-hl-more{display:none}}'+
    '.cp-dots{border:1px dashed '+BRAND+';border-radius:11px;padding:12px 15px;margin-top:14px;background:rgba(31,77,216,0.03);font-size:12px;line-height:1.6;color:var(--navy)}.cp-dots b{color:'+BRAND+'}'+
    '.cp-tc{display:flex;flex-direction:column;gap:6px}'+
    '.cp-tc-row{display:flex;gap:9px;align-items:flex-start;font-size:11.5px;color:var(--navy);line-height:1.45;border:1px solid var(--bdr);border-radius:9px;padding:8px 11px}'+
    '.cp-tbl{width:100%;border-collapse:collapse;font-size:11.5px}'+
    '.cp-tbl th{text-align:left;color:var(--mu);font-weight:700;padding:7px 10px;border-bottom:1px solid var(--bdr);font-size:10.5px;text-transform:uppercase;letter-spacing:.03em}'+
    '.cp-tbl td{padding:9px 10px;border-bottom:1px solid var(--bdr);color:var(--navy);line-height:1.45;vertical-align:top}'+
    '.cp-pill{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 9px;white-space:nowrap}'+
    '.cp-sc{display:flex;flex-direction:column;gap:6px}'+
    '.cp-sc-row{display:grid;grid-template-columns:78px 1.1fr 1fr 1.2fr 92px auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--sc);border-radius:9px;padding:8px 12px}'+
    '.cp-sc-m{font-size:12px;font-weight:800;color:var(--navy)}.cp-sc-c{font-size:11px;color:var(--mu)}.cp-sc-a{font-size:11.5px;font-weight:700;color:var(--navy)}'+
    '.cp-sc-v{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 10px;background:var(--sc);white-space:nowrap}'+
    '.cp-sc-rk{font-size:9px;font-weight:800;color:'+BRAND+';background:rgba(31,77,216,0.10);border:1px solid rgba(31,77,216,0.3);border-radius:20px;padding:2px 8px;white-space:nowrap;text-align:center}'+
    '.cp-sc-rk.blank{background:transparent;border:none}'+
    '.cp-sc-surp{font-size:9.5px;font-weight:800;text-align:center;letter-spacing:.02em;border-radius:20px;padding:2px 8px;white-space:nowrap}'+
    '.cp-sc-surp.hi{color:'+RED+';background:rgba(234,67,53,0.09);border:1px solid rgba(234,67,53,0.3)}'+
    '.cp-sc-surp.md{color:'+AMBER+';background:rgba(183,121,31,0.09);border:1px solid rgba(183,121,31,0.3)}'+
    '.cp-sc-surp.lo{color:var(--mu);background:transparent;border:1px solid var(--bdr)}'+
    '.cp-legend{display:flex;flex-wrap:wrap;gap:14px;align-items:center;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px;padding:10px 13px;margin:0 0 10px}'+
    '.cp-legend-i{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--navy);line-height:1.4}'+
    '.cp-legend-i b{font-weight:800}'+
    '@media(max-width:600px){.cp-sc-row{grid-template-columns:1fr auto}.cp-sc-c,.cp-sc-a,.cp-sc-bw,.cp-sc-rk{display:none}}'+
    '.cp-band{margin:16px 0 8px;display:flex;align-items:center;gap:9px}'+
    '.cp-band-i{font-size:13px;font-weight:800;color:var(--bc);line-height:1}'+
    '.cp-band-t{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--bc)}'+
    '.cp-band-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.cp-band-l{flex:1;height:1px;background:var(--bdr)}'+
    '@media(max-width:560px){.cp-band-s{display:none}}'+
    '.cp-hl-open{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+AMBER+';border:1px solid '+AMBER+';border-radius:20px;padding:2px 7px;white-space:nowrap;margin-left:7px;vertical-align:middle}'+
    '.cp-3m{border:1px solid var(--bdr);border-top:4px solid '+BRAND+';border-radius:12px;padding:15px 17px;margin:16px 0 0;background:linear-gradient(180deg,rgba(31,77,216,0.05),transparent)}'+
    '.cp-3m-h{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:10px}'+
    '.cp-3m-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.cp-3m-sub{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.cp-3m-copy{margin-left:auto;border:1px solid '+BRAND+';background:var(--w);font:inherit;font-size:10px;font-weight:800;color:'+BRAND+';padding:3px 11px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.cp-3m-copy:hover{background:'+BRAND+';color:#fff}'+
    '.cp-3m-l{display:flex;flex-direction:column;gap:8px;counter-reset:m3}'+
    '.cp-3m-i{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start;font-size:12.5px;line-height:1.55;color:var(--navy)}'+
    '.cp-3m-i::before{counter-increment:m3;content:counter(m3);width:20px;height:20px;border-radius:50%;background:'+BRAND+';color:#fff;font-size:10.5px;font-weight:800;display:flex;align-items:center;justify-content:center;flex:none;margin-top:1px}'+
    '.cp-nb{margin-top:13px;border-top:1px dashed var(--bdr);padding-top:11px}'+
    '.cp-nb-h{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:6px}'+
    '.cp-nb-r{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:start;font-size:11px;line-height:1.5;color:var(--mu);padding:2px 0}'+
    '.cp-nb-r b{color:var(--navy);font-weight:800}'+
    '.cp-nb-x{color:'+GRAY+';font-weight:800;flex:none}'+
    '.cp-seed{display:inline-flex;align-items:center;gap:4px;font-size:9.5px;font-weight:800;color:'+PURPLE+';background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3);border-radius:20px;padding:2px 9px;white-space:nowrap;flex:none}'+
    '.cp-nq{display:flex;flex-direction:column;gap:5px}'+
    '.cp-nq-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:3px solid '+PURPLE+';border-radius:9px;padding:7px 11px;font-size:11.5px;color:var(--navy);line-height:1.45}'+
    '.cp-nq-land{font-size:9.5px;font-weight:800;color:'+PURPLE+';white-space:nowrap}'+
    '.cp-nq-land.open{color:var(--mu)}'+
    '@media(max-width:560px){.cp-nq-row{grid-template-columns:1fr}.cp-nq-land{margin-top:3px}}'+
    '.calls-st-age{font-size:8.5px;font-weight:700;opacity:.8;margin-left:4px}</style>';
}
function cpFmtC(o){ if(!o||o.v==null) return '<span class="cp-empty">—</span>';
  var un=o.unit||'', v=o.v, s;
  if(un==='$') s='$'+v; else if(un==='$M') s='$'+v+'M'; else if(un==='$B') s='$'+v+'B';
  else if(un==='%') s=v+'%'; else s=String(v);
  return s+(o.yoy!=null?'<span style="font-size:10px;color:#0a8f4c;font-weight:800;margin-left:5px">+'+o.yoy+'%</span>':''); }
function cpEvCell(key, m, isCustom){
  var name=m&&m.k?m.k:null;
  var q=(m&&m.note)?cpQ('setnote-'+key, m.note.t, m.note.h):'';
  var kHtml=name?esc(name):'<span class="cp-empty">Custom KPI — to define</span>';
  return '<div class="cp-cell'+(isCustom?' cp-cell-custom':'')+'"><div class="cp-cell-k">'+kHtml+q+'</div>'+
    '<div class="cp-cell-v">'+
      '<div class="cp-val cp-val-cons"><span class="cp-val-lab">Street</span>'+cpFmtC(m&&m.cons)+'</div>'+
      '<div class="cp-val cp-val-us"><span class="cp-val-lab">Summit</span>'+cpFmtC(m&&m.us)+'</div>'+
    '</div></div>';
}
// The source buttons — every Call Prep opens with IR + EDGAR (docs/CALL_PREP_CONVENTIONS §6).
var CP_IR_URL='https://ir.remitly.com/financial-information/quarterly-results';
var CP_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=1782170&owner=exclude';
var CP_LOGO_URL='https://assets.parqet.com/logos/symbol/RELY';
var CP_SEC_SEAL='img/sec-seal.png';
function cpIRButton(){
  return '<style>'+
    '.cp-srcrow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 16px}@media(max-width:760px){.cp-srcrow{grid-template-columns:1fr}}'+
    '.cp-ir{display:flex;align-items:center;gap:20px;text-decoration:none;border-radius:18px;padding:26px 26px;min-height:120px;position:relative;overflow:hidden;'+
      'background:linear-gradient(115deg,#04060B 0%,#0A1024 60%,#04060B 100%);border:1px solid rgba(31,77,216,.4);box-shadow:0 10px 32px rgba(0,0,0,.4);transition:.18s}'+
    '.cp-ir:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,'+BRAND+','+BLUE+','+YELLOW+','+BRAND2+');height:4px;top:0}'+
    '.cp-ir:hover{transform:translateY(-2px);box-shadow:0 16px 42px rgba(31,77,216,.45);border-color:rgba(31,77,216,.85)}'+
    '.cp-ir-wm{position:absolute;right:-40px;bottom:-60px;width:230px;height:230px;object-fit:contain;opacity:.09;pointer-events:none;transition:.25s}'+
    '.cp-ir:hover .cp-ir-wm{opacity:.16;transform:scale(1.04) rotate(-2deg)}'+
    '.cp-ir-ic{width:72px;height:72px;border-radius:18px;background:transparent;display:flex;align-items:center;justify-content:center;flex:none;position:relative;z-index:1;'+
      'box-shadow:0 0 0 1px rgba(232,160,12,.35),0 0 32px rgba(31,77,216,.6)}'+
    '.cp-ir-ic img{width:52px;height:52px;object-fit:contain;display:block}'+
    '.cp-ir-body{flex:1;min-width:0;position:relative;z-index:1}'+
    '.cp-ir-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:#E8A00C;display:flex;align-items:center;gap:7px}'+
    '.cp-ir-dot{width:7px;height:7px;border-radius:50%;background:'+BRAND2+';box-shadow:0 0 0 0 rgba(22,163,74,.7);animation:cpirp 1.6s infinite}'+
    '@keyframes cpirp{0%{box-shadow:0 0 0 0 rgba(22,163,74,.6)}70%{box-shadow:0 0 0 8px rgba(22,163,74,0)}100%{box-shadow:0 0 0 0 rgba(22,163,74,0)}}'+
    '.cp-ir-t{font-size:19px;font-weight:900;color:#fff;letter-spacing:.05em;text-transform:uppercase;margin-top:4px}'+
    '.cp-ir-s{font-size:11.5px;color:#9FB0C8;font-weight:600;margin-top:3px;letter-spacing:.01em}'+
    '.cp-ir-go{font-size:13px;font-weight:900;color:#fff;background:'+BRAND+';border-radius:999px;padding:12px 22px;white-space:nowrap;flex:none;display:flex;align-items:center;gap:8px;position:relative;z-index:1;letter-spacing:.04em;transition:.14s}'+
    '.cp-ir:hover .cp-ir-go{gap:12px;box-shadow:0 4px 18px rgba(31,77,216,.6)}'+
    '@media(max-width:560px){.cp-ir{flex-wrap:wrap}.cp-ir-go{width:100%;justify-content:center}}'+
    '.cp-ir.edgar{background:linear-gradient(115deg,#070502 0%,#171106 60%,#070502 100%);border-color:rgba(197,164,90,.35)}'+
    '.cp-ir.edgar:before{background:linear-gradient(90deg,#8C6D2F,#E3C878,#8C6D2F)}'+
    '.cp-ir.edgar:hover{box-shadow:0 16px 42px rgba(197,164,90,.32);border-color:rgba(227,200,120,.75)}'+
    '.cp-ir.edgar .cp-ir-ic{background:transparent;box-shadow:0 0 0 1px rgba(227,200,120,.28),0 0 32px rgba(197,164,90,.55)}'+
    '.cp-ir.edgar .cp-ir-ic img{width:72px;height:72px}'+
    '.cp-ir.edgar .cp-ir-k{color:#E3C878}'+
    '.cp-ir.edgar .cp-ir-dot{background:#E3C878;animation:none;box-shadow:0 0 8px rgba(227,200,120,.8)}'+
    '.cp-ir.edgar .cp-ir-go{background:linear-gradient(135deg,#E3C878,#B8933F);color:#1A1305}'+
    '.cp-ir.edgar:hover .cp-ir-go{box-shadow:0 4px 18px rgba(197,164,90,.6)}'+
    '.cp-ir.edgar .cp-ir-wm{opacity:.1}'+
    '.cp-ir.edgar:hover .cp-ir-wm{opacity:.17}'+
  '</style>'+
  '<div class="cp-srcrow">'+
  '<a class="cp-ir" href="'+CP_IR_URL+'" target="_blank" rel="noopener">'+
    '<img class="cp-ir-wm" src="'+CP_LOGO_URL+'" alt="" aria-hidden="true">'+
    '<span class="cp-ir-ic"><img src="'+CP_LOGO_URL+'" alt="Remitly logo" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="cp-ir-body">'+
      '<span class="cp-ir-k"><span class="cp-ir-dot"></span>THE SOURCE · EARNINGS HQ</span>'+
      '<span class="cp-ir-t" style="display:block">Remitly Investor Relations</span>'+
      '<span class="cp-ir-s" style="display:block">Release · webcast · slides · transcripts — straight from ir.remitly.com. Skip the search, go direct.</span>'+
    '</span>'+
    '<span class="cp-ir-go">OPEN IR <span>↗</span></span>'+
  '</a>'+
  '<a class="cp-ir edgar" href="'+CP_EDGAR_URL+'" target="_blank" rel="noopener">'+
    '<img class="cp-ir-wm" src="'+CP_SEC_SEAL+'" alt="" aria-hidden="true">'+
    '<span class="cp-ir-ic"><img src="'+CP_SEC_SEAL+'" alt="SEC seal" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="cp-ir-body">'+
      '<span class="cp-ir-k"><span class="cp-ir-dot"></span>THE RECORD · U.S. SECURITIES AND EXCHANGE COMMISSION</span>'+
      '<span class="cp-ir-t" style="display:block">Remitly on EDGAR</span>'+
      '<span class="cp-ir-s" style="display:block">10-K · 10-Q · 8-K · DEF 14A — the regulator\'s copy, as filed. What IR curates, EDGAR certifies.</span>'+
    '</span>'+
    '<span class="cp-ir-go">OPEN EDGAR <span>↗</span></span>'+
  '</a>'+
  '</div>';
}
function cpQkey(q){ return String(q||'').replace(/\s/g,''); }
function cpQPills(){
  return '<div class="cp-qpills">'+CALL_PREP.quarters.map(function(q,i){
    return '<button type="button" class="cp-qpill'+(i===0?' active':'')+'" data-cpqsel="'+esc(cpQkey(q.q))+'">'+esc(q.q)+(q.status==='upcoming'?'<span class="cp-qtag">upcoming</span>':'')+'</button>';
  }).join('')+'</div>';
}
function cpSetupBody(c){
  var h=cpStyle();
  h+=CALL_PREP.quarters.map(function(u,qi){
    var qk=cpQkey(u.q), frozen=(u.status!=='upcoming');
    var b='<div class="cp-qblock" data-cpq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="cp-phase" style="background:'+BLUE+'">① Pre-Call'+(frozen?'<span class="cp-frozen">frozen</span>':'')+'</div>';
    var st=u.setup||{};
    if(st.headline){
      b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup.</b> The numbers going in — what the <b>Street</b> expects, what <b>Summit</b> expects, and where the two disagree. '+(u.date?('Reports <b>'+esc(u.date)+'</b>.'):'')+'</p>';
      var hl=st.headline||[], cu=st.custom||[];
      b+='<div class="ov-diagram-cap" style="margin:6px 0 6px;display:flex;flex-wrap:wrap;align-items:center;gap:12px"><b>Estimates</b>'+
        '<span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px">'+
          '<button type="button" class="cp-ev-pill active" data-cpev="cons">Consensus</button>'+
          '<button type="button" class="cp-ev-pill" data-cpev="us">Summit</button>'+
          '<button type="button" class="cp-ev-pill" data-cpev="both">Both</button>'+
        '</span>'+
        (st.source?'<span style="color:var(--mu);font-weight:600;font-size:10px">'+esc(st.source)+(st.asOf?' · as of '+esc(st.asOf):'')+'</span>':'')+
      '</div>';
      b+='<div class="cp-evwrap" data-ev="cons">';
      b+='<div class="cp-row-cap">Headline — every company, always</div>';
      b+='<div class="cp-grid4">'+hl.map(function(m,i){ return cpEvCell('hl-'+qk+'-'+i, m, false); }).join('')+'</div>';
      b+='<div class="cp-row-cap" style="margin-top:12px">Custom KPIs — Remitly</div>';
      b+='<div class="cp-grid4">'+cu.map(function(m,i){ return cpEvCell('cu-'+qk+'-'+i, m, true); }).join('')+'</div>';
      b+='</div>';
      b+='<div class="ave-subh-note" style="margin-top:6px">Green = YoY. <b>Street</b> = Bloomberg (BST) consensus, hardcoded from the team\'s export only. <b>Summit</b> = our own expectation (Remitly is not in the Summit DCF universe → to fill). <b>?</b> = a number with a caveat worth knowing.</div>';
      var md=st.marketDebate;
      if(md){
        b+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>The setup, in one picture — what the print will settle</b></div>';
        b+='<div class="cp-debate">'+
          '<div class="cp-dc fear"><div class="cp-dc-h">What the tape fears</div><div class="cp-dc-b">'+md.fear+'</div></div>'+
          '<div class="cp-dc real"><div class="cp-dc-h">What consensus actually models</div><div class="cp-dc-b">'+md.real+'</div></div>'+
        '</div>';
        if(md.mech&&md.mech.length){
          b+='<div class="cp-mech">'+md.mech.map(function(m,i){ var ar=m.dir==='up'?'<span style="color:#0a8f4c">▲</span>':(m.dir==='down'?'<span style="color:'+RED+'">▼</span>':''); return (i>0?'<span class="cp-mech-ar">→</span>':'')+'<span class="cp-mech-chip">'+ar+' '+esc(m.k)+' <span style="color:var(--mu);font-weight:700">'+esc(m.v)+'</span></span>'; }).join('')+'</div>';
        }
        if(md.synth) b+='<div class="cp-synth">'+md.synth+'</div>';
      }
      var d=st.debate;
      b+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>The debate — where Summit differs from the Street, and why</b></div>';
      if(d){
        if(d.rows&&d.rows.length){
          b+='<div class="cp-tc">'+d.rows.map(function(r){
            return '<div class="cp-tc-row" style="border-left:3px solid '+BRAND+'"><span style="font-weight:800;color:var(--navy);white-space:nowrap">'+esc(r.k)+'</span><span><b>Street:</b> '+esc(r.street||'—')+' · <b>Summit:</b> '+esc(r.us||'—')+'<br><span style="color:var(--mu)">'+ (r.why||'') +'</span></span></div>';
          }).join('')+'</div>';
        }
        if(d.synth) b+='<div class="cp-synth">'+d.synth+'</div>';
      } else {
        b+='<div class="cp-note">Fills once both estimate sets are in (Bloomberg export + Summit expectations): line-by-line disparities and the mechanism behind why we see it differently.</div>';
      }
      b+='<div class="ov-foot">Frozen at call time; Post-Results scores actuals against BOTH columns.</div>';
    } else {
      b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup, as it stood going in.</b> '+(u.date?('Reported <b>'+esc(u.date)+'</b>.'):'')+'</p>';
      if(st.source) b+='<div class="ave-subh-note" style="margin:0 0 8px">'+esc(st.source)+'</div>';
      if(st.pricedIn) b+='<div class="cp-banner"><b>What was priced in:</b> '+st.pricedIn+'</div>';
      if(st.oneLiner) b+='<div class="cp-synth">'+st.oneLiner+'</div>';
      b+='<div class="ov-foot">Frozen — scored in Post-Results / Post-Call for this quarter.</div>';
    }
    b+='</div>';
    return b;
  }).join('');
  return h;
}
function cpWatchItem(w, qk, idSfx, qLabel){
  var deep='';
  if(w.seededBy) deep+='<p style="border-left:3px solid '+PURPLE+';padding-left:9px;margin-bottom:10px"><b>'+(w.seededBy.tripped?'Seeded by a TRIPPED red-line':'Seeded by')+' '+esc(w.seededBy.q)+':</b> "'+esc(w.seededBy.n)+'"</p>';
  if(w.src) deep+='<p><b>Why it\'s on the list:</b> '+w.src+'</p>';
  if(w.why) deep+='<p><b>Why it matters:</b> '+w.why+'</p>';
  if(w.thread&&w.thread.length){
    deep+='<p style="margin-bottom:4px"><b>The thread — how this theme has evolved:</b></p>'+
      w.thread.map(function(t){ return '<div style="display:flex;gap:9px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:12px;line-height:1.5"><b style="white-space:nowrap;color:'+BRAND+'">'+esc(t.q)+'</b><span>'+t.n+'</span></div>'; }).join('');
  }
  var why=deep?cpReg('watchwhy-'+qk+'-'+(w.rank||0)+idSfx, esc(w.metric), deep):null;
  var tagsAttr=(w.tags&&w.tags.length)?w.tags.join(' '):'';
  var seed=w.seededBy?'<span class="cp-seed" title="'+esc(w.seededBy.n)+'">'+(w.seededBy.tripped?'⚑ red-line tripped in '+esc(w.seededBy.q):'left open by '+esc(w.seededBy.q))+'</span>':'';
  return '<div class="cp-w" data-wltags="'+esc(tagsAttr)+'"><div class="cp-w-top"><div class="cp-w-rank">'+(w.rank||'•')+'</div><div class="cp-w-metric">'+esc(w.metric)+'</div>'+seed+
    (qLabel?'<span class="ov-chip" style="font-size:9.5px;background:rgba(31,77,216,0.10);color:'+BRAND+';border-radius:20px;padding:2px 9px;font-weight:800;flex:none">'+esc(qLabel)+'</span>':'')+
    (why?'<span class="cp-why-btn ov-clickable" data-detail="cp:'+why+'" style="margin:0">why'+(w.thread?' + the thread':'')+' ›</span>':'')+'</div>'+
    '<div class="cp-w-q"><span class="mic">🔎</span><span>'+cpFill(w.pista||w.question)+'</span></div>'+
    '<div class="cp-w-chips">'+
      (w.tags&&w.tags.length?w.tags.map(function(t){ return '<span class="cp-w-chip" style="background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3);color:var(--navy)">#'+esc(t)+'</span>'; }).join(''):'')+
      (w.since?'<span class="cp-w-chip" style="background:rgba(232,160,12,0.14);border:1px solid rgba(183,121,31,0.35);color:var(--navy)"><b>Tracking since:</b> '+esc(w.since)+'</span>':'')+
      (w.bbg?'<span class="cp-w-chip cons"><b>Cons:</b> '+esc(w.bbg)+'</span>':'')+
      (w.breaks?'<span class="cp-w-chip red"><b>Breaks if:</b> '+esc(w.breaks)+'</span>':'')+
    '</div>'+
  '</div>';
}
function cpWatchTags(){
  var set=[], seen={};
  CALL_PREP.quarters.forEach(function(u){ (u.watchList||[]).forEach(function(w){ (w.tags||[]).forEach(function(t){ if(!seen[t]){ seen[t]=1; set.push(t); } }); }); });
  return set;
}
function cpWatchBody(c){
  var h=cpStyle();
  h+='<div class="cp-wl-tagbar"><span style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)">Filter by theme (across quarters):</span>'+
    cpWatchTags().map(function(t){ return '<button type="button" class="cp-wl-tag" data-wltag="'+esc(t)+'">#'+esc(t)+'</button>'; }).join('')+
    '<button type="button" class="cp-wl-tag cp-wl-clear" data-wltag="">clear</button>'+
    '<button type="button" class="cp-wl-add-btn">+ Add theme</button>'+
  '</div>';
  h+='<div class="cp-wl-addform" hidden>'+
    '<input class="cp-wl-in" data-wlf="metric" placeholder="Theme (e.g. Regulatory: CCCA routing mandate)">'+
    '<input class="cp-wl-in" data-wlf="tags" placeholder="tags, comma-separated (e.g. regulatory, cross-border)">'+
    '<input class="cp-wl-in" data-wlf="pista" placeholder="The tell 🔎 — a standing read, not a question">'+
    '<input class="cp-wl-in" data-wlf="breaks" placeholder="Breaks if… (the falsifiable red-line)">'+
    '<div><button type="button" class="cp-wl-add-go">Add to this quarter\'s list</button><span class="ave-subh-note" style="margin-left:8px">Lives for this session — to persist it, it gets committed into CALL_PREP.</span></div>'+
  '</div>';
  h+=CALL_PREP.quarters.map(function(u,qi){
    var qk=cpQkey(u.q), frozen=(u.status!=='upcoming');
    var b='<div class="cp-qblock" data-cpq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="cp-phase" style="background:'+BLUE+'">① Pre-Call'+(frozen?'<span class="cp-frozen">frozen</span>':'')+'</div>';
    b+='<p class="ov-lede"><b>Five things to hunt — '+esc(u.q)+'</b>'+(frozen?' <span style="color:var(--mu);font-weight:600">(the list as it was frozen before this call — scored afterwards in Post-Results)</span>':'')+', numbered 1–5 by <b>how much they move the stock × how debated they are</b>. Each card carries: the <b>tell</b> (🔎) — what to actually watch for; what the <b>Street expects</b>; and the <b>red-line</b> that would break the thesis. Tap <b>why ›</b> for the grounding and the quarter-by-quarter thread.</p>';
    b+='<div class="cp-legend"><span class="cp-legend-i"><b>How to read the cards:</b></span>'+
      '<span class="cp-legend-i"><span class="cp-seed">left open by Q1 FY2026</span> it is on the list because last quarter\'s call did not settle it</span>'+
      '<span class="cp-legend-i"><span class="cp-seed">⚑ red-line tripped in Q1 FY2026</span> stronger — a thesis line actually broke last quarter</span>'+
    '</div>';
    var wl=u.watchList||[];
    if(!wl.length){ b+='<div class="cp-note">Watch List builds from the earnings-call record + the Bloomberg export — 5 ranked, grounded, falsifiable items per the conventions.</div>'; }
    else{ b+='<div class="cp-watch">'+wl.map(function(w){ return cpWatchItem(w, qk, '', null); }).join('')+'</div>'; }
    b+='<div class="ov-foot">'+(frozen?'Frozen — this list was scored against '+esc(u.q)+'\'s Post-Results/Post-Call; its newQuestions seeded the next quarter.':'Frozen once the quarter opens; scored against Post-Results / Post-Call. Themes carry their quarter-by-quarter thread — promise-type items are tracked here and in the theme record below.')+'</div>';
    b+='</div>';
    return b;
  }).join('');
  h+='<div class="cp-wl-all" hidden>';
  h+='<div class="cp-phase" style="background:'+PURPLE+'">Themes across quarters</div>';
  h+='<p class="ov-lede">Every watch item matching the selected theme(s), <b>across all quarters</b> — how the same hunt evolved print to print. Clear the tags (or pick a quarter) to return to the per-quarter view.</p>';
  h+='<div class="cp-watch">'+CALL_PREP.quarters.map(function(u){
    var qk=cpQkey(u.q);
    return (u.watchList||[]).map(function(w){ return cpWatchItem(w, qk, '-f', u.q); }).join('');
  }).join('')+'</div>';
  h+='</div>';
  // ── FUSED (v2.3): the full multi-year theme record — the former standalone Earnings Calls tab. ──
  h+='<div style="margin-top:26px;border-top:2px solid var(--bdr);padding-top:16px">';
  h+='<div class="cp-band" style="--bc:'+BRAND+'"><span class="cp-band-i">▤</span><span class="cp-band-t">The theme record — every thread, across all calls</span><span class="cp-band-s">the multi-year backbone behind the hunt above (the former "Earnings Calls" tab, folded in)</span><span class="cp-band-l"></span></div>';
  h+=ddCallsBody(c);
  h+='</div>';
  return h;
}
var CP_RES={ beat:{c:'#0a8f4c',l:'Beat'}, miss:{c:RED,l:'Miss'}, inline:{c:'#6b7684',l:'In line'},
             nodisc:{c:AMBER,l:'Not disclosed'}, nocons:{c:PURPLE,l:'No consensus'} };
var CP_HLTAG={ thesis:{c:'#0a8f4c',l:'Thesis'}, curious:{c:'#7A5AF8',l:'Curious'}, dots:{c:'#2E6BE6',l:'Connects dots'}, watch:{c:'#B7791F',l:'Watch'}, tone:{c:'#B7791F',l:'Tone'} };
function cpResultsBody(c){
  var h=cpStyle();
  h+=CALL_PREP.quarters.map(function(q,qi){
    var qk=cpQkey(q.q);
    var b='<div class="cp-qblock" data-cpq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="cp-phase" style="background:'+BRAND2+'">② Post-Results</div>';
    b+='<p class="ov-lede"><b>'+esc(q.q)+' — the numbers vs. the frozen expectations.</b> Results land first (release ~4pm, call comes later) — the read on the <b>print itself</b>, before management says a word.</p>';
    var r=q.results;
    if(!r){ b+='<div class="cp-note">Empty until the print lands. Then the scorecard and thesis red-line check fill here.</div></div>'; return b; }
    b+='<div style="border:1px solid var(--bdr);border-radius:12px;padding:14px 16px;margin-bottom:14px;background:var(--w)">';
    b+='<div style="font-size:13.5px;font-weight:800;color:var(--navy);margin-bottom:8px">'+esc(q.q)+' <span style="font-weight:600;color:var(--mu);font-size:11px">· reported '+esc(q.date?q.date.replace(/ · .*/,''):'')+'</span></div>';
    if(r.headline) b+='<div class="cp-take" style="border-left-color:'+BRAND2+'">🎯 '+r.headline+'</div>';
    if(r.thesisCheck&&r.thesisCheck.length){
      var tc=r.thesisCheck.slice().sort(function(a,z){ return (z.tripped?1:0)-(a.tripped?1:0); });
      var nTrip=tc.filter(function(t){ return t.tripped; }).length;
      b+='<div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);margin:2px 0 6px">Thesis red-line check — vs this quarter\'s frozen Watch List'+
        (nTrip?'<span style="color:'+RED+';margin-left:7px">⚑ '+nTrip+' tripped</span>':'<span style="color:#0a8f4c;margin-left:7px">✓ all held</span>')+'</div>';
      b+='<div class="cp-tc">'+tc.map(function(t){ var col=t.tripped?RED:'#0a8f4c'; var ic=t.tripped?'⚑ TRIPPED':'✓ held';
        return '<div class="cp-tc-row" style="border-left:3px solid '+col+'"><span style="font-weight:800;color:'+col+';white-space:nowrap">'+ic+'</span><span><b>'+esc(t.line)+'</b> — '+esc(t.note||'')+'</span></div>';
      }).join('')+'</div>';
    }
    if(r.scorecard&&r.scorecard.length) b+='<div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);margin:15px 0 6px">The print — ranked by surprise</div>';
    if(r.scorecard&&r.scorecard.length){
      var sc=r.scorecard.slice().sort(function(a,z){ return (z.surprise||0)-(a.surprise||0); });
      b+='<div class="cp-legend">'+
        '<span class="cp-legend-i"><b>How to read this table:</b></span>'+
        '<span class="cp-legend-i"><span class="cp-sc-rk">WATCH #1</span> flagged before the call as one of the five most contested items (its rank on that list)</span>'+
        '<span class="cp-legend-i">A blank here just means the line was not one of those five — every line below is covered.</span>'+
        '<span class="cp-legend-i"><span class="cp-sc-surp hi">big surprise</span> the number landed far from expectations — our judgement, not a calculation</span>'+
      '</div>';
      b+='<div class="cp-sc">'+sc.map(function(d,i){ var rr=CP_RES[d.result]||CP_RES.inline;
        var qb=d.note?cpQ('resnote-'+qk+'-'+i, d.note.t||'Context', d.note.h||d.note):'';
        var rk=d.watchRank?'<div class="cp-sc-rk" title="This was item #'+esc(String(d.watchRank))+' on the Watch List we froze before the call">WATCH #'+esc(String(d.watchRank))+'</div>'
                          :'<div class="cp-sc-rk blank"></div>';
        var sv=d.surprise;
        var sl=(sv==null)?'<div class="cp-sc-bw"></div>'
          :'<div class="cp-sc-bw"><div class="cp-sc-surp '+(sv>=70?'hi':(sv>=30?'md':'lo'))+'">'+(sv>=70?'big surprise':(sv>=30?'some surprise':'as expected'))+'</div></div>';
        return '<div class="cp-sc-row" style="--sc:'+rr.c+'">'+rk+'<div class="cp-sc-m">'+esc(d.metric)+qb+'</div><div class="cp-sc-c">expected: '+cpFill(d.cons,'—')+'</div><div class="cp-sc-a">'+esc(d.actual||'')+'</div>'+sl+'<div class="cp-sc-v">'+rr.l+'</div></div>';
      }).join('')+'</div>';
      b+='<div class="ave-subh-note" style="margin-top:6px">Rows are ordered biggest-surprise first, not in release order. <b>Not disclosed</b> = management stopped reporting a number it used to give. <b>No consensus</b> = nobody had an estimate for it. Neither is a miss.</div>';
    }
    if(r.intoCall&&r.intoCall.length){
      b+='<div class="cp-dots" style="margin-top:14px">🎯 <b>What the numbers tee up for the call</b> — go in hunting these:'+
        '<ul class="ov-bullets" style="margin-top:6px">'+r.intoCall.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul></div>';
    }
    b+='<div style="margin-top:10px;font-size:11.5px;color:var(--navy)"><b>Price reaction:</b> '+cpFill(r.priceReaction,'to fill from a trusted source')+'</div>';
    b+='</div>';
    b+='<div class="ov-foot">Scored against the frozen Watch List. Consensus = Bloomberg export; actuals = reported (Bloomberg / release).</div>';
    b+='</div>';
    return b;
  }).join('');
  return h;
}
function cpCallBody(c){
  var h=cpStyle();
  h+=CALL_PREP.quarters.map(function(q,qi){
    var qk=cpQkey(q.q);
    var b='<div class="cp-qblock" data-cpq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="cp-phase" style="background:'+RED+'">③ Post-Call</div>';
    b+='<p class="ov-lede"><b>'+esc(q.q)+' — not a restatement of the numbers; the story behind them.</b> What the call <i>implied</i> for the thesis, the curious one-mention details, and the dots that connect. Tap any highlight for the depth.</p>';
    b+='<div class="cp-legend"><span class="cp-legend-i"><b>Highlights are grouped by what you DO with them in the meeting:</b></span>'+
      '<span class="cp-legend-i"><span style="color:'+RED+';font-weight:800">▲ Lead with this</span> — open with it: it moves the thesis and something is still unanswered</span>'+
      '<span class="cp-legend-i"><span style="color:'+BLUE+';font-weight:800">● Context</span> — worth saying, but settled; there is nothing to argue</span>'+
      '<span class="cp-legend-i"><span style="color:'+GRAY+';font-weight:800">○ Logged</span> — recorded for later, not meeting material</span>'+
      '<span class="cp-legend-i"><span class="cp-hl-open">open</span> flags the specific thing management left unanswered</span>'+
    '</div>';
    var cc=q.call;
    if(!cc){ b+='<div class="cp-note">Empty until the call/transcript is in. Then the meeting take, theme-by-theme highlights and the connect-the-dots line fill here.</div></div>'; return b; }
    b+='<div style="margin-bottom:18px">';
    b+='<div style="font-size:13.5px;font-weight:800;color:var(--navy);margin-bottom:8px">'+esc(q.q)+' <span style="font-weight:600;color:var(--mu);font-size:11px">· call '+esc(q.date||'')+'</span></div>';
    if(cc.take) b+='<div class="cp-take">🎯 '+cc.take+'</div>';
    if(cc.highlights&&cc.highlights.length){
      var bands=[
        { k:'lead',    i:'▲', c:RED,     t:'Lead with this', s:'moves the thesis — and something is still unresolved' },
        { k:'context', i:'●', c:BLUE,    t:'Context',        s:'matters, but it is settled — mention, don\'t debate' },
        { k:'logged',  i:'○', c:GRAY,    t:'Logged',         s:'on the record for later; not meeting material' },
      ];
      var hi=0;
      bands.forEach(function(bd){
        var items=cc.highlights.filter(function(x){ return (x.band||'context')===bd.k; });
        if(!items.length) return;
        b+='<div class="cp-band" style="--bc:'+bd.c+'"><span class="cp-band-i">'+bd.i+'</span><span class="cp-band-t">'+bd.t+'</span><span class="cp-band-s">'+bd.s+'</span><span class="cp-band-l"></span></div>';
        b+='<div class="cp-hl">'+items.map(function(x){ var tg=CP_HLTAG[x.tag]||{c:'#6b7684',l:x.tag||''};
          var det=x.detail||'';
          if(x.open) det+='<p style="border-left:3px solid '+AMBER+';padding-left:9px;margin-top:10px"><b>Still open:</b> '+x.open+'</p>';
          var id=det?cpReg('hl-'+qk+'-'+(hi++), tg.l+' — '+String(x.head).replace(/<[^>]+>/g,''), det):null;
          var op=x.open?' <span class="cp-hl-open" title="'+esc(x.open)+'">open</span>':'';
          return '<div class="cp-hl-row" style="--hc:'+tg.c+'"'+(id?' data-detail="cp:'+id+'"':'')+'><span class="cp-hl-tag">'+esc(tg.l)+'</span><span class="cp-hl-head">'+x.head+op+'</span>'+(id?'<span class="cp-hl-more">＋</span>':'<span></span>')+'</div>';
        }).join('')+'</div>';
      });
    }
    if(cc.dots) b+='<div class="cp-dots">🧩 '+cc.dots+'</div>';
    if(cc.threeMinutes&&cc.threeMinutes.length){
      b+='<div class="cp-3m"><div class="cp-3m-h"><span class="cp-3m-t">🎤 Three minutes</span>'+
        '<span class="cp-3m-sub">the spoken version — if you get one slot, this is it</span>'+
        '<button type="button" class="cp-3m-copy" data-cp3m="'+esc(qk)+'">copy</button></div>';
      b+='<div class="cp-3m-l" data-cp3mlist="'+esc(qk)+'">'+cc.threeMinutes.map(function(t){ return '<div class="cp-3m-i"><span>'+t+'</span></div>'; }).join('')+'</div>';
      if(cc.notBringing&&cc.notBringing.length){
        b+='<div class="cp-nb"><div class="cp-nb-h">✕ Deliberately not bringing — and why, if asked</div>'+
          cc.notBringing.map(function(x){ return '<div class="cp-nb-r"><span class="cp-nb-x">✕</span><span><b>'+esc(x.item)+'</b> — '+esc(x.why)+'</span></div>'; }).join('')+'</div>';
      }
      b+='</div>';
    }
    if(cc.newQuestions&&cc.newQuestions.length){
      b+='<div style="margin-top:12px"><div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);margin-bottom:5px">➡ What this call left unanswered — and where each question went next</div>';
      b+='<div class="cp-nq">'+cc.newQuestions.map(function(x){
        var n=(typeof x==='string')?x:x.n, land=(typeof x==='string')?null:x.landed;
        var trip=(typeof x!=='string'&&x.tripped)?'<span style="color:'+RED+';font-weight:800;margin-right:5px" title="A thesis red-line actually broke on this one">⚑</span>':'';
        var chip=land?'<span class="cp-nq-land">became '+esc(land.q)+' Watch item #'+esc(String(land.rank))+'</span>'
                     :'<span class="cp-nq-land open">still open — not yet on a list</span>';
        return '<div class="cp-nq-row"><span>'+trip+esc(n)+'</span>'+chip+'</div>';
      }).join('')+'</div></div>';
    }
    b+='</div>';
    b+='<div class="ov-foot">Insight-first, not fact-first. Append-only — prior quarters are never overwritten; newQuestions feeds the next Watch List.</div>';
    b+='</div>';
    return b;
  }).join('');
  return h;
}
var CP_THST={ trend:{c:'#0a8f4c',l:'Confirmed trend'}, promise:{c:'#2E6BE6',l:'Promise — reconcile'}, watch:{c:'#B7791F',l:'Watch'} };
function cpQnum(q){ var m=String(q||'').match(/Q(\d)\s+(?:FY)?(\d{4})/); return m?((+m[2])*4+(+m[1])):null; }
function cpStAge(st){
  if(!st||typeof st!=='object'||!st.since) return '';
  var newest=CALL_PREP.quarters.filter(function(q){ return q.status!=='upcoming'; })[0];
  var a=cpQnum(st.since), b=cpQnum(newest?newest.q:null);
  if(a==null||b==null) return '';
  var n=Math.max(1, b-a+1), k=(st.k||'');
  var lbl = (k==='promise') ? ('unreconciled '+n+' quarter'+(n>1?'s':''))
          : (st.silent)     ? ('silent '+n+' quarter'+(n>1?'s':''))
          : (k==='watch')   ? ('tracked '+n+' quarter'+(n>1?'s':''))
          :                   ('running '+n+' quarter'+(n>1?'s':''));
  return '<span class="calls-st-age"> · '+lbl+'</span>';
}
function wireCallPrep(root){
  var pane=root.querySelector('.ovt-subpane[data-ovst="callprep"]'); if(!pane) return;
  pane.querySelectorAll('.cp-phtab').forEach(function(btn){ btn.onclick=function(){
    var key=btn.getAttribute('data-cpp');
    pane.querySelectorAll('.cp-phtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.cp-phpane').forEach(function(p){ p.hidden=(p.getAttribute('data-cpp')!==key); });
  }; });
  pane.querySelectorAll('.cp-ev-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-cpev');
    pane.querySelectorAll('.cp-ev-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.cp-evwrap').forEach(function(w){ w.setAttribute('data-ev', v); });
  }; });
  pane.querySelectorAll('.cp-qpill').forEach(function(btn){ btn.onclick=function(){
    var qk=btn.getAttribute('data-cpqsel');
    pane.querySelectorAll('.cp-qpill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.cp-qblock').forEach(function(blk){ blk.hidden=(blk.getAttribute('data-cpq')!==qk); });
    pane.querySelectorAll('.cp-wl-tag').forEach(function(b){ b.classList.remove('active'); });
    var flat=pane.querySelector('.cp-wl-all'); if(flat) flat.hidden=true;
  }; });
  pane.querySelectorAll('.cp-3m-copy').forEach(function(btn){ btn.onclick=function(){
    var qk=btn.getAttribute('data-cp3m');
    var list=pane.querySelector('.cp-3m-l[data-cp3mlist="'+qk+'"]'); if(!list) return;
    var txt=Array.prototype.map.call(list.querySelectorAll('.cp-3m-i'), function(el,i){
      return (i+1)+'. '+el.textContent.trim();
    }).join('\n\n');
    var done=function(){ var o=btn.textContent; btn.textContent='copied ✓'; setTimeout(function(){ btn.textContent=o; }, 1400); };
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done, done); }
    else { var ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select();
           try{ document.execCommand('copy'); }catch(e){} document.body.removeChild(ta); done(); }
  }; });
  var wpane=pane.querySelector('.cp-phpane[data-cpp="watch"]');
  if(wpane){
    var flat=wpane.querySelector('.cp-wl-all');
    function activeTags(){ return Array.prototype.map.call(wpane.querySelectorAll('.cp-wl-tag.active'), function(b){ return b.getAttribute('data-wltag'); }).filter(Boolean); }
    function applyTags(){
      var tags=activeTags();
      var on=tags.length>0;
      wpane.querySelectorAll('.cp-qblock').forEach(function(blk){ if(on) blk.hidden=true; });
      if(!on){
        var act=pane.querySelector('.cp-qpill.active'); var qk=act?act.getAttribute('data-cpqsel'):null;
        wpane.querySelectorAll('.cp-qblock').forEach(function(blk){ blk.hidden=(qk!=null && blk.getAttribute('data-cpq')!==qk); });
      }
      if(flat){ flat.hidden=!on;
        if(on) flat.querySelectorAll('.cp-w').forEach(function(card){
          var ct=(card.getAttribute('data-wltags')||'').split(/\s+/);
          var hit=tags.some(function(t){ return ct.indexOf(t)>=0; });
          if(hit) card.removeAttribute('data-wlhide'); else card.setAttribute('data-wlhide','1');
        });
      }
    }
    function wireTag(btn){ btn.onclick=function(){
      if(btn.classList.contains('cp-wl-clear')){ wpane.querySelectorAll('.cp-wl-tag').forEach(function(b){ b.classList.remove('active'); }); }
      else btn.classList.toggle('active');
      applyTags();
    }; }
    wpane.querySelectorAll('.cp-wl-tag').forEach(wireTag);
    var addBtn=wpane.querySelector('.cp-wl-add-btn'), form=wpane.querySelector('.cp-wl-addform');
    if(addBtn&&form){ addBtn.onclick=function(){ form.hidden=!form.hidden; }; }
    var go=wpane.querySelector('.cp-wl-add-go');
    if(go&&form){ go.onclick=function(){
      function val(k){ var el=form.querySelector('[data-wlf="'+k+'"]'); return el?el.value.trim():''; }
      var metric=val('metric'); if(!metric) return;
      var tags=val('tags').split(',').map(function(t){ return t.trim().toLowerCase().replace(/\s+/g,'-'); }).filter(Boolean);
      var act=pane.querySelector('.cp-qpill.active'); var qk=act?act.getAttribute('data-cpqsel'):cpQkey(CALL_PREP.quarters[0].q);
      var qLbl=act?act.textContent.replace(/upcoming/i,'').trim():CALL_PREP.quarters[0].q;
      var w={ rank:'+', metric:metric, tags:tags, pista:val('pista')||null, breaks:val('breaks')||null, since:qLbl };
      var target=wpane.querySelector('.cp-qblock[data-cpq="'+qk+'"] .cp-watch');
      if(target) target.insertAdjacentHTML('beforeend', cpWatchItem(w, qk, '-add'+Date.now()%100000, null));
      var flatList=flat?flat.querySelector('.cp-watch'):null;
      if(flatList) flatList.insertAdjacentHTML('beforeend', cpWatchItem(w, qk, '-addf'+Date.now()%100000, qLbl));
      tags.forEach(function(t){
        if(!wpane.querySelector('.cp-wl-tag[data-wltag="'+t+'"]')){
          var b=document.createElement('button'); b.type='button'; b.className='cp-wl-tag'; b.setAttribute('data-wltag',t); b.textContent='#'+t;
          var clear=wpane.querySelector('.cp-wl-clear'); clear.parentNode.insertBefore(b, clear); wireTag(b);
        }
      });
      form.querySelectorAll('.cp-wl-in').forEach(function(i){ i.value=''; }); form.hidden=true;
      applyTags();
    }; }
  }
}


// ── Evolution ▸ Earnings Calls — narrative THREADS across the 10 calls Q4 2023 → Q1 2026
//    (+ Dec 2025 Investor Day), same By theme ⇄ By quarter format as MA/UBER/LYFT/CART.
//    Written contemporaneously from each transcript. ──
var RELY_THEMES=[
  { theme:'Growth accelerators — high-value senders, Business & Receivers', st:{ k:'trend', since:'Q1 2025', last:'Q1 2026' },
    why:'The expansion off the low-amount-remittance core: bigger transactions, small businesses, and (newest) the recipients themselves — management\'s "4×4" of customer categories, targeted at >10% of revenue by 2028.',
    updates:[
      { q:'Q1 2024', items:['<b>High-amount senders</b> (>$1,000) +45% YoY, +~200bps of mix; <b>largest transfer in company history</b> (Canada→US). Risk-based (ML) send limits cut friction; early <b>micro-business</b> traction.'] },
      { q:'Q2 2024', items:['<b>Remitly Business</b> formally launched (US) — TAM framed <b>~$2T → ~$22T</b>; thousands onboarded, ATV ~2× core, LTV ~6× a consumer. <b>Seafarers</b> product launched (ship-ID onboarding).'] },
      { q:'Q3 2024', items:['Seafarers expanded to Europe/GB/Australia/Singapore — <b>70% of new seafarers organic</b>. High-amount send volume +40%, +200bps mix.'] },
      { q:'Q4 2024', items:['High-amount (>$1,000) +40%; <b>very-high (>$10,000) +105%</b> — the two tiers now ~50% of send volume. New use cases: seafarers, micro-business, high-amount.'] },
      { q:'Q2 2025', items:['Remitly Business US live; UK/Canada/Australia/EU next. High-amount >$1,000 +45%, +300bps mix; send-to-self + multi-corridor features added.'] },
      { q:'Q3 2025', items:['Remitly Business in US/UK/Canada — <b>~10,000 businesses</b>, ATV ~2× core; send limits raised to <b>$100,000</b>; high-amount +40%.'] },
      { q:'Q4 2025', items:['Remitly Business <b>>15,000 customers</b> (ATV ~2×). New products (Flex, Business, Wallet/Card, One) ~1% of revenue in 2025, expected to <b>>2× in 2026</b>.'] },
      { q:'Q1 2026', items:['New <b>4×4 framework</b> (core / high-value / business / receivers × send-borrow-spend-save). High-value redefined to <b>$5,000+ (+73% YoY)</b>; Business +30% QoQ, <b>>20,000 users</b>, RLTE ~2× core; <b>Receivers</b> launched (first receiver txn; ~30M+ receivers who aren\'t yet senders).'] },
    ]},
  { theme:'New products — Flex, Wallet & Card, Remitly One', st:{ k:'trend', since:'Q2 2025', last:'Q1 2026' },
    why:'Beyond move-money into borrow / spend / save: the Send Now Pay Later product (Flex), a multi-currency wallet + debit card, and the Remitly One membership that bundles them — higher, stickier take rates.',
    updates:[
      { q:'Q2 2025', items:['Announced <b>Remitly One</b> membership (launches Sept), anchored by <b>Wallet</b> (fiat + stablecoin store of value) and <b>Flex</b> (send now, pay later, no interest). First "Reimagine" launch event Sept 9.'] },
      { q:'Q3 2025', items:['<b>Flex >100,000 active users</b>, revenue nearly doubling QoQ; Wallet + digital debit card (Apple/Google Pay) in early adoption; ~90% of Flex receivables current.'] },
      { q:'Q4 2025', items:['Flex ~<b>120,000 users</b>; <b>Remitly Credit</b> (recourse line of credit) launching spring 2026; Wallet/Card <b>>60,000 wallets</b>. Flex users spend more than non-Flex.'] },
      { q:'Q1 2026', items:['Expanding Send Now Pay Later into a <b>card-based</b> plan (global debit card + wallet + short-term bank-partner credit line + rewards, low monthly fee); borrow/spend/save revenue <b>>2× YoY</b>. Ambition: the Remitly Card for <b>300M migrants + 80M SMBs</b>.'] },
    ]},
  { theme:'AI — cost, speed & trust', st:{ k:'trend', since:'Q3 2025', last:'Q1 2026' },
    why:'From an efficiency story (cheaper support, lower fraud) to a growth thesis: Gunningham\'s bet that a trusted incumbent with proprietary data and a regulatory moat is a prime AI beneficiary — "more revenue with roughly the same people."',
    updates:[
      { q:'Q2 2024', items:['AI virtual assistant handling ~2M interactions, resolving issues 4× faster; <b>Remitly on WhatsApp</b> (conversational AI on-ramp for offline senders); Meta Messenger next.'] },
      { q:'Q4 2024', items:['CS + ops costs down from >10% of revenue (2022) to <b>6.5% (2024)</b>; AI/ML fraud models drove record-low transaction losses.'] },
      { q:'Q3 2025', items:['AI virtual assistant resolves ~1/3 of chats; AI-assisted code generation compressing dev cycles; >97% of transactions complete without support contact.'] },
      { q:'Q4 2025', items:['New AI fraud model → record-low losses (~$10M incremental RLTE vs forecast); agent-automated workflows cut developer time; >65% of transfers dispersed <20 seconds.'] },
      { q:'Q1 2026', items:['Three AI benefits — <b>cost</b> (>250 headcount cut / 50+ roles redeployed YTD; corporate workforce −10%+), <b>speed</b> ("knowledge development engineers"), <b>trust</b> (localization at scale). Tech/dev +14% (well below revenue). Thesis: <b>~same headcount, materially more revenue in 3–4 years</b>.'] },
    ]},
  { theme:'Stablecoins', st:{ k:'watch', since:'Q1 2025', last:'Q1 2026' },
    why:'A targeted tool, not a universal one: lower FX/settlement cost in select corridors, USDC disbursement, and — the bigger prize — USD-stablecoin wallets as a store of value for recipients in volatile-currency markets.',
    updates:[
      { q:'Q2 2025', items:['Three initiatives: hold stablecoins in the <b>Wallet</b> (with Circle), <b>disburse</b> to stablecoin wallets (with Bridge, a Stripe co.), and tokenized-USD <b>treasury</b> settlement. Beta; launch Sept.'] },
      { q:'Q3 2025', items:['Tokenized USD in treasury for near-real-time global funding; USDC disbursement live via Bridge in <b>Nigeria & Argentina</b> (volatile-currency corridors).'] },
      { q:'Q4 2025', items:['Broadening USDC access; stablecoins + AI treasury models improving FX costs — a "secular trend favoring our business."'] },
      { q:'Q1 2026', items:['Stablecoins a <b>targeted</b> cost/speed tool per corridor; new receiver <b>wallet holds USD/USDC</b>; Coins.ph (Philippines) enables stablecoin-wallet payouts.'] },
    ]},
  { theme:'Take rate, RLTE & unit economics', st:{ k:'trend', since:'Q1 2024', last:'Q1 2026' },
    why:'The number management keeps re-anchoring: take rate drifts down with mix (2.28% → 2.05%), but <b>RLTE dollars</b> (revenue less transaction expense) — the true LTV proxy — compound faster than revenue as scale lowers cost-to-serve.',
    updates:[
      { q:'Q1 2024', items:['Take rate 2.24% (mix-driven); transaction expense −290bps YoY on pay-in/payout scale + fraud precision. "RLTE is the North Star."'] },
      { q:'Q2 2024', items:['A <b>May fraud incident</b> ($3.8M one-time) lifted transaction losses; quickly contained. RLTE 65.1% of revenue.'] },
      { q:'Q4 2024', items:['RLTE <b>66.4%</b> of revenue (record then); take rate 2.28%; ~200bps of the transaction-expense gain from partner economics.'] },
      { q:'Q3 2025', items:['RLTE +23% to $273M (65% of revenue); take rate 2.15%; Mexico receive outgrowing the market.'] },
      { q:'Q4 2025', items:['RLTE +30% to $305M — <b>69% of revenue, a record</b>; take rate 2.13%; digital-receive mix +300bps.'] },
      { q:'Q1 2026', items:['RLTE +28% to $308M (68%, +156bps); take rate <b>2.05%</b>; digital-payout mix +250bps. Reiterated: take rate is "not a great metric" — <b>RLTE dollar growth</b> is.'] },
    ]},
  { theme:'Growth, margins & capital allocation', st:{ k:'trend', since:'Q1 2024', last:'Q1 2026' },
    why:'The Rule-of-50-then-40 story: durable ~25%+ growth turning into real profit and free cash flow — first full-year GAAP profit in 2025, the first-ever buybacks, and 2028 targets of ~$3B revenue / ~$600M EBITDA.',
    updates:[
      { q:'Q4 2023', items:['Q4 Adj EBITDA $8.2M / FY23 $44M — well ahead of plan; revenue at a <b>>$1B annualized</b> run-rate.'] },
      { q:'Q1 2024', items:['Adj EBITDA $19M (+250% YoY); SBC discipline (CEO declined equity grants 3 years running).'] },
      { q:'Q2 2024', items:['Adj EBITDA $25M; authorized a first <b>$200M buyback</b>; upsized the revolver to $550M.'] },
      { q:'Q3 2024', items:['Adj EBITDA $46.7M, ~14% margin — a <b>Rule-of-50</b> quarter; GAAP net income $1.9M.'] },
      { q:'Q1 2025', items:['Adj EBITDA $58.4M, 16% margin (Rule of 50); GAAP net income $11.4M.'] },
      { q:'Q4 2025', items:['Q4 Adj EBITDA $89M (20% margin, record); FY25 $272M / ~17% and <b>first full year of GAAP profit ($68M)</b>; FCF $283M (3×). Reaffirmed <b>Investor Day 2028</b> targets: ~$2.6–3.0B revenue, ~$575–600M Adj EBITDA (Rule of 40); SBC toward 7–10%.'] },
      { q:'Q1 2026', items:['Adj EBITDA <b>$102M — first >$100M</b>; GAAP net income $49M (+300%); FCF $70M; buyback <b>~4×\'d to $44M / 2.8M shares</b>; shares <b>fell sequentially for the first time ever</b> (~210M); ~$650M cash.'] },
    ]},
  { theme:'Macro, regulation & FX', st:{ k:'watch', since:'Q1 2024', last:'Q1 2026' },
    why:'The debate management keeps rebutting: remittances are resilient across cycles, and the 2026 US 1% cash-remittance tax — which exempts digitally-funded transfers — is a structural tailwind that accelerates offline→online share gains.',
    updates:[
      { q:'Q1 2025', items:['Framed remittances as resilient through macro/immigration cycles; FX/treasury a competitive advantage at ~$60B annual volume.'] },
      { q:'Q2 2025', items:['<b>One Big Beautiful Bill</b> — 1% tax on <b>cash</b> remittances, exempting bank/card-funded digital transfers → a tailwind from Jan 1, 2026.'] },
      { q:'Q3 2025', items:['Remittance tax effective Jan 1, 2026 confirmed as a tailwind; flagged possible <b>immigration headwinds</b> (US/Canada) on new-customer acquisition.'] },
      { q:'Q1 2026', items:['Remittance tax a net positive — <b>record new-customer acquisition</b> from offline→online; higher US tax refunds; <b>UAE send volume +150%</b> on Middle-East geopolitics; "Skip the Line" campaign converting cash senders.'] },
    ]},
  { theme:'CEO transition — Oppenheimer → Gunningham', st:{ k:'watch', since:'Q4 2025', last:'Q1 2026' },
    why:'A founder-to-operator handoff (Feb 2026): co-founder Matt Oppenheimer to Chairman, Sebastian Gunningham (ex-Amazon S-team, ex-WeWork) to CEO — "same vision and strategy, faster pace."',
    updates:[
      { q:'Q4 2025', items:['Announced <b>Sebastian Gunningham</b> as CEO (effective Feb 19, 2026); Oppenheimer becomes <b>Chairman</b> (largest individual holder, no sale plans). A deliberate, board-run succession.'] },
      { q:'Q1 2026', items:['Gunningham\'s first 90 days: <b>strategy unchanged, pace accelerated</b>. New operating principles (small autonomous teams, AI-by-default, speed); the 4×4 customer/product matrix as the execution blueprint.'] },
    ]},
];
// Regroup the theme-tagged updates by quarter (newest first) — same data, different lens.
function relyCallsByQuarter(){
  var map={}, order=[];
  RELY_THEMES.forEach(function(ct){ ct.updates.forEach(function(u){ if(!map[u.q]){ map[u.q]=[]; order.push(u.q); } map[u.q].push({ theme:ct.theme, items:u.items }); }); });
  function qv(q){ var m=String(q).match(/Q(\d)\s+(\d{4})/); return m?(+m[2])*10+(+m[1]):0; }
  order.sort(function(a,b){ return qv(b)-qv(a); });
  return { order:order, map:map };
}
function ddCallsBody(c){
  var h='<style>.calls-tog{display:inline-flex;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:14px}'+
    '.calls-pill{border:none;background:transparent;font:inherit;font-size:12px;font-weight:700;color:var(--mu);padding:5px 15px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.calls-pill:hover{color:var(--navy)}.calls-pill.active{background:'+BRAND+';color:#fff}'+
    '.calls-tl{font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--navy);margin:0 0 4px}'+
    '.calls-st{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid;flex:none}</style>';
  h+='<p class="ov-lede">The key narrative threads from the <b>10 earnings calls</b> (Q4 2023 → Q1 2026) plus the <b>Dec 2025 Investor Day</b>. Switch lens: <b>By theme</b> traces how each story evolved; <b>By quarter</b> shows what mattered on a given call. Each theme carries a status — <b>trend</b> (confirmed), <b>promise</b> (a commitment to reconcile next call) or <b>watch</b> — <b>with its age</b>: a watch running two quarters is louder than a fresh one. Tap any row to expand. (Quarterly guided-vs-delivered lives in the <b>Guidance</b> view.)</p>';
  h+='<div class="calls-tog" role="tablist"><button type="button" class="calls-pill active" data-relycallsv="theme">By theme</button><button type="button" class="calls-pill" data-relycallsv="quarter">By quarter</button></div>';
  // By theme (default)
  h+='<div class="lpb-acc" id="relyCallsTheme">';
  RELY_THEMES.forEach(function(ct){
    var sk=(ct.st&&ct.st.k)?ct.st.k:'watch'; var st=CP_THST[sk]||CP_THST.watch;
    h+='<div class="lpb-acc-item"><button type="button" class="lpb-acc-h"><span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap">'+esc(ct.theme)+' <span class="calls-st" style="color:'+st.c+';border-color:'+st.c+'">'+st.l+cpStAge(ct.st)+'</span></span><span class="lpb-acc-ic">+</span></button>';
    h+='<div class="lpb-acc-body"><p style="font-size:12px;color:var(--mu);margin:0 0 10px;font-style:italic">'+ct.why+'</p>';
    ct.updates.forEach(function(u){ h+='<div style="margin-bottom:10px"><span class="ov-chip" style="margin-right:6px">'+esc(u.q)+'</span><ul class="ov-bullets" style="margin-top:4px">'+u.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>'; });
    h+='</div></div>';
  });
  h+='</div>';
  // By quarter
  var byQ=relyCallsByQuarter();
  h+='<div class="lpb-acc" id="relyCallsQuarter" style="display:none">';
  byQ.order.forEach(function(q){
    h+='<div class="lpb-acc-item"><button type="button" class="lpb-acc-h"><span>'+esc(q)+'</span><span class="lpb-acc-ic">+</span></button><div class="lpb-acc-body">';
    byQ.map[q].forEach(function(row){ h+='<div style="margin-bottom:12px"><div class="calls-tl">'+esc(row.theme)+'</div><ul class="ov-bullets" style="margin-top:2px">'+row.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>'; });
    h+='</div></div>';
  });
  h+='</div>';
  h+='<div class="ov-fynote" style="margin-top:12px">Sources: Remitly Global Q4 2023 – Q1 2026 earnings calls, prepared remarks & the Dec 2025 Investor Day (transcripts). Highlights are qualitative and contemporaneous — written from the perspective of each call, not with hindsight.</div>';
  return h;
}
// ── Evolution ▸ Strategy (DRIVERS + 2028 TARGETS) ──
function ddStrategyBody(c){
  var h='<p class="ov-lede">Remitly\'s strategy (Investor Day, Dec 2025) is to compound the core remittance business while opening new monetization: <b>Remitly Business</b>, <b>Receivers</b>, <b>Remitly One & financial services</b>, <b>geographic expansion</b>, <b>unit-economics / marketing efficiency</b>, and <b>high-value senders & stablecoins</b>. <b>Tap any driver</b> for the detail.</p>';
  h+=sec('Growth drivers — the levers',
    '<div class="ov-drivers">'+DRIVERS.map(function(d,i){ return '<div class="ov-driver ov-clickable" data-detail="drv:'+i+'"><div class="ov-driver-t">'+esc(d[0])+'</div><div class="ov-driver-d">'+esc(d[1])+'</div><div class="ov-more">More ›</div></div>'; }).join('')+'</div>');
  h+=sec('2028 medium-term targets (Investor Day, Dec 2025)',
    '<div class="ov-targets ov-targets-3">'+TARGETS.map(function(b){ return '<div class="ov-target"><div class="ov-target-v">'+esc(b.v)+'</div><div class="ov-target-l">'+esc(b.l)+'</div><div class="ov-target-s">'+esc(b.s)+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:12px">The framework is <b>Rule of 40</b>: a 3-year revenue CAGR plus Adj. EBITDA margin of at least 40%. Revenue of <b>$2.6–3.0B</b> and Adj. EBITDA of <b>$575–600M (20–22% margin)</b> by 2028 imply durable ~20%+ growth alongside expanding profitability.</div>');
  h+='<div class="ov-foot">Source: Remitly Investor Day, Dec 2025. Forward targets are company objectives, not guarantees.</div>';
  return h;
}
// ── Evolution ▸ Timeline (history) ──
function ddTimelineBody(c){
  return sec('History & milestones — from BeamIt to a profitable public company',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">How a Techstars startup built for immigrant remittances became a profitable, public cross-border money-movement company — <b>tap any milestone</b> with "Read more".</div>'+
    stdTimeline());
}
// ── Evolution ▸ M&A (MNA) ──
function ddMnaBody(c){
  var h='<p class="ov-lede">Remitly has been largely organic; its one notable acquisition, <b>Rewire</b>, added an account-based product and European reach for migrant workers. <b>Tap the deal</b> for the detail.</p>';
  h+='<div class="ov-cards ov-cards-mna">'+MNA.map(function(m){
    return '<div class="ov-card ov-clickable" data-detail="mna:'+esc(m.name)+'">'+
      '<div class="ov-card-h"><span class="ov-card-n">'+esc(m.name)+'</span><span class="ov-chip">'+esc(m.date)+'</span></div>'+
      '<div class="ov-card-kpis"><span>'+esc(m.value)+'</span><span>'+esc(m.status)+'</span></div>'+
      '<div class="ov-more">What it added ›</div></div>';
  }).join('')+'</div>';
  return h;
}

// ── Valuation ▸ Financials (hardcoded series + FY_NOTE, timeline-moldable) ──
function ddFinancialsBody(c){
  var h='<p class="ov-lede">'+FIN_INTRO+'</p>';
  h+='<div class="ov-rangebar">'+
    '<div class="ov-range-head"><span class="ov-range-title">Timeline</span><span class="ov-range-val" id="ovFinVal">2021 – 2025</span></div>'+
    '<div class="ov-range-slider"><div class="ov-range-track"></div><div class="ov-range-fill" id="ovFinFill"></div>'+
      '<input type="range" id="ovFinMin" min="2021" max="2025" step="1" value="2021">'+
      '<input type="range" id="ovFinMax" min="2021" max="2025" step="1" value="2025">'+
      '<div class="ov-range-ticks" id="ovFinTicks"></div></div>'+
  '</div>';
  h+='<div class="ov-charts ov-charts-2">'+
    finCard('finRev','Revenue','FY21 – FY25')+
    finCard('finVol','Send Volume','FY21 – FY25')+
    finCard('finTake','Take Rate','FY21 – FY25')+
    finCard('finEbitda','Adj. EBITDA','FY23 – FY25')+
  '</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:10px">'+FIN_NOTE+'</div>';
  return h;
}
function finCard(id, title, sub){
  return '<div class="ov-chart-card"><div class="ov-chart-t">'+esc(title)+' <span>'+esc(sub)+'</span></div>'+
    '<div class="ov-chart-wrap"><canvas id="'+id+'"></canvas></div>'+
    '<div class="ov-statline" id="stat-'+id+'"></div></div>';
}

// ── Valuation ▸ Sensitivity — EV/EBITDA at FY2027E (the next full fiscal year), the
//    house convention. Drivers: FY2027E revenue × Adj-EBITDA margin → FY27 EBITDA;
//    × EV/EBITDA → EV; + net cash → equity → implied price vs the live quote. ──
var RELY_SENS_BASE={ netCash:0.6, shares:0.210, fy26Rev:1.97, pxFallbackPx:24.2 };
var RELY_SENS_DRIVERS=[
  { k:'rev',    label:'FY2027E revenue',           unit:'$B', min:2.0, max:2.9, step:0.05, base:2.35, hint:'FY26 guide ~$1.97B; ~20% growth → ~$2.35B' },
  { k:'margin', label:'FY2027E Adj-EBITDA margin', unit:'%',  min:14,  max:24,  step:0.5,  base:19.5, hint:'FY26 ~19%; 2028 target 20–22%' },
  { k:'mult',   label:'EV / EBITDA (forward)',     unit:'×',  min:7,   max:24,  step:0.5,  base:13,   hint:'premium grower turning profitable; directional' },
];
var _relySens={}; RELY_SENS_DRIVERS.forEach(function(d){ _relySens[d.k]=d.base; });
var _relyLiveMc=null, _relyLivePx=null;
function relySensCompute(){ var s=_relySens; var ebitda=s.rev*(s.margin/100); var ev=ebitda*s.mult; var equity=ev+RELY_SENS_BASE.netCash; var px=equity/RELY_SENS_BASE.shares; return { ebitda:ebitda, ev:ev, equity:equity, px:px }; }
function relySensBody(c){
  var h='<style>.msn-wrap{display:grid;grid-template-columns:1.1fr 1fr;gap:18px;margin-top:6px}@media(max-width:820px){.msn-wrap{grid-template-columns:1fr}}'+
    '.msn-drv{margin:0 0 15px}.msn-drl{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}'+
    '.msn-dn{font-size:12.5px;font-weight:800;color:var(--navy)}.msn-dv{font-size:13px;font-weight:900;color:'+RELY_BLUE+'}'+
    '.msn-dh{font-size:10.5px;color:var(--mu);margin-top:2px}'+
    '.msn-slider{width:100%;-webkit-appearance:none;height:5px;border-radius:5px;background:#E7ECF3;outline:none;margin-top:6px}'+
    '.msn-slider::-webkit-slider-thumb{-webkit-appearance:none;width:17px;height:17px;border-radius:50%;background:'+RELY_BLUE+';cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.2)}'+
    '.msn-slider::-moz-range-thumb{width:17px;height:17px;border:none;border-radius:50%;background:'+RELY_BLUE+';cursor:pointer}'+
    '.msn-eq{background:var(--w);border:1px solid var(--bdr);border-radius:11px;padding:13px 15px;font-size:12px;color:var(--navy);line-height:1.9}'+
    '.msn-eq b{color:'+RELY_BLUE+'}.msn-tiles{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}'+
    '.msn-tile{border:1px solid var(--bdr);border-radius:11px;padding:12px 14px;text-align:center}.msn-tile-v{font-size:20px;font-weight:900;color:var(--navy)}.msn-tile-l{font-size:10.5px;color:var(--mu);margin-top:2px}'+
    '.msn-price{grid-column:1 / -1;border-top:3px solid '+RELY_BLUE+';background:rgba(31,77,216,0.05)}.msn-price .msn-tile-v{font-size:26px;color:'+RELY_BLUE+'}'+
    '.msn-up{font-size:12.5px;font-weight:800;margin-top:3px}.msn-reset{margin-top:12px;font-size:11px;font-weight:800;color:'+RELY_BLUE+';background:none;border:1px solid '+RELY_BLUE+';border-radius:8px;padding:6px 12px;cursor:pointer}</style>';
  h+='<p class="ov-lede">Valued the way the desk does it — on <b>EV/EBITDA</b> (never EV/sales), at <b>FY2027E</b> (the next full fiscal year). Flex the drivers: FY2027E <b>revenue</b> and <b>Adj-EBITDA margin</b> set FY2027 EBITDA; an <b>EV/EBITDA</b> multiple turns that into enterprise value → equity (+ net cash) → an implied <b>price</b> vs the live quote. Base ≈ ~$2.35B revenue × ~19.5% margin at ~13×.</p>';
  h+='<div class="msn-wrap"><div id="relySensDrivers">'+RELY_SENS_DRIVERS.map(function(d){
      return '<div class="msn-drv"><div class="msn-drl"><span class="msn-dn">'+esc(d.label)+'</span><span class="msn-dv" id="relySensV-'+d.k+'">'+d.base+d.unit+'</span></div>'+
        '<input type="range" class="msn-slider" id="relySens-'+d.k+'" min="'+d.min+'" max="'+d.max+'" step="'+d.step+'" value="'+d.base+'">'+
        '<div class="msn-dh">'+esc(d.hint)+' · base '+d.base+d.unit+'</div></div>'; }).join('')+
      '<button type="button" class="msn-reset" id="relySensReset">↺ Reset to base case</button></div>'+
    '<div><div class="msn-eq" id="relySensEq"></div><div class="msn-tiles" id="relySensTiles"></div></div></div>';
  h+='<div class="ov-fynote" style="margin-top:14px"><b>How it chains:</b> FY2027E revenue × Adj-EBITDA margin → FY2027 Adj EBITDA → × EV/EBITDA → enterprise value → + net cash → equity → ÷ ~210M shares → implied price. <b>EV/EBITDA at the next full fiscal year (FY2027)</b> is the house convention — never EV/sales. Illustrative, not a Remitly forecast.</div>';
  h+='<div class="ov-foot">Anchors: FY2026 revenue guide ~$1.97B and the 2028 targets ($2.6–3.0B revenue, 20–22% Adj-EBITDA margin) bracket the FY2027E base (~$2.35B rev, ~19.5% margin); net cash ~$0.6B; ~210M shares. Live price via Massive; the EV/EBITDA multiple is a directional fair-value anchor. All outputs are model estimates.</div>';
  return h;
}
function relySensRender(root){
  root=root||document; var r=relySensCompute();
  var livePx=(_relyLivePx!=null)?_relyLivePx:RELY_SENS_BASE.pxFallbackPx;
  var up=(r.px/livePx-1)*100, upCol=up>=0?'#0F9D58':'#C0392B';
  var eq=root.querySelector('#relySensEq');
  if(eq) eq.innerHTML='FY2027E revenue <b>$'+_relySens.rev.toFixed(2)+'B</b> × <b>'+_relySens.margin.toFixed(1)+'%</b> margin → Adj EBITDA <b>$'+(r.ebitda*1000).toFixed(0)+'M</b> → × <b>'+_relySens.mult.toFixed(1)+'×</b> EV/EBITDA → EV <b>$'+r.ev.toFixed(2)+'B</b> + net cash <b>$'+RELY_SENS_BASE.netCash.toFixed(1)+'B</b> → equity <b>$'+r.equity.toFixed(2)+'B</b>';
  var tiles=root.querySelector('#relySensTiles');
  if(tiles) tiles.innerHTML=
    '<div class="msn-tile"><div class="msn-tile-v">$'+(r.ebitda*1000).toFixed(0)+'M</div><div class="msn-tile-l">FY2027E Adj. EBITDA</div></div>'+
    '<div class="msn-tile"><div class="msn-tile-v">$'+r.ev.toFixed(2)+'B</div><div class="msn-tile-l">Implied enterprise value</div></div>'+
    '<div class="msn-tile msn-price"><div class="msn-tile-l" style="margin-bottom:2px">Implied share price (FY2027E)</div><div class="msn-tile-v">$'+r.px.toFixed(0)+'</div><div class="msn-up" style="color:'+upCol+'">'+(up>=0?'+':'')+up.toFixed(1)+'% vs $'+livePx.toFixed(2)+(_relyLivePx!=null?' live':' est')+'</div></div>';
}
function relySensInit(root){
  root=root||document;
  RELY_SENS_DRIVERS.forEach(function(d){ var el=root.querySelector('#relySens-'+d.k); if(!el) return;
    el.oninput=function(){ _relySens[d.k]=parseFloat(el.value); var v=root.querySelector('#relySensV-'+d.k); if(v) v.textContent=el.value+d.unit; relySensRender(root); }; });
  var rb=root.querySelector('#relySensReset'); if(rb) rb.onclick=function(){ RELY_SENS_DRIVERS.forEach(function(d){ _relySens[d.k]=d.base; var el=root.querySelector('#relySens-'+d.k); if(el) el.value=d.base; var v=root.querySelector('#relySensV-'+d.k); if(v) v.textContent=d.base+d.unit; }); relySensRender(root); };
  relySensRender(root);
}

// ── Management ▸ Executives & Board (makeManagement) ──
// Built from PUBLIC facts (Remitly IR leadership page, press releases). Titles are the
// operative mid-2026 roster — VERIFY against the latest DEF 14A. No photos (initials fallback).
var RELY_MGMT = makeManagement({
  brand:RELY_BLUE,
  lede:"Remitly is led by CEO <b>Sebastian Gunningham</b> (since Feb 19, 2026), a veteran operator (ex-Amazon S-team SVP, ex-WeWork Vice Chair), after a founder-to-operator handoff from co-founder <b>Matt Oppenheimer</b> — CEO from 2011 — who continues as (non-employee) <b>Chairman of the Board</b>. Finance is run by CFO <b>Vikas Mehta</b> (since Aug 2024). Co-founder <b>Josh Hug</b> remains on the board. This roster is drawn from Remitly\'s <b>DEF 14A proxy (filed Apr 24, 2026)</b> and the Feb 2026 CEO-transition 8-K — <b>verify against the latest proxy</b>. Live ownership & insider activity populate the Ownership subtab (Fiscal.ai / Bloomberg).",
  execs:[
    { id:'gunningham', lead:true, name:'Sebastian J. Gunningham', title:'Chief Executive Officer & Director', since:'CEO since Feb 19, 2026',
      line:'Veteran operator; ex-Amazon S-team SVP and ex-WeWork Vice Chair.',
      bio:'Chief Executive Officer and a director since February 19, 2026. A veteran technology operator: an Amazon Senior Vice President and S-team member (2007–2018), then Vice Chair & Co-CEO of WeWork (2018–2020), Chairman of Santander Consumer Finance / Vice Chairman of Openbank (2020–2026) and CEO of Material Bank (2023–2025); earlier senior roles at Oracle and Apple. Stanford mathematics degree. Took over from co-founder Matt Oppenheimer to scale Remitly toward its 2028 targets.' },
    { id:'oppenheimer', name:'Matthew Oppenheimer', title:'Co-Founder & Chairman of the Board', since:'Founder 2011 · CEO 2011–2026 · Chair ongoing',
      line:'Co-founder and long-time CEO; now (non-employee) board Chairman.',
      bio:'Co-founded Remitly (as BeamIt Mobile) in 2011 and served as CEO from founding until February 2026, when he handed the CEO role to Sebastian Gunningham and continued as Chairman of the Board (a non-employee role; the proxy classifies him as a non-independent director, not an executive). Previously ran mobile & internet banking for Barclays in Kenya — the founding insight for Remitly. Harvard MBA; sits on the BECU board.' },
    { id:'mehta', name:'Vikas Mehta', title:'Chief Financial Officer', since:'CFO since Aug 2024',
      line:'Owns finance through the profitability inflection.',
      bio:'Chief Financial Officer since August 2024 — owns finance, accounting, investor relations, treasury and capital allocation, guiding Remitly through its shift to full-year GAAP profitability (2025) and the 2028 Rule-of-40 framework. Previously CFO of Komodo Health, Anaplan and Nike Direct; VP Finance at Walmart eCommerce; ~10 years at Microsoft. (Succeeded Hemanth Munipalli, who resigned as CFO in 2024.)' },
    { id:'sharma', name:'Pankaj Sharma', title:'Chief Business Officer', since:'CBO since Feb 2024 · at Remitly since ~2017',
      line:'Runs the global remittance business; a long-tenured operator.',
      bio:'Chief Business Officer, at Remitly since ~2017 (joined when the company was ~$100M revenue; most recently EVP, Global Remittance Business Management) — owns the core remittance business, corridor expansion and the growth engine (acquisition, retention, pricing). Presented the core-business durability at the Dec 2025 Investor Day. Earlier at Lebara Mobile, KPMG and EY.' },
    { id:'sinha', name:'Ankur Sinha', title:'Chief Product & Technology Officer', since:'CPTO · at Remitly since ~2021',
      line:'Owns product, engineering & the platform — architect of the multi-product build.',
      bio:'Chief Product & Technology Officer, at Remitly since ~2021 — runs product, engineering, data and the technology platform. Architected the re-platforming ("North Star Architecture") that let Remitly ship five products in 12 months, and leads the AI + stablecoin build-out and the new-product suite (Business, Flex, Wallet/Card, Remitly One). Led the entire product/platform section at the Dec 2025 Investor Day. Previously ~15 years across Microsoft and Google.' },
    { id:'somalya', name:'Saema Somalya', title:'Chief Legal & Corporate Affairs Officer', since:'CLCAO since Aug 2024 · at Remitly since Dec 2020',
      line:'Runs legal, risk, compliance and corporate affairs.',
      bio:'Chief Legal & Corporate Affairs Officer since August 2024 — the legal, risk, compliance and corporate-affairs organization across 170+ regulated markets; a core moat given Remitly\'s 100+ licenses. Joined Remitly in December 2020 as EVP Legal & Risk / General Counsel. Previously a senior legal executive at a bank. On the Dec 2025 Investor Day Q&A panel.' },
    { id:'peled', name:'Ronit Peled', title:'Chief People Officer',
      line:'Owns people & culture — which management frames as a competitive asset.',
      bio:'Chief People Officer — runs HR, talent and the mission-driven culture ("reimagine what\'s possible") that management repeatedly cites as a competitive asset, now with AI fluency a company-wide performance objective. On the Dec 2025 Investor Day Q&A panel.' },
  ],
  board:[
    { name:'Matthew Oppenheimer', chair:true, dual:true, independent:false, role:'Co-founder & Chairman; former CEO (also management — see above).' },
    { name:'Sebastian J. Gunningham', dual:true, independent:false, role:'Chief Executive Officer of Remitly.' },
    { name:'Joshua Hug', independent:false, role:'Co-founder; former Chief Product Officer / COO / Vice Chair (board seat since 2011).' },
    { name:'Phillip Riese', independent:true, role:'Lead Independent Director. Ex-President, Consumer Card Services & Chairman, American Express Centurion Bank; Flywire board.' },
    { name:'Laurent Le Moal', independent:true, role:'Executive Chairman of myPOS; ex-CEO of PayU (Naspers/Prosus); ex-PayPal.' },
    { name:'Bora Chung', independent:true, role:'Ex-Chief Experience Officer, Bill.com; ex-CPO eBay Korea; ex-Apple payments; Krafton board.' },
    { name:'Margaret Smyth', independent:true, role:'Ex-US CFO, National Grid; Etsy board; ex-Deloitte / Arthur Andersen.' },
    { name:'Nigel Morris', independent:true, role:'Managing Partner, QED Investors; co-founder / former President & COO, Capital One.' },
    { name:'Ryno Blignaut', independent:true, role:'Operating Partner, Khosla Ventures; ex-CFO/CRO of Xoom; ex-President/CFO, Restoration Hardware.' },
    { name:'Phyllis Campbell', independent:true, role:'Ex-Regional Chair, Pacific NW, JPMorgan Chase; ex-CEO Seattle Foundation & U.S. Bank of Washington; SanMar board.' },
    { name:'Adam Messinger', independent:true, role:'Ex-CTO of Twitter; ex-VP Development, Oracle; tech advisor (joined the board Apr 2026).' },
  ],
  boardNote:'11 directors (per the Apr 2026 proxy); Chair is co-founder Matt Oppenheimer, with <b>Phillip Riese</b> as Lead Independent Director. All independent except Oppenheimer, Hug and Gunningham (8 of 11 independent). Early backers reflected on the board: QED Investors (Morris) and PayU/Naspers-Prosus (Le Moal). <b>Verify against the latest DEF 14A;</b> live ownership & insider activity are in the Ownership subtab.',
  foot:'Roster cross-checked against the <b>Dec 2025 Investor Day</b> (where Gunningham, Oppenheimer, Mehta, Sharma, Sinha, Somalya and Peled all presented or joined the Q&A panel) plus the Feb 2026 CEO-transition 8-K and the DEF 14A. No headshots wired (initials fallback). Verify titles against the latest filings. Ownership & insider trades are live in the Ownership subtab (Fiscal.ai / Bloomberg).',
});

// ── Management ▸ Track Record — rate each exec on value creation (green/amber/red),
//    with a Remitly record + a prior/external one. Editorial read from tenure + what
//    each built (per the calls / Investor Day), not a Remitly statement. ──
var RELY_TRACK_RATE={ green:{c:'#0F9D58',bg:'rgba(15,157,88,0.07)',l:'Value creator'}, amber:{c:'#E8A00C',bg:'rgba(232,160,12,0.08)',l:'Mixed / unproven'}, red:{c:'#C0392B',bg:'rgba(192,57,43,0.07)',l:'Value destroyer'} };
var RELY_RESHUFFLE='The team was reset by the <b>Feb 2026 CEO transition</b> — co-founder <b>Matt Oppenheimer</b> (CEO 2011–2026) handed the reins to <b>Sebastian Gunningham</b> and moved to Chairman. Gunningham kept the strategy but changed the pace (smaller teams, AI-by-default, the 4×4 customer/product matrix). The bench below is the operating team as of the Dec 2025 Investor Day + Q1 2026 call.';
var RELY_TRACK=[
  {id:'gunningham', n:'Sebastian Gunningham', r:'Chief Executive Officer', t:'CEO since Feb 2026', rate:'green',
    one:'Elite operator pedigree (ex-Amazon S-team) brought in to accelerate — strong external record, early at Remitly.',
    co:['Kept the strategy, changed the pace — 4×4 matrix, AI-by-default, smaller autonomous teams','Q1 2026 was a record: first >$100M Adj-EBITDA quarter, +25% revenue, ~4×\'d the buyback'],
    ext:['Amazon <b>SVP & S-team</b> — scaled the third-party <b>Marketplace</b> to a multi-hundred-$B GMV business; ran Amazon Payments','Vice Chair/Co-CEO of <b>WeWork</b>; Chair, <b>Santander Consumer Finance</b>; CEO, Material Bank'],
    note:'Rated on an elite value-creation record; the open question is Remitly-specific execution — only ~90 days in as of Q1 2026. Medium-high confidence.'},
  {id:'oppenheimer', n:'Matthew Oppenheimer', r:'Co-Founder & Chairman', t:'Founder 2011 · CEO 2011–2026', rate:'green',
    one:'Built Remitly from a Techstars idea to a profitable public company — and ran a clean succession from a position of strength.',
    co:['Scaled revenue ~<b>$250M (2020) → ~$1.6B (2025)</b>, ~5× QAUs, to the first full-year GAAP profit','Ran a deliberate, board-led CEO succession while remaining the largest individual holder'],
    ext:['Ran mobile & internet banking for <b>Barclays</b> in Kenya — the founding insight for Remitly'],
    note:'Founder value-creation is unambiguous; the risk (founder dependency) is mitigated by staying on as engaged Chairman. High confidence.'},
  {id:'mehta', n:'Vikas Mehta', r:'Chief Financial Officer', t:'CFO since Aug 2024', rate:'green',
    one:'Owned the profitability inflection — first full-year GAAP profit, tripling FCF, and the first-ever buybacks.',
    co:['FY2025: first full-year GAAP profit ($68M), Adj EBITDA $272M (~17%), FCF $283M (3×)','Drove dilution down (SBC 9.5%→~6% of revenue) and launched the buyback; framed the Rule-of-40 model'],
    ext:['~25 years across software / fintech / e-commerce and Fortune-500 finance roles'],
    note:'Strong finance discipline through the inflection; a couple of years into the seat. High confidence.'},
  {id:'sharma', n:'Pankaj Sharma', r:'Chief Business Officer', t:'at Remitly since ~2017', rate:'green',
    one:'Ran the growth engine that scaled the business ~15× since he joined at ~$100M revenue.',
    co:['Owns acquisition, retention, pricing and corridor expansion — the ~6× LTV/CAC, <12-mo-payback machine','Grew core-corridor share (e.g. 4%→12% in Mexico/India/Philippines) while diversifying beyond the top three'],
    ext:['Earlier at Lebara Mobile, KPMG and EY'],
    note:'Long-tenured operator behind the durable-growth story. High confidence.'},
  {id:'sinha', n:'Ankur Sinha', r:'Chief Product & Technology Officer', t:'at Remitly since ~2021', rate:'green',
    one:'Re-platformed the company so it could ship five new products in twelve months — the multi-product engine.',
    co:['Architected the "North Star" platform; +36% developer throughput; five products in 12 months','Leads the AI (support −40% cost, agentic dev) and stablecoin build-out'],
    ext:['~15 years across <b>Microsoft</b> and <b>Google</b>'],
    note:'The technical bet behind the whole new-product thesis runs through him. High confidence.'},
  {id:'somalya', n:'Saema Somalya', r:'Chief Legal & Corporate Affairs Officer', t:'at Remitly since Dec 2020', rate:'green',
    one:'Runs the regulatory moat — 100+ licenses across 170+ markets, with a clean growth-runway record.',
    co:['Legal / risk / compliance across a heavily-regulated global footprint (100+ licenses)','A differentiator: peers have hit license shutoffs / growth restrictions; Remitly has largely avoided them'],
    ext:['Formerly a senior legal executive at a bank'],
    note:'Compliance is a genuine moat in remittances, and it has held up. High confidence.'},
  {id:'peled', n:'Ronit Peled', r:'Chief People Officer', t:'CPO', rate:'amber',
    one:'Owns people & culture — a stated competitive asset, but the hardest role to rate on value creation.',
    co:['Runs talent, culture and the AI-fluency-as-a-performance-objective push','Culture (mission-driven, high engagement) is cited by management as a retention/execution edge'],
    ext:['Prior people-leadership roles (limited public disclosure)'],
    note:'Amber not as a negative — the value lever is real but less externally visible / measurable than the others.'},
];
function relyTrackBody(c){
  var card=function(p){ var rt=RELY_TRACK_RATE[p.rate];
    return '<div class="mtk-card ov-clickable" data-detail="rtr:'+p.id+'" style="border-left:3px solid '+rt.c+';background:'+rt.bg+'">'+
      '<div class="mtk-top"><div><div class="mtk-n">'+esc(p.n)+'</div><div class="mtk-r">'+esc(p.r)+'</div></div><span class="mtk-badge" style="color:'+rt.c+';border-color:'+rt.c+'">'+rt.l+'</span></div>'+
      '<div class="mtk-t">'+esc(p.t)+'</div><div class="mtk-one">'+p.one+'</div>'+
      '<div class="mtk-more" style="color:'+rt.c+'">Read more ›</div></div>'; };
  var h='<style>.mtk-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:6px 0 4px}@media(max-width:720px){.mtk-grid{grid-template-columns:1fr}}'+
    '.mtk-card{border:1px solid var(--bdr);border-radius:11px;padding:12px 14px;cursor:pointer;transition:box-shadow .15s}.mtk-card:hover{box-shadow:0 3px 12px rgba(18,53,107,0.09)}'+
    '.mtk-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}'+
    '.mtk-n{font-size:14px;font-weight:800;color:var(--navy)}.mtk-r{font-size:11px;color:var(--mu);margin-top:1px}'+
    '.mtk-badge{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border:1px solid;border-radius:9px;padding:2px 7px;white-space:nowrap}'+
    '.mtk-t{font-size:10.5px;color:var(--mu);margin:7px 0 5px}.mtk-one{font-size:12px;color:var(--navy);line-height:1.5}.mtk-more{font-size:11px;font-weight:800;margin-top:8px}</style>';
  h+='<p class="ov-lede">The people running Remitly, rated on <b>value creation</b> (a Remitly record + a prior/external one) — the color is the net read. Two things stand out: a <b>founder-to-operator handoff</b> (Oppenheimer → Gunningham, Feb 2026) done from strength, and a bench that built the profitability inflection and the multi-product engine. <b>Tap any card</b> for the full read.</p>';
  h+='<div style="display:flex;gap:12px;flex-wrap:wrap;margin:0 0 10px;font-size:10.5px;color:var(--mu)">'+Object.keys(RELY_TRACK_RATE).map(function(k){ var rt=RELY_TRACK_RATE[k]; return '<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:'+rt.c+'"></span>'+rt.l+'</span>'; }).join('')+'</div>';
  h+='<div class="ov-callout" style="margin:0 0 12px">'+RELY_RESHUFFLE+'</div>';
  h+='<div class="ov-sec-h ovt-store-h">Executive management</div><div class="mtk-grid">'+RELY_TRACK.map(card).join('')+'</div>';
  h+='<div class="ov-sec-h ovt-store-h" style="margin-top:14px">The board</div>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 4px">Operator-heavy and investor-anchored: <b>Phillip Riese</b> (Lead Independent, ex-Amex) chairs a board with <b>Nigel Morris</b> (QED / Capital One co-founder), <b>Laurent Le Moal</b> (ex-PayU/PayPal) and <b>Adam Messinger</b> (ex-Twitter CTO). 8 of 11 independent; only the CEO, Chairman and co-founder Josh Hug are non-independent. Full board list in <b>Executives & Board</b>.</div>';
  h+='<div class="ov-foot">Ratings are an editorial read of tenure + what each person built (from the calls / Dec 2025 Investor Day), not a Remitly output. Roster verified against the Investor Day panel + Feb 2026 8-K; verify titles against the latest proxy.</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════
//  DEEP DIVE — assembly
// ═══════════════════════════════════════════════════════════════════════════
function deepDiveHtml(c){
  var h='<div class="ov ov-rely ov-rely-dd" data-brand="RELY">';
  h+='<style>.dd-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 14px;border-bottom:1px solid var(--bdr)}'+
    '.dd-tab{border:none;background:transparent;font:inherit;font-size:12.5px;font-weight:700;color:var(--mu);padding:8px 14px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px}'+
    '.dd-tab:hover{color:var(--navy)}.dd-tab.active{color:var(--navy);border-bottom-color:var(--navy)}</style>';
  h+='<div class="dd-tabs">'+
    '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
    '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
    '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
    '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
    '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
  '</div>';
  // Top Line
  h+='<div class="dd-pane" data-dd="topline">'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="segments">Segments</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="customers">Customers & Corridors</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="tam">TAM</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="industry">Industry Analysis</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="segments">'+ddSegmentsBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="customers" hidden>'+ddCustomersBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="tam" hidden>'+ddTamBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="industry" hidden>'+ddIndustryBody(c)+'</div>'+
  '</div>';
  // Bottom Line
  h+='<div class="dd-pane" data-dd="bottomline" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="unit">Unit Economics</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="suppliers">Suppliers</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="margins">Margins</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="unit">'+ddUnitEconBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="suppliers" hidden>'+ddSuppliersBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="margins" hidden>'+ddMarginsBody(c)+'</div>'+
  '</div>';
  // Evolution
  h+='<div class="dd-pane" data-dd="evolution" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="callprep">Call Prep</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="strategy">Strategy</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="timeline">Timeline</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="mna">M&A</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="callprep">'+
      cpIRButton()+
      '<div class="cp-note" style="margin-bottom:12px">🎯 <b>Call Prep</b> — the decision layer, in three phases: <b>① Pre-Call</b> (go in ready — Setup · Watch List, with themes tracked across quarters) → <b>② Post-Results</b> (react to the numbers, which land before the call) → <b>③ Post-Call</b> (what management said + the meeting take). Append-only per quarter — pick a quarter below; each quarter keeps its frozen pre-call blocks next to its post-mortem, so the tab is a record of how well we read Remitly. The <b>Watch List</b> is the single home for theme-tracking — the old standalone <i>Earnings Calls</i> tab was folded into it (no two tabs on the same call highlights). <b>Consensus (Bloomberg) + Summit + the 4 custom KPIs render "to fill / to define" until the export lands.</b></div>'+
      cpQPills()+
      '<div class="cp-phtabs">'+
        '<button type="button" class="cp-phtab active" data-cpp="setup">Setup</button>'+
        '<button type="button" class="cp-phtab" data-cpp="watch">Watch List</button>'+
        '<button type="button" class="cp-phtab" data-cpp="results">Post-Results</button>'+
        '<button type="button" class="cp-phtab" data-cpp="postcall">Post-Call</button>'+
      '</div>'+
      '<div class="cp-phpane" data-cpp="setup">'+cpSetupBody(c)+'</div>'+
      '<div class="cp-phpane" data-cpp="watch" hidden>'+cpWatchBody(c)+'</div>'+
      '<div class="cp-phpane" data-cpp="results" hidden>'+cpResultsBody(c)+'</div>'+
      '<div class="cp-phpane" data-cpp="postcall" hidden>'+cpCallBody(c)+'</div>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="strategy" hidden>'+ddStrategyBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="timeline" hidden>'+ddTimelineBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="mna" hidden>'+ddMnaBody(c)+'</div>'+
  '</div>';
  // Valuation
  h+='<div class="dd-pane" data-dd="valuation" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="ratings">Analyst Ratings</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="balance">Financials</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="sensitivity">Sensitivity</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="ratings"><div id="dd-val-slot"></div></div>'+
    '<div class="ovt-subpane" data-ovst="balance" hidden>'+ddFinancialsBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="sensitivity" hidden>'+relySensBody(c)+'</div>'+
  '</div>';
  // Management
  h+='<div class="dd-pane" data-dd="mgmt" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="team">Executives & Board</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="track">Track Record</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="ownership">Ownership</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="team">'+RELY_MGMT.body()+'</div>'+
    '<div class="ovt-subpane" data-ovst="track" hidden>'+relyTrackBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="ownership" hidden><div id="dd-mgmt-slot"></div></div>'+
  '</div>';
  h+='<div class="ov-foot">'+esc(DD_SOURCES)+'</div>';
  h+='</div>';
  return h;
}

// ─── Quarterly charts (Overview / Top Line ▸ Segments) ───────────────────────
function lineChart(canvasId, labels, data, color, fill, valueFmt){
  var cv = document.getElementById(canvasId);
  if (!cv || typeof Chart === 'undefined' || !cv.offsetParent) return null;
  var ex=Chart.getChart?Chart.getChart(cv):null; if(ex) ex.destroy();
  return new Chart(cv.getContext('2d'), {
    type:'line',
    data:{ labels:labels, datasets:[{ data:data, borderColor:color, backgroundColor:fill, borderWidth:2.5,
      pointRadius:0, pointHoverRadius:5, tension:.3, fill:true }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      interaction:{ mode:'index', intersect:false },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ return valueFmt(ctx.parsed.y); } } } },
      scales:{
        y:{ grid:{ color:C_GRID }, ticks:{ color:C_AXIS, font:{size:10}, callback:function(v){return valueFmt(v);} } },
        x:{ grid:{ display:false }, ticks:{ color:C_AXIS, font:{size:9}, maxRotation:0, autoSkip:true, maxTicksLimit:8 } }
      } }
  });
}
function buildRelyCharts(){
  if (typeof Chart === 'undefined') return;
  _chartActive = lineChart('ovChartActive', QLABELS, ACTIVE, RELY_BLUE, _hexRgba(RELY_BLUE,0.10), function(v){ return Number(v).toFixed(1)+'M'; });
  _chartVol    = lineChart('ovChartVolume', QLABELS, SENDVOL, RELY_STEEL, _hexRgba(RELY_STEEL,0.10), function(v){ return fmtUSD_M(v); });
  _chartTake   = lineChart('ovChartTake', QLABELS, TAKERATE, RELY_STEEL2, _hexRgba(RELY_STEEL2,0.10), function(v){ return Number(v).toFixed(2)+'%'; });
}
// ─── Margins chart (Bottom Line ▸ Margins) ───────────────────────────────────
function buildRelyMargins(){
  var cv=document.getElementById('relyChartMargins'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var ex=Chart.getChart?Chart.getChart(cv):null; if(ex) ex.destroy();
  new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:RELY_MRG_ROWS.map(function(r){ return r.fy; }), datasets:[
      { label:'Adj. EBITDA margin', data:RELY_MRG_ROWS.map(function(r){ return r.ebitdaM; }), backgroundColor:RELY_GREEN, borderRadius:5, maxBarThickness:60 } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(ctx){ return ctx.parsed.y.toFixed(1)+'%'; } } } },
      scales:{ y:{ grid:{color:C_GRID}, ticks:{ callback:function(v){ return v+'%'; }, font:{size:10}, color:C_AXIS } }, x:{ grid:{display:false}, ticks:{font:{size:11}, color:C_AXIS} } } }
  });
}
// ─── Annual financials charts (Valuation ▸ Financials, timeline-moldable) ─────
function finSlice(s){
  var o={years:[],labels:[],data:[]};
  for(var i=0;i<FIN_YEARS.length;i++){ var y=FIN_YEARS[i];
    if(y>=_finStart && y<=_finEnd){ o.years.push(y); o.data.push(s.data[i]); o.labels.push('FY'+String(y).slice(2)); } }
  return o;
}
function makeFin(id){
  var s=FIN_SERIES[id]; var cv=document.getElementById(id); if(!cv||typeof Chart==='undefined') return;
  var sl=finSlice(s); var ds;
  if(s.type==='bar'){ ds={ data:sl.data, backgroundColor:s.color, borderRadius:5, maxBarThickness:46 }; }
  else { ds={ data:sl.data, borderColor:s.color, backgroundColor:_hexRgba(s.color,0.08), fill:true, tension:0.3, borderWidth:2.5, pointRadius:3, pointHoverRadius:5, spanGaps:true }; }
  _finCharts[id]=new Chart(cv.getContext('2d'), { type:s.type, data:{labels:sl.labels, datasets:[ds]},
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(ctx){ return ' '+s.fmt(ctx.parsed.y); } } } },
      scales:{ x:{ grid:{display:false}, ticks:{color:C_AXIS,font:{size:10}} },
               y:{ grid:{color:C_GRID}, ticks:{color:C_AXIS,font:{size:10},callback:s.fmt} } } }
  });
  var el=document.getElementById('stat-'+id); if(!el) return;
  var idxs=[]; for(var j=0;j<sl.data.length;j++) if(sl.data[j]!=null) idxs.push(j);
  if(idxs.length>=2){ var fi=idxs[0], li=idxs[idxs.length-1], a=sl.data[fi], z=sl.data[li], yrs=sl.years[li]-sl.years[fi];
    var cagr=(Math.pow(z/a, 1/(yrs||1))-1)*100;
    el.innerHTML='<b>'+sl.labels[fi]+'</b> '+s.fmt(a)+' → <b>'+sl.labels[li]+'</b> '+s.fmt(z)+' · CAGR <span class="'+(cagr>=0?'pos':'neg')+'">'+(cagr>=0?'+':'')+cagr.toFixed(1)+'%</span>';
  } else { el.innerHTML='<span class="ov-stat-mut">Pick a wider range</span>'; }
}
function renderFin(){
  if (typeof Chart === 'undefined') return;
  Object.keys(_finCharts).forEach(function(id){ try{ _finCharts[id].destroy(); }catch(e){} }); _finCharts={};
  Object.keys(FIN_SERIES).forEach(makeFin);
}

// ─── Deep Dive tab machinery (top-level .dd-tab + nested .ovt-subtab) ─────────
function activeDD(root){ var b=root.querySelector('.dd-tab.active'); return b?b.getAttribute('data-dd'):'topline'; }
function activeSubKey(root, group){ var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return null; var b=pane.querySelector('.ovt-subtab.active'); return b?b.getAttribute('data-ovst'):null; }
function buildSub(root, group, key){
  if(group==='topline' && key==='segments') buildRelyCharts();
  if(group==='bottomline' && key==='margins') buildRelyMargins();
  if(group==='valuation' && key==='balance') renderFin();
  if(group==='valuation' && key==='sensitivity') relySensInit(root);
  if(group==='mgmt' && key==='team') RELY_MGMT.init(root);
}
function buildDD(root, key){ var s=activeSubKey(root,key); if(s) buildSub(root,key,s); }
function showSub(root, pane, group, key){
  pane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovst')===key); });
  pane.querySelectorAll('.ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
  requestAnimationFrame(function(){ buildSub(root, group, key); });
}
function wireSubtabs(root, group){ var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return;
  pane.querySelectorAll('.ovt-subtab').forEach(function(btn){ btn.onclick=function(){ showSub(root, pane, group, btn.getAttribute('data-ovst')); }; }); }
function showDD(root, key){
  root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-dd')===key); });
  root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
  requestAnimationFrame(function(){ buildDD(root, key); });
}
function wireDD(root){ root.querySelectorAll('.dd-tab').forEach(function(btn){ btn.onclick=function(){ showDD(root, btn.getAttribute('data-dd')); }; }); }

// ═══════════════════════════════════════════════════════════════════════════
//  init — wires BOTH profile panes (root #co-detailview spans Overview + Deep Dive)
// ═══════════════════════════════════════════════════════════════════════════
function init(c){
  var root = document.getElementById('co-detailview'); if(!root) return;

  // Overview charts render in the Overview only if their canvases exist there — they live in
  // Deep Dive ▸ Top Line ▸ Segments, built lazily. Build now in case that pane is visible.
  buildRelyCharts();

  // Collapsibles (Overview progressive disclosure)
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement; var open=cc.classList.toggle('open'); var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }; });

  // Dynamic peer scatter (Overview)
  relyScReset(); relyScRender(root); relyScChips(root);
  var sctip=root.querySelector('#relyScTip');
  function relyPeerByTk(tk){ var r=null; (RELY_SC.peers||[]).forEach(function(p){ if(p.tk===tk) r=p; }); return r; }
  function wireScNodes(){ if(!sctip) return; var cont=root.querySelector('#relyScNodes'); if(!cont||cont._scWired) return; cont._scWired=true; var cur=null;
    function nodeOf(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; }
    function show(g){ var p=relyPeerByTk(g.getAttribute('data-tk')); if(!p) return;
      var col=p.hl?RELY_BLUE:'#7A8699';
      var pe=(RELY_SC.basis==='f'?p.peF:p.peT), ev=(RELY_SC.basis==='f'?p.evF:p.evT), gr=(RELY_SC.basis==='f'?p.gf:p.gt);
      var chip=function(l,v){ return v==null?'':'<span class="mgt-chip"><b>'+v+'</b> '+l+'</span>'; };
      sctip.innerHTML='<div class="mgt-hd"><span class="mgt-logo" style="border-color:'+col+'"><img src="'+(p.logo?esc(p.logo):'https://assets.parqet.com/logos/symbol/'+esc(p.tk))+'" alt="" onerror="this.remove()"></span><span class="mgt-n" style="color:'+col+'">'+esc(p.n)+'</span></div>'+
        '<div class="mgt-chips">'+chip('P/E',pe?pe+'×':null)+chip('EV/EBITDA',ev?ev+'×':null)+chip('growth',gr!=null?gr+'%':null)+chip('mkt cap',p.mc?'$'+(p.mc>=1000?(p.mc/1000).toFixed(2)+'T':Math.round(p.mc)+'B'):null)+'</div>'+
        '<div class="mgt-why">'+(p.why||'')+'</div>';
      sctip.hidden=false; }
    function move(e){ sctip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; sctip.style.top=(e.clientY+16)+'px'; }
    function raise(g){ if(g.parentNode) g.parentNode.appendChild(g); }
    cont.addEventListener('pointerover', function(e){ var g=nodeOf(e); if(!g) return; if(g!==cur){ cur=g; raise(g); } show(g); move(e); });
    cont.addEventListener('pointermove', function(e){ if(nodeOf(e)) move(e); });
    cont.addEventListener('pointerout', function(e){ var g=nodeOf(e); if(!g) return; var to=e.relatedTarget; if(to&&(g===to||g.contains(to)||(to.closest&&to.closest('.mg-node')===g))) return; cur=null; sctip.hidden=true; });
    cont.addEventListener('click', function(e){ var g=nodeOf(e); if(!g) return; raise(g); cur=g; show(g); move(e); });
  }
  function scRefresh(){ relyScRender(root); wireScNodes(); }
  wireScNodes();
  root.querySelectorAll('.mg-pill').forEach(function(btn){ btn.onclick=function(){
    if(btn.hasAttribute('data-mgtype')){ RELY_SC.type=btn.getAttribute('data-mgtype'); root.querySelectorAll('.mg-pill[data-mgtype]').forEach(function(b){ b.classList.toggle('active', b===btn); }); }
    else { RELY_SC.basis=btn.getAttribute('data-mgbasis'); root.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b===btn); }); }
    scRefresh();
  }; });
  function wireChips(){
    root.querySelectorAll('#relyScChips .masc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(RELY_SC.peers[i]){ RELY_SC.peers.splice(i,1); relyScChips(root); wireChips(); scRefresh(); } }; });
    var addBtn=root.querySelector('#relyScAddBtn'), addIn=root.querySelector('#relyScAddTk');
    if(addBtn&&addIn){ addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!RELY_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=RELY_PEERS.filter(function(p){ return p.tk===tk; })[0];
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; RELY_SC.peers.push(o); }
        else RELY_SC.peers.push({ tk:tk, n:tk, on:true, mc:5, evT:null,evF:null,peT:null,peF:null,gt:null,gf:null, why:'Added by ticker — live market cap only; no multiple on file, so it plots once one is available.' });
      }
      addIn.value=''; relyScChips(root); wireChips(); scRefresh(); relyLiveOne(tk); }; }
  }
  wireChips();

  // Live quote (banner #relyLive + Key Facts #relyMc + peer bubbles + sensitivity live mkt cap)
  function relyLiveOne(tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(q){ if(!q) return;
    var mcB=q.marketCap!=null ? q.marketCap/1e9 : null;
    if(mcB!=null){ RELY_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=mcB; }); }
    if(tk==='RELY'){
      if(q.price!=null){ _relyLivePx=q.price; }
      if(mcB!=null){ _relyLiveMc=mcB; }
      relySensRender(root);
      if(mcB!=null){ var el=root.querySelector('#relyMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live'; }
      var lb=root.querySelector('#relyLive');
      if(lb && q.price!=null){ var chg=q.changePct; var chgCol=chg==null?'var(--mu)':(chg>=0?'#0F9D58':'#C0392B'); var chgTxt=chg==null?'':' <span style="color:'+chgCol+';font-weight:800">'+(chg>=0?'+':'')+chg.toFixed(2)+'%</span>';
        lb.innerHTML='<span class="rely-live-dot"></span>RELY <b>$'+q.price.toFixed(2)+'</b>'+chgTxt+' <span style="margin-left:auto">'+(mcB!=null?'mkt cap $'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B'):'')+'</span>'; }
    }
    scRefresh();
  }).catch(function(){}); }
  RELY_SC.peers.forEach(function(p){ if(p.tk) relyLiveOne(p.tk); });

  // Deep Dive tab wiring (root spans both panes)
  wireDD(root);
  wireSubtabs(root,'topline'); wireSubtabs(root,'bottomline'); wireSubtabs(root,'evolution'); wireSubtabs(root,'valuation'); wireSubtabs(root,'mgmt');
  wireCallPrep(root);

  // Evolution ▸ Earnings Calls — By theme ⇄ By quarter lens toggle
  root.querySelectorAll('.calls-pill[data-relycallsv]').forEach(function(btn){ btn.onclick=function(){ var v=btn.getAttribute('data-relycallsv');
    root.querySelectorAll('.calls-pill[data-relycallsv]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    var th=root.querySelector('#relyCallsTheme'), qt=root.querySelector('#relyCallsQuarter');
    if(th) th.style.display=(v==='theme')?'':'none'; if(qt) qt.style.display=(v==='quarter')?'':'none';
  }; });
  // Earnings-call accordion rows (theme & quarter) — expand/collapse
  root.querySelectorAll('.lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var it=btn.parentElement; var open=it.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'–':'+'; }; });

  // Financials timeline slider (Deep Dive ▸ Valuation ▸ Financials)
  var fmn = root.querySelector('#ovFinMin'), fmx = root.querySelector('#ovFinMax');
  var ffill = root.querySelector('#ovFinFill'), fval = root.querySelector('#ovFinVal'), ftk = root.querySelector('#ovFinTicks');
  if (fmn){
    var FY0=2021, FY1=2025, th='';
    for (var y=FY0; y<=FY1; y++) th += '<span>' + "'" + String(y).slice(2) + '</span>';
    ftk.innerHTML = th;
    var paintFin = function(){
      var lo=Math.min(+fmn.value,+fmx.value), hi=Math.max(+fmn.value,+fmx.value);
      _finStart=lo; _finEnd=hi;
      var pa=(lo-FY0)/(FY1-FY0)*100, pb=(hi-FY0)/(FY1-FY0)*100;
      ffill.style.left=pa+'%'; ffill.style.width=(pb-pa)+'%';
      fval.textContent = lo + ' – ' + hi;
    };
    fmn.oninput = function(){ paintFin(); renderFin(); };
    fmx.oninput = function(){ paintFin(); renderFin(); };
    paintFin();
  }

  // Modal (shared; hoisted to #co-detailview so Deep Dive triggers reach it)
  root.querySelectorAll(':scope > .ov-modal-back').forEach(function(m){ if(m.id!=='ovModalBack') m.remove(); });
  var back = root.querySelector('#ovModalBack'), mT = root.querySelector('#ovModalT'), mB = root.querySelector('#ovModalB');
  if(back && back.parentNode!==root) root.appendChild(back);
  function openModal(title, bodyHtml){ mT.innerHTML=title; mB.innerHTML=bodyHtml; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeModal(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  function onEsc(e){ if (e.key==='Escape') closeModal(); }
  if(back){ root.querySelector('#ovModalX').onclick = closeModal; back.onclick = function(e){ if (e.target===back) closeModal(); }; }
  function resolve(key){
    var parts=key.split(':'), kind=parts[0], id=parts.slice(1).join(':');
    if (kind==='cp'){ return CP_POP[id]||null; }
    if (kind==='seg'){ var s=SEGMENTS[parseInt(id,10)]; return s && { t:esc(s[0]), h:'<div style="font-size:12.5px;line-height:1.65;color:var(--navy)">'+esc(s[1])+'</div>' }; }
    if (kind==='sup'){ var su=SPLC_SUPPLIERS[parseInt(id,10)]; if(!su) return null; return { t:esc(su.n)+' <span class="ov-modal-sub">'+esc(su.tk)+' · '+esc(su.dom)+'</span>', h:'<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px"><span class="mgt-chip"><b>'+esc(su.mc)+'</b> mkt cap</span><span class="mgt-chip"><b>'+esc(su.grade)+'</b> risk grade</span><span class="mgt-chip"><b>'+esc(su.risk)+'</b> default risk</span><span class="mgt-chip"><b>'+esc(su.chg)+'</b> 3M price</span></div><div style="font-size:12.5px;line-height:1.65;color:var(--navy)">'+su.detail+'</div>' }; }
    if (kind==='drv'){ var d=DRIVERS[parseInt(id,10)]; return d && { t:esc(d[0]), h:'<div style="font-size:12.5px;line-height:1.65;color:var(--navy)">'+esc(d[1])+'</div>' }; }
    if (kind==='rtr'){ var tp=RELY_TRACK.filter(function(x){return x.id===id;})[0]; if(!tp) return null; var trt=RELY_TRACK_RATE[tp.rate];
      var tbody='<div style="display:inline-block;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+trt.c+';border:1px solid '+trt.c+';border-radius:9px;padding:2px 8px;margin-bottom:10px">'+trt.l+'</div>'+
        '<div style="font-size:12.5px;color:var(--navy);line-height:1.5;margin-bottom:12px">'+tp.one+'</div>'+
        '<div style="font-size:11px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px">At Remitly</div>'+bullets(tp.co)+
        '<div style="font-size:11px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.4px;margin:12px 0 5px">Before / outside</div>'+bullets(tp.ext)+
        '<div class="ov-callout" style="margin-top:12px"><b>The read:</b> '+tp.note+'</div>';
      return { t:esc(tp.n)+' <span class="ov-modal-sub">'+esc(tp.r)+'</span>', h:tbody }; }
    if (kind==='hist'){ var t=TIMELINE[parseInt(id,10)]; return t && t.d ? { t:esc(t.y), h:t.d } : null; }
    if (kind==='mna'){ var m=MNA.filter(function(x){return x.name===id;})[0]; if(!m) return null;
      var body='<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px"><span class="ov-tag">'+esc(m.date)+'</span><span class="ov-tag">'+esc(m.value)+'</span><span class="ov-tag">'+esc(m.status)+'</span></div>'+
        '<div style="margin:0 0 10px"><div style="font-size:11px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">What it did</div><div class="famd">'+esc(m.did)+'</div></div>'+
        '<div style="margin:0 0 10px"><div style="font-size:11px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Where</div><div class="famd">'+esc(m.geo)+'</div></div>'+
        '<div style="margin:0 0 10px"><div style="font-size:11px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">Product</div><div class="famd">'+esc(m.product)+'</div></div>'+
        '<div class="ov-callout"><b>Adds to Remitly:</b> '+esc(m.adds)+'</div>';
      return { t:esc(m.name), h:body }; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){
    el.style.cursor='pointer';
    el.addEventListener('click', function(){ var d=resolve(el.getAttribute('data-detail')); if (d) openModal(d.t, d.h); });
  });
}

// Deep Dive charts build lazily: init() already wired the tabs (root spans both panes),
// so here we only paint the active dd-pane's charts now that the Deep Dive tab is visible.
function deepDiveInit(c){
  var root = document.getElementById('co-detailview'); if(!root) return;
  var d=activeDD(root); requestAnimationFrame(function(){ buildDD(root, d); });
}

export var remitlyOverview = { html: html, init: init, absorbsPillars:true, deepDive:{ html:deepDiveHtml, init:deepDiveInit } };
