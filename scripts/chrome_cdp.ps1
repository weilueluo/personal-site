param(
  [int]$Port = 9222,
  [switch]$ListTabs,
  [int]$TabIndex = -1,
  [string]$TabId,
  [switch]$NewTab,
  [string]$Url,
  [string[]]$Eval,
  [switch]$EvalPrint,
  [int]$WaitMs = 0,
  [int]$ConsoleSeconds = 0,
  [string]$ScreenshotPath,
  [int]$TimeoutSeconds = 30,
  [int]$ReceiveTimeoutMs = 750
)

$ErrorActionPreference = "Stop"

function Get-Deadline {
  param([int]$Seconds)
  return (Get-Date).AddSeconds([Math]::Max(1, $Seconds))
}

function Test-Deadline {
  param([datetime]$Deadline, [string]$Message)
  if ((Get-Date) -gt $Deadline) {
    throw $Message
  }
}

function Invoke-ChromeJson {
  param(
    [int]$Port,
    [string]$Path,
    [ValidateSet("Get","Put","Post","Delete","Patch","Head","Options")]
    [string]$Method = "Get"
  )

  $base = "http://127.0.0.1:$Port"
  $uri = "$base$Path"
  try {
    return Invoke-RestMethod -Uri $uri -Method $Method
  } catch {
    throw "Failed to reach Chrome at $uri. Ensure Chrome is running with --remote-debugging-port=$Port."
  }
}

function Get-ChromeTabs {
  param([int]$Port)
  return Invoke-ChromeJson -Port $Port -Path "/json/list"
}

function New-ChromeTab {
  param(
    [int]$Port,
    [string]$Url
  )

  $encoded = [System.Uri]::EscapeDataString($Url)
  # Newer Chrome builds only allow PUT for /json/new.
  return Invoke-ChromeJson -Port $Port -Path "/json/new?$encoded" -Method Put
}

function Connect-CdpWebSocket {
  param([string]$WebSocketUrl)

  $ws = [System.Net.WebSockets.ClientWebSocket]::new()
  $uri = [System.Uri]$WebSocketUrl
  $ct = [System.Threading.CancellationToken]::None
  $null = $ws.ConnectAsync($uri, $ct).GetAwaiter().GetResult()
  return $ws
}

function Send-CdpMessage {
  param(
    [System.Net.WebSockets.ClientWebSocket]$Socket,
    [hashtable]$Message
  )

  $json = $Message | ConvertTo-Json -Compress -Depth 20
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $segment = [System.ArraySegment[byte]]::new($bytes)
  $ct = [System.Threading.CancellationToken]::None
  $null = $Socket.SendAsync(
    $segment,
    [System.Net.WebSockets.WebSocketMessageType]::Text,
    $true,
    $ct
  ).GetAwaiter().GetResult()
}

function Receive-CdpMessage {
  param(
    [System.Net.WebSockets.ClientWebSocket]$Socket,
    [int]$TimeoutMs = 750
  )

  # IMPORTANT:
  # Do not start overlapping ReceiveAsync calls. If we time out waiting for a message
  # and return $null while a ReceiveAsync task is still pending, the next call would
  # start another ReceiveAsync on the same socket, which can fault the websocket with:
  # "Exception calling 'Wait' ... One or more errors occurred."
  #
  # We keep a single pending ReceiveAsync task + partial message buffer between calls.
  if (-not $script:__cdpRxBuffer) {
    $script:__cdpRxBuffer = New-Object byte[] 8192
    $script:__cdpRxSegment = [System.ArraySegment[byte]]::new($script:__cdpRxBuffer)
  }
  if (-not $script:__cdpRxStream) {
    $script:__cdpRxStream = [System.IO.MemoryStream]::new()
  }

  while ($true) {
    # Avoid cancellation tokens for timeouts: on Windows PowerShell/.NET Framework
    # they can put ClientWebSocket into the 'Aborted' state.
    if (-not $script:__cdpRxTask) {
      $script:__cdpRxTask = $Socket.ReceiveAsync(
        $script:__cdpRxSegment,
        [System.Threading.CancellationToken]::None
      )
    }

    try {
      if (-not $script:__cdpRxTask.Wait($TimeoutMs)) {
        # Keep the pending task; we'll keep waiting on it next call.
        return $null
      }
    } catch {
      throw "WebSocket receive failed: $($_.Exception.Message)"
    }

    $result = $script:__cdpRxTask.GetAwaiter().GetResult()
    $script:__cdpRxTask = $null

    if ($result.MessageType -eq [System.Net.WebSockets.WebSocketMessageType]::Close) {
      throw "Chrome closed the WebSocket connection."
    }

    if ($result.Count -gt 0) {
      $script:__cdpRxStream.Write($script:__cdpRxBuffer, 0, $result.Count)
    }

    if ($result.EndOfMessage) {
      break
    }
  }

  $text = [System.Text.Encoding]::UTF8.GetString($script:__cdpRxStream.ToArray())
  $script:__cdpRxStream.Dispose()
  $script:__cdpRxStream = $null
  if (-not $text) {
    return $null
  }
  try {
    # Windows PowerShell doesn't support ConvertFrom-Json -Depth.
    return $text | ConvertFrom-Json
  } catch {
    throw "Failed to parse CDP message: $text"
  }
}

