import express from "express";
import { getPartsUtilization } from "./partsUtilizationController.js";

const partsUtilizationRoute = express.Router();

/**
 * @swagger
 * /api/v1/operations/parts-utilization:
 *   get:
 *     summary: Get parts consumption aggregated by equipment type, job type, and part usage
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: partName
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Compressor Coil, Fan Belt, Circuit Board, Pipe Connector, Sensor Module]
 *         description: Filter by part name (comma separated)
 *       - in: query
 *         name: equipmentType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [HVAC, Elevator, Generator, Plumbing, IT Rack]
 *         description: Filter by equipment type
 *       - in: query
 *         name: jobType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Repair, Routine Maintenance, Emergency Fix, Inspection]
 *         description: Filter by job type
 *     responses:
 *       200:
 *         description: Parts utilization data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRecords:
 *                   type: integer
 *                 utilizationTrends:
 *                   type: object
 *                   properties:
 *                     byEquipmentType:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           partId: { type: string }
 *                           partName: { type: string }
 *                           equipmentType: { type: string }
 *                           totalQuantity: { type: integer }
 *                     byJobType:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           partId: { type: string }
 *                           partName: { type: string }
 *                           jobType: { type: string }
 *                           totalQuantity: { type: integer }
 *                     byParts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           partId: { type: string }
 *                           partName: { type: string }
 *                           totalQuantity: { type: integer }
 *                 data:
 *                   type: array
 *       500:
 *         description: Server error
 */
partsUtilizationRoute.get("/",getPartsUtilization);
 
export default partsUtilizationRoute;
