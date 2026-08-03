// overviews/hyperscalers-data.js — curated dataset for the Hyperscalers industry analysis.
//
// SOURCE OF RECORD: the earnings-call transcripts in `hyperscalers/` (gitignored —
// licensed PDFs + extracted .txt, 2023-10 → 2026-07). Every number below is either
//   • STATED  — said on a call, and `src` names which one, or
//   • DERIVED — arithmetic on stated numbers, flagged `d:true` and explained.
// Nothing here comes from outside the transcript corpus. Where a call stated no
// figure the value is `null` — NOT interpolated. Read the gaps as gaps.
//
// AXIS CONVENTION (per SAB): everything is on a CALENDAR basis so the four are
// comparable. Microsoft is the only fiscal-year reporter (FY ends 30 June), so its
// "FY26Q2" call lands in the Jan-2026 calendar column. That offset is surfaced in
// the UI, never silently absorbed.
//
// PALETTE: the four series colours were validated with the data-viz validator
// (light mode, #FFFFFF surface, all-pairs): worst CVD ΔE 9.2, worst normal-vision
// ΔE 16.3 — both clear. Note the portal accent #2563EB was REJECTED by the
// validator (ΔE 14.1 vs violet, below the 15 floor), which is why slot 1 is
// #2a78d6 and not the portal blue. Aqua (#1baf7a) sits at 2.82:1 on white, under
// the 3:1 bar, so the relief rule applies: the charts ship direct labels AND a
// table view. Do not re-order or substitute these without re-running the validator.

export var HS_COMPANIES = [
  { id: 'amzn',  ticker: 'AMZN',  name: 'Amazon',    color: '#2a78d6', fy: 'Calendar' },
  { id: 'googl', ticker: 'GOOGL', name: 'Alphabet',  color: '#eb6834', fy: 'Calendar' },
  { id: 'meta',  ticker: 'META',  name: 'Meta',      color: '#1baf7a', fy: 'Calendar' },
  { id: 'msft',  ticker: 'MSFT',  name: 'Microsoft', color: '#4a3aa7', fy: 'Fiscal Jun' },
];

// The calls, in calendar order. `msft` names the fiscal quarter that lands here.
export var HS_VINTAGES = [
  { key: '24q1', label: "Apr '24", calls: '1Q24', msft: 'FY24Q3' },
  { key: '24q2', label: "Jul '24", calls: '2Q24', msft: 'FY24Q4' },
  { key: '24q3', label: "Oct '24", calls: '3Q24', msft: 'FY25Q1' },
  { key: '24q4', label: "Jan '25", calls: '4Q24', msft: 'FY25Q2' },
  { key: '25q1', label: "Apr '25", calls: '1Q25', msft: 'FY25Q3' },
  { key: '25q2', label: "Jul '25", calls: '2Q25', msft: 'FY25Q4' },
  { key: '25q3', label: "Oct '25", calls: '3Q25', msft: 'FY26Q1' },
  { key: '25q4', label: "Jan '26", calls: '4Q25', msft: 'FY26Q2' },
  { key: '26q1', label: "Apr '26", calls: '1Q26', msft: 'FY26Q3' },
  { key: '26q2', label: "Jul '26", calls: '2Q26', msft: 'FY26Q4' },
];

