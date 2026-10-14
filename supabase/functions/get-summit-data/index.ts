import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const SUMMIT_MCP_URL = Deno.env.get("SUMMIT_MCP_URL") || "";
const SUMMIT_MCP_TOKEN = Deno.env.get("SUMMIT_MCP_TOKEN") || "";

// Summit DCF model reader. Lets the portal read the Summit Financial Data base LIVE (the same data
// the "Summit Financial Data" MCP serves to Claude), so model numbers are never copied into js/.
// No AI is involved: this function is a plain MCP client — it calls the MCP server's own read-only
// tools over HTTP (JSON-RPC `tools/call`) and passes their JSON back. Nothing is written anywhere.
//
// Why through the MCP and not straight to its database: the MCP server already owns the queries
// (snapshots, facts, metric catalog) and we don't know its schema from this repo. If San prefers
// to read the database directly, only `callSummit()` changes — the routes and the response shape
// the portal sees stay the same.
//
// Secrets (San sets them; never in code):
//   SUMMIT_MCP_URL   — the MCP server's HTTP endpoint (streamable HTTP transport)
//   SUMMIT_MCP_TOKEN — a read-only service token for it, sent as `Authorization: Bearer`
//
// Routes (`resource` in the POST body) — an allowlist; each maps to exactly one MCP tool:
//   models       {}                                   → list_dcf_models
//   snapshots    {ticker}                             → list_snapshots         (newest first)
//   metrics      {ticker}                             → list_metrics           (label ↔ metric_id)
//   snapshot     {ticker, date}                       → get_snapshot           (every fact; heavy)
//   fundamentals {ticker, date?, metric_ids?, period_keys?, sheet_sources?}
//                                                     → get_fundamentals       (≥ 1 filter required)
//   series       {metric_id, period_key}              → get_metric_snapshot_series (one cell's revisions)
//
// Gotcha for callers: every metric comes once per sheet. `actuals_history` carries FUTURE periods
// as 0 (not null) — always filter by `sheet_source` (projection_history for estimates).
// Units/scale in the metric catalog are not reliable (every metric says USD · millions · sum, even
// TAX_RATE or SHARES): the portal reads units from each company's js/summit-map/<ticker>.js,
// written once per company (docs/PROFILE_PLAYBOOK.md §6.3), not from this response.
const ALLOWED_ORIGINS = ["https://research-summit.netlify.app", "http://localhost:8000"];
function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const TICKER_RE = /^[A-Z0-9.\-]{1,10}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PERIOD_RE = /^\d{4}(Q[1-4])?$/;
const SHEETS = ["projection_history", "actuals_history"];
const MAX_LIST = 200;

// ─── MCP client (streamable HTTP) ───────────────────────────
// initialize → notifications/initialized → tools/call. The server may answer with plain JSON or
// with an SSE stream; both are handled. A session id, if the server issues one, is echoed back.
async function mcpPost(payload: unknown, sessionId: string | null) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream",
    "Authorization": `Bearer ${SUMMIT_MCP_TOKEN}`,
  };
  if (sessionId) headers["Mcp-Session-Id"] = sessionId;
  const resp = await fetch(SUMMIT_MCP_URL, { method: "POST", headers, body: JSON.stringify(payload) });
  return resp;
}

async function readRpc(resp: Response, id: number) {
  const text = await resp.text();
  if (!resp.ok) throw new Error(`MCP HTTP ${resp.status}: ${text.slice(0, 200)}`);
  const ctype = resp.headers.get("content-type") || "";
  const messages: any[] = [];
  if (ctype.includes("text/event-stream")) {
    for (const line of text.split("\n")) {
      if (line.startsWith("data:")) {
        try { messages.push(JSON.parse(line.slice(5).trim())); } catch { /* keep-alive / partial line */ }
      }
    }
  } else if (text.trim()) {
    messages.push(JSON.parse(text));
  }
  const msg = messages.find((m) => m && m.id === id);
  if (!msg) throw new Error("MCP: no response for request " + id);
  if (msg.error) throw new Error("MCP error: " + (msg.error.message || JSON.stringify(msg.error)));
  return msg.result;
}

