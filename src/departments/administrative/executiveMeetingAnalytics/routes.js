import express from "express";
import { getExecutiveMeetingAnalytics } from "./controller.js";


const router = express.Router();


/**
 * @swagger
 * /api/v1/admnistrative/meetingAnalytics:
 *   get:
 *     summary: Retrieve executive meeting analytics
 *     description: Returns a list of executive meetings, optionally filtered by date range.
 *     tags:
 *       - Executive Meeting Analytics
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (inclusive) in YYYY-MM-DD format.
 *         example: "2025-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (inclusive) in YYYY-MM-DD format.
 *         example: "2025-02-01"
 *     responses:
 *       200:
 *         description: List of executive meetings within the date range.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   meetingId:
 *                     type: string
 *                     example: M001
 *                   meetingTitle:
 *                     type: string
 *                     example: Strategy Review
 *                   meetingDate:
 *                     type: string
 *                     format: date
 *                     example: "2025-01-01"
 *                   startTime:
 *                     type: string
 *                     example: "09:30"
 *                   endTime:
 *                     type: string
 *                     example: "10:30"
 *                   meetingStatus:
 *                     type: string
 *                     enum: [Held, Cancelled, Rescheduled]
 *                     example: Held
 *                   department:
 *                     type: string
 *                     example: Finance
 *                   attendanceRate:
 *                     type: string
 *                     description: Attendance percentage for the meeting.
 *                     example: "80%"
 *       400:
 *         description: Invalid date format or range.
 *       500:
 *         description: Server error while retrieving meeting analytics.
 */

router.get("/", getExecutiveMeetingAnalytics);

export default router;