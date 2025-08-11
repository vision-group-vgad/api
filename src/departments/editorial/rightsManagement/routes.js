import express from "express";
import { getRightsData } from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/editorial/rights-management:
 *   get:
 *     summary: Get rights and licensing status of visual assets
 *     description: Tracks license terms, expiration dates, source attribution, and usage violations for 3rd-party or stock assets.
 *     tags:
 *       - Rights Management
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [valid, expired, warning, violation]
 *         description: Optional filter by license status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [photo, video]
 *         description: Optional filter by asset type
 *     responses:
 *       200:
 *         description: Rights management data
 *       500:
 *         description: Internal server error
 */
router.get("/", getRightsData);

export default router;
