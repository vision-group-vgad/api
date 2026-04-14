import express from "express";
import SocialSentimentController from "./SocialSentimentController.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";

const socSentController = new SocialSentimentController();
const socialSentimentRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/social-sentiment/in-range:
 *   get:
 *     tags:
 *       - Social Sentiment
 *     summary: Get social sentiment data within a date range
 *     description: Retrieve social sentiment data for a given date range within the year 2025.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-06-01
 *         required: true
 *         description: The start date of the range (must be within 2025)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-06-30
 *         required: true
 *         description: The end date of the range (must be within 2025)
 *     responses:
 *       200:
 *         description: Successfully retrieved annual sentiment data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-12-28"
 *                       mentions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             comment:
 *                               type: string
 *                               example: "I rely on Bukedde for daily news – thank you Vision Group!"
 *                             platform:
 *                               type: string
 *                               example: "tiktok"
 *                             date:
 *                               type: string
 *                               format: date
 *                               example: "2025-12-28"
 *                       ratings:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             rate:
 *                               type: number
 *                               format: float
 *                               example: 9.7
 *                             platform:
 *                               type: string
 *                               example: "tiktok"
 *                             date:
 *                               type: string
 *                               format: date
 *                               example: "2025-12-28"
 *                 summary:
 *                   type: object
 *                   properties:
 *                     avgDailyMention:
 *                       type: number
 *                       example: 0.3
 *                     avgMonthlyMention:
 *                       type: number
 *                       example: 9
 *                     avgDailyRating:
 *                       type: number
 *                       example: 0.3
 *                     avgMonthlyRating:
 *                       type: number
 *                       example: 9
 *                     topMetionPlatform:
 *                       type: string
 *                       example: "tiktok"
 *                     topRatingPlatform:
 *                       type: string
 *                       example: "tiktok"
 *       400:
 *         description: Missing required fields startDate or endDate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields; startDate and endDate
 *       404:
 *         description: Date range outside of supported 2025 range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data for only 2025 January - December is available
 */
socialSentimentRouter.get("/in-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate);

  try {
    const results = socSentController.getInRangeSentiments(startDate, endDate);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

export default socialSentimentRouter;
