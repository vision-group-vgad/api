import express from "express";
import ReadershipTrendController from "./ReadershipTrendController.js";
import { extractYearFromDate } from "../../../utils/common/common-functionalities.js";
import Jwt from "../../../auth/jwt.js";

const readershipController = new ReadershipTrendController();
const readershipRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/readership-trends/annual:
 *   get:
 *     summary: Get annual readership trends
 *     description: Returns readership analytics for the given year. Currently only supports data for the year 2025.
 *     tags:
 *       - Editorial Readership Trends
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year for which readership data is requested.
 *     responses:
 *       200:
 *         description: Readership trends for the given year
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articleTitle:
 *                   type: string
 *                   example: "Understanding AI in 2025"
 *                 author:
 *                   type: string
 *                   example: "Sim Sim"
 *                 noOfReaders:
 *                   type: integer
 *                   example: 1200
 *                 noOfUniqueReaders:
 *                   type: integer
 *                   example: 950
 *                 demographics:
 *                   type: object
 *                   properties:
 *                     males:
 *                       type: integer
 *                       example: 600
 *                     females:
 *                       type: integer
 *                       example: 600
 *                     locations:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Uganda", "Kenya", "Rwanda"]
 *                 referrerSource:
 *                   type: string
 *                   example: "google.com"
 *                 bounceRate:
 *                   type: number
 *                   format: float
 *                   example: 43.5
 *                 averageDuration:
 *                   type: string
 *                   example: "3m 20s"
 *                 percentageScrolled:
 *                   type: number
 *                   format: float
 *                   example: 78.2
 *       400:
 *         description: Missing required field, year
 *       404:
 *         description: No data found for the requested year
 */
readershipRouter.get("/annual", Jwt.verifyToken, async (req, res) => {
  let { year } = req.query;
  year = parseInt(year);

  if (!year) {
    return res.status(400).json({
      message: "Missing required field: year.",
    });
  }
  if (year > 2025 || year < 2025) {
    return res.status(404).json({
      message: "No data found for that year. Only 2025 data is available.",
    });
  }
  const results = await readershipController.getAnnualReadershipTrends(year);
  res.json(results);
});

/**
 * @swagger
 * /api/v1/editorial/readership-trends/in-range:
 *   get:
 *     summary: Get readership trends in a date range
 *     description: Returns readership data between the specified `startDate` and `endDate`. Only data from Jan–April 2025 is available.
 *     tags:
 *       - Editorial Readership Trends
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
 *         description: Readership trends between the specified dates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   articleTitle:
 *                     type: string
 *                     example: "How to Build Modern Web Apps"
 *                   author:
 *                     type: string
 *                     example: "Jim Tim"
 *                   noOfReaders:
 *                     type: integer
 *                     example: 620
 *                   noOfUniqueReaders:
 *                     type: integer
 *                     example: 500
 *                   demographics:
 *                     type: object
 *                     properties:
 *                       males:
 *                         type: integer
 *                         example: 310
 *                       females:
 *                         type: integer
 *                         example: 310
 *                       locations:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Uganda", "Kenya"]
 *                   referrerSource:
 *                     type: string
 *                     example: "twitter.com"
 *                   bounceRate:
 *                     type: number
 *                     format: float
 *                     example: 40.2
 *                   averageDuration:
 *                     type: string
 *                     example: "2m 45s"
 *                   percentageScrolled:
 *                     type: number
 *                     format: float
 *                     example: 84.1
 *       400:
 *         description: Missing required fields; start-date and end-date
 *       404:
 *         description: No data found for the requested range. Only Jan–April 2025 is available.
 */
readershipRouter.get("/in-range", Jwt.verifyToken, async (req, res) => {
  let { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      message: "Missing required fields: start-date and end-date.",
    });
  }
  if (
    extractYearFromDate(startDate) > 2025 ||
    extractYearFromDate(endDate) < 2025
  ) {
    return res.status(404).json({
      message:
        "No data found for that year. Only 2025 Jan - April, data is available.",
    });
  }
  const results = await readershipController.getInRangeReadershipTrends(
    startDate,
    endDate
  );
  res.json(results);
});
export default readershipRouter;
