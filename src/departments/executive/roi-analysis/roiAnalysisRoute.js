// roiRoute.js
import express from "express";
import Jwt from "../../../auth/jwt.js";
import { getRoiAnalysis } from "./roiAnalysisController.js";

const roiRoute = express.Router();

/**
 * @swagger
 * /api/v1/executive/roi-analysis:
 *   get:
 *     summary: Get ROI analysis for business projects
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Sales and Marketing, Research and Development, Operations, IT and Infrastructure, Human Resources, Customer Support]
 *         description: Filter by project category (comma separated)
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter projects starting from this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter projects ending before this date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: ROI analysis data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalRecords:
 *                       type: integer
 *                     totalInvestment:
 *                       type: number
 *                     totalRevenue:
 *                       type: number
 *                     totalProfit:
 *                       type: number
 *                     roi:
 *                       type: number
 *                 roiTrends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       avgInvestment:
 *                         type: number
 *                       avgRevenue:
 *                         type: number
 *                       avgProfit:
 *                         type: number
 *                       roi:
 *                         type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       investment:
 *                         type: number
 *                       revenue:
 *                         type: number
 *                       category:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *       500:
 *         description: Server error
 */
roiRoute.get("/",  getRoiAnalysis);

export default roiRoute;
