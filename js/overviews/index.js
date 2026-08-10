// overviews/index.js — registry of per-company Overview modules.
// Each company's Overview is designed and built individually (see CLAUDE.md).
// To add one: create js/overviews/<name>.js exporting { html(company), init(company) },
// then map its ticker here.
import { remitlyOverview } from './remitly.js';
import { sofiOverview } from './sofi.js';
import { msftOverview } from './microsoft.js';
import { bbbOverview } from './bbb.js';
import { visaOverview } from './visa.js';
import { seaOverview } from './sea.js';
import { metaOverview } from './meta.js';
import { mastercardOverview } from './mastercard.js';
import { lyftOverview } from './lyft.js';
import { uberOverview } from './uber.js';
import { nvidiaOverview } from './nvidia.js';
import { instacartOverview } from './instacart.js';
import { spotOverview } from './spot.js';
import { avgoOverview } from './avgo.js';
import { qcomOverview } from './qcom.js';
import { ibkrOverview } from './ibkr.js';
import { googlOverview } from './googl.js';
import { amznOverview } from './amzn.js';
import { disOverview } from './dis.js';

var OVERVIEWS = {
  RELY: remitlyOverview,
  SOFI: sofiOverview,
  MSFT: msftOverview,
  TBBB: bbbOverview,
  V: visaOverview,
  SE: seaOverview,
  META: metaOverview,
  MA: mastercardOverview,
  LYFT: lyftOverview,
  UBER: uberOverview,
  NVDA: nvidiaOverview,
  CART: instacartOverview,
  SPOT: spotOverview,
  AVGO: avgoOverview,
  QCOM: qcomOverview,
  IBKR: ibkrOverview,
  GOOGL: googlOverview,
  GOOG: googlOverview,
  AMZN: amznOverview,
  DIS: disOverview,
};

// Returns the overview module for a ticker, or null if none is built yet.
export function getOverview(ticker){
  return OVERVIEWS[ticker] || null;
}
