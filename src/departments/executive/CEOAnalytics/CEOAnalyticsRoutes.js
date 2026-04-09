import express from "express";
import { getAnalytics, getKPIs, getFilters } from "./CEOAnalyticsController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics:
 *   get:
 *     summary: Get analytics (paginated)
 *     tags: [CEO Analytics]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 */
router.get("/", getAnalytics);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/kpis:
 *   get:
 *     summary: Get KPIs
 *     tags: [CEO Analytics]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: KPIs retrieved successfully
 */
router.get("/kpis", getKPIs);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/filters:
 *   get:
 *     summary: Get filters for dropdowns
 *     tags: [CEO Analytics]
 *     parameters:
 *       - in: query
 *         name: filterType
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Filter values retrieved successfully
 */
router.get("/filters", getFilters);

export default router;