import jwt from "jsonwebtoken";
import { canRoleAccessWithOverrides } from "./access-control-service.js";

const CMC_KEY = (process.env.CMC_API_BEARER_TOKEN || process.env.CMS_API_KEY || "").trim();

/**
 * Unified auth middleware — handles two cases:
 *
 * 1. CMC Bearer token  → superadmin, full access (Swagger / dev tools)
 * 2. User JWT          → role extracted from token, RBAC enforced via roles.js
 */
const unifiedAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"] || "";
  const xApiKey = (req.headers["x-api-key"] || "").trim();
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  // ── Path 1: CMC API key (superadmin bypass) ──────────────────────────────
  if (CMC_KEY && (bearerToken === CMC_KEY || xApiKey === CMC_KEY)) {
    req.user = { role: "super_admin", email: "system", name: "System" };
    return next();
  }

  // ── Path 2: User JWT ─────────────────────────────────────────────────────
  if (!bearerToken) {
    return res.status(401).json({ success: false, message: "Unauthorized: no token provided." });
  }

  jwt.verify(bearerToken, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Unauthorized: invalid or expired token." });
    }

    const role = decoded.role;
    const urlPath = req.baseUrl + req.path;

    if (!(await canRoleAccessWithOverrides(role, urlPath))) {
        // Allow all authenticated users to access their own permission info
        if (urlPath !== "/api/v1/access-control/my-permissions") {
          return res.status(403).json({
            success: false,
            message: `Access denied: your role (${role}) cannot access ${urlPath}`,
          });
        }
      }

    req.user = decoded;
    next();
  });
};

export default unifiedAuth;
