// infrastructure/infraRoutes.js

import express from 'express';
import {
  getCpuMemoryTrends,
  getLatencyTrends,
  getAssetStatus
} from './InfraController.js'; // Ensure this matches filename and casing exactly on your OS

const router = express.Router();

/**
 * @swagger
 * /api/v1/infrastructure/cpu-memory-trends:
 *   get:
 *     summary: Get CPU and Memory Utilization Trends
 *     description: Returns monthly CPU and memory usage per location.
 *     tags:
 *       - Infrastructure (IT)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - month: "Jan"
 *                   location: "HQ"
 *                   cpu: 40
 *                   memory: 70
 */
router.get('/cpu-memory-trends', getCpuMemoryTrends);

/**
 * @swagger
 * /api/v1/infrastructure/latency-trends:
 *   get:
 *     summary: Get Latency Trends
 *     description: Returns monthly latency data per location.
 *     tags:
 *       - Infrastructure (IT)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - month: "Jan"
 *                   location: "HQ"
 *                   latency: 20
 */
router.get('/latency-trends', getLatencyTrends);

/**
 * @swagger
 * /api/v1/infrastructure/asset-status:
 *   get:
 *     summary: Get IT Asset Inventory Status
 *     description: Returns count of assets by status (Active, Maintenance, Decommissioned).
 *     tags:
 *       - Infrastructure (IT)
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - status: "Active"
 *                   count: 120
 */
router.get('/asset-status', getAssetStatus);

// ✅ ESM-compatible export
export default router;
