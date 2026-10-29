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
import { maCeHtml, maCeWire, maCeBuild, maCePop } from './ma-ce.js';   // Evolution ▸ Earnings (playbook machinery + ./ma-ce-data.js)
import { MA_SENS_MODEL } from './ma-sensitivity-data.js';   // Valuation ▸ Sensitivity: frozen Summit model snapshot
import { maHistMult } from './ma-histmult.js';   // Valuation ▸ Historic Multiple (copy of meta-histmult.js; P/E now, EV/EBITDA when net debt is loaded)
import { maStdPeerScatter, maWireScatters, maValuationPeersBody } from './ma-peers.js';   // OV-6 peer map + Valuation ▸ Peers (denominators from Bloomberg, live quotes)
import { segmentsOverviewHtml, initSegmentsOverview, segmentsHtml, initSegments, segmentsOtherHtml, initSegmentsOther, segmentsCostsHtml, initSegmentsCosts, segmentsCustomersHtml, initSegmentsCustomers } from '../segments.js';   // Top Line engine (data: js/segments-data/ma.js)
import { maResults } from '../results-data/ma.js';   // Ownership / Governance charts read the Bloomberg annual series
import { SUMMIT_CAT } from '../viz-palette.js';

// The live company object (id + ticker), captured in html()/deepDiveHtml(), so the Watch List
// can mount the shared engine against this company's Supabase rows. Same pattern as uber.js.
var _co = null;

function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Chart palette / formatters ──────────────────────────────────────────────
var C_AXIS='#8A93A0', C_GRID='#EEF2F7';
var MA_RED=SUMMIT_CAT[0], MA_ORANGE=SUMMIT_CAT[1], MA_STEEL='#7A8699', MA_GREEN='#16A34A';   // Summit categorical slots: a profile never paints the company’s brand colour (the brand lives in the logo)
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
// OV-4 bars: neutral light greys ranked by size (css/overview.css .gmm-neutral); a bar under ~10% puts its $ outside.
function gmmRank(arr){ var o=arr.map(function(r,i){ return [r[1],i]; }).sort(function(a,b){ return b[0]-a[0]; }), rk=[];
  o.forEach(function(x,j){ rk[x[1]]=Math.min(j+1,6); }); return rk; }
function gmmBars(arr){
  var rk=gmmRank(arr);
  return '<div class="ov-mbars gmm-neutral">'+arr.map(function(r,i){
    var out=r[1]<10;
    return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
      '<div class="ov-mbar-track'+(out?' out':'')+'"><div class="ov-mbar-fill gmm-g'+rk[i]+'" style="width:'+Math.max(r[1],1.2)+'%">'+(out?'':esc(r[2]))+'</div>'+(out?'<span class="ov-mbar-outv">'+esc(r[2])+'</span>':'')+'</div>'+
      '<div class="ov-mbar-v">'+esc(r[3])+'</div></div>';
  }).join('')+'</div>';
}

// ═══════════════════════════════════════════════════════════════════════════
//  STANDARDIZED OVERVIEW DATA (playbook section 8: OV-1 ... OV-7 + OV-F). Facts from the FY2025 Form 10-K.
// ═══════════════════════════════════════════════════════════════════════════

