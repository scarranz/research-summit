#!/usr/bin/env python3
"""
extract_spx.py: the analyst's Bloomberg (BQL) workbook becomes js/spx-data.js for
Market Analysis > S&P 500.

Source: "SP500 Update for <month>.xlsx", three sheets. Blocks are found by their BQL
headers, not by fixed columns, so the analyst can move them around.

  SPX_MEMBERS   current SPX members, one row each:
                  id().value | name().value | classification_name(gics,1) |
                  classification_name(gics,2) | DATES <year-end dates ... cut-off>
                The DATES header row carries the dates; each member row carries
                px_last on those dates ('#N/A' = no price = the security did not trade yet).
  MEMBERSHIP    SPX members at each year-end, one column per date, as ID_BB_GLOBAL
                (composite_id_bb_global().value), plus a TICKER | BBG_ID map of the current members.
  SECTORS       DATES | SPX Index | S5INFT Index | ... month-end px_last (frq=cm); the
                last row is the cut-off.

Rules:
  - Every return is computed here from prices: price return, year-end to year-end, and
    last year-end to the cut-off for the current year.
  - Full-year rule (agreed with the analyst): a member's return counts for year Y (in the
    Positive / Beat filters, the sector counts, the scatter) only if it was in the SPX at
    the end of Y-1 AND at the end of Y (the current year: end of Y-1, it is a member today).
    Matched on the COMPOSITE Bloomberg ID, never ticker (an old ticker can belong to another company).
    The return is still stored; the page shows it as not eligible. m<yy> records the
    membership that year: 2 = whole year, 1 = part of it, 0 = not in the index.
  - GICS names are checked against gics.py: a truncated or unknown name is reported.
  - Sector levels come from the S&P 500 GICS sector indices, mapped by TICKER below.

Usage:
  python scripts/spx/extract_spx.py "<workbook.xlsx>"            # dry run: summary + warnings
  python scripts/spx/extract_spx.py "<workbook.xlsx>" --write    # write js/spx-data.js
"""
import argparse, datetime as dt, json, os, re, sys

import openpyxl

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gics  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_OUT = os.path.join(ROOT, "js", "spx-data.js")

# S&P 500 GICS sector indices (Bloomberg tickers) -> official GICS sector name
SECTOR_INDEX = {
    "S5ENRS": "Energy",
    "S5MATR": "Materials",
    "S5INDU": "Industrials",
    "S5COND": "Consumer Discretionary",
    "S5CONS": "Consumer Staples",
    "S5HLTH": "Health Care",
    "S5FINL": "Financials",
    "S5INFT": "Information Technology",
    "S5TELS": "Communication Services",
    "S5UTIL": "Utilities",
    "S5RLST": "Real Estate",
}

warnings = []


def warn(msg):
    warnings.append(msg)


def norm_ticker(raw):
    """'AAPL UW Equity' -> AAPL, 'BRK/B UN Equity' -> BRK.B, 'CBOE UF Equity' -> CBOE."""
    t = re.sub(r"\s+[A-Z]{2}\s+Equity$", "", str(raw).strip(), flags=re.I)
    return t.replace("/", ".").upper()


def num(v):
    return v if isinstance(v, (int, float)) and not isinstance(v, bool) else None


def iso(v):
    return v.strftime("%Y-%m-%d") if isinstance(v, (dt.datetime, dt.date)) else None


def sheet(wb, name):
    if name not in wb.sheetnames:
        sys.exit(f"sheet {name!r} not found (have {wb.sheetnames})")
    return [tuple(r) for r in wb[name].iter_rows(values_only=True)]


def find_cell(rows, pred, depth=8):
    for r, row in enumerate(rows[:depth]):
        for c, v in enumerate(row):
            if isinstance(v, str) and pred(v.strip()):
                return r, c
    return None, None


