// routes/updateFrequencyRoutes.js
import express from 'express';
import { getFreshnessAnalytics } from './updateFrequencyController.js';

const updateFrequencyRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/updateFrequency:
 *   get:
 *     tags: [Analytics]
 *     summary: Track and count updates made to an article after initial publication
 *     parameters:
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *           enum: [Alice Johnson, Bob Smith, Charlie Brown, Diana Prince]
 *         description: Filter by author
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *           enum: [Politics, Sports, Technology, Entertainment]
 *         description: Filter by section

 *     responses:
 *       200:
 *         description: Successfully retrieved update frequency analytics
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Server error during processing
 */

updateFrequencyRouter.get('/', getFreshnessAnalytics);

export default updateFrequencyRouter;
