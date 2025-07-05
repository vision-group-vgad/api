import express from "express";
import { getStorageUtilization } from "./storageService.js";
import Jwt from "../../../auth/jwt.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Storage Utilization
 *   description: Storage utilization monitoring
 */

/**
 * @swagger
 * /api/v1/storageUtilization:
 *   get:
 *     summary: Get storage utilization data (used vs available)
 *     tags: [Storage Utilization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: label
 *         schema:
 *           type: string
 *         description: Filter by disk label (e.g. "Disk A")
 *     responses:
 *       200:
 *         description: Successfully retrieved storage utilization data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: "Disk A"
 *                       totalCapacity:
 *                         type: number
 *                         example: 1000
 *                       used:
 *                         type: number
 *                         example: 700
 *                       available:
 *                         type: number
 *                         example: 300
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

router.get("/", Jwt.verifyToken, (req, res) => {
  try {
    const { label } = req.query;
    const data = getStorageUtilization(label);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Storage utilization error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