def read_members(rows):
    hr, c_id = find_cell(rows, lambda s: s == "id().value")
    if hr is None:
        sys.exit("SPX_MEMBERS: no 'id().value' header")
    hdr = [str(v).strip() if v is not None else "" for v in rows[hr]]

    def col(pred, label):
        for i, h in enumerate(hdr):
            if pred(h):
                return i
        sys.exit(f"SPX_MEMBERS: column {label} not found")

    c_name = col(lambda h: h.startswith("name()"), "name()")
    c_sec = col(lambda h: h.replace(" ", "") == "classification_name(gics,1)", "gics,1")
    c_ig = col(lambda h: h.replace(" ", "") == "classification_name(gics,2)", "gics,2")
    c_dates = col(lambda h: h == "DATES", "DATES")
    pcols = [(c, iso(rows[hr][c])) for c in range(c_dates + 1, len(rows[hr])) if iso(rows[hr][c])]
    if len(pcols) < 2:
        sys.exit("SPX_MEMBERS: no price dates after the DATES header")
    formula = next((str(r[c_dates]) for r in rows[hr + 1:] if r[c_dates]), "")

    members, seen = [], set()
    for row in rows[hr + 1:]:
        raw = row[c_id] if c_id < len(row) else None
        if not raw or not isinstance(raw, str) or "Equity" not in raw:
            continue
        if "W-W" in raw or "/W" in raw:
            warn(f"skipped {raw}: when-issued / warrant line, not a common share")
            continue
        t = norm_ticker(raw)
        if t in seen:
            warn(f"duplicate member {t}: kept the first row")
            continue
        seen.add(t)
        try:
            sec = gics.resolve(name=row[c_sec], table=gics.SECTORS)
            ig = gics.resolve(name=row[c_ig])
            ig_code = next(k for k, v in gics.INDUSTRY_GROUPS.items() if v == ig)
            if gics.sector_of(ig_code) != sec:
                warn(f"{t}: industry group {ig!r} is not under sector {sec!r}")
        except (ValueError, StopIteration) as e:
            warn(f"{t}: GICS not resolved ({e}); kept without sector")
            sec = ig = None
        px = {d: num(row[c]) for c, d in pcols}
        members.append({"t": t, "n": row[c_name], "s": sec, "ig": ig, "_raw": raw.strip(), "_px": px})
    return members, [d for _, d in pcols], formula


# The COMPOSITE id (one per security across US venues). The venue-level
# id_bb_global changes when a stock moves exchange (KHC, FITB: Nasdaq -> NYSE).
def is_id_hdr(h):
    if not isinstance(h, str):
        return False
    h = h.strip()
    if h.startswith("id_bb_global()"):
        warn("MEMBERSHIP uses venue-level id_bb_global(): use composite_id_bb_global()")
        return True
    return h.startswith("composite_id_bb_global()")


def read_membership(rows):
    hr, _ = find_cell(rows, is_id_hdr)
    if hr is None:
        sys.exit("MEMBERSHIP: no 'composite_id_bb_global().value' header")
    # Year-end lists: an id_bb_global column whose date sits in the row above.
    lists = {}
    for c, h in enumerate(rows[hr]):
        if is_id_hdr(h) and iso(rows[hr - 1][c]):
            ids = {r[c] for r in rows[hr + 1:] if c < len(r) and isinstance(r[c], str) and r[c].startswith("BBG")}
            lists[iso(rows[hr - 1][c])[:4]] = ids
    # Current-member map: TICKER (id().value) | BBG_ID (id_bb_global().value) side by side.
    c_tk = next((c for c, h in enumerate(rows[hr]) if h == "id().value"), None)
    if c_tk is None:
        sys.exit("MEMBERSHIP: no current TICKER (id().value) column")
    idmap = {}
    for r in rows[hr + 1:]:
        if c_tk + 1 < len(r) and isinstance(r[c_tk], str) and isinstance(r[c_tk + 1], str):
            idmap[r[c_tk].strip()] = r[c_tk + 1].strip()
    return lists, idmap


# SPDR Select Sector ETFs -> GICS sector; SPY is the ETF-side benchmark
SECTOR_ETF = {
    "XLE": "Energy",
    "XLB": "Materials",
    "XLI": "Industrials",
    "XLY": "Consumer Discretionary",
    "XLP": "Consumer Staples",
    "XLV": "Health Care",
    "XLF": "Financials",
    "XLK": "Information Technology",
    "XLC": "Communication Services",
    "XLU": "Utilities",
    "XLRE": "Real Estate",
}


