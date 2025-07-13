import express from "express";
import BadDebtRatiosController from "./BadDebtRatiosController.js";
import Jwt from "../../../auth/jwt.js";

const badDebtRatiosRouter = express.Router();
const bdRatiosController = new BadDebtRatiosController();

/**
 * @swagger
 * /api/v1/bad-debt-ratios/range:
 *   get:
 *     summary: Retrieve Bad Debt Ratios by date range
 *     description: Returns monthly bad debt ratios and related financial metrics within the specified date range.
 *     tags:
 *       - Bad Debt Ratios
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
 *         description: Successful retrieval of bad debt ratios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filteredMonthly:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: 2025-03
 *                       creditSales:
 *                         type: number
 *                         example: 12000
 *                       badDebts:
 *                         type: number
 *                         example: 850
 *                       badDebtRatioPercentage:
 *                         type: number
 *                         example: 7.08
 *                 totalCreditSales:
 *                   type: number
 *                   example: 36000
 *                 totalBadDebts:
 *                   type: number
 *                   example: 2700
 *                 overallBadDebtRatioPercentage:
 *                   type: number
 *                   example: 7.5
 *       400:
 *         description: Missing required query parameters
 *       500:
 *         description: Internal server error while fetching bad debt ratios
 */
badDebtRatiosRouter.get("/range", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: "Missing required query parameters: startDate and endDate",
    });
  }

  try {
    const response = await bdRatiosController.getRatiosByDateRange(
      startDate,
      endDate
    );
    res.json(response);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Failed to fetch bad debt ratios datasets. ${err}` });
  }
});

/**
 * @swagger
 * /api/v1/bad-debt-ratios/annual:
 *   get:
 *     summary: Retrieve annual bad debt ratios
 *     description: Returns overall annual credit sales, bad debts, and bad debt ratio percentage for the specified year.
 *     tags:
 *       - Bad Debt Ratios
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2021
 *         description: Year for which to retrieve the data (e.g., 2021)
 *     responses:
 *       200:
 *         description: Successful retrieval of annual bad debt ratios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 creditSales:
 *                   type: number
 *                   example: 150000
 *                 badDebts:
 *                   type: number
 *                   example: 12300
 *                 badDebtRatioPercentage:
 *                   type: number
 *                   example: 8.2
 *       400:
 *         description: Missing required query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required query parameter, year
 *       500:
 *         description: Internal server error while fetching annual bad debt ratios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch annual bad debt ratios datasets. [error message]
 */
badDebtRatiosRouter.get("/annual", Jwt.verifyToken, async (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.status(400).json({
      error: "Missing required query parameter: year",
    });
  }

  try {
    const response = await bdRatiosController.getAnnualData();
    res.json(response);
  } catch (err) {
    res.status(500).json({
      error: `Failed to fetch annual bad debt ratios datasets. ${err}`,
    });
  }
});

/**
 * @swagger
 * /api/v1/bad-debt-ratios/month:
 *   get:
 *     summary: Retrieve bad debt ratio for a specific month
 *     description: Returns bad debt ratio data for a specific year and month.
 *     tags:
 *       - Bad Debt Ratios
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year of the data (e.g. 2021)
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *         description: Month of the data (1 to 12)
 *     responses:
 *       200:
 *         description: Successful retrieval of monthly bad debt ratio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 month:
 *                   type: string
 *                   example: 2021-03
 *                 creditSales:
 *                   type: number
 *                   example: 12000
 *                 badDebts:
 *                   type: number
 *                   example: 850
 *                 badDebtRatioPercentage:
 *                   type: number
 *                   example: 7.08
 *       400:
 *         description: Missing required query parameters
 *       500:
 *         description: Internal server error
 */
badDebtRatiosRouter.get("/month", Jwt.verifyToken, async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({
      error: "Missing required query parameters: year and month",
    });
  }

  try {
    const response = await bdRatiosController.getRatiosByMonth(year, month);
    res.json(response);
  } catch (err) {
    res.status(500).json({
      error: `Failed to fetch monthly bad debt ratios dataset. ${err}`,
    });
  }
});

export default badDebtRatiosRouter;
