# Build the per-vintage CONSENSUS matrix for a ticker from Consensus_Portal.xlsm, then VERIFY
# that the derived "pre-print" series reproduces what results-data/<tk>.js
# already ships in its hand-built `cons` column.
#
# Rules (the contract):
#   * Only FORWARD horizons are consensus. fq-3 / fq0 / fy0-marked-(Rep) are Bloomberg's
#     own REPORTED figures and are NOT estimates (and can sit on another basis — UBER's
#     1Q24 "ebitda" reported column is 708 against a 1,382 Adjusted EBITDA print).
#   * Pre-print pick for period P = among snapshots that saw P as forward, the one with
#     the SHORTEST horizon; ties broken by the LATEST snapshot.
import openpyxl, json, sys, re, collections

import os
# Drive letter differs per machine — override with SUMMIT_DOCS. See emit_matrix.py.
DOCS = os.environ.get('SUMMIT_DOCS', 'G:/My Drive/Summit/Docs/0')
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, '..', '..'))
OUT  = os.path.join(HERE, 'out'); os.makedirs(OUT, exist_ok=True)

WB  = os.path.join(DOCS, 'Consensus_Portal.xlsm')
TK  = (sys.argv[1] if len(sys.argv) > 1 else "UBER").upper()
SH  = "BBG_CONSENSUS"

QH = ['fq-3','fq0','fq+1','fq+2','fq+3','fq+4']
YH = ['fy0','fy+1','fy+2','fy+3','fy+4','fy+5']
MET = ['rev','opinc','ebitda','eps','nos','cfo','capex','d&a','gross'] + ['kpi%d'%i for i in range(1,9)]

def num(v):
    if v is None: return None
    if isinstance(v,(int,float)): return float(v)
    s = str(v).strip()
    if not s or s.startswith('#N/A'): return None
    try: return float(s)
    except ValueError: return None

def canon(lbl):
    """'2026 Q2 (Rep)' -> ('2Q26', True) ; '2026 A (Fwd)' -> ('2026', False)"""
    if lbl is None: return None, None
    s = str(lbl).strip()
    m = re.match(r'^(\d{4})\s+Q([1-4])\s*\((Rep|Fwd)\)', s)
    if m: return m.group(2)+'Q'+m.group(1)[2:], m.group(3)=='Rep'
    m = re.match(r'^(\d{4})\s+A\s*\((Rep|Fwd)\)', s)
    if m: return m.group(1), m.group(2)=='Rep'
    return None, None

wb = openpyxl.load_workbook(WB, read_only=True, data_only=True)
ws = wb[SH]
rows = ws.iter_rows(values_only=True)
hdr  = [str(v) for v in next(rows)]
idx  = {n:i for i,n in enumerate(hdr)}

snaps = []
for r in rows:
    if not r or not r[0] or not str(r[0]).upper().startswith(TK+' '): continue
    asof = str(r[idx['data_as_of']])[:10]
    kpi  = {('kpi%d'%i): (str(r[idx['metric_kpi%d'%i]]).strip() if r[idx['metric_kpi%d'%i]] else '')
            for i in range(1,9)}
    fwd, rep, hor = {}, {}, {}
    lastQ, lastY = None, None
    for h in QH+YH:
        per, isrep = canon(r[idx[h]])
        if not per: continue
        for m in MET:
            c = '%s_%s' % (m, h)
            if c not in idx: continue
            v = num(r[idx[c]])
            if v is None: continue
            (rep if isrep else fwd).setdefault(m, {})[per] = v
            if not isrep: hor.setdefault(m, {})[per] = h
    snaps.append({'asof':asof,'kpi':kpi,'fwd':fwd,'rep':rep,'hor':hor,'lastQ':lastQ,'lastY':lastY})

def ordp(p):
    return int(p[2:])*4 + int(p[0]) if 'Q' in p else int(p)

# recompute lastQ/lastY now that ordp exists
for s in snaps:
    lq = ly = None
    for m in s['rep'].values():
        for p in m:
            if 'Q' in p: lq = p if (lq is None or ordp(p) > ordp(lq)) else lq
            else:        ly = p if (ly is None or int(p) > int(ly)) else ly
    s['lastQ'], s['lastY'] = lq, ly
snaps.sort(key=lambda s: s['asof'])

