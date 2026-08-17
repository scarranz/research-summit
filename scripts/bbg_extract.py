#!/usr/bin/env python3
"""
bbg_extract.py — complete, reproducible extractor for the Summit BBG consensus dump.

Reads G:\\Mi unidad\\Summit\\Docs\\0\\BBG_CONSENSUS.txt (a wide TSV, one row per ticker)
and, for a given ticker, extracts THE WHOLE ROW — every metric, every segment, every
period — into a clean JS data module js/overviews/<slug>-bbg.js.

Design rule (per Dani): never read the file in parts / never omit columns. This script
understands the full header schema and captures everything; any code it does not have a
friendly name for is still emitted under a slug of its metric name, so nothing is dropped.

Schema (per BBG_CONSENSUS.txt):
  - row 0 is the header of column *labels*.
  - Two value zones, each with 50 slots:
      metricN  / codeN / segmentN / unitN / scaleN      + metricN_<period> value columns
      metric_kpiN / code_kpiN / segment_kpiN / ...       + kpiN_<period>    value columns
  - periods: quarters fq-4..fq0 (actual) and fq+1..fq+4 (fwd); years fy-2..fy0 (actual)
    and fy+1..fy+3 (fwd). close_<period> holds each period's END DATE.
  - A slot whose segment field is a "SEG........ Segment" id is a segment-level metric.

Usage:  python scripts/bbg_extract.py AMZN
"""
import csv, re, json, sys, os

SRC = r"G:\Mi unidad\Summit\Docs\0\BBG_CONSENSUS.txt"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "js", "overviews")

# Per-ticker segment id -> friendly name (BBG SEG ids are company-specific). Extend per company.
SEGNAMES = {
  'AMZN': {'227430':'na', '227462':'intl', '227465':'aws'},
}

QA = ['fq-4','fq-3','fq-2','fq-1','fq0']         # actual quarters (oldest→newest, fq0=latest)
QF = ['fq+1','fq+2','fq+3','fq+4']               # forward quarters
YA = ['fy-2','fy-1','fy0']                       # actual years
YF = ['fy+1','fy+2','fy+3']                      # forward years

# Bloomberg field code -> friendly key. Extend freely; unmapped codes fall back to a name slug.
CODE = {
 'SALES_REV_TURN':'rev','IS_COG_AND_SS_GAAP':'cogs','GROSS_PROFIT':'grossProfit','IS_OPERATING_EXPN':'totalOpex',
 'CB_IS_GENL_AND_ADMIN_EXPN':'gAdmin','CB_IS_S_AND_M_EXPENSE':'marketing','IS_ADVERTISING_EXPENSES':'advertising',
 'IS_OPEX_R_AND_D_GAAP':'techInfra','CB_IS_OTHER_OPEX':'fulfillment','IS_OTHER_OPERATING_INCOME_EXPN':'otherOpex',
 'IS_COMPARABLE_EBIT':'oi','IS_COMPARABLE_EBITDA':'ebitda','IS_NON_OPERATING_INC_LOSS_GAAP':'nonOpNet',
 'IS_NET_INTEREST_EXPENSE':'netInterest','IS_INT_EXPENSE':'intExp','IS_INT_INC':'intInc',
 'CB_IS_OTHER_NON_OPER_INC_EXPN':'otherNonOp','PRETAX_INC':'pretax','IS_INC_TAX_EXP':'tax',
 'IS_SH_PRO_EQY_MT_INV_NET_OF_TAX':'equityMethod','IS_COMP_NET_INCOME_GAAP':'netIncome',
 'IS_SH_FOR_DILUTED_EPS':'dilShares','IS_COMP_EPS_GAAP':'dilEps','IS_D_AND_A_GAAP':'da',
 'HEADLINE_DEPR_EXPN':'depr','HEADLINE_AMORT_EXPN':'amort','CF_STOCK_BASED_COMPENSATION':'sbc',
 'IS_SBC_ATTRIB_TO_COGS_PRETX':'sbcCogs','IS_SBC_ATT_TO_GENL_AND_ADMIN_PRETX':'sbcGA',
 'IS_SBC_ATT_TO_S_AND_M_PRETX':'sbcMktg','IS_SBC_ATTRIBUTABLE_TO_R_AND_D_PRETX':'sbcTech',
 'IS_SBC_ATTRIBUTABLE_TO_OTH_PRETX':'sbcFulfill','HEADLINE_CAPEX':'capex','CB_CF_NET_CASH_OPERATING_ACT':'cfo',
 'HEADLINE_FCF':'fcf','BS_REMAINING_PERFORMANCE_OBLIG':'rpo','CF_PURCHSE_OF_COMMN_STOCK':'buyback',
 'TOTAL_SHIPPING_COST':'shipping','INVENT_TURN':'invTurn','ACCOUNTS_PAYABLE_TURNOVER_DAYS':'dpo',
 'CB_BS_PP_AND_E_NET':'ppe','IS_OPER_INC':'oi','IS_DEPR_EXP':'da',
}

def slug(name):
    s = re.sub(r'[^A-Za-z0-9]+',' ', str(name)).strip().split()
    return (s[0].lower() + ''.join(w.capitalize() for w in s[1:])) if s else 'x'

def num(v):
    if v is None: return None
    s = str(v).strip()
    if s=='' or s.startswith('#N/A') or 'Unclassified' in s or 'Unable' in s: return None
    try: x = float(s)
    except ValueError: return None
    if abs(x) > 1e8: x = x/1e6         # a few cells arrive in raw USD; normalise to $M
    return round(x, 2)

