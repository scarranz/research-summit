# fetch-metrics.ps1 — the Investment Spectrum's metric history, from SEC XBRL.
#
# Pulls a decade of annual figures per company plus enough of the current year to build a
# trailing-twelve-month column, and writes them as-filed. Nothing here is interpreted: the
# board's job is to show the numbers and let a reader place the company.
#
#   .\scripts\spectrum\fetch-metrics.ps1
#
# Six inputs, all flows, all from the income and cash-flow statements:
#   revenue · grossProfit (or cost of sales) · operatingIncome · cfo · capex · da
#
# From those the browser derives revenue growth, gross / operating / CFO / FCF margins,
# capex over revenue and capex over D&A — see js/spectrum-metrics.js.
#
# Ratios only ever divide two figures from the same filing, so the reporting currency never
# matters. It is still pinned per company: TSMC files in TWD and in a USD convenience
# translation, and a ratio taking its numerator from one and its denominator from the other
# would be wrong by the exchange rate without looking wrong.
#
# One concept per request rather than the whole company-facts blob: the blob is megabytes, and
# several filers (AMZN, SPOT, IBKR) ship keys differing only in case, which PowerShell 5.1's
# ConvertFrom-Json rejects outright.

[CmdletBinding()]
param(
  [string]$Out      = "$PSScriptRoot\..\..\js\spectrum-metrics-data.js",
  [string]$CacheDir = "$env:LOCALAPPDATA\Temp\claude\spectrum-edgar\concepts",
  [string]$Agent    = 'Summit Research salvarez@summit-mgmtx.com',
  [int]$MaxYears    = 11,
  [switch]$Refresh
)

$ErrorActionPreference = 'Stop'

$CIKS = [ordered]@{
  NVDA='0001045810'; TSM='0001046179'; AMZN='0001018724'; GOOGL='0001652044'
  META='0001326801'; SPOT='0001639920'; UBER='0001543151'; LYFT='0001759509'
  MA  ='0001141391'; SOFI='0001818874'; IBKR='0001381197'; DIS  ='0001744489'
  PAC ='0001347557'; TBBB='0001978954'; TPL ='0001811074'
}

# Candidate tags per metric, best first. Every one is read; where two answer for the same
# period the earlier-listed tag wins. Filers rotate tags between years, so picking the first
# tag that answers anything at all would quietly return a stale decade.
$TAGS = [ordered]@{
  # RevenuesNetOfInterestExpense leads because only lenders and brokers report it, and for
  # them it is the real top line: SoFi's plain `Revenues` tag covers fee income alone
  # (0.6bn of a 3.6bn year), and Interactive Brokers' covers commissions alone.
  revenue    = @{ 'us-gaap'   = @('RevenuesNetOfInterestExpense','RevenueFromContractWithCustomerExcludingAssessedTax','Revenues','RevenueFromContractWithCustomerIncludingAssessedTax')
                  'ifrs-full' = @('Revenue','RevenueFromContractsWithCustomers') }
  grossProfit= @{ 'us-gaap'   = @('GrossProfit'); 'ifrs-full' = @('GrossProfit') }
  costOfSales= @{ 'us-gaap'   = @('CostOfRevenue','CostOfGoodsAndServicesSold','CostOfServices','CostOfGoodsAndServiceExcludingDepreciationDepletionAndAmortization')
                  'ifrs-full' = @('CostOfSales') }
  operating  = @{ 'us-gaap'   = @('OperatingIncomeLoss')
                  'ifrs-full' = @('ProfitLossFromOperatingActivities') }
  cfo        = @{ 'us-gaap'   = @('NetCashProvidedByUsedInOperatingActivities','NetCashProvidedByUsedInOperatingActivitiesContinuingOperations')
                  'ifrs-full' = @('CashFlowsFromUsedInOperatingActivities') }
  capex      = @{ 'us-gaap'   = @('PaymentsToAcquirePropertyPlantAndEquipment','PaymentsToAcquireProductiveAssets','PaymentsToAcquirePropertyPlantAndEquipmentAndIntangibleAssets')
                  'ifrs-full' = @('PurchaseOfPropertyPlantAndEquipmentClassifiedAsInvestingActivities','AdditionsOtherThanThroughBusinessCombinationsPropertyPlantAndEquipment') }
  da         = @{ 'us-gaap'   = @('DepreciationDepletionAndAmortization','DepreciationAmortizationAndAccretionNet','DepreciationAndAmortization')
                  'ifrs-full' = @('DepreciationAndAmortisationExpense') }
  # Alphabet, TSMC and Spotify never tag a combined D&A line — they file depreciation and
  # amortisation as two separate rows. Read both and add them where the combined tag is
  # absent, rather than leaving a metric blank for three of the fifteen companies. Right-of-use
  # depreciation is deliberately not added in: filers that report it separately are already
  # counting it inside the depreciation line often enough that adding it risks double-counting.
  daDep      = @{ 'us-gaap'   = @('Depreciation','DepreciationNonproduction')
                  'ifrs-full' = @('DepreciationExpense','AdjustmentsForDepreciationExpense','DepreciationPropertyPlantAndEquipment') }
  daAmort    = @{ 'us-gaap'   = @('AmortizationOfIntangibleAssets','AmortizationOfAcquiredIntangibleAssets')
                  'ifrs-full' = @('AmortisationExpense','AdjustmentsForAmortisationExpense','AmortisationIntangibleAssetsOtherThanGoodwill') }
}

