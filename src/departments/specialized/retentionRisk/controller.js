import express from "express";
import { getRetentionRiskData } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/hr/retention-risk:
 *   get:
 *     summary: Get employee retention risk data
 *     description: Retrieve retention risk records with optional filters.
 *     tags: [RetentionRisk]
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [Male, Female, Other]
 *         description: Filter by gender
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: riskLevel
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High]
 *         description: Filter by retention risk level
 *       - in: query
 *         name: likelyToLeave
 *         schema:
 *           type: boolean
 *         description: Filter by likelihood to leave
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start of record date range
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End of record date range
 *     responses:
 *       200:
 *         description: List of retention risk records
 */
router.get("/", (req, res) => {
  try {
    const filters = {
      gender: req.query.gender,
      department: req.query.department,
      riskLevel: req.query.riskLevel,
      likelyToLeave: req.query.likelyToLeave,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const data = getRetentionRiskData(filters);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
