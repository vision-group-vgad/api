import express from "express";
import ProcessThrController from "./ProcessThroughputController.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";

const processThroughController = new ProcessThrController();
const processThroughRouter = express.Router();

/**
 * @swagger
 * /api/v1/administrative/process-throughput/in-range:
 *   get:
 *     summary: Get process throughput analytics within a date range
 *     description: >
 *       Retrieves process throughput analytics data for the specified date range.
 *       Dates must be provided in `YYYY-MM-DD` format.
 *     tags:
 *       - Process Throughput
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-01
 *         description: The start date of the range (inclusive).
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-08-31
 *         description: The end date of the range (inclusive).
 *     responses:
 *       200:
 *         description: Process throughput analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   task_id:
 *                     type: string
 *                     example: T001
 *                   task_type:
 *                     type: string
 *                     example: Procurement
 *                   request_date:
 *                     type: string
 *                     format: date
 *                     example: 2025-07-01
 *                   completion_date:
 *                     type: string
 *                     format: date
 *                     example: 2025-07-03
 *                   status:
 *                     type: string
 *                     example: Completed
 *                   assigned_to:
 *                     type: string
 *                     example: John Okello
 *                   priority:
 *                     type: string
 *                     example: High
 *                   sla_due_date:
 *                     type: string
 *                     format: date
 *                     example: 2025-07-04
 *                   sla_met:
 *                     type: boolean
 *                     example: true
 *                   error_flag:
 *                     type: boolean
 *                     example: false
 *                   requestor_department:
 *                     type: string
 *                     example: Editorial
 *                   completion_time_hours:
 *                     type: number
 *                     example: 48
 *                   customer_satisfaction:
 *                     type: integer
 *                     example: 5
 *       400:
 *         description: Invalid date range
 *       500:
 *         description: Internal server error
 *     security: []  # <-- explicitly marks no authentication required
 */

processThroughRouter.get("/in-range", async (req, res) => {
  let { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await processThroughController.getInRangeTasks(
      startDate,
      endDate
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

export default processThroughRouter;