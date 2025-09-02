import express from "express";
import { getFilteredPolicies } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/executives/compliance/policies:
 *   get:
 *     summary: Get policies with optional filters
 *     tags: [Compliance]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Department name to filter
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [On Track, At Risk, Overdue]
 *         description: Status of policy
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Compliance category (GDPR, Financial, HR, Safety, IT Security, etc.)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by lastReviewedDate (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by nextReviewDate (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of filtered policies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example:
 *                       policyId: "P001"
 *                       policyName: "Data Protection Policy"
 *                       department: "IT"
 *                       lastReviewedDate: "2024-12-15"
 *                       nextReviewDate: "2025-12-15"
 *                       owner: "Alice Mwangi"
 *                       complianceTasksCompleted: 8
 *                       totalTasks: 10
 *                       status: "On Track"
 *                       category: "Data Protection"
 */
router.get("/", (req, res) => {
  const { department, status, category, startDate, endDate } = req.query;

  const filtered = getFilteredPolicies({ department, status, category, startDate, endDate });

  if (filtered.length === 0) {
    return res.status(200).json({
      message: "No policies found for the applied filters",
      data: []
    });
  }

  res.status(200).json({
    message: `${filtered.length} policy(ies) found`,
    data: filtered
  });
});

export default router;
