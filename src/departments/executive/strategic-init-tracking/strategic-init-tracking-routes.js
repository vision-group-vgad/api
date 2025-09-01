import StrategicInitTrackingController from "./StrategicInitTrackingController.js";
import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const strategicTrackingController = new StrategicInitTrackingController();
const strategicInitiativeRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Strategic Initiatives
 *   description: API for tracking strategic initiatives
 */

/**
 * @swagger
 * /api/v1/executive/strategic-init-tracking/in-range:
 *   get:
 *     summary: Get strategic initiatives analytics within a given date range
 *     description: Returns filtered strategic initiatives along with a summary of top owners, top departments, and initiative status counts.
 *     tags: [Strategic Initiatives]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering initiatives (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering initiatives (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered initiatives and analytics summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: Filtered initiatives
 *                   items:
 *                     type: object
 *                     properties:
 *                       initiativeId:
 *                         type: string
 *                       initiativeName:
 *                         type: string
 *                       owner:
 *                         type: string
 *                       department:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       endDate:
 *                         type: string
 *                         format: date
 *                       status:
 *                         type: string
 *                       completionPercent:
 *                         type: number
 *                       budgetAllocated:
 *                         type: number
 *                       budgetSpent:
 *                         type: number
 *                       strategicGoal:
 *                         type: string
 *                       risks:
 *                         type: string
 *                 summary:
 *                   type: object
 *                   properties:
 *                     best_owners:
 *                       type: object
 *                       description: Top owners for Completed and Halted initiatives
 *                     best_depts:
 *                       type: object
 *                       description: Top departments for Completed and Halted initiatives
 *                     status_counts:
 *                       type: object
 *                       additionalProperties:
 *                         type: number
 *                       description: Count of initiatives by status
 *       400:
 *         description: Invalid date range or missing parameters
 *       500:
 *         description: Internal server error
 */
strategicInitiativeRouter.get(
  "/in-range",
  Jwt.verifyToken,
  async (req, res) => {
    const { startDate, endDate } = req.query;

    validateRange(startDate, endDate, res);

    try {
      const results = await strategicTrackingController.getInRangeAnalytics(
        startDate,
        endDate
      );
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({
        message: `${error.message}`,
      });
    }
  }
);

export default strategicInitiativeRouter;
