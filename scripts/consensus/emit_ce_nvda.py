"""Emit NVDA_CE_CONS — the Evolution ▸ Earnings estimate grid for NVIDIA — from the Bloomberg archive.

    SUMMIT_DOCS="G:/My Drive/Summit/Docs/0" py emit_ce_nvda.py
    (run `py emit_matrix.py NVDA map_nvda_ce.json` first and copy out/estmatrix_nvda.json -> out/ce_nvda.json)

Inputs
  out/ce_nvda.json          the emit_matrix sidecar for map_nvda_ce.json (forward consensus per snapshot)
  BBG_CONSENSUS.txt         for the reported ("(Rep)") fq0 column of each snapshot = Bloomberg's actual
  js/results-data/nvda.js   NOT read here: the lines the Results dataset carries (company-measure actuals)
                            are overlaid at load time in js/overviews/nvda-ce-data.js, so they never drift.
Output
  out/ce_cons_nvda.js       a `var NVDA_CE_CONS_GEN = {...}` block, pasted into js/overviews/nvda-ce-data.js

Rules (playbook §12): qr[i] = [4q out, 3q out, 2q out, 1q out]; for each horizon the LATEST snapshot whose
last reported quarter sits h quarters before the period. qa = the reported value (Bloomberg fq0 Rep of the
first snapshot that knows the quarter). Money in US$ billions, counts in billions (trips) or millions (MAPCs),
EPS in dollars, take rate in %. Capex is positive spend.
"""
import csv, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
DOCS = os.environ.get('SUMMIT_DOCS', 'G:/My Drive/Summit/Docs/0')
csv.field_size_limit(10**9)

side = json.load(open(os.path.join(HERE, 'out', 'ce_nvda.json'), encoding='utf-8'))
V = side['vintages']
mp = json.load(open(os.path.join(HERE, 'map_nvda_ce.json'), encoding='utf-8'))

def qord(p): return int(p[2:]) * 4 + int(p[0])
def qlab(o): y, q = divmod(o - 1, 4); return 'Q%d 20%02d' % (q + 1, y)
def plab(o): y, q = divmod(o - 1, 4); return '%dQ%02d' % (q + 1, y)

# grid quarters: Q3 2022 .. two quarters past the newest snapshot's last reported quarter
last = max(qord(v['lastActual']['q']) for v in V)
QO = list(range(qord('1Q26'), last + 3))   # NVIDIA fiscal quarters: 1Q FY26 (so 3Q FY27 has its year-ago) .. two past the newest snapshot

# reported values from the archive (fq0 Rep), by code+segment
rows = [r for r in csv.DictReader(open(os.path.join(DOCS, 'BBG_CONSENSUS.txt'), encoding='utf-8', errors='replace'), delimiter='\t') if r['ticker'].startswith('NVDA')]
def slot_of(row, code, seg):
    segid = mp['segments'].get(seg) if seg else None
    for k, v in row.items():
        if not k.startswith('code'): continue
        if (v or '').strip() != code: continue
        sl = k[len('code'):]                      # '12' or '_kpi3'
        if sl.startswith('_kpi'): base = 'kpi' + sl[4:]; sk = 'segment_kpi' + sl[4:]
        else: base = 'metric' + sl; sk = 'segment' + sl
        s = (row.get(sk) or '').strip()
        if (segid or '') == (s if s != 'Segment' else ''): return base
        if segid and s.startswith(segid): return base
        if segid is None and s in ('', 'Segment'): return base
    return None
def num(x):
    try: return float(x)
    except: return None
asof2id = {}
for v in V:
    asof2id[v['id']] = v['lastActual']['q']
rep = {}   # line -> {period: value}
for r in rows:
    m, d, y = r['data_as_of'].split('/'); vid = '%s-%02d-%02d' % (y, int(m), int(d))
    la = asof2id.get(vid)
    if not la: continue
    dropped = {k for k, ids in mp.get('dropVintages', {}).get('q', {}).items() if vid in ids}   # old non-GAAP basis: no reported value from these
    for name, spec in mp['q'].items():
        if 'code' not in spec or name in dropped: continue
        sl = slot_of(r, spec['code'], spec.get('segment'))
        if not sl: continue
        val = num(r.get(sl + '_fq0'))
        if val is None: continue
        val *= spec.get('sign', 1)
        rep.setdefault(name, {}).setdefault(la, val)    # first snapshot that knows the quarter wins
    # derived op. income (sum of the four segments)
for name, spec in mp['q'].items():
    if 'sum' in spec:
        parts = [rep.get(p, {}) for p in spec['sum']]
        rep[name] = {p: sum(x[p] for x in parts) for p in parts[0] if all(p in x for x in parts)}

LINES = [  # name in the grid, map key, unit, divisor — only the lines js/results-data/nvda.js does not carry
    ('Research & development', 'rd', '$M', 1), ('Sales, general & administrative', 'sga', '$M', 1), ('EBITDA', 'ebitda', '$M', 1),
    ('Interest income', 'intinc', '$M', 1), ('Income tax', 'tax', '$M', 1), ('Operating cash flow', 'cfo', '$M', 1),
    ('D&A', 'dna', '$M', 1), ('Diluted shares', 'shares', 'M', 1),
]
def rnd(v, u):
    if v is None: return None
    if u == '$': return round(v, 2)
    if u == 'M': return round(v, 2)
    if u == '$M': return round(v, 1)
    return round(v, 3) if abs(v) < 1 else round(v, 2)

out = []
for name, key, u, dv in LINES:
    fwd = side['q'].get(key, {})
    qr = []
    for o in QO:
        p = plab(o); row = [None, None, None, None]
        for v in V:   # oldest -> newest, so the latest snapshot at each horizon wins
            h = o - qord(v['lastActual']['q'])
            if 1 <= h <= 4:
                x = fwd.get(v['id'], {}).get(p)
                if x is not None: row[4 - h] = rnd(x / dv, u)
        qr.append(row)
    qa = [rnd(rep.get(key, {}).get(plab(o)) / dv, u) if rep.get(key, {}).get(plab(o)) is not None else None for o in QO]
    if qord(V[-1]['lastActual']['q']) < QO[-1]:
        pass
    out.append({'k': name, 'u': u, 'qr': qr, 'qa': qa})

js = ['// GENERATED by scripts/consensus/emit_ce_nvda.py — do not hand-edit. Bloomberg archive, %d snapshots %s .. %s.' % (len(V), V[0]['id'], V[-1]['id']),
      'var NVDA_CE_CONS_GEN = {',
      "  asOf:%s," % json.dumps([v['id'] for v in V]),
      "  q:%s," % json.dumps([qlab(o) for o in QO]),
      '  m:[']
for m in out:
    js.append("    { k:%s, u:%s, qr:%s, qa:%s }," % (json.dumps(m['k']), json.dumps(m['u']), json.dumps(m['qr']).replace(' ', ''), json.dumps(m['qa']).replace(' ', '')))
js += ['  ]', '};']
open(os.path.join(HERE, 'out', 'ce_cons_nvda.js'), 'w', encoding='utf-8', newline='\n').write('\n'.join(js) + '\n')
for m in out:
    i = [qlab(o) for o in QO].index('Q2 2027'); j = i + 1
    print('%-32s 2Q27 act=%s 1q-out=%s | 3Q27 1q-out=%s' % (m['k'], m['qa'][i], m['qr'][i][3], m['qr'][j][3]))
