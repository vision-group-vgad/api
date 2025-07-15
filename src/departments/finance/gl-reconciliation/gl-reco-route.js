import GLRecoController from "./GLRecoController.js";
import express from "express";
import Jwt from "../../../auth/jwt.js";

const glRecRouter = express.Router();
const glRecController = new GLRecoController();

/**
 * @swagger
 * /api/v1/gl-reconciliation/range:
 *   get:
 *     summary: Fetch GL reconciliation data
 *     description: Retrieves General Ledger and Sub Ledger balances filtered by a date range.
 *     tags: [General Ledger Reconciliation]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date of the reconciliation period (e.g. 2021-01-01)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date of the reconciliation period (e.g. 2021-08-31)
 *     responses:
 *       200:
 *         description: A list of reconciliation entries and summary totals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     periodStart:
 *                       type: string
 *                       format: date
 *                       example: "2021-01-01"
 *                     periodEnd:
 *                       type: string
 *                       format: date
 *                       example: "2021-08-31"
 *                     totalDebitAmount:
 *                       type: number
 *                       example: 150000
 *                     totalCreditAmount:
 *                       type: number
 *                       example: 150000
 *                     generalLedgerDebitBalance:
 *                       type: number
 *                       example: 155000
 *                     generalLedgerCreditBalance:
 *                       type: number
 *                       example: 152000
 *                     entryCount:
 *                       type: integer
 *                       example: 100
 *                 entries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2021-01-10"
 *                       accountName:
 *                         type: string
 *                         example: "Mbarara Cash Control"
 *                       entryType:
 *                         type: string
 *                         enum: [Debit, Credit]
 *                         example: "Debit"
 *                       amount:
 *                         type: number
 *                         example: 19000
 *       400:
 *         description: Missing required query parameters
 *         content:
 *           application/json:
 *             example:
 *               error: "Missing required query parameters: startDate and endDate"
 *       500:
 *         description: Internal server error or failed request to Business Central
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to retrieve reconciliation data"
 */
glRecRouter.get("/range", Jwt.verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: "Missing required query parameters: startDate and endDate",
      });
    }

    const data = await glRecController.getTransformedLedgers(
      startDate,
      endDate
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve reconciliation data",
      err,
    });
  }
});

/**
 * @swagger
 * /api/v1/gl-reconciliation/start-year:
 *   get:
 *     summary: Retrieve general ledger reconciliation data from a given start year
 *     description: Returns general ledger reconciliation data starting from the specified year.
 *     tags: [General Ledger Reconciliation]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: The start year from which to fetch reconciliation data
 *     responses:
 *       200:
 *         description: Successful response with reconciliation data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   summary:
 *                     type: object
 *                     properties:
 *                       periodStart:
 *                         type: string
 *                         format: date
 *                       periodEnd:
 *                         type: string
 *                         format: date
 *                       totalDebitAmount:
 *                         type: number
 *                       totalCreditAmount:
 *                         type: number
 *                       generalLedgerDebitBalance:
 *                         type: number
 *                       generalLedgerCreditBalance:
 *                         type: number
 *                   entries:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         date:
 *                           type: string
 *                           format: date
 *                         accountName:
 *                           type: string
 *                         entryType:
 *                           type: string
 *                         amount:
 *                           type: number
 *       400:
 *         description: Missing required query parameter, year
 *       500:
 *         description: Failed to retrieve reconciliation data
 */
glRecRouter.get("/start-year", Jwt.verifyToken, async (req, res) => {
  try {
    const { year } = req.query;

    if (!year) {
      return res.status(400).json({
        error: "Missing required query parameter: start year",
      });
    }

    const data = await glRecController.getDataUptoDate(year);
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve reconciliation data",
      err,
    });
  }
});

export default glRecRouter;
