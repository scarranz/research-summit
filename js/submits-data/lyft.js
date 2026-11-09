// submits-data/lyft.js — every Summit DCF submit of Lyft (LYFT) with the valuation it recorded, for Valuation ▸ Submit History (js/submits.js).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b). Read on 2026-11-05 from the analyst's
// local DCF LYFT.xlsm (sheet Projection History; the Summit MCP was not used), four distinct submits: 2025-12-15, 2026-02-11, 2026-05-08 and
// 2026-08-07 (the last is stored twice in the file with the same state). Refresh by re-reading after each new submit and APPENDING a row — a submit is
// a vintage, never overwrite one. No submit after the 3Q26 print exists yet.
//
// Fields per submit: d (submit date) · after (last quarter reported at the time) · px (share price on the submit day, as the workbook recorded it) ·
// wacc · coe · val.ev = the workbook's valuation: method, case, multiple, target year, basis, price target (1-year), fair value, upside (fair value ÷
// px − 1, computed here). Lyft is valued on EV / EBITDA only in every submit; there is no P / E leg. Model and per-share values are US$.
//
// model: the projections the submit was built on, per fiscal year (US$ millions): rev = REV, ebitda = EBITDA (core row; the separate ADJ_EBITDA row
// differs for FY2026 in the last submit, doubt 3). NOT carried, because the model's rows are in doubt (docs/profiles/LYFT.md section 1b): opi (the
// core OP_INCOME row is 0 for FY2025-27, doubt 2), ni (EARNINGS is annual-only and disagrees with the 10-K, doubts 2 and 4) and sh (SHARES jumps
// from 417.7 to 359.2, doubt 4). They stay null until the model's author answers.
export var lyftSubmits = {
  ticker: 'LYFT', name: 'Lyft', ccy: 'US$', mccy: 'US$', pulled: '2026-11-05',
  src: 'Summit DCF model (Lyft), the valuation block of each submit',
  submits: [
    { d: '2025-12-15', after: '3Q25', px: 18.85, wacc: 0.17310030, coe: 0.18308807,
      model: {
        2026: { rev:7728.9, opi:null, ebitda:780.9, ni:null, sh:null },
        2027: { rev:8806.8, opi:null, ebitda:1109.3, ni:null, sh:null } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 9, year: 2027, basis: 'Forward', pt: 32.01181173, fv: 31.95606236, upside: 0.695282, flags: [] } } },
    { d: '2026-02-11', after: '4Q25', px: 13.99, wacc: 0.25764671, coe: 0.25764671,
      model: {
        2026: { rev:7551.7, opi:null, ebitda:762.4, ni:null, sh:null },
        2027: { rev:8629.3, opi:null, ebitda:937.7, ni:null, sh:null } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 8, year: 2027, basis: 'Forward', pt: 28.20778430, fv: 23.02853861, upside: 0.646071, flags: [] } } },
    { d: '2026-05-08', after: '1Q26', px: 14.368, wacc: 0.21842525, coe: 0.25121397,
      model: {
        2026: { rev:7372.7, opi:null, ebitda:683.2, ni:null, sh:null },
        2027: { rev:8424.6, opi:null, ebitda:930.3, ni:null, sh:null } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 5, year: 2027, basis: 'Forward', pt: 18.72702271, fv: 16.47245099, upside: 0.146468, flags: [] } } },
    { d: '2026-08-07', after: '2Q26', px: 17.105, wacc: 0.21278120, coe: 0.23957384,
      model: {
        2026: { rev:7268.7, opi:null, ebitda:718.8, ni:null, sh:null },
        2027: { rev:8068.5, opi:null, ebitda:959.0, ni:null, sh:null } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 7, year: 2027, basis: 'Forward', pt: 23.76254489, fv: 21.99783636, upside: 0.286047, flags: [] } } }
  ]
};
