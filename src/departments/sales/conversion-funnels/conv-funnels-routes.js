import ConvFunnelsController from "./ConvFunnelsController.js";
import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const convFunController = new ConvFunnelsController();
const convFunnelsRouter = express.Router();

/**
 * @swagger
 * /api/v1/sales/conversion-funnels/in-range:
 *   get:
 *     summary: Get campaign funnel analytics for a specified date range
 *     description: |
 *       Returns campaign data filtered by date range, a summary of metrics,
 *       and the top 4 performing campaigns.
 *     tags: [Conversion Funnels]
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
 *         description: Funnel analytics successfully retrieved
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
 *                       campaign_id:
 *                         type: integer
 *                         example: 1
 *                       campaign_name:
 *                         type: string
 *                         example: "Facebook Ads - Summer Sale"
 *                       channel:
 *                         type: string
 *                         example: "Facebook"
 *                       device:
 *                         type: string
 *                         example: "Mobile"
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-08-01"
 *                       visits:
 *                         type: integer
 *                         example: 5000
 *                       leads:
 *                         type: integer
 *                         example: 1200
 *                       opportunities:
 *                         type: integer
 *                         example: 300
 *                       conversions:
 *                         type: integer
 *                         example: 75
 *                 top_campaigns:
 *                   type: array
 *                   description: Top 4 performing campaigns based on conversions
 *                   items:
 *                     $ref: '#/components/schemas/Campaign'
 *                 summary:
 *                   type: object
 *                   description: Aggregated summary of the filtered campaigns
 *                   properties:
 *                     no_of_campaigns:
 *                       type: integer
 *                       example: 20
 *                     devices:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Mobile", "Desktop", "Tablet"]
 *                     channels:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Facebook", "Google", "Email"]
 *                     avg_visits:
 *                       type: integer
 *                       example: 4500
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       properties:
 *         campaign_id:
 *           type: integer
 *           example: 1
 *         campaign_name:
 *           type: string
 *           example: "Facebook Ads - Summer Sale"
 *         channel:
 *           type: string
 *           example: "Facebook"
 *         device:
 *           type: string
 *           example: "Mobile"
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-08-01"
 *         visits:
 *           type: integer
 *           example: 5000
 *         leads:
 *           type: integer
 *           example: 1200
 *         opportunities:
 *           type: integer
 *           example: 300
 *         conversions:
 *           type: integer
 *           example: 75
 */
convFunnelsRouter.get("/in-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (validateRange(startDate, endDate, res)) return;

  try {
    const results = await convFunController.getInRangeAnalytics(
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

export default convFunnelsRouter;
