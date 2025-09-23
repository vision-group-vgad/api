import DataGovernController from "./DataGovernController.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const dataGovernController = new DataGovernController();
const dataGovernRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Data Governance
 */

/**
 * @swagger
 * /api/v1/specialized/data-govern/in-range:
 *   get:
 *     summary: Retrieve data governance analytics within a date range
 *     description: Returns analytics records filtered by the specified start and end dates.
 *     tags: [Data Governance]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date in YYYY-MM-DD format.
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date in YYYY-MM-DD format.
 *     responses:
 *       200:
 *         description: Successful response with analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-01-06"
 *                   departments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         department:
 *                           type: string
 *                           example: "Finance"
 *                         data_quality_score:
 *                           type: integer
 *                           example: 92
 *                         compliance_status:
 *                           type: string
 *                           example: "Compliant"
 *       400:
 *         description: Invalid date range.
 *       500:
 *         description: Server error.
 */
dataGovernRouter.get("/in-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await dataGovernController.getInRangeAnalytics(
      startDate,
      endDate
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

export default dataGovernRouter;
