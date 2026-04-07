import express from "express";
import { getScheduleEfficiency } from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/administrative/scheduleEfficiency:
 *   get:
 *     tags:
 *       - Schedule Efficiency
 *     summary: Get combined schedule efficiency summary
 *     description: Returns combined executive meeting and task analytics. Supports optional filtering by start and end date.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Combined schedule efficiency data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meetings:
 *                   type: array
 *                 tasks:
 *                   type: array
 */
router.get("/", getScheduleEfficiency);

export default router;