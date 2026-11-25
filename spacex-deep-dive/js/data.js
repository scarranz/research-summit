/* ═════════════ DATA — frozen, nothing is fetched ═════════════
   Company figures are checked against the primary documents: SpaceX Q3 2026 earnings release (Oct 20 2026), Q3 2026
   10-Q (filed Oct 22 2026), Q2 2026 10-Q (filed Aug 4 2026), 424B4 prospectus (Jun 12 2026) and the Q2 and Q3 2026 call
   transcripts. Sell-side figures name the bank and date where they are used. $ millions unless stated. */

const ASOF = 'Sep 30 2026';

/* Income statement, nine months to Sep 30 (Q3 2026 release) */
const IS9M = {
  rev:    { conn:[8159, 12796], si:[2278, 10939], space:[3277, 3348], total:[13714, 27083] },
  opinc:  { conn:[3147, 5211],  si:[-4182, -3295], space:[-181, -1211], total:[-1216, 705] },
  net:[-2590, -413], netAttrib:[-2590, -1084],
  cfo:[4120, 13097], capex:[-13846, -48069], fcf:[-9726, -34972],
  da:[4784, 8934], sbc:[1044, 3833], sharesAvg:[2915, 7274]          // sbc incl. acquisitions; shares = basic average, M
};

/* Shares outstanding (cover of each filing) and net cash (cash + securities − debt and finance leases), .
   IPO as-adjusted (424B4) · Q2 10-Q (Jun 30 balance sheet, cover Aug 4 2026) · Q3 10-Q (Sep 30 balance sheet, cover Oct 15 2026). */
const CAP = { ipo:{ shares:13075.9, netCash:67858 }, q2:{ shares:13181.8, netCash:60645, date:'Aug 4 2026' }, q3:{ shares:13581.1, netCash:51011, date:'Oct 15 2026' } };

/* Q3 2026 alone — what the headline hid */
const Q3 = { net:4404, otherIncome:1025, interestIncome:873, taxCredit:390, relatedPartyOther:561 };

/* Balance sheet, Sep 30 2026 */
const BS = { cash:51294, securities:38561, liquidity:89855, debt:38844, debtRelated:12897, goodwill:48423, deficit:-37448, deferredRev:17520,
             interest9M:1968, interestRelated9M:864 };

/* Sources and uses of cash, 9M 2026 */
const FUND = [
  ['IPO (Jun 2026, net)', 85675], ['New debt', 51834], ['Operating cash flow', 13097], ['Share issuance', 8319],
  ['Debt repaid', -39845], ['Capex', -48069], ['Buybacks', -4426], ['Early-repayment premium', -1153]
];

/* Runway inputs [rev. 17-nov]: 4Q26 capex guide midpoint (company), liquidity left at YE26 (Clear Street),
   TTM FCF (Cestrian), net cash Sep 30 and its Q3 fall (10-Qs: 60,645 → 51,011). fixed2027 = 2027 non-cancellable
   commitments at Sep 30 2026 (Q3 10-Q, Commitments: 25,569; was 21,476 at Dec 31 2025 in the 424B4). They INCLUDE the EchoStar
   spectrum purchase (~19,600: ~11,100 in stock + up to ~8,500 of EchoStar debt payoff; closing expected Nov 2027, 424B4), so
   compute and other commitments are ~6,000 (our split). */
const RUN = { capex4Q:37500, liqYE26:65000, fcfTTM:-39200, netCashQ3:51011, netCashDropQ3:9634, fixed2027:25569, spectrum2027:19600, turbines:805,
              gwYE26:[2.5, 3], gwAdd27:10, ubsCostPerGW:27000 };

/* Connectivity (Starlink), 9M */
const CONN = { subs:[7.2, 13.6], arpu:[84, 67], arpuQ3:69, consumerRev:[5198, 7754], entGovRev:[2961, 5042], ebitda:[5123, 8183],
               sats:11100, markets:174, planesEquipped:3800, planesContracted:12000, backlogEntGov:24000, gmQ3:0.55, tariffPts:3 };

/* Space segment */
const SPACE = { launches:[128, 113], customer:[36, 29], internal:[92, 84], massT:[1627, 1517], ebitda:[803, -199], ebitdaQ3:357,
                starshipRD:[2069, 3231], faaCap:[5, 25], q3Launches:35, q3LaunchesCS:46 };

