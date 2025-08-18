// src/departments/IT/infrastructure-costs/routes.js
import express from "express";
import { fetchInfrastructureCosts } from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Infrastructure Costs
 *     description: ICT infrastructure costs tracking
 */

/**
 * @swagger
 * /api/v1/IT/infrastructure-costs:
 *   get:
 *     summary: Get infrastructure costs
 *     tags: [Infrastructure Costs]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (e.g., Hardware, Cloud Services)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of infrastructure costs
 */
router.get("/", fetchInfrastructureCosts);

export default router;
