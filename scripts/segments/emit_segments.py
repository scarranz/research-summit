"""Emit js/segments-data/<ticker>.js — the Segments tab's dataset.

    py emit_segments.py AMZN map_segments_amzn.json dcf_amzn.json

Two inputs: a saved Summit-MCP pull (segment PP&E / capex / EBITDA, both sheets, all periods)
and the Bloomberg archive (segment D&A, RPO, shipping, days payable). Contract and rationale:
docs/SEGMENTS_CONVENTIONS.md.

── WHAT A BRIDGE IS ─────────────────────────────────────────────────────────────────────────
A bridge is a TARGET plus an ordered list of TERMS whose product equals it. That one shape
covers every P x Q an analyst draws:

    Uber   revenue = gross bookings x take rate
    Uber   gross bookings = MAUs x trips per MAU x price per trip
    AWS    revenue = capacity deployed x revenue per $ of capacity
    SaaS   revenue = subscribers x ARPU

so a new company is a config, not a new chart. Each bridge declares its `kind`:

  * `independent`  — the terms come from separate sources, so their product reconciling to the
                     target is a real cross-check and the generator reports the residual.
  * `decomposition`— one term is derived from the target (revenue per $ of capacity IS revenue
                     over capacity), so the product reconciles by construction. Still worth
                     drawing — it splits the line into volume and yield — but it proves nothing,
                     and saying which is which on screen is the difference between a measurement
                     and a rearrangement.

The acceptance test runs both: for `independent` a residual over tolerance is a FAILURE; for
`decomposition` a residual at all means the arithmetic is broken.

── WHAT IT REFUSES TO EMIT ──────────────────────────────────────────────────────────────────
Zeros are dropped (a 0 in these models is a row nobody populated). Anything in the config's
`rejected` list is never read — see that list for why each one is out; the DCF's segment D&A
being an even three-way split is the case worth knowing about, because it looks like data.
"""
import json, os, re, sys, csv
try: sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception: pass

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, '..', '..'))
DOCS = os.environ.get('SUMMIT_DOCS', 'G:/My Drive/Summit/Docs/0')

TK   = (sys.argv[1] if len(sys.argv) > 1 else 'AMZN').upper()
CFG  = json.load(open(os.path.join(HERE, sys.argv[2]), encoding='utf-8'))
DUMP = os.path.join(HERE, sys.argv[3])
# The narrative half - summaries, the 10-K description, products, KPI definitions, adjacencies.
# No generator can write it, and keeping it in its own file means a data refresh never touches it.
_C = json.load(open(os.path.join(HERE, sys.argv[4]), encoding='utf-8')) if len(sys.argv) > 4 else {}
CONTENT = _C.get('segments', {})
OVERVIEW = _C.get('overview', {})
AXIS = CFG['axis']
PPY  = {'q': 4, 'y': 1}                       # periods per year, for annualising a denominator

# ── the DCF side ─────────────────────────────────────────────────────────────────────────────
def canon(pk):
    m = re.match(r'^(\d{4})Q([1-4])$', pk)
    if m: return 'q', m.group(2) + 'Q' + m.group(1)[2:]
    if re.match(r'^\d{4}$', pk): return 'y', pk
    return None, None

def load_dcf(path):
    blob = json.load(open(path, encoding='utf-8'))
    if isinstance(blob, dict) and isinstance(blob.get('result'), str):
        blob = json.loads(blob['result'])
    out = {}                                   # (label, sheet, view, period) -> value
    for r in blob.get('data', []):
        view, per = canon(r.get('period_key', ''))
        if not view: continue
        try: v = float(r['value'])
        except (TypeError, ValueError): continue
        if v == 0: continue                    # never populated, not a forecast of nothing
        out[(r['metric_label'], r['sheet_source'], view, per)] = v
    return out

DCF = load_dcf(DUMP)

