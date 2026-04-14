import express from 'express';
import Jwt from '../../../auth/jwt.js';
import { getBacklogAnalytics } from './backlogAnalyticsController.js';

const backlogAnalyticsRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/backlogAnalytics:
 *   get:
 *     summary: Get backlog analytics (KPI, stacked bar, trend)
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: now
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           default: '2025-05-01T16:30:00'
 *         description: Reference date for backlog calculations
 *       - in: query
 *         name: n
 *         required: false
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of articles or time units to fetch from API (defaults to 20)
 *       - in: query
 *         name: metric
 *         required: true
 *         schema:
 *           type: string
 *           enum: [backlogDetails, staleReadyArticles,bottlenecks]
 *         description: Type of backlog metric to retrieve
 *     responses:
 *       200:
 *         description: Returns the backlog metric result
 *       400:
 *         description: Invalid metric query
 *       500:
 *         description: Internal server error
 */

backlogAnalyticsRouter.get('/', getBacklogAnalytics);

export default backlogAnalyticsRouter;
