import CTRController from "./CTRController.js";
import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const ctrController = new CTRController();
const ctrRouter = express.Router();

/**
 * @swagger
 * /api/v1/sales/ctr/in-range:
 *   get:
 *     summary: Get CTR analytics for campaigns in a specified date range
 *     description: |
 *       Retrieves campaign analytics including average CTR, number of campaigns,
 *       devices used, channels, and average revenue per campaign.
 *       The date range is inclusive of both `startDate` and `endDate`.
 *     tags: [CTR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for filtering campaigns (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for filtering campaigns (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: CTR analytics successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: List of campaigns within the specified date range
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-08-10"
 *                       clickThroughRatePercent:
 *                         type: number
 *                         format: float
 *                         example: 5.6
 *                       totalRevenue:
 *                         type: number
 *                         format: float
 *                         example: 1200.50
 *                       device:
 *                         type: string
 *                         example: "Mobile"
 *                       channel:
 *                         type: string
 *                         example: "Facebook Ads"
 *                 summary:
 *                   type: object
 *                   description: Aggregated analytics summary
 *                   properties:
 *                     avg_ctr_percentage:
 *                       type: number
 *                       format: float
 *                       example: 4.8
 *                     no_of_campaigns:
 *                       type: integer
 *                       example: 20
 *                     devices:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Mobile", "Desktop"]
 *                     channels:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Google Ads", "Facebook Ads"]
 *                     avg_revenue_per_campaign:
 *                       type: number
 *                       format: float
 *                       example: 950.75
 *       400:
 *         description: Invalid date range provided
 *       401:
 *         description: Unauthorized, missing or invalid JWT token
 *       500:
 *         description: Server error
 */
ctrRouter.get("/in-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (validateRange(startDate, endDate, res)) return;

  try {
    const results = await ctrController.getInRangeAnalytics(startDate, endDate);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

export default ctrRouter;
