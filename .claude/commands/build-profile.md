---
description: Build or extend a company's full Deep Dive profile from its ticker, following the company profile blueprint. Non-destructive; produces a draft for review.
argument-hint: <TICKER> [section] (e.g. AVGO, or "AVGO topline")
---

You are building the **Deep Dive profile** for the company with ticker: **$ARGUMENTS**

If a section name follows the ticker (`topline`, `bottomline`, `evolution`, `valuation`,
`mgmt`, `misc`), build **only that section** and skip the steps that do not apply.

The structure is decided by the blueprint, not by you. Do not improvise it.

## Step 1 — Load the contracts (mandatory)

Read, in this order:

1. `docs/COMPANY_PROFILE_BLUEPRINT.md` **in full** — the tab spine, the engine list, the design
   system, the data map, the interaction contract, the build order, the checklist.
2. `docs/CHART_ENGINE_REFERENCE.md` **§0** — before writing any chart at all.
3. Whichever of these the section needs: `RESULTS_CONVENTIONS.md` (Results/Estimates dataset),
   `EARNINGS_CONVENTIONS.md` (the Earnings tab), `OVERVIEW_CONVENTIONS.md` (if the Overview tab
   is not yet filled — run `/fill-overview <TICKER>` first if so).

Then open `js/overviews/amzn.js` and read the panes closest to what you are building. Amazon is
the reference implementation; `Miscellaneous ▸ M&A` and `▸ Other Analysis` are the worked
examples of a data-driven pane built only from canonical components.

## Step 2 — Inventory the data BEFORE writing anything

The capability ladder decides the scope. Answer all of these and write the answers into your
plan — do not start building until you have:

- Does a **Summit DCF** exist for this ticker? (`search_ticker` / `list_dcf_models` on the Summit
  Financial Data MCP.) How many snapshots (vintages)? **Check the last actual period in each** — a
  snapshot's date does not tell you what it contains.
- Is the ticker in **`BBG_CONSENSUS.txt`** (the rolling Bloomberg archive, which lives **outside
  the repo** — see `EARNINGS_CONVENTIONS.md` §6a)? As last recorded it carried only
  GOOG/GOOGL/HOOD/KKR/MA/META/UBER, so check rather than assume. If the ticker is absent, Street
  consensus must be compiled by hand per print into `docs/calls/<TICKER>.md`.
- Is there a **BBG income-statement export** (`js/overviews/<ticker>-bbg.js`)? If not, Bottom Line
  has no actuals-vs-consensus source.
- Is the ticker a **subject company** in an SPLC export (check `nvidia-map-reference/` and
  `robotics-research/`)? That decides Top Line ▸ Customers and Bottom Line ▸ Supply Chain.
- Which **filings** exist (10-K vs 20-F) and what is the latest accession? Verify on EDGAR; do not
  infer the form from country of incorporation.

Report the inventory to the user before building. If a section has no source, say so — an absent
section is a finished state, not a gap.

## Step 3 — Prefer an engine over a pane

For each thing you are about to build, check the blueprint §2 table first:

- A metric over time → **`js/results.js`**: write `js/results-data/<ticker>.js` and a registry
  line. Do not write a canvas.
- The whole Top Line section → **`js/segments.js`**: write `js/segments-data/<ticker>.js`. It is
  generic and currently has one adopter; feeding it a second company is data, not code.
- Street revisions by snapshot → **`js/consensus-evolution.js`** + a block in
  `js/consensus-evolution-data.js`.
- The Earnings Watch List → mount **`js/watchlist.js`**. It is Supabase-backed with **no
  seed-from-code path**; rows are authored in-portal, so do not author `band:'lead'` items and
  expect them to appear.
- Executives & Board → **`js/overviews/management.js`**.

Only write a bespoke canvas when the thing genuinely is not a metric over time, and then follow
`CHART_ENGINE_REFERENCE.md` §0.7 — §0.2 applies to it in full.

## Step 4 — Build, following the order

Blueprint §6: spine → Top Line → Results + Estimates → Earnings → Bottom Line → the rest.
Relocate any existing content into the new spine; **never delete it** (Golden Rule #1).

**Design constraints, non-negotiable:**
- **Summit palette only.** The company's brand appears in its logo, nowhere else. Do not copy
  Amazon's inline `--brand` override.
- **No new inline `<style>`.** Use the canonical components in blueprint §3.2. If you genuinely
  need something new, add it to a stylesheet and flag it in the handoff.
- No unicode circled digits in `.ov-sec-h`.
- Every pane ends with a `.ov-foot` naming filing, note and date.
- No walls of text; depth goes behind a collapsible or a modal.
- No fake precision. Label estimates. If periods are mixed, say so and do not annualise silently.
- When the data is thin, **state the limitation first**, before the table.

**Interaction constraints, non-negotiable** (blueprint §5): build charts lazily per visible pane
behind `requestAnimationFrame`; scope every query to its pane (the Results engine renders up to
three times per profile and its ids are not unique); hoist modals to `#co-detailview` **and** close
them on tab and sub-tab change; fade estimate periods with a helper that parses the palette you
actually use; every chart carries a table that follows its state.

## Step 5 — Verify in a harness, not by reading

Copy the tracked `harness-amzn.html` to `harness-<ticker>.html` (your copy stays gitignored) and mount the module. Then:

- **Force a frame before asserting on any chart** — `requestAnimationFrame` is paused in a
  non-foreground tab, so an automated pass will otherwise find zero charts built.
- **Audit at zoom 1.** CSS `zoom` does not reflow a Chart.js canvas and makes correct charts look
  broken.
- Run the blueprint §7 checks: duplicate ids, charts without tables, `NaN` in chart colours, panes
  with no source footer, empty panes, inline `<style>` count.
- **Click every control.** Several ported Earnings controls rendered as live pills that did nothing
  because the wiring function was copied without its call site.

## Step 6 — Self-audit and report

Run the blueprint §8 checklist and print a **PASS/FAIL line per item** in the terminal. Explicitly
flag:
- anything you could not source officially,
- any convention you had to bend and why,
- every figure that is an estimate rather than reported,
- any section you left out, and which source was missing.

## Step 7 — Hand off (do not publish unreviewed)

- Confirm the app loads with no console errors and offer it on localhost for review.
- This is a **draft for human review**. Commit if asked; **do not open a PR until the user has
  reviewed it and explicitly asks.** San and Oscar merge.
- One company per PR. Do not sweep a change across several tickers at once.

Be honest about gaps. A section marked "no source for this" is worth more than a section filled
from an unofficial one, and far more than a placeholder that pretends the work is pending.
