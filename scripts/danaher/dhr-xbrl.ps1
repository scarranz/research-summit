# dhr-xbrl.ps1 - one-off SEC XBRL pull for Danaher (CIK 0000313616).
# Same fetch discipline as scripts/spectrum/fetch-metrics.ps1, wider concept set, and it keeps
# instant facts (balance sheet) as well as duration facts (P&L, cash flow). Read-only; writes
# a single JSON to the scratchpad. Nothing in the repo is touched.
param(
  [string]$Cik      = '0000313616',
  [string]$Out      = "$PSScriptRoot\dhr-xbrl.json",
  [string]$CacheDir = "$env:LOCALAPPDATA\Temp\claude\dhr-edgar",
  [string]$Agent    = 'Summit Research salvarez@summit-mgmtx.com',
  [switch]$Refresh
)
$ErrorActionPreference = 'Stop'

# Candidate tags per line, best first. Danaher rotates a few of these across years.
$TAGS = [ordered]@{
  revenue      = @('RevenueFromContractWithCustomerExcludingAssessedTax','Revenues')
  costOfSales  = @('CostOfRevenue','CostOfGoodsAndServicesSold')
  grossProfit  = @('GrossProfit')
  sga          = @('SellingGeneralAndAdministrativeExpense')
  rnd          = @('ResearchAndDevelopmentExpense')
  operating    = @('OperatingIncomeLoss')
  interestExp  = @('InterestExpense','InterestIncomeExpenseNet')
  pretax       = @('IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest','IncomeLossFromContinuingOperationsBeforeIncomeTaxesMinorityInterestAndIncomeLossFromEquityMethodInvestments')
  tax          = @('IncomeTaxExpenseBenefit')
  netIncome    = @('NetIncomeLoss','ProfitLoss')
  epsDiluted   = @('EarningsPerShareDiluted')
  epsBasic     = @('EarningsPerShareBasic')
  shsDiluted   = @('WeightedAverageNumberOfDilutedSharesOutstanding')
  shsBasic     = @('WeightedAverageNumberOfSharesOutstandingBasic','WeightedAverageNumberOfSharesOutstanding')
  cfo          = @('NetCashProvidedByUsedInOperatingActivities','NetCashProvidedByUsedInOperatingActivitiesContinuingOperations')
  capex        = @('PaymentsToAcquirePropertyPlantAndEquipment','PaymentsToAcquireProductiveAssets')
  da           = @('DepreciationDepletionAndAmortization','DepreciationAmortizationAndAccretionNet','DepreciationAndAmortization')
  dep          = @('Depreciation')
  amort        = @('AmortizationOfIntangibleAssets')
  sbc          = @('ShareBasedCompensation')
  divPaid      = @('PaymentsOfDividendsCommonStock','PaymentsOfDividends')
  divPerShare  = @('CommonStockDividendsPerShareDeclared','CommonStockDividendsPerShareCashPaid')
  buybacks     = @('PaymentsForRepurchaseOfCommonStock')
  acqSpend     = @('PaymentsToAcquireBusinessesNetOfCashAcquired')
  # Balance sheet - instant facts.
  cash         = @('CashAndCashEquivalentsAtCarryingValue')
  debtCurrent  = @('LongTermDebtCurrent','DebtCurrent')
  debtLong     = @('LongTermDebtNoncurrent','LongTermDebt')
  equity       = @('StockholdersEquity')
  assets       = @('Assets')
  goodwill     = @('Goodwill')
  intangibles  = @('FiniteLivedIntangibleAssetsNet','IntangibleAssetsNetExcludingGoodwill')
  shsOut       = @('EntityCommonStockSharesOutstanding','CommonStockSharesOutstanding')
}

function Get-Concept {
  param([string]$Taxonomy, [string]$Tag)
  New-Item -ItemType Directory -Force -Path $CacheDir | Out-Null
  $path = Join-Path $CacheDir "$Taxonomy.$Tag.json"
  if ($Refresh -or -not (Test-Path $path)) {
    try {
      Invoke-WebRequest -Uri "https://data.sec.gov/api/xbrl/companyconcept/CIK$Cik/$Taxonomy/$Tag.json" `
        -UseBasicParsing -Headers @{ 'User-Agent' = $Agent } -OutFile $path -TimeoutSec 60 | Out-Null
    } catch {
      '{"units":{}}' | Set-Content -Path $path -Encoding utf8
    }
    Start-Sleep -Milliseconds 120
  }
  try { return (Get-Content $path -Raw | ConvertFrom-Json) } catch { return $null }
}

$facts = [ordered]@{}
foreach ($metric in $TAGS.Keys) {
  Write-Host ("{0,-12}" -f $metric) -NoNewline
  $best = @{}   # "start|end" -> row ; newest filing / best tag wins
  $prio = 0
  foreach ($tag in $TAGS[$metric]) {
    $prio++
    foreach ($tax in @('us-gaap','dei')) {
      $doc = Get-Concept -Taxonomy $tax -Tag $tag
      if (-not $doc -or -not $doc.units) { continue }
      foreach ($unit in $doc.units.PSObject.Properties.Name) {
        foreach ($r in $doc.units.$unit) {
          if (-not $r.end) { continue }
          $start = if ($r.start) { $r.start } else { '' }
          $days  = if ($r.start) { ([datetime]$r.end - [datetime]$r.start).Days } else { 0 }
          $key = "$start|$($r.end)"
          $cand = [pscustomobject]@{
            v = [double]$r.val; start = $start; end = $r.end; days = $days
            unit = $unit; form = $r.form; fy = $r.fy; fp = $r.fp; filed = $r.filed; tag = $tag; prio = $prio
          }
          $prev = $best[$key]
          if (-not $prev -or $cand.prio -lt $prev.prio -or
              ($cand.prio -eq $prev.prio -and [datetime]$cand.filed -gt [datetime]$prev.filed)) {
            $best[$key] = $cand
          }
        }
      }
    }
  }
  # Keep annuals (10-K windows), quarters, year-to-date stretches and every instant.
  $rows = $best.Values | Where-Object { $_.form -match '^(10-K|10-Q|8-K|20-F)' } |
          Sort-Object @{E={[datetime]$_.end}}, @{E={$_.days}}
  $facts[$metric] = @($rows)
  Write-Host ("{0,4} facts" -f $facts[$metric].Count)
}

($facts | ConvertTo-Json -Depth 6) | Set-Content -Path $Out -Encoding utf8
Write-Host "`nwrote $Out"