# ── the Bloomberg side: REPORTED history, assembled across snapshots ─────────────────────────
# Not the estimate matrix. Each snapshot carries its own reported columns (fq-4..fq0, fy-2..fy0);
# taking the union and letting the newest snapshot win gives a reported series for a driver the
# company itself never publishes — segment D&A, backlog. Those have no company figure to
# contradict, which is exactly why Bloomberg is the only source and the note has to say so.
def load_bbg(ticker):
    path = os.path.join(DOCS, 'BBG_CONSENSUS.txt')
    rows = list(csv.reader(open(path, newline='', encoding='utf-8-sig'), delimiter='\t'))
    head = rows[0]; idx = {n: i for i, n in enumerate(head)}
    HORS = ['fq-4','fq-3','fq-2','fq-1','fq0','fy-2','fy-1','fy0']
    def g(r, c):
        if c not in idx or idx[c] >= len(r): return ''
        return (r[idx[c]] or '').strip()
    def lbl(s):
        m = re.match(r'^(\d{4})\s+Q([1-4])\s*\(Rep\)', s or '')
        if m: return 'q', m.group(2) + 'Q' + m.group(1)[2:]
        m = re.match(r'^(\d{4})\s+A\s*\(Rep\)', s or '')
        if m: return 'y', m.group(1)
        return None, None
    def key(r):
        mm, dd, yy = g(r, 'data_as_of').split('/'); return (int(yy), int(mm), int(dd))
    snaps = sorted([r for r in rows[1:] if r and r[0].strip().upper().startswith(ticker + ' ')], key=key)
    out, scales = {}, {}
    for r in snaps:                            # oldest first, so the newest snapshot overwrites
        for i in range(1, 51):
            for pre, tag in (('', 'metric'), ('_kpi', 'kpi')):
                sc = ('scale%d' % i) if not pre else ('scale_kpi%d' % i)
                scales['%s%d' % (tag, i)] = g(r, sc)
        for h in HORS:
            view, per = lbl(g(r, h))
            if not view: continue
            for slot in scales:
                col = '%s_%s' % (slot, h)
                if col not in idx or idx[col] >= len(r): continue
                raw = (r[idx[col]] or '').strip()
                if not raw or raw.startswith('#N/A'): continue
                try: v = float(raw)
                except ValueError: continue
                out[(slot, view, per)] = (v, scales[slot])
    return out

BBG = load_bbg(TK)
SCALE = {'M': 1.0, 'B': 1000.0, 'K': 0.001, '': 1e-6}

def bbg_series(slot, view, unit):
    ser = {}
    for (s, v, p), (val, sc) in BBG.items():
        if s != slot or v != view or p not in AXIS[view]: continue
        ser[p] = val * SCALE.get(sc, 1e-6) if unit == 'usdM' else val
    return ser

def dcf_series(label, view, sheet, sign=1):
    return { p: DCF[(label, sheet, view, p)] * sign
             for p in AXIS[view] if (label, sheet, view, p) in DCF }

# ── build ────────────────────────────────────────────────────────────────────────────────────
def build_driver(spec, view):
    """-> {'act': {...}, 'summit': {...}} keyed by period, or None when nothing resolves."""
    if 'from' in spec: return None              # a pointer into results-data; nothing to emit
    act, summit = {}, {}
    if 'dcf' in spec:
        sign = spec.get('sign', 1)
        act    = dcf_series(spec['dcf'], view, 'actuals_history', sign)
        summit = dcf_series(spec['dcf'], view, 'projection_history', sign)
        # A period that has already reported is not a forecast: the model freezes or zeroes it.
        for p in list(summit):
            if p in act: summit.pop(p)
    elif 'bbg' in spec:
        act = bbg_series(spec['bbg'], view, spec.get('unit', 'usdM'))
    return {'act': act, 'summit': summit}

def js(t):
    return str(t).replace(chr(92), chr(92) * 2).replace(chr(39), chr(92) + chr(39))

def jsnum(v):
    r = round(v, 4)
    return str(int(r)) if r == int(r) else repr(r)

def obj(d, axis):
    return '{ ' + ', '.join("'%s': %s" % (p, jsnum(d[p])) for p in axis if p in d) + ' }'

