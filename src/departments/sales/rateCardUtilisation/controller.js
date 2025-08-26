import express from "express";
import { getRateCardUtilization } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Sales - Rate Card Utilization
 *     description: API for tracking rate card utilization for Vision Group ad placements
 */

/**
 * @swagger
 * /api/v1/sales/rate-card-utilization:
 *   get:
 *     summary: Get Rate Card Utilization data
 *     description: Returns utilization percentage of Vision Group ad placements.  
 *                  Can filter by channel, placement ID, or month.  
 *                  Values are based on rate card and booked impressions.
 *     tags: [Sales - Rate Card Utilization]
 *     parameters:
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *         description: Filter by channel (e.g., "Website")
 *       - in: query
 *         name: placementId
 *         schema:
 *           type: string
 *         description: Filter by placement ID (e.g., "P002")
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by month (e.g., "2025-08")
 *     responses:
 *       200:
 *         description: Rate Card Utilization analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       placementId:
 *                         type: string
 *                         example: P001
 *                       placementName:
 *                         type: string
 *                         example: Homepage Banner
 *                       channel:
 *                         type: string
 *                         example: Website
 *                       totalImpressions:
 *                         type: integer
 *                         example: 500000
 *                       bookedImpressions:
 *                         type: integer
 *                         example: 400000
 *                       rateUGX:
 *                         type: integer
 *                         example: 150000
 *                       month:
 *                         type: string
 *                         example: "2025-08"
 *                       utilization:
 *                         type: string
 *                         example: "80.00"
 *                       unutilized:
 *                         type: string
 *                         example: "20.00"
 *       500:
 *         description: Server error
 */
router.get("/", (req, res) => {
  try {
    const filters = {
      channel: req.query.channel,
      placementId: req.query.placementId,
      month: req.query.month,
    };

    const data = getRateCardUtilization(filters);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
