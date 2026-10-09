"""
extract_ndx.py — NDX 100 Return Attribution data from the analyst's Excel.

Reads the 'NDX nonBBG' sheet of NASDAQ 100 <year> RETURNS.xlsx (cached values — save the
workbook after the Bloomberg refresh) and turns it into the HOC list the portal draws:
  { n, eff, prev, close (None = open HOC), sec: [{ t, co, w, wi, r, s, g, p0, p1 }] }

  python scripts/ndx/extract_ndx.py                    # dry run: parse + print the HOC summary
  python scripts/ndx/extract_ndx.py --upload           # send to Supabase (new snapshot; open HOC re-priced from Massive)
  python scripts/ndx/extract_ndx.py --refresh-prices   # no Excel: only re-price the open HOC of the newest snapshot
  python scripts/ndx/extract_ndx.py --write-js         # also rewrite js/ndx-attribution-data.js (the bundled fallback)

Options: --xlsx PATH, repeatable to merge several workbooks (or env NDX_XLSX) · --note "text" (stored with the snapshot).
Upload needs the ingest key: env NDX_INGEST_KEY or the gitignored file scripts/ndx/.ingest-key
(San / Oscar set the same value as the NDX_INGEST_KEY secret). URL + anon key come from env.js.

Columns (row 79 onward): H eff date · I prev close · J close (blank = open HOC) · K ticker ·
L company · N weight for sector · O weight for industry · P open (prev close) price ·
Q latest / close price · R return · U sector · V industry group.
"""
import argparse, datetime, json, os, re, sys, urllib.request, urllib.error
from collections import OrderedDict

import openpyxl

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DEFAULT_XLSX = r"G:\My Drive\Summit\Docs\Extras\Team\DAA\Ad hoc info search\NASDAQ 100 RETURNS\NASDAQ 100 2026 RETURNS.xlsx"
SHEET = 'NDX nonBBG'
FIRST_ROW = 79
MIN_SECS = 50          # a block with fewer names is a stray row, not a HOC (e.g. a 1-name block on 2026-08-05)
JS_OUT = os.path.join(ROOT, 'js', 'ndx-attribution-data.js')

# ── Industry-group names: Excel truncates at 30 chars and uses '&' ─────────────
IG_MAP = {
    'Pharmaceuticals, Biotechnology': 'Pharmaceuticals, Biotechnology and Life Sciences',
    'Consumer Discretionary Distrib': 'Consumer Discretionary Distribution and Retail',
    'Consumer Staples Distribution':  'Consumer Staples Distribution and Retail',
    'Health Care Equipment & Servic': 'Health Care Equipment and Services',
    'Health Care Equipment & Suppli': 'Health Care Equipment and Services',
    'Semiconductors & Semiconductor': 'Semiconductors and Semiconductor Equipment',
    'Commercial & Professional Serv': 'Commercial and Professional Services',
    'Technology Hardware & Equipmen': 'Technology Hardware and Equipment',
    'Software & Services':            'Software and Services',
    'Media & Entertainment':          'Media and Entertainment',
    'Food, Beverage & Tobacco':       'Food, Beverage and Tobacco',
    'Household & Personal Products':  'Household and Personal Products',
    'Retailing':                      'Consumer Discretionary Distribution and Retail',
    'Specialty Retail':               'Consumer Discretionary Distribution and Retail',
    'Broadline Retail':               'Consumer Discretionary Distribution and Retail',
    'Hotels Restaurants & Leisure':   'Consumer Services',
    'Hotels, Restaurants & Leisure':  'Consumer Services',
    # Identity entries matter: their prefix also catches longer Excel labels
    # (e.g. 'Real Estate Management and Devel' → 'Real Estate')
    'Diversified Financials':         'Diversified Financials',
    'Telecommunication Services':     'Telecommunication Services',
    'Financial Services':             'Financial Services',
    'Capital Goods':                  'Capital Goods',
    'Consumer Services':              'Consumer Services',
    'Energy':                         'Energy',
    'Utilities':                      'Utilities',
    'Transportation':                 'Transportation',
    'Real Estate':                    'Real Estate',
    'Materials':                      'Materials',
    'Insurance':                      'Insurance',
    'Banks':                          'Banks',
}

def norm_ig(raw):
    if not raw:
        return ''
    raw = str(raw).strip()
    if raw in IG_MAP:
        return IG_MAP[raw]
    for k, v in IG_MAP.items():          # 30-char truncations
        if raw.startswith(k[:20]):
            return v
    return raw.replace(' & ', ' and ')

_EQUITY_RE = re.compile(r'\s+[A-Z]{2,3}\s+Equity$', re.IGNORECASE)
_NONCONSTIT_RE = re.compile(r'\s+(Index|Curncy|Corp|Comdty)$', re.IGNORECASE)

