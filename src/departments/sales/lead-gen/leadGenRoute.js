import express from "express";
import { getLeadGenEfficiency } from "./leadGenController.js";
import Jwt from "../../../auth/jwt.js";


const leadGenRoute = express.Router();

/**
 * @swagger
 * /api/v1/sales/lead-efficiency:
 *   get:
 *     summary: Get lead generation efficiency metrics (CPL trends, campaign breakdowns, funnel, time-to-qualification)
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
 *       - in: query
 *         name: stage
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Lead, MQL, SQL, Customer]
 *         description: Filter by lead stage
 *     responses:
 *       200:
 *         description: Lead gen efficiency data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLeads:
 *                   type: integer
 *                 totalSpend:
 *                   type: string
 *                 cplPerMonth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       leads:
 *                         type: integer
 *                       spend:
 *                         type: string
 *                       cpl:
 *                         type: string
 *                 breakdown:
 *                   type: object
 *                   properties:
 *                     campaignBreakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           campaignName:
 *                             type: string
 *                           channel:
 *                             type: string
 *                           leads:
 *                             type: integer
 *                           spend:
 *                             type: string
 *                           cpl:
 *                             type: string
 *                     channelBreakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           channel:
 *                             type: string
 *                           leads:
 *                             type: integer
 *                           spend:
 *                             type: string
 *                           cpl:
 *                             type: string
 *                 funnel:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       stage:
 *                         type: string
 *                       count:
 *                         type: integer
 *                       dropOff:
 *                         type: integer
 *                       percentage:
 *                         type: string
 *                 timeMetrics:
 *                   type: object
 *                   properties:
 *                     averageDays:
 *                       type: string
 *                     medianDays:
 *                       type: string
 *                     totalQualifiedLeads:
 *                       type: integer
 *                 timeByCampaign:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       campaignName:
 *                         type: string
 *                       averageDays:
 *                         type: string
 *                       medianDays:
 *                         type: string
 *                       qualifiedLeads:
 *                         type: integer
 *                 timeByChannel:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       channel:
 *                         type: string
 *                       averageDays:
 *                         type: string
 *                       medianDays:
 *                         type: string
 *                       qualifiedLeads:
 *                         type: integer
 *                 totalRecords:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
leadGenRoute.get("/", Jwt.verifyToken, getLeadGenEfficiency);

export default leadGenRoute;
