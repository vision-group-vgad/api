import express from "express";
import { getVisualUsage } from "./controller.js";
const router = express.Router();

/**
 * @swagger
 * /api/v1/editorial/visual-usage:
 *   get:
 *     summary: Track visual asset usage
 *     description: Returns where and how often each visual asset is used across articles, platforms, and authors.
 *     tags:
 *       - Visual Asset Usage
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional end date (YYYY-MM-DD)
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Optional author filter
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *         description: Optional platform filter (e.g. Web, Mobile, App)
 *     responses:
 *       200:
 *         description: Visual usage data
 *       500:
 *         description: Internal server error
 */
router.get("/", getVisualUsage);

export default router;
