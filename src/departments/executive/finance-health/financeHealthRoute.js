// financialHealthRoute.js
import express from "express";
import { getFinancialHealth } from "./financeHealthController.js";

const financialHealthRoute = express.Router();

/**
 * @swagger
 * /api/v1/executive/financial-health:
 *   get:
 *     summary: Get financial health metrics for CFO/CEO dashboard
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: department
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Sales, Operations, Marketing, Finance, HR, IT]
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
 *         description: Financial health data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     netProfit:
 *                       type: number
 *                     grossProfit:
 *                       type: number
 *                     cashFlowRunwayMonths:
 *                       type: number
 *                     cashFlowByActivity:
 *                       type: object
 *                       properties:
 *                         operating:
 *                           type: number
 *                         investing:
 *                           type: number
 *                         financing:
 *                           type: number
 *                     netProfitTrend:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                           value:
 *                             type: number
 *                     grossProfitTrend:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                           value:
 *                             type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
financialHealthRoute.get("/", getFinancialHealth);

export default financialHealthRoute;
