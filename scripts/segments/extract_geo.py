"""Pull the "net sales attributed to countries" table out of a run of 10-Ks.

    py extract_geo.py AMZN 0001018724 3

The geographic cut only exists in the annual report, and each 10-K carries three fiscal years —
so reaching further back means reading more than one filing. This walks the newest N 10-Ks, parses
the country table out of each, and merges them newest-first (an older filing never overwrites a
figure a newer one restated).

Writes geo_<tk>.json: the series, the verbatim attribution sentence, and the accession each year
came from, so any number on screen can be traced to the filing that reported it.
"""
import json, os, re, sys, html, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
UA = os.environ.get('SEC_UA', 'Summit Research Portal research@summit-mgmtx.com')
TK = (sys.argv[1] if len(sys.argv) > 1 else 'AMZN').upper()
CIK = (sys.argv[2] if len(sys.argv) > 2 else '0001018724').zfill(10)
N = int(sys.argv[3]) if len(sys.argv) > 3 else 3

MARK = 'Net sales attributed to countries that represent a significant portion'


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Encoding': 'gzip, deflate'})
    with urllib.request.urlopen(req) as r:
        data = r.read()
        if r.headers.get('Content-Encoding') == 'gzip':
            import gzip; data = gzip.decompress(data)
    return data.decode('utf-8', errors='replace')


def flatten(raw):
    t = re.sub(r'(?is)<(script|style).*?</\1>', ' ', raw)
    t = re.sub(r'<[^>]+>', ' ', t)
    t = html.unescape(t).replace('’', "'").replace('�', "'")
    t = re.sub(r'[\s\xa0]+', ' ', t)
    # printed page furniture, not text — see extract_10k.PAGE_NOISE
    return re.sub(r'\s*\b\d{1,3}\s+Table of Contents\b\s*', ' ', t, flags=re.I)


def parse(t):
    """-> ({country: {year: usdM}}, years, attribution sentence)"""
    i = t.find(MARK)
    if i < 0:
        return None, None, None
    seg = t[i:i + 1400]
    years = re.findall(r'\b(20\d\d)\b', seg[:260])[:3]
    if len(years) != 3:
        return None, None, None
    out = {}
    for name in ('United States', 'Germany', 'United Kingdom', 'Japan', 'Rest of world', 'Consolidated'):
        m = re.search(re.escape(name) + r'((?:\s*\$?\s*[\d,]+){3})', seg)
        if not m:
            continue
        nums = [int(x.replace(',', '')) for x in re.findall(r'[\d,]+', m.group(1))]
        out[name] = dict(zip(years, nums))
    j = t.rfind('Net sales are attributed to countries', max(0, i - 600), i + 1)
    note = t[j:i].strip() if j >= 0 else ''
    return out, years, note


sub = json.loads(get('https://data.sec.gov/submissions/CIK%s.json' % CIK))
rec = sub['filings']['recent']
idxs = [i for i in range(len(rec['form'])) if rec['form'][i] == '10-K'][:N]

series, prov, note = {}, {}, ''
for k in idxs:                                   # newest first: a restatement wins
    acc = rec['accessionNumber'][k].replace('-', '')
    url = 'https://www.sec.gov/Archives/edgar/data/%d/%s/%s' % (
        int(CIK), acc, rec['primaryDocument'][k])
    tbl, years, n = parse(flatten(get(url)))
    print('%s  FY%s  %s' % (rec['accessionNumber'][k], rec['reportDate'][k][:4],
                            ('years ' + ', '.join(years)) if years else 'NO COUNTRY TABLE'))
    if not tbl:
        continue
    note = note or n
    for country, byyear in tbl.items():
        for y, v in byyear.items():
            series.setdefault(country, {}).setdefault(y, v)
            prov.setdefault(y, {'accession': rec['accessionNumber'][k],
                                'filed': rec['filingDate'][k], 'url': url})

years = sorted({y for c in series.values() for y in c})
dest = os.path.join(HERE, 'geo_%s.json' % TK.lower())
json.dump({'company': sub['name'], 'note': note, 'years': years,
           'series': series, 'provenance': prov},
          open(dest, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)

print('\nwrote %s  ·  %s' % (os.path.relpath(dest, HERE), ' '.join(years)))
for c in ('United States', 'Germany', 'United Kingdom', 'Japan', 'Rest of world', 'Consolidated'):
    if c in series:
        print('  %-16s %s' % (c, '  '.join('%9s' % '{:,}'.format(series[c][y])
                                           if y in series[c] else '%9s' % '—' for y in years)))
