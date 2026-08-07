# Parse BBG_CONSENSUS.txt into a per-snapshot consensus matrix for one ticker.
import csv, json, sys, collections

import os
# Drive letter differs per machine — override with SUMMIT_DOCS. See emit_matrix.py.
DOCS = os.environ.get('SUMMIT_DOCS', 'G:/My Drive/Summit/Docs/0')
OUT  = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out'); os.makedirs(OUT, exist_ok=True)

PATH = os.path.join(DOCS, 'BBG_CONSENSUS.txt')
TK   = sys.argv[1] if len(sys.argv) > 1 else "UBER"

HOR = ['fq-3','fq0','fq+1','fq+2','fq+3','fq+4','fy0','fy+1','fy+2','fy+3','fy+4','fy+5']
MET = ['rev','opinc','ebitda','eps','nos','cfo','capex','d&a','gross'] + ['kpi%d'%i for i in range(1,9)]

with open(PATH, newline='', encoding='utf-8-sig') as f:
    rows = list(csv.reader(f, delimiter='\t'))
head = rows[0]
idx  = {name: i for i, name in enumerate(head)}

def num(s):
    s = (s or '').strip()
    if not s or s.startswith('#N/A') or s in ('-',''): return None
    try: return float(s)
    except ValueError: return None

def canon(lbl):
    """'2026 Q2 (Rep)' -> '2Q26' ; '2025 A (Rep)' -> '2025'"""
    lbl = (lbl or '').strip()
    if not lbl: return None
    p = lbl.split()
    if len(p) < 2: return None
    yr = p[0]
    if p[1].startswith('Q'): return p[1][1] + 'Q' + yr[2:]
    if p[1] == 'A': return yr
    return None

snaps = []
kpinames = {}
for r in rows[1:]:
    if not r or not r[0].startswith(TK): continue
    asof = r[idx['data_as_of']].strip()
    # KPI slot names for this ticker (they can change between snapshots!)
    kn = {}
    for i in range(1, 9):
        c = 'metric_kpi%d' % i
        if c in idx and r[idx[c]].strip(): kn['kpi%d' % i] = r[idx[c]].strip()
    kpinames[asof] = kn
    cells = {}
    for h in HOR:
        per = canon(r[idx[h]]) if h in idx else None
        if not per: continue
        for m in MET:
            col = '%s_%s' % (m, h)
            if col not in idx: continue
            v = num(r[idx[col]])
            if v is not None: cells.setdefault(m, {})[per] = (v, h)
    snaps.append({'asof': asof, 'cells': cells, 'kpi': kn,
                  'rep_q': canon(r[idx['fq0']]), 'rep_y': canon(r[idx['fy0']])})

snaps.sort(key=lambda s: s['asof'])
print('%s — %d snapshots\n' % (TK, len(snaps)))
print('asof        last rep Q  last rep FY   metrics with data')
for s in snaps:
    print('%-11s %-11s %-13s %s' % (s['asof'], s['rep_q'], s['rep_y'],
          ' '.join(sorted(s['cells'].keys()))))

print('\nKPI slots (per snapshot, only if they differ):')
seen = None
for s in snaps:
    sig = json.dumps(s['kpi'], sort_keys=True)
    if sig != seen: print('  %s  %s' % (s['asof'], json.dumps(s['kpi'])))
    seen = sig

# The matrix: snapshot × period for each metric (quarterly then annual)
for m in ['rev', 'ebitda', 'eps', 'kpi7', 'kpi8']:
    pers = []
    for s in snaps:
        for p in s['cells'].get(m, {}):
            if p not in pers: pers.append(p)
    qs = sorted([p for p in pers if 'Q' in p], key=lambda p: (p[2:], p[0]))
    ys = sorted([p for p in pers if 'Q' not in p])
    for lbl, cols in (('quarterly', qs), ('annual', ys)):
        if not cols: continue
        print('\n=== %s · %s ===' % (m, lbl))
        print('%-11s %s' % ('asof', ' '.join('%9s' % c for c in cols)))
        for s in snaps:
            cs = s['cells'].get(m, {})
            print('%-11s %s' % (s['asof'], ' '.join(
                ('%9s' % ('%.0f' % cs[c][0] if abs(cs[c][0]) >= 10 else '%.3f' % cs[c][0])) if c in cs else '%9s' % '·'
                for c in cols)))

out = {'ticker': TK, 'snapshots': [{'asof': s['asof'], 'rep_q': s['rep_q'], 'rep_y': s['rep_y'],
        'kpi': s['kpi'], 'cells': {m: {p: v[0] for p, v in d.items()} for m, d in s['cells'].items()},
        'horizon': {m: {p: v[1] for p, v in d.items()} for m, d in s['cells'].items()}} for s in snaps]}
dest = os.path.join(OUT, 'bbg_%s.json' % TK.lower())
with open(dest, 'w', encoding='utf-8') as f: json.dump(out, f, indent=1)
print('\nwrote ' + dest)
