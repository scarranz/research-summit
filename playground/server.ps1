# Multiples Playground — local dev server + Massive proxy.
#
# Serves the playground files AND proxies requests to Massive, injecting the
# API key server-side so it never reaches the browser (no CORS, no key leak).
#
# The key is read from playground/.massive-key (gitignored) or $env:MASSIVE_API_KEY.
#
# Run:   pwsh playground/server.ps1      (or)   powershell -File playground/server.ps1
# Open:  http://localhost:8090/
#
param([int]$Port = 8090)

$root = $PSScriptRoot

# ── Load the Massive key (file first, then env var) ───────────────────────────
$keyFile = Join-Path $root ".massive-key"
$MassiveKey = $env:MASSIVE_API_KEY
if (Test-Path $keyFile) { $MassiveKey = (Get-Content $keyFile -Raw).Trim() }
if (-not $MassiveKey) { Write-Error "No Massive key. Put it in playground/.massive-key or set `$env:MASSIVE_API_KEY"; exit 1 }

$MASSIVE = "https://api.massive.com"

# ── Allowlist: resource -> Massive path. {t}=ticker, {from}/{to}=dates ─────────
# Only endpoints our plan is entitled to. Adding one = one line here.
function Resolve-Route([string]$resource, [string]$t, [hashtable]$q) {
  switch ($resource) {
    "details"   { return "/v3/reference/tickers/$t" }
    "snapshot"  { return "/v2/snapshot/locale/us/markets/stocks/tickers/$t" }
    "prev"      { return "/v2/aggs/ticker/$t/prev?adjusted=true" }
    "ratios"    { return "/stocks/financials/v1/ratios?ticker=$t&limit=1" }
    "income"    { return "/stocks/financials/v1/income-statements?tickers=$t&limit=8&sort=period_end.desc" }
    "balance"   { return "/stocks/financials/v1/balance-sheets?tickers=$t&limit=4&sort=period_end.desc" }
    "cashflow"  { return "/stocks/financials/v1/cash-flow-statements?tickers=$t&limit=4&sort=period_end.desc" }
    "news"      { return "/v2/reference/news?ticker=$t&limit=8" }
    "aggs"      {
      $from = if ($q.from) { $q.from } else { "2022-01-01" }
      $to   = if ($q.to)   { $q.to }   else { (Get-Date).ToString("yyyy-MM-dd") }
      return "/v2/aggs/ticker/$t/range/1/day/$from/$to?adjusted=true&sort=asc&limit=5000"
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
Write-Host "Multiples playground at http://localhost:$Port/  (key loaded, root: $root)" -ForegroundColor Green
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
      $q = @{ from = $req.QueryString["from"]; to = $req.QueryString["to"] }

      $bad = $null
      if (-not $ticker -or $ticker -notmatch '^[A-Z0-9.\-]{1,10}$') { $bad = "invalid ticker" }
      $route = Resolve-Route $resource $ticker $q
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
