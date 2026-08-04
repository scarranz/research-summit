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
// year of spend bought.
//
// SOURCE: `CapEx D&A DCFs.xlsx` — the CapEx/D&A tabs that sit inside the live
// DCFs — rather than the standalone capacity workbook. That swap buys three
// things: Alphabet (absent from the capacity file entirely), a 2028E column, and
// the current capex vintage. The DCF has Amazon 2026 at $221.5B, i.e. the raised
// ~$220B guide; the capacity workbook still carried $205B, the February number.
//
// ── REFRESHED Aug 2026, and MICROSOFT ADDED ──────────────────────────────────
// The workbook now carries a fourth tab, so all four names are modelled. What
// moved in this vintage:
//   • Alphabet 2026–28E GW nudged UP (4.2553 → 4.2947, 5.4271 → 5.4773,
//     6.7839 → 6.8467). Amazon and Meta are unchanged.
//   • Meta's assumed Blackwell H100 price rose $18k → $22k, which lifts its
//     silicon cost per GW (see HS_CHIP_MIX) without changing its GW count —
//     the GW series is solved off capex, and Meta's capex did not move.
//
// ⚠⚠ MICROSOFT IS ON A FISCAL YEAR AND IT BREAKS THIS AXIS. Microsoft's year
// ends 30 June, so its FY2026 CLOSED in June 2026 and is REPORTED, while the
// 2026 column is still an ESTIMATE for the other three. The 2026 cell for `msft`
// below is therefore Microsoft's **reported FY2026** (3.0809 GW off $115,948M of
// actual capex), not a forecast. We use the actual deliberately — a closed year's
// reported figure beats the model's stale 2026 projection column (which still
// says 3.2589 GW off $122,647M) — but it means the 2026 column mixes one actual
// with three estimates. That is surfaced on the tab, per the fiscal-offset
// convention already used on the CapEx and Guidance tabs. See HS_GW_MSFT_FY.
//
// ⚠ The two workbooks still disagree where they overlap, and the DCF is the one
// to trust:  Amazon 2026 6.52 GW (DCF) vs 6.03 GW (capacity file);
//            Meta 2025 1.87 GW (DCF) vs 2.05 GW (capacity file).
// The Meta gap is not a capex difference — both use $69.7B for 2025 — but a
// different cost-per-GW/split assumption between the two builds.
export var HS_GW_YEARS = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026E', '2027E', '2028E'];

export var HS_GW_ADDS = {
  amzn:  [0.395,  0.4961, 1.181,  1.7963, 1.8726, 1.5514, 2.442,  3.8784, 6.5157, 8.1446, 10.1808],
  googl: [0.5247, 0.4915, 0.4651, 0.5143, 0.6572, 0.6732, 1.0965, 1.9087, 4.2947, 5.4773, 6.8467],
  meta:  [0.3749, 0.4049, 0.4053, 0.4995, 0.8428, 0.7311, 0.999,  1.8687, 3.888,  4.4712, 5.1419],
  // Fiscal years ending 30 June. The 2026 cell is a REPORTED actual, not an estimate.
  msft:  [0.3091, 0.37,   0.4103, 0.548,  0.6347, 0.7468, 1.1818, 1.7152, 3.0809, 5.2376, 5.7613],
};

// Which company's 2026 column is an actual rather than an estimate, and why —
// consumed by the tab so the caveat travels with the chart instead of living
// only in this comment.
export var HS_GW_MSFT_FY = {
  id: 'msft', year: '2026E',
  note: 'Microsoft’s financial year ends 30 June, so its FY2026 is <b>closed and reported</b> while 2026 is still an estimate for the other three. The Microsoft bar in the 2026 column is the reported year — 3.08 GW off $115.9B of actual capex — not a forecast. The model’s own 2026 projection column (3.26 GW off $122.6B) was superseded by the print and is not used here.',
};

