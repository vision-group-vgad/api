import express from "express";
import { slaOverview, slaByPriority, slaByAgent } from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Ticket SLA
 *     description: ICT Support SLA compliance analytics
 */

/**
 * @swagger
 * /api/v1/IT/sla/overview:
 *   get:
 *     tags: [Ticket SLA]
 *     summary: Get overall SLA compliance
 *     responses:
 *       200:
 *         description: SLA compliance stats
 */
router.get("/overview", slaOverview);

/**
 * @swagger
 * /api/v1/IT/sla/by-priority:
 *   get:
 *     tags: [Ticket SLA]
 *     summary: SLA compliance grouped by priority
 *     responses:
 *       200:
 *         description: SLA compliance by priority
 */
router.get("/by-priority", slaByPriority);

/**
 * @swagger
 * /api/v1/IT/sla/by-agent:
 *   get:
 *     tags: [Ticket SLA]
 *     summary: SLA compliance grouped by agent
 *     responses:
 *       200:
 *         description: SLA compliance by agent
 */
router.get("/by-agent", slaByAgent);

export default router;
