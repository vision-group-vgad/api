import MitigationEffController from "./MitigationEffController.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const mitigationController = new MitigationEffController();
const mitigationEffRouter = express.Router();

/**
 * @swagger
 * /api/v1/specialized/mitigation-effectiveness/in-range:
 *   get:
 *     summary: Get mitigation effectiveness analytics in a date range
 *     description: >
 *       Returns analytics about mitigation effectiveness, including filtered data and an overall risk summary, for the specified date range.
 *     tags: [Mitigation Effectiveness]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Analytics data successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: Filtered mitigation effectiveness data
 *                 summary:
 *                   type: object
 *                   description: Overall risk summary
 *                   properties:
 *                     totalRisks:
 *                       type: integer
 *                       example: 28
 *                     mitigatedRisks:
 *                       type: integer
 *                       example: 20
 *                     mitigationEffectiveness:
 *                       type: number
 *                       format: float
 *                       example: 71
 *                     topIneffectiveControls:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Training Program", "System Redundancy"]
 *                     residualRiskScore:
 *                       type: integer
 *                       example: 35
 *       400:
 *         description: Invalid date range
 *       500:
 *         description: Internal server error
 */
mitigationEffRouter.get("/in-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await mitigationController.getInRangeAnalytics(
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

export default mitigationEffRouter;
