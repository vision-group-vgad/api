import EditCycTimesController from "./EditingCycleTimesController.js";
import express from "express";
import Jwt from "../../../auth/jwt.js";

const editCycTimesRouter = express.Router();
const editCycTimesController = new EditCycTimesController();

/**
 * @swagger
 * /api/v1/editorial/editing-cycle-times:
 *   get:
 *     summary: Get editing cycle time data for a specific year
 *     description: Returns editing cycle times for the year 2025. Other years return a 404.
 *     tags:
 *       - Editing Cycle Times
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year to fetch editing cycle time data for (only 2025 is supported)
 *     responses:
 *       200:
 *         description: Successfully retrieved editing cycle time data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageUpdates:
 *                   type: number
 *                   example: 2
 *                 articleCount:
 *                   type: integer
 *                   example: 300
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       pageTitle:
 *                         type: string
 *                         example: "Justice Mugambe found guilty of UK modern slavery offences - New Vision Official"
 *                       author:
 *                         type: string
 *                         example: "Jessie"
 *                       streamName:
 *                         type: string
 *                         example: "New Vision Website"
 *                       platform:
 *                         type: string
 *                         example: "web"
 *                       averageDuration:
 *                         type: string
 *                         example: "19:17:23"
 *                       bounceRate:
 *                         type: string
 *                         example: "1"
 *                       authoredOn:
 *                         type: string
 *                         format: date
 *                         example: "2025-02-03"
 *                       updatesCount:
 *                         type: integer
 *                         example: 3
 *                       updateLogs:
 *                         type: array
 *                         items:
 *                           type: string
 *                           format: date
 *                           example: "2025-04-26"
 *       400:
 *         description: Missing required query parameter `year`
 *       404:
 *         description: Data for the provided year is not available
 *       500:
 *         description: Internal server error
 */
editCycTimesRouter.get("/", Jwt.verifyToken, async (req, res) => {
  const { year } = req.query;

  if (!year) {
    res.status(400).json({ message: "Missing required field: year." });
  }
  if (parseInt(year) === 2025) {
    try {
      const results = await editCycTimesController.getAnnualData();
      res.json(results);
    } catch (error) {
      res.status(500).json({
        message: `${error.message}`,
      });
    }
  } else {
    res.status(404).json({
      message: "No data found for that year, only 2025 data is available.",
    });
  }
});

/**
 * @swagger
 * /api/v1/editorial/editing-cycle-times/monthly:
 *   get:
 *     summary: Get editing cycle time data for a specific month
 *     description: Returns editing cycle times for a given month in 2025 (January to April only). Other months return a 404.
 *     tags:
 *       - Editing Cycle Times
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: The year to fetch editing cycle time data for
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 4
 *           example: 3
 *         description: The month to fetch editing cycle time data for (1 = January, 4 = April)
 *     responses:
 *       200:
 *         description: Successfully retrieved editing cycle time data for the specified month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articleCount:
 *                   type: integer
 *                   example: 75
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       pageTitle:
 *                         type: string
 *                         example: "Valentine's Day fever hits Kampala - Bukedde Online - Amawulire"
 *                       author:
 *                         type: string
 *                         example: "Sissie"
 *                       streamName:
 *                         type: string
 *                         example: "Bukedde Website"
 *                       platform:
 *                         type: string
 *                         example: "web"
 *                       averageDuration:
 *                         type: string
 *                         example: "46:52:39"
 *                       bounceRate:
 *                         type: string
 *                         example: "0"
 *                       authoredOn:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-26"
 *                       updatesCount:
 *                         type: integer
 *                         example: 2
 *                       updateLogs:
 *                         type: array
 *                         items:
 *                           type: string
 *                           format: date
 *                           example: "2025-02-05"
 *       400:
 *         description: Missing required fields `year` and/or `month`
 *       404:
 *         description: Data not available for the requested year/month combination
 *       500:
 *         description: Internal server error
 */
editCycTimesRouter.get("/monthly", Jwt.verifyToken, async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    res.status(400).json({ message: "Missing required fields: year & month" });
  }
  const convYear = parseInt(year);
  const convMonth = parseInt(month);
  const validYear = 2025;
  const maxValidMonth = 4;
  const minValidMonth = 1;
  if (
    convYear === validYear &&
    isValidMonth(convMonth, minValidMonth, maxValidMonth)
  ) {
    try {
      const results = await editCycTimesController.getMonthlyData(
        convYear,
        convMonth
      );
      res.json(results);
    } catch (error) {
      res.status(500).json({
        message: `${error.message}`,
      });
    }
  } else {
    res.status(404).json({
      message:
        "No data found for that time, only 2025 January to April data is available.",
    });
  }
});

const isValidMonth = (target, minValidMonth, maxValidMonth) => {
  return target <= maxValidMonth && target >= minValidMonth;
};

export default editCycTimesRouter;
