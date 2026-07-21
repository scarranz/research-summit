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
// Verified against IBKR's 2026 proxy (DEF 14A, filed 2026-03-11) and FY2025 10-K, Part III:
// FIVE named executive officers (Peterffy, Nemser, Galik, Brody, Frank) and a TEN-member board.
// Corrections vs. earlier draft: Thomas Frank is EVP but no longer CIO (stepped down Apr 2024);
// Nancy Stuebe (Director of IR) is NOT a Section 16 officer, so she is excluded from the exec grid.
var IBKR_MGMT = makeManagement({
  brand:BRAND,
  lede:"Interactive Brokers is a <b>founder-controlled</b> company run by a deep, long-tenured insider bench. <b>Thomas Peterffy</b> — the market-making pioneer who built it — is Chairman and controls <b>~73.7% of the vote</b> (via Class B). Day-to-day sits with CEO <b>Milan Galik</b>, CFO <b>Paul Brody</b> and Vice Chairman <b>Earl Nemser</b> — several with 30+ years at the firm. The whole company is engineered around one idea: <b>automate everything, minimize what we charge</b>.",
  execs:[
    { id:'peterffy', lead:true, name:'Thomas Peterffy', title:'Founder & Chairman', since:'Founder · Chairman since 2006 · CEO until 2019',
      line:"Market-making pioneer; controls ~73.7% of the vote. Ran the firm as CEO until 2019.",
      bio:"Founder and Chairman (age 81); controls ~73.7% of IBKR's voting power via Class B stock. A Hungarian-born programmer who bought an AMEX seat in 1977 and pioneered computerized market-making (Timber Hill) — widely credited with automating options trading. Founded Interactive Brokers in 1993, took it public in 2007, and served as CEO until stepping up to Chairman in 2019. His salary is capped at 0.2% of IBG LLC net income ($591,500 in 2025) — no bonus, no equity. Still the firm's macro voice and strategic anchor." },
    { id:'galik', name:'Milan Galik', title:'Chief Executive Officer & President', since:'CEO since 2019 · at IBKR since 1990',
      line:"Clean insider succession from the founder; joined in 1990 as a software developer.",
      bio:"CEO since October 2019 and President since 2014 (age 59). Joined the firm in 1990 as a software developer and rose through engineering into the top job — a rare, clean founder-to-insider succession. MS in electrical engineering, Technical University of Budapest. Highest-paid named officer ($19.7M total in 2025). Oversaw the run from ~$250B to ~$789B client equity, record account growth, S&P 500 inclusion, and relentless automation of the brokerage stack." },
    { id:'brody', name:'Paul J. Brody', title:'CFO, Treasurer & Secretary', since:'at IBKR since 1987',
      line:"Disciplined capital allocation; fortress balance sheet, no debt, the rate-sensitivity playbook.",
      bio:"CFO, Treasurer & Secretary since 2006; joined the firm in 1987 (age 65). BA economics, Cornell; former director of The Options Clearing Corporation (2005–2012). Architect of IBKR's conservative, cash-rich posture: no long-term debt, ~$6–7B of excess regulatory capital, a short-duration (<30-day) treasury strategy on segregated customer cash, and the disclosed net-interest-income rate-sensitivity framework the Street watches each quarter." },
    { id:'nemser', name:'Earl H. Nemser', title:'Vice Chairman', since:'at IBG LLC since 1988',
      line:"Longtime legal counsel & Vice Chairman; chairs IBKR's UK entity.",
      bio:"Vice Chairman (age 79); with IBG LLC since 1988. A longtime lawyer (Special Counsel / Independent Advisor to Dechert LLP, 2005–2018; JD magna cum laude, Boston University) who serves as the firm's senior legal counsel, heads IBG LLC's Internal Audit Committee, sits on the Steering Committee, and since 2023 chairs Interactive Brokers (U.K.) Limited. Also chairs the board's Nominating & Corporate Governance committee." },
    { id:'frank', name:'Dr. Thomas A. Frank', title:'Executive Vice President', since:'at IBKR since 1985',
      line:"Long-tenured EVP; PhD physicist; sits on the OCC board. (CIO until Apr 2024.)",
      bio:"Executive Vice President of Interactive Brokers LLC (age 70). PhD in physics, MIT (1985); with the firm since 1985 and EVP since 1999. Served as Chief Information Officer from 1999 until stepping down from that role in April 2024 (he remains EVP). Director of The Options Clearing Corporation since 2015 — part of IBKR's deep engineering-led leadership." },
  ],
  board:[
    { name:'Thomas Peterffy', chair:true, independent:false, role:'Chairman · controls ~73.7% of the vote (Class B) · Compensation (Chair), Nominating/Gov · director since 2006.' },
    { name:'Earl H. Nemser', independent:false, role:'Vice Chairman · Nominating/Gov (Chair), Compensation · senior legal counsel · since 2006.' },
    { name:'Milan Galik', dual:true, independent:false, role:'CEO & President · Compensation committee · since 2006.' },
    { name:'Paul J. Brody', dual:true, independent:false, role:'CFO, Treasurer & Secretary · since 2006.' },
    { name:'Dr. Lawrence E. Harris', independent:true, role:'Lead Independent Director · Audit (Chair) · USC finance professor, former SEC Chief Economist · since 2007.' },
    { name:'William Peterffy', independent:false, role:'Director · son of Thomas Peterffy · ESG/sustainability focus · since 2020.' },
    { name:'Nicole Yuen', independent:true, role:'Director · Audit + Nominating/Gov · ex-Credit Suisse Vice Chairman, Greater China · since 2020.' },
    { name:'Jill Bright', independent:true, role:'Director · 30+ years HR/administration (Condé Nast, LionTree, Crestview) · since 2022.' },
    { name:'Richard Repetto', independent:true, role:'Director · Audit · ex-Piper Sandler fintech/e-broker research analyst · since 2024.' },
    { name:'Lori Conkling', independent:true, role:'Director (newest) · Netflix TV/film licensing; ex-YouTube/Google · since 2025.' },
  ],
  boardNote:'10 directors, 5 independent. As a Nasdaq "controlled company" (Peterffy holds majority voting power), the board is not required to be majority-independent. Committee chairs: Audit — Harris; Compensation — Peterffy; Nominating/Gov — Nemser.',
  gov:[
    { k:'Control', v:'Founder-controlled', d:'Peterffy ~73.7% of the vote via Class B — see Ownership (up-C).' },
    { k:'Public economics', v:'26.3%', d:'IBKR Group Inc (public co) owns 26.3% of the operating co IBG LLC; IBG Holdings 73.7%.' },
    { k:'Board', v:'10 directors · 5 indep.', d:'Lead Independent Director: Lawrence Harris.' },
    { k:'Balance sheet', v:'No long-term debt', d:'~$6–7B excess capital · fortress by design.' },
  ],
  foot:"Roster, titles and committees verified against IBKR's 2026 proxy statement (DEF 14A, filed 2026-03-11) and FY2025 Form 10-K, Part III. Ownership economics and insider activity live in the Ownership subtab and the Pillars → Management tab.",
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
// (up-C — the public co owns only 26.3% of the operating company).
var STD_FACTS=[
  ['Listing','NASDAQ: IBKR'],
  ['HQ','Greenwich, CT, USA'],
  ['Founded','1977 (Peterffy) · IPO 2007'],
  ['Chairman','Thomas Peterffy'],
  ['CEO','Milan Galik · since 2019'],
  ['Employees','~3,182'],
  ['Client accounts','~4.4M (>1M added in 2025)'],
  ['Client equity','$789B · Q1 2026 (+38% YoY)'],
  ['Pre-tax margin','~77% (industry-leading)'],
  ['Market cap','live · public float only'],
];
var STD_MC_NOTE='public float only';

var UB_LEDE='Interactive Brokers is the largest fully-automated global electronic broker. It gives sophisticated and active individual and institutional traders low-cost access to 150+ markets in 40 countries and 29 currencies — stocks, options, futures, bonds, FX, funds, crypto and prediction/forecast contracts — from a single account. The operating philosophy is simple and relentless: automate everything, minimize what we charge, and keep industry-leading margins.';

// 2x2 quadrant (each cell ≤ ~30 words)
var STD_BIZ=[
  ['What it sells','Ultra-low-cost, direct global market access — stocks, options, futures, bonds, FX, funds, crypto and forecast contracts — across 150+ markets from one automated account.'],
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

// Products / asset classes — clickable family cards → pop-ups (key = prod:i). This is "what IBKR
// really does" beyond plain brokerage. Specifics verified vs IBKR IR / FY2025 10-K (mid-2026).
var IBKR_PRODUCTS=[
  { ic:'📈', fam:'Stocks & ETFs', d:'Global equities, one account.', items:[
    ['Global stocks & ETFs','Direct access to <b>150+ markets</b> in 40 countries and 29 currencies — from a single account.'],
    ['Overnight trading (24/5)','<b>10,000+ US stocks & ETFs</b> tradable in an overnight session (~8pm–4am ET) — overnight volume up <b>&gt;130% YoY</b>. Rivals offer ~1,000.'],
    ['Fractional shares','Trade high-priced US names in fractional size.'] ]},
  { ic:'🧮', fam:'Options, Futures & derivatives', d:'Deep derivatives, incl. 0DTE.', items:[
    ['Options','US & global equity/index options, including same-day-expiry <b>0DTE</b> on SPX/SPY/QQQ.'],
    ['Futures & futures options','Equity-index, energy, ag, rates & metals across CME, Eurex, ICE, Euronext and more.'],
    ['Crypto derivatives','<b>Coinbase Derivatives</b> nano BTC/ETH futures — monthly or perpetual-style, 24/7 (announced Feb 2026).'] ]},
  { ic:'🏦', fam:'Bonds & FX', d:'Fixed income and currencies.', items:[
    ['Bonds (24/5)','<b>Over 1 million bonds</b> with no mark-ups; US Treasuries, EGBs & Gilts tradable ~22 hrs/day, 5 days/week.'],
    ['FX / AutoFX','Interbank spot FX at commissions from <b>~0.2 bps</b>; auto currency conversion adds only <b>~0.03%</b> — a fraction of a bank\'s spread.'] ]},
  { ic:'💰', fam:'Funds & tax-advantaged accounts', d:'Mutual funds and wrappers.', items:[
    ['Mutual funds','Thousands of funds from a single platform.'],
    ['Tax-advantaged wrappers','UK <b>ISA</b> (£20k allowance), Japan <b>NISA</b>, Sweden <b>ISK</b> (2025) and more, market by market.'] ]},
  { ic:'🪙', fam:'Crypto (spot)', d:'Coins via Zero Hash / Paxos.', items:[
    ['Spot crypto','<b>11 coins</b> (BTC, ETH, SOL, XRP, DOGE, ADA, AVAX, SUI…) via Zero Hash/Paxos at <b>0.12–0.18%</b>, no spread or custody fee. IBKR holds a stake in Zero Hash.'],
    ['EEA access','Spot crypto rolled out across the EEA (2025).'] ]},
  { ic:'🗳️', fam:'ForecastEx / forecast contracts', d:"Peterffy's long-term bet.", items:[
    ['Prediction / forecast contracts','CFTC-regulated binary Yes/No contracts on economic, climate and election outcomes — <b>$0.01/contract</b>.'],
    ['ForecastEx','IBKR-owned exchange <i>and</i> clearinghouse; volume hit <b>286M contract pairs</b> in Q4 2025 (from 15M); Election Board for the midterms.'] ]},
  { ic:'💵', fam:'Cash, margin & lending', d:'The balance-sheet products.', items:[
    ['Interest on cash','IBKR pays <b>Fed funds − 0.5%</b> on qualified USD cash (full rate at NAV ≥ $100k) — most brokers pay ~zero.'],
    ['Margin loans','Among the industry\'s cheapest, tiered over a benchmark; average customer margin loans <b>~$89B</b> (Q1 2026).'],
    ['Securities lending (SYEP)','Lend your fully-paid shares; IBKR on-lends to short-sellers and splits the fee <b>50/50</b> with you.'],
    ['Debit Mastercard','Spend or borrow against the account with an integrated IBKR Debit Mastercard + Bill Pay (US).'] ]},
  { ic:'🤝', fam:'How clients access it', d:'Pricing tiers & institutional.', items:[
    ['IBKR Pro vs Lite','<b>Lite</b>: commission-free US stock/ETF trades (uses PFOF). <b>Pro</b>: tiered/fixed commissions, no PFOF (best-execution SmartRouting), lower margin, better cash interest.'],
    ['Prime brokerage','<b>High-Touch Prime</b> for hedge funds + a global outsourced-trading desk (a trader available 24 hrs/day). Preqin <b>#4 prime broker</b>.'],
    ['Introducing brokers','White-label execution & custody for banks/brokers — e.g. <b>HSBC WorldTrader</b> (25 markets, 77 exchanges).'],
    ['RIA custody','Custody + trading for advisors with no custody/ticket/minimum fees; ~<b>3,600 advisors</b>, assets +32% YoY.'] ]},
  { ic:'💻', fam:'Platforms & AI', d:'Pro tools + AI helpers.', items:[
    ['Platforms','<b>Trader Workstation</b> (flagship), IBKR Desktop, GlobalTrader (mobile), Client Portal, and open <b>REST/FIX APIs</b>.'],
    ['AI tools','<b>Ask IBKR</b> (natural-language portfolio insights, Oct 2025), IBot, Investment Themes and AI news summaries (FINRA-approved).'] ]},
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
// Shared working-set state. The scatter renders in TWO places (Overview collapsible + Deep Dive ▸
// Industry Analysis), so every instance is class-scoped inside a `.ibkr-sc` wrapper — never a bare
// id — and all instances re-render off this one shared state so they stay in sync.
var IBKR_SC={ basis:'f', peers:null, _capsFetched:false };
function ibkrScReset(){ if(!IBKR_SC.peers) IBKR_SC.peers=IBKR_PEERS.map(function(p){ var o={}; for(var k in p) o[k]=p[k]; o.on=true; return o; }); }
function ibkrScMult(p){ return IBKR_SC.basis==='f'?p.peF:p.peT; }
function scLogoUrl(p){ return p.logo || ('https://assets.parqet.com/logos/symbol/'+p.tk); }

function stdPeerScatter(sfx){
  sfx=sfx||'ov';
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
  h+='<div class="ibkr-sc" data-sfx="'+sfx+'">';
  h+='<div class="ov-diagram-cap" style="margin:0 0 6px">Listed broker/fintech peers mapped by <b>forward P/E</b> (x) and <b>revenue/earnings growth</b> (y). <b>Bubble size = live market cap in USD.</b> Financials are valued on <b>P/E, not EV/EBITDA</b>. <span style="opacity:.75">Hover or tap a bubble for the read.</span></div>';
  h+='<div class="mg-tog-row"><span class="mg-tog">Basis: <span class="mg-seg"><button type="button" class="mg-pill active" data-mgbasis="f">Forward</button><button type="button" class="mg-pill" data-mgbasis="t">Trailing</button></span></span></div>';
  h+='<div class="ov-diagram"><svg viewBox="0 0 640 300" class="ibkr-sc-svg" role="img" aria-label="Peer P/E vs growth map">'+
    '<line x1="80" y1="252" x2="612" y2="252" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<line x1="80" y1="252" x2="80" y2="44" stroke="#C7CED6" stroke-width="1.5"/>'+
    '<text x="88" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0">← cheaper (lower P/E)</text>'+
    '<text x="610" y="270" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">more expensive →</text>'+
    '<text x="346" y="288" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#6b7684" text-anchor="middle" class="ibkr-sc-xlab">P/E · forward</text>'+
    '<text x="74" y="250" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">slow</text>'+
    '<text x="74" y="52" font-family="Inter,sans-serif" font-size="10" fill="#8A93A0" text-anchor="end">fast growth</text>'+
    '<g class="ibkr-sc-nodes"></g>'+
  '</svg></div>';
  h+='<div class="ibsc-chips ibkr-sc-chips"></div>';
  h+='<div class="ov-diagram-cap" style="margin-top:4px">Remove a peer with the <b>×</b> on its chip, or add one by ticker. Only <b>listed</b> peers with a public P/E plot here. <span class="ave-subh-note">Multiples & growth are web-sourced (mid-2026); market caps are live. <b>Financials are valued on P/E, not EV/EBITDA.</b></span></div>';
  h+='<div class="mg-tip ibkr-sc-tip" hidden></div>';
  h+='</div>';
  return h;
}
// Draw the working set into one instance's .ibkr-sc-nodes. Each node carries a logo <image>.
function ibkrScRenderOne(wrap){
  var g=wrap.querySelector('.ibkr-sc-nodes'); if(!g||!IBKR_SC.peers) return;
  var maxMult=60, X0=80, X1=612, Y0=252, Y1=44;
  var lab=wrap.querySelector('.ibkr-sc-xlab'); if(lab) lab.textContent='P/E · '+(IBKR_SC.basis==='f'?'forward':'trailing');
  wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-mgbasis')===IBKR_SC.basis); });
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
function ibkrScChipsOne(wrap){
  var box=wrap.querySelector('.ibkr-sc-chips'); if(!box||!IBKR_SC.peers) return;
  var h=IBKR_SC.peers.map(function(p,i){ return '<span class="ibsc-chip" data-sci="'+i+'" title="Remove '+esc(p.n)+'">'+esc(p.n)+' <span class="x">×</span></span>'; }).join('');
  h+='<span class="ibsc-add"><input class="ibkr-sc-addtk" placeholder="+ TICKER" maxlength="6"><button type="button" class="ibkr-sc-addbtn">Add</button></span>';
  box.innerHTML=h;
}
// Render + (re)wire EVERY scatter instance present under root, off the shared working set.
function ibkrScRenderAll(root){ root.querySelectorAll('.ibkr-sc').forEach(ibkrScRenderOne); }
function ibkrScChipsAll(root){ root.querySelectorAll('.ibkr-sc').forEach(function(w){ ibkrScChipsOne(w); wireScChips(root, w); }); }
function wireScatters(root){
  ibkrScReset();
  root.querySelectorAll('.ibkr-sc').forEach(function(wrap){
    if(wrap._scWired) return; wrap._scWired=true;
    var g=wrap.querySelector('.ibkr-sc-nodes'), tip=wrap.querySelector('.ibkr-sc-tip');
    // basis toggle (per instance, drives shared state → re-render all)
    wrap.querySelectorAll('.mg-pill[data-mgbasis]').forEach(function(btn){ btn.onclick=function(){ IBKR_SC.basis=btn.getAttribute('data-mgbasis'); ibkrScRenderAll(root); }; });
    // node tooltips (delegated on the stable nodes container)
    if(g&&tip){
      function show(node){ tip.innerHTML='<div class="mgt-h"><img src="'+node.getAttribute('data-logo')+'" alt="" onerror="this.style.display=\'none\'"><span class="mgt-n">'+node.getAttribute('data-name')+'</span></div>'+node.getAttribute('data-why'); tip.hidden=false; }
      function move(e){ tip.style.left=Math.min(e.clientX+16, window.innerWidth-270)+'px'; tip.style.top=(e.clientY+16)+'px'; }
      g.addEventListener('pointerover', function(e){ var n=e.target.closest?e.target.closest('.mg-node'):null; if(!n) return; n.parentNode.appendChild(n); show(n); move(e); });
      g.addEventListener('pointermove', function(e){ var n=e.target.closest?e.target.closest('.mg-node'):null; if(n) move(e); });
      g.addEventListener('pointerout', function(e){ var n=e.target.closest?e.target.closest('.mg-node'):null; if(!n) return; if(e.relatedTarget&&n.contains(e.relatedTarget)) return; tip.hidden=true; });
      g.addEventListener('click', function(e){ var n=e.target.closest?e.target.closest('.mg-node'):null; if(!n) return; show(n); move(e); });
    }
  });
  ibkrScRenderAll(root); ibkrScChipsAll(root); ibkrScFetchCaps(root);
}
// Chip remove / add-by-ticker for one instance (re-bound each time chips re-render).
function wireScChips(root, wrap){
  wrap.querySelectorAll('.ibkr-sc-chips .ibsc-chip[data-sci]').forEach(function(ch){ ch.onclick=function(){ var i=+ch.getAttribute('data-sci'); if(IBKR_SC.peers[i]){ IBKR_SC.peers.splice(i,1); ibkrScRenderAll(root); ibkrScChipsAll(root); } }; });
  var addBtn=wrap.querySelector('.ibkr-sc-addbtn'), addIn=wrap.querySelector('.ibkr-sc-addtk');
  if(addBtn&&addIn){ addBtn.onclick=function(){ var tk=(addIn.value||'').trim().toUpperCase(); if(!tk) return;
    if(!IBKR_SC.peers.some(function(p){ return p.tk===tk; })){
      var seed=IBKR_PEERS.filter(function(p){ return p.tk===tk; })[0];
      if(seed){ var o={}; for(var k in seed) o[k]=seed[k]; o.on=true; IBKR_SC.peers.push(o); }
      else IBKR_SC.peers.push({ tk:tk, n:tk, on:true, mc:10, peT:null,peF:null,gt:null,gf:null, why:'Added by ticker — live market cap only; no P/E on file, so it plots once one is available.' });
    }
    addIn.value=''; ibkrScRenderAll(root); ibkrScChipsAll(root); ibkrLiveOne(root, tk); }; }
}
// Live market cap (Key Facts cell + peer bubbles) via Massive (api.liveQuote). Degrades in preview.
function ibkrLiveOne(root, tk){ import('../api.js').then(function(m){ if(!m||!m.liveQuote) return null; return m.liveQuote(tk); }).then(function(res){ var q=res&&res.data?res.data:res; if(!q||q.marketCap==null) return; var mcB=q.marketCap/1e9; IBKR_SC.peers.forEach(function(p){ if(p.tk===tk) p.mc=mcB; }); if(tk==='IBKR'){ var el=root.querySelector('#ibkrMc'); if(el) el.textContent='$'+(mcB>=1000?(mcB/1000).toFixed(2)+'T':Math.round(mcB)+'B')+' · live (public float)'; } ibkrScRenderAll(root); }).catch(function(){}); }
function ibkrScFetchCaps(root){ if(IBKR_SC._capsFetched||!IBKR_SC.peers) return; IBKR_SC._capsFetched=true; IBKR_SC.peers.forEach(function(p){ if(p.tk) ibkrLiveOne(root, p.tk); }); }

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
  return '<div class="ov-diagram-cap" style="margin:0 0 8px">One account, 150+ markets. <b>Tap any asset class</b> for the specific products.</div>'+
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
  h+=collapsible('Competitors — P/E vs growth (financials are valued on P/E, not EV/EBITDA)', stdPeerScatter('ov'));
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
      '<div class="flw-node"><div class="flw-k">Accounts</div><div class="flw-v">~4.4M</div><div class="flw-d">>1M net-new in 2025 (record). Organic, no incentives.</div></div>'+
      '<div class="flw-node"><div class="flw-k">Client equity</div><div class="flw-v">$789B</div><div class="flw-d">$250B (2020) → $500B (2024) → $789B (Q1 2026), +38% YoY.</div></div>'+
      '<div class="flw-node"><div class="flw-k">Cash & margin</div><div class="flw-v">$169B</div><div class="flw-d">Credit balances +35%; margin loans ~$87B (record).</div></div>'+
      '<div class="flw-node"><div class="flw-k">Revenue engines</div><div class="flw-v">NII + fees</div><div class="flw-d">More cash/margin → NII; more DARTs (4.4M/day) → commissions.</div></div>'+
    '</div>'+
    '<div class="ov-fynote" style="margin-top:10px">The loop is self-reinforcing: each new account adds equity, which becomes cash and margin balances that earn interest, and adds trading that earns commissions — at almost no incremental cost, because the platform is fully automated. That is why <b>revenue compounds faster than headcount</b> (~3,182 employees).</div>');
  // The compounding, visualized
  h+=sec('The flywheel, visualized',
    '<div class="ov-charts" style="grid-template-columns:1fr 1fr">'+
      '<div class="ov-chart-card"><div class="ov-chart-t">Net-new accounts <span>(millions per year · organic)</span></div><div class="ov-chart-wrap"><canvas id="ibkrChartAdds"></canvas></div></div>'+
      '<div class="ov-chart-card"><div class="ov-chart-t">Client equity <span>($B, year-end)</span></div><div class="ov-chart-wrap"><canvas id="ibkrChartEq2"></canvas></div></div>'+
    '</div>'+
    '<div class="ave-subh-note" style="margin-top:8px">Net-new accounts (M): FY23 ~0.47, FY24 ~0.78, FY25 &gt;1.0 (record). Client equity ($B): 2023 426, 2024 568, 2025 780. Directional, from IBKR results.</div>');
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
// Accounts + equity charts for the flywheel (Top Line ▸ Segments).
var ACCT_ADDS={ years:['FY23','FY24','FY25'], adds:[0.47,0.78,1.05] };
function buildAccounts(){
  var cv=document.getElementById('ibkrChartAdds'); if(cv&&typeof Chart!=='undefined'&&cv.offsetParent){
    destroy('ibkrChartAdds');
    _charts['ibkrChartAdds']=new Chart(cv.getContext('2d'),{ type:'bar',
      data:{ labels:ACCT_ADDS.years, datasets:[{ label:'Net-new accounts (M)', data:ACCT_ADDS.adds, backgroundColor:BRAND, maxBarThickness:52 }] },
      options:{ responsive:true, maintainAspectRatio:false, animation:false,
        plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(ctx){ return ' '+ctx.parsed.y.toFixed(2)+'M accounts'; } } } },
        scales:{ x:{ grid:{display:false}, ticks:{font:{size:10.5}} }, y:{ ticks:{ callback:function(v){ return v+'M'; }, font:{size:9} }, grid:{color:'#EEF2F7'} } } }
    });
  }
  var cv2=document.getElementById('ibkrChartEq2'); if(cv2&&typeof Chart!=='undefined'&&cv2.offsetParent){
    destroy('ibkrChartEq2');
    _charts['ibkrChartEq2']=new Chart(cv2.getContext('2d'),{ type:'line',
      data:{ labels:['FY23','FY24','FY25'], datasets:[{ label:'Client equity ($B)', data:[426,568,780], borderColor:BRAND, backgroundColor:'rgba(214,0,28,0.10)', borderWidth:2.5, tension:.3, fill:true, pointRadius:3 }] },
      options:{ responsive:true, maintainAspectRatio:false, animation:false,
        plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(ctx){ return ' $'+ctx.parsed.y+'B'; } } } },
        scales:{ x:{ grid:{display:false}, ticks:{font:{size:10.5}} }, y:{ ticks:{ callback:function(v){ return '$'+v+'B'; }, font:{size:9} }, grid:{color:'#EEF2F7'} } } }
    });
  }
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
  h+='<div class="ov-foot">Segment detail from IBKR FY2023–Q1 2026 earnings calls; Preqin prime-broker ranking.</div>';
  return h;
}
// TAM ▸ the runway
function tamBody(c){
  var h='<p class="ov-lede">IBKR does not pin a single headline TAM. The runway is best read as <b>share of the global active-trader and self-directed-investing pool</b> — a market growing structurally as trading globalizes, asset classes broaden (crypto, forecast contracts, overnight) and cost pressure pushes assets to the cheapest automated platform.</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Markets accessible</div><div class="ov-kpi-v">150+</div><div class="ov-kpi-d muted">in 40 countries · 29 currencies</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Accounts today</div><div class="ov-kpi-v">~4.4M</div><div class="ov-kpi-d muted">vs a global pool in the hundreds of millions</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Client equity</div><div class="ov-kpi-v">$789B</div><div class="ov-kpi-d muted">a fraction of global brokerage assets</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Fastest regions</div><div class="ov-kpi-v">Asia · Europe</div><div class="ov-kpi-d muted">international skew of new accounts</div></div>'+
  '</div>';
  h+=sec('Where the runway comes from', bullets([
    '<b>Globalization of trading</b> — investors everywhere want direct access to US and global markets from one account; IBKR is the natural cross-border platform.',
    '<b>New asset classes</b> — crypto, overnight (24/5) trading, and CFTC-regulated <b>forecast contracts</b> keep expanding the box of what a single account can trade.',
    '<b>Up-market push</b> — introducing brokers, RIAs and hedge-fund prime brokerage add large, sticky asset pools on top of the individual base.',
    '<b>Cost gravity</b> — as fee pressure grows, assets migrate to the lowest-cost automated venue, which structurally favors IBKR.',
  ]));
  h+='<div class="ov-callout"><b>The read:</b> with ~4.4M accounts against a global pool of hundreds of millions of investors, and 150+ markets accessible from one account, IBKR is still early in a large, structurally growing opportunity — and it captures more of it every time it adds an asset class or a client channel.</div>';
  h+='<div class="ov-foot">Operating metrics: IBKR Q1 2026 results.</div>';
  return h;
}
// Industry Analysis ▸ arena positioning + the peer scatter (P/E)
var IND_ARENAS=[
  {k:'auto', a:'Automation / cost', r:'vs every broker', pos:'Leads', pc:BRAND2, pb:'rgba(10,143,76,0.12)', read:'The <b>lowest-cost, most-automated</b> broker — ~77% pre-tax margin no rival approaches. This is the whole moat.'},
  {k:'global', a:'Global market access', r:'vs Schwab · Fidelity', pos:'Leads', pc:BRAND2, pb:'rgba(10,143,76,0.12)', read:'150+ markets, 40 countries, 29 currencies from one account — unmatched breadth.'},
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
  h+=sec('Listed peers — P/E vs growth', stdPeerScatter('ind')+
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
    '<div class="ov-chart-card"><div class="ov-chart-t">Pre-tax margin <span>(%, fiscal year)</span></div><div class="ov-chart-wrap"><canvas id="ibkrChartMargin"></canvas></div></div>'+
    '<div class="ov-chart-card"><div class="ov-chart-t">Net revenues <span>($B, fiscal year)</span></div><div class="ov-chart-wrap"><canvas id="ibkrChartRev"></canvas></div></div>'+
  '</div>';
  h+=sec('Why the margin keeps rising',
    '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">Automation is operating leverage: net revenues scaled <b>~$4.3B → ~$6.0B (FY23→FY25)</b> while headcount stayed roughly flat (~3,182). Costs barely move as volume grows, so almost every extra dollar of revenue drops through — which is why <b>pre-tax margin climbed 71% → 71% → a record 77%</b>, the highest in the brokerage industry.</div>');
  h+='<div class="ave-subh-note" style="margin-top:8px">Pre-tax margin (%): FY23 71, FY24 71, FY25 77. Net revenues ($B): FY22 2.9, FY23 4.3, FY24 5.2, FY25 6.0.</div>';
  h+='<div class="ov-foot">Source: IBKR FY2022–FY2025 reported results.</div>';
  return h;
}
// Regulation & Safety ▸ how a broker like IBKR is regulated + the IBKR-specific items. Clickable
// cards → pop-ups (data-detail="reg:<id>"). Sourced from IBKR FY2025 10-K, SEC/FINRA/CFTC & IBKR IR.
var REG_TAG={ tail:{c:'#0a8f4c',l:'Tailwind'}, neu:{c:'#6b7684',l:'Wash / neutral'}, exp:{c:'#2E6BE6',l:'Expansion'}, watch:{c:'#B7791F',l:'Watch'}, safe:{c:'#7A5AF8',l:'Client safety'} };
var IBKR_REG=[
  { id:'sec31', ic:'🔁', t:'SEC Section 31 fee — a pass-through', tag:'neu',
    teaser:'Rate swings inflate both commissions and expense — zero net-income impact.',
    d:'<p>Section 31 of the Exchange Act makes exchanges/FINRA pay the SEC a fee on the dollar value of stock & option <b>sales</b>; brokers pass it straight through to customers. The rate is reset so the SEC collects exactly its annual appropriation — so it whipsaws: <b>$27.80 per million → $0.00 (May 2025, once the SEC hit its target) → $20.60 (Apr 2026)</b>.</p><p><b>For IBKR it washes out:</b> management says the fee raises commission revenue and execution/clearing expense by <b>equal amounts, with zero net-income effect</b>. It was ~$24M in Q1 2025; the drop to $0 helped push execution/clearing/distribution expense <b>−12% to $106M in Q1 2026</b>. A modeling nuance, not an earnings driver.</p>' },
  { id:'pdt', ic:'📈', t:'Pattern-Day-Trader rule eliminated', tag:'tail',
    teaser:'The $25k minimum is gone (Jun 2026) — a tailwind for small active accounts.',
    d:'<p>The old FINRA rule tagged anyone making 4+ day-trades in 5 days a "pattern day trader," forcing a <b>$25,000 minimum equity</b> floor and a 90-day freeze if breached. The <b>SEC approved eliminating it (Apr 14, 2026)</b>, replacing the trade-count test with a <b>risk-based intraday-margin framework</b>. Effective <b>June 4, 2026</b> (broker phase-in to Oct 2027).</p><p><b>Why it helps IBKR:</b> it removes the single biggest barrier for small, active retail accounts — exactly IBKR\'s "developing investor." Peterffy welcomed it publicly, rebutting "the myth that smaller accounts are inherently more reckless." Expect broader access and higher trade frequency.</p>' },
  { id:'occ', ic:'🏛️', t:'OCC National Trust Bank charter', tag:'exp',
    teaser:'Applied Dec 2025 to custody fund/ETF assets under one federal regulator.',
    d:'<p>On <b>Dec 20, 2025</b> IBKR applied to the OCC to charter <b>"Interactive National Trust Bank"</b> (Greenwich, CT) to provide <b>custodial and securities-lending services to mutual funds and ETFs</b>. The OCC granted <b>preliminary conditional approval</b>.</p><p><b>Why it matters:</b> a single federal charter replaces the need for money-transmitter/custody licenses in all 50 states — letting IBKR expand custody interstate without per-state approval. Part of a broader 2025–26 wave of fintech bank-charter filings.</p>' },
  { id:'forecastex', ic:'🗳️', t:'ForecastEx & prediction markets (CFTC)', tag:'watch',
    teaser:'IBKR runs a CFTC-regulated exchange — economics/climate/politics; sports is a legal battleground.',
    d:'<p><b>ForecastEx LLC</b> (IBKR-owned) is a CFTC-regulated <b>Designated Contract Market and clearinghouse</b> — it both lists and clears binary Yes/No "forecast contracts." Live since <b>Aug 2024</b>, $0.01/contract; volume jumped to <b>286M contract pairs in Q4 2025</b> (from 15M). IBKR historically emphasizes <b>economic, climate and political/election</b> contracts and expects the 2026 midterms to drive volume.</p><p><b>The battleground — sports.</b> Whether CFTC event-contracts preempt state gambling law is in the courts (Kalshi v. NJ/NV; the CFTC has sued several states). IBKR has publicly downplayed sports betting, but note it has <b>begun edging toward sports</b> via self-certification and a multi-venue platform that can route to Kalshi/CME — so "avoids sports" is nuanced, not absolute.</p>' },
  { id:'protection', ic:'🛡️', t:'Customer asset protection', tag:'safe',
    teaser:'Rule 15c3-3 segregation + SIPC + a large excess-SIPC policy.',
    d:'<p><b>SEC Rule 15c3-3.</b> Customer fully-paid securities must be <b>segregated</b> in good control locations (never commingled with firm assets), and cash owed to customers must sit in a <b>Special Reserve Account "for the exclusive benefit of customers."</b> A 2024 SEC amendment is moving large brokers from weekly to <b>daily</b> reserve computation.</p><p><b>SIPC:</b> up to <b>$500,000 per account</b> ($250,000 cash sublimit) if the broker fails (not market losses). <b>Excess SIPC</b> (Lloyd\'s of London): an additional <b>$30M per account</b> ($900k cash sublimit), $150M aggregate cap.</p>' },
];
function regBody(c){
  var h='<p class="ov-lede">A broker lives inside regulation — and for IBKR it is mostly a <b>set of tailwinds and pass-throughs</b>, not a threat. Here are the items that actually move the story. <b>Tap any card</b> for the mechanics.</p>';
  h+='<style>.reg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:11px}'+
    '.reg-card{position:relative;border:1px solid var(--bdr);border-radius:13px;padding:13px 15px;background:var(--w);cursor:pointer;transition:.14s}'+
    '.reg-card:hover{box-shadow:0 4px 14px rgba(0,0,0,.09);transform:translateY(-2px)}'+
    '.reg-top{display:flex;align-items:center;gap:9px;margin-bottom:6px}.reg-ic{font-size:22px;line-height:1}'+
    '.reg-t{font-size:12.5px;font-weight:800;color:var(--navy);line-height:1.25}'+
    '.reg-tag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 8px;white-space:nowrap}'+
    '.reg-teaser{font-size:11.5px;color:var(--mu);line-height:1.5}.reg-more{font-size:10px;font-weight:800;margin-top:7px}'+
    '.reg-regs{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-top:4px}'+
    '.reg-r{border:1px solid var(--bdr);border-left:3px solid '+BLUE+';border-radius:9px;padding:8px 11px}'+
    '.reg-r-k{font-size:11.5px;font-weight:800;color:var(--navy)}.reg-r-d{font-size:10px;color:var(--mu);margin-top:1px;line-height:1.4}</style>';
  h+='<div class="reg-grid">'+IBKR_REG.map(function(r){ var tg=REG_TAG[r.tag];
    return '<div class="reg-card ov-clickable" data-detail="reg:'+r.id+'">'+
      '<div class="reg-top"><span class="reg-ic">'+r.ic+'</span><span class="reg-tag" style="background:'+tg.c+'">'+tg.l+'</span></div>'+
      '<div class="reg-t">'+esc(r.t)+'</div><div class="reg-teaser" style="margin-top:5px">'+esc(r.teaser)+'</div>'+
      '<div class="reg-more" style="color:'+tg.c+'">The mechanics ›</div></div>';
  }).join('')+'</div>';
  h+=sec('Who regulates IBKR',
    '<div class="reg-regs">'+
      '<div class="reg-r"><div class="reg-r-k">SEC + FINRA</div><div class="reg-r-d">US securities broker-dealer</div></div>'+
      '<div class="reg-r"><div class="reg-r-k">CFTC + NFA</div><div class="reg-r-d">US futures / FCM</div></div>'+
      '<div class="reg-r"><div class="reg-r-k">FCA</div><div class="reg-r-d">Interactive Brokers (U.K.)</div></div>'+
      '<div class="reg-r"><div class="reg-r-k">Central Bank of Ireland</div><div class="reg-r-d">IBIE — main EU hub (post-Brexit)</div></div>'+
      '<div class="reg-r"><div class="reg-r-k">FINMA</div><div class="reg-r-d">IBKR Financial Services AG (Swiss)</div></div>'+
      '<div class="reg-r"><div class="reg-r-k">SFC</div><div class="reg-r-d">Interactive Brokers Hong Kong</div></div>'+
      '<div class="reg-r"><div class="reg-r-k">SEBI / NSE</div><div class="reg-r-d">Interactive Brokers India</div></div>'+
      '<div class="reg-r"><div class="reg-r-k">+ AU · JP · CA · SG</div><div class="reg-r-d">local regulators per subsidiary</div></div>'+
    '</div>'+
    '<div class="ave-subh-note" style="margin-top:8px">All operating subsidiaries were in compliance with regulatory capital requirements at Dec 31, 2025 (FY2025 10-K).</div>');
  h+='<div class="ov-foot">Sources: IBKR FY2025 Form 10-K; SEC/FINRA Section 31 & PDT rule releases; OCC charter decision; CFTC/ForecastEx.</div>';
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
      { q:'Q4 2025', items:['Headcount ~flat (2,900 → 3,182) while accounts grew ~30%+; customer-service costs down.'] },
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
// Guidance ▸ IBKR gives no revenue/EPS targets — it commits to a philosophy. Five colorful,
// clickable "commitment" cards (→ pop-ups) + a "what it will NOT do" contrast panel.
var IBKR_GUIDE=[
  { id:'margin', ic:'🏆', col:BRAND, k:'Protect the margin', v:'~77% pre-tax',
    teaser:'Keep margins the best in the industry — the output of automation.',
    d:'<p>The number management protects above all. Pre-tax margin has held <b>70%+ for 6+ straight quarters</b> and hit a record <b>77% in FY25</b>. It is not a target they promise to grow — it is a floor they refuse to give back, because it is the visible proof that automation works.</p><p>Every new product and every new hire is judged against it: if it dilutes the margin without building the flywheel, it does not happen.</p>' },
  { id:'organic', ic:'🌱', col:BRAND2, k:'Grow organically', v:'no incentives',
    teaser:'No sign-up bonuses. Every account earned on price and product.',
    d:'<p>IBKR runs <b>no sign-up bonuses, no paid referrals, no gimmicks</b>. Management is proud that all <b>>1M net-new accounts in 2025</b> were won on cost, breadth and tools alone — growth that is cheaper to acquire and stickier once won.</p><p>The tell: growth is skewed <b>international</b> (Asia & Europe fastest), where IBKR rarely advertises — word-of-mouth among serious traders.</p>' },
  { id:'fortress', ic:'🏰', col:BLUE, k:'Fortress balance sheet', v:'$0 long-term debt',
    teaser:'No debt, ~$6–7B excess capital — a deliberate trust signal.',
    d:'<p><b>No long-term debt</b> and <b>~$6–7B of excess regulatory capital</b> above the minimums. This is a choice, not an accident: after prior prime-broker blowups, a fortress balance sheet is the single biggest trust signal IBKR can show hedge-fund and institutional clients.</p><p>It also self-funds the up-market push into prime brokerage without ever needing to raise money.</p>' },
  { id:'return', ic:'💵', col:AMBER, k:'Return the excess', v:'$0.35/yr dividend',
    teaser:'A rising dividend pegged to ~0.5–1% of the stock price.',
    d:'<p>Capital return is deliberate, not aggressive. The dividend policy is pegged to <b>~0.5–1% of the stock price</b> and has climbed steadily: <b>$0.10/qtr (2011) → $0.25/qtr (Q1 2025) → 4-for-1 split (Jun 2025) → $0.35/yr (Q1 2026)</b>.</p><p>No large buybacks are needed — growth is self-funded and organic, so excess capital is simply handed back.</p>' },
  { id:'mna', ic:'🧊', col:PURPLE, k:'Stay disciplined on M&A', v:'walks away',
    teaser:'"Couldn\'t agree on price" on two targets. Won\'t buy sports-betting.',
    d:'<p>IBKR does not manufacture growth with acquisitions. Management disclosed it <b>"couldn\'t agree on price"</b> on two targets and simply walked, and it has explicitly said it <b>will not buy sports-betting</b>.</p><p>The bar is high because the core business compounds on its own — any deal has to clear the flywheel, not just add revenue.</p>' },
];
function guidanceBody(c){
  var h='<p class="ov-lede">IBKR gives <b>no revenue or EPS targets</b> — so "guidance" here means the <b>five things management actually commits to</b>. Tap any card for what it means in practice.</p>';
  h+='<style>.gd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:11px}'+
    '.gd-card{position:relative;border:1px solid var(--bdr);border-radius:13px;padding:14px 15px;background:var(--w);cursor:pointer;transition:.14s;overflow:hidden}'+
    '.gd-card:hover{box-shadow:0 4px 14px rgba(0,0,0,.09);transform:translateY(-2px)}'+
    '.gd-card::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;background:var(--gc)}'+
    '.gd-ic{font-size:24px;line-height:1;margin-top:2px}'+
    '.gd-v{font-size:20px;font-weight:800;line-height:1.05;margin:8px 0 2px;color:var(--gc)}'+
    '.gd-k{font-size:12.5px;font-weight:800;color:var(--navy)}'+
    '.gd-teaser{font-size:11px;color:var(--mu);line-height:1.45;margin-top:4px}'+
    '.gd-more{font-size:10px;font-weight:800;color:var(--gc);margin-top:8px}'+
    '.gd-not{margin-top:14px;border:1px solid var(--bdr);border-left:4px solid var(--mu);border-radius:12px;padding:13px 16px;background:#F7F9FB}'+
    '.gd-not-h{font-size:12px;font-weight:800;color:var(--navy);margin-bottom:7px}'+
    '.gd-not-row{display:flex;gap:9px;align-items:flex-start;font-size:11.5px;color:var(--navy);line-height:1.5;padding:3px 0}'+
    '.gd-not-x{color:'+BRAND+';font-weight:800;flex:none}</style>';
  h+='<div class="gd-grid">'+IBKR_GUIDE.map(function(g){
    return '<div class="gd-card ov-clickable" data-detail="guide:'+g.id+'" style="--gc:'+g.col+'">'+
      '<div class="gd-ic">'+g.ic+'</div><div class="gd-v">'+esc(g.v)+'</div><div class="gd-k">'+esc(g.k)+'</div>'+
      '<div class="gd-teaser">'+esc(g.teaser)+'</div><div class="gd-more">What it means ›</div></div>';
  }).join('')+'</div>';
  h+='<div class="gd-not"><div class="gd-not-h">✕ And what IBKR deliberately will NOT do</div>'+
    '<div class="gd-not-row"><span class="gd-not-x">✕</span><span>Issue <b>revenue or EPS targets</b> — it refuses to manage to a number.</span></div>'+
    '<div class="gd-not-row"><span class="gd-not-x">✕</span><span>Pay <b>sign-up bonuses or incentives</b> to buy account growth.</span></div>'+
    '<div class="gd-not-row"><span class="gd-not-x">✕</span><span>Take on <b>long-term debt</b> or run a thin capital cushion.</span></div>'+
    '<div class="gd-not-row"><span class="gd-not-x">✕</span><span>Do <b>dilutive or overpriced M&A</b> — or touch <b>sports-betting</b>.</span></div>'+
  '</div>';
  h+='<div class="ov-foot">Per IBKR FY2023–Q1 2026 earnings commentary. IBKR issues no formal financial guidance.</div>';
  return h;
}
function strategyBody(c){
  var DRIVERS=[
    ['🤖','Automate everything','The engineers <i>are</i> the company (~3,182 staff run a ~$6B broker). Software replaces the back office, trading desk, compliance and customer service — so unit costs fall as volume rises.','Headcount ~flat while accounts grew ~30%+'],
    ['💸','Undercut on price','Because the cost base is the lowest in the industry, IBKR charges the least: FX at ~0.03%, margin loans among the cheapest, tiered commissions to 0.05¢/share — and still pays customers Fed funds − 50bps on cash.','Prices no full-service rival can match'],
    ['🧲','Win accounts organically','Low cost + 150+ markets from one account attracts serious traders with no bonuses. New accounts skew international (Asia & Europe fastest).','>1M net-new accounts in 2025 (record)'],
    ['💰','Monetize the balances & trades','Each account brings equity → cash & margin loans (net interest income) and trades (commissions) — earned at almost zero incremental cost on the automated platform.','$789B client equity · NII ~$3.6B · 4.4M DARTs/day'],
    ['🔁','Reinvest the margin','~77% pre-tax margins fund more automation and a broader box (crypto, overnight, forecast contracts, prime) — which lowers cost and adds accounts again.','Pre-tax margin 71% → a record 77%'],
  ];
  var h='<p class="ov-lede">IBKR is one machine, not five business lines: a <b>cost-and-automation flywheel</b>. Automation makes it the cheapest broker → the cheapest prices win serious traders → their balances and trades are monetized at near-zero incremental cost → the fat margin buys more automation. Round and round.</p>';
  h+='<style>.flyw{display:flex;flex-direction:column;gap:0;margin:6px 0 4px}'+
    '.flyw-step{position:relative;display:grid;grid-template-columns:34px 1fr;gap:13px;align-items:start;border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:12px;padding:13px 15px;background:var(--w)}'+
    '.flyw-num{width:34px;height:34px;border-radius:50%;background:'+BRAND+';color:#fff;font-size:15px;font-weight:800;display:flex;align-items:center;justify-content:center}'+
    '.flyw-t{font-size:13px;font-weight:800;color:var(--navy)}.flyw-t .em{margin-right:6px}'+
    '.flyw-d{font-size:11.5px;color:var(--mu);line-height:1.5;margin-top:3px}.flyw-d i{color:var(--navy);font-style:italic}'+
    '.flyw-proof{display:inline-block;margin-top:7px;font-size:10.5px;font-weight:800;color:'+BRAND+';background:rgba(214,0,28,0.07);border-radius:20px;padding:3px 10px}'+
    '.flyw-arrow{text-align:center;font-size:15px;color:var(--mu);line-height:1;margin:3px 0}'+
    '.flyw-loop{text-align:center;font-size:11px;font-weight:800;color:'+BRAND+';border:1px dashed '+BRAND+';border-radius:20px;padding:5px 14px;margin:6px auto 0;display:inline-block}'+
    '.flyw-wrap{text-align:center}</style>';
  h+='<div class="flyw">';
  DRIVERS.forEach(function(d,i){
    h+='<div class="flyw-step"><div class="flyw-num">'+(i+1)+'</div><div><div class="flyw-t"><span class="em">'+d[0]+'</span>'+esc(d[1])+'</div><div class="flyw-d">'+d[2]+'</div><div class="flyw-proof">✓ '+esc(d[3])+'</div></div></div>';
    if(i<DRIVERS.length-1) h+='<div class="flyw-arrow">▼</div>';
  });
  h+='</div>';
  h+='<div class="flyw-wrap"><div class="flyw-loop">↻ …the margin buys more automation → back to step 1</div></div>';
  h+='<div class="ov-callout" style="margin-top:14px"><b>Why rivals can\'t just copy it:</b> the flywheel only spins if you are already the low-cost operator. A full-service broker that cut prices to IBKR\'s level would destroy its own margins; IBKR earns ~77% <i>because</i> of those prices. That is the moat — not any single product.</div>';
  h+='<div class="ov-foot">Strategy framing per IBKR earnings commentary and business model. Proof metrics from FY2025 & Q1 2026 results.</div>';
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
    '<div class="ave-subh-note" style="margin-top:8px">Rows = FY2027E EPS, columns = P/E. Cell = EPS × P/E.</div>');
  h+='<div class="ov-foot">P/E-at-FY2027E framework. Base EPS ~$2.60 and P/E ~30× are directional anchors. IBKR is a financial — EV/EBITDA is not used.</div>';
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
  h+='<div class="ov-foot">Multiples as of ~Jul 2026, forward where available; market caps live on the Overview scatter.</div>';
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
  var h='<p class="ov-lede">IBKR\'s <b>reported financials</b> (directional). The story is consistent: revenues and client equity compounding, margins rising.</p>';
  h+='<div class="ov-chart-card" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="color:var(--mu)"><th style="text-align:left;padding:7px 10px">($B unless noted)</th>'+FIN_SERIES.years.map(function(y){ return '<th style="text-align:right;padding:7px 10px">'+esc(y)+'</th>'; }).join('')+'</tr></thead><tbody>'+
    row('Net revenues',FIN_SERIES.netRev,function(v){return '$'+v.toFixed(1)+'B';})+
    row('Net interest income',FIN_SERIES.nii,function(v){return '$'+v.toFixed(1)+'B';})+
    row('Commissions',FIN_SERIES.comm,function(v){return '$'+v.toFixed(1)+'B';})+
    row('Pre-tax margin',FIN_SERIES.ptMargin,function(v){return v+'%';})+
    row('Client equity (year-end)',FIN_SERIES.clientEq,function(v){return '$'+v+'B';})+
  '</tbody></table></div>';
  h+='<div class="ave-subh-note" style="margin-top:8px">All approximate/directional. Net revenues: FY22 ~2.9, FY23 ~4.3, FY24 ~5.2, FY25 ~6.0. NII: FY23 2.8, FY24 3.1, FY25 3.6. Commissions: FY23 1.4, FY24 1.7, FY25 2.1. Pre-tax margin: FY23 71, FY24 71, FY25 77. Client equity: 2023 426, 2024 568, 2025 780.</div>';
  h+='<div class="ov-foot">Source: IBKR FY2022–FY2025 reported results.</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// Ownership ▸ the up-C structure explainer.
function ownershipBody(c){
  var h='<p class="ov-lede">IBKR has an unusual <b>"up-C" (Umbrella Partnership–C-corporation) structure</b>. In plain terms: <b>the public owns 26.3% of the business; the founder side owns 73.7%.</b> That one fact explains why the quoted "market cap" reflects only the public slice, why EPS is reported "comprehensive diluted", and why the tax note splits public vs operating company.</p>';
  h+='<style>'+
    /* power-asymmetry hero */
    '.upw{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:10px 0 4px}@media(max-width:640px){.upw{grid-template-columns:1fr}}'+
    '.upw-c{border:1px solid var(--bdr);border-radius:14px;padding:15px 16px;background:var(--w);position:relative;overflow:hidden}'+
    '.upw-you{border-top:4px solid '+BLUE+'}.upw-tp{border-top:4px solid '+BRAND+';background:linear-gradient(180deg,rgba(214,0,28,0.05),transparent)}'+
    '.upw-ic{font-size:26px;line-height:1}.upw-who{font-size:13.5px;font-weight:800;color:var(--navy);margin:6px 0 1px}.upw-sub{font-size:10.5px;color:var(--mu);font-weight:600}'+
    '.upw-big{font-size:34px;font-weight:800;line-height:1;margin:12px 0 2px}.upw-biglab{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)}'+
    '.upw-rows{margin-top:11px;border-top:1px solid var(--bdr);padding-top:9px}'+
    '.upw-row{display:flex;justify-content:space-between;gap:10px;font-size:11px;padding:3px 0}.upw-row .k{color:var(--mu);font-weight:600}.upw-row .v{color:var(--navy);font-weight:800;text-align:right}'+
    /* economic split bar */
    '.upbar{display:flex;height:34px;border-radius:9px;overflow:hidden;border:1px solid var(--bdr);margin:6px 0 4px;font-size:11px;font-weight:800}'+
    '.upbar-seg{display:flex;align-items:center;justify-content:center;color:#fff;white-space:nowrap;padding:0 8px}'+
    /* org chart */
    '.upc-org{margin:4px 0}'+
    '.upc-tier{display:grid;grid-template-columns:1fr 1fr;gap:34px}@media(max-width:560px){.upc-tier{grid-template-columns:1fr;gap:12px}}'+
    '.upc-box{border:1px solid var(--bdr);border-radius:12px;padding:12px 14px;background:var(--w);cursor:pointer;transition:.14s;text-align:center}'+
    '.upc-box:hover{box-shadow:0 3px 12px rgba(0,0,0,.09);transform:translateY(-1px)}'+
    '.upc-pub{border-top:3px solid '+BLUE+'}.upc-ins{border-top:3px solid '+BRAND+'}'+
    '.upc-tag{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:var(--mu)}'+
    '.upc-h{font-size:12.5px;font-weight:800;color:var(--navy);margin:3px 0 4px}'+
    '.upc-own{font-size:20px;font-weight:800;line-height:1}.upc-ownd{font-size:10px;color:var(--mu);margin-top:2px}'+
    '.upc-op{border:1px solid var(--bdr);border-top:3px solid var(--navy);border-radius:12px;padding:13px 16px;background:linear-gradient(180deg,rgba(16,20,26,0.03),transparent);text-align:center;cursor:pointer;transition:.14s;max-width:74%;margin:0 auto}'+
    '.upc-op:hover{box-shadow:0 3px 12px rgba(0,0,0,.09)}@media(max-width:560px){.upc-op{max-width:100%}}'+
    '.upc-op-h{font-size:13px;font-weight:800;color:var(--navy)}.upc-op-d{font-size:11px;color:var(--mu);line-height:1.5;margin-top:3px}'+
    '.upc-more{font-size:10px;font-weight:800;margin-top:5px}</style>';
  // ── Power asymmetry hero ──
  h+='<div class="upw">'+
    '<div class="upw-c upw-you"><div class="upw-ic">👤</div><div class="upw-who">A normal Class A shareholder</div><div class="upw-sub">i.e. you, buying IBKR on NASDAQ</div>'+
      '<div class="upw-big" style="color:'+BLUE+'">≈0%</div><div class="upw-biglab">effective control of the company</div>'+
      '<div class="upw-rows">'+
        '<div class="upw-row"><span class="k">Economic interest</span><span class="v">your share of the 26.3% public pool</span></div>'+
        '<div class="upw-row"><span class="k">Voting power</span><span class="v">your share of ~26.3%</span></div>'+
        '<div class="upw-row"><span class="k">Say over strategy</span><span class="v">essentially none</span></div>'+
      '</div></div>'+
    '<div class="upw-c upw-tp"><div class="upw-ic">👑</div><div class="upw-who">Thomas Peterffy</div><div class="upw-sub">Founder & Chairman</div>'+
      '<div class="upw-big" style="color:'+BRAND+'">~73.7%</div><div class="upw-biglab">of the vote — he controls it</div>'+
      '<div class="upw-rows">'+
        '<div class="upw-row"><span class="k">Controls (Class B)</span><span class="v">~73.7% of the vote</span></div>'+
        '<div class="upw-row"><span class="k">Via IBG Holdings econ.</span><span class="v">73.7% of IBG LLC</span></div>'+
        '<div class="upw-row"><span class="k">Owns directly (Class A)</span><span class="v">just 1.40%</span></div>'+
      '</div></div>'+
  '</div>';
  h+='<div class="ov-diagram-cap" style="margin:8px 0 2px"><b>Economic ownership of the operating company IBG LLC</b> (membership interests, Dec 31, 2025)</div>';
  h+='<div class="upbar"><div class="upbar-seg" style="flex:263;background:'+BLUE+'">Public (Class A) 26.3%</div><div class="upbar-seg" style="flex:737;background:'+BRAND+'">IBG Holdings 73.7%</div></div>';
  h+='<div class="ave-subh-note" style="margin:2px 0 0">No supervoting: Class B votes on an <b>as-converted basis</b>, so IBG Holdings\' 73.7% <b>economic</b> interest = 73.7% of the <b>vote</b> — not a super-voting share class. Peterffy controls that bloc through IBG Holdings.</div>';
  // ── Org chart (up-C) ──
  h+=sec('The structure — who owns what',
    '<div class="upc-org">'+
      '<div class="upc-tier">'+
        '<div class="upc-box upc-pub ov-clickable" data-detail="upc:public"><div class="upc-tag">The public company</div><div class="upc-h">IBKR Group Inc · Class A (NASDAQ: IBKR)</div><div class="upc-own" style="color:'+BLUE+'">26.3%</div><div class="upc-ownd">of IBG LLC · this is the public float</div><div class="upc-more" style="color:'+BLUE+'">detail ›</div></div>'+
        '<div class="upc-box upc-ins ov-clickable" data-detail="upc:holdings"><div class="upc-tag">Founder & insiders</div><div class="upc-h">IBG Holdings LLC · Peterffy + employees</div><div class="upc-own" style="color:'+BRAND+'">73.7%</div><div class="upc-ownd">of IBG LLC · Peterffy controls this bloc</div><div class="upc-more" style="color:'+BRAND+'">detail ›</div></div>'+
      '</div>'+
      '<svg viewBox="0 0 400 46" preserveAspectRatio="none" style="width:100%;height:46px;display:block" aria-hidden="true"><path d="M100 0 L100 22 L200 22 L200 46" fill="none" stroke="#C7CED6" stroke-width="1.5"/><path d="M300 0 L300 22 L200 22 L200 46" fill="none" stroke="#C7CED6" stroke-width="1.5"/></svg>'+
      '<div style="text-align:center;font-size:10px;font-weight:700;color:var(--mu);margin:-2px 0 8px">both own membership interests of ▼</div>'+
      '<div class="upc-op ov-clickable" data-detail="upc:opco"><div class="upc-op-h">IBG LLC — the operating company</div><div class="upc-op-d">The broker that actually earns the ~$6B of revenue at ~77% pre-tax margin. IBKR Group Inc <b>consolidates 100%</b> of it for accounting but is <b>entitled to only 26.3%</b> of the economics — the other 73.7% is a large non-controlling interest.</div><div class="upc-more" style="color:'+BRAND+'">why this matters ›</div></div>'+
    '</div>');
  h+=sec('Why it matters — three consequences', bullets([
    '<b>"Market cap" is only the 26.3% public slice.</b> The figure on quote screens reflects the Class A shares held by the public — not the whole enterprise. The founder-side 73.7% sits in IBG Holdings, outside it.',
    '<b>EPS is "comprehensive diluted."</b> IBKR reports as-if <b>all IBG Holdings interests converted</b> to public shares — so the EPS you see already reflects the full 100% economic base (the right number to multiply by a P/E).',
    '<b>The income-tax note splits public vs operating company.</b> IBG LLC is largely a pass-through; only IBKR Group Inc\'s 26.3% slice bears full corporate tax — which is why the tax disclosure separates the two.',
  ]));
  h+='<div class="ov-callout"><b>Bottom line:</b> IBKR is <b>founder-controlled</b>. Public holders own a 26.3% economic slice and effectively no control — you invest <i>alongside</i> Peterffy, on his terms. It cuts both ways: deep alignment and long-term thinking, but limited public say and a genuine succession question. The founder side does shrink over time as IBG Holdings interests convert into public Class A shares.</div>';
  h+='<div class="ov-foot">Ownership per IBKR FY2025 10-K (IBG LLC membership interests, Dec 31 2025: IBG Inc 26.3% / IBG Holdings 73.7%) and 2026 proxy (voting power). The split shifts toward the public over time as interests convert.</div>';
  return h;
}
function govBody(c){
  var h='<p class="ov-lede">Governance is <b>founder-controlled by design</b>: Peterffy controls ~73.7% of the vote, the board is a Nasdaq "controlled company" (5 of 10 independent), and the balance sheet is deliberately conservative (no debt, huge excess capital).</p>';
  h+='<div class="ov-kpis">'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Control</div><div class="ov-kpi-v">Founder</div><div class="ov-kpi-d muted">Peterffy ~73.7% of the vote</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Public ownership</div><div class="ov-kpi-v">26.3%</div><div class="ov-kpi-d muted">of IBG LLC (up-C)</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Long-term debt</div><div class="ov-kpi-v">None</div><div class="ov-kpi-d muted">~$6–7B excess capital</div></div>'+
    '<div class="ov-kpi"><div class="ov-kpi-l">Board</div><div class="ov-kpi-v">10 · 5 indep.</div><div class="ov-kpi-d muted">Lead Independent: L. Harris</div></div>'+
  '</div>';
  h+=sec('The read', '<div class="ov-tl-body" style="font-size:12px;line-height:1.6">The pros of founder control: <b>long-term thinking</b> (Peterffy\'s "as long as I shall live" durability, big multi-year bets like ForecastEx), <b>capital discipline</b>, and deep alignment (the founder\'s wealth <i>is</i> the stock). The cons: as a Nasdaq <b>"controlled company"</b> the board need not be majority-independent — public holders own a minority and have limited say, and succession beyond Galik is a long-term question. Offsetting it, the <b>independent bench is genuinely strong</b>: Lead Independent Director <b>Lawrence Harris</b> (ex-SEC Chief Economist) chairs Audit, alongside <b>Richard Repetto</b> (ex-Piper Sandler broker analyst) and <b>Nicole Yuen</b> (ex-Credit Suisse). Full roster & committees in the Executives & Board subtab.</div>');
  h+='<div class="ov-foot">Governance facts per IBKR\'s 2026 proxy & FY2025 10-K.</div>';
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
    detail:'<p><b>At IBKR.</b> The founder and architect of everything — bought an AMEX seat in 1977, built Timber Hill\'s automated market-making, founded Interactive Brokers in 1993, took it public in 2007, and grew it into a ~$6B-revenue broker with industry-leading ~77% pre-tax margins and ~4.4M accounts. Remains Chairman, the controlling shareholder (~73.7% of the vote), and the firm\'s strategic and macro anchor.</p>'+
      '<p><b>Before / outside.</b> One of the true pioneers of electronic trading — credited with computerizing options market-making decades before it was standard.</p>'+
      '<p><b>The read — value creator (green).</b> A generational builder whose fingerprints are on the entire industry. The only caveat is concentration: the company is deeply tied to one person, and long-term succession beyond Galik is an open question.</p>' },
  { id:'galik', n:'Milan Galik', role:'CEO & President', since:'1990 · CEO 2019', rate:'green',
    at:'Ran client equity from ~$250B to ~$789B on a clean founder-to-insider handoff — record accounts, S&P 500 inclusion, relentless automation.',
    before:'None outside IBKR — joined 1990 as a developer; his record <i>is</i> the IBKR operating record.',
    detail:'<p><b>At IBKR (CEO since 2019).</b> Joined in 1990 as a software developer and rose through engineering to the top job — a rare, clean founder-to-insider handoff. As CEO he presided over the client-equity run from ~$250B to ~$789B, record account adds (>1M in 2025), S&P 500 inclusion, and the continued automation that keeps headcount ~flat while accounts grow ~30%+.</p>'+
      '<p><b>Before / outside.</b> Essentially none outside IBKR — his career is the firm.</p>'+
      '<p><b>The read — value creator (green).</b> A proven operator executing the founder\'s playbook flawlessly; the only caveat is the lack of an independent, external benchmark for his record.</p>' },
  { id:'brody', n:'Paul J. Brody', role:'CFO, Treasurer & Secretary', since:'1987', rate:'green',
    at:'Built the fortress: no debt, ~$6–7B excess capital, the <30-day treasury book and the rate-sensitivity playbook the Street relies on.',
    before:'Long finance tenure at IBKR; ex-director of The Options Clearing Corporation (2005–2012).',
    detail:'<p><b>At IBKR.</b> CFO since 2006 (joined 1987). Responsible for IBKR\'s conservative, cash-rich posture: no long-term debt, ~$6–7B excess capital, a &lt;30-day-duration treasury book on customer cash (which bounds rate risk), and the disclosed NII rate-sensitivity framework the Street relies on. Steered the dividend path and the 4-for-1 split.</p>'+
      '<p><b>Before / outside.</b> BA economics, Cornell; former director of The Options Clearing Corporation.</p>'+
      '<p><b>The read — value creator (green).</b> The financial discipline is a genuine asset and a competitive signal to institutional clients; low-key and consistent.</p>' },
  { id:'nemser', n:'Earl H. Nemser', role:'Vice Chairman', since:'1988', rate:'green',
    at:'The legal & governance backbone — senior counsel, chairs the UK entity and IBG\'s internal audit; steers structure and compliance.',
    before:'Longtime lawyer — Special Counsel / Independent Advisor to Dechert LLP (2005–2018).',
    detail:'<p><b>At IBKR.</b> Vice Chairman since 2006 (with IBG LLC since 1988). Serves as the firm\'s senior legal counsel, heads IBG LLC\'s Internal Audit Committee, sits on the Steering Committee, chairs Interactive Brokers (U.K.) Limited, and chairs the board\'s Nominating & Corporate Governance committee.</p>'+
      '<p><b>Before / outside.</b> JD magna cum laude, Boston University; Special Counsel / Independent Advisor to Dechert LLP.</p>'+
      '<p><b>The read — value creator (green).</b> Quietly central to how the up-C structure, regulatory footprint and governance are run — a stabilizing, low-profile insider.</p>' },
  { id:'frank', n:'Dr. Thomas A. Frank', role:'Executive Vice President', since:'1985', rate:'green',
    at:'PhD-physicist engineer behind decades of the automation platform; CIO from 1999 until 2024, now EVP.',
    before:'PhD physics, MIT (1985); director of The Options Clearing Corporation since 2015.',
    detail:'<p><b>At IBKR.</b> EVP of Interactive Brokers LLC; with the firm since 1985. Served as Chief Information Officer from 1999 until stepping down from that role in April 2024 (remains EVP). A core architect of the technology that lets ~3,182 staff run a ~$6B broker.</p>'+
      '<p><b>Before / outside.</b> PhD in physics, MIT (1985); director of The Options Clearing Corporation since 2015.</p>'+
      '<p><b>The read — value creator (green).</b> Emblematic of IBKR\'s engineering-led DNA; the automation moat is partly his. Watch the CIO succession now that he has handed off that title.</p>' },
];
// Independent directors — outside credibility (overseers, not operators; shown as a compact strip).
var TRACK_BOARD=[
  { n:'Dr. Lawrence E. Harris', cred:'Lead Independent Director · Audit Chair · USC finance professor, former SEC Chief Economist.' },
  { n:'Richard Repetto', cred:'Audit · ex-Piper Sandler fintech/e-broker research analyst — knows the industry cold.' },
  { n:'Nicole Yuen', cred:'Audit + Nom/Gov · ex-Credit Suisse Vice Chairman, Greater China — Asia/institutional lens.' },
  { n:'Jill Bright', cred:'30+ years HR/administration (Condé Nast, LionTree, Crestview).' },
  { n:'Lori Conkling', cred:'Netflix TV/film licensing; ex-YouTube/Google — newest independent (2025).' },
];
function trackBody(c){
  var legend=Object.keys(TRACK_RATE).map(function(k){ var r=TRACK_RATE[k]; return '<span style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:var(--navy)"><span style="width:10px;height:10px;border-radius:50%;background:'+r.c+'"></span>'+r.l+'</span>'; }).join('');
  var cards=TRACK.map(function(m){ var r=TRACK_RATE[m.rate];
    return '<div class="trk-card ov-clickable" data-detail="exec:'+m.id+'" style="border:1px solid '+r.bd+';border-left:4px solid '+r.c+';background:'+r.bg+';border-radius:12px;padding:12px 14px;cursor:pointer;transition:.14s">'+
      '<div class="trk-top"><span class="trk-dot" style="background:'+r.c+'"></span><div class="trk-nm">'+esc(m.n)+'</div><span class="trk-rate" style="color:'+r.c+'">'+r.l+'</span></div>'+
      '<div class="trk-role">'+esc(m.role)+' · since '+esc(m.since)+'</div>'+
      '<div class="trk-at">'+m.at+'</div>'+
      '<div class="ov-more" style="margin-top:6px;color:'+r.c+'">Full track record ›</div></div>';
  }).join('');
  var h='<p class="ov-lede">The people who <b>built and run</b> IBKR, rated on what they\'ve actually delivered. It is a rare bench: several with <b>30+ years</b> at the firm, engineering-led, and a clean founder-to-CEO handoff. <b>Tap a card</b> for the full history.</p>';
  h+='<style>.trk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:11px}'+
    '.trk-card:hover{box-shadow:0 4px 14px rgba(0,0,0,.09);transform:translateY(-2px)}'+
    '.trk-top{display:flex;align-items:center;gap:7px}.trk-dot{width:9px;height:9px;border-radius:50%;flex:none}'+
    '.trk-nm{font-size:13.5px;font-weight:800;color:var(--navy);flex:1}'+
    '.trk-rate{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.4px}'+
    '.trk-role{font-size:10.5px;color:var(--mu);font-weight:700;margin:2px 0 7px}'+
    '.trk-at{font-size:11.5px;color:var(--navy);line-height:1.5}'+
    '.trkb{display:grid;grid-template-columns:1fr 1fr;gap:8px}@media(max-width:600px){.trkb{grid-template-columns:1fr}}'+
    '.trkb-c{border:1px solid var(--bdr);border-left:3px solid '+BLUE+';border-radius:9px;padding:9px 12px}'+
    '.trkb-n{font-size:12px;font-weight:800;color:var(--navy)}.trkb-c-r{font-size:10.5px;color:var(--mu);line-height:1.45;margin-top:2px}</style>';
  h+='<div style="display:flex;gap:14px;flex-wrap:wrap;margin:0 0 12px">'+legend+'</div>';
  h+='<div class="trk-grid">'+cards+'</div>';
  h+=sec('Independent board — the outside credibility',
    '<div class="ov-diagram-cap" style="margin:0 0 8px">The operators above are rated on their record; the independent directors bring <b>outside oversight</b> — and they are notably credible for a controlled company.</div>'+
    '<div class="trkb">'+TRACK_BOARD.map(function(b){ return '<div class="trkb-c"><div class="trkb-n">'+esc(b.n)+'</div><div class="trkb-c-r">'+esc(b.cred)+'</div></div>'; }).join('')+'</div>');
  h+='<div class="ov-callout" style="margin-top:14px"><b>The one caveat:</b> almost every operator\'s record <i>is</i> the IBKR record — there is little external, independent benchmark for the bench, and the firm is deeply tied to Peterffy. Long-term succession beyond Galik is the open question. Offsetting it: a genuinely strong independent board (Harris, Repetto, Yuen).</div>';
  h+='<div class="ov-foot">Roster per IBKR\'s 2026 proxy & FY2025 10-K.</div>';
  return h;
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// DEEP DIVE — CALL PREP  (6th spine tab · append-only per quarter · portable to MA/UBER/LYFT/CART)
// ═══════════════════════════════════════════════════════════════════════════════════════════════
// A decision tool, not an archive. Three phases per quarter: ① Pre-Call (setup + watchList, FROZEN
// once the quarter opens) → ② Post-Results (the numbers scorecard vs consensus) → ③ Post-Call (what
// management said + the meeting conclusion). APPEND-ONLY: prior quarters are never overwritten, so we
// build a running record of how well we read the company. Workflow: pre-call → results land → fill
// `results` → attend call → fill `call` (conclusion + newQuestions, which seed the next watchList).
// The render (cp*Body) is generic — copy it to another ticker, swap content. Consensus is HARDCODED
// from Bloomberg (only the values that render), see docs/CALL_PREP_CONVENTIONS.md.
var CALL_PREP = {
  ticker:'IBKR',
  quarters:[
    { q:'Q2 2026', status:'upcoming', date:'Tue Jul 21, 2026 · after close (call 4:30pm ET)',
      // Consensus below is HARDCODED and only the values that render in the portal (Bloomberg-sourced).
      setup:{
        source:'Bloomberg (BST consensus)', asOf:'2026-07-21',
        consensus:{
          adjEps:{v:0.63,yoy:24,unit:'$'}, adjNetRevUsdM:{v:1787,yoy:21,unit:'$M'},
          niiUsdM:{v:980,yoy:14,unit:'$M'}, dartsM:{v:4.72,yoy:33,unit:'M/day'},
          accountsM:{v:5.15,yoy:33,unit:'M', note:{ t:'⚠ First quarter after the PDT-rule change', h:'<p>The <b>Pattern-Day-Trader rule was eliminated on June 4, 2026</b> — the $25k minimum for small active accounts is gone. Q2 2026 is the <b>first quarter to reflect it</b>, so a bump in US account adds is expected and partly <b>structural, not organic</b>.</p><p>Read the number with that caveat: the durable signal is the <b>international mix</b>, not the headline.</p>' }},
          custEquityBn:{v:903.7,yoy:36,unit:'$B'},
          creditBalAvgBn:{v:170.1,yoy:31,unit:'$B'}, preTaxMarginPct:{v:76.8,yoy:null,unit:'%'}
        },
        debate:{
          fear:'NII rolls over as the Fed cuts rates.',
          real:'Consensus has NII <b>rising anyway</b> — $904M → est. $980M — because balances outgrow the rate drag.',
          mech:[ {k:'NIM', v:'1.88% → 1.85%', dir:'down'}, {k:'Balances', v:'credit +31% · margin +56%', dir:'up'}, {k:'⇒ NII', v:'still +14% YoY', dir:'up'} ],
          synth:'So the real question isn\'t the Fed — it\'s whether that balance growth is <b>organic and sticky</b>, or a rate-driven pull-forward that reverses. That\'s the one thing to disprove.'
        },
        detail:'<p>IBKR carries a <b>rate-cut discount</b> in its multiple — the bear assumes net interest income, its biggest revenue line, rolls over as the Fed eases.</p><p>But Bloomberg consensus itself already prices the opposite: NII <b>keeps growing</b> ($904M → $980M → $1,037M over the next three quarters) even as net interest margin compresses (1.88% → 1.85%), because <b>earning assets grow faster than the rate drag</b> — est. margin loans +56% YoY, credit balances +31%. The offset is the whole ballgame.</p>'
      },
      watchList:[
        { rank:1, metric:'Net interest income & the NIM crossover', bbg:'Consensus $980M (+14% YoY); NIM 1.85% (from 1.88%)', breaks:'NII falls YoY while credit balances still grow',
          pista:'Consensus already has NII <i>rising</i> ($904M→$980M) while NIM slips 1.88%→1.85% — i.e. the Street is not betting on rates, it\'s betting on balances. So the tell is simple: does NII grow YoY? If it does while the Fed eases, the rate-cut discount on the stock is the mispricing.',
          why:'NII is IBKR\'s largest revenue line and the entire valuation debate. NII up while rates fall = the offset works; NII down while balances still climb = the offset broke and the multiple is too high.',
          src:'A Bloomberg "Highlight" line + rate-sensitivity is the #1 recurring theme across the last 10 calls (management discloses the −25bps sensitivity every quarter).' },
        { rank:2, metric:'The earning-asset engine: credit balances · margin loans · customer equity', bbg:'Consensus credit bal $170B (+31%), margin loans $95B avg (+56%), equity $904B (+36%)', breaks:'Any of the three decelerates sharply or goes flat QoQ',
          pista:'These three lines ARE the NII engine — they are what make NII grow while NIM compresses. The one genuinely answerable question worth asking: how much of the growth is organic vs. rate/market-driven. If they dodge it, assume some is market-driven and therefore fragile.',
          why:'The offset in #1 is literally these three lines. That is why Bloomberg highlights all three. If they stall, NII rolls over next.',
          src:'Three separate Bloomberg "Highlight" lines (avg margin loans, avg credit balances, customer equity) — the vendor treats them as core drivers, not color.' },
        { rank:3, metric:'Customer account growth', bbg:'Consensus 5.15M accounts (+33% YoY)', breaks:'Growth decelerates below ~25% YoY, or a PDT-driven spike that looks one-off',
          pista:'Q2 is the first quarter after the PDT-rule change (eff. Jun 4), so a spike in small active accounts is expected. Don\'t be fooled by the headline number — the durable tell is the international mix; a US-only PDT bump that fades is a false positive.',
          why:'Accounts are the top of the flywheel — every downstream line depends on it, and management leads every call with it. A sharp decel is the earliest crack.',
          src:'A Bloomberg "Highlight" line + management\'s lead metric on every call; PDT (eff. Jun 4) makes Q2 the first read on the tailwind.' },
        { rank:4, metric:'DARTs → commissions (and commission per DART)', bbg:'Consensus DARTs 4.72M (+33%), commissions $672M (+30%); comm/DART ~$2.69', breaks:'DARTs up but commission-per-DART drops materially',
          pista:'Commission per cleared trade has held ~$2.65–2.83 for <b>two straight years</b> — that stability IS the pricing-power proof. So ignore the DART headline (it\'ll be up); the only thing that changes the story is commission-PER-DART cracking. If it finally slips, the "nobody can match our prices AND our margin" moat is weakening.',
          why:'DARTs are the activity engine; commissions lever to them. The clean test of pricing power is per-DART, not raw DARTs.',
          src:'Bloomberg tracks Avg Commission per DART explicitly; its two-year stability is the actual evidence on the "pricing pressure" worry (which analysts press LESS than expected).' },
        { rank:5, metric:'New-product optionality: ForecastEx · crypto · overnight', bbg:'No clean consensus line — qualitative', breaks:'ForecastEx volume plateaus, or a CFTC/sports ruling forces a pullback',
          pista:'This won\'t move the quarter — it is option value, ranked last on purpose. The only things that actually change the story are a first ForecastEx <i>revenue</i> disclosure (they\'ve never given one) or a CFTC/sports ruling. Until then, note it, don\'t trade on it.',
          why:'Cheap to monitor and asymmetric, but not a needle-mover yet.',
          src:'Recurring "new products" theme across the calls; no dedicated Bloomberg line, so explicitly the qualitative, lower-weight item.' },
      ],
      results:null, call:null
    },
    { q:'Q1 2026', status:'reported', date:'Apr 21, 2026',
      setup:{
        source:'Bloomberg (BST consensus)', asOf:'2026-04-21',
        consensus:{ adjEps:{v:0.61,yoy:null,unit:'$'}, adjNetRevUsdM:{v:1740,yoy:null,unit:'$M'} },
        pricedIn:'The debate going in was whether NII could stay near record as the Fed eased; the stock had run into the print, so the bar was high.',
        oneLiner:'Pre-call view: balance growth would keep NII resilient and DARTs would carry commissions — the risk was that a hot bar punishes anything short of a clean beat.'
      },
      watchList:[
        { rank:1, metric:'Net interest income', bbg:'hold near record', breaks:'NII down YoY with balances still growing', pista:'The rate-sensitivity crux — watch YoY direction.', why:'The rate-sensitivity crux.' },
        { rank:2, metric:'DARTs / commissions', bbg:'DARTs up double digits', breaks:'DARTs up but commission-per-DART drops', pista:'Watch per-DART, not raw DARTs.', why:'Monetization vs. raw activity.' },
        { rank:3, metric:'Net-new accounts', bbg:'record adds, +~30% YoY', breaks:'Sub-25% YoY', pista:'International mix is the durable part.', why:'Top of the flywheel.' },
      ],
      // Post-Results = the numbers (available first, ~before the call). Actuals: Bloomberg (reported).
      results:{
        headline:'Beat the business, missed the print — every operating line was strong, yet the stock fell because the two headline numbers (revenue, EPS) came in light.',
        scorecard:[
          { metric:'Net revenue', cons:'~$1.74B', actual:'$1,669M', result:'miss' },
          { metric:'Adj EPS', cons:'~$0.61', actual:'$0.60', result:'miss' },
          { metric:'Net interest income', cons:'hold record', actual:'$904M · +17% YoY', result:'beat' },
          { metric:'Commissions', cons:'follow DARTs', actual:'$613M · +19% (1st >$600M)', result:'beat' },
          { metric:'DARTs', cons:'up dbl digits', actual:'4.37M · +24% YoY', result:'beat' },
          { metric:'Client equity', cons:'compounding', actual:'$789.4B · +38% YoY', result:'beat' },
          { metric:'Pre-tax margin', cons:'high-70s', actual:'77.2%', result:'inline' },
          { metric:'Customer accounts', cons:'+~30% YoY', actual:'4.75M · +31% YoY', result:'inline' },
        ],
        thesisCheck:[
          { line:'NII falls YoY while balances grow', tripped:false, note:'NII +17% — the balance-offset is working.' },
          { line:'Commission-per-DART drops materially', tripped:false, note:'Held ~$2.69 — pricing power intact.' },
          { line:'Account growth below ~25% YoY', tripped:false, note:'+31% — flywheel intact.' },
        ],
        priceReaction:'Fell on the print (exact move to fill from a trusted source, not web).'
      },
      // Post-Call = insight-first highlights (theme by theme, depth in pop-ups) + the meeting take.
      call:{
        take:'Quietly strong quarter the tape hated for the <b>wrong reason</b>: the core thesis got confirmed (NII grew <b>+17% straight through the rate cuts</b>) while the headline missed on a non-core line. No red-line tripped — the dip is noise.',
        highlights:[
          { tag:'thesis', head:'The rate-cut fear is empirically wrong — NII grew <b>+17%</b> <i>through</i> the cuts',
            detail:'<p>NIM fell 2.02% → 1.88%, yet NII <b>rose</b> to $904M (+17% YoY) because credit balances (+35%) and margin loans (+35%) more than offset the rate drag.</p><p><b>Why it matters:</b> this is the single most important confirmation for the thesis. The whole valuation debate is "does NII survive the cuts?" — this quarter answered yes, and showed <i>how</i> (balances, not rates).</p>' },
          { tag:'curious', head:'Overnight trading quietly <b>tripled</b> — a detail mentioned almost in passing',
            detail:'<p>Overnight (24/5) volume went ~2.8M → 8.1M, nearly 3×. It barely got airtime on the call.</p><p><b>Connect the dots:</b> it lines up with Peterffy calling 24/5 a <b>"10–20 year secular trend"</b> — a slow-burn expansion of <i>when</i> and <i>what</i> a single account can trade. Not material to this quarter, but exactly the kind of one-mention detail that later becomes the story.</p>' },
          { tag:'dots', head:'The revenue "miss" was <b>optics, not the business</b>',
            detail:'<p>Headline net revenue came in light vs. the Street — but NII <b>and</b> commissions both <b>beat</b>. So the shortfall sat in a non-core line (other income / mark-to-market), not the engine.</p><p><b>The dot to connect:</b> the business beat, the print missed, and the stock fell on the wrong number. That gap between "operations" and "headline" is the whole reason to have read the call rather than the tape.</p>' },
          { tag:'watch', head:'Prediction markets got a notable <b>tonal upgrade</b> from Peterffy',
            detail:'<p>Peterffy called ForecastEx "potentially the biggest development in the business in a century" and flagged institutions now inquiring about membership.</p><p><b>Why watch:</b> still tiny financially, but the founder is leaning in hard. The tell for next quarter is whether those inquiries convert to actual members / disclosed revenue.</p>' },
          { tag:'watch', head:'The OCC trust-bank charter went <b>unmentioned</b> despite conditional approval',
            detail:'<p>A real, filed project (custody for mutual funds / ETFs) that had just cleared a conditional OCC hurdle — and it didn\'t come up on the call.</p><p><b>Silence is the tell:</b> a live project quietly dropping off the script is the cheapest signal nobody tracks. Put it on the list to ask directly next quarter.</p>' },
        ],
        dots:'<b>The story, in one thread:</b> NII grew through the cuts → the core thesis is intact; the "miss" was a non-core line, not the engine; and two slow-burn options (overnight trading, prediction markets) are quietly building under the surface. Net: nothing broke — the pullback is a gift <i>if</i> you believe the balances are durable.',
        newQuestions:['Which non-core revenue line came in below the Street despite record NII and commissions?','How much of account growth is PDT-rule pull-forward vs. organic?','Did the OCC charter and ForecastEx-institutional inquiries progress — or go quiet?']
      }
    }
  ],
  // Promise Tracker — separating what management is genuinely DOING from what it merely floated.
  // kind: 'project' = a committed, funded, active initiative · 'pipeline' = a stated expectation
  // (numbers management put out there) · 'musing' = "open to the possibility" only, NOT a commitment.
  // Only the first two are held to account; musings are shown to keep the distinction honest.
  promises:[
    { item:'OCC National Trust Bank charter', kind:'project', origin:'Q4 2024', status:'pending', lastMentioned:'not on the Q1 2026 call',
      note:'A real, filed initiative: applied Dec 2025; OCC preliminary conditional approval (~May 2026, batch of five); final approval pending conditions. NOT raised on the Q1 2026 call — watch for a go-live/first-custody update, or flag the quiet.' },
    { item:'ForecastEx / prediction markets', kind:'project', origin:'Q3 2024', status:'delivered', lastMentioned:'Q1 2026',
      note:'Live Aug 2024; 286M contract pairs in Q4 2025 (from 15M). Delivered and scaling — track the (still-undisclosed) revenue contribution.' },
    { item:'Crypto expansion (Coinbase derivatives, EEA)', kind:'project', origin:'2024–2025', status:'delivered', lastMentioned:'Q1 2026',
      note:'Coinbase-derivatives nano BTC/ETH perpetual-style futures (Feb 2026); EEA spot live; Zero Hash staking in progress.' },
    { item:'Prime brokerage / High-Touch Prime', kind:'project', origin:'Q1 2024', status:'delivered', lastMentioned:'~Q3 2025 (quiet since)',
      note:'Launched 2024; Preqin #4 prime broker. No fresh traction data on the Q1 2026 call — a soft silence; worth asking for updated fund count / balances.' },
    { item:'Introducing-broker pipeline ("~two dozen firms")', kind:'pipeline', origin:'Q2 2024', status:'pending', lastMentioned:'~Q2 2025',
      note:'A stated expectation, not a signed book: HSBC WorldTrader is live; management cited ~two dozen more "in progress" + a UAE ~10k-account migration. It has never been reconciled to actual conversions — the cleanest accountability check on the list.' },
    { item:'Dividend policy (~0.5–1% of the stock price)', kind:'project', origin:'2011 / Q1 2025', status:'delivered', lastMentioned:'Q1 2026',
      note:'A standing commitment, delivered: $0.10/qtr (2011) → $0.25/qtr (Q1 2025) → 4-for-1 split (Jun 2025) → $0.35/yr (Q1 2026).' },
    { item:'European bank license (Ireland)', kind:'musing', origin:'~Q4 2024', status:'silent', lastMentioned:'~Q4 2024',
      note:'IMPORTANT: this was a passing mention alongside the OCC charter, NOT a confirmed application or funded project. Included only to keep the distinction honest — do not treat it as a live promise unless management re-commits.' },
  ]
};
function cpUpcoming(){ return CALL_PREP.quarters.filter(function(q){ return q.status==='upcoming'; })[0]||null; }
function cpReported(){ return CALL_PREP.quarters.filter(function(q){ return q.status==='reported'; }); }
function cpFill(x, muted){ return (x!=null && String(x).trim()!=='') ? x : '<span class="cp-empty">'+(muted||'— to fill')+'</span>'; }
var CP_STAT={ delivered:{c:'#0a8f4c',l:'Delivered'}, pending:{c:'#2E6BE6',l:'Pending'}, silent:{c:'#B7791F',l:'Silent'}, abandoned:{c:'#C0392B',l:'Abandoned'} };
var CP_KIND={ project:{c:'#0a8f4c',l:'Project'}, pipeline:{c:'#2E6BE6',l:'Pipeline'}, musing:{c:'#B7791F',l:'Musing only'} };
// Pop-up registry: keeps the on-screen cards terse and pushes the depth into a modal (wired by
// wireModal via data-detail="cp:<id>"). cpReg() registers content at render time and returns the id.
var CP_POP={};
function cpReg(id, t, h){ CP_POP[id]={t:t, h:h}; return id; }
// A small "?" info badge that opens a pop-up — for numbers that need context (structural changes,
// one-offs that distort the financials, etc.).
function cpQ(id, t, h){ return '<span class="cp-info ov-clickable" data-detail="cp:'+cpReg(id,t,h)+'" title="'+esc(String(t).replace(/<[^>]+>/g,''))+'">?</span>'; }

// Shared style for the Call Prep panes.
function cpStyle(){
  return '<style>.cp-note{font-size:11px;color:var(--mu);line-height:1.5;background:#F7F9FB;border:1px solid var(--bdr);border-radius:9px;padding:9px 12px;margin:0 0 12px}'+
    '.cp-empty{color:var(--mu);font-style:italic;opacity:.7}'+
    '.cp-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:4px 0}@media(max-width:640px){.cp-grid4{grid-template-columns:1fr 1fr}}'+
    '.cp-cell{border:1px solid var(--bdr);border-top:3px solid '+BLUE+';border-radius:10px;padding:11px 13px;background:var(--w)}'+
    '.cp-cell-k{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--mu)}.cp-cell-v{font-size:15px;font-weight:800;color:var(--navy);margin-top:3px;line-height:1.2}'+
    '.cp-banner{border:1px solid var(--bdr);border-left:4px solid '+BRAND+';border-radius:11px;padding:13px 15px;background:linear-gradient(180deg,rgba(214,0,28,0.05),transparent);font-size:12.5px;line-height:1.6;color:var(--navy);margin:12px 0}'+
    '.cp-react{display:flex;flex-direction:column;gap:7px}'+
    '.cp-react-row{display:grid;grid-template-columns:70px 1fr;gap:10px;align-items:center}'+
    '.cp-react-q{font-size:11px;font-weight:800;color:var(--navy)}'+
    '.cp-react-bar{display:flex;align-items:center;gap:8px}.cp-react-chip{font-size:10.5px;font-weight:800;border-radius:20px;padding:2px 9px;white-space:nowrap}'+
    '.cp-react-why{font-size:11px;color:var(--mu);line-height:1.4}'+
    /* watch list */
    '.cp-watch{display:flex;flex-direction:column;gap:11px}'+
    '.cp-w{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w);position:relative}'+
    '.cp-w-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}'+
    '.cp-w-rank{width:26px;height:26px;border-radius:50%;background:'+BRAND+';color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex:none}'+
    '.cp-w-metric{font-size:13.5px;font-weight:800;color:var(--navy)}'+
    '.cp-w-eb{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:8px 0}@media(max-width:520px){.cp-w-eb{grid-template-columns:1fr}}'+
    '.cp-w-e,.cp-w-b{border-radius:9px;padding:8px 11px;font-size:11.5px;line-height:1.4}'+
    '.cp-w-e{background:rgba(10,143,76,0.08);border:1px solid rgba(10,143,76,0.28)}.cp-w-b{background:rgba(214,0,28,0.06);border:1px solid rgba(214,0,28,0.28)}'+
    '.cp-w-lab{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;display:block;margin-bottom:2px}'+
    '.cp-w-e .cp-w-lab{color:#0a8f4c}.cp-w-b .cp-w-lab{color:'+BRAND+'}'+
    '.cp-w-q{display:flex;gap:8px;align-items:flex-start;background:#10141A;color:#fff;border-radius:9px;padding:9px 12px;font-size:11.5px;line-height:1.5;margin-top:8px}.cp-w-q .mic{flex:none}'+
    '.cp-w-src{font-size:10.5px;color:var(--navy);line-height:1.5;background:rgba(46,107,230,0.07);border-left:3px solid '+BLUE+';border-radius:7px;padding:7px 10px;margin-bottom:8px}'+
    '.cp-w-why{font-size:11px;color:var(--mu);line-height:1.5;margin-top:7px}'+
    '.cp-kind{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;border-radius:20px;padding:2px 8px;white-space:nowrap;border:1px solid}'+
    '.cp-phase{display:inline-block;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#fff;border-radius:20px;padding:3px 10px;margin-bottom:8px}'+
    /* "?" info badge */
    '.cp-info{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border-radius:50%;background:'+AMBER+';color:#fff;font-size:10px;font-weight:800;cursor:pointer;margin-left:5px;vertical-align:middle;flex:none}'+
    '.cp-info:hover{filter:brightness(1.1)}'+
    /* the debate — visual contrast */
    '.cp-debate{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin:4px 0}@media(max-width:600px){.cp-debate{grid-template-columns:1fr}}'+
    '.cp-dc{border:1px solid var(--bdr);border-radius:12px;padding:13px 15px;background:var(--w)}'+
    '.cp-dc.fear{border-top:4px solid '+BRAND+';background:linear-gradient(180deg,rgba(214,0,28,0.04),transparent)}'+
    '.cp-dc.real{border-top:4px solid '+BRAND2+';background:linear-gradient(180deg,rgba(10,143,76,0.05),transparent)}'+
    '.cp-dc-h{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}'+
    '.cp-dc.fear .cp-dc-h{color:'+BRAND+'}.cp-dc.real .cp-dc-h{color:'+BRAND2+'}'+
    '.cp-dc-b{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.cp-mech{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:12px 0}'+
    '.cp-mech-chip{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:800;border:1px solid var(--bdr);border-radius:9px;padding:7px 12px;background:var(--w);color:var(--navy)}'+
    '.cp-mech-ar{font-size:15px;color:var(--mu)}'+
    '.cp-synth{border-left:4px solid var(--navy);background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:6px 0}.cp-synth b{color:#FFD9DE}'+
    /* watch card — terser */
    '.cp-why-btn{display:inline-block;font-size:10px;font-weight:800;color:'+BLUE+';cursor:pointer;margin-top:8px}'+
    '.cp-w-chips{display:flex;gap:7px;flex-wrap:wrap;margin:6px 0 0}'+
    '.cp-w-chip{font-size:10px;font-weight:700;border-radius:7px;padding:4px 9px;line-height:1.3}'+
    '.cp-w-chip.cons{background:rgba(46,107,230,0.08);border:1px solid rgba(46,107,230,0.28);color:var(--navy)}'+
    '.cp-w-chip.red{background:rgba(214,0,28,0.06);border:1px solid rgba(214,0,28,0.28);color:var(--navy)}'+
    '.cp-w-chip b{font-weight:800}'+
    /* post-call highlights */
    '.cp-take{border-left:4px solid '+BRAND+';background:#10141A;color:#fff;border-radius:11px;padding:13px 16px;font-size:13px;font-weight:700;line-height:1.5;margin:2px 0 14px}.cp-take b{color:#FFD9DE}'+
    '.cp-hl{display:flex;flex-direction:column;gap:8px}'+
    '.cp-hl-row{display:grid;grid-template-columns:auto 1fr auto;gap:11px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--hc);border-radius:10px;padding:10px 13px;background:var(--w);cursor:pointer;transition:.12s}'+
    '.cp-hl-row:hover{box-shadow:0 3px 10px rgba(0,0,0,.08)}'+
    '.cp-hl-tag{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;background:var(--hc);border-radius:20px;padding:3px 9px;white-space:nowrap}'+
    '.cp-hl-head{font-size:12.5px;font-weight:700;color:var(--navy);line-height:1.4}'+
    '.cp-hl-more{font-size:15px;color:var(--hc);font-weight:800}'+
    '@media(max-width:560px){.cp-hl-row{grid-template-columns:auto 1fr}.cp-hl-more{display:none}}'+
    '.cp-dots{border:1px dashed '+BRAND+';border-radius:11px;padding:12px 15px;margin-top:14px;background:rgba(214,0,28,0.03);font-size:12px;line-height:1.6;color:var(--navy)}.cp-dots b{color:'+BRAND+'}'+
    /* post-results scorecard */
    '.cp-sc{display:flex;flex-direction:column;gap:6px}'+
    '.cp-sc-row{display:grid;grid-template-columns:1.1fr 1fr 1.2fr auto;gap:10px;align-items:center;border:1px solid var(--bdr);border-left:4px solid var(--sc);border-radius:9px;padding:8px 12px}'+
    '.cp-sc-m{font-size:12px;font-weight:800;color:var(--navy)}.cp-sc-c{font-size:11px;color:var(--mu)}.cp-sc-a{font-size:11.5px;font-weight:700;color:var(--navy)}'+
    '.cp-sc-v{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 10px;background:var(--sc);white-space:nowrap}'+
    '@media(max-width:600px){.cp-sc-row{grid-template-columns:1fr auto}.cp-sc-c,.cp-sc-a{display:none}}'+
    '.cp-tc{display:flex;flex-direction:column;gap:6px}'+
    '.cp-tc-row{display:flex;gap:9px;align-items:flex-start;font-size:11.5px;color:var(--navy);line-height:1.45;border:1px solid var(--bdr);border-radius:9px;padding:8px 11px}'+
    '.cp-concl{border:1px solid var(--bdr);border-top:4px solid '+BRAND+';border-radius:12px;padding:14px 16px;background:linear-gradient(180deg,rgba(214,0,28,0.04),transparent);font-size:12.5px;line-height:1.65;color:var(--navy)}'+
    /* tables */
    '.cp-tbl{width:100%;border-collapse:collapse;font-size:11.5px}'+
    '.cp-tbl th{text-align:left;color:var(--mu);font-weight:700;padding:7px 10px;border-bottom:1px solid var(--bdr);font-size:10.5px;text-transform:uppercase;letter-spacing:.03em}'+
    '.cp-tbl td{padding:9px 10px;border-bottom:1px solid var(--bdr);color:var(--navy);line-height:1.45;vertical-align:top}'+
    '.cp-pill{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:#fff;border-radius:20px;padding:2px 9px;white-space:nowrap}'+
    '.cp-an{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}'+
    '.cp-an-c{border:1px solid var(--bdr);border-radius:11px;padding:12px 14px;background:var(--w)}'+
    '.cp-an-n{font-size:12.5px;font-weight:800;color:var(--navy)}.cp-an-f{font-size:10.5px;color:var(--mu);font-weight:700}'+
    '.cp-an-q{font-size:11px;color:var(--navy);line-height:1.5;margin-top:6px}.cp-an-flag{font-size:9.5px;font-weight:800;color:'+AMBER+';margin-top:5px}</style>';
}
// A · The Setup ──────────────────────────────────────────────────────────────────────────────────
function cpFmtC(o){ if(!o||o.v==null) return '<span class="cp-empty">—</span>';
  var un=o.unit||'', v=o.v, s;
  if(un==='$') s='$'+v; else if(un==='$M') s='$'+v+'M'; else if(un==='$B') s='$'+v+'B';
  else if(un==='M') s=v+'M'; else if(un==='M/day') s=v+'M/day'; else if(un==='%') s=v+'%'; else s=String(v);
  return s+(o.yoy!=null?'<span style="font-size:10px;color:#0a8f4c;font-weight:800;margin-left:5px">+'+o.yoy+'%</span>':''); }
function cpSetupBody(c){
  var u=cpUpcoming(); var h=cpStyle();
  if(!u){ return h+'<div class="cp-note">No upcoming quarter staged.</div>'; }
  h+='<div class="cp-phase" style="background:'+BLUE+'">① Pre-Call</div>';
  h+='<p class="ov-lede"><b>'+esc(u.q)+' — the setup.</b> The numbers going in, and the <b>one debate</b> the print will settle. '+(u.date?('Reports <b>'+esc(u.date)+'</b>.'):'<span class="cp-empty">report date — to confirm</span>')+'</p>';
  var st=u.setup||{}, cons=st.consensus||{};
  function cCell(key,k,o){ var q=(o&&o.note)?cpQ('setnote-'+key, o.note.t, o.note.h):''; return '<div class="cp-cell"><div class="cp-cell-k">'+esc(k)+q+'</div><div class="cp-cell-v">'+cpFmtC(o)+'</div></div>'; }
  h+='<div class="ov-diagram-cap" style="margin:6px 0 4px"><b>Bloomberg consensus (BST)</b>'+(st.source?' · <span style="color:var(--mu);font-weight:600;font-size:10px">'+esc(st.source)+(st.asOf?' · as of '+esc(st.asOf):'')+'</span>':'')+'</div>';
  h+='<div class="cp-grid4">'+cCell('eps','Adj EPS',cons.adjEps)+cCell('rev','Adj net revenue',cons.adjNetRevUsdM)+cCell('nii','Net interest income',cons.niiUsdM)+cCell('darts','DARTs',cons.dartsM)+'</div>';
  h+='<div class="cp-grid4" style="margin-top:10px">'+cCell('acct','Customer accounts',cons.accountsM)+cCell('eq','Customer equity',cons.custEquityBn)+cCell('cb','Credit balances (avg)',cons.creditBalAvgBn)+cCell('ptm','Pre-tax margin',cons.preTaxMarginPct)+'</div>';
  h+='<div class="ave-subh-note" style="margin-top:4px">Green = YoY. Bloomberg (BST) consensus, hardcoded from the team\'s export. <b>?</b> = a number with a caveat worth knowing.</div>';
  // ── The one debate — as a picture, not paragraphs ──
  var d=st.debate;
  if(d){
    var det=st.detail?cpReg('setdetail', 'The one debate — in full', st.detail):null;
    h+='<div class="ov-diagram-cap" style="margin:16px 0 4px"><b>The one debate this print will settle</b>'+(det?' <span class="cp-why-btn ov-clickable" data-detail="cp:'+det+'">the full read ›</span>':'')+'</div>';
    h+='<div class="cp-debate">'+
      '<div class="cp-dc fear"><div class="cp-dc-h">What the tape fears</div><div class="cp-dc-b">'+d.fear+'</div></div>'+
      '<div class="cp-dc real"><div class="cp-dc-h">What consensus actually models</div><div class="cp-dc-b">'+d.real+'</div></div>'+
    '</div>';
    if(d.mech&&d.mech.length){
      h+='<div class="cp-mech">'+d.mech.map(function(m,i){ var ar=m.dir==='up'?'<span style="color:#0a8f4c">▲</span>':(m.dir==='down'?'<span style="color:'+BRAND+'">▼</span>':''); return (i>0?'<span class="cp-mech-ar">→</span>':'')+'<span class="cp-mech-chip">'+ar+' '+esc(m.k)+' <span style="color:var(--mu);font-weight:700">'+esc(m.v)+'</span></span>'; }).join('')+'</div>';
    }
    if(d.synth) h+='<div class="cp-synth">'+d.synth+'</div>';
  }
  h+='<div class="ov-foot">Frozen at call time; scored against Post-Results / Post-Call.</div>';
  return h;
}
// B · Watch List ─────────────────────────────────────────────────────────────────────────────────
function cpWatchBody(c){
  var u=cpUpcoming(); var h=cpStyle();
  if(!u){ return h+'<div class="cp-note">No upcoming quarter staged.</div>'; }
  h+='<div class="cp-phase" style="background:'+BLUE+'">① Pre-Call</div>';
  h+='<p class="ov-lede"><b>Five things to hunt — '+esc(u.q)+'</b>, ranked by <b>how much they move the stock × how debated they are</b>. Each = a metric, its consensus, the red-line that breaks the thesis, and <b>the tell</b> (🔎) — a standing read for what to watch. Tap <b>why ›</b> for the grounding.</p>';
  h+='<div class="cp-watch">'+(u.watchList||[]).map(function(w){
    var why=(w.src||w.why)?cpReg('watchwhy-'+(w.rank||0), esc(w.metric), (w.src?'<p><b>Why it\'s on the list:</b> '+w.src+'</p>':'')+(w.why?'<p><b>Why it matters:</b> '+w.why+'</p>':'')):null;
    return '<div class="cp-w"><div class="cp-w-top"><div class="cp-w-rank">'+(w.rank||'')+'</div><div class="cp-w-metric">'+esc(w.metric)+'</div>'+(why?'<span class="cp-why-btn ov-clickable" data-detail="cp:'+why+'" style="margin:0">why ›</span>':'')+'</div>'+
      '<div class="cp-w-q"><span class="mic">🔎</span><span>'+cpFill(w.pista||w.question)+'</span></div>'+
      '<div class="cp-w-chips">'+
        (w.bbg?'<span class="cp-w-chip cons"><b>Cons:</b> '+esc(w.bbg)+'</span>':'')+
        (w.breaks?'<span class="cp-w-chip red"><b>Breaks if:</b> '+esc(w.breaks)+'</span>':'')+
      '</div>'+
    '</div>';
  }).join('')+'</div>';
  h+='<div class="ov-foot">Frozen once the quarter opens; scored against Post-Results / Post-Call.</div>';
  return h;
}
// C · Promise Tracker ────────────────────────────────────────────────────────────────────────────
function cpPromisesBody(c){
  var h=cpStyle();
  h+='<div class="cp-phase" style="background:'+BLUE+'">① Pre-Call</div>';
  h+='<p class="ov-lede"><b>What management is genuinely doing — vs. what it merely floated.</b> The discipline here is separating a <b>real, committed project</b> from a passing <i>"we\'re open to it."</i> Only the first is held to account. And <b>silence is the cheapest signal to detect</b>: a real project that quietly stops being mentioned is often the tell.</p>';
  h+='<div style="display:flex;gap:12px;flex-wrap:wrap;margin:0 0 12px">'+Object.keys(CP_KIND).map(function(k){ var kk=CP_KIND[k]; return '<span style="display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;color:var(--navy)"><span class="cp-kind" style="color:'+kk.c+';border-color:'+kk.c+'">'+kk.l+'</span></span>'; }).join('')+'<span style="font-size:10.5px;color:var(--mu)">Project = committed/funded · Pipeline = stated expectation · Musing = open-to-possibility, not a promise</span></div>';
  h+='<div style="overflow-x:auto"><table class="cp-tbl"><thead><tr><th>Item</th><th>Type</th><th>Status</th><th>Last mentioned</th><th>Note</th></tr></thead><tbody>'+
    (CALL_PREP.promises||[]).map(function(p){ var s=CP_STAT[p.status]||{c:'#6b7684',l:p.status}; var k=CP_KIND[p.kind]||{c:'#6b7684',l:p.kind||''};
      return '<tr><td style="font-weight:700">'+esc(p.item)+' <span style="font-weight:600;color:var(--mu);font-size:10px">· since '+esc(p.origin||'')+'</span></td>'+
        '<td><span class="cp-kind" style="color:'+k.c+';border-color:'+k.c+'">'+esc(k.l)+'</span></td>'+
        '<td><span class="cp-pill" style="background:'+s.c+'">'+esc(s.l)+'</span></td>'+
        '<td>'+cpFill(p.lastMentioned,'—')+'</td><td style="color:var(--mu)">'+esc(p.note||'')+'</td></tr>';
    }).join('')+'</tbody></table></div>';
  h+='<div class="ov-callout" style="margin-top:12px"><b>Two things to press tonight:</b> (1) the <b>introducing-broker pipeline</b> ("~two dozen firms") has never been reconciled to actual signed conversions — ask for the count. (2) The <b>OCC trust-bank charter</b> (a real, filed project) went unmentioned on the last call despite conditional approval — ask for a go-live. The <b>European bank license</b> is flagged a <i>musing</i>, not a promise, on purpose — don\'t hold them to it unless they re-commit.</div>';
  h+='<div class="ov-foot">Type & status are an editorial read of the earnings-call/filing record; updated each quarter.</div>';
  return h;
}
var CP_RES={ beat:{c:'#0a8f4c',l:'Beat'}, miss:{c:BRAND,l:'Miss'}, inline:{c:'#6b7684',l:'In line'} };
var CP_HLTAG={ thesis:{c:'#0a8f4c',l:'Thesis'}, curious:{c:'#7A5AF8',l:'Curious'}, dots:{c:'#2E6BE6',l:'Connects dots'}, watch:{c:'#B7791F',l:'Watch'}, tone:{c:'#B7791F',l:'Tone'} };
// D · Post-Results ── the numbers (available first, before/without the call): a beat/miss scorecard.
function cpResultsBody(c){
  var h=cpStyle();
  h+='<div class="cp-phase" style="background:'+BRAND2+'">② Post-Results</div>';
  h+='<p class="ov-lede"><b>The numbers vs. Bloomberg consensus.</b> Results land first (release ~4pm, call comes later) — so this is the read on the <b>print itself</b>, before management says a word: what beat, what missed, and whether any thesis red-line tripped.</p>';
  var rep=cpReported().filter(function(q){ return q.results; });
  if(!rep.length){ h+='<div class="cp-note">Empty until the print lands. After results, fill <code>results.scorecard</code> and <code>results.thesisCheck</code> for the quarter.</div>'; return h; }
  rep.forEach(function(q){ var r=q.results;
    h+='<div style="border:1px solid var(--bdr);border-radius:12px;padding:14px 16px;margin-bottom:14px;background:var(--w)">';
    h+='<div style="font-size:13.5px;font-weight:800;color:var(--navy);margin-bottom:8px">'+esc(q.q)+' <span style="font-weight:600;color:var(--mu);font-size:11px">· reported '+esc(q.date||'')+'</span></div>';
    if(r.headline) h+='<div class="cp-take" style="border-left-color:'+BRAND2+'">🎯 '+r.headline+'</div>';
    if(r.scorecard&&r.scorecard.length){
      var qkey=(q.q||'').replace(/\s/g,'');
      h+='<div class="cp-sc">'+r.scorecard.map(function(d,i){ var rr=CP_RES[d.result]||CP_RES.inline;
        var qb=d.note?cpQ('resnote-'+qkey+'-'+i, d.note.t||'Context', d.note.h||d.note):'';
        return '<div class="cp-sc-row" style="--sc:'+rr.c+'"><div class="cp-sc-m">'+esc(d.metric)+qb+'</div><div class="cp-sc-c">cons: '+cpFill(d.cons,'—')+'</div><div class="cp-sc-a">'+esc(d.actual||'')+'</div><div class="cp-sc-v">'+rr.l+'</div></div>';
      }).join('')+'</div>';
    }
    if(r.thesisCheck&&r.thesisCheck.length){
      h+='<div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);margin:14px 0 6px">Thesis red-line check</div>';
      h+='<div class="cp-tc">'+r.thesisCheck.map(function(t){ var col=t.tripped?BRAND:'#0a8f4c'; var ic=t.tripped?'⚑ TRIPPED':'✓ held';
        return '<div class="cp-tc-row" style="border-left:3px solid '+col+'"><span style="font-weight:800;color:'+col+';white-space:nowrap">'+ic+'</span><span><b>'+esc(t.line)+'</b> — '+esc(t.note||'')+'</span></div>';
      }).join('')+'</div>';
    }
    h+='<div style="margin-top:10px;font-size:11.5px;color:var(--navy)"><b>Price reaction:</b> '+cpFill(r.priceReaction,'to fill from a trusted source')+'</div>';
    h+='</div>';
  });
  h+='<div class="ov-foot">Scored against the frozen Watch List. Consensus = Bloomberg export; actuals = reported (Bloomberg).</div>';
  return h;
}
// E · Post-Call ── insight-first highlights (theme by theme, depth in pop-ups) + the meeting take.
function cpCallBody(c){
  var h=cpStyle();
  h+='<div class="cp-phase" style="background:'+BRAND+'">③ Post-Call</div>';
  h+='<p class="ov-lede"><b>Not a restatement of the numbers — the story behind them.</b> Theme by theme: what the print/call <i>implied</i> for the thesis, the curious one-mention details, and the dots that connect. Tap any highlight for the depth.</p>';
  var rep=cpReported().filter(function(q){ return q.call; });
  if(!rep.length){ h+='<div class="cp-note">Empty until the call/transcript is in. After the call, fill <code>call.take</code> (the one-line meeting take), <code>call.highlights</code> (theme-by-theme, each with a pop-up detail) and <code>call.dots</code> (connect the story).</div>'; return h; }
  rep.forEach(function(q){ var cc=q.call;
    h+='<div style="margin-bottom:18px">';
    h+='<div style="font-size:13.5px;font-weight:800;color:var(--navy);margin-bottom:8px">'+esc(q.q)+' <span style="font-weight:600;color:var(--mu);font-size:11px">· call '+esc(q.date||'')+'</span></div>';
    if(cc.take) h+='<div class="cp-take">🎯 '+cc.take+'</div>';
    if(cc.highlights&&cc.highlights.length){
      h+='<div class="cp-hl">'+cc.highlights.map(function(x,i){ var tg=CP_HLTAG[x.tag]||{c:'#6b7684',l:x.tag||''};
        var id=x.detail?cpReg('hl-'+(q.q||'').replace(/\s/g,'')+'-'+i, tg.l+' — '+String(x.head).replace(/<[^>]+>/g,''), x.detail):null;
        return '<div class="cp-hl-row" style="--hc:'+tg.c+'"'+(id?' data-detail="cp:'+id+'"':'')+'><span class="cp-hl-tag">'+esc(tg.l)+'</span><span class="cp-hl-head">'+x.head+'</span>'+(id?'<span class="cp-hl-more">＋</span>':'<span></span>')+'</div>';
      }).join('')+'</div>';
    }
    if(cc.dots) h+='<div class="cp-dots">🧩 '+cc.dots+'</div>';
    if(cc.newQuestions&&cc.newQuestions.length){
      h+='<div style="margin-top:12px"><div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;color:var(--mu);margin-bottom:4px">➡ Seeds next quarter\'s Watch List</div><ul class="ov-bullets" style="margin-top:2px">'+cc.newQuestions.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul></div>';
    }
    h+='</div>';
  });
  h+='<div class="ov-foot">Insight-first, not fact-first. Append-only — prior quarters are never overwritten; <code>newQuestions</code> feeds the next Watch List.</div>';
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
      '<button type="button" class="dd-tab" data-dd="callprep">Call Prep</button>'+
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
        '<button type="button" class="ovt-subtab" data-ovst="regulation">Regulation & Safety</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="margins">Margins</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="unit">'+unitEconBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="rates" hidden>'+rateSensBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="regulation" hidden>'+regBody(c)+'</div>'+
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
  h+='<div class="dd-pane" data-dd="callprep" hidden>'+
      '<div class="cp-note" style="margin-bottom:12px">🎯 <b>Call Prep</b> — the decision layer, in three phases: <b>① Pre-Call</b> (go in ready — Setup · Watch List · Promises) → <b>② Post-Results</b> (react to the numbers, which land before the call) → <b>③ Post-Call</b> (what management said + the meeting take). Append-only per quarter, so it becomes a record of how well we read IBKR.</div>'+
      '<div class="ovt-subtabs">'+
        '<button type="button" class="ovt-subtab active" data-ovst="setup">Setup</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="watch">Watch List</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="promises">Promise Tracker</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="results">Post-Results</button>'+
        '<button type="button" class="ovt-subtab" data-ovst="postcall">Post-Call</button>'+
      '</div>'+
      '<div class="ovt-subpane" data-ovst="setup">'+cpSetupBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="watch" hidden>'+cpWatchBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="promises" hidden>'+cpPromisesBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="results" hidden>'+cpResultsBody(c)+'</div>'+
      '<div class="ovt-subpane" data-ovst="postcall" hidden>'+cpCallBody(c)+'</div>'+
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
// Pre-tax margin evolution — the star chart of the Margins section (skips the null FY22 point).
function buildMargin(){
  var cv=document.getElementById('ibkrChartMargin'); if(!cv||typeof Chart==='undefined'||!cv.offsetParent) return;
  destroy('ibkrChartMargin');
  _charts['ibkrChartMargin']=new Chart(cv.getContext('2d'),{ type:'line',
    data:{ labels:FIN_SERIES.years, datasets:[{ label:'Pre-tax margin (%)', data:FIN_SERIES.ptMargin, borderColor:BRAND, backgroundColor:'rgba(214,0,28,0.10)', borderWidth:2.5, tension:.25, fill:true, pointRadius:4, pointBackgroundColor:BRAND, spanGaps:true }] },
    options:{ responsive:true, maintainAspectRatio:false, animation:false,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(ctx){ return ' '+ctx.parsed.y+'% pre-tax margin'; } } } },
      scales:{ x:{ grid:{display:false}, ticks:{font:{size:10.5}} }, y:{ suggestedMin:60, suggestedMax:80, ticks:{ callback:function(v){ return v+'%'; }, font:{size:9} }, grid:{color:'#EEF2F7'} } } }
  });
}

