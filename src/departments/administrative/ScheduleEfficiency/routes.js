import express from "express";
import { getExecutiveMeetingSummary, getExecutiveTasks } from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Schedule Efficiency
 *     description: Endpoints for executive meeting and task analytics
 */

/**
 * @swagger
 * /api/v1/admnistrative/scheduleEfficiency/summary:
 *   get:
 *     tags:
 *       - Schedule Efficiency
 *     summary: Get executive meeting summary
 *     description: Returns a summary of meetings including total held, target, completion rate, cancellation rate, and upcoming meetings. Supports filtering by start and end date.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering meetings (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering meetings (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Summary of meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMeetingsHeld:
 *                   type: integer
 *                   example: 42
 *                 targetMeetings:
 *                   type: integer
 *                   example: 50
 *                 meetingsCompletionRate:
 *                   type: number
 *                   format: float
 *                   example: 84
 *                 cancellationRate:
 *                   type: number
 *                   format: float
 *                   example: 8.5
 *                 upcomingMeetings:
 *                   type: integer
 *                   example: 5
 */
router.get("/summary", getExecutiveMeetingSummary);

/**
 * @swagger
 * /api/v1/admnistrative/scheduleEfficiency/taskProgress:
 *   get:
 *     tags:
 *       - Schedule Efficiency
 *     summary: Get executive tasks/action points summary
 *     description: Returns high-priority tasks for progress bars and all tasks for table details. Supports optional filtering by due date range.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date to filter tasks (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date to filter tasks (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Tasks summary successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progressTasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       taskId:
 *                         type: string
 *                       taskTitle:
 *                         type: string
 *                       completionPercentage:
 *                         type: number
 *                       status:
 *                         type: string
 *                       project:
 *                         type: string
 *                       dueDate:
 *                         type: string
 *                 allTasks:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/taskProgress", getExecutiveTasks);

export default router;
