$agent='Summit Research salvarez@summit-mgmtx.com'
$dir="$env:LOCALAPPDATA\Temp\claude\dhr-edgar\seg"
function Get-Url($u,$out){
  if(-not (Test-Path $out)){
    Invoke-WebRequest -Uri $u -UseBasicParsing -Headers @{'User-Agent'=$agent} -OutFile $out -TimeoutSec 60 | Out-Null
    Start-Sleep -Milliseconds 140
  }
  Get-Content $out -Raw
}
# Flatten an EDGAR R-file table to pipe-separated rows.
function Show($acc,$rfile,$title){
  $base="https://www.sec.gov/Archives/edgar/data/313616/$acc"
  $h = Get-Url "$base/$rfile" (Join-Path $dir "$acc.$rfile")
  Write-Host "`n########## $title  ($rfile, $acc)"
  $rows = [regex]::Matches($h,'(?is)<tr[^>]*>(.*?)</tr>')
  foreach($r in $rows){
    $cells = [regex]::Matches($r.Groups[1].Value,'(?is)<t[dh][^>]*>(.*?)</t[dh]>')
    $vals=@()
    foreach($c in $cells){
      $t = $c.Groups[1].Value -replace '(?is)<[^>]+>',' '
      $t = [System.Net.WebUtility]::HtmlDecode($t) -replace '\s+',' '
      $vals += $t.Trim()
    }
    $line = ($vals -join ' | ').Trim(' |')
    if($line -and $line -notmatch '^(\|| )*$'){ Write-Host $line }
  }
}
Show '000031361625000043' 'R64.htm' 'FY2024 10-K - Segment Data'
Show '000031361623000087' 'R59.htm' 'FY2022 10-K - Segment Results'
Show '000031361626000062' 'R64.htm' 'FY2025 10-K - Geography'