// ── OV-1 Key Facts (exactly 10, 5×2). The market cap cell is live (#maMc), never seeded. ──
var MA_FACTS=[
  ['Listing','NYSE: MA'],
  ['HQ','Purchase, NY, USA'],
  ['Incorporated','Delaware, USA'],
  ['SEC filer','Domestic (10-K/10-Q/8-K)'],
  ['Founded','1966 (Interbank Card Association)'],
  ['IPO','May 2006 · NYSE · $39.00'],
  ['CEO','Michael Miebach · CEO since Jan 2021'],
  ['Employees','~39,800 · Dec 2025'],
  ['Dividend','Payer'],
  ['Market cap','loading live quote…'],
];
function stdKeyFacts(){
  return '<div class="stdkf">'+MA_FACTS.slice(0,10).map(function(p){
    var v=p[0]==='Market cap' ? '<span id="maMc">'+esc(p[1])+'</span>' : esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}

// ── OV-2 Description (2-4 sentences; says what it is, not the segments, customers or moat that sit below). ──
var MA_LEDE="Mastercard is a technology company in the global payments industry. It runs a network that switches (authorizes, clears and settles) card and account-based payments in more than 220 countries and territories, and sells services such as security, data and open banking on top of it. It does not issue cards or lend.";

// ── OV-3 the 2×2 (each cell at most ~30 words). ──
var MA_BIZ=[
  ['What it sells','Payment switching on its card brands and account-based rails, plus services: security, data and analytics, consulting, loyalty and open banking.'],
  ['Who buys it','Banks and other issuers and acquirers, merchants, governments, fintechs and businesses. The five largest customers were 21% of FY2025 net revenue.'],
  ['How it earns','FY2025 net revenue $32.8B: ~59% payment network (fees on volume and transactions, net of rebates) · ~41% value-added services and solutions.'],
  ['The edge','A global two-sided network, services that also sell on non-Mastercard volume, and no lending book.'],
];
function stdFourQuad(){
  return '<div class="q2">'+MA_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}

// ── OV-4 How Mastercard makes money. Segments ⇄ Geography: the same FY2025 net revenue, $32,791M, seen two ways
// (10-K Note 3). [label, % of total, $, share text]. ──
var GMM_SEG=[
  ['Payment network', 59.4, '$19.5B', '59%'],
  ['Value-added services and solutions', 40.6, '$13.3B', '41%'],
];
var GMM_GEO=[
  ['Asia Pacific, Europe, Middle East and Africa', 57.2, '$18.7B', '57%'],
  ['Americas', 42.8, '$14.0B', '43%'],
];
var REV_DEFS=[
  { seg:'Payment network (the core, the larger share)',
    desc:'The switching business. It authorizes, clears and settles payments between the cardholder\u2019s bank and the merchant\u2019s bank across the Mastercard, Maestro and Cirrus brands, and runs account-based and real-time payments. Customers pay fees on the dollar volume of activity and on the number of transactions switched, with domestic and cross-border volume priced separately. Rebates and incentives paid to customers are deducted, so reported revenue is the net.',
    econ:[['FY2025 net revenue','$19.5B \u00b7 59% of total'],['Growth','+12% (from $17.3B), the same in currency-neutral terms'],['Gross revenue before rebates','$40.0B'],['Rebates and incentives','$20.5B (+16%), 51% of gross'],['Gross dollar volume','$10.6T (+9% in local currency)'],['Switched transactions','175.5B (+10%)']] },
  { seg:'Value-added services and solutions (the faster-growing share)',
    desc:'Services sold on top of the network and in part beyond it: security and fraud tools, digital and authentication solutions, data and analytics, consulting, loyalty and consumer acquisition and engagement, and open banking. The 10-K credits its growth to the underlying key drivers, security and digital and authentication solutions, consumer acquisition and engagement, pricing, and business and market insights.',
    econ:[['FY2025 net revenue','$13.3B \u00b7 41% of total'],['Growth','+23% (from $10.8B); +21% currency-neutral'],['From acquisitions','3 points of the growth'],['Unsatisfied performance obligations','$2.0B, to be recognized through 2030']] },
  { seg:'The revenue lines (payment network, before rebates)',
    desc:'Mastercard bills the network by four assessments: <b>domestic</b> (driven by domestic dollar volume or the number of cards), <b>cross-border</b> (card country differs from merchant country), <b>transaction processing</b> (the number of switched transactions) and <b>other</b> (licensing, implementation and franchise fees). Rebates and incentives then come off the total.',
    econ:[['Domestic assessments','$11.0B (+8%)'],['Cross-border assessments','$12.0B (+18%)'],['Transaction processing assessments','$15.9B (+17%)'],['Other network assessments','$1.0B (+9%)'],['Total before rebates','$40.0B'],['Less: rebates and incentives','$20.5B (+16%)'],['Payment network net revenue','$19.5B (+12%)']],
    econNote:'The four lines are the payment network only, before rebates; value-added services and solutions are reported as one line.' },
];
var GEO_DEFS=[
  { seg:'Asia Pacific, Europe, Middle East and Africa (the larger region)',
    desc:'Net revenue earned in these regions, the larger and faster-growing side of the total. Mastercard reports its geography in two regions and says no country other than the United States produced more than 10% of net revenue.',
    econ:[['FY2025 net revenue','$18.7B \u00b7 57% of total'],['Growth','+19% (from $15.8B)']] },
  { seg:'Americas (the United States, Canada and Latin America)',
    desc:'Net revenue earned in the Americas, which the 10-K defines as the United States, Canada and Latin America.',
    econ:[['FY2025 net revenue','$14.0B \u00b7 43% of total'],['Growth','+13% (from $12.4B)']] },
];
function accList(defs){
  return '<div class="mm-defs acc-list">'+defs.map(function(s){
    var econ='<div class="acc"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+(s.econNote?'<div class="ave-subh-note acc-note">'+esc(s.econNote)+'</div>':'')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+esc(s.seg)+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
}
function stdMoneyMap(){
  var h='<div class="ov-diagram-cap gmm-cap-top">FY2025 net revenue <b>$32.8B (+16%)</b> \u2014 the same total, two ways: by <b>category</b> or by <b>region</b>. Mastercard reports one operating segment, Payment Solutions; the two categories are how it splits net revenue. Both views reconcile to the reported figure.</div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">View: <span class="mg-seg">'+
    '<button type="button" class="mg-pill active" data-gmm="seg">Categories</button>'+
    '<button type="button" class="mg-pill" data-gmm="geo">Region</button></span></span></div>';
  h+='<div class="gmm-view" data-gmm="seg">'+gmmBars(GMM_SEG)+accList(REV_DEFS)+'</div>';
  h+='<div class="gmm-view" data-gmm="geo" hidden>'+gmmBars(GMM_GEO)+accList(GEO_DEFS)+'</div>';
  h+='<div class="ov-diagram-cap gmm-cap-end">FY2025: GAAP net income <b>$15.0B</b> (+16%), diluted EPS <b>$16.52</b> (+19%). Net revenue is gross revenue less the $20.5B of rebates and incentives paid to customers. <span class="ave-subh-note">Source: Mastercard FY2025 Form 10-K (Item 7; Note 3, Revenue). Americas = United States, Canada and Latin America; the United States alone was about 29% of net revenue.</span></div>';
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
      ['Ekata','Digital identity verification.'],
      ['RiskRecon','Third-party cyber-risk ratings.'],
      ['Recorded Future','Threat intelligence; a step into enterprise cyber.'],
      ['Tokenization','Replaces card numbers with tokens.'],
    ]},
    { ic:'📊', fam:'Data & Services / Consulting', d:'Analytics, advisory, loyalty.', items:[
      ['Mastercard Advisors','Consulting + analytics across the client base.'],
      ['Test & Learn (APT)','Business-experimentation analytics.'],
      ['Dynamic Yield','AI personalization (from McDonald\'s, 2022).'],
      ['Loyalty & marketing','Rewards programs and campaign tools.'],
    ]},
    { ic:'🏦', fam:'Open banking & real-time', d:'Account data + non-card rails.', items:[
      ['Finicity','US open-banking / financial-data APIs.'],
      ['Aiia','European open-banking platform.'],
      ['Vocalink','Runs the UK\'s Faster Payments & BACS.'],
      ['Nets A2A','European account-to-account / clearing assets.'],
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
  '<g class="ov-fpm-node ov-clickable" data-detail="role:network"><rect x="250" y="150" width="180" height="64" rx="11" fill="'+MA_RED+'" stroke="#2F4766" stroke-width="2.5"/><text x="340" y="180" text-anchor="middle" font-size="14" font-weight="700" fill="#ffffff">MASTERCARD</text><text x="340" y="198" text-anchor="middle" font-size="9.5" fill="#ffe1e1">network · clearing & settlement ›</text></g>' +
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
  { y:'2010–20', t:'<b>The Ajay Banga decade</b> — the business-model pivot to services.', d:'<b>A model inflection, not just growth.</b> Under CEO <b>Ajay Banga</b> the company made its defining choice: build a large <b>value-added services</b> business (cybersecurity, identity, data & analytics) on top of the rails — changing what Mastercard earns on, not just how much. This services tilt, plus a strong international and cross-border mix, is the main reason a structural #2 kept gaining share and economics.' },
  { y:'2017–24', t:'<b>A services-and-rails buying spree</b> (see M&A).', d:'Mastercard acquires real-time-payment and open-banking infrastructure (<b>Vocalink, Nets A2A, Finicity, Aiia</b>) and a deep security/identity/cyber stack (<b>RiskRecon, Ekata, CipherTrace, Recorded Future</b>) — building optionality beyond card swipes into account-to-account, identity and enterprise cyber.' },
  { y:'Jan 2021', t:'<b>Michael Miebach becomes CEO</b> (current CEO).', d:'Miebach, a long-time Mastercard executive, takes over as Banga moves on (later to lead the World Bank). The strategy continues: grow the network, scale services, and extend into new flows (B2B, disbursements, real-time).' },
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

// ── Management (Executives & Board) → Management tab. Full Management-Committee core +
// the complete 11-member board, from the investor.mastercard.com Management Committee page
// and the 2026 DEF 14A. NOTE the June 2, 2026 C-suite reshuffle (effective Aug 3, 2026) is
// flagged inline; titles below are the operative mid-2026 (pre-Aug-3) roster. ──
var MA_RESHUFFLE = 'On <b>June 2, 2026</b> Mastercard announced a C-suite reshuffle effective <b>Aug 3, 2026</b>: CFO <b>Sachin Mehra → Chief Business Officer</b>; <b>Ling Hai → CFO</b>; <b>Linda Kirkpatrick → Chief Services Officer</b> (Vosburg → Vice Chair); <b>Dimitrios Dosis → Chief Commercial Payments Officer</b> (Seshadri → Senior Advisor). Vice Chair <b>Tim Murphy</b> retires Oct 2026. Titles shown are the operative mid-2026 roster.';
var MA_MGMT = makeManagement({
  brand:SUMMIT_CAT[0],
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
    co:['Ran finance, IR, strategy, M&A, treasury & risk through the growth decade','Architect of the buyback and growing-dividend capital return','Elevated to <b>Chief Business Officer</b> (country ops, partnerships) Aug 2026'],
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

var OV_SOURCES = 'Sources — Mastercard FY2025 Form 10-K (SEC EDGAR) for company facts, headcount, FY2025 net revenue by segment, revenue line and region, volumes and capital return; Mastercard investor relations and press releases for history and products. Market cap and peer multiples are live (Massive price ÷ Bloomberg consensus figures as of Oct 2026). Forward figures are estimates, not company guidance.';
var DD_SOURCES = 'Sources — Mastercard Q1 2026 results & earnings release (Apr 30, 2026), FY2025 10-K and prior filings; IR & company history; acquisition press releases & SEC filings for M&A terms; UK Competition Appeal Tribunal & reporting on the Merricks settlement; public reporting on MDL 1720 and the 2006 IPO / Mastercard Foundation. Some M&A values are estimates where terms were undisclosed; "lc"/"cn" = local-currency/currency-neutral.';

// ═══════════════════════════════════════════════════════════════════════════
//  STANDARDIZED OVERVIEW — the 7 blocks (hook always visible, rest collapsed)
// ═══════════════════════════════════════════════════════════════════════════
function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}
function stdOverviewBody(c){
  var h=stdKeyFacts();
  h+='<p class="ov-lede">'+esc(MA_LEDE)+'</p>';
  h+=stdFourQuad();
  h+=collapsible('How Mastercard makes money', stdMoneyMap(), false);
  h+=collapsible('Products & platforms', '<div class="ov-diagram-cap gmm-cap-top"><b>Tap any family</b> for the specific products inside it.</div>'+stdProducts(), false);
  h+=collapsible('Competitors \u2014 the peer map', maStdPeerScatter('ov'), false);
  h+=collapsible('Timeline \u2014 how it became today\u2019s Mastercard', stdTimeline(), false);
  h+='<div class="ov-foot">'+esc(OV_SOURCES)+'</div>';
  return h;
}
function html(c){
  _co = c;   // capture the live company object (id + ticker) for the Watch List DB wiring
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
      '<div style="display:flex;flex-wrap:wrap;gap:5px">'+g.names.map(function(n){ var win=n.indexOf('★')!==-1; return '<span style="background:'+(win?'rgba(62,90,130,0.06)':'#F1F4F8')+';border:1px solid '+(win?'rgba(62,90,130,0.25)':'var(--bdr)')+';border-radius:7px;padding:3px 9px;font-size:11px;color:var(--navy)">'+esc(n)+'</span>'; }).join('')+'</div></div>'; }).join('')+
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
      '<div class="ov-kpi"><div class="ov-kpi-l">Gross dollar volume, FY25</div><div class="ov-kpi-v">$10.6T</div><div class="ov-kpi-d muted">+9% in local currency (10-K)</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Switched transactions, FY25</div><div class="ov-kpi-v">175.5B</div><div class="ov-kpi-d muted">+10% (10-K)</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Cross-border volume, FY25</div><div class="ov-kpi-v">+15%</div><div class="ov-kpi-d muted">local currency (10-K)</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Operating margin, FY25</div><div class="ov-kpi-v">'+(maYv('opinc','2025')&&maYv('rev','2025')?(maYv('opinc','2025')/maYv('rev','2025')*100).toFixed(1)+'%':'—')+'</div><div class="ov-kpi-d muted">operating income ÷ net revenue</div></div>'+
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
      '<b>Duopoly pricing power</b>, a 57.6% operating margin, asset-light, $17.2B of free cash flow and $14.5B returned to shareholders in 2025.',
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
// ── Bottom Line ▸ Unit Economics: the gross-to-net bridge and the take rate, every figure read from the Results dataset
// (Bloomberg actuals, FY2023-FY2025). Gross revenue is the payment network's gross revenue before rebates and incentives (the
// four network assessments); value-added services and solutions are reported net. ──
function maYv(key, yr){ var m=maResults.views.y.metrics[key]; if(!m) return null; var i=m.periods.indexOf(yr); return i<0?null:m.act[i]; }
function maUnitEconBody(c){
  var Y=['2023','2024','2025'];
  function col(fn){ return Y.map(function(y){ return fn(y); }); }
  var gross=col(function(y){ return maYv('gross',y); }), reb=col(function(y){ var v=maYv('cinc',y); return v==null?null:-v; }),
      pnr=col(function(y){ return maYv('pnr',y); }), vas=col(function(y){ return maYv('vas',y); }), rev=col(function(y){ return maYv('rev',y); }),
      pv=col(function(y){ return maYv('pvol',y); }), op=col(function(y){ return maYv('opinc',y); }), am=col(function(y){ return maYv('amort',y); });
  function b(v){ return v==null?'\u2014':'$'+(v/1000).toFixed(1)+'B'; }
  function t(v){ return v==null?'\u2014':'$'+(v/1e6).toFixed(2)+'T'; }
  function pc(v){ return v==null?'\u2014':(v*100).toFixed(1)+'%'; }
  function bp(v){ return v==null?'\u2014':(v*1e4).toFixed(1)+' bps'; }
  function row(l, vals, strong){ return '<tr'+(strong?' class="asc-hl"':'')+'><td>'+esc(l)+'</td>'+vals.map(function(v){ return '<td class="asc-m">'+v+'</td>'; }).join('')+'</tr>'; }
  var i2=2;
  var h='<p class="ov-lede">A network has no cost of goods, so its unit economics are a take-rate story: how much of the gross fee on each dollar of volume it keeps after paying customers rebates and incentives. Everything below is read from the reported figures, not estimated.</p>';
  h+=sec('The gross-to-net bridge, FY2025',
    '<div class="ov-diagram-cap gmm-cap-top">Payment network gross revenue <b>'+b(gross[i2])+'</b>, less rebates and incentives <b>'+b(reb[i2])+'</b> ('+pc(reb[i2]/gross[i2])+' of gross), leaves payment network net revenue of <b>'+b(pnr[i2])+'</b>. Value-added services and solutions are reported net and add <b>'+b(vas[i2])+'</b>, for net revenue of <b>'+b(rev[i2])+'</b>.</div>'+
    gmmBars([['Payment network gross revenue',100,b(gross[i2]),'100%'],['Less: rebates and incentives',reb[i2]/gross[i2]*100,b(reb[i2]),pc(reb[i2]/gross[i2])],['Payment network net revenue',pnr[i2]/gross[i2]*100,b(pnr[i2]),pc(pnr[i2]/gross[i2])],['Value-added services and solutions',vas[i2]/gross[i2]*100,b(vas[i2]),pc(vas[i2]/gross[i2])],['Net revenue',rev[i2]/gross[i2]*100,b(rev[i2]),pc(rev[i2]/gross[i2])]])+
    '<div class="ov-fynote" style="margin-top:8px">Bars are scaled to payment network gross revenue. The check closes: '+b(gross[i2])+' \u2212 '+b(reb[i2])+' + '+b(vas[i2])+' = '+b(rev[i2])+'.</div>');
  h+=sec('The take rate, three years',
    '<div class="asc-tblwrap"><table class="asc-tbl"><thead><tr><th></th>'+Y.map(function(y){ return '<th>FY'+y+'</th>'; }).join('')+'</tr></thead><tbody>'+
      row('Payment network gross revenue', gross.map(b))+
      row('Rebates and incentives', reb.map(b))+
      row('Rebates as % of gross revenue', gross.map(function(g,i){ return pc(reb[i]/g); }), true)+
      row('Payment network net revenue', pnr.map(b))+
      row('Value-added services and solutions', vas.map(b))+
      row('Net revenue', rev.map(b))+
      row('Purchase volume', pv.map(t))+
      row('Gross revenue per $ of purchase volume', gross.map(function(g,i){ return bp(g/pv[i]); }))+
      row('Rebates per $ of purchase volume', reb.map(function(r,i){ return bp(r/pv[i]); }))+
      row('Net yield (network net revenue per $ of purchase volume)', pnr.map(function(n,i){ return bp(n/pv[i]); }), true)+
      row('Amortization of customer and merchant incentives', am.map(b))+
      row('Operating margin', op.map(function(o,i){ return pc(o/rev[i]); }))+
    '</tbody></table></div>'+
    '<div class="ov-fynote" style="margin-top:8px">Rebates and incentives took a larger share of gross revenue each year, while gross revenue per dollar of volume rose enough to hold the net yield: cross-border and transaction processing grew faster than volume. Before 2023 Mastercard classified part of its other revenue inside the network lines, so the series are not comparable with 2020\u20132022.</div>');
  h+=sec('How rebates and incentives are booked',
    '<div class="ov-callout">'+bullets([
      '<b>Contra-revenue, not an expense.</b> The 10-K says net revenue categories \u201care recognized net of rebates and incentives provided to customers\u201d, and that \u201crebates and incentives can be either fixed or variable and are attributed to the category of revenue to which they pertain\u201d.',
      '<b>Variable</b> incentives move with the customer\u2019s volume; <b>fixed</b> and upfront incentives are capitalized and amortized over the contract, which is the amortization line in the table.',
      'The 10-K adds that customers can reassess their commitments and that some have exclusive or near-exclusive relationships with competitors, so incentives are how the network wins and keeps volume.'])+'</div>');
  h+='<div class="ov-foot">Sources \u2014 Mastercard FY2025 Form 10-K (Item 7; Note 3) and earnings releases as recorded by Bloomberg, through the Results dataset. Purchase volume is Mastercard\u2019s supplemental data as recorded by Bloomberg and is smaller than the gross dollar volume the 10-K headlines ($10.6T in FY2025), which also counts cash.</div>';
  return h;
}
// ── Bottom Line ▸ Suppliers. Two layers: (1) the FOUR-PARTY model — the conceptual
// "supply chain" of the rails (issuers/acquirers/merchants/cardholders); and (2) the
// REAL vendor supply chain from Bloomberg SPLC (as of Jun 29, 2026) — which is almost
// entirely IT / software / cloud / security, the proof of the asset-light model. ──
// Bloomberg Supply Chain Analysis (SPLC), MA US Equity, Suppliers, as of Oct 28 2026 (terminal screens, Key Metrics and Geo-Exposure). 60 suppliers; 13 carry a
// BBG-estimated relationship size (US$ M) and a share of Mastercard's cost. [name, industry, size US$ M, % of Mastercard cost, cost category, supplier's revenue %, source]
var MA_SUP_SIZED=[
  ['Infosys Ltd','IT Services',145.30,'1.10%','SG&A','0.74%','Supplier\u2019s 2026Q2 CF'],
  ['Cloudflare Inc','Software',16.91,'0.11%','COGS','0.61%','Company News'],
  ['ACI Worldwide Inc','Software',14.93,'0.10%','COGS','0.87%','Supplier\u2019s 2024Q3 CF'],
  ['Amadeus IT Group SA','Leisure Facilities & Services',10.80,'0.07%','COGS','0.14%','Supplier\u2019s 2022Q4 CF'],
  ['Oracle Corp','Software',10.63,'0.07%','COGS','0.01%','Company News'],
  ['Microsoft Corp','Software',5.43,'0.04%','COGS','<0.01%','Company News'],
  ['Snowflake Inc','Software',4.12,'0.03%','COGS','0.07%','Supplier\u2019s 2024Q4 CF'],
  ['Riskified Ltd','Software',1.68,'0.01%','COGS','0.49%','Company News'],
  ['Kudelski SA','Software',1.20,'<0.01%','COGS','0.33%','Supplier\u2019s 2023A CF'],
  ['Qualys Inc','Software',1.15,'<0.01%','COGS','0.16%','Supplier\u2019s 2022Q3 CF'],
  ['IonQ Inc','Software',0.59,'<0.01%','COGS','0.18%','Supplier\u2019s 2026Q2 CF'],
  ['Verimatrix SA','Software',0.09,'<0.01%','COGS','0.20%','Supplier\u2019s 2023A CF'],
  ['T Stamp Inc','Software',0.07,'<0.01%','COGS','1.92%','Supplier\u2019s 2024Q3 CF'],
];
var MA_SUP_GROUPS=[
  { t:'Software, cloud and data', note:'the largest group by count',
    names:['Cloudflare','ACI Worldwide','Oracle','Microsoft','Snowflake','Informatica','Databricks','FullStory','Azul Systems','GB Group','Beijing Shiji Information Technology','Ebix','Intelligent Wave','Rezolve AI','Riskified','Kudelski','Qualys','IonQ','Verimatrix','T Stamp'] },
  { t:'IT services and outsourcing', note:'Infosys alone is $145M of the $213M that Bloomberg sizes',
    names:['Infosys','Bytes Technology','Endava','Itera','Quisitive','IT Way','CSG Systems','Elixirr International'] },
  { t:'Payments technology and specialty finance', note:'processors and issuer-processing partners',
    names:['Global Payments','Euronet','Network International','Usio','Currenc','EML Payments'] },
  { t:'Technology hardware and semiconductors', note:'cards, biometrics, terminals and compute',
    names:['NVIDIA','D-Wave Quantum','Goldpac','Newland Digital','GMO Financial Gate','Fingerprint Cards','IDEX Biometrics','Hengbao','Wuhan Tianyu Information Industry'] },
  { t:'Advertising, sponsorship and travel', note:'marketing agencies, sports and entertainment, travel data',
    names:['WPP','Mission Group','Ascential','MediaZest','McLaren Racing','Olympique Lyonnais','Live Nation','Amadeus IT Group','Malaysia Airports'] },
  { t:'Offices and other', note:'real estate and telecom',
    names:['International Workplace Group','Piedmont Realty','Societe Fonciere Lyonnaise','Wallenstam','Helical','CPI Property Group','ADN Telecom','Beijing Yuanlong Yato Culture Dissemination'] },
];
function maSupplierChips(){
  var sum=MA_SUP_SIZED.reduce(function(a,r){ return a+r[2]; },0), top=MA_SUP_SIZED[0][2];
  var tile=function(l,v,d){ return '<div class="ov-kpi"><div class="ov-kpi-l">'+l+'</div><div class="ov-kpi-v">'+v+'</div><div class="ov-kpi-d muted">'+d+'</div></div>'; };
  var h='<div class="ov-kpis">'+
    tile('Named suppliers','60','Bloomberg SPLC, Oct 28 2026')+
    tile('With a size','13','$'+sum.toFixed(0)+'M together, a Bloomberg estimate')+
    tile('Largest','Infosys','$'+top.toFixed(0)+'M \u00b7 '+(top/sum*100).toFixed(0)+'% of the sized total \u00b7 1.10% of SG&A')+
    tile('Domiciled in','US 35% \u00b7 UK 18% \u00b7 China 8%','21, 11 and 5 of the 60 suppliers')+
  '</div>';
  h+='<div class="asc-tblwrap" style="margin-top:12px"><table class="asc-tbl"><thead><tr><th>Supplier</th><th>Industry</th><th>Relationship size</th><th>% of Mastercard cost</th><th>Cost category</th><th>% of supplier\u2019s revenue</th><th>Source</th></tr></thead><tbody>'+
    MA_SUP_SIZED.map(function(r){ return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td class="asc-m">$'+r[2].toFixed(2)+'M</td><td class="asc-m">'+esc(r[3])+'</td><td>'+esc(r[4])+'</td><td class="asc-m">'+esc(r[5])+'</td><td>'+esc(r[6])+'</td></tr>'; }).join('')+
  '</tbody></table></div>';
  h+='<div class="ov-subh" style="margin:14px 0 6px">All 60 named suppliers, grouped by what they sell <span style="font-weight:600;color:var(--mu)">(grouping is ours)</span></div>';
  h+=MA_SUP_GROUPS.map(function(g){ return '<div style="margin:10px 0 4px"><div style="font-size:12px;font-weight:800;color:var(--navy);margin-bottom:5px">'+esc(g.t)+' <span style="font-weight:600;color:var(--mu);font-size:10.5px">\u2014 '+esc(g.note)+'</span></div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:5px">'+g.names.map(function(n){ return '<span class="asc-chip" style="cursor:default">'+esc(n)+'</span>'; }).join('')+'</div></div>'; }).join('');
  return h;
}
function ddSuppliersBody(c){
  var h='<p class="ov-lede">Mastercard is an <b>asset-light network</b>: it does not issue, lend or take credit risk. So "suppliers" means two different things — the <b>four-party model</b> (the conceptual supply chain of the rails), and the <b>real vendor list</b> (who Mastercard actually pays), which turns out to be <b>almost entirely IT, cloud, software and security</b>. That second list <i>is</i> the asset-light thesis.</p>';
  h+=sec('The four-party (open-loop) model',
      '<div class="ov-diagram-cap" style="margin:0 0 8px">The conceptual supply chain of the rails — tap any box for its role, then press <b>Play</b> to follow a single $100 purchase and see who earns at each step.</div>'+
      '<div class="ov-diagram" style="margin-top:6px">'+FOURPARTY_SVG+'</div>'+flowHtml());
  h+=sec('The real vendor supply chain — who Mastercard actually pays',
      '<div class="ov-diagram-cap" style="margin:0 0 10px">From <b>Bloomberg SPLC</b> (as of Oct 28 2026). There are no factories, commodities or cost of goods here: Mastercard’s suppliers are <b>software, cloud, IT services, security and payments technology</b>. Only 13 of the 60 carry a size, a Bloomberg estimate; the rest are named without one.</div>'+maSupplierChips());
  h+=sec('How Mastercard makes money', '<div class="ov-callout">'+bullets(HOW_MONEY)+'</div>');
  h+='<div class="ov-foot">Vendor list and relationship sizes: Bloomberg SPLC (Supply Chain Analysis), MA US Equity, Suppliers, as of Oct 28 2026. Sizes and the share of Mastercard\u2019s cost are Bloomberg estimates (size source: BBG Estimate); the relationships themselves come from the counterparties\u2019 filings or company news, not from a Mastercard statement. Geography: 60 suppliers domiciled, 69 supplier facilities. Grouping is editorial.</div>';
  return h;
}
// ── Bottom Line ▸ Margins — profitability & cash margins as % of revenue. Sourced fallback
// (FY21–25 actuals from the model/filings, FY26E from the Summit model); the live Massive
// feed (api.fetchMargins) overrides it when reachable. MA has no cost-of-revenue line, so
// there is no "gross" margin — the story is operating/EBITDA/net/cash. ──
var _maMrgSrc='fallback';
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
    '.mstr-verb{flex:1;min-width:150px;border:1px solid var(--bdr);border-top:4px solid '+MA_RED+';border-radius:13px;padding:15px 16px;text-align:center;background:linear-gradient(180deg,rgba(62,90,130,.055),var(--w))}'+
    '.mstr-verb-ic{font-size:25px;line-height:1}.mstr-verb-v{font-size:23px;font-weight:900;color:var(--navy);margin-top:5px;letter-spacing:-.4px}'+
    '.mstr-verb-l{font-size:11px;color:var(--mu);font-weight:700;margin-top:2px}'+
    '.mstr-plus{align-self:center;font-size:22px;font-weight:900;color:'+MA_RED+'}@media(max-width:640px){.mstr-plus{display:none}}'+
    '.mstr-verb.ov-clickable{cursor:pointer;transition:box-shadow .15s,transform .1s}.mstr-verb.ov-clickable:hover{box-shadow:0 5px 16px rgba(62,90,130,.13);transform:translateY(-1px)}'+
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
        '<div class="mad-chips">'+['Security','Identity','Data & AI','Open banking','A2A rails'].map(function(x){ return '<span class="mad-chip" style="background:rgba(62,90,130,.08);color:'+MA_RED+'">'+esc(x)+'</span>'; }).join('')+'</div></div>'+
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
    '.lsv-col.ov-clickable{cursor:pointer;transition:box-shadow .15s,border-color .15s}.lsv-col.ov-clickable:hover{border-color:'+MA_RED+';box-shadow:0 2px 10px rgba(62,90,130,.08)}'+
    '.lsv-more{margin-top:10px;font-size:11px;font-weight:800;color:'+MA_RED+';text-align:right}</style>';
  h+='<p class="ov-lede">The bull/bear forces and disintermediation threats live in <b>Top Line ▸ Industry Analysis</b>. This tab covers the one risk <b>structurally specific to Mastercard</b>: how it bears decades of interchange antitrust litigation — and why that lands differently than at Visa.</p>';
  h+='<p class="ov-lede" style="margin-bottom:14px">'+LIT_INTRO+'</p>';
  h+=sec('Interchange litigation — by jurisdiction', litFlagCards());
  h+=sec('Who absorbs the hit — Mastercard vs Visa', litShieldVisual());
  h+='<div class="ov-foot">Sources: Mastercard 10-K legal proceedings; UK Competition Appeal Tribunal (Merricks); reporting on MDL 1720 (2024 revised settlement, rejected by merchants); EU interchange regulation.</div>';
  return h;
}
// ── Valuation ▸ Multiples — how the listed peers trade (the qualitative map is in Industry). ──
// ════════════════════════════════════════════════════════════════════════════
//  Evolution ▸ Guidance — SAME format as UBER/LYFT/CART: metric toggle → quarterly
//  guided-range (floating bar) vs delivered (dot, colored by landing) + landing
//  table. Mastercard guides NET-REVENUE growth and OPERATING-EXPENSE growth (both
//  currency-neutral, ex-acquisitions); it does NOT guide EPS. Bands are indicative
//  mappings of MA's qualitative language ("low-teens" → 12–14%); delivered = reported
//  cn ex-acq growth. Sourced from the quarterly calls (Q4-23 → Q1-26 provided). ──
var MA_GQ=['Q2 21','Q3 21','Q4 21','Q1 22','Q2 22','Q3 22','Q4 22','Q1 23','Q2 23','Q3 23','Q4 23','Q1 24','Q2 24','Q3 24','Q4 24','Q1 25','Q2 25','Q3 25','Q4 25','Q1 26','Q2 26','Q3 26','Q4 26'];
var MA_GUIDE={
  netrev:{ label:'Net-revenue growth', axis:'net-revenue growth (cn, ex-acq)',
    glo:[21,25,21,18,18,18,15,10,12,10,10,10,10,12,13,13,13,12,12,10,10,12,12], ghi:[24,26,23,19,19,19,16,11,13,12,11,11,12,13,14,14,14,13,13,11,11,13,13],
    words:['low-to-mid 20s','high end of mid-20s','low 20s','high end of high-teens','high end of high-teens','high end of high-teens','high end of mid-teens','low end of low double-digits','high end of low double-digits','low double-digits','low end of low double-digits','low end of low double-digits','low double-digits','high end of low double-digits','low teens','low teens','low teens','high end of low double-digits','high end of low double-digits','low end of low double-digits','low end of low double-digits (Middle East)','high end of low double-digits','high end of low double-digits'],
    act:[28,26,25,25,26,22,16,14,15,11,11,11,13,14,16,16,15,14,14,12,12,14,null],
    note:'Net revenue has never landed below its guided band in the 22 quarters on file: <b>17 above it and 5 in its top half</b>. The step down from the 2021-22 reopening growth to low double-digits is in the guide itself, and the front of 2026 was the one place management guided deliberately low ("low end of low double-digits" for Q1 and Q2, delivered +12% both times). Q3 2026 was guided to the high end of low double-digits and delivered +14%, above the band; the CFO said part of it was revenue pulled forward from Q4. Q4 2026 is guided to the high end of low double-digits again (no actual yet).' },
  opex:{ label:'Operating-expense growth', axis:'operating-expense growth (cn, ex-acq)',
    glo:[21,15,10,8,7,12,10,7,12,8,7,8,10,10,12,10,10,10,10,8,10,10,12], ghi:[23,16,11,9,9,13,12,8,13,9,9,9,11,12,13,12,11,11,12,9,11,12,13],
    act:[20,15,12,7,7,14,10,10,13,8,9,9,10,12,14,10,10,10,7,9,11,11,null],
    words:['low 20s','high end of mid-teens','low end of low double-digits','high end of high single-digits','high single-digits','high end of low double-digits','low double-digits','low end of high single-digits','high end of low double-digits','high end of high single-digits','high single-digits','high end of high single-digits','low end of low double-digits','low double-digits','high end of low double-digits','low double-digits','low end of low double-digits','low end of low double-digits','low double-digits','high end of high single-digits','low end of low double-digits','low double-digits','high end of low double-digits'],
    note:'Opex is guided and delivered ex-acquisitions (the deals added 4-8 PPT to reported opex in 2021-22 and 4-5 PPT in 2025, stated separately each quarter). Delivered lands <b>inside or in the top half of the band in 15 of 22 quarters, above it in 4 and below it in 3</b>: Q2 2021, Q1 2022 and Q4 2025 (+7% ex-acquisitions; the call puts about 5.5 PPT of that quarter\u2019s opex growth on the full-year effect of the 2025 equity grants).' },
};
var MA_FY=[
  ['FY 2022','Jan 2022','high end of high-teens','low end of low double-digits'],['','Apr 2022','high end of high-teens','high single-digits'],['','Jul 2022','low twenties','low end of low double-digits'],
  ['FY 2023','Jan 2023','high end of low double-digits','high end of high single-digits'],['','Apr 2023','low teens','high end of high single-digits'],['','Jul 2023','low teens','high end of high single-digits'],
  ['FY 2024','Jan 2024','high end of low double-digits','low end of low double-digits'],['','Apr 2024','high end of low double-digits','low end of low double-digits'],['','Jul 2024','high end of low double-digits','low end of low double-digits'],
  ['FY 2025','Jan 2025','high end of low double-digits to low teens','low end of low double-digits'],['','Apr 2025','high end of low double-digits to low teens','low end of low double-digits'],['','Jul 2025','low teens','low end of low double-digits'],['','Oct 2025','low teens','low end of low double-digits'],
  ['FY 2026','Jan 2026','high end of low double-digits','low end of low double-digits'],['','Apr 2026','high end of low double-digits','low double-digits'],['','Jul 2026','high end of low double-digits (higher within the range)','low double-digits'],['','Oct 2026','high end of low double-digits','low double-digits']
];
function maFyBody(){
  var rows=MA_FY.map(function(r){ return '<tr><td>'+(r[0]?'<b>'+esc(r[0])+'</b>':'')+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td>'+esc(r[3])+'</td></tr>'; }).join('');
  return '<div class="guid-tbl-wrap" style="margin-top:14px"><div class="ov-chart-t" style="margin-bottom:6px">Full-year guide, as it moved <span>· cn, ex-acq</span></div><table class="guid-tbl"><thead><tr><th>Year</th><th>Given</th><th>Net revenue growth</th><th>Operating expense growth</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}
var _maGuideMetric='netrev';
function maGuidePct(v){ return v==null?'—':(v>0?'+':'')+v+'%'; }
function maGuideColor(a,lo,hi){ if(a==null) return MA_STEEL; if(a>hi) return MA_GREEN; if(a>=lo) return MA_RED; return '#C0392B'; }
function maGuideLand(a,lo,hi){ if(a==null) return { t:'current guide', c:'guid-mut' }; var mid=(lo+hi)/2;
  if(a>hi) return { t:'above range', c:'guid-up' }; if(a>=mid) return { t:'upper half', c:'' }; if(a>=lo) return { t:'in range', c:'' }; return { t:'below range', c:'guid-dn' }; }
function maGuideBody(c){
  var h='<p class="ov-lede">Mastercard <b>does not guide EPS</b>. Every quarter, and again for the full year, it guides two things — <b>net-revenue growth</b> and <b>operating-expense growth</b>, both <b>currency-neutral and ex-acquisitions</b>, in words, and the earnings deck reconciles each guide from GAAP growth to that basis. Switch metric, then read the <b>guided band vs what it delivered</b> (the dot); green = above the range. Bands are indicative numeric mappings of those words.</p>';
  h+='<div class="guid-pills">'+['netrev','opex'].map(function(k){ return '<button type="button" class="guid-pill'+(k===_maGuideMetric?' active':'')+'" data-maguidm="'+k+'">'+esc(MA_GUIDE[k].label)+'</button>'; }).join('')+'</div>';
  h+='<div id="maGuideLeg" style="margin-bottom:6px"></div>';
  h+='<div class="ov-chart-card"><div class="ov-chart-t" id="maGuideT"></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="maGuideChart"></canvas></div></div>';
  h+='<div class="ov-fynote" id="maGuideNote" style="margin-top:8px"></div>';
  h+='<div class="guid-tbl-wrap" style="margin-top:12px"><div id="maGuideTbl"></div></div>'+maFyBody();
  h+='<div class="ov-foot">Sources: Mastercard earnings presentations, Q1 2021 – Q3 2026 (Appendix B and C, the non-GAAP reconciliation of each outlook, row "Non-GAAP growth, currency-neutral, excluding acquisitions"). Delivered = currency-neutral growth in the earnings release less the acquisition or disposition points it states; the CFO outlook on the calls (Q4 2023 – Q3 2026) agrees with the decks. Mastercard guides in words, so the bands are an <b>indicative</b> mapping: low end of low double-digits 10–11%, low double-digits 10–12%, high end of low double-digits 12–13%, low teens 13–14%, mid-teens 14–16%, high-teens 17–19%, the 20s as stated, high end of high single-digits 8–9%, high single-digits 7–9%. Delivered values are rounded to the point, as the releases give them. Q3 2026 shows the current guide (no actual yet). The deck guides only the next quarter and the year in progress; the October full-year update for 2022, 2023 and 2024 is not in the table.</div>';
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
  var t=document.getElementById('maGuideT'); if(t) t.innerHTML=esc(MA_GUIDE[_maGuideMetric].label)+' — guided range vs delivered <span>· per quarter · cn, ex-acq · Q4 26 = current guide</span>';
  var note=document.getElementById('maGuideNote'); if(note) note.innerHTML=MA_GUIDE[_maGuideMetric].note;
  buildMaGuideChart(); renderMaGuideTable();
}
function switchMaGuideMetric(root,k){ if(!MA_GUIDE[k]) return; _maGuideMetric=k;
  root.querySelectorAll('.guid-pill[data-maguidm]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-maguidm')===k); });
  renderMaGuide(); }

// ════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
//  Evolution ▸ EARNINGS (Setup · Post-Results · Notes) lives in ./ma-ce.js (the playbook machinery, copied from sofi-ce.js) with
//  its data in ./ma-ce-data.js and the theme record in ../themes-data/ma.js. The earlier inline v2.10 build (CE_CONS, CALL_EARNINGS,
//  WL_ROWS, MA_THEMES, the AI summary and the "points for the call" blocks) was replaced on Oct 28 2026: its numbers are rebuilt from
//  js/results-data/ma.js, its notes, call highlights and theme record were moved into the new files, and the AI-authored blocks were
//  retired per the playbook (EV-POST). The old build is in git history (commit c253dad and earlier).
// ═══════════════════════════════════════════════════════════════════════════
function ceResultsPending(label){
  return '<div class="ce-note" style="margin:8px 0"><b>'+esc(label)+'</b> — not available yet. It needs at least two saved Summit model snapshots, which are pulled from the Summit MCP; '+
    'the MCP was not reachable when this profile was built, so the pane stays empty rather than showing a made-up history.</div>';
}

// ════════════════════════════════════════════════════════════════════════════
//  Valuation ▸ Sensitivity — a multi-driver model (SoFi pattern). Turn Mastercard’s
//  revenue algorithm into an EPS and an implied price. Base ≈ FY26E. Live price via
//  api.liveQuote overrides the anchor. All drivers flex from the base case. ──
var MA_SENS_DRIVERS=[
  { k:'gnet', label:'Payment Network growth', unit:'%', min:-10, max:20, step:0.5, hint:'net revenue after client incentives, versus the year before' },
  { k:'gvas', label:'Value-added services growth', unit:'%', min:5, max:35, step:1, hint:'versus the year before' },
  { k:'opm',  label:'Operating margin', unit:'%', min:50, max:65, step:0.5, hint:'operating income as a share of net revenue' },
  { k:'buy',  label:'Net share reduction (buyback)', unit:'%', min:0, max:6, step:0.25, hint:'fall in ending diluted shares versus the year before' },
  { k:'pe',   label:'P/E on the model EPS', unit:'×', min:15, max:45, step:0.5, hint:'starts at the market multiple on the model EPS when the live price is in' },
];
var _maSens={}, _maSensY=2027, _maSensPeTouched=false, _maLivePx=null;
function maSensIdx(y){ return MA_SENS_MODEL.years.indexOf(y); }
function maSensBase(y){
  var M=MA_SENS_MODEL, i=maSensIdx(y), p=i-1;
  var rev=M.pnr[i]+M.vas[i];
  return { gnet:(M.pnr[i]/M.pnr[p]-1)*100, gvas:(M.vas[i]/M.vas[p]-1)*100, opm:M.opinc[i]/rev*100, buy:(1-M.sh[i]/M.sh[p])*100,
           ni2op:M.ni[i]/M.opinc[i], pnrPrev:M.pnr[p], vasPrev:M.vas[p], shPrev:M.sh[p], eps:M.eps[i], rev:rev };
}
function maSensSnap(v,d){ return Math.round(v/d.step)*d.step; }
function maSensFmt(v){ return (Math.round(v*100)/100)+''; }
function maSensReset(){
  var B=maSensBase(_maSensY); _maSensPeTouched=false;
  MA_SENS_DRIVERS.forEach(function(d){
    if(d.k==='pe'){ _maSens.pe=_maLivePx?maSensSnap(_maLivePx/B.eps,d):30; return; }
    _maSens[d.k]=Math.max(d.min,Math.min(d.max,B[d.k])); });
}
maSensReset();
function maSensCompute(){
  var s=_maSens, B=maSensBase(_maSensY);
  var netRev = B.pnrPrev*(1+s.gnet/100) + B.vasPrev*(1+s.gvas/100);   // $B
  var opInc  = netRev*(s.opm/100);
  var netInc = opInc*B.ni2op;                                          // $B
  var shares = B.shPrev*(1-s.buy/100);                                 // M
  var eps    = (netInc*1000)/shares;                                   // $
  return { netRev:netRev, opInc:opInc, netInc:netInc, eps:eps, price:eps*s.pe, modelEps:B.eps };
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
    '.msn-price{grid-column:1 / -1;border-top:3px solid '+MA_RED+';background:rgba(62,90,130,0.05)}.msn-price .msn-tile-v{font-size:26px;color:'+MA_RED+'}'+
    '.msn-up{font-size:12.5px;font-weight:800;margin-top:3px}.msn-reset{margin-top:12px;font-size:11px;font-weight:800;color:'+MA_RED+';background:none;border:1px solid '+MA_RED+';border-radius:8px;padding:6px 12px;cursor:pointer}</style>';
  var M=MA_SENS_MODEL, dcfToday=M.dcf.intrinsic.filter(function(x){ return x[0]==='Today'; })[0];
  h+='<p class="ov-lede">Mastercard doesn\u2019t guide EPS, so this turns its <b>revenue algorithm</b> into one. Pick a year, move any driver and the equation, the tiles and the <b>implied price</b> (EPS \u00d7 P/E) recompute. Every driver starts at what the <b>Summit model</b> has for that year, so the base case reproduces the model\u2019s EPS.</p>';
  h+='<div class="msn-years" id="maSensYears" style="display:flex;gap:6px;margin:0 0 12px">'+[2026,2027,2028,2029].map(function(y){
    return '<button type="button" class="msn-yr'+(y===_maSensY?' on':'')+'" data-masy="'+y+'" style="font:inherit;font-size:11px;font-weight:800;padding:5px 12px;border-radius:999px;border:1px solid var(--bdr);background:'+(y===_maSensY?'var(--navy)':'var(--w)')+';color:'+(y===_maSensY?'#fff':'var(--mu)')+';cursor:pointer">FY'+y+'E</button>'; }).join('')+'</div>';
  h+='<div class="msn-wrap"><div id="maSensDrivers">'+MA_SENS_DRIVERS.map(function(d){
      return '<div class="msn-drv"><div class="msn-drl"><span class="msn-dn">'+esc(d.label)+'</span><span class="msn-dv" id="maSensV-'+d.k+'">'+maSensFmt(_maSens[d.k])+d.unit+'</span></div>'+
        '<input type="range" class="msn-slider" id="maSens-'+d.k+'" min="'+d.min+'" max="'+d.max+'" step="'+d.step+'" value="'+_maSens[d.k]+'">'+
        '<div class="msn-dh">'+esc(d.hint)+'</div></div>'; }).join('')+
      '<button type="button" class="msn-reset" id="maSensReset">\u21ba Reset to the Summit model</button></div>'+
    '<div><div class="msn-eq" id="maSensEq"></div><div class="msn-tiles" id="maSensTiles"></div></div></div>';
  h+='<div class="ov-fynote" style="margin-top:14px"><b>How it chains:</b> last year\u2019s Payment Network and VAS revenue grown by the two drivers \u2192 operating income (\u00d7 margin) \u2192 net income (\u00d7 the model\u2019s net-to-operating ratio) \u2192 EPS (\u00f7 ending shares, net of buyback) \u2192 <b>price = EPS \u00d7 P/E</b>. The Summit model has Payment Network almost flat after 2026 (client incentives grow faster than gross revenue), so that driver starts near zero: it is the model\u2019s assumption, not a forecast of the network. '+
    'The Summit DCF itself values the shares at <b>$'+Math.round(dcfToday[1])+'</b> today (WACC '+(M.dcf.wacc*100).toFixed(1)+'%, terminal '+M.dcf.terminalEvEbitda+'\u00d7 EV/EBITDA) against a workbook price of $'+M.dcf.workbookPrice.toFixed(2)+'. The target multiple of the model lives in the Summit MCP and is not in the workbook, so the P/E starts at the market multiple instead.</div>';
  h+='<div class="ov-foot">'+esc(M.src)+'. Live price via Massive when the call responds; no price is written into this file. All outputs are model estimates.</div>';
  return h;
}
function maSensRender(root){
  root=root||document; var r=maSensCompute();
  if(_maLivePx && !_maSensPeTouched){ var d=MA_SENS_DRIVERS.filter(function(x){ return x.k==='pe'; })[0], nv=maSensSnap(_maLivePx/r.modelEps,d); if(nv!==_maSens.pe){ _maSens.pe=nv; r=maSensCompute(); var el=root.querySelector('#maSens-pe'); if(el) el.value=nv; var vv=root.querySelector('#maSensV-pe'); if(vv) vv.textContent=nv+'\u00d7'; } }
  var px=_maLivePx, up=px?(r.price/px-1)*100:null, upCol=(up!=null&&up>=0)?'#0F9D58':'#C0392B';
  var eq=root.querySelector('#maSensEq');
  if(eq) eq.innerHTML='Net revenue <b>$'+r.netRev.toFixed(1)+'B</b> \u2192 operating income <b>$'+r.opInc.toFixed(1)+'B</b> \u2192 net income <b>$'+r.netInc.toFixed(1)+'B</b> \u2192 EPS <b>$'+r.eps.toFixed(2)+'</b> \u2192 price = EPS \u00d7 P/E = <b>$'+Math.round(r.price)+'</b>';
  var tiles=root.querySelector('#maSensTiles');
  if(tiles) tiles.innerHTML=
    '<div class="msn-tile"><div class="msn-tile-v">$'+r.netRev.toFixed(1)+'B</div><div class="msn-tile-l">Net revenue</div></div>'+
    '<div class="msn-tile"><div class="msn-tile-v">$'+r.eps.toFixed(2)+'</div><div class="msn-tile-l">EPS (this case) \u00b7 Summit model $'+r.modelEps.toFixed(2)+'</div></div>'+
    '<div class="msn-tile msn-price"><div class="msn-tile-l" style="margin-bottom:2px">Implied price</div><div class="msn-tile-v">$'+Math.round(r.price)+'</div>'+
      (px?'<div class="msn-up" style="color:'+upCol+'">'+(up>=0?'+':'')+up.toFixed(1)+'% vs $'+Math.round(px)+' live</div>':'<div class="msn-up" style="color:var(--mu)">\u2691 Live price pending: no upside shown</div>')+'</div>';
}
function maSensInit(root){
  root=root||document;
  function paint(){ MA_SENS_DRIVERS.forEach(function(d){ var el=root.querySelector('#maSens-'+d.k); if(el) el.value=_maSens[d.k]; var v=root.querySelector('#maSensV-'+d.k); if(v) v.textContent=maSensFmt(_maSens[d.k])+d.unit; }); }
  MA_SENS_DRIVERS.forEach(function(d){ var el=root.querySelector('#maSens-'+d.k); if(!el) return;
    el.oninput=function(){ _maSens[d.k]=parseFloat(el.value); if(d.k==='pe') _maSensPeTouched=true; var v=root.querySelector('#maSensV-'+d.k); if(v) v.textContent=el.value+d.unit; maSensRender(root); }; });
  var rb=root.querySelector('#maSensReset'); if(rb) rb.onclick=function(){ maSensReset(); paint(); maSensRender(root); };
  root.querySelectorAll('#maSensYears [data-masy]').forEach(function(b){ b.onclick=function(){
    _maSensY=parseInt(b.getAttribute('data-masy'),10); maSensReset();
    root.querySelectorAll('#maSensYears [data-masy]').forEach(function(x){ var on=(x===b); x.classList.toggle('on',on); x.style.background=on?'var(--navy)':'var(--w)'; x.style.color=on?'#fff':'var(--mu)'; });
    paint(); maSensRender(root); }; });
  maSensRender(root);
}

// ════════════════════════════════════════════════════════════════════════════
//  Valuation ▸ Capital Allocation — the asset-light cash machine returns ~all FCF.
//  Buybacks ($11.7B FY25 per the 10-K) + a serially-raised dividend, shares down ~990M→~906M.
//  Figures directional (annual splits from cash-flow statements / press). ──

// ════════════════════════════════════════════════════════════════════════════
//  Management ▸ Governance & SBC — clean governance (independent chair, single
//  class, no litigation escrow) and modest, buyback-swamped stock comp. SBC $ and
//  share count directional (from proxy / cash-flow statements). ──

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

// ── Management ▸ Ownership and Governance, and Valuation ▸ Peers: built from the Results dataset (Bloomberg) where a number exists. ──
function maYrow(key){
  var m=maResults.views.y.metrics[key], out=[];
  ['2021','2022','2023','2024','2025','2026'].forEach(function(y){ var i=m.periods.indexOf(y), a=m.act[i], e=(a==null);
    out.push({ fy:'FY'+y.slice(2)+(e?'E':''), y:y, v:e?m.cons[i]:a, est:e}); });
  return out;
}
function maB(v){ return v==null?'\u2014':'$'+(v/1000).toFixed(1)+'B'; }
function maOwnBody(c){
  var buy=maYrow('buyback'), fcf=maYrow('fcf'), sh=maYrow('shares'), a=buy[4], f=fcf[4];
  var pct=(a.v&&f.v)?Math.round(a.v/f.v*100):null, shDrop=((sh[0].v-sh[4].v)/sh[0].v*100).toFixed(1);
  var h='<p class="ov-lede">Mastercard is an <b>asset-light cash machine</b>: almost no capex and no credit risk, so nearly all free cash flow goes back to shareholders, and the lever that moves is the <b>buyback</b>. It has taken the diluted share count down every year since 2021, and the Street expects the pace to rise again in 2026.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">FY25 buybacks</div><div class="ov-kpi-v">'+maB(a.v)+'</div><div class="ov-kpi-d muted">Street FY26E '+maB(buy[5].v)+'</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Buybacks \u00f7 free cash flow, FY25</div><div class="ov-kpi-v">'+(pct==null?'\u2014':pct+'%')+'</div><div class="ov-kpi-d muted">FCF '+maB(f.v)+'</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Diluted shares FY21\u2192FY25</div><div class="ov-kpi-v">\u2212'+shDrop+'%</div><div class="ov-kpi-d muted">'+Math.round(sh[0].v)+'M \u2192 '+Math.round(sh[4].v)+'M</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Dividend per share, FY25</div><div class="ov-kpi-v">$3.04</div><div class="ov-kpi-d muted">+15% from $2.64 · $2.8B paid · $0.87 a quarter declared for 2026</div></div>'+
  '</div>';
  h+=sec('Capital returned vs free cash flow',
    '<div class="ov-chart-card"><div class="ov-chart-t">Share repurchases vs free cash flow <span>\u00b7 $B \u00b7 fiscal years \u00b7 FY26E = Bloomberg consensus</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="maChartCapital"></canvas></div></div>'+
    '<div class="ov-chart-card" style="overflow-x:auto;margin-top:10px"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="color:var(--mu)"><th style="text-align:left;padding:6px 10px">FY</th><th style="text-align:right;padding:6px 10px">Free cash flow</th><th style="text-align:right;padding:6px 10px">Buybacks</th><th style="text-align:right;padding:6px 10px">Buybacks \u00f7 FCF</th><th style="text-align:right;padding:6px 10px">Diluted shares</th></tr></thead><tbody>'+
      buy.map(function(r,i){ var fv=fcf[i].v; return '<tr style="border-top:1px solid var(--bdr)"><td style="padding:7px 10px;font-weight:800">'+esc(r.fy)+'</td><td style="text-align:right;padding:7px 10px">'+maB(fv)+'</td><td style="text-align:right;padding:7px 10px">'+maB(r.v)+'</td><td style="text-align:right;padding:7px 10px">'+((r.v&&fv)?Math.round(r.v/fv*100)+'%':'\u2014')+'</td><td style="text-align:right;padding:7px 10px">'+(sh[i].v==null?'\u2014':Math.round(sh[i].v)+'M')+'</td></tr>'; }).join('')+
    '</tbody></table></div>'+
    '<div class="ov-fynote" style="margin-top:8px">Repurchases are shown as positive spend; the Bloomberg series arrives negative. An E marks the Street estimate for a year not yet reported. The 10-K reports $11.7B of repurchases in FY2025 (21.1M shares) and $2.8B of dividends, $14.5B returned in total; the Bloomberg repurchase line reads $12.0B.</div>');
  h+=sec('Executives & insider activity \u2014 live from Fiscal.ai','<div id="dd-mgmt-slot"></div>');
  h+='<div class="ov-foot">Sources: free cash flow, repurchases and diluted shares from the Bloomberg consensus export (BBG_CONSENSUS.txt, snapshot 2026-10-28; reported actuals and the FY26 consensus). Dividends and the repurchase reconciliation from the FY2025 Form 10-K (Item 7); the holder table comes from the DEF 14A and is not loaded yet; insider activity is live from Fiscal.ai when the plan covers the company.</div>';
  return h;
}
function buildMaCapital(){
  var cv=document.getElementById('maChartCapital'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var ex=Chart.getChart?Chart.getChart(cv):null; if(ex) ex.destroy();
  var buy=maYrow('buyback'), fcf=maYrow('fcf');
  new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:buy.map(function(r){ return r.fy; }), datasets:[
      { label:'Buybacks', data:buy.map(function(r){ return r.v==null?null:r.v/1000; }), backgroundColor:buy.map(function(r){ return r.est?SUMMIT_CAT[0]+'80':SUMMIT_CAT[0]; }), borderRadius:4, maxBarThickness:40 },
      { label:'Free cash flow', type:'line', data:fcf.map(function(r){ return r.v==null?null:r.v/1000; }), borderColor:SUMMIT_CAT[1], backgroundColor:SUMMIT_CAT[1], borderWidth:2.5, tension:.25, pointRadius:3, order:0 }
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': $'+ctx.parsed.y.toFixed(1)+'B'; } } } },
      scales:{ y:{ ticks:{ callback:function(v){ return '$'+v+'B'; }, font:{size:10} }, grid:{color:'#EEF2F7'} }, x:{ grid:{display:false}, ticks:{font:{size:10.5}} } } }
  });
}
function maGovBody(c){
  var sbc=maYrow('sbc'), rev=maYrow('rev'), sh=maYrow('shares'), a=sbc[4], r=rev[4];
  var pct=(a.v&&r.v)?(a.v/r.v*100).toFixed(1):null;
  var h='<p class="ov-lede">Two things to check on a compounder: is the <b>governance</b> clean, and is <b>stock comp</b> quietly diluting you? Mastercard has an <b>independent chair</b>, a <b>single class</b> of stock, and stock comp of about <b>'+(pct||'\u2014')+'% of net revenue</b> that the buyback more than offsets.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Voting structure</div><div class="ov-kpi-v">1 vote / share</div><div class="ov-kpi-d muted">single class, no escrow shield</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Board independence</div><div class="ov-kpi-v">10 of 11</div><div class="ov-kpi-d muted">independent chair</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">SBC FY25</div><div class="ov-kpi-v">'+(a.v==null?'\u2014':'$'+Math.round(a.v)+'M')+'</div><div class="ov-kpi-d muted">'+(pct||'\u2014')+'% of net revenue</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Diluted shares FY21\u2192FY25</div><div class="ov-kpi-v">'+Math.round(sh[0].v)+'M \u2192 '+Math.round(sh[4].v)+'M</div><div class="ov-kpi-d muted">net of SBC issuance</div></div>'+
  '</div>';
  h+=sec('How Mastercard is governed',
    '<div class="ov-grid2" style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="ov-callout"><div class="ov-subh" style="margin:0 0 6px">Shareholder-friendly</div>'+bullets([
      '<b>Independent Chair</b> (Merit E. Janow); CEO Miebach is <b>not</b> chairman, so the roles are split.',
      '<b>Single class of common stock</b>: one share, one vote; no founder super-voting.',
      '<b>Operator-heavy board</b> (former CEOs of U.S. Bancorp, Ita\u00fa and Singapore Airlines; the Markit founder); see Track Record.',
      'Serial dividend increases and a standing multi-billion buyback authorization.']) +'</div>'+
    '<div class="ov-callout"><div class="ov-subh" style="margin:0 0 6px">Things to know</div>'+bullets([
      '<b>No litigation-escrow shield</b> (unlike Visa\u2019s Class-B): interchange litigation hits Mastercard directly (see Miscellaneous \u25b8 Litigation & regulation).',
      'The <b>Mastercard Foundation</b> historically held a large Class-A stake with <b>voting caps and a required sell-down</b>: a governance feature, not an overhang on control.',
      'Executive pay is heavily equity- and performance-linked; watch the grant size against the modest SBC expense.']) +'</div></div>');
  h+=sec('Stock-based comp \u2014 modest, and more than bought back',
    '<div class="ov-chart-card"><div class="ov-chart-t">SBC ($M, bars) vs diluted shares (M, line) <span>\u00b7 fiscal years \u00b7 FY26E = Bloomberg consensus</span></div><div class="ov-chart-wrap ovt-ue-wrap"><canvas id="maChartSbc"></canvas></div></div>'+
    '<div class="ov-fynote" style="margin-top:8px">Stock comp has grown with the company but stays under 2% of net revenue, and the buyback (see Ownership) outruns the shares it issues, so the diluted count falls every year. The SBC chart by quarter lives in Bottom Line \u25b8 General.</div>');
  h+='<div class="ov-foot">Sources: Mastercard 2026 DEF 14A (governance, board independence, pay); SBC, revenue and diluted shares from the Bloomberg consensus export (BBG_CONSENSUS.txt, snapshot 2026-10-28).</div>';
  return h;
}
function buildMaSbc(){
  var cv=document.getElementById('maChartSbc'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  var ex=Chart.getChart?Chart.getChart(cv):null; if(ex) ex.destroy();
  var sbc=maYrow('sbc'), sh=maYrow('shares');
  new Chart(cv.getContext('2d'),{ data:{ labels:sbc.map(function(r){ return r.fy; }), datasets:[
      { type:'bar', label:'SBC ($M)', data:sbc.map(function(r){ return r.v; }), backgroundColor:sbc.map(function(r){ return r.est?SUMMIT_CAT[0]+'80':SUMMIT_CAT[0]; }), borderRadius:4, maxBarThickness:40, yAxisID:'y' },
      { type:'line', label:'Diluted shares (M)', data:sh.map(function(r){ return r.v; }), borderColor:SUMMIT_CAT[1], backgroundColor:SUMMIT_CAT[1], borderWidth:2.5, tension:.25, pointRadius:3, yAxisID:'y1' }
    ] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false, interaction:{mode:'index',intersect:false},
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+(ctx.dataset.yAxisID==='y1'?Math.round(ctx.parsed.y)+'M':'$'+Math.round(ctx.parsed.y)+'M'); } } } },
      scales:{ y:{ position:'left', ticks:{ callback:function(v){ return '$'+v+'M'; }, font:{size:10} }, grid:{color:'#EEF2F7'}, title:{display:true,text:'SBC',font:{size:10},color:C_AXIS} },
               y1:{ position:'right', ticks:{ font:{size:10} }, grid:{display:false}, title:{display:true,text:'shares (M)',font:{size:10},color:C_AXIS} },
               x:{ grid:{display:false}, ticks:{font:{size:10.5}} } } }
  });
}
// Valuation ▸ Peers — the numbers behind the map in the Overview. The multiples and growth are the SEEDED values of MA_PEERS (web-sourced,
// mid-2026, directional); they are replaced by filings-based denominators when the peers' 10-Ks are loaded (playbook VA-PEERS, rule 10).
function deepDiveHtml(c){
  _co = c;   // capture the live company object (id + ticker) for the Watch List DB wiring
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
    '<button type="button" class="dd-tab" data-dd="misc">Miscellaneous</button>'+
  '</div>';
  function pane(group, hiddenPane, subs){
    var bar='<div class="ovt-subtabs">'+subs.map(function(x,i){ return '<button type="button" class="ovt-subtab'+(i===0?' active':'')+'" data-ovst="'+x.k+'">'+x.l+'</button>'; }).join('')+'</div>';
    var body=subs.map(function(x,i){ return '<div class="ovt-subpane" data-ovst="'+x.k+'"'+(i===0?'':' hidden')+'>'+x.body+'</div>'; }).join('');
    return '<div class="dd-pane" data-dd="'+group+'"'+(hiddenPane?' hidden':'')+'>'+bar+body+'</div>';
  }
  var hasEvo=!!resultsEvoHtml('MA');
  // Top Line
  h+=pane('topline', false, [
    { k:'segov', l:'General', body:segmentsOverviewHtml('MA') },
    { k:'segdrv', l:'Segments', body:segmentsHtml('MA') },
    { k:'segoth', l:'Other', body:segmentsOtherHtml('MA') },
    { k:'segcus', l:'Customers', body:segmentsCustomersHtml('MA') },
    { k:'build', l:'Revenue build', body:resultsHtml('MA_TLG') },
    { k:'drivers', l:'Drivers', body:resultsHtml('MA_DRV') },
    { k:'unit', l:'Take rate', body:maUnitEconBody(c) } ]);   // the gross-to-net bridge and the take rate are revenue-side: they moved here from Bottom Line (analyst, Oct 29 2026)
  // Bottom Line — the old Margins pane is superseded by General (same margins on the Results engine, from Bloomberg actuals and the Summit model)
  h+=pane('bottomline', true, [
    { k:'blgen', l:'General', body:resultsHtml('MA_BL') },
    { k:'costs', l:'Operating costs', body:segmentsCostsHtml('MA') },
    { k:'suppliers', l:'Supply Chain', body:ddSuppliersBody(c) } ]);
  // Evolution — Earnings · Results · Estimates (Estimates is the Street's revision history with the Summit model's one snapshot)
  h+=pane('evolution', true, [
    { k:'earnings', l:'Earnings', body:maCeHtml(c) },
    { k:'results', l:'Results', body:(resultsHtml('MA')||ceResultsPending('Results')) } ].concat(hasEvo?[{ k:'estevo', l:'Estimates', body:resultsEvoHtml('MA') }]:[]));
  // Valuation — Historic Multiple · Peers · Sensitivity · Analyst Ratings (the shared live slot). Target Multiple is not published:
  // the model's target multiple and price target live in the Summit MCP, not in the DCF workbook.
  h+=pane('valuation', true, [
    { k:'histmult', l:'Historic Multiple', body:maHistMult.body() },
    { k:'peers', l:'Peers', body:maValuationPeersBody() },
    { k:'sensitivity', l:'Sensitivity Analysis', body:maSensBody(c) },
    { k:'ratings', l:'Analyst Ratings', body:'<div id="dd-val-slot"></div>' } ]);
  // Management — Executives & Board · Ownership (+ capital allocation) · Governance & SBC · Track Record
  h+=pane('mgmt', true, [
    { k:'team', l:'Executives & Board', body:MA_MGMT.body() },
    { k:'ownership', l:'Ownership', body:maOwnBody(c) },
    { k:'governance', l:'Governance & SBC', body:maGovBody(c) },
    { k:'track', l:'Track Record', body:maTrackBody(c) } ]);
  // Miscellaneous — what is specific to Mastercard and answers no other tab
  h+=pane('misc', true, [
    { k:'comp', l:'Competitive position', body:ddIndustryBody(c) },
    { k:'litigation', l:'Litigation & regulation', body:ddRiskBody(c) },
    { k:'guidance', l:'Guidance record', body:maGuideBody(c) },
    { k:'strategy', l:'Strategy', body:ddStrategyBody(c) },
    { k:'manda', l:'History & M&A', body:ddTimelineBody(c) } ]);
  h+='<div class="ov-foot">'+esc(DD_SOURCES)+'</div>';
  h+='</div>';
  return h;
}

