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

// Neutral ordinal ramp used where colour must encode the QUARTER rather than the
// company (the single all-companies chart, and the cost-stack bars). Validated
// with --ordinal on white: monotone L, adjacent ΔL ≥ .06, light end 2.13:1.
// Deliberately NOT any company's hue, so a quarter step never impersonates a firm.
//
// WHY: putting company (hue) and quarter (lightness) in one frame was tested twice
// and fails both ways. White-tinted company ramps collapse the four hues into each
// other (normal-vision ΔE 6–14 vs a floor of 15); the shipped OKLCH ramps are worse
// under CVD — AMZN blue vs MSFT violet measure ΔE 0.1–0.3 under deuteranopia at
// EVERY step. So in the combined chart colour carries the quarter only, and company
// identity is carried by position plus a coloured ticker label.
export var HS_NEUTRAL_RAMP = ['#A6B3C2', '#7E8FA2', '#57697D', '#354658'];

// ── 5 · CAPACITY & COST PER GIGAWATT ──────────────────────────────────────────
// SOURCE: `hyperscalers/Hyperscalers Capex GW.xlsx` (Summit model, sheets AMZN /
// META / UE / Appendix) — NOT the transcripts. This is the one block on the
// dashboard that comes from our own build rather than company disclosure, so it
// is labelled as such throughout.
//
// The model works backwards from reported gross PP&E additions: it splits capex
// into the buckets a data centre actually consists of, applies an intra-year
// timing adjustment, and divides by a cost-per-GW to infer how much capacity each
// year of spend bought. Only Amazon and Meta are modelled.
// SOURCE UPGRADE: these now come from `CapEx D&A DCFs.xlsx` — the CapEx/D&A tabs
// that sit inside the live Amazon, Alphabet and Meta DCFs — rather than the
// standalone capacity workbook. That swap buys three things: Alphabet (absent
// from the capacity file entirely), a 2028E column, and the current capex
// vintage. The DCF has Amazon 2026 at $221.5B, i.e. the raised ~$220B guide;
// the capacity workbook still carried $205B, the February number.
//
// ⚠ The two workbooks therefore disagree, and the DCF is the one to trust:
//   Amazon 2026  6.52 GW (DCF) vs 6.03 GW (capacity file)
//   Meta   2025  1.87 GW (DCF) vs 2.05 GW (capacity file)
// The Meta gap is not a capex difference — both use $69.7B for 2025 — but a
// different cost-per-GW/split assumption between the two builds. Worth
// reconciling in the model before either number is quoted externally.
export var HS_GW_YEARS = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E', '2027E', '2028E'];

export var HS_GW_ADDS = {
  amzn:  [0.395,  0.4961, 1.181,  1.7963, 1.8726, 1.5514, 2.442,  3.8784, 6.5157, 8.1446, 10.1808],
  googl: [0.5247, 0.4915, 0.4651, 0.5143, 0.6572, 0.6732, 1.0965, 1.9087, 4.2553, 5.4271, 6.7839],
  meta:  [0.3749, 0.4049, 0.4053, 0.4995, 0.8428, 0.7311, 0.999,  1.8687, 3.888,  4.4712, 5.1419],
};

// The same GW split by which spend bucket funded it: the shell and everything
// bolted to it, versus the silicon that goes inside.
export var HS_GW_SPLIT = {
  amzn:  { infra: [0.1242, 0.156,  0.3714, 0.5648, 0.5888, 0.4878, 0.7679, 1.2196, 2.0489, 2.5611, 3.2013],
           chips: [0.2708, 0.3401, 0.8097, 1.2315, 1.2837, 1.0636, 1.6741, 2.6588, 4.4668, 5.5836, 6.9795] },
  googl: { infra: [0.1171, 0.1096, 0.1037, 0.1147, 0.1466, 0.1502, 0.2446, 0.4258, 0.9492, 1.2107, 1.5133],
           chips: [0.4077, 0.3819, 0.3613, 0.3996, 0.5106, 0.523,  0.8519, 1.4829, 3.306,  4.2165, 5.2706] },
  meta:  { infra: [0.1074, 0.116,  0.1161, 0.1431, 0.2415, 0.2095, 0.2863, 0.5355, 1.1142, 1.2813, 1.4735],
           chips: [0.2674, 0.2889, 0.2891, 0.3563, 0.6013, 0.5216, 0.7127, 1.3332, 2.7738, 3.1899, 3.6684] },
};

