<?php
declare(strict_types=1);

// =============================================================================
// SALES DEPARTMENT — LIVE API TEST SUITE
// Credentials : Head of Sales  (headofsales@vision.com / hos@vision2025)
// Live source : https://cms-vgad.visiongroup.co.ug/api/bc-datasets/
// =============================================================================

$BASE_URL  = 'http://localhost:4000';
$EMAIL     = 'headofsales@vision.com';
$PASSWORD  = 'hos@vision2025';
$DATE_FROM = '2025-01-01';
$DATE_TO   = '2025-04-30';
$DR        = "startDate={$DATE_FROM}&endDate={$DATE_TO}";

// Known dummy-record IDs — their presence signals fallback data, not live CMS
$DUMMY_IDS = ['CUST001', 'EXP001', 'C009', 'CAMP001', 'P001', 'L001'];

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function httpGet(string $url, array $headers): array
{
    $ch  = curl_init($url);
    $hdrs = ['Accept: application/json'];
    foreach ($headers as $k => $v) {
        $hdrs[] = "$k: $v";
    }
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => $hdrs,
        CURLOPT_TIMEOUT        => 30,
    ]);
    $body   = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err    = curl_errno($ch) ? curl_error($ch) : null;
    curl_close($ch);
    $json = (is_string($body) && $body !== '') ? json_decode($body, true) : null;
    return [
        'status' => $status,
        'ok'     => $status >= 200 && $status < 300,
        'json'   => $json,
        'raw'    => (string) $body,
        'error'  => $err,
    ];
}

function httpPost(string $url, array $body): array
{
    $ch      = curl_init($url);
    $payload = json_encode($body);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json', 'Accept: application/json'],
        CURLOPT_TIMEOUT        => 30,
    ]);
    $resp   = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $json = (is_string($resp) && $resp !== '') ? json_decode($resp, true) : null;
    return ['status' => $status, 'ok' => $status >= 200 && $status < 300, 'json' => $json];
}

function jwtPayload(string $jwt): array
{
    $parts = explode('.', $jwt);
    if (count($parts) < 2) return [];
    $p  = strtr($parts[1], '-_', '+/');
    $p .= str_repeat('=', (4 - strlen($p) % 4) % 4);
    $d  = base64_decode($p, true);
    return ($d !== false) ? (json_decode($d, true) ?? []) : [];
}

/**
 * Extract the primary data array from any sales response shape.
 */
function extractRecords(?array $json): array
{
    if (!is_array($json)) return [];
    foreach (['data', 'deals', 'reps', 'accounts', 'attribution', 'contracts'] as $key) {
        if (isset($json[$key]) && is_array($json[$key])) {
            return $json[$key];
        }
    }
    if (isset($json['mergedContractValueTrends']) && is_array($json['mergedContractValueTrends'])) {
        return $json['mergedContractValueTrends'];
    }
    if (isset($json['brandLiftTrendsByChannel']) && is_array($json['brandLiftTrendsByChannel'])) {
        $all = [];
        foreach ($json['brandLiftTrendsByChannel'] as $ch) {
            if (is_array($ch)) {
                foreach ($ch as $row) $all[] = $row;
            }
        }
        return $all;
    }
    if (isset($json['cplPerMonth']) && is_array($json['cplPerMonth'])) {
        return $json['cplPerMonth'];
    }
    if (isset($json['funnel']) && is_array($json['funnel'])) {
        return $json['funnel'];
    }
    // flat numeric array at root
    if (!empty($json) && isset($json[0])) {
        return $json;
    }
    return [];
}

function isDummy(array $records, array $dummyIds): bool
{
    if (empty($records)) return false;
    $first = $records[0];
    if (!is_array($first)) return false;
    foreach ($dummyIds as $id) {
        foreach ($first as $v) {
            if ($v === $id) return true;
        }
    }
    return false;
}

// ── result tracking ───────────────────────────────────────────────────────────
$results = [];
$testNum = 0;

