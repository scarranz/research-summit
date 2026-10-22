// overviews/meta-comp-data.js — data for Meta Deep Dive ▸ Miscellaneous ▸ Competitive Position (MISC-comp, playbook §15b).
//
// Reported figures only (rule 10: no prices, market caps or multiples here). Extracted 2026-10-20.
//  · Company-wide revenue, operating income, capex (purchases of property and equipment) and R&D: SEC XBRL
//    companyfacts (data.sec.gov/api/xbrl/companyfacts), frame CY2025, each company’s FY2025 Form 10-K:
//      Meta 0001628280-26-003942 (filed 2026-01-29) · Alphabet 0001652044-26-000018 (2026-02-05) ·
//      Amazon 0001018724-26-000004 (2026-02-06; capex tag PaymentsToAcquireProductiveAssets) ·
//      Snap 0001564408-26-000013 (2026-02-05) · Pinterest 0001506293-26-000021 (2026-02-12) ·
//      Reddit 0001713445-26-000022 (2026-02-06) · AppLovin 0001751008-26-000010 (2026-02-19) ·
//      The Trade Desk 0001671933-26-000014 (2026-02-27).
//  · Advertising lines (Meta “Advertising”, Alphabet “Google advertising” / “Google Search & other” / “YouTube ads”,
//    Amazon “Advertising services”, Snap “Advertising revenue”), AppLovin capex (cash-flow statement, not tagged in
//    XBRL) and every user count: the text of the same 10-Ks.
//  · Challenges: Meta FY2025 10-K (Item 1, Item 1A, MD&A, Note on legal proceedings) and the earnings-call
//    records in docs/calls/META.md (Q3 2025, Q4 2025, Q1 2026) and docs/calls/META-latest.md (Q2 2026 —
//    reconstructed from press coverage, cross-checked against the 8-K Ex. 99.1; marked † on screen).
// Extraction script (outside the repo): scratchpad/comp/scripts/emit.py. Unknown = null (renders “—”), never estimated.

export var COMP_ASOF = 'FY2025 Form 10-Ks, extracted 2026-10-20';

// Each row: n = name · sub = true for a line inside a company · rl = which revenue line · rev = US$ M FY2025 ·
// g = % growth vs FY2024 · om = company-wide operating margin % · capex = US$ M (purchases of property and
// equipment, company-wide) · rd = R&D % of company revenue · u = users as the company reports them ·
// ud = the definition and date · vs = what it competes with Meta for (editorial, from the earlier profile).
export var COMP_ROWS = [
  { n:'Meta Platforms', tk:'META', src:'10-K FY2025, filed Jan 29 2026', me:true, rl:'Advertising', rev:196175, g:22.1, om:41.4, capex:69691, rd:28.5,
    u:'3.58B', ud:'DAP, Dec 2025 avg.', vs:'—' },
  { n:'Alphabet', tk:'GOOGL', src:'10-K FY2025, filed Feb 5 2026', rl:'Google advertising', rev:294691, g:11.4, om:32.0, capex:91447, rd:15.2,
    u:'—', ud:'no DAU/MAU; 7 products with 2B+ users', vs:'Search intent and video time' },
  { n:'Google Search & other', sub:true, src:'Alphabet 10-K FY2025', rl:'Segment line', rev:224532, g:13.4, om:null, capex:null, rd:null, u:'—', ud:'', vs:'Intent-based budgets' },
  { n:'YouTube ads', sub:true, src:'Alphabet 10-K FY2025', rl:'Segment line', rev:40367, g:11.7, om:null, capex:null, rd:null, u:'—', ud:'', vs:'Video time and brand budgets' },
  { n:'Amazon', tk:'AMZN', src:'10-K FY2025, filed Feb 6 2026', rl:'Advertising services', rev:68635, g:22.1, om:11.2, capex:131819, rd:null,
    u:'—', ud:'not disclosed', vs:'Purchase-intent budgets' },
  { n:'Snap', tk:'SNAP', src:'10-K FY2025, filed Feb 5 2026', rl:'Advertising revenue', rev:5186.1, g:5.8, om:-9.0, capex:219.0, rd:30.2,
    u:'474M', ud:'DAU, Q4 2025 avg.', vs:'Time among younger users' },
  { n:'Pinterest', tk:'PINS', src:'10-K FY2025, filed Feb 12 2026', rl:'Total revenue (substantially all advertising)', rev:4221.8, g:15.8, om:7.6, capex:32.4, rd:33.8,
    u:'619M', ud:'MAU, Dec 31 2025', vs:'Discovery and shopping budgets' },
  { n:'Reddit', tk:'RDDT', src:'10-K FY2025, filed Feb 6 2026', rl:'Total revenue (majority advertising)', rev:2202.5, g:69.4, om:20.1, capex:6.7, rd:35.6,
    u:'121.4M', ud:'DAUq, Q4 2025 avg.', vs:'Time and search-like intent' },
  { n:'AppLovin', tk:'APP', src:'10-K FY2025, filed Feb 19 2026', rl:'Total revenue (continuing operations; Apps business sold in 2025)', rev:5480.7, g:70.0, om:75.8, capex:0.5, rd:4.1,
    u:'—', ud:'not disclosed', vs:'Performance (app-install) budgets' },
  { n:'The Trade Desk', tk:'TTD', src:'10-K FY2025, filed Feb 27 2026', rl:'Total revenue (platform fees on client ad spend)', rev:2896.3, g:18.5, om:20.3, capex:197.0, rd:18.1,
    u:'—', ud:'not disclosed', vs:'Open-web programmatic budgets' },
  { n:'TikTok (ByteDance)', priv:true, src:'—', rl:'Private — no SEC filings', rev:null, g:null, om:null, capex:null, rd:null,
    u:'—', ud:'not disclosed in any filing', vs:'Short-video time' },
];

