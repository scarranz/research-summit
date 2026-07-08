import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const MASSIVE_API = "https://api.massive.com";
const MASSIVE_KEY = Deno.env.get("MASSIVE_API_KEY") || "";

// Margins proxy. Fetches Massive's annual income + cash-flow statements server-side
// (API key injected here), joins them by fiscal year, and returns computed
// profitability & cash margins (% of revenue) as an ascending series. Used by the
// company Overviews' Margins box. No DB write — computed on the fly, like get-quote.
const ALLOWED_ORIGINS = ["https://research-summit.netlify.app", "http://localhost:8000"];
function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

const TICKER_RE = /^[A-Z0-9.\-]{1,10}$/;
const num = (v: unknown): number | null => (typeof v === "number" && isFinite(v)) ? v : null;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(req), "Content-Type": "application/json" } });

  // Verify the caller is an authenticated user
  const authToken = (req.headers.get("authorization") || "").replace("Bearer ", "");
  if (!authToken) return json({ error: "Unauthorized" }, 401);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data: { user }, error: authErr } = await supabase.auth.getUser(authToken);
  if (authErr || !user) return json({ error: "Unauthorized" }, 401);

  try {
    // Accept ?ticker=NVDA&limit=20 (GET) or { ticker, limit } (POST).
    const u = new URL(req.url);
    let ticker = u.searchParams.get("ticker") || "";
    let limit = parseInt(u.searchParams.get("limit") || "", 10);
    if (req.method === "POST") {
      try {
        const b = await req.json();
        ticker = ticker || (b?.ticker || "");
        if (!isFinite(limit)) limit = parseInt(String(b?.limit ?? ""), 10);
      } catch { /* ignore */ }
    }
    ticker = ticker.toUpperCase();
    if (!TICKER_RE.test(ticker)) return json({ error: "Invalid or missing ticker" }, 400);
    limit = Math.min(Math.max(isFinite(limit) ? limit : 20, 1), 50);

    async function statement(kind: "income-statements" | "cash-flow-statements") {
      const url = `${MASSIVE_API}/stocks/financials/v1/${kind}?tickers=${ticker}&timeframe=annual&limit=${limit}&sort=fiscal_year.desc`;
      const resp = await fetch(url, { headers: { Authorization: `Bearer ${MASSIVE_KEY}` } });
      if (!resp.ok) return [];
      const data = await resp.json().catch(() => ({}));
      return Array.isArray((data as { results?: unknown[] })?.results) ? (data as { results: unknown[] }).results : [];
    }

    const [inc, cf] = await Promise.all([statement("income-statements"), statement("cash-flow-statements")]);
    if (!inc.length) return json({ ticker, results: [] });

    const cfByYr: Record<number, Record<string, unknown>> = {};
    for (const r of cf as Record<string, unknown>[]) {
      const fy = r?.fiscal_year as number | undefined;
      if (fy != null) cfByYr[fy] = r;
    }

    const pct = (x: number | null, rev: number) => x == null ? null : Math.round((x / rev) * 1000) / 10;
    const rows = (inc as Record<string, unknown>[]).map((r) => {
      const rev = num(r.revenue);
      if (!rev) return null;
      const fy = r.fiscal_year as number;
      const c = cfByYr[fy] || {};
      const op = num(r.operating_income);
      let ni = num(r.consolidated_net_income_loss);
      if (ni == null) ni = num(r.net_income_loss_attributable_common_shareholders);
      const cfo = num(c.net_cash_from_operating_activities);
      const capex = num(c.purchase_of_property_plant_and_equipment);
      const dna = num(c.depreciation_depletion_and_amortization);
      return {
        fiscal_year: fy,
        fy: "FY" + String(fy).slice(-2),
        gross: pct(num(r.gross_profit), rev),
        oper: pct(op, rev),
        net: pct(ni, rev),
        ebitda: (op != null && dna != null) ? pct(op + dna, rev) : null,
        cfo: pct(cfo, rev),
        fcf: (cfo != null && capex != null) ? pct(cfo - Math.abs(capex), rev) : null,
      };
    }).filter(Boolean).sort((a, b) => (a!.fiscal_year) - (b!.fiscal_year));

    return json({ ticker, results: rows });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
