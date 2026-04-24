$base='http://localhost:4000'
$loginBody=@{email='financialcontroller@vision.com';password='FinCtrl@2024!'}|ConvertTo-Json
try { $loginResp=Invoke-WebRequest -UseBasicParsing -Uri "$base/api/v1/auth/login" -Method Post -ContentType 'application/json' -Body $loginBody -TimeoutSec 30; $token=($loginResp.Content|ConvertFrom-Json).token } catch { Write-Output ('LOGIN_FAILED|' + $_.Exception.Message); exit 1 }
$headers=@{Authorization="Bearer $token"}
$endpoints=@(
'/api/v1/finance-forecasting/revenue?year=2021',
'/api/v1/finance-forecasting/expense?year=2021',
'/api/v1/finance-forecasting/net-income?year=2021',
'/api/v1/finance-forecasting/cashflow?year=2021',
'/api/v1/gl-reconciliation/range?startDate=2021-08-01&endDate=2021-10-31',
'/api/v1/gl-reconciliation/start-year?startYear=2021',
'/api/v1/tax-provisioning?startDate=2021-08-01&endDate=2021-10-31',
'/api/v1/fin-statement-variance?startDate=2021-08-01&endDate=2021-10-31',
'/api/v1/bad-debt-ratios/range?startDate=2021-08-01&endDate=2021-10-31',
'/api/v1/bad-debt-ratios/annual?year=2021'
)
$total=0; $ok=0; $fail=0; $dummy=0; $slow=0
foreach($ep in $endpoints){
  $total++; $sw=[System.Diagnostics.Stopwatch]::StartNew(); $status='ERR'; $body=''
  try { $resp=Invoke-WebRequest -UseBasicParsing -Uri ($base+$ep) -Headers $headers -Method Get -TimeoutSec 60; $sw.Stop(); $status=[int]$resp.StatusCode; $body=[string]$resp.Content }
  catch { $sw.Stop(); if($_.Exception.Response){ try { $status=[int]$_.Exception.Response.StatusCode.value__; $sr=New-Object IO.StreamReader($_.Exception.Response.GetResponseStream()); $body=$sr.ReadToEnd(); $sr.Close() } catch {} } }
  $ms=[int]$sw.ElapsedMilliseconds; if($ms -gt 5000){$slow++}
  $kind='LIVE'; if($body -match '(?i)dummy'){ $kind='DUMMY'; $dummy++ }
  if([string]$status -match '^2\d\d$'){ $ok++ } else { $fail++ }
  Write-Output ("$ep|$status|$ms|$kind")
}
Write-Output ("SUMMARY|total=$total|ok=$ok|fail=$fail|dummy=$dummy|slow_gt_5s=$slow")
