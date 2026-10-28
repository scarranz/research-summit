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

NOTES={
 'rev':"Net revenue (Bloomberg IS_COMP_SALES) — gross revenue less client incentives; Q2 2026 $9,277M is the release. Mastercard guides growth (currency-neutral, ex-acquisitions), not a dollar level, so no guidance band is drawn; the growth guide is in the Earnings Setup notes.",
 'opinc':"Operating income as reported (Bloomberg IS_EBIT_AS_REPORTED, GAAP). It carries litigation provisions and restructuring that the company strips out of its adjusted figure, so it sits below the adjusted operating income Mastercard quotes on the call. The Street series is on the same GAAP basis.",
 'ebitda':"Bloomberg's comparable EBITDA (IS_COMPARABLE_EBITDA), the adjusted measure: operating income before depreciation and amortization with one-offs removed. It is the only profit line here on the adjusted basis.",
 'eps':"Bloomberg's GAAP-comparable diluted EPS (IS_COMP_EPS_GAAP): $4.97 for Q2 2026 against the company-reported adjusted $5.04. The Street series is the same Bloomberg line, so the surprise is like for like; the call quotes the adjusted figure.",
 'ni':"GAAP-comparable net income (Bloomberg IS_COMP_NET_INCOME_GAAP): $4,388M in Q2 2026. The company quotes adjusted net income on the call, which is higher.",
 'pti':"Pre-tax income on Bloomberg's comparable basis (IS_COMP_PTP_EX_STK_BASED_COMP). Read it against its own history, not against operating income minus the other lines: each Street cell comes from a different set of contributors.",
 'opex':"Total operating expenses (IS_TOT_OPER_EXP): general and administrative plus advertising and marketing plus depreciation and litigation. Management guides opex growth ex-acquisitions, so reported dollars move with FX and deals. A higher print than the Street is a cost overshoot, not a beat.",
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
PER_METRIC_LABEL={}
GROUPS_Q=[
 ('top','Top Line','rev',[('Totals',['rev']),('Revenue build (gross to net)',['gross','dom','xb','tp','oth','cinc']),('Net revenue by segment',['pnr','vas']),('Volumes & transactions',['pvol','ptx'])]),
 ('margins','Margins & Profitability','opinc',[('Profit',['opinc','ebitda','eps','ni','pti']),('Operating costs',['opex','ga','am','dna','sbc','lit']),('Below the line',['intexp','netint','intnet','invinc','oie','tax']),('Cash flow & capital',['cfo','fcf','capex','buyback','shares','amort'])])]
def arrfmt(a): return '['+', '.join('null' if v is None else (str(v)) for v in a)+']'
def metric_lines(key,P,getA,getC,withsum):
    D=data[key]; u=unitOf(key); dp=dp_for(key)
    a=[rnd(v,dp) for v in getA(D)]; c=[rnd(v,dp) for v in getC(D)]
    extra=''
    if key in('opinc','ebitda'): extra=", marginOf: 'rev', marginLabel: '%s'"%('operating margin' if key=='opinc' else 'EBITDA margin')
    sm=[None]*len(P)
    if withsum and key in summit: sm=summit[key]
    esc=lambda t:t.replace('\\','\\\\').replace("'","\\'")
    cm=''
    L=[]
    L.append("        %s: { label: '%s', short: '%s', group: '%s', unit: '%s'%s,"%(key,esc(D['label']),esc(D['short']),D['grp'],u,extra))
    L.append("          periods: [%s],"%', '.join("'%s'"%p for p in P))
    L.append("          act:    %s,"%arrfmt(a))
    L.append("          summit: %s,"%arrfmt(sm))
    L.append("          cons:   %s,"%arrfmt(c))
    L.append("          guideLo:%s,"%arrfmt([None]*len(P)))
    L.append("          guideHi:%s,"%arrfmt([None]*len(P)))
    L.append("          note: '%s' },"%esc(NOTES[key]+((' '+SUMNOTE[key]) if (withsum and key in SUMNOTE) else '')))
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
    "Mastercard guides growth rates (currency-neutral, ex-acquisitions), not dollar levels, so no guidance band is drawn. The Summit model is annual-only, so its column is blank here. Capex and share repurchases are shown as positive spend; client incentives stay negative (contra-revenue). For 2026 the Street quarters tie to the Street year within about 0.2% on revenue, operating income, EBITDA, net income, D&A and operating cash flow (3% on capex), but each cell is still its own contributor set, so do not add or subtract across lines.")
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
//             the model's history ties to the Bloomberg actuals). The model has no quarterly projections, so quarterly summit stays null.
//   guideLo / guideHi — null: Mastercard guides growth rates, not dollar levels.
//
// Integrity checked on load: fq+N == fq0+N, fq-3 == fq0-3 and every close_fqN is that quarter's calendar end (23 snapshots, 0 mismatches).
// The metric set is the file's (EARNINGS_CONVENTIONS §6a): every populated slot with valid values is carried. Capex and repurchases arrive
// negative and are stored as positive spend (SAB convention); client incentives stay negative. Shares and processed transactions are counts.
// Monetary values US$ millions; EPS in dollars. null = not available (blank, Error 2042, an Excel date-serial, or a near-zero placeholder).
// Arrays are parallel to `periods`. A period with act:null is an upcoming print. Generated — regenerate, do not hand-edit.

export var maResults = {
  updated: 'Oct 2026',
  intro: 'How Mastercard’s reported results have stacked up against what the Street expected, and what our Summit model projected on the annual view. Pick a period view and a metric — each print shows the actual against the Street number that stood going in, with the surprise in percent.',
  source: 'Actuals and Street consensus: Bloomberg via BBG_CONSENSUS.txt (23 snapshots, latest data_as_of 2026-10-28, reported through 2026 Q2). Summit: DCF model, DCF MA - New.xlsm Projection History read 2026-10-28; frozen, not live; annual only. EPS is the Bloomberg GAAP-comparable line.',
  views: {
    q: {
      label: 'Quarterly',
      note: '%s',
      metrics: {"""%(QN.replace("'","\\'")))
for k in [c[1] for c in C]:
    out.append(metric_lines(k,Pq,lambda D:[D['act'][n] for n in Qn],lambda D:[D['cons'][n] for n in Qn],False))
out.append("      },")
out.append(sections_js())
out.append("    },")
out.append("""    y: {
      label: 'Annual',
      note: '%s',
      metrics: {"""%YN.replace("'","\\'"))
for k in [c[1] for c in C]:
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
