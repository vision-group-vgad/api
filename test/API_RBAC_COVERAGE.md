# API RBAC Coverage — Full Route Audit

**Generated:** April 11, 2026  
**Total registered routes:** 115  
**All routes covered:** ✅ Yes — every route is accessible by at least one role  
**Routes with super_admin–only access:** 2 (by design)

---

## Coverage Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Role can access this route |
| 🔒 | Head-only (staff cannot access — intentional restriction) |
| ⚠️ | super_admin only — no department-level role assigned |
| 🌐 | Public — excluded from auth (no token required) |

---

## System / Public Routes

| Route | auth required | Notes |
|-------|--------------|-------|
| `GET /api/api-docs` | 🌐 No | Swagger UI |
| `POST /api/v1/auth/login` | 🌐 No | Login |
| `POST /api/v1/auth/refresh` | 🌐 No | Token refresh |
| `GET /assets/profile_pics/*` | 🌐 No | Static file serving |

---

## 1. IT Department

**Roles:** `head_of_it` · `it_staff`

| Route | head_of_it | it_staff |
|-------|-----------|---------|
| `/api/v1/server-load/*` | ✅ | ✅ |
| `/api/v1/storageUtilization` | ✅ | ✅ |
| `/api/v1/cyber-posture` | ✅ | 🔒 |
| `/api/v1/patch-compliance` | ✅ | 🔒 |
| `/api/v1/system-health` | ✅ | ✅ |
| `/api/v1/infrastructure/*` | ✅ | 🔒 |
| `/api/v1/IT/infrastructure-costs` | ✅ | 🔒 |
| `/api/v1/IT/sla` | ✅ | 🔒 |
| `/api/v1/it/sys-health-score/*` | ✅ | ✅ (in-range only) |
| `/api/v1/it/cpu-usage` | ✅ | ✅ |
| `/api/v1/it/infra-costs` | ✅ | 🔒 |
| `/api/v1/it/ServerStoragePatch` | ✅ | 🔒 |
| `/api/v1/it/cycber-sec-router` | ✅ | 🔒 |
| `/api/v1/it/satisfaction` | ✅ | ✅ |
| `/api/v1/it/assets-inventory` | ✅ | ✅ |
| `/api/v1/specialized/data-govern` | ✅ | 🔒 |
| `/api/v1/specialized/insight-adoption` | ✅ | 🔒 |
| `/api/v1/executive/company-wide-kpis` | ✅ | 🔒 |

---

## 2. Finance Department

**Roles:** `head_of_finance` · `finance_staff`

| Route | head_of_finance | finance_staff |
|-------|----------------|--------------|
| `/api/v1/finance/*` | ✅ | ✅ (sub-paths only) |
| `/api/v1/finance/close-metrics` | ✅ | ✅ |
| `/api/v1/finance/chart-data` | ✅ | ✅ |
| `/api/v1/finance/audit-trail` | ✅ | ✅ |
| `/api/v1/finance/reporting-accuracy` | ✅ | ✅ |
| `/api/v1/finance/gl-accounts` | ✅ | ✅ |
| `/api/v1/finance/pipeline-metrics` | ✅ | ✅ |
| `/api/v1/finance/invoice-metrics/*` | ✅ | ✅ |
| `/api/v1/reporting-accu-piechart/*` | ✅ | 🔒 |
| `/api/v1/ap-ar-aging` | ✅ | 🔒 |
| `/api/v1/total-assets-value` | ✅ | 🔒 |
| `/api/v1/asset-depreciation` | ✅ | 🔒 |
| `/api/v1/expense-category` | ✅ | ✅ |
| `/api/v1/budget-variance` | ✅ | ✅ |
| `/api/v1/finance-forecasting/*` | ✅ | 🔒 |
| `/api/v1/gl-reconciliation/*` | ✅ | 🔒 |
| `/api/v1/tax-provisioning` | ✅ | 🔒 |
| `/api/v1/fin-statement-variance` | ✅ | 🔒 |
| `/api/v1/capEx/*` | ✅ | 🔒 |
| `/api/v1/dso` | ✅ | ✅ |
| `/api/v1/bad-debt-ratios/*` | ✅ | ✅ |
| `/api/v1/collection-efficiency/*` | ✅ | ✅ |
| `/api/v1/integration-health` | ✅ | 🔒 |
| `/api/v1/executive/liquidity-ratios` | ✅ | 🔒 |
| `/api/v1/executive/financial-health` | ✅ | 🔒 |
| `/api/v1/executive/cost-optimization` | ✅ | 🔒 |
| `/api/v1/executive/company-wide-kpis` | ✅ | 🔒 |
| `/api/v1/specialized/risk-exposure` | ✅ | 🔒 |
| `/api/v1/specialized/mitigation-effectiveness` | ✅ | 🔒 |
| `/api/v1/executives/risk-heatmap` | ✅ | 🔒 |
| `/api/v1/executives/control-effectiveness` | ✅ | 🔒 |
| `/api/v1/executives/compliance/tasks` | ✅ | 🔒 |
| `/api/v1/executives/compliance/policies` | ✅ | 🔒 |
| `/api/v1/executives/compliance/audits` | ✅ | 🔒 |

