// results-data/tbbb.js — BBB Foods (TBBB / "Tiendas 3B") dataset for the standardized "Results"
// engine, rendered inside Earnings ▸ Setup (via tbbb-setup.js). ANNUAL only (the company reports
// under IFRS with a fiscal year ending Dec 31; a clean quarterly actuals/estimate series is not
// wired yet, so no quarterly view).
//
// Per period, compares REPORTED actuals against:
//   summit  — the Summit DCF model (snapshot 2026-05-22). In-sample years carry the model's fitted
//             value; 2026-2029 carry its forward projection.
//   cons    — Street consensus. The Summit model's Bloomberg-estimate fields are EMPTY for TBBB,
//             and TBBB is not in our consensus archive, so cons is null everywhere (labeled). It
//             renders automatically once a consensus export is loaded.
//   guide   — none. TBBB does not give numeric financial guidance, so there is no guidance band.
//
// Monetary values are in Mexican pesos, millions (Ps. MM); SSS in %, store count as a plain count.
// Arrays are parallel to `periods`. null = not available. A period with act:null is a forward year.

var NUL = [null, null, null, null, null, null, null, null, null, null];
var YRS = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029'];

export var tbbbResults = {
  updated: 'Aug 2026',
  // No quarterly view (annual only), so opt out of the generic surprise-history block on the
  // Estimates tab (it reads views.q). The estimate-evolution charts render on their own.
  surprise: false,
  intro: 'How Tiendas 3B’s reported results have tracked against the Summit DCF model and Street consensus, by year. Pick a KPI and the model’s projection sits next to the reported actual, with the surprise in percent; forward years (2026–) are estimates, no actual yet. Street consensus (Bloomberg) is wired for Revenue only — Bloomberg carries no gross-profit estimate for TBBB, and its EBITDA uses a different definition than the model’s, so those two show the model only. Figures in Mexican pesos (Ps.), millions, unless the KPI says otherwise.',
  source: 'Actuals: BBB Foods FY2020–FY2025 reports (Form 20-F, IFRS). Projections: Summit DCF model (TBBB, snapshot 2026-05-22). Street: Bloomberg consensus (BBG_CONSENSUS.txt archive), converted USD→pesos at each year’s implied FX. EBITDA is model-computed (not a reported line). Store count = distribution centers × stores per DC.',
  views: {
    y: {
      label: 'Annual',
      note: 'Annual, fiscal year ending Dec 31. Actuals from the company’s reports; Summit = the DCF model (in-sample fit for reported years, projection for 2026–2029). Consensus/guidance not available for TBBB.',
      metrics: {
        rev: { label: 'Total Revenue', short: 'Revenue', group: 'Income statement', unit: 'mxnM', cur: 'Ps.',
          periods: YRS,
          act:    [18050, 23091, 32580, 44078, 57439, 78153, null, null, null, null],
          summit: [null, null, 32580, 44078, 57439, 78153, 103159, 131355, 167026, 207545],
          cons:   [null, null, null, 45516, 50452, 80947, 113824, 146050, 181391, 225614],
          guideLo: NUL, guideHi: NUL,
          note: 'Consolidated net revenue (Ps. MM). +36% in FY2025 to Ps.78.2B; the Summit model projects continued double-digit growth to ~Ps.207B by 2029. Street = Bloomberg consensus (BBG_CONSENSUS.txt, latest as-of 2026-08-03; the pre-print snapshot for each reported year), converted from USD to pesos at each year’s implied FX (~17.7 in 2023 → ~19.2 in 2025+). The Street runs consistently ABOVE the Summit model on revenue.' },
        gp: { label: 'Gross Profit', short: 'Gross profit', group: 'Income statement', unit: 'mxnM', cur: 'Ps.',
          periods: YRS,
          act:    [2445, 3436, 4925, 7040, 9376, 12644, null, null, null, null],
          summit: [null, null, null, null, 9172, 12090, 17040, 21279, 27058, 34037],
          cons: NUL, guideLo: NUL, guideHi: NUL,
          note: 'Gross profit (Ps. MM) — revenue less cost of sales; gross margin runs ~16%. FY2025 Ps.12.6B (16.2% margin). The Summit projection assumes a roughly stable gross margin as private-label mix rises.' },
        ebitda: { label: 'EBITDA (model)', short: 'EBITDA', group: 'Income statement', unit: 'mxnM', cur: 'Ps.',
          periods: YRS,
          act:    [370, 308, 614, 904, 1499, 1921, null, null, null, null],
          summit: [null, null, 614, 904, 1499, 1921, 2561, 3654, 4984, 6802],
          cons: NUL, guideLo: NUL, guideHi: NUL,
          note: 'EBITDA (Ps. MM) — MODEL-COMPUTED: the company does not report EBITDA in its filings, so both the actual and the projection come from the Summit model’s reconstruction. Shown for the operating-leverage trend, not as a reported figure.' },
        stores: { label: 'Store Count', short: 'Stores', group: 'Operating KPIs', unit: 'count', unitLabel: 'stores',
          periods: YRS,
          act:    [1249, 1500, 1892, 2288, 2772, 3346, null, null, null, null],
          summit: [null, null, 1892, 2288, 2772, 3346, 3976, 4692, 5537, 6478],
          cons: NUL, guideLo: NUL, guideHi: NUL,
          note: 'Year-end store count (= distribution centers × stores per DC). 3,346 at year-end 2025 (+574 net new). The Summit model projects ~6,500 stores by 2029 — still a fraction of the ~14,000-store white space management sees in Mexico.' },
        sss: { label: 'Same-Store Sales', short: 'SSS', group: 'Operating KPIs', unit: 'pct',
          periods: YRS,
          act:    [18.3, 12.3, 21.9, 17.6, 13.4, 16.5, null, null, null, null],
          summit: [null, null, null, null, null, null, 15.8, 12.0, 12.1, 10.3],
          cons: NUL, guideLo: NUL, guideHi: NUL,
          note: 'Same-store sales growth (%). Durable double digits — FY2025 +16.5%. The Summit model projects a gradual normalization toward ~10% by 2029. (In-sample model SSS is omitted; only the forward projection is shown.)' }
      },
      sections: [
        { key: 'income', label: 'Income & KPIs', defaultMetric: 'rev', groups: [
          { label: 'Income statement (Ps.)', keys: ['rev', 'gp', 'ebitda'] },
          { label: 'Operating KPIs', keys: ['stores', 'sss'] }
        ] }
      ]
    }
  },

  // ── Estimate Evolution — how the STREET's forecast moved across 11 Bloomberg snapshots
  // (BBG_CONSENSUS.txt, Apr 2024 → Aug 2026). Each fiscal year's consensus mapped from that
  // snapshot's fy+ columns to a fixed year. The Summit model carries a single vintage today, so
  // this tab is Street-only (summit:null). USD→MXN at ~19.2; EBITDA is Bloomberg's definition.
  evolution: {
    intro: 'How the Street’s forecast for TBBB has moved. Each line tracks one fiscal year’s Bloomberg consensus across 11 snapshots (Apr 2024 → Aug 2026, from the BBG_CONSENSUS archive). The story of the cycle: the Street CUT its FY2026 revenue estimate ~16% through 2024 on near-term-softness fears, then chased it back up ~+32% through 2025–26 as 3B beat every print. The Summit model carries a single vintage today (shown on Results/Setup), so only the Street series appears here. Values converted from USD to pesos at ~19.2 MXN/USD; EBITDA is Bloomberg’s definition (below the model’s adjusted figure).',
    vintages: [
      { label: 'Apr 28, 2024', event: 'IPO quarter' },
      { label: 'May 25, 2024', event: '' },
      { label: 'Aug 24, 2024', event: 'post-3Q24' },
      { label: 'Nov 28, 2024', event: 'post-4Q24' },
      { label: 'Apr 12, 2025', event: 'post-FY24' },
      { label: 'May 10, 2025', event: 'post-1Q25' },
      { label: 'Aug 14, 2025', event: 'post-2Q25' },
      { label: 'Nov 22, 2025', event: 'post-3Q25' },
      { label: 'Mar 14, 2026', event: 'post-FY25' },
      { label: 'May 9, 2026',  event: 'post-1Q26' },
      { label: 'Aug 3, 2026',  event: 'current' }
    ],
    years: ['2026', '2027', '2028', '2029'],
    sections: [
      { key: 'evtop',  label: 'Revenue',  defaultMetric: 'rev',    groups: [ { label: 'Total revenue', keys: ['rev'] } ] },
      { key: 'evprof', label: 'EBITDA',   defaultMetric: 'ebitda', groups: [ { label: 'EBITDA — Bloomberg definition', keys: ['ebitda'] } ] }
    ],
    metrics: {
      rev: { label: 'Total Revenue', unit: 'mxnM', cur: 'Ps.', summit: null,
        cons: [
          [102682, 104256, 93446, 86438, 87360, 93926, 99725, 103565, 109478, 114144, 114029],
          [119962, 119962, 117408, 109267, 101875, 116659, 122054, 129485, 137760, 143866, 146323],
          [null, 139987, 142598, 129926, 129562, 138778, 146016, 160915, 168019, 182803, 181709],
          [null, null, null, null, 151123, 165062, 171418, 193325, 211930, 235296, 226022]
        ],
        prior: { cons: [82752, 84806, 73440, 67680, 69139, 73997, 78816, 81101, 78298, 78298, 78298] },
        note: 'The Street’s FY2026 revenue estimate fell ~16% through 2024 (≈Ps.104B → Ps.86B) on near-term-softness fears, then climbed ~+32% back to ~Ps.114B as 3B beat every print. The out-years (2027–2029) ratcheted up steadily with each beat. Converted from USD at ~19.2 MXN/USD.' },
      ebitda: { label: 'EBITDA (BBG)', unit: 'mxnM', cur: 'Ps.', summit: null,
        cons: [
          [6547, 6470, 5856, 5222, 5030, 5261, 5107, 3840, 4109, 3648, 3974],
          [7584, 7430, 7872, 6931, 5779, 6835, 6643, 6106, 6144, 6394, 6624],
          [null, 8890, 9850, 8563, 7891, 8218, 7776, 7834, 8045, 8813, 9389],
          [null, null, null, null, 9658, 10061, 9542, 9734, 10810, 12250, 13037]
        ],
        prior: { cons: [4896, 4954, 4301, 3782, 3686, 3917, 3437, 1459, 1229, 1229, 1229] },
        note: 'Bloomberg’s EBITDA estimate (its own definition, below the model’s adjusted figure) was CUT hard in late 2025 — the FY2025/26 marks dropped as the non-cash SBC charge hit reported EBITDA — then the forward years re-rated up as the operating trend reasserted. Read the trend, not the level (BBG EBITDA ≠ the model’s).' }
    },
    note: 'Source: the BBG_CONSENSUS rolling archive — 11 TBBB snapshots (data_as_of Apr 2024 → Aug 2026); forward fiscal-year estimates mapped from each snapshot’s fy+ columns to fixed years, converted USD→MXN at ~19.2. The Summit model carries a single vintage (2026-05-22), shown on Results/Setup; per-vintage Summit is not available, so this tab is Street-only.'
  }
};
