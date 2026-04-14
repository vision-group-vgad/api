// costOptimizationRoute.js
import express from "express";
import { getCostOptimization } from "./costOptimizationController.js";
import Jwt from "../../../auth/jwt.js";

const costOptimizationRoute = express.Router();

/**
 * @swagger
 * /api/v1/executive/cost-optimization:
 *   get:
 *     summary: Get departmental spend vs budget and legal spend trends
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: department
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Sales, Operations, Marketing, Finance, HR, IT, Legal]
 *         description: Filter by department (comma separated)
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
 *         description: Cost optimization data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       department:
 *                         type: string
 *                       budget:
 *                         type: number
 *                       actualSpend:
 *                         type: number
 *                       variancePercent:
 *                         type: number
 *                       legalSpend:
 *                         type: number
 *                 legalSpendTrend:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       value:
 *                         type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
costOptimizationRoute.get("/",getCostOptimization);

export default costOptimizationRoute;
