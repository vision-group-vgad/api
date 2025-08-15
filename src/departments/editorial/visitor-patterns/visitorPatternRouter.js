import express from "express";
import { getVisitorAnalytics } from "./visitorPatternController.js";

const visionPatternRoute = express.Router();

/**
 * @swagger
 * /api/v1/editorial/visitor-patterns:
 *   get:
 *     summary: Get visitor analytics grouped by day or week and visitor type
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: visitorType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Guest, Vendor, Interviewee, Delivery, Other]
 *         description: Filter by visitor type
 *       - in: query
 *         name: department
 *         required: false
 *         schema:
 *           type: string
 *           enum: [HR, Finance, IT, Editorial, Admin, Security]
 *         description: Filter by department visited
 *     responses:
 *       200:
 *         description: Visitor analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalVisitors:
 *                   type: integer
 *                 
 *                 raw:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Visitor_ID:
 *                         type: string
 *                       Visit_Date:
 *                         type: string
 *                         format: date
 *                       Visit_Type:
 *                         type: string
 *                       Arrival_Time:
 *                         type: string
 *                       Check_In_Time:
 *                         type: string
 *                       Department_Visited:
 *                         type: string
 *                       Host_Staff_Name:
 *                         type: string
 *                       Visit_Purpose:
 *                         type: string
 *                       Zone:
 *                         type: string
 *       500:
 *         description: Server error
 */
visionPatternRoute.get("/", getVisitorAnalytics);

export default visionPatternRoute;