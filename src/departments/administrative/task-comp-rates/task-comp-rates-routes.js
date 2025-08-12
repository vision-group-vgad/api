import express from "express";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import Jwt from "../../../auth/jwt.js";
import TaskCompRatesController from "./TaskCompRatesController.js";

const taskController = new TaskCompRatesController();
const taskRouter = express.Router();

/**
 * @swagger
 * /api/v1/administrative/task-comp-rates/in-range:
 *   get:
 *     summary: Get tasks analytics within a date range
 *     description: Retrieves analytics for tasks assigned and/or completed between the given start and end dates.
 *     tags:
 *       - Task Completion Rates
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-01"
 *         description: The start date of the range (inclusive).
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-08-12"
 *         description: The end date of the range (inclusive).
 *     responses:
 *       200:
 *         description: Successful retrieval of task analytics within the date range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   task_id:
 *                     type: integer
 *                     example: 1
 *                   task_name:
 *                     type: string
 *                     example: "Database Backup"
 *                   task_type:
 *                     type: string
 *                     example: "Maintenance"
 *                   assignee:
 *                     type: string
 *                     example: "Alice Johnson"
 *                   date_assigned:
 *                     type: string
 *                     format: date
 *                     example: "2025-01-01"
 *                   date_completed:
 *                     type: string
 *                     format: date
 *                     nullable: true
 *                     example: "2025-01-05"
 *                   expected_end_date:
 *                     type: string
 *                     format: date
 *                     nullable: false
 *                     example: "2025-01-05"
 *                   task_status:
 *                     type: string
 *                     example: "Completed"
 *       400:
 *         description: Invalid date range provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid startDate or endDate"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */
taskRouter.get("/in-range", Jwt.verifyToken, async (req, res) => {
  let { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await taskController.getInRangeAnalytics(
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

export default taskRouter;
