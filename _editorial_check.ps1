$ErrorActionPreference = 'Stop'

$vgad = 'C:\wamp64\www\vgad'
$api = 'C:\wamp64\www\api'
$base = 'http://localhost:4000'
$apiBase = "$base/api/v1"

if (!(Test-Path $vgad)) { Write-Output "ERROR|Missing path $vgad"; exit 1 }
if (!(Test-Path $api)) { Write-Output "ERROR|Missing path $api"; exit 1 }

$exts = @('*.ts','*.tsx','*.js','*.jsx')
$files = Get-ChildItem -Path (Join-Path $vgad 'src') -Recurse -File -Include $exts -ErrorAction SilentlyContinue
$raw = New-Object System.Collections.Generic.List[string]
$rx = [regex]'/editorial/[A-Za-z0-9_\-\./\?=&:\$\{\},]*'

foreach ($f in $files) {
  $text = Get-Content -LiteralPath $f.FullName -Raw -ErrorAction SilentlyContinue
  if ([string]::IsNullOrWhiteSpace($text)) { continue }
  $matches = $rx.Matches($text)
  foreach ($m in $matches) {
    $v = $m.Value.Trim()
    if ($v) { $raw.Add($v) }
  }
}

function Resolve-Endpoint([string]$e) {
  $x = $e
  # Replace common template vars
  $x = [regex]::Replace($x, '\$\{\s*startDate\s*\}', '2025-01-01', 'IgnoreCase')
  $x = [regex]::Replace($x, '\$\{\s*endDate\s*\}', '2025-12-31', 'IgnoreCase')
  $x = [regex]::Replace($x, '\$\{\s*interval\s*\}', 'monthly', 'IgnoreCase')
  $x = [regex]::Replace($x, '\$\{\s*year\s*\}', '2025', 'IgnoreCase')
  $x = [regex]::Replace($x, '\$\{\s*month\s*\}', '8', 'IgnoreCase')

  # Replace :params where meaningful
  $x = [regex]::Replace($x, ':startDate\b', '2025-01-01', 'IgnoreCase')
  $x = [regex]::Replace($x, ':endDate\b', '2025-12-31', 'IgnoreCase')
  $x = [regex]::Replace($x, ':interval\b', 'monthly', 'IgnoreCase')
  $x = [regex]::Replace($x, ':year\b', '2025', 'IgnoreCase')
  $x = [regex]::Replace($x, ':month\b', '8', 'IgnoreCase')

  # Generic unresolved ${...}
  $x = [regex]::Replace($x, '\$\{[^}]+\}', '1')

  # Fill blank known query params
  if ($x -match 'startDate=(&|$)') { $x = $x -replace 'startDate=(&|$)', 'startDate=2025-01-01$1' }
  if ($x -match 'endDate=(&|$)') { $x = $x -replace 'endDate=(&|$)', 'endDate=2025-12-31$1' }
  if ($x -match 'interval=(&|$)') { $x = $x -replace 'interval=(&|$)', 'interval=monthly$1' }
  if ($x -match 'year=(&|$)') { $x = $x -replace 'year=(&|$)', 'year=2025$1' }
  if ($x -match 'month=(&|$)') { $x = $x -replace 'month=(&|$)', 'month=8$1' }

  return $x
}

$resolved = $raw | ForEach-Object { Resolve-Endpoint $_ } | Where-Object { $_ -and $_ -match '/editorial/' } | Sort-Object -Unique

Write-Output ("ENDPOINT_LIST|{0}" -f $resolved.Count)
foreach ($e in $resolved) { Write-Output ("ENDPOINT|{0}" -f $e) }

# Server reachability check via login endpoint
$loginUrl = "$apiBase/auth/login"
$reachable = $true
try {
  $null = Invoke-WebRequest -UseBasicParsing -Uri $loginUrl -Method Post -ContentType 'application/json' -Body '{"email":"x","password":"y"}' -TimeoutSec 10
} catch {
  if ($_.Exception.Response) {
    # reachable, just unauthorized/validation
    $reachable = $true
  } else {
    $reachable = $false
  }
}

