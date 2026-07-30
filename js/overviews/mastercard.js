// overviews/mastercard.js — Mastercard Inc. (NYSE: MA), NEW FORMAT.
// Two SIBLING profile tabs (OVERVIEW_CONVENTIONS §1): a standardized Overview (the 7-block
// hook) + a Deep Dive (the uber/lyft/cart 5-tab spine). Golden Rule #1: the entire prior
// bespoke Overview was NOT deleted — every piece was MOVED into the most relevant Deep Dive
// pane (four-party model → Bottom Line ▸ Suppliers; fee lines/rebates → Bottom Line ▸ Unit
// Economics; VAS + M&A → Top Line/Evolution; litigation/tailwinds → Valuation; financials →
// Valuation ▸ Balance Sheet). Convention: esc() leaves & LITERAL (never HTML-encode & in source).
//
// Live data (companies.js fills these; MA is a Fiscal.ai-covered ticker):
//   · Market cap / peer bubbles → api.liveQuote (Massive) overrides dated seeds, per ticker.
//   · Analyst Ratings → #dd-val-slot ; Ownership & insiders → #dd-mgmt-slot.
// Financials seeded from the Summit DCF (snapshot 2026-06-25); forward years labeled estimate.

import { makeManagement } from './management.js';

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Chart palette / formatters ──────────────────────────────────────────────
var C_AXIS='#8A93A0', C_GRID='#EEF2F7';
var MA_RED='#CF0A2C', MA_ORANGE='#FF9F00', MA_STEEL='#7A8699', MA_GREEN='#16A34A';
var fT  = function(v){ return '$'+(Math.round(v*100)/100)+'T'; };
var fBn = function(v){ return (Math.round(v*10)/10)+'B'; };
function _hexRgba(hex, a){ var h=hex.replace('#',''); return 'rgba('+parseInt(h.substr(0,2),16)+','+parseInt(h.substr(2,2),16)+','+parseInt(h.substr(4,2),16)+','+a+')'; }

// ─── Render helpers (shared across Overview + Deep Dive) ─────────────────────
function sec(title, inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}
function mbars(arr){ return '<div class="ov-mbars">'+arr.map(function(r){
  return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
    '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+r[3]+';">'+esc(r[2])+'</div></div>'+
    '<div class="ov-mbar-v">'+r[1]+'%</div></div>';
}).join('')+'</div>'; }

// ═══════════════════════════════════════════════════════════════════════════
//  STANDARDIZED OVERVIEW DATA (the 7 blocks — OVERVIEW_CONVENTIONS §4)
// ═══════════════════════════════════════════════════════════════════════════