/* Starship cost ladder — Deutsche Bank estimates, Jul 2026 (not disclosures) */
const LADDER = [
  { k:'Expendable ship',        cost:52, t:65,  kg:4421 },
  { k:'Partial reuse',          cost:30, t:85,  kg:359 },
  { k:'Full reuse',             cost:16, t:100, kg:154 },
  { k:'Full & rapid reuse',     cost:7,  t:150, kg:53 }
];
const F9_KG = [['UBS', 1000], ['Barclays', 3182]];   // Falcon 9 today, $/kg — sources disagree
const ORBIT_KG_NEEDED = 100;                          // Clear Street, citing the S-1: orbital compute needs ~$100/kg (not found verbatim in the 424B4)

/* Orbital vs terrestrial cost of 1 GW — Deutsche Bank, Jul 2026 */
const ORB = [
  { k:'Today (Falcon 9)',        kg:1429, orbital:115, terr:20 },
  { k:'~2029 · partial reuse',   kg:359,  orbital:26,  terr:23 },
  { k:'~2032 · full reuse',      kg:154,  orbital:15,  terr:25 },
  { k:'Later · rapid reuse',     kg:53,   orbital:9,   terr:25 }
];
/* Other terrestrial cost views, $B per GW */
const TERR = { db:null, ubs:40, barclays:55, huang:100 };   // Barclays $50–60B → midpoint; Huang ~$100B (cited in DB footnote)

/* SI (AI / compute), 9M */
const SI = { gw:[0.6, 1.7], ads:[1323, 1248], infra:[955, 9691], total:[2278, 10939], rd:[3331, 7740], capex:[8077, 39995], ebitda:[-813, 5490],
             backlog:63000, backlog12m:42000, rpoJun:47500, topClientShareQ2:0.195, custB3Q:0.345, custB9M:0.242, custA3Q:0.166, guide1Q27:[33000, 37000] };
const CONTRACTS = [
  { k:'Anthropic',     perMonth:1250, mw:480,  gpus:'~325k GPUs', end:'May 2029', src:'424B4' },
  { k:'Google',        perMonth:920,  mw:null, gpus:'~110k GPUs', end:'Jun 2029', src:'Needham, Deutsche Bank' },
  { k:'Reflection AI', perMonth:150,  mw:null, gpus:'GB300s (DB est. 15–20k)', end:'Multi-year', src:'Needham, Deutsche Bank' }
];
/* $M per MW per year */
const PERMW = [['SpaceX · Anthropic', 31], ['SpaceX · Google', 50], ['Other neoclouds', 10.5], ['DB normalised (post-Vera Rubin)', 10]];

/* Defense */
const DEF = { obligFY25:1800, oblig9M26:5900 };
const DEF_CONTRACTS = [
  ['Starshield IDIQ', 13000, 'Pre-approved ceiling, not a purchase commitment'],
  ['Space-Based AMTI', 4160, 'Air moving-target tracking'],
  ['Golden Dome space interceptor', 3200, 'With partners'],
  ['Space Data Network Backbone', 2290, 'Secure LEO data transport for Golden Dome; prototype by end-2027'],
  ['NRO classified constellation', 1800, 'Approximate; limited detail'],
  ['NSSL Phase 3 Lane 1', 1600, '18 Falcon 9 launches']
];

/* Sell-side */
const STREET = [
  { b:'J.P. Morgan',  d:'Jul 7 → Oct 21 2026', r:'Overweight',  pt:500, prev:240, m:'~20× 2028E GAAP EPS (~$25); $225 Jul → $240 Aug → $500 Oct', c:'IPO manager/co-manager; investment-banking client' },
  { b:'UBS',          d:'Jul 7 2026',          r:'Buy',         pt:210, bull:275, bear:120, m:'SOTP 2028E: Space 24× rev, Connectivity 30× EBITDA, AI 28× EBITDA', c:'IPO co-manager' },
  { b:'Needham',      d:'Jul 7 2026',          r:'Buy',         pt:200, m:'SOTP 2028E ≈ 15× EV/sales on $164B; $1T revenue in 2031', c:'IPO co-manager' },
  { b:'Clear Street', d:'Jul 7 → Oct 21 2026', r:'Buy',         pt:248, prev:217, m:'SOTP 2030E: Connectivity 20× EBITDA, SI 15× rev, Space 10× rev', c:'Banker to SpaceX (and ASTS)' },
  { b:'Wells Fargo',  d:'Aug 30 / Sep 28 2026',r:'Overweight',  pt:212, prev:230, m:'30× 2028E EPS (~$7.1)', c:'IPO co-manager, "significant financial interest"' },
  { b:'Deutsche Bank',d:'Jul 7 2026',          r:'—',           pt:255, m:'Orbital compute economics, Starship cost ladder', c:'Same-day initiation (Jul 7)' },
  { b:'Mizuho',       d:'Jul 7 2026',          r:'—',           pt:200, bear:122, m:'Starlink ~76% of satellite broadband in 2030', c:'Same-day initiation (Jul 7)' }
];
