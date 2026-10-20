#!/usr/bin/env python3
"""
extract_eps.py: "Index EPS Contribution Analysis.xlsx" (sheet UNIVERSE, one row per
security x snapshot date) becomes js/eps-attribution-data.js for Market Analysis > EPS Attribution.

Source columns (found by header name, not by position):
  as_of_date | security_ticker | company_name | spx_constituent | ndx_constituent |
  spx_weight | ndx_weight | latest_price | financials_currency | earnings_2026 | earnings_2027 |
  eps_2026 | eps_2027 | sector | industry_group | industry
Consensus is Bloomberg calendarised to Dec-31 (FPT=BA, FYE=C1231), GAAP basis.

Cleaning rules (docs/EPS_ATTRIBUTION.md section 3):
  - Not companies, dropped everywhere: 'USD Curncy' (cash line), 'NQ* Index' (futures in the QQQ file).
  - MMED US Equity: dropped from every snapshot (agreed with the analyst, spec section 2).
  - Names with no price (e.g. 2602335D US Equity): dropped.
  - GOOG has no per-share consensus; it takes GOOGL's (same company, same EPS per share).
  - Financials not in USD (PDD CNY, CCEP/FER EUR) keep their EPS as the file gives it (flagged 'c' in the data, no FX
    applied; growth is currency-neutral). ASML and BRK/B have no estimate in the file at all.
  - Aggregate earnings use EPS x implied index shares (weight/price). The spec's total-$ earnings x
    (weight/price) mixes company scales and is not used; earnings in $ are not shipped.

Usage:
  python scripts/eps-attribution/extract_eps.py "<workbook.xlsx>"            # dry run: summary
  python scripts/eps-attribution/extract_eps.py "<workbook.xlsx>" --write    # write js/eps-attribution-data.js
"""
import argparse, json, math, os, re, sys

import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'js', 'eps-attribution-data.js')
DROP_EXACT = {'USD Curncy', 'MMED US Equity', 'FDX US Equity', 'MBGL US Equity'}   # analyst's exclusions
NEEDED = ['as_of_date', 'security_ticker', 'company_name', 'spx_weight', 'ndx_weight', 'latest_price',
          'financials_currency', 'eps_2026', 'eps_2027', 'sector', 'industry_group', 'industry']


# AZN moved its listing off the Nasdaq after Mar-2026 (still in the global indices, still trading): Yahoo Finance AZN (NYSE, USD) closes
SUPPLEMENT = {'AZN US Equity': {'src': 'Yahoo Finance AZN (NYSE, USD)', 'px': {'2026-04-01': 200.73, '2026-07-01': 183.86, '2026-10-16': 165.41}}}


def num(v):
    if isinstance(v, (int, float)) and not (isinstance(v, float) and math.isnan(v)):
        return float(v)
    return None


def read(path):
    wb = openpyxl.load_workbook(path, data_only=True, read_only=True)
    ws = wb['UNIVERSE'] if 'UNIVERSE' in wb.sheetnames else wb.worksheets[0]
    hdr, rows, cols = None, [], {}
    for r in ws.iter_rows(values_only=True):
        if hdr is None:
            # the data block is the (right-most) one whose header row has as_of_date
            if r and 'as_of_date' in r:
                first = len(r) - 1 - list(reversed(r)).index('as_of_date')
                hdr = first
                names = {}
                for j in range(first, len(r)):
                    if r[j] in NEEDED:
                        names[r[j]] = j
                miss = [n for n in NEEDED if n not in names]
                if miss:
                    sys.exit('missing columns: %s' % miss)
                cols = names
            continue
        d = r[cols['as_of_date']] if len(r) > cols['as_of_date'] else None
        if d is None or not hasattr(d, 'strftime'):
            continue
        rows.append({k: (r[j] if j < len(r) else None) for k, j in cols.items()})
    return rows


def short(t):
    return t.replace(' US Equity', '').replace(' Equity', '')


