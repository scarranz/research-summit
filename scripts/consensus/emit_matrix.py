# Emit the generated `estMatrix.cons` block for a ticker, from the UNION of
#   (a) BBG_CONSENSUS.txt   — the exported ARCHIVE (never loses a snapshot)
#   (b) Consensus_Portal.xlsm sheet BBG_CONSENSUS — the LIVE sheet (can overwrite its last row)
# deduped by (ticker, data_as_of). Only FORWARD horizons are consensus.
import openpyxl, csv, json, sys, re

import os
# The two Bloomberg sources live in the team's Google Drive, whose drive letter differs per
# machine. Override with the SUMMIT_DOCS environment variable:
#     SUMMIT_DOCS="D:/My Drive/Summit/Docs/0" py emit_matrix.py UBER map_uber.json
DOCS = os.environ.get('SUMMIT_DOCS', 'G:/My Drive/Summit/Docs/0')
HERE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(HERE, 'out'); os.makedirs(OUT, exist_ok=True)

TXT = os.path.join(DOCS, 'BBG_CONSENSUS.txt')
WB  = os.path.join(DOCS, 'Consensus_Portal.xlsm')
TK  = (sys.argv[1] if len(sys.argv) > 1 else "UBER").upper()
MAP = json.load(open(sys.argv[2], encoding='utf-8'))          # {"q":{metric:bbgcol},"y":{...}}
VALID = json.load(open(sys.argv[3], encoding='utf-8')) if len(sys.argv) > 3 else {}

QH = ['fq-3','fq0','fq+1','fq+2','fq+3','fq+4']
YH = ['fy0','fy+1','fy+2','fy+3','fy+4','fy+5']
HORN = {'fq+1':1,'fq+2':2,'fq+3':3,'fq+4':4,'fy+1':1,'fy+2':2,'fy+3':3,'fy+4':4,'fy+5':5}

def num(v):
    if v is None: return None
    if isinstance(v,(int,float)): return float(v)
    s=str(v).strip()
    if not s or s.startswith('#N/A'): return None
    try: return float(s)
    except ValueError: return None

def canon(lbl):
    if lbl is None: return None, None
    s=str(lbl).strip()
    m=re.match(r'^(\d{4})\s+Q([1-4])\s*\((Rep|Fwd)\)',s)
    if m: return m.group(2)+'Q'+m.group(1)[2:], m.group(3)=='Rep'
    m=re.match(r'^(\d{4})\s+A\s*\((Rep|Fwd)\)',s)
    if m: return m.group(1), m.group(2)=='Rep'
    return None, None

def ordp(p): return int(p[2:])*4+int(p[0]) if 'Q' in p else int(p)

def read_rows(rows, hdr, origin):
    idx={n:i for i,n in enumerate(hdr)}
    out=[]
    for r in rows:
        if not r or not r[0] or not str(r[0]).upper().startswith(TK+' '): continue
        asof=str(r[idx['data_as_of']])[:10]
        fwd, lastQ, lastY = {}, None, None
        for h in QH+YH:
            per,isrep = canon(r[idx[h]])
            if not per: continue
            if isrep:
                if 'Q' in per: lastQ = per if (lastQ is None or ordp(per)>ordp(lastQ)) else lastQ
                else:          lastY = per if (lastY is None or ordp(per)>ordp(lastY)) else lastY
                continue
            for col,i in idx.items():
                if not col.endswith('_'+h): continue
                mname=col[:-(len(h)+1)]
                v=num(r[i])
                if v is None: continue
                fwd.setdefault(mname,{})[per]=(v, HORN.get(h,9))
        out.append({'asof':asof,'fwd':fwd,'lastQ':lastQ,'lastY':lastY,'origin':origin})
    return out

rows_txt = list(csv.reader(open(TXT,newline='',encoding='utf-8-sig'),delimiter='\t'))
snaps = read_rows(rows_txt[1:], [str(v) for v in rows_txt[0]], 'txt')

ws = openpyxl.load_workbook(WB, read_only=True, data_only=True)['BBG_CONSENSUS']
it = ws.iter_rows(values_only=True); wh=[str(v) for v in next(it)]
snaps += read_rows(list(it), wh, 'xlsm')

# dedupe by asof — archive wins on conflict (it is the immutable copy), but note collisions
by={}
for s in snaps:
    if s['asof'] in by:
        by[s['asof']]['origin'] += '+'+s['origin']
    else:
        by[s['asof']]=s
snaps=sorted(by.values(), key=lambda s:s['asof'])
print('%s: %d unique snapshots  (txt-only: %s | xlsm-only: %s)' % (TK, len(snaps),
      ','.join(s['asof'] for s in snaps if s['origin']=='txt'),
      ','.join(s['asof'] for s in snaps if s['origin']=='xlsm')))

def jsnum(v):
    r=round(v,4)
    return str(int(r)) if r==int(r) else repr(r)

lines=[]
lines.append('  // ── GENERATED BLOCK — do not hand-edit. Rebuilt by scripts/gen-consensus (see')
lines.append('  // docs/RESULTS_CONVENTIONS.md §8). Source: the UNION of BBG_CONSENSUS.txt (the exported')
lines.append('  // archive) and Consensus_Portal.xlsm sheet BBG_CONSENSUS (the live sheet, which can')
lines.append('  // overwrite its most recent row), deduped by data_as_of. Only FORWARD horizons are')
lines.append('  // kept — fq-3/fq0/fy0 marked (Rep) are Bloomberg\'s own reported figures, not estimates,')
lines.append('  // and can sit on a different basis than the company\'s own measure.')
lines.append('  estMatrix: {')
lines.append('    cons: {')
lines.append('      vintages: [')
for s in snaps:
    la = "{ q: %s, y: %s }" % (("'%s'"%s['lastQ']) if s['lastQ'] else 'null',
                               ("'%s'"%s['lastY']) if s['lastY'] else 'null')
    lines.append("        { id: '%s', label: '%s', lastActual: %s }," % (s['asof'], s['asof'], la))
lines.append('      ],')
for view, mp in (('q',MAP.get('q',{})), ('y',MAP.get('y',{}))):
    lines.append('      %s: {' % view)
    for mkey, bbgm in mp.items():
        vfrom = (VALID.get(view,{}) or {}).get(mkey)
        cells=[]
        for s in snaps:
            d = s['fwd'].get(bbgm, {})
            pers = [p for p in d if ('Q' in p) == (view=='q')]
            if vfrom: pers=[p for p in pers if ordp(p)>=ordp(vfrom)]
            if not pers: continue
            pers.sort(key=ordp)
            cells.append("        '%s': { %s }," % (s['asof'],
                ', '.join("'%s': %s" % (p, jsnum(d[p][0])) for p in pers)))
        if not cells: continue
        note = ("   // consensus only from %s — earlier BBG cells are off-basis"%vfrom) if vfrom else ''
        lines.append('      %s: {%s' % (mkey, note))
        lines += cells
        lines.append('      },')
    lines.append('      },')
lines.append('    }')
lines.append('  },')
NL = chr(10)
open(os.path.join(OUT, 'estmatrix_%s.js' % TK.lower()), 'w', encoding='utf-8', newline=NL).write(NL.join(lines) + NL)
print('wrote estmatrix_%s.js  (%d lines)' % (TK.lower(), len(lines)))
