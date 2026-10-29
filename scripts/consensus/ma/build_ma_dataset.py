# build_ma_dataset.py — regenerates js/results-data/ma.js (views, notes, Summit annual from DCF MA - New.xlsm) from
# BBG_CONSENSUS.txt (G:\My Drive\Summit\Docs/0/) via ma_build.py. It writes the dataset WITHOUT the estMatrix block:
# afterwards run, from scripts/consensus/:  SUMMIT_DOCS="G:/My Drive/Summit/Docs/0" py emit_matrix.py MA map_ma.json
# && py apply_matrix.py MA && py verify_preprint.py MA cons   (docs/profiles/MA.md has the acceptance numbers).
import io,contextlib
import os
HERE=os.path.dirname(os.path.abspath(__file__))
S=os.path.join(HERE,"out")+os.sep
os.makedirs(S,exist_ok=True)
W=os.path.abspath(os.path.join(HERE,"..","..",".."))+os.sep
with contextlib.redirect_stdout(io.StringIO()):
    exec(open(os.path.join(HERE,'ma_build.py'),encoding='utf-8').read())

# 'card' = Domestic assessments + Cross-border volume fees. The Summit model forecasts the two as ONE line (Card related activity, SEG4_REV; its
# history equals the sum, e.g. 2Q26 3,154 + 3,460 = 6,614) while Bloomberg consensus carries them apart, so the like-for-like Street figure is their sum.
def _sum2(a,b): return None if a is None or b is None else a+b
data['card']=dict(label='Card related activity (domestic assessments + cross-border volume fees)',short='Card related',grp='Revenue build (gross to net)',kind='kpi',flip=1,
    act={n:_sum2(data['dom']['act'][n],data['xb']['act'][n]) for n in Qn},cons={n:_sum2(data['dom']['cons'][n],data['xb']['cons'][n]) for n in Qn},
    ya={y:_sum2(data['dom']['ya'][y],data['xb']['ya'][y]) for y in Y},yc={y:_sum2(data['dom']['yc'][y],data['xb']['yc'][y]) for y in Y})
KEYS=[c[1] for c in C]; KEYS.insert(KEYS.index('xb')+1,'card')
# ---- Yields (% of purchase volume), derived from the ingredients the Street and the model both carry. Not a Bloomberg line and not in any
# snapshot, so each is computed per source: net = net revenue / purchase volume; incentive = client incentives / purchase volume; gross = (net
# revenue + client incentives) / purchase volume, i.e. everything before rebates. Where Bloomberg has no client-incentives cell (1Q26 actual) the
# incentives are gross revenue less payment network net revenue, which is the same number by construction. In percent, three decimals.
YLD=['netyld','grossyld','incyld']
def _inc(cinc,gross,pnr):
    if cinc is not None: return -cinc
    if gross is not None and pnr is not None: return gross-pnr
    return None
def _y3(rev,pv,inc):
    if pv in (None,0): return {'netyld':None,'grossyld':None,'incyld':None}
    return {'netyld':None if rev is None else rev/pv*100,'grossyld':None if (rev is None or inc is None) else (rev+inc)/pv*100,'incyld':None if inc is None else inc/pv*100}
def _r3(v): return None if v is None else round(v,3)
_dq={k:{'act':{},'cons':{}} for k in YLD}; _dy={k:{'ya':{},'yc':{}} for k in YLD}
for n in Qn:
    for side in ('act','cons'):
        r=_y3(data['rev'][side][n],data['pvol'][side][n],_inc(data['cinc'][side][n],data['gross'][side][n],data['pnr'][side][n]))
        for k in YLD: _dq[k][side][n]=_r3(r[k])
for yy in Y:
    for side in ('ya','yc'):
        r=_y3(data['rev'][side][yy],data['pvol'][side][yy],_inc(data['cinc'][side][yy],data['gross'][side][yy],data['pnr'][side][yy]))
        for k in YLD: _dy[k][side][yy]=_r3(r[k])
