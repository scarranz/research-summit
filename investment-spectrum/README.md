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