// ── Block 1 — Key Facts (exactly 10, 5×2). Market cap cell is live (#maMc). ──
var MA_FACTS=[
  ['Listing','NYSE: MA'],
  ['HQ','Purchase, NY, USA'],
  ['Incorporation','Delaware'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','1966 — Interbank'],
  ['IPO','May 2006 · $39.00'],
  ['CEO','Michael Miebach · since Jan 2021'],
  ['Employees','~35,000 · 2025'],
  ['Dividend','Payer (+ buybacks)'],
  ['Market cap','~$470B · est'],
];
function stdKeyFacts(){
  return '<div class="stdkf">'+MA_FACTS.slice(0,10).map(function(p){
    var v=p[0]==='Market cap' ? '<span id="maMc">'+esc(p[1])+'</span>' : esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}

// ── Block 2 — Description (high-level only; NON-redundant with the blocks below). ──
var MA_LEDE="Mastercard is a global payments-technology company. It operates one of the world's two large open-loop card networks — the rails that authorize, clear and settle electronic payments between banks across 210+ countries — and, layered on top, a fast-growing set of value-added services (security, identity, data, consulting, open banking and real-time payments). It does not issue cards, lend, or set interchange, and takes no credit risk; it earns a thin fee on the volume and transactions that flow over its network, plus the services sold alongside.";

// ── Block 3 — the 4-quadrant (each cell ≤ ~30 words). ──
var MA_BIZ=[
  ['What it sells','Access to a global card-payment network (authorization, clearing, settlement) plus value-added services — fraud/security, identity, data & analytics, consulting, open banking and real-time-payment infrastructure.'],
  ['Who buys it','~14,000 financial-institution customers (issuing & acquiring banks), plus merchants, fintechs, governments and processors that connect to the rails and buy the services.'],
  ['How it earns','A thin fee on network volume & transactions (net of incentives) + services fees. FY2025 net revenue $32.8B — ~58% Payment Network, ~42% Value-Added Services.'],
  ['The edge','A global two-sided network with deep acceptance and scale economics, a services layer that is often network-agnostic, and a business that carries no credit risk.'],
];
function stdFourQuad(){
  return '<div class="q2">'+MA_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}

// ── Block 4 — How it makes money. Segments (2 reporting pillars) ⇄ Geography (US vs
// International) — both are the SAME FY2025 net revenue seen two ways (revenue cross-check). ──
var MA_REV_SEG=[['Payment Network',58,'$19.0B',MA_STEEL],['Value-Added Services & Solutions',42,'$13.8B',MA_ORANGE]];
// Geography: Mastercard reports US vs the rest of the world; ~2/3 of net revenue is international.
var MA_REV_GEO=[['International (ex-US)',67,'~$22.0B',MA_RED],['United States',33,'~$10.8B',MA_STEEL]];
var MA_MM_STATS=[['Net revenue','$32,791M'],['Gross Dollar Volume','~$10.6T'],['Switched txns','~175.5B/yr'],['Credentials','~3.5B'],['VAS % of net rev','~42%'],['Cross-border','high-yield']];
var MA_SEG_DEF=[
  { seg:'Payment Network',
    desc:'The core switching business — the rails that authorize, clear and settle a card payment between the issuing bank and the acquiring bank. It earns three ways: domestic assessments (a few basis points of domestic purchase volume), cross-border fees (where the card country differs from the merchant country — the highest-yield line), and transaction processing (a near-fixed fee per switched transaction). Rebates & incentives paid to customers net against these.',
    econ:[['Net revenue','~$19.0B (~58% of total)'],['GDV','~$10.6T'],['Cross-border growth','+13% lc (Q1 2026)'],['Switched-txn growth','~+9% (Q1 2026)']] },
  { seg:'Value-Added Services & Solutions',
    desc:'Everything sold on top of the rails: fraud & cyber security, digital identity, data & analytics, consulting, loyalty/personalization, open banking and real-time / account-to-account payment infrastructure. Much of it is network-agnostic — it earns on non-Mastercard volume too — and it is more recurring and higher-margin than network fees, which is why it is the main growth driver.',
    econ:[['Net revenue','~$13.8B (~42% of total)'],['Growth','+22% YoY (Q1 2026)'],['Mix','vs ~27% services at the larger peer'],['Character','recurring, network-agnostic']] },
];
var MA_GEO_DEF=[
  { seg:'International (ex-US)',
    desc:'Volume and services on credentials issued outside the United States — the larger share of net revenue and the structurally faster-growing side, because cash is still a big share of spend in many markets (a long cash-to-digital runway) and because cross-border travel and e-commerce concentrate here.',
    econ:[['Net revenue','~$22.0B (~2/3 of total)'],['Driver','cash-to-digital + cross-border'],['Note','"International" = issuance geography, distinct from cross-border']] },
  { seg:'United States',
    desc:'Volume and services on US-issued credentials — a more mature, more debit-heavy market than the international book. Still large and growing, but with a shorter cash-conversion runway than the international side.',
    econ:[['Net revenue','~$10.8B (~1/3 of total)'],['Character','mature, more debit-weighted']] },
];
function stdMoneyMap(){
  var seg=mbars(MA_REV_SEG);
  var geo=mbars(MA_REV_GEO);
  var defBlock=function(defs, econLabel){ return '<div class="mm-defs acc-list" style="margin-top:12px">'+defs.map(function(s){
    var econ='<div class="acc" style="margin-top:8px"><button type="button" class="acc-h">'+esc(econLabel)+' <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">What is "'+esc(s.seg)+'"?<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+esc(s.desc)+'</div>'+econ+'</div></div>';
  }).join('')+'</div>'; };
  var h='<div class="mm-tog"><button type="button" class="mm-pill active" data-mm="seg">Segments</button><button type="button" class="mm-pill" data-mm="geo">Geography</button></div>';
  h+='<div class="mm-view" data-mm="seg">'+seg+defBlock(MA_SEG_DEF,'Segment economics (as-of Q1 2026 / FY2025)')+'</div>';
  h+='<div class="mm-view" data-mm="geo" hidden>'+geo+defBlock(MA_GEO_DEF,'Detail')+'</div>';
  h+='<div class="mm-stats">'+MA_MM_STATS.map(function(s){ return '<div class="mm-stat"><div class="mm-stat-v">'+esc(s[1])+'</div><div class="mm-stat-l">'+esc(s[0])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:10px">Cross-check: Payment Network ~$19.0B + Value-Added Services ~$13.8B = <b>~$32.8B</b> net revenue ✓ (ties to FY2025 reported); the Geography view (International ~$22.0B + US ~$10.8B) is the <b>same total seen two ways</b>. <span class="ave-subh-note">Net revenue = gross revenue minus rebates & incentives paid to customers. Segment/geography splits from Mastercard filings; "lc" = local-currency. Source: Mastercard FY2025 10-K & Q1 2026 results.</span></div>';
  return h;
}

// ── Block 5 — Products (two-tier): family card → pop-up → specific items. ──
var MA_PROD_GROUPS=[
  { seg:'Payment Network', families:[
    { ic:'💳', fam:'Consumer credit & debit', d:'The core branded card products.', items:[
      ['Standard / World / World Elite','A premium ladder of consumer credit products; higher tiers skew to affluent, higher-spend and cross-border cardholders.'],
      ['World Legend','The ultra-high-net-worth top of the ladder.'],
      ['Debit & Maestro','Debit and the international Maestro brand — the everyday, volume-heavy rails.'],
    ]},
    { ic:'🌐', fam:'Cross-border & processing', d:'The highest-yield and per-transaction rails.', items:[
      ['Cross-border','Fees where card country ≠ merchant country (travel + cross-border e-commerce) — a premium rate plus FX, the highest-yield line.'],
      ['Transaction switching','Authorize / clear / settle — a near-fixed fee per switched transaction, resilient to ticket size.'],
    ]},
    { ic:'🏢', fam:'Commercial & new flows', d:'Beyond consumer cards.', items:[
      ['Commercial / B2B','Corporate cards, virtual cards and B2B payment flows.'],
      ['Disbursements & remittances','Mastercard Send and push-payment rails for payouts and person-to-person transfers.'],
    ]},
  ]},
  { seg:'Value-Added Services & Solutions', families:[
    { ic:'🛡️', fam:'Security & identity', d:'Fraud, cyber and identity — the largest VAS family.', items:[
      ['Decision Intelligence','Real-time AI fraud scoring on transactions.'],
      ['Ekata','Digital identity verification ($850M, 2021).'],
      ['RiskRecon','Third-party cyber-risk ratings (2020).'],
      ['Recorded Future','Threat intelligence — the largest deal ($2.65B, 2024); a step into enterprise cyber.'],
      ['Tokenization','Replaces card numbers with tokens; ~40% of transactions tokenized.'],
    ]},
    { ic:'📊', fam:'Data & Services / Consulting', d:'Analytics, advisory, loyalty.', items:[
      ['Mastercard Advisors','Consulting + analytics across the client base.'],
      ['Test & Learn (APT)','Business-experimentation analytics (~$600M, 2015).'],
      ['Dynamic Yield','AI personalization (from McDonald\'s, 2022).'],
      ['Loyalty & marketing','Rewards programs and campaign tools.'],
    ]},
    { ic:'🏦', fam:'Open banking & real-time', d:'Account data + non-card rails.', items:[
      ['Finicity','US open-banking / financial-data APIs ($825M, 2020).'],
      ['Aiia','European open-banking platform (2021).'],
      ['Vocalink','Runs the UK\'s Faster Payments & BACS (~£700M+, 2017).'],
      ['Nets A2A','European account-to-account / clearing assets (~€2.85B, 2021).'],
    ]},
    { ic:'📲', fam:'Digital enablement', d:'Tokens & smoother checkout.', items:[
      ['Mastercard Token Service','Network tokens for cards-on-file and wallets.'],
      ['Click to Pay','Streamlined, standardized online checkout.'],
    ]},
  ]},
];
function stdProducts(){
  return MA_PROD_GROUPS.map(function(g,gi){
    return '<div class="stdp-group"><div class="stdp-seg">'+esc(g.seg)+'</div><div class="stdp">'+
      g.families.map(function(f,fi){
        return '<div class="stdp-card ov-clickable" data-detail="fam:'+gi+'-'+fi+'"><div class="stdp-ic">'+f.ic+'</div>'+
          '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
      }).join('')+'</div></div>';
  }).join('');
}

// ── Block 6 — Competitor scatter (DYNAMIC). X = valuation multiple, Y = revenue growth,
// bubble = LIVE market cap (api.liveQuote). Multiple EV/EBITDA ⇄ P/E; basis Trailing ⇄
// Forward (default Forward). Peers add/removable by ticker; chip × deletes immediately.
// ⚠ Multiples & growth are web-sourced approximations (mid-2026); market caps are live. ──
var MA_PEERS=[
  { tk:'MA', n:'Mastercard', evT:33, evF:28, peT:38, peF:31, gt:14, gf:13, mc:470, hl:true, why:'The #2 global open-loop network — a premium multiple on a thin-fee, no-credit-risk model, a larger (~42%) value-added-services mix than Visa, and a more international / cross-border tilt. Bears interchange litigation directly (no escrow shield).' },
  { tk:'V',  n:'Visa',      evT:28, evF:24, peT:33, peF:27, gt:11, gf:11, mc:640, why:'The larger open-loop network — bigger by volume and acceptance, slightly cheaper on multiples, a smaller services mix (~30%), and a Class-B litigation escrow shield Mastercard lacks.' },
  { tk:'AXP', n:'Amex',     evT:null, evF:null, peT:21, peF:18, gt:9, gf:9, mc:210, why:'Closed-loop — it issues and lends, so revenue includes net interest income and EV/EBITDA is not comparable (it carries credit risk). Shown on P/E only; a premium, affluent, spend-centric model that competes with Mastercard for high-end volume.' },
  { tk:'PYPL', n:'PayPal',  evT:12, evF:11, peT:16, peF:14, gt:8, gf:9, mc:75, why:'A digital-wallet / account-to-account player on a different rail that partly competes with cards — much cheaper on multiples, reflecting slower growth and a more contested moat. A frenemy: most of its funding and its debit cards still ride Mastercard/Visa.' },
  { tk:'FI', n:'Fiserv',    evT:15, evF:14, peT:16, peF:14, gt:8, gf:8, mc:90, why:'A payments & fintech processor (Clover, Carat) that connects merchants and issuers to the rails — a partner and customer of Mastercard, not a network. A mid-teens multiple, well below the networks.' },
  { tk:'FIS', n:'FIS',      evT:13, evF:12, peT:14, peF:12, gt:6, gf:7, mc:45, why:'Fidelity National Information Services — core-banking & issuer processing that rides the networks\' rails rather than competing with them. A cheaper, slower-growth processor multiple.' },
  { tk:'GPN', n:'Global Payments', evT:10, evF:9, peT:9, peF:8, gt:5, gf:6, mc:22, why:'A merchant acquirer / processor — the cheapest of the payments majors on a high-single-digit multiple, reflecting slow growth and integration overhang. Rides the rails, doesn\'t own them.' },
  { tk:'XYZ', n:'Block',    evT:13, evF:11, peT:16, peF:14, gt:10, gf:11, mc:48, why:'Square (acquiring) + Cash App (wallet / P2P) — partly competes for merchant and P2P flow, but its cards and funding still ride Mastercard/Visa. A cheaper, more contested fintech multiple.' },
  { tk:'ADYEN', n:'Adyen',  evT:32, evF:26, peT:38, peF:30, gt:22, gf:21, mc:55, logo:'img/logos/adyen.svg', why:'A single-platform global acquirer / PSP — the high-growth premium name in acceptance, compounding ~20%+ at a network-like multiple. A partner on acceptance, not a network.' },
  { tk:'FOUR', n:'Shift4',  evT:14, evF:12, peT:16, peF:13, gt:22, gf:20, mc:10, why:'A fast-growing US acquirer (hospitality, stadiums, crypto) — ~20% growth at a mid-teens multiple. Rides the rails on the acceptance side.' },
  { tk:'CPAY', n:'Corpay',  evT:13, evF:12, peT:14, peF:12, gt:9, gf:9, mc:24, logo:'img/logos/corpay.svg', why:'A commercial-payments & fleet-card specialist (ex-FLEETCOR) — competes in the B2B / new-flows space Mastercard is chasing, at a low-teens multiple.' },
];
var MA_SC={ type:'pe', basis:'f', peers:null };
function maScReset(){ MA_SC.peers=MA_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function maScMult(p){ if(MA_SC.type==='ev') return MA_SC.basis==='f'?p.evF:p.evT; return MA_SC.basis==='f'?p.peF:p.peT; }
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
    '.mg-node .mg-dot{transition:stroke-width .12s}.mg-node:hover .mg-dot{stroke-width:4.5}.mg-node:hover{filter:drop-shadow(0 3px 7px rgba(16,20,26,.25))}.mg-node text{pointer-events:none}'+
    '.mg-tip{position:fixed;z-index:60;width:262px;background:#fff;color:var(--navy);border-radius:12px;padding:0;overflow:hidden;box-shadow:0 12px 30px rgba(16,20,26,.28);pointer-events:none;border:1px solid var(--bdr)}'+
    '.mgt-hd{display:flex;align-items:center;gap:9px;padding:11px 13px 8px}'+
    '.mgt-logo{width:32px;height:32px;border-radius:50%;border:2px solid;background:#fff;overflow:hidden;flex:none;display:flex;align-items:center;justify-content:center}.mgt-logo img{width:100%;height:100%;object-fit:cover;border-radius:50%}'+
    '.mgt-n{font-weight:800;font-size:14px}'+
    '.mgt-chips{display:flex;flex-wrap:wrap;gap:5px;padding:0 13px 8px}'+
    '.mgt-chip{font-size:10px;color:var(--mu);background:var(--surface);border:1px solid var(--bdr);border-radius:7px;padding:2px 7px}.mgt-chip b{color:var(--navy);font-weight:800}'+
    '.mgt-why{font-size:11px;line-height:1.5;color:var(--navy);padding:8px 13px 12px;border-top:1px solid var(--bdr);background:#F8FAFC}</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Listed peers mapped by <b>valuation multiple</b> (x) and <b>revenue growth</b> (y) — each is its <b>company logo</b>, sized by <b>live market cap</b>. <span style="opacity:.75">Hover or tap a logo for the read.</span></div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill" data-mgtype="ev">EV/EBITDA</button><button type="button" class="mg-pill active" data-mgtype="pe">P/E</button></span></span>'+
     '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span></div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" id="maScSvg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" id="maScXlab">P/E · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<g id="maScNodes"></g>'+
  '</svg></div>';
  h+='<div class="masc-chips" id="maScChips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">The map spans the <b>listed payments ecosystem</b> — the two networks (<b>Mastercard, Visa</b>), the closed-loop lender (<b>Amex</b>), a wallet (<b>PayPal</b>), the big processors (<b>Fiserv, FIS, Global Payments</b>), acquirers / PSPs (<b>Adyen, Shift4</b>), fintech (<b>Block</b>) and commercial payments (<b>Corpay</b>). <b>P/E is the default so every name plots;</b> switch to <b>EV/EBITDA</b> and the lenders drop out (Amex carries credit risk, so EV/EBITDA isn\'t meaningful). Remove a peer with the <b>×</b> or add one by ticker. Private / government rails (UPI, Pix, FedNow) and unlisted processors have no market multiple and sit on the qualitative map in <b>Deep Dive ▸ Top Line ▸ Industry Analysis</b>. <span class="ave-subh-note">Multiples & growth are approximate, web-sourced (mid-2026); market caps are live. Directional, not exact.</span></div>';
  h+='<div id="maScTip" class="mg-tip" hidden></div>';
  return h;
}
function maScRender(root){
  var g=root.querySelector('#maScNodes'); if(!g||!MA_SC.peers) return;
  var mLo=MA_SC.type==='ev'?7:7, mHi=MA_SC.type==='ev'?34:40, gLo=4, gHi=24, X0=84, X1=610, Y0=250, Y1=46;
  var lab=root.querySelector('#maScXlab'); if(lab) lab.textContent=(MA_SC.type==='ev'?'EV/EBITDA':'P/E')+' · '+(MA_SC.basis==='f'?'forward':'trailing');
  var frag='';
  MA_SC.peers.forEach(function(p){
    if(!p.on) return; var m=maScMult(p); if(m==null||isNaN(m)) return;
    var growth=MA_SC.basis==='f'?p.gf:p.gt; if(growth==null) growth=p.gf!=null?p.gf:p.gt;
    var col=p.hl?MA_RED:'#7A8699';
    var x=X0+Math.max(0,Math.min(1,(m-mLo)/(mHi-mLo)))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,((growth||0)-gLo)/(gHi-gLo)))*(Y0-Y1);
    var r=Math.max(15,Math.min(25, 13+Math.sqrt(Math.max(1,p.mc))*0.30)); var ri=r-2.5;
    var mono=esc((p.tk||p.n).slice(0,4));
    frag+='<g class="mg-node" data-tk="'+esc(p.tk)+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')" style="cursor:pointer">'+
      '<clipPath id="maClip-'+esc(p.tk)+'"><circle r="'+ri.toFixed(1)+'"/></clipPath>'+
      '<circle class="mg-dot" r="'+r.toFixed(1)+'" fill="#fff" stroke="'+col+'" stroke-width="'+(p.hl?3.5:2)+'"></circle>'+
      '<text class="mg-mono" y="4" text-anchor="middle" font-family="Inter,sans-serif" font-size="'+(ri>18?12:10)+'" font-weight="800" fill="'+col+'">'+mono+'</text>'+
      '<image href="'+(p.logo?esc(p.logo):'https://assets.parqet.com/logos/symbol/'+esc(p.tk))+'" x="'+(-ri).toFixed(1)+'" y="'+(-ri).toFixed(1)+'" width="'+(2*ri).toFixed(1)+'" height="'+(2*ri).toFixed(1)+'" clip-path="url(#maClip-'+esc(p.tk)+')" preserveAspectRatio="xMidYMid slice" onerror="this.remove()"></image>'+
      (p.hl?'<circle r="'+(r+3).toFixed(1)+'" fill="none" stroke="'+col+'" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6"></circle>':'')+
      '</g>';
  });
  g.innerHTML=frag;
}
function maScChips(root){
  var box=root.querySelector('#maScChips'); if(!box||!MA_SC.peers) return;
  var h=MA_SC.peers.map(function(p,i){ return '<span class="masc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="masc-add"><input id="maScAddTk" placeholder="+ TICKER" maxlength="6"><button type="button" id="maScAddBtn">Add</button></span>';
  box.innerHTML=h;
}

// ═══════════════════════════════════════════════════════════════════════════
//  DEEP DIVE DATA (migrated from the old bespoke Overview — Golden Rule #1)
// ═══════════════════════════════════════════════════════════════════════════

// ── Four-party (open-loop) model → Bottom Line ▸ Suppliers ("who powers the rails"). ──
var FOURPARTY_SVG =
'<svg viewBox="0 0 680 360" role="img" aria-label="Mastercard four-party model — click a box for its role">' +
  '<defs><marker id="maar" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa3b2"/></marker></defs>' +
  '<line x1="200" y1="56" x2="470" y2="56" stroke="#c2c8d2" stroke-width="1.5" marker-end="url(#maar)"/>' +
  '<text x="335" y="44" text-anchor="middle" font-size="10" fill="#8A93A0">buys goods / services</text>' +
  '<line x1="115" y1="86" x2="115" y2="274" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="565" y1="86" x2="565" y2="274" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="196" y1="280" x2="262" y2="206" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="484" y1="280" x2="418" y2="206" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<g class="ov-fpm-node ov-clickable" data-detail="role:cardholder"><rect x="30" y="28" width="170" height="56" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="115" y="54" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Cardholder</text><text x="115" y="71" text-anchor="middle" font-size="9.5" fill="#8A93A0">tap to read role ›</text></g>' +
  '<g class="ov-fpm-node ov-clickable" data-detail="role:merchant"><rect x="480" y="28" width="170" height="56" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="565" y="54" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Merchant</text><text x="565" y="71" text-anchor="middle" font-size="9.5" fill="#8A93A0">tap to read role ›</text></g>' +
  '<g class="ov-fpm-node ov-clickable" data-detail="role:issuer"><rect x="30" y="276" width="170" height="62" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="115" y="302" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Issuer</text><text x="115" y="320" text-anchor="middle" font-size="9.5" fill="#8A93A0">cardholder’s bank ›</text></g>' +
  '<g class="ov-fpm-node ov-clickable" data-detail="role:acquirer"><rect x="480" y="276" width="170" height="62" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="565" y="302" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Acquirer</text><text x="565" y="320" text-anchor="middle" font-size="9.5" fill="#8A93A0">merchant’s bank ›</text></g>' +
  '<g class="ov-fpm-node ov-clickable" data-detail="role:network"><rect x="250" y="150" width="180" height="64" rx="11" fill="'+MA_RED+'" stroke="#9a0020" stroke-width="2.5"/><text x="340" y="180" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">MASTERCARD</text><text x="340" y="198" text-anchor="middle" font-size="9.5" fill="#ffe1e1">network · clearing & settlement ›</text></g>' +
'</svg>';
var ROLE_DETAIL = {
  cardholder: { t:'Cardholder', h:'The consumer who pays with a Mastercard credential. They are the <b>issuer\'s</b> customer — Mastercard has no direct relationship with them and charges them nothing; the merchant pays.' },
  issuer:     { t:'Issuer — the cardholder\'s bank', h:'Issues the card, extends the credit, <b>sets and earns the interchange</b>, takes the credit & fraud risk, and bills the cardholder. A Mastercard <b>customer</b> that pays network fees — and the party Mastercard pays <b>incentives</b> to, to keep its volume.' },
  merchant:   { t:'Merchant', h:'The business accepting the card — the <b>acquirer\'s</b> customer. Pays a merchant discount = <b>interchange</b> (to the issuer) + <b>network fees</b> (to Mastercard) + <b>acquirer markup</b>.' },
  acquirer:   { t:'Acquirer — the merchant\'s bank/processor', h:'Onboards merchants, routes their transactions into the network, and settles funds to them. A Mastercard <b>customer</b> that pays network fees.' },
  network:    { t:'Mastercard — the network', h:'<b>Authorizes, clears and settles</b> between issuer and acquirer. Earns <b>domestic assessments</b> (on volume), <b>transaction-processing</b> fees (per transaction) and <b>cross-border</b> fees — net of incentives — plus value-added services. <b>Does not</b> issue, lend, or earn interchange, and takes no credit risk.' },
};
var FLOW_NODES = [
  { k:'card', ic:'💳', l:'Cardholder' }, { k:'merch', ic:'🏪', l:'Merchant' }, { k:'acq', ic:'🏛️', l:'Acquirer' }, { k:'net', ic:'🔴', l:'Mastercard' }, { k:'iss', ic:'🏦', l:'Issuer' },
];
var FLOW_STEPS = [
  { t:'Setup', on:[], cap:'A $100 purchase on a Mastercard card. Press <b>Play</b> to follow the money — and see where each party earns (or doesn\'t).', earn:'', earnType:'none' },
  { t:'1 · Authorization', on:['card','merch','acq','net','iss'], cap:'Tap. The request hops <b>merchant → acquirer → Mastercard → issuer</b>, which checks the balance and runs fraud in ~1–2 seconds, then approves.', earn:'No fee booked yet — authorization is part of the service, not a charge.', earnType:'none' },
  { t:'2 · Approval returns', on:['iss','net','acq','merch','card'], cap:'The "approved" travels back the same path. The cardholder walks out with the goods — but <b>no real money has moved</b>, only a promise to pay.', earn:'Still nothing settled; a stolen-card loss would land on the issuer, not Mastercard.', earnType:'none' },
  { t:'3 · Clearing', on:['acq','net','iss'], cap:'Later, in a batch, the acquirer submits the transaction. <b>Mastercard</b> computes the amounts and the interchange owed.', earn:'Mastercard books its <b>transaction-processing fee</b> — a near-fixed fee for switching this transaction.', earnType:'net' },
  { t:'4 · Settlement', on:['iss','net','acq','merch'], cap:'The issuer pays <b>$100 minus interchange</b>; Mastercard moves funds to the acquirer, which pays the merchant the net.', earn:'Fees split: <b>~$1.50–2.50 interchange → ISSUER</b> · <b>Mastercard assessment + processing fees (a few ¢) → MASTERCARD</b> · acquirer markup → ACQUIRER.', earnType:'split' },
  { t:'5 · Who got what', on:['card','merch','acq','net','iss'], cap:'The merchant nets ~<b>$97.50</b>. Mastercard never touched the $100 and never lent it.', earn:'<b>Interchange — the biggest slice — went to the ISSUER, not Mastercard.</b> Mastercard earned a few cents (processing) + a few basis points of the $100 (assessment). That thinness × billions of transactions = the model.', earnType:'split' },
];
var FLOW_NOTE = 'Mastercard earns on a transaction <b>only when it runs over a Mastercard rail</b> (or when a Mastercard value-added service is attached). A Visa- or Amex-branded swipe runs over <b>their</b> network — Mastercard earns nothing on it. That is exactly why its value-added services are deliberately <b>network-agnostic</b>, so they earn on volume regardless of the card brand.';
var HOW_MONEY = [
  '<b>Not a bank:</b> Mastercard does not issue cards, lend, or earn interchange — those belong to the issuing banks. It never touches the purchase amount and takes <b>no credit risk</b>.',
  '<b>Network fees (the core):</b> <b>domestic assessments</b> (a few basis points of domestic purchase volume), <b>cross-border volume fees</b> (the highest-yield line, where card country ≠ merchant country), and <b>transaction processing/switching</b> (a fee per transaction). <b>Rebates & incentives</b> net against these to reach net revenue.',
  '<b>Value-added services (the differentiator & growth engine):</b> security, identity, data & analytics, consulting, loyalty, open banking and real-time-payment infrastructure — sold on top of the rails, often <b>network-agnostic</b> (earning on non-Mastercard volume too).',
];

// ── Fee lines + Rebates → Bottom Line ▸ Unit Economics. ──
var PN_INTRO = 'The payment network is the core switching business — ~58% of net revenue. It earns on the dollar <b>volume</b> and the <b>number of transactions</b> that flow over Mastercard rails: <b>domestic assessments</b> (basis points of volume), <b>cross-border</b> fees (the highest-yield line) and <b>transaction processing</b> (per transaction).';
var XBORDER_NOTE = '<b>Cross-border is a different cut from geography.</b> "International" net revenue means volume on cards <i>issued outside the U.S.</i>; <b>cross-border</b> means the <i>card country ≠ merchant country</i> (travel + cross-border e-commerce). Cross-border earns a premium rate + FX — the <b>highest-yield</b> line and a key growth driver (+13% lc in Q1 2026) — and is tracked separately from the issuance-geography split.';
var FEE_LINES = [
  { k:'domestic', n:'Domestic assessments', rev:'on domestic GDV',
    what:'A fee charged to customers as a few <b>basis points of the domestic purchase volume</b> on Mastercard credentials.',
    monetizes:'Scales with domestic Gross Dollar Volume; the steadiest, most volume-linked line.',
    products:[{n:'What drives it', d:'Cards in force × spend per card × the assessment rate; benefits from cash-to-digital conversion.'},{n:'Where it\'s strongest', d:'Growing digital-payment markets, especially internationally.'}],
    competition:'Visa (the larger network), domestic card schemes, account-to-account rails.' },
  { k:'crossborder', n:'Cross-border volume fees', rev:'highest yield',
    what:'Fees where the <b>card country differs from the merchant country</b> — travel and cross-border e-commerce.',
    monetizes:'A premium rate plus FX; a single overseas transaction can earn multiples of a domestic one. The <b>highest-yield</b> line and a key growth driver (+13% lc in Q1 2026).',
    products:[{n:'Travel', d:'Tourism & business travel; recovers/grows with global mobility — and softens first in a downturn.'},{n:'Cross-border e-commerce', d:'Buying from foreign merchants online; structurally growing.'}],
    competition:'Visa; money-movement specialists (Wise, etc.) on certain flows.' },
  { k:'processing', n:'Transaction processing', rev:'per transaction',
    what:'A near-fixed fee for each transaction Mastercard <b>switches</b> (authorize / clear / settle).',
    monetizes:'Grows with the <i>count</i> of switched transactions (~+9% in Q1 2026), not ticket size — resilient even in a downturn.',
    products:[{n:'Switching', d:'Routing the transaction message between issuer and acquirer.'},{n:'Connectivity / other', d:'Network access, licensing and related fees.'}],
    competition:'Visa; domestic switches; U.S. debit-routing networks.' },
];
var REBATES_INTRO = 'Mastercard reports <b>net revenue</b> — gross revenue minus the rebates & incentives it pays customers. That contra-revenue is large (well over a third of gross) and rising, so the gross-to-net bridge is one of the most important things to model. The same concept exists at the other big network.';
var REBATES_BRIDGE = [
  { v:'Gross revenue', l:'all network + services fees' },
  { v:'(−) Rebates & incentives', l:'paid to issuers, acquirers & merchants' },
  { v:'= Net revenue', l:'$32.8B · FY2025' },
];
var REBATES = [
  '<b>What they are:</b> payments and incentives to <b>issuers, acquirers and merchants</b> to grow and retain volume and to win new portfolios. Because they are consideration paid to customers, they are booked as a <b>reduction of gross revenue (contra-revenue)</b>, not an operating expense.',
  '<b>Two flavors:</b> <b>volume / performance-based</b> incentives (accrued as the customer delivers volume) and <b>upfront / fixed</b> deal payments (capitalized and amortized over the contract life). So a big signing depresses net revenue for years, smoothing the hit.',
  '<b>Why they exist:</b> issuers can route to <b>either</b> network, so incentives are how Mastercard wins and keeps issuer and co-brand deals. As the #2 network this is the core competitive battleground — the same dollars Visa is also spending for the same portfolios.',
  '<b>Why it matters for the model:</b> the <b>rebate ratio (rebates & incentives ÷ gross revenue)</b> is a key swing factor. A rising ratio can signal intensifying competition; a heavy <b>renewal year</b> steps it up and can optically slow net-revenue growth even when gross volume is perfectly healthy. Watch the ratio, not just net revenue.',
];

// ── VAS depth. The full rich text is preserved verbatim in `full`; the surface shows a
//    compact tappable card (icon + lead) and the wall opens in a pop-up (vasPopTiles →
//    resolve 'vasm'/'vase'). Nothing removed, just hidden until asked for. ──
var VAS_MOAT=[  // Overview ▸ "Why it defends the moat"
  {k:'agnostic',ic:'🌐',c:MA_RED,t:'Network-agnostic → earns off-Mastercard volume',full:'<b>Network-agnostic → earns off-Mastercard volume.</b> Security, identity, insights and open banking are sold even where a rival wins the card — partly <b>decoupling growth from card-share battles</b>.'},
  {k:'recurring',ic:'🔁',c:'#7A5AF8',t:'Recurring & higher-quality',full:'<b>Recurring & higher-quality.</b> Subscriptions and per-transaction scoring are stickier and less tied to the consumer-spend cycle than swipe fees — a diversifier against macro / travel softness.'},
  {k:'switching',ic:'🔒',c:'#0F9D58',t:'Raises switching costs → a stickier network',full:'<b>Raises switching costs → a stickier network.</b> Selling security, data, engagement and open banking into the same banks and merchants makes them harder to leave <i>and</i> pulls through more network volume. Services and the network reinforce each other.'},
  {k:'regulated',ic:'⚖️',c:'#B7791F',t:'Less regulated',full:'<b>Less regulated.</b> VAS sits outside the interchange / routing crossfire — a structurally safer growth pool as regulation pressures the core swipe fee. ~<b>60%</b> of it is "network-linked," so it also scales with transactions.'},
];
var VAS_ENGINE=[  // Deep Dive ▸ Top Line ▸ Segments ("the growth engine, up close")
  {k:'scale',ic:'📈',c:MA_ORANGE,t:'Scale & growth',full:'<b>Scale & growth:</b> VAS net revenue was <b>$3.5B in Q1 2026 (+22% YoY)</b>, ~<b>42% of net revenue</b> — growing well faster than the payment network and increasingly the swing factor in the whole company\'s growth rate.'},
  {k:'agnostic',ic:'🌐',c:MA_RED,t:'Network-agnostic',full:'<b>Network-agnostic:</b> much of it is sold on <b>non-Mastercard</b> volume too (fraud scoring, identity, cyber, open banking). That partially <b>decouples growth from card-share battles</b> — Mastercard can earn even where it doesn\'t win the rail.'},
  {k:'quality',ic:'🔁',c:'#7A5AF8',t:'Higher-quality revenue',full:'<b>Higher-quality revenue:</b> subscriptions, per-transaction scoring and managed services are more <b>recurring</b> and less tied to the consumer-spend cycle than network fees — a diversifier against macro/travel softness.'},
  {k:'moat',ic:'🔒',c:'#0F9D58',t:'Deepens the moat',full:'<b>Deepens the moat:</b> selling security, data and consulting into the same issuers and merchants raises switching costs <i>and</i> pulls through more network volume — services and the network reinforce each other.'},
  {k:'ambition',ic:'🚀',c:'#B7791F',t:'A widening ambition',full:'<b>A widening ambition:</b> the strategy has moved from payment fraud toward <b>enterprise cybersecurity</b> (the $2.65B Recorded Future deal), identity, open banking and real-time payments — extending the addressable market well beyond card swipes.'},
];
function vasPopTiles(list, prefix){
  return '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(232px,1fr));gap:9px">'+list.map(function(x){
    return '<div class="ov-clickable" data-detail="'+prefix+':'+x.k+'" style="display:flex;align-items:center;gap:10px;border:1px solid var(--bdr);border-left:3px solid '+x.c+';border-radius:11px;padding:11px 13px;background:var(--w)">'+
      '<span style="font-size:17px;flex:none">'+x.ic+'</span>'+
      '<span style="flex:1;font-size:12px;font-weight:800;color:var(--navy);line-height:1.3">'+x.t+'</span>'+
      '<span style="flex:none;font-size:10px;font-weight:700;color:var(--mu)">Tap ›</span>'+
    '</div>';
  }).join('')+'</div>';
}
var USERMIX_INTRO = 'All the global networks serve broad consumer bases, but the <i>mix</i> tilts differently — and the tilt matters for yield and cyclicality. Mastercard\'s relative leanings (these are tilts at the margin, not absolutes):';

// ── Timeline (corporate lineage) → Evolution ▸ Timeline. ──
var TIMELINE = [
  { y:'1966', t:'<b>Born as a bank alliance to challenge BankAmericard</b> — the Interbank Card Association (ICA).', d:'A group of U.S. banks forms the <b>Interbank Card Association (ICA)</b> to compete with Bank of America\'s BankAmericard (the future Visa). From the start Mastercard is the <b>#2 challenger</b> in an industry the incumbent defined — a position that shapes a more aggressive, partnership-driven culture.' },
  { y:'1968–69', t:'<b>"Master Charge" + the Eurocard alliance</b> — international early.', d:'The network is branded <b>"Master Charge: The Interbank Card" (1969)</b>, and a 1968 alliance with Europe\'s <b>Eurocard</b> gives it early international reach — a lasting structural advantage over a more U.S.-centric rival.' },
  { y:'1979', t:'<b>Renamed Mastercard.</b>', d:'"Master Charge" becomes <b>MasterCard</b>, with the interlocking-circles mark. Through the 1980s–90s it operates as a bank-owned association, building global acceptance and the Maestro debit brand.' },
  { y:'2002', t:'<b>Merges with Europay International</b> — one global franchise ahead of the IPO.', d:'MasterCard International merges with <b>Europay International</b> (which included Eurocard) to form <b>MasterCard Incorporated</b>, consolidating the franchise globally.' },
  { y:'May 2006', t:'<b>IPO at $39.00</b> — two years before Visa, and a cleaner (single-class) structure.', d:'<b>Genesis of the public company.</b> Mastercard IPO\'d on May 25, 2006 (95.5M shares at $39 — the largest U.S. IPO since 2004), <b>two years before Visa</b>. It went public via a conventional IPO (not a spin-off/SPAC). The IPO reduced the member banks\' control (an independent board) — partly to address antitrust exposure — and created the independent <b>Mastercard Foundation</b>, endowed with ~10% of the company. Unlike Visa\'s later IPO, there is <b>no multi-class / litigation-escrow share structure</b> — a fact that matters for how it bears litigation.' },
  { y:'2010–20', t:'<b>The Ajay Banga decade</b> — the business-model pivot to services.', d:'<b>A model inflection, not just growth.</b> Under CEO <b>Ajay Banga</b>, revenue roughly <b>triples</b> and market value rises ~10×. The defining choice: build a large <b>value-added services</b> business (cybersecurity, identity, data & analytics) on top of the rails — changing what Mastercard earns on, not just how much. This services tilt, plus a strong international and cross-border mix, is the main reason a structural #2 kept gaining share and economics.' },
  { y:'2017–24', t:'<b>A services-and-rails buying spree</b> (see M&A).', d:'Mastercard acquires real-time-payment and open-banking infrastructure (<b>Vocalink, Nets A2A, Finicity, Aiia</b>) and a deep security/identity/cyber stack (<b>RiskRecon, Ekata, CipherTrace, Recorded Future</b>) — building optionality beyond card swipes into account-to-account, identity and enterprise cyber.' },
  { y:'Jan 2021', t:'<b>Michael Miebach becomes CEO</b> (current CEO).', d:'Miebach (previously Chief Product Officer) takes over as Banga moves on (later to lead the World Bank). The strategy continues: grow the network, scale services, and extend into new flows (B2B, disbursements, real-time).' },
  { y:'2024', t:'<b>Recorded Future ($2.65B) — largest acquisition to date</b>, a step into enterprise cyber.', d:'The threat-intelligence deal is Mastercard\'s biggest ever and marks the services ambition widening from payment fraud into <b>enterprise cybersecurity</b> — extending the addressable market well beyond card swipes.' },
];
var TL_NOTE = 'Corporate lineage per Mastercard filings, IR and company history; the 2006 IPO and Mastercard Foundation per the prospectus and press. Genesis: a conventional IPO of a bank-association-turned-independent company (not a spin-off/SPAC).';

// ── M&A → Evolution ▸ Timeline (M&A block). ──
var MNA = [
  { n:'Europay International', y:'2002', deal:'merger', terms:'association merger', own:'Member co-op', cat:'Franchise',
    detail:'<b>Terms:</b> an association merger that formed MasterCard Incorporated.<br><br><b>What it added:</b> Europe\'s Eurocard/Europay franchise — consolidating Mastercard into a single global company ahead of the 2006 IPO.' },
  { n:'Applied Predictive Technologies (Test & Learn)', y:'2015', deal:'~$600M', terms:'all cash', own:'Private', cat:'Data & analytics',
    detail:'<b>Terms:</b> ~$600M, all cash.<br><br><b>What it added:</b> the <b>Test & Learn</b> business-experimentation analytics platform.<br><br><b>How it shows up today:</b> a flagship of the <b>Data & Services</b> consulting business.' },
  { n:'VocaLink', y:'2017', deal:'~£700M + £169M earn-out', terms:'all cash', own:'Bank-owned', cat:'Real-time payments',
    detail:'<b>Terms:</b> ~£700M + up to £169M earn-out, all cash (UK bank-owned RTP operator).<br><br><b>What it added:</b> <b>real-time payments & ACH infrastructure</b> — it runs the UK\'s Faster Payments and BACS.<br><br><b>How it shows up today:</b> the backbone of Mastercard\'s account-to-account / RTP push — a hedge against card rails.' },
  { n:'RiskRecon', y:'2020', deal:'undisclosed', terms:'all cash', own:'Private', cat:'Cyber security',
    detail:'<b>Terms:</b> undisclosed, all cash.<br><br><b>What it added:</b> third-party <b>cyber-risk ratings</b>.<br><br><b>How it shows up today:</b> part of the Security Solutions stack.' },
  { n:'Finicity', y:'2020', deal:'$825M + earn-out', terms:'all cash', own:'Private', cat:'Open banking',
    detail:'<b>Terms:</b> $825M + up to $160M earn-out, all cash.<br><br><b>What it added:</b> U.S. <b>open-banking</b> / financial-data APIs (account data, pay-by-bank).<br><br><b>How it shows up today:</b> Mastercard\'s open-banking business in North America.' },
  { n:'Nets (A2A / clearing assets)', y:'2021', deal:'~€2.85B', terms:'cash', own:'Private (PE-owned)', cat:'Real-time payments', big:true,
    detail:'<b>Terms:</b> ~€2.85B (~$3.2B).<br><br><b>What it added:</b> the European <b>account-to-account</b> and clearing technology of Nets.<br><br><b>How it shows up today:</b> scales the real-time / A2A capability across Europe — its second big bet (with Vocalink) beyond cards.' },
  { n:'Ekata', y:'2021', deal:'$850M', terms:'all cash', own:'Private', cat:'Identity',
    detail:'<b>Terms:</b> $850M, all cash.<br><br><b>What it added:</b> global <b>digital identity verification</b> for onboarding and fraud prevention.<br><br><b>How it shows up today:</b> a core part of Security Solutions / identity.' },
  { n:'CipherTrace', y:'2021', deal:'~$250M (est.)', terms:'cash', own:'Private', cat:'Crypto / blockchain',
    detail:'<b>Terms:</b> undisclosed (estimated ~$250M).<br><br><b>What it added:</b> <b>blockchain / crypto-transaction analytics</b> and compliance.<br><br><b>How it shows up today:</b> crypto-risk tooling within the security business.' },
  { n:'Dynamic Yield', y:'2022', deal:'~$325M (est.)', terms:'cash', own:'Corporate (McDonald\'s)', cat:'Personalization',
    detail:'<b>Terms:</b> acquired from McDonald\'s (reported ~$325M).<br><br><b>What it added:</b> AI-driven <b>personalization</b> and recommendation technology.<br><br><b>How it shows up today:</b> loyalty/marketing personalization inside Data & Services.' },
  { n:'Recorded Future', y:'2024', deal:'$2.65B', terms:'all cash', own:'Private (PE-owned)', cat:'Threat intelligence', big:true,
    detail:'<b>Terms:</b> $2.65B, all cash — <b>Mastercard\'s largest acquisition to date</b>.<br><br><b>What it added:</b> a leading <b>threat-intelligence</b> platform — a major step up in cybersecurity.<br><br><b>How it shows up today:</b> anchors a broader security ambition extending beyond payment fraud into enterprise cyber.' },
];

// ── Litigation → Valuation ▸ Risk & Litigation. Structured by jurisdiction (flag cards)
// + a MA-vs-Visa "who absorbs the hit" flow visual (replaces the old bullet boxes). ──
var LIT_INTRO = 'Like the other card networks, Mastercard set default interchange as a bank association, which has drawn decades of antitrust litigation. The point worth understanding for Mastercard specifically is <b>how it bears that risk</b> — and why it lands differently than at Visa.';
var LIT_LEVEL={ high:{c:'#C0392B',l:'Live · material'}, resolved:{c:MA_GREEN,l:'Settled'}, structural:{c:'#B7791F',l:'Structural'}, low:{c:MA_STEEL,l:'Low · watch'} };
var LIT_CASES=[
  { code:'us', juris:'United States', tag:'MDL 1720', level:'high',
    headline:'Merchant interchange antitrust — Mastercard is a <b>co-defendant with Visa</b>.',
    status:'The <b>damages</b> class settled (multi-billion, shared with Visa; approved 2019, upheld 2023). The <b>rules / injunctive</b> class is still live — a 2024 proposed settlement was <b>rejected by the court</b>, and large merchants keep opting out to sue separately.',
    exp:'Shared multi-billion settlement with Visa; open tail from merchant opt-outs.' },
  { code:'gb', juris:'United Kingdom', tag:'Merricks', level:'resolved',
    headline:'Landmark <b>opt-out consumer class action</b> over EEA cross-border interchange (filed 2016).',
    status:'Originally valued at ~<b>£14B</b>; <b>settled for £200M</b> (Dec 2024, approved by the Competition Appeal Tribunal Feb 2025).',
    exp:'£200M — a small fraction of the headline; a template for how these mega-claims resolve.' },
  { code:'eu', juris:'European Union', tag:'Interchange caps', level:'structural',
    headline:'Interchange <b>caps</b> plus ongoing cases and behavioral commitments across member states.',
    status:'EU caps are in force (<b>0.2% debit / 0.3% credit</b>) under the Interchange Fee Regulation; assorted national cases and undertakings continue.',
    exp:'Structural — the caps permanently lower yields more than any single case does.' },
  { code:'dev', juris:'Other developed markets', tag:'Regulated · quiet', level:'low',
    headline:'Australia, Canada, Japan and peers <b>regulate interchange but litigate it far less</b>.',
    status:'Australia (RBA) pioneered interchange caps in 2003; Canada runs negotiated fee undertakings; others review periodically — but the class-action machinery is a US / UK / EU story.',
    exp:'Yield pressure from caps, minimal active litigation — the least pressing bucket today.' },
];

// ── Peers → Top Line ▸ Industry Analysis (qualitative; consistent with the scatter). ──
var PEER_COLS = ['Mastercard', 'Visa', 'Amex', 'Discover', 'UnionPay'];
var PEER_ROWS = [
  ['Model', 'Open-loop four-party', 'Open-loop four-party', '<b>Closed-loop</b> (lends)', 'Closed-loop* (lends)', 'Domestic near-monopoly'],
  ['FY net revenue', '$32.8B', '$40.0B', '~$72B† (incl. lending)', '~$16B† (incl. lending)', '~$2–3B fees‡ (est.)'],
  ['Payments volume', '~$10.6T GDV', '~$14T', '~$1.7T', '~$0.5T', '~$25T+ (mostly China)'],
  ['Credentials', '~3.5B', '~4.9B', '~145M (affluent)', '~70M', '~9B+ (most in world)'],
  ['Services mix', '<b>~42% of revenue</b>', '~27% of revenue', 'no standalone VAS', 'limited', 'limited'],
  ['Litigation shield', 'None (direct to P&L)', 'Class B escrow', 'n/a (closed-loop)', 'n/a', 'state-linked'],
  ['Credit risk', 'None', 'None', '<b>Yes</b> — owns loan book', '<b>Yes</b>', 'Borne by member banks'],
];
var PEER_NOTE = 'Mastercard and Visa are the two global open-loop "toll roads" — a thin fee per transaction, no credit risk. Mastercard is the <b>smaller of the two by volume</b> but is <b>more international</b>, carries a <b>larger value-added-services mix</b> (~42% vs ~27%), and — unlike Visa — bears interchange litigation <b>directly</b> (no escrow shield). <b>Amex & Discover</b> are closed-loop (they issue and lend, so revenue includes net interest income and isn\'t comparable line-for-line; Discover is being acquired by Capital One). <b>UnionPay</b> is the largest network by cards (China; state-linked) but overwhelmingly domestic. Not shown: digital/A2A players (PayPal) and government real-time rails (UPI, Pix, FedNow). † incl. lending; ‡ limited disclosure / estimate; figures approximate, FY ends differ.';

// (Tailwinds / Headwinds retired — the bull/bear now lives, evidence-framed, in
//  Top Line ▸ Industry Analysis, same convention as UBER.)

// ── Financials → Valuation ▸ Balance Sheet. Summit DCF (snapshot 2026-06-25); 2021–2025
// actuals, 2026–2029 = model projection. FCF 2025 = 15,121 (model) — corrected from an
// older seed. REV/OP_INCOME/EBITDA verified against the model. ──
var FIN_YEARS = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029];
var FIN_EST   = [false, false, false, false, false, true, true, true, true];
var FIN_FMT   = function(v){ return v==null ? '—' : '$'+(v/1000).toFixed(1)+'B'; };
var FIN_SERIES = {
  finRev:    { label:'Revenue',          type:'bar',  color:MA_RED,   data:[18884, 22237, 25098, 28167, 32791, 38162, 41902, 46640, 52166] },
  finOpInc:  { label:'Operating Income', type:'bar',  color:MA_STEEL, data:[10079, 12127, 13824, 15278, 18554, 22085, 23928, 26614, 29859] },
  finEbitda: { label:'EBITDA',           type:'bar',  color:MA_ORANGE,data:[11461, 12816, 14829, 16493, 20100, 23505, 26302, 29249, 32770] },
  finFcf:    { label:'Free Cash Flow',   type:'line', color:MA_GREEN, data:[9056, 10753, 11705, 14306, 15121, 18024, 19455, 21654, 24318] },
};
var FIN_INTRO = 'Mastercard\'s financials, pulled from the <b>Summit DCF model</b> — <b>actuals through FY2025</b> and the model\'s <b>projection to FY2029</b> (faded / dashed). Drag the timeline handles to mold the window; each chart\'s CAGR updates to your selection.';
var FIN_NOTE  = 'Annual, USD billions. <b>2021–2025 actuals · 2026–2029 = DCF projection</b> (faded/dashed). Source: Summit DCF model for Mastercard (snapshot 2026-06-25). FCF FY2025 = $15.1B per the model (a prior seed of $17.2B was corrected). Forward figures are model estimates, not company guidance.';
var _finStart=2021, _finEnd=2029, _finCharts={};

// ── Management (Executives & Board) → Management tab. Full Management-Committee core +
// the complete 11-member board, from the investor.mastercard.com Management Committee page
// and the 2026 DEF 14A. NOTE the June 2, 2026 C-suite reshuffle (effective Aug 3, 2026) is
// flagged inline; titles below are the operative mid-2026 (pre-Aug-3) roster. ──
var MA_RESHUFFLE = 'On <b>June 2, 2026</b> Mastercard announced a C-suite reshuffle effective <b>Aug 3, 2026</b>: CFO <b>Sachin Mehra → Chief Business Officer</b>; <b>Ling Hai → CFO</b>; <b>Linda Kirkpatrick → Chief Services Officer</b> (Vosburg → Vice Chair); <b>Dimitrios Dosis → Chief Commercial Payments Officer</b> (Seshadri → Senior Advisor). Vice Chair <b>Tim Murphy</b> retires Oct 2026. Titles shown are the operative mid-2026 roster.';
var MA_MGMT = makeManagement({
  brand:MA_RED,
  lede:"Mastercard runs a deep, unusually long-tenured bench under CEO <b>Michael Miebach</b> (CEO since Jan 2021), continuing the network-plus-services pivot begun under Ajay Banga. The Management Committee spans ~40 people; the core executive officers, the regional presidents and the functional chiefs are below. Two reads stand out: <b>most of the top team are 15–25-year Mastercard lifers</b> (Kirkpatrick joined as an intern in 1997), and the company just refreshed several functional chiefs from the outside (marketing, people, cyber). A major <b>C-suite reshuffle was announced June 2026</b> (see the note). Live ownership & insider activity populate the Ownership subtab (Fiscal.ai).",
  execs:[
    { id:'miebach', lead:true, name:'Michael Miebach', title:'Chief Executive Officer & President', since:'CEO since Jan 2021 · at MA since 2010', img:'img/leadership/ma-miebach.jpg',
      line:'German national; ran MEA before rising to President then CEO.',
      bio:'CEO and director since January 2021 (President since March 2020); joined Mastercard in 2010 to run the Middle East & Africa region. Drove the pivot toward a services-and-technology platform beyond card rails. Earlier: Managing Director at Barclays and General Manager at Citi. University of Passau MBA.' },
    { id:'mehra', name:'Sachin Mehra', title:'Chief Financial Officer', since:'CFO since 2019 · at MA since 2010', img:'img/leadership/ma-mehra.jpg',
      line:'Long-tenured, disciplined CFO → becomes Chief Business Officer Aug 2026.',
      bio:'CFO since April 2019; joined in 2010 as Group Executive & Treasurer. Owns all corporate finance, IR, strategy, M&A, treasury and risk. Becomes Chief Business Officer (global country ops, partnerships, digital commercialization) on Aug 3, 2026. Prior: treasury/finance at Hess, GM and GMAC. Darden MBA; on the Salesforce board.' },
    { id:'linghai', name:'Ling Hai', title:'President, APEMEA', since:'at MA since 2010', img:'img/leadership/ma-linghai.jpg',
      line:'Runs the combined international region → becomes CFO Aug 2026.',
      bio:'President, Asia Pacific, Europe, Middle East & Africa (the combined international region). Becomes CFO succeeding Mehra on Aug 3, 2026. Joined in 2010 as Division President, Greater China. Prior: Booz Allen and A.T. Kearney consulting; executive roles at Bank of America and HSBC.' },
    { id:'kirkpatrick', name:'Linda Kirkpatrick', title:'President, Americas', since:'at MA since 1997', img:'img/leadership/ma-kirkpatrick.jpg',
      line:'25-year lifer (started as an intern) → becomes Chief Services Officer Aug 2026.',
      bio:'President, Americas (US, Canada, Latin America). Becomes Chief Services Officer (the growth engine) on Aug 3, 2026. A 25+ year Mastercard lifer who started as an intern in 1997 and worked on the 2002 Europay merger and 2006 IPO; former President, U.S. Financial Institutions.' },
    { id:'vosburg', name:'Craig Vosburg', title:'Chief Services Officer', since:'at MA since 2006', img:'img/leadership/ma-vosburg.jpg',
      line:'Built the Services engine; former CPO → moves to Vice Chair Aug 2026.',
      bio:'Chief Services Officer — the value-added-services growth engine (fraud, cyber, consulting, analytics, loyalty). Former Chief Product Officer. Becomes Vice Chair & Global Ambassador on Aug 3, 2026. Prior: Bain & Company and A.T. Kearney financial-services practices. Wharton MBA.' },
    { id:'seshadri', name:'Raj Seshadri', title:'Chief Commercial Payments Officer', since:'at MA since 2016', img:'img/leadership/ma-seshadri.jpg',
      line:'Built Data & Services / New Flows → moves to Senior Advisor Aug 2026.',
      bio:'Chief Commercial Payments Officer (Commercial & New Payment Flows — B2B, disbursements). Former President of global Data & Services. Becomes Senior Strategic Advisor to the CEO on Aug 3, 2026. Prior: ran BlackRock’s US iShares business; roles at Citi, McKinsey, Bell Labs. Stanford MBA, Harvard physics PhD.' },
    { id:'dosis', name:'Dimitrios Dosis', title:'President, EEMEA', since:'at MA since 2005', img:'img/leadership/ma-dosis.jpg',
      line:'Runs 80+ EEMEA markets → becomes Chief Commercial Payments Officer Aug 2026.',
      bio:'President, Eastern Europe, Middle East & Africa (80+ markets); former President of Mastercard Advisors. Succeeds Seshadri as Chief Commercial Payments Officer on Aug 3, 2026. Prior: Roland Berger and A.T. Kearney. PhD, European Business School.' },
    { id:'lambert', name:'Jorn Lambert', title:'Chief Product Officer', since:'long-tenured', img:'img/leadership/ma-lambert.jpg',
      line:'Owns the global product org — tokenization, wallets, stablecoin & agentic.',
      bio:'Chief Product Officer (since 2024; former Chief Digital Officer). Runs the global product organization — digital platforms, wallets, tokenization, and the emerging stablecoin/agentic-commerce products. INSEAD executive education.' },
    { id:'mclaughlin', name:'Ed McLaughlin', title:'President & CTO, Technology', since:'at MA since 2005 · CTO since 2016', img:'img/leadership/ma-mclaughlin.jpg',
      line:'Architect of the network’s technology backbone and resilience.',
      bio:'President & Chief Technology Officer — the payments network, enterprise platforms, infrastructure and information security. Prior: Group VP at Metavante; co-founder & CEO of Paytrust; EVP at LogicWorks. Wharton.' },
    { id:'ulrich', name:'Greg Ulrich', title:'Chief AI & Data Officer', since:'at MA since 2015', img:'img/leadership/ma-ulrich.jpg',
      line:'Runs AI/data across the business; ex-Corporate Strategy & M&A.',
      bio:'Chief AI and Data Officer (since 2024); joined in 2015 via the Applied Predictive Technologies (Test & Learn) acquisition and formerly led Corporate Strategy & M&A. Wharton MBA.' },
    { id:'huntsman', name:'Jon M. Huntsman, Jr.', title:'Vice Chairman & President, Strategic Growth', since:'at MA since 2024', img:'img/leadership/ma-huntsman.jpg',
      line:'Ex-Governor of Utah; US Ambassador to China, Russia & Singapore.',
      bio:'Vice Chairman & President, Strategic Growth — government/public-sector partnerships, inclusive growth and sustainability. Former Governor of Utah and US Ambassador to Singapore, China and Russia (the only American to be chief of mission in both China and Russia).' },
    { id:'kramer', name:'Jill Kramer', title:'Chief Marketing & Communications Officer', since:'at MA since Dec 2025', img:'img/leadership/ma-kramer.jpg',
      line:'Ex-Accenture CMO (nearly doubled its brand value); new in seat.',
      bio:'Chief Marketing & Communications Officer since December 2025, succeeding long-time CMO Raja Rajamannar. Prior: CMO of Accenture (2021–25), where brand value rose ~$12B→$20.9B; earlier BBDO and DDB.' },
    { id:'muigai', name:'Susan Muigai', title:'Chief People Officer', since:'at MA since Apr 2025', img:'img/leadership/ma-muigai.jpg',
      line:'Ex-TransUnion CHRO; 16 years at Walmart. New to Mastercard.',
      bio:'Chief People Officer since April 2025. Prior: EVP/CHRO at TransUnion; 16 years at Walmart including SVP People, Walmart International.' },
    { id:'griffin', name:'Karen Griffin', title:'Chief Risk Officer', since:'at MA since 2014', img:'img/leadership/ma-griffin.jpg',
      line:'First-ever CRO; ex-Chief Compliance Officer; came from Visa.',
      bio:'Chief Risk Officer — the first person to hold the role; previously Chief Compliance Officer. Prior: SVP & Chief Compliance Officer at Visa.' },
    { id:'johnson', name:'Ann Johnson', title:'EVP, Security Solutions', since:'at MA since May 2026', img:'img/leadership/ma-johnson.jpg',
      line:'Heavyweight cyber hire from Microsoft (Deputy CISO); brand-new.',
      bio:'EVP, Security Solutions (customer-facing cyber/fraud/identity products) since May 2026. Prior: Corporate VP & Deputy CISO at Microsoft; senior roles at Qualys and RSA Security. Distinct from the internal Chief Security Officer.' },
    { id:'verma', name:'Rich Verma', title:'Chief Administrative Officer', since:'rejoined Feb 2025', img:'img/leadership/ma-verma.jpg',
      line:'Ex-US Ambassador to India & Deputy Secretary of State; former MA CLO.',
      bio:'Chief Administrative Officer; rejoined Mastercard in February 2025. Previously Mastercard’s Chief Legal Officer & head of global public policy. Between: US Ambassador to India and Deputy Secretary of State for Management & Resources.' },
    { id:'devine', name:'Kelly Devine', title:'President, Europe', since:'rejoined Sept 2025', img:'img/leadership/ma-devine.jpg',
      line:'Boomeranged back to run Europe’s 53 markets; ex-Amex.',
      bio:'President, Europe (53 countries); rejoined in September 2025 after a year as Chief Customer Officer at Dunelm; earlier 5 years as Mastercard Divisional President, UK & Ireland, and a decade at American Express.' },
    { id:'hall', name:'Tiffany Hall', title:'General Counsel', since:'recent', img:'img/leadership/ma-hall.jpg',
      line:'Newest of four legal chiefs since 2021 — an unusually churned seat.',
      bio:'General Counsel — global law department. Note: Mastercard has churned through legal chiefs (the fourth new head since 2021), so this seat is relatively unproven. Prior: acting head of marketing & legal counsel at Pernod Ricard USA; earlier Sotheby’s, Atlantic Records and Ogilvy.' },
  ],
  board:[
    { name:'Merit E. Janow', chair:true, independent:true, role:'Independent Board Chair (since 2022) · chairs Nominating & Corporate Governance · Audit · Risk. Dean Emerita, Columbia SIPA.' },
    { name:'Michael Miebach', dual:true, independent:false, role:'President & CEO of Mastercard (the only non-independent director).' },
    { name:'Candido Bracher', independent:true, role:'Audit · Risk. Former CEO, Itaú Unibanco (Latin America’s largest bank).' },
    { name:'Richard K. Davis', independent:true, role:'Chairs HR & Compensation · Nom & Gov. Former Executive Chairman & CEO, U.S. Bancorp.' },
    { name:'Julius Genachowski', independent:true, role:'Chairs Audit · Nom & Gov · Risk. Former Chairman, U.S. FCC; Managing Director, The Carlyle Group.' },
    { name:'Choon Phong Goh', independent:true, role:'Nom & Gov · Risk. CEO, Singapore Airlines.' },
    { name:'Oki Matsumoto', independent:true, role:'HR & Compensation. Founder & Chairman, Monex Group (Japan).' },
    { name:'Youngme Moon', independent:true, role:'Chairs Risk · HR & Compensation. Professor, Harvard Business School.' },
    { name:'Gabrielle Sulzberger', independent:true, role:'Audit · Nom & Gov. Senior Managing Director, Centerbridge Partners; Senior Advisor, Teneo.' },
    { name:'Harit Talwar', independent:true, role:'Audit · HR & Compensation. Former Global Head of Consumer Business (Marcus), Goldman Sachs.' },
    { name:'Lance Uggla', independent:true, role:'HR & Compensation · Nom & Gov. Vice Chair, General Atlantic; founder/former CEO of IHS Markit.' },
  ],
  boardNote:'11 directors, <b>10 of 11 independent</b>; independent Chair (Merit Janow) separate from the CEO, so there is no separate lead independent director. Unusually operator-heavy in banking/payments experience.',
  gov:[
    { k:'Share & voting', v:'Single class · 1 vote/share', d:'No dual-class and — unlike Visa — no litigation-escrow shield.' },
    { k:'Board', v:'10 of 11 independent', d:'Independent Chair; CEO is not chairman.' },
    { k:'Foundation', v:'Mastercard Foundation', d:'Independent; a large long-term holder since the 2006 IPO.' },
  ],
  foot:'Executives & headshots per the investor.mastercard.com Management Committee page; board & committees per the 2026 DEF 14A. The June 2, 2026 reshuffle (effective Aug 3, 2026) is flagged inline. Ownership & insider trades are live in the Ownership subtab.',
});

// ── Track Record — rate management (and the board) on value creation, green/amber/red,
// each with a Mastercard record and a prior/external one. Reads are editorial (from tenure +
// what they built), not a Mastercard statement. Sourced from the Management Committee page,
// 2026 proxy and press. "Read more" opens the full read. ──
var MA_TRACK_RATE={ green:{c:'#0F9D58',bg:'rgba(15,157,88,0.07)',l:'Value creator'}, amber:{c:'#E8A00C',bg:'rgba(232,160,12,0.08)',l:'Mixed / unproven'}, red:{c:'#C0392B',bg:'rgba(192,57,43,0.07)',l:'Value destroyer'} };
var MA_TRACK=[
  {id:'miebach', n:'Michael Miebach', r:'Chief Executive Officer', t:'CEO since 2021 · at MA since 2010', rate:'green',
    one:'~6-year CEO of double-digit growth and a successful pivot into Services & New Flows.',
    co:['Led the pivot to a <b>services-and-technology platform</b> beyond card rails','Net revenue compounded double-digits; VAS to ~40% of revenue','Rose from President MEA → President → CEO'],
    ext:['Managing Director at <b>Barclays</b>; General Manager at <b>Citi</b> across MEA','University of Passau MBA'],
    note:'Proven operator — the diversification thesis is his. High confidence.'},
  {id:'mehra', n:'Sachin Mehra', r:'CFO (→ Chief Business Officer Aug 2026)', t:'CFO since 2019 · at MA since 2010', rate:'green',
    one:'Long-tenured, disciplined CFO through the whole services build; steps up to run the business.',
    co:['Ran finance, IR, strategy, M&A, treasury & risk through the growth decade','Architect of the ~$14.5B/yr buyback + growing-dividend capital return','Elevated to <b>Chief Business Officer</b> (country ops, partnerships) Aug 2026'],
    ext:['Treasury/finance at <b>Hess</b>, <b>GM</b> and <b>GMAC</b>','Darden MBA; sits on the <b>Salesforce</b> board'],
    note:'Operational discipline + financial rigor; a promotion, not an exit. High confidence.'},
  {id:'kirkpatrick', n:'Linda Kirkpatrick', r:'President Americas (→ Chief Services Officer Aug 2026)', t:'at MA since 1997', rate:'green',
    one:'25-year lifer who started as an intern — now handed the Services growth engine.',
    co:['Ran US, Canada & Latin America','Worked on the <b>2002 Europay merger</b> and the <b>2006 IPO</b>','Elevation to CSO signals the board’s confidence'],
    ext:['A pure Mastercard career — deep franchise knowledge'],
    note:'Proven operator; the CSO hand-off is a vote of confidence. High confidence.'},
  {id:'vosburg', n:'Craig Vosburg', r:'Chief Services Officer (→ Vice Chair Aug 2026)', t:'at MA since 2006', rate:'green',
    one:'Built the Services engine — the fastest-growing, highest-margin revenue leg — then steps back.',
    co:['Scaled value-added services (fraud, cyber, consulting, data, loyalty)','Former Chief Product Officer','Moving to <b>Vice Chair & Global Ambassador</b> — a step back from ops'],
    ext:['<b>Bain & Company</b> and <b>A.T. Kearney</b> financial-services practices','Wharton MBA'],
    note:'Green as a builder of Services; the Vice-Chair move is a wind-down. High confidence.'},
  {id:'seshadri', n:'Raj Seshadri', r:'Chief Commercial Payments Officer (→ Senior Advisor Aug 2026)', t:'at MA since 2016', rate:'green',
    one:'Built Data & Services and then New Flows; now moves to an advisory role.',
    co:['Led global <b>Data & Services</b>, then <b>Commercial & New Payment Flows</b> (B2B, disbursements)','Started as President, US Issuers'],
    ext:['Ran <b>BlackRock’s US iShares</b> business; roles at Citi, McKinsey, Bell Labs','Stanford MBA, Harvard physics PhD'],
    note:'A builder of two growth legs; stepping to advisor. High confidence.'},
  {id:'mclaughlin', n:'Ed McLaughlin', r:'President & CTO', t:'at MA since 2005 · CTO since 2016', rate:'green',
    one:'Architect of the network’s technology backbone and its resilience.',
    co:['Owns the payments network, platforms, infrastructure and information security','A decade as CTO through the digital/token build-out'],
    ext:['Group VP at <b>Metavante</b>; co-founder & CEO of <b>Paytrust</b>; EVP at LogicWorks','Wharton'],
    note:'Proven; the technology moat runs through him. High confidence.'},
  {id:'ulrich', n:'Greg Ulrich', r:'Chief AI & Data Officer', t:'at MA since 2015', rate:'green',
    one:'Runs a strategically central mandate — AI and data across the whole business.',
    co:['Leads AI/data strategy; earlier ran Corporate Strategy & M&A','Joined via the <b>Test & Learn (APT)</b> acquisition'],
    ext:['Wharton MBA'],
    note:'Proven, on the most strategically central emerging mandate. High confidence.'},
  {id:'griffin', n:'Karen Griffin', r:'Chief Risk Officer', t:'at MA since 2014', rate:'green',
    one:'First-ever CRO; a credible control-function operator poached from the rival.',
    co:['Built the CRO function; previously Chief Compliance Officer'],
    ext:['SVP & <b>Chief Compliance Officer at Visa</b>'],
    note:'Green in a control function — exactly the pedigree the seat needs. High confidence.'},
  {id:'lambert', n:'Jorn Lambert', r:'Chief Product Officer', t:'long-tenured', rate:'green',
    one:'Owns the product org driving tokenization, wallets, stablecoin and agentic commerce.',
    co:['Global product organization; former Chief Digital Officer','Leads the tokenization-to-2030, Agent Pay and stablecoin roadmap'],
    ext:['INSEAD executive education'],
    note:'Proven digital/product builder; owns the forward bets. Medium-high confidence.'},
  {id:'linghai', n:'Ling Hai', r:'President APEMEA (→ CFO Aug 2026)', t:'at MA since 2010', rate:'amber',
    one:'Strong international operator — but the CFO seat is a brand-new functional test.',
    co:['Runs the combined APEMEA international region','Started as Division President, Greater China'],
    ext:['Consulting at <b>Booz Allen</b> and <b>A.T. Kearney</b>; roles at Bank of America and HSBC'],
    note:'Proven commercially; unproven as CFO — amber until he grows into finance. Medium confidence.'},
  {id:'dosis', n:'Dimitrios Dosis', r:'President EEMEA (→ Chief Commercial Payments Officer Aug 2026)', t:'at MA since 2005', rate:'amber',
    one:'Strong regional/advisory operator moving up to run the enterprise-wide New Flows bet.',
    co:['Runs 80+ EEMEA markets; former President of Mastercard Advisors'],
    ext:['<b>Roland Berger</b> and <b>A.T. Kearney</b>; PhD, European Business School'],
    note:'Green regionally; New Flows is a bigger test — amber leaning green. Medium confidence.'},
  {id:'kramer', n:'Jill Kramer', r:'Chief Marketing & Communications Officer', t:'at MA since Dec 2025', rate:'amber',
    one:'Proven CMO with a real brand-value record — but brand-new to Mastercard.',
    co:['Succeeds long-time CMO Raja Rajamannar'],
    ext:['CMO of <b>Accenture</b> (2021–25): brand value ~$12B → $20.9B','Earlier BBDO and DDB'],
    note:'Blue-chip CMO pedigree; unproven here yet. Medium confidence.'},
  {id:'muigai', n:'Susan Muigai', r:'Chief People Officer', t:'at MA since Apr 2025', rate:'amber',
    one:'Credible CHRO pedigree, new to the seat; limited value-creation signal.',
    co:['Leads the People function since April 2025'],
    ext:['CHRO at <b>TransUnion</b>; 16 years at <b>Walmart</b> (SVP People, Walmart International)'],
    note:'Solid pedigree, too new to grade — and a People seat carries limited value signal. Medium confidence.'},
  {id:'johnson', n:'Ann Johnson', r:'EVP, Security Solutions', t:'at MA since May 2026', rate:'amber',
    one:'Heavyweight cyber hire for the commercial security products — brand-new.',
    co:['Leads customer-facing cyber/fraud/identity products'],
    ext:['Corporate VP & <b>Deputy CISO at Microsoft</b>; senior roles at Qualys and RSA'],
    note:'Strong cyber pedigree feeding the Services thesis; unproven at MA. Medium confidence.'},
  {id:'devine', n:'Kelly Devine', r:'President, Europe', t:'rejoined Sept 2025', rate:'amber',
    one:'A returning, proven regional leader re-taking Europe’s 53 markets.',
    co:['Runs Europe; earlier 5 years as Divisional President, UK & Ireland'],
    ext:['A decade at <b>American Express</b>; LSE economics'],
    note:'Proven regionally; the boomerang is recent — amber leaning green. Medium confidence.'},
  {id:'huntsman', n:'Jon M. Huntsman, Jr.', r:'Vice Chairman & President, Strategic Growth', t:'at MA since 2024', rate:'amber',
    one:'A statecraft/relationships asset for public-sector flows — not a P&L value creator.',
    co:['Government/public-sector partnerships, inclusive growth, sustainability'],
    ext:['Governor of Utah; US Ambassador to <b>Singapore, China and Russia</b>'],
    note:'Real relationship value; not an operating P&L owner — amber by design. Medium confidence.'},
  {id:'verma', n:'Rich Verma', r:'Chief Administrative Officer', t:'rejoined Feb 2025', rate:'amber',
    one:'Statecraft + administration; a returning insider, not a growth owner.',
    co:['Runs administration; formerly MA Chief Legal Officer & head of global public policy'],
    ext:['US Ambassador to India; Deputy Secretary of State for Management & Resources'],
    note:'Administration/policy asset; not a growth P&L — amber. Medium confidence.'},
  {id:'hall', n:'Tiffany Hall', r:'General Counsel', t:'recent', rate:'amber',
    one:'Newest of four legal chiefs since 2021 — an unusually churned, unproven seat.',
    co:['Leads the global law department'],
    ext:['Acting head of marketing & legal counsel at <b>Pernod Ricard USA</b>; earlier Sotheby’s, Atlantic Records, Ogilvy'],
    note:'Solid but new; the churn in this seat is itself a small flag — amber. Medium confidence.'},
];
// Board value reads (separate block — governance quality is part of the story).
var MA_BOARD_TRACK=[
  {n:'Richard K. Davis', rate:'green', r:'Former CEO, U.S. Bancorp', note:'Built and ran U.S. Bancorp through the financial crisis — a top-tier bank operator. Chairs HR & Comp.'},
  {n:'Lance Uggla', rate:'green', r:'Founder, IHS Markit', note:'Founded Markit, IPO’d it, engineered the IHS Markit merger (later sold to S&P Global) — real value-creation pedigree.'},
  {n:'Harit Talwar', rate:'green', r:'Ex-Goldman (Marcus)', note:'Built Goldman’s Marcus consumer bank from scratch — directly relevant payments/consumer-credit operator.'},
  {n:'Candido Bracher', rate:'green', r:'Former CEO, Itaú Unibanco', note:'Ran Latin America’s largest bank — strong operator with emerging-market relevance.'},
  {n:'Oki Matsumoto', rate:'green', r:'Founder, Monex Group', note:'Founded and built Japan’s Monex online brokerage — an entrepreneurial value-creator.'},
  {n:'Choon Phong Goh', rate:'green', r:'CEO, Singapore Airlines', note:'A sitting large-enterprise CEO — proven operator, though outside payments.'},
  {n:'Merit E. Janow', rate:'amber', r:'Independent Chair · Columbia SIPA', note:'A governance/policy heavyweight and 2024 Director of the Year — a strong Chair, not an operator.'},
  {n:'Youngme Moon', rate:'amber', r:'Professor, Harvard Business School', note:'Strategy/brand academic — expertise-and-governance value, not operating.'},
  {n:'Julius Genachowski', rate:'amber', r:'Ex-FCC Chair · Carlyle', note:'Regulatory/policy + PE — strong on tech/telecom/cyber oversight; chairs Audit.'},
  {n:'Gabrielle Sulzberger', rate:'amber', r:'Centerbridge · Teneo', note:'Finance/PE and governance specialist.'},
];
function maTrackBody(c){
  var card=function(p){ var rt=MA_TRACK_RATE[p.rate];
    return '<div class="mtk-card ov-clickable" data-detail="matr:'+p.id+'" style="border-left:3px solid '+rt.c+';background:'+rt.bg+'">'+
      '<div class="mtk-top"><div><div class="mtk-n">'+esc(p.n)+'</div><div class="mtk-r">'+esc(p.r)+'</div></div><span class="mtk-badge" style="color:'+rt.c+';border-color:'+rt.c+'">'+rt.l+'</span></div>'+
      '<div class="mtk-t">'+esc(p.t)+'</div><div class="mtk-one">'+p.one+'</div>'+
      '<div class="mtk-more" style="color:'+rt.c+'">Read more ›</div></div>'; };
  var bcard=function(b){ var rt=MA_TRACK_RATE[b.rate];
    return '<div class="mtk-bcard" style="border-left:3px solid '+rt.c+'"><div class="mtk-btop"><span class="mtk-bn">'+esc(b.n)+'</span><span class="mtk-bdot" style="background:'+rt.c+'"></span></div><div class="mtk-br">'+esc(b.r)+'</div><div class="mtk-bnote">'+b.note+'</div></div>'; };
  var h='<style>.mtk-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:6px 0 4px}@media(max-width:720px){.mtk-grid{grid-template-columns:1fr}}'+
    '.mtk-card{border:1px solid var(--bdr);border-radius:11px;padding:12px 14px;cursor:pointer;transition:box-shadow .15s}.mtk-card:hover{box-shadow:0 3px 12px rgba(18,53,107,0.09)}'+
    '.mtk-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}'+
    '.mtk-n{font-size:14px;font-weight:800;color:var(--navy)}.mtk-r{font-size:11px;color:var(--mu);margin-top:1px}'+
    '.mtk-badge{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border:1px solid;border-radius:9px;padding:2px 7px;white-space:nowrap}'+
    '.mtk-t{font-size:10.5px;color:var(--mu);margin:7px 0 5px}.mtk-one{font-size:12px;color:var(--navy);line-height:1.5}.mtk-more{font-size:11px;font-weight:800;margin-top:8px}'+
    '.mtk-bgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}@media(max-width:720px){.mtk-bgrid{grid-template-columns:1fr}}'+
    '.mtk-bcard{border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;background:var(--w)}'+
    '.mtk-btop{display:flex;align-items:center;justify-content:space-between;gap:6px}.mtk-bn{font-size:12px;font-weight:800;color:var(--navy)}.mtk-bdot{width:9px;height:9px;border-radius:50%;flex:none}'+
    '.mtk-br{font-size:10.5px;color:var(--mu);margin:1px 0 4px}.mtk-bnote{font-size:11px;color:var(--navy);line-height:1.45}</style>';
  h+='<p class="ov-lede">The people running Mastercard, rated on <b>value creation</b> (a Mastercard record and a prior/external one) — the color is the net read. Two things stand out: the top team is an <b>unusually deep, long-tenured bench</b> of insiders, and the <b>June 2026 reshuffle</b> mostly promotes from within. <b>Tap any card</b> for the full read.</p>';
  h+='<div style="display:flex;gap:12px;flex-wrap:wrap;margin:0 0 10px;font-size:10.5px;color:var(--mu)">'+Object.keys(MA_TRACK_RATE).map(function(k){ var rt=MA_TRACK_RATE[k]; return '<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:'+rt.c+'"></span>'+rt.l+'</span>'; }).join('')+'</div>';
  h+='<div class="ov-callout" style="margin:0 0 12px">'+MA_RESHUFFLE+'</div>';
  h+='<div class="ov-sec-h ovt-store-h">Executive management</div><div class="mtk-grid">'+MA_TRACK.map(card).join('')+'</div>';
  h+='<div class="ov-sec-h ovt-store-h" style="margin-top:14px">The board — governance quality</div>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 8px">Unusually operator-heavy for a payments network: several directors are proven bank/enterprise builders, which is a positive governance signal. Independent Chair; CEO is not chairman.</div>';
  h+='<div class="mtk-bgrid">'+MA_BOARD_TRACK.map(bcard).join('')+'</div>';
  h+='<div class="ov-foot">Roster & titles: investor.mastercard.com Management Committee page; board per the 2026 DEF 14A. Ratings are an editorial read of tenure + what each person built, not a Mastercard output. The June 2026 reshuffle (effective Aug 2026) is reflected inline.</div>';
  return h;
}

var OV_SOURCES = 'Sources — Mastercard FY2025 10-K & Q1 2026 results/earnings release (Apr 30, 2026); Mastercard IR & investor materials; Summit DCF model (snapshot 2026-06-25) for the financial series; EDGAR for filer status. Market cap and peer bubbles are live via Massive; peer multiples & growth are web-sourced approximations (mid-2026), labeled directional. Forward figures are model estimates, not company guidance.';
var DD_SOURCES = 'Sources — Mastercard Q1 2026 results & earnings release (Apr 30, 2026), FY2025 10-K and prior filings; IR & company history; acquisition press releases & SEC filings for M&A terms; UK Competition Appeal Tribunal & reporting on the Merricks settlement; public reporting on MDL 1720 and the 2006 IPO / Mastercard Foundation. Some M&A values are estimates where terms were undisclosed; "lc"/"cn" = local-currency/currency-neutral.';

// ═══════════════════════════════════════════════════════════════════════════
//  STANDARDIZED OVERVIEW — the 7 blocks (hook always visible, rest collapsed)
// ═══════════════════════════════════════════════════════════════════════════
function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}
function stdOverviewBody(c){
  var h='<style>.stdkf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--bdr);border-top:3px solid var(--brand-2, var(--brand));border-radius:12px;overflow:hidden;background:var(--w);margin:2px 0}'+
    '.stdkf-cell{padding:11px 13px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.stdkf-cell:nth-child(5n){border-right:none}.stdkf-cell:nth-child(n+6){border-bottom:none}'+
    '.stdkf-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:3px}'+
    '.stdkf-v{font-size:12px;font-weight:700;color:var(--navy);line-height:1.3}'+
    '@media(max-width:720px){.stdkf{grid-template-columns:repeat(2,1fr)}.stdkf-cell{border-right:none}}'+
    '.ov-lede{margin:16px 0 6px;font-size:13px;line-height:1.6;color:var(--navy)}'+
    '.q2{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:var(--w);margin:4px 0}'+
    '.q2-cell{padding:13px 15px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.q2-cell:nth-child(2n){border-right:none}.q2-cell:nth-child(n+3){border-bottom:none}'+
    '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+MA_RED+';margin-bottom:5px}'+
    '.q2-v{font-size:12px;color:var(--navy);line-height:1.5}.q2-v b{font-weight:800}'+
    '@media(max-width:600px){.q2{grid-template-columns:1fr}.q2-cell{border-right:none}.q2-cell:nth-child(n+2){border-bottom:1px solid var(--bdr)}.q2-cell:last-child{border-bottom:none}}'+
    '.mm-tog{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px;margin:2px 0 4px}'+
    '.mm-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:4px 12px;border-radius:999px;cursor:pointer}.mm-pill.active{background:var(--navy);color:#fff}'+
    '.mm-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:14px 0 2px}@media(max-width:640px){.mm-stats{grid-template-columns:repeat(3,1fr)}}'+
    '.mm-stat{border:1px solid var(--bdr);border-radius:9px;padding:8px 10px;text-align:center;background:var(--w)}'+
    '.mm-stat-v{font-size:13px;font-weight:800;color:var(--navy)}.mm-stat-l{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);margin-top:2px}'+
    '.acc-list .acc{border:1px solid var(--bdr);border-radius:9px;margin-top:6px;overflow:hidden;background:var(--w)}'+
    '.acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12px;font-weight:700;color:var(--navy);padding:9px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}'+
    '.acc-h:hover{background:#EEF2F6}.acc-x{color:var(--mu);font-weight:800}.acc-b{padding:10px 12px}'+
    '.famd{font-size:12px;color:var(--navy);line-height:1.55}.famd b{font-weight:800}'+
    '.ov-row{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:11.5px}.ov-row:last-child{border-bottom:none}.ov-row-k{color:var(--mu);font-weight:600}.ov-row-v{color:var(--navy);font-weight:800}'+
    '.stdp-seg{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:12px 0 7px}.stdp-group:first-child .stdp-seg{margin-top:2px}'+
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:'+MA_RED+'}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:'+MA_RED+';margin-top:6px}'+
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}</style>';
  // ── Hook (always visible): Key Facts, Description, 2×2 quadrant ──
  h+=stdKeyFacts();
  h+='<p class="ov-lede">'+esc(MA_LEDE)+'</p>';
  h+=stdFourQuad();
  // ── Progressive disclosure: everything below defaults collapsed ──
  h+=collapsible('How it makes money', stdMoneyMap());
  h+=collapsible('What it makes — the products', stdProducts());
  h+=collapsible('Value-Added Services — the moat\'s growth engine', stdVasSpotlight());
  h+=collapsible('Competitors — valuation vs growth', stdPeerScatter());
  h+=collapsible('Timeline', stdTimeline());
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}
// ── VAS spotlight — the moat's growth engine. Punchy, high-visibility (open by default). ──
function stdVasSpotlight(){
  var fam=function(ic,t,d){ return '<div class="vas-fam"><div class="vas-fam-ic">'+ic+'</div><div><div class="vas-fam-t">'+esc(t)+'</div><div class="vas-fam-d">'+d+'</div></div></div>'; };
  var stat=function(v,l){ return '<div class="vas-h"><div class="vas-h-v">'+v+'</div><div class="vas-h-l">'+l+'</div></div>'; };
  return '<style>'+
    '.vas-hero{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:0 0 6px}@media(max-width:640px){.vas-hero{grid-template-columns:1fr}}'+
    '.vas-h{border-radius:13px;padding:15px 16px;color:#fff;background:linear-gradient(135deg,'+MA_RED+' 0%,#e0344e 100%)}'+
    '.vas-h-v{font-size:26px;font-weight:900;letter-spacing:-.5px;line-height:1}'+
    '.vas-h-l{font-size:11px;font-weight:600;opacity:.93;margin-top:6px;line-height:1.45}'+
    '.vas-fams{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 0 2px}@media(max-width:640px){.vas-fams{grid-template-columns:1fr}}'+
    '.vas-fam{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--bdr);border-radius:11px;padding:11px 13px;background:var(--w)}'+
    '.vas-fam-ic{font-size:20px;line-height:1;flex:none}.vas-fam-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.vas-fam-d{font-size:11px;color:var(--mu);line-height:1.45;margin-top:2px}</style>'+
    '<div class="ov-diagram-cap" style="margin:0 0 10px"><b>Value-Added Services (VAS)</b> is the leg that keeps the moat <b>widening</b> — the fastest-growing, least-regulated, most <b>network-agnostic</b> revenue Mastercard has, and the one it points to for durable double-digit growth.</div>'+
    '<div class="vas-hero">'+
      stat('~40%','of net revenue today — up from ~30% a few years ago, and still climbing')+
      stat('+20%+ <span style="font-size:15px">YoY</span>','growth — running well ahead of the payments network, pulling up the whole company')+
      stat('~$490B','addressable market (Investor Day 2024) — Mastercard holds <b>&lt;7%</b> of the serviceable slice')+
    '</div>'+
    '<div class="ov-subh" style="margin:14px 0 6px">Four families — sold on top of the rails (and off them)</div>'+
    '<div class="vas-fams">'+
      fam('🛡️','Security & cyber','<b>Recorded Future</b> threat intel, RiskRecon & <b>Decision Intelligence</b> AI fraud scoring — the trust layer, priced per transaction.')+
      fam('🎯','Consumer engagement','Loyalty & personalization (<b>Dynamic Yield</b>, SessionM) — help issuers & merchants acquire and retain cardholders.')+
      fam('📊','Business & market insights','<b>Test & Learn</b>, <b>Credit Intelligence</b> & <b>Ekata</b> identity — data, analytics and decisioning.')+
      fam('🔗','Open banking & processing','<b>Finicity</b> (US) & <b>Aiia</b> (Europe) plus gateway / processing — account-based reach beyond cards.')+
    '</div>'+
    '<div class="ov-subh" style="margin:16px 0 8px">Why it defends the moat <span style="font-weight:600;color:var(--mu)">— tap any card for the detail</span></div>'+
    vasPopTiles(VAS_MOAT,'vasm');
}
function html(c){
  var h='<div class="ov ov-mastercard" data-brand="MA">';
  h+=stdOverviewBody(c);
  h+='<div class="ov-modal-back" id="ovModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="ovModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="ovModalT"></div><div class="ov-modal-b" id="ovModalB"></div></div></div>';
  h+='</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════
//  DEEP DIVE — the 5-tab spine (Top Line · Bottom Line · Evolution · Valuation ·
//  Management), like UBER/LYFT/CART. Root class .ov-mastercard-dd scopes it.
// ═══════════════════════════════════════════════════════════════════════════
function pillarCards(list){
  return '<div class="ov-cards">'+list.map(function(s){
    return '<div class="ov-card ov-clickable" data-detail="fee:'+esc(s.k)+'">'+
      '<div class="ov-card-h"><span class="ov-card-n">'+esc(s.n)+'</span><span class="ov-chip">'+esc(s.rev)+'</span></div>'+
      '<div class="ov-card-s">'+s.what+'</div>'+
      '<div class="ov-more">How it monetizes ›</div></div>';
  }).join('')+'</div>';
}
function feeDetailHtml(s){
  return '<div class="ov-sub-line"><b>What it is.</b> '+s.what+'</div>'+
    '<div class="ov-sub-mon"><b>How it monetizes:</b> '+s.monetizes+'</div>'+
    (s.products && s.products.length ? '<div class="ov-subh" style="margin-top:14px">Inside it</div><div class="ov-prod">'+s.products.map(function(p){ return '<div class="ov-prod-tile"><div class="ov-prod-n">'+esc(p.n)+'</div><div class="ov-prod-d">'+p.d+'</div></div>'; }).join('')+'</div>' : '')+
    (s.competition ? '<div class="ov-sub-comp"><b>Competition:</b> '+s.competition+'</div>' : '');
}
function flowHtml(){
  return '<div class="ov-flow" id="ovFlow">'+
    '<div class="ov-flow-nodes">'+
      FLOW_NODES.map(function(n){ return '<div class="ov-flow-node" data-node="'+n.k+'"><div class="ov-flow-ic">'+n.ic+'</div><div class="ov-flow-l">'+esc(n.l)+'</div></div>'; }).join('<span class="ov-flow-link">→</span>')+
    '</div>'+
    '<div class="ov-flow-stage"><span class="ov-flow-step" id="ovFlowStep">Setup</span><div class="ov-flow-cap" id="ovFlowCap">'+FLOW_STEPS[0].cap+'</div>'+
      '<div class="ov-flow-earn" id="ovFlowEarn" hidden></div></div>'+
    '<div class="ov-flow-ctrl">'+
      '<button class="ov-flow-btn" id="ovFlowPlay">▶ Play</button>'+
      '<button class="ov-flow-btn ov-flow-sec" id="ovFlowPrev">‹ Prev</button>'+
      '<button class="ov-flow-btn ov-flow-sec" id="ovFlowNext">Next ›</button>'+
      '<div class="ov-flow-dots" id="ovFlowDots">'+FLOW_STEPS.map(function(s,i){ return '<span class="ov-flow-dot'+(i===0?' on':'')+'" data-i="'+i+'"></span>'; }).join('')+'</div>'+
    '</div>'+
    '<div class="ov-flow-note">'+FLOW_NOTE+'</div>'+
  '</div>';
}
// ── Top Line ▸ Segments (Payment Network fee lines + VAS growth engine) ──
// The yield stack — how $10.6T of volume becomes ~31bps of net revenue. A visual
// decomposition so the "thin-toll-road" economics read at a glance.
var MA_YIELD_STACK=[
  { l:'Domestic assessments', bps:9,  col:MA_STEEL, d:'a few bps of domestic GDV — the steady base' },
  { l:'Cross-border volume', bps:11, col:MA_RED,   d:'premium rate + FX — the highest-yield slice' },
  { l:'Transaction processing', bps:8, col:MA_ORANGE, d:'~fixed per switched txn — resilient to ticket size' },
  { l:'Value-added services', bps:22, col:'#7A5AF8', d:'sold on top of the rails, often network-agnostic' },
];
function maYieldStack(){
  var gross=MA_YIELD_STACK.reduce(function(a,s){ return a+s.bps; },0); // ~50bps gross-ish
  var rebate=19, net=gross-rebate; // illustrative gross→net haircut (in bps of GDV)
  var maxW=gross;
  var bar=function(s){ return '<div style="display:flex;align-items:center;gap:10px;margin:5px 0">'+
    '<div style="width:150px;font-size:11.5px;font-weight:700;color:var(--navy);text-align:right;flex:none">'+esc(s.l)+'</div>'+
    '<div style="flex:1;height:20px;background:#F1F4F8;border-radius:5px;overflow:hidden"><div style="height:100%;width:'+(s.bps/maxW*100).toFixed(1)+'%;background:'+s.col+';border-radius:5px"></div></div>'+
    '<div style="width:46px;font-size:12px;font-weight:900;color:'+s.col+';flex:none">'+s.bps+'bps</div></div>'+
    '<div style="margin:0 0 8px 160px;font-size:10.5px;color:var(--mu)">'+esc(s.d)+'</div>'; };
  return '<div class="ov-chart-card" style="padding:16px 18px">'+
    '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px">'+
      '<div><div style="font-size:22px;font-weight:900;color:var(--navy)">$10.6T</div><div style="font-size:10.5px;color:var(--mu)">gross dollar volume (FY25, +15%)</div></div>'+
      '<div style="font-size:22px;color:var(--mu);align-self:center">×</div>'+
      '<div><div style="font-size:22px;font-weight:900;color:'+MA_RED+'">~31 bps</div><div style="font-size:10.5px;color:var(--mu)">blended <b>net</b> yield on volume</div></div>'+
      '<div style="font-size:22px;color:var(--mu);align-self:center">=</div>'+
      '<div><div style="font-size:22px;font-weight:900;color:var(--navy)">$32.8B</div><div style="font-size:10.5px;color:var(--mu)">net revenue (FY25)</div></div>'+
    '</div>'+
    MA_YIELD_STACK.map(bar).join('')+
    '<div style="display:flex;align-items:center;gap:10px;margin:10px 0 2px;padding-top:10px;border-top:1px dashed var(--bdr)">'+
      '<div style="width:150px;font-size:11.5px;font-weight:800;color:#B7791F;text-align:right;flex:none">(−) Rebates & incentives</div>'+
      '<div style="flex:1;height:20px;background:#FBF3E4;border-radius:5px;overflow:hidden"><div style="height:100%;width:'+(rebate/maxW*100).toFixed(1)+'%;background:repeating-linear-gradient(45deg,#E8A00C,#E8A00C 6px,#f0b53a 6px,#f0b53a 12px);border-radius:5px"></div></div>'+
      '<div style="width:46px;font-size:12px;font-weight:900;color:#B7791F;flex:none">−'+rebate+'bps</div></div>'+
    '<div style="margin:8px 0 0 160px;font-size:11px;color:var(--navy)"><b>≈ 31 bps net</b> is what actually reaches the P&L — a <b>thin toll</b> on a vast river of volume, with <b>no credit risk and almost no capital</b>. Bars are illustrative bps-of-GDV to show the mix, not reported line items.</div>'+
  '</div>';
}
function ddSegmentsBody(c){
  var h='<p class="ov-lede">'+PN_INTRO+'</p>';
  h+='<div class="ov-callout" style="margin-bottom:18px">'+XBORDER_NOTE+'</div>';
  h+=sec('The money machine — how volume becomes revenue',
    '<div class="ov-diagram-cap" style="margin:0 0 10px">The whole model in one picture: a huge <b>volume</b> × a <b>thin blended yield</b> = net revenue. Each fee line (and VAS) adds a few basis points; rebates take a slice back.</div>'+maYieldStack());
  h+=sec('Payment Network — the three fee lines',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">How the rails monetize. <b>Tap any line</b> for what it is, how it\'s billed, and what drives it.</div>'+pillarCards(FEE_LINES));
  h+=sec('Value-Added Services — the growth engine',
    '<div class="ov-mbars" style="margin-bottom:14px">'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Payment Network</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:58%;background:'+MA_STEEL+';">the core rails</div></div><div class="ov-mbar-v">~58%</div></div>'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Value-Added Services</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:42%;background:'+MA_ORANGE+';">+22% YoY ▲</div></div><div class="ov-mbar-v">~42%</div></div>'+
    '</div>'+
    '<div class="ov-diagram-cap" style="margin:-4px 0 12px">VAS is ~42% of net revenue and compounding <b>faster than the network</b> (+22% YoY) — each year it takes a bigger slice and pulls up the whole company\'s growth rate. <b>Tap any card</b> for the detail.</div>'+
    vasPopTiles(VAS_ENGINE,'vase'));
  return h;
}
// ── Top Line ▸ Customers (demand mix) ──
function ddCustomersBody(c){
  var h='<p class="ov-lede">'+USERMIX_INTRO+'</p>';
  h+='<div class="ov-subh">A bigger recurring-services base than the leader</div>'+
    '<div class="ov-mbars" style="margin-bottom:16px">'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Services mix — Mastercard</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:42%;background:'+MA_ORANGE+';">recurring services</div></div><div class="ov-mbar-v">~42%</div></div>'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Services mix — the leader</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:27%;background:#C9CFD8;">recurring services</div></div><div class="ov-mbar-v">~27%</div></div>'+
    '</div>'+
    '<div class="ov-subh">A premium / travel-skewed product ladder</div>'+
    '<div class="ov-chain" style="margin-bottom:8px">'+
      '<div class="ov-chain-step"><div class="ov-chain-n">1</div><div class="ov-chain-t">Standard</div><div class="ov-chain-d">mass market</div></div>'+
      '<div class="ov-chain-step"><div class="ov-chain-n">2</div><div class="ov-chain-t">World</div><div class="ov-chain-d">affluent</div></div>'+
      '<div class="ov-chain-step"><div class="ov-chain-n">3</div><div class="ov-chain-t">World Elite</div><div class="ov-chain-d">high-spend · travel</div></div>'+
      '<div class="ov-chain-step is-payoff"><div class="ov-chain-n">4</div><div class="ov-chain-t">World Legend</div><div class="ov-chain-d">ultra-high-net-worth</div></div>'+
    '</div>'+
    '<div class="ov-diagram-cap">Up the ladder, cardholders spend more, travel more and skew to <b>cross-border</b>. Mastercard\'s mix also leans <b>more international</b> and less U.S.-debit-heavy, with <b>higher cross-border intensity</b> — cross-border grew ~<b>15%</b> in 2025 vs ~<b>12%</b> at the leader. <b>Net read:</b> a richer, higher-yield mix tilted to <b>discretionary, cross-border and affluent</b> spend (more travel-cyclical) plus <b>recurring services</b> — versus a peer heavier in U.S. debit.</div>';
  h+=sec('Who actually pays Mastercard — the named customers',
    '<div class="ov-diagram-cap" style="margin:0 0 10px">From <b>Bloomberg SPLC</b> (Jun 29, 2026). Mastercard’s direct customers aren’t consumers — they’re the <b>issuing banks, processors, fintechs and co-brand merchants</b> that connect to the rails. Many names below are the exact <b>"flip wins"</b> you just read in <b>Earnings History</b> (Wells Fargo, JPMorgan, Citizens, UniCredit, BPER, Webster, BOK…). US ≈ <b>51%</b> of customers, with France, Brazil (co-brand-heavy), Germany and Italy prominent.</div>'+maCustomerChips());
  h+='<div class="ov-foot">Customer list: Bloomberg SPLC (supply-chain), MA US Equity, as of Jun 29, 2026 — BBG estimates / company-disclosed relationships, not a Mastercard statement. Grouping is editorial. Consumer names (SPLC) are the direct counterparties; end-cardholders sit behind the issuers.</div>';
  return h;
}
// Named customers from Bloomberg SPLC — grouped by role in the ecosystem. The ★ marks
// names that are also earnings-call "flip / renewal wins" (see Earnings History).
var MA_CUST_GROUPS=[
  { t:'Issuing banks (incl. the flip / renewal wins ★)', ic:'🏦', note:'the portfolios that ride the rails',
    names:['Wells Fargo ★','JPMorgan Chase ★','Citizens Financial ★','UniCredit ★','BPER Banca ★','Webster Financial ★','BOK Financial ★','NewtekOne'] },
  { t:'Processors & payment enablers', ic:'⚙️', note:'the plumbing that connects merchants & issuers',
    names:['Fiserv','FIS (Fidelity National)','Global Payments','EVERTEC','Worldline','ACI Worldwide','Euronet','Green Dot','Cantaloupe'] },
  { t:'Fintechs, wallets & card platforms', ic:'📱', note:'the frenemies that mostly ride the rails',
    names:['PayPal','Block (Square)','Marqeta','Brex','Paysend','HiPay','GoDaddy','Wix'] },
  { t:'Co-brands, merchants & travel', ic:'🛍️', note:'the branded programs & spend partners',
    names:['Expedia ★','Southwest Airlines ★','Deutsche Lufthansa','Gap','Dillard’s ★','Zalando','Talabat','Emirates Telecom','WEX ★','Lottomatica'] },
  { t:'Infrastructure & rails partners', ic:'🔗', note:'RTP, security & travel-data rails',
    names:['The Clearing House (RTP) ★','Thales','Amadeus','Reply'] },
];
function maCustomerChips(){
  return '<div class="ov-chart-card" style="padding:14px 16px">'+
    '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px">'+
      '<div><div style="font-size:20px;font-weight:900;color:var(--navy)">~59</div><div style="font-size:10.5px;color:var(--mu)">named customers · ~200 facilities</div></div>'+
      '<div><div style="font-size:20px;font-weight:900;color:'+MA_RED+'">~51%</div><div style="font-size:10.5px;color:var(--mu)">US-domiciled customers</div></div>'+
      '<div><div style="font-size:20px;font-weight:900;color:var(--navy)">banks+</div><div style="font-size:10.5px;color:var(--mu)">issuers · processors · fintechs · co-brands</div></div>'+
      '<div><div style="font-size:20px;font-weight:900;color:var(--navy)">★</div><div style="font-size:10.5px;color:var(--mu)">= an earnings-call flip / renewal win</div></div>'+
    '</div>'+
    MA_CUST_GROUPS.map(function(g){ return '<div style="margin:10px 0 4px"><div style="font-size:12px;font-weight:800;color:var(--navy);margin-bottom:5px">'+g.ic+' '+esc(g.t)+' <span style="font-weight:600;color:var(--mu);font-size:10.5px">— '+esc(g.note)+'</span></div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:5px">'+g.names.map(function(n){ var win=n.indexOf('★')!==-1; return '<span style="background:'+(win?'rgba(207,10,44,0.06)':'#F1F4F8')+';border:1px solid '+(win?'rgba(207,10,44,0.25)':'var(--bdr)')+';border-radius:7px;padding:3px 9px;font-size:11px;color:var(--navy)">'+esc(n)+'</span>'; }).join('')+'</div></div>'; }).join('')+
  '</div>';
}
// ── Top Line ▸ TAM — Mastercard's OWN addressable-market framing (Nov 2024 Investor Day):
// Consumer Payments ~$54T · New Flows ~$100T (only ~5% carded) · Services $490B TAM. ──
function ddTamBody(c){
  function tamTile(l,v,s){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+l+'</div><div class="ov-kpi-v">'+v+'</div><div class="ov-kpi-d muted">'+s+'</div></div>'; }
  function penBar(label,pct,sub,col){ return '<div style="margin:10px 0 14px">'+
    '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px"><span style="font-size:12.5px;font-weight:800;color:var(--navy)">'+label+'</span><span style="font-size:13px;font-weight:900;color:'+col+'">'+pct.toFixed(0)+'% penetrated</span></div>'+
    '<div style="height:22px;background:#EEF2F7;border-radius:6px;overflow:hidden"><div style="height:100%;width:'+Math.max(pct,1.2).toFixed(1)+'%;background:'+col+';border-radius:6px"></div></div>'+
    '<div style="font-size:11px;color:var(--mu);margin-top:4px">'+sub+'</div></div>'; }
  var h='<p class="ov-lede">Mastercard sizes its opportunity by <b>payment flow</b> (Investor Day, Nov 2024). The headline: it operates against <b>&gt;$150T of flows plus a $490B services pool</b>, and the <b>vast majority is still un-carded</b> — the emptiness of the bars is the opportunity. These are company-cited figures (Oxford Economics / McKinsey / Mastercard analysis).</p>';
  h+='<div class="ov-kpis">'+
    tamTile('Consumer Payments','~$54T','~2.4T txns · ~70% still cash by count')+
    tamTile('New Flows (Commercial + Move)','~$100T','only ~$3T (~5%) carded today')+
    tamTile('Services TAM','$490B','$165B serviceable · MA ~$11B (2024)')+
    tamTile('MA share of Services SAM','<7%','the long runway management flags')+
  '</div>';
  h+=sec('How little is carded — the greenfield',
    '<div class="ov-diagram-cap" style="margin:0 0 8px">Each bar is how much of that flow already runs on cards. Almost empty = almost all still to win.</div>'+
    penBar('Consumer Payments — $54T', 30, 'of consumer spend is digital; <b>~70%</b> of transactions are still <b>cash</b>', MA_RED)+
    penBar('Commercial payments — $80T', 4, 'only <b>~$3T (~5%)</b> is carded; <b>$77T (~95%)</b> is cash/check/ACH/wire — the biggest greenfield', MA_ORANGE)+
    penBar('Mastercard Move — $20T', 8, 'disbursements, remittances & P2P; Move already touches 17B+ endpoints (+35% txns)', MA_STEEL)+
    '<div class="ov-fynote" style="margin-top:6px">The $100T "New Flows" TAM breaks down as <b>Commercial POS $17T</b> ($16T cash/check, $1T carded) + <b>Commercial invoiced/B2B $63T</b> ($8T check, $53T ACH/EFT/wire, $2T carded) + <b>Mastercard Move $20T</b>. Commercial alone = <b>$80T</b>.</div>');
  h+=sec('The Services pool — $490B TAM, MA under 7% of the serviceable slice',
    '<div class="ov-mbars">'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Consumer acquisition & engagement</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:100%;background:'+MA_STEEL+';">TAM $200B · SAM $50B</div></div><div class="ov-mbar-v">$200B</div></div>'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Security solutions</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:72%;background:'+MA_RED+';">TAM $145B · SAM $45B</div></div><div class="ov-mbar-v">$145B</div></div>'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Business & market insights</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:55%;background:'+MA_ORANGE+';">TAM $110B · SAM $50B</div></div><div class="ov-mbar-v">$110B</div></div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:8px">Total Services <b>TAM $490B · SAM $165B</b>; Mastercard’s 2024 services revenue was ~<b>$11B</b> — under <b>2% of TAM</b> and under <b>7% of SAM</b>. This is the leg management points to for durable double-digit growth.</div>');
  h+='<div class="ov-callout"><b>Sourcing note:</b> all TAM figures are <b>Mastercard-cited</b> (Nov 13, 2024 Investor Day), footnoted as built from Oxford Economics, McKinsey and Mastercard internal analysis — company estimates, not an independent third-party number.</div>';
  h+='<div class="ov-foot">Source: Mastercard Investment Community presentation, Nov 13, 2024 (market-size-by-payment-flow and services-TAM slides). Figures are company-cited addressable/serviceable markets, as-of Nov 2024.</div>';
  return h;
}
// ── Top Line ▸ Industry Analysis — the duopoly economics, the disintermediation threats
// (quantified), the bull/bear (evidence-framed, NOT a generic winds list), and what-to-watch.
// Sourced from Nilson, MA/Visa filings, ECB, Congress.gov, TechCrunch/Silicon Canals. ──
var MA_THREATS=[
  { k:'upi', sev:'high', ic:'🇮🇳', n:'Government A2A rails (UPI · Pix)', teaser:'The proven card-killer where deployed — India is the warning shot.',
    detail:'<p><b>The most concrete structural threat.</b> Government-built, near-zero-fee instant rails bypass cards entirely.</p>'+bullets([
      '<b>India UPI:</b> ~18B transactions/month (2025); a single day topped 650M — above Visa’s ~640M global daily average. India’s <b>card share of digital payments fell from 43% (2018) to ~21% (2024)</b>; UPI is now ~83% of digital transactions. Domestic <b>RuPay</b> (not Visa/MA) is favored.',
      '<b>Brazil Pix:</b> &gt;150M users (~70% of Brazilians), 224M txns/day, zero consumer fee; "International Pix" (Jul 2025) edges into cross-border card turf.',
      '<b>Read:</b> already materializing in EM with state-built rails; in the US/EU it is more a <b>medium-term margin cap</b> — A2A lacks credit, rewards and chargeback protection cards bundle.']) },
  { k:'stable', sev:'med', ic:'🪙', n:'Stablecoins & tokenized money', teaser:'Post-GENIUS Act rails could bypass cards on cross-border — MA is co-opting, not resisting.',
    detail:'<p>The <b>GENIUS Act</b> (signed Jul 18, 2025) created a US stablecoin framework. Stablecoin transfer volume (~$27.6T in 2024, though inflated by bots/DeFi) and a ~$300B market cap spooked investors that on-chain rails could skip cards — especially on high-margin <b>cross-border</b>.</p>'+bullets([
      '<b>MA response = co-opt:</b> settlement enabled for USDC, PYUSD, USDG, RLUSD, FIUSD; spend at 150M+ merchants; processes stablecoin txns across 47 countries.',
      'Agreed to acquire <b>BVNK</b> (2026) to bridge on-chain ↔ fiat; card programs with <b>Rain</b>; partners Paxos, Circle, Fiserv, PayPal.',
      '<b>Read:</b> more opportunity than existential near-term — but a real long-term tail risk to cross-border take rates if merchant-direct acceptance scales.']) },
  { k:'reg', sev:'med', ic:'⚖️', n:'Regulation & interchange', teaser:'CCCA routing mandate, Fed debit-cap, EU caps, MDL 1720 — a persistent pincer.',
    detail:'<p>Interchange pressure mostly hits <b>issuing banks</b>, but it caps the fee pool and invites routing mandates that pressure network volumes.</p>'+bullets([
      '<b>Credit Card Competition Act (Durbin–Marshall):</b> would force banks &gt;$100B to enable ≥2 unaffiliated networks on credit cards (routing competition). <b>Reintroduced Jan 2026; endorsed by President Trump</b> — a live legislative overhang (not yet law).',
      '<b>US debit (Durbin):</b> caps issuer debit interchange (~$0.21+5bps); Fed has proposed lowering it.',
      '<b>EU caps:</b> debit 0.2% / credit 0.3% — structurally lower European economics.',
      '<b>MDL 1720:</b> Visa/MA announced a revised settlement Nov 10, 2025 (~10bps cut); <b>merchant groups rejected it</b> — the multi-decade overhang persists.']) },
  { k:'capone', sev:'med', ic:'🏦', n:'Capital One–Discover', teaser:'A credible fourth US network that can route its own volume off Visa/MA.',
    detail:'<p>The <b>Capital One–Discover deal closed May 18, 2025</b>, giving Capital One a fourth US network (Discover).</p>'+bullets([
      'Combined ~<b>13.6% of 2023 US credit purchase volume, ~19% of balances</b>.',
      'Capital One can now <b>route its own volume off Visa/MA</b> — a structural, if gradual, share risk, and a ready "second network" beneficiary if the CCCA passes.']) },
  { k:'wallets', sev:'low', ic:'📱', n:'Big-tech & fintech wallets', teaser:'Mostly friends — Apple Pay rides the rails and lifts tokenized volume.',
    detail:'<p>Wallets have largely been <b>volume amplifiers</b>, not disintermediators — the networks embedded tokenization as the toll booth.</p>'+bullets([
      '<b>Apple Pay = friend:</b> requires an underlying Visa/MA card and uses the network token service; it <i>increases</i> tokenized transactions. Risk only if it ever pushed A2A funding.',
      '<b>PayPal / Cash App = frenemy:</b> some P2P/stored-balance flows route off-card, but most funding and their debit cards still ride Visa/MA. Net: partial leakage, mostly complementary.']) },
];
function ddIndustryBody(c){
  var sevCol={high:'#C0392B',med:'#E8A00C',low:'#0F9D58'}, sevL={high:'High',med:'Medium',low:'Low'};
  var h='<style>.mth-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:6px 0}@media(max-width:720px){.mth-grid{grid-template-columns:1fr}}'+
    '.mth-card{border:1px solid var(--bdr);border-left:4px solid var(--mu);border-radius:11px;padding:12px 14px;cursor:pointer;background:var(--w);transition:box-shadow .15s}.mth-card:hover{box-shadow:0 3px 12px rgba(18,53,107,0.09)}'+
    '.mth-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}.mth-n{font-size:13px;font-weight:800;color:var(--navy)}'+
    '.mth-sev{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:9px;padding:2px 7px;white-space:nowrap;color:#fff}'+
    '.mth-teaser{font-size:11.5px;color:var(--mu);line-height:1.5;margin:6px 0 6px}.mth-more{font-size:11px;font-weight:800}'+
    '.mbb{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:6px 0}@media(max-width:720px){.mbb{grid-template-columns:1fr}}'+
    '.mbb-col{border:1px solid var(--bdr);border-radius:11px;padding:13px 15px;background:var(--w)}.mbb-bull{border-top:3px solid #0F9D58}.mbb-bear{border-top:3px solid #C0392B}'+
    '.mbb-h{font-size:13px;font-weight:800;color:var(--navy);margin-bottom:6px}</style>';
  // Duopoly economics — visual
  h+='<p class="ov-lede">Mastercard and Visa run a global <b>open-loop duopoly</b> — a thin-fee "toll road" with no credit risk and the highest margins in the S&P 500. The useful question isn’t "who’s the peer" (that’s Visa) but <b>what could bypass the rails entirely</b>. First the economics, then the threats — <b>tap any threat card</b>.</p>';
  h+=sec('The duopoly, in numbers',
    '<div class="ov-kpis">'+
      '<div class="ov-kpi"><div class="ov-kpi-l">US purchase volume (V+MA)</div><div class="ov-kpi-v">$9.99T</div><div class="ov-kpi-d muted">2025 · Visa ~70% / MA ~30%</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Card processing ex-China</div><div class="ov-kpi-v">~90%</div><div class="ov-kpi-d muted">controlled by the two</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">MA gross dollar volume</div><div class="ov-kpi-v">$10.6T</div><div class="ov-kpi-d muted">+15% · 175.5B switched txns</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Operating margin</div><div class="ov-kpi-v">~57%</div><div class="ov-kpi-d muted">MA · vs Visa ~67%</div></div>'+
    '</div>'+
    '<div class="ov-diagram-cap" style="margin-top:10px">The moat is a two-sided network effect + entrenched acceptance. The interchange (the big ~1.5–2.5% fee) flows to <b>issuing banks, not the networks</b> — the networks take a thin switching fee and bear no credit risk.</div>');
  // Threats
  h+=sec('What to watch — the threats to the rails',
    '<div class="mth-grid">'+MA_THREATS.map(function(t){ return '<div class="mth-card ov-clickable" data-detail="threat:'+t.k+'" style="border-left-color:'+sevCol[t.sev]+'">'+
      '<div class="mth-top"><div class="mth-n">'+t.ic+' '+esc(t.n)+'</div><span class="mth-sev" style="background:'+sevCol[t.sev]+'">'+sevL[t.sev]+'</span></div>'+
      '<div class="mth-teaser">'+esc(t.teaser)+'</div><div class="mth-more" style="color:'+sevCol[t.sev]+'">the detail ›</div></div>'; }).join('')+'</div>');
  // Bull / Bear — evidence-framed
  h+=sec('The investment forces — bull vs bear (with the evidence)',
    '<div class="mbb"><div class="mbb-col mbb-bull"><div class="mbb-h">▲ Bull</div>'+bullets([
      '<b>Secular cash-to-digital</b> still has a long runway — $54T consumer + $77T un-carded commercial.',
      '<b>Duopoly pricing power</b>, ~57% margins, asset-light, huge FCF, ~$14.5B/yr buybacks.',
      '<b>Services + data/security</b> — the fastest-growing, <b>less-regulated</b> leg (~40% of revenue).',
      '<b>Co-opting</b> wallets, tokenization and now stablecoins rather than being bypassed in developed markets.',
      '<b>Cross-border/travel</b> recovery — the highest-margin volume.']) +'</div>'+
    '<div class="mbb-col mbb-bear"><div class="mbb-h">▼ Bear</div>'+bullets([
      '<b>Government A2A rails</b> (UPI/Pix) proven to gut card economics where deployed; FedNow/Digital Euro are slow-burning versions.',
      '<b>Stablecoin cross-border bypass</b> — a genuine long-term tail risk to the richest take rates.',
      '<b>Regulatory pincer:</b> CCCA routing mandate, Fed debit-cap, EU caps, unresolved MDL 1720.',
      '<b>Capital One–Discover</b> creates a credible fourth-network router.',
      '<b>Premium valuation</b> leaves little room for a growth disappointment.']) +'</div></div>'+
    '<div class="ov-fynote" style="margin-top:10px"><b>What to watch:</b> (1) CCCA progress in 2026; (2) any US "UPI moment" / FedNow consumer overlay; (3) merchant stablecoin acceptance + MA’s BVNK traction; (4) cross-border volume growth (the margin engine); (5) VAS revenue mix; (6) MDL 1720 approval/rejection; (7) Capital One re-routing volume off the networks.</div>');
  // Peer table (the map) — kept, consistent with the Overview scatter
  h+=sec('Peers — the competitive map',
    '<div class="ov-chart-card" style="overflow-x:auto"><table class="ov-table ov-cmp"><thead><tr><th>Dimension</th><th>'+PEER_COLS.map(esc).join('</th><th>')+'</th></tr></thead><tbody>'+
    PEER_ROWS.map(function(r){ return '<tr><td class="ov-td-name">'+esc(r[0])+'</td>'+r.slice(1).map(function(cell){ return '<td>'+cell+'</td>'; }).join('')+'</tr>'; }).join('')+
    '</tbody></table></div><div class="ov-diagram-cap" style="margin-top:10px">'+PEER_NOTE+'</div>'+
    '<div class="ov-diagram-cap" style="margin:6px 0 0;font-size:11px;color:var(--mu)"><b>Why a different peer set than the Overview scatter?</b> This map is qualitative and by <b>business model</b> — the direct <b>card-network</b> rivals plus <b>state-linked</b> UnionPay. The Overview scatter is broader: it plots the whole <b>listed payments ecosystem</b> by valuation (networks, processors, acquirers/PSPs, wallet, fintech, commercial payments) to show that the two networks earn a <b>premium multiple</b> the rest of the stack doesn\'t — same story, a wider lens.</div>');
  h+='<div class="ov-foot">Sources: Nilson Report (2025 US volumes); Mastercard/Visa FY2025 filings; TechCrunch/Silicon Canals/PaymentsJournal (UPI, Pix); Congress.gov (GENIUS Act, CCCA); ECB (digital euro); Capital One DEFM14A; MDL 1720 reporting. Stablecoin "volume" figures are widely cited but inflated by non-commercial on-chain activity.</div>';
  return h;
}
// A CSS gross-to-net waterfall — the single most important thing to model at a network.
function maGrossNetWaterfall(){
  // Illustrative FY25: gross ~$53B → rebates ~$20.2B (~38% of gross) → net ~$32.8B.
  // Rendered as a vertical waterfall: full Gross bar → floating rebate "drop" → Net bar.
  var gross=53, net=32.8, netPct=(net/gross*100), rebPct=((gross-net)/gross*100);
  var hatch='repeating-linear-gradient(45deg,#E8A00C,#E8A00C 7px,#f0b53a 7px,#f0b53a 14px)';
  var track=function(inner){ return '<div style="position:relative;height:172px">'+inner+'</div>'; };
  var lab=function(t,s){ return '<div style="text-align:center;margin-top:9px"><div style="font-size:11.5px;font-weight:800;color:var(--navy)">'+t+'</div><div style="font-size:9.5px;color:var(--mu)">'+s+'</div></div>'; };
  var val=function(t,c){ return '<div style="position:absolute;top:-21px;left:0;right:0;text-align:center;font-size:13px;font-weight:900;color:'+c+'">'+t+'</div>'; };
  return '<div class="ov-chart-card" style="padding:22px 18px 14px">'+
    '<div style="display:flex;gap:16px;align-items:flex-end">'+
      '<div style="flex:1">'+track('<div style="position:absolute;bottom:0;left:0;right:0;height:100%;background:'+MA_STEEL+';border-radius:6px 6px 0 0">'+val('$53B','var(--navy)')+'</div>')+lab('Gross revenue','all network + services fees')+'</div>'+
      '<div style="flex:1">'+track(
        '<div style="position:absolute;top:0;left:-16px;right:-16px;border-top:1px dashed var(--mu);opacity:.4"></div>'+
        '<div style="position:absolute;bottom:'+netPct.toFixed(1)+'%;left:-16px;right:-16px;border-top:1px dashed var(--mu);opacity:.4"></div>'+
        '<div style="position:absolute;bottom:'+netPct.toFixed(1)+'%;left:0;right:0;height:'+rebPct.toFixed(1)+'%;background:'+hatch+';border-radius:5px;display:flex;align-items:center;justify-content:center"><span style="font-size:12px;font-weight:900;color:#7A5200">−$20.2B</span></div>')+
        lab('(−) Rebates & incentives','paid to issuers · acquirers · merchants')+'</div>'+
      '<div style="flex:1">'+track('<div style="position:absolute;bottom:0;left:0;right:0;height:'+netPct.toFixed(1)+'%;background:'+MA_RED+';border-radius:6px 6px 0 0">'+val('$32.8B',MA_RED)+'</div>')+lab('= Net revenue','FY2025 · what MA reports & grows')+'</div>'+
    '</div>'+
    '<div style="margin-top:16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--bdr);padding-top:13px">'+
      '<div style="font-size:28px;font-weight:900;color:#B7791F;line-height:1">~38%</div>'+
      '<div style="font-size:11.5px;color:var(--navy);line-height:1.5;flex:1;min-width:220px">of <b>gross</b> revenue is handed back to customers as rebates & incentives. The <b>rebate ratio</b> is the single most important swing factor — a heavy renewal year steps it up and can optically slow net-revenue growth even when volume is perfectly healthy. <b>Watch the ratio, not just net revenue.</b></div>'+
    '</div>'+
    '<div style="font-size:10px;color:var(--mu);margin-top:9px">Illustrative FY25 magnitudes (gross and rebates are not separately reported line items); bars to scale.</div>'+
  '</div>';
}
// Rebates "why they exist / how they behave" as a visual (two flavors + the #2-network
// battleground) instead of a wall of bullets.
function maRebatesVisual(){
  var flavor=function(ic,name,book,effect,col){ return '<div class="reb-fl" style="border-top:3px solid '+col+'"><div class="reb-fl-h"><span class="reb-fl-ic">'+ic+'</span>'+name+'</div><div class="reb-fl-book">'+book+'</div><div class="reb-fl-eff">'+effect+'</div></div>'; };
  return '<style>'+
    '.reb-fl-wrap{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:2px 0 18px}@media(max-width:640px){.reb-fl-wrap{grid-template-columns:1fr}}'+
    '.reb-fl{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w)}'+
    '.reb-fl-h{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:900;color:var(--navy);margin-bottom:7px}.reb-fl-ic{font-size:18px}'+
    '.reb-fl-book{font-size:11.5px;color:var(--navy);line-height:1.5;margin-bottom:7px}'+
    '.reb-fl-eff{font-size:11px;color:var(--mu);line-height:1.5;border-top:1px dashed var(--bdr);padding-top:7px}'+
    '.reb-battle{display:grid;grid-template-columns:1fr auto 1.15fr auto 1fr;align-items:center;gap:8px;margin:4px 0 2px}@media(max-width:640px){.reb-battle{grid-template-columns:1fr}}'+
    '.reb-net{border:1.5px solid;border-radius:11px;padding:13px 10px;text-align:center}.reb-net-n{font-size:13px;font-weight:900}.reb-net-s{font-size:10px;color:var(--mu);margin-top:2px}'+
    '.reb-arr{text-align:center;font-size:11px;font-weight:800;color:#B7791F;white-space:nowrap}@media(max-width:640px){.reb-arr{transform:rotate(90deg)}}'+
    '.reb-prize{border:2px solid var(--navy);border-radius:12px;padding:12px 10px;text-align:center;background:#F8FAFC}.reb-prize-ic{font-size:24px;line-height:1}.reb-prize-n{font-size:13px;font-weight:900;color:var(--navy);margin-top:3px}.reb-prize-s{font-size:10.5px;color:var(--mu);margin-top:3px;line-height:1.4}</style>'+
    '<p class="ov-diagram-cap" style="margin-bottom:13px"><b>Rebates & incentives</b> are payments to <b>issuers, acquirers and merchants</b> to win and keep volume — booked as a <b>reduction of gross revenue</b> (contra-revenue), not an operating expense. They come in two flavors:</p>'+
    '<div class="reb-fl-wrap">'+
      flavor('📊','Volume / performance-based','Accrued as the customer <b>delivers volume</b>.','Moves with activity — scales up and down with the book.',MA_STEEL)+
      flavor('📝','Upfront / fixed','<b>Capitalized and amortized</b> over the contract life.','A big signing depresses net revenue for <b>years</b> — smoothing the hit.',MA_ORANGE)+
    '</div>'+
    '<div class="ov-subh" style="margin-bottom:9px">Why they exist — the #2-network battleground</div>'+
    '<div class="reb-battle">'+
      '<div class="reb-net" style="border-color:'+MA_RED+'"><div class="reb-net-n" style="color:'+MA_RED+'">Mastercard</div><div class="reb-net-s">bids incentives</div></div>'+
      '<div class="reb-arr">incentives&nbsp;$&nbsp;→</div>'+
      '<div class="reb-prize"><div class="reb-prize-ic">🏦</div><div class="reb-prize-n">The issuer</div><div class="reb-prize-s">routes its portfolio to <b>either</b> network</div></div>'+
      '<div class="reb-arr">←&nbsp;$&nbsp;incentives</div>'+
      '<div class="reb-net" style="border-color:var(--mu)"><div class="reb-net-n" style="color:var(--mu)">Visa</div><div class="reb-net-s">bids incentives</div></div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:13px">Because an issuer can send its portfolio to <b>either</b> rail, incentives are how Mastercard <b>wins and keeps</b> deals — the same dollars Visa is spending for the same portfolios. As the #2 network, this is the core competitive battleground.</div>';
}
// ── Bottom Line ▸ Unit Economics (rebates gross-to-net bridge + fee economics) ──
function ddUnitEconBody(c){
  var h='<p class="ov-lede">A network has no cost of goods — its "unit economics" are a <b>take-rate story</b>: how many basis points it keeps on each dollar of volume, and how much of gross revenue it hands back as incentives to win the volume in the first place. Two things to model: the <b>gross-to-net bridge</b> and the <b>rebate ratio</b>.</p>';
  h+=sec('The gross-to-net bridge — the most important thing to model',
    '<p class="ov-lede" style="margin-bottom:14px">'+REBATES_INTRO+'</p>'+maGrossNetWaterfall());
  h+=sec('Rebates & incentives — why they exist and how they behave', maRebatesVisual());
  h+=sec('Why the economics are so good — the take-rate, unpacked',
    '<div class="ov-kpis">'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Blended net yield</div><div class="ov-kpi-v">~31 bps</div><div class="ov-kpi-d muted">net revenue ÷ GDV</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Credit risk taken</div><div class="ov-kpi-v">$0</div><div class="ov-kpi-d muted">issuers hold the receivable</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Incremental cost / txn</div><div class="ov-kpi-v">~nil</div><div class="ov-kpi-d muted">the switch is already built</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Operating margin</div><div class="ov-kpi-v">~57%</div><div class="ov-kpi-d muted">flows from the above</div></div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:10px">Because the switching infrastructure is <b>already built</b>, each extra transaction is almost pure margin — a tiny toll, collected billions of times, with the credit risk parked at the banks. That is why a ~31bps take-rate turns into a ~57% operating margin.</div>');
  return h;
}
// ── Bottom Line ▸ Suppliers. Two layers: (1) the FOUR-PARTY model — the conceptual
// "supply chain" of the rails (issuers/acquirers/merchants/cardholders); and (2) the
// REAL vendor supply chain from Bloomberg SPLC (as of Jun 29, 2026) — which is almost
// entirely IT / software / cloud / security, the proof of the asset-light model. ──
var MA_SUP_GROUPS=[
  { t:'IT services, cloud & core software', ic:'🖥️', note:'the biggest cost bucket — Infosys is ~1.5% of Mastercard’s SG&A',
    names:['Infosys','Microsoft','Oracle','Informatica','Snowflake','Cloudflare','ACI Worldwide','CSG Systems','Pegasystems','Endava','Azul Systems'] },
  { t:'AI & advanced compute', ic:'🤖', note:'feeds the gen-AI fraud models announced in 2026',
    names:['NVIDIA','D-Wave Quantum'] },
  { t:'Security, identity & biometrics', ic:'🛡️', note:'the tech behind the security-VAS leg',
    names:['Qualys','Verimatrix','Kudelski','GB Group','Riskified','Fingerprint Cards','IDEX Biometrics','T Stamp'] },
  { t:'Card & payments hardware / rails tech', ic:'💳', note:'cards, terminals, connectivity',
    names:['Goldpac','Newland Digital','GMO Financial Gate','Euronet','Global Payments'] },
  { t:'Travel tech, marketing & facilities', ic:'✈️', note:'travel data (Amadeus), agencies, and the office footprint',
    names:['Amadeus IT Group','WPP','Ascential','Live Nation','Intl Workplace Group'] },
];
function maSupplierChips(){
  return '<div class="ov-chart-card" style="padding:14px 16px">'+
    '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px">'+
      '<div><div style="font-size:20px;font-weight:900;color:var(--navy)">~59</div><div style="font-size:10.5px;color:var(--mu)">named suppliers (BBG SPLC)</div></div>'+
      '<div><div style="font-size:20px;font-weight:900;color:'+MA_RED+'">~0%</div><div style="font-size:10.5px;color:var(--mu)">raw-material / COGS suppliers</div></div>'+
      '<div><div style="font-size:20px;font-weight:900;color:var(--navy)">IG1</div><div style="font-size:10.5px;color:var(--mu)">default-risk grade of the top vendors</div></div>'+
      '<div><div style="font-size:20px;font-weight:900;color:var(--navy)">US·UK·CN</div><div style="font-size:10.5px;color:var(--mu)">34% / 17% / 8% of suppliers domiciled</div></div>'+
    '</div>'+
    MA_SUP_GROUPS.map(function(g){ return '<div style="margin:10px 0 4px"><div style="font-size:12px;font-weight:800;color:var(--navy);margin-bottom:5px">'+g.ic+' '+esc(g.t)+' <span style="font-weight:600;color:var(--mu);font-size:10.5px">— '+esc(g.note)+'</span></div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:5px">'+g.names.map(function(n){ return '<span style="background:#F1F4F8;border:1px solid var(--bdr);border-radius:7px;padding:3px 9px;font-size:11px;color:var(--navy)">'+esc(n)+'</span>'; }).join('')+'</div></div>'; }).join('')+
  '</div>';
}
function ddSuppliersBody(c){
  var h='<p class="ov-lede">Mastercard is an <b>asset-light network</b>: it does not issue, lend or take credit risk. So "suppliers" means two different things — the <b>four-party model</b> (the conceptual supply chain of the rails), and the <b>real vendor list</b> (who Mastercard actually pays), which turns out to be <b>almost entirely IT, cloud, software and security</b>. That second list <i>is</i> the asset-light thesis.</p>';
  h+=sec('The four-party (open-loop) model',
      '<div class="ov-diagram-cap" style="margin:0 0 8px">The conceptual supply chain of the rails — tap any box for its role, then press <b>Play</b> to follow a single $100 purchase and see who earns at each step.</div>'+
      '<div class="ov-diagram" style="margin-top:6px">'+FOURPARTY_SVG+'</div>'+flowHtml());
  h+=sec('The real vendor supply chain — who Mastercard actually pays',
      '<div class="ov-diagram-cap" style="margin:0 0 10px">From <b>Bloomberg SPLC</b> (as of Jun 29, 2026). Notice what’s <b>not</b> here: no factories, no commodities, no cost-of-goods. Mastercard’s "supply chain" is <b>cloud, software, security and data-center tech</b> — a handful of low-risk, investment-grade vendors (Infosys is its single largest, ~1.5% of SG&A). That is why a ~57% operating margin is even possible.</div>'+maSupplierChips());
  h+=sec('How Mastercard makes money', '<div class="ov-callout">'+bullets(HOW_MONEY)+'</div>');
  h+='<div class="ov-foot">Vendor list & relationship sizes: Bloomberg SPLC (supply-chain), MA US Equity, as of Jun 29, 2026 — relationships are BBG estimates / company-disclosed, not a Mastercard statement. Grouping is editorial. Most top suppliers carry Bloomberg’s lowest default-risk grade (IG1).</div>';
  return h;
}
// ── Bottom Line ▸ Margins — profitability & cash margins as % of revenue. Sourced fallback
// (FY21–25 actuals from the model/filings, FY26E from the Summit model); the live Massive
// feed (api.fetchMargins) overrides it when reachable. MA has no cost-of-revenue line, so
// there is no "gross" margin — the story is operating/EBITDA/net/cash. ──
var MA_MRG_METRICS=[
  {key:'oper',label:'Operating',color:MA_RED},
  {key:'net',label:'Net',color:'#7A5AF8'},
  {key:'ebitda',label:'EBITDA',color:MA_ORANGE},
  {key:'cfo',label:'CFO',color:'#12B5A5'},
  {key:'fcf',label:'FCF',color:MA_GREEN}
];
var MA_MRG_FALLBACK=[
  {fy:'FY21', oper:53.4, net:46.0, ebitda:60.7, cfo:47.0, fcf:48.0},
  {fy:'FY22', oper:54.5, net:44.7, ebitda:57.6, cfo:47.0, fcf:48.4},
  {fy:'FY23', oper:55.1, net:44.6, ebitda:59.1, cfo:46.0, fcf:46.6},
  {fy:'FY24', oper:54.2, net:45.7, ebitda:58.6, cfo:51.0, fcf:50.8},
  {fy:'FY25', oper:56.6, net:44.6, ebitda:61.3, cfo:47.6, fcf:46.1},
  {fy:'FY26E',oper:57.9, net:44.7, ebitda:61.6, cfo:48.8, fcf:47.2, proj:true}
];
var MA_MRG_NOTE_FB='Operating / net = <b>GAAP</b>; EBITDA and CFO/FCF ÷ net revenue. <b>FY26E</b> = Summit model. Mastercard runs one of the <b>highest operating margins in the S&P 500 (~55–58%)</b> and converts nearly half of revenue to free cash flow — the asset-light, no-credit-risk model in one picture. <span style="color:#B7791F">Directional fallback; the live Massive feed overrides it when reachable.</span> <span class="ave-subh-note">CFO FY21–24 are directional seeds.</span>';
var MA_MRG_NOTE_LIVE='Historical margins computed <b>live from Massive</b> (income & cash-flow statements): operating/net = line ÷ revenue; EBITDA = (op income + D&A) ÷ revenue; CFO & FCF ÷ revenue. Mastercard has no cost-of-revenue line, so there is no gross margin.';
var _maMrgRows=MA_MRG_FALLBACK.slice();
var _maMrgSrc='fallback';
function ddMarginsBody(c){
  return '<p class="ov-lede">Profitability & cash margins as a % of net revenue. The whole thesis reads in one chart: a business with <b>no credit risk and almost no capital</b> earns a <b>~57% operating margin</b>, a <b>~61% EBITDA margin</b>, and converts <b>~46–48% of revenue to free cash flow</b> — margins near the very top of any large company.</p>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Margins (% of net revenue) <span>· fiscal years · FY26E = estimate</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="maChartMargins"></canvas></div></div>'+
    '<div class="ave-subh-note" id="maMrgNote" style="margin-top:8px">'+MA_MRG_NOTE_FB+'</div>';
}
function buildMaMargins(){
  var cv=document.getElementById('maChartMargins'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var ex=Chart.getChart?Chart.getChart(cv):null; if(ex) ex.destroy();
  var labels=_maMrgRows.map(function(r){ return r.fy; });
  var projIdx=_maMrgRows.reduce(function(a,r,i){ return r.proj?i:a; }, -1);
  var ds=MA_MRG_METRICS.map(function(m){ return { label:m.label, data:_maMrgRows.map(function(r){ return r[m.key]; }), borderColor:m.color, backgroundColor:m.color, borderWidth:2, tension:.25, spanGaps:true, fill:false,
    pointRadius:_maMrgRows.map(function(r){ return r.proj?4:2; }), pointStyle:_maMrgRows.map(function(r){ return r.proj?'rectRot':'circle'; }),
    segment:{ borderDash:function(ctx){ return ctx.p1DataIndex===projIdx?[5,4]:undefined; } } }; });
  new Chart(cv.getContext('2d'),{ type:'line', data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ title:function(it){ var l=it[0].label; return l==='FY26E'?'FY26E · estimate':l; }, label:function(ctx){ return ctx.dataset.label+': '+(ctx.parsed.y==null?'—':ctx.parsed.y.toFixed(1)+'%'); } } } },
      scales:{ y:{ ticks:{ callback:function(v){ return v+'%'; }, font:{size:10} }, grid:{color:'#EEF2F7'} }, x:{ grid:{display:false}, ticks:{font:{size:10.5}} } } }
  });
  maLoadMargins();
}
function maLoadMargins(){
  if(_maMrgSrc==='massive') return;
  import('../api.js').then(function(api){ return api.fetchMargins?api.fetchMargins('MA'):null; }).then(function(res){
    if(!res||!res.success||!res.data||res.data.length<3) return;
    var proj=MA_MRG_FALLBACK[MA_MRG_FALLBACK.length-1];
    _maMrgRows=res.data.concat(proj&&proj.proj?[proj]:[]);
    _maMrgSrc='massive';
    var note=document.getElementById('maMrgNote'); if(note) note.innerHTML=MA_MRG_NOTE_LIVE;
    buildMaMargins();
  }).catch(function(){});
}
// ── Evolution ▸ Strategy — the real architecture: grow/diversify/build × 3 vectors, the
// multi-rail hedge, and the forward bets (tokenization/agentic/stablecoins). Sourced from
// the Nov 2024 Investor Day, FY2025 10-K and the Q4 2025 call. Driver cards → pop-ups. ──
var MA_STRAT_DRIVERS=[
  { k:'consumer', ic:'💳', t:'Consumer Payments', teaser:'Digitize the ~$54T of consumer spend still mostly cash — the core engine.',
    detail:'<p><b>The anchor vector.</b> A ~<b>$54T</b> consumer-payment market, ~2.4T transactions, still <b>~70% cash by transaction count</b> — the cash-to-digital runway.</p>'+bullets([
      '<b>Premiumization:</b> secured <b>60+ new affluent programs</b> in 2025; renewed <b>Capital One</b> (US + Canada) — a marquee validation.',
      '<b>Acceptance + contactless + tokenized core</b> — the same token stack now extended to agentic commerce.',
      '<b>Cross-border</b> (travel + e-commerce) is the high-yield slice within consumer payments.',
      'Reach: capabilities touch <b>&gt;95% of the banked population</b> via 10B+ endpoints.']) },
  { k:'newflows', ic:'🔀', t:'Commercial & New Flows', teaser:'A ~$100T addressable market only ~5% carded — the biggest greenfield.',
    detail:'<p><b>The largest disclosed TAM: ~$100T</b> (Investor Day), of which only <b>~$3T (~5%) is carded</b> today.</p>'+bullets([
      '<b>Commercial / B2B & virtual cards:</b> commercial was <b>13% of GDV in 2025, +11% YoY</b> lc. Wins: WEX (renewed), Barclays, the Coupa Mastercard.',
      '<b>Mastercard Move</b> (disbursements + remittances, incl. Mastercard Send): <b>17B+ endpoints</b>, transaction growth <b>&gt;35%</b>. New reach: GCash, Weixin Pay.',
      '<b>A2A / real-time:</b> built on Vocalink/Nets + Finicity open banking — extends beyond card flows.']) },
  { k:'services', ic:'🛡️', t:'Services & Solutions', teaser:'~40% of revenue, +22%, and <7% share of a $490B TAM — the diversifier.',
    detail:'<p><b>The diversification engine.</b> VAS was <b>+22% YoY (Q4 2025)</b>, now <b>~40% of revenue</b>, and Mastercard holds <b>&lt;7%</b> of a <b>$165B serviceable</b> market ($490B TAM) — a long runway. CFO Mehra: <b>~60% of VAS is "network-linked"</b> (scales with transactions).</p>'+bullets([
      '<b>Security & cyber:</b> Recorded Future ($2.65B threat intel), RiskRecon, Decision Intelligence (AI fraud scoring).',
      '<b>Identity & data:</b> Ekata; Test & Learn, Dynamic Yield; new <b>Mastercard Credit Intelligence</b> (2025).',
      '<b>Open banking:</b> Finicity (US), Aiia (Europe).']) },
  { k:'multirail', ic:'🛤️', t:'The multi-rail hedge', teaser:'Own the A2A/real-time rails so MA earns whichever rail a payment takes.',
    detail:'<p><b>The disintermediation hedge.</b> Rather than resist account-to-account/real-time rails that could bypass cards, Mastercard <b>owns and monetizes them</b> — and layers its high-margin services on top of non-card flows.</p>'+bullets([
      'Rails owned: <b>Vocalink</b> (UK Faster Payments/BACS), <b>Nets</b> A2A, "Pay by Bank", Finicity/Aiia open banking.',
      'Stance ("cards + real-time + account-based") means MA <b>captures value on whichever rail</b> a payment travels.',
      'Tokenization + agentic + stablecoin rails keep MA’s <b>credential and trust layer embedded</b> as the settlement rail changes.']) },
  { k:'future', ic:'🤖', t:'The forward bets', teaser:'Tokenize 100% of e-commerce by 2030, agentic commerce, and stablecoins.',
    detail:'<p><b>Where the next decade is being placed.</b></p>'+bullets([
      '<b>Tokenization:</b> goal to tokenize <b>100% of e-commerce by 2030</b> (number-free cards); <b>~40% of transactions already tokenized</b>, ~50% of European e-commerce. Click to Pay live in 26 markets + Payment Passkeys.',
      '<b>Agentic commerce — "Mastercard Agent Pay"</b> (Apr 2025): verified AI agents transact via <b>Agentic Tokens</b> (agent identity + merchant scope + spend policy, no raw card number). Partners: Microsoft, IBM, Salesforce, Checkout.com. Rolled to <b>all US cardholders by Nov 2025</b>, global Q1 2026.',
      '<b>Stablecoins / Multi-Token Network:</b> settlement enabled for <b>USDC, PYUSD, USDG, FIUSD, RLUSD</b>; spend at <b>150M+ merchants</b>; agreed to acquire <b>BVNK</b> (2026) to bridge on-chain ↔ fiat. Partners: Paxos, Circle, Fiserv, PayPal, OKX.']) },
];
// Click-through detail for the three verb-triad hero cards (opens in the shared modal).
var MA_VERBS={
  grow:{ t:'📈 Grow — the core network', h:
    '<p style="font-size:12.5px;color:var(--navy);line-height:1.55;margin-bottom:10px">Keep digitizing the world\'s payments and premiumize the existing book — the engine that still has a long runway.</p>'+bullets([
      '<b>~$54T</b> of consumer spend, ~2.4T transactions, still <b>~70% cash</b> by count — the cash-to-digital runway.',
      '<b>Premiumization:</b> 60+ new affluent programs in 2025; the <b>Capital One</b> renewal (US + Canada) is a marquee validation.',
      '<b>Cross-border</b> (travel + e-commerce) is the high-yield slice — a key growth driver.',
      'Acceptance + contactless + a <b>tokenized core</b>, now extended to agentic commerce.']) },
  diversify:{ t:'🧬 Diversify — customers & geographies', h:
    '<p style="font-size:12.5px;color:var(--navy);line-height:1.55;margin-bottom:10px">Change what Mastercard earns on and where — so growth is less tied to any single market or the card-swipe cycle.</p>'+bullets([
      '<b>Services & Solutions:</b> ~40% of revenue, +20%+, and <b>&lt;7% share of a ~$490B TAM</b> — the diversifier, much of it network-agnostic.',
      '<b>Commercial & New Flows:</b> a ~$100T addressable market only ~5% carded — the biggest greenfield (B2B, virtual cards, Mastercard Move).',
      '<b>Geographies:</b> a strong international / cross-border tilt versus a more US-centric rival.',
      'Because VAS sells even off Mastercard rails, it <b>decouples growth from card-share battles</b>.']) },
  build:{ t:'🏗️ Build — for the future', h:
    '<p style="font-size:12.5px;color:var(--navy);line-height:1.55;margin-bottom:10px">Own the next rails and the trust layer, so Mastercard still gets paid however money moves.</p>'+bullets([
      '<b>Multi-rail hedge:</b> owns A2A / real-time rails (Vocalink, Nets, open banking) — earns on <b>whichever rail</b> a payment takes.',
      '<b>Tokenization:</b> the goal is to tokenize <b>100% of e-commerce by 2030</b>; ~40% of transactions are already tokenized.',
      '<b>Agentic commerce — Agent Pay:</b> verified AI agents transact via Agentic Tokens (Microsoft, IBM, Salesforce partners).',
      '<b>Stablecoins / Multi-Token Network:</b> settlement for USDC, PYUSD, RLUSD…; agreed to acquire <b>BVNK</b> (2026).']) },
};
function ddStrategyBody(c){
  var h='<style>'+
    '.mstr-hero{display:flex;flex-wrap:wrap;gap:10px;align-items:stretch;margin:8px 0 18px}'+
    '.mstr-verb{flex:1;min-width:150px;border:1px solid var(--bdr);border-top:4px solid '+MA_RED+';border-radius:13px;padding:15px 16px;text-align:center;background:linear-gradient(180deg,rgba(207,10,44,.055),var(--w))}'+
    '.mstr-verb-ic{font-size:25px;line-height:1}.mstr-verb-v{font-size:23px;font-weight:900;color:var(--navy);margin-top:5px;letter-spacing:-.4px}'+
    '.mstr-verb-l{font-size:11px;color:var(--mu);font-weight:700;margin-top:2px}'+
    '.mstr-plus{align-self:center;font-size:22px;font-weight:900;color:'+MA_RED+'}@media(max-width:640px){.mstr-plus{display:none}}'+
    '.mstr-verb.ov-clickable{cursor:pointer;transition:box-shadow .15s,transform .1s}.mstr-verb.ov-clickable:hover{box-shadow:0 5px 16px rgba(207,10,44,.13);transform:translateY(-1px)}'+
    '.mstr-verb-more{font-size:10px;font-weight:800;color:'+MA_RED+';margin-top:7px;letter-spacing:.3px}'+
    '.mad-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:10px;align-items:stretch;margin:4px 0 12px}@media(max-width:760px){.mad-flow{grid-template-columns:1fr}}'+
    '.mad-arr{align-self:center;color:'+MA_RED+';font-size:20px;font-weight:900}@media(max-width:760px){.mad-arr{text-align:center}}'+
    '.mad-step{border:1px solid var(--bdr);border-radius:12px;padding:13px 14px;background:var(--w)}'+
    '.mad-h{font-size:12.5px;font-weight:900;color:var(--navy);margin-bottom:7px}.mad-p{font-size:11.5px;color:var(--mu);line-height:1.5}'+
    '.mad-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}.mad-chip{font-size:10px;font-weight:700;border-radius:7px;padding:3px 8px}</style>';
  h+='<p class="ov-lede">Mastercard frames its strategy as a verb triad, executed through <b>three growth vectors</b> (Consumer Payments · Commercial & New Flows · Services) and wired together by a <b>multi-rail</b> platform — the deliberate hedge against disintermediation. <b>Tap any card</b> — the three verbs below <i>or</i> the five levers under them — for the detail.</p>';
  h+='<div class="mstr-hero">'+
    '<div class="mstr-verb ov-clickable" data-detail="verb:grow"><div class="mstr-verb-ic">📈</div><div class="mstr-verb-v">Grow</div><div class="mstr-verb-l">the core network</div><div class="mstr-verb-more">Tap ›</div></div>'+
    '<span class="mstr-plus">→</span>'+
    '<div class="mstr-verb ov-clickable" data-detail="verb:diversify"><div class="mstr-verb-ic">🧬</div><div class="mstr-verb-v">Diversify</div><div class="mstr-verb-l">customers & geographies</div><div class="mstr-verb-more">Tap ›</div></div>'+
    '<span class="mstr-plus">→</span>'+
    '<div class="mstr-verb ov-clickable" data-detail="verb:build"><div class="mstr-verb-ic">🏗️</div><div class="mstr-verb-v">Build</div><div class="mstr-verb-l">for the future</div><div class="mstr-verb-more">Tap ›</div></div>'+
  '</div>';
  h+=sec('Why the acquisition spree — defending share by offering more',
    '<div class="mad-flow">'+
      '<div class="mad-step" style="border-top:3px solid '+MA_STEEL+'"><div class="mad-h">① The ecosystem is crowding</div><div class="mad-p">A wave of new entrants is trying to sit between the bank and the merchant — routing around cards.</div>'+
        '<div class="mad-chips">'+['Fintechs','Digital wallets','A2A / real-time','Stablecoins','Big-tech pay'].map(function(x){ return '<span class="mad-chip" style="background:#EEF2F7;color:var(--navy)">'+esc(x)+'</span>'; }).join('')+'</div></div>'+
      '<div class="mad-arr">→</div>'+
      '<div class="mad-step" style="border-top:3px solid '+MA_ORANGE+'"><div class="mad-h">② So the game changes</div><div class="mad-p">Mastercard already holds enormous network share. The battle is no longer <i>winning</i> share — it is <b>defending</b> it. The moat: earn <b>more on every transaction</b>, and even off its own rails.</div></div>'+
      '<div class="mad-arr">→</div>'+
      '<div class="mad-step" style="border-top:3px solid '+MA_RED+'"><div class="mad-h">③ The response: buy the "more"</div><div class="mad-p"><b>~$10B+ of acquisitions since 2015</b> bolt value-added services onto the rails:</div>'+
        '<div class="mad-chips">'+['Security','Identity','Data & AI','Open banking','A2A rails'].map(function(x){ return '<span class="mad-chip" style="background:rgba(207,10,44,.08);color:'+MA_RED+'">'+esc(x)+'</span>'; }).join('')+'</div></div>'+
    '</div>'+
    '<div class="ov-callout" style="margin-top:4px"><b>The payoff:</b> VAS is now <b>~40% of revenue and growing 20%+</b>, much of it sells <b>even where Mastercard doesn\'t win the card</b> (fraud, identity, open banking), and every service sold into an issuer or merchant <b>raises switching costs</b> — so the network share gets <i>stickier</i>. The through-line of a decade of M&A: <b>services → a wider, better-defended moat</b>.</div>');
  h+=sec('The five levers — tap any card',
    '<div class="ov-drivers">'+MA_STRAT_DRIVERS.map(function(d){ return '<div class="ov-driver ov-clickable" data-detail="strat:'+esc(d.k)+'"><div class="ov-driver-t">'+d.ic+' '+esc(d.t)+'</div><div class="ov-driver-d">'+esc(d.teaser)+'</div><div class="ov-more">More ›</div></div>'; }).join('')+'</div>');
  h+=sec('The 2025–2027 targets (Investor Day, Nov 2024)',
    '<div class="ov-targets ov-targets-3">'+[
      ['Net revenue CAGR','high-end low-double-digits','currency-neutral, ex-acquisitions'],
      ['VAS net revenue CAGR','high teens','the growth engine'],
      ['Operating margin','≥ 55%','minimum, annually'],
      ['EPS CAGR','mid-teens','buybacks amplify'],
    ].map(function(b){ return '<div class="ov-target"><div class="ov-target-v">'+esc(b[1])+'</div><div class="ov-target-l">'+esc(b[0])+'</div><div class="ov-target-s">'+esc(b[2])+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:12px">Acquisitions (incl. Recorded Future) add ~<b>0.5 pp</b> to the net-revenue CAGR. The tell on the runway: Mastercard says its <b>VAS market share is under 7%</b>.</div>');
  h+=sec('The flywheel — why services and the network reinforce each other',
    '<div class="ov-callout"><div class="ov-tl-body" style="font-size:12px;line-height:1.6"><b>~60% of VAS is network-linked</b>, so more transactions → more services revenue; and services (fraud scoring, identity, insights, loyalty) make the network more valuable, winning/retaining the issuing & co-brand deals that drive <i>more</i> transactions. Services also grows faster (high-teens) and is <b>less regulated</b> than swipe fees — diversifying revenue to ~40% and reducing reliance on pure card-switching.</div></div>');
  h+='<div class="ov-foot">Sources: Mastercard Nov 13, 2024 Investment Community presentation; FY2025 10-K; Q4 2025 earnings call (Jan 29, 2026); Mastercard press (Agent Pay, stablecoin settlement, tokenization). Forward targets are company objectives, not guarantees.</div>';
  return h;
}
// ── Valuation ▸ Balance Sheet (the DCF financials) ──
function ddFinancialsBody(c){
  var h='<p class="ov-lede">'+FIN_INTRO+'</p>';
  h+='<div class="ov-rangebar">'+
    '<div class="ov-range-head"><span class="ov-range-title">Timeline</span><span class="ov-range-val" id="ovFinVal">2021 – 2029E</span></div>'+
    '<div class="ov-range-slider"><div class="ov-range-track"></div><div class="ov-range-fill" id="ovFinFill"></div>'+
      '<input type="range" id="ovFinMin" min="2021" max="2029" step="1" value="2021">'+
      '<input type="range" id="ovFinMax" min="2021" max="2029" step="1" value="2029">'+
      '<div class="ov-range-ticks" id="ovFinTicks"></div></div>'+
  '</div>';
  h+='<div class="ov-charts ov-charts-2">'+
    finCard('finRev','Revenue','FY21 – FY29E')+
    finCard('finOpInc','Operating Income','FY21 – FY29E')+
    finCard('finEbitda','EBITDA','FY21 – FY29E')+
    finCard('finFcf','Free Cash Flow','FY21 – FY29E')+
  '</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:10px">'+FIN_NOTE+'</div>';
  return h;
}
function finCard(id, title, sub){
  return '<div class="ov-chart-card"><div class="ov-chart-t">'+esc(title)+' <span>'+esc(sub)+'</span></div>'+
    '<div class="ov-chart-wrap"><canvas id="'+id+'"></canvas></div>'+
    '<div class="ov-statline" id="stat-'+id+'"></div></div>';
}
// ── Valuation ▸ Risk & Litigation — the ONE thing that is specific to Mastercard here:
// it bears interchange litigation DIRECTLY (no Visa-style escrow shield). The broader
// bull/bear forces are evidence-framed in Top Line ▸ Industry Analysis (not a generic
// winds list — same convention as UBER). ──
// Inline SVG flags — country-flag emoji don't render on Windows, so draw them (CSP-safe).
function flagSvg(code){
  var open='<svg class="lit-flag" viewBox="0 0 60 40" width="42" height="28" preserveAspectRatio="none">';
  if(code==='us'){
    var st=''; for(var i=0;i<13;i++){ if(i%2===0) st+='<rect y="'+(i*40/13).toFixed(2)+'" width="60" height="'+(40/13).toFixed(2)+'" fill="#B22234"/>'; }
    var stars=''; [6,14,22].forEach(function(x){ [4,11,18].forEach(function(y){ stars+='<circle cx="'+x+'" cy="'+y+'" r="1.3" fill="#fff"/>'; }); });
    return open+'<rect width="60" height="40" fill="#fff"/>'+st+'<rect width="26" height="21.54" fill="#3C3B6E"/>'+stars+'</svg>';
  }
  if(code==='gb'){
    return open+'<rect width="60" height="40" fill="#012169"/>'+
      '<path d="M0,0 60,40 M60,0 0,40" stroke="#fff" stroke-width="9"/>'+
      '<path d="M0,0 60,40 M60,0 0,40" stroke="#C8102E" stroke-width="4"/>'+
      '<path d="M30,0 V40 M0,20 H60" stroke="#fff" stroke-width="12"/>'+
      '<path d="M30,0 V40 M0,20 H60" stroke="#C8102E" stroke-width="6"/></svg>';
  }
  if(code==='eu'){
    var s=''; for(var j=0;j<12;j++){ var a=j*Math.PI/6; s+='<circle cx="'+(30+13*Math.sin(a)).toFixed(1)+'" cy="'+(20-13*Math.cos(a)).toFixed(1)+'" r="1.8" fill="#FFCC00"/>'; }
    return open+'<rect width="60" height="40" fill="#003399"/>'+s+'</svg>';
  }
  return open+'<rect width="60" height="40" fill="#EAF2FB"/><circle cx="30" cy="20" r="15" fill="#2E86C1"/>'+
    '<g fill="#3FA35B"><ellipse cx="24" cy="15" rx="5" ry="3"/><ellipse cx="37" cy="24" rx="6" ry="3.5"/></g>'+
    '<g stroke="#fff" stroke-width="1" fill="none" opacity=".65"><ellipse cx="30" cy="20" rx="15" ry="6"/><line x1="30" y1="5" x2="30" y2="35"/></g></svg>';
}
function litFlagCards(){
  return '<div class="lit-grid">'+LIT_CASES.map(function(x){ var lv=LIT_LEVEL[x.level];
    return '<div class="lit-card" style="border-top:3px solid '+lv.c+'">'+
      '<div class="lit-head">'+flagSvg(x.code)+'<span class="lit-juris">'+esc(x.juris)+'</span>'+
        '<span class="lit-tag" style="color:'+lv.c+';border-color:'+lv.c+'">'+esc(x.tag)+'</span></div>'+
      '<div class="lit-headline">'+x.headline+'</div>'+
      '<div class="lit-row"><span class="lit-k">Status</span><span class="lit-v">'+x.status+'</span></div>'+
      '<div class="lit-row"><span class="lit-k">MA&nbsp;exposure</span><span class="lit-v">'+x.exp+'</span></div>'+
      '<div class="lit-badge" style="color:'+lv.c+';background:'+_hexRgba(lv.c,0.10)+'">'+esc(lv.l)+'</div>'+
    '</div>'; }).join('')+'</div>';
}
// Click-through detail for the two litigation-flow columns (opens in the shared modal).
var LIT_FLOW={
  ma:{ t:'Mastercard — how a litigation hit actually lands',
    h:'<p style="font-size:12.5px;color:var(--navy);line-height:1.55;margin-bottom:10px">One class of stock, one set of shareholders — so there is nobody else to hand the bill to.</p>'+bullets([
      '<b>How it hits the numbers:</b> when a loss becomes <b>probable and reasonably estimable</b>, Mastercard books a <b>litigation provision</b> — a charge in operating expenses (G&A) that flows straight through to <b>operating income, net income and equity</b> in the period it is recognized.',
      '<b>It has happened repeatedly:</b> Mastercard has taken interchange-related provisions over the years (US MDL 1720, UK/EU matters) that dented reported earnings in the quarters booked — then cash goes out as settlements are paid.',
      '<b>No pass-through:</b> unlike Visa there is no escrow or third party to absorb it. Shareholders bear ~100% of any settlement or judgment, net of any insurance.',
      '<b>Net:</b> a cleaner, simpler structure with no share-class overhang — but interchange litigation is a <b>direct, if so-far-manageable, P&L and shareholder risk</b>.']) },
  visa:{ t:'Visa — the Class-B litigation-escrow shield',
    h:'<p style="font-size:12.5px;color:var(--navy);line-height:1.55;margin-bottom:10px">Built at Visa\'s 2008 IPO specifically to quarantine US interchange ("covered") litigation off the public shareholder.</p>'+bullets([
      '<b>Who holds the risk:</b> <b>Class B shares</b> are held by Visa\'s <b>former member banks</b> — the same banks that were co-defendants. A dedicated <b>litigation escrow</b> (the "US retrospective responsibility plan") is pre-funded from Visa\'s cash flow.',
      '<b>The mechanism:</b> when Visa settles covered litigation it deposits into the escrow; each deposit <b>reduces the Class B → Class A conversion ratio</b>. Economically the cost is borne by the <b>Class B (bank) holders</b> through dilution of their own stake — not by public Class A holders.',
      '<b>Result:</b> Class A (public float) shareholders are <b>largely insulated</b> from US covered interchange litigation.',
      '<b>Trade-off:</b> a more complex capital structure and a standing Class B overhang — the price Visa pays for the shield Mastercard doesn\'t have.']) },
};
function litShieldVisual(){
  function node(ic,txt,accent){ return '<div class="lsv-node"'+(accent?' style="border-color:'+accent+'"':'')+'><span class="lsv-ic">'+ic+'</span><span>'+txt+'</span></div>'; }
  var arr='<div class="lsv-arr">↓</div>';
  var ma='<div class="lsv-col ov-clickable" data-detail="litflow:ma"><div class="lsv-h" style="color:#C0392B">Mastercard — <b>direct exposure</b></div>'+
      node('⚖️','Interchange litigation')+arr+
      node('🏢','<b>Mastercard Inc.</b> — single class of stock, <b>no escrow shield</b>','#C0392B')+arr+
      node('👤','<b>Shareholders bear it directly</b>','#C0392B')+
      '<div class="lsv-cap">Recognized as <b>litigation provisions</b> on Mastercard\'s own income statement when probable.</div><div class="lsv-more">How this works ›</div></div>';
  var v='<div class="lsv-col ov-clickable" data-detail="litflow:visa"><div class="lsv-h" style="color:var(--mu)">Visa — <b>escrow-shielded</b></div>'+
      node('⚖️','Interchange litigation')+arr+
      node('🛡️','<b>Class-B shares / litigation escrow</b> intercepts US "covered litigation"','#5B6B7B')+arr+
      node('🏦','Former <b>member banks</b> absorb it')+arr+
      node('👤','Shareholders <b>insulated</b>')+
      '<div class="lsv-cap">US "covered litigation" is <b>quarantined off</b> the public P&L via the Class-B mechanism.</div><div class="lsv-more">How this works ›</div></div>';
  return '<div class="lsv-wrap">'+ma+v+'</div>'+
    '<div class="ov-fynote" style="margin-top:10px">Same lawsuits, different plumbing: Visa <b>diverts</b> much of its US interchange exposure onto former member banks through a share/escrow structure created at its 2008 IPO; Mastercard\'s cleaner single-class structure means the risk lands <b>directly on the P&L and the shareholder</b>. Manageable so far — but a more direct risk to model.</div>';
}
function ddRiskBody(c){
  var h='<style>'+
    '.lit-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:720px){.lit-grid{grid-template-columns:1fr}}'+
    '.lit-card{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w)}'+
    '.lit-head{display:flex;align-items:center;gap:8px;margin-bottom:8px}'+
    '.lit-flag{flex:none;border-radius:3px;box-shadow:0 0 0 1px rgba(0,0,0,.10)}.lit-juris{font-size:13px;font-weight:800;color:var(--navy)}'+
    '.lit-tag{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border:1px solid;border-radius:8px;padding:1px 7px;margin-left:auto}'+
    '.lit-headline{font-size:12px;color:var(--navy);line-height:1.5;margin-bottom:9px}'+
    '.lit-row{display:flex;gap:9px;margin:5px 0;font-size:11px;line-height:1.5}'+
    '.lit-k{flex:none;width:72px;font-weight:800;color:var(--mu);text-transform:uppercase;font-size:9px;letter-spacing:.3px;padding-top:2px}'+
    '.lit-v{color:var(--navy)}'+
    '.lit-badge{display:inline-block;margin-top:9px;font-size:10px;font-weight:800;border-radius:9px;padding:2px 10px}'+
    '.lsv-wrap{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:6px 0 2px}@media(max-width:720px){.lsv-wrap{grid-template-columns:1fr}}'+
    '.lsv-col{border:1px solid var(--bdr);border-radius:12px;padding:14px 14px 12px;background:var(--w)}'+
    '.lsv-h{font-size:12.5px;font-weight:800;text-align:center;margin-bottom:10px}'+
    '.lsv-node{display:flex;align-items:center;gap:9px;border:1px solid var(--bdr);border-radius:9px;padding:9px 11px;font-size:11.5px;color:var(--navy);line-height:1.35;background:#FBFCFD}'+
    '.lsv-ic{font-size:16px;flex:none}.lsv-arr{text-align:center;color:var(--mu);font-size:14px;line-height:1;margin:3px 0}'+
    '.lsv-cap{font-size:10.5px;color:var(--mu);margin-top:9px;line-height:1.5}'+
    '.lsv-col.ov-clickable{cursor:pointer;transition:box-shadow .15s,border-color .15s}.lsv-col.ov-clickable:hover{border-color:'+MA_RED+';box-shadow:0 2px 10px rgba(207,10,44,.08)}'+
    '.lsv-more{margin-top:10px;font-size:11px;font-weight:800;color:'+MA_RED+';text-align:right}</style>';
  h+='<p class="ov-lede">The bull/bear forces and disintermediation threats live in <b>Top Line ▸ Industry Analysis</b>. This tab covers the one risk <b>structurally specific to Mastercard</b>: how it bears decades of interchange antitrust litigation — and why that lands differently than at Visa.</p>';
  h+='<p class="ov-lede" style="margin-bottom:14px">'+LIT_INTRO+'</p>';
  h+=sec('Interchange litigation — by jurisdiction', litFlagCards());
  h+=sec('Who absorbs the hit — Mastercard vs Visa', litShieldVisual());
  h+='<div class="ov-foot">Sources: Mastercard 10-K legal proceedings; UK Competition Appeal Tribunal (Merricks); reporting on MDL 1720 (2024 revised settlement, rejected by merchants); EU interchange regulation.</div>';
  return h;
}
// ── Valuation ▸ Multiples — how the listed peers trade (the qualitative map is in Industry). ──
function ddMultiplesBody(c){
  var rows=[
    { tk:'MA', n:'Mastercard', mc:'~$470B', ev:'~28×', pe:'~31×', g:'+13%', self:true, read:'The #2 network — premium for a larger (~40%) services mix and cross-border tilt; bears litigation directly.' },
    { tk:'V', n:'Visa', mc:'~$640B', ev:'~24×', pe:'~27×', g:'+11%', read:'The larger network — a touch cheaper, smaller services mix (~27%), Class-B litigation shield.' },
    { tk:'AXP', n:'Amex', mc:'~$210B', ev:'n/m', pe:'~17×', g:'+9%', read:'Closed-loop (it lends) — EV/EBITDA not comparable; a premium, affluent, spend-centric model. P/E only.' },
    { tk:'PYPL', n:'PayPal', mc:'~$50B', ev:'~11×', pe:'~14×', g:'+9%', read:'A wallet / A2A player on a different rail; much cheaper on slower growth and a more contested moat.' },
  ];
  var h='<p class="ov-lede">How the <b>listed</b> peers trade. Mastercard and Visa are the twin premium "toll roads"; Mastercard carries a slight premium to Visa for its larger services mix and cross-border tilt. Amex (closed-loop, lends) is comparable only on P/E; PayPal is a cheaper, different-rail name.</p>';
  h+='<div class="ov-chart-card" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="color:var(--mu)"><th style="text-align:left;padding:7px 10px">Company</th><th style="text-align:right;padding:7px 10px">Mkt cap</th><th style="text-align:right;padding:7px 10px">EV/EBITDA <span style="font-weight:600">(fwd)</span></th><th style="text-align:right;padding:7px 10px">P/E <span style="font-weight:600">(fwd)</span></th><th style="text-align:right;padding:7px 10px">Rev growth</th><th style="text-align:left;padding:7px 10px">The read</th></tr></thead><tbody>'+
    rows.map(function(p){ var bg=p.self?'background:rgba(207,10,44,0.05);':''; return '<tr style="border-top:1px solid var(--bdr);'+bg+'"><td style="padding:8px 10px;font-weight:'+(p.self?'800':'700')+'">'+esc(p.n)+' <span class="muted" style="font-weight:600">'+esc(p.tk)+'</span></td><td style="text-align:right;padding:8px 10px">'+esc(p.mc)+'</td><td style="text-align:right;padding:8px 10px">'+esc(p.ev)+'</td><td style="text-align:right;padding:8px 10px">'+esc(p.pe)+'</td><td style="text-align:right;padding:8px 10px">'+esc(p.g)+'</td><td style="padding:8px 10px;color:var(--mu);font-size:11px;line-height:1.45">'+esc(p.read)+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  h+=sec('Reading the table', '<div class="ov-callout">'+bullets([
    '<b>Amex shows P/E only — its "n/m" on EV/EBITDA is deliberate, not a data gap.</b> Amex is a <b>lender</b>: interest income is a <i>core operating</i> line and its own borrowings fund a card-loan book. EV/EBITDA is built to strip out interest and net out debt — useful for an asset-light toll road, but for a lender it removes the actual business and treats its funding as if it were free. That is why banks and card-lenders are valued on <b>P/E</b> (or book value), and why only Amex\'s P/E sits alongside the networks here.',
    '<b>UnionPay & state-linked A2A rails aren\'t shown</b> — they\'re unlisted, so there is no market price or multiple to quote. They\'re compared qualitatively on the map in <b>Top Line ▸ Industry Analysis</b>.',
    '<b>Live market caps</b> and the add / remove-peer comparison live on the interactive scatter in the <b>Overview</b> tab (Massive feed).'])+'</div>');
  h+='<div class="ov-foot">Multiples ~Jul 2026, forward where available (web-sourced, directional); growth is latest reported YoY. Market caps live via Massive on the Overview scatter.</div>';
  return h;
}
// ════════════════════════════════════════════════════════════════════════════
//  Evolution ▸ Guidance — SAME format as UBER/LYFT/CART: metric toggle → quarterly
//  guided-range (floating bar) vs delivered (dot, colored by landing) + landing
//  table. Mastercard guides NET-REVENUE growth and OPERATING-EXPENSE growth (both
//  currency-neutral, ex-acquisitions); it does NOT guide EPS. Bands are indicative
//  mappings of MA's qualitative language ("low-teens" → 12–14%); delivered = reported
//  cn ex-acq growth. Sourced from the quarterly calls (Q4-23 → Q1-26 provided). ──
var MA_GQ=['Q1 24','Q2 24','Q3 24','Q4 24','Q1 25','Q2 25','Q3 25','Q4 25','Q1 26','Q2 26'];
var MA_GUIDE={
  netrev:{ label:'Net-revenue growth', axis:'net-revenue growth (cn, ex-acq)',
    glo:[10,11,12,12,12,12,12,12,10,10], ghi:[12,13,13,13,14,14,14,13,11,11],
    words:['low double-digits','low double-digits','high end low-dd','low double-digits (FY: low-teens)','low-teens','low-teens','high end low-dd','high end low-dd','low end low-dd','low end low-dd (ME conflict)'],
    act:[11,13,14,16,14,13,15,15,12,null],
    note:'The engine Mastercard keeps clearing: delivered net-revenue growth has landed <b>in the upper half of — or above — the guided band nearly every quarter</b>. The one deliberate step-<i>down</i> is the front of 2026: Q1 guided "low end of low-double-digits" (still beaten at +12%), and Q2-26 guided the same on the <b>Middle East conflict</b> hitting cross-border travel (no actual yet).' },
  opex:{ label:'Operating-expense growth', axis:'operating-expense growth (cn, ex-acq)',
    glo:[9,9,10,10,10,10,10,10,8,9], ghi:[11,11,12,12,12,12,12,12,10,11],
    act:[9,10,10,11,11,10,10,10,9,null],
    words:['low double-digits','low double-digits','low double-digits','low double-digits','low double-digits','low double-digits','low double-digits','low double-digits','high-single-digit','low double-digits'],
    note:'The other half of the algorithm. Mastercard guides opex growth <b>ex-acquisitions</b> and generally lands <b>inside</b> the band — spending to a plan while it invests in the secular opportunity and services. Acquisitions (Recorded Future, Minna) are called out separately and add a few points to <i>reported</i> opex on top of this.' },
};
var _maGuideMetric='netrev';
function maGuidePct(v){ return v==null?'—':(v>0?'+':'')+v+'%'; }
function maGuideColor(a,lo,hi){ if(a==null) return MA_STEEL; if(a>=hi) return MA_GREEN; if(a>=(lo+hi)/2) return MA_RED; if(a>=lo-0.4) return MA_RED; return '#C0392B'; }
function maGuideLand(a,lo,hi){ if(a==null) return { t:'current guide', c:'guid-mut' }; var mid=(lo+hi)/2;
  if(a>=hi) return { t:'above range', c:'guid-up' }; if(a>=mid) return { t:'upper half', c:'' }; if(a>=lo-0.4) return { t:'in range', c:'' }; return { t:'below range', c:'guid-dn' }; }
function maGuideBody(c){
  var h='<p class="ov-lede">Mastercard <b>does not guide EPS</b>. Each quarter it guides two things — <b>net-revenue growth</b> and <b>operating-expense growth</b>, both <b>currency-neutral and ex-acquisitions</b>. Switch metric, then read the <b>guided band vs what it delivered</b> (the dot); green = above the range. Bands are indicative mappings of Mastercard’s qualitative language ("low-teens" → ~12–14%).</p>';
  h+='<div class="guid-pills">'+['netrev','opex'].map(function(k){ return '<button type="button" class="guid-pill'+(k===_maGuideMetric?' active':'')+'" data-maguidm="'+k+'">'+esc(MA_GUIDE[k].label)+'</button>'; }).join('')+'</div>';
  h+='<div id="maGuideLeg" style="margin-bottom:6px"></div>';
  h+='<div class="ov-chart-card"><div class="ov-chart-t" id="maGuideT"></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="maGuideChart"></canvas></div></div>';
  h+='<div class="ov-fynote" id="maGuideNote" style="margin-top:8px"></div>';
  h+='<div class="guid-tbl-wrap" style="margin-top:12px"><div id="maGuideTbl"></div></div>';
  h+='<div class="ov-foot">Sources: Mastercard quarterly earnings calls & releases (Q4 2023 – Q1 2026, transcripts). Mastercard guides qualitatively ("low-teens", "low-double-digits"); the bands here are an <b>indicative</b> numeric mapping and the delivered dots are reported currency-neutral, ex-acquisition growth — directional, not to the decimal. Q2-26 shows the current guide (no actual yet). Interim-2025 quarters use MA’s reported trajectory pending their transcripts.</div>';
  return h;
}
function maGuideLegend(){
  var s='display:inline-flex;align-items:center;gap:7px;margin:0 18px 6px 0;font-size:12px;font-weight:600;color:var(--mu)';
  return '<span style="'+s+'"><span style="width:16px;height:11px;border-radius:3px;background:rgba(122,134,153,0.16);border:1px solid rgba(122,134,153,0.45);flex:none"></span>Guided range</span>'+
    '<span style="'+s+'"><span style="width:11px;height:11px;border-radius:50%;background:'+MA_RED+';flex:none"></span>Delivered (cn, ex-acq)</span>'+
    '<span style="'+s+'"><span style="width:11px;height:11px;border-radius:50%;background:'+MA_GREEN+';flex:none"></span>Above the range</span>';
}
function buildMaGuideChart(){
  var cv=document.getElementById('maGuideChart'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var ex=Chart.getChart?Chart.getChart(cv):null; if(ex) ex.destroy();
  var g=MA_GUIDE[_maGuideMetric];
  new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:MA_GQ, datasets:[
    { type:'bar', label:'Guided range', order:3, maxBarThickness:30, borderSkipped:false, borderRadius:3, borderWidth:1,
      data:g.glo.map(function(lo,i){ return (lo==null||g.ghi[i]==null)?null:[lo,g.ghi[i]]; }),
      backgroundColor:'rgba(122,134,153,0.16)', borderColor:'rgba(122,134,153,0.45)' },
    { type:'line', label:'Delivered', data:g.act, borderColor:MA_RED, borderWidth:2, tension:0, spanGaps:false, fill:false, order:1,
      pointRadius:g.act.map(function(v){ return v==null?0:5; }),
      pointBackgroundColor:g.act.map(function(v,i){ return maGuideColor(v,g.glo[i],g.ghi[i]); }),
      pointBorderColor:'#fff', pointBorderWidth:1.5 } ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      layout:{ padding:{ top:14, bottom:2 } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:function(ctx){ var i=ctx.dataIndex, dl=ctx.dataset.label;
        if(dl==='Guided range'){ if(g.glo[i]==null) return 'Not guided'; return 'Guided: '+g.glo[i]+'–'+g.ghi[i]+'% ('+g.words[i]+')'; }
        if(dl==='Delivered'){ return g.act[i]==null?'Delivered: pending':'Delivered: +'+g.act[i]+'%'; } return null; } } } },
      scales:{ y:{ grace:'10%', grid:{color:'#EEF2F7'}, ticks:{ color:C_AXIS, font:{size:10}, callback:function(v){ return v+'%'; } }, title:{display:true,text:g.axis,font:{size:10},color:C_AXIS} },
        x:{ grid:{display:false}, ticks:{ color:C_AXIS, font:{size:10.5} } } } }
  });
}
function renderMaGuideTable(){
  var box=document.getElementById('maGuideTbl'); if(!box) return; var g=MA_GUIDE[_maGuideMetric];
  var rows=MA_GQ.map(function(q,i){ var lo=g.glo[i], hi=g.ghi[i], a=g.act[i], land=maGuideLand(a,lo,hi);
    var range=(lo==null)?'<span class="guid-mut">not guided</span>':lo+'–'+hi+'% <span class="guid-mut">('+esc(g.words[i])+')</span>';
    var rep=(a==null)?'<span class="guid-mut">pending</span>':'<b>+'+a+'%</b>';
    return '<tr><td>'+esc(q)+'</td><td>'+range+'</td><td>'+rep+'</td><td class="'+land.c+'">'+land.t+'</td></tr>'; }).join('');
  box.innerHTML='<table class="guid-tbl"><thead><tr><th>Quarter</th><th>Guided (cn, ex-acq)</th><th>Delivered</th><th>Landing</th></tr></thead><tbody>'+rows+'</tbody></table>';
}
function renderMaGuide(){
  var leg=document.getElementById('maGuideLeg'); if(leg) leg.innerHTML=maGuideLegend();
  var t=document.getElementById('maGuideT'); if(t) t.innerHTML=esc(MA_GUIDE[_maGuideMetric].label)+' — guided range vs delivered <span>· per quarter · cn, ex-acq · Q2-26 = current guide</span>';
  var note=document.getElementById('maGuideNote'); if(note) note.innerHTML=MA_GUIDE[_maGuideMetric].note;
  buildMaGuideChart(); renderMaGuideTable();
}
function switchMaGuideMetric(root,k){ if(!MA_GUIDE[k]) return; _maGuideMetric=k;
  root.querySelectorAll('.guid-pill[data-maguidm]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-maguidm')===k); });
  renderMaGuide(); }

