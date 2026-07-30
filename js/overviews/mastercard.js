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
import { resultsHtml, initResults, resultsEvoHtml, initResultsEvo } from '../results.js';

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
var MA_GQ=['Q1 24','Q2 24','Q3 24','Q4 24','Q1 25','Q2 25','Q3 25','Q4 25','Q1 26','Q2 26','Q3 26'];
var MA_GUIDE={
  netrev:{ label:'Net-revenue growth', axis:'net-revenue growth (cn, ex-acq)',
    glo:[10,11,12,12,12,12,12,12,10,10,12], ghi:[12,13,13,13,14,14,14,13,11,11,14],
    words:['low double-digits','low double-digits','high end low-dd','low double-digits (FY: low-teens)','low-teens','low-teens','high end low-dd','high end low-dd','low end low-dd','low end low-dd (ME conflict)','high end low-dd'],
    act:[11,13,14,16,14,13,15,15,12,12,null],
    note:'The engine Mastercard keeps clearing: delivered net-revenue growth has landed <b>in the upper half of — or above — the guided band nearly every quarter</b>. The one deliberate step-<i>down</i> was the front of 2026: Q1 guided "low end of low-double-digits" (beaten at +12%), and Q2-26 was guided the same on the <b>Middle East conflict</b> — but the conflict hit lighter than feared and Q2 <b>landed +12%, above its low-end guide</b>, prompting management to nudge the FY guide <b>higher within</b> the range. Q3-26 is guided to the high end of low-double-digits (no actual yet).' },
  opex:{ label:'Operating-expense growth', axis:'operating-expense growth (cn, ex-acq)',
    glo:[9,9,10,10,10,10,10,10,8,9,10], ghi:[11,11,12,12,12,12,12,12,10,11,12],
    act:[9,10,10,11,11,10,10,10,9,10,null],
    words:['low double-digits','low double-digits','low double-digits','low double-digits','low double-digits','low double-digits','low double-digits','low double-digits','high-single-digit','low double-digits','low double-digits'],
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
//  Evolution ▸ EARNINGS — the decision layer (docs/EARNINGS_CONVENTIONS.md v2.10)
//  Ported from googl.js (canonical ce* machinery). THREE phases — Setup · Watch List
//  · Post-Results — as per-quarter blocks behind a phase-aware quarter selector. The
//  former Post-Call phase is dissolved: call highlights render inside Post-Results as
//  "Also on the call". The theme record (MA_THEMES) is FOLDED into the Watch List —
//  there is NO standalone Earnings Calls tab. Numeric grid + consensus are populated from the
//  Q2 2026 BBG export + reported actuals (Summit not covered for MA). Mastercard reports on a calendar year.
// ════════════════════════════════════════════════════════════════════════════
// Call Prep palette (Mastercard identity): red primary + orange custom-KPI accent.
var BRAND=MA_RED, BRAND2=MA_GREEN, BLUE='#2557D6', RED='#EA4335', YELLOW=MA_ORANGE, PURPLE='#7A5AF8', AMBER='#B7791F', GRAY='#6B7684';
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// EVOLUTION ▸ EARNINGS — v2.10 (ce* machinery, ported from googl.js). See docs/EARNINGS_CONVENTIONS.
// Migrated from the v2.4 "Call Prep" (cp*) format Jul 2026. THREE phases: Setup / Watch List /
// Post-Results (Post-Call dissolved; call highlights moved into Post-Results as "Also on the call").
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// ─── CE_CONS · the Street's rolling track record ────────────────────────────────────────────────
// Source: G:\My Drive\Summit\Docs\0\BBG_CONSENSUS.txt — the rolling Bloomberg snapshot archive,
// 12 MA snapshots, Oct 2023 → Jul 2026, newest `data_as_of` 2026-07-30. This file is the ONLY
// consensus source for Earnings. Spec, and every parse trap below: docs/EARNINGS_CONVENTIONS.md §6a.
//
// HOW THIS WAS DERIVED. The archive is a ROLLING consensus: each row is MA seen from one
// `data_as_of`. `fq0` is the last REPORTED quarter at that date and `fq+N` the Nth quarter after it,
// each carrying its own period label. Integrity checked on load: 12 snapshots × 6 quarter columns,
// 0 mismatches (fq+N == fq0+N, fq-3 == fq0-3, and each close_fqN == that quarter's calendar end).
//   q[]  = 19 quarters, Q4 2022 → Q2 2027, chronological. Index into qr/qa/qy/qq.
//   qr[] = per quarter, [4q out, 3q out, 2q out, 1q out] — fq+4..fq+1 of the snapshots at those
//          horizons. null where no snapshot covers it.
//   qa[] = the print (a later snapshot's `fq0`; the three earliest quarters come from `fq-3`).
//   qy[] = the YoY base (actual four quarters earlier)  ─┐ both actuals, so the grid can toggle
//   qq[] = the QoQ base (actual one quarter earlier)    ─┘ growth either way.
//   nHead = how many of m[] are headline metrics; the rest are the MA-specific customs.
//
// `u` is the display unit: '$B' (USD, archive scale M → divided by 1,000), '$' (EPS, no scale),
// 'B' (switched/processed transactions — a COUNT, so it must NEVER render with a dollar sign).
//
// EPS is the BBG GAAP-comparable line (IS_COMP_EPS_GAAP): qa for Q2 2026 = 4.97, vs the
// company-reported ADJUSTED $5.04 — the BBG value is kept for internal consistency with the BBG
// consensus (the 1q-out cons for Q2 2026 is 4.79). EVERY observation is here — nothing is sampled
// down. Adding a snapshot means REGENERATING this block, not appending to it.
//
// Two KPIs the BBG export does NOT carry as a clean line, mapped honestly:
//   · 'Cross-border volume' — NO BBG line (the file has purchase_volume/GDV and processed
//     transactions, not a cross-border series). Left all-null / nocons rather than faked.
//   · 'Switched transactions' — mapped to processed_transactions (PAYMENT_PROCESSING_TRANS), the
//     closest Mastercard line; a count in billions.
var CE_CONS = {
  src:'Bloomberg (BST) · BBG_CONSENSUS.txt snapshot archive',
  asOf:['2023-10-26','2024-01-31','2024-05-01','2024-07-31','2024-10-31','2025-01-30','2025-05-01','2025-07-31','2025-10-30','2026-01-29','2026-04-30','2026-07-30'],
  q:['Q4 2022','Q1 2023','Q2 2023','Q3 2023','Q4 2023','Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025','Q2 2025','Q3 2025','Q4 2025','Q1 2026','Q2 2026','Q3 2026','Q4 2026','Q1 2027','Q2 2027'],
  hz:['4q out','3q out','2q out','1q out'],
  nHead:4,
  m:[
    { k:'Net revenue', u:'$B', t:'ok', code:'SALES_REV_TURN',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,6.5],[null,null,6.5,6.3],[null,7,6.9,6.9],[7.4,7.3,7.3,7.3],[7.4,7.4,7.4,7.4],[7.2,7.1,7.2,7.1],[7.8,7.8,7.8,7.9],[8.2,8.2,8.2,8.4],[8.4,8.4,8.6,8.7],[8.1,8.1,8.3,8.3],[9,9.1,9.1,9.1],[9.6,9.7,9.7,9.6],[9.9,10,10,null],[9.4,9.4,null,null],[10.3,null,null,null]],
      qa:[5.8,5.7,6.3,6.5,6.5,6.3,7,7.4,7.5,7.3,8.1,8.6,8.8,8.4,9.3,null,null,null,null],
      qy:[null,null,null,null,5.8,5.7,6.3,6.5,6.5,6.3,7,7.4,7.5,7.3,8.1,8.6,8.8,8.4,9.3],
      qq:[null,5.8,5.7,6.3,6.5,6.5,6.3,7,7.4,7.5,7.3,8.1,8.6,8.8,8.4,9.3,null,null,null] },
    { k:'Operating income', u:'$B', t:'ok', code:'IS_COMPARABLE_EBIT',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,3.7],[null,null,3.8,3.7],[null,4.2,4.1,4],[4.4,4.3,4.3,4.3],[4.3,4.2,4.2,4.2],[4.3,4.2,4.3,4.2],[4.6,4.7,4.6,4.7],[4.9,4.8,4.8,4.9],[4.8,4.7,4.8,4.9],[4.8,4.9,4.9,5],[5.4,5.5,5.5,5.5],[5.7,5.8,5.8,5.8],[5.8,5.8,5.8,null],[5.7,5.7,null,null],[6.2,null,null,null]],
      qa:[3.2,3.3,3.7,3.8,3.7,3.7,4.1,4.4,4.2,4.3,4.9,5.1,5.1,5.1,5.7,null,null,null,null],
      qy:[null,null,null,null,3.2,3.3,3.7,3.8,3.7,3.7,4.1,4.4,4.2,4.3,4.9,5.1,5.1,5.1,5.7],
      qq:[null,3.2,3.3,3.7,3.8,3.7,3.7,4.1,4.4,4.2,4.3,4.9,5.1,5.1,5.1,5.7,null,null,null] },
    { k:'EPS', u:'$', t:'ok', code:'IS_COMP_EPS_GAAP',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,3.13],[null,null,3.25,3.23],[null,3.58,3.57,3.52],[3.79,3.8,3.74,3.69],[3.76,3.74,3.7,3.71],[3.76,3.77,3.74,3.62],[4.16,4.1,3.97,4],[4.32,4.17,4.12,4.25],[4.2,4.09,4.16,4.24],[4.23,4.25,4.28,4.31],[4.74,4.78,4.8,4.79],[5.04,5.1,5.11,5.09],[5.12,5.2,5.19,null],[4.97,5.09,null,null],[5.59,null,null,null]],
      qa:[2.62,2.47,3,3.39,2.97,3.22,3.5,3.53,3.64,3.59,4.07,4.34,4.52,4.35,4.97,null,null,null,null],
      qy:[null,null,null,null,2.62,2.47,3,3.39,2.97,3.22,3.5,3.53,3.64,3.59,4.07,4.34,4.52,4.35,4.97],
      qq:[null,2.62,2.47,3,3.39,2.97,3.22,3.5,3.53,3.64,3.59,4.07,4.34,4.52,4.35,4.97,null,null,null] },
    { k:'EBITDA', u:'$B', t:'ok', code:'IS_COMPARABLE_EBITDA',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,3.9],[null,null,4,3.9],[null,4.4,4.3,4.3],[4.6,4.6,4.5,4.5],[4.5,4.5,4.4,4.4],[4.5,4.5,4.5,4.4],[4.9,4.9,4.9,4.9],[5.1,5.1,5,5.2],[5.1,5,5.1,5.2],[5.1,5.1,5.2,5.2],[5.7,5.8,5.8,5.8],[6,6.1,6.1,6.1],[6.1,6.2,6.2,null],[6,6,null,null],[6.5,null,null,null]],
      qa:[3.4,3.5,3.9,4.1,3.9,3.9,4.4,4.6,4.4,4.4,5.2,5.4,5.4,5.4,6,null,null,null,null],
      qy:[null,null,null,null,3.4,3.5,3.9,4.1,3.9,3.9,4.4,4.6,4.4,4.4,5.2,5.4,5.4,5.4,6],
      qq:[null,3.4,3.5,3.9,4.1,3.9,3.9,4.4,4.6,4.4,4.4,5.2,5.4,5.4,5.4,6,null,null,null] },
    { k:'GDV', u:'$B', t:'ok', code:'NTWK_SPENDNG_VOL_PURCHSE',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,1928.4],[null,null,1882.5,1882.9],[null,2021.9,2028.7,2021.3],[2069.4,2079.2,2073.2,2056],[2133.2,2119.7,2100.6,2107.4],[2076.8,2051.8,2054.6,2040.1],[2194.7,2171.2,2157.8,2159.1],[2259.5,2240.8,2241,2259.4],[2303.3,2306.2,2326.1,2338.6],[2211,2197.5,2195.3,2189.4],[2384.7,2393.5,2380.5,2392.8],[2490.7,2480.7,2493.6,2495.2],[2557.1,2573.4,2575.3,null],[2440.8,2465.4,null,null],[2620.4,null,null,null]],
      qa:[1728,1707,1839,1879,1920,1871,1975,2058,2114,1993,2182,2280,2344,2251,2417,null,null,null,null],
      qy:[null,null,null,null,1728,1707,1839,1879,1920,1871,1975,2058,2114,1993,2182,2280,2344,2251,2417],
      qq:[null,1728,1707,1839,1879,1920,1871,1975,2058,2114,1993,2182,2280,2344,2251,2417,null,null,null] },
    { k:'Cross-border volume', u:'%', t:'nocons', code:null,
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],
      qa:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      qy:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
      qq:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null] },   // no BBG line — left null
    { k:'Switched transactions', u:'B', t:'ok', code:'PAYMENT_PROCESSING_TRANS',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,38.2],[null,null,36.2,36.3],[null,39.6,39.5,39.5],[41.3,41.3,41.4,41.3],[42.4,42.5,42.3,42.1],[40.5,40.7,40.7,40.5],[43.9,43.9,43.7,43.6],[45.8,45.5,45.3,45.3],[46.7,46.5,46.5,46.4],[44.7,44.3,44.2,44.2],[48,48,47.9,47.7],[49.9,49.8,49.8,49.6],[51.1,51,50.9,null],[48.6,48.2,null,null],[52.4,null,null,null]],
      qa:[34,32.5,35.5,37.2,38.1,36.7,39.4,41.1,42.2,40.1,43.5,45.4,46.5,43.8,47.4,null,null,null,null],
      qy:[null,null,null,null,34,32.5,35.5,37.2,38.1,36.7,39.4,41.1,42.2,40.1,43.5,45.4,46.5,43.8,47.4],
      qq:[null,34,32.5,35.5,37.2,38.1,36.7,39.4,41.1,42.2,40.1,43.5,45.4,46.5,43.8,47.4,null,null,null] },
    { k:'VAS revenue', u:'$B', t:'ok', code:'SALES_REV_TURN',
      qr:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,2.5],[null,null,2.4,2.4],[null,2.5,2.5,2.6],[2.7,2.7,2.7,2.7],[3,3.1,3.1,3.1],[2.8,2.8,2.8,2.8],[3,3,3,3],[3.2,3.2,3.2,3.3],[3.6,3.6,3.7,3.7],[3.3,3.3,3.4,3.4],[3.6,3.7,3.8,3.8],[3.9,4,4,4],[4.5,4.5,4.5,null],[4,4,null,null],[4.4,null,null,null]],
      qa:[null,2.1,2.2,2.3,2.7,2.4,2.6,2.7,3.1,2.8,3.2,3.4,3.9,3.5,3.8,null,null,null,null],
      qy:[null,null,null,null,null,2.1,2.2,2.3,2.7,2.4,2.6,2.7,3.1,2.8,3.2,3.4,3.9,3.5,3.8],
      qq:[null,null,2.1,2.2,2.3,2.7,2.4,2.6,2.7,3.1,2.8,3.2,3.4,3.9,3.5,3.8,null,null,null] },
  ]
};
// Annual FY view (Setup chart): reported actuals (archive fy0) + BBG consensus (forward fy+N). MA
// DOES issue numeric FY guidance (net-revenue-growth ranges, opex), so guidance:true — but that band
// is NOT a Bloomberg line; it is authored separately, not fabricated here. summit is null (MA is not
// in the Summit DCF universe). Values $B (archive scale M → /1,000).
var CE_ANNUAL = {
  years:[2022,2023,2024,2025,2026,2027],
  guidance:true,                                            // MA issues numeric FY guidance (authored elsewhere, not in BBG)
  m:[
    { k:'Net revenue', u:'$B', actual:[22.2,25.1,28.2,32.8,null,null], bbg:[null,null,null,null,37.1,41.8], summit:[null,null,null,null,null,null] },
    { k:'Operating income', u:'$B', actual:[12.7,14.5,16.5,19.4,null,null], bbg:[null,null,null,null,22.1,24.6], summit:[null,null,null,null,null,null] },
    { k:'EBITDA', u:'$B', actual:[13.4,15.3,17.4,20.5,null,null], bbg:[null,null,null,null,23.4,26.5], summit:[null,null,null,null,null,null] }
  ]
};

