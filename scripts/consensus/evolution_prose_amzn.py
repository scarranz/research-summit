# -*- coding: utf-8 -*-
"""Compose the AMZN `evolution` block: generated arrays + hand-written prose, and splice it in.

One-off for this migration. The ARRAYS come from emit_evolution.py (out/evolution_amzn.js);
only the prose lives here, because a note is a reading of the numbers and no generator can
write one. Re-run emit_evolution.py first if the dumps change.
"""
import io, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, '..', '..'))
gen = open(os.path.join(HERE, 'out', 'evolution_amzn.js'), encoding='utf-8').read()

NOTES = {
'capex':
 'The re-rate of the cycle, in two steps. The Feb-2026 file — days after the 4Q25 print and its '
 'capex guidance — took FY26 from $150.7B to $204.5B (+36%) and FY27 from $163.8B to $227.2B '
 '(+39%); May barely moved either. Then the Aug-3 save re-cut the back years hard: FY27 $231.1B → '
 '$276.8B and FY28 $146.1B → $346.0B. That closes the internal inconsistency flagged earlier — the '
 'old FY28 total sat near $151B against a segment capex sum around $245B — but overshoots it, and '
 'FY28 now sits above the Street’s $293.4B. ⚠ The same save left the FY29 capex row empty, which is '
 'why FY29 (and the free cash flow that depends on it) stops after Jul 30. The model projects capex '
 'annually only; the dashed line is the Bloomberg workbook mapped to the nearest export on or '
 'before each model date, so it can be up to three months stale.',
'fcf':
 'The mirror of the capex re-rate, and the noisiest line here. FY26 flipped from +$27.8B (Dec) to '
 '−$26.8B (Feb) as capex re-rated, recovered to +$13.0B by May 13 on a higher cash-flow forecast, '
 'then went back to −$0.6B on Aug 3 when capex was raised again against an unchanged CFO. FY28 '
 'swings $183.7B → −$16.1B → $100.5B across the last three files for the same reason. Read this '
 'line together with capex and read the Aug-3 column for what it is — a capex-only revision. Where '
 'a year flips sign the revision is shown in dollars only; a percent is meaningless across zero. No '
 'Bloomberg free-cash-flow consensus is stored per snapshot.',
'rev':
 'Both the model and the Street revised revenue UP at every snapshot for FY26 and FY27; the '
 'out-years are where they part. Summit trimmed FY28 from $1,115B to $1,079B and FY29 from $1,322B '
 'to $1,239B at the May-13 file, then rebuilt to $1,101B / $1,267B by Aug 4 — while consensus '
 'climbed straight through to $1,069B / $1,196B. The model still sits above the Street in every '
 'year, but the FY28 gap has closed from ~$91B to ~$32B. In the growth view: implied FY26 growth '
 'ran 12.4% → 15.9% across the seven files.',
'ebitda':
 'Steady upward revisions on both columns — and then a jump that needs checking. Summit’s FY28 '
 'EBITDA went $311.1B (Aug 3) to $430.1B (Aug 4) and FY29 $375.7B to $531.7B, while revenue in the '
 'same save moved less than 2%. That implies an FY28 EBITDA margin of 39% against 29% a day '
 'earlier, and puts Summit 21% ABOVE a consensus it had been below in every prior file. ⚠ Model '
 'flag — raise with the model owner before quoting an out-year margin. Everything through the '
 'Jul-30 column is the conservative picture the earlier read described, with consensus above the '
 'model in every year.',
'earnings':
 'Earnings as the model defines them (adjusted — not GAAP net income), against the matching '
 'Bloomberg estimate stored at each snapshot. Both were revised up at every file, and consensus '
 'stays above Summit in every year and every vintage — with the gap WIDENING, not closing: FY26 was '
 '$8.4B apart in December and $22.4B apart on Aug 4, after the Street re-rated FY26 from $96.5B to '
 '$114.4B in one step on the 2Q26 print (the quarter that carried $53.4B of pre-tax other income, '
 'largely the Anthropic mark — so read that step as a basis event, not a change of view). FY28 '
 'remains the widest structural gap, $149.7B against $137.4B.',
'aws':
 'AWS is where the model’s upward revisions concentrate: every year raised at every file that '
 'moved, and the out-years hardest — FY27 went $189.3B → $234.2B (+24%) and FY29 $295.8B → $365.9B '
 '(+24%) across the eight months. The Street tracked it almost exactly; the two lines sit within 1% '
 'of each other in FY26 and FY27 at nearly every snapshot, and consensus is the higher of the two '
 'in FY28 ($304.4B against $292.7B). Bloomberg’s segment estimates reach three years out, so FY29 '
 'has no dashed twin.',
'usrev':
 'The control group: North America barely moves. Every FY26 and FY27 revision lands within ±0.5% '
 'across all seven files; the only real change is FY28–29, trimmed ~4% and ~9% at the May-13 file '
 'and held there since. The re-rates of 2026 were an AWS story — and its capex bill — not a retail '
 'one. ⚠ No Street line here on purpose: the Bloomberg workbook’s ANNUAL North-America revenue cell '
 'has reprinted the same three numbers since May 2021, relabelling them one year forward at each '
 'print, so it is not a time series. Its quarterly twin is sound and is used in Results.',
'intrev':
 'Raised ~5% at the Feb snapshot after the strong 4Q25 international print, then walked back: FY28 '
 'fell from $249.8B to $236.5B and FY29 from $299.8B to $271.9B at the May-13 file. The Street moved '
 'the other way in the out-years until Aug 4, when it cut FY28 from $229.9B to $214.2B. The two now '
 'agree that International compounds more slowly than the 2025 exit rate implied, with the model '
 'the more optimistic of the pair.',
'opinc':
 'Total operating income DERIVED as the sum of the model’s three segment projections per vintage '
 '(the model zeroes its own total-op-income row; the segment revenue sum ties to total revenue to '
 'the dollar, so the margin is consistent). Revised up at every file — FY26 $95.8B → $110.1B, FY28 '
 '$132.0B → $170.0B — and in the margin view the consolidated operating margin climbs from 11.9% to '
 '13.2% for FY26 and reaches ~16.4% by FY29. No Bloomberg op-income consensus is stored per '
 'snapshot; the Street’s forward op income lives in the Results quarterly view.',
'naopinc':
 'North America profitability drifted sideways for three files, then stepped up on Aug 4: FY27 '
 '$41.6B → $46.8B and FY28 $46.9B → $51.5B after the 2Q26 print. In the margin view the model now '
 'runs North America at ~7.9% in FY26 rising to ~9.0% by FY29 — where the earlier read had it '
 'fading to a flat 7.0%.',
'intopinc':
 'The one line consistently revised DOWN and never taken back: FY26 went $8.9B → $6.9B (−22%) and '
 'FY27 $11.9B → $8.6B (−27%) across the seven files, even as International revenue held. In the '
 'margin view the assumed margin fades from 5.0% to 3.8% for FY26 and from 6.0% to 4.2% for FY27. '
 'The model pushed International profitability out — the mirror image of its AWS re-rate.',
'awsopinc':
 'AWS profitability followed the revenue re-rate with a lag and has been raised at every file that '
 'moved: FY26 $52.3B → $65.9B (+26%) and FY27 $66.3B → $84.3B (+27%) over the eight months, with '
 'the biggest single steps at May 5 (after the 1Q26 margin beat) and Aug 4 (after 2Q26 printed a '
 '39.4% segment margin). In the margin view the assumed AWS operating margin lifts from ~34% to '
 '~38% in FY26.',
}