def read_block(rows, hr, c_dates):
    """One DATES block of the SECTORS sheet: tickers in the row above, month-end prices below.
    Returns (kind, bench, dates, series) with kind 'index' (SPX + S5) or 'etf' (SPY + XL*)."""
    tick_row = rows[hr - 1]
    cols, kinds = {}, set()
    for c in range(c_dates + 1, len(tick_row)):
        h = tick_row[c]
        if not isinstance(h, str) or not h.strip():
            break
        key = re.sub(r"\s+(US\s+Equity|Index)$", "", h.strip(), flags=re.I).upper()
        if key in ("SPX", "SPY"):
            cols[key] = c; kinds.add("index" if key == "SPX" else "etf")
        elif key in SECTOR_INDEX:
            cols[SECTOR_INDEX[key]] = c; kinds.add("index")
        elif key in SECTOR_ETF:
            cols[SECTOR_ETF[key]] = c; kinds.add("etf")
        else:
            warn(f"SECTORS: unknown series {h!r} ignored")
    if len(kinds) != 1:
        sys.exit(f"SECTORS: a DATES block mixes or lacks index/ETF tickers ({kinds})")
    kind = kinds.pop()
    bench = "SPX" if kind == "index" else "SPY"
    missing = [m for m in [bench] + list(SECTOR_INDEX.values()) if m not in cols]
    if missing:
        sys.exit(f"SECTORS ({kind}): missing series {missing}")
    dates, series = [], {k: [] for k in cols}
    for row in rows[hr + 1:]:
        d = iso(row[c_dates]) if c_dates < len(row) else None
        if not d:
            continue
        dates.append(d)
        for k, c in cols.items():
            series[k].append(num(row[c] if c < len(row) else None))
    for k, vals in series.items():
        first = next((i for i, v in enumerate(vals) if v is not None), len(vals))
        gaps = [dates[i] for i in range(first, len(vals)) if vals[i] is None]
        if gaps:
            warn(f"SECTORS ({kind}) {k}: {len(gaps)} missing level(s), first {gaps[0]}")
        if first:
            print(f"note: SECTORS ({kind}) {k} starts {dates[first]} (no price before; that is n/a, not 0)")
    if dates != sorted(dates):
        sys.exit(f"SECTORS ({kind}): dates are not ascending")
    return kind, bench, dates, series


def read_levels(rows):
    """Both tables of the SECTORS sheet: S&P 500 sector indices and SPDR sector ETFs."""
    blocks = {}
    for r, row in enumerate(rows[:8]):
        for c, v in enumerate(row):
            if isinstance(v, str) and v.strip() == "DATES":
                kind, bench, dates, series = read_block(rows, r, c)
                blocks[kind] = {"bench": bench, "dates": dates, "series": series}
    if "index" not in blocks:
        sys.exit("SECTORS: no S&P 500 sector index table (SPX + S5xxxx)")
    return blocks


def read_spy_weights(rows, level_dates):
    """SECTORS_WEIGHTS: SPY's month-end holdings grouped by GICS sector,
    sum(group(id().weights, classification_name(gics,1))) on SPY US Equity, plus 'Residual'
    (cash / unclassified). Sector columns are matched by their GICS NAME in the top row;
    the ETF codes in the row below are only the analyst's lookup and are ignored."""
    hr, c_dates = find_cell(rows, lambda s: s == "DATES")
    if hr is None:
        sys.exit("SECTORS_WEIGHTS: no 'DATES' marker")
    cols, c_res = {}, None
    for r in range(0, hr):
        for c in range(c_dates + 1, min(len(rows[r]), c_dates + 20)):
            v = rows[r][c]
            if isinstance(v, str) and v.strip() in SECTOR_INDEX.values():
                cols[v.strip()] = c
            elif isinstance(v, str) and v.strip().lower() == "residual":
                c_res = c
    missing = [m for m in SECTOR_INDEX.values() if m not in cols]
    if missing:
        sys.exit(f"SECTORS_WEIGHTS: missing sectors {missing}")
    by_date = {}
    for row in rows[hr + 1:]:
        d = iso(row[c_dates]) if c_dates < len(row) else None
        if d:
            by_date[d] = row
    missing_dates = [d for d in level_dates if d not in by_date]
    if missing_dates:
        sys.exit(f"SECTORS_WEIGHTS: no weights for {missing_dates[:3]}...")
    series = {k: [num(by_date[d][c]) for d in level_dates] for k, c in cols.items()}
    resid = [num(by_date[d][c_res]) if c_res is not None else None for d in level_dates]
    return {"dates": level_dates, "series": series, "residual": resid}


