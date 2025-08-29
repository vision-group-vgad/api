// liquidityRatiosRoute.js
import express from "express";
// import Jwt from "../../../auth/jwt.js";
import { getLiquidityRatios } from "./liquidityRatiosController.js";

const liquidityRatiosRoute = express.Router();

/**
 * @swagger
 * /api/v1/executive/liquidity-ratios:
 *   get:
 *     summary: Get liquidity and leverage ratios for CFO/CEO dashboard
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: businessUnit
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Sales, Operations, Marketing, Finance, HR, IT]
 *         description: Filter by business unit (comma separated)
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
 *         description: Liquidity ratio data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     latest:
 *                       type: object
 *                       properties:
 *                         currentRatio:
 *                           type: object
 *                           properties:
 *                             value:
 *                               type: number
 *                             status:
 *                               type: string
 *                         quickRatio:
 *                           type: object
 *                           properties:
 *                             value:
 *                               type: number
 *                             status:
 *                               type: string
 *                         cashRatio:
 *                           type: object
 *                           properties:
 *                             value:
 *                               type: number
 *                             status:
 *                               type: string
 *                         debtToEquity:
 *                           type: object
 *                           properties:
 *                             value:
 *                               type: number
 *                             status:
 *                               type: string
 *                     trends:
 *                       type: object
 *                       properties:
 *                         currentRatioTrend:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               month:
 *                                 type: string
 *                               value:
 *                                 type: number
 *                         quickRatioTrend:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               month:
 *                                 type: string
 *                               value:
 *                                 type: number
 *                         cashRatioTrend:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               month:
 *                                 type: string
 *                               value:
 *                                 type: number
 *                         debtToEquityTrend:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               month:
 *                                 type: string
 *                               value:
 *                                 type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
liquidityRatiosRoute.get("/",  getLiquidityRatios);

export default liquidityRatiosRoute;