if (-not $reachable) {
  Write-Output "ERROR|Server unreachable at http://localhost:4000"
  exit 0
}

$users = @(
  @{ role='editorinchief'; email='editorinchief@vision.com'; password='EditorChief@2024!' },
  @{ role='reporter'; email='reporter@vision.com'; password='Reporter@2024!' }
)

function Get-Token([string]$email,[string]$password) {
  $body = @{ email=$email; password=$password } | ConvertTo-Json -Compress
  $resp = Invoke-RestMethod -Uri $loginUrl -Method Post -ContentType 'application/json' -Body $body -TimeoutSec 20
  if ($resp.token) { return $resp.token }
  if ($resp.data.token) { return $resp.data.token }
  if ($resp.accessToken) { return $resp.accessToken }
  if ($resp.data.accessToken) { return $resp.data.accessToken }
  return $null
}

$results = New-Object System.Collections.Generic.List[object]

foreach ($u in $users) {
  $role = $u.role
  $token = $null
  try {
    $token = Get-Token -email $u.email -password $u.password
  } catch {
    Write-Output ("ROLE|{0}|LOGIN|FAIL" -f $role)
    continue
  }

  if (-not $token) {
    Write-Output ("ROLE|{0}|LOGIN|FAIL_NO_TOKEN" -f $role)
    continue
  }

  $headers = @{ Authorization = "Bearer $token" }

  foreach ($ep in $resolved) {
    if ($ep -match '^https?://') { $url = $ep }
    elseif ($ep.StartsWith('/api/')) { $url = "$base$ep" }
    else { $url = "$apiBase$ep" }

    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $status = 0
    $source = 'n/a'
    $respText = ''

    try {
      $resp = Invoke-WebRequest -UseBasicParsing -Uri $url -Method Get -Headers $headers -TimeoutSec 30
      $sw.Stop()
      $status = [int]$resp.StatusCode
      $respText = [string]$resp.Content
      if ($status -ge 200 -and $status -lt 300) {
        if ($respText -match '(?i)dummy') { $source = 'dummy' } else { $source = 'live' }
      }
    } catch {
      $sw.Stop()
      if ($_.Exception.Response) {
        $r = $_.Exception.Response
        $status = [int]$r.StatusCode
        try {
          $sr = New-Object System.IO.StreamReader($r.GetResponseStream())
          $respText = $sr.ReadToEnd()
          $sr.Close()
        } catch {}
      } else {
        $status = 0
      }
      $source = 'n/a'
    }

    $ms = [int]$sw.ElapsedMilliseconds
    Write-Output ("{0}|{1}|{2}|{3}|{4}" -f $role.ToUpper(), $ep, $status, $ms, $source)

    $results.Add([pscustomobject]@{
      Role = $role.ToUpper(); Endpoint=$ep; Status=$status; Ms=$ms; Source=$source
    }) | Out-Null
  }
}

foreach ($r in ($results | Group-Object Role)) {
  $role = $r.Name
  $items = $r.Group
  $total = $items.Count
  $ok = ($items | Where-Object { $_.Status -ge 200 -and $_.Status -lt 300 }).Count
  $fail = ($items | Where-Object { $_.Status -lt 200 -or $_.Status -ge 300 }).Count
  $dummy = ($items | Where-Object { $_.Source -eq 'dummy' }).Count
  $live = ($items | Where-Object { $_.Source -eq 'live' }).Count
  $slow = ($items | Where-Object { $_.Ms -gt 5000 }).Count
  Write-Output ("SUMMARY|{0}|total={1}|ok={2}|fail={3}|dummy={4}|live={5}|slow_gt_5s={6}" -f $role,$total,$ok,$fail,$dummy,$live,$slow)

  $fails = $items | Where-Object { $_.Status -lt 200 -or $_.Status -ge 300 } | Select-Object -ExpandProperty Endpoint -Unique
  if ($fails -and $fails.Count -gt 0) {
    Write-Output ("FAILURES|{0}|{1}" -f $role, ($fails -join ','))
  } else {
    Write-Output ("FAILURES|{0}|none" -f $role)
  }
}

