$base='http://localhost:4000'
$loginBody=@{email='financialcontroller@vision.com';password='FinCtrl@2024!'}|ConvertTo-Json
$loginResp=Invoke-WebRequest -UseBasicParsing -Uri "$base/api/v1/auth/login" -Method Post -ContentType 'application/json' -Body $loginBody -TimeoutSec 30
$token=($loginResp.Content|ConvertFrom-Json).token
$headers=@{Authorization="Bearer $token"}
$eps=@('/api/v1/capEx/capex-dummy','/api/v1/budget-variance?startDate=2021-08-01&endDate=2021-10-31','/api/v1/finance-forecasting/revenue?year=2021','/api/v1/finance/invoice-metrics/in-range?startDate=2021-08-01&endDate=2021-10-31','/api/v1/total-assets-value?startDate=2021-08-01&endDate=2021-10-31','/api/v1/reporting-accu-piechart/2021','/api/v1/collection-efficiency/transactions/annual?year=2021','/api/v1/dso?startDate=2021-08-01&endDate=2021-10-31','/api/v1/expense-category?startDate=2021-08-01&endDate=2021-10-31&limit=100','/api/v1/ap-ar-aging?startDate=2021-08-01&endDate=2021-10-31')
foreach($ep in $eps){
  try {
    $resp=Invoke-WebRequest -UseBasicParsing -Uri ($base+$ep) -Headers $headers -Method Get -TimeoutSec 60
    $parsed=$resp.Content|ConvertFrom-Json
    if($parsed -is [System.Array]){ $keys="[array of $($parsed.Count) items]" }
    else { $keys=($parsed.PSObject.Properties.Name) -join ',' }
    "$ep|$keys"
  } catch {
    $st='ERR'; if($_.Exception.Response){$st=[int]$_.Exception.Response.StatusCode.value__}
    "$ep|FAIL_$st"
  }
}
