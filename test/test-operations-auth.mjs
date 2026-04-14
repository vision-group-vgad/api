/**
 * Operations Department — Authentication & Live Data Tests
 * Tests all operations endpoints with proper RBAC validation.
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

// ─── head_of_operations: full /operations/* access ────────────────────────────
const HEAD_OF_OPS_ENDPOINTS = [
  // Core operations routes
  "/operations/delivery-timelines",
  "/operations/ticket-resolution",
  "/operations/setup-time",
  "/operations/job-scheduling",
  "/operations/parts-utilization",
  "/operations/route-efficiency",
  // Date-range routes
  `/operations/fuel-consumption/in-range${QS.range}`,
  `/operations/signal-quality-metrics/in-range${QS.range}`,
  `/operations/up-downtime-logs/in-range${QS.range}`,
  // Production analytics (head only — head_of_ops gets /operations/*)
  "/operations/OperationsProductionAnalytics/production-yield",
  "/operations/OperationsProductionAnalytics/production-yield/kpis",
  "/operations/OperationsProductionAnalytics/machine-oee",
  "/operations/OperationsProductionAnalytics/machine-oee/kpis",
  "/operations/OperationsProductionAnalytics/material-waste",
  "/operations/OperationsProductionAnalytics/material-waste/kpis",
];

// ─── operations_staff: limited subset ────────────────────────────────────────
const OPS_STAFF_ALLOWED = [
  "/operations/delivery-timelines",
  `/operations/fuel-consumption/in-range${QS.range}`,
  "/operations/job-scheduling",
  "/operations/parts-utilization",
  "/operations/route-efficiency",
  `/operations/signal-quality-metrics/in-range${QS.range}`,
  "/operations/ticket-resolution",
  `/operations/up-downtime-logs/in-range${QS.range}`,
];

// ─── operations_staff: blocked (head_of_operations only) ──────────────────────
const OPS_STAFF_BLOCKED = [
  "/operations/setup-time",
  "/operations/OperationsProductionAnalytics/production-yield",
  "/operations/OperationsProductionAnalytics/production-yield/kpis",
  "/operations/OperationsProductionAnalytics/machine-oee",
  "/operations/OperationsProductionAnalytics/material-waste",
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${c.bold}${c.cyan}════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.bold}  Operations Department — Auth & Live Data Tests     ${c.reset}`);
  console.log(`${c.bold}${c.cyan}════════════════════════════════════════════════════${c.reset}\n`);

  // ── 1. Logins ──────────────────────────────────────────────────────────────
  info("► Logging in test users…");
  let headToken, staffToken, itToken;

  try {
    headToken = await login("headofprinting@vision.com", "OpsHead@2024!");
    pass("head_of_operations  (headofprinting@vision.com)");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  try {
    staffToken = await login("technician@vision.com", "OpsStaff@2024!");
    pass("operations_staff    (technician@vision.com)");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  try {
    itToken = await login("headofit@vision.com", "ITHead@2024!");
    pass("head_of_it          (headofit@vision.com) — used for 403 check");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  // ── 2. No token → 401 ──────────────────────────────────────────────────────
  console.log();
  info("► Unauthenticated access — expect 401");
  await hit(null, "/operations/delivery-timelines",              401, "No token → /operations/delivery-timelines");
  await hit(null, "/operations/job-scheduling",                  401, "No token → /operations/job-scheduling");
  await hit(null, "/operations/OperationsProductionAnalytics/production-yield", 401, "No token → /operations/OperationsProductionAnalytics");

  // ── 3. IT user → 403 on operations ────────────────────────────────────────
  console.log();
  info("► IT user accessing Operations — expect 403");
  if (itToken) {
    await hit(itToken, "/operations/delivery-timelines",         403, "head_of_it → /operations/delivery-timelines");
    await hit(itToken, `/operations/fuel-consumption/in-range${QS.range}`, 403, "head_of_it → /operations/fuel-consumption");
    await hit(itToken, "/operations/OperationsProductionAnalytics/production-yield", 403, "head_of_it → /operations/OperationsProductionAnalytics");
  }

  // ── 4. head_of_operations — full access ───────────────────────────────────
  console.log();
  info(`► head_of_operations — all ${HEAD_OF_OPS_ENDPOINTS.length} endpoints (expect 200)`);
  if (headToken) {
    for (const path of HEAD_OF_OPS_ENDPOINTS) {
      await hit(headToken, path, 200);
    }
  }

  // ── 5. operations_staff — allowed endpoints ───────────────────────────────
  console.log();
  info(`► operations_staff — allowed endpoints (expect 200)`);
  if (staffToken) {
    for (const path of OPS_STAFF_ALLOWED) {
      await hit(staffToken, path, 200);
    }
  }

  // ── 6. operations_staff — blocked endpoints ───────────────────────────────
  console.log();
  info(`► operations_staff — restricted endpoints (expect 403)`);
  if (staffToken) {
    for (const path of OPS_STAFF_BLOCKED) {
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
