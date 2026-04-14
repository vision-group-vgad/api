import express from "express";
import { getCampaignsController } from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Campaign ROI
 *     description: Fetches campaign ROI data
 */
/**
 * @swagger
 * /api/v1/sales/campaign-roi:
 *   get:
 *     summary: Get campaigns with ROI
 *     description: Returns all campaigns with ROI. Optionally filter by start and end dates.
 *     tags: [Campaign ROI]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering campaigns (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering campaigns (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of campaigns with ROI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       campaignId:
 *                         type: string
 *                       campaignName:
 *                         type: string
 *                       channel:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                       endDate:
 *                         type: string
 *                       cost:
 *                         type: number
 *                       revenue:
 *                         type: number
 *                       impressions:
 *                         type: number
 *                       clicks:
 *                         type: number
 *                       conversions:
 *                         type: number
 *                       ROI:
 *                         type: number
 */


router.get("/", getCampaignsController);

export default router;