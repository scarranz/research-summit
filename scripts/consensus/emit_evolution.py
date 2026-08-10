"""Emit the SUMMIT rows of the `evolution` block from Summit-MCP snapshot dumps.

Contract: docs/RESULTS_CONVENTIONS.md 3.6a. Companion to emit_summit_matrix.py, which builds
`estMatrix` (forward periods only). This one is the OPPOSITE read of the same dumps: for every
fiscal year on the evolution axis it takes what each snapshot STORED for that year, forward or
already reported, because that is what the Estimates pane plots — how the model's own view of a
year moved across its saved files.

    py emit_evolution.py UBER map_summit_uber.json <dump-dir>
    # -> out/evolution_uber.js

⚠ For an already-reported year the stored value is NOT the release. On UBER, `REV` and `EBITDA`
are overwritten with the reported figure after the print (52,017 / 8,730), but the segment rows
keep the model's own build-up and drift away from it — Mobility GB reads 97,641 in the Dec 2025
file and 99,228 in the Aug 2026 one against a 97,497 release. That is the provenance rule in the
contract ("ALWAYS the value stored in that vintage block, never the reported actual"), and it is
why the script reports the gap against the dataset's own `act` row rather than hiding it: a line
whose stored FY does not tie to the release must say so in its note.

The pull that feeds this must cover ALL years on the axis, reported ones included:
    get_fundamentals(ticker, snapshot_date=<vintage>, sheet_sources=['projection_history'],
                     metric_ids=[...], period_keys=['2024', ..., '2030'])
"""

import json
import os
import re
import sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, "..", ".."))


def load_rows(path):
    with open(path, "r", encoding="utf-8") as fh:
        blob = json.load(fh)
    if isinstance(blob, dict) and "result" in blob and isinstance(blob["result"], str):
        blob = json.loads(blob["result"])
    return blob.get("data", [])


def collect(dump_dir, prefer):
    """(snapshot, year, METRIC_LABEL) -> value. Annual rows only; zeros dropped."""
    vals, rank = {}, {name: i for i, name in enumerate(prefer)}
    for name in sorted(os.listdir(dump_dir)):
        if not name.lower().endswith((".txt", ".json")):
            continue
        for row in load_rows(os.path.join(dump_dir, name)):
            if row.get("sheet_source") != "projection_history":
                continue
            per = row.get("period_key", "")
            if not re.match(r"^\d{4}$", per):
                continue
            try:
                value = float(row["value"])
            except (TypeError, ValueError):
                continue
            if value == 0:
                continue
            key = (row["snapshot_date"], per, row["metric_label"])
            src = row.get("source")
            if key in vals and rank.get(src, 99) >= rank.get(vals[key][1], 99):
                continue
            vals[key] = (value, src)
    return {k: v[0] for k, v in vals.items()}


def shipped_act(js, mkey):
    """The dataset's own annual `act` row, to measure a stored FY against the release."""
    vi = js.index("\n    y: {")
    blk = js[vi:js.index("\n  },", vi)]
    mi = blk.find("\n        %s: {" % mkey)
    if mi < 0:
        return {}, []
    mb = blk[mi:mi + 2000]
    per = re.search(r"periods:\s*\[([^\]]*)\]", mb)
    act = re.search(r"act:\s*\[([^\]]*)\]", mb)
    if not per or not act:
        return {}, []
    ps = [p.strip().strip("'\"") for p in per.group(1).split(",") if p.strip()]
    av = [None if a.strip() == "null" else float(a) for a in act.group(1).split(",") if a.strip()]
    return dict(zip(ps, av)), ps


def main():
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    ticker, cfg_path, dump_dir = sys.argv[1], sys.argv[2], sys.argv[3]
    cfg = json.load(open(cfg_path, encoding="utf-8"))
    evo = cfg["evolution"]
    years, prior_year = evo["years"], evo["prior"]
    vintages = [v["id"] for v in cfg["vintages"]]
    metrics, derived = cfg["metrics"], cfg.get("derived", {})
    decimals, dec_default = cfg.get("decimals", {}), cfg.get("decimals", {}).get("_default", 1)

    vals = collect(dump_dir, cfg.get("prefer_source", []))
    js = open(os.path.join(REPO, "js", "results-data", "%s.js" % ticker.lower()), encoding="utf-8").read()

    def value_at(mkey, snap, year):
        if mkey in derived:
            parts = [vals.get((snap, year, lbl)) for lbl in derived[mkey]]
            return sum(parts) if all(p is not None for p in parts) else None
        return vals.get((snap, year, metrics[mkey]))

    def fmt(v, dec):
        if v is None:
            return "null"
        out = round(v, dec)
        return repr(int(out)) if out == int(out) else repr(out)

    lines, notes = [], []
    for mkey in evo["keys"]:
        dec = decimals.get(mkey, dec_default)
        rows = []
        for year in years:
            rows.append("[" + ", ".join(fmt(value_at(mkey, s, year), dec) for s in vintages) + "]")
        prior = [value_at(mkey, s, prior_year) for s in vintages]
        meta = evo["labels"].get(mkey, {})
        lines.append("      %s: { label: '%s', unit: '%s'," % (mkey, meta.get("label", mkey), meta.get("unit", "usdM")))
        lines.append("        summit: [%s]," % ", ".join(rows))
        lines.append("        cons: null,")
        if meta.get("prior", False):
            lines.append("        prior: { summit: [%s] }," % ", ".join(fmt(p, dec) for p in prior))
        lines.append("        note: '' },")

        # Does the stored value for an already-reported year tie to the release?
        acts, _ = shipped_act(js, mkey)
        for year in years:
            a = acts.get(year)
            if a is None:
                continue
            for snap in vintages:
                v = value_at(mkey, snap, year)
                if v is None:
                    continue
                gap = (v - a) / abs(a) * 100
                if abs(gap) > 0.5:
                    notes.append("%-7s FY%s @ %s: stored %s vs reported %s  (%+.1f%%)"
                                 % (mkey, year, snap, fmt(v, dec), fmt(a, dec), gap))

    out_dir = os.path.join(HERE, "out")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "evolution_%s.js" % ticker.lower())
    open(out_path, "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print("wrote %s (%d metrics, %d years x %d vintages)"
          % (out_path, len(evo["keys"]), len(years), len(vintages)))

    print("\n=== stored FY vs the release (gaps over 0.5%) ===")
    if not notes:
        print("  none — every stored fiscal year ties to its reported figure")
    for n in notes:
        print("  " + n)


if __name__ == "__main__":
    main()
