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

**Everything is in %.** There are no dollar amounts, no contract counts, and no
portfolio value — the only manual inputs are **ticker, strike, weight**, and the
portfolio-level numbers are derived by scaling each position's yield by its weight.

| Group | Columns |
|---|---|
| Position | ticker · strike · weight (both editable inline) |
| Live · Massive | price · premium (midpoint, override-able) · IV · delta · open interest |
| Economics | yield (prem/price) · upside (strike/price−1) · annualized · contrib (weight × yield) |
| Valuation @price→@strike | EV/EBITDA and P/E now vs. if called away at the strike (Summit `VAL_YEAR` forward) |

The headline **Premium yield** KPI is Σ(weight × yield) across positions — the
portfolio's premium income as a % of the book, with no dollar figure needed.

Edit a strike/weight inline; type a premium to override the live midpoint.
Pick a **target expiry** up top (premium/IV/greeks refetch for that expiry).

## Files

| File | What |
|---|---|
| `server.ps1` | Local server + Massive proxy (allowlisted endpoints incl. options chain). |
| `index.html` / `app.js` | The dashboard UI + logic. |
| `positions.js` | The book — manual inputs (ticker, strike, weight). Edit to change positions. |
| `summit-data.js` | Summit forward EBITDA/EPS for valuation. Ask Claude to add tickers. |
| `.massive-key` | Massive dev key. **Gitignored — never committed** (repo is public). |

## Notes / next

- ETFs (QQQ, SMH) and ADRs without Massive financials show `—` for valuation (no fundamentals).
- SPOT (EUR) / TBBB (MXN) forward values are FX-converted to USD with a live rate.
- The Excel's full model also has portfolio totals, dated snapshots, and index
  (SPY/IJR) benchmark blocks — not yet ported. This v1 is the live positions table.
