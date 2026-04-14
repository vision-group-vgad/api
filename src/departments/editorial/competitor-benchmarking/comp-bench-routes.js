import CompetitorBenchController from "./CompBenchmarkController.js";
import express from "express";
import { validateRange } from "../../../utils/common/common-functionalities.js";

const compBenchController = new CompetitorBenchController();
const compBenchRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/comp-bench/in-range:
 *   get:
 *     tags:
 *       - Competitor Benchmarking
 *     summary: Get competitor benchmarking metrics within a date range
 *     description: |
 *       Retrieves competitor performance metrics (articles, views, engagement, etc.)
 *       for all competitors within the specified date range.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date of the range in YYYY-MM-DD format.
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date of the range in YYYY-MM-DD format.
 *     responses:
 *       200:
 *         description: Successfully retrieved competitor metrics.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   competitor:
 *                     type: string
 *                     example: Daily Monitor
 *                   totalArticles:
 *                     type: integer
 *                     example: 124
 *                   avgViews:
 *                     type: integer
 *                     example: 3421
 *                   avgEngagement:
 *                     type: integer
 *                     example: 512
 *                   socialMediaReach:
 *                     type: integer
 *                     example: 185000
 *                   totalTraffic:
 *                     type: integer
 *                     example: 424000
 *                   engagementRate:
 *                     type: number
 *                     format: float
 *                     example: 12.5
 *                   articleCategoryBreakdown:
 *                     type: object
 *                     properties:
 *                       Politics:
 *                         type: integer
 *                         example: 42
 *                       Sports:
 *                         type: integer
 *                         example: 30
 *                       Entertainment:
 *                         type: integer
 *                         example: 28
 *                       Business:
 *                         type: integer
 *                         example: 24
 *                   monthlyTrafficTrend:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         month:
 *                           type: string
 *                           example: Jan
 *                         year:
 *                           type: integer
 *                           example: 2025
 *                         traffic:
 *                           type: integer
 *                           example: 35000
 *             example:
 *               - competitor: Daily Monitor
 *                 totalArticles: 124
 *                 avgViews: 3421
 *                 avgEngagement: 512
 *                 socialMediaReach: 185000
 *                 totalTraffic: 424000
 *                 engagementRate: 12.5
 *                 articleCategoryBreakdown:
 *                   Politics: 42
 *                   Sports: 30
 *                   Entertainment: 28
 *                   Business: 24
 *                 monthlyTrafficTrend:
 *                   - month: Jan
 *                     year: 2025
 *                     traffic: 35000
 *                   - month: Feb
 *                     year: 2025
 *                     traffic: 42000
 *                   - month: Mar
 *                     year: 2025
 *                     traffic: 46000
 *                   - month: Apr
 *                     year: 2025
 *                     traffic: 38000
 *                   - month: May
 *                     year: 2025
 *                     traffic: 50000
 *                   - month: Jun
 *                     year: 2025
 *                     traffic: 53000
 *               - competitor: The Observer
 *                 totalArticles: 98
 *                 avgViews: 2980
 *                 avgEngagement: 480
 *                 socialMediaReach: 150000
 *                 totalTraffic: 380000
 *                 engagementRate: 14.2
 *                 articleCategoryBreakdown:
 *                   Politics: 35
 *                   Sports: 25
 *                   Entertainment: 22
 *                   Business: 16
 *                 monthlyTrafficTrend:
 *                   - month: Jan
 *                     year: 2025
 *                     traffic: 30000
 *                   - month: Feb
 *                     year: 2025
 *                     traffic: 36000
 *                   - month: Mar
 *                     year: 2025
 *                     traffic: 41000
 *                   - month: Apr
 *                     year: 2025
 *                     traffic: 37000
 *                   - month: May
 *                     year: 2025
 *                     traffic: 45000
 *                   - month: Jun
 *                     year: 2025
 *                     traffic: 50000
 *       400:
 *         description: Invalid date range or missing parameters.
 *       500:
 *         description: Server error.
 */
compBenchRouter.get("/in-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await compBenchController.getInRangeCompMetrics(
      startDate,
      endDate
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

export default compBenchRouter;
