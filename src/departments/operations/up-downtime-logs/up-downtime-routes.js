import UpDowntimeController from "./UpDowntimeLogsController.js";
import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const upDownController = new UpDowntimeController();
const upDowntimeRouter = express.Router();

/**
 * @swagger
 * /api/v1/operations/up-downtime-logs/in-range:
 *   get:
 *     summary: Get uptime and downtime analytics for a date range
 *     description: Returns filtered uptime/downtime logs and summary metrics including most failing machine, daily average uptime, and daily average downtime per machine.
 *     tags: [Uptime-Downtime Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Uptime and downtime analytics successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: Filtered uptime/downtime log entries
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       machine:
 *                         type: string
 *                       location:
 *                         type: string
 *                       status:
 *                         type: string
 *                       uptime_hours:
 *                         type: number
 *                       downtime_hours:
 *                         type: number
 *                       downtime_reason:
 *                         type: string
 *                         nullable: true
 *                       uptime_start:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       uptime_end:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       downtime_start:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       downtime_end:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                 summary:
 *                   type: object
 *                   properties:
 *                     most_failing_machine:
 *                       type: object
 *                       properties:
 *                         machine:
 *                           type: string
 *                         total_downtime_hours:
 *                           type: number
 *                     daily_average_machine_uptime:
 *                       type: object
 *                       additionalProperties:
 *                         type: number
 *                     daily_average_machine_donwtime:
 *                       type: object
 *                       additionalProperties:
 *                         type: number
 *       400:
 *         description: Invalid date range or missing parameters
 *       500:
 *         description: Internal server error
 */
upDowntimeRouter.get("/in-range", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate);

  try {
    const results = await upDownController.getInRangeAnalytics(
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

export default upDowntimeRouter;