// ════════════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════════════
//  Evolution ▸ CALL PREP — the decision layer (docs/CALL_PREP_CONVENTIONS.md v2.4)
//  Ported from googl.js / ibkr.js (canonical) via the Visa build. Four phases —
//  Setup · Watch List · Post-Results · Post-Call — as per-quarter blocks behind a
//  quarter selector. The theme record (MA_THEMES) is FOLDED into the Watch List
//  (v2.3 fusion) — there is NO standalone Earnings Calls tab. Consensus (Bloomberg
//  BST) + Summit + the 4 custom KPIs render 'to fill'/'to define' until the export
//  lands. Mastercard reports on a calendar year.
// ════════════════════════════════════════════════════════════════════════════
// Call Prep palette (Mastercard identity): red primary + orange custom-KPI accent.
var BRAND=MA_RED, BRAND2=MA_GREEN, BLUE='#2557D6', RED='#EA4335', YELLOW=MA_ORANGE, PURPLE='#7A5AF8', AMBER='#B7791F', GRAY='#6B7684';
var CALL_PREP = { ticker:'MA', quarters:[
  // ── UPCOMING: Q2 2026 (quarter ending Jun 2026; reports ~late Jul 2026) ──
  { q:'Q2 2026', status:'upcoming', date:'reports ~late July 2026',
    setup:{ source:'Bloomberg BST consensus — to import from the export', asOf:null,
      headline:[
        {k:'Net revenue', cons:null, us:null, note:{t:'Guided low end of low-double-digits (cc)',h:'Management guided Q2 net-revenue growth to the <b>low end of a low-double-digits</b> range (cc, ex-inorganic) — the Middle-East conflict is the reason; without it, Q2 would have been "generally in line with Q1." A ~1–2 PPT FX tailwind on the nominal number. Street/Summit fill from the Bloomberg export.'}},
        {k:'Operating income', cons:null, us:null},
        {k:'EPS', cons:null, us:null, note:{t:'OI&E steps up in Q2',h:'Q2 OI&E expense guided to ~$150M (vs a Q1 aided by one-time items + government grants that do not repeat), plus lower cash / higher debt from the accelerated buyback and a one-time disposition drag. Tax rate 20–21%.'}},
        {k:'EBITDA', cons:null, us:null},
      ],
      custom:[ {k:null},{k:null},{k:null},{k:null} ], // 4 custom KPIs — to define with Dani (candidates: GDV · cross-border volume · switched transactions · VAS revenue)
      marketDebate:{
        fear:'That the Q2 guide-down is not just the war — that cross-border travel (8%→2% into April) and switched-transaction growth (9%) mark a real deceleration, and the "conflict ends in Q2" base case is a hope the print can\'t back.',
        real:'Consensus reads the cut as almost entirely the conflict (GCC+Israel ≈ 6% of cross-border), with the FY currency-neutral guide UNCHANGED (the raise is FX) and VAS ~40% of revenue still compounding high-teens — i.e. a Q2 trough by assumption, recovering H2 as guided.',
        mech:[ {k:'Middle-East conflict',v:'largest drag in Q2',dir:'down'}, {k:'Cross-border travel',v:'8%→2% into April',dir:'down'}, {k:'FX (nominal)',v:'+1–2 PPT tailwind',dir:'up'}, {k:'VAS ~40% of rev',v:'high-teens, steady',dir:'up'} ],
        synth:'The one thing to resolve: is the guided Q2 trough <b>the war and only the war</b> (recovering progressively H2 as management assumes) — or is some of it <b>structural</b> (switched-transaction mix, cross-border normalization) that outlasts a ceasefire?'
      },
      debate:null },
    watchList:[
      { rank:1, metric:'Middle-East conflict vs the "ends in Q2" base case', since:'Q1 2026', tags:['cross-border','travel','geopolitics'],
        pista:'Does cross-border travel recover progressively through H2 as guided — or does the conflict persist and break the central assumption behind the Q2/FY guide?',
        breaks:'The conflict extends past Q2 and cross-border travel stays depressed, invalidating the guide\'s core assumption.',
        seededBy:{ q:'Q1 2026', n:'Sachin explicitly built guidance on the conflict ENDING in Q2 and refused (to Adam Frisch) to model any alternative scenario; sized GCC+Israel at ~6% of cross-border volume.' },
        src:'Q1 2026: cross-border travel growth fell from 8% (Q1) to 2% (first 4 weeks of April) on conflict + portfolio shifts + Ramadan/Easter timing; Q2 guided to the low end of low-double-digits.',
        why:'The entire Q2 and H2 guide is predicated on one uncontrollable assumption; if it breaks, the reset is not in numbers yet.',
        thread:[ {q:'Q4 2025',n:'Consumer healthy; no conflict in the guide; FY26 set at high-end of low-double-digits cc.'},{q:'Q1 2026',n:'Conflict from late Feb; Q2 cut; "ends in Q2" assumed; ~6% of cross-border exposed.'} ] },
      { rank:2, metric:'BVNK / stablecoin economics', since:'Q1 2026', tags:['stablecoin','bvnk','new-flows'],
        pista:'First real disclosure — take rate, volume, or margin — on stablecoin infrastructure vs the current "basis points on volume, accretive" framing; plus the deal close.',
        breaks:'The disclosed bps economics prove immaterial or dilutive vs card/network economics.',
        seededBy:{ q:'Q1 2026', n:'Matt O\'Neill pushed on stablecoin economics; Sachin said BVNK\'s model is "basis points on volume" in "an addressable market we don\'t participate in today" — accretive, but no numbers.' },
        src:'Q1 2026: planned BVNK acquisition (interoperability/licensing/compliance layer for send/receive/convert/hold stablecoins); use cases payouts, remittances, me-to-me, B2B cross-border.',
        why:'This is the strategic pivot from crypto co-brands (card economics) into owning stablecoin infrastructure — the size of the accretion is unproven.',
        thread:[ {q:'Q4 2025',n:'Stablecoins framed as "another currency" on the network; MetaMask/Gemini co-brands; Ripple settlement.'},{q:'Q1 2026',n:'BVNK announced; economics = bps on volume; CLARITY Act "doesn\'t hold us back."'} ] },
      { rank:3, metric:'Switched-transaction growth trajectory', since:'Q1 2026', tags:['switched-transactions','mix'],
        pista:'Does ex-Capital-One switched growth re-accelerate above ~10% as geographic/ticket mix normalizes, or keep drifting down from the historical low-teens?',
        breaks:'Switched-transaction growth decelerates further, signaling a structural mix drag rather than a Cap-One/timing effect.',
        seededBy:{ q:'Q1 2026', n:'Harshita Rawat pushed on switched growth decelerating to 9% (10% ex-Cap One) vs historical low-double/low-teens; Sachin attributed it to geographic/average-ticket mix (Russia exit, adding Japan/Mexico).' },
        src:'Q1 2026: switched transactions +9% (+10% ex-Capital One debit migration); >70% of Mastercard transactions now switched (vs 60% in 2020).',
        why:'Switched transactions are the data engine that feeds VAS — a persistent decel would quietly cap the whole virtuous-cycle algorithm.',
        thread:[ {q:'Q4 2025',n:'Switched +10%; contactless 77%; Cap One debit migration a drag.'},{q:'Q1 2026',n:'Switched +9% (+10% ex-Cap One); mix explanation; migration "basically complete."'} ] },
      { rank:4, metric:'VAS durability at ~40% of revenue', since:'Q1 2026', tags:['vas','services'],
        pista:'Does organic VAS hold high-teens as Recorded Future laps, and how much stays network-linked (~60%)?',
        breaks:'Organic VAS decelerates below mid-teens with no offsetting network acceleration.',
        seededBy:{ q:'Q1 2026', n:'Jason Kupferberg clarified the 18% VAS growth was organic (Recorded Future lapped); the durability of the ~40%-of-revenue engine is the standing question.' },
        src:'Q1 2026: VAS +18% cc (no acquisition impact); ~40% of company revenue; broad-based (security, digital/authentication, insights, consumer engagement).',
        why:'VAS is the differentiator and the multiple support — the virtuous cycle only works if it keeps compounding faster than the network.',
        thread:[ {q:'Q4 2025',n:'VAS +22% cc (+19% ex-acq); FY25 +21%/+18% ex-acq; ~60% network-linked.'},{q:'Q1 2026',n:'VAS +18% cc organic; Recorded Future/Threat Intelligence 500+ customers; Ethoca +25%.'} ] },
      { rank:5, metric:'Rebates & incentives / net revenue yield', since:'Q1 2026', tags:['incentives','pricing','renewals'],
        pista:'Do rebates & incentives as a % of payment-network assessments stay contained (guided slightly lower into Q2), keeping net revenue yield rising?',
        breaks:'Renewal competition forces R&I up as a % of assessments, compressing net yield.',
        seededBy:{ q:'Q1 2026', n:'Andrew Schmidt asked on R&I trending; Sachin guided R&I as a % of payment-network assessments slightly lower sequentially into Q2, and noted net revenue yield is rising.' },
        src:'Q1 2026: net revenue yield increasing; R&I guided slightly lower sequentially into Q2.',
        why:'R&I is the contra-revenue competitive renewals drive — the tell on whether Mastercard is buying volume or being paid for value.',
        thread:[ {q:'Q4 2025',n:'R&I flat-to-slightly-down sequentially; disciplined "win the right deals."'},{q:'Q1 2026',n:'R&I guided slightly lower into Q2; net yield rising.'} ] },
    ],
    results:null, call:null },

  // ── REPORTED: Q1 2026 (quarter ended Mar 2026; reported Apr 30 2026) ──
  { q:'Q1 2026', status:'reported', date:'April 30, 2026',
    setup:{ source:'Bloomberg BST consensus (archived) — precise figures to backfill',
      pricedIn:'A solid start to 2026: net revenue low-double-digits cc, GDV ~7%, cross-border healthy, VAS high-teens. FX volatility a swing factor; the open question was how much the newly-erupted Middle-East conflict would dent cross-border travel.',
      oneLiner:'The bar was "steady network + strong VAS, watch cross-border travel and the war" — Mastercard cleared the print but cut the Q2 guide on the conflict, betting it ends in Q2.' },
    watchList:[
      { rank:1, metric:'VAS durability (can high-teens hold as acq laps?)', since:'Q4 2025', tags:['vas'],
        pista:'Does organic VAS hold high-teens once Recorded Future is lapped?', breaks:'Organic VAS decelerates below mid-teens.',
        seededBy:{ q:'Q4 2025', n:'Q4 VAS was +22% cc but +19% ex-acq; the question into Q1 was the clean organic rate as acquisitions lap.' },
        src:'Q4 2025: VAS +22% cc (+19% ex-acq); FY25 +21%/+18% ex-acq.', why:'The engine and the multiple support.' },
      { rank:2, metric:'Consumer / cross-border resilience', since:'Q4 2025', tags:['cross-border','consumer','travel'],
        pista:'Does the healthy consumer + cross-border hold into 2026?', breaks:'Cross-border volume growth slips below low-double-digits cc or the consumer softens.',
        seededBy:{ q:'Q4 2025', n:'Q4 framed a "savvy, intentional" but healthy consumer; the standing question was whether it holds through 2026 macro/geopolitics.' },
        src:'Q4 2025: cross-border +14%; consumer spend healthy and unchanged QoQ.', why:'The demand pulse and the highest-yield line.' },
      { rank:3, metric:'Switched-transaction growth off the Cap-One drag', since:'Q4 2025', tags:['switched-transactions'],
        pista:'Does switched growth re-accelerate as the Capital One debit migration completes?', breaks:'Switched growth stays depressed after the migration laps.',
        seededBy:{ q:'Q4 2025', n:'Q4 switched +10% with the Cap-One debit migration a drag; the question was the underlying rate once it completes.' },
        src:'Q4 2025: switched transactions +10%; Cap-One debit migration ongoing.', why:'The data engine feeding VAS.' },
      { rank:4, metric:'Capital One credit volume retention', since:'Q4 2025', tags:['capital-one','renewals'],
        pista:'How much Capital One credit volume actually stays given its Discover ownership?', breaks:'Cap-One credit volume migrates away despite the renewal.',
        seededBy:{ q:'Q4 2025', n:'Q4 announced the Cap-One CREDIT renewal (+ new accounts); Will Nance pushed on how much volume stays given Cap-One owns Discover — management wouldn\'t quantify.' },
        src:'Q4 2025: Capital One credit portfolio renewed; network for a large portion of newly acquired credit accounts.', why:'A known overhang the renewal partly flips.' },
      { rank:5, metric:'FY26 guide shape (H1<H2 on FX comps)', since:'Q4 2025', tags:['guidance','fx'],
        pista:'Does the H1<H2 cadence play out as the FX-volatility comps normalize?', breaks:'H1 undershoots even the FX-comp-adjusted framing.',
        seededBy:{ q:'Q4 2025', n:'Q4 set FY26 at the high end of low-double-digits cc, with H1 lower than H2 on tougher FX-volatility comps; the question was whether the shape holds.' },
        src:'Q4 2025: FY26 net revenue guide high-end of low-double-digits cc; H1<H2 on FX-volatility comps.', why:'The shape drives the quarterly setups all year.' },
    ],
    results:{
      headline:'A solid print undercut by a conflict-driven guide-down: net revenue +12% cc, net income +15%, EPS +18% to $4.60 — but Q2 was cut to the low end of low-double-digits on the Middle-East conflict, with management assuming it ENDS in Q2 (FY cc guide unchanged; the raise is FX).',
      thesisCheck:[
        {line:'VAS holds high-teens organically', tripped:false, note:'VAS +18% cc with no acquisition impact — held.'},
        {line:'Consumer / cross-border resilient', tripped:false, note:'Cross-border +13%; CNP ex-travel +18%; consumer healthy — held, but travel dented by the conflict (watch).'},
        {line:'Switched growth re-accelerates off Cap-One', tripped:true, note:'⚑ Switched +9% (+10% ex-Cap-One) — decelerated vs history on geographic/ticket mix; did not re-accelerate.'},
        {line:'Capital One credit volume retained', tripped:false, note:'Migration "basically complete"; management reaffirmed the value but wouldn\'t quantify retained volume — held, unproven.'},
        {line:'FY26 H1<H2 shape intact', tripped:false, note:'Reaffirmed; conflict makes Q2 the trough, recovering H2 — held on the assumption the war ends in Q2.'},
      ],
      scorecard:[
        {metric:'Q2 net-revenue guide (conflict cut)', cons:null, actual:'low end of low-double-digits (cc)', result:'nocons', surprise:75, watchRank:null, note:{t:'The real news in the print',h:'Cut on the Middle-East conflict; without it, Q2 "would have been generally in line with Q1." Assumes the conflict ends in Q2. FY currency-neutral guide unchanged.'}},
        {metric:'Cross-border travel (April run-rate)', cons:null, actual:'~2% (from 8% in Q1)', result:'miss', surprise:65, watchRank:2, note:{t:'The conflict, made visible',h:'Sachin ranked the drivers: (1) conflict, (2) portfolio shifts, (3) Ramadan/Easter timing. GCC+Israel ≈ 6% of cross-border volume.'}},
        {metric:'EPS', cons:null, actual:'$4.60 (+18%)', result:'beat', surprise:55, watchRank:null, note:{t:'Aided by discrete tax + buyback',h:'+18% on strong operating income, a lower Q1 tax rate (discrete SBC benefits), and a $0.10 buyback contribution.'}},
        {metric:'Switched transactions', cons:null, actual:'+9% (+10% ex-Cap One)', result:'miss', surprise:50, watchRank:3, note:{t:'The soft metric',h:'Decelerated vs historical low-double/low-teens; Sachin: geographic + average-ticket mix (Russia exit; adding Japan/Mexico switching), not demand.'}},
        {metric:'Value-added services revenue', cons:null, actual:'+18% cc (organic)', result:'beat', surprise:40, watchRank:4, note:{t:'~40% of revenue',h:'No acquisition impact (Recorded Future lapped); broad-based across security, digital/authentication, insights, engagement.'}},
        {metric:'Net income', cons:null, actual:'+15%', result:'beat', surprise:40, watchRank:null},
        {metric:'Cross-border volume', cons:null, actual:'+13%', result:'inline', surprise:25, watchRank:2, note:{t:'CNP ex-travel +18%',h:'Overall cross-border healthy; the weakness is specifically travel from the conflict.'}},
        {metric:'Net revenue', cons:null, actual:'+12% cc', result:'inline', surprise:25, watchRank:null},
        {metric:'Worldwide GDV', cons:null, actual:'+7%', result:'inline', surprise:15, watchRank:null},
      ],
      intoCall:[
        'What happens to the guide if the Middle-East conflict does NOT end in Q2?',
        'What are the real economics (take rate) of BVNK / stablecoin infrastructure?',
        'Is the switched-transaction decel to 9% mix (transitory) or structural?',
      ],
      priceReaction:'to fill from a trusted source' },
    call:{
      take:'A solid print whose <b>forward setup is one big assumption</b>: management cut Q2 to the low end of low-double-digits on the Middle-East conflict and built the whole H2 recovery on the conflict <b>ending in Q2</b> — while refusing to model any other scenario. Underneath, VAS (~40% of revenue, +18% cc organic) is doing the work and BVNK signals a real stablecoin-infrastructure pivot; the wobble is switched-transaction growth at 9%.',
      highlights:[
        { tag:'watch', band:'lead', head:'The Q2 and H2 guide rests entirely on the Middle-East conflict <b>ending in Q2</b>.',
          open:'What if it doesn\'t? Sachin explicitly refused (to Adam Frisch) to model alternative scenarios — so there is no downside case on the table, only the base case.',
          detail:'<p>Cross-border travel growth fell from <b>8% (Q1) to 2%</b> in the first four weeks of April on (1) the conflict, (2) portfolio shifts, (3) Ramadan/Easter timing. Sachin sized the exposure: <b>GCC + Israel ≈ 6% of cross-border volume</b> (inbound + outbound). The FY currency-neutral guide is <b>unchanged</b> — the nominal raise is FX.</p><p>The tell: management assumes the conflict is <b>largest in Q2, then progressively recovers through H2</b>. That is a hope, not a datapoint — and it is the single load-bearing assumption in the guide.</p>' },
        { tag:'curious', band:'lead', head:'BVNK: Mastercard is buying its way into <b>stablecoin infrastructure</b>, not just co-brands.',
          open:'What is the actual take rate / margin vs card economics? Sachin said "basis points on volume" in "an addressable market we don\'t participate in today" — accretive, but unquantified.',
          detail:'<p>Michael framed stablecoins and tokenized deposits as "here to stay" and a "meaningful part of money movement." BVNK brings the <b>interoperability, licensing, and compliance layer</b> (send / receive / convert / hold) plus hard-to-get licenses, targeting payouts, remittances, me-to-me and B2B cross-border.</p><p>Sachin on economics: revenue model is <b>bps on volume</b> in a market Mastercard doesn\'t touch today — hence accretive. CLARITY Act "doesn\'t hold us back." This is the strategic pivot from crypto co-brands (card economics) to owning the rails — with the accretion size still unproven.</p>' },
        { tag:'thesis', band:'context', head:'Switched transactions at <b>9% (+10% ex-Cap One)</b> — mix, not weakness (per management).',
          detail:'<p>Harshita Rawat pushed on the decel vs historical low-double/low-teens. Sachin: driven by geographic + average-ticket <b>mix</b> (Russia exit removed a high-volume low-ticket market; adding Japan/Mexico switching). >70% of transactions now switched (vs 60% in 2020). Settled explanation — but the metric to keep honest.</p>' },
        { tag:'thesis', band:'context', head:'VAS ~40% of revenue, <b>+18% cc organic</b>, broad-based.',
          detail:'<p>No acquisition impact (Recorded Future lapped). Security (Threat Intelligence 500+ customers), Ethoca +25%, consulting/marketing flywheel (≈¾ of 2024 customers returned, +20% usage). The differentiator and the multiple support.</p>' },
        { tag:'thesis', band:'context', head:'Accelerated buyback — <b>$4B in Q1 + $1.7B</b> through April 27 "given current valuation levels."',
          detail:'<p>Sachin: buybacks accelerated on valuation and conviction; a $0.10 EPS contribution. Confirms the capital-return leg — settled.</p>' },
        { tag:'watch', band:'logged', head:'Agentic: Agent Pay now on nearly all Mastercards; Verifiable Intent a <b>FIDO standard</b>; OpenAI deepened.',
          detail:'<p>Tien-Tsin Huang asked on volumes; Michael: still early, no volumes, but the trust/standards layer (Verifiable Intent, Agent Pay, Crossmint) is being set. B2B agentic (Agent Suite) framed as the bigger, later opportunity.</p>' },
        { tag:'thesis', band:'logged', head:'Deal wins: <b>Amazon US small-business co-brand → Mastercard</b>; Westpac renewal; CIB Egypt (5M cards).',
          detail:'<p>The Amazon US SMB co-brand (issued by U.S. Bank) moves to Mastercard from another network; affluent momentum via World Legend (3x higher cross-border spend vs World Elite) and Mastercard One Credential (SoFi Smart Card).</p>' },
      ],
      dots:'The two loudest strategic stories — the <b>conflict-driven guide</b> and <b>BVNK</b> — are both bets on things management can\'t fully see: a ceasefire timeline and an unproven stablecoin take rate. Underneath, the durable engine (VAS ~40% of revenue) held and the one real wobble (switched transactions at 9%) was explained as mix. The print is fine; the <b>forward</b> is an assumption stack.',
      threeMinutes:[
        '<b>Solid quarter, but the Q2/H2 setup hinges on one assumption: the Middle-East conflict ends in Q2.</b> Cross-border travel already fell from 8% to 2% growth; GCC+Israel is ~6% of cross-border. Management sized it but refused to model a longer war, and the FY currency-neutral guide is unchanged (the raise is FX). The debate isn\'t the print — it\'s whether the guide\'s central assumption holds.',
        '<b>BVNK is the strategic tell: Mastercard is buying into stablecoin infrastructure, not just co-brands.</b> Economics are "bps on volume" in a market they don\'t touch today (accretive, per Sachin), aimed at payouts / remittances / B2B cross-border. Treat it as new-flows optionality and watch for the first real volume or take-rate disclosure.',
        '<b>VAS at ~40% of revenue and +18% cc organic is carrying the model</b> — security (Recorded Future), Ethoca, the consulting flywheel. The switched-transaction decel to 9% is mix (geography, average ticket), not demand — but it\'s the metric to keep honest.',
      ],
      notBringing:[
        {item:'CCCA / credit rate-cap regulatory', why:'Long-standing; "all but dead for now," no near-term resolution or direct model impact (Mastercard doesn\'t set rates).'},
        {item:'SessionM disposition', why:'Small, one-time (the loyalty-business sale); clarified on the call, not thesis-moving.'},
        {item:'Individual deal wins (Amazon SMB, Westpac)', why:'Confirm momentum but everyone has the release — not a debate.'},
      ],
      newQuestions:[
        {n:'What happens to the guide if the Middle-East conflict does not end in Q2?', landed:{q:'Q2 2026', rank:1}, tripped:false},
        {n:'What are the real economics (take rate) of BVNK / stablecoin infrastructure?', landed:{q:'Q2 2026', rank:2}},
        {n:'Is the switched-transaction decel to 9% mix (transitory) or structural?', landed:{q:'Q2 2026', rank:3}},
        {n:'Does organic VAS hold high-teens as Recorded Future laps?', landed:{q:'Q2 2026', rank:4}},
        {n:'Do rebates & incentives stay contained, keeping net yield rising?', landed:{q:'Q2 2026', rank:5}},
      ] } },

  // ── REPORTED: Q4 2025 (quarter ended Dec 2025; reported Jan 29 2026) ──
  { q:'Q4 2025', status:'reported', date:'January 29, 2026',
    setup:{ source:'Bloomberg BST consensus (archived) — precise figures to backfill',
      pricedIn:'A strong close to 2025: net revenue low-teens cc, VAS ~20%, cross-border healthy, switched double digits. The overhang was the Capital One debit loss to Discover; the open question was FY26 framing and the shape of the year.',
      oneLiner:'The bar was "finish 2025 strong and set a credible FY26" — Mastercard beat (+15% cc, VAS +22%), renewed Capital One CREDIT, and framed FY26 at the high end of low-double-digits.' },
    watchList:[
      { rank:1, metric:'VAS growth durability', since:'Q3 2025', tags:['vas'],
        pista:'Does VAS hold ~20% cc, and what is the clean organic rate ex-acquisitions?', breaks:'Organic VAS decelerates toward mid-teens.',
        src:'Q3 2025: VAS growth ~20%+ cc.', why:'The engine and the differentiator.' },
      { rank:2, metric:'Capital One debit loss / network share', since:'Q3 2025', tags:['capital-one','switched-transactions'],
        pista:'How much does the Capital One debit migration to Discover drag switched volume, and is credit at risk?', breaks:'Credit also migrates, compounding the debit loss.',
        src:'Q3 2025: Capital One debit migration to Discover underway, a switched-volume drag.', why:'The single biggest client overhang.' },
      { rank:3, metric:'Cross-border & consumer health', since:'Q3 2025', tags:['cross-border','consumer'],
        pista:'Does cross-border stay double digits and the consumer stay healthy into year-end?', breaks:'Cross-border slips below low-double-digits or consumer softens.',
        src:'Q3 2025: cross-border healthy; consumer resilient.', why:'The demand pulse.' },
      { rank:4, metric:'FY26 guide / FX-volatility comps', since:'Q3 2025', tags:['guidance','fx'],
        pista:'Where does FY26 land, and how do the 2025 FX-volatility comps shape the cadence?', breaks:'FY26 guide comes in below low-double-digits cc.',
        src:'Q3 2025: elevated FX-volatility revenue in H1 2025 flagged as a future comp.', why:'Sets the whole year\'s setup.' },
      { rank:5, metric:'Stablecoin / agentic positioning', since:'Q3 2025', tags:['stablecoin','agentic'],
        pista:'How is Mastercard positioning in stablecoins and agentic commerce as the space accelerates?', breaks:'Mastercard is left behind on standards/economics.',
        src:'Q3 2025: Agent Pay launched; stablecoin settlement expanding.', why:'The emerging-rails optionality.' },
    ],
    results:{
      headline:'A strong close to 2025: net revenue +15% cc, VAS +22% cc (+19% ex-acq), EPS $4.76 (+20%) — and, strategically, the Capital One CREDIT renewal flips a known overhang; FY26 framed at the high end of low-double-digits cc with H1<H2.',
      thesisCheck:[
        {line:'VAS holds ~20% cc', tripped:false, note:'VAS +22% cc (+19% ex-acq) — held strongly, broad-based high-teens across regions.'},
        {line:'Capital One overhang contained', tripped:false, note:'Debit still migrating, but the CREDIT renewal + new accounts flips the narrative — held/improved.'},
        {line:'Cross-border / consumer healthy', tripped:false, note:'Cross-border +14%; consumer "savvy but healthy," unchanged QoQ — held.'},
        {line:'Switched double digits', tripped:false, note:'Switched +10% despite the Cap-One debit drag — held.'},
      ],
      scorecard:[
        {metric:'Capital One credit renewal', cons:null, actual:'renewed + new-account share', result:'nocons', surprise:60, watchRank:2, note:{t:'The overhang flips',h:'After losing Cap-One debit to Discover, Mastercard renewed CREDIT and won a large portion of newly acquired credit accounts — a signal the network is valued. Management wouldn\'t quantify retained volume (Will Nance pushed).'}},
        {metric:'Net revenue', cons:null, actual:'+15% cc', result:'beat', surprise:50, watchRank:null, note:{t:'Acquisitions +1 PPT',h:'Broad-based across payment network and VAS.'}},
        {metric:'Value-added services revenue', cons:null, actual:'+22% cc (+19% ex-acq)', result:'beat', surprise:55, watchRank:1},
        {metric:'EPS', cons:null, actual:'$4.76 (+20%)', result:'beat', surprise:50, watchRank:null, note:{t:'Discrete tax + grants',h:'+20% on strong operating income, a positive discrete tax item, and government grants (opex benefit ~5.5 PPT; OI&E ~$135M).'}},
        {metric:'Q1 restructuring charge', cons:null, actual:'~$200M · ~4% of workforce', result:'nocons', surprise:50, watchRank:null, note:{t:'The strategic review',h:'One-time Q1 special item; frees capacity to reinvest in strategic priorities.'}},
        {metric:'FY26 net-revenue guide', cons:null, actual:'high end of low-double-digits (cc)', result:'nocons', surprise:45, watchRank:4, note:{t:'H1 < H2',h:'H1 lower than H2 on tougher FX-volatility comps from H1 2025.'}},
        {metric:'Cross-border volume', cons:null, actual:'+14%', result:'beat', surprise:30, watchRank:3},
        {metric:'Switched transactions', cons:null, actual:'+10%', result:'inline', surprise:20, watchRank:2},
        {metric:'Worldwide GDV', cons:null, actual:'+7%', result:'inline', surprise:15, watchRank:null},
      ],
      intoCall:[
        'How much Capital One credit volume actually stays given Discover ownership?',
        'What is the clean organic VAS rate as acquisitions lap?',
        'Does the H1<H2 FX-comp cadence hold?',
      ],
      priceReaction:'to fill from a trusted source' },
    call:{
      take:'A strong finish to 2025 (+15% cc, VAS +22%) with a strategic win underneath: the <b>Capital One CREDIT renewal</b> partly flips the debit-loss overhang. FY26 was framed at the high end of low-double-digits cc with an H1<H2 shape that is an FX-comp story, not a demand story — funded by a Q1 restructuring (~4% of staff).',
      highlights:[
        { tag:'thesis', band:'lead', head:'Capital One <b>CREDIT renewed</b> (+ new-account share) — a known overhang flips.',
          open:'How much volume actually stays? Cap-One owns Discover and has signaled moving volume there; management reaffirmed the value but wouldn\'t quantify retained share (Will Nance pushed).',
          detail:'<p>After losing Cap-One <b>debit</b> to Discover, keeping and expanding <b>credit</b> (network for a large portion of newly acquired accounts, plus continued services use) is a signal the Mastercard network is valued. The unquantified piece — how much volume stays vs migrates — is the live question.</p>' },
        { tag:'thesis', band:'context', head:'VAS <b>+22% cc (+19% ex-acq)</b>, broad-based; FY25 +21%/+18% ex-acq.',
          detail:'<p>High-teens organic across AP and the Americas and across product areas. ~60% network-linked (tokenization, fraud scores). Recorded Future / Threat Intelligence scaling.</p>' },
        { tag:'thesis', band:'context', head:'FY26 guide: <b>high end of low-double-digits cc</b>, H1<H2 on FX-volatility comps.',
          detail:'<p>The shape is a comp story: H1 2025 carried elevated FX-volatility revenue, so H1 2026 laps a tougher bar; recovery into H2 as comps normalize.</p>' },
        { tag:'thesis', band:'context', head:'Q1 restructuring <b>~$200M / ~4% of workforce</b> — the strategic review.',
          detail:'<p>One-time Q1 special item to free capacity for reinvestment in strategic priorities. Excluded from non-GAAP.</p>' },
        { tag:'watch', band:'context', head:'Government grants — a flagged one-time-ish tailwind (opex ~5.5 PPT; OI&E ~$135M).',
          detail:'<p>New multi-year government grants benefited Q4 opex and OI&E; the OI&E benefit extends multiple years, but the size is a one-time-ish tailwind to keep in mind on the run-rate.</p>' },
        { tag:'watch', band:'logged', head:'Regulatory: <b>CCCA "all but dead for now"</b>; credit rate-cap chatter (Frisch).',
          detail:'<p>Little progress on CCCA since 2023; united opposition. A separate credit rate-cap idea "only a tweet away" but Mastercard doesn\'t set rates — engaged as an "industry custodian."</p>' },
        { tag:'thesis', band:'logged', head:'Apple Card stays Mastercard (JPMorgan issuer in ~24 months); Mastercard Move +35%.',
          detail:'<p>Apple Card remains on Mastercard through the issuer transition to JPMorgan (~24 months out). Mastercard Move transaction growth exceeded 35% in Q4 and FY25; ~40% of transactions tokenized.</p>' },
      ],
      dots:'The Capital One credit renewal quietly de-risked the biggest client overhang, and VAS (+22%) kept the algorithm compounding — but the FY26 shape (H1<H2) planted an FX-comp tension that, combined with the switched-transaction mix drag, is exactly what set up the softer Q1 optics and the conflict-driven Q2 cut that followed.',
      threeMinutes:[
        '<b>Strong close to 2025 and a real strategic win: the Capital One CREDIT renewal flips a known overhang.</b> After losing Cap-One debit to Discover, keeping and expanding credit signals the network\'s value — the open question is how much volume actually stays given Discover ownership.',
        '<b>FY26 is framed high-end-of-low-double-digits cc with H1<H2 — an FX-volatility-comp story, not a demand story.</b> The Q1 ~$200M restructuring (4% of staff) funds reinvestment. Read the H1 softness as comps, not weakness.',
        '<b>VAS +22% cc (+19% ex-acq) stays the engine</b>, broad-based; Recorded Future / Threat Intelligence scaling. The government grants are a flagged one-time-ish tailwind to keep in mind on opex and OI&E.',
      ],
      notBringing:[
        {item:'Government grants', why:'Real but flagged one-time-ish; don\'t extrapolate the opex/OI&E benefit into the run-rate.'},
        {item:'CCCA', why:'"All but dead for now"; no near-term resolution.'},
        {item:'Apple Card issuer change', why:'Mastercard stays; the JPMorgan issuer move is ~24 months out — not thesis-moving.'},
      ],
      newQuestions:[
        {n:'Can VAS hold high-teens organically as Recorded Future laps?', landed:{q:'Q1 2026', rank:1}},
        {n:'Does the healthy consumer / cross-border hold into 2026?', landed:{q:'Q1 2026', rank:2}},
        {n:'Does switched growth re-accelerate as the Cap-One debit migration completes?', landed:{q:'Q1 2026', rank:3}},
        {n:'How much Capital One credit volume actually stays?', landed:{q:'Q1 2026', rank:4}},
        {n:'Does the FY26 H1<H2 FX-comp shape play out?', landed:{q:'Q1 2026', rank:5}},
      ] } },
]};

