// submits-data/spot.js — every Summit DCF submit of Spotify (SPOT) with the valuation it recorded, for
// Valuation ▸ Submit History (js/submits.js).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled from the Summit Financial Data store (get_valuation_history('SPOT')) on 2026-10-28 and written here verbatim;
// refresh by re-pulling after each new submit and APPENDING it — a submit is a vintage, never overwrite one.
//
// Fields per submit: d (submit date) · after (last quarter reported at the time) · px (share price on the submit day, as
// the workbook recorded it) · wacc · val.ev / val.pe = the workbook's valuation per method: method label verbatim, case,
// multiple, target year, basis, price target (1-year), fair value, upside (fair value ÷ px − 1, pre-computed by the
// store), quality flags. Per-share values are US$: the model is built in EUR but the workbook records the price and the
// targets in the share's trading currency (NYSE, US$) — see js/overviews/spot-fx-data.js.
//
// coe: cost of equity of the submit (the P/E leg is discounted at it, the EV/EBITDA leg at the WACC).
// model: the projections the submit was built on, per fiscal year, EUR millions (sh = diluted shares, millions):
// rev = REV, opi = OP_INCOME, ebitda = ADJ_EBITDA, ni = EARNINGS, sh = SHARES — the store's projection_history facts
// of that snapshot (get_metric_snapshot_series, pulled 2026-10-28). Growth, margins, EPS and the implied growth are
// worked out by the view from these; nothing else is retyped.
//
// skip: a submit the analyst ruled out, kept here so the record is complete; the view lists it under the chart and never
// draws it.
export var spotSubmits = {
  ticker: 'SPOT', name: 'Spotify', ccy: 'US$', mccy: '€', pulled: '2026-10-28',
  src: 'Summit DCF model (Spotify), the valuation block of each submit',
  submits: [
    { d: '2025-12-18', after: '3Q25', px: 567.23, wacc: 0.1613306,
      skip: 'set up wrongly — the EV/EBITDA leg targets FY2029 and the P/E leg FY2026 at 49× (SAB, Oct 28 2026)',
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 18, year: 2029, basis: 'Forward', pt: 936.41438385, fv: 751.95199776, upside: 0.325656, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 49, year: 2026, basis: 'Forward', pt: 817.29272498, fv: 812.91331394, upside: 0.433128, flags: [] } } },
    { d: '2026-02-09', after: '3Q25', px: 414.74, wacc: 0.22858119, coe: 0.23214838,
      model: {
        2026: { rev:19580.87240264, opi:2852.91752363, ebitda:3149.72725766, ni:2567.62577127, sh:206.990369 },
        2027: { rev:22197.82946322, opi:3977.62366023, ebitda:4256.20831595, ni:3579.86129421, sh:206.990369 },
        2028: { rev:24857.75419941, opi:4859.03515398, ebitda:5109.1847092, ni:4373.13163858, sh:206.990369 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 18, year: 2027, basis: 'Forward', pt: 498.83920135, fv: 533.87521307, upside: 0.287253, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 20, year: 2027, basis: 'Forward', pt: 434.04225056, fv: 467.15870951, upside: 0.126389, flags: [] } } },
    { d: '2026-04-28', after: '1Q26', px: 479.84, wacc: 0.22867912, coe: 0.23159002,
      model: {
        2026: { rev:19736.51692164, opi:2922.73600027, ebitda:3268.44332259, ni:2685.49935023, sh:209.25875619 },
        2027: { rev:21963.29554734, opi:3659.47250481, ebitda:3983.10650028, ni:3335.84363524, sh:208.00833939 },
        2028: { rev:24853.95803119, opi:4770.96038206, ebitda:5024.08621026, ni:4657.51446188, sh:206.75792258 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 20.5, year: 2027, basis: 'Forward', pt: 537.41999755, fv: 467.50870389, upside: -0.025699, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 28, year: 2027, basis: 'Forward', pt: 541.65093757, fv: 470.43533235, upside: -0.0196, flags: [] } } },
    { d: '2026-08-05', after: '2Q26', px: 482.43, wacc: 0.20734415, coe: 0.20991572,
      model: {
        2026: { rev:19761.54397297, opi:2969.73037586, ebitda:3345.45938826, ni:2821.63673076, sh:206.36349383 },
        2027: { rev:23118.84472938, opi:3914.0340267, ebitda:4258.223604, ni:3234.7830734, sh:202.21781467 },
        2028: { rev:27097.44410447, opi:5259.74111029, ebitda:5535.32803493, ni:4363.44402511, sh:198.0721355 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 20.5, year: 2027, basis: 'Forward', pt: 561.14924167, fv: 519.873353, upside: 0.077614, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 28, year: 2027, basis: 'Forward', pt: 517.9130953, fv: 479.40371136, upside: -0.006273, flags: [] } } },
    { d: '2026-10-22', after: '3Q26', px: 583.59, wacc: 0.20427911, coe: 0.20636688,
      model: {
        2026: { rev:19533.80704245, opi:2880.57764364, ebitda:3289.68550364, ni:2743.1823264, sh:207.08210948 },
        2027: { rev:22753.47909864, opi:3825.0199933, ebitda:4173.55599429, ni:3163.27466133, sh:203.65504596 },
        2028: { rev:26667.23019887, opi:5071.97424627, ebitda:5352.98004747, ni:4212.67944425, sh:200.22798244 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 20.5, year: 2027, basis: 'Forward', pt: 532.86350547, fv: 514.20235111, upside: -0.118898, flags: [] },
        // pt corrected from the workbook: the store read the P/E price target from the next year's cell (Q80, 672.78)
        // instead of the 1-year cell (P80, 645.14) — the one its own fair value is discounted from (O80 = P80 × the
        // P73 factor) and the cell every EV/EBITDA target comes from (P49). Checked in DCF SPOT.xlsm, Oct 28 2026.
        pe: { method: 'P / E', kase: 'Base', mult: 28, year: 2028, basis: 'Forward', pt: 645.13951888, fv: 622.33963145, upside: 0.066399, flags: [],
              fix: 'the P/E target is the 1-year price cell of the workbook (US$645.14); the data store recorded US$672.78, the cell of the following year' } } }
  ]
};
