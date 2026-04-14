import CLVController from "./CLVController.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const clvController = new CLVController();
const clvRouter = express.Router();

/**
 * @swagger
 * /api/v1/sales/client-lifetime-value/in-range:
 *   get:
 *     summary: Retrieve CLV analytics for a given date range
 *     description: Returns client lifetime value (CLV) analytics for all customers who joined within the specified date range.
 *     tags:
 *       - Client Lifetime Value
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for filtering customers (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for filtering customers (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: CLV analytics returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   customerId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   joinDate:
 *                     type: string
 *                     format: date
 *                   totalPurchases:
 *                     type: integer
 *                   totalRevenue:
 *                     type: number
 *                   avgPurchaseValue:
 *                     type: number
 *                   avgPurchaseFrequency:
 *                     type: number
 *                   retentionRate:
 *                     type: number
 *                   clv:
 *                     type: number
 *       400:
 *         description: Invalid date range
 *       500:
 *         description: Server error
 */
clvRouter.get("/in-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (validateRange(startDate, endDate, res)) return;

  try {
    const results = await clvController.getInRangeAnalytics(startDate, endDate);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

export default clvRouter;
