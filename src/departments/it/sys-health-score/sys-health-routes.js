import SysHealthCont from "./SysHealthScoreController.js";
import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const sysHealthCont = new SysHealthCont();
const sysHealthRouter = express.Router();

/**
 * @swagger
 * /api/v1/it/sys-health-score/in-range:
 *   get:
 *     summary: Get system health data within a date range
 *     description: Returns system health metrics (e.g., uptime, latency, error rate, SLA compliance, etc.) for the specified date range.
 *     tags:
 *       - System Health
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Successful response with system health data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-08-19"
 *                   system:
 *                     type: string
 *                     example: "Google Analytics"
 *                   uptimePercent:
 *                     type: number
 *                     example: 99.8
 *                   avgLatencyMs:
 *                     type: number
 *                     example: 120
 *                   errorRatePercent:
 *                     type: number
 *                     example: 0.4
 *                   slaCompliancePercent:
 *                     type: number
 *                     example: 99.5
 *                   systemHealthScore:
 *                     type: number
 *                     example: 95
 *       400:
 *         description: Invalid date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid date range"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 */
sysHealthRouter.get("/in-range", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate);

  try {
    const results = await sysHealthCont.getInRangeData(startDate, endDate);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

export default sysHealthRouter;
