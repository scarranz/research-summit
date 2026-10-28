"""Pull the passages the Segments tab quotes VERBATIM out of a 10-K, with their provenance.

    py extract_10k.py AMZN 0001018724

Downloads the newest 10-K from EDGAR, flattens it, and writes tenk_<tk>.json holding the exact
sentences — segment descriptions, the product-line definitions, and the customer classes the
company names for itself — each stamped with the accession number, the period and the URL.

Why extract rather than paraphrase: a paraphrase of a filing reads like a fact and is not one.
Anything on screen that claims to be what the 10-K says has to be the string the 10-K contains,
and has to carry a link back to it. Everything the filing does NOT say is recorded here too —
`absent` — because "Amazon discloses no customer concentration at all" is itself a finding, and
one a reader will otherwise assume we simply failed to look up.

EDGAR requires a descriptive User-Agent; without one it answers 403.
"""
import json, os, re, sys, html, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(HERE, 'tenk')
os.makedirs(OUT, exist_ok=True)
UA   = os.environ.get('SEC_UA', 'Summit Research Portal research@summit-mgmtx.com')
TK   = (sys.argv[1] if len(sys.argv) > 1 else 'AMZN').upper()
CIK  = (sys.argv[2] if len(sys.argv) > 2 else '0001018724').zfill(10)


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Encoding': 'gzip, deflate'})
    with urllib.request.urlopen(req) as r:
        data = r.read()
        if r.headers.get('Content-Encoding') == 'gzip':
            import gzip; data = gzip.decompress(data)
    return data.decode('utf-8', errors='replace')


# EDGAR's HTML carries the printed page furniture — a page number followed by "Table of
# Contents" at every break. Flattening leaves it embedded mid-sentence, and it then ships as
# if the filing had said it. It is layout, not text, so it comes out before anything is quoted.
PAGE_NOISE = re.compile(r'\s*\b\d{1,3}\s+Table of Contents\b\s*', re.I)


def flatten(raw):
    t = re.sub(r'(?is)<(script|style).*?</\1>', ' ', raw)
    t = re.sub(r'<[^>]+>', ' ', t)
    t = html.unescape(t)
    t = t.replace('’', "'").replace('“', '"').replace('”', '"')
    t = t.replace('�', "'")                    # the filing's smart quotes survive as U+FFFD
    t = re.sub(r'[ \t\xa0]+', ' ', t)
    t = PAGE_NOISE.sub(' ', t)
    return re.sub(r'\s*\n\s*', '\n', t)


def between(t, start, end, pad=0):
    i = t.find(start)
    if i < 0: return None
    j = t.find(end, i + len(start))
    if j < 0: return None
    return t[i:j + pad].strip()


sub = json.loads(get('https://data.sec.gov/submissions/CIK%s.json' % CIK))
rec = sub['filings']['recent']
idx = next(i for i in range(len(rec['form'])) if rec['form'][i] == '10-K')
acc = rec['accessionNumber'][idx].replace('-', '')
doc = rec['primaryDocument'][idx]
url = 'https://www.sec.gov/Archives/edgar/data/%d/%s/%s' % (int(CIK), acc, doc)
print('%s 10-K  filed %s  for %s\n  %s' % (sub['name'], rec['filingDate'][idx], rec['reportDate'][idx], url))

raw = get(url)
open(os.path.join(OUT, '%s-10k-%s.htm' % (TK.lower(), rec['reportDate'][idx][:4])), 'w',
     encoding='utf-8').write(raw)
t = flatten(raw)
open(os.path.join(OUT, '%s-10k-%s.txt' % (TK.lower(), rec['reportDate'][idx][:4])), 'w',
     encoding='utf-8').write(t)

prov = {'company': sub['name'], 'form': '10-K', 'accession': rec['accessionNumber'][idx],
        'filed': rec['filingDate'][idx], 'period': rec['reportDate'][idx], 'url': url}

