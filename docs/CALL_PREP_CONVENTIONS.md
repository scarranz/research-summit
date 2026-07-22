# Call Prep — the build runbook (v2 · Jul 2026)

**This document is the complete, self-executing spec for building the Call Prep section for ANY
company.** The contract: Dani hands over **(a) a ticker, (b) its earnings-call transcripts,
(c) the Bloomberg numbers export, and optionally (d) SPLC / Summit expectations** — and a fresh
session, with no other context, builds the whole thing from the prompt
**"arma el Call Prep de \<TICKER\>"** (or refreshes it with "integra el nuevo call de \<TICKER\>").
If a step here is ambiguous, fix THIS doc — never rely on session memory.

Companion docs (both required reading before building):
- `docs/EARNINGS_CALLS_CONTEXT.md` — the ANALYSIS rules: Rule 0 (fact → why → so-what), the
  3-pass detection protocol, relevance criteria, regression tests, calls-repo rotation.
- **Reference implementation: `js/overviews/googl.js`** (v2 — canonical). `ibkr.js` is v1
  (legacy: still has Promise Tracker + single-estimate setup) pending migration — do NOT copy
  from it for new companies.

---

## 0. Inputs — what Dani hands over, and where it lives

| Input | Form | Where |
|---|---|---|
| **Ticker / company** | named in the prompt | — |
| **Earnings calls** | transcript paste or files (typically ~10 quarters) | → stored by YOU in `docs/calls/` (see §2) |
| **Numbers / consensus** | Bloomberg export, e.g. `FA_<TICKER>_US_*.xlsx` (sheet "Multiple Periods": rows = line items, columns = quarters, last column(s) = `(Fwd)` estimates) and/or `BBG_CONSENSUS.xlsx` | Dani's **Downloads** folder |
| **Summit expectations** | Summit DCF/MCP (`search_ticker` first) or analyst hand figures | MCP / Dani |
| **SPLC** (suppliers/customers) | Bloomberg SPLC export | Downloads — feeds the DEEP DIVE (Top/Bottom Line), not Call Prep itself |

**Golden data rules (never break):**
1. **Consensus = Bloomberg ONLY.** Never web-scraped estimates (Zacks/etc. are directional
   color, never a source of record). Web consensus may inform *framing*, never a hardcoded cell.
2. **Hardcode only the values that render.** No hidden full series committed.
3. **Summit estimates are never invented.** Absent → cells render "to fill".
4. **Append-only per quarter.** A quarter's Pre-Call blocks freeze when it opens; prior quarters
   are never overwritten (the tab is a calibration record).

---

## 1. The build — nine steps, in order

1. **Calls repository** (spec in `EARNINGS_CALLS_CONTEXT.md` §4): create
   `docs/calls/<TICKER>-latest.md` (most recent call + its analysis) and `docs/calls/<TICKER>.md`
   (historical compendium, newest first). On a refresh: ROTATE (latest → top of compendium; new
   call → latest).
2. **Analyze** the latest call with the 3-pass protocol AND diff across the full record —
   Pass 1.5 recurrence is what discovers the THEMES (step 5) and the promise ladders.
3. **Extract consensus** from the Bloomberg export: open the xlsx (python/openpyxl,
   `data_only=True`), find the last `(Fwd)` column, pull the 4 headline lines + the agreed custom
   KPIs, compute YoY vs the same quarter's reported column. Round sensibly ($B one decimal).
4. **Build the `CALL_PREP` object** (data model in §3): one `upcoming` quarter with `setup`
   (headline + custom, `cons`/`us` per metric, `debate:null` until both estimate sets exist),
   `watchList` (step 5), `results:null`, `call:null`.
5. **Watch List — 5 themes** (criteria in §4): each with `since`, `thread` (quarter-by-quarter
   evolution from the calls repo), `bbg`, `breaks`, `pista`, `why`, `src`. Promise-type items go
   here (no separate tab).