// What one gigawatt costs, per the model. The headline: the building is roughly
// a third, the silicon roughly two-thirds.
export var HS_GW_COST = {
  perMW: [
    { k: 'Electrical',      v: 4.50 },
    { k: 'Mechanical',      v: 2.75 },
    { k: 'Interior fit-out', v: 1.75 },
    { k: 'Building shell',  v: 1.50 },
    { k: 'Land',            v: 0.1875 },
  ],
  infraPerMW: 10.6875,   // US$M per MW
  infraPerGW: 10.6875,   // US$B per GW (same number, three orders up)
  totalPerGW: 35.0,      // US$B
  chipsPerGW: 24.3125,   // US$B
  gpuUnit: 40000,        // US$ per accelerator
  chipCount: 607813,     // accelerators per GW at that unit cost
  racks: 8442,           // 72-GPU racks per GW
};

// Reference GPU pricing behind the $40k unit assumption (Appendix sheet).
export var HS_GPU_PRICES = [
  { m: 'Blackwell B200', a: 'Blackwell', p: '$45–50k', s: '192GB HBM3e' },
  { m: 'Hopper H200',    a: 'Hopper',    p: '$35–40k', s: '141GB HBM3e' },
  { m: 'Blackwell B100', a: 'Blackwell', p: '$30–35k', s: 'Entry-level AI' },
  { m: 'Hopper H100',    a: 'Hopper',    p: '$25–30k', s: '80GB HBM3' },
];

// Each company's assumed accelerator mix, and what it implies for power draw and
// silicon cost per GW. Meta's mix is both hungrier per chip and dearer.
export var HS_CHIP_MIX = {
  amzn: { rows: [['Trainium', 0.40, 0.70, 11000], ['Inferentia2', 0.35, 0.15, 5500], ['Blackwell H200', 0.25, 0.70, 22000]],
          wKW: 0.5075, wCost: 11825, costPerGW: 23.30, chipsPerGW: 1970443 },
  meta: { rows: [['MTIA', 0.15, 0.10, 7000], ['AMD MI300X', 0.325, 0.75, 12500], ['Blackwell H100', 0.525, 0.70, 18000]],
          wKW: 0.6262, wCost: 14562.5, costPerGW: 23.25, chipsPerGW: 1596806 },
};

// The bridge the model actually solves: capex ÷ cost-per-GW = GW added.
export var HS_GW_BRIDGE = {
  amzn: { gw26: 6.0315, gw27: 7.5394, owned: 1.00, capexPerGW: 33.99, total26: 205, total27: 256.25,
    split: [['Servers & networking', 167.68, 0.818], ['Heavy equipment', 16.59, 0.0809],
            ['Other equipment', 10.56, 0.0515], ['Construction in progress', 9.05, 0.0441],
            ['Land', 1.13, 0.0055]] },
  meta: { gw26: 4.2721, gw27: 4.9129, owned: 0.4578, capexPerGW: 33.94, total26: 145, total27: 166.75,
    split: [['Servers & network assets', 99.34, 0.6851], ['Finance lease ROU assets', 20.70, 0.05],
            ['Construction in progress', 11.74, 0.0809], ['Equipment & other', 8.80, 0.0607],
            ['Leasehold improvements', 4.05, 0.028], ['Buildings', 0.33, 0.09], ['Land', 0.04, 0.0053]] },
};

// ⚠ Model QA, surfaced rather than buried: on the Meta split the dollar column
// and the percentage column disagree on three lines. Servers, equipment,
// leasehold and CIP all tie to % × $145B, but Land ($37M vs an implied $769M),
// Buildings ($330M vs an implied $13.1B) and Finance-lease ROU ($20.7B vs an
// implied $7.3B) do not. The dollars still sum to $145.0B, so the total is
// intact and only the mix within it is affected.
export var HS_GW_MODEL_FLAG =
  'On Meta’s bucket split the dollar and percentage columns disagree on three lines — Land, Buildings and Finance-lease ROU assets. The dollars total $145.0B correctly, so the capex-to-GW bridge holds; only the internal mix is in question. Worth a look before this drives anything downstream.';

