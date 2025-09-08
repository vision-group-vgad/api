import express from "express";
import Jwt from "../../../auth/jwt.js";
import { getPipelineAnalysis } from "./pipelineMetricsController.js";

const pipelineRoute = express.Router();

/**
 * @swagger
 * /api/v1/finance/pipeline-metrics:
 *   get:
 *     summary: Get financial data pipeline analysis
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: sourceSystem
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ERP, CRM, HRIS, Billing, Payments, DataWarehouse]
 *         description: Filter by source system (comma separated)
 *       - in: query
 *         name: pipelineJob
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Daily ETL, Incremental Load, API Sync, Reconciliation, Reporting Extract]
 *         description: Filter by pipeline job (comma separated)
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
 *         description: Pipeline metrics analysis data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalRuns:
 *                       type: number
 *                     totalExpected:
 *                       type: number
 *                     totalLoaded:
 *                       type: number
 *                     totalErrors:
 *                       type: number
 *                     totalDropped:
 *                       type: number
 *                     totalFixes:
 *                       type: number
 *                     avgLatency:
 *                       type: number
 *                     loadSuccessRate:
 *                       type: number
 *                     errorRate:
 *                       type: number
 *                     droppedPct:
 *                       type: number
 *                     manualFixPct:
 *                       type: number
 *                 pipelineTrends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       runs:
 *                         type: number
 *                       expected:
 *                         type: number
 *                       loaded:
 *                         type: number
 *                       errors:
 *                         type: number
 *                       dropped:
 *                         type: number
 *                       fixes:
 *                         type: number
 *                       avgLatency:
 *                         type: number
 *                       loadSuccessRate:
 *                         type: number
 *                       errorRate:
 *                         type: number
 *                       droppedPct:
 *                         type: number
 *                       manualFixPct:
 *                         type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       sourceSystem:
 *                         type: string
 *                       pipelineJob:
 *                         type: string
 *                       recordsExpected:
 *                         type: number
 *                       recordsLoaded:
 *                         type: number
 *                       errors:
 *                         type: number
 *                       dropped:
 *                         type: number
 *                       latency:
 *                         type: number
 *                       manualFixes:
 *                         type: number
 *                       loadSuccessRate:
 *                         type: number
 *                       errorRate:
 *                         type: number
 *                       droppedPct:
 *                         type: number
 *                       manualFixPct:
 *                         type: number
 *                       throughput:
 *                         type: number
 *       500:
 *         description: Server error
 */
pipelineRoute.get("/",  getPipelineAnalysis);

export default pipelineRoute;
