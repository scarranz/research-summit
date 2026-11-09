// submits-data/tbbb.js — every Summit DCF submit of Tiendas 3B (TBBB) with the valuation it recorded, for
// Valuation ▸ Submit History (js/submits.js).
//
// FROZEN ON PURPOSE, NOT LIVE (playbook rule 10, §20b). Read on 2026-11-02 from the local model, DCF TBBB.xlsm, tab
// "Projection History" (the four submits, IDs 1-4, each with its valuation block; the block dated 2026-11-02 is not a submit and is ignored), by
// scripts/consensus/tbbb/build_tbbb_summit.py. Refresh = re-read after each new submit and APPEND it; a submit is a
// vintage, never overwrite one.
//
// Fields per submit: d (submit date) · after (the quarter the workbook labels the submit with) · px (share price on the
// submit day, US$, as the workbook recorded it) · wacc · coe · val.ev = the EV/EBITDA valuation (multiple, target year,
// 1-year price target, fair value, upside = fair value ÷ px − 1). The model is built in Mexican pesos and the workbook
// records price and targets in US$ (NYSE), converting at its own rate (Ps.17.0-18.6 per US$ across the four submits).
// model: the projections each submit was built on, per fiscal year, Ps. millions (sh = diluted shares, millions):
// rev = REV, ebitda = EBITDA (the model's own line, the one the EV/EBITDA leg multiplies), ni = EARNINGS.
//
// Things to know when reading it (logged in docs/profiles/TBBB.md):
//  - Only the EV/EBITDA leg is carried. The P/E block of every submit is #VALUE! / #SPILL! (and -US$78 in the first
//    submit), so there is no P/E target to show.
//  - The workbook labels the EV/EBITDA valuation 'Base' on some rows and 'Bull' on others of the same submit with identical
//    numbers; it is shown as Base (the label on the D&A row the valuation sits on).
//  - The model's EBITDA changed definition between the May 8 and Aug 13 submits (FY2027 Ps.5,762M to Ps.3,839M with
//    revenue unchanged), so the model rows are not comparable across that line, and the Aug 13 target (30x on 2028) is not
//    like-for-like with the May 8 target (25x on 2027). It is a lease-adjusted EBITDA that ties to neither reported nor
//    company-adjusted EBITDA.
//  - Diluted shares in the model are 115.0M (139.6M in the first submit) against 162.5M diluted in the 3Q26 release and a
//    fully diluted count of 165.4M; the target is not per these shares, it is the workbook's own per-share figure.
export var tbbbSubmits = {
  ticker: 'TBBB', name: 'Tiendas 3B', ccy: 'US$', mccy: 'Ps.', pulled: '2026-11-02', ebitdaLabel: 'Model EBITDA',
  src: 'Summit DCF model (Tiendas 3B), the valuation block of each submit',
  submits: [
    { d: '2025-12-12', after: '3Q25', px: 33.01, wacc: 0.07590066, coe: 0.08661157,
      model: {
        2026: { rev:103696.3, ebitda:3190.14, ni:-41.85, sh:139.6067 },
        2027: { rev:136092.84, ebitda:6356.13, ni:1930.6, sh:139.6067 },
        2028: { rev:174011.6, ebitda:9387.68, ni:3487.47, sh:139.6067 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 25, year: 2027, basis: 'Forward', pt: 42.95138227, fv: 37.55917838, upside: 0.137812, flags: [] } } },
    { d: '2026-03-13', after: '4Q25', px: 33.08, wacc: 0.07499628, coe: 0.10616893,
      model: {
        2026: { rev:102534.13, ebitda:2555.52, ni:-861.44, sh:115.0229 },
        2027: { rev:135089.08, ebitda:5837.26, ni:1338.07, sh:115.0229 },
        2028: { rev:175276.1, ebitda:8727.95, ni:2841.17, sh:115.0229 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 25, year: 2027, basis: 'Forward', pt: 36.18992714, fv: 34.1488509, upside: 0.032311, flags: [] } } },
    { d: '2026-05-08', after: '1Q26', px: 37.965, wacc: 0.0776913, coe: 0.10616893,
      model: {
        2026: { rev:103159.0, ebitda:2374.73, ni:-985.36, sh:115.0229 },
        2027: { rev:134371.7, ebitda:5762.29, ni:1186.33, sh:115.0229 },
        2028: { rev:175099.86, ebitda:8691.42, ni:2608.51, sh:115.0229 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 25, year: 2027, basis: 'Forward', pt: 34.52210837, fv: 32.88502852, upside: -0.133807, flags: [] } } },
    { d: '2026-08-13', after: '2Q26', px: 49.365, wacc: 0.07882451, coe: 0.10391358,
      model: {
        2026: { rev:106042.06, ebitda:2547.66, ni:-962.55, sh:115.0229 },
        2027: { rev:141324.66, ebitda:3838.52, ni:1385.92, sh:115.0229 },
        2028: { rev:184993.98, ebitda:5507.57, ni:2914.45, sh:115.0229 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 30, year: 2028, basis: 'Forward', pt: 62.8548259, fv: 58.85475373, upside: 0.192236, flags: [] } } }
  ]
};