// ── 1 · THE GUIDANCE LADDER ───────────────────────────────────────────────────
// For a given TARGET calendar year, what each company said that year's CapEx
// would be, on each call. Midpoint of the guided range, US$B. null = the call
// stated no full-year number (the line spans the gap; markers show statements).
export var HS_GUIDE = [
  {
    year: '2025',
    label: 'CY2025 CapEx',
    blurb: 'The first full year of the race. Nobody guided down. Alphabet raised three times and finished 22% above where it started.',
    series: {
      //        Apr24  Jul24  Oct24  Jan25  Apr25  Jul25  Oct25  Jan26  Apr26  Jul26
      googl: [  null,  null,  null,  75,    75,    85,    92,    null,  null,  null ],
      amzn:  [  null,  null,  null,  105,   null,  null,  125,   null,  null,  null ],
      meta:  [  null,  null,  null,  62.5,  68,    69,    71,    null,  null,  null ],
      msft:  [  null,  null,  null,  null,  null,  null,  null,  null,  null,  null ],
    },
    resolve: {
      googl: { first: 75,   last: 92,   actual: 91.4, src: 'Opening guide on the 4Q24 call ("approximately $75 billion"); $85B at 2Q25; $91–93B at 3Q25; the $91.4B actual was confirmed on the 4Q25 call.' },
      amzn:  { first: 105,  last: 125,  actual: 125,  d: true, src: 'The 4Q24 guide was not an annual number: Olsavsky gave "$26.3B a quarter… reasonably representative", which implies ~$105B (derived). The explicit annual figure ($125B) only arrived on the 3Q25 call.' },
      meta:  { first: 62.5, last: 71,   actual: 71,   src: 'Range $60–65B (4Q24) → $64–72B (1Q25) → $66–72B (2Q25) → $70–72B (3Q25). Midpoint plotted.' },
      msft:  { first: null, last: null, actual: 118,  d: true, src: 'Microsoft does not guide on a calendar year. The $118B is the SUM of its four stated calendar-2025 quarters ($21.4 + $24.2 + $34.9 + $37.5B), finance leases included. Derived, not stated.' },
    },
  },
  {
    year: '2026',
    label: 'CY2026 CapEx',
    blurb: 'The step change. All four raise again — and the only line that falls does so because of an accounting change, not less investment.',
    series: {
      //        Apr24  Jul24  Oct24  Jan25  Apr25  Jul25  Oct25  Jan26  Apr26  Jul26
      googl: [  null,  null,  null,  null,  null,  null,  null,  180,   185,   200  ],
      amzn:  [  null,  null,  null,  null,  null,  null,  null,  200,   null,  220  ],
      meta:  [  null,  null,  null,  null,  null,  null,  null,  125,   135,   137.5],
      msft:  [  null,  null,  null,  null,  null,  null,  null,  null,  190,   175  ],
    },
    resolve: {
      googl: { first: 180, last: 200, actual: null, src: '$175–185B (4Q25) → $180–190B (1Q26, now including Intersect) → $195–205B (2Q26). Midpoint plotted.' },
      amzn:  { first: 200, last: 220, actual: null, src: '"About $200 billion" (4Q25) → "approximately $220 billion" (2Q26). Jassy attributes the raise to higher memory cost.' },
      meta:  { first: 125, last: 137.5, actual: null, src: '$115–135B (4Q25) → $125–145B (1Q26) → $130–145B (2Q26, floor raised). Midpoint plotted.' },
      msft:  { first: 190, last: 175, actual: null, flag: 'accounting', src: '⚠ ~$190B (FY26Q3, including ~$25B of higher component pricing) → ~$175B (FY26Q4). The drop is NOT less investment: extending data-centre useful life from 15 to 25 years pushes more leases from finance to operating, and operating leases are not CapEx. Hood: "outside of this useful life impact, our calendar year 2026 CapEx investment expectations remain unchanged."' },
    },
  },
];

// ── 2 · REPORTED QUARTERLY CAPEX ──────────────────────────────────────────────
// US$B, as stated on that quarter's call. Definitions differ by company — see
// HS_BASIS. null = not stated on any call in the corpus.
export var HS_QUARTERLY = {
  googl: [12.0, null, 13.0, 14.0, 17.2, 22.4, 24.0, 27.9, 35.7, 44.9],
  amzn:  [14.0, null, null, 26.3, 24.3, 31.4, 34.2, null, 43.2, 53.1],
  meta:  [6.7,  8.5,  9.2,  14.8, null, 17.0, 19.4, 22.1, 19.8, 31.1],
  msft:  [14.0, 19.0, 20.0, 22.6, 21.4, 24.2, 34.9, 37.5, 31.9, 41.0],
};

