import InvoProMetricsController from "./InvoProMetricsController.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const invoProMetricsController = new InvoProMetricsController();
const invoProMetricsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Invoice Processing Metrics
 *   description: API endpoints for invoice processing metrics
 */

/**
 * @swagger
 * /api/v1/finance/invoice-metrics/in-range:
 *   get:
 *     summary: Get invoice processing metrics within a date range
 *     tags: [Invoice Processing Metrics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Metrics retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "date": "2025-03-10",
 *                   "totalInvoices": 125,
 *                   "avgProcessingTimeDays": 4.2,
 *                   "approvalCycleTimeDays": 2.5,
 *                   "onTimePaymentRate": 92.8,
 *                   "exceptionRate": 7.2,
 *                   "earlyPaymentDiscountUsage": 65.4,
 *                   "firstPassMatchRate": 88.9,
 *                   "topVendorsByVolume": [
 *                     { "vendor": "Acme Supplies", "invoices": 35 },
 *                     { "vendor": "Global Services", "invoices": 28 }
 *                   ]
 *                 }
 *               ]
 *       400:
 *         description: Invalid date range
 *       500:
 *         description: Server error
 */
invoProMetricsRouter.get("/in-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await invoProMetricsController.getInRangeAnalytics(
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

export default invoProMetricsRouter;