function Format-ConsoleArgs {
  param($Args)

  $parts = @()
  foreach ($arg in $Args) {
    if ($null -ne $arg.value) {
      $parts += [string]$arg.value
      continue
    }
    if ($null -ne $arg.description) {
      $parts += [string]$arg.description
      continue
    }
    if ($null -ne $arg.type) {
      $parts += "[type=$($arg.type)]"
      continue
    }
    $parts += ($arg | ConvertTo-Json -Compress -Depth 5)
  }
  return ($parts -join " ")
}

function Resolve-TargetTab {
  param(
    [int]$Port,
    [switch]$NewTab,
    [string]$Url,
    [int]$TabIndex,
    [string]$TabId
  )

  if ($NewTab) {
    $tabUrl = if ($Url) { $Url } else { "about:blank" }
    return New-ChromeTab -Port $Port -Url $tabUrl
  }

  $tabs = Get-ChromeTabs -Port $Port
  if (-not $tabs -or $tabs.Count -eq 0) {
    throw "No debuggable tabs found. Create one with -NewTab or open a page in the debug Chrome."
  }

  if ($TabId) {
    $match = $tabs | Where-Object { $_.id -eq $TabId } | Select-Object -First 1
    if (-not $match) {
      throw "No tab found with id '$TabId'."
    }
    return $match
  }

  if ($TabIndex -ge 0) {
    if ($TabIndex -ge $tabs.Count) {
      throw "TabIndex $TabIndex is out of range. There are $($tabs.Count) tabs."
    }
    return $tabs[$TabIndex]
  }

  return $tabs[0]
}

function Print-Tabs {
  param([object[]]$Tabs)
  $i = 0
  foreach ($tab in $Tabs) {
    $title = if ($tab.title) { $tab.title } else { "<no title>" }
    $url = if ($tab.url) { $tab.url } else { "<no url>" }
    Write-Output ("[{0}] id={1} title={2} url={3}" -f $i, $tab.id, $title, $url)
    $i += 1
  }
}

# Ensure Chrome is reachable before doing anything else.
$null = Invoke-ChromeJson -Port $Port -Path "/json/version"

if ($ListTabs) {
  $tabs = Get-ChromeTabs -Port $Port
  Print-Tabs -Tabs $tabs
  return
}

if (-not $Url -and -not $NewTab -and $TabIndex -lt 0 -and -not $TabId) {
  Write-Output "No explicit action provided. Listing tabs."
  $tabs = Get-ChromeTabs -Port $Port
  Print-Tabs -Tabs $tabs
  return
}

$target = Resolve-TargetTab -Port $Port -NewTab:$NewTab -Url $Url -TabIndex $TabIndex -TabId $TabId
if (-not $target.webSocketDebuggerUrl) {
  throw "Target tab does not expose webSocketDebuggerUrl. Tab id: $($target.id)"
}

$socket = Connect-CdpWebSocket -WebSocketUrl $target.webSocketDebuggerUrl