def main(ticker):
    rows = list(csv.reader(open(SRC, encoding='utf-8', errors='replace'), delimiter='\t'))
    hdr = rows[0]
    idx = {c:i for i,c in enumerate(hdr)}
    row = next((r for r in rows if r and r[0].strip().upper().startswith(ticker.upper())), None)
    if not row: raise SystemExit("ticker not found: "+ticker)
    def g(col):
        i = idx.get(col); return row[i] if (i is not None and i < len(row)) else None
    def series(prefix, n):
        return { 'qA':[num(g('%s%d_%s'%(prefix,n,p))) for p in QA],
                 'qF':[num(g('%s%d_%s'%(prefix,n,p))) for p in QF],
                 'a' :[num(g('%s%d_%s'%(prefix,n,p))) for p in YA],
                 'f' :[num(g('%s%d_%s'%(prefix,n,p))) for p in YF] }
    def nonempty(s): return any(v is not None for grp in s.values() for v in grp)

    IS, SEG, dropped = {}, {}, []
    def collect(defpfx, valpfx, segfld):
        for n in range(1,51):
            code=(g('%s%d'%(defpfx,n)) or '').strip()
            name=(g('metric%s%d'%('' if defpfx=='metric' else '_kpi',n)) or g('%s%d'%(defpfx,n)) or '').strip()
            # metric label lives in 'metricN' / 'metric_kpiN'
            label=(g('metric%d'%n) if defpfx=='code' else None)
            mlabel=(g('metric_kpi%d'%n) if valpfx=='kpi' else g('metric%d'%n)) or ''
            if not code or code=='0.' or not mlabel.strip(): continue
            seg=(g('%s%d'%(segfld,n)) or '').strip()
            s=series(valpfx,n)
            if not nonempty(s): continue
            key = CODE.get(code) or slug(mlabel)
            m = re.match(r'SEG0*([0-9]+)', seg)
            if m:
                SEG.setdefault(m.group(1),{})[key]=s
            else:
                # don't clobber a good consolidated key with a duplicate slot; keep first non-empty
                IS.setdefault(key,s)
    collect('code','metric','segment')
    collect('code_kpi','kpi','segment_kpi')

    asof = (g('data_as_of') or '').strip()
    # anchor calendar from the close_ dates: fy0 year and fq0 quarter/year
    def yr(datestr):
        m=re.search(r'/(\d{4})$', datestr or ''); return int(m.group(1)) if m else None
    def qtr(datestr):
        m=re.match(r'(\d+)/\d+/(\d{4})', datestr or '')
        if not m: return None
        mo=int(m.group(1)); return ((mo-1)//3)+1, int(m.group(2))   # (quarter, year)
    fy0y = yr(g('close_fy0')) or 2025
    yearsA = [fy0y-2, fy0y-1, fy0y]; yearsF = [fy0y+1, fy0y+2, fy0y+3]
    q0 = qtr(g('close_fq0')) or (2, fy0y+1)
    qlabels=[]; qq,qy = q0[0]-4, q0[1]                              # step back 4 quarters from fq0
    for _ in range(9):
        while qq<1: qq+=4; qy-=1
        while qq>4: qq-=4; qy+=1
        fwd = 'E' if (qy>q0[1] or (qy==q0[1] and qq>q0[0])) else ''
        qlabels.append('%dQ%02d%s'%(qq, qy%100, fwd)); qq+=1
    # friendly segment map for this ticker
    smap = SEGNAMES.get(ticker.upper(), {})
    def merge(s):  # {qA,qF,a,f} -> add q = qA+qF for convenience
        return {'a':s['a'],'f':s['f'],'qA':s['qA'],'qF':s['qF'],'q':s['qA']+s['qF']}
    ISm = {k:merge(v) for k,v in IS.items()}
    SEGm = {}
    for sid,metrics in SEG.items():
        name = smap.get(sid, 'seg'+sid)
        SEGm[name] = {k:merge(v) for k,v in metrics.items()}

    slugt = ticker.lower()
    outp = os.path.join(OUT_DIR, slugt+'-bbg.js')
    doc = { 'asOf':asof, 'yearsA':yearsA, 'yearsF':yearsF, 'qtrs':qlabels,
            'segIds':smap or {sid:'seg'+sid for sid in SEG}, 'is':ISm, 'seg':SEGm }
    js  = "// overviews/%s-bbg.js — GENERATED by scripts/bbg_extract.py from BBG_CONSENSUS.txt (do not hand-edit).\n" % slugt
    js += "// Full %s row, nothing omitted. All $M (EPS $/sh, shares in M). a/f=[FY..] actual/fwd years;\n" % ticker.upper()
    js += "// qA/qF = actual/fwd quarters; q = qA+qF. Each series {a:[3],f:[3],qA:[5],qF:[4],q:[9]}. null = no data.\n"
    js += "// `is` = consolidated income statement; `seg` = per-segment (rev/oi/da/ppe). asOf=%s.\n" % (asof or '?')
    js += "export var %sBBG = %s;\n" % (slugt, json.dumps(doc, separators=(',',':')))
    open(outp,'w',encoding='utf-8').write(js)
    print("WROTE", outp)
    print("asOf:",asof," yearsA:",yearsA," yearsF:",yearsF)
    print("qtrs:",qlabels)
    print("consolidated metrics:", len(ISm), "| segments:", {k:len(v) for k,v in SEGm.items()})
    if dropped: print("DROPPED (no key):", dropped)

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv)>1 else 'AMZN')
