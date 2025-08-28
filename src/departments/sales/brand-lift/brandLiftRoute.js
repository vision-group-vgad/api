import express from "express";
import { getBrandLift } from "./brandLiftController.js";
import Jwt from "../../../auth/jwt.js";

const brandLiftRoute = express.Router();

/**
 * @swagger
 * /api/v1/sales/brand-lift:
 *   get:
 *     summary: Get brand lift metrics (awareness, engagement, survey score lift)
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
 *         description: Brand lift data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 baselineSurveyScore:
 *                   type: number
 *                   description: Average survey score at baseline (first month)
 *                 brandLiftTrendsByChannel:
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
 *                         engagementRate:
 *                           type: string
 *                         avgSurveyScore:
 *                           type: number
 *                         brandLiftFromBaseline:
 *                           type: number
 *                 campaignSummary:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       campaign:
 *                         type: string
 *                       channel:
 *                         type: string
 *                       totalImpressions:
 *                         type: integer
 *                       totalEngagements:
 *                         type: integer
 *                       avgEngagementRate:
 *                         type: string
 *                       avgSurveyScore:
 *                         type: number
 *                       liftVsBaseline:
 *                         type: number
 *       500:
 *         description: Server error
 */
brandLiftRoute.get("/", getBrandLift);

export default brandLiftRoute;
