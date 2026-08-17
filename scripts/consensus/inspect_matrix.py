"""STEP 1 for any ticker: read the Bloomberg workbook's own slot declarations.

    SUMMIT_DOCS="G:/My Drive/Summit/Docs/0" py inspect_matrix.py AMZN

Prints, for the newest snapshot: every metric the export carries, its Bloomberg CODE, its
segment id, its scale, and which horizons hold a number — then the snapshot list with each
file's last reported period, and whether the slot layout drifts between snapshots.

Write `map_<tk>.json` straight off the CODE column. Never off the slot number: slot numbering
is a property of the export, not of the ticker, and the same metric sits at a different index
for every company. The codes differ per ticker too — AMZN's operating income is
IS_COMPARABLE_EBIT, LYFT's is IS_EBIT_AS_REPORTED — which is why emit_matrix.py prints a
resolution report rather than failing quietly.

(This file replaced a v1 that addressed fixed `rev_fq+1` / `kpi1_fq0` column names. Those
columns no longer exist except for the kpi slots, so the old version reported almost nothing.)
"""
import csv, os, sys, re, collections

# The Windows console here is cp1252 and will raise on any of the typography these notes use.
try: sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception: pass

DOCS = os.environ.get('SUMMIT_DOCS', 'G:/My Drive/Summit/Docs/0')
TK   = (sys.argv[1] if len(sys.argv) > 1 else 'AMZN').upper()
PATH = os.path.join(DOCS, 'BBG_CONSENSUS.txt')

rows = list(csv.reader(open(PATH, newline='', encoding='utf-8-sig'), delimiter='\t'))
head = rows[0]; idx = {n: i for i, n in enumerate(head)}
HORS = ['fq-4','fq-3','fq-2','fq-1','fq0','fq+1','fq+2','fq+3','fq+4',
        'fy-2','fy-1','fy0','fy+1','fy+2','fy+3']

def g(r, c):
    if c not in idx or idx[c] >= len(r): return ''
    return (r[idx[c]] or '').strip()

def num(s):
    if not s or s.startswith('#N/A'): return None
    try: return float(s)
    except ValueError: return None

def keydate(r):
    d = g(r, 'data_as_of')
    if '/' in d:
        m, dd, y = d.split('/'); return (int(y), int(m), int(dd))
    return tuple(int(x) for x in d[:10].split('-'))

snaps = [r for r in rows[1:] if r and r[0].strip().upper().startswith(TK + ' ')]
if not snaps:
    tickers = sorted({r[0].strip().split()[0].upper() for r in rows[1:] if r and r[0].strip()})
    sys.exit('%s not in the workbook. It carries: %s' % (TK, ', '.join(tickers)))
snaps.sort(key=keydate)
newest = snaps[-1]

print('%s — %d snapshots, %s .. %s\n' % (TK, len(snaps), g(snaps[0], 'data_as_of'), g(newest, 'data_as_of')))
print('=== slots on the newest snapshot (%s) - write map_%s.json off the CODE column ===' % (
    g(newest, 'data_as_of'), TK.lower()))
print('%-9s %-38s %-36s %-16s %-5s %s' % ('slot', 'label', 'code', 'segment', 'scale', 'horizons with data'))
for pre, tag in (('', 'metric'), ('_kpi', 'kpi')):
    for i in range(1, 51):
        lbl = g(newest, ('metric%d' % i) if not pre else ('metric_kpi%d' % i))
        code = g(newest, ('code%d' % i) if not pre else ('code_kpi%d' % i))
        if not code or code == '0.': continue
        seg = g(newest, ('segment%d' % i) if not pre else ('segment_kpi%d' % i))
        scl = g(newest, ('scale%d' % i) if not pre else ('scale_kpi%d' % i))
        slot = '%s%d' % (tag, i)
        hs = [h for h in HORS if num(g(newest, '%s_%s' % (slot, h))) is not None]
        print('%-9s %-38s %-36s %-16s %-5s %s' % (
            slot, lbl[:38], code, seg.split()[0] if seg else '', repr(scl), ' '.join(hs)))

print('\n⚠ A BLANK scale on a money row means whole units, not millions — AMZN\'s North-America')
print('   operating income arrives as 9123000000 next to siblings at 1717. emit_matrix.py reads')
print('   the scale column; declare the target unit (usdM / eps) and it normalizes.')

print('\n=== snapshots, and what each one had already reported ===')
print('%-12s %-10s %-8s %s' % ('data_as_of', 'last rep Q', 'last FY', 'forward horizons'))
for r in snaps:
    fq0, fy0 = g(r, 'fq0'), g(r, 'fy0')
    fwd = [h for h in HORS if '(Fwd)' in g(r, h)]
    print('%-12s %-10s %-8s %s' % (g(r, 'data_as_of'), fq0, fy0, ' '.join(fwd)))

print('\n=== slot layout drift ===')
def sig(r):
    out = {}
    for pre, tag in (('', 'metric'), ('_kpi', 'kpi')):
        for i in range(1, 51):
            code = g(r, ('code%d' % i) if not pre else ('code_kpi%d' % i))
            if not code or code == '0.': continue
            seg = g(r, ('segment%d' % i) if not pre else ('segment_kpi%d' % i))
            out['%s%d' % (tag, i)] = code + '|' + (seg.split()[0] if seg else '')
    return out
base, changed = sig(snaps[0]), []
for r in snaps[1:]:
    s = sig(r)
    if s != base: changed.append(g(r, 'data_as_of'))
print('  stable across all %d snapshots' % len(snaps) if not changed
      else '  !! layout changes at: %s - resolve by code, never by slot number' % ', '.join(changed))
