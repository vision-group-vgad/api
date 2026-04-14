import express from "express";
import { getFeedbackAnalysis } from "./feedbackController.js";

const feedbackRoute = express.Router();

/**
 * @swagger
 * /api/v1/specialized/feedback:
 *   get:
 *     summary: Get Participant Feedback analysis
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
 *         description: Feedback analysis data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalParticipants:
 *                       type: number
 *                     totalAttended:
 *                       type: number
 *                     totalFeedback:
 *                       type: number
 *                     avgCSAT:
 *                       type: number
 *                     nps:
 *                       type: number
 *                 ratings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rating:
 *                         type: number
 *                       count:
 *                         type: number
 *                       percentage:
 *                         type: number
 *                 sessions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sessionTitle:
 *                         type: string
 *                       avgScore:
 *                         type: number
 *                       participants:
 *                         type: number
 *       500:
 *         description: Server error
 */
feedbackRoute.get("/", getFeedbackAnalysis);

export default feedbackRoute;
