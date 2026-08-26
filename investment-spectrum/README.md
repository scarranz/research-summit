# Investment Spectrum — working folder

Work in progress. This folder holds the **reference material and design notes** for the Investment
Spectrum tab. The code will live in `js/` and `css/` as usual; nothing here ships to the browser.

**Drop your documents in `reference/`.** Anything at all — decks, PDFs, notes, screenshots, a
spreadsheet of tickers, a photo of a whiteboard. See "What to upload" below for what helps most.

---

## What it is

> This spectrum is a continuum of business model types, ranging from intangible,
> innovation-heavy, software-centric platforms on the left; to tangible, asset-intensive,
> economically cyclical businesses on the right.
>
> It represents a gradient in how companies create value:
> - **Left:** through technology, scalability, and intellectual property.
> - **Middle:** through users, network effects, and platform economics.
> - **Right:** through assets, throughput, and tangible production or land ownership.

## What it should do

A **dynamic mind map**, not a static chart:

- Companies are **movable** — you drag a company to where you think it belongs and it stays there.
- It reads **visually and immediately**: where a company sits among business models.
- **Adjacency carries meaning.** A company's neighbours on the map should share business-model
  characteristics with it. That is the whole point — the map is an argument about similarity, so
  being near something is a claim you can agree or disagree with.

## Where it goes in the portal

The tab already exists as a placeholder, so there is no new navigation to build:

| | |
|---|---|
| Path | **Research → Summit → Spectrum** |
| Placeholder | `index.html:166` — `<div id="summit-spectrum">`, currently reads "Coming soon" |
| Sub-tab button | `index.html:157` — `data-sub="spectrum"` |
| Loader hook | `switchSummitTab` at `index.html:675` already lazy-loads per sub-tab; Thesis calls `loadThesisPage()`, Spectrum gets the same treatment |
| Sibling to copy from | the Thesis sub-tab (`#thesis-root`) |

## What to upload to `reference/`

Ordered by how much each unblocks. **Nothing here is required to start** — even one of these is
enough to begin.

1. **Any existing version of the spectrum** — a slide, a sketch, an Excel, a photo of a whiteboard.
   If the shape already exists in someone's head or deck, that is the single most useful upload,
   because then we are reproducing rather than inventing.
2. **The list of companies to place**, and roughly where each one goes. Tickers are enough.
3. **The axis definition** — is left→right the only dimension, or is there a vertical one too
   (size? conviction? quality? stage?). This decides whether the map is a line or a plane, which
   changes the build more than anything else on this list.
4. **The zones or buckets**, if the spectrum has named regions rather than a smooth gradient —
   their names, their order, and what qualifies a company for each.
5. **What "similar" means** — the characteristics that should make two companies neighbours
   (margin structure, capital intensity, revenue model, cyclicality, moat type…). This is what
   turns adjacency into a real claim instead of decoration.
6. **How it gets used** — is it a thinking tool for the team, something shown to investors, a
   screening device? Changes how much polish versus flexibility it needs.

## Open questions to settle as we go

- **One axis or two?** See item 3 above.
- **Where do positions persist?** `localStorage` (per device, fast to build, not shared) versus a
  Supabase table (shared across the team, needs a table + RLS). The Team tab has this exact
  problem today and is on the wrong side of it — worth not repeating.
- **Who can move a company** — everyone, or does a position have an owner?
- **Does a company carry data** (price, sector, market cap) or is it just a labelled node?
- **Does it connect to the `companies` table**, or is it a standalone list that can include names
  we do not cover?

## Status

| Date | State |
|---|---|
| Aug 13, 2026 | Branch `feat/investment-spectrum` created. Folder set up, awaiting reference material. Nothing built yet. |
| Aug 14, 2026 | Built. A plane, not a line: `x` keeps the deck's spectrum, `y` becomes capital intensity. Draggable, persisted in `localStorage`, nearest-neighbour panel. Files: `js/spectrum-data.js`, `js/spectrum.js`, `css/spectrum.css`. |
| Aug 26, 2026 | Branch caught up with `main`. Metrics layer added: seven ratios per company from SEC XBRL, with a period toggle, TTM and this year's estimate. |

---

## The numbers under the board

Where a company belongs on the board is a judgment, and it stays one. What the board now carries
underneath is the evidence that judgment is made on: **seven ratios per company, as filed**, with no
score, no ranking and no verdict attached.

