import MarketShareController from "./MarketShareController.js";
import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const mktShareController = new MarketShareController();
const mktShareRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Market Share
 *   description: API endpoints for analyzing Vision Group market share
 */

/**
 * @swagger
 * /api/v1/executive/market-share/in-range:
 *   get:
 *     summary: Get market share analytics for a given date range
 *     description: Returns filtered market share data and summary including overall organization market share, best/worst regions, best/worst business units, and best gender.
 *     tags: [Market Share]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date of the range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date of the range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Market share data successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: Filtered weekly market share data
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       marketSize:
 *                         type: integer
 *                       sales:
 *                         type: integer
 *                       organizationMarketShare:
 *                         type: number
 *                       genderSegmentation:
 *                         type: object
 *                         properties:
 *                           male:
 *                             type: number
 *                           female:
 *                             type: number
 *                       regions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             marketSharePercent:
 *                               type: number
 *                       businessUnits:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             marketSharePercent:
 *                               type: number
 *                       competitors:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             marketSharePercent:
 *                               type: number
 *                 summary:
 *                   type: object
 *                   properties:
 *                     overall_market_share:
 *                       type: number
 *                       description: Average organization market share across filtered data
 *                     best_region:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         avgShare:
 *                           type: number
 *                     worst_region:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         avgShare:
 *                           type: number
 *                     best_unit:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         avgShare:
 *                           type: number
 *                     worst_unit:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         avgShare:
 *                           type: number
 *                     best_gender:
 *                       type: object
 *                       properties:
 *                         bestGender:
 *                           type: string
 *                         avgShare:
 *                           type: number
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

mktShareRouter.get("/in-range", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate);

  try {
    const results = await mktShareController.getInRangeAnalytics(
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

export default mktShareRouter;
