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
        'DRTSCILM', 'A191RL1Q225SBEA', 'GDP', 'BAA10Y', 'AAA10Y']
OTHER = {
    'shiller_ie_data.xls': 'http://www.econ.yale.edu/~shiller/data/ie_data.xls',
    'finra_margin.xlsx': 'https://www.finra.org/sites/default/files/2021-03/margin-statistics.xlsx',
}

def get(url, dest):
    # curl: Python's urllib / PowerShell's Invoke-WebRequest time out against FRED on some networks
    r = subprocess.run(['curl', '-sL', '-m', '90', '-o', dest, '-w', '%{http_code}', url], capture_output=True, text=True)
    return r.stdout.strip()

def main():
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