---

## 3. Sales Department

**Roles:** `head_of_sales` · `sales_staff`

| Route | head_of_sales | sales_staff |
|-------|--------------|------------|
| `/api/v1/sales/*` | ✅ | ✅ (sub-paths only) |
| `/api/v1/sales/revenue-attribution/*` | ✅ | ✅ |
| `/api/v1/sales/client-lifetime-value/*` | ✅ | ✅ |
| `/api/v1/sales/campaign-roi` | ✅ | ✅ |
| `/api/v1/sales/impression-shares` | ✅ | ✅ |
| `/api/v1/sales/ctr/*` | ✅ | ✅ |
| `/api/v1/sales/rate-card-utilization` | ✅ | ✅ |
| `/api/v1/sales/conversion-funnels/*` | ✅ | ✅ |
| `/api/v1/sales/territory-performance/*` | ✅ | ✅ |
| `/api/v1/sales/lead-efficiency` | ✅ | ✅ |
| `/api/v1/sales/brand-lift` | ✅ | ✅ |
| `/api/v1/sales/contract-value-trends` | ✅ | ✅ |
| `/api/v1/sales/SupervisorSalesAnalytics` | ✅ | 🔒 |
| `/api/v1/sales/ab-tests` | ✅ | 🔒 |
| `/api/v1/sales/campaign-attribution` | ✅ | 🔒 |
| `/api/v1/marketing/lead-efficiency` | ✅ | 🔒 |
| `/api/v1/executive/revenue-performance` | ✅ | 🔒 |
| `/api/v1/executive/market-share` | ✅ | 🔒 |
| `/api/v1/executive/roi-analysis` | ✅ | 🔒 |
| `/api/v1/executive/company-wide-kpis` | ✅ | 🔒 |
| `/api/v1/specialized/sponsor-roi` | ✅ | 🔒 |

---

## 4. Operations Department

**Roles:** `head_of_operations` · `operations_staff`

| Route | head_of_operations | operations_staff |
|-------|-------------------|----------------|
| `/api/v1/operations/*` | ✅ | ✅ (sub-paths only) |
| `/api/v1/operations/delivery-timelines` | ✅ | ✅ |
| `/api/v1/operations/ticket-resolution` | ✅ | ✅ |
| `/api/v1/operations/job-scheduling` | ✅ | ✅ |
| `/api/v1/operations/parts-utilization` | ✅ | ✅ |
| `/api/v1/operations/route-efficiency` | ✅ | ✅ |
| `/api/v1/operations/fuel-consumption/*` | ✅ | ✅ |
| `/api/v1/operations/signal-quality-metrics/*` | ✅ | ✅ |
| `/api/v1/operations/up-downtime-logs/*` | ✅ | ✅ |
| `/api/v1/operations/setup-time` | ✅ | 🔒 |
| `/api/v1/operations/OperationsProductionAnalytics` | ✅ | 🔒 |
| `/api/v1/executive/company-wide-kpis` | ✅ | 🔒 |

---

## 5. Editorial Department

**Roles:** `head_of_editorial` · `editorial_staff`

| Route | head_of_editorial | editorial_staff |
|-------|------------------|----------------|
| `/api/v1/editorial/*` | ✅ | ✅ (sub-paths only) |
| `/api/v1/editorial/analytics/*` | ✅ | ✅ |
| `/api/v1/editorial/error-rate/*` | ✅ | ✅ |
| `/api/v1/editorial/editing-cycle-times/*` | ✅ | ✅ |
| `/api/v1/editorial/journalist-productivity/*` | ✅ | ✅ |
| `/api/v1/editorial/readership-trends/*` | ✅ | ✅ |
| `/api/v1/editorial/social-sentiment/*` | ✅ | ✅ |
| `/api/v1/editorial/content-production/*` | ✅ | ✅ |
| `/api/v1/editorial/deadline-compliance/*` | ✅ | ✅ |
| `/api/v1/editorial/topic-virality/*` | ✅ | ✅ |
| `/api/v1/editorial/breaking-news/*` | ✅ | ✅ |
| `/api/v1/editorial/backlog-mgt/*` | ✅ | ✅ |
| `/api/v1/editorial/contentFreshness/*` | ✅ | ✅ |
| `/api/v1/editorial/updateFrequency/*` | ✅ | ✅ |
| `/api/v1/editorial/segment-popularity/*` | ✅ | ✅ |
| `/api/v1/editorial/breakingNews` | ✅ | 🔒 |
| `/api/v1/editorial/section-perfromance` | ✅ | 🔒 |
| `/api/v1/editorial/version-control` | ✅ | 🔒 |
| `/api/v1/editorial/backlogAnalytics` | ✅ | 🔒 |
| `/api/v1/editorial/visual-engagement` | ✅ | 🔒 |
| `/api/v1/editorial/visual-usage` | ✅ | 🔒 |
| `/api/v1/editorial/comp-bench` | ✅ | 🔒 |
| `/api/v1/editorial/editorial-calendar-adherence` | ✅ | 🔒 |
| `/api/v1/editorial/rights-management` | ✅ | 🔒 |
| `/api/v1/editorial/segment-summary` | ✅ | 🔒 |
| `/api/v1/editorial/newsletter-virality` | ✅ | 🔒 |
| `/api/v1/executive/company-wide-kpis` | ✅ | 🔒 |