try {
  $nextId = 1
  $responses = @{}
  $consoleEvents = New-Object System.Collections.Generic.List[object]
  $loadFired = $false
  $deadline = Get-Deadline -Seconds $TimeoutSeconds

  function Send-CdpCommand {
    param(
      [string]$Method,
      [hashtable]$Params
    )

    $id = $nextId
    $script:nextId += 1
    $message = @{
      id = $id
      method = $Method
    }
    if ($Params) {
      $message.params = $Params
    }
    Send-CdpMessage -Socket $socket -Message $message
    return $id
  }

  function Handle-CdpEvent {
    param($Message)

    if ($Message.method -eq "Page.loadEventFired") {
      $script:loadFired = $true
      return
    }

    if ($Message.method -eq "Runtime.consoleAPICalled") {
      $entry = [pscustomobject]@{
        kind = "console"
        type = $Message.params.type
        text = Format-ConsoleArgs -Args $Message.params.args
        url = $Message.params.stackTrace.callFrames[0].url
      }
      $consoleEvents.Add($entry)
      Write-Output ("[console.{0}] {1}" -f $entry.type, $entry.text)
      return
    }

    if ($Message.method -eq "Log.entryAdded") {
      $entry = [pscustomobject]@{
        kind = "log"
        level = $Message.params.entry.level
        text = $Message.params.entry.text
        url = $Message.params.entry.url
      }
      $consoleEvents.Add($entry)
      Write-Output ("[log.{0}] {1}" -f $entry.level, $entry.text)
      return
    }
  }

  function Receive-Until {
    param([scriptblock]$Condition, [datetime]$Deadline)

    while (-not (& $Condition)) {
      Test-Deadline -Deadline $Deadline -Message "Timed out waiting for CDP response or event."
      $msg = Receive-CdpMessage -Socket $socket -TimeoutMs $ReceiveTimeoutMs
      if ($null -eq $msg) {
        continue
      }
      if ($null -ne $msg.id) {
        $responses[[int]$msg.id] = $msg
        continue
      }
      if ($msg.method) {
        Handle-CdpEvent -Message $msg
      }
    }
  }

  function Wait-ForResponse {
    param([int]$Id, [datetime]$Deadline)
    Receive-Until -Condition { $responses.ContainsKey($Id) } -Deadline $Deadline
    $response = $responses[$Id]
    if ($response.error) {
      $err = $response.error | ConvertTo-Json -Compress -Depth 10
      throw "CDP error for request id=${Id}: $err"
    }
    return $response
  }

  # Enable domains that provide navigation events and console output.
  $idPageEnable = Send-CdpCommand -Method "Page.enable" -Params @{}
  $idRuntimeEnable = Send-CdpCommand -Method "Runtime.enable" -Params @{}
  $idLogEnable = Send-CdpCommand -Method "Log.enable" -Params @{}
  $null = Wait-ForResponse -Id $idPageEnable -Deadline $deadline
  $null = Wait-ForResponse -Id $idRuntimeEnable -Deadline $deadline
  $null = Wait-ForResponse -Id $idLogEnable -Deadline $deadline

  if ($Url) {
    $idNavigate = Send-CdpCommand -Method "Page.navigate" -Params @{ url = $Url }
    $null = Wait-ForResponse -Id $idNavigate -Deadline $deadline
    Receive-Until -Condition { $loadFired } -Deadline $deadline
  }

  if ($Eval) {
    foreach ($expr in $Eval) {
      if (-not $expr) { continue }
      $idEval = Send-CdpCommand -Method "Runtime.evaluate" -Params @{
        expression = $expr
        awaitPromise = $true
      }
      $evalResp = Wait-ForResponse -Id $idEval -Deadline $deadline
      if ($evalResp.result.exceptionDetails) {
        $ex = $evalResp.result.exceptionDetails
        $exText = if ($ex.text) { [string]$ex.text } else { "<no text>" }
        $exDesc = ""
        if ($ex.exception -and $ex.exception.description) {
          $exDesc = [string]$ex.exception.description
        } elseif ($ex.exception -and $null -ne $ex.exception.value) {
          $exDesc = [string]$ex.exception.value
        }
        $exSuffix = ""
        if ($exDesc) { $exSuffix = "`n$exDesc" }
        throw ("Runtime.evaluate exception: {0}{1}" -f $exText, $exSuffix)
      }
      if ($EvalPrint) {
        $res = $evalResp.result.result
        $val = $null
        if ($null -ne $res.value) {
          $val = $res.value
        } elseif ($null -ne $res.description) {
          $val = $res.description
        } else {
          $val = "[type=$($res.type)]"
        }
        $exprShort = [string]$expr
        if ($exprShort.Length -gt 160) { $exprShort = $exprShort.Substring(0, 160) + "..." }
        $valStr = [string]$val
        if ($valStr.Length -gt 500) { $valStr = $valStr.Substring(0, 500) + "..." }
        Write-Output ("Eval: {0}" -f $exprShort)
        Write-Output ("=> {0}" -f $valStr)
      }
    }
  }

  if ($WaitMs -gt 0) {
    Start-Sleep -Milliseconds $WaitMs
  }

  if ($ConsoleSeconds -gt 0) {
    $consoleDeadline = Get-Deadline -Seconds $ConsoleSeconds
    Receive-Until -Condition { (Get-Date) -ge $consoleDeadline } -Deadline $consoleDeadline
  }

  if ($ScreenshotPath) {
    $idShot = Send-CdpCommand -Method "Page.captureScreenshot" -Params @{
      format = "png"
      fromSurface = $true
    }
    $shotResp = Wait-ForResponse -Id $idShot -Deadline $deadline
    $data = $shotResp.result.data
    if (-not $data) {
      throw "Page.captureScreenshot returned no data."
    }
    $bytes = [System.Convert]::FromBase64String($data)
    $dir = Split-Path -Parent $ScreenshotPath
    if ($dir -and -not (Test-Path $dir)) {
      New-Item -ItemType Directory -Path $dir | Out-Null
    }
    [System.IO.File]::WriteAllBytes($ScreenshotPath, $bytes)
    Write-Output "Saved screenshot: $ScreenshotPath"
  }
} finally {
  try {
    if ($socket.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
      $ct = [System.Threading.CancellationToken]::None
      # CloseOutputAsync avoids errors if Chrome still has pending text messages.
      $null = $socket.CloseOutputAsync(
        [System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,
        "Done",
        $ct
      ).GetAwaiter().GetResult()
    }
  } catch {
    # Best-effort close; don't mask the real error (if any) from the main flow.
  } finally {
    $socket.Dispose()
  }
}
