// spot-fx-data.js — the EUR→US$ rate used to put per-share values of the euro model on the share's trading currency.
//
// Why it exists (Dani, Oct 20 2026): Spotify reports and the Summit model is built in EUR, but the share trades in
// US$ (NYSE) and the workbook records its price targets and the price at each submit in US$. Per-share values the
// portal derives from the EUR model (Target Multiple "Live", Sensitivity) are multiplied by this rate; the targets the
// workbook recorded are shown as recorded, never converted. Revenue, EBITDA, EPS and every other model line stay in EUR.
// Market data written as a dated constant on the analyst's instruction ("the last available rate"); replace the block
// and its date to refresh. Fetched 2026-10-20 from the ECB daily file (eurofxref-daily.xml, Cube time 2026-10-20).
export var SPOT_FX = { usdPerEur: 1.1215, date: '2026-10-20', src: 'ECB euro foreign exchange reference rate' };