// ═══ Sub-tab + Deep Dive tab machinery (copied from the standardized contract) ═══════════════════
function buildSub(root, group, key){
  if(group==='topline'){
    if(key==='segments') buildAccounts();
    else if(key==='industry') wireScatters(root);
  } else if(group==='bottomline'){
    if(key==='margins'){ buildMargin(); buildFinancials(); }
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
    public:{t:'IBKR Group Inc — the public company', h:'<p>The publicly-traded holding company. Its Class A stock is what trades on NASDAQ. Crucially, IBKR Group Inc owns only <b>26.3% of the operating company (IBG LLC)</b> (445.6M of 1,696.4M membership interests at Dec 31, 2025) — so the "market cap" you see on a quote screen reflects <b>only this slice</b> (the public float), not the whole enterprise.</p><p>It consolidates 100% of IBG LLC for accounting, with the 73.7% it does not own shown as a large <b>non-controlling interest</b>.</p>'},
    holdings:{t:'IBG Holdings — Peterffy & insiders', h:'<p>The private vehicle through which <b>Thomas Peterffy</b>, management and employees hold <b>73.7%</b> of the economic membership interests of IBG LLC. Its single Class B share carries <b>73.7% of the vote</b> — but note: Class B votes on an <b>as-converted basis</b>, so this is <i>proportional to economics, not a super-voting share.</b></p><p>Peterffy controls this bloc through his indirect ownership of Holdings, which is why IBKR is <b>founder-controlled</b> — even though he owns just 1.40% of Class A directly. These interests convert into public shares over time, gradually shifting the split toward the public.</p>'},
    opco:{t:'IBG LLC — the operating company', h:'<p>The actual business — the broker that earns ~$6B of revenue at ~77% pre-tax margins. Both IBKR Group Inc (26.3%) and IBG Holdings (73.7%) own membership interests of it.</p><p><b>Why it matters:</b> (1) quoted market cap = only the 26.3% public slice; (2) EPS is reported "<b>comprehensive diluted</b>" — as-if all IBG interests converted — so it already reflects the full 100% economic base; (3) the income-tax note splits <b>public company vs operating company</b> because IBG LLC is largely a pass-through and only IBKR Group Inc\'s 26.3% slice bears full corporate tax.</p>'},
  };
  var ARENA={
    auto:{t:'Automation / cost — IBKR leads', h:'The entire moat. IBKR is the <b>lowest-cost, most-automated</b> broker, which produces ~77% pre-tax margins no rival approaches. Automation lets it undercut on price while still out-earning everyone on margin — and headcount stays ~flat as accounts grow ~30%+.'},
    global:{t:'Global market access — IBKR leads', h:'150+ markets across 40 countries and 29 currencies from a single account. No US discount broker (Schwab, Fidelity) offers this breadth — it is a genuine structural advantage for globally-minded and institutional traders.'},
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
    if(kind==='cp'){ return CP_POP[id]||null; }
    if(kind==='guide'){ var gd=IBKR_GUIDE.filter(function(x){return x.id===id;})[0]; return gd?{t:gd.ic+' '+esc(gd.k),h:gd.d}:null; }
    if(kind==='reg'){ var rg=IBKR_REG.filter(function(x){return x.id===id;})[0]; return rg?{t:rg.ic+' '+esc(rg.t),h:rg.d}:null; }
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
  wireSubtabs(root,'topline'); wireSubtabs(root,'bottomline'); wireSubtabs(root,'evolution'); wireSubtabs(root,'valuation'); wireSubtabs(root,'mgmt'); wireSubtabs(root,'callprep');
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
  // ── Peer scatter: render + wire every instance under root (Overview + Deep Dive stay in sync) ──
  wireScatters(root);
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
