# THE ACCEPTANCE TEST for a generated estMatrix.
#
# Replays the ENGINE's own `preprint` rule (js/results.js -> rsSeriesFor) over the matrix that
# emit_matrix.py just wrote, and diffs the result against the flat `cons` array the dataset
# already ships. Every mismatch is one of three things — rounding, a genuine refresh, or a bug —
# and you classify each one before moving on. Do not skip this.
#
# It reads the GENERATED sidecar (out/estmatrix_<tk>.json), not the workbook, on purpose: a
# verifier that re-derives from source only proves two parsers agree. This one tests what ships.
#
#   py verify_preprint.py AMZN
#
# ── the engine rule, restated ────────────────────────────────────────────────────────────────
#   preprint(P) = among vintages whose lastActual[view] is strictly BEFORE P, the one with the
#                 LATEST lastActual (ties -> later snapshot id). A snapshot is an estimate only
#                 for periods it did not already know.
#   Fallback 1: on an ALREADY-REPORTED period (act != null) the flat array wins — it is the
#               number frozen at that print, and a snapshot is only as fresh as the day it was
#               saved.
#   Fallback 2: where no vintage reaches back far enough, the flat value is kept, not blanked.
#   => the matrix ADDS; it never silently subtracts.
import json, sys, re, os

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, '..', '..'))
OUT  = os.path.join(HERE, 'out')
TK   = (sys.argv[1] if len(sys.argv) > 1 else "AMZN").upper()
SRC  = sys.argv[2] if len(sys.argv) > 2 else 'cons'          # 'cons' or 'summit'

mx = json.load(open(os.path.join(OUT, 'estmatrix_%s.json' % TK.lower()), encoding='utf-8'))
js = open(os.path.join(REPO, 'js', 'results-data', '%s.js' % TK.lower()), encoding='utf-8').read()

def ordp(p): return int(p[2:])*4 + int(p[0]) if 'Q' in p else int(p)

# ── pull `periods` / `act` / <src> out of the dataset, by brace-matching the view blocks ──────
def block(text, start):
    """text[start] must be '{'; return the index just past its matching '}' (string-aware)."""
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

def view_src(view):
    vi = js.find('  views: {')
    if vi < 0: return ''
    vend = block(js, js.index('{', vi))
    vs = js[vi:vend]
    mi = re.search(r'\n    %s: \{' % view, vs)
    if not mi: return ''
    st = vs.index('{', mi.start())
    return vs[st:block(vs, st)]

def arr(mb, name):
    m = re.search(r'\b' + name + r':\s*\[(.*?)\]', mb, re.S)
    if not m: return None
    out = []
    for x in m.group(1).split(','):
        x = x.strip()
        if not x: continue
        if x == 'null': out.append(None)
        elif x[0] in '"\'': out.append(x.strip('"\''))
        else:
            try: out.append(float(x))
            except ValueError: out.append(None)
    return out

def metric_block(vsrc, mkey):
    m = re.search(r'\n        %s: \{' % re.escape(mkey), vsrc)
    if not m: return None
    st = vsrc.index('{', m.start())
    return vsrc[st:block(vsrc, st)]

vints = mx['vintages']
def preprint(view, mkey, periods, act, flat):
    cells = mx.get(view, {}).get(mkey, {})
    out = []
    for i, p in enumerate(periods):
        po = ordp(p)
        f = flat[i] if flat and i < len(flat) else None
        a = act[i] if act and i < len(act) else None
        if f is not None and a is not None:                     # fallback 1
            out.append((f, 'flat/frozen')); continue
        best = None
        for v in vints:
            row = cells.get(v['id'])
            if not row or row.get(p) is None: continue
            la = (v.get('lastActual') or {}).get(view)
            lo = -10**9 if la is None else ordp(la)
            if not (lo < po): continue
            if best is None or lo > best[0] or (lo == best[0] and v['id'] > best[1]):
                best = (lo, v['id'], row[p])
        out.append((best[2], best[1]) if best else (f, 'flat/unreachable'))   # fallback 2
    return out

print('%s — %d vintages, %s .. %s' % (TK, len(vints), vints[0]['id'], vints[-1]['id']))
print('source under test: %s\n' % SRC)
grand = {'match':0,'diff':0,'filled':0,'dropped':0}
for view in ('q','y'):
    vsrc = view_src(view)
    if not vsrc: continue
    for mkey in mx.get(view, {}):
        mb = metric_block(vsrc, mkey)
        if mb is None:
            print('  ??   %s.%-9s not in the dataset — matrix row will be inert' % (view, mkey)); continue
        pers, act, flat = arr(mb, 'periods'), arr(mb, 'act'), arr(mb, SRC)
        if not pers: print('  ??   %s.%-9s no periods[]' % (view, mkey)); continue
        got = preprint(view, mkey, pers, act, flat)
        ok = bad = filled = dropped = 0; details = []
        for i, p in enumerate(pers):
            new, why = got[i]
            old = flat[i] if flat and i < len(flat) else None
            if old is None and new is None: continue
            if old is None: filled += 1; details.append('+ %-5s %-12s  (%s)' % (p, '%.4g'%new, why)); continue
            if new is None: dropped += 1; details.append('- %-5s was %-12s -> BLANK' % (p, '%.4g'%old)); continue
            # 0.15% relative, with a $0.6M absolute floor for the money lines only — an
            # absolute floor on an EPS series would swallow a 30% miss.
            tol = max(abs(old)*0.0015, 0.6) if abs(old) >= 100 else abs(old)*0.002
            if abs(new - old) <= tol: ok += 1
            else:
                bad += 1
                details.append('~ %-5s js=%-12s matrix=%-12s (%s)  %+.1f%%' % (
                    p, '%.6g'%old, '%.6g'%new, why, (new-old)/old*100 if old else 0))
        flag = 'OK  ' if bad == 0 else 'DIFF'
        print('  %s %s.%-9s  same=%-3d changed=%-3d filled=%-3d blanked=%-3d' %
              (flag, view, mkey, ok, bad, filled, dropped))
        for d in details[:10]: print('         ' + d)
        if len(details) > 10: print('         … %d more' % (len(details)-10))
        grand['match'] += ok; grand['diff'] += bad; grand['filled'] += filled; grand['dropped'] += dropped
print('\nTOTAL  same=%(match)d  changed=%(diff)d  filled=%(filled)d  blanked=%(dropped)d' % grand)
print('changed>0 on a REPORTED period means the flat array lost — investigate.')
print('blanked>0 means the matrix subtracted from the dataset — that must never happen.')