function cpUpcoming(){ return CALL_PREP.quarters.filter(function(q){ return q.status==='upcoming'; })[0]||null; }
function cpFill(x, muted){ return (x!=null && String(x).trim()!=='') ? x : '<span class="cp-empty">'+(muted||'— to fill')+'</span>'; }
var CP_POP={};
function cpReg(id, t, h){ CP_POP[id]={t:t, h:h}; return id; }
function cpQ(id, t, h){ return '<span class="cp-info ov-clickable" data-detail="cp:'+cpReg(id,t,h)+'" title="'+esc(String(t).replace(/<[^>]+>/g,''))+'">?</span>'; }
function cpStyle(){
  return '<style>.cp-note{font-size:11px;color:var(--mu);line-height:1.5;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;margin:0 0 12px}'+
    '.cp-phtabs{display:inline-flex;gap:3px;background:rgba(207,10,44,0.06);border:1px solid var(--bdr);border-radius:9px;padding:4px;margin:0 0 20px}'+
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
    '.cp-wl-addform{display:flex;flex-direction:column;gap:7px;border:1px dashed '+BRAND+';border-radius:10px;padding:12px;margin:0 0 12px;background:rgba(207,10,44,0.03)}'+
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
    '.cp-banner{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:11px;padding:13px 15px;background:linear-gradient(180deg,rgba(207,10,44,0.05),transparent);font-size:12.5px;line-height:1.6;color:var(--navy);margin:12px 0}'+
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
    '.cp-synth{border-left:4px solid var(--navy);background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:6px 0}.cp-synth b{color:#FF9F00}'+
    '.cp-why-btn{display:inline-block;font-size:10px;font-weight:800;color:'+BLUE+';cursor:pointer;margin-top:8px}'+
    '.cp-w-chips{display:flex;gap:7px;flex-wrap:wrap;margin:6px 0 0}'+
    '.cp-w-chip{font-size:10px;font-weight:700;border-radius:7px;padding:4px 9px;line-height:1.3}'+
    '.cp-w-chip.cons{background:rgba(37,87,214,0.08);border:1px solid rgba(37,87,214,0.28);color:var(--navy)}'+
    '.cp-w-chip.red{background:rgba(234,67,53,0.06);border:1px solid rgba(234,67,53,0.28);color:var(--navy)}'+
    '.cp-w-chip b{font-weight:800}'+
    '.cp-take{border-left:4px solid '+BRAND+';background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:2px 0 14px}.cp-take b{color:#FF9F00}'+
    '.cp-hl{display:flex;flex-direction:column;gap:8px}'+
    '.cp-hl-row{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--hc);border-radius:10px;padding:10px 13px;background:var(--w);cursor:pointer;transition:.12s}'+
    '.cp-hl-row:hover{box-shadow:0 3px 10px rgba(0,0,0,.08)}'+
    '.cp-hl-tag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:var(--hc);border-radius:20px;padding:3px 9px;white-space:nowrap}'+
    '.cp-hl-head{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.cp-hl-more{font-size:15px;color:var(--hc);font-weight:800}'+
    '@media(max-width:560px){.cp-hl-row{grid-template-columns:auto 1fr}.cp-hl-more{display:none}}'+
    '.cp-dots{border:1px dashed '+BRAND+';border-radius:11px;padding:12px 15px;margin-top:14px;background:rgba(207,10,44,0.03);font-size:12px;line-height:1.6;color:var(--navy)}.cp-dots b{color:'+BRAND+'}'+
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
    '.cp-sc-rk{font-size:9px;font-weight:800;color:'+BRAND+';background:rgba(207,10,44,0.10);border:1px solid rgba(207,10,44,0.3);border-radius:20px;padding:2px 8px;white-space:nowrap;text-align:center}'+
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
    '.cp-3m{border:1px solid var(--bdr);border-top:4px solid '+BRAND+';border-radius:12px;padding:15px 17px;margin:16px 0 0;background:linear-gradient(180deg,rgba(207,10,44,0.05),transparent)}'+
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
var CP_IR_URL='https://investor.mastercard.com/financials-and-sec-filings/quarterly-results/default.aspx';
var CP_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=1141391&owner=exclude';
var CP_LOGO_URL='https://assets.parqet.com/logos/symbol/MA';
var CP_SEC_SEAL='img/sec-seal.png';
function cpIRButton(){
  return '<style>'+
    '.cp-srcrow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 16px}@media(max-width:760px){.cp-srcrow{grid-template-columns:1fr}}'+
    '.cp-ir{display:flex;align-items:center;gap:20px;text-decoration:none;border-radius:18px;padding:26px 26px;min-height:120px;position:relative;overflow:hidden;'+
      'background:linear-gradient(115deg,#04060B 0%,#0A1024 60%,#04060B 100%);border:1px solid rgba(207,10,44,.4);box-shadow:0 10px 32px rgba(0,0,0,.4);transition:.18s}'+
    '.cp-ir:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,'+BRAND+','+BLUE+','+YELLOW+','+BRAND2+');height:4px;top:0}'+
    '.cp-ir:hover{transform:translateY(-2px);box-shadow:0 16px 42px rgba(207,10,44,.45);border-color:rgba(207,10,44,.85)}'+
    '.cp-ir-wm{position:absolute;right:-40px;bottom:-60px;width:230px;height:230px;object-fit:contain;opacity:.09;pointer-events:none;transition:.25s}'+
    '.cp-ir:hover .cp-ir-wm{opacity:.16;transform:scale(1.04) rotate(-2deg)}'+
    '.cp-ir-ic{width:72px;height:72px;border-radius:18px;background:transparent;display:flex;align-items:center;justify-content:center;flex:none;position:relative;z-index:1;'+
      'box-shadow:0 0 0 1px rgba(255,159,0,.35),0 0 32px rgba(207,10,44,.6)}'+
    '.cp-ir-ic img{width:52px;height:52px;object-fit:contain;display:block}'+
    '.cp-ir-body{flex:1;min-width:0;position:relative;z-index:1}'+
    '.cp-ir-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:#FF9F00;display:flex;align-items:center;gap:7px}'+
    '.cp-ir-dot{width:7px;height:7px;border-radius:50%;background:'+BRAND2+';box-shadow:0 0 0 0 rgba(22,163,74,.7);animation:cpirp 1.6s infinite}'+
    '@keyframes cpirp{0%{box-shadow:0 0 0 0 rgba(22,163,74,.6)}70%{box-shadow:0 0 0 8px rgba(22,163,74,0)}100%{box-shadow:0 0 0 0 rgba(22,163,74,0)}}'+
    '.cp-ir-t{font-size:19px;font-weight:900;color:#fff;letter-spacing:.05em;text-transform:uppercase;margin-top:4px}'+
    '.cp-ir-s{font-size:11.5px;color:#9FB0C8;font-weight:600;margin-top:3px;letter-spacing:.01em}'+
    '.cp-ir-go{font-size:13px;font-weight:900;color:#fff;background:'+BRAND+';border-radius:999px;padding:12px 22px;white-space:nowrap;flex:none;display:flex;align-items:center;gap:8px;position:relative;z-index:1;letter-spacing:.04em;transition:.14s}'+
    '.cp-ir:hover .cp-ir-go{gap:12px;box-shadow:0 4px 18px rgba(207,10,44,.6)}'+
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
    '<span class="cp-ir-ic"><img src="'+CP_LOGO_URL+'" alt="Mastercard logo" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="cp-ir-body">'+
      '<span class="cp-ir-k"><span class="cp-ir-dot"></span>THE SOURCE · EARNINGS HQ</span>'+
      '<span class="cp-ir-t" style="display:block">Mastercard Investor Relations</span>'+
      '<span class="cp-ir-s" style="display:block">Release · webcast · slides · transcripts — straight from investor.mastercard.com. Skip the search, go direct.</span>'+
    '</span>'+
    '<span class="cp-ir-go">OPEN IR <span>↗</span></span>'+
  '</a>'+
  '<a class="cp-ir edgar" href="'+CP_EDGAR_URL+'" target="_blank" rel="noopener">'+
    '<img class="cp-ir-wm" src="'+CP_SEC_SEAL+'" alt="" aria-hidden="true">'+
    '<span class="cp-ir-ic"><img src="'+CP_SEC_SEAL+'" alt="SEC seal" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="cp-ir-body">'+
      '<span class="cp-ir-k"><span class="cp-ir-dot"></span>THE RECORD · U.S. SECURITIES AND EXCHANGE COMMISSION</span>'+
      '<span class="cp-ir-t" style="display:block">Mastercard on EDGAR</span>'+
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
      b+='<div class="cp-row-cap" style="margin-top:12px">Custom KPIs — Mastercard</div>';
      b+='<div class="cp-grid4">'+cu.map(function(m,i){ return cpEvCell('cu-'+qk+'-'+i, m, true); }).join('')+'</div>';
      b+='</div>';
      b+='<div class="ave-subh-note" style="margin-top:6px">Green = YoY. <b>Street</b> = Bloomberg (BST) consensus, hardcoded from the team\'s export only. <b>Summit</b> = our own expectation (Mastercard is not in the Summit DCF universe → to fill). <b>?</b> = a number with a caveat worth knowing.</div>';
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
    (qLabel?'<span class="ov-chip" style="font-size:9.5px;background:rgba(207,10,44,0.10);color:'+BRAND+';border-radius:20px;padding:2px 9px;font-weight:800;flex:none">'+esc(qLabel)+'</span>':'')+
    (why?'<span class="cp-why-btn ov-clickable" data-detail="cp:'+why+'" style="margin:0">why'+(w.thread?' + the thread':'')+' ›</span>':'')+'</div>'+
    '<div class="cp-w-q"><span class="mic">🔎</span><span>'+cpFill(w.pista||w.question)+'</span></div>'+
    '<div class="cp-w-chips">'+
      (w.tags&&w.tags.length?w.tags.map(function(t){ return '<span class="cp-w-chip" style="background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3);color:var(--navy)">#'+esc(t)+'</span>'; }).join(''):'')+
      (w.since?'<span class="cp-w-chip" style="background:rgba(255,159,0,0.14);border:1px solid rgba(183,121,31,0.35);color:var(--navy)"><b>Tracking since:</b> '+esc(w.since)+'</span>':'')+
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
  h+=maCallsBody(c);
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

//  Evolution ▸ Earnings Calls — SAME format as UBER/LYFT/CART: narrative THREADS
//  across the last 10 calls (Q4 2023 → Q1 2026) with a By theme ⇄ By quarter toggle
//  and accordion rows. Written contemporaneously from each call's transcript. ──
var MA_THEMES=[
  { theme:'Agentic commerce — Agent Pay', st:{ k:'watch', since:'Q2 2025', last:'Q1 2026' },
    why:'The newest and fastest-moving thread: Mastercard positioning its tokens, rules and fraud stack as the trust layer for AI agents that shop and pay on your behalf.',
    updates:[
      { q:'Q1 2025', items:['Announced <b>Mastercard Agent Pay</b> — a framework to recognize, register and secure AI agents, built on agentic tokens + tokenization. Partners: <b>Microsoft, OpenAI</b>.'] },
      { q:'Q2 2025', items:['Scaling Agent Pay globally; framed the "giant e-commerce" opportunity — extending the trust of the brand to a new way for consumers to transact.'] },
      { q:'Q3 2025', items:['<b>First agentic transaction on the network.</b> US Bank + Citibank cardholders enabled; rest of US issuers in November, global rollout early 2026. Standards work with <b>OpenAI, Google, Cloudflare</b>.'] },
      { q:'Q4 2025', items:['US issuers enabled for Agent Pay; global issuer base by end of Q1 2026. Antom (Asia) card-based agentic; consulting with Lloyds, Santander.'] },
      { q:'Q1 2026', items:['<b>Nearly all Mastercards</b> now enabled for Agent Pay. Deepened <b>OpenAI</b> (agent-to-agent payments). Launched <b>Verifiable Intent</b> — now a <b>FIDO Alliance</b> standard; Crossmint / OpenClaw partnership.'] },
    ]},
  { theme:'Stablecoins & digital assets', st:{ k:'watch', since:'Q1 2024', last:'Q1 2026' },
    why:'From "another currency on the rails" to a build-out: on/off ramps, settlement, and the planned BVNK acquisition to own the fiat↔on-chain bridge.',
    updates:[
      { q:'Q4 2023', items:['<b>Multi-Token Network</b> launched; crypto co-brands (MetaMask, Crypto.com). Enable buy + spend of crypto at 150M+ acceptance locations.'] },
      { q:'Q1 2024', items:['<b>Stablecoin settlement enabled on the network</b> (Nuvei); Crypto Secure risk monitoring; card issuance with Kraken, OKX, Bybit.'] },
      { q:'Q4 2024', items:['<b>Gemini</b> business stablecoin co-brand; <b>Ripple</b> settlement; MetaMask scaling. ~130 crypto co-brand programs, volumes growing.'] },
      { q:'Q2 2025', items:['Stablecoins framed as "another currency" — Mastercard provides the on/off ramps, interoperability and trust. One Credential can include stablecoin.'] },
      { q:'Q3 2025', items:['Stablecoins embedded into <b>Mastercard Move</b> (pre-funding, disbursements). On-ramp transactions +25% YTD; ~130 crypto co-brand programs.'] },
      { q:'Q1 2026', items:['Agreed to acquire <b>BVNK</b> — on-chain↔fiat bridge, licenses and compliance tooling. OKX crypto card into Europe; settlement across 47 countries; healthy crypto co-brand spend.'] },
    ]},
  { theme:'Value-Added Services & the flywheel', st:{ k:'trend', since:'Q1 2024', last:'Q1 2026' },
    why:'The diversifier: ~40% of revenue, faster-growing and less-regulated than swipe fees — security (Recorded Future), data/AI and consulting sold on top of the rails.',
    updates:[
      { q:'Q1 2024', items:['<b>Decision Intelligence Pro</b> — gen-AI fraud scoring, +20% detection. Scam Protect; personalization (Dynamic Yield). ~1 of 3 VAS products AI-enabled.'] },
      { q:'Q3 2024', items:['Announced <b>Recorded Future</b> (threat intel) + <b>Minna</b> (subscriptions) acquisitions. VAS +19% organic.'] },
      { q:'Q4 2024', items:['<b>Mastercard Threat Intelligence</b> launched. VAS +21% FY (18% ex-acq); ~<b>60% of VAS is network-linked</b> (scales with transactions).'] },
      { q:'Q2 2025', items:['Cyber/security demand rising with AI-era fraud; Recorded Future malware intelligence. Personalization + data insights the standout growth drivers.'] },
      { q:'Q3 2025', items:['Threat Intelligence scaling across the network; VAS +19% organic; consulting & marketing services strong.'] },
      { q:'Q4 2025', items:['VAS +22% (3pp acquisitions). Launched <b>Mastercard Credit Intelligence</b> and <b>Agent Suite</b> (AI consulting).'] },
      { q:'Q1 2026', items:['VAS +18%. New <b>NVIDIA-powered</b> gen-AI fraud model; Ethoca +~25%; Recorded Future / Threat Intelligence at <b>500+ customers</b>.'] },
    ]},
  { theme:'Cross-border & the consumer', st:{ k:'trend', since:'Q1 2024', last:'Q1 2026' },
    why:'The margin engine and the demand pulse: cross-border is the highest-yield line, so its growth — and the health of the consumer behind it — is the number to watch.',
    updates:[
      { q:'Q4 2023', items:['Cross-border <b>+18%</b> lc; healthy consumer supported by strong labor market + wealth effect.'] },
      { q:'Q2 2024', items:['Cross-border <b>+17%</b> lc; some moderation in Middle East / Africa; a "savvy, intentional" consumer using the digital economy to find the best deal.'] },
      { q:'Q1 2025', items:['Cross-border <b>+15%</b> lc; consumer solid despite tariff uncertainty; no meaningful pull-forward of spend seen.'] },
      { q:'Q4 2025', items:['Cross-border <b>+14%</b> lc; a lift in card-not-present ex-travel from crypto purchases.'] },
      { q:'Q1 2026', items:['Cross-border <b>+13%</b> lc; <b>Middle East conflict</b> pressures cross-border travel from March. GCC + Israel ≈ <b>6% of cross-border volume</b>; base case assumes the conflict ends in Q2.'] },
    ]},
  { theme:'Capital One, debit & the network battleground', st:{ k:'watch', since:'Q1 2025', last:'Q1 2026' },
    why:'The competitive front line: US debit flips, the Capital One–Discover overhang, and the routing/regulatory pressure that make the "right portfolio, not every portfolio" the mantra.',
    updates:[
      { q:'Q4 2023', items:['US <b>debit flips</b> — Citizens, Webster, BOK; long-term <b>The Clearing House (RTP)</b> renewal.'] },
      { q:'Q1 2024', items:['<b>BOK Financial</b> debit flip. Reg II debit-routing impact "not material" so far.'] },
      { q:'Q4 2024', items:['<b>Capital One credit renewed</b> + network for a large share of new credit accounts (debit migrating to Discover). <b>Apple Card</b> stays Mastercard (issuer → JPMorgan, ~24 months). Wero (European scheme) judged "not a material threat."'] },
      { q:'Q2 2025', items:['<b>Capital One–Discover closed.</b> Discipline emphasized: win "the right portfolios," not every portfolio.'] },
      { q:'Q4 2025', items:['Cap One debit migration continuing; wins Yapı Kredi (10M cards), Scotiabank (MX/CL/UY).'] },
      { q:'Q1 2026', items:['<b>Cap One debit migration complete.</b> <b>Amazon</b> US Small Business co-brand (US Bank) flips to Mastercard; CIB Egypt (5M+ cards); Westpac renewal.'] },
    ]},
  { theme:'Commercial, New Flows & Mastercard Move', st:{ k:'trend', since:'Q1 2024', last:'Q1 2026' },
    why:'The biggest disclosed TAM (~$100T, only ~5% carded): commercial cards, virtual cards, and the disbursement/remittance rail (Mastercard Move) growing >35%.',
    updates:[
      { q:'Q4 2023', items:['Commercial <b>13% of GDV, +11%</b>; Move +30–35%; JPMorgan/FLEETCOR renewals; virtual cards for Booking.com & Agoda.'] },
      { q:'Q2 2024', items:['<b>Mobile virtual-card app</b> (HSBC Australia, Westpac first). Commercial POS bundles — Business Builder, Mid-Market Accelerator.'] },
      { q:'Q3 2024', items:['<b>Move +40%</b> transactions; CBC (Pepsi LatAm) — ~2M retailers; small-business cards-in-market +10%. Merchant Cloud + Commerce Media launched.'] },
      { q:'Q4 2024', items:['Commercial 13% of GDV, +11%. Coupa Mastercard; WEX renewal; Amazon UAE co-brand.'] },
      { q:'Q1 2026', items:['<b>Amazon</b> US Small Business co-brand; fleet wins (ryd, Free); B2B travel (Highnote, Travelsoft); Move — Bank of Shanghai, One Inc, GCC small-business suite.'] },
    ]},
  { theme:'Regulation & the interchange overhang', st:{ k:'watch', since:'Q4 2024', last:'Q1 2026' },
    why:'The persistent tail risk: interchange litigation, the CCCA routing mandate and a proposed rate cap — borne more directly by Mastercard than by escrow-shielded Visa.',
    updates:[
      { q:'Q1 2024', items:['US <b>merchant interchange settlement</b> reached (lower interchange + clearer surcharge/discount rules) — <b>later rejected by the court</b>, so the overhang persists.'] },
      { q:'Q4 2024', items:['<b>CCCA</b> back in the news — "little progress, united opposition." A proposed <b>10% credit rate-cap</b> discussed; Mastercard engaging on affordability + credit access.'] },
      { q:'Q1 2026', items:['CCCA context continues (reintroduced Jan 2026) — a live legislative overhang (also mapped in <b>Top Line ▸ Industry Analysis</b>).'] },
    ]},
];
// Regroup the theme-tagged updates by quarter (newest first) — same data, different lens.
function maCallsByQuarter(){
  var map={}, order=[];
  MA_THEMES.forEach(function(ct){ ct.updates.forEach(function(u){ if(!map[u.q]){ map[u.q]=[]; order.push(u.q); } map[u.q].push({ theme:ct.theme, items:u.items }); }); });
  function qv(q){ var m=String(q).match(/Q(\d)\s+(\d{4})/); return m?(+m[2])*10+(+m[1]):0; }
  order.sort(function(a,b){ return qv(b)-qv(a); });
  return { order:order, map:map };
}
function maCallsBody(c){
  var h='<style>.calls-tog{display:inline-flex;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:14px}'+
    '.calls-pill{border:none;background:transparent;font:inherit;font-size:12px;font-weight:700;color:var(--mu);padding:5px 15px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.calls-pill:hover{color:var(--navy)}.calls-pill.active{background:'+BRAND+';color:#fff}'+
    '.calls-tl{font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--navy);margin:0 0 4px}'+
    '.calls-st{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid;flex:none}</style>';
  h+='<p class="ov-lede">The key narrative threads from the <b>10 earnings calls</b> Q4 2023 → Q1 2026. Switch lens: <b>By theme</b> traces how each story evolved; <b>By quarter</b> shows what mattered on a given call. Each theme carries a status — <b>trend</b> (confirmed), <b>promise</b> (a commitment to reconcile next call) or <b>watch</b> — <b>with its age</b>: a watch running two quarters is louder than a fresh one. Tap any row to expand. (Quarterly guided-vs-delivered lives in the <b>Guidance</b> tab.)</p>';
  h+='<div class="calls-tog" role="tablist"><button type="button" class="calls-pill active" data-macallsv="theme">By theme</button><button type="button" class="calls-pill" data-macallsv="quarter">By quarter</button></div>';
  // By theme (default)
  h+='<div class="lpb-acc" id="maCallsTheme">';
  MA_THEMES.forEach(function(ct){
    var sk=(ct.st&&ct.st.k)?ct.st.k:'watch'; var st=CP_THST[sk]||CP_THST.watch;
    h+='<div class="lpb-acc-item"><button type="button" class="lpb-acc-h"><span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap">'+esc(ct.theme)+' <span class="calls-st" style="color:'+st.c+';border-color:'+st.c+'">'+st.l+cpStAge(ct.st)+'</span></span><span class="lpb-acc-ic">+</span></button>';
    h+='<div class="lpb-acc-body"><p style="font-size:12px;color:var(--mu);margin:0 0 10px;font-style:italic">'+esc(ct.why)+'</p>';
    ct.updates.forEach(function(u){ h+='<div style="margin-bottom:10px"><span class="ov-chip" style="margin-right:6px">'+esc(u.q)+'</span><ul class="ov-bullets" style="margin-top:4px">'+u.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>'; });
    h+='</div></div>';
  });
  h+='</div>';
  // By quarter
  var byQ=maCallsByQuarter();
  h+='<div class="lpb-acc" id="maCallsQuarter" style="display:none">';
  byQ.order.forEach(function(q){
    h+='<div class="lpb-acc-item"><button type="button" class="lpb-acc-h"><span>'+esc(q)+'</span><span class="lpb-acc-ic">+</span></button><div class="lpb-acc-body">';
    byQ.map[q].forEach(function(row){ h+='<div style="margin-bottom:12px"><div class="calls-tl">'+esc(row.theme)+'</div><ul class="ov-bullets" style="margin-top:2px">'+row.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>'; });
    h+='</div></div>';
  });
  h+='</div>';
  h+='<div class="ov-fynote" style="margin-top:12px">Sources: Mastercard Q4 2023 – Q1 2026 earnings calls & prepared remarks (transcripts). Highlights are qualitative and contemporaneous — written from the perspective of each call, not with hindsight.</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════
//  Valuation ▸ Sensitivity — a multi-driver model (SoFi pattern). Turn Mastercard’s
//  revenue algorithm into an EPS and an implied price. Base ≈ FY26E. Live price via
//  api.liveQuote overrides the anchor. All drivers flex from the base case. ──
var MA_SENS_BASE={
  netBase:18.5,   // FY25 payment-network net revenue ($B), ~58% of net rev
  vasBase:13.4,   // FY25 value-added-services net revenue ($B), ~42%
  shares:905,     // diluted shares (M)
  netToOp:0.79,   // net income ÷ operating income (≈44.6/56.6)
  pxFallback:519  // dated market anchor (~$470B mkt cap ÷ ~905M sh); overridden by the live price
};
var MA_SENS_DRIVERS=[
  { k:'gnet', label:'Payment-network growth', unit:'%', min:3, max:15, step:0.5, base:9,  hint:'GDV × cross-border × net yield, blended' },
  { k:'gvas', label:'Value-added services growth', unit:'%', min:6, max:28, step:1, base:18, hint:'the high-teens growth engine' },
  { k:'opm',  label:'Operating margin', unit:'%', min:52, max:62, step:0.5, base:57, hint:'guided ≥55% floor' },
  { k:'buy',  label:'Net share reduction (buyback)', unit:'%', min:0, max:4, step:0.25, base:2, hint:'~$14.5B/yr program' },
  { k:'pe',   label:'P/E (re-rate)', unit:'×', min:20, max:40, step:0.5, base:31, hint:'premium duopoly multiple' },
];
var _maSens={}; MA_SENS_DRIVERS.forEach(function(d){ _maSens[d.k]=d.base; });
var _maLivePx=null;
function maSensCompute(){
  var s=_maSens, B=MA_SENS_BASE;
  var netRev = B.netBase*(1+s.gnet/100) + B.vasBase*(1+s.gvas/100); // $B
  var opInc  = netRev*(s.opm/100);
  var netInc = opInc*B.netToOp;                                     // $B
  var shares = B.shares*(1-s.buy/100);                              // M
  var eps    = (netInc*1000)/shares;                               // $
  var price  = eps*s.pe;
  return { netRev:netRev, opInc:opInc, netInc:netInc, eps:eps, price:price };
}
function maSensBody(c){
  var h='<style>.msn-wrap{display:grid;grid-template-columns:1.1fr 1fr;gap:18px;margin-top:6px}@media(max-width:820px){.msn-wrap{grid-template-columns:1fr}}'+
    '.msn-drv{margin:0 0 15px}.msn-drl{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}'+
    '.msn-dn{font-size:12.5px;font-weight:800;color:var(--navy)}.msn-dv{font-size:13px;font-weight:900;color:'+MA_RED+'}'+
    '.msn-dh{font-size:10.5px;color:var(--mu);margin-top:2px}'+
    '.msn-slider{width:100%;-webkit-appearance:none;height:5px;border-radius:5px;background:#E7ECF3;outline:none;margin-top:6px}'+
    '.msn-slider::-webkit-slider-thumb{-webkit-appearance:none;width:17px;height:17px;border-radius:50%;background:'+MA_RED+';cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.2)}'+
    '.msn-slider::-moz-range-thumb{width:17px;height:17px;border:none;border-radius:50%;background:'+MA_RED+';cursor:pointer}'+
    '.msn-eq{background:var(--w);border:1px solid var(--bdr);border-radius:11px;padding:13px 15px;font-size:12px;color:var(--navy);line-height:1.9}'+
    '.msn-eq b{color:'+MA_RED+'}.msn-tiles{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}'+
    '.msn-tile{border:1px solid var(--bdr);border-radius:11px;padding:12px 14px;text-align:center}.msn-tile-v{font-size:20px;font-weight:900;color:var(--navy)}.msn-tile-l{font-size:10.5px;color:var(--mu);margin-top:2px}'+
    '.msn-price{grid-column:1 / -1;border-top:3px solid '+MA_RED+';background:rgba(207,10,44,0.05)}.msn-price .msn-tile-v{font-size:26px;color:'+MA_RED+'}'+
    '.msn-up{font-size:12.5px;font-weight:800;margin-top:3px}.msn-reset{margin-top:12px;font-size:11px;font-weight:800;color:'+MA_RED+';background:none;border:1px solid '+MA_RED+';border-radius:8px;padding:6px 12px;cursor:pointer}</style>';
  h+='<p class="ov-lede">Mastercard doesn’t guide EPS — so here’s the model that turns its <b>revenue algorithm</b> into one. Move any driver; the equation, the KPI tiles and the <b>implied price</b> (EPS × P/E) recompute live and compare to the market price. Base case ≈ <b>FY26E</b>.</p>';
  h+='<div class="msn-wrap"><div id="maSensDrivers">'+MA_SENS_DRIVERS.map(function(d){
      return '<div class="msn-drv"><div class="msn-drl"><span class="msn-dn">'+esc(d.label)+'</span><span class="msn-dv" id="maSensV-'+d.k+'">'+d.base+d.unit+'</span></div>'+
        '<input type="range" class="msn-slider" id="maSens-'+d.k+'" min="'+d.min+'" max="'+d.max+'" step="'+d.step+'" value="'+d.base+'">'+
        '<div class="msn-dh">'+esc(d.hint)+' · base '+d.base+d.unit+'</div></div>'; }).join('')+
      '<button type="button" class="msn-reset" id="maSensReset">↺ Reset to base case</button></div>'+
    '<div><div class="msn-eq" id="maSensEq"></div><div class="msn-tiles" id="maSensTiles"></div></div></div>';
  h+='<div class="ov-fynote" style="margin-top:14px"><b>How it chains:</b> network + VAS revenue → operating income (× margin) → net income (× 0.79 net/op) → EPS (÷ shares, net of buyback) → <b>price = EPS × P/E</b>. Illustrative, not a Mastercard forecast; net/op ratio, share count and segment split are FY2025 anchors.</div>';
  h+='<div class="ov-foot">Anchors from Mastercard FY2025 results (net-revenue split ~58/42 network/VAS; ~905M diluted shares; net/op ≈ 0.79). Live price via Massive; P/E base ~31× is a mid-2026 premium-duopoly multiple. All outputs are model estimates.</div>';
  return h;
}
function maSensRender(root){
  root=root||document; var r=maSensCompute();
  var px=_maLivePx||MA_SENS_BASE.pxFallback;
  var up=(r.price/px-1)*100, upCol=up>=0?'#0F9D58':'#C0392B';
  var eq=root.querySelector('#maSensEq');
  if(eq) eq.innerHTML='Net revenue <b>$'+r.netRev.toFixed(1)+'B</b> → operating income <b>$'+r.opInc.toFixed(1)+'B</b> → net income <b>$'+r.netInc.toFixed(1)+'B</b> → EPS <b>$'+r.eps.toFixed(2)+'</b> → price = EPS × P/E = <b>$'+Math.round(r.price)+'</b>';
  var tiles=root.querySelector('#maSensTiles');
  if(tiles) tiles.innerHTML=
    '<div class="msn-tile"><div class="msn-tile-v">$'+r.netRev.toFixed(1)+'B</div><div class="msn-tile-l">Net revenue</div></div>'+
    '<div class="msn-tile"><div class="msn-tile-v">$'+r.eps.toFixed(2)+'</div><div class="msn-tile-l">EPS (model)</div></div>'+
    '<div class="msn-tile msn-price"><div class="msn-tile-l" style="margin-bottom:2px">Implied price</div><div class="msn-tile-v">$'+Math.round(r.price)+'</div><div class="msn-up" style="color:'+upCol+'">'+(up>=0?'+':'')+up.toFixed(1)+'% vs $'+Math.round(px)+(_maLivePx?' live':' est')+'</div></div>';
}
function maSensInit(root){
  root=root||document;
  MA_SENS_DRIVERS.forEach(function(d){ var el=root.querySelector('#maSens-'+d.k); if(!el) return;
    el.oninput=function(){ _maSens[d.k]=parseFloat(el.value); var v=root.querySelector('#maSensV-'+d.k); if(v) v.textContent=el.value+d.unit; maSensRender(root); }; });
  var rb=root.querySelector('#maSensReset'); if(rb) rb.onclick=function(){ MA_SENS_DRIVERS.forEach(function(d){ _maSens[d.k]=d.base; var el=root.querySelector('#maSens-'+d.k); if(el) el.value=d.base; var v=root.querySelector('#maSensV-'+d.k); if(v) v.textContent=d.base+d.unit; }); maSensRender(root); };
  maSensRender(root);
}

// ════════════════════════════════════════════════════════════════════════════
//  Valuation ▸ Capital Allocation — the asset-light cash machine returns ~all FCF.
//  Buybacks (~$14.5B FY25) + a serially-raised dividend, shares down ~990M→~906M.
//  Figures directional (annual splits from cash-flow statements / press). ──
var MA_CAP_ROWS=[
  { fy:'FY21', fcf:8.7, buy:5.9, div:1.7, sh:986 },
  { fy:'FY22', fcf:10.1, buy:8.8, div:1.9, sh:966 },
  { fy:'FY23', fcf:10.4, buy:9.0, div:2.1, sh:940 },
  { fy:'FY24', fcf:14.3, buy:11.0, div:2.4, sh:920 },
  { fy:'FY25', fcf:15.1, buy:14.5, div:2.6, sh:906 },
];
function maCapAllocBody(c){
  var last=MA_CAP_ROWS[MA_CAP_ROWS.length-1], first=MA_CAP_ROWS[0];
  var shDrop=((first.sh-last.sh)/first.sh*100).toFixed(1);
  var h='<p class="ov-lede">Mastercard is an <b>asset-light cash machine</b>: almost no capex, no credit risk, ~46–48% FCF margin — so nearly <b>all</b> free cash flow goes back to shareholders, tilted heavily to <b>buybacks</b> with a <b>serially-raised dividend</b> on top. The share count has fallen every year.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY25 buybacks</div><div class="ov-kpi-v">~$14.5B</div><div class="ov-kpi-d muted">up from ~$5.9B in FY21</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY25 dividends</div><div class="ov-kpi-v">~$2.6B</div><div class="ov-kpi-d muted">raised ~11–12%/yr</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Total returned FY25</div><div class="ov-kpi-v">~$17B</div><div class="ov-kpi-d muted">≈ 110%+ of FCF</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Shares FY21→FY25</div><div class="ov-kpi-v">−'+shDrop+'%</div><div class="ov-kpi-d muted">~986M → ~906M</div></div>'+
  '</div>';
  h+=sec('Capital returned vs free cash flow',
    '<div class="ov-chart-card"><div class="ov-chart-t">Buybacks + dividends vs FCF <span>· $B · fiscal years</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="maChartCapital"></canvas></div></div>'+
    '<div class="ov-chart-card" style="overflow-x:auto;margin-top:10px"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="color:var(--mu)"><th style="text-align:left;padding:6px 10px">FY</th><th style="text-align:right;padding:6px 10px">FCF</th><th style="text-align:right;padding:6px 10px">Buybacks</th><th style="text-align:right;padding:6px 10px">Dividends</th><th style="text-align:right;padding:6px 10px">Total return</th><th style="text-align:right;padding:6px 10px">% of FCF</th><th style="text-align:right;padding:6px 10px">Shares (M)</th></tr></thead><tbody>'+
      MA_CAP_ROWS.map(function(r){ var tot=r.buy+r.div, pct=(tot/r.fcf*100).toFixed(0); return '<tr style="border-top:1px solid var(--bdr)"><td style="padding:7px 10px;font-weight:800">'+esc(r.fy)+'</td><td style="text-align:right;padding:7px 10px">$'+r.fcf.toFixed(1)+'B</td><td style="text-align:right;padding:7px 10px">$'+r.buy.toFixed(1)+'B</td><td style="text-align:right;padding:7px 10px">$'+r.div.toFixed(1)+'B</td><td style="text-align:right;padding:7px 10px;font-weight:700">$'+tot.toFixed(1)+'B</td><td style="text-align:right;padding:7px 10px;color:'+(pct>=100?'#0F9D58':'var(--navy)')+'">'+pct+'%</td><td style="text-align:right;padding:7px 10px">'+r.sh+'</td></tr>'; }).join('')+
    '</tbody></table></div>'+
    '<div class="ov-fynote" style="margin-top:8px">Buybacks (dark) are the primary lever; the dividend (orange) is smaller but <b>raised every year</b>. Total return has run <b>at or above 100% of FCF</b> — funded partly with the balance sheet, consistent with the low-capital model. Annual splits are directional (from cash-flow statements / dividend announcements).</div>');
  h+='<div class="ov-foot">Sources: Mastercard cash-flow statements FY2021–FY2025, dividend press releases, share-count from the 10-Ks. Values are approximate/directional, rounded to the nearest $0.1B.</div>';
  return h;
}
function buildMaCapital(){
  var cv=document.getElementById('maChartCapital'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var ex=Chart.getChart?Chart.getChart(cv):null; if(ex) ex.destroy();
  var labels=MA_CAP_ROWS.map(function(r){ return r.fy; });
  new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:labels, datasets:[
      { label:'Buybacks', data:MA_CAP_ROWS.map(function(r){ return r.buy; }), backgroundColor:MA_RED, stack:'ret', borderRadius:{topLeft:0,topRight:0,bottomLeft:4,bottomRight:4}, maxBarThickness:40 },
      { label:'Dividends', data:MA_CAP_ROWS.map(function(r){ return r.div; }), backgroundColor:MA_ORANGE, stack:'ret', borderRadius:{topLeft:4,topRight:4}, maxBarThickness:40 },
      { label:'Free cash flow', type:'line', data:MA_CAP_ROWS.map(function(r){ return r.fcf; }), borderColor:MA_GREEN, backgroundColor:MA_GREEN, borderWidth:2.5, tension:.25, pointRadius:3, order:0 }
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': $'+ctx.parsed.y.toFixed(1)+'B'; } } } },
      scales:{ y:{ stacked:true, ticks:{ callback:function(v){ return '$'+v+'B'; }, font:{size:10} }, grid:{color:'#EEF2F7'} }, x:{ stacked:true, grid:{display:false}, ticks:{font:{size:10.5}} } } }
  });
}

// ════════════════════════════════════════════════════════════════════════════
//  Management ▸ Governance & SBC — clean governance (independent chair, single
//  class, no litigation escrow) and modest, buyback-swamped stock comp. SBC $ and
//  share count directional (from proxy / cash-flow statements). ──
var MA_SBC_ROWS=[
  { fy:'FY22', sbc:0.295, rev:22.24, sh:966 },
  { fy:'FY23', sbc:0.42,  rev:25.10, sh:940 },
  { fy:'FY24', sbc:0.52,  rev:28.17, sh:920 },
  { fy:'FY25', sbc:0.60,  rev:31.90, sh:906 },
];
function maSbcBody(c){
  var h='<p class="ov-lede">Two things to check on a compounder: is the <b>governance</b> clean, and is <b>stock comp</b> quietly diluting you? Mastercard scores well on both — an <b>independent chair</b>, a <b>single class</b> of stock, and <b>SBC around ~1.5–2% of revenue</b> that is <b>swamped by buybacks</b> (net share count falls every year).</p>';
  h+=sec('Governance — the structure',
    '<div class="ov-grid2" style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="ov-callout"><div class="ov-subh" style="margin:0 0 6px">✓ Shareholder-friendly</div>'+bullets([
      '<b>Independent Chair</b> (Merit E. Janow) — CEO Miebach is <b>not</b> chairman; roles are split.',
      '<b>Single class of common stock</b> — one share, one vote; no founder super-voting.',
      '<b>Board is operator-heavy</b> (ex-CEOs of U.S. Bancorp, Itaú, Singapore Airlines; Markit founder) — see Track Record.',
      'Serial dividend increases + a standing multi-billion buyback authorization.']) +'</div>'+
    '<div class="ov-callout"><div class="ov-subh" style="margin:0 0 6px">⚑ Things to know</div>'+bullets([
      '<b>No litigation-escrow shield</b> (unlike Visa’s Class-B) — interchange litigation hits MA directly (see Risk & Litigation).',
      'The <b>Mastercard Foundation</b> historically held a large Class-A stake with <b>voting caps and a required sell-down</b> — a governance feature, not an overhang on control.',
      'Executive pay is heavily equity/performance-linked — aligned, but watch the grant size vs the modest SBC expense.']) +'</div></div>');
  h+=sec('Stock-based comp — modest, and more than bought back',
    '<div class="ov-chart-card"><div class="ov-chart-t">SBC ($B, bars) vs shares outstanding (M, line) <span>· fiscal years</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="maChartSbc"></canvas></div></div>'+
    '<div class="ov-fynote" style="margin-top:8px">SBC has grown with the company but sits around <b>~1.5–2% of net revenue</b> — and the <b>~$14.5B/yr buyback</b> overwhelms it, so <b>diluted shares fall every year</b> (~966M → ~906M). Net dilution is <b>negative</b>: you own more of the company each year. SBC $ figures are directional (from the proxy / cash-flow statements).</div>');
  h+='<div class="ov-foot">Sources: Mastercard 2026 DEF 14A (governance, board independence, pay), FY2022–FY2025 cash-flow statements (SBC), 10-Ks (share count). SBC dollars are approximate/directional.</div>';
  return h;
}
function buildMaSbc(){
  var cv=document.getElementById('maChartSbc'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var ex=Chart.getChart?Chart.getChart(cv):null; if(ex) ex.destroy();
  var labels=MA_SBC_ROWS.map(function(r){ return r.fy; });
  new Chart(cv.getContext('2d'),{ data:{ labels:labels, datasets:[
      { type:'bar', label:'SBC ($B)', data:MA_SBC_ROWS.map(function(r){ return r.sbc; }), backgroundColor:MA_ORANGE, borderRadius:4, maxBarThickness:40, yAxisID:'y' },
      { type:'line', label:'Diluted shares (M)', data:MA_SBC_ROWS.map(function(r){ return r.sh; }), borderColor:MA_STEEL, backgroundColor:MA_STEEL, borderWidth:2.5, tension:.25, pointRadius:3, yAxisID:'y1' }
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+(ctx.dataset.yAxisID==='y1'?ctx.parsed.y+'M':'$'+ctx.parsed.y.toFixed(2)+'B'); } } } },
      scales:{ y:{ position:'left', ticks:{ callback:function(v){ return '$'+v+'B'; }, font:{size:10} }, grid:{color:'#EEF2F7'}, title:{display:true,text:'SBC',font:{size:10},color:C_AXIS} },
               y1:{ position:'right', ticks:{ font:{size:10} }, grid:{display:false}, title:{display:true,text:'shares (M)',font:{size:10},color:C_AXIS} },
               x:{ grid:{display:false}, ticks:{font:{size:10.5}} } } }
  });
}