| Ratio | Built from |
|---|---|
| Revenue growth | Revenue, year on year |
| Gross margin | Gross profit ÷ revenue |
| Operating margin | Operating income ÷ revenue |
| CFO margin | Cash from operations ÷ revenue |
| FCF margin | (Cash from operations − capex) ÷ revenue |
| Capex / revenue | Capex ÷ revenue |
| Capex / D&A | Capex ÷ depreciation and amortisation |

Each appears three ways: an **average** over the last 10, 5 or 3 years; **trailing twelve months**;
and **this year's estimate**. In the panel every row also carries a sparkline of the company's own
history. Under the board, all fifteen sit in one sortable table on whichever basis you pick — which
is how a placement actually gets decided, since placing a company is a comparison.

### Where the numbers come from

| | |
|---|---|
| History | SEC XBRL company concepts (`data.sec.gov`) — 10-K, or 20-F for TSMC, Spotify, Grupo Aeroportuario and Tiendas 3B |
| Puller | `scripts/spectrum/fetch-metrics.ps1` → writes `js/spectrum-metrics-data.js` (generated; never hand-edit) |
| Ratios | `js/spectrum-metrics.js` |
| Estimates | The portal's own `js/results-data/<ticker>.js`, loaded on demand |

Ratios only ever divide two figures from the same filing, so the reporting currency never matters —
TSMC in TWD and Tiendas 3B in MXN stay comparable to Amazon in USD. **A blank cell means the company
does not report that line, never that the figure is zero.**

### Four things the puller has to get right

Each of these was a wrong answer before it was a rule, and removing any of them reintroduces a
silent error rather than an obvious one:

1. **Pin one reporting currency per company.** TSMC files the same statements in TWD and in a USD
   convenience translation. A ratio taking its numerator from one and its denominator from the other
   is wrong by the exchange rate and looks perfectly reasonable.
2. **Try every candidate tag and take the latest period.** Filers rotate tags: NVIDIA's revenue tag
   went stale after FY2023, and Meta, Uber, Lyft and SoFi all moved off `PropertyPlantAndEquipmentNet`
   around 2019. "First tag that answers" quietly returns a stale decade.
3. **Drop a figure older than the revenue period.** A tag a filer abandoned still answers — Grupo
   Aeroportuario's last tagged capex is from 2018 — and pairing it with current revenue invents a
   ratio no filing supports.
4. **Compose D&A where it is filed in parts.** Alphabet, TSMC and Spotify never tag a combined line;
   depreciation and amortisation are added only where the combined tag is absent.

Use `companyconcept`, not `companyfacts`: the blob is megabytes, and Amazon, Spotify and Interactive
Brokers all ship keys differing only in case, which PowerShell 5.1's `ConvertFrom-Json` refuses.

### The estimate column, and why it is anchored

The estimate is used for its **rate of change only**, applied to the last reported level:
`est = reported[t−1] × (series[t] ÷ series[t−1])`.

This is not tidiness. Alphabet's consensus revenue is net of traffic acquisition costs — about 84% of
the reported line — so dividing a consensus cost by a consensus revenue showed a **70% gross margin
against 60% in the accounts**. The estimate column was describing a different company. Anchoring
cancels any constant difference in definition and puts the column back on the same footing as the
history beside it.

The model is preferred over the Street where both exist, and the panel says which answered.

### Known limits

- **The estimate column covers six of fifteen** — AMZN, GOOGL, META, UBER, LYFT and TBBB — and each
  dataset carries a different set of lines. Alphabet models all seven ratios; Tiendas 3B two.
- **No TTM for the 20-F filers** (TSMC, Spotify, Grupo Aeroportuario, Tiendas 3B): they publish no
  interim XBRL. TTM elsewhere is the last full year plus the current year to date, less the same
  stretch of the prior year — including for the growth rate, which compares against the same twelve
  months a year earlier rather than the last closed year.
- **Some lines are genuinely never filed.** Mastercard, Interactive Brokers, Disney, TPL and PAC
  report no gross profit; SoFi and IBKR no operating income; Lyft and IBKR no capex. Those cells stay
  blank.
- **Averages resting on fewer years than the window are marked** with a dotted underline and the
  count in the tooltip — NVIDIA tags capex in only five of the last ten years, PAC in four.
- **PAC and TPL carry a `caveat`** in `js/spectrum-data.js` that the panel prints under the table:
  under IFRIC 12 an airport concession is an intangible, so PAC's runways never reach the property
  line at all.
