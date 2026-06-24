# Covered Calls dashboard — local dev server + Massive proxy.
#
# Serves the dashboard files AND proxies requests to Massive, injecting the API
# key server-side so it never reaches the browser (no CORS, no key leak).
#
# The key is read from covered-calls/.massive-key (gitignored) or $env:MASSIVE_API_KEY.
#
# Run:   powershell -File covered-calls/server.ps1
# Open:  http://localhost:8091/
#
param([int]$Port = 8091)

$root = $PSScriptRoot

# ── Load the Massive key (file first, then env var) ───────────────────────────
$keyFile = Join-Path $root ".massive-key"
$MassiveKey = $env:MASSIVE_API_KEY
if (Test-Path $keyFile) { $MassiveKey = (Get-Content $keyFile -Raw).Trim() }
if (-not $MassiveKey) { Write-Error "No Massive key. Put it in covered-calls/.massive-key or set `$env:MASSIVE_API_KEY"; exit 1 }

$MASSIVE = "https://api.massive.com"

# ── Allowlist: resource -> Massive path. Only endpoints our plan is entitled to.
# {t}=ticker. Options resources read extra query params off the request.
function Resolve-Route([string]$resource, [string]$t, [System.Collections.Specialized.NameValueCollection]$qs) {
  switch ($resource) {
    # --- equities (price, fundamentals for valuation) ---
    "details"   { return "/v3/reference/tickers/$t" }
    "snapshot"  { return "/v2/snapshot/locale/us/markets/stocks/tickers/$t" }
    "ratios"    { return "/stocks/financials/v1/ratios?ticker=$t&limit=1" }

    # --- FX previous close (foreign-currency valuation → USD). $t is a pair like EURUSD/USDMXN ---
    "fx"        { return "/v2/aggs/ticker/C:$t/prev?adjusted=true" }

    # --- options chain snapshot (premium, IV, greeks, OI) ---
    # Pass-through of a curated set of filters.
    "chain" {
      $p = @()
      foreach ($k in @("contract_type","expiration_date","strike_price","strike_price.gte","strike_price.lte","limit","order","sort")) {
        $v = $qs[$k]
        if ($v) { $p += "$k=" + [Uri]::EscapeDataString($v) }
      }
      $query = if ($p.Count) { "?" + ($p -join "&") } else { "" }
      return "/v3/snapshot/options/$t$query"
    }

    # --- available expirations / strikes (reference contracts) ---
    "expirations" {
      $p = @("underlying_ticker=$t", "contract_type=call", "expired=false", "limit=1000", "sort=expiration_date", "order=asc")
      foreach ($k in @("expiration_date.gte","expiration_date.lte","strike_price.gte","strike_price.lte")) {
        $v = $qs[$k]
        if ($v) { $p += "$k=" + [Uri]::EscapeDataString($v) }
      }
      return "/v3/reference/options/contracts?" + ($p -join "&")
    }

    default { return $null }
  }
}

$mime = @{
  ".html"="text/html; charset=utf-8"; ".js"="text/javascript; charset=utf-8";
  ".mjs"="text/javascript; charset=utf-8"; ".css"="text/css; charset=utf-8";
  ".json"="application/json; charset=utf-8"; ".svg"="image/svg+xml"; ".ico"="image/x-icon";
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Covered Calls dashboard at http://localhost:$Port/  (key loaded, root: $root)" -ForegroundColor Green
Write-Host "Ctrl+C to stop." -ForegroundColor DarkGray

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  try {
    $path = $req.Url.AbsolutePath

    # ── API proxy ────────────────────────────────────────────────────────────
    if ($path -eq "/api/massive") {
      $resource = $req.QueryString["resource"]
      $ticker   = ($req.QueryString["ticker"]).ToUpper()

      $bad = $null
      if (-not $ticker -or $ticker -notmatch '^[A-Z0-9.\-]{1,10}$') { $bad = "invalid ticker" }
      $route = Resolve-Route $resource $ticker $req.QueryString
      if (-not $route) { $bad = "resource not allowed: $resource" }

      $res.AddHeader("Access-Control-Allow-Origin", "*")
      $res.ContentType = "application/json; charset=utf-8"
      if ($bad) {
        $res.StatusCode = 400
        $bytes = [Text.Encoding]::UTF8.GetBytes((@{ error = $bad } | ConvertTo-Json))
      } else {
        try {
          $r = Invoke-WebRequest -Uri ($MASSIVE + $route) -Headers @{ Authorization = "Bearer $MassiveKey" } -UseBasicParsing -ErrorAction Stop
          $res.StatusCode = 200
          $bytes = [Text.Encoding]::UTF8.GetBytes($r.Content)
        } catch {
          $code = 502; if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode }
          $body = ""; if ($_.ErrorDetails.Message) { $body = $_.ErrorDetails.Message }
          $res.StatusCode = $code
          $bytes = [Text.Encoding]::UTF8.GetBytes((@{ error = "massive $code"; body = $body } | ConvertTo-Json))
        }
      }
      $res.OutputStream.Write($bytes, 0, $bytes.Length); $res.Close(); continue
    }

    # ── Static files ─────────────────────────────────────────────────────────
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path $root ($path.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar))
    if (Test-Path $file -PathType Leaf) {
      $ext = [IO.Path]::GetExtension($file).ToLower()
      $res.ContentType = if ($mime[$ext]) { $mime[$ext] } else { "application/octet-stream" }
      $bytes = [IO.File]::ReadAllBytes($file)
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $res.Close()
  } catch {
    try { $res.StatusCode = 500; $res.Close() } catch {}
  }
}
