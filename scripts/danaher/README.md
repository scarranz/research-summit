# Danaher (DHR) — the SEC pull scripts

Every figure in the Danaher company tab comes from these. They are **read-only**: each fetches from
SEC EDGAR into a local cache and prints; none writes into the repo. Ported here from a session
scratchpad so they survive, because re-deriving what they found took most of a day.

**CIK 0000313616.** Run them from the repo root with PowerShell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\danaher\dhr-xbrl.ps1
```

The cache lives at `%LOCALAPPDATA%\Temp\claude\dhr-edgar\` and persists between sessions, so a
second run is instant. Delete a file there (or pass `-Refresh` where the script supports it) to
re-fetch. Every request carries a `User-Agent` with a contact address, which SEC requires.

---

## The two routes, and when each one works

**1. The XBRL company-concept API** — `data.sec.gov/api/xbrl/companyconcept/CIK<cik>/<taxonomy>/<tag>.json`

One request per accounting concept. Fast, clean, and it returns every vintage of every period, so
picking the newest `filed` per period gives you restated figures automatically.

⚠ **It returns NO dimensional facts.** Anything broken out by segment, by region or by revenue type
is invisible to it. That is why segment data looked unavailable for a whole afternoon.

**2. The rendered "Financial Report" R-files** — for everything dimensional

```
data.sec.gov/submissions/CIK<cik>.json          → the filing list (accession numbers)
sec.gov/Archives/edgar/data/<cik>/<acc>/FilingSummary.xml → find the report by ShortName
sec.gov/Archives/edgar/data/<cik>/<acc>/R<n>.htm          → the note, as a rendered table
```

Flatten the `<tr>`/`<td>` to text and the note comes out whole. Each 10-K carries three fiscal
years and each 10-Q the quarter plus its prior-year comparative, so six 10-Ks and eight 10-Qs cover
FY2020–FY2025 annually and 1Q23–2Q26 quarterly.

---

## What each script does

| Script | What it pulls |
|---|---|
| `dhr-xbrl.ps1` | The main concept pull — 32 income-statement, cash-flow and balance-sheet concepts. Writes `dhr-xbrl.json` beside itself. |
| `dhr-annuals.ps1` | Reads that JSON and prints annual series, fiscal-year-end instants, and the latest interim. |
| `dhr-extra.ps1` | A second concept pass: restricted cash, dividends per share, leases, debt fair value. |
| `dhr-cont.ps1` | Continuing-operations income and EPS — needed because `NetIncomeLoss` mixes bases in the separation years. |
| `dhr-q.ps1` / `dhr-q2.ps1` | Quarterly windows and balance-sheet instants out of the cached concepts. |
| `dhr-seg.ps1` | Lists the segment reports available in each 10-K's `FilingSummary.xml`. **Start here for anything dimensional.** |
| `dhr-seg2.ps1` | Fetches and flattens a named R-file. Edit the three `Show` calls at the bottom to target other notes. |
| `dhr-q10q.ps1` | Walks the 10-Qs and prints segment revenue and operating profit per quarter. |
| `dhr-geo.ps1` | Dumps the geography and segment-narrative R-files. |
| `dhr-proxy.ps1` | Lists the DEF 14A filings. |
| `dhr-proxy2.ps1` | Downloads the 2026 proxy and flattens it to `def14a-2026.txt` (~404k chars). |
| `dhr-10k.ps1` | Same for the FY2025 10-K → `10k-2025.txt` (~543k chars). |

The two flattened text files are the ones worth keeping open — they are in
`%LOCALAPPDATA%\Temp\claude\dhr-edgar\proxy\`, and everything in the Management tab and the
business analysis was read out of them with `grep`.

---

## Traps these scripts were written around

- **`$out` collides with the `$Out` parameter** in PowerShell, which is case-insensitive. Name the
  accumulator something else — this one silently returns a string and the script dies on indexing.
- **Cash changes tag.** `CashAndCashEquivalentsAtCarryingValue` stops after FY2018; from FY2019 it
  is `CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents`.
- **Dividend per share is not tagged at all.** No `CommonStockDividendsPerShare*` fact exists for
  Danaher in any year. Only dividends paid in dollars. Do not derive it silently.
- **Q4 is never tagged** as its own window. It is the fiscal year less the three published quarters.
  Danaher did tag two of them (4Q23 revenue $6,405M, gross profit $3,779M) and the derivation
  reproduces both exactly, which is the check.
- **Three reporting bases in one decade.** Fortive (2016), Envista (2019) and Veralto (2023) each
  restated only two prior years. Take the newest filing per period and mind that FY2020 and earlier
  were never put on today's basis.
- **Executive officers are in the 10-K, not the proxy** — Part I, "Information About Our Executive
  Officers". The proxy has the board and the compensation.
- **Note 5 of the 10-K** disaggregates revenue by type and by region, per segment, in dollars. It is
  a different table from the segment note's sales-by-country, and it is easy to miss.
