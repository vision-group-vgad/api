import express from "express";
import ErrorRateController from "./ErrorRateController.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";

const errorController = new ErrorRateController();
const errorRateRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/error-rate/in-range:
 *   get:
 *     tags:
 *       - Editorial Error Rates
 *     summary: Get error rate data within a date range
 *     description: Retrieve error rate statistics between two dates
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The end date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successfully retrieved error rate data
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
 *                         example: "Government Passes New Law"
 *                       author:
 *                         type: string
 *                         example: "Jane Doe"
 *                       streamName:
 *                         type: string
 *                         example: "Politics"
 *                       platform:
 *                         type: string
 *                         example: "web"
 *                       createdOn:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-01T10:30:00Z"
 *                       publishedOn:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-07-02T15:00:00Z"
 *                       editingDuration:
 *                         type: string
 *                         example: "4h 30m"
 *                       editor:
 *                         type: string
 *                         example: "John Smith"
 *                       updates:
 *                         type: integer
 *                         example: 3
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-07-02"
 *       400:
 *         description: Missing required query parameter
 *       404:
 *         description: Data not found for given range
 *       500:
 *         description: Internal server error
 */
errorRateRouter.get("/in-range", async (req, res) => {
  let { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await errorController.getInRangeArticles(
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

export default errorRateRouter;
