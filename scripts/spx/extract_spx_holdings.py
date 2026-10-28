"""S&P 500 company weights by year -> js/spx-holdings-data.js (Top Contributors and Security
Return vs Weight for the S&P 500).

Source: the analyst's "SP 500 2026 RETURNS.xlsx", sheet "SPX nonBBG" — the same layout as the
Nasdaq-100 workbook (docs/NDX_ATTRIBUTION.md §1) but ONE snapshot per year: SPY's holdings and
weights at each year-end (Bloomberg holdings), and each name's price at that year-end and at the
next one (or the cut-off). No intra-year rebalances (Bloomberg query limits), so a year is a
buy-and-hold of the year-end holdings:

    contribution_i = w_i × r_i      (w = opening weight in %, r = the year's price return)
    residual       = SPY's return − Σ contributions
                     (names that left the index without a price, joiners during the year,
                      cash, float changes)

Cleaning (the sheet is a first draft; every fix is printed):
  * 2020 holds two snapshots under the same date: the first block (Dec 31, 2019 weights) is
    the year; the second (the Dec 31, 2020 weights, i.e. 2021's opening) is dropped.
  * A year that closes before Dec 31 (2024 closes Dec 23) is priced to Dec 31 with the next
    year's opening price of the same name ("Snapshot Open (Prev Close) Price").
  * Rows with no return (no price), non-equity lines (USD Curncy, Mtge) → residual.
  * Industry groups truncated at 30 characters are expanded to the GICS name; a missing
    sector / group is taken from the same ticker in another year, else from js/spx-data.js.

Usage:  python scripts/spx/extract_spx_holdings.py "<SP 500 2026 RETURNS.xlsx>" [--write]
"""
import argparse, datetime as dt, json, os, re, sys
import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "js", "spx-holdings-data.js")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from extract_spx import IG_SECTOR, ig_key  # GICS industry group -> sector, name normaliser


def iso(v):
    return v.date().isoformat() if hasattr(v, "date") else None


def num(v):
    return v if isinstance(v, (int, float)) and not isinstance(v, bool) else None


