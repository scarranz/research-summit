$dir="$env:LOCALAPPDATA\Temp\claude\dhr-edgar"
function Latest($tag,$n=4){
  $p = Join-Path $dir "us-gaap.$tag.json"
  if (-not (Test-Path $p)) { Write-Host "$tag : no cache"; return }
  $d = Get-Content $p -Raw | ConvertFrom-Json
  if (-not $d.units) { return }
  foreach ($u in $d.units.PSObject.Properties.Name) {
    $g=@{}
    foreach($r in $d.units.$u){ if($r.start){continue}; $k=$r.end; if(-not $g[$k] -or [datetime]$r.filed -gt [datetime]$g[$k].filed){$g[$k]=$r} }
    $line = ($g.Keys | Sort-Object | Select-Object -Last $n | ForEach-Object { "{0}:{1}" -f $_, $g[$_].val }) -join '  '
    Write-Host ("{0,-58} [{1}] {2}" -f $tag,$u,$line)
  }
}
foreach ($t in @('CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents','CashAndCashEquivalentsAtCarryingValue','LongTermDebtNoncurrent','LongTermDebtCurrent','StockholdersEquity','Assets','Goodwill','FiniteLivedIntangibleAssetsNet','OperatingLeaseLiabilityNoncurrent','OperatingLeaseLiabilityCurrent')) { Latest $t 5 }