// The same GW split by which spend bucket funded it: the shell and everything
// bolted to it, versus the silicon that goes inside.
export var HS_GW_SPLIT = {
  amzn:  { infra: [0.1242, 0.156,  0.3714, 0.5648, 0.5888, 0.4878, 0.7679, 1.2196, 2.0489, 2.5611, 3.2013],
           chips: [0.2708, 0.3401, 0.8097, 1.2315, 1.2837, 1.0636, 1.6741, 2.6588, 4.4668, 5.5836, 6.9795] },
  googl: { infra: [0.1171, 0.1096, 0.1037, 0.1147, 0.1466, 0.1502, 0.2446, 0.4258, 0.958,  1.2219, 1.5273],
           chips: [0.4077, 0.3819, 0.3613, 0.3996, 0.5106, 0.523,  0.8519, 1.4829, 3.3366, 4.2555, 5.3194] },
  meta:  { infra: [0.1074, 0.116,  0.1161, 0.1431, 0.2415, 0.2095, 0.2863, 0.5355, 1.1142, 1.2813, 1.4735],
           chips: [0.2674, 0.2889, 0.2891, 0.3563, 0.6013, 0.5216, 0.7127, 1.3332, 2.7738, 3.1899, 3.6684] },
  msft:  { infra: [0.0878, 0.1051, 0.1165, 0.1556, 0.1802, 0.2121, 0.3356, 0.4871, 0.8749, 1.4874, 1.6361],
           chips: [0.2213, 0.2649, 0.2938, 0.3923, 0.4544, 0.5348, 0.8462, 1.2281, 2.206,  3.7502, 4.1252] },
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
// silicon cost per GW. All four are now modelled, and the spread is the finding:
// a gigawatt of Alphabet costs $37.2B of silicon against $23.3B of Amazon, because
// Alphabet's assumed mix is both the most power-hungry (1.08 kW per chip, so fewer
// chips fit in a gigawatt) and by far the dearest ($40.2k weighted vs $11.8k).
// That single assumption is what drives Alphabet's $47.9B/GW all-in against
// Amazon's $34.0B — worth interrogating before it is quoted, because it is an
// input, not an observation.
//
// ⚠ CHANGED in the Aug 2026 vintage: Meta's Blackwell H100 is now priced at $22k,
// up from $18k. Its weighted chip cost rises $14,562.5 → $16,662.5 and its silicon
// cost per GW $23.25B → $26.61B. Power draw and chip count are unchanged.
export var HS_CHIP_MIX = {
  amzn:  { rows: [['Trainium', 0.40, 0.70, 11000], ['Inferentia2', 0.35, 0.15, 5500], ['Blackwell H200', 0.25, 0.70, 22000]],
           wKW: 0.5075, wCost: 11825, costPerGW: 23.30, chipsPerGW: 1970443 },
  googl: { rows: [['TPU', 0.60, 1.00, 27000], ['Blackwell', 0.40, 1.20, 60000]],
           wKW: 1.08, wCost: 40200, costPerGW: 37.22, chipsPerGW: 925926 },
  meta:  { rows: [['MTIA', 0.15, 0.10, 7000], ['AMD MI300X', 0.325, 0.75, 12500], ['Blackwell H100', 0.525, 0.70, 22000]],
           wKW: 0.6262, wCost: 16662.5, costPerGW: 26.61, chipsPerGW: 1596806 },
  msft:  { rows: [['Maia 200', 0.10, 0.10, 7000], ['AMD MI300X', 0.30, 0.75, 12500], ['Blackwell H100', 0.60, 0.70, 22000]],
           wKW: 0.655, wCost: 17650, costPerGW: 26.95, chipsPerGW: 1526718 },
};

// The bridge the model actually solves: capex ÷ cost-per-GW = GW added.
//
// ── REBUILT Aug 2026 ─────────────────────────────────────────────────────────
// This block was still carrying the OLD standalone capacity workbook (Amazon at
// $205B of 2026 capex, Meta at $33.94B per GW) while everything above it had
// already moved to the DCF. It is now rebuilt from the DCF's own summary block,
// so the bridge and the GW series finally agree with each other, and all four
// names are here rather than two. Every split ties to its total exactly.
//
// The comparison the table is really for: Alphabet buys a gigawatt for $47.9B
// against Amazon's $34.0B — a 41% gap that is entirely a silicon-mix assumption
// (see HS_CHIP_MIX), not an observed cost. Amazon and Alphabet are modelled 100%
// owned; Meta and Microsoft are not, which is where the JV and lease structures
// on the Accounting tab show up.
//
// ⚠ Microsoft's row is the model's 2026 PROJECTION ($122.6B), not its reported
// FY2026 ($115.9B) — the bridge block in the workbook was not refreshed after the
// fiscal year closed. Read the Microsoft GW figure here as the model's, and the
// 3.08 GW on the chart above as the reported one; they are two different years.
export var HS_GW_BRIDGE = {
  amzn:  { gw26: 6.5157, gw27: 8.1446, owned: 1.00, capexPerGW: 33.99, total26: 221.46, total27: 276.82,
    split: [['Servers & networking equipment', 181.14, 0.818], ['Heavy equipment', 17.92, 0.0809],
            ['Other equipment', 11.40, 0.0515], ['Construction in progress', 9.77, 0.0441],
            ['Land', 1.22, 0.0055]] },
  googl: { gw26: 4.2947, gw27: 5.4773, owned: 1.00, capexPerGW: 47.91, total26: 205.76, total27: 262.42,
    split: [['Technical infrastructure', 191.36, 0.93], ['Corporate & other assets', 7.52, 0.0365],
            ['Construction in progress', 6.44, 0.0313], ['Office space', 0.44, 0.0022]] },
  meta:  { gw26: 3.888,  gw27: 4.4712, owned: 0.45, capexPerGW: 37.29, total26: 145.00, total27: 166.75,
    split: [['Servers & network assets', 103.45, 0.7134], ['Finance lease ROU assets', 19.11, 0.1318],
            ['Construction in progress', 10.50, 0.0724], ['Equipment & other', 7.87, 0.0543],
            ['Leasehold improvements', 3.74, 0.0258], ['Buildings', 0.31, 0.0021], ['Land', 0.02, 0.0001]] },
  msft:  { gw26: 3.2589, gw27: 5.2376, owned: 0.60, capexPerGW: 37.63, total26: 122.65, total27: 197.11,
    split: [['Servers & network assets', 87.82, 0.7160], ['Construction in progress', 11.73, 0.0957],
            ['Finance lease ROU assets', 11.65, 0.0950], ['Equipment & other', 8.80, 0.0717],
            ['Leasehold improvements', 2.28, 0.0186], ['Buildings', 0.34, 0.0028], ['Land', 0.02, 0.0002]] },
};

// ⚠ Model QA, surfaced rather than buried. The previous flag here — that Meta's
// dollar and percentage columns disagreed on Land, Buildings and Finance-lease ROU
// — is RESOLVED in this vintage: the percentage column was removed from the Meta
// build and the dollars now tie to $145.0B exactly (the percentages shown above
// are computed from the dollars, so they cannot drift again). Two smaller things
// took its place, both on the newly added Microsoft tab.
export var HS_GW_MODEL_FLAG =
  'Two copy-paste artifacts survive on the newly added Microsoft tab of the model, and neither affects the numbers used here — but both should be cleaned before the workbook circulates. The capex-to-GW summary row is <b>labelled “Meta”</b> although its figures are Microsoft’s own, and a second quarterly block further right still holds <b>Meta’s 2025 quarterly capex</b> ($69.7B across four quarters) rather than Microsoft’s. Separately, the Amazon and Alphabet tabs compute “total number of chips” by dividing the <b>full $35B all-in cost</b> per GW by the $40k unit price instead of the $24.3B silicon portion, which is why those two read 874,733 chips against 607,813 on the Meta and Microsoft tabs; the figure shown on this tab is the silicon-based one.';

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
  // `dlr` is the year-on-year change in US$B. Stated on the call wherever
  // possible — Alphabet usually gives the dollar increase alongside the rate,
  // which is why this line can carry both units without deriving either.
  fy: [
    { year: '2024', usd: 15.3, growth: 28, dlr: 3.4, dlrD: true, src: '4Q24 call: "In 2024, we saw 28% year-over-year growth in depreciation." The $3.4B change is derived against the model’s 2023 figure of $11.9B, which itself ties to the 10-K.' },
    { year: '2025', usd: 21.1, growth: 38, dlr: 5.8, src: '4Q25 call: "depreciation increased by nearly $6 billion, or 38%, from $15.3 billion in 2024 to $21.1 billion in 2025."' },
  ],
  // Quarterly YoY growth of the depreciation line, as stated. Note the ramp.
  qtr: [
    { q: '1Q25', growth: 31, usd: null, dlr: null, src: '"about a 31% year-over-year growth in depreciation this quarter, and it will be higher as we go throughout the year." No level or dollar change given.' },
    { q: '2Q25', growth: 35, usd: 5.0,  dlr: 1.3,  src: '"depreciation increased $1.3 billion year-over-year to $5 billion, reflecting a growth rate of 35%."' },
    { q: '3Q25', growth: 41, usd: 5.6,  dlr: 1.6,  src: '"depreciation increased $1.6 billion year-over-year to $5.6 billion, reflecting a growth rate of 41%."' },
  ],
  forward: 'For 2026 Alphabet expects the growth rate to "accelerate in Q1 and meaningfully increase for the full year" — no figure given.',
};

