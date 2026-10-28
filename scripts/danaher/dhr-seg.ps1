# Segment notes are DIMENSIONAL XBRL facts, which the companyconcept API does not return.
# They are, however, in every filing's rendered "Financial Report" R-files. Walk the 10-K list,
# find the segment report in each FilingSummary.xml, and dump its table as text.
$cik='0000313616'; $agent='Summit Research salvarez@summit-mgmtx.com'
$dir="$env:LOCALAPPDATA\Temp\claude\dhr-edgar\seg"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
function Get-Url($u,$out){
  if(Test-Path $out){ return Get-Content $out -Raw }
  Invoke-WebRequest -Uri $u -UseBasicParsing -Headers @{'User-Agent'=$agent} -OutFile $out -TimeoutSec 60 | Out-Null
  Start-Sleep -Milliseconds 140
  return Get-Content $out -Raw
}
$sub = Get-Url "https://data.sec.gov/submissions/CIK$cik.json" (Join-Path $dir 'sub.json') | ConvertFrom-Json
$r = $sub.filings.recent
$tenKs=@()
for($i=0;$i -lt $r.form.Count;$i++){
  if($r.form[$i] -eq '10-K'){ $tenKs += [pscustomobject]@{ acc=$r.accessionNumber[$i]; date=$r.filingDate[$i] } }
}
Write-Host "10-K filings found: $($tenKs.Count)"
foreach($f in $tenKs | Select-Object -First 6){
  $a=$f.acc -replace '-',''
  $base="https://www.sec.gov/Archives/edgar/data/313616/$a"
  Write-Host "`n=== 10-K filed $($f.date)  $base"
  try{
    $fs = Get-Url "$base/FilingSummary.xml" (Join-Path $dir "$a.FilingSummary.xml")
    $x=[xml]$fs
    $hits = $x.FilingSummary.MyReports.Report | Where-Object { $_.ShortName -match '(?i)segment' }
    foreach($h in $hits){ Write-Host ("   {0}  ->  {1}" -f $h.HtmlFileName, $h.ShortName) }
  } catch { Write-Host "   err: $($_.Exception.Message)" }
}
