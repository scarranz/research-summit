// amzn-target-multiple-data.js — the Summit DCF model's valuation of Amazon (AMZN), one row per submit, for
// Valuation ▸ Target Multiple / PEG (VA-TM, docs/PROFILE_PLAYBOOK.md §14).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled once from the Summit Financial Data store on 2026-10-29 (the 2026-10-30 submit appended on 2026-10-30) and written here; refresh by re-pulling when a new
// snapshot is submitted and APPENDING a row (each row is a vintage — never overwrite one).
//
//   val      get_valuation_history('AMZN') — the workbook's Output ▸ VALUATION block, per method, verbatim: multiple,
//            target year, basis, price target (1-yr), fair value, upside (pre-computed by the store), quality flags (none).
//   y        get_fundamentals, projection_history, source DEFAULT (labels per js/summit-map/amzn.js): REV · EBITDA (adj.:
//            operating income + D&A + SBC) · EARNINGS (the model's adjusted earnings, without non-operating gains) · SHARES
//            (diluted, millions; the model holds them flat at the FY2025 count). FY2025 = reported (10-K), act:true.
//   cons     the same model's Bloomberg consensus columns (REV_BBG_EST · EBITDA_BBG_EST · EARNINGS_BBG_EST).
//            EARNINGS_BBG_EST is GAAP net income (with the Anthropic gains), so it is not comparable with EARNINGS.
//
// The 2025-12-18 submit is left out, as everywhere in this profile (SAB, Oct 29 2026: price target ÷ fair value differs
// between its two methods and its P/E leg is marked Trailing — docs/profiles/AMZN.md, doubt 4).
export var AMZN_TM = {
  model: 'be6d6393-ae5b-4b62-b59b-883fc0e31dcb', pulled: '2026-10-30',
  snaps: [
    { d: '2026-02-10', after: '4Q25', px: 210.2804, wacc: 0.19403389,
      val: {
        ev: { method: 'EV / EBITDA', mult: 10, year: 2027, basis: 'Forward', pt: 241.43667956, fv: 206.270814, upside: -0.019068, flags: [] },
        pe: { method: 'P / E',       mult: 28, year: 2027, basis: 'Forward', pt: 254.85816788, fv: 217.00464265, upside: 0.031978, flags: [] }
      },
      y: {
        2025: { rev: 716924, ebitda: 165198, earn: 62995, sh: 10827, act: true },
        2026: { rev: 818015.32, ebitda: 199876.8155, earn: 79983.4964, sh: 10827 },
        2027: { rev: 927372.4091, ebitda: 259787.2766, earn: 98612.258, sh: 10827 },
        2028: { rev: 1096753.2888, ebitda: 278012.8876, earn: 109376.7957, sh: 10827 }
      },
      cons: {
        2026: { rev: 800775.2206, ebitda: 205916.0952, earn: 84854.3968 },
        2027: { rev: 893669.5439, ebitda: 254062.3, earn: 104484.8113 },
        2028: { rev: 994199.6552, ebitda: 308602.7826, earn: 128497.9259 }
      } },
    { d: '2026-05-05', after: '1Q26', px: 273.515, wacc: 0.20185877,
      val: {
        ev: { method: 'EV / EBITDA', mult: 12, year: 2027, basis: 'Forward', pt: 290.6838979, fv: 257.58146281, upside: -0.058255, flags: [] },
        pe: { method: 'P / E',       mult: 29, year: 2027, basis: 'Forward', pt: 291.95147087, fv: 258.05495168, upside: -0.056524, flags: [] }
      },
      y: {
        2025: { rev: 716924, ebitda: 165198, earn: 62995, sh: 10827, act: true },
        2026: { rev: 823035.4, ebitda: 208442.6107, earn: 85902.2529, sh: 10827 },
        2027: { rev: 941960.2085, ebitda: 261050.3488, earn: 108303.8908, sh: 10827 },
        2028: { rev: 1115059.7646, ebitda: 291994.0903, earn: 114955.4104, sh: 10827 }
      },
      cons: {
        2026: { rev: 819962.6618, ebitda: 210933.2143, earn: 92867.7321 },
        2027: { rev: 925181.2, ebitda: 266809.25, earn: 107941.7636 },
        2028: { rev: 1023818.1538, ebitda: 328907.6667, earn: 135110.3529 }
      } },
    { d: '2026-08-04', after: '2Q26', px: 277.42, wacc: 0.19382767,
      val: {
        ev: { method: 'EV / EBITDA', mult: 9.5, year: 2027, basis: 'Forward', pt: 292.99431231, fv: 272.55247943, upside: -0.017546, flags: [] },
        pe: { method: 'P / E',       mult: 28, year: 2027, basis: 'Forward', pt: 314.16989145, fv: 291.82140952, upside: 0.051912, flags: [] }
      },
      y: {
        2025: { rev: 716924, ebitda: 165198, earn: 62995, sh: 10827, act: true },
        2026: { rev: 831123.78, ebitda: 250686.7223, earn: 92038.956, sh: 10827 },
        2027: { rev: 959799.9897, ebitda: 332725.5287, earn: 119053.4144, sh: 10827 },
        2028: { rev: 1101189.603, ebitda: 430087.7403, earn: 137411.987, sh: 10827 }
      },
      cons: {
        2026: { rev: 827451.7846, ebitda: 216614.3256, earn: 114401.9615 },
        2027: { rev: 946680.127, ebitda: 280171.7381, earn: 116800.6296 },
        2028: { rev: 1069017.1087, ebitda: 354937.9032, earn: 149737.5385 }
      } },
    { d: '2026-10-30', after: '3Q26', px: 238.3514, wacc: 0.19710537,
      val: {
        ev: { method: 'EV / EBITDA', mult: 9.5, year: 2027, basis: 'Forward', pt: 241.66263331, fv: 234.38925674, upside: -0.016623, flags: [] },
        pe: { method: 'P / E',       mult: 25, year: 2027, basis: 'Forward', pt: 271.68451064, fv: 263.31668943, upside: 0.104742, flags: [] }
      },
      y: {
        2025: { rev: 716924, ebitda: 165198, earn: 62995, sh: 10827, act: true },
        2026: { rev: 831956.95, ebitda: 218164.1559, earn: 90332.9513, sh: 10827 },
        2027: { rev: 968050.199, ebitda: 280123.5746, earn: 117182.2364, sh: 10827 },
        2028: { rev: 1131699.845, ebitda: 361508.376, earn: 153476.8995, sh: 10827 }
      },
      cons: {
        2026: { rev: 829167.6119, ebitda: 222017.7273, earn: 138214.5077 },
        2027: { rev: 956397.7015, ebitda: 286891.0476, earn: 118817.2615 },
        2028: { rev: 1102181.5962, ebitda: 365202.9429, earn: 153896.3529 }
      } }
  ]
};
