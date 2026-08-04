// overviews/visa.js — Visa Inc. (NYSE: V), NEW FORMAT.
// Two SIBLING profile tabs (OVERVIEW_CONVENTIONS §1): a standardized Overview (the 7-block
// hook) + a Deep Dive (the uber/lyft/cart 5-tab spine). Golden Rule #1: the entire prior
// bespoke Overview was NOT deleted — every piece was MOVED into the most relevant Deep Dive
// pane (four-party model → Bottom Line ▸ Suppliers; fee lines/client-incentives → Bottom Line ▸
// Unit Economics; VAS + M&A → Top Line/Evolution; share classes / escrow / litigation →
// Valuation; financials → Valuation ▸ Balance Sheet). Convention: esc() leaves & LITERAL (never HTML-encode & in source).
//
// Live data (companies.js fills these; V is a Fiscal.ai-covered ticker):
//   · Market cap / peer bubbles → api.liveQuote (Massive) overrides dated seeds, per ticker.
//   · Analyst Ratings → #dd-val-slot ; Ownership & insiders → #dd-mgmt-slot.
// Financials seeded from Visa's 10-K actuals (fiscal year ends Sep 30). Visa is NOT in the
// Summit DCF universe, so there is no forward model projection here — FY2021–FY2025 actuals only.

import { makeManagement } from './management.js';
import { mountWatchList } from '../watchlist.js';

// Company (id + ticker) captured at render time, for the shared Watch List (Supabase) wiring.
var _co=null;

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Chart palette / formatters ──────────────────────────────────────────────
var C_AXIS='#8A93A0', C_GRID='#EEF2F7';
var V_BLUE='#1A1F71', V_GOLD='#F7B600', V_STEEL='#7A8699', V_GREEN='#16A34A';
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