# drop the generator's placeholder notes and put the real ones in
out, cur = [], None
for line in gen.splitlines():
    m = re.match(r"      ([a-z0-9_]+): \{ label:", line)
    if m:
        cur = m.group(1)
    m2 = re.match(r"(\s*)note: '.*' \},?\s*$", line)
    if m2 and cur:
        note = NOTES[cur].replace("\\", "\\\\").replace("'", "\\'")
        out.append("        note: '%s' }," % note)
        cur = None
        continue
    out.append(line)
metrics = "\n".join(out)

INTRO = (
 'How the forecast itself has moved. Each line tracks one fiscal year’s estimate across the '
 'model’s saved snapshots — solid is the Summit model, dashed is the Bloomberg consensus stored '
 'alongside it at the same date. Two blocks, mirroring Results: Top Line (revenue and segments, '
 'with the growth each snapshot implies) and Profitability (spend and earnings power, with '
 'margins). Seven files, December 2025 to August 2026, spanning three prints. The story of the '
 'year is capex and AWS: the February file re-rated FY26 capex from $151B to $205B and flipped '
 'FY26 free cash flow negative, the Aug-3 file raised FY27–28 capex again, and AWS was revised up '
 'at every step — the FY27 AWS forecast is 24% higher than it was in December.')

BLOCK_NOTE = (
 'Single source: every number on this tab comes from the Summit Research database — the model’s '
 'saved snapshots (vintages) as recorded in the DCF’s Projection History, pulled through the '
 'Summit MCP rather than hand-parsed from a spreadsheet. Seven files: Dec 18, 2025 (before the '
 '4Q25 print), Feb 10, 2026 (after it), May 5 and May 13, 2026 (after 1Q26 — the second is a '
 're-cut of EBITDA, earnings and the FY28–29 segment build), Jul 30 and Aug 3, 2026 (both still '
 'pre-2Q26-print: they carry the May projection for 2Q26 against what the quarter actually '
 'printed, and Aug 3 differs from Jul 30 in capex alone), and Aug 4, 2026 (the re-cut that '
 'ingested 2Q26). Consensus = the Bloomberg estimates stored inside those same snapshot blocks for '
 'revenue, EBITDA and earnings — same save date as the solid line — and, for AWS, International '
 'and capex, the Bloomberg workbook mapped to the nearest export on or before each model date. '
 'Null where no consensus exists on that basis. Implied growth chains entirely within Summit’s '
 'data: each fiscal year against the prior year’s value stored in the same vintage.')

