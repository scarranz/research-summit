"""Splice the two generated halves into js/results-data/<tk>.js as one `estMatrix` block.

    py apply_matrix.py AMZN            # writes into the dataset, in place
    py apply_matrix.py AMZN --dry      # print what would change, touch nothing

Inputs (whichever exist):
    out/estmatrix_<tk>.js          <- emit_matrix.py         (the `cons` side)
    out/estmatrix_summit_<tk>.js   <- emit_summit_matrix.py  (the `summit` side)

The block lands at the dataset ROOT, immediately before `evolution:` (or before the closing
brace when there is none) — machine-generated numbers must never mix into the hand-curated
metric blocks. Re-running replaces the previous block wholesale; nothing else in the file is
touched, which is the property that makes a quarterly refresh a one-command job.
"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, '..', '..'))
OUT  = os.path.join(HERE, 'out')
TK   = (sys.argv[1] if len(sys.argv) > 1 else 'AMZN').upper()
DRY  = '--dry' in sys.argv

def read(p):
    return open(p, encoding='utf-8').read() if os.path.exists(p) else None

cons_blk   = read(os.path.join(OUT, 'estmatrix_%s.js' % TK.lower()))
summit_blk = read(os.path.join(OUT, 'estmatrix_summit_%s.js' % TK.lower()))
if not cons_blk and not summit_blk:
    sys.exit('nothing to apply — run emit_matrix.py / emit_summit_matrix.py first')

if cons_blk:
    body = cons_blk.rstrip('\n')
    assert body.endswith('  },'), 'unexpected tail in the cons block'
    body = body[:-len('  },')].rstrip('\n')          # drop the estMatrix closer
    if body.endswith('\n    }'):                     # cons had no trailing comma
        body = body[:-len('\n    }')] + '\n    },'
    block = body + ('\n' + summit_blk.rstrip('\n') if summit_blk else '') + '\n  },\n'
else:
    block = '  estMatrix: {\n' + summit_blk.rstrip('\n') + '\n  },\n'

path = os.path.join(REPO, 'js', 'results-data', '%s.js' % TK.lower())
src  = open(path, encoding='utf-8').read()

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

m = re.search(r'\n( *)// ── GENERATED BLOCK.*?\n(?=  estMatrix: \{)|\n  estMatrix: \{', src, re.S)
if m:                                        # replace the existing block, comment banner and all
    st = m.start() + 1
    ob = src.index('{', src.index('estMatrix:', st))
    en = match_brace(src, ob)
    while en < len(src) and src[en] in ',\n': en += 1
    new = src[:st] + block + src[en:]
    what = 'replaced the existing estMatrix block'
else:                                        # first time: sit just before `evolution:`
    anchor = re.search(r'\n(  // .*\n)*  evolution: \{', src)
    if anchor:
        st = anchor.start() + 1
        new = src[:st] + block + src[st:]
        what = 'inserted a new estMatrix block before `evolution:`'
    else:
        st = src.rstrip().rfind('\n};')
        new = src[:st + 1] + block + src[st + 1:]
        what = 'appended a new estMatrix block at the dataset root'

print('%s: %s (%d -> %d bytes)' % (TK, what, len(src), len(new)))
print('   cons  : %s' % ('%d lines' % cons_blk.count('\n') if cons_blk else 'ABSENT'))
print('   summit: %s' % ('%d lines' % summit_blk.count('\n') if summit_blk else 'ABSENT'))
if DRY:
    print('   --dry, nothing written')
else:
    open(path, 'w', encoding='utf-8', newline='\n').write(new)
    print('   wrote %s' % os.path.relpath(path, REPO))
