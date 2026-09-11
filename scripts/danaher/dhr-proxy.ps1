$cik='0000313616'; $agent='Summit Research salvarez@summit-mgmtx.com'
$dir="$env:LOCALAPPDATA\Temp\claude\dhr-edgar\proxy"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$subPath = "$env:LOCALAPPDATA\Temp\claude\dhr-edgar\seg\sub.json"
$sub = Get-Content $subPath -Raw | ConvertFrom-Json
$r=$sub.filings.recent
for($i=0;$i -lt $r.form.Count;$i++){
  if($r.form[$i] -match '^(DEF 14A|DEFA14A)$'){
    Write-Host ("{0}  {1}  {2}  {3}" -f $r.form[$i], $r.filingDate[$i], $r.accessionNumber[$i], $r.primaryDocument[$i])
  }
}
