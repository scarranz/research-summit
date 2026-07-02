param([int]$Port = 8000)

$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Research Summit corriendo en http://localhost:$Port/  (Ctrl+C para detener)"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".htm"  = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
  ".woff" = "font/woff"
  ".woff2"= "font/woff2"
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
    # Rutas limpias (igual que Netlify): "/" -> index.html, "/login" -> login.html
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "index.html" }
    elseif ($rel -eq "login") { $rel = "login.html" }
    $path = Join-Path $root $rel
    # Si la ruta no existe como archivo, caer a index.html (comportamiento de la app)
    if (-not (Test-Path $path -PathType Leaf)) { $path = Join-Path $root "index.html" }
    if (Test-Path $path -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] }
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rel")
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.OutputStream.Close()
  } catch {
    Write-Host "err: $($_.Exception.Message)"
  }
}
