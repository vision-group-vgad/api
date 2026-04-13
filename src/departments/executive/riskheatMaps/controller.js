import express from "express";
import { getRisks } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Risk Heatmap
 *   description: API to manage and visualize organizational risks
 */

/**
 * @swagger
 * /api/v1/executives/risk-heatmap:
 *   get:
 *     summary: Get risk heatmap data
 *     tags: [Risk Heatmap]
 *     description: Retrieve risks with calculated risk scores. Supports filters for date range, status, and department.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Open, In Progress, Mitigated, Closed]
 *         description: Filter by risk status
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department (e.g., Finance, Editorial, Operations)
 *     responses:
 *       200:
 *         description: List of risks with calculated risk scores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   riskId:
 *                     type: string
 *                   department:
 *                     type: string
 *                   regulation:
 *                     type: string
 *                   description:
 *                     type: string
 *                   likelihood:
 *                     type: integer
 *                   impact:
 *                     type: integer
 *                   riskScore:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   reviewDate:
 *                     type: string
 *                     format: date
 *                   nextReviewDate:
 *                     type: string
 *                     format: date
 */
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate, status, department } = req.query;
    const risks = await getRisks({ startDate, endDate, status, department });
    res.json(risks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch risk heatmap", error: err.message });
  }
});

export default router;
