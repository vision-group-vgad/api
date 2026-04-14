import express from "express";
import CollectionEfficiencyController from "./CollEffController.js";
import Jwt from "../../../auth/jwt.js";

const collEffRouter = express.Router();
const collEffController = new CollectionEfficiencyController();

/**
 * @swagger
 * /api/v1/collection-efficiency/transactions/annual:
 *   get:
 *     summary: Retrieve annual transaction records
 *     description: Returns all transaction records for a specified year.
 *     tags: [Collection Efficiency]
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2021
 *     responses:
 *       200:
 *         description: Annual transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2021-01-05"
 *                   customer:
 *                     type: string
 *                     example: "ABC Ltd"
 *                   invoiceAmount:
 *                     type: number
 *                     example: 4000
 *                   amountCollected:
 *                     type: number
 *                     example: 3600
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
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch annual transactions. [error message]
 */
collEffRouter.get("/transactions/annual", async (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.status(400).json({
      error: "Missing required query parameter: year",
    });
  }

  try {
    const response = await collEffController.getAnnualTransactions(year);
    res.json(response);
  } catch (err) {
    res.status(500).json({
      error: `Failed to fetch annual transactions. ${err}`,
    });
  }
});

/**
 * @swagger
 * /api/v1/collection-efficiency/range:
 *   get:
 *     summary: Retrieve collection efficiency by date range
 *     tags: [Collection Efficiency]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Collection efficiency data
 *       400:
 *         description: Missing required query parameters
 *       500:
 *         description: Internal server error
 */
collEffRouter.get("/range", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: "Missing required query parameters: startDate and endDate",
    });
  }

  try {
    const response = await collEffController.getEfficiencyByDateRange(
      startDate,
      endDate
    );
    res.json(response);
  } catch (err) {
    res.status(500).json({
      error: `Failed to fetch collection efficiency data. ${err}`,
    });
  }
});

/**
 * @swagger
 * /api/v1/collection-efficiency/annual:
 *   get:
 *     summary: Retrieve annual collection efficiency
 *     description: Returns total receivables, total collections, and collection efficiency percentage for a specified year.
 *     tags: [Collection Efficiency]
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2021
 *         description: Year for which to retrieve the collection efficiency data.
 *     responses:
 *       200:
 *         description: Annual collection efficiency data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalReceivablesDue:
 *                   type: number
 *                   example: 180000
 *                 totalCollections:
 *                   type: number
 *                   example: 162000
 *                 collectionEfficiencyPercentage:
 *                   type: number
 *                   example: 90
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
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch annual collection efficiency data. [error message]
 */
collEffRouter.get("/annual", async (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.status(400).json({
      error: "Missing required query parameter: year",
    });
  }

  try {
    const response = await collEffController.getAnnualData(year);
    res.json(response);
  } catch (err) {
    res.status(500).json({
      error: `Failed to fetch annual collection efficiency data. ${err}`,
    });
  }
});

/**
 * @swagger
 * /api/v1/collection-efficiency/month:
 *   get:
 *     summary: Retrieve monthly collection efficiency
 *     tags: [Collection Efficiency]
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Monthly efficiency data
 *       400:
 *         description: Missing required query parameters
 *       500:
 *         description: Internal server error
 */
collEffRouter.get("/month", async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({
      error: "Missing required query parameters: year and month",
    });
  }

  try {
    const response = await collEffController.getEfficiencyByMonth(year, month);
    res.json(response);
  } catch (err) {
    res.status(500).json({
      error: `Failed to fetch monthly collection efficiency dataset. ${err}`,
    });
  }
});

/**
 * @swagger
 * /api/v1/collection-efficiency/transactions/day:
 *   get:
 *     summary: Retrieve collection transactions for a specific day
 *     tags: [Collection Efficiency]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Daily transaction records
 *       400:
 *         description: Missing required query parameter
 *       500:
 *         description: Internal server error
 */
collEffRouter.get("/transactions/day", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      error: "Missing required query parameter: date",
    });
  }

  try {
    const response = await collEffController.getTransactionsByDay(date);
    res.json(response);
  } catch (err) {
    res.status(500).json({
      error: `Failed to fetch daily transactions. ${err}`,
    });
  }
});

/**
 * @swagger
 * /api/v1/collection-efficiency/transactions/month:
 *   get:
 *     summary: Retrieve transactions for a specific month
 *     tags: [Collection Efficiency]
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2021
 *         description: Year of the transactions
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3
 *         description: Month of the transactions (1 to 12)
 *     responses:
 *       200:
 *         description: Monthly transaction records
 *       400:
 *         description: Missing required query parameters
 *       500:
 *         description: Internal server error
 */
collEffRouter.get("/transactions/month", async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({
      error: "Missing required query parameters: year and month",
    });
  }

  try {
    const response = await collEffController.getTransactionsByMonth(
      parseInt(year),
      parseInt(month)
    );
    res.json(response);
  } catch (err) {
    res.status(500).json({
      error: `Failed to fetch monthly transactions. ${err}`,
    });
  }
});

/**
 * @swagger
 * /api/v1/collection-efficiency/transactions/range:
 *   get:
 *     summary: Retrieve transactions by date range
 *     tags: [Collection Efficiency]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Filtered transaction records within the date range
 *       400:
 *         description: Missing required query parameters
 *       500:
 *         description: Internal server error
 */
collEffRouter.get("/transactions/range", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: "Missing required query parameters: startDate and endDate",
    });
  }

  try {
    const response = await collEffController.getTransactionsByDateRange(
      startDate,
      endDate
    );
    res.json(response);
  } catch (err) {
    res.status(500).json({
      error: `Failed to fetch transactions by date range. ${err}`,
    });
  }
});

export default collEffRouter;
