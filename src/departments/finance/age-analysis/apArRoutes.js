// routes/apArRoutes.js
import express from 'express';
import Jwt from '../../../auth/jwt.js';
import { getApArAging } from './apArController.js';

const ageRouter = express.Router();

/**
 * @swagger
 * /api/v1/ap-ar-aging:
 *   get:
 *     summary: Get AP/AR aging analysis
 *     tags: [Finance]
 *     description: Returns AP/AR records grouped into aging buckets (0–30, 31–60, 61–90, 90+ days)
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter records from this date (inclusive)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter records up to this date (inclusive)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of records to process
 *     responses:
 *       200:
 *         description: Aging data grouped by time buckets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 agingBuckets:
 *                   type: object
 *                   properties:
 *                     0–30 Days:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AgingEntry'
 *                     31–60 Days:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AgingEntry'
 *                     61–90 Days:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AgingEntry'
 *                     90+ Days:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AgingEntry'
 *       500:
 *         description: Failed to retrieve AP/AR aging data
 */

/**
 * @route GET /api/v1/ap-ar-aging
 */

ageRouter.get('/',Jwt.verifyToken, getApArAging);

export default ageRouter;