6. **Evolution ▸ Earnings Calls — the themes view**: a `<TICKER>_THEMES` array (~8–10 themes,
   each: icon, title, status `trend`/`promise`/`watch`, one-line read, rows of `[quarter, note]`)
   rendered as accordions. This is where the full cross-call record lives in the UI, and where
   dissolved Promise-Tracker threads are held to account.
7. **Port the render machinery from `googl.js`** — copy verbatim, swap only data + brand colors:
   `cpStyle`, `cpFmtC`, `cpEvCell`, `cpSetupBody`, `cpWatchBody`, `cpResultsBody`, `cpCallBody`,
   `callsBody`, `cpUpcoming`, `cpFill`, `CP_RES`, `CP_HLTAG`, `CP_THST`, `CP_POP`/`cpReg`/`cpQ`,
   `wireCallPrep` (incl. the `.cp-ev-pill` estimates toggle). The functions are generic by design.
8. **Wire into the profile**: Call Prep is a **sub-tab of Evolution** (never a spine tab), with an
   inner `.cp-phtabs` row of **FOUR phases**: Setup · Watch List · Post-Results · Post-Call.
   Earnings Calls is a sibling Evolution sub-tab using `callsBody()`. `wireCallPrep(root)` is
   called from `init` alongside `wireSubtabs`.
9. **After the print / after the call**: fill `results` (scorecard vs BOTH estimate columns +
   thesis red-line check + `intoCall` bullets), then `call` (take + highlights + dots +
   `newQuestions`) applying Rule 0 to every bullet. Then ROLL: new `upcoming` quarter, update
   every theme's `thread`, re-rank, rotate the calls repo.

---

## 2. Structure (the UI contract)

Evolution's sub-tab row: `Earnings Calls · Guidance · Strategy · Timeline · Call Prep` (order may
put Call Prep first in earnings season). Inside Call Prep, three phases across four panes:

| Phase | Pane | What it holds |
|---|---|---|
| **① Pre-Call** | **Setup** | 4 **headline** metrics (mandatory, every company: **Revenue · Operating income · EPS · EBITDA**) + 4 **custom KPIs** (per-company, agreed with Dani), each with **Street** (Bloomberg) and **Summit** estimates behind a **Consensus ⇄ Summit ⇄ Both** toggle; caveat pop-ups (`cpQ`) on numbers with a trap; **the debate** = the explained Street-vs-Summit disparity (rows + synth), enabled with a to-fill state until both sets exist |
| **① Pre-Call** | **Watch List** | 5 ranked **THEMES tracked over time** — `since` chip + quarter-by-quarter `thread` pop-up, consensus, red-line, tell. Promise items live here (project/pipeline/musing discipline; silence is a signal) |
| **② Post-Results** | **Post-Results** | numbers scorecard (beat/miss vs both columns) + thesis red-line check + "what the numbers tee up for the call" — filled when the print lands, BEFORE the call |
| **③ Post-Call** | **Post-Call** | take + insight-first highlights (Rule 0; taxonomy `thesis`/`curious`/`dots`/`tone`/`watch`) + dots + `newQuestions` |