segs, report = [], []
for s in CFG['segments']:
    lines = ["    {", "      key: '%s', label: '%s', short: '%s'," % (s['key'], s['label'], s['short'])]
    lines.append("      lede: '%s'," % s['lede'].replace("\\", "\\\\").replace("'", "\\'"))
    lines.append('      sells: [')
    for it in s['sells']:
        lines.append("        { name: '%s', what: '%s' }," % (
            it['name'].replace("'", "\\'"), it['what'].replace("'", "\\'")))
    lines.append('      ],')
    c = CONTENT.get(s['key'], {})
    if c.get('summary'): lines.append("      summary: '%s'," % js(c['summary']))
    if c.get('brief'): lines.append("      brief: '%s'," % js(c['brief']))
    if c.get('tenK'):
        tk = c['tenK']
        lines.append("      tenK: { text: '%s', verbatim: %s, cite: %s, url: %s, where: %s, needs: %s }," % (
            js(tk['text']),
            'true' if tk.get('verbatim') else 'false',
            ("'" + js(tk['cite']) + "'") if tk.get('cite') else 'null',
            ("'" + js(tk['url']) + "'") if tk.get('url') else 'null',
            ("'" + js(tk['where']) + "'") if tk.get('where') else 'null',
            ("'" + js(tk['needs']) + "'") if tk.get('needs') else 'null'))
    if c.get('products'):
        lines.append('      products: [')
        for it in c['products']:
            lines.append("        { name: '%s', what: '%s'," % (js(it['name']), js(it['what'])))
            if it.get('tenK'):
                lines.append("          tenK: { text: '%s', where: '%s', verbatim: true }," % (
                    js(it['tenK']['text']), js(it['tenK']['where'])))
            cu = it.get('customers') or {}
            arch = cu.get('archetype')
            lines.append('          customers: {')
            if arch:
                lines.append("            archetype: { text: '%s', where: '%s' }," % (
                    js(arch['text']), js(arch['where'])))
            lines.append('            named: [' + ', '.join(
                "{ name: '%s', q: '%s', what: '%s' }" % (js(n['name']), js(n['q']), js(n['what']))
                for n in cu.get('named', [])) + '],')
            if cu.get('note'):
                lines.append("            note: '%s'," % js(cu['note']))
            if cu.get('concentration'):
                lines.append("            concentration: '%s'," % js(cu['concentration']))
            lines.append('          },')
            lines.append('          management: [' + ', '.join(
                "{ q: '%s', text: '%s' }" % (js(m['q']), js(m['text']))
                for m in it.get('management', [])) + '],')
            lines.append('        },')
        lines.append('      ],')
    if c.get('kpis'):
        lines.append('      kpis: [')
        for k in c['kpis']:
            lines.append("        { name: '%s', definition: '%s', filing: %s, unit: '%s', periodicity: '%s', source: '%s', series: %s, needs: %s }," % (
                js(k['name']), js(k['definition']),
                ("'" + js(k['filing']) + "'") if k.get('filing') else 'null',
                k.get('unit', ''), js(k.get('periodicity', '')), js(k.get('source', '')),
                ("'" + k['series'] + "'") if k.get('series') else 'null',
                ("'" + js(k['needs']) + "'") if k.get('needs') else 'null'))
        lines.append('      ],')
    if c.get('kpiNote'): lines.append("      kpiNote: '%s'," % js(c['kpiNote']))
    if c.get('interactions'):
        lines.append('      interactions: [')
        for it in c['interactions']:
            lines.append("        { name: '%s', relation: '%s', bridge: %s," % (
                js(it['name']), js(it['relation']),
                ("'" + it['bridge'] + "'") if it.get('bridge') else 'null'))
            lines.append('          lines: [' + ', '.join("'" + js(x) + "'" for x in it.get('lines', [])) + '],')
            lines.append("          why: '%s'," % js(it['why']))
            lines.append("          data: '%s' }," % js(it['data']))
        lines.append('      ],')
    if c.get('adjacencies'):
        lines.append('      adjacencies: [')
        for adj in c['adjacencies']:
            lines.append("        { name: '%s', why: '%s', series: %s, needs: %s }," % (
                js(adj['name']), js(adj['why']),
                ("'" + adj['series'] + "'") if adj.get('series') else 'null',
                ("'" + js(adj['needs']) + "'") if adj.get('needs') else 'null'))
        lines.append('      ],')
    lines.append('      drivers: {')
    built = {}
    for dk, spec in s['drivers'].items():
        if 'from' in spec:
            lines.append("        %s: { from: '%s' }," % (dk, spec['from']))
            built[dk] = 'ref'
            continue
        got = {v: build_driver(spec, v) for v in ('q', 'y')}
        built[dk] = got
        head = "        %s: { label: '%s', short: '%s', unit: '%s', src: '%s'," % (
            dk, spec['label'].replace("'", "\\'"), spec['short'], spec.get('unit', 'usdM'),
            ('DCF ' + spec['dcf']) if 'dcf' in spec else ('BBG ' + spec['bbg']))
        lines.append(head)
        for v in ('q', 'y'):
            a, m = got[v]['act'], got[v]['summit']
            if not a and not m: continue
            lines.append("          %s: { act: %s, summit: %s }," % (v, obj(a, AXIS[v]), obj(m, AXIS[v])))
        lines.append('        },')
        report.append('%-5s %-8s q:%d act/%d est   y:%d act/%d est' % (
            s['key'], dk, len(got['q']['act']), len(got['q']['summit']),
            len(got['y']['act']), len(got['y']['summit'])))
    lines.append('      },')
    lines.append('      bridges: [')
    for b in s['bridges']:
        lines.append("        { key: '%s', label: '%s', view: '%s', target: '%s', kind: '%s'," % (
            b['key'], b['label'], b['view'], b['target'], b['kind']))
        lines.append("          terms: [%s]," % ', '.join("'%s'" % t for t in b['terms']))
        lines.append("          identity: '%s'," % b['identity'].replace("'", "\\'"))
        lines.append("          note: '%s' }," % b['note'].replace("'", "\\'"))
    lines.append('      ],')
    lines.append("      highlights: [%s]" % ', '.join("'%s'" % h for h in CFG['highlights'][s['key']]))
    lines.append('    },')
    segs.append('\n'.join(lines))