async function callSummit(tool: string, args: Record<string, unknown>) {
  const init = await mcpPost({
    jsonrpc: "2.0", id: 1, method: "initialize",
    params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "research-summit/get-summit-data", version: "1.0" } },
  }, null);
  const sessionId = init.headers.get("mcp-session-id");
  await readRpc(init, 1);
  await mcpPost({ jsonrpc: "2.0", method: "notifications/initialized" }, sessionId);

  const result = await readRpc(await mcpPost({
    jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: tool, arguments: args },
  }, sessionId), 2);
  if (result?.isError) throw new Error("Summit tool error: " + (result.content?.[0]?.text || tool));

  // The Summit tools return one text block holding JSON — sometimes wrapped once more as
  // {"result": "<json string>"}. Unwrap to { data, metadata, warnings }.
  let out: any = result?.structuredContent ?? JSON.parse(result?.content?.[0]?.text ?? "null");
  if (out && typeof out.result === "string") out = JSON.parse(out.result);
  if (out?.metadata) delete out.metadata._instructions;   // LLM-facing citation hint; not for the portal
  return out;
}

// ─── Request → one allowlisted tool call ────────────────────
function route(body: any): { tool: string; args: Record<string, unknown> } | { error: string } {
  const resource = String(body.resource || "");
  const ticker = String(body.ticker || "").toUpperCase();
  const needTicker = () => TICKER_RE.test(ticker);

  if (resource === "models") return { tool: "list_dcf_models", args: {} };
  if (resource === "snapshots") return needTicker() ? { tool: "list_snapshots", args: { ticker } } : { error: "invalid ticker" };
  if (resource === "metrics") return needTicker() ? { tool: "list_metrics", args: { ticker } } : { error: "invalid ticker" };

  if (resource === "snapshot") {
    if (!needTicker()) return { error: "invalid ticker" };
    const date = String(body.date || "");
    if (!DATE_RE.test(date)) return { error: "invalid date (expect YYYY-MM-DD)" };
    return { tool: "get_snapshot", args: { ticker, snapshot_date: date } };
  }

  if (resource === "fundamentals") {
    if (!needTicker()) return { error: "invalid ticker" };
    const args: Record<string, unknown> = { ticker };
    if (body.date != null) {
      if (!DATE_RE.test(String(body.date))) return { error: "invalid date (expect YYYY-MM-DD)" };
      args.snapshot_date = String(body.date);
    }
    const list = (v: unknown, re: RegExp | null, allowed: string[] | null) => {
      if (v == null) return null;
      if (!Array.isArray(v) || !v.length || v.length > MAX_LIST) return undefined;
      const s = v.map(String);
      if (s.some((x) => (re && !re.test(x)) || (allowed && !allowed.includes(x)))) return undefined;
      return s;
    };
    const ids = list(body.metric_ids, UUID_RE, null);
    const periods = list(body.period_keys, PERIOD_RE, null);
    const sheets = list(body.sheet_sources, null, SHEETS);
    if (ids === undefined) return { error: "invalid metric_ids (UUIDs from resource 'metrics')" };
    if (periods === undefined) return { error: "invalid period_keys (YYYY or YYYYQn)" };
    if (sheets === undefined) return { error: "invalid sheet_sources (" + SHEETS.join(" | ") + ")" };
    if (ids) args.metric_ids = ids;
    if (periods) args.period_keys = periods;
    if (sheets) args.sheet_sources = sheets;
    if (!ids && !periods && !args.snapshot_date) return { error: "give at least one of metric_ids, period_keys, date" };
    return { tool: "get_fundamentals", args };
  }

  if (resource === "series") {
    const metricId = String(body.metric_id || "");
    const periodKey = String(body.period_key || "");
    if (!UUID_RE.test(metricId)) return { error: "invalid metric_id" };
    if (!PERIOD_RE.test(periodKey)) return { error: "invalid period_key (YYYY or YYYYQn)" };
    return { tool: "get_metric_snapshot_series", args: { metric_id: metricId, period_key: periodKey } };
  }

  return { error: `resource not allowed: ${resource}` };
}

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

  if (!SUMMIT_MCP_URL || !SUMMIT_MCP_TOKEN) return json({ error: "Summit source not configured (SUMMIT_MCP_URL / SUMMIT_MCP_TOKEN)" }, 503);

  try {
    const body = await req.json().catch(() => ({}));
    const r = route(body);
    if ("error" in r) return json({ error: r.error }, 400);
    return json(await callSummit(r.tool, r.args));
  } catch (err) {
    return json({ error: (err as Error).message }, 502);
  }
});
