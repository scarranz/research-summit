param([string]$Dir)
$raw = Get-Content (Join-Path $Dir 'raw.json') -Raw -Encoding UTF8 | ConvertFrom-Json
function Rnd($x, $d = 1) { if ($null -eq $x) { return $null }; return [Math]::Round([double]$x, $d) }
function Pct($a, $b) { if ($null -eq $a -or $null -eq $b -or $b -eq 0) { return $null }; return [Math]::Round(100.0 * $a / $b, 1) }
$years = [ordered]@{}
foreach ($y in 2015..2025) {
  $r = $raw.years."$y"
  $o = [ordered]@{}
  $o.fiscal_year = $y
  $o.accounting_basis = $r.basis
  $o.source_financials = $r.src_pl
  $o.income_statement = [ordered]@{
    net_sales = $r.net_sales; system_sales = $r.system_sales
    ibm_sales = [ordered]@{ total = $r.ibm_sales; service = $null; field_options_upgrades = $null; note = 'Installed Base Management = net service and field option sales; ASML does not disclose a service vs field-option split in the 20-F' }
    cost_of_sales = $r.cost_of_sales; gross_profit = $r.gross_profit; gross_margin_pct = (Pct $r.gross_profit $r.net_sales)
    rd = $r.rd; sga = $r.sga; other_income = $r.other_income
    operating_income = $r.operating_income; operating_margin_pct = (Pct $r.operating_income $r.net_sales)
    pretax_income = $r.pretax_income; income_tax = $r.income_tax; effective_tax_rate_pct = (Pct $r.income_tax $r.pretax_income)
    net_income = $r.net_income; eps_diluted_eur = $r.eps_diluted; diluted_shares_m = $r.diluted_shares_m
  }
  $fcf = Rnd ($r.cfo - $r.capex_ppe - $r.capex_intangibles) 1
  $o.cash_flow = [ordered]@{
    depreciation_amortization = $r.da; share_based_comp = $r.sbc; cfo = $r.cfo
    capex_ppe = $r.capex_ppe; capex_intangibles = $r.capex_intangibles; capex_total = (Rnd ($r.capex_ppe + $r.capex_intangibles) 1)
    free_cash_flow = $fcf; free_cash_flow_def = 'CFO - purchase of PP&E - purchase of intangible assets (ASML definition; derived, matches ASML-stated FCF for 2024 9,083.1 and 2025 11,027.3)'
    dividends_paid = $r.dividends_paid; buybacks = $r.buybacks; total_returned = (Rnd ($r.dividends_paid + $r.buybacks) 1)
  }
  $o.balance_sheet_ye = [ordered]@{
    cash_and_equivalents = $r.cash; short_term_investments = $r.st_investments; cash_and_investments = (Rnd ($r.cash + $r.st_investments) 1)
    debt_current = $r.debt_current; debt_long_term = $r.debt_lt; total_debt = (Rnd ($r.debt_current + $r.debt_lt) 1)
    total_debt_def = 'Balance-sheet current portion of long-term debt / short-term borrowings + long-term debt (includes finance lease liabilities and hedge fair-value adjustments where present)'
  }
  $o.dps_declared_for_year_eur = $r.dps_declared_for_year
  # technology
  $tech = [ordered]@{}
  foreach ($p in $r.tech.PSObject.Properties) {
    $u = $p.Value[0]; $e = $p.Value[1]
    $asp = $null; if ($u -gt 0) { $asp = [Math]::Round($e / $u, 1) }
    $tech[$p.Name] = [ordered]@{ units = $u; eur_m = $e; asp_eur_m = $asp; pct_of_system_sales = (Pct $e $r.tech.Total[1]) }
  }
  if (-not $r.tech.PSObject.Properties['NXE']) { $tech['EUV_split_note'] = 'NXE (0.33 NA) vs EXE (0.55 NA High-NA) not split before 2023; FY2025 20-F shows EXE = 0 units / EUR 0 in 2023, first EXE revenue in 2024' }
  $tech['source'] = $r.tech_src
  $o.system_sales_by_technology = $tech
  if ($r.asc606_restated) { $o.asc606_restated = $r.asc606_restated }
  if ($r.as_reported_pre606) { $o.as_reported_pre_asc606 = $r.as_reported_pre606 }
  $o.system_sales_new_vs_used = [ordered]@{
    new_eur = $r.new_used_eur[0]; used_eur = $r.new_used_eur[1]
    litho_units_new = $r.litho_units_new_used[0]; litho_units_used = $r.litho_units_new_used[1]; litho_units_total = $r.litho_units_total
    note = 'EUR from segment note (incl. M&I); units are lithography systems only (exclude metrology & inspection), from Q4 results press releases'
  }
  $eu = $r.end_use; $eut = $eu.logic_eur + $eu.memory_eur
  $o.end_use = [ordered]@{ logic_eur = $eu.logic_eur; memory_eur = $eu.memory_eur; logic_pct = (Pct $eu.logic_eur $eut); memory_pct = (Pct $eu.memory_eur $eut); logic_units = $eu.logic_units; memory_units = $eu.memory_units; basis = $eu.basis; source = $eu.src }
  $g = $r.geo; $tot = $g.Total
  $geo = [ordered]@{}
  foreach ($p in $g.PSObject.Properties) { if ($p.Name -ne 'Total') { $geo[$p.Name] = [ordered]@{ eur_m = $p.Value; pct = (Pct $p.Value $tot) } } }
  $geo['Total'] = $tot
  $geo['derived_Rest_of_Asia_incl_Singapore'] = [ordered]@{ eur_m = (Rnd ($g.Singapore + $g.'Rest of Asia') 1); pct = (Pct ($g.Singapore + $g.'Rest of Asia') $tot) }
  $geo['derived_EMEA_incl_Netherlands'] = [ordered]@{ eur_m = (Rnd ($g.EMEA + $g.Netherlands) 1); pct = (Pct ($g.EMEA + $g.Netherlands) $tot) }
  $geo['basis'] = 'Total net sales (systems + IBM) by location of customer facilities; regions as reported; pct derived'
  $geo['source'] = $r.geo_src
  $o.net_sales_by_customer_location = $geo
  $cc = [ordered]@{ largest_customer_eur = $r.largest_customer[0]; largest_customer_pct = $r.largest_customer[1] }
  if ($r.customers_gt10) { $cc.n_customers_gt10pct = $r.customers_gt10[0]; $cc.customers_gt10pct_eur = $r.customers_gt10[1]; $cc.customers_gt10pct_pct = $r.customers_gt10[2]; $cc.source_gt10 = $r.customers_gt10_src }
  else { $cc.n_customers_gt10pct = $null; $cc.customers_gt10pct_eur = $null; $cc.customers_gt10pct_pct = $null; $cc.source_gt10 = 'Not disclosed for this year (only largest customer given)' }
  $o.customer_concentration = $cc
  $o.employees_ye = [ordered]@{ payroll_fte = $r.fte_payroll_ye; temporary_fte = $r.fte_temporary_ye; total_fte = ($r.fte_payroll_ye + $r.fte_temporary_ye) }
  $bl = [ordered]@{ value_eur_m = $r.backlog_eur; euv_share_pct = $r.backlog_euv_share_pct }
  if ($r.backlog_litho_units) { $bl.litho_units = $r.backlog_litho_units }
  if ($r.backlog_euv_note) { $bl.euv_note = $r.backlog_euv_note }
  if ($r.backlog_src) { $bl.source = $r.backlog_src }
  $o.backlog_ye = $bl
  $o.net_bookings = [ordered]@{ value_eur_m = $r.net_bookings_eur; litho_units = $r.net_bookings_litho_units }
  $o.installed_base_systems = $r.installed_base_systems
  if ($r.installed_base_src) { $o.installed_base_source = $r.installed_base_src }
  $years["$y"] = $o
}
$targets = Get-Content (Join-Path $Dir 'targets.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$out = [ordered]@{
  company = 'ASML Holding N.V.'; cik = '0000937966'; currency = 'EUR'; units = 'EUR millions unless noted (units = systems; asp in EUR m per system; pct in %)'
  gaap = 'US GAAP'; built = '2026-10-19'
  notes = 'See annual_notes.md for sources, restatements and gaps. Derived fields: margins, ETR, FCF, ASPs, percentages, totals.'
  years = $years
  targets = $targets
}
$json = $out | ConvertTo-Json -Depth 12
[IO.File]::WriteAllText((Join-Path $Dir 'annual.json'), $json, (New-Object System.Text.UTF8Encoding($false)))
'ok'
