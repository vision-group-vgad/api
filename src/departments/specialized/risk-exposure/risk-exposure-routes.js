import RiskExposureController from "./RiskExposureController.js";
import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const riskExposureController = new RiskExposureController();
const riskExposureRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Risk Exposure
 *   description: Endpoints for company-wide risk exposure analytics
 */

/**
 * @swagger
 * /api/v1/specialized/risk-exposure/in-range:
 *   get:
 *     summary: Get weekly risk exposure data in a date range
 *     tags: [Risk Exposure]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for analytics range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for analytics range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Weekly risk exposure data with overall summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: Weekly risk exposure data
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       risk_exposure:
 *                         type: array
 *                         description: List of risk categories for the week
 *                         items:
 *                           type: object
 *                           properties:
 *                             category:
 *                               type: string
 *                             metrics:
 *                               type: object
 *                             risk_level:
 *                               type: string
 *                             trend:
 *                               type: string
 *                             suggested_action:
 *                               type: string
 *                 summary:
 *                   type: object
 *                   description: Overall risk summary
 *                   properties:
 *                     overall_risk_percent:
 *                       type: number
 *                     overall_risk_level:
 *                       type: string
 *                     trend:
 *                       type: string
 *                     priority_focus:
 *                       type: array
 *                       items:
 *                         type: string
 *                     recommended_actions:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Invalid date range
 *       500:
 *         description: Server error
 */
riskExposureRouter.get("/in-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await riskExposureController.getInRangeAnalytics(
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

export default riskExposureRouter;
