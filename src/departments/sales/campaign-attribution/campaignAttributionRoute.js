import express from "express";
import { getCampaignAttribution } from "./campaignAttributionController.js";

const campaignAttributionRoute = express.Router();

/**
 * @swagger
 * /api/v1/sales/campaign-attribution:
 *   get:
 *     summary: Get campaign attribution metrics (multi-touch, conversions, attribution credit)
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: campaign
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - Summer Promo Search
 *             - Winter Sale Search
 *             - Remarketing Display
 *             - LinkedIn Lead Gen
 *             - LinkedIn Sponsored Content
 *             - Referral Program
 *             - Customer Advocacy Program
 *             - Email Outreach
 *             - Newsletter Drip Campaign
 *         description: Filter by campaign name (comma separated for multiple)
 *       - in: query
 *         name: channel
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Google Ads, LinkedIn, Referral, Email]
 *         description: Filter by marketing channel
 *     responses:
 *       200:
 *         description: Campaign attribution data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLeadsTouched:
 *                   type: integer
 *                 conversionsInfluenced:
 *                   type: integer
 *                 attributionCredit:
 *                   type: number
 *                 conversionRate:
 *                   type: string
 *                 leads:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Lead_ID:
 *                         type: string
 *                       Lead_Created_Date:
 *                         type: string
 *                       Touchpoints:
 *                         type: array
 *                         items:
 *                           type: string
 *                       Channels:
 *                         type: array
 *                         items:
 *                           type: string
 *                       IsConverted:
 *                         type: boolean
 *                       ContractValue:
 *                         type: number
 *       500:
 *         description: Server error
 */
campaignAttributionRoute.get("/", getCampaignAttribution);

export default campaignAttributionRoute;
