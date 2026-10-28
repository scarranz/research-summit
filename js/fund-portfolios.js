// fund-portfolios.js -- The list of portfolios shown in the Return Analysis tab.
//
// ADDING A PORTFOLIO IS ONE LINE. Add an entry below and it appears in the
// tab's portfolio toggle; everything downstream (charts, tables, metrics) keys
// off `code` on its own.
//
//   code        internal key. Also the key used in js/fund-history-data.js and
//               js/fund-live-seed.js, and matched against `portfolios.code` in
//               the database. Lowercase, no spaces.
//   label       what the user sees in the toggle and the header.
//   benchmark   ticker whose daily closes we compare against.
//   benchmarkLabel  what the user sees for that benchmark.
//   benchmarkShort  short form for tight table headers.
//   currency    reporting currency (everything is USD today).
//
// Note this file is committed to a PUBLIC repo: keep internal portfolio names
// and database ids out of it. `code`/`label` are all the front end needs -- the
// database id is looked up at runtime by `code`.
export const PORTFOLIOS = [
  { code: 'summit', label: 'Summit', benchmark: 'SPY', benchmarkLabel: 'S&P 500', benchmarkShort: 'S&P', currency: 'USD' },
];

// The seam. Everything strictly before this date comes from the frozen history
// file; everything on or after it comes from the live feed (database, or the
// seed file while the feed is being connected). A hard cut, no overlap, so
// there is never a question about which source produced a given day.
export const HISTORY_CUTOFF = '2026-01-01';

export function getPortfolio(code) {
  return PORTFOLIOS.find(p => p.code === code) || PORTFOLIOS[0];
}
