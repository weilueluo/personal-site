param(
  [string[]]$Branches = @(
    "feat/studio-os",
    "feat/side-scroller-world",
    "feat/shader-lab",
    "feat/graph-constellation",
    "feat/model-inspector",
    "feat/infinite-canvas",
    "feat/timeline-ribbon",
    "feat/portal-museum",
    "feat/terminal-ritual",
    "feat/diorama-carousel"
  ),
  [string]$Locale = "en",
  [int]$BasePort = 3100,
  [int]$ChromePort = 9222,
  [int]$ConsoleSeconds = 2,
  [int]$WaitSeconds = 90,
  [switch]$SkipVideo
)

$ErrorActionPreference = "Stop"

function Resolve-ChromeExe {
  $chromePaths = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe",
    "$env:LocalAppData\Google\Chrome\Application\chrome.exe"
  )
  return $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1
}

function Ensure-ChromeDebug {
  param([int]$Port)

  try {
    $null = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/version" -TimeoutSec 1
    return
  } catch {
    # continue
  }

  $chromeExe = Resolve-ChromeExe
  if (-not $chromeExe) { throw "Chrome executable not found." }

  $debugProfile = Join-Path $env:TEMP "chrome-cdp-profile"
  Start-Process $chromeExe "--remote-debugging-port=$Port --user-data-dir=$debugProfile --new-window about:blank" | Out-Null

  $deadline = (Get-Date).AddSeconds(8)
  while ((Get-Date) -lt $deadline) {
    try {
      $null = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/version" -TimeoutSec 1
      return
    } catch {
      Start-Sleep -Milliseconds 250
    }
  }

  throw "Chrome did not start remote debugging on port $Port."
}

function Wait-HttpOk {
  param(
    [string]$Url,
    [int]$Seconds
  )
  $deadline = (Get-Date).AddSeconds([Math]::Max(1, $Seconds))
  while ((Get-Date) -lt $deadline) {
    try {
      $resp = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 4 -UseBasicParsing
      if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 300) { return $true }
      return $false
    } catch {
      Start-Sleep -Milliseconds 350
    }
  }
  return $false
}

function Start-DevServer {
  param(
    [int]$Port,
    [string]$StdoutLogPath,
    [string]$StderrLogPath
  )

  # Use cmd.exe so pnpm.cmd resolution is consistent.
  $cmd = "pnpm dev -- -p $Port"
  # Start-Process does not allow stdout/stderr redirect to the same file.
  return Start-Process `
    -FilePath "cmd.exe" `
    -ArgumentList @("/c", $cmd) `
    -WorkingDirectory $PWD `
    -WindowStyle Hidden `
    -PassThru `
    -RedirectStandardOutput $StdoutLogPath `
    -RedirectStandardError $StderrLogPath
}

function Stop-DevServerByPort {
  param([int]$Port)
  try {
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($conn -and $conn.OwningProcess) {
      Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
  } catch {
    # ignore
  }
}

function Capture-Shot {
  param(
    [string]$ChromeCdpScript,
    [int]$ChromePort,
    [string]$Url,
    [string]$OutPath,
    [int]$ConsoleSeconds
  )

  $dir = Split-Path -Parent $OutPath
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

  powershell -ExecutionPolicy Bypass -File $ChromeCdpScript -Port $ChromePort -TabIndex 0 -Url $Url -ConsoleSeconds $ConsoleSeconds -ScreenshotPath $OutPath | Out-Null
}

function Write-PreviewVideo {
  param(
    [string[]]$Images,
    [string]$OutVideo
  )

  $ffmpeg = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Source
  if (-not $ffmpeg) { throw "ffmpeg not found in PATH." }

  $tmp = Join-Path $env:TEMP ("codex-directions-" + [Guid]::NewGuid().ToString("N") + ".txt")
  try {
    $lines = @()
    foreach ($img in $Images) {
      if (-not (Test-Path $img)) { continue }
      $lines += "file '$img'"
      $lines += "duration 2"
    }
    if ($lines.Count -eq 0) { return }
    # Concat demuxer needs the last file repeated (no duration) to end correctly.
    $last = $Images | Where-Object { Test-Path $_ } | Select-Object -Last 1
    $lines += "file '$last'"
    Set-Content -LiteralPath $tmp -Value $lines -Encoding Ascii

    & $ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i $tmp -vf "fps=30,format=yuv420p" $OutVideo | Out-Null
  } finally {
    Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue
  }
}

Ensure-ChromeDebug -Port $ChromePort

# Copy the CDP helper to TEMP so it survives branch switches.
$cdpSrc = Join-Path $PSScriptRoot "chrome_cdp.ps1"
if (-not (Test-Path $cdpSrc)) { throw "Missing chrome_cdp.ps1 at $cdpSrc" }
$cdpTmp = Join-Path $env:TEMP "codex-chrome_cdp.ps1"
Copy-Item -LiteralPath $cdpSrc -Destination $cdpTmp -Force

$root = Resolve-Path .
$outRoot = Join-Path $root "artifacts\\directions"
if (-not (Test-Path $outRoot)) { New-Item -ItemType Directory -Path $outRoot | Out-Null }

$summary = @()

for ($i = 0; $i -lt $Branches.Count; $i++) {
  $branch = $Branches[$i]
  $port = $BasePort + $i

  Write-Host ""
  Write-Host "== $branch (port $port) =="

  git switch $branch | Out-Null

  $branchSafe = $branch -replace "[^a-zA-Z0-9._-]", "_"
  $dir = Join-Path $outRoot $branchSafe
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

  $stdoutLog = Join-Path $dir "dev.stdout.log.txt"
  $stderrLog = Join-Path $dir "dev.stderr.log.txt"

  Stop-DevServerByPort -Port $port
  $proc = Start-DevServer -Port $port -StdoutLogPath $stdoutLog -StderrLogPath $stderrLog

  try {
    $home = "http://127.0.0.1:$port/$Locale"
    $ok = Wait-HttpOk -Url $home -Seconds $WaitSeconds
    if (-not $ok) {
      Write-Host "FAILED: $home did not return 2xx within $WaitSeconds seconds"
      $summary += [pscustomobject]@{ branch = $branch; ok = $false; note = "dev server not ready or 5xx"; out = $dir }
      continue
    }

    $shots = @(
      @{ name = "home"; path = "/$Locale" },
      @{ name = "about"; path = "/$Locale/about" },
      @{ name = "shader"; path = "/$Locale/shader" }
    )

    $images = @()
    foreach ($s in $shots) {
      $url = "http://127.0.0.1:$port$($s.path)"
      $out = Join-Path $dir ("$($s.name).png")
      Write-Host "shot: $url -> $out"
      Capture-Shot -ChromeCdpScript $cdpTmp -ChromePort $ChromePort -Url $url -OutPath $out -ConsoleSeconds $ConsoleSeconds
      $images += $out
    }

    if (-not $SkipVideo) {
      $video = Join-Path $dir "preview.mp4"
      Write-Host "video: $video"
      Write-PreviewVideo -Images $images -OutVideo $video
    }

    $summary += [pscustomobject]@{ branch = $branch; ok = $true; note = ""; out = $dir }
  } finally {
    Stop-DevServerByPort -Port $port
    if ($proc -and -not $proc.HasExited) {
      Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    }
  }
}

$summaryPath = Join-Path $outRoot "_summary.json"
$summary | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $summaryPath -Encoding Ascii
Write-Host ""
Write-Host "Saved: $summaryPath"
Write-Host "Done."

