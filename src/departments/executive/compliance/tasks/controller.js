import express from "express";
import { getFilteredTasks } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Compliance
 *   description: API to visualise conmpliance using compliance tasks executed.
 */

/**
 * @swagger
 * /api/v1/executives/compliance/tasks:
 *   get:
 *     summary: Get compliance tasks with optional filters
 *     tags: [Compliance]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Department name to filter
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Completed, In Progress, Not Started, Overdue]
 *         description: Task status to filter
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of filtered compliance tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example:
 *                       taskId: "T001"
 *                       department: "Finance"
 *                       title: "Quarterly tax filing"
 *                       status: "Completed"
 *                       assignedTo: "John Doe"
 *                       startDate: "2025-01-01"
 *                       dueDate: "2025-01-15"
 *                       completionDate: "2025-01-12"
 */
router.get("/", async (req, res) => {
  try {
    const { department, status, startDate, endDate } = req.query;
    const tasks = await getFilteredTasks({ department, status, startDate, endDate });
    if (tasks.length === 0) {
      return res.status(200).json({ message: "No records found for the applied filters", data: [] });
    }
    res.status(200).json({ message: `${tasks.length} task(s) found`, data: tasks });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch compliance tasks", error: err.message });
  }
});

export default router;
