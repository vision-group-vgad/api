import express from "express";
import ErrorRateController from "./ErrorRateController.js";
import Jwt from "../../../auth/jwt.js";

const errorController = new ErrorRateController();
const errorRateRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/error-rate:
 *   get:
 *     tags:
 *       - Error Rates
 *     summary: Get error rate data
 *     description: Retrieve error rate statistics for editorial department, filtered by date range
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The end date for filtering (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successfully retrieved error rate data
 *       404:
 *         description: Request dates out of range
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
errorRateRouter.get("/", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Missing required query parameters: startDate and endDate",
      });
    }

    const results = await errorController.fetchFilteredData(startDate, endDate);
    res.json(results);
  } catch (error) {
    return res.status(404).json({ message: `${error.message}` });
  }
});

export default errorRateRouter;
