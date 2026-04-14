import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, ShadingType,
} from "docx";
import { writeFileSync } from "fs";

const BRAND  = "1F3864";
const ACCENT = "2E75B6";

const h = (text, level = HeadingLevel.HEADING_1) =>
  new Paragraph({
    heading: level,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, color: level === HeadingLevel.HEADING_1 ? BRAND : ACCENT, bold: true, size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 26 : 22 })],
  });

const p = (text, opts = {}) =>
  new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, size: 20, ...opts })] });

const mono = (text) =>
  new Paragraph({
    spacing: { after: 60 },
    shading: { type: ShadingType.CLEAR, fill: "EEF2F7" },
    indent: { left: 360 },
    children: [new TextRun({ text, font: "Courier New", size: 18, color: "1A1A2E" })],
  });

const bullet = (text) =>
  new Paragraph({ bullet: { level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text, size: 20 })] });

const divider = () =>
  new Paragraph({ spacing: { before: 200, after: 200 }, border: { bottom: { color: ACCENT, size: 6, style: BorderStyle.SINGLE } }, children: [] });

const tRow = (cells, isHeader = false) =>
  new TableRow({
    tableHeader: isHeader,
    children: cells.map((text) =>
      new TableCell({
        shading: isHeader ? { type: ShadingType.CLEAR, fill: ACCENT } : {},
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text, bold: isHeader, color: isHeader ? "FFFFFF" : "000000", size: 18 })] })],
      })
    ),
  });

