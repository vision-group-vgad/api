/**
 * Sales Department — Authentication & Live Data Tests
 * Tests all sales endpoints with proper RBAC validation.
 */

const BASE = "http://localhost:4000/api/v1";

// ─── Colour helpers ──────────────────────────────────────────────────────────
const c = {
  reset : "\x1b[0m",
  bold  : "\x1b[1m",
  green : "\x1b[32m",
  red   : "\x1b[31m",
  cyan  : "\x1b[36m",
  dim   : "\x1b[2m",
};
const pass = (msg) => console.log(`  ${c.green}✔${c.reset}  ${msg}`);
const fail = (msg) => console.log(`  ${c.red}✘${c.reset}  ${msg}`);
const info = (msg) => console.log(`${c.cyan}${c.bold}${msg}${c.reset}`);

let passed = 0, failed = 0;

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
      : "(data returned)";
    pass(`[${status}] ${label_} ${c.dim}${preview}${c.reset}`);
    passed++;
  } else {
    const msg = body?.message ?? body?.error ?? JSON.stringify(body).slice(0, 150);
    fail(`[${status}] ${label_}  →  expected ${expectedStatus}. Body: ${msg}`);
    failed++;
  }
}

// ─── Query param shorthands ───────────────────────────────────────────────────
const QS = {
  range: "?startDate=2025-01-01&endDate=2025-04-30",
};

// ─── All endpoints head_of_sales can access ───────────────────────────────────
// head_of_sales: /api/v1/sales/* + /api/v1/marketing/*
const HEAD_OF_SALES_ENDPOINTS = [
  // Revenue attribution
  `/sales/revenue-attribution/in-range${QS.range}`,
  // Client lifetime value
  `/sales/client-lifetime-value/in-range${QS.range}`,
  // Campaign ROI
  `/sales/campaign-roi`,
  // Impression shares
  `/sales/impression-shares`,
  // CTR
  `/sales/ctr/in-range${QS.range}`,
  // Rate card utilisation
  `/sales/rate-card-utilization`,
  // Conversion funnels
  `/sales/conversion-funnels/in-range${QS.range}`,
  // Territory performance
  `/sales/territory-performance/in-range${QS.range}`,
  // Lead efficiency (via /sales/lead-efficiency)
  `/sales/lead-efficiency`,
  // AB tests
  `/sales/ab-tests`,
  // Campaign attribution
  `/sales/campaign-attribution`,
  // Brand lift
  `/sales/brand-lift`,
  // Contract value trends
  `/sales/contract-value-trends`,
  // Supervisor analytics
  `/sales/SupervisorSalesAnalytics`,
  `/sales/SupervisorSalesAnalytics/pipeline-velocity`,
  `/sales/SupervisorSalesAnalytics/pipeline-velocity/kpis`,
  `/sales/SupervisorSalesAnalytics/quota-attainment`,
  `/sales/SupervisorSalesAnalytics/quota-attainment/kpis`,
  `/sales/SupervisorSalesAnalytics/account-penetration`,
  `/sales/SupervisorSalesAnalytics/account-penetration/kpis`,
  `/sales/SupervisorSalesAnalytics/corporate-account-health`,
  `/sales/SupervisorSalesAnalytics/corporate-account-health/kpis`,
  // Marketing (also under head_of_sales)
  `/marketing/lead-efficiency`,
];

// ─── Endpoints sales_staff is allowed ────────────────────────────────────────
const SALES_STAFF_ALLOWED = [
  `/sales/revenue-attribution/in-range${QS.range}`,
  `/sales/client-lifetime-value/in-range${QS.range}`,
  `/sales/campaign-roi`,
  `/sales/impression-shares`,
  `/sales/ctr/in-range${QS.range}`,
  `/sales/rate-card-utilization`,
  `/sales/conversion-funnels/in-range${QS.range}`,
  `/sales/territory-performance/in-range${QS.range}`,
  `/sales/lead-efficiency`,
  `/sales/brand-lift`,
  `/sales/contract-value-trends`,
];

// ─── Endpoints sales_staff should be blocked from ────────────────────────────
// ab-tests, campaign-attribution, SupervisorSalesAnalytics, marketing
const SALES_STAFF_BLOCKED = [
  `/sales/ab-tests`,
  `/sales/campaign-attribution`,
  `/sales/SupervisorSalesAnalytics`,
  `/marketing/lead-efficiency`,
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${c.bold}${c.cyan}════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.bold}  Sales Department — Auth & Live Data Test Suite     ${c.reset}`);
  console.log(`${c.bold}${c.cyan}════════════════════════════════════════════════════${c.reset}\n`);

  // ── 1. Logins ──────────────────────────────────────────────────────────────
  info("► Logging in test users…");
  let headToken, staffToken, financeToken;

  try {
    headToken = await login("headofsales@vision.com", "SalesHead@2024!");
    pass("head_of_sales  (headofsales@vision.com)");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  try {
    staffToken = await login("digitalmktopt@vision.com", "SalesStaff@2024!");
    pass("sales_staff    (digitalmktopt@vision.com)");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  try {
    financeToken = await login("financialcontroller@vision.com", "FinanceHead@2024!");
    pass("head_of_finance (financialcontroller@vision.com) — used for 403 check");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  // ── 2. No token → 401 ──────────────────────────────────────────────────────
  console.log();
  info("► Unauthenticated access — expect 401");
  await hit(null, "/sales/campaign-roi",          401, "No token → /sales/campaign-roi");
  await hit(null, "/sales/client-lifetime-value/in-range?startDate=2024-01-01&endDate=2024-12-31", 401, "No token → /sales/client-lifetime-value");

  // ── 3. Finance user → 403 on sales ────────────────────────────────────────
  console.log();
  info("► Finance user accessing Sales — expect 403");
  if (financeToken) {
    await hit(financeToken, "/sales/campaign-roi",        403, "head_of_finance → /sales/campaign-roi");
    await hit(financeToken, "/sales/territory-performance/in-range?startDate=2024-01-01&endDate=2024-12-31", 403, "head_of_finance → /sales/territory-performance");
    await hit(financeToken, "/marketing/lead-efficiency", 403, "head_of_finance → /marketing/lead-efficiency");
  }

  // ── 4. head_of_sales — full access ────────────────────────────────────────
  console.log();
  info(`► head_of_sales — all ${HEAD_OF_SALES_ENDPOINTS.length} endpoints (expect 200)`);
  if (headToken) {
    for (const path of HEAD_OF_SALES_ENDPOINTS) {
      await hit(headToken, path, 200);
    }
  }

  // ── 5. sales_staff — allowed endpoints ───────────────────────────────────
  console.log();
  info(`► sales_staff — allowed endpoints (expect 200)`);
  if (staffToken) {
    for (const path of SALES_STAFF_ALLOWED) {
      await hit(staffToken, path, 200);
    }
  }

  // ── 6. sales_staff — blocked endpoints ───────────────────────────────────
  console.log();
  info(`► sales_staff — restricted endpoints (expect 403)`);
  if (staffToken) {
    for (const path of SALES_STAFF_BLOCKED) {
      await hit(staffToken, path, 403);
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
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
