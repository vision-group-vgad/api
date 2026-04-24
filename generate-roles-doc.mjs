import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, AlignmentType, WidthType, BorderStyle,
  ShadingType, convertInchesToTwip,
} from "docx";
import { writeFileSync } from "fs";

// ── Helpers ────────────────────────────────────────────────────────────────

const BRAND_BLUE   = "1E3A5F";
const BRAND_LIGHT  = "D6E4F0";
const HEADER_BG    = "1E3A5F";
const ROW_ALT      = "EEF4FA";
const WHITE        = "FFFFFF";

function heading1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 120 },
    run: { color: BRAND_BLUE, bold: true },
  });
}

function heading2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 80 },
    run: { color: BRAND_BLUE },
  });
}

function bodyText(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20 })],
    spacing: { after: 60 },
  });
}

function warningBox(text) {
  return new Paragraph({
    children: [new TextRun({ text: `⚠  ${text}`, bold: true, color: "C0392B", size: 20 })],
    spacing: { before: 120, after: 120 },
    shading: { type: ShadingType.CLEAR, fill: "FDECEA" },
    indent: { left: convertInchesToTwip(0.2), right: convertInchesToTwip(0.2) },
  });
}

function spacer() {
  return new Paragraph({ text: "", spacing: { after: 60 } });
}

// ── Table builders ─────────────────────────────────────────────────────────

function tableCell(text, { isHeader = false, shade = WHITE, width } = {}) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: isHeader,
            color: isHeader ? WHITE : "1A1A1A",
            size: isHeader ? 19 : 18,
            font: "Calibri",
          }),
        ],
        alignment: AlignmentType.LEFT,
        spacing: { before: 60, after: 60 },
      }),
    ],
    shading: { type: ShadingType.CLEAR, fill: shade },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    ...(width ? { width: { size: width, type: WidthType.DXA } } : {}),
  });
}

