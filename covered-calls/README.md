# Covered Calls — Live

A local dashboard that replicates the daily **covered-calls** Excel model, pulling
everything live: price + premium + IV + greeks from the **Massive** option chain,
and forward EBITDA/EPS from the **Summit** DCF for the "valuation if exercised"
multiples. **Local only. Nothing is stored.**

## Run

```powershell
powershell -File covered-calls/server.ps1
# then open http://localhost:8091/
```

The server serves the UI **and** proxies Massive, injecting the API key
server-side so it never reaches the browser.

## What it shows (per position)

| Group | Columns |
|---|---|
| Position | ticker · strike · contracts · weight (editable inline) |
| Live · Massive | price · premium (midpoint, override-able) · IV · delta · open interest |
| Economics | yield (prem/price) · upside (strike/price−1) · annualized · premium income $ |
| Valuation @price→@strike | EV/EBITDA and P/E now vs. if called away at the strike (Summit `VAL_YEAR` forward) |

Edit a strike/contracts inline; type a premium to override the live midpoint.
Pick a **target expiry** up top (premium/IV/greeks refetch for that expiry).

## Files

| File | What |
|---|---|
| `server.ps1` | Local server + Massive proxy (allowlisted endpoints incl. options chain). |
| `index.html` / `app.js` | The dashboard UI + logic. |
| `positions.js` | The book — manual inputs (ticker, strike, contracts, weight). Edit to change positions. |
| `summit-data.js` | Summit forward EBITDA/EPS for valuation. Ask Claude to add tickers. |
| `.massive-key` | Massive dev key. **Gitignored — never committed** (repo is public). |

## Notes / next

- ETFs (QQQ, SMH) and ADRs without Massive financials show `—` for valuation (no fundamentals).
- SPOT (EUR) / TBBB (MXN) forward values are FX-converted to USD with a live rate.
- The Excel's full model also has portfolio totals, dated snapshots, and index
  (SPY/IJR) benchmark blocks — not yet ported. This v1 is the live positions table.