// What the companies themselves have said about capacity, in their own words.
// This is the transcript side of the same question — deliberately kept separate
// from the model numbers above.
export var HS_CAPACITY_QUOTES = [
  { id: 'amzn', when: "Oct '25", q: 'Added more than <b>3.8 GW of power in the past 12 months</b>, more than any other cloud provider — with at least another 1 GW expected in Q4, and a plan to <b>double overall capacity by the end of 2027</b>.' },
  { id: 'amzn', when: "Feb '26", q: '<b>3.99 GW added over the last 12 months</b> — “twice what we had in 2022, when we were an $80 billion annual run-rate business”. 1.2 GW came in Q4 alone. In 2025 AWS added more data-centre capacity than any other company in the world.' },
  { id: 'msft', when: "Jul '25", q: 'Stood up <b>more than 2 GW of new capacity over the past 12 months</b>. Every Azure region is now AI-first and supports liquid cooling, which raises fleet fungibility.' },
  { id: 'msft', when: "Oct '25", q: 'Will <b>increase total AI capacity by over 80% this year</b> and roughly <b>double the total data-centre footprint over the next two years</b>. Fairwater in Wisconsin alone scales to 2 GW.' },
  { id: 'msft', when: "Jan '26", q: 'Added <b>nearly 1 GW in the quarter alone</b>. Maia 200 comes online at 10+ petaflops FP4 and 30%+ better TCO than the latest hardware already in the fleet.' },
  { id: 'msft', when: "Jul '26", q: 'Another gigawatt added, still on track to roughly double capacity in two years — and <b>dock-to-live times for new GPUs cut by nearly 50%</b> in the largest regions.' },
  { id: 'meta', when: "Jan '25", q: 'Expects to bring <b>almost a gigawatt online in 2025</b>, and is building a 2 GW-plus site “so big it would cover a significant part of Manhattan”.' },
  { id: 'meta', when: "Jul '25", q: 'Prometheus (1 GW+) lands in 2026; <b>Hyperion scales to 5 GW</b> over several years, with more Titan clusters in development.' },
  { id: 'meta', when: "Apr '26", q: 'Rolling out <b>more than 1 GW of its own custom silicon</b> developed with Broadcom, plus significant AMD volume alongside the new NVIDIA systems.' },
  { id: 'googl', when: "Oct '24", q: 'The first corporate agreement to buy nuclear power from <b>multiple small modular reactors — up to 500 MW</b> of 24/7 carbon-free power. Google reports the most efficient PUE in the industry but does not disclose GW added.' },
];

// ── 6 · THE DEPRECIATION WAVE ─────────────────────────────────────────────────
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

// ── 5b · THE CLOUD SEGMENTS (CSPs) ────────────────────────────────────────────
// SOURCE: quarterly segment financials supplied by SAB (Q4'19 → Q4'25), extended
// with the two most recent quarters where the figure was stated in dollars on
// the call. This block does NOT use the 10-quarter call axis the rest of the
// dashboard runs on — it has its own 27-quarter history, which is the point:
// the cloud segments have a pre-AI past worth seeing.
//
// ⚠ CORRECTION vs the first build of this tab: Microsoft is INTELLIGENT CLOUD,
// the reported segment, not "Microsoft Cloud". Microsoft Cloud is a non-GAAP
// cross-segment revenue metric (Azure + M365 commercial + Dynamics + LinkedIn
// commercial) that carries a large SaaS book and has no segment operating
// income. Intelligent Cloud is the reportable segment — Azure plus server
// products and Enterprise Services — and it DOES have a disclosed operating
// income. Microsoft's segments were restated in FY2025, so the series here is
// on the restated ("post-FY2024") basis and starts at Q3'22.
//
// Still not a like-for-like across the three: Google Cloud is GCP + Workspace,
// AWS is pure infrastructure and platform, Intelligent Cloud adds on-prem
// server products and Enterprise Services to Azure. Closer than before, but
// read the slopes.
export var HS_CSP_QTRS = [
  "Q4'19", "Q1'20", "Q2'20", "Q3'20", "Q4'20", "Q1'21", "Q2'21", "Q3'21", "Q4'21",
  "Q1'22", "Q2'22", "Q3'22", "Q4'22", "Q1'23", "Q2'23", "Q3'23", "Q4'23",
  "Q1'24", "Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25", "Q4'25",
  "Q1'26", "Q2'26",
];

