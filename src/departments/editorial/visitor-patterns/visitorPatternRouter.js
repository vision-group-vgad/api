import express from "express";
import { getVisitorAnalytics } from "./visitorPatternController.js";
import Jwt from "../../../auth/jwt.js";

const visitorPatternRoute = express.Router();

/**
 * @swagger
 * /api/v1/editorial/visitor-patterns:
 *   get:
 *     summary: Get visitor analytics including wait times, grouped by day, hour, month, visitor type, and department
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
 *                 filters:
 *                   type: object
 *                   properties:
 *                     department:
 *                       type: string
 *                       nullable: true
 *                     visitorType:
 *                       type: string
 *                       nullable: true
 *                 peakHours:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       hour:
 *                         type: integer
 *                       visits:
 *                         type: integer
 *                 peakDays:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: string
 *                       visits:
 *                         type: integer
 *                 departmentVisitTypeStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       department:
 *                         type: string
 *                       visitTypes:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             type:
 *                               type: string
 *                             count:
 *                               type: integer
 *                 avgWaitTimePerDay:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       averageWaitTime:
 *                         type: string
 *                 avgWaitTimePerHour:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       hour:
 *                         type: string
 *                       averageWaitTime:
 *                         type: string
 *                 avgWaitTimePerMonth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       averageWaitTime:
 *                         type: string
 *                 excessiveWaitThreshold:
 *                   type: integer
 *                 excessiveWaitCount:
 *                   type: integer
 *                 excessiveWaitPercentage:
 *                   type: integer
 *                 visitors:
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
 *                       Wait_Time:
 *                         type: integer
 *       500:
 *         description: Server error
 */
visitorPatternRoute.get("/", getVisitorAnalytics);

export default visitorPatternRoute;