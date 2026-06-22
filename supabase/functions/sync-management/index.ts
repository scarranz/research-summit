import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = ["https://research-summit.netlify.app", "http://localhost:8000"];
function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

const FISCAL_API = "https://api.fiscal.ai";
const FISCAL_KEY = Deno.env.get("FISCAL_AI_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

async function fiscalGet(path: string, params: Record<string, string>) {
  const url = new URL(path, FISCAL_API);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const resp = await fetch(url.toString(), {
    headers: { "X-Api-Key": FISCAL_KEY },
  });
  if (!resp.ok) {
    const body = await resp.text();
    // Check if it's a plan limitation (company not available)
    if (body.includes("not available") || body.includes("free plan") || body.includes("upgrade")) {
      return { data: [], _unavailable: true };
    }
    throw new Error(`Fiscal.ai ${resp.status}: ${body}`);
  }
  return resp.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }

  try {
    const { ticker, companyId } = await req.json();
    if (!ticker || !companyId) {
      return new Response(JSON.stringify({ error: "ticker and companyId are required" }), {
        status: 400,
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }
    if (ticker.length > 10 || !/^[A-Za-z0-9.\-]+$/.test(ticker)) {
      return new Response(JSON.stringify({ error: "Invalid ticker format" }), {
        status: 400, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }
    if (!/^[0-9a-f\-]{36}$/.test(companyId)) {
      return new Response(JSON.stringify({ error: "Invalid companyId format" }), {
        status: 400, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // ─── 1. Fetch insider holders from Fiscal.ai ────────────
    const holdersResp = await fiscalGet("/v1/company/ownership/insider/holders", {
      ticker: ticker.toUpperCase(),
      pageSize: "50",
    });

    const holders = (holdersResp.data || [])
      .filter((h: any) => h.isActive)
      .map((h: any, i: number) => ({
        company_id: companyId,
        name: h.holderName,
        role: h.title || "—",
        shares: h.sharesHeldTotal ? Math.round(h.sharesHeldTotal) : null,
        ownership_pct: h.percentOfSharesOutstanding
          ? Math.round(h.percentOfSharesOutstanding * 100) / 100
          : null,
        sort_order: i + 1,
      }));

    // Clear existing executives for this company, then insert fresh
    if (holders.length) {
      await supabase.from("company_executives").delete().eq("company_id", companyId);
      const { error: insErr } = await supabase.from("company_executives").insert(holders);
      if (insErr) throw new Error(`Insert executives: ${insErr.message}`);
    }

    // ─── 2. Fetch insider transactions from Fiscal.ai ───────
    const txResp = await fiscalGet("/v1/company/ownership/insider/transactions", {
      ticker: ticker.toUpperCase(),
      pageSize: "50",
    });

    // Only keep actual purchases and sales (skip derivative exercises, tax withholding, gifts)
    const buyTypes = ["Purchase", "Open Market Purchase"];
    const sellTypes = ["Sale", "Open Market Sale"];

    const txns = (txResp.data || [])
      .filter((t: any) => {
        const tt = t.transactionType || "";
        return buyTypes.some(b => tt.includes(b)) || sellTypes.some(s => tt.includes(s));
      })
      .slice(0, 30) // Keep last 30 transactions
      .map((t: any, i: number) => {
        const tt = t.transactionType || "";
        const isBuy = buyTypes.some(b => tt.includes(b));
        return {
          company_id: companyId,
          person_name: t.holderName,
          transaction_type: isBuy ? "buy" : "sell",
          transaction_date: t.transactionDate || t.filingDate,
          shares: t.shares || 0,
          price_per_share: t.priceLow || t.priceHigh || null,
          sort_order: i + 1,
        };
      });

    // Clear existing transactions for this company, then insert fresh
    await supabase.from("insider_transactions").delete().eq("company_id", companyId);
    if (txns.length) {
      const { error: txErr } = await supabase.from("insider_transactions").insert(txns);
      if (txErr) throw new Error(`Insert transactions: ${txErr.message}`);
    }

    const unavailable = holdersResp._unavailable || txResp._unavailable;

    return new Response(JSON.stringify({
      success: true,
      executives: holders.length,
      transactions: txns.length,
      unavailable: unavailable || false,
    }), {
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
