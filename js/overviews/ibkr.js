// overviews/ibkr.js — custom Overview for Interactive Brokers Group, Inc. (NASDAQ: IBKR)
// Built individually per the portal's per-company Overview model (see CLAUDE.md), mirroring the
// standardized profile contract used by uber.js: a hooked Overview (Key Facts + live banner + lede
// + 2x2 quad + collapsibles) and a 5-tab Deep Dive spine (Top Line / Bottom Line / Evolution /
// Valuation / Management), each with ovt-subtabs.
//
// Qualitative + quantitative content: IBKR FY2023–FY2025 10-Ks, Q4 2023 → Q1 2026 earnings calls &
// prepared remarks, company IR. IBKR is a broker/financial — valuation is on P/E, never EV/EBITDA.
// Directional figures are labeled as such. No Summit DCF for IBKR. Live price via the get-quote edge fn.

import { makeManagement } from './management.js';

// ─── esc: escapes <>" but deliberately leaves & literal (per contract; never double-encode it) ──
function esc(s){ if(s==null) return ''; return String(s).replace(/&/g,'&').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ─── Brand: Interactive Brokers red + a supporting palette ──────────────────────────────────────
var BRAND='#D6001C', BRAND2='#0A8F4C', BLUE='#2E6BE6', GRAY='#9AA4B0', PURPLE='#7A5AF8', AMBER='#B7791F';

// ─── Management roster (Management ▸ Executives & Board). Public-source bios; no ownership/trades. ──
// CURRENT roster verified against the FY2023–Q1 2026 calls: Peterffy (Founder & Chairman, ran the co
// as CEO until 2019), Galik (President & CEO since 2019, joined 1990 as a developer), Brody (CFO,
// long-tenured), Stuebe (Director of IR). Board kept light/honest: Peterffy (Chair) + Repetto (~2024).
var IBKR_MGMT = makeManagement({
  brand:BRAND,
  lede:"Interactive Brokers is a <b>founder-controlled</b> company. <b>Thomas Peterffy</b> — the market-making pioneer who built it — remains Chairman and its largest shareholder (~75%+ economic), while a long-tenured insider bench runs the day-to-day under CEO <b>Milan Galik</b>. The whole company is engineered around one idea: <b>automate everything, minimize what we charge</b>.",
  execs:[
    { id:'peterffy', lead:true, name:'Thomas Peterffy', title:'Founder & Chairman', since:'Founder · Chairman since 2019',
      line:"Market-making pioneer; largest shareholder (~75%+); ran the firm as CEO until 2019.",
      bio:"Founder and Chairman; IBKR's largest shareholder (~75%+ economic interest via IBG Holdings). A Hungarian-born programmer who bought an AMEX seat in 1977 and pioneered computerized market-making (Timber Hill) — widely credited with automating options trading. Founded Interactive Brokers in 1993, took it public in 2007, and served as CEO until stepping up to Chairman in 2019. Still the firm's macro voice and strategic anchor." },
    { id:'galik', name:'Milan Galik', title:'President & Chief Executive Officer', since:'CEO since 2019 · at IBKR since 1990',
      line:"Clean insider succession from the founder; joined in 1990 as a software developer.",
      bio:"President & CEO since September 2019. Joined the firm in 1990 as a software developer and rose through engineering into senior leadership — a rare, clean founder-to-insider succession. Oversaw the run from ~$250B to ~$789B client equity, record account growth, S&P 500 inclusion, and relentless automation of the brokerage stack." },
    { id:'brody', name:'Paul Brody', title:'Chief Financial Officer', since:'Long-tenured CFO',
      line:"Disciplined capital allocation; fortress balance sheet, no debt, the rate-sensitivity playbook.",
      bio:"Chief Financial Officer; long-tenured within the firm. Architect of IBKR's conservative, cash-rich financial posture: no long-term debt, ~$6–7B of excess regulatory capital, a short-duration (<30-day) treasury strategy on segregated customer cash, and the disclosed net-interest-income rate-sensitivity framework the Street watches each quarter." },
    { id:'stuebe', name:'Nancy Stuebe', title:'Director of Investor Relations', since:'Investor Relations',
      line:"The firm's IR voice on the quarterly calls.",
      bio:"Director of Investor Relations; leads the quarterly earnings calls alongside the CFO and management, and the primary point of contact for the investment community." },
  ],
  board:[
    { name:'Thomas Peterffy', chair:true, independent:false, role:'Founder & Chairman · largest shareholder (~75%+ economic) · controls the company via IBG Holdings.' },
    { name:'Milan Galik', dual:true, independent:false, role:'President & Chief Executive Officer.' },
    { name:'Rich Repetto', independent:true, role:'Independent director (joined ~2024) · widely-respected former Piper Sandler brokerage/e-broker analyst — a strong outside addition.' },
  ],
  boardNote:'Founder-controlled: Peterffy holds majority economics/votes, so the board is intentionally light. Verify names & committees against the latest proxy.',
  gov:[
    { k:'Control', v:'Founder-controlled', d:'Peterffy ~75%+ economic via IBG Holdings — see Ownership (up-C).' },
    { k:'Public float', v:'Class A only', d:'IBKR Group Inc (the public co) owns only ~25–30% of the operating co IBG LLC.' },
    { k:'Balance sheet', v:'No long-term debt', d:'~$6–7B excess capital · fortress by design.' },
  ],
  foot:"Roster and titles verified against IBKR's FY2023–Q1 2026 earnings calls and IR. Board is founder-controlled and intentionally light; confirm independent directors and committees against the latest proxy. Ownership economics and insider activity live in the Ownership subtab and the Pillars → Management tab.",
});

// ─── Formatting helpers ─────────────────────────────────────────────────────────────────────────
function moneyB(m){ if(m==null) return '—'; var neg=m<0,a=Math.abs(m); return (neg?'−':'')+'$'+a.toFixed(a>=100?0:1)+'B'; }
function pctStr(p){ return (p>=0?'+':'−')+Math.abs(p).toFixed(0)+'%'; }

// ─── Render helpers (reuse shared overview.css classes) ─────────────────────────────────────────
function sec(title,inner){ return '<section class="ov-sec"><div class="ov-sec-h">'+esc(title)+'</div>'+inner+'</section>'; }
function bullets(arr){ return '<ul class="ov-bullets">'+arr.map(function(b){return '<li>'+b+'</li>';}).join('')+'</ul>'; }
function mbars(arr){ return '<div class="ov-mbars">'+arr.map(function(r){
  return '<div class="ov-mbar"><div class="ov-mbar-l">'+esc(r[0])+'</div>'+
    '<div class="ov-mbar-track"><div class="ov-mbar-fill" style="width:'+r[1]+'%;background:'+r[3]+';">'+esc(r[2])+'</div></div>'+
    '<div class="ov-mbar-v">'+r[1]+'%</div></div>';
}).join('')+'</div>'; }
function collapsible(title, inner, open){
  return '<div class="ov-collap'+(open?' open':'')+'">'+
    '<button type="button" class="ov-collap-h"><span class="ov-collap-ic">'+(open?'▾':'▸')+'</span>'+esc(title)+'</button>'+
    '<div class="ov-collap-b"'+(open?'':' hidden')+'>'+inner+'</div></div>';
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// Key Facts — 10 cells (5 columns × 2 rows). Market cap carries a note: it is the PUBLIC FLOAT only
// (up-C — the public co owns only ~25–30% of the operating company).
var STD_FACTS=[
  ['Listing','NASDAQ: IBKR'],
  ['HQ','Greenwich, CT, USA'],
  ['Founded','1977 (Peterffy) · IPO 2007'],
  ['Chairman','Thomas Peterffy'],
  ['CEO','Milan Galik · since 2019'],
  ['Employees','~3,232'],
  ['Client accounts','~4M+ (>1M added in 2025)'],
  ['Client equity','$789B · Q1 2026 (+38% YoY)'],
  ['Pre-tax margin','~77% (industry-leading)'],
  ['Market cap','live · public float only'],
];
var STD_MC_NOTE='public float only';

var UB_LEDE='Interactive Brokers is the largest fully-automated global electronic broker. It gives sophisticated and active individual and institutional traders low-cost access to ~150 markets in ~35 countries and ~28 currencies — stocks, options, futures, bonds, FX, funds, crypto and prediction/forecast contracts — from a single account. The operating philosophy is simple and relentless: automate everything, minimize what we charge, and keep industry-leading margins.';

// 2x2 quadrant (each cell ≤ ~30 words)
var STD_BIZ=[
  ['What it sells','Ultra-low-cost, direct global market access — stocks, options, futures, bonds, FX, funds, crypto and forecast contracts — across ~150 markets from one automated account.'],
  ['Who buys it','Sophisticated, active traders: self-directed individuals, proprietary trading firms, hedge funds (prime brokerage), introducing brokers (white-label) and financial advisors/RIAs.'],
  ['How it earns','Net interest income on customer cash & margin loans (the largest line), low per-trade commissions, and other fees (market data, FX, exchange rebates).'],
  ['The edge','Automation → the lowest cost structure in the industry → ~77% pre-tax margins, a fortress balance sheet with no debt, and prices no full-service rival can match.'],
];

// How it makes money — the revenue mix (three lines). FY2025 ≈ $6.0B net revenues.
// NII ~$3.6B (60%), Commissions ~$2.1B (35%), Other fees ~$0.3B (5%).
var STD_REV=[
  ['Net interest income', 60, '~$3.6B', BRAND],
  ['Commissions', 35, '~$2.1B', BLUE],
  ['Other fees', 5, '~$0.3B', GRAY],
];
var REV_DEFS=[
  { seg:'Net interest income (largest)',
    desc:'Interest earned on customer <b>margin loans</b> (~$87B, a record), interest on <b>segregated customer cash</b> invested in short (<30-day) T-bills, and <b>securities lending</b> — <i>less</i> the interest IBKR pays customers on their cash. A key differentiator: IBKR pays <b>Fed funds − 50bps</b> on qualified USD cash, far more than rivals.',
    econ:[['FY2025','~$3.6B'],['Q1 2026','$904M (+17%)'],['Margin loans','~$87B (record)']] },
  { seg:'Commissions',
    desc:'Low per-trade fees on stocks, options, futures, bonds, FX and funds. Driven by <b>DARTs</b> (Daily Average Revenue Trades) — 4.4M/day in Q1 2026, +24% YoY. Commissions crossed <b>$600M in a quarter for the first time</b> in Q1 2026.',
    econ:[['FY2025','~$2.1B (+27%)'],['Q1 2026','>$600M (+19%)'],['DARTs','4.4M/day (+24%)']] },
  { seg:'Other fees',
    desc:'Market-data fees, risk-exposure fees, FDIC sweep fees, options-exchange payment-for-order-flow and FX. A smaller, diversified layer on top of the two core engines.',
    econ:[['Nature','Diversified fee layer'],['Includes','Market data · FX · exchange rebates']] },
];

// Products / asset classes — clickable family cards → pop-ups (key = prod:i)
var IBKR_PRODUCTS=[
  { ic:'📈', fam:'Stocks & ETFs', d:'Global equities from one account.', items:[
    ['Global stocks & ETFs','Direct access to ~150 markets in ~35 countries and ~28 currencies.'],
    ['Overnight trading','10,000+ US stocks/ETFs tradable 24/5 — overnight volume nearly tripled in a year.'] ]},
  { ic:'🧮', fam:'Options & Futures', d:'Deep derivatives, incl. 0DTE.', items:[
    ['Options','Equity & index options, including <b>0DTE index</b> options.'],
    ['Futures','Global futures and futures options.'] ]},
  { ic:'🏦', fam:'Bonds & FX', d:'Fixed income and currencies.', items:[
    ['Bonds','Global bonds, tradable 24/5.'],
    ['FX (AutoFX)','Currency conversion at ~3bps — a fraction of what a bank charges.'] ]},
  { ic:'💰', fam:'Funds & tax-advantaged accounts', d:'Mutual funds and wrappers.', items:[
    ['Mutual funds','Thousands of funds from a single platform.'],
    ['Tax-advantaged wrappers','ISA (UK), PEA (FR), NISA (JP), ISK (SE), RRSP (CA) and more.'] ]},
  { ic:'🪙', fam:'Crypto', d:'Coins + derivatives.', items:[
    ['Spot crypto','11+ coins via Zero Hash; IBKR holds a stake in Zero Hash.'],
    ['Crypto derivatives','EEA launch plus Coinbase Derivatives perpetuals.'] ]},
  { ic:'🗳️', fam:'ForecastEx / forecast contracts', d:"Peterffy's long-term bet.", items:[
    ['Prediction / forecast contracts','CFTC-regulated contracts on elections, economic and climate outcomes.'],
    ['ForecastEx','IBKR-operated exchange; 24/7, 10,000+ instruments, an Election Board for the midterms.'] ]},
  { ic:'💻', fam:'Platforms & AI', d:'Pro tools + AI helpers.', items:[
    ['Platforms','Trader Workstation, IBKR Desktop, GlobalTrader, IBKR Mobile, and open APIs.'],
    ['AI tools','Ask IBKR, Investment Themes, Connections, AI news summaries (FINRA-approved).'] ]},
];

// Five client segments — clickable cards → pop-ups (key = seg:i)
var CLIENT_SEGMENTS=[
  { id:'ind', ic:'👤', n:'Individuals', tag:'largest · fastest-growing', col:BRAND,
    teaser:'Self-directed active traders — the biggest and fastest-growing account base.',
    detail:'<p><b>The core of IBKR.</b> Millions of self-directed, sophisticated individual traders worldwide — the largest client group and the fastest-growing by account count. Growth is <b>organic</b> (no sign-up bonuses or incentives), skewed international, with <b>Asia and Europe the fastest-growing regions</b>.</p><p>These are not passive investors: they are active, multi-asset traders who value low cost, breadth of markets and professional tools — exactly what IBKR is built for.</p>' },
  { id:'ib', ic:'🔗', n:'Introducing Brokers', tag:'white-label / omnibus', col:BLUE,
    teaser:'Other firms run their brokerage on IBKR rails (e.g. HSBC WorldTrader).',
    detail:'<p><b>Distribution through other firms.</b> Banks and brokers white-label IBKR\'s technology and execution — on an omnibus or fully-disclosed basis — to offer their own customers global trading. Flagship example: <b>HSBC WorldTrader</b>, powered by IBKR. A pipeline of ~two-dozen more firms is in progress, including a UAE ~10k-account migration and Asian virtual banks.</p><p>Firms that once declined are now returning, drawn by IBKR\'s breadth and cost.</p>' },
  { id:'prop', ic:'⚡', n:'Proprietary trading firms', tag:'highest commission growth', col:PURPLE,
    teaser:'High-frequency and prop shops — the fastest commission growth.',
    detail:'<p><b>Professional trading firms</b> that need fast, cheap, direct global execution. This segment shows the <b>highest commission growth</b> of the five — these clients trade in size and pay per trade, so they lever directly to DARTs.</p>' },
  { id:'hf', ic:'🏛️', n:'Hedge funds / prime brokerage', tag:'Preqin #4 prime broker', col:AMBER,
    teaser:'High-Touch Prime; ranked #4 prime broker behind GS/MS/JPM.',
    detail:'<p><b>Moving up-market.</b> IBKR launched <b>High-Touch Prime</b> and a global outsourced-trading desk, and now ranks (Preqin) as the <b>#4 prime broker — behind only Goldman Sachs, Morgan Stanley and JPMorgan</b>. Its <b>fortress balance sheet</b> (no debt, huge excess capital) is a trust signal that matters to fund clients after prior prime-broker blowups.</p><p>Capital-introduction was revamped (participants doubled from ~120 to ~240).</p>' },
  { id:'ria', ic:'🧭', n:'Financial advisors (RIAs)', tag:'far cheaper allocation', col:BRAND2,
    teaser:'RIAs allocate client assets far more cheaply than at Schwab.',
    detail:'<p><b>Registered investment advisors</b> custody and trade client assets on IBKR — at a <b>far lower all-in cost</b> than legacy custodians like Schwab. As the RIA channel keeps growing, IBKR\'s cost edge and global reach make it an increasingly credible alternative platform.</p>' },
];

// Timeline (compact; full history in Evolution ▸ Timeline). Clickable rows get a data-detail modal.
var TIMELINE=[
  { y:'1977', t:'<b>Peterffy buys an AMEX seat</b> and founds <b>Timber Hill</b> — pioneering computerized market-making.',
    d:'Thomas Peterffy, a Hungarian-born programmer, buys a seat on the American Stock Exchange and begins automating options market-making through <b>Timber Hill</b>. He is widely credited with bringing computers onto the trading floor and revolutionizing electronic market-making.' },
  { y:'1983', t:'First <b>handheld computerized trading</b> device.' },
  { y:'1993', t:'<b>Interactive Brokers founded</b> — extending the automation edge to customer brokerage.' },
  { y:'2007', t:'<b>IPO</b> — Interactive Brokers Group lists (the up-C structure dates from here).',
    d:'IBKR goes public in 2007. Only a minority of the operating company (IBG LLC) is sold to public shareholders via IBKR Group Inc (Class A); Peterffy and insiders retain the majority through IBG Holdings — the "up-C" structure that still defines the ownership today (see Ownership).' },
  { y:'2019', t:'<b>Milan Galik becomes CEO</b>; Peterffy moves to Chairman — a clean insider succession.' },
  { y:'2021', t:'Zero-commission <b>IBKR Lite</b>; record account growth.' },
  { y:'2024', t:'<b>ForecastEx launches</b> (CFTC-regulated prediction markets); <b>High-Touch Prime</b> for funds.',
    d:'IBKR launches <b>ForecastEx</b>, a CFTC-regulated exchange for forecast/prediction contracts — Peterffy\'s big long-term bet — and rolls out <b>High-Touch Prime</b> to move up-market into hedge-fund prime brokerage.' },
  { y:'Jun 2025', t:'<b>4-for-1 stock split.</b>' },
  { y:'Q3 2025', t:'Added to the <b>S&P 500</b>; welcomes its <b>4-millionth customer</b>.',
    d:'Interactive Brokers is added to the <b>S&P 500</b> in Q3 2025 and passes <b>4 million customer accounts</b>. 2025 becomes the first year client equity tops $750B, with a record <b>>1 million net-new accounts</b> added.' },
  { y:'Feb 2026', t:'Quarterly <b>dividend raised to $0.35/yr</b> (split-adjusted).' },
];

// ─── Peers scatter (Valuation-vs-growth). MULTIPLE AXIS = P/E (forward), NEVER EV/EBITDA — IBKR and
// its peers are financials/brokers, valued on P/E. Bubble size = live market cap (USD). ────────────
// Optional per-peer `logo` override; otherwise assets.parqet.com/logos/symbol/{tk}.
var IBKR_PEERS=[
  { tk:'IBKR', n:'Interactive Brokers', peT:34, peF:30, gt:14, gf:12, mc:95, hl:true,
    why:'The scaled, hyper-profitable global broker (~77% pre-tax margin). Trades at a growth premium to legacy discount brokers, a discount to the hyper-growth fintechs.' },
  { tk:'SCHW', n:'Charles Schwab', peT:22, peF:20, gt:9, gf:8, mc:160,
    why:'The US discount-broker giant. Bigger and slower-growing; a lower multiple reflects its maturity and rate/deposit sensitivity.' },
  { tk:'HOOD', n:'Robinhood', peT:55, peF:45, gt:35, gf:30, mc:90,
    why:'US retail-trading disruptor. Fastest-growing here and richly valued on it — more consumer-fintech than global broker.' },
  { tk:'FUTU', n:'Futu Holdings', peT:20, peF:18, gt:32, gf:30, mc:20,
    why:'The "Asian IBKR" — a fast-growing electronic broker for Asian retail. Cheap on P/E given China/regulatory risk.' },
  { tk:'COIN', n:'Coinbase', peT:40, peF:35, gt:28, gf:25, mc:90,
    why:'Crypto-broker adjacency. Earnings swing with crypto volumes, so its P/E is volatile — a directional comparable, not a pure peer.' },
];
var IBKR_SC={ basis:'f', peers:null };
function ibkrScReset(){ IBKR_SC.peers=IBKR_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function ibkrScMult(p){ return IBKR_SC.basis==='f'?p.peF:p.peT; }
function scLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function stdPeerScatter(){
  var h='<style>.mg-tog-row{display:flex;flex-wrap:wrap;gap:14px;margin:2px 0 8px}'+
    '.mg-tog{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:var(--mu)}'+
    '.mg-seg{display:inline-flex;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:2px}'+
    '.mg-pill{border:none;background:transparent;font:inherit;font-size:10.5px;font-weight:700;color:var(--mu);padding:3px 10px;border-radius:999px;cursor:pointer}'+
    '.mg-pill.active{background:var(--navy);color:#fff}'+
    '.mg-node{cursor:pointer}.mg-node text{pointer-events:none}'+
    '.ibsc-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 2px}'+
    '.ibsc-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:999px;padding:3px 9px;background:var(--w);cursor:pointer;color:var(--navy)}'+
    '.ibsc-chip .x{color:var(--mu);font-weight:800}'+
    '.ibsc-add{display:inline-flex;gap:5px;align-items:center}'+
    '.ibsc-add input{width:74px;font:inherit;font-size:11px;border:1px solid var(--bdr);border-radius:7px;padding:3px 7px;text-transform:uppercase}'+
    '.ibsc-add button{font:inherit;font-size:11px;font-weight:700;border:1px solid var(--bdr);border-radius:7px;padding:3px 9px;background:#F2F5F8;cursor:pointer}'+
    '.mg-tip{position:fixed;z-index:60;max-width:250px;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;box-shadow:0 8px 22px rgba(16,20,26,.28);pointer-events:none;border-top:3px solid '+BRAND+'}'+
    '.mg-tip .mgt-h{display:flex;align-items:center;gap:7px;margin-bottom:4px}.mg-tip .mgt-h img{width:18px;height:18px;border-radius:4px;background:#fff;object-fit:contain}'+
    '.mg-tip .mgt-n{font-weight:800;font-size:12.5px;color:'+BRAND+'}</style>';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Listed broker/fintech peers mapped by <b>forward P/E</b> (x) and <b>revenue/earnings growth</b> (y). <b>Bubble size = live market cap in USD.</b> Financials are valued on <b>P/E, not EV/EBITDA</b>. <span style="opacity:.75">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span></div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" id="ibkrScSvg" role="img" aria-label="Peer P/E vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower P/E)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" id="ibkrScXlab">P/E · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<g id="ibkrScNodes"></g>'+
  '</svg></div>';
  h+='<div class="ibsc-chips" id="ibkrScChips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only <b>listed</b> peers with a public P/E plot here. <span class="ave-subh-note">Multiples & growth are approximate, web-sourced (mid-2026), directional — confirm against a terminal before quoting. Market caps are live. <b>Financials are valued on P/E, not EV/EBITDA.</b></span></div>';
  h+='<div id="ibkrScTip" class="mg-tip" hidden></div>';
  return h;
}
// Draw the working set into #ibkrScNodes. Each node carries a logo <image> (fallback parqet-by-ticker).
function ibkrScRender(root){
  var g=root.querySelector('#ibkrScNodes'); if(!g||!IBKR_SC.peers) return;
  var maxMult=60, X0=80, X1=612, Y0=252, Y1=44;
  var lab=root.querySelector('#ibkrScXlab'); if(lab) lab.textContent='P/E · '+(IBKR_SC.basis==='f'?'forward':'trailing');
  var frag='';
  IBKR_SC.peers.forEach(function(p){
    if(!p.on) return; var m=ibkrScMult(p); if(m==null||isNaN(m)) return;
    var growth=IBKR_SC.basis==='f'?p.gf:p.gt; if(growth==null) growth=p.gf!=null?p.gf:p.gt;
    var x=X0+Math.max(0,Math.min(1,m/maxMult))*(X1-X0);
    var y=Y0-Math.max(0,Math.min(1,(growth||0)/40))*(Y0-Y1);
    var r=Math.max(11,Math.min(26,9+Math.sqrt(Math.max(1,p.mc))*1.1));
    var logo=scLogoUrl(p);
    frag+='<g class="mg-node" data-name="'+esc(p.n)+'" data-tk="'+esc(p.tk)+'" data-logo="'+esc(logo)+'" data-why="'+esc(p.why||'')+'" transform="translate('+x.toFixed(1)+','+y.toFixed(1)+')">'+
      '<circle r="'+r.toFixed(1)+'" fill="#fff" stroke="'+(p.hl?BRAND:'#C7CED6')+'" stroke-width="'+(p.hl?3:1.5)+'"></circle>'+
      '<image href="'+esc(logo)+'" x="'+(-r*0.72).toFixed(1)+'" y="'+(-r*0.72).toFixed(1)+'" width="'+(r*1.44).toFixed(1)+'" height="'+(r*1.44).toFixed(1)+'" preserveAspectRatio="xMidYMid meet" style="pointer-events:none"></image>'+
      '<text y="'+(r+12).toFixed(1)+'" font-family="Inter,sans-serif" font-size="'+(p.hl?12:11)+'" font-weight="'+(p.hl?800:700)+'" fill="'+(p.hl?BRAND:'#3A4552')+'" text-anchor="middle">'+esc(p.n)+'</text></g>';
  });
  g.innerHTML=frag;
}
function ibkrScChips(root){
  var box=root.querySelector('#ibkrScChips'); if(!box||!IBKR_SC.peers) return;
  var h=IBKR_SC.peers.map(function(p,i){ return '<span class="ibsc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="ibsc-add"><input id="ibkrScAddTk" placeholder="+ TICKER" maxlength="6"><button type="button" id="ibkrScAddBtn">Add</button></span>';
  box.innerHTML=h;
}

function stdTimeline(){
  return '<div class="ov-timeline">'+TIMELINE.map(function(t,i){ var more=t.d?'<div class="ov-tl-more">Read more →</div>':''; var cls=t.d?' ov-clickable':''; var attr=t.d?' data-detail="hist:'+i+'"':''; return '<div class="ov-tl-item'+cls+'"'+attr+'><div class="ov-tl-dot"></div><div class="ov-tl-yr">'+esc(t.y)+'</div><div class="ov-tl-body">'+t.t+more+'</div></div>'; }).join('')+'</div>';
}

// ═══ Standardized Overview body ═════════════════════════════════════════════════════════════════
function stdKeyFacts(){
  return '<div class="stdkf">'+STD_FACTS.slice(0,10).map(function(p){
    var v;
    if(p[0]==='Market cap'){ v='<span id="ibkrMc">'+esc(p[1])+'</span>'; }
    else v=esc(p[1]);
    return '<div class="stdkf-cell"><div class="stdkf-k">'+esc(p[0])+'</div><div class="stdkf-v">'+v+'</div></div>'; }).join('')+'</div>';
}
function stdFourQuad(){
  return '<div class="q2">'+STD_BIZ.map(function(b){ return '<div class="q2-cell"><div class="q2-k">'+esc(b[0])+'</div><div class="q2-v">'+b[1]+'</div></div>'; }).join('')+'</div>';
}
function stdMoneyMap(){
  var h='<div class="ov-diagram-cap" style="margin:0 0 8px">FY2025 net revenues ≈ <b>$6.0B</b>. Two engines dominate: <b>net interest income</b> (interest on customer cash & margin loans) and <b>commissions</b> (low per-trade fees). A smaller <b>other-fees</b> layer sits on top.</div>';
  h+=mbars(STD_REV);
  h+='<div class="mm-defs acc-list" style="margin-top:12px">'+REV_DEFS.map(function(s){
    var econ='<div class="acc" style="margin-top:8px"><button type="button" class="acc-h">The numbers <span class="acc-x">+</span></button><div class="acc-b" hidden>'+s.econ.map(function(r){ return '<div class="ov-row"><div class="ov-row-k">'+esc(r[0])+'</div><div class="ov-row-v">'+esc(r[1])+'</div></div>'; }).join('')+'</div></div>';
    return '<div class="acc"><button type="button" class="acc-h">'+esc(s.seg)+'<span class="acc-x">+</span></button><div class="acc-b" hidden><div class="famd">'+s.desc+'</div>'+econ+'</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-diagram-cap" style="margin-top:10px">Net revenues scaled <b>>$4B (FY23) → >$5B (FY24) → >$6B (FY25)</b>; adjusted pre-tax income has topped $1B for 5+ straight quarters and pre-tax margin climbed 71% → <b>77%</b>. <span class="ave-subh-note">Segment mix approximate/directional — Source: IBKR FY2025 results & Q1 2026.</span></div>';
  return h;
}
function stdProducts(){
  return '<div class="ov-diagram-cap" style="margin:0 0 8px">One account, ~150 markets. <b>Tap any asset class</b> for the specific products.</div>'+
    '<div class="stdp">'+IBKR_PRODUCTS.map(function(f,i){
      return '<div class="stdp-card ov-clickable" data-detail="prod:'+i+'"><div class="stdp-ic">'+f.ic+'</div>'+
        '<div class="stdp-n">'+esc(f.fam)+'</div><div class="stdp-d">'+esc(f.d)+'</div><div class="stdp-more">See products ›</div></div>';
    }).join('')+'</div>';
}
var UB_OV_SOURCES='Sources — IBKR FY2023–FY2025 Form 10-K and Q4 2023 → Q1 2026 results & earnings calls (client metrics, revenue mix, margins); company IR for product taxonomy and the up-C ownership structure. Market cap and peer bubbles are live; peer P/E multiples & growth are web-sourced approximations (mid-2026), directional. Quoted "market cap" is the PUBLIC FLOAT only (up-C — see Ownership). Forward figures are estimates, not company guidance.';
function stdOverviewBody(c){
  var h='<style>.stdkf{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:12px;overflow:hidden;background:var(--w);margin:2px 0}'+
    '.stdkf-cell{padding:11px 13px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.stdkf-cell:nth-child(5n){border-right:none}.stdkf-cell:nth-child(n+6){border-bottom:none}'+
    '.stdkf-k{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--mu);margin-bottom:3px}'+
    '.stdkf-v{font-size:12px;font-weight:700;color:var(--navy);line-height:1.3}'+
    '@media(max-width:720px){.stdkf{grid-template-columns:repeat(2,1fr)}.stdkf-cell{border-right:none}}'+
    '.ov-lede{margin:16px 0 6px;font-size:13px;line-height:1.6;color:var(--navy)}'+
    '.q2{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--bdr);border-radius:12px;overflow:hidden;background:var(--w);margin:4px 0}'+
    '.q2-cell{padding:13px 15px;border-right:1px solid var(--bdr);border-bottom:1px solid var(--bdr)}'+
    '.q2-cell:nth-child(2n){border-right:none}.q2-cell:nth-child(n+3){border-bottom:none}'+
    '.q2-k{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:'+BRAND+';margin-bottom:5px}'+
    '.q2-v{font-size:12px;color:var(--navy);line-height:1.5}.q2-v b{font-weight:800}'+
    '@media(max-width:600px){.q2{grid-template-columns:1fr}.q2-cell{border-right:none}.q2-cell:nth-child(n+2){border-bottom:1px solid var(--bdr)}.q2-cell:last-child{border-bottom:none}}'+
    '.acc-list .acc{border:1px solid var(--bdr);border-radius:9px;margin-top:6px;overflow:hidden;background:var(--w)}'+
    '.acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12px;font-weight:700;color:var(--navy);padding:9px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}'+
    '.acc-h:hover{background:#EEF2F6}.acc-x{color:var(--mu);font-weight:800}.acc-b{padding:10px 12px}'+
    '.famd{font-size:12px;color:var(--navy);line-height:1.55}.famd b{font-weight:800}'+
    '.ov-row{display:flex;justify-content:space-between;gap:12px;padding:5px 0;border-bottom:1px solid var(--bdr);font-size:11.5px}.ov-row:last-child{border-bottom:none}.ov-row-k{color:var(--mu);font-weight:600}.ov-row-v{color:var(--navy);font-weight:800}'+
    '.stdp{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'+
    '.stdp-card{border:1px solid var(--bdr);border-radius:11px;padding:13px 14px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.stdp-card:hover{box-shadow:0 3px 10px rgba(0,0,0,.08);transform:translateY(-2px);border-color:'+BRAND+'}'+
    '.stdp-ic{font-size:26px;line-height:1}.stdp-n{font-size:13px;font-weight:800;color:var(--navy);margin:7px 0 3px}'+
    '.stdp-d{font-size:11px;color:var(--mu);line-height:1.45}.stdp-more{font-size:10px;font-weight:700;color:'+BRAND+';margin-top:6px}'+
    '.ov-collap{border:1px solid var(--bdr);border-radius:10px;margin:12px 0 0;overflow:hidden}'+
    '.ov-collap-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;align-items:center;gap:8px}'+
    '.ov-collap-h:hover{background:#EEF2F6}.ov-collap-ic{font-size:10px;color:var(--mu)}.ov-collap-b{padding:12px 14px 6px}'+
    '.dd-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 14px;border-bottom:1px solid var(--bdr)}'+
    '.dd-tab{border:none;background:transparent;font:inherit;font-size:12.5px;font-weight:700;color:var(--mu);padding:8px 14px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px}'+
    '.dd-tab:hover{color:var(--navy)}.dd-tab.active{color:var(--navy);border-bottom-color:'+BRAND+'}'+
    '.dd-pane[hidden]{display:none}'+
    '.ovt-subtabs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px}'+
    '.ovt-subtab{border:1px solid var(--bdr);background:#fff;font:inherit;font-size:11.5px;font-weight:700;color:var(--mu);padding:5px 13px;border-radius:999px;cursor:pointer}'+
    '.ovt-subtab.active{background:var(--navy);color:#fff;border-color:var(--navy)}.ovt-subtab:hover{color:var(--navy)}.ovt-subtab.active:hover{color:#fff}'+
    '.ovt-subpane[hidden]{display:none}</style>';
  h+=stdKeyFacts();
  h+='<div class="ov-live" id="ibkrLive" hidden></div>';
  h+='<p class="ov-lede">'+esc(UB_LEDE)+'</p>';
  h+=stdFourQuad();
  h+=collapsible('How it makes money — the revenue mix', stdMoneyMap());
  h+=collapsible('What it offers — the products', stdProducts());
  h+=collapsible('Competitors — P/E vs growth (financials are valued on P/E, not EV/EBITDA)', stdPeerScatter());
  h+=collapsible('Timeline', stdTimeline());
  h+='<div class="ov-foot">'+esc(UB_OV_SOURCES)+'</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — TOP LINE
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// Segments ▸ the KPI flywheel ("the money machine")
function segmentsBody(c){
  var h='<p class="ov-lede">IBKR is a <b>compounding flywheel</b>, not a set of product lines. More <b>accounts</b> bring more <b>client equity</b>, which brings more <b>customer cash</b> and <b>margin loans</b> (→ net interest income); more accounts plus volatility bring more <b>DARTs</b> (→ commissions). Growth is <b>organic</b> — no bonuses or incentives — and skewed international (Asia & Europe fastest).</p>';
  // The flywheel diagram
  h+=sec('The money machine — how one account compounds',
    '<style>.flw{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:6px 0}'+
      '.flw-node{border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:11px;padding:12px 13px;background:var(--w);position:relative}'+
      '.flw-k{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}'+
      '.flw-v{font-size:19px;font-weight:800;color:var(--navy);margin:4px 0 2px;line-height:1.05}'+
      '.flw-d{font-size:10.5px;color:var(--mu);line-height:1.4}'+
      '@media(max-width:720px){.flw{grid-template-columns:1fr 1fr}}</style>'+
    '<div class="flw">'+
      '<div class="flw-node"><div class="flw-k">Accounts</div><div class="flw-v">~4M+</div><div class="flw-d">>1M net-new in 2025 (record). Organic, no incentives.</div></div>'+
      '<div class="flw-node"><div class="flw-k">Client equity</div><div class="flw-v">$789B</div><div class="flw-d">$250B (2020) → $500B (2024) → $789B (Q1 2026), +38% YoY.</div></div>'+
      '<div class="flw-node"><div class="flw-k">Cash & margin</div><div class="flw-v">$169B</div><div class="flw-d">Credit balances +35%; margin loans ~$87B (record).</div></div>'+
      '<div class="flw-node"><div class="flw-k">Revenue engines</div><div class="flw-v">NII + fees</div><div class="flw-d">More cash/margin → NII; more DARTs (4.4M/day) → commissions.</div></div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:10px">The loop is self-reinforcing: each new account adds equity, which becomes cash and margin balances that earn interest, and adds trading that earns commissions — at almost no incremental cost, because the platform is fully automated. That is why <b>revenue compounds faster than headcount</b> (~3,232 employees).</div>');
  // The two revenue engines
  h+=sec('The two engines, in numbers',
    '<div class="ov-kpis">'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Net interest income</div><div class="ov-kpi-v">~$3.6B</div><div class="ov-kpi-d up">FY25 · Q1 2026 $904M (+17%)</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Commissions</div><div class="ov-kpi-v">~$2.1B</div><div class="ov-kpi-d up">FY25 (+27%) · Q1 2026 >$600M</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">DARTs</div><div class="ov-kpi-v">4.4M/day</div><div class="ov-kpi-d up">Q1 2026 (+24% YoY)</div></div>'+
      '<div class="ov-kpi"><div class="ov-kpi-l">Client credit balances</div><div class="ov-kpi-v">$169B</div><div class="ov-kpi-d up">+35% YoY</div></div>'+
    '</div>');
  h+='<div class="ov-foot">Client metrics: IBKR Q1 2026 results and FY2025 10-K. Directional where noted.</div>';
  return h;
}
// Customers ▸ the five client segments (clickable cards → pop-ups)
function customersBody(c){
  var h='<p class="ov-lede">IBKR serves <b>five client segments</b> — a deliberately broad base that de-risks any single channel. <b>Tap any card</b> for the detail.</p>';
  h+='<style>.seg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:11px}'+
    '.seg-card{border:1px solid var(--bdr);border-left:4px solid #ccc;border-radius:12px;padding:13px 15px;background:#fff;cursor:pointer;transition:.14s}'+
    '.seg-card:hover{box-shadow:0 3px 12px rgba(0,0,0,.08);transform:translateY(-2px)}'+
    '.seg-top{display:flex;align-items:center;gap:9px;margin-bottom:6px}.seg-ic{font-size:22px;line-height:1}'+
    '.seg-n{font-size:13.5px;font-weight:800;color:var(--navy)}'+
    '.seg-tag{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 8px;display:inline-block;margin-top:3px}'+
    '.seg-teaser{font-size:11.5px;color:var(--navy);line-height:1.5}.seg-more{font-size:10.5px;font-weight:800;margin-top:7px}</style>';
  h+='<div class="seg-grid">'+CLIENT_SEGMENTS.map(function(s){
    return '<div class="seg-card ov-clickable" data-detail="seg:'+s.id+'" style="border-left-color:'+s.col+'">'+
      '<div class="seg-top"><span class="seg-ic">'+s.ic+'</span><div><div class="seg-n">'+esc(s.n)+'</div><span class="seg-tag" style="background:'+s.col+'">'+esc(s.tag)+'</span></div></div>'+
      '<div class="seg-teaser">'+esc(s.teaser)+'</div><div class="seg-more" style="color:'+s.col+'">Full detail ›</div></div>';
  }).join('')+'</div>';
  h+='<div class="ov-callout" style="margin-top:14px">The customers are <b>millions of self-directed traders</b>, not a handful of large corporates — so no single client is material, and pricing power sits firmly with IBKR. The institutional segments (prime, introducing brokers) add scale and stickiness on top.</div>';
  h+='<div class="ov-foot">Segment detail from IBKR FY2023–Q1 2026 earnings calls. Preqin prime-broker ranking as cited by management.</div>';
  return h;
}
// TAM ▸ the runway
function tamBody(c){
  var h='<p class="ov-lede">IBKR does not pin a single headline TAM. The runway is best read as <b>share of the global active-trader and self-directed-investing pool</b> — a market growing structurally as trading globalizes, asset classes broaden (crypto, forecast contracts, overnight) and cost pressure pushes assets to the cheapest automated platform.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Markets accessible</div><div class="ov-kpi-v">~150</div><div class="ov-kpi-d muted">in ~35 countries · ~28 currencies</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Accounts today</div><div class="ov-kpi-v">~4M+</div><div class="ov-kpi-d muted">vs a global pool in the hundreds of millions</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Client equity</div><div class="ov-kpi-v">$789B</div><div class="ov-kpi-d muted">a fraction of global brokerage assets</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Fastest regions</div><div class="ov-kpi-v">Asia · Europe</div><div class="ov-kpi-d muted">international skew of new accounts</div></div>'+
  '</div>';
  h+=sec('Where the runway comes from', bullets([
    '<b>Globalization of trading</b> — investors everywhere want direct access to US and global markets from one account; IBKR is the natural cross-border platform.',
    '<b>New asset classes</b> — crypto, overnight (24/5) trading, and CFTC-regulated <b>forecast contracts</b> keep expanding the box of what a single account can trade.',
    '<b>Up-market push</b> — introducing brokers, RIAs and hedge-fund prime brokerage add large, sticky asset pools on top of the individual base.',
    '<b>Cost gravity</b> — as fee pressure grows, assets migrate to the lowest-cost automated venue, which structurally favors IBKR.',
  ]));
  h+='<div class="ov-callout"><b>Sourcing note:</b> IBKR frames its opportunity qualitatively ("multiple large, growing markets at low penetration"); the figures above are company-reported operating metrics, not a sized TAM. Any single TAM dollar would be a fabrication.</div>';
  h+='<div class="ov-foot">Operating metrics: IBKR Q1 2026 results. Runway framing is qualitative, per management commentary.</div>';
  return h;
}
// Industry Analysis ▸ arena positioning + the peer scatter (P/E)
var IND_ARENAS=[
  {k:'auto', a:'Automation / cost', r:'vs every broker', pos:'Leads', pc:BRAND2, pb:'rgba(10,143,76,0.12)', read:'The <b>lowest-cost, most-automated</b> broker — ~77% pre-tax margin no rival approaches. This is the whole moat.'},
  {k:'global', a:'Global market access', r:'vs Schwab · Fidelity', pos:'Leads', pc:BRAND2, pb:'rgba(10,143,76,0.12)', read:'~150 markets, ~35 countries, ~28 currencies from one account — unmatched breadth.'},
  {k:'retail', a:'US retail trading', r:'vs Robinhood', pos:'Contests', pc:AMBER, pb:'rgba(184,134,11,0.14)', read:'Robinhood owns the mass-market mobile-first retail wedge; IBKR wins the <b>sophisticated/active</b> trader.'},
  {k:'prime', a:'Prime brokerage', r:'vs GS · MS · JPM', pos:'Challenger', pc:BLUE, pb:'rgba(46,107,230,0.12)', read:'<b>Preqin #4 prime broker</b> — moving up-market on a fortress balance sheet, behind only the bulge brackets.'},
  {k:'crypto', a:'Crypto & new markets', r:'vs Coinbase', pos:'Emerging', pc:PURPLE, pb:'rgba(122,90,248,0.12)', read:'Adding crypto (via Zero Hash), derivatives and <b>forecast contracts</b> — broadening the box, not betting the firm.'},
];
function industryBody(c){
  var h='<div class="ov-diagram-cap" style="margin:0 0 10px">IBKR competes on <b>cost and breadth</b>, arena by arena. <b>Tap any arena</b> for the state of play.</div>';
  h+='<style>.uam-row{display:grid;grid-template-columns:1.1fr auto 1.5fr;gap:12px;align-items:center;border:1px solid var(--bdr);border-left:4px solid #ccc;border-radius:10px;padding:10px 13px;margin-bottom:8px}.uam-row.ov-clickable{cursor:pointer;transition:.12s}.uam-row.ov-clickable:hover{box-shadow:0 3px 10px rgba(0,0,0,.08)}'+
    '.uam-a{font-size:12.5px;font-weight:800;color:var(--navy)}.uam-r{display:block;font-size:10px;color:var(--mu);font-weight:600;margin-top:2px}'+
    '.uam-pos{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:4px 12px;text-align:center;white-space:nowrap}'+
    '.uam-read{font-size:11.5px;color:var(--navy);line-height:1.45}.uam-read b{font-weight:800}'+
    '@media(max-width:640px){.uam-row{grid-template-columns:1fr;gap:6px}.uam-pos{justify-self:start}}</style>';
  h+=IND_ARENAS.map(function(x){ return '<div class="uam-row ov-clickable" data-detail="arena:'+x.k+'" style="border-left-color:'+x.pc+'"><div class="uam-a">'+x.a+'<span class="uam-r">'+x.r+'</span></div><div class="uam-pos" style="color:'+x.pc+';background:'+x.pb+'">'+x.pos+'</div><div class="uam-read">'+x.read+' <span style="color:'+BRAND+';font-weight:800;white-space:nowrap">detail ›</span></div></div>'; }).join('');
  h+=sec('Listed peers — P/E vs growth', stdPeerScatter()+
    '<div class="ov-diagram-cap" style="margin-top:12px">IBKR trades at a <b>growth premium to legacy discount brokers</b> (SCHW) and a discount to the hyper-growth fintechs (HOOD). Again: financials are valued on <b>P/E, not EV/EBITDA</b> — EV/EBITDA is not a meaningful metric for a broker/financial.</div>');
  h+='<div class="ov-foot">Peer P/E & growth are web-sourced approximations (mid-2026), directional; market caps live. Arena reads per management commentary and third-party rankings.</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — BOTTOM LINE
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// Unit Economics ▸ how a dollar of client cash & a trade make money
function unitEconBody(c){
  var h='<p class="ov-lede">IBKR earns money two ways per client: on <b>balances</b> (net interest) and on <b>activity</b> (commissions). The balances engine is the bigger and, right now, the more debated one.</p>';
  h+=sec('The net-interest spread — how balances earn',
    '<style>.uins-step{border:1px solid var(--bdr);border-radius:10px;padding:12px 14px;margin-bottom:8px;background:var(--w)}'+
      '.uins-step-h{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:3px}'+
      '.uins-step-d{font-size:11.5px;color:var(--mu);line-height:1.55}.uins-step-d b{color:var(--navy)}</style>'+
    '<div class="uins-step"><div class="uins-step-h">1 · Customers hold cash & borrow on margin</div><div class="uins-step-d">Client credit balances are <b>~$169B</b> (+35% YoY); margin loans are <b>~$87B</b> (record). Both grow with client equity.</div></div>'+
    '<div class="uins-step"><div class="uins-step-h">2 · IBKR invests the cash short & lends the margin</div><div class="uins-step-d">Segregated customer cash is invested in <b>&lt;30-day T-bills</b> (short duration = low rate risk); margin loans earn interest; securities lending adds a third stream (net ~$314M in Q3\'25, ~2×).</div></div>'+
    '<div class="uins-step"><div class="uins-step-h">3 · IBKR pays customers Fed funds − 50bps on qualified cash</div><div class="uins-step-d">A genuine differentiator — most brokers pay near-zero. Paying a fair rate <b>attracts more cash</b>, which grows the very balances that earn the spread.</div></div>'+
    '<div class="uins-step"><div class="uins-step-h">4 · The spread = net interest income (~$3.6B FY25)</div><div class="uins-step-d">Interest earned − interest paid = NII, the largest revenue line. NIM-adjusted NII topped <b>$1B in a quarter</b> for the first time (Q4\'25).</div></div>');
  h+=sec('The commission engine — how activity earns',
    '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Commissions are low per-trade fees across stocks, options, futures, bonds, FX and funds. They lever directly to <b>DARTs</b> (Daily Average Revenue Trades), which hit <b>4.4M/day in Q1 2026 (+24% YoY)</b>. Because the platform is fully automated, incremental trades are almost pure margin — which is why commissions crossed <b>$600M in a quarter for the first time</b> in Q1 2026 (+19%).</div>');
  h+='<div class="ov-foot">Balance and NII figures: IBKR Q3 2025–Q1 2026 results. Directional where noted.</div>';
  return h;
}
// Rate Sensitivity ▸ the IBKR-specific must-have (separate from the P/E valuation)
function rateSensBody(c){
  var CUTS=[['−25 bps','≈ −$77M to −$82M','one quarter-point cut'],['−50 bps','≈ −$160M','two cuts'],['−100 bps (−1%)','≈ −$417M','a full point']];
  var h='<p class="ov-lede">The <b>#1 bear question</b>: net interest income is the biggest revenue line, so what happens when the Fed cuts? IBKR discloses the sensitivity — and then shows why growing balances have historically <b>more than offset</b> it.</p>';
  h+=sec('The disclosed sensitivity — each cut, annualized',
    '<style>.rs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}@media(max-width:640px){.rs-grid{grid-template-columns:1fr}}'+
      '.rs-c{border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:11px;padding:13px 15px;text-align:center;background:var(--w)}'+
      '.rs-cut{font-size:12px;font-weight:800;color:var(--navy)}.rs-hit{font-size:20px;font-weight:800;color:'+BRAND+';margin:6px 0 2px}.rs-sub{font-size:10.5px;color:var(--mu)}</style>'+
    '<div class="rs-grid">'+CUTS.map(function(r){ return '<div class="rs-c"><div class="rs-cut">'+esc(r[0])+'</div><div class="rs-hit">'+esc(r[1])+'</div><div class="rs-sub">'+esc(r[2])+' · annual NII</div></div>'; }).join('')+'</div>'+
    '<div class="ave-subh-note" style="margin-top:8px">Sensitivity disclosed by IBKR (Q4\'25 / Q1\'26). Applies to the segregated-cash book; short (&lt;30-day) duration means the impact shows up quickly but is bounded.</div>');
  h+=sec('Why it has not derailed NII — the balance offset',
    '<div class="ov-callout"><b>Growing balances beat falling rates.</b> Client cash, accounts and margin loans have all grown ~30%+ — so even as the Fed began cutting in late 2024, IBKR posted <b>record NII</b> ($967M Q3\'25, $966M Q4\'25, $904M Q1\'26 +17%). A −25bps cut removes ~$77–82M/yr, but a +35% jump in credit balances adds far more. The bear case is real but has been consistently out-run.</div>'+
    '<div class="ov-fynote" style="margin-top:10px">Two more buffers: <b>securities lending</b> (a separate, growing stream — net ~$314M in Q3\'25) and IBKR paying customers <b>Fed funds − 50bps</b>, so when the Fed cuts, IBKR\'s <i>cost</i> of customer cash also falls, cushioning the spread.</div>');
  h+='<div class="ov-foot">Rate-sensitivity figures and quarterly NII: IBKR Q3 2025–Q1 2026 earnings materials. This is separate from the P/E valuation in the Valuation tab.</div>';
  return h;
}
// Suppliers ▸ honest no-SPLC note + conceptual input map
function suppliersBody(c){
  var SUP=[
    { h:'Exchanges & clearinghouses', role:'Where orders are routed, matched and settled — IBKR connects to ~150 markets.' },
    { h:'Market-data vendors', role:'Real-time and reference data feeds IBKR redistributes to clients (and charges for).' },
    { h:'Liquidity providers / ATS venues', role:'Where IBKR sources execution and price improvement for client orders.' },
    { h:'Banks', role:'Custody, settlement banking and the cash-management plumbing behind the balances.' },
  ];
  var h='<p class="ov-lede"><b>Interactive Brokers has no Bloomberg SPLC coverage</b> — there are no named suppliers or customers in the supply-chain database for IBKR. That is expected: IBKR is a financial intermediary, not a manufacturer, so its "supply chain" is a set of market-infrastructure relationships, not vendor contracts.</p>';
  h+='<div class="ov-callout"><b>Bloomberg SPLC has no named suppliers/customers for IBKR.</b> Rather than stub the section with placeholders, here is the honest conceptual input map.</div>';
  h+=sec('IBKR\'s real "suppliers" — market infrastructure',
    '<style>.sup-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:640px){.sup-grid{grid-template-columns:1fr}}'+
      '.sup-c{border:1px solid var(--bdr);border-left:3px solid '+BLUE+';border-radius:10px;padding:11px 13px;background:var(--w)}'+
      '.sup-h{font-size:12.5px;font-weight:800;color:var(--navy);margin-bottom:3px}.sup-r{font-size:11px;color:var(--mu);line-height:1.5}</style>'+
    '<div class="sup-grid">'+SUP.map(function(s){ return '<div class="sup-c"><div class="sup-h">'+esc(s.h)+'</div><div class="sup-r">'+esc(s.role)+'</div></div>'; }).join('')+'</div>');
  h+=sec('IBKR\'s "customers"',
    '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Its customers are <b>millions of self-directed individual and institutional traders</b> — not a disclosed roster of corporate names. No single customer is material, which is precisely why there is nothing for SPLC to map on the customer side either.</div>');
  h+='<div class="ov-foot">Bloomberg SPLC checked: no named suppliers or customers for IBKR (a financial intermediary). The input map above is conceptual, from IBKR\'s business model.</div>';
  return h;
}
// Margins ▸ the 77% pre-tax margin + financial series
var FIN_SERIES={
  years:['FY22','FY23','FY24','FY25'],
  netRev:[2.9,4.3,5.2,6.0],
  nii:[null,2.8,3.1,3.6],
  comm:[null,1.4,1.7,2.1],
  ptMargin:[null,71,71,77],
  clientEq:[null,426,568,780],
};
function marginsBody(c){
  var h='<p class="ov-lede">IBKR runs the <b>highest margins in the brokerage industry</b> — a direct output of automation. Pre-tax margin climbed from <b>71% to a record 77%</b>, on a fortress balance sheet with <b>no long-term debt</b> and ~$6–7B of excess capital.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Pre-tax margin</div><div class="ov-kpi-v">~77%</div><div class="ov-kpi-d up">FY25 · from 71% (FY23–24)</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Net revenues</div><div class="ov-kpi-v">~$6.0B</div><div class="ov-kpi-d up">FY25 · >$4B FY23 → >$6B FY25</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Adj. pre-tax income</div><div class="ov-kpi-v">>$1B</div><div class="ov-kpi-d up">5+ straight quarters</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Long-term debt</div><div class="ov-kpi-v">None</div><div class="ov-kpi-d muted">~$6–7B excess capital</div></div>'+
  '</div>';
  h+='<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Revenue mix <span>($B · NII + Commissions, FY)</span></div><div class="ov-chart-wrap"><canvas id="ibkrChartRev"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Client equity <span>($B, year-end)</span></div><div class="ov-chart-wrap"><canvas id="ibkrChartEq"></canvas></div></div>'+
  '</div>';
  h+='<div class="ave-subh-note" style="margin-top:8px">All figures approximate/directional. Net revenues ($B): FY22 ~2.9, FY23 ~4.3, FY24 ~5.2, FY25 ~6.0. Pre-tax margin (%): FY23 71, FY24 71, FY25 77. IBKR is not in the Summit DCF; series are hardcoded from reported results.</div>';
  h+='<div class="ov-foot">Source: IBKR FY2023–FY2025 results. Directional — confirm against filings before quoting.</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — EVOLUTION
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// Earnings Calls ▸ IBKR_THEMES with By theme ⇄ By quarter toggle + accordion (9 threads across 10 calls)
var IBKR_THEMES=[
  { theme:'Account & client-asset growth',
    why:'The compounding engine — organic, international, no incentives. As long as accounts and equity grow, so does everything else.',
    updates:[
      { q:'Q4 2023', items:['+470k accounts in FY23; client equity <b>+39% to $426B</b>.'] },
      { q:'Q1 2024', items:['+184k accounts (2nd best ever); equity <b>$466B</b>.'] },
      { q:'Q2 2024', items:['+178k accounts; equity ~<b>$497B</b>; credit balances $107B.'] },
      { q:'Q3 2024', items:['Client equity tops <b>$500B for the first time</b> ($541B, +46%).'] },
      { q:'Q4 2024', items:['+217k accounts (FY24 record 775k); equity <b>$568B (+33%)</b>.'] },
      { q:'Q1 2025', items:['<b>+279k accounts — a record</b>; accounts +32% YoY.'] },
      { q:'Q2 2025', items:['+250k accounts; equity <b>$664B</b>; credit balances $144B.'] },
      { q:'Q3 2025', items:['<b>4-millionth customer</b>; equity tops $750B (+40% vs +16% for the S&P).'] },
      { q:'Q4 2025', items:['<b>>1M net-new accounts in FY25 (record)</b>; equity $780B (+37%, +$200B).'] },
      { q:'Q1 2026', items:['Record accounts; equity <b>$789B (+38%)</b>; credit balances $169B (+35%).','Peterffy on durability: "as long as I shall live."'] },
    ]},
  { theme:'Net interest income & rate sensitivity',
    why:'The biggest revenue line — and the bear case (rate cuts). The recurring answer: growing balances keep offsetting the cuts.',
    updates:[
      { q:'Q4 2023', items:['NII $730M; FY23 $2.8B. Short (&lt;30-day) duration; pays customers Fed funds − 50bps.'] },
      { q:'Q3 2024', items:['NII <b>$802M — a record</b> despite the first Fed/UK/HK cuts; −25bps = −$64M.'] },
      { q:'Q2 2025', items:['NII record; margin loans a record $55B.'] },
      { q:'Q3 2025', items:['NII <b>$967M</b>; −25bps = −$77M, full 1% = −$417M; securities-lending net $314M (~2×).'] },
      { q:'Q4 2025', items:['NII $966M; FY25 <b>$3.6B</b>; NIM-adjusted NII tops $1B in a quarter for the first time.'] },
      { q:'Q1 2026', items:['NII <b>$904M (+17%)</b>; −25bps = −$82M; margin loans $86.6B.'] },
    ]},
  { theme:'New products & asset classes',
    why:'Broadening the box — crypto, overnight trading and prediction markets keep expanding what a single account can do.',
    updates:[
      { q:'Q3 2024', items:['<b>ForecastEx launched</b> (CFTC-regulated forecast contracts).'] },
      { q:'Q4 2024', items:['Election trading on ForecastEx; overnight trading scaling.'] },
      { q:'Q1 2025', items:['Crypto: +Solana/Cardano/XRP/Dogecoin (<b>11 coins</b>); allocation limit 10% → 30%. Overnight trading +250% YoY.'] },
      { q:'Q2 2025', items:['Took a stake in <b>Zero Hash</b> (crypto infrastructure).'] },
      { q:'Q3 2025', items:['Crypto volume +87% QoQ / 5× YoY.'] },
      { q:'Q4 2025', items:['ForecastX: <b>286M contract pairs</b> (from 15M), 10,000+ instruments, 24/7.'] },
      { q:'Q1 2026', items:['Crypto EEA launch + <b>Coinbase Derivatives perpetuals</b> + transfer-in. Overnight nearly tripled (2.8M → 8.1M). ForecastEx <b>Election Board</b> for the midterms.'] },
    ]},
  { theme:'AI across the firm',
    why:'Efficiency today, a trading-velocity thesis tomorrow. Headcount ~flat while accounts grew ~30%+.',
    updates:[
      { q:'Q4 2024', items:['<b>Ask IBKR</b>, Investment Themes, Connections; AI news summaries (FINRA-approved).'] },
      { q:'Q2 2025', items:['Multilingual chatbot; automated onboarding, compliance and surveillance.'] },
      { q:'Q4 2025', items:['Headcount ~flat (2,900 → 3,232) while accounts grew ~30%+; customer-service costs down.'] },
      { q:'Q1 2026', items:['Peterffy/Galik: AI should <b>raise trading velocity</b> long-term — a future revenue lever, not just cost.'] },
    ]},
  { theme:'Prime brokerage & hedge funds',
    why:'Moving up-market against the bulge brackets — a fortress balance sheet is the trust signal.',
    updates:[
      { q:'Q1 2024', items:['Launched <b>High-Touch Prime</b> + a global outsourced trading desk.'] },
      { q:'Q3 2024', items:['34 funds onboarded, avg ~$160M each.'] },
      { q:'Q3 2025', items:['<b>Preqin #4 prime broker</b> (behind GS/MS/JPM); cap-intro revamp (120 → 240 participants). Fortress balance sheet as a trust signal.'] },
    ]},
  { theme:'Introducing brokers',
    why:'Distribution through other firms — banks and brokers run their brokerage on IBKR rails.',
    updates:[
      { q:'Q2 2024', items:['<b>HSBC WorldTrader</b> launched, powered by IBKR. ~two-dozen firms in the pipeline.'] },
      { q:'Q4 2024', items:['UAE ~10k-account migration; Asian virtual banks; omnibus vs disclosed models.'] },
      { q:'Q2 2025', items:['Firms that once declined are returning, drawn by breadth and cost.'] },
    ]},
  { theme:'Margins, capital & dividend',
    why:'The 77% margin, a fortress balance sheet, and a growing capital return — disciplined by design.',
    updates:[
      { q:'Q4 2023', items:['Pre-tax margin 70%+; no long-term debt; dividend $0.10/qtr (since 2011).'] },
      { q:'Q1 2025', items:['Dividend raised to <b>$0.25/qtr</b>.'] },
      { q:'Q2 2025', items:['<b>4-for-1 stock split</b> (June 2025); equity $16.6B → $21.3B; ~$6–7B excess capital.'] },
      { q:'Q4 2025', items:['Pre-tax margin a record <b>77%</b>; 6+ straight 70%+ quarters. M&A discipline: "couldn\'t agree on price" on two targets; won\'t buy sports-betting.'] },
      { q:'Q1 2026', items:['Dividend raised to <b>$0.35/yr</b> (split-adjusted); policy ~0.5–1% of the stock price.'] },
    ]},
  { theme:'Regulation & structure',
    why:'The tailwinds and risks a broker lives with — charters, fee changes, and rule reform.',
    updates:[
      { q:'Q3 2024', items:['IB Central Europe + Ireland merger (~$7M/yr savings); Dubai office.'] },
      { q:'Q4 2024', items:['Applied for an <b>OCC National Trust Bank charter</b> (to custody fund/ETF assets); eventual European bank license (Ireland).'] },
      { q:'Q3 2025', items:['Added to the <b>S&P 500</b>. SEC fee moves ($27.80 → $0 → $20.60, pass-through). Crypto rules easing (SAB-121 rescinded; Coinbase suit dropped).'] },
      { q:'Q1 2026', items:['<b>Pattern-day-trader rule elimination</b> — a tailwind for small active accounts. Prediction-market fights (Kalshi/sports) in court — IBKR avoids sports.'] },
    ]},
  { theme:"Peterffy's macro & the founder view",
    why:'The founder still shapes the thesis — his macro read and the clean founder-to-CEO handoff.',
    updates:[
      { q:'Q4 2023', items:['<b>Rates-higher-for-longer</b> thesis (de-globalization, demographics, deficits, green spend).'] },
      { q:'Q2 2024', items:['Multi-year market bullishness; margin-loans-as-a-warning ("nervous Nelly").'] },
      { q:'Q4 2025', items:['Overnight trading a secular <b>10–20 year</b> trend.'] },
      { q:'Q1 2026', items:['Clean founder-to-CEO handoff (Galik since 2019); Peterffy engaged as Chairman and majority owner.'] },
    ]},
];
function callsByQuarter(){
  var map={}, order=[];
  IBKR_THEMES.forEach(function(ct){ ct.updates.forEach(function(u){ if(!map[u.q]){ map[u.q]=[]; order.push(u.q); } map[u.q].push({ theme:ct.theme, items:u.items }); }); });
  function qval(q){ var m=String(q).match(/Q(\d)\s+(\d{4})/); return m?(+m[2])*10+(+m[1]):0; }
  order.sort(function(a,b){ return qval(b)-qval(a); });
  return { order:order, map:map };
}
function callsBody(){
  var h='<style>.calls-tog{display:inline-flex;gap:4px;background:#F2F5F8;border:1px solid var(--bdr);border-radius:999px;padding:3px;margin-bottom:14px}'+
    '.calls-pill{border:none;background:transparent;font:inherit;font-size:12px;font-weight:700;color:var(--mu);padding:5px 15px;border-radius:999px;cursor:pointer;transition:.12s}'+
    '.calls-pill:hover{color:var(--navy)}.calls-pill.active{background:var(--navy);color:#fff}'+
    '.calls-tl{font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--navy);margin:0 0 4px}'+
    '.lpb-acc-item{border:1px solid var(--bdr);border-radius:10px;margin-bottom:8px;overflow:hidden}'+
    '.lpb-acc-h{width:100%;text-align:left;border:none;background:#F7F9FB;font:inherit;font-size:12.5px;font-weight:800;color:var(--navy);padding:11px 14px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px}'+
    '.lpb-acc-h:hover{background:#EEF2F6}.lpb-acc-ic{color:var(--mu);font-weight:800}'+
    '.lpb-acc-body{padding:12px 14px;display:none}.lpb-acc-item.open .lpb-acc-body{display:block}'+
    '.ov-chip{display:inline-block;font-size:10px;font-weight:800;color:'+BRAND+';background:rgba(214,0,28,0.08);border-radius:20px;padding:2px 9px}</style>';
  h+='<p class="ov-lede">The key narrative threads from <b>10 earnings calls</b> (Q4 2023 → Q1 2026). Switch lens: <b>By theme</b> traces how each story evolved; <b>By quarter</b> shows what mattered in a given call. Tap any row to expand.</p>';
  h+='<div class="calls-tog" role="tablist"><button type="button" class="calls-pill active" data-callsv="theme">By theme</button><button type="button" class="calls-pill" data-callsv="quarter">By quarter</button></div>';
  h+='<div class="lpb-acc" id="ibkrCallsTheme">';
  IBKR_THEMES.forEach(function(ct){
    h+='<div class="lpb-acc-item">';
    h+='<button type="button" class="lpb-acc-h"><span>'+esc(ct.theme)+'</span><span class="lpb-acc-ic">+</span></button>';
    h+='<div class="lpb-acc-body">';
    h+='<p style="font-size:12px;color:var(--mu);margin:0 0 10px;font-style:italic">'+esc(ct.why)+'</p>';
    ct.updates.forEach(function(u){
      h+='<div style="margin-bottom:10px"><span class="ov-chip" style="margin-right:6px">'+esc(u.q)+'</span>';
      h+='<ul class="ov-bullets" style="margin-top:4px">'+u.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>';
    });
    h+='</div></div>';
  });
  h+='</div>';
  var byQ=callsByQuarter();
  h+='<div class="lpb-acc" id="ibkrCallsQuarter" style="display:none">';
  byQ.order.forEach(function(q){
    h+='<div class="lpb-acc-item">';
    h+='<button type="button" class="lpb-acc-h"><span>'+esc(q)+'</span><span class="lpb-acc-ic">+</span></button>';
    h+='<div class="lpb-acc-body">';
    byQ.map[q].forEach(function(row){
      h+='<div style="margin-bottom:12px"><div class="calls-tl">'+esc(row.theme)+'</div>';
      h+='<ul class="ov-bullets" style="margin-top:2px">'+row.items.map(function(it){ return '<li>'+it+'</li>'; }).join('')+'</ul></div>';
    });
    h+='</div></div>';
  });
  h+='</div>';
  h+='<div class="ov-fynote" style="margin-top:12px">Sources: IBKR Q4 2023–Q1 2026 earnings calls and prepared remarks. Highlights are qualitative and contemporaneous — written from the perspective of each call.</div>';
  return h;
}
function guidanceBody(c){
  var h='<p class="ov-lede">IBKR gives <b>little formal guidance</b> — it does not issue revenue or EPS targets. What management does commit to is a <b>philosophy</b>: automate everything, keep margins industry-leading, grow organically, and return excess capital via a rising dividend.</p>';
  h+=sec('The framework management stands behind', bullets([
    '<b>Margin discipline</b> — pre-tax margin held 70%+ for 6+ straight quarters, a record 77% in FY25.',
    '<b>Organic growth</b> — no sign-up bonuses or incentives; every new account is earned on price and product.',
    '<b>Fortress balance sheet</b> — no long-term debt, ~$6–7B excess capital; a deliberate trust signal for institutional clients.',
    '<b>Capital return</b> — dividend policy set at ~0.5–1% of the stock price: $0.10 (2011) → $0.25/qtr (Q1\'25) → 4-for-1 split (Jun 2025) → $0.35/yr (Q1\'26).',
    '<b>Disciplined M&A</b> — "couldn\'t agree on price" on two targets; explicitly won\'t buy sports-betting.',
  ]));
  h+='<div class="ov-foot">Per IBKR FY2023–Q1 2026 earnings commentary. IBKR is not in the Summit DCF; there are no model targets to compare against.</div>';
  return h;
}
function strategyBody(c){
  var DRIVERS=[
    ['🔁','The flywheel','More accounts → more equity → more cash & margin (NII) and more DARTs (commissions), all at near-zero incremental cost.'],
    ['🤖','Automate everything','The lowest cost structure in the industry → ~77% pre-tax margins → prices no rival can match → more accounts.'],
    ['🌍','Broaden the box','New markets, asset classes (crypto, overnight, forecast contracts) and client segments (prime, RIAs, introducing brokers).'],
    ['🏰','Fortress capital','No debt, huge excess capital — funds the up-market push into prime brokerage and signals safety to institutions.'],
    ['💵','Return the excess','A rising dividend tied to the stock price; disciplined, no dilutive M&A.'],
  ];
  var h='<p class="ov-lede">If you read nothing else: IBKR is a <b>cost-and-automation flywheel</b> with a founder\'s discipline. Five levers explain the whole business.</p>';
  h+='<style>.ov-drivers{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:11px}'+
    '.ov-driver{border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:12px;padding:13px 15px;background:var(--w)}'+
    '.ov-driver-ic{font-size:22px;line-height:1}.ov-driver-t{font-size:13px;font-weight:800;color:var(--navy);margin:6px 0 4px}.ov-driver-d{font-size:11.5px;color:var(--mu);line-height:1.5}</style>';
  h+='<div class="ov-drivers">'+DRIVERS.map(function(d){ return '<div class="ov-driver"><div class="ov-driver-ic">'+d[0]+'</div><div class="ov-driver-t">'+esc(d[1])+'</div><div class="ov-driver-d">'+esc(d[2])+'</div></div>'; }).join('')+'</div>';
  h+='<div class="ov-foot">Strategy framing per IBKR earnings commentary and business model.</div>';
  return h;
}
function timelineBody(){
  return sec('History & Milestones', stdTimeline());
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — VALUATION
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// Sensitivity ▸ P/E × FY2027E EPS, per-share, vs the live quote. Two drivers. NO EV/EBITDA.
var SENS={
  epsMin:1.8, epsMax:3.4, epsBase:2.60, epsStep:0.05,
  peMin:18, peMax:42, peBase:30, peStep:1,
  price:72.00,      // fallback live price (editable; overwritten by get-quote). Post 4-for-1 split.
  eps:2.60, pe:30,
};
function sensImplied(){ return SENS.eps*SENS.pe; }
function sensBody(c){
  var h='<style>.sens-live{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 12px;font-size:12px}'+
    '.sens-live-px{font-size:16px;font-weight:800;color:var(--navy)}.sens-live-ts{font-size:10.5px;color:var(--mu)}'+
    '.sens-drv{margin:14px 0}.sens-drv-h{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px}'+
    '.sens-drv-l{font-size:12px;font-weight:800;color:var(--navy)}.sens-drv-v{font-size:13px;font-weight:800;color:'+BRAND+'}'+
    '.sens-drv input[type=range]{width:100%}.sens-hint{font-size:10.5px;color:var(--mu);margin-top:3px}'+
    '.sens-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0}@media(max-width:600px){.sens-tiles{grid-template-columns:1fr}}'+
    '.sens-tile{border:1px solid var(--bdr);border-top:3px solid '+BRAND+';border-radius:11px;padding:12px 14px;text-align:center;background:var(--w)}'+
    '.sens-tile-l{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}'+
    '.sens-tile-v{font-size:22px;font-weight:800;color:var(--navy);margin:5px 0 2px}.sens-tile-d{font-size:10.5px;font-weight:700}'+
    '.sens-up{color:#0a8f0a}.sens-down{color:'+BRAND+'}.sens-mut{color:var(--mu)}'+
    '.sens-mx{width:100%;border-collapse:collapse;font-size:11px;margin-top:6px}'+
    '.sens-mx th,.sens-mx td{border:1px solid var(--bdr);padding:5px 7px;text-align:center;font-variant-numeric:tabular-nums}'+
    '.sens-mx th{background:#F7F9FB;font-weight:800;color:var(--mu)}.sens-mx td.hot{font-weight:800}</style>';
  h+='<p class="ov-lede">IBKR is a broker — so the valuation is on <b>P/E, never EV/EBITDA</b>. This values the firm <b>at FY2027E</b> (the next full fiscal year), per share, from two drivers: <b>FY2027E EPS</b> (comprehensive-diluted) and the <b>P/E multiple</b>. Implied price = <b>EPS × P/E</b>, compared to the live quote.</p>';
  h+='<div class="sens-live">Live price: <span class="sens-live-px" id="ibkrSensPx">$'+SENS.price.toFixed(2)+'</span><span class="sens-live-ts" id="ibkrSensTs">fallback — verify live</span></div>';
  h+='<div class="sens-drv"><div class="sens-drv-h"><span class="sens-drv-l">FY2027E EPS (comprehensive-diluted)</span><span class="sens-drv-v" id="ibkrEpsV">$'+SENS.eps.toFixed(2)+'</span></div>'+
    '<input type="range" id="ibkrEps" min="'+SENS.epsMin+'" max="'+SENS.epsMax+'" step="'+SENS.epsStep+'" value="'+SENS.eps+'">'+
    '<div class="sens-hint">Base ~$2.60. FY2025 comprehensive-diluted EPS ~$2.1 (post the Jun 2025 4-for-1 split); ~10–12%/yr growth, partly offset by rate cuts. Range $1.8–3.4.</div></div>';
  h+='<div class="sens-drv"><div class="sens-drv-h"><span class="sens-drv-l">P/E multiple (×)</span><span class="sens-drv-v" id="ibkrPeV">'+SENS.pe.toFixed(0)+'×</span></div>'+
    '<input type="range" id="ibkrPe" min="'+SENS.peMin+'" max="'+SENS.peMax+'" step="'+SENS.peStep+'" value="'+SENS.pe+'">'+
    '<div class="sens-hint">Base ~30× (IBKR trades at a growth premium to legacy discount brokers). Range 18–42×.</div></div>';
  h+='<div class="sens-tiles" id="ibkrSensTiles"></div>';
  h+=sec('Sensitivity grid — implied price = EPS × P/E', '<div style="overflow-x:auto">'+sensMatrix()+'</div>'+
    '<div class="ave-subh-note" style="margin-top:8px">Rows = FY2027E EPS, columns = P/E. Cell = EPS × P/E. All figures directional; verify EPS and the live quote before quoting.</div>');
  h+='<div class="ov-foot">P/E-at-FY2027E framework. Base EPS ~$2.60 and P/E ~30× are directional anchors, not Summit outputs. IBKR is a financial — EV/EBITDA is not used.</div>';
  return h;
}
function sensMatrix(){
  var epsRow=[2.0,2.3,2.6,2.9,3.2], peCol=[20,25,30,35,40];
  var h='<table class="sens-mx"><thead><tr><th>EPS ＼ P/E</th>'+peCol.map(function(p){ return '<th>'+p+'×</th>'; }).join('')+'</tr></thead><tbody>';
  epsRow.forEach(function(e){
    h+='<tr><th>$'+e.toFixed(2)+'</th>'+peCol.map(function(p){ var v=e*p; var hot=(e===2.6&&p===30); return '<td class="'+(hot?'hot':'')+'" style="'+(hot?'background:rgba(214,0,28,0.10);color:'+BRAND:'')+'">$'+v.toFixed(0)+'</td>'; }).join('')+'</tr>';
  });
  h+='</tbody></table>';
  return h;
}
function renderSens(root){
  root=root||document.getElementById('co-detailview'); if(!root) return;
  var epsV=root.querySelector('#ibkrEpsV'), peV=root.querySelector('#ibkrPeV'), tiles=root.querySelector('#ibkrSensTiles');
  if(epsV) epsV.textContent='$'+SENS.eps.toFixed(2);
  if(peV) peV.textContent=SENS.pe.toFixed(0)+'×';
  if(!tiles) return;
  var implied=sensImplied();
  var upPct=(implied/SENS.price-1)*100;
  function tile(l,v,d,cls){ return '<div class="sens-tile"><div class="sens-tile-l">'+esc(l)+'</div><div class="sens-tile-v">'+v+'</div><div class="sens-tile-d '+cls+'">'+d+'</div></div>'; }
  tiles.innerHTML=
    tile('FY2027E EPS','$'+SENS.eps.toFixed(2),(SENS.eps-SENS.epsBase>=0?'+':'−')+'$'+Math.abs(SENS.eps-SENS.epsBase).toFixed(2)+' vs base','sens-mut')+
    tile('P/E',SENS.pe.toFixed(0)+'×',(SENS.pe-SENS.peBase>=0?'+':'−')+Math.abs(SENS.pe-SENS.peBase).toFixed(0)+'× vs base','sens-mut')+
    tile('Implied price','$'+implied.toFixed(2),(upPct>=0?'▲ +':'▼ −')+Math.abs(upPct).toFixed(1)+'% vs $'+SENS.price.toFixed(2),upPct>=0?'sens-up':'sens-down');
}
// Peers ▸ P/E table (forward). NEVER EV/EBITDA for financials.
var PEER_MULT=[
  { tk:'IBKR', n:'Interactive Brokers', mc:'live', peF:'~30×', peT:'~34×', g:'+12%', self:true, read:'Scaled, ~77%-margin global broker. A growth premium to legacy discount brokers; a discount to hyper-growth fintechs.' },
  { tk:'SCHW', n:'Charles Schwab', mc:'~$160B', peF:'~20×', peT:'~22×', g:'+8%', read:'US discount-broker giant; bigger, slower, more rate/deposit-sensitive — hence a lower multiple.' },
  { tk:'HOOD', n:'Robinhood', mc:'~$90B', peF:'~45×', peT:'~55×', g:'+30%', read:'US retail-trading disruptor; fastest grower, richest multiple — more consumer fintech than global broker.' },
  { tk:'FUTU', n:'Futu Holdings', mc:'~$20B', peF:'~18×', peT:'~20×', g:'+30%', read:'The "Asian IBKR" — fast-growing but cheap on P/E given China/regulatory risk.' },
  { tk:'COIN', n:'Coinbase', mc:'~$90B', peF:'~35×', peT:'~40×', g:'+25%', read:'Crypto-broker adjacency; earnings swing with crypto volumes, so its P/E is volatile.' },
];
function peersBody(c){
  var rowsHtml=PEER_MULT.map(function(p){
    var bg=p.self?'background:rgba(214,0,28,0.06);':'';
    return '<tr style="border-top:1px solid var(--bdr);'+bg+'">'+
      '<td style="padding:8px 10px;font-weight:'+(p.self?'800':'700')+'">'+esc(p.n)+' <span class="muted" style="font-weight:600">'+esc(p.tk)+'</span></td>'+
      '<td style="text-align:right;padding:8px 10px;font-variant-numeric:tabular-nums">'+esc(p.mc)+'</td>'+
      '<td style="text-align:right;padding:8px 10px;font-variant-numeric:tabular-nums">'+esc(p.peF)+'</td>'+
      '<td style="text-align:right;padding:8px 10px;font-variant-numeric:tabular-nums">'+esc(p.peT)+'</td>'+
      '<td style="text-align:right;padding:8px 10px;font-variant-numeric:tabular-nums">'+esc(p.g)+'</td>'+
      '<td style="padding:8px 10px;color:var(--mu);font-size:11px;line-height:1.45">'+esc(p.read)+'</td></tr>';
  }).join('');
  var h='<p class="ov-lede">How the <b>listed</b> broker/fintech peers trade — on <b>P/E</b>, the only meaningful multiple for a financial. <b>EV/EBITDA is not used</b> for brokers. IBKR sits at a premium to Schwab (growth, margin) and a discount to the hyper-growth names.</p>';
  h+='<div class="ov-chart-card" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="color:var(--mu)">'+
    '<th style="text-align:left;padding:7px 10px">Company</th>'+
    '<th style="text-align:right;padding:7px 10px">Mkt cap</th>'+
    '<th style="text-align:right;padding:7px 10px">P/E <span style="font-weight:600">(fwd)</span></th>'+
    '<th style="text-align:right;padding:7px 10px">P/E <span style="font-weight:600">(ttm)</span></th>'+
    '<th style="text-align:right;padding:7px 10px">Growth</th>'+
    '<th style="text-align:left;padding:7px 10px">The read</th></tr></thead><tbody>'+rowsHtml+'</tbody></table></div>';
  h+='<div class="ov-callout" style="margin-top:12px"><b>Financials are valued on P/E, not EV/EBITDA.</b> A broker\'s "EBITDA" is not a meaningful cash proxy — net interest income, leverage and regulatory capital dominate. IBKR\'s own "market cap" reflects only the <b>public float</b> (up-C — see Ownership).</div>';
  h+='<div class="ov-foot">Multiples as of ~Jul 2026, forward where available; growth is directional YoY. Market caps live on the Overview scatter. Confirm against a terminal before quoting.</div>';
  return h;
}
// Capital Allocation ▸ dividend/buyback/split
function capallocBody(c){
  var h='<p class="ov-lede">IBKR returns capital through a <b>rising dividend</b>, tied to ~0.5–1% of the stock price, on a balance sheet with <b>no long-term debt</b> and ~$6–7B of excess capital. Growth is self-funded and organic, so capital return is disciplined rather than aggressive.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Dividend (annual)</div><div class="ov-kpi-v">$0.35</div><div class="ov-kpi-d up">raised Q1 2026 (split-adj)</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Stock split</div><div class="ov-kpi-v">4-for-1</div><div class="ov-kpi-d muted">June 2025</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Long-term debt</div><div class="ov-kpi-v">None</div><div class="ov-kpi-d muted">fortress balance sheet</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Excess capital</div><div class="ov-kpi-v">~$6–7B</div><div class="ov-kpi-d muted">above regulatory minimums</div></div>'+
  '</div>';
  h+=sec('The dividend path', bullets([
    '<b>$0.10/qtr</b> — held since 2011.',
    '<b>$0.25/qtr</b> — raised Q1 2025.',
    '<b>4-for-1 split</b> — June 2025 → $0.32 split-adjusted.',
    '<b>$0.35/yr</b> — raised Q1 2026. Policy: ~0.5–1% of the stock price.',
  ]));
  h+=sec('M&A discipline', '<div class="ov-callout">Management is explicit: disciplined on price ("couldn\'t agree on price" on two targets) and will <b>not buy sports-betting</b>. Growth is organic; capital is not spent to manufacture it.</div>');
  h+='<div class="ov-foot">Dividend and capital figures per IBKR FY2023–Q1 2026 earnings materials. Directional.</div>';
  return h;
}
// Financials ▸ hardcoded reported series (IBKR not in Summit DCF)
function financialsBody(c){
  function row(label,arr,fmt){ return '<tr style="border-top:1px solid var(--bdr)"><td style="padding:7px 10px;font-weight:700">'+esc(label)+'</td>'+FIN_SERIES.years.map(function(y,i){ var v=arr[i]; return '<td style="text-align:right;padding:7px 10px;font-variant-numeric:tabular-nums">'+(v==null?'—':fmt(v))+'</td>'; }).join('')+'</tr>'; }
  var h='<p class="ov-lede">IBKR is <b>not in the Summit DCF</b>, so these are reported figures, hardcoded and directional. The story is consistent: revenues and client equity compounding, margins rising.</p>';
  h+='<div class="ov-chart-card" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="color:var(--mu)"><th style="text-align:left;padding:7px 10px">($B unless noted)</th>'+FIN_SERIES.years.map(function(y){ return '<th style="text-align:right;padding:7px 10px">'+esc(y)+'</th>'; }).join('')+'</tr></thead><tbody>'+
    row('Net revenues',FIN_SERIES.netRev,function(v){return '$'+v.toFixed(1)+'B';})+
    row('Net interest income',FIN_SERIES.nii,function(v){return '$'+v.toFixed(1)+'B';})+
    row('Commissions',FIN_SERIES.comm,function(v){return '$'+v.toFixed(1)+'B';})+
    row('Pre-tax margin',FIN_SERIES.ptMargin,function(v){return v+'%';})+
    row('Client equity (year-end)',FIN_SERIES.clientEq,function(v){return '$'+v+'B';})+
  '</tbody></table></div>';
  h+='<div class="ave-subh-note" style="margin-top:8px">All approximate/directional. Net revenues: FY22 ~2.9, FY23 ~4.3, FY24 ~5.2, FY25 ~6.0. NII: FY23 2.8, FY24 3.1, FY25 3.6. Commissions: FY23 1.4, FY24 1.7, FY25 2.1. Pre-tax margin: FY23 71, FY24 71, FY25 77. Client equity: 2023 426, 2024 568, 2025 780.</div>';
  h+='<div class="ov-foot">Source: IBKR FY2022–FY2025 reported results. Not a Summit model output.</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// Ownership ▸ the up-C structure explainer (the IBKR equivalent of Visa's share-class story)
function ownershipBody(c){
  var h='<p class="ov-lede">IBKR has an unusual <b>"up-C" (Umbrella Partnership–C-corporation) structure</b> — the reason a quoted "market cap" understates the true enterprise, why EPS is reported "comprehensive diluted", and why the tax note splits public vs operating company. It is the IBKR equivalent of Visa\'s share-class story.</p>';
  h+='<style>.upc{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:8px 0}@media(max-width:640px){.upc{grid-template-columns:1fr}}'+
    '.upc-box{border:1px solid var(--bdr);border-radius:12px;padding:14px 16px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.upc-box:hover{box-shadow:0 3px 12px rgba(0,0,0,.08)}'+
    '.upc-pub{border-top:3px solid '+BLUE+'}.upc-ins{border-top:3px solid '+BRAND+'}'+
    '.upc-h{font-size:13px;font-weight:800;color:var(--navy)}.upc-own{font-size:24px;font-weight:800;margin:6px 0 2px;line-height:1}'+
    '.upc-d{font-size:11px;color:var(--mu);line-height:1.5}'+
    '.upc-op{border:1px dashed var(--bdr);border-radius:12px;padding:14px 16px;background:linear-gradient(180deg,rgba(214,0,28,0.04),transparent);text-align:center;margin:12px 0}'+
    '.upc-op-h{font-size:13px;font-weight:800;color:var(--navy)}.upc-op-d{font-size:11.5px;color:var(--mu);line-height:1.5;margin-top:4px}'+
    '.upc-arrow{text-align:center;font-size:20px;color:var(--mu);margin:2px 0}</style>';
  h+='<div class="upc">'+
    '<div class="upc-box upc-pub ov-clickable" data-detail="upc:public"><div class="upc-h">IBKR Group Inc — the public company</div><div class="upc-own" style="color:'+BLUE+'">~25–30%</div><div class="upc-d">of the operating company (IBG LLC). This is the Class A stock the public holds; the quoted "market cap" reflects only <b>this slice</b> — the public float. <span style="color:'+BLUE+';font-weight:700">detail ›</span></div></div>'+
    '<div class="upc-box upc-ins ov-clickable" data-detail="upc:holdings"><div class="upc-h">IBG Holdings — Peterffy & insiders</div><div class="upc-own" style="color:'+BRAND+'">~70–75%</div><div class="upc-d">of IBG LLC, held by <b>Thomas Peterffy</b> and insiders/employees. Peterffy alone is <b>~75%+</b> economic. <span style="color:'+BRAND+';font-weight:700">detail ›</span></div></div>'+
  '</div>';
  h+='<div class="upc-arrow">▼ both own units of ▼</div>';
  h+='<div class="upc-op ov-clickable" data-detail="upc:opco"><div class="upc-op-h">IBG LLC — the operating company</div><div class="upc-op-d">The business that actually earns the ~$6B of revenue. IBKR Group Inc consolidates 100% of it but is <b>entitled to only ~25–30% of the economics</b>; the rest belongs to IBG Holdings. <span style="color:'+BRAND+';font-weight:700">why this matters ›</span></div></div>';
  h+=sec('Why it matters — three consequences', bullets([
    '<b>"Market cap" is only the public float.</b> The figure on quote screens reflects the ~25–30% held via IBKR Group Inc — not the whole enterprise. Peterffy\'s ~75%+ stake sits outside it.',
    '<b>EPS is "comprehensive diluted."</b> IBKR reports as-if <b>all IBG units converted</b> to public shares — so the EPS you see already reflects the full economic base (the right number to multiply by a P/E).',
    '<b>The income-tax note splits public vs operating company.</b> IBG LLC (the operating co) is largely a pass-through; only IBKR Group Inc\'s ~25–30% slice bears full corporate tax — which is why the tax disclosure separates the two.',
  ]));
  h+='<div class="ov-callout"><b>Bottom line:</b> IBKR is <b>founder-controlled</b>. Peterffy\'s ~75%+ economic interest and control mean public shareholders own a minority slice and ride alongside the founder — a governance nuance to weigh, and the reason the reported share economics look the way they do.</div>';
  h+='<div class="ov-foot">Up-C structure and ownership percentages per IBKR filings/IR; percentages are approximate and shift as IBG units convert over time. Live insider/ownership detail is in the Pillars → Management tab.</div>';
  return h;
}
function govBody(c){
  var h='<p class="ov-lede">Governance is <b>founder-controlled by design</b>: Peterffy holds majority economics and votes, the board is intentionally light, and the balance sheet is deliberately conservative (no debt, huge excess capital).</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Control</div><div class="ov-kpi-v">Founder</div><div class="ov-kpi-d muted">Peterffy ~75%+ economic</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Public ownership</div><div class="ov-kpi-v">~25–30%</div><div class="ov-kpi-d muted">of IBG LLC (up-C)</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Long-term debt</div><div class="ov-kpi-v">None</div><div class="ov-kpi-d muted">~$6–7B excess capital</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Board addition</div><div class="ov-kpi-v">Rich Repetto</div><div class="ov-kpi-d muted">independent, ~2024</div></div>'+
  '</div>';
  h+=sec('The read', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">The pros of founder control: <b>long-term thinking</b> (Peterffy\'s "as long as I shall live" durability, big multi-year bets like ForecastEx), <b>capital discipline</b>, and deep alignment (the founder\'s wealth <i>is</i> the stock). The cons: <b>concentrated control</b> means public holders own a minority and have limited say; succession beyond Galik is a long-term question. The <b>Rich Repetto</b> board addition (a well-regarded former Piper Sandler broker analyst) is a credible independent voice. Verify names and committees against the latest proxy.</div>');
  h+='<div class="ov-foot">Governance facts per IBKR filings/IR and management config. Confirm board composition against the latest proxy.</div>';
  return h;
}
// Track Record ▸ green/amber/red per-exec scorecard with pop-ups
var TRACK_RATE={ green:{c:'#0a8f0a',bg:'rgba(10,143,10,0.09)',bd:'rgba(10,143,10,0.34)',l:'Value creator'},
  amber:{c:'#B7791F',bg:'rgba(232,160,12,0.10)',bd:'rgba(232,160,12,0.34)',l:'Mixed / unproven'},
  red:{c:'#C0392B',bg:'rgba(192,57,43,0.09)',bd:'rgba(192,57,43,0.34)',l:'Value destroyer'} };
var TRACK=[
  { id:'peterffy', n:'Thomas Peterffy', role:'Founder & Chairman', since:'1977', rate:'green',
    at:'Built IBKR from a market-making pioneer into a ~$6B-revenue, 77%-margin global broker — first to computerize and automate trading. Still the majority owner and macro voice; took the firm public (2007), through the 4-for-1 split, S&P 500 inclusion and >4M accounts.',
    before:'Revolutionized electronic market-making via <b>Timber Hill</b> (from 1977) — widely credited with bringing computers to the trading floor and automating options market-making.',
    detail:'<p><b>At IBKR.</b> The founder and architect of everything — bought an AMEX seat in 1977, built Timber Hill\'s automated market-making, founded Interactive Brokers in 1993, took it public in 2007, and grew it into a ~$6B-revenue broker with industry-leading ~77% pre-tax margins and ~4M+ accounts. Remains Chairman, largest shareholder (~75%+), and the firm\'s strategic and macro anchor.</p>'+
      '<p><b>Before / outside.</b> One of the true pioneers of electronic trading — credited with computerizing options market-making decades before it was standard.</p>'+
      '<p><b>The read — value creator (green).</b> A generational builder whose fingerprints are on the entire industry. The only caveat is concentration: the company is deeply tied to one person, and long-term succession beyond Galik is an open question.</p>' },
  { id:'galik', n:'Milan Galik', role:'President & CEO', since:'1990 · CEO 2019', rate:'green',
    at:'Oversaw the run from ~$250B to ~$789B client equity, record account growth, S&P 500 inclusion and relentless automation — a clean insider succession from the founder.',
    before:'Career built at IBKR since 1990; joined as a software developer and rose through engineering — his record <i>is</i> the IBKR operating record.',
    detail:'<p><b>At IBKR (CEO since 2019).</b> Joined in 1990 as a software developer and rose through engineering to the top job — a rare, clean founder-to-insider handoff. As CEO he presided over the client-equity run from ~$250B to ~$789B, record account adds (>1M in 2025), S&P 500 inclusion, and the continued automation that keeps headcount ~flat while accounts grow ~30%+.</p>'+
      '<p><b>Before / outside.</b> Essentially none outside IBKR — his career is the firm.</p>'+
      '<p><b>The read — value creator (green).</b> A proven operator executing the founder\'s playbook flawlessly; the only caveat is the lack of an independent, external benchmark for his record.</p>' },
  { id:'brody', n:'Paul Brody', role:'Chief Financial Officer', since:'Long-tenured', rate:'green',
    at:'Disciplined capital allocation: the fortress balance sheet (no debt), the dividend policy, the rate-sensitivity playbook, and the short-duration treasury strategy on segregated customer cash.',
    before:'Long-tenured finance leadership within the firm.',
    detail:'<p><b>At IBKR.</b> Long-serving CFO responsible for IBKR\'s conservative, cash-rich posture: no long-term debt, ~$6–7B excess capital, a &lt;30-day-duration treasury book on customer cash (which bounds rate risk), and the disclosed NII rate-sensitivity framework the Street relies on. Steered the dividend path and the 4-for-1 split.</p>'+
      '<p><b>Before / outside.</b> Long finance tenure within the firm.</p>'+
      '<p><b>The read — value creator (green).</b> The financial discipline is a genuine asset and a competitive signal to institutional clients; low-key and consistent.</p>' },
];
function trackBody(c){
  var legend=Object.keys(TRACK_RATE).map(function(k){ var r=TRACK_RATE[k]; return '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:var(--navy)"><span style="width:10px;height:10px;border-radius:50%;background:'+r.c+'"></span>'+r.l+'</span>'; }).join('');
  var cards=TRACK.map(function(m){ var r=TRACK_RATE[m.rate];
    return '<div class="trk-card ov-clickable" data-detail="exec:'+m.id+'" style="border:1px solid '+r.bd+';border-left:4px solid '+r.c+';background:'+r.bg+';border-radius:11px;padding:13px 15px;cursor:pointer;transition:.14s">'+
      '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><div style="font-size:13.5px;font-weight:800;color:var(--navy)">'+esc(m.n)+'</div><div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:'+r.c+'">'+r.l+'</div></div>'+
      '<div style="font-size:11px;color:var(--mu);font-weight:600;margin:1px 0 8px">'+esc(m.role)+' · at IBKR since '+esc(m.since)+'</div>'+
      '<div style="font-size:11.5px;color:var(--navy);line-height:1.5;margin-bottom:6px"><b style="color:'+r.c+'">At IBKR:</b> '+m.at+'</div>'+
      '<div style="font-size:11.5px;color:var(--navy);line-height:1.5"><b style="color:var(--mu)">Before / outside:</b> '+m.before+'</div>'+
      '<div class="ov-more" style="margin-top:7px">Full track record ›</div></div>';
  }).join('');
  var h='<p class="ov-lede">The people running IBKR today, rated on <b>what they have actually built</b> — an <b>IBKR</b> record and a <b>before/outside</b> record for each. Color = the net read; <b>tap a card</b> for the full history. (Management only — board and ownership are separate tabs.)</p>';
  h+='<div style="display:flex;gap:14px;flex-wrap:wrap;margin:0 0 12px">'+legend+'</div>';
  h+='<style>.trk-card:hover{box-shadow:0 4px 14px rgba(0,0,0,.08)}</style>';
  h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:11px">'+cards+'</div>';
  h+='<div class="ov-callout" style="margin-top:14px"><b>Board note:</b> operator/founder-controlled. <b>Rich Repetto</b> (a well-regarded former Piper Sandler broker analyst) is a strong independent addition (~2024). Verify against the latest proxy.</div>';
  h+='<div class="ov-foot">Roster verified against IBKR FY2023–Q1 2026 earnings calls. Ratings are an editorial read, not a Summit output.</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// ASSEMBLY — html / deepDiveHtml
// ═══════════════════════════════════════════════════════════════════════════════════════════════
function html(c){
  var h='<div class="ov ov-ibkr" data-brand="IBKR">';
  h+=stdOverviewBody(c);
  // Shared modal (Overview data-detail triggers + Deep Dive triggers once hoisted in init).
  h+='<div class="ov-modal-back" id="ibkrModalBack" hidden><div class="ov-modal" role="dialog" aria-modal="true">'+
    '<button class="ov-modal-x" id="ibkrModalX" aria-label="Close">×</button>'+
    '<div class="ov-modal-t" id="ibkrModalT"></div><div class="ov-modal-b" id="ibkrModalB"></div></div></div>';
  h+='</div>';
  return h;
}
function deepDiveHtml(c){
  var h='<div class="ov ov-ibkr ov-ibkr-dd" data-brand="IBKR">';
  h+='<div class="dd-tabs">'+
      '<button type="button" class="dd-tab active" data-dd="topline">Top Line</button>'+
      '<button type="button" class="dd-tab" data-dd="bottomline">Bottom Line</button>'+
      '<button type="button" class="dd-tab" data-dd="evolution">Evolution</button>'+
      '<button type="button" class="dd-tab" data-dd="valuation">Valuation</button>'+
      '<button type="button" class="dd-tab" data-dd="mgmt">Management</button>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="topline">'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="segments">Segments (the flywheel)</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="customers">Customers</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="tam">TAM</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="industry">Industry Analysis</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="segments">'+segmentsBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="customers" hidden>'+customersBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="tam" hidden>'+tamBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="industry" hidden>'+industryBody(c)+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="bottomline" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="unit">Unit Economics</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="rates">Rate Sensitivity</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="suppliers">Suppliers</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="margins">Margins</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="unit">'+unitEconBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="rates" hidden>'+rateSensBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="suppliers" hidden>'+suppliersBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="margins" hidden>'+marginsBody(c)+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="evolution" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="earnings">Earnings Calls</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="guidance">Guidance</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="strategy">Strategy</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="timeline">Timeline</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="earnings">'+callsBody()+'</div>'+
      '<div class="ovt-subpane" data-ovst="guidance" hidden>'+guidanceBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="strategy" hidden>'+strategyBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="timeline" hidden>'+timelineBody()+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="valuation" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="sensitivity">Sensitivity</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="peers">Peers</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="ratings">Analyst Ratings</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="capital">Capital Allocation</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="financials">Financials</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="sensitivity">'+sensBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="peers" hidden>'+peersBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="ratings" hidden><div id="dd-val-slot"></div></div>'+
      '<div class="ovt-subpane" data-ovst="capital" hidden>'+capallocBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="financials" hidden>'+financialsBody(c)+'</div>'+
    '</div>';
  h+='<div class="dd-pane" data-dd="mgmt" hidden>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="team">Executives & Board</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="ownership">Ownership (up-C)</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="governance">Governance</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="track">Track Record</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="team">'+IBKR_MGMT.body()+'</div>'+
      '<div class="ovt-subpane" data-ovst="ownership" hidden>'+ownershipBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="governance" hidden>'+govBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="track" hidden>'+trackBody(c)+'</div>'+
    '</div>';
  h+='</div>';
  return h;
}

// ═══ Charts ═════════════════════════════════════════════════════════════════════════════════════
var _charts={};
function destroy(id){ if(_charts[id]){ _charts[id].destroy(); _charts[id]=null; } }
function buildFinancials(){
  var cv=document.getElementById('ibkrChartRev'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('ibkrChartRev');
  var yrs=FIN_SERIES.years;
  _charts['ibkrChartRev']=new Chart(cv.getContext('2d'),{ type:'bar',
    data:{ labels:yrs, datasets:[
      { label:'Net interest income', data:FIN_SERIES.nii, backgroundColor:BRAND, stack:'s', maxBarThickness:48 },
      { label:'Commissions', data:FIN_SERIES.comm, backgroundColor:BLUE, stack:'s', maxBarThickness:48 }
    ]},
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{position:'bottom',labels:{boxWidth:10,font:{size:10.5}}}, tooltip:{ callbacks:{ label:function(ctx){ return ctx.dataset.label+': '+(ctx.parsed.y==null?'—':'$'+ctx.parsed.y.toFixed(1)+'B'); } } } },
      scales:{ x:{ stacked:true, grid:{display:false}, ticks:{font:{size:10.5}} }, y:{ stacked:true, ticks:{ callback:function(v){ return '$'+v+'B'; }, font:{size:9} }, grid:{color:'#EEF2F7'} } } }
  });
}
function buildEquity(){
  var cv=document.getElementById('ibkrChartEq'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('ibkrChartEq');
  _charts['ibkrChartEq']=new Chart(cv.getContext('2d'),{ type:'line',
    data:{ labels:FIN_SERIES.years, datasets:[{ label:'Client equity ($B)', data:FIN_SERIES.clientEq, borderColor:BRAND, backgroundColor:'rgba(214,0,28,0.10)', borderWidth:2.5, tension:.3, fill:true, pointRadius:3, spanGaps:true }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(ctx){ return ' $'+ctx.parsed.y+'B'; } } } },
      scales:{ x:{ grid:{display:false}, ticks:{font:{size:10.5}} }, y:{ ticks:{ callback:function(v){ return '$'+v+'B'; }, font:{size:9} }, grid:{color:'#EEF2F7'} } } }
  });
}

// ═══ Sub-tab + Deep Dive tab machinery (copied from the standardized contract) ═══════════════════
function buildSub(root, group, key){
  if(group==='bottomline'){
    if(key==='margins'){ buildFinancials(); buildEquity(); }
  } else if(group==='valuation'){
    if(key==='sensitivity') renderSens(root);
  } else if(group==='mgmt'){
    if(key==='team') IBKR_MGMT.init(root);
  }
}
function activeSubKey(root, group){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return null;
  var b=pane.querySelector('.ovt-subtab.active'); return b?b.getAttribute('data-ovst'):null;
}
function showSub(root, pane, group, key){
  pane.querySelectorAll('.ovt-subtab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-ovst')===key); });
  pane.querySelectorAll('.ovt-subpane').forEach(function(p){ p.hidden=(p.getAttribute('data-ovst')!==key); });
  requestAnimationFrame(function(){ buildSub(root, group, key); });
}
function wireSubtabs(root, group){
  var pane=root.querySelector('.dd-pane[data-dd="'+group+'"]'); if(!pane) return;
  pane.querySelectorAll('.ovt-subtab').forEach(function(btn){ btn.onclick=function(){ showSub(root, pane, group, btn.getAttribute('data-ovst')); }; });
}
function buildDD(root, key){ var s=activeSubKey(root,key); if(s) buildSub(root,key,s); }
function activeDD(root){ var b=root.querySelector('.dd-tab.active'); return b?b.getAttribute('data-dd'):'topline'; }
function showDD(root, key){
  root.querySelectorAll('.dd-tab').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-dd')===key); });
  root.querySelectorAll('.dd-pane').forEach(function(p){ p.hidden=(p.getAttribute('data-dd')!==key); });
  requestAnimationFrame(function(){ buildDD(root, key); });
}
function wireDD(root){ root.querySelectorAll('.dd-tab').forEach(function(btn){ btn.onclick=function(){ showDD(root, btn.getAttribute('data-dd')); }; }); }

// ═══ Modal + resolve ════════════════════════════════════════════════════════════════════════════
function wireModal(root){
  var back=root.querySelector('#ibkrModalBack'), mT=root.querySelector('#ibkrModalT'), mB=root.querySelector('#ibkrModalB'); if(!back) return;
  function onEsc(e){ if(e.key==='Escape') closeM(); }
  function openM(t,b){ mT.innerHTML=t; mB.innerHTML=b; back.hidden=false; requestAnimationFrame(function(){ back.classList.add('on'); }); document.addEventListener('keydown', onEsc); }
  function closeM(){ back.classList.remove('on'); document.removeEventListener('keydown', onEsc); setTimeout(function(){ back.hidden=true; }, 180); }
  root.querySelector('#ibkrModalX').onclick=closeM; back.onclick=function(e){ if(e.target===back) closeM(); };
  var UPC={
    public:{t:'IBKR Group Inc — the public company', h:'<p>The publicly-traded holding company. Its Class A stock is what trades on NASDAQ. Crucially, IBKR Group Inc owns only <b>~25–30% of the operating company (IBG LLC)</b> — so the "market cap" you see on a quote screen reflects <b>only this slice</b> (the public float), not the whole enterprise.</p><p>It consolidates 100% of IBG LLC for accounting, with the ~70–75% it does not own shown as a large <b>non-controlling interest</b>.</p>'},
    holdings:{t:'IBG Holdings — Peterffy & insiders', h:'<p>The private vehicle through which <b>Thomas Peterffy</b> and insiders/employees hold their units of IBG LLC — roughly <b>70–75%</b>. Peterffy alone is <b>~75%+</b> economic. Over time these units can convert into public shares, gradually shifting the split.</p><p>This is why IBKR is <b>founder-controlled</b>: the founder\'s economics and votes sit largely outside the public float.</p>'},
    opco:{t:'IBG LLC — the operating company', h:'<p>The actual business — the broker that earns ~$6B of revenue at ~77% pre-tax margins. Both IBKR Group Inc (~25–30%) and IBG Holdings (~70–75%) own units of it.</p><p><b>Why it matters:</b> (1) quoted market cap = only the public slice; (2) EPS is reported "<b>comprehensive diluted</b>" — as-if all IBG units converted — so it already reflects the full economic base; (3) the income-tax note splits <b>public company vs operating company</b> because IBG LLC is largely a pass-through and only IBKR Group Inc\'s slice bears full corporate tax.</p>'},
  };
  var ARENA={
    auto:{t:'Automation / cost — IBKR leads', h:'The entire moat. IBKR is the <b>lowest-cost, most-automated</b> broker, which produces ~77% pre-tax margins no rival approaches. Automation lets it undercut on price while still out-earning everyone on margin — and headcount stays ~flat as accounts grow ~30%+.'},
    global:{t:'Global market access — IBKR leads', h:'~150 markets across ~35 countries and ~28 currencies from a single account. No US discount broker (Schwab, Fidelity) offers this breadth — it is a genuine structural advantage for globally-minded and institutional traders.'},
    retail:{t:'US retail trading — contested', h:'<b>Robinhood</b> owns the mass-market, mobile-first US retail wedge with a slicker consumer app. IBKR wins the <b>sophisticated / active</b> trader who values breadth, tools and cost — a different customer. The two overlap at the edges but target different users.'},
    prime:{t:'Prime brokerage — challenger', h:'IBKR is now the <b>#4 prime broker (Preqin)</b>, behind only Goldman Sachs, Morgan Stanley and JPMorgan. Its lever is a <b>fortress balance sheet</b> (no debt, huge excess capital) — a trust signal that matters to fund clients — plus far lower cost via High-Touch Prime.'},
    crypto:{t:'Crypto & new markets — emerging', h:'IBKR is broadening the box: crypto (11+ coins via Zero Hash, plus derivatives), 24/5 overnight trading, and CFTC-regulated <b>forecast/prediction contracts</b> (ForecastEx). It competes with <b>Coinbase</b> at the edges but treats these as option value on top of the core broker, not a bet-the-firm pivot.'},
  };
  function resolve(key){
    var p=key.split(':'), kind=p[0], id=p.slice(1).join(':');
    if(kind==='hist'){ var t=TIMELINE[+id]; return t&&t.d?{t:t.y,h:t.d}:null; }
    if(kind==='prod'){ var f=IBKR_PRODUCTS[+id]; if(!f) return null;
      var body=f.items.map(function(it){ return '<div style="margin:0 0 10px"><div style="font-size:12.5px;font-weight:800;color:var(--navy)">'+esc(it[0])+'</div><div class="famd">'+it[1]+'</div></div>'; }).join('');
      return {t:f.ic+' '+esc(f.fam),h:'<div class="famd" style="margin-bottom:10px;color:var(--mu)">'+esc(f.d)+'</div>'+body}; }
    if(kind==='seg'){ var s=CLIENT_SEGMENTS.filter(function(x){return x.id===id;})[0]; return s?{t:s.ic+' '+esc(s.n),h:s.detail}:null; }
    if(kind==='arena'){ var ar=ARENA[id]; return ar?{t:ar.t,h:ar.h}:null; }
    if(kind==='upc'){ var u=UPC[id]; return u?{t:u.t,h:u.h}:null; }
    if(kind==='exec'){ var ex=TRACK.filter(function(x){return x.id===id;})[0]; return ex?{t:esc(ex.n)+' <span class="ov-modal-sub">'+esc(ex.role)+' · at IBKR since '+esc(ex.since)+'</span>',h:ex.detail}:null; }
    return null;
  }
  root.querySelectorAll('[data-detail]').forEach(function(el){ el.style.cursor='pointer';
    el.onclick=function(){ var d=resolve(el.getAttribute('data-detail')); if(d) openM(d.t,d.h); }; });
}

// ═══ Live price (get-quote edge fn) + market cap (liveQuote via Massive) ═════════════════════════
function fetchQuote(ticker){
  var env=(typeof window!=='undefined')&&window.ENV;
  if(!env||!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY) return Promise.reject(new Error('no-env'));
  var base=String(env.SUPABASE_URL).replace(/\/+$/,'');
  return fetch(base+'/functions/v1/get-quote?ticker='+ticker,{ headers:{ apikey:env.SUPABASE_ANON_KEY, Authorization:'Bearer '+env.SUPABASE_ANON_KEY } })
    .then(function(r){ if(!r.ok) throw new Error('http '+r.status); return r.json(); })
    .then(function(j){ if(j&&typeof j.price==='number') return j; throw new Error('bad payload'); });
}
function renderLive(root){
  var el=root.querySelector('#ibkrLive'); if(!el) return;
  el.hidden=false; el.innerHTML='<span class="ov-live-ts">fetching live price…</span>';
  fetchQuote('IBKR').then(function(q){
    var p=q.changePct, up=(p==null||p>=0);
    var t=q.time?new Date(q.time*1000):null, hhmm=t?(('0'+t.getHours()).slice(-2)+':'+('0'+t.getMinutes()).slice(-2)):'';
    var st=(q.marketState&&q.marketState!=='REGULAR')?(' · '+String(q.marketState).toLowerCase()):'';
    el.innerHTML='<span class="ov-live-dot"></span><span class="ov-live-tk">IBKR</span><span class="ov-live-px">$'+q.price.toFixed(2)+'</span>'+
      (p!=null?'<span class="ov-live-ch '+(up?'up':'down')+'">'+(up?'▲ +':'▼ −')+Math.abs(p).toFixed(2)+'%</span>':'')+
      '<span class="ov-live-ts">live · '+esc(q.exchange||'NASDAQ')+(hhmm?(' · '+hhmm):'')+st+'</span>';
    // feed the sensitivity live price
    SENS.price=q.price;
    var px=root.querySelector('#ibkrSensPx'), ts=root.querySelector('#ibkrSensTs');
    if(px) px.textContent='$'+q.price.toFixed(2); if(ts) ts.textContent='live';
    renderSens(root);
  }).catch(function(){ el.hidden=true; el.innerHTML=''; });
}

// ═══ init / deepDiveInit ════════════════════════════════════════════════════════════════════════
function init(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  renderLive(root);
  wireDD(root);
  wireSubtabs(root,'topline'); wireSubtabs(root,'bottomline'); wireSubtabs(root,'evolution'); wireSubtabs(root,'valuation'); wireSubtabs(root,'mgmt');
  wireModal(root);
  // Collapsible sections
  root.querySelectorAll('.ov-collap-h').forEach(function(btn){ btn.onclick=function(){ var cc=btn.parentElement; var open=cc.classList.toggle('open'); var b=cc.querySelector('.ov-collap-b'); if(b) b.hidden=!open; var ic=btn.querySelector('.ov-collap-ic'); if(ic) ic.textContent=open?'▾':'▸'; }; });
  // Segment "What is X?" + numbers accordions (money map)
  root.querySelectorAll('.acc-h').forEach(function(btn){ btn.onclick=function(){ var b=btn.nextElementSibling; if(!b) return; var open=b.hidden; b.hidden=!open; var x=btn.querySelector('.acc-x'); if(x) x.textContent=open?'–':'+'; }; });
  // Earnings calls accordion + lens toggle
  root.querySelectorAll('.lpb-acc-h').forEach(function(btn){ btn.onclick=function(){ var item=btn.parentElement; var open=item.classList.toggle('open'); var ic=btn.querySelector('.lpb-acc-ic'); if(ic) ic.textContent=open?'–':'+'; }; });
  root.querySelectorAll('.calls-pill').forEach(function(btn){ btn.onclick=function(){
    var v=btn.getAttribute('data-callsv');
    root.querySelectorAll('.calls-pill').forEach(function(b){ b.classList.toggle('active', b===btn); });
    var t=root.querySelector('#ibkrCallsTheme'), q=root.querySelector('#ibkrCallsQuarter');
    if(t) t.style.display=(v==='theme')?'':'none';
    if(q) q.style.display=(v==='quarter')?'':'none';
  }; });
  // Sensitivity sliders
  var epsIn=root.querySelector('#ibkrEps'), peIn=root.querySelector('#ibkrPe');
  if(epsIn) epsIn.oninput=function(){ SENS.eps=parseFloat(epsIn.value); renderSens(root); };
  if(peIn) peIn.oninput=function(){ SENS.pe=parseFloat(peIn.value); renderSens(root); };
  renderSens(root);
  // ── Peer scatter: render + delegated pointer events on the STABLE #ibkrScNodes container ──
  ibkrScReset(); ibkrScRender(root); ibkrScChips(root);
  var sctip=root.querySelector('#ibkrScTip');
  function wireScNodes(){
    var g=root.querySelector('#ibkrScNodes'); if(!g||!sctip||g._scWired) return; g._scWired=true;
    function show(node){ sctip.innerHTML='<div class="mgt-h"><img src="'+node.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+node.getAttribute('data-name')+'</span></div>'+node.getAttribute('data-why'); sctip.hidden=false; }
    function move(e){ sctip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; sctip.style.top=(e.clientY+16)+'px'; }
    g.addEventListener('pointerover', function(e){ var node=e.target.closest?e.target.closest('.mg-node'):null; if(!node) return; node.parentNode.appendChild(node); show(node); move(e); });
    g.addEventListener('pointermove', function(e){ var node=e.target.closest?e.target.closest('.mg-node'):null; if(node) move(e); });
    g.addEventListener('pointerout', function(e){ var node=e.target.closest?e.target.closest('.mg-node'):null; if(!node) return; if(e.relatedTarget && node.contains(e.relatedTarget)) return; sctip.hidden=true; });
    g.addEventListener('click', function(e){ var node=e.target.closest?e.target.closest('.mg-node'):null; if(!node) return; show(node); move(e); });
  }
  function scRefresh(){ ibkrScRender(root); } // container is stable → delegated listener persists
  wireScNodes();
  root.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){
    IBKR_SC.basis=btn.getAttribute('data-mgbasis');
    root.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b===btn); });
    scRefresh();
  }; });
  function wireChips(){
    root.querySelectorAll('#ibkrScChips .ibsc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(IBKR_SC.peers[i]){ IBKR_SC.peers.splice(i,1); ibkrScChips(root); wireChips(); scRefresh(); } }; });
    var addBtn=root.querySelector('#ibkrScAddBtn'), addIn=root.querySelector('#ibkrScAddTk');
    if(addBtn&&addIn){ addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
      if(!IBKR_SC.peers.some(function(p){ return p.tk===tk; })){
        var seed=IBKR_PEERS.filter(function(p){ return p.tk===tk; })[0];
        if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; IBKR_SC.peers.push(o); }
        else IBKR_SC.peers.push({ tk:tk, n:tk, on:true, mc:10, peT:null,peF:null,gt:null,gf:null, why:'Added by ticker — live market cap only; no P/E on file, so it plots once one is available.' });
      }
      addIn.value=''; ibkrScChips(root); wireChips(); scRefresh(); ibkrLiveOne(tk); }; }
  }
  wireChips();
  // Live market cap (Key Facts cell + peer bubbles) — Massive via api.liveQuote; degrades gracefully in preview
  function ibkrLiveOne(tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res; if(!q||q.marketCap==null) return; var mcB=q.marketCap/1e9; IBKR_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=mcB; }); if(tk==='IBKR'){ var el=root.querySelector('#ibkrMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live (public float)'; } scRefresh(); }).catch(function(){}); }
  IBKR_SC.peers.forEach(function(p){ if(p.tk) ibkrLiveOne(p.tk); });
  ibkrScRender(root);
  // Hoist the modal to #co-detailview so it stays visible from either profile tab
  var detail=document.getElementById('co-detailview');
  if(detail){
    detail.querySelectorAll(':scope > .ov-modal-back').forEach(function(m){ if(m.id!=='ibkrModalBack') m.remove(); });
    var md=root.querySelector('#ibkrModalBack'); if(md && md.parentNode!==detail) detail.appendChild(md);
  }
}
function deepDiveInit(c){
  var root=document.getElementById('co-detailview'); if(!root) return;
  var d=activeDD(root); requestAnimationFrame(function(){ buildDD(root, d); });
}
export var ibkrOverview = { html: html, init: init, absorbsPillars: true, deepDive: { html: deepDiveHtml, init: deepDiveInit } };