shared_lines = []
for k, spec in CFG.get('shared', {}).items():
    got = {v: build_driver(spec, v) for v in ('q', 'y')}
    shared_lines.append("    %s: { label: '%s', short: '%s', unit: '%s', src: 'BBG %s', scope: '%s'," % (
        k, spec['label'].replace("'", "\\'"), spec['short'], spec['unit'], spec['bbg'], spec.get('scope', 'company')))
    for v in ('q', 'y'):
        a = got[v]['act']
        if a: shared_lines.append("      %s: { act: %s, summit: {} }," % (v, obj(a, AXIS[v])))
    shared_lines.append('    },')
    report.append('%-5s %-8s q:%d act   y:%d act' % ('all', k, len(got['q']['act']), len(got['y']['act'])))

derived_lines = []
for k, d in CFG['derived'].items():
    extra = ", annualiseDen: true" if d.get('annualiseDen') else ''
    derived_lines.append("    %s: { label: '%s', short: '%s', unit: '%s', num: '%s', den: '%s'%s }," % (
        k, d['label'].replace("'", "\\'"), d['short'], d['unit'], d['num'], d['den'], extra))

# ── the OTHER cuts: the same revenue sliced a different way ──────────────────────────────────
# Amazon publishes two disaggregations besides the reportable segments — by groups of similar
# products and services (quarterly) and by country (annual, 10-K only). Neither is extra revenue;
# both re-slice the same total, and each series is stamped with the filing text that defines it.
#
# The product lines live in the Results dataset and are POINTED at, never copied. Their annual
# figures do not exist there, so they are summed here from the four reported quarters — and only
# when all four have printed, because a three-quarter "year" is a lie with a number on it.
TENK = json.load(open(os.path.join(HERE, 'tenk_%s.json' % TK.lower()), encoding='utf-8')) \
       if os.path.exists(os.path.join(HERE, 'tenk_%s.json' % TK.lower())) else {}
GEO = json.load(open(os.path.join(HERE, 'geo_%s.json' % TK.lower()), encoding='utf-8')) \
      if os.path.exists(os.path.join(HERE, 'geo_%s.json' % TK.lower())) else {}
OTHER = _C.get('other', {})

LINE_KEYS = [('online', 'Online stores'), ('p3', 'Third-party seller services'),
             ('aws', 'AWS'), ('ads', 'Advertising services'),
             ('subs', 'Subscription services'), ('phys', 'Physical stores'), ('other', 'Other')]
GEO_ROWS = ['United States', 'Germany', 'United Kingdom', 'Japan', 'Rest of world']


def results_metric(key, view):
    """the reported quarters of a Results metric, period -> value"""
    path = os.path.join(REPO, 'js', 'results-data', '%s.js' % TK.lower())
    src = open(path, encoding='utf-8').read()
    m = re.search(r"\b%s:\s*\{" % re.escape(key), src)
    return src, m


def annual_from_quarters(qvals):
    """{'1Q23': v, ...} -> {'2023': sum} for years with all four quarters reported"""
    byyear = {}
    for pk, v in qvals.items():
        mm = re.match(r'^([1-4])Q(\d\d)$', pk)
        if not mm:
            continue
        byyear.setdefault('20' + mm.group(2), {})[mm.group(1)] = v
    return {y: sum(q.values()) for y, q in sorted(byyear.items()) if len(q) == 4}