// (The Microsoft Cloud gross-margin series that used to sit here was removed per
// SAB — it charted a non-GAAP cross-segment metric alongside the reported
// segments below, which invited exactly the comparison it should not support.
// Recoverable from git if the AI-cost read is wanted again: 72 → 65 over the ten
// call quarters, which management attributed to scaling AI infrastructure.)

// ── 5b · THE CLOUD SEGMENTS (CSPs) ────────────────────────────────────────────
// SOURCE: quarterly segment financials supplied by SAB — a complete Q4'19 → Q2'26
// run of revenue and operating income for Google Cloud, AWS and Intelligent
// Cloud. Nothing here is derived; every cell is as reported.
//
// This block runs on its OWN 27-quarter axis, not the 10-quarter call axis the
// rest of the dashboard uses, because the segments have a pre-AI history that
// matters — Google Cloud lost money every quarter until 1Q23.
//
// ⚠ MICROSOFT IS INTELLIGENT CLOUD, NOT "MICROSOFT CLOUD". Microsoft Cloud is a
// non-GAAP cross-segment revenue metric (Azure + M365 commercial + Dynamics +
// LinkedIn commercial) with no segment operating income. Intelligent Cloud is
// the reportable segment — Azure plus server products and Enterprise Services —
// and it does disclose operating income. Segments were restated in FY2025, so
// the series is on the restated basis and starts at Q3'22.
//
// ✓ CALENDAR ALIGNMENT VERIFIED (SAB asked). Microsoft's fiscal year ends in
// June, so the check that matters is whether these columns are calendar or
// fiscal. Q1'26 reads 34,681; Microsoft's FY26Q3 call — the quarter covering
// Jan–Mar 2026, i.e. calendar Q1'26 — stated "Revenue was $34.7 billion and
// grew 30%", and 34,681/26,751 computes to +29.6%. Level and growth both tie,
// so the columns are CALENDAR quarters. The other two tie as well: Google Cloud
// Q1'26 +63.4% against a stated "up 63% to $20 billion", Q2'26 +81.8% against
// "up 82% to $24.8 billion"; AWS Q2'26 +36.8% against a stated 36.7%.
//
// Still not a like-for-like across the three: Google Cloud is GCP + Workspace,
// AWS is pure infrastructure and platform, Intelligent Cloud adds on-prem
// server products and Enterprise Services to Azure. Read the slopes.
export var HS_CSP_QTRS = [
  "Q4'19", "Q1'20", "Q2'20", "Q3'20", "Q4'20", "Q1'21", "Q2'21", "Q3'21", "Q4'21",
  "Q1'22", "Q2'22", "Q3'22", "Q4'22", "Q1'23", "Q2'23", "Q3'23", "Q4'23",
  "Q1'24", "Q2'24", "Q3'24", "Q4'24", "Q1'25", "Q2'25", "Q3'25", "Q4'25",
  "Q1'26", "Q2'26",
];

// US$M as reported. null = not reported on the restated basis.
export var HS_CSP_REV = {
  googl: [2614, 2777, 3007, 3444, 3831, 4047, 4628, 4990, 5541, 5821, 6276, 6868, 7315,
          7454, 8031, 8411, 9192, 9574, 10347, 11353, 11955, 12260, 13624, 15157, 17664,
          20028, 24768],
  amzn:  [9954, 10219, 10808, 11601, 12742, 13503, 14809, 16110, 17780, 18441, 19739, 20538, 21378,
          21354, 22140, 23059, 24204, 25037, 26281, 27452, 28786, 29267, 30873, 33006, 35579,
          37587, 42232],
  msft:  [null, null, null, null, null, null, null, null, null, null, null, 16885, 17926,
          18244, 19889, 20013, 21525, 22141, 23785, 24092, 25544, 26751, 29878, 30897, 32907,
          34681, 39306],
};

