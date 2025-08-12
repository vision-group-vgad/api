// contentProductionRoutes.js
import express from "express";
import Jwt from "../../../auth/jwt.js";
import { getContentProductionStats } from "./contentProductionController.js";

const contentProductionRoutes = express.Router();

/**
 * @swagger
 * /api/v1/editorial/content-production:
 *   get:
 *     summary: Get aggregated article publish counts over time intervals
 *     tags: [Analytics]
 *     description: >
 *       Aggregate article counts by daily, weekly, or monthly intervals. Supports filtering by section, author, platform, and date range.
 *       Returns totals, averages, and trends to assist editorial planning.
 *     parameters:
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *           default: daily
 *         description: Time interval to aggregate article counts.
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *           enum: [Sports, Politics, Technology, Entertainment, Health]
 *         description: Optional filter by article section.
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *           enum: [Alice Johnson, Bob Smith, Charlie Davis, Dana Lee, Evan Brown]
 *         description: Optional filter by author.
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           enum: [Web, Mobile, Print]
 *         description: Optional filter by platform.
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (inclusive) filter in YYYY-MM-DD format.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (inclusive) filter in YYYY-MM-DD format.
 *     responses:
 *       200:
 *         description: Aggregated article publish counts over selected interval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 interval:
 *                   type: string
 *                   example: weekly
 *                 filtersApplied:
 *                   type: object
 *                   example: { section: "Sports", author: "John Smith", platform: "Web", startDate: "2024-07-01", endDate: "2025-07-31" }
 *                 data:
 *                   type: object
 *                   description: Aggregated counts keyed by date strings
 *                 totals:
 *                   type: integer
 *                   example: 150
 *                 explanation:
 *                   type: string
 *                   example: Total articles published grouped by week
 */

contentProductionRoutes.get("/", Jwt.verifyToken ,getContentProductionStats);

export default contentProductionRoutes;
