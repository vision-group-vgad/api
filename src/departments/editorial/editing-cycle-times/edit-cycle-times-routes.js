import EditCycTimesController from "./EditingCycleTimesController.js";
import express from "express";
import {
  validateRange,
  validateYear,
} from "../../../utils/common/common-functionalities.js";

const editCycTimesRouter = express.Router();
const editCycTimesController = new EditCycTimesController();

/**
 * @swagger
 * /api/v1/editorial/editing-cycle-times/annual:
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
editCycTimesRouter.get("/annual", async (req, res) => {
  const { year } = req.query;

  validateYear(year, res);

  try {
    const results = await editCycTimesController.getAnnualData(year);
    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

/**
 * @swagger
 * /api/v1/editorial/editing-cycle-times/in-range:
 *   get:
 *     summary: Get editing cycle time data for a specific range of time.
 *     description: Returns editing cycle times for a specific range of time.
 *     tags:
 *       - Editing Cycle Times
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
 *         description: Editing cycle time data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageUpdates:
 *                   type: integer
 *                   example: 2
 *                 articleCount:
 *                   type: integer
 *                   example: 10
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       pageTitle:
 *                         type: string
 *                         example: "Bunyoro bishop condemns alcoholism"
 *                       author:
 *                         type: string
 *                         example: "null null"
 *                       streamName:
 *                         type: string
 *                         example: "New Vision Website"
 *                       platform:
 *                         type: string
 *                         example: "web"
 *                       averageDuration:
 *                         type: string
 *                         example: "00:10:21"
 *                       percentageScrolled:
 *                         type: number
 *                         format: float
 *                         example: 10
 *                       bounceRate:
 *                         type: number
 *                         format: float
 *                         example: 1
 *                       createdOn:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-01T16:50:02Z"
 *                       publishedOn:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-01T19:57:00Z"
 *                       editingDuration:
 *                         type: integer
 *                         example: 186
 *                       editor:
 *                         type: string
 *                         example: "Douglas Mubiru"
 *                       updatesCount:
 *                         type: integer
 *                         example: 0
 *                       updateLogs:
 *                         type: array
 *                         items:
 *                           type: object
 *                         example: []
 *       400:
 *         description: Missing required fields; start-date and end-date
 *       404:
 *         description: No data found for the requested range. Only Jan–April 2025 is available.
 */
editCycTimesRouter.get("/in-range", async (req, res) => {
  let { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await editCycTimesController.getInRangeData(
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

export default editCycTimesRouter;