function runTest(
    string $label,
    string $url,
    array  $headers,
    array  &$results,
    int    &$testNum,
    array  $dummyIds
): void {
    $testNum++;
    $pad = str_pad((string)$testNum, 2, '0', STR_PAD_LEFT);
    echo "\n+-- [{$pad}] {$label}\n";
    echo "|   URL   : {$url}\n";

    $res    = httpGet($url, $headers);
    $status = $res['status'];
    $ok     = $res['ok'];
    $json   = is_array($res['json']) ? $res['json'] : [];
    $error  = $res['error'];

    $records = extractRecords($json);
    $count   = count($records);
    $source  = 'N/A';
    $note    = '';
    $badge   = '';

    if (!$ok) {
        $msg    = $json['message'] ?? $json['error'] ?? $error ?? $res['raw'];
        $note   = 'ERROR: ' . substr(is_string($msg) ? $msg : json_encode($msg), 0, 200);
        $source = 'N/A';
        $badge  = '[FAIL]';
    } elseif ($count === 0) {
        $source = 'EMPTY';
        $note   = 'Endpoint OK but returned 0 records. CMS may have no data in this range.';
        $badge  = '[EMPTY]';
    } else {
        $source = isDummy($records, $dummyIds) ? 'FALLBACK (dummy)' : 'LIVE (CMS/DB)';
        $sample = json_encode($records[0], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $note   = 'Sample: ' . substr((string)$sample, 0, 300);
        $badge  = '[PASS]';
    }

    echo "|   HTTP  : {$status}   Records: {$count}   Source: {$source}\n";
    echo "|   {$badge}\n";
    echo "|   {$note}\n";
    echo "+-- " . str_repeat('-', 70) . "\n";

    $results[] = [
        'num'    => $testNum,
        'label'  => $label,
        'status' => $status,
        'badge'  => $badge,
        'count'  => $count,
        'source' => $source,
    ];
}

// =============================================================================
// LOGIN
// =============================================================================
echo "\n" . str_repeat('=', 74) . "\n";
echo "  SALES DEPARTMENT API LIVE TEST  --  Head of Sales\n";
echo "  Email  : {$EMAIL}\n";
echo "  Range  : {$DATE_FROM}  to  {$DATE_TO}\n";
echo "  Server : {$BASE_URL}\n";
echo str_repeat('=', 74) . "\n";

global $DUMMY_IDS;

echo "\n[AUTH] Logging in as Head of Sales ...\n";
$login = httpPost("{$BASE_URL}/api/v1/auth/login", ['email' => $EMAIL, 'password' => $PASSWORD]);

if (!$login['ok'] || empty($login['json']['token'])) {
    $msg = $login['json']['error'] ?? $login['json']['message'] ?? 'unknown error';
    echo "LOGIN FAILED (HTTP {$login['status']}): {$msg}\n";
    exit(1);
}

$token    = (string) $login['json']['token'];
$jwtData  = jwtPayload($token);
$roleCode = (string) ($jwtData['role_code'] ?? '');
$roleName = (string) ($login['json']['role_name'] ?? '');
echo "[AUTH] OK  |  Role: {$roleName}  |  Code: {$roleCode}\n";

$H = ['Authorization' => "Bearer {$token}", 'X-Role-Code' => $roleCode];
$B = $BASE_URL;

// =============================================================================
// TEST EACH ENDPOINT ONE BY ONE
// =============================================================================

runTest('Revenue Attribution',              "{$B}/api/v1/sales/revenue-attribution/in-range?{$DR}",          $H, $results, $testNum, $DUMMY_IDS);
runTest('Client Lifetime Value (CLV)',      "{$B}/api/v1/sales/client-lifetime-value/in-range?{$DR}",         $H, $results, $testNum, $DUMMY_IDS);
runTest('Campaign ROI',                     "{$B}/api/v1/sales/campaign-roi?{$DR}",                           $H, $results, $testNum, $DUMMY_IDS);
runTest('Impression Shares',                "{$B}/api/v1/sales/impression-shares?{$DR}",                      $H, $results, $testNum, $DUMMY_IDS);
runTest('Click-Through Rate (CTR)',         "{$B}/api/v1/sales/ctr/in-range?{$DR}",                           $H, $results, $testNum, $DUMMY_IDS);
runTest('Rate Card Utilisation',            "{$B}/api/v1/sales/rate-card-utilization",                        $H, $results, $testNum, $DUMMY_IDS);
runTest('Conversion Funnels',               "{$B}/api/v1/sales/conversion-funnels/in-range?{$DR}",            $H, $results, $testNum, $DUMMY_IDS);
runTest('Territory Performance',            "{$B}/api/v1/sales/territory-performance/in-range?{$DR}",         $H, $results, $testNum, $DUMMY_IDS);
runTest('Lead Efficiency',                  "{$B}/api/v1/sales/lead-efficiency",                               $H, $results, $testNum, $DUMMY_IDS);
runTest('A/B Test Results',                 "{$B}/api/v1/sales/ab-tests?{$DR}",                               $H, $results, $testNum, $DUMMY_IDS);
runTest('Campaign Attribution',             "{$B}/api/v1/sales/campaign-attribution",                         $H, $results, $testNum, $DUMMY_IDS);
runTest('Brand Lift',                       "{$B}/api/v1/sales/brand-lift",                                   $H, $results, $testNum, $DUMMY_IDS);
runTest('Contract Value Trends',            "{$B}/api/v1/sales/contract-value-trends?{$DR}",                  $H, $results, $testNum, $DUMMY_IDS);
runTest('Supervisor -- Overview',           "{$B}/api/v1/sales/SupervisorSalesAnalytics?{$DR}",               $H, $results, $testNum, $DUMMY_IDS);
runTest('Supervisor -- Pipeline (list)',    "{$B}/api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity?page=1&pageSize=5",           $H, $results, $testNum, $DUMMY_IDS);
runTest('Supervisor -- Pipeline (KPIs)',    "{$B}/api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity/kpis",                        $H, $results, $testNum, $DUMMY_IDS);
runTest('Supervisor -- Quota (list)',       "{$B}/api/v1/sales/SupervisorSalesAnalytics/quota-attainment?page=1&pageSize=5",            $H, $results, $testNum, $DUMMY_IDS);
runTest('Supervisor -- Quota (KPIs)',       "{$B}/api/v1/sales/SupervisorSalesAnalytics/quota-attainment/kpis",                        $H, $results, $testNum, $DUMMY_IDS);
runTest('Supervisor -- Penetration (list)',"{$B}/api/v1/sales/SupervisorSalesAnalytics/account-penetration?page=1&pageSize=5",         $H, $results, $testNum, $DUMMY_IDS);
runTest('Supervisor -- Penetration (KPIs)',"{$B}/api/v1/sales/SupervisorSalesAnalytics/account-penetration/kpis",                      $H, $results, $testNum, $DUMMY_IDS);
runTest('Supervisor -- Corp Health (list)',"{$B}/api/v1/sales/SupervisorSalesAnalytics/corporate-account-health?page=1&pageSize=5",    $H, $results, $testNum, $DUMMY_IDS);
runTest('Supervisor -- Corp Health (KPIs)',"{$B}/api/v1/sales/SupervisorSalesAnalytics/corporate-account-health/kpis",                 $H, $results, $testNum, $DUMMY_IDS);

// =============================================================================
// SUMMARY TABLE
// =============================================================================
echo "\n" . str_repeat('=', 74) . "\n";
echo "  RESULTS SUMMARY\n";
echo str_repeat('=', 74) . "\n";
printf("%-4s %-42s %-6s %-7s %-18s\n", '#', 'Endpoint', 'HTTP', 'Count', 'Source');
echo str_repeat('-', 74) . "\n";

$pass = $empty = $fail = 0;
foreach ($results as $r) {
    printf("%-4s %-42s %-6s %-7s %-18s\n",
        $r['num'],
        substr((string)$r['label'], 0, 42),
        $r['status'],
        $r['count'],
        substr((string)$r['source'], 0, 18)
    );
    if (str_contains($r['badge'], 'PASS'))  $pass++;
    elseif (str_contains($r['badge'], 'EMPTY')) $empty++;
    else $fail++;
}

echo str_repeat('-', 74) . "\n";
printf("  [PASS]: %-3s  [EMPTY]: %-3s  [FAIL]: %-3s  TOTAL: %s\n", $pass, $empty, $fail, $testNum);
echo "\nLegend:\n";
echo "  LIVE (CMS/DB)    = data fetched from the live CMS external API\n";
echo "  FALLBACK (dummy) = CMS unreachable; served local fallback data\n";
echo "  EMPTY            = endpoint responded OK but returned 0 records\n";
echo str_repeat('=', 74) . "\n\n";