def read_results_series(key):
    """period -> reported value, straight out of the emitted Results dataset"""
    path = os.path.join(REPO, 'js', 'results-data', '%s.js' % TK.lower())
    src = open(path, encoding='utf-8').read()
    i = src.find('views:')
    qi = src.find("q:", i)
    blk = src[qi:src.find("y:", qi)]
    m = re.search(r"\b%s:\s*\{(.*?)\n\s{6}\}" % re.escape(key), blk, re.S)
    if not m:
        return {}
    body = m.group(1)
    pm = re.search(r"periods:\s*\[(.*?)\]", body, re.S)
    am = re.search(r"act:\s*\[(.*?)\]", body, re.S)
    if not (pm and am):
        return {}
    periods = re.findall(r"'([^']+)'", pm.group(1))
    raw = [x.strip() for x in am.group(1).split(',')]
    out = {}
    for i2, p in enumerate(periods):
        if i2 < len(raw) and raw[i2] not in ('null', ''):
            try:
                out[p] = float(raw[i2])
            except ValueError:
                pass
    return out


other_lines, other_shared = [], []
if OTHER.get('cuts'):
    by_key = {c['key']: c for c in OTHER['cuts']}

    # ── product lines ────────────────────────────────────────────────────────────────────────
    cut = by_key.get('lines')
    if cut:
        qaxis, yaxis, series = [], set(), []
        for key, label in LINE_KEYS:
            qv = read_results_series(key)
            if not qv:
                report.append('other.lines  %-8s NO SERIES in the Results dataset' % key)
                continue
            qaxis = qaxis or sorted(qv, key=lambda p: (p[2:], p[0]))
            yv = annual_from_quarters(qv)
            yaxis |= set(yv)
            fn = (TENK.get('productLines', {}) or {}).get(key) or {}
            if key == 'aws':
                fn = {'text': (TENK.get('segments', {}).get('aws') or {}).get('text', ''),
                      'source': 'Note 10 — Segment Information'}
            other_shared.append(
                "    %s_y: { label: '%s', short: '%s', unit: 'usdM', src: 'Sum of the four reported quarters', scope: 'company',\n"
                "      y: { act: %s, summit: {} },\n    }," % (
                    key, js(label), js(label),
                    '{ ' + ', '.join("'%s': %s" % (y, jsnum(v)) for y, v in sorted(yv.items())) + ' }'))
            series.append("        { key: '%s', ref: { q: 'results:%s', y: 'shared:%s_y' }, label: '%s'%s }," % (
                key, key, key, js(label),
                (",\n          tenK: { text: '%s', where: '%s' }" % (
                    js(re.sub(r'\s+', ' ', fn['text']).strip()), js(fn.get('source', ''))))
                if fn.get('text') else ''))
        other_lines.append('    {')
        other_lines.append("      key: 'lines', label: '%s', sub: '%s'," % (js(cut['label']), js(cut['sub'])))
        other_lines.append("      lede: '%s'," % js(cut['lede']))
        other_lines.append("      caveat: '%s'," % js(cut['caveat']))
        other_lines.append("      note: '%s'," % js(cut.get('annualNote', '')))
        if cut.get('tenK'):
            other_lines.append("      tenK: { text: '%s', where: '%s' }," % (
                js(cut['tenK']['text']), js(cut['tenK'].get('where', ''))))
        other_lines.append("      axis: { q: [%s], y: [%s] }," % (
            ', '.join("'%s'" % p for p in qaxis), ', '.join("'%s'" % y for y in sorted(yaxis))))
        if TENK.get('_provenance'):
            pv = TENK['_provenance']
            other_lines.append(
                "      cite: { form: '%s', period: '%s', accession: '%s', url: '%s' }," % (
                    pv['form'], pv['period'], pv['accession'], pv['url']))
        other_lines.append('      series: [')
        other_lines += series
        other_lines.append('      ],')
        other_lines.append('    },')
        report.append('other.lines  %d series · quarters %s..%s · years %s' % (
            len(series), qaxis[0] if qaxis else '-', qaxis[-1] if qaxis else '-',
            ','.join(sorted(yaxis))))

    # ── geography ────────────────────────────────────────────────────────────────────────────
    cut = by_key.get('geo')
    if cut and GEO.get('series'):
        years = GEO['years']
        series = []
        for name in GEO_ROWS:
            vals = GEO['series'].get(name)
            if not vals:
                continue
            key = 'geo_' + re.sub(r'[^a-z]', '', name.lower())[:10]
            other_shared.append(
                "    %s: { label: '%s', short: '%s', unit: 'usdM', src: '%s', scope: 'company',\n"
                "      y: { act: %s, summit: {} },\n    }," % (
                    key, js(name), js(name),
                    js('10-K, net sales attributed to countries'),
                    '{ ' + ', '.join("'%s': %s" % (y, jsnum(vals[y])) for y in years if y in vals) + ' }'))
            series.append("        { key: '%s', ref: 'shared:%s', label: '%s' }," % (key, key, js(name)))
        other_lines.append('    {')
        other_lines.append("      key: 'geo', label: '%s', sub: '%s'," % (js(cut['label']), js(cut['sub'])))
        other_lines.append("      lede: '%s'," % js(cut['lede']))
        other_lines.append("      caveat: '%s'," % js(cut['caveat']))
        other_lines.append("      axis: { y: [%s] }," % ', '.join("'%s'" % y for y in years))
        other_lines.append("      views: ['y'],")
        if GEO.get('note'):
            other_lines.append("      tenK: { text: '%s', where: '%s' }," % (
                js(re.sub(r'\s+', ' ', GEO['note']).strip()), js('Note 10 — Segment Information')))
        pv = (GEO.get('provenance') or {}).get(years[-1]) if years else None
        if pv:
            other_lines.append("      cite: { form: '10-K', period: '%s', accession: '%s', url: '%s' }," % (
                years[-1], pv['accession'], pv['url']))
        other_lines.append("      spans: '%s'," % js(
            'Assembled from %d 10-K filings — each carries three fiscal years, so reaching back to %s '
            'means reading more than one.' % (len({p['accession'] for p in GEO['provenance'].values()}),
                                              years[0])))
        other_lines.append('      series: [')
        other_lines += series
        other_lines.append('      ],')
        other_lines.append('    },')
        report.append('other.geo    %d countries · %s..%s from %d filings' % (
            len(series), years[0], years[-1],
            len({p['accession'] for p in GEO['provenance'].values()})))