export var HS_CSP_OI = {
  googl: [-1194, -1730, -1426, -1208, -1243, -974, -591, -644, -890, -706, -590, -440, -186,
          191, 395, 266, 864, 900, 1172, 1947, 2093, 2177, 2826, 3594, 5313,
          6598, 8814],
  amzn:  [2596, 3075, 3357, 3535, 3564, 4163, 4193, 4883, 5293, 6518, 5715, 5403, 5205,
          5123, 5365, 6976, 7167, 9421, 9334, 10447, 10632, 11547, 10160, 11434, 12465,
          14161, 16621],
  msft:  [null, null, null, null, null, null, null, null, null, null, null, 6750, 6727,
          7017, 7917, 8908, 9555, 9515, 9835, 10503, 10851, 11095, 12140, 13391, 13873,
          13753, 15955],
};

export var HS_CSP_NOTES = [
  'Google Cloud lost money every quarter until 1Q23 — <b>$1.7B of operating loss in a single quarter of 2020</b>. It now earns $8.8B. That swing, not the revenue line, is the strongest CapEx defence any of the three has.',
  'Google Cloud margin went from <b>9.4% to 35.6%</b> over nine quarters while revenue growth <i>accelerated</i> from 28% to 82%. Expanding margin and accelerating growth at once is rare.',
  'AWS margin peaked at a record <b>39.5% in 1Q25</b>, fell to 32.9% the next quarter — roughly half seasonal stock comp, the rest depreciation on the AI fleet — and has since recovered to 39.4%. Growth troughed at 17% in mid-2025 and reached 36.8% by Q2\'26.',
  'Intelligent Cloud is the steadiest: margin has held a <b>40–43%</b> band for three years while revenue doubled. Note Q1\'26 — revenue grew 30% but operating income <i>fell</i> sequentially, the first quarter that has happened in this dataset.',
  'On absolute dollars AWS is still ahead, but Google Cloud has closed the quarterly operating-income gap from <b>$8.5B in Q1\'24 to $7.8B in Q2\'26</b> while growing off a base a third the size.',
];

// ── 6b · THE MODELLED DEPRECIATION TRAJECTORY ─────────────────────────────────
// From the CapEx/D&A tabs inside the live DCFs (`CapEx D&A DCFs.xlsx`). PP&E
// depreciation only — not total D&A.
//
// ── REFRESHED Aug 2026, and MICROSOFT ADDED ──────────────────────────────────
// Microsoft now has a tab, so the wave can finally be read across all four. Every
// forward column moved in this vintage, all by small amounts and all in the same
// direction for Alphabet and against it for Meta:
//   Amazon  2026E 61,943 → 62,012 · 2027E 88,085 → 87,962 · 2028E 120,771 → 120,616
//   Alphabet 2026E 31,649 → 31,635 · 2027E 49,931 → 50,358 · 2028E 73,953 → 74,246
//   Meta     2026E 28,341 → 27,627 · 2027E 42,479 → 41,905 · 2028E 58,850 → 58,383
//
// The 2023-25 column ties to the filings (Alphabet $21,136M for 2025 is exactly
// the $21.1B Anat gave on the 4Q25 call; Amazon $41,900M and Meta $18,000M both
// tie to the 10-K), which is the check that makes the forward columns worth
// reading. Pre-2023 Alphabet diverges from its 10-K line because the model tracks
// PP&E only while the filed figure carries more, so the series starts at 2023.
//
// ⚠ MICROSOFT IS FISCAL — the four cells are FY2023/24/25/26 (years ending 30
// June), and FY2026 is a REPORTED year, not an estimate: $34,300M straight from
// the 10-K, in a column the other three are still forecasting. The model's own
// FY2026 figure is $33,275M, within 3% of the filed number, which is a decent
// check on the two forward years. Same caveat as the GW chart — see HS_GW_MSFT_FY.
export var HS_DEP_YEARS = ['2023', '2024', '2025', '2026E', '2027E', '2028E'];
export var HS_DEP_MODEL = {   // US$M
  amzn:  [30200, 32100, 41900, 62012, 87962, 120616],
  googl: [11946, 15311, 21136, 31635, 50358, 74246],
  meta:  [11020, 15290, 18000, 27627, 41905, 58383],
  msft:  [11000, 15200, 22000, 34300, 52122, 68879],   // fiscal years; FY2026 reported
};

