$agent='Summit Research salvarez@summit-mgmtx.com'
$dir="$env:LOCALAPPDATA\Temp\claude\dhr-edgar\proxy"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$p = Join-Path $dir 'def14a-2026.htm'
if(-not (Test-Path $p)){
  Invoke-WebRequest -Uri 'https://www.sec.gov/Archives/edgar/data/313616/000031361626000101/dhr-20260325.htm' `
    -UseBasicParsing -Headers @{'User-Agent'=$agent} -OutFile $p -TimeoutSec 120 | Out-Null
}
$h = Get-Content $p -Raw
Write-Host ("raw bytes: {0}" -f $h.Length)
# Strip to readable text, keeping block boundaries as newlines.
$t = $h -replace '(?is)<(script|style)[^>]*>.*?</\1>',' '
$t = $t -replace '(?i)</(p|div|tr|h1|h2|h3|h4|li|table)>', "`n"
$t = $t -replace '(?i)</t[dh]>', ' | '
$t = $t -replace '(?is)<[^>]+>',''
$t = [System.Net.WebUtility]::HtmlDecode($t)
$t = $t -replace '[ \t\u00A0]+',' '
$t = ($t -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }) -join "`n"
$out = Join-Path $dir 'def14a-2026.txt'
Set-Content -Path $out -Value $t -Encoding utf8
Write-Host ("text chars: {0}  -> {1}" -f $t.Length, $out)
