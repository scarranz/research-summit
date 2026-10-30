// submits-data/amzn.js — every Summit DCF submit of Amazon (AMZN) with the valuation it recorded, for
// Valuation ▸ Submit History (js/submits.js).
//
// FROZEN ON PURPOSE, NOT LIVE (SAB, Oct 15 2026: Summit numbers are coded directly; playbook rule 10, §20b).
// Pulled from the Summit Financial Data store (get_valuation_history('AMZN')) on 2026-10-29 and written here verbatim;
// refresh by re-pulling after each new submit and APPENDING it — a submit is a vintage, never overwrite one.
//
// Fields per submit: d · after · px (share price the workbook recorded) · wacc · coe · val.ev / val.pe = the workbook's
// valuation per method (label verbatim, case, multiple, target year, basis, 1-year price target, fair value, upside
// pre-computed by the store, quality flags). Model and per-share values are both US$.
//
// model: the projections each submit was built on, per fiscal year, US$ millions: rev = REV · opi = OPINC + OPINC2 + OPINC3
// (the three segments; the model's own OP_INCOME projection row is not populated — js/summit-map/amzn.js, doubt 1) ·
// ebitda = EBITDA (the model's adjusted EBITDA: op. income + D&A + SBC) · ni = EARNINGS (model earnings, adjusted) ·
// sh = SHARES (diluted) — projection_history of each snapshot (get_fundamentals / get_metric_snapshot_series, 2026-10-29).
//
// Check before freezing (playbook §6.3): price target ÷ fair value per method — 08-04: 1.075 / 1.077 · 05-05: 1.129 /
// 1.131 · 02-10: 1.171 / 1.175 (consistent); 12-18: 1.002 / 1.132 → skipped (SAB, Oct 29 2026, docs/profiles/AMZN.md doubt 4).
export var amznSubmits = {
  ticker: 'AMZN', name: 'Amazon', ccy: 'US$', mccy: 'US$', pulled: '2026-10-29',
  src: 'Summit DCF model (Amazon), the valuation block of each submit',
  submits: [
    { d: '2025-12-18', after: '3Q25', px: 227.1146, wacc: 0.13999758, coe: 0.14268535,
      skip: 'price target ÷ fair value differs between the two methods (1.002 on EV/EBITDA, 1.132 on P/E) and the P/E leg is marked Trailing — the store read inconsistent cells; left out everywhere in this profile (SAB, Oct 29 2026)',
      model: {
        2026: { rev:805681.1346, opi:95834.8973, ebitda:198532.5201, ni:77850.1567, sh:10721 },
        2027: { rev:909802.8416, opi:122540.8099, ebitda:237442.2487, ni:99503.3949, sh:10721 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 15, year: 2027, basis: 'Forward', pt: 338.17657095, fv: 337.57398098, upside: 0.486360, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 25, year: 2027, basis: 'Trailing', pt: 240.41832537, fv: 212.45093905, upside: -0.064565, flags: [] } } },
    { d: '2026-02-10', after: '4Q25', px: 210.2804, wacc: 0.19403389, coe: 0.19857712,
      model: {
        2026: { rev:818015.32, opi:99180.8655, ebitda:199876.8155, ni:79983.4964, sh:10827 },
        2027: { rev:927372.4091, opi:122194.2098, ebitda:259787.2766, ni:98612.258, sh:10827 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 10, year: 2027, basis: 'Forward', pt: 241.43667956, fv: 206.270814, upside: -0.019068, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 28, year: 2027, basis: 'Forward', pt: 254.85816788, fv: 217.00464265, upside: 0.031978, flags: [] } } },
    { d: '2026-05-05', after: '1Q26', px: 273.515, wacc: 0.20185877, coe: 0.20646393,
      model: {
        2026: { rev:823035.4, opi:101886.0818, ebitda:208442.6107, ni:85902.2529, sh:10827 },
        2027: { rev:941960.2085, opi:127576.5031, ebitda:261050.3488, ni:108303.8908, sh:10827 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 12, year: 2027, basis: 'Forward', pt: 290.6838979, fv: 257.58146281, upside: -0.058255, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 29, year: 2027, basis: 'Forward', pt: 291.95147087, fv: 258.05495168, upside: -0.056524, flags: [] } } },
    { d: '2026-08-04', after: '2Q26', px: 277.42, wacc: 0.19382767, coe: 0.19813403,
      model: {
        2026: { rev:831123.78, opi:110101.6807, ebitda:250686.7223, ni:92038.956, sh:10827 },
        2027: { rev:959799.9897, opi:139744.5728, ebitda:332725.5287, ni:119053.4144, sh:10827 } },
      val: {
        ev: { method: 'EV / EBITDA', kase: 'Base', mult: 9.5, year: 2027, basis: 'Forward', pt: 292.99431231, fv: 272.55247943, upside: -0.017546, flags: [] },
        pe: { method: 'P / E', kase: 'Base', mult: 28, year: 2027, basis: 'Forward', pt: 314.16989145, fv: 291.82140952, upside: 0.051912, flags: [] } } }
  ]
};
