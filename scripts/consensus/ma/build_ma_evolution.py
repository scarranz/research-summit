# build_ma_evolution.py — splices the `evolution` block (Evolution ▸ Estimates) into js/results-data/ma.js, AFTER apply_matrix.py has written estMatrix.
#   vintages — every Bloomberg snapshot that carries a forecast for FY2026-FY2028 (BBG_CONSENSUS.txt, via scripts/consensus/out/estmatrix_ma.json)
#   cons     — the Street's FY estimate in each snapshot
#   summit   — the Summit DCF model has TWO saves (DCF MA - New.xlsm, Projection History blocks ID 1 and ID 3; ID 2 is an exact duplicate of ID 3), both
#              dated 2026-10-28 an hour apart: the first was submitted as if the model had been saved from the start, the second is the re-forecast that
#              followed. Both sit at the right edge: the first on the last Bloomberg snapshot's column, the second on an extra column that carries no
#              Street value. The twelve lines of the Projection History top block exist per save; every other Summit line (tab Segments) exists
#              only in the newest state, so it is a single point on the last column.
import json,os,re,datetime,math,warnings
import openpyxl
warnings.filterwarnings('ignore')
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
wb=openpyxl.load_workbook(r"G:\My Drive\Summit\Docs\Research\DCF\Payments - All\MA\DCF MA - New.xlsm",data_only=True,read_only=True)
PH=list(wb['Projection History'].iter_rows(values_only=True)); hh=PH[0]
ycol={hh[c]:c for c in range(8,36) if isinstance(hh[c],int)}
TOP={'rev':'REV','opinc':'OP_INCOME','ebitda':'EBITDA','ni':'EARNINGS','shares':'SHARES','dna':'DNA','cfo':'CFO','capex':'CAPEX','fcf':'FCF','intexp':'INT_EXP'}
SAVE_OFF={'first':135,'second':0}      # row offset of each save's block (ID 1 = rows 137+, ID 3 = rows 2+)
rowof={PH[i][1]:i for i in range(1,13)}
def topval(key,save,y):
    v=PH[rowof[TOP[key]]+SAVE_OFF[save]][ycol[int(y)]]
    if not isinstance(v,(int,float)) or v==0: return None
    return int(math.floor(abs(v)+0.5))
vints=mx['vintages']
def has(vid):
    return any(vid in (mx['y'].get(k,{})) and any(mx['y'][k][vid].get(y) is not None for y in YEARS) for k in mx['y'])
V=[v for v in vints if has(v['id'])]
lastid=V[-1]['id']
EXTRA='%s-later'%lastid       # the second Summit save, same day, no Street value
def lab(d):
    t=datetime.datetime.strptime(d,'%Y-%m-%d'); return t.strftime('%b ')+str(t.day)+t.strftime(', %Y')
def ev(v):
    q=v['lastActual']['q']; s='actuals to '+q
    if v['id']==lastid: s+=' · Summit first save (4:47 pm)'
    if v['id']==EXTRA: s='Summit re-forecast (5:38 pm)'
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
    cons=[[mx['y'][k].get(v['id'],{}).get(y) for v in V]+[None] for y in YEARS]
    def sv(y,vid):
        if k in TOP:
            if vid==lastid: return topval(k,'first',y)
            if vid==EXTRA: return topval(k,'second',y)
            return None
        return M[k]['summit'][pyidx(k,y)] if vid==EXTRA else None
    summ=[[sv(y,v['id']) for v in V+[{'id':EXTRA}]] for y in YEARS]
    priorc=[mx['y'][k].get(v['id'],{}).get(PRIOR) for v in V]+[None]
    priors=[(M[k]['summit'][pyidx(k,PRIOR)] if (k in TOP and v['id'] in (lastid,EXTRA)) or v['id']==EXTRA else None) for v in V+[{'id':EXTRA}]]
    c26=[x for x in cons[0] if x is not None]; s26=summ[0][-1]; s26f=summ[0][-2] if k in TOP else None
    note=''
    if c26:
        note='Street FY2026 %s \u2192 %s across the %d snapshots that carry it (%+.1f%%)'%(fmtv(k,c26[0]),fmtv(k,c26[-1]),len(c26),(c26[-1]/c26[0]-1)*100 if c26[0] else 0)
        if s26 is not None and c26[-1]:
            note+='; the Summit model reads %s after its re-forecast, %+.1f%% against the Street'%(fmtv(k,s26),(s26/c26[-1]-1)*100)
            if s26f: note+=' (%s in its first save, %+.1f%% between the two saves).'%(fmtv(k,s26f),(s26/s26f-1)*100)
            else: note+=' (this line exists only in the newest state of the model).'
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
vlines=',\n'.join("      { label: '%s', event: '%s' }"%(lab(v['id'][:10])+(' (re-forecast)' if v['id']==EXTRA else ''),esc(ev(v))) for v in V+[{'id':EXTRA,'lastActual':{'q':'2Q26'}}])
block='''  // ── GENERATED by scripts/consensus/ma/build_ma_evolution.py — do not hand-edit. Estimates pane: the Street's revision history, one
  // line per fiscal year across every Bloomberg snapshot that carries it, with the Summit DCF model's single saved snapshot beside it.
  evolution: {
    intro: 'How the forecast itself has moved. Each line is one fiscal year across the Bloomberg consensus snapshots on file (%s to %s); the Summit DCF model has two saves, both on %s an hour apart (the first submitted as if the model had been saved from the start), shown as the last two columns.',
    note: 'Bloomberg consensus is the Street mean at each snapshot; a year drops out of the Street line once its print lands. Summit is the DCF model\\u2019s own annual line, frozen from DCF MA - New.xlsm; the model\u2019s two saves are the same day, so the Summit revision history is one step.',
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