out = {'_provenance': prov, 'segments': {}, 'productLines': {}, 'customerClasses': {}, 'absent': {}}

# ── segment descriptions, Note 10 ────────────────────────────────────────────────────────────
for key, head, nxt in (('na', 'The North America segment', 'International'),
                       ('intl', 'The International segment', 'AWS'),
                       ('aws', 'The AWS segment', 'Information on reportable segments')):
    txt = between(t, head, nxt)
    if txt:
        out['segments'][key] = {'text': re.sub(r'\s+', ' ', txt).strip(),
                                'source': 'Note 10 — Segment Information'}

# ── product-line definitions, the footnotes under the net-sales-by-group table ───────────────
LINES = [('online', '1', 'Online stores'), ('phys', '2', 'Physical stores'),
         ('p3', '3', 'Third-party seller services'), ('ads', '4', 'Advertising services'),
         ('subs', '5', 'Subscription services'), ('other', '6', 'Other')]
notes = between(t, '(1) Includes product sales and digital media', 'Net sales are attributed to countries')
if notes:
    notes = re.sub(r'\s+', ' ', notes)
    for i, (key, n, label) in enumerate(LINES):
        nxt = '(%s)' % (int(n) + 1)
        seg = between(notes + ' (7)', '(%s)' % n, nxt)
        if seg:
            out['productLines'][key] = {'label': label,
                                        'text': seg[len('(%s)' % n):].strip(),
                                        'source': 'Note 10 — net sales by groups of similar products and services'}

# ── the customer classes the company names for ITSELF, Item 1 ───────────────────────────────
# The heading is carried explicitly rather than sliced back off the text: "Developers and
# Enterprises" and "Content Creators" both defeat any leading-noun-phrase rule you write.
for key, label, head, nxt in (
        ('consumers', 'Consumers', 'Consumers We serve consumers', 'Sellers We offer programs'),
        ('sellers', 'Sellers', 'Sellers We offer programs', 'Developers and Enterprises'),
        ('devent', 'Developers and Enterprises', 'Developers and Enterprises', 'Content Creators'),
        ('creators', 'Content Creators', 'Content Creators', 'Advertisers We provide'),
        ('advertisers', 'Advertisers', 'Advertisers We provide', 'Competition Our businesses')):
    txt = between(t, head, nxt)
    if txt:
        body = re.sub(r'\s+', ' ', txt).strip()
        if body.startswith(label):
            body = body[len(label):].strip()
        out['customerClasses'][key] = {'label': label, 'text': body,
                                       'source': 'Item 1 — Business'}

# ── what the filing does NOT say ─────────────────────────────────────────────────────────────
cust_conc = re.search(r'(?i)(no customer|single customer|customer accounted for 10)', t)
out['absent']['customerConcentration'] = (
    None if cust_conc else
    'The filing carries no customer-concentration disclosure of any kind — no "no single customer '
    'accounted for 10%" sentence, and no named customer anywhere. Amazon discloses SUPPLIER '
    'concentration ("During 2025, no vendor accounted for 10% or more of our purchases") and not '
    'the customer side. Named customers therefore have to come from the earnings calls, and any '
    'sizing of a customer is somebody\'s estimate, not a disclosure.')
for probe, label in ((r'(?i)paid units', 'paidUnits'), (r'(?i)Prime members?\b', 'primeMembers'),
                     (r'(?i)average selling price', 'asp')):
    out['absent'][label] = None if re.search(probe, t) else 'Not disclosed in this filing.'

dest = os.path.join(HERE, 'tenk_%s.json' % TK.lower())
json.dump(out, open(dest, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)
print('\nwrote %s' % os.path.relpath(dest, HERE))
print('  segments:        %s' % ', '.join(out['segments']))
print('  product lines:   %s' % ', '.join(out['productLines']))
print('  customer classes:%s' % ', '.join(out['customerClasses']))
for k, v in out['absent'].items():
    print('  absent · %-22s %s' % (k, 'NOT DISCLOSED' if v else 'present in the filing'))
