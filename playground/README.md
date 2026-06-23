# Multiples Playground

A local-only lab to experiment with **Massive (live market data)** and **Summit (forward DCF)** — building real-time valuation multiples. **Not part of the portal.** Nothing is stored.

## Run

```powershell
powershell -File playground/server.ps1
# then open http://localhost:8090/
```

The server serves the UI **and** proxies Massive, injecting the API key server-side so it never reaches the browser.

## Files

| File | What |
|---|---|
| `server.ps1` | Local server + Massive proxy (allowlisted endpoints). |
| `index.html` / `app.js` | The dashboard: live price/market-cap/EV + trailing-vs-forward multiples + raw API explorer. |
| `summit-data.js` | Summit DCF projections (pulled by Claude). Ask Claude to add tickers. |
| `.massive-key` | The Massive dev key. **Gitignored — never committed** (repo is public). |

## Notes

- **No Benzinga** on our plan → no analyst estimates from Massive. Forward numbers come from Summit only.
- Add a Massive endpoint: one line in `server.ps1` (`Resolve-Route`) — only add endpoints our plan is entitled to.
- If we ever ship this to the portal, the proxy logic moves into a Supabase edge function (one deploy) and the UI becomes a tab.
