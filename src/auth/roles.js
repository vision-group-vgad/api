/**
 * Role-based access control — URL pattern lists per role.
 * Patterns support wildcards: /api/v1/it/* matches any IT sub-path.
 * super_admin bypasses all checks (full access).
 */

const ROLES = {
  super_admin: ["*"],

  // ── IT ────────────────────────────────────────────────────────────────────
  head_of_it: [
    "/api/v1/server-load/*",
    "/api/v1/storageUtilization",
    "/api/v1/cyber-posture",
    "/api/v1/patch-compliance",
    "/api/v1/system-health",
    "/api/v1/IT/*",
    "/api/v1/it/*",
    "/api/v1/infrastructure/*",
    "/api/v1/specialized/data-govern",
    "/api/v1/specialized/insight-adoption",
    "/api/v1/executive/company-wide-kpis",
  ],
  it_staff: [
    "/api/v1/server-load/*",
    "/api/v1/storageUtilization",
    "/api/v1/system-health",
    "/api/v1/it/cpu-usage",
    "/api/v1/it/satisfaction",
    "/api/v1/it/assets-inventory",
    "/api/v1/it/sys-health-score/in-range",
  ],

  // ── Sales ─────────────────────────────────────────────────────────────────
  head_of_sales: [
    "/api/v1/sales/*",
    "/api/v1/marketing/*",
    "/api/v1/executive/revenue-performance",
    "/api/v1/executive/market-share",
    "/api/v1/executive/roi-analysis",
    "/api/v1/executive/company-wide-kpis",
    "/api/v1/specialized/sponsor-roi",
  ],
  sales_staff: [
    "/api/v1/sales/revenue-attribution/*",
    "/api/v1/sales/client-lifetime-value/*",
    "/api/v1/sales/campaign-roi",
    "/api/v1/sales/impression-shares",
    "/api/v1/sales/ctr/*",
    "/api/v1/sales/rate-card-utilization",
    "/api/v1/sales/conversion-funnels/*",
    "/api/v1/sales/territory-performance/*",
    "/api/v1/sales/lead-efficiency",
    "/api/v1/sales/brand-lift",
    "/api/v1/sales/contract-value-trends",
  ],

  // ── Operations ────────────────────────────────────────────────────────────
  head_of_operations: [
    "/api/v1/operations/*",
    "/api/v1/executive/company-wide-kpis",
  ],
  operations_staff: [
    "/api/v1/operations/delivery-timelines",
    "/api/v1/operations/fuel-consumption/*",
    "/api/v1/operations/job-scheduling",
    "/api/v1/operations/parts-utilization",
    "/api/v1/operations/route-efficiency",
    "/api/v1/operations/signal-quality-metrics/*",
    "/api/v1/operations/ticket-resolution",
    "/api/v1/operations/up-downtime-logs/*",
  ],

  // ── Finance ───────────────────────────────────────────────────────────────
  head_of_finance: [
    "/api/v1/finance/*",
    "/api/v1/reporting-accu-piechart/*",
    "/api/v1/ap-ar-aging",
    "/api/v1/total-assets-value",
    "/api/v1/asset-depreciation",
    "/api/v1/expense-category",
    "/api/v1/budget-variance",
    "/api/v1/finance-forecasting/*",
    "/api/v1/gl-reconciliation/*",
    "/api/v1/tax-provisioning",
    "/api/v1/fin-statement-variance",
    "/api/v1/dso",
    "/api/v1/bad-debt-ratios/*",
    "/api/v1/collection-efficiency/*",
    "/api/v1/integration-health",
    "/api/v1/capEx/*",
    "/api/v1/executive/liquidity-ratios",
    "/api/v1/executive/financial-health",
    "/api/v1/executive/cost-optimization",
    "/api/v1/executive/company-wide-kpis",
    "/api/v1/specialized/risk-exposure",
    "/api/v1/specialized/mitigation-effectiveness",
    "/api/v1/executives/risk-heatmap",
    "/api/v1/executives/control-effectiveness",
    "/api/v1/executives/compliance/*",
  ],
  finance_staff: [
    "/api/v1/finance/close-metrics",
    "/api/v1/finance/chart-data",
    "/api/v1/finance/audit-trail",
    "/api/v1/finance/reporting-accuracy",
    "/api/v1/finance/gl-accounts",
    "/api/v1/expense-category",
    "/api/v1/budget-variance",
    "/api/v1/dso",
    "/api/v1/bad-debt-ratios/*",
    "/api/v1/collection-efficiency/*",
    "/api/v1/finance/pipeline-metrics",
    "/api/v1/finance/invoice-metrics/*",
  ],

  // ── Editorial ─────────────────────────────────────────────────────────────
  head_of_editorial: [
    "/api/v1/editorial/*",
    "/api/v1/executive/company-wide-kpis",
  ],
  editorial_staff: [
    "/api/v1/editorial/analytics/*",
    "/api/v1/editorial/error-rate/*",
    "/api/v1/editorial/editing-cycle-times/*",
    "/api/v1/editorial/journalist-productivity/*",
    "/api/v1/editorial/readership-trends/*",
    "/api/v1/editorial/social-sentiment/*",
    "/api/v1/editorial/content-production/*",
    "/api/v1/editorial/deadline-compliance/*",
    "/api/v1/editorial/topic-virality/*",
    "/api/v1/editorial/breaking-news/*",
    "/api/v1/editorial/backlog-mgt/*",
    "/api/v1/editorial/contentFreshness/*",
    "/api/v1/editorial/updateFrequency/*",
    "/api/v1/editorial/segment-popularity/*",
  ],

  // ── Admin ─────────────────────────────────────────────────────────────────
  admin_staff: [
    "/api/v1/administrative/*",
    "/api/v1/admnistrative/*",
    "/api/v1/hr/*",
    "/api/v1/specialized/attendance-rate",
    "/api/v1/specialized/CaseCompliance",
    "/api/v1/specialized/feedback",
    "/api/v1/specialized/sponsor-roi",
    "/api/v1/executive/strategic-init-tracking",
    "/api/v1/executive/company-wide-kpis",
    "/api/v1/executives/compliance/*",
  ],
};

/**
 * Returns true if the given role can access the given URL path.
 */
export function canAccess(role, urlPath) {
  const patterns = ROLES[role];
  if (!patterns) return false;
  if (patterns.includes("*")) return true; // super_admin

  return patterns.some((pattern) => {
    if (pattern.endsWith("/*")) {
      const base = pattern.slice(0, -2); // strip /*
      return urlPath === base || urlPath.startsWith(base + "/");
    }
    return urlPath === pattern;
  });
}

export default ROLES;
