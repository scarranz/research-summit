// overviews/index.js — registry of per-company Overview modules.
// Each company's Overview is designed and built individually (see CLAUDE.md).
// To add one: create js/overviews/<name>.js exporting { html(company), init(company) },
// then map its ticker here.
import { remitlyOverview } from './remitly.js';

var OVERVIEWS = {
  RELY: remitlyOverview,
};

// Returns the overview module for a ticker, or null if none is built yet.
export function getOverview(ticker){
  return OVERVIEWS[ticker] || null;
}
