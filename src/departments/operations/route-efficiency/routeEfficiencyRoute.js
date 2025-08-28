import express from "express";
import { getRouteEfficiency } from "./routeEfficiencyController.js";
import Jwt from "../../../auth/jwt.js";

const routeEfficiencyRoute = express.Router();

/**
 * @swagger
 * /api/v1/operations/route-efficiency:
 *   get:
 *     summary: Get planned vs actual route efficiency metrics
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: driverName
 *         required: false
 *         schema:
 *           type: string
 *           enum: [John Miller, Sophia Lopez, Michael Brown, Emily Davis, James Wilson]
 *         description: Filter by driver name (comma separated)
 *       - in: query
 *         name: vehicle
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Truck A, Van B, Truck C, Bike D]
 *         description: Filter by vehicle
 *       - in: query
 *         name: region
 *         required: false
 *         schema:
 *           type: string
 *           enum: [North, South, East, West]
 *         description: Filter by region
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
 *         description: Route efficiency data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalRoutes:
 *                       type: integer
 *                     avgPlannedDistance:
 *                       type: number
 *                     avgActualDistance:
 *                       type: number
 *                     avgDeviationPercent:
 *                       type: number
 *                     totalMissedWaypoints:
 *                       type: integer
 *                     totalSkippedWaypoints:
 *                       type: integer
 *                     totalCompletedRoutes:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
routeEfficiencyRoute.get("/",  getRouteEfficiency);

export default routeEfficiencyRoute;
