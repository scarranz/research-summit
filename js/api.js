// api.js — Data access layer
// All database queries go through this module. Today it talks to Supabase
// directly. When the project moves to the Summit API, swap the internals
// here and nothing else changes.
import { supabase } from './supabase-client.js';

// ─── Response envelope ──────────────────────────────────────
// Matches Oscar's API pattern: { success, data, error }

function ok(data) { return { success: true, data: data, error: null }; }
function fail(msg) { return { success: false, data: null, error: { message: msg } }; }

// ─── Companies ──────────────────────────────────────────────

export async function fetchCompanies() {
  var { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('status', 'active')
    .order('name');
  if (error) return fail(error.message);
  return ok(data || []);
}

export async function insertCompany(row) {
  var { data, error } = await supabase
    .from('companies')
    .insert([row])
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

// ─── Company Executives ─────────────────────────────────────

export async function fetchExecutives(companyId) {
  var { data, error } = await supabase
    .from('company_executives')
    .select('*')
    .eq('company_id', companyId)
    .order('sort_order');
  if (error) return fail(error.message);
  return ok(data || []);
}

// ─── Insider Transactions ────────────────────────────────────

export async function fetchInsiderTransactions(companyId) {
  var { data, error } = await supabase
    .from('insider_transactions')
    .select('*')
    .eq('company_id', companyId)
    .order('transaction_date', { ascending: false });
  if (error) return fail(error.message);
  return ok(data || []);
}

// ─── Analyst Ratings ─────────────────────────────────────────

export async function fetchAnalystRatings(companyId) {
  var { data, error } = await supabase
    .from('analyst_ratings')
    .select('*')
    .eq('company_id', companyId)
    .order('date', { ascending: false });
  if (error) return fail(error.message);
  return ok(data || []);
}

export async function syncRatings(ticker, companyId) {
  var { data, error } = await supabase.functions.invoke('sync-ratings', {
    body: { ticker: ticker, companyId: companyId },
  });
  if (error) return fail(error.message);
  return ok(data);
}

// ─── Company Segments (Fiscal.ai) ────────────────────────────

export async function fetchSegments(companyId) {
  var { data, error } = await supabase
    .from('company_segments')
    .select('*')
    .eq('company_id', companyId)
    .order('segment_group')
    .order('sort_order');
  if (error) return fail(error.message);
  return ok(data || []);
}

export async function syncSegments(ticker, companyId) {
  var { data, error } = await supabase.functions.invoke('sync-segments', {
    body: { ticker: ticker, companyId: companyId },
  });
  if (error) return fail(error.message);
  return ok(data);
}

// ─── Sync Management (Fiscal.ai) ─────────────────────────────

export async function syncManagement(ticker, companyId) {
  var { data, error } = await supabase.functions.invoke('sync-management', {
    body: { ticker: ticker, companyId: companyId },
  });
  if (error) return fail(error.message);
  return ok(data);
}

// ─── Company Search (Fiscal.ai) ──────────────────────────────

export async function searchCompany(query) {
  var { data, error } = await supabase.functions.invoke('search-company', {
    body: { query: query },
  });
  if (error) return fail(error.message);
  return ok(data && data.data ? data.data : []);
}

// ─── Ticker Lookup ──────────────────────────────────────────

export async function lookupTicker(ticker) {
  var { data, error } = await supabase.functions.invoke('lookup-ticker', {
    body: { ticker: ticker },
  });
  if (error) return fail(error.message);
  return ok(data);
}

// ─── Covered Calls (Massive option chain proxy) ──────────────
// Forwards one allowlisted resource to Massive via the covered-calls-massive
// edge function (key injected server-side). Returns the raw Massive JSON.

export async function coveredCallsQuote(resource, ticker, params) {
  var { data, error } = await supabase.functions.invoke('covered-calls-massive', {
    body: { resource: resource, ticker: ticker, params: params || {} },
  });
  if (error) return fail(error.message);
  return ok(data);
}

// Live market data for a ticker via Massive (covered-calls-massive). Combines
// snapshot (live quote) + details (shares outstanding) + ratios (market cap / EV).
// Market cap is computed price × shares (most current), falling back to
// ratios.market_cap. Net debt = enterprise_value − market_cap (negative = net cash).
// Returns { price, changePct, marketCap, ev, netDebt, shares } with null for any
// unavailable field; data is null if no price could be sourced. Single source of
// truth for live quotes (used by the company header and per-company Overviews).
export async function liveQuote(ticker) {
  function num(v) { return (typeof v === 'number' && isFinite(v)) ? v : null; }
  async function mf(resource) {
    var r = await coveredCallsQuote(resource, ticker).catch(function () { return null; });
    return (r && r.success) ? r.data : null;
  }
  var parts = await Promise.all([mf('snapshot'), mf('ratios'), mf('details')]);
  var snap = parts[0], rat = parts[1], det = parts[2];
  var tk = snap && (snap.ticker || (snap.results && snap.results.ticker));
  var price = tk ? (num(tk.lastTrade && tk.lastTrade.p) || num(tk.min && tk.min.c) || num(tk.day && tk.day.c) || num(tk.prevDay && tk.prevDay.c)) : null;
  var r0 = (rat && rat.results && rat.results[0]) || {};
  var d0 = (det && det.results) || {};
  if (price == null) price = num(r0.price);
  if (price == null) return ok(null);
  var shares = num(d0.weighted_shares_outstanding) || num(d0.share_class_shares_outstanding);
  var marketCap = (shares != null) ? price * shares : num(r0.market_cap);
  var ev = num(r0.enterprise_value);
  var netDebt = (ev != null && marketCap != null) ? ev - marketCap : null;
  return ok({ price: price, changePct: tk ? num(tk.todaysChangePerc) : null, marketCap: marketCap, ev: ev, netDebt: netDebt, shares: shares });
}

// Historical margins for a ticker, computed from Massive's income + cash-flow
// statements (via covered-calls-massive). Returns { success, data } where data is an
// ascending-by-year array of { fy, gross, oper, net, ebitda, cfo, fcf } (margins as %,
// one decimal) — or a failure envelope if Massive has no data (caller keeps its
// fallback). Requires the edge function to allowlist `income-statements` and
// `cash-flow-statements` (deploy-gated). Margins are unit-free so scaling is irrelevant.
export async function fetchMargins(ticker) {
  function num(v) { return (typeof v === 'number' && isFinite(v)) ? v : null; }
  async function pull(resource) {
    var r = await coveredCallsQuote(resource, ticker, { timeframe: 'annual', limit: 20 }).catch(function () { return null; });
    return (r && r.success && r.data && Array.isArray(r.data.results)) ? r.data.results : null;
  }
  var parts = await Promise.all([pull('income-statements'), pull('cash-flow-statements')]);
  var inc = parts[0], cf = parts[1];
  if (!inc || !inc.length) return fail('no Massive income-statement data');
  var cfByYr = {};
  (cf || []).forEach(function (r) { if (r && r.fiscal_year != null) cfByYr[r.fiscal_year] = r; });
  var rows = inc.map(function (r) {
    var rev = num(r.revenue); if (!rev) return null;
    var fy = r.fiscal_year, c = cfByYr[fy] || {};
    var op = num(r.operating_income);
    var ni = num(r.consolidated_net_income_loss);
    if (ni == null) ni = num(r.net_income_loss_attributable_common_shareholders);
    var cfo = num(c.net_cash_from_operating_activities);
    var capex = num(c.purchase_of_property_plant_and_equipment);
    var dna = num(c.depreciation_depletion_and_amortization);
    var pct = function (x) { return x == null ? null : Math.round((x / rev) * 1000) / 10; };
    return {
      _y: fy,
      fy: 'FY' + String(fy).slice(-2),
      gross: pct(num(r.gross_profit)),
      oper: pct(op),
      net: pct(ni),
      ebitda: (op != null && dna != null) ? pct(op + dna) : null,
      cfo: pct(cfo),
      fcf: (cfo != null && capex != null) ? pct(cfo - Math.abs(capex)) : null,
    };
  }).filter(Boolean);
  if (!rows.length) return fail('no usable Massive rows');
  rows.sort(function (a, b) { return a._y - b._y; });
  if (rows.length > 12) rows = rows.slice(rows.length - 12);   // cap the history we surface
  return ok(rows);
}

// ─── Company Resources ──────────────────────────────────────

export async function fetchResources(companyId) {
  var { data, error } = await supabase
    .from('company_resources')
    .select('*')
    .eq('company_id', companyId)
    .order('category')
    .order('sort_order');
  if (error) return fail(error.message);
  return ok(data || []);
}

export async function insertResource(row) {
  var { data, error } = await supabase
    .from('company_resources')
    .insert([row])
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function updateResource(id, updates) {
  var { data, error } = await supabase
    .from('company_resources')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function deleteResource(id) {
  var { error } = await supabase
    .from('company_resources')
    .delete()
    .eq('id', id);
  if (error) return fail(error.message);
  return ok(null);
}

export async function uploadFile(filePath, file) {
  var { data, error } = await supabase.storage
    .from('company-files')
    .upload(filePath, file);
  if (error) return fail(error.message);
  return ok(data);
}

export async function getFileUrl(filePath) {
  var { data, error } = await supabase.storage
    .from('company-files')
    .createSignedUrl(filePath, 3600);
  if (error) return fail(error.message);
  return ok(data);
}

// ─── Fund Returns ───────────────────────────────────────────
// Daily series for the Performance Analysis dashboard. Tables are RLS-gated,
// so only authenticated users can read them. Rows exceed PostgREST's 1000-row
// page limit, so fetch them in pages.

async function fetchAllRows(table, build) {
  const pageSize = 1000;
  let from = 0, all = [];
  for (;;) {
    let q = build(supabase.from(table).select('*'));
    q = q.range(from, from + pageSize - 1);
    var { data, error } = await q;
    if (error) return fail(error.message);
    all = all.concat(data || []);
    if (!data || data.length < pageSize) break;
    from += pageSize;
  }
  return ok(all);
}

export async function fetchFundReturns(portfolio) {
  return fetchAllRows('fund_daily_returns', q => q.eq('portfolio', portfolio || 'STRATEGY').order('date'));
}

export async function fetchBenchmarkPrices(symbol) {
  return fetchAllRows('benchmark_prices', q => q.eq('symbol', symbol || 'SPY').order('date'));
}

// ─── Auth ───────────────────────────────────────────────────

export async function fetchUserRole(userId) {
  var { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function backfillUserRole() {
  var { error } = await supabase.rpc('backfill_user_role_on_login');
  if (error) return fail(error.message);
  return ok(null);
}
