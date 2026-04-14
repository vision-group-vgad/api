import RevenuePerformanceController from "./RevPerformanceController.js";
import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const revPerformController = new RevenuePerformanceController();
const revPerfromanceRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Revenue Performance
 *   description: Analytics and revenue performance endpoints
 */

/**
 * @swagger
 * /api/v1/executive/revenue-performance/in-range:
 *   get:
 *     summary: Get revenue performance analytics in a date range
 *     description: Returns filtered data and a summary including overall revenue, best/worst regions, units, and clients.
 *     tags: [Revenue Performance]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date of the range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date of the range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Revenue analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: Filtered revenue records
 *                   items:
 *                     type: object
 *                     example:
 *                       date: "2025-08-29"
 *                       totalRevenue: 125000000
 *                       projectedRevenue: 140000000
 *                       businessUnits: []
 *                       clients: []
 *                       regions: []
 *                 summary:
 *                   type: object
 *                   properties:
 *                     overall_revenue:
 *                       type: number
 *                       description: Sum of actual revenue in the date range
 *                     best_region:
 *                       type: object
 *                       description: The region with highest revenue
 *                     worst_region:
 *                       type: object
 *                       description: The region with lowest revenue
 *                     best_unit:
 *                       type: object
 *                       description: The business unit with highest revenue
 *                     worst_unit:
 *                       type: object
 *                       description: The business unit with lowest revenue
 *                     best_client:
 *                       type: object
 *                       description: The client generating highest revenue
 *                     worst_client:
 *                       type: object
 *                       description: The client generating lowest revenue
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
revPerfromanceRouter.get("/in-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await revPerformController.getInRangeAnalytics(
      startDate,
      endDate
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

export default revPerfromanceRouter;
