# build_ma_evolution.py — splices the `evolution` block (Evolution ▸ Estimates) into js/results-data/ma.js, AFTER apply_matrix.py has written estMatrix.
#   vintages — every Bloomberg snapshot that carries a forecast for FY2026-FY2028 (BBG_CONSENSUS.txt, via scripts/consensus/out/estmatrix_ma.json)
#   cons     — the Street's FY estimate in each snapshot
#   summit   — the Summit DCF model has ONE saved snapshot (DCF MA - New.xlsm, read in the newest vintage's week), so each Summit series is a single
#              point in the last vintage and null before it; it is the model's own annual line already frozen in the dataset
# Mastercard has one Summit snapshot, so this pane is the Street's revision history with the model's one reading beside it.
import json,os,re,datetime
HERE=os.path.dirname(os.path.abspath(__file__)); W=os.path.abspath(os.path.join(HERE,'..','..','..'))+os.sep
mx=json.load(open(HERE+'/../out/estmatrix_ma.json',encoding='utf-8'))
src=open(W+'js/results-data/ma.js',encoding='utf-8',newline='').read().replace('\r\n','\n')
YEARS=['2026','2027','2028']; PRIOR='2025'
# read the annual metric blocks from the dataset itself (units, margin keys, Summit arrays)
import subprocess,textwrap
node=r'''
const m=await import('file:///%s'); const y=m.maResults.views.y.metrics;
const out={}; Object.keys(y).forEach(k=>{ const o=y[k]; out[k]={label:o.label,short:o.short,unit:o.unit,group:o.group,marginOf:o.marginOf||null,marginLabel:o.marginLabel||null,periods:o.periods,summit:o.summit,act:o.act}; });
console.log(JSON.stringify({m:out,sections:m.maResults.views.y.sections}));
'''%((W+'js/results-data/ma.js').replace('\\','/'))
open(HERE+'/out/_dump.mjs','w',encoding='utf-8').write(node)
res=subprocess.run(['node',HERE+'/out/_dump.mjs'],capture_output=True,text=True,encoding='utf-8');
if res.returncode: raise SystemExit(res.stderr)
D=json.loads(res.stdout); M=D['m']
vints=mx['vintages']
def has(vid):
    return any(vid in (mx['y'].get(k,{})) and any(mx['y'][k][vid].get(y) is not None for y in YEARS) for k in mx['y'])
V=[v for v in vints if has(v['id'])]
lastid=V[-1]['id']
def lab(d):
    t=datetime.datetime.strptime(d,'%Y-%m-%d'); return t.strftime('%b ')+str(t.day)+t.strftime(', %Y')
def ev(v):
    q=v['lastActual']['q']; s='actuals to '+q
    if v['id']==lastid: s+=' · Summit DCF read'
    return s
def pyidx(k,y): return M[k]['periods'].index(y)
def js(a): return '['+', '.join('null' if v is None else (str(round(v,3)) if isinstance(v,float) else str(v)) for v in a)+']'
def esc(t): return t.replace('\\','\\\\').replace("'","\\'")
lines=[]; keys=[k for k in mx['y'] if k in M and any(mx['y'][k].get(v['id'],{}).get(y) is not None for v in V for y in YEARS)]
def fmtv(k,v):
    u=M[k]['unit']
    if v is None: return 'n/a'
    if u=='eps': return '$%.2f'%v
    if u=='cnt': return '%s'%('{:,.0f}'.format(v))
    return '$%s'%('{:,.1f}B'.format(v/1000)) if abs(v)>=1000 else '$%.0fM'%v
