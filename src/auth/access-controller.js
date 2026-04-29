import {
  fetchRoleByCode,
  fetchEndpointsByRole,
} from "../config/firebase/firebase-role-service.js";
import { match } from "path-to-regexp";

class AccessController {
  static authorizeRole() {
    return async function (req, res, next) {
      try {
        const roleCode = req.headers["x-role-code"];
        if (!roleCode) {
          return res.status(400).json({ message: "Missing role code" });
        }

        const role = await fetchRoleByCode(roleCode);
        if (!role) {
          return res.status(403).json({ message: "Invalid role code" });
        }

        const requestedEndpoint = req.baseUrl + req.path;

        // Backward/alias compatibility for sales supervisor analytics path.
        // This keeps RBAC mappings stable while supporting /api/sales/supervisor-analytics.
        const endpointCandidates = [requestedEndpoint];
        if (requestedEndpoint.startsWith("/api/sales/supervisor-analytics")) {
          endpointCandidates.push(
            requestedEndpoint.replace(
              "/api/sales/supervisor-analytics",
              "/api/v1/sales/SupervisorSalesAnalytics"
            )
          );
        }

        const accessibleUrls = await fetchEndpointsByRole(roleCode);

        const hasAccess = accessibleUrls.some((urlPattern) => {
          const matcher = match(urlPattern, { decode: decodeURIComponent });
          return endpointCandidates.some(
            (candidateEndpoint) => matcher(candidateEndpoint) !== false
          );
        });

        if (!hasAccess) {
          return res.status(403).json({
            message: `Access denied to ${requestedEndpoint}`,
          });
        }

        req.role = role;
        next();
      } catch (error) {
        res
          .status(500)
          .json({ message: "Server error while checking role," + error });
      }
    };
  }
}

export default AccessController;
