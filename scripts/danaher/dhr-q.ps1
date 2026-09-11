$dir="$env:LOCALAPPDATA\Temp\claude\dhr-edgar"
# Quarterly (80-100d) duration facts, newest filing per window.
function Q($tags,$name){
  $best=@{}; $prio=0
  foreach($tag in $tags){ $prio++
    $p=Join-Path $dir "us-gaap.$tag.json"; if(-not (Test-Path $p)){continue}
    $d=Get-Content $p -Raw | ConvertFrom-Json; if(-not $d.units){continue}
    foreach($u in $d.units.PSObject.Properties.Name){
      foreach($r in $d.units.$u){
        if(-not $r.start -or -not $r.end){continue}
        $days=([datetime]$r.end-[datetime]$r.start).Days
        if($days -lt 80 -or $days -gt 100){continue}
        $k=$r.end
        $c=[pscustomobject]@{v=$r.val;end=$r.end;start=$r.start;filed=$r.filed;prio=$prio}
        $pv=$best[$k]
        if(-not $pv -or $c.prio -lt $pv.prio -or ($c.prio -eq $pv.prio -and [datetime]$c.filed -gt [datetime]$pv.filed)){$best[$k]=$c}
      }
    }
  }
  $rows=$best.Values | Sort-Object @{E={[datetime]$_.end}} | Where-Object {[datetime]$_.end -ge [datetime]'2021-01-01'}
  Write-Host "`n### $name"
  ($rows | ForEach-Object { "{0}={1}" -f $_.end, [math]::Round($_.v/1e6,0) }) -join '  '
}
Q @('RevenueFromContractWithCustomerExcludingAssessedTax','Revenues') 'revenue'
Q @('GrossProfit') 'grossProfit'
Q @('OperatingIncomeLoss') 'operating'
Q @('NetIncomeLoss') 'netIncome'
Q @('SellingGeneralAndAdministrativeExpense') 'sga'
Q @('ResearchAndDevelopmentExpense') 'rnd'
Q @('EarningsPerShareDiluted') 'epsD'