# Fields read only to build another one; never written out on their own.
$HELPERS = @('costOfSales','daDep','daAmort')

function Get-Concept {
  param([string]$Ticker, [string]$Cik, [string]$Taxonomy, [string]$Tag)
  New-Item -ItemType Directory -Force -Path $CacheDir | Out-Null
  $path = Join-Path $CacheDir "$Ticker.$Taxonomy.$Tag.json"
  if ($Refresh -or -not (Test-Path $path)) {
    try {
      Invoke-WebRequest -Uri "https://data.sec.gov/api/xbrl/companyconcept/CIK$Cik/$Taxonomy/$Tag.json" `
        -UseBasicParsing -Headers @{ 'User-Agent' = $Agent } -OutFile $path -TimeoutSec 60 | Out-Null
    } catch {
      # A 404 just means this filer never used the tag. Cache the miss so reruns stay fast.
      '{"units":{}}' | Set-Content -Path $path -Encoding utf8
    }
    Start-Sleep -Milliseconds 110
  }
  try { return (Get-Content $path -Raw | ConvertFrom-Json) } catch { return $null }
}

# Every duration fact for one metric, keyed unit -> "start|end" -> row. Later filings restate
# earlier periods, so the newest `filed` wins for any given window.
function Read-Windows {
  param([string]$Ticker, [string]$Cik, [string]$Metric)
  $byUnit = @{}
  foreach ($tax in @('us-gaap','ifrs-full')) {
    $prio = 0
    foreach ($tag in $TAGS[$Metric][$tax]) {
      $prio++
      $doc = Get-Concept -Ticker $Ticker -Cik $Cik -Taxonomy $tax -Tag $tag
      if (-not $doc -or -not $doc.units) { continue }
      foreach ($unit in $doc.units.PSObject.Properties.Name) {
        if (-not $byUnit.ContainsKey($unit)) { $byUnit[$unit] = @{} }
        foreach ($r in $doc.units.$unit) {
          if (-not $r.start -or -not $r.end) { continue }
          $key = "$($r.start)|$($r.end)"
          $cand = [pscustomobject]@{
            value = [double]$r.val; start = $r.start; end = $r.end
            days  = ([datetime]$r.end - [datetime]$r.start).Days
            form  = $r.form; filed = $r.filed; tag = $tag; prio = $prio
          }
          $prev = $byUnit[$unit][$key]
          if (-not $prev -or $cand.prio -lt $prev.prio -or
              ($cand.prio -eq $prev.prio -and [datetime]$cand.filed -gt [datetime]$prev.filed)) {
            $byUnit[$unit][$key] = $cand
          }
        }
      }
    }
  }
  return $byUnit
}

# The reporting currency is whichever unit the filer tags most completely; a convenience
# translation only ever covers a subset of the statements.
function Select-Unit {
  param($Windows)
  $score = @{}
  foreach ($metric in $Windows.Keys) {
    foreach ($unit in $Windows[$metric].Keys) {
      if (-not $score.ContainsKey($unit)) { $score[$unit] = 0 }
      $score[$unit] += $Windows[$metric][$unit].Count
    }
  }
  if (-not $score.Count) { return $null }
  ($score.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 1).Name
}

function Get-Annuals {
  param($Rows)   # hashtable "start|end" -> row, single unit
  $out = @{}
  foreach ($r in $Rows.Values) {
    if ($r.days -lt 340 -or $r.days -gt 400) { continue }
    if ($r.form -notmatch '^(10-K|20-F)') { continue }
    $prev = $out[$r.end]
    if (-not $prev -or [datetime]$r.filed -gt [datetime]$prev.filed) { $out[$r.end] = $r }
  }
  return $out
}

# Trailing twelve months the way an analyst builds it: the last full year, plus the current
# year to date, less the same stretch of the prior year. A backward walk over quarters cannot
# do this — cash-flow statements are filed year-to-date and Q4 is never tagged on its own.
function Get-Ttm {
  param($Rows, $Annuals, $LatestAnnual)
  if (-not $LatestAnnual) { return $null }
  $fyEnd = [datetime]$LatestAnnual.end

  # Year-to-date of the year after the last annual: starts the day the last year ended.
  $ytd = $Rows.Values |
    Where-Object { $_.days -ge 60 -and $_.days -lt 340 -and ([datetime]$_.start - $fyEnd).Days -le 4 -and ([datetime]$_.start - $fyEnd).Days -ge 0 } |
    Sort-Object @{E={$_.days}}, @{E={[datetime]$_.filed}} | Select-Object -Last 1
  if (-not $ytd) { return $null }

  # The same stretch one year earlier, so the two cancel and leave twelve months.
  $wantEnd = ([datetime]$ytd.end).AddYears(-1)
  $prior = $Rows.Values |
    Where-Object { [math]::Abs($_.days - $ytd.days) -le 6 -and [math]::Abs((([datetime]$_.end) - $wantEnd).Days) -le 6 } |
    Sort-Object @{E={[datetime]$_.filed}} | Select-Object -Last 1
  if (-not $prior) { return $null }

  # The same twelve months a year earlier, so the TTM column can carry a growth rate that
  # compares like with like. Without it "revenue growth, TTM" could only be measured against
  # the last closed year, which is not a growth rate at all.
  $priorTtm = $null
  $fyPrevEnd = $fyEnd.AddYears(-1).ToString('yyyy-MM-dd')
  $fyPrev = $Annuals.Values |
    Where-Object { [math]::Abs((([datetime]$_.end) - $fyEnd.AddYears(-1)).Days) -le 6 } |
    Select-Object -First 1
  if ($fyPrev) {
    $wantEnd2 = ([datetime]$prior.end).AddYears(-1)
    $prior2 = $Rows.Values |
      Where-Object { [math]::Abs($_.days - $ytd.days) -le 6 -and [math]::Abs((([datetime]$_.end) - $wantEnd2).Days) -le 6 } |
      Sort-Object @{E={[datetime]$_.filed}} | Select-Object -Last 1
    if ($prior2) { $priorTtm = $fyPrev.value + $prior.value - $prior2.value }
  }

  return [pscustomobject]@{
    value = $LatestAnnual.value + $ytd.value - $prior.value
    prior = $priorTtm
    end   = $ytd.end
    note  = "FY to $($LatestAnnual.end) + $($ytd.days)d to $($ytd.end) - same stretch to $($prior.end)"
  }
}

$records = @()
foreach ($ticker in $CIKS.Keys) {
  $cik = $CIKS[$ticker]
  Write-Host ("{0,-6}" -f $ticker) -NoNewline

  $win = [ordered]@{}
  foreach ($metric in $TAGS.Keys) { $win[$metric] = Read-Windows -Ticker $ticker -Cik $cik -Metric $metric }
  $unit = Select-Unit -Windows $win
  if (-not $unit) { Write-Host 'no data'; continue }

  $rows     = @{}; $annuals = @{}; $ttms = @{}
  foreach ($metric in $TAGS.Keys) {
    $rows[$metric]    = if ($win[$metric].ContainsKey($unit)) { $win[$metric][$unit] } else { @{} }
    $annuals[$metric] = Get-Annuals -Rows $rows[$metric]
  }

  # The revenue line is the spine: it defines which fiscal years exist.
  $ends = $annuals['revenue'].Keys | Sort-Object @{E={[datetime]$_}} -Descending |
          Select-Object -First $MaxYears
  $ends = @($ends) | Sort-Object @{E={[datetime]$_}}
  if (-not $ends.Count) { Write-Host 'no revenue'; continue }

  $latestRev = $annuals['revenue'][$ends[-1]]
  foreach ($metric in $TAGS.Keys) {
    $la = $annuals[$metric][$ends[-1]]
    if (-not $la) {
      # A metric can end its own last year earlier than revenue does; use its own latest.
      $la = $annuals[$metric].Values | Sort-Object @{E={[datetime]$_.end}} | Select-Object -Last 1
    }
    $ttms[$metric] = Get-Ttm -Rows $rows[$metric] -Annuals $annuals[$metric] -LatestAnnual $la
  }

  $years = @()
  foreach ($e in $ends) {
    $y = [ordered]@{ end = $e; fy = ([datetime]$e).Year }
    foreach ($metric in $TAGS.Keys) {
      $hit = $annuals[$metric][$e]
      $y[$metric] = if ($hit) { $hit.value } else { $null }
    }
    # Gross profit is the one figure a filer may leave implicit.
    if ($null -eq $y.grossProfit -and $null -ne $y.revenue -and $null -ne $y.costOfSales) {
      $y.grossProfit = $y.revenue - $y.costOfSales
    }
    if ($null -eq $y.da -and $null -ne $y.daDep) {
      $y.da = $y.daDep + $(if ($null -ne $y.daAmort) { $y.daAmort } else { 0 })
    }
    foreach ($drop in $HELPERS) { $y.Remove($drop) | Out-Null }
    $y['form'] = if ($annuals['revenue'][$e]) { $annuals['revenue'][$e].form } else { $null }
    $years += [pscustomobject]$y
  }

  $ttm = $null
  if ($ttms['revenue']) {
    $t = [ordered]@{
      end = $ttms['revenue'].end; note = $ttms['revenue'].note
      priorRevenue = $ttms['revenue'].prior   # the same twelve months a year earlier
    }
    foreach ($metric in $TAGS.Keys) {
      $t[$metric] = if ($ttms[$metric]) { $ttms[$metric].value } else { $null }
    }
    if ($null -eq $t.grossProfit -and $null -ne $t.revenue -and $null -ne $t.costOfSales) {
      $t.grossProfit = $t.revenue - $t.costOfSales
    }
    if ($null -eq $t.da -and $null -ne $t.daDep) {
      $t.da = $t.daDep + $(if ($null -ne $t.daAmort) { $t.daAmort } else { 0 })
    }
    foreach ($drop in $HELPERS) { $t.Remove($drop) | Out-Null }
    $ttm = [pscustomobject]$t
  }

  $tagsUsed = [ordered]@{}
  foreach ($metric in $TAGS.Keys) {
    $used = $annuals[$metric].Values | Sort-Object @{E={[datetime]$_.end}} | Select-Object -Last 1
    if ($used) { $tagsUsed[$metric] = $used.tag }
  }

  $records += [pscustomobject]@{
    ticker = $ticker; currency = $unit
    years = $years; ttm = $ttm; tags = $tagsUsed
  }
  Write-Host ("{0} {1,2} yrs  {2}..{3}  TTM {4}" -f $unit, $years.Count, $ends[0], $ends[-1],
    $(if ($ttm) { $ttm.end } else { 'none' }))
}

$stamp = (Get-Date).ToString('yyyy-MM-dd')
$json  = $records | ConvertTo-Json -Depth 8
$header = @"
// spectrum-metrics-data.js - GENERATED. Do not edit by hand.
//
// Source: SEC XBRL company concepts (data.sec.gov) - 10-K for the US filers, 20-F for TSMC,
// Spotify, Grupo Aeroportuario and Tiendas 3B. Regenerate with:
//
//   .\scripts\spectrum\fetch-metrics.ps1
//
// Every figure is as-filed. ``years`` runs oldest to newest and is spined on the revenue line,
// so a year appears only if revenue was tagged for it; ``null`` on any other field means the
// company does not report that line, and the metric built on it is left blank rather than
// guessed. ``ttm`` is the last full year plus the current year to date less the same stretch of
// the prior year - null where the filer publishes no interim XBRL, which is the normal case
// for the 20-F names.
//
// Amounts are in each filer's own reporting currency (see ``currency``). Only ratios are shown
// in the UI, and each divides two figures from the same filing, so no FX is involved.
//
// Generated $stamp.

export const SPECTRUM_METRICS_DATA = $json;
"@
$header | Set-Content -Path $Out -Encoding utf8
Write-Host "`nWrote $Out ($($records.Count) companies)"
