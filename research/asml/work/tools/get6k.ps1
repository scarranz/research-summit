param([string]$Out, [string[]]$Items)
# Items: "label=accession"
$ErrorActionPreference = 'Continue'
$ua = 'Summit Research research@summit-mgmtx.com'
New-Item -ItemType Directory -Force $Out | Out-Null
function Conv([string]$raw) {
  $t = [regex]::Replace($raw, '(?is)<(script|style)[^>]*>.*?</\1>', ' ')
  $t = [regex]::Replace($t, '(?is)<ix:header>.*?</ix:header>', ' ')
  $t = [regex]::Replace($t, '(?i)</(p|div|tr|li|h\d|table)>', "`n")
  $t = [regex]::Replace($t, '(?i)</t[dh]>', ' | ')
  $t = [regex]::Replace($t, '<[^>]+>', ' ')
  $t = [System.Net.WebUtility]::HtmlDecode($t)
  $t = [regex]::Replace($t, '[ \t ]+', ' ')
  $t = [regex]::Replace($t, '( \| )+', ' | ')
  $t = [regex]::Replace($t, '(\s*\n\s*)+', "`n")
  return $t
}
foreach ($it in $Items) {
  $label, $acc = $it.Split('=')
  $dir = Join-Path $Out $label; New-Item -ItemType Directory -Force $dir | Out-Null
  $base = "https://www.sec.gov/Archives/edgar/data/937966/$($acc -replace '-','')"
  try {
    $idx = Invoke-WebRequest -Uri "$base/index.json" -UserAgent $ua -UseBasicParsing | ConvertFrom-Json
  } catch { "$label index fail $_"; continue }
  foreach ($f in $idx.directory.item) {
    $n = $f.name
    if ($n -match '\.(htm|html|txt)$' -and $n -notmatch 'index' -and $n -notmatch "^$($acc)\.txt$") {
      $p = Join-Path $dir $n
      if (-not (Test-Path $p)) {
        try { Invoke-WebRequest -Uri "$base/$n" -UserAgent $ua -OutFile $p -UseBasicParsing; Start-Sleep -Milliseconds 250 } catch { "$label $n fail"; continue }
      }
      $raw = [IO.File]::ReadAllText($p)
      $t = Conv $raw
      $flat = [regex]::Replace($t, '\s*\|\s*', ' ')
      $flat = [regex]::Replace($flat, '\s+', ' ')
      [IO.File]::WriteAllText((Join-Path $dir ($n + '.flat.txt')), $flat, [Text.Encoding]::UTF8)
      "{0} {1} {2}" -f $label, $n, $flat.Length
    }
  }
}