const doc = new Document({
  creator: "Vision Group API",
  title: "Authentication & RBAC Documentation",
  sections: [{
    children: [
      // TITLE
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1440, after: 300 }, children: [new TextRun({ text: "Vision Group API", bold: true, size: 56, color: BRAND })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "Authentication & Role-Based Access Control", size: 36, color: ACCENT })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 800 }, children: [new TextRun({ text: "Technical Reference — April 2026", size: 22, color: "888888" })] }),
      divider(),

      // 1. OVERVIEW
      h("1. Overview"),
      p("The API uses a dual-token authentication system. Every request to a protected endpoint must carry a Bearer token in the Authorization header. There are two valid token types:"),
      bullet("CMC System Token — long hex key stored in .env (CMC_API_BEARER_TOKEN). Grants full superadmin access and bypasses all role checks. Used by Swagger and internal tools."),
      bullet("User JWT — issued by POST /api/v1/auth/login. Contains the user's email, role, name, and department. Enforces role-based access control (RBAC) on every request."),
      p("Authentication is enforced globally in app.js — no per-route middleware is needed anywhere."),
      divider(),

      // 2. FLOW
      h("2. Authentication Flow"),
      h("2.1  Login", HeadingLevel.HEADING_2),
      mono("POST /api/v1/auth/login"),
      mono('Request body: { "email": "user@vision.com", "password": "Password@2024!" }'),
      p(""),
      p("Steps performed internally by auth-controller.js:"),
      bullet("Read users.json — find user by email"),
      bullet("bcrypt.compare(password, storedHash) — verify credentials"),
      bullet("Jwt.generateToken() — sign a JWT with { email, role, name, department }, valid for 8 hours"),
      bullet("Return { user_name, user_email, department, role, token }"),
      p(""),
      h("2.2  Using the Token", HeadingLevel.HEADING_2),
      mono("Authorization: Bearer <token>"),
      p("Include this header on every subsequent API request after login."),
      p(""),
      h("2.3  Request Processing — unified-auth.js", HeadingLevel.HEADING_2),
      p("Every request passes through the unified-auth middleware in this exact order:"),
      bullet("1. Is the token the CMC system token?  →  allow all, skip RBAC"),
      bullet("2. Verify JWT signature against SECRET_KEY from .env"),
      bullet("3. Extract decoded.role from the token payload"),
      bullet("4. Call canAccess(role, urlPath) from roles.js"),
      bullet("5a. Allowed  →  attach req.user = decoded, call next()"),
      bullet("5b. Denied   →  return 403 Access denied: your role cannot access <path>"),
      bullet("6. No token at all  →  return 401 Unauthorized"),
      divider(),

      // 3. KEY FILES
      h("3. Key Files"),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
        tRow(["File", "Purpose"], true),
        tRow(["src/auth/users.json",        "38 users — email, name, department, role, bcrypt-hashed password"]),
        tRow(["src/auth/roles.js",           "Maps each role to allowed URL patterns. Exports canAccess(role, path)"]),
        tRow(["src/auth/unified-auth.js",    "Global Express middleware — CMC bypass, JWT verify, RBAC check"]),
        tRow(["src/auth/auth-controller.js", "Login logic — reads users.json, bcrypt compare, issues JWT"]),
        tRow(["src/auth/jwt.js",             "Jwt.generateToken() signs the JWT with role + user info"]),
        tRow(["app.js",                      "Registers unified-auth globally via excludePaths([ /auth, /api-docs ])"]),
      ]}),
      divider(),

      // 4. ROLES
      h("4. Roles & Access Patterns"),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
        tRow(["Role", "Department", "Access Scope"], true),
        tRow(["super_admin",        "Administration", "All endpoints (*)"]),
        tRow(["head_of_it",         "IT",             "/api/v1/it/*, /api/v1/server-load/*, /api/v1/cyber-posture, /api/v1/patch-compliance, /api/v1/system-health, /api/v1/infrastructure/*"]),
        tRow(["it_staff",           "IT",             "Limited IT read paths: server-load, system-health, specific /api/v1/it/* sub-endpoints"]),
        tRow(["head_of_sales",      "Sales",          "/api/v1/sales/*, /api/v1/marketing/*"]),
        tRow(["sales_staff",        "Sales",          "Specific sales paths: revenue-attribution, ctr, conversion-funnels, territory-performance, etc."]),
        tRow(["head_of_operations", "Operations",     "/api/v1/operations/*"]),
        tRow(["operations_staff",   "Operations",     "Specific operations paths: delivery, fuel-consumption, signal-quality, up-downtime-logs, etc."]),
        tRow(["head_of_finance",    "Finance",        "/api/v1/finance/*, /api/v1/budget-variance, /api/v1/capEx/*, executive finance paths"]),
        tRow(["finance_staff",      "Finance",        "Specific finance paths: close-metrics, audit-trail, gl-accounts, dso, bad-debt-ratios, etc."]),
        tRow(["head_of_editorial",  "Editorial",      "/api/v1/editorial/*"]),
        tRow(["editorial_staff",    "Editorial",      "Specific editorial paths: analytics, error-rate, readership-trends, social-sentiment, etc."]),
        tRow(["admin_staff",        "Administration", "/api/v1/administrative/*"]),
      ]}),
      divider(),

      // 5. CREDENTIALS
      h("5. User Credentials"),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
        tRow(["Role", "Email", "Password"], true),
        tRow(["super_admin",        "admin@vision.com",                    "Admin@2024!"]),
        tRow(["head_of_it",         "headofit@vision.com",                 "ITHead@2024!"]),
        tRow(["head_of_it",         "systemsadministrator@vision.com",     "ITHead@2024!"]),
        tRow(["it_staff",           "managertechinfra@vision.com",         "ITStaff@2024!"]),
        tRow(["it_staff",           "managerinfosec@vision.com",           "ITStaff@2024!"]),
        tRow(["it_staff",           "managerservicedelivery@vision.com",   "ITStaff@2024!"]),
        tRow(["it_staff",           "networkadmin@vision.com",             "ITStaff@2024!"]),
        tRow(["it_staff",           "itsupport@vision.com",                "ITStaff@2024!"]),
        tRow(["head_of_sales",      "headofsales@vision.com",              "SalesHead@2024!"]),
        tRow(["head_of_sales",      "advertisingmanager@vision.com",       "SalesHead@2024!"]),
        tRow(["head_of_sales",      "marketingmanager@vision.com",         "SalesHead@2024!"]),
        tRow(["head_of_sales",      "salesmanager@vision.com",             "SalesHead@2024!"]),
        tRow(["sales_staff",        "digitalmktopt@vision.com",            "SalesStaff@2024!"]),
        tRow(["sales_staff",        "corporatesalessup@vision.com",        "SalesStaff@2024!"]),
        tRow(["head_of_operations", "headofprinting@vision.com",           "OpsHead@2024!"]),
        tRow(["operations_staff",   "printingsupervisor@vision.com",       "OpsStaff@2024!"]),
        tRow(["operations_staff",   "broadcasteng@vision.com",             "OpsStaff@2024!"]),
        tRow(["operations_staff",   "technician@vision.com",               "OpsStaff@2024!"]),
        tRow(["operations_staff",   "transport@vision.com",                "OpsStaff@2024!"]),
        tRow(["head_of_finance",    "financialcontroller@vision.com",      "FinanceHead@2024!"]),
        tRow(["finance_staff",      "senioraccount@vision.com",            "FinanceStaff@2024!"]),
        tRow(["finance_staff",      "principalaccountant@vision.com",      "FinanceStaff@2024!"]),
        tRow(["finance_staff",      "accountant@vision.com",               "FinanceStaff@2024!"]),
        tRow(["finance_staff",      "asaccountant@vision.com",             "FinanceStaff@2024!"]),
        tRow(["finance_staff",      "creditcontroller@vision.com",         "FinanceStaff@2024!"]),
        tRow(["finance_staff",      "sysaccountant@vision.com",            "FinanceStaff@2024!"]),
        tRow(["head_of_editorial",  "editorinchief@vision.com",            "EditHead@2024!"]),
        tRow(["editorial_staff",    "reporter@vision.com",                 "EditStaff@2024!"]),
        tRow(["editorial_staff",    "editor@vision.com",                   "EditStaff@2024!"]),
        tRow(["editorial_staff",    "managingeditor@vision.com",           "EditStaff@2024!"]),
        tRow(["editorial_staff",    "newseditor@vision.com",               "EditStaff@2024!"]),
        tRow(["editorial_staff",    "deputyeditor@vision.com",             "EditStaff@2024!"]),
        tRow(["editorial_staff",    "subeditor@vision.com",                "EditStaff@2024!"]),
        tRow(["editorial_staff",    "photovideojournalist@vision.com",     "EditStaff@2024!"]),
        tRow(["editorial_staff",    "presenteranchor@vision.com",          "EditStaff@2024!"]),
        tRow(["admin_staff",        "administrationmanager@vision.com",    "AdminStaff@2024!"]),
        tRow(["admin_staff",        "executiveassistant@vision.com",       "AdminStaff@2024!"]),
        tRow(["admin_staff",        "administrativeassistant@vision.com",  "AdminStaff@2024!"]),
      ]}),
      divider(),

      // 6. ADDING NEW API
      h("6. How to Guard a New API Endpoint"),
      p("Follow these 3 steps. No auth code is needed inside the route file itself."),
      p(""),
      h("Step 1 — Create the route file", HeadingLevel.HEADING_2),
      mono("// src/departments/it/my-new-thing/my-new-routes.js"),
      mono("import express from 'express';"),
      mono("const router = express.Router();"),
      mono("router.get('/data', (req, res) => res.json({ success: true }));"),
      mono("export default router;"),
      p(""),
      h("Step 2 — Register in app.js", HeadingLevel.HEADING_2),
      mono("import myRouter from './src/departments/it/my-new-thing/my-new-routes.js';"),
      mono("app.use('/api/v1/it/my-new-thing', myRouter);"),
      p(""),
      h("Step 3 — Add URL pattern to src/auth/roles.js", HeadingLevel.HEADING_2),
      mono("head_of_it: ["),
      mono("  '/api/v1/it/*',               // already covers /it/my-new-thing/*"),
      mono("  '/api/v1/it/my-new-thing/*',  // or be explicit"),
      mono("],"),
      mono("it_staff: ["),
      mono("  '/api/v1/it/my-new-thing/data', // staff get specific sub-paths only"),
      mono("],"),
      p(""),
      h("URL Pattern Rules", HeadingLevel.HEADING_2),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
        tRow(["Pattern", "What It Matches"], true),
        tRow(["/api/v1/it/my-thing",   "Exact path only — no sub-paths"]),
        tRow(["/api/v1/it/my-thing/*", "That path plus all sub-paths below it"]),
        tRow(["*",                      "Everything — super_admin only"]),
      ]}),
      p(""),
      p("unified-auth.js is wired globally. No per-route middleware, no Jwt.verifyToken, nothing else needed.", { bold: true }),
      divider(),

      // 7. MANAGING USERS
      h("7. Managing Users"),
      h("7.1  Change a Password", HeadingLevel.HEADING_2),
      p("Run this command in the terminal from the project root. Replace the email and new password as needed:"),
      p(""),
      mono("node -e \""),
      mono("const bcrypt = require('bcrypt');"),
      mono("const fs = require('fs');"),
      mono("const users = JSON.parse(fs.readFileSync('./src/auth/users.json', 'utf8'));"),
      mono("const email = 'headofit@vision.com';"),
      mono("const newPassword = 'MyNewPassword@2026!';"),
      mono("bcrypt.hash(newPassword, 10).then(hash => {"),
      mono("  const user = users.find(u => u.email === email);"),
      mono("  if (!user) return console.log('User not found');"),
      mono("  user.password = hash;"),
      mono("  fs.writeFileSync('./src/auth/users.json', JSON.stringify(users, null, 2));"),
      mono("  console.log('Password updated for', email);"),
      mono("});"),
      mono("\""),
      p(""),
      p("No server restart needed — users.json is read fresh on every login."),
      p(""),
      h("7.2  Add a New User", HeadingLevel.HEADING_2),
      p("Run this command in the terminal. Set the email, name, department, role, and password for the new user:"),
      p(""),
      mono("node -e \""),
      mono("const bcrypt = require('bcrypt');"),
      mono("const fs = require('fs');"),
      mono("const users = JSON.parse(fs.readFileSync('./src/auth/users.json', 'utf8'));"),
      mono("const newUser = {"),
      mono("  email:      'newperson@vision.com',"),
      mono("  name:       'New Person',"),
      mono("  department: 'IT',"),
      mono("  role:       'it_staff',"),
      mono("  password:   'TheirPassword@2026!'"),
      mono("};"),
      mono("bcrypt.hash(newUser.password, 10).then(hash => {"),
      mono("  users.push({ ...newUser, password: hash });"),
      mono("  fs.writeFileSync('./src/auth/users.json', JSON.stringify(users, null, 2));"),
      mono("  console.log('User added:', newUser.email, '| role:', newUser.role);"),
      mono("});"),
      mono("\""),
      p(""),
      h("Valid roles to assign:", HeadingLevel.HEADING_3),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
        tRow(["Role", "Department"], true),
        tRow(["super_admin",        "Full access to all endpoints"]),
        tRow(["head_of_it",         "IT"]),
        tRow(["it_staff",           "IT"]),
        tRow(["head_of_sales",      "Sales"]),
        tRow(["sales_staff",        "Sales"]),
        tRow(["head_of_operations", "Operations"]),
        tRow(["operations_staff",   "Operations"]),
        tRow(["head_of_finance",    "Finance"]),
        tRow(["finance_staff",      "Finance"]),
        tRow(["head_of_editorial",  "Editorial"]),
        tRow(["editorial_staff",    "Editorial"]),
        tRow(["admin_staff",        "Administration"]),
      ]}),
      divider(),

      // 8. SECURITY
      h("8. Security Notes"),
      h("What is secure:", HeadingLevel.HEADING_2),
      bullet("Passwords stored as bcrypt hashes (10 rounds) — never plain text, computationally expensive to crack"),
      bullet("JWT signed with SECRET_KEY — tamper-proof, expires in 8 hours"),
      bullet("RBAC enforced server-side on every request — cannot be bypassed by the client"),
      bullet("401/403 responses do not leak implementation details"),
      bullet("No SQL database — no SQL injection surface"),
      bullet(".env and users.json are both listed in .gitignore — protected from source control"),
      p(""),
      h("What to be aware of:", HeadingLevel.HEADING_2),
      bullet("users.json is a flat file — protect server file access; only bcrypt hashes are stored, not plain passwords"),
      bullet("The CMC token lives in .env — never commit this file to git"),
      bullet("JWTs have no server-side revocation — a stolen token remains valid until its 8-hour expiry"),
      p(""),
      h("Recommendations:", HeadingLevel.HEADING_2),
      bullet("Keep .env and src/auth/users.json out of any shared repository"),
      bullet("Use strong, unique passwords for each user (at least 12 characters, mixed case, numbers, symbols)"),
      bullet("Rotate the CMC system token periodically by updating CMC_API_BEARER_TOKEN in .env"),
      divider(),

      // 9. STATUS CODES
      h("9. HTTP Response Codes"),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
        tRow(["Code", "Meaning", "When it occurs"], true),
        tRow(["200", "OK",           "Request authenticated and authorized successfully"]),
        tRow(["400", "Bad Request",  "Malformed JSON in login request body"]),
        tRow(["401", "Unauthorized", "No token provided, invalid / expired token, or wrong credentials at login"]),
        tRow(["403", "Forbidden",    "Valid token but the user's role is not allowed to access this path"]),
        tRow(["404", "Not Found",    "Auth passed but the route path does not exist"]),
      ]}),
    ],
  }],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync("./Vision_Group_API_Auth_Documentation_v2.docx", buffer);
console.log("Done: Vision_Group_API_Auth_Documentation_v2.docx");
