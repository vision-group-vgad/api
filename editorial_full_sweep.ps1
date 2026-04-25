$ErrorActionPreference = 'Stop'
$base = 'http://localhost:4000'
$today = (Get-Date).ToString('yyyy-MM-dd')
$startDate = '2025-01-01'

$endpoints = @(
  '/api/v1/editorial/content-production',
  '/api/v1/editorial/deadline-compliance',
  '/api/v1/editorial/journalist-productivity',
  '/api/v1/editorial/editorial-calendar-adherence',
  "/api/v1/editorial/error-rate/in-range?startDate=$startDate&endDate=$today",
  "/api/v1/editorial/breaking-news/in-range?startDate=$startDate&endDate=$today",
  "/api/v1/editorial/editing-cycle-times/in-range?startDate=$startDate&endDate=$today",
  "/api/v1/editorial/version-control/in-range?startDate=$startDate&endDate=$today",
  "/api/v1/editorial/comp-bench/in-range?startDate=$startDate&endDate=$today",
  '/api/v1/editorial/social-sentiment/annual?year=2025',
  "/api/v1/editorial/readership-trends/in-range?startDate=$startDate&endDate=2025-12-31",
  '/api/v1/editorial/content-freshness',
  '/api/v1/editorial/section-perfromance',
  '/api/v1/editorial/segment-popularity',
  '/api/v1/editorial/visual-engagement',
  '/api/v1/editorial/rights-management',
  '/api/v1/editorial/topic-virality',
  '/api/v1/editorial/visual-usage',
  "/api/v1/editorial/backlog-mgt/in-range?startDate=$startDate&endDate=$today",
  '/api/v1/editorial/analytics/cross-platform-engagement',
  '/api/v1/editorial/analytics/audience-demographics',
  '/api/v1/editorial/analytics/content-roi',
  '/api/v1/editorial/analytics/source-effectiveness',
  '/api/v1/editorial/analytics/social-amplification',
  '/api/v1/editorial/analytics/audience-retention',
  '/api/v1/editorial/analytics/personal-byline-performance'
)

$users = @(
  @{ email = 'editorinchief@vision.com'; password = 'EditorChief@2024!'; role = 'head_of_editorial' },
  @{ email = 'reporter@vision.com'; password = 'Reporter@2024!'; role = 'editorial_staff' }
)

$allResults = @()

foreach ($u in $users) {
  $loginBody = @{ email = $u.email; password = $u.password } | ConvertTo-Json
  try {
    $loginResp = Invoke-RestMethod -Uri "$base/api/v1/auth/login" -Method POST -Body $loginBody -ContentType 'application/json'
    $token = $loginResp.token
    Write-Host "LOGIN_OK|$($u.role)"
  } catch {
    Write-Host "LOGIN_FAIL|$($u.role)"
    continue
  }

  $headers = @{ Authorization = "Bearer $token" }

  foreach ($ep in $endpoints) {
    $start = Get-Date
    try {
      $r = Invoke-WebRequest -Uri "$base$ep" -Headers $headers -UseBasicParsing -ErrorAction Stop -TimeoutSec 20
      $ms = [int]((Get-Date) - $start).TotalMilliseconds

      $body = $null
      try { $body = $r.Content | ConvertFrom-Json -ErrorAction Stop } catch { $body = $null }
      $source = if ($body -and $body.source) { $body.source } else { 'live' }

      $record = [PSCustomObject]@{
        Role = $u.role
        Endpoint = $ep
        Status = [int]$r.StatusCode
        Ms = $ms
        Source = $source
        Outcome = 'OK'
      }
      $allResults += $record
      Write-Host "OK|$($u.role)|$ep|$($r.StatusCode)|${ms}ms|$source"
    } catch {
      $ms = [int]((Get-Date) - $start).TotalMilliseconds
      $code = 0
      if ($_.Exception.Response) {
        try { $code = [int]$_.Exception.Response.StatusCode } catch { $code = 0 }
      }
      $record = [PSCustomObject]@{
        Role = $u.role
        Endpoint = $ep
        Status = $code
        Ms = $ms
        Source = ''
        Outcome = 'FAIL'
      }
      $allResults += $record
      Write-Host "FAIL|$($u.role)|$ep|$code|${ms}ms|$($_.Exception.Message -replace '\r|\n',' ')"
    }
  }
}

foreach ($role in @('head_of_editorial','editorial_staff')) {
  $subset = $allResults | Where-Object { $_.Role -eq $role }
  $total = ($subset | Measure-Object).Count
  $ok = ($subset | Where-Object { $_.Outcome -eq 'OK' } | Measure-Object).Count
  $fail = ($subset | Where-Object { $_.Outcome -eq 'FAIL' } | Measure-Object).Count
  $dummy = ($subset | Where-Object { $_.Source -eq 'dummy' } | Measure-Object).Count
  $slow = ($subset | Where-Object { $_.Ms -ge 5000 } | Measure-Object).Count
  Write-Host "SUMMARY|$role|total=$total|ok=$ok|fail=$fail|dummy=$dummy|slow(>=5000ms)=$slow"

  $failList = $subset | Where-Object { $_.Outcome -eq 'FAIL' } | ForEach-Object { $_.Endpoint }
  if (($failList | Measure-Object).Count -gt 0) {
    Write-Host "FAILURES|$role|$($failList -join ',')"
  }
}

Write-Host 'DONE'
