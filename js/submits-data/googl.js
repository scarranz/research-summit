// submits-data/googl.js — every Summit DCF submit of Alphabet (GOOGL) with the valuation it recorded, for
// Valuation ▸ Submit History (js/submits.js).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled from the Summit Financial Data store (get_valuation_history('GOOGL')) on 2026-10-28 and written here verbatim;
// the 2026-10-29 submit (after 3Q26) appended on 2026-10-30 (get_valuation_history + get_fundamentals of that snapshot);
// refresh by re-pulling after each new submit and APPENDING it — a submit is a vintage, never overwrite one.
//
// Fields per submit: d (submit date) · after (last quarter reported at the time) · px (share price on the submit day, as
// the workbook recorded it) · wacc · coe · val.ev / val.pe = the workbook's valuation per method: method label verbatim,
// case, multiple, target year, basis, price target (1-year), fair value, upside (fair value ÷ px − 1, pre-computed by the
// store), quality flags. Model and per-share values are both US$.
//
// model: the projections the submit was built on, per fiscal year, US$ millions (sh = diluted shares Class A+B+C,
// millions): rev = REV, opi = OP_INCOME, ebitda = EBITDA (the model's adjusted EBITDA: op. income + D&A + SBC),
// ni = EARNINGS (model earnings, adjusted), sh = SHARES — the store's projection_history facts of that snapshot
// (get_metric_snapshot_series, pulled 2026-10-28; 2026-10-29 from get_fundamentals, pulled 2026-10-30 — FY2028 added
// because its P/E leg targets FY2028). Growth, margins, EPS and the implied growth are worked out by the view.
//
// Check before freezing (playbook §6.3): price target ÷ fair value matches across the two methods of each submit
// (10-29: 1.027 / 1.029; 08-06: 1.066 / 1.067; 07-28: 1.071 / 1.072) — the store read the right cells, no correction
// needed. 10-29: the P/E leg moved its target year from FY2027 to FY2028 (20.0×); EV/EBITDA stays 12.7× FY2027.
//
// skip: a submit the analyst ruled out, kept here so the record is complete; the view lists it under the chart and never
// draws it.
export var googlSubmits = {
  ticker: 'GOOGL', name: 'Alphabet', ccy: 'US$', mccy: 'US$', pulled: '2026-10-30',
  src: 'Summit DCF model (Alphabet, DCF GOOGL - New.xlsm), the valuation block of each submit',
  submits: [
    { d: '2026-07-23', after: '2Q26', px: 320.03, wacc: 0.17268749, coe: 0.17491231,
      skip: 'saved while the model was being updated (operating income blank, the EV/EBITDA leg targets FY2029) — left out everywhere in this profile (SAB, Oct 26 2026)',
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 14, year: 2029, basis: 'Forward', pt: 490.00840173, fv: 381.04037312, upside: 0.190640, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 30, year: 2027, basis: 'Forward', pt: 434.96720594, fv: 405.11413539, upside: 0.265863, flags: [] } } },
    { d: '2026-07-28', after: '2Q26', px: 334.1458, wacc: 0.17420525, coe: 0.17634507,
      model: {
        2026: { rev:491250.91655879, opi:169768.29380799, ebitda:232588.07079375, ni:138527.07953296, sh:12317.14285714 },
        2027: { rev:604679.36843813, opi:220229.2801053, ebitda:307907.78852883, ni:180147.5179671, sh:12317.14285714 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 12.7, year: 2027, basis: 'Forward', pt: 318.50248017, fv: 297.37497342, upside: -0.110044, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 21.3, year: 2027, basis: 'Forward', pt: 317.52872317, fv: 296.23520144, upside: -0.113455, flags: [] } } },
    { d: '2026-08-06', after: '2Q26', px: 357.6537, wacc: 0.17152219, coe: 0.17349057,
      model: {
        2026: { rev:506294.91059347, opi:184812.28784267, ebitda:248305.11418485, ni:147945.05585094, sh:12317.14285714 },
        2027: { rev:629543.4705695, opi:245093.38223666, ebitda:334682.20391477, ni:196620.49834001, sh:12317.14285714 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 12.7, year: 2027, basis: 'Forward', pt: 344.59926068, fv: 323.31494206, upside: -0.096011, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 24, year: 2027, basis: 'Forward', pt: 391.5238559, fv: 367.09294023, upside: 0.026392, flags: [] } } },
    { d: '2026-10-29', after: '3Q26', px: 283.82, wacc: 0.16784548, coe: 0.17017318,
      model: {
        2026: { rev:501466.72629195, opi:169765.84524795, ebitda:233665.1570038, ni:135862.61355492, sh:12317.14285714 },
        2027: { rev:622531.14535542, opi:211714.31885148, ebitda:300882.40101674, ni:169758.90763682, sh:12317.14285714 },
        2028: { rev:783070.15487842, opi:303354.06069016, ebitda:426020.2269276, ni:243935.70628768, sh:12317.14285714 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 12.7, year: 2027, basis: 'Forward', pt: 307.70721313, fv: 299.57583279, upside: 0.055513, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 20, year: 2028, basis: 'Forward', pt: 387.7261439, fv: 376.81736928, upside: 0.327663, flags: [] } } }
  ]
};
