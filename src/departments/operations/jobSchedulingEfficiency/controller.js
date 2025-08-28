import express from "express";
import { getJobSchedulingEfficiency } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: JobScheduling
 *   description: Job scheduling efficiency for printing supervisors
 */

/**
 * @swagger
 * /api/v1/operations/job-scheduling:
 *   get:
 *     summary: Get all jobs with scheduling efficiency metrics
 *     tags: [JobScheduling]
 *     responses:
 *       200:
 *         description: List of jobs with start/end delays and duration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       jobId:
 *                         type: string
 *                       machine:
 *                         type: string
 *                       operator:
 *                         type: string
 *                       service:
 *                         type: string
 *                       scheduledDate:
 *                         type: string
 *                         format: date
 *                       scheduledStartTime:
 *                         type: string
 *                         format: time
 *                       scheduledEndTime:
 *                         type: string
 *                         format: time
 *                       actualStartTime:
 *                         type: string
 *                         format: time
 *                       actualEndTime:
 *                         type: string
 *                         format: time
 *                       startDelayMinutes:
 *                         type: number
 *                       endDelayMinutes:
 *                         type: number
 *                       actualJobDurationMinutes:
 *                         type: number
 */
router.get("/", (req, res) => {
  const data = getJobSchedulingEfficiency();
  res.json({ success: true, data });
});

export default router;
