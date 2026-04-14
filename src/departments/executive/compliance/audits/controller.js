import express from "express";
import { getFilteredAudits } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/executives/compliance/audits:
 *   get:
 *     summary: Get audits with optional filters
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
 *           enum: [Planned, In Progress, Completed, Overdue]
 *         description: Status of the audit
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Audit category (Financial, Operational, IT, Regulatory)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter audits starting on or after this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter audits ending on or before this date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of filtered audits
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
 *                       auditId: "A001"
 *                       auditName: "Quarterly Financial Audit Q1 2025"
 *                       department: "Finance"
 *                       startDate: "2025-01-05"
 *                       endDate: "2025-01-20"
 *                       actualEndDate: "2025-01-18"
 *                       auditor: "Grace Namaganda"
 *                       status: "Completed"
 *                       findingsCount: 5
 *                       repeatFindingsCount: 1
 *                       riskLevel: "Medium"
 *                       category: "Financial"
 */
router.get("/", async (req, res) => {
  try {
    const { department, status, category, startDate, endDate } = req.query;
    const filtered = await getFilteredAudits({ department, status, category, startDate, endDate });
    if (filtered.length === 0) {
      return res.status(200).json({ message: "No audits found for the applied filters", data: [] });
    }
    res.status(200).json({ message: `${filtered.length} audit(s) found`, data: filtered });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch audits", error: err.message });
  }
});

export default router;
