$cik='0000313616'; $dir="$env:LOCALAPPDATA\Temp\claude\dhr-edgar"
$agent='Summit Research salvarez@summit-mgmtx.com'
$tags=@('IncomeLossFromContinuingOperationsIncludingPortionAttributableToNoncontrollingInterest',
        'IncomeLossFromContinuingOperationsAttributableToParent',
        'IncomeLossFromDiscontinuedOperationsNetOfTax',
        'IncomeLossFromContinuingOperationsPerDilutedShare',
        'EarningsPerShareDiluted')
foreach ($t in $tags) {
  $p = Join-Path $dir "us-gaap.$t.json"
  if (-not (Test-Path $p)) {
    try { Invoke-WebRequest -Uri "https://data.sec.gov/api/xbrl/companyconcept/CIK$cik/us-gaap/$t.json" -UseBasicParsing -Headers @{'User-Agent'=$agent} -OutFile $p -TimeoutSec 60 | Out-Null }
    catch { '{"units":{}}' | Set-Content $p -Encoding utf8 }
    Start-Sleep -Milliseconds 120
  }
  $d = Get-Content $p -Raw | ConvertFrom-Json
  if (-not $d.units) { Write-Host "$t : none"; continue }
  foreach ($u in $d.units.PSObject.Properties.Name) {
    $rows = $d.units.$u | Where-Object { $_.start -and $_.form -match '^10-K' -and (([datetime]$_.end - [datetime]$_.start).Days -ge 340) -and (([datetime]$_.end - [datetime]$_.start).Days -le 400) }
    $g=@{}; foreach($r in $rows){ $y=([datetime]$r.end).Year; if(-not $g[$y] -or [datetime]$r.filed -gt [datetime]$g[$y].filed){$g[$y]=$r} }
    $line = ($g.Keys | Sort-Object | Where-Object {$_ -ge 2016} | ForEach-Object { "{0}:{1}" -f $_, $g[$_].val }) -join '  '
    Write-Host ("{0} [{1}]`n   {2}" -f $t,$u,$line)
  }
}
