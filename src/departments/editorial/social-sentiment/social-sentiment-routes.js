import express from "express";
import SocialSentimentController from "./SocialSentimentController.js";
import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import AccessController from "../../../auth/access-controller.js";

const socSentController = new SocialSentimentController();
const socialSentimentRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/social-sentiment/annual:
 *   get:
 *     tags:
 *       - Social Sentiment
 *     summary: Get annual social sentiment data
 *     description: Retrieve social sentiment data for a specific year. Only data for 2025 is available.
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2025
 *         required: true
 *         description: The year for which to retrieve social sentiment data (only 2025 supported)
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
 *         description: Missing required field, year
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required field, year
 *       404:
 *         description: Data for only 2025 is available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data for only 2025 is available
 */
socialSentimentRouter.get(
  "/annual",
  Jwt.verifyToken,
  AccessController.authorizeRole([
    "ROLE-42E64D",
    "ROLE-76951B",
    "ROLE-2DDC53",
    "ROLE-051A31",
  ]),
  async (req, res) => {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({
        message: `Missing required field: year`,
      });
    }

    const convYear = parseInt(year);
    if (convYear != 2025) {
      return res.status(404).json({
        message: `Data for only 2025 is available`,
      });
    }
    const results = socSentController.getAnnualSentiments(convYear);

    res.status(200).json(results);
  }
);

/**
 * @swagger
 * /api/v1/editorial/social-sentiment/monthly:
 *   get:
 *     tags:
 *       - Social Sentiment
 *     summary: Get monthly social sentiment data
 *     description: Retrieve social sentiment data for a specific month in 2025.
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2025
 *         required: true
 *         description: The year to retrieve data for (only 2025 supported)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 7
 *         required: true
 *         description: The month to retrieve data for (1 for January through 12 for December)
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
 *         description: Missing required fields year or month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields, year and month
 *       404:
 *         description: Data is only available for 2025 between January and December
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data for only 2025 January - December is available
 */
socialSentimentRouter.get("/monthly", Jwt.verifyToken, async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({
      message: `Missing required fields: year and month`,
    });
  }

  const convYear = parseInt(year);
  const convMonth = parseInt(month);
  const validYear = 2025;
  const validMinMonth = 1;
  const validMaxMonth = 12;

  if (
    convYear != validYear ||
    convMonth < validMinMonth ||
    convMonth > validMaxMonth
  ) {
    return res.status(404).json({
      message: `Data for only 2025 January - December is available`,
    });
  }
  const results = socSentController.getMontlySentiements(convYear, convMonth);

  res.status(200).json(results);
});

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
socialSentimentRouter.get(
  "/in-range",
  Jwt.verifyToken,
  AccessController.authorizeRole(),
  async (req, res) => {
    const { startDate, endDate } = req.query;

    validateRange(startDate, endDate);

    try {
      const results = socSentController.getInRangeSentiments(
        startDate,
        endDate
      );
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({
        message: `${error.message}`,
      });
    }
  }
);

export default socialSentimentRouter;