block = """  // Estimate EVOLUTION across model snapshots (vintages) — how the ANNUAL
  // forecast for each fiscal year moved as prints landed. Source of record:
  // the SUMMIT RESEARCH DATABASE (the DCF's Projection History, where the
  // vintages live), read through the Summit MCP by scripts/consensus/
  // emit_evolution.py. GENERATED — the arrays are rebuilt from the snapshot
  // dumps; only the prose is hand-written. `cons` is the Bloomberg estimate
  // stored INSIDE the model at the same snapshot (revenue / EBITDA / earnings),
  // or the workbook mapped onto the model's calendar (AWS / International /
  // capex); null where neither exists.
  // Arrays: one row per fiscal year (parallel to `years`), one value per vintage.
  evolution: {
    intro: '%(intro)s',
    vintages: [
      { label: 'Dec 18, 2025', event: 'pre-4Q25 print' },
      { label: 'Feb 10, 2026', event: 'post-4Q25 print' },
      { label: 'May 5, 2026',  event: 'post-1Q26 print' },
      { label: 'May 13, 2026', event: 'EBITDA / out-year re-cut' },
      { label: 'Jul 30, 2026', event: 'pre-2Q26 print' },
      { label: 'Aug 3, 2026',  event: 'capex re-cut, still pre-print' },
      { label: 'Aug 4, 2026',  event: 'post-2Q26 print' }
    ],
    years: ['2026', '2027', '2028', '2029'],
    sections: [
      { key: 'top', label: 'Top Line', defaultMetric: 'rev', groups: [
        { label: 'Totals', keys: ['rev'] },
        { label: 'Segments', keys: ['aws', 'usrev', 'intrev'] }
      ] },
      { key: 'prof', label: 'Profitability', defaultMetric: 'capex', groups: [
        { label: 'Company', keys: ['capex', 'fcf', 'opinc', 'ebitda', 'earnings'] },
        { label: 'Segments (GAAP op. income, Summit only)', keys: ['naopinc', 'intopinc', 'awsopinc'] }
      ] }
    ],
    metrics: {
%(metrics)s
    },
    note: '%(blocknote)s'
  },
""" % {'intro': INTRO.replace("'", "\\'"),
       'metrics': metrics.rstrip(),
       'blocknote': BLOCK_NOTE.replace("'", "\\'")}

path = os.path.join(REPO, 'js', 'results-data', 'amzn.js')
src = open(path, encoding='utf-8').read()

def match_brace(text, start):
    d, i, n, q = 0, start, len(text), None
    while i < n:
        c = text[i]
        if q:
            if c == '\\': i += 2; continue
            if c == q: q = None
        elif c in '"\'': q = c
        elif c == '{': d += 1
        elif c == '}':
            d -= 1
            if d == 0: return i + 1
        i += 1
    return n

m = re.search(r'\n(  // Estimate EVOLUTION.*?\n)?  evolution: \{', src, re.S)
st = m.start() + 1
ob = src.index('{', src.index('evolution:', st))
en = match_brace(src, ob)
while en < len(src) and src[en] in ',\n': en += 1
new = src[:st] + block + src[en:]
open(path, 'w', encoding='utf-8', newline='\n').write(new)
print('evolution block replaced: %d -> %d bytes' % (len(src), len(new)))