HORN = {'fq+1':1,'fq+2':2,'fq+3':3,'fq+4':4,'fy+1':1,'fy+2':2,'fy+3':3,'fy+4':4,'fy+5':5,'fy0':0}
def preprint(metric, period):
    """(value, asof, horizon) using shortest-horizon / latest-snapshot."""
    best = None
    for s in snaps:
        v = s['fwd'].get(metric, {}).get(period)
        if v is None: continue
        h = HORN.get(s['hor'][metric][period], 9)
        key = (h, s['asof'])                    # smaller horizon wins; then latest asof
        if best is None or (key[0] < best[0][0]) or (key[0] == best[0][0] and key[1] > best[0][1]):
            best = (key, v, s['asof'], s['hor'][metric][period])
    return (best[1], best[2], best[3]) if best else (None, None, None)

print('%s - %d snapshots in %s' % (TK, len(snaps), SH))
print('  asof        lastRepQ  lastRepFY')
for s in snaps: print('  %-11s %-9s %s' % (s['asof'], s['lastQ'], s['lastY']))
print('\n  KPI slots: ' + json.dumps({k:v for k,v in snaps[-1]['kpi'].items() if v}))

# ── verify against the shipped dataset ────────────────────────────────────────
MAP = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else {}
js  = open(os.path.join(REPO, 'js', 'results-data', '%s.js' % TK.lower()), encoding='utf-8').read()

def shipped(view_key, mkey):
    """pull periods[] and cons[] for a metric out of the JS source"""
    # find the view block
    vi = js.index('\n    %s: {' % view_key)
    vend = js.index('\n    },', vi)
    blk = js[vi:vend]
    mi = blk.find('\n        %s: {' % mkey)
    if mi < 0: return None, None
    mend = blk.find('\n        ', mi+10)
    while mend > 0 and not re.match(r"\n        \w+: \{", blk[mend:mend+40]):
        nxt = blk.find('\n        ', mend+1)
        if nxt < 0: break
        mend = nxt
    mb = blk[mi:mend if mend > 0 else len(blk)]
    def arr(name):
        m = re.search(name + r':\s*\[([^\]]*)\]', mb)
        if not m: return None
        return [None if x.strip()=='null' else (x.strip().strip('"\'') if '"' in x or "'" in x else float(x))
                for x in m.group(1).split(',') if x.strip()]
    return arr('periods'), arr('cons')

print('\n=== derived pre-print  vs  shipped cons ===')
for view, keys in (('q', MAP.get('q', {})), ('y', MAP.get('y', {}))):
    for mkey, bbgm in keys.items():
        pers, cons = shipped(view, mkey)
        if pers is None: print('  %s.%-8s NOT FOUND in js' % (view, mkey)); continue
        ok = bad = miss_js = miss_bbg = 0
        details = []
        for i, p in enumerate(pers):
            v, asof, h = preprint(bbgm, p)
            c = cons[i] if cons and i < len(cons) else None
            if v is None and c is None: continue
            if v is None: miss_bbg += 1; details.append('%s: js=%s bbg=-' % (p, c)); continue
            if c is None: miss_js += 1;  details.append('%s: js=- bbg=%.1f (%s %s)' % (p, v, asof, h)); continue
            if abs(v - c) <= max(0.6, abs(c)*0.0015): ok += 1
            else: bad += 1; details.append('%s: js=%.4g bbg=%.4g (%s %s)' % (p, c, v, asof, h))
        flag = 'OK   ' if bad == 0 else 'DIFF '
        print('  %s %s.%-8s (bbg %-6s) match=%-3d diff=%-3d onlyJS=%-3d onlyBBG=%-3d' %
              (flag, view, mkey, bbgm, ok, bad, miss_js, miss_bbg))
        for d in details[:8]: print('        ' + d)

out = {'ticker':TK,'sheet':SH,'snapshots':[{'asof':s['asof'],'lastQ':s['lastQ'],'lastY':s['lastY'],
        'fwd':s['fwd'],'kpi':{k:v for k,v in s['kpi'].items() if v}} for s in snaps]}
dest = os.path.join(OUT, 'cons_%s.json' % TK.lower())
json.dump(out, open(dest,'w',encoding='utf-8'), indent=1)
print('\nwrote ' + dest)
