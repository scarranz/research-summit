// submits-data/tpl.js — every Summit DCF submit of Texas Pacific Land (TPL), for Valuation ▸ Submit History (js/submits.js).
//
// SCAFFOLD (2026-11-04): TPL has no Summit model yet, so `submits` is empty and this file is NOT registered in
// js/submits.js SUBMITS_DATA (nothing renders). On the first submit: pull get_valuation_history('TPL') and
// get_metric_snapshot_series (projection_history rows only) and fill each submit exactly as js/submits-data/spot.js
// documents; check price_target ÷ fair_value is equal across the two methods (playbook §6.3, else freeze P49/P80
// with a `fix`); then register `TPL: tplSubmits` and mount the `submits` sub-tab in js/overviews/tpl.js.
// FROZEN ON PURPOSE, NOT LIVE once filled (playbook rule 10, §20b); a new submit is APPENDED, never overwritten.
export var tplSubmits = {
  ticker: 'TPL', name: 'Texas Pacific Land', ccy: 'US$', mccy: 'US$', pulled: null,
  src: 'Summit DCF model (Texas Pacific Land), the valuation block of each submit',
  submits: []
};
