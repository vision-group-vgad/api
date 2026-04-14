import express from "express";
import BreakingNewsController from "./controller.js";

const router = express.Router();

// /**
//  * @swagger
//  * /api/v1/editorial/breakingNews:
//  *   get:
//  *     summary: Get breaking news traction data
//  *     description: Fetches breaking news articles based on page views and engagement.
//  *     tags:
//  *       - Breaking News Traction
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: date
//  *       - in: query
//  *         name: endDate
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: date
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: offset
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: List of breaking news articles with traction data
//  */
router.get("/", BreakingNewsController.getBreakingNewsTraction);

// /**
//  * @swagger
//  * /api/v1/editorial/breakingNews/metrics:
//  *   get:
//  *     summary: Get aggregated metrics for breaking news
//  *     tags:
//  *       - Breaking News Traction
//  *     parameters:
//  *       - in: query
//  *         name: startDate
//  *         schema:
//  *           type: string
//  *           format: date
//  *       - in: query
//  *         name: endDate
//  *         schema:
//  *           type: string
//  *           format: date
//  *     responses:
//  *       200:
//  *         description: Aggregated metrics for breaking news
//  */
router.get("/metrics", BreakingNewsController.getBreakingNewsMetrics);

// /**
//  * @swagger
//  * /api/v1/editorial/breakingNews/realtime:
//  *   get:
//  *     summary: Get real-time breaking news data
//  *     tags:
//  *       - Breaking News Traction
//  *     responses:
//  *       200:
//  *         description: Real-time article engagement for currently trending content
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  */
router.get("/realtime", BreakingNewsController.getRealTimeBreakingNews);

export default router;
