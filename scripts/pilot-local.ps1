# Local Windows pilot runner — no Docker, no card, no cloud.
# Starts: PocketBase :8090 (exe, with migrations) + Next.js web :3000 + reminder worker.
# Idempotent: safe to re-run (skips services already listening). Logs in .local-logs/.
# PC must stay on + awake during pilot.
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File scripts\pilot-local.ps1
$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LOG = Join-Path $ROOT ".local-logs"
New-Item -ItemType Directory -Path $LOG -Force | Out-Null

function Test-Port([int]$Port) {
  try {
    $c = New-Object Net.Sockets.TcpClient
    $r = $c.BeginConnect("127.0.0.1", $Port, $null, $null)
    $ok = $r.AsyncWaitHandle.WaitOne(800)
    $c.Close()
    return $ok
  } catch { return $false }
}

function Start-Svc([string]$Name, [int]$Port, [string]$Exe, [string[]]$ArgList, [string]$Cwd, [string]$ProcMatch = "") {
  if ($Port -gt 0 -and (Test-Port $Port)) { Write-Host "[pilot] $Name already listening on :$Port."; return }
  if ($ProcMatch -ne "") {
    $hit = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*$ProcMatch*" } | Select-Object -First 1
    if ($hit) { Write-Host "[pilot] $Name already running (pid $($hit.ProcessId))."; return }
  }
  $o = Join-Path $LOG "$Name.log"; $e = Join-Path $LOG "$Name.err.log"
  Start-Process -FilePath $Exe -ArgumentList $ArgList -WorkingDirectory $Cwd `
    -RedirectStandardOutput $o -RedirectStandardError $e -WindowStyle Hidden
  Write-Host "[pilot] $Name launching (logs: .local-logs\$Name.log) ..."
}

$PB = Join-Path $ROOT "pocketbase\bin\pocketbase.exe"
if (-not (Test-Path $PB)) { throw "PocketBase exe missing: $PB" }
Start-Svc "pocketbase" 8090 $PB @("serve", "--http=127.0.0.1:8090", "`"--dir=$ROOT\pocketbase\pb_data`"", "`"--migrationsDir=$ROOT\pocketbase\pb_migrations`"") $ROOT

$node = (Get-Command node).Source
$npmCli = Join-Path (Split-Path -Parent $node) "node_modules\npm\bin\npm-cli.js"
$env:NEXT_PUBLIC_ADMIN_WHATSAPP = "2348078239107"
Start-Svc "web" 3000 $node @("`"$npmCli`"", "run", "start", "--", "-p", "3000") (Join-Path $ROOT "web")
$env:PB_URL = "http://localhost:8090"
Start-Svc "worker" 0 $node @("index.js") (Join-Path $ROOT "worker") "worker\index.js"
Write-Host "[pilot] launched. Verify with: scripts\pilot-status.ps1 or curl localhost:3000 (allow ~30s cold start)."
