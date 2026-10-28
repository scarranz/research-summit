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

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// SEC EDGAR requires every automated request to identify itself with a
// descriptive User-Agent (app name + a contact email) — this is exactly
// why the browser can't hit sec.gov directly (it won't let JS set a
// custom User-Agent, and EDGAR blocks/soft-403s requests that don't
// send one). This function exists only to be the one place that holds
// that identity and makes the request server-side.
const SEC_USER_AGENT = "Summit Management Research Portal admin@summit-mgmtx.com";

async function secGet(url: string) {
  const resp = await fetch(url, { headers: { "User-Agent": SEC_USER_AGENT, "Accept-Encoding": "identity" } });
  if (!resp.ok) throw new Error(`SEC EDGAR ${resp.status} for ${url}`);
  return resp;
}

function periodToYearQuarter(reportDate: string) {
  const [y, m] = reportDate.split("-").map((n) => parseInt(n, 10));
  return { year: y, quarter: Math.ceil(m / 3) };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }

  // Verify the caller is an authenticated user
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
  const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data: { user }, error: authErr } = await supabaseAuth.auth.getUser(token);
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }

  try {
    const { cik } = await req.json();
    if (!cik || !/^\d{10}$/.test(cik)) {
      return new Response(JSON.stringify({ error: "cik must be a 10-digit SEC EDGAR CIK, e.g. 0001336528" }), {
        status: 400, headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // ─── 1. Find the most recent 13F-HR filing for this CIK ───────
    const subResp = await secGet(`https://data.sec.gov/submissions/CIK${cik}.json`);
    const sub = await subResp.json();
    const recent = sub.filings?.recent;
    if (!recent) throw new Error("No filings on file for this CIK.");

    let best: { date: string; reportDate: string; accession: string } | null = null;
    for (let i = 0; i < recent.form.length; i++) {
      if (recent.form[i] !== "13F-HR") continue;
      if (!best || recent.filingDate[i] > best.date) {
        best = { date: recent.filingDate[i], reportDate: recent.reportDate[i], accession: recent.accessionNumber[i] };
      }
    }
    if (!best) throw new Error("No 13F-HR filings found for this CIK.");

    // ─── 2. Find the information-table XML inside that filing ─────
    const accessionNoDashes = best.accession.replace(/-/g, "");
    const cikNumeric = String(parseInt(cik, 10));
    const filingDirUrl = `https://www.sec.gov/Archives/edgar/data/${cikNumeric}/${accessionNoDashes}/`;
    const idxResp = await secGet(filingDirUrl);
    const idxHtml = await idxResp.text();
    const xmlMatches = [...idxHtml.matchAll(/href="([^"]+\.xml)"/gi)].map((m) => m[1]);
    const infoTablePath = xmlMatches.find((p) => !/primary_doc/i.test(p));
    if (!infoTablePath) throw new Error("Could not find the information table inside this filing.");
    const xmlUrl = infoTablePath.startsWith("http") ? infoTablePath : `https://www.sec.gov${infoTablePath}`;

    // ─── 3. Fetch the raw information-table XML ────────────────────
    const xmlResp = await secGet(xmlUrl);
    const xml = await xmlResp.text();

    const { year, quarter } = periodToYearQuarter(best.reportDate);

    return new Response(JSON.stringify({
      success: true,
      year, quarter,
      periodOfReport: best.reportDate,
      filedDate: best.date,
      accessionNumber: best.accession,
      xml,
    }), {
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