// ─── Financials charts (DCF actuals + projection, timeline-moldable) ─────────

// ─── Deep Dive tab machinery (top-level .dd-tab + nested .ovt-subtab) ─────────
function activeDD(root){ var b=root.querySelector('.dd-tab.active'); return b?b.getAttribute('data-dd'):'topline'; }
function activeSubKey(root, group){ var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return null; var b=pane.querySelector('.ovt-subtab.active'); return b?b.getAttribute('data-ovst'):null; }
function buildSub(root, group, key){
  function rs(sel, tk){ requestAnimationFrame(function(){ initResults(root.querySelector(sel+' .rs-wrap'), tk); }); }
  if(group==='topline' && key==='segov') requestAnimationFrame(function(){ initSegmentsOverview(root, 'MA'); });
  if(group==='topline' && key==='segdrv') requestAnimationFrame(function(){ initSegments(root, 'MA'); });
  if(group==='topline' && key==='segoth') requestAnimationFrame(function(){ initSegmentsOther(root, 'MA'); });
  if(group==='topline' && key==='segcus') requestAnimationFrame(function(){ initSegmentsCustomers(root, 'MA'); });
  if(group==='topline' && key==='build') rs('.ovt-subpane[data-ovst="build"]','MA_TLG');
  if(group==='topline' && key==='drivers') rs('.ovt-subpane[data-ovst="drivers"]','MA_DRV');
  if(group==='bottomline' && key==='costs') requestAnimationFrame(function(){ initSegmentsCosts(root, 'MA'); });
  if(group==='bottomline' && key==='blgen') rs('.ovt-subpane[data-ovst="blgen"]','MA_BL');
  if(group==='evolution' && key==='earnings') maCeBuild(root);
  if(group==='evolution' && key==='results') rs('.ovt-subpane[data-ovst="results"]','MA');
  if(group==='evolution' && key==='estevo') requestAnimationFrame(function(){ initResultsEvo('MA'); });
  if(group==='valuation' && key==='histmult') requestAnimationFrame(function(){ maHistMult.init(root); });
  if(group==='valuation' && key==='peers') requestAnimationFrame(function(){ maWireScatters(root); });
  if(group==='valuation' && key==='sensitivity') maSensInit(root);
  if(group==='mgmt' && key==='team') MA_MGMT.init(root);
  if(group==='mgmt' && key==='ownership') buildMaCapital();
  if(group==='mgmt' && key==='governance') buildMaSbc();
  if(group==='misc' && key==='guidance') renderMaGuide();
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
  root.querySelectorAll('.mg-pill[data-gmm]').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-gmm');
    root.querySelectorAll('.mg-pill[data-gmm]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    root.querySelectorAll('.gmm-view').forEach(function(p){ p.hidden=(p.getAttribute('data-gmm')!==v); });
  }; });

  // Peer map (Overview ▸ Competitors; the same state feeds Valuation ▸ Peers) + live quotes
  maWireScatters(root);
  // Live price of Mastercard for the Sensitivity P/E starting point
  import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote('MA'); }).then(function(res){ var q=res&&res.data?res.data:res; if(q&&q.price!=null){ _maLivePx=q.price; maSensRender(root); } }).catch(function(){});

  // Deep Dive tab wiring (root spans both panes)
  wireDD(root);
  wireSubtabs(root,'topline'); wireSubtabs(root,'bottomline'); wireSubtabs(root,'evolution'); wireSubtabs(root,'valuation'); wireSubtabs(root,'mgmt'); wireSubtabs(root,'misc');
  maCeWire(root);   // Earnings: phase tabs · quarter pills · estimate toggles · Notes (theme record + editor)

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
    if (kind==='ce'){ return maCePop(id); }
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