var CALL_EARNINGS = { ticker:'MA', quarters:[
  // ── UPCOMING: Q3 2026 (quarter ending Sep 2026; reports ~late Oct 2026) — Setup grounded in the Q2 call guidance ──
  { q:'Q3 2026', status:'upcoming', date:'reports ~late October 2026',
    setup:{
      source:'Q2 2026 call guidance (Mehra) — Bloomberg BST consensus to import from the export', asOf:null,
      notes:{
        'Net revenue':{ t:'Guided high end of low-double-digits (cc, ex-inorganic)', h:'Management guided Q3 net-revenue growth to the <b>high end of a low-double-digits</b> range (cc, ex-inorganic) — a step UP from the low-end framing that governed Q2. Minimal inorganic impact, and a ~0.5 PPT FX <b>headwind</b> given the recent USD trajectory. Street consensus is in the grid (Summit not covered for MA).' },
        'EPS':{ t:'OI&E ~$125M; tax 20–21%', h:'Q3 OI&E expense guided to ~$125M (higher sequentially, driven by incremental interest from the June bond issuance); non-GAAP tax rate 20–21% for both Q3 and Q4. Opex guided to low-double-digits (cc, ex-inorganic) with a 0.5 PPT inorganic headwind and a 0 to +0.5 PPT FX tailwind. BVNK expected to close in Q3 (minimal net-revenue impact, some opex).' }
      },
      us:null,
      // v2.10: marketDebate retired — fear/real prose relocated INTO debate.synth so nothing is lost; mech dropped.
      debate:{ rows:null, synth:'The one thing to resolve: <b>can the beat travel without its two idiosyncratic helpers?</b> Q2 was flattered by a lighter-than-feared Middle East and a Venezuela cross-border surge (USD availability, where Mastercard is market leader) — neither is a run-rate driver. <b>What to watch:</b> the first guide under new CFO Ling Hai (effective Aug 3), whether BVNK actually closes in Q3 and its day-one economics, whether Venezuela persists or fades, whether the Middle East stays moderated at end-of-Q2 levels, and whether VAS holds ~18%. <b>What management guided:</b> net-revenue growth at the <b>high end</b> of low-double-digits (cc, ex-inorganic) with a ~0.5 PPT FX headwind; opex at low-double-digits (cc, ex-inorganic) with a 0.5 PPT inorganic headwind and a 0 to +0.5 PPT FX tailwind; OI&E ~$125M; tax 20–21%.' },
      pricedIn:'A beat-and-raise just cleared: Q2 net revenue +12% cn, EPS $5.04 (+19%), and the FY guide nudged higher within the low-double-digits range. Into Q3 the bar rises — management itself guided the high end of low-double-digits — but two of Q2\'s upside sources (Middle East relief, Venezuela) are idiosyncratic, and it is the first quarter under a new CFO.',
      oneLiner:'The bar is "prove the beat travels" — can Q3 hold the high end of low-double-digits under new CFO Ling Hai once the Middle East and Venezuela tailwinds are in the base, with BVNK closing and VAS still ~18%?' },
    // Q3 seeds (from the Q2 call) — data-only record; the LIVE tracking is the Q3 Watch List rows (wl016–020).
    newQuestions:[
      {n:'First quarter/guide under new CFO Ling Hai — any change in tone or disclosure?', landed:{q:'Q3 2026', rank:1}},
      {n:'Does BVNK actually close in Q3, and what are the day-one economics / integration notes?', landed:{q:'Q3 2026', rank:2}},
      {n:'Does the Venezuela cross-border surge persist or fade (idiosyncratic USD-availability driver)?', landed:{q:'Q3 2026', rank:3}},
      {n:'Does the Middle East stay moderated at the end-of-Q2 level?', landed:{q:'Q3 2026', rank:4}},
      {n:'Does VAS hold ~18% organically?', landed:{q:'Q3 2026', rank:5}}
    ],
    results:null, call:null },

  // ── REPORTED: Q2 2026 (quarter ended Jun 2026; reported Jul 30 2026) — Sachin Mehra's last call as CFO ──
  { q:'Q2 2026', status:'reported', date:'July 30, 2026',
    setup:{
      source:'Bloomberg BST consensus — to import from the export', asOf:null,
      notes:{
        'Net revenue':{ t:'Guided low end of low-double-digits (cc)', h:'Management guided Q2 net-revenue growth to the <b>low end of a low-double-digits</b> range (cc, ex-inorganic) — the Middle-East conflict is the reason; without it, Q2 would have been "generally in line with Q1." A ~1–2 PPT FX tailwind on the nominal number. Street/Summit fill from the Bloomberg export.' },
        'EPS':{ t:'OI&E steps up in Q2', h:'Q2 OI&E expense guided to ~$150M (vs a Q1 aided by one-time items + government grants that do not repeat), plus lower cash / higher debt from the accelerated buyback and a one-time disposition drag. Tax rate 20–21%.' }
      },
      us:null,
      // v2.10: marketDebate retired — fear/real prose relocated INTO debate.synth so nothing is lost; mech dropped.
      debate:{ rows:null, synth:'The one thing to resolve: is the guided Q2 trough <b>the war and only the war</b> (recovering progressively H2 as management assumes) — or is some of it <b>structural</b> (switched-transaction mix, cross-border normalization) that outlasts a ceasefire? <b>What the tape fears:</b> that the Q2 guide-down is not just the war — that cross-border travel (8%→2% into April) and switched-transaction growth (9%) mark a real deceleration, and the "conflict ends in Q2" base case is a hope the print can\'t back. <b>What consensus actually models:</b> the cut as almost entirely the conflict (GCC+Israel ≈ 6% of cross-border), with the FY currency-neutral guide UNCHANGED (the raise is FX) and VAS ~40% of revenue still compounding high-teens — i.e. a Q2 trough by assumption, recovering H2 as guided.' },
      pricedIn:'Guided to the low end of low-double-digits (cc) on the Middle-East conflict — the war was the whole debate. The FY currency-neutral guide was unchanged (the nominal raise was FX); the open question was whether the Q2 trough was the war and only the war, recovering through H2 as management assumed.',
      oneLiner:'The bar was "is the Q2 trough just the war?" — Mastercard beat it: the Middle East hit lighter than feared, a Venezuela cross-border surge added upside, VAS held +18%, net revenue landed +12%, and the FY guide nudged HIGHER within range.' },
    results:{
      // Authored from the Q2 2026 transcript (docs/calls/MA-latest.md). Growth rates, EPS $5.04, and
      // other-network-assessments $326M are quoted. The CE_CONS grid is now populated from the Q2 2026
      // BBG export (GAAP-comparable consensus) + reported actuals; Summit is not covered for MA.
      summary:{ paras:[
        { p:'A clean <b>beat-and-raise on Sachin Mehra\'s last call as CFO</b>. Net revenue <b>+12% cn</b> (above management\'s own expectations), <b>EPS $5.04 (+19% YoY, incl. $0.14 from buybacks)</b>, adjusted net income +16%, operating income +14% on +10% opex — and that opex line itself carried a <b>1 PPT disposition benefit</b>. The deliberately low Q2 bar set in Q1 (the low end of low-double-digits on the Middle-East conflict) was cleared by a wide margin.',
          more:{ body:'<p>Every headline broke the right way. Net income +16%, EPS +19% to $5.04 driven primarily by the strong operating-income growth; the $0.14 buyback contribution reflects an accelerated repurchase pace.</p>', nodes:[
            { t:'The algorithm this quarter', body:'<p>Payment Network net revenue +8% (domestic + cross-border volume/transactions and pricing, including growth in rebates &amp; incentives); Value-Added Services &amp; Solutions net revenue +18%. Operating income +14% on +10% opex — positive operating leverage, aided by ~1 PPT from dispositions.</p>' }
          ] } },
        { p:'The <b>full-year guide moved HIGHER within</b> the low-double-digits range (cc, ex-inorganic) on the stronger first half — the same range as before, but management now expects to land higher in it, with a ~1 PPT FX <b>tailwind</b>. The Q1 posture ("cn range unchanged, the raise is FX") flips to a genuine raise.' },
        { p:'The beat was broad but <b>three-sourced</b>: a <b>lighter-than-feared Middle East</b> (impacts moderated through Q2 and were less severe than assumed; management now expects them to stay near end-of-Q2 levels), an <b>uptick in cross-border spend out of Venezuela</b> (increased USD availability, where Mastercard is the market leader — it shows up in card-not-present ex-travel debit), and <b>strong VAS demand</b> (+18% cn). Two of the three — Middle-East relief and Venezuela — are idiosyncratic and non-repeatable, so watch the underlying run-rate, not the headline.' },
        { p:'<b>Cross-border volume +12%</b>; <b>card-not-present ex-travel +20%</b> (Venezuela plus the timing of large retail promotional events); travel improved sequentially versus the April run-rate on lower Middle-East impact. The virtuous-cycle numerators kept climbing: <b>switching penetration 72%</b> (from 70% in Q1), <b>tokens &gt;40%</b> of switched transactions, <b>contactless 80%</b> of in-person (+5 PPT YoY). Switched transactions +9% overall; ex-Capital One debit, US switched volume +10% (+2 PPT sequentially) on higher fuel spend.',
          more:{ body:'<p>Other network assessments were $326M in the quarter. Cross-border assessments +20% (vs +12% volume) on international pricing and mix; transaction-processing assessments +12% (vs +9% switched) on mix and pricing; domestic assessments +10% (vs +8% GDV) on pricing.</p>' } },
        { p:'<b>Capital return accelerated again</b>: $4.9B repurchased in-quarter plus ~$700M through July 27 — above the Q1 pace. And the one genuinely new variable is <b>leadership</b>: Sachin Mehra moves to Chief Business Officer and <b>Ling Hai becomes CFO effective August 3</b>, so Q3 is the first guide under a new CFO (continuity was messaged heavily, "from a position of strength").' },
        { p:'The <b>forward narrative escalated</b>. <b>Agent Pay for Machines</b> extends the network into machine-to-machine payments (on-chain permissioning / off-chain settlement, 30+ launch partners) — management calls it "the only network" enabling M2M. On stablecoins, <b>OpenUSD</b> (a 140-company open-standard consortium) goes live later this year, crypto co-brand volume has more than tripled in two years, and <b>BVNK is now expected to close in Q3</b> (was Q1\'s "planned"); the model is bps on volume in a market MA doesn\'t touch today. Europe\'s purchase-volume deceleration is deliberate — lapping the 2024 win wave and passing on unprofitable deals (e.g. Lloyds Credit): "profitable volume, not volume for its own sake."' }
      ] },
      notes:{
        'Net revenue':{ t:'+12% cn — above expectations', h:'Payment Network +8% and VAS +18%, with minimal disposition impact. Above management\'s own Q2 expectations; the beat was broad but partly idiosyncratic (lighter Middle East, Venezuela).' },
        'EPS':{ t:'$5.04, +19%', h:'Driven primarily by strong operating-income growth (+14%); includes a $0.14 contribution from share repurchases. Net income +16%. Buybacks: $4.9B in-quarter + ~$700M through Jul 27.' },
        'Cross-border volume':{ t:'+12%; CNP ex-travel +20%', h:'Both travel and non-travel grew; CNP ex-travel +20% on Venezuela USD availability (MA is market leader) and the timing of large retail promotional events. Cross-border assessments +20% on international pricing and mix.' },
        'Switched transactions':{ t:'+9%; ex-CapOne US +10%', h:'Generally in line with Q1. Ex-Capital One debit, US switched volume +10% (+2 PPT sequentially) on higher fuel spend. Tokens >40% of switched, contactless 80% of in-person, switching penetration 72%.' },
        'VAS revenue':{ t:'+18% cn', h:'~60% network-linked; strong security demand. Threat Intelligence identified 7M+ card-testing transactions across 192 countries in its first three quarters, preventing an estimated $172M in fraud.' }
      },
      watch:{ 'Cross-border volume':1, 'Switched transactions':3, 'VAS revenue':4 },
      thesisCheck:[
        {line:'Middle-East conflict vs the "ends in Q2" base case', tripped:false, note:'RESOLVED — impacts moderated through Q2 and were less severe than anticipated; management now expects the Middle-East impact to stay near end-of-Q2 levels for the rest of the year. Net revenue beat at +12% cn. The Q1 guide-down risk did not materialize.'},
        {line:'BVNK / stablecoin take-rate economics', tripped:false, note:'CARRY — still open. BVNK now expected to close in Q3 (slipped from the Q1 "planned"); economics still framed as bps on volume in a market MA doesn\'t touch today. No day-one take-rate / margin numbers yet.'},
        {line:'Switched-transaction growth (9% transitory vs structural)', tripped:false, note:'Leaning transitory — switched +9%, generally in line with Q1; ex-Capital One US switched volume +10% (+2 PPT sequentially) on higher fuel spend. Mix-driven, not a demand problem.'},
        {line:'Organic VAS holds high-teens', tripped:false, note:'CONFIRMED — VAS +18% cn, ~60% network-linked; strong security demand (Threat Intelligence: 7M+ card-testing txns across 192 countries, ~$172M fraud prevented).'},
        {line:'Rebates & incentives contained, net yield rising', tripped:false, note:'HELD — R&I came in essentially in line with expectations in Q2; guided slightly higher as a % of payment-network assessments into Q3 on deal timing. Cross-border and domestic pricing still lifting yield.'}
      ],
      intoCall:[
        'First guide under new CFO Ling Hai — any change in framing or disclosure vs Sachin\'s cadence, effective Aug 3?',
        'Does BVNK close in Q3 — and what are the day-one economics (bps on volume) as it consolidates?',
        'Does the Venezuela cross-border surge persist or fade — now that USD availability is in the base?'
      ],
      priceReaction:'to fill from a trusted source' },
    // call block KEPT as data — only call.highlights (non-'lead') renders as "Also on the call".
    call:{
      take:'A beat-and-raise on Sachin Mehra\'s last call as CFO: the Q1 fears (Middle East, cross-border) resolved better than the base case, an idiosyncratic Venezuela surge added upside, and VAS held +18%. The forward story escalated (Agent Pay for Machines, OpenUSD) while BVNK slipped to a Q3 close; the one genuinely new variable is leadership — Ling Hai takes the CFO seat Aug 3.',
      highlights:[
        { tag:'dots', band:'context', head:'The cross-border acceleration was <b>Middle-East recovery + a Venezuela surge</b> — not (clearly) the World Cup.',
          detail:'<p>Sanjay Sakhrani asked what drove cross-border from April → June → July. Sachin: better <b>outbound spend from the impacted GCC countries</b> (tied to returning flight capacity), plus <b>Venezuela</b> — increased U.S.-dollar availability there let consumers spend USD cross-border, mostly in <b>card-not-present ex-travel</b> (a debit market where Mastercard is the market leader). World Cup impact was "hard to identify."</p><p>The tell: two of the three drivers (Middle-East relief, Venezuela) are idiosyncratic — watch whether they persist into the run-rate.</p>' },
        { tag:'thesis', band:'context', head:'"Run anything, anywhere" — switching flexes beyond the UAE.',
          detail:'<p>Andrew Jeffrey asked which other markets get the UAE treatment (and whether Europe is ripe). Michael tied it to the <b>2022 technology strategy</b> that made the network modular: the UAE / Al Etihad Payments / Jaywan switch is incremental volume; South Africa runs a real-time switch that carries <b>any ISO 20022 or card transaction</b>. Europe is competitive (digital euro, local giros, co-badge, wallets like Swish/Bizum) — Mastercard is card-first there for now but "has the flexibility."</p>' },
        { tag:'thesis', band:'context', head:'Cyber is moving to the <b>center</b> of the VAS story.',
          detail:'<p>Dan Dolev asked about the cyber-demand inflection. Michael: the portfolio spans <b>fraud → identity → cyber</b> (strengthened by Recorded Future); cybersecurity now occupies CEOs and boards, and frontier models are "both a threat and a tool." Mastercard Threat Intelligence has flagged <b>7M+ card-testing transactions across 192 countries</b>, preventing an estimated <b>$172M</b> in fraud — and it is attached to the transaction growth (the flywheel).</p>' },
        { tag:'watch', band:'context', head:'Europe deceleration is <b>deliberate</b> — lapping the 2024 win wave + walking from unprofitable deals.',
          detail:'<p>Harshita Rawat asked why European purchase-volume growth decelerated from the mid-teens. Sachin: Europe grew <b>16% in Q2 2024</b> on the Santander / NatWest / UniCredit win wave; that is now lapping. Mastercard also <b>passed on Lloyds Credit</b> once the economics stopped making sense — "profitable volume, not volume for the sake of volume." A discipline signal, not a share problem — but watch the optics of a decelerating flagship region.</p>' },
        { tag:'thesis', band:'logged', head:'U.S. strength is broad-based; the affluent still outgrows mass.',
          detail:'<p>Tien-tsin Huang probed the 10% ex-Cap-One U.S. switched growth. Sachin: a <b>fuel</b> tailwind plus some (unquantifiable) <b>World Cup</b> lift; broad across credit/debit and consumer/commercial; <b>mass and affluent both healthy, affluent structurally higher</b> — "not a new phenomenon."</p>' },
        { tag:'dots', band:'context', head:'VAS is deliberately <b>network-agnostic</b> — and pushing into account-to-account fraud.',
          detail:'<p>Tim Chiodo asked about the agnostic nature of the security suite. Michael: fraud/identity/cyber cut across card networks <i>and</i> non-payment use cases, and now into <b>account-to-account scams</b> (built on VocaLink real-time expertise, via a UK bank consortium). Sachin: ~<b>60% of VAS is network-linked</b>; the other ~40% (marketing/consulting) grows at a healthy clip, so the balance is deliberate.</p>' },
        { tag:'curious', band:'logged', head:'Machine-to-machine: Agent Pay for Machines is "the only network protocol" for M2M.',
          detail:'<p>On agentic (Ramsey El-Assal), Michael separated three lanes: consumer agentic (cards prevail, via Verifiable Intent), B2B agentic (cards again), and a genuinely new one — <b>machine-to-machine</b>, low-value/high-velocity payments where settlement runs over "different rails" (stablecoins <i>or</i> others). Agent Pay for Machines launched with <b>30+ partners</b> (Adyen, Ant, BVNK, Cloudflare, Coinbase, OKX). Early; a TAM expansion, no volumes yet.</p>' },
        { tag:'tone', band:'logged', head:'Housekeeping: rebates roughly flat, BVNK closes Q3, OpenUSD via a 140-company consortium.',
          detail:'<p>Matthew O\'Neill on rebates & incentives: in line in Q2, expected <b>slightly higher</b> as a % of payment-network assessments in Q3 (deal timing); the pipeline is rich. <b>BVNK closes in Q3</b> — minimal net-revenue impact, some opex, already in the recs. James Faucette on the open standard: <b>OpenUSD</b> runs through a <b>140+ company consortium</b> (a neutral market utility, payments-focused, distributed economics), one coin among many (USDC, USDG).</p>' }
      ],
      dots:'Every line that worried the Street in Q1 broke the right way, and two of the three beat drivers (Middle-East relief, Venezuela) were idiosyncratic — so the tell is the underlying run-rate, not the headline. The durable engine (VAS +18%, switching to 72%) carried; the forward optionality (M2M, OpenUSD, BVNK) escalated in narrative but not yet in numbers. The one new variable is the CFO handoff.',
      threeMinutes:[
        '<b>Beat-and-raise on Sachin\'s last call: net revenue +12%, EPS $5.04 (+19%), FY guide nudged higher within range.</b> The Q1 Middle-East fear resolved lighter than the base case, an idiosyncratic Venezuela cross-border surge (USD availability, Mastercard the market leader) added upside, and VAS held +18%. Two of three drivers are non-repeatable — watch the run-rate.',
        '<b>The forward bets escalated but stayed narrative: Agent Pay for Machines (machine-to-machine, "the only network" doing it) and OpenUSD (a 140-company consortium).</b> BVNK slips to a Q3 close. Treat all three as new-flows optionality — the first real volume/take-rate disclosure is the catalyst.',
        '<b>Leadership is the genuinely new variable: Sachin Mehra → Chief Business Officer, Ling Hai → CFO effective Aug 3.</b> Next quarter is the first guide under a new CFO — watch for any change in framing or disclosure; continuity was messaged heavily.'
      ],
      notBringing:[
        {item:'Individual deal wins (JPMorgan/Chase Freedom Flex, Banamex, Revolut, Eurobank)', why:'Confirm momentum but everyone has the release — not a debate.'},
        {item:'World Cup lift', why:'Management explicitly could not quantify it; directional only.'},
        {item:'SessionM / disposition benefit', why:'The 1 ppt opex benefit is mechanical and already disclosed; not thesis-moving.'}
      ],
      newQuestions:[
        {n:'First guide under new CFO Ling Hai — any change in framing or disclosure?', landed:{q:'Q3 2026', rank:1}},
        {n:'Does BVNK close in Q3, and what are the day-one economics / integration notes?', landed:{q:'Q3 2026', rank:2}},
        {n:'Does the Venezuela cross-border surge persist or fade (idiosyncratic USD-availability driver)?', landed:{q:'Q3 2026', rank:3}},
        {n:'Does the Middle East stay moderated at the end-of-Q2 level?', landed:{q:'Q3 2026', rank:4}},
        {n:'Does VAS hold ~18% organically?', landed:{q:'Q3 2026', rank:5}}
      ] } },

  // ── REPORTED: Q1 2026 (quarter ended Mar 2026; reported Apr 30 2026) ──
  { q:'Q1 2026', status:'reported', date:'April 30, 2026',
    setup:{ source:'Bloomberg BST consensus (archived) — precise figures to backfill', us:null,
      debate:{ rows:null, synth:null },
      pricedIn:'A solid start to 2026: net revenue low-double-digits cc, GDV ~7%, cross-border healthy, VAS high-teens. FX volatility a swing factor; the open question was how much the newly-erupted Middle-East conflict would dent cross-border travel.',
      oneLiner:'The bar was "steady network + strong VAS, watch cross-border travel and the war" — Mastercard cleared the print but cut the Q2 guide on the conflict, betting it ends in Q2.' },
    results:{
      // "Call summary — the minute" authored from the transcript. Seeded from the
      // old results.headline + call.take prose (nothing deleted; relocated here).
      summary:{ paras:[
        { p:'A solid print undercut by a conflict-driven guide-down: net revenue +12% cc, net income +15%, EPS +18% to $4.60 — but Q2 was cut to the low end of low-double-digits on the Middle-East conflict, with management assuming it ENDS in Q2 (FY cc guide unchanged; the raise is FX).' },
        { p:'A solid print whose <b>forward setup is one big assumption</b>: management cut Q2 to the low end of low-double-digits on the Middle-East conflict and built the whole H2 recovery on the conflict <b>ending in Q2</b> — while refusing to model any other scenario. Underneath, VAS (~40% of revenue, +18% cc organic) is doing the work and BVNK signals a real stablecoin-infrastructure pivot; the wobble is switched-transaction growth at 9%.' }
      ] },
      // notes carried over from the old scorecard[] (relocated, keyed by metric — CE_CONS names where
      // they map, original labels otherwise so no prose is lost). Numbers land via CE_CONS.
      notes:{
        'EPS':{ t:'Aided by discrete tax + buyback', h:'+18% on strong operating income, a lower Q1 tax rate (discrete SBC benefits), and a $0.10 buyback contribution.' },
        'Switched transactions':{ t:'The soft metric', h:'Decelerated vs historical low-double/low-teens; Sachin: geographic + average-ticket mix (Russia exit; adding Japan/Mexico switching), not demand.' },
        'VAS revenue':{ t:'~40% of revenue', h:'No acquisition impact (Recorded Future lapped); broad-based across security, digital/authentication, insights, engagement.' },
        'Cross-border volume':{ t:'CNP ex-travel +18%', h:'Overall cross-border healthy; the weakness is specifically travel from the conflict.' },
        'Q2 net-revenue guide (conflict cut)':{ t:'The real news in the print', h:'Cut on the Middle-East conflict; without it, Q2 "would have been generally in line with Q1." Assumes the conflict ends in Q2. FY currency-neutral guide unchanged.' },
        'Cross-border travel (April run-rate)':{ t:'The conflict, made visible', h:'Sachin ranked the drivers: (1) conflict, (2) portfolio shifts, (3) Ramadan/Easter timing. GCC+Israel ≈ 6% of cross-border volume.' }
      },
      // watch{metric:rank} carried from old scorecard[].watchRank (keyed by CE_CONS metric name).
      watch:{ 'Cross-border volume':2, 'Switched transactions':3, 'VAS revenue':4 },
      thesisCheck:[
        {line:'VAS holds high-teens organically', tripped:false, note:'VAS +18% cc with no acquisition impact — held.'},
        {line:'Consumer / cross-border resilient', tripped:false, note:'Cross-border +13%; CNP ex-travel +18%; consumer healthy — held, but travel dented by the conflict (watch).'},
        {line:'Switched growth re-accelerates off Cap-One', tripped:true, note:'⚑ Switched +9% (+10% ex-Cap-One) — decelerated vs history on geographic/ticket mix; did not re-accelerate.'},
        {line:'Capital One credit volume retained', tripped:false, note:'Migration "basically complete"; management reaffirmed the value but wouldn\'t quantify retained volume — held, unproven.'},
        {line:'FY26 H1<H2 shape intact', tripped:false, note:'Reaffirmed; conflict makes Q2 the trough, recovering H2 — held on the assumption the war ends in Q2.'}
      ],
      intoCall:[
        'What happens to the guide if the Middle-East conflict does NOT end in Q2?',
        'What are the real economics (take rate) of BVNK / stablecoin infrastructure?',
        'Is the switched-transaction decel to 9% mix (transitory) or structural?'
      ],
      priceReaction:'to fill from a trusted source' },
    // call block KEPT as data — only call.highlights renders (via ceHighlightsBlock, "Also on the call").
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
          detail:'<p>The Amazon US SMB co-brand (issued by U.S. Bank) moves to Mastercard from another network; affluent momentum via World Legend (3x higher cross-border spend vs World Elite) and Mastercard One Credential (SoFi Smart Card).</p>' }
      ],
      dots:'The two loudest strategic stories — the <b>conflict-driven guide</b> and <b>BVNK</b> — are both bets on things management can\'t fully see: a ceasefire timeline and an unproven stablecoin take rate. Underneath, the durable engine (VAS ~40% of revenue) held and the one real wobble (switched transactions at 9%) was explained as mix. The print is fine; the <b>forward</b> is an assumption stack.',
      threeMinutes:[
        '<b>Solid quarter, but the Q2/H2 setup hinges on one assumption: the Middle-East conflict ends in Q2.</b> Cross-border travel already fell from 8% to 2% growth; GCC+Israel is ~6% of cross-border. Management sized it but refused to model a longer war, and the FY currency-neutral guide is unchanged (the raise is FX). The debate isn\'t the print — it\'s whether the guide\'s central assumption holds.',
        '<b>BVNK is the strategic tell: Mastercard is buying into stablecoin infrastructure, not just co-brands.</b> Economics are "bps on volume" in a market they don\'t touch today (accretive, per Sachin), aimed at payouts / remittances / B2B cross-border. Treat it as new-flows optionality and watch for the first real volume or take-rate disclosure.',
        '<b>VAS at ~40% of revenue and +18% cc organic is carrying the model</b> — security (Recorded Future), Ethoca, the consulting flywheel. The switched-transaction decel to 9% is mix (geography, average ticket), not demand — but it\'s the metric to keep honest.'
      ],
      notBringing:[
        {item:'CCCA / credit rate-cap regulatory', why:'Long-standing; "all but dead for now," no near-term resolution or direct model impact (Mastercard doesn\'t set rates).'},
        {item:'SessionM disposition', why:'Small, one-time (the loyalty-business sale); clarified on the call, not thesis-moving.'},
        {item:'Individual deal wins (Amazon SMB, Westpac)', why:'Confirm momentum but everyone has the release — not a debate.'}
      ],
      newQuestions:[
        {n:'What happens to the guide if the Middle-East conflict does not end in Q2?', landed:{q:'Q2 2026', rank:1}, tripped:false},
        {n:'What are the real economics (take rate) of BVNK / stablecoin infrastructure?', landed:{q:'Q2 2026', rank:2}},
        {n:'Is the switched-transaction decel to 9% mix (transitory) or structural?', landed:{q:'Q2 2026', rank:3}},
        {n:'Does organic VAS hold high-teens as Recorded Future laps?', landed:{q:'Q2 2026', rank:4}},
        {n:'Do rebates & incentives stay contained, keeping net yield rising?', landed:{q:'Q2 2026', rank:5}}
      ] } },

  // ── REPORTED: Q4 2025 (quarter ended Dec 2025; reported Jan 29 2026) ──
  { q:'Q4 2025', status:'reported', date:'January 29, 2026',
    setup:{ source:'Bloomberg BST consensus (archived) — precise figures to backfill', us:null,
      debate:{ rows:null, synth:null },
      pricedIn:'A strong close to 2025: net revenue low-teens cc, VAS ~20%, cross-border healthy, switched double digits. The overhang was the Capital One debit loss to Discover; the open question was FY26 framing and the shape of the year.',
      oneLiner:'The bar was "finish 2025 strong and set a credible FY26" — Mastercard beat (+15% cc, VAS +22%), renewed Capital One CREDIT, and framed FY26 at the high end of low-double-digits.' },
    results:{
      summary:{ paras:[
        { p:'A strong close to 2025: net revenue +15% cc, VAS +22% cc (+19% ex-acq), EPS $4.76 (+20%) — and, strategically, the Capital One CREDIT renewal flips a known overhang; FY26 framed at the high end of low-double-digits cc with H1<H2.' },
        { p:'A strong finish to 2025 (+15% cc, VAS +22%) with a strategic win underneath: the <b>Capital One CREDIT renewal</b> partly flips the debit-loss overhang. FY26 was framed at the high end of low-double-digits cc with an H1<H2 shape that is an FX-comp story, not a demand story — funded by a Q1 restructuring (~4% of staff).' }
      ] },
      notes:{
        'Net revenue':{ t:'Acquisitions +1 PPT', h:'Broad-based across payment network and VAS.' },
        'EPS':{ t:'Discrete tax + grants', h:'+20% on strong operating income, a positive discrete tax item, and government grants (opex benefit ~5.5 PPT; OI&E ~$135M).' },
        'Capital One credit renewal':{ t:'The overhang flips', h:'After losing Cap-One debit to Discover, Mastercard renewed CREDIT and won a large portion of newly acquired credit accounts — a signal the network is valued. Management wouldn\'t quantify retained volume (Will Nance pushed).' },
        'Q1 restructuring charge':{ t:'The strategic review', h:'One-time Q1 special item; frees capacity to reinvest in strategic priorities.' },
        'FY26 net-revenue guide':{ t:'H1 < H2', h:'H1 lower than H2 on tougher FX-volatility comps from H1 2025.' }
      },
      watch:{ 'VAS revenue':1, 'Switched transactions':2, 'Cross-border volume':3 },
      thesisCheck:[
        {line:'VAS holds ~20% cc', tripped:false, note:'VAS +22% cc (+19% ex-acq) — held strongly, broad-based high-teens across regions.'},
        {line:'Capital One overhang contained', tripped:false, note:'Debit still migrating, but the CREDIT renewal + new accounts flips the narrative — held/improved.'},
        {line:'Cross-border / consumer healthy', tripped:false, note:'Cross-border +14%; consumer "savvy but healthy," unchanged QoQ — held.'},
        {line:'Switched double digits', tripped:false, note:'Switched +10% despite the Cap-One debit drag — held.'}
      ],
      intoCall:[
        'How much Capital One credit volume actually stays given Discover ownership?',
        'What is the clean organic VAS rate as acquisitions lap?',
        'Does the H1<H2 FX-comp cadence hold?'
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
          detail:'<p>Apple Card remains on Mastercard through the issuer transition to JPMorgan (~24 months out). Mastercard Move transaction growth exceeded 35% in Q4 and FY25; ~40% of transactions tokenized.</p>' }
      ],
      dots:'The Capital One credit renewal quietly de-risked the biggest client overhang, and VAS (+22%) kept the algorithm compounding — but the FY26 shape (H1<H2) planted an FX-comp tension that, combined with the switched-transaction mix drag, is exactly what set up the softer Q1 optics and the conflict-driven Q2 cut that followed.',
      threeMinutes:[
        '<b>Strong close to 2025 and a real strategic win: the Capital One CREDIT renewal flips a known overhang.</b> After losing Cap-One debit to Discover, keeping and expanding credit signals the network\'s value — the open question is how much volume actually stays given Discover ownership.',
        '<b>FY26 is framed high-end-of-low-double-digits cc with H1<H2 — an FX-volatility-comp story, not a demand story.</b> The Q1 ~$200M restructuring (4% of staff) funds reinvestment. Read the H1 softness as comps, not weakness.',
        '<b>VAS +22% cc (+19% ex-acq) stays the engine</b>, broad-based; Recorded Future / Threat Intelligence scaling. The government grants are a flagged one-time-ish tailwind to keep in mind on opex and OI&E.'
      ],
      notBringing:[
        {item:'Government grants', why:'Real but flagged one-time-ish; don\'t extrapolate the opex/OI&E benefit into the run-rate.'},
        {item:'CCCA', why:'"All but dead for now"; no near-term resolution.'},
        {item:'Apple Card issuer change', why:'Mastercard stays; the JPMorgan issuer move is ~24 months out — not thesis-moving.'}
      ],
      newQuestions:[
        {n:'Can VAS hold high-teens organically as Recorded Future laps?', landed:{q:'Q1 2026', rank:1}},
        {n:'Does the healthy consumer / cross-border hold into 2026?', landed:{q:'Q1 2026', rank:2}},
        {n:'Does switched growth re-accelerate as the Cap-One debit migration completes?', landed:{q:'Q1 2026', rank:3}},
        {n:'How much Capital One credit volume actually stays?', landed:{q:'Q1 2026', rank:4}},
        {n:'Does the FY26 H1<H2 FX-comp shape play out?', landed:{q:'Q1 2026', rank:5}}
      ] } }
]};

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// WATCH LIST — THE TABLE (v2.10 · ported flat WL_ROWS). One flat array of rows across quarters.
// Migrated from the per-quarter watchList[] arrays: metric→theme, why/pista/breaks→definition (folded,
// not rendered separately), since→trackSince, + id/q/trackUntil/seededBy/src/thread. The LIVE
// (upcoming) quarter shows only OPEN hooks (trackSince, no trackUntil). `rank` orders, never labels.
// ═══════════════════════════════════════════════════════════════════════════════════════════════
var WL_ROWS=[
  // ── Q3 2026 · UPCOMING — the live list. Open hooks only (seeded by the Q2 2026 call). ──
  { id:'wl016', q:'Q3 2026', rank:1, theme:'First guide/quarter under new CFO Ling Hai',
    tags:['cfo','guidance','tone'], trackSince:'Q2 2026', trackUntil:null,
    definition:'The one genuinely new variable is leadership — Q3 is the first guide under a new CFO, and continuity vs a change of framing is the tell. <b>Tell:</b> does Ling Hai keep Sachin\'s disclosure cadence and guidance construct, or shift tone/detail? <b>Red-line:</b> a framing or disclosure change that reduces comparability or signals a strategy shift.',
    seededBy:{ q:'Q2 2026', n:'Sachin Mehra\'s last call as CFO; he moves to Chief Business Officer and Ling Hai becomes CFO effective Aug 3, 2026. Continuity messaged heavily "from a position of strength."' },
    src:'Q2 2026: CFO transition announced (part of the June 2 C-suite reshuffle); Ling Hai to lead the next earnings call.',
    thread:[ {q:'Q2 2026',n:'Mehra to Chief Business Officer; Ling Hai to CFO effective Aug 3.'} ] },
  { id:'wl017', q:'Q3 2026', rank:2, theme:'BVNK close + day-one stablecoin economics',
    tags:['stablecoin','bvnk','new-flows'], trackSince:'Q2 2026', trackUntil:null,
    definition:'The strategic pivot into owning stablecoin infrastructure — the size of the accretion is still unproven and the close keeps slipping. <b>Tell:</b> does BVNK actually close in Q3, and is there any day-one take-rate / volume / margin disclosure beyond "bps on volume"? <b>Red-line:</b> the close slips again, or the disclosed bps economics prove immaterial vs card/network economics.',
    seededBy:{ q:'Q2 2026', n:'Management said BVNK is now expected to close in Q3 (was Q1\'s "planned"); economics still framed as bps on volume in a market MA doesn\'t touch today.' },
    src:'Q2 2026: BVNK close moved to Q3; minimal net-revenue impact, some opex, contemplated in the reconciliations. OpenUSD (140-co consortium) to go live later this year; crypto co-brand volume >3x in two years.',
    thread:[ {q:'Q1 2026',n:'BVNK announced; economics = bps on volume; CLARITY Act "doesn\'t hold us back."'},{q:'Q2 2026',n:'Close slips to Q3; Agent Pay for Machines (M2M) launched with 30+ partners.'} ] },
  { id:'wl018', q:'Q3 2026', rank:3, theme:'Venezuela cross-border surge — persist or fade?',
    tags:['cross-border','venezuela','mix'], trackSince:'Q2 2026', trackUntil:null,
    definition:'An idiosyncratic, non-repeatable driver flattered the Q2 CNP ex-travel line — the tell is whether it is durable or a one-off now in the base. <b>Tell:</b> does the Venezuela-driven CNP ex-travel strength persist as USD availability normalizes, or fade into a tougher comp? <b>Red-line:</b> the surge reverses sharply, exposing a weaker underlying cross-border run-rate.',
    seededBy:{ q:'Q2 2026', n:'Increased USD availability in Venezuela drove a cross-border CNP ex-travel uptick where MA is market leader (primarily a debit market); Sachin flagged it as holding up "pretty well" but idiosyncratic.' },
    src:'Q2 2026: cross-border volume +12%; CNP ex-travel +20% on Venezuela USD availability + retail-promo timing; MA deconsolidated Venezuela in 2018.',
    thread:[ {q:'Q2 2026',n:'Venezuela USD availability surged into Q2; MA is market leader; shows up in CNP ex-travel debit.'} ] },
  { id:'wl019', q:'Q3 2026', rank:4, theme:'Middle East — does it stay moderated?',
    tags:['cross-border','travel','geopolitics'], trackSince:'Q2 2026', trackUntil:null,
    definition:'The Q1 fear resolved better than the base case, but the region is dynamic — the tell is whether the moderation holds at the assumed level. <b>Tell:</b> do Middle-East cross-border impacts stay near the end-of-Q2 level management now assumes for H2, or re-escalate? <b>Red-line:</b> the conflict re-escalates and cross-border travel weakens again.',
    seededBy:{ q:'Q2 2026', n:'Impacts moderated through Q2 and were less severe than anticipated; management estimates H2 impacts stay at similar levels to the end of Q2, noting the environment "remains dynamic."' },
    src:'Q2 2026: better outbound spend from impacted GCC countries; cross-border travel improved sequentially vs April on lower Middle-East impact and holiday timing.',
    thread:[ {q:'Q1 2026',n:'Conflict cut Q2 travel to 2%; "ends in Q2" assumed; ~6% of cross-border exposed.'},{q:'Q2 2026',n:'Hit lighter than feared; assumed to stay at end-of-Q2 levels through H2.'} ] },
  { id:'wl020', q:'Q3 2026', rank:5, theme:'VAS durability (holds ~18%?)',
    tags:['vas','services'], trackSince:'Q2 2026', trackUntil:null,
    definition:'VAS is the differentiator and the multiple support — the durable engine that carries the model when the macro/idiosyncratic helpers fade. <b>Tell:</b> does organic VAS hold ~18% cn with ~60% network-linked, led by security demand? <b>Red-line:</b> organic VAS decelerates below mid-teens with no offsetting network acceleration.',
    seededBy:{ q:'Q2 2026', n:'VAS +18% cn again, ~60% network-linked; strong security demand (Threat Intelligence, Recorded Future). The standing question is whether the ~18% engine holds.' },
    src:'Q2 2026: VAS +18% cn; Threat Intelligence 7M+ card-testing txns across 192 countries, ~$172M fraud prevented; Partner Advantage Program 200+ partners.',
    thread:[ {q:'Q1 2026',n:'VAS +18% cc organic; Recorded Future lapped.'},{q:'Q2 2026',n:'VAS +18% cn; ~60% network-linked; security demand strong.'} ] },
  // ── Q2 2026 · REPORTED — frozen record (closed by the Q2 2026 call). ──
  { id:'wl001', q:'Q2 2026', rank:1, theme:'Middle-East conflict vs the "ends in Q2" base case',
    tags:['cross-border','travel','geopolitics'], trackSince:'Q1 2026', trackUntil:'Q2 2026',
    definition:'The entire Q2 and H2 guide was predicated on one uncontrollable assumption. <b>Resolved in Q2:</b> the conflict moderated through the quarter and hit less severely than anticipated — net revenue beat at +12% cn, and management now assumes Middle-East impacts stay near the end-of-Q2 level through H2. The Q1 guide-down risk did not materialize. <b>Red-line (was):</b> the conflict extends past Q2 and cross-border travel stays depressed.',
    seededBy:{ q:'Q1 2026', n:'Sachin explicitly built guidance on the conflict ENDING in Q2 and refused (to Adam Frisch) to model any alternative scenario; sized GCC+Israel at ~6% of cross-border volume.' },
    src:'Q1 2026: cross-border travel growth fell from 8% (Q1) to 2% (first 4 weeks of April) on conflict + portfolio shifts + Ramadan/Easter timing; Q2 guided to the low end of low-double-digits.',
    thread:[ {q:'Q4 2025',n:'Consumer healthy; no conflict in the guide; FY26 set at high-end of low-double-digits cc.'},{q:'Q1 2026',n:'Conflict from late Feb; Q2 cut; "ends in Q2" assumed; ~6% of cross-border exposed.'},{q:'Q2 2026',n:'Moderated / less severe than feared; net rev beat +12%; H2 assumed at end-of-Q2 level.'} ] },
  { id:'wl002', q:'Q2 2026', rank:2, theme:'BVNK / stablecoin economics',
    tags:['stablecoin','bvnk','new-flows'], trackSince:'Q1 2026', trackUntil:'Q2 2026',
    definition:'The strategic pivot from crypto co-brands (card economics) into owning stablecoin infrastructure — the size of the accretion is unproven. <b>Carried into Q3:</b> BVNK is now expected to close in Q3 (slipped from the Q1 "planned"); the model is still framed as bps on volume in a market MA doesn\'t touch today, with no day-one take-rate/margin numbers yet. <b>Red-line (was):</b> the disclosed bps economics prove immaterial or dilutive.',
    seededBy:{ q:'Q1 2026', n:'Matt O\'Neill pushed on stablecoin economics; Sachin said BVNK\'s model is "basis points on volume" in "an addressable market we don\'t participate in today" — accretive, but no numbers.' },
    src:'Q1 2026: planned BVNK acquisition (interoperability/licensing/compliance layer for send/receive/convert/hold stablecoins); use cases payouts, remittances, me-to-me, B2B cross-border.',
    thread:[ {q:'Q4 2025',n:'Stablecoins framed as "another currency" on the network; MetaMask/Gemini co-brands; Ripple settlement.'},{q:'Q1 2026',n:'BVNK announced; economics = bps on volume; CLARITY Act "doesn\'t hold us back."'},{q:'Q2 2026',n:'Close moved to Q3; OpenUSD (140-co) live later this year; Agent Pay for Machines launched.'} ] },
  { id:'wl003', q:'Q2 2026', rank:3, theme:'Switched-transaction growth trajectory',
    tags:['switched-transactions','mix'], trackSince:'Q1 2026', trackUntil:'Q2 2026',
    definition:'Switched transactions are the data engine that feeds VAS — a persistent decel would quietly cap the whole virtuous-cycle algorithm. <b>Resolved (leaning transitory):</b> switched +9%, generally in line with Q1; ex-Capital One US switched volume +10% (+2 PPT sequentially) on higher fuel spend — mix-driven, not a demand problem. <b>Red-line (was):</b> switched growth decelerates further on a structural mix drag.',
    seededBy:{ q:'Q1 2026', n:'Harshita Rawat pushed on switched growth decelerating to 9% (10% ex-Cap One) vs historical low-double/low-teens; Sachin attributed it to geographic/average-ticket mix (Russia exit, adding Japan/Mexico).' },
    src:'Q1 2026: switched transactions +9% (+10% ex-Capital One debit migration); >70% of Mastercard transactions now switched (vs 60% in 2020).',
    thread:[ {q:'Q4 2025',n:'Switched +10%; contactless 77%; Cap One debit migration a drag.'},{q:'Q1 2026',n:'Switched +9% (+10% ex-Cap One); mix explanation; migration "basically complete."'},{q:'Q2 2026',n:'Switched +9%; ex-CapOne US +10% (+2 PPT seq) on fuel; tokens >40%, contactless 80%.'} ] },
  { id:'wl004', q:'Q2 2026', rank:4, theme:'VAS durability at ~40% of revenue',
    tags:['vas','services'], trackSince:'Q1 2026', trackUntil:'Q2 2026',
    definition:'VAS is the differentiator and the multiple support — the virtuous cycle only works if it keeps compounding faster than the network. <b>Confirmed in Q2:</b> VAS +18% cn again, ~60% network-linked, led by strong security demand (Threat Intelligence 7M+ card-testing txns across 192 countries, ~$172M fraud prevented). <b>Red-line (was):</b> organic VAS decelerates below mid-teens with no offsetting network acceleration.',
    seededBy:{ q:'Q1 2026', n:'Jason Kupferberg clarified the 18% VAS growth was organic (Recorded Future lapped); the durability of the ~40%-of-revenue engine is the standing question.' },
    src:'Q1 2026: VAS +18% cc (no acquisition impact); ~40% of company revenue; broad-based (security, digital/authentication, insights, consumer engagement).',
    thread:[ {q:'Q4 2025',n:'VAS +22% cc (+19% ex-acq); FY25 +21%/+18% ex-acq; ~60% network-linked.'},{q:'Q1 2026',n:'VAS +18% cc organic; Recorded Future/Threat Intelligence 500+ customers; Ethoca +25%.'},{q:'Q2 2026',n:'VAS +18% cn; ~60% network-linked; security demand strong.'} ] },
  { id:'wl005', q:'Q2 2026', rank:5, theme:'Rebates & incentives / net revenue yield',
    tags:['incentives','pricing','renewals'], trackSince:'Q1 2026', trackUntil:'Q2 2026',
    definition:'R&I is the contra-revenue competitive renewals drive — the tell on whether Mastercard is buying volume or being paid for value. <b>Held in Q2:</b> R&I came in essentially in line with expectations; management guided it slightly higher as a % of payment-network assessments into Q3 on deal timing, with cross-border and domestic pricing still lifting net yield. <b>Red-line (was):</b> renewal competition forces R&I up, compressing net yield.',
    seededBy:{ q:'Q1 2026', n:'Andrew Schmidt asked on R&I trending; Sachin guided R&I as a % of payment-network assessments slightly lower sequentially into Q2, and noted net revenue yield is rising.' },
    src:'Q1 2026: net revenue yield increasing; R&I guided slightly lower sequentially into Q2.',
    thread:[ {q:'Q4 2025',n:'R&I flat-to-slightly-down sequentially; disciplined "win the right deals."'},{q:'Q1 2026',n:'R&I guided slightly lower into Q2; net yield rising.'},{q:'Q2 2026',n:'R&I in line in Q2; guided slightly higher into Q3 on deal timing.'} ] },
  // ── Q1 2026 · REPORTED — frozen record. ──
  { id:'wl006', q:'Q1 2026', rank:1, theme:'VAS durability (can high-teens hold as acq laps?)',
    tags:['vas'], trackSince:'Q4 2025', trackUntil:'Q1 2026',
    definition:'The engine and the multiple support. <b>Tell:</b> does organic VAS hold high-teens once Recorded Future is lapped? <b>Red-line:</b> organic VAS decelerates below mid-teens.',
    seededBy:{ q:'Q4 2025', n:'Q4 VAS was +22% cc but +19% ex-acq; the question into Q1 was the clean organic rate as acquisitions lap.' },
    src:'Q4 2025: VAS +22% cc (+19% ex-acq); FY25 +21%/+18% ex-acq.' },
  { id:'wl007', q:'Q1 2026', rank:2, theme:'Consumer / cross-border resilience',
    tags:['cross-border','consumer','travel'], trackSince:'Q4 2025', trackUntil:'Q1 2026',
    definition:'The demand pulse and the highest-yield line. <b>Tell:</b> does the healthy consumer + cross-border hold into 2026? <b>Red-line:</b> cross-border volume growth slips below low-double-digits cc or the consumer softens.',
    seededBy:{ q:'Q4 2025', n:'Q4 framed a "savvy, intentional" but healthy consumer; the standing question was whether it holds through 2026 macro/geopolitics.' },
    src:'Q4 2025: cross-border +14%; consumer spend healthy and unchanged QoQ.' },
  { id:'wl008', q:'Q1 2026', rank:3, theme:'Switched-transaction growth off the Cap-One drag',
    tags:['switched-transactions'], trackSince:'Q4 2025', trackUntil:'Q1 2026',
    definition:'The data engine feeding VAS. <b>Tell:</b> does switched growth re-accelerate as the Capital One debit migration completes? <b>Red-line:</b> switched growth stays depressed after the migration laps.',
    seededBy:{ q:'Q4 2025', n:'Q4 switched +10% with the Cap-One debit migration a drag; the question was the underlying rate once it completes.' },
    src:'Q4 2025: switched transactions +10%; Cap-One debit migration ongoing.' },
  { id:'wl009', q:'Q1 2026', rank:4, theme:'Capital One credit volume retention',
    tags:['capital-one','renewals'], trackSince:'Q4 2025', trackUntil:'Q1 2026',
    definition:'A known overhang the renewal partly flips. <b>Tell:</b> how much Capital One credit volume actually stays given its Discover ownership? <b>Red-line:</b> Cap-One credit volume migrates away despite the renewal.',
    seededBy:{ q:'Q4 2025', n:'Q4 announced the Cap-One CREDIT renewal (+ new accounts); Will Nance pushed on how much volume stays given Cap-One owns Discover — management wouldn\'t quantify.' },
    src:'Q4 2025: Capital One credit portfolio renewed; network for a large portion of newly acquired credit accounts.' },
  { id:'wl010', q:'Q1 2026', rank:5, theme:'FY26 guide shape (H1<H2 on FX comps)',
    tags:['guidance','fx'], trackSince:'Q4 2025', trackUntil:'Q1 2026',
    definition:'The shape drives the quarterly setups all year. <b>Tell:</b> does the H1<H2 cadence play out as the FX-volatility comps normalize? <b>Red-line:</b> H1 undershoots even the FX-comp-adjusted framing.',
    seededBy:{ q:'Q4 2025', n:'Q4 set FY26 at the high end of low-double-digits cc, with H1 lower than H2 on tougher FX-volatility comps; the question was whether the shape holds.' },
    src:'Q4 2025: FY26 net revenue guide high-end of low-double-digits cc; H1<H2 on FX-volatility comps.' },
  // ── Q4 2025 · REPORTED — frozen record. ──
  { id:'wl011', q:'Q4 2025', rank:1, theme:'VAS growth durability',
    tags:['vas'], trackSince:'Q3 2025', trackUntil:'Q4 2025',
    definition:'The engine and the differentiator. <b>Tell:</b> does VAS hold ~20% cc, and what is the clean organic rate ex-acquisitions? <b>Red-line:</b> organic VAS decelerates toward mid-teens.',
    src:'Q3 2025: VAS growth ~20%+ cc.' },
  { id:'wl012', q:'Q4 2025', rank:2, theme:'Capital One debit loss / network share',
    tags:['capital-one','switched-transactions'], trackSince:'Q3 2025', trackUntil:'Q4 2025',
    definition:'The single biggest client overhang. <b>Tell:</b> how much does the Capital One debit migration to Discover drag switched volume, and is credit at risk? <b>Red-line:</b> credit also migrates, compounding the debit loss.',
    src:'Q3 2025: Capital One debit migration to Discover underway, a switched-volume drag.' },
  { id:'wl013', q:'Q4 2025', rank:3, theme:'Cross-border & consumer health',
    tags:['cross-border','consumer'], trackSince:'Q3 2025', trackUntil:'Q4 2025',
    definition:'The demand pulse. <b>Tell:</b> does cross-border stay double digits and the consumer stay healthy into year-end? <b>Red-line:</b> cross-border slips below low-double-digits or consumer softens.',
    src:'Q3 2025: cross-border healthy; consumer resilient.' },
  { id:'wl014', q:'Q4 2025', rank:4, theme:'FY26 guide / FX-volatility comps',
    tags:['guidance','fx'], trackSince:'Q3 2025', trackUntil:'Q4 2025',
    definition:'Sets the whole year\'s setup. <b>Tell:</b> where does FY26 land, and how do the 2025 FX-volatility comps shape the cadence? <b>Red-line:</b> FY26 guide comes in below low-double-digits cc.',
    src:'Q3 2025: elevated FX-volatility revenue in H1 2025 flagged as a future comp.' },
  { id:'wl015', q:'Q4 2025', rank:5, theme:'Stablecoin / agentic positioning',
    tags:['stablecoin','agentic'], trackSince:'Q3 2025', trackUntil:'Q4 2025',
    definition:'The emerging-rails optionality. <b>Tell:</b> how is Mastercard positioning in stablecoins and agentic commerce as the space accelerates? <b>Red-line:</b> Mastercard is left behind on standards/economics.',
    src:'Q3 2025: Agent Pay launched; stablecoin settlement expanding.' }
];
// Rows for one quarter. The LIVE (upcoming) quarter shows only OPEN hooks. `rank` orders, never labels.
function wlFor(qLabel, openOnly){
  return WL_ROWS.filter(function(r){
    if(r.q!==qLabel) return false;
    if(openOnly && r.trackUntil) return false;
    return true;
  }).sort(function(a,z){
    var ar=(typeof a.rank==='number')?a.rank:99, zr=(typeof z.rank==='number')?z.rank:99;
    return ar-zr;
  });
}
function wlOpen(r){ return !!(r.trackSince && !r.trackUntil); }
function wlTags(){
  var set=[], seen={};
  WL_ROWS.forEach(function(r){ (r.tags||[]).forEach(function(t){ if(!seen[t]){ seen[t]=1; set.push(t); } }); });
  return set.sort();
}
function wlById(id){ for(var i=0;i<WL_ROWS.length;i++){ if(WL_ROWS[i].id===id) return WL_ROWS[i]; } return null; }
function wlNextId(){
  var mx=0; WL_ROWS.forEach(function(r){ var m=/^wl(\d+)$/.exec(r.id||''); if(m && +m[1]>mx) mx=+m[1]; });
  return 'wl'+String(mx+1).padStart(3,'0');
}
function wlNextRank(qLabel){
  var mx=0; WL_ROWS.forEach(function(r){ if(r.q===qLabel && typeof r.rank==='number' && r.rank>mx) mx=r.rank; });
  return mx+1;
}