// ── 2b · CALENDAR-YEAR CAPEX, SPLIT BY QUARTER ────────────────────────────────
// Same numbers as HS_QUARTERLY, regrouped into calendar years for the stacked
// view, plus the derivations needed to close a year.
//
// 2023 IS ABSENT ON PURPOSE. The corpus has no AMZN/GOOGL/META call before
// Apr-2024, so three of the four have zero 2023 quarters. Only Microsoft has any
// (3Q23 $11.2B, 4Q23 $11.5B). A 2023 column would be three empty bars.
//
// `d` marks a DERIVED quarter — arithmetic on figures stated on the calls:
//   AMZN 2Q24 = H1-24 CapEx $30.5B − 1Q24 $14.0B
//   AMZN 3Q24 = YTD-3Q24 $51.9B − H1 $30.5B  (⚠ the YTD figure is on Amazon's
//               "capital investments" basis and H1 on "CapEx" — same company,
//               slightly different wrappers; treat the split as indicative)
//   AMZN 4Q25 = FY25 ~$125B − YTD-3Q25 $89.9B
//   META 1Q25 = FY25 (final $70–72B guide, midpoint 71) − stated 2Q–4Q 58.5
// GOOGL 2Q24 is simply not in the corpus and cannot be derived — Alphabet never
// stated an FY2024 total on any call we hold. That bar is 3 of 4 quarters and
// is flagged in the UI rather than silently short.
export var HS_YEARS = ['2024', '2025', '2026'];

export var HS_YEAR_QTRS = {
  googl: { '2024': [12.0, null, 13.0, 14.0], '2025': [17.2, 22.4, 24.0, 27.9], '2026': [35.7, 44.9, null, null] },
  amzn:  { '2024': [14.0, 16.5, 21.4, 26.3], '2025': [24.3, 31.4, 34.2, 35.1], '2026': [43.2, 53.1, null, null] },
  meta:  { '2024': [6.7,  8.5,  9.2,  14.8], '2025': [12.5, 17.0, 19.4, 22.1], '2026': [19.8, 31.1, null, null] },
  msft:  { '2024': [14.0, 19.0, 20.0, 22.6], '2025': [21.4, 24.2, 34.9, 37.5], '2026': [31.9, 41.0, null, null] },
};

// true = that quarter is derived, not stated.
export var HS_YEAR_DERIVED = {
  googl: { '2024': [false, false, false, false], '2025': [false, false, false, false], '2026': [false, false, false, false] },
  amzn:  { '2024': [false, true,  true,  false], '2025': [false, false, false, true ], '2026': [false, false, false, false] },
  meta:  { '2024': [false, false, false, false], '2025': [true,  false, false, false], '2026': [false, false, false, false] },
  msft:  { '2024': [false, false, false, false], '2025': [false, false, false, false], '2026': [false, false, false, false] },
};

// Company-years where a quarter is missing and underivable — the bar understates.
export var HS_YEAR_PARTIAL = { googl: { '2024': '2Q24 never disclosed on any call in the corpus — this bar is 3 of 4 quarters.' } };

// Full-year guidance range as most recently stated, [lo, hi]; lo === hi for a
// point guide. null where the company gave no full-year number for that year.
export var HS_YEAR_GUIDE = {
  googl: { '2024': null,      '2025': [91, 93],   '2026': [195, 205] },
  amzn:  { '2024': [75, 75],  '2025': [125, 125], '2026': [220, 220] },
  meta:  { '2024': [38, 40],  '2025': [70, 72],   '2026': [130, 145] },
  msft:  { '2024': null,      '2025': null,       '2026': [175, 175] },
};

// Quarter ramps: one ordinal lightness ramp per company hue, Q1 lightest → Q4
// darkest. Generated in OKLCH at L = .76/.67/.58/.49 holding each base's chroma
// and hue, then validated with the data-viz validator in --ordinal mode: all
// four pass (monotone L, adjacent ΔL ≥ .06, light end ≥ 2:1 on white).
//
// WHY A RAMP PER COMPANY AND NOT ONE SHARED SET: encoding company (hue) AND
// quarter (lightness) in a single mark was tested and FAILS — tinting the four
// hues toward white collapses them into each other (worst normal-vision ΔE 6–14
// against a floor of 15). So the chart is faceted: one panel per company, where
// hue carries identity and lightness carries the quarter, and no two companies
// ever sit adjacent in the same frame.
export var HS_QTR_RAMP = {
  amzn:  ['#7bb4fe', '#4996f6', '#2c79d8', '#035eb9'],
  googl: ['#fe8e66', '#eb6834', '#cb4b0b', '#a33800'],
  meta:  ['#48cc95', '#1caf7a', '#009163', '#04724e'],
  msft:  ['#a7a6fe', '#8a83f7', '#7167d8', '#584cba'],
};

