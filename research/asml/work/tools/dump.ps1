param([string]$root, [string]$sheet, [string]$out, [int]$maxCol = 60)
# Dumps a sheet as tab-separated rows: rowNum <tab> cellRef=value ...
$ss = @()
$ssPath = Join-Path $root 'xl\sharedStrings.xml'
if (Test-Path $ssPath) {
  [xml]$sx = Get-Content $ssPath -Raw -Encoding UTF8
  foreach ($si in $sx.sst.si) {
    if ($si.t -ne $null) { if ($si.t -is [string]) { $ss += $si.t } else { $ss += $si.t.'#text' } }
    else { $ss += (($si.r | ForEach-Object { if ($_.t -is [string]) { $_.t } else { $_.t.'#text' } }) -join '') }
  }
}
$reader = [System.Xml.XmlReader]::Create((Join-Path $root "xl\worksheets\$sheet"))
$sw = New-Object System.IO.StreamWriter($out, $false, [System.Text.Encoding]::UTF8)
$line = $null; $ref = $null; $type = $null; $val = $null; $inV = $false
function ColNum($r) { $c = ($r -replace '\d', ''); $n = 0; foreach ($ch in $c.ToCharArray()) { $n = $n * 26 + ([int]$ch - 64) }; $n }
while ($reader.Read()) {
  if ($reader.NodeType -eq 'Element') {
    if ($reader.Name -eq 'row') { if ($line) { $sw.WriteLine($line) }; $line = $reader.GetAttribute('r') }
    elseif ($reader.Name -eq 'c') { $ref = $reader.GetAttribute('r'); $type = $reader.GetAttribute('t'); $val = $null }
    elseif ($reader.Name -eq 'v') { $inV = $true }
    elseif ($reader.Name -eq 't' -and $type -eq 'inlineStr') { $inV = $true }
  } elseif ($reader.NodeType -eq 'Text' -and $inV) {
    $val = $reader.Value
    if ($type -eq 's') { $val = $ss[[int]$val] }
    elseif ($type -ne 'str' -and $type -ne 'inlineStr' -and $type -ne 'e' -and $type -ne 'b') { $d = 0.0; if ([double]::TryParse($val, [ref]$d)) { $val = [math]::Round($d, 4).ToString() } }
    if ((ColNum $ref) -le $maxCol -and $val -ne '' -and $val -ne '0') { $line += "`t$ref=$val" }
    $inV = $false
  } elseif ($reader.NodeType -eq 'EndElement' -and ($reader.Name -eq 'v' -or $reader.Name -eq 't')) { $inV = $false }
}
if ($line) { $sw.WriteLine($line) }
$sw.Close(); $reader.Close()
