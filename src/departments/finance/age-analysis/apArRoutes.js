// routes/apArRoutes.js
import express from 'express';
import { getApArAging } from './apArController.js';

const ageRouter = express.Router();

/**
 * @swagger
 * /api/v1/ap-ar-aging:
 *   get:
 *     summary: Get AP/AR aging analysis
 *     tags: [Finance]
 *     description: Returns AP/AR records grouped into aging buckets (0–30, 31–60, 61–90, 90+ days)
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


ageRouter.get('/', getApArAging);

export default ageRouter;