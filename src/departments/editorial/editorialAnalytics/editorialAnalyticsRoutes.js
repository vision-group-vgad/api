import express from "express";
import Jwt from "../../../auth/jwt.js";
import {
  getEditorialSessionAnalytics,
  getEditorialChartData,
  getEditorialDiagnostics,
} from "./editorialAnalyticsController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/editorial/analytics/session-duration:
 *   get:
 *     summary: Get Editorial Session Analytics
 *     description: Returns editorial session analytics with filters for cross-platform engagement, content ROI, and audience demographics.
 *     tags:
 *       - Editorial Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *         description: Platform filter (web, mobile, etc.)
 *       - in: query
 *         name: streamName
 *         schema:
 *           type: string
 *         description: Stream name filter
 *       - in: query
 *         name: pageTitle
 *         schema:
 *           type: string
 *         description: Page title filter
 *       - in: query
 *         name: sessionMedium
 *         schema:
 *           type: string
 *         description: Session medium filter (organic, referral, etc.)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 1000
 *         description: Maximum number of records to return
 *     responses:
 *       200:
 *         description: Editorial session analytics retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - pageTitle: "404 Not Found - New Vision Official"
 *                   platform: "web"
 *                   streamName: "New Vision Website"
 *                   averageDuration: "03:39:56"
 *                   bounceRate: "0"
 *               filters:
 *                 startDate: "2025-01-01"
 *                 endDate: "2025-04-30"
 *               summary:
 *                 totalArticles: 2
 *                 platforms: ["web"]
 *                 streams: ["New Vision Website"]
 *                 dateRange: "2025-01-01 to 2025-04-30"
 *               timestamp: "2025-07-17T12:00:00.000Z"
 */
router.get("/analytics/session-duration", Jwt.verifyToken, getEditorialSessionAnalytics);

/**
 * @swagger
 * /api/v1/editorial/analytics/chart-data:
 *   get:
 *     summary: Get Editorial Analytics Chart Data
 *     description: Returns chart-ready data for editorial analytics (line, bar, pie).
 *     tags:
 *       - Editorial Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: chartType
 *         schema:
 *           type: string
 *           enum: [line, bar, pie]
 *           default: line
 *         description: Type of chart to format data for
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *           enum: [averageDuration, bounceRate, sessionMedium]
 *           default: averageDuration
 *         description: Which metric to format for charts
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *         description: Platform filter
 *       - in: query
 *         name: streamName
 *         schema:
 *           type: string
 *         description: Stream name filter
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 1000
 *         description: Maximum number of records to process
 *     responses:
 *       200:
 *         description: Chart data formatted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 labels: ["404 Not Found - New Vision Official", "Eyasasaanyizza ..."]
 *                 datasets:
 *                   - label: "averageDuration"
 *                     data: [13196, 83756]
 *                     borderColor: "rgb(54, 162, 235)"
 *               chartType: "line"
 *               metric: "averageDuration"
 *               filters:
 *                 startDate: "2025-01-01"
 *                 endDate: "2025-04-30"
 *               timestamp: "2025-07-17T12:00:00.000Z"
 */
router.get("/analytics/chart-data", Jwt.verifyToken, getEditorialChartData);

/**
 * @swagger
 * /api/v1/editorial/analytics/diagnostics:
 *   get:
 *     summary: Get Editorial Analytics Diagnostics
 *     description: Returns environment diagnostics for editorial analytics.
 *     tags:
 *       - Editorial Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Diagnostics info
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               diagnostics:
 *                 hasApiUrl: true
 *                 hasApiToken: true
 *                 apiUrlValue: "https://cms-vgad.visiongroup.co.ug"
 *                 tokenLength: 32
 *                 nodeEnv: "development"
 *                 timestamp: "2025-07-17T12:00:00.000Z"
 *               message: "Editorial analytics environment diagnostic information"
 */
router.get("/analytics/diagnostics", Jwt.verifyToken, getEditorialDiagnostics);

export default router;
