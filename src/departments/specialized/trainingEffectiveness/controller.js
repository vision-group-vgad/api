import express from "express";
import { getTrainingEffectiveness } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/hr/training-effectiveness:
 *   get:
 *     summary: Get training effectiveness data
 *     description: Retrieve calculated training effectiveness metrics with optional filters
 *     tags: [Training Effectiveness]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: trainingId
 *         schema:
 *           type: string
 *         description: Filter by specific training ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter trainings starting from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter trainings up to this date
 *     responses:
 *       200:
 *         description: Training effectiveness data retrieved successfully
 */
router.get("/", (req, res) => {
  const filters = {
    department: req.query.department,
    trainingId: req.query.trainingId,
    startDate: req.query.startDate,
    endDate: req.query.endDate
  };

  const data = getTrainingEffectiveness(filters);
  res.json({ success: true, data });
});

export default router;
