# Company overviews — Veeva (VEEV) and Sprouts (SFM)

Standalone research dashboards for SAB, outside the portal (Nov 18 2026). Same engine as the
SpaceX deep dive: `css/portal.css` (Summit portal look), `js/core.js` (`chartBlock`: clickable legend
that also hides the series from the table/totals, drag-to-zoom on both axes, data-table dropdown),
`js/data.js` (the frozen data pack), `js/views/<id>.js` (one file per view).

- `research/veeva/index.html` — The business · Where it is today · How it evolved · Vault CRM & growth · What to watch
- `research/sprouts/index.html` — The business · Where it is today · How it evolved · Growth engine · What to watch
- `pack/data.json` + `pack/notes.md` — the data packs, built only from SEC filings (10-K, 10-Q, 8-K Ex. 99.1);
  every block names its filing/accession in `sources`. Neither company is in the Summit MCP or BBG_CONSENSUS.

Open `index.html` directly in a browser (classic scripts, works from file://). No valuation yet, on purpose.
Working copies also live in SAB's Drive: `Summit\Docs\Extras\Team\SAB\Company Analisys\<Company>\`.
To change a number: edit `pack/data.json`, then re-embed it in `js/data.js` (`const VD = …` / `const SD = …`).
