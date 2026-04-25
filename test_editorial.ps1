$base='http://localhost:4000'
$loginBody = '{"email":"editorinchief@vision.com","password":"EditorChief@2024!"}'
$loginResp = Invoke-RestMethod -Uri "$base/api/v1/auth/login" -Method POST -Body $loginBody -ContentType 'application/json'
$tok = $loginResp.token
$h = @{Authorization="Bearer $tok"}

$eps = @(
  '/api/v1/editorial/section-perfromance',
  '/api/v1/editorial/segment-popularity',
  '/api/v1/editorial/content-freshness',
  '/api/v1/editorial/visual-engagement',
  '/api/v1/editorial/rights-management',
  '/api/v1/editorial/topic-virality',
  '/api/v1/editorial/visual-usage',
  '/api/v1/editorial/breakingNews/',
  '/api/v1/editorial/social-sentiment/annual?year=2025',
  '/api/v1/editorial/readership-trends/annual?year=2025',
  '/api/v1/editorial/analytics/cross-platform-engagement',
  '/api/v1/editorial/analytics/audience-demographics',
  '/api/v1/editorial/analytics/content-roi',
  '/api/v1/editorial/analytics/source-effectiveness',
  '/api/v1/editorial/analytics/social-amplification',
  '/api/v1/editorial/analytics/audience-retention',
  '/api/v1/editorial/analytics/personal-byline-performance'
)

foreach ($ep in $eps) {
  try {
    $r = Invoke-WebRequest -Uri "$base$ep" -Headers $h -UseBasicParsing -EA Stop -TimeoutSec 10
    $b = $r.Content | ConvertFrom-Json -EA SilentlyContinue
    $src = if ($b.source) { $b.source } else { 'live' }
    Write-Host "OK|$ep|$($r.StatusCode)|$src"
  } catch {
    $code = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 0 }
    Write-Host "FAIL|$ep|$code"
  }
}
Write-Host "DONE"