**Dissolved:** the standalone Promise Tracker tab (Jul 2026) — never build it for new companies.
**Kept for now:** the Post-Results/Post-Call format (a more meeting-prep presentation is an open
design question — improve it only with Dani's sign-off).

---

## 3. Data model (`CALL_PREP`, hardcoded in the company's overview JS)

```js
var CALL_PREP = {
  ticker:'XXXX',
  quarters:[
    { q:'Qx 20xx', status:'upcoming', date:'Day Mon DD, 20xx · after close (call H:MMpm ET)',
      setup:{
        source:'Bloomberg (BST consensus) · Summit expectations — to fill', asOf:'YYYY-MM-DD',
        headline:[   // EXACTLY these four, in this order
          { k:'Revenue',          cons:{v,yoy,unit:'$B'}, us:null, note:{t,h}? },
          { k:'Operating income', cons:{...}, us:null },
          { k:'EPS (diluted)',    cons:{...}, us:null },
          { k:'EBITDA',           cons:{...}, us:null },
        ],
        custom:[ /* 4 per-company KPIs, same shape; k:null renders "to define" */ ],
        debate:null // or { rows:[{k, street, us, why}], synth } once Summit numbers exist
      },
      watchList:[
        { rank:1, metric:'THEME name', since:'Qx 20xx',
          bbg:'consensus line', breaks:'falsifiable red-line',
          pista:'the standing tell (a read, not a question)',
          why:'thesis relevance', src:'grounding (why it earned the rank)',
          thread:[ { q:'Qx 20xx', n:'what happened that quarter' }, ... ] },
        // exactly 5, ranked by stock-impact × debate
      ],
      results:null,  // → { headline, scorecard:[{metric,cons,actual,result,note?}],
                     //     thesisCheck:[{line,tripped,note}], intoCall:[...], priceReaction }
      call:null      // → { take, highlights:[{tag,head,detail}], dots, newQuestions:[...] }
    }
  ]
};
```

---

## 4. Watch List — the criteria (the heart of the tab)

**Exactly 5 items, ranked** by **stock impact × how debated**. Each item is a **theme with a
history**, not a one-quarter metric. It earns its place through the calls record:

- **Recurrence**: quantified by management in ≥2 consecutive quarters (auto-promote), or a
  Bloomberg-tracked "Highlight" line, or the recurring analyst question.
- **A promise ladder**: a commitment climbing (test → pilot → traction) or going quiet — the
  dissolved Promise-Tracker discipline (project/pipeline/musing; a musing repeated verbatim
  across calls is itself the signal; silence on a live project = flag).
- **A standing phrase**: management language repeated verbatim across calls is trackable — the
  moment it changes, the story changes (e.g. GOOGL's "monetization at approximately the same
  rate").
- **breaks** — every item carries a falsifiable red-line (what would break the thesis).
- **pista (🔎)** — a standing READ, not a wish-list question no exec answers.
- If you can't state why a theme is on the list in one grounded sentence, it doesn't belong.

---

## 5. Post-Call highlights — the bar

Insight-first, never restatement. **Every bullet passes Rule 0: FACT → WHY → SO WHAT** (the full
rule, source hierarchy, taxonomy and regression tests live in `EARNINGS_CALLS_CONTEXT.md` §1–§2,
§5 — run the three passes there BEFORE writing any highlight). A PM reads the take + skims the
heads in 30 seconds and knows what to say in the meeting; depth lives in pop-ups.

---

## 6. Self-audit checklist (run before finishing; report PASS/FAIL)

- [ ] Calls repo: `<TICKER>-latest.md` + `<TICKER>.md` exist; rotation respected; append-only.
- [ ] Setup: exactly 4 headline (Revenue/Op income/EPS/EBITDA) + 4 customs; every value traced to
      the Bloomberg export (`asOf` set); YoY computed vs the same reported quarter; Summit column
      renders (values or "to fill"); toggle works (Consensus/Summit/Both); caveat pop-ups on any
      number with a known trap; debate enabled (filled or to-fill state).
- [ ] Watch List: exactly 5 themes; each has `since` + `thread` + falsifiable `breaks` + a tell
      that is a read (not a question) + one-sentence grounding; promise items embedded (no
      standalone Promise tab anywhere).
- [ ] Earnings Calls themes view built (`<TICKER>_THEMES`) and wired as an Evolution sub-tab.
- [ ] Placement: Call Prep = Evolution sub-tab; 4 phase tabs; `wireCallPrep` wired; render fns
      ported from `googl.js` unmodified except data/brand.
- [ ] Rule 0 respected everywhere (no bare numbers as highlights); regression tests of
      `EARNINGS_CALLS_CONTEXT.md` §5 pass against the analysis.
- [ ] `node --check` clean · `&amp;` count = 0 · no orphan identifiers · localhost renders.
- [ ] Committed on a feature branch; Dani opens PRs; San/Oscar merge. Flag anything unsourced.