// ── Evolution ▸ Timeline (history + M&A) ──
function ddTimelineBody(c){
  var h=sec('History — from #2 challenger to network + services',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">How a bank alliance built to challenge the leader became a global network-plus-services company — <b>tap any milestone</b> with "Read more".</div>'+
    stdTimeline()+'<div class="ov-fynote" style="margin-top:6px">'+esc(TL_NOTE)+'</div>');
  h+=sec('M&A — terms & what each deal added',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">The acquisitions that built the services and real-time-payment pillars — <b>tap any deal</b>.</div>'+
    '<div class="ov-cards ov-cards-mna">'+MNA.map(function(m){
      return '<div class="ov-card ov-clickable'+(m.big?' ov-card-big':'')+'" data-detail="mna:'+esc(m.n)+'">'+
        '<div class="ov-card-h"><span class="ov-card-n">'+esc(m.n)+'</span><span class="ov-chip">'+esc(m.cat)+'</span></div>'+
        '<div class="ov-card-kpis"><span>'+esc(m.y)+'</span><span>'+esc(m.deal)+'</span><span>'+esc(m.terms)+'</span><span>'+esc(m.own)+'</span></div>'+
        '<div class="ov-more">What it added ›</div></div>';
    }).join('')+'</div>');
  return h;
}

