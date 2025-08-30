import express from "express";
import { getContractValueTrends } from "./contractTrendsController.js";
import Jwt from "../../../auth/jwt.js";

const contractValueRoute = express.Router();

/**
 * @swagger
 * /api/v1/sales/contract-value-trends:
 *   get:
 *     summary: Get contract value trends (average contract value, lift vs baseline)
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
 *         description: Contract value trends data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 baselineContractValue:
 *                   type: number
 *                   description: Average contract value at baseline (first month)
 *                 contractValueTrendsByChannel:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         month:
 *                           type: string
 *                         campaign:
 *                           type: string
 *                         impressions:
 *                           type: integer
 *                         engagements:
 *                           type: integer
 *                         avgEngagementRate:
 *                           type: string
 *                         avgContractValue:
 *                           type: number
 *                         liftVsBaseline:
 *                           type: number
 *       500:
 *         description: Server error
 */
contractValueRoute.get("/",Jwt.verifyToken, getContractValueTrends);

export default contractValueRoute;
