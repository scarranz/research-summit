"""Market history study (1995-2005): workbook + public macro series -> js/market-history-data.js.

Source workbook (Bloomberg BQL, pasted values): dot com analysis.xlsx
  SPX BBG     one row per security x year-end snapshot (11 snapshots x 500 names): market cap, opening weight,
              window prices and return (price return, splits adjusted), BICS sector / group / industry
  MEMBERSHIP  FIGI -> delisting type and date, + today's S&P 500 members (cols O:Q)
Macro: scripts/market-history/macro/ (run fetch_macro.py first).  Method and caveats: docs/MARKET_HISTORY.md.

Usage:  python scripts/market-history/extract_history.py "<dot com analysis.xlsx>"          (dry run: prints the checks)
        python scripts/market-history/extract_history.py "<dot com analysis.xlsx>" --write  (js/market-history-data.js)
"""
import sys, os, re, json, datetime as dt
from statistics import median
import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
MACRO = os.path.join(HERE, 'macro')
OUT = os.path.join(ROOT, 'js', 'market-history-data.js')
FIRST_ROW = 66           # first data row of SPX BBG (the header is row 65)

STATES = ['SPX', 'LIVE', 'ACQ', 'BK', 'OTH']
STATE_LABEL = {'SPX': 'In the S&P 500 today', 'LIVE': 'Still listed, not in the S&P 500', 'ACQ': 'Acquired / merged',
               'BK': 'Bankruptcy / liquidation', 'OTH': 'Delisted, other'}
# Bloomberg delisting type -> state. Bankruptcy = a delisted name whose ticker is letters + 'Q' (Bloomberg's
# Chapter 11 suffix), the liquidation type LIQU, and the few bankruptcies whose ticker does not carry the Q.
BK_NO_Q = {'LDWIF US Equity', 'SGID US Equity', 'HRZIQ US Equity', 'HDLM US Equity', 'ACKH US Equity'}
SECTORS = ['Technology', 'Communications', 'Health Care', 'Financials', 'Consumer Discretionary', 'Consumer Staples',
           'Industrials', 'Energy', 'Materials', 'Utilities', 'Real Estate']


def f(x):
    try:
        v = float(x)
        return v if v == v else None
    except (TypeError, ValueError):
        return None


def iso(d):
    return d.strftime('%Y-%m-%d') if isinstance(d, (dt.datetime, dt.date)) else None


# ───────────────────────── workbook ─────────────────────────
def read_workbook(path):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb['SPX BBG']
    rows = list(ws.iter_rows(min_row=1, max_col=60, values_only=True))
    pub = {}                                         # published S&P 500 price return by year (AP/AQ rows 52:62)
    for r in rows[51:62]:
        if isinstance(r[42], (int, float)) and f(r[41]) is not None:
            pub[int(r[42])] = f(r[41])
    snaps = []
    for r in rows[FIRST_ROW - 1:]:
        if r[10] is None or not isinstance(r[7], dt.datetime):
            continue
        snaps.append(dict(base=r[7], hoc=r[9], figi=str(r[10]), tkr=str(r[11] or ''), name=str(r[12] or ''), mcap=f(r[13]),
                          w=f(r[14]), p0=f(r[17]), p1=f(r[18]), ret=f(r[19]), sector=r[22], ig=r[23], industry=r[24]))
    mem = {}
    cur = set()
    mrows = list(wb['MEMBERSHIP'].iter_rows(min_row=1, max_col=30, values_only=True))
    for r in mrows[5:]:
        if r[18]:
            mem[str(r[18])] = dict(tkr=str(r[19] or ''), name=str(r[20] or ''), sector=r[21], ig=r[22], industry=r[23],
                                   dtype=str(r[24] or ''), ddate=iso(r[25]) if isinstance(r[25], dt.datetime) else None)
        if r[15]:
            cur.add(str(r[15]))
    return pub, snaps, mem, cur


def state_of(figi, m, cur):
    if figi in cur:
        return 'SPX'
    t = m['dtype']
    if t == 'ACTV':
        return 'LIVE'
    if t == 'ACQU':
        return 'ACQ'
    if re.match(r'^[A-Z]{2,}Q US Equity$', m['tkr']) or m['tkr'] in BK_NO_Q or t == 'LIQU':
        return 'BK'
    return 'OTH'