_YL={'netyld':('Net yield (net revenue as % of purchase volume)','Net yield'),'grossyld':('Gross yield (net revenue plus client incentives, as % of purchase volume)','Gross yield'),'incyld':('Incentive yield (client incentives as % of purchase volume)','Incentive yield')}
for k in YLD:
    data[k]=dict(label=_YL[k][0],short=_YL[k][1],grp='Yield (% of purchase volume)',kind='kpi',flip=1,act=_dq[k]['act'],cons=_dq[k]['cons'],ya=_dy[k]['ya'],yc=_dy[k]['yc'])
    SQV[k]={}
for per in SQ_PERIODS:
    if all(per in SQV[x] for x in ('rev','pvol','cinc')):
        r=_y3(SQV['rev'][per],SQV['pvol'][per],-SQV['cinc'][per])
        for k in YLD: SQV[k][per]=_r3(r[k])
for k in YLD: summit[k]=[None]*len(Y)
for i,yy in enumerate(Y):
    if summit['rev'][i] is not None and summit['pvol'][i] and summit['cinc'][i] is not None:
        r=_y3(summit['rev'][i],summit['pvol'][i],-summit['cinc'][i])
        for k in YLD: summit[k][i]=_r3(r[k])
KEYS+=YLD
_unitOf=unitOf; unitOf=lambda key:'pct' if key in YLD else _unitOf(key)
dp_for=lambda key:2 if key=='eps' else (3 if key in YLD else 0)
# ---- Company guidance, as a dollar band. Mastercard guides GROWTH in words (reported basis: the GAAP row of the outlook table in each earnings
# presentation, which is what Bloomberg's net revenue and total operating expense lines are on). The band is that growth, with each phrase mapped to a
# numeric range (indicative, the same mapping as the Guidance record in Miscellaneous), applied to the same quarter a year earlier. Reported dollars
# move with currency and acquisitions on top of this, which the outlook table lists separately.
_W={'min':(0,1),'ls':(1,3),'ms':(4,6),'hs':(7,9),'hhs':(8,9),'llo':(10,11),'lo':(10,12),'hlo':(12,13),'lt':(13,14),'mt':(14,16),'hmt':(15,16),'ht':(17,19),'hht':(18,19),'h20':(27,29),'hh20':(28,29),'m20':(24,26),'l30':(30,33)}
_GR={'2Q21':('h20','l30'),'3Q21':('hh20','h20'),'4Q21':('m20','mt'),'1Q22':('ht','lt'),'2Q22':('mt','ms'),'3Q22':('hlo','hs'),'4Q22':('llo','llo'),'1Q23':('hhs','ms'),
     '2Q23':('hlo','ms'),'3Q23':('lt','ls'),'4Q23':('lo','hhs'),'1Q24':('llo','min'),'2Q24':('hhs','hhs'),'3Q24':('lo','hht'),'4Q24':('lt','ls'),'1Q25':('lo','hs'),
     '2Q25':('mt','llo'),'3Q25':('hmt','ls'),'4Q25':('ht','hs'),'1Q26':('lt','hlo'),'2Q26':('lo','hs'),'3Q26':('hlo','hs')}
GUIDE={'rev':{},'opex':{}}
for per,(rw,ow) in _GR.items():
    n=[x for x in Qn if ql(x)==per][0]
    for key,w in (('rev',rw),('opex',ow)):
        base=data[key]['act'].get(n-4)
        if base is None: continue
        GUIDE[key][per]=(base*(1+_W[w][0]/100),base*(1+_W[w][1]/100))

