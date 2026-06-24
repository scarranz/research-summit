# API capability probe

## What this is (plain language)

The portal pulls live data from external providers (Fiscal.ai, Massive/Benzinga,
and — if we have a key — Polygon). We want to **stop guessing** which data each
provider actually gives us on our current plan, and instead get a definitive
answer straight from the APIs themselves.

This adds a small, temporary edge function — `api-probe` — that calls a list of
candidate endpoints on each provider with our real keys and reports, for each:

- the **HTTP status** (200 = works, 401/403 = not on our plan / bad key, 404 = wrong path),
- the **field names** that came back (so we know what data is available),
- row counts where relevant.

It **never returns the API keys** and only echoes sanitized URLs. It's a
diagnostic — run it once, read the output, then it can be deleted.

## Why we need it

Claude can directly introspect the **Summit DCF** data (via the MCP) but **cannot**
call Fiscal.ai / Massive / Polygon from outside — those keys live only in Supabase
secrets. Reading the deployed functions tells us what we *already* consume; this
probe tells us what *else* the keys unlock (e.g. estimates, fundamentals, prices).

## Runbook (San / Oscar — you need deploy + secrets access)

1. **Set a probe token** (any random string — gates the endpoint so it can't be
   enumerated with the public anon key):
   ```bash
   supabase secrets set PROBE_TOKEN=<random-string> --project-ref bvflqjndivouhgwqfbrq
   ```
2. **Deploy the function:**
   ```bash
   supabase functions deploy api-probe --project-ref bvflqjndivouhgwqfbrq
   ```
3. **Run it** (replace TOKEN; `tickers` is comma-separated, default `MA,V,MSFT,META`):
   ```bash
   curl -s "https://bvflqjndivouhgwqfbrq.functions.supabase.co/api-probe?tickers=MA,V,MSFT,META" \
     -H "x-probe-token: <random-string>" | jq .
   ```
4. **Paste the JSON back into the chat** (or drop it in the PR). That output is the
   map of "what we have access to" — Claude reads it and wires only the endpoints
   that returned 200.
5. **Clean up** when done:
   ```bash
   supabase functions delete api-probe --project-ref bvflqjndivouhgwqfbrq
   supabase secrets unset PROBE_TOKEN --project-ref bvflqjndivouhgwqfbrq
   ```

## What it probes

- **Fiscal.ai** (`X-Api-Key`): insider/holders + companies-list (known to work),
  plus candidates — income-statement, financials, fundamentals, metrics,
  estimates, profile.
- **Massive/Benzinga** (`Bearer`): ratings (known), plus estimates, earnings,
  dividends, price-targets, news.
- **Polygon** (`apiKey`): prev-close, reference-ticker, last-trade, financials —
  `key_present:false` in the output means no `POLYGON_API_KEY` secret exists yet.

Candidate paths are best-guess endpoint names; a 404 just means "not that path" —
the goal is to see which ones return 200 and what fields they carry. If a
provider you expect shows `key_present:false`, the secret isn't set.

## Security — why this is safe (read before worrying)

This is a **read-only diagnostic**. It cannot leak data, and here's exactly why:

- **It never exposes the API keys.** The keys stay in Supabase secrets (where they
  already live for the existing functions). The code strips any key out of the
  URLs before returning them, and never prints the key values.
- **It returns shapes, not data dumps.** Per endpoint it returns the HTTP status,
  a row count, and the **field names** (e.g. "price_target", "rating") — not bulk
  records. It's a table of contents, not the book.
- **It's locked.** `PROBE_TOKEN` is just a password we invent (any random string,
  e.g. `probe-7f3k9q`). The function refuses to run unless the caller sends that
  exact password in the `x-probe-token` header. So nobody can trigger it by
  guessing the URL — even with the public site key.
- **It's origin-restricted.** CORS only allows our own sites (the portal + localhost).
- **Nothing calls it automatically.** It's standalone and inert until San runs it
  by hand, and it should be **deleted right after** (`supabase functions delete api-probe`).
- **It only reads.** It performs GET requests against the providers and writes
  nothing, anywhere.

In short: it asks each provider "what do you offer?" and writes down the menu. No
customer ever sees it (the portal requires login anyway), and no key or bulk data
ever leaves Supabase.

## What `PROBE_TOKEN` is

A throwaway password you make up so only you can run the probe. Pick anything
random, set it as a secret, pass the same string in the curl header, then delete
it when done. It is **not** a Bloomberg/Fiscal/Massive key — it's just a lock on
this one diagnostic endpoint.