function ceUpcoming(){ return CALL_EARNINGS.quarters.filter(function(q){ return q.status==='upcoming'; })[0]||null; }
function ceFill(x, muted){ return (x!=null && String(x).trim()!=='') ? x : '<span class="ce-empty">'+(muted||'— to fill')+'</span>'; }
var CE_POP={};
function ceReg(id, t, h){ CE_POP[id]={t:t, h:ceProse(h)}; return id; }
function ceQ(id, t, h){ return '<span class="ce-info ov-clickable" data-detail="ce:'+ceReg(id,t,h)+'" title="'+esc(String(t).replace(/<[^>]+>/g,''))+'">?</span>'; }
// ─── ceProse · the anti-wall transform (runs at REGISTRATION time). Flowing <p> prose → a short LEAD
// paragraph + one-sentence <li> bullets; a "<b>Label:</b> …" paragraph becomes a labelled row. Content
// already carrying <ul>/<li> is left as authored. (§6a-iv.)
function ceSentences(s){
  return String(s).split(/(?<=[.!?])\s+(?=(?:<[a-z]+>)*[A-Z“"(])/).filter(function(x){ return x.trim(); });
}
function ceProse(h){
  h=String(h||'');
  if(!h || h.indexOf('<li>')>=0 || h.indexOf('<ul')>=0) return h;
  var paras=h.match(/<p>[\s\S]*?<\/p>/g);
  if(!paras || paras.length===0) return h;
  var tail=h.replace(/<p>[\s\S]*?<\/p>/g,'').trim();
  var lead='', bullets=[];
  paras.forEach(function(p,i){
    var inner=p.replace(/^<p>/,'').replace(/<\/p>$/,'').trim();
    var lab=inner.match(/^<b>([^<]{1,42}[:—-])<\/b>\s*([\s\S]*)$/);
    if(lab){ bullets.push('<b>'+lab[1]+'</b> '+lab[2]); return; }
    var sents=ceSentences(inner);
    if(i===0){ lead=sents.shift(); sents.forEach(function(s){ bullets.push(s); }); }
    else { sents.forEach(function(s){ bullets.push(s); }); }
  });
  var out='';
  if(lead)          out+='<p class="ce-pop-lead">'+lead+'</p>';
  if(bullets.length) out+='<ul class="ce-pop-l">'+bullets.map(function(b){ return '<li>'+b+'</li>'; }).join('')+'</ul>';
  return out+tail;
}
function ceStyle(){
  return '<style>.ce-note{font-size:11px;color:var(--mu);line-height:1.5;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;margin:0 0 12px}'+
    '.ce-phtabs{display:inline-flex;gap:3px;background:rgba(207,10,44,0.08);border:1px solid var(--bdr);border-radius:9px;padding:4px;margin:0 0 20px}'+
    '.ce-phtab{background:none;border:none;color:var(--mu);font-family:\'Inter\',sans-serif;font-size:12px;letter-spacing:.5px;text-transform:uppercase;font-weight:600;padding:7px 16px;border-radius:6px;cursor:pointer;transition:all .15s}'+
    '.ce-phtab:hover{color:var(--navy)}.ce-phtab.active{background:'+BRAND+';color:#fff}'+
    '.ce-phpane[hidden]{display:none}'+
    '.ce-qpills{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px}'+
    '.ce-qpill{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-qpill:hover{color:var(--navy)}.ce-qpill.active{background:var(--navy);color:#fff;border-color:var(--navy)}'+
    '.ce-qpill .ce-qtag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin-left:6px;opacity:.75}'+
    '.ce-qblock[hidden]{display:none}'+
    '.ce-frozen{display:inline-block;font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:'+GRAY+';border-radius:20px;padding:2px 8px;margin-left:7px;vertical-align:middle}'+
    '.ce-wl-hint{font-size:10.5px;line-height:1.5;color:var(--navy);background:rgba(207,10,44,0.06);border:1px solid rgba(207,10,44,0.28);border-radius:9px;padding:8px 12px;margin:0 0 10px}'+'.ce-wl-tagbar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 12px;padding:9px 12px;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px}'+
    '.ce-wl-tag{border:1px solid rgba(122,90,248,0.35);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+PURPLE+';padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-wl-tag:hover{background:rgba(122,90,248,0.08)}.ce-wl-tag.active{background:'+PURPLE+';color:#fff;border-color:'+PURPLE+'}'+
    '.ce-wl-clear{border-color:var(--bdr);color:var(--mu)}'+
    '.ce-wl-add-btn{margin-left:auto;border:1px dashed '+BRAND+';background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+BRAND+';padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.ce-wl-bar-k{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)}'+
    '.ce-wl-win{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 11px;border-radius:999px;cursor:pointer}'+
    '.ce-wl-win.active{background:var(--navy);color:#fff}'+
    '.ce-wl-addform{display:flex;flex-direction:column;gap:5px;border:1px dashed '+BRAND+';border-radius:10px;padding:14px 15px;margin:0 0 12px;background:rgba(207,10,44,0.03)}'+
    '.ce-wl-addform[hidden]{display:none}'+
    '.ce-wl-fh{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap;margin-bottom:4px}'+
    '.ce-wl-fh-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-wl-fh-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-wl-lb{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--navy);margin-top:5px}'+
    '.ce-wl-lb span{font-weight:600;text-transform:none;letter-spacing:0;color:var(--mu);font-size:10px;margin-left:5px}'+
    '.ce-wl-in{font:inherit;font-size:12px;border:1px solid var(--bdr);border-radius:8px;padding:7px 10px;background:var(--w);color:var(--navy);width:100%;box-sizing:border-box}'+
    '.ce-wl-in:focus{outline:none;border-color:'+BRAND+'}'+
    '.ce-wl-ta{resize:vertical;line-height:1.5}'+
    '.ce-wl-2col{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:600px){.ce-wl-2col{grid-template-columns:1fr}}'+
    '.ce-wl-tagpick{display:flex;gap:6px;flex-wrap:wrap;border:1px solid var(--bdr);border-radius:8px;padding:8px 9px;background:var(--w);min-height:20px}'+
    '.ce-wl-pick{border:1px solid rgba(122,90,248,0.35);background:var(--w);font:inherit;font-size:10.5px;font-weight:800;color:'+PURPLE+';padding:3px 10px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-wl-pick:hover{background:rgba(122,90,248,0.08)}.ce-wl-pick.on{background:'+PURPLE+';color:#fff;border-color:'+PURPLE+'}'+
    '.ce-wl-newtag{display:flex;gap:7px;align-items:center}.ce-wl-newtag .ce-wl-in{flex:1}'+
    '.ce-wl-newtag-go{font:inherit;font-size:10.5px;font-weight:800;border:1px dashed '+PURPLE+';background:var(--w);color:'+PURPLE+';padding:6px 12px;border-radius:999px;cursor:pointer;white-space:nowrap}'+
    '.ce-wl-frow{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:9px}'+
    '.ce-wl-add-go{font:inherit;font-size:11px;font-weight:800;border:none;border-radius:8px;padding:7px 15px;background:'+BRAND+';color:#fff;cursor:pointer}'+
    '.ce-wl-cancel{font:inherit;font-size:10.5px;font-weight:700;border:1px solid var(--bdr);background:var(--w);color:var(--mu);padding:6px 12px;border-radius:8px;cursor:pointer}'+
    '.ce-wl-all[hidden]{display:none}.ce-w[data-wlhide]{display:none}'+
    '.ce-wl-tbl-sc[hidden]{display:none}'+'.ce-wl-tbl-wrap{margin-top:22px;border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:12px;padding:13px 15px;background:var(--w)}'+
    '.ce-wl-tbl-h{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:9px}'+
    '.ce-wl-tbl-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-wl-tbl-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-wl-tbl-n{margin-left:auto;font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+BRAND2+';background:rgba(22,163,74,0.10);border:1px solid rgba(22,163,74,0.3);border-radius:999px;padding:3px 11px;white-space:nowrap}'+
    '.ce-wl-copy{border:1px solid '+BRAND+';background:'+BRAND+';font:inherit;font-size:10px;font-weight:800;color:#fff;padding:4px 14px;border-radius:999px;cursor:pointer;letter-spacing:.03em;transition:.12s}'+
    '.ce-wl-copy:hover{filter:brightness(1.08)}'+
    '.ce-wl-copy.alt{background:var(--w);color:'+BRAND+'}.ce-wl-copy.alt:hover{background:rgba(207,10,44,0.08)}'+
    '.ce-wl-tbl-sc{overflow-x:auto;border:1px solid var(--bdr);border-radius:9px}'+
    '.ce-wl-tbl{width:100%;border-collapse:collapse;font-size:10.5px;min-width:1100px}'+
    '.ce-wl-tbl th{text-align:left;background:#F7F9FB;color:var(--mu);font-weight:800;font-size:9.5px;text-transform:uppercase;letter-spacing:.04em;padding:7px 9px;border-bottom:1px solid var(--bdr);white-space:nowrap;position:sticky;top:0}'+
    '.ce-wl-tbl td{padding:7px 9px;border-bottom:1px solid var(--bdr);color:var(--navy);line-height:1.45;vertical-align:top;max-width:270px}'+
    '.ce-wl-tbl tr:last-child td{border-bottom:none}'+
    '.ce-wl-tbl td.wl-key{white-space:nowrap;font-weight:800;color:var(--mu);font-size:10px}'+
    '.ce-wl-tbl td.wl-th{font-weight:800;min-width:190px}'+
    '.ce-wl-tbl tr.wl-open td.wl-key{color:'+BRAND2+'}'+
    '.ce-wl-tbl tbody tr:hover{background:rgba(207,10,44,0.035)}'+
    '.ce-empty{color:var(--mu);font-style:italic;opacity:.7}'+
    '.ce-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:4px 0}@media(max-width:640px){.ce-grid4{grid-template-columns:1fr 1fr}}'+
    '.ce-cell{border:1px solid var(--bdr);border-top:3px solid '+BLUE+';border-radius:10px;padding:11px 13px;background:var(--w)}'+
    '.ce-cell-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}.ce-cell-v{font-size:15px;font-weight:800;color:var(--navy);margin-top:3px;line-height:1.2}'+
    '.ce-ev-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.ce-ev-pill.active{background:var(--navy);color:#fff}'+
    '.ce-cell-custom{border-top-color:'+YELLOW+'}'+
    '.ce-row-cap{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin:2px 0 4px}'+
    '.ce-val{display:flex;align-items:baseline;gap:7px}'+
    '.ce-val-lab{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:1px 7px;flex:none}'+
    '.ce-val-cons .ce-val-lab{background:rgba(37,87,214,0.10);color:'+BLUE+'}'+
    '.ce-val-us .ce-val-lab{background:rgba(22,163,74,0.12);color:'+BRAND2+'}'+
    '.ce-evwrap[data-ev="cons"] .ce-val-us{display:none}'+
    '.ce-evwrap[data-ev="us"] .ce-val-cons{display:none}'+
    '.ce-evwrap:not([data-ev="both"]) .ce-val-lab{display:none}'+
    '.ce-evwrap[data-ev="both"] .ce-cell-v{font-size:13px}'+
    '.ce-evwrap[data-ev="both"] .ce-val{margin-top:3px}'+
    '.ce-banner{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:11px;padding:13px 15px;background:linear-gradient(180deg,rgba(207,10,44,0.05),transparent);font-size:12.5px;line-height:1.6;color:var(--navy);margin:12px 0}'+
    '.ce-watch{display:flex;flex-direction:column;gap:11px}'+
    '.ce-w{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w);position:relative}'+
    '.ce-w-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}'+
    '.ce-w-dot{width:8px;height:8px;border-radius:50%;background:'+BRAND+';flex:none;margin:0 2px}'+
    '.ce-w-metric{font-size:13.5px;font-weight:800;color:var(--navy)}'+
    '.ce-w-def{color:var(--navy);border-left:3px solid rgba(207,10,44,0.35);padding:1px 0 1px 11px;font-size:12px;line-height:1.55;margin-top:7px}'+
    '.ce-w-def b{color:'+BLUE+'}'+
    '.ce-w-ctl{margin-left:auto;display:inline-flex;gap:5px;flex:none}'+
    '.ce-w-ed,.ce-w-del{border:1px solid var(--bdr);background:var(--w);font:inherit;font-size:11px;font-weight:800;color:var(--mu);width:24px;height:24px;border-radius:7px;cursor:pointer;line-height:1;transition:.12s}'+
    '.ce-w-ed:hover{border-color:'+BRAND+';color:'+BRAND+'}.ce-w-del:hover{border-color:'+RED+';color:'+RED+'}'+
    '.ce-w-closed{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--mu);background:#F2F5F8;border:1px solid var(--bdr);border-radius:20px;padding:2px 8px;flex:none}'+
    '.ce-kind{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid}'+
    '.ce-phase{display:inline-block;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#fff;border-radius:20px;padding:3px 10px;margin-bottom:8px}'+
    '.ce-info{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border-radius:50%;background:'+AMBER+';color:#fff;font-size:10px;font-weight:800;cursor:pointer;margin-left:5px;vertical-align:middle;flex:none}'+
    '.ce-info:hover{filter:brightness(1.1)}'+
    '.ce-synth{border-left:4px solid var(--navy);background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:6px 0}.ce-synth b{color:'+YELLOW+'}'+
    '.ce-why-btn{display:inline-block;font-size:10px;font-weight:800;color:'+BLUE+';cursor:pointer;margin-top:8px}'+
    '.ce-w-chips{display:flex;gap:7px;flex-wrap:wrap;margin:6px 0 0}'+
    '.ce-w-chip{font-size:10px;font-weight:700;border-radius:7px;padding:4px 9px;line-height:1.3;color:var(--navy)}'+
    '.ce-w-chip.tag{background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3)}'+
    '.ce-w-chip.since{background:rgba(255,159,0,0.12);border:1px solid rgba(183,121,31,0.35)}'+
    '.ce-w-chip.until{background:#F2F5F8;border:1px solid var(--bdr);color:var(--mu)}'+
    '.ce-w-chip.cons{background:rgba(37,87,214,0.08);border:1px solid rgba(37,87,214,0.28)}'+
    '.ce-w-chip.red{background:rgba(234,67,53,0.06);border:1px solid rgba(234,67,53,0.28)}'+
    '.ce-w-chip b{font-weight:800}'+
    '.ce-take{border-left:4px solid '+BRAND+';background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:2px 0 14px}.ce-take b{color:'+YELLOW+'}'+
    '.ce-hl{display:flex;flex-direction:column;gap:8px}'+
    '.ce-hl-row{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--hc);border-radius:10px;padding:10px 13px;background:var(--w);cursor:pointer;transition:.12s}'+
    '.ce-hl-row:hover{box-shadow:0 3px 10px rgba(0,0,0,.08)}'+
    '.ce-hl-tag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:var(--hc);border-radius:20px;padding:3px 9px;white-space:nowrap}'+
    '.ce-hl-head{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.ce-hl-more{font-size:15px;color:var(--hc);font-weight:800}'+
    '@media(max-width:560px){.ce-hl-row{grid-template-columns:auto 1fr}.ce-hl-more{display:none}}'+
    '.ce-dots{border:1px dashed '+BRAND+';border-radius:11px;padding:12px 15px;margin-top:14px;background:rgba(207,10,44,0.03);font-size:12px;line-height:1.6;color:var(--navy)}.ce-dots b{color:'+BRAND+'}'+
    '.ce-sc{display:flex;flex-direction:column;gap:6px}'+
    '.ce-sc-row{display:grid;grid-template-columns:1.1fr 1fr 1.2fr auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--sc);border-radius:9px;padding:8px 12px}'+
    '.ce-sc-m{font-size:12px;font-weight:800;color:var(--navy)}.ce-sc-c{font-size:11px;color:var(--mu)}.ce-sc-a{font-size:11.5px;font-weight:700;color:var(--navy)}'+
    '.ce-sc-v{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 10px;background:var(--sc);white-space:nowrap}'+
    '@media(max-width:600px){.ce-sc-row{grid-template-columns:1fr auto}.ce-sc-c,.ce-sc-a{display:none}}'+
    '.ce-tc{display:flex;flex-direction:column;gap:6px}'+
    '.ce-tc-row{display:flex;gap:9px;align-items:flex-start;font-size:11.5px;color:var(--navy);line-height:1.45;border:1px solid var(--bdr);border-radius:9px;padding:8px 11px}'+
    '.ce-tbl{width:100%;border-collapse:collapse;font-size:11.5px}'+
    '.ce-tbl th{text-align:left;color:var(--mu);font-weight:700;padding:7px 10px;border-bottom:1px solid var(--bdr);font-size:10.5px;text-transform:uppercase;letter-spacing:.03em}'+
    '.ce-tbl td{padding:9px 10px;border-bottom:1px solid var(--bdr);color:var(--navy);line-height:1.45;vertical-align:top}'+
    '.ce-pill{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 9px;white-space:nowrap}'+
    '.ce-seed{display:inline-flex;align-items:center;gap:4px;font-size:9.5px;font-weight:800;color:'+PURPLE+';background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3);border-radius:20px;padding:2px 9px;white-space:nowrap;flex:none}'+
    '.ce-nq{display:flex;flex-direction:column;gap:5px}'+
    '.ce-nq-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:3px solid '+PURPLE+';border-radius:9px;padding:7px 11px;font-size:11.5px;color:var(--navy);line-height:1.45}'+
    '.ce-nq-land{font-size:9.5px;font-weight:800;color:'+PURPLE+';white-space:nowrap}'+
    '.ce-nq-land.open{color:var(--mu)}'+
    '@media(max-width:560px){.ce-nq-row{grid-template-columns:1fr}.ce-nq-land{margin-top:3px}}'+
    '.ce-sc-row{grid-template-columns:78px 1.1fr 1fr 1.2fr 92px auto}'+
    '.ce-sc-rk{font-size:9px;font-weight:800;color:'+BRAND+';background:rgba(207,10,44,0.10);border:1px solid rgba(207,10,44,0.3);border-radius:20px;padding:2px 8px;white-space:nowrap;text-align:center}'+
    '.ce-sc-rk.blank{background:transparent;border:none}'+
    '.ce-sc-surp{font-size:9.5px;font-weight:800;text-align:center;letter-spacing:.02em;border-radius:20px;padding:2px 8px;white-space:nowrap}'+
    '.ce-sc-surp.hi{color:'+RED+';background:rgba(234,67,53,0.09);border:1px solid rgba(234,67,53,0.3)}'+
    '.ce-sc-surp.md{color:'+AMBER+';background:rgba(183,121,31,0.09);border:1px solid rgba(183,121,31,0.3)}'+
    '.ce-sc-surp.lo{color:var(--mu);background:transparent;border:1px solid var(--bdr)}'+
    '.ce-legend{display:flex;flex-wrap:wrap;gap:14px;align-items:center;background:#F7F9FB;border:1px solid var(--bdr);border-radius:10px;padding:10px 13px;margin:0 0 10px}'+
    '.ce-legend-i{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--navy);line-height:1.4}'+
    '.ce-legend-i b{font-weight:800}'+
    '@media(max-width:600px){.ce-sc-row{grid-template-columns:1fr auto}.ce-sc-c,.ce-sc-a,.ce-sc-bw,.ce-sc-rk{display:none}}'+
    '.ce-band{margin:16px 0 8px;display:flex;align-items:center;gap:9px}'+
    '.ce-band-i{font-size:13px;font-weight:800;color:var(--bc);line-height:1}'+
    '.ce-band-t{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--bc)}'+
    '.ce-band-s{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-band-l{flex:1;height:1px;background:var(--bdr)}'+
    '@media(max-width:560px){.ce-band-s{display:none}}'+
    '.ce-hl-open{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+AMBER+';border:1px solid '+AMBER+';border-radius:20px;padding:2px 7px;white-space:nowrap;margin-left:7px;vertical-align:middle}'+
    '.ce-3m{border:1px solid var(--bdr);border-top:4px solid '+BRAND+';border-radius:12px;padding:15px 17px;margin:16px 0 0;background:linear-gradient(180deg,rgba(207,10,44,0.05),transparent)}'+
    '.ce-3m-h{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:10px}'+
    '.ce-3m-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.ce-3m-sub{font-size:10.5px;color:var(--mu);font-weight:600;font-style:italic}'+
    '.ce-3m-copy{margin-left:auto;border:1px solid '+BRAND+';background:var(--w);font:inherit;font-size:10px;font-weight:800;color:'+BRAND+';padding:3px 11px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.ce-3m-copy:hover{background:'+BRAND+';color:#fff}'+
    '.ce-3m-l{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}'+'@media(max-width:760px){.ce-3m-l{grid-template-columns:1fr}}'+'.ce-3m-n{width:22px;height:22px;border-radius:50%;background:'+BRAND+';color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex:none}'+'.ce-3m-bd{min-width:0}'+'.ce-3m-lead{display:block;font-size:13.5px;font-weight:800;color:var(--navy);line-height:1.4}'+'.ce-3m-ev{display:block;font-size:11px;font-weight:500;color:var(--mu);line-height:1.5;margin-top:4px}'+'.ce-3m-more{margin-top:6px}'+'.ce-3m-more>summary{font-size:9.5px;font-weight:800;color:'+BLUE+';cursor:pointer;list-style:none}'+'.ce-3m-more>summary::-webkit-details-marker{display:none}'+'.ce-3m-more[open]>summary{color:var(--mu)}'+
    '.ce-3m-i{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:11px;padding:11px 13px;background:#fff}'+
    '.ce-nb{margin-top:13px;border-top:1px dashed var(--bdr);padding-top:11px}'+
    '.ce-nb-h{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:6px}'+
    '.ce-nb-r{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:start;font-size:11px;line-height:1.5;color:var(--mu);padding:2px 0}'+
    '.ce-nb-r b{color:var(--navy);font-weight:800}'+
    '.ce-nb-x{color:'+GRAY+';font-weight:800;flex:none}'+
    '.calls-st-age{font-size:8.5px;font-weight:700;opacity:.8;margin-left:4px}</style>';
}
// ─── The IR button — every Earnings opens with it. KEEP MA's IR/EDGAR URLs, CIK 1141391, MA logo.
var CE_IR_URL='https://investor.mastercard.com/financials-and-sec-filings/quarterly-results/default.aspx';
var CE_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=1141391&owner=exclude';
var CE_LOGO_URL='https://assets.parqet.com/logos/symbol/MA';
var CE_SEC_SEAL='img/sec-seal.png';
function ceIRButton(){
  return '<style>'+
    '.ce-srcrow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 16px}@media(max-width:760px){.ce-srcrow{grid-template-columns:1fr}}'+
    '.ce-ir{display:flex;align-items:center;gap:20px;text-decoration:none;border-radius:18px;padding:26px 26px;min-height:120px;position:relative;overflow:hidden;'+
      'background:linear-gradient(115deg,#04060B 0%,#0A1024 60%,#04060B 100%);border:1px solid rgba(207,10,44,.4);box-shadow:0 10px 32px rgba(0,0,0,.4);transition:.18s}'+
    '.ce-ir:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,'+BRAND+','+BLUE+','+YELLOW+','+BRAND2+');height:4px;top:0}'+
    '.ce-ir:hover{transform:translateY(-2px);box-shadow:0 16px 42px rgba(207,10,44,.45);border-color:rgba(207,10,44,.85)}'+
    '.ce-ir-wm{position:absolute;right:-40px;bottom:-60px;width:230px;height:230px;object-fit:contain;opacity:.09;pointer-events:none;transition:.25s}'+
    '.ce-ir:hover .ce-ir-wm{opacity:.16;transform:scale(1.04) rotate(-2deg)}'+
    '.ce-ir-ic{width:72px;height:72px;border-radius:18px;background:transparent;display:flex;align-items:center;justify-content:center;flex:none;position:relative;z-index:1;'+
      'box-shadow:0 0 0 1px rgba(255,159,0,.35),0 0 32px rgba(207,10,44,.6)}'+
    '.ce-ir-ic img{width:52px;height:52px;object-fit:contain;display:block}'+
    '.ce-ir-body{flex:1;min-width:0;position:relative;z-index:1}'+
    '.ce-ir-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:#FF9F00;display:flex;align-items:center;gap:7px}'+
    '.ce-ir-dot{width:7px;height:7px;border-radius:50%;background:'+BRAND2+';box-shadow:0 0 0 0 rgba(22,163,74,.7);animation:cpirp 1.6s infinite}'+
    '@keyframes cpirp{0%{box-shadow:0 0 0 0 rgba(22,163,74,.6)}70%{box-shadow:0 0 0 8px rgba(22,163,74,0)}100%{box-shadow:0 0 0 0 rgba(22,163,74,0)}}'+
    '.ce-ir-t{font-size:19px;font-weight:900;color:#fff;letter-spacing:.05em;text-transform:uppercase;margin-top:4px}'+
    '.ce-ir-s{font-size:11.5px;color:#9FB0C8;font-weight:600;margin-top:3px;letter-spacing:.01em}'+
    '.ce-ir-go{font-size:13px;font-weight:900;color:#fff;background:'+BRAND+';border-radius:999px;padding:12px 22px;white-space:nowrap;flex:none;display:flex;align-items:center;gap:8px;position:relative;z-index:1;letter-spacing:.04em;transition:.14s}'+
    '.ce-ir:hover .ce-ir-go{gap:12px;box-shadow:0 4px 18px rgba(207,10,44,.6)}'+
    '@media(max-width:560px){.ce-ir{flex-wrap:wrap}.ce-ir-go{width:100%;justify-content:center}}'+
    '.ce-ir.edgar{background:linear-gradient(115deg,#070502 0%,#171106 60%,#070502 100%);border-color:rgba(197,164,90,.35)}'+
    '.ce-ir.edgar:before{background:linear-gradient(90deg,#8C6D2F,#E3C878,#8C6D2F)}'+
    '.ce-ir.edgar:hover{box-shadow:0 16px 42px rgba(197,164,90,.32);border-color:rgba(227,200,120,.75)}'+
    '.ce-ir.edgar .ce-ir-ic{background:transparent;box-shadow:0 0 0 1px rgba(227,200,120,.28),0 0 32px rgba(197,164,90,.55)}'+
    '.ce-ir.edgar .ce-ir-ic img{width:72px;height:72px}'+
    '.ce-ir.edgar .ce-ir-k{color:#E3C878}'+
    '.ce-ir.edgar .ce-ir-dot{background:#E3C878;animation:none;box-shadow:0 0 8px rgba(227,200,120,.8)}'+
    '.ce-ir.edgar .ce-ir-go{background:linear-gradient(135deg,#E3C878,#B8933F);color:#1A1305}'+
    '.ce-ir.edgar:hover .ce-ir-go{box-shadow:0 4px 18px rgba(197,164,90,.6)}'+
    '.ce-ir.edgar .ce-ir-wm{opacity:.1}'+
    '.ce-ir.edgar:hover .ce-ir-wm{opacity:.17}'+
  '</style>'+
  '<div class="ce-srcrow">'+
  '<a class="ce-ir" href="'+CE_IR_URL+'" target="_blank" rel="noopener">'+
    '<img class="ce-ir-wm" src="'+CE_LOGO_URL+'" alt="" aria-hidden="true">'+
    '<span class="ce-ir-ic"><img src="'+CE_LOGO_URL+'" alt="Mastercard logo" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="ce-ir-body">'+
      '<span class="ce-ir-k"><span class="ce-ir-dot"></span>THE SOURCE · EARNINGS HQ</span>'+
      '<span class="ce-ir-t" style="display:block">Mastercard Investor Relations</span>'+
      '<span class="ce-ir-s" style="display:block">Release · webcast · slides · transcripts — straight from investor.mastercard.com. Skip the search, go direct.</span>'+
    '</span>'+
    '<span class="ce-ir-go">OPEN IR <span>↗</span></span>'+
  '</a>'+
  '<a class="ce-ir edgar" href="'+CE_EDGAR_URL+'" target="_blank" rel="noopener">'+
    '<img class="ce-ir-wm" src="'+CE_SEC_SEAL+'" alt="" aria-hidden="true">'+
    '<span class="ce-ir-ic"><img src="'+CE_SEC_SEAL+'" alt="SEC seal" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="ce-ir-body">'+
      '<span class="ce-ir-k"><span class="ce-ir-dot"></span>THE RECORD · U.S. SECURITIES AND EXCHANGE COMMISSION</span>'+
      '<span class="ce-ir-t" style="display:block">Mastercard on EDGAR</span>'+
      '<span class="ce-ir-s" style="display:block">10-K · 10-Q · 8-K · DEF 14A — the regulator\'s copy, as filed. What IR curates, EDGAR certifies.</span>'+
    '</span>'+
    '<span class="ce-ir-go">OPEN EDGAR <span>↗</span></span>'+
  '</a>'+
  '</div>';
}

function ceQkey(q){ return String(q||'').replace(/\s/g,''); }
// Quarter selector is PHASE-AWARE: Post-Results only offers quarters that have a `results` block.
function ceQPhases(q){ var ph=['setup','watch']; if(q.results) ph.push('results'); return ph; }
function ceQPills(){
  return '<div class="ce-qpills">'+CALL_EARNINGS.quarters.map(function(q,i){
    return '<button type="button" class="ce-qpill'+(i===0?' active':'')+'" data-ceqsel="'+esc(ceQkey(q.q))+'" data-ceqhas="'+ceQPhases(q).join(' ')+'">'+esc(q.q)+(q.status==='upcoming'?'<span class="ce-qtag">upcoming</span>':'')+'</button>';
  }).join('')+'</div>';
}
// A · The Setup — the grid is BUILT FROM THE ARCHIVE (CE_CONS), not hand-authored. Hand-authored per
// quarter: setup.us (Summit's own number) and setup.notes (caveat pop-ups), both keyed by metric name.
function ceFmtV(u,v){
  if(v==null) return null;
  if(u==='$')  return '$'+(+v).toFixed(2);
  if(u==='$B') return '$'+(+v)+'B';
  if(u==='B')  return (+v)+'B';
  return String(v);
}
function ceGrowth(m,qi,base){
  if(m.t==='basis') return null;
  var c=m.qr[qi]?m.qr[qi][3]:null;
  var b=(base==='qoq')?m.qq[qi]:m.qy[qi];
  if(c==null||b==null||!b) return null;
  return Math.round((c/b-1)*100);
}
function ceChip(g){
  if(g==null) return '';
  var up=g>=0;
  return '<span class="ce-gchip" style="color:'+(up?'#0a8f4c':'#C5221F')+'">'+(up?'+':'−')+Math.abs(g)+'%</span>';
}
// Margin lens (headline only): Operating income / EBITDA also carry a margin = metric ÷ Net revenue.
var CE_MARGIN_ON={'Operating income':1,'EBITDA':1};
function ceMarginPct(v, rev){ return (v==null||rev==null||!rev)?null:Math.round((v/rev*100)*10)/10; }
function ceMChip(p){ return p==null?'':'<span class="ce-mm">'+p+'% mgn</span>'; }
function ceMarginRow(cur, baseYoy, baseQoq){
  if(cur==null) return '';
  return '<div class="ce-mrow"><span class="ce-mrow-l">margin</span>'+
    '<span class="ce-mrow-v">'+cur+'%'+
      (baseYoy!=null?'<span class="ce-mm-b yoy"> (prev '+baseYoy+'%)</span>':'')+
      (baseQoq!=null?'<span class="ce-mm-b qoq"> (prev '+baseQoq+'%)</span>':'')+
    '</span></div>';
}
function ceGrid(u,which){
  var qi=CE_CONS.q.indexOf(u.q); if(qi<0) return '';
  var st=u.setup||{}, us=st.us||{}, notes=st.notes||{};
  var revM=CE_CONS.m.filter(function(x){ return x.k==='Net revenue'; })[0];
  var revC=(revM&&revM.qr[qi])?revM.qr[qi][3]:null;
  var revS=(us['Net revenue']?us['Net revenue'].v:null)||revC;
  var revQy=revM?revM.qy[qi]:null, revQq=revM?revM.qq[qi]:null;
  var list=CE_CONS.m.map(function(m,i){ return {m:m,i:i}; })
    .filter(function(x,i){ return (which==='head')?(x.i<CE_CONS.nHead):(x.i>=CE_CONS.nHead); });
  return '<div class="ce-mgrid">'+list.map(function(x){
    var m=x.m, c=m.qr[qi]?m.qr[qi][3]:null;
    var note=notes[m.k], q=note?ceQ('setnote-'+ceQkey(u.q)+'-'+x.i, note.t, note.h):'';
    var uv=us[m.k];
    var mgn=CE_MARGIN_ON[m.k];
    var street=(c==null)
      ? '<span class="ce-empty">—</span>'+(m.t==='nocons'?'<span class="ce-nocons" title="The archive carries no forward estimate for this line — actuals only">no est.</span>':'')
      : ceFmtV(m.u,c)+'<span class="ce-gy">'+ceChip(ceGrowth(m,qi,'yoy'))+'</span><span class="ce-gq">'+ceChip(ceGrowth(m,qi,'qoq'))+'</span>';
    var mRow=mgn?ceMarginRow(ceMarginPct(c,revC), ceMarginPct(m.qy[qi],revQy), ceMarginPct(m.qq[qi],revQq)):'';
    return '<div class="ce-mcell'+(which==='cust'?' cust':'')+(m.t==='basis'?' flagged':'')+'">'+
      '<div class="ce-mcell-k">'+esc(m.k)+q+'</div>'+
      '<div class="ce-mcell-v">'+
        '<div class="ce-val ce-val-cons"><span class="ce-val-lab">Street</span>'+street+'</div>'+
        '<div class="ce-val ce-val-us"><span class="ce-val-lab">Summit</span>'+(uv?ceFmtV(m.u,uv.v):'<span class="ce-empty">—</span>')+'</div>'+
        mRow+
      '</div></div>';
  }).join('')+'</div>';
}
function ceGridStyle(){
  return '<style>'+
    '.ce-mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:8px;margin:4px 0}'+
    '.ce-mcell{border:1px solid var(--bdr);border-left:3px solid '+BRAND+';border-radius:9px;padding:8px 10px;background:#fff}'+
    '.ce-mcell.cust{border-left-color:'+BRAND2+'}'+
    '.ce-mcell.flagged{border-left-color:'+GRAY+';opacity:.72}'+
    '.ce-mcell-k{font-size:10px;font-weight:700;color:var(--mu);display:flex;align-items:center;gap:4px;line-height:1.3;min-height:26px}'+
    '.ce-mcell-v{margin-top:3px}'+
    '.ce-mcell .ce-val{display:flex;align-items:baseline;gap:5px;font-size:14px;font-weight:900;color:var(--navy);font-variant-numeric:tabular-nums}'+
    '.ce-mcell .ce-val-lab{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);flex:none;width:38px}'+
    '.ce-gchip{font-size:10px;font-weight:800;margin-left:2px}'+
    '.ce-mm{display:none}'+'.ce-mm-b{display:none;font-size:9px;font-weight:700;color:var(--mu);white-space:nowrap}'+'.ce-evwrap[data-mm="on"][data-g="yoy"] .ce-mm-b.yoy{display:inline}'+'.ce-evwrap[data-mm="on"][data-g="qoq"] .ce-mm-b.qoq{display:inline}'+'.ce-mrow{display:none;align-items:baseline;gap:5px;margin-top:5px;padding-top:5px;border-top:1px dashed var(--bdr)}'+'.ce-evwrap[data-mm="on"] .ce-mrow{display:flex}'+'.ce-mrow-l{font-size:8px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);flex:none}'+'.ce-mrow-v{font-size:11px;font-weight:900;color:'+PURPLE+';font-variant-numeric:tabular-nums}'+
    '.ce-evwrap[data-mm="on"] .ce-mm{display:inline}'+
    '.ce-nocons{font-size:8.5px;font-weight:800;color:var(--mu);border:1px solid var(--bdr);border-radius:999px;padding:1px 6px;margin-left:6px}'+
    '.ce-evwrap[data-g="yoy"] .ce-gq,.ce-evwrap[data-g="qoq"] .ce-gy,'+
    '.ce-evwrap[data-g="off"] .ce-gy,.ce-evwrap[data-g="off"] .ce-gq{display:none}'+
    '.ce-gseg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.ce-gseg button{font-size:10px;font-weight:800;padding:3px 11px;border:0;border-radius:999px;background:transparent;color:var(--mu);cursor:pointer;transition:.14s}'+
    '.ce-gseg button.active{background:var(--navy);color:#fff}'+'.ce-vdf{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+'.ce-vdf button{font-size:10px;font-weight:800;padding:3px 11px;border:0;border-radius:999px;background:transparent;color:var(--mu);cursor:pointer;transition:.14s}'+'.ce-vdf button.active{background:var(--navy);color:#fff}'+
    '.ce-fz[data-ev="cons"] .ce-fz-g[data-f="beat"] .ce-fz-t:not([data-vdc="beat"]),'+'.ce-fz[data-ev="cons"] .ce-fz-g[data-f="miss"] .ce-fz-t:not([data-vdc="miss"]),'+'.ce-fz[data-ev="cons"] .ce-fz-g[data-f="inline"] .ce-fz-t:not([data-vdc="inline"]),'+'.ce-fz[data-ev="us"] .ce-fz-g[data-f="beat"] .ce-fz-t:not([data-vdu="beat"]),'+'.ce-fz[data-ev="us"] .ce-fz-g[data-f="miss"] .ce-fz-t:not([data-vdu="miss"]),'+'.ce-fz[data-ev="us"] .ce-fz-g[data-f="inline"] .ce-fz-t:not([data-vdu="inline"]){display:none}'+
    '.ce-dbt{display:flex;flex-direction:column;gap:5px}'+
    '.ce-dbt-r{display:grid;grid-template-columns:1.3fr 1fr 1fr 70px;gap:10px;align-items:center;'+
      'border:1px solid var(--bdr);border-left:4px solid var(--mu);border-radius:9px;padding:7px 12px;background:#fff}'+
    '.ce-dbt-r.above{border-left-color:#0a8f4c}.ce-dbt-r.below{border-left-color:'+RED+'}'+
    '.ce-dbt-k{font-size:11.5px;font-weight:800;color:var(--navy)}'+
    '.ce-dbt-v{font-size:11px;color:var(--navy);font-variant-numeric:tabular-nums}'+
    '.ce-dbt-v b{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu);margin-right:5px}'+
    '.ce-dbt-d{font-size:12px;font-weight:900;text-align:right;font-variant-numeric:tabular-nums}'+
    '.ce-dbt-r.above .ce-dbt-d{color:#0a8f4c}.ce-dbt-r.below .ce-dbt-d{color:'+RED+'}'+
    '.ce-dbt-none{border:1px dashed var(--bdr);border-radius:10px;padding:10px 13px;font-size:11px;'+
      'line-height:1.55;color:var(--mu);background:#FAFBFD}'+
    '@media(max-width:640px){.ce-dbt-r{grid-template-columns:1fr auto}.ce-dbt-v{display:none}}'+
  '</style>';
}
function ceSetupBody(c){
  var h=ceStyle()+ceGridStyle();
  h+=CALL_EARNINGS.quarters.map(function(u,qi){
    var qk=ceQkey(u.q), frozen=(u.status!=='upcoming');
    var b='<div class="ce-qblock" data-ceq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="ce-phase" style="background:'+BLUE+'">① Pre-Call'+(frozen?'<span class="ce-frozen">frozen</span>':'')+'</div>';
    var st=u.setup||{}, hasGrid=(CE_CONS.q.indexOf(u.q)>=0);
    if(hasGrid){
      b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup.</b> The numbers going in — what the <b>Street</b> expects, what <b>Summit</b> expects, and where the two disagree. '+(u.date?((frozen?'Reported <b>':'Reports <b>')+esc(u.date)+'</b>.'):'')+'</p>';
      b+='<div class="ov-diagram-cap" style="margin:6px 0 6px;display:flex;flex-wrap:wrap;align-items:center;gap:12px"><b>Estimates</b>'+
        '<span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px">'+
          '<button type="button" class="ce-ev-pill active" data-ceev="cons">Consensus</button>'+
          '<button type="button" class="ce-ev-pill" data-ceev="us">Summit</button>'+
          '<button type="button" class="ce-ev-pill" data-ceev="both">Both</button>'+
        '</span>'+
        '<span class="ce-gseg"><button type="button" class="active" data-ceg="yoy">YoY</button>'+
          '<button type="button" data-ceg="qoq">QoQ</button>'+
          '<button type="button" data-ceg="off">Off</button></span>'+
        '<span class="ce-gseg"><button type="button" data-cemm="on">Margin</button>'+
          '<button type="button" class="active" data-cemm="off">Hide mgn</button></span>'+
        (st.source?'<span style="color:var(--mu);font-weight:600;font-size:10px">'+esc(st.source)+(st.asOf?' · as of '+esc(st.asOf):'')+'</span>':'')+
      '</div>';
      b+='<div class="ce-evwrap" data-ev="cons" data-g="yoy">';
      b+='<div class="ce-row-cap">Headline — every company, always</div>'+ceGrid(u,'head');
      b+='<div class="ce-row-cap" style="margin-top:12px">Custom KPIs — Mastercard</div>'+ceGrid(u,'cust');
      b+='</div>';
      b+='<div class="ave-subh-note" style="margin-top:6px">Growth chips are computed from the archive: <b>YoY</b> against the year-ago actual, <b>QoQ</b> against the prior quarter. '+
         '<b>Street</b> = Bloomberg (BST), hardcoded from the export only. <b>Summit</b> = our own expectation. <b>?</b> = a number with a caveat worth knowing. '+
         '<span style="color:#6B7684">Source: Street consensus (Bloomberg) via BBG_CONSENSUS.txt + reported actuals · as of 2026 Q2. Summit not covered; cross-border volume has no BBG series.</span></div>';
      var d=st.debate, dqi=CE_CONS.q.indexOf(u.q), dus=st.us||{};
      if(dqi>=0){
        var diffs=[], nous=[];
        CE_CONS.m.forEach(function(m){
          var c=m.qr[dqi]?m.qr[dqi][3]:null, uv=dus[m.k]?dus[m.k].v:null;
          if(c==null) return;
          if(uv==null){ nous.push(m.k); return; }
          diffs.push({ k:m.k, c:c, u:uv, d:((uv/c-1)*100), t:m.t, un:m.u });
        });
        diffs.sort(function(x,z){ return Math.abs(z.d)-Math.abs(x.d); });
        b+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>The debate — where Summit differs from the Street</b>'+
           '<span style="color:var(--mu);font-weight:600;font-size:10px"> · sorted by the size of the gap</span></div>';
        if(diffs.length){
          b+='<div class="ce-dbt">'+diffs.map(function(x){
            var side=(x.d>=0)?'above':'below';
            return '<div class="ce-dbt-r '+side+'">'+
              '<span class="ce-dbt-k">'+esc(x.k)+'</span>'+
              '<span class="ce-dbt-v"><b>Street</b> '+ceFmtV(x.un,x.c)+'</span>'+
              '<span class="ce-dbt-v"><b>Summit</b> '+ceFmtV(x.un,x.u)+'</span>'+
              '<span class="ce-dbt-d">'+(x.d>=0?'+':'−')+Math.abs(x.d).toFixed(1)+'%</span></div>';
          }).join('')+'</div>';
        }
        if(nous.length){
          b+='<div class="ce-dbt-none"><b>No Summit number yet on '+nous.length+' of '+(nous.length+diffs.length)+' lines:</b> '+
             esc(nous.join(' · '))+'.<br>Until those are filled the debate is the Street against itself — '+
             'the grid above still shows what it expects, and the track record below shows how often it has been wrong.</div>';
        }
        if(d&&d.synth) b+='<div class="ce-synth">'+d.synth+'</div>';
      }
      b+='<div class="ov-foot">Frozen at call time; Post-Results scores actuals against BOTH columns.</div>';
    }
    if(st.pricedIn||st.oneLiner){
      if(!hasGrid){
        b+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup, as it stood going in.</b> '+(u.date?('Reported <b>'+esc(u.date)+'</b>.'):'')+'</p>';
        if(st.source) b+='<div class="ave-subh-note" style="margin:0 0 8px">'+esc(st.source)+'</div>';
      } else {
        b+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>The contemporaneous read — written before the print, never rewritten</b></div>';
      }
      if(st.pricedIn) b+='<div class="ce-banner"><b>What was priced in:</b> '+st.pricedIn+'</div>';
      if(st.oneLiner) b+='<div class="ce-synth">'+st.oneLiner+'</div>';
      b+='<div class="ov-foot">Frozen — scored in Post-Results for this quarter.</div>';
    }
    b+='</div>';
    return b;
  }).join('');
  h+=ceAnnualBody();
  return h;
}
// A1 · The Setup chart — the Results-engine merged Setup chart (mirror of Results). Renders from the
// MA_SETUP dataset registered in RESULTS_DATA (MA reuses maResults, populated from the Q2 2026 BBG
// export + reported actuals). No period series is fabricated. (§4.5 of the migration spec.)
function ceAnnualBody(){
  return '<div class="ce-ann" style="margin:20px 0 4px;padding:16px 0 0;border-top:2px solid var(--bdr)">'+
    '<div class="ov-sec-h">The Setup picture — reported vs Street (Summit not covered for MA): pick any line, window the period with the lever, toggle margins</div>'+
    resultsHtml('MA_SETUP')+'</div>';
}
function ceSetupWrap(){ return document.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phpane[data-cep="setup"] .rs-wrap'); }
function gBuildCeAnnual(){ var w=ceSetupWrap(); if(w) initResults(w, 'MA_SETUP'); }   // builds the MA_SETUP Results chart
function wireCeAnnual(root){ /* engine self-wires; the Setup chart is built by gBuildCeAnnual */ }

// B · Watch List — one card per WL_ROWS row. idSfx keeps pop-up ids unique; qLabel shows the quarter
// chip in the flat view; editable adds the ✎/✕ controls (live quarter only).
function ceWatchItem(w, qk, idSfx, qLabel, editable){
  var deep='';
  if(w.seededBy) deep+='<p style="border-left:3px solid '+PURPLE+';padding-left:9px;margin-bottom:10px"><b>'+(w.seededBy.tripped?'Seeded by a TRIPPED trigger':'Seeded by')+' '+esc(w.seededBy.q)+':</b> "'+esc(w.seededBy.n)+'"</p>';
  if(w.src) deep+='<p><b>Why it earned a slot:</b> '+w.src+'</p>';
  if(w.thread&&w.thread.length){
    deep+='<p style="margin-bottom:4px"><b>The thread — how this theme has evolved:</b></p>'+
      w.thread.map(function(t){ return '<div style="display:flex;gap:9px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:12px;line-height:1.5"><b style="white-space:nowrap;color:'+BRAND+'">'+esc(t.q)+'</b><span>'+t.n+'</span></div>'; }).join('');
  }
  var why=deep?ceReg('watchwhy-'+(w.id||qk+'-'+(w.rank||0))+idSfx, esc(w.theme), deep):null;
  var tagsAttr=(w.tags&&w.tags.length)?w.tags.join(' '):'';
  var seed=w.seededBy?'<span class="ce-seed" title="'+esc(w.seededBy.n)+'">'+(w.seededBy.tripped?'⚑ thesis line broke in '+esc(w.seededBy.q):'left open by '+esc(w.seededBy.q))+'</span>':'';
  var open=wlOpen(w);
  var ctl=editable?'<span class="ce-w-ctl"><button type="button" class="ce-w-ed" data-wledit="'+esc(w.id||'')+'" title="Edit this theme (and close its hook by filling Tracking until)">✎</button>'+
    '<button type="button" class="ce-w-del" data-wldel="'+esc(w.id||'')+'" title="Remove this theme">✕</button></span>':'';
  return '<div class="ce-w" data-wltags="'+esc(tagsAttr)+'" data-wlid="'+esc(w.id||'')+'" data-wlopen="'+(open?'1':'0')+'">'+
    '<div class="ce-w-top"><span class="ce-w-dot" aria-hidden="true"></span><div class="ce-w-metric">'+esc(w.theme)+'</div>'+seed+
    (w.trackUntil?'<span class="ce-w-closed" title="Hook closed in '+esc(w.trackUntil)+'">closed</span>':'')+
    (qLabel?'<span class="ov-chip" style="font-size:9.5px;background:rgba(207,10,44,0.10);color:'+BRAND+';border-radius:20px;padding:2px 9px;font-weight:800;flex:none">'+esc(qLabel)+'</span>':'')+
    (why?'<span class="ce-why-btn ov-clickable" data-detail="ce:'+why+'" style="margin:0">'+(w.thread?'the thread':'background')+' ›</span>':'')+ctl+'</div>'+
    (w.definition?'<div class="ce-w-def">'+w.definition+'</div>':'')+
    '<div class="ce-w-chips">'+
      (w.tags&&w.tags.length?w.tags.map(function(t){ return '<span class="ce-w-chip tag">#'+esc(t)+'</span>'; }).join(''):'')+
      (w.trackSince?'<span class="ce-w-chip since"><b>Tracking since:</b> '+esc(w.trackSince)+'</span>':'')+
      (w.trackUntil?'<span class="ce-w-chip until"><b>Tracking until:</b> '+esc(w.trackUntil)+'</span>':'')+
    '</div>'+
  '</div>';
}
function ceQuarterOpts(sel, blankLabel){
  var latest=CALL_EARNINGS.quarters[0] ? ceQnum(CALL_EARNINGS.quarters[0].q) : null;
  var start=2024*4+1;
  var end=latest||(2026*4+3);
  var out='<option value="">'+esc(blankLabel||'—')+'</option>';
  for(var t=end; t>=start; t--){
    var lab='Q'+(((t-1)%4)+1)+' '+Math.floor((t-1)/4);
    out+='<option value="'+esc(lab)+'"'+(sel===lab?' selected':'')+'>'+esc(lab)+'</option>';
  }
  return out;
}
function ceWlForm(){
  return '<div class="ce-wl-addform" hidden>'+
    '<div class="ce-wl-fh"><b class="ce-wl-fh-t">New theme</b><span class="ce-wl-fh-s">the hunt list is ours — the model does not get a vote on this tab</span></div>'+
    '<input type="hidden" data-wlf="id">'+
    '<label class="ce-wl-lb">Theme <span>what we are hunting</span></label>'+
    '<input class="ce-wl-in" data-wlf="theme" placeholder="e.g. Regulatory: CCCA routing mandate">'+
    '<label class="ce-wl-lb">Tags <span>click to select · they drive the cross-quarter filter</span></label>'+
    '<div class="ce-wl-tagpick" data-wlf="tagpick"></div>'+
    '<div class="ce-wl-newtag"><input class="ce-wl-in" data-wlf="newtag" placeholder="create a new tag (e.g. regulatory)"><button type="button" class="ce-wl-newtag-go">+ add tag</button></div>'+
    '<label class="ce-wl-lb">Definition <span>required — what the theme means, in our words</span></label>'+
    '<textarea class="ce-wl-in ce-wl-ta" data-wlf="definition" rows="3" placeholder="What this theme is and why it moves the thesis"></textarea>'+
    '<div class="ce-wl-2col">'+
      '<div><label class="ce-wl-lb">Tracking since</label><select class="ce-wl-in" data-wlf="trackSince">'+ceQuarterOpts(null,'— pick a quarter —')+'</select></div>'+
      '<div><label class="ce-wl-lb">Tracking until <span>empty = still open</span></label><select class="ce-wl-in" data-wlf="trackUntil">'+ceQuarterOpts(null,'— still open —')+'</select></div>'+
    '</div>'+
    '<div class="ce-wl-frow"><button type="button" class="ce-wl-add-go">Add to the live list</button>'+
      '<button type="button" class="ce-wl-cancel">cancel</button>'+
      '<span class="ave-subh-note">Lives for this session only. Persisting = COPY the table at the bottom and hardcode it into <code>WL_ROWS</code>.</span></div>'+
  '</div>';
}
var WL_COLS=[
  {k:'id',l:'id'},{k:'q',l:'quarter'},{k:'rank',l:'order'},{k:'theme',l:'theme'},
  {k:'tags',l:'tags'},{k:'definition',l:'definition'},
  {k:'trackSince',l:'tracking since'},{k:'trackUntil',l:'tracking until'}
];
function wlCellText(r, k){
  var v=r[k];
  if(k==='tags') return (v||[]).join(', ');
  if(v==null) return '';
  return String(v).replace(/<[^>]+>/g,'');
}
function wlCount(){
  var open=WL_ROWS.filter(wlOpen).length;
  return WL_ROWS.length+' rows · '+open+' open hook'+(open===1?'':'s')+' · live';
}
function ceWlTableRows(){
  return WL_ROWS.map(function(r){
    return '<tr'+(wlOpen(r)?' class="wl-open"':'')+'>'+WL_COLS.map(function(c){
      var t=wlCellText(r,c.k);
      var cls=(c.k==='theme')?' class="wl-th"':((c.k==='id'||c.k==='q'||c.k==='rank')?' class="wl-key"':'');
      return '<td'+cls+'>'+(t?esc(t):'<span class="ce-empty">—</span>')+'</td>';
    }).join('')+'</tr>';
  }).join('');
}
function ceWlTable(){
  return '<div class="ce-wl-tbl-wrap" id="maWlTable">'+
    '<div class="ce-wl-tbl-h">'+
      '<span class="ce-wl-tbl-t">The Watch List table — one row per theme</span>'+
      '<span class="ce-wl-tbl-s">the storage view</span>'+
      '<span class="ce-wl-tbl-n">'+wlCount()+'</span>'+
      '<button type="button" class="ce-wl-copy alt" data-wltoggle="1">show table</button>'+
      '<button type="button" class="ce-wl-copy" data-wlcopy="tsv">COPY</button>'+
      '<button type="button" class="ce-wl-copy alt" data-wlcopy="json">copy JSON</button>'+
    '</div>'+
    '<div class="ce-wl-tbl-sc" data-wltblbody hidden>'+'<table class="ce-wl-tbl"><thead><tr>'+
      WL_COLS.map(function(c){ return '<th>'+esc(c.l)+'</th>'; }).join('')+
    '</tr></thead><tbody class="ce-wl-tbody">'+ceWlTableRows()+'</tbody></table></div>'+
    '<div class="ave-subh-note" style="margin-top:7px"><b>The round-trip:</b> add / edit / delete themes above → this table updates → hit <b>COPY</b> (tab-separated) or <b>copy JSON</b> (exact) → paste it back and it gets hardcoded into <code>WL_ROWS</code> in a commit. Persistent editing needs Supabase — pending assignment.</div>'+
  '</div>';
}
function ceWatchBody(c){
  var h=ceStyle();
  h+='<div class="ce-wl-hint">🔁 <b>How quarters advance:</b> a new <i>upcoming</i> quarter appears in Setup & Watch List <b>only once the prior quarter\'s Post-Results (print + call highlights) is filled</b>. Fill Q(n) Post-Results → then Q(n+1) opens for prep.</div>';
  h+='<div class="ce-wl-tagbar"><span class="ce-wl-bar-k">Filter by theme (across quarters):</span>'+
    wlTags().map(function(t){ return '<button type="button" class="ce-wl-tag" data-wltag="'+esc(t)+'">#'+esc(t)+'</button>'; }).join('')+
    '<button type="button" class="ce-wl-tag ce-wl-clear" data-wltag="">clear</button>'+
    '<button type="button" class="ce-wl-add-btn">+ Add theme</button>'+
  '</div>';
  h+='<div class="ce-wl-tagbar" style="margin-top:-4px"><span class="ce-wl-bar-k">Tracking window:</span>'+
    '<span class="mg-seg" style="display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px">'+
      '<button type="button" class="ce-wl-win active" data-wlwin="all">All</button>'+
      '<button type="button" class="ce-wl-win" data-wlwin="open">Open hooks</button>'+
      '<button type="button" class="ce-wl-win" data-wlwin="closed">Closed</button>'+
    '</span>'+
    '<span class="ave-subh-note" style="margin-left:4px">A theme is <b>open</b> while it has a <i>Tracking since</i> and no <i>Tracking until</i>. We open and close them by hand.</span>'+
  '</div>';
  h+=ceWlForm();
  h+=CALL_EARNINGS.quarters.map(function(u,qi){
    var qk=ceQkey(u.q), frozen=(u.status!=='upcoming');
    var b='<div class="ce-qblock" data-ceq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="ce-phase" style="background:'+BLUE+'">① Pre-Call'+(frozen?'<span class="ce-frozen">frozen</span>':'')+'</div>';
    var wl=wlFor(u.q, !frozen);
    b+='<p class="ov-lede"><b>'+(frozen?'The list as it was frozen — ':'Things to hunt — ')+esc(u.q)+'</b>'+
      (frozen?' <span style="color:var(--mu);font-weight:600">(scored afterwards in Post-Results)</span>':' <span style="color:var(--mu);font-weight:600">(the open hooks — a <i>Tracking since</i> with no <i>Tracking until</i>)</span>')+
      '. Each card carries its <b>definition</b> — what the theme means in our words — its <b>tags</b>, and its <b>tracking window</b>. Tap <b>the thread ›</b> for the grounding and the quarter-by-quarter evolution. Ordered by weight, deliberately <b>not numbered</b>.</p>';
    b+='<div class="ce-legend"><span class="ce-legend-i"><b>How to read the cards:</b></span>'+
      '<span class="ce-legend-i"><span class="ce-seed">left open by Q1 2026</span> it is on the list because last quarter\'s call did not settle it</span>'+
      '<span class="ce-legend-i"><span class="ce-w-chip since"><b>Tracking since:</b> Q1 2026</span> with no <i>Tracking until</i> ⇒ the hook is still open</span>'+
      (frozen?'':'<span class="ce-legend-i"><span class="ce-w-ed" style="pointer-events:none">✎</span> edit — including closing the hook by filling <i>Tracking until</i></span>')+
    '</div>';
    if(!wl.length){ b+='<div class="ce-note">No open hooks for '+esc(u.q)+' yet — add themes with <b>+ Add theme</b> above.</div>'; }
    else{ b+='<div class="ce-watch">'+wl.map(function(w){ return ceWatchItem(w, qk, '', null, !frozen); }).join('')+'</div>'; }
    b+='<div class="ov-foot">'+(frozen?'Frozen — this list was scored against '+esc(u.q)+'\'s Post-Results; its <code>newQuestions</code> seeded the next quarter.':'Ours to curate: Post-Results lets the model run (numbers + call highlights), but what earns a slot here is our call. Frozen once the quarter opens.')+'</div>';
    b+='</div>';
    return b;
  }).join('');
  h+='<div class="ce-wl-all" hidden>';
  h+='<div class="ce-phase" style="background:'+PURPLE+'">Themes across quarters</div>';
  h+='<p class="ov-lede">Every watch item matching the selected theme(s), <b>across all quarters</b> — how the same hunt evolved print to print. Clear the tags (or pick a quarter) to return to the per-quarter view.</p>';
  h+='<div class="ce-watch">'+WL_ROWS.map(function(r){ return ceWatchItem(r, ceQkey(r.q), '-f', r.q, false); }).join('')+'</div>';
  h+='</div>';
  h+=ceWlTable();
  h+='<div style="margin-top:26px;border-top:2px solid var(--bdr);padding-top:16px">';
  h+='<div class="ce-band" style="--bc:'+BRAND+'"><span class="ce-band-i">▤</span><span class="ce-band-t">The theme record — every thread, across all calls</span><span class="ce-band-s">the multi-year backbone behind the hunt above (the former "Earnings Calls" tab, folded in)</span><span class="ce-band-l"></span></div>';
  h+=maCallsBody(c);
  h+='</div>';
  return h;
}

var CE_RES={ beat:{c:'#0a8f4c',l:'Beat'}, miss:{c:RED,l:'Miss'}, inline:{c:'#6b7684',l:'In line'},
             nodisc:{c:AMBER,l:'Not disclosed'}, nocons:{c:PURPLE,l:'No consensus'} };
var CE_HLTAG={ thesis:{c:'#0a8f4c',l:'Thesis'}, curious:{c:'#7A5AF8',l:'Curious'}, dots:{c:'#2E6BE6',l:'Connects dots'}, watch:{c:'#B7791F',l:'Watch'}, tone:{c:'#B7791F',l:'Tone'} };
function ceTkFmt(u,v){
  if(v==null) return '';
  if(u==='$')  return '$'+(+v).toFixed(2);
  if(u==='$B') return '$'+(+v).toFixed(1)+'B';
  if(u==='B')  return (+v).toFixed(2)+'B';
  return String(v);
}
function ceVerdict(m, c, a, surp){
  if(a==null) return {l:'—', c:'#9AA4B0', k:'none'};
  if(c==null) return {l:'no est.', c:'#7A5AF8', k:'noest'};
  if(surp==null) return {l:'—', c:'#9AA4B0', k:'none'};
  if(Math.abs(surp)<2) return {l:CE_RES.inline.l, c:CE_RES.inline.c, k:'inline'};
  return surp>0 ? {l:CE_RES.beat.l, c:CE_RES.beat.c, k:'beat'} : {l:CE_RES.miss.l, c:CE_RES.miss.c, k:'miss'};
}
// cePrintBlock · THE print, archive-driven (CE_CONS) + hand-authored notes/watch. Ranked by surprise.
// CE_CONS carries the actuals/consensus; the notes/watch data is relocated here.
function cePrintBlock(qLabel, r, us){
  var qi=CE_CONS.q.indexOf(qLabel); if(qi<0) return '';
  r=r||{}; us=us||{};
  var notes=r.notes||{}, watch=r.watch||{};
  var revM=CE_CONS.m.filter(function(x){ return x.k==='Net revenue'; })[0];
  var revC=(revM&&revM.qr[qi])?revM.qr[qi][3]:null, revA=revM?revM.qa[qi]:null;
  var revS=(us['Net revenue']&&us['Net revenue'].v!=null)?us['Net revenue'].v:revC;
  var tiles=CE_CONS.m.map(function(m){
    var c=m.qr[qi]?m.qr[qi][3]:null, a=m.qa[qi];
    var uexp=(us[m.k]&&us[m.k].v!=null)?us[m.k].v:null;
    if(c==null&&a==null&&uexp==null) return null;
    var cSurp=(c!=null&&a!=null&&c)?((a/c-1)*100):null;
    var uSurp=(uexp!=null&&a!=null&&uexp)?((a/uexp-1)*100):null;
    var cV=ceVerdict(m,c,a,cSurp), uV=ceVerdict(m,uexp,a,uSurp);
    var g=function(base){
      var bv=(base==='qoq')?m.qq[qi]:m.qy[qi];
      if(a==null||bv==null||!bv) return '<span class="ce-fz-g-e">—</span>';
      var gv=Math.round((a/bv-1)*100);
      return '<span style="color:'+(gv>=0?'#0a8f4c':'#C5221F')+'">'+(gv>=0?'+':'−')+Math.abs(gv)+'%</span>';
    };
    var surpTag=function(s){ return (s==null)?'':'<span class="ce-fz-d '+(s>=0?'up':'dn')+'">'+(s>=0?'+':'−')+(Math.round(Math.abs(s)*10)/10)+'%</span>'; };
    var mgnOn=CE_MARGIN_ON[m.k], mReal=mgnOn?ceMarginPct(a,revA):null;
    var mExpC=mgnOn?ceMarginPct(c,revC):null, mExpU=mgnOn?ceMarginPct(uexp,revS):null;
    var dPts=function(exp){ if(mReal==null||exp==null) return ''; var d=Math.round((mReal-exp)*10)/10;
      return '<span class="ce-fz-mdl '+(d>=0?'up':'dn')+'">'+(d>=0?'+':'−')+Math.abs(d)+' pts</span>'; };
    var mRow='';
    if(mgnOn&&mReal!=null){
      mRow='<div class="ce-fz-mrow"><span class="ce-fz-gl">margin</span>'+
        '<span class="ce-fz-mexp ce-exp-cons">exp '+(mExpC!=null?mExpC+'%':'—')+dPts(mExpC)+'</span>'+
        '<span class="ce-fz-mexp ce-exp-us">exp '+(mExpU!=null?mExpU+'%':'—')+dPts(mExpU)+'</span>'+
        '<span class="ce-fz-ar">→</span><span class="ce-fz-mreal">'+mReal+'% realized</span>'+
        ceQ('mgn-'+ceQkey(qLabel)+'-'+ceQkey(m.k),'Margin — expected vs realized',
          '<p><b>Expected</b> is the margin <i>implied by the estimate</i>: the estimate\'s metric ÷ the estimate\'s own Net revenue (Street = BBG ÷ BBG, Summit = ours ÷ ours). <b>Realized</b> is the print\'s own margin (actual ÷ actual). This is expectation vs outcome for the quarter — <b>there is no YoY/QoQ on the margin</b>.</p>')+
        '</div>';
    }
    var note=notes[m.k];
    var qb=note?ceReg('resnote-'+ceQkey(qLabel)+'-'+ceQkey(m.k), note.t||m.k, note.h||note):null;
    var wrRank=watch[m.k], wrTheme=null;
    if(wrRank){ var wrow=wlFor(qLabel,false).filter(function(x){ return x.rank===wrRank; })[0]; wrTheme=wrow?wrow.theme:null; }
    var wr=wrTheme||(wrRank?('Watch #'+wrRank):null);
    return { sort:(cSurp==null?-1:Math.abs(cSurp)), html:
      '<div class="ce-fz-t" data-vdc="'+cV.k+'" data-vdu="'+uV.k+'"'+(qb?' data-detail="ce:'+qb+'"':'')+'>'+
        '<div class="ce-fz-k">'+esc(m.k)+
          '<span class="ce-fz-vd ce-vd-cons" style="color:'+cV.c+'">'+cV.l+'</span>'+
          '<span class="ce-fz-vd ce-vd-us" style="color:'+uV.c+'">'+uV.l+'</span></div>'+
        '<div class="ce-fz-r"><span class="ce-fz-c ce-exp-cons">'+(c==null?'—':ceTkFmt(m.u,c))+'</span>'+
          '<span class="ce-fz-c ce-exp-us">'+(uexp==null?'—':ceTkFmt(m.u,uexp))+'</span>'+
          '<span class="ce-fz-ar">→</span><span class="ce-fz-a">'+(a==null?'—':ceTkFmt(m.u,a))+'</span>'+
          '<span class="ce-fz-dw ce-exp-cons">'+surpTag(cSurp)+'</span><span class="ce-fz-dw ce-exp-us">'+surpTag(uSurp)+'</span></div>'+
        '<div class="ce-fz-gr"><span class="ce-fz-gl">growth</span>'+
          '<span class="ce-gy">'+g('yoy')+'</span><span class="ce-gq">'+g('qoq')+'</span></div>'+
        mRow+
        (wr?'<div class="ce-fz-wl" title="On the frozen Watch List: '+esc(wr)+'">on the list</div>':'')+
        (qb?'<div class="ce-fz-more">＋ detail</div>':'')+
      '</div>' };
  }).filter(Boolean);
  if(!tiles.length) return '';
  tiles.sort(function(x,z){ return z.sort-x.sort; });
  return '<div class="ce-fz" data-g="yoy" data-ev="cons" data-mm="off"><div class="ce-fz-h">The print — ranked by surprise'+
    ceQ('fz-'+ceQkey(qLabel),'How this is built',
      '<p>One block, archive-driven. Every number and surprise is computed from the CE_CONS archive: the last snapshot before the print carries the consensus, a later snapshot carries the print. Reconstructed from data, so it cannot drift.</p>'+
      '<ul><li><b>vs Street ⇄ vs Summit</b> — swaps which frozen expectation the print is scored against.</li>'+
      '<li><b>Margin</b> — Operating income / EBITDA carry an expected-vs-realized margin (÷ Net revenue), Δ in pts.</li>'+
      '<li><b>Verdict</b> — beat / miss / in-line off the computed surprise.</li>'+
      '<li><b>on the list</b> — this line was on the Watch List we froze before the call</li></ul>')+
    '<span class="ce-vdf"><button type="button" class="active" data-vdf="all">All</button>'+
      '<button type="button" data-vdf="beat">Beats</button>'+
      '<button type="button" data-vdf="miss">Misses</button>'+
      '<button type="button" data-vdf="inline">In line</button></span>'+
    '<span class="ce-gseg" style="margin-left:auto"><button type="button" class="active" data-fzev="cons">vs Street</button>'+
      '<button type="button" data-fzev="us">vs Summit</button></span>'+
    '<span class="ce-gseg"><button type="button" data-fzmm="on">Margin</button>'+
      '<button type="button" class="active" data-fzmm="off">Hide mgn</button></span>'+
    '<span class="ce-gseg"><button type="button" class="active" data-ceg="yoy">YoY</button>'+
      '<button type="button" data-ceg="qoq">QoQ</button>'+
      '<button type="button" data-ceg="off">Off</button></span>'+
    '</div><div class="ce-fz-g" data-vdf-host>'+tiles.map(function(t){ return t.html; }).join('')+'</div>'+
    '<div class="ce-fz-f">Expectation (frozen, 1 quarter out) → the print → the print\'s own growth. <span style="color:#6B7684">Source: BBG_CONSENSUS.txt (consensus 1 quarter out) → reported actual.</span></div></div>';
}
function ceFold(title, sub, body, open){
  return '<div class="ov-collap ce-fold'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+
    '<span class="ce-fold-t">'+title+'</span>'+(sub?'<span class="ce-fold-s">'+sub+'</span>':'')+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+body+'</div></div>';
}
function cePhaseStyle(){
  return '<style>'+
    '.ce-fz{border:1px solid var(--bdr);border-radius:12px;padding:12px 14px;margin-bottom:14px;background:#FBFCFE}'+
    '.ce-fz-h{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.07em;color:var(--mu);margin-bottom:9px}'+
    '.ce-fz-g{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}'+
    '@media(max-width:900px){.ce-fz-g{grid-template-columns:repeat(2,1fr)}}'+
    '@media(max-width:520px){.ce-fz-g{grid-template-columns:1fr}}'+
    '.ce-fz-t{border:1px solid var(--bdr);border-radius:9px;padding:7px 9px;background:#fff}'+
    '.ce-fz-t.basis{opacity:.62}'+
    '.ce-fz-k{font-size:9.5px;font-weight:700;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '.ce-fz-r{display:flex;align-items:baseline;gap:4px;margin-top:2px;font-variant-numeric:tabular-nums}'+
    '.ce-fz-c{font-size:11px;color:var(--mu);font-weight:700}'+
    '.ce-fz-ar{font-size:9px;color:var(--mu)}'+
    '.ce-fz-a{font-size:13px;font-weight:900;color:var(--navy)}'+
    '.ce-fz-d{font-size:9.5px;font-weight:800;margin-left:auto}'+
    '.ce-fz-d.up{color:#0a8f4c}.ce-fz-d.dn{color:'+RED+'}.ce-fz-d.na{color:var(--mu);font-weight:700}'+
    '.ce-fz-f{font-size:9.5px;color:var(--mu);margin-top:8px}'+'.ce-fz-t{position:relative;transition:.14s}'+'.ce-fz-t[data-detail]{cursor:pointer}'+'.ce-fz-t[data-detail]:hover{box-shadow:0 4px 14px rgba(16,24,40,.10);transform:translateY(-1px)}'+'.ce-fz-vd{margin-left:auto;font-size:8.5px;font-weight:900;letter-spacing:.05em;text-transform:uppercase}'+'.ce-fz-k{display:flex;align-items:center;gap:5px}'+'.ce-fz-wl{font-size:8px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:'+BLUE+';margin-top:5px}'+'.ce-fz-more{position:absolute;right:9px;bottom:7px;font-size:8.5px;font-weight:800;color:'+BLUE+'}'+'.ce-fz-h{display:flex;align-items:center;gap:6px}'+'.ce-fz-gr{display:flex;align-items:baseline;gap:5px;margin-top:3px;font-size:9.5px;font-weight:800}'+'.ce-fz-gl{font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}'+'.ce-fz-mgn{display:flex;align-items:baseline;gap:5px;margin-top:3px;font-size:11px;font-weight:900;color:'+PURPLE+'}'+'.ce-fz-mexp{font-size:9px;font-weight:700;color:var(--mu)}'+'.ce-fz-g-e{color:var(--mu);font-weight:600}'+'.ce-fz[data-g="yoy"] .ce-gq,.ce-fz[data-g="qoq"] .ce-gy,'+'.ce-fz[data-g="off"] .ce-fz-gr{display:none}'+
    '.ce-fz-h{flex-wrap:wrap}'+
    '.ce-vd-us,.ce-exp-us{display:none}'+
    '.ce-fz[data-ev="us"] .ce-vd-cons,.ce-fz[data-ev="us"] .ce-exp-cons{display:none}'+
    '.ce-fz[data-ev="us"] .ce-vd-us,.ce-fz[data-ev="us"] .ce-exp-us{display:inline}'+
    '.ce-fz-dw{margin-left:auto}'+
    '.ce-fz-mrow{display:none;align-items:baseline;gap:5px;margin-top:4px;padding-top:4px;border-top:1px dashed var(--bdr);font-size:9.5px;font-weight:800}'+
    '.ce-fz[data-mm="on"] .ce-fz-mrow{display:flex;flex-wrap:wrap}'+
    '.ce-fz-mreal{font-size:11px;font-weight:900;color:'+PURPLE+'}'+
    '.ce-fz-mdl{font-weight:800;margin-left:3px}.ce-fz-mdl.up{color:#0a8f4c}.ce-fz-mdl.dn{color:'+RED+'}'+
    '.ce-fold{border:1px solid var(--bdr);border-radius:11px;margin:0 0 10px;overflow:hidden;background:#fff}'+
    '.ce-fold .ov-collap-h{display:flex;align-items:center;gap:8px;width:100%;text-align:left;border:0;background:#FAFBFD;'+
      'padding:9px 13px;cursor:pointer;font-family:inherit}'+
    '.ce-fold .ov-collap-h:hover{background:#F2F6FB}'+
    '.ce-fold .ov-collap-ic{font-size:10px;color:var(--mu)}'+
    '.ce-fold-t{font-size:11px;font-weight:800;color:var(--navy)}'+
    '.ce-fold-s{font-size:10px;color:var(--mu);font-weight:600;margin-left:auto;text-align:right}'+
    '.ce-fold .ov-collap-b{padding:12px 13px}'+
    '.ce-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}'+
    '@media(max-width:760px){.ce-cards{grid-template-columns:1fr}}'+
    '.ce-card{border:1px solid var(--bdr);border-left:4px solid var(--sc,#9AA4B0);border-radius:10px;padding:9px 11px;background:#fff}'+
    '.ce-card-h{display:flex;align-items:center;gap:6px;flex-wrap:wrap}'+
    '.ce-card-m{font-size:11.5px;font-weight:800;color:var(--navy)}'+
    '.ce-card-v{font-size:9px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--sc);margin-left:auto}'+
    '.ce-card-b{display:grid;grid-template-columns:auto 1fr;gap:2px 8px;margin-top:6px;font-size:10.5px;line-height:1.45}'+
    '.ce-card-l{color:var(--mu);font-weight:700;white-space:nowrap}'+
    '.ce-card-x{color:var(--navy)}'+
    '.ce-card-f{display:flex;align-items:center;gap:6px;margin-top:7px}'+
    '.ce-chip{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;padding:2px 7px;border-radius:999px}'+
    '.ce-chip.list{background:rgba(37,87,214,.12);color:'+BLUE+'}'+
    '.ce-chip.hi{background:rgba(234,67,53,.12);color:'+RED+'}'+
    '.ce-chip.md{background:rgba(255,159,0,.18);color:#7A5B02}'+
    '.ce-chip.lo{background:#EEF1F5;color:var(--mu)}'+
    '.ce-alsobox{margin-top:18px;border:1px solid var(--bdr);border-radius:12px;background:#fff;overflow:hidden}'+
    '.ce-alsobox-h{padding:10px 13px;background:#F6F8FA;border-bottom:1px solid var(--bdr);display:flex;flex-direction:column;gap:2px}'+
    '.ce-alsobox-h>b{font-size:12px;color:var(--navy);font-weight:800}'+
    '.ce-alsobox-sub{font-size:9.5px;color:var(--mu);font-weight:600;line-height:1.4}'+
    '.ce-alsolist{display:flex;flex-direction:column}'+
    '.ce-also-i{border-bottom:1px solid var(--bdr)}'+'.ce-also-i:last-child{border-bottom:0}'+
    '.ce-also-s{display:flex;align-items:center;gap:8px;padding:9px 13px;cursor:pointer;list-style:none;font-size:11.5px;font-weight:600;color:var(--navy);line-height:1.45}'+
    '.ce-also-s::-webkit-details-marker{display:none}'+
    '.ce-also-s:hover{background:#FAFBFD}'+
    '.ce-also-tag{font-size:8px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--tc,#6b7684);border:1px solid currentColor;border-radius:999px;padding:1px 7px;flex:none;opacity:.85}'+
    '.ce-also-hd{flex:1;min-width:0}'+
    '.ce-also-ar{margin-left:auto;color:var(--mu);font-size:10px;transition:transform .15s;flex:none}'+
    '.ce-also-i[open] .ce-also-ar{transform:rotate(180deg)}'+
    '.ce-also-body{padding:0 13px 12px 13px;font-size:10.5px;font-weight:500;color:var(--navy);line-height:1.55;background:#FBFCFE}'+
    '.ce-also-body p{margin:6px 0}'+
    '.ce-sum{border:1px solid var(--bdr);border-radius:12px;background:#fff;margin:2px 0 14px}'+
    '.ce-sum>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:9px;padding:11px 14px;border-radius:12px;background:linear-gradient(180deg,rgba(122,90,248,.06),transparent)}'+
    '.ce-sum>summary::-webkit-details-marker{display:none}'+
    '.ce-sum-ic{font-size:15px}'+'.ce-sum-h b{font-size:13px;color:var(--navy)}'+
    '.ce-sum-tag{font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;color:'+PURPLE+';background:rgba(122,90,248,.12);border:1px solid rgba(122,90,248,.25);border-radius:999px;padding:2px 8px;margin-left:auto}'+
    '.ce-sum[open]>summary{border-bottom:1px solid var(--bdr);border-radius:12px 12px 0 0}'+
    '.ce-sum-body{padding:12px 15px 15px}'+
    '.ce-sum-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:11px}'+
    '.ce-sum-tt{font-size:10px;color:var(--mu);font-weight:600;margin-right:auto}'+
    '.ce-sum-btn{font-size:9.5px;font-weight:800;color:'+BLUE+';border:1px solid var(--bdr);background:#fff;border-radius:999px;padding:3px 10px;cursor:pointer;transition:.12s}'+
    '.ce-sum-btn:hover{border-color:'+BLUE+';background:rgba(37,87,214,.06)}'+
    '.ce-sum-block{margin:0 0 13px}'+
    '.ce-sum-para{font-size:12.5px;line-height:1.7;color:var(--navy);font-weight:500;margin:0}'+
    '.ce-sum-more{border:0!important;background:transparent!important;border-radius:0;margin:5px 0 0}'+
    '.ce-sum-more>.ce-sum-nt{padding:2px 0;font-size:10px;font-weight:800;color:'+BLUE+';text-transform:none}'+
    '.ce-sum-more>.ce-sum-nt .ce-sum-caret{color:'+BLUE+'}'+
    '.ce-sum-more>.ce-sum-nb{padding:7px 0 4px 13px;border-left:2px dashed var(--bdr);margin-top:5px;font-size:11.5px;line-height:1.65}'+
    '.ce-sum-nodes{display:flex;flex-direction:column;gap:6px}'+
    '.ce-sum-n{border:1px solid var(--bdr);border-left:3px solid '+BLUE+';border-radius:9px;background:#FBFCFE}'+
    '.ce-sum-n[data-d="1"]{border-left-color:'+BRAND2+';background:#fff}'+
    '.ce-sum-n[data-d="2"]{border-left-color:'+AMBER+'}'+
    '.ce-sum-nt{list-style:none;cursor:pointer;display:flex;align-items:center;gap:7px;padding:8px 11px;font-size:11.5px;font-weight:700;color:var(--navy)}'+
    '.ce-sum-nt::-webkit-details-marker{display:none}'+
    '.ce-sum-caret{font-size:9px;color:var(--mu);transition:transform .15s;flex:none}'+
    '.ce-sum-n[open]>.ce-sum-nt .ce-sum-caret{transform:rotate(90deg)}'+
    '.ce-sum-nb{padding:0 12px 11px 21px;font-size:11px;line-height:1.65;color:var(--navy);font-weight:500}'+
    '.ce-sum-nb .ce-sum-nodes{margin-top:9px}'+
    '.ce-gl{border-bottom:1px dashed '+BLUE+';cursor:help;position:relative}'+
    '.ce-gl:hover::after{content:attr(data-def);position:absolute;left:0;bottom:calc(100% + 8px);width:min(300px,74vw);white-space:normal;text-align:left;background:#10141A;color:#fff;font-size:10.5px;font-weight:500;line-height:1.55;padding:9px 12px;border-radius:9px;box-shadow:0 10px 28px rgba(16,24,40,.28);z-index:60}'+
    '.ce-gl:hover::before{content:"";position:absolute;left:16px;bottom:calc(100% + 3px);border:5px solid transparent;border-top-color:#10141A;z-index:61}'+
    '.ce-hcards{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}'+
    '@media(max-width:760px){.ce-hcards{grid-template-columns:1fr}}'+
    '.ce-hcard{border:1px solid var(--bdr);border-top:3px solid var(--hc,#9AA4B0);border-radius:10px;padding:9px 11px;background:#fff;cursor:pointer;transition:.14s}'+
    '.ce-hcard:hover{box-shadow:0 4px 14px rgba(16,24,40,.09);transform:translateY(-1px)}'+
    '.ce-hcard-t{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--hc)}'+
    '.ce-hcard-h{font-size:11px;color:var(--navy);line-height:1.5;margin-top:3px}'+
    '.ce-rl{display:flex;flex-direction:column;gap:5px}'+
    '.ce-rl-row{display:grid;grid-template-columns:74px 1fr auto;gap:10px;align-items:center;'+
      'border:1px solid var(--bdr);border-left:4px solid #0a8f4c;border-radius:9px;padding:8px 12px;background:#fff}'+
    '.ce-rl-row.trip{border-left-color:'+RED+';background:rgba(234,67,53,.035)}'+
    '.ce-rl-v{font-size:9.5px;font-weight:900;letter-spacing:.06em;color:#0a8f4c}'+
    '.ce-rl-row.trip .ce-rl-v{color:'+RED+'}'+
    '.ce-rl-l{font-size:11.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.ce-rl-w{font-size:9.5px;font-weight:800;color:'+BLUE+';white-space:nowrap;cursor:pointer}'+
    '@media(max-width:600px){.ce-rl-row{grid-template-columns:64px 1fr}.ce-rl-w{display:none}}'+
    '.ce-tee{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}'+
    '.ce-tee-c{border:1px solid var(--bdr);border-top:3px solid '+AMBER+';border-radius:10px;'+
      'padding:9px 11px;background:#fff;cursor:pointer;transition:.14s}'+
    '.ce-tee-c:hover{box-shadow:0 4px 14px rgba(16,24,40,.09);transform:translateY(-1px)}'+
    '.ce-tee-h{font-size:11.5px;color:var(--navy);line-height:1.45;font-weight:600}'+
    '.ce-tee-m{font-size:9.5px;font-weight:800;color:'+BLUE+';margin-top:6px}'+
  '</style>';
}
function ceResultsBody(c){
  var h=ceStyle()+cePhaseStyle();
  h+=CALL_EARNINGS.quarters.map(function(q,qi){
    var qk=ceQkey(q.q);
    var b='<div class="ce-qblock" data-ceq="'+esc(qk)+'"'+(qi===0?'':' hidden')+'>';
    b+='<div class="ce-phase" style="background:'+BRAND2+'">② Post-Results</div>';
    var r=q.results;
    if(!r){ b+='<p class="ov-lede"><b>'+esc(q.q)+' — the numbers vs. the frozen expectations.</b></p>'+
      '<div class="ce-note">Empty until the print lands.</div></div>'; return b; }
    b+='<p class="ov-lede"><b>'+esc(q.q)+' — the print, scored against what was frozen going in.</b> '+
       'Toggle <b>vs Street ⇄ vs Summit</b> to score the print against either expectation, and <b>Margin</b> for the expected-implied → realized margin. Below the scorecard, a supplemental <i>"Also on the call"</i> aside carries the colour.</p>';
    b+=cePrintBlock(q.q, r, (q.setup&&q.setup.us)||{});
    b+=ceSummaryBlock(q.q, r.summary);
    if(r.thesisCheck&&r.thesisCheck.length){
      var tc=r.thesisCheck.slice().sort(function(a,z){ return (z.tripped?1:0)-(a.tripped?1:0); });
      var nTrip=tc.filter(function(t){ return t.tripped; }).length;
      b+='<div class="ov-diagram-cap" style="margin:14px 0 6px"><b>Thesis red-lines</b> '+
         '<span style="color:var(--mu);font-weight:600;font-size:10px">· '+
         (nTrip?('<b style="color:'+RED+'">'+nTrip+' tripped</b> of '+tc.length):('all '+tc.length+' held'))+'</span></div>';
      b+='<div class="ce-rl">'+tc.map(function(t,i){
        var id=t.note?ceReg('rl-'+qk+'-'+i, (t.tripped?'TRIPPED — ':'HELD — ')+t.line, '<p>'+t.note+'</p>'):null;
        return '<div class="ce-rl-row'+(t.tripped?' trip':'')+'">'+
          '<span class="ce-rl-v">'+(t.tripped?'TRIPPED':'HELD')+'</span>'+
          '<span class="ce-rl-l">'+esc(t.line)+'</span>'+
          (id?'<span class="ce-rl-w ov-clickable" data-detail="ce:'+id+'">why ＋</span>':'<span></span>')+
        '</div>';
      }).join('')+'</div>';
    }
    if(r.intoCall&&r.intoCall.length){
      b+='<div class="ov-diagram-cap" style="margin:16px 0 6px"><b>What this tees up for the call</b> '+
         '<span style="color:var(--mu);font-weight:600;font-size:10px">· go in hunting these</span></div>';
      b+='<div class="ce-tee">'+r.intoCall.map(function(x,i){
        var mm=String(x).match(/^([\s\S]*?)\s+—\s+([\s\S]*)$/);
        var head=mm?mm[1]:x, body=mm?mm[2]:'';
        var id=body?ceReg('tee-'+qk+'-'+i, String(head).replace(/<[^>]+>/g,''), '<p>'+body+'</p>'):null;
        return '<div class="ce-tee-c"'+(id?' data-detail="ce:'+id+'"':'')+'>'+
          '<div class="ce-tee-h">'+head+'</div>'+
          (id?'<div class="ce-tee-m">＋ the ask</div>':'')+'</div>';
      }).join('')+'</div>';
    }
    b+=ceHighlightsBlock(q.call, qk);
    b+='<div class="ov-foot">Numbers scored against the frozen expectation — <b>Street</b> or <b>Summit</b> via the toggle; actuals = reported. The <i>Also on the call</i> aside is supplemental colour — the tracking layer is the Watch List.</div>';
    b+='</div>';
    return b;
  }).join('');
  return h;
}
// E · "Also on the call" — supplemental colour, a single box of native <details>. band:'lead' items
// are tracked on the Watch List and stay filtered out. call.take/threeMinutes/notBringing/newQuestions
// survive as data (newQuestions still seeds the next Watch List) but are not rendered.
function ceHighlightsBlock(cc, qk){
  if(!cc||!cc.highlights||!cc.highlights.length) return '';
  var hls=cc.highlights.filter(function(x){ return (x.band||'context')!=='lead'; });
  if(!hls.length) return '';
  var b='<div class="ce-alsobox"><div class="ce-alsobox-h"><b>Also on the call</b>'+
    '<span class="ce-alsobox-sub">supplemental colour — the meeting-critical items are the scorecard above and the Watch List</span></div>'+
    '<div class="ce-alsolist">';
  b+=hls.map(function(x){
    var det=x.detail||'';
    if(x.open) det+='<p><b>Still open:</b> '+x.open+'</p>';
    return '<details class="ce-also-i">'+
      '<summary class="ce-also-s">'+
        '<span class="ce-also-hd">'+x.head+'</span>'+
        (det?'<span class="ce-also-ar">▾</span>':'')+
      '</summary>'+
      (det?'<div class="ce-also-body">'+det+'</div>':'')+
    '</details>';
  }).join('');
  b+='</div></div>';
  return b;
}
// F · The AI-generated CALL SUMMARY — the "minute" (v2.10). Always-visible punch paragraphs, each with
// its own "＋ more" dropdown that can hold nested context-guide dropdowns. Authored from the transcript
// (seeded from the old headline + call.take).
function ceSumNodes(nodes, depth){
  if(!nodes||!nodes.length) return '';
  return '<div class="ce-sum-nodes">'+nodes.map(function(n){
    return '<details class="ce-sum-n" data-d="'+(depth>2?2:depth)+'">'+
      '<summary class="ce-sum-nt"><span class="ce-sum-caret">▸</span><span>'+n.t+'</span></summary>'+
      '<div class="ce-sum-nb">'+(n.body||'')+ceSumNodes(n.nodes, depth+1)+'</div>'+
    '</details>';
  }).join('')+'</div>';
}
function ceSumMore(more){
  if(!more) return '';
  if(typeof more==='string') return more;
  return (more.body||'')+ceSumNodes(more.nodes, 1);
}
function ceSummaryBlock(qLabel, s){
  if(!s||!s.paras||!s.paras.length) return '';
  var body=s.paras.map(function(pa,i){
    var p='<div class="ce-sum-block">'+
      '<p class="ce-sum-para">'+(pa.p||'')+'</p>';
    if(pa.more){
      p+='<details class="ce-sum-n ce-sum-more" data-d="0">'+
        '<summary class="ce-sum-nt"><span class="ce-sum-caret">▸</span><span>'+(pa.moreLabel||'＋ more — the detail behind this')+'</span></summary>'+
        '<div class="ce-sum-nb">'+ceSumMore(pa.more)+'</div>'+
      '</details>';
    }
    return p+'</div>';
  }).join('');
  return '<details class="ce-sum" open>'+
    '<summary class="ce-sum-h"><span class="ce-sum-ic">🧠</span><b>Call summary — the minute</b>'+
      '<span class="ce-sum-tag">AI — to author</span></summary>'+
    '<div class="ce-sum-body">'+
      '<div class="ce-sum-tools"><span class="ce-sum-tt">Authored from the transcript (seeded from the old headline + call take) · open <b>＋ more</b> for detail · hover a <span class="ce-gl" data-def="A term with a dashed underline — hover it to read its definition here.">dashed term</span></span>'+
        '<button type="button" class="ce-sum-btn" data-sum="exp">⊕ Expand all</button>'+
        '<button type="button" class="ce-sum-btn" data-sum="col">⊖ Collapse all</button></div>'+
      body+
    '</div>'+
  '</details>';
}
var CE_THST={ trend:{c:'#0a8f4c',l:'Confirmed trend'}, promise:{c:'#2E6BE6',l:'Promise — reconcile'}, watch:{c:'#B7791F',l:'Watch'} };
function ceQnum(q){ var m=String(q||'').match(/Q(\d)\s+(?:FY)?(\d{4})/); return m?((+m[2])*4+(+m[1])):null; }
function ceStAge(st){
  if(!st||typeof st!=='object'||!st.since) return '';
  var newest=CALL_EARNINGS.quarters.filter(function(q){ return q.status!=='upcoming'; })[0];
  var a=ceQnum(st.since), b=ceQnum(newest?newest.q:null);
  if(a==null||b==null) return '';
  var n=Math.max(1, b-a+1), k=(st.k||'');
  var lbl = (k==='promise') ? ('unreconciled '+n+' quarter'+(n>1?'s':''))
          : (st.silent)     ? ('silent '+n+' quarter'+(n>1?'s':''))
          : (k==='watch')   ? ('tracked '+n+' quarter'+(n>1?'s':''))
          :                   ('running '+n+' quarter'+(n>1?'s':''));
  return '<span class="calls-st-age"> · '+lbl+'</span>';
}
// Results / Estimates panes come from the shared engine (js/results.js), driven by RESULTS_DATA['MA'].
function ceResultsPending(label){
  return '<div class="ce-note" style="margin:8px 0">📊 <b>'+esc(label)+'</b> — the Amazon-style actuals-vs-estimates chart + table. '+
    'This pane is wired to the shared Results engine (<code>js/results.js</code>). The quarterly/annual actuals-vs-consensus '+
    'render in the Results tab from MA\'s dataset (<code>js/results-data/ma.js</code>); only the multi-quarter '+
    'Estimates-evolution block is not yet built.</div>';
}
// Tab switches: keep the clicked control visually anchored across a pane-height change.
function ceKeepPos(el, fn){
  var before=el.getBoundingClientRect().top;
  fn();
  var after=el.getBoundingClientRect().top, d=after-before;
  if(Math.abs(d)>1) window.scrollBy(0, d);
}
function ceSelectQuarter(pane, qk){
  pane.querySelectorAll('.ce-qpill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ceqsel')===qk); });
  pane.querySelectorAll('.ce-qblock').forEach(function(blk){ blk.hidden=(blk.getAttribute('data-ceq')!==qk); });
  pane.querySelectorAll('.ce-wl-tag').forEach(function(b){ b.classList.remove('active'); });
  var flat=pane.querySelector('.ce-wl-all'); if(flat) flat.hidden=true;
}
function ceApplyPhaseQuarters(pane, phase){
  var pills=Array.prototype.slice.call(pane.querySelectorAll('.ce-qpill')), lastVisible=null, activeVisible=false;
  pills.forEach(function(b){
    var ok=(b.getAttribute('data-ceqhas')||'').split(' ').indexOf(phase)>=0;
    b.hidden=!ok;
    if(ok){ lastVisible=b; if(b.classList.contains('active')) activeVisible=true; }
  });
  var firstVisible=pills.filter(function(b){ return !b.hidden; })[0];
  if(!activeVisible && firstVisible) ceSelectQuarter(pane, firstVisible.getAttribute('data-ceqsel'));
}
function wireCallEarnings(root){
  var pane=root.querySelector('.ovt-subpane[data-ovst="earnings"]'); if(!pane) return;
  pane.querySelectorAll('.ce-sum-btn').forEach(function(btn){ btn.onclick=function(e){
    e.preventDefault();
    var box=btn.closest('.ce-sum'); if(!box) return;
    var open=(btn.getAttribute('data-sum')==='exp');
    box.querySelectorAll('details.ce-sum-n').forEach(function(d){ d.open=open; });
  }; });
  pane.querySelectorAll('.ce-phtab').forEach(function(btn){ btn.onclick=function(){
    var key=btn.getAttribute('data-cep');
    ceKeepPos(btn, function(){
    pane.querySelectorAll('.ce-phtab').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.ce-phpane').forEach(function(p){ p.hidden=(p.getAttribute('data-cep')!==key); });
    ceApplyPhaseQuarters(pane, key);
    });
    if(key==='setup') requestAnimationFrame(gBuildCeAnnual);
  }; });
  pane.querySelectorAll('.ce-ev-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-ceev');
    pane.querySelectorAll('.ce-ev-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-ev', v); });
  }; });
  pane.querySelectorAll('.ce-qpill').forEach(function(btn){ btn.onclick=function(){
    ceSelectQuarter(pane, btn.getAttribute('data-ceqsel'));
  }; });
  ceApplyPhaseQuarters(pane, 'setup');
  pane.querySelectorAll('.ce-vdf button').forEach(function(btn){ btn.onclick=function(){
    var seg=btn.parentNode, host=seg.closest('.ce-fz'); if(!host) return;
    seg.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    var g=host.querySelector('.ce-fz-g'), v=btn.getAttribute('data-vdf');
    if(g){ if(v==='all') g.removeAttribute('data-f'); else g.setAttribute('data-f', v); }
  }; });
  // (Growth-lens / margin / print-block toggles — data-ceg/data-cemm/data-fzev/data-fzmm — are wired
  //  in wireCeTrack, called from init, faithfully to googl.js.)
  // ── Watch List v3: theme-tag filter · tracking-window filter · add/edit/delete vs WL_ROWS · table COPY ──
  var wpane=pane.querySelector('.ce-phpane[data-cep="watch"]');
  if(wpane){
    var flat=wpane.querySelector('.ce-wl-all');
    var form=wpane.querySelector('.ce-wl-addform');
    function activeTags(){ return Array.prototype.map.call(wpane.querySelectorAll('.ce-wl-tag.active'), function(b){ return b.getAttribute('data-wltag'); }).filter(Boolean); }
    function activeWin(){ var b=wpane.querySelector('.ce-wl-win.active'); return b?b.getAttribute('data-wlwin'):'all'; }
    function applyFilters(){
      var tags=activeTags(), on=tags.length>0, win=activeWin();
      if(on){ wpane.querySelectorAll('.ce-qblock').forEach(function(blk){ blk.hidden=true; }); }
      else{
        var act=pane.querySelector('.ce-qpill.active'); var qk=act?act.getAttribute('data-ceqsel'):null;
        wpane.querySelectorAll('.ce-qblock').forEach(function(blk){ blk.hidden=(qk!=null && blk.getAttribute('data-ceq')!==qk); });
      }
      if(flat) flat.hidden=!on;
      wpane.querySelectorAll('.ce-w').forEach(function(card){
        var ct=(card.getAttribute('data-wltags')||'').split(/\s+/);
        var isOpen=card.getAttribute('data-wlopen')==='1';
        var hitTag=!on || tags.some(function(t){ return ct.indexOf(t)>=0; });
        var hitWin=(win==='all') || (win==='open'&&isOpen) || (win==='closed'&&!isOpen);
        if(hitTag&&hitWin) card.removeAttribute('data-wlhide'); else card.setAttribute('data-wlhide','1');
      });
    }
    function wireTag(btn){ btn.onclick=function(){
      if(btn.classList.contains('ce-wl-clear')){ wpane.querySelectorAll('.ce-wl-tag').forEach(function(b){ b.classList.remove('active'); }); }
      else btn.classList.toggle('active');
      applyFilters();
    }; }
    wpane.querySelectorAll('.ce-wl-tag').forEach(wireTag);
    wpane.querySelectorAll('.ce-wl-win').forEach(function(btn){ btn.onclick=function(){
      wpane.querySelectorAll('.ce-wl-win').forEach(function(b){ b.classList.toggle('active', b===btn); });
      applyFilters();
    }; });
    function registerTag(t){
      if(!wpane.querySelector('.ce-wl-tag[data-wltag="'+t+'"]')){
        var b=document.createElement('button'); b.type='button'; b.className='ce-wl-tag'; b.setAttribute('data-wltag',t); b.textContent='#'+t;
        var clear=wpane.querySelector('.ce-wl-clear'); clear.parentNode.insertBefore(b, clear); wireTag(b);
      }
      var pick=form?form.querySelector('.ce-wl-tagpick'):null;
      if(pick&&!pick.querySelector('[data-pick="'+t+'"]')){
        var p=document.createElement('button'); p.type='button'; p.className='ce-wl-pick'; p.setAttribute('data-pick',t); p.textContent='#'+t;
        p.onclick=function(){ p.classList.toggle('on'); }; pick.appendChild(p);
      }
    }
    function fld(k){ return form?form.querySelector('[data-wlf="'+k+'"]'):null; }
    function fval(k){ var el=fld(k); return el?el.value.trim():''; }
    function setF(k,v){ var el=fld(k); if(el) el.value=(v==null?'':v); }
    function pickedTags(){ return Array.prototype.map.call(form.querySelectorAll('.ce-wl-pick.on'), function(b){ return b.getAttribute('data-pick'); }); }
    function resetForm(){
      ['id','theme','definition','trackSince','trackUntil','newtag'].forEach(function(k){ setF(k,''); });
      form.querySelectorAll('.ce-wl-pick.on').forEach(function(b){ b.classList.remove('on'); });
      form.querySelector('.ce-wl-fh-t').textContent='New theme';
      form.querySelector('.ce-wl-add-go').textContent='Add to the live list';
    }
    if(form){
      wlTags().forEach(registerTag);
      var nt=form.querySelector('.ce-wl-newtag-go');
      if(nt) nt.onclick=function(){
        var raw=fval('newtag'); if(!raw) return;
        raw.split(',').forEach(function(t){
          t=t.trim().toLowerCase().replace(/\s+/g,'-'); if(!t) return;
          registerTag(t);
          var p=form.querySelector('.ce-wl-pick[data-pick="'+t+'"]'); if(p) p.classList.add('on');
        });
        setF('newtag','');
      };
      var cancel=form.querySelector('.ce-wl-cancel');
      if(cancel) cancel.onclick=function(){ resetForm(); form.hidden=true; };
    }
    var addBtn=wpane.querySelector('.ce-wl-add-btn');
    if(addBtn&&form){ addBtn.onclick=function(){
      if(form.hidden){ resetForm(); form.hidden=false; } else form.hidden=true;
    }; }
    function rerender(){
      var live=ceUpcoming(); if(!live) return;
      var qk=ceQkey(live.q);
      var host=wpane.querySelector('.ce-qblock[data-ceq="'+qk+'"] .ce-watch');
      var rows=wlFor(live.q, true);
      if(host) host.innerHTML=rows.map(function(w){ return ceWatchItem(w, qk, '', null, true); }).join('');
      var flatHost=flat?flat.querySelector('.ce-watch'):null;
      if(flatHost) flatHost.innerHTML=WL_ROWS.map(function(r){ return ceWatchItem(r, ceQkey(r.q), '-f', r.q, false); }).join('');
      var tb=wpane.querySelector('.ce-wl-tbody');
      if(tb) tb.innerHTML=ceWlTableRows();
      var n=wpane.querySelector('.ce-wl-tbl-n');
      if(n) n.textContent=wlCount();
      wireCards(); applyFilters();
    }
    function wireCards(){
      wpane.querySelectorAll('[data-wledit]').forEach(function(btn){ btn.onclick=function(){
        var r=wlById(btn.getAttribute('data-wledit')); if(!r||!form) return;
        resetForm(); form.hidden=false;
        setF('id',r.id); setF('theme',r.theme); setF('definition',r.definition);
        setF('trackSince',r.trackSince); setF('trackUntil',r.trackUntil);
        (r.tags||[]).forEach(function(t){ registerTag(t); var p=form.querySelector('.ce-wl-pick[data-pick="'+t+'"]'); if(p) p.classList.add('on'); });
        form.querySelector('.ce-wl-fh-t').textContent='Edit theme · '+r.id;
        form.querySelector('.ce-wl-add-go').textContent='Save changes';
        form.scrollIntoView({block:'nearest'});
      }; });
      wpane.querySelectorAll('[data-wldel]').forEach(function(btn){ btn.onclick=function(){
        var id=btn.getAttribute('data-wldel');
        var r=wlById(id); if(!r) return;
        if(!window.confirm('Remove "'+r.theme+'" from the Watch List?\n\nSession-only — the hardcoded table is untouched until you COPY it back.')) return;
        var i=WL_ROWS.indexOf(r); if(i>=0) WL_ROWS.splice(i,1);
        rerender();
      }; });
    }
    wireCards();
    var go=wpane.querySelector('.ce-wl-add-go');
    if(go&&form){ go.onclick=function(){
      var theme=fval('theme'); if(!theme){ var t=fld('theme'); if(t) t.focus(); return; }
      var live=ceUpcoming(); if(!live) return;
      var id=fval('id');
      var row=id?wlById(id):null;
      var isNew=!row;
      if(isNew){ row={ id:wlNextId(), q:live.q, rank:wlNextRank(live.q) }; }
      row.theme=theme;
      row.tags=pickedTags();
      row.definition=fval('definition')||null;
      row.trackSince=fval('trackSince')||null;
      row.trackUntil=fval('trackUntil')||null;
      if(isNew) WL_ROWS.push(row);
      (row.tags||[]).forEach(registerTag);
      resetForm(); form.hidden=true;
      rerender();
    }; }
    wpane.querySelectorAll('[data-wltoggle]').forEach(function(btn){ btn.onclick=function(){
      var body=wpane.querySelector('[data-wltblbody]'); if(!body) return;
      var hide=!body.hasAttribute('hidden');
      if(hide) body.setAttribute('hidden',''); else body.removeAttribute('hidden');
      btn.textContent=hide?'show table':'hide table';
    }; });
    wpane.querySelectorAll('.ce-wl-copy[data-wlcopy]').forEach(function(btn){ btn.onclick=function(){
      var kind=btn.getAttribute('data-wlcopy'), txt;
      if(kind==='json'){ txt=JSON.stringify(WL_ROWS, null, 2); }
      else {
        txt=[WL_COLS.map(function(c){ return c.l; }).join('\t')].concat(
          WL_ROWS.map(function(r){ return WL_COLS.map(function(c){
            return wlCellText(r,c.k).replace(/[\t\n]+/g,' ');
          }).join('\t'); })).join('\n');
      }
      var done=function(){ var o=btn.textContent; btn.textContent='copied ✓'; setTimeout(function(){ btn.textContent=o; }, 1500); };
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done, done); }
      else { var ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select();
             try{ document.execCommand('copy'); }catch(e){} document.body.removeChild(ta); done(); }
    }; });
    applyFilters();
  }
}
// Growth-lens / margin / print-block toggles (data-ceg/data-cemm on the Setup grid + data-fzev/
// data-fzmm/data-ceg on the print block). Ported from googl.js wireCeTrack. Called from init.
function wireCeTrack(root){
  var pane=root.querySelector('.ovt-subpane[data-ovst="earnings"]'); if(!pane) return;
  function ceSetLens(v){
    pane.querySelectorAll('.ce-gseg button[data-ceg]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ceg')===v); });
    pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-g', v); });
    pane.querySelectorAll('.ce-fz').forEach(function(f){ f.setAttribute('data-g', v); });
  }
  ceSetLens('yoy');
  pane.querySelectorAll('.ce-ev-pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ceev')==='cons'); });
  pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-ev','cons'); });
  pane.querySelectorAll('.ce-gseg button[data-cemm]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-cemm')==='off'); });
  pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-mm','off'); });
  pane.querySelectorAll('.ce-gseg button[data-ceg]').forEach(function(btn){ btn.onclick=function(){
    ceSetLens(btn.getAttribute('data-ceg'));
  }; });
  pane.querySelectorAll('.ce-gseg button[data-cemm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-cemm');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    pane.querySelectorAll('.ce-evwrap').forEach(function(w){ w.setAttribute('data-mm', v); });
  }; });
  pane.querySelectorAll('.ce-gseg button[data-fzev]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzev'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(fz) fz.setAttribute('data-ev', v);
  }; });
  pane.querySelectorAll('.ce-gseg button[data-fzmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-fzmm'), fz=btn.closest('.ce-fz');
    btn.parentNode.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
    if(fz) fz.setAttribute('data-mm', v);
  }; });
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
    var sk=(ct.st&&ct.st.k)?ct.st.k:'watch'; var st=CE_THST[sk]||CE_THST.watch;
    h+='<div class="lpb-acc-item"><button type="button" class="lpb-acc-h"><span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap">'+esc(ct.theme)+' <span class="calls-st" style="color:'+st.c+';border-color:'+st.c+'">'+st.l+ceStAge(ct.st)+'</span></span><span class="lpb-acc-ic">+</span></button>';
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
      '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="results">Results</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="estevo">Estimates</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="guidance">Guidance</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="strategy">Strategy</button>'+
      '<button type="button" class="ovt-subtab" data-ovst="timeline">Timeline</button>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="earnings">'+
      ceIRButton()+
      '<div class="ce-note" style="margin-bottom:12px">🎯 <b>Earnings</b> — the decision layer, in two phases: <b>① Pre-Call</b> (go in ready — Setup · Watch List, with themes tracked across quarters) → <b>② Post-Results</b> (the print scored against what was frozen, <i>plus</i> the call highlights — "Also on the call"). Append-only per quarter — pick a quarter below; each quarter keeps its frozen pre-call blocks next to its post-mortem, so the tab is a record of how well we read Mastercard. The <b>Watch List</b> is the single home for what we <i>track over time</i>; the Post-Results highlights are <i>talking points</i>. <b>The numeric grid is populated from Bloomberg consensus + reported actuals (Summit not covered for MA); the Estimates-evolution block is still to build.</b></div>'+
      '<div class="ce-phtabs">'+
        '<button type="button" class="ce-phtab active" data-cep="setup">Setup</button>'+
        '<button type="button" class="ce-phtab" data-cep="watch">Watch List</button>'+
        '<button type="button" class="ce-phtab" data-cep="results">Post-Results</button>'+
      '</div>'+
      ceQPills()+
      '<div class="ce-phpane" data-cep="setup">'+ceSetupBody(c)+'</div>'+
      '<div class="ce-phpane" data-cep="watch" hidden>'+ceWatchBody(c)+'</div>'+
      '<div class="ce-phpane" data-cep="results" hidden>'+ceResultsBody(c)+'</div>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="results" hidden>'+(resultsHtml('MA')||ceResultsPending('Results'))+'</div>'+
    '<div class="ovt-subpane" data-ovst="estevo" hidden>'+(resultsEvoHtml('MA')||ceResultsPending('Estimates'))+'</div>'+
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
  if(group==='evolution' && key==='earnings'){
    // The Setup chart (Results engine) — build only when Earnings is visible AND the Setup phase is
    // active. Renders the MA_SETUP dataset via gBuildCeAnnual.
    var ph=root.querySelector('.ovt-subpane[data-ovst="earnings"] .ce-phtab.active');
    if(!ph || ph.getAttribute('data-cep')==='setup') requestAnimationFrame(gBuildCeAnnual);
  }
  if(group==='evolution' && key==='results') requestAnimationFrame(function(){
    initResults(root.querySelector('.ovt-subpane[data-ovst="results"] .rs-wrap'), 'MA'); });
  if(group==='evolution' && key==='estevo') requestAnimationFrame(initResultsEvo);
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
  wireCallEarnings(root); wireCeTrack(root); wireCeAnnual(root);

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
    if (kind==='ce'){ return CE_POP[id]||null; }
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
