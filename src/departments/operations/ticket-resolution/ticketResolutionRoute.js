import express from "express";
import { getTicketResolution } from "./ticketResolutionController.js";
import Jwt from "../../../auth/jwt.js";

const ticketResolutionRoute = express.Router();

/**
 * @swagger
 * /api/v1/operations/ticket-resolution:
 *   get:
 *     summary: Get average maintenance ticket resolution times
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: technicianName
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Alice Johnson, Bob Smith, Charlie Lee, Diana Garcia, Ethan Patel]
 *         description: Filter by technician name (comma separated for multiple)
 *       - in: query
 *         name: ticketType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Electrical, HVAC, Plumbing, IT Support, General Maintenance]
 *         description: Filter by ticket type (comma separated for multiple)
 *       - in: query
 *         name: priority
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High, Critical]
 *         description: Filter by ticket priority (comma separated for multiple)
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Resolved, In Progress, Open]
 *         description: Filter by ticket status (comma separated for multiple)
 *     responses:
 *       200:
 *         description: Ticket resolution data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTickets:
 *                   type: integer
 *                   description: Total number of tickets considered
 *                 technicianResolutionTrends:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         ticketType:
 *                           type: string
 *                         avgResolutionTime:
 *                           type: number
 *                           description: Average resolution time in hours
 *                         resolvedTickets:
 *                           type: integer
 *                           description: Number of resolved tickets in this group
 *                 data:
 *                   type: array
 *                   description: All filtered tickets including unresolved placeholders
 *                   items:
 *                     type: object
 *                     properties:
 *                       ticketId:
 *                         type: string
 *                       technicianId:
 *                         type: string
 *                       technicianName:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                       resolvedAt:
 *                         type: string
 *                       resolutionTime:
 *                         type: string
 *                       ticketType:
 *                         type: string
 *                       priority:
 *                         type: string
 *                       status:
 *                         type: string
 *       500:
 *         description: Server error
 */
ticketResolutionRoute.get("/",  getTicketResolution);

export default ticketResolutionRoute;