function buildTable(headers, rows, colWidths) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      tableCell(h, { isHeader: true, shade: HEADER_BG, width: colWidths?.[i] })
    ),
  });

  const dataRows = rows.map((row, ri) => {
    const fill = ri % 2 === 0 ? WHITE : ROW_ALT;
    return new TableRow({
      children: row.map((cell, ci) =>
        tableCell(cell, { shade: fill, width: colWidths?.[ci] })
      ),
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
    borders: {
      top:           { style: BorderStyle.SINGLE, size: 4, color: BRAND_LIGHT },
      bottom:        { style: BorderStyle.SINGLE, size: 4, color: BRAND_LIGHT },
      left:          { style: BorderStyle.SINGLE, size: 4, color: BRAND_LIGHT },
      right:         { style: BorderStyle.SINGLE, size: 4, color: BRAND_LIGHT },
      insideH:       { style: BorderStyle.SINGLE, size: 2, color: BRAND_LIGHT },
      insideV:       { style: BorderStyle.SINGLE, size: 2, color: BRAND_LIGHT },
    },
  });
}

// ── Data ───────────────────────────────────────────────────────────────────

const roleSections = [
  {
    dept: "System",
    roles: [
      { role: "super_admin", access: "* — Full access to all endpoints" },
      { role: "ceo",         access: "* — Full access to all endpoints" },
    ],
  },
  {
    dept: "IT Department",
    roles: [
      {
        role: "head_of_it",
        access: [
          "/api/v1/server-load/*", "/api/v1/storageUtilization", "/api/v1/cyber-posture",
          "/api/v1/patch-compliance", "/api/v1/system-health", "/api/v1/IT/*", "/api/v1/it/*",
          "/api/v1/infrastructure/*", "/api/v1/specialized/data-govern",
          "/api/v1/specialized/insight-adoption", "/api/v1/executive/company-wide-kpis",
        ].join("\n"),
      },
      {
        role: "it_staff",
        access: [
          "/api/v1/server-load/*", "/api/v1/storageUtilization", "/api/v1/system-health",
          "/api/v1/it/cpu-usage", "/api/v1/it/satisfaction", "/api/v1/it/assets-inventory",
          "/api/v1/it/sys-health-score/in-range",
        ].join("\n"),
      },
    ],
  },
  {
    dept: "Sales Department",
    roles: [
      {
        role: "head_of_sales",
        access: [
          "/api/v1/sales/*", "/api/v1/marketing/*", "/api/v1/executive/revenue-performance",
          "/api/v1/executive/market-share", "/api/v1/executive/roi-analysis",
          "/api/v1/executive/company-wide-kpis", "/api/v1/specialized/sponsor-roi",
        ].join("\n"),
      },
      {
        role: "sales_staff",
        access: [
          "/api/v1/sales/revenue-attribution/*", "/api/v1/sales/client-lifetime-value/*",
          "/api/v1/sales/campaign-roi", "/api/v1/sales/impression-shares", "/api/v1/sales/ctr/*",
          "/api/v1/sales/rate-card-utilization", "/api/v1/sales/conversion-funnels/*",
          "/api/v1/sales/territory-performance/*", "/api/v1/sales/lead-efficiency",
          "/api/v1/sales/brand-lift", "/api/v1/sales/contract-value-trends",
        ].join("\n"),
      },
    ],
  },
  {
    dept: "Operations Department",
    roles: [
      {
        role: "head_of_operations",
        access: ["/api/v1/operations/*", "/api/v1/executive/company-wide-kpis"].join("\n"),
      },
      {
        role: "operations_staff",
        access: [
          "/api/v1/operations/delivery-timelines", "/api/v1/operations/fuel-consumption/*",
          "/api/v1/operations/job-scheduling", "/api/v1/operations/parts-utilization",
          "/api/v1/operations/route-efficiency", "/api/v1/operations/signal-quality-metrics/*",
          "/api/v1/operations/ticket-resolution", "/api/v1/operations/up-downtime-logs/*",
        ].join("\n"),
      },
    ],
  },
  {
    dept: "Finance Department",
    roles: [
      {
        role: "head_of_finance",
        access: [
          "/api/v1/finance/*", "/api/v1/reporting-accu-piechart/*", "/api/v1/ap-ar-aging",
          "/api/v1/total-assets-value", "/api/v1/asset-depreciation", "/api/v1/expense-category",
          "/api/v1/budget-variance", "/api/v1/finance-forecasting/*", "/api/v1/gl-reconciliation/*",
          "/api/v1/tax-provisioning", "/api/v1/fin-statement-variance", "/api/v1/dso",
          "/api/v1/bad-debt-ratios/*", "/api/v1/collection-efficiency/*", "/api/v1/integration-health",
          "/api/v1/capEx/*", "/api/v1/executive/liquidity-ratios", "/api/v1/executive/financial-health",
          "/api/v1/executive/cost-optimization", "/api/v1/executive/company-wide-kpis",
          "/api/v1/specialized/risk-exposure", "/api/v1/specialized/mitigation-effectiveness",
          "/api/v1/executives/risk-heatmap", "/api/v1/executives/control-effectiveness",
          "/api/v1/executives/compliance/*",
        ].join("\n"),
      },
      {
        role: "finance_staff",
        access: [
          "/api/v1/finance/close-metrics", "/api/v1/finance/chart-data", "/api/v1/finance/audit-trail",
          "/api/v1/finance/reporting-accuracy", "/api/v1/finance/gl-accounts",
          "/api/v1/expense-category", "/api/v1/budget-variance", "/api/v1/dso",
          "/api/v1/bad-debt-ratios/*", "/api/v1/collection-efficiency/*",
          "/api/v1/finance/pipeline-metrics", "/api/v1/finance/invoice-metrics/*",
        ].join("\n"),
      },
    ],
  },
  {
    dept: "Editorial Department",
    roles: [
      {
        role: "head_of_editorial",
        access: ["/api/v1/editorial/*", "/api/v1/executive/company-wide-kpis"].join("\n"),
      },
      {
        role: "editorial_staff",
        access: [
          "/api/v1/editorial/analytics/*", "/api/v1/editorial/error-rate/*",
          "/api/v1/editorial/editing-cycle-times/*", "/api/v1/editorial/journalist-productivity/*",
          "/api/v1/editorial/readership-trends/*", "/api/v1/editorial/social-sentiment/*",
          "/api/v1/editorial/content-production/*", "/api/v1/editorial/deadline-compliance/*",
          "/api/v1/editorial/topic-virality/*", "/api/v1/editorial/breaking-news/*",
          "/api/v1/editorial/backlog-mgt/*", "/api/v1/editorial/contentFreshness/*",
          "/api/v1/editorial/updateFrequency/*", "/api/v1/editorial/segment-popularity/*",
        ].join("\n"),
      },
    ],
  },
  {
    dept: "Administration Department",
    roles: [
      {
        role: "admin_staff",
        access: [
          "/api/v1/administrative/*", "/api/v1/admnistrative/*", "/api/v1/hr/*",
          "/api/v1/specialized/attendance-rate", "/api/v1/specialized/CaseCompliance",
          "/api/v1/specialized/feedback", "/api/v1/specialized/sponsor-roi",
          "/api/v1/executive/strategic-init-tracking", "/api/v1/executive/company-wide-kpis",
          "/api/v1/executives/compliance/*",
        ].join("\n"),
      },
    ],
  },
  {
    dept: "Executive",
    roles: [
      { role: "ceo",                    access: "* — Full access" },
      { role: "managingdirector",       access: "/api/v1/executive/*\n/api/v1/executives/*" },
      { role: "deputymanagingdirector", access: "/api/v1/executive/*\n/api/v1/executives/*" },
      { role: "companysecretary",       access: "/api/v1/executive/*\n/api/v1/executives/*" },
      { role: "chiefhumanresourceofficer", access: "/api/v1/executive/*\n/api/v1/executives/*" },
      {
        role: "chiefinternalauditor",
        access: "/api/v1/executive/*\n/api/v1/executives/*\n/api/v1/executives/compliance/*\n/api/v1/executives/control-effectiveness",
      },
    ],
  },
  {
    dept: "Specialized Roles",
    roles: [
      { role: "legalofficer",         access: "/api/v1/specialized/*\n/api/v1/executive/cost-optimization\n/api/v1/executives/risk-heatmap" },
      { role: "riskmanager",          access: "/api/v1/specialized/*\n/api/v1/executives/risk-heatmap\n/api/v1/executives/control-effectiveness\n/api/v1/executives/compliance/*" },
      { role: "eventsmanager",        access: "/api/v1/specialized/*\n/api/v1/administrative/*" },
      { role: "hrroles",              access: "/api/v1/specialized/*\n/api/v1/executive/CEOAnalytics/workforce-analytics\n/api/v1/executive/CEOAnalytics/retention-rates\n/api/v1/executive/CEOAnalytics/compensation-benchmarks" },
      { role: "research&datamanager", access: "/api/v1/specialized/*\n/api/v1/editorial/*\n/api/v1/executive/company-wide-kpis" },
    ],
  },
];

const userSections = [
  {
    dept: "System / Administration",
    users: [
      { name: "Admin",                    email: "admin@vision.com",                    role: "super_admin",  password: "Admin@2024!" },
      { name: "Administration Manager",   email: "administrationmanager@vision.com",    role: "admin_staff",  password: "AdminMgr@2024!" },
      { name: "Executive Assistant",      email: "executiveassistant@vision.com",       role: "admin_staff",  password: "ExecAsst@2024!" },
      { name: "Administrative Assistant", email: "administrativeassistant@vision.com",  role: "admin_staff",  password: "AdminAsst@2024!" },
    ],
  },
  {
    dept: "IT Department",
    users: [
      { name: "Head of IT",                 email: "headofit@vision.com",               role: "head_of_it", password: "HeadIT@2024!" },
      { name: "Systems Administrator",      email: "systemsadministrator@vision.com",   role: "head_of_it", password: "SysAdmin@2024!" },
      { name: "Manager Tech Infrastructure",email: "managertechinfra@vision.com",       role: "it_staff",   password: "TechMgr@2024!" },
      { name: "Manager InfoSec",            email: "managerinfosec@vision.com",          role: "it_staff",   password: "InfoSec@2024!" },
      { name: "Manager Service Delivery",   email: "managerservicedelivery@vision.com", role: "it_staff",   password: "ServiceDel@2024!" },
      { name: "Network Admin",              email: "networkadmin@vision.com",            role: "it_staff",   password: "NetAdmin@2024!" },
      { name: "IT Support",                 email: "itsupport@vision.com",               role: "it_staff",   password: "ITSupport@2024!" },
    ],
  },
  {
    dept: "Sales Department",
    users: [
      { name: "Head of Sales",              email: "headofsales@vision.com",            role: "head_of_sales", password: "HeadSales@2024!" },
      { name: "Advertising Manager",        email: "advertisingmanager@vision.com",     role: "head_of_sales", password: "AdMgr@2024!" },
      { name: "Marketing Manager",          email: "marketingmanager@vision.com",       role: "head_of_sales", password: "MktMgr@2024!" },
      { name: "Sales Manager",              email: "salesmanager@vision.com",           role: "head_of_sales", password: "SalesMgr@2024!" },
      { name: "Digital Marketing Optimizer",email: "digitalmktopt@vision.com",          role: "sales_staff",   password: "DigiMkt@2024!" },
      { name: "Corporate Sales Supervisor", email: "corporatesalessup@vision.com",      role: "sales_staff",   password: "CorpSales@2024!" },
    ],
  },
  {
    dept: "Operations Department",
    users: [
      { name: "Head of Printing",    email: "headofprinting@vision.com",      role: "head_of_operations", password: "HeadPrint@2024!" },
      { name: "Printing Supervisor", email: "printingsupervisor@vision.com",  role: "operations_staff",   password: "PrintSup@2024!" },
      { name: "Broadcast Engineer",  email: "broadcasteng@vision.com",        role: "operations_staff",   password: "BroadcastEng@2024!" },
      { name: "Technician",          email: "technician@vision.com",          role: "operations_staff",   password: "Technician@2024!" },
      { name: "Transport Officer",   email: "transport@vision.com",           role: "operations_staff",   password: "Transport@2024!" },
    ],
  },
  {
    dept: "Finance Department",
    users: [
      { name: "Financial Controller",  email: "financialcontroller@vision.com",  role: "head_of_finance", password: "FinCtrl@2024!" },
      { name: "Senior Accountant",     email: "senioraccount@vision.com",         role: "finance_staff",   password: "SeniorAcc@2024!" },
      { name: "Principal Accountant",  email: "principalaccountant@vision.com",   role: "finance_staff",   password: "PrinAcc@2024!" },
      { name: "Accountant",            email: "accountant@vision.com",            role: "finance_staff",   password: "Accountant@2024!" },
      { name: "Assistant Accountant",  email: "asaccountant@vision.com",          role: "finance_staff",   password: "AssAcc@2024!" },
      { name: "Credit Controller",     email: "creditcontroller@vision.com",      role: "finance_staff",   password: "CreditCtrl@2024!" },
      { name: "Systems Accountant",    email: "sysaccountant@vision.com",         role: "finance_staff",   password: "SysAcc@2024!" },
    ],
  },
  {
    dept: "Editorial Department",
    users: [
      { name: "Editor in Chief",       email: "editorinchief@vision.com",          role: "head_of_editorial", password: "EditorChief@2024!" },
      { name: "Reporter",              email: "reporter@vision.com",               role: "editorial_staff",   password: "Reporter@2024!" },
      { name: "Editor",                email: "editor@vision.com",                 role: "editorial_staff",   password: "Editor@2024!" },
      { name: "Managing Editor",       email: "managingeditor@vision.com",         role: "editorial_staff",   password: "ManagEditor@2024!" },
      { name: "News Editor",           email: "newseditor@vision.com",             role: "editorial_staff",   password: "NewsEditor@2024!" },
      { name: "Deputy Editor",         email: "deputyeditor@vision.com",           role: "editorial_staff",   password: "DepEditor@2024!" },
      { name: "Sub Editor",            email: "subeditor@vision.com",              role: "editorial_staff",   password: "SubEditor@2024!" },
      { name: "Photo/Video Journalist",email: "photovideojournalist@vision.com",   role: "editorial_staff",   password: "PhotoVid@2024!" },
      { name: "Presenter/Anchor",      email: "presenteranchor@vision.com",        role: "editorial_staff",   password: "Presenter@2024!" },
    ],
  },
  {
    dept: "Executive",
    users: [
      { name: "Chief Executive Officer",     email: "ceo@vision.com",                    role: "ceo",                      password: "CEO@Vision2024!" },
      { name: "Managing Director",           email: "managingdirector@vision.com",       role: "managingdirector",         password: "ManagDir@2024!" },
      { name: "Managing Director (alt)",     email: "mandir@vision.com",                 role: "managingdirector",         password: "mandir@vision2025" },
      { name: "Deputy Managing Director",    email: "deputymd@vision.com",               role: "deputymanagingdirector",   password: "DeputyMD@2024!" },
      { name: "Company Secretary",           email: "companysecretary@vision.com",       role: "companysecretary",         password: "CompSec@2024!" },
      { name: "Chief Human Resource Officer",email: "chiefhr@vision.com",                role: "chiefhumanresourceofficer",password: "ChiefHR@2024!" },
      { name: "Chief Internal Auditor",      email: "chiefinternalauditor@vision.com",   role: "chiefinternalauditor",     password: "ChiefAudit@2024!" },
    ],
  },
  {
    dept: "Specialized Roles",
    users: [
      { name: "Legal Officer",          email: "legalofficer@vision.com",    role: "legalofficer",         password: "LegalOfficer@2024!" },
      { name: "Risk Manager",           email: "riskmanager@vision.com",     role: "riskmanager",          password: "RiskMgr@2024!" },
      { name: "Events Manager",         email: "eventsmanager@vision.com",   role: "eventsmanager",        password: "EventsMgr@2024!" },
      { name: "HR Manager",             email: "hrmanager@vision.com",       role: "hrroles",              password: "HRMgr@2024!" },
      { name: "Research & Data Manager",email: "researchmanager@vision.com", role: "research&datamanager", password: "ResearchMgr@2024!" },
    ],
  },
];

// ── Build document ─────────────────────────────────────────────────────────

const children = [
  // Cover title
  new Paragraph({
    children: [new TextRun({ text: "Vision Group", bold: true, size: 52, color: BRAND_BLUE, font: "Calibri" })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 800, after: 100 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Roles & Users Reference", size: 36, color: "555555", font: "Calibri" })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }),
  new Paragraph({
    children: [new TextRun({ text: `Generated: ${new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"long", year:"numeric" })}`, size: 20, color: "888888", italics: true })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
  }),
  warningBox("Internal use only — do not expose this file publicly or commit it to a public repository."),
  spacer(),

  // ── Section 1: Roles ──
  heading1("1. Roles & API Access"),
  bodyText("Each role is granted access to specific API endpoint patterns. A wildcard (*) grants full access to all sub-paths under that prefix. Roles marked with * have unrestricted access to the entire API."),
  spacer(),
];

for (const section of roleSections) {
  children.push(heading2(section.dept));
  children.push(
    buildTable(
      ["Role", "Accessible API Endpoints"],
      section.roles.map((r) => [r.role, r.access]),
      [2800, 7000]
    )
  );
  children.push(spacer());
}

// ── Section 2: Users ──
children.push(heading1("2. Users"));
children.push(bodyText("All system users, their department, assigned role, and login credentials."));
children.push(spacer());

for (const section of userSections) {
  children.push(heading2(section.dept));
  children.push(
    buildTable(
      ["Name", "Email", "Role", "Password"],
      section.users.map((u) => [u.name, u.email, u.role, u.password]),
      [2200, 3200, 2400, 2000]
    )
  );
  children.push(spacer());
}

const doc = new Document({
  creator: "Vision Group API",
  title: "Roles & Users Reference",
  description: "RBAC roles and system users with credentials",
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 20 },
      },
      heading1: {
        run: { font: "Calibri", bold: true, color: BRAND_BLUE, size: 32 },
        paragraph: { spacing: { before: 400, after: 160 } },
      },
      heading2: {
        run: { font: "Calibri", bold: true, color: BRAND_BLUE, size: 26 },
        paragraph: { spacing: { before: 280, after: 100 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top:    convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left:   convertInchesToTwip(1),
            right:  convertInchesToTwip(1),
          },
        },
      },
      children,
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync("ROLES_AND_USERS.docx", buffer);
console.log("✅  ROLES_AND_USERS.docx created successfully");
