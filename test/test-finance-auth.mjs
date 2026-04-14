/**
 * Finance Department — Authentication & Live Data Tests
 * Tests all finance endpoints with proper RBAC validation.
 */

const BASE = "http://localhost:4000/api/v1";

// ─── Colour helpers ──────────────────────────────────────────────────────────
const c = {
  reset : "\x1b[0m",
  bold  : "\x1b[1m",
  green : "\x1b[32m",
  red   : "\x1b[31m",
  yellow: "\x1b[33m",
  cyan  : "\x1b[36m",
  dim   : "\x1b[2m",
};
const pass  = (msg) => console.log(`  ${c.green}✔${c.reset}  ${msg}`);
const fail  = (msg) => console.log(`  ${c.red}✘${c.reset}  ${msg}`);
const info  = (msg) => console.log(`${c.cyan}${c.bold}${msg}${c.reset}`);

// ─── Stats ───────────────────────────────────────────────────────────────────
let passed = 0, failed = 0;

async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Login failed for ${email}: ${JSON.stringify(json)}`);
  return json.token;
}

async function hit(token, path, expectedStatus = 200, label = null) {
  const url = `${BASE}${path}`;
  let status, body;
  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    status = res.status;
    body   = await res.json().catch(() => ({}));
  } catch (e) {
    fail(`${label ?? path}  →  NETWORK ERROR: ${e.message}`);
    failed++;
    return;
  }

  const ok = status === expectedStatus;
  const label_ = label ?? path;
  if (ok) {
    const preview = body?.success === false
      ? `(success:false — ${body?.message ?? "no message"})`
      : body?.data || body?.summary || body?.records
        ? "(data returned)"
        : "";
    pass(`[${status}] ${label_} ${c.dim}${preview}${c.reset}`);
    passed++;
  } else {
    const msg = body?.message ?? JSON.stringify(body).slice(0, 120);
    fail(`[${status}] ${label_}  →  expected ${expectedStatus}. Body: ${msg}`);
    failed++;
  }
}

// ─── Endpoint catalogue ──────────────────────────────────────────────────────
const QS = {
  range      : "?startDate=2024-01-01&endDate=2024-12-31",
  year       : "?year=2024",
  yearMonth  : "?year=2024&month=06",
  day        : "?date=2024-06-15",
  startYear  : "?year=2024",
  range2025  : "?startDate=2025-01-01&endDate=2025-04-30",
};

// head_of_finance has access to everything in the finance domain
const HEAD_OF_FINANCE_ENDPOINTS = [
  // Core finance
  "/finance/close-metrics",
  "/finance/audit-trail",
  "/finance/reporting-accuracy",
  "/finance/chart-data",
  "/finance/gl-accounts",
  "/finance/document-types",
  "/finance/regional-pnl",
  "/finance/regions",
  "/finance/diagnostics",
  "/finance/raw-data",
  // Standalone finance routes
  "/reporting-accu-piechart/2024",
  `/ap-ar-aging${QS.range}`,
  "/total-assets-value",
  "/asset-depreciation",
  `/expense-category${QS.range}`,
  `/budget-variance${QS.range}`,
  // Finance forecasting
  "/finance-forecasting/revenue",
  "/finance-forecasting/expense",
  "/finance-forecasting/net-income",
  "/finance-forecasting/cashflow",
  // GL reconciliation
  `/gl-reconciliation/range${QS.range}`,
  `/gl-reconciliation/start-year${QS.startYear}`,
  // Statement & tax
  `/tax-provisioning${QS.range}`,
  `/fin-statement-variance${QS.range}`,
  // CapEx
  "/capEx/capex-dummy",
  // Receivables
  `/dso${QS.range}`,
  `/bad-debt-ratios/range${QS.range}`,
  `/bad-debt-ratios/annual${QS.year}`,
  `/bad-debt-ratios/month${QS.yearMonth}`,
  // Collection efficiency
  `/collection-efficiency/annual${QS.year}`,
  `/collection-efficiency/month${QS.yearMonth}`,
  `/collection-efficiency/range${QS.range}`,
  `/collection-efficiency/transactions/annual${QS.year}`,
  `/collection-efficiency/transactions/day${QS.day}`,
  `/collection-efficiency/transactions/month${QS.yearMonth}`,
  `/collection-efficiency/transactions/range${QS.range}`,
  // System integration health
  "/integration-health",
  // Pipeline & invoice
  "/finance/pipeline-metrics",
  `/finance/invoice-metrics/in-range${QS.range2025}`,
];

// finance_staff has access to this subset only
const FINANCE_STAFF_ALLOWED = [
  "/finance/close-metrics",
  "/finance/audit-trail",
  "/finance/reporting-accuracy",
  "/finance/chart-data",
  "/finance/gl-accounts",
  `/expense-category${QS.range}`,
  `/budget-variance${QS.range}`,
  `/dso${QS.range}`,
  `/bad-debt-ratios/range${QS.range}`,
  `/bad-debt-ratios/annual${QS.year}`,
  `/bad-debt-ratios/month${QS.yearMonth}`,
  `/collection-efficiency/annual${QS.year}`,
  `/collection-efficiency/month${QS.yearMonth}`,
  `/collection-efficiency/range${QS.range}`,
  `/collection-efficiency/transactions/annual${QS.year}`,
  `/collection-efficiency/transactions/day${QS.day}`,
  `/collection-efficiency/transactions/month${QS.yearMonth}`,
  `/collection-efficiency/transactions/range${QS.range}`,
  "/finance/pipeline-metrics",
  `/finance/invoice-metrics/in-range${QS.range2025}`,
];

// finance_staff does NOT get these (head_of_finance only)
const FINANCE_STAFF_BLOCKED = [
  "/reporting-accu-piechart/2024",
  "/ap-ar-aging",
  "/total-assets-value",
  "/asset-depreciation",
  "/finance-forecasting/revenue",
  "/gl-reconciliation/range",
  "/tax-provisioning",
  "/fin-statement-variance",
  "/capEx/capex-dummy",
  "/integration-health",
];

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${c.bold}${c.cyan}════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.bold}  Finance Department — Auth & Live Data Test Suite  ${c.reset}`);
  console.log(`${c.bold}${c.cyan}════════════════════════════════════════════════════${c.reset}\n`);

  // ── 1. Login all users ──────────────────────────────────────────────────────
  info("► Logging in test users…");
  let headToken, staffToken, itToken;
  try {
    headToken  = await login("financialcontroller@vision.com", "FinanceHead@2024!");
    pass("head_of_finance  (financialcontroller@vision.com)");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  try {
    staffToken = await login("senioraccount@vision.com", "FinanceStaff@2024!");
    pass("finance_staff    (senioraccount@vision.com)");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  try {
    itToken    = await login("headofit@vision.com", "ITHead@2024!");
    pass("head_of_it       (headofit@vision.com)  — used for 403 check");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  // ── 2. No token → 401 ──────────────────────────────────────────────────────
  console.log();
  info("► Unauthenticated access — expect 401");
  await hit(null, "/finance/close-metrics", 401, "No token → /finance/close-metrics");
  await hit(null, "/dso",                   401, "No token → /dso");

  // ── 3. Wrong department → 403 ───────────────────────────────────────────────
  console.log();
  info("► IT user accessing Finance — expect 403");
  if (itToken) {
    await hit(itToken, "/finance/close-metrics", 403, "head_of_it → /finance/close-metrics");
    await hit(itToken, "/dso",                   403, "head_of_it → /dso");
    await hit(itToken, "/budget-variance",        403, "head_of_it → /budget-variance");
    await hit(itToken, "/finance/pipeline-metrics", 403, "head_of_it → /finance/pipeline-metrics");
  }

  // ── 4. head_of_finance — full access ───────────────────────────────────────
  console.log();
  info(`► head_of_finance — all ${HEAD_OF_FINANCE_ENDPOINTS.length} endpoints (expect 200)`);
  if (headToken) {
    for (const path of HEAD_OF_FINANCE_ENDPOINTS) {
      await hit(headToken, path, 200);
    }
  }

  // ── 5. finance_staff — allowed endpoints ───────────────────────────────────
  console.log();
  info(`► finance_staff — allowed endpoints (expect 200)`);
  if (staffToken) {
    for (const path of FINANCE_STAFF_ALLOWED) {
      await hit(staffToken, path, 200);
    }
  }

  // ── 6. finance_staff — restricted endpoints ────────────────────────────────
  console.log();
  info(`► finance_staff — restricted endpoints (expect 403)`);
  if (staffToken) {
    for (const path of FINANCE_STAFF_BLOCKED) {
      await hit(staffToken, path, 403);
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  const total = passed + failed;
  console.log(`\n${c.bold}${c.cyan}════════════════════════════════════════════════════${c.reset}`);
  console.log(`  Results: ${c.green}${c.bold}${passed} passed${c.reset}  /  ${failed > 0 ? c.red + c.bold : ""}${failed} failed${c.reset}  /  ${total} total`);
  console.log(`${c.bold}${c.cyan}════════════════════════════════════════════════════${c.reset}\n`);

  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(`\n${c.red}Fatal error: ${e.message}${c.reset}`);
  process.exit(1);
});
