// submits-data/tsm.js — every Summit DCF submit of TSMC (TSM) with the valuation it recorded, for
// Valuation ▸ Submit History (js/submits.js).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled from the Summit Financial Data store (get_valuation_history('TSM')) on 2026-10-28 and written here verbatim;
// refresh by re-pulling after each new submit and APPENDING it — a submit is a vintage, never overwrite one.
//
// Fields per submit: d (submit date) · after (last quarter reported at the time) · px (ADR price on the submit day, as
// the workbook recorded it) · wacc · coe · val.ev / val.pe = the workbook's valuation per method: method label and case
// verbatim (the workbook writes the case as "0", not "Base" — not shown on screen), multiple, target year, basis, price
// target (1-year), fair value, upside (fair value ÷ px − 1, pre-computed by the store), quality flags. Model and
// per-share values are both US$, per ADR (1 ADR = 5 common shares).
//
// model: the projections the submit was built on, per fiscal year, US$ millions (sh = ADR-equivalent shares, millions):
// rev = REV, opi = OP_INCOME, ebitda = EBITDA (the model's own EBITDA), ni = EARNINGS (net income attributable to the
// parent), sh = SHARES — the store's projection_history facts of that snapshot (get_metric_snapshot_series, pulled
// 2026-10-28). opi is null: the store holds 0 for OP_INCOME in both submits. Growth, margins, EPS and the implied
// growth are worked out by the view.
//
// Check before freezing (playbook §6.3), price target ÷ fair value per method: 10-15 1.038 / 1.038, 10-19 1.036 / 1.036
// — the store read the right cells, no correction needed.
export var tsmSubmits = {
  ticker: 'TSM', name: 'TSMC', ccy: 'US$', mccy: 'US$', pulled: '2026-10-28', ebitdaLabel: 'EBITDA',
  src: 'Summit DCF model (TSMC, DCF TSMC.xlsm), the valuation block of each submit',
  submits: [
    { d: '2026-10-15', after: '3Q26', px: 422.1, wacc: 0.19262128, coe: 0.19491583,
      model: {
        2026: { rev:167907.99, opi:null, ebitda:133913.30756152, ni:84061.60548444, sh:5186.474 },
        2027: { rev:227011.2295, opi:null, ebitda:172812.90819731, ni:109184.10816265, sh:5186.474 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: '0', mult: 12, year: 2027, basis: 'Forward', pt: 413.63229192, fv: 398.54332633, upside: -0.055808, flags: [] },
        pe: { method: 'P / E', kase: '0', mult: 19, year: 2027, basis: 'Forward', pt: 410.28229173, fv: 395.15526922, upside: -0.063835, flags: [] } } },
    { d: '2026-10-19', after: '3Q26', px: 424.675, wacc: 0.19346028, coe: 0.19575344,
      model: {
        2026: { rev:173880.63, opi:null, ebitda:138703.17478553, ni:87697.96672944, sh:5186.474 },
        2027: { rev:235653.5575, opi:null, ebitda:180870.52044043, ni:115217.79396477, sh:5186.474 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: '0', mult: 12, year: 2027, basis: 'Forward', pt: 431.59362263, fv: 416.59439698, upside: -0.019028, flags: [] },
        pe: { method: 'P / E', kase: '0', mult: 20, year: 2027, basis: 'Forward', pt: 453.91934689, fv: 437.97605299, upside: 0.031321, flags: [] } } }
  ]
};
