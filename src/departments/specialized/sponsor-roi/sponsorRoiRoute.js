import express from "express";
import { getSponsorAnalysis } from "./sponsorRoiController.js";

const sponsorRoute = express.Router();

/**
 * @swagger
 * /api/v1/specialized/sponsor-roi:
 *   get:
 *     summary: Get Sponsor ROI analysis
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: sponsor
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Acme Corp, Globex Inc, Initech, Umbrella Corp, Soylent Co]
 *         description: Filter by sponsor name (comma separated)
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: string
 *           format: year
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Sponsor ROI analysis data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalSponsors:
 *                       type: number
 *                     totalRevenue:
 *                       type: number
 *                     totalInvestment:
 *                       type: number
 *                     totalAcquisitions:
 *                       type: number
 *                     ROI:
 *                       type: number
 *                     CPA:
 *                       type: number
 *                 monthlyTrends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       totalSponsors:
 *                         type: number
 *                       totalRevenue:
 *                         type: number
 *                       totalInvestment:
 *                         type: number
 *                       totalAcquisitions:
 *                         type: number
 *                       ROI:
 *                         type: number
 *                       CPA:
 *                         type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sponsorName:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       revenue:
 *                         type: number
 *                       investment:
 *                         type: number
 *                       acquisitions:
 *                         type: number
 *                       ROI:
 *                         type: number
 *                       CPA:
 *                         type: number
 *                       marketingChannels:
 *                         type: object
 *                         additionalProperties:
 *                           type: number
 *       500:
 *         description: Server error
 */
sponsorRoute.get("/", getSponsorAnalysis);

export default sponsorRoute;
