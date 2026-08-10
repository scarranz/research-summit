// investor-13f-parser.js — parses 13F holdings from either the raw SEC
// EDGAR "information table" XML, or a CSV/TSV export from an aggregator
// (WhaleWisdom, Fintel, Dataroma, ...). Runs entirely client-side: no
// server round trip, no AI — the numbers are exactly what's in the file.
//
// SEC XML carries CUSIP, not ticker, so tickers are best-effort matched
// against ALL_STOCKS (portal-data.js) by company name; unmatched rows are
// left blank for the user to fill in in the upload preview. Aggregator
// CSVs already carry a resolved ticker, so no guessing is needed there.
import { ALL_STOCKS } from './portal-data.js';

function normalizeName(s) {
  return String(s || '')
    .toUpperCase()
    .replace(/\b(INC|CORP|CORPORATION|CO|LTD|LLC|LP|PLC|HOLDINGS?|GROUP|COMMON|SHARES?|CL\s?[A-Z]|CLASS\s?[A-Z])\b/g, '')
    .replace(/[^A-Z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function guessTicker(companyName) {
  var norm = normalizeName(companyName);
  if (!norm) return '';
  var hit = ALL_STOCKS.find(function(s) { return normalizeName(s.n) === norm; });
  if (hit) return hit.t;
  hit = ALL_STOCKS.find(function(s) {
    var sn = normalizeName(s.n);
    return sn && (norm.indexOf(sn) === 0 || sn.indexOf(norm) === 0);
  });
  return hit ? hit.t : '';
}

export function detectFormat(filename, text) {
  var head = text.slice(0, 500);
  if (/\.xml$/i.test(filename || '') || /^\s*<\?xml|<informationTable/i.test(head)) return 'sec_xml';
  return 'aggregator_csv';
}

// ─── SEC EDGAR "information table" XML ────────────────────────
// Note: SEC requires <value> in whole dollars for filings covering
// periods from 2023 onward (older filings used thousands). weight_pct
// is a ratio, so it's unaffected either way; value_usd is stored as-is
// from the file for reference.

export function parseSec13FXml(text) {
  var doc = new DOMParser().parseFromString(text, 'text/xml');
  if (doc.querySelector('parsererror')) {
    throw new Error('Could not parse this as XML — is it the SEC 13F "information table" file?');
  }
  var infoTables = [];
  doc.querySelectorAll('*').forEach(function(el) { if (el.localName === 'infoTable') infoTables.push(el); });
  if (!infoTables.length) {
    throw new Error('No <infoTable> rows found — make sure this is the information table XML, not the cover page.');
  }

  function fieldText(el, localName) {
    var found = null;
    el.querySelectorAll('*').forEach(function(c) { if (!found && c.localName === localName) found = c; });
    return found ? found.textContent.trim() : '';
  }

  var byCusip = {};
  infoTables.forEach(function(el) {
    var name = fieldText(el, 'nameOfIssuer');
    var cusip = fieldText(el, 'cusip');
    var value = parseFloat(fieldText(el, 'value').replace(/,/g, '')) || 0;
    var shares = parseFloat(fieldText(el, 'sshPrnamt').replace(/,/g, '')) || 0;
    var key = cusip || name;
    if (!key) return;
    if (!byCusip[key]) byCusip[key] = { companyName: name, cusip: cusip, valueUsd: 0, shares: 0 };
    byCusip[key].valueUsd += value;
    byCusip[key].shares += shares;
  });

  var rows = Object.keys(byCusip).map(function(k) { return byCusip[k]; });
  var total = rows.reduce(function(s, r) { return s + r.valueUsd; }, 0) || 1;
  rows.forEach(function(r) {
    r.weightPct = +(r.valueUsd / total * 100).toFixed(2);
    r.ticker = guessTicker(r.companyName);
  });
  rows.sort(function(a, b) { return b.valueUsd - a.valueUsd; });
  return rows;
}

// ─── Aggregator CSV (WhaleWisdom / Fintel / Dataroma / ...) ──
// Tolerant of common header spellings; needs at least a ticker or
// company column to be usable.

function splitDelimitedLine(line, delim) {
  var out = [], cur = '', inQ = false;
  for (var i = 0; i < line.length; i++) {
    var c = line[i];
    if (inQ) {
      if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else inQ = false; }
      else cur += c;
    } else if (c === '"') { inQ = true; }
    else if (c === delim) { out.push(cur); cur = ''; }
    else { cur += c; }
  }
  out.push(cur);
  return out;
}

var COL_ALIASES = {
  ticker: ['ticker', 'symbol', 'stock'],
  company: ['company', 'name', 'security', 'issuer', 'holding', 'stockname'],
  weight: ['%portfolio', 'weight', '%ofportfolio', 'portfolio%', 'pct', '%port'],
  value: ['value', 'marketvalue', 'value000', 'valueusd', 'reportedvalue', 'value$'],
};

function matchCol(headers, aliases) {
  for (var i = 0; i < headers.length; i++) {
    var h = headers[i].toLowerCase().replace(/[^a-z%]/g, '');
    if (aliases.indexOf(h) !== -1) return i;
  }
  return -1;
}

export function parseAggregatorCsv(text) {
  var lines = text.split(/\r?\n/).filter(function(l) { return l.trim().length; });
  if (lines.length < 2) throw new Error('This file does not look like a holdings CSV (need a header row plus data rows).');
  var delim = lines[0].indexOf('\t') !== -1 ? '\t' : ',';
  var headers = splitDelimitedLine(lines[0], delim);
  var tickerCol = matchCol(headers, COL_ALIASES.ticker);
  var companyCol = matchCol(headers, COL_ALIASES.company);
  var weightCol = matchCol(headers, COL_ALIASES.weight);
  var valueCol = matchCol(headers, COL_ALIASES.value);
  if (tickerCol === -1 && companyCol === -1) throw new Error('Could not find a Ticker or Company column in this CSV.');

  var rows = lines.slice(1).map(function(line) {
    var cells = splitDelimitedLine(line, delim);
    var ticker = tickerCol !== -1 ? (cells[tickerCol] || '').trim().toUpperCase() : '';
    var company = companyCol !== -1 ? (cells[companyCol] || '').trim() : '';
    var weightPct = weightCol !== -1 ? parseFloat(String(cells[weightCol]).replace(/[%,]/g, '')) : null;
    var valueUsd = valueCol !== -1 ? parseFloat(String(cells[valueCol]).replace(/[$,]/g, '')) : null;
    return { ticker: ticker, companyName: company || ticker, cusip: '', valueUsd: valueUsd || 0, weightPct: weightPct };
  }).filter(function(r) { return r.ticker || r.companyName; });

  if (weightCol === -1) {
    var total = rows.reduce(function(s, r) { return s + (r.valueUsd || 0); }, 0) || 1;
    rows.forEach(function(r) { r.weightPct = +((r.valueUsd || 0) / total * 100).toFixed(2); });
  } else {
    rows.forEach(function(r) { r.weightPct = r.weightPct == null || isNaN(r.weightPct) ? 0 : +r.weightPct.toFixed(2); });
  }
  rows.sort(function(a, b) { return b.weightPct - a.weightPct; });
  return rows;
}

export function parse13FFile(filename, text) {
  var format = detectFormat(filename, text);
  var rows = format === 'sec_xml' ? parseSec13FXml(text) : parseAggregatorCsv(text);
  return { format: format, rows: rows };
}
