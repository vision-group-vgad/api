import express from "express";
import {
  getAllRoles,
  getAvailableEndpointPatterns,
  getEndpointGroups,
  getRoleAccessDetails,
  listRoleAccessSummaries,
  updateRoleOverride,
} from "./access-control-service.js";

const accessControlRouter = express.Router();

const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== "super_admin") {
    return res.status(403).json({ message: "Only super admins can manage API access." });
  }
  next();
};

// ─────────────────────────────────────────────────────────────────
// PUBLIC ENDPOINTS (accessible to all authenticated users)
// ─────────────────────────────────────────────────────────────────

accessControlRouter.get("/my-permissions", async (req, res) => {
  try {
    if (!req.user?.role) {
      return res.status(401).json({ message: "User not authenticated." });
    }
    const details = await getRoleAccessDetails(req.user.role);
    res.status(200).json({
      role: req.user.role,
      basePatterns: details.basePatterns,
      grants: details.grants,
      denies: details.denies,
      effectivePatterns: details.effectivePatterns,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────
// ADMIN-ONLY ENDPOINTS (require super_admin)
// ─────────────────────────────────────────────────────────────────

accessControlRouter.use(requireSuperAdmin);

accessControlRouter.get("/catalog", async (_req, res) => {
  try {
    res.status(200).json({
      roles: getAllRoles(),
      endpointPatterns: await getAvailableEndpointPatterns(),
      endpointGroups: await getEndpointGroups(),
      summaries: await listRoleAccessSummaries(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

accessControlRouter.get("/roles/:role", async (req, res) => {
  try {
    const details = await getRoleAccessDetails(req.params.role);
    res.status(200).json(details);
  } catch (error) {
    if (error.message.startsWith("Unknown role:")) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

accessControlRouter.put("/roles/:role", async (req, res) => {
  try {
    const result = await updateRoleOverride(
      req.params.role,
      {
        grants: req.body?.grants,
        denies: req.body?.denies,
      },
      req.user?.email || req.user?.name || "super_admin"
    );
    res.status(200).json(result);
  } catch (error) {
    if (error.message.startsWith("Unknown role:") || error.message.startsWith("Invalid endpoint patterns:")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

export default accessControlRouter;