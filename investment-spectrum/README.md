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
| Aug 26, 2026 | Measured layer added, and the branch caught up with `main`. |

---

## The measured layer

The board's vertical axis was a judgment: someone decided where NVIDIA sits relative to Meta.
**"Show what the filings say"** puts a second marker on every company, computed from its own annual
report, and draws the gap between the two. That gap is the output — the board is a set of claims,
and this is the first thing that can disagree with them.

### How it is built

| | |
|---|---|
| Source | SEC XBRL company concepts (`data.sec.gov`) — 10-K, or 20-F for TSMC, Spotify, Grupo Aeroportuario and Tiendas 3B |
| Puller | `scripts/spectrum/fetch-fundamentals.ps1` → writes `js/spectrum-measured-data.js` (generated; do not hand-edit) |
| Formula | `js/spectrum-measured.js` |

Every figure is as-filed, and each one records the XBRL tag, the period end and the form it came
from, so any marker traces back to a filing. Ratios only ever divide two numbers from the same
statement, so TSMC in TWD and Tiendas 3B in MXN stay comparable to Amazon in USD.

Capital intensity is read as **how much capital a dollar of revenue ties up, in whatever form the
business ties it up**, blended from three filed ratios:

| Term | Weight | What it catches |
|---|---|---|
| Capex / revenue | 40% | Capital being consumed now — the flow |
| Productive assets / revenue | 35% | Property, leased space and inventory — the stock |
| Equity / revenue | 25% | Capital the business must hold to operate — **the rule the axis was missing for lenders** |

That third term is the answer to the open question from Aug 14: SoFi and Interactive Brokers have
almost no fixed assets and are not asset-light in any sense that matters. Each term is scaled on a
log axis between round anchors, because capital intensity spans two orders of magnitude across this
board. Where a term is not tagged the score uses the rest and the panel says which one is missing;
below two terms no marker is drawn at all.

### Why the horizontal axis is not measured

It was tried and abandoned. The x axis asks how a company creates value, and no filed ratio says
that without collapsing into capital intensity: Meta's property and equipment now runs near a full
year of revenue, so any asset-based measure of x pushes the purest advertising business on the board
past a hard-discount grocer. Gross margin and R&D intensity do bear on the question, so they are
shown in the panel as evidence — not folded into a coordinate.

### What it found

The panel reports both positions as a **place in the running order**, heaviest first, not as a
coordinate: the axis has no units, so "45" tells a reader nothing while "8th of 15" needs no
explaining. The height on the board is still what the marker draws — the two can disagree, and
which one moved is itself information.

| | Board | Filings | Moves | |
|---|---|---|---|---|
| PAC | 2nd | 9th | 7 lighter | **Flagged** — under IFRIC 12 the runways are an intangible and never reach the property line |
| TPL | 11th | 6th | 5 heavier | **Flagged** — the equity term punishes a small revenue base, not real capital consumption |
| META | 6th | 2nd | 4 heavier | The AI build-out is heavier than the board admits: capex is 35% of revenue |
| AMZN | 1st | 4th | 3 lighter | Not the heaviest company on the board — TSMC is |
| TBBB | 7th | 10th | 3 lighter | Leases carry more of the store base than the placement assumes |
| GOOGL · TSM · MA · IBKR | | | 2 places | Small, consistent corrections |
| NVDA | 9th | 8th | — | Rises 25 points up the axis and still barely changes place: the middle of this board is thinly populated |
| SOFI | 8th | 7th | — | The funding term **confirms** the board here rather than overturning it |

Two of those are the measure being wrong rather than the board being wrong, and both carry a
`caveat` in `js/spectrum-data.js` that the panel prints under the score.

### Known limits

- Four companies (PAC, TPL, LYFT, IBKR) do not tag capital expenditure, so their marker rests on two
  terms and is drawn dotted.
- TSMC's most recent XBRL annual filing is FY2024; everyone else is FY2025 or later.
- The anchors and the 40/35/25 weights are choices, not findings. They are in one place in
  `js/spectrum-measured.js` and are meant to be argued with.