// US$M. null = not reported on this basis / not yet in the dataset.
export var HS_CSP_REV = {
  googl: [2614, 2777, 3007, 3444, 3831, 4047, 4628, 4990, 5541, 5821, 6276, 6868, 7315,
          7454, 8031, 8411, 9192, 9574, 10347, 11353, 11955, 12260, 13624, 15157, 17664,
          20000, 24800],
  amzn:  [9954, 10219, 10808, 11601, 12742, 13503, 14809, 16110, 17780, 18441, 19739, 20538, 21378,
          21354, 22140, 23059, 24204, 25037, 26281, 27452, 28786, 29267, 30873, 33006, 35579,
          null, 42203],
  msft:  [null, null, null, null, null, null, null, null, null, null, null, 16885, 17926,
          18244, 19889, 20013, 21525, 22141, 23785, 24092, 25544, 26751, 29878, 30897, 32907,
          34700, null],
};

export var HS_CSP_OI = {
  googl: [-1194, -1730, -1426, -1208, -1243, -974, -591, -644, -890, -706, -590, -440, -186,
          191, 395, 266, 864, 900, 1172, 1947, 2093, 2177, 2826, 3594, 5313,
          6600, 8800],
  amzn:  [2596, 3075, 3357, 3535, 3564, 4163, 4193, 4883, 5293, 6518, 5715, 5403, 5205,
          5123, 5365, 6976, 7167, 9421, 9334, 10447, 10632, 11547, 10160, 11434, 12465,
          14200, 16600],
  msft:  [null, null, null, null, null, null, null, null, null, null, null, 6750, 6727,
          7017, 7917, 8908, 9555, 9515, 9835, 10503, 10851, 11095, 12140, 13391, 13873,
          null, null],
};

// Which of the appended Q1'26 / Q2'26 points are derived rather than stated.
// AWS Q2'26 revenue is the stated 36.7% growth applied to Q2'25; AWS gives an
// annualised run rate, never a quarterly revenue figure, so there is no direct
// print to use. Everything before Q1'26 comes from SAB's dataset.
// The margin at that quarter inherits the derivation, since it divides by it.
export var HS_CSP_DERIVED = { amzn: { rev: [26], opMargin: [26] } };

export var HS_CSP_NOTES = [
  'Google Cloud lost money every quarter until 1Q23 — <b>$1.7B of operating loss in a single quarter in 2020</b>. It now earns $8.8B a quarter. That swing, not the revenue line, is the reason Alphabet can defend its CapEx most easily of the three.',
  'Google Cloud operating margin went from <b>9.0% to 35.6%</b> in nine quarters while revenue growth <i>accelerated</i> from 28% to 82%. Expanding margin and accelerating growth together is rare.',
  'AWS margin peaked at a record <b>39.5% in 1Q25</b> then fell to 32.9% the next quarter — roughly half seasonal stock comp, the rest depreciation on the AI fleet. Growth troughed at 17% in mid-2025 and reached 36.7% by 2Q26.',
  'Intelligent Cloud is the steadiest of the three: margin has sat in a <b>39–43%</b> band for three years while revenue roughly doubled. It also carries on-prem server products and Enterprise Services, so it is not a pure cloud read.',
  'On absolute operating dollars AWS is still ahead — but Google Cloud has closed the quarterly gap from <b>$8.5B in 1Q24 to $7.8B in 2Q26</b> while growing off a base a third the size. AWS’s Q2’26 margin looks like a jump to 39%, but it divides by a derived revenue figure and should be treated as indicative until Amazon prints the quarter.',
];