// Why these four series cannot be stacked without adjustment first.
export var HS_BASIS = [
  { id: 'googl', basis: 'Reported cash CapEx',
    note: 'Clean series. The Jul-24 gap is real: the 2Q24 call is not in the corpus.' },
  { id: 'amzn',  basis: 'Definition changes mid-series',
    note: '⚠ Through 2024 Amazon reported "capital investments" = CapEx + equipment finance leases. From 2025 it switches to "cash CapEx". The Jan-25 point ($26.3B) is on the old basis; 2025–26 are on the new one. Not the same series.' },
  { id: 'meta',  basis: 'CapEx incl. principal payments on finance leases',
    note: '⚠ Since the Blue Owl JV (Hyperion, Louisiana), data-centre construction cost no longer enters CapEx at all: Meta contributes 20% through other investing. The BlackRock JV (El Paso, 1 GW) follows the same structure. Reported CapEx understates the capacity Meta controls.' },
  { id: 'msft',  basis: 'CapEx including finance leases',
    note: '⚠ The gap between CapEx and "cash paid for PP&E" is the finance lease, recognised in full at commencement. From FY27 the useful-life extension pushes future leases to operating, which sit OUTSIDE reported CapEx (~$15B less in CY2026 with no change in investment).' },
];

// ── 3 · CONTRACTED BACKLOG ────────────────────────────────────────────────────
// US$B. Alphabet "Cloud backlog", Amazon "backlog", Microsoft "commercial RPO".
// Meta has none by design — it sells no contracted cloud capacity. That absence
// is a finding, not missing data.
export var HS_BACKLOG = {
  googl: [null, null, null, null, null, null, 155, 240, 462, 514],
  amzn:  [null, null, null, null, 189,  null, 200, 244, 364, 496],
  meta:  [null, null, null, null, null, null, null, null, null, null],
  msft:  [null, 269,  null, 298,  315,  368,  392,  625,  627,  678],
};

export var HS_BACKLOG_NOTES = [
  'Microsoft is the only one that publishes the concentration split: in FY26Q4 RPO grew <b>84% as reported but 25% excluding OpenAI</b>. They disclosed that themselves, unprompted.',
  'Of Alphabet’s $462B backlog in 1Q26, <b>$46B is TPU hardware agreements</b> rather than typical cloud contracts.',
  'Amazon: "multi-year, multi-gigawatt" commitments from Anthropic and OpenAI. Backlog went from $189B to $496B in five quarters.',
  'Meta has no backlog because it sells no contracted capacity — all of its CapEx is justified against internal return. It has the least external proof, and says so: Susan Li put GenAI "much, much earlier on the return curve", and gives no 2027 guide.',
];

