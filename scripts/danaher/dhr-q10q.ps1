$cik='0000313616'; $agent='Summit Research salvarez@summit-mgmtx.com'
$dir="$env:LOCALAPPDATA\Temp\claude\dhr-edgar\seg"
function Get-Url($u,$out){
  if(-not (Test-Path $out)){
    try{ Invoke-WebRequest -Uri $u -UseBasicParsing -Headers @{'User-Agent'=$agent} -OutFile $out -TimeoutSec 60 | Out-Null; Start-Sleep -Milliseconds 150 }
    catch{ return $null }
  }
  Get-Content $out -Raw
}
$sub = Get-Content (Join-Path $dir 'sub.json') -Raw | ConvertFrom-Json
$r=$sub.filings.recent; $qs=@()
for($i=0;$i -lt $r.form.Count;$i++){ if($r.form[$i] -eq '10-Q'){ $qs += [pscustomobject]@{acc=$r.accessionNumber[$i]; date=$r.filingDate[$i]} } }
foreach($f in $qs | Where-Object { [datetime]$_.date -ge [datetime]'2024-01-01' } | Sort-Object date){
  $a=$f.acc -replace '-',''
  $fs = Get-Url "https://www.sec.gov/Archives/edgar/data/313616/$a/FilingSummary.xml" (Join-Path $dir "$a.FS.xml")
  if(-not $fs){ continue }
  $x=[xml]$fs
  $hit = $x.FilingSummary.MyReports.Report | Where-Object { $_.ShortName -match '(?i)segment.*(data|results).*details' } | Select-Object -First 1
  if(-not $hit){ continue }
  $h = Get-Url "https://www.sec.gov/Archives/edgar/data/313616/$a/$($hit.HtmlFileName)" (Join-Path $dir "$a.$($hit.HtmlFileName)")
  if(-not $h){ continue }
  Write-Host "`n########## 10-Q filed $($f.date)  [$($hit.ShortName)]"
  $seg=''
  foreach($rw in [regex]::Matches($h,'(?is)<tr[^>]*>(.*?)</tr>')){
    $vals=@()
    foreach($c in [regex]::Matches($rw.Groups[1].Value,'(?is)<t[dh][^>]*>(.*?)</t[dh]>')){
      $t=$c.Groups[1].Value -replace '(?is)<[^>]+>',' '; $t=[System.Net.WebUtility]::HtmlDecode($t) -replace '\s+',' '; $vals+=$t.Trim()
    }
    $line=($vals -join ' | ').Trim(' |')
    if($line -match '^(Biotechnology|Life Sciences|Diagnostics|Other)\b'){ $seg=($line -split '\|')[0].Trim() }
    if($line -match '^(Sales|Operating profit|Months Ended|.*Mar\.|.*Jun\.|.*Sep\.)'){ Write-Host ("[{0,-14}] {1}" -f $seg,$line) }
  }
}
