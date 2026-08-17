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

// ─── Earnings Call Transcripts (Fiscal.ai) ──────────────────
// Generic for any ticker the Fiscal.ai plan covers. A response with
// data.unavailable === true means the company is not on our current tier.

export async function listIrEvents(ticker) {
  var { data, error } = await supabase.functions.invoke('get-transcript', {
    body: { ticker: ticker },
  });
  if (error) return fail(error.message);
  return ok(data);
}

export async function fetchTranscript(ticker, eventKey) {
  var { data, error } = await supabase.functions.invoke('get-transcript', {
    body: { ticker: ticker, eventKey: eventKey },
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

// ─── Investment tab ───────────────────────────────────────────

export async function fetchInvestmentSectors() {
  var { data, error } = await supabase
    .from('investment_sectors')
    .select('*')
    .order('sort_order');
  if (error) return fail(error.message);
  return ok(data || []);
}

export async function insertInvestmentSector(row) {
  var { data, error } = await supabase
    .from('investment_sectors')
    .insert([row])
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function fetchInvestmentCompanies() {
  var { data, error } = await supabase
    .from('investment_companies')
    .select('*')
    .eq('status', 'active')
    .order('sort_order');
  if (error) return fail(error.message);
  return ok(data || []);
}

export async function insertInvestmentCompany(row) {
  var { data, error } = await supabase
    .from('investment_companies')
    .insert([row])
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function updateInvestmentCompany(id, updates) {
  var { data, error } = await supabase
    .from('investment_companies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function generateInvestmentWriteup(ticker, name, sector) {
  var { data, error } = await supabase.functions.invoke('generate-investment-writeup', {
    body: { ticker: ticker, name: name, sector: sector },
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

// Historical margins for a ticker via the `get-margins` edge function (which pulls
// Massive's income + cash-flow statements server-side and computes the ratios).
// Returns { success, data } where data is an ascending-by-year array of
// { fy, _y, gross, oper, net, ebitda, cfo, fcf } (margins as %, one decimal) — or a
// failure envelope if there's no data (caller keeps its fallback). Deploy-gated on the
// get-margins function existing.
export async function fetchMargins(ticker) {
  var { data, error } = await supabase.functions.invoke('get-margins', { body: { ticker: ticker, limit: 20 } });
  if (error) return fail(error.message);
  var results = (data && Array.isArray(data.results)) ? data.results : [];
  if (!results.length) return fail('no margin data');
  var rows = results.map(function (r) {
    return { fy: r.fy, _y: r.fiscal_year, gross: r.gross, oper: r.oper, net: r.net, ebitda: r.ebitda, cfo: r.cfo, fcf: r.fcf };
  });
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

// ─── Company Themes (Earnings ▸ Watch List) ─────────────────
// Durable persistence for the Watch List / Themes machinery (was the in-memory
// WL_ROWS array in the overview modules). One shared table, scoped by company_id.
// See sql/010_company_themes.sql and docs/EARNINGS_CONVENTIONS.md §6f.

export async function fetchThemes(companyId) {
  var { data, error } = await supabase
    .from('company_themes')
    .select('*')
    .eq('company_id', companyId)
    .order('q')
    .order('rank');
  if (error) return fail(error.message);
  return ok(data || []);
}

export async function insertTheme(row) {
  var { data, error } = await supabase
    .from('company_themes')
    .insert([row])
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function updateTheme(id, updates) {
  var { data, error } = await supabase
    .from('company_themes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function deleteTheme(id) {
  var { error } = await supabase
    .from('company_themes')
    .delete()
    .eq('id', id);
  if (error) return fail(error.message);
  return ok(null);
}

// ─── Company Theme RECORD (AMZN-style segmented Notes) ───────
// The AMZN Notes tab is a SEGMENTED theme record with per-quarter note items — a richer shape than
// the flat company_themes rows, so it persists as ONE JSONB blob per company (load on mount, save on
// every edit) so a refresh — and the rest of the team — see the same record.
// See sql/011_company_theme_record.sql.
export async function fetchThemeRecord(companyId) {
  var { data, error } = await supabase
    .from('company_theme_record')
    .select('record')
    .eq('company_id', companyId)
    .maybeSingle();
  if (error) return fail(error.message);
  return ok(data ? data.record : null);
}

export async function saveThemeRecord(companyId, ticker, record) {
  var { data, error } = await supabase
    .from('company_theme_record')
    .upsert({ company_id: companyId, ticker: ticker, record: record, updated_at: new Date().toISOString() }, { onConflict: 'company_id' })
    .select()
    .single();
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

// ─── Investor Profiles (Hedge Funds tab) ─────────────────────
// Per-year depth behind each investor card: yearly returns, that
// year's top holdings, and annual letters / investor messages.
// investor_key matches INVESTORS[].key in js/portal-data.js.
// See sql/014_investor_profiles.sql.

export async function fetchInvestorReturns(investorKey) {
  var { data, error } = await supabase
    .from('investor_yearly_returns')
    .select('*')
    .eq('investor_key', investorKey)
    .order('year');
  if (error) return fail(error.message);
  return ok(data || []);
}

export async function fetchInvestorHoldings(investorKey) {
  var { data, error } = await supabase
    .from('investor_yearly_holdings')
    .select('*')
    .eq('investor_key', investorKey)
    .order('year')
    .order('rank');
  if (error) return fail(error.message);
  return ok(data || []);
}

export async function fetchInvestorLetters(investorKey) {
  var { data, error } = await supabase
    .from('investor_letters')
    .select('*')
    .eq('investor_key', investorKey)
    .order('category')
    .order('sort_order');
  if (error) return fail(error.message);
  return ok(data || []);
}

export async function insertInvestorReturn(row) {
  var { data, error } = await supabase
    .from('investor_yearly_returns')
    .insert([row])
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function insertInvestorHolding(row) {
  var { data, error } = await supabase
    .from('investor_yearly_holdings')
    .insert([row])
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

// Replaces every holdings row for one investor_key+year+quarter with a
// fresh batch — used by the "Upload 13F" flow so re-uploading a quarter
// (e.g. an amended filing) doesn't leave stale rows behind.
export async function replaceInvestorHoldings(investorKey, year, quarter, rows) {
  var del = supabase
    .from('investor_yearly_holdings')
    .delete()
    .eq('investor_key', investorKey)
    .eq('year', year);
  del = quarter == null ? del.is('quarter', null) : del.eq('quarter', quarter);
  var { error: delError } = await del;
  if (delError) return fail(delError.message);

  if (!rows.length) return ok([]);
  var { data, error } = await supabase
    .from('investor_yearly_holdings')
    .insert(rows)
    .select();
  if (error) return fail(error.message);
  return ok(data || []);
}

export async function insertInvestorLetter(row) {
  var { data, error } = await supabase
    .from('investor_letters')
    .insert([row])
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

// Fetches the latest 13F-HR filing for an investor straight from SEC
// EDGAR (via the sync-13f edge function, which is the only thing
// allowed to make that request — see supabase/functions/sync-13f).
// Returns { year, quarter, periodOfReport, filedDate, accessionNumber,
// xml } — xml is the raw information-table XML, parsed client-side with
// parseSec13FXml() exactly like an uploaded file.
export async function syncLatest13F(cik) {
  var { data, error } = await supabase.functions.invoke('sync-13f', {
    body: { cik: cik },
  });
  if (error) return fail(error.message);
  return ok(data);
}

export async function deleteInvestorLetter(id) {
  var { error } = await supabase
    .from('investor_letters')
    .delete()
    .eq('id', id);
  if (error) return fail(error.message);
  return ok(null);
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