---

## 6. Administrative Department

**Roles:** `admin_staff`

| Route | admin_staff | Notes |
|-------|------------|-------|
| `/api/v1/administrative/task-comp-rates` | ✅ | |
| `/api/v1/administrative/process-throughput` | ✅ | |
| `/api/v1/administrative/visitor-patterns` | ✅ | |
| `/api/v1/administrative/rvsAnalytics` | ✅ | |
| `/api/v1/administrative/wait-time` | ✅ | |
| `/api/v1/admnistrative/meetingAnalytics` | ✅ | Typo variant in app.js |
| `/api/v1/admnistrative/scheduleEfficiency` | ✅ | Typo variant in app.js |
| `/api/v1/hr/recruitment-funnel` | ✅ | HR under admin |
| `/api/v1/hr/retention-risk` | ✅ | HR under admin |
| `/api/v1/hr/training-effectiveness` | ✅ | HR under admin |
| `/api/v1/specialized/attendance-rate` | ✅ | |
| `/api/v1/specialized/CaseCompliance` | ✅ | |
| `/api/v1/specialized/feedback` | ✅ | |
| `/api/v1/specialized/sponsor-roi` | ✅ | Also accessible to head_of_sales |
| `/api/v1/executive/strategic-init-tracking` | ✅ | |
| `/api/v1/executive/company-wide-kpis` | ✅ | |
| `/api/v1/executives/compliance/tasks` | ✅ | Also accessible to head_of_finance |
| `/api/v1/executives/compliance/policies` | ✅ | Also accessible to head_of_finance |
| `/api/v1/executives/compliance/audits` | ✅ | Also accessible to head_of_finance |

---

## 7. Super Admin Only

**Role:** `super_admin` (full `*` wildcard — no other role required)

| Route | Reason |
|-------|--------|
| `/api/v1/executive/CEOAnalytics` | CEO-level governance, legal exposure, board reporting — highest sensitivity |
| `/api/v1/user-mgt` | User management — system administration only |

> These routes are intentionally restricted. If a non-super role needs access to CEOAnalytics,
> add the specific path pattern to that role in `src/auth/roles.js`.

---

## 8. Cross-Department Route Summary

Some routes are shared across multiple department roles:

| Route | Roles with access |
|-------|------------------|
| `/api/v1/executive/company-wide-kpis` | head_of_it, head_of_sales, head_of_finance, head_of_operations, head_of_editorial, admin_staff |
| `/api/v1/executives/compliance/*` | head_of_finance, admin_staff |
| `/api/v1/specialized/sponsor-roi` | head_of_sales, admin_staff |

---

## 9. Coverage Statistics

| Department | Total Routes | Head-only | Staff Access | super_admin only |
|-----------|-------------|-----------|-------------|-----------------|
| IT | 18 | 9 | 9 | 0 |
| Finance | 32 | 23 | 12 | 0 |
| Sales | 21 | 10 | 11 | 0 |
| Operations | 12 | 3 | 9 | 0 |
| Editorial | 27 | 12 | 15 | 0 |
| Administrative / HR | 19 | 0 | 19 | 0 |
| **Super Admin only** | 2 | — | — | 2 |
| **TOTAL** | **115** | | | **2** |

---

## 10. Roles Reference

| Role | Department | Access Level |
|------|-----------|-------------|
| `super_admin` | All | Full (`*`) |
| `head_of_it` | IT | All IT + data-govern + insight-adoption + company-wide-kpis |
| `it_staff` | IT | Limited IT (5 specific paths) |
| `head_of_sales` | Sales | All sales + marketing + executive revenue/market/ROI routes |
| `sales_staff` | Sales | 11 specific sales sub-paths |
| `head_of_finance` | Finance | All finance + executive financial/cost/risk + compliance |
| `finance_staff` | Finance | 12 specific finance sub-paths |
| `head_of_operations` | Operations | All operations + company-wide-kpis |
| `operations_staff` | Operations | 8 specific operations sub-paths |
| `head_of_editorial` | Editorial | All editorial + company-wide-kpis |
| `editorial_staff` | Editorial | 15 specific editorial sub-paths |
| `admin_staff` | Admin/HR | All administrative + HR + specialized + compliance |

---

*Source of truth: `src/auth/roles.js` · Routes registered in: `app.js`*