NOTES={
 'card':"Domestic assessments plus cross-border volume fees. The Summit model forecasts the two as a single line, Card related activity, so this metric adds the two Bloomberg lines to compare like for like; the reported history of the two sums to the model's line.",
 'rev':"Net revenue (Bloomberg IS_COMP_SALES) — gross revenue less client incentives; Q2 2026 $9,277M is the release. Mastercard guides growth, not a dollar level: the guidance band is its guided reported (GAAP) growth, each phrase mapped to an indicative range, applied to the same quarter a year earlier (see Miscellaneous ▸ Guidance for the words quarter by quarter).",
 'opinc':"Operating income as reported (Bloomberg IS_EBIT_AS_REPORTED, GAAP). It carries litigation provisions and restructuring that the company strips out of its adjusted figure, so it sits below the adjusted operating income Mastercard quotes on the call. The Street series is on the same GAAP basis.",
 'ebitda':"Bloomberg's comparable EBITDA (IS_COMPARABLE_EBITDA), the adjusted measure: operating income before depreciation and amortization with one-offs removed. It is the only profit line here on the adjusted basis.",
 'eps':"Bloomberg's GAAP-comparable diluted EPS (IS_COMP_EPS_GAAP): $4.97 for Q2 2026 against the company-reported adjusted $5.04. The Street series is the same Bloomberg line, so the surprise is like for like; the call quotes the adjusted figure.",
 'ni':"GAAP-comparable net income (Bloomberg IS_COMP_NET_INCOME_GAAP): $4,388M in Q2 2026. The company quotes adjusted net income on the call, which is higher.",
 'pti':"Pre-tax income on Bloomberg's comparable basis (IS_COMP_PTP_EX_STK_BASED_COMP). Read it against its own history, not against operating income minus the other lines: each Street cell comes from a different set of contributors.",
 'opex':"Total operating expenses (IS_TOT_OPER_EXP): general and administrative plus advertising and marketing plus depreciation and litigation. Management guides opex growth: the guidance band is its guided reported (GAAP) growth, which carries the litigation provision, applied to the same quarter a year earlier. A higher print than the Street is a cost overshoot, not a beat.",
 'ga':"General and administrative expense (CB_IS_GENL_AND_ADMIN_EXPN), the largest operating cost line (personnel, professional fees, data processing).",
 'am':"Advertising and marketing expense (CB_IS_S_AND_M_EXPENSE), the smallest operating cost line and the most seasonal.",
 'dna':"Depreciation and amortization (CB_IS_DEPRECIATION_AMORT_EXP). Asset-light: roughly $200M to $300M a quarter, so it is shown in millions.",
 'sbc':"Stock-based compensation (CF_STOCK_BASED_COMPENSATION), a non-cash cost inside operating expenses.",
 'lit':"Provision for litigation (IS_LEGAL_LIT_SETTLE_EXPN_OP). Lumpy and not forecast by most of the Street, so the consensus cell is thin and often far from the print; a miss here is an accrual, not an operating signal.",
 'intexp':"Interest expense on Mastercard's debt (IS_INT_EXPENSE). Management guided higher interest from the June 2026 bond issuance.",
 'netint':"Net interest expense (IS_NET_INTEREST_EXPENSE): interest expense less interest income on the cash balance.",
 'intnet':"Interest expense net of income, as Bloomberg's non-operating line (IS_NON_OPERATING_INC_LOSS_GAAP). It is the closest line to management's 'other income and expense' guide (about $125M for Q3 2026) but not the same definition.",
 'invinc':"Investment income (IS_OTHER_INVEST_INC_LOSS_GAAP), negative in the series: gains and losses on equity investments, which the Street rarely models.",
 'oie':"Other income and expense, net (CB_IS_OTHER_NON_OPER_INC_EXPN). Several consensus cells repeat the same value from one snapshot to the next because few analysts model the line.",
 'tax':"Income tax expense (IS_INC_TAX_EXP). Management guides a 20% to 21% adjusted tax rate for both Q3 and Q4 2026; the rate itself is not a Bloomberg line here.",
 'cfo':"Cash flow from operations (CB_CF_NET_CASH_OPERATING_ACT). Seasonal: the first quarter carries the annual incentive payments and settlement timing, so read each quarter against the same quarter a year earlier.",
 'fcf':"Free cash flow (Bloomberg CF_FREE_CASH_FLOW): operating cash flow less capital expenditure on the headline basis.",
 'capex':"Capital expenditure (HEADLINE_CAPEX), shown as positive spend. The Bloomberg series arrives negative and is flipped. Asset-light: $40M to $300M a quarter, shown in millions.",
 'buyback':"Repurchase of common stock (CF_DECR_CAP_STOCK), shown as positive spend; the series arrives negative and is flipped. The pace is accelerated in 2026 and moves with the price.",
 'shares':"Diluted weighted-average shares (IS_SH_FOR_DILUTED_EPS), in millions. A count, never a dollar amount. Bloomberg carries it with unit USD and scale M; it is a share count.",
 'amort':"Amortization of customer and merchant incentives (CF_OTHR_NONCASH_AMORTIZATN), the non-cash release of upfront incentive payments that sits against client incentives.",
 'gross':"Gross revenue before client incentives (IS_GROSS_REVENUE, segment SEG2112701904): domestic assessments plus cross-border volume fees plus transaction processing plus other revenue. In reported actuals the four lines add to this total (Q2 2026: 3,154 + 3,460 + 4,508 + 326 = 11,448); the Street cells do not, because each comes from different contributors.",
 'dom':"Domestic assessments (IS_GROSS_REVENUE, segment SEG0000202649): fees on gross dollar volume within the card's home market.",
 'xb':"Cross-border volume fees (IS_GROSS_REVENUE, segment SEG0000202683): the premium-rate line on spend that crosses a border or a currency. It is a revenue line in dollars, not the cross-border volume growth management quotes on the call.",
 'tp':"Transaction processing revenue (IS_GROSS_REVENUE, segment SEG0000202647): switching, authorization and clearing fees, driven by the number of processed transactions.",
 'oth':"Other revenue (IS_GROSS_REVENUE, segment SEG0000202596): the remaining gross-revenue line, small and thinly covered, so several early consensus cells are missing.",
 'cinc':"Client incentives (CB_IS_ADJ_FROM_GROSS_TO_NET_SALES), the contra-revenue paid to issuers and merchants, shown negative as Bloomberg carries it. A larger negative number lowers net revenue.",
 'pnr':"Payment Network net revenue (SALES_REV_TURN, segment SEG0001328534): gross revenue less client incentives (Q2 2026: 11,448 − 5,997 = 5,451). Bloomberg carries it from 4Q22 only.",
 'vas':"Value-Added Services and Solutions net revenue (SALES_REV_TURN, segment SEG0001328535). Payment Network plus VAS equal net revenue in the actuals (Q2 2026: 5,451 + 3,826 = 9,277). Bloomberg carries it from 4Q22 only.",
 'pvol':"Purchase volume across the network (NTWK_SPENDNG_VOL_PURCHSE), in USD millions: $2.4 trillion in Q2 2026. It is the spend that assessments are charged on.",
 'ptx':"Processed (switched) transactions (PAYMENT_PROCESSING_TRANS), in millions: a count, never a dollar amount. Bloomberg tags it USD / M; it is switched transaction volume.",
}
SUMNOTE={
 'pnr':"Summit (annual): the model's Payment Network line, which ties to the reported history; from 2027 the model holds it nearly flat (gross revenue less client incentives that grow faster), against Street growth, so read the Summit gap as the model's own assumption.",
 'vas':"Summit (annual): the model's VAS line, which ties to the reported history and grows about 23% a year to 2029.",
 'gross':"Summit (annual): the model's gross revenue; 2022 is left blank because the model carries a different gross-revenue basis that year.",
 'tp':"Summit (annual): the model's transaction processing assessments, ties to the reported history.",
 'oth':"Summit (annual): the model's other network assessments; 2022 is left blank (different basis).",
 'cinc':"Summit (annual): the model's client incentives, which ties to the reported history and keeps growing faster than gross revenue.",
 'opex':"Summit (annual): the model's operating expenses; the definition runs 1% to 2.5% above Bloomberg's history (the model includes the litigation provision), so the gap is partly a definition.",
 'ga':"Summit (annual): the model's G&A, ties to the reported history.",
 'am':"Summit (annual): the model's advertising and marketing, ties to the reported history.",
 'sbc':"Summit (annual): the model's stock-based compensation, ties to the reported history.",
 'lit':"Summit (annual): the model carries about $740M a year of litigation provisions from 2026, an assumption well above the Street's roughly $150M, so the Summit and Street lines differ by design.",
 'tax':"Summit (annual): the model's income tax expense, ties to the reported history.",
 'buyback':"Summit (annual): the model's buyback dollars, ties to the reported history.",
 'ptx':"Summit (annual): the model's switched transactions, ties to the reported history.",
 'pvol':"Summit (annual): the model's purchase volume (stored in $B, shown here in $M), ties to the reported history.",
 'eps':"Summit (annual): the model's EPS line (ADJ_EPS), which ties to Bloomberg's GAAP-comparable actual for 2022 to 2025 (FY2025 $16.52)."
}
SQNOTE={
 'opex':"Summit (quarterly): the model's operating expenses line, which includes the litigation provision; its 1Q26 and 2Q26 values are the estimates the model held going into those prints.",
 'lit':"Summit (quarterly): the model's own provision, well above the Street, which carries little.",
 'invinc':"Summit (quarterly): the model's interest income, shown with the Bloomberg sign (a negative line); the model's interest income equals Bloomberg's investment income with the sign flipped (2Q26 88).",
 'intnet':"Summit (quarterly): the model's non-operating line (interest income less interest expense plus other income) with the Bloomberg sign.",
 'netint':"Summit (quarterly): the model's interest expense less its interest income.",
}
NOTES.update({
 'netyld':"Net revenue as a percentage of purchase volume: what the network and the services keep, after rebates and incentives, per dollar of purchases. Derived per source from net revenue and purchase volume (Bloomberg for the actual and the Street, the DCF model for Summit); not a Bloomberg line.",
 'grossyld':"Net revenue plus client incentives, as a percentage of purchase volume: everything before rebates and incentives come off. Derived per source; where Bloomberg has no client-incentives cell the incentives are gross revenue less payment network net revenue.",
 'incyld':"Client incentives as a percentage of purchase volume, the part of the gross yield given back to customers; it rises when incentives grow faster than volume. Derived per source.",
})
PER_METRIC_LABEL={}
GROUPS_Q=[
 ('top','Top Line','rev',[('Totals',['rev']),('Revenue build (gross to net)',['gross','dom','xb','card','tp','oth','cinc']),('Net revenue by segment',['pnr','vas']),('Volumes & transactions',['pvol','ptx']),('Yield (% of purchase volume)',['netyld','grossyld','incyld'])]),
 ('margins','Margins & Profitability','opinc',[('Profit',['opinc','ebitda','eps','ni','pti']),('Operating costs',['opex','ga','am','dna','sbc','lit']),('Below the line',['intexp','netint','intnet','invinc','oie','tax']),('Cash flow & capital',['cfo','fcf','capex','buyback','shares','amort'])])]
