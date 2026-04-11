/**
 * Administrative Department — Authentication & Live Data Tests
 * Tests all administrative endpoints with proper RBAC validation.
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

// ─── All administrative endpoints ────────────────────────────────────────────
// admin_staff: /api/v1/administrative/* + /api/v1/admnistrative/* (typo variant)
const ADMIN_ENDPOINTS = [
  // Task completion rates
  `/administrative/task-comp-rates/in-range${QS.range}`,
  // Process throughput
  `/administrative/process-throughput/in-range${QS.range}`,
  // Visitor patterns
  `/administrative/visitor-patterns`,
  // Wait time analytics
  `/administrative/wait-time`,
  // RVS Analytics (resources, spaces, vendors)
  `/administrative/rvsAnalytics/overview`,
  `/administrative/rvsAnalytics/resources/analytics`,
  `/administrative/rvsAnalytics/resources/kpis`,
  `/administrative/rvsAnalytics/resources/chart`,
  `/administrative/rvsAnalytics/resources/list`,
  `/administrative/rvsAnalytics/spaces/analytics`,
  `/administrative/rvsAnalytics/spaces/kpis`,
  `/administrative/rvsAnalytics/spaces/chart`,
  `/administrative/rvsAnalytics/spaces/list`,
  `/administrative/rvsAnalytics/vendors/analytics`,
  `/administrative/rvsAnalytics/vendors/kpis`,
  `/administrative/rvsAnalytics/vendors/chart`,
  `/administrative/rvsAnalytics/vendors/list`,
  `/administrative/rvsAnalytics/filters/departments`,
  `/administrative/rvsAnalytics/filters/resource-types`,
  `/administrative/rvsAnalytics/filters/locations`,
  `/administrative/rvsAnalytics/filters/service-types`,
  `/administrative/rvsAnalytics/filters/vendor-names`,
  // Note: routes registered under the typo variant "admnistrative"
  `/admnistrative/meetingAnalytics`,
  `/admnistrative/scheduleEfficiency/summary`,
  `/admnistrative/scheduleEfficiency/taskProgress`,
];

// ─── Endpoints that should be blocked for other departments ───────────────────
const CROSS_DEPT_BLOCKED = [
  `/administrative/task-comp-rates/in-range${QS.range}`,
  `/administrative/rvsAnalytics/overview`,
  `/admnistrative/meetingAnalytics`,
  `/admnistrative/scheduleEfficiency/summary`,
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${c.bold}${c.cyan}════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.bold}  Administrative Dept — Auth & Live Data Tests       ${c.reset}`);
  console.log(`${c.bold}${c.cyan}════════════════════════════════════════════════════${c.reset}\n`);

  // ── 1. Logins ──────────────────────────────────────────────────────────────
  info("► Logging in test users…");
  let adminToken, opsToken;

  try {
    adminToken = await login("administrationmanager@vision.com", "AdminStaff@2024!");
    pass("admin_staff    (administrationmanager@vision.com)");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  try {
    opsToken = await login("technician@vision.com", "OpsStaff@2024!");
    pass("operations_staff (technician@vision.com) — used for 403 check");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  // ── 2. No token → 401 ──────────────────────────────────────────────────────
  console.log();
  info("► Unauthenticated access — expect 401");
  await hit(null, `/administrative/task-comp-rates/in-range${QS.range}`, 401, "No token → task-comp-rates");
  await hit(null, `/administrative/rvsAnalytics/overview`,               401, "No token → rvsAnalytics/overview");
  await hit(null, `/admnistrative/meetingAnalytics`,                     401, "No token → meetingAnalytics");

  // ── 3. Operations user → 403 on administrative ────────────────────────────
  console.log();
  info("► Operations user accessing Administrative — expect 403");
  if (opsToken) {
    for (const path of CROSS_DEPT_BLOCKED) {
      await hit(opsToken, path, 403, `operations_staff → ${path}`);
    }
  }

  // ── 4. admin_staff — full access to all endpoints ─────────────────────────
  console.log();
  info(`► admin_staff — all ${ADMIN_ENDPOINTS.length} endpoints (expect 200)`);
  if (adminToken) {
    for (const path of ADMIN_ENDPOINTS) {
      await hit(adminToken, path, 200);
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
