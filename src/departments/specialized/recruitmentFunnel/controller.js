import express from "express";
import { getRecruitmentFunnelData } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/hr/recruitment-funnel:
 *   get:
 *     summary: Get recruitment funnel data
 *     description: Retrieve candidate recruitment funnel records with optional filters.
 *     tags: [RecruitmentFunnel]
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [Male, Female, Other]
 *         description: Filter by candidate gender
 *       - in: query
 *         name: roleApplied
 *         schema:
 *           type: string
 *         description: Filter by role applied
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [LinkedIn, Referral, CareerFair, JobPortal, CompanyWebsite]
 *         description: Filter by recruitment source
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Screened, Interviewed, Offered, Hired, Rejected]
 *         description: Filter by recruitment stage/status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter applications starting from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter applications up to this date
 *     responses:
 *       200:
 *         description: Successful response with recruitment funnel data
 */
router.get("/", (req, res) => {
  try {
    const filters = {
      gender: req.query.gender,
      roleApplied: req.query.roleApplied,
      department: req.query.department,
      source: req.query.source,
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const data = getRecruitmentFunnelData(filters);
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
