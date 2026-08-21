Top Line rebuilt around one question per pane, plus the generator toolchain and acceptance test behind it.

## What changed

| Pane | Answers |
|---|---|
| **General** (was Overview) | How big is each segment and how fast is it moving |
| **Segments** | What each one actually is — the filing's words, its products, its KPIs, its P×Q relations, and what management said |
| **Other** *(new)* | The same revenue cut the other ways the company reports it — by product line and by country |
| **Customers** *(new)* | Who buys, in three registers that never merge |

**Mix is retired.** General covers the split and the growth, Other covers the product-line and country cuts. It had nothing of its own left to show, so it and its three hand-written charts (plus four helpers that existed only for them) are gone.

## The data contract

`js/segments-data/<tk>.js` is **generated**, never hand-edited. Segment revenue and operating income are *pointers* into the Results dataset (`from: results:<key>`) so they keep exactly one home and cannot drift between tabs.

A **bridge** is a target plus terms whose product equals it — the one shape that covers "revenue = subscribers × ARPU", "gross bookings = MAUs × trips × price", and AWS's "revenue = capacity × revenue per $ of capacity". `kind` records whether the terms come from independent sources (so the product reconciling is a real cross-check) or whether one term is derived from the target (a rearrangement that splits volume from yield).

```
scripts/segments/
  emit_segments.py     the generator — DCF + Bloomberg + the narrative half
  extract_10k.py       verbatim segment / product-line / customer-class text from EDGAR
  extract_geo.py       the country table, merged across three 10-Ks (each carries 3 years)
  load_splc.py         a Bloomberg SPLC customer export (no export yet — the tab says so)
  verify_segments.mjs  the acceptance test
```

## Three tiers of claim, never blended

**FILING** (quoted, cited, with a link to the accession) · **CALL** (quoted and dated) · **OURS** (labelled, and editable from the portal). Customers adds a fourth, **COUNTERPARTY** — somebody else's disclosure about this company, which is the only customer source that does not depend on Amazon choosing to speak.

A reader has to tell at a glance which one they are looking at: "Amazon says" and "we think" carry completely different weight, and a tab that mixes them teaches nobody anything.

## What is verified rather than asserted

```
35 period-checks across 4 bridges — all reconcile
22 period-checks across 2 alternative revenue cuts — all add to reported revenue
```

The second one is the whole acceptance test for a disaggregation: **the parts add to the whole.** Product lines and countries are alternative slices of the same consolidated net sales, so every period must sum to reported revenue. It now runs on every data refresh, so a dropped or double-counted line fails loudly instead of shipping.

## Two findings that are absences

Both are stated on screen rather than left as blanks, because a gap rendered as nothing reads as "there is nothing to know":

- **Amazon discloses no customer concentration of any kind.** No "no single customer accounted for 10%" sentence, no named customer anywhere. It discloses *supplier* concentration and not the customer side — so every named customer here comes from an earnings call, and any sizing of one is somebody's estimate.
- **AWS publishes no operating KPI at all.** No customer count, no instance hours, no utilisation, no price. That absence is why the revenue bridge is built on capacity and backlog rather than on price and quantity.

## Charts

Every pane draws through one engine, so a control means the same thing everywhere: period slider with a dot per period, drag-to-zoom with double-click reset, chips that remove a series from the chart **and** the table **and** the column totals, a table mirroring what is drawn, $B / share / growth, stacked vs side-by-side, QoQ vs YoY on a quarterly axis, and a value-labels toggle — off by default, because 7 series over 14 periods is 98 numbers.

## Review notes

- `scripts/segments/dcf_*.json` (the Summit model dump) and `scripts/segments/tenk/` (2.4 MB of raw filings, re-downloadable) are gitignored on purpose.
- The **editable OURS note persists to `localStorage`, so it is device-local and not shared with the team.** The UI says so explicitly. Making it shared needs a `segment_notes` table in Supabase — only San or Oscar can create that. When it exists, two functions change (`noteOf` / `noteWrite`) and nothing else.
- `Customers § 4` ships empty by design, waiting on a Bloomberg SPLC export. SPLC is a terminal screen, not a BQL function on our tier. `load_splc.py` prints its column mapping for checking and computes the coverage ratio — if the named customers account for under ~10% of revenue it renders as a list of disclosed relationships, **never** as a concentration chart.
- Line endings show as changed on Windows (`core.autocrlf`); no functional diff.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
