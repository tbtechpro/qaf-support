Add-Type -AssemblyName System.Drawing
function New-Icon($size, $out) {
  $bmp = New-Object Drawing.Bitmap($size, $size)
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $rect = New-Object Drawing.Rectangle(0, 0, $size, $size)
  $brush = New-Object Drawing.Drawing2D.LinearGradientBrush($rect, [Drawing.Color]::FromArgb(139,92,246), [Drawing.Color]::FromArgb(16,217,163), 45.0)
  $g.FillRectangle($brush, $rect)
  $inner = New-Object Drawing.Rectangle([int]($size*0.11), [int]($size*0.11), [int]($size*0.78), [int]($size*0.78))
  $dark = New-Object Drawing.SolidBrush([Drawing.Color]::FromArgb(13,20,40))
  $g.FillRectangle($dark, $inner)
  $fs = [float]($size * 0.52)
  $font = New-Object Drawing.Font("Segoe UI", $fs, [Drawing.FontStyle]::Bold, [Drawing.GraphicsUnit]::Pixel)
  $white = New-Object Drawing.SolidBrush([Drawing.Color]::White)
  $fmt = New-Object Drawing.StringFormat
  $fmt.Alignment = [Drawing.StringAlignment]::Center
  $fmt.LineAlignment = [Drawing.StringAlignment]::Center
  $rf = New-Object Drawing.RectangleF(0, [float]($size * 0.02), [float]$size, [float]($size * 0.96))
  $g.DrawString("Q", $font, $white, $rf, $fmt)
  $bmp.Save($out, [Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
  Write-Output "wrote $out"
}
New-Icon 192 "web/public/icon-192.png"
New-Icon 512 "web/public/icon-512.png"
New-Icon 512 "web/public/maskable-512.png"
