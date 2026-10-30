# build_ma_summit_matrix.py — the SUMMIT side of estMatrix for MA, written to ../out/estmatrix_summit_ma.js (then spliced by apply_matrix.py MA).
# Source: DCF MA - New.xlsm, newest save (snapshot ID 3, 2026-10-28, after the 2Q26 print), read through ma_build.py (annual: Projection History +
# Segments; quarterly: Projection History quarterly columns, see SQ there). The workbook holds two saves, both dated 2026-10-28 an hour apart
# (the first was submitted as if the model had been saved from the start); the engine keys vintages by date, so the newest one is the matrix
# vintage and the earlier one is a point only in Evolution ▸ Estimates (build_ma_evolution.py). Forward-only: 3Q26 onward / 2026 onward.
import io,contextlib,os
HERE=os.path.dirname(os.path.abspath(__file__))
with contextlib.redirect_stdout(io.StringIO()):
    exec(open(os.path.join(HERE,'ma_build.py'),encoding='utf-8').read())
VID='2026-10-28'
def fmt(v,dp):
    r=round(v,dp); return repr(int(r)) if r==int(r) else repr(r)
L=["    summit: {","      vintages: [","        { id: '%s', label: 'Oct 28, 2026', lastActual: { q: '2Q26', y: '2025' } },"%VID,"      ],"]
FQ=['3Q26','4Q26']
L.append("      q: {")
for k,d in SQV.items():
    vals=[(p,d[p]) for p in FQ if p in d]
    if vals:
        dp=2 if k=='eps' else 0
        L.append("      %s: {"%k); L.append("        '%s': { %s },"%(VID,', '.join("'%s': %s"%(p,fmt(v,dp)) for p,v in vals))); L.append("      },")
L.append("      },"); L.append("      y: {")
for k,arr in summit.items():
    vals=[(str(y),arr[i]) for i,y in enumerate(Y) if y>=2026 and arr[i] is not None]
    if vals:
        dp=2 if k=='eps' else 0
        L.append("      %s: {"%k); L.append("        '%s': { %s },"%(VID,', '.join("'%s': %s"%(p,fmt(v,dp)) for p,v in vals))); L.append("      },")
L.append("      },"); L.append("    },")
open(os.path.join(HERE,'..','out','estmatrix_summit_ma.js'),'w',encoding='utf-8',newline='').write('\n'.join(L)+'\n')
print('summit matrix: %d q keys, %d y keys'%(sum(1 for d in SQV.values() if any(p in d for p in FQ)),sum(1 for a in summit.values() if any(a[i] is not None for i,y in enumerate(Y) if y>=2026))))
