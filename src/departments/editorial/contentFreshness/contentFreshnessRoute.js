// routes/freshnessRoutes.js
import express from 'express';
import Jwt from '../../../auth/jwt.js';
import { getFreshnessAnalytics } from './contentFreshnessController.js';

const contentFreshnessRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/contentFreshness:
 *   get:
 *     summary: Get freshness analytics (all metrics in one endpoint)
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: now
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           default: '2025-05-01T16:30:00'
 *         description: Reference date/time for calculations (defaults to 2025-05-01T16:30:00)
 *       - in: query
 *         name: n
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of articles or hours used in API URL and calculations (default 20)
 *       - in: query
 *         name: metric
 *         required: true
 *         schema:
 *           type: string
 *           enum: [percentage, heatmap, averageAge, distribution, all articles]
 *         description: Choose the metric to retrieve
 *     responses:
 *       200:
 *         description: Returns the selected freshness metric along with explanation
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     metric:
 *                       type: string
 *                       example: percentage
 *                     data:
 *                       type: object
 *                       properties:
 *                         percentage:
 *                           type: string
 *                           example: "75.00"
 *                     explanation:
 *                       type: string
 *                       example: "This percentage shows the proportion of articles published within the last 48 hours compared to all articles retrieved in the specified date range. A higher percentage means more recent content overall."
 *                 - type: object
 *                   properties:
 *                     metric:
 *                       type: string
 *                       example: heatmap
 *                     data:
 *                       type: object
 *                       additionalProperties:
 *                         type: object
 *                         additionalProperties:
 *                           type: object
 *                           properties:
 *                             count:
 *                               type: integer
 *                               example: 3
 *                             recencyHours:
 *                               type: integer
 *                               example: 46
 *                     explanation:
 *                       type: string
 *                       example: "This heatmap shows the number of articles published per section (category) on each date. 'count' represents the total articles published that day, while 'recencyHours' indicates how recently (in hours) the freshest article was published relative to the reference date."
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */

contentFreshnessRouter.get('/', Jwt.verifyToken, getFreshnessAnalytics);

export default contentFreshnessRouter;