def arrfmt(a): return '['+', '.join('null' if v is None else (str(v)) for v in a)+']'
def metric_lines(key,P,getA,getC,withsum):
    D=data[key]; u=unitOf(key); dp=dp_for(key)
    a=[rnd(v,dp) for v in getA(D)]; c=[rnd(v,dp) for v in getC(D)]
    extra=''
    if key in('opinc','ebitda'): extra=", marginOf: 'rev', marginLabel: '%s'"%('operating margin' if key=='opinc' else 'EBITDA margin')
    sm=[None]*len(P)
    if withsum is True and key in summit: sm=summit[key]
    elif withsum=='q' and key in SQV: sm=[rnd(SQV[key].get(p),dp) for p in P]
    esc=lambda t:t.replace('\\','\\\\').replace("'","\\'")
    cm=''
    L=[]
    L.append("        %s: { label: '%s', short: '%s', group: '%s', unit: '%s'%s,"%(key,esc(D['label']),esc(D['short']),D['grp'],u,extra))
    L.append("          periods: [%s],"%', '.join("'%s'"%p for p in P))
    L.append("          act:    %s,"%arrfmt(a))
    L.append("          summit: %s,"%arrfmt(sm))
    L.append("          cons:   %s,"%arrfmt(c))
    gl=[None]*len(P); gh=[None]*len(P)
    if withsum=='q' and key in GUIDE:
        for i,pp in enumerate(P):
            if pp in GUIDE[key]: gl[i]=rnd(GUIDE[key][pp][0],0); gh[i]=rnd(GUIDE[key][pp][1],0)
    L.append("          guideLo:%s,"%arrfmt(gl))
    L.append("          guideHi:%s,"%arrfmt(gh))
    L.append("          note: '%s' },"%esc(NOTES[key]+((' '+SUMNOTE[key]) if (withsum is True and key in SUMNOTE) else ((' '+SQNOTE[key]) if (withsum=='q' and key in SQNOTE) else ''))))
    return "\n".join(L)
