/**
 * IT Department — Authentication & Live Data Tests
 * Tests all IT endpoints with proper RBAC validation.
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

// ─── head_of_it: full IT access ───────────────────────────────────────────────
// roles: /api/v1/server-load/*, /api/v1/storageUtilization, /api/v1/cyber-posture,
//        /api/v1/patch-compliance, /api/v1/system-health, /api/v1/IT/*,
//        /api/v1/it/*, /api/v1/infrastructure/*
const HEAD_OF_IT_ENDPOINTS = [
  // Server load (piechart by year param)
  "/server-load/2025",
  // Storage utilization donut chart
  "/storageUtilization",
  // Cyber posture
  "/cyber-posture",
  // Patch compliance
  "/patch-compliance",
  // System health
  "/system-health",
  // Infrastructure sub-paths
  "/infrastructure/cpu-memory-trends",
  "/infrastructure/latency-trends",
  "/infrastructure/asset-status",
  // IT/* — infra costs (old route uppercase)
  "/IT/infrastructure-costs",
  // IT/* — ticket SLA
  "/IT/sla/overview",
  "/IT/sla/by-priority",
  "/IT/sla/by-agent",
  // it/* lower-case routes
  "/it/sys-health-score/in-range" + QS.range,
  "/it/cpu-usage",
  "/it/infra-costs/in-range" + QS.range,
  "/it/satisfaction",
  "/it/assets-inventory",
  // ServerStoragePatch analytics
  "/it/ServerStoragePatch/server-load",
  "/it/ServerStoragePatch/server-load/kpis",
  "/it/ServerStoragePatch/storage",
  "/it/ServerStoragePatch/storage/kpis",
  "/it/ServerStoragePatch/patch-compliance",
  "/it/ServerStoragePatch/patch-compliance/kpis",
  // Cyber security posture (in-range)
  "/it/cycber-sec-router/in-range" + QS.range,
];

// ─── it_staff: limited subset ─────────────────────────────────────────────────
const IT_STAFF_ALLOWED = [
  "/server-load/2025",
  "/storageUtilization",
  "/system-health",
  "/it/cpu-usage",
  "/it/satisfaction",
  "/it/assets-inventory",
  "/it/sys-health-score/in-range" + QS.range,
];

// ─── it_staff blocked (head_of_it only) ──────────────────────────────────────
const IT_STAFF_BLOCKED = [
  "/cyber-posture",
  "/patch-compliance",
  "/infrastructure/cpu-memory-trends",
  "/IT/infrastructure-costs",
  "/IT/sla/overview",
  "/it/infra-costs/in-range" + QS.range,
  "/it/ServerStoragePatch/server-load",
  "/it/cycber-sec-router/in-range" + QS.range,
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${c.bold}${c.cyan}════════════════════════════════════════════════════${c.reset}`);
  console.log(`${c.bold}  IT Department — Auth & Live Data Test Suite        ${c.reset}`);
  console.log(`${c.bold}${c.cyan}════════════════════════════════════════════════════${c.reset}\n`);

  // ── 1. Logins ──────────────────────────────────────────────────────────────
  info("► Logging in test users…");
  let headToken, staffToken, salesToken;

  try {
    headToken = await login("headofit@vision.com", "ITHead@2024!");
    pass("head_of_it     (headofit@vision.com)");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  try {
    staffToken = await login("networkadmin@vision.com", "ITStaff@2024!");
    pass("it_staff       (networkadmin@vision.com)");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  try {
    salesToken = await login("headofsales@vision.com", "SalesHead@2024!");
    pass("head_of_sales  (headofsales@vision.com) — used for 403 check");
    passed++;
  } catch (e) { fail(e.message); failed++; }

  // ── 2. No token → 401 ──────────────────────────────────────────────────────
  console.log();
  info("► Unauthenticated access — expect 401");
  await hit(null, "/system-health",   401, "No token → /system-health");
  await hit(null, "/cyber-posture",   401, "No token → /cyber-posture");
  await hit(null, "/it/cpu-usage",    401, "No token → /it/cpu-usage");

  // ── 3. Sales user → 403 on IT ─────────────────────────────────────────────
  console.log();
  info("► Sales user accessing IT — expect 403");
  if (salesToken) {
    await hit(salesToken, "/system-health",              403, "head_of_sales → /system-health");
    await hit(salesToken, "/cyber-posture",              403, "head_of_sales → /cyber-posture");
    await hit(salesToken, "/it/ServerStoragePatch/server-load", 403, "head_of_sales → /it/ServerStoragePatch");
    await hit(salesToken, "/IT/sla/overview",            403, "head_of_sales → /IT/sla/overview");
  }

  // ── 4. head_of_it — full access ───────────────────────────────────────────
  console.log();
  info(`► head_of_it — all ${HEAD_OF_IT_ENDPOINTS.length} endpoints (expect 200)`);
  if (headToken) {
    for (const path of HEAD_OF_IT_ENDPOINTS) {
      await hit(headToken, path, 200);
    }
  }

  // ── 5. it_staff — allowed endpoints ──────────────────────────────────────
  console.log();
  info(`► it_staff — allowed endpoints (expect 200)`);
  if (staffToken) {
    for (const path of IT_STAFF_ALLOWED) {
      await hit(staffToken, path, 200);
    }
  }

  // ── 6. it_staff — blocked endpoints ──────────────────────────────────────
  console.log();
  info(`► it_staff — restricted endpoints (expect 403)`);
  if (staffToken) {
    for (const path of IT_STAFF_BLOCKED) {
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