// The P&L pressure ratio: PP&E depreciation as a share of cost of revenue.
//
// ⚠ ALPHABET AND MICROSOFT ONLY, AND NOT BECAUSE THE OTHERS WERE SKIPPED. The
// Amazon and Meta tabs carry cost-of-revenue projections that are visibly broken
// — Meta's 2028E COGS reads $588M against $61.7B the year before, and Amazon's
// 2028E nearly doubles in a single step — so any ratio built on them would be
// noise. Microsoft's 2026E COGS cell is broken the same way ($10M), but its
// FY2026 actual is sound and is used instead.
//
// ⚠ THE TWO SERIES ARE NOT LIKE FOR LIKE. Alphabet's cost of revenue carries
// traffic acquisition costs — tens of billions with no depreciation in them —
// which mechanically depresses its ratio against Microsoft's. Read each line
// against its own history, not across the two.
export var HS_DEP_COGS = {
  years: ['2023', '2024', '2025', '2026E', '2027E', '2028E'],
  series: [
    { id: 'googl', pct: [8.96, 10.47, 13.00, 17.04, 22.46, 27.65] },
    { id: 'msft',  pct: [16.70, 20.51, 25.05, 32.25, 40.21, 42.82] },
  ],
  note: 'Microsoft’s depreciation already absorbs a quarter of cost of revenue and the model has it passing 40% by FY2028E. Alphabet’s line is lower and rising faster off a smaller base — but its cost of revenue includes traffic acquisition costs, which have no depreciation in them, so the levels are not comparable across the two companies. The shape of each line is the point.',
};

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
  // Microsoft, added Aug 2026. FISCAL years ending 30 June. These are the model's
  // effective lives; Microsoft's 10-K discloses RANGES rather than points, and the
  // range is given alongside because the gap between the two is itself informative
  // — the filed range for computer equipment is 2–6 years while the model runs 4.
  msft: [
    { a: 'Computer equipment & software', now: 4,   hist: '2.5 (FY19–20) → 3.0 (FY21–22) → 4.0 (FY23–28E) · 10-K range 2–6 yrs' },
    { a: 'Buildings & improvements',      now: 10,  hist: 'Unchanged at 10 · 10-K range 5–15 yrs' },
    { a: 'Leasehold improvements',        now: 9,   hist: '11.5 (FY19–24) → 9.0 (FY25–28E) · 10-K range 3–20 yrs, narrowed to 3–15 in FY25' },
    { a: 'Furniture & equipment',         now: 5.5, hist: 'Unchanged at 5.5 · 10-K range 1–10 yrs' },
  ],
};

// ⚠ ONE THING THE MODEL DOES NOT YET REFLECT. Microsoft told the market on the
// FY26Q4 call that it is extending the useful life of its DATA CENTRES from 15 to
// 25 years from FY27 — the change that pushes leases from finance to operating and
// makes its headline CapEx guide fall from ~$190B to ~$175B without any reduction
// in investment (it is on the Accounting tab, and in HS_GUIDE for msft). The
// model's buildings line above still runs a flat 10 years across FY2028E, so the
// Microsoft depreciation trajectory in this workbook does NOT carry that
// extension. If it were applied, the FY27–28E depreciation would come in lower
// than the $52.1B / $68.9B shown.
export var HS_LIVES_FLAG = {
  id: 'msft',
  note: 'Microsoft is extending data-centre useful life from <b>15 to 25 years from FY27</b> — the change behind the optical drop in its CapEx guide. The model’s buildings assumption above is a flat 10 years throughout and does <b>not</b> reflect it, so the FY27–28E depreciation shown here is, if anything, too high.',
};

export var HS_DEP_NOTES = [
  { id: 'meta', head: 'Direction only, no figure',
    body: 'Meta has flagged infrastructure as the single largest driver of expense growth two years running, and in 2Q25 warned of "a sharp acceleration in depreciation expense growth in 2026" from assets bought and placed in service that year. It has never put a number on the line.' },
  { id: 'amzn', head: 'Visible only through AWS margin',
    body: 'Amazon discloses depreciation as a margin headwind rather than a figure — "AWS margins also saw headwinds from higher depreciation expense" (2Q25). Its useful-life changes, which move this line directly, are in the Accounting tab.' },
  { id: 'msft', head: 'The consequence, not the cause',
    body: 'Microsoft Cloud gross margin has fallen every year of the build-out, and management attributes it to "scaling our AI infrastructure" each time. Reading it as the depreciation line is an inference — a real one, but the dollars are never disclosed.' },
];

// ── 7 · WHAT THEY SAID, BY THEME AND QUARTER ──────────────────────────────────
// A curated quote matrix: one row per calendar quarter, one column per company,
// so the same question can be read across all four at the same moment. Every
// cell is condensed from that company's call for that quarter; quoted fragments
// are verbatim, the connective text is compression.
//
// CURATED, NOT EXHAUSTIVE. A blank cell means the theme did not come up on that
// call in a way worth recording — not that the company was silent on everything.
// Alphabet has no 2Q24 row anywhere because that call is not in the corpus.
//
// The quarter labels are CALENDAR quarters, so Microsoft's fiscal offset is
// already absorbed: its FY26Q2 call sits in the 4Q25 row alongside everyone
// else's 4Q25 call.
export var HS_THEME_QTRS = ['1Q24', '2Q24', '3Q24', '4Q24', '1Q25', '2Q25', '3Q25', '4Q25', '1Q26', '2Q26'];