// ── Block 1 — Key Facts (exactly 10, 5×2). Market cap cell is live (#vMc). ──
var V_FACTS=[
  ['Listing','NYSE: V'],
  ['HQ','San Francisco, CA, USA'],
  ['Founded','1958 — BankAmericard'],
  ['IPO','Mar 2008 · $44.00'],
  ['Fiscal year','Ends Sep 30'],
  ['CEO','Ryan McInerney · since Feb 2023'],
  ['Employees','~31,600 · FY2025'],
  ['Share classes','A (public) · B/C (banks)'],
  ['Dividend','Payer (+ buybacks)'],
  ['Market cap','~$650B · est'],
];
function stdKeyFacts(){
  return '<div class="stdkf">'+V_FACTS.slice(0,10).map(function(p){
    var v=p[0]==='Market cap' ? '<span id="vMc">'+esc(p[1])+'</span>' : esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}

// ── Block 2 — Description (high-level only; NON-redundant with the blocks below). ──
var V_LEDE="Visa is a global payments-technology company. It runs VisaNet — the larger of the world's two big open-loop card networks, the rails that authorize, clear and settle electronic payments between banks across 200+ countries — and, layered on top, a fast-growing set of value-added services (issuing, acceptance, risk & security, advisory, open banking and real-time payments). It is not a bank: it does not issue cards, lend, or set the interchange 'swipe fee' (those belong to the banks), and it takes no credit risk. It earns a thin fee on the volume and transactions that flow over its network, plus the services sold alongside — and, uniquely, its public shareholders are shielded from U.S. interchange litigation by a bank-funded escrow.";

// ── Block 3 — the 4-quadrant (each cell ≤ ~30 words). ──
var V_BIZ=[
  ['What it sells','Access to VisaNet — a global card-payment network (authorization, clearing, settlement) — plus value-added services: issuing & acceptance software, risk & security, data & advisory, open banking and real-time-payment infrastructure.'],
  ['Who buys it','~14,500 financial-institution clients (issuing & acquiring banks), plus merchants, fintechs, wallets, governments and processors that connect to the rails and buy the services.'],
  ['How it earns','A thin fee on network volume & transactions, net of client incentives, + services fees. FY2025 net revenue $40.0B — reported as Service, Data Processing, International (cross-border) and Other, less ~$16B of incentives.'],
  ['The edge','The largest global two-sided network — deepest acceptance and scale economics — a services layer that is often network-agnostic, no credit risk, and a bank-funded litigation escrow that shields public shareholders.'],
];
function stdFourQuad(){
  return '<div class="q2">'+V_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}

// ── Block 4 — How it makes money. Segments (2 reporting pillars) ⇄ Geography (US vs
// International) — both are the SAME FY2025 net revenue seen two ways (revenue cross-check). ──
var V_REV_SEG=[['Core payments network (Service + Data Processing + International)',70,'~$28B',V_STEEL],['Value-Added Services',30,'~$12B',V_GOLD]];
// Geography: Visa discloses payments VOLUME (not revenue) by geography — US vs International.
var V_REV_GEO=[['International (ex-US)',54,'~$7.6T PV',V_BLUE],['United States',46,'~$6.4T PV',V_STEEL]];
var V_MM_STATS=[['Net revenue','$40.0B FY25'],['Payments volume','~$14T/yr'],['Processed txns','~258B/yr'],['Credentials','~4.9B'],['VAS % of net rev','~30%'],['Cross-border','high-yield']];
var V_SEG_DEF=[
  { seg:'Core payments network',
    desc:'The switching business — the rails that authorize, clear and settle a card payment between issuer and acquirer. It earns three ways: Service revenue (a few basis points of payments volume), Data Processing (a near-fixed fee per transaction routed through VisaNet), and International Transaction revenue (cross-border + FX — the highest-yield line). Client incentives paid to issuers and partners net against all of these.',
    econ:[['Net revenue','~$28B (~70% of net)'],['Payments volume','~$14T'],['Cross-border growth','+11% cc (Q2 2026)'],['Processed-txn growth','~+9% (Q2 2026)']] },
  { seg:'Value-Added Services',
    desc:'Everything sold on top of the rails: issuing solutions, acceptance, risk & security, advisory/marketing, open banking (Tink) and real-time / account-to-account infrastructure. Much of it is network-agnostic — it earns on non-Visa volume too — and it is more recurring and higher-margin than network fees, which is why it is the main growth driver (~30% of net revenue and rising).',
    econ:[['Net revenue','~$12B (~30% of net)'],['Growth','+27% cc (Q2 2026)'],['Mix','~30% of net rev, rising'],['Character','recurring, network-agnostic']] },
];
var V_GEO_DEF=[
  { seg:'International (ex-US)',
    desc:'Payments volume on credentials issued outside the United States — the larger and structurally faster-growing side, because cash is still a big share of spend in many markets (a long cash-to-digital runway) and because cross-border travel and e-commerce concentrate here. Note: "International" here = issuance geography, distinct from cross-border (card country ≠ merchant country).',
    econ:[['Payments volume','~$7.6T (~54%)'],['Growth','+10% cc (Q2 2026)'],['Driver','cash-to-digital + cross-border']] },
  { seg:'United States',
    desc:'Payments volume on US-issued credentials — a more mature, more debit-heavy market than the international book. Still large and growing (+8% in Q2 2026), but with a shorter cash-conversion runway than the international side.',
    econ:[['Payments volume','~$6.4T (~46%)'],['Character','mature, more debit-weighted']] },
];
function stdMoneyMap(){
  var seg=mbars(V_REV_SEG);
  var geo=mbars(V_REV_GEO);
  var defBlock=function(defs, econLabel){ return '<div class="mm-defs acc-list" style="margin-top:12px">'+defs.map(function(s){
    var econ='<div class="acc" style="margin-top:8px"><button type="button" class="acc-h">'+esc(econLabel)+' <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">What is "'+esc(s.seg)+'"?<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+esc(s.desc)+'</div>'+econ+'</div></div>';
  }).join('')+'</div>'; };
  var h='<div class="mm-tog"><button type="button" class="mm-pill active" data-mm="seg">Segments</button><button type="button" class="mm-pill" data-mm="geo">Geography</button></div>';
  h+='<div class="mm-view" data-mm="seg">'+seg+defBlock(V_SEG_DEF,'Segment economics (FY2025 / FY2026 latest)')+'</div>';
  h+='<div class="mm-view" data-mm="geo" hidden>'+geo+defBlock(V_GEO_DEF,'Detail (payments-volume basis)')+'</div>';
  h+='<div class="mm-stats">'+V_MM_STATS.map(function(s){ return '<div class="mm-stat"><div class="mm-stat-v">'+esc(s[1])+'</div><div class="mm-stat-l">'+esc(s[0])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:10px">Cross-check: Core payments ~$28B + Value-Added Services ~$12B = <b>~$40B</b> net revenue ✓ (ties to FY2025 reported). The Geography view is a <b>different cut</b> — Visa discloses payments <b>volume</b> (not revenue) by geography: International ~$7.6T + US ~$6.4T ≈ <b>~$14T</b>. <span class="ave-subh-note">Net revenue = the four gross lines (Service, Data Processing, International, Other) minus ~$16B client incentives. VAS/core split is approximate (Visa reports VAS at ~30% of net revenue). "cc" = constant-currency. Source: Visa FY2025 10-K & FY2026 results.</span></div>';
  return h;
}

// ── Block 5 — Products (two-tier): family card → pop-up → specific items. ──
var V_PROD_GROUPS=[
  { seg:'Core payments network', families:[
    { ic:'💳', fam:'Consumer credit & debit', d:'The core branded card products.', items:[
      ['Classic / Gold / Signature / Infinite','A premium ladder of consumer credit products; higher tiers skew to affluent, higher-spend and cross-border cardholders (a US affluent card can be ~30× the revenue of an average one).'],
      ['Visa Debit & Visa Electron','Debit and entry-level brands — the everyday, volume-heavy rails.'],
      ['Flexible Credential','One credential that toggles debit / credit / BNPL / A2A funding sources (SMBC Japan, Affirm, Klarna, Block).'],
    ]},
    { ic:'🌐', fam:'Cross-border & processing', d:'The highest-yield and per-transaction rails.', items:[
      ['International transaction','Cross-border + FX fees where card country ≠ merchant country (travel + cross-border e-commerce) — a premium rate plus FX, the highest-yield line.'],
      ['VisaNet switching','Authorize / clear / settle — a near-fixed data-processing fee per transaction, resilient to ticket size.'],
    ]},
    { ic:'🏢', fam:'Commercial & new flows (CMS)', d:'Money movement beyond consumer cards.', items:[
      ['Visa Commercial Solutions','The #1 commercial card network (~40% share) — corporate, purchasing, virtual and small-business cards; verticals like travel, fleet & fuel.'],
      ['Visa Direct','Push funds to a card / account / wallet — 65+ use cases, ~11B+ endpoints, 195+ countries; powers payouts, gig pay and remittances.'],
      ['Visa B2B Connect / Visa A2A','Cross-border B2B rail and account-to-account payments (built on Tink / Earthport / Currencycloud).'],
    ]},
  ]},
  { seg:'Value-Added Services', families:[
    { ic:'🛠️', fam:'Issuing Solutions', d:'The largest VAS portfolio — help banks/fintechs run card programs.', items:[
      ['DPS','Debit processing for most of the largest US issuers.'],
      ['Pismo','Cloud-native core banking / issuer processing (~130M+ accounts) — can run non-Visa rails too ($1.0B, 2024).'],
      ['Cardholder benefits & engagement','Lounges, offers, loyalty — drives premium/affluent card fees.'],
      ['Smarter Stand-in Processing','AI approves transactions when an issuer\'s system is down (1,500+ issuers).'],
    ]},
    { ic:'🛒', fam:'Acceptance Solutions', d:'Network-agnostic — the seller/acquirer side.', items:[
      ['CyberSource','Enterprise gateway — 500k+ customers, 160+ countries ($2.0B, 2010).'],
      ['Authorize.net','Leading SMB gateway (~$200B annual volume).'],
      ['Verifi','Post-purchase dispute / chargeback resolution (network-agnostic).'],
      ['Tokenization / Click to Pay','~17.5B network tokens; streamlined online checkout.'],
    ]},
    { ic:'🛡️', fam:'Risk & Security', d:'Approve more, lose less — increasingly network-agnostic.', items:[
      ['Visa Advanced Authorization / Risk Manager','Real-time AI transaction scoring.'],
      ['Visa Protect (incl. A2A)','Fraud scoring extended to non-card real-time payments.'],
      ['Featurespace (ARIC)','Adaptive behavioral fraud detection ($ undisc., 2024).'],
      ['Account Attack Intelligence','Enumeration-attack defense; blocked 150M+ fraudulent transactions.'],
    ]},
    { ic:'📊', fam:'Advisory & Open Banking', d:'Data, expertise, marketing, account data.', items:[
      ['Visa Consulting & Analytics','3,000+ projects/yr; migrated ~150M cards TO Visa over a decade.'],
      ['Marketing Services','Powered by sponsorship assets — FIFA World Cup, Olympics, Red Bull F1.'],
      ['Tink','European open banking — 13,000+ bank connections (€1.8B, 2022).'],
      ['Data Solutions','Benchmarking, scoring and analytics.'],
    ]},
  ]},
];
function stdProducts(){
  return V_PROD_GROUPS.map(function(g,gi){
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
var V_PEERS=[
  { tk:'V',  n:'Visa',      evT:28, evF:24, peT:33, peF:27, gt:11, gf:11, mc:650, hl:true, why:'The largest global open-loop network — biggest by volume and acceptance, a ~2:1 brand preference, and a Class-B litigation escrow that shields public shareholders from US interchange claims. A premium multiple on a thin-fee, no-credit-risk model; a smaller (~30%) but fast-growing value-added-services mix.' },
  { tk:'MA', n:'Mastercard', evT:33, evF:28, peT:38, peF:31, gt:14, gf:13, mc:470, why:'The #2 network — smaller by volume but more international, a larger (~42%) value-added-services mix, and a slightly richer multiple. Unlike Visa it bears interchange litigation directly (no escrow shield).' },
  { tk:'AXP', n:'Amex',     evT:null, evF:null, peT:21, peF:18, gt:9, gf:9, mc:210, why:'Closed-loop — it issues and lends, so revenue includes net interest income and EV/EBITDA is not comparable (it carries credit risk). Shown on P/E only; a premium, affluent, spend-centric model that competes with Visa for high-end volume.' },
  { tk:'PYPL', n:'PayPal',  evT:12, evF:11, peT:16, peF:14, gt:8, gf:9, mc:75, why:'A digital-wallet / account-to-account player on a different rail that partly competes with cards — much cheaper on multiples, reflecting slower growth and a more contested moat. A frenemy: most of its funding and its debit cards still ride Visa/MA.' },
  { tk:'FI', n:'Fiserv',    evT:15, evF:14, peT:16, peF:14, gt:8, gf:8, mc:90, why:'A payments & fintech processor (Clover, Carat) that connects merchants and issuers to the rails — a partner and customer of Visa, not a network. A mid-teens multiple, well below the networks.' },
  { tk:'FIS', n:'FIS',      evT:13, evF:12, peT:14, peF:12, gt:6, gf:7, mc:45, why:'Fidelity National Information Services — core-banking & issuer processing that rides Visa\'s rails rather than competing with them. A cheaper, slower-growth processor multiple.' },
  { tk:'GPN', n:'Global Payments', evT:10, evF:9, peT:9, peF:8, gt:5, gf:6, mc:22, why:'A merchant acquirer / processor — the cheapest of the payments majors on a high-single-digit multiple, reflecting slow growth and integration overhang. Rides the rails, doesn\'t own them.' },
  { tk:'XYZ', n:'Block',    evT:13, evF:11, peT:16, peF:14, gt:10, gf:11, mc:48, why:'Square (acquiring) + Cash App (wallet / P2P) — partly competes for merchant and P2P flow, but its cards and funding still ride Visa/MA. A cheaper, more contested fintech multiple.' },
  { tk:'ADYEN', n:'Adyen',  evT:32, evF:26, peT:38, peF:30, gt:22, gf:21, mc:55, logo:'img/logos/adyen.svg', why:'A single-platform global acquirer / PSP — the high-growth premium name in acceptance, compounding ~20%+ at a network-like multiple. A partner on acceptance, not a network.' },
  { tk:'FOUR', n:'Shift4',  evT:14, evF:12, peT:16, peF:13, gt:22, gf:20, mc:10, why:'A fast-growing US acquirer (hospitality, stadiums, crypto) — ~20% growth at a mid-teens multiple. Rides the rails on the acceptance side.' },
  { tk:'CPAY', n:'Corpay',  evT:13, evF:12, peT:14, peF:12, gt:9, gf:9, mc:24, logo:'img/logos/corpay.svg', why:'A commercial-payments & fleet-card specialist (ex-FLEETCOR) — competes in the B2B / new-flows space Visa is chasing, at a low-teens multiple.' },
];
var V_SC={ type:'pe', basis:'f', peers:null };
function vScReset(){ V_SC.peers=V_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function vScMult(p){ if(V_SC.type==='ev') return V_SC.basis==='f'?p.evF:p.evT; return V_SC.basis==='f'?p.peF:p.peT; }
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
  h+='<div class="mg-tog-row"><span class="mg-tog">Multiple: <span class="mg-seg"><button type="button" class="mg-pill" data-mgtype="ev">EV/EBITDA</button><button type="button" class="mg-pill active" data-mgtype="pe">P/E</button></span></span>'+
     '<span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span></div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" id="vScSvg" role="img" aria-label="Peer valuation vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" id="vScXlab">P/E · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<g id="vScNodes"></g>'+
  '</svg></div>';
  h+='<div class="masc-chips" id="vScChips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">The map spans the <b>listed payments ecosystem</b> — the two networks (<b>Visa, Mastercard</b>), the closed-loop lender (<b>Amex</b>), a wallet (<b>PayPal</b>), the big processors (<b>Fiserv, FIS, Global Payments</b>), acquirers / PSPs (<b>Adyen, Shift4</b>), fintech (<b>Block</b>) and commercial payments (<b>Corpay</b>). <b>P/E is the default so every name plots;</b> switch to <b>EV/EBITDA</b> and the lenders drop out (Amex carries credit risk, so EV/EBITDA isn\'t meaningful). Remove a peer with the <b>×</b> or add one by ticker. Private / government rails (UPI, Pix, FedNow) and unlisted processors have no market multiple and sit on the qualitative map in <b>Deep Dive ▸ Top Line ▸ Industry Analysis</b>. <span class="ave-subh-note">Multiples & growth are approximate, web-sourced (mid-2026); market caps are live. Directional, not exact.</span></div>';
  h+='<div id="vScTip" class="mg-tip" hidden></div>';
  return h;
}
function vScRender(root){
  var g=root.querySelector('#vScNodes'); if(!g||!V_SC.peers) return;
  var mLo=7, mHi=V_SC.type==='ev'?34:40, gLo=4, gHi=24, X0=84, X1=610, Y0=250, Y1=46;
  var lab=root.querySelector('#vScXlab'); if(lab) lab.textContent=(V_SC.type==='ev'?'EV/EBITDA':'P/E')+' · '+(V_SC.basis==='f'?'forward':'trailing');
  var frag='';
  V_SC.peers.forEach(function(p){
    if(!p.on) return; var m=vScMult(p); if(m==null||isNaN(m)) return;
    var growth=V_SC.basis==='f'?p.gf:p.gt; if(growth==null) growth=p.gf!=null?p.gf:p.gt;
    var col=p.hl?V_BLUE:'#7A8699';
    var x=X0+Math.max(0,Math.min(1,(m-mLo)/(mHi-mLo)))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,((growth||0)-gLo)/(gHi-gLo)))*(Y0-Y1);
    var r=Math.max(15,Math.min(25, 13+Math.sqrt(Math.max(1,p.mc))*0.30)); var ri=r-2.5;
    var mono=esc((p.tk||p.n).slice(0,4));
    frag+='<g class="mg-node" data-tk="'+esc(p.tk)+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')" style="cursor:pointer">'+
      '<clipPath id="vClip-'+esc(p.tk)+'"><circle r="'+ri.toFixed(1)+'"/></clipPath>'+
      '<circle class="mg-dot" r="'+r.toFixed(1)+'" fill="#fff" stroke="'+col+'" stroke-width="'+(p.hl?3.5:2)+'"></circle>'+
      '<text class="mg-mono" y="4" text-anchor="middle" font-family="Inter,sans-serif" font-size="'+(ri>18?12:10)+'" font-weight="800" fill="'+col+'">'+mono+'</text>'+
      '<image href="'+(p.logo?esc(p.logo):'https://assets.parqet.com/logos/symbol/'+esc(p.tk))+'" x="'+(-ri).toFixed(1)+'" y="'+(-ri).toFixed(1)+'" width="'+(2*ri).toFixed(1)+'" height="'+(2*ri).toFixed(1)+'" clip-path="url(#vClip-'+esc(p.tk)+')" preserveAspectRatio="xMidYMid slice" onerror="this.remove()"></image>'+
      (p.hl?'<circle r="'+(r+3).toFixed(1)+'" fill="none" stroke="'+col+'" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6"></circle>':'')+
      '</g>';
  });
  g.innerHTML=frag;
}
function vScChips(root){
  var box=root.querySelector('#vScChips'); if(!box||!V_SC.peers) return;
  var h=V_SC.peers.map(function(p,i){ return '<span class="masc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="masc-add"><input id="vScAddTk" placeholder="+ TICKER" maxlength="6"><button type="button" id="vScAddBtn">Add</button></span>';
  box.innerHTML=h;
}

// ═══════════════════════════════════════════════════════════════════════════
//  DEEP DIVE DATA (migrated from the old bespoke Overview — Golden Rule #1)
// ═══════════════════════════════════════════════════════════════════════════

// ── Four-party (open-loop) model → Bottom Line ▸ Suppliers ("who powers the rails"). ──
var FOURPARTY_SVG =
'<svg viewBox="0 0 680 360" role="img" aria-label="Visa four-party model — click a box for its role">' +
  '<defs><marker id="vaar" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L7,3 L0,6 Z" fill="#9aa3b2"/></marker></defs>' +
  '<line x1="200" y1="56" x2="470" y2="56" stroke="#c2c8d2" stroke-width="1.5" marker-end="url(#vaar)"/>' +
  '<text x="335" y="44" text-anchor="middle" font-size="10" fill="#8A93A0">buys goods / services</text>' +
  '<line x1="115" y1="86" x2="115" y2="274" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="565" y1="86" x2="565" y2="274" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="196" y1="280" x2="262" y2="206" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<line x1="484" y1="280" x2="418" y2="206" stroke="#c2c8d2" stroke-width="1.5"/>' +
  '<g class="ov-fpm-node ov-clickable" data-detail="role:cardholder"><rect x="30" y="28" width="170" height="56" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="115" y="54" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Cardholder</text><text x="115" y="71" text-anchor="middle" font-size="9.5" fill="#8A93A0">tap to read role ›</text></g>' +
  '<g class="ov-fpm-node ov-clickable" data-detail="role:merchant"><rect x="480" y="28" width="170" height="56" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="565" y="54" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Merchant</text><text x="565" y="71" text-anchor="middle" font-size="9.5" fill="#8A93A0">tap to read role ›</text></g>' +
  '<g class="ov-fpm-node ov-clickable" data-detail="role:issuer"><rect x="30" y="276" width="170" height="62" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="115" y="302" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Issuer</text><text x="115" y="320" text-anchor="middle" font-size="9.5" fill="#8A93A0">cardholder’s bank ›</text></g>' +
  '<g class="ov-fpm-node ov-clickable" data-detail="role:acquirer"><rect x="480" y="276" width="170" height="62" rx="10" fill="var(--surface)" stroke="var(--bdr)"/><text x="565" y="302" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--navy)">Acquirer</text><text x="565" y="320" text-anchor="middle" font-size="9.5" fill="#8A93A0">merchant’s bank ›</text></g>' +
  '<g class="ov-fpm-node ov-clickable" data-detail="role:network"><rect x="250" y="150" width="180" height="64" rx="11" fill="'+V_BLUE+'" stroke="#0e1250" stroke-width="2.5"/><text x="340" y="180" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">VISA</text><text x="340" y="198" text-anchor="middle" font-size="9.5" fill="#cdd3f0">VisaNet · clearing & settlement ›</text></g>' +
'</svg>';
var ROLE_DETAIL = {
  cardholder: { t:'Cardholder', h:'The consumer who pays with a Visa credential. They are the <b>issuer\'s</b> customer — Visa has no direct relationship with them and charges them nothing; the merchant pays.' },
  issuer:     { t:'Issuer — the cardholder\'s bank', h:'Issues the card, extends the credit, <b>sets and earns the interchange</b>, takes the credit & fraud risk, and bills the cardholder. A Visa <b>client</b> that pays network fees — and the party Visa pays <b>incentives</b> to, to keep its volume.' },
  merchant:   { t:'Merchant', h:'The business accepting the card — the <b>acquirer\'s</b> customer. Pays a merchant discount = <b>interchange</b> (to the issuer) + <b>network fees</b> (to Visa) + <b>acquirer markup</b>.' },
  acquirer:   { t:'Acquirer — the merchant\'s bank/processor', h:'Onboards merchants, routes their transactions into the network, and settles funds to them. A Visa <b>client</b> that pays network fees.' },
  network:    { t:'Visa / VisaNet — the network', h:'<b>Authorizes, clears and settles</b> between issuer and acquirer. Earns a <b>service fee</b> (on volume), <b>data-processing</b> fees (per transaction) and <b>international / cross-border</b> fees — net of client incentives — plus value-added services. <b>Does not</b> issue, lend, or earn interchange, and takes no credit risk.' },
};
var FLOW_NODES = [
  { k:'card', ic:'💳', l:'Cardholder' }, { k:'merch', ic:'🏪', l:'Merchant' }, { k:'acq', ic:'🏛️', l:'Acquirer' }, { k:'net', ic:'🟦', l:'VisaNet' }, { k:'iss', ic:'🏦', l:'Issuer' },
];
var FLOW_STEPS = [
  { t:'Setup', on:[], cap:'A $100 purchase on a Visa card. Press <b>Play</b> to follow the money — and see where each party earns (or doesn\'t).', earn:'', earnType:'none' },
  { t:'1 · Authorization', on:['card','merch','acq','net','iss'], cap:'Tap. The request hops <b>merchant → acquirer → VisaNet → issuer</b>, which checks the balance and runs fraud in ~1–2 seconds, then approves.', earn:'No fee booked yet — authorization is part of the service, not a charge.', earnType:'none' },
  { t:'2 · Approval returns', on:['iss','net','acq','merch','card'], cap:'The "approved" travels back the same path. The cardholder walks out with the goods — but <b>no real money has moved</b>, only a promise to pay.', earn:'Still nothing settled; a stolen-card loss would land on the issuer, not Visa.', earnType:'none' },
  { t:'3 · Clearing', on:['acq','net','iss'], cap:'Later, in a batch, the acquirer submits the transaction. <b>VisaNet</b> computes the amounts and the interchange owed.', earn:'Visa books its <b>data-processing fee</b> — a near-fixed fee for routing this one transaction.', earnType:'net' },
  { t:'4 · Settlement', on:['iss','net','acq','merch'], cap:'The issuer pays <b>$100 minus interchange</b>; VisaNet moves funds to the acquirer, which pays the merchant the net.', earn:'Fees split: <b>~$1.50–2.50 interchange → ISSUER</b> · <b>Visa service + data fees (a few ¢) → VISA</b> · acquirer markup → ACQUIRER.', earnType:'split' },
  { t:'5 · Who got what', on:['card','merch','acq','net','iss'], cap:'The merchant nets ~<b>$97.50</b>. Visa never touched the $100 and never lent it.', earn:'<b>Interchange — the biggest slice — went to the ISSUER, not Visa.</b> Visa earned a few cents (data processing) + a few basis points of the $100 (service). That thinness × billions of transactions = the model.', earnType:'split' },
];
var FLOW_NOTE = 'Visa earns on a transaction <b>only when it runs over a Visa rail</b> (or when a Visa value-added service is attached). A Mastercard- or Amex-branded swipe runs over <b>their</b> network — Visa earns nothing on it. That is exactly why its value-added services (Cybersource, tokens, risk) are deliberately <b>network-agnostic</b>, so they earn on volume regardless of the card brand.';
var HOW_MONEY = [
  '<b>Not a bank:</b> Visa does not issue cards, lend, or earn interchange — those belong to the issuing banks. It never touches the purchase amount and takes <b>no credit risk</b>.',
  '<b>Network fees (the core):</b> <b>Service revenue</b> (a few basis points of payments volume), <b>International transaction</b> fees (the highest-yield line, where card country ≠ merchant country), and <b>Data processing</b> (a near-fixed fee per transaction routed through VisaNet). <b>Client incentives</b> net against these to reach net revenue.',
  '<b>Value-added services (the differentiator & growth engine):</b> issuing, acceptance, risk & security, advisory, open banking and real-time-payment infrastructure — sold on top of the rails, often <b>network-agnostic</b> (earning on non-Visa volume too).',
];

// ── Fee lines + Rebates → Bottom Line ▸ Unit Economics. ──
var PN_INTRO = 'The core payments network is Visa\'s switching business — ~70% of net revenue. It earns on the dollar <b>volume</b> and the <b>count of transactions</b> that flow over VisaNet: <b>Service revenue</b> (basis points of payments volume), <b>International transaction</b> fees (cross-border + FX, the highest-yield line) and <b>Data processing</b> (per transaction).';
var XBORDER_NOTE = '<b>Cross-border is a different cut from geography.</b> "International" payments <i>volume</i> means spend on cards <i>issued outside the U.S.</i>; <b>cross-border</b> (the International transaction revenue line) means the <i>card country ≠ merchant country</i> (travel + cross-border e-commerce). Cross-border earns a premium rate + FX — the <b>highest-yield</b> line and a key growth driver (+11% cc in Q2 2026) — and is tracked separately from the issuance-geography split. Note: currency <b>volatility</b> swings this line quarter to quarter, independent of volume.';
var FEE_LINES = [
  { k:'service', n:'Service revenue', rev:'on payments volume',
    what:'A fee charged to clients as a few <b>basis points of the payments (purchase) volume</b> on Visa credentials. Billed in arrears — this quarter\'s rate on last quarter\'s volume.',
    monetizes:'Scales with payments volume; the steadiest, most spend-linked line — grows with how much people put on the network.',
    products:[{n:'What drives it', d:'Cards in force × spend per card × the service rate; benefits from cash-to-digital and affluent mix.'},{n:'Where it\'s strongest', d:'Growing digital-payment markets, especially internationally.'}],
    competition:'Mastercard (the #2 network), domestic card schemes, account-to-account rails.' },
  { k:'crossborder', n:'International transaction', rev:'highest yield',
    what:'Fees where the <b>card country differs from the merchant country</b> — travel and cross-border e-commerce — plus FX.',
    monetizes:'A premium rate plus FX; a single overseas transaction can earn multiples of a domestic one. The <b>highest-yield</b> line and a key growth driver (+11% cc in Q2 2026); currency volatility swings it quarter to quarter.',
    products:[{n:'Travel', d:'Tourism & business travel; recovers/grows with global mobility — and softens first in a downturn.'},{n:'Cross-border e-commerce', d:'Buying from foreign merchants online; structurally growing, now ~40% of cross-border.'}],
    competition:'Mastercard; money-movement specialists (Wise, etc.) on certain flows.' },
  { k:'processing', n:'Data processing', rev:'per transaction',
    what:'A near-fixed fee for each transaction Visa <b>routes</b> through VisaNet (authorize / clear / settle).',
    monetizes:'Grows with the <i>count</i> of processed transactions (~+9% in Q2 2026), not ticket size — resilient even in a downturn.',
    products:[{n:'Switching', d:'Routing the transaction message between issuer and acquirer.'},{n:'Connectivity / other', d:'Network access, licensing and related fees.'}],
    competition:'Mastercard; domestic switches; U.S. debit-routing networks (Durbin).' },
];
var REBATES_INTRO = 'Visa reports <b>net revenue</b> — gross revenue minus the <b>client incentives</b> it pays issuers, acquirers and partners. That contra-revenue is large (~28% of gross, ~39% of net) and rising faster than revenue, so the gross-to-net bridge is one of the most important things to model. The same concept exists at the other big network.';
var REBATES_BRIDGE = [
  { v:'Gross revenue', l:'all network + services fees (~$56B)' },
  { v:'(−) Client incentives', l:'paid to issuers, acquirers & partners (~$16B)' },
  { v:'= Net revenue', l:'$40.0B · FY2025' },
];
var REBATES = [
  '<b>What they are:</b> payments to <b>issuers, acquirers and partners</b> to grow and retain volume and to win new portfolios. Because they are consideration paid to customers, they are booked <i>mostly</i> as a <b>reduction of gross revenue (contra-revenue)</b>, not an operating expense — though a sliver, where Visa gets a separately-identifiable benefit at fair value, lands in opex.',
  '<b>Two flavors:</b> <b>variable / performance-based</b> incentives (accrued as the client delivers volume, then trued-up) and <b>fixed / upfront</b> deal payments (capitalized on the balance sheet and amortized as a reduction to revenue over the contract life). So a big signing depresses net revenue for <i>years</i>, smoothing the hit.',
  '<b>Why they exist:</b> issuers can route to <b>either</b> network, and since the 2007–08 restructuring the banks <b>no longer own Visa</b> — so incentives are the post-co-op cost of keeping them loyal. This is the core competitive battleground: the same dollars Mastercard is also spending for the same portfolios.',
  '<b>Why it matters for the model:</b> the <b>incentive ratio (client incentives ÷ gross revenue)</b> is the #1 swing factor — Visa guides it every quarter. A 1-point move swings net revenue by hundreds of millions; a rising ratio can signal intensifying competition, and a heavy <b>renewal year</b> (e.g. ~20%+ of volume re-signed) steps it up and can optically slow net-revenue growth even when volume is perfectly healthy. Watch the ratio, not just net revenue.',
];

// ── VAS depth. Rich text preserved verbatim in `full`; the surface is a compact tappable
//    card (icon + lead) and the wall opens in a pop-up (vasPopTiles → resolve 'vasm'/'vase').
//    Nothing removed, just hidden until asked for. ──
var VAS_MOAT=[  // Overview ▸ "Why it defends the moat"
  {k:'agnostic',ic:'🌐',c:V_BLUE,t:'Network-agnostic → earns off-Visa volume',full:'<b>Network-agnostic → earns off-Visa volume.</b> Gateways, tokens, fraud scoring and open banking are sold even where a rival wins the card — partly <b>decoupling growth from card-share battles</b> ("Visa as a Service").'},
  {k:'recurring',ic:'🔁',c:'#7A5AF8',t:'Recurring & higher-quality',full:'<b>Recurring & higher-quality.</b> Subscriptions and per-transaction scoring are stickier and less tied to the consumer-spend cycle than swipe fees — a diversifier against macro / travel softness.'},
  {k:'switching',ic:'🔒',c:'#0F9D58',t:'Raises switching costs → a stickier network',full:'<b>Raises switching costs → a stickier network.</b> Selling issuing, risk, acceptance and consulting into the same banks and merchants makes them harder to leave <i>and</i> pulls through more network volume. Services and the network reinforce each other.'},
  {k:'regulated',ic:'⚖️',c:'#B7791F',t:'Less regulated',full:'<b>Less regulated.</b> VAS sits outside the interchange / routing crossfire — a structurally safer growth pool as regulation pressures the core swipe fee.'},
];
var VAS_ENGINE=[  // Deep Dive ▸ Top Line ▸ Segments ("the growth engine, up close")
  {k:'scale',ic:'📈',c:V_GOLD,t:'Scale & growth',full:'<b>Scale & growth:</b> VAS net revenue was <b>~$3.3B in Q2 2026 (+27% cc)</b>, ~<b>30% of net revenue</b> — growing well faster than the payments network and increasingly the swing factor in the whole company\'s growth rate.'},
  {k:'agnostic',ic:'🌐',c:V_BLUE,t:'Network-agnostic',full:'<b>Network-agnostic:</b> much of it is sold on <b>non-Visa</b> volume too (the Cybersource gateway, tokens, fraud scoring, open banking). That partially <b>decouples growth from card-share battles</b> — Visa can earn even where it doesn\'t win the rail. This is the heart of "Visa as a Service".'},
  {k:'quality',ic:'🔁',c:'#7A5AF8',t:'Higher-quality revenue',full:'<b>Higher-quality revenue:</b> subscriptions, per-transaction scoring and managed services are more <b>recurring</b> and less tied to the consumer-spend cycle than network fees — a diversifier against macro/travel softness.'},
  {k:'moat',ic:'🔒',c:'#0F9D58',t:'Deepens the moat',full:'<b>Deepens the moat:</b> selling issuing, risk, acceptance and consulting into the same issuers and merchants raises switching costs <i>and</i> pulls through more network volume — services and the network reinforce each other.'},
  {k:'ambition',ic:'🚀',c:'#B7791F',t:'A widening ambition',full:'<b>A widening ambition:</b> management sizes the annual VAS opportunity at ~<b>$520B</b> vs the ~<b>$8.8B</b> captured at the FY24 baseline (~2% penetrated) — reported as four portfolios (issuing, acceptance, risk & security, advisory/open banking), extending the addressable market well beyond card swipes.'},
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
var USERMIX_INTRO = 'All the global networks serve broad consumer bases, but the <i>mix</i> tilts differently — and the tilt matters for yield and cyclicality. Visa\'s relative leanings (these are tilts at the margin, not absolutes):';

// ── Timeline (corporate lineage) → Evolution ▸ Timeline. ──
var TIMELINE = [
  { y:'1958', t:'<b>The "Fresno Drop"</b> — BofA mass-mails ~60,000 live credit cards, the first scaled card launch.', d:'Bank of America mailed ~60,000 <b>live, ready-to-use</b> credit cards, unsolicited, to residents of Fresno, CA — the first mass credit-card launch. Early fraud and ~22% delinquency nearly killed it (mass unsolicited mailing was banned in 1970), but it proved <b>revolving credit could scale</b>.' },
  { y:'1966', t:'<b>Going open-loop</b> — BofA licenses BankAmericard to other banks, creating a network of "member banks".', d:'BofA began <b>licensing</b> BankAmericard to other banks — <b>turning a closed-loop card into an open-loop network</b>. The licensees (the "member banks," eventually thousands of U.S. banks) needed a shared body to run the network between them. This licensing decision is the root of Visa\'s whole open-loop model.' },
  { y:'1970', t:'<b>The bank co-op (NBI)</b> — member banks form National BankAmericard Inc.; BofA gives up control.', d:'Under <b>Dee Hock</b>, the banks formed <b>National BankAmericard Inc. (NBI)</b> — a bank-owned <b>cooperative</b>; BofA gave up unilateral control. This is the co-op that becomes Visa — and the direct origin of today\'s Class A/B/C share structure.' },
  { y:'1975–76', t:'<b>DOJ forces "duality"</b> — banks may now issue both Visa and Mastercard.', d:'Originally a BankAmericard member couldn\'t also issue the rival "Master Charge." Antitrust pressure (the DOJ + the <i>Worthen Bank</i> case) <b>forced "duality"</b> — banks could belong to both networks. This is why your bank can offer both a Visa and a Mastercard today — and why the banks\' co-ownership of Visa later mattered so much for loyalty.' },
  { y:'1976', t:'<b>Becomes "VISA"</b> — a name chosen to read the same in every language.', d:'Global rebrand to <b>VISA</b>: NBI → Visa U.S.A., the international arm (IBANCO) → Visa International. Over the following years Visa builds its electronic backbone — the BASE I (authorization) and BASE II (clearing/settlement) systems.' },
  { y:'1970s–2000s', t:'<b>A member-owned utility</b> — ~30 years run near-break-even by 13,000+ banks.', d:'For roughly three decades Visa ran as an <b>association of 13,000+ member banks</b>, governed regionally — operating the rails as a shared, near-break-even utility rather than a profit-seeking company. The banks owned it and shared its economics.' },
  { y:'Oct 2007', t:'<b>Restructures into a company</b> — Visa Inc. is formed; Europe stays a separate co-op.', d:'Visa U.S.A./International/Canada combined into <b>Visa Inc.</b>, a Delaware <b>stock</b> company; membership interests became shares. <b>Visa Europe stayed a separate bank-owned association</b> — with a contractual <b>put option</b> to sell itself to Visa Inc. later.' },
  { y:'Mar 2008', t:'<b>The IPO</b> — $17.9B, the largest U.S. IPO at the time; seeds the $3B litigation escrow.', d:'406M Class A shares at $44 → <b>$17.9B</b>, the largest U.S. IPO at the time. >$10B of proceeds bought back member-bank shares; <b>$3.0B seeded the litigation escrow</b> (the Retrospective Responsibility Plan) — the structure that still shields public shareholders from U.S. interchange litigation today.' },
  { y:'2016', t:'<b>Buys back Visa Europe</b> (up to €21.2B) — reunifies the franchise, inherits EU interchange caps.', d:'Europe\'s banks exercised their put; Visa <b>reacquired Visa Europe</b> for up to €21.2B, <b>reunifying the global franchise</b> — gaining Europe\'s economics, but also inheriting Europe\'s strict <b>interchange-cap regulation</b> (0.2% debit / 0.3% credit) that structurally lowers European yields.' },
  { y:'2020', t:'<b>"Network of networks"</b> — pivots to move money any way; buys Earthport, Tink, Pismo, Featurespace.', d:'Visa moved from a single network to linking <b>15 card networks, 75+ domestic schemes, 15 RTP networks & 5 gateways</b> (11B+ endpoints), buying rails to move money <i>any</i> way: Earthport, Currencycloud, Tink, Pismo, Featurespace — after the DOJ <b>blocked</b> its Plaid deal. See the M&A block for what each one added.' },
  { y:'Feb 2023', t:'<b>Ryan McInerney becomes CEO</b> (current CEO); Al Kelly moves to Chair, retiring 2025.', d:'Long-time President <b>Ryan McInerney</b> succeeds <b>Al Kelly</b> as CEO. The strategy continues: grow consumer payments, scale New Flows (Visa Direct / commercial) and value-added services, and push "Visa as a Service".' },
  { y:'Feb 2025', t:'<b>Investor Day 2025</b> — reorg into 3 businesses; "Visa as a Service"; ~$41T / ~$200T / ~$520B TAMs.', d:'Visa reorganized around three businesses (Consumer Payments / Commercial & Money Movement / Value-Added Services), pushed "<b>Visa as a Service</b>" (unbundling the stack into APIs anyone can buy), and framed the ~$41T / ~$200T / ~$520B opportunity — detailed in Evolution ▸ Strategy.' },
];
var TL_NOTE = 'Corporate lineage per Visa filings, IR and company history; the 2008 IPO, Class A/B/C structure and litigation escrow per the prospectus and RRP disclosures. Genesis: a bank-owned cooperative (NBI, 1970) restructured into Visa Inc. (2007) and IPO\'d (2008).';

// ── M&A → Evolution ▸ Timeline (M&A block). ──
var MNA = [
  { n:'CyberSource', y:'2010', deal:'~$2.0B', terms:'all cash', own:'Public', cat:'Acceptance',
    detail:'<b>Terms:</b> ~$2.0B, all cash.<br><br><b>What it added:</b> an online <b>payment gateway</b> — the software a website uses to accept cards. Visa had the rails but not the merchant-facing checkout layer.<br><br><b>How it shows up today:</b> the heart of <b>Visa Acceptance Solutions</b> (500k+ customers, 160+ countries), a brand-agnostic gateway — so Visa earns gateway fees <b>even on non-Visa transactions</b>.' },
  { n:'CardinalCommerce', y:'2016', deal:'undisclosed', terms:'all cash', own:'Private', cat:'Authentication',
    detail:'<b>Terms:</b> undisclosed, all cash.<br><br><b>What it added:</b> <b>3-D Secure</b> authentication — the "verify it\'s really you" step on e-commerce checkouts that cuts fraud and chargebacks.<br><br><b>How it shows up today:</b> part of Visa\'s Risk & Security stack; the technology behind smoother, lower-fraud online approvals.' },
  { n:'Visa Europe', y:'2016', deal:'up to €21.2B', terms:'cash + stock', own:'Member co-op', cat:'Franchise', big:true,
    detail:'<b>Terms:</b> up to €21.2B (cash + stock) — Europe\'s banks exercised their put option.<br><br><b>What it added:</b> the one piece of Visa that wasn\'t Visa Inc. — Europe\'s banks had kept their own co-op at the 2008 IPO. This bought it back.<br><br><b>How it shows up today:</b> <b>transformational</b> — Visa now owns the global franchise and Europe\'s full economics. The catch: it also inherited Europe\'s strict <b>interchange caps</b>, which structurally lower European yields.' },
  { n:'Earthport', y:'2019', deal:'~£247M', terms:'all cash', own:'Public', cat:'Cross-border',
    detail:'<b>Terms:</b> ~£247M, all cash (won in a bidding contest vs Mastercard).<br><br><b>What it added:</b> a global <b>ACH network</b> reaching bank accounts in 200+ countries — the ability to pay an <b>account</b>, not just a card.<br><br><b>How it shows up today:</b> the backbone of <b>Visa Direct</b> account payouts — gig pay, insurance disbursements, cross-border remittances. Core to the "New Flows" story.' },
  { n:'Verifi', y:'2019', deal:'undisclosed', terms:'all cash', own:'Private', cat:'Disputes',
    detail:'<b>Terms:</b> undisclosed, all cash.<br><br><b>What it added:</b> <b>dispute / chargeback resolution</b> — tools that resolve disputes <i>before</i> they become formal chargebacks; also network-agnostic.<br><br><b>How it shows up today:</b> the "post-purchase" piece of Acceptance Solutions; distributed by partners like Stripe to their merchants.' },
  { n:'YellowPepper', y:'2020', deal:'undisclosed', terms:'all cash', own:'Private', cat:'Real-time payments',
    detail:'<b>Terms:</b> undisclosed.<br><br><b>What it added:</b> a Latin-American <b>real-time payments / aliasing</b> platform — send money via a phone number or alias across rails.<br><br><b>How it shows up today:</b> folded into Visa Direct\'s money-movement capabilities, strengthening interoperability in LatAm.' },
  { n:'Plaid', y:'2020', deal:'~$5.3B', terms:'all cash · TERMINATED', own:'Private', cat:'Open banking (blocked)',
    detail:'<b>Terms:</b> ~$5.3B, all cash — <b>abandoned 2021 (DOJ blocked it, no break fee)</b>.<br><br><b>What it would have added:</b> the dominant U.S. <b>open-banking / pay-by-bank data</b> network connecting apps to bank accounts.<br><br><b>What happened:</b> the <b>DOJ sued to block it</b>, arguing Plaid was a nascent competitor to Visa\'s debit business (pay-by-bank threatens card volume). Visa <b>abandoned</b> the deal and bought <b>Tink</b> instead.' },
  { n:'Currencycloud', y:'2021', deal:'£700M', terms:'cash', own:'Private', cat:'Cross-border FX',
    detail:'<b>Terms:</b> £700M (net of Visa\'s existing stake).<br><br><b>What it added:</b> embedded <b>multi-currency / FX</b> APIs — hold, convert and pay out in many currencies, which Visa Direct/B2B needed.<br><br><b>How it shows up today:</b> powers the FX layer of Visa\'s cross-border money-movement products.' },
  { n:'Tink', y:'2022', deal:'€1.8B', terms:'all cash', own:'Private', cat:'Open banking', big:true,
    detail:'<b>Terms:</b> €1.8B, all cash — the post-Plaid pivot.<br><br><b>What it added:</b> a European <b>open-banking</b> platform — account data + account-to-account payments (13,000+ bank connections, 20 countries).<br><br><b>How it shows up today:</b> Visa\'s open-banking business and the way it offers <b>Visa-branded A2A</b>. (Visa later shut the equivalent <i>U.S.</i> open-banking business in 2025.)' },
  { n:'Pismo', y:'2024', deal:'~$1.0B', terms:'all cash', own:'Private', cat:'Core banking',
    detail:'<b>Terms:</b> ~$1.0B, all cash (closed Jan 2024).<br><br><b>What it added:</b> a <b>cloud-native core-banking / issuer-processing</b> platform (~130M+ accounts) — and one that can process <b>non-Visa</b> networks too.<br><br><b>How it shows up today:</b> lets Visa offer modern issuer processing & core banking as a service (VAS), moving up-stack against FIS/Fiserv and expanding geographically. Recent win: Wells Fargo to migrate its core ledger to Pismo.' },
  { n:'Featurespace', y:'2024', deal:'undisclosed', terms:'cash', own:'Private', cat:'AI fraud',
    detail:'<b>Terms:</b> undisclosed (announced 2024, closed early 2025).<br><br><b>What it added:</b> <b>ARIC</b> — adaptive, real-time <b>behavioral fraud detection</b> (the model learns each user\'s normal pattern), incl. fraud beyond cards and upstream (account-opening, scams).<br><br><b>How it shows up today:</b> being integrated into <b>Visa Protect</b> as a single decisioning platform across the payments value chain — sold network-agnostically.' },
  { n:'Prosa (majority stake)', y:'2024', deal:'undisclosed', terms:'cash', own:'Private', cat:'Processing (Mexico)',
    detail:'<b>Terms:</b> majority interest, undisclosed (announced 2024, subject to regulatory review).<br><br><b>What it added:</b> a 50-year Mexican <b>payments processor</b> (~10B+ transactions/yr) — Visa historically had limited domestic processing in Mexico, a market >50% cash.<br><br><b>How it shows up today:</b> lets Visa bring tokenization, risk and other value-added services into Mexico and help digitize a cash-heavy market.' },
  { n:'Prisma + Newpay', y:'2026', deal:'undisclosed', terms:'cash', own:'Private', cat:'Processing (Argentina)',
    detail:'<b>Terms:</b> undisclosed (announced 2026).<br><br><b>What it added:</b> <b>Prisma</b> — a credit/debit/prepaid issuer-processor — and <b>Newpay</b> — real-time bill-pay and an ATM network — in Argentina.<br><br><b>How it shows up today:</b> accelerates tokenization, biometric auth, risk tools and agentic-commerce solutions, and grows both carded and non-carded business in Argentina.' },
];

// ── Litigation → Valuation ▸ Risk & Litigation. Structured by jurisdiction (flag cards)
// + a MA-vs-Visa "who absorbs the hit" flow visual (replaces the old bullet boxes). ──
var LIT_INTRO = 'Like the other card networks, Visa set default interchange as a bank association, which has drawn ~20 years of antitrust litigation. What is <b>specific to Visa</b> is how it bears that risk: a <b>Class-B litigation escrow</b> (the Retrospective Responsibility Plan) that makes the <i>former U.S. member banks</i> — not public Class-A holders — absorb U.S. interchange settlements. That shield is Visa\'s single biggest structural difference from Mastercard here.';
var LIT_LEVEL={ high:{c:'#C0392B',l:'Live · material'}, resolved:{c:V_GREEN,l:'Settled'}, shield:{c:V_GREEN,l:'Shield'}, structural:{c:'#B7791F',l:'Structural'}, low:{c:V_STEEL,l:'Low · watch'} };
var LIT_CASES=[
  { code:'us', juris:'United States', tag:'MDL 1720', level:'high',
    headline:'Merchant interchange antitrust — Visa is a <b>co-defendant with Mastercard</b> (but Class A is shielded).',
    status:'The <b>damages</b> class settled (~$5.5B, shared; approved 2019, upheld 2023). The <b>rules / injunctive</b> class is still live — a 2024 proposed settlement (cap & cut interchange ~5 yrs) was <b>rejected by the court</b> as too weak, and large merchants keep opting out to sue separately.',
    exp:'US covered-litigation cost lands on <b>Class B</b> (former US banks) via escrow dilution — not public Class-A shareholders.' },
  { code:'us', juris:'United States', tag:'DOJ · debit', level:'high',
    headline:'DOJ alleges Visa illegally <b>monopolizes U.S. debit</b> (civil suit, Sept 2024).',
    status:'The DOJ argues Visa locks in its US debit dominance through exclusionary agreements with issuers and would-be competitors (and payments of "incentives"). Litigation is ongoing; Visa disputes it.',
    exp:'A loss could force more debit-routing competition and structurally lower US debit economics.' },
  { code:'eu', juris:'European Union', tag:'Interchange caps', level:'structural',
    headline:'Interchange <b>caps</b> (inherited with Visa Europe) plus ongoing national cases.',
    status:'EU caps are in force (<b>0.2% debit / 0.3% credit</b>) under the Interchange Fee Regulation; Visa took these on when it reacquired Visa Europe in 2016. Assorted national cases and undertakings continue.',
    exp:'Structural — the caps permanently lower European yields more than any single case does.' },
  { code:'us', juris:'The escrow (RRP)', tag:'Class-B shield', level:'shield',
    headline:'The <b>Retrospective Responsibility Plan</b> — a $3B-seeded escrow that quarantines US interchange cost onto Class B.',
    status:'Each escrow deposit automatically lowers the Class B → Class A conversion rate, so the cost is borne by the former US member banks. The EPS effect is like a <b>bank-funded buyback</b> (fewer as-converted shares). Class B can only fully convert and trade once US covered litigation is finally resolved.',
    exp:'The structural reason ~17-year-old litigation barely dents Class-A EPS. Caveat: only <i>US Covered</i> Litigation is shielded — non-US claims can still hit Class A.' },
];

// ── Peers → Top Line ▸ Industry Analysis (qualitative; consistent with the scatter). ──
var PEER_COLS = ['Visa', 'Mastercard', 'Amex', 'Discover', 'UnionPay'];
var PEER_ROWS = [
  ['Model', 'Open-loop four-party', 'Open-loop four-party', '<b>Closed-loop</b> (lends)', 'Closed-loop* (lends)', 'Domestic near-monopoly'],
  ['FY net revenue', '$40.0B', '$32.8B', '~$72B† (incl. lending)', '~$16B† (incl. lending)', '~$2–3B fees‡ (est.)'],
  ['Payments volume', '~$14T', '~$10.6T GDV', '~$1.7T', '~$0.5T', '~$25T+ (mostly China)'],
  ['Credentials', '~4.9B', '~3.5B', '~145M (affluent)', '~70M', '~9B+ (most in world)'],
  ['Services mix', '~30% of revenue', '<b>~42% of revenue</b>', 'no standalone VAS', 'limited', 'limited'],
  ['Litigation shield', '<b>Class B escrow</b>', 'None (direct to P&L)', 'n/a (closed-loop)', 'n/a', 'state-linked'],
  ['Credit risk', 'None', 'None', '<b>Yes</b> — owns loan book', '<b>Yes</b>', 'Borne by member banks'],
];
var PEER_NOTE = 'Visa and Mastercard are the two global open-loop "toll roads" — a thin fee per transaction, no credit risk. Visa is the <b>larger by volume and acceptance</b> with a ~2:1 brand preference; it carries a <b>smaller value-added-services mix</b> (~30% vs Mastercard\'s ~42%) but grows it fast, and — unlike Mastercard — its public shareholders are <b>shielded from US interchange litigation</b> by the Class-B escrow. <b>Amex & Discover</b> are closed-loop (they issue and lend, so revenue includes net interest income and isn\'t comparable line-for-line; Discover is being acquired by Capital One — a vertically-integrated #4). <b>UnionPay</b> is the largest network by cards (China; state-linked) but overwhelmingly domestic. Not shown: digital/A2A players (PayPal) and government real-time rails (UPI, Pix, FedNow). † incl. lending; ‡ limited disclosure / estimate; figures approximate, FY ends differ.';

// (Tailwinds / Headwinds retired — the bull/bear now lives, evidence-framed, in
//  Top Line ▸ Industry Analysis, same convention as UBER.)

// ── Financials → Valuation ▸ Balance Sheet. Visa is NOT in the Summit DCF universe, so these
// are GAAP ACTUALS from Visa's 10-K annual reports (fiscal year ends Sep 30), FY2021–FY2025 —
// no forward projection. Revenue & operating income are reported; EBITDA & FCF are approximate. ──
var FIN_YEARS = [2021, 2022, 2023, 2024, 2025];
var FIN_EST   = [false, false, false, false, false];
var FIN_FMT   = function(v){ return v==null ? '—' : '$'+(v/1000).toFixed(1)+'B'; };
var FIN_SERIES = {
  finRev:    { label:'Net Revenue',      type:'bar',  color:V_BLUE,  data:[24105, 29310, 32653, 35926, 39900] },
  finOpInc:  { label:'Operating Income', type:'bar',  color:V_STEEL, data:[15804, 18814, 21013, 23585, 25900] },
  finEbitda: { label:'EBITDA',           type:'bar',  color:V_GOLD,  data:[16700, 19700, 21900, 24500, 26800] },
  finFcf:    { label:'Free Cash Flow',   type:'line', color:V_GREEN, data:[14500, 17900, 19700, 18700, 20700] },
};
var FIN_INTRO = 'Visa\'s financials, from its <b>10-K annual reports</b> (fiscal year ends Sep 30) — GAAP <b>actuals, FY2021–FY2025</b>. Visa is not in the Summit DCF universe, so there is no forward model projection here. Drag the timeline handles to mold the window; each chart\'s CAGR updates to your selection.';
var FIN_NOTE  = 'Annual, USD billions. <b>All bars are reported actuals</b> (no projection). Source: Visa 10-K filings. <b>Net Revenue</b> and <b>Operating Income</b> are as-reported GAAP; <b>EBITDA</b> and <b>Free Cash Flow</b> are approximate (EBITDA ≈ operating income + D&A; FCF ≈ operating cash flow − capex). FY2025 net revenue ~$40B (as guided). Not company guidance; directional, not exact.';
var _finStart=2021, _finEnd=2025, _finCharts={};

// ── Management (Executives & Board) → Management tab. Visa executive leadership + board,
// from Visa's IR / leadership page and the latest DEF 14A. Reflects the Feb 2023 CEO
// transition (McInerney succeeding Kelly) and the 2025 Investor-Day reorg into three
// businesses. Titles are the operative mid-2026 roster — verify against the latest proxy. ──
var V_RESHUFFLE = 'Visa\'s current team was set by the <b>Feb 2023 CEO transition</b> — long-time President <b>Ryan McInerney</b> succeeded <b>Al Kelly</b>, who then served as Executive Chairman until retiring in <b>Jan 2025</b>. At <b>Investor Day 2025</b> Visa framed the company around three businesses (Consumer Payments · Commercial & Money Movement · Value-Added Services), which maps onto the leadership below. Titles are the operative mid-2026 roster — verify against the latest Visa proxy.';
var V_MGMT = makeManagement({
  brand:V_BLUE,
  lede:"Visa runs a deep bench under CEO <b>Ryan McInerney</b> (CEO since Feb 2023, at Visa since 2013), after a clean succession from Al Kelly. The team blends long-tenured Visa operators (Taneja, Jenkyn, Forestell) with senior external hires in finance (Suh, ex-EA / Microsoft). The 2025 Investor-Day reorg into three businesses — Consumer Payments, Commercial & Money Movement, and Value-Added Services — is reflected in the leadership below. This static roster is an editorial read of Visa\'s IR / leadership page; verify against the latest DEF 14A. Live ownership & insider activity populate the Ownership subtab (Fiscal.ai).",
  execs:[
    { id:'mcinerney', lead:true, img:'img/leadership/v-mcinerney.jpg', name:'Ryan McInerney', title:'Chief Executive Officer',       since:'CEO since Feb 2023 · at Visa since 2013',
      line:'Long-time President; ran the business before taking the top job.',
      bio:'CEO and director since February 2023; joined Visa in 2013 as President, running global client relationships and the core business for a decade before the top job. Drove the "network of networks" and Visa-as-a-Service strategy. Earlier: CEO of Chase\'s consumer bank at JPMorgan, and a McKinsey partner.' },
    { id:'suh', img:'img/leadership/v-suh.jpg', name:'Chris Suh', title:'Chief Financial Officer', since:'CFO since 2023',
      line:'External finance hire; ex-Electronic Arts CFO and ~20 years at Microsoft.',
      bio:'Chief Financial Officer since 2023 — owns finance, investor relations, strategy, treasury and capital allocation. Prior: CFO of Electronic Arts; earlier ~20 years at Microsoft in senior finance roles across its cloud/enterprise businesses.' },
    { id:'taneja', img:'img/leadership/v-taneja.jpg', name:'Rajat Taneja', title:'President, Technology', since:'at Visa since 2013',
      line:'Long-tenured; architect of VisaNet\'s modernization.',
      bio:'President, Technology — runs VisaNet, engineering, cybersecurity and the platform modernization (the next-gen VisaNet build). Joined Visa in 2013; previously EVP Technology (CTO) at Electronic Arts and a long career at Microsoft.' },
    { id:'jenkyn', img:'img/leadership/v-jenkyn.jpg', name:'Oliver Jenkyn', title:'Group President, Global Markets', since:'at Visa since 2010',
      line:'Runs the regional go-to-market across all markets.',
      bio:'Group President, Global Markets — oversees Visa\'s regional businesses and client relationships worldwide. A long-tenured Visa leader (formerly EVP, North America); earlier a partner at McKinsey.' },
    { id:'forestell', img:'img/leadership/v-forestell.jpg', name:'Jack Forestell', title:'Chief Product & Strategy Officer', since:'at Visa since 2014',
      line:'Owns product + strategy — tokens, Flexible Credential, agentic.',
      bio:'Chief Product & Strategy Officer — the global product organization and corporate strategy (tokenization, Tap to Everything, the Flexible Credential, Visa Direct and agentic commerce). Joined Visa in 2014; earlier led global sales & marketing at Capital One.' },
    { id:'newkirk', img:'img/leadership/v-newkirk.jpg', name:'Chris Newkirk', title:'President, Commercial & Money Movement Solutions',
      line:'Runs the New Flows growth engine (CMS / Visa Direct).',
      bio:'President, Commercial & Money Movement Solutions — Visa\'s "New Flows" engine (commercial cards, Visa Direct, B2B, disbursements). A senior Visa operator across strategy, risk and the CMS build-out.' },
    { id:'cahill', img:'img/leadership/v-cahill.jpg', name:'Antony Cahill', title:'Global Head of Value-Added Services',
      line:'Runs the ~30%-of-revenue services growth engine.',
      bio:'Global Head of Value-Added Services — issuing, acceptance, risk & security, advisory and open banking (~30% of net revenue, growing ~25%+ in constant dollars). Earlier a senior payments executive in Australia (NAB, ANZ) and at Worldpay/GPS.' },
    { id:'tullier', img:'img/leadership/v-tullier.jpg', name:'Kelly Mahon Tullier', title:'Vice Chair, Chief People & Corporate Affairs Officer', since:'at Visa since 2014',
      line:'Long-tenured; people, communications and corporate affairs. Former GC.',
      bio:'Vice Chair and Chief People & Corporate Affairs Officer — HR, communications, sustainability and corporate affairs. Formerly Visa\'s General Counsel; joined Visa in 2014. Earlier senior legal roles at Pitney Bowes and TNS.' },
    { id:'rottenberg', img:'img/leadership/v-rottenberg.jpg', name:'Julie Rottenberg', title:'General Counsel', since:'GC since 2023',
      line:'Elevated internally to run the legal / litigation docket.',
      bio:'General Counsel since 2023 — the global legal organization, including the interchange-litigation and DOJ-debit docket. A long-time Visa lawyer (previously Deputy GC) elevated to General Counsel when Kelly Tullier moved to Chief People & Corporate Affairs Officer.' },
  ],
  board:[
    { name:'John F. Lundgren', chair:true, independent:true, role:'Independent Board Chair. Former Chairman & CEO, Stanley Black & Decker.' },
    { name:'Ryan McInerney', dual:true, independent:false, role:'CEO of Visa (the only non-independent director).' },
    { name:'Ramon L. Laguarta', independent:true, role:'Chairman & CEO, PepsiCo — a large global consumer operator.' },
    { name:'Teri List', independent:true, role:'Former CFO (Gap, Dick\'s Sporting Goods); seasoned public-company CFO and audit-committee veteran.' },
    { name:'Denise M. Morrison', independent:true, role:'Former CEO, Campbell Soup Company.' },
    { name:'Linda J. Rendle', independent:true, role:'Chair & CEO, The Clorox Company.' },
    { name:'Maynard Webb', independent:true, role:'Founder, Webb Investment Network; former COO of eBay and CEO of LiveOps.' },
    { name:'Kermit R. Crawford', independent:true, role:'Former President & COO, Rite Aid; long career at Walgreens.' },
  ],
  boardNote:'Independent Chair (John Lundgren) separate from the CEO; only the CEO is non-independent. The board skews toward large-company CEOs/CFOs. <b>Static list — verify against the latest Visa DEF 14A;</b> live ownership & insider activity are in the Ownership subtab.',
  gov:[
    { k:'Share & voting', v:'Three classes · A (public) · B/C (banks)', d:'Class A votes 1/share; Class B/C are former member banks. Class B backstops US interchange litigation via the escrow.' },
    { k:'Board', v:'Independent Chair', d:'Only the CEO is non-independent; Chair separate from CEO.' },
    { k:'Litigation escrow', v:'RRP · Class B', d:'A bank-funded escrow shields Class A from US covered litigation — unique vs Mastercard.' },
  ],
  foot:'Executives & titles per Visa IR / leadership page and the latest proxy (mid-2026 roster; verify against the current DEF 14A). Headshots are same-origin images from Visa IR / press; any that don\'t load fall back to initials. Ratings are an editorial read of tenure + what each person built, not a Visa statement. Ownership & insider trades are live in the Ownership subtab.',
});

// ── Track Record — rate management (and the board) on value creation, green/amber/red,
// each with a Visa record and a prior/external one. Reads are editorial (from tenure +
// what they built), not a Visa statement. Sourced from the Visa leadership page,
// DEF 14A and press — verify against the latest proxy. "Read more" opens the full read. ──
var V_TRACK_RATE={ green:{c:'#0F9D58',bg:'rgba(15,157,88,0.07)',l:'Value creator'}, amber:{c:'#E8A00C',bg:'rgba(232,160,12,0.08)',l:'Mixed / unproven'}, red:{c:'#C0392B',bg:'rgba(192,57,43,0.07)',l:'Value destroyer'} };
var V_TRACK=[
  {id:'mcinerney', n:'Ryan McInerney', r:'Chief Executive Officer', t:'CEO since 2023 · at Visa since 2013', rate:'green',
    one:'A decade as President before the top job; a clean succession into double-digit growth.',
    co:['Ran the core business as President for ~10 years before becoming CEO','Owns the "network of networks" and Visa-as-a-Service strategy','Net revenue ~$40B FY25, +11%, with VAS & New Flows outgrowing the rails'],
    ext:['CEO of <b>Chase\'s consumer bank</b> at JPMorgan','Partner at <b>McKinsey</b>'],
    note:'Proven operator, deeply inside the business before the promotion. High confidence.'},
  {id:'suh', n:'Chris Suh', r:'Chief Financial Officer', t:'CFO since 2023', rate:'green',
    one:'Blue-chip finance pedigree; disciplined capital return (>$140B returned since IPO).',
    co:['Owns finance, IR, strategy, treasury and the buyback/dividend program','Guides the incentive ratio & framework the whole model hinges on'],
    ext:['CFO of <b>Electronic Arts</b>','~20 years at <b>Microsoft</b> in senior finance roles'],
    note:'Strong external CFO pedigree; a few years into the seat. High confidence.'},
  {id:'taneja', n:'Rajat Taneja', r:'President, Technology', t:'at Visa since 2013', rate:'green',
    one:'The 99.9999%-uptime technology moat and next-gen VisaNet run through him.',
    co:['Runs VisaNet, engineering, security and the platform modernization','A decade-plus building resilience and the API/"as-a-service" stack'],
    ext:['CTO of <b>Electronic Arts</b>; long career at <b>Microsoft</b>'],
    note:'Proven; the network\'s reliability is his mandate. High confidence.'},
  {id:'jenkyn', n:'Oliver Jenkyn', r:'Group President, Global Markets', t:'at Visa since 2010', rate:'green',
    one:'Long-tenured commercial operator running the worldwide go-to-market.',
    co:['Oversees all regional businesses and client relationships','Formerly EVP, North America'],
    ext:['Partner at <b>McKinsey</b>'],
    note:'Proven Visa operator across regions. High confidence.'},
  {id:'forestell', n:'Jack Forestell', r:'Chief Product & Strategy Officer', t:'at Visa since 2014', rate:'green',
    one:'Owns the product engine — tokens, Tap to Everything, Flexible Credential, agentic.',
    co:['Global product + corporate strategy','Shipped the token platform, Flexible Credential and Visa Direct roadmap'],
    ext:['Led global sales & marketing at <b>Capital One</b>'],
    note:'Proven product builder; owns the forward bets. High confidence.'},
  {id:'newkirk', n:'Chris Newkirk', r:'President, Commercial & Money Movement Solutions', t:'CMS leader', rate:'green',
    one:'Runs the New Flows engine — the ~$200T money-movement TAM.',
    co:['Leads commercial cards, Visa Direct, B2B and disbursements','Visa Direct at ~10B+ transactions/yr and growing double-digits'],
    ext:['Senior strategy/risk roles across Visa'],
    note:'Green as the leader of a fast-growing engine. Medium-high confidence.'},
  {id:'cahill', n:'Antony Cahill', r:'Global Head of Value-Added Services', t:'VAS leader', rate:'green',
    one:'Runs the ~30%-of-revenue services engine growing ~25%+.',
    co:['Issuing, acceptance, risk & security, advisory, open banking','VAS ~$12B and compounding well ahead of the network'],
    ext:['Senior payments roles (NAB, ANZ, Worldpay/GPS)'],
    note:'Green as the leader of the highest-growth revenue leg. Medium-high confidence.'},
  {id:'tullier', n:'Kelly Mahon Tullier', r:'Vice Chair, Chief People & Corp. Affairs', t:'at Visa since 2014', rate:'green',
    one:'Long-tenured; former GC now running people, comms and corporate affairs.',
    co:['People, communications, sustainability and corporate affairs','Formerly Visa\'s General Counsel'],
    ext:['GC roles at <b>Pitney Bowes</b> and <b>TNS</b>'],
    note:'Proven insider in a corporate-affairs mandate. High confidence.'},
  {id:'rottenberg', n:'Julie Rottenberg', r:'General Counsel', t:'GC since 2023', rate:'amber',
    one:'Long-time Visa lawyer elevated to GC — inherits a heavy litigation docket.',
    co:['Runs the legal org incl. interchange litigation and the DOJ-debit suit','Previously Deputy General Counsel'],
    ext:['A pure Visa legal career'],
    note:'Insider elevation into a demanding seat; a few years in. Medium confidence.'},
];
// Board value reads (separate block — governance quality is part of the story). Static / editorial —
// verify against the latest Visa DEF 14A.
var V_BOARD_TRACK=[
  {n:'John F. Lundgren', rate:'green', r:'Independent Chair · ex-CEO Stanley Black & Decker', note:'Built and ran a major global industrial — a proven large-company operator now chairing the board.'},
  {n:'Ramon L. Laguarta', rate:'green', r:'Chairman & CEO, PepsiCo', note:'A sitting global consumer CEO — top-tier operating pedigree and brand/consumer relevance.'},
  {n:'Maynard Webb', rate:'green', r:'ex-COO eBay · Webb Investment Network', note:'Scaled eBay operationally and is a prolific tech investor/board member — real value-creation record.'},
  {n:'Linda J. Rendle', rate:'green', r:'Chair & CEO, The Clorox Company', note:'A sitting large-cap CEO — proven operator, though outside payments.'},
  {n:'Teri List', rate:'green', r:'ex-CFO Gap / Dick\'s', note:'Seasoned public-company CFO — exactly the audit/finance depth a network board needs.'},
  {n:'Denise M. Morrison', rate:'amber', r:'ex-CEO, Campbell Soup', note:'A former large-cap CEO — governance and consumer expertise, mixed operating record at Campbell.'},
  {n:'Kermit R. Crawford', rate:'amber', r:'ex-President/COO, Rite Aid', note:'Long retail/pharmacy operating career — solid governance value, outside payments.'},
];
function vTrackBody(c){
  var card=function(p){ var rt=V_TRACK_RATE[p.rate];
    return '<div class="mtk-card ov-clickable" data-detail="matr:'+p.id+'" style="border-left:3px solid '+rt.c+';background:'+rt.bg+'">'+
      '<div class="mtk-top"><div><div class="mtk-n">'+esc(p.n)+'</div><div class="mtk-r">'+esc(p.r)+'</div></div><span class="mtk-badge" style="color:'+rt.c+';border-color:'+rt.c+'">'+rt.l+'</span></div>'+
      '<div class="mtk-t">'+esc(p.t)+'</div><div class="mtk-one">'+p.one+'</div>'+
      '<div class="mtk-more" style="color:'+rt.c+'">Read more ›</div></div>'; };
  var bcard=function(b){ var rt=V_TRACK_RATE[b.rate];
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
  h+='<p class="ov-lede">The people running Visa, rated on <b>value creation</b> (a Visa record and a prior/external one) — the color is the net read. Two things stand out: the top team is a <b>deep bench</b> of long-tenured insiders, and the <b>Feb 2023 CEO transition</b> (Ryan McInerney succeeding Al Kelly) has been a smooth insider handover. <b>Tap any card</b> for the full read.</p>';
  h+='<div style="display:flex;gap:12px;flex-wrap:wrap;margin:0 0 10px;font-size:10.5px;color:var(--mu)">'+Object.keys(V_TRACK_RATE).map(function(k){ var rt=V_TRACK_RATE[k]; return '<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:3px;background:'+rt.c+'"></span>'+rt.l+'</span>'; }).join('')+'</div>';
  h+='<div class="ov-callout" style="margin:0 0 12px">'+V_RESHUFFLE+'</div>';
  h+='<div class="ov-sec-h ovt-store-h">Executive management</div><div class="mtk-grid">'+V_TRACK.map(card).join('')+'</div>';
  h+='<div class="ov-sec-h ovt-store-h" style="margin-top:14px">The board — governance quality</div>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 8px">Unusually operator-heavy for a payments network: several directors are proven bank/enterprise builders, which is a positive governance signal. Independent Chair; CEO is not chairman.</div>';
  h+='<div class="mtk-bgrid">'+V_BOARD_TRACK.map(bcard).join('')+'</div>';
  h+='<div class="ov-foot">Roster & titles: Visa Inc. leadership page & DEF 14A — <b>verify against the latest proxy</b>. Ratings are an editorial read of tenure + what each person built, not a Visa output. The Feb 2023 CEO transition (McInerney succeeding Kelly) and the 2025 Investor Day reorg are reflected inline.</div>';
  return h;
}

var OV_SOURCES = 'Sources — Visa Inc. FY2025 10-K & FY2026 quarterly results/earnings releases; Visa IR & investor materials (incl. the Feb 2025 Investor Day); FY2021–FY2025 financials approximated from 10-K actuals (Visa is not in the Summit DCF universe); EDGAR for filer status. Market cap and peer bubbles are live via Massive; peer multiples & growth are web-sourced approximations (mid-2026), labeled directional. Forward figures are estimates, not company guidance.';
var DD_SOURCES = 'Sources — Visa Inc. FY2026 quarterly results & earnings releases, FY2025 10-K and prior filings; IR & company history; acquisition press releases & SEC filings for M&A terms; DOJ debit civil-suit filing (Sept 24, 2024); public reporting on MDL 1720 and the 2008 IPO / Class-B litigation escrow. Some M&A values are estimates where terms were undisclosed; "lc"/"cn" = local-currency/currency-neutral. Named customers & suppliers from Bloomberg SPLC (V US Equity, as of Jul 16, 2026).';

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
    '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+V_BLUE+';margin-bottom:5px}'+
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
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:'+V_BLUE+'}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:'+V_BLUE+';margin-top:6px}'+
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}</style>';
  // ── Hook (always visible): Key Facts, Description, 2×2 quadrant ──
  h+=stdKeyFacts();
  h+='<p class="ov-lede">'+esc(V_LEDE)+'</p>';
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
    '.vas-h{border-radius:13px;padding:15px 16px;color:#fff;background:linear-gradient(135deg,'+V_BLUE+' 0%,#3a53c9 100%)}'+
    '.vas-h-v{font-size:26px;font-weight:900;letter-spacing:-.5px;line-height:1}'+
    '.vas-h-l{font-size:11px;font-weight:600;opacity:.93;margin-top:6px;line-height:1.45}'+
    '.vas-fams{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:12px 0 2px}@media(max-width:640px){.vas-fams{grid-template-columns:1fr}}'+
    '.vas-fam{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--bdr);border-radius:11px;padding:11px 13px;background:var(--w)}'+
    '.vas-fam-ic{font-size:20px;line-height:1;flex:none}.vas-fam-t{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.vas-fam-d{font-size:11px;color:var(--mu);line-height:1.45;margin-top:2px}</style>'+
    '<div class="ov-diagram-cap" style="margin:0 0 10px"><b>Value-Added Services (VAS)</b> is the leg that keeps the moat <b>widening</b> — the fastest-growing, least-regulated, most <b>network-agnostic</b> revenue Visa has. It is how a mature toll road keeps compounding <b>double digits</b>.</div>'+
    '<div class="vas-hero">'+
      stat('~30%','of net revenue today — up from the low-20s a few years ago, and still climbing')+
      stat('+20%+ <span style="font-size:15px">cc</span>','growth — running well ahead of the payments network, pulling up the whole company')+
      stat('~$520B','addressable market (Investor Day 2025) — Visa captures only <b>~2%</b>, a long runway')+
    '</div>'+
    '<div class="ov-subh" style="margin:14px 0 6px">Four families — sold on top of the rails (and off them)</div>'+
    '<div class="vas-fams">'+
      fam('🏦','Issuing solutions','DPS processing + <b>Pismo</b> cloud core-banking — help issuers run & optimize their programs.')+
      fam('🛡️','Risk & security','<b>Visa Protect</b>, tokenization & <b>Featurespace</b> fraud AI — the trust layer, priced per transaction.')+
      fam('🛒','Acceptance','<b>CyberSource</b> & <b>Authorize.net</b> gateways and merchant tools — earns even on non-Visa volume.')+
      fam('📊','Advisory & open banking','<b>Visa Consulting & Analytics</b> and <b>Tink</b> — data, consulting and account-to-account reach.')+
    '</div>'+
    '<div class="ov-subh" style="margin:16px 0 8px">Why it defends the moat <span style="font-weight:600;color:var(--mu)">— tap any card for the detail</span></div>'+
    vasPopTiles(VAS_MOAT,'vasm');
}
function html(c){
  _co=c; // capture company (id + ticker) for the Watch List DB wiring
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
//  Management), like UBER/LYFT/CART. Root class .ov-visa-dd scopes it.
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
// ── Top Line ▸ Segments (core network fee lines + VAS growth engine) ──
// The yield stack — how ~$14T of payments volume becomes ~28bps of net revenue. A visual
// decomposition so the "thin-toll-road" economics read at a glance.
var V_YIELD_STACK=[
  { l:'Service revenue', bps:12,  col:V_STEEL, d:'bps of prior-period payments volume — the steady base' },
  { l:'International transaction', bps:10, col:V_BLUE,   d:'cross-border + FX — the highest-yield slice' },
  { l:'Data processing', bps:9, col:V_GOLD, d:'~fixed per switched txn — resilient to ticket size' },
  { l:'Value-added services', bps:9, col:'#7A5AF8', d:'sold on top of the rails, often network-agnostic' },
];
function vYieldStack(){
  var gross=V_YIELD_STACK.reduce(function(a,s){ return a+s.bps; },0); // ~40bps gross-ish
  var rebate=12, net=gross-rebate; // illustrative gross→net haircut (in bps of payments volume)
  var maxW=gross;
  var bar=function(s){ return '<div style="display:flex;align-items:center;gap:10px;margin:5px 0">'+
    '<div style="width:150px;font-size:11.5px;font-weight:700;color:var(--navy);text-align:right;flex:none">'+esc(s.l)+'</div>'+
    '<div style="flex:1;height:20px;background:#F1F4F8;border-radius:5px;overflow:hidden"><div style="height:100%;width:'+(s.bps/maxW*100).toFixed(1)+'%;background:'+s.col+';border-radius:5px"></div></div>'+
    '<div style="width:46px;font-size:12px;font-weight:900;color:'+s.col+';flex:none">'+s.bps+'bps</div></div>'+
    '<div style="margin:0 0 8px 160px;font-size:10.5px;color:var(--mu)">'+esc(s.d)+'</div>'; };
  return '<div class="ov-chart-card" style="padding:16px 18px">'+
    '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px">'+
      '<div><div style="font-size:22px;font-weight:900;color:var(--navy)">~$14T</div><div style="font-size:10.5px;color:var(--mu)">payments volume (FY25)</div></div>'+
      '<div style="font-size:22px;color:var(--mu);align-self:center">×</div>'+
      '<div><div style="font-size:22px;font-weight:900;color:'+V_BLUE+'">~28 bps</div><div style="font-size:10.5px;color:var(--mu)">blended <b>net</b> yield on volume</div></div>'+
      '<div style="font-size:22px;color:var(--mu);align-self:center">=</div>'+
      '<div><div style="font-size:22px;font-weight:900;color:var(--navy)">~$40B</div><div style="font-size:10.5px;color:var(--mu)">net revenue (FY25)</div></div>'+
    '</div>'+
    V_YIELD_STACK.map(bar).join('')+
    '<div style="display:flex;align-items:center;gap:10px;margin:10px 0 2px;padding-top:10px;border-top:1px dashed var(--bdr)">'+
      '<div style="width:150px;font-size:11.5px;font-weight:800;color:#B7791F;text-align:right;flex:none">(−) Client incentives</div>'+
      '<div style="flex:1;height:20px;background:#FBF3E4;border-radius:5px;overflow:hidden"><div style="height:100%;width:'+(rebate/maxW*100).toFixed(1)+'%;background:repeating-linear-gradient(45deg,#E8A00C,#E8A00C 6px,#f0b53a 6px,#f0b53a 12px);border-radius:5px"></div></div>'+
      '<div style="width:46px;font-size:12px;font-weight:900;color:#B7791F;flex:none">−'+rebate+'bps</div></div>'+
    '<div style="margin:8px 0 0 160px;font-size:11px;color:var(--navy)"><b>≈ 28 bps net</b> is what actually reaches the P&L — a <b>thin toll</b> on a vast river of volume, with <b>no credit risk and almost no capital</b>. Bars are illustrative bps of payments volume to show the mix, not reported line items.</div>'+
  '</div>';
}
function ddSegmentsBody(c){
  var h='<p class="ov-lede">'+PN_INTRO+'</p>';
  h+='<div class="ov-callout" style="margin-bottom:18px">'+XBORDER_NOTE+'</div>';
  h+=sec('The money machine — how volume becomes revenue',
    '<div class="ov-diagram-cap" style="margin:0 0 10px">The whole model in one picture: a huge <b>volume</b> × a <b>thin blended yield</b> = net revenue. Each fee line (and VAS) adds a few basis points; rebates take a slice back.</div>'+vYieldStack());
  h+=sec('Payment Network — the three fee lines',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">How the rails monetize. <b>Tap any line</b> for what it is, how it\'s billed, and what drives it.</div>'+pillarCards(FEE_LINES));
  h+=sec('Value-Added Services — the growth engine',
    '<div class="ov-mbars" style="margin-bottom:14px">'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Core payments network</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:70%;background:'+V_STEEL+';">the core rails</div></div><div class="ov-mbar-v">~70%</div></div>'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Value-Added Services</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:30%;background:'+V_GOLD+';">+27% cc ▲</div></div><div class="ov-mbar-v">~30%</div></div>'+
    '</div>'+
    '<div class="ov-diagram-cap" style="margin:-4px 0 12px">VAS is ~30% of net revenue and compounding <b>faster than the network</b> (+27% cc) — each year it takes a bigger slice and pulls up the whole company\'s growth rate. <b>Tap any card</b> for the detail.</div>'+
    vasPopTiles(VAS_ENGINE,'vase'));
  return h;
}
// ── Top Line ▸ Customers (demand mix) ──
function ddCustomersBody(c){
  var h='<p class="ov-lede">'+USERMIX_INTRO+'</p>';
  h+='<div class="ov-subh">Bigger scale, but a smaller recurring-services mix than the #2 network</div>'+
    '<div class="ov-mbars" style="margin-bottom:16px">'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Services mix — Visa</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:30%;background:'+V_GOLD+';">recurring services</div></div><div class="ov-mbar-v">~30%</div></div>'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Services mix — Mastercard</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:42%;background:#C9CFD8;">recurring services</div></div><div class="ov-mbar-v">~42%</div></div>'+
    '</div>'+
    '<div class="ov-subh">A premium / travel-skewed product ladder</div>'+
    '<div class="ov-chain" style="margin-bottom:8px">'+
      '<div class="ov-chain-step"><div class="ov-chain-n">1</div><div class="ov-chain-t">Classic</div><div class="ov-chain-d">mass market</div></div>'+
      '<div class="ov-chain-step"><div class="ov-chain-n">2</div><div class="ov-chain-t">Gold / Platinum</div><div class="ov-chain-d">affluent</div></div>'+
      '<div class="ov-chain-step"><div class="ov-chain-n">3</div><div class="ov-chain-t">Signature</div><div class="ov-chain-d">high-spend · travel</div></div>'+
      '<div class="ov-chain-step is-payoff"><div class="ov-chain-n">4</div><div class="ov-chain-t">Infinite</div><div class="ov-chain-d">ultra-high-net-worth</div></div>'+
    '</div>'+
    '<div class="ov-diagram-cap">Up the ladder, cardholders spend more, travel more and skew to <b>cross-border</b>. Visa\'s mix leans <b>more toward U.S. debit</b> and everyday spend than Mastercard\'s — a defensive, resilient base — while cross-border (its <b>highest-yield</b> line) and Value-Added Services are the growth tilts. <b>Net read:</b> the broadest, most-resilient consumer base in payments, with the mix shifting toward <b>cross-border, commercial and services</b> — versus a peer that already carries a richer services/cross-border skew.</div>';
  h+=sec('Who actually pays Visa — the named customers',
    '<div class="ov-diagram-cap" style="margin:0 0 10px">From <b>Bloomberg SPLC</b> (as of Jul 16, 2026). Visa\'s direct customers aren\'t consumers — they\'re the <b>issuing banks, processors, fintechs, telecoms and merchants</b> that connect to VisaNet. <b>52 named customers</b> across 92 facilities; <b>~50% are US-domiciled</b>, with Germany, India, Singapore, France and the UK also prominent. <span style="color:#C0392B">⚠ = Bloomberg <b>distressed</b> default-risk grade</span>.</div>'+vCustomerChips());
  h+='<div class="ov-foot">Customer list: Bloomberg SPLC (supply-chain), V US Equity, as of Jul 16, 2026 — BBG estimates / company-disclosed relationships, not a Visa statement. Grouping is editorial. CDW is the single largest disclosed relationship (~0.06% of Visa revenue). End-cardholders sit behind the issuers & merchants.</div>';
  return h;
}
// Named customers from Bloomberg SPLC (V US Equity, as of Jul 16, 2026) — grouped editorially
// by role in the ecosystem. ⚠ marks a Bloomberg distressed default-risk grade.
var V_CUST_GROUPS=[
  { t:'Banks & issuers', ic:'🏦', note:'the portfolios & programs that ride the rails',
    names:['Canadian Imperial Bank (CIBC)','NewtekOne','Freedom Holding','Blackhawk Network','Green Dot'] },
  { t:'Processors, gateways & payment enablers', ic:'⚙️', note:'the plumbing that connects merchants & issuers',
    names:['Fiserv','Fidelity National Information (FIS)','EVERTEC','ACI Worldwide','Worldline','Nuvei','Conduent','Euronet Worldwide','TietoEVRY','GFT Technologies','Cantaloupe','Usio','CDW','RTB Digital'] },
  { t:'Fintechs, wallets & card platforms', ic:'📱', note:'the frenemies that mostly ride the rails',
    names:['Block (Square)','Klarna','Chime','Marqeta','Paysend','HiPay','EverCommerce'] },
  { t:'Telecoms & connectivity', ic:'📶', note:'prepaid, airtime & carrier-billing programs',
    names:['e& (Etisalat)','Ooredoo','Safaricom','Kyivstar','Orange','Singtel','Mobile Telecom Co (K)','Mobile Telecom Co (S)'] },
  { t:'Merchants, e-commerce & marketplaces', ic:'🛍️', note:'branded programs & spend partners',
    names:['Expedia','GoDaddy','Wix','Zalando','LightInTheBox','Newegg ⚠','Eventbrite','Cia Brasileira de Distribuição (GPA)','Bata Indonesia','Tingo Group ⚠','WEX','Goldpac'] },
  { t:'Travel & software platforms', ic:'✈️', note:'GDS, airlines & software spend',
    names:['Sabre','Amadeus','Thomas Cook India','Southwest Airlines','OpenAI','Intuit'] },
];
function vCustomerChips(){
  return '<div class="ov-chart-card" style="padding:14px 16px">'+
    '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px">'+
      '<div><div style="font-size:20px;font-weight:900;color:var(--navy)">52</div><div style="font-size:10.5px;color:var(--mu)">named customers · 92 facilities</div></div>'+
      '<div><div style="font-size:20px;font-weight:900;color:'+V_BLUE+'">~50%</div><div style="font-size:10.5px;color:var(--mu)">US-domiciled customers</div></div>'+
      '<div><div style="font-size:20px;font-weight:900;color:var(--navy)">banks+</div><div style="font-size:10.5px;color:var(--mu)">issuers · processors · fintechs · telecoms · merchants</div></div>'+
      '<div><div style="font-size:20px;font-weight:900;color:#C0392B">⚠ 2</div><div style="font-size:10.5px;color:var(--mu)">customers at a distressed grade</div></div>'+
    '</div>'+
    V_CUST_GROUPS.map(function(g){ return '<div style="margin:10px 0 4px"><div style="font-size:12px;font-weight:800;color:var(--navy);margin-bottom:5px">'+g.ic+' '+esc(g.t)+' <span style="font-weight:600;color:var(--mu);font-size:10.5px">— '+esc(g.note)+'</span></div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:5px">'+g.names.map(function(n){ var ds=n.indexOf('⚠')!==-1; return '<span style="background:'+(ds?'rgba(192,57,43,0.06)':'#F1F4F8')+';border:1px solid '+(ds?'rgba(192,57,43,0.30)':'var(--bdr)')+';border-radius:7px;padding:3px 9px;font-size:11px;color:var(--navy)">'+esc(n)+'</span>'; }).join('')+'</div></div>'; }).join('')+
  '</div>';
}
// ── Top Line ▸ TAM — Visa's OWN addressable-market framing (Investor Day, Feb 2025):
// Consumer Payments ~$41T · New Flows (CMS) ~$200T · Value-Added Services ~$520B TAM. ──
function ddTamBody(c){
  function tamTile(l,v,s){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+l+'</div><div class="ov-kpi-v">'+v+'</div><div class="ov-kpi-d muted">'+s+'</div></div>'; }
  function penBar(label,pct,sub,col){ return '<div style="margin:10px 0 14px">'+
    '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px"><span style="font-size:12.5px;font-weight:800;color:var(--navy)">'+label+'</span><span style="font-size:13px;font-weight:900;color:'+col+'">'+pct.toFixed(0)+'% penetrated</span></div>'+
    '<div style="height:22px;background:#EEF2F7;border-radius:6px;overflow:hidden"><div style="height:100%;width:'+Math.max(pct,1.2).toFixed(1)+'%;background:'+col+';border-radius:6px"></div></div>'+
    '<div style="font-size:11px;color:var(--mu);margin-top:4px">'+sub+'</div></div>'; }
  var h='<p class="ov-lede">Visa frames its three growth engines by <b>payment flow</b> (Investor Day, Feb 2025). The headline: <b>~$41T of consumer payments</b>, a <b>~$200T</b> new-flows opportunity in commercial & money movement, and a <b>~$520B Value-Added-Services pool</b> — and the <b>vast majority is still un-penetrated</b>. The emptiness of the bars is the runway. Company-cited figures (Visa analysis).</p>';
  h+='<div class="ov-kpis">'+
    tamTile('Consumer Payments','~$41T','still ~$11T of cash & check to displace')+
    tamTile('New Flows (CMS)','~$200T','commercial + money-movement flows')+
    tamTile('Value-Added Services','~$520B','~30% of net rev today, +20%+ cc')+
    tamTile('Visa net revenue vs TAM','<3%','FY25 ~$40B against these pools')+
  '</div>';
  h+=sec('How little is penetrated — the greenfield',
    '<div class="ov-diagram-cap" style="margin:0 0 8px">Each bar is how much of that flow Visa already captures. Almost empty = almost all still to win.</div>'+
    penBar('Consumer Payments — ~$41T', 40, 'digital penetration keeps rising, but ~<b>$11T</b> of everyday spend is still <b>cash & check</b> to convert', V_BLUE)+
    penBar('Commercial & Money Movement — ~$200T', 2, 'the largest greenfield — B2B, B2C payouts, P2P and G2C flows still overwhelmingly <b>off-card</b>; Visa Direct reaches ~11B endpoints', V_GOLD)+
    penBar('Value-Added Services — ~$520B', 8, 'issuing, acceptance, risk & security, advisory / open banking — Visa VAS is ~$9B+ run-rate and compounding <b>+20%+ cc</b>', V_STEEL)+
    '<div class="ov-fynote" style="margin-top:6px">The <b>~$200T "New Flows"</b> opportunity spans commercial payments (card + Visa Commercial Solutions), cross-border B2B (Visa B2B Connect) and money movement (Visa Direct: payouts, remittances, P2P, earned-wage access) — the bulk still runs on cash, check, ACH and wire.</div>');
  h+=sec('The Value-Added Services pool — ~$520B TAM, four families',
    '<div class="ov-mbars">'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Issuing solutions (DPS · Pismo)</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:100%;background:'+V_STEEL+';">processing · issuer optimization</div></div><div class="ov-mbar-v">largest</div></div>'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Acceptance solutions (CyberSource · Authorize.net)</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:80%;background:'+V_BLUE+';">gateway · merchant tools</div></div><div class="ov-mbar-v">large</div></div>'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Risk & security (Visa Protect · Featurespace)</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:62%;background:'+V_GOLD+';">fraud · tokenization</div></div><div class="ov-mbar-v">growing</div></div>'+
      '<div class="ov-mbar"><div class="ov-mbar-l">Advisory & open banking (VCA · Tink)</div><div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:45%;background:#C9CFD8;">consulting · data</div></div><div class="ov-mbar-v">emerging</div></div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:8px">Total VAS <b>TAM ~$520B</b>; Visa’s VAS revenue is ~<b>$9B+</b> run-rate (~30% of net revenue) and growing <b>~20%+ cc</b> — a low-single-digit share of the pool, and the leg management points to for durable double-digit growth.</div>');
  h+='<div class="ov-callout"><b>Sourcing note:</b> all TAM figures are <b>Visa-cited</b> (Investor Day, Feb 2025) — company estimates of addressable flows, not an independent third-party number.</div>';
  h+='<div class="ov-foot">Source: Visa Inc. Investor Day, Feb 2025 (three-growth-engine framing) plus FY2024–FY2026 earnings-call VAS disclosures. Figures are company-cited addressable markets, as-of early 2025.</div>';
  return h;
}
// ── Top Line ▸ Industry Analysis — the duopoly economics, the disintermediation threats
// (quantified), the bull/bear (evidence-framed, NOT a generic winds list), and what-to-watch.
// Sourced from Nilson, MA/Visa filings, ECB, Congress.gov, TechCrunch/Silicon Canals. ──
var V_THREATS=[
  { k:'upi', sev:'high', ic:'🇮🇳', n:'Government A2A rails (UPI · Pix)', teaser:'The proven card-killer where deployed — India is the warning shot.',
    detail:'<p><b>The most concrete structural threat.</b> Government-built, near-zero-fee instant rails bypass cards entirely.</p>'+bullets([
      '<b>India UPI:</b> ~18B transactions/month (2025); a single day topped 650M — above Visa’s ~640M global daily average. India’s <b>card share of digital payments fell from 43% (2018) to ~21% (2024)</b>; UPI is now ~83% of digital transactions. Domestic <b>RuPay</b> (not Visa/MA) is favored.',
      '<b>Brazil Pix:</b> &gt;150M users (~70% of Brazilians), 224M txns/day, zero consumer fee; "International Pix" (Jul 2025) edges into cross-border card turf.',
      '<b>Read:</b> already materializing in EM with state-built rails; in the US/EU it is more a <b>medium-term margin cap</b> — A2A lacks credit, rewards and chargeback protection cards bundle.']) },
  { k:'stable', sev:'med', ic:'🪙', n:'Stablecoins & tokenized money', teaser:'Post-GENIUS Act rails could bypass cards on cross-border — Visa is co-opting, not resisting.',
    detail:'<p>The <b>GENIUS Act</b> (signed Jul 18, 2025) created a US stablecoin framework. Stablecoin transfer volume (~$27.6T in 2024, though inflated by bots/DeFi) and a ~$300B market cap spooked investors that on-chain rails could skip cards — especially on high-margin <b>cross-border</b>.</p>'+bullets([
      '<b>Visa response = co-opt:</b> settling in <b>USDC</b> since 2021 (Solana/Ethereum); launched the <b>Visa Tokenized Asset Platform (VTAP)</b> for banks to mint/move fiat-backed tokens; partners with Circle, Paxos and others.',
      'On recent calls management frames stablecoins as a <b>settlement and money-movement opportunity for Visa Direct</b>, not just a threat — moving value on-chain and cashing out to cards/accounts.',
      '<b>Read:</b> more opportunity than existential near-term — but a real long-term tail risk to cross-border take rates if merchant-direct acceptance scales.']) },
  { k:'reg', sev:'high', ic:'⚖️', n:'Regulation, interchange & the DOJ debit suit', teaser:'DOJ debit-monopoly suit, CCCA routing mandate, Fed debit-cap, EU caps, MDL 1720 — a persistent pincer.',
    detail:'<p>Interchange pressure mostly hits <b>issuing banks</b>, but it caps the fee pool and invites routing mandates that pressure network volumes — and Visa carries a <b>Visa-specific antitrust overhang</b>.</p>'+bullets([
      '<b>DOJ debit suit (Sept 24, 2024):</b> the DOJ Antitrust Division sued <b>Visa</b> for allegedly monopolizing US debit — exclusivity/volume deals that discourage routing to rival networks. A live, Visa-specific case (not yet resolved).',
      '<b>Credit Card Competition Act (Durbin–Marshall):</b> would force banks &gt;$100B to enable ≥2 unaffiliated networks on credit cards (routing competition). <b>Reintroduced Jan 2026; endorsed by President Trump</b> — a live legislative overhang (not yet law).',
      '<b>US debit (Durbin):</b> caps issuer debit interchange (~$0.21+5bps); Fed has proposed lowering it — directly relevant given Visa’s debit weighting.',
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
  h+='<p class="ov-lede">Visa and Mastercard run a global <b>open-loop duopoly</b> — a thin-fee "toll road" with no credit risk and the highest margins in the S&P 500. <b>Visa is the larger of the two.</b> The useful question isn’t "who’s the peer" (that’s Mastercard) but <b>what could bypass the rails entirely</b>. First the economics, then the threats — <b>tap any threat card</b>.</p>';
  h+=sec('The duopoly, in numbers',
    '<div class="ov-kpis">'+
      '<div class="ov-kpi"><div class="ov-kpi-l">US purchase volume (V+MA)</div><div class="ov-kpi-v">$9.99T</div><div class="ov-kpi-d muted">2025 · Visa ~70% / MA ~30%</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Card processing ex-China</div><div class="ov-kpi-v">~90%</div><div class="ov-kpi-d muted">controlled by the two</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Visa total volume</div><div class="ov-kpi-v">~$16T</div><div class="ov-kpi-d muted">~$14T payments · ~300B txns</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Operating margin</div><div class="ov-kpi-v">~67%</div><div class="ov-kpi-d muted">Visa · vs Mastercard ~57%</div></div>'+
    '</div>'+
    '<div class="ov-diagram-cap" style="margin-top:10px">The moat is a two-sided network effect + entrenched acceptance. The interchange (the big ~1.5–2.5% fee) flows to <b>issuing banks, not the networks</b> — the networks take a thin switching fee and bear no credit risk.</div>');
  // Threats
  h+=sec('What to watch — the threats to the rails',
    '<div class="mth-grid">'+V_THREATS.map(function(t){ return '<div class="mth-card ov-clickable" data-detail="threat:'+t.k+'" style="border-left-color:'+sevCol[t.sev]+'">'+
      '<div class="mth-top"><div class="mth-n">'+t.ic+' '+esc(t.n)+'</div><span class="mth-sev" style="background:'+sevCol[t.sev]+'">'+sevL[t.sev]+'</span></div>'+
      '<div class="mth-teaser">'+esc(t.teaser)+'</div><div class="mth-more" style="color:'+sevCol[t.sev]+'">the detail ›</div></div>'; }).join('')+'</div>');
  // Bull / Bear — evidence-framed
  h+=sec('The investment forces — bull vs bear (with the evidence)',
    '<div class="mbb"><div class="mbb-col mbb-bull"><div class="mbb-h">▲ Bull</div>'+bullets([
      '<b>Secular cash-to-digital</b> still has a long runway — ~$41T consumer + a ~$200T new-flows greenfield.',
      '<b>Duopoly pricing power</b>, ~67% operating margins (the higher of the two), asset-light, huge FCF, ~$20B/yr buybacks.',
      '<b>Value-Added Services</b> — the fastest-growing, <b>less-regulated</b> leg (~30% of net revenue, +20%+ cc).',
      '<b>Co-opting</b> wallets, tokenization and now stablecoins (USDC settlement, VTAP) rather than being bypassed in developed markets.',
      '<b>Cross-border/travel</b> — Visa’s highest-yield volume, still compounding.']) +'</div>'+
    '<div class="mbb-col mbb-bear"><div class="mbb-h">▼ Bear</div>'+bullets([
      '<b>DOJ debit-monopoly suit</b> (Sept 2024) — a Visa-specific antitrust overhang on its debit franchise.',
      '<b>Government A2A rails</b> (UPI/Pix) proven to gut card economics where deployed; FedNow/Digital Euro are slow-burning versions.',
      '<b>Stablecoin cross-border bypass</b> — a genuine long-term tail risk to the richest take rates.',
      '<b>Regulatory pincer:</b> CCCA routing mandate, Fed debit-cap, EU caps, unresolved MDL 1720.',
      '<b>Capital One–Discover</b> creates a credible fourth-network router; <b>premium valuation</b> leaves little room for a growth disappointment.']) +'</div></div>'+
    '<div class="ov-fynote" style="margin-top:10px"><b>What to watch:</b> (1) the <b>DOJ debit suit</b> trajectory; (2) CCCA progress in 2026; (3) any US "UPI moment" / FedNow consumer overlay; (4) merchant stablecoin acceptance + Visa’s VTAP / USDC traction; (5) cross-border volume growth (the margin engine); (6) VAS revenue mix; (7) MDL 1720 approval/rejection; (8) Capital One re-routing volume off the networks.</div>');
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
function vGrossNetWaterfall(){
  // Illustrative FY25: gross ~$56B → client incentives ~$16B (~29% of gross) → net ~$40B.
  // Rendered as a vertical waterfall: full Gross bar → floating rebate "drop" → Net bar.
  var gross=56, net=40, netPct=(net/gross*100), rebPct=((gross-net)/gross*100);
  var hatch='repeating-linear-gradient(45deg,#E8A00C,#E8A00C 7px,#f0b53a 7px,#f0b53a 14px)';
  var track=function(inner){ return '<div style="position:relative;height:172px">'+inner+'</div>'; };
  var lab=function(t,s){ return '<div style="text-align:center;margin-top:9px"><div style="font-size:11.5px;font-weight:800;color:var(--navy)">'+t+'</div><div style="font-size:9.5px;color:var(--mu)">'+s+'</div></div>'; };
  var val=function(t,c){ return '<div style="position:absolute;top:-21px;left:0;right:0;text-align:center;font-size:13px;font-weight:900;color:'+c+'">'+t+'</div>'; };
  return '<div class="ov-chart-card" style="padding:22px 18px 14px">'+
    '<div style="display:flex;gap:16px;align-items:flex-end">'+
      '<div style="flex:1">'+track('<div style="position:absolute;bottom:0;left:0;right:0;height:100%;background:'+V_STEEL+';border-radius:6px 6px 0 0">'+val('$56B','var(--navy)')+'</div>')+lab('Gross revenue','all network + services fees')+'</div>'+
      '<div style="flex:1">'+track(
        '<div style="position:absolute;top:0;left:-16px;right:-16px;border-top:1px dashed var(--mu);opacity:.4"></div>'+
        '<div style="position:absolute;bottom:'+netPct.toFixed(1)+'%;left:-16px;right:-16px;border-top:1px dashed var(--mu);opacity:.4"></div>'+
        '<div style="position:absolute;bottom:'+netPct.toFixed(1)+'%;left:0;right:0;height:'+rebPct.toFixed(1)+'%;background:'+hatch+';border-radius:5px;display:flex;align-items:center;justify-content:center"><span style="font-size:12px;font-weight:900;color:#7A5200">−$16B</span></div>')+
        lab('(−) Client incentives','paid to issuers · acquirers · merchants')+'</div>'+
      '<div style="flex:1">'+track('<div style="position:absolute;bottom:0;left:0;right:0;height:'+netPct.toFixed(1)+'%;background:'+V_BLUE+';border-radius:6px 6px 0 0">'+val('$40B',V_BLUE)+'</div>')+lab('= Net revenue','FY2025 · what Visa reports & grows')+'</div>'+
    '</div>'+
    '<div style="margin-top:16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--bdr);padding-top:13px">'+
      '<div style="font-size:28px;font-weight:900;color:#B7791F;line-height:1">~29%</div>'+
      '<div style="font-size:11.5px;color:var(--navy);line-height:1.5;flex:1;min-width:220px">of <b>gross</b> revenue is handed back to clients as incentives. The <b>incentive ratio</b> is the single most important swing factor — a heavy renewal year steps it up and can optically slow net-revenue growth even when volume is perfectly healthy. <b>Watch the ratio, not just net revenue.</b></div>'+
    '</div>'+
    '<div style="font-size:10px;color:var(--mu);margin-top:9px">Illustrative FY25 magnitudes (gross and rebates are not separately reported line items); bars to scale.</div>'+
  '</div>';
}
// Rebates "why they exist / how they behave" as a visual (two flavors + the #2-network
// battleground) instead of a wall of bullets.
function vRebatesVisual(){
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
      flavor('📊','Volume / performance-based','Accrued as the customer <b>delivers volume</b>.','Moves with activity — scales up and down with the book.',V_STEEL)+
      flavor('📝','Upfront / fixed','<b>Capitalized and amortized</b> over the contract life.','A big signing depresses net revenue for <b>years</b> — smoothing the hit.',V_GOLD)+
    '</div>'+
    '<div class="ov-subh" style="margin-bottom:9px">Why they exist — the network battleground</div>'+
    '<div class="reb-battle">'+
      '<div class="reb-net" style="border-color:'+V_BLUE+'"><div class="reb-net-n" style="color:'+V_BLUE+'">Visa</div><div class="reb-net-s">bids incentives</div></div>'+
      '<div class="reb-arr">incentives&nbsp;$&nbsp;→</div>'+
      '<div class="reb-prize"><div class="reb-prize-ic">🏦</div><div class="reb-prize-n">The issuer</div><div class="reb-prize-s">routes its portfolio to <b>either</b> network</div></div>'+
      '<div class="reb-arr">←&nbsp;$&nbsp;incentives</div>'+
      '<div class="reb-net" style="border-color:var(--mu)"><div class="reb-net-n" style="color:var(--mu)">Mastercard</div><div class="reb-net-s">bids incentives</div></div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:13px">Because an issuer can send its portfolio to <b>either</b> rail, incentives are how Visa <b>wins and keeps</b> deals — the same dollars Mastercard is spending for the same portfolios. Even as the market leader, this is the core competitive battleground.</div>';
}
// ── Bottom Line ▸ Unit Economics (rebates gross-to-net bridge + fee economics) ──
function ddUnitEconBody(c){
  var h='<p class="ov-lede">A network has no cost of goods — its "unit economics" are a <b>take-rate story</b>: how many basis points it keeps on each dollar of volume, and how much of gross revenue it hands back as incentives to win the volume in the first place. Two things to model: the <b>gross-to-net bridge</b> and the <b>rebate ratio</b>.</p>';
  h+=sec('The gross-to-net bridge — the most important thing to model',
    '<p class="ov-lede" style="margin-bottom:14px">'+REBATES_INTRO+'</p>'+vGrossNetWaterfall());
  h+=sec('Rebates & incentives — why they exist and how they behave', vRebatesVisual());
  h+=sec('Why the economics are so good — the take-rate, unpacked',
    '<div class="ov-kpis">'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Blended net yield</div><div class="ov-kpi-v">~28 bps</div><div class="ov-kpi-d muted">net revenue ÷ payments volume</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Credit risk taken</div><div class="ov-kpi-v">$0</div><div class="ov-kpi-d muted">issuers hold the receivable</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Incremental cost / txn</div><div class="ov-kpi-v">~nil</div><div class="ov-kpi-d muted">the switch is already built</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Operating margin</div><div class="ov-kpi-v">~67%</div><div class="ov-kpi-d muted">flows from the above</div></div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:10px">Because the switching infrastructure is <b>already built</b>, each extra transaction is almost pure margin — a tiny toll, collected billions of times, with the credit risk parked at the banks. That is why a ~28bps take-rate turns into a ~67% operating margin — the highest of the two networks.</div>');
  return h;
}
// ── Bottom Line ▸ Suppliers. Two layers: (1) the FOUR-PARTY model — the conceptual
// "supply chain" of the rails (issuers/acquirers/merchants/cardholders); and (2) the
// REAL vendor supply chain from Bloomberg SPLC (V US Equity, as of Jul 16, 2026) — 51
// vendors, almost entirely IT / software / cloud / security, the proof of asset-light. ──
var V_SUP_GROUPS=[
  { t:'IT services, cloud & core software', ic:'🖥️', note:'the biggest cost bucket — Adobe is Visa’s single largest disclosed vendor (~0.18% of cost)',
    names:['Adobe','ServiceNow','SAP','Workday','Alteryx','Confluent','Sinch','NICE','Qualys','Digi International','Grid Dynamics','Quisitive','TTEC Holdings','GHL Systems','Pipefy','Verimatrix'] },
  { t:'AI, compute & semiconductors', ic:'🤖', note:'feeds the AI-based fraud & risk models',
    names:['NVIDIA','AMD','Wuhan Tianyu ⛔'] },
  { t:'Card, biometrics & payments hardware', ic:'💳', note:'cards, terminals, biometrics & connectivity',
    names:['GMO Financial Gate','Goldpac','Newland Digital','Hengbao','Fingerprint Cards','IDEX Biometrics ⚠','Quantstamp'] },
  { t:'Fintech rails & processors', ic:'⚙️', note:'network / money-movement infrastructure',
    names:['Network International','Euronet Worldwide','Global Payments','Usio','Circle (USDC)','Polygon','SunCar Technology'] },
  { t:'Advertising, marketing & sponsorship', ic:'📣', note:'agencies, media & brand sponsorships',
    names:['M&C Saatchi','Ascential','Publicis Groupe','Ströer','Red Bull','Electronic Arts'] },
  { t:'Real estate, travel & facilities', ic:'🏢', note:'the office footprint, travel & data partners',
    names:['British Land','Swire Properties','Cousins Properties','Morgan Sindall','Top Of The Rock','Bright Horizons','Amadeus','Gol Linhas Aéreas ⚠','AirAsia (Capital A)','Karya Pacific Energy','PCCW','Beijing Yuanlong Yato'] },
];
function vSupplierChips(){
  return '<div class="ov-chart-card" style="padding:14px 16px">'+
    '<div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px">'+
      '<div><div style="font-size:20px;font-weight:900;color:var(--navy)">51</div><div style="font-size:10.5px;color:var(--mu)">named suppliers · 89 facilities</div></div>'+
      '<div><div style="font-size:20px;font-weight:900;color:'+V_BLUE+'">~0%</div><div style="font-size:10.5px;color:var(--mu)">raw-material / COGS suppliers</div></div>'+
      '<div><div style="font-size:20px;font-weight:900;color:var(--navy)">US 41%</div><div style="font-size:10.5px;color:var(--mu)">domiciled · 46% of facilities</div></div>'+
      '<div><div style="font-size:20px;font-weight:900;color:#C0392B">⚠ 2</div><div style="font-size:10.5px;color:var(--mu)">distressed · ⛔ 1 sanctioned</div></div>'+
    '</div>'+
    V_SUP_GROUPS.map(function(g){ return '<div style="margin:10px 0 4px"><div style="font-size:12px;font-weight:800;color:var(--navy);margin-bottom:5px">'+g.ic+' '+esc(g.t)+' <span style="font-weight:600;color:var(--mu);font-size:10.5px">— '+esc(g.note)+'</span></div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:5px">'+g.names.map(function(n){ var flag=n.indexOf('⚠')!==-1||n.indexOf('⛔')!==-1; return '<span style="background:'+(flag?'rgba(192,57,43,0.06)':'#F1F4F8')+';border:1px solid '+(flag?'rgba(192,57,43,0.30)':'var(--bdr)')+';border-radius:7px;padding:3px 9px;font-size:11px;color:var(--navy)">'+esc(n)+'</span>'; }).join('')+'</div></div>'; }).join('')+
  '</div>';
}
function ddSuppliersBody(c){
  var h='<p class="ov-lede">Visa is an <b>asset-light network</b>: it does not issue, lend or take credit risk. So "suppliers" means two different things — the <b>four-party model</b> (the conceptual supply chain of the rails), and the <b>real vendor list</b> (who Visa actually pays), which turns out to be <b>almost entirely IT, cloud, software and security</b>. That second list <i>is</i> the asset-light thesis.</p>';
  h+=sec('The four-party (open-loop) model',
      '<div class="ov-diagram-cap" style="margin:0 0 8px">The conceptual supply chain of the rails — tap any box for its role, then press <b>Play</b> to follow a single $100 purchase and see who earns at each step.</div>'+
      '<div class="ov-diagram" style="margin-top:6px">'+FOURPARTY_SVG+'</div>'+flowHtml());
  h+=sec('The real vendor supply chain — who Visa actually pays',
      '<div class="ov-diagram-cap" style="margin:0 0 10px">From <b>Bloomberg SPLC</b> (V US Equity, as of Jul 16, 2026). Notice what’s <b>not</b> here: no factories, no commodities, no cost-of-goods. Visa’s "supply chain" is <b>cloud, software, security and data-center tech</b> — <b>51 low-risk vendors</b> (Adobe its single largest, ~0.18% of cost). That is why a ~67% operating margin is even possible. <span style="color:#C0392B">⚠ = distressed grade · ⛔ = has sanctions</span>.</div>'+vSupplierChips());
  h+=sec('How Visa makes money', '<div class="ov-callout">'+bullets(HOW_MONEY)+'</div>');
  h+='<div class="ov-foot">Vendor list & relationship sizes: Bloomberg SPLC (supply-chain), V US Equity, as of Jul 16, 2026 — relationships are BBG estimates / company-disclosed, not a Visa statement. Grouping is editorial. Most top suppliers carry an investment-grade (IG) default-risk grade; Gol Linhas Aéreas & IDEX Biometrics are distressed, Wuhan Tianyu carries sanctions.</div>';
  return h;
}
// ── Bottom Line ▸ Margins — profitability & cash margins as % of revenue. Sourced fallback
// (FY21–25 approximated from Visa 10-K actuals, FY26E an estimate); the live Massive feed
// (api.fetchMargins) overrides it when reachable. Visa has no cost-of-revenue line, so
// there is no "gross" margin — the story is operating/EBITDA/net/cash. ──
var V_MRG_METRICS=[
  {key:'oper',label:'Operating',color:V_BLUE},
  {key:'net',label:'Net',color:'#7A5AF8'},
  {key:'ebitda',label:'EBITDA',color:V_GOLD},
  {key:'cfo',label:'CFO',color:'#12B5A5'},
  {key:'fcf',label:'FCF',color:V_GREEN}
];
var V_MRG_FALLBACK=[
  {fy:'FY21', oper:65.6, net:51.1, ebitda:69.3, cfo:62.0, fcf:60.2},
  {fy:'FY22', oper:64.2, net:51.0, ebitda:67.2, cfo:62.0, fcf:61.1},
  {fy:'FY23', oper:64.4, net:52.9, ebitda:67.1, cfo:61.0, fcf:60.3},
  {fy:'FY24', oper:65.6, net:54.9, ebitda:68.2, cfo:60.0, fcf:58.0},
  {fy:'FY25', oper:64.9, net:50.0, ebitda:67.2, cfo:60.0, fcf:58.0},
  {fy:'FY26E',oper:66.0, net:53.0, ebitda:68.0, cfo:61.0, fcf:59.0, proj:true}
];
var V_MRG_NOTE_FB='Operating / net = <b>GAAP</b>; EBITDA and CFO/FCF ÷ net revenue. <b>FY26E</b> = estimate. Visa runs one of the <b>highest operating margins in the S&P 500 (~64–67%)</b> and converts nearly 60% of revenue to free cash flow — the asset-light, no-credit-risk model in one picture. <span style="color:#B7791F">Directional; approximated from Visa 10-K actuals — the live Massive feed overrides it when reachable.</span> <span class="ave-subh-note">EBITDA / cash margins are approximate.</span>';
var V_MRG_NOTE_LIVE='Historical margins computed <b>live from Massive</b> (income & cash-flow statements): operating/net = line ÷ revenue; EBITDA = (op income + D&A) ÷ revenue; CFO & FCF ÷ revenue. Visa has no cost-of-revenue line, so there is no gross margin.';
var _maMrgRows=V_MRG_FALLBACK.slice();
var _maMrgSrc='fallback';
function ddMarginsBody(c){
  return '<p class="ov-lede">Profitability & cash margins as a % of net revenue. The whole thesis reads in one chart: a business with <b>no credit risk and almost no capital</b> earns a <b>~65% operating margin</b>, a <b>~67% EBITDA margin</b>, and converts <b>~58–60% of revenue to free cash flow</b> — margins near the very top of any large company.</p>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Margins (% of net revenue) <span>· fiscal years · FY26E = estimate</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="vChartMargins"></canvas></div></div>'+
    '<div class="ave-subh-note" id="vMrgNote" style="margin-top:8px">'+V_MRG_NOTE_FB+'</div>';
}
function buildMaMargins(){
  var cv=document.getElementById('vChartMargins'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var ex=Chart.getChart?Chart.getChart(cv):null; if(ex) ex.destroy();
  var labels=_maMrgRows.map(function(r){ return r.fy; });
  var projIdx=_maMrgRows.reduce(function(a,r,i){ return r.proj?i:a; }, -1);
  var ds=V_MRG_METRICS.map(function(m){ return { label:m.label, data:_maMrgRows.map(function(r){ return r[m.key]; }), borderColor:m.color, backgroundColor:m.color, borderWidth:2, tension:.25, spanGaps:true, fill:false,
    pointRadius:_maMrgRows.map(function(r){ return r.proj?4:2; }), pointStyle:_maMrgRows.map(function(r){ return r.proj?'rectRot':'circle'; }),
    segment:{ borderDash:function(ctx){ return ctx.p1DataIndex===projIdx?[5,4]:undefined; } } }; });
  new Chart(cv.getContext('2d'),{ type:'line', data:{ labels:labels, datasets:ds },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ title:function(it){ var l=it[0].label; return l==='FY26E'?'FY26E · estimate':l; }, label:function(ctx){ return ctx.dataset.label+': '+(ctx.parsed.y==null?'—':ctx.parsed.y.toFixed(1)+'%'); } } } },
      scales:{ y:{ ticks:{ callback:function(v){ return v+'%'; }, font:{size:10} }, grid:{color:'#EEF2F7'} }, x:{ grid:{display:false}, ticks:{font:{size:10.5}} } } }
  });
  vLoadMargins();
}
function vLoadMargins(){
  if(_maMrgSrc==='massive') return;
  import('../api.js').then(function(api){ return api.fetchMargins?api.fetchMargins('V'):null; }).then(function(res){
    if(!res||!res.success||!res.data||res.data.length<3) return;
    var proj=V_MRG_FALLBACK[V_MRG_FALLBACK.length-1];
    _maMrgRows=res.data.concat(proj&&proj.proj?[proj]:[]);
    _maMrgSrc='massive';
    var note=document.getElementById('vMrgNote'); if(note) note.innerHTML=V_MRG_NOTE_LIVE;
    buildMaMargins();
  }).catch(function(){});
}
// ── Evolution ▸ Strategy — the real architecture: three growth engines (Consumer Payments ·
// CMS · Value-Added Services), the network-of-networks hedge, and the forward bets
// (tokenization/agentic/stablecoins). Sourced from the Feb 2025 Investor Day, FY2025 10-K
// and the FY2024–FY2026 earnings calls. Driver cards → pop-ups. ──
var V_STRAT_DRIVERS=[
  { k:'consumer', ic:'💳', t:'Consumer Payments', teaser:'Digitize the ~$41T of consumer spend — with ~$11T still in cash & check.',
    detail:'<p><b>The anchor engine.</b> A ~<b>$41T</b> consumer-payment opportunity with <b>~$11T of cash & check</b> still to displace — the cash-to-digital runway.</p>'+bullets([
      '<b>Tap-to-pay</b> is now the majority of face-to-face transactions globally and still rising — the everyday-spend converter.',
      '<b>Credentials & tokens:</b> billions of Visa credentials, <b>13B+ network tokens</b> issued — lifting approval rates and cutting fraud.',
      '<b>Visa Flexible Credential:</b> one card toggling debit / credit / instalments / rewards — live in Asia and the US.',
      '<b>Cross-border</b> (travel + e-commerce) is the high-yield slice within consumer payments.']) },
  { k:'newflows', ic:'🔀', t:'Commercial & Money Movement (CMS)', teaser:'A ~$200T new-flows opportunity — commercial, B2B and money movement.',
    detail:'<p><b>The largest disclosed opportunity: ~$200T</b> (Investor Day, Feb 2025) across commercial payments and money movement, still overwhelmingly off-card.</p>'+bullets([
      '<b>Visa Commercial Solutions:</b> commercial & B2B card volume, virtual cards and travel/expense — a large, under-penetrated flow.',
      '<b>Visa Direct:</b> real-time push payments reaching <b>~11B endpoints</b> (cards, accounts, wallets); transaction growth well ahead of the network — payouts, remittances, P2P, earned-wage access.',
      '<b>Visa B2B Connect:</b> cross-border bank-to-bank rails outside the card network. <b>Pismo</b> (core banking / issuer processing) extends CMS reach.']) },
  { k:'services', ic:'🛡️', t:'Value-Added Services', teaser:'~30% of net revenue, +20%+ cc, and a ~$520B TAM — the diversifier.',
    detail:'<p><b>The diversification engine.</b> VAS is growing <b>~20%+ cc</b>, now <b>~30% of net revenue</b>, against a <b>~$520B</b> TAM — a long runway across four families.</p>'+bullets([
      '<b>Issuing solutions:</b> Debit Processing Service (DPS) + <b>Pismo</b> cloud core-banking / issuer processing.',
      '<b>Acceptance:</b> <b>CyberSource</b> and <b>Authorize.net</b> gateways and merchant tools.',
      '<b>Risk & security:</b> Visa Protect, tokenization, and <b>Featurespace</b> (adaptive-behaviour fraud AI).',
      '<b>Advisory & open banking:</b> Visa Consulting & Analytics and <b>Tink</b> (European open banking).']) },
  { k:'multirail', ic:'🛤️', t:'Network of networks', teaser:'Own card + real-time + account rails so Visa earns whichever rail a payment takes.',
    detail:'<p><b>The disintermediation hedge.</b> Rather than resist account-to-account / real-time rails that could bypass cards, Visa builds a <b>"network of networks"</b> — VisaNet for cards, Visa Direct for push payments, B2B Connect for cross-border bank flows, and Tink for open banking.</p>'+bullets([
      'Visa <b>captures value on whichever rail</b> a payment travels — card or non-card.',
      'High-margin <b>Value-Added Services</b> layer on top of both card and non-card flows.',
      'Tokenization + agentic + stablecoin rails keep Visa’s <b>credential and trust layer embedded</b> as the settlement rail changes.']) },
  { k:'future', ic:'🤖', t:'The forward bets', teaser:'Tokenization, agentic commerce (Visa Intelligent Commerce) and stablecoins.',
    detail:'<p><b>Where the next decade is being placed.</b></p>'+bullets([
      '<b>Tokenization:</b> <b>13B+ network tokens</b> issued, lifting approval rates and cutting fraud — extending across e-commerce and now agentic checkout.',
      '<b>Agentic commerce — "Visa Intelligent Commerce"</b> (Apr 2025): lets verified AI agents transact with Visa credentials under tokenized, policy-bound controls. Partners include Anthropic, OpenAI, Microsoft, Mistral, Perplexity, Samsung and Stripe.',
      '<b>Stablecoins:</b> settling in <b>USDC</b> since 2021 (Solana/Ethereum); launched the <b>Visa Tokenized Asset Platform (VTAP)</b> for banks to mint/move fiat-backed tokens; framed as a Visa Direct money-movement opportunity.']) },
];
// Click-through detail for the three verb-triad hero cards (opens in the shared modal).
var V_VERBS={
  grow:{ t:'📈 Consumer Payments — the core network', h:
    '<p style="font-size:12.5px;color:var(--navy);line-height:1.55;margin-bottom:10px">Keep digitizing the world\'s everyday payments — the engine that still has a long runway.</p>'+bullets([
      '<b>~$41T</b> of consumer spend, with <b>~$11T of cash & check</b> still to displace — the cash-to-digital runway.',
      '<b>Tap-to-pay</b> now the majority of face-to-face transactions globally; <b>13B+ network tokens</b> lifting approvals and cutting fraud.',
      '<b>Cross-border</b> (travel + e-commerce) is the high-yield slice — a key growth driver.',
      '<b>Visa Flexible Credential</b> (one card, multiple funding sources) extends the core into new use-cases.']) },
  diversify:{ t:'🧬 New Flows & Services — customers, flows & geographies', h:
    '<p style="font-size:12.5px;color:var(--navy);line-height:1.55;margin-bottom:10px">Change what Visa earns on and where — so growth is less tied to any single market or the card-swipe cycle.</p>'+bullets([
      '<b>Value-Added Services:</b> ~30% of net revenue, +20%+ cc, against a <b>~$520B TAM</b> — the diversifier, much of it network-agnostic.',
      '<b>Commercial & Money Movement (CMS):</b> a ~$200T new-flows opportunity — Visa Commercial Solutions, <b>Visa Direct</b> (~11B endpoints), B2B Connect.',
      '<b>Geographies:</b> the broadest global acceptance footprint, with international the higher-growth mix.',
      'Because VAS sells even off Visa rails, it <b>decouples growth from card-share battles</b>.']) },
  build:{ t:'🏗️ Build — for the future', h:
    '<p style="font-size:12.5px;color:var(--navy);line-height:1.55;margin-bottom:10px">Own the next rails and the trust layer, so Visa still gets paid however money moves — a "network of networks".</p>'+bullets([
      '<b>Network of networks:</b> VisaNet (cards) + Visa Direct (push) + B2B Connect + Tink (open banking) — earns on <b>whichever rail</b> a payment takes.',
      '<b>Tokenization:</b> <b>13B+ network tokens</b> issued, extending across e-commerce and agentic checkout.',
      '<b>Agentic commerce — Visa Intelligent Commerce:</b> verified AI agents transact with Visa credentials (Anthropic, OpenAI, Microsoft, Stripe partners).',
      '<b>Stablecoins:</b> USDC settlement since 2021 + the <b>Visa Tokenized Asset Platform (VTAP)</b>.']) },
};
function ddStrategyBody(c){
  var h='<style>'+
    '.mstr-hero{display:flex;flex-wrap:wrap;gap:10px;align-items:stretch;margin:8px 0 18px}'+
    '.mstr-verb{flex:1;min-width:150px;border:1px solid var(--bdr);border-top:4px solid '+V_BLUE+';border-radius:13px;padding:15px 16px;text-align:center;background:linear-gradient(180deg,rgba(207,10,44,.055),var(--w))}'+
    '.mstr-verb-ic{font-size:25px;line-height:1}.mstr-verb-v{font-size:23px;font-weight:900;color:var(--navy);margin-top:5px;letter-spacing:-.4px}'+
    '.mstr-verb-l{font-size:11px;color:var(--mu);font-weight:700;margin-top:2px}'+
    '.mstr-plus{align-self:center;font-size:22px;font-weight:900;color:'+V_BLUE+'}@media(max-width:640px){.mstr-plus{display:none}}'+
    '.mstr-verb.ov-clickable{cursor:pointer;transition:box-shadow .15s,transform .1s}.mstr-verb.ov-clickable:hover{box-shadow:0 5px 16px rgba(207,10,44,.13);transform:translateY(-1px)}'+
    '.mstr-verb-more{font-size:10px;font-weight:800;color:'+V_BLUE+';margin-top:7px;letter-spacing:.3px}'+
    '.mad-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:10px;align-items:stretch;margin:4px 0 12px}@media(max-width:760px){.mad-flow{grid-template-columns:1fr}}'+
    '.mad-arr{align-self:center;color:'+V_BLUE+';font-size:20px;font-weight:900}@media(max-width:760px){.mad-arr{text-align:center}}'+
    '.mad-step{border:1px solid var(--bdr);border-radius:12px;padding:13px 14px;background:var(--w)}'+
    '.mad-h{font-size:12.5px;font-weight:900;color:var(--navy);margin-bottom:7px}.mad-p{font-size:11.5px;color:var(--mu);line-height:1.5}'+
    '.mad-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}.mad-chip{font-size:10px;font-weight:700;border-radius:7px;padding:3px 8px}</style>';
  h+='<p class="ov-lede">Visa frames its strategy around <b>three growth engines</b> (Consumer Payments · Commercial & Money Movement · Value-Added Services), wired together by a <b>"network of networks"</b> — the deliberate hedge against disintermediation. <b>Tap any card</b> — the three verbs below <i>or</i> the five levers under them — for the detail.</p>';
  h+='<div class="mstr-hero">'+
    '<div class="mstr-verb ov-clickable" data-detail="verb:grow"><div class="mstr-verb-ic">📈</div><div class="mstr-verb-v">Grow</div><div class="mstr-verb-l">the core network</div><div class="mstr-verb-more">Tap ›</div></div>'+
    '<span class="mstr-plus">→</span>'+
    '<div class="mstr-verb ov-clickable" data-detail="verb:diversify"><div class="mstr-verb-ic">🧬</div><div class="mstr-verb-v">Diversify</div><div class="mstr-verb-l">customers & geographies</div><div class="mstr-verb-more">Tap ›</div></div>'+
    '<span class="mstr-plus">→</span>'+
    '<div class="mstr-verb ov-clickable" data-detail="verb:build"><div class="mstr-verb-ic">🏗️</div><div class="mstr-verb-v">Build</div><div class="mstr-verb-l">for the future</div><div class="mstr-verb-more">Tap ›</div></div>'+
  '</div>';
  h+=sec('Why the acquisition spree — defending share by offering more',
    '<div class="mad-flow">'+
      '<div class="mad-step" style="border-top:3px solid '+V_STEEL+'"><div class="mad-h">① The ecosystem is crowding</div><div class="mad-p">A wave of new entrants is trying to sit between the bank and the merchant — routing around cards.</div>'+
        '<div class="mad-chips">'+['Fintechs','Digital wallets','A2A / real-time','Stablecoins','Big-tech pay'].map(function(x){ return '<span class="mad-chip" style="background:#EEF2F7;color:var(--navy)">'+esc(x)+'</span>'; }).join('')+'</div></div>'+
      '<div class="mad-arr">→</div>'+
      '<div class="mad-step" style="border-top:3px solid '+V_GOLD+'"><div class="mad-h">② So the game changes</div><div class="mad-p">Visa already holds the <b>largest</b> network share. The battle is no longer <i>winning</i> share — it is <b>defending</b> it. The moat: earn <b>more on every transaction</b>, and even off its own rails.</div></div>'+
      '<div class="mad-arr">→</div>'+
      '<div class="mad-step" style="border-top:3px solid '+V_BLUE+'"><div class="mad-h">③ The response: buy the "more"</div><div class="mad-p">A decade of acquisitions (<b>Tink, Currencycloud, Pismo, Featurespace, YellowPepper</b>) bolt value-added services onto the rails:</div>'+
        '<div class="mad-chips">'+['Security','Issuing / core banking','Data & AI','Open banking','Money movement'].map(function(x){ return '<span class="mad-chip" style="background:rgba(26,31,113,.08);color:'+V_BLUE+'">'+esc(x)+'</span>'; }).join('')+'</div></div>'+
    '</div>'+
    '<div class="ov-callout" style="margin-top:4px"><b>The payoff:</b> VAS is now <b>~30% of net revenue and growing 20%+ cc</b>, much of it sells <b>even where Visa doesn\'t win the card</b> (fraud, issuing, open banking), and every service sold into an issuer or merchant <b>raises switching costs</b> — so the network share gets <i>stickier</i>. The through-line of a decade of M&A: <b>services → a wider, better-defended moat</b>.</div>');
  h+=sec('The five levers — tap any card',
    '<div class="ov-drivers">'+V_STRAT_DRIVERS.map(function(d){ return '<div class="ov-driver ov-clickable" data-detail="strat:'+esc(d.k)+'"><div class="ov-driver-t">'+d.ic+' '+esc(d.t)+'</div><div class="ov-driver-d">'+esc(d.teaser)+'</div><div class="ov-more">More ›</div></div>'; }).join('')+'</div>');
  h+=sec('The long-term framework (Investor Day, Feb 2025)',
    '<div class="ov-targets ov-targets-3">'+[
      ['Net revenue growth','low-double-digits','currency-neutral'],
      ['VAS net revenue growth','~20%+ cc','the growth engine'],
      ['Operating margin','high-60s%','among the highest in the S&P 500'],
      ['Adjusted EPS growth','low-to-mid teens','buybacks amplify'],
    ].map(function(b){ return '<div class="ov-target"><div class="ov-target-v">'+esc(b[1])+'</div><div class="ov-target-l">'+esc(b[0])+'</div><div class="ov-target-s">'+esc(b[2])+'</div></div>'; }).join('')+'</div>'+
    '<div class="ov-fynote" style="margin-top:12px">The tell on the runway: Visa’s VAS revenue is ~<b>$9B+</b> against a company-cited <b>~$520B TAM</b> — a low-single-digit share, and the leg management points to for durable double-digit growth.</div>');
  h+=sec('The flywheel — why services and the network reinforce each other',
    '<div class="ov-callout"><div class="ov-tl-body" style="font-size:12px;line-height:1.6"><b>Much of VAS is network-linked</b>, so more transactions → more services revenue; and services (fraud scoring, issuing, insights, open banking) make the network more valuable, winning/retaining the issuing & co-brand deals that drive <i>more</i> transactions. Services also grows faster (~20%+ cc) and is <b>less regulated</b> than interchange-driven fees — diversifying revenue to ~30% and reducing reliance on pure card-switching.</div></div>');
  h+='<div class="ov-foot">Sources: Visa Investor Day, Feb 2025; FY2025 10-K; FY2024–FY2026 earnings calls; Visa press (Visa Intelligent Commerce, USDC settlement / VTAP, tokenization). Forward targets are company objectives, not guarantees.</div>';
  return h;
}
// ── Valuation ▸ Balance Sheet (the DCF financials) ──
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
    finCard('finOpInc','Operating Income','FY21 – FY25')+
    finCard('finEbitda','EBITDA','FY21 – FY25')+
    finCard('finFcf','Free Cash Flow','FY21 – FY25')+
  '</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:10px">'+FIN_NOTE+'</div>';
  return h;
}
function finCard(id, title, sub){
  return '<div class="ov-chart-card"><div class="ov-chart-t">'+esc(title)+' <span>'+esc(sub)+'</span></div>'+
    '<div class="ov-chart-wrap"><canvas id="'+id+'"></canvas></div>'+
    '<div class="ov-statline" id="stat-'+id+'"></div></div>';
}
// ── Valuation ▸ Risk & Litigation — the things specific to Visa here: it carries the
// Class-B litigation-escrow (RRP) that SHIELDS public shareholders from US interchange
// claims (an advantage vs Mastercard), plus the DOJ debit-monopoly suit it bears directly.
// The broader bull/bear forces are evidence-framed in Top Line ▸ Industry Analysis. ──
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
  return '<div class="lsv-wrap">'+v+ma+'</div>'+
    '<div class="ov-fynote" style="margin-top:10px">Same lawsuits, different plumbing: Visa <b>diverts</b> much of its US interchange exposure onto former member banks through a share/escrow structure created at its 2008 IPO — so public Class-A holders are <b>largely insulated</b>. Mastercard\'s cleaner single-class structure means the risk lands <b>directly on its P&L and shareholders</b>. For Visa, the escrow is a genuine structural <b>advantage</b> on interchange litigation — offset by the separate, Visa-specific <b>DOJ debit suit</b> it bears directly.</div>';
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
    '.lsv-col.ov-clickable{cursor:pointer;transition:box-shadow .15s,border-color .15s}.lsv-col.ov-clickable:hover{border-color:'+V_BLUE+';box-shadow:0 2px 10px rgba(207,10,44,.08)}'+
    '.lsv-more{margin-top:10px;font-size:11px;font-weight:800;color:'+V_BLUE+';text-align:right}</style>';
  h+='<p class="ov-lede">The bull/bear forces and disintermediation threats live in <b>Top Line ▸ Industry Analysis</b>. This tab covers the risks <b>structurally specific to Visa</b>: the <b>Class-B litigation-escrow shield</b> that insulates public shareholders from US interchange claims (a genuine advantage vs Mastercard), and the <b>DOJ debit-monopoly suit</b> (Sept 2024) that Visa carries directly.</p>';
  h+='<p class="ov-lede" style="margin-bottom:14px">'+LIT_INTRO+'</p>';
  h+=sec('Interchange & antitrust litigation — by jurisdiction', litFlagCards());
  h+=sec('Who absorbs the hit — Visa vs Mastercard', litShieldVisual());
  h+='<div class="ov-foot">Sources: Visa 10-K legal proceedings (incl. the DOJ debit civil suit filed Sept 24, 2024, and the US retrospective responsibility plan / litigation escrow); reporting on MDL 1720 (2025 revised settlement, rejected by merchants); EU interchange regulation.</div>';
  return h;
}
// ── Valuation ▸ Multiples — how the listed peers trade (the qualitative map is in Industry). ──
function ddMultiplesBody(c){
  var rows=[
    { tk:'V', n:'Visa', mc:'~$640B', ev:'~24×', pe:'~27×', g:'+11%', self:true, read:'The largest network — the twin premium "toll road", a touch cheaper than MA on a smaller (~30%) services mix; Class-B litigation shield.' },
    { tk:'MA', n:'Mastercard', mc:'~$470B', ev:'~28×', pe:'~31×', g:'+13%', read:'The #2 network — a slight premium for a larger (~42%) services mix and cross-border tilt; bears interchange litigation directly.' },
    { tk:'AXP', n:'Amex', mc:'~$210B', ev:'n/m', pe:'~17×', g:'+9%', read:'Closed-loop (it lends) — EV/EBITDA not comparable; a premium, affluent, spend-centric model. P/E only.' },
    { tk:'PYPL', n:'PayPal', mc:'~$50B', ev:'~11×', pe:'~14×', g:'+9%', read:'A wallet / A2A player on a different rail; much cheaper on slower growth and a more contested moat.' },
  ];
  var h='<p class="ov-lede">How the <b>listed</b> peers trade. Visa and Mastercard are the twin premium "toll roads"; Mastercard carries a slight multiple premium to Visa for its larger services mix and cross-border tilt, while Visa is the larger, marginally cheaper name. Amex (closed-loop, lends) is comparable only on P/E; PayPal is a cheaper, different-rail name.</p>';
  h+='<div class="ov-chart-card" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="color:var(--mu)"><th style="text-align:left;padding:7px 10px">Company</th><th style="text-align:right;padding:7px 10px">Mkt cap</th><th style="text-align:right;padding:7px 10px">EV/EBITDA <span style="font-weight:600">(fwd)</span></th><th style="text-align:right;padding:7px 10px">P/E <span style="font-weight:600">(fwd)</span></th><th style="text-align:right;padding:7px 10px">Rev growth</th><th style="text-align:left;padding:7px 10px">The read</th></tr></thead><tbody>'+
    rows.map(function(p){ var bg=p.self?'background:rgba(26,31,113,0.05);':''; return '<tr style="border-top:1px solid var(--bdr);'+bg+'"><td style="padding:8px 10px;font-weight:'+(p.self?'800':'700')+'">'+esc(p.n)+' <span class="muted" style="font-weight:600">'+esc(p.tk)+'</span></td><td style="text-align:right;padding:8px 10px">'+esc(p.mc)+'</td><td style="text-align:right;padding:8px 10px">'+esc(p.ev)+'</td><td style="text-align:right;padding:8px 10px">'+esc(p.pe)+'</td><td style="text-align:right;padding:8px 10px">'+esc(p.g)+'</td><td style="padding:8px 10px;color:var(--mu);font-size:11px;line-height:1.45">'+esc(p.read)+'</td></tr>'; }).join('')+
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
//  table. Visa guides adjusted NET-REVENUE growth and adjusted EPS growth (both
//  currency-neutral / adjusted). Bands are indicative mappings of Visa's qualitative
//  language ("low-double-digits" → ~9–12%); delivered = reported adjusted, cc growth.
//  Directional — pending exact figures from each FY24–FY26 transcript. ──
var V_GQ=['Q1 24','Q2 24','Q3 24','Q4 24','Q1 25','Q2 25','Q3 25','Q4 25','Q1 26','Q2 26'];
var V_GUIDE={
  netrev:{ label:'Net-revenue growth', axis:'adjusted net-revenue growth (cc)',
    glo:[9,9,9,9,10,10,9,9,9,9], ghi:[11,11,11,11,12,12,11,11,11,11],
    words:['high-single to low-double','low double-digits','low double-digits','low double-digits','low double-digits','low double-digits','low double-digits','low double-digits','low double-digits','low double-digits (macro watch)'],
    act:[11,10,10,12,10,10,12,11,11,null],
    note:'The engine Visa keeps clearing: delivered adjusted net-revenue growth has landed <b>in — or above — the guided band nearly every quarter</b>, powered by resilient consumer spend, cross-border and Value-Added Services. Bands are an indicative mapping of Visa\'s qualitative language, pending the exact figures in each transcript.' },
  eps:{ label:'Adjusted EPS growth', axis:'adjusted EPS growth (cc)',
    glo:[11,12,12,12,11,11,11,11,11,11], ghi:[14,15,15,15,14,14,14,14,13,13],
    act:[11,12,12,16,13,13,14,14,12,null],
    words:['low-teens','low-teens','low-teens','low-teens','low-teens','low-teens','low-teens','low-teens','low-double / low-teens','low-double / low-teens'],
    note:'Adjusted EPS growth runs a few points ahead of net revenue — the arithmetic of a high-margin model plus <b>~$20B/yr of buybacks</b> steadily shrinking the share count. Visa consistently lands in the <b>low-to-mid teens</b>. Directional band mapping, pending exact transcript figures.' },
};
var _maGuideMetric='netrev';
function vGuidePct(v){ return v==null?'—':(v>0?'+':'')+v+'%'; }
function vGuideColor(a,lo,hi){ if(a==null) return V_STEEL; if(a>=hi) return V_GREEN; if(a>=(lo+hi)/2) return V_BLUE; if(a>=lo-0.4) return V_BLUE; return '#C0392B'; }
function vGuideLand(a,lo,hi){ if(a==null) return { t:'current guide', c:'guid-mut' }; var mid=(lo+hi)/2;
  if(a>=hi) return { t:'above range', c:'guid-up' }; if(a>=mid) return { t:'upper half', c:'' }; if(a>=lo-0.4) return { t:'in range', c:'' }; return { t:'below range', c:'guid-dn' }; }
function vGuideBody(c){
  var h='<p class="ov-lede">Each quarter Visa guides <b>adjusted net-revenue growth</b> and <b>adjusted EPS growth</b> (currency-neutral), alongside qualitative colour on client incentives and expenses. Switch metric, then read the <b>guided band vs what it delivered</b> (the dot); green = above the range. Bands are indicative mappings of Visa’s qualitative language ("low-double-digits" → ~9–12%).</p>';
  h+='<div class="guid-pills">'+['netrev','eps'].map(function(k){ return '<button type="button" class="guid-pill'+(k===_maGuideMetric?' active':'')+'" data-maguidm="'+k+'">'+esc(V_GUIDE[k].label)+'</button>'; }).join('')+'</div>';
  h+='<div id="vGuideLeg" style="margin-bottom:6px"></div>';
  h+='<div class="ov-chart-card"><div class="ov-chart-t" id="vGuideT"></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="vGuideChart"></canvas></div></div>';
  h+='<div class="ov-fynote" id="vGuideNote" style="margin-top:8px"></div>';
  h+='<div class="guid-tbl-wrap" style="margin-top:12px"><div id="vGuideTbl"></div></div>';
  h+='<div class="ov-foot">Sources: Visa Inc. quarterly earnings calls & releases (FY2024 Q1 – FY2026 Q2, transcripts). Visa guides qualitatively ("low-double-digits", "low-teens"); the bands here are an <b>indicative</b> numeric mapping and the delivered dots are reported adjusted, currency-neutral growth — directional, not to the decimal. Q2-26 shows the current guide (no actual yet).</div>';
  return h;
}
function vGuideLegend(){
  var s='display:inline-flex;align-items:center;gap:7px;margin:0 18px 6px 0;font-size:12px;font-weight:600;color:var(--mu)';
  return '<span style="'+s+'"><span style="width:16px;height:11px;border-radius:3px;background:rgba(122,134,153,0.16);border:1px solid rgba(122,134,153,0.45);flex:none"></span>Guided range</span>'+
    '<span style="'+s+'"><span style="width:11px;height:11px;border-radius:50%;background:'+V_BLUE+';flex:none"></span>Delivered (cn, ex-acq)</span>'+
    '<span style="'+s+'"><span style="width:11px;height:11px;border-radius:50%;background:'+V_GREEN+';flex:none"></span>Above the range</span>';
}
function buildMaGuideChart(){
  var cv=document.getElementById('vGuideChart'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var ex=Chart.getChart?Chart.getChart(cv):null; if(ex) ex.destroy();
  var g=V_GUIDE[_maGuideMetric];
  new Chart(cv.getContext('2d'),{ type:'bar', data:{ labels:V_GQ, datasets:[
    { type:'bar', label:'Guided range', order:3, maxBarThickness:30, borderSkipped:false, borderRadius:3, borderWidth:1,
      data:g.glo.map(function(lo,i){ return (lo==null||g.ghi[i]==null)?null:[lo,g.ghi[i]]; }),
      backgroundColor:'rgba(122,134,153,0.16)', borderColor:'rgba(122,134,153,0.45)' },
    { type:'line', label:'Delivered', data:g.act, borderColor:V_BLUE, borderWidth:2, tension:0, spanGaps:false, fill:false, order:1,
      pointRadius:g.act.map(function(v){ return v==null?0:5; }),
      pointBackgroundColor:g.act.map(function(v,i){ return vGuideColor(v,g.glo[i],g.ghi[i]); }),
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
  var box=document.getElementById('vGuideTbl'); if(!box) return; var g=V_GUIDE[_maGuideMetric];
  var rows=V_GQ.map(function(q,i){ var lo=g.glo[i], hi=g.ghi[i], a=g.act[i], land=vGuideLand(a,lo,hi);
    var range=(lo==null)?'<span class="guid-mut">not guided</span>':lo+'–'+hi+'% <span class="guid-mut">('+esc(g.words[i])+')</span>';
    var rep=(a==null)?'<span class="guid-mut">pending</span>':'<b>+'+a+'%</b>';
    return '<tr><td>'+esc(q)+'</td><td>'+range+'</td><td>'+rep+'</td><td class="'+land.c+'">'+land.t+'</td></tr>'; }).join('');
  box.innerHTML='<table class="guid-tbl"><thead><tr><th>Quarter</th><th>Guided (cn, ex-acq)</th><th>Delivered</th><th>Landing</th></tr></thead><tbody>'+rows+'</tbody></table>';
}
function renderMaGuide(){
  var leg=document.getElementById('vGuideLeg'); if(leg) leg.innerHTML=vGuideLegend();
  var t=document.getElementById('vGuideT'); if(t) t.innerHTML=esc(V_GUIDE[_maGuideMetric].label)+' — guided range vs delivered <span>· per quarter · cn, ex-acq · Q2-26 = current guide</span>';
  var note=document.getElementById('vGuideNote'); if(note) note.innerHTML=V_GUIDE[_maGuideMetric].note;
  buildMaGuideChart(); renderMaGuideTable();
}
function switchMaGuideMetric(root,k){ if(!V_GUIDE[k]) return; _maGuideMetric=k;
  root.querySelectorAll('.guid-pill[data-maguidm]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-maguidm')===k); });
  renderMaGuide(); }

// ════════════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════════════
//  Evolution ▸ CALL PREP — the decision layer (docs/CALL_PREP_CONVENTIONS.md v2.4)
//  Ported from googl.js / ibkr.js (canonical). Four phases — Setup · Watch List ·
//  Post-Results · Post-Call — as per-quarter blocks behind a quarter selector.
//  The theme record (V_THEMES) is FOLDED into the Watch List (v2.3 fusion) — there
//  is NO standalone Earnings Calls tab. Consensus (Bloomberg BST) + Summit + the 4
//  custom KPIs are wired but render 'to fill'/'to define' until Dani's export lands
//  (the same bootstrap IBKR went through). Visa runs an Oct–Sep fiscal year.
// ════════════════════════════════════════════════════════════════════════════
// Call Prep palette (Visa identity): navy primary + gold custom-KPI accent.
var BRAND=V_BLUE, BRAND2=V_GREEN, BLUE='#2557D6', RED='#EA4335', YELLOW=V_GOLD, PURPLE='#7A5AF8', AMBER='#B7791F', GRAY='#6B7684';
var CALL_PREP = { ticker:'V', quarters:[
  // ── UPCOMING: Q3 FY2026 (quarter ending Jun 2026; reports ~late Jul 2026) ──
  { q:'Q3 FY2026', status:'upcoming', date:'reports ~late July 2026',
    setup:{ source:'Bloomberg BST consensus — to import from the export', asOf:null,
      headline:[
        {k:'Net revenue', cons:null, us:null, note:{t:'Guided low double-digit growth',h:'Management guided Q3 FY2026 adjusted net-revenue growth to <b>low double digits</b> — explicitly the <b>lowest-growth quarter of the year</b> (toughest volatility comp + an incentive step-up, partly offset by back-half pricing). Street/Summit figures fill from the Bloomberg export.'}},
        {k:'Operating income', cons:null, us:null},
        {k:'EPS (adjusted)', cons:null, us:null, note:{t:'Guided mid-to-high single digits',h:'Management guided Q3 adjusted EPS growth to <b>mid-to-high single digits</b> — a sharp step down from Q2\'s +20%, on the volatility comp and the incentive step-up.'}},
        {k:'EBITDA', cons:null, us:null},
      ],
      custom:[ {k:null},{k:null},{k:null},{k:null} ], // 4 custom KPIs — to define with Dani (candidates: payments volume · cross-border ex-Europe · processed transactions · VAS revenue)
      marketDebate:{
        fear:'That Q2\'s +17% was a volatility- and incentive-flattered peak — and Q3\'s guided step-down (net rev low-double-digit, EPS mid-to-high-single) confirms the beat does NOT re-rate the run-rate.',
        real:'Consensus models the guided deceleration as mechanical — the toughest volatility comp of the year plus an incentive step-up lapping the Q3\'25 low — with back-half pricing and FIFA-driven marketing services as the offsets. A soft Q3 by design, not a demand crack.',
        mech:[ {k:'Volatility comp',v:'toughest of the year',dir:'down'}, {k:'Incentive growth',v:'step-up (laps Q3\'25 low)',dir:'up'}, {k:'Back-half pricing',v:'kicks in',dir:'up'}, {k:'FIFA marketing services',v:'ramps',dir:'up'} ],
        synth:'The one thing to resolve: is the guided Q3 trough <b>purely optical</b> (comps + timing) with underlying drivers intact — or is any of the deceleration <b>real demand</b> (consumer, cross-border) showing through once the volatility tailwind fades?'
      },
      debate:null },
    watchList:[
      { rank:1, metric:'VAS + CMS — structural or event-inflated?', since:'Q2 FY2026', tags:['vas','cms','marketing-services'],
        pista:'Combined VAS+CMS growth ex-FIFA/Olympics: does it hold the mid-20s, or fade toward the Investor-Day 16–18% frame as the events lap?',
        breaks:'Combined growth decelerates toward low-teens once event-driven marketing services lap — revealing the mid-20s as cyclical, not the new structural rate.',
        seededBy:{ q:'Q2 FY2026', n:'Kupferberg pushed on VAS+CMS running mid-20s vs the ~16–18% Investor-Day frame; Suh declined to guide to pillars and flagged CMS one-time adjustments / deal timing that "won\'t reoccur".' },
        src:'Q2 FY2026: VAS +27% cc (30% of net revenue); CMS +24% cc (highest in recent quarters) — but partly one-time.',
        why:'VAS+CMS is the whole re-rating case: structurally mid-20s makes Visa a faster-growth company than the ID framed; event-inflated leaves the multiple exposed.',
        thread:[ {q:'Q1 FY2026',n:'VAS +18% cc; new-flows/CMS +19% cc.'},{q:'Q2 FY2026',n:'VAS +27% cc; CMS +24% cc — both accelerated, but partly one-time/event.'} ] },
      { rank:2, metric:'Volatility / FX as an earnings crutch', since:'Q2 FY2026', tags:['volatility','cross-border','fx'],
        pista:'International-transaction revenue vs cross-border volume growth: how much of the revenue beat is volatility management itself says normalizes?',
        breaks:'A normalized-volatility quarter exposes core net-revenue growth materially below the reported trend.',
        seededBy:{ q:'Q2 FY2026', n:'Suh named volatility the #1 driver of the Q2 upside (still a YoY drag but better than feared); Q3 assumes volatility back to the original October guide — a tougher comp.' },
        src:'Q2 FY2026: net revenue +17% "largely driven by higher-than-expected volatility"; intl-transaction revenue +10% vs +11% cross-border volume.',
        why:'FX/volatility is the least predictable, lowest-quality part of the revenue algorithm — leaning on it flatters the print and reverses without warning.',
        thread:[ {q:'Q1 FY2026',n:'Intl-transaction revenue better than expected on higher volatility; +14% vs +16% cross-border volume.'},{q:'Q2 FY2026',n:'Volatility again the top beat driver; guided lower into Q3.'} ] },
      { rank:3, metric:'Stablecoin & agentic — the first real economics', since:'Q2 FY2026', tags:['stablecoin','agentic','new-flows'],
        pista:'Any quantification at all — take rate, revenue, or margin — on stablecoin rails / agentic transactions, vs the current "similar economics to today\'s products" assertion.',
        breaks:'First disclosed economics show a take rate structurally below card economics — the volume is real but dilutive.',
        seededBy:{ q:'Q2 FY2026', n:'Matt O\'Neill asked directly whether stablecoin/agentic transactions are accretive/dilutive; Ryan only asserted "very similar economics to the products we have today" — no numbers.' },
        src:'Q2 FY2026: stablecoin card volume +~200% YoY; $7B stablecoin settlement run-rate (+50% QoQ, 9 blockchains); Visa CLI / Intelligent Commerce Connect launched — all narrative, no economics.',
        why:'The bull case treats agentic/stablecoin as pure TAM expansion; if the unit economics are dilutive, a rising volume mix could pressure yield rather than lift it.',
        thread:[ {q:'Q1 FY2026',n:'X Money on Visa Direct; A2A/stablecoin framed as opportunity, not threat.'},{q:'Q2 FY2026',n:'Economics asked, deflected; 160+ stablecoin card programs.'} ] },
      { rank:4, metric:'Incentive trajectory (net-yield pressure)', since:'Q2 FY2026', tags:['incentives','renewals'],
        pista:'Client-incentive growth vs the guided "step-up" — does it run hotter than framed, pressuring net-revenue yield?',
        breaks:'Incentive growth materially exceeds the guided step-up, compressing net yield beyond what pricing offsets.',
        seededBy:{ q:'Q2 FY2026', n:'Incentives grew 14% in Q2 — BELOW plan (deal timing / performance adjustments); Suh guided a step-up into Q3 as it laps the Q3\'25 low point.' },
        src:'Q2 FY2026: client incentives +14%, "lower than expectations"; Q3 flagged as the step-up quarter.',
        why:'Incentives are the contra-revenue competitive renewals drive — a persistent step-up signals pricing given away to keep portfolios.',
        thread:[ {q:'Q1 FY2026',n:'Incentives +13%, a strong renewal quarter.'},{q:'Q2 FY2026',n:'Incentives +14%, below plan; Q3 step-up guided.'} ] },
      { rank:5, metric:'US consumer + cross-border into FIFA', since:'Q2 FY2026', tags:['consumer','cross-border','travel'],
        pista:'Does the FIFA World Cup actually lift US + LatAm inbound travel as guided, offsetting the Middle-East / CEMEA drag?',
        breaks:'Inbound travel doesn\'t materialize and cross-border decelerates below ~9–10% cc.',
        seededBy:{ q:'Q2 FY2026', n:'Management built the H2 cross-border guide on FIFA-driven US + LatAm inbound travel and lapping low prior-year US inbound — an assumption, not yet a result.' },
        src:'Q2 FY2026: CEMEA payments volume −2.5pts on the Middle-East conflict; April cross-border +9% (Ramadan-distorted); FIFA <45 days out.',
        why:'Cross-border ex-Europe is the highest-yield line; the H2 guide leans on an event-driven inbound recovery that has to show up in the numbers.',
        thread:[ {q:'Q1 FY2026',n:'Cross-border +16% cc, strong holiday + travel.'},{q:'Q2 FY2026',n:'Cross-border +11% cc; Middle-East drag; FIFA recovery assumed for H2.'} ] },
    ],
    results:null, call:null },

  // ── REPORTED: Q2 FY2026 (quarter ended Mar 2026; reported Apr 28 2026) ──
  { q:'Q2 FY2026', status:'reported', date:'April 28, 2026',
    setup:{ source:'Bloomberg BST consensus (archived) — precise figures to backfill',
      pricedIn:'A solid-but-unspectacular quarter: high-single/low-double-digit net-revenue growth, payments volume ~9% cc, cross-border decelerating modestly, VAS the bright spot. FX/volatility a swing factor; the Middle-East a known regional drag.',
      oneLiner:'The bar was "steady payments + strong VAS, watch cross-border and FX" — Visa cleared it by a mile on volatility + VAS + light incentives.' },
    watchList:[
      { rank:1, metric:'VAS growth durability', since:'Q1 FY2026', tags:['vas','marketing-services'],
        pista:'Can VAS sustain high-teens+ cc, and how much is event-driven (Olympics/FIFA)?', breaks:'VAS decelerates toward mid-teens with no offsetting acceleration in core payments.',
        seededBy:{ q:'Q1 FY2026', n:'Sakhrani asked whether VAS (28% growth cited) can sustain; Ryan walked the three buckets but gave no durability number.' },
        src:'Q1 FY2026: VAS +18% cc, ~30% of net revenue.', why:'The diversifier and the multiple support.' },
      { rank:2, metric:'Cross-border resilience vs macro/geopolitics', since:'Q1 FY2026', tags:['cross-border','travel','consumer'],
        pista:'Does cross-border ex-Europe hold double digits despite the Middle-East and FX?', breaks:'Cross-border volume growth drops below ~10% cc on travel weakness.',
        seededBy:{ q:'Q1 FY2026', n:'Q1 cross-border ran +16% cc on holiday + strong dollar; the question into Q2 was whether that pace holds as those tailwinds fade.' },
        src:'Q1 FY2026: cross-border +16% cc, 3pts above Q4.', why:'Highest-yield revenue line and the consumer-health pulse.' },
      { rank:3, metric:'US consumer health / spend bands', since:'Q1 FY2026', tags:['consumer'],
        pista:'Any sign the lower-spend consumer is weakening?', breaks:'Management flags softening in lower spend bands or discretionary categories.',
        seededBy:{ q:'Q1 FY2026', n:'Q1 leaned on a strong holiday season; the standing question is whether the consumer holds as the comp normalizes.' },
        src:'Q1 FY2026: US payments volume +7%, strong holiday season.', why:'The demand base under the whole model.' },
      { rank:4, metric:'Incentives / renewal intensity', since:'Q1 FY2026', tags:['incentives','renewals'],
        pista:'Does incentive growth stay contained relative to net revenue?', breaks:'Incentives grow well ahead of net revenue, compressing yield.',
        seededBy:{ q:'Q1 FY2026', n:'Q1 incentives +13% on a strong renewal quarter; watch whether the renewal cycle keeps contra-revenue contained.' },
        src:'Q1 FY2026: incentives +13% on a strong renewal quarter.', why:'Contra-revenue that competitive dynamics drive.' },
      { rank:5, metric:'CMS / new-flows momentum', since:'Q1 FY2026', tags:['cms','new-flows'],
        pista:'Does Visa Direct + commercial keep compounding well ahead of the network?', breaks:'New-flows revenue growth decelerates toward the network rate.',
        seededBy:{ q:'Q1 FY2026', n:'Q1 new-flows +19% cc with Visa Direct +34%; the question into Q2 was whether the greenfield keeps compounding.' },
        src:'Q1 FY2026: new-flows +19% cc; Visa Direct transactions +34%.', why:'The ~$200T greenfield the growth story leans on.' },
    ],
    results:{
      headline:'A blowout on composition, not volume: net revenue +17% to $11.2B and EPS +20% to $3.31 — the strongest revenue growth since 2013 ex-pandemic/Visa-Europe — but driven by volatility, VAS, and light incentives, all of which management guided lower into Q3.',
      thesisCheck:[
        {line:'VAS as the growth engine (high-teens+ cc)', tripped:false, note:'Beat and accelerated — VAS +27% cc, now 30% of net revenue; confirmed, not debatable.'},
        {line:'Cross-border ex-Europe holds double digits', tripped:false, note:'+11% cc, consistent with Q1 despite the Middle-East drag; held.'},
        {line:'US consumer stable across spend bands', tripped:false, note:'"We do not see signs of the lower-spend consumer weakening"; the highest band grew fastest — held.'},
        {line:'Incentives contained vs net revenue', tripped:false, note:'+14%, below plan — held this quarter, but a Q3 step-up is guided (watch).'},
      ],
      scorecard:[
        {metric:'Net revenue', cons:null, actual:'$11.2B (+17%)', result:'beat', surprise:85, watchRank:null, note:{t:'Largest revenue upside in 3–4 years',h:'Tien-Tsin Huang called it the largest revenue upside in three-to-four years. Driven by volatility, VAS network products, and lower incentives — Suh flagged all three as not fully repeatable into Q3.'}},
        {metric:'EPS (adjusted)', cons:null, actual:'$3.31 (+20%)', result:'beat', surprise:80, watchRank:null},
        {metric:'Value-added services revenue', cons:null, actual:'$3.3B (+27% cc)', result:'beat', surprise:70, watchRank:1, note:{t:'Now 30% of net revenue',h:'Better than expected on greater demand for network products (issuers/acquirers) and marketing services. Framed as durable (linked to transactions/cards/accounts + AI).'}},
        {metric:'CMS / new-flows revenue', cons:null, actual:'+24% cc', result:'beat', surprise:65, watchRank:5, note:{t:'Highest in recent quarters — but one-time-aided',h:'Suh: outperformance partly from performance adjustments and deal timing plus pricing; "we don\'t anticipate some of those one-time items to reoccur."'}},
        {metric:'Client incentives', cons:null, actual:'+14% (below plan)', result:'beat', surprise:55, watchRank:4, note:{t:'A tailwind to net revenue',h:'Lower than expected on deal timing / performance adjustments — a positive to net revenue this quarter, but a Q3 step-up is guided.'}},
        {metric:'Payments volume (cc)', cons:null, actual:'+9%', result:'inline', surprise:20, watchRank:null},
        {metric:'Cross-border volume ex-Europe (cc)', cons:null, actual:'+11%', result:'inline', surprise:25, watchRank:2, note:{t:'Held despite the Middle-East',h:'Consistent with Q1; e-commerce +13% offset travel +10%; CEMEA −2.5pts on the conflict.'}},
        {metric:'Processed transactions', cons:null, actual:'+9%', result:'inline', surprise:15, watchRank:null},
        {metric:'Q3 EPS guide', cons:null, actual:'mid-to-high single-digit growth', result:'nocons', surprise:75, watchRank:null, note:{t:'The real news in the print',h:'Guided the lowest-growth quarter of the year — a sharp step-down from +20% — on the volatility comp and incentive step-up, with back-half pricing the partial offset. This reset, not the beat, moves the forward model.'}},
      ],
      intoCall:[
        'Is the mid-20s VAS+CMS pace structural or event-inflated (FIFA/Olympics + one-timers)?',
        'How much of the +17% is volatility that reverses — what is the clean underlying growth?',
        'Any economics at all on stablecoin/agentic, or still "similar to today\'s products"?',
      ],
      priceReaction:'to fill from a trusted source' },
    call:{
      take:'A genuinely strong quarter whose <b>composition</b> is the story: the +17%/+20% beat leaned on higher volatility, VAS network-product demand, and light incentives — and management guided Q3 to the year\'s lowest growth as those tailwinds fade. Read it as a <b>quality-of-mix</b> print (VAS now 30% of revenue, CMS cross-border at a record share), not a run-rate reset.',
      highlights:[
        { tag:'thesis', band:'lead', head:'VAS+CMS is running <b>mid-20s</b> vs the Investor-Day <b>16–18%</b> frame — and that gap is the debate, not the number.',
          open:'Structural or event-inflated? Suh declined to guide to pillars and flagged CMS one-time adjustments / deal timing that "won\'t reoccur" — so the durable rate is unproven.',
          detail:'<p>Jason Kupferberg (Wells Fargo) asked directly whether the medium-term VAS+CMS frame (16–18% at the 2024 Investor Day) should be recalibrated given mid-20s prints. Suh: "we don\'t guide to growth pillars," praised execution, but volunteered that Q2 CMS +24% included <b>performance adjustments and deal timing</b> plus pricing that <b>won\'t recur</b>.</p><p>So the number is real but its <b>durability is asserted, not shown</b>: the structural piece (network products, the marketing-services flywheel, AI fraud models at up-to-5x value capture) looks durable; the cyclical piece (Olympics/FIFA, deal timing) does not.</p>' },
        { tag:'curious', band:'lead', head:'Stablecoin & agentic: a big TAM narrative with <b>zero disclosed economics</b>.',
          open:'Accretive or dilutive? Ryan would only say "very similar economics to the products we have today" — an assertion with no take rate, revenue, or margin behind it.',
          detail:'<p>Matt O\'Neill (BofA) asked for the "top-of-the-house unit-economic view" on stablecoin/agentic. Ryan reframed to the "hyperscaling bridge layer" and asserted the economics "look just like our normal products" (the Argentina stablecoin-linked Visa debit example) — but disclosed <b>no numbers</b>.</p><p>The volume signals are loud: stablecoin card volume <b>+~200% YoY</b>, 160+ stablecoin card programs, a <b>$7B settlement run-rate (+50% QoQ)</b> across 9 blockchains, Visa CLI positioned as "a commerce platform." The question the bull case skips: are agentic micro-transactions and stablecoin rails <b>margin-accretive, or a defensive land-grab</b>?</p>' },
        { tag:'thesis', band:'context', head:'Record <b>$7.9B buyback</b> (largest in Visa history) + new <b>$20B</b> authorization → ~$33B capacity.',
          detail:'<p>Highest quarterly buyback ever; the board authorized a new $20B multi-year program in April. Confirms the capital-return leg of the thesis — settled, nothing to argue.</p>' },
        { tag:'thesis', band:'context', head:'<b>Wells Fargo → Pismo</b> core-banking migration validates the acquisition thesis.',
          detail:'<p>Wells Fargo agreed to migrate to Pismo\'s core account ledger. McInerney: the two Pismo theses (platform modernization + cloud-native issuer processing for geo expansion) are "both playing out." Reported as VAS / other revenue (Suh confirmed).</p>' },
        { tag:'thesis', band:'context', head:'US consumer resilient — "we do not see signs of the lower-spend consumer weakening."',
          detail:'<p>US payments volume +8% (up ~1.5pts from Q1); credit +10%, debit +7%; the highest spend band grew fastest; tax-refund help. Confirms the demand base; not debatable.</p>' },
        { tag:'watch', band:'logged', head:'Middle-East / CEMEA <b>−2.5pts</b> payments-volume growth; Ramadan distorts cross-border optics.',
          detail:'<p>CEMEA (~6% of volume) stepped down ~2.5pts on the conflict; April cross-border ticked to +9% but "normalizes to February levels" ex-Ramadan. Offset by US/LatAm strength — tracked, not meeting material.</p>' },
        { tag:'curious', band:'logged', head:'Agentic framed as a four-way TAM expander (microtransactions, B2B, +80–150bps GDP).',
          detail:'<p>Ryan\'s agentic thesis: accelerates digitization, multiplies transactions (agents split purchases; pay-per-resource microtransactions), digitizes B2B, and lifts GDP. Network + security + trust as the moat. Strategic color — no numbers yet.</p>' },
        { tag:'watch', band:'logged', head:'AmEx took agent-fraud liability (three-party); how does a four-party network match it?',
          detail:'<p>Craig Maurer (FT Partners) noted AmEx assuming fraudulent-agent risk and asked how Visa achieves the same across issuers. Ryan: "if a Visa cardholder experiences fraud, they\'re going to be protected"; authenticated tokens + richer agentic data reduce fraud; rules "evolve with full buy-in." A competitive-response item to track.</p>' },
      ],
      dots:'The three drivers of the beat — <b>volatility, VAS network products, and light incentives</b> — are exactly the three Suh guided <b>lower</b> into Q3. Meanwhile the two loudest strategic narratives (stablecoin/agentic and mid-20s VAS+CMS) are the two with the <b>least disclosure</b>: huge volume/growth numbers, no economics or durability proof. The print rewards the model; the <b>next</b> print tests whether the story has numbers behind it.',
      threeMinutes:[
        '<b>The +17% is real but front-loaded by things Visa itself guided lower.</b> Volatility, VAS network-product demand, and below-plan incentives drove the upside; Q3 is guided to mid-to-high-single-digit EPS growth — the lowest of the year — on tougher volatility comps and an incentive step-up. Read the beat as quality-of-mix (VAS now 30% of revenue), not a run-rate reset.',
        '<b>VAS+CMS running mid-20s vs the ~16–18% Investor-Day frame is the debate, not the headline.</b> Suh won\'t guide to it and flagged CMS one-timers; the structural piece (network products, the marketing flywheel, AI fraud at up-to-5x value capture) looks durable, the cyclical piece (Olympics/FIFA, deal timing) doesn\'t. Watch whether mid-20s survives once the events lap.',
        '<b>Stablecoin/agentic is a genuine TAM story with zero disclosed economics.</b> +~200% stablecoin card volume, a $7B settlement run-rate, Visa CLI as a "commerce platform" — but pushed on accretive-vs-dilutive, management only asserts "economics like today\'s products." Treat as optionality, not a model input, until they quantify it.',
      ],
      notBringing:[
        {item:'Middle-East / CEMEA drag', why:'Real but ~6% of volume and offset by US/LatAm inbound + FIFA; not thesis-moving.'},
        {item:'Payments nationalism / Europe (Wero, digital euro)', why:'Long-standing; management "expects more competition, not less," with no near-term model impact.'},
        {item:'Record $7.9B buyback', why:'Confirms capital return, but it\'s settled and everyone has the release — not a debate.'},
      ],
      newQuestions:[
        {n:'Is the mid-20s VAS+CMS pace structural or event-inflated once FIFA/Olympics lap?', landed:{q:'Q3 FY2026', rank:1}},
        {n:'How much of the reported growth is volatility that reverses — what is the clean underlying rate?', landed:{q:'Q3 FY2026', rank:2}},
        {n:'Any first economics on stablecoin/agentic rails, or still "similar to today\'s products"?', landed:{q:'Q3 FY2026', rank:3}},
        {n:'Does the guided Q3 incentive step-up run hotter than framed?', landed:{q:'Q3 FY2026', rank:4}},
        {n:'Does FIFA actually lift US/LatAm inbound travel to offset the Middle-East?', landed:{q:'Q3 FY2026', rank:5}},
      ] } },

  // ── REPORTED: Q1 FY2026 (quarter ended Dec 2025; reported Jan 29 2026) ──
  { q:'Q1 FY2026', status:'reported', date:'January 29, 2026',
    setup:{ source:'Bloomberg BST consensus (archived) — precise figures to backfill',
      pricedIn:'A steady start to FY26: net revenue high-single/low-double digits, payments volume improving from Q4, cross-border healthy, VAS ~high-teens. FX a modest drag; all eyes on the February Investor Day.',
      oneLiner:'The bar was "solid drivers + VAS, and set up the Investor Day" — Visa beat on revenue and EPS with a lower tax rate, then nudged the FY guide to low-double-digits.' },
    watchList:[
      { rank:1, metric:'VAS sustainability (can high-teens hold?)', since:'Q4 FY2025', tags:['vas'],
        pista:'Does VAS hold high-teens cc as it laps tougher comps?', breaks:'VAS decelerates below mid-teens.',
        src:'Q4 FY2025: VAS growth in the high-teens/20s cc.', why:'The fastest-growing, least-regulated revenue line.' },
      { rank:2, metric:'Cross-border ex-Europe trend', since:'Q4 FY2025', tags:['cross-border','travel'],
        pista:'Does cross-border re-accelerate on holiday travel + e-commerce?', breaks:'Cross-border volume growth slips below low-double-digits cc.',
        src:'Q4 FY2025: cross-border in the low-teens cc.', why:'Highest-yield line; consumer pulse.' },
      { rank:3, metric:'Commercial / new-flows growth', since:'Q4 FY2025', tags:['cms','new-flows'],
        pista:'Does commercial volume growth improve off a soft Q4?', breaks:'Commercial volume growth stalls in low-single-digits.',
        src:'Q4 FY2025: commercial ~5% with a days-mix headwind.', why:'The new-flows greenfield.' },
      { rank:4, metric:'US consumer / holiday spend', since:'Q4 FY2025', tags:['consumer'],
        pista:'How strong is the Nov–Dec holiday season?', breaks:'Holiday spend growth decelerates vs last year.',
        src:'Q4 FY2025: US payments volume ~5%.', why:'The base of the model.' },
      { rank:5, metric:'Investor-Day setup / FY guide', since:'Q4 FY2025', tags:['guidance'],
        pista:'Does the FY26 framing and February Investor Day reset the growth algorithm?', breaks:'Guide cut or framework walked back.',
        src:'FY26 initial guide: net revenue high-single/low-double digits.', why:'The medium-term multiple depends on the ID framework.' },
    ],
    results:{
      headline:'A clean beat to open FY26: net revenue +10% to $9.5B (+11% cc), EPS +14% to $2.75 — helped by strong international-transaction revenue, VAS +18% cc, and a lower tax rate; the FY revenue guide nudged to low-double-digits.',
      thesisCheck:[
        {line:'VAS holds high-teens cc', tripped:false, note:'VAS +18% cc — held.'},
        {line:'Cross-border ex-Europe double digits', tripped:false, note:'+16% cc, 3pts above Q4 — held strongly on holiday + travel.'},
        {line:'US consumer / holiday strong', tripped:false, note:'US payments volume +7%, up 2pts from Q4 on a strong holiday season — held.'},
        {line:'Commercial improves off Q4', tripped:false, note:'Commercial +6% cc, +1pt from Q4 on favorable days mix — held (modestly).'},
      ],
      scorecard:[
        {metric:'Net revenue', cons:null, actual:'$9.5B (+10%; +11% cc)', result:'beat', surprise:60, watchRank:null, note:{t:'Above management\'s own expectations',h:'"Higher than our expectations, primarily due to strong international-transaction revenue and value-added-services revenue."'}},
        {metric:'EPS (adjusted)', cons:null, actual:'$2.75 (+14%)', result:'beat', surprise:60, watchRank:null, note:{t:'Revenue + lower tax',h:'Beat on revenue outperformance and a lower-than-expected 17.7% tax rate.'}},
        {metric:'Cross-border volume ex-Europe (cc)', cons:null, actual:'+16%', result:'beat', surprise:55, watchRank:2, note:{t:'3pts above Q4',h:'E-commerce +16% and travel +16%; strong holiday + strong dollar helped US outbound.'}},
        {metric:'Value-added services revenue', cons:null, actual:'$2.4B (+18% cc)', result:'beat', surprise:45, watchRank:1},
        {metric:'New-flows revenue', cons:null, actual:'+19% cc', result:'beat', surprise:45, watchRank:3, note:{t:'Visa Direct +34%',h:'Better-than-expected commercial cross-border across all regions; Visa Direct transactions +34% YoY.'}},
        {metric:'US payments volume (cc)', cons:null, actual:'+7%', result:'inline', surprise:25, watchRank:4},
        {metric:'Payments volume (cc)', cons:null, actual:'+9%', result:'inline', surprise:20, watchRank:null},
        {metric:'Asia-Pacific volume (cc)', cons:null, actual:'~+1%', result:'miss', surprise:40, watchRank:null, note:{t:'The one soft spot',h:'AP just above 1% on China macro; management: moving the right direction but still muted.'}},
        {metric:'FY26 net-revenue guide', cons:null, actual:'raised to low-double-digits', result:'nocons', surprise:50, watchRank:5, note:{t:'Nudged up',h:'FY guide moved to low-double-digit adjusted net-revenue growth; EPS growth to low-teens on a lower tax rate.'}},
      ],
      intoCall:[
        'Can VAS/CMS sustain the pace into the Investor-Day framework?',
        'Is Asia-Pacific (China) a structural drag or a macro-timing issue?',
        'How much of the revenue beat is FX/volatility vs. underlying drivers?',
      ],
      priceReaction:'to fill from a trusted source' },
    call:{
      take:'A clean, high-quality open to FY26 — the beat was <b>broad-based</b> (international-transaction revenue + VAS + a lower tax rate), not one-line — and management set up the February Investor Day by nudging the FY guide up. The one blemish was <b>Asia-Pacific (~+1%)</b> on China macro.',
      highlights:[
        { tag:'thesis', band:'lead', head:'VAS sustainability pushed — can high-teens+ cc hold?',
          open:'Suh gave no multi-year recalibration ("we don\'t guide to pillars"); durability asserted via broad-based execution, not quantified.',
          detail:'<p>Sanjay Sakhrani (KBW) asked whether VAS growth can sustain; Ryan walked the three buckets (enhance Visa payments / enable all payments / go beyond payments) and a broader TAM, but gave no explicit durability number. VAS +18% cc this quarter.</p>' },
        { tag:'watch', band:'context', head:'Asia-Pacific the soft spot at ~+1% cc on China macro.',
          detail:'<p>Twice-flagged: AP just above 1%, moderately up from Q4 but "still somewhat muted," driven largely by China macro. Framed as macro, not structural — worth tracking.</p>' },
        { tag:'thesis', band:'context', head:'Restructuring charge ($213M severance) taken and inside the FY guide.',
          detail:'<p>Q1 GAAP included $213M severance to "focus investment on the highest-growth opportunities." Suh: reflected in the FY guide, no further charge expected this year.</p>' },
        { tag:'thesis', band:'context', head:'Cross-border +16% cc, 3pts above Q4 on holiday + strong dollar.',
          detail:'<p>Both e-commerce and travel cross-border +16%; US outbound helped by the strong dollar; the highest-yield line re-accelerated.</p>' },
        { tag:'curious', band:'logged', head:'X Money on Visa Direct — a 600M+ MAU funding rail.',
          detail:'<p>Tien-Tsin Huang asked on ramp/economics; Ryan positioned Visa Direct as the "best money-movement platform for developers," X Money built on it. Early; a data point in the fintech-rails thread.</p>' },
        { tag:'watch', band:'logged', head:'Regulatory: CCCA reintroduced — "very harmful and not needed."',
          detail:'<p>Will Nance (Goldman) asked on CCCA; Ryan: engaged on the Hill, educating officials on competition (crypto, stablecoins, BNPL, A2A) and the harm (reduced credit access, rewards, security). A standing legislative overhang.</p>' },
      ],
      dots:'The quality of the Q1 beat (broad-based, lower tax, guide nudged up) set up the February Investor Day well — but the two forward tensions it planted, <b>VAS durability</b> and <b>Asia-Pacific</b>, carried into Q2, where VAS accelerated (resolving the first, for now) and China improved.',
      threeMinutes:[
        '<b>Clean, broad-based open to FY26.</b> Net revenue +10% ($9.5B) and EPS +14% ($2.75) beat on international-transaction revenue, VAS +18% cc, and a lower 17.7% tax rate — not a single line — and management nudged the FY guide to low-double-digits ahead of the Investor Day.',
        '<b>Asia-Pacific is the one soft spot</b> at ~+1% cc on China macro — flagged twice, framed as macro not structural. Worth watching whether it inflects.',
        '<b>VAS durability is the live question</b> — +18% cc but management won\'t guide to pillars; the bull case needs it to hold high-teens as comps toughen.',
      ],
      notBringing:[
        {item:'$213M restructuring charge', why:'One-time, inside the guide, no further charge expected — not thesis-moving.'},
        {item:'CCCA / regulatory', why:'Standing overhang, no near-term resolution or model impact.'},
      ],
      newQuestions:[
        {n:'Can VAS hold high-teens+ cc as comps toughen?', landed:{q:'Q2 FY2026', rank:1}},
        {n:'Does cross-border ex-Europe hold double digits vs macro/FX?', landed:{q:'Q2 FY2026', rank:2}},
        {n:'Is the US consumer still healthy across spend bands?', landed:{q:'Q2 FY2026', rank:3}},
        {n:'Do client incentives stay contained through the renewal cycle?', landed:{q:'Q2 FY2026', rank:4}},
        {n:'Does CMS / new-flows keep compounding ahead of the network?', landed:{q:'Q2 FY2026', rank:5}},
      ] } },
]};
function cpUpcoming(){ return CALL_PREP.quarters.filter(function(q){ return q.status==='upcoming'; })[0]||null; }
function cpFill(x, muted){ return (x!=null && String(x).trim()!=='') ? x : '<span class="cp-empty">'+(muted||'— to fill')+'</span>'; }
var CP_POP={};
function cpReg(id, t, h){ CP_POP[id]={t:t, h:h}; return id; }
function cpQ(id, t, h){ return '<span class="cp-info ov-clickable" data-detail="cp:'+cpReg(id,t,h)+'" title="'+esc(String(t).replace(/<[^>]+>/g,''))+'">?</span>'; }
function cpStyle(){
  return '<style>.cp-note{font-size:11px;color:var(--mu);line-height:1.5;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;margin:0 0 12px}'+
    '.cp-phtabs{display:inline-flex;gap:3px;background:rgba(26,31,113,0.06);border:1px solid var(--bdr);border-radius:9px;padding:4px;margin:0 0 20px}'+
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
    '.cp-wl-addform{display:flex;flex-direction:column;gap:7px;border:1px dashed '+BRAND+';border-radius:10px;padding:12px;margin:0 0 12px;background:rgba(26,31,113,0.03)}'+
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
    '.cp-banner{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:11px;padding:13px 15px;background:linear-gradient(180deg,rgba(26,31,113,0.05),transparent);font-size:12.5px;line-height:1.6;color:var(--navy);margin:12px 0}'+
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
    '.cp-synth{border-left:4px solid var(--navy);background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:6px 0}.cp-synth b{color:#F7B600}'+
    '.cp-why-btn{display:inline-block;font-size:10px;font-weight:800;color:'+BLUE+';cursor:pointer;margin-top:8px}'+
    '.cp-w-chips{display:flex;gap:7px;flex-wrap:wrap;margin:6px 0 0}'+
    '.cp-w-chip{font-size:10px;font-weight:700;border-radius:7px;padding:4px 9px;line-height:1.3}'+
    '.cp-w-chip.cons{background:rgba(37,87,214,0.08);border:1px solid rgba(37,87,214,0.28);color:var(--navy)}'+
    '.cp-w-chip.red{background:rgba(234,67,53,0.06);border:1px solid rgba(234,67,53,0.28);color:var(--navy)}'+
    '.cp-w-chip b{font-weight:800}'+
    '.cp-take{border-left:4px solid '+BRAND+';background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:2px 0 14px}.cp-take b{color:#F7B600}'+
    '.cp-hl{display:flex;flex-direction:column;gap:8px}'+
    '.cp-hl-row{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--hc);border-radius:10px;padding:10px 13px;background:var(--w);cursor:pointer;transition:.12s}'+
    '.cp-hl-row:hover{box-shadow:0 3px 10px rgba(0,0,0,.08)}'+
    '.cp-hl-tag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:var(--hc);border-radius:20px;padding:3px 9px;white-space:nowrap}'+
    '.cp-hl-head{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.cp-hl-more{font-size:15px;color:var(--hc);font-weight:800}'+
    '@media(max-width:560px){.cp-hl-row{grid-template-columns:auto 1fr}.cp-hl-more{display:none}}'+
    '.cp-dots{border:1px dashed '+BRAND+';border-radius:11px;padding:12px 15px;margin-top:14px;background:rgba(26,31,113,0.03);font-size:12px;line-height:1.6;color:var(--navy)}.cp-dots b{color:'+BRAND+'}'+
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
    '.cp-sc-rk{font-size:9px;font-weight:800;color:'+BRAND+';background:rgba(26,31,113,0.10);border:1px solid rgba(26,31,113,0.3);border-radius:20px;padding:2px 8px;white-space:nowrap;text-align:center}'+
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
    '.cp-3m{border:1px solid var(--bdr);border-top:4px solid '+BRAND+';border-radius:12px;padding:15px 17px;margin:16px 0 0;background:linear-gradient(180deg,rgba(26,31,113,0.05),transparent)}'+
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
var CP_IR_URL='https://investor.visa.com/financial-information/quarterly-earnings/';
var CP_EDGAR_URL='https://www.sec.gov/edgar/browse/?CIK=1403161&owner=exclude';
var CP_LOGO_URL='https://assets.parqet.com/logos/symbol/V';
var CP_SEC_SEAL='img/sec-seal.png';
function cpIRButton(){
  return '<style>'+
    '.cp-srcrow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 16px}@media(max-width:760px){.cp-srcrow{grid-template-columns:1fr}}'+
    '.cp-ir{display:flex;align-items:center;gap:20px;text-decoration:none;border-radius:18px;padding:26px 26px;min-height:120px;position:relative;overflow:hidden;'+
      'background:linear-gradient(115deg,#04060B 0%,#0A1024 60%,#04060B 100%);border:1px solid rgba(26,31,113,.4);box-shadow:0 10px 32px rgba(0,0,0,.4);transition:.18s}'+
    '.cp-ir:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,'+BRAND+','+BLUE+','+YELLOW+','+BRAND2+');height:4px;top:0}'+
    '.cp-ir:hover{transform:translateY(-2px);box-shadow:0 16px 42px rgba(26,31,113,.45);border-color:rgba(26,31,113,.85)}'+
    '.cp-ir-wm{position:absolute;right:-40px;bottom:-60px;width:230px;height:230px;object-fit:contain;opacity:.09;pointer-events:none;transition:.25s}'+
    '.cp-ir:hover .cp-ir-wm{opacity:.16;transform:scale(1.04) rotate(-2deg)}'+
    '.cp-ir-ic{width:72px;height:72px;border-radius:18px;background:transparent;display:flex;align-items:center;justify-content:center;flex:none;position:relative;z-index:1;'+
      'box-shadow:0 0 0 1px rgba(247,182,0,.35),0 0 32px rgba(26,31,113,.6)}'+
    '.cp-ir-ic img{width:52px;height:52px;object-fit:contain;display:block}'+
    '.cp-ir-body{flex:1;min-width:0;position:relative;z-index:1}'+
    '.cp-ir-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:#F7B600;display:flex;align-items:center;gap:7px}'+
    '.cp-ir-dot{width:7px;height:7px;border-radius:50%;background:'+BRAND2+';box-shadow:0 0 0 0 rgba(22,163,74,.7);animation:cpirp 1.6s infinite}'+
    '@keyframes cpirp{0%{box-shadow:0 0 0 0 rgba(22,163,74,.6)}70%{box-shadow:0 0 0 8px rgba(22,163,74,0)}100%{box-shadow:0 0 0 0 rgba(22,163,74,0)}}'+
    '.cp-ir-t{font-size:19px;font-weight:900;color:#fff;letter-spacing:.05em;text-transform:uppercase;margin-top:4px}'+
    '.cp-ir-s{font-size:11.5px;color:#9FB0C8;font-weight:600;margin-top:3px;letter-spacing:.01em}'+
    '.cp-ir-go{font-size:13px;font-weight:900;color:#fff;background:'+BRAND+';border-radius:999px;padding:12px 22px;white-space:nowrap;flex:none;display:flex;align-items:center;gap:8px;position:relative;z-index:1;letter-spacing:.04em;transition:.14s}'+
    '.cp-ir:hover .cp-ir-go{gap:12px;box-shadow:0 4px 18px rgba(26,31,113,.6)}'+
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
    '<span class="cp-ir-ic"><img src="'+CP_LOGO_URL+'" alt="Visa logo" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="cp-ir-body">'+
      '<span class="cp-ir-k"><span class="cp-ir-dot"></span>THE SOURCE · EARNINGS HQ</span>'+
      '<span class="cp-ir-t" style="display:block">Visa Investor Relations</span>'+
      '<span class="cp-ir-s" style="display:block">Release · webcast · slides · transcripts — straight from investor.visa.com. Skip the search, go direct.</span>'+
    '</span>'+
    '<span class="cp-ir-go">OPEN IR <span>↗</span></span>'+
  '</a>'+
  '<a class="cp-ir edgar" href="'+CP_EDGAR_URL+'" target="_blank" rel="noopener">'+
    '<img class="cp-ir-wm" src="'+CP_SEC_SEAL+'" alt="" aria-hidden="true">'+
    '<span class="cp-ir-ic"><img src="'+CP_SEC_SEAL+'" alt="SEC seal" onerror="this.parentNode.style.display=\'none\'"></span>'+
    '<span class="cp-ir-body">'+
      '<span class="cp-ir-k"><span class="cp-ir-dot"></span>THE RECORD · U.S. SECURITIES AND EXCHANGE COMMISSION</span>'+
      '<span class="cp-ir-t" style="display:block">Visa on EDGAR</span>'+
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
      b+='<div class="cp-row-cap" style="margin-top:12px">Custom KPIs — Visa</div>';
      b+='<div class="cp-grid4">'+cu.map(function(m,i){ return cpEvCell('cu-'+qk+'-'+i, m, true); }).join('')+'</div>';
      b+='</div>';
      b+='<div class="ave-subh-note" style="margin-top:6px">Green = YoY. <b>Street</b> = Bloomberg (BST) consensus, hardcoded from the team\'s export only. <b>Summit</b> = our own expectation (Visa is not in the Summit DCF universe → to fill). <b>?</b> = a number with a caveat worth knowing.</div>';
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
    (qLabel?'<span class="ov-chip" style="font-size:9.5px;background:rgba(26,31,113,0.10);color:'+BRAND+';border-radius:20px;padding:2px 9px;font-weight:800;flex:none">'+esc(qLabel)+'</span>':'')+
    (why?'<span class="cp-why-btn ov-clickable" data-detail="cp:'+why+'" style="margin:0">why'+(w.thread?' + the thread':'')+' ›</span>':'')+'</div>'+
    '<div class="cp-w-q"><span class="mic">🔎</span><span>'+cpFill(w.pista||w.question)+'</span></div>'+
    '<div class="cp-w-chips">'+
      (w.tags&&w.tags.length?w.tags.map(function(t){ return '<span class="cp-w-chip" style="background:rgba(122,90,248,0.08);border:1px solid rgba(122,90,248,0.3);color:var(--navy)">#'+esc(t)+'</span>'; }).join(''):'')+
      (w.since?'<span class="cp-w-chip" style="background:rgba(247,182,0,0.14);border:1px solid rgba(183,121,31,0.35);color:var(--navy)"><b>Tracking since:</b> '+esc(w.since)+'</span>':'')+
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
  // v3.0: the Watch List is the shared, persistent, Supabase-backed engine (js/watchlist.js).
  // The per-quarter cards, tag filter, add-form and cross-quarter view are all owned by the engine
  // now — we just render the mount host and wire it in wireCallPrep(). Seed: sql/014_visa_themes_seed.sql.
  h+='<div data-wlmount></div>';
  // ── FUSED (v2.3): the full multi-year theme record — the former standalone Earnings Calls tab. ──
  h+='<div style="margin-top:26px;border-top:2px solid var(--bdr);padding-top:16px">';
  h+='<div class="cp-band" style="--bc:'+BRAND+'"><span class="cp-band-i">▤</span><span class="cp-band-t">The theme record — every thread, across all calls</span><span class="cp-band-s">the multi-year backbone behind the hunt above (the former "Earnings Calls" tab, folded in)</span><span class="cp-band-l"></span></div>';
  h+=vCallsBody(c);
  h+='</div>';
  return h;
}
var CP_RES={ beat:{c:'#0a8f4c',l:'Beat'}, miss:{c:RED,l:'Miss'}, inline:{c:'#6b7684',l:'In line'},
             nodisc:{c:AMBER,l:'Not disclosed'}, nocons:{c:PURPLE,l:'No consensus'} };
var CP_HLTAG={ thesis:{c:'#0a8f4c',l:'Thesis'}, curious:{c:'#7A5AF8',l:'Curious'}, dots:{c:'#2E6BE6',l:'Connects dots'}, watch:{c:'#B7791F',l:'Watch'}, tone:{c:'#B7791F',l:'Tone'} };
// "Also on the call" — the supplemental colour (v2.8/v2.9): one box, a native <details> per point.
// Thesis-movers (band:'lead') live on the Watch List, so they are filtered out here. Call-derived
// figures (not in BBG) belong HERE as highlights — never in the print tiles / charts.
function cpHighlightsBlock(cc, qk){
  if(!cc||!cc.highlights) return '';
  var hls=cc.highlights.filter(function(x){ return (x.band||'context')!=='lead'; });
  if(!hls.length) return '';
  var rows=hls.map(function(x){
    var det=x.detail||''; if(x.open) det+='<p style="margin-top:8px"><b>Still open:</b> '+x.open+'</p>';
    var tg=CP_HLTAG[x.tag]||{l:x.tag||'',c:GRAY};
    return '<details style="border-bottom:1px solid var(--bdr)"><summary style="display:flex;align-items:center;gap:8px;padding:9px 13px;cursor:pointer;list-style:none;font-size:11.5px;font-weight:600;color:var(--navy);line-height:1.45">'+
      (tg.l?'<span class="cp-hl-tag" style="background:'+(tg.c||GRAY)+';flex:none">'+esc(tg.l)+'</span>':'')+
      '<span style="flex:1;min-width:0">'+x.head+(x.open?' <span class="cp-hl-open" title="'+esc(x.open)+'">open</span>':'')+'</span>'+
      (det?'<span style="margin-left:auto;color:var(--mu);font-size:10px;flex:none">▾</span>':'')+'</summary>'+
      (det?'<div style="padding:0 13px 12px;font-size:10.5px;font-weight:500;color:var(--navy);line-height:1.55;background:#FBFCFE">'+det+'</div>':'')+'</details>';
  }).join('');
  return '<div style="margin-top:18px;border:1px solid var(--bdr);border-radius:12px;background:#fff;overflow:hidden">'+
    '<div style="padding:10px 13px;background:#F6F8FA;border-bottom:1px solid var(--bdr)"><b style="font-size:11.5px;color:var(--navy)">Also on the call</b>'+
      '<div style="font-size:9.5px;color:var(--mu);font-weight:600;margin-top:2px">supplemental colour — the meeting-critical items are the print + thesis check above and the Watch List</div></div>'+
    rows+'</div>';
}
// Results / Estimates sub-tabs render the shared js/results.js engine, which is data-driven from the
// BBG snapshot archive. Until V US EQUITY is in BBG_CONSENSUS.txt (→ results-data/visa.js + visa-setup.js),
// they show this pending note. Only BBG-tracked series go in these boxes/charts (house rule).
function cpPending(label){
  return '<div class="cp-note" style="margin:8px 0;line-height:1.6">📊 <b>'+esc(label)+'</b> renders from the shared <b>Results engine</b> — the Bloomberg snapshot archive tracked over time (chart + transposed table). '+
    'It fills once <b>V US EQUITY</b> lands in the BBG export and is wired into <code>results-data/visa.js</code>. '+
    'Per the house rule, only BBG-tracked series go in these boxes/charts; call-only figures stay in the Post-Results highlights.</div>';
}
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
    // ── The call read (v2.7: the standalone Post-Call phase is dissolved into Post-Results). The
    //    print first, then what management SAID: the take, the "Also on the call" colour, the dots. ──
    var cc=q.call;
    if(cc){
      b+='<div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);margin:16px 0 6px">🎤 What management said on the call <span style="font-weight:600;text-transform:none;letter-spacing:0">· '+esc(q.date||'')+'</span></div>';
      if(cc.take) b+='<div class="cp-take">🎯 '+cc.take+'</div>';
      b+=cpHighlightsBlock(cc, qk);
      if(cc.dots) b+='<div class="cp-dots" style="margin-top:14px">🧩 '+cc.dots+'</div>';
    }
    b+='<div class="ov-foot">Scored against the frozen Watch List. Consensus = Bloomberg export; actuals = reported (Bloomberg / release).</div>';
    b+='</div>';
    return b;
  }).join('');
  return h;
}
// v2.7: the standalone Post-Call phase is DISSOLVED into Post-Results (cpResultsBody folds in the
// call read — take + "Also on the call" highlights + dots). The `take` / `highlights` / `dots` data
// is rendered there; `threeMinutes` / `notBringing` / `newQuestions` survive in CALL_PREP as
// authoring notes only (not rendered), and `newQuestions` seeds the next Watch List (sql/014).
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
  var pane=root.querySelector('.ovt-subpane[data-ovst="earnings"]'); if(!pane) return;
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
  // v3.0: mount the shared, Supabase-backed Watch List engine (js/watchlist.js). It owns
  // rendering, CRUD, sorting, tags, the delete rule and the cross-quarter view — no per-file
  // list code. companyId scopes the company_themes rows; quarters marks the live/editable one.
  var wpane=pane.querySelector('.cp-phpane[data-cpp="watch"]');
  if(wpane){
    var wmount=wpane.querySelector('[data-wlmount]');
    if(wmount && !wmount._wlMounted && _co && _co.id){
      wmount._wlMounted=true;
      mountWatchList(wmount, { companyId:_co.id, ticker:(_co.ticker||'V'), quarters:CALL_PREP.quarters,
        colors:{ brand:BRAND, brand2:BRAND2, purple:PURPLE, gray:GRAY, red:RED } });
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════
//  The theme record (V_THEMES) — FOLDED into the Call Prep Watch List (v2.3).
//  Narrative THREADS across the FY2024 Q1 → FY2026 Q2 calls, with a By theme ⇄
//  By quarter toggle, accordion rows, and a status chip carrying its age. Built
//  from Visa's earnings-call transcripts. Rendered by vCallsBody() below. ──
var V_THEMES=[
  { theme:'Consumer Payments — credentials, tap-to-pay & tokens', st:{ k:'trend', since:'Q1 FY2024', last:'Q2 FY2026' },
    why:'The core engine: growing credentials, pushing tap-to-pay penetration, and issuing network tokens that lift approval rates and cut fraud — plus the Visa Flexible Credential.',
    updates:[
      { q:'Q1 2024', items:['Payments volume and processed transactions growing high-single/low-double digits; <b>tap-to-pay</b> penetration climbing across markets; credentials up mid-single digits.'] },
      { q:'Q3 2024', items:['<b>Visa Flexible Credential</b> highlighted — one card toggling debit / credit / instalments / rewards; first live with <b>SMCC in Japan</b>, US to follow.'] },
      { q:'Q1 2025', items:['Network <b>tokens</b> surpass ~<b>13B</b> issued; tokenized transactions carry higher approval and lower fraud. Tap-to-pay now a majority of face-to-face outside the US.'] },
      { q:'Q3 2025', items:['Flexible Credential expanding to the US and additional markets; continued credential and tap-to-pay growth underpinning consumer-payments revenue.'] },
      { q:'Q2 2026', items:['Consumer payments resilient; credentials and tokens keep compounding — the base that funds investment in new flows and services.'] },
    ]},
  { theme:'Cross-border & the consumer', st:{ k:'trend', since:'Q1 FY2024', last:'Q2 FY2026' },
    why:'The margin engine and the demand pulse: cross-border (ex-intra-Europe) is the highest-yield line, so its growth — and the health of the consumer behind it — is the number to watch.',
    updates:[
      { q:'Q1 2024', items:['Cross-border volume (ex-intra-Europe) up <b>~16%</b> cc; travel recovery continuing; a healthy, resilient consumer.'] },
      { q:'Q3 2024', items:['Cross-border <b>~14%</b> cc; e-commerce strong; some normalization in travel vs the reopening surge.'] },
      { q:'Q1 2025', items:['Cross-border <b>~15–16%</b> cc; consumer solid despite macro and tariff uncertainty; no meaningful pull-forward of spend.'] },
      { q:'Q4 2025', items:['Cross-border still double-digit cc; card-not-present ex-travel a steady contributor; the highest-yield line holding up.'] },
      { q:'Q2 2026', items:['Cross-border growth continues, with macro / geopolitical watch-items flagged; management frames the consumer as steady.'] },
    ]},
  { theme:'New Flows — Visa Direct & Commercial (CMS)', st:{ k:'trend', since:'Q1 FY2024', last:'Q1 FY2026' },
    why:'The ~$200T greenfield: Visa Direct (real-time push payments to ~11B endpoints) and Visa Commercial Solutions / B2B Connect, still overwhelmingly off-card.',
    updates:[
      { q:'Q1 2024', items:['<b>Visa Direct</b> transactions growing well ahead of the network; endpoints expanding across cards, accounts and wallets.'] },
      { q:'Q2 2024', items:['<b>Pismo</b> acquisition closed — cloud core-banking / issuer & acquirer processing, extending CMS reach.'] },
      { q:'Q4 2024', items:['Visa Direct reaching ~<b>11B endpoints</b>; commercial volumes growing; B2B Connect scaling cross-border bank flows.'] },
      { q:'Q1 2025', items:['New-flows framed as the ~<b>$200T</b> opportunity at Investor Day; Visa Direct and Commercial Solutions the twin engines.'] },
      { q:'Q1 2026', items:['Money-movement wins — remittance and payout partners on Visa Direct (Western Union, Remitly, Thunes-type flows); <b>X Money</b> partnership named.'] },
    ]},
  { theme:'Value-Added Services & the flywheel', st:{ k:'trend', since:'Q1 FY2024', last:'Q2 FY2026' },
    why:'The diversifier: ~30% of net revenue, growing ~20%+ cc, faster and less-regulated than interchange — issuing (Pismo), acceptance (CyberSource), risk (Featurespace) and advisory / open banking (Tink).',
    updates:[
      { q:'Q1 2024', items:['VAS growth in the <b>~20%s</b> cc; issuing, acceptance, risk & advisory all contributing; the fastest-growing revenue line.'] },
      { q:'Q4 2024', items:['Agreed to acquire <b>Featurespace</b> (adaptive-behaviour fraud AI); <b>Tink</b> open banking scaling in Europe.'] },
      { q:'Q2 2025', items:['VAS reaffirmed as ~30% of net revenue and a ~$520B TAM at Investor Day; risk & security demand rising with AI-era fraud.'] },
      { q:'Q4 2025', items:['VAS still compounding ~20%+ cc; Pismo issuer-processing and CyberSource acceptance cited as growth drivers.'] },
      { q:'Q2 2026', items:['Featurespace integrated into Visa Protect; advisory (VCA) and open banking (Tink) contributing to the services mix.'] },
    ]},
  { theme:'Client wins & the network battleground', st:{ k:'trend', since:'Q1 FY2024', last:'Q1 FY2026' },
    why:'The competitive front line: issuer renewals and flips, plus fintech and co-brand partnerships — the deals that route portfolios onto (or keep them on) VisaNet.',
    updates:[
      { q:'Q1 2024', items:['Renewals and wins across large issuers; fintech momentum with <b>Revolut, Chime, Affirm, Klarna</b>-type programs riding Visa rails.'] },
      { q:'Q3 2024', items:['<b>Wells Fargo</b> renewal cited; <b>NatWest, Lloyds</b> and other European issuer relationships; <b>PayPay</b> (Japan) partnership.'] },
      { q:'Q1 2025', items:['Continued issuer discipline — win the right portfolios; fintech and co-brand pipeline healthy; <b>HSBC Zing</b> and similar programs.'] },
      { q:'Q4 2025', items:['Processor / enabler wins (<b>Highnote</b>, Marqeta-type programs); global issuer renewals across regions.'] },
      { q:'Q1 2026', items:['<b>TikTok</b> and other consumer-brand partnerships; co-brand and fintech wins across markets.'] },
    ]},
  { theme:'Agentic commerce & tokenization', st:{ k:'watch', since:'Q3 FY2024', last:'Q1 FY2026' },
    why:'The newest thread: Visa positioning its credentials, tokens and rules as the trust layer for AI agents that shop and pay — Visa Intelligent Commerce.',
    updates:[
      { q:'Q3 2024', items:['Tokenization framed as the foundation for the next wave of digital commerce; <b>13B+</b> tokens issued.'] },
      { q:'Q2 2025', items:['Launched <b>Visa Intelligent Commerce</b> (Apr 2025) — enabling verified AI agents to transact with Visa credentials under tokenized, policy-bound controls.'] },
      { q:'Q3 2025', items:['Intelligent Commerce partner roster expands — <b>Anthropic, OpenAI, Microsoft, Mistral, Perplexity, Samsung, Stripe</b>; early pilots underway.'] },
      { q:'Q1 2026', items:['Agentic commerce scaling; Visa positioning tokens + rules + risk as the standard rails for AI-agent checkout.'] },
    ]},
  { theme:'Stablecoins & digital assets', st:{ k:'watch', since:'Q1 FY2024', last:'Q2 FY2026' },
    why:'From USDC settlement to a platform: Visa framing stablecoins as a money-movement opportunity for Visa Direct rather than a pure threat — plus VTAP.',
    updates:[
      { q:'Q1 2024', items:['Reiterated <b>USDC settlement</b> capability (live since 2021 on Solana / Ethereum); crypto co-brand card programs on Visa rails.'] },
      { q:'Q1 2025', items:['Launched the <b>Visa Tokenized Asset Platform (VTAP)</b> — helping banks mint, burn and move fiat-backed tokens.'] },
      { q:'Q3 2025', items:['Post-GENIUS-Act, stablecoins framed as "another way to move value" — a Visa Direct / settlement opportunity; partners Circle, Paxos.'] },
      { q:'Q2 2026', items:['Continued stablecoin settlement and tokenized-asset work; management frames it as complementary to the card network.'] },
    ]},
  { theme:'Regulation & litigation', st:{ k:'watch', since:'Q4 FY2024', last:'Q1 FY2026' },
    why:'The persistent tail risk: the DOJ debit-monopoly suit (Visa-specific), the CCCA routing mandate and MDL 1720 — partly offset by the Class-B escrow shield on US interchange claims.',
    updates:[
      { q:'Q4 2024', items:['<b>DOJ debit civil suit</b> filed <b>Sept 24, 2024</b> — alleges Visa monopolizes US debit; Visa disputes it. A live, Visa-specific overhang.'] },
      { q:'Q1 2025', items:['Management addresses the DOJ suit and routing debate; emphasizes Visa\'s value to issuers, merchants and consumers.'] },
      { q:'Q4 2025', items:['<b>MDL 1720</b> revised merchant settlement (Nov 2025) — later rejected by merchant groups, so the overhang persists; Class-B escrow shields Class A on covered US claims.'] },
      { q:'Q1 2026', items:['CCCA reintroduced (Jan 2026) — a live legislative overhang (also mapped in <b>Top Line ▸ Industry Analysis</b>).'] },
    ]},
];
// Regroup the theme-tagged updates by quarter (newest first) — same data, different lens.
function vCallsByQuarter(){
  var map={}, order=[];
  V_THEMES.forEach(function(ct){ ct.updates.forEach(function(u){ if(!map[u.q]){ map[u.q]=[]; order.push(u.q); } map[u.q].push({ theme:ct.theme, items:u.items }); }); });
  function qv(q){ var m=String(q).match(/Q(\d)\s+(\d{4})/); return m?(+m[2])*10+(+m[1]):0; }
  order.sort(function(a,b){ return qv(b)-qv(a); });
  return { order:order, map:map };
}
function vCallsBody(c){
  var h='<style>.calls-tog{display:inline-flex;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:14px}'+
    '.calls-pill{border:none;background:transparent;font:inherit;font-size:12px;font-weight:700;color:var(--mu);padding:5px 15px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.calls-pill:hover{color:var(--navy)}.calls-pill.active{background:'+BRAND+';color:#fff}'+
    '.calls-tl{font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--navy);margin:0 0 4px}'+
    '.calls-st{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid;flex:none}</style>';
  h+='<p class="ov-lede">The key narrative threads across Visa\'s recent <b>earnings calls</b> (FY2024 Q1 → FY2026 Q2). Switch lens: <b>By theme</b> traces how each story evolved; <b>By quarter</b> shows what mattered on a given call. Each theme carries a status — <b>trend</b> (confirmed), <b>promise</b> (a commitment to reconcile next call) or <b>watch</b> — <b>with its age</b>: a watch running two quarters is louder than a fresh one. Tap any row to expand. (Quarterly guided-vs-delivered lives in the <b>Guidance</b> tab.)</p>';
  h+='<div class="calls-tog" role="tablist"><button type="button" class="calls-pill active" data-macallsv="theme">By theme</button><button type="button" class="calls-pill" data-macallsv="quarter">By quarter</button></div>';
  // By theme (default)
  h+='<div class="lpb-acc" id="vCallsTheme">';
  V_THEMES.forEach(function(ct){
    var sk=(ct.st&&ct.st.k)?ct.st.k:'watch'; var st=CP_THST[sk]||CP_THST.watch;
    h+='<div class="lpb-acc-item"><button type="button" class="lpb-acc-h"><span style="display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap">'+esc(ct.theme)+' <span class="calls-st" style="color:'+st.c+';border-color:'+st.c+'">'+st.l+cpStAge(ct.st)+'</span></span><span class="lpb-acc-ic">+</span></button>';
    h+='<div class="lpb-acc-body"><p style="font-size:12px;color:var(--mu);margin:0 0 10px;font-style:italic">'+esc(ct.why)+'</p>';
    ct.updates.forEach(function(u){ h+='<div style="margin-bottom:10px"><span class="ov-chip" style="margin-right:6px">'+esc(u.q)+'</span><ul class="ov-bullets" style="margin-top:4px">'+u.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>'; });
    h+='</div></div>';
  });
  h+='</div>';
  // By quarter
  var byQ=vCallsByQuarter();
  h+='<div class="lpb-acc" id="vCallsQuarter" style="display:none">';
  byQ.order.forEach(function(q){
    h+='<div class="lpb-acc-item"><button type="button" class="lpb-acc-h"><span>'+esc(q)+'</span><span class="lpb-acc-ic">+</span></button><div class="lpb-acc-body">';
    byQ.map[q].forEach(function(row){ h+='<div style="margin-bottom:12px"><div class="calls-tl">'+esc(row.theme)+'</div><ul class="ov-bullets" style="margin-top:2px">'+row.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>'; });
    h+='</div></div>';
  });
  h+='</div>';
  h+='<div class="ov-fynote" style="margin-top:12px">Sources: Visa Inc. FY2024 Q1 – FY2026 Q2 earnings calls & prepared remarks (transcripts). Highlights are qualitative and contemporaneous — written from the perspective of each call. Some quarter-level specifics are approximate pending the exact transcript quote.</div>';
  return h;
}

// ════════════════════════════════════════════════════════════════════════════
//  Valuation ▸ Sensitivity — a multi-driver model (SoFi pattern). Turn Visa’s
//  revenue algorithm into an EPS and an implied price. Base ≈ FY26E. Live price via
//  api.liveQuote overrides the anchor. All drivers flex from the base case. ──
var V_SENS_BASE={
  netBase:28.0,   // FY25 core-payments-network net revenue ($B), ~70% of net rev
  vasBase:12.0,   // FY25 value-added-services net revenue ($B), ~30%
  shares:1930,    // diluted shares (M)
  netToOp:0.77,   // net income ÷ operating income (≈ Visa FY25)
  pxFallback:332  // dated market anchor (~$640B mkt cap ÷ ~1,930M sh); overridden by the live price
};
var V_SENS_DRIVERS=[
  { k:'gnet', label:'Core-network growth', unit:'%', min:3, max:15, step:0.5, base:9,  hint:'volume × cross-border × net yield, blended' },
  { k:'gvas', label:'Value-added services growth', unit:'%', min:6, max:30, step:1, base:20, hint:'the ~20%+ cc growth engine' },
  { k:'opm',  label:'Operating margin', unit:'%', min:60, max:72, step:0.5, base:67, hint:'high-60s, top of the S&P 500' },
  { k:'buy',  label:'Net share reduction (buyback)', unit:'%', min:0, max:5, step:0.25, base:2.5, hint:'~$20B/yr program' },
  { k:'pe',   label:'P/E (re-rate)', unit:'×', min:18, max:36, step:0.5, base:27, hint:'premium duopoly multiple' },
];
var _maSens={}; V_SENS_DRIVERS.forEach(function(d){ _maSens[d.k]=d.base; });
var _maLivePx=null;
function vSensCompute(){
  var s=_maSens, B=V_SENS_BASE;
  var netRev = B.netBase*(1+s.gnet/100) + B.vasBase*(1+s.gvas/100); // $B
  var opInc  = netRev*(s.opm/100);
  var netInc = opInc*B.netToOp;                                     // $B
  var shares = B.shares*(1-s.buy/100);                              // M
  var eps    = (netInc*1000)/shares;                               // $
  var price  = eps*s.pe;
  return { netRev:netRev, opInc:opInc, netInc:netInc, eps:eps, price:price };
}
function vSensBody(c){
  var h='<style>.msn-wrap{display:grid;grid-template-columns:1.1fr 1fr;gap:18px;margin-top:6px}@media(max-width:820px){.msn-wrap{grid-template-columns:1fr}}'+
    '.msn-drv{margin:0 0 15px}.msn-drl{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}'+
    '.msn-dn{font-size:12.5px;font-weight:800;color:var(--navy)}.msn-dv{font-size:13px;font-weight:900;color:'+V_BLUE+'}'+
    '.msn-dh{font-size:10.5px;color:var(--mu);margin-top:2px}'+
    '.msn-slider{width:100%;-webkit-appearance:none;height:5px;border-radius:5px;background:#E7ECF3;outline:none;margin-top:6px}'+
    '.msn-slider::-webkit-slider-thumb{-webkit-appearance:none;width:17px;height:17px;border-radius:50%;background:'+V_BLUE+';cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.2)}'+
    '.msn-slider::-moz-range-thumb{width:17px;height:17px;border:none;border-radius:50%;background:'+V_BLUE+';cursor:pointer}'+
    '.msn-eq{background:var(--w);border:1px solid var(--bdr);border-radius:11px;padding:13px 15px;font-size:12px;color:var(--navy);line-height:1.9}'+
    '.msn-eq b{color:'+V_BLUE+'}.msn-tiles{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}'+
    '.msn-tile{border:1px solid var(--bdr);border-radius:11px;padding:12px 14px;text-align:center}.msn-tile-v{font-size:20px;font-weight:900;color:var(--navy)}.msn-tile-l{font-size:10.5px;color:var(--mu);margin-top:2px}'+
    '.msn-price{grid-column:1 / -1;border-top:3px solid '+V_BLUE+';background:rgba(26,31,113,0.05)}.msn-price .msn-tile-v{font-size:26px;color:'+V_BLUE+'}'+
    '.msn-up{font-size:12.5px;font-weight:800;margin-top:3px}.msn-reset{margin-top:12px;font-size:11px;font-weight:800;color:'+V_BLUE+';background:none;border:1px solid '+V_BLUE+';border-radius:8px;padding:6px 12px;cursor:pointer}</style>';
  h+='<p class="ov-lede">Visa guides EPS growth qualitatively — this model turns its <b>revenue algorithm</b> into an explicit EPS and price. Move any driver; the equation, the KPI tiles and the <b>implied price</b> (EPS × P/E) recompute live and compare to the market price. Base case ≈ <b>FY26E</b>.</p>';
  h+='<div class="msn-wrap"><div id="vSensDrivers">'+V_SENS_DRIVERS.map(function(d){
      return '<div class="msn-drv"><div class="msn-drl"><span class="msn-dn">'+esc(d.label)+'</span><span class="msn-dv" id="vSensV-'+d.k+'">'+d.base+d.unit+'</span></div>'+
        '<input type="range" class="msn-slider" id="vSens-'+d.k+'" min="'+d.min+'" max="'+d.max+'" step="'+d.step+'" value="'+d.base+'">'+
        '<div class="msn-dh">'+esc(d.hint)+' · base '+d.base+d.unit+'</div></div>'; }).join('')+
      '<button type="button" class="msn-reset" id="vSensReset">↺ Reset to base case</button></div>'+
    '<div><div class="msn-eq" id="vSensEq"></div><div class="msn-tiles" id="vSensTiles"></div></div></div>';
  h+='<div class="ov-fynote" style="margin-top:14px"><b>How it chains:</b> core-network + VAS revenue → operating income (× margin) → net income (× 0.77 net/op) → EPS (÷ shares, net of buyback) → <b>price = EPS × P/E</b>. Illustrative, not a Visa forecast; net/op ratio, share count and segment split are FY2025 anchors.</div>';
  h+='<div class="ov-foot">Anchors from Visa FY2025 results (net-revenue split ~70/30 core-network/VAS; ~1,930M diluted shares; net/op ≈ 0.77). Live price via Massive; P/E base ~27× is a mid-2026 premium-duopoly multiple. All outputs are model estimates.</div>';
  return h;
}
function vSensRender(root){
  root=root||document; var r=vSensCompute();
  var px=_maLivePx||V_SENS_BASE.pxFallback;
  var up=(r.price/px-1)*100, upCol=up>=0?'#0F9D58':'#C0392B';
  var eq=root.querySelector('#vSensEq');
  if(eq) eq.innerHTML='Net revenue <b>$'+r.netRev.toFixed(1)+'B</b> → operating income <b>$'+r.opInc.toFixed(1)+'B</b> → net income <b>$'+r.netInc.toFixed(1)+'B</b> → EPS <b>$'+r.eps.toFixed(2)+'</b> → price = EPS × P/E = <b>$'+Math.round(r.price)+'</b>';
  var tiles=root.querySelector('#vSensTiles');
  if(tiles) tiles.innerHTML=
    '<div class="msn-tile"><div class="msn-tile-v">$'+r.netRev.toFixed(1)+'B</div><div class="msn-tile-l">Net revenue</div></div>'+
    '<div class="msn-tile"><div class="msn-tile-v">$'+r.eps.toFixed(2)+'</div><div class="msn-tile-l">EPS (model)</div></div>'+
    '<div class="msn-tile msn-price"><div class="msn-tile-l" style="margin-bottom:2px">Implied price</div><div class="msn-tile-v">$'+Math.round(r.price)+'</div><div class="msn-up" style="color:'+upCol+'">'+(up>=0?'+':'')+up.toFixed(1)+'% vs $'+Math.round(px)+(_maLivePx?' live':' est')+'</div></div>';
}
function vSensInit(root){
  root=root||document;
  V_SENS_DRIVERS.forEach(function(d){ var el=root.querySelector('#vSens-'+d.k); if(!el) return;
    el.oninput=function(){ _maSens[d.k]=parseFloat(el.value); var v=root.querySelector('#vSensV-'+d.k); if(v) v.textContent=el.value+d.unit; vSensRender(root); }; });
  var rb=root.querySelector('#vSensReset'); if(rb) rb.onclick=function(){ V_SENS_DRIVERS.forEach(function(d){ _maSens[d.k]=d.base; var el=root.querySelector('#vSens-'+d.k); if(el) el.value=d.base; var v=root.querySelector('#vSensV-'+d.k); if(v) v.textContent=d.base+d.unit; }); vSensRender(root); };
  vSensRender(root);
}

// ════════════════════════════════════════════════════════════════════════════
//  Valuation ▸ Capital Allocation — the asset-light cash machine returns ~all FCF.
//  Buybacks (~$17B FY25) + a serially-raised dividend, shares down ~2,170M→~1,930M.
//  Figures directional (annual splits from cash-flow statements / press). ──
var V_CAP_ROWS=[
  { fy:'FY21', fcf:14.5, buy:8.9, div:3.0, sh:2170 },
  { fy:'FY22', fcf:17.9, buy:11.6, div:3.2, sh:2080 },
  { fy:'FY23', fcf:19.7, buy:12.1, div:3.7, sh:2030 },
  { fy:'FY24', fcf:18.7, buy:16.7, div:4.2, sh:1970 },
  { fy:'FY25', fcf:20.7, buy:16.9, div:4.5, sh:1930 },
];
function vCapAllocBody(c){
  var last=V_CAP_ROWS[V_CAP_ROWS.length-1], first=V_CAP_ROWS[0];
  var shDrop=((first.sh-last.sh)/first.sh*100).toFixed(1);
  var h='<p class="ov-lede">Visa is an <b>asset-light cash machine</b>: almost no capex, no credit risk, ~58–60% FCF margin — so nearly <b>all</b> free cash flow goes back to shareholders, tilted heavily to <b>buybacks</b> with a <b>serially-raised dividend</b> on top. The share count has fallen every year.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY25 buybacks</div><div class="ov-kpi-v">~$16.9B</div><div class="ov-kpi-d muted">up from ~$8.9B in FY21</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY25 dividends</div><div class="ov-kpi-v">~$4.5B</div><div class="ov-kpi-d muted">raised ~mid-teens%/yr</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Total returned FY25</div><div class="ov-kpi-v">~$21B</div><div class="ov-kpi-d muted">≈ 100%+ of FCF</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Shares FY21→FY25</div><div class="ov-kpi-v">−'+shDrop+'%</div><div class="ov-kpi-d muted">~2,170M → ~1,930M</div></div>'+
  '</div>';
  h+=sec('Capital returned vs free cash flow',
    '<div class="ov-chart-card"><div class="ov-chart-t">Buybacks + dividends vs FCF <span>· $B · fiscal years</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="vChartCapital"></canvas></div></div>'+
    '<div class="ov-chart-card" style="overflow-x:auto;margin-top:10px"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="color:var(--mu)"><th style="text-align:left;padding:6px 10px">FY</th><th style="text-align:right;padding:6px 10px">FCF</th><th style="text-align:right;padding:6px 10px">Buybacks</th><th style="text-align:right;padding:6px 10px">Dividends</th><th style="text-align:right;padding:6px 10px">Total return</th><th style="text-align:right;padding:6px 10px">% of FCF</th><th style="text-align:right;padding:6px 10px">Shares (M)</th></tr></thead><tbody>'+
      V_CAP_ROWS.map(function(r){ var tot=r.buy+r.div, pct=(tot/r.fcf*100).toFixed(0); return '<tr style="border-top:1px solid var(--bdr)"><td style="padding:7px 10px;font-weight:800">'+esc(r.fy)+'</td><td style="text-align:right;padding:7px 10px">$'+r.fcf.toFixed(1)+'B</td><td style="text-align:right;padding:7px 10px">$'+r.buy.toFixed(1)+'B</td><td style="text-align:right;padding:7px 10px">$'+r.div.toFixed(1)+'B</td><td style="text-align:right;padding:7px 10px;font-weight:700">$'+tot.toFixed(1)+'B</td><td style="text-align:right;padding:7px 10px;color:'+(pct>=100?'#0F9D58':'var(--navy)')+'">'+pct+'%</td><td style="text-align:right;padding:7px 10px">'+r.sh+'</td></tr>'; }).join('')+
    '</tbody></table></div>'+
    '<div class="ov-fynote" style="margin-top:8px">Buybacks (dark) are the primary lever; the dividend (orange) is smaller but <b>raised every year</b>. Total return has run <b>at or above 100% of FCF</b> — funded partly with the balance sheet, consistent with the low-capital model. Annual splits are directional (from cash-flow statements / dividend announcements).</div>');
  h+='<div class="ov-foot">Sources: Visa cash-flow statements FY2021–FY2025, dividend press releases, share-count from the 10-Ks (Class A equivalent). Values are approximate/directional, rounded to the nearest $0.1B.</div>';
  return h;
}
function buildMaCapital(){
  var cv=document.getElementById('vChartCapital'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var ex=Chart.getChart?Chart.getChart(cv):null; if(ex) ex.destroy();
  var labels=V_CAP_ROWS.map(function(r){ return r.fy; });
  new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:labels, datasets:[
      { label:'Buybacks', data:V_CAP_ROWS.map(function(r){ return r.buy; }), backgroundColor:V_BLUE, stack:'ret', borderRadius:{topLeft:0,topRight:0,bottomLeft:4,bottomRight:4}, maxBarThickness:40 },
      { label:'Dividends', data:V_CAP_ROWS.map(function(r){ return r.div; }), backgroundColor:V_GOLD, stack:'ret', borderRadius:{topLeft:4,topRight:4}, maxBarThickness:40 },
      { label:'Free cash flow', type:'line', data:V_CAP_ROWS.map(function(r){ return r.fcf; }), borderColor:V_GREEN, backgroundColor:V_GREEN, borderWidth:2.5, tension:.25, pointRadius:3, order:0 }
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': $'+ctx.parsed.y.toFixed(1)+'B'; } } } },
      scales:{ y:{ stacked:true, ticks:{ callback:function(v){ return '$'+v+'B'; }, font:{size:10} }, grid:{color:'#EEF2F7'} }, x:{ stacked:true, grid:{display:false}, ticks:{font:{size:10.5}} } } }
  });
}

// ════════════════════════════════════════════════════════════════════════════
//  Management ▸ Governance & SBC — independent chair, a THREE-share-class structure
//  (A public / B former US banks / C former intl banks) with the litigation escrow,
//  and modest, buyback-swamped stock comp. SBC $ and share count directional. ──
var V_SBC_ROWS=[
  { fy:'FY22', sbc:0.50, rev:29.31, sh:2080 },
  { fy:'FY23', sbc:0.55, rev:32.65, sh:2030 },
  { fy:'FY24', sbc:0.60, rev:35.93, sh:1970 },
  { fy:'FY25', sbc:0.65, rev:39.90, sh:1930 },
];
// ── Visa's three share classes (A public / B former US banks / C former intl banks):
//    what each is, WHY they exist (bank co-op → 2008 IPO), the escrow-driven B→A
//    conversion mechanism, and how the structure unwinds. A visual explainer. ──
function vShareClasses(){
  var card=function(tag,color,badge,who,vote,econ){
    return '<div style="border:1px solid var(--bdr);border-top:3px solid '+color+';border-radius:12px;padding:13px 14px;background:var(--w)">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">'+
        '<span style="font-size:15px;font-weight:900;color:'+color+'">'+tag+'</span>'+
        '<span style="font-size:9px;font-weight:800;color:#fff;background:'+color+';border-radius:999px;padding:2px 8px">'+badge+'</span>'+
      '</div>'+
      '<div style="font-size:11.5px;font-weight:700;color:var(--navy);margin-bottom:8px">'+who+'</div>'+
      '<div style="font-size:10.5px;color:var(--mu);line-height:1.5"><b style="color:var(--navy)">Votes:</b> '+vote+'</div>'+
      '<div style="font-size:10.5px;color:var(--mu);line-height:1.5;margin-top:4px"><b style="color:var(--navy)">Economics:</b> '+econ+'</div>'+
    '</div>';
  };
  var step=function(t){ return '<div style="flex:1;min-width:130px;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:9px 11px;font-size:10.5px;color:var(--navy);line-height:1.4">'+t+'</div>'; };
  var arr='<span style="align-self:center;color:var(--mu);font-weight:800;font-size:14px">→</span>';
  var pill=function(t,strong){ return '<span style="font-size:10.5px;font-weight:700;background:'+(strong?'#FBF3E4':'#fff')+';border:1px solid '+(strong?'#E8C77A':'var(--bdr)')+';border-radius:8px;padding:6px 10px'+(strong?';color:#B7791F':'')+'">'+t+'</span>'; };
  return ''+
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">'+
      card('Class A',V_BLUE,'Public','Public float — the tradeable stock','1 vote / share','Full economic + voting rights; holds the public economics.')+
      card('Class B','#B7791F','US banks','Former US member banks','Essentially none','Convert into A — but the B→A ratio falls with each US litigation escrow deposit; locked until US covered litigation resolves.')+
      card('Class C',V_STEEL,'Intl banks','Former international member banks','Essentially none','Convert into A over time as transfer restrictions lapse.')+
    '</div>'+
    '<div class="ov-subh" style="margin:0 0 7px">Why they exist — a bank co-op that went public</div>'+
    '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:16px">'+
      step('<b>1970 — NBI</b><br>Member banks form a bank-owned cooperative (National BankAmericard Inc.).')+arr+
      step('<b>2007 — Visa Inc.</b><br>The co-op is restructured into a single corporation ahead of listing.')+arr+
      step('<b>2008 — IPO ($17.9B)</b><br>Public buys <b>Class A</b>; former banks keep <b>B (US)</b> / <b>C (intl)</b>; <b>$3B</b> seeds the litigation escrow.')+
    '</div>'+
    '<div class="ov-callout" style="border-left:3px solid #B7791F">'+
      '<div class="ov-subh" style="margin:0 0 8px">The clever bit — a bank-funded buffer (the conversion ratio)</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin-bottom:9px">'+
        pill('US interchange settlement')+arr+
        pill('Deposit into the escrow (RRP)')+arr+
        pill('Class B → A conversion ratio ↓',true)+
      '</div>'+
      '<div style="font-size:11px;color:var(--navy);line-height:1.55">Each deposit automatically lowers the <b>Class B → Class A conversion rate</b>, so the <b>former US banks (Class B) absorb the cost through dilution of their own stake</b> — not public Class-A holders. Economically it works like a <b>bank-funded buyback</b> (fewer as-converted shares), which is why ~17-year-old interchange litigation <b>barely dents Class-A EPS</b>. Caveat: only <i>US Covered</i> Litigation is shielded — non-US claims can still reach Class A.</div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:10px"><b>How it evolves:</b> Class B can only <b>fully convert and freely trade once US covered litigation is finally resolved</b> — so a standing <b>B overhang</b> remains while the cases run. Class C restrictions have <b>largely lapsed</b>, moving those shares toward the Class-A float. Net direction: toward a <b>simpler, single-float structure</b> over time — gated by the litigation calendar.</div>';
}
function vSbcBody(c){
  var h='<p class="ov-lede">Two things to check on a compounder: is the <b>governance</b> clean, and is <b>stock comp</b> quietly diluting you? Visa scores well — an <b>independent chair</b> and <b>SBC around ~1.5% of revenue</b> that is <b>swamped by buybacks</b> (net share count falls every year). The one structural nuance is Visa\'s <b>three share classes</b> and the litigation escrow.</p>';
  h+=sec('Governance — the structure',
    '<div class="ov-grid2" style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="ov-callout"><div class="ov-subh" style="margin:0 0 6px">✓ Shareholder-friendly</div>'+bullets([
      '<b>Independent Chair</b> — the CEO (Ryan McInerney) is <b>not</b> chairman; roles are split.',
      '<b>Class A (public float) carries the economic and voting rights</b> — Class B/C are largely non-voting, held by former member banks.',
      '<b>Board is operator-heavy</b> (incl. sitting/former public-company CEOs) — see Track Record. Verify against the latest DEF 14A.',
      'Serial dividend increases + a standing multi-billion buyback authorization.']) +'</div>'+
    '<div class="ov-callout"><div class="ov-subh" style="margin:0 0 6px">⚑ Things to know</div>'+bullets([
      '<b>Three share classes</b> (A / B / C) — a legacy of the bank co-op / 2007–08 restructuring. Class A holds the public economics; the full breakdown is below.',
      '<b>Litigation-escrow shield (RRP):</b> the Class-B mechanism makes former member banks — not public Class-A holders — absorb US covered interchange settlements (a structural <b>advantage</b>; see Risk & Litigation).',
      'Executive pay is heavily equity/performance-linked — aligned, but watch the grant size vs the modest SBC expense.']) +'</div></div>');
  h+=sec('Three share classes — why they exist, and how they unwind',
    '<div class="ov-diagram-cap" style="margin:0 0 12px">Visa doesn\'t have a single class of stock. Here\'s what <b>A / B / C</b> are, <b>why</b> they exist, and the escrow mechanism that quietly turns bank litigation into a shield for public holders.</div>'+
    vShareClasses());
  h+=sec('Stock-based comp — modest, and more than bought back',
    '<div class="ov-chart-card"><div class="ov-chart-t">SBC ($B, bars) vs shares outstanding (M, line) <span>· fiscal years</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="vChartSbc"></canvas></div></div>'+
    '<div class="ov-fynote" style="margin-top:8px">SBC has grown with the company but sits around <b>~1.5% of net revenue</b> — and the <b>~$16.9B/yr buyback</b> overwhelms it, so <b>diluted shares fall every year</b> (~2,080M → ~1,930M). Net dilution is <b>negative</b>: you own more of the company each year. SBC $ figures are directional (from the proxy / cash-flow statements).</div>');
  h+='<div class="ov-foot">Sources: Visa DEF 14A (governance, board independence, pay), FY2022–FY2025 cash-flow statements (SBC), 10-Ks (Class A equivalent share count). SBC dollars are approximate/directional; board detail should be verified against the latest proxy.</div>';
  return h;
}
function buildMaSbc(){
  var cv=document.getElementById('vChartSbc'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var ex=Chart.getChart?Chart.getChart(cv):null; if(ex) ex.destroy();
  var labels=V_SBC_ROWS.map(function(r){ return r.fy; });
  new Chart(cv.getContext('2d'),{ data:{ labels:labels, datasets:[
      { type:'bar', label:'SBC ($B)', data:V_SBC_ROWS.map(function(r){ return r.sbc; }), backgroundColor:V_GOLD, borderRadius:4, maxBarThickness:40, yAxisID:'y' },
      { type:'line', label:'Diluted shares (M)', data:V_SBC_ROWS.map(function(r){ return r.sh; }), borderColor:V_STEEL, backgroundColor:V_STEEL, borderWidth:2.5, tension:.25, pointRadius:3, yAxisID:'y1' }
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
  _co=c; // capture company (id + ticker) for the Watch List DB wiring
  var h='<div class="ov ov-mastercard ov-visa-dd" data-brand="MA">';
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
      cpIRButton()+
      '<div class="cp-note" style="margin-bottom:12px">🎯 <b>Earnings</b> — the decision layer, in two phases: <b>① Pre-Call</b> (go in ready — Setup · Watch List, with themes tracked across quarters) → <b>② Post-Results</b> (the print, <i>then</i> what management said — the numbers land before the call, so both are read in one place; the old standalone Post-Call phase was folded in here). Append-only per quarter — pick a quarter below; each quarter keeps its frozen pre-call blocks next to its post-mortem, so the tab is a record of how well we read Visa. The <b>Watch List</b> is now a shared, persistent engine (Supabase); the former standalone <i>Earnings Calls</i> tab is folded into it. <b>The numeric Setup grid + the Results / Estimates charts fill from the Bloomberg snapshot archive once V US EQUITY lands in the export — call-only figures live in the Post-Results highlights, never in the boxes.</b></div>'+
      cpQPills()+
      '<div class="cp-phtabs">'+
        '<button type="button" class="cp-phtab active" data-cpp="setup">Setup</button>'+
        '<button type="button" class="cp-phtab" data-cpp="watch">Watch List</button>'+
        '<button type="button" class="cp-phtab" data-cpp="results">Post-Results</button>'+
      '</div>'+
      '<div class="cp-phpane" data-cpp="setup">'+cpSetupBody(c)+'</div>'+
      '<div class="cp-phpane" data-cpp="watch" hidden>'+cpWatchBody(c)+'</div>'+
      '<div class="cp-phpane" data-cpp="results" hidden>'+cpResultsBody(c)+'</div>'+
    '</div>'+
    '<div class="ovt-subpane" data-ovst="results" hidden>'+cpPending('Results')+'</div>'+
    '<div class="ovt-subpane" data-ovst="estevo" hidden>'+cpPending('Estimates')+'</div>'+
    '<div class="ovt-subpane" data-ovst="guidance" hidden>'+vGuideBody(c)+'</div>'+
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
    '<div class="ovt-subpane" data-ovst="sensitivity" hidden>'+vSensBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="capalloc" hidden>'+vCapAllocBody(c)+'</div>'+
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
    '<div class="ovt-subpane" data-ovst="team">'+V_MGMT.body()+'</div>'+
    '<div class="ovt-subpane" data-ovst="track" hidden>'+vTrackBody(c)+'</div>'+
    '<div class="ovt-subpane" data-ovst="gov" hidden>'+vSbcBody(c)+'</div>'+
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
  if(group==='valuation' && key==='sensitivity') vSensInit(root);
  if(group==='valuation' && key==='capalloc') buildMaCapital();
  if(group==='valuation' && key==='balance') renderFin();
  if(group==='mgmt' && key==='team') V_MGMT.init(root);
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
  vScReset(); vScRender(root); vScChips(root);
  var sctip=root.querySelector('#vScTip');
  function vPeerByTk(tk){ var r=null; (V_SC.peers||[]).forEach(function(p){ if(p.tk===tk) r=p; }); return r; }
  // Delegated pointer wiring on the stable #vScNodes container. Delegation (not per-node
  // mouseenter/leave) is what lets us re-append the hovered node to the FRONT so its full
  // circle clears any peer stacked on top — a per-node listener would fire mouseleave on
  // the re-append and hide the tooltip. Guarded so scRefresh() can't stack duplicates.
  function wireScNodes(){ if(!sctip) return; var cont=root.querySelector('#vScNodes'); if(!cont||cont._scWired) return; cont._scWired=true; var cur=null;
    function nodeOf(e){ return (e.target&&e.target.closest)?e.target.closest('.mg-node'):null; }
    function show(g){ var p=vPeerByTk(g.getAttribute('data-tk')); if(!p) return;
      var col=p.hl?V_BLUE:'#7A8699';
      var pe=(V_SC.basis==='f'?p.peF:p.peT), ev=(V_SC.basis==='f'?p.evF:p.evT), gr=(V_SC.basis==='f'?p.gf:p.gt);
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
  function scRefresh(){ vScRender(root); wireScNodes(); }
  wireScNodes();
  root.querySelectorAll('.mg-pill').forEach(function(btn){ btn.onclick=function(){
    if(btn.hasAttribute('data-mgtype')){ V_SC.type=btn.getAttribute('data-mgtype'); root.querySelectorAll('.mg-pill[data-mgtype]').forEach(function(b){ b.classList.toggle('active', b===btn); }); }
    else { V_SC.basis=btn.getAttribute('data-mgbasis'); root.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b===btn); }); }
    scRefresh();
  }; });
  function wireChips(){
    root.querySelectorAll('#vScChips .masc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(V_SC.peers[i]){ V_SC.peers.splice(i,1); vScChips(root); wireChips(); scRefresh(); } }; });
    var addBtn=root.querySelector('#vScAddBtn'), addIn=root.querySelector('#vScAddTk');
    if(addBtn&&addIn){ addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!V_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=V_PEERS.filter(function(p){ return p.tk===tk; })[0];
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; V_SC.peers.push(o); }
        else V_SC.peers.push({ tk:tk, n:tk, on:true, mc:10, evT:null,evF:null,peT:null,peF:null,gt:null,gf:null, why:'Added by ticker — live market cap only; no multiple on file, so it plots once one is available.' });
      }
      addIn.value=''; vScChips(root); wireChips(); scRefresh(); vLiveOne(tk); }; }
  }
  wireChips();
  // Live market cap (Key Facts cell + peer bubbles) — Massive via api.liveQuote
  function vLiveOne(tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(q){ if(!q) return; if(tk==='MA' && q.price!=null){ _maLivePx=q.price; vSensRender(root); } if(q.marketCap==null) return; var mcB=q.marketCap/1e9; V_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=mcB; }); if(tk==='MA'){ var el=root.querySelector('#vMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live'; } scRefresh(); }).catch(function(){}); }
  V_SC.peers.forEach(function(p){ if(p.tk) vLiveOne(p.tk); });

  // Deep Dive tab wiring (root spans both panes)
  wireDD(root);
  wireSubtabs(root,'topline'); wireSubtabs(root,'bottomline'); wireSubtabs(root,'evolution'); wireSubtabs(root,'valuation'); wireSubtabs(root,'mgmt');
  wireCallPrep(root);

  // Evolution ▸ Guidance — metric toggle (net-revenue ⇄ opex)
  root.querySelectorAll('.guid-pill[data-maguidm]').forEach(function(btn){ btn.onclick=function(){ switchMaGuideMetric(root, btn.getAttribute('data-maguidm')); }; });
  // Evolution ▸ Earnings Calls — By theme ⇄ By quarter lens toggle
  root.querySelectorAll('.calls-pill[data-macallsv]').forEach(function(btn){ btn.onclick=function(){ var v=btn.getAttribute('data-macallsv');
    root.querySelectorAll('.calls-pill[data-macallsv]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    var th=root.querySelector('#vCallsTheme'), qt=root.querySelector('#vCallsQuarter');
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
    if (kind==='role'){ var r=ROLE_DETAIL[id]; return r && { t:r.t, h:r.h }; }
    if (kind==='vasm'){ var vm=VAS_MOAT.filter(function(x){return x.k===id;})[0]; return vm && { t:vm.ic+' '+vm.t, h:'<div style="font-size:12.5px;line-height:1.65;color:var(--navy)">'+vm.full+'</div>' }; }
    if (kind==='vase'){ var ve=VAS_ENGINE.filter(function(x){return x.k===id;})[0]; return ve && { t:ve.ic+' '+ve.t, h:'<div style="font-size:12.5px;line-height:1.65;color:var(--navy)">'+ve.full+'</div>' }; }
    if (kind==='fee'){ var s=FEE_LINES.filter(function(x){return x.k===id;})[0]; return s && { t:s.n+' <span class="ov-modal-sub">'+esc(s.rev)+'</span>', h:feeDetailHtml(s) }; }
    if (kind==='mna'){ var m=MNA.filter(function(x){return x.n===id;})[0]; return m && { t:m.n+' <span class="ov-modal-sub">'+esc(m.y)+' · '+esc(m.deal)+'</span>', h:m.detail }; }
    if (kind==='hist'){ var t=TIMELINE[parseInt(id,10)]; return t && t.d ? { t:t.y, h:t.d } : null; }
    if (kind==='litflow'){ var lf=LIT_FLOW[id]; return lf && { t:lf.t, h:lf.h }; }
    if (kind==='verb'){ var vb=V_VERBS[id]; return vb && { t:vb.t, h:vb.h }; }
    if (kind==='matr'){ var p=V_TRACK.filter(function(x){return x.id===id;})[0]; if(!p) return null; var rt=V_TRACK_RATE[p.rate];
      var body='<div style="display:inline-block;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+rt.c+';border:1px solid '+rt.c+';border-radius:9px;padding:2px 8px;margin-bottom:10px">'+rt.l+'</div>'+
        '<div style="font-size:12.5px;color:var(--navy);line-height:1.5;margin-bottom:12px">'+p.one+'</div>'+
        '<div style="font-size:11px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px">At Visa</div>'+bullets(p.co)+
        '<div style="font-size:11px;font-weight:800;color:var(--mu);text-transform:uppercase;letter-spacing:.4px;margin:12px 0 5px">Before / outside</div>'+bullets(p.ext)+
        '<div class="ov-callout" style="margin-top:12px"><b>The read:</b> '+p.note+'</div>';
      return { t:esc(p.n)+' <span class="ov-modal-sub">'+esc(p.r)+'</span>', h:body }; }
    if (kind==='strat'){ var d=V_STRAT_DRIVERS.filter(function(x){return x.k===id;})[0]; return d && { t:d.ic+' '+esc(d.t), h:d.detail }; }
    if (kind==='threat'){ var tt=V_THREATS.filter(function(x){return x.k===id;})[0]; return tt && { t:tt.ic+' '+esc(tt.n), h:tt.detail }; }
    if (kind==='fam'){ var gp=id.split('-'), gg=V_PROD_GROUPS[+gp[0]]; var f=gg&&gg.families[+gp[1]]; if(!f) return null;
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

export var visaOverview = { html: html, init: init, absorbsPillars: true, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