// The challenges to the moat. Each cell ≤ 2 sentences; d = dagger (uses the reconstructed Q2 2026 call record).
export var COMP_CHALLENGES = [
  { c:'Short video and TikTok — competition for time',
    real:'Meta’s 10-K says competing products “such as TikTok” have reduced some users’ engagement with its products.',
    holds:'Daily active people reached 3.58B in Dec 2025 (+7%). Instagram Reels watch time was up more than 30% year over year in the US in Q4 2025.',
    src:'10-K FY2025, Item 1A and MD&A key metrics; Q4 2025 call (Jan 28 2026)' },
  { c:'Apple and Google platform rules — signal loss (ATT)',
    real:'Apple’s 2021 iOS changes reduced Meta’s ability to target and measure ads and, per the 10-K, will keep weighing on marketer budgets. Apple limits others’ tracking while expanding its own ad business.',
    holds:'Advertising revenue grew 22% in 2025, with ad impressions +12% and average price per ad +9%. Meta’s own incremental-attribution model drove 24% more incremental conversions in Q4 2025.',
    src:'10-K FY2025, Item 1A and MD&A; Q4 2025 call' },
  { c:'Regulation and antitrust — EU DMA, FTC',
    real:'In Apr 2025 the European Commission ruled the “subscription for no ads” model breaches the DMA (EUR 200M fine); Meta calls its less-personalized ads “less relevant and effective”. The FTC appealed its antitrust loss on Jan 20 2026.',
    holds:'On Nov 18 2025 the court granted judgment in Meta’s favor in FTC v. Meta, a case that sought divestiture of Instagram and WhatsApp.',
    src:'10-K FY2025, Item 1A and legal-proceedings note' },
  { c:'AI changing discovery — assistants and frontier models',
    real:'The 10-K lists frontier AI models, alongside discovery and communication products, among the fields where Meta competes.',
    holds:'Meta AI had more than 1B monthly actives (Q3 2025). The GEM ads model and a new sequence model lifted Facebook ad clicks 3.5% and Instagram conversions more than 1% in Q4 2025.',
    src:'10-K FY2025, Item 1 (Competition); Q3 2025 call (Oct 29 2025); Q4 2025 call' },
  { c:'Capex intensity and its return',
    real:'Capex including finance-lease principal was $72.2B in 2025. The 2026 range went from $115–135B (10-K) to $125–145B (Q1 2026) and $130–145B (Q2 2026†).',
    holds:'The Family of Apps earned a 52% operating margin in 2025, and $115.8B of operating cash flow covered the year’s capex.',
    src:'10-K FY2025, MD&A (segments, liquidity); Q1 2026 call (Apr 29 2026); Q2 2026 call record†', d:true },
  { c:'Youth safety and legal liabilities',
    real:'Bellwether trials in the youth-related litigation are scheduled for 2026 and beyond, and the EU has open DSA proceedings on risks to minors. Q2 2026 results carried $2.40B of legal-proceedings charges†.',
    holds:'Q2 2026 revenue still grew 28%, with 3.6B daily active people†.',
    src:'10-K FY2025, Item 1A and legal-proceedings note; Q2 2026 earnings release (8-K Ex. 99.1) and call record†', d:true },
];

// The open-web split of $1.00 — an ILLUSTRATIVE industry breakdown (typical ad-tech take rates, from the Summit
// ad-ecosystem primer cited by the earlier profile), not a measured figure. Meta’s side is structural.
export var AD_SPLIT = [
  { k:'dsp',  l:'DSP (buy-side software)',   take:0.15 },
  { k:'exch', l:'Ad exchange (the auction)', take:0.10 },
  { k:'ssp',  l:'SSP (sell-side software)',  take:0.20 },
];
export var AD_PUB_KEEPS = 0.55;

// Market size. The first two bars are approximate, UNSOURCED sizing carried from the earlier profile (no
// primary document behind them); Meta’s bar is the 10-K figure.
export var TAM_ROWS = [
  { l:'Global advertising', v:'~$1T+', pct:100, src:null },
  { l:'Digital advertising', v:'~$750B+', pct:75, src:null },
  { l:'Meta advertising revenue, FY2025', v:'$196.2B', pct:19.6, src:'10-K FY2025' },
];
// Surfaces Meta has not sized in dollars — what it has disclosed about each.
export var TAM_NEW = [
  { s:'Business messaging', f:'Paid messaging on WhatsApp crossed a $2B annual run-rate in Q4 2025.', src:'Q4 2025 call' },
  { s:'Meta AI (assistant)', f:'More than 1B monthly actives use Meta AI.', src:'Q3 2025 call' },
  { s:'AI glasses', f:'Sales of Meta’s glasses more than tripled in 2025.', src:'Q4 2025 call' },
  { s:'Reality Labs', f:'2025 revenue $2.2B; operating loss $19.2B.', src:'10-K FY2025, segment results' },
];
