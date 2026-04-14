import express from "express";
import { getAttendanceAnalysis } from "./attendanceRateController.js";

const attendanceRoute = express.Router();

/**
 * @swagger
 * /api/v1/specialized/attendance-rate:
 *   get:
 *     summary: Get Attendance analysis for events
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: eventName
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Leadership Summit, Finance Workshop, Tech Expo, Marketing Bootcamp, Investor Meetup]
 *         description: Filter by event name (comma separated)
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Attendance analysis data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                 attendanceTrends:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       totalEvents:
 *                         type: number
 *                       totalRegistrations:
 *                         type: number
 *                       totalAttendees:
 *                         type: number
 *                       noShow:
 *                         type: number
 *                       attendanceRate:
 *                         type: number
 *                       seatUtilization:
 *                         type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       eventName:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                       totalRegistrations:
 *                         type: number
 *                       totalAttendees:
 *                         type: number
 *                       totalSeats:
 *                         type: number
 *                       noShow:
 *                         type: number
 *                       attendanceRate:
 *                         type: number
 *                       seatUtilization:
 *                         type: number
 *       500:
 *         description: Server error
 */
attendanceRoute.get("/", getAttendanceAnalysis);

export default attendanceRoute;