# ── the customers block ──────────────────────────────────────────────────────────────────────
# Three separate things that a "customers" tab keeps apart or it teaches nothing:
#   the CLASSES the company names for itself (Item 1, verbatim),
#   the concentration disclosure — which for Amazon is its ABSENCE, and that is the finding,
#   and the counterparty census from Bloomberg SPLC, which is somebody ELSE's disclosure.
# The third is empty until an SPLC export lands; the tab renders the gap rather than hiding it.
SPLC = json.load(open(os.path.join(HERE, 'splc_%s.json' % TK.lower()), encoding='utf-8')) \
       if os.path.exists(os.path.join(HERE, 'splc_%s.json' % TK.lower())) else None

cust_lines = []
if TENK.get('customerClasses') or TENK.get('absent') or SPLC:
    cust_lines.append('  customers: {')
    cc = TENK.get('customerClasses') or {}
    if cc:
        cust_lines.append('    classes: [')
        for k, v in cc.items():
            cust_lines.append("      { key: '%s', label: '%s', text: '%s', where: '%s' }," % (
                k, js(v.get('label') or k.title()),
                js(re.sub(r'\s+', ' ', v['text']).strip()), js(v.get('source', ''))))
        cust_lines.append('    ],')
    conc = (TENK.get('absent') or {}).get('customerConcentration')
    if conc:
        cust_lines.append("    concentration: { disclosed: false, note: '%s' }," % js(conc))
    else:
        cust_lines.append('    concentration: { disclosed: true, note: \'\' },')
    if TENK.get('_provenance'):
        pv = TENK['_provenance']
        cust_lines.append("    cite: { form: '%s', period: '%s', accession: '%s', url: '%s' }," % (
            pv['form'], pv['period'], pv['accession'], pv['url']))
    if SPLC:
        cv = SPLC.get('coverage') or {}
        cust_lines.append("    splc: { source: '%s', file: '%s', named: %d, sized: %d, sumPct: %s," % (
            js(SPLC.get('source', '')), js(SPLC.get('file', '')),
            cv.get('named', 0), cv.get('sized', 0),
            jsnum(cv['sumPct']) if cv.get('sumPct') is not None else 'null'))
        cust_lines.append('      customers: [')
        for c in SPLC.get('customers', []):
            cust_lines.append("        { name: '%s', ticker: '%s', relationship: '%s', basis: '%s', asOf: '%s', pct: %s, usdM: %s }," % (
                js(c.get('name') or ''), js(c.get('ticker') or ''), js(c.get('relationship') or ''),
                js(c.get('basis') or ''), js(c.get('asOf') or ''),
                jsnum(c['exposurePct']) if c.get('exposurePct') is not None else 'null',
                jsnum(c['exposureUsdM']) if c.get('exposureUsdM') is not None else 'null'))
        cust_lines.append('      ],')
        cust_lines.append('    },')
    else:
        cust_lines.append('    splc: null,')
    cust_lines.append('  },')
    report.append('customers    %d classes · concentration %s · SPLC %s' % (
        len(cc), 'NOT DISCLOSED' if conc else 'disclosed',
        ('%d names' % len(SPLC.get('customers', []))) if SPLC else 'no export yet'))


