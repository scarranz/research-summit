// submits-data/uber.js — every Summit DCF submit of Uber (UBER) with the valuation it recorded, for
// Valuation ▸ Submit History (js/submits.js).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled from the Summit Financial Data store (get_valuation_history('UBER') + get_fundamentals of each snapshot) on
// 2026-11-03 and written here verbatim; refresh by re-pulling after each new submit and APPENDING it — a submit is a
// vintage, never overwrite one. No submit after the 3Q26 print exists yet (SAB works on 2026-08-05, Nov 3 2026).
//
// Fields per submit: d (submit date) · after (last quarter reported at the time) · px (share price on the submit day, as
// the workbook recorded it) · wacc · coe · val.ev / val.pe = the workbook's valuation per method: method label verbatim,
// case, multiple, target year, basis, price target (1-year), fair value, upside (fair value ÷ px − 1, pre-computed by the
// store), quality flags (empty in all four). The three earlier submits carry an EV / EBITDA leg only; P / E first appears
// on 2026-08-05. Model and per-share values are both US$.
//
// model: the projections the submit was built on, per fiscal year, US$ millions (sh = diluted shares, millions), for the
// target year (FY2027) and the year before — the store's projection_history facts of that snapshot, labels per
// js/summit-map/uber.js: rev = REV, opi = ADJ_OPINC (Uber's non-GAAP operating income — the model's OP_INCOME row is 0 in
// every projected year), ebitda = EBITDA (Adjusted EBITDA), ni = EARNINGS (Non-GAAP net income), sh = SHARES.
// 2025-12-15: the store holds no ADJ_OPINC row for that snapshot, so opi is null. Growth, margins, EPS and the implied
// growth are worked out by the view.
//
// Check before freezing (playbook §6.3): price target ÷ fair value on 2026-08-05 is 1.060 (EV/EBITDA) and 1.064 (P/E) —
// the store read the right cells, no correction needed. Each target = multiple × the FY2027 metric + the FY2026 cash flow
// (FCFE per share on P/E, PV of FCF on EV/EBITDA) — DCF UBER.xlsm, read 2026-11-03.
export var uberSubmits = {
  ticker: 'UBER', name: 'Uber', ccy: 'US$', mccy: 'US$', pulled: '2026-11-03',
  src: 'Summit DCF model (Uber), the valuation block of each submit',
  submits: [
    { d: '2025-12-15', after: '3Q25', px: 81.60, wacc: 0.12607052, coe: 0.12967284,
      model: {
        2026: { rev:61688.927134, opi:null, ebitda:11451.07575748, ni:7617.91164072, sh:2023.98294553 },
        2027: { rev:73404.78518828, opi:null, ebitda:15334.97849167, ni:10578.63812314, sh:1961.34677996 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 15, year: 2027, basis: 'Forward', pt: 118.93034624, fv: 118.57456948, upside: 0.453120, flags: [] } } },
    { d: '2026-02-05', after: '4Q25', px: 75.745, wacc: 0.16929553, coe: 0.17805748,
      model: {
        2026: { rev:61971.75713, opi:8664.2208499, ebitda:11020.97559019, ni:6931.37667992, sh:2012.80846178 },
        2027: { rev:72490.386432, opi:10945.03461162, ebitda:13643.62512317, ni:8756.0276893, sh:1922.232081 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 15, year: 2027, basis: 'Forward', pt: 100.38370137, fv: 87.18430226, upside: 0.151024, flags: [] } } },
    { d: '2026-05-06', after: '1Q26', px: 77.92, wacc: 0.16255254, coe: 0.1707872,
      model: {
        2026: { rev:58695.206472, opi:9121.9644299, ebitda:11546.74497612, ni:7067.00261102, sh:1979.56960298 },
        2027: { rev:68127.690975, opi:11465.7304614, ebitda:14817.43643425, ni:9172.58436912, sh:1890.48897085 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 14, year: 2027, basis: 'Forward', pt: 102.22731305, fv: 92.62647608, upside: 0.188738, flags: [] } } },
    { d: '2026-08-05', after: '2Q26', px: 66.845, wacc: 0.1554282, coe: 0.16450827,
      model: {
        2026: { rev:58066.7482, opi:9312.6263, ebitda:11381.8565, ni:6870.6308, sh:2009.4255 },
        2027: { rev:70356.422, opi:11921.4602, ebitda:15891.1144, ni:9656.3828, sh:1939.0956 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 14, year: 2027, basis: 'Forward', pt: 107.57945532, fv: 101.45848181, upside: 0.517817, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 22, year: 2027, basis: 'Forward', pt: 113.29164863, fv: 106.50707075, upside: 0.593344, flags: [] } } }
  ]
};