// ── 4 · ACCOUNTING & USEFUL-LIFE CHANGES ──────────────────────────────────────
// Every change moves reported profit or reported CapEx in the favourable
// direction bar one. Chronological.
export var HS_ACCOUNTING = [
  { when: "Jan '24", who: 'amzn', what: 'Extends server useful life to 6 years',
    effect: '+', impact: '≈ +200bps to AWS margin year over year, repeated across all four quarters of 2024.' },
  { when: "Jan '25", who: 'meta', what: 'Extends server and networking useful life to ~5.5 years',
    effect: '+', impact: 'Savings in annual CapEx and depreciation; already embedded in the guide.' },
  { when: "Jan '25", who: 'amzn', what: 'Shortens a subset of servers and networking from 6 to 5 years',
    effect: '−', impact: '−$700M to 2025 operating income, plus a $920M early-retirement charge in 4Q24 and a further −$600M in 2025.' },
  { when: "Jan '25", who: 'amzn', what: 'Extends heavy fulfilment equipment from 10 to 13 years',
    effect: '+', impact: '+$900M to 2025 operating income — more than offsetting the server adjustment.' },
  { when: "Oct '25", who: 'meta', what: 'Blue Owl JV (Hyperion, Louisiana)',
    effect: '+', impact: 'Construction leaves reported CapEx; Meta contributes 20% via other investing.' },
  { when: "Jul '26", who: 'msft', what: 'Extends data centres and offices from 15 to 25 years (from FY27)',
    effect: '+', impact: '"Minimal" benefit to FY27 operating income — but it drags leases from finance to operating and cuts reported CY2026 CapEx from ~$190B to ~$175B.' },
  { when: "Jul '26", who: 'meta', what: 'BlackRock JV (El Paso, 1 GW)',
    effect: '+', impact: 'Same structure as Blue Owl. Meta: "multiple pathways to generate returns on invested capital".' },
];

// ── 5 · THE DEPRECIATION WAVE ─────────────────────────────────────────────────
// Disclosure here is deliberately asymmetric, and that asymmetry IS the finding:
// only Alphabet quantifies its depreciation line on the calls. Microsoft never
// gives the dollars but does report the margin the depreciation lands on. Meta
// and Amazon give neither — only direction. So this section pairs the one
// quantified series with the one visible consequence, and quotes the rest rather
// than inventing a fourth and fifth series.

// Alphabet — the only company that puts numbers on it. All stated on the calls.
export var HS_DEP_GOOGL = {
  fy: [
    { year: '2024', usd: 15.3, growth: 28, src: '4Q24 call: "In 2024, we saw 28% year-over-year growth in depreciation."' },
    { year: '2025', usd: 21.1, growth: 38, src: '4Q25 call: "depreciation increased by nearly $6 billion, or 38%, from $15.3 billion in 2024 to $21.1 billion in 2025."' },
  ],
  // Quarterly YoY growth of the depreciation line, as stated. Note the ramp.
  qtr: [
    { q: '1Q25', growth: 31, usd: null, src: '"about a 31% year-over-year growth in depreciation this quarter, and it will be higher as we go throughout the year."' },
    { q: '2Q25', growth: 35, usd: 5.0,  src: '"depreciation increased $1.3 billion year-over-year to $5 billion, reflecting a growth rate of 35%."' },
    { q: '3Q25', growth: 41, usd: 5.6,  src: '"depreciation increased $1.6 billion year-over-year to $5.6 billion, reflecting a growth rate of 41%."' },
  ],
  forward: 'For 2026 Alphabet expects the growth rate to "accelerate in Q1 and meaningfully increase for the full year" — no figure given.',
};

// Microsoft — never gives the depreciation dollars, but reports the gross margin
// the spend lands on every quarter. ACTUALS only (guides excluded so the series
// stays one kind of number); null = no absolute figure stated that quarter.
export var HS_MSFT_CLOUD_GM = [72, null, 71, null, 69, 68, 68, 67, 66, 65];

export var HS_DEP_NOTES = [
  { id: 'meta', head: 'Direction only, no figure',
    body: 'Meta has flagged infrastructure as the single largest driver of expense growth two years running, and in 2Q25 warned of "a sharp acceleration in depreciation expense growth in 2026" from assets bought and placed in service that year. It has never put a number on the line.' },
  { id: 'amzn', head: 'Visible only through AWS margin',
    body: 'Amazon discloses depreciation as a margin headwind rather than a figure — "AWS margins also saw headwinds from higher depreciation expense" (2Q25). Its useful-life changes, which move this line directly, are in the Accounting tab.' },
  { id: 'msft', head: 'The consequence, not the cause',
    body: 'Microsoft Cloud gross margin has fallen every year of the build-out, and management attributes it to "scaling our AI infrastructure" each time. Reading it as the depreciation line is an inference — a real one, but the dollars are never disclosed.' },
];

