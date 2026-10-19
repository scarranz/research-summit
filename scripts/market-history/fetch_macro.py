"""Download the public macro series of the dot-com study into scripts/market-history/macro/ (raw files, git-tracked
so the study is reproducible offline). Sources: FRED (fredgraph.csv, no key), Robert Shiller (Yale ie_data.xls),
FINRA margin statistics. Usage: python scripts/market-history/fetch_macro.py

Nothing here is Bloomberg: the workbook only carries weights and returns, so every macro / commodity
series comes from these public files."""
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'macro')
FRED = ['FEDFUNDS', 'DGS10', 'DGS2', 'T10Y2Y', 'UNRATE', 'PAYEMS', 'CPIAUCSL', 'CPILFESL', 'DCOILWTICO', 'TCU',
        'HOUST', 'OPHNFB', 'FYFSGDA188S', 'TWEXBMTH', 'PCOPPUSDM', 'PALLFNFINDEXM', 'PNRGINDEXM', 'PMETAINDEXM',
        'PNGASUSUSDM', 'A679RC1Q027SBEA', 'B935RC1Q027SBEA', 'Y034RC1Q027SBEA', 'PCU334413334413', 'NASDAQCOM',
        'DRTSCILM', 'A191RL1Q225SBEA', 'GDP', 'BAA10Y', 'AAA10Y', 'USREC']
# The same public sources up to today, for the "Where today differs" table (python fetch_macro.py now -> macro/now/)
NOW_FRED = ['FEDFUNDS', 'DGS10', 'T10Y2Y', 'UNRATE', 'CPIAUCSL', 'BAA10Y', 'BCNSDODNS', 'GDP', 'GFDEGDQ188S', 'BOGMBASE', 'CP', 'USREC']
OTHER = {
    # Yale's copy stops in Sep 2023; shillerdata.com (Shiller's own site) is current. The link carries a ?ver= number that changes
    # with each update: open https://shillerdata.com/ and copy the ie_data.xls link if this one stops working.
    'shiller_ie_data.xls': 'https://img1.wsimg.com/blobby/go/e5e77e0b-59d1-44d9-ab25-4763ac982e53/downloads/1449043e-a1ed-4e2e-8e9c-7b9a2a064493/ie_data.xls?ver=1791297298731',
    'finra_margin.xlsx': 'https://www.finra.org/sites/default/files/2021-03/margin-statistics.xlsx',
}

def get(url, dest):
    # curl: Python's urllib / PowerShell's Invoke-WebRequest time out against FRED on some networks
    r = subprocess.run(['curl', '-sL', '-m', '90', '-o', dest, '-w', '%{http_code}', url], capture_output=True, text=True)
    return r.stdout.strip()

def fetch_now():
    nd = os.path.join(OUT, 'now')
    os.makedirs(nd, exist_ok=True)
    for s in NOW_FRED:
        dest = os.path.join(nd, s + '.csv')
        code = get('https://fred.stlouisfed.org/graph/fredgraph.csv?id=%s&cosd=1990-01-01' % s, dest)
        print('FRED now %-14s %s %d bytes' % (s, code, os.path.getsize(dest)))
        if code != '200': sys.exit('failed: ' + s)
    for name in ('shiller_ie_data.xls', 'finra_margin.xlsx'):
        dest = os.path.join(OUT, name)
        code = get(OTHER[name], dest)
        print('%-22s %s %d bytes' % (name, code, os.path.getsize(dest)))
        if code != '200': sys.exit('failed: ' + name)


def main():
    if 'now' in sys.argv[1:]:
        return fetch_now()
    os.makedirs(OUT, exist_ok=True)
    for s in FRED:
        dest = os.path.join(OUT, s + '.csv')
        code = get('https://fred.stlouisfed.org/graph/fredgraph.csv?id=%s&cosd=1990-01-01&coed=2008-12-31' % s, dest)
        print('FRED %-18s %s %d bytes' % (s, code, os.path.getsize(dest)))
        if code != '200': sys.exit('failed: ' + s)
    for name, url in OTHER.items():
        dest = os.path.join(OUT, name)
        code = get(url, dest)
        print('%-22s %s %d bytes' % (name, code, os.path.getsize(dest)))
        if code != '200': sys.exit('failed: ' + name)

if __name__ == '__main__':
    main()
