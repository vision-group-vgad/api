import express from "express";
import { getSetupTimeOptimization } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SetupTimeOptimization
 *   description: Setup time optimization for printing supervisors
 */

/**
 * @swagger
 * /ap1/v1/operations/setup-time:
 *   get:
 *     summary: Get setup time records with calculated durations
 *     tags: [SetupTimeOptimization]
 *     responses:
 *       200:
 *         description: List of setup time records with optimization details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   jobId:
 *                     type: string
 *                   machine:
 *                     type: string
 *                   operator:
 *                     type: string
 *                   service:
 *                     type: string
 *                   setupDate:
 *                     type: string
 *                     format: date
 *                   setupStartTime:
 *                     type: string
 *                     format: time
 *                   setupEndTime:
 *                     type: string
 *                     format: time
 *                   setupDurationMinutes:
 *                     type: number
 */
router.get("/", (req, res) => {
  const data = getSetupTimeOptimization();
  res.json({ success: true, data });
});

export default router;
