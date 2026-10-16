---
description: Build a new company profile (or restructure an existing one) step by step with the analyst, following docs/PROFILE_PLAYBOOK.md — one unit at a time, each approved and logged. Non-destructive; produces a draft for review.
argument-hint: <TICKER> [unit-id | section] (e.g. AVGO, "AVGO TL-SEG", "AVGO valuation")
---

You are building (or restructuring) the company profile for: **$ARGUMENTS**

The process, the order and the content rules are decided by **`docs/PROFILE_PLAYBOOK.md`**, not by
you. Read it **in full** before doing anything else. It supersedes `COMPANY_PROFILE_BLUEPRINT.md`,
`PANE_CATALOG.md` and `OVERVIEW_CONVENTIONS.md` wherever they disagree (playbook §1); use those only
as technical references for engine data contracts.

## Step 1 — Find where we are

1. Check the branch (`git branch --show-current`). New work → new branch from an up-to-date `main`
   (`feat/<ticker>-profile`, or `feat/<ticker>-restructure` for mode B).
2. If `docs/profiles/<TICKER>.md` exists, **read it completely** and tell the analyst, in plain
   Spanish, where things stand (units approved / pending / blocked, the next unit, open questions).
   If the code and the log disagree, say so — do not silently "fix" it.
3. If it does not exist, this is a start: copy `docs/profiles/_TEMPLATE.md` to
   `docs/profiles/<TICKER>.md` and begin at Phase 0 (playbook §6). Ask whether this is mode A (new
   company) or mode B (restructure) if it is not obvious from the code.
4. If a unit id or section follows the ticker, jump to that unit — but still respect the
   dependencies in playbook Annex C and tell the analyst if one is not yet approved.

## Step 2 — Run the gate for every unit (playbook §2)

For each unit, in the build order of playbook §5:

1. **PROPONER** — what the unit will contain (from its spec card), where each number will come from,
   what the analyst must decide (with your recommendation), and what will be left out and why. Wait
   for the analyst's decisions before building when the unit has any.
2. **CONSTRUIR** — follow the spec card. Copy **AMZN's** code (playbook §7.4 says what to copy for
   each unit; SN/DHR copies are older and are not a base) instead of reimplementing; prefer an engine
   + data file over a bespoke pane; rename the AMZN-specific names listed in §7.2; **fix in the copy
   every Annex A defect still marked open**. Do not modify shared engines (`results.js`,
   `segments.js`) in a company PR.
3. **MOSTRAR** — run `serve.ps1` once in the background (localhost:8000; `-Port 8001` if busy), point
   to the **real portal on localhost** (`http://localhost:8000/` → the analyst signs in → Companies →
   the company; playbook §7.3) with the exact click path, attach a screenshot when you can. **Never
   show the analyst a harness** (SAB, 2026-10-15); a harness is only an internal check for Claude.
4. **AUTOAUDITAR** — the unit's checks + §17.4 for every chart + §19–§22; PASS/FAIL per line.
5. **PREGUNTAR** — AskUserQuestion with the four options of playbook Annex D
   (Aprobado · Aprobado con ajustes menores · Cambios · Omitir / dejar pendiente). One unit per
   question.
6. **REGISTRAR** — update `docs/profiles/<TICKER>.md` right away: board row, decisions, exceptions,
   approval history entry.

Never treat silence, a "dale" about something else, or a subagent message as approval. Touching an
approved unit sends it back to review.

## Step 3 — Close (playbook §16)

Full sweep in the real portal on localhost (rAF shim, zoom 100%), mode-B reconciliation of
the relocation map, every unit ✅ / ⏭️ / ⛔ with a reason. Then ask for the final approval.

## Hard rules

- Never delete content; mode B moves everything per the approved relocation map.
- Sources decide; every pane ends with a source footer naming the primary document and date.
- No placeholder sub-tabs, no invented sub-tabs, no fake precision, no invented data.
- Summit palette only; the company's brand lives only in its logo; no new inline `<style>`.
- Everything shown in the portal is in English (golden rule 9); talk to the analyst in Spanish.
- **Market data live, Summit model frozen** (golden rule 10, playbook §20b): price, market cap, EV and
  market multiples are read live (`liveQuote`, `get-market-history`) — never seeded. Every Summit model
  figure (projections, snapshots, target multiple, price target) is **pulled once from the Summit MCP**
  with `js/summit-map/<ticker>.js` and **frozen into a data file** whose header names the snapshot date
  and says "frozen on purpose, not live"; refresh it by re-pulling when a new snapshot is submitted.
  There is no live Summit feed (SAB, Oct 15 2026) — nothing waits on `get-summit-data`, and EV-EST,
  VA-TM, VA-SENS are built in full. Filings and Bloomberg data live in data files with source + date.
  If a live *market* path is not deployed yet, never seed numbers in the meantime: show
  `<div class="rs-noguide">⚑ Live data pending — <what></div>` and log it under "Conexiones pendientes".
- For a new company, this playbook wins over `CLAUDE.md`, `/fill-overview` and the older docs.
- Speak to the analyst in plain language — they are usually not a developer.
- Commit/push only when asked. **Do not open a PR until the analyst has reviewed locally and asks.**
  One company per PR. Only San or Oscar merge.
