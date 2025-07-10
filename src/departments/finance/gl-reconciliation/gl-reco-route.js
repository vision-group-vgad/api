import GLRecoController from "./GLRecoController.js";
import express from "express";
import Jwt from "../../../auth/jwt.js"; // Optional: if you want to enable authentication later

const glRecRouter = express.Router();
const glRecController = new GLRecoController();

/**
 * @swagger
 * /api/v1/gl-reconciliation:
 *   get:
 *     summary: Fetch GL reconciliation data from Business Central
 *     description: Retrieves General Ledger and Sub Ledger balances filtered by a date range.
 *     tags: [GL Reconciliation]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date of the reconciliation period (e.g. 2024-01-01)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date of the reconciliation period (e.g. 2024-03-31)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Max number of records to fetch (default is 100)
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
 *                       example: "2024-01-01"
 *                     periodEnd:
 *                       type: string
 *                       format: date
 *                       example: "2024-03-31"
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
 *                         example: "2024-01-10"
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
glRecRouter.get("/", Jwt.verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: "Missing required query parameters: startDate and endDate",
      });
    }

    const numericLimit = 100;

    const data = await glRecController.getTransformedLedgers(
      startDate,
      endDate,
      numericLimit
    );
    res.json(data);
  } catch (err) {
    console.error("Error fetching GL Reco data:", err);
    res.status(500).json({
      error: "Failed to retrieve reconciliation data",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

export default glRecRouter;
