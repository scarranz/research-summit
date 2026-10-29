# apply_release_q3_26.py — puts the Q3 2026 PRINT into js/results-data/ma.js before BBG_CONSENSUS.txt carries it.
# The newest Bloomberg export (data_as_of 2026-10-28) is the snapshot taken the day BEFORE the print, so fq0 (3Q26) is still an estimate there.
# Until the next export, the 3Q26 `act` cell of each line is READ FROM THE RELEASE (8-K Ex. 99.1 of Oct 29 2026, plus the earnings deck and the
# supplemental operational data), on the same basis the Bloomberg series uses:
#   - GAAP lines as reported (operating income, net income, EPS $5.28, pre-tax, tax, opex lines); EBITDA = adjusted operating income + D&A
#     (5,935 + 326; the same identity reproduces 3Q25's 5,434).
#   - Cash-flow lines are the nine-month figure less the 1Q26 + 2Q26 cells already in the file (cash-flow basis, so repurchases are the cash
#     paid, 2,756, against the $3.0B the company says it bought in the quarter; the nine-month total ties: 11,893). Capex is purchases of
#     property and equipment (667 YTD less 445 = 222), the same basis as the earlier cells; capitalized software is not in the line.
#   - Provision for litigation is the release's 74 (the file's 1Q26 cell of 202 is the restructuring charge, not litigation).
#   - Yields are computed exactly as build_ma_dataset.py does (three decimals).
# Also adds the Q4 2026 guide band (outlook table, GAAP row: net revenue high end of low double digits, operating expenses high single digit).
# When the next BBG export carries 3Q26, regenerate with build_ma_dataset.py and delete the override (the cells then come from the archive).
import re, sys, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
F = os.path.abspath(os.path.join(HERE, '..', '..', '..', 'js', 'results-data', 'ma.js'))
s = open(F, encoding='utf-8').read()
cut = s.index("\n    y: {")                       # the quarterly view comes first; the annual view repeats the keys
head, tail = s[:cut], s[cut:]
P = re.search(r"periods: \[([^\]]*)\]", head).group(1).replace("'", '').split(', ')
I3, I4 = P.index('3Q26'), P.index('4Q26')

def cells(key, field):
    m = re.search(r"\n        %s: \{.*?\n          %s:\s*\[([^\]]*)\]" % (key, field), head, re.S)
    return [None if x.strip() == 'null' else float(x) for x in m.group(1).split(',')]
def put(key, field, idx, val):
    global head
    m = re.search(r"(\n        %s: \{.*?\n          %s:\s*\[)([^\]]*)(\])" % (key, field), head, re.S)
    parts = [x.strip() for x in m.group(2).split(',')]
    parts[idx] = 'null' if val is None else (str(int(val)) if float(val).is_integer() else repr(val))
    pad = '    ' if field == 'act' else ''
    head = head[:m.start(2)] + ', '.join(parts) + head[m.end(2):]

A = lambda k: cells(k, 'act')
ytd = lambda k, v: v - A(k)[P.index('1Q26')] - A(k)[P.index('2Q26')]
R = {   # 3Q26 release values ($M unless noted)
 'rev': 9807, 'opinc': 5862, 'ebitda': 5935 + 326, 'eps': 5.28, 'ni': 4628, 'pti': 5741,
 'opex': 3945, 'ga': 3293, 'am': 252, 'dna': 326, 'lit': 74,
 'intexp': 250, 'netint': 250 - 88, 'intnet': 121, 'invinc': -88, 'oie': -46, 'tax': 1113,
 'shares': 876,
 'gross': 5749 + 6369, 'dom': 3211, 'xb': 3841, 'tp': 4781, 'oth': 285, 'card': 3211 + 3841, 'cinc': -6369,
 'pnr': 5749, 'vas': 4058, 'pvol': 2483000, 'ptx': 49327,
}
R['sbc'] = ytd('sbc', 525)             # nine-month SBC 525
R['cfo'] = ytd('cfo', 11859)
R['capex'] = ytd('capex', 667)
R['fcf'] = R['cfo'] - R['capex']
R['buyback'] = ytd('buyback', 11893)
R['amort'] = ytd('amort', 2030)
inc = -R['cinc']
R['netyld'] = round(R['rev'] / R['pvol'] * 100, 3)
R['grossyld'] = round((R['rev'] + inc) / R['pvol'] * 100, 3)
R['incyld'] = round(inc / R['pvol'] * 100, 3)
# integrity: the release's own identities
assert R['dom'] + R['xb'] + R['tp'] + R['oth'] == R['gross'], 'gross revenue build'
assert R['pnr'] + R['vas'] == R['rev'], 'segments'
assert R['gross'] + R['cinc'] == R['pnr'], 'gross less incentives'
assert R['ga'] + R['am'] + R['dna'] + R['lit'] == R['opex'], 'opex build'
assert R['rev'] - R['opex'] == R['opinc'], 'operating income'
assert R['pti'] - R['tax'] == R['ni'], 'net income'
for k, v in R.items():
    put(k, 'act', I3, v)

# Q4 2026 guide band: the guided GAAP growth (outlook table, Appendix C) applied to 4Q25, same mapping as build_ma_dataset.py (_W).
W = {'hlo': (12, 13), 'hs': (7, 9)}
for key, w in (('rev', 'hlo'), ('opex', 'hs')):
    base = A(key)[P.index('4Q25')]
    put(key, 'guideLo', I4, round(base * (1 + W[w][0] / 100)))
    put(key, 'guideHi', I4, round(base * (1 + W[w][1] / 100)))

# prose that names the last print
head = head.replace('reported through 2026 Q2', 'reported through 2026 Q3, the Q3 cells being the Oct 29 2026 release until the next export')
head = head.replace("Q2 2026 $9,277M is the release", "Q3 2026 $9,807M is the release")
open(F, 'w', encoding='utf-8', newline='').write(head + tail)
print(json.dumps(R, indent=1))
