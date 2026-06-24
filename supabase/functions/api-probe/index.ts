// api-probe — one-shot capability probe for our external data APIs.
//
// PURPOSE: tell us, definitively, WHICH endpoints each API key actually unlocks
// on OUR plan, ACROSS several tickers — instead of guessing from the vendor's
// website/docs. For each provider + ticker it hits a list of candidate endpoints
// (the ones we already use, plus the ones we'd like: estimates, fundamentals,
// prices, news…) and reports the HTTP status + the field names that came back.
// It NEVER returns the API keys.
//
// This is a temporary diagnostic. Deploy it, run it once, read the JSON, then
// it can be deleted. See docs/api-capability-probe.md for the full runbook.
//
// Auth: requires header `x-probe-token` to equal the PROBE_TOKEN secret, so the
// endpoint can't be enumerated by anyone holding the public anon key.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = ["https://research-summit.netlify.app", "http://localhost:8000"];
function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-probe-token",
  };
}

// Strip any key that leaked into a URL before we echo it back.
function sanitize(url: string) {
  return url.replace(/([?&](apiKey|apikey|token|api_key)=)[^&]+/gi, "$1***");
}

// Hit one endpoint, summarize the shape of what came back (no full payloads).
async function probe(name: string, url: string, headers: Record<string, string>) {
  const out: Record<string, unknown> = { name, url: sanitize(url) };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 9000);
    const r = await fetch(url, { headers, signal: ctrl.signal });
    clearTimeout(t);
    out.status = r.status;
    out.ok = r.ok;
    const txt = await r.text();
    try {
      const j = JSON.parse(txt);
      const arr = Array.isArray(j) ? j : (j.results || j.data || null);
      if (Array.isArray(arr)) {
        out.rows = arr.length;
        out.sample_keys = arr.length ? Object.keys(arr[0]).slice(0, 30) : [];
      } else {
        out.sample_keys = Object.keys(j).slice(0, 30);
      }
    } catch {
      out.body_snippet = txt.slice(0, 200);
    }
  } catch (e) {
    out.error = String((e as Error).message || e);
  }
  return out;
}

// Run every provider's candidate endpoints for ONE ticker.
async function probeTicker(ticker: string, keys: { fiscal: string; massive: string; polygon: string }) {
  const providers: Record<string, unknown> = {};

  // ── Fiscal.ai (X-Api-Key) ──
  if (keys.fiscal) {
    const fh = { "X-Api-Key": keys.fiscal };
    const base = "https://api.fiscal.ai";
    const cands: [string, string][] = [
      ["[known] insider/holders", `${base}/v1/company/ownership/insider/holders?ticker=${ticker}`],
      ["income-statement?", `${base}/v1/company/income-statement?ticker=${ticker}`],
      ["financials?", `${base}/v1/company/financials?ticker=${ticker}`],
      ["fundamentals?", `${base}/v1/company/fundamentals?ticker=${ticker}`],
      ["metrics?", `${base}/v1/company/metrics?ticker=${ticker}`],
      ["estimates?", `${base}/v1/company/estimates?ticker=${ticker}`],
      ["profile?", `${base}/v1/company/profile?ticker=${ticker}`],
    ];
    providers.fiscal_ai = await Promise.all(cands.map(([n, url]) => probe(n, url, fh)));
  }

  // ── Massive / Benzinga (Bearer) ──
  if (keys.massive) {
    const mh = { "Authorization": `Bearer ${keys.massive}` };
    const base = "https://api.massive.com";
    const cands: [string, string][] = [
      ["[known] ratings", `${base}/benzinga/v1/ratings?ticker=${ticker}&limit=1`],
      ["estimates?", `${base}/benzinga/v1/estimates?ticker=${ticker}`],
      ["earnings?", `${base}/benzinga/v1/earnings?ticker=${ticker}`],
      ["dividends?", `${base}/benzinga/v1/dividends?ticker=${ticker}`],
      ["price-targets?", `${base}/benzinga/v1/price-targets?ticker=${ticker}`],
      ["news?", `${base}/benzinga/v1/news?tickers=${ticker}`],
    ];
    providers.massive = await Promise.all(cands.map(([n, url]) => probe(n, url, mh)));
  }

  // ── Polygon (apiKey query param) ──
  if (keys.polygon) {
    const base = "https://api.polygon.io";
    const cands: [string, string][] = [
      ["prev-close", `${base}/v2/aggs/ticker/${ticker}/prev?apiKey=${keys.polygon}`],
      ["reference-ticker", `${base}/v3/reference/tickers/${ticker}?apiKey=${keys.polygon}`],
      ["last-trade", `${base}/v2/last/trade/${ticker}?apiKey=${keys.polygon}`],
      ["financials", `${base}/vX/reference/financials?ticker=${ticker}&apiKey=${keys.polygon}`],
    ];
    providers.polygon = await Promise.all(cands.map(([n, url]) => probe(n, url, {})));
  }

  return providers;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });

  const PROBE_TOKEN = Deno.env.get("PROBE_TOKEN") || "";
  if (!PROBE_TOKEN) {
    return new Response(JSON.stringify({
      error: "PROBE_TOKEN secret is not set. Set it first: supabase secrets set PROBE_TOKEN=<any-random-string> --project-ref bvflqjndivouhgwqfbrq",
    }), { status: 400, headers: { ...corsHeaders(req), "Content-Type": "application/json" } });
  }
  if (req.headers.get("x-probe-token") !== PROBE_TOKEN) {
    return new Response(JSON.stringify({ error: "Missing or wrong x-probe-token header." }), {
      status: 401, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }

  // Tickers to probe (comma-separated). Default: the ones we're weighing.
  const u = new URL(req.url);
  // Default = the 22 companies in the portal (provided by the team). Override with ?tickers=...
  const raw = (u.searchParams.get("tickers") || "GOOGL,AMZN,TBBB,AVGO,PAC,CART,IBKR,LYFT,MA,META,MSFT,NVDA,RELY,SPGI,SE,SOFI,SPOT,SYM,TPL,UBER,V,VITL").toUpperCase();
  const tickers = raw.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 30);
  for (const t of tickers) {
    if (!/^[A-Z0-9.\-]{1,10}$/.test(t)) {
      return new Response(JSON.stringify({ error: `Invalid ticker: ${t}` }), {
        status: 400, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }
  }

  const keys = {
    fiscal: Deno.env.get("FISCAL_AI_API_KEY") || "",
    massive: Deno.env.get("MASSIVE_API_KEY") || "",
    polygon: Deno.env.get("POLYGON_API_KEY") || "",
  };

  const report: Record<string, unknown> = {
    tickers,
    note: "Capability probe — per ticker, read status + sample_keys per endpoint. Keys never returned.",
    keys_present: { fiscal_ai: !!keys.fiscal, massive: !!keys.massive, polygon: !!keys.polygon },
    results: [] as unknown[],
  };

  // Probe in small parallel batches so the run stays well under the time limit.
  const BATCH = 4;
  for (let i = 0; i < tickers.length; i += BATCH) {
    const group = tickers.slice(i, i + BATCH);
    const res = await Promise.all(group.map(async (t) => ({ ticker: t, providers: await probeTicker(t, keys) })));
    (report.results as unknown[]).push(...res);
  }

  return new Response(JSON.stringify(report, null, 2), {
    headers: { ...corsHeaders(req), "Content-Type": "application/json" },
  });
});
