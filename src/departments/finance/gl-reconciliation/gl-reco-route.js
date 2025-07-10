import GLRecoController from "./GLRecoController.js";
import express from "express";
import Jwt from "../../../auth/jwt.js"; // if you're using this for auth later

const glRecRouter = express.Router();
const glRecController = new GLRecoController();

/**
 * @swagger
 * tags:
 *   name: GL Reconciliation
 *   description: Endpoints for General Ledger reconciliation
 */

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
 *     responses:
 *       200:
 *         description: A list of reconciliation data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 generalLedgerBalance: 123456.78
 *                 subLedgerBalances:
 *                   - account: "1000"
 *                     amount: 10000
 *                   - account: "2000"
 *                     amount: 20000
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

glRecRouter.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: "Missing required query parameters: startDate and endDate",
      });
    }

    const data = await glRecController.fetchData(startDate, endDate);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching GL Reco data:", err);
    res.status(500).json({
      error: "Failed to retrieve reconciliation data",
    });
  }
});

export default glRecRouter;
