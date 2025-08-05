// routes/updateFrequencyRoutes.js
import express from 'express';
import Jwt from '../../../auth/jwt.js';
import { getFreshnessAnalytics } from './updateFrequencyController.js';

const updateFrequencyRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/updateFrequency:
 *   get:
 *     summary: Get update frequency analytics (bar, line, KPI, calendar)
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: now
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           default: '2025-05-01T16:30:00'
 *         description: Reference date/time for calculations
 *       - in: query
 *         name: n
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of articles to fetch for analytics (default is 20)
 *       - in: query
 *         name: metric
 *         required: true
 *         schema:
 *           type: string
 *           enum: [updateFrequencyBar, updateFrequencyLine, updateFrequencyKPI, updateFrequencyCalendar]
 *         description: Type of update frequency metric to compute
 *     responses:
 *       200:
 *         description: Successfully retrieved update frequency analytics
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Server error during processing
 */

updateFrequencyRouter.get('/', Jwt.verifyToken, getFreshnessAnalytics);

export default updateFrequencyRouter;