def full_ig(raw):
    """'Pharmaceuticals, Biotechnology' (truncated at 30) -> the GICS name"""
    if not raw or str(raw).startswith("#"):
        return None
    k = ig_key(re.sub(r"\band\b", "&", str(raw)))
    hits = [n for n in IG_SECTOR if ig_key(n).startswith(k)]
    return hits[0] if len(hits) == 1 else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("xlsx")
    ap.add_argument("--write", action="store_true")
    a = ap.parse_args()

    wb = openpyxl.load_workbook(a.xlsx, read_only=True, data_only=True)
    ws = wb["SPX nonBBG"]
    hdr = None
    rows = []
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if hdr is None:
            if any(isinstance(v, str) and "Rebalance Effective" in v for v in row if v):
                hdr = i
            continue
        if not iso(row[7]):
            continue
        rows.append(dict(eff=iso(row[7]), prev=iso(row[8]), close=iso(row[9]), t=row[10], co=row[11],
                         w=num(row[12]), p0=num(row[15]), p1=num(row[16]), r=num(row[17]),
                         s=row[20], g=row[21]))
    if hdr is None:
        sys.exit("SPX nonBBG: no 'Rebalance Effective Date' header")

    # group by snapshot date; a ticker seen again in the same date = a second, stacked snapshot
    years, fixes = [], []
    by = {}
    for r in rows:
        by.setdefault(r["eff"], []).append(r)
    for eff in sorted(by):
        rs, seen, out = by[eff], set(), []
        dups = [i for i, r in enumerate(rs) if r["t"] in {x["t"] for x in rs[:i]}]
        if len(dups) > 50:
            # a whole second snapshot pasted under the same date: keep the block before it
            cut = dups[0]
            out = rs[:cut]
            fixes.append(f"{eff}: a second, stacked snapshot ({len(rs) - cut} rows) dropped; kept the first {cut} rows")
        else:
            for r in rs:
                if r["t"] in seen:
                    fixes.append(f"{eff}: duplicate row of {r['t']} dropped (kept the first)")
                    continue
                seen.add(r["t"]); out.append(r)
        years.append(dict(eff=eff, close=out[0]["close"], rows=out))

    # sector / group fallbacks: same ticker in another year, else today's S&P members
    known = {}
    for y in years:
        for r in y["rows"]:
            ig = full_ig(r["g"])
            if ig:
                known[r["t"]] = ig
    try:
        js = open(os.path.join(ROOT, "js", "spx-data.js"), encoding="utf-8").read()
        spx = json.loads(js[js.index("{"):js.rindex("}") + 1])
        for m in spx["members"]:
            known.setdefault(m["t"] + " US Equity", m["ig"])
        spy_ann = spx["etf"]["annual"]["SPY"]
        member_r = {m["t"]: m for m in spx["members"]}
        cutoff = spx["asOf"]
    except Exception as e:
        sys.exit(f"js/spx-data.js is needed (SPY returns, member GICS): {e}")
    # last resort, by hand: scripts/spx/former_members_gics.json (former members, to check)
    gics_hand = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "former_members_gics.json"), encoding="utf-8"))
    names_hand = gics_hand.get("_names", {})
    for k, v in gics_hand.items():
        if not k.startswith("_"):
            assert v in IG_SECTOR, f"former_members_gics.json: {k} -> {v!r} is not a GICS industry group"
            known.setdefault(k + " US Equity", v)
    # names that left the S&P and carry no GICS here: the Nasdaq-100 data has many of them
    try:
        js = open(os.path.join(ROOT, "js", "ndx-attribution-data.js"), encoding="utf-8").read()
        for m in re.finditer(r'"t":"([^"]+)","co":"[^"]*",.*?"g":"([^"]*)"', js):
            ig = full_ig(m.group(2))
            if ig:
                known.setdefault(m.group(1) + " US Equity", ig)
    except OSError:
        pass

    # a year closing before Dec 31: price it to Dec 31 with the next year's opening price
    for i, y in enumerate(years[:-1]):
        nxt = years[i + 1]
        if y["close"] and y["close"][5:] != "12-31" and y["close"] < nxt["eff"]:
            p0 = {r["t"]: r["p0"] for r in nxt["rows"] if r["p0"]}
            n = 0
            for r in y["rows"]:
                if r["t"] in p0 and r["p0"]:
                    r["p1"] = p0[r["t"]]; r["r"] = r["p1"] / r["p0"] - 1; n += 1
            fixes.append(f"{y['eff']}: closed {y['close']}; {n} names re-priced to {nxt['eff']} with the next year's opening prices")
            y["close"] = nxt["eff"]

    # Bloomberg maps some historical holdings to a later ticker: the "MMED / MiniMed Group" rows
    # before MiniMed existed are Medtronic (MDT never appears in the sheet; same ~0.2-0.6% weight).
    # Such rows, and any unpriced row of a current S&P member, take that member's year return
    # from js/spx-data.js (same Bloomberg prices, year-end to year-end).
    ALIAS = {"MMED": ("MDT", "Medtronic PLC")}
    out_years = []
    print(f"{'year':6} {'names':>5} {'priced w%':>9} {'sum w*r':>8} {'SPY':>8} {'residual':>9}")
    for y in years:
        yr = str(int(y["close"][:4])) if y["close"] and y["close"][5:] != "01-01" else y["eff"][:4]
        if y["close"] is None:
            yr = cutoff[:4]
        hold, resid_names, wtot = [], [], 0.0
        for r in y["rows"]:
            t = str(r["t"] or "")
            if r["w"] is None:
                continue
            wtot += r["w"]
            tk = re.sub(r"\s+US Equity$", "", t)
            if tk in ALIAS:
                tk, r["co"] = ALIAS[tk]; t = tk + " US Equity"; r["r"] = None
            if r["r"] is None and tk in member_r and member_r[tk].get("r" + str(int(yr))[2:]) is not None:
                r["r"] = member_r[tk]["r" + str(int(yr))[2:]] / 100
                fixes.append(f"{yr}: {tk} priced with its S&P member return ({r['r'] * 100:+.2f}%)")
            if not t.endswith("Equity") or r["r"] is None:
                resid_names.append((t, r["co"], round(r["w"], 3)))
                continue
            ig = full_ig(r["g"]) or known.get(t)
            sec = IG_SECTOR.get(ig) if ig else (r["s"] if r["s"] and not str(r["s"]).startswith("#") else None)
            tk = re.sub(r"\s+US Equity$", "", t)
            hold.append(dict(t=tk, co=names_hand.get(tk, r["co"]), w=r["w"], r=r["r"] * 100, s=sec or "Unclassified", g=ig or "Unclassified"))
        for h in hold:
            h["w"] = round(h["w"] / wtot * 100, 6)
            h["r"] = round(h["r"], 4)
        sumc = sum(h["w"] * h["r"] / 100 for h in hold)
        spy = spy_ann.get(yr)
        resid = None if spy is None else spy - sumc
        priced = sum(h["w"] for h in hold)
        print(f"{yr:6} {len(hold):5d} {priced:9.2f} {sumc:+8.2f} {spy if spy is not None else float('nan'):+8.2f} {resid if resid is not None else float('nan'):+9.2f}")
        if resid_names:
            print("        no return / not equity:", ", ".join(f"{t.split(' ')[0]} {w}" for t, _, w in sorted(resid_names, key=lambda x: -x[2])[:12]))
        out_years.append(dict(year=int(yr), eff=y["eff"], close=y["close"] or cutoff, spy=spy, residual=round(resid, 4) if resid is not None else None,
                              unpriced=[dict(t=t.split(" ")[0], co=co, w=w) for t, co, w in resid_names], holdings=hold))
    print("\nfixes:")
    for f in fixes:
        print("  - " + f)
    unc = sorted({h["t"] for y in out_years for h in y["holdings"] if h["s"] == "Unclassified"})
    if unc:
        print(f"  - {len(unc)} names with no GICS (shown as Unclassified): {', '.join(unc)}")
    if not a.write:
        print("\n(dry run: add --write)")
        return
    data = {"source": os.path.basename(a.xlsx), "asOf": cutoff, "years": out_years}
    with open(OUT, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("// Generated by scripts/spx/extract_spx_holdings.py from " + data["source"] + " -- do not edit by hand.\n")
        fh.write("export const SPX_HOLDINGS = " + json.dumps(data, separators=(",", ":"), ensure_ascii=False) + ";\n")
    print(f"wrote {os.path.relpath(OUT, ROOT)} ({os.path.getsize(OUT) // 1024} KB)")


if __name__ == "__main__":
    main()