def short_ticker(t):
    t = t.replace(' US Equity', '').strip()
    return '' if (not t or t[0].isdigit()) else t        # dummy codes (0111145D...) are never shown


def pct(v, d=2):
    return None if v is None else round(v * 100, d)


# ───────────────────────── analysis ─────────────────────────
def chain(o, ks):
    v = 1.0
    n = 0
    for k in ks:
        if o['r'][k] is not None:
            v *= 1 + o['r'][k]
            n += 1
    return (v - 1, n) if n else (None, 0)


def quintile_cut(vals):                                  # equal-count quintiles by rank
    srt = sorted(range(len(vals)), key=lambda i: vals[i])
    q = [0] * len(vals)
    for pos, i in enumerate(srt):
        q[i] = 1 + min(4, pos * 5 // len(vals))
    return q


def analyse(pub, snaps, mem, cur, names):
    bases = sorted({s['base'] for s in snaps})
    K = len(bases)                                          # 11 snapshots; window k runs bases[k] -> its hoc
    years = [b.year + 1 for b in bases]                     # window label: 1995 ... 2005
    by_k = [[s for s in snaps if s['base'] == b] for b in bases]
    for rows in by_k:
        tot = sum(s['w'] for s in rows)
        for s in rows:
            s['wn'] = s['w'] / tot                           # opening weight, renormalised to 1
            s['est'] = s['mcap'] is None                     # no market cap: flat estimated weight
    sec = {}
    order = []
    for k, rows in enumerate(by_k):
        for s in rows:
            if s['figi'] not in sec:
                m = mem.get(s['figi'])
                if m is None:
                    raise SystemExit('FIGI missing from MEMBERSHIP: %s' % s['figi'])
                sec[s['figi']] = dict(f=s['figi'], bn=m['name'], n=names.get(s['figi'], m['name']), t=short_ticker(m['tkr']),
                                      s=s['sector'], g=s['ig'], st=state_of(s['figi'], m, cur),
                                      x=m['ddate'] if m['dtype'] != 'ACTV' and m['ddate'] else None,
                                      w=[None] * K, r=[None] * K, p=[None] * (K + 1), e=[0] * K)
                order.append(s['figi'])
            o = sec[s['figi']]
            o['w'][k] = s['wn']
            o['r'][k] = s['ret']
            o['e'][k] = 1 if s['est'] else 0
            if s['p0'] is not None:
                o['p'][k] = s['p0']
            if s['p1'] is not None and o['p'][k + 1] is None:
                o['p'][k + 1] = s['p1']
    ids = {fg: i for i, fg in enumerate(order)}
    sets = [{s['figi'] for s in rows} for rows in by_k]
    # index: basket vs published
    index = []
    for k, rows in enumerate(by_k):
        bask = sum(s['wn'] * s['ret'] for s in rows) * 100
        p = pub.get(years[k])
        index.append(dict(y=years[k], base=iso(bases[k]), hoc=iso(rows[0]['hoc']), basket=round(bask, 2), pub=p,
                          gap=None if p is None else round(bask - p, 2), nEst=sum(1 for s in rows if s['est']),
                          wEst=round(100 * sum(s['wn'] for s in rows if s['est']), 2)))
    # concentration
    conc = []
    for k, rows in enumerate(by_k):
        ws = sorted((s['wn'] for s in rows), reverse=True)
        cum = 0
        n50 = n80 = None
        for i, w in enumerate(ws):
            cum += w
            if n50 is None and cum >= .5:
                n50 = i + 1
            if n80 is None and cum >= .8:
                n80 = i + 1
        cs = [s['wn'] * s['ret'] for s in rows]
        tot = sum(cs)
        srt = sorted(cs, reverse=(tot >= 0))
        acc = 0
        nr = None
        for i, c in enumerate(srt):
            acc += c
            if nr is None and acc / tot >= .5:
                nr = i + 1
        hhi = sum(w * w for w in ws)

        def sw(group):
            return round(100 * sum(s['wn'] for s in rows if s['sector'] in group), 2)
        conc.append(dict(y=years[k], top1=round(100 * ws[0], 2), top4=round(100 * sum(ws[:4]), 2), top10=round(100 * sum(ws[:10]), 2),
                         top20=round(100 * sum(ws[:20]), 2), top50=round(100 * sum(ws[:50]), 2), hhi=round(hhi * 1e4, 1),
                         effN=round(1 / hhi, 1), n50=n50, n80=n80, nRet50=nr, tech=sw({'Technology'}),
                         techComm=sw({'Technology', 'Communications'})))
    # sectors: opening weight, contribution (pp), names
    sectors = []
    for k, rows in enumerate(by_k):
        d = {}
        for sc in SECTORS:
            rs = [s for s in rows if s['sector'] == sc]
            d[sc] = dict(w=round(100 * sum(s['wn'] for s in rs), 3), c=round(100 * sum(s['wn'] * s['ret'] for s in rs), 3), n=len(rs))
        sectors.append(dict(y=years[k], d=d))
    # fate (terminal state) per snapshot, total and by sector
    fate = []
    for k, rows in enumerate(by_k):
        tot = {st: [0, 0.0] for st in STATES}
        bys = {sc: {st: [0, 0.0] for st in STATES} for sc in SECTORS}
        for s in rows:
            st = sec[s['figi']]['st']
            tot[st][0] += 1
            tot[st][1] += s['wn']
            if s['sector'] in bys:
                bys[s['sector']][st][0] += 1
                bys[s['sector']][st][1] += s['wn']
        fate.append(dict(y=years[k], base=iso(bases[k]), t={st: [v[0], round(100 * v[1], 2)] for st, v in tot.items()},
                         s={sc: {st: [v[0], round(100 * v[1], 2)] for st, v in d.items()} for sc, d in bys.items()}))
    # rotation between consecutive snapshots
    rot = []
    for k in range(K - 1):
        a = {s['figi']: s for s in by_k[k]}
        b = {s['figi']: s for s in by_k[k + 1]}
        stay = [x for x in a if x in b]
        out = [x for x in a if x not in b]
        inn = [x for x in b if x not in a]

        def wsum(ks, src):
            return round(100 * sum(src[x]['wn'] for x in ks), 2)
        out_state = {st: [0, 0.0] for st in STATES}
        for x in out:
            out_state[sec[x]['st']][0] += 1
            out_state[sec[x]['st']][1] += a[x]['wn'] * 100
        bysec = {}
        for sc in SECTORS:
            bysec[sc] = dict(out=round(100 * sum(a[x]['wn'] for x in out if a[x]['sector'] == sc), 2),
                             inn=round(100 * sum(b[x]['wn'] for x in inn if b[x]['sector'] == sc), 2),
                             nOut=sum(1 for x in out if a[x]['sector'] == sc), nIn=sum(1 for x in inn if b[x]['sector'] == sc))
        rot.append(dict(frm=bases[k].year, to=bases[k + 1].year, nStay=len(stay), nOut=len(out), nIn=len(inn),
                        wStayOpen=wsum(stay, a), wOut=wsum(out, a), wIn=wsum(inn, b),
                        outState={st: [v[0], round(v[1], 2)] for st, v in out_state.items()}, bySec=bysec,
                        topOut=[ids[x] for x in sorted(out, key=lambda x: -a[x]['wn'])[:8]],
                        topIn=[ids[x] for x in sorted(inn, key=lambda x: -b[x]['wn'])[:8]]))
    # cohort defined ONLY with information up to the 1999-12-31 snapshot
    K0 = next(k for k, b in enumerate(bases) if b.strftime('%Y-%m-%d') == '1999-12-31')
    coh_ids = [s['figi'] for s in by_k[K0]]
    hist = {x: chain(sec[x], range(0, K0)) for x in coh_ids}      # windows 1995..1999
    ranked = [x for x in coh_ids if hist[x][1] > 0]
    qmap = dict(zip(ranked, quintile_cut([hist[x][0] for x in ranked])))
    for x in coh_ids:
        o = sec[x]
        o['q'] = qmap.get(x, 0)                                   # 0 = joined at the 1999 close (no history)
        o['c'] = pct(hist[x][0])
        o['nc'] = hist[x][1]
        for key, ks in (('r02', range(K0, K0 + 3)), ('r35', range(K0 + 3, K0 + 6)), ('r05', range(K0, K0 + 6))):
            v, n = chain(o, ks)
            o[key] = pct(v)
            o['n' + key[1:]] = n
        px = [p for p in o['p'] if p]
        last = next((p for p in reversed(o['p']) if p), None)
        o['pk'] = round(last / max(px), 3) if px and last else None      # last observed price / highest year-end price
        o['in04'] = 1 if x in sets[K - 1] else 0
    # rolling 3-year persistence: rank on the trailing 3 windows, follow the next 3
    roll = []
    for k in range(3, K - 1):
        ok = [s['figi'] for s in by_k[k] if all(sec[s['figi']]['r'][j] is not None for j in range(k - 3, k))]
        if len(ok) < 100:
            continue
        tr = [chain(sec[x], range(k - 3, k))[0] for x in ok]
        qq = quintile_cut(tr)
        wn = {s['figi']: s['wn'] for s in by_k[k]}
        row = dict(asOf=iso(bases[k]), n=len(ok), q={})
        for qi in range(1, 6):
            mem_ = [x for x, qv in zip(ok, qq) if qv == qi]
            fw = [chain(sec[x], range(k, min(k + 3, K))) for x in mem_]
            trq = [t for t, qv in zip(tr, qq) if qv == qi]
            row['q'][qi] = dict(n=len(mem_), trail=pct(median(trq)), fwd=pct(median([v for v, n in fw if v is not None])) if any(v is not None for v, n in fw) else None,
                                complete=sum(1 for v, n in fw if n == min(3, K - k)), w=round(100 * sum(wn[x] for x in mem_), 2),
                                inIdx=sum(1 for x in mem_ if x in sets[k + 3]) if k + 3 < K else None)
        roll.append(row)
    # leaders: the top 10 by weight at each snapshot and where they stood 5 snapshots later
    leaders = []
    for k in range(K):
        top = sorted(by_k[k], key=lambda s: -s['wn'])[:10]
        row = dict(asOf=iso(bases[k]), ids=[ids[s['figi']] for s in top], w=round(100 * sum(s['wn'] for s in top), 2))
        if k + 5 < K:
            later = {s['figi']: i for i, s in enumerate(sorted(by_k[k + 5], key=lambda s: -s['wn']))}
            row['still10'] = sum(1 for s in top if later.get(s['figi'], 99) < 10)
            row['inIdx'] = sum(1 for s in top if s['figi'] in later)
        leaders.append(row)
    # compact per-security records
    secs = []
    for x in order:
        o = sec[x]
        rec = dict(f=o['f'], n=o['n'], t=o['t'], s=o['s'], g=o['g'], st=o['st'],
                   w=[None if v is None else round(v * 100, 3) for v in o['w']],
                   r=[pct(v, 1) for v in o['r']], p=[None if v is None else round(v, 3) for v in o['p']])
        if o['bn'] != o['n']:
            rec['bn'] = o['bn']
        if o['x']:
            rec['x'] = o['x']
        if sum(o['e']):
            rec['est'] = [i for i, v in enumerate(o['e']) if v]
        if 'q' in o:
            for key in ('q', 'c', 'nc', 'r02', 'r35', 'r05', 'n02', 'n35', 'n05', 'pk', 'in04'):
                rec[key] = o[key]
        secs.append(rec)
    return dict(years=years, bases=[iso(b) for b in bases], index=index, conc=conc, sectors=sectors, fate=fate, rot=rot,
                roll=roll, leaders=leaders, secs=secs)


# ───────────────────────── macro ─────────────────────────
def read_csv(name):
    out = []
    for line in open(os.path.join(MACRO, name + '.csv'), encoding='utf-8').read().splitlines()[1:]:
        d, _, v = line.partition(',')
        v = f(v)
        if v is not None:
            out.append((d, v))
    return out


def monthly(name, how='avg', y0=1994, y1=2006):
    bucket = {}
    for d, v in read_csv(name):
        bucket.setdefault(d[:7], []).append(v)
    out = []
    for y in range(y0, y1 + 1):
        for m in range(1, 13):
            vs = bucket.get('%d-%02d' % (y, m))
            out.append(None if not vs else (vs[-1] if how == 'end' else sum(vs) / len(vs)))
    return out


def quarterly(name, y0=1994, y1=2006):
    d = dict(read_csv(name))
    return [d.get('%d-%02d-01' % (y, q)) for y in range(y0, y1 + 1) for q in (1, 4, 7, 10)]


def yoy(vs, lag=12):
    return [None if i < lag or vs[i] is None or vs[i - lag] is None else (vs[i] / vs[i - lag] - 1) * 100 for i in range(len(vs))]


def rnd(vs, d=2):
    return [None if v is None else round(v, d) for v in vs]


def read_macro():
    months = ['%d-%02d' % (y, m) for y in range(1994, 2007) for m in range(1, 13)]
    quarters = ['%dQ%d' % (y, q) for y in range(1994, 2007) for q in range(1, 5)]
    # Shiller: only the S&P 500 monthly price level is used (no earnings, no multiples); the .xls needs xlrd, cached in shiller.json
    cache = os.path.join(MACRO, 'shiller.json')
    if not os.path.exists(cache):
        import pandas as pd
        d = pd.read_excel(os.path.join(MACRO, 'shiller_ie_data.xls'), sheet_name='Data', header=None, skiprows=8)
        d = d.iloc[:, [0, 1, 3, 12]]
        d.columns = ['date', 'P', 'E', 'CAPE']
        d = d[pd.to_numeric(d.date, errors='coerce').notna()]
        rows = {}
        for _, r in d.iterrows():
            y = int(r.date)
            m = int(round((r.date - y) * 100))
            rows['%d-%02d' % (y, m)] = [None if r[c] != r[c] else float(r[c]) for c in ('P', 'E', 'CAPE')]
        json.dump(rows, open(cache, 'w'))
    sh = json.load(open(cache))
    P = [(sh.get(m) or [None])[0] for m in months]
    E = [(sh.get(m) or [None, None])[1] for m in months]
    CAPE = [(sh.get(m) or [None, None, None])[2] for m in months]
    ey = [None if p is None or e is None else e / p * 100 for p, e in zip(P, E)]
    wb = openpyxl.load_workbook(os.path.join(MACRO, 'finra_margin.xlsx'), data_only=True)
    mg = {str(r[0]): r[1] for r in wb.active.iter_rows(min_row=2, values_only=True) if r[0]}
    margin = [None if mg.get(m) is None else mg[m] / 1e3 for m in months]          # $ millions -> $ billions
    cpi_y = yoy(monthly('CPIAUCSL', y0=1993, y1=2006))[12:]
    core_y = yoy(monthly('CPILFESL', y0=1993, y1=2006))[12:]
    pay_y = yoy(monthly('PAYEMS', y0=1993, y1=2006))[12:]
    fiscal = read_csv('FYFSGDA188S')
    return dict(months=months, quarters=quarters,
                m=dict(sp=rnd(P, 1), nasdaq=rnd(monthly('NASDAQCOM', 'end'), 1),
                       ffr=rnd(monthly('FEDFUNDS')), y10=rnd(monthly('DGS10')), y2=rnd(monthly('DGS2')), curve=rnd(monthly('T10Y2Y')),
                       wti=rnd(monthly('DCOILWTICO')), gas=rnd(monthly('PNGASUSUSDM')), copper=rnd(monthly('PCOPPUSDM'), 0),
                       commAll=rnd(monthly('PALLFNFINDEXM'), 1), commEnergy=rnd(monthly('PNRGINDEXM'), 1), commMetals=rnd(monthly('PMETAINDEXM'), 1),
                       usd=rnd(monthly('TWEXBMTH'), 2), unrate=rnd(monthly('UNRATE'), 1), payYoy=rnd(pay_y), cpiYoy=rnd(cpi_y), coreYoy=rnd(core_y),
                       tcu=rnd(monthly('TCU'), 1), housing=rnd(monthly('HOUST'), 0), semiPpi=rnd(monthly('PCU334413334413'), 1),
                       margin=rnd(margin, 1), baaSpread=rnd(monthly('BAA10Y'), 2), aaaSpread=rnd(monthly('AAA10Y'), 2)),
                q=dict(itInv=rnd(quarterly('A679RC1Q027SBEA'), 1), compInv=rnd(quarterly('B935RC1Q027SBEA'), 1),
                       ipEquip=rnd(quarterly('Y034RC1Q027SBEA'), 1), prod=rnd(quarterly('OPHNFB'), 2),
                       gdpGrowth=rnd(quarterly('A191RL1Q225SBEA'), 1), sloos=rnd(quarterly('DRTSCILM'), 1)),
                a=dict(fiscal={d[:4]: round(v, 2) for d, v in fiscal if 1993 <= int(d[:4]) <= 2006}))


# Dates are public record; the market-level ones are from memory and still to verify (docs/MARKET_HISTORY.md section 10)
EVENTS = [
    ['1996-02-08', 'Telecommunications Act signed', 'policy'],
    ['1997-08-05', 'Taxpayer Relief Act (capital gains 28% to 20%)', 'policy'],
    ['1998-09-29', 'Fed cuts after the LTCM rescue (three cuts, Sep-Nov)', 'fed'],
    ['1999-11-12', 'Gramm-Leach-Bliley signed', 'policy'],
    ['2000-03-10', 'Nasdaq Composite peak (5,048.62)', 'mkt'],
    ['2000-03-24', 'S&P 500 peak (1,527.46)', 'mkt'],
    ['2000-05-16', 'Fed funds reach 6.50%', 'fed'],
    ['2001-09-11', 'September 11 attacks', 'shock'],
    ['2001-12-02', 'Enron files for bankruptcy', 'shock'],
    ['2002-07-21', 'WorldCom files for bankruptcy', 'shock'],
    ['2002-07-30', 'Sarbanes-Oxley signed', 'policy'],
    ['2002-10-09', 'S&P 500 closing low (776.76)', 'mkt'],
    ['2003-06-25', 'Fed funds cut to 1.00%', 'fed'],
    ['2005-03-18', 'S&P 500 starts moving to float-adjusted weights (done Sep 2005)', 'method'],
]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        sys.exit(__doc__)
    names = {k: v for k, v in json.load(open(os.path.join(HERE, 'names.json'), encoding='utf-8')).items() if not k.startswith('_')}
    pub, snaps, mem, cur = read_workbook(args[0])
    data = analyse(pub, snaps, mem, cur, names)
    macro = read_macro()
    print('snapshots', len(data['bases']), 'securities', len(data['secs']), "| in today's S&P 500:", sum(1 for s in data['secs'] if s['st'] == 'SPX'))
    print('\nyear  basket  published  gap(pp)  names w/o mcap  their weight %')
    for r in data['index']:
        print('%d  %7.2f  %8s  %7s  %8d  %12.2f' % (r['y'], r['basket'], r['pub'], r['gap'], r['nEst'], r['wEst']))
    print('\nconcentration')
    for r in data['conc']:
        print(r)
    print('\nfate of the 500 at each snapshot [count, weight %]')
    for r in data['fate']:
        print(r['y'], r['t'])
    print('\ncohort (1999-12-31)')
    k0 = data['bases'].index('1999-12-31')
    for q in range(0, 6):
        g = [s for s in data['secs'] if s.get('q') == q]
        if not g:
            continue

        def md(key):
            v = [s[key] for s in g if s.get(key) is not None]
            return round(median(v), 1) if v else None
        print('Q%d n=%3d w1999=%5.1f%%  c9599 med=%s  r02=%s  r35=%s  r05=%s' % (q, len(g), sum(s['w'][k0] or 0 for s in g), md('c'), md('r02'), md('r35'), md('r05')))
    print('\nrolling 3y')
    for r in data['roll']:
        print(r['asOf'], {q: (v['n'], v['trail'], v['fwd']) for q, v in r['q'].items()})
    print('\nleaders')
    for r in data['leaders']:
        print(r['asOf'], r['w'], r.get('still10'), r.get('inIdx'))
    if '--write' not in sys.argv:
        return
    blob = dict(meta=dict(source='dot com analysis.xlsx (Bloomberg BQL) + FRED, R. Shiller, FINRA', built=dt.date.today().isoformat(),
                          stateLabel=STATE_LABEL, states=STATES, sectors=SECTORS), **data, macro=macro, events=EVENTS)
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write('// Generated by scripts/market-history/extract_history.py -- do not edit by hand. Method: docs/MARKET_HISTORY.md\n')
        fh.write('export const MHIST = ' + json.dumps(blob, separators=(',', ':'), ensure_ascii=False) + ';\n')
    print('\nwrote', OUT, os.path.getsize(OUT) // 1024, 'KB')


if __name__ == '__main__':
    main()
