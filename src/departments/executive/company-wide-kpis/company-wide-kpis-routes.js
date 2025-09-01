import CompWideKpisController from "./CompWideKpisController.js";
import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const compWideKpisController = new CompWideKpisController();
const compyWideRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Company Wide KPIs
 *   description: Endpoints for company-wide KPI analytics
 */

/**
 * @swagger
 * /api/v1/executive/company-wide-kpis/in-range:
 *   get:
 *     summary: Get company-wide KPIs within a specified date range
 *     tags: [Company Wide KPIs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for analytics range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for analytics range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Analytics data with high-level summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: Weekly KPI data
 *                 summary:
 *                   type: object
 *                   description: Very high-level summary of the data
 *                   example:
 *                     total_weeks: 35
 *                     number_of_departments: 6
 *                     avg_employee_headcount: 460
 *                     avg_employee_engagement_percent: 80
 *                     avg_revenue: 265000000
 *                     avg_operating_costs: 185000000
 *                     avg_market_share_percent: 36
 *                     avg_content_views: 325000
 *                     avg_system_uptime_percent: "99.75"
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
compyWideRouter.get("/in-range", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await compWideKpisController.getInRangeAnalytics(
      startDate,
      endDate
    );

    res.status(200).json({
      results,
    });
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

export default compyWideRouter;