def build(rows):
    warn = []
    dates = sorted({r['as_of_date'].strftime('%Y-%m-%d') for r in rows})
    # GOOGL per-share EPS by date, for GOOG
    googl = {r['as_of_date'].strftime('%Y-%m-%d'): (num(r['eps_2026']), num(r['eps_2027']))
             for r in rows if r['security_ticker'] == 'GOOGL US Equity'}
    sec_ix, secs, snaps = {}, [], {d: [] for d in dates}
    for r in rows:
        t = r['security_ticker']
        if t in DROP_EXACT or t.endswith(' Index'):
            continue
        d = r['as_of_date'].strftime('%Y-%m-%d')
        px = num(r['latest_price'])
        ws, wn = num(r['spx_weight']) or 0.0, num(r['ndx_weight']) or 0.0
        if px is None:
            if ws > 0 or wn > 0:
                warn.append('dropped (no price): %s %s' % (t, d))
            continue
        # a row with price but weight 0 in both indices is kept: the name left the index (or has not joined yet)
        # and the engine still needs its price and estimate to follow it for the part of the period it was a member
        e26, e27 = num(r['eps_2026']), num(r['eps_2027'])
        note = None
        if t == 'GOOG US Equity' and e26 is None and e27 is None:
            e26, e27 = googl.get(d, (None, None))
            note = 'EPS per share taken from GOOGL'
        if t == 'BRK/B US Equity' and e26 is not None and e26 > 5000:
            # Bloomberg returns Class A per-share EPS for BRK/B; a Class B share is 1/1500 of a Class A share
            e26 = e26 / 1500.0; e27 = None if e27 is None else e27 / 1500.0
            warn.append('BRK/B EPS divided by 1500 (file has Class A EPS): %s' % d)
        cur = str(r['financials_currency']).strip()
        if t not in sec_ix:
            sec_ix[t] = len(secs)
            secs.append({'t': short(t), 'n': r['company_name'], 's': r['sector'], 'g': r['industry_group'], 'i': r['industry']})
            if cur not in ('USD', '#N/A', 'None'):
                secs[-1]['c'] = cur          # EPS currency as the file labels it; no FX applied
        snaps[d].append([sec_ix[t], round(ws, 6), round(wn, 6), round(px, 4),
                         None if e26 is None else round(e26, 4), None if e27 is None else round(e27, 4)])
    # names that left the Nasdaq-100 but still trade: the file has no row after they left, so the closes come from
    # Yahoo Finance and the EPS is held at the last estimate in the file (flat). They carry no index weight.
    notes = []
    for t, s in SUPPLEMENT.items():
        if t not in sec_ix:
            continue
        sid, last, used = sec_ix[t], None, []
        for d in dates:
            row = next((r for r in snaps[d] if r[0] == sid), None)
            if row:
                last = row
            elif d in s['px'] and last is not None:
                snaps[d].append([sid, 0.0, 0.0, s['px'][d], last[4], last[5]]); used.append(d)
        if used:
            notes.append('%s: no row in the file on %s; close from %s, EPS held at the last estimate in the file' % (short(t), ', '.join(used), s['src']))
    # a missing estimate takes the first one available LATER in time (analyst's rule): flat, not guessed
    ids = {}
    for di, d in enumerate(dates):
        for row in snaps[d]:
            ids.setdefault(row[0], {})[di] = row
    nfill = 0
    for sid, byd in ids.items():
        for col in (4, 5):
            nxt = None
            for di in range(len(dates) - 1, -1, -1):
                row = byd.get(di)
                if row is None:
                    continue
                if row[col] is not None:
                    nxt = row[col]
                elif nxt is not None:
                    row[col] = nxt; nfill += 1
    warn.append('back-filled %d missing EPS cells with the next available estimate' % nfill)
    for s in secs:
        for k in ('s', 'g', 'i'):
            if not s[k] or str(s[k]).startswith('#'):
                warn.append('no GICS %s: %s' % (k, s['t']))
    return {'dates': dates, 'secs': secs, 'snaps': [snaps[d] for d in dates], 'notes': notes}, sorted(set(warn))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('xlsx'); ap.add_argument('--write', action='store_true')
    a = ap.parse_args()
    data, warn = build(read(a.xlsx))
    data['source'] = 'Index EPS Contribution Analysis.xlsx'
    data['cols'] = ['id', 'spx_w', 'ndx_w', 'price', 'eps_cy26', 'eps_cy27']
    print('snapshots:', data['dates'])
    print('securities:', len(data['secs']), '| rows per snapshot:', [len(s) for s in data['snaps']])
    for w in warn:
        print('  warn:', w)
    if a.write:
        js = '// Generated by scripts/eps-attribution/extract_eps.py from %s -- do not edit by hand.\n' % data['source']
        js += 'export const EPS_DATA = ' + json.dumps(data, separators=(',', ':'), ensure_ascii=False) + ';\n'
        with open(OUT, 'w', encoding='utf-8') as f:
            f.write(js)
        print('wrote', OUT, '(%d KB)' % (len(js) // 1024))


if __name__ == '__main__':
    main()
