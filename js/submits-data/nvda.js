// submits-data/nvda.js — every Summit DCF submit of NVIDIA (NVDA) with the valuation it recorded, for
// Valuation ▸ Submit History (js/submits.js).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled from the Summit Financial Data store: valuation on 2026-11-09 (get_valuation_history('NVDA')), model rows from
// the get_fundamentals dumps of each snapshot (2026-11-02, scripts/consensus/dumps/nvda_summit), written here verbatim;
// refresh by re-pulling after each new submit and APPENDING it — a submit is a vintage, never overwrite one. Three
// submits; none after the 2026-08-28 one yet (NVIDIA reports 3Q FY27 on Nov 19 2026). Years are NVIDIA fiscal years.
//
// Fields per submit: d (submit date) · after (last quarter reported, NVIDIA fiscal) · px (share price on the submit day,
// as the workbook recorded it) · wacc · coe · val.ev / val.pe = the workbook's valuation per method: method label
// verbatim, case, multiple, target year, basis, price target (1-year), fair value, upside (fair value ÷ px − 1,
// pre-computed by the store), quality flags (empty in all three).
//
// model: the projections the submit was built on, US$ millions (sh = diluted shares, millions), for each leg's target year
// and the year before — projection_history facts, labels per js/summit-map/nvda.js: rev = REV, opi = OP_INCOME (adjusted:
// GAAP + acquisition-related costs), ebitda = EBITDA (the model's: adj. op. income + D&A + interest income), ni = EARNINGS
// (the model's adjusted earnings), sh = SHARES. In the 2025-12-12 submit the adjusted lines still added back stock-based
// compensation (NVIDIA's old non-GAAP); from 2026-03-04 they count it as a cost.
//
// Checks before freezing (playbook §6.3), logged in docs/profiles/NVDA.md (§6 #255, closed 2026-11-09): price target ÷ fair
// value = 1.281 / 1.281 (2026-03-04) and 1.112 / 1.112 (2026-08-28), both = the WACC / cost of equity to Jan 31, 2027.
// 2025-12-12 values each leg on a different year (P/E FY2027, EV/EBITDA FY2028): the P/E leg ties (1.026 = cost of equity to
// late January 2026); the EV/EBITDA fair value does NOT (1.056 implies ~3.5 months of discounting at its 21.0% WACC, where
// Jan 31, 2027 would give ≈ 1.24 and a fair value near $201). The Output sheet of that submit is no longer in Drive (the
// workbook holds the 2026-08-28 version), so it cannot be corrected: SAB chose to keep the submit with the caveat in the
// sources line (2026-11-09). The 2026-08-28 targets tie in DCF NVDA.xlsm (see nvda-target-multiple-data.js).
export var nvdaSubmits = {
  ticker: 'NVDA', name: 'NVIDIA', ccy: 'US$', mccy: 'US$', pulled: '2026-11-09', ebitdaLabel: 'EBITDA (model)',
  src: 'Summit DCF model (NVIDIA), the valuation block of each submit. Caveat: the 2025-12-12 EV/EBITDA fair value ($236.21) is not verified — it does not match that submit’s 21.0% WACC to the target date, and the workbook version of that day is no longer available; its price target ($249.54) is consistent. That submit’s model figures still add back stock-based compensation (NVIDIA’s non-GAAP before February 2026)',
  submits: [
    { d: '2025-12-12', after: '3Q26', px: 174.82, wacc: 0.20958122, coe: 0.20990347,
      model: {
        2026: { rev:213257.9, opi:136739.945, ebitda:140701.036, ni:115433.91368, sh:24374.98730122 },
        2027: { rev:337414.559, opi:236272.66777, ebitda:241983.23457929, ni:200295.88196881, sh:23945.97460245 },
        2028: { rev:492465.51975, opi:350866.87823265, ebitda:359232.68134422, ni:297476.97764229, sh:23945.97460245 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 16, year: 2028, basis: 'Forward', pt: 249.54012389, fv: 236.21140024, upside: 0.351169, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 24, year: 2027, basis: 'Forward', pt: 201.94572274, fv: 196.74284352, upside: 0.125402, flags: [] } } },
    { d: '2026-03-04', after: '4Q26', px: 182.58, wacc: 0.31183548, coe: 0.3123774,
      model: {
        2027: { rev:358397.79, opi:232948.76757776, ebitda:238464.08802776, ni:197065.01184532, sh:24193.59250739 },
        2028: { rev:478481.3715, opi:308361.85975341, ebitda:316727.27605957, ni:261600.44839074, sh:24193.59250739 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 18, year: 2028, basis: 'Forward', pt: 245.69140482, fv: 191.79850677, upside: 0.05049, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 22, year: 2028, basis: 'Forward', pt: 245.68406373, fv: 191.72052061, upside: 0.050063, flags: [] } } },
    { d: '2026-08-28', after: '2Q27', px: 220.045, wacc: 0.28219672, coe: 0.2826007,
      model: {
        2027: { rev:413720.31, opi:270322.4234, ebitda:276114.34995, ni:225369.786622, sh:24150.43800132 },
        2028: { rev:726095.487, opi:473995.6748358, ebitda:483970.92719182, ni:395606.11996991, sh:23786.87600264 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 18, year: 2028, basis: 'Forward', pt: 370.53626727, fv: 333.18941485, upside: 0.514188, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 22, year: 2028, basis: 'Forward', pt: 370.00450303, fv: 332.66645524, upside: 0.511811, flags: [] } } }

  ]
};