def fmt_ticker(raw):
    """'AMGN US Equity' → 'AMGN'; cash / futures / index lines get a leading '$'."""
    t = str(raw or '').strip()
    if _NONCONSTIT_RE.search(t):
        return '$' + t
    return _EQUITY_RE.sub('', t).strip()

def day(v):
    return v.date().isoformat() if isinstance(v, datetime.datetime) else None

def num(v, n=6):
    try:
        return round(float(v), n)
    except (TypeError, ValueError):
        return None

def read_blocks(xlsx):
    print(f'Reading {xlsx}')
    wb = openpyxl.load_workbook(xlsx, data_only=True, read_only=True)
    ws = wb[SHEET]
    blocks = OrderedDict()
    for row in ws.iter_rows(min_row=FIRST_ROW, max_col=22, values_only=True):
        h, i, j, k, l, _m, n, o, p, q, r = row[7:18]
        u, v = row[20], row[21]
        eff = day(h)
        if not eff or not isinstance(k, str) or not k.strip():
            continue
        key = (eff, day(i) or eff, day(j))
        blocks.setdefault(key, []).append({
            't': fmt_ticker(k), 'co': str(l or '').strip(),
            'w': num(n) or 0, 'wi': num(o) or 0, 'r': num(r) or 0,
            's': str(u or '').strip(), 'g': norm_ig(v),
            'p0': num(p, 4), 'p1': num(q, 4),
        })
    return blocks

# ── Bloomberg dummy lines (see docs/NDX_ATTRIBUTION.md §5) ─────────────────────
# After a spin-off / merger / ADR-ratio change Bloomberg moves a security's old history to a
# dummy line '<7 digits><letter> US Equity' and gives the live ticker a re-adjusted history.
# Historical QQQ holdings can then list BOTH lines in the same HOC — the same stock counted
# twice (identical returns, different price basis). Rule: keep the dummy row (per Bloomberg,
# the line that was actually trading then), drop the live duplicate, re-normalise the HOC
# weights to 100, and show the dummy under its real ticker so the name reads continuously
# across HOCs. Effect: 2020 47.24% → 47.37% and 2023 53.73% → 53.75% (official 47.58 / 53.81).
DUMMY_TICKERS = {
    '9990294D': ('LBTYA', 'Liberty Global Ltd'),      # Liberty Global class A (pre-2024 restructuring line)
    '9999794D': ('LBTYK', 'Liberty Global Ltd'),      # Liberty Global class C
    '9210611D': ('SIRI',  'Sirius XM Holdings Inc'),  # Sirius XM before the 2024 Liberty Media merger / 1:10 reverse split
    '9996651D': ('AZN',   'AstraZeneca PLC'),         # AstraZeneca ADR line around the 2023 ADR-ratio change
}
_DUMMY_RE = re.compile(r'^\d{6,}[A-Z]$')

def resolve_dummies(hoc):
    rows = hoc['sec']
    unknown = sorted({s['t'] for s in rows if _DUMMY_RE.match(s['t']) and s['t'] not in DUMMY_TICKERS})
    if unknown:
        print(f"  ! HOC {hoc['n']}: unmapped Bloomberg dummy ticker(s) {', '.join(unknown)} — add them to DUMMY_TICKERS")
    dummies = [s for s in rows if s['t'] in DUMMY_TICKERS]
    if not dummies:
        return
    live = {DUMMY_TICKERS[s['t']][0] for s in dummies}
    dropped = [s for s in rows if s['t'] in live]
    if dropped:
        rows[:] = [s for s in rows if s['t'] not in live]
        tot_w = sum(s['w'] for s in rows) or 100
        tot_wi = sum(s['wi'] for s in rows) or 100
        for s in rows:
            s['w'] = round(s['w'] * 100 / tot_w, 6)
            s['wi'] = round(s['wi'] * 100 / tot_wi, 6)
        print(f"  · HOC {hoc['n']}: dropped live duplicate(s) {', '.join(s['t'] for s in dropped)} (kept the dummy line); weights re-normalised")
    for s in dummies:
        tick, co = DUMMY_TICKERS[s['t']]
        print(f"  · HOC {hoc['n']}: {s['t']} → {tick}")
        s['t'], s['co'] = tick, co

