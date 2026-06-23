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
