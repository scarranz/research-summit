// submits-data/meta.js — every Summit DCF submit of Meta Platforms (META) with the valuation it recorded, for
// Valuation ▸ Submit History (js/submits.js).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled from the Summit Financial Data store (get_valuation_history('META')) on 2026-10-28 and written here verbatim;
// refresh by re-pulling after each new submit and APPENDING it — a submit is a vintage, never overwrite one.
//
// Fields per submit: d (submit date) · after (last quarter reported at the time) · px (share price on the submit day, as
// the workbook recorded it) · wacc · coe · val.ev / val.pe = the workbook's valuation per method: method label and case
// verbatim, multiple, target year, basis, price target (1-year), fair value, upside (fair value ÷ px − 1, pre-computed by
// the store), quality flags. Model and per-share values are both US$.
//
// model: the projections the submit was built on, per fiscal year, US$ millions (sh = diluted shares, millions):
// rev = REV, opi = OP_INCOME, ebitda = EBITDA (adjusted, Bloomberg-comparable), ni = EARNINGS, sh = SHARES — the store's
// projection_history facts of that snapshot (get_metric_snapshot_series, pulled 2026-10-28). Growth, margins, EPS and
// the implied growth are worked out by the view.
//
// Check before freezing (playbook §6.3), price target ÷ fair value per method: 2026-02-03 1.115 / 1.117, 05-05 1.080 /
// 1.082, 08-04 1.049 / 1.050 — clean. 2026-10-22 (both methods target FY2028) 1.054 / 1.039: the store read BOTH targets
// from the following year's cells (Q49, Q80); corrected below to the 1-year cells P49 / P80, the ones its own fair values
// are discounted from (DCF META.xlsm, checked Oct 28 2026).
//
// skip: a submit the analyst ruled out, kept here so the record is complete; the view lists it under the chart and never
// draws it.
export var metaSubmits = {
  ticker: 'META', name: 'Meta', ccy: 'US$', mccy: 'US$', pulled: '2026-10-28',
  src: 'Summit DCF model (Meta, DCF META.xlsm), the valuation block of each submit',
  submits: [
    { d: '2025-12-15', after: '3Q25', px: 649.78, wacc: 0.12771905, coe: 0.130244,
      skip: 'set up wrongly — the EV/EBITDA leg targets FY2027 and the P/E leg FY2026, and the EV/EBITDA target sits below its own fair value; the workbook has been overwritten since, so it cannot be corrected (same pattern as the Dec-2025 Spotify submit)',
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 14, year: 2027, basis: 'Forward', pt: 1077.10032898, fv: 1080.23952191, upside: 0.662470, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 24, year: 2026, basis: 'Forward', pt: 810.54459922, fv: 806.20609985, upside: 0.240737, flags: [] } } },
    { d: '2026-02-03', after: '4Q25', px: 697.49, wacc: 0.12737144, coe: 0.130027,
      model: {
        2026: { rev:260278.76437607, opi:93082.83744214, ebitda:147069.0615913, ni:79877.78312841, sh:2574 },
        2027: { rev:311687.0729829, opi:112015.37494682, ebitda:179013.30837307, ni:95770.13456919, sh:2574 },
        2028: { rev:357521.44487119, opi:148089.9501856, ebitda:222203.75003992, ni:118490.1375442, sh:2574 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 12, year: 2027, basis: 'Forward', pt: 841.85498691, fv: 755.1275932, upside: 0.082636, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 22.5, year: 2027, basis: 'Forward', pt: 834.82919657, fv: 747.2296029, upside: 0.071312, flags: [] } } },
    { d: '2026-05-05', after: '1Q26', px: 604.96, wacc: 0.12408535, coe: 0.127024,
      model: {
        2026: { rev:259095.605, opi:92175.88825445, ebitda:147378.76814562, ni:78603.08613715, sh:2574 },
        2027: { rev:320301.21815, opi:120386.632023, ebitda:192825.94173726, ni:102490.42841084, sh:2574 },
        2028: { rev:367572.2608725, opi:160831.78043625, ebitda:237867.7109834, ni:129960.89108813, sh:2574 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 10.9, year: 2027, basis: 'Forward', pt: 812.06030148, fv: 751.94488385, upside: 0.242966, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 20, year: 2027, basis: 'Forward', pt: 809.59533687, fv: 748.37653835, upside: 0.237068, flags: [] } } },
    { d: '2026-08-04', after: '2Q26', px: 587.94, wacc: 0.12413531, coe: 0.12715,
      model: {
        2026: { rev:256178.173, opi:88737.63001, ebitda:143334.44317232, ni:75680.56662937, sh:2574 },
        2027: { rev:326206.33853124, opi:118779.24301765, ebitda:190857.97153898, ni:101026.32874897, sh:2574 },
        2028: { rev:392845.89920953, opi:174388.31885972, ebitda:271129.28043098, ni:140777.70698328, sh:2574 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 11, year: 2027, basis: 'Forward', pt: 808.90582321, fv: 771.17481721, upside: 0.311656, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 20, year: 2027, basis: 'Forward', pt: 795.98381687, fv: 758.02635441, upside: 0.289292, flags: [] } } },
    { d: '2026-10-22', after: '3Q26', px: 647.05, wacc: 0.12489743, coe: 0.127661,
      model: {
        2026: { rev:257833.27725, opi:90239.32041375, ebitda:144857.61151454, ni:73335.49742679, sh:2574 },
        2027: { rev:345404.91365636, opi:134906.51049337, ebitda:209214.5530875, ni:112093.75258107, sh:2574 },
        2028: { rev:447536.35396059, opi:189040.21348827, ebitda:297991.9407207, ni:154667.81860435, sh:2574 } },
      val: {
        // both targets corrected from the workbook: the store read the following year's cells (Q49 1,151.06 · Q80
        // 1,097.56) instead of the 1-year cells (P49 1,119.61 · P80 1,083.32) its own fair values are discounted from.
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 10, year: 2028, basis: 'Forward', pt: 1119.61051597, fv: 1092.48742814, upside: 0.688413, flags: [],
              fix: 'the EV/EBITDA target is the 1-year price cell of the workbook (US$1,119.61); the data store recorded US$1,151.06, the cell of the following year' },
        pe: { method: 'P / E', kase: 'Base', mult: 18, year: 2028, basis: 'Forward', pt: 1083.32403832, fv: 1056.63999667, upside: 0.633011, flags: [],
              fix: 'the P/E target is the 1-year price cell of the workbook (US$1,083.32); the data store recorded US$1,097.56, the cell of the following year' } } }
  ]
};
