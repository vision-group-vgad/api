// routes/deadlineComplianceRoutes.js
import express from "express";
import { getDeadlineCompliance } from "./deadlineComplianceController.js";

const deadlineCompliance = express.Router();

/**
 * @swagger
 * /api/v1/editorial/deadline-compliance:
 *   get:
 *     summary: Get editorial deadline compliance data, optionally filtered by status
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [early, on time, late]
 *         description: Optional filter to return only articles with the specified status
 *     responses:
 *       200:
 *         description: Returns deadline compliance data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalArticles:
 *                   type: integer
 *                 onTimeArticles:
 *                   type: integer
 *                 earlyArticles:
 *                   type: integer
 *                 lateArticles:
 *                   type: integer
 *                 earlyPercentage:
 *                   type: string
 *                 onTimePercentage:
 *                   type: string
 *                 latePercentage:
 *                   type: string
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       deadlineDate:
 *                         type: string
 *                         format: date-time
 *                       publishedAt:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                         enum: [early, on time, late]
 *       500:
 *         description: Server error
 */
deadlineCompliance.get("/", getDeadlineCompliance);

export default deadlineCompliance;
