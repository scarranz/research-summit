// submits-data/uber.js — every Summit DCF submit of Uber (UBER) with the valuation it recorded, for
// Valuation ▸ Submit History (js/submits.js).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled from the Summit Financial Data store (get_valuation_history('UBER') + get_fundamentals of each snapshot) on
// 2026-11-03 and written here verbatim; refresh by re-pulling after each new submit and APPENDING it — a submit is a
// vintage, never overwrite one. 2026-11-04 (after 3Q26) appended Nov 4 2026; it values FY2028 on both legs.
//
// Fields per submit: d (submit date) · after (last quarter reported at the time) · px (share price on the submit day, as
// the workbook recorded it) · wacc · coe · val.ev / val.pe = the workbook's valuation per method: method label verbatim,
// case, multiple, target year, basis, price target (1-year), fair value, upside (fair value ÷ px − 1, pre-computed by the
// store), quality flags (empty in all five). The three earlier submits carry an EV / EBITDA leg only; P / E first appears
// on 2026-08-05. Model and per-share values are both US$.
//
// model: the projections the submit was built on, per fiscal year, US$ millions (sh = diluted shares, millions), for the
// target year (FY2027; FY2028 on 2026-11-04) and the year before — the store's projection_history facts of that snapshot, labels per
// js/summit-map/uber.js: rev = REV, opi = ADJ_OPINC (Uber's non-GAAP operating income — the model's OP_INCOME row is 0 in
// every projected year), ebitda = EBITDA (Adjusted EBITDA), ni = EARNINGS (Non-GAAP net income), sh = SHARES.
// 2025-12-15: the store holds no ADJ_OPINC row for that snapshot, so opi is null. Growth, margins, EPS and the implied
// growth are worked out by the view.
//
// Check before freezing (playbook §6.3): price target ÷ fair value on 2026-08-05 is 1.060 (EV/EBITDA) and 1.064 (P/E) —
// the store read the right cells, no correction needed. Each target = multiple × the FY2027 metric + the FY2026 cash flow
// (FCFE per share on P/E, PV of FCF on EV/EBITDA) — DCF UBER.xlsm, read 2026-11-03.
// 2026-11-04: fair values match the workbook, price targets do NOT — the store read the next-year cells (see the fix notes).
export var uberSubmits = {
  ticker: 'UBER', name: 'Uber', ccy: 'US$', mccy: 'US$', pulled: '2026-11-04',
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
        pe: { method: 'P / E', kase: 'Base', mult: 22, year: 2027, basis: 'Forward', pt: 113.29164863, fv: 106.50707075, upside: 0.593344, flags: [] } } },
    { d: '2026-11-04', after: '3Q26', px: 72.27, wacc: 0.17210201, coe: 0.18167934,
      model: {
        2026: { rev:58170.56958, opi:9381.008082, ebitda:11458.7529788, ni:6909.91892005, sh:2029.82076 },
        2027: { rev:70385.946423, opi:11914.49514094, ebitda:14677.96998095, ni:9293.30620994, sh:1989.2243448 },
        2028: { rev:84340.87528448, opi:15800.57446364, ebitda:18239.82780259, ni:12640.45957091, sh:1949.4398579 } },
      val: {
        // pt corrected from the workbook on BOTH legs: the target year is FY2028, two years out, and the store read each price
        // target from the following year's cell (Q49 152.04, Q80 154.37) instead of the 1-year cell (P49 150.16, P80 155.08) —
        // the cells the workbook's own Output ▸ VALUATION block reports as the 1yr price targets (D206, D208). Fair values
        // match the store. Checked in DCF UBER.xlsm, Nov 4 2026.
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 16, year: 2028, basis: 'Forward', pt: 150.15677610, fv: 146.47878927, upside: 1.026827, flags: [],
              fix: 'the EV/EBITDA target is the 1-year price cell of the workbook (US$150.16); the data store recorded US$152.04, the cell of the following year' },
        pe: { method: 'P / E', kase: 'Base', mult: 23, year: 2028, basis: 'Forward', pt: 155.08170335, fv: 151.09103647, upside: 1.090647, flags: [],
              fix: 'the P/E target is the 1-year price cell of the workbook (US$155.08); the data store recorded US$154.36, the cell of the following year' } } }
  ]
};
