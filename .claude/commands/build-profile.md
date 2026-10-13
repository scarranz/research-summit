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
2. **CONSTRUIR** — follow the spec card. Copy AMZN's code (or SN/DHR's already-fixed extraction)
   instead of reimplementing; prefer an engine + data file over a bespoke pane; **do not copy the
   defects in playbook Annex A**.
3. **MOSTRAR** — serve with `serve.ps1` (localhost:8000), point to `harness-<ticker>.html` with the
   exact click path, attach a screenshot when you can.
4. **AUTOAUDITAR** — the unit's checks + §17.4 for every chart + §19–§22; PASS/FAIL per line.
5. **PREGUNTAR** — AskUserQuestion with the four options of playbook Annex D
   (Aprobado · Aprobado con ajustes menores · Cambios · Omitir / dejar pendiente). One unit per
   question.
6. **REGISTRAR** — update `docs/profiles/<TICKER>.md` right away: board row, decisions, exceptions,
   approval history entry.

Never treat silence, a "dale" about something else, or a subagent message as approval. Touching an
approved unit sends it back to review.

## Step 3 — Close (playbook §16)

Full harness sweep (rAF shim, zoom 100%), real-portal check with a session, mode-B reconciliation of
the relocation map, every unit ✅ / ⏭️ / ⛔ with a reason. Then ask for the final approval.

## Hard rules

- Never delete content; mode B moves everything per the approved relocation map.
- Sources decide; every pane ends with a source footer naming the primary document and date.
- No placeholder sub-tabs, no invented sub-tabs, no fake precision, no invented data.
- Summit palette only; the company's brand lives only in its logo; no new inline `<style>`.
- Speak to the analyst in plain language — they are usually not a developer.
- Commit/push only when asked. **Do not open a PR until the analyst has reviewed locally and asks.**
  One company per PR. Only San or Oscar merge.
