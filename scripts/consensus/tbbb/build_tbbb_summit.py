# build_tbbb_summit.py - reads the Summit DCF model for TBBB (DCF TBBB.xlsm, tab "Projection History") and writes
#   scripts/consensus/out/summit_tbbb.json         every vintage, annual + quarterly, plus each submit's valuation block
#   scripts/consensus/out/estmatrix_summit_tbbb.js the SUMMIT half of estMatrix (spliced by apply_matrix.py)
# Usage:  py -I build_tbbb_summit.py "<path to DCF TBBB.xlsm>"
# The tab holds five saved submits stacked in blocks of 56 rows (newest first, ID 5 -> ID 1); the header row carries the
# annual (2018-2045) and quarterly (Q1 - 2022 ...) columns and the valuation columns (Snapshot Date ... Price Target ...).
# Facts that shaped the filters (checked Nov 2 2026):
#  - Quarterly cells for quarters ALREADY reported are the model's frozen pre-print projections (SoFi-style), not actuals.
#  - ID 1 (Dec 12 2025): its quarterly rows from Q1 - 2026 on are broken for P&L lines (negative gross profit, EBITDA of
#    -20,000), so only its stores / SSS / DCs quarters are kept; its annual rows are fine.
#  - ID 5 (Nov 2 2026) was saved BEFORE the 3Q26 actuals were loaded: its 3Q26 column is the model's pre-print estimate
#    (gross profit 4,318 vs 4,743 reported), so for the estimates matrix its last actual is 2Q26.
#  - ID 5 annual CAPEX is a per-store ratio (1.4, -1.8) rather than Ps. millions -> capex is not carried.
#  - The model's EBITDA / ADJ_EBITDA rows are model reconstructions after lease cost (they do not tie to reported or
#    adjusted EBITDA) -> not carried as comparable lines; used only as the EV/EBITDA basis in the submit history.
#  - P/E valuation blocks are #VALUE! / #SPILL! (and -78 in ID 1): not usable, not carried.
import openpyxl, sys, json, os, re, warnings
warnings.filterwarnings('ignore')
XLSM = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, '..', 'out'); os.makedirs(OUT, exist_ok=True)
wb = openpyxl.load_workbook(XLSM, data_only=True, read_only=True)
rows = list(wb['Projection History'].iter_rows(values_only=True)); h = rows[0]
START = {5: 2, 4: 72, 3: 128, 2: 184, 1: 240}
CODES = [rows[i][1] for i in range(1, 57)]
ycol = {h[c]: c for c in range(8, 36) if isinstance(h[c], int)}
qcol = {h[c]: c for c in range(37, 120) if isinstance(h[c], str)}
mc = {n: h.index(n) for n in ['Snapshot Date', 'After Quarter', 'Case', 'Multiple Type', 'Multiple', 'Year ', 'Price Target', 'Fair Value', 'Current Price', 'WACC', 'COE', 'COD', 'Equity to Total Capital', 'Beta', 'Avg Market Return', 'RFR', 'Currency FX']}
VINT = {  # n -> (snapshot date, last actual quarter in the model at the time, last actual year)
  1: ('2025-12-12', '3Q25', '2024'), 2: ('2026-03-13', '4Q25', '2025'), 3: ('2026-05-08', '1Q26', '2025'),
  4: ('2026-08-13', '2Q26', '2025'), 5: ('2026-11-02', '2Q26', '2025')}
LABEL = {1: 'Dec 12, 2025', 2: 'Mar 13, 2026', 3: 'May 8, 2026', 4: 'Aug 13, 2026', 5: 'Nov 2, 2026'}
# dataset key -> (code in the tab, scale, decimals, views)
MET = {'rev': ('REV', 1, 0, 'y'), 'gp': ('GROSS_PROFIT', 1, 0, 'qy'), 'sales': ('SALES_EXP', 1, 0, 'qy'), 'admin': ('ADMIN_EXP', 1, 0, 'qy'),
       'sbc': ('SBC', 1, 0, 'qy'), 'netinc': ('EARNINGS', 1, 0, 'qy'), 'stores': ('EYS', 1, 0, 'qy'), 'sss': ('SSS', 100, 1, 'qy'), 'dcs': ('DC', 1, 0, 'qy')}
