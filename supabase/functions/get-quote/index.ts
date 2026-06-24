import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Live quote proxy. Fetches a real-time-ish price from Yahoo Finance server-side
// (avoids browser CORS) and returns a small JSON payload. Used by the SoFi
// Overview's Sensitivity / valuation views to drive live multiples.
const ALLOWED_ORIGINS = ["https://research-summit.netlify.app", "http://localhost:8000"];
function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });

  try {
    // Accept ?ticker=SOFI (GET) or { ticker } (POST).
    const u = new URL(req.url);
    let ticker = u.searchParams.get("ticker") || "";
    if (!ticker && req.method === "POST") {
      try { ticker = (await req.json())?.ticker || ""; } catch { /* ignore */ }
    }
    ticker = ticker.toUpperCase();
    if (!ticker || !/^[A-Z0-9.\-]{1,10}$/.test(ticker)) {
      return json({ error: "Invalid or missing ticker" }, 400);
    }

    // v8 chart endpoint returns a live price in result[0].meta without needing a crumb.
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
    const resp = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!resp.ok) throw new Error(`Yahoo returned ${resp.status}`);

    const data = await resp.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta || typeof meta.regularMarketPrice !== "number") {
      return json({ error: "No price for ticker" }, 404);
    }

    const price = meta.regularMarketPrice;
    const prev = (typeof meta.previousClose === "number" ? meta.previousClose
      : typeof meta.chartPreviousClose === "number" ? meta.chartPreviousClose : null);
    const change = prev != null ? price - prev : null;
    const changePct = prev ? (price / prev - 1) * 100 : null;

    return json({
      ticker,
      price,
      previousClose: prev,
      change,
      changePct,
      currency: meta.currency || "USD",
      marketState: meta.marketState || null,
      exchange: meta.exchangeName || null,
      time: meta.regularMarketTime || null,
    });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
