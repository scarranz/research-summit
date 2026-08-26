# fetch-fundamentals.ps1 — pull the Investment Spectrum's measured inputs from SEC XBRL.
#
# The Spectrum's measured layer must not be a second opinion typed by hand: every number it
# uses is a value the company itself filed. This script reads the SEC's XBRL company-concept
# API (10-K for US filers, 20-F for the foreign ones) and writes one flat record per ticker.
#
#   .\scripts\spectrum\fetch-fundamentals.ps1
#
# Ratios only ever divide two figures from the same filing, so the reporting currency does
# not matter — TSM in TWD and TBBB in MXN stay comparable to AMZN in USD.
#
# Two taxonomies are read: us-gaap for domestic filers, ifrs-full for the 20-F names
# (TSM, SPOT, PAC, TBBB). Where a tag is missing the field comes out null and the formula
# downstream drops that term rather than guessing.
#
# One concept per request rather than the whole company-facts blob: the blob is megabytes,
# and several filers (AMZN, SPOT) ship keys differing only in case, which PowerShell 5.1's
# ConvertFrom-Json rejects outright.

[CmdletBinding()]
param(
  [string]$Out      = "$PSScriptRoot\..\..\js\spectrum-measured-data.js",
  [string]$CacheDir = "$env:LOCALAPPDATA\Temp\claude\spectrum-edgar\concepts",
  [string]$Agent    = 'Summit Research salvarez@summit-mgmtx.com',
  [switch]$Refresh
)

$ErrorActionPreference = 'Stop'

$CIKS = [ordered]@{
  NVDA='0001045810'; TSM='0001046179'; AMZN='0001018724'; GOOGL='0001652044'
  META='0001326801'; SPOT='0001639920'; UBER='0001543151'; LYFT='0001759509'
  MA  ='0001141391'; SOFI='0001818874'; IBKR='0001381197'; DIS  ='0001744489'
  PAC ='0001347557'; TBBB='0001978954'; TPL ='0001811074'
}

# Candidate tags per metric. Every one is tried; the most recent annual period wins, and
# ties break toward the tag listed first. Filers rotate tags between years — NVIDIA stopped
# using RevenueFromContractWithCustomer... after FY2023 — so "first tag that answers" would
# silently return a stale year.
$TAGS = [ordered]@{
  # RevenuesNetOfInterestExpense leads because only lenders and brokers report it, and for
  # them it is the real top line: SoFi's plain `Revenues` tag covers fee income alone
  # (0.6bn of a 3.6bn year), and Interactive Brokers' covers commissions alone.
  revenue     = @{ 'us-gaap' = @('RevenuesNetOfInterestExpense','Revenues','RevenueFromContractWithCustomerExcludingAssessedTax','RevenueFromContractWithCustomerIncludingAssessedTax')
                   'ifrs-full' = @('Revenue','RevenueFromContractsWithCustomers') }
  grossProfit = @{ 'us-gaap' = @('GrossProfit'); 'ifrs-full' = @('GrossProfit') }
  costOfSales = @{ 'us-gaap' = @('CostOfRevenue','CostOfGoodsAndServicesSold','CostOfServices','CostOfGoodsAndServiceExcludingDepreciationDepletionAndAmortization')
                   'ifrs-full' = @('CostOfSales') }
  # Meta, Uber, Lyft and SoFi all retired PropertyPlantAndEquipmentNet around 2019-2020 for
  # the finance-lease-inclusive tag. It is listed first because it is also the better
  # measure: a data centre on a finance lease is capital the company has committed either way.
  ppe         = @{ 'us-gaap' = @('PropertyPlantAndEquipmentAndFinanceLeaseRightOfUseAssetAfterAccumulatedDepreciationAndAmortization','PropertyPlantAndEquipmentNet')
                   'ifrs-full' = @('PropertyPlantAndEquipment') }
  rou         = @{ 'us-gaap' = @('OperatingLeaseRightOfUseAsset'); 'ifrs-full' = @('RightofuseAssets') }
  inventory   = @{ 'us-gaap' = @('InventoryNet'); 'ifrs-full' = @('Inventories','InventoriesTotal') }
  capex       = @{ 'us-gaap' = @('PaymentsToAcquirePropertyPlantAndEquipment','PaymentsToAcquireProductiveAssets','PaymentsToAcquirePropertyPlantAndEquipmentAndIntangibleAssets')
                   'ifrs-full' = @('PurchaseOfPropertyPlantAndEquipmentClassifiedAsInvestingActivities','AdditionsOtherThanThroughBusinessCombinationsPropertyPlantAndEquipment') }
  rnd         = @{ 'us-gaap' = @('ResearchAndDevelopmentExpense'); 'ifrs-full' = @('ResearchAndDevelopmentExpense') }
  assets      = @{ 'us-gaap' = @('Assets'); 'ifrs-full' = @('Assets') }
  # Collected for context, deliberately NOT in the capital-intensity index. The reason to look
  # was Grupo Aeroportuario: under IFRIC 12 an airport concession is an intangible right, not
  # PP&E, so the heaviest company on the board carries almost no plant. It turns out PAC does
  # not tag the concession at all, so the term rescued nothing — while for Mastercard it added
  # acquired customer relationships and made the lightest business on the board look mid-pack.
  # Goodwill is not collected at all: it is the price paid for a business, not capital tied up.
  intangibles = @{ 'us-gaap' = @('FiniteLivedIntangibleAssetsNet','IntangibleAssetsNetExcludingGoodwill')
                   'ifrs-full' = @('IntangibleAssetsOtherThanGoodwill') }
  # Including the noncontrolling interest is the economically right figure and matters for
  # Interactive Brokers, where the listed entity holds only a minority of the operating group.
  equity      = @{ 'us-gaap' = @('StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest','StockholdersEquity')
                   'ifrs-full' = @('Equity') }
}

