param([string]$In = "$PSScriptRoot\dhr-xbrl.json")
$f = Get-Content $In -Raw | ConvertFrom-Json
$flow = @('revenue','costOfSales','grossProfit','sga','rnd','operating','interestExp','pretax','tax','netIncome','cfo','capex','da','dep','amort','sbc','divPaid','buybacks','acqSpend','epsDiluted','shsDiluted')
$inst = @('cash','debtCurrent','debtLong','equity','assets','goodwill','intangibles','shsOut')

Write-Host "=== ANNUALS (10-K, 340-400d) ==="
foreach ($m in $flow) {
  $rows = $f.$m | Where-Object { $_.days -ge 340 -and $_.days -le 400 -and $_.form -match '^10-K' }
  $g = @{}
  foreach ($r in $rows) { $y=([datetime]$r.end).Year; if(-not $g[$y] -or [datetime]$r.filed -gt [datetime]$g[$y].filed){$g[$y]=$r} }
  $s = ($g.Keys | Sort-Object | ForEach-Object { "{0}:{1}" -f $_, [math]::Round($g[$_].v/1e6,1) }) -join '  '
  Write-Host ("{0,-12} {1}" -f $m, $s)
}
Write-Host "`n=== INSTANTS (fiscal year ends, 10-K) ==="
foreach ($m in $inst) {
  $rows = $f.$m | Where-Object { $_.form -match '^10-K' -and $_.end -match '-12-3[01]$' }
  $g = @{}
  foreach ($r in $rows) { $y=([datetime]$r.end).Year; if(-not $g[$y] -or [datetime]$r.filed -gt [datetime]$g[$y].filed){$g[$y]=$r} }
  $s = ($g.Keys | Sort-Object | ForEach-Object { "{0}:{1}" -f $_, [math]::Round($g[$_].v/1e6,1) }) -join '  '
  Write-Host ("{0,-12} {1}" -f $m, $s)
}
Write-Host "`n=== LATEST INTERIM (10-Q) ==="
foreach ($m in @('revenue','operating','netIncome','cfo','capex','cash','debtCurrent','debtLong','equity','shsOut')) {
  $r = $f.$m | Where-Object { $_.form -match '^10-Q' } | Sort-Object @{E={[datetime]$_.end}},@{E={$_.days}} | Select-Object -Last 3
  foreach ($x in $r) { Write-Host ("{0,-12} {1} .. {2}  {3,4}d  {4,12}  filed {5}" -f $m,$x.start,$x.end,$x.days,[math]::Round($x.v/1e6,1),$x.filed) }
}
