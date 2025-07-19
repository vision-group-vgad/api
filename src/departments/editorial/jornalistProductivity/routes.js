import express from "express";
import { getProductivity } from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/editorial/journalist-productivity:
 *   get:
 *     summary: Get productivity metrics per journalist
 *     description: Combines article metadata and session analytics to return article count, bounce rate, scroll depth, and reading time per journalist.
 *     tags:
 *       - Journalist Productivity
 *     responses:
 *       200:
 *         description: A list of journalist productivity metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   author:
 *                     type: string
 *                   articleCount:
 *                     type: integer
 *                   avgDuration:
 *                     type: number
 *                   avgBounceRate:
 *                     type: number
 *                   avgScrollDepth:
 *                     type: number
 *                   categories:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Server error
 */

router.get("/", getProductivity);

export default router;
