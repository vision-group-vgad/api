import express from "express";
import { getSystemHealth } from "./service.js";
import Jwt from "../../../auth/jwt.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/system-health:
 *   get:
 *     summary: Get system health
 *     description: Returns the health status of all systems or a specific system if filtered by query.
 *     tags:
 *       - System Health
 *     parameters:
 *       - in: query
 *         name: system
 *         schema:
 *           type: string
 *         description: Name of the system to filter (e.g., Email, ERP)
 *     responses:
 *       200:
 *         description: System health information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSystems:
 *                   type: integer
 *                 operationalSystems:
 *                   type: integer
 *                 offlineSystems:
 *                   type: integer
 *                 healthPercentage:
 *                   type: number
 *                 lastUpdated:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: System not found
 */

router.get("/", Jwt.verifyToken, getSystemHealth);

export default router;
