import express from "express";
import { getRVSOverview } from "./rvsAnalyticsController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/overview:
 *   get:
 *     summary: Get full RVS analytics (Resources, Spaces, Vendors, Summary)
 *     tags: [RVS Analytics]
 *     parameters:
 *       - in: query
 *         name: department
 *         required: false
 *         schema:
 *           type: string
 *           example: All
 *         description: "Filter data by department (default: All)"
 *     responses:
 *       200:
 *         description: Full RVS analytics data
 */
router.get("/overview", getRVSOverview);

export default router;