export var HS_THEMES = [
  {
    k: 'guide', label: 'CapEx guidance',
    blurb: 'The number and, more tellingly, the verb. Read down a column and you watch a company talk itself upward; read across a row and you watch them all do it in the same quarter.',
    rows: {
      googl: [
        'Quarterly CapEx “roughly at or above” the $12B Q1 level; 2025 “premature to comment”.',
        '', 'Q3 $13B, Q4 similar — and a first signal of “substantial increases in capital investment going into 2025”.',
        'First annual guide: <b>~$75B for 2025</b>, $16–18B of it in Q1.',
        'Reaffirmed: “we still expect to invest approximately $75 billion”.',
        'Raised to <b>~$85B</b> on cloud demand, plus “a further increase in CapEx” flagged for 2026.',
        'Raised to <b>$91–93B</b>; 2026 to see “a significant increase”.',
        '2026 guided at <b>$175–185B</b>; 2025 closed at $91.4B.',
        'Raised to <b>$180–190B</b> to fold in Intersect; 2027 “to significantly increase”.',
        'Raised to <b>$195–205B</b> on “an acceleration in the delivery of capacity”.',
      ],
      amzn: [
        '“Meaningfully increase year-over-year capital expenditures in 2024” — no number yet.',
        'H1 CapEx $30.5B; capital investments “higher in the second half”.',
        '<b>~$75B for 2024</b>, and “I suspect we’ll spend more than that in 2025”.',
        'Q4 $26.3B “reasonably representative” of the 2025 quarterly rate — an annual guide by implication, ~$105B.',
        'Q1 cash CapEx $24.3B; no annual figure given.',
        'Q2 $31.4B “reasonably representative” for the back half.',
        'First explicit annual number: <b>~$125B for 2025</b>, “and we expect that amount will increase in 2026”.',
        '<b>~$200B for 2026</b>, “predominantly in AWS, because we have very high demand”.',
        'Q1 $43.2B. “The faster AWS grows, the more short-term CapEx we’ll spend.”',
        'Raised to <b>~$220B</b> — “the higher cost of memory pushing this number up”.',
      ],
      meta: [
        'Raised to <b>$35–40B</b> from $30–37B; “CapEx will continue to increase next year”.',
        'Raised to <b>$37–40B</b>; “significant CapEx growth in 2025”.',
        'Narrowed to <b>$38–40B</b>; “significant acceleration in infrastructure expense growth next year”.',
        '<b>$60–65B for 2025</b>.',
        'Raised to <b>$64–72B</b> — more data centres plus “an increase in the expected cost of infrastructure hardware”.',
        'Narrowed to <b>$66–72B</b>; 2026 to see “another year of similarly significant CapEx dollar growth”.',
        'Raised to <b>$70–72B</b>; 2026 dollar growth “notably larger” than 2025.',
        '<b>$115–135B for 2026</b>, with operating income still expected above 2025.',
        'Raised to <b>$125–145B</b>, “mostly due to higher component costs, particularly memory pricing”.',
        'Narrowed to <b>$130–145B</b>; no 2027 figure — “infrastructure planning remains highly dynamic”.',
      ],
      msft: [
        'CapEx “to increase materially on a sequential basis”; FY25 to be higher than FY24.',
        'Q4 $19.0B. FY25 “higher than FY2024”, managed against demand signals through the year.',
        'CapEx “to increase on a sequential basis, given our cloud and AI demand signals”.',
        'Q3 and Q4 “to remain at similar levels as our Q2 spend” — the first flat guide anyone gave.',
        'FY26 “will grow at a lower rate than FY2025”, with more short-lived assets.',
        'Reaffirmed the moderation; Q1 FY26 “to be over $30 billion”.',
        '⚠ <b>Reversal</b>: “we now expect the FY 2026 growth rate to be higher than FY 2025”.',
        'CapEx “to decrease on a sequential basis” on normal build-out and lease timing.',
        'Over $40B in the quarter; <b>~$190B for calendar 2026</b>, including ~$25B of higher component pricing.',
        'CY2026 restated to <b>~$175B</b> — the cut is the finance-to-operating lease shift, not less investment.',
      ],
    },
  },
  {
    k: 'mix', label: 'What the CapEx buys',
    blurb: 'The split between the shell and the silicon, and how each company frames it. Microsoft’s drift from “roughly half long-lived” to “two-thirds short-lived” is the clearest single indicator of where the industry is in the build.',
    rows: {
      googl: [
        'Overwhelmingly technical infrastructure, “largest component for servers, followed by data centers”; offices under 10% of the total.',
        '', 'Majority technical infrastructure; servers include both TPUs and GPUs.',
        'Servers first, then data centres, supporting Services, Cloud and DeepMind.',
        'Same shape; the emphasis shifts to “how do we make sure every dollar is used efficiently”.',
        '<b>Two-thirds servers, one-third data centres and networking.</b>',
        '<b>60% servers, 40% data centres and networking.</b>',
        'Same 60/40, with long-duration assets “40 years or longer” against much shorter-lived machines.',
        '60/40 again — “approximately 60% of our investment in technical infrastructure this quarter was in servers”.',
        '60/40 holds even as the total nearly doubles.',
      ],
      amzn: [
        'Majority to AWS infrastructure “and specifically generative AI efforts”; the rest same-day facilities and fleet.',
        '', '', 'The vast majority “on AI for AWS”; the balance on same-day sites, rural delivery stations, robotics.',
        'AWS first, “and increasingly in custom silicon like Trainium”.',
        '“Chips, data centers, and power to pursue this unusually large opportunity.”',
        'Capacity is “power, data center, and chips, primarily our custom silicon Trainium and NVIDIA”.',
        'Servers & networking 82% of the 2026 plan; heavy equipment 8%, CIP 4%, land under 1%.',
        '“Land, power, buildings, chips, servers, and networking gear” — laid out 6 to 24 months before billing starts.',
        'Same structure, now against a $220B year.',
      ],
      meta: [
        'Servers, data centres and network infrastructure; sites staged “at various phases of development” to flex without over-committing.',
        'Building flexibly so capacity can move between core AI and GenAI as needed.',
        'Q4 step-up is “increases in server spend and to a lesser extent data center CapEx”.',
        'All three components grow; <b>servers the biggest growth driver and the largest portion of the budget</b>.',
        'More data centre spend “to stand up capacity more quickly”, plus higher hardware cost.',
        '<b>“A greater mix of our CapEx to be in shorter-lived assets in 2025 and 2026.”</b>',
        'Blue Owl JV: construction cost leaves reported CapEx entirely; Meta contributes 20% via other investing.',
        'Growth comes from MSL, core AI and non-AI alike — “the MSL AI needs are growing the most”.',
        'Custom silicon and AMD alongside NVIDIA, explicitly to raise efficiency per dollar.',
        'BlackRock venture for a 1 GW El Paso site; “near-term capacity is more valuable than long-term capacity”.',
      ],
      msft: [
        '', '<b>“Roughly half is for infrastructure”</b> — land, builds and leases monetised “over the next 15 years and beyond”; the rest CPUs and GPUs.',
        'Roughly half long-lived again; the remainder servers bought against demand signals.',
        '“More than half” long-lived, the rest servers “including our customer contracted backlog”.',
        'Roughly half long-lived, against a $315B contracted backlog.',
        'More than half long-lived, including $6.5B of finance leases recognised in full at commencement.',
        '<b>Flips: “roughly half of our spend was on short-lived assets, primarily GPUs and CPUs.”</b>',
        '<b>“Roughly two-thirds of our CapEx was on short-lived assets.”</b>',
        'Two-thirds short-lived; finance leases $4.7B for large data centre sites.',
        'Two-thirds short-lived. “If the demand environment changes, you just slow down what is the largest component.”',
      ],
    },
  },
  {
    k: 'da', label: 'Depreciation & useful life',
    blurb: 'The cost of the build arriving in the P&L. Alphabet is the only one that quantifies the line on the calls; the others describe it, and every useful-life change bar one moves reported profit favourably.',
    rows: {
      googl: [
        '“Very cognizant of the increasing headwind from higher depreciation and expenses associated with the higher CapEx.”',
        '', 'Efficiency work explicitly framed as funding “substantial increases in capital investment”.',
        '<b>2024 depreciation grew 28%</b>; the growth rate “to accelerate in 2025”.',
        '<b>+31% YoY</b> in the quarter, “and it will be higher as we go throughout the year”.',
        '<b>+$1.3B to $5.0B, +35%</b>; to “accelerate further in Q3”.',
        '<b>+$1.6B to $5.6B, +41%</b>; to “accelerate slightly” in Q4.',
        '<b>2025 depreciation +$6B, or 38%, from $15.3B to $21.1B</b>; 2026 to “meaningfully increase”.',
        'Depreciation pressure now hits both Cloud and Services as cost is allocated on consumption.',
        'Still flagged as the standing headwind against every efficiency programme.',
      ],
      amzn: [
        '<b>Server useful life extended to 6 years</b> — worth ~200bps of AWS margin, repeated all four quarters of 2024.',
        'Confirms the ~200bps benefit again.', 'Confirms it a third time.',
        '⚠ <b>Reverses course</b>: a subset of servers and networking cut from 6 years to 5 (−$700M), plus $920M of early-retirement charges — while fulfilment heavy equipment goes 10→13 years (+$900M).',
        '', '<b>“AWS margins also saw headwinds from higher depreciation expense”</b> — the first quarter it is named as a margin driver.',
        'Depreciation on newly in-service data centres explicitly hits AWS margin.',
        '“A headwind from the investments in AI and the depreciation on that CapEx”, offset by efficiency work.',
        'Life framing: 30+ years for data centres, 5–6 for chips, servers and networking gear.',
        'Servers break even in “a little less than three years”, with AI capacity contracted for five-year terms.',
      ],
      meta: [
        '', '', 'Back-end-weighted 2024 CapEx means “a significant acceleration in infrastructure expense growth next year”.',
        '<b>Useful lives extended to ~5.5 years</b> for both non-AI and AI servers — “savings in annual CapEx and resulting depreciation”.',
        '', '<b>“A sharp acceleration in depreciation expense growth in 2026”</b>, plus a greater mix of shorter-lived assets.',
        'Infrastructure cost growth accelerates on depreciation, data centre opex and third-party cloud.',
        'Infrastructure is the largest driver of 2026 expense growth: cloud spend, depreciation, operating costs.',
        '', 'Expense outlook held at $165–169B even as CapEx rises.',
      ],
      msft: [
        '', '', '', '', '', '', '', '',
        'Server life is six years against an RPO duration of 2.5 — answered with “those are sold for the entirety of the useful life of the GPU”.',
        '⚠ <b>Data centres and offices extended from 15 to 25 years</b> from FY27. “Minimal benefit” to operating income — but it moves leases from finance to operating and cuts reported CapEx ~$15B.',
      ],
    },
  },
  {
    k: 'silicon', label: 'Custom silicon',
    blurb: 'All four now design their own accelerators, which changes the NVIDIA-attach assumption underneath every CapEx forecast. Alphabet has a decade of head start; Meta arrived last and is the only one still buying merchant AMD at scale.',
    rows: {
      googl: [
        '<b>TPU v5</b> — “our custom TPUs, now in their fifth generation”. Gemini trained and served on them.',
        '', '<b>Trillium, 6th gen</b>, alongside “an industry-leading portfolio of NVIDIA GPUs”.',
        'Trillium delivers “four times better training performance and three times greater inference throughput”.',
        '<b>Ironwood, 7th gen</b> — “the first designed specifically for inference at scale”, 10x on the prior generation.',
        '“The industry’s widest range of TPUs and GPUs”; frontier labs including Anthropic use TPUs specifically.',
        'Ironwood approaching general availability; “we are investing in TPU capacity”.',
        '“Our own TPUs that we have been developing for a decade” — a 10-year track record in accelerators.',
        '<b>TPU 8t</b>, specialised separately for training and serving, plus Axion CPUs.',
        '<b>TPU 8t and 8i</b> alongside NVIDIA Vera Rubin; Axion CPU “30% better performance per dollar”.',
      ],
      amzn: [
        'Demand for “our custom silicon, Trainium and Inferentia, is quite high, given its favorable price-performance”.',
        'Trainium2 “coming later this year”.',
        'Trainium2 “starting to ramp”; Graviton4 at “nearly 40% better price performance versus x86”.',
        '<b>Trainium2 launched</b> — instances “typically 30–40% better price performance”; Anthropic building frontier models on it.',
        'Trainium2 “laying in capacity in larger quantities with significant appeal and demand”.',
        '', '<b>Project Rainier online</b> — ~500,000 Trainium2 chips; Anthropic to be on 1M+ by year-end. Trainium2 “fully subscribed”.',
        'Chips business incl. Graviton and Trainium “over $10 billion annual revenue run rate, growing triple digits”.',
        '<b>~$50B standalone run rate — “one of the top three data center chip businesses in the world”</b>; $225B of Trainium revenue commitments.',
        'Chips run rate “over $25 billion”; multi-year, multi-gigawatt Trainium commitments from Anthropic and OpenAI.',
      ],
      meta: [
        '<b>MTIA</b> “has successfully enabled us to run some of our recommendation workloads”.',
        '', '', '<b>MTIA deployed to ranking and recommendation inference</b> for ads and organic content; further ramp expected.',
        'Investing in “our own silicon” alongside a significant GPU ramp.',
        '', '', 'Long-term investment in “silicon and energy”; cost per gigawatt expected to fall through optimisation.',
        '<b>“More than 1 GW of our own custom silicon developed with Broadcom”</b>, plus significant AMD volume alongside NVIDIA.',
        'Internal custom silicon framed as “long-term strategic flexibility and supply chain leverage”.',
      ],
      msft: [
        'NVIDIA and AMD “as well as our own first-party silicon”.',
        '<b>Azure Maia</b> and Cobalt 100 introduced.',
        '<b>Maia 100</b> in the fleet alongside the first Blackwell systems.',
        'First-party silicon across “Maia, Cobalt, Boost, and HSM”.',
        '', '', '',
        '<b>Maia 200 online</b> — “10+ petaflops at FP4 precision with over 30% improved TCO”.',
        'Maia 200 “now scaling”; millions of servers already on first-party networking, security and virtualisation silicon.',
        'Maia 200 continues to scale at “30% better performance per dollar than the latest generation hardware”.',
      ],
    },
  },
  {
    k: 'capacity', label: 'Capacity & constraints',
    blurb: 'Where the binding constraint sat each quarter. The arc runs chips → power → physical capacity → memory price, and the language shifts from “we can throttle” to “demand exceeds supply” somewhere in mid-2025.',
    rows: {
      googl: [
        '', '', 'First corporate nuclear deal — “up to 500 megawatts” from small modular reactors.',
        '<b>“We exited the year with more demand than we had available capacity”</b> — a tight supply-demand position.',
        'Still short: “that was the case this quarter as well”.',
        '“It’s a tight supply environment. We are investing more to expand.”',
        'Cloud backlog $155B, up 82% — capacity, not demand, is the limit.',
        '“We’ve been supply constrained even as we’ve been ramping up our capacity.”',
        '“Unprecedented internal and external demand for AI compute resources.”',
        '⚠ <b>Renting third-party capacity as “a bridging strategy”</b> while building internally — with acknowledged margin cost.',
      ],
      amzn: [
        '“The more demand AWS has, the more we have to procure new data centers, power, and hardware.”',
        '', '', '<b>“The world is still constrained on power”</b>, plus motherboard shortages; constraints to ease in H2 2025.',
        '', '', '<b>+3.8 GW added in twelve months</b>, “more than any other cloud provider”; 1 GW more in Q4; capacity to double by end-2027.',
        '<b>+3.99 GW over twelve months</b> — “twice what we had in 2022”. In 2025 AWS added more capacity than any company in the world.',
        '', 'Still short: “we will still not have enough capacity to meet all the demand we have in 2026, and… 2027 too”.',
      ],
      meta: [
        '', '', '', '<b>“Almost a gigawatt of capacity this year”</b>, plus a 2 GW-plus site “the size of Manhattan”.',
        '', '<b>Hyperion “to scale up to 5 GW”</b>; Prometheus, the first 1 GW-plus cluster, lands in 2026.',
        'Front-loading capacity: better to accelerate than “be constrained on CapEx” with profitable investments unmade.',
        'Meta Compute formalised, with a president hired to court sovereigns and strategic capital.',
        '', '“Near-term capacity is more valuable than long-term capacity.”',
      ],
      msft: [
        '“Near-term AI demand is a bit higher than our available capacity.”',
        '<b>“We can throttle that investment”</b> if demand signals differ — the high-water mark of supply confidence.',
        'Demand still ahead of supply; partnerships with Oracle and CoreWeave to bridge.',
        '“I thought we’d be in better supply-demand shape by June. Now I’m saying I hope I’m in better shape by December.”',
        '', '<b>+2 GW stood up over twelve months</b>; every Azure region now AI-first and liquid-cooling capable.',
        '<b>AI capacity +80% this year; total footprint to roughly double in two years.</b> Fairwater Wisconsin alone scales to 2 GW.',
        '<b>Nearly 1 GW added in the quarter alone.</b> “Customer demand continues to exceed our supply.”',
        'Another gigawatt; still on track to double in two years.',
        '“Demand exceeds available supply in a sort of relatively extreme moment.” Dock-to-live times for new GPUs cut ~50%.',
      ],
    },
  },
];

