import TerritoryPerformController from "./TerritoryPerformController.js";
import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const territoryController = new TerritoryPerformController();
const territoryPerformRouter = express.Router();

/**
 * @swagger
 * /api/v1/sales/territory-performance/in-range:
 *   get:
 *     summary: Get territory performance analytics for a specified date range
 *     description: |
 *       Returns filtered territory data, a summary including the best performing region,
 *       list of regions, and average revenue per region.
 *     tags: [Territory Performance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for filtering territories (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for filtering territories (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Territory performance successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: List of territory performance records within the specified date range
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-08-01"
 *                       region:
 *                         type: string
 *                         example: "North Region"
 *                       total_revenue:
 *                         type: number
 *                         example: 125000
 *                       gross_profit:
 *                         type: number
 *                         example: 85000
 *                       net_profit:
 *                         type: number
 *                         example: 62000
 *                       profit_margin_percent:
 *                         type: number
 *                         example: 49.6
 *                       total_sales:
 *                         type: integer
 *                         example: 220
 *                       prospected_clients:
 *                         type: integer
 *                         example: 600
 *                       sales_conversion_rate_percent:
 *                         type: number
 *                         example: 36.7
 *                       average_sale_value:
 *                         type: number
 *                         example: 568
 *                       customer_acquisition_cost:
 *                         type: number
 *                         example: 80
 *                       return_on_marketing_investment:
 *                         type: number
 *                         example: 5.2
 *                       sales:
 *                         type: integer
 *                         example: 220
 *                 summary:
 *                   type: object
 *                   description: Summary statistics for the filtered territories
 *                   properties:
 *                     best_region:
 *                       type: object
 *                       description: Territory object with the highest performance
 *                       $ref: '#/components/schemas/Territory'
 *                     regions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["North Region", "South Region", "East Region"]
 *                     avg_revenue_per_region:
 *                       type: number
 *                       example: 95000
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * components:
 *   schemas:
 *     Territory:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-08-01"
 *         region:
 *           type: string
 *           example: "North Region"
 *         total_revenue:
 *           type: number
 *           example: 125000
 *         gross_profit:
 *           type: number
 *           example: 85000
 *         net_profit:
 *           type: number
 *           example: 62000
 *         profit_margin_percent:
 *           type: number
 *           example: 49.6
 *         total_sales:
 *           type: integer
 *           example: 220
 *         prospected_clients:
 *           type: integer
 *           example: 600
 *         sales_conversion_rate_percent:
 *           type: number
 *           example: 36.7
 *         average_sale_value:
 *           type: number
 *           example: 568
 *         customer_acquisition_cost:
 *           type: number
 *           example: 80
 *         return_on_marketing_investment:
 *           type: number
 *           example: 5.2
 *         sales:
 *           type: integer
 *           example: 220
 */
territoryPerformRouter.get("/in-range", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate);

  try {
    const results = await territoryController.getInRangeAnalytics(
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

export default territoryPerformRouter;