function deepDiveHtml(c){
  var h='<div class="ov ov-mastercard ov-mastercard-dd" data-brand="MA">';
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
      '<button type="button" class="ovt-subtab" data-ovst="customers">Customers</button>'+
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
      '<button type="button" class="ovt-subtab" data-ovst="guidance">Guidance</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="strategy">Strategy</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="timeline">Timeline</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="callprep">'+
      cpIRButton()+
      '<div class="cp-note" style="margin-bottom:12px">🎯 <b>Call Prep</b> — the decision layer, in three phases: <b>① Pre-Call</b> (go in ready — Setup · Watch List, with themes tracked across quarters) → <b>② Post-Results</b> (react to the numbers, which land before the call) → <b>③ Post-Call</b> (what management said + the meeting take). Append-only per quarter — pick a quarter below; each quarter keeps its frozen pre-call blocks next to its post-mortem, so the tab is a record of how well we read Mastercard. The <b>Watch List</b> is the single home for theme-tracking — the old standalone <i>Earnings Calls</i> tab was folded into it (no two tabs on the same call highlights). <b>Consensus (Bloomberg) + Summit + the 4 custom KPIs render "to fill / to define" until the export lands.</b></div>'+
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
    '<div class="ovt-subpane" data-ovst="guidance" hidden>'+maGuideBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="strategy" hidden>'+ddStrategyBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="timeline" hidden>'+ddTimelineBody(c)+'</div>'+
  '</div>';
  // Valuation
  h+='<div class="dd-pane" data-dd="valuation" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="ratings">Analyst Ratings</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="multiples">Multiples</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="sensitivity">Sensitivity</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="capalloc">Capital Allocation</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="balance">Financials</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="risk">Risk & Litigation</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="ratings"><div id="dd-val-slot"></div></div>'+
    '<div class="ovt-subpane" data-ovst="multiples" hidden>'+ddMultiplesBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="sensitivity" hidden>'+maSensBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="capalloc" hidden>'+maCapAllocBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="balance" hidden>'+ddFinancialsBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="risk" hidden>'+ddRiskBody(c)+'</div>'+
  '</div>';
  // Management
  h+='<div class="dd-pane" data-dd="mgmt" hidden>'+
    '<div class="ovt-subtabs">'+
      '<button type="button" class="ovt-subtab active" data-ovst="team">Executives & Board</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="track">Track Record</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="gov">Governance & SBC</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="ownership">Ownership</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="team">'+MA_MGMT.body()+'</div>'+
    '<div class="ovt-subpane" data-ovst="track" hidden>'+maTrackBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="gov" hidden>'+maSbcBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="ownership" hidden><div id="dd-mgmt-slot"></div></div>'+
  '</div>';
  h+='<div class="ov-foot">'+esc(DD_SOURCES)+'</div>';
  h+='</div>';
  return h;
}