// ── 6b · THE MODELLED DEPRECIATION TRAJECTORY ─────────────────────────────────
// From the CapEx/D&A tabs inside the live DCFs (`CapEx D&A DCFs.xlsx`). PP&E
// depreciation only — not total D&A. Microsoft has no tab in this workbook.
//
// The 2023-25 column ties to the filings for all three (Alphabet $21,136M for
// 2025 is exactly the $21.1B Anat gave on the 4Q25 call; Amazon $41,900M and
// Meta $18,000M both tie to the 10-K), which is the check that makes the
// forward columns worth reading. Pre-2023 Alphabet diverges from its 10-K line
// because the model tracks PP&E only while the filed figure carries more, so
// the series starts at 2023.
export var HS_DEP_YEARS = ['2023', '2024', '2025', '2026E', '2027E', '2028E'];
export var HS_DEP_MODEL = {   // US$M
  amzn:  [30200, 32100, 41900, 61943, 88085, 120771],
  googl: [11946, 15311, 21136, 31649, 49931, 73953],
  meta:  [11020, 15290, 18000, 28341, 42479, 58850],
};

// Alphabet is the only one where the model also carries the P&L pressure ratio.
export var HS_DEP_COGS = { id: 'googl', years: ['2023', '2024', '2025', '2026E', '2027E', '2028E'],
  pct: [8.96, 10.47, 13.00, 17.05, 22.27, 27.54] };

// ── 6c · USEFUL-LIFE MAP ──────────────────────────────────────────────────────
// What each company depreciates over what, and how the assumption has moved.
// ⚠ THE BUCKETS ARE NOT COMPARABLE. Alphabet's 13-year "technical
// infrastructure" is a BLENDED life over servers and data-centre together;
// Amazon's 5.7 years covers servers and networking ALONE, with its buildings on
// a separate 40-year line. Reading 13 against 5.7 as "Alphabet depreciates
// slower" is the single easiest mistake to make with this table.
export var HS_LIVES = {
  amzn: [
    { a: 'Servers & networking', now: 5.7,  hist: '4.0 (2018–19) → 4.5 (2020–21) → 5.5 (2022–23) → 6.0 (2024) → 5.7 (2025–28E)' },
    { a: 'Heavy equipment',      now: 11.5, hist: '10.0 through 2024 → 11.5 (2025–28E)' },
    { a: 'Other equipment',      now: 6.5,  hist: '5.0 (2018–19) → 6.5 thereafter' },
    { a: 'Buildings',            now: 40,   hist: 'Unchanged at 40 across the whole history' },
  ],
  googl: [
    { a: 'Technical infrastructure', now: 13,   hist: 'Unchanged at 13 — blended over servers AND data centre' },
    { a: 'Office space',             now: 23.5, hist: 'Unchanged at 23.5' },
    { a: 'Corporate & other',        now: 13.5, hist: 'Unchanged at 13.5' },
  ],
  meta: [
    { a: 'Servers & network assets', now: 5.5,  hist: '4.25 (2018–19) → 4.0 (2020) → 4.5 (2021–24) → 5.5 (2025–28E)' },
    { a: 'Buildings',                now: 27.5, hist: 'Unchanged at 27.5' },
    { a: 'Leasehold improvements',   now: 11,   hist: 'Unchanged at 11' },
    { a: 'Equipment & other',        now: 8,    hist: '3.0 (2018–19) → 8.0 thereafter' },
    { a: 'Finance lease ROU',        now: 9,    hist: 'Unchanged at 9' },
  ],
};

export var HS_DEP_NOTES = [
  { id: 'meta', head: 'Direction only, no figure',
    body: 'Meta has flagged infrastructure as the single largest driver of expense growth two years running, and in 2Q25 warned of "a sharp acceleration in depreciation expense growth in 2026" from assets bought and placed in service that year. It has never put a number on the line.' },
  { id: 'amzn', head: 'Visible only through AWS margin',
    body: 'Amazon discloses depreciation as a margin headwind rather than a figure — "AWS margins also saw headwinds from higher depreciation expense" (2Q25). Its useful-life changes, which move this line directly, are in the Accounting tab.' },
  { id: 'msft', head: 'The consequence, not the cause',
    body: 'Microsoft Cloud gross margin has fallen every year of the build-out, and management attributes it to "scaling our AI infrastructure" each time. Reading it as the depreciation line is an inference — a real one, but the dollars are never disclosed.' },
];

