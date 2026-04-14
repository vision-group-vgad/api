import express from "express";
import {
  getServerLoadAnalytics,
  getServerLoadKPIs,
  getStorageAnalytics,
  getStorageKPIs,
  getPatchComplianceAnalytics,
  getPatchComplianceKPIs
} from "./ServerStoragePatchController.js";
import Jwt from "../../../auth/jwt.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/it/ServerStoragePatch/server-load:
 *   get:
 *     summary: Get server load analytics (paginated)
 *     description: Returns server load analytics with filters and pagination.
 *     tags: [IT Server Storage Patch]
 *     parameters:
 *       - in: query
 *         name: hostname
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Server load analytics retrieved successfully
 */
router.get(
  "/server-load",
  getServerLoadAnalytics
);

/**
 * @swagger
 * /api/v1/it/ServerStoragePatch/server-load/kpis:
 *   get:
 *     summary: Get server load KPIs
 *     description: Returns KPIs for server load analytics.
 *     tags: [IT Server Storage Patch]
 *     parameters:
 *       - in: query
 *         name: hostname
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Server load KPIs retrieved successfully
 */
router.get(
  "/server-load/kpis",
  getServerLoadKPIs
);

/**
 * @swagger
 * /api/v1/it/ServerStoragePatch/storage:
 *   get:
 *     summary: Get storage utilization analytics (paginated)
 *     description: Returns storage utilization analytics with filters and pagination.
 *     tags: [IT Server Storage Patch]
 *     parameters:
 *       - in: query
 *         name: diskName
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Storage utilization analytics retrieved successfully
 */
router.get(
  "/storage",
  getStorageAnalytics
);

/**
 * @swagger
 * /api/v1/it/ServerStoragePatch/storage/kpis:
 *   get:
 *     summary: Get storage utilization KPIs
 *     description: Returns KPIs for storage utilization analytics.
 *     tags: [IT Server Storage Patch]
 *     parameters:
 *       - in: query
 *         name: diskName
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Storage utilization KPIs retrieved successfully
 */
router.get(
  "/storage/kpis",
  getStorageKPIs
);

/**
 * @swagger
 * /api/v1/it/ServerStoragePatch/patch-compliance:
 *   get:
 *     summary: Get patch compliance analytics (paginated)
 *     description: Returns patch compliance analytics with filters and pagination.
 *     tags: [IT Server Storage Patch]
 *     parameters:
 *       - in: query
 *         name: osVersion
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Patch compliance analytics retrieved successfully
 */
router.get(
  "/patch-compliance",
  getPatchComplianceAnalytics
);

/**
 * @swagger
 * /api/v1/it/ServerStoragePatch/patch-compliance/kpis:
 *   get:
 *     summary: Get patch compliance KPIs
 *     description: Returns KPIs for patch compliance analytics.
 *     tags: [IT Server Storage Patch]
 *     parameters:
 *       - in: query
 *         name: osVersion
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Patch compliance KPIs retrieved successfully
 */
router.get(
  "/patch-compliance/kpis",
  getPatchComplianceKPIs
);

export default router;