mblocks=[]
for k in keys:
    cons=[[mx['y'][k].get(v['id'],{}).get(y) for v in V] for y in YEARS]
    summ=[[ (M[k]['summit'][pyidx(k,y)] if v['id']==lastid else None) for v in V] for y in YEARS]
    priorc=[mx['y'][k].get(v['id'],{}).get(PRIOR) for v in V]
    priors=[(M[k]['summit'][pyidx(k,PRIOR)] if v['id']==lastid else None) for v in V]
    c26=[x for x in cons[0] if x is not None]; s26=summ[0][-1]
    note=''
    if c26:
        note='Street FY2026 %s \u2192 %s across the %d snapshots that carry it (%+.1f%%)'%(fmtv(k,c26[0]),fmtv(k,c26[-1]),len(c26),(c26[-1]/c26[0]-1)*100 if c26[0] else 0)
        if s26 is not None and c26[-1]: note+='; the Summit model reads %s, %+.1f%% against the Street on %s.'%(fmtv(k,s26),(s26/c26[-1]-1)*100,lab(lastid))
        elif s26 is None: note+='; the Summit model has no FY2026 line for this metric.'
    extra=''
    if M[k]['marginOf']: extra=", marginOf: '%s', marginLabel: '%s'"%(M[k]['marginOf'],esc(M[k]['marginLabel']))
    mblocks.append("      %s: { label: '%s', unit: '%s'%s,\n        summit: [%s],\n        cons:   [%s],\n        prior: { summit: %s, cons: %s },\n        note: '%s' }"%(
        k,esc(M[k]['label']),M[k]['unit'],extra,', '.join(js(r) for r in summ),', '.join(js(r) for r in cons),js(priors),js(priorc),esc(note)))
# sections: keep the dataset's own groups, restricted to metrics present, remapped to top/prof
def secs():
    top_groups=[('Totals',['rev']),('Net revenue by segment',['pnr','vas']),('Revenue build (gross to net)',['gross','dom','xb','tp','oth','cinc']),('Volumes & transactions',['pvol','ptx'])]
    prof_groups=[('Profit',['opinc','ebitda','eps','ni','pti']),('Operating costs',['opex','ga','am','dna','sbc','lit']),('Below the line',['intexp','netint','intnet','invinc','oie','tax']),('Cash flow & capital',['cfo','fcf','capex','buyback','shares','amort'])]
    def blk(key,label,dm,groups):
        gs=[]
        for gl,ks in groups:
            ks=[x for x in ks if x in keys]
            if ks: gs.append("{ label: '%s', keys: [%s] }"%(gl,', '.join("'%s'"%x for x in ks)))
        return "      { key: '%s', label: '%s', defaultMetric: '%s', groups: [\n        %s\n      ] }"%(key,label,dm if dm in keys else keys[0],',\n        '.join(gs))
    return blk('top','Top Line','rev',top_groups)+',\n'+blk('prof','Margins & Profitability','opinc',prof_groups)
vlines=',\n'.join("      { label: '%s', event: '%s' }"%(lab(v['id']),esc(ev(v))) for v in V)
block='''  // ── GENERATED by scripts/consensus/ma/build_ma_evolution.py — do not hand-edit. Estimates pane: the Street's revision history, one
  // line per fiscal year across every Bloomberg snapshot that carries it, with the Summit DCF model's single saved snapshot beside it.
  evolution: {
    intro: 'How the forecast itself has moved. Each line is one fiscal year across the Bloomberg consensus snapshots on file (%s to %s); the Summit DCF model has one saved snapshot (read %s), so the Summit line is a single point at the right edge.',
    note: 'Bloomberg consensus is the Street mean at each snapshot; a year drops out of the Street line once its print lands. Summit is the DCF model\\u2019s own annual line, frozen from DCF MA - New.xlsm; with one snapshot there is no model revision history yet.',
    vintages: [
%s
    ],
    years: [%s],
    sections: [
%s
    ],
    metrics: {
%s
    }
  },
'''%(lab(V[0]['id']),lab(V[-1]['id']),lab(lastid),vlines,', '.join("'%s'"%y for y in YEARS),secs(),',\n'.join(mblocks))
# splice: remove any previous evolution block, insert before the final `};`
src=re.sub(r"\n  // ── GENERATED by scripts/consensus/ma/build_ma_evolution\.py.*?\n  \},\n(?=\};\s*$)","\n",src,flags=re.S)
end=src.rindex('};')
src=src[:end].rstrip('\n')+'\n'+block+src[end:]
open(W+'js/results-data/ma.js','w',encoding='utf-8',newline='').write(src)
print('evolution: %d vintages, %d metrics'%(len(V),len(keys)))
