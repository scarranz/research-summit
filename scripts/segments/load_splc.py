"""Read a Bloomberg SPLC (Supply Chain Analysis) customer export into splc_<tk>.json.

    py load_splc.py AMZN splc_amzn_export.csv          # or .xlsx

SPLC is a terminal screen, not a BQL function on our tier, so this takes whatever the terminal
exports and normalises it. Column names move between Bloomberg versions, so the header is matched
loosely — run it once and read the mapping report before trusting the output.

WHAT THIS DATA IS, and why the tab says so out loud: Amazon discloses no customer concentration of
any kind, so every name here comes from the OTHER side of the transaction — a company that itself
filed something naming Amazon — or from a Bloomberg estimate. It is a census of counterparty
disclosures, not a ranking of Amazon's revenue, and it will cover a small fraction of it. The
coverage ratio is computed here and printed, because the number that decides whether a chart of
this is honest is "what share of revenue do these names account for", not "how many names are there".

Expected-ish columns (any subset):
    Name / Customer / Company        -> name
    Ticker / BBG Ticker              -> ticker
    Relationship / Type              -> relationship
    % of Revenue / Rev %             -> exposurePct   (of AMAZON's revenue, if BBG gives it)
    Value / Amount                   -> exposureUsdM
    Source / Basis                   -> basis         (filing / estimate — keep it, it is the tier)
    Period / As Of                   -> asOf
"""
import csv, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
TK = (sys.argv[1] if len(sys.argv) > 1 else 'AMZN').upper()
SRC = sys.argv[2] if len(sys.argv) > 2 else None

FIELDS = {
    'name':        ['name', 'customer', 'company', 'counterparty'],
    'ticker':      ['ticker', 'bbg ticker', 'bloomberg ticker', 'id'],
    'relationship': ['relationship', 'type', 'category'],
    'exposurePct': ['% of revenue', 'rev %', 'pct of revenue', 'revenue %', '% rev'],
    'exposureUsdM': ['value', 'amount', 'revenue', 'usd'],
    'basis':       ['source', 'basis', 'disclosure', 'derived from'],
    'asOf':        ['period', 'as of', 'date', 'asof'],
}


def pick(header):
    """-> {our field: column index}, matched loosely, first hit wins"""
    got, low = {}, [str(h or '').strip().lower() for h in header]
    for field, names in FIELDS.items():
        for i, h in enumerate(low):
            if any(h == n or n in h for n in names):
                got[field] = i
                break
    return got


def num(v):
    if v is None:
        return None
    t = re.sub(r'[^0-9.\-]', '', str(v))
    try:
        return float(t) if t not in ('', '-', '.') else None
    except ValueError:
        return None


def rows_from(path):
    if path.lower().endswith(('.xlsx', '.xlsm')):
        import openpyxl
        ws = openpyxl.load_workbook(path, read_only=True, data_only=True).worksheets[0]
        return [list(r) for r in ws.iter_rows(values_only=True)]
    with open(path, encoding='utf-8-sig', newline='') as f:
        return [r for r in csv.reader(f)]


if not SRC or not os.path.exists(SRC):
    print(__doc__)
    print('\nNo export given. Drop the SPLC customer export next to this script and run:')
    print('    py load_splc.py %s <file.csv|file.xlsx>' % TK)
    sys.exit(1)

raw = [r for r in rows_from(SRC) if any(c not in (None, '') for c in r)]
# the header is the first row that maps at least a name column
hi, cols = None, None
for i, r in enumerate(raw[:15]):
    c = pick(r)
    if 'name' in c:
        hi, cols = i, c
        break
if hi is None:
    print('Could not find a name column. Header candidates:')
    for r in raw[:8]:
        print('   ', r)
    sys.exit(1)

print('column mapping (check this before trusting the output):')
for f, i in sorted(cols.items()):
    print('   %-13s <- col %d  %r' % (f, i, raw[hi][i]))

def cell(r, f):
    i = cols.get(f)
    return None if i is None or i >= len(r) else (str(r[i]).strip() if r[i] is not None else None)

out = []
for r in raw[hi + 1:]:
    nm = cell(r, 'name')
    if not nm:
        continue
    out.append({
        'name': nm,
        'ticker': cell(r, 'ticker'),
        'relationship': cell(r, 'relationship'),
        'exposurePct': num(cell(r, 'exposurePct')),
        'exposureUsdM': num(cell(r, 'exposureUsdM')),
        'basis': cell(r, 'basis'),
        'asOf': cell(r, 'asOf'),
    })

# ── coverage: the number that decides whether charting this is honest ────────────────────────
pcts = [c['exposurePct'] for c in out if c['exposurePct'] is not None]
vals = [c['exposureUsdM'] for c in out if c['exposureUsdM'] is not None]
cov = {'named': len(out), 'sized': len(pcts) or len(vals),
       'sumPct': round(sum(pcts), 3) if pcts else None,
       'sumUsdM': round(sum(vals), 1) if vals else None}

dest = os.path.join(HERE, 'splc_%s.json' % TK.lower())
json.dump({'ticker': TK, 'source': 'Bloomberg SPLC — Supply Chain Analysis',
           'file': os.path.basename(SRC), 'coverage': cov, 'customers': out},
          open(dest, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)

print('\nwrote %s' % os.path.relpath(dest, HERE))
print('  %d customers, %d carry a size' % (cov['named'], cov['sized']))
if cov['sumPct'] is not None:
    print('  they account for %.2f%% of revenue between them' % cov['sumPct'])
    if cov['sumPct'] < 10:
        print('  -> under 10%: show this as a list of disclosed relationships, NOT as a')
        print('     concentration chart. The tab prints the coverage next to it either way.')
else:
    print('  NONE of them is sized — the tab can name them but cannot rank them, and says so.')