out = []
out.append('// segments-data/%s.js — the Segments tab dataset. GENERATED by' % TK.lower())
out.append('// scripts/segments/emit_segments.py; contract in docs/SEGMENTS_CONVENTIONS.md.')
out.append('//')
out.append('// A BRIDGE is a target plus terms whose product equals it — the one shape that covers')
out.append('// "revenue = subscribers x ARPU", "gross bookings = MAUs x trips x price" and AWS\'s')
out.append('// "revenue = capacity x revenue per $ of capacity". `kind` says whether the terms come')
out.append('// from independent sources (so the product reconciling is a real check) or whether one')
out.append('// term is derived from the target (a rearrangement that splits volume from yield).')
out.append('//')
out.append('// Drivers marked `from: results:<key>` are POINTERS into js/results-data/%s.js —' % TK.lower())
out.append('// segment revenue and operating income keep exactly one home and are never copied here.')
out.append('//')
out.append('// Series are period-keyed, `act` and `summit` separately, on the dataset axis. A period')
out.append('// that has already reported carries no `summit` value: the model freezes or zeroes it.')
out.append('')
out.append('export var %sSegments = {' % TK.lower())
out.append("  updated: 'Aug 2026',")
out.append("  source: 'Segment PP&E, capex and EBITDA from the Summit DCF (snapshot 2026-08-04, actuals_history for reported periods and projection_history forward). Segment D&A, remaining performance obligations, shipping cost and days payable are Bloomberg reported figures assembled across the archive snapshots — Amazon does not publish any of them, so there is no company number to reconcile against. Segment revenue and operating income are read from the Results dataset.',")
out.append('  axis: { q: [%s], y: [%s] },' % (
    ', '.join("'%s'" % p for p in AXIS['q']), ', '.join("'%s'" % p for p in AXIS['y'])))
out.append('  shared: {')
out += shared_lines
out += other_shared
out.append('  },')
out.append('  derived: {')
out += derived_lines
out.append('  },')
if OVERVIEW:
    out.append('  overview: {')
    out.append("    lede: '%s'," % js(OVERVIEW.get('lede', '')))
    if OVERVIEW.get('tenK'):
        out.append("    tenK: { text: '%s', where: '%s' }," % (
            js(OVERVIEW['tenK']['text']), js(OVERVIEW['tenK'].get('where', ''))))
    out.append('    interactions: [')
    for it in OVERVIEW.get('interactions', []):
        out.append("      { name: '%s', what: '%s', evidence: '%s' }," % (
            js(it['name']), js(it['what']), js(it.get('evidence', ''))))
    out.append('    ]')
    out.append('  },')
out += cust_lines
if other_lines:
    out.append('  other: [')
    out += other_lines
    out.append('  ],')
out.append('  segments: [')
out += segs
out.append('  ]')
out.append('};')

dest = os.path.join(REPO, 'js', 'segments-data')
os.makedirs(dest, exist_ok=True)
path = os.path.join(dest, '%s.js' % TK.lower())
open(path, 'w', encoding='utf-8', newline='\n').write('\n'.join(out) + '\n')

print('%s — wrote js/segments-data/%s.js (%d lines)\n' % (TK, TK.lower(), len(out)))
print('coverage per driver:')
for r in report: print('   ' + r)
print('\nrejected by config (checked, not read): %s' % ', '.join(CFG.get('rejected', [])))
