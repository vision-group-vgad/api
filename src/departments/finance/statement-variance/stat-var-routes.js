import express from "express";
import Jwt from "../../../auth/jwt.js";
import StatementsVarianceController from "./StatVarianceController.js";

const statVarRouter = express.Router();
const statVarController = new StatementsVarianceController();

/**
 * @swagger
 * /api/v1/fin-statement-variance:
 *   get:
 *     summary: Retrieve financial statement variance
 *     description: Returns monthly financial statement variance data for the provided date range.
 *     tags: [Financial Statements Variance]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for the variance data (e.g. 2021-01-01)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for the variance data (e.g. 2022-12-31)
 *     responses:
 *       200:
 *         description: Monthly financial metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     example: "2021-01"
 *                   assetValue:
 *                     type: number
 *                     example: 1000000
 *                   grossProfit:
 *                     type: number
 *                     example: 200000
 *                   netProfit:
 *                     type: number
 *                     example: 150000
 *                   revenue:
 *                     type: number
 *                     example: 450000
 *                   expenses:
 *                     type: number
 *                     example: 300000
 *                   liabilities:
 *                     type: number
 *                     example: 200000
 *                   equity:
 *                     type: number
 *                     example: 300000
 *                   netIncome:
 *                     type: number
 *                     example: 150000
 *       400:
 *         description: Missing required query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "Missing required query parameters: startDate and endDate"
 *       500:
 *         description: Internal server error while fetching data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "Failed to fetch financial statements variance data"
 */
statVarRouter.get("/", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: "Missing required query parameters: startDate and endDate",
    });
  }

  try {
    const response = await statVarController.fetchData(startDate, endDate);
    console.log("Response", response);
    res.json(response);
  } catch (err) {
    console.error("Error fetching financial statement variance:", err);
    return res.status(500).json({
      error: `Failed to fetch financial statements variance data: ${
        err.message || err
      }`,
    });
  }
});

export default statVarRouter;
