param([string]$Out)
$ErrorActionPreference = 'Stop'
$ua = 'Summit Research research@summit-mgmtx.com'
$list = @(
 @('2024','0000937966-25-000009','asml-20241231.htm'),
 @('2023','0000937966-24-000008','asml-20231231.htm'),
 @('2022','0000937966-23-000014','asml-20221231.htm'),
 @('2021','0000937966-22-000013','asml-20211231.htm'),
 @('2020','0000937966-21-000007','asml-20201231.htm'),
 @('2019','0000937966-20-000011','a2019integratedreportb.htm'),
 @('2018','0000937966-19-000007','a2018integratedreportbased.htm'),
 @('2017','0000937966-18-000007','a2017integratedreportbased.htm'),
 @('2016','0000937966-17-000007','a20-fasml2016.htm'),
 @('2015','0000937966-16-000017','a20-fasml2015.htm')
)
New-Item -ItemType Directory -Force $Out | Out-Null
foreach ($f in $list) {
  $fy=$f[0]; $acc=$f[1]; $doc=$f[2]
  $dir = Join-Path $Out "fy$fy"; New-Item -ItemType Directory -Force $dir | Out-Null
  $htm = Join-Path $dir 'doc.htm'
  if (-not (Test-Path $htm)) {
    $url = "https://www.sec.gov/Archives/edgar/data/937966/$($acc -replace '-','')/$doc"
    Invoke-WebRequest -Uri $url -UserAgent $ua -OutFile $htm -UseBasicParsing
    Start-Sleep -Milliseconds 300
  }
  $raw = [IO.File]::ReadAllText($htm)
  $t = [regex]::Replace($raw, '(?is)<(script|style)[^>]*>.*?</\1>', ' ')
  $t = [regex]::Replace($t, '(?is)<ix:header>.*?</ix:header>', ' ')
  $t = [regex]::Replace($t, '(?i)</(p|div|tr|li|h\d|table)>', "`n")
  $t = [regex]::Replace($t, '(?i)</t[dh]>', ' | ')
  $t = [regex]::Replace($t, '<[^>]+>', ' ')
  $t = [System.Net.WebUtility]::HtmlDecode($t)
  $t = [regex]::Replace($t, '[ \t ]+', ' ')
  $t = [regex]::Replace($t, '( \| )+', ' | ')
  $t = [regex]::Replace($t, '(\s*\n\s*)+', "`n")
  [IO.File]::WriteAllText((Join-Path $dir 'doc.txt'), $t, [Text.Encoding]::UTF8)
  "{0} {1} bytes htm, {2} chars txt" -f $fy, (Get-Item $htm).Length, $t.Length
}
