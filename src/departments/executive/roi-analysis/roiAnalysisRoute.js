// roiRoute.js
import express from "express";
import { getRoiAnalysis } from "./roiAnalysisController.js";
const roiRoute = express.Router();

/**
 * @swagger
 * /api/v1/executive/roi-analysis:
 *   get:
 *     summary: Get ROI analysis for invoice automation
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: vendor
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Vendor A, Vendor B, Vendor C, Vendor D, Vendor E]
 *         description: Filter by vendor (comma separated)
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
 *         description: ROI analysis data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                 roiTrends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       avgProcessingCost:
 *                         type: number
 *                       avgProcessingTime:
 *                         type: number
 *                       avgExceptionRate:
 *                         type: number
 *                       roi:
 *                         type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
roiRoute.get("/", getRoiAnalysis);

export default roiRoute;
