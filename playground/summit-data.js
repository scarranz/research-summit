// Summit DCF projections — pulled from the Summit Financial Data MCP by Claude.
// All values in MILLIONS of USD. Forward years (2026+) are projection_history
// (the model's estimates). To refresh or add a ticker, ask Claude to pull it.
//
// snapshot_date is the Summit model snapshot the numbers came from.

export const SUMMIT = {
  UBER: {
    name: "Uber Technologies, Inc.",
    snapshot_date: "2026-05-07",
    // period_key -> metric -> value (millions USD; shares in millions)
    years: {
      2024: { rev: 43978,    ebitda: 6484,     earnings: 3970,    shares_out: 2154.466 },
      2025: { rev: 52017,    ebitda: 8730,     earnings: 5237,    shares_out: 2124.391 },
      2026: { rev: 58695.21, ebitda: 11546.74, earnings: 7067.00, shares_out: 1979.57  },
      2027: { rev: 68127.69, ebitda: 14817.44, earnings: 9172.58, shares_out: 1890.49  },
    },
  },
};