def qkey(s):
    m = re.match(r'Q(\d) - (\d{4})', s)
    return '%sQ%s' % (m.group(1), m.group(2)[2:]) if m else None
def order(p):
    return (int(p[2:]) * 10 + int(p[0])) if re.match(r'^\dQ\d\d$', p) else int(p) * 10 + 5
def code_row(vid, code):
    if vid == 1 and code == 'REV': k = 0
    else: k = CODES.index(code)
    return rows[START[vid] - 1 + k]
data = {'y': {}, 'q': {}, 'val': {}, 'vintages': []}
for vid, (d, lq, ly) in VINT.items():
    data['vintages'].append({'n': vid, 'id': d, 'label': LABEL[vid], 'lastActual': {'q': lq, 'y': ly}})
for key, (code, sc, dec, views) in MET.items():
    for view in ('y', 'q'):
        if view not in views: continue
        for vid, (d, lq, ly) in VINT.items():
            r = code_row(vid, code)
            cells = {}
            if view == 'y':
                for y in (2025, 2026, 2027, 2028):
                    if y <= int(ly): continue          # forward-only
                    v = r[ycol[y]]
                    if isinstance(v, (int, float)) and v != 0: cells[str(y)] = round(v * sc, dec)
            else:
                for qs, c in qcol.items():
                    p = qkey(qs)
                    if not p or order(p) <= order(lq) or order(p) > order('2Q27') or order(p) < order('3Q25'): continue
                    v = r[c]
                    if not isinstance(v, (int, float)) or v == 0: continue
                    if vid == 1 and key not in ('stores', 'sss', 'dcs') and order(p) >= order('1Q26'): continue   # broken rows in ID 1
                    if key in ('gp', 'sales', 'admin', 'sbc') and v < 0: continue
                    cells[p] = round(v * sc, dec)
            if cells: data[view].setdefault(key, {})[d] = cells
for vid, (d, lq, ly) in VINT.items():
    r = code_row(vid, 'DNA')
    g = lambda n: r[mc[n]]
    data['val'][d] = {'after': g('After Quarter'), 'case_dna_row': g('Case'), 'case_rev_row': code_row(vid, 'REV')[mc['Case']], 'method': g('Multiple Type'), 'mult': g('Multiple'), 'year': g('Year '),
        'pt': g('Price Target'), 'fv': g('Fair Value'), 'px': g('Current Price'), 'wacc': g('WACC'), 'coe': g('COE'), 'cod': g('COD'), 'eq': g('Equity to Total Capital'),
        'beta': g('Beta'), 'rm': g('Avg Market Return'), 'rfr': g('RFR'), 'fx': g('Currency FX'),
        'pe_pt': code_row(vid, 'EARNINGS')[mc['Price Target']],
        'model': {str(y): {'rev': code_row(vid, 'REV')[ycol[y]], 'ebitda': code_row(vid, 'EBITDA')[ycol[y]], 'ni': code_row(vid, 'EARNINGS')[ycol[y]], 'sh': code_row(vid, 'SHARES')[ycol[y]]} for y in (2025, 2026, 2027, 2028)}}
json.dump(data, open(os.path.join(OUT, 'summit_tbbb.json'), 'w'), default=str, indent=1)
L = ['    summit: {', '      vintages: [']
for v in data['vintages']:
    L.append("        { id: '%s', label: '%s', lastActual: { q: '%s', y: '%s' } }," % (v['id'], v['label'], v['lastActual']['q'], v['lastActual']['y']))
L.append('      ],')
def fmt(x): return repr(int(x)) if x == int(x) else repr(x)
for view in ('q', 'y'):
    L.append('      %s: {' % view)
    for key in MET:
        if key not in data[view]: continue
        L.append('      %s: {' % key)
        for v in data['vintages']:
            c = data[view][key].get(v['id'])
            if c: L.append("        '%s': { %s }," % (v['id'], ', '.join("'%s': %s" % (p, fmt(c[p])) for p in sorted(c, key=order))))
        L.append('      },')
    L.append('      },')
L.append('    },')
open(os.path.join(OUT, 'estmatrix_summit_tbbb.js'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print('ok', {k: sorted(v) for k, v in data['y'].items()})
print({k: data['q'][k].get('2026-11-02') for k in ('gp', 'stores')})
print(json.dumps(data['val'], default=str)[:2500])
