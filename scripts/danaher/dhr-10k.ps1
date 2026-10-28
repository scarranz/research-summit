$agent='Summit Research salvarez@summit-mgmtx.com'
$dir="$env:LOCALAPPDATA\Temp\claude\dhr-edgar\proxy"
$idx = Join-Path $dir 'tenk-index.json'
if(-not (Test-Path $idx)){
  Invoke-WebRequest -Uri 'https://www.sec.gov/Archives/edgar/data/313616/000031361626000062/index.json' `
    -UseBasicParsing -Headers @{'User-Agent'=$agent} -OutFile $idx -TimeoutSec 60 | Out-Null
}
$j = Get-Content $idx -Raw | ConvertFrom-Json
$doc = $j.directory.item | Where-Object { $_.name -match '^dhr-\d+\.htm$' } | Select-Object -First 1
Write-Host "primary doc: $($doc.name)"
$p = Join-Path $dir '10k-2025.htm'
if(-not (Test-Path $p)){
  Invoke-WebRequest -Uri "https://www.sec.gov/Archives/edgar/data/313616/000031361626000062/$($doc.name)" `
    -UseBasicParsing -Headers @{'User-Agent'=$agent} -OutFile $p -TimeoutSec 180 | Out-Null
}
$h = Get-Content $p -Raw
$t = $h -replace '(?is)<(script|style)[^>]*>.*?</\1>',' '
$t = $t -replace '(?i)</(p|div|tr|h1|h2|h3|h4|li|table)>', "`n"
$t = $t -replace '(?i)</t[dh]>', ' | '
$t = $t -replace '(?is)<[^>]+>',''
$t = [System.Net.WebUtility]::HtmlDecode($t)
$t = $t -replace '[ \t\u00A0]+',' '
$t = ($t -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }) -join "`n"
$out = Join-Path $dir '10k-2025.txt'
Set-Content -Path $out -Value $t -Encoding utf8
Write-Host ("text chars: {0} -> {1}" -f $t.Length, $out)
