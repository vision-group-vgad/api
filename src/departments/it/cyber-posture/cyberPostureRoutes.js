import express from "express";
import CyberPostureController from "./cyberPostureController.js";

const router = express.Router();
const cyberPostureController = new CyberPostureController();

/**
 * @swagger
 * tags:
 *   name: Cybersecurity
 *   description: Cybersecurity posture metrics
 */

/**
 * @swagger
 * /api/v1/cyber-posture:
 *   get:
 *     summary: Get cybersecurity posture scores
 *     description: Returns posture scores for each cybersecurity domain (Network, Endpoint, etc.)
 *     tags:
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cybersecurity posture data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: Network
 *                       value:
 *                         type: integer
 *                         example: 80
 *                 benchmark:
 *                   type: integer
 *                   example: 56
 *                 message:
 *                   type: string
 *                   example: Cybersecurity posture retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error retrieving posture data
 */
router.get("/", (req, res) =>
  cyberPostureController.getCyberPosture(req, res)
);

export default router;
