$agent='Summit Research salvarez@summit-mgmtx.com'
$dir="$env:LOCALAPPDATA\Temp\claude\dhr-edgar\seg"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
function Dump($acc,$rf,$title){
  $p=Join-Path $dir "$acc.$rf"
  if(-not (Test-Path $p)){
    try{ Invoke-WebRequest -Uri "https://www.sec.gov/Archives/edgar/data/313616/$acc/$rf" -UseBasicParsing -Headers @{'User-Agent'=$agent} -OutFile $p -TimeoutSec 60 | Out-Null; Start-Sleep -Milliseconds 150 }
    catch{ Write-Host "ERR $rf : $($_.Exception.Message)"; return }
  }
  $h=Get-Content $p -Raw
  Write-Host "`n########## $title"
  foreach($r in [regex]::Matches($h,'(?is)<tr[^>]*>(.*?)</tr>')){
    $vals=@()
    foreach($c in [regex]::Matches($r.Groups[1].Value,'(?is)<t[dh][^>]*>(.*?)</t[dh]>')){
      $t=$c.Groups[1].Value -replace '(?is)<[^>]+>',' '; $t=[System.Net.WebUtility]::HtmlDecode($t) -replace '\s+',' '; $vals+=$t.Trim()
    }
    $line=($vals -join ' | ').Trim(' |')
    if($line -and $line -notmatch '^(\|| )*$' -and $line -notmatch 'Namespace|Data Type|Balance Type|Period Type|^\+ Details|^- Definition|^- References'){ Write-Host $line }
  }
}
Dump '000031361626000062' 'R64.htm' 'FY2025 10-K - Operations in Geographical Areas'
Dump '000031361626000062' 'R62.htm' 'FY2025 10-K - Segment Narrative'