def extract(paths):
    # Several workbooks (e.g. one per year) are merged; a HOC present in more than one
    # file is taken from the LAST file given.
    if isinstance(paths, str):
        paths = [paths]
    blocks = {}
    for path in paths:
        for key, secs in read_blocks(path).items():
            if key in blocks:
                print(f'  · HOC eff={key[0]} also in {os.path.basename(path)} — using that copy')
            blocks[key] = secs
    hocs = []
    for (eff, prev, close), secs in sorted(blocks.items(), key=lambda kv: (kv[0][0], kv[0][2] or '9999')):
        if len(secs) < MIN_SECS:
            print(f'  ! skipped block eff={eff} close={close}: only {len(secs)} rows')
            continue
        hocs.append({'n': len(hocs) + 1, 'eff': eff, 'prev': prev, 'close': close, 'sec': secs})
    for h in hocs:
        resolve_dummies(h)
    opens = [h for h in hocs if not h['close']]
    if len(opens) > 1 or (opens and opens[0] is not hocs[-1]):
        sys.exit('ERROR: expected at most one open HOC, and it must be the last one')
    print(f'{len(hocs)} HOCs')
    for h in hocs:
        print(f"  HOC {h['n']:>2}  eff {h['eff']}  prev {h['prev']}  close {h['close'] or '(open)':<10}  {len(h['sec'])} rows")
    # The chain must be continuous: each HOC starts at the close the previous one ended on.
    # A gap or overlap would silently distort the compounded year return, so stop.
    breaks = [(a, b) for a, b in zip(hocs, hocs[1:]) if b['prev'] != a['close']]
    for a, b in breaks:
        print(f"  ! HOC {a['n']} closes {a['close']} but HOC {b['n']} starts from {b['prev']}")
    if breaks:
        sys.exit('ERROR: the HOC chain has gaps/overlaps (above) — fix the Excel before uploading')
    return hocs

def write_js(hocs):
    def sec(s):
        return json.dumps(s, ensure_ascii=False, separators=(',', ':'))
    lines = ['// AUTO-GENERATED by scripts/ndx/extract_ndx.py — NDX Attribution Data (bundled fallback;',
             '// the portal reads the newest Supabase snapshot first)',
             f'// Extraction date: {datetime.date.today().isoformat()}', '',
             'export const NDX_DATA = {',
             f'  meta: {{ latestDate: "{hocs[-1]["eff"]}", totalHocs: {len(hocs)}, extractedAt: "{datetime.date.today().isoformat()}" }},',
             '  hocs: [']
    for h in hocs:
        close = f'"{h["close"]}"' if h['close'] else 'null'
        lines.append(f'    {{ n: {h["n"]}, eff: "{h["eff"]}", prev: "{h["prev"]}", close: {close}, sec: [')
        lines.extend(f'      {sec(s)},' for s in h['sec'])
        lines.append('    ] },')
    lines += ['  ]', '};', '']
    with open(JS_OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print(f'Wrote {JS_OUT}')

def supabase_env():
    src = open(os.path.join(ROOT, 'env.js'), encoding='utf-8').read()
    url = re.search(r'SUPABASE_URL:\s*"([^"]+)"', src).group(1)
    anon = re.search(r'SUPABASE_ANON_KEY:\s*"([^"]+)"', src).group(1)
    return url, anon

def ingest_key():
    key = os.environ.get('NDX_INGEST_KEY', '').strip()
    path = os.path.join(os.path.dirname(__file__), '.ingest-key')
    if not key and os.path.exists(path):
        key = open(path, encoding='utf-8').read().strip()
    if not key:
        sys.exit('ERROR: no ingest key (set NDX_INGEST_KEY or create scripts/ndx/.ingest-key)')
    return key

def call(payload):
    url, anon = supabase_env()
    req = urllib.request.Request(
        f'{url}/functions/v1/ndx-attribution', data=json.dumps(payload).encode('utf-8'), method='POST',
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {anon}', 'apikey': anon,
                 'x-ndx-ingest-key': ingest_key()})
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            out = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        sys.exit(f'ERROR {e.code}: {e.read().decode("utf-8", "replace")}')
    m = out.get('meta', {})
    print(f"Saved snapshot {out.get('snapshotId')} at {out.get('savedAt')}")
    print(f"  HOCs {m.get('totalHocs')} · latest HOC {m.get('latestDate')} · open HOC priced {m.get('pricesAsOf')} ({m.get('priceSource')})")
    if m.get('priceMissing'):
        print(f"  ! no Massive price (kept Excel return): {', '.join(m['priceMissing'])}")

def main():
    sys.stdout.reconfigure(encoding='utf-8')   # Windows consoles default to cp1252
    ap = argparse.ArgumentParser()
    ap.add_argument('--xlsx', action='append', help='repeat for several workbooks (e.g. one per year); default = the 2026 file')
    ap.add_argument('--upload', action='store_true')
    ap.add_argument('--refresh-prices', action='store_true')
    ap.add_argument('--write-js', action='store_true')
    ap.add_argument('--note', default='')
    a = ap.parse_args()
    if a.refresh_prices:
        return call({'action': 'refresh-prices', 'note': a.note})
    paths = a.xlsx or [os.environ.get('NDX_XLSX', DEFAULT_XLSX)]
    hocs = extract(paths)
    if a.write_js:
        write_js(hocs)
    if a.upload:
        call({'action': 'ingest', 'hocs': hocs, 'note': a.note,
              'extractedAt': datetime.date.today().isoformat(), 'sourceFile': ', '.join(os.path.basename(x) for x in paths)})

if __name__ == '__main__':
    main()