def annual(dates, vals):
    """Calendar-year price returns from month-end levels; the last year is YTD."""
    by_year_end = {}
    for d, v in zip(dates, vals):
        if v is not None:
            by_year_end[d[:4]] = v
    out, years = {}, sorted(by_year_end)
    for prev, y in zip(years, years[1:]):
        out[y] = round((by_year_end[y] / by_year_end[prev] - 1) * 100, 2)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("xlsx")
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--out", default=DEFAULT_OUT)
    a = ap.parse_args()

    wb = openpyxl.load_workbook(a.xlsx, read_only=True, data_only=True)
    members, pdates, formula = read_members(sheet(wb, "SPX_MEMBERS"))
    lists, idmap = read_membership(sheet(wb, "MEMBERSHIP"))
    blocks = read_levels(sheet(wb, "SECTORS"))
    dates, series = blocks["index"]["dates"], blocks["index"]["series"]
    etf = blocks.get("etf")
    spy_w = read_spy_weights(sheet(wb, "SECTORS_WEIGHTS"), etf["dates"]) if etf and "SECTORS_WEIGHTS" in wb.sheetnames else None
    if spy_w is None:
        warn("no SECTORS_WEIGHTS (SPY sector weights): the SPY sector attribution will not show")
    if etf is None:
        warn("SECTORS has no SPDR ETF table: the page shows the sector indices only")

    if "today(" in formula:
        warn(f"member prices end at today(): {formula}")
    if not re.search(r"ca_adj\s*=", formula):
        warn("member price formula has no ca_adj: check corporate-action adjustment")
    as_of, year = pdates[-1], int(pdates[-1][:4])
    if dates[-1] != as_of:
        warn(f"sector levels end {dates[-1]} but member prices end {as_of}")

    # Returns: price on each date vs the previous date (year-ends, then the cut-off).
    years = [d[:4] for d in pdates]
    no_id, not_now = [], []
    for m in members:
        bid = idmap.get(m["_raw"])
        if not bid:
            no_id.append(m["t"])
        for i in range(1, len(pdates)):
            y, p0, p1 = years[i], m["_px"][pdates[i - 1]], m["_px"][pdates[i]]
            r = round((p1 / p0 - 1) * 100, 2) if p0 and p1 else None
            m["r" + y[2:]] = r
            # full-year membership: in the list at the end of y-1 and (past years) at the end of y
            in_start = bid in lists.get(str(int(y) - 1), set())
            in_end = True if int(y) == year else bid in lists.get(y, set())
            m["e" + y[2:]] = 1 if (r is not None and bid and in_start and in_end) else 0
            # membership that year: 2 = whole year, 1 = part of it (joined or left), 0 = not in the index
            m["m" + y[2:]] = 2 if (bid and in_start and in_end) else 1 if (bid and (in_start or in_end)) else 0
        if bid and str(year - 1) in lists and bid not in lists[str(year - 1)]:
            not_now.append(m["t"])
        m["c3"] = None
        r24, r25, r26 = m.get("r24"), m.get("r25"), m.get("r26")
        if None not in (r24, r25, r26):
            m["c3"] = round(((1 + r24 / 100) * (1 + r25 / 100) * (1 + r26 / 100) - 1) * 100, 2)
        del m["_px"], m["_raw"]
    if no_id:
        warn(f"{len(no_id)} member(s) with no BBG_ID in MEMBERSHIP (never eligible): {', '.join(no_id)}")
    # Exchange-level tickers / IDs break when a stock changes exchange: fill=prev repeats a
    # stale price, and the per-exchange ID_BB_GLOBAL changes so the history doesn't match.
    stale = [m["t"] for m in members if any(m.get("r" + y[2:]) == 0 for y in years[1:])]
    if stale:
        warn(f"{len(stale)} member(s) with a 0.00% year (stale fill=prev price; exchange-level ticker?): {', '.join(stale)}")
    first_y = str(int(years[0]))
    moved = [m["t"] for m in members
             if m.get("r" + years[1][2:]) is not None and not any(m.get("e" + y[2:]) for y in years[1:])
             and m["t"] not in not_now]
    if moved:
        warn(f"{len(moved)} member(s) priced for years but in no year-end list (ID changed?): {', '.join(moved)}")
    missing_years = [str(y) for y in range(int(years[0]), year) if str(y) not in lists]
    if missing_years:
        warn(f"MEMBERSHIP has no list for year-end(s) {missing_years}")

    ann = {k: annual(dates, v) for k, v in series.items()}
    # TEMPORARY EXCEPTION: scripts/spx/etf_ytd_overrides.json forces the sector ETFs' YTD
    # (see the file). The last level is rescaled so YTD = the forced figure; nothing else moves.
    etf_overrides = None
    ov_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "etf_ytd_overrides.json")
    if etf and os.path.exists(ov_path):
        ov = json.load(open(ov_path, encoding="utf-8"))
        if ov.get("asOf") == etf["dates"][-1] and ov.get("base") in etf["dates"]:
            i0, etf_overrides = etf["dates"].index(ov["base"]), {}
            for tk, y in ov["ytd"].items():
                sec = SECTOR_ETF[tk]; vals = etf["series"][sec]
                actual = vals[-1]; forced = round(vals[i0] * (1 + y / 100), 4)
                vals[-1] = forced
                etf_overrides[sec] = {"etf": tk, "ytd": y, "bloombergLast": actual, "usedLast": forced}
            warn(f"ETF YTD OVERRIDE ACTIVE ({len(etf_overrides)} sector ETFs, {ov['asOf']}): see scripts/spx/etf_ytd_overrides.json")
        else:
            warn(f"etf_ytd_overrides.json is for {ov.get('asOf')}, cut-off is {etf['dates'][-1]}: NOT applied")
    etf_ann = {k: annual(etf["dates"], v) for k, v in etf["series"].items()} if etf else None
    # Cross-check: SPX YTD from the levels vs the sector indices' own YTD.
    print(f"workbook   {os.path.basename(a.xlsx)}")
    print(f"members    {len(members)}  (GICS resolved: {sum(1 for m in members if m['s'])})")
    print(f"prices     {', '.join(pdates)}   formula: {formula}")
    print(f"membership year-ends {', '.join(sorted(lists))} · {len(idmap)} current IDs")
    print(f"levels     {len(dates)} month-ends {dates[0]} -> {dates[-1]}")
    print("SPX        " + "  ".join(f"{y} {r:+.2f}" for y, r in ann["SPX"].items()))
    print("eligible / with a return, by year:")
    for y in years[1:]:
        k = y[2:]
        withr = sum(1 for m in members if m.get("r" + k) is not None)
        el = sum(1 for m in members if m.get("e" + k))
        print(f"  {y}: {el} / {withr}")
    print(f"joined during {year} (not eligible for {year}): {len(not_now)}  {', '.join(sorted(not_now))}")
    print(f"\n{len(warnings)} warning(s)")
    for w in warnings:
        print("  ! " + w)

    if not a.write:
        print("\n(dry run, nothing written: add --write)")
        return
    out = {
        "asOf": as_of,
        "year": year,
        "source": os.path.basename(a.xlsx),
        "priceFormula": formula,
        "years": years[1:],
        "levels": {"dates": dates, "series": series},
        "annual": ann,
        # SPDR sector ETFs (same shape; benchmark SPY) for the Index / ETF toggle
        "etf": {"levels": {"dates": etf["dates"], "series": etf["series"]}, "annual": etf_ann,
                # internal only (never rendered): forced YTD, see scripts/spx/etf_ytd_overrides.json
                "_ytdOverrides": etf_overrides} if etf else None,
        # SPY month-end weights by GICS sector (from SPY's holdings) for the SPY sector attribution
        "spyWeights": spy_w,
        "members": members,
    }
    with open(a.out, "w", encoding="utf-8", newline="\n") as f:
        f.write("// Generated by scripts/spx/extract_spx.py from " + out["source"] + " -- do not edit by hand.\n")
        f.write("export const SPX_DATA = " + json.dumps(out, separators=(",", ":"), ensure_ascii=False) + ";\n")
    print(f"\nwrote {os.path.relpath(a.out, ROOT)} ({os.path.getsize(a.out) // 1024} KB)")


if __name__ == "__main__":
    main()
