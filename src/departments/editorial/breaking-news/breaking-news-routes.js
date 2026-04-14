import Jwt from "../../../auth/jwt.js";
import express from "express";
import BreakingNewsController from "./BreakingNewsController.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";

const breakingNewsRouter = express.Router();
const brkNewsController = new BreakingNewsController();

/**
 * @swagger
 * /api/v1/editorial/breaking-news/in-range:
 *   get:
 *     summary: Get trending stories and monthly category performance in a given date range.
 *     description: Returns articles marked as breaking news along with performance data grouped by category and month.
 *     tags:
 *       - Breaking News Traction
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: List of trending articles and monthly category performance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trendingStories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Bunyoro bishop condemns alcoholism"
 *                       percentageScrolled:
 *                         type: string
 *                         example: "60%"
 *                       avgDuration:
 *                         type: string
 *                         example: "00:10:21"
 *                       bounceRate:
 *                         type: string
 *                         example: "30%"
 *                       publishedDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-01"
 *                       pageLocation:
 *                         type: string
 *                         example: "/news/bunyoro-bishop"
 *                       category:
 *                         type: string
 *                         example: "News"
 *                       author:
 *                         type: string
 *                         example: "John Doe"
 *                       streamName:
 *                         type: string
 *                         example: "New Vision Stream"
 *                       breakingNews:
 *                         type: boolean
 *                         example: false
 *                 monthlyCategoryPerformances:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "Jan 2025"
 *                       News:
 *                         type: integer
 *                         example: 3
 *                       Sports:
 *                         type: integer
 *                         example: 5
 *                       World:
 *                         type: integer
 *                         example: 2
 *       400:
 *         description: Missing required fields; start-date and end-date
 *       404:
 *         description: No data found for the requested range.
 */
breakingNewsRouter.get("/in-range", async (req, res) => {
  let { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await brkNewsController.getInRangeBreakingNews(
      startDate,
      endDate
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

export default breakingNewsRouter;
