import express from "express";
import Jwt from "../../../auth/jwt.js";
import { getInsightAdoptionAnalysis } from "./insightAdoptionController.js";

const insightAdoptionRoute = express.Router();

/**
 * @swagger
 * /api/v1/specialized/insight-adoption:
 *   get:
 *     summary: Get Insight Adoption analysis for reports
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: insightName
 *         required: false
 *         schema:
 *           type: string
 *           enum: [
 *             Market Trend Report,
 *             Customer Behavior Analysis,
 *             Product Usage Insights,
 *             Sales Forecast Q3,
 *             Competitive Analysis 2025,
 *             Quarterly Revenue Report,
 *             Customer Satisfaction Survey,
 *             Marketing Campaign Analysis,
 *             Operational Efficiency Report,
 *             R&D Project Insights
 *           ]
 *         description: Filter by insight name(s), comma separated
 *       - in: query
 *         name: department
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Marketing, Sales, Finance, Operations, R&D]
 *         description: Filter by department(s), comma separated
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Insight Adoption analysis data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalInsights:
 *                       type: number
 *                     totalViews:
 *                       type: number
 *                     totalDownloads:
 *                       type: number
 *                     overallAdoptionRate:
 *                       type: number
 *                     avgViewsPerInsight:
 *                       type: number
 *                     avgDownloadsPerInsight:
 *                       type: number
 *                 adoptionTrends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       totalViews:
 *                         type: number
 *                       totalDownloads:
 *                         type: number
 *                       avgAdoptionRate:
 *                         type: number
 *                       totalInsights:
 *                         type: number
 *                 departmentBreakdown:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       views:
 *                         type: number
 *                       downloads:
 *                         type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       recordId:
 *                         type: string
 *                       insightName:
 *                         type: string
 *                       department:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       views:
 *                         type: number
 *                       downloads:
 *                         type: number
 *                       adoptionScore:
 *                         type: number
 *       500:
 *         description: Server error
 */
insightAdoptionRoute.get("/", getInsightAdoptionAnalysis);

export default insightAdoptionRoute;
