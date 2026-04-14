import express from "express";
import { getCpuUsageTrends } from "./cpuUsageController.js";

const cpuUsageRoute = express.Router();

/**
 * @swagger
 * /api/v1/it/cpu-usage:
 *   get:
 *     summary: Get CPU and memory usage trends over months
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: errorType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Packet Loss, High Latency, Connection Drop, Hardware Failure, Other]
 *           description: Filter by error types (comma-separated)
 *       - in: query
 *         name: severity
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High, Critical]
 *           description: Filter by severity levels (comma-separated)
 *     responses:
 *       200:
 *         description: CPU & memory usage data per month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avgCpuPerMonth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       avgCpu:
 *                         type: string
 *                 avgMemoryPerMonth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       avgMemory:
 *                         type: string
 *                 totalRecords:
 *                   type: integer
 *       500:
 *         description: Server error
 */

cpuUsageRoute.get("/", getCpuUsageTrends);

export default cpuUsageRoute;
