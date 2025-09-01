import RevenueAttributionController from "./RevenueAttributionController.js";
import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const revAttController = new RevenueAttributionController();
const revAttRouter = express.Router();

/**
 * @swagger
 * /api/v1/sales/revenue-attribution/in-range:
 *   get:
 *     summary: Get revenue attribution data in a date range
 *     description: Retrieves revenue attribution analytics for all segments within a specified start and end date.
 *     tags:
 *       - Revenue Attribution
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date of the range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date of the range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Returns revenue attribution analytics
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
 *                     example: "2025-01-01"
 *                   revenue:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         segment:
 *                           type: string
 *                           example: "Print Newspaper"
 *                         amount:
 *                           type: number
 *                           example: 2000000
 *       400:
 *         description: Invalid date range
 *       500:
 *         description: Internal server error
 */
revAttRouter.get("/in-range", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await revAttController.getInRangeAnalytics(
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

export default revAttRouter;
