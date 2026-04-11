import express from "express";
import { getImpressionShare } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Sales & marketing- Impression Shares
 *     description: API for tracking Impression Share of client campaigns for Vision Group
 */

/**
 * @swagger
 * /api/v1/sales/impression-shares:
 *   get:
 *     summary: Get Impression Share data for client campaigns
 *     description: >
 *       Returns impression share analytics for Vision Group's client advertising campaigns.  
 *       You can filter by advertiser, campaign ID, or date range.  
 *       Values are in UGX for spend and budget.
 *     tags: [Sales & marketing- Impression Shares]
 *     parameters:
 *       - in: query
 *         name: advertiser
 *         schema:
 *           type: string
 *         description: Filter by advertiser name
 *       - in: query
 *         name: campaignId
 *         schema:
 *           type: string
 *         description: Filter by campaign ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Impression Share analytics
 */
router.get("/", async (req, res) => {
  try {
    const filters = {
      advertiser: req.query.advertiser,
      campaignId: req.query.campaignId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const data = await getImpressionShare(filters);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;