// ─── Financials charts (DCF actuals + projection, timeline-moldable) ─────────
function finSlice(s){
  var o={years:[],labels:[],data:[],est:[]};
  for(var i=0;i<FIN_YEARS.length;i++){ var y=FIN_YEARS[i];
    if(y>=_finStart && y<=_finEnd){ o.years.push(y); o.data.push(s.data[i]); o.est.push(FIN_EST[i]); o.labels.push(String(y)+(FIN_EST[i]?'E':'')); } }
  return o;
}
function makeFin(id){
  var s=FIN_SERIES[id]; var cv=document.getElementById(id); if(!cv) return;
  var sl=finSlice(s); var ds;
  if(s.type==='bar'){
    ds={ data:sl.data, backgroundColor:sl.est.map(function(e){ return e?_hexRgba(s.color,0.4):s.color; }), borderRadius:5, maxBarThickness:46 };
  } else {
    ds={ data:sl.data, borderColor:s.color, backgroundColor:_hexRgba(s.color,0.08), fill:true, tension:0.3, borderWidth:2.5, pointRadius:3, pointHoverRadius:5, spanGaps:true,
      pointBackgroundColor: sl.est.map(function(e){ return e?_hexRgba(s.color,0.4):s.color; }),
      segment:{ borderDash:function(ctx){ return sl.est[ctx.p1DataIndex]?[6,4]:undefined; } } };
  }
  _finCharts[id]=new Chart(cv.getContext('2d'), { type:s.type, data:{labels:sl.labels, datasets:[ds]},
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(ctx){ return ' '+FIN_FMT(ctx.parsed.y); } } } },
      scales:{ x:{ grid:{display:false}, ticks:{color:C_AXIS,font:{size:10}} },
               y:{ grid:{color:C_GRID}, ticks:{color:C_AXIS,font:{size:10},callback:FIN_FMT} } } }
  });
  var el=document.getElementById('stat-'+id); if(!el) return;
  var idxs=[]; for(var j=0;j<sl.data.length;j++) if(sl.data[j]!=null) idxs.push(j);
  if(idxs.length>=2){ var fi=idxs[0], li=idxs[idxs.length-1], a=sl.data[fi], z=sl.data[li], yrs=sl.years[li]-sl.years[fi];
    var cagr=(Math.pow(z/a, 1/(yrs||1))-1)*100;
    el.innerHTML='<b>'+sl.labels[fi]+'</b> '+FIN_FMT(a)+' → <b>'+sl.labels[li]+'</b> '+FIN_FMT(z)+' · CAGR <span class="'+(cagr>=0?'pos':'neg')+'">'+(cagr>=0?'+':'')+cagr.toFixed(1)+'%</span>';
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
  if(group==='bottomline' && key==='margins') buildMaMargins();
  if(group==='evolution' && key==='guidance') renderMaGuide();
  if(group==='valuation' && key==='sensitivity') maSensInit(root);
  if(group==='valuation' && key==='capalloc') buildMaCapital();
  if(group==='valuation' && key==='balance') renderFin();
  if(group==='mgmt' && key==='team') MA_MGMT.init(root);
  if(group==='mgmt' && key==='gov') buildMaSbc();
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

  // Collapsibles (Overview progressive disclosure)
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement; var open=cc.classList.toggle('open'); var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }; });
  // Segment "What is X?" accordions
  root.querySelectorAll('.acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+'; }; });
  // How-it-makes-money Segments ⇄ Geography toggle
  root.querySelectorAll('.mm-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-mm');
    root.querySelectorAll('.mm-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.mm-view').forEach(function(p){ p.hidden=(p.getAttribute('data-mm')!==v); });
  }; });

  // Dynamic peer scatter (Overview)
  maScReset(); maScRender(root); maScChips(root);
  var sctip=root.querySelector('#maScTip');
  function maPeerByTk(tk){ var r=null; (MA_SC.peers||[]).forEach(function(p){ if(p.tk===tk) r=p; }); return r; }
  // Delegated pointer wiring on the stable #maScNodes container. Delegation (not per-node
  // mouseenter/leave) is what lets us re-append the hovered node to the FRONT so its full
  // circle clears any peer stacked on top — a per-node listener would fire mouseleave on
  // the re-append and hide the tooltip. Guarded so scRefresh() can't stack duplicates.
  function wireScNodes(){ if(!sctip) return; var cont=root.querySelector('#maScNodes'); if(!cont||cont._scWired) return; cont._scWired=true; var cur=null;
    function nodeOf(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; }
    function show(g){ var p=maPeerByTk(g.getAttribute('data-tk')); if(!p) return;
      var col=p.hl?MA_RED:'#7A8699';
      var pe=(MA_SC.basis==='f'?p.peF:p.peT), ev=(MA_SC.basis==='f'?p.evF:p.evT), gr=(MA_SC.basis==='f'?p.gf:p.gt);
      var chip=function(l,v){ return v==null?'':'<span class="mgt-chip"><b>'+v+'</b> '+l+'</span>'; };
      sctip.innerHTML='<div class="mgt-hd"><span class="mgt-logo" style="border-color:'+col+'"><img src="'+(p.logo?esc(p.logo):'https://assets.parqet.com/logos/symbol/'+esc(p.tk))+'" alt="" onerror="this.remove()"></span><span class="mgt-n" style="color:'+col+'">'+esc(p.n)+'</span></div>'+
        '<div class="mgt-chips">'+chip('P/E',pe?pe+'×':null)+chip('EV/EBITDA',ev?ev+'×':null)+chip('growth',gr?gr+'%':null)+chip('mkt cap',p.mc?'$'+(p.mc>=1000?(p.mc/1000).toFixed(2)+'T':Math.round(p.mc)+'B'):null)+'</div>'+
        '<div class="mgt-why">'+(p.why||'')+'</div>';
      sctip.hidden=false; }
    function move(e){ sctip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; sctip.style.top=(e.clientY+16)+'px'; }
    function raise(g){ if(g.parentNode) g.parentNode.appendChild(g); }
    cont.addEventListener('pointerover', function(e){ var g=nodeOf(e); if(!g) return; if(g!==cur){ cur=g; raise(g); } show(g); move(e); });
    cont.addEventListener('pointermove', function(e){ if(nodeOf(e)) move(e); });
    cont.addEventListener('pointerout', function(e){ var g=nodeOf(e); if(!g) return; var to=e.relatedTarget; if(to&&(g===to||g.contains(to)||(to.closest&&to.closest('.mg-node')===g))) return; cur=null; sctip.hidden=true; });
    cont.addEventListener('click', function(e){ var g=nodeOf(e); if(!g) return; raise(g); cur=g; show(g); move(e); });
  }
  function scRefresh(){ maScRender(root); wireScNodes(); }
  wireScNodes();
  root.querySelectorAll('.mg-pill').forEach(function(btn){ btn.onclick=function(){
    if(btn.hasAttribute('data-mgtype')){ MA_SC.type=btn.getAttribute('data-mgtype'); root.querySelectorAll('.mg-pill[data-mgtype]').forEach(function(b){ b.classList.toggle('active', b===btn); }); }
    else { MA_SC.basis=btn.getAttribute('data-mgbasis'); root.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b===btn); }); }
    scRefresh();
  }; });
  function wireChips(){
    root.querySelectorAll('#maScChips .masc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(MA_SC.peers[i]){ MA_SC.peers.splice(i,1); maScChips(root); wireChips(); scRefresh(); } }; });
    var addBtn=root.querySelector('#maScAddBtn'), addIn=root.querySelector('#maScAddTk');
    if(addBtn&&addIn){ addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!MA_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=MA_PEERS.filter(function(p){ return p.tk===tk; })[0];
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; MA_SC.peers.push(o); }
        else MA_SC.peers.push({ tk:tk, n:tk, on:true, mc:10, evT:null,evF:null,peT:null,peF:null,gt:null,gf:null, why:'Added by ticker — live market cap only; no multiple on file, so it plots once one is available.' });
      }
      addIn.value=''; maScChips(root); wireChips(); scRefresh(); maLiveOne(tk); }; }
  }
  wireChips();
  // Live market cap (Key Facts cell + peer bubbles) — Massive via api.liveQuote
  function maLiveOne(tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(q){ if(!q) return; if(tk==='MA' && q.price!=null){ _maLivePx=q.price; maSensRender(root); } if(q.marketCap==null) return; var mcB=q.marketCap/1e9; MA_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=mcB; }); if(tk==='MA'){ var el=root.querySelector('#maMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live'; } scRefresh(); }).catch(function(){}); }
  MA_SC.peers.forEach(function(p){ if(p.tk) maLiveOne(p.tk); });

  // Deep Dive tab wiring (root spans both panes)
  wireDD(root);
  wireSubtabs(root,'topline'); wireSubtabs(root,'bottomline'); wireSubtabs(root,'evolution'); wireSubtabs(root,'valuation'); wireSubtabs(root,'mgmt');
  wireCallPrep(root);

  // Evolution ▸ Guidance — metric toggle (net-revenue ⇄ opex)
  root.querySelectorAll('.guid-pill[data-maguidm]').forEach(function(btn){ btn.onclick=function(){ switchMaGuideMetric(root, btn.getAttribute('data-maguidm')); }; });
  // Evolution ▸ Earnings Calls — By theme ⇄ By quarter lens toggle
  root.querySelectorAll('.calls-pill[data-macallsv]').forEach(function(btn){ btn.onclick=function(){ var v=btn.getAttribute('data-macallsv');
    root.querySelectorAll('.calls-pill[data-macallsv]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    var th=root.querySelector('#maCallsTheme'), qt=root.querySelector('#maCallsQuarter');
    if(th) th.style.display=(v==='theme')?'':'none'; if(qt) qt.style.display=(v==='quarter')?'':'none';
  }; });
  // Earnings-call accordion rows (theme & quarter) — expand/collapse
  root.querySelectorAll('.lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var it=btn.parentElement; var open=it.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'–':'+'; }; });

  // Financials timeline slider (Deep Dive ▸ Valuation ▸ Financials)
  var fmn = root.querySelector('#ovFinMin'), fmx = root.querySelector('#ovFinMax');
  var ffill = root.querySelector('#ovFinFill'), fval = root.querySelector('#ovFinVal'), ftk = root.querySelector('#ovFinTicks');
  if (fmn){
    var FY0=2021, FY1=2029, th='';
    for (var y=FY0; y<=FY1; y++) th += '<span>' + "'" + String(y).slice(2) + (y>=2026?'E':'') + '</span>';
    ftk.innerHTML = th;
    var paintFin = function(){
      var lo=Math.min(+fmn.value,+fmx.value), hi=Math.max(+fmn.value,+fmx.value);
      _finStart=lo; _finEnd=hi;
      var pa=(lo-FY0)/(FY1-FY0)*100, pb=(hi-FY0)/(FY1-FY0)*100;
      ffill.style.left=pa+'%'; ffill.style.width=(pb-pa)+'%';
      fval.textContent = lo + ' – ' + hi + (hi>=2026?'E':'');
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
    if (kind==='role'){ var r=ROLE_DETAIL[id]; return r && { t:r.t, h:r.h }; }
    if (kind==='vasm'){ var vm=VAS_MOAT.filter(function(x){return x.k===id;})[0]; return vm && { t:vm.ic+' '+vm.t, h:'<div style="font-size:12.5px;line-height:1.65;color:var(--navy)">'+vm.full+'</div>' }; }
    if (kind==='vase'){ var ve=VAS_ENGINE.filter(function(x){return x.k===id;})[0]; return ve && { t:ve.ic+' '+ve.t, h:'<div style="font-size:12.5px;line-height:1.65;color:var(--navy)">'+ve.full+'</div>' }; }
    if (kind==='fee'){ var s=FEE_LINES.filter(function(x){return x.k===id;})[0]; return s && { t:s.n+' <span class="ov-modal-sub">'+esc(s.rev)+'</span>', h:feeDetailHtml(s) }; }
    if (kind==='mna'){ var m=MNA.filter(function(x){return x.n===id;})[0]; return m && { t:m.n+' <span class="ov-modal-sub">'+esc(m.y)+' · '+esc(m.deal)+'</span>', h:m.detail }; }
    if (kind==='hist'){ var t=TIMELINE[parseInt(id,10)]; return t && t.d ? { t:t.y, h:t.d } : null; }
    if (kind==='litflow'){ var lf=LIT_FLOW[id]; return lf && { t:lf.t, h:lf.h }; }
    if (kind==='verb'){ var vb=MA_VERBS[id]; return vb && { t:vb.t, h:vb.h }; }
    if (kind==='matr'){ var p=MA_TRACK.filter(function(x){return x.id===id;})[0]; if(!p) return null; var rt=MA_TRACK_RATE[p.rate];
      var body='<div style="display:inline-block;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+rt.c+';border:1px solid '+rt.c+';border-radius:9px;padding:2px 8px;margin-bottom:10px">'+rt.l+'</div>'+
        '<div style="font-size:12.5px;color:var(--navy);line-height:1.5;margin-bottom:12px">'+p.one+'</div>'+
        '<div style="font-size:11px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px">At Mastercard</div>'+bullets(p.co)+
        '<div style="font-size:11px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.4px;margin:12px 0 5px">Before / outside</div>'+bullets(p.ext)+
        '<div class="ov-callout" style="margin-top:12px"><b>The read:</b> '+p.note+'</div>';
      return { t:esc(p.n)+' <span class="ov-modal-sub">'+esc(p.r)+'</span>', h:body }; }
    if (kind==='strat'){ var d=MA_STRAT_DRIVERS.filter(function(x){return x.k===id;})[0]; return d && { t:d.ic+' '+esc(d.t), h:d.detail }; }
    if (kind==='threat'){ var tt=MA_THREATS.filter(function(x){return x.k===id;})[0]; return tt && { t:tt.ic+' '+esc(tt.n), h:tt.detail }; }
    if (kind==='fam'){ var gp=id.split('-'), gg=MA_PROD_GROUPS[+gp[0]]; var f=gg&&gg.families[+gp[1]]; if(!f) return null;
      var body='<div class="famd" style="margin-bottom:10px;color:var(--mu)">'+esc(f.d)+'</div>'+f.items.map(function(it){ return '<div style="margin:0 0 10px"><div style="font-size:12.5px;font-weight:800;color:var(--navy)">'+esc(it[0])+'</div><div class="famd">'+esc(it[1])+'</div></div>'; }).join('');
      return { t:f.ic+' '+esc(f.fam), h:body }; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){
    el.style.cursor='pointer';
    el.addEventListener('click', function(){ var d=resolve(el.getAttribute('data-detail')); if (d) openModal(d.t, d.h); });
  });

  // Four-party flow animation (Deep Dive ▸ Bottom Line ▸ Suppliers)
  var flow = root.querySelector('#ovFlow');
  if (flow){
    var idx=0, timer=null;
    var nodes=flow.querySelectorAll('.ov-flow-node');
    var stepEl=flow.querySelector('#ovFlowStep'), capEl=flow.querySelector('#ovFlowCap'), earnEl=flow.querySelector('#ovFlowEarn');
    var dots=flow.querySelectorAll('.ov-flow-dot'), playBtn=flow.querySelector('#ovFlowPlay');
    function apply(i){
      idx=i; var s=FLOW_STEPS[i];
      nodes.forEach(function(n){ n.classList.toggle('on', s.on.indexOf(n.getAttribute('data-node'))!==-1); });
      stepEl.textContent=s.t; capEl.innerHTML=s.cap;
      if (s.earn){ earnEl.hidden=false; earnEl.className='ov-flow-earn earn-'+s.earnType; earnEl.innerHTML=s.earn; } else { earnEl.hidden=true; }
      dots.forEach(function(d, di){ d.classList.toggle('on', di===i); });
    }
    function stop(){ if (timer){ clearInterval(timer); timer=null; } playBtn.textContent='▶ Play'; }
    function play(){ if (timer){ stop(); return; } if (idx>=FLOW_STEPS.length-1) apply(0); playBtn.textContent='❚❚ Pause'; timer=setInterval(function(){ if (idx>=FLOW_STEPS.length-1){ stop(); return; } apply(idx+1); }, 2600); }
    playBtn.onclick=play;
    flow.querySelector('#ovFlowPrev').onclick=function(){ stop(); apply(Math.max(0, idx-1)); };
    flow.querySelector('#ovFlowNext').onclick=function(){ stop(); apply(Math.min(FLOW_STEPS.length-1, idx+1)); };
    dots.forEach(function(d){ d.onclick=function(){ stop(); apply(parseInt(d.getAttribute('data-i'),10)); }; });
    apply(0);
  }
}

// Deep Dive charts build lazily: init() already wired the tabs (root spans both panes),
// so here we only paint the active dd-pane's charts now that the Deep Dive tab is visible.
function deepDiveInit(c){
  var root = document.getElementById('co-detailview'); if(!root) return;
  var d=activeDD(root); requestAnimationFrame(function(){ buildDD(root, d); });
}

export var mastercardOverview = { html: html, init: init, absorbsPillars: true, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
