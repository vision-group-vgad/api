/**
 * generate-rbac-doc.mjs
 * Generates API_RBAC_COVERAGE.docx — full role-based access control audit
 * Run: node generate-rbac-doc.mjs
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  ShadingType,
  UnderlineType,
  PageOrientation,
  convertInchesToTwip,
} from "docx";
import { writeFileSync } from "fs";

// ─── Colour palette ──────────────────────────────────────────────────────────
const BRAND_BLUE    = "1F4E79";
const HEADER_BLUE   = "2E75B6";
const LIGHT_BLUE    = "D6E4F0";
const LIGHT_GREY    = "F2F2F2";
const WHITE         = "FFFFFF";
const GREEN         = "1E8449";
const RED           = "C0392B";
const AMBER         = "D35400";
const DARK_TEXT     = "1A1A1A";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function noBorder() {
  const b = { style: BorderStyle.NONE, size: 0, color: "auto" };
  return { top: b, bottom: b, left: b, right: b, insideHorizontal: b, insideVertical: b };
}

function thinBorder() {
  const b = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  return { top: b, bottom: b, left: b, right: b, insideHorizontal: b, insideVertical: b };
}

function heading1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    run: { color: WHITE },
    shading: { type: ShadingType.SOLID, color: BRAND_BLUE },
  });
}

function heading2(text) {
  return new Paragraph({
    spacing: { before: 280, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26,
        color: HEADER_BLUE,
      }),
    ],
  });
}

function heading3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22,
        color: BRAND_BLUE,
      }),
    ],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({
        text,
        size: 20,
        color: DARK_TEXT,
        bold: opts.bold || false,
        italics: opts.italic || false,
        color: opts.color || DARK_TEXT,
      }),
    ],
  });
}

function note(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    indent: { left: convertInchesToTwip(0.3) },
    children: [
      new TextRun({
        text: `ℹ  ${text}`,
        size: 18,
        italics: true,
        color: "555555",
      }),
    ],
  });
}

function spacer() {
  return new Paragraph({ spacing: { before: 80, after: 80 }, text: "" });
}

function pill(text, bg, fg = WHITE) {
  return new TextRun({ text: ` ${text} `, bold: true, size: 18, color: fg, shading: { type: ShadingType.SOLID, color: bg } });
}

// ─── Table builders ──────────────────────────────────────────────────────────

function makeHeaderRow(cols, colWidths) {
  return new TableRow({
    tableHeader: true,
    children: cols.map((label, i) =>
      new TableCell({
        width: { size: colWidths[i], type: WidthType.DXA },
        shading: { type: ShadingType.SOLID, color: HEADER_BLUE },
        borders: thinBorder(),
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [new TextRun({ text: label, bold: true, size: 18, color: WHITE })],
          }),
        ],
      })
    ),
  });
}

function routeCell(text, bg = WHITE) {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: bg },
    borders: thinBorder(),
    children: [
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text, size: 17, font: "Courier New", color: DARK_TEXT })],
      }),
    ],
  });
}

function statusCell(symbol, bg = WHITE) {
  const colors = {
    "✅": GREEN,
    "🔒": AMBER,
    "⚠️": RED,
    "🌐": "1A5276",
    "—": "888888",
  };
  const textColor = colors[symbol] || DARK_TEXT;
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: bg },
    borders: thinBorder(),
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text: symbol, bold: true, size: 18, color: textColor })],
      }),
    ],
  });
}

function textCell(text, bg = WHITE, bold = false) {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: bg },
    borders: thinBorder(),
    children: [
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text, size: 18, color: DARK_TEXT, bold })],
      }),
    ],
  });
}

function buildSimpleTable(headers, rows, colWidths) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorder(),
    rows: [
      makeHeaderRow(headers, colWidths),
      ...rows.map((row, ri) =>
        new TableRow({
          children: row.map((cell, ci) => {
            const bg = ri % 2 === 0 ? WHITE : LIGHT_GREY;
            if (typeof cell === "string" && (cell === "✅" || cell === "🔒" || cell === "⚠️" || cell === "🌐" || cell === "—")) {
              return statusCell(cell, bg);
            }
            if (ci === 0) return routeCell(cell, bg);
            return textCell(cell, bg);
          }),
        })
      ),
    ],
  });
}

// ─── Route tables per department ─────────────────────────────────────────────

// IT
const itRoutes = [
  ["/api/v1/server-load/*",              "✅", "✅"],
  ["/api/v1/storageUtilization",         "✅", "✅"],
  ["/api/v1/cyber-posture",              "✅", "🔒"],
  ["/api/v1/patch-compliance",           "✅", "🔒"],
  ["/api/v1/system-health",              "✅", "✅"],
  ["/api/v1/infrastructure/*",           "✅", "🔒"],
  ["/api/v1/IT/infrastructure-costs",    "✅", "🔒"],
  ["/api/v1/IT/sla",                     "✅", "🔒"],
  ["/api/v1/it/sys-health-score/*",      "✅", "✅ (in-range only)"],
  ["/api/v1/it/cpu-usage",               "✅", "✅"],
  ["/api/v1/it/infra-costs",             "✅", "🔒"],
  ["/api/v1/it/ServerStoragePatch",      "✅", "🔒"],
  ["/api/v1/it/cycber-sec-router",       "✅", "🔒"],
  ["/api/v1/it/satisfaction",            "✅", "✅"],
  ["/api/v1/it/assets-inventory",        "✅", "✅"],
  ["/api/v1/specialized/data-govern",    "✅", "🔒"],
  ["/api/v1/specialized/insight-adoption","✅","🔒"],
  ["/api/v1/executive/company-wide-kpis","✅", "🔒"],
];

// Finance
const financeRoutes = [
  ["/api/v1/finance/*",                          "✅", "✅ (sub-paths)"],
  ["/api/v1/finance/close-metrics",              "✅", "✅"],
  ["/api/v1/finance/chart-data",                 "✅", "✅"],
  ["/api/v1/finance/audit-trail",                "✅", "✅"],
  ["/api/v1/finance/reporting-accuracy",         "✅", "✅"],
  ["/api/v1/finance/gl-accounts",                "✅", "✅"],
  ["/api/v1/finance/pipeline-metrics",           "✅", "✅"],
  ["/api/v1/finance/invoice-metrics/*",          "✅", "✅"],
  ["/api/v1/reporting-accu-piechart/*",          "✅", "🔒"],
  ["/api/v1/ap-ar-aging",                        "✅", "🔒"],
  ["/api/v1/total-assets-value",                 "✅", "🔒"],
  ["/api/v1/asset-depreciation",                 "✅", "🔒"],
  ["/api/v1/expense-category",                   "✅", "✅"],
  ["/api/v1/budget-variance",                    "✅", "✅"],
  ["/api/v1/finance-forecasting/*",              "✅", "🔒"],
  ["/api/v1/gl-reconciliation/*",                "✅", "🔒"],
  ["/api/v1/tax-provisioning",                   "✅", "🔒"],
  ["/api/v1/fin-statement-variance",             "✅", "🔒"],
  ["/api/v1/capEx/*",                            "✅", "🔒"],
  ["/api/v1/dso",                                "✅", "✅"],
  ["/api/v1/bad-debt-ratios/*",                  "✅", "✅"],
  ["/api/v1/collection-efficiency/*",            "✅", "✅"],
  ["/api/v1/integration-health",                 "✅", "🔒"],
  ["/api/v1/executive/liquidity-ratios",         "✅", "🔒"],
  ["/api/v1/executive/financial-health",         "✅", "🔒"],
  ["/api/v1/executive/cost-optimization",        "✅", "🔒"],
  ["/api/v1/executive/company-wide-kpis",        "✅", "🔒"],
  ["/api/v1/specialized/risk-exposure",          "✅", "🔒"],
  ["/api/v1/specialized/mitigation-effectiveness","✅","🔒"],
  ["/api/v1/executives/risk-heatmap",            "✅", "🔒"],
  ["/api/v1/executives/control-effectiveness",   "✅", "🔒"],
  ["/api/v1/executives/compliance/tasks",        "✅", "🔒"],
  ["/api/v1/executives/compliance/policies",     "✅", "🔒"],
  ["/api/v1/executives/compliance/audits",       "✅", "🔒"],
];

// Sales
const salesRoutes = [
  ["/api/v1/sales/*",                          "✅", "✅ (sub-paths)"],
  ["/api/v1/sales/revenue-attribution/*",      "✅", "✅"],
  ["/api/v1/sales/client-lifetime-value/*",    "✅", "✅"],
  ["/api/v1/sales/campaign-roi",               "✅", "✅"],
  ["/api/v1/sales/impression-shares",          "✅", "✅"],
  ["/api/v1/sales/ctr/*",                      "✅", "✅"],
  ["/api/v1/sales/rate-card-utilization",      "✅", "✅"],
  ["/api/v1/sales/conversion-funnels/*",       "✅", "✅"],
  ["/api/v1/sales/territory-performance/*",    "✅", "✅"],
  ["/api/v1/sales/lead-efficiency",            "✅", "✅"],
  ["/api/v1/sales/brand-lift",                 "✅", "✅"],
  ["/api/v1/sales/contract-value-trends",      "✅", "✅"],
  ["/api/v1/sales/SupervisorSalesAnalytics",   "✅", "🔒"],
  ["/api/v1/sales/ab-tests",                   "✅", "🔒"],
  ["/api/v1/sales/campaign-attribution",       "✅", "🔒"],
  ["/api/v1/marketing/lead-efficiency",        "✅", "🔒"],
  ["/api/v1/executive/revenue-performance",    "✅", "🔒"],
  ["/api/v1/executive/market-share",           "✅", "🔒"],
  ["/api/v1/executive/roi-analysis",           "✅", "🔒"],
  ["/api/v1/executive/company-wide-kpis",      "✅", "🔒"],
  ["/api/v1/specialized/sponsor-roi",          "✅", "🔒"],
];

// Operations
const opsRoutes = [
  ["/api/v1/operations/*",                           "✅", "✅ (sub-paths)"],
  ["/api/v1/operations/delivery-timelines",          "✅", "✅"],
  ["/api/v1/operations/ticket-resolution",           "✅", "✅"],
  ["/api/v1/operations/job-scheduling",              "✅", "✅"],
  ["/api/v1/operations/parts-utilization",           "✅", "✅"],
  ["/api/v1/operations/route-efficiency",            "✅", "✅"],
  ["/api/v1/operations/fuel-consumption/*",          "✅", "✅"],
  ["/api/v1/operations/signal-quality-metrics/*",    "✅", "✅"],
  ["/api/v1/operations/up-downtime-logs/*",          "✅", "✅"],
  ["/api/v1/operations/setup-time",                  "✅", "🔒"],
  ["/api/v1/operations/OperationsProductionAnalytics","✅","🔒"],
  ["/api/v1/executive/company-wide-kpis",            "✅", "🔒"],
];

// Editorial
const editorialRoutes = [
  ["/api/v1/editorial/*",                              "✅", "✅ (sub-paths)"],
  ["/api/v1/editorial/analytics/*",                    "✅", "✅"],
  ["/api/v1/editorial/error-rate/*",                   "✅", "✅"],
  ["/api/v1/editorial/editing-cycle-times/*",          "✅", "✅"],
  ["/api/v1/editorial/journalist-productivity/*",      "✅", "✅"],
  ["/api/v1/editorial/readership-trends/*",            "✅", "✅"],
  ["/api/v1/editorial/social-sentiment/*",             "✅", "✅"],
  ["/api/v1/editorial/content-production/*",           "✅", "✅"],
  ["/api/v1/editorial/deadline-compliance/*",          "✅", "✅"],
  ["/api/v1/editorial/topic-virality/*",               "✅", "✅"],
  ["/api/v1/editorial/breaking-news/*",                "✅", "✅"],
  ["/api/v1/editorial/backlog-mgt/*",                  "✅", "✅"],
  ["/api/v1/editorial/contentFreshness/*",             "✅", "✅"],
  ["/api/v1/editorial/updateFrequency/*",              "✅", "✅"],
  ["/api/v1/editorial/segment-popularity/*",           "✅", "✅"],
  ["/api/v1/editorial/breakingNews",                   "✅", "🔒"],
  ["/api/v1/editorial/section-perfromance",            "✅", "🔒"],
  ["/api/v1/editorial/version-control",                "✅", "🔒"],
  ["/api/v1/editorial/backlogAnalytics",               "✅", "🔒"],
  ["/api/v1/editorial/visual-engagement",              "✅", "🔒"],
  ["/api/v1/editorial/visual-usage",                   "✅", "🔒"],
  ["/api/v1/editorial/comp-bench",                     "✅", "🔒"],
  ["/api/v1/editorial/editorial-calendar-adherence",   "✅", "🔒"],
  ["/api/v1/editorial/rights-management",              "✅", "🔒"],
  ["/api/v1/editorial/segment-summary",                "✅", "🔒"],
  ["/api/v1/editorial/newsletter-virality",            "✅", "🔒"],
  ["/api/v1/executive/company-wide-kpis",              "✅", "🔒"],
];

// Admin
const adminRoutes = [
  ["/api/v1/administrative/task-comp-rates",         "✅", ""],
  ["/api/v1/administrative/process-throughput",      "✅", ""],
  ["/api/v1/administrative/visitor-patterns",        "✅", ""],
  ["/api/v1/administrative/rvsAnalytics",            "✅", ""],
  ["/api/v1/administrative/wait-time",               "✅", ""],
  ["/api/v1/admnistrative/meetingAnalytics",         "✅", "Typo variant in app.js"],
  ["/api/v1/admnistrative/scheduleEfficiency",       "✅", "Typo variant in app.js"],
  ["/api/v1/hr/recruitment-funnel",                  "✅", "HR under admin"],
  ["/api/v1/hr/retention-risk",                      "✅", "HR under admin"],
  ["/api/v1/hr/training-effectiveness",              "✅", "HR under admin"],
  ["/api/v1/specialized/attendance-rate",            "✅", ""],
  ["/api/v1/specialized/CaseCompliance",             "✅", ""],
  ["/api/v1/specialized/feedback",                   "✅", ""],
  ["/api/v1/specialized/sponsor-roi",                "✅", "Also: head_of_sales"],
  ["/api/v1/executive/strategic-init-tracking",      "✅", ""],
  ["/api/v1/executive/company-wide-kpis",            "✅", "All heads share this"],
  ["/api/v1/executives/compliance/tasks",            "✅", "Also: head_of_finance"],
  ["/api/v1/executives/compliance/policies",         "✅", "Also: head_of_finance"],
  ["/api/v1/executives/compliance/audits",           "✅", "Also: head_of_finance"],
];

// Public / System
const publicRoutes = [
  ["GET /api/api-docs",              "🌐 No", "Swagger UI"],
  ["POST /api/v1/auth/login",        "🌐 No", "User login"],
  ["POST /api/v1/auth/refresh",      "🌐 No", "Token refresh"],
  ["GET /assets/profile_pics/*",     "🌐 No", "Static file serving"],
];

// Super-admin only
const superAdminRoutes = [
  ["/api/v1/executive/CEOAnalytics", "CEO-level governance, legal, board reporting — highest sensitivity"],
  ["/api/v1/user-mgt",               "User management — system administration only"],
];

// Roles reference
const rolesRef = [
  ["super_admin",          "All",          "Full (*) — unrestricted"],
  ["head_of_it",           "IT",           "All IT + data-govern + insight-adoption + company-wide-kpis"],
  ["it_staff",             "IT",           "5 specific IT sub-paths"],
  ["head_of_sales",        "Sales",        "All sales + marketing + executive revenue/market/ROI routes"],
  ["sales_staff",          "Sales",        "11 specific sales sub-paths"],
  ["head_of_finance",      "Finance",      "All finance + executive financial/cost/risk + compliance"],
  ["finance_staff",        "Finance",      "12 specific finance sub-paths"],
  ["head_of_operations",   "Operations",   "All operations + company-wide-kpis"],
  ["operations_staff",     "Operations",   "8 specific operations sub-paths"],
  ["head_of_editorial",    "Editorial",    "All editorial + company-wide-kpis"],
  ["editorial_staff",      "Editorial",    "15 specific editorial sub-paths"],
  ["admin_staff",          "Admin / HR",   "All administrative + HR + specialized + compliance"],
];

// Coverage stats
const statsRows = [
  ["IT",             "18", "9",  "9",  "0"],
  ["Finance",        "32", "23", "12", "0"],
  ["Sales",          "21", "10", "11", "0"],
  ["Operations",     "12", "3",  "9",  "0"],
  ["Editorial",      "27", "12", "15", "0"],
  ["Admin / HR",     "19", "0",  "19", "0"],
  ["Super Admin only","2", "—",  "—",  "2"],
  ["TOTAL",          "115","57", "75", "2"],
];

// Cross-department
const crossDeptRows = [
  ["/api/v1/executive/company-wide-kpis",    "head_of_it, head_of_sales, head_of_finance,\nhead_of_operations, head_of_editorial, admin_staff"],
  ["/api/v1/executives/compliance/*",        "head_of_finance, admin_staff"],
  ["/api/v1/specialized/sponsor-roi",        "head_of_sales, admin_staff"],
];

// ─── Build document ──────────────────────────────────────────────────────────

const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: { orientation: PageOrientation.PORTRAIT },
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
          },
        },
      },
      children: [
        // ── Title page block ────────────────────────────────────────────────
        new Paragraph({
          spacing: { before: 0, after: 40 },
          children: [
            new TextRun({
              text: "Vision Group",
              bold: true,
              size: 44,
              color: BRAND_BLUE,
            }),
          ],
        }),
        new Paragraph({
          spacing: { before: 0, after: 80 },
          children: [
            new TextRun({
              text: "API Role-Based Access Control — Full Coverage Audit",
              bold: true,
              size: 30,
              color: HEADER_BLUE,
            }),
          ],
        }),
        new Paragraph({
          spacing: { before: 0, after: 20 },
          children: [
            new TextRun({ text: "Generated: ", size: 20, color: "888888" }),
            new TextRun({ text: "April 11, 2026", size: 20, bold: true, color: "888888" }),
          ],
        }),
        new Paragraph({
          spacing: { before: 0, after: 20 },
          children: [
            new TextRun({ text: "Source: ", size: 20, color: "888888" }),
            new TextRun({ text: "src/auth/roles.js  |  app.js", size: 20, color: "888888", font: "Courier New" }),
          ],
        }),
        new Paragraph({
          spacing: { before: 0, after: 40 },
          children: [
            new TextRun({ text: "Total registered routes: ", size: 20, color: "888888" }),
            new TextRun({ text: "115", size: 20, bold: true, color: GREEN }),
            new TextRun({ text: "   All routes covered: ", size: 20, color: "888888" }),
            new TextRun({ text: "YES", size: 20, bold: true, color: GREEN }),
          ],
        }),

        // Divider
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND_BLUE } },
          spacing: { before: 0, after: 240 },
          text: "",
        }),

        // ── Legend ───────────────────────────────────────────────────────────
        heading2("Legend"),
        buildSimpleTable(
          ["Symbol", "Meaning"],
          [
            ["✅", "Role has access"],
            ["🔒", "Head role only — staff cannot access (intentional)"],
            ["⚠️", "super_admin only — no department role assigned"],
            ["🌐", "Public — no authentication required"],
            ["—",  "Not applicable"],
          ],
          [1440, 7920]
        ),
        spacer(),

        // ── Section 1 — Public / System ──────────────────────────────────────
        heading1("1   Public & System Routes"),
        buildSimpleTable(
          ["Route", "Auth Required", "Notes"],
          publicRoutes,
          [3600, 1800, 3960]
        ),
        spacer(),

        // ── Section 2 — IT ───────────────────────────────────────────────────
        heading1("2   IT Department"),
        body("Roles:  head_of_it   ·   it_staff", { bold: true }),
        spacer(),
        buildSimpleTable(
          ["Route", "head_of_it", "it_staff"],
          itRoutes,
          [6000, 1440, 1920]
        ),
        spacer(),

        // ── Section 3 — Finance ──────────────────────────────────────────────
        heading1("3   Finance Department"),
        body("Roles:  head_of_finance   ·   finance_staff", { bold: true }),
        spacer(),
        buildSimpleTable(
          ["Route", "head_of_finance", "finance_staff"],
          financeRoutes,
          [5760, 1440, 2160]
        ),
        spacer(),

        // ── Section 4 — Sales ────────────────────────────────────────────────
        heading1("4   Sales Department"),
        body("Roles:  head_of_sales   ·   sales_staff", { bold: true }),
        spacer(),
        buildSimpleTable(
          ["Route", "head_of_sales", "sales_staff"],
          salesRoutes,
          [5760, 1440, 2160]
        ),
        spacer(),

        // ── Section 5 — Operations ───────────────────────────────────────────
        heading1("5   Operations Department"),
        body("Roles:  head_of_operations   ·   operations_staff", { bold: true }),
        spacer(),
        buildSimpleTable(
          ["Route", "head_of_operations", "operations_staff"],
          opsRoutes,
          [5600, 1600, 2160]
        ),
        spacer(),

        // ── Section 6 — Editorial ────────────────────────────────────────────
        heading1("6   Editorial Department"),
        body("Roles:  head_of_editorial   ·   editorial_staff", { bold: true }),
        spacer(),
        buildSimpleTable(
          ["Route", "head_of_editorial", "editorial_staff"],
          editorialRoutes,
          [5760, 1440, 2160]
        ),
        spacer(),

        // ── Section 7 — Admin / HR ───────────────────────────────────────────
        heading1("7   Administrative & HR Department"),
        body("Roles:  admin_staff", { bold: true }),
        note("HR routes (recruitment-funnel, retention-risk, training-effectiveness) are grouped under admin_staff."),
        spacer(),
        buildSimpleTable(
          ["Route", "admin_staff", "Notes"],
          adminRoutes,
          [5000, 1200, 3160]
        ),
        spacer(),

        // ── Section 8 — Super Admin ──────────────────────────────────────────
        heading1("8   Super Admin Only Routes"),
        note("These routes require the super_admin role. No department-level role grants access by design."),
        spacer(),
        buildSimpleTable(
          ["Route", "Reason"],
          superAdminRoutes,
          [3600, 5760]
        ),
        spacer(),

        // ── Section 9 — Cross-department ────────────────────────────────────
        heading1("9   Cross-Department Shared Routes"),
        body("The following routes are intentionally shared across multiple department roles:"),
        spacer(),
        buildSimpleTable(
          ["Route", "Roles with Access"],
          crossDeptRows,
          [4320, 5040]
        ),
        spacer(),

        // ── Section 10 — Coverage Statistics ────────────────────────────────
        heading1("10   Coverage Statistics"),
        buildSimpleTable(
          ["Department", "Total Routes", "Head-only", "Staff Access", "super_admin only"],
          statsRows,
          [2400, 1720, 1720, 1720, 1800]
        ),
        spacer(),

        // ── Section 11 — Roles Reference ────────────────────────────────────
        heading1("11   Roles Reference"),
        buildSimpleTable(
          ["Role", "Department", "Access Description"],
          rolesRef,
          [2640, 1760, 4960]
        ),
        spacer(),

        // ── Footer note ──────────────────────────────────────────────────────
        new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: BRAND_BLUE } },
          spacing: { before: 200, after: 40 },
          children: [
            new TextRun({
              text: "Source of truth: src/auth/roles.js   |   Route registrations: app.js   |   Vision Group API — Confidential",
              size: 16,
              italics: true,
              color: "888888",
            }),
          ],
        }),
      ],
    },
  ],
});

// ─── Write file ──────────────────────────────────────────────────────────────

const buffer = await Packer.toBuffer(doc);
writeFileSync("API_RBAC_COVERAGE.docx", buffer);
console.log("✅  API_RBAC_COVERAGE.docx generated successfully.");
