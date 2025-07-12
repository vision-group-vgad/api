import express from "express";
import DsoController from "./DsoController.js";
import Jwt from "../../../auth/jwt.js";

const dsoRouter = express.Router();
const dsoController = new DsoController();

/**
 * @swagger
 * /api/v1/dso:
 *   get:
 *     summary: Retrieve Days Sales Outstanding (DSO) data
 *     description: Returns DSO information within the specified date range.
 *     tags:
 *       - DSO
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
 *         description: Successful retrieval of DSO data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 dsoValue: 45.2
 *                 period: "2025-01-01 to 2025-03-31"
 *       400:
 *         description: Missing required query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "Missing required query parameters: startDate and endDate"
 *       500:
 *         description: Internal server error while fetching DSO data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "Failed to fetch DSO datasets. [error message]"
 */
dsoRouter.get("/", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: "Missing required query parameters: startDate and endDate",
    });
  }

  try {
    const response = await dsoController.fetchData(startDate, endDate);
    console.log("Response", response);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch DSO datasets. ${err}` });
  }
});

export default dsoRouter;