def sections_js(indent='      '):
    o=[indent+"sections: ["]
    for si,(k,l,dm,gs) in enumerate(GROUPS_Q):
        o.append(indent+"  { key: '%s', label: '%s', defaultMetric: '%s', groups: ["%(k,l,dm))
        for gi,(gl,ks) in enumerate(gs):
            o.append(indent+"    { label: '%s', keys: [%s] }%s"%(gl,', '.join("'%s'"%x for x in ks),',' if gi<len(gs)-1 else ''))
        o.append(indent+"  ] }%s"%(',' if si<len(GROUPS_Q)-1 else ''))
    o.append(indent+"],")
    return "\n".join(o)
Pq=[ql(n) for n in Qn]; Py=[str(y) for y in Y]
QN=("Reported actuals and the Bloomberg consensus that stood one quarter out, both from the rolling BBG_CONSENSUS.txt archive (23 snapshots, May 2021 to Oct 28 2026): each reported quarter takes the last snapshot before its print, and the four forward quarters come from the newest snapshot. "
    "Mastercard guides growth rates, not dollar levels, so the guidance band on net revenue and operating expenses is its guided reported growth applied to the quarter a year earlier. Summit is the DCF model's own quarterly estimate on the lines the Street also models: the 1Q26 and 2Q26 values are what the model held going into those prints, 3Q26 and 4Q26 are its forecasts (no 2027 quarter is loaded: the model's quarterly chain breaks from 1Q27), and the model has no quarterly share count, D&A, cash flow, capex or volume lines. Capex and share repurchases are shown as positive spend; client incentives stay negative (contra-revenue). For 2026 the Street quarters tie to the Street year within about 0.2% on revenue, operating income, EBITDA, net income, D&A and operating cash flow (3% on capex), but each cell is still its own contributor set, so do not add or subtract across lines.")
