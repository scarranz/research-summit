$cik='0000313616'; $dir="$env:LOCALAPPDATA\Temp\claude\dhr-edgar"
$agent='Summit Research salvarez@summit-mgmtx.com'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$tags = @(
  'CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents',
  'CommonStockDividendsPerShareDeclared','CommonStockDividendsPerShareCashPaid',
  'DividendsCommonStockCash','DividendsCommonStock',
  'DebtInstrumentCarryingAmount','LongTermDebtFairValue',
  'OperatingLeaseLiabilityNoncurrent','OperatingLeaseLiabilityCurrent',
  'ShortTermInvestments','MarketableSecuritiesCurrent',
  'AmortizationOfIntangibleAssetsAcquired','ImpairmentOfIntangibleAssetsExcludingGoodwill'
)
foreach ($t in $tags) {
  $p = Join-Path $dir "us-gaap.$t.json"
  if (-not (Test-Path $p)) {
    try { Invoke-WebRequest -Uri "https://data.sec.gov/api/xbrl/companyconcept/CIK$cik/us-gaap/$t.json" -UseBasicParsing -Headers @{'User-Agent'=$agent} -OutFile $p -TimeoutSec 60 | Out-Null }
    catch { '{"units":{}}' | Set-Content $p -Encoding utf8 }
    Start-Sleep -Milliseconds 120
  }
  $d = Get-Content $p -Raw | ConvertFrom-Json
  $n = 0; if ($d.units) { foreach ($u in $d.units.PSObject.Properties.Name) { $n += $d.units.$u.Count } }
  Write-Host ("{0,-58} {1,4} facts" -f $t, $n)
  if ($n -gt 0) {
    foreach ($u in $d.units.PSObject.Properties.Name) {
      $rows = $d.units.$u | Where-Object { $_.form -match '^10-K' } | Sort-Object @{E={[datetime]$_.end}},@{E={[datetime]$_.filed}}
      $g=@{}; foreach($r in $rows){ $k=$r.end; if(-not $g[$k] -or [datetime]$r.filed -gt [datetime]$g[$k].filed){$g[$k]=$r} }
      $line = ($g.Keys | Sort-Object | Select-Object -Last 12 | ForEach-Object { "{0}:{1}" -f (([datetime]$_).ToString('yyyy-MM-dd')), $g[$_].val }) -join '  '
      Write-Host ("   [$u] $line")
    }
  }
}
