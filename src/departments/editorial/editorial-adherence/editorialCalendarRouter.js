import express from "express";
import { assessEditorialCalendar } from "./editorialCalendarController.js";
import Jwt from "../../../auth/jwt.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/editorial/editorial-calendar-adherence:
 *   get:
 *     summary: Assess adherence to the editorial calendar
 *     tags: [Analytics]
 *     description: Retrieves scheduled vs actual publication data, labels each article as early, on-time, or late, and aggregates counts per category.
 *     parameters:
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
 *           enum: [John Smith, Jane Doe, Alice Johnson, Bob Brown, Carol Davis]
 *         description: Optional filter by author name.
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional start date filter (inclusive).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional end date filter (inclusive).
 *       - in: query
 *         name: published_status
 *         schema:
 *           type: string
 *           enum: [early, on-time, late]
 *         description: Optional filter by publication status.
 *     responses:
 *       200:
 *         description: Editorial calendar adherence results.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metric:
 *                   type: string
 *                   example: editorialCalendarAdherence
 *                 count:
 *                   type: integer
 *                   example: 25
 *                 filtersApplied:
 *                   type: object
 *                   example: { "section": "Politics", "author": "John Doe", "startDate": "2024-07-01", "endDate": "2025-07-01", "published_status": "on-time" }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 summary:
 *                   type: object
 *                   example: { "early": 5, "on-time": 15, "late": 5 }
 *                 explanation:
 *                   type: string
 *                   example: Labels each article as early, on-time, or late based on scheduled vs actual publication dates.
 */


router.get("/", assessEditorialCalendar);

export default router;