$FLOWS = @('revenue','grossProfit','costOfSales','capex','rnd')

function Get-Concept {
  param([string]$Ticker, [string]$Cik, [string]$Taxonomy, [string]$Tag)
  New-Item -ItemType Directory -Force -Path $CacheDir | Out-Null
  $path = Join-Path $CacheDir "$Ticker.$Taxonomy.$Tag.json"
  if ($Refresh -or -not (Test-Path $path)) {
    try {
      Invoke-WebRequest -Uri "https://data.sec.gov/api/xbrl/companyconcept/CIK$Cik/$Taxonomy/$Tag.json" `
        -Headers @{ 'User-Agent' = $Agent } -OutFile $path -TimeoutSec 60 | Out-Null
    } catch {
      # 404 simply means this filer never used the tag. Cache the miss so reruns stay fast.
      '{"units":{}}' | Set-Content -Path $path -Encoding utf8
    }
    Start-Sleep -Milliseconds 120
  }
  try { return (Get-Content $path -Raw | ConvertFrom-Json) } catch { return $null }
}

# Pick the most recent annual figure. Flows must span a full year and come from an annual
# report; instants take the latest annual-report balance-sheet date.
function Select-Annual {
  param($Rows, [bool]$IsFlow)
  $rows = @($Rows | Where-Object { $_.form -match '^(10-K|20-F)' })
  if ($IsFlow) {
    $rows = @($rows | Where-Object {
      $_.start -and $_.end -and
      (([datetime]$_.end - [datetime]$_.start).Days -ge 340) -and
      (([datetime]$_.end - [datetime]$_.start).Days -le 400)
    })
  } else {
    $rows = @($rows | Where-Object { $_.end -and -not $_.start })
  }
  if (-not $rows.Count) { return $null }
  # A later filing can restate an earlier period, so sort on the period end, then on the
  # date the value was filed — the newest statement of the newest period wins.
  $rows | Sort-Object @{ E = { [datetime]$_.end } }, @{ E = { [datetime]$_.filed } } | Select-Object -Last 1
}

# Returns a hashtable of unit -> best annual hit for one metric. Keeping the units apart
# matters: TSMC files the same statements in TWD and in a USD convenience translation, and
# a ratio that took its numerator from one and its denominator from the other would be off
# by the exchange rate without looking wrong.
function Read-MetricByUnit {
  param([string]$Ticker, [string]$Cik, [string]$Metric)
  $byUnit = @{}
  foreach ($tax in @('us-gaap','ifrs-full')) {
    foreach ($tag in $TAGS[$Metric][$tax]) {
      $doc = Get-Concept -Ticker $Ticker -Cik $Cik -Taxonomy $tax -Tag $tag
      if (-not $doc -or -not $doc.units) { continue }
      foreach ($unitName in $doc.units.PSObject.Properties.Name) {
        $hit = Select-Annual -Rows $doc.units.$unitName -IsFlow ($FLOWS -contains $Metric)
        if (-not $hit) { continue }
        $cand = [pscustomobject]@{
          value = [double]$hit.val; tag = $tag; taxonomy = $tax
          unit = $unitName; end = $hit.end; fy = $hit.fy; form = $hit.form
        }
        $prev = $byUnit[$unitName]
        # Later period wins; on a tie the tag listed first in $TAGS wins, so the loop order
        # is the priority order.
        if (-not $prev -or ([datetime]$cand.end -gt [datetime]$prev.end)) { $byUnit[$unitName] = $cand }
      }
    }
  }
  return $byUnit
}

# The reporting currency is whichever unit the filer tags most completely — a convenience
# translation only ever covers a subset of the statements.
function Select-ReportingUnit {
  param($MetricHits)
  $score = @{}
  foreach ($metric in $MetricHits.Keys) {
    foreach ($unit in $MetricHits[$metric].Keys) {
      if (-not $score.ContainsKey($unit)) { $score[$unit] = 0 }
      $score[$unit]++
    }
  }
  if (-not $score.Count) { return $null }
  ($score.GetEnumerator() | Sort-Object -Property Value, Name -Descending | Select-Object -First 1).Name
}

$records = @()
foreach ($ticker in $CIKS.Keys) {
  $cik = $CIKS[$ticker]
  Write-Host ("{0,-5}" -f $ticker) -NoNewline
  $rec  = [ordered]@{ ticker = $ticker }
  $meta = [ordered]@{}

  $hits = [ordered]@{}
  foreach ($metric in $TAGS.Keys) { $hits[$metric] = Read-MetricByUnit -Ticker $ticker -Cik $cik -Metric $metric }
  $unit = Select-ReportingUnit -MetricHits $hits

  # Everything is read against the revenue period. A tag a filer stopped using years ago
  # still answers — Grupo Aeroportuario's last tagged capex is from 2018 — and pairing it
  # with a current revenue line would invent a ratio no filing supports. Drop it instead.
  $refUnit = $hits['revenue'][$unit]
  $refEnd  = if ($refUnit) { [datetime]$refUnit.end } else { $null }
  $stale   = @()

  foreach ($metric in $TAGS.Keys) {
    $hit = if ($unit) { $hits[$metric][$unit] } else { $null }
    if ($hit -and $refEnd -and (($refEnd - [datetime]$hit.end).Days -gt 400)) {
      $stale += "$metric (last tagged $($hit.end))"
      $hit = $null
    }
    $rec[$metric] = if ($hit) { $hit.value } else { $null }
    if ($hit) { $meta[$metric] = "$($hit.tag) · $($hit.end) · $($hit.form)" }
  }
  # Gross profit is the one figure a filer may leave implicit; back it out of cost of sales.
  if ($null -eq $rec.grossProfit -and $null -ne $rec.revenue -and $null -ne $rec.costOfSales) {
    $rec.grossProfit = $rec.revenue - $rec.costOfSales
    $meta['grossProfit'] = 'derived: revenue - costOfSales'
  }
  $rev = if ($unit) { $hits['revenue'][$unit] } else { $null }
  $rec['currency']   = $unit
  $rec['periodEnd']  = if ($rev) { $rev.end }  else { $null }
  $rec['form']       = if ($rev) { $rev.form } else { $null }
  $rec['stale']      = if ($stale.Count) { $stale } else { $null }
  $rec['sources']    = $meta
  $records += [pscustomobject]$rec
  Write-Host ("rev {0,16:N0} {1}  ppe {2,16:N0}  capex {3,14:N0}  [{4}]" -f `
    $rec.revenue, $rec.currency, $rec.ppe, $rec.capex, $rec.periodEnd)
}

$stamp  = (Get-Date).ToString('yyyy-MM-dd')
$json   = $records | ConvertTo-Json -Depth 6
$header = @"
// spectrum-measured-data.js - GENERATED. Do not edit by hand.
//
// Source: SEC XBRL company concepts (data.sec.gov), latest annual filing per company -
// 10-K for the US filers, 20-F for TSM, SPOT, PAC and TBBB. Regenerate with:
//
//   .\scripts\spectrum\fetch-fundamentals.ps1
//
// Every figure below is as-filed. ``sources`` records the exact XBRL tag, the period-end date
// and the form each number came from, so any position on the measured layer can be traced
// back to a filing. ``null`` means the company does not report that line - the formula in
// js/spectrum-measured.js drops the term rather than substituting a guess.
//
// Amounts are in each filer's own reporting currency (see ``currency``); the formula only ever
// divides two figures from the same filing, so no FX conversion is involved.
//
// Generated $stamp.

export const SPECTRUM_FUNDAMENTALS = $json;
"@
$header | Set-Content -Path $Out -Encoding utf8
Write-Host "`nWrote $Out ($($records.Count) companies)"
