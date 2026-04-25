$base = 'http://localhost:4000'
$today = (Get-Date).ToString('yyyy-MM-dd')
$startDate = '2025-01-01'

$endpoints = @(
  '/api/v1/editorial/content-production',
  '/api/v1/editorial/deadline-compliance',
  '/api/v1/editorial/journalist-productivity',
  "/api/v1/editorial/error-rate/in-range?startDate=$startDate&endDate=$today",
  "/api/v1/editorial/breaking-news/in-range?startDate=$startDate&endDate=$today",
  "/api/v1/editorial/editing-cycle-times/in-range?startDate=$startDate&endDate=$today",
  "/api/v1/editorial/version-control/in-range?startDate=$startDate&endDate=$today",
  "/api/v1/editorial/comp-bench/in-range?startDate=$startDate&endDate=$today",
  '/api/v1/editorial/social-sentiment/annual?year=2025',
  '/api/v1/editorial/readership-trends/annual?year=2025',
  '/api/v1/editorial/content-freshness',
  '/api/v1/editorial/section-perfromance',
  '/api/v1/editorial/segment-popularity',
  '/api/v1/editorial/visual-engagement',
  '/api/v1/editorial/rights-management',
  '/api/v1/editorial/topic-virality',
  '/api/v1/editorial/visual-usage',
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
    try {
      $r = Invoke-WebRequest -Uri "$base$ep" -Headers $headers -UseBasicParsing -ErrorAction Stop -TimeoutSec 15
      $body = $null
      try {
        $body = $r.Content | ConvertFrom-Json -ErrorAction Stop
      } catch {
        $body = $null
      }
      $source = if ($body -and $body.source) { $body.source } else { 'live' }
      Write-Host "OK|$($u.role)|$ep|$($r.StatusCode)|$source"
    } catch {
      $code = 0
      if ($_.Exception.Response) {
        try { $code = [int]$_.Exception.Response.StatusCode } catch { $code = 0 }
      }
      $msg = $_.Exception.Message -replace '\r|\n', ' '
      Write-Host "FAIL|$($u.role)|$ep|$code|$msg"
    }
  }
}

Write-Host 'DONE'