YN=("Fiscal-year actuals (the archive's fy0) and the Street's full-year consensus (fy+1 to fy+3 from the newest snapshot), with the Summit DCF model's own annual line (2022 to 2029) on the lines the model carries: from the Projection History tab revenue, operating income, EBITDA, net income, D&A, interest expense, operating cash flow, capex, free cash flow and diluted shares; from the Segments tab adjusted EPS, Payment Network and VAS net revenue, the gross-to-net revenue build, operating expenses, G&A, advertising and marketing, stock-based comp, litigation, tax, repurchases, purchase volume and switched transactions. "
    "Summit's operating income and EBITDA definitions can differ from Bloomberg's (the model's own lines, not a restatement), and the model's operating expenses run 1% to 2.5% above Bloomberg's history; the model's EPS line ties to Bloomberg's actual.")
out=[]
out.append("""// results-data/ma.js — Mastercard (MA) dataset for the standardized "Results" tab.
// Rebuilt on the playbook format (docs/PROFILE_PLAYBOOK.md §9, EV-RES-DATA, Oct 28 2026; build log docs/profiles/MA.md),
// from the Oct-2026 Bloomberg export (22 headline + 12 KPI slots populated for MA; 23 snapshots, data_as_of 2021-05-04 -> 2026-10-28).
//
// Compares REPORTED actuals against two references, per period:
//   act     — the archive's fq0 walked down the snapshots (the freshest print per quarter), extended back with fq-3; annual = fy0.
//   cons    — Bloomberg consensus (BBG_CONSENSUS.txt). The estMatrix block at the foot is GENERATED by scripts/consensus/emit_matrix.py
//             with map_ma.json and spliced by apply_matrix.py; the flat `cons` arrays carry what the engine reads from the matrix for
//             each print (the last snapshot before it) and, for the four forward quarters, the newest snapshot (10/28/2026).
//   summit  — the Summit DCF model's own ANNUAL line, FROZEN on purpose (playbook rule 10): DCF MA - New.xlsm, read 2026-10-28.
//             Tab Projection History: revenue, operating income, EBITDA, net income, D&A, interest expense, CFO, capex (positive), FCF,
//             diluted shares. Tab Segments: EPS, Payment Network and VAS, the gross-to-net revenue build, operating expenses, G&A,
//             advertising and marketing, SBC, litigation, tax, repurchases, purchase volume and switched transactions (25 lines in all;
//             the model's history ties to the Bloomberg actuals). Quarterly summit (tab Projection History, newest save): 1Q26 and 2Q26 are the estimates the model held going into those prints, 3Q26 and 4Q26 its forecasts, on the lines the Street also models; see ma_build.py SQ.
//   guideLo / guideHi — net revenue and total operating expenses only: the company's guided reported growth (outlook table, GAAP row) as an indicative range, applied to the same quarter a year earlier.
//
// Integrity checked on load: fq+N == fq0+N, fq-3 == fq0-3 and every close_fqN is that quarter's calendar end (23 snapshots, 0 mismatches).
// The metric set is the file's (EARNINGS_CONVENTIONS §6a): every populated slot with valid values is carried. Capex and repurchases arrive
// negative and are stored as positive spend (SAB convention); client incentives stay negative. Shares and processed transactions are counts.
// Monetary values US$ millions; EPS in dollars. null = not available (blank, Error 2042, an Excel date-serial, or a near-zero placeholder).
// Arrays are parallel to `periods`. A period with act:null is an upcoming print. Generated — regenerate, do not hand-edit.

export var maResults = {
  forwardQuarters: 2,   // two quarters past the last print (analyst rule Oct 22 2026), same as SPOT and SoFi
  defaultRange: { q: 8, y: 5 },   // opens on the last 8 reported quarters (5 years) plus everything forward; the presets and the slider reach 2Q20
  updated: 'Oct 2026',
  intro: 'How Mastercard’s reported results have stacked up against what the Street expected, and what our Summit model projected on the annual view. Pick a period view and a metric — each print shows the actual against the Street number that stood going in, with the surprise in percent.',
  source: 'Actuals and Street consensus: Bloomberg via BBG_CONSENSUS.txt (23 snapshots, latest data_as_of 2026-10-28, reported through 2026 Q2). Summit: DCF model, DCF MA - New.xlsm Projection History read 2026-10-28; frozen, not live; annual and, on the lines the Street also models, quarterly. EPS is the Bloomberg GAAP-comparable line.',
  views: {
    q: {
      label: 'Quarterly',
      note: '%s',
      metrics: {"""%(QN.replace("'","\\'")))
for k in KEYS:
    out.append(metric_lines(k,Pq,lambda D:[D['act'][n] for n in Qn],lambda D:[D['cons'][n] for n in Qn],'q'))
out.append("      },")
out.append(sections_js())
out.append("    },")
out.append("""    y: {
      label: 'Annual',
      note: '%s',
      metrics: {"""%YN.replace("'","\\'"))
for k in KEYS:
    out.append(metric_lines(k,Py,lambda D:[D['ya'][y] for y in Y],lambda D:[D['yc'][y] for y in Y],True))
out.append("      },")
out.append(sections_js())
out.append("    }")
out.append("  },")
out.append("};")
txt="\n".join(out)+"\n"
open(S+'ma_full.js','w',encoding='utf-8',newline='').write(txt)
open(W+'js/results-data/ma.js','w',encoding='utf-8',newline='').write(txt)
print('written',len(